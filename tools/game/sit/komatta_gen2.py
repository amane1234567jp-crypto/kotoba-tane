"""「かんがえて みよう！」コースの 作りかえ（2026-10-29）
きく役を 先生・ママ から ナレーターの ぽにー に かえる。先生が「どうして そう なったと おもいますか？」と きくのは 現実に ありえない、との 指摘。
① ぽにーと いっしょに かんがえる（なにが こまった？ → どうして？ → どうする？（カード）→ どれに する？ どうして？ → つぎから）
② さいごに「じゃあ、せんせいに いって みよう！」→ 子どもが 相手に いう（say）→ 相手が こたえる（reply）
python3 tools/game/sit/komatta_gen2.py → board/komatta_data2.js（KM2）・/tmp/pony_km2.json（ぽにー）・aivis/jobs/km2（相手の へんじ）"""
import json
from pathlib import Path
G = Path(__file__).resolve().parents[1]; R = G.parents[1]
def k(*a): return [x if isinstance(x, list) else [x] for x in a]
# id: (いう相手（None＝asker）, いう ことば, keys, へんじ, へんじの 漢字)
SAY = {
 "kutsu": (None, "ママ、くつが かたほう ないの。いっしょに さがして", k(["くつ", "靴"], ["さがして", "探して"]), "あら、たいへん。いっしょに さがそう", "あら、大変。一緒に探そう"),
 "kobosu": (None, "ママ、ジュースを こぼしちゃった。ふきん かして", k(["こぼし", "零し"], ["ふきん", "布巾", "かして", "貸して"]), "はい、ふきん。いっしょに ふこうね", "はい、布巾。一緒に拭こうね"),
 "game": (None, "ママ、セーブしたら やめるね", k(["せーぶ", "セーブ"], ["やめる"]), "うん。やくそくを まもれて、えらいね", "うん。約束を守れて、偉いね"),
 "purint": (None, "ママ、プリントが ないの。いっしょに さがして", k(["ぷりんと", "プリント"], ["さがして", "探して"]), "いいよ。ランドセルの おくも みて みよう", "いいよ。ランドセルの奥も見てみよう"),
 "keshigomu": (None, "せんせい、けしごむを わすれました。かして ください", k(["けしごむ", "消しゴム"], ["かして", "貸して"]), "はい、どうぞ。つぎは わすれないでね", "はい、どうぞ。次は忘れないでね"),
 "wakaranai": (None, "せんせい、もう いちど いって ください", k(["もういちど", "もう一度", "もういっかい", "もう一回"], ["いって", "言って"]), "はい。では、もう いちど いいますね", "はい。では、もう一度言いますね"),
 "toire": (None, "せんせい、トイレに いきたいです", k(["といれ", "トイレ"], ["いきたい", "行きたい"]), "はい、いって きて いいですよ", "はい、行ってきていいですよ"),
 "nigate": (None, "せんせい、ピーマンを へらして ください", k(["ぴーまん", "ピーマン"], ["へらして", "減らして"]), "わかりました。ひとくちは がんばろうね", "分かりました。一口は頑張ろうね"),
 "buranko": (None, "ママ、じゅう かぞえたら こうたいって、いって みるね", k(["かぞえ", "数え"], ["こうたい", "交代"]), "いい かんがえね。いって ごらん", "いい考えね。言ってごらん"),
 "kasa": (None, "せんせい、かさを かして ください", k(["かさ", "傘"], ["かして", "貸して"]), "はい、どうぞ。あした かえして くださいね", "はい、どうぞ。明日返してくださいね"),
 "suitou": (None, "ママ、みずが なくなっちゃった。ひかげで やすみたい", k(["みず", "水"], ["ひかげ", "日陰", "やすみたい", "休みたい"]), "そうね。ひかげで やすんで、みずを かいに いこう", "そうね。日陰で休んで、水を買いに行こう"),
 "kega": (None, "せんせい、ころんで ひざから ちが でました", k(["ころん", "転ん"], ["ひざ", "膝", "ち", "血"]), "たいへん。みずで あらって、てあてを しましょう", "大変。水で洗って、手当てをしましょう"),
 "maigo": (None, "まいごに なりました。ママを よんで ください", k(["まいご", "迷子"], ["ママ", "まま"]), "わかりました。ママを よんで あげるね", "分かりました。ママを呼んであげるね"),
 "toriai": ("kon", "こんくん、じゅんばんこに つかおう", k(["じゅんばん", "順番"], ["つかお", "使お"]), "うん、いいよ。じゅんばんこね", "うん、いいよ。順番こね"),
 "naiteru": ("chu", "ちゅうくん、どうしたの？ だいじょうぶ？", k(["どうしたの"], ["だいじょうぶ", "大丈夫"]), "……うん。きいて くれて、ありがとう", "……うん。聞いてくれて、ありがとう"),
}
PONY = {"kmp_open": "あれ？ こまった かおを して いるね", "kmp_q1": "なにが こまって いるの？", "kmp_q2": "どうして、そう なったのかな？", "kmp_q3": "どんな やりかたが あるかな？",
        "kmp_q4": "どれに する？ どうして？", "kmp_q5": "つぎからは、どう する？", "kmp_res2": "じぶんで かんがえて、ちゃんと いえたね！", "kmp_intro2": "ぽにーと いっしょに、じゅんばんに かんがえて みよう",
        "kmp_go_sensei": "じゃあ、せんせいに いって みよう！", "kmp_go_mama": "じゃあ、ママに いって みよう！", "kmp_go_papa": "じゃあ、パパに いって みよう！", "kmp_go_tenin": "じゃあ、おみせの ひとに いって みよう！",
        "kmp_go_kon": "じゃあ、こんくんに いって みよう！", "kmp_go_chu": "じゃあ、ちゅうくんに いって みよう！", "kmp_rival": "がおくんも こまって いるみたい"}
