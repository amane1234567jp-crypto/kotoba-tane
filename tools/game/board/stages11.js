/* ================= 「そうぞう たんてい」（souzou）と「じぶんの たちば」（tachiba）ショートコース（2026-10-19） =================
   そうぞう たんてい：🔍 てがかりを タッチ → 💭 あいての あたまの なかを そうぞう（おもいの ふきだし）→ 🗣 どう する？ →（段4〜）どうして そう おもった？
   じぶんの たちば ：🎩 いまの じぶんは なに？（ぼうし）→ 💭 あいては どう おもってる？ → 🗣 だから どう する？ →（段4〜）どうして？
   データ・声：sit/souzou_gen.py・sit/tachiba_gen.py（souzou_data.js・tachiba_data.js）。ママは こたえる 子の ママ。ライバル がおは くうき・たちばを わすれる 係。 */
const S11L = ["souzou", "tachiba", "sakiyomi", "chotto", "aite"];
const S11_READY = true;
const AS_READY = true; /* あいての サイン：声が そろうまで false */
Object.assign(RIVAL_OF, { souzou: "gao", tachiba: "gao", sakiyomi: "gao", chotto: "gao", aite: "gao" });
STAGES.push(/* 2026-10-29：「そうぞう たんてい」「さきよみ」「ちょっと まって」「じぶんの たちば」は カット（メニューから はずす。中身は のこす） */ { id: "aite", name: "あいての サイン", icon: "🤝", ready: AS_READY });
["sz", "tb", "sk", "cm", "as"].forEach(k => ASK_ON_STAGE.add(k));
const S11_N = new Map(), S11_R = new Set(), AS_GOT = [];
{ const ap = applyStage; applyStage = function (id, ...a) { if (S11L.includes(id)) { S11_N.clear(); S11_R.clear(); AS_GOT.length = 0; } return ap(id, ...a); }; }
const subjOf = (sc, hero) => sc.subj !== "mama" ? sc.subj : hero === "shima" ? "mama" : MOM_OF[hero] || null;
const vkOf = (sc, subj) => sc.subj === "mama" && subj !== "mama" ? "_" + subj : "";
function s11Pick(list, hero, t, rival) {
  let pool = list.filter(s => { const sj = subjOf(s, hero); return sj && sj !== hero && !(s.cat === 2 && t < 2 && !rival); });
  if (rival) { let d = pool.filter(s => S11_N.get(s.id) && !S11_R.has(s.id)); if (!d.length) d = pool.filter(s => !S11_R.has(s.id)); if (d.length) pool = d; const sc = pool[rnd(pool.length)]; S11_R.add(sc.id); return sc; }
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
function s11Choose(opts, onWrong, y = 140, W = 360) {
  const g = el("g", {}, hudLayer), x0 = 800 - opts.length * (W + 24) / 2 + 12; el("rect", { x: x0 - 30, y: y - 16, width: opts.length * (W + 24) + 36, height: 214, rx: 30, fill: "#FFFFFFE8", ...S6(5) }, g);
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
  if (curStage === "aite") return asRival();
  const sz = curStage === "souzou", sk = curStage === "sakiyomi", cm = curStage === "chotto", list = sz ? SZ : sk ? SK : cm ? CM : TB, sc = s11Pick(list, RIVAL, 5, true), subj = subjOf(sc, RIVAL) || "kuma", vk = vkOf(sc, subj), P = sz ? "sz" : sk ? "sk" : cm ? "cm" : "tb";
  showEngine(null, `${NAMES[RIVAL]}の ばん（${sc.id}）`);
  const { hero: h, ask: a } = setSitView({ id: `${P}_${sc.id}`, place: sc.place, asker: subj, intro: P }, RIVAL); a.dx.v = a.dx.t = 0; const pr = sz ? s11Prop(sc, a) : null; if (sk) a.dx.v = a.dx.t = 0;
  enter(h); await sleep(900); await speak(C.pony, `${P}_${sc.id}_n`, KTX(`${P}_${sc.id}_n`)); if (sz) s11Anim(a, sc.anim);
  if (sc.say) await speak(a, `${P}s_${sc.id}${vk}`, sc.say);
  const wb = cm ? cmWant(h, sc.want) : null; playMove(h, "pump"); await speak(h, `${P}g_${sc.id}`, sc.gao); if (wb) wb.remove(); surprise(a); a.sadMouth = true; markAbove(C.pony, "q"); await sleep(400);
  let fut = null; if (sk) { fut = skFuture(sc, true); await sleep(300); fut.showA(); await speak(C.pony, `sk_${sc.id}_oa`, sc.a[3]); }
  await speak(C.pony, `${P}p_teach`, sk ? "がおくんに、さきを おしえて あげよう" : "がおくんに、どう すれば いいか おしえて あげよう");
  playMove(h, "think"); await rivalSay(h, "huh");
  const r = cm ? await kmSay(C.shima, `cm_${sc.id}_t`, "ちょっと まって。" + sc.why[0], sc.why[1], `${NAMES[RIVAL]}に おしえよう`) : sk ? await kmSay(C.shima, `sk_${sc.id}_w`, sc.why[0], sc.why[1], `${NAMES[RIVAL]}に おしえよう`) : await kmSay(C.shima, `${P}_${sc.id}_a1`, sc.act[1], sc.act[2], `${NAMES[RIVAL]}に おしえよう`);
  if (fut) { fut.showB(); await sleep(1200); fut.g.remove(); }
  playLog({ type: "teach", id: `${P}_${sc.id}`, ok: r.ok, tries: [r.heard] }); if (r.ok) GS.ok++;
  a.sadMouth = false; if (r.ok) { joy(C.shima); confetti(40); } await rivalSay(h, "thanks"); if (pr) pr.remove(); await sleep(600); setView("board");
}
{ const gs = gaoSit; gaoSit = async function (before) { if (S11L.includes(curStage)) return s11Rival(); return gs(before); }; }
let S11_FIRST = true; { const ap = applyStage; applyStage = function (id, ...a) { S11_FIRST = true; return ap(id, ...a); }; }
{ const lc = landChild; landChild = async function (pc = P.shima) {
    if (!S11L.includes(curStage) || winner) return lc(pc);
    const k = kindOf(pc.node); if (k === "start" || k === "treasure") return lc(pc);
    const f = S11_FIRST; S11_FIRST = false; const ok = await (curStage === "souzou" ? szRun : curStage === "sakiyomi" ? skRun : curStage === "chotto" ? cmRun : curStage === "aite" ? asRun : tbRun)(pc.kind, f); if (ok && pc.player) pc.player.ok++; }; }
/* ---------- 盤 ---------- */
STAGE_DEF.souzou = { ground: "#F2F7FF", sky: "#CFEAFB", names: ["いえ", "いえ", "がっこう", "がっこう", "こうえん", "こうえん", "まち", "まち", "いえ"], fills: { いえ: "#FFE3B3", がっこう: "#D7ECFF", こうえん: "#D7F0D2", まち: "#FFD1D9" } };
STAGE_DEF.tachiba = { ground: "#FFF6EC", sky: "#CFEAFB", names: ["いえ", "いえ", "がっこう", "がっこう", "こうえん", "こうえん", "まち", "まち", "いえ"], fills: { いえ: "#FFE3B3", がっこう: "#D7ECFF", こうえん: "#D7F0D2", まち: "#FFD1D9" } };
board7("souzou", ["いえ", "いえ", "がっこう", "こうえん", "まち", "いえ"], "hall"); board7("tachiba", ["いえ", "いえ", "がっこう", "こうえん", "まち", "いえ"], "hall");
BOARD_BG.souzou = L => { bg7(L, "#F2F7FF", ["#FFE3B3", "#D7ECFF", "#D7F0D2"], "🔍 そうぞう たんてい", "#3E7FD6"); txt(L, 1460, 180, "💭", 110, { "text-anchor": "middle" }); };
BOARD_BG.tachiba = L => { bg7(L, "#FFF6EC", ["#FFE3B3", "#D7ECFF", "#D7F0D2"], "🎩 じぶんの たちば", "#E8735A"); txt(L, 1460, 180, "🎩", 110, { "text-anchor": "middle" }); };
Object.assign(BLOCK_DEF, {
  souzou: { who: "doshin", sleep: false, intro: ["p_blk_souzou", "どしんが、きょろきょろ して、なにか さがして いるみたい。こえを かけよう"], say: ["blk_souzou", "なにか さがしてるの？"], to: "どしんに きこう", keys: [["さがして", "探して", "どうしたの", "どうした"]], res: ["rs_souzou", "うん、ぼうしを さがしてたんだ。きいて くれて ありがとう"] },
  tachiba: { who: "piyo", sleep: false, intro: ["p_blk_tachiba", "ようちえんの ぴよこちゃんが ころんで ないて いるよ。おにいさん おねえさんとして、こえを かけよう"], say: ["blk_tachiba", "だいじょうぶ？"], to: "ぴよこちゃんに いおう", keys: [["だいじょうぶ", "大丈夫"]], res: ["rs_tachiba", "……うん。ありがとう"] },
});
S11L.forEach(st => { if (BLOCK_DEF[st]) SLEEPER_OF[st] = BLOCK_DEF[st].who; });
EVENTS.souzou = { a2: ["fwd", 2, "ev_souzouf", "てがかりを みつけた！ 2マス すすむよ"], m2: ["back", 2, "ev_souzoub", "むしめがねを おとした！ 2マス もどるよ"], d1: ["back", 4, "ev_souzouh", "たんていの ぼうしを わすれた！ 4マス もどるよ"] };
EVENTS.tachiba = { a2: ["fwd", 2, "ev_tachibaf", "とうばんを がんばった！ 2マス すすむよ"], m2: ["back", 2, "ev_tachibab", "ぼうしが とんで いった！ 2マス もどるよ"], d1: ["back", 4, "ev_tachibah", "おきゃくさんの あいさつを わすれた！ 4マス もどるよ"] };
/* ---------- 🔮 さきよみ（2026-10-19） ----------
   🔮 みらい めがね：みちが 2つ（A＝すぐ らくな ほう、B＝さきを かんがえた ほう）→ A を えらぶと どう なる？ → ⏩ さきを のぞく →
   ⚖ どっちに する？（タッチ）→ わけを いう →（段3〜）📝 その ために いま なにを する？ */
// みらいの パネル：[えらぶ みち] → ⏩ → [その さき]（はじめは「？」）
function skFuture(sc, onlyA) {
  const g = el("g", {}, hudLayer), rows = onlyA ? [sc.a, sc.b] : [sc.a, sc.b], out = [];
  el("rect", { x: 170, y: 318, width: 1260, height: 274, rx: 34, fill: "#FFFFFFE8", ...S6(5) }, g); txt(g, 222, 378, "🔮", 56, { "text-anchor": "middle" });
  rows.forEach((r, i) => { const y = 330 + i * 128, c = card(g, 280, y, 430, 122, r[1], r[0], { es: 70, fs: 38 });
    txt(g, 790, y + 84, "⏩", 64, { "text-anchor": "middle" });
    const f = el("g", {}, g); const fr = el("rect", { x: 870, y, width: 520, height: 122, rx: 26, fill: "#EDE6F7", ...S6(6) }, f); const q = txt(f, 1130, y + 90, "？", 76, { "text-anchor": "middle", fill: "#B9A8D9" });
    out.push({ c, show: () => { q.remove(); fr.setAttribute("fill", i ? "#E2F5D8" : "#FFE1E6"); const k = card(f, 870, y, 520, 122, r[3], r[2], { es: 70, fs: 36, fill: i ? "#E2F5D8" : "#FFE1E6" }); k.style.cursor = ""; for (let n = 0; n < 6; n++) mark("sparkle", 900 + rnd(460), y + rnd(100), { vy: -60, life: .6, s: .45 }); i ? chime() : noise(.15, 300, .3); } }); });
  return { g, rowA: out[0].c, rowB: out[1].c, showA: out[0].show, showB: out[1].show }; }
async function skRun(hero, first) {
  const t = tierOf(), sc = s11Pick(SK, hero, t), subj = subjOf(sc, hero), vk = vkOf(sc, subj); S11_N.set(sc.id, (S11_N.get(sc.id) || 0) + 1);
  const lv = t >= 2 ? 1 : 0; showEngine(null, `さきよみ（${sc.id}・段${t + 1}）`);
  const { hero: h, ask: a } = setSitView({ id: "sk_" + sc.id, place: sc.place, asker: subj, intro: "sk" }, hero); a.dx.v = a.dx.t = 0;
  enter(h); await sleep(900); if (first) await speak(C.pony, "skp_intro", "さきよみ！ みらい めがねで、さきを のぞいて みよう");
  await speak(C.pony, `sk_${sc.id}_n`, KTX(`sk_${sc.id}_n`)); await speak(a, `sks_${sc.id}${vk}`, sc.say);
  let okN = 0, nSay = 0, wrong = 0; const log = [];
  // 1) 🔮 みちが 2つ。A を えらぶと どう なる？
  const fu = skFuture(sc); fu.rowA.rect.setAttribute("fill", "#FFF1B8"); markAbove(C.pony, "sparkle");
  await speak(C.pony, "skp_pred", "こっちを えらぶと、どう なるかな？");
  nSay++; { const r = await kmSay(h, `sk_${sc.id}_p${lv}`, sc.pred[lv], sc.pred[2], "さきを よもう"); if (r.ok) okN++; log.push(`🔮${r.ok ? "○" : "×"}${r.heard}`); }
  // 2) ⏩ さきを のぞく
  await speak(C.pony, "skp_peek", "みらいを のぞいて みよう"); fu.showA(); await speak(C.pony, `sk_${sc.id}_oa`, sc.a[3]); fu.showB(); await speak(C.pony, `sk_${sc.id}_ob`, sc.b[3]); await sleep(500); fu.g.remove();
  // 3) ⚖ どっちに する？（タッチ）→ わけ
  await speak(C.pony, "skp_tap", "どっちが いいかな？ タッチしてね");
  const ch = s11Choose(shuffle([[sc.b[0], sc.b[1], 1, null], [sc.a[0], sc.a[1], 0]]), async () => { wrong++; await speak(C.pony, "skp_ng", "そっちを えらぶと、こまっちゃうね。もう いっぽうを かんがえて みよう"); });
  await ch.done; ch.g.remove(); const pick = s11Hat(h, sc.b[0]);
  await speak(C.pony, "skp_choose", "どっちに する？ わけも いってね");
  nSay++; { const r = await kmSay(h, `sk_${sc.id}_w`, sc.why[0], sc.why[1], "わけを いおう"); if (r.ok) okN++; log.push(`⚖${r.ok ? "○" : "×"}${r.heard}`); }
  // 4) 📝 その ために いま なにを する？（段3から）
  if (t >= 2 && sc.plan) { await speak(C.pony, "skp_plan", "その ために、いま なにを する？"); nSay++; const r = await kmSay(h, `sk_${sc.id}_pl`, sc.plan[0], sc.plan[1], "いま する こと"); if (r.ok) okN++; log.push(`📝${r.ok ? "○" : "×"}${r.heard}`); }
  joy(a); await speak(a, `skr_${sc.id}${vk}`, sc.res); pick.remove();
  const ok = okN * 2 >= nSay; grade(ok && !wrong && okN === nSay); GS.tasks++; if (ok) GS.ok++;
  playLog({ type: "sakiyomi", id: sc.id, tier: t, okN, nSay, wrong, tries: log, ...(MODE === "multi" ? { who: NAMES[hero] } : {}) });
  if (ok) { joy(h); confetti(50); joy(C.pony); await speak(C.pony, "skp_ok", "さきよみ めいじん！"); await seedGet(h); }
  await sleep(400); setView("board"); return ok;
}
STAGE_DEF.sakiyomi = { ground: "#F4F0FF", sky: "#CFEAFB", names: ["いえ", "いえ", "がっこう", "がっこう", "こうえん", "こうえん", "まち", "まち", "いえ"], fills: { いえ: "#FFE3B3", がっこう: "#D7ECFF", こうえん: "#D7F0D2", まち: "#FFD1D9" } };
board7("sakiyomi", ["いえ", "いえ", "がっこう", "こうえん", "まち", "いえ"], "hall");
BOARD_BG.sakiyomi = L => { bg7(L, "#F4F0FF", ["#FFE3B3", "#D7ECFF", "#D7F0D2"], "🔮 さきよみ", "#8A6FD1"); txt(L, 1460, 180, "⏩", 110, { "text-anchor": "middle" }); };
BLOCK_DEF.sakiyomi = { who: "kuma", sleep: false, intro: ["p_blk_sakiyomi", "くまくんが、かさを もたないで でかけようと して いるよ。そらには くろい くもが でて きたね。こえを かけよう"], say: ["blk_sakiyomi", "かさ、もって いったら？"], to: "くまくんに いおう", keys: [["かさ", "傘"]], res: ["rs_sakiyomi", "あ、そうか。かさを もって いくよ。ありがとう"] };
SLEEPER_OF.sakiyomi = "kuma";
EVENTS.sakiyomi = { a2: ["fwd", 2, "ev_sakiyomif", "さきに じゅんびして おいた！ 2マス すすむよ"], m2: ["back", 2, "ev_sakiyomib", "かさを わすれて ぬれちゃった！ 2マス もどるよ"], d1: ["back", 4, "ev_sakiyomih", "わすれものを とりに もどった！ 4マス もどるよ"] };
/* ---------- 🛑 ちょっと まって（2026-10-19） ----------
   やりたく なった！（ふきだし）→ 🛑 ストップを タッチして「ちょっと まって」→ 🤔 だいじょうぶ チェック（きに なる ものを タッチ）→ 🙋 きく → ✅ へんじ →（段4〜）どうして とまったの？
   a3・c2 マス：🚦 ストップゲーム（みどりで タッチ・あかで まつ）／🏁 よーい…どん？（「どん」の ときだけ タッチ） */
const cmWant = (c, w) => { const p = headTop(c), g = el("g", {}, front()); el("ellipse", { cx: p.x, cy: p.y - 120, rx: 240, ry: 76, fill: "#FFF1B8", ...S6(6) }, g);
  txt(g, p.x - 160, p.y - 94, w[0], 72, { "text-anchor": "middle" }); txt(g, p.x + 50, p.y - 106, w[1], 40, { "text-anchor": "middle" }); g.setAttribute("opacity", 0); tween(300, k => g.setAttribute("opacity", k)); return g; };
// 🛑 おおきな ストップ（タッチ・こえ）
function cmStopSign() { const g = el("g", { style: "cursor:pointer" }, hudLayer), x = 1000, y = 460;
  const pts = [...Array(8)].map((_, i) => { const a = Math.PI / 8 + i * Math.PI / 4; return `${(x + 125 * Math.cos(a)).toFixed(0)},${(y + 125 * Math.sin(a)).toFixed(0)}`; }).join(" ");
  el("polygon", { points: pts, fill: "#F25C54", ...S6(8) }, g); txt(g, x, y - 8, "ちょっと", 46, { "text-anchor": "middle", fill: "#FFFFFF" }); txt(g, x, y + 50, "まって", 46, { "text-anchor": "middle", fill: "#FFFFFF" });
  let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; const sc = 1 + Math.sin(t * 5) * .04; g.setAttribute("transform", `translate(${x} ${y}) scale(${sc.toFixed(3)}) translate(${-x} ${-y})`); });
  return g; }
