"""AivisHub の API 定義と、声モデルの一覧(名前・説明・タグ・ライセンス・話者/スタイル)を保存する"""
import json, sys, urllib.request, urllib.parse
from pathlib import Path
OUT = Path(sys.argv[1]); OUT.mkdir(parents=True, exist_ok=True)
B = "https://api.aivis-project.com/v1"
def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "kotoba-tane/1.0", "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r: return json.loads(r.read())
api = None
for u in [B + "/openapi.json", "https://api.aivis-project.com/openapi.json"]:
    try: api = get(u); (OUT / "openapi.json").write_text(json.dumps(api, ensure_ascii=False, indent=1)); print("openapi from", u); break
    except Exception as e: print("openapi fail", u, e)
params = []
if api:
    for path, ops in api.get("paths", {}).items():
        if "search" in path and "aivm" in path:
            params = [p["name"] for p in ops.get("get", {}).get("parameters", [])]
            print("SEARCH", path, params)
models = {}
def take(res):
    items = res.get("aivm_models") or res.get("items") or res.get("results") or []
    for m in items: models[m["aivm_model_uuid"]] = m
    return len(items), res.get("total") or res.get("total_count")
for page in range(1, 30):
    q = {}
    if "limit" in params: q["limit"] = 30
    if "page" in params: q["page"] = page
    if "sort" in params: q["sort"] = "download"
    try:
        res = get(B + "/aivm-models/search?" + urllib.parse.urlencode(q))
    except Exception as e:
        print("search fail", q, e); break
    if page == 1: (OUT / "search_page1_raw.json").write_text(json.dumps(res, ensure_ascii=False, indent=1)[:200000])
    n, tot = take(res); print("page", page, n, tot)
    if n == 0 or "page" not in params: break
rows = []
for m in models.values():
    f = (m.get("model_files") or [{}])[0]
    rows.append({"uuid": m["aivm_model_uuid"], "name": m.get("name"), "user": (m.get("user") or {}).get("handle") or (m.get("user") or {}).get("name"),
                 "category": m.get("category"), "timbre": m.get("voice_timbre"), "tags": [t["name"] for t in m.get("tags", [])],
                 "license": f.get("license_type"), "creators": f.get("creators"), "dl": m.get("total_download_count"), "likes": m.get("like_count"),
                 "desc": (m.get("description") or "")[:300],
                 "speakers": [{"name": s["name"], "styles": [(st["name"], st["local_id"], [v.get("audio_url") for v in st.get("voice_samples", [])][:1]) for st in s.get("styles", [])]} for s in m.get("speakers", [])]})
rows.sort(key=lambda r: -(r["dl"] or 0))
(OUT / "models.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1))
print("models", len(rows))