GO = {"nobbo": "kmp_go_sensei", "mama": "kmp_go_mama", "pyonmama": "kmp_go_mama", "gaomama": "kmp_go_mama", "miimama": "kmp_go_mama", "chumama": "kmp_go_mama", "doshinpapa": "kmp_go_papa", "tenin": "kmp_go_tenin", "kon": "kmp_go_kon", "chu": "kmp_go_chu"}
KM = json.loads((G / "board/komatta_data.js").read_text().split("= ", 1)[1].rstrip().rstrip(";"))
data, pony, aiv, yomi = {}, [], [], {}
MOMS = ["mama", "pyonmama", "gaomama", "miimama", "chumama", "doshinpapa"]
for sc in KM["sc"]:
    to, say, keys, rep, repy = SAY[sc["id"]]
    data[sc["id"]] = {"to": to, "say": say, "keys": keys, "reply": rep}
    pony.append([f"km_{sc['id']}_say", say, {}, None])
    whos = [to] if to else (MOMS if sc["asker"] == "mama" else [sc["asker"]])
    for w in whos: key = f"kmr_{sc['id']}_{w}"; aiv.append({"key": key, "who": w, "text": rep}); yomi[key] = repy
for kk, t in PONY.items(): pony.append([kk, t, {}, None])
(G / "board/komatta_data2.js").write_text("/* かんがえて みよう！ の 作りかえ（sit/komatta_gen2.py が かく）：さいごに 相手に いう ことば と へんじ */\nconst KM2 = " + json.dumps({"say": data, "go": GO}, ensure_ascii=False) + ";\n")
Path("/tmp/pony_km2.json").write_text(json.dumps(pony, ensure_ascii=False, indent=0))
J = R / "tools/aivis/jobs/km2"; J.mkdir(parents=True, exist_ok=True)
(J / "lines.json").write_text(json.dumps(aiv, ensure_ascii=False, indent=1)); (J / "yomi.json").write_text(json.dumps(yomi, ensure_ascii=False, indent=1))
print(len(data), "scenes", len(pony), "pony", len(aiv), "aivis")
