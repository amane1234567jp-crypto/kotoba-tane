/* ================= ロングコース「ゆうえんち」（yuen、2026-11-02） =================
   ちょうロングの しくみ（slong.js）の うえに のせる。48マス・4だん：① いりぐち・ひろば ② のりもの ③ おばけやしき・ショー ④ おみせ・かえりみち。
   💬 場面：ぽにーが ようすを はなす → あいてが いう → ぽにーの おてほんを まるシマに なって いう → あいての へんじ（段2〜は 2おうふくめ も）。
   🎡 かんらんしゃ ルーレット：まわる ゴンドラを タッチで とめて、でた かずだけ すすむ。
   しかけは ゆうえんちの もの（ジェットコースター・コーヒーカップ・メリーゴーランド・きしゃぽっぽ・フリーパス・ポップコーン・パレード）。
   データと 声：sit/yuen_gen.py → yuen_data.js・sit/pony_yuen.json・aivis/jobs/yu1 */
const YU_N = new Map(); let YU_CUR = "";
{ const ap = applyStage; applyStage = function (id, ...a) { if (id === "yuen") YU_N.clear(); return ap(id, ...a); }; }
/* ---------- マスの ならび（48） ---------- */
{ const PL = [null, "ys", "ys", "e:dice2", "ys", "yw", "ys", "e:warp", "ys", "e:kb1", "ys", "balloon",
    "e:rand", "ys", "ys", "e:again", "yw", "ys", "e:rest", "ys", "e:kf1", null, "ys", "ys",
    "e:trolley", "ys", "yw", "ys", "e:x2", "ys", "e:kb2", "ys", "balloon", "ys", "e:warp", "ys",
    "ys", "e:rand", "ys", "yw", "e:kf2", "ys", "ys", "e:again", "ys", "yw", "ys", null];
  const O = SL_ORDER.yuen, ev = {}, task = {};
  O.forEach((id, i) => { const p = PL[i]; if (!p || id === "0" || id === "4" || id === "15") return;
    if (p.startsWith("e:")) { const t = p.slice(2); ev[id] = [t, 0, `sl_yuen_${t}`, YU.evt[t]]; } else task[id] = p; });
  EVENTS.yuen = ev; LONG_TASKS.yuen = task;
  LEGENDS.yuen = [["ys", "おはなし"], ["yw", "かんらんしゃ"], ["balloon", "ふうせん"]]; }
SL_VEH.yuen = { warp: "🎢" };
Object.assign(LTASK, { ys: ["#FFE9D6", "💬"], yw: ["#D7ECFF", "🎡"] });
const YU_ICON = { dice2: "🍿", warp: "🎢", rand: "☕", again: "🎠", trolley: "🚂", x2: "🎟", rest: "⏳", kf1: "🎉", kf2: "🏎", kb1: "😢", kb2: "🌧" };
const YU_EVC = { warp: "#D9C2F0", rand: "#D9C2F0", kb1: "#FFC2D1", kb2: "#FFC2D1", kf1: "#C9EBB5", kf2: "#C9EBB5" };
{ const db = drawBoard; drawBoard = function () { db(); if (curStage !== "yuen") return;
    Object.entries(EVENTS.yuen).forEach(([id, [type]]) => { const [x, y] = NODES[id]; el("circle", { cx: x, cy: y, r: 36, fill: YU_EVC[type] || "#FFF1C9", ...S6(4) }, boardLayer); txt(boardLayer, x, y + 14, YU_ICON[type] || "★", 36, { "text-anchor": "middle" }); }); }; }
/* ---------- しかけ：パレード（+2）・まいご／あめ（-2）、コーヒーカップは カップが まわってから とぶ ---------- */
{ const be = boardEvent; boardEvent = async function (pc) {
    const ev = curStage === "yuen" && EVENTS.yuen[pc.node];
    if (!ev || (pc.player && pc.player.stay)) return be(pc);
    if (/^k[fb]/.test(ev[0])) { await sleep(300); markAbove(pc, ev[0][1] === "f" ? "heart" : "drop"); chime(); await slSay(ev[2], ev[3]); await slGo(pc, ev[0][1] === "f" ? 2 : -2); await sleep(300); return; }
    if (ev[0] === "rand") yuCup(pc);
    return be(pc); }; }
function yuCup(pc) { // コーヒーカップが あらわれて ぐるぐる
  const g = el("g", {}, boardLayer), x = pc.px, y = pc.py + 20; let t = 0;
  const cup = el("g", {}, g); el("ellipse", { cx: 0, cy: 30, rx: 80, ry: 20, fill: "#00000022" }, cup);
  el("path", { d: "M-70 -30 Q-70 40 0 40 Q70 40 70 -30 Z", fill: "#FF8FA3", ...S6(5) }, cup); el("ellipse", { cx: 0, cy: -30, rx: 70, ry: 18, fill: "#FFD9E0", ...S6(5) }, cup);
  el("path", { d: "M70 -14 Q100 -14 100 6 Q100 26 64 22", fill: "none", ...S6(7) }, cup); [-40, 0, 40].forEach(dx => el("circle", { cx: dx, cy: 10, r: 8, fill: "#FFFFFF", ...S6(3) }, cup));
  addTick(dt => { if (!g.isConnected) return false; t += dt; const k = Math.min(1, t / .3) * (t > 1.6 ? Math.max(0, 1 - (t - 1.6) / .3) : 1);
    cup.setAttribute("transform", `translate(${x} ${y}) scale(${(k * Math.cos(t * 9)).toFixed(3)} ${k.toFixed(3)})`); if (t > 1.95) { g.remove(); return false; } });
  for (let i = 0; i < 4; i++) later(i * 300, () => blip(500 + i * 120, 700 + i * 120, .08, "triangle")); }
