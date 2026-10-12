"""合成せずに、いま使っている全セリフの 読み・アクセントだけを 出す（再チェック用）: python3 check.py OUT"""
import json, sys, urllib.request, urllib.parse
from pathlib import Path
OUT = Path(sys.argv[1]); E = "http://127.0.0.1:10101"
cast = json.loads(Path("cast.json").read_text()); items = json.loads(Path("jobs/check/check.json").read_text())
def call(method, path, data=None, ctype=None):
    req = urllib.request.Request(E + path, data=data, method=method)
    if ctype: req.add_header("Content-Type", ctype)
    with urllib.request.urlopen(req, timeout=600) as r: return r.read()
installed = json.loads(call("GET", "/aivm_models"))
for who, c in cast["chars"].items():
    if c["model"] in installed: continue
    url = f"https://api.aivis-project.com/v1/aivm-models/{c['model']}/download?model_type=AIVMX"
    try: call("POST", "/aivm_models/install", urllib.parse.urlencode({"url": url}).encode(), "application/x-www-form-urlencoded")
    except Exception as e: print("install fail", who, e)
    installed = json.loads(call("GET", "/aivm_models"))
def style_id(model, style):
    sts = [st for ls in installed.get(model, {}).get("speakers", []) for st in ls["speaker"]["styles"]]
    for st in sts:
        if st["name"] == style: return st["id"], style
    return (sts[0]["id"], sts[0]["name"] + "(fallback)") if sts else (None, None)
def reshape(aps, spec):
    moras = [m for ap in aps for m in ap["moras"]]
    if "".join(m["text"] for m in moras) != "".join(t for t, _ in spec): return aps, "MISMATCH"
    out, i = [], 0
    for t, a in spec:
        grp, acc = [], ""
        while acc != t: grp.append(moras[i]); acc += moras[i]["text"]; i += 1
        out.append({"moras": grp, "accent": a})
    return out, "acc"
rep = []
for it in items:
    c = dict(cast["chars"][it["who"]]); c.update(cast["lines"].get(it["key"], {}))
    sid, sname = style_id(c["model"], c["style"])
    try:
        q = json.loads(call("POST", "/audio_query?" + urllib.parse.urlencode({"text": it["yomi"], "speaker": sid})))
        aps, how = (reshape(q["accent_phrases"], it["acc"]) if it.get("acc") else (q["accent_phrases"], "auto"))
        rep.append({**it, "style": sname, "how": how, "res": " / ".join("".join(m["text"] for m in ap["moras"]) + f"[{ap['accent']}]" for ap in aps)})
    except Exception as e: rep.append({**it, "error": str(e)[:200]})
(OUT / "report_check.json").write_text(json.dumps(rep, ensure_ascii=False, indent=0))
print("checked", len(rep))
