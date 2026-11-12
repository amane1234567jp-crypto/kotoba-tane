"""App Store の掲載情報を App Store Connect API で入れる（まるシマリバーシ）。
使い方：MODE=inspect（いまの状態を出すだけ）／apply（掲載情報・価格・配信地域・スクショ・ビルドを入れる）／submit（審査に出す）
中身は reversi/app/store/listing.json と store/*.png。結果は /tmp/out/asc.txt。
鍵は環境変数 ASC_P8_PATH / ASC_KEY_ID / ASC_ISSUER_ID。"""
import os, time, json, sys, hashlib, urllib.request, urllib.error, glob
import jwt

APP = os.environ.get("ASC_APP_ID", "6832225234")
MODE = os.environ.get("MODE", "inspect")
HERE = os.path.dirname(os.path.abspath(__file__))
STORE = os.path.join(HERE, "..", "store")
L = json.load(open(os.path.join(STORE, "listing.json")))
key = open(os.environ["ASC_P8_PATH"]).read()
def token():
    return jwt.encode({"iss": os.environ["ASC_ISSUER_ID"], "iat": int(time.time()), "exp": int(time.time()) + 1100, "aud": "appstoreconnect-v1"},
                      key, algorithm="ES256", headers={"kid": os.environ["ASC_KEY_ID"], "typ": "JWT"})
TOK = token()
os.makedirs("/tmp/out", exist_ok=True)
out = open("/tmp/out/asc.txt", "a")
def log(*a):
    s = " ".join(str(x) for x in a); print(s); out.write(s + "\n"); out.flush()

def api(method, path, body=None, raw=None, headers=None, full=False):
    url = path if path.startswith("http") else "https://api.appstoreconnect.apple.com" + path
    h = {"Authorization": "Bearer " + TOK, "Content-Type": "application/json"} if not full else (headers or {})
    req = urllib.request.Request(url, method=method, data=raw if raw is not None else (json.dumps(body).encode() if body is not None else None), headers=h)
    try:
        with urllib.request.urlopen(req) as r:
            t = r.read(); return r.status, (json.loads(t) if t and not full else {})
    except urllib.error.HTTPError as e:
        t = e.read()
        try: j = json.loads(t)
        except Exception: j = {"raw": t[:300].decode(errors="replace")}
        return e.code, j
def short(j, n=600): return json.dumps(j, ensure_ascii=False)[:n]
def err(s, j): return "" if s < 300 else " ERR " + short(j, 900)

# ---------- いまの状態 ----------
s, app = api("GET", f"/v1/apps/{APP}?fields[apps]=name,bundleId,primaryLocale,contentRightsDeclaration")
log("app:", s, short(app.get("data", {}).get("attributes", {})))
s, infos = api("GET", f"/v1/apps/{APP}/appInfos?include=primaryCategory,ageRatingDeclaration")
info = next((i for i in infos.get("data", []) if i["attributes"].get("appStoreState") not in ("READY_FOR_SALE", "REPLACED_WITH_NEW_VERSION")), infos.get("data", [{}])[0])
log("appInfo:", info.get("id"), short(info.get("attributes")))
s, vers = api("GET", f"/v1/apps/{APP}/appStoreVersions?filter[platform]=IOS&limit=5")
ver = next((v for v in vers.get("data", []) if v["attributes"]["appStoreState"] in ("PREPARE_FOR_SUBMISSION", "DEVELOPER_REJECTED", "REJECTED", "METADATA_REJECTED", "WAITING_FOR_REVIEW", "IN_REVIEW", "PENDING_DEVELOPER_RELEASE")), None)
for v in vers.get("data", []): log("version:", v["id"], short(v["attributes"], 300))
s, builds = api("GET", f"/v1/builds?filter[app]={APP}&sort=-uploadedDate&limit=5&include=preReleaseVersion")
pre = {p["id"]: p["attributes"]["version"] for p in builds.get("included", [])}
for b in builds.get("data", []):
    a = b["attributes"]; log("build:", b["id"], pre.get(b["relationships"]["preReleaseVersion"]["data"]["id"]), a["version"], a["processingState"])