/* ---------- 盤の え ---------- */
BOARD_BG.yuen = L => {
  const T = SL_TH.yuen; el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: T.ground }, L);
  // おくの けしき：かんらんしゃ・ジェットコースターの レール・サーカスの テント
  yuWheelArt(L, 1110, 225, 92, 0); yuCoaster(L, 230, 330, .9); yuTent(L, 860, 345, .7);
  const Y = [930, 765, 600, 435], I4 = ["🎟", "🎢", "👻", "🍦"];
  Y.forEach((y, r) => { el("rect", { x: 30, y: y - 70, width: 1540, height: 140, rx: 70, fill: T.fills[r], ...S6(4) }, L);
    const x = r === 3 ? 1520 : 80; txt(L, x, y + 6, I4[r], 46, { "text-anchor": "middle" }); txt(L, x, y + 44, T.areas[r], T.areas[r].length > 4 ? 15 : 18, { "text-anchor": "middle" }); });
  Object.entries(EVENTS.yuen || {}).forEach(([id, [type]]) => { const to = slWarpTo("yuen", id, type); if (!to || !NODES[id] || !NODES[to]) return; const [x1, y1] = NODES[id], [x2, y2] = NODES[to];
    el("path", { d: `M${x1} ${y1} Q${(x1 + x2) / 2 + 160} ${(y1 + y2) / 2} ${x2} ${y2}`, fill: "none", stroke: "#8E5BD6", "stroke-width": 6, "stroke-dasharray": "16 14", opacity: .6 }, L); });
  { const tg = el("g", { "data-top": 1 }, L); el("rect", { x: 960, y: 38, width: 440, height: 72, rx: 22, fill: "#E8735A", ...S6(5) }, tg); txt(tg, 1180, 86, `${T.icon} ${T.name}`, 32, { "text-anchor": "middle", fill: "#FFFFFF" }); } };
function yuWheelArt(L, cx, cy, R, rot = 0, vals) { // かんらんしゃ（vals が あれば ゴンドラに かず を かく）
  const g = el("g", {}, L); el("path", { d: `M${cx - R * .55} ${cy + R * 1.45} L${cx} ${cy} L${cx + R * .55} ${cy + R * 1.45}`, fill: "none", ...S6(Math.max(4, R / 22)) }, g);
  const w = el("g", { transform: `rotate(${rot} ${cx} ${cy})` }, g); el("circle", { cx, cy, r: R, fill: "none", stroke: "#E8473C", "stroke-width": Math.max(6, R / 12) }, w); el("circle", { cx, cy, r: R, fill: "none", ...S6(Math.max(3, R / 40)) }, w);
  const n = 8, C8 = ["#FF8FA3", "#FFD25E", "#7FCBF0", "#7BD389", "#B9A8D9", "#FFB36B", "#7FCBF0", "#FF8FA3"], gs = [];
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; el("path", { d: `M${cx} ${cy} L${cx + Math.cos(a) * R} ${cy + Math.sin(a) * R}`, ...S6(Math.max(2, R / 50)) }, w); }
  el("circle", { cx, cy, r: R * .12, fill: "#FFD25E", ...S6(Math.max(3, R / 40)) }, w);
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 - Math.PI / 2, gx = cx + Math.cos(a) * R, gy = cy + Math.sin(a) * R, s = R / 120;
    const go = el("g", { transform: `translate(${gx} ${gy}) rotate(${-rot})` }, w);
    el("rect", { x: -34 * s, y: 4 * s, width: 68 * s, height: 56 * s, rx: 16 * s, fill: C8[i], ...S6(Math.max(3, 4 * s)) }, go); el("path", { d: `M0 ${-4 * s} V${6 * s}`, ...S6(Math.max(2, 4 * s)) }, go);
    if (vals) { el("rect", { x: -26 * s, y: 10 * s, width: 52 * s, height: 44 * s, rx: 8 * s, fill: "#FFFFFF", ...S6(Math.max(2, 3 * s)) }, go); txt(go, 0, 46 * s, String(vals[i]), 36 * s, { "text-anchor": "middle" }); }
    else el("rect", { x: -22 * s, y: 14 * s, width: 44 * s, height: 20 * s, rx: 6 * s, fill: "#FFFFFF", ...S6(Math.max(2, 3 * s)) }, go);
    gs.push(go); }
  return { g, w, gs }; }
function yuCoaster(L, x, y, s = 1) { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L);
  const d = "M0 0 Q80 -150 160 -40 Q220 40 290 -60 Q330 -120 370 -120 Q430 -120 460 -20 Q480 30 540 30";
  for (let i = 0; i <= 10; i++) { const px = i * 54; el("path", { d: `M${px} ${40} V${-40 + Math.sin(i * .8) * 30}`, stroke: "#C9B8A8", "stroke-width": 6 }, g); }
  el("path", { d, fill: "none", stroke: "#E8473C", "stroke-width": 14 }, g); el("path", { d, fill: "none", ...S6(4) }, g);
  el("rect", { x: 330, y: -150, width: 70, height: 34, rx: 10, fill: "#FFD25E", ...S6(4), transform: "rotate(-8 365 -133)" }, g); return g; }
