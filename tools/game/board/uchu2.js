/* ================= ロングコース「うちゅう たんけん」（uchu2、2026-11-05） =================
   ちょうロングの しくみ（slong.js）の うえに のせる。48マス・4エリア：① ロケット ② つき ③ うちゅう（ふねの そと） ④ うちゅうじんの ほし。
   盤は「きどう」の 形（slong.js の UC_PTS）：ちきゅうから とびたち、つきを ぐるっと まわり、いんせきの おびを ぬけて、うちゅうじんの ほしに おりる。
   みんな うちゅうふく（ucSuitOn：ヘルメット・むねの パネル・せなかの タンク）。うちゅうじん＝ピコ（こども）・ガボ（おとうさん）は rig/part_chars.js。
   💬 場面：ぽにーが ようすを はなす → あいてが いう → ぽにーの おてほんを まるシマに なって いう → あいての へんじ（段2〜は 2おうふくめ も）。
   しかけ：🕳 ブラックホール（うずに すいこまれて ふりだし）・☄ いんせきの あめ（1かいだけ。うちゅうに いる ひとは ステーションへ）・🌀 ワープゲート・🚀 ロケット
   ・🛸 ピコの ユーフォー（ビームで つりあげて 3マス もどる）・ふわふわ（むじゅうりょくで 2〜3マス ながれる）・🌠 ながれぼし（もう一回／サイコロ2こ）・🛰 ステーション（休み）。
   データと 声：sit/uchu2_gen.py → uchu2_data.js・sit/pony_uchu2.json・aivis/jobs/uc1（ピコ・ガボの 声は ぴょん・どしんの 声を かこう） */
const UC_N = new Map(); let UC_CUR = "", UC_METEOR = 0;
const UC_OPEN = new Set([24, 25, 26, 27, 29, 30, 31, 32, 34, 35]); // いんせきの おび（うちゅう）の マス。28・33 は ステーション
const UC_SAFE = [23, 28, 33, 36];
const UC_EARTH = [120, 960], UC_MOON = [1320, 600], UC_PLANET = [325, 585]; // 盤の ほしの ばしょ
{ const ap = applyStage; applyStage = function (id, ...a) { if (id === "uchu2") { UC_N.clear(); UC_METEOR = 0; } const r = ap(id, ...a); ucSuitAll(id === "uchu2"); return r; }; }
Object.assign(ASK_AT, { piko: [1190, .9], gabo: [1250, 1.32] }); Object.assign(KID_S, { piko: .9, gabo: 1.32 });
/* ---------- マスの ならび（48） ---------- */
{ const PL = [null, "us", "us", "e:again", "us", "e:dice2", "us", "us", "e:warp", "us", "e:flow2", "us",
    "us", "e:x2", "us", "us", "e:kb1", "us", "e:rest", "us", "us", null, "us", "e:flow3",
    "us", "e:ufo", "us", "e:home", "us", "e:bigwarp", "us", "e:dice2", "e:warp", "us", "e:again", "us",
    "us", "e:kf1", "us", "us", "e:flow2", "e:x2", "us", "us", "e:kb2", "us", "us", null];
  const O = SL_ORDER.uchu2, ev = {}, task = {};
  O.forEach((id, i) => { const p = PL[i]; if (!p || id === "0" || id === "4" || id === "15") return;
    if (p.startsWith("e:")) { const t = p.slice(2); ev[id] = [t, 0, `sl_uchu2_${t}`, UC.evt[t]]; } else task[id] = p; });
  EVENTS.uchu2 = ev; LONG_TASKS.uchu2 = task;
  LEGENDS.uchu2 = [["us", "おはなし"]]; }
Object.assign(LTASK, { us: ["#E6E9FF", "💬"] });
BOARD.uchu2.style = () => "orbit";
const UC_ICON = { flow2: "🫧", flow3: "🫧", warp: "🌀", bigwarp: "🚀", home: "🕳", again: "🌠", x2: "🌙", dice2: "🌠", rest: "🛰", ufo: "🛸", kb1: "🏜", kb2: "🌬", kf1: "🛸" };
const UC_EVC = { warp: "#D9C2F0", bigwarp: "#D9C2F0", home: "#3B3A55", ufo: "#FFC2D1", kb1: "#FFC2D1", kb2: "#FFC2D1", kf1: "#C9EBB5", flow2: "#BFE3F2", flow3: "#BFE3F2", rest: "#FFE9C7" };
const ucI = id => SL_ORDER.uchu2.indexOf(id);
/* ---------- 盤の みち：ひかる きどう ---------- */
ROAD.orbit = (L, d, a, b, pass) => { if (pass === "under") { pathEl(L, d, { stroke: "#5B6BC8", "stroke-width": 44, opacity: .35 }); pathEl(L, d, { stroke: "#2E3A6E", "stroke-width": 26 }); } else pathEl(L, d, { stroke: "#BFD7FF", "stroke-width": 5, "stroke-dasharray": "14 18", opacity: .9 }); };
{ const db = drawBoard; drawBoard = function () { db(); if (curStage !== "uchu2") return;
    Object.entries(EVENTS.uchu2).forEach(([id, [type]]) => { const [x, y] = NODES[id]; if (type === "home") { ucHoleArt(boardLayer, x, y, 44); return; }
      if (type === "warp") { ucGateArt(boardLayer, x, y, 40); return; }
      el("circle", { cx: x, cy: y, r: 36, fill: UC_EVC[type] || "#FFF1C9", ...S6(4) }, boardLayer); txt(boardLayer, x, y + 14, UC_ICON[type] || "★", 36, { "text-anchor": "middle" }); });
    UC_SAFE.forEach(i => { const id = SL_ORDER.uchu2[i]; if (!NODES[id] || EVENTS.uchu2[id]) return; const [x, y] = NODES[id]; ucStationMark(boardLayer, x, y); }); }; }
function ucStationMark(L, x, y) { const g = el("g", { transform: `translate(${x} ${y - 62})` }, L); el("rect", { x: -34, y: -14, width: 68, height: 28, rx: 8, fill: "#DCE3EA", ...S6(3) }, g); el("rect", { x: -70, y: -8, width: 30, height: 16, fill: "#3E7FD6", ...S6(2) }, g); el("rect", { x: 40, y: -8, width: 30, height: 16, fill: "#3E7FD6", ...S6(2) }, g); el("circle", { cy: 0, r: 5, fill: "#7BD389" }, g); txt(g, 0, 32, "ステーション", 12, { "text-anchor": "middle", fill: "#FFFFFF" }); }
function ucHoleArt(L, x, y, r) { // ブラックホール：くろい まるの まわりを ひかりの うずが まわる
  const g = el("g", {}, L), sp = el("g", {}, g);
  el("circle", { cx: x, cy: y, r: r + 30, fill: "#2A2550", opacity: .6 }, g);
  for (let k = 0; k < 3; k++) { const p = el("path", { d: "M0 0 m-6 0 a6 6 0 1 1 12 0 a14 14 0 1 1 -28 0 a24 24 0 1 1 48 0 a36 36 0 1 1 -72 0 a50 50 0 1 1 100 0", fill: "none", stroke: ["#B9A8FF", "#7FCBF0", "#FFD25E"][k], "stroke-width": 5, "stroke-linecap": "round", opacity: .85, transform: `rotate(${k * 120})` }, sp); }
  el("circle", { cx: x, cy: y, r: r - 6, fill: "#0B0A16", ...S6(5) }, g); el("ellipse", { cx: x, cy: y, rx: r + 10, ry: 8, fill: "none", stroke: "#FFD25E", "stroke-width": 3, opacity: .7 }, g);
  let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; sp.setAttribute("transform", `translate(${x} ${y}) rotate(${(-t * 90).toFixed(1)}) scale(1 .55)`); }); return g; }
function ucGateArt(L, x, y, r) { const g = el("g", {}, L); el("ellipse", { cx: x, cy: y, rx: r, ry: r * .9, fill: "#D9C2F0", ...S6(4) }, g);
  const ring = el("ellipse", { cx: x, cy: y, rx: r - 6, ry: r * .9 - 6, fill: "none", stroke: "#8E5BD6", "stroke-width": 6 }, g); el("ellipse", { cx: x, cy: y, rx: r - 18, ry: r * .9 - 18, fill: "#FFFFFF", opacity: .5 }, g);
  let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; ring.setAttribute("stroke-dasharray", `${20 + Math.sin(t * 4) * 8} 10`); ring.setAttribute("transform", `rotate(${(t * 120).toFixed(0)} ${x} ${y})`); }); return g; }
