"""さんすうコースの データと 声の リストを つくる（2026-10-17）
  出力: board/sansu_data.js（const SANSU）、/tmp/pony_sansu.json（ぽにー）、aivis/jobs/st18（ちゅうの こたえ）
  実行: python3 sit/sansu_gen.py"""
import json, random
from pathlib import Path
G = Path(__file__).resolve().parents[1]; R = G.parents[1]
random.seed(20261017)

NUM = {0: "ぜろ", 1: "いち", 2: "に", 3: "さん", 4: "よん", 5: "ご", 6: "ろく", 7: "なな", 8: "はち", 9: "きゅう", 10: "じゅう"}
def num(n): return NUM[n] if n <= 10 else ("にじゅう" if n == 20 else "じゅう" + NUM[n - 10])
ONES = {  # 1〜10 の よみ（じょすうし つき）
 "こ": ["", "いっこ", "にこ", "さんこ", "よんこ", "ごこ", "ろっこ", "ななこ", "はっこ", "きゅうこ", "じゅっこ"],
 "ほん": ["", "いっぽん", "にほん", "さんぼん", "よんほん", "ごほん", "ろっぽん", "ななほん", "はっぽん", "きゅうほん", "じゅっぽん"],
 "わ": ["", "いちわ", "にわ", "さんわ", "よんわ", "ごわ", "ろくわ", "ななわ", "はちわ", "きゅうわ", "じゅうわ"],
 "ひき": ["", "いっぴき", "にひき", "さんびき", "よんひき", "ごひき", "ろっぴき", "ななひき", "はっぴき", "きゅうひき", "じゅっぴき"],
 "だい": ["", "いちだい", "にだい", "さんだい", "よんだい", "ごだい", "ろくだい", "ななだい", "はちだい", "きゅうだい", "じゅうだい"],
 "まい": ["", "いちまい", "にまい", "さんまい", "よんまい", "ごまい", "ろくまい", "ななまい", "はちまい", "きゅうまい", "じゅうまい"],
 "にん": ["", "ひとり", "ふたり", "さんにん", "よにん", "ごにん", "ろくにん", "ななにん", "はちにん", "きゅうにん", "じゅうにん"],
}
TWENTY = {"こ": "にじゅっこ", "ほん": "にじゅっぽん", "わ": "にじゅうわ", "ひき": "にじゅっぴき", "だい": "にじゅうだい", "まい": "にじゅうまい", "にん": "にじゅうにん"}
def cnt(n, c):
    if n <= 10: return ONES[c][n]
    if n == 20: return TWENTY[c]
    o = n - 10
    if c == "にん": return "じゅう" + {1: "いちにん", 2: "ににん", 4: "よにん"}.get(o, ONES[c][o])
    return "じゅう" + ONES[c][o]
NAN = {"こ": "なんこ", "ほん": "なんぼん", "わ": "なんわ", "ひき": "なんびき", "だい": "なんだい", "まい": "なんまい", "にん": "なんにん"}
COUNTERS = list(ONES)

# かぞえる・えの ある たしざん／ひきざんに つかう もの
ITEMS = {"apple": ("🍎", "りんご", "こ"), "pencil": ("✏️", "えんぴつ", "ほん"), "bird": ("🐦", "ことり", "わ"), "fish": ("🐟", "さかな", "ひき"),
         "car": ("🚗", "くるま", "だい"), "paper": ("🟥", "おりがみ", "まい"), "dog": ("🐶", "いぬ", "ひき"), "candy": ("🍬", "あめ", "こ")}

