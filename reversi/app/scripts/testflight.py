"""TestFlight の内部テストを App Store Connect API で整える（ブラウザのサインインなしで）。
1) まるシマリバーシ（ascAppId）のビルドの処理状況を出す
2) 内部テストのグループ「家族」がなければ作る（すべてのビルドを配る）
3) チームのユーザー（App Store Connect に入れる人）を そのグループのテスターにする
結果は /tmp/out/testflight.txt へ。鍵は環境変数 ASC_P8 / ASC_KEY_ID / ASC_ISSUER_ID。"""
import os, time, json, sys, urllib.request, urllib.error
import jwt  # pyjwt

APP = os.environ.get("ASC_APP_ID", "6832225234")
key = open(os.environ["ASC_P8_PATH"]).read()
tok = jwt.encode({"iss": os.environ["ASC_ISSUER_ID"], "iat": int(time.time()), "exp": int(time.time()) + 1100, "aud": "appstoreconnect-v1"},
                 key, algorithm="ES256", headers={"kid": os.environ["ASC_KEY_ID"], "typ": "JWT"})
out = open("/tmp/out/testflight.txt", "w")
def log(*a):
    s = " ".join(str(x) for x in a); print(s); out.write(s + "\n"); out.flush()

def api(method, path, body=None):
    req = urllib.request.Request("https://api.appstoreconnect.apple.com" + path, method=method,
                                 data=json.dumps(body).encode() if body else None,
                                 headers={"Authorization": "Bearer " + tok, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as r:
            t = r.read(); return r.status, (json.loads(t) if t else {})
    except urllib.error.HTTPError as e:
        t = e.read(); 
        try: j = json.loads(t)
        except Exception: j = {"raw": t[:300].decode(errors="replace")}
        return e.code, j

# 1) ビルド
s, j = api("GET", f"/v1/builds?filter[app]={APP}&sort=-uploadedDate&limit=5&fields[builds]=version,processingState,uploadedDate,expired,usesNonExemptEncryption")
log("builds:", s)
for b in j.get("data", []):
    a = b["attributes"]; log("  build", a.get("version"), a.get("processingState"), a.get("uploadedDate"), "encryption:", a.get("usesNonExemptEncryption"))

# ビルドが見えないとき：アップロード側の状態も見る
if not j.get("data"):
    for path in [f"/v1/apps/{APP}/builds?limit=5", f"/v1/apps/{APP}/preReleaseVersions?limit=5", f"/v1/buildUploads/{os.environ.get('UPLOAD_ID','890adaaf-fce0-4a73-8851-e86672dc907f')}", f"/v1/buildUploads/{os.environ.get('UPLOAD_ID','890adaaf-fce0-4a73-8851-e86672dc907f')}/buildUploadFiles"]:
        s0, j0 = api("GET", path); log("check", path, s0, json.dumps(j0, ensure_ascii=False)[:3000])

# 2) 内部グループ
s, j = api("GET", f"/v1/betaGroups?filter[app]={APP}&limit=50")
groups = j.get("data", [])
grp = next((g for g in groups if g["attributes"].get("isInternalGroup")), None)
if not grp:
    s, j = api("POST", "/v1/betaGroups", {"data": {"type": "betaGroups", "attributes": {"name": "家族", "isInternalGroup": True, "hasAccessToAllBuilds": True},
                                                  "relationships": {"app": {"data": {"type": "apps", "id": APP}}}}})
    log("create group:", s, json.dumps(j)[:300]); grp = j.get("data")
else:
    log("group exists:", grp["attributes"]["name"])
if not grp: sys.exit(1)
gid = grp["id"]

# 3) チームのユーザーを テスターに
s, j = api("GET", "/v1/users?limit=50&fields[users]=firstName,lastName,username,roles")
log("users:", s, len(j.get("data", [])))
s2, j2 = api("GET", f"/v1/betaGroups/{gid}/betaTesters?limit=50")
have = {t["attributes"].get("email") for t in j2.get("data", [])}
for u in j.get("data", []):
    a = u["attributes"]; email = a.get("username")
    if not email or email in have:
        log("  already/skip:", a.get("firstName")); continue
    s3, j3 = api("POST", "/v1/betaTesters", {"data": {"type": "betaTesters", "attributes": {"email": email, "firstName": a.get("firstName") or "", "lastName": a.get("lastName") or ""},
                                                     "relationships": {"betaGroups": {"data": [{"type": "betaGroups", "id": gid}]}}}})
    log("  add tester", a.get("firstName"), a.get("roles"), "->", s3, ("" if s3 < 300 else json.dumps(j3)[:300]))
s2, j2 = api("GET", f"/v1/betaGroups/{gid}/betaTesters?limit=50")
log("testers in group:", len(j2.get("data", [])), [t["attributes"].get("firstName") for t in j2.get("data", [])])