/* ---------- しかけ ---------- */
{ const be = boardEvent; boardEvent = async function (pc) {
    const ev = curStage === "uchu2" && EVENTS.uchu2[pc.node];
    if (!ev || (pc.player && pc.player.stay)) return be(pc);
    const t = ev[0];
    if (t === "flow2" || t === "flow3") { await sleep(300); markAbove(pc, "sparkle"); await slSay(ev[2], ev[3]); await ucFloat(pc, t === "flow2" ? 2 : 3); await sleep(300); return; }
    if (t === "ufo") { await sleep(300); markAbove(pc, "ex"); await slSay(ev[2], ev[3]); await ucUfo(pc, -3); await sleep(300); return; }
    if (t === "kf1") { await sleep(300); markAbove(pc, "heart"); chime(); await slSay(ev[2], ev[3]); await ucUfo(pc, 2, true); await sleep(300); return; }
    if (t === "kb1" || t === "kb2") { await sleep(300); markAbove(pc, "drop"); chime(); await slSay(ev[2], ev[3]); await slGo(pc, -2); await sleep(300); return; }
    if (t === "home") { await sleep(300); markAbove(pc, "ex"); await slSay(ev[2], ev[3]); await ucBlackHole(pc); await sleep(300); return; }
    if (t === "warp") { await sleep(300); markAbove(pc, "sparkle"); await slSay(ev[2], ev[3]); await ucWarp(pc, slWarpTo("uchu2", pc.node, "warp")); await sleep(300); return; }
    if (t === "bigwarp") { await sleep(300); markAbove(pc, "ex"); await slSay(ev[2], ev[3]); await ucRocket(pc, slWarpTo("uchu2", pc.node, "bigwarp")); await sleep(300); return; }
    return be(pc); }; }
// ふわふわ：むじゅうりょくで ゆっくり ながれる（まわりに ちいさな ほしの つぶ）
async function ucFloat(pc, d) {
  const O = SL_ORDER.uchu2; let i = slIdx(pc.node); const g = el("g", { "pointer-events": "none" }, boardLayer); let t = 0, alive = true; const bits = [];
  addTick(dt => { if (!alive) return false; t += dt; if (Math.random() < dt * 10) { const b = el("circle", { r: 3 + Math.random() * 3, fill: "#FFFFFF", opacity: .9 }, g); bits.push({ b, x: pc.px + (Math.random() - .5) * 60, y: pc.py + 10, vy: -30 - Math.random() * 40, life: 1 }); }
    for (let k = bits.length - 1; k >= 0; k--) { const q = bits[k]; q.life -= dt; q.y += q.vy * dt; q.b.setAttribute("cx", q.x.toFixed(0)); q.b.setAttribute("cy", q.y.toFixed(0)); q.b.setAttribute("opacity", Math.max(0, q.life).toFixed(2)); if (q.life <= 0) { q.b.remove(); bits.splice(k, 1); } } });
  if (ctx) blip(600, 900, .5, "sine");
  for (let k = 0; k < d; k++) { const j = i + 1; if (j >= O.length - 1) break; i = j; pc.node = O[i]; const [x, y] = nodeXY(pc, O[i]);
    const x0 = pc.px, y0 = pc.py; await tween(900, u => { const e = u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; pc.px = x0 + (x - x0) * e; pc.py = y0 + (y - y0) * e - Math.sin(u * Math.PI) * 40; pc.lean.t = Math.sin(u * Math.PI * 2) * 12; }); if (ctx) blip(700 + k * 100, 500, .12, "sine"); }
  pc.lean.t = 0; pc.trail = []; jump(pc, .3); await sleep(300); alive = false; g.remove(); }
// 🛸 ユーフォー：ビームで コマを つりあげて はこぶ（back＝もどる、ride＝ピコが のせて くれる）
function ucUfoArt(G, s = 1) { const g = el("g", {}, G), k = el("g", { transform: `scale(${s})` }, g);
  el("ellipse", { cx: 0, cy: 0, rx: 110, ry: 30, fill: "#B9A8D9", ...S6(5) }, k); el("path", { d: "M-60 -12 Q0 -90 60 -12 Z", fill: "#BDE3F2", ...S6(5), opacity: .9 }, k);
  el("ellipse", { cx: 0, cy: 6, rx: 110, ry: 18, fill: "#8E72C4", opacity: .5 }, k);
  const ls = [-70, -35, 0, 35, 70].map((x, i) => el("circle", { cx: x, cy: 14, r: 7, fill: ["#FFD25E", "#FF8FA3", "#7FCBF0"][i % 3], ...S6(2) }, k));
  el("circle", { cx: 0, cy: -34, r: 16, fill: "#8FE08A", ...S6(3) }, k); el("ellipse", { cx: -5, cy: -36, rx: 5, ry: 6, fill: "#1E2A3A" }, k); el("ellipse", { cx: 6, cy: -36, rx: 5, ry: 6, fill: "#1E2A3A" }, k); // ピコが のって いる
  let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; ls.forEach((l, i) => l.setAttribute("opacity", (Math.floor(t * 4 + i) % 2 ? 1 : .3))); }); g.k = k; return g; }
async function ucUfo(pc, d, ride = false) {
  const O = SL_ORDER.uchu2, i = slIdx(pc.node), j = Math.max(0, Math.min(O.length - 2, i + d)), to = O[j], [tx, ty] = nodeXY(pc, to);
  const x0 = pc.px, y0 = pc.py, g = el("g", { "pointer-events": "none" }, front()), u = ucUfoArt(g, .8); let ux = x0, uy = -150;
  const beam = el("path", { fill: "#FFE27A", opacity: 0 }, g); g.insertBefore(beam, u);
  const at = () => { u.setAttribute("transform", `translate(${ux.toFixed(0)} ${uy.toFixed(0)})`); beam.setAttribute("d", `M${ux - 30} ${uy + 20} L${ux - 90} ${pc.py + 30} L${ux + 90} ${pc.py + 30} L${ux + 30} ${uy + 20} Z`); };
  if (ctx) for (let k = 0; k < 6; k++) later(k * 150, () => blip(900 + k * 80, 1200 + k * 80, .1, "sine"));
  await tween(900, k => { uy = -150 + (y0 - 190 + 150) * k; at(); });
  if (ctx) blip(300, 1200, .6, "sine"); await tween(400, k => { beam.setAttribute("opacity", (k * .55).toFixed(2)); at(); });
  await tween(700, k => { pc.py = y0 - 120 * k; pc.lean.t = Math.sin(k * Math.PI * 4) * 10; at(); }); // つりあげる
  const cx = (x0 + tx) / 2, cy = Math.min(y0, ty) - 260;
  await tween(1500, k => { const v = 1 - k; ux = v * v * x0 + 2 * v * k * cx + k * k * tx; uy = v * v * (y0 - 190) + 2 * v * k * cy + k * k * (ty - 190); pc.px = ux; pc.py = uy + 70 + Math.sin(k * 20) * 4; at(); });
  pc.node = to; pc.trail = []; await tween(600, k => { pc.py = ty - 120 + 120 * k; at(); }); pc.py = ty; pc.lean.t = 0; jump(pc, .4); if (ride) chime(); else noise(.2, 600, .4);
  await tween(400, k => { beam.setAttribute("opacity", (.55 * (1 - k)).toFixed(2)); }); await tween(800, k => { uy = ty - 190 - 400 * k; ux = tx + 300 * k; at(); u.setAttribute("opacity", (1 - k).toFixed(2)); }); g.remove(); }
// 🕳 ブラックホール：うずに すいこまれて（ぐるぐる・ほそく のびて）きえ、ふりだしで ポンと でてくる
async function ucBlackHole(pc) {
  const [hx, hy] = NODES[pc.node], [tx, ty] = nodeXY(pc, "0"), x0 = pc.px, y0 = pc.py;
  const g = el("g", { "pointer-events": "none" }, front()); const dark = el("rect", { x: -1200, y: -400, width: 4000, height: 1800, fill: "#0B0A16", opacity: 0 }, g);
  if (ctx) { noise(1.5, 200, .3); blip(400, 60, 1.6, "sawtooth"); }
  const n0 = pc.root.style.transformOrigin; pc.spinDur = 1.8; pc.spinTurns = 3; hold(pc, "spin", 1.8);
  await tween(1700, k => { const e = k * k; pc.px = x0 + (hx - x0) * e; pc.py = y0 + (hy - 20 - y0) * e; pc.s = pc.s0 * (1 - .85 * e); pc.squash.v = 1 + 1.6 * e; dark.setAttribute("opacity", (k * .5).toFixed(2));
    if (k > .3 && Math.random() < .5) mark("sparkle", hx + (Math.random() - .5) * 80, hy + (Math.random() - .5) * 40, { vx: (hx - pc.px) * 2, vy: -40, life: .4, s: .4 }); });
  pc.root.setAttribute("opacity", 0); pc.squash.v = 1; flash(); boom(.6); await sleep(500);
  pc.node = "0"; pc.px = tx; pc.py = ty; pc.trail = []; pc.s = 0;
  const ring = el("circle", { cx: tx, cy: ty, r: 10, fill: "none", stroke: "#FFE27A", "stroke-width": 8 }, g);
  await tween(600, k => { dark.setAttribute("opacity", (.5 * (1 - k)).toFixed(2)); ring.setAttribute("r", (10 + 160 * k).toFixed(0)); ring.setAttribute("opacity", (1 - k).toFixed(2)); pc.root.setAttribute("opacity", Math.min(1, k * 2).toFixed(2)); pc.s = pc.s0 * Math.min(1, k * 1.6); });
  pc.s = pc.s0; pc.root.setAttribute("opacity", 1); jump(pc, .6); if (ctx) blip(300, 1200, .4, "sine"); g.remove(); }
