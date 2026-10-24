"""ショートコース「まねっこ しちゃった」（manekko、2026-10-25）の 台本
python3 sit/manekko_gen.py → board/manekko_data.js ・ sit/pony_manekko.json ・ ../aivis/jobs/<job>/（lines・yomi）
ねらい：会話の「ながれ」（なんども やりとりが つづく）を まなぶ。あいての はんのう（かお・さそって くれる）が ごほうび。
もとに した こと：ある子の まねを したら、それが いけない ことで、べつの 子に ちゅうい された。でも いいわけ（わけを はなす）が できない。
あまねさんの きめた こと：「〇〇くんが やってたから」と わけを いう のは いい いいかた（しぜんな 会話が いちばん だいじ）。
ながれ：kihon（ちゅうい される）・kitsui（きつく いわれる）・sensei（せんせいに きかれる）・help（まねした 子に おしえて あげる）。
1ターン＝あいての ことば → カード（いい いいかた／まずい いいかた 2つ）→ まずいと あいての かおが くもる → いい いいかたを こえで いう。
答えは 3だん（みじかい・ふつう・ながい）。キャラは ライバル（がお）と、こたえる 子に なる キャラ（ぴょん・みい・ちゅう・こん・どしん）を つかわない。"""
import json, sys
from pathlib import Path
G = Path(__file__).resolve().parents[1]; A = G.parents[0] / "aivis"
NM = {"tora": "とらおくん", "kuma": "くまくん", "panna": "ぱんなちゃん"}
NY = {"tora": "とらおくん", "kuma": "くまくん", "panna": "ぱんなちゃん"}
# id, 場所, まねされた子, ちゅういする子（help では まねした 子）, ながれ, うごき, ことば
SC = [
 dict(id="rouka", place="ろうか", model="tora", ptr="kuma", flow="kihon", anim="run",
      narr="とらおくんが ろうかを はしって いったよ。まねして、はしっちゃった！",
      dame="あー！ ろうかは はしったら だめなんだよ！", did="ろうかを はしってた", reason="ぶつかると あぶないからね", reason_s="ぶつかると あぶない", promise="もう はしらないね"),
 dict(id="kotoba", place="きょうしつ", model="tora", ptr="panna", flow="kihon", anim="word",
      narr="とらおくんが ふざけて「ばか」って いったよ。まねして、いっちゃった！",
      dame="あー！「ばか」って いったら だめなんだよ！", did="いってた", reason="いわれた ひとが かなしく なるからね", reason_s="いわれた ひとが かなしく なる", promise="もう いわないね"),
 dict(id="ball", place="きょうしつ", model="tora", ptr="kuma", flow="kihon", anim="ball",
      narr="とらおくんが きょうしつで ボールを なげたよ。まねして、なげちゃった！",
      dame="あー！ きょうしつで ボールを なげたら だめなんだよ！", did="なげてた", reason="まどに あたったら われちゃうからね", reason_s="まどに あたったら われちゃう", promise="そとで なげるね"),
 dict(id="keshigomu", place="きょうしつ", model="kuma", ptr="panna", flow="kihon", anim="eraser",
      narr="くまくんが ぱんなちゃんの けしゴムを つかって いたよ。まねして、かってに つかっちゃった！",
      dame="あー！ それ、わたしの けしゴムだよ！ かってに つかったら だめなんだよ！", did="つかってた", reason="つかう ときは、かしてって いってね", reason_s="かってに つかうと こまる", promise="こんどは、かしてって いうね"),
 dict(id="suberi", place="こうえん", model="tora", ptr="panna", flow="kitsui", anim="climb",
      narr="とらおくんが すべりだいを したから のぼったよ。まねして、のぼっちゃった！",
      did="のぼってた", reason="すべって くる ひとと ぶつかるからね", reason_s="すべって くる ひとと ぶつかる", promise="もう したから のぼらないね"),
 dict(id="retsu", place="はいぜん", model="tora", ptr="kuma", flow="kitsui", anim="cut",
      narr="とらおくんが れつに わりこんだよ。まねして、わりこんじゃった！",
      did="わりこんでた", reason="ならんでる ひとが いやな きもちに なるからね", reason_s="ならんでる ひとが いやな きもちに なる", promise="うしろに ならぶね"),
 dict(id="gyunyu", place="きゅうしょく", model="tora", ptr="panna", flow="sensei", anim="milk",
      narr="とらおくんが ぎゅうにゅうを ストローで ぶくぶく したよ。まねして、ぶくぶく しちゃった！",
      dame="あー！ ぎゅうにゅうで ぶくぶく したら だめなんだよ！", did="ぶくぶく してた", mine="ぶくぶく しちゃった", reason="こぼれたら たいへんだからね", reason_s="こぼれたら たいへんだ", promise="もう ぶくぶく しないね"),
 dict(id="tsukue", place="きょうしつ", model="tora", ptr="kuma", flow="sensei", anim="desk",
      narr="とらおくんが つくえの うえに たったよ。まねして、たっちゃった！",
      dame="あー！ つくえの うえに たったら だめなんだよ！", did="つくえに たってた", mine="つくえに たっちゃった", reason="おちたら けがを するからね", reason_s="おちたら けがを する", promise="もう つくえに たたないね"),
 dict(id="kasa", place="かえりみち", model="tora", ptr="panna", flow="help", anim="umbrella",
      narr="とらおくんが かさを ふりまわして いたよ。ぱんなちゃんが まねを して、ふりまわして いる。おしえて あげよう",
      look="みて みて！ かさ、ぐるぐる！", reason_s="ひとに あたったら いたい"),
 dict(id="suna", place="こうえん", model="tora", ptr="kuma", flow="help", anim="sand",
      narr="とらおくんが すなを なげて いたよ。くまくんが まねを して、なげて いる。おしえて あげよう",
      look="みて みて！ すな、ぱーって なげるの、おもしろいよ！", reason_s="めに はいったら いたい"),
]
SFX = {"kuma": "くまくん", "tora": "とらおくん", "panna": "ぱんなちゃん"}
def turns(s):
    m, p = SFX[s["model"]], SFX[s["ptr"]]; f = s["flow"]
    T2 = dict(say="しらなかったの？", good=["うん", f"うん。{m}が {s.get('did', '')}から", f"うん。{m}が {s.get('did', '')}から、いいと おもったんだ"],
              bad=[(f"{m}が わるいんだよ！", "ひとの せいに しないでよ"), ("べつに いいじゃん", "よくないよ！")])
    T3 = dict(say=s.get("reason", ""), good=["わかった", f"わかった。{s.get('promise', '')}", f"そうなんだ。わかった。{s.get('promise', '')}"],
              bad=[("やだ、やる！", "えー、だめだってば"), ("ふーん", "……ちゃんと きいてる？")])
    if f == "kihon":
        return [dict(say=s["dame"], good=["え、そうなの？", "え、そうなの？ しらなかった", "え、そうなの？ しらなかった。ごめんね"], bad=[("しらない！", "しらないって なに？ だめなんだよ！"), ("（だまる）", "ねえ、なんで だまってるの？")]),
                T2, T3,
                dict(say="わかって くれて よかった", good=["ありがとう", "おしえて くれて ありがとう", f"おしえて くれて ありがとう。{p}、やさしいね"], bad=[("うるさいなあ", "えっ……そんな いいかた しなくても"), ("（だまる）", "……あれ？ おこってる？")])]
    if f == "kitsui":
        T2b = dict(T2, say="ほんとに しらなかったの？")
        return [dict(say="あー！ いけないんだー！ せんせいに いっちゃお！", good=["まって", "まって。しらなかったんだ", "まって。しらなかったんだ。もう しないから"], bad=[("いえば いいじゃん！", "ほんとに いっちゃうよ！"), ("（だまる）", "だまってたら わかんないよ")]),
                T2b, T3,
                dict(say="じゃあ、せんせいには いわないで おくね", good=["ありがとう", f"ありがとう。{s['promise']}", f"ありがとう。{s['promise']}。おしえて くれて うれしかった"], bad=[("べつに いいけど", "なに、その いいかた"), ("（だまる）", "……あれ？ おこってる？")])]
    if f == "sensei":
        return [dict(say=s["dame"], good=["え、そうなの？", "え、そうなの？ しらなかった", "え、そうなの？ しらなかった。ごめんね"], bad=[("しらない！", "しらないって なに？ だめなんだよ！"), ("（だまる）", "ねえ、なんで だまってるの？")]),
                dict(who="nobbo", say="どうしたの？", good=["まねしちゃった", f"{m}の まねを して、{s['mine']}", f"{m}が {s['did']}から、まねしたら、{p}に だめって いわれたの"],
                     bad=[("なんでもない", "なんでもなく なさそうだよ？"), (f"{p}が おこった", f"{p}は、なんて いったの？")]),
                dict(who="nobbo", say="そうだったのね。どうして だめなのか、わかる？", good=[s["reason_s"], f"{s['reason_s']}から", f"{s['reason_s']}から、だめなんだよね"],
                     bad=[("わかんない", f"{p}は、なんて いってた？"), ("だめじゃない", "ほんとうに そうかな？")]),
                dict(who="nobbo", say=f"そうね。じゃあ、{p}に なんて いう？", good=["ありがとう", "おしえて くれて ありがとう", f"{p}、おしえて くれて ありがとう。{s['promise']}"],
                     bad=[("べつに", "きもちを つたえて みよう"), ("（だまる）", "ことばに して みよう")])]
    # help：まねを して いる 子（ptr）に おしえて あげる
    return [dict(say=s["look"], good=["それ、だめだよ", "それ、だめなんだよ", f"{p}、それ だめなんだよ"], bad=[("いけないんだー！", "そんな いいかた しなくても……"), ("（だまって みてる）", "ねえ、みてよー")]),
            dict(say=f"え、そうなの？ だって、{m}も やってたよ", good=["しらなかったんだね", "しらなかったんだね。だいじょうぶだよ", f"しらなかったんだね。{m}も、まちがえちゃったんだよ"], bad=[(f"{m}も わるい！", "えー……"), ("ばかだなあ", "ひどい……")]),
            dict(say="どうして だめなの？", good=[s["reason_s"], f"{s['reason_s']}から", f"{s['reason_s']}からだよ。いっしょに きを つけよう"], bad=[("だめな ものは だめ！", "わけを おしえてよ"), ("しらない", "えー、じゃあ わかんないよ")]),
            dict(say="そっか。おしえて くれて ありがとう", good=["いいよ", "どういたしまして", "どういたしまして。また いっしょに あそぼうね"], bad=[("ほんとに わかった？", "……わかったってば"), ("（だまる）", "……あれ？")])]