function yuTent(L, x, y, s = 1) { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L);
  el("path", { d: "M-150 60 L-150 -20 L0 -140 L150 -20 L150 60 Z", fill: "#FFF4E0", ...S6(5) }, g);
  for (let i = 0; i < 6; i++) el("path", { d: `M0 -140 L${-150 + i * 60} -20 L${-120 + i * 60} -20 Z`, fill: i % 2 ? "#FFFFFF" : "#E8473C" }, g);
  el("path", { d: "M-150 -20 L0 -140 L150 -20 Z", fill: "none", ...S6(5) }, g); el("path", { d: "M0 -140 V-180 L40 -168 L0 -156", fill: "#7BD389", ...S6(4) }, g);
  el("path", { d: "M-30 60 V0 Q0 -24 30 0 V60", fill: "#2B2A33" }, g); return g; }
/* ---------- 場面の はいけい（ゆうえんちの ばしょ） ---------- */
function yuSky(L, sky = "#CFEAFB", ground = "#E9DCC2") { outBase(L, sky, ground); for (let x = 0; x < 1600; x += 120) el("path", { d: `M${x} 760 L${x - 60} 1000`, stroke: "#00000010", "stroke-width": 4 }, L); }
function yuFlags(L, y = 150) { el("path", { d: `M0 ${y} Q400 ${y + 60} 800 ${y} T1600 ${y}`, fill: "none", ...S6(3) }, L);
  for (let i = 0; i < 16; i++) { const x = 50 + i * 100, yy = y + 30 * Math.sin((x / 1600) * Math.PI * 2 + Math.PI) * -.9 + 20; el("path", { d: `M${x - 22} ${yy - 14} L${x + 22} ${yy - 14} L${x} ${yy + 26} Z`, fill: ["#FF8FA3", "#FFD25E", "#7FCBF0", "#7BD389"][i % 4], ...S6(3) }, L); } }
function yuSign(L, x, y, w, text, fill = "#FFFFFF", size = 40) { el("rect", { x: x - w / 2, y, width: w, height: size * 1.7, rx: 16, fill, ...S6(5) }, L); txt(L, x, y + size * 1.2, text, size, { "text-anchor": "middle" }); }
function yuTree(L, x, y = 760, s = 1) { tree8(L, x, y, s); }
function yuBench(L, x, y = 760) { el("rect", { x: x - 120, y: y - 70, width: 240, height: 24, rx: 8, fill: "#C98A4B", ...S6(5) }, L); el("rect", { x: x - 120, y: y - 120, width: 240, height: 20, rx: 8, fill: "#C98A4B", ...S6(5) }, L); el("path", { d: `M${x - 100} ${y - 46} V${y} M${x + 100} ${y - 46} V${y}`, ...S6(7) }, L); }
function yuRope(L, x1, x2, y = 700) { for (let x = x1; x <= x2; x += 220) { el("rect", { x: x - 8, y: y - 60, width: 16, height: 120, rx: 6, fill: "#C9B8A8", ...S6(4) }, L); el("circle", { cx: x, cy: y - 64, r: 12, fill: "#FFD25E", ...S6(3) }, L); }
  for (let x = x1; x < x2; x += 220) el("path", { d: `M${x} ${y - 50} Q${x + 110} ${y - 10} ${x + 220} ${y - 50}`, fill: "none", stroke: "#E8473C", "stroke-width": 10 }, L); }
