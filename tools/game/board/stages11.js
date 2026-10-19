/* ================= 「そうぞう たんてい」（souzou）と「じぶんの たちば」（tachiba）ショートコース（2026-10-19） =================
   そうぞう たんてい：🔍 てがかりを タッチ → 💭 あいての あたまの なかを そうぞう（おもいの ふきだし）→ 🗣 どう する？ →（段4〜）どうして そう おもった？
   じぶんの たちば ：🎩 いまの じぶんは なに？（ぼうし）→ 💭 あいては どう おもってる？ → 🗣 だから どう する？ →（段4〜）どうして？
   データ・声：sit/souzou_gen.py・sit/tachiba_gen.py（souzou_data.js・tachiba_data.js）。ママは こたえる 子の ママ。ライバル がおは くうき・たちばを わすれる 係。 */
const S11L = ["souzou", "tachiba"];
const S11_READY = true;
Object.assign(RIVAL_OF, { souzou: "gao", tachiba: "gao" });
STAGES.push({ id: "souzou", name: "そうぞう たんてい", icon: "🔍", ready: S11_READY }, { id: "tachiba", name: "じぶんの たちば", icon: "🎩", ready: S11_READY });
["sz", "tb"].forEach(k => ASK_ON_STAGE.add(k));
const S11_N = new Map();
{ const ap = applyStage; applyStage = function (id, ...a) { if (S11L.includes(id)) S11_N.clear(); return ap(id, ...a); }; }
const subjOf = (sc, hero) => sc.subj !== "mama" ? sc.subj : hero === "shima" ? "mama" : MOM_OF[hero] || null;
const vkOf = (sc, subj) => sc.subj === "mama" && subj !== "mama" ? "_" + subj : "";
function s11Pick(list, hero, t, rival) {
  let pool = list.filter(s => { const sj = subjOf(s, hero); return sj && sj !== hero && !(s.cat === 2 && t < 2 && !rival); });
  if (rival) { const d = pool.filter(s => S11_N.get(s.id)); if (d.length) pool = d; }
  const m = Math.min(...pool.map(s => S11_N.get(s.id) || 0)); pool = pool.filter(s => (S11_N.get(s.id) || 0) === m); return pool[rnd(pool.length)]; }
/* ---------- あいての うごき（てがかり） ---------- */
function s11Anim(c, kind) { const L = (ms, f) => later(ms, f);
  const A = {
    watch: () => { c.armL.t = -70; c.headY.t = 10; c.headRot.t = -10; L(700, () => { c.armL.t = 0; c.headY.t = 0; c.headRot.t = 0; }); L(1400, () => { c.armL.t = -70; c.headRot.t = -10; }); L(2000, () => { c.armL.t = 0; c.headRot.t = 0; }); },
    yawn: () => playMove(c, "sleepy"), sigh: () => { c.sadMouth = true; c.headY.t = 18; markAbove(c, "puff", { dx: 90 }); L(2400, () => { c.headY.t = 0; }); },
    shush: () => { c.armR.t = -125; c.mouthOpen.t = .2; L(2200, () => { c.armR.t = 0; c.mouthOpen.t = 0; }); },
    tap: () => { c.armL.t = 30; c.armR.t = -30; for (let i = 0; i < 6; i++) L(i * 250, () => { c.squash.vel += 1.3; blip(170, 120, .05, "square"); }); L(400, () => markAbove(c, "anger", { dx: 100 })); L(1700, () => { c.armL.t = c.armR.t = 0; }); },
    cold: () => { hold(c, "shiver", 1.6); c.armL.t = 40; c.armR.t = -40; L(1700, () => { c.armL.t = c.armR.t = 0; }); },
    stare: () => { c.eyeScale.t = 1.3; c.lean.t = -8; markAbove(c, "sparkle", { dx: -80 }); L(2200, () => { c.eyeScale.t = 1; c.lean.t = 0; }); },
    wait: () => { c.armL.t = 40; c.armR.t = -40; playMove(c, "look"); L(2000, () => { c.armL.t = c.armR.t = 0; }); },
    clock: () => { surprise(c); markAbove(c, "ex"); }, baby: () => { c.armR.t = -125; L(2000, () => { c.armR.t = 0; }); },
    cry: () => playMove(c, "sad"), fidget: () => playMove(c, "shy"), lost: () => { playMove(c, "look"); markAbove(c, "q"); }, tilt: () => { playMove(c, "think"); markAbove(c, "q"); },
    run: () => { hold(c, "run", 1.4); }, stack: () => playMove(c, "pump"),
  }; (A[kind] || (() => playMove(c, "look")))(); }