async function cmRun(hero, first) {
  const t = tierOf(), sc = s11Pick(CM, hero, t), subj = subjOf(sc, hero), vk = vkOf(sc, subj); S11_N.set(sc.id, (S11_N.get(sc.id) || 0) + 1);
  const lv = t >= 2 ? 1 : 0; showEngine(null, `ちょっと まって（${sc.id}・段${t + 1}）`);
  const { hero: h, ask: a } = setSitView({ id: "cm_" + sc.id, place: sc.place, asker: subj, intro: "cm" }, hero); a.dx.v = a.dx.t = 0;
  enter(h); await sleep(900); if (first) await speak(C.pony, "cmp_intro", "ちょっと まって！ やりたく なったら、まず とまって かんがえよう");
  const wb = cmWant(h, sc.want); playMove(h, "pump"); await speak(C.pony, `cm_${sc.id}_n`, KTX(`cm_${sc.id}_n`));
  let okN = 0, nSay = 0, wrong = 0; const log = [];
  // 1) 🛑 とまる：ストップを タッチ ＋「ちょっと まって」
  const st = cmStopSign(); await speak(C.pony, "cmp_stop", "ストップの マークを タッチして、ちょっと まってって いおう");
  let tapped = false; const tapP = new Promise(res => st.onclick = () => { if (tapped) return; tapped = true; chime(); res(); });
  nSay++; { const r = await kmSay(h, "cmp_stop_say", "ちょっと まって", [["ちょっと", "まって", "待って", "ストップ"]], "とまろう"); if (r.ok) okN++; log.push(`🛑${r.ok ? "○" : "×"}${r.heard}`); }
  await Promise.race([tapP, sleep(tapped ? 0 : 2500)]); st.remove(); wb.remove(); h.armL.t = h.armR.t = 0; playMove(h, "think");
  // 2) 🤔 だいじょうぶ チェック
  await speak(C.pony, "cmp_check", "だいじょうぶ かな？ きに なる ものを タッチしてね");
  const ch = s11Choose(shuffle(sc.checks.map(c => [c[0], c[1], c[2], null])), async () => { wrong++; await speak(C.pony, "cmp_nope", "それは だいじょうぶ。もっと きに なる ものが あるよ"); });
  await ch.done; markAbove(C.pony, "sparkle"); await speak(C.pony, `cm_${sc.id}_c`, KTX(`cm_${sc.id}_c`)); ch.g.remove();
  // 3) 🙋 きく
  await speak(C.pony, "cmp_ask", "きいて みよう");
  nSay++; { const r = await kmSay(h, `cm_${sc.id}_a${lv}`, sc.ask[lv], sc.ask[2], "きいて みよう"); if (r.ok) okN++; log.push(`🙋${r.ok ? "○" : "×"}${r.heard}`); }
  joy(a); await speak(a, `cmr_${sc.id}${vk}`, sc.res);
  // 4) どうして とまったの？（段4から）
  if (t >= 3) { await speak(C.pony, "cmp_why", "どうして とまったの？"); nSay++; const r = await kmSay(h, `cm_${sc.id}_w`, sc.why[0], sc.why[1], "わけを いおう"); if (r.ok) okN++; log.push(`🤔${r.ok ? "○" : "×"}${r.heard}`); }
  const ok = okN * 2 >= nSay; grade(ok && !wrong && okN === nSay); GS.tasks++; if (ok) GS.ok++;
  playLog({ type: "chotto", id: sc.id, tier: t, okN, nSay, wrong, tries: log, ...(MODE === "multi" ? { who: NAMES[hero] } : {}) });
  if (ok) { joy(h); confetti(50); joy(C.pony); await speak(C.pony, "cmp_ok", "とまれた！ えらいね"); await seedGet(h); }
  await sleep(400); setView("board"); return ok;
}
/* 🚦 ストップゲーム：みどり→タッチ、あか→まつ（8かい） */
async function cmTraffic(heroKind) {
  const g = panel("ストップゲーム", "#EAF7E6"); await speak(C.pony, "cmt_intro", "ストップゲーム！ みどりの ときは タッチ。あかの ときは、ちょっと まって！");
  const btn = el("g", { style: "cursor:pointer" }, g); const lamp = el("circle", { cx: 800, cy: 440, r: 190, fill: "#DDDDDD", ...S6(10) }, btn); const ic = txt(btn, 800, 500, "", 150, { "text-anchor": "middle" });
  txt(g, 800, 790, "🟢 タッチ　　🔴 まつ", 60, { "text-anchor": "middle" }); const seq = shuffle([1, 1, 1, 1, 1, 0, 0, 0]); let good = 0, miss = 0;
  for (const go of seq) {
    lamp.setAttribute("fill", "#DDDDDD"); ic.textContent = ""; await sleep(700 + rnd(700));
    lamp.setAttribute("fill", go ? "#57C26B" : "#F25C54"); ic.textContent = go ? "👆" : "✋"; blip(go ? 880 : 330, go ? 1100 : 300, .12, "sine");
    const hit = await new Promise(res => { let done = false; btn.onclick = () => { if (!done) { done = true; res(true); } }; later(go ? 2600 : 1800, () => { if (!done) { done = true; res(false); } }); }); btn.onclick = null;
    if (go && hit) { good++; chime(); markAbove(C.pony, "sparkle"); await speak(C.pony, "cmt_good", "ナイス！"); }
    else if (!go && !hit) { good++; chime(); await speak(C.pony, "cmt_wait", "とまれたね！"); }
    else { miss++; noise(.1, 600, .3); await speak(C.pony, go ? "cmt_slow" : "cmt_oops", go ? "みどりの ときは、タッチしてね" : "あかの ときは、まってね"); }
  }
  const ok = good >= 6; if (ok) { confetti(50); joy(C.pony); } await speak(C.pony, "cmt_end", "とまる ちから、ばっちり！");
  grade(ok && !miss); GS.tasks++; if (ok) GS.ok++; playLog({ type: "stopgame", good, miss, ok, ...(MODE === "multi" ? { who: NAMES[heroKind] } : {}) });
  await sleep(300); g.remove(); return ok; }