const ROOMS_YU = {
  ゲート(L) { yuSky(L, "#CFEAFB", "#E9DCC2"); yuFlags(L, 180);
    // いりぐちの アーチ
    el("rect", { x: 300, y: 260, width: 70, height: 500, fill: "#FFB36B", ...S6(6) }, L); el("rect", { x: 1230, y: 260, width: 70, height: 500, fill: "#FFB36B", ...S6(6) }, L);
    el("path", { d: "M260 300 Q800 120 1340 300 L1340 380 Q800 200 260 380 Z", fill: "#E8735A", ...S6(6) }, L); txt(L, 800, 310, "ゆうえんち", 70, { "text-anchor": "middle", fill: "#FFFFFF" });
    for (let i = 0; i < 9; i++) el("circle", { cx: 330 + i * 117, cy: 360 - Math.sin(i / 8 * Math.PI) * 120, r: 12, fill: "#FFE27A", ...S6(3) }, L);
    // チケット うりば（みぎ）
    el("rect", { x: 1350, y: 420, width: 230, height: 340, fill: "#FFF4E0", ...S6(6) }, L); el("rect", { x: 1380, y: 470, width: 170, height: 110, rx: 10, fill: "#BDE3F2", ...S6(5) }, L); yuSign(L, 1465, 400, 220, "チケット", "#FFD25E", 34);
    yuWheelArt(L, 760, 470, 150, 10); },
  ひろば(L) { yuSky(L, "#CFEAFB", "#E9DCC2"); yuFlags(L, 140);
    yuWheelArt(L, 1240, 380, 200, 0); yuCoaster(L, 60, 560, .8); yuTree(L, 160, 760, .8); yuTree(L, 1500, 760, .8);
    // ふんすい
    el("ellipse", { cx: 800, cy: 740, rx: 200, ry: 40, fill: "#7FCBF0", ...S6(5) }, L); el("rect", { x: 780, y: 600, width: 40, height: 130, fill: "#B0B6C3", ...S6(4) }, L);
    el("path", { d: "M800 600 Q740 560 700 640 M800 600 Q860 560 900 640", fill: "none", stroke: "#7FCBF0", "stroke-width": 10 }, L);
    yuBench(L, 480, 760); },
  のりば(L) { yuSky(L, "#CFEAFB", "#E3D3B8");
    yuCoaster(L, 520, 420, 1.6);
    // のりばの やね
    el("rect", { x: 60, y: 300, width: 520, height: 40, rx: 12, fill: "#7FCBF0", ...S6(5) }, L); el("path", { d: "M90 340 V760 M550 340 V760", ...S6(8) }, L);
    // ねんれいの かんばん（「8さいから」の 場面だけ）
    if (YU_CUR === "nenrei") { el("rect", { x: 1260, y: 380, width: 270, height: 210, rx: 18, fill: "#FFFFFF", ...S6(6) }, L); txt(L, 1395, 455, "この のりものは", 30, { "text-anchor": "middle" }); txt(L, 1395, 535, "8さい から", 54, { "text-anchor": "middle", fill: "#E8473C" });
    el("path", { d: "M1395 590 V760", ...S6(10) }, L); } },
  ぎょうれつ(L) { yuSky(L, "#CFEAFB", "#E3D3B8"); yuCoaster(L, 300, 420, 1.4);
    yuSign(L, 1280, 300, 380, "まちじかん 60ぷん", "#FFF4E0", 38); el("path", { d: "M1280 368 V520", ...S6(8) }, L);
    yuRope(L, 120, 1520, 720); },
  メリーゴーランド(L) { yuSky(L, "#FFE9F2", "#E9DCC2"); yuFlags(L, 120);
    const cx = 1000; el("path", { d: `M${cx - 420} 330 L${cx} 180 L${cx + 420} 330 Z`, fill: "#FF8FA3", ...S6(6) }, L); for (let i = 0; i < 7; i++) el("path", { d: `M${cx} 180 L${cx - 420 + i * 140} 330`, ...S6(3) }, L);
    el("path", { d: `M${cx} 180 V150`, ...S6(6) }, L); el("circle", { cx, cy: 140, r: 16, fill: "#FFD25E", ...S6(4) }, L); el("rect", { x: cx - 420, y: 330, width: 840, height: 34, fill: "#FFD25E", ...S6(5) }, L);
    el("ellipse", { cx, cy: 720, rx: 440, ry: 50, fill: "#FFF4E0", ...S6(6) }, L);
    [[cx - 300, 560, "#FFFFFF"], [cx, 520, "#FFD9A0"], [cx + 300, 560, "#D9E8FF"]].forEach(([x, y, c]) => { el("path", { d: `M${x} 364 V700`, stroke: "#FFD25E", "stroke-width": 12 }, L); el("path", { d: `M${x} 364 V700`, ...S6(3) }, L); yuHorse(L, x, y, c); }); },
  おばけやしき(L) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#3B3355" }, L); el("circle", { cx: 1420, cy: 130, r: 60, fill: "#FFF6C8", ...S6(5) }, L); el("circle", { cx: 1445, cy: 115, r: 54, fill: "#3B3355" }, L);
    el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#5A4E6E" }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L);
    // やかた
    el("rect", { x: 380, y: 250, width: 840, height: 510, fill: "#6E5E86", ...S6(6) }, L); el("path", { d: "M330 260 L800 80 L1270 260 Z", fill: "#4A3E60", ...S6(6) }, L);
    [[460, 330], [1040, 330]].forEach(([x, y]) => { el("rect", { x, y, width: 100, height: 120, rx: 8, fill: "#FFE27A", ...S6(5) }, L); el("path", { d: `M${x + 50} ${y} V${y + 120} M${x} ${y + 60} H${x + 100}`, ...S6(4) }, L); });
    el("path", { d: "M700 760 V560 Q800 480 900 560 V760", fill: "#2B2A33", ...S6(6) }, L); yuSign(L, 800, 420, 300, "おばけやしき", "#FFFFFF", 34);
    yuGhost(L, 230, 420, .9); yuGhost(L, 1380, 520, .7); },
  ショー(L) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFE3B3" }, L); el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#C98A4B" }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L);
    // ステージと まく
    el("rect", { x: 200, y: 180, width: 1200, height: 420, fill: "#7FCBF0", ...S6(6) }, L); el("rect", { x: 200, y: 560, width: 1200, height: 60, fill: "#E9B872", ...S6(6) }, L);
    el("path", { d: "M200 180 Q260 400 200 600 Z M1400 180 Q1340 400 1400 600 Z", fill: "#E8473C", ...S6(5) }, L); el("path", { d: "M200 180 H1400 V240 Q800 300 200 240 Z", fill: "#E8473C", ...S6(5) }, L);
    yuSign(L, 800, 280, 300, "ショー", "#FFFFFF", 44); [520, 1080].forEach(x => { el("circle", { cx: x, cy: 420, r: 34, fill: "#FFE27A", ...S6(4) }, L); });
    // ざせき
    for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) { const x = 160 + i * 240 + r * 60, y = 690 + r * 50; el("rect", { x, y: y - 40, width: 150, height: 34, rx: 10, fill: "#FF8FA3", ...S6(4) }, L); } },
  ばいてん(L) { yuSky(L, "#CFEAFB", "#E9DCC2"); yuFlags(L, 120);
    el("rect", { x: 900, y: 300, width: 660, height: 460, fill: "#FFF4E0", ...S6(6) }, L); for (let k = 0; k < 8; k++) el("rect", { x: 900 + k * 82.5, y: 260, width: 82.5, height: 70, fill: k % 2 ? "#FFFFFF" : "#7BD389" }, L); el("rect", { x: 900, y: 260, width: 660, height: 70, fill: "none", ...S6(5) }, L);
    yuSign(L, 1230, 350, 360, "ばいてん", "#FFFFFF", 38); el("rect", { x: 880, y: 600, width: 700, height: 160, fill: "#C98A4B", ...S6(6) }, L);
    // しなもの：ソフトクリーム・ポップコーン・ぬいぐるみ
    [[990, "#FFF6E0"], [1070, "#7A4A2B"], [1150, "#FFC2D9"]].forEach(([x, c]) => { el("path", { d: `M${x - 22} 540 L${x} 590 L${x + 22} 540 Z`, fill: "#E9B872", ...S6(4) }, L); el("path", { d: `M${x - 26} 540 Q${x - 26} 500 ${x} 490 Q${x + 26} 500 ${x + 26} 540 Z`, fill: c, ...S6(4) }, L); });
    el("rect", { x: 1240, y: 500, width: 90, height: 100, rx: 8, fill: "#E8473C", ...S6(4) }, L); for (let i = 0; i < 6; i++) el("circle", { cx: 1255 + (i % 3) * 30, cy: 495 - Math.floor(i / 3) * 18, r: 16, fill: "#FFF6C8", ...S6(3) }, L);
    yuPanda(L, 1440, 560, .55); yuPanda(L, 1510, 580, .4); },
  でぐち(L) { yuSky(L, "#FFC9A0", "#E9DCC2"); el("circle", { cx: 1460, cy: 110, r: 56, fill: "#FF8A5B", ...S6(5) }, L);
    el("rect", { x: 300, y: 260, width: 70, height: 500, fill: "#FFB36B", ...S6(6) }, L); el("rect", { x: 1230, y: 260, width: 70, height: 500, fill: "#FFB36B", ...S6(6) }, L);
    el("path", { d: "M260 300 Q800 120 1340 300 L1340 380 Q800 200 260 380 Z", fill: "#E8735A", ...S6(6) }, L); txt(L, 800, 310, "また きてね", 64, { "text-anchor": "middle", fill: "#FFFFFF" });
    yuWheelArt(L, 800, 480, 150, 20); },
};
function yuHorse(L, x, y, c) { const g = el("g", { transform: `translate(${x} ${y})` }, L);
  el("path", { d: "M-80 0 Q-80 -50 -20 -50 H50 Q70 -50 80 -80 L110 -70 Q105 -30 80 -10 Q70 30 40 30 H-50 Q-80 30 -80 0 Z", fill: c, ...S6(5) }, g);
  el("path", { d: "M-60 28 L-80 80 M-20 28 L-30 80 M20 28 L30 80 M50 28 L70 76", ...S6(7) }, g); el("path", { d: "M60 -60 Q40 -90 10 -60", fill: "#FFD25E", ...S6(4) }, g);
  el("circle", { cx: 90, cy: -64, r: 5, fill: INK }, g); el("rect", { x: -30, y: -62, width: 50, height: 16, rx: 6, fill: "#E8473C", ...S6(3) }, g); }
