/* ================= 「まねっこ しちゃった」ショートコース（manekko、2026-10-25） =================
   台本は sit/manekko_gen.py（manekko_data.js）。会話の「ながれ」を まなぶ：1つの 場面で 4かい やりとりが つづく。
   ターンごとに あいての ことば → カードで いいかたを えらぶ（まずい いいかたは あいての かおが くもる）→ いい いいかたを こえで いう。
   さいごまで つながると、あいてが「いっしょに あそぼう」と さそって くれる（ごほうび）。きもちメーター（😠😟🙂😄）で あいての かおを みせる。
   ライバルは がお（場面には ださない。がおの ばんは、がおが まずい いいかたを して、こどもが おしえる）。 */
const S13L = ["manekko"];
const S13_READY = true; /* 声が そろうまで false */
Object.assign(RIVAL_OF, { manekko: "gao" });
STAGES.push({ id: "manekko", name: "まねっこ しちゃった", icon: "🙊", ready: S13_READY });
ASK_ON_STAGE.add("mk");
const MNK_N = new Map(); let MNK_FRIENDS = 0, MNK_FIRST = true;
{ const ap = applyStage; applyStage = function (id, ...a) { if (S13L.includes(id)) { MNK_N.clear(); MNK_FRIENDS = 0; MNK_FIRST = true; } return ap(id, ...a); }; }
const mnkName = k => ({ tora: "とらおくん", kuma: "くまくん", panna: "ぱんなちゃん", nobbo: "せんせい" })[k] || NAMES[k];
function mnkPick(rival) { let pool = MNK.sc.filter(s => !rival || s.flow !== "help"); const m = Math.min(...pool.map(s => MNK_N.get(s.id) || 0)); pool = pool.filter(s => (MNK_N.get(s.id) || 0) === m);
  const s = pool[rnd(pool.length)]; MNK_N.set(s.id, (MNK_N.get(s.id) || 0) + 1); return s; }
/* ---------- きもちメーター ---------- */
const MNK_FACE = ["😠", "😟", "🙂", "😄"];
function mnkMeter(who) { const g = el("g", {}, hudLayer), x0 = 1180, y0 = 190; el("rect", { x: x0 - 20, y: y0 - 70, width: 380, height: 120, rx: 30, fill: "#FFFFFFE8", ...S6(5) }, g);
  txt(g, x0 + 170, y0 - 80, `${mnkName(who)}の きもち`, 28, { "text-anchor": "middle" });
  const fs = MNK_FACE.map((f, i) => txt(g, x0 + 30 + i * 90, y0 + 22, f, 64, { "text-anchor": "middle", opacity: .25 }));
  let cur = 1; g.set = (v, who2) => { cur = Math.max(0, Math.min(3, v)); fs.forEach((t, i) => { t.setAttribute("opacity", i === cur ? 1 : .22); t.setAttribute("font-size", i === cur ? 80 : 56); });
    if (who2) g.querySelector("text").textContent = `${mnkName(who2)}の きもち`; };
  g.get = () => cur; return g; }
