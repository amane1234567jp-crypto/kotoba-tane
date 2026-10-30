"""2026-10-30 ぜんたいの 会話チェック（2回め）の 直し ＋ 声と 文字が ずれて いた 声の 作りなおし。
① 4人の 点検で 見つかった 57場面（res が どの 段の 答えにも 合うか、段の 中身が そろって いるか など）。データは scratchpad の fix8_raw.json（文）と fix8_yk.json（漢字・keys）を 取りこんだ もの＝ sit/fix8_data.json
② sits.json の 文と、いま 入って いる 声（Aivis の ジョブの 文）が ちがう もの（文を 直したのに 声を 作りなおして いなかった）を ぜんぶ 作りなおす
実行の じゅん: … → sits_fix7.py → sits_fix7b.py → sits_fix8.py。声：Aivis jobs/fix8、ぽにー /tmp/pony_fix8.json"""
import json, subprocess, sys
from pathlib import Path
G = Path(__file__).resolve().parent; R = G.parents[2]
S = json.loads((G / "sits.json").read_text()); BY = {s["id"]: s for s in S}
D = json.loads((G / "fix8_data.json").read_text())
import re as _re
RIVAL_OF = json.loads(_re.search(r"RIVAL_OF = (\{[^}]*\})", (G.parent / "make_packs.py").read_text()).group(1))
RNAME = {"gao": "がお", "mii": "みい", "pyon": "ぴょん", "chu": "ちゅう", "doshin": "どしん", "kon": "こん", "shima": "まるシマ"}
riv = lambda s: RIVAL_OF.get(s["stage"], "gao")
nm = lambda s, t: t.replace("〇〇", RNAME.get(riv(s), "がお")) if t else t
FAMV = {"mama": ["pyonmama", "gaomama", "miimama", "chumama"], "papa": ["gaopapa", "doshinpapa"], "onii": ["gaonii"]}
aud = {p.stem for p in (G.parent / "stage_audio").glob("*.mp3")} | {p.stem for p in (G / "audio").glob("*.mp3")}
L, Y, pony = [], {}, []
def av(k, w, t, y):
    if k in Y: return
    L.append({"key": k, "who": w, "text": t}); Y[k] = y or t
def asker_lines(s, pre, t, y):
    av(f"{pre}_{s['id']}", s["asker"], t, y)
    for f in FAMV.get(s["asker"], []):
        if f"{pre}_{s['id']}_{f}" in aud: av(f"{pre}_{s['id']}_{f}", f, t, y)
for i, d in D.items():
    s = BY[i]
    if "q" in d: s["q"] = d["q"]; s["qy"] = d["qy"]; asker_lines(s, "sq", d["q"], d["qy"])
    if "res" in d: s["res"] = d["res"]; s["ry"] = d["ry"]; asker_lines(s, "sr", d["res"], d["ry"])
    if "answers" in d:
        for k, (a, t) in enumerate(zip(d["answers"], d["tiers"])):
            tt = s["tiers"][k]; tt["a"] = a; tt["y"] = t["y"]; tt["keys"] = t["keys"]
            for x in ("wrong", "wy", "auto"): tt.pop(x, None)
            pony.append([f"sa_{i}_{k}", a, {}, None])
            if s.get("gaoOk"): av(f"sg_{i}_{k}", riv(s), nm(s, a), nm(s, t["y"]))
# おんがく「リズム」（sits_fix7b.py で 文を 直した もの）の 声も ここで
s = BY["ogrhythm"]; asker_lines(s, "sq", s["q"], s["qy"]); asker_lines(s, "sr", s["res"], s["ry"])
for k, t in enumerate(s["tiers"]): pony.append([f"sa_ogrhythm_{k}", t["a"], {}, None]); av(f"sg_ogrhythm_{k}", riv(s), t["a"], t["y"])
(G / "sits.json").write_text(json.dumps(S, ensure_ascii=False, indent=1))
# ② 声と 文の ずれ：いちばん 新しい ジョブの 文と くらべる
best = {}
for lp in sorted((R / "tools/aivis/jobs").glob("*/lines.json")):
    if lp.parent.name in ("check", "fix8"): continue
    ts = subprocess.run(["git", "log", "-1", "--format=%ct", "--", str(lp)], capture_output=True, text=True, cwd=R).stdout.strip(); ts = int(ts) if ts else 9e9
    for l in json.loads(lp.read_text()):
        if l["key"] not in best or best[l["key"]][0] < ts: best[l["key"]] = (ts, l["text"])
nb = lambda t: t.replace(" ", "").replace("〜", "ー")
n2 = 0
for s in S:
    for pre, t, y in (("sq", s["q"], s.get("qy")), ("sr", s["res"], s.get("ry"))):
        for f in [""] + ["_" + x for x in FAMV.get(s["asker"], [])]:
            k = f"{pre}_{s['id']}{f}"
            if k in aud and k in best and nb(best[k][1]) != nb(t) and k not in Y: av(k, f[1:] or s["asker"], t, y); n2 += 1
    if s.get("gaoOk"):
        for i, tt in enumerate(s["tiers"]):
            k = f"sg_{s['id']}_{i}"
            if k in aud and k in best and nb(best[k][1]) != nb(nm(s, tt["a"])) and k not in Y: av(k, riv(s), nm(s, tt["a"]), nm(s, tt.get("y"))); n2 += 1
J = R / "tools/aivis/jobs/fix8"; J.mkdir(parents=True, exist_ok=True)
(J / "lines.json").write_text(json.dumps(L, ensure_ascii=False, indent=1)); (J / "yomi.json").write_text(json.dumps(Y, ensure_ascii=False, indent=1))
Path("/tmp/pony_fix8.json").write_text(json.dumps(pony, ensure_ascii=False))
print(len(L), "aivis（うち ずれ", n2, "）", len(pony), "pony")
# 2026-10-31：じてんしゃ「くるま」（jtkuruma）の 段4「うしろを みてから また はしるね」は、くるまは まえから きたので おかしい → 「ひだりの はしに よって、とまって まつね」（sits.json を 直接 なおした。声は jobs/fix9）