if MODE == "inspect":
    if ver:
        s, j = api("GET", f"/v1/appStoreVersions/{ver['id']}/appStoreVersionLocalizations"); log("ver locs:", short(j, 1500))
    s, j = api("GET", f"/v1/appInfos/{info['id']}/appInfoLocalizations"); log("info locs:", short(j, 1200))
    s, j = api("GET", f"/v1/appInfos/{info['id']}/ageRatingDeclaration"); log("age:", s, short(j, 1500))
    s, j = api("GET", f"/v1/apps/{APP}/appPriceSchedule"); log("price:", s, short(j, 400))
    s, j = api("GET", f"/v1/apps/{APP}/appAvailabilityV2"); log("avail:", s, short(j, 400))
    sys.exit(0)

def upsert_loc(list_path, create_type, rel_name, rel_type, rel_id, attrs):
    s, j = api("GET", list_path)
    loc = next((x for x in j.get("data", []) if x["attributes"]["locale"] == L["locale"]), None)
    if loc:
        s, j = api("PATCH", f"/v1/{create_type}/{loc['id']}", {"data": {"type": create_type, "id": loc["id"], "attributes": attrs}})
        log("patch", create_type, s, err(s, j)); return loc["id"]
    s, j = api("POST", f"/v1/{create_type}", {"data": {"type": create_type, "attributes": dict(attrs, locale=L["locale"]),
                                                      "relationships": {rel_name: {"data": {"type": rel_type, "id": rel_id}}}}})
    log("create", create_type, s, err(s, j)); return j.get("data", {}).get("id")