/* 🏁 よーい…どん？：「どん！」の ときだけ タッチ（6かい） */
async function cmYoiDon(heroKind) {
  const g = panel("よーい…どん？", "#FFF3D6"); await speak(C.pony, "cmy_intro", "よーい どん、の どんで タッチしてね。どん じゃない ときは、まってね");
  const btn = card(g, 560, 330, 480, 300, null, "🏁", { es: 170 }); txt(g, 800, 760, "「どん！」で タッチ", 60, { "text-anchor": "middle" }); const W = { donguri: "どんぐり！", donburi: "どんぶり！", dorayaki: "どらやき！", dondon: "どんどん！" };
  const seq = shuffle(["don", "don", "don", ...shuffle(Object.keys(W)).slice(0, 3)]); let good = 0, miss = 0;
  for (const w of seq) {
    btn.rect.setAttribute("fill", "#FFF8E8"); await speak(C.pony, "cmy_yoi", "よーい"); await sleep(400 + rnd(900));
    let hit = false; btn.onclick = () => { if (!hit) { hit = true; btn.rect.setAttribute("fill", "#FFE27A"); } };
    await speak(C.pony, `cmy_${w}`, w === "don" ? "どん！" : W[w]); await sleep(w === "don" ? 1600 : 1300); btn.onclick = null;
    if ((w === "don") === hit) { good++; chime(); if (w !== "don") await speak(C.pony, "cmy_wait", "どん じゃ なかったね。まてたね！"); else markAbove(C.pony, "sparkle"); }
    else { miss++; noise(.1, 600, .3); await speak(C.pony, w === "don" ? "cmy_slow" : "cmy_oops", w === "don" ? "どん、の ときは タッチしてね" : "どん じゃ ないよ。よく きいてね"); }
    await sleep(300);
  }
  const ok = good >= 5; if (ok) { confetti(50); joy(C.pony); } await speak(C.pony, "cmy_end", "よく きいて、まてたね！");
  grade(ok && !miss); GS.tasks++; if (ok) GS.ok++; playLog({ type: "yoidon", good, miss, ok, ...(MODE === "multi" ? { who: NAMES[heroKind] } : {}) });
  await sleep(300); g.remove(); return ok; }
{ const lc = landChild; landChild = async function (pc = P.shima) {
    if (!winner && KN_PC === pc && ["a3", "c2"].includes(pc.node) && curStage === "chotto") {
      const dice = document.getElementById("dice"); if (dice) dice.style.visibility = "hidden";
      let ok = false; try { ok = await (pc.node === "a3" ? cmTraffic : cmYoiDon)(pc.kind); } finally { if (dice) dice.style.visibility = ""; }
      if (ok) { if (pc.player) pc.player.ok++; await seedGet(pc); } return; }
    return lc(pc); }; }
