"""かんがえる ジャンル（そうぞう・たちば・さきよみ・ちょっと まって・あいての サイン）の 直し（2026-10-29 ぜんたい チェック）
板 データ（board/*_data.js）を 直接 直す。各 *_gen.py を 動かし直した ときは、この スクリプトも もう一度 動かす。
python3 tools/game/sit/kangaeru_fix.py → *_data.js を 書きかえ、aivis/jobs/kg1（相手の せりふ）と /tmp/pony_kg1.json（ぽにー）を 作る"""
import json, re, subprocess
from pathlib import Path
G = Path(__file__).resolve().parents[1]; R = G.parents[1]
FAM = ["pyonmama", "gaomama", "miimama", "chumama"]
def load(name):
    js = subprocess.run(["node", "-e", f"const vm=require('vm'),fs=require('fs');const c={{window:{{}}}};vm.createContext(c);vm.runInContext(fs.readFileSync('{G}/board/{name}_data.js','utf8').replace(/^const /gm,'var '),c);const o={{}};for(const k of Object.keys(c))if(k!=='window')o[k]=c[k];console.log(JSON.stringify(o))"], capture_output=True, text=True, check=True).stdout
    return json.loads(js)
def save(name, var, arr, txt, head):
    (G / f"board/{name}_data.js").write_text(f"/* {head} */\nconst {var} = " + json.dumps(arr, ensure_ascii=False) + ";\nvar S11_TXT = Object.assign(window.S11_TXT || {}, " + json.dumps(txt, ensure_ascii=False) + ");\n")
aiv, Y, pony = [], {}, []
def A(key, who, t, y): aiv.append({"key": key, "who": who, "text": t}); Y[key] = y
def subjKeys(sc, pre, kind, t, y):  # kind: s/t/r（say/think/res）。ママは 4人の ママの ぶんも
    whos = [sc["subj"]] + (FAM if sc["subj"] == "mama" else [])
    for w in whos: A(f"{pre}{kind}_{sc['id']}" + ("" if w == sc["subj"] else "_" + w), w, t, y)