// あかちゃん・つみき・まど などの こもの
function s11Prop(sc, a) {
  if (sc.anim === "baby") return txt(propG, 1000, 930, "👶", 110, { "text-anchor": "middle" });
  if (sc.anim === "stack") { const g = el("g", {}, propG); let t = 0; for (let i = 0; i < 7; i++) el("rect", { x: -40, y: -60 - i * 60, width: 80, height: 58, rx: 6, fill: ["#FF8FA3", "#FFD25E", "#7FCBF0", "#7BD389"][i % 4], ...S6(4) }, g);
    addTick(dt => { if (!g.isConnected) return false; t += dt; g.setAttribute("transform", `translate(980 975) rotate(${(Math.sin(t * 4) * 5).toFixed(1)})`); }); return g; }
  if (sc.anim === "cold") { const g = el("g", {}, propG); el("rect", { x: 1300, y: 200, width: 220, height: 260, fill: "#CFEAFB", ...S6(6) }, g); el("path", { d: "M1300 200 L1240 220 V480 L1300 460", fill: "#E9F6FF", ...S6(5) }, g);
    for (let i = 0; i < 3; i++) { const p = el("path", { d: "M1250 300 q40 -20 80 0", fill: "none", stroke: "#7FCBF0", "stroke-width": 6 }, g); tween(1800, k => p.setAttribute("transform", `translate(${-200 * k} ${i * 40})`)); } return g; }
  if (sc.anim === "run") { const b = el("g", {}, propG); txt(b, 360, 930, "📦", 120, { "text-anchor": "middle" }); return b; }
  return null; }
// おもいの ふきだし（あたまの うえ。はじめは「？」）
function thinkBubble(c, text) { const p = headTop(c), w = Math.max(320, Math.min(700, text.length * 32 + 80)), x = Math.max(w / 2 + 30, Math.min(1570 - w / 2, p.x)), y = Math.max(140, p.y - 150), g = el("g", {}, front());
  el("ellipse", { cx: x, cy: y, rx: w / 2, ry: 85, fill: "#FFFFFF", ...S6(6) }, g); [[22, 40], [14, 75]].forEach(([r, dy], i) => el("circle", { cx: x + (p.x - x) * .5 + i * 20, cy: y + 85 + dy - 20, r, fill: "#FFFFFF", ...S6(5) }, g));
  const t = txt(g, x, y + 22, "？", 70, { "text-anchor": "middle", fill: "#B9A8D9" });
  g.open = () => { t.textContent = text; t.setAttribute("font-size", text.length > 14 ? 30 : 38); t.setAttribute("fill", INK); t.setAttribute("y", y + 14); for (let i = 0; i < 6; i++) mark("sparkle", x - w / 2 + rnd(w), y - 60 + rnd(40), { vy: -80, life: .7, s: .5 }); chime(); };
  return g; }
