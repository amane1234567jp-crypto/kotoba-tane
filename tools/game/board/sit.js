var frontG = null; // キャラの前に出す小物（手に持つ物・ひざのばんそうこう など）
function front() { if (!frontG || !frontG.isConnected) frontG = el("g", {}, fxLayer); return frontG; }
function clearMarks() { marks.forEach(k => k.g.remove()); marks.length = 0; if (frontG) { frontG.remove(); frontG = null; } }
/* ================= 場面（シチュエーション）で こたえる =================
   1) アニメで「何が起きたか」を見せる → 2) 相手が話しかける → 3) 子どもが場面に合う言葉でこたえる
   → 4) 相手がこたえ、出てきた物の名前（ばんそうこう など）を絵と声で見せる。
   こたえの長さ・文法はレベルで4段（tier）に変わる。 */
const sitUsed = new Set();
// レベルで 4段（0〜3）。2しゅうめは 1段、3しゅうめ からは 2段 ずらして もっと むずかしく（最大 6段め）
const tierOf = () => Math.min(5, (E.L <= 2 ? 0 : E.L <= 4 ? 1 : E.L <= 7 ? 2 : 3) + (MODE === "multi" ? 0 : Math.min(2, Math.max(0, (SAVE.lap || 1) - 1))));
// heroKind: こたえる キャラ（まるシマ・ライバル・みんなモードの人）。相手が じぶんと 同じ場面や、がお・ちゅうが 出てくる場面を よける
function pickSit(place, heroKind = "shima") {
  const okFor = s => (s.stage || "kousha") === curStage && s.asker !== heroKind
    && (heroKind === "shima" || (MODE === "solo" ? s.gaoOk : (heroKind !== "gao" || s.gaoOk)))
    && !(heroKind === "chu" && s.intro === "tag") && !(s.cast && s.cast.includes(heroKind)); // やりとりに 出ている キャラは、その場面の 主人公に しない
  let pool = SITS.filter(s => okFor(s) && s.place === place && !sitUsed.has(s.id));
  if (!pool.length) pool = SITS.filter(s => okFor(s) && !sitUsed.has(s.id));
  if (!pool.length) { [...sitUsed].forEach(id => { const x = SITS.find(s => s.id === id); if (x && (x.stage || "kousha") === curStage) sitUsed.delete(id); }); pool = SITS.filter(s => okFor(s) && s.place === place && !sitUsed.has(s.id)); if (!pool.length) pool = SITS.filter(s => okFor(s) && !sitUsed.has(s.id)); if (!pool.length) pool = SITS.filter(okFor); }
  const s = pool[rnd(pool.length)]; sitUsed.add(s.id); return s;
}
const ASK_ON_STAGE = new Set(["door", "arrive", "stuck", "scared", "jumpdown", "loud", "borrow", "slow"]); // 最初から相手がその場にいる場面
const ASK_AT = { meebaa: [1190, .9], kamejii: [1180, .9], nobbo: [1220, 1.0], gao: [1190, .95], mii: [1190, .9], chu: [1220, .42], pyon: [1190, .9], doshin: [1260, 1.38], pyonmama: [1200, 1.0], gaojii: [1190, 1.0], miibaa: [1190, .98], doshinpapa: [1250, 1.48], kon: [1190, .88] };
let propG = null;
function resetChar(c) { c.dx.v = 0; c.dx.t = 0; c.lean.t = 0; c.lift.t = 0; c.armL.t = 0; c.armR.t = 0; c.headRot.t = 0; c.tm = {}; c.sadMouth = false; c.roundMouth = false; c.happyOn = false; c.eyeScale.t = 1; c.squash.t = 1; }
function setSitView(s, heroKind) {
  clearMarks(); view = "scene"; chars.forEach(c => c.root.style.display = "none"); visible.length = 0; unsay(); showEar(null, false); hideTask();
  boardLayer.style.display = "none"; sceneLayer.style.display = ""; hud.style.display = "none"; diceBtn.style.visibility = "hidden";
  const atDoor = s.intro === "door";
  drawRoom(atDoor ? "ろうか" : s.place, atDoor); propG = el("g", {}, sceneLayer);
  const hero = C[heroKind], ask = C[s.asker];
  [C.pony, C.shima, hero, ask].forEach(resetChar);
  place(C.pony, 120, 975, .46); show(C.pony);
  const HS = { shima: .88, gao: .9, pyon: .86, mii: .86, chu: .42, doshin: 1.15, meebaa: .86, kamejii: .86, kon: .88 };
  if (MODE === "solo" && heroKind !== "shima") { place(C.shima, 320, 975, .55); show(C.shima); place(hero, 650, 975, HS[heroKind] || .9); }
  else place(hero, 600, 975, HS[heroKind] || .88);
  show(hero);
  const [ax, as] = ASK_AT[s.asker];
  if (atDoor) { place(ask, 930, 770, .55); } // ドアの向こうに立っている（ドアが開くまで見せない）
  else { place(ask, ax, 975, as); show(ask); }
  // 登場する人は画面の外で待たせておく（途中でワープして見えないように）
  if (motion >= .9) { // 動きを減らす設定のときは、最初から舞台に立たせる
    hero.dx.v = hero.dx.t = -1100;
    if (!ASK_ON_STAGE.has(s.intro)) ask.dx.v = ask.dx.t = 1000;
  }
  return { hero, ask };
}
function follow(g, fn) { front().appendChild(g); addTick(() => { if (!g.isConnected) return false; const [x, y, r = 0, k = 1] = fn(); g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(1)}) scale(${k})`); }); }
const knock = () => { if (!ctx) return; [0, 260].forEach(t => later(t, () => { noise(.06, 700, .8); blip(180, 120, .06, "triangle"); })); };
const thud = () => { if (!ctx) return; noise(.12, 300, .9); blip(160, 60, .2, "sine"); };

/* ---------- 物の絵 ---------- */
function drawItem(g, kind) {
  const s = (sw = 6) => ({ stroke: INK, "stroke-width": sw, "stroke-linejoin": "round", "stroke-linecap": "round" });
  if (kind === "bandage") { const b = el("g", { transform: "rotate(-20)" }, g);
    el("rect", { x: -95, y: -32, width: 190, height: 64, rx: 32, fill: "#F2C38F", ...s() }, b); el("rect", { x: -32, y: -26, width: 64, height: 52, rx: 8, fill: "#FFE9D6", ...s(4) }, b);
    [[-70, -10], [-60, 10], [60, -10], [70, 10], [-75, 8], [75, -6]].forEach(([x, y]) => el("circle", { cx: x, cy: y, r: 3.5, fill: "#B07A45" }, b)); }
  if (kind === "slipper") { el("path", { d: "M-40 -90 Q40 -100 45 -20 Q50 60 30 90 Q0 110 -30 90 Q-55 40 -55 -20 Q-60 -80 -40 -90 Z", fill: "#7FCBF0", ...s() }, g);
    el("path", { d: "M-58 -30 Q0 -70 50 -30 L48 10 Q0 -20 -56 10 Z", fill: "#3E9BD6", ...s(5) }, g); }
  if (kind === "book") { el("rect", { x: -80, y: -100, width: 160, height: 200, rx: 12, fill: "#7CC36A", ...s() }, g); el("rect", { x: -80, y: -100, width: 26, height: 200, rx: 8, fill: "#5BA34D", ...s(5) }, g);
    el("circle", { cx: 14, cy: -10, r: 46, fill: "#FFFFFF", ...s(5) }, g);
    [-30, -12, 6, 24].forEach(y => el("path", { d: `M-24 ${y} Q14 ${y - 14} 52 ${y}`, fill: "none", stroke: INK, "stroke-width": 8 }, g));
    el("rect", { x: -40, y: 54, width: 108, height: 22, rx: 6, fill: "#FFD25E", ...s(4) }, g); }
  if (kind === "soap") { el("rect", { x: -80, y: -45, width: 160, height: 90, rx: 28, fill: "#FFFFFF", ...s() }, g); el("rect", { x: -50, y: -20, width: 100, height: 40, rx: 16, fill: "#DDF3EE", stroke: "none" }, g);
    [[-90, -70, 22], [-50, -95, 14], [70, -80, 26], [100, -40, 14], [10, -95, 18]].forEach(([x, y, r]) => el("circle", { cx: x, cy: y, r, fill: "#E8F7FF", ...s(4) }, g)); }
  if (kind === "print") { el("rect", { x: -70, y: -95, width: 140, height: 190, rx: 6, fill: "#FFFFFF", ...s() }, g);
    [-55, -25, 5, 35, 65].forEach((y, i) => el("path", { d: `M-45 ${y} H${i === 0 ? 10 : 45}`, stroke: "#9DB2E8", "stroke-width": 8, "stroke-linecap": "round" }, g));
    el("circle", { cx: 40, cy: -55, r: 14, fill: "#FF6F91", ...s(3) }, g); }
  if (kind === "swing") { el("path", { d: "M-90 90 L-60 -90 L60 -90 L90 90", fill: "none", ...s(10) }, g); el("path", { d: "M-70 -90 H70", ...s(12) }, g);
    const seat = el("g", {}, g); el("path", { d: "M-25 -90 V40 M25 -90 V40", ...s(5) }, seat); el("rect", { x: -40, y: 36, width: 80, height: 16, rx: 6, fill: "#E8735A", ...s(4) }, seat);
    let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; seat.setAttribute("transform", `rotate(${(Math.sin(t * 2.4) * 22 * motion).toFixed(1)} 0 -90)`); }); }
}
async function showWord(s, sayIt = true) {
  if (!s.item) return;
  const g = el("g", {}, hudLayer);
  el("circle", { r: 150, fill: "#FFFFFF", stroke: INK, "stroke-width": 8 }, g);
  const pic = el("g", { transform: "translate(0 -12) scale(1.05)" }, g); drawItem(pic, s.item);
  const lw = s.word.length * 54 + 70; el("rect", { x: -lw / 2, y: 120, width: lw, height: 84, rx: 42, fill: "#FFD25E", stroke: INK, "stroke-width": 6 }, g);
  el("text", { y: 180, "text-anchor": "middle", "font-family": FONT, "font-size": 52, fill: INK }, g).textContent = s.word;
  await tween(420, k => g.setAttribute("transform", `translate(800 360) scale(${(.2 + .8 * easeBack(k)).toFixed(3)})`));
  chime(); for (let i = 0; i < 8; i++) mark("sparkle", 800, 360, { vx: Math.cos(i * .8) * 360, vy: Math.sin(i * .8) * 360, life: .8, s: .7 });
  if (sayIt) await speak(C.pony, "sw_" + s.id, s.word); else await sleep(900);
  await sleep(700);
  await tween(250, k => g.setAttribute("opacity", (1 - k).toFixed(2))); g.remove();
}

/* 一定の速さで歩く。dist は右がプラス */
function walk(c, dist, ms) { const x0 = c.dx.v; hold(c, "run", ms / 1000); return tween(ms, k => { c.dx.v = c.dx.t = x0 + dist * k; }); }
/* 階段をのぼる（右へ進むほど上へ）。dist がマイナスなら左へ下りる */
function climb(c, dist, ms) { const x0 = c.dx.v, y0 = c.y; hold(c, "run", ms / 1000); return tween(ms, k => { c.dx.v = c.dx.t = x0 + dist * k; c.y = y0 - dist * k * .72; }); }
/* ---------- できごとのアニメ ---------- */
// 画面の外から歩いて入ってくる（いまの位置から 0 へ。すでに舞台にいるときは何もしない）
function enter(c) { if (Math.abs(c.dx.v) < 5) return; c.dx.t = 0; hold(c, "run", .9); }
const INTRO = {
  async fall(h, a) {
    enter(h, -720); h.lean.t = -10; await sleep(850); h.lean.t = 0;
    thud(); flop(h); markAbove(h, "ex"); await sleep(700);
    playMove(h, "sad"); tears(h, 1.8); await sleep(1300);
    enter(a, 520); await sleep(800); surprise(a);
  },
  async forgot(h, a) {
    // ランドセルの中をさがすが、うわばきが ない
    const bag = el("g", {}, propG); el("rect", { x: -55, y: -60, width: 110, height: 120, rx: 26, fill: "#E8735A", stroke: INK, "stroke-width": 6 }, bag);
    el("rect", { x: -55, y: -60, width: 110, height: 50, rx: 24, fill: "#C9563F", stroke: INK, "stroke-width": 6 }, bag);
    bag.setAttribute("transform", "translate(820 900)");
    enter(h, -600); await sleep(1000);
    playMove(h, "crouch"); await sleep(900); playMove(h, "look"); markAbove(h, "q"); await sleep(1300);
    playMove(h, "sad"); await sleep(1000);
    enter(a, 520); await sleep(900);
  },
  async search(h, a) {
    enter(h, -600); await sleep(1000);
    playMove(h, "look"); await sleep(1500); playMove(h, "think"); markAbove(h, "q"); await sleep(1200);
    enter(a, 500); await sleep(900);
  },
  async bump(h, a) {
    enter(h, -500); await sleep(900);
    a.dx.t = -360; hold(a, "run", 1.4); a.lean.t = -14; await sleep(900);
    thud(); boom(.5); flop(h); flop(a); markAbove(h, "ex"); markAbove(a, "ex");
    for (let i = 0; i < 6; i++) mark("sparkle", 900, 700, { vx: Math.cos(i) * 300, vy: -200 - i * 40, life: .8, s: .6 });
    await sleep(900); a.dx.t = 0; a.lean.t = 0; await sleep(500); playMove(h, "sad"); await sleep(600);
  },
  async toilet(h, a) {
    const d = el("g", {}, propG);
    el("rect", { x: 330, y: 430, width: 150, height: 330, rx: 10, fill: "#7FCBF0", stroke: INK, "stroke-width": 6 }, d);
    el("circle", { cx: 455, cy: 600, r: 9, fill: INK }, d);
    el("rect", { x: 360, y: 455, width: 90, height: 50, rx: 10, fill: "#FFFFFF", stroke: INK, "stroke-width": 5 }, d);
    el("text", { x: 405, y: 492, "text-anchor": "middle", "font-family": FONT, "font-size": 30, fill: INK }, d).textContent = "WC";
    h.dx.v = -200; h.dx.t = 0; await sleep(700); joy(h); await sleep(900); // ドアから出てくる
    h.dx.t = -230; hold(h, "run", 1.2); await sleep(700);
    enter(a, 500); await sleep(500); playMove(a, "point"); markAbove(a, "anger"); await sleep(600);
    h.dx.t = 0; surprise(h); await sleep(700);
  },
  async heavy(h, a) {
    // ちゅうが 箱を 2つ かさねて はこんでいる（「はんぶん もつ」と 1つ わたせるように）
    const mkBox = (fill) => { const box = el("g", {}, propG);
      el("rect", { x: -70, y: -50, width: 140, height: 100, rx: 8, fill, stroke: INK, "stroke-width": 6 }, box);
      el("path", { d: "M-70 -8 H70", stroke: "#F2D9A8", "stroke-width": 14 }, box); return box; };
    const boxes = [{ g: mkBox("#C98A4B"), c: a, n: 0 }, { g: mkBox("#D9A066"), c: a, n: 1 }];
    window.__boxes = boxes;
    boxes.forEach((b, i) => { let bx = null, by = null;
      follow(b.g, () => { const c = b.c, p = headTop(c), tx = p.x, ty = p.y - 70 - b.n * 96;
        if (bx === null) { bx = tx; by = ty; } bx += (tx - bx) * .12; by += (ty - by) * .12; return [bx, by, Math.sin(performance.now() / 160 + i) * (3 + i * 3)]; }); });
    enter(a, 500); await sleep(900); hold(a, "shiver", 3); a.squash.t = .8;
    for (let i = 0; i < 6; i++) later(i * 380, () => markAbove(a, "drop", { dx: i % 2 ? 60 : -60, vy: 60 }));
    enter(h, -600); await sleep(1100); playMove(h, "look"); markAbove(h, "ex"); await sleep(900);
  },
  async door(h, a) {
    // ろうかから見た「しょくいんしつのドア」。かめじいはドアの向こう（見えない）から声だけ聞こえる
    const d = el("g", {}, propG);
    el("rect", { x: 760, y: 140, width: 340, height: 620, fill: "#E6D3B0", stroke: INK, "stroke-width": 6 }, d);
    const plate = el("g", {}, d); el("rect", { x: 800, y: 180, width: 260, height: 70, rx: 12, fill: "#FFFFFF", stroke: INK, "stroke-width": 6 }, plate);
    el("text", { x: 930, y: 230, "text-anchor": "middle", "font-family": FONT, "font-size": 36, fill: INK }, plate).textContent = "しょくいんしつ";
    el("rect", { x: 820, y: 290, width: 220, height: 470, fill: "#5E4A3A", stroke: INK, "stroke-width": 6 }, d); // ドアの奥（へやの中）
    const leaf = el("g", {}, d);
    el("rect", { x: 820, y: 290, width: 220, height: 470, rx: 6, fill: "#B9824A", stroke: INK, "stroke-width": 6 }, leaf);
    el("rect", { x: 860, y: 330, width: 140, height: 120, rx: 6, fill: "#BDE3F2", stroke: INK, "stroke-width": 5 }, leaf);
    el("circle", { cx: 1015, cy: 540, r: 12, fill: "#FFD25E", stroke: INK, "stroke-width": 4 }, leaf);
    window.__door = leaf;
    const pr = el("g", {}, propG); drawItem(pr, "print"); follow(pr, () => { const p = world(h, 330, 300); return [p.x, p.y, -8, .45 * h.s / .88]; });
    enter(h); await sleep(1100); h.armR.t = -60; await sleep(300);
    knock(); markAbove(h, "note"); await sleep(800); h.armR.t = 0; await sleep(300);
  },
  async arrive(h, a) {
    enter(h, -700); await sleep(1100); wave(h); await sleep(600); wave(a);
  },
  async flashback(h, a) {
    enter(h, -600); enter(a, 500); await sleep(1000); playMove(a, "wave"); await sleep(400);
  },
  async push(h, a) {
    enter(h, -500); await sleep(1000);
    // がおが右から走ってきて、まるシマを押して左へ走り去る（一定の速さで）
    const g = C.gao; resetChar(g); place(g, 1300, 975, .9); g.root.style.display = ""; visible.push(g);
    hold(g, "run", 2.4); g.lean.t = -14;
    const run = tween(2000, k => { g.dx.v = g.dx.t = 500 - 2700 * k; });
    await sleep(1150); thud(); playMove(g, "point"); flop(h); markAbove(h, "ex"); h.dx.t = -60;
    await run; g.root.style.display = "none"; visible.splice(visible.indexOf(g), 1); g.dx.v = 0; g.dx.t = 0; g.lean.t = 0;
    playMove(h, "sad"); tears(h, 1.4); await sleep(900);
    enter(a, 520); await sleep(900); surprise(a);
  },
};
// 相手が話しかけたあとに出すもの（思い出の雲 など）
const AFTER_Q = {
  async flashback(h) {
    const c = el("g", {}, propG);
    [[360, 560, 16], [330, 610, 10]].forEach(([x, y, r]) => el("circle", { cx: x, cy: y, r, fill: "#FFFFFF", stroke: INK, "stroke-width": 5 }, c));
    const cl = el("g", {}, c);
    [[-150, 0, 90], [-60, -60, 100], [60, -55, 100], [150, 0, 90], [80, 60, 90], [-80, 60, 90]].forEach(([x, y, r]) => el("circle", { cx: x, cy: y, r, fill: "#FFF7E3", stroke: INK, "stroke-width": 6 }, cl));
    [[-150, 0, 84], [-60, -60, 94], [60, -55, 94], [150, 0, 84], [80, 60, 84], [-80, 60, 84], [0, 0, 110]].forEach(([x, y, r]) => el("circle", { cx: x, cy: y, r, fill: "#FFF7E3" }, cl));
    el("circle", { cx: 120, cy: -60, r: 26, fill: "#FFE27A", stroke: INK, "stroke-width": 4 }, cl);
    el("path", { d: "M-190 90 H190", stroke: "#7CC36A", "stroke-width": 14, "stroke-linecap": "round" }, cl);
    const sw = el("g", { transform: "translate(-20 10) scale(.75)" }, cl); drawItem(sw, "swing");
    const tag = el("g", { transform: "translate(-150 -120)" }, cl); el("rect", { x: -60, y: -30, width: 120, height: 56, rx: 28, fill: "#B9A8D9", stroke: INK, "stroke-width": 5 }, tag);
    el("text", { y: 12, "text-anchor": "middle", "font-family": FONT, "font-size": 34, fill: INK }, tag).textContent = "きのう";
    playMove(h, "think");
    await tween(500, k => cl.setAttribute("transform", `translate(330 420) scale(${(.2 + .8 * easeBack(k)).toFixed(3)})`));
    blip(500, 900, .3, "sine"); await sleep(400);
  },
};
const RESOLVE = {
  bandage(h) { const b = el("g", {}, propG); drawItem(b, "bandage"); follow(b, () => { const p = world(h, 238, 372); return [p.x, p.y, 0, .35 * h.s]; }); },
  slipper(h) { [-1, 1].forEach(sd => { const b = el("g", {}, propG); drawItem(b, "slipper"); follow(b, () => { const p = world(h, 200 + sd * 42, 408); return [p.x, p.y, 90, .3 * h.s]; }); }); },
  book(h, a) { a.lift.t = 120; later(1400, () => a.lift.t = 0); const b = el("g", {}, propG); drawItem(b, "book"); follow(b, () => { const p = world(h, 330, 300); return [p.x, p.y, -10, .45 * h.s]; }); },
  soap(h) { hold(h, "clap", 2.2); for (let i = 0; i < 10; i++) later(i * 180, () => { const p = world(h, 200, 300); mark("puff", p.x + (Math.random() - .5) * 160, p.y, { vy: -120, life: 1.2, s: .7 + Math.random() * .5 }); }); },
  print() { },
  swing() { },
};

/* ---------- 子どもの番の場面 ---------- */
async function playIntro(s, h, a) { await (INTRO[s.intro] || INTRO.arrive)(h, a); }
async function askQ(s, h, a) {
  await speak(a, "sq_" + s.id, s.q); unsay();
  if (AFTER_Q[s.intro]) await AFTER_Q[s.intro](h);
}
// けが・びょうき・こわい・あぶない場面：せいかいでも くるっと回らず、やさしく うなずく
const SOFT_INTRO = new Set(["fall", "push", "fever", "bee", "belly", "sandeye", "bump", "trip", "icedrop", "lostkid", "carsick", "dizzy", "scared", "ballroad", "slidebump", "applespill"]);
async function resolve(s, h, a, ok) {
  if (ok) { playMove(h, SOFT_INTRO.has(s.intro) ? "nod" : JOY[rnd(JOY.length)]); confetti(50); }
  if (PRE[s.id]) await PRE[s.id](h, a);
  await speak(a, "sr_" + s.id, s.res);
  if (POST[s.id]) await POST[s.id](h, a);
  else if (RESOLVE[s.item]) await RESOLVE[s.item](h, a); else if (ok) (a.kind === "kamejii" ? playMove(a, "nod") : SPECIAL[a.kind](a));
  await sleep(500); // 最後の「おぼえる物カード」は出さない（ややこしいので）
}
async function runSit(place, heroKind = "shima") {
  const s = pickSit(place, heroKind), ti = tierOf(), t = s.tiers[ti];
  const { hero: h, ask: a } = setSitView(s, heroKind);
  showEngine({ no: s.id, main: t.a }, `場面「${s.id}」こたえの段 ${ti + 1}/4`);
  await playIntro(s, h, a);
  await askQ(s, h, a);
  await speak(C.pony, s.help ? "p_help" : "p_ask", s.help ? "なんて いって あげる？" : "なんて こたえる？");
  showTask(t.a, s.help ? "いって あげよう" : "こたえよう");
  let hh = E.h, ok = false, n = 0; const tries = [], L0 = E.L, t0 = performance.now();
  for (; n < 3; n++) {
    if (hh < 3) await speak(C.pony, `sa_${s.id}_${ti}`, t.a);
    else { playMove(h, "think"); await sleep(700); }
    unsay();
    setListen(h, true); const r = await listen(t.keys, 8000); setListen(h, false);
    tries.push(`${r.r === "ok" ? "○" : r.r === "part" ? "△" : "×"}${r.heard || ""}`);
    if (r.r === "ok") { ok = true; break; }
    if (r.r === "part") { playMove(h, "think"); await speak(C.pony, "p_close", "おしい！"); } else { playMove(h, "think"); await sleep(600); }
    if (n < 2) { hh = 1; await speak(C.pony, "p_again", "もう いっかい いってみよう"); }
  }
  playLog({ type: "scene", id: s.id, tier: ti + 1, L: L0, ok, answer: t.a, tries, sec: Math.round((performance.now() - t0) / 1000), ...(MODE === "multi" ? { who: NAMES[heroKind] } : {}) });
  const up = grade(ok && n === 0); GS.tasks++; if (ok) GS.ok++;
  if (!ok) { await speak(C.pony, "p_together", "いっしょに いおうね"); await speak(C.pony, `sa_${s.id}_${ti}`, t.a); playMove(h, "nod"); await sleep(600); }
  hideTask();
  await resolve(s, h, a, ok);
  if (ok) { joy(C.pony); await speak(C.pony, "p_great", "すごい！ いえたね！"); }
  if (up > 0) { tune([[N.C5, .5], [N.E5, .5], [N.G5, .5], [N.C6, 1.5]], 220); later(100, () => showBanner("レベル アップ！")); await speak(C.pony, "p_levelup", "レベル アップ！"); await sleep(900); }
  showEngine(null, ok ? (n === 0 ? "1回目で言えた" : `${n + 1}回目で言えた`) : "3回とも言えなかった");
  await sleep(600); setView("board");
  return ok;
}

/* ---------- がおの番の場面（ときどき言いまちがえる） ---------- */
async function gaoSit(before) {
  const s = pickSit(zoneOf(P.gao.node), RIVAL), ti = tierOf(), t = s.tiers[ti];
  const mistake = !!t.wrong && E.L >= 2 && Math.random() < .35;
  const { hero: h, ask: a } = setSitView(s, RIVAL);
  showEngine({ no: s.id, main: t.a }, `${NAMES[RIVAL]}の場面${mistake ? "（まちがえる回）" : ""}`);
  await playIntro(s, h, a);
  await askQ(s, h, a);
  playMove(h, "think"); await sleep(700);
  if (!mistake) {
    showTask(t.a, `${NAMES[RIVAL]}の こたえ`);
    await speak(h, `sg_${s.id}_${ti}`, t.a); unsay(); hideTask();
    playMove(C.shima, "clap");
    await resolve(s, h, a, true);
    await sleep(400); setView("board"); return;
  }
  await speak(h, `sx_${s.id}_${ti}`, t.wrong);
  surprise(C.shima); surprise(a); markAbove(C.pony, "q"); await sleep(500);
  showTask(t.a, `${NAMES[RIVAL]}に おしえよう`);
  await speak(C.pony, RIVAL === "gao" ? "teach" : `teach_${RIVAL}`, `${NAMES[RIVAL]}に おしえて あげよう`);
  playMove(h, "think"); await rivalSay(h, "huh");
  let ok = false; const ttries = [];
  for (let n = 0; n < 2 && !ok; n++) {
    await speak(C.pony, `sa_${s.id}_${ti}`, t.a); unsay();
    setListen(C.shima, true); const r = await listen(t.keys, 8000); setListen(C.shima, false);
    ttries.push(`${r.r === "ok" ? "○" : r.r === "part" ? "△" : "×"}${r.heard || ""}`);
    ok = r.r === "ok"; if (ok) GS.ok++; if (!ok && n === 0) await speak(C.pony, "p_again", "もう いっかい いってみよう");
  }
  playLog({ type: "teach", id: s.id, ok, tries: ttries });
  if (ok) { joy(C.shima); confetti(50); chime(); markAbove(h, "ex"); await rivalSay(h, "thanks"); }
  else { await speak(C.pony, "p_together", "いっしょに いおうね"); await speak(C.pony, `sa_${s.id}_${ti}`, t.a); }
  await speak(h, `sg_${s.id}_${ti}`, t.a); unsay(); hideTask();
  await resolve(s, h, a, true);
  await sleep(400); setView("board");
  if (ok) {
    markAbove(P.gao, "drop"); P.gao.node = before; const [x, y] = nodeXY(P.gao, before); await slide(P.gao, x, y, .5, .3);
  }
}

/* ================= 追加の20場面のアニメ ================= */
const S6p = (sw = 6) => ({ stroke: INK, "stroke-width": sw, "stroke-linejoin": "round", "stroke-linecap": "round" });
const ITEM2 = {
  umbrella(g) { el("path", { d: "M-110 0 Q-110 -100 0 -100 Q110 -100 110 0 Q90 -20 73 0 Q55 -20 37 0 Q18 -20 0 0 Q-18 -20 -37 0 Q-55 -20 -73 0 Q-90 -20 -110 0 Z", fill: "#FF6F91", ...S6p() }, g);
    el("path", { d: "M0 -100 V90 Q0 110 -20 105", fill: "none", ...S6p(7) }, g); },
  rag(g) { el("rect", { x: -80, y: -55, width: 160, height: 110, rx: 10, fill: "#F2F2F2", ...S6p() }, g); [-30, 0, 30].forEach(y => el("path", { d: `M-70 ${y} H70`, stroke: "#9DB2E8", "stroke-width": 5, "stroke-dasharray": "10 8" }, g)); },
  hankachi(g) { el("rect", { x: -70, y: -70, width: 140, height: 140, rx: 12, fill: "#FFC2D1", ...S6p() }, g); el("rect", { x: -50, y: -50, width: 100, height: 100, rx: 8, fill: "none", stroke: "#FF6F91", "stroke-width": 5, "stroke-dasharray": "8 6" }, g); el("circle", { r: 16, fill: "#FFD25E", ...S6p(4) }, g); },
  paper(g) { el("rect", { x: -60, y: -70, width: 120, height: 140, rx: 20, fill: "#FFFFFF", ...S6p() }, g); el("ellipse", { cx: 0, cy: -70, rx: 60, ry: 20, fill: "#FFFFFF", ...S6p() }, g); el("ellipse", { cx: 0, cy: -70, rx: 18, ry: 7, fill: "#C9A27A", ...S6p(3) }, g); },
  towel(g) { el("rect", { x: -60, y: -90, width: 120, height: 180, rx: 14, fill: "#7FCBF0", ...S6p() }, g); el("path", { d: "M-60 50 H60 M-60 64 H60", stroke: "#FFFFFF", "stroke-width": 6 }, g); },
  thermo(g) { el("rect", { x: -18, y: -100, width: 36, height: 170, rx: 18, fill: "#FFFFFF", ...S6p() }, g); el("circle", { cx: 0, cy: 82, r: 26, fill: "#FF6F91", ...S6p() }, g); el("rect", { x: -7, y: -40, width: 14, height: 110, rx: 7, fill: "#FF6F91" }, g); },
  ice(g) { el("path", { d: "M-40 30 Q-60 30 -60 0 Q-70 -50 -20 -55 Q0 -90 40 -60 Q80 -50 70 -10 Q80 30 40 30 Z", fill: "#7FCBF0", ...S6p() }, g); [[-45, -20], [-10, -25], [25, -20], [-25, 5], [15, 5]].forEach(([x, y]) => el("rect", { x, y, width: 26, height: 22, rx: 5, fill: "#E8F7FF", ...S6p(3) }, g)); },
  bed(g) { el("rect", { x: -110, y: -20, width: 220, height: 60, rx: 10, fill: "#FFFFFF", ...S6p() }, g); el("rect", { x: -110, y: 40, width: 220, height: 40, fill: "#7FCBF0", ...S6p() }, g); el("rect", { x: -100, y: -45, width: 70, height: 40, rx: 16, fill: "#FFFFFF", ...S6p(5) }, g); el("path", { d: "M-110 80 V100 M110 80 V100", ...S6p(8) }, g); },
  pencil(g) { el("g", { transform: "rotate(-30)" }, g).innerHTML = `<rect x="-90" y="-16" width="150" height="32" fill="#FFD25E" stroke="${INK}" stroke-width="6"/><path d="M60 -16 L100 0 L60 16 Z" fill="#F2D9A8" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M88 -5 L100 0 L88 5 Z" fill="${INK}"/><rect x="-110" y="-16" width="22" height="32" rx="6" fill="#FF8FA3" stroke="${INK}" stroke-width="6"/>`; },
  vase(g) { el("path", { d: "M-30 -90 H30 Q20 -60 45 -20 Q70 40 30 80 H-30 Q-70 40 -45 -20 Q-20 -60 -30 -90 Z", fill: "#7FCBF0", ...S6p() }, g); el("path", { d: "M-40 10 Q0 30 40 10", fill: "none", stroke: "#FFFFFF", "stroke-width": 8 }, g);
    [[-10, -100], [10, -110], [0, -120]].forEach(([x, y], i) => el("circle", { cx: x, cy: y, r: 12, fill: ["#FF6F91", "#FFD25E", "#B9A8D9"][i], ...S6p(4) }, g)); },
  ehon(g) { el("rect", { x: -90, y: -80, width: 180, height: 160, rx: 10, fill: "#FFD25E", ...S6p() }, g); el("circle", { cx: 0, cy: -10, r: 40, fill: "#FF8FA3", ...S6p(5) }, g); el("path", { d: "M-60 50 H60", stroke: INK, "stroke-width": 8, "stroke-linecap": "round" }, g); },
};
const drawItemBase = drawItem;
drawItem = function (g, kind) { if (ITEM2[kind]) ITEM2[kind](g); else drawItemBase(g, kind); };
function prop(kind, x, y, k = 1, r = 0) { const g = el("g", { transform: `translate(${x} ${y}) rotate(${r}) scale(${k})` }, propG); drawItem(g, kind); return g; }
function hand(h, g, k = .4, r = -10) { follow(g, () => { const p = world(h, 330, 300); return [p.x, p.y, r, k * Math.max(h.s, .62) / .88]; }); } // ちいさい ちゅうでも 見える 大きさに
function rainOn() {
  const g = el("g", {}, propG), drops = [];
  addTick(dt => { if (!g.isConnected) return false;
    for (let i = 0; i < 3; i++) drops.push({ e: el("path", { d: "M0 0 L-6 26", stroke: "#7FCBF0", "stroke-width": 5, "stroke-linecap": "round" }, g), x: Math.random() * 1700, y: -30 });
    for (let i = drops.length - 1; i >= 0; i--) { const d = drops[i]; d.y += 1100 * dt; d.x -= 200 * dt; d.e.setAttribute("transform", `translate(${d.x.toFixed(0)} ${d.y.toFixed(0)})`); if (d.y > 980) { d.e.remove(); drops.splice(i, 1); } } });
  return g;
}
const buzz = () => { if (!ctx) return; for (let i = 0; i < 8; i++) later(i * 120, () => blip(220 + (i % 2) * 30, 200, .1, "sawtooth")); };
Object.assign(INTRO, {
  async rain(h, a) { enter(h); await sleep(900); rainOn(); noise(.6, 3000, .15); await sleep(600);
    hold(h, "shiver", 2); markAbove(h, "drop"); await sleep(900); playMove(h, "sneeze"); await sleep(1200);
    const u = prop("umbrella", 0, 0, 1), um = window.__umb = { u, share: false }; el("path", { d: "M0 -100 V-120 M0 0 V150 Q0 175 -22 175", fill: "none", stroke: INK, "stroke-width": 9, "stroke-linecap": "round" }, u); // ぴょんは かさを さして やってくる
    follow(u, () => { const p = headTop(a); if (!um.share) return [p.x + 40, p.y - 20, 0, 1.2];
      const q = headTop(h); return [(p.x + q.x) / 2, Math.min(p.y, q.y) - 40, 0, 1.5]; });
    enter(a); await sleep(900); },
  async wobble(h, a) { enter(h); h.dx.v = -700; h.dx.t = 0; for (let i = 0; i < 8; i++) later(i * 160, () => h.lean.t = i % 2 ? 16 : -16);
    await sleep(1400); h.lean.t = 0; thud(); flop(h); markAbove(h, "q"); await sleep(1200); enter(a); await sleep(900); },
  async bye(h, a) { enter(h); await sleep(900); wave(h); for (let i = 0; i < 4; i++) later(i * 300, () => { thud(); }); enter(a); await sleep(1300); },
  async bigshoe(h, a) { const s = prop("slipper", 0, 0, 1); window.__bigshoe = s; s.querySelectorAll("path").forEach(e => e.setAttribute("fill", "#B9824A"));
    follow(s, () => { const p = world(h, 200, 395); return [p.x + 30, p.y, 90, 1.1 * h.s]; });
    enter(h); h.lean.t = 10; await sleep(1100); h.lean.t = 0; hold(h, "shiver", .8); await sleep(500); thud(); flop(h); markAbove(h, "ex"); await sleep(1100);
    enter(a); for (let i = 0; i < 3; i++) later(i * 300, thud); await sleep(1000); surprise(a); },
  async mud(h, a) { enter(h); hold(h, "run", 1.4); for (let i = 0; i < 10; i++) later(i * 130, () => { const p = world(h, 200 + (i % 2 ? 30 : -30), 410); el("ellipse", { cx: p.x, cy: p.y, rx: 22, ry: 10, fill: "#8B5A2B", opacity: .8, class: "print" }, propG); });
    await sleep(1600); enter(a); await sleep(900); surprise(a); markAbove(a, "ex"); await sleep(500); },
  async stuck(h, a) { const lk = el("g", {}, propG); el("rect", { x: 980, y: 560, width: 120, height: 140, rx: 8, fill: "#FFFFFF", stroke: INK, "stroke-width": 6 }, lk); el("circle", { cx: 1080, cy: 630, r: 8, fill: INK }, lk); window.__locker = lk;
    a.lean.t = 18; a.armL.t = 80; a.armR.t = 80; hold(a, "shiver", 3); for (let i = 0; i < 5; i++) later(i * 400, () => markAbove(a, "drop", { dx: 60, vy: 60 }));
    enter(h); await sleep(1500); playMove(h, "look"); await sleep(600); },
  async drop(h, a) {
    // ちゅうが左から右へ歩いていき、とちゅうでハンカチを落とす（本人は気づかない）
    a.dx.v = a.dx.t = -1500; hold(a, "run", 2.6);
    let dropped = false, hk = null;
    await tween(2600, k => { a.dx.v = a.dx.t = -1500 + 1500 * k;
      if (!dropped && k > .4) { dropped = true; const p = world(a, 200, 300); const x = p.x; hk = prop("hankachi", x, p.y, .5);
        tween(400, q => hk.setAttribute("transform", `translate(${x} ${(p.y + (930 - p.y) * q).toFixed(0)}) rotate(${(q * 40).toFixed(0)}) scale(.5)`)); blip(900, 500, .15); } });
    enter(h); await sleep(1000);
    playMove(h, "crouch"); await sleep(500); if (hk) hk.remove(); window.__hk = prop("hankachi", 0, 0, .35); hand(h, window.__hk, .35, 0); await sleep(600); markAbove(h, "ex"); },
  async scared(h, a) { hold(a, "shiver", 4); a.eyeScale.t = 1.3; tears(a, 1.5); enter(h); await sleep(1200); playMove(h, "look"); await sleep(700); },
  async slow(h, a) { a.dx.v = a.dx.t = -320; hold(a, "tiptoe", 4); { const y0 = a.y; tween(3200, k => { a.dx.t = a.dx.v = -320 + 70 * k; a.y = y0 - 70 * k * .72; }); }
    enter(h); h.dx.t = -90; await sleep(1500); hold(h, "tiptoe", 1.4); markAbove(h, "drop"); await sleep(1500); playMove(h, "look"); await sleep(400); },
  async jumpdown(h, a) { a.y -= 230; enter(h); await sleep(900); a.squash.t = .8; a.lean.t = -10; markAbove(a, "note"); await sleep(600); jump(a, .5); await sleep(700); surprise(h); markAbove(h, "ex"); await sleep(400); },
  async nopaper(h, a) { const g = el("g", {}, propG); el("path", { d: "M400 560 H470 V600", fill: "none", ...S6p(6) }, g); el("rect", { x: 418, y: 590, width: 36, height: 44, rx: 6, fill: "#C9A27A", ...S6p(4) }, g);
    enter(h); await sleep(1000); playMove(h, "look"); await sleep(900); surprise(h); markAbove(h, "ex"); for (let i = 0; i < 4; i++) later(i * 300, () => markAbove(h, "drop", { dx: i % 2 ? 70 : -70, vy: 50 }));
    await sleep(1300); enter(a); await sleep(900); },
  async splash(h, a) { const f = el("g", {}, propG); el("path", { d: "M720 520 V480 H790 V500", fill: "none", ...S6p(10) }, f);
    enter(h); await sleep(1000); hold(h, "clap", 2.4); enter(a); later(500, () => { for (let i = 0; i < 14; i++) later(i * 80, () => mark("drop", 790, 520, { vx: 500 + Math.random() * 300, vy: -300 - Math.random() * 200, grav: 900, life: 1, s: .6 })); noise(.8, 2500, .25); });
    await sleep(1500); surprise(a); jump(a, .7); markAbove(a, "anger"); await sleep(600); },
  async fever(h, a) { enter(h); h.dx.v = -700; await sleep(1300); hold(h, "shiver", 3); for (let i = 0; i < 8; i++) later(i * 300, () => markAbove(h, "puff", { vy: -80, life: 1.2 }));
    h.headRot.t = 8; await sleep(1500); enter(a); await sleep(900); surprise(a); },
  async bee(h, a) { const b = el("g", {}, propG); el("ellipse", { rx: 22, ry: 16, fill: "#FFD25E", ...S6p(4) }, b); el("path", { d: "M-6 -14 V14 M6 -14 V14", stroke: INK, "stroke-width": 5 }, b); el("ellipse", { cx: -4, cy: -24, rx: 12, ry: 9, fill: "#FFFFFF", ...S6p(3) }, b);
    let t0 = 0; follow(b, () => { t0 += .05; const p = world(h, 200, 150); return [p.x + Math.cos(t0 * 3) * 140, p.y + Math.sin(t0 * 5) * 60, 0, 1]; });
    enter(h); hold(h, "run", 2.5); buzz(); later(1000, buzz); for (let i = 0; i < 5; i++) later(400 + i * 350, () => { h.dx.t = i % 2 ? 80 : -80; });
    await sleep(2200); h.dx.t = 0; thud(); flop(h); markAbove(h, "ex"); await sleep(400); tween(800, k => b.setAttribute("opacity", 1 - k)).then(() => b.remove());
    playMove(h, "sad"); tears(h, 1.4); await sleep(1000); enter(a); await sleep(900); surprise(a); },
  async belly(h, a) { const bl = el("g", {}, propG); el("ellipse", { rx: 90, ry: 80, fill: "#FFFFFF", ...S6p() }, bl); [-40, 0, 40].forEach(y => el("path", { d: `M-80 ${y} Q0 ${y - 20} 80 ${y}`, fill: "none", stroke: INK, "stroke-width": 9 }, bl));
    let k = .3; follow(bl, () => { const p = world(h, 200, 340); return [p.x, p.y, 0, k * h.s]; });
    enter(h); await sleep(1000); tween(1400, q => k = .3 + .7 * q); blip(200, 120, .3, "sawtooth"); await sleep(1500);
    noise(.2, 250, .7); markAbove(h, "puff"); playMove(h, "sad"); await sleep(1100); enter(a); await sleep(900); },
  async pencase(h, a) { const pc = el("g", {}, propG); el("rect", { x: -60, y: -25, width: 120, height: 50, rx: 12, fill: "#7CC36A", ...S6p(5) }, pc); hand(h, pc, .9, 0);
    enter(h); await sleep(1000); hold(h, "shake", 1.2); for (let i = 0; i < 4; i++) later(i * 150, () => noise(.05, 1500, .3)); await sleep(1300);
    const p = world(h, 330, 280); mark("note", p.x, p.y, { vx: 200, vy: -250, life: 1.2 }); surprise(h); await sleep(900); playMove(h, "sad"); await sleep(700); enter(a); await sleep(900); },
  async crash(h, a) { const v = prop("vase", 1000, 470, .5);
    const ball = el("circle", { r: 26, fill: "#FF9E5E", ...S6p(5) }, propG);
    enter(h); await sleep(1000);
    await tween(900, k => { const x = 680 + 320 * k, y = 760 - Math.abs(Math.sin(k * Math.PI * 2.5)) * 260 - k * 200; ball.setAttribute("transform", `translate(${x} ${y})`); });
    noise(.4, 2500, .8); noise(.3, 800, .6); boom(.4); v.remove(); ball.remove();
    for (let i = 0; i < 7; i++) { const sh = el("path", { d: "M0 0 L22 6 L8 24 Z", fill: "#7FCBF0", ...S6p(3) }, propG); const vx = (Math.random() - .5) * 300; tween(700, k => sh.setAttribute("transform", `translate(${(1000 + vx * k).toFixed(0)} ${(470 + 260 * k * k).toFixed(0)}) rotate(${(k * 300).toFixed(0)})`)); }
    surprise(h); await sleep(800); playMove(h, "scared"); await sleep(900); enter(a); await sleep(900); },
  async loud(h, a) { hand(a, prop("ehon", 0, 0, .4), .4, -8); enter(h); await sleep(800);
    for (let i = 0; i < 3; i++) later(i * 500, () => { jump(a, .5); markAbove(a, "ex"); blip(400, 700, .15, "square"); }); await sleep(1700); surprise(h); playMove(h, "shy"); await sleep(400); },
  async borrow(h, a) { hand(h, prop("ehon", 0, 0, .4), .4, -8); enter(h); await sleep(1200); wave(a); await sleep(500); },
  async reach(h, a) { const bk = el("g", {}, propG); el("rect", { x: -18, y: -50, width: 36, height: 100, rx: 4, fill: "#FF8FA3", ...S6p(5) }, bk); bk.setAttribute("transform", "translate(880 230)"); window.__topbook = bk;
    enter(h); await sleep(1000); h.armR.t = -150; for (let i = 0; i < 3; i++) later(i * 600, () => jump(h, .6)); await sleep(1900); h.armR.t = 0; playMove(h, "sad"); await sleep(600); enter(a); await sleep(900); },
});
const PRE = {
  async shitsurei(h, a) { // ドアが開いて、かめじいが顔を出す
    if (window.__door) await tween(500, k => window.__door.setAttribute("transform", `translate(820 0) scale(${(1 - .85 * k).toFixed(3)} 1) translate(-820 0)`));
    a.root.style.display = ""; visible.push(a); wave(a); await sleep(500); },
  async otoshimono(h, a) { jump(a, 1.2); surprise(a); blip(900, 1800, .15, "square"); await sleep(700);
    await walk(h, 330, 900); // ちゅうのところまで行って、ハンカチをわたす
    if (window.__hk) { window.__hk.remove(); const g = prop("hankachi", 0, 0, .3); follow(g, () => { const p = world(a, 330, 300); return [p.x, p.y, 0, .3]; }); } joy(a); await sleep(400); },
};
const POST = {
  async shitsurei(h, a) { playMove(h, "bow"); await sleep(1300); // おじぎをして、ドアから中へ入る
    const go = walk(h, 330, 1300); const f = front(); await go; tween(400, k => { h.root.style.opacity = (1 - k).toFixed(2); f.style.opacity = (1 - k).toFixed(2); }); await sleep(450); h.root.style.display = "none"; h.root.style.opacity = ""; },
  async butsukaru(h, a) { playMove(a, "bow"); await sleep(1300); a.lean.t = 0; await walk(a, 700, 2200); /* あやまって、ろうかを歩いて行く */ },
  async tearai(h, a) { await walk(h, 300, 1000); RESOLVE.soap(h); await sleep(2000); /* 手洗い場へ行って洗う */ },
  async tetsudau(h, a) { // 上の 箱を 1つ うけとって、1つずつ もって いっしょに のぼる
    await walk(h, 330, 900);
    const bs = window.__boxes; if (bs) { bs[1].c = h; bs[1].n = 0; } a.squash.t = 1; joy(a); await sleep(900);
    climb(h, 650, 2600); await climb(a, 650, 2600); },
  async ohayou(h, a) { playMove(a, "nod"); wave(h); await sleep(700); await walk(h, 1300, 1800); /* 校舎へ入っていく */ },
  async doro(h, a) { walk(a, -200, 700); playMove(h, "crouch"); hand(h, prop("rag", 0, 0, .3), .3, 0); await sleep(700);
    playMove(a, "crouch"); hand(a, prop("rag", 0, 0, .3), .3, 0); // みいも いっしょに ふく
    propG.querySelectorAll(".print").forEach(e => tween(1400, k => e.setAttribute("opacity", (.8 * (1 - k)).toFixed(2)))); hold(h, "shake", 1.4); hold(a, "shake", 1.4); await sleep(1500);
    joy(a); await sleep(300); },
  async mizu(h, a) { hand(a, prop("towel", 0, 0, .3), .3, 0); hold(a, "shake", 1.2); await sleep(1300); },
  async kabin(h, a) { playMove(a, "nod"); later(400, () => joy(h)); await sleep(1000); },
  async kasa(h, a) { // ぴょんが となりに来て、かさに いれて くれる
    const gap = (h.x + h.dx.v + h.s * 200) + 330 - (a.x + a.dx.v + a.s * 200); await walk(a, gap, 800);
    if (window.__umb) window.__umb.share = true; else { const u = prop("umbrella", 0, 0, 1); follow(u, () => { const p = world(h, 200, 0); return [p.x + 140, p.y - 40, 0, 1.4]; }); }
    a.happyOn = true; joy(a); await sleep(700); walk(h, 1300, 2200); await walk(a, 1300, 2200); /* いっしょに かさに入って帰る */ },
  async gyaku(h) { playMove(h, "crouch"); hold(h, "shake", 1); for (let i = 0; i < 2; i++) later(300 + i * 450, () => noise(.08, 1200, .3)); await sleep(1200); jump(h, .5); joy(h); await sleep(500); },
  async sayonara(h, a) { a.armR.t = -60; noise(1.2, 400, .9); hold(h, "spin", 1.2); h.dx.t = -1400; await sleep(1300); },
  async dekkai(h, a) { const s = window.__bigshoe; if (s) { const p = world(h, 200, 395); s.remove(); const g = prop("slipper", p.x, p.y, 1.1 * h.s, 90); g.querySelectorAll("path").forEach(e => e.setAttribute("fill", "#B9824A"));
      const q = world(a, 200, 560); await tween(800, k => g.setAttribute("transform", `translate(${(p.x + (q.x - p.x) * k).toFixed(0)} ${(p.y + (q.y - p.y) * k - Math.sin(k * Math.PI) * 150).toFixed(0)}) rotate(${90 + 360 * k}) scale(${(1.1 * h.s).toFixed(2)})`)); g.remove(); }
    SPECIAL.doshin(a); joy(h); await sleep(600); },
  async osareta(h, a) { playMove(a, "nod"); await sleep(500); playMove(h, "nod"); await sleep(600); },
  async locker(h, a) { // まるシマも そばへ行き、がおの うしろから いっしょに ひっぱる
    await walk(h, 420, 1000); h.lean.t = 18; h.armR.t = 80; h.armL.t = 80; hold(h, "shiver", 1.4); hold(a, "shiver", 1.4); await sleep(1400);
    boom(.5); noise(.2, 900, .6); h.lean.t = 0; h.armR.t = 0; h.armL.t = 0; a.lean.t = 0; a.armL.t = 0; a.armR.t = 0;
    flop(a); later(150, () => flop(h)); if (window.__locker) { const lk = window.__locker; tween(500, k => lk.setAttribute("transform", `translate(${(-140 * k).toFixed(0)} 0)`)); }
    return sleep(900); },
  async kowai(h, a) { const gap = (a.x + a.dx.v + a.s * 200) - (h.x + h.dx.v + h.s * 200) - 150; await walk(h, gap, 900); a.happyOn = true; joy(a); await sleep(500);
    h.armR.t = 70; a.armL.t = 70; const hd = el("circle", { r: 16, fill: "#FFFFFF", ...S6p(5) }, front()); // つないだ手
    follow(hd, () => { const p = world(h, 330, 330), q = world(a, 70, 330); return [(p.x + q.x) / 2, (p.y + q.y) / 2, 0, 1]; });
    await sleep(500); climb(h, 700, 2600); await climb(a, 700, 2600); /* てを つないで いっしょに のぼる */ },
  async osaki(h, a) { playMove(h, "bow"); await sleep(1200); await climb(h, 1100, 2400); /* 先に階段をのぼっていく */ },
  async tobioriru(h, a) { await climb(a, -320, 1600); a.y += 230 - 320 * .72; thud(); flop(a); markAbove(a, "drop"); await sleep(900); /* ゆっくり下りたのに、さいごで ころぶ */ },
  kaminai(h) { const r = prop("paper", 1250, 900, .35); tween(1200, k => r.setAttribute("transform", `translate(${(1250 - 520 * k).toFixed(0)} 900) rotate(${(-720 * k).toFixed(0)}) scale(.35)`)); blip(300, 500, 1, "triangle"); return sleep(1300); },
  netsu(h) { const th = prop("thermo", 0, 0, .3); follow(th, () => { const p = world(h, 120, 300); return [p.x, p.y, 40, .3 * h.s]; }); later(1300, () => { blip(2000, 2000, .08, "square"); later(150, () => blip(2000, 2000, .08, "square")); }); return sleep(1600); },
  hachi(h) { hand(h, prop("ice", 0, 0, .35), .35, 0); },
  async tabesugi(h, a) { await walk(h, 360, 1200); playMove(h, "sleep"); playMove(a, "nod"); await sleep(1200); /* ベッドへ行って休む */ },
  enpitsu(h) { hand(h, prop("pencil", 0, 0, .4), .4, 0); joy(h); },
  shizuka(h, a) { playMove(a, "shy"); },
  kariru(h, a) { a.lift.t = -40; later(400, () => { a.lift.t = 0; noise(.08, 600, .7); blip(300, 200, .1); }); hand(h, prop("ehon", 0, 0, .4), .4, -8); return sleep(900); },
  async takai(h, a) { a.lift.t = 280; blip(400, 1400, .5, "triangle"); await sleep(900); const bk = window.__topbook;
    if (bk) await tween(700, k => bk.setAttribute("transform", `translate(${(880 - 220 * k).toFixed(0)} ${(230 + 400 * k).toFixed(0)})`));
    a.lift.t = 0; if (bk) bk.remove(); joy(h); await sleep(600); },
};