// 🌀 ワープゲート：わを くぐって ひかりに なり、さきの わから でてくる
async function ucWarp(pc, to) {
  if (!to) return; const [tx, ty] = nodeXY(pc, to), [gx, gy] = NODES[to], x0 = pc.px, y0 = pc.py, g = el("g", { "pointer-events": "none" }, front());
  const gate = ucGateArt(g, gx, gy, 40); gate.setAttribute("opacity", 0);
  if (ctx) { blip(500, 1800, .5, "sine"); noise(.4, 2000, .25); }
  await tween(500, k => { pc.s = pc.s0 * (1 - k); pc.py = y0 - 20 * k; });
  const beam = el("path", { d: `M${x0} ${y0} Q${(x0 + gx) / 2} ${Math.min(y0, gy) - 200} ${gx} ${gy}`, fill: "none", stroke: "#FFFFFF", "stroke-width": 6, "stroke-dasharray": "20 16", opacity: .9 }, g);
  const dot = el("circle", { r: 14, fill: "#FFE27A", ...S6(3) }, g); const len = beam.getTotalLength();
  await tween(700, k => { const p = beam.getPointAtLength(len * k); dot.setAttribute("cx", p.x.toFixed(0)); dot.setAttribute("cy", p.y.toFixed(0)); gate.setAttribute("opacity", k.toFixed(2)); });
  dot.remove(); beam.remove(); pc.node = to; pc.px = tx; pc.py = ty; pc.trail = [];
  await tween(450, k => { pc.s = pc.s0 * k; }); pc.s = pc.s0; jump(pc, .5); chime(); for (let i = 0; i < 8; i++) mark("sparkle", tx, ty - 20, { vx: Math.cos(i * .8) * 300, vy: Math.sin(i * .8) * 300, life: .6, s: .5 });
  await tween(400, k => gate.setAttribute("opacity", (1 - k).toFixed(2))); g.remove(); }
// 🚀 ロケット：コマを のせて ほのおを ふきながら とぶ
function ucRocketArt(G, s = 1) { const g = el("g", {}, G), k = el("g", { transform: `scale(${s})` }, g);
  const fl = el("g", {}, k); const f1 = el("path", { d: "M-22 70 Q0 150 22 70 Z", fill: "#FF8A3D", ...S6(4) }, fl), f2 = el("path", { d: "M-12 70 Q0 120 12 70 Z", fill: "#FFE27A" }, fl);
  el("path", { d: "M-40 70 L-58 100 L-34 94 Z M40 70 L58 100 L34 94 Z", fill: "#E8473C", ...S6(4) }, k);
  el("path", { d: "M-34 70 V-20 Q-34 -110 0 -140 Q34 -110 34 -20 V70 Z", fill: "#F4F7FA", ...S6(5) }, k); el("path", { d: "M-34 -20 Q0 -40 34 -20 V-10 Q0 -30 -34 -10 Z", fill: "#E8473C" }, k);
  el("circle", { cx: 0, cy: -40, r: 18, fill: "#7FCBF0", ...S6(4) }, k); el("path", { d: "M-34 70 H34", ...S6(4) }, k);
  let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; const q = 1 + Math.sin(t * 40) * .25; f1.setAttribute("transform", `scale(1 ${q.toFixed(2)})`); f2.setAttribute("transform", `scale(1 ${(q * .9).toFixed(2)})`); }); g.k = k; g.fl = fl; return g; }
async function ucRocket(pc, to) {
  if (!to) return; const [tx, ty] = nodeXY(pc, to), x0 = pc.px, y0 = pc.py, g = el("g", { "pointer-events": "none" }, front()), r = ucRocketArt(g, .9);
  let rx = x0 + 200, ry = y0 - 600, ang = 0; const at = () => r.setAttribute("transform", `translate(${rx.toFixed(0)} ${ry.toFixed(0)}) rotate(${ang.toFixed(0)})`); r.fl.setAttribute("display", "none"); at();
  if (ctx) noise(.5, 600, .3); await tween(800, k => { ry = y0 - 600 + 560 * k; rx = x0 + 200 * (1 - k); at(); }); // おりて くる
  r.fl.setAttribute("display", ""); jump(pc, .6); await sleep(350); pc.root.setAttribute("opacity", 0); // のりこむ
  if (ctx) { noise(2.2, 300, .6); blip(90, 50, 2, "sawtooth"); } shake(600, 10);
  const dir = tx >= x0 ? 1 : -1, cx = (x0 + tx) / 2, cy = Math.min(y0, ty) - 330;
  await tween(2000, k => { const v = 1 - k; const nx = v * v * x0 + 2 * v * k * cx + k * k * tx, ny = v * v * (y0 - 40) + 2 * v * k * cy + k * k * (ty - 40);
    ang = Math.atan2(ny - ry, nx - rx) * 180 / Math.PI + 90; if (k === 0) ang = 0; rx = nx; ry = ny; pc.px = nx; pc.py = ny + 40; at();
    if (Math.random() < .6) mark("puff", nx - Math.sin(ang * Math.PI / 180) * 70 * -1, ny + Math.cos(ang * Math.PI / 180) * 70, { vy: 60, life: .5, s: .5 }); });
  pc.node = to; pc.px = tx; pc.py = ty; pc.trail = []; pc.root.setAttribute("opacity", 1); jump(pc, .5); chime(); confetti(20);
  await tween(700, k => { ry = ty - 40 - 500 * k; rx = tx + dir * 200 * k; ang = -dir * 20; at(); r.setAttribute("opacity", (1 - k).toFixed(2)); }); g.remove(); }
/* ---------- ☄ いんせきの あめ（1かいだけ） ---------- */
function ucBankFor(i) { let best = null; UC_SAFE.forEach(b => { if (best == null || Math.abs(b - i) < Math.abs(best - i) || (Math.abs(b - i) === Math.abs(best - i) && b > i)) best = b; }); return best; }
async function ucMeteor() {
  UC_METEOR = 1; const O = SL_ORDER.uchu2, pcs = PLAYERS.map(p => p.pc);
  const g = el("g", { "pointer-events": "none" }, hudLayer), red = el("rect", { x: -1200, y: -400, width: 4000, height: 1800, fill: "#FF3B3B", opacity: 0 }, g);
  let rt = 0, alive = true; addTick(dt => { if (!alive) return false; rt += dt; red.setAttribute("opacity", (Math.max(0, Math.sin(rt * 6)) * .14).toFixed(3)); });
  if (ctx) for (let i = 0; i < 6; i++) later(i * 500, () => { blip(880, 880, .2, "square"); later(250, () => blip(660, 660, .2, "square")); });
  showBanner("いんせきの あめ！", 1800); await speak(C.pony, "ucp_inseki", UC.txt.ucp_inseki);
  const rain = el("g", {}, g); let done = false; // いんせきが ななめに ふって くる
  (async () => { for (let k = 0; k < 14 && !done; k++) { const x = 300 + Math.random() * 1300, y = -80, m = el("g", {}, rain); el("path", { d: "M0 0 L60 -90 L30 -170 L-40 -150 L-70 -60 Z", fill: "#8E929C", ...S6(5) }, m); el("path", { d: "M-10 -60 l20 -30 M10 -90 l25 -10", stroke: "#5C6170", "stroke-width": 4 }, m);
      const tr = el("path", { d: "M0 0 Q80 -120 220 -300", fill: "none", stroke: "#FFB36B", "stroke-width": 10, "stroke-linecap": "round", opacity: .8 }, m); m.insertBefore(tr, m.firstChild);
      tween(1100, u => m.setAttribute("transform", `translate(${(x - 500 * u).toFixed(0)} ${(y + 1300 * u).toFixed(0)}) rotate(${(u * 160).toFixed(0)}) scale(.5)`)).then(() => { m.remove(); if (ctx) noise(.15, 300, .3); }); await sleep(260); } })();
  const inW = pcs.filter(pc => UC_OPEN.has(ucI(pc.node)));
  for (const pc of inW) { let i = ucI(pc.node); const to = ucBankFor(i), st = to > i ? 1 : -1; markAbove(pc, "ex"); surprise(pc); while (i !== to) { i += st; await hop(pc, O[i], .3, 0); } jump(pc, .5); }
  await speak(C.pony, inW.length ? "ucp_inseki_ok" : "ucp_inseki_none", inW.length ? UC.txt.ucp_inseki_ok : UC.txt.ucp_inseki_none); if (inW.length) confetti(30);
  done = true; alive = false; await tween(600, k => red.setAttribute("opacity", (.1 * (1 - k)).toFixed(3))); g.remove();
  await speak(C.pony, "ucp_inseki_end", UC.txt.ucp_inseki_end); }
{ const mt = multiTurn; multiTurn = async function (pl, first) { await mt(pl, first);
    if (curStage === "uchu2" && !UC_METEOR && !winner && PLAYERS.some(p => ucI(p.pc.node) >= 27)) await ucMeteor(); }; }