// カードを えらぶ（タッチ。こえでも いい）。ちがう カードは うすく する
function s11Choose(opts, onWrong, y = 140) {
  const g = el("g", {}, hudLayer), W = 360, x0 = 800 - opts.length * (W + 24) / 2 + 12; el("rect", { x: x0 - 30, y: y - 16, width: opts.length * (W + 24) + 36, height: 214, rx: 30, fill: "#FFFFFFE8", ...S6(5) }, g);
  const cs = opts.map((o, i) => { const c = card(g, x0 + i * (W + 24), y, W, 182, o[1], o[0], { es: 84, fs: 40 }); c.good = o[2]; c.lab = o[1]; return c; });
  const done = new Promise(res => { let busy = false, live = true;
    cs.forEach(c => c.onclick = async () => { if (busy || c.dim || !live) return; if (c.good) { live = false; cs.forEach(x => x.onclick = null); c.rect.setAttribute("fill", "#FFE27A"); chime(); res(true); return; }
      busy = true; c.dim = 1; c.setAttribute("opacity", .35); noise(.1, 700, .35); await onWrong(); busy = false; });
    const good = opts.find(o => o[2]), ks = [good[3] || [good[1].split(" ")[0]]];
    (async () => { while (live) { const r = await listen(ks, 9000); if (!live) return; if (r.r === "ok") { const c = cs.find(x => x.good); live = false; cs.forEach(x => x.onclick = null); c.rect.setAttribute("fill", "#FFE27A"); chime(); res(true); return; } await sleep(200); } })(); });
  return { g, done }; }