EV_STYLE.stopgame = ["#C9EBB5", () => "🚦"]; EV_STYLE.yoidon = ["#FFE27A", () => "🏁"];
{ const be = boardEvent; boardEvent = async function (pc) { const ev = (EVENTS[curStage] || {})[pc.node]; if (ev && (ev[0] === "stopgame" || ev[0] === "yoidon")) return; return be(pc); }; }
STAGE_DEF.chotto = { ground: "#FFF0EE", sky: "#CFEAFB", names: ["いえ", "いえ", "がっこう", "がっこう", "こうえん", "こうえん", "まち", "まち", "いえ"], fills: { いえ: "#FFE3B3", がっこう: "#D7ECFF", こうえん: "#D7F0D2", まち: "#FFD1D9" } };
board7("chotto", ["いえ", "いえ", "がっこう", "こうえん", "まち", "いえ"], "hall");
BOARD_BG.chotto = L => { bg7(L, "#FFF0EE", ["#FFE3B3", "#D7ECFF", "#D7F0D2"], "🛑 ちょっと まって", "#E5484D"); txt(L, 1460, 180, "🚦", 110, { "text-anchor": "middle" }); };
BLOCK_DEF.chotto = { who: "tora", sleep: false, intro: ["p_blk_chotto", "とらおくんが、あかしんごうなのに わたろうと して いるよ。こえを かけよう"], say: ["blk_chotto", "ちょっと まって！ あかだよ"], to: "とらおくんに いおう", keys: [["まって", "待って", "ちょっと", "あか", "赤"]], res: ["rs_chotto", "あっ、ほんとだ。とまって よかった。ありがとう"] };
SLEEPER_OF.chotto = "tora";
EVENTS.chotto = { a2: ["fwd", 2, "ev_chottof", "ちょっと まって できた！ 2マス すすむよ"], m2: ["back", 2, "ev_chottob", "あわてて ころんだ！ 2マス もどるよ"], d1: ["back", 4, "ev_chottoh", "いそいで わすれものを した！ 4マス もどるよ"],
  a3: ["stopgame", 0, "", ""], c2: ["yoidon", 0, "", ""] };