/* ---------- うごき（だれかが やって いる こと） ---------- */
function mnkAct(c, kind) { const L = (ms, f) => later(ms, f), H = () => world(c, 330, 300), g = el("g", {}, front());
  const A = {
    run: () => { hold(c, "run", 1.4); c.dx.t = c.dx.v + 260; L(1500, () => { c.dx.t = c.dx.v - 260; }); },
    word: () => { c.mouthOpen.t = .7; const p = headTop(c), b = el("g", {}, g); el("rect", { x: p.x + 40, y: p.y - 150, width: 210, height: 100, rx: 40, fill: "#FFFFFF", ...S6(6) }, b); txt(b, p.x + 145, p.y - 80, "ばか！", 50, { "text-anchor": "middle" });
      playMove(c, "laugh"); L(1600, () => { c.mouthOpen.t = 0; b.remove(); }); },
    ball: () => { c.armR.t = -150; const b = el("circle", { r: 34, fill: "#FF8FA3", ...S6(5) }, g); let t = 0; const p = H();
      addTick(dt => { if (!b.isConnected) return false; t += dt; const k = Math.min(1, t / 1.2); b.setAttribute("cx", p.x + 700 * k); b.setAttribute("cy", p.y - 380 * Math.sin(Math.PI * k) - 100 * k); if (k >= 1) { b.remove(); return false; } });
      L(400, () => c.armR.t = 0); },
    eraser: () => { const e = el("g", {}, g); el("rect", { x: -40, y: -24, width: 80, height: 48, rx: 10, fill: "#FFFFFF", ...S6(5) }, e); el("rect", { x: -40, y: -24, width: 34, height: 48, rx: 8, fill: "#7FCBF0", ...S6(5) }, e);
      follow(e, () => { const p = H(); return [p.x, p.y, 0, Math.max(c.s, .6)]; }); for (let i = 0; i < 6; i++) L(i * 220, () => { c.armR.t = i % 2 ? -40 : -60; }); L(1500, () => { c.armR.t = 0; e.remove(); }); },
    climb: () => { markAbove(c, "ex"); for (let i = 0; i < 3; i++) L(i * 500, () => jump(c, .6)); const ar = txt(g, c.x + 200 * c.s, 600, "⬆", 90, { "text-anchor": "middle" }); L(1800, () => ar.remove()); },
    cut: () => { hold(c, "run", .8); c.dx.t = c.dx.v + 140; markAbove(c, "ex"); L(1600, () => { c.dx.t = c.dx.v - 140; }); },
    milk: () => { const m = txt(g, 0, 0, "🥛", 120, { "text-anchor": "middle" }); follow(m, () => { const p = headTop(c); return [p.x + 90, p.y + 260 * c.s, 0, 1]; });
      for (let i = 0; i < 6; i++) L(200 + i * 250, () => mark("sparkle", headTop(c).x + 60, headTop(c).y + 120 * c.s, { vy: -120, life: .7, s: .4 })); L(1900, () => m.remove()); },
    desk: () => { const b0 = c.y + c.base * c.s, cx = c.x + 200 * c.s, d = el("g", {}, propG); el("rect", { x: cx - 150, y: b0 - 145, width: 300, height: 40, rx: 8, fill: "#C98A4B", ...S6(5) }, d); [cx - 130, cx + 108].forEach(x => el("rect", { x, y: b0 - 105, width: 22, height: 105, fill: "#9A6B43", ...S6(4) }, d));
      jump(c, .8); L(400, () => place(c, cx, b0 - 140, c.s)); L(2600, () => { place(c, cx, b0, c.s); d.remove(); }); },
    umbrella: () => { const u = el("g", {}, g); el("path", { d: "M-90 0 Q-90 -90 0 -90 Q90 -90 90 0 Z", fill: "#7FCBF0", ...S6(5) }, u); el("path", { d: "M0 0 V110 q0 20 -20 20", fill: "none", ...S6(6) }, u);
      let t = 0; addTick(dt => { if (!u.isConnected) return false; t += dt; const p = H(); u.setAttribute("transform", `translate(${p.x} ${p.y - 60}) rotate(${(t * 420) % 360}) scale(${Math.max(c.s, .6)})`); }); L(2000, () => u.remove()); },
    sand: () => { c.armR.t = -130; const p = H(); for (let i = 0; i < 16; i++) { const d = el("circle", { cx: p.x, cy: p.y - 40, r: 9, fill: "#C9A26B" }, g); const vx = 200 + rnd(400), vy = -200 - rnd(250); let t = 0;
        addTick(dt => { if (!d.isConnected) return false; t += dt; d.setAttribute("cx", p.x + vx * t); d.setAttribute("cy", p.y - 40 + vy * t + 500 * t * t); if (t > 1.1) { d.remove(); return false; } }); } L(500, () => c.armR.t = 0); },
  }; (A[kind] || (() => playMove(c, "look")))(); later(2600, () => g.remove()); }