if MODE == "apply":
    # 1) 権利の申告（第三者のコンテンツは使っていない）
    s, j = api("PATCH", f"/v1/apps/{APP}", {"data": {"type": "apps", "id": APP, "attributes": {"contentRightsDeclaration": "DOES_NOT_USE_THIRD_PARTY_CONTENT"}}})
    log("content rights:", s, err(s, j))
    # 2) アプリ情報：名前・サブタイトル・プライバシーポリシー
    upsert_loc(f"/v1/appInfos/{info['id']}/appInfoLocalizations", "appInfoLocalizations", "appInfo", "appInfos", info["id"],
               {"name": L["name"], "subtitle": L["subtitle"], "privacyPolicyUrl": L["privacyPolicyUrl"]})
    # 3) カテゴリ：ゲーム（ボード・ファミリー）
    s, j = api("PATCH", f"/v1/appInfos/{info['id']}", {"data": {"type": "appInfos", "id": info["id"], "relationships": {
        "primaryCategory": {"data": {"type": "appCategories", "id": "GAMES"}},
        "primarySubcategoryOne": {"data": {"type": "appCategories", "id": "GAMES_BOARD"}},
        "primarySubcategoryTwo": {"data": {"type": "appCategories", "id": "GAMES_FAMILY"}}}}})
    log("category:", s, err(s, j))
    # 4) 年齢制限の申告：暴力などは「なし」。ビデオ通話（招待した相手とだけ）があるので messagingAndChat は true
    s, j = api("GET", f"/v1/appInfos/{info['id']}/ageRatingDeclaration")
    age = j.get("data", {})
    FREQ = ["alcoholTobaccoOrDrugUseOrReferences", "contests", "gamblingSimulated", "gunsOrOtherWeapons", "medicalOrTreatmentInformation", "profanityOrCrudeHumor",
            "sexualContentGraphicAndNudity", "sexualContentOrNudity", "horrorOrFearThemes", "matureOrSuggestiveThemes", "violenceCartoonOrFantasy",
            "violenceRealisticProlongedGraphicOrSadistic", "violenceRealistic"]
    BOOL = ["advertising", "ageAssurance", "gambling", "healthOrWellnessTopics", "lootBox", "parentalControls", "unrestrictedWebAccess", "userGeneratedContent"]
    have_keys = set((age.get("attributes") or {}).keys())
    attrs = {k: "NONE" for k in FREQ if k in have_keys}
    attrs.update({k: False for k in BOOL if k in have_keys})
    if "messagingAndChat" in have_keys: attrs["messagingAndChat"] = True
    log("age attrs to set:", short(attrs, 1500))
    if age:
        s, j = api("PATCH", f"/v1/ageRatingDeclarations/{age['id']}", {"data": {"type": "ageRatingDeclarations", "id": age["id"], "attributes": attrs}})
        log("age rating:", s, err(s, j))
    # 5) 価格：無料（基準は日本）
    s, j = api("GET", f"/v1/apps/{APP}/appPricePoints?filter[territory]=JPN&limit=5")
    free = next((p for p in j.get("data", []) if float(p["attributes"]["customerPrice"]) == 0), None)
    log("free price point:", free and free["id"])
    if free:
        s, j = api("POST", "/v1/appPriceSchedules", {"data": {"type": "appPriceSchedules", "relationships": {
            "app": {"data": {"type": "apps", "id": APP}},
            "baseTerritory": {"data": {"type": "territories", "id": "JPN"}},
            "manualPrices": {"data": [{"type": "appPrices", "id": "${p1}"}]}}},
            "included": [{"type": "appPrices", "id": "${p1}", "attributes": {"startDate": None},
                          "relationships": {"appPricePoint": {"data": {"type": "appPricePoints", "id": free["id"]}}}}]})
        log("price schedule:", s, err(s, j))
    # 6) 配信地域：日本だけ（新しい地域には自動で広げない）
    s, j = api("POST", "/v2/appAvailabilities", {"data": {"type": "appAvailabilities", "attributes": {"availableInNewTerritories": False},
        "relationships": {"app": {"data": {"type": "apps", "id": APP}},
                          "territoryAvailabilities": {"data": [{"type": "territoryAvailabilities", "id": "${jpn}"}]}}},
        "included": [{"type": "territoryAvailabilities", "id": "${jpn}", "attributes": {"available": True},
                      "relationships": {"territory": {"data": {"type": "territories", "id": "JPN"}}}}]})
    log("availability:", s, err(s, j))
    # 7) 版：1.0.0・著作権・手動リリース
    if not ver:
        s, j = api("POST", "/v1/appStoreVersions", {"data": {"type": "appStoreVersions", "attributes": {"platform": "IOS", "versionString": L["versionString"]},
                                                           "relationships": {"app": {"data": {"type": "apps", "id": APP}}}}})
        log("create version:", s, err(s, j)); ver = j.get("data")
    s, j = api("PATCH", f"/v1/appStoreVersions/{ver['id']}", {"data": {"type": "appStoreVersions", "id": ver["id"], "attributes": {
        "versionString": L["versionString"], "copyright": L["copyright"], "releaseType": "MANUAL"}}})
    log("version attrs:", s, err(s, j))
    vloc = upsert_loc(f"/v1/appStoreVersions/{ver['id']}/appStoreVersionLocalizations", "appStoreVersionLocalizations", "appStoreVersion", "appStoreVersions", ver["id"],
                      {"description": L["description"], "keywords": L["keywords"], "supportUrl": L["supportUrl"], "promotionalText": L["promotionalText"]})
    # 8) 審査への連絡先とメモ
    rv = {"contactFirstName": os.environ.get("RV_FIRST", ""), "contactLastName": os.environ.get("RV_LAST", ""), "contactPhone": os.environ.get("RV_PHONE", ""),
          "contactEmail": os.environ.get("RV_EMAIL", ""), "demoAccountRequired": False, "notes": L["reviewNotes"]}
    rv = {k: v for k, v in rv.items() if v != ""}
    s, j = api("GET", f"/v1/appStoreVersions/{ver['id']}/appStoreReviewDetail")
    if j.get("data"):
        rid = j["data"]["id"]; s, j = api("PATCH", f"/v1/appStoreReviewDetails/{rid}", {"data": {"type": "appStoreReviewDetails", "id": rid, "attributes": rv}})
    else:
        s, j = api("POST", "/v1/appStoreReviewDetails", {"data": {"type": "appStoreReviewDetails", "attributes": rv, "relationships": {"appStoreVersion": {"data": {"type": "appStoreVersions", "id": ver["id"]}}}}})
    log("review detail:", s, err(s, j))
    # 9) スクリーンショット（同じ種類の既存分は消して入れなおす）
    sets = {"APP_IPHONE_67": sorted(glob.glob(os.path.join(STORE, "iphone69-*.png"))), "APP_IPAD_PRO_3GEN_129": sorted(glob.glob(os.path.join(STORE, "ipad13-*.png")))}
    s, j = api("GET", f"/v1/appStoreVersionLocalizations/{vloc}/appScreenshotSets?include=appScreenshots")
    have = {x["attributes"]["screenshotDisplayType"]: x for x in j.get("data", [])}
    for dt, files in sets.items():
        if dt in have:
            sid = have[dt]["id"]
            s, jj = api("GET", f"/v1/appScreenshotSets/{sid}/appScreenshots")
            for sc in jj.get("data", []): api("DELETE", f"/v1/appScreenshots/{sc['id']}")
        else:
            s, jj = api("POST", "/v1/appScreenshotSets", {"data": {"type": "appScreenshotSets", "attributes": {"screenshotDisplayType": dt},
                                                                  "relationships": {"appStoreVersionLocalization": {"data": {"type": "appStoreVersionLocalizations", "id": vloc}}}}})
            log("create set", dt, s, err(s, jj)); sid = jj["data"]["id"]
        for f in files:
            data = open(f, "rb").read()
            s, jj = api("POST", "/v1/appScreenshots", {"data": {"type": "appScreenshots", "attributes": {"fileName": os.path.basename(f), "fileSize": len(data)},
                                                              "relationships": {"appScreenshotSet": {"data": {"type": "appScreenshotSets", "id": sid}}}}})
            if s >= 300: log("reserve", f, s, err(s, jj)); continue
            sc = jj["data"]
            for op in sc["attributes"]["uploadOperations"]:
                part = data[op["offset"]: op["offset"] + op["length"]]
                hs = {h["name"]: h["value"] for h in op.get("requestHeaders", [])}
                s2, _ = api(op["method"], op["url"], raw=part, headers=hs, full=True)
            s, jj = api("PATCH", f"/v1/appScreenshots/{sc['id']}", {"data": {"type": "appScreenshots", "id": sc["id"], "attributes": {"uploaded": True, "sourceFileChecksum": hashlib.md5(data).hexdigest()}}})
            log("screenshot", dt, os.path.basename(f), s, err(s, jj))
    # 10) ビルドをつなぐ（1.0.0 の処理ずみで いちばん新しいもの）
    cand = [b for b in builds.get("data", []) if pre.get(b["relationships"]["preReleaseVersion"]["data"]["id"]) == L["versionString"] and b["attributes"]["processingState"] == "VALID"]
    if cand:
        s, j = api("PATCH", f"/v1/appStoreVersions/{ver['id']}/relationships/build", {"data": {"type": "builds", "id": cand[0]["id"]}})
        log("attach build:", cand[0]["attributes"]["version"], s, err(s, j))
    else:
        log("attach build: 1.0.0 の処理ずみビルドが まだない")