const s11Hat = (h, emo) => { const g = el("g", {}, front()); txt(g, 0, 0, emo, 90, { "text-anchor": "middle" }); follow(g, () => { const p = headTop(h); return [p.x, p.y - 10, 0, 1]; }); jump(h, .5); blip(800, 1300, .15, "sine"); return g; };
/* ---------- 🔍 そうぞう たんてい ---------- */
async function szRun(hero, first) {
  const t = tierOf(), sc = s11Pick(SZ, hero, t), subj = subjOf(sc, hero), vk = vkOf(sc, subj); S11_N.set(sc.id, (S11_N.get(sc.id) || 0) + 1);
  const lv = t >= 2 ? 1 : 0; showEngine(null, `そうぞう たんてい（${sc.id}・段${t + 1}）`);
  const { hero: h, ask: a } = setSitView({ id: "sz_" + sc.id, place: sc.place, asker: subj, intro: "sz" }, hero); a.dx.v = a.dx.t = 0; const pr = s11Prop(sc, a);
  if (sc.anim === "run") { a.dx.v = 500; a.dx.t = -100; hold(a, "run", 1.5); }
  enter(h); await sleep(900); if (first) await speak(C.pony, "szp_intro", "そうぞう たんてい！ てがかりを さがして、あいての きもちを そうぞう しよう");
  await speak(C.pony, `sz_${sc.id}_n`, KTX(`sz_${sc.id}_n`)); s11Anim(a, sc.anim); const loop = setInterval(() => s11Anim(a, sc.anim), 3000);
  if (sc.say) await speak(a, `szs_${sc.id}${vk}`, sc.say);
  let okN = 0, nSay = 0, wrong = 0; const log = [];
  // 1) 🔍 てがかり
  await speak(C.pony, "szp_find", "てがかりは どれかな？ タッチしてね");
  const ch = s11Choose(shuffle([[sc.cue[0], sc.cue[1], 1, null], ...sc.decoys.map(d => [d[0], d[1], 0])]), async () => { wrong++; await speak(C.pony, "szp_nope", "それも みえるね。でも、もっと だいじな てがかりが あるよ"); });
  await ch.done; markAbove(C.pony, "sparkle"); await speak(C.pony, `sz_${sc.id}_c`, KTX(`sz_${sc.id}_c`)); await sleep(300); ch.g.remove();
  // 2) 💭 あたまの なか（⑤は このあと どう なる？）
  const tb = thinkBubble(sc.cat === 5 ? h : a, sc.think);
  await speak(C.pony, sc.cat === 5 ? "szp_next" : "szp_think", sc.cat === 5 ? "このあと、どう なるかな？" : "あたまの なかで、なにを おもって いるかな？");
  nSay++; { const r = await kmSay(h, `sz_${sc.id}_g${lv}`, sc.guess[lv], sc.guess[2], "そうぞう しよう"); if (r.ok) okN++; log.push(`💭${r.ok ? "○" : "×"}${r.heard}`); }
  await speak(C.pony, "szp_open", "ふきだしを のぞいて みよう"); tb.open(); clearInterval(loop);
  if (sc.cat !== 5) await speak(a, `szt_${sc.id}${vk}`, sc.think); else await sleep(1400);
  // 3) 🗣 どう する？
  await speak(C.pony, "szp_do", "どう する？ なんて いう？"); tb.remove();
  nSay++; { const r = await kmSay(h, `sz_${sc.id}_a${lv}`, sc.act[lv], sc.act[2], "いって みよう"); if (r.ok) okN++; log.push(`🗣${r.ok ? "○" : "×"}${r.heard}`); }
  a.sadMouth = false; a.headY.t = 0; joy(a); await speak(a, `szr_${sc.id}${vk}`, sc.res);
  // 4) どうして？（段4から）
  if (t >= 3) { await speak(C.pony, "szp_why", "どうして そう おもったの？"); nSay++; const r = await kmSay(h, `sz_${sc.id}_w`, sc.why[0], sc.why[1], "てがかりを いおう"); if (r.ok) okN++; log.push(`🔍${r.ok ? "○" : "×"}${r.heard}`); }
  const ok = okN * 2 >= nSay; grade(ok && !wrong && okN === nSay); GS.tasks++; if (ok) GS.ok++;
  playLog({ type: "souzou", id: sc.id, tier: t, okN, nSay, wrong, tries: log, ...(MODE === "multi" ? { who: NAMES[hero] } : {}) });
  if (pr) pr.remove(); if (ok) { joy(h); confetti(50); joy(C.pony); await speak(C.pony, "szp_ok", "めいたんてい！"); await seedGet(h); }
  await sleep(400); setView("board"); return ok;
}
/* ---------- 🎩 じぶんの たちば ---------- */
async function tbRun(hero, first) {
  const t = tierOf(), sc = s11Pick(TB, hero, t), subj = subjOf(sc, hero), vk = vkOf(sc, subj); S11_N.set(sc.id, (S11_N.get(sc.id) || 0) + 1);
  const lv = t >= 2 ? 1 : 0; showEngine(null, `じぶんの たちば（${sc.id}・段${t + 1}）`);
  const { hero: h, ask: a } = setSitView({ id: "tb_" + sc.id, place: sc.place, asker: subj, intro: "tb" }, hero); a.dx.v = a.dx.t = 0;
  enter(h); await sleep(900); if (first) await speak(C.pony, "tbp_intro", "いまの じぶんは、どんな たちばかな？ ぼうしを かぶって かんがえよう");
  await speak(C.pony, `tb_${sc.id}_n`, KTX(`tb_${sc.id}_n`)); await speak(a, `tbs_${sc.id}${vk}`, sc.say);
  let okN = 0, nSay = 0, wrong = 0; const log = [];
  // 1) 🎩 いまの じぶんは？
  await speak(C.pony, "tbp_hat", "いまの じぶんは なに？ ぼうしを タッチしてね");
  const ch = s11Choose(shuffle([[sc.role[0], sc.role[1], 1, sc.role[2].flat()], [sc.other[0], sc.other[1], 0]]), async () => { wrong++; await speak(C.pony, "tbp_hat_ng", "ちがう ぼうしかな。もう いちど かんがえて みよう"); });
  await ch.done; ch.g.remove(); const hat = s11Hat(h, sc.role[0]); await speak(C.pony, `tb_${sc.id}_r`, KTX(`tb_${sc.id}_r`));
  // 2) 💭 あいては どう おもってる？（段3からは こどもが そうぞう）
  const tb = thinkBubble(a, sc.think); await speak(C.pony, "tbp_think", "あいては、どう おもって いるかな？");
  if (t >= 2) { nSay++; const r = await kmSay(h, `tb_${sc.id}_g1`, sc.guess[1], sc.guess[2], "そうぞう しよう"); if (r.ok) okN++; log.push(`💭${r.ok ? "○" : "×"}${r.heard}`); await speak(C.pony, "tbp_open", "ふきだしを のぞいて みよう"); }
  tb.open(); await speak(a, `tbt_${sc.id}${vk}`, sc.think); await sleep(300); tb.remove();
  // 3) 🗣 だから どう する？
  await speak(C.pony, "tbp_do", "だから、どう する？ なんて いう？");
  nSay++; { const r = await kmSay(h, `tb_${sc.id}_a${lv}`, sc.act[lv], sc.act[2], "いって みよう"); if (r.ok) okN++; log.push(`🗣${r.ok ? "○" : "×"}${r.heard}`); }
  joy(a); await speak(a, `tbr_${sc.id}${vk}`, sc.res);
  if (t >= 3) { await speak(C.pony, "tbp_why", "どうして そう するの？"); nSay++; const r = await kmSay(h, `tb_${sc.id}_w`, sc.why[0], sc.why[1], "わけを いおう"); if (r.ok) okN++; log.push(`🎩${r.ok ? "○" : "×"}${r.heard}`); }
  hat.remove(); const ok = okN * 2 >= nSay; grade(ok && !wrong && okN === nSay); GS.tasks++; if (ok) GS.ok++;
  playLog({ type: "tachiba", id: sc.id, tier: t, okN, nSay, wrong, tries: log, ...(MODE === "multi" ? { who: NAMES[hero] } : {}) });
  if (ok) { joy(h); confetti(50); joy(C.pony); await speak(C.pony, "tbp_ok", "たちばに ぴったりだね！"); await seedGet(h); }
  await sleep(400); setView("board"); return ok;
}
const KTX = k => (S11_TXT[k] || "");
// ライバル（がお）の ばん：くうき・たちばを わすれて ふるまう → こどもが おしえる
async function s11Rival() {
  const sz = curStage === "souzou", list = sz ? SZ : TB, sc = s11Pick(list, RIVAL, 5, true), subj = subjOf(sc, RIVAL) || "kuma", vk = vkOf(sc, subj), P = sz ? "sz" : "tb";
  showEngine(null, `${NAMES[RIVAL]}の ばん（${sc.id}）`);
  const { hero: h, ask: a } = setSitView({ id: `${P}_${sc.id}`, place: sc.place, asker: subj, intro: P }, RIVAL); a.dx.v = a.dx.t = 0; const pr = sz ? s11Prop(sc, a) : null;
  enter(h); await sleep(900); await speak(C.pony, `${P}_${sc.id}_n`, KTX(`${P}_${sc.id}_n`)); if (sz) s11Anim(a, sc.anim);
  if (sc.say) await speak(a, `${P}s_${sc.id}${vk}`, sc.say);
  playMove(h, "pump"); await speak(h, `${P}g_${sc.id}`, sc.gao); surprise(a); a.sadMouth = true; markAbove(C.pony, "q"); await sleep(400);
  await speak(C.pony, sz ? "szp_teach" : "tbp_teach", "がおくんに、どう すれば いいか おしえて あげよう");
  playMove(h, "think"); await rivalSay(h, "huh");
  const r = await kmSay(C.shima, `${P}_${sc.id}_a1`, sc.act[1], sc.act[2], `${NAMES[RIVAL]}に おしえよう`);
  playLog({ type: "teach", id: `${P}_${sc.id}`, ok: r.ok, tries: [r.heard] }); if (r.ok) GS.ok++;
  a.sadMouth = false; if (r.ok) { joy(C.shima); confetti(40); } await rivalSay(h, "thanks"); if (pr) pr.remove(); await sleep(600); setView("board");
}
{ const gs = gaoSit; gaoSit = async function (before) { if (S11L.includes(curStage)) return s11Rival(); return gs(before); }; }
let S11_FIRST = true; { const ap = applyStage; applyStage = function (id, ...a) { S11_FIRST = true; return ap(id, ...a); }; }
{ const lc = landChild; landChild = async function (pc = P.shima) {
    if (!S11L.includes(curStage) || winner) return lc(pc);
    const k = kindOf(pc.node); if (k === "start" || k === "treasure") return lc(pc);
    const f = S11_FIRST; S11_FIRST = false; const ok = await (curStage === "souzou" ? szRun : tbRun)(pc.kind, f); if (ok && pc.player) pc.player.ok++; }; }