// 場面ごとの こもの（れつ・すべりだい）
function mnkSet(sc) { }
// 🍛 はいぜんの れつ：みんなが ならんで いる → とらおくんが わりこむ → こたえる 子も まねして わりこむ（2026-10-25）
async function mnkLine(sc, h, a, heroKind, narr) {
  const S = .78, cen = c => c.x + 200 * c.s, go = (c, cx, run = true) => { c.dx.t = cx - cen(c); if (run) hold(c, "run", 1); };
  const ex = ["panna", "chu", "mii", "pyon", "kon"].filter(k => k !== heroKind && k !== sc.model && k !== sc.ptr && k !== RIVAL && C[k]).slice(0, 3);
  place(h, cen(h), 975, h.s * .85); const D = 175;
  const front = xtra(ex[0], 1520, (KID_S[ex[0]] || 1) * S); front.dx.v = front.dx.t = 0;
  place(a, 1520 - D, 975, (ASK_AT[sc.ptr] || [0, 1])[1] * S); a.dx.v = a.dx.t = 0;
  const back = ex.slice(1).map((k, i) => { const c = xtra(k, 1520 - D * (i + 2), (KID_S[k] || 1) * S); c.dx.v = c.dx.t = 0; return c; });
  const lab = el("g", {}, propG); el("rect", { x: 1290, y: 380, width: 280, height: 70, rx: 35, fill: "#FFFFFF", ...S6(5) }, lab); txt(lab, 1430, 428, "🍛 ここから ならぶ", 30, { "text-anchor": "middle" });
  await sleep(700);
  const line = [a, ...back], shift = () => line.forEach((c, i) => go(c, 1520 - D * (i + 1 + (line.cut || 0)), false));
  // とらおくんが わりこむ
  const m = xtra(sc.model, 300, (KID_S[sc.model] || 1) * S); m.dx.v = -400; m.dx.t = 0; hold(m, "run", 1.4);
  const sp = narr ? speak(C.pony, `mk_${sc.id}_n`, MNK.txt[`mk_${sc.id}_n`]) : sleep(3600);
  await sleep(900); line.cut = 1; shift(); go(m, 1520 - D); await sleep(700); markAbove(a, "ex"); a.sadMouth = true; playMove(a, "look");
  await sleep(1300);
  // こたえる 子も まねして わりこむ（くまくんの まえ）
  line.cut = 2; shift(); go(h, 1520 - 2 * D); await sleep(900); markAbove(a, "anger");
  await sp; await sleep(300); lab.remove(); }
/* ---------- カード（いい いいかた 1つ・まずい いいかた 2つ） ---------- */
function mnkChoose(opts, onWrong) { const g = el("g", {}, hudLayer), W = 420, x0 = 800 - opts.length * (W + 24) / 2 + 12, y = 330;
  el("rect", { x: x0 - 30, y: y - 18, width: opts.length * (W + 24) + 36, height: 196, rx: 30, fill: "#FFFFFFE8", ...S6(5) }, g);
  const cs = opts.map((o, i) => { const c = card(g, x0 + i * (W + 24), y, W, 160, o.t.replace(/^（(.*)）$/, "$1"), o.t.startsWith("（") ? "🤐" : "💬", { es: 60, fs: 40 }); c.o = o; return c; });
  const done = new Promise(res => { let busy = false; cs.forEach(c => c.onclick = async () => { if (busy || c.dim) return;
      if (c.o.good) { cs.forEach(x => x.onclick = null); c.rect.setAttribute("fill", "#FFE27A"); chime(); res(); return; }
      busy = true; c.dim = 1; c.setAttribute("opacity", .35); noise(.1, 700, .35); await onWrong(c.o); busy = false; }); });
  return { g, done }; }