def P(key, t): pony.append([key, t, {}, None])
by = lambda arr, i: next(x for x in arr if x["id"] == i)
# ---- そうぞう たんてい ----
d = load("souzou"); SZ, T = d["SZ"], d["S11_TXT"]
x = by(SZ, "shii"); x["think"] = "しずかに して ほしいな"; subjKeys(x, "sz", "t", x["think"], "静かにしてほしいな")
x = by(SZ, "hanashi"); x["think"] = "しずかに なるまで、まって いよう"; subjKeys(x, "sz", "t", x["think"], "静かになるまで、待っていよう")
x = by(SZ, "akubi"); x["act"][0] = "ほかの こと しよう？"; x["act"][2] = [["ほかの", "他の", "なに", "何", "したい", "しよう"]]; T["sz_akubi_a0"] = x["act"][0]; P("sz_akubi_a0", x["act"][0])
x = by(SZ, "present"); x["say"] = "あの……これ、どうぞ"; subjKeys(x, "sz", "s", x["say"], "あの……これ、どうぞ")
save("souzou", "SZ", SZ, T, "「そうぞう たんてい」コースの データ（sit/souzou_gen.py が かく。sit/kangaeru_fix.py で 直し）")
# ---- じぶんの たちば ----
d = load("tachiba"); TB, T = d["TB"], d["S11_TXT"]
x = by(TB, "irasshai"); x["say"] = "……こんにちは"; subjKeys(x, "tb", "s", x["say"], "……こんにちは")
for i in ("irasshai", "erande"): x = by(TB, i); x["role"][1] = "うちの ひと"; x["role"][2] = [["うちの", "家の", "おうちの"]]; T[f"tb_{i}_r"] = T[f"tb_{i}_r"].replace("おもてなし", "うちの ひと"); P(f"tb_{i}_r", T[f"tb_{i}_r"])
x = by(TB, "gourei"); x["think"] = "みんな、ごうれいを まって いるな"; subjKeys(x, "tb", "t", x["think"], "みんな、号令を待っているな")
x = by(TB, "ichinen"); x["think"] = "おれいを いって くれるかな"; subjKeys(x, "tb", "t", x["think"], "お礼を言ってくれるかな"); x["other"] = ["👦", "おにいさん"]
x = by(TB, "kubaru"); x["why"][0] = "ひとりだけ おおいと、たりない ひとが でるから"; x["why"][1] = [["おおい", "多い", "たりない", "足りない"]]; T["tb_kubaru_w"] = x["why"][0]; P("tb_kubaru_w", x["why"][0])
x = by(TB, "pass"); x["role"][1] = "チームの なかま"
x = by(TB, "kiku"); x["act"][0] = "しずかに きく"; x["act"][1] = "おわってから はくしゅ。すごかったよ"; x["act"][2] = [["しずか", "静か", "きく", "聞く", "はくしゅ", "拍手", "すごかった"]]; T["tb_kiku_a0"] = x["act"][0]; T["tb_kiku_a1"] = x["act"][1]; P("tb_kiku_a0", x["act"][0]); P("tb_kiku_a1", x["act"][1])
save("tachiba", "TB", TB, T, "「じぶんの たちば」コースの データ（sit/tachiba_gen.py が かく。sit/kangaeru_fix.py で 直し）")
# ---- さきよみ ----
d = load("sakiyomi"); SK, T = d["SK"], d["S11_TXT"]
x = by(SK, "iikaesu"); x["plan"][0] = "ちゅうくん、その いいかた、いやだったよ"; x["plan"][1] = [["いいかた", "言い方"], ["いや", "嫌"]]; T["sk_iikaesu_pl"] = x["plan"][0]; P("sk_iikaesu_pl", x["plan"][0])
x = by(SK, "test"); x["a"][3] = "えんぴつが まるくて こまる"; x["b"][0] = "✏"; T["sk_test_oa"] = x["a"][3]; P("sk_test_oa", x["a"][3])
x = by(SK, "oyatsu"); x["say"] = "おやつ、たくさん もらったから ここに おいて おくね"; subjKeys(x, "sk", "s", x["say"], "おやつ、たくさんもらったからここに置いておくね")
x = by(SK, "atsui"); x["why"][0] = "あついと ふらふらに なるから、ぼうしと すいとうを もつ"; x["why"][1] = [["ふらふら", "あつい", "暑い"], ["ぼうし", "帽子", "すいとう", "水筒"]]; T["sk_atsui_w"] = x["why"][0]; P("sk_atsui_w", x["why"][0])
save("sakiyomi", "SK", SK, T, "「さきよみ」コースの データ（sit/sakiyomi_gen.py が かく。sit/kangaeru_fix.py で 直し）")
# ---- ちょっと まって ----
d = load("chotto"); CM, T = d["CM"], d["S11_TXT"]
x = by(CM, "inu"); x["checks"][0][1] = "かいぬしさんは いる？"
save("chotto", "CM", CM, T, "「ちょっと まって」コースの データ（sit/chotto_gen.py が かく。sit/kangaeru_fix.py で 直し）")
# ---- あいての サイン ----
d = load("aite"); AS, T, SIGN = d["AS"], d["S11_TXT"], d["AS_SIGN"]
x = by(AS, "omocha"); x["res"] = "こちらこそ、ありがとう"; subjKeys(x, "as", "r", x["res"], "こちらこそ、ありがとう"); T["as_omocha_n"] = T["as_omocha_n"].replace("おもちゃ", "クレヨン"); P("as_omocha_n", T["as_omocha_n"])
x = by(AS, "haizen"); x["res"] = "はい。これからも おねがいしますね"; subjKeys(x, "as", "r", x["res"], "はい。これからもお願いしますね")
x = by(AS, "doa"); x["say"][0] = "どういたしまして"; x["say"][1] = "どういたしまして。にもつ、おもそうですね"; x["say"][2] = [["どういたしまして", "どう いたしまして", "おもそう", "重そう"]]; P("as_doa_a0", x["say"][0]); P("as_doa_a1", x["say"][1])
x = by(AS, "sasou"); x["say"][0] = "じゃあ、いこう！"; x["say"][1] = "じゃあ、おにごっこ しよう"; x["say"][2] = [["いこう", "行こう", "しよう", "おにごっこ"]]; P("as_sasou_a0", x["say"][0]); P("as_sasou_a1", x["say"][1])
x = by(AS, "hanashi"); x["mv"] = "pump"
x = by(AS, "chikai"); x["me"] = "みいちゃんに ちかすぎたね"; P("as_chikai_m", x["me"])
x = by(AS, "rule"); x["teach"] = x["teach"].replace("こまってるよ", "がっかり してるよ"); P("as_rule_teach", x["teach"]) if "as_rule_teach" in T else None; T["as_rule_teach"] = x["teach"]
(G / "board/aite_data.js").write_text("/* 「あいての サイン」コースの データ（sit/aite_gen.py が かく。sit/kangaeru_fix.py で 直し） */\nconst AS_SIGN = " + json.dumps(SIGN, ensure_ascii=False) + ";\nconst AS = " + json.dumps(AS, ensure_ascii=False) + ";\nvar S11_TXT = Object.assign(window.S11_TXT || {}, " + json.dumps(T, ensure_ascii=False) + ");\n")
J = R / "tools/aivis/jobs/kg1"; J.mkdir(parents=True, exist_ok=True)
(J / "lines.json").write_text(json.dumps(aiv, ensure_ascii=False, indent=1)); (J / "yomi.json").write_text(json.dumps(Y, ensure_ascii=False, indent=1))
Path("/tmp/pony_kg1.json").write_text(json.dumps(pony, ensure_ascii=False, indent=0))
print(len(aiv), "aivis", len(pony), "pony")