/* ---------- 盤 ---------- */
STAGE_DEF.souzou = { ground: "#F2F7FF", sky: "#CFEAFB", names: ["いえ", "いえ", "がっこう", "がっこう", "こうえん", "こうえん", "まち", "まち", "いえ"], fills: { いえ: "#FFE3B3", がっこう: "#D7ECFF", こうえん: "#D7F0D2", まち: "#FFD1D9" } };
STAGE_DEF.tachiba = { ground: "#FFF6EC", sky: "#CFEAFB", names: ["いえ", "いえ", "がっこう", "がっこう", "こうえん", "こうえん", "まち", "まち", "いえ"], fills: { いえ: "#FFE3B3", がっこう: "#D7ECFF", こうえん: "#D7F0D2", まち: "#FFD1D9" } };
board7("souzou", ["いえ", "いえ", "がっこう", "こうえん", "まち", "いえ"], "hall"); board7("tachiba", ["いえ", "いえ", "がっこう", "こうえん", "まち", "いえ"], "hall");
BOARD_BG.souzou = L => { bg7(L, "#F2F7FF", ["#FFE3B3", "#D7ECFF", "#D7F0D2"], "🔍 そうぞう たんてい", "#3E7FD6"); txt(L, 1460, 180, "💭", 110, { "text-anchor": "middle" }); };
BOARD_BG.tachiba = L => { bg7(L, "#FFF6EC", ["#FFE3B3", "#D7ECFF", "#D7F0D2"], "🎩 じぶんの たちば", "#E8735A"); txt(L, 1460, 180, "🎩", 110, { "text-anchor": "middle" }); };
Object.assign(BLOCK_DEF, {
  souzou: { who: "doshin", sleep: false, intro: ["p_blk_souzou", "どしんが、きょろきょろ して、なにか さがして いるみたい。こえを かけよう"], say: ["blk_souzou", "なにか さがしてるの？"], to: "どしんに きこう", keys: [["さがして", "探して", "どうしたの", "どうした"]], res: ["rs_souzou", "うん、ぼうしを さがしてたんだ。きいて くれて ありがとう"] },
  tachiba: { who: "piyoko", sleep: false, intro: ["p_blk_tachiba", "ようちえんの ぴよこちゃんが ころんで ないて いるよ。おにいさん おねえさんとして、こえを かけよう"], say: ["blk_tachiba", "だいじょうぶ？"], to: "ぴよこちゃんに いおう", keys: [["だいじょうぶ", "大丈夫"]], res: ["rs_tachiba", "……うん。ありがとう"] },
});
S11L.forEach(st => SLEEPER_OF[st] = BLOCK_DEF[st].who);
EVENTS.souzou = { a2: ["fwd", 2, "ev_souzouf", "てがかりを みつけた！ 2マス すすむよ"], m2: ["back", 2, "ev_souzoub", "むしめがねを おとした！ 2マス もどるよ"], d1: ["back", 4, "ev_souzouh", "たんていの ぼうしを わすれた！ 4マス もどるよ"] };
EVENTS.tachiba = { a2: ["fwd", 2, "ev_tachibaf", "とうばんを がんばった！ 2マス すすむよ"], m2: ["back", 2, "ev_tachibab", "ぼうしが とんで いった！ 2マス もどるよ"], d1: ["back", 4, "ev_tachibah", "おきゃくさんの あいさつを わすれた！ 4マス もどるよ"] };