/* ---------- こどもの ばん ---------- */
async function mnkRun(hero, first) {
  const t = tierOf(), lv = t <= 1 ? 0 : t <= 3 ? 1 : 2, sc = mnkPick(false), help = sc.flow === "help";
  showEngine(null, `まねっこ（${sc.id}・${sc.flow}・段${t + 1}）`);
  const { hero: h, ask: a } = setSitView({ id: "mk_" + sc.id, place: sc.place, asker: sc.ptr, intro: "mk" }, hero); a.dx.v = a.dx.t = 0; mnkSet(sc);
  enter(h); await sleep(900);
  if (first) await speak(C.pony, "mk_intro", MNK.txt.mk_intro);
  // まねされた 子が やって みせる → （help でなければ）こどもが まねする／（help なら）あいてが まねする
  if (sc.anim === "cut") await mnkLine(sc, h, a, hero, true); else {
  const m = xtra(sc.model, 900, (KID_S[sc.model] || 1) * .82); m.dx.v = m.dx.t = 0;
  if (sc.anim === "run") { m.dx.v = -700; m.dx.t = 0; hold(m, "run", 1.6); } else later(300, () => mnkAct(m, sc.anim)); await speak(C.pony, `mk_${sc.id}_n`, MNK.txt[`mk_${sc.id}_n`]);
  m.dx.t = 1400; hold(m, "run", 1.2); later(1300, () => { m.root.style.display = "none"; });
  mnkAct(help ? a : h, sc.anim); await sleep(1500); }
  const mt = mnkMeter(sc.ptr); let mood = help ? 2 : sc.flow === "kitsui" ? 0 : 1; mt.set(mood);
  const face = (c, v) => { c.sadMouth = v <= 1; if (v === 0) markAbove(c, "anger"); if (v >= 3) joy(c); };
  face(a, mood); if (!help) { surprise(a); }
  let okN = 0, wrong = 0, tch = null; const log = [];
  for (let i = 0; i < sc.turns.length; i++) {
    const tu = sc.turns[i]; let sp = a;
    if (tu.who === "nobbo") { if (!tch) { tch = xtra("nobbo", 820, (ASK_AT.nobbo || [0, 1])[1] * .95); tch.dx.v = 600; tch.dx.t = 0; hold(tch, "run", .9); await sleep(900); mt.set(2, "nobbo"); } sp = tch; }
    else if (tch) mt.set(mood, sc.ptr);
    await speak(sp, `mk_${sc.id}_t${i}`, tu.say);
    await speak(C.pony, help && i === 0 ? "mk_help" : "mk_pick", help && i === 0 ? MNK.txt.mk_help : MNK.txt.mk_pick);
    const opts = shuffle([{ t: tu.good[0], good: 1 }, ...tu.bad.map(([b, r], j) => ({ t: b, r, j }))]);
    const ch = mnkChoose(opts, async o => { wrong++; log.push(`✖${o.t}`); const v = sp === tch ? 1 : (mood = Math.max(0, mood - 1)); if (sp !== tch) { mt.set(mood); face(a, mood); } else { mt.set(1); playMove(tch, "think"); }
      await speak(sp, `mk_${sc.id}_t${i}_b${o.j}`, o.r); await speak(C.pony, "mk_retry", MNK.txt.mk_retry); });
    await ch.done; ch.g.remove();
    if (sp === tch) mt.set(3); else { mood = Math.min(3, mood + 1); mt.set(mood); face(a, mood); }
    const r = await kmSay(h, `mk_${sc.id}_t${i}_g${lv}`, tu.good[lv], tu.keys[lv], help ? "いって あげよう" : "いって みよう"); if (r.ok) okN++; log.push(`${r.ok ? "○" : "×"}${r.heard}`);
  }
  // さいごまで つながった：あいてが さそって くれる
  if (tch) { tch.dx.t = -900; } mt.set(3, sc.ptr); mood = 3; a.sadMouth = false; joy(a); await speak(a, `mk_${sc.id}_end`, sc.end);
  joy(h); confetti(60); MNK_FRIENDS++; const nb = el("g", {}, hudLayer); el("rect", { x: 560, y: 560, width: 480, height: 110, rx: 55, fill: "#FFD1D9", ...S6(6) }, nb); txt(nb, 800, 632, `なかよし ${MNK_FRIENDS}にんめ！ 💞`, 46, { "text-anchor": "middle" });
  for (let i = 0; i < 10; i++) later(i * 120, () => mark("sparkle", 400 + rnd(800), 500 + rnd(300), { vy: -150, life: .8, s: .6 }));
  await speak(C.pony, "mk_naka", MNK.txt.mk_naka); nb.remove(); mt.remove();
  const ok = okN * 2 >= sc.turns.length; grade(ok && !wrong && okN === sc.turns.length); GS.tasks++; if (ok) GS.ok++;
  playLog({ type: "manekko", id: sc.id, flow: sc.flow, tier: t, okN, n: sc.turns.length, wrong, tries: log, ...(MODE === "multi" ? { who: NAMES[hero] } : {}) });
  if (ok) await seedGet(h);
  await sleep(400); setView("board"); return ok;
}
/* ---------- ライバル（がお）の ばん：がおが まねして、まずい いいかた → こどもが おしえる ---------- */
async function mnkRival() {
  const sc = mnkPick(true), tu = sc.turns[0]; showEngine(null, `${NAMES[RIVAL]}の ばん（まねっこ ${sc.id}）`);
  const { hero: h, ask: a } = setSitView({ id: "mk_" + sc.id, place: sc.place, asker: sc.ptr, intro: "mk" }, RIVAL); a.dx.v = a.dx.t = 0; mnkSet(sc);
  enter(h); await sleep(900); if (sc.anim === "cut") await mnkLine(sc, h, a, RIVAL, false); else { mnkAct(h, sc.anim); await sleep(1600); }
  const mt = mnkMeter(sc.ptr); mt.set(1); surprise(a); await speak(a, `mk_${sc.id}_t0`, tu.say);
  playMove(h, "pump"); await speak(h, "mk_gao_bad", "しらないもん！"); mt.set(0); a.sadMouth = true; markAbove(a, "anger"); await speak(a, `mk_${sc.id}_t0_b0`, tu.bad[0][1]);
  await speak(C.pony, "mk_teach", MNK.txt.mk_teach); playMove(h, "think");
  const r = await kmSay(C.shima, `mk_${sc.id}_t0_g1`, tu.good[1], tu.keys[1], `${NAMES[RIVAL]}に おしえよう`);
  playLog({ type: "teach", id: `mk_${sc.id}`, ok: r.ok, tries: [r.heard] }); if (r.ok) GS.ok++;
  await speak(h, "mk_gao_ok", "そっか。おしえて くれて ありがとう"); mt.set(3); a.sadMouth = false; joy(a); if (r.ok) { joy(C.shima); confetti(40); }
  await sleep(700); mt.remove(); setView("board");
}
{ const gs = gaoSit; gaoSit = async function (before) { if (S13L.includes(curStage)) return mnkRival(); return gs(before); }; }
{ const lc = landChild; landChild = async function (pc = P.shima) {
    if (!S13L.includes(curStage) || winner) return lc(pc);
    const k = kindOf(pc.node); if (k === "start" || k === "treasure") return lc(pc);
    const f = MNK_FIRST; MNK_FIRST = false; const ok = await mnkRun(pc.kind, f); if (ok && pc.player) pc.player.ok++; }; }
{ const dr = drawRoom; drawRoom = function (place, noSign = false) { if (S13L.includes(curStage) && room8(place)) { S10L.push(curStage); try { return dr(place, noSign); } finally { S10L.pop(); } } return dr(place, noSign); }; }
/* ---------- 盤 ---------- */
{ const P = ["きょうしつ", "ろうか", "きゅうしょく", "こうえん", "かえりみち", "きょうしつ"], fills = {}; P.forEach((p, i) => fills[p] = FILL8[i % FILL8.length]);
  STAGE_DEF.manekko = { ground: "#FFF6F0", sky: "#CFEAFB", names: [P[0], P[1], P[2], P[2], P[3], P[3], P[4], P[4], P[5]], fills };
  board7("manekko", P, "hall"); }
BOARD_BG.manekko = L => { bg7(L, "#FFF6F0", ["#FFE3B3", "#D7ECFF", "#D7F0D2"], "🙊 まねっこ しちゃった", "#E86A9A"); txt(L, 1460, 180, "💞", 110, { "text-anchor": "middle" }); };
BLOCK_DEF.manekko = { who: "doshin", sleep: false, intro: ["p_blk_manekko", "どしんが、だれかの まねを して、ろうかを はしろうと して いるよ"], say: ["blk_manekko", "ろうかは あるこうね"], to: "どしんに いおう", keys: [["ろうか", "廊下"], ["あるこう", "歩こう", "あるいて", "歩いて"]], res: ["rs_manekko", "そうだった！ おしえて くれて ありがとう"] };
SLEEPER_OF.manekko = "doshin";
EVENTS.manekko = { a2: ["fwd", 2, "ev_manekkof", "ともだちと なかよく できた！ 2マス すすむよ"], m2: ["back", 2, "ev_manekkob", "まねっこして ころんじゃった！ 2マス もどるよ"], d1: ["back", 4, "ev_manekkoh", "わすれものを とりに もどった！ 4マス もどるよ"] };