# ぶんしょうだい（lv5＝ふつう、lv6＝すこし むずかしい）。{a}{b}{c}{p}{q} は かず、x はこたえ
WP = [
 # lv5
 (5, "bird_add", "わ", "🐦", "こうえんに ことりが {a:わ} います。{b:わ} とんで きました。ぜんぶで なんわに なりましたか？", lambda a, b: a + b, [("🐦", "a", ""), ("🐦", "b", "in")], (2, 9), (1, 8)),
 (5, "candy_sub", "こ", "🍬", "あめが {a:こ} あります。{b:こ} たべました。のこりは なんこですか？", lambda a, b: a - b, [("🍬", "a", "", "b")], (5, 12), (1, 6)),
 (5, "kids_add", "にん", "🧒", "すなばで {a:にん} あそんで います。{b:にん} きました。みんなで なんにんに なりましたか？", lambda a, b: a + b, [("🧒", "a", ""), ("🧒", "b", "in")], (2, 8), (1, 7)),
 (5, "flower_diff", "ほん", "🌷", "あかい はなが {a:ほん}、きいろい はなが {b:ほん} あります。きいろい はなは、あかい はなより なんぼん おおいですか？", lambda a, b: b - a, [("🌹", "a", ""), ("🌼", "b", "")], (2, 7), (5, 12)),
 (5, "fish_sub", "ひき", "🐟", "いけに さかなが {a:ひき} います。{b:ひき} つりました。のこりは なんびきですか？", lambda a, b: a - b, [("🐟", "a", "", "b")], (6, 13), (2, 6)),
 (5, "car_add", "だい", "🚗", "ちゅうしゃじょうに くるまが {a:だい} とまって います。{b:だい} きました。ぜんぶで なんだいに なりましたか？", lambda a, b: a + b, [("🚗", "a", ""), ("🚗", "b", "in")], (3, 9), (2, 8)),
 (5, "paper_sub", "まい", "🟥", "おりがみが {a:まい} あります。ともだちに {b:まい} あげました。のこりは なんまいですか？", lambda a, b: a - b, [("🟥", "a", "", "b")], (6, 14), (2, 6)),
 # lv6
 (6, "line_behind", "にん", "🧒", "{a:にん}が 1れつに ならんで います。ぴょんは まえから {p}ばんめです。ぴょんの うしろには なんにん いますか？", lambda a, p: a - p, [("line", "a", "p")], (6, 12), (2, 5)),
 (6, "bus_two", "にん", "🚌", "バスに {a:にん} のって います。バスていで {b:にん} おりて、{c:にん} のりました。いま バスには なんにん のって いますか？", lambda a, b, c: a - b + c, [], (6, 12), (2, 5), (1, 6)),
 (6, "line_both", "にん", "🧒", "まるシマは まえから {p}ばんめ、うしろから {q}ばんめに ならんで います。みんなで なんにん ならんで いますか？", lambda p, q: p + q - 1, [], (2, 8), (2, 8)),
 (6, "donguri_diff", "こ", "🌰", "どんぐりを ぴょんは {a:こ}、がおは {b:こ} ひろいました。がおは ぴょんより なんこ おおく ひろいましたか？", lambda a, b: b - a, [("🌰", "a", ""), ("🌰", "b", "")], (3, 8), (9, 15)),
 (6, "candy_two", "こ", "🍬", "あめが {a:こ} ありました。ママに {b:こ} もらって、{c:こ} たべました。いま なんこ ありますか？", lambda a, b, c: a + b - c, [], (3, 9), (2, 6), (1, 5)),
 (6, "balloon_three", "こ", "🎈", "あかい ふうせんが {a:こ}、あおい ふうせんが {b:こ}、きいろい ふうせんが {c:こ} あります。ふうせんは ぜんぶで なんこ ありますか？", lambda a, b, c: a + b + c, [("🔴", "a", ""), ("🔵", "b", ""), ("🟡", "c", "")], (2, 6), (2, 6), (1, 5)),
]
VARS = "abc"
KJ = {"こ": "個", "ほん": "本", "わ": "羽", "ひき": "匹", "だい": "台", "まい": "枚", "にん": "人"}
NANK = {c: "何" + KJ[c] for c in KJ}
def fill(t, vals, names):  # よみあげ用：かずは すうじ＋かんじ（VOICEVOX が ただしく よめる）
    import re
    t = re.sub(r"\{([a-z])(?::([^}]+))?\}", lambda m: f"{vals[names.index(m.group(1))]}{KJ[m.group(2)] if m.group(2) else ''}", t)
    for c, w in NAN.items(): t = t.replace(w, NANK[c])
    return t.replace("1れつ", "1列").replace("ばんめ", "番目")
def disp(t, vals, names):  # がめんの もじ：かずは すうじ
    import re
    return re.sub(r"\{([a-z])(?::([^}]+))?\}", lambda m: f"{vals[names.index(m.group(1))]}{m.group(2) or ''}", t)
def wrap(s, n=16):
    out, line = [], ""
    for w in s.split(" "):
        cand = (line + " " + w) if line else w
        if len(cand) > n and line: out.append(line); line = w
        else: line = cand
    if line: out.append(line)
    return out

