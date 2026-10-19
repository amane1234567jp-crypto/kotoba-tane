/* ================= ショートコース 8つ（2026-10-19 その2） =================
   台本は sit/sits_new8.py。きりかえ・ききかえす・まつ（こえの ものさし）・からだと かんかくの SOS・じゅんばん（カードならべ）・ことわる・ぼうさい・でんわ。
   場面の うごきは データ（s.an＝[うごき, 絵文字, ヒント]）から つくる。ききかえす・でんわ の 一部は 声を かこう（VFX）して、ふきだしも ぜんぶは 見せない（qs）。
   でんわで なのる 名前は、こたえる 子の キャラの なまえ（答えの「〇〇」を おきかえ、ぽにーの お手本は sa_<id>_<段>_<キャラ>）。 */
const S10L = ["kirikae", "kikikaesu", "matsu", "sos", "junban", "kotowaru", "bousai", "denwa"];
Object.assign(RIVAL_OF, { kirikae: "mii", kikikaesu: "kon", matsu: "gao", sos: "pyon", junban: "kon", kotowaru: "mii", bousai: "gao", denwa: "mii" });
const S10_READY = false; /* 声が そろうまで「じゅんびちゅう」 */
STAGES.push(
  { id: "kirikae", name: "きりかえ", icon: "🔄", ready: S10_READY }, { id: "kikikaesu", name: "ききかえす", icon: "👂", ready: S10_READY },
  { id: "matsu", name: "まつ・こえの ものさし", icon: "🤫", ready: S10_READY }, { id: "sos", name: "からだの SOS", icon: "🙉", ready: S10_READY },
  { id: "junban", name: "じゅんばんに いおう", icon: "🔢", ready: S10_READY }, { id: "kotowaru", name: "ことわる", icon: "✋", ready: S10_READY },
  { id: "bousai", name: "じしん・かじ", icon: "🚨", ready: S10_READY }, { id: "denwa", name: "でんわ", icon: "📞", ready: S10_READY });
const S10 = SITS.filter(s => S10L.includes(s.stage));
S10.forEach(s => ASK_ON_STAGE.add(s.intro));
S10.filter(s => ["sad", "ears", "sick", "tired", "shiver", "quake", "siren", "itchy"].includes((s.an || [])[0]) || s.help).forEach(s => SOFT_INTRO.add(s.intro));
/* ---------- 声の かこう・ふきだし ---------- */
const QS10 = {};
S10.forEach(s => { const ks = ["sq_" + s.id, ...["pyonmama", "gaomama", "miimama", "chumama"].map(m => `sq_${s.id}_${m}`)];
  ks.forEach(k => { if (s.fx) VFX[k] = s.fx; if (s.qs) QS10[k] = s.qs; }); });
{ const sp = speak; speak = function (c, key, text) {
    if (QS10[key]) text = QS10[key];
    if (NM10.kind && /^sa_dw/.test(key) && AUD[key + "_" + NM10.kind]) key = key + "_" + NM10.kind;
    return sp(c, key, text); }; }
// でんわ：なまえの 「〇〇」を こたえる 子の なまえに
const NM10 = { kind: null };
{ const ps = pickSit; pickSit = function (place, heroKind = "shima") { const s = ps(place, heroKind); NM10.kind = null;
    if (!s || !s.nm) return s; NM10.kind = heroKind; const nm = NAMES[heroKind] || "";
    return { ...s, tiers: s.tiers.map(t => ({ ...t, a: t.a.replace(/〇〇/g, nm), ...(t.wrong ? { wrong: t.wrong.replace(/〇〇/g, nm) } : {}) })) }; }; }
