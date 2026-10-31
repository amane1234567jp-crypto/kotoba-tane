"""きもちの コースを ロールプレイ型に（2026-10-31）。
「？」で じぶんの きもちを いわせるのを やめ、ぽにーが まるシマ（あそんで いる キャラ）の せりふを お手本で いい、子どもは それを まねして いう。
場面ごと（kc_<id>_fm）・きもち ぴったりごと（kpt_<id>_m）の お手本の せりふを ここに おく。
python3 sit/kimochi_rp.py → board/kimochi_rp_data.js を かき、sit/pony_kimochi.json に たして、/tmp/kt/pony_rp.json（声を つくる リスト）を つくる"""
import json
from pathlib import Path
G = Path(__file__).resolve().parents[1]
SC = {
 "a_present": "ずっと ほしかった ものを もらえて、うれしい！",
 "a_kowareta": "だいじな おもちゃが こわれて、かなしい",
 "a_kaminari": "かみなりが ゴロゴロ なって、こわいよ",
 "a_fuusen": "ふうせんが きゅうに われて、びっくり した！",
 "a_tsumiki": "つみきを わざと たおされて、むかむか する！",
 "a_orusuban": "ひとりで おるすばんして、さみしかった",
 "a_doubutsuen": "あした どうぶつえんに いけるから、わくわく する！",
 "a_boushi": "ぼうしが みつかって、ほっと した",
 "g_kakekko": "さいごに ぬかされて まけちゃって、くやしいです",
 "g_ensoku": "えんそくが なくなって、がっかり しました",
 "g_asobanai": "もう あそばないって いわれて、かなしいです",
 "g_oyasumi": "なかよしの ともだちが いなくて、さみしいです",
 "g_happyou": "まちがえて わらわれて、はずかしかったです",
 "g_junban": "まえに わりこまれて、ずるいって おもいました",
 "g_fudebako": "かっこいい ふでばこで、うらやましいです",
 "g_kega": "ともだちが けがを して、しんぱいです",
 "g_purint": "プリントを わすれて きて、こまって います",
 "g_ame": "そとで あそべなくて、つまらないです",
 "g_chokkai": "なんども ちょっかいを だされて、いらいら します",
 "g_gomen": "ごめんねが いえなくて、もやもや します",
 "k_hikkoshi": "おわかれの プレゼントを もらって、うれしい",
 "k_tachikogi": "たちこぎが できて、たのしい！",
 "k_aisu": "アイスを おとしちゃって、かなしい",
 "k_ball": "ボールを かして くれなくて、いらいら する",
 "k_sunaba": "つくった おしろを こわされて、かなしい",
 "k_kenka": "ごめんねって いって くれて、ほっと した",
 "k_sakaagari": "さかあがりが できて、うれしい！",
 "k_inu": "おおきな いぬが ほえて、こわい",
 "o_aisu": "アイスを おとして、かなしそうだね",
 "o_maigo": "おかあさんが いなくて、しんぱいそうだね",
 "o_fuusen": "ふうせんが とんで いって、がっかり してるね",
 "o_kuji": "いっとうしょうが あたって、うれしそうだね",
 "o_koronda": "ころんで、はずかしそうだね",
 "o_bus": "バスが こなくて、いらいら してるみたい",
 "o_hajimete": "はじめての ならいごとで、どきどき してるみたい",
 "o_hitori": "ひとりぼっちで、さみしそうだね",
}
PT = {
 "kuji": "くじびきが はずれて、がっかり",
 "shiai": "いっぱい れんしゅう したのに まけて、くやしい！",
 "hikkoshi": "ともだちが ひっこして、さみしいな",
 "zubon": "ズボンが やぶれて、はずかしい！",
 "okashi": "ともだちだけ ふたつ もらって、ずるい！",
 "koinu": "かわいい こいぬが いて、うらやましいな",
 "netsu": "ねつを だして ねて いて、しんぱいだな",
 "yukkuri": "いそいで いるのに すすめなくて、いらいら する",
 "uso": "うそを ついて しまって、もやもや する",
 "hima": "する ことが なにも なくて、つまらないな",
 "kasa": "かさが なくて、こまったな",
 "nibanme": "いちばんに なりたかったのに、くやしい！",
}
PONY = {"kp_rp": "この こに なった つもりで、まねして いって みよう"}
(G / "board/kimochi_rp_data.js").write_text("/* きもちの コースの お手本の せりふ（sit/kimochi_rp.py が かく） */\nconst KC_RP = " + json.dumps({"sc": SC, "pt": PT, "txt": PONY}, ensure_ascii=False) + ";\n")
jobs = [[f"kc_{k}_fm", v, {}, None] for k, v in SC.items()] + [[f"kpt_{k}_m", v, {}, None] for k, v in PT.items()] + [[k, v, {}, None] for k, v in PONY.items()]
pk = G / "sit/pony_kimochi.json"; cur = json.loads(pk.read_text()); have = {p[0] for p in cur}
cur += [j for j in jobs if j[0] not in have]; pk.write_text(json.dumps(cur, ensure_ascii=False, indent=0))
Path("/tmp/kt/pony_rp.json").write_text(json.dumps(jobs, ensure_ascii=False))
print(len(jobs))