/* ---------- うちゅうふく ---------- */
const UC_SUIT = new Set(["piko", "gabo"]); // うちゅうじんは きない
function ucSuitOn(c) {
  if (!c || c.__suit || UC_SUIT.has(c.kind) || !c.head) return; const root = c.root, hid = root.style.display === "none"; if (hid) root.style.display = "";
  let bb; try { bb = c.head.g.getBBox(); } catch (e) { bb = null; } if (hid) root.style.display = "none";
  if (!bb || !bb.width) bb = { x: 90, y: 60, width: 220, height: 200 };
  const cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2, rx = bb.width / 2 + 16, ry = bb.height / 2 + 14;
  const aL = c.arms ? c.arms[0] : { px: 132, py: 290 }, aR = c.arms ? c.arms[1] : { px: 268, py: 290 }, legTop = c.legs && c.legs[0] ? c.legs[0].py - 2 : 360;
  const S = []; const mk = (tag, attrs, parent, before) => { const e = el(tag, attrs); e.classList.add("ucsuit"); if (before) parent.insertBefore(e, before); else parent.appendChild(e); S.push(e); return e; };
  // せなかの タンク（からだの うしろ）
  const bp = mk("g", {}, root, root.firstChild); el("rect", { x: cx - 56, y: aL.py - 36, width: 112, height: legTop - aL.py + 50, rx: 18, fill: "#C9D3DE", ...ST(5) }, bp);
  [[cx - 30, "#7FCBF0"], [cx + 30, "#FFFFFF"]].forEach(([x, f]) => { el("rect", { x: x - 16, y: aL.py - 60, width: 32, height: 70, rx: 14, fill: f, ...ST(4) }, bp); el("rect", { x: x - 8, y: aL.py - 70, width: 16, height: 14, rx: 4, fill: "#3B3A44", ...ST(3) }, bp); });
  // むねの パネル（からだの うえ・うでの した）
  const vest = mk("g", {}, root, c.arms ? c.arms[0].g : null); const vx = aL.px + 8, vw = aR.px - aL.px - 16, vy = aL.py - 6, vh = legTop - vy + 14;
  el("path", { d: `M${vx} ${vy + 16} Q${cx} ${vy - 6} ${vx + vw} ${vy + 16} L${vx + vw + 6} ${vy + vh} Q${cx} ${vy + vh + 14} ${vx - 6} ${vy + vh} Z`, fill: "#F4F7FA", ...ST(5) }, vest);
  el("path", { d: `M${vx + 12} ${vy + vh - 16} H${vx + vw - 12}`, stroke: "#C9D3DE", "stroke-width": 6 }, vest); el("rect", { x: cx - 28, y: vy + 28, width: 56, height: 36, rx: 8, fill: "#3B3A44", ...ST(4) }, vest);
  [[-16, "#FF6F61"], [0, "#FFD25E"], [16, "#7BD389"]].forEach(([dx, f]) => el("circle", { cx: cx + dx, cy: vy + 46, r: 5, fill: f }, vest));
  el("path", { d: `M${cx + 30} ${vy + 46} Q${vx + vw + 10} ${vy + 60} ${vx + vw - 4} ${vy + 90}`, fill: "none", stroke: "#7FCBF0", "stroke-width": 7, "stroke-linecap": "round" }, vest); el("path", { d: `M${cx + 30} ${vy + 46} Q${vx + vw + 10} ${vy + 60} ${vx + vw - 4} ${vy + 90}`, fill: "none", stroke: INK, "stroke-width": 2, "stroke-dasharray": "4 6" }, vest);
  // ヘルメット（あたまの グループの いちばん うえ：すけて みえる）
  const hm = mk("g", {}, c.head.g); el("ellipse", { cx, cy, rx, ry, fill: "#BDE3F2", opacity: .22 }, hm); el("ellipse", { cx, cy, rx, ry, fill: "none", ...ST(6) }, hm);
  el("ellipse", { cx, cy, rx: rx - 7, ry: ry - 7, fill: "none", stroke: "#FFFFFF", "stroke-width": 4, opacity: .55 }, hm);
  el("path", { d: `M${cx - rx * .62} ${cy - ry * .3} Q${cx - rx * .5} ${cy - ry * .78} ${cx - rx * .1} ${cy - ry * .86}`, fill: "none", stroke: "#FFFFFF", "stroke-width": 9, "stroke-linecap": "round", opacity: .8 }, hm);
  el("rect", { x: cx - 46, y: cy + ry - 14, width: 92, height: 24, rx: 10, fill: "#C9D3DE", ...ST(4) }, hm); el("circle", { cx: cx + rx - 4, cy: cy - 10, r: 9, fill: "#FF6F61", ...ST(3) }, hm);
  c.__suit = S; }
function ucSuitOff(c) { if (!c || !c.__suit) return; c.__suit.forEach(e => e.remove()); c.__suit = null; }
function ucSuitAll(on) { const all = [...Object.values(C), ...Object.values(PIECE)]; all.forEach(c => on ? ucSuitOn(c) : ucSuitOff(c)); }
{ const pc0 = piece; piece = function (kind) { const c = pc0(kind); if (curStage === "uchu2") ucSuitOn(c); return c; }; }
/* ---------- 盤の え ---------- */
function ucStars(L, n = 90, seed = 1, w = 1600, h = 1000, tw = true) { const g = el("g", {}, L), ss = [];
  for (let i = 0; i < n; i++) { const x = ((i * 233 + seed * 71) % w), y = ((i * 137 + seed * 43) % h), r = 1.5 + (i % 3); const s = el("circle", { cx: x, cy: y, r, fill: i % 7 ? "#FFF6C8" : "#BFE6FA", opacity: .9 }, g); ss.push([s, i]); }
  if (tw) { let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; ss.forEach(([s, i]) => { if (i % 4 === 0) s.setAttribute("opacity", (.4 + .6 * Math.abs(Math.sin(t * 1.5 + i))).toFixed(2)); }); }); } return g; }
function ucEarth(L, x, y, r) { const g = el("g", {}, L); el("circle", { cx: x, cy: y, r: r + 14, fill: "#7FCBF0", opacity: .35 }, g); el("circle", { cx: x, cy: y, r, fill: "#3E9BD6", ...S6(6) }, g);
  const cp = `uc-e-${Math.round(x)}-${Math.round(y)}`; const c = el("clipPath", { id: cp }, defs); el("circle", { cx: x, cy: y, r: r - 2 }, c); const land = el("g", { "clip-path": `url(#${cp})` }, g);
  el("path", { d: `M${x - r * .7} ${y - r * .5} q${r * .3} -${r * .4} ${r * .6} -${r * .1} q${r * .3} ${r * .2} ${r * .1} ${r * .5} q-${r * .4} ${r * .3} -${r * .7} ${r * .1} Z`, fill: "#7BD389" }, land);
  el("path", { d: `M${x + r * .1} ${y + r * .1} q${r * .4} -${r * .2} ${r * .6} ${r * .2} q-${r * .1} ${r * .5} -${r * .5} ${r * .5} q-${r * .3} -${r * .3} -${r * .1} -${r * .7} Z`, fill: "#7BD389" }, land);
  [[x - r * .3, y + r * .55, r * .35], [x + r * .5, y - r * .5, r * .28], [x - r * .6, y + r * .1, r * .2]].forEach(([cx, cy, rr]) => el("ellipse", { cx, cy, rx: rr, ry: rr * .45, fill: "#FFFFFF", opacity: .75 }, land));
  el("circle", { cx: x - r * .35, cy: y - r * .35, r: r * .22, fill: "#FFFFFF", opacity: .25 }, g); return g; }
function ucMoonArt(L, x, y, r, dark = false) { const g = el("g", {}, L); el("circle", { cx: x, cy: y, r, fill: dark ? "#C9CBD6" : "#E8E9F0", ...S6(6) }, g);
  [[-.4, -.3, .22], [.3, -.1, .16], [-.1, .4, .2], [.45, .4, .12], [-.55, .25, .1], [.1, -.55, .09]].forEach(([dx, dy, k]) => { el("circle", { cx: x + dx * r, cy: y + dy * r, r: r * k, fill: "#B9BBC8", ...S6(3) }, g); el("path", { d: `M${x + dx * r - r * k * .6} ${y + dy * r - r * k * .3} q${r * k * .6} -${r * k * .5} ${r * k * 1.2} 0`, fill: "none", stroke: "#FFFFFF", "stroke-width": 3, opacity: .6 }, g); });
  el("circle", { cx: x - r * .35, cy: y - r * .35, r: r * .3, fill: "#FFFFFF", opacity: .3 }, g); return g; }
