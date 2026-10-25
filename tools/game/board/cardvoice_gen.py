# カードの よみあげ用：ことば → 声の キー の さくいん（2026-10-25）
import json, re, pathlib
G = pathlib.Path(__file__).resolve().parents[1]; R = G.parents[1]
norm = lambda t: re.sub(r"[^ぁ-んァ-ヶ一-龯々0-9A-Za-z]", "", t)
idx = {}
def add(t, k, pri):
    n = norm(t)
    if not n or len(n) > 18: return
    if n not in idx or pri < idx[n][1]: idx[n] = (k, pri)
for p in sorted((G / "sit").glob("pony_*.json")):
    try:
        for e in json.loads(p.read_text()): add(e[1], e[0], 0)
    except Exception: pass
for p in sorted((R / "tools/aivis/jobs").glob("*/lines.json")):
    try:
        for e in json.loads(p.read_text()): add(e["text"], e["key"], 1)
    except Exception: pass
have = {p.stem for d in ["board/audio", "stage_audio", "sit/audio"] for p in (G / d).glob("*.mp3")}
out = {n: k for n, (k, _) in idx.items() if k in have}
(G / "board/cardvoice_data.js").write_text("const CARDV = " + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n")
print(len(out))
