"""2026-10-25 ゆうべの 提案 6：いくつかの 場面を 2〜3往復の かいわに のばす。
1かいめに いえたら、あいてが もう ひとこと きいて くる → こたえる → さいごの へんじ。
出力: board/more_data.js（MORE）、tools/aivis/jobs/mt1（あいての 声）、sit/pony_more.json（ぽにーの お手本）"""
import json
from pathlib import Path
G = Path(__file__).resolve().parents[1]; A = G.parents[1] / "tools/aivis/jobs/mt1"
K = lambda *a: [list(x) for x in a]
M = {
 "hoken": ("meebaa", [("どこで ころんだの？", "ろうかで ころびました", K(("ろうか", "廊下")))], "そう。ろうかは ゆっくり あるこうね。ばんそうこうを はりましょうね"),
 "uwabaki": ("kamejii", [("スリッパを かそうかね？", "はい、おねがいします", K(("おねがい", "お願い", "かして", "貸して")))], "ほっほ。あしたは わすれずに もって くるんじゃよ"),
 "zukan": ("nobbo", [("どんな どうぶつの ほんが いいですか？", "きょうりゅうの ほんが いいです", K(("きょうりゅう", "恐竜")))], "きょうりゅうの ずかんなら、いちばん うえの たなに ありますよ"),
 "netsu": ("meebaa", [("いつから ぐあいが わるいの？", "あさから です", K(("あさ", "朝")))], "そう。たいおんけいで、はかって みましょうね"),
 "pan": ("pyonmama", [("あたためますか？", "はい、おねがいします", K(("はい", "おねがい", "お願い", "いいえ", "そのまま", "大丈夫", "だいじょうぶ")))], "はい、どうぞ。やきたてですよ"),
 "otsukai": ("gaojii", [("ほかに なにか いるかね？", "それだけです", K(("それだけ", "それで", "だいじょうぶ", "大丈夫", "いりません")))], "ほっほ、えらいのう。おまけに りんごも どうぞ"),
 "kyoishii": ("pyon", [("なにが いちばん すき？", "からあげが いちばん すき", K(("からあげ", "唐揚げ", "から揚げ")))], "わたしも！ からあげ、さいこうだよね"),
 "ociyana": ("mama", [("なにが あったの？", "ともだちに おもちゃを とられたの", K(("とられ", "取られ", "盗られ")))], "そうだったの。いやだったね。おしえて くれて ありがとう"),
 "ocyume": ("mama", [("どんな ゆめ だったの？", "おばけに おいかけられたの", K(("おばけ", "お化け", "オバケ")))], "こわかったね。ママが そばに いるから だいじょうぶよ"),
 "tdhajime": ("kuma", [("いいよ。なにして あそぶ？", "すなばで あそぼう", K(("すなば", "砂場")))], "うん！ いっしょに おしろを つくろう"),
 "tdomocha": ("gao", [("どこが かっこいいと おもう？", "この うでが かっこいい", K(("うで", "腕")))], "だろ！ ビームも でるんだぜ。いっしょに あそぼうぜ"),
 "octetsudai": ("mama", [("ありがとう！ じゃあ、おはしを ならべて くれる？", "いいよ。まかせて", K(("いいよ", "まかせて", "任せて", "わかった", "分かった", "うん")))], "たすかるわ。ありがとう"),
 "kariru": ("nobbo", [("いつまでに かえせますか？", "らいしゅう かえします", K(("らいしゅう", "来週")))], "はい。らいしゅう、まって いますよ"),
 "ikura": ("pyonmama", [("おひとつ いかがですか？", "ひとつ ください", K(("ください", "下さい", "ひとつ", "一つ")))], "はい、どうぞ。くまさんパン、にんきなんです"),
 "ocyume2": None,
}
out, lines, pony = {}, [], []
for sid, v in M.items():
    if not v: continue
    who, turns, res = v
    out[sid] = {"turns": [{"q": q, "a": a, "keys": k} for q, a, k in turns], "res": res}
    vks = [("", who)] + ([("_" + m, m) for m in ("pyonmama", "gaomama", "miimama", "chumama")] if who == "mama" else [])  # じぶんの ママ
    for i, (q, a, k) in enumerate(turns):
        pony.append([f"sa2_{sid}_{i}", a, {}, ""])
        for vk, w in vks: lines.append({"key": f"sq2_{sid}_{i}{vk}", "who": w, "text": q})
    for vk, w in vks: lines.append({"key": f"sr_{sid}_m{vk}", "who": w, "text": res})
(G / "board/more_data.js").write_text("const MORE = " + json.dumps(out, ensure_ascii=False) + ";\n")
A.mkdir(exist_ok=True); (A / "lines.json").write_text(json.dumps(lines, ensure_ascii=False, indent=1)); (A / "yomi.json").write_text("{}"); (A / "acc.json").write_text("{}")
p = G / "sit/pony_more.json"
old = {e[0]: e for e in json.loads(p.read_text())} if p.exists() else {}
p.write_text(json.dumps([old.get(e[0], e) if old.get(e[0], [0, 0])[1] == e[1] else e for e in pony], ensure_ascii=False, indent=0))
print(len(out), "scenes", len(lines), "aivis", len(pony), "pony")