function ucPlanetArt(L, x, y, r) { const g = el("g", {}, L); el("ellipse", { cx: x, cy: y, rx: r * 1.7, ry: r * .45, fill: "none", stroke: "#FFD25E", "stroke-width": r * .14, opacity: .85, transform: `rotate(-18 ${x} ${y})` }, g);
  el("circle", { cx: x, cy: y, r, fill: "#B07CE0", ...S6(6) }, g); const cp = `uc-p-${Math.round(x)}`; const c = el("clipPath", { id: cp }, defs); el("circle", { cx: x, cy: y, r: r - 2 }, c); const inner = el("g", { "clip-path": `url(#${cp})` }, g);
  [[-.2, -.4, .5, "#C99BF0"], [.4, .3, .4, "#8E5BD6"], [-.5, .4, .3, "#D9C2F0"]].forEach(([dx, dy, k, f]) => el("ellipse", { cx: x + dx * r, cy: y + dy * r, rx: r * k, ry: r * k * .5, fill: f, opacity: .8 }, inner));
  el("path", { d: `M${x - r * 1.7} ${y} Q${x} ${y + r * .55} ${x + r * 1.7} ${y}`, fill: "none", stroke: "#FFD25E", "stroke-width": r * .14, opacity: .95, transform: `rotate(-18 ${x} ${y})` }, g); el("path", { d: `M${x - r * 1.7} ${y} Q${x} ${y + r * .55} ${x + r * 1.7} ${y}`, fill: "none", ...S6(3), transform: `rotate(-18 ${x} ${y})` }, g);
  el("circle", { cx: x - r * .35, cy: y - r * .35, r: r * .25, fill: "#FFFFFF", opacity: .25 }, g); return g; }
function ucRock(L, x, y, s = 1, rot = 0) { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, L); el("path", { d: "M-40 10 L-30 -30 L10 -42 L44 -16 L36 24 L0 40 Z", fill: "#8E929C", ...S6(5) }, g); el("path", { d: "M-12 -10 l14 -16 M4 10 l18 -6", stroke: "#5C6170", "stroke-width": 4, "stroke-linecap": "round" }, g); el("circle", { cx: -18, cy: 8, r: 6, fill: "#5C6170" }, g); return g; }
function ucComet(L) { const g = el("g", {}, L); el("path", { d: "M0 0 L-180 -40 L-150 0 L-180 40 Z", fill: "#FFF6C8", opacity: .7 }, g); el("circle", { r: 10, fill: "#FFFFFF", ...S6(3) }, g);
  let t = 6; addTick(dt => { if (!g.isConnected) return false; t += dt; const p = (t % 14) / 14; if (p < .18) { const u = p / .18; g.setAttribute("transform", `translate(${(1700 - 2000 * u).toFixed(0)} ${(80 + 420 * u).toFixed(0)}) rotate(12)`); g.setAttribute("opacity", 1); } else g.setAttribute("opacity", 0); }); return g; }
BOARD_BG.uchu2 = L => {
  const T = SL_TH.uchu2; el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: T.ground }, L);
  // せいうん（うすい いろの くも）
  [[700, 650, 420, 140, "#5B4A9E"], [1100, 220, 380, 110, "#2E6E8E"], [900, 560, 500, 120, "#7A4A8E"]].forEach(([x, y, rx, ry, f]) => el("ellipse", { cx: x, cy: y, rx, ry, fill: f, opacity: .22 }, L));
  ucStars(L, 110, 3); ucComet(L);
  ucEarth(L, UC_EARTH[0], UC_EARTH[1], 150); ucMoonArt(L, UC_MOON[0], UC_MOON[1], 125); ucPlanetArt(L, UC_PLANET[0], UC_PLANET[1], 120);
  // いんせきの おび（うちゅうの マスの まわり）
  [[1000, 250, .55, 20], [880, 420, .45, -30], [760, 230, .5, 60], [640, 420, .4, 10], [540, 250, .55, -50], [1100, 300, .35, 30], [700, 400, .3, 80], [930, 220, .35, -10]].forEach(([x, y, s, r]) => ucRock(L, x, y, s, r));
  // ステーション（ばんの そと）と ピコの ユーフォー
  { const g = el("g", { transform: "translate(1380 230) scale(.9)" }, L); el("rect", { x: -60, y: -24, width: 120, height: 48, rx: 12, fill: "#DCE3EA", ...S6(4) }, g); el("rect", { x: -150, y: -14, width: 80, height: 28, fill: "#3E7FD6", ...S6(3) }, g); el("rect", { x: 70, y: -14, width: 80, height: 28, fill: "#3E7FD6", ...S6(3) }, g); el("circle", { cy: -40, r: 12, fill: "#C9D3DE", ...S6(3) }, g); const l = el("circle", { cy: 0, r: 7, fill: "#7BD389" }, g); el("animate", { attributeName: "opacity", values: "1;.2;1", dur: "1.4s", repeatCount: "indefinite" }, l); }
  { const u = ucUfoArt(L, .5); let t = 0; addTick(dt => { if (!u.isConnected) return false; t += dt; u.setAttribute("transform", `translate(${(820 + Math.sin(t * .5) * 60).toFixed(0)} ${(640 + Math.sin(t * 1.3) * 14).toFixed(0)})`); }); }
  // エリアの かんばん
  const SG = [[600, 858, "🚀"], [1320, 600, "🌙"], [800, 430, "☄"], [640, 520, "👽"]];
  SG.forEach(([x, y, ic], r) => { const w = T.areas[r].length * 22 + 70; el("rect", { x: x - w / 2, y: y - 30, width: w, height: 60, rx: 18, fill: "#FFFFFFDD", ...S6(4) }, L); txt(L, x - w / 2 + 34, y + 14, ic, 32, { "text-anchor": "middle" }); txt(L, x + 18, y + 10, T.areas[r], 20, { "text-anchor": "middle" }); });
  { const tg = el("g", { "data-top": 1 }, L); el("rect", { x: 960, y: 38, width: 440, height: 72, rx: 22, fill: "#8E5BD6", ...S6(5) }, tg); txt(tg, 1180, 86, `${T.icon} ${T.name}`, 32, { "text-anchor": "middle", fill: "#FFFFFF" }); } };
/* ---------- 場面の はいけい ---------- */
function ucSpaceSky(L, n = 80) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#0F1430" }, L); ucStars(L, n, 5); }
function ucPanel(L, x, y, w, h) { const g = el("g", { transform: `translate(${x} ${y})` }, L); el("rect", { x: 0, y: 0, width: w, height: h, rx: 14, fill: "#3B3F55", ...S6(5) }, g);
  const ls = []; for (let i = 0; i < Math.floor(w / 44) - 1; i++) for (let j = 0; j < 2; j++) ls.push(el("circle", { cx: 30 + i * 44, cy: 26 + j * 36, r: 9, fill: ["#FF6F61", "#FFD25E", "#7BD389", "#7FCBF0"][(i + j) % 4], ...S6(2) }, g));
  el("rect", { x: w - 110, y: 14, width: 92, height: h - 28, rx: 8, fill: "#18323A", ...S6(3) }, g); const ln = el("path", { fill: "none", stroke: "#7BD389", "stroke-width": 3 }, g);
  let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; ls.forEach((l, i) => l.setAttribute("opacity", (Math.floor(t * 3 + i * 1.3) % 3 ? 1 : .25))); let d = ""; for (let i = 0; i <= 16; i++) d += (i ? "L" : "M") + (w - 104 + i * 5) + " " + (h / 2 + Math.sin(t * 6 + i) * 10); ln.setAttribute("d", d); }); return g; }