END = {"kihon": "うん！ ねえ、いっしょに あそぼう！", "kitsui": "うん！ ねえ、いっしょに あそぼう！", "sensei": "うん！ ねえ、いっしょに あそぼう！", "help": "うん！ いっしょに あそぼう！"}
# ききとりの キーワード（いい いいかたに でて くる ことば）
KW = [["そうなの"], ["しらなかった", "知らなかった"], ["ごめん"], ["いいと", "良いと"], ["おもった", "思った"], ["わかった", "分かった"], ["ありがとう"], ["おしえて", "教えて"], ["やさしい", "優しい"],
      ["まって", "待って"], ["もうしない", "もう しない"], ["まね", "真似"], ["いわれた", "言われた"], ["だめ", "駄目", "ダメ"], ["あぶない", "危ない"], ["かなしく", "悲しく"], ["われちゃう", "割れちゃう", "われる", "割れる"],
      ["こまる", "困る"], ["ぶつかる"], ["いやな", "嫌な"], ["たいへん", "大変"], ["けが", "怪我"], ["いたい", "痛い"], ["どういたしまして"], ["だいじょうぶ", "大丈夫"], ["まちがえ", "間違え"], ["きをつけ", "気をつけ", "気を付け"],
      ["うしろ", "後ろ"], ["そと", "外"], ["かして", "貸して"], ["うれしかった", "嬉しかった"], ["うん"]]