/* ---------- 🤝 あいての サイン（2026-10-19） ----------
   👀 あいての ようす → 📡 どんな サイン？ → 🪞 いまの じぶんは？（よろこばれた→バッジ「やさしいね」など／きづいて なおす→「〇〇を たいくつに させちゃったね」）
   → 🗣 なんて いう？ →（段4〜）どうして わかったの？。ゴールで もらった バッジを ならべる。せめない ことばで。 */
function asAnim(c, mv) {
  if (mv === "back") { c.dx.t = (c.dx.t || 0) + 150; surprise(c); c.lean.t = 10; later(1600, () => c.lean.t = 0); return; }
  if (mv === "ears") { const g = el("g", {}, front()); txt(g, 0, 0, "🙉", 96, { "text-anchor": "middle" }); follow(g, () => { const p = headTop(c); return [p.x + 120, p.y + 70, 0, 1]; }); c.eyeScale.t = .6; c.squash.vel -= 1; later(2600, () => { g.remove(); c.eyeScale.t = 1; }); return; }
  if (mv === "no") { playMove(c, "no"); c.sadMouth = true; markAbove(c, "anger", { dx: 90 }); return; }
  if (mv === "sleepy") { playMove(c, "sleepy"); later(1200, () => playMove(c, "look")); return; }
  playMove(c, mv); }