function ucRocketRoom(L) { // ロケットの なか：まるい まど（そとは うちゅう）・そうさパネル・シート
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#DCE3EA" }, L); for (let x = 0; x < 1600; x += 200) el("path", { d: `M${x} 0 V760`, stroke: "#C9D3DE", "stroke-width": 8 }, L); el("path", { d: "M0 300 H1600", stroke: "#C9D3DE", "stroke-width": 10 }, L);
  for (let y = 60; y < 700; y += 120) [100, 1500].forEach(x => el("circle", { cx: x, cy: y, r: 7, fill: "#9AA0AE", ...S6(2) }, L)); // リベット
  // まど
  const wx = 800, wy = 330, wr = 180; el("circle", { cx: wx, cy: wy, r: wr + 26, fill: "#B9BBC8", ...S6(6) }, L); el("circle", { cx: wx, cy: wy, r: wr, fill: "#0F1430", ...S6(5) }, L);
  const cp = el("clipPath", { id: "uc-win" }, defs); el("circle", { cx: wx, cy: wy, r: wr - 2 }, cp); const inw = el("g", { "clip-path": "url(#uc-win)" }, L); ucStars(inw, 40, 9);
  if (UC_CUR === "chikyu") { const e = ucEarth(inw, wx + 60, wy + 90, 120); let t = 0; addTick(dt => { if (!e.isConnected) return false; t += dt; e.setAttribute("transform", `translate(${(Math.sin(t * .4) * 10).toFixed(0)} ${(Math.cos(t * .3) * 6).toFixed(0)})`); }); }
  else if (UC_CUR === "count") { el("rect", { x: wx - wr, y: wy + 40, width: wr * 2, height: wr, fill: "#BFE3A6" }, inw); el("rect", { x: wx - wr, y: wy - wr, width: wr * 2, height: wr + 40, fill: "#CFEAFB" }, inw); el("rect", { x: wx + 40, y: wy - 60, width: 30, height: 110, fill: "#B9B4AA", ...S6(3) }, inw); } // はっしゃまえ：そとは ちきゅうの けしき
  else { const m = ucMoonArt(inw, wx - 70, wy - 40, 50); }
  el("circle", { cx: wx - 60, cy: wy - 70, r: 40, fill: "#FFFFFF", opacity: .18 }, L); [0, 90].forEach(a => el("path", { d: `M${wx - wr - 26} ${wy} H${wx + wr + 26}`, stroke: "#B9BBC8", "stroke-width": 10, transform: `rotate(${a + 45} ${wx} ${wy})`, opacity: .5 }, L));
  ucPanel(L, 140, 440, 460, 100); ucPanel(L, 1040, 440, 420, 100);
  // ゆか と シート
  el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#9AA0AE" }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L); for (let x = 0; x < 1600; x += 100) el("path", { d: `M${x} 760 L${x - 50} 1000`, stroke: "#8A909E", "stroke-width": 4 }, L);
  [1150, 1350].forEach(x => { el("path", { d: `M${x - 70} 760 V600 Q${x - 70} 570 ${x - 40} 570 H${x + 40} Q${x + 70} 570 ${x + 70} 600 V760 Z`, fill: "#3E7FD6", ...S6(5) }, L); el("rect", { x: x - 60, y: 690, width: 120, height: 30, rx: 8, fill: "#2B5FA8" }, L); });
  if (UC_CUR === "fuwa") for (let k = 0; k < 4; k++) { const o = el("g", {}, L); el("path", { d: "M-18 0 h36 l-4 24 h-28 Z", fill: ["#FFD25E", "#FF8FA3", "#7BD389", "#FFFFFF"][k], ...S6(3) }, o); let t = k; addTick(dt => { if (!o.isConnected) return false; t += dt; o.setAttribute("transform", `translate(${(300 + k * 300 + Math.sin(t * .7) * 40).toFixed(0)} ${(250 + Math.sin(t * 1.1 + k) * 60).toFixed(0)}) rotate(${(t * 30).toFixed(0)})`); }); } // ういてる もの
}
function ucMoonRoom(L) { // つき：くろい そら・ちきゅう・クレーターの ある はいいろの じめん・ちゃくりくせん
  ucSpaceSky(L, 100); ucEarth(L, 1320, 170, 90);
  el("path", { d: "M0 560 Q200 500 420 560 Q640 620 860 550 Q1100 490 1300 560 Q1450 600 1600 540 V1000 H0 Z", fill: "#C9CBD6", ...S6(6) }, L);
  el("path", { d: "M0 760 Q400 720 800 760 T1600 760 V1000 H0 Z", fill: "#B9BBC8" }, L);
  [[300, 640, 90, 26], [1000, 620, 120, 32], [1400, 700, 70, 20], [650, 700, 60, 18]].forEach(([x, y, rx, ry]) => { el("ellipse", { cx: x, cy: y, rx, ry, fill: "#9A9DAE", ...S6(4) }, L); el("path", { d: `M${x - rx * .8} ${y - ry * .3} q${rx * .8} -${ry * 1.2} ${rx * 1.6} 0`, fill: "none", stroke: "#FFFFFF", "stroke-width": 4, opacity: .5 }, L); });
  { const g = el("g", { transform: "translate(1180 560) scale(.8)" }, L); el("path", { d: "M-70 0 L-110 60 M70 0 L110 60 M-40 0 L-60 60 M40 0 L60 60", ...S6(8) }, g); el("path", { d: "M-80 0 H80 L60 -60 H-60 Z", fill: "#FFD25E", ...S6(5) }, g); el("path", { d: "M-50 -60 H50 L30 -120 H-30 Z", fill: "#DCE3EA", ...S6(5) }, g); el("circle", { cy: -90, r: 14, fill: "#0F1430", ...S6(3) }, g); } // ちゃくりくせん
  if (UC_CUR === "ana") { el("ellipse", { cx: 900, cy: 965, rx: 150, ry: 44, fill: "#2B2A33", ...S6(6) }, L); el("ellipse", { cx: 900, cy: 956, rx: 120, ry: 26, fill: "#4A4F63" }, L); }
  if (UC_CUR === "michi") for (let i = 0; i < 5; i++) { const d = el("ellipse", { cx: 0, cy: 0, rx: 220, ry: 90, fill: "#C9CBD6", opacity: .55 }, L); let t = i * 1.3; addTick(dt => { if (!d.isConnected) return false; t += dt; d.setAttribute("transform", `translate(${((t * 120 + i * 400) % 2000 - 200).toFixed(0)} ${(720 + i * 50).toFixed(0)})`); }); }
  if (UC_CUR === "hata") { const g = el("g", { transform: "translate(1300 975)" }, L); el("path", { d: "M0 0 V-330", ...S6(8) }, g); el("path", { d: "M4 -330 H150 V-250 H4 Z", fill: "#E8473C", ...S6(4) }, g); el("circle", { cx: 60, cy: -290, r: 22, fill: "#FFFFFF" }, g); txt(g, 60, -278, "🦓", 28, { "text-anchor": "middle" }); }
}
function ucSpaceRoom(L) { // ふねの そと：ひだりに うちゅうせんの どう、あしもとは ふねの ゆか。いんせきが ながれる
  ucSpaceSky(L, 120); ucEarth(L, 220, 160, 110);
  if (UC_CUR === "bh") { const g = el("g", {}, L); ucHoleArt(g, 1250, 230, 70); }
  if (UC_CUR === "hoshi") { const s = el("path", { d: "M0 -40 L11 -12 L40 -8 L18 10 L24 40 L0 24 L-24 40 L-18 10 L-40 -8 L-11 -12 Z", fill: "#FFE27A", ...S6(4), transform: "translate(1200 220) scale(1.4)" }, L); el("animate", { attributeName: "opacity", values: "1;.5;1", dur: "1.2s", repeatCount: "indefinite" }, s); }
  const rocks = el("g", {}, L); [[900, 150, .6, 200], [1450, 420, .5, -160], [700, 80, .35, 120]].forEach(([x, y, s, v], i) => { const r = ucRock(rocks, x, y, s, 0); let t = 0; addTick(dt => { if (!r.isConnected) return false; t += dt; r.setAttribute("transform", `translate(${((x + t * v * .25 + 2000) % 2000 - 200).toFixed(0)} ${(y + Math.sin(t * .5 + i) * 20).toFixed(0)}) rotate(${(t * 20).toFixed(0)}) scale(${s})`); }); });
  if (UC_CUR === "inseki") { const m = el("g", {}, L); el("path", { d: "M0 0 L60 -90 L30 -170 L-40 -150 L-70 -60 Z", fill: "#8E929C", ...S6(6) }, m); const tr = el("path", { d: "M0 0 Q120 -100 300 -220", fill: "none", stroke: "#FFB36B", "stroke-width": 14, "stroke-linecap": "round", opacity: .8 }, m); m.insertBefore(tr, m.firstChild); let t = 0; addTick(dt => { if (!m.isConnected) return false; t += dt; const p = (t % 5) / 5; m.setAttribute("transform", `translate(${(1700 - 1200 * p).toFixed(0)} ${(60 + 420 * p).toFixed(0)}) rotate(${(p * 200).toFixed(0)}) scale(${(.5 + p * .6).toFixed(2)})`); }); }
  // うちゅうせんの どう（ひだり）
  el("path", { d: "M-100 560 H520 Q600 560 600 640 V1000 H-100 Z", fill: "#DCE3EA", ...S6(6) }, L); el("rect", { x: 40, y: 600, width: 400, height: 40, rx: 10, fill: "#3E7FD6", ...S6(4) }, L);
  [[140, 700], [300, 700], [460, 720]].forEach(([x, y]) => { el("circle", { cx: x, cy: y, r: 36, fill: "#0F1430", ...S6(5) }, L); el("circle", { cx: x - 10, cy: y - 10, r: 10, fill: "#FFFFFF", opacity: .3 }, L); });
  { const g = el("g", { transform: "translate(180 560)" }, L); el("path", { d: "M0 0 V-120", ...S6(8) }, g); el("rect", { x: -80, y: -200, width: 160, height: 80, rx: 8, fill: "#3B3F55", ...S6(5) }, g); for (let i = 0; i < 3; i++) el("rect", { x: -70 + i * 50, y: -190, width: 40, height: 60, fill: "#7FCBF0", opacity: .8 }, g); } // ソーラーパネル
  // ゆか（ふねの そとがわ）
  el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#B9BBC8" }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L); for (let x = 60; x < 1600; x += 140) el("rect", { x, y: 790, width: 90, height: 14, rx: 6, fill: "#FFD25E", opacity: .8 }, L);
  for (let x = 0; x < 1600; x += 200) el("path", { d: `M${x} 760 V1000`, stroke: "#9AA0AE", "stroke-width": 5 }, L);
}
function ucAlienRoom(L) { // うちゅうじんの ほし：むらさきの そら・つきが ふたつ・みどりの じめん・ひかる きのこと けっしょう・ピコの ユーフォー
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#4A2A7A" }, L); ucStars(L, 60, 7, 1600, 500);
  el("circle", { cx: 1300, cy: 160, r: 70, fill: "#FFD9A8", ...S6(5) }, L); el("circle", { cx: 1420, cy: 240, r: 36, fill: "#FFB36B", ...S6(4) }, L);
  el("path", { d: "M0 520 Q300 420 600 500 Q900 580 1200 470 Q1400 400 1600 480 V1000 H0 Z", fill: "#3EB489", ...S6(6) }, L);
  el("path", { d: "M0 740 Q400 700 800 740 T1600 740 V1000 H0 Z", fill: "#2E9B74" }, L); el("path", { d: "M0 740 Q400 700 800 740 T1600 740", fill: "none", ...S6(5) }, L);
  [[180, 560, 1.1, "#FF8FA3"], [1450, 600, .9, "#7FCBF0"], [1100, 520, .7, "#FFD25E"], [420, 500, .6, "#FF8FA3"]].forEach(([x, y, s, c], i) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L); el("rect", { x: -14, y: -90, width: 28, height: 100, rx: 10, fill: "#F3EDE4", ...S6(4) }, g); el("path", { d: "M-70 -80 Q0 -160 70 -80 Q0 -60 -70 -80 Z", fill: c, ...S6(5) }, g); [[-30, -100], [10, -115], [40, -92]].forEach(([dx, dy]) => el("circle", { cx: dx, cy: dy, r: 7, fill: "#FFFFFF" }, g)); const glow = el("ellipse", { cx: 0, cy: -90, rx: 80, ry: 40, fill: c, opacity: .2 }, g); el("animate", { attributeName: "opacity", values: ".1;.35;.1", dur: `${1.5 + i * .4}s`, repeatCount: "indefinite" }, glow); }); // ひかる きのこ
  [[700, 540, "#BDE3F2"], [1280, 560, "#D9C2F0"]].forEach(([x, y, c]) => { const g = el("g", { transform: `translate(${x} ${y})` }, L); el("path", { d: "M-30 0 L-20 -90 L0 -130 L20 -90 L30 0 Z", fill: c, ...S6(4), opacity: .9 }, g); el("path", { d: "M-10 0 L-4 -70 L6 -40 L10 0 Z", fill: "#FFFFFF", opacity: .6 }, g); }); // けっしょう
  { const u = ucUfoArt(L, .9); u.setAttribute("transform", "translate(1250 400)"); u.k.lastChild && u.k.querySelectorAll("circle")[5] && 0; el("path", { d: "M1200 430 L1150 520 M1300 430 L1350 520", ...S6(7) }, L); } // とめて ある ユーフォー
}
const ROOMS_UC = { "ロケット": ucRocketRoom, "つき": ucMoonRoom, "うちゅう": ucSpaceRoom, "うちゅうじんの ほし": ucAlienRoom };
{ const dr = drawRoom; drawRoom = function (place, noSign = false) {
    if (curStage !== "uchu2" || !ROOMS_UC[place]) return dr(place, noSign);
    sceneLayer.innerHTML = ""; ROOMS_UC[place](sceneLayer);
    if (!noSign) { const g = el("g", {}, sceneLayer); el("rect", { x: 620, y: 24, width: 360, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, place.length > 6 ? 38 : 46, { "text-anchor": "middle" }); } }; }
/* ---------- 場面の 小道具 ---------- */
function ucProp(sc, h, a) {
  const G = el("g", {}, propG), hx = h.x + 200 * h.s, ax = a ? a.x + 200 * a.s : 1200, base = 975, id = sc.id;
  if (id === "count") { const g = el("g", { transform: "translate(1250 330)" }, G); el("rect", { x: -90, y: -50, width: 180, height: 100, rx: 14, fill: "#2B2A33", ...S6(5) }, g); const t = txt(g, 0, 26, "5", 72, { "text-anchor": "middle", fill: "#FF6F61" }); let n = 5, acc = 0; addTick(dt => { if (!g.isConnected) return false; acc += dt; if (acc > 1.2 && n > 1) { acc = 0; n--; t.textContent = String(n); if (ctx) blip(880, 880, .1, "square"); } }); }
  else if (id === "oto") { const g = el("g", {}, G); let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; g.innerHTML = ""; for (let k = 0; k < 4; k++) el("path", { d: `M${80 + k * 30} ${300 + Math.sin(t * 30 + k) * 10} q20 -30 40 0 t40 0`, fill: "none", stroke: "#FFD25E", "stroke-width": 6, opacity: .8 }, g); sceneLayer.setAttribute("transform", `translate(${(Math.sin(t * 50) * 4).toFixed(1)} ${(Math.cos(t * 43) * 3).toFixed(1)})`); }); later(5000, () => { g.remove(); sceneLayer.removeAttribute("transform"); }); }
  else if (id === "shoku") { const p = el("g", { transform: `translate(${ax - 150} ${base - 290}) rotate(-10)` }, G); el("rect", { x: -30, y: -60, width: 60, height: 120, rx: 14, fill: "#C9D3DE", ...S6(4) }, p); el("rect", { x: -20, y: -40, width: 40, height: 60, rx: 6, fill: "#FFB36B" }, p); el("path", { d: "M0 -60 V-100", stroke: "#FF6F61", "stroke-width": 7 }, p); }
  else if (id === "helmet") { later(200, () => { if (a.__suit) { const hm = a.__suit[a.__suit.length - 1]; hm.setAttribute("transform", "rotate(16 200 160) translate(0 -22)"); } }); for (let i = 0; i < 3; i++) later(600 + i * 500, () => markAbove(a, "q", { dx: 40 })); }
  else if (id === "jump") { for (let i = 0; i < 3; i++) later(500 + i * 1100, () => { jump(h, 1.3); }); }
  else if (id === "ishi") { const s = el("g", { transform: `translate(${hx + 150} ${base - 20})` }, G); el("path", { d: "M-30 10 L-20 -20 L10 -28 L34 -10 L26 14 L0 22 Z", fill: "#B9BBC8", ...S6(4) }, s); const sp = el("path", { d: "M0 -14 L3 -4 L13 -2 L4 4 L6 14 L0 8 L-6 14 L-4 4 L-13 -2 L-3 -4 Z", fill: "#FFE27A", transform: "translate(4 -4)" }, s); el("animate", { attributeName: "opacity", values: "1;.3;1", dur: ".9s", repeatCount: "indefinite" }, sp); }
  else if (id === "kuuki") { const g = el("g", { transform: `translate(${hx + 150} ${base - 420})` }, G); el("rect", { x: -40, y: -60, width: 80, height: 120, rx: 10, fill: "#FFFFFF", ...S6(4) }, g); const b = el("rect", { x: -30, y: 20, width: 60, height: 30, fill: "#FF6F61" }, g); el("animate", { attributeName: "opacity", values: "1;.3;1", dur: ".7s", repeatCount: "indefinite" }, b); txt(g, 0, -20, "くうき", 18, { "text-anchor": "middle" }); }
  else if (id === "rope") { el("path", { d: `M${hx + 60} ${base - 200} Q${(hx + 300) / 2} ${base - 120} 300 ${base - 320}`, fill: "none", stroke: "#FFD25E", "stroke-width": 8, "stroke-dasharray": "14 8" }, G); }
  else if (id === "musen") { const g = el("g", { transform: `translate(${hx + 170} ${base - 400})` }, G); el("rect", { x: -20, y: -36, width: 40, height: 72, rx: 8, fill: "#3B3A44", ...S6(4) }, g); el("path", { d: "M0 -36 V-70", ...S6(4) }, g); const w = el("g", {}, g); let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; w.innerHTML = ""; for (let k = 0; k < 3; k++) el("path", { d: `M${20 + k * 20} ${-30 - k * 10} q10 10 0 20`, fill: "none", stroke: "#7FCBF0", "stroke-width": 4, opacity: ((t * 2 + k) % 3 < 1.5 ? 1 : .2) }, w); }); }
  else if (id === "nagasare") { const p = xtra("pyon", 1000, .7); p.sadMouth = true; let t = 0; addTick(dt => { if (!p.root.isConnected || !p.root.style.display === "none") return false; t += dt; if (t > 6) return false; place(p, 1000 + t * 90, 975 - 120 - Math.sin(t * 2) * 60, .7 * (1 - t * .05)); p.lean.t = Math.sin(t * 3) * 20; }); for (let i = 0; i < 4; i++) later(i * 500, () => markAbove(p, "drop")); }
  else if (id === "tabemono") { const j = el("g", { transform: `translate(${ax - 140} ${base - 280})` }, G); const b = el("path", { d: "M-40 0 Q-50 -60 0 -70 Q50 -60 40 0 Q0 20 -40 0 Z", fill: "#7FE0D0", ...S6(4), opacity: .9 }, j); el("animate", { attributeName: "d", values: "M-40 0 Q-50 -60 0 -70 Q50 -60 40 0 Q0 20 -40 0 Z;M-44 0 Q-40 -70 0 -62 Q40 -70 44 0 Q0 14 -44 0 Z;M-40 0 Q-50 -60 0 -70 Q50 -60 40 0 Q0 20 -40 0 Z", dur: "1.6s", repeatCount: "indefinite" }, b); for (let k = 0; k < 4; k++) later(k * 400, () => mark("sparkle", ax - 140 + (k - 2) * 20, base - 320, { vy: -60, life: .7, s: .4 })); }
  else if (id === "asobo") { later(800, () => { a.armL.t = 150; h.armR.t = -150; }); later(1400, () => { hold(a, "pump", 2); }); }
  else if (id === "kowai") { a.dx.v = a.dx.t = 0; const rk = ucRock(front(), 1330, 990, 2.8, 0); rk.setAttribute("data-rock", 1); later(200, () => { hold(a, "shiver", 4); a.sadMouth = true; }); }
  else if (id === "sayonara") { later(600, () => { hold(a, "wave", 3); a.armR.t = -150; later(3000, () => a.armR.t = 0); }); }
  return G; }