function yuGhost(L, x, y, s = 1) { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L);
  el("path", { d: "M-70 60 V-20 Q-70 -100 0 -100 Q70 -100 70 -20 V60 L45 40 L20 60 L-5 40 L-30 60 L-50 40 Z", fill: "#FFFFFF", ...S6(5) }, g);
  el("ellipse", { cx: -24, cy: -30, rx: 10, ry: 14, fill: INK }, g); el("ellipse", { cx: 24, cy: -30, rx: 10, ry: 14, fill: INK }, g); el("ellipse", { cx: 0, cy: 6, rx: 14, ry: 10, fill: INK }, g); return g; }
function yuPanda(L, x, y, s = 1) { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L);
  el("ellipse", { cx: 0, cy: 40, rx: 60, ry: 56, fill: "#FFFFFF", ...S6(5) }, g); [[-50, -60], [50, -60]].forEach(([dx, dy]) => el("circle", { cx: dx, cy: dy, r: 22, fill: INK }, g));
  el("circle", { cx: 0, cy: -30, r: 54, fill: "#FFFFFF", ...S6(5) }, g); [[-20, -34], [20, -34]].forEach(([dx, dy]) => { el("ellipse", { cx: dx, cy: dy, rx: 14, ry: 18, fill: INK }, g); el("circle", { cx: dx, cy: dy - 2, r: 5, fill: "#FFFFFF" }, g); });
  el("ellipse", { cx: 0, cy: -10, rx: 8, ry: 6, fill: INK }, g); return g; }
{ const dr = drawRoom; drawRoom = function (place, noSign = false) {
    if (curStage !== "yuen" || !ROOMS_YU[place]) return dr(place, noSign);
    sceneLayer.innerHTML = ""; ROOMS_YU[place](sceneLayer);
    if (!noSign && !["ゲート", "でぐち", "ショー", "ばいてん", "おばけやしき"].includes(place)) { const g = el("g", {}, sceneLayer); el("rect", { x: 620, y: 24, width: 360, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, place.length > 6 ? 38 : 46, { "text-anchor": "middle" }); } }; }
/* ---------- 場面の 小道具（ことばと 絵を あわせる） ---------- */
function yuProp(sc, h, a) {
  const G = el("g", {}, propG), hx = h.x + 200 * h.s, ax = a ? a.x + 200 * a.s : 1200, base = 975;
  const id = sc.id;
  if (id === "nyujo") { yuTicket(G, hx + 130, base - 330); }
  else if (id === "chizu") { const m = el("g", { transform: `translate(${ax - 160} ${base - 360})` }, G); el("rect", { x: -70, y: -50, width: 140, height: 100, rx: 8, fill: "#FFF6E0", ...S6(4) }, m); el("path", { d: "M-50 20 Q-10 -30 20 10 T60 -20", fill: "none", stroke: "#E8473C", "stroke-width": 6, "stroke-dasharray": "10 8" }, m); el("circle", { cx: 50, cy: -26, r: 10, fill: "#7BD389", ...S6(3) }, m); }
  else if (id === "nodo") { for (let i = 0; i < 3; i++) later(i * 500, () => markAbove(h, "drop", { dx: i % 2 ? 40 : -40 })); }
  else if (id === "fuusen") { const b = el("g", {}, G); el("ellipse", { cx: 0, cy: 0, rx: 46, ry: 56, fill: "#FF6F91", ...S6(4) }, b); el("path", { d: "M0 56 Q-14 100 6 140 Q20 170 0 200", fill: "none", ...S6(3) }, b);
    let t = 0; addTick(dt => { if (!b.isConnected) return false; t += dt; b.setAttribute("transform", `translate(${(hx + 80 + Math.sin(t * 2) * 30).toFixed(0)} ${(base - 520 - t * 160).toFixed(0)})`); if (t > 4) return false; }); }
  else if (id === "ice" || id === "omiyage") { /* ばいてんの たなに しなものが ある */ }
  else if (id === "maigo" || id === "tsunagu") { /* ひとごみ */ for (let i = 0; i < 4; i++) { const x = 300 + i * 340, g = el("g", { transform: `translate(${x} 760) scale(.9)`, opacity: .5 }, sceneLayer.firstChild ? sceneLayer : G); el("circle", { cx: 0, cy: -170, r: 34, fill: "#C9B8A8" }, g); el("path", { d: "M-40 0 V-110 Q-40 -136 0 -136 Q40 -136 40 -110 V0 Z", fill: "#C9B8A8" }, g); } }
  else if (id === "kurai") { const d = el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#000000", opacity: .45, "pointer-events": "none" }, G); yuGhost(G, 1350, 420, .8); }
  else if (id === "shashin") { const c = el("g", { transform: `translate(${hx + 140} ${base - 380})` }, G); el("rect", { x: -40, y: -26, width: 80, height: 52, rx: 8, fill: "#2B2A33" }, c); el("circle", { cx: 0, cy: 0, r: 16, fill: "#7FCBF0", ...S6(3) }, c); }
  else if (id === "mienai") { // まえに せの たかい おとなが たって いて、ステージが かくれる（うしろすがた）
    const g = el("g", { transform: `translate(${hx + 230} ${base - 10})` }, G); el("path", { d: "M-120 0 V-330 Q-120 -400 0 -400 Q120 -400 120 -330 V0 Z", fill: "#6E7FA8", ...S6(6) }, g);
    el("circle", { cx: 0, cy: -470, r: 80, fill: "#5A4030", ...S6(6) }, g); el("ellipse", { cx: 0, cy: -530, rx: 120, ry: 30, fill: "#3E4A6E", ...S6(5) }, g); el("path", { d: "M-80 -540 Q-80 -610 0 -610 Q80 -610 80 -540 Z", fill: "#3E4A6E", ...S6(5) }, g); }
  return G; }
function yuTicket(G, x, y) { const t = el("g", { transform: `translate(${x} ${y}) rotate(-12)` }, G); el("rect", { x: -60, y: -30, width: 120, height: 60, rx: 8, fill: "#FFD25E", ...S6(4) }, t); el("path", { d: "M-20 -30 V30", stroke: INK, "stroke-width": 3, "stroke-dasharray": "6 6" }, t); txt(t, 18, 12, "★", 30, { "text-anchor": "middle" }); }
/* ---------- 💬 場面 ---------- */
function yuPick(area) { let pool = YU.sc.filter(s => s.area === area); const m = Math.min(...pool.map(s => YU_N.get(s.id) || 0)); pool = pool.filter(s => (YU_N.get(s.id) || 0) === m); return pool[rnd(pool.length)]; }
async function yuScene(pc) {
  const hero = pc.kind, sc = yuPick(nArea(pc.node)), t = tierOf(); YU_N.set(sc.id, (YU_N.get(sc.id) || 0) + 1);
  showEngine(null, `ゆうえんち（${sc.id}・段${t + 1}）`);
  YU_CUR = sc.id; const { hero: h, ask: a } = setSitView({ id: "yu_" + sc.id, place: sc.place, asker: sc.who, intro: "yu" }, hero); a.dx.v = a.dx.t = 0;
  enter(h); await sleep(900);
  if (!YU_N.get("_intro")) { YU_N.set("_intro", 1); await speak(C.pony, "yup_intro", YU.txt.yup_intro); }
  yuProp(sc, h, a);
  await speak(C.pony, `yun_${sc.id}`, sc.n);
  if (["toilet", "nodo", "tsukare", "kowai", "fuusen", "yoi", "maigo", "kurai", "mienai"].includes(sc.id)) { h.sadMouth = true; playMove(h, "think"); }
  if (sc.line) { playMove(a, "nod"); await speak(a, `yuw_${sc.id}`, sc.line); }
  let okN = 0, nSay = 0; const log = [];
  const step = async (key, text, keys, tag) => { nSay++; const r = await kmSay(h, key, text, keys, tag); if (r.ok) okN++; log.push(`${r.ok ? "○" : "×"}${r.heard}`); return r.ok; };
  await step(`yus_${sc.id}`, sc.say, sc.keys, "まるシマに なって いおう");
  h.sadMouth = false;
  if (sc.res) { playMove(a, "nod"); await speak(a, `yur_${sc.id}`, sc.res); }
  const t2 = sc.t2 && t >= 1 && !(sc.id === "maigo" && hero !== "shima") ? sc.t2 : (sc.t2 && !sc.res ? sc.t2 : null); // へんじの ない 場面（seki・ice）は いつも 2おうふくめ まで
  if (t2) { if (t2.line) { playMove(a, "nod"); await speak(a, `yuw2_${sc.id}`, t2.line); }
    await step(`yus2_${sc.id}`, t2.say, t2.keys, "つづけて いおう");
    if (t2.res) { joy(a); await speak(a, `yur2_${sc.id}`, t2.res); } }
  const ok = okN * 2 >= nSay; grade(ok); GS.tasks++;
  playLog({ type: "yuen", id: sc.id, tier: t, okN, nSay, tries: log, ...(MODE === "multi" ? { who: NAMES[hero] } : {}) });
  if (ok) { confetti(36); joy(h); const k = rnd(2) ? "yup_ok" : "yup_good"; await speak(C.pony, k, YU.txt[k]); }
  await sleep(400); setView("board"); return ok; }
/* ---------- 🎡 かんらんしゃ ルーレット ---------- */
async function yuWheel(pc) {
  const g = panel("かんらんしゃ ルーレット", "#EAF6FF"), V = [1, 2, 3, "🍿", 1, 4, 2, 3];
  const cx = 800, cy = 470, R = 250; const art = yuWheelArt(g, cx, cy, R, 0, V);
  el("path", { d: `M${cx - 34} ${cy - R - 120} L${cx + 34} ${cy - R - 120} L${cx} ${cy - R - 62} Z`, fill: "#E8473C", ...S6(5) }, g); // いちばん うえの ゴンドラが あたり
  await speak(C.pony, "yup_wheel", YU.txt.yup_wheel);
  let ang = 0, sp = 150, stopping = false, done = false, tick = 0;
  const hit = el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#00000001", style: "cursor:pointer" }, g);
  const fin = new Promise(res => { addTick(dt => { if (!g.isConnected) return false; if (stopping) sp = Math.max(0, sp - 70 * dt); ang = (ang + sp * dt) % 360;
      art.w.setAttribute("transform", `rotate(${ang.toFixed(1)} ${cx} ${cy})`); art.gs.forEach(go => { const tr = go.getAttribute("transform").replace(/rotate\([^)]*\)/, `rotate(${(-ang).toFixed(1)})`); go.setAttribute("transform", tr); });
      tick += sp * dt; if (tick > 45) { tick = 0; blip(700, 760, .03, "triangle"); } if (stopping && sp === 0 && !done) { done = true; res(); return false; } }); });
  hit.onclick = () => { hit.onclick = null; stopping = true; }; later(9000, () => { stopping = true; });
  await fin; const idx = Math.round(((360 - ang) % 360) / 45) % 8, v = V[idx];
  { const go = art.gs[idx], ring = el("rect", { x: -44 * R / 120, y: -6 * R / 120, width: 88 * R / 120, height: 76 * R / 120, rx: 22 * R / 120, fill: "none", stroke: "#FFD25E", "stroke-width": 12 }, go); go.insertBefore(ring, go.firstChild); }
  markAbove(pc, "sparkle"); chime(); await sleep(1000); g.remove();
  if (v === "🍿") { slFlag(pc, "dice2"); await speak(C.pony, "yup_wheel_d2", YU.txt.yup_wheel_d2); } else await slMove(pc, v);
  return false; }
Object.assign(LTASK_RUN, { ys: yuScene, yw: yuWheel });
/* ---------- 声の パック ---------- */
{ const lp = loadPack; loadPack = async function (id) { const r = await lp(id); if (id !== "yuen") return r;
    if (!PACK.loaded.yuen) { try { const q = await fetch("packs/yuen.json", { cache: "no-cache" }); if (q.ok) { const d = await q.json(); Object.keys(d).forEach(k => AUD[k] = "data:audio/mpeg;base64," + d[k]); PACK.loaded.yuen = Object.keys(d); } } catch (e) { } }
    if (AUD.bgm_yuen) await voiceBuf("bgm_yuen"); return true; }; }
/* ---------- メニューの タイルの 絵 ---------- */
if (typeof A2 !== "undefined") A2.yuen = (L, X) => { PR2.out(L, ...SKY, "#E9DCC2", 226); yuWheelArt(L, X(.3), 130, 66, 0); yuCoaster(L, X(-.5), 175, .42); CH(L, "shima", X(-.22), .34, HAPPY); CH(L, "pony", X(.04), .3, HI); };
/* ---------- 手がきの アイコン（ゆうえんちの しかけ） ---------- */
Object.assign(ICON_DRAW, {
  "🎢": g => { IC.P(g, "M-100 60 Q-40 -80 20 0 Q60 50 100 -40", "none", 8); IC.R(g, -50, -40, 100, 50, "#E8473C", 14); IC.C(g, -26, 18, 14, "#2B2A33", 0); IC.C(g, 26, 18, 14, "#2B2A33", 0); IC.R(g, -34, -58, 68, 22, "#FFD25E", 8); },
  "🎡": g => { IC.P(g, "M-50 95 L0 0 L50 95", "none", 7); IC.C(g, 0, 0, 72, "none"); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; IC.P(g, `M0 0 L${Math.cos(a) * 72} ${Math.sin(a) * 72}`, "none", 3); IC.R(g, Math.cos(a) * 72 - 14, Math.sin(a) * 72 - 6, 28, 22, ["#FF8FA3", "#FFD25E", "#7FCBF0", "#7BD389"][i % 4], 6, 4); } IC.C(g, 0, 0, 12, "#FFD25E"); },
  "☕": g => { IC.P(g, "M-80 -40 Q-80 60 0 60 Q80 60 80 -40 Z", "#FF8FA3", 7); IC.E(g, 0, -40, 80, 22, "#FFD9E0", 6); IC.P(g, "M80 -20 Q115 -20 115 5 Q115 32 74 28", "none", 8); [-40, 0, 40].forEach(x => IC.C(g, x, 14, 10, "#FFFFFF", 4)); },
  "🎠": g => { IC.P(g, "M-90 -40 L0 -95 L90 -40 Z", "#FF8FA3", 6); IC.P(g, "M0 -40 V60", "none", 7); IC.P(g, "M-60 30 Q-60 0 -20 0 H30 Q45 0 50 -20 L70 -14 Q66 10 50 20 Q44 40 20 40 H-40 Q-60 40 -60 30 Z", "#FFFFFF", 6); IC.R(g, -95, 70, 190, 18, "#FFD25E", 6); },
  "🚂": g => { IC.R(g, -90, -30, 120, 80, "#E8473C", 10); IC.R(g, -70, -70, 50, 44, "#7FCBF0", 6); IC.R(g, 30, 0, 60, 50, "#2B2A33", 8); IC.P(g, "M60 0 V-50 H80 V0", "#2B2A33", 6); IC.C(g, -60, 60, 20, "#2B2A33", 0); IC.C(g, 0, 60, 20, "#2B2A33", 0); IC.C(g, 60, 60, 20, "#2B2A33", 0); },
  "🍿": g => { IC.P(g, "M-60 -20 L-45 95 H45 L60 -20 Z", "#E8473C", 6); IC.P(g, "M-20 -20 L-14 95 M20 -20 L14 95", "none", 0); [-25, 0, 25].forEach(x => IC.P(g, `M${x - 6} -20 L${x - 4} 95`, "none", 0)); [[-40, -40], [-10, -55], [20, -45], [45, -30], [-25, -70], [10, -80]].forEach(([x, y]) => IC.C(g, x, y, 24, "#FFF6C8", 5)); },
  "👻": g => { IC.P(g, "M-70 80 V-10 Q-70 -95 0 -95 Q70 -95 70 -10 V80 L45 60 L20 80 L-5 60 L-30 80 L-50 60 Z", "#FFFFFF", 7); IC.E(g, -24, -20, 11, 15, "#2B2A33", 0); IC.E(g, 24, -20, 11, 15, "#2B2A33", 0); IC.E(g, 0, 18, 14, 10, "#2B2A33", 0); },
  "🏎": g => { IC.P(g, "M-95 30 Q-90 -10 -40 -14 L-10 -44 H40 L70 -14 Q95 -10 95 30 Z", "#FFD25E", 7); IC.C(g, -50, 40, 24, "#2B2A33", 0); IC.C(g, 50, 40, 24, "#2B2A33", 0); IC.R(g, -2, -38, 34, 22, "#BDE3F2", 4, 4); },
  "⏳": g => { IC.R(g, -60, -95, 120, 20, "#C98A4B", 6); IC.R(g, -60, 75, 120, 20, "#C98A4B", 6); IC.P(g, "M-45 -75 Q-45 -10 0 0 Q-45 10 -45 75 H45 Q45 10 0 0 Q45 -10 45 -75 Z", "#FFFFFF", 6); IC.P(g, "M-25 60 Q0 30 25 60 Z M-20 -55 Q0 -30 20 -55 Z", "#F2B01E", 0); },
});
