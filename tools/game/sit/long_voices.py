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
# ---- わらえる 課題（gag・haya・sagasu） ----
lines2, yomi2 = [], {}
def A(k, who, t, y): lines2.append({"key": k, "who": who, "text": t}); yomi2[k] = q(y)
for g in D["gag"]:
    for i, (w, t, y) in enumerate(g["talk"]): A(f"lk_g_{g['id']}_t{i}", w, t, y)
    if not g.get("noq"): A(f"lk_g_{g['id']}_q", g["boke"], g["q"][1], g["q"][2])
    A(f"lk_g_{g['id']}_r", g["boke"], g["res"][1], g["res"][2])
    for i, (w, t, y) in enumerate(g["after"]): A(f"lk_g_{g['id']}_e{i}", w, t, y)
for h in D["haya"]: A(f"lk_y_{h['id']}_b", h["botch"][0], h["botch"][1], h["botch"][2])
NO, FOUND = D["sagasu"]["no"], D["sagasu"]["found"]
for k in NO: A(f"lk_s_no_{k}", k, NO[k], NO[k].replace("〜", "ー")); A(f"lk_s_found_{k}", k, FOUND[k], FOUND[k].replace("〜", "ー"))
J2 = R / "aivis/jobs/long2"; J2.mkdir(parents=True, exist_ok=True)
(J2 / "lines.json").write_text(json.dumps(lines2, ensure_ascii=False, indent=0)); (J2 / "yomi.json").write_text(json.dumps(yomi2, ensure_ascii=False, indent=0))
J = R / "aivis/jobs/long"; J.mkdir(parents=True, exist_ok=True)
(J / "lines.json").write_text(json.dumps(lines, ensure_ascii=False, indent=0)); (J / "yomi.json").write_text(json.dumps(yomi, ensure_ascii=False, indent=0))
P = []
add = lambda k, t: P.append([k, q(t), None, None])
src = (R / "game/board/long.js").read_text() + (R / "game/board/long_fun.js").read_text()
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
for g in D["gag"]:
    for i, t in enumerate(g["tiers"]): P.append([f"lk_g_{g['id']}_a{i}", q(t["a"]), None, None])
for h in D["haya"]: add(f"lk_y_{h['id']}", h["t"])
SG = D["sagasu"]; AN = SG["animal"]; HJ = SG["hats"]
for k, nm in SG["name"].items(): add(f"lk_s_n_{k}", f"{nm}は どこかな？ タッチしてね")
for a, nm in AN.items():
    for col, cj in HJ.items(): add(f"lk_s_h_{col}_{a}", f"{cj} ぼうしの {nm}は どこ？ タッチしてね")
    add(f"lk_s_g_{a}", f"めがねを かけた {nm}は どこ？ タッチしてね")
    add(f"lk_s_x_nohat_{a}", f"ぼうしを かぶって いない {nm}は どこ？ タッチしてね")
    add(f"lk_s_x_big_{a}", f"いちばん おおきい {nm}は どこ？ タッチしてね")
    add(f"lk_s_x_small_{a}", f"いちばん ちいさい {nm}は どこ？ タッチしてね")
seen = set(); P = [p for p in P if not (p[0] in seen or seen.add(p[0]))]
Path(sys.argv[1]).write_text(json.dumps(P, ensure_ascii=False, indent=0))
print(len(lines), "aivis /", len(lines2), "aivis2 /", len(P), "pony")
MW = {"shima": "まるシマ", "pyon": "ぴょん", "mii": "みい", "chu": "ちゅう", "gao": "がお", "meebaa": "めえばあ"}
(R / "game/sit/pony_mw.json").write_text(json.dumps([[f"mw_{k}", f"{v}の かち！ おめでとう！", None, None] for k, v in MW.items()], ensure_ascii=False))