/* ---------- 💬 場面 ---------- */
function ucPick(area) { let pool = UC.sc.filter(s => s.area === area); const m = Math.min(...pool.map(s => UC_N.get(s.id) || 0)); pool = pool.filter(s => (UC_N.get(s.id) || 0) === m); return pool[rnd(pool.length)]; }
async function ucScene(pc) {
  const hero = pc.kind, sc = ucPick(nArea(pc.node)), t = tierOf(); UC_N.set(sc.id, (UC_N.get(sc.id) || 0) + 1);
  showEngine(null, `うちゅう たんけん（${sc.id}・段${t + 1}）`);
  UC_CUR = sc.id; const { hero: h, ask: a } = setSitView({ id: "uc_" + sc.id, place: sc.place, asker: sc.who, intro: "uc" }, hero);
  [C.pony, h, a].forEach(ucSuitOn);
  const late = sc.id === "kowai" || sc.id === "aisatsu"; if (!late) a.dx.v = a.dx.t = 0; // うちゅうじんは あとから でてくる
  if (sc.id === "kowai") { a.dx.v = a.dx.t = 0; place(a, 1330, 975, KID_S.gabo * .92); }
  enter(h); await sleep(900);
  if (!UC_N.get("_intro")) { UC_N.set("_intro", 1); await speak(C.pony, "ucp_intro", UC.txt.ucp_intro); }
  ucProp(sc, h, a);
  await speak(C.pony, `ucn_${sc.id}`, sc.n);
  if (["oto", "kuuki", "inseki", "nagasare", "michi", "ana"].includes(sc.id)) { h.sadMouth = true; playMove(h, "think"); }
  if (sc.id === "aisatsu") { enter(a); await sleep(1000); }
  if (sc.line) { playMove(a, "nod"); await speak(a, `ucw_${sc.id}`, sc.line); }
  let okN = 0, nSay = 0; const log = [];
  const step = async (key, text, keys, tag) => { nSay++; const r = await kmSay(h, key, text, keys, tag); if (r.ok) okN++; log.push(`${r.ok ? "○" : "×"}${r.heard}`); return r.ok; };
  await step(`ucs_${sc.id}`, sc.say, sc.keys, "まるシマに なって いおう");
  h.sadMouth = false;
  if (sc.res) { playMove(a, "nod"); if (sc.id === "kowai") { a.sadMouth = false; delete a.tm.shiver; a.dx.t = -330; hold(a, "run", .9); await sleep(1000); } await speak(a, `ucr_${sc.id}`, sc.res); }
  if (sc.id === "count") { shake(900, 14); if (ctx) noise(1.5, 300, .5); await sleep(900); }
  const t2 = sc.t2 && (t >= 1 || !sc.res) ? sc.t2 : null;
  if (t2) { if (t2.line) { playMove(a, "nod"); await speak(a, `ucw2_${sc.id}`, t2.line); }
    await step(`ucs2_${sc.id}`, t2.say, t2.keys, "つづけて いおう");
    if (t2.res) { joy(a); await speak(a, `ucr2_${sc.id}`, t2.res); } }
  const ok = okN * 2 >= nSay; grade(ok); GS.tasks++;
  playLog({ type: "uchu2", id: sc.id, tier: t, okN, nSay, tries: log, ...(MODE === "multi" ? { who: NAMES[hero] } : {}) });
  if (ok) { confetti(36); joy(h); const k = rnd(2) ? "ucp_ok" : "ucp_good"; await speak(C.pony, k, UC.txt[k]); }
  await sleep(400); setView("board"); return ok; }