async function asRun(hero, first) {
  const t = tierOf(), sc = s11Pick(AS, hero, t), subj = subjOf(sc, hero), vk = vkOf(sc, subj); S11_N.set(sc.id, (S11_N.get(sc.id) || 0) + 1);
  const lv = t >= 2 ? 1 : 0; showEngine(null, `あいての サイン（${sc.id}・段${t + 1}）`);
  const { hero: h, ask: a } = setSitView({ id: "as_" + sc.id, place: sc.place, asker: subj, intro: "as" }, hero); a.dx.v = a.dx.t = 0;
  enter(h); await sleep(900); if (first) await speak(C.pony, "asp_intro", "あいての サイン！ あいての かおや からだを よく みて、きもちを うけとろう");
  await speak(C.pony, `as_${sc.id}_n`, KTX(`as_${sc.id}_n`)); playMove(h, sc.pos ? "nod" : "point");
  asAnim(a, sc.mv); await speak(a, `ass_${sc.id}${vk}`, sc.look); const loop = setInterval(() => { if (sc.mv !== "back") asAnim(a, sc.mv); }, 3500);
  let okN = 0, nSay = 0, wrong = 0; const log = [];
  // 1) 📡 どんな サイン？
  await speak(C.pony, "asp_sign", "どんな サイン かな？ タッチしてね");
  const ch = s11Choose(shuffle((sc.signs || Object.keys(AS_SIGN)).map(k_ => [k_, AS_SIGN[k_]]).map(([k_, [e, l]]) => [e, l, k_ === sc.sign ? 1 : 0, null])), async () => { wrong++; await speak(C.pony, "asp_nope", "よく みて みよう。かおや からだは どう なってる？"); });
  await ch.done; clearInterval(loop); ch.g.remove(); markAbove(C.pony, "sparkle"); await speak(C.pony, `as_${sc.id}_c`, KTX(`as_${sc.id}_c`));
  // 2) 🪞 いまの じぶんは？
  await speak(C.pony, "asp_me", "いまの きみは、どう だったかな？");
  const ch2 = s11Choose(shuffle([[sc.pos ? "🌟" : "💡", sc.me, 1, null], [sc.pos ? "💧" : "🌟", sc.meNg, 0]]), async () => { wrong++; await speak(C.pony, "asp_nope", "よく みて みよう。かおや からだは どう なってる？"); }, 120, 680);
  await ch2.done; ch2.g.remove();
  if (t >= 2) { nSay++; const r = await kmSay(h, `as_${sc.id}_m`, sc.me, [[sc.pos ? sc.me.replace(/ね$/, "").split(" ").pop() : sc.me.split(" ")[1].replace(/[にが]$/, "")]], "いって みよう"); if (r.ok) okN++; log.push(`🪞${r.ok ? "○" : "×"}${r.heard}`); }
  else await speak(C.pony, `as_${sc.id}_m`, sc.me);
  if (sc.pos) { const b = asBadge(sc.me); if (!AS_GOT.includes(sc.id)) AS_GOT.push(sc.id); await speak(C.pony, "asp_badge", "ことばの バッジを もらったよ"); b.remove(); }
  else await speak(C.pony, "asp_fix", "きづけたね。なおせば だいじょうぶ");
  // 3) 🗣 なんて いう？
  await speak(C.pony, "asp_say", "なんて いう？");
  nSay++; { const r = await kmSay(h, `as_${sc.id}_a${lv}`, sc.say[lv], sc.say[2], "いって みよう"); if (r.ok) okN++; log.push(`🗣${r.ok ? "○" : "×"}${r.heard}`); }
  if (sc.mv === "back") { a.dx.t = 0; } a.sadMouth = false; joy(a); await speak(a, `asr_${sc.id}${vk}`, sc.res);
  // 4) どうして わかったの？（段4から）
  if (t >= 3) { await speak(C.pony, "asp_why", "どうして わかったの？"); nSay++; const r = await kmSay(h, `as_${sc.id}_w`, sc.why[0], sc.why[1], "サインを いおう"); if (r.ok) okN++; log.push(`📡${r.ok ? "○" : "×"}${r.heard}`); }
  const ok = okN * 2 >= nSay; grade(ok && !wrong && okN === nSay); GS.tasks++; if (ok) GS.ok++;
  playLog({ type: "aite", id: sc.id, tier: t, okN, nSay, wrong, tries: log, ...(MODE === "multi" ? { who: NAMES[hero] } : {}) });
  if (ok) { joy(h); confetti(50); joy(C.pony); await speak(C.pony, "asp_ok", "サイン キャッチ！"); await seedGet(h); }
  await sleep(400); setView("board"); return ok;
}
// バッジ（メダル）
function asBadge(text, x = 800, y = 300, s = 1) { const g = el("g", {}, hudLayer);
  el("circle", { cx: x, cy: y, r: 120 * s, fill: "#FFD25E", ...S6(8) }, g); el("circle", { cx: x, cy: y, r: 96 * s, fill: "#FFE9A8", ...S6(4) }, g); txt(g, x, y + 30 * s, "🌟", 84 * s, { "text-anchor": "middle" });
  let ls = [text]; if (text.length > 9) { const sp = [...text].map((c, i) => c === " " ? i : -1).filter(i => i > 0).sort((p, q) => Math.abs(p - text.length / 2) - Math.abs(q - text.length / 2))[0]; if (sp) ls = [text.slice(0, sp), text.slice(sp + 1)]; }
  const fs = 38 * s, w = Math.max(240 * s, Math.max(...ls.map(l => l.length)) * fs + 50 * s), hh = (ls.length * 1.25 * fs + 26 * s);
  el("rect", { x: x - w / 2, y: y + 110 * s, width: w, height: hh, rx: 30 * s, fill: "#FFFFFF", ...S6(5) }, g); ls.forEach((l, i) => txt(g, x, y + 110 * s + 13 * s + fs * (1.05 + i * 1.25), l, fs, { "text-anchor": "middle" }));
  if (s === 1) { for (let i = 0; i < 8; i++) mark("sparkle", x - 150 + rnd(300), y - 100 + rnd(160), { vy: -80, life: .7, s: .5 }); chime(); }
  return g; }