def keys_of(t):
    z = t.replace(" ", "").replace("、", "").replace("。", "")
    ks = [k for k in KW if any(v.replace(" ", "") in z for v in k)]
    ks = [k for k in ks if not (k == ["うん"] and len(ks) > 1)]
    return ks[:3] or [[z[:3]]]
if __name__ == "__main__":
    data = []; pony = {}; aiv = []; yomi = {}
    pony.update({"mk_intro": "まねっこ しちゃった！ あいてが にこにこに なるように、いいかたを えらんで、いって みよう",
                 "mk_pick": "どの いいかたに する？ タッチしてね", "mk_retry": "あいての かおを みてね。べつの いいかたに して みよう", "mk_say": "いい いいかた！ こえに だして いって みよう",
                 "mk_naka": "なかよし！ あいてが にこにこに なったね", "mk_teach": "がおくんに、なんて いえば いいか おしえて あげよう", "mk_help": "なんて いって あげる？ タッチしてね"})
    for s in SC:
        ts = turns(s); d = dict(id=s["id"], place=s["place"], model=s["model"], ptr=s["ptr"], flow=s["flow"], anim=s["anim"], end=END[s["flow"]], turns=[])
        pony[f"mk_{s['id']}_n"] = s["narr"]
        for i, t in enumerate(ts):
            who = t.get("who", s["ptr"])
            tt = dict(who=who, say=t["say"], good=t["good"], keys=[keys_of(g) for g in t["good"]], bad=[[b, r] for b, r in t["bad"]])
            d["turns"].append(tt)
            aiv.append({"key": f"mk_{s['id']}_t{i}", "who": who, "text": t["say"]})
            for j, (b, r) in enumerate(t["bad"]): aiv.append({"key": f"mk_{s['id']}_t{i}_b{j}", "who": who, "text": r})
            for lv, g in enumerate(t["good"]): pony[f"mk_{s['id']}_t{i}_g{lv}"] = g
        aiv.append({"key": f"mk_{s['id']}_end", "who": s["ptr"], "text": END[s["flow"]]})
        data.append(d)
    pony.update({"p_blk_manekko": "どしんが、だれかの まねを して、ろうかを はしろうと して いるよ", "blk_manekko": "ろうかは あるこうね",
                 "ev_manekkof": "ともだちと なかよく できた！ 2マス すすむよ", "ev_manekkob": "まねっこして ころんじゃった！ 2マス もどるよ", "ev_manekkoh": "わすれものを とりに もどった！ 4マス もどるよ"})
    aiv.append({"key": "rs_manekko", "who": "doshin", "text": "そうだった！ おしえて くれて ありがとう"})
    aiv.append({"key": "mk_gao_bad", "who": "gao", "text": "しらないもん！"})
    aiv.append({"key": "mk_gao_ok", "who": "gao", "text": "そっか。おしえて くれて ありがとう"})
    (G / "board/manekko_data.js").write_text("/* 「まねっこ しちゃった」の 台本（sit/manekko_gen.py が かく） */\nconst MNK = " + json.dumps({"sc": data, "txt": pony}, ensure_ascii=False) + ";\n")
    PJ = G / "sit/pony_manekko.json"; old = {j[0]: j for j in json.loads(PJ.read_text())} if PJ.exists() else {}
    PJ.write_text(json.dumps([[k, t, {}, old[k][3] if k in old and old[k][1] == t else None] for k, t in pony.items()], ensure_ascii=False, indent=0))
    if len(sys.argv) > 1:  # Aivis の ジョブ
        J = A / "jobs" / sys.argv[1]; J.mkdir(parents=True, exist_ok=True)
        (J / "lines.json").write_text(json.dumps(aiv, ensure_ascii=False, indent=0))
        (J / "yomi.json").write_text(json.dumps({x["key"]: x["text"] for x in aiv}, ensure_ascii=False, indent=1))
    print(len(data), "scenes", len(pony), "pony", len(aiv), "aivis")