Object.assign(LTASK_RUN, { us: ucScene });
// 場面に あとから でる ひと（xtra）にも うちゅうふく
{ const x0 = xtra; xtra = function (k, ...a) { const c = x0(k, ...a); if (curStage === "uchu2") ucSuitOn(c); return c; }; }
/* ---------- 声の パック ---------- */
{ const lp = loadPack; loadPack = async function (id) { const r = await lp(id); if (id !== "uchu2") return r;
    if (!PACK.loaded.uchu2) { try { const q = await fetch("packs/uchu2.json", { cache: "no-cache" }); if (q.ok) { const d = await q.json(); Object.keys(d).forEach(k => AUD[k] = "data:audio/mpeg;base64," + d[k]); PACK.loaded.uchu2 = Object.keys(d); } } catch (e) { } }
    if (AUD.bgm_uchu2) await voiceBuf("bgm_uchu2"); return true; }; }
/* ---------- メニューの タイルの 絵 ---------- */
if (typeof A2 !== "undefined") A2.uchu2 = (L, X) => { el("rect", { x: -200, y: 0, width: 880, height: 300, fill: "#0F1430" }, L); ucStars(L, 30, 2, 880, 300, false).setAttribute("transform", "translate(-200 0)");
  ucPlanetArt(L, X(.38), 90, 44); ucMoonArt(L, X(-.4), 70, 30); el("path", { d: "M-200 236 Q100 200 400 236 T680 236 V300 H-200 Z", fill: "#C9CBD6", ...S6(4) }, L);
  CH(L, "shima", X(-.2), .34, HAPPY); CH(L, "piko", X(.1), .3, HI); };
/* ---------- 手がきの アイコン ---------- */
Object.assign(ICON_DRAW, {
  "🫧": g => { [[-30, 10, 34], [30, -20, 26], [10, 40, 18]].forEach(([x, y, r]) => { IC.C(g, x, y, r, "#BFE3F2", 5); IC.C(g, x - r * .35, y - r * .35, r * .25, "#FFFFFF", 0); }); },
  "🕳": g => { IC.E(g, 0, 0, 90, 50, "#2A2550", 6); IC.E(g, 0, 0, 56, 30, "#0B0A16", 5); IC.P(g, "M-90 0 Q0 -70 90 0", "none", 4); },
  "🛰": g => { IC.R(g, -34, -24, 68, 48, "#DCE3EA", 5, 8); IC.R(g, -100, -14, 60, 28, "#3E7FD6", 4); IC.R(g, 40, -14, 60, 28, "#3E7FD6", 4); IC.C(g, 0, -50, 14, "#C9D3DE", 4); IC.C(g, 0, 0, 8, "#7BD389", 0); },
  "🛸": g => { IC.E(g, 0, 10, 95, 26, "#B9A8D9", 6); IC.P(g, "M-50 0 Q0 -70 50 0 Z", "#BDE3F2", 5); [-60, -30, 0, 30, 60].forEach((x, i) => IC.C(g, x, 20, 7, ["#FFD25E", "#FF8FA3", "#7FCBF0"][i % 3], 2)); IC.C(g, 0, -28, 14, "#8FE08A", 3); },
  "🌠": g => { IC.P(g, "M-95 60 L-20 -10", "none", 10); IC.P(g, "M-70 90 L-30 50", "none", 6); IC.P(g, "M20 -50 L32 -18 L66 -14 L40 8 L48 42 L20 24 L-8 42 L0 8 L-26 -14 L8 -18 Z", "#FFE27A", 6); },
  "🏜": g => { IC.P(g, "M-95 60 Q-40 0 0 50 Q40 100 95 40 V90 H-95 Z", "#C9CBD6", 6); IC.C(g, 40, -40, 26, "#FFD25E", 5); },
  "🌬": g => { IC.P(g, "M-90 -30 Q-20 -60 20 -30 Q60 0 10 10", "none", 10); IC.P(g, "M-90 30 Q0 0 50 30 Q90 60 40 70", "none", 10); IC.P(g, "M-70 0 H20", "none", 8); },
  "👽": g => { IC.E(g, 0, -10, 70, 80, "#8FE08A", 7); IC.E(g, -26, -16, 20, 26, "#1E2A3A", 0); IC.E(g, 26, -16, 20, 26, "#1E2A3A", 0); IC.P(g, "M-14 36 Q0 46 14 36", "none", 5); IC.P(g, "M-40 -80 Q-60 -110 -80 -120 M40 -80 Q60 -110 80 -120", "none", 7); IC.C(g, -84, -124, 10, "#FFE27A", 3); IC.C(g, 84, -124, 10, "#FFE27A", 3); },
  "☄": g => { IC.P(g, "M-100 70 Q-20 10 60 -60", "none", 14); IC.P(g, "M0 0 L40 -50 L20 -100 L-30 -90 L-50 -40 Z", "#8E929C", 6, 0); IC.P(g, "M-10 -40 l12 -18 M8 -60 l16 -6", "none", 4); },
});
