"""2026-10-30 の 直し：まつ「しつもん」（mtshitsumon）の 会話が 成り立って いなかった
（先生「つぎの もんだいを かきますよ」→ 子ども「かきおわったら いいですか？」で、なにが いいのか わからない）。
→ 子どもが 手を あげる → 先生「いま かいて いるので まってね」→ 子ども「はい。かきおわったら しつもんしても いいですか？」→ 先生「まって くれて ありがとう。では どうぞ」
実行の じゅん: … → sits_fix6.py → sits_fix7.py。声：Aivis jobs/fix7（先生・がお）、ぽにー /tmp/pony_fix7.json"""
import json
from pathlib import Path
G = Path(__file__).resolve().parent; R = G.parents[2]
S = json.loads((G / "sits.json").read_text()); s = next(x for x in S if x["id"] == "mtshitsumon")
s["q"] = "あ、てを あげて いますね。いま こくばんに かいて いるので、ちょっと まって くださいね"
s["qy"] = "あ、手を挙げていますね。今、黒板に書いているので、ちょっと待ってくださいね"
s["res"] = "まって くれて ありがとう。……はい、かけました。では、しつもんを どうぞ"
s["ry"] = "待ってくれてありがとう。……はい、書けました。では、質問をどうぞ"
s["tiers"] = [
  {"a": "はい", "y": "はい", "keys": [["はい"]]},
  {"a": "はい、まちます", "y": "はい、待ちます", "keys": [["まち", "待ち", "まって", "待って"]]},
  {"a": "はい、まって います", "y": "はい、待っています", "keys": [["まって", "待って", "まち", "待ち"]]},
  {"a": "はい。かきおわったら、しつもんしても いいですか？", "y": "はい。書き終わったら、質問してもいいですか？", "keys": [["かきおわ", "書き終わ", "おわったら", "終わったら"], ["しつもん", "質問"]]},
  {"a": "はい、まちます。かきおわったら、しつもんしても いいですか？", "y": "はい、待ちます。書き終わったら、質問してもいいですか？", "keys": [["まち", "待ち"], ["しつもん", "質問"]]},
  {"a": "わかりました。かきおわるまで まって、それから しつもんします", "y": "分かりました。書き終わるまで待って、それから質問します", "keys": [["まって", "待って", "まち", "待ち"], ["しつもん", "質問"]]},
]
(G / "sits.json").write_text(json.dumps(S, ensure_ascii=False, indent=1))
L, Y = [], {}
def A(k, w, t, y): L.append({"key": k, "who": w, "text": t}); Y[k] = y
A("sq_mtshitsumon", "nobbo", s["q"], s["qy"]); A("sr_mtshitsumon", "nobbo", s["res"], s["ry"])
for i, t in enumerate(s["tiers"]): A(f"sg_mtshitsumon_{i}", "gao", t["a"], t["y"])
J = R / "tools/aivis/jobs/fix7"; J.mkdir(parents=True, exist_ok=True)
(J / "lines.json").write_text(json.dumps(L, ensure_ascii=False, indent=1)); (J / "yomi.json").write_text(json.dumps(Y, ensure_ascii=False, indent=1))
Path("/tmp/pony_fix7.json").write_text(json.dumps([[f"sa_mtshitsumon_{i}", t["a"], {}, None] for i, t in enumerate(s["tiers"])], ensure_ascii=False))
print(len(L), "aivis")