if MODE == "submit":
    s, j = api("POST", "/v1/reviewSubmissions", {"data": {"type": "reviewSubmissions", "attributes": {"platform": "IOS"}, "relationships": {"app": {"data": {"type": "apps", "id": APP}}}}})
    log("review submission:", s, err(s, j))
    sub = j.get("data")
    if not sub:
        s, j = api("GET", f"/v1/reviewSubmissions?filter[app]={APP}&filter[state]=READY_FOR_REVIEW"); sub = (j.get("data") or [None])[0]
    s, j = api("POST", "/v1/reviewSubmissionItems", {"data": {"type": "reviewSubmissionItems", "relationships": {
        "reviewSubmission": {"data": {"type": "reviewSubmissions", "id": sub["id"]}}, "appStoreVersion": {"data": {"type": "appStoreVersions", "id": ver["id"]}}}}})
    log("item:", s, err(s, j))
    s, j = api("PATCH", f"/v1/reviewSubmissions/{sub['id']}", {"data": {"type": "reviewSubmissions", "id": sub["id"], "attributes": {"submitted": True}}})
    log("submitted:", s, err(s, j))

if MODE == "fix":
    # 年齢制限（socialMedia も要る）と、配信地域（全地域を並べて 日本だけ true）
    s, j = api("GET", f"/v1/appInfos/{info['id']}/ageRatingDeclaration")
    age = j.get("data", {}); have_keys = set((age.get("attributes") or {}).keys())
    FREQ = ["alcoholTobaccoOrDrugUseOrReferences", "contests", "gamblingSimulated", "gunsOrOtherWeapons", "medicalOrTreatmentInformation", "profanityOrCrudeHumor",
            "sexualContentGraphicAndNudity", "sexualContentOrNudity", "horrorOrFearThemes", "matureOrSuggestiveThemes", "violenceCartoonOrFantasy",
            "violenceRealisticProlongedGraphicOrSadistic", "violenceRealistic"]
    BOOL = ["advertising", "ageAssurance", "gambling", "healthOrWellnessTopics", "lootBox", "parentalControls", "unrestrictedWebAccess", "userGeneratedContent", "socialMedia"]
    attrs = {k: "NONE" for k in FREQ if k in have_keys}
    attrs.update({k: False for k in BOOL if k in have_keys})
    attrs["messagingAndChat"] = True
    s, j = api("PATCH", f"/v1/ageRatingDeclarations/{age['id']}", {"data": {"type": "ageRatingDeclarations", "id": age["id"], "attributes": attrs}})
    log("age rating:", s, err(s, j))
    s, j = api("GET", f"/v1/appInfos/{info['id']}?fields[appInfos]=appStoreAgeRating"); log("age result:", short(j.get("data", {}).get("attributes")))
    terr = []; nxt = "/v1/territories?limit=200"
    while nxt:
        s, j = api("GET", nxt); terr += [t["id"] for t in j.get("data", [])]; nxt = j.get("links", {}).get("next")
    log("territories:", len(terr))
    inc = [{"type": "territoryAvailabilities", "id": "${t%s}" % t, "attributes": {"available": t == "JPN"},
            "relationships": {"territory": {"data": {"type": "territories", "id": t}}}} for t in terr]
    s, j = api("POST", "/v2/appAvailabilities", {"data": {"type": "appAvailabilities", "attributes": {"availableInNewTerritories": False},
        "relationships": {"app": {"data": {"type": "apps", "id": APP}}, "territoryAvailabilities": {"data": [{"type": "territoryAvailabilities", "id": x["id"]} for x in inc]}}},
        "included": inc})
    log("availability:", s, err(s, j))

if MODE == "text":
    # 説明文・キーワードなど 文字だけ入れなおす（スクショは触らない）
    upsert_loc(f"/v1/appStoreVersions/{ver['id']}/appStoreVersionLocalizations", "appStoreVersionLocalizations", "appStoreVersion", "appStoreVersions", ver["id"],
               {"description": L["description"], "keywords": L["keywords"], "supportUrl": L["supportUrl"], "promotionalText": L["promotionalText"]})
    upsert_loc(f"/v1/appInfos/{info['id']}/appInfoLocalizations", "appInfoLocalizations", "appInfo", "appInfos", info["id"],
               {"name": L["name"], "subtitle": L["subtitle"], "privacyPolicyUrl": L["privacyPolicyUrl"]})