/* ---------- 場面の うごき ---------- */
function intro10(h, a, s) { return (async () => {
  const [m, e, lb] = s.an || ["look", "", ""], who = s.help ? a : h;
  if (s.extras) exKids([980]).forEach(c => stay(c));
  if (m === "sit") await desk8(h); else { enter(h); await sleep(900); }
  if (m === "phone") { ring3(); await sleep(500); window.__ph10 = hp7(h, "phone", .4); }
  const act = {
    ears: c => { c.armL.t = -150; c.armR.t = -150; hold(c, "shiver", 1.4); c.sadMouth = true; later(1600, () => { c.armL.t = c.armR.t = 0; }); for (let i = 0; i < 4; i++) later(i * 300, () => noise(.12, 1500 + rnd(1500), .25)); },
    squint: c => { hold(c, "squint", 1.6); c.armR.t = -120; later(1600, () => c.armR.t = 0); },
    itchy: c => { c.armL.t = -110; hold(c, "shiver", 1); c.sadMouth = true; later(1300, () => c.armL.t = 0); },
    sick: c => { c.sadMouth = true; c.headY.t = 14; hold(c, "squint", 1.6); later(1700, () => c.headY.t = 0); },
    tired: c => { c.sadMouth = true; c.squash.t = .92; for (let i = 0; i < 3; i++) later(i * 350, () => markAbove(c, "puff", { dx: 80 })); later(1600, () => c.squash.t = 1); },
    shiver: c => { hold(c, "shiver", 1.6); markAbove(c, "drop", { dx: 100 }); },
    quake: c => { shake(1400, 22); noise(1.2, 120, .6); playMove(c, "crouch"); },
    bell: c => { for (let i = 0; i < 10; i++) later(i * 120, () => blip(1800, 1800, .08, "square")); surprise(c); },
    siren: c => { for (let i = 0; i < 4; i++) later(i * 500, () => blip(700, 1100, .45, "sine")); hold(c, "shiver", 1.4); },
    phone: c => playMove(c, "look"), sit: c => playMove(c, "look"),
  };
  (act[m] || (c => playMove(c, m)))(who);
  if (e) (s.help ? hint8 : hint7)(who, e, lb);
  await sleep(1200); })(); }
S10.forEach(s => INTRO[s.intro] = (h, a) => intro10(h, a, s));
{ const rs = resolve; resolve = async function (s, h, a, ok) { if (window.__ph10) { window.__ph10.remove(); window.__ph10 = null; } return rs(s, h, a, ok); }; }