// ライバル：がおが きづかずに やっちゃう → あいての サイン → こどもが おしえる
async function asRival() {
  const pool = AS.filter(s => !s.pos && subjOf(s, RIVAL) && subjOf(s, RIVAL) !== RIVAL), fresh = pool.filter(s => !S11_R.has(s.id)), sc = (fresh.length ? fresh : pool)[rnd((fresh.length ? fresh : pool).length)]; S11_R.add(sc.id);
  const subj = subjOf(sc, RIVAL), vk = vkOf(sc, subj); showEngine(null, `${NAMES[RIVAL]}の ばん（${sc.id}）`);
  const { hero: h, ask: a } = setSitView({ id: `as_${sc.id}`, place: sc.place, asker: subj, intro: "as" }, RIVAL); a.dx.v = a.dx.t = 0;
  enter(h); await sleep(900); playMove(h, "pump"); await speak(h, `asg_${sc.id}`, sc.gao);
  asAnim(a, sc.mv); await speak(a, `ass_${sc.id}${vk}`, sc.look); markAbove(C.pony, "q"); await sleep(400);
  await speak(C.pony, "asp_teach", "がおくんに おしえて あげよう"); playMove(h, "think"); await rivalSay(h, "huh");
  const r = await kmSay(C.shima, `as_${sc.id}_t`, sc.teach, sc.say[2], `${NAMES[RIVAL]}に おしえよう`);
  playLog({ type: "teach", id: `as_${sc.id}`, ok: r.ok, tries: [r.heard] }); if (r.ok) GS.ok++;
  a.dx.t = 0; a.sadMouth = false; if (r.ok) { joy(C.shima); confetti(40); } await rivalSay(h, "thanks"); joy(a); await sleep(600); setView("board"); }
