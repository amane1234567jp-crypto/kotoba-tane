"""2026-10-25 ライバルの いいまちがいを ふやす（ゆうべの 提案 5）。
いいまちがいの ない 段（1〜4だん）に、助詞の まちがい（を↔が、に→を）を 1つ 入れる。
実行の じゅん: … → sits_new9.py → sits_fix4.py → sits_fix5.py（何回 実行しても よい。手で 書いた wrong は かえない）
あわせて Aivis の ジョブ（tools/aivis/jobs/sx5）を つくる。"""
import json, re, glob, collections
from pathlib import Path
G = Path(__file__).resolve().parent; A = G.parents[2] / "tools/aivis/jobs"
EXC = ("ように", "ために", "さきに", "いっしょに", "すぐに", "ほんとうに", "きゅうに", "じょうずに", "しずかに", "げんきに", "きれいに", "かわりに",
       "すきに", "みたいに", "ほかに", "とくに", "さいごに", "はじめに", "つぎに", "まえに", "あとに", "そとに", "なかに", "うえに", "したに", "ちゅうに", "なんかいも",
       "だが", "けれど", "ながら", "しずかに", "いいのに", "なのに", "のに", "すこしに")
SW = {"を": "が", "が": "を", "に": "を"}
def mk(a):
    toks = re.split(r"(\s+|、|。|！|？|「|」)", a)
    for p in ["を", "が", "に"]:
        for i, t in enumerate(toks):
            if len(t) >= 2 and t.endswith(p) and re.fullmatch(r"[ぁ-んァ-ヶー一-龯0-9]+", t) and not t.endswith(EXC) and not (p == "に" and len(t) < 3):
                k = sum(x.count(p) for x in toks[:i]) + t.count(p)  # なんこめの p か
                toks2 = toks[:]; toks2[i] = t[:-1] + SW[p]; return "".join(toks2), p, k
    return None
def kanji_swap(y, a, p, k):
    if not y or y.count(p) != a.count(p): return None
    idx = [m.start() for m in re.finditer(p, y)]
    if len(idx) < k: return None
    j = idx[k - 1]; return y[:j] + SW[p] + y[j + 1:]
S = json.loads((G / "sits.json").read_text())
who, yomi = {}, {}
for f in sorted(glob.glob(str(A / "*/lines.json"))):
    if "/sx5/" in f: continue
    for l in json.loads(Path(f).read_text()):
        m = re.match(r"(sg|sx)_(.+)_(\d)$", l["key"])
        if m: who.setdefault(m.group(2), collections.Counter())[l["who"]] += 1
    yp = Path(f).with_name("yomi.json")
    if yp.exists(): yomi.update(json.loads(yp.read_text()))
stw = collections.defaultdict(collections.Counter)
for s in S:
    if s["id"] in who: stw[s.get("stage")][who[s["id"]].most_common(1)[0][0]] += 1
lines, ym, n = [], {}, 0
for s in S:
    if s.get("gaoOk") is False or s.get("stage") == "ltomo": continue
    w0 = who[s["id"]].most_common(1)[0][0] if s["id"] in who else (stw[s.get("stage")].most_common(1) or [[None]])[0][0]
    if not w0: continue
    for i, t in enumerate(s["tiers"]):
        if i == 0 or i > 4: continue
        if t.get("wrong") and not t.get("auto"): continue
        r = mk(t["a"])
        if not r: continue
        w, p, k = r; t["wrong"] = w; t["auto"] = 1; n += 1
        key = f"sx_{s['id']}_{i}"; lines.append({"key": key, "who": w0, "text": w})
        yy = kanji_swap(yomi.get(f"sg_{s['id']}_{i}") or t.get("y"), t["a"], p, k)
        if yy: ym[key] = yy; t["wy"] = yy
(G / "sits.json").write_text(json.dumps(S, ensure_ascii=False, indent=1))
J = A / "sx5"; J.mkdir(exist_ok=True)
(J / "lines.json").write_text(json.dumps(lines, ensure_ascii=False, indent=1)); (J / "yomi.json").write_text(json.dumps(ym, ensure_ascii=False, indent=1)); (J / "acc.json").write_text("{}")
print(n, "auto wrongs;", len(ym), "with kanji yomi")
