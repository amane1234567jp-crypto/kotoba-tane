/* ================= えきの だいぼうけん（ちょうロング）の 課題「⏱ 30びょう いえるかな」（2026-10-17） =================
   おだいに あう ことばを 30びょうで いくつ いえるか。いえた ことばは カードに なって つみあがる（おなじ ことばは 1かい）。
   おだいごとに こたえの こうほ（ひらがな｜かんじ）を もって いて、あう ものだけ かぞえる。
   いえた かずで すすむ：1〜2こ=1、3〜4こ=2、5〜6こ=3、7こいじょう=4マス。いちばん おおく いえた ひとを ゴールで はっぴょう。 */
const SJ_TOPICS = [
  { id: "eki", title: "えきに ある もの", emo: "🚉", words: "でんしゃ|電車 せんろ|線路 ホーム きっぷ|切符 かいさつ|改札 えきいん|駅員 ベンチ とけい|時計 かいだん|階段 エスカレーター エレベーター じはんき|自販機|自動販売機 トイレ ばいてん|売店 キオスク けいじばん|掲示板 じこくひょう|時刻表 ろせんず|路線図 アナウンス しんごう|信号 ふみきり|踏切|踏み切り しゃしょう|車掌 うんてんし|運転士|運転手 スイカ|Suica|suica ドア つりかわ|吊り革|つり革 あみだな|網棚 ざせき|座席 シート まど|窓 えきべん|駅弁 ごみばこ|ゴミ箱 はしら|柱 てんじブロック|点字ブロック しんかんせん|新幹線 かんばん|看板 ちず|地図 こうばん|交番 タクシー バス ポスター いす|椅子 やね|屋根 はと|鳩 パン おべんとう|弁当 ジュース みどりのまどぐち|みどりの窓口 マーク でんき|電気 ちゅうりんじょう|駐輪場 ロッカー" },
  { id: "norimono", title: "のりもの", emo: "🚗", words: "でんしゃ|電車 しんかんせん|新幹線 バス タクシー くるま|車 じてんしゃ|自転車 ひこうき|飛行機 ふね|船 ヘリコプター トラック しょうぼうしゃ|消防車 きゅうきゅうしゃ|救急車 パトカー オートバイ バイク ロケット きしゃ|汽車 モノレール ケーブルカー ロープウェイ ボート ヨット せんすいかん|潜水艦 ショベルカー ブルドーザー クレーン ごみしゅうしゅうしゃ|ゴミ収集車|ごみ収集車 ベビーカー いちりんしゃ|一輪車 スケボー|スケートボード キックボード そり ききゅう|気球 ひこうせん|飛行船 ちかてつ|地下鉄 ろめんでんしゃ|路面電車 リニア トロッコ フェリー カヌー ゆうびんしゃ|郵便車 ダンプ ミキサーしゃ|ミキサー車 れいきゅうしゃ ジェットき|ジェット機 ゴンドラ じんりきしゃ|人力車 ばしゃ|馬車 うちゅうせん|宇宙船 ユーフォー|UFO" },
  { id: "aka", title: "あかい もの", emo: "🍎", words: "りんご|林檎 いちご|苺 トマト ポスト しょうぼうしゃ|消防車 たいよう|太陽 さくらんぼ すいか|西瓜 ケチャップ とうがらし|唐辛子 かに|蟹|カニ きんぎょ|金魚 てんとうむし|てんとう虫 ばら|薔薇|バラ チューリップ もみじ|紅葉 ランドセル しんごう|信号 くちびる|唇 ハート サンタ うめぼし|梅干し たらこ いくら まぐろ|マグロ パプリカ ほのお|炎 ゆうひ|夕日 ポインセチア あかちゃん|赤ちゃん ふうせん|風船 クレヨン えのぐ|絵の具 リボン いちごジャム ラズベリー ざくろ|石榴 カーネーション ひのまる|日の丸 とりい|鳥居 だるま|達磨 かえんだま キムチ たこ|タコ えび|海老|エビ" },
  { id: "tabemono", title: "たべもの", emo: "🍙", words: "ごはん|ご飯 パン カレー ラーメン うどん そば|蕎麦 すし|寿司|お寿司 ハンバーグ ハンバーガー ポテト ピザ からあげ|唐揚げ|から揚げ たまごやき|卵焼き おにぎり みそしる|味噌汁 サラダ スパゲッティ パスタ オムライス ぎょうざ|餃子 ステーキ やきにく|焼肉|焼き肉 さかな|魚 にく|肉 たまご|卵|玉子 チーズ ヨーグルト ケーキ アイス チョコ クッキー プリン ドーナツ せんべい|煎餅 だんご|団子 あめ|飴 ガム りんご|林檎 バナナ みかん いちご|苺 ぶどう|葡萄 もも|桃 メロン すいか|西瓜 なし|梨 かき|柿 キウイ パイナップル トマト きゅうり にんじん|人参 たまねぎ|玉ねぎ じゃがいも キャベツ レタス ブロッコリー なす|茄子 ピーマン かぼちゃ とうもろこし えだまめ|枝豆 なっとう|納豆 とうふ|豆腐 ソーセージ ウインナー ハム ベーコン グラタン シチュー コロッケ てんぷら|天ぷら おでん やきそば|焼きそば たこやき|たこ焼き おこのみやき|お好み焼き ホットケーキ パンケーキ クレープ ゼリー わたあめ|綿あめ|綿飴 ポップコーン" },
  { id: "doubutsu", title: "どうぶつ", emo: "🐶", words: "いぬ|犬 ねこ|猫 うさぎ|兎 くま|熊 ライオン とら|虎 ぞう|象 きりん|キリン さる|猿 パンダ コアラ カンガルー ペンギン うし|牛 うま|馬 ぶた|豚 ひつじ|羊 やぎ|山羊 にわとり|鶏 ひよこ あひる かも|鴨 はと|鳩 からす すずめ ふくろう わし|鷲 たか|鷹 きつね|狐 たぬき|狸 りす|栗鼠 ねずみ|鼠 ハムスター もぐら かめ|亀 わに|鰐 へび|蛇 かえる|蛙 いるか くじら|鯨 さめ|鮫 たこ いか かに|蟹 えび|海老 しまうま|シマウマ かば|カバ さい|サイ ゴリラ チーター ひょう|豹 おおかみ|狼 しか|鹿 いのしし|猪 らくだ|ラクダ アルパカ カピバラ ラッコ あざらし アシカ セイウチ フラミンゴ くじゃく|孔雀 オウム インコ ちょう|蝶 かぶとむし|カブトムシ くわがた|クワガタ あり|蟻 はち|蜂 とんぼ せみ|蝉 バッタ てんとうむし|てんとう虫" },
];
const sjHira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
SJ_TOPICS.forEach(t => t.list = t.words.split(" ").map(w => { const v = w.split("|"); const hira = sjHira(v[0]); return { disp: v[0], keys: [...new Set([hira, ...v.slice(1).map(x => /^[ぁ-んァ-ヶー]+$/.test(x) ? sjHira(x) : x)])].filter(k => k.length >= 2 || /[一-龥]/.test(k)) }; }));
const SJ_BEST = { n: 0, kind: null };
const sjStep = n => n >= 7 ? 4 : n >= 5 ? 3 : n >= 3 ? 2 : n >= 1 ? 1 : 0;
async function slSanju(pc) {
  const T = SJ_TOPICS[rnd(SJ_TOPICS.length)]; const g = panel("⏱ 30びょう いえるかな", "#FFF8E6");
  el("rect", { x: 380, y: 150, width: 840, height: 120, rx: 26, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 232, `${T.emo} ${T.title}`, 62, { "text-anchor": "middle" });
  const bar = el("rect", { x: 200, y: 300, width: 1200, height: 30, rx: 15, fill: "#7BD389", ...S6(4) }, g);
  const cntT = txt(g, 1480, 236, "0", 90, { "text-anchor": "middle" }); txt(g, 1480, 140, "いえた かず", 28, { "text-anchor": "middle" });
  const cards = el("g", {}, g);
  await speak(C.pony, `sl_sj_intro_${T.id}`, `30びょうで、${T.title}を いくつ いえるかな？`);
  await speak(C.pony, "sl_sj_start", "よーい、スタート！"); blip(880, 1320, .25, "square");
  const got = []; const seen = new Set();
  const add = w => { if (seen.has(w.disp)) return; seen.add(w.disp); got.push(w.disp); const k = got.length - 1, col = k % 5, row = Math.floor(k / 5);
    const c = card(cards, 200 + col * 244, 370 + row * 130, 224, 110, w.disp, null, { fs: 44, fill: ["#FFE3B3", "#D7ECFF", "#FFE0E6", "#D7F0D2", "#EEE6FA"][k % 5] });
    c.setAttribute("transform", "translate(0 -30)"); tween(250, e => c.setAttribute("transform", `translate(0 ${(-30 * (1 - e)).toFixed(0)})`)); cntT.textContent = got.length; pop(700 + Math.min(got.length, 12) * 60); markAbove(pc, "sparkle"); };
  const judge = texts => { for (const t0 of texts) { const t = sjHira(t0.replace(/\s/g, "")); for (const w of T.list) if (!seen.has(w.disp) && w.keys.some(k => t.includes(k))) add(w); } };
  setListen(pc, true); taskListen && taskListen(true);
  const D = 30; let left = D; const h = srUsable ? hear(judge, D * 1000 + 500) : null; window.__sjJudge = judge; // テスト用
  await new Promise(res => addTick(dt => { if (!g.isConnected) { res(); return false; } left -= dt; bar.setAttribute("width", Math.max(0, 1200 * left / D).toFixed(0)); if (left < 5) bar.setAttribute("fill", "#FF8FA3");
    if (left <= 0) { res(); return false; } }));
  if (h) h.stop(); setListen(pc, false); taskListen && taskListen(false); window.__sjJudge = null;
  noise(.2, 2000, .4); blip(1320, 660, .4, "square"); await speak(C.pony, "sl_sj_end", "そこまで！");
  const n = got.length; confetti(n >= 5 ? 60 : 30); await speak(C.pony, `sl_sj_n_${Math.min(n, 30)}`, n ? `${n}こ いえたね！` : "ざんねん、0こ だったね");
  if (n > SJ_BEST.n) { const first = SJ_BEST.n === 0; SJ_BEST.n = n; SJ_BEST.kind = pc.kind; if (!first) { chime(); await speak(C.pony, "sl_sj_best", "あたらしい きろくだ！"); } }
  playLog({ type: "sanju", topic: T.id, n, words: got.join("・"), who: NAMES[pc.kind] }); if (n >= 3) grade(true);
  await sleep(500); g.remove(); await delta(pc, sjStep(n)); return n >= 3;
}
Object.assign(LTASK_RUN, { sanju: slSanju }); Object.assign(LTASK, { sanju: ["#FFC6E0", "⏱"] });
// えきの コースは ことばの マスの いくつかを「30びょう いえるかな」に
{ const O = SL_ORDER.eki, T = LONG_TASKS.eki; const cand = O.filter(id => T[id] && !["sanju"].includes(T[id])); [5, 13, 21, 29, 37, 43].forEach(i => { const id = cand[Math.min(cand.length - 1, Math.round(i / 48 * cand.length))]; if (id) T[id] = "sanju"; }); }
// ゴールで「30びょう ゲームの チャンピオン」を はっぴょう
{ const em = endingMulti; endingMulti = async function () { if (curStage === "eki" && SJ_BEST.n > 0 && SJ_BEST.kind) { await sleep(400); showBanner("⏱ 30びょう チャンピオン", 1800); await speak(C.pony, `sl_sj_champ_${SJ_BEST.kind}`, `30びょう ゲームの チャンピオンは、${NAMES[SJ_BEST.kind]}！`); await speak(C.pony, `sl_sj_n_${Math.min(SJ_BEST.n, 30)}`, `${SJ_BEST.n}こ いえたね！`); confetti(60); await sleep(600); }
    SJ_BEST.n = 0; SJ_BEST.kind = null; return em(); }; }
{ const ns = newGame; newGame = function (o = {}) { SJ_BEST.n = 0; SJ_BEST.kind = null; return ns(o); }; }
