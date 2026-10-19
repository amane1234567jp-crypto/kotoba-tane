"""ショートコース 8つ（stages10.js）の ぽにーの 声の リスト → sit/pony_s10.json（python3 sit/pony_s10_gen.py）"""
import json, re
from pathlib import Path
G = Path(__file__).resolve().parents[1]
S = [s for s in json.loads((G / "sit/sits.json").read_text()) if s["stage"] in ("kirikae", "kikikaesu", "matsu", "sos", "junban", "kotowaru", "bousai", "denwa")]
JS = (G / "board/stages10.js").read_text()
NAMES = {"shima": "まるシマ", "pyon": "ぴょん", "mii": "みい", "chu": "ちゅう", "gao": "がお", "meebaa": "めえばあ"}
out = []
for s in S:
    for i, t in enumerate(s["tiers"]):
        out.append([f"sa_{s['id']}_{i}", t["a"].replace("〇〇", "まるシマ")])
        if "〇〇" in t["a"]:
            for kd, nm in NAMES.items(): out.append([f"sa_{s['id']}_{i}_{kd}", t["a"].replace("〇〇", nm)])
# speak(C.pony, "key", "text") の まま かいて ある もの
for k, t in re.findall(r'speak\(C\.pony, "([a-z0-9_]+)", "([^"]+)"\)', JS):
    if k.startswith(("mz_", "jbk_")): out.append([k, t])
for k, t in re.findall(r'\["(mz_lv)\$\{it\.lv\}"', JS): pass
lv = re.search(r'\["", ("[^\]]+)\]\[it\.lv\]', JS).group(1); lvs = re.findall(r'"([^"]+)"', lv)
for i, t in enumerate(lvs): out.append([f"mz_lv{i + 1}", t])
for m in re.finditer(r'\{ id: "(\w+)", e: "[^"]+", p: "([^"]+)", lv: \d, t: "([^"]+)"', JS):
    out += [[f"mz_{m.group(1)}_q", f"{m.group(2)}。どの こえが いいかな？"], [f"mz_{m.group(1)}_a", m.group(3)]]
for m in re.finditer(r'\{ id: "(\w+)", t: "([^"]+)", s: (\[\[.*?\]\]), k:', JS):
    st = json.loads(m.group(3)); out.append([f"jbk_{m.group(1)}_q", f"{m.group(2)}は、どんな じゅんばん？"])
    for n in (2, 3, 4): out.append([f"jbk_{m.group(1)}_{n}", "、".join(("まず " if i == 0 else "さいごに " if n > 2 and i == n - 1 else "つぎに " if i == 1 else "それから ") + l for i, (_, l) in enumerate(st[:n]))])
for st, b in re.findall(r'(\w+): \{ who: "\w+", sleep: false, intro: \["p_blk_\w+", "([^"]+)"\], say: \["blk_\w+", "([^"]+)"\]', JS) and [] or []: pass
for m in re.finditer(r'intro: \["(p_blk_\w+)", "([^"]+)"\], say: \["(blk_\w+)", "([^"]+)"\]', JS): out += [[m.group(1), m.group(2)], [m.group(3), m.group(4)]]
ev = re.search(r'const EV10 = (\{.*?\});', JS, re.S).group(1); ev = json.loads(re.sub(r'(\w+): \[', r'"\1": [', ev))
for st, (f, b, h) in ev.items(): out += [[f"ev_{st}f", f + " 2マス すすむよ"], [f"ev_{st}b", b + " 2マス もどるよ"], [f"ev_{st}h", h + " 4マス もどるよ"]]
out += [["mz_big", "それだと おおきすぎるかな"], ["mz_small", "それだと ちいさすぎるかな"]]
seen = set(); out = [o for o in out if not (o[0] in seen or seen.add(o[0]))]
PJ = G / "sit/pony_s10.json"; old = {j[0]: j for j in json.loads(PJ.read_text())} if PJ.exists() else {}
PJ.write_text(json.dumps([[k, t, {}, old[k][3] if k in old and old[k][1] == t else None] for k, t in out], ensure_ascii=False, indent=0))
from collections import Counter
print(len(out), Counter(k.split("_")[0] for k, _ in out))
