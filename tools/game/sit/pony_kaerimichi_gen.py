"""「かえりみち なかま」（stages12.js）の ぽにーの 声の リスト → sit/pony_kaerimichi.json（python3 sit/pony_kaerimichi_gen.py）"""
import json, re
from pathlib import Path
G = Path(__file__).resolve().parents[1]
S = [s for s in json.loads((G / "sit/sits.json").read_text()) if s["stage"] == "kaerimichi"]
JS = (G / "board/stages12.js").read_text()
out = [[f"sa_{s['id']}_{i}", t["a"]] for s in S for i, t in enumerate(s["tiers"])]
for k, t in re.findall(r'speak\(C\.pony, "([a-z0-9_]+)", "([^"]+)"\)', JS):
    if k.startswith("jk_"): out.append([k, t])
out += [["jk_aiko", "あいこ！ もう いちど タッチしてね"], ["jk_touch", "グー、チョキ、パーの どれかを タッチしてね"]]
C = re.findall(r'\["(\w+)", "([^"]+)", "[^"]+"\]', re.search(r"const JK_C = (\[.*?\]);", JS).group(1))
F = re.findall(r'\["(\w+)", "([^"]+)", "[^"]+"\]', re.search(r"const JK_F = (\[.*?\]);", JS).group(1))
for pk, pn in (("kuma", "くまくん"), ("tora", "とらおくん")):
    out += [[f"jk_win_{pk}", f"かった！ {pn}に あだなを つけよう"], [f"jk_wa_{pk}", f"{pn}は"], [f"jk_kyou_{pk}", f"きょうから {pn}は"]]
for ck, cw in C:
    for fk, fw in F: out += [[f"jk_n_{ck}_{fk}", cw + fw + "！"], [f"jk_nq_{ck}_{fk}", cw + fw + "？"]]
m = re.search(r'intro: \["(p_blk_kaerimichi)", "([^"]+)"\], say: \["(blk_kaerimichi)", "([^"]+)"\]', JS); out += [[m.group(1), m.group(2)], [m.group(3), m.group(4)]]
for k, t in re.findall(r'\["(?:fwd|back)", \d, "(ev_kaerimichi\w)", "([^"]+)"\]', JS): out.append([k, t])
seen = set(); out = [o for o in out if not (o[0] in seen or seen.add(o[0]))]
PJ = G / "sit/pony_kaerimichi.json"; old = {j[0]: j for j in json.loads(PJ.read_text())} if PJ.exists() else {}
PJ.write_text(json.dumps([[k, t, {}, old[k][3] if k in old and old[k][1] == t else None] for k, t in out], ensure_ascii=False, indent=0))
from collections import Counter
print(len(out), Counter(k.split("_")[0] for k, _ in out))
