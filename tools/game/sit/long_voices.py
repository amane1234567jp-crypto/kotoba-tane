"""だいぼうけん（long）の 声の リストを つくる。
  Aivis: tools/aivis/jobs/long/{lines,yomi}.json（キャラの かけあい・へんじ）
  ぽにー: argv[1]（pony_gen.py の jobs）"""
import json, re, sys
from pathlib import Path
R = Path(__file__).resolve().parents[2]
D = json.loads((R / "game/sit/long.json").read_text())
q = lambda s: s.replace("「", "").replace("」", "")
lines, yomi = [], {}
for it in D["kaiwa"]:
    for i, (who, t, y) in enumerate(it["talk"]):
        k = f"lk_{it['id']}_t{i}"; lines.append({"key": k, "who": who, "text": t}); yomi[k] = q(y)
    who, t, y = it["reply"]; k = f"lk_{it['id']}_r"; lines.append({"key": k, "who": who, "text": t}); yomi[k] = q(y)
lines.append({"key": "lk_blk_res", "who": "nobbo", "text": "おっと、すみません。どうぞ"}); yomi["lk_blk_res"] = "おっと、すみません。どうぞ"
J = R / "aivis/jobs/long"; J.mkdir(parents=True, exist_ok=True)
(J / "lines.json").write_text(json.dumps(lines, ensure_ascii=False, indent=0)); (J / "yomi.json").write_text(json.dumps(yomi, ensure_ascii=False, indent=0))
P = []
add = lambda k, t: P.append([k, q(t), None, None])
src = (R / "game/board/long.js").read_text()
for k, t in re.findall(r'"(lk_[a-z0-9_]+)", "([^"]+)"\)', src): add(k, t)
for k, t in re.findall(r'\["(lk_[a-z0-9_]+)", "([^"]+)"\]', src):
    if k != "lk_blk_res": add(k, t)
for k, t in re.findall(r'EVENTS.long = \{(.*?)\n\};', src, re.S)[0] and re.findall(r'"(lk_ev_[a-z0-9]+)", "([^"]+)"', src): add(k, t)
for it in D["kaiwa"]: add(f"lk_{it['id']}_a", f"こたえは、{it['opts'][0][0]}")
for it in D["hantai"]: add(f"lk_{it['id']}_q", f"{it['w']}の はんたいは どれかな？"); add(f"lk_{it['id']}_a", f"{it['w']}の はんたいは、{it['a']}")
for it in D["joshi"]: P.append([f"lk_{it['id']}", it["y"], None, None])
for it in D["machi"]: P.append([f"lk_{it['id']}", it["y"], None, None])
for it in D["teinei"]:
    w = it["kind"] == "which"
    add(f"lk_{it['id']}_q", f"{it['q']}、どっちを いうと いいかな？" if w else re.sub(r"[！？]?」と", "、と", it["q"]).replace("〜", ""))
    add(f"lk_{it['id']}_a", f"{it['ok']}、と いうと いいね" if w else f"{it['ok']}だね")
seen = set(); P = [p for p in P if not (p[0] in seen or seen.add(p[0]))]
Path(sys.argv[1]).write_text(json.dumps(P, ensure_ascii=False, indent=0))
print(len(lines), "aivis /", len(P), "pony")
