"""2026-10-30 の 直し（2）：おんがく「リズム」（ogrhythm）。答えの 段が「まねして たたく（タン、タン）」と「もう いちど たのむ」の 2しゅるいに わかれて いて、
先生の へんじ「じょうずです。では もう いちど」が「もう いちど やって ください」に かみあわなかった。→ 段を ぜんぶ「もう いちど たのむ」に そろえ、へんじも それに あわせる。
実行の じゅん: … → sits_fix7.py → sits_fix7b.py。声：Aivis jobs/fix7b、ぽにー /tmp/pony_fix7b.json"""
import json
from pathlib import Path
G = Path(__file__).resolve().parent; R = G.parents[2]
S = json.loads((G / "sits.json").read_text()); s = next(x for x in S if x["id"] == "ogrhythm")
s["q"] = "はい、せんせいの まねを して、てを たたいて ください"; s["qy"] = "はい、先生の真似をして、手を叩いてください"
s["res"] = "ちょっと はやかったですね。では、ゆっくり いきますよ。タン、タン、タ、タ、タン"; s["ry"] = "ちょっと速かったですね。では、ゆっくりいきますよ。タン、タン、タ、タ、タン"
M = [["もういちど", "もう一度", "もういっかい", "もう一回", "もう いちど", "もう いっかい"]]
s["tiers"] = [
  {"a": "もう いちど", "y": "もう一度", "keys": M},
  {"a": "もう いちど おねがいします", "y": "もう一度お願いします", "keys": M},
  {"a": "もう いちど やって ください", "y": "もう一度やってください", "keys": M + [["やって", "たたいて", "叩いて"]]},
  {"a": "せんせい、もう いちど やって ください", "y": "先生、もう一度やってください", "keys": [["せんせい", "先生"]] + M},
  {"a": "はやくて わかりませんでした。もう いちど ゆっくり やって ください", "y": "速くて分かりませんでした。もう一度ゆっくりやってください", "keys": M + [["ゆっくり"]]},
  {"a": "せんせい、さいごの ところを もう いちど、ゆっくり たたいて ください", "y": "先生、最後のところをもう一度、ゆっくり叩いてください", "keys": [["さいご", "最後"]] + M + [["ゆっくり"]]},
]
(G / "sits.json").write_text(json.dumps(S, ensure_ascii=False, indent=1))
L, Y = [], {}
def A(k, w, t, y): L.append({"key": k, "who": w, "text": t}); Y[k] = y
A("sq_ogrhythm", "nobbo", s["q"], s["qy"]); A("sr_ogrhythm", "nobbo", s["res"], s["ry"])
for i, t in enumerate(s["tiers"]): A(f"sg_ogrhythm_{i}", "gao", t["a"], t["y"])
J = R / "tools/aivis/jobs/fix7b"; J.mkdir(parents=True, exist_ok=True)
(J / "lines.json").write_text(json.dumps(L, ensure_ascii=False, indent=1)); (J / "yomi.json").write_text(json.dumps(Y, ensure_ascii=False, indent=1))
Path("/tmp/pony_fix7b.json").write_text(json.dumps([[f"sa_ogrhythm_{i}", t["a"], {}, None] for i, t in enumerate(s["tiers"])], ensure_ascii=False))
print(len(L))