words = []
for spec in WP:
    lv, tid, c, emo, text, f, pic = spec[:7]; ranges = spec[7:]
    names = ["p", "q"] if tid == "line_both" else (["a", "p"] if tid == "line_behind" else list(VARS[:len(ranges)]))
    seen = set(); k = 0; tries = 0
    while k < 5 and tries < 500:
        tries += 1; vals = [random.randint(*r) for r in ranges]; x = f(*vals)
        if not (1 <= x <= 20) or tuple(vals) in seen: continue
        if tid.endswith("_sub") and vals[1] >= vals[0]: continue
        if tid == "line_behind" and vals[1] >= vals[0]: continue
        if tid == "bus_two" and vals[1] >= vals[0]: continue
        if tid == "candy_two" and vals[2] > vals[0] + vals[1] - 1: continue
        seen.add(tuple(vals)); key = f"sn_w_{tid}_{k}"
        words.append({"key": key, "lv": lv, "c": c, "emo": emo, "x": x, "say": fill(text, vals, names), "lines": wrap(disp(text, vals, names)),
                      "pic": [[p[0], vals[names.index(p[1])] if p[1] in names else 0, p[2], (vals[names.index(p[3])] if len(p) > 3 else 0)] for p in pic] if pic and pic[0][0] != "line" else ([["line", vals[0], vals[1], 0]] if pic else []),
                      "vals": vals, "names": names})
        k += 1

data = {"items": {k: list(v) for k, v in ITEMS.items()}, "nan": NAN, "words": words,
        "ans": {c: {n: cnt(n, c) for n in range(1, 21)} for c in COUNTERS}, "num": {n: num(n) for n in range(0, 21)}}
(G / "board/sansu_data.js").write_text("/* さんすうコースの データ（sit/sansu_gen.py が かく） */\nconst SANSU = " + json.dumps(data, ensure_ascii=False) + ";\n")

NK = {0: "ゼ'ロ", 1: "イ'チ", 2: "ニ'", 3: "サ'ン", 4: "ヨ'ン", 5: "ゴ'", 6: "ロ'ク", 7: "ナ'ナ", 8: "ハ'チ", 9: "キュ'ウ", 10: "ジュ'ウ", 20: "ニ'ジュウ"}
def numk(n): return NK[n] if n in NK else "ジュウ" + NK[n - 10]
AK = {"こ": ["イ'ッコ", "ニ'コ", "サ'ンコ", "ヨ'ンコ", "ゴ'コ", "ロ'ッコ", "ナナ'コ", "ハ'ッコ", "キュ'ウコ", "ジュ'ッコ"],
 "ほん": ["イ'ッポン", "ニ'ホン", "サ'ンボン", "ヨ'ンホン", "ゴ'ホン", "ロ'ッポン", "ナナ'ホン", "ハ'ッポン", "キュ'ウホン", "ジュ'ッポン"],
 "わ": ["イ'チワ", "ニ'ワ", "サ'ンワ", "ヨ'ンワ", "ゴ'ワ", "ロ'クワ", "ナ'ナワ", "ハ'チワ", "キュ'ウワ", "ジュ'ウワ"],
 "ひき": ["イッピ'キ", "ニヒ'キ", "サンビ'キ", "ヨンヒ'キ", "ゴヒ'キ", "ロッピ'キ", "ナナヒ'キ", "ハッピ'キ", "キュウヒ'キ", "ジュッピ'キ"],
 "だい": ["イチ'ダイ", "ニ'ダイ", "サ'ンダイ", "ヨ'ンダイ", "ゴ'ダイ", "ロク'ダイ", "ナナ'ダイ", "ハチ'ダイ", "キュウ'ダイ", "ジュウ'ダイ"],
 "まい": ["イチ'マイ", "ニ'マイ", "サ'ンマイ", "ヨ'ンマイ", "ゴ'マイ", "ロク'マイ", "ナナ'マイ", "ハチ'マイ", "キュウ'マイ", "ジュウ'マイ"],
 "にん": ["ヒト'リ", "フタリ'", "サ'ンニン", "ヨ'ニン", "ゴ'ニン", "ロ'クニン", "ナナ'ニン", "ハチ'ニン", "キュ'ウニン", "ジュ'ウニン"]}