/* ---------- 🤫 こえの ものさし（まつ の a3・c2 マス） ---------- */
const MZ = [
  { id: "tosho", e: "📚", p: "としょしつ", lv: 1, t: "この ほん、かりたいです", keys: [["ほん", "本"], ["かりたい", "借りたい"]] },
  { id: "byouin", e: "🏥", p: "びょういんの まちあい", lv: 1, t: "ママ、トイレに いきたい", keys: [["といれ", "トイレ"], ["いきたい", "行きたい"]] },
  { id: "densha", e: "🚃", p: "でんしゃの なか", lv: 1, t: "つぎの えきで おりるね", keys: [["つぎ", "次"], ["おりる", "降りる"]] },
  { id: "tonari", e: "👫", p: "となりの ともだちと はなす", lv: 2, t: "いっしょに かえろう", keys: [["いっしょ", "一緒"], ["かえろう", "帰ろう"]] },
  { id: "happyou", e: "🙋", p: "きょうしつで はっぴょう", lv: 3, t: "すきな たべものは カレーです", keys: [["すき", "好き"], ["かれー", "カレー"]] },
  { id: "ouen", e: "📣", p: "うんどうかいで おうえん", lv: 4, t: "がんばれー！", keys: [["がんばれ", "頑張れ"]] },
  { id: "tooku", e: "🏃", p: "こうていの とおくの ともだち", lv: 5, t: "おーい、こっちだよー！", keys: [["おーい", "おい"], ["こっち"]] },
];
const MZ_LV = [["🤫", "ひそひそ"], ["🙂", "ちいさい"], ["😀", "ふつう"], ["😃", "おおきい"], ["📣", "とおくまで"]];
const MZ_USED = new Set();
async function mzRun(heroKind) {
  let pool = MZ.filter(x => !MZ_USED.has(x.id)); if (!pool.length) { MZ_USED.clear(); pool = MZ; } const it = pool[rnd(pool.length)]; MZ_USED.add(it.id);
  const pc = C[heroKind] || C.shima, g = panel("こえの ものさし", "#F4EEFF");
  el("rect", { x: 380, y: 130, width: 840, height: 220, rx: 30, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 520, 285, it.e, 130, { "text-anchor": "middle" }); txt(g, 900, 270, it.p, it.p.length > 9 ? 46 : 56, { "text-anchor": "middle" });
  await speak(C.pony, "mz_intro", "こえの ものさし！ ばしょに あう こえの おおきさを えらんでね"); await speak(C.pony, `mz_${it.id}_q`, `${it.p}。どの こえが いいかな？`);
  const cs = MZ_LV.map(([em, lb], i) => { const c = card(g, 130 + i * 272, 400, 250, 240, null, em, { es: 100 }); txt(c, 130 + i * 272 + 125, 470, String(i + 1), 46, { "text-anchor": "middle" }); txt(c, 130 + i * 272 + 125, 618, lb, 36, { "text-anchor": "middle" }); c.lv = i + 1; return c; });
  let wrong = 0;
  await new Promise(res => { let busy = false; cs.forEach(c => c.onclick = async () => { if (busy || c.dim) return; busy = true;
      const d = Math.abs(c.lv - it.lv); if (d <= (it.lv >= 4 ? 1 : 0)) { cs.forEach(x => x.onclick = null); c.rect.setAttribute("fill", "#FFE27A"); chime(); res(); return; }
      wrong++; c.dim = 1; c.setAttribute("opacity", .35); noise(.1, 700, .35); await speak(C.pony, c.lv > it.lv ? "mz_big" : "mz_small", c.lv > it.lv ? "それだと おおきすぎるかな" : "それだと ちいさすぎるかな"); busy = false; }); });
  await speak(C.pony, `mz_lv${it.lv}`, ["", "ここは、ひそひその こえが ちょうど いいね", "ここは、ちいさい こえが ちょうど いいね", "ここは、みんなに きこえる ふつうの こえが いいね", "ここは、おおきい こえで いいね", "ここは、とおくまで とどく こえで いいね"][it.lv]);
  // その こえで いって みる（マイクの おおきさを メーターに だす）
  showTask(it.t, `${it.lv}の こえで`, 260); await speak(C.pony, `mz_${it.id}_a`, it.t); unsay();
  const meter = el("rect", { x: 300, y: 860, width: 0, height: 36, rx: 18, fill: "#B9A8D9", ...S6(4) }, g); el("rect", { x: 300, y: 860, width: 1000, height: 36, rx: 18, fill: "none", ...S6(4) }, g);
  let an = null, peak = 0; try { if (MIC.stream && ctx) { const src = ctx.createMediaStreamSource(MIC.stream); an = ctx.createAnalyser(); an.fftSize = 512; src.connect(an); } } catch (e) { an = null; }
  const buf = new Uint8Array(512);
  addTick(() => { if (!g.isConnected) return false; let lv = 0; if (an) { an.getByteTimeDomainData(buf); let s = 0; for (const v of buf) s += (v - 128) ** 2; lv = Math.min(1, Math.sqrt(s / buf.length) / 40); } peak = Math.max(peak * .99, lv); meter.setAttribute("width", (1000 * peak).toFixed(0)); });
  let ok = false; for (let n = 0; n < 2 && !ok; n++) { setListen(pc, true); const r = await listen(it.keys, 8000); setListen(pc, false); ok = r.r === "ok"; if (!ok && n === 0) await speak(C.pony, "p_again", "もう いっかい いってみよう"); }
  hideTask();
  if (ok && an && it.lv <= 1 && peak > .85) await speak(C.pony, "mz_loud", "ことばは ばっちり！ もう すこし ちいさい こえだと もっと いいね");
  else if (ok && an && it.lv >= 5 && peak < .25) await speak(C.pony, "mz_quiet", "ことばは ばっちり！ もっと おおきな こえでも いいよ");
  else if (ok) { confetti(40); joy(C.pony); await speak(C.pony, "p_great", "すごい！ いえたね！"); }
  const good = ok && !wrong; grade(good); GS.tasks++; if (ok) GS.ok++;
  playLog({ type: "monosashi", id: it.id, wrong, ok, peak: Math.round(peak * 100), ...(MODE === "multi" ? { who: NAMES[heroKind] } : {}) });
  await sleep(400); g.remove(); return ok;
}
/* ---------- 🔢 カードならべ（じゅんばん の a3・c2 マス） ---------- */
const JB = [
  { id: "tearai", t: "てあらい", s: [["🚰", "みずで ぬらす"], ["🧼", "せっけんで あらう"], ["💦", "みずで ながす"], ["🧻", "タオルで ふく"]], k: [["みず", "水"], ["せっけん", "石鹸"], ["ながす", "流す", "ながし", "流し"], ["ふく", "拭く"]] },
  { id: "asa", t: "あさの したく", s: [["🫧", "かおを あらう"], ["👕", "きがえる"], ["🍚", "あさごはん"], ["🪥", "はみがき"]], k: [["かお", "顔"], ["きがえ", "着替え"], ["ごはん", "ご飯"], ["はみがき", "歯磨き"]] },
  { id: "curry", t: "カレーづくり", s: [["🔪", "やさいを きる"], ["🍳", "いためる"], ["💧", "みずを いれて にる"], ["🍛", "ルーを いれる"]], k: [["きる", "切る"], ["いため", "炒め"], ["にる", "煮る"], ["るー", "ルー"]] },
  { id: "hana", t: "はなの たねまき", s: [["🕳", "あなを ほる"], ["🌰", "たねを まく"], ["🟫", "つちを かける"], ["🚿", "みずを やる"]], k: [["あな", "穴"], ["たね", "種"], ["つち", "土"], ["みず", "水"]] },
  { id: "hikouki", t: "かみひこうき", s: [["📄", "はんぶんに おる"], ["📐", "かどを おる"], ["✈", "はねを おる"], ["🚀", "とばす"]], k: [["はんぶん", "半分"], ["かど", "角"], ["はね", "羽"], ["とばす", "飛ばす"]] },
  { id: "kutsu", t: "そとに いく まえ", s: [["🧦", "くつしたを はく"], ["👟", "くつを はく"], ["🧢", "ぼうしを かぶる"], ["🚪", "いってきます"]], k: [["くつした", "靴下"], ["くつ", "靴"], ["ぼうし", "帽子"], ["いってきま", "行ってきま"]] },
];
const JB_USED = new Set();
const jbSay = (st, n) => st.slice(0, n).map(([, l], i) => (i === 0 ? "まず " : n > 2 && i === n - 1 ? "さいごに " : i === 1 ? "つぎに " : "それから ") + l).join("、");
async function jbRun(heroKind) {
  let pool = JB.filter(x => !JB_USED.has(x.id)); if (!pool.length) { JB_USED.clear(); pool = JB; } const it = pool[rnd(pool.length)]; JB_USED.add(it.id);
  const t = tierOf(), n = t <= 0 ? 2 : t <= 1 ? 3 : 4, pc = C[heroKind] || C.shima, g = panel(`カードならべ：${it.t}`, "#F0FAEA");
  await speak(C.pony, "jbk_intro", "カードを じゅんばんに タッチしてね"); await speak(C.pony, `jbk_${it.id}_q`, `${it.t}は、どんな じゅんばん？`);
  const W = 1280 / n, slots = it.s.slice(0, n).map((s, i) => { const x = 160 + i * W; el("rect", { x: x + 10, y: 150, width: W - 20, height: 240, rx: 24, fill: "#FFFFFF", ...S6(4), "stroke-dasharray": "14 10" }, g); txt(g, x + W / 2, 140, String(i + 1), 40, { "text-anchor": "middle" }); return x; });
  const order = shuffle(it.s.slice(0, n).map((s, i) => ({ s, i })));
  const cs = order.map((o, j) => { const c = card(g, 160 + j * W + 10, 560, W - 20, 300, o.s[1], o.s[0], { es: 110, fs: 40 }); c.o = o; return c; });
  let placed = 0, wrong = 0;
  while (placed < n) { const j = await new Promise(res => cs.forEach((c, k) => { if (!c.done) c.onclick = () => res(k); })); cs.forEach(c => c.onclick = null);
    const c = cs[j]; if (c.o.i === placed) { c.done = true; flashCard(c, true); const dx = slots[placed] - (160 + j * W), dy = 150 - 560;
      tween(300, k => c.setAttribute("transform", `translate(${(dx * k).toFixed(0)} ${(dy * k).toFixed(0)}) scale(${1 - .2 * k})`)); blip(700 + placed * 120, 900, .1, "square"); placed++; }
    else { wrong++; flashCard(c, false); await sleep(450); c.rect.setAttribute("fill", "#FFF8E8"); } }
  chime(); await sleep(400);
  const line = jbSay(it.s, n); showTask(line, "じゅんばんに いおう", 260); await speak(C.pony, `jbk_${it.id}_${n}`, line); unsay();
  let ok = false; for (let m = 0; m < 2 && !ok; m++) { setListen(pc, true); const r = await listen(it.k.slice(0, n), 9000); setListen(pc, false); ok = r.r === "ok"; if (!ok && m === 0) await speak(C.pony, "p_again", "もう いっかい いってみよう"); }
  hideTask(); if (ok) { confetti(40); joy(C.pony); await speak(C.pony, "p_great", "すごい！ いえたね！"); } else { await speak(C.pony, "p_together", "いっしょに いおうね"); await speak(C.pony, `jbk_${it.id}_${n}`, line); }
  grade(ok && !wrong); GS.tasks++; if (ok) GS.ok++;
  playLog({ type: "cardorder", id: it.id, n, wrong, ok, ...(MODE === "multi" ? { who: NAMES[heroKind] } : {}) });
  await sleep(400); g.remove(); return ok;
}
{ const lc = landChild; landChild = async function (pc = P.shima) {
    if (!winner && KN_PC === pc && ["a3", "c2"].includes(pc.node) && (curStage === "matsu" || curStage === "junban")) {
      const dice = document.getElementById("dice"); if (dice) dice.style.visibility = "hidden";
      let ok = false; try { ok = await (curStage === "matsu" ? mzRun : jbRun)(pc.kind); } finally { if (dice) dice.style.visibility = ""; }
      if (ok) { if (pc.player) pc.player.ok++; await seedGet(pc); } return; }
    return lc(pc); }; }
EV_STYLE.monosashi = ["#E2D4FF", () => "🤫"]; EV_STYLE.cardorder = ["#C9EBB5", () => "🔢"];
{ const be = boardEvent; boardEvent = async function (pc) { const ev = (EVENTS[curStage] || {})[pc.node]; if (ev && (ev[0] === "monosashi" || ev[0] === "cardorder")) return; return be(pc); }; }

/* ---------- 盤 ---------- */
const SD10 = { kirikae: "#FFF6E0", kikikaesu: "#EAF6FF", matsu: "#F4EEFF", sos: "#FFF0F3", junban: "#F0FAEA", kotowaru: "#FFF3E6", bousai: "#FFF0E8", denwa: "#EAF6FF" };
const P10 = { kirikae: ["リビング", "こどもべや", "きょうしつ", "きょうしつ", "かえりみち", "ブランコ"], kikikaesu: ["きょうしつ", "きょうしつ", "だいどころ", "でんしゃ", "おかしや", "ほどう"],
  matsu: ["リビング", "きょうしつ", "はいぜん", "としょしつ", "まちあい", "でんしゃ"], sos: ["きょうしつ", "きょうしつ", "たいいくかん", "こどもべや", "えき", "げんかん"],
  junban: ["こどもべや", "こどもべや", "みずのみば", "だいどころ", "ずこうしつ", "こうてい"], kotowaru: ["きょうしつ", "こどもべや", "こうてい", "こうてい", "リビング", "すなば"],
  bousai: ["きょうしつ", "ろうか", "こうてい", "こうてい", "リビング", "ほどう"], denwa: Array(6).fill("リビング") };
S10L.forEach(id => { const P = P10[id], fills = {}; P.forEach((p, i) => fills[p] = FILL8[i % FILL8.length]);
  STAGE_DEF[id] = { ground: SD10[id], sky: "#CFEAFB", names: [P[0], P[1], P[2], P[2], P[3], P[3], P[4], P[4], P[5]], fills };
  board7(id, P, "hall"); });
const BG10 = { kirikae: ["🔄 きりかえ", "#E8735A", "🗓"], kikikaesu: ["👂 ききかえす", "#3E7FD6", "❓"], matsu: ["🤫 まつ", "#8E6FD6", "📏"], sos: ["🙉 からだの SOS", "#FF8FA3", "🆘"],
  junban: ["🔢 じゅんばん", "#4FA35A", "1️⃣"], kotowaru: ["✋ ことわる", "#F29F4C", "🙅"], bousai: ["🚨 じしん・かじ", "#E8473C", "⛑"], denwa: ["📞 でんわ", "#3EB489", "📱"] };
S10L.forEach(id => { const [t, c, e] = BG10[id]; BOARD_BG[id] = L => { bg7(L, SD10[id], ["#FFE3B3", "#D7ECFF", "#D7F0D2"], t, c); txt(L, 1460, 180, e, 110, { "text-anchor": "middle" }); }; });
Object.assign(BLOCK_DEF, {
  kirikae: { who: "doshin", sleep: false, intro: ["p_blk_kirikae", "どしんが、こうじちゅうの みちの まえで こまって いるよ。べつの みちを おしえて あげよう"], say: ["blk_kirikae", "べつの みちで いこう"], to: "どしんに いおう", keys: [["べつ", "別", "ちがう", "違う", "ほか", "他"], ["みち", "道"]], res: ["rs_kirikae", "そうか！ ありがとう"] },
  kikikaesu: { who: "kuma", sleep: false, intro: ["p_blk_kikikaesu", "くまくんが なにか いって いるけど、こえが ちいさくて きこえないよ"], say: ["blk_kikikaesu", "もう いちど いって"], to: "くまくんに きこう", keys: [["もういちど", "もう一度", "もういっかい", "もう一回"]], res: ["rs_kikikaesu", "とおって いいよって いったんだ。どうぞ"] },
  matsu: { who: "pyon", sleep: false, intro: ["p_blk_matsu", "ぴょんちゃんが すべりだいの うえで じゅんばんを まって いるよ"], say: ["blk_matsu", "つぎ、いい？"], to: "ぴょんちゃんに きこう", keys: [["つぎ", "次"]], res: ["rs_matsu", "いいよ。わたしの つぎね"] },
  sos: { who: "doshin", sleep: false, intro: ["p_blk_sos", "どしんが みみを ふさいで こまって いるよ。こえを かけよう"], say: ["blk_sos", "だいじょうぶ？"], to: "どしんに いおう", keys: [["だいじょうぶ", "大丈夫"]], res: ["rs_sos", "おおきい おとが にがてなんだ。きいて くれて ありがとう"] },
  junban: { who: "doshin", sleep: false, intro: ["p_blk_junban", "どしんが、くつしたより さきに くつを はこうと して いるよ"], say: ["blk_junban", "くつしたが さきだよ"], to: "どしんに いおう", keys: [["くつした", "靴下"], ["さき", "先"]], res: ["rs_junban", "あ、そうか！ くつしたが さきだね"] },
  kotowaru: { who: "kuma", sleep: false, intro: ["p_blk_kotowaru", "くまくんが、かいだんの てすりを すべろうと さそって くるよ"], say: ["blk_kotowaru", "あぶないから やめよう"], to: "くまくんに いおう", keys: [["あぶない", "危ない"], ["やめよう", "止めよう", "やめて"]], res: ["rs_kotowaru", "そ、そうだね。やめとく"] },
  bousai: { who: "pyon", sleep: false, intro: ["p_blk_bousai", "ひなんくんれんで、ぴょんちゃんが こわくて うごけないよ"], say: ["blk_bousai", "いっしょに いこう"], to: "ぴょんちゃんに いおう", keys: [["いっしょ", "一緒"]], res: ["rs_bousai", "うん、ありがとう"] },
  denwa: { who: "doshin", sleep: false, intro: ["p_blk_denwa", "どしんの でんわが なって いるのに、きづいて いないよ"], say: ["blk_denwa", "でんわが なってるよ"], to: "どしんに いおう", keys: [["でんわ", "電話"]], res: ["rs_denwa", "あっ、ほんとだ。ありがとう"] },
});
S10L.forEach(st => SLEEPER_OF[st] = BLOCK_DEF[st].who);
const EV10 = { kirikae: ["きりかえ じょうず！", "よていが かわって びっくり！", "かさを わすれた！"], kikikaesu: ["ちゃんと ききかえせた！", "こえが きこえなかった！", "れんらくちょうを わすれた！"],
  matsu: ["じゅんばんを まてた！", "おおきな こえを だしちゃった！", "ならぶ ばしょを まちがえた！"], sos: ["つらいって いえた！", "おおきな おとに びっくり！", "うわぎを わすれた！"],
  junban: ["じゅんばん ばっちり！", "じゅんばんが ばらばらに なった！", "ふでばこを わすれた！"], kotowaru: ["じょうずに ことわれた！", "ボールが ころがって いった！", "ぼうしを わすれた！"],
  bousai: ["しずかに ひなん できた！", "くつひもが ほどけた！", "ぼうさいずきんを わすれた！"], denwa: ["じょうずに でんわ できた！", "でんわが きれちゃった！", "でんわばんごうを わすれた！"] };
S10L.forEach(st => { const [f, b, h] = EV10[st]; EVENTS[st] = { a2: ["fwd", 2, `ev_${st}f`, f + " 2マス すすむよ"], m2: ["back", 2, `ev_${st}b`, b + " 2マス もどるよ"], d1: ["back", 4, `ev_${st}h`, h + " 4マス もどるよ"] };
  if (st === "matsu") Object.assign(EVENTS[st], { a3: ["monosashi", 0, "", ""], c2: ["monosashi", 0, "", ""] });
  if (st === "junban") Object.assign(EVENTS[st], { a3: ["cardorder", 0, "", ""], c2: ["cardorder", 0, "", ""] }); });