// ゴールで もらった バッジを ならべる
async function asGoal() { if (curStage !== "aite" || !AS_GOT.length) return;
  const dice = document.getElementById("dice"); if (dice) dice.style.visibility = "hidden";
  const g = panel("もらった ことばの バッジ", "#FFF6DC"); await speak(C.pony, "asp_goal", "きょう もらった ことばの バッジだよ");
  const n = AS_GOT.length, cols = Math.min(4, n);
  for (let i = 0; i < n; i++) { const sc = AS.find(s => s.id === AS_GOT[i]), x = 800 + ((i % cols) - (cols - 1) / 2) * 360, y = 260 + Math.floor(i / cols) * 330;
    const b = asBadge(sc.me, x, y, .72); g.appendChild(b); chime(); await speak(C.pony, `as_${sc.id}_m`, sc.me); }
  confetti(60); await sleep(1200); g.remove(); }
{ const en = ending; ending = async function (...a) { try { await asGoal(); } catch (e) {} return en(...a); }; }
{ const em = endingMulti; endingMulti = async function (...a) { try { await asGoal(); } catch (e) {} return em(...a); }; }
STAGE_DEF.aite = { ground: "#FFF4E6", sky: "#CFEAFB", names: ["いえ", "いえ", "がっこう", "がっこう", "こうえん", "こうえん", "まち", "まち", "いえ"], fills: { いえ: "#FFE3B3", がっこう: "#D7ECFF", こうえん: "#D7F0D2", まち: "#FFD1D9" } };
board7("aite", ["いえ", "いえ", "がっこう", "こうえん", "まち", "いえ"], "hall");
BOARD_BG.aite = L => { bg7(L, "#FFF4E6", ["#FFE3B3", "#D7ECFF", "#D7F0D2"], "🤝 あいての サイン", "#F08A3C"); txt(L, 1460, 180, "📡", 110, { "text-anchor": "middle" }); };
BLOCK_DEF.aite = { who: "kamejii", sleep: false, intro: ["p_blk_aite", "かめじいが、おもい にもつを もって、こまって いるみたい。こえを かけよう"], say: ["blk_aite", "にもつ、もとうか？"], to: "かめじいに いおう", keys: [["もとう", "持とう", "もつ", "持つ", "てつだ", "手伝"]], res: ["rs_aite", "おお、ありがとう。やさしいのう"] };
SLEEPER_OF.aite = "kamejii";
EVENTS.aite = { a2: ["fwd", 2, "ev_aitef", "にっこり サインを もらった！ 2マス すすむよ"], m2: ["back", 2, "ev_aiteb", "よそみを して ころんだ！ 2マス もどるよ"], d1: ["back", 4, "ev_aiteh", "サインに きづかず、まいごに なった！ 4マス もどるよ"] };