AK20 = {"こ": "ニジュ'ッコ", "ほん": "ニジュ'ッポン", "わ": "ニジュ'ウワ", "ひき": "ニジュッピ'キ", "だい": "ニジュウ'ダイ", "まい": "ニジュウ'マイ", "にん": "ニジュ'ウニン"}
def ansk(n, c):
    if n <= 10: return AK[c][n - 1]
    if n == 20: return AK20[c]
    if c == "にん" and n - 10 in (1, 2): return {11: "ジュウイチ'ニン", 12: "ジュウニ'ニン"}[n]
    return "ジュウ" + AK[c][n - 11]
pony = []
P = lambda k, t, kana=None: pony.append([k, t, {}, kana])
for n in range(0, 21): P(f"sn_n_{n}", num(n), numk(n))
for c in COUNTERS:
    for n in range(1, 21): P(f"sn_a_{c}_{n}", cnt(n, c), ansk(n, c))
P("sn_plus", "たす"); P("sn_minus", "ひく"); P("sn_wa", "は？"); P("sn_ok", "せいかい！"); P("sn_ng", "ちがうよ。もう いちど かんがえて みよう"); P("sn_ans", "こたえは")
P("sn_ask_calc", "けいさん してみよう", "ケイサン'、シテミ'ヨオ"); P("sn_ask_r", "ちゅうくん、こたえは？"); P("sn_teach", "ちゅうくんに こたえを おしえて あげよう。ただしい カードを タッチしてね", "チュウクンニ'、コタエオ'、オシエテ'、アゲヨオ'、タダシ'イ、カ'アドオ、タ'ッチシテネ")
P("sn_touch", "こたえの カードを タッチしてね。こえで いっても いいよ")
for k, (e, nm, c) in ITEMS.items():
    P(f"sn_q_count_{k}", f"{nm}は {NANK[c]}？"); P(f"sn_q_add_{k}", f"{nm}は、あわせて {NANK[c]}？"); P(f"sn_q_sub_{k}", f"{nm}は、のこり {NANK[c]}？")
for w in words: P(w["key"], w["say"])
P("p_blk_sansu", "のっぽせんせいが こくばんを けして いるよ"); P("blk_sansu", "せんせい、とおして ください")
P("ev_sansuf", "けいさんが はやく できた！ 2マス すすむよ"); P("ev_sansub", "けしゴムを おとした！ 2マス もどるよ"); P("ev_sansuh", "さんすうセットを わすれた！ スタートに もどるよ")
json.dump(pony, open("/tmp/pony_sansu.json", "w"), ensure_ascii=False)

lines, yomi = [], {}
def A(k, t, y): lines.append({"key": k, "who": "chu", "text": t}); yomi[k] = y
for n in range(0, 21): A(f"csn_n_{n}", num(n) + "！", num(n) + "！")
for c in COUNTERS:
    for n in range(1, 21): A(f"csn_a_{c}_{n}", cnt(n, c) + "！", f"{n}{KJ[c]}！")
lines.append({"key": "rs_sansu", "who": "nobbo", "text": "はい、どうぞ。けいさん、がんばってね"}); yomi["rs_sansu"] = "はい、どうぞ。計算、頑張ってね"
J = R / "tools/aivis/jobs/st18"; J.mkdir(parents=True, exist_ok=True)
(J / "lines.json").write_text(json.dumps(lines, ensure_ascii=False, indent=0)); (J / "yomi.json").write_text(json.dumps(yomi, ensure_ascii=False, indent=1))
print(len(words), "word problems /", len(pony), "pony /", len(lines), "aivis")
for w in words[:3] + words[-3:]: print(w["key"], w["x"], w["lines"], w["pic"])
# ちゅうの こたえの アクセント（ぽにーと おなじ よみ）
SMALL = set("ャュョァィゥェォ")
def acc1(k):
    pre, post = k.split("'") if "'" in k else (k, "")
    m = sum(1 for ch in pre if ch not in SMALL)
    return [[pre + post + "!", max(1, m)]]
ACC = {f"csn_n_{n}": acc1(numk(n)) for n in range(0, 21)}
for c in COUNTERS:
    for n in range(1, 21): ACC[f"csn_a_{c}_{n}"] = acc1(ansk(n, c))
(J / "acc.json").write_text(json.dumps(ACC, ensure_ascii=False, indent=0))
print("acc", len(ACC), ACC["csn_a_ほん_8"], ACC["csn_n_18"])
