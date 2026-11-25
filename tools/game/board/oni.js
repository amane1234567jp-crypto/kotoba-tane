/* ================= ロングコース「おにごっこ」（oni、2026-11-24） =================
   あまねさん：リアルに おにの キャラが おいかけて くる コース。おにも サイコロを ふって、でた めの かずだけ すすむ。
   おいつかれた ひとは おにの かなぼうで ぽかーん！ 1かい やすみ。会話は ぜんぶ おにとの きょうそうに かかわる 形。
   ・おにの ばん：みんなが 1かいずつ ふったら（ラウンドの おわり）おにが ふる。1ラウンドめは「10 かぞえる」だけ。
     すすむ とちゅうで だれかに おいついたら そこで とまって ぽかーん → その ひとは 1かい やすみ（pl.rest）。くさむらに かくれて いる ひとは みつからない。
     おにが おにがしまの まえまで いったら、つぎの ばんに また ふりだしから。
   ・しかけ：🍡 きびだんご（もう1かい）・🐕 いぬ（ひっぱって 2マス）・🐦 きじ（とんで 3マス）・🐒 さる（つぎ 2ばい）・🎌 はちまき（サイコロ 2こ）
     ・🍑 もも（どんぶらこ ワープ）・🌿 くさむら（やすみ・おにに みつからない）・🕳 おとしあな（6マス もどる）・👹 おにの ぐんだん（3マス もどる）
     ・🚩 ももたろう ぐんだん（おにが 5マス もどる）・🪖 スーパーももたろうの せんしゃ（がめんの そとから きて、おにを ふりだしへ ふっとばす）・🪧 にせの みちしるべ・🔀 くみかえ。
   ・盤：slong.js の OG_PTS（むら → もり → かわ → おにがしま）。キャラ：rig/part_chars.js の oni・momotaro・inu・kiji・saru。
   データと 声：sit/oni_gen.py → oni_data.js・sit/pony_oni.json・aivis/jobs/og1 */
const OG_N = new Map(); let OG_CUR = "";
const OGS = { round: 0, oni: null, home: false };
Object.assign(ASK_AT, { oni: [1220, 1.15], momotaro: [1230, 1.0], inu: [1230, .92], kiji: [1230, .9], saru: [1230, .92] });
Object.assign(KID_S, { oni: 1.15, momotaro: 1.0, inu: .92, kiji: .9, saru: .92 });
Object.assign(PIECE_S, { oni: .3, momotaro: .22, inu: .21, kiji: .19, saru: .21 });
const ogI = id => SL_ORDER.oni.indexOf(id);
/* ---------- マスの ならび（48） ---------- */
{ const PL = [null, "og", "og", "e:dango", "og", "e:inu", "og", "og", "e:momo", "og", "e:kakure", "og",
    "og", "e:hachimaki", "og", "e:fake", "og", "e:onigun", "og", "og", "e:kiji", null, "og", "e:saru",
    "og", "e:otoshiana", "og", "e:tank", "og", "e:momo2", "og", "e:kumikae", "og", "e:dango", "og", "e:momogun",
    "og", "e:onigun", "og", "og", "e:inu", "e:kiji", "og", "og", "e:fake", "og", "og", null];
  const BASE = { dango: "again", hachimaki: "dice2", saru: "x2", kakure: "rest", kumikae: "kumikae" };
  const O = SL_ORDER.oni, ev = {}, task = {};
  O.forEach((id, i) => { const p = PL[i]; if (!p || id === "0" || id === "4" || id === "15") return;
    if (p.startsWith("e:")) { const t = p.slice(2); ev[id] = [BASE[t] || t, 0, `sl_oni_${t}`, OG.evt[t], t]; } else task[id] = p; });
  EVENTS.oni = ev; LONG_TASKS.oni = task;
  LEGENDS.oni = [["og", "おはなし"]]; }
Object.assign(LTASK, { og: ["#FFE9E2", "💬"] });
BOARD.oni.style = () => "tsuchi";
const OG_ICON = { dango: "🍡", inu: "🐕", kiji: "🐦", saru: "🐒", hachimaki: "🎌", momo: "🍑", momo2: "🍑", kakure: "🌿", otoshiana: "🕳", onigun: "👹", momogun: "🚩", tank: "🪖", fake: "🪧", kumikae: "🔀" };
const OG_EVC = { dango: "#FFE9C7", inu: "#FFF6E9", kiji: "#D9F0C8", saru: "#F2DCC6", hachimaki: "#FFFFFF", momo: "#FFD9E2", momo2: "#FFD9E2", kakure: "#C9EBB5", otoshiana: "#5A4636", onigun: "#FF9F8F", momogun: "#FFE27A", tank: "#C9E3A6", fake: "#FFC2D1", kumikae: "#E6E9FF" };
/* ---------- 盤の みち：つちの みち ---------- */
ROAD.tsuchi = (L, d, a, b, pass) => { if (pass === "under") { pathEl(L, d, { stroke: "#7A5A3A", "stroke-width": 46 }); pathEl(L, d, { stroke: "#D9B98A", "stroke-width": 34 }); } else pathEl(L, d, { stroke: "#B8946A", "stroke-width": 5, "stroke-dasharray": "6 22", opacity: .7 }); };
{ const db = drawBoard; drawBoard = function () { db(); if (curStage !== "oni") return;
    Object.entries(EVENTS.oni).forEach(([id, e]) => { const [x, y] = NODES[id], t = e[4] || e[0];
      el("circle", { cx: x, cy: y, r: 36, fill: OG_EVC[t] || "#FFF1C9", ...S6(4) }, boardLayer); txt(boardLayer, x, y + 14, OG_ICON[t] || "★", 36, { "text-anchor": "middle", ...(t === "otoshiana" ? { fill: "#FFFFFF" } : {}) }); });
    ogOniPlace(); }; }
/* ---------- 背景：むら・もり・かわ・おにがしま ---------- */
function ogHouse(L, x, y, s = 1) { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L); el("rect", { x: -50, y: -40, width: 100, height: 60, fill: "#F6E7C8", ...S6(4) }, g);
  el("path", { d: "M-70 -36 L0 -90 L70 -36 Z", fill: "#C9A26B", ...S6(4) }, g); el("rect", { x: -14, y: -14, width: 28, height: 34, fill: "#8B5A3C", ...S6(3) }, g); return g; }
function ogTree(L, x, y, s = 1, c = "#5FB35A") { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L); el("rect", { x: -9, y: -10, width: 18, height: 40, fill: "#8B5A3C", ...S6(3) }, g);
  el("circle", { cx: 0, cy: -40, r: 38, fill: c, ...S6(4) }, g); el("circle", { cx: -26, cy: -22, r: 24, fill: c, ...S6(4) }, g); el("circle", { cx: 26, cy: -22, r: 24, fill: c, ...S6(4) }, g); return g; }
function ogIsland(L, x, y, s = 1) { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L);
  el("path", { d: "M-260 40 Q-200 -60 -110 -80 Q-60 -150 0 -140 Q70 -160 120 -90 Q220 -70 260 40 Z", fill: "#8E8478", ...S6(5) }, g);
  el("path", { d: "M-150 -40 L-120 -110 L-90 -40 Z M90 -40 L120 -120 L150 -40 Z", fill: "#6E6560", ...S6(4) }, g);
  // おにの もん（こわすぎない）
  el("rect", { x: -70, y: -70, width: 140, height: 110, fill: "#B8322A", ...S6(5) }, g); el("path", { d: "M-90 -70 H90 L76 -96 H-76 Z", fill: "#3A2E2E", ...S6(4) }, g);
  el("rect", { x: -36, y: -40, width: 72, height: 80, rx: 6, fill: "#5A2420", ...S6(4) }, g); el("path", { d: "M0 -40 V40", stroke: INK, "stroke-width": 4 }, g);
  const f = el("g", { transform: "translate(0 -120)" }, g); el("circle", { r: 26, fill: "#F0645A", ...S6(4) }, f); el("path", { d: "M-16 -18 L-10 -40 L-4 -20 M16 -18 L10 -40 L4 -20", fill: "#FFD25E", ...S6(3) }, f);
  el("circle", { cx: -8, cy: -4, r: 4, fill: INK }, f); el("circle", { cx: 8, cy: -4, r: 4, fill: INK }, f); el("path", { d: "M-8 10 Q0 16 8 10", fill: "none", ...S6(3) }, f); return g; }
BOARD_BG.oni = L => {
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#BDE3F2" }, L);
  el("rect", { x: 0, y: 0, width: 1600, height: 400, fill: "#7FB8E0" }, L); // うみ
  for (let i = 0; i < 18; i++) el("path", { d: `M${(i * 173) % 1600} ${60 + (i * 61) % 300} q18 -10 36 0 q18 10 36 0`, fill: "none", stroke: "#FFFFFF", "stroke-width": 4, opacity: .7 }, L);
  ogIsland(L, 820, 300, 1);
  el("path", { d: "M0 430 Q400 400 800 420 T1600 410 V560 H0 Z", fill: "#E9D9A6", ...S6(4) }, L); // すなはま
  el("path", { d: "M0 560 Q400 540 800 560 T1600 550 V705 Q1200 690 800 705 T0 700 Z", fill: "#8FC8E8", ...S6(4) }, L); // かわ
  for (let i = 0; i < 14; i++) el("path", { d: `M${60 + i * 113} ${600 + (i % 3) * 30} q20 -10 40 0 q20 10 40 0`, fill: "none", stroke: "#FFFFFF", "stroke-width": 4, opacity: .8 }, L);
  el("rect", { x: 0, y: 700, width: 1600, height: 150, fill: "#9CCB7E" }, L); // もり
  [[40, 830], [330, 860], [560, 845], [900, 860], [1180, 845], [1560, 840], [700, 720], [1000, 720], [240, 720]].forEach(([x, y], i) => ogTree(L, x, y, .8, i % 2 ? "#4E9A4B" : "#5FB35A"));
  el("rect", { x: 0, y: 850, width: 1600, height: 150, fill: "#CDE7A8" }, L); // むら
  ogHouse(L, 60, 990, .8); ogHouse(L, 1560, 990, .8);
  for (let x = 0; x < 1600; x += 60) el("path", { d: `M${x} 1000 l10 -20 l10 20`, fill: "#7BB36A" }, L); };
/* ---------- のりもの（slRide）：もも・きじ・いぬ ---------- */
function ogPeachArt(g, size) { const k = size / 130, o = el("g", {}, g), t = el("g", { transform: `scale(${k.toFixed(3)})` }, o);
  el("path", { d: "M-80 30 Q-60 70 0 70 Q60 70 80 30", fill: "none", stroke: "#FFFFFF", "stroke-width": 6, opacity: .8 }, t);
  el("path", { d: "M0 -60 Q-70 -60 -66 4 Q-60 56 0 58 Q60 56 66 4 Q70 -60 0 -60 Z", fill: "#FFB3C1", ...S6(6) }, t);
  el("path", { d: "M0 -56 Q-14 0 0 54", fill: "none", stroke: "#F08A9E", "stroke-width": 5 }, t); el("ellipse", { cx: -30, cy: -16, rx: 14, ry: 22, fill: "#FFFFFF", opacity: .5 }, t);
  el("path", { d: "M0 -60 Q-30 -90 -56 -70 Q-30 -52 0 -60 Z", fill: "#7BD389", ...S6(4) }, t); el("path", { d: "M0 -60 Q30 -92 52 -74 Q28 -54 0 -60 Z", fill: "#5FB35A", ...S6(4) }, t); return o; }
function ogKijiArt(g, size) { const k = size / 130, o = el("g", {}, g), t = el("g", { transform: `scale(${k.toFixed(3)})` }, o);
  el("path", { d: "M-20 0 Q-100 -10 -150 -40 Q-110 10 -30 18 Z", fill: "#8B6A4B", ...S6(4) }, t); el("ellipse", { cx: 0, cy: 0, rx: 46, ry: 30, fill: "#3E8E6E", ...S6(5) }, t);
  const w = el("path", { d: "M-10 -10 Q10 -80 50 -70 Q30 -30 20 -6 Z", fill: "#2E6B52", ...S6(4) }, t); el("animateTransform", { attributeName: "transform", type: "scale", values: "1 1;1 -.6;1 1", dur: ".35s", repeatCount: "indefinite" }, w);
  el("circle", { cx: 44, cy: -14, r: 20, fill: "#E8473C", ...S6(4) }, t); el("circle", { cx: 50, cy: -18, r: 4, fill: INK }, t); el("path", { d: "M62 -12 L80 -8 L62 -2 Z", fill: "#FFB13B", ...S6(3) }, t); return o; }
function ogInuArt(g, size) { const k = size / 130, o = el("g", {}, g), t = el("g", { transform: `scale(${k.toFixed(3)})` }, o);
  el("ellipse", { cx: 0, cy: 10, rx: 50, ry: 28, fill: "#F6EEE2", ...S6(5) }, t); [-30, -10, 14, 34].forEach(x => el("rect", { x: x - 7, y: 26, width: 14, height: 26, rx: 6, fill: "#F6EEE2", ...S6(4) }, t));
  el("circle", { cx: 52, cy: -18, r: 28, fill: "#F6EEE2", ...S6(5) }, t); el("ellipse", { cx: 36, cy: -14, rx: 10, ry: 22, fill: "#C98A4B", ...S6(4) }, t); el("circle", { cx: 62, cy: -22, r: 4, fill: INK }, t); el("circle", { cx: 78, cy: -10, r: 6, fill: INK }, t);
  el("path", { d: "M-48 0 Q-70 -20 -64 -36", fill: "none", ...S6(6) }, t); el("path", { d: "M30 2 Q52 12 74 2", fill: "none", stroke: "#E8473C", "stroke-width": 8 }, t); return o; }
const OG_VEH = { MOMO: ogPeachArt, KIJI: ogKijiArt, INU: ogInuArt };
/* ---------- ちいさな おにと ももたろう ぐんだん（ぐんだんの こうしん用） ---------- */
function ogMiniOni(L, x, y, s = 1, col = "#F0645A") { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L);
  el("ellipse", { cx: 0, cy: 10, rx: 28, ry: 30, fill: col, ...S6(4) }, g); el("rect", { x: -24, y: 12, width: 48, height: 22, rx: 6, fill: "#FFD25E", ...S6(3) }, g);
  el("circle", { cx: 0, cy: -30, r: 28, fill: col, ...S6(4) }, g); el("path", { d: "M-18 -52 L-12 -78 L-4 -54 M18 -52 L12 -78 L4 -54", fill: "#FFD25E", ...S6(3) }, g);
  el("circle", { cx: -10, cy: -32, r: 4, fill: INK }, g); el("circle", { cx: 10, cy: -32, r: 4, fill: INK }, g); el("path", { d: "M-8 -18 L-4 -12 L0 -18 L4 -12 L8 -18", fill: "none", ...S6(3) }, g);
  el("path", { d: "M30 0 L52 -60", stroke: "#5A4E48", "stroke-width": 12, "stroke-linecap": "round" }, g); return g; }
function ogMiniFriend(L, x, y, kind, s = 1) { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L);
  const body = { momotaro: "#5B8DEF", inu: "#F6EEE2", saru: "#A9744A", kiji: "#3E8E6E" }[kind], face = { momotaro: "#FFDCC0", inu: "#F6EEE2", saru: "#F5C9A6", kiji: "#E8473C" }[kind];
  el("ellipse", { cx: 0, cy: 10, rx: 24, ry: 26, fill: body, ...S6(4) }, g); el("circle", { cx: 0, cy: -26, r: 24, fill: face, ...S6(4) }, g);
  el("circle", { cx: -8, cy: -28, r: 3.5, fill: INK }, g); el("circle", { cx: 8, cy: -28, r: 3.5, fill: INK }, g); el("path", { d: "M-6 -16 Q0 -12 6 -16", fill: "none", ...S6(3) }, g);
  if (kind === "momotaro") { el("path", { d: "M-24 -40 Q0 -52 24 -40 L24 -34 Q0 -46 -24 -34 Z", fill: "#FFFFFF", ...S6(3) }, g); el("circle", { cx: 0, cy: -44, r: 6, fill: "#FF8FA3", ...S6(2) }, g);
    el("path", { d: "M26 20 L26 -70", stroke: "#8B5A3C", "stroke-width": 5 }, g); el("path", { d: "M26 -70 L64 -66 L60 -30 L26 -34 Z", fill: "#FFFFFF", ...S6(3) }, g); el("circle", { cx: 44, cy: -50, r: 8, fill: "#FF8FA3" }, g); }
  if (kind === "inu") [[-22, 1], [22, -1]].forEach(([x]) => el("ellipse", { cx: x, cy: -24, rx: 7, ry: 14, fill: "#C98A4B", ...S6(3) }, g));
  if (kind === "saru") [[-26], [26]].forEach(([x]) => el("circle", { cx: x, cy: -26, r: 9, fill: "#F5C9A6", ...S6(3) }, g));
  if (kind === "kiji") el("path", { d: "M-4 -20 L10 -18 L-2 -12 Z", fill: "#FFB13B", ...S6(2) }, g);
  return g; }
/* ---------- スーパーももたろうの せんしゃ ---------- */
function ogTankArt(L, s = 1) { const g = el("g", {}, L), t = el("g", { transform: `scale(${s})` }, g);
  el("rect", { x: -150, y: 0, width: 300, height: 56, rx: 28, fill: "#5A5A66", ...S6(6) }, t); for (let i = 0; i < 6; i++) el("circle", { cx: -120 + i * 48, cy: 28, r: 18, fill: "#8C8C99", ...S6(4) }, t);
  el("path", { d: "M-130 0 L-110 -60 H120 L140 0 Z", fill: "#7BB36A", ...S6(6) }, t); el("circle", { cx: 10, cy: -30, r: 22, fill: "#FFB3C1", ...S6(4) }, t); el("path", { d: "M10 -52 Q0 -30 10 -8", fill: "none", stroke: "#F08A9E", "stroke-width": 4 }, t);
  el("path", { d: "M-60 -60 Q-60 -120 10 -120 Q80 -120 80 -60 Z", fill: "#6FA35E", ...S6(6) }, t);
  const gun = el("g", {}, t); el("rect", { x: -200, y: -102, width: 150, height: 24, rx: 10, fill: "#5A5A66", ...S6(5) }, gun); el("circle", { cx: -200, cy: -90, r: 18, fill: "#FFB3C1", ...S6(4) }, gun);
  // スーパーももたろう（ハッチから かおを だす）
  const m = el("g", { transform: "translate(20 -150)" }, t); el("path", { d: "M-40 30 Q-60 70 -90 80 L-40 60 Z", fill: "#E8473C", ...S6(4) }, m); // マント
  el("circle", { r: 36, fill: "#FFDCC0", ...S6(5) }, m); el("path", { d: "M-36 -6 Q-34 -40 0 -42 Q34 -40 36 -6 Q20 -24 0 -24 Q-20 -24 -36 -6 Z", fill: "#2B2A33", ...S6(4) }, m);
  el("path", { d: "M-38 -14 Q0 -30 38 -14 L38 -4 Q0 -20 -38 -4 Z", fill: "#FFFFFF", ...S6(3) }, m); el("circle", { cy: -18, r: 7, fill: "#FF8FA3", ...S6(2) }, m);
  el("circle", { cx: -12, cy: 4, r: 4.5, fill: INK }, m); el("circle", { cx: 12, cy: 4, r: 4.5, fill: INK }, m); el("path", { d: "M-10 16 Q0 24 10 16", fill: "none", ...S6(3) }, m);
  el("path", { d: "M-70 -10 l-30 -30 l12 30 Z", fill: "#FFE27A", ...S6(3) }, m); // きらり
  g.gun = gun; return g; }
/* ---------- おにの コマ ---------- */
function ogOni() { if (!OGS.oni) { OGS.oni = piece("oni"); } return OGS.oni; }
function ogOniPlace() { const on = OGS.oni; if (curStage !== "oni" || !on || !BOARD_PIECES.includes(on) || on.moving || OGS.fly) return; if (!on.node || !NODES[on.node]) on.node = "0"; [on.px, on.py] = nodeXY(on, on.node); }
{ const sm = setupMulti; setupMulti = function (n) { const r = sm(n); if (curStage === "oni") { const on = ogOni(); on.human = false; on.s0 = PIECE_S.oni; on.off = [50, -26]; delete on.tm.closed; delete on.player;
      BOARD_PIECES.push(on); setPiece(on, "0"); } return r; }; }
{ const ap = applyStage; applyStage = function (id, ...a) { if (id === "oni") { OG_N.clear(); OGS.round = 0; OGS.home = false; OGS.told = 0; } return ap(id, ...a); }; }
// ばんに いない キャラの ことばは、ふきだしが でる ばしょを きめてから
function ogVoice(c, x, y, key, text) { place(c, x - 60, y, .3); return speak(c, key, text); }
// おにの サイコロ（ばんの まんなかに おおきく）
async function ogOniDice() { const g = el("g", { transform: "translate(800 500)" }, front()), d = el("g", {}, g);
  el("rect", { x: -70, y: -70, width: 140, height: 140, rx: 26, fill: "#FFE9E2", stroke: "#B8322A", "stroke-width": 8 }, g); g.appendChild(d);
  const face = v => { d.innerHTML = ""; const P = { 1: [[0, 0]], 2: [[-30, -30], [30, 30]], 3: [[-30, -30], [0, 0], [30, 30]], 4: [[-30, -30], [30, -30], [-30, 30], [30, 30]], 5: [[-30, -30], [30, -30], [0, 0], [-30, 30], [30, 30]], 6: [[-30, -32], [30, -32], [-30, 0], [30, 0], [-30, 32], [30, 32]] }[v];
    P.forEach(([x, y]) => el("circle", { cx: x, cy: y, r: 13, fill: "#B8322A" }, d)); };
  let v = 1; playSfx("sfx_rattle"); for (let i = 0; i < 12; i++) { v = 1 + rnd(6); face(v); g.setAttribute("transform", `translate(800 500) rotate(${(i % 2 ? -1 : 1) * (18 - i)})`); await sleep(45 + i * 13); }
  playSfx("sfx_thunk"); g.setAttribute("transform", "translate(800 500) scale(1.15)"); popNumber(v); await sleep(700); g.remove(); return v; }
// ぽかーん！：かなぼうを ふりおろす → ほしが まわる
async function ogBonk(on, list) {
  on.armR.t = -170; await sleep(450); on.armR.t = 40; noise(.25, 200, .7); blip(220, 90, .25, "square");
  for (const pc of list) { const b = el("g", { transform: `translate(${pc.px} ${pc.py - 120})` }, front()); el("path", { d: "M-90 -10 L-60 -50 L-20 -30 L0 -70 L24 -32 L66 -52 L60 -10 L92 6 L54 22 L60 60 L20 36 L0 70 L-22 34 L-64 56 L-56 18 L-92 4 Z", fill: "#FFE27A", ...S6(5) }, b);
    txt(b, 0, 12, "ぽかーん！", 34, { "text-anchor": "middle", "font-weight": 700 }); later(1400, () => b.remove());
    pc.sadMouth = true; jump(pc, .3); const st = el("g", {}, front()); let t = 0;
    addTick(dt => { if (!st.isConnected) return false; t += dt; st.innerHTML = ""; for (let i = 0; i < 3; i++) { const a = t * 5 + i * 2.1; txt(st, pc.px + Math.cos(a) * 34, pc.py - 70 + Math.sin(a) * 10, "★", 22, { "text-anchor": "middle", fill: "#FFD25E", stroke: INK, "stroke-width": 1.5 }); } if (t > 2.2) { st.remove(); pc.sadMouth = false; return false; } }); }
  await sleep(600); on.armR.t = 0; }
// おにの ばん
async function ogOniTurn() {
  const on = ogOni(), O = SL_ORDER.oni; OGS.round++; setView("board"); await sleep(200);
  showBanner("👹 おにの ばん", 1400); markAbove(on, "ex"); jump(on, .5);
  if (OGS.round === 1) { await speak(on, "ogo_start", OG.line.ogo_start.text); await speak(C.pony, "ogp_wait", OG.txt.ogp_wait); return; }
  if (OGS.home) { OGS.home = false; await speak(C.pony, "ogp_home", OG.txt.ogp_home); await warpTo(on, "0"); await sleep(300); }
  await speak(C.pony, "ogp_oniturn", OG.txt.ogp_oniturn); const v = await ogOniDice(); await speak(C.pony, "n" + v, NUMS[v]);
  if (rnd(2)) speak(on, "ogo_go", OG.line.ogo_go.text);
  let i = ogI(on.node); const hit = [];
  for (let k = 0; k < v; k++) { if (i + 1 >= O.length - 1) break; i++; await hop(on, O[i], .24, k);
    const here = PLAYERS.filter(p => p.pc.node === O[i] && !p.ogHide && p.pc.node !== GOAL); if (here.length) { hit.push(...here); break; } }
  const hidden = PLAYERS.filter(p => p.ogHide && ogI(p.pc.node) <= i && ogI(p.pc.node) > i - v);
  if (hit.length) { await speak(on, "ogo_hit", OG.line.ogo_hit.text); await ogBonk(on, hit.map(p => p.pc)); hit.forEach(p => { p.rest = 1; markAbove(p.pc, "z", { i: 1 }); });
    await speak(C.pony, "ogp_caught", OG.txt.ogp_caught); }
  else if (hidden.length) { hidden.forEach(p => markAbove(p.pc, "sparkle")); await speak(C.pony, "ogp_hidden", OG.txt.ogp_hidden); }
  PLAYERS.forEach(p => { if (p.ogHide) p.ogHide--; });
  if (i >= O.length - 2) OGS.home = true; }
{ const mt = multiTurn; multiTurn = async function (pl, first) { await mt(pl, first);
    if (curStage === "oni" && !winner && pl === PLAYERS[PLAYERS.length - 1]) await ogOniTurn(); }; }
/* ---------- しかけ ---------- */
async function ogTo(pc, d) { const O = SL_ORDER.oni; return O[Math.max(0, Math.min(O.length - 2, ogI(pc.node) + d))]; }
async function ogOniBack(d, how) { const on = ogOni(), O = SL_ORDER.oni; const to = d === "home" ? "0" : O[Math.max(0, ogI(on.node) - d)];
  if (how === "fly") { OGS.fly = 1; await speak(on, "ogo_fly", OG.line.ogo_fly.text); const [tx, ty] = nodeXY(on, to), x0 = on.px, y0 = on.py;
    await tween(1600, k => { on.px = x0 + (tx - x0) * k; on.py = y0 + (ty - y0) * k - Math.sin(k * Math.PI) * 420; on.lean.t = k * 720; }); on.lean.t = 0; on.node = to; on.trail = []; OGS.fly = 0; jump(on, .5); noise(.2, 300, .4); }
  else { on.sadMouth = true; const O2 = SL_ORDER.oni; let i = ogI(on.node); const j = ogI(to); for (let k = 0; i > j; k++) { i--; await hop(on, O2[i], .18, k); } on.sadMouth = false; } }
async function ogMarch(kind, dir) { // ぐんだんの こうしん（がめんを よこぎる）
  const g = el("g", {}, front()), L = el("g", {}, g); const y = 520;
  if (kind === "oni") { for (let i = 0; i < 7; i++) ogMiniOni(L, i * 120 + (i % 2) * 30, (i % 2) * 40, .9, ["#F0645A", "#5B8DEF", "#7BD389"][i % 3]); txt(L, 360, -120, "おにの ぐんだん", 40, { "text-anchor": "middle", fill: "#B8322A", stroke: "#FFFFFF", "stroke-width": 6, "paint-order": "stroke", "font-weight": 700 }); }
  else { ["momotaro", "inu", "saru", "kiji", "momotaro", "inu", "saru", "kiji"].forEach((k, i) => ogMiniFriend(L, i * 110, (i % 2) * 36, k, .95)); txt(L, 380, -130, "ももたろう ぐんだん", 40, { "text-anchor": "middle", fill: "#E8473C", stroke: "#FFFFFF", "stroke-width": 6, "paint-order": "stroke", "font-weight": 700 }); }
  const x0 = dir > 0 ? -950 : 1700, x1 = dir > 0 ? 1700 : -950; for (let i = 0; i < 6; i++) later(i * 300, () => blip(180 + (i % 2) * 40, 140, .12, "square"));
  await tween(2600, k => g.setAttribute("transform", `translate(${(x0 + (x1 - x0) * k).toFixed(0)} ${(y + Math.abs(Math.sin(k * 30)) * -10).toFixed(0)})`)); g.remove(); }
async function ogTank() { const on = ogOni(); const g = ogTankArt(front(), .8); let x = 1900; const y = Math.min(940, Math.max(420, on.py + 10));
  const at = () => g.setAttribute("transform", `translate(${x.toFixed(0)} ${y})`); at(); noise(1.2, 120, .35);
  const stop = Math.min(1450, on.px + 360); await tween(1500, k => { x = 1900 + (stop - 1900) * (1 - Math.pow(1 - k, 2)); at(); });
  await ogVoice(C.momotaro, x - 40, y - 160, "ogm_tank", OG.line.ogm_tank.text);
  const b = el("g", {}, front()); ogPeachArt(b, 60); const sx = x - 160 * .8, sy = y - 90 * .8; noise(.3, 300, .8); blip(300, 80, .3, "square");
  await tween(700, k => b.setAttribute("transform", `translate(${(sx + (on.px - sx) * k).toFixed(0)} ${(sy + (on.py - 40 - sy) * k - Math.sin(k * Math.PI) * 120).toFixed(0)})`)); b.remove();
  for (let i = 0; i < 10; i++) mark("puff", on.px, on.py - 30, { vx: Math.cos(i) * 220, vy: Math.sin(i) * 220, life: .6, s: .7 }); confetti(30);
  await ogOniBack("home", "fly"); await tween(1200, k => { x = stop + (1900 - stop) * k; at(); }); g.remove(); }
{ const be = boardEvent; boardEvent = async function (pc) {
    const ev = curStage === "oni" && EVENTS.oni[pc.node];
    if (!ev || (pc.player && pc.player.stay)) return be(pc);
    const t = ev[4] || ev[0];
    if (t === "kakure") { await be(pc); if (pc.player) pc.player.ogHide = 2; const g = el("g", {}, front()); for (let i = 0; i < 5; i++) el("path", { d: `M${pc.px - 50 + i * 25} ${pc.py + 10} q6 -50 12 0`, fill: "#5FB35A", ...S6(3) }, g); later(2500, () => g.remove()); return; }
    if (!["inu", "kiji", "momo", "momo2", "otoshiana", "onigun", "momogun", "tank", "fake"].includes(t)) return be(pc);
    await sleep(300); markAbove(pc, t === "otoshiana" || t === "onigun" || t === "fake" ? "drop" : "sparkle"); chime(); await slSay(ev[2], ev[3]);
    if (t === "inu") { ogVoice(C.inu, pc.px, pc.py, "ogi_wan", OG.line.ogi_wan.text); await slRide(pc, await ogTo(pc, 2), "INU", { arc: 30, ms: 1400, noflip: false, size: 110 }); }
    else if (t === "kiji") { ogVoice(C.kiji, pc.px, pc.py, "ogk_ken", OG.line.ogk_ken.text); await slRide(pc, await ogTo(pc, 3), "KIJI", { arc: 220, ms: 1800, size: 120 }); }
    else if (t === "momo" || t === "momo2") { const to = slWarpTo("oni", pc.node, t === "momo" ? "warp" : "bigwarp");
      const sh = setInterval(() => showBanner("どんぶらこ、どんぶらこ", 900), 1100); try { await slRide(pc, to, "MOMO", { arc: 50, ms: t === "momo" ? 2600 : 3400, noflip: true, size: 150 }); } finally { clearInterval(sh); } }
    else if (t === "otoshiana") { const g = el("g", {}, front()); el("ellipse", { cx: pc.px, cy: pc.py + 10, rx: 60, ry: 22, fill: "#2B1E14", ...S6(4) }, g);
      const y0 = pc.py; await tween(700, k => { pc.py = y0 + k * 30; pc.lean.t = k * 30; }); noise(.3, 200, .5); await sleep(300); g.remove(); pc.lean.t = 0; await warpTo(pc, await ogTo(pc, -6)); }
    else if (t === "onigun") { speak(ogOni(), "ogo_army", OG.line.ogo_army.text); await ogMarch("oni", -1); await slGo(pc, -3); }
    else if (t === "momogun") { ogVoice(C.momotaro, 300, 560, "ogm_army", OG.line.ogm_army.text); await ogMarch("momo", 1); await speak(ogOni(), "ogo_back", OG.line.ogo_back.text); await ogOniBack(5); }
    else if (t === "tank") await ogTank();
    else if (t === "fake") { const g = el("g", { transform: `translate(${pc.px + 60} ${pc.py - 60})` }, front()); el("path", { d: "M0 70 V-20", stroke: "#8B5A3C", "stroke-width": 8 }, g); el("path", { d: "M-10 -40 H70 L90 -20 L70 0 H-10 Z", fill: "#F6E7C8", ...S6(4) }, g); txt(g, 34, -12, "→", 26, { "text-anchor": "middle" });
      later(1800, () => g.remove()); await slGo(pc, -2); }
    await sleep(300); }; }
/* ---------- 場面の へや ---------- */
function ogSign(L, place) { const g = el("g", {}, L); el("rect", { x: 620, y: 24, width: 360, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, 46, { "text-anchor": "middle" }); }
const ROOMS_OG = {
  "むら": L => { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#BDE3F2" }, L); el("path", { d: "M0 560 Q400 500 800 540 T1600 520 V1000 H0 Z", fill: "#CDE7A8", ...S6(5) }, L);
    ogHouse(L, 260, 620, 2.2); ogHouse(L, 1360, 600, 1.8); for (let x = 560; x < 1100; x += 70) el("path", { d: `M${x} 640 l14 -40 l14 40`, fill: "#7BB36A", ...S6(3) }, L); el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#E9D9A6" }, L); el("path", { d: "M0 760 H1600", ...S6(5) }, L); },
  "もり": L => { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#CFEBC0" }, L); [[120, 640, 2.6], [460, 560, 2], [1150, 580, 2.2], [1480, 640, 2.6], [800, 520, 1.6]].forEach(([x, y, s], i) => ogTree(L, x, y, s, i % 2 ? "#4E9A4B" : "#5FB35A"));
    el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#B8946A" }, L); el("path", { d: "M0 760 H1600", ...S6(5) }, L); for (let x = 40; x < 1600; x += 160) el("path", { d: `M${x} 760 q20 -40 40 0`, fill: "#5FB35A", ...S6(3) }, L); },
  "かわ": L => { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#BDE3F2" }, L); el("path", { d: "M0 420 Q400 380 800 420 T1600 400 V700 H0 Z", fill: "#8FC8E8", ...S6(5) }, L);
    for (let i = 0; i < 12; i++) el("path", { d: `M${80 + i * 130} ${470 + (i % 3) * 60} q20 -12 40 0 q20 12 40 0`, fill: "none", stroke: "#FFFFFF", "stroke-width": 5 }, L);
    el("rect", { x: 0, y: 700, width: 1600, height: 300, fill: "#CDE7A8" }, L); el("path", { d: "M0 700 H1600", ...S6(5) }, L); ogTree(L, 1450, 700, 1.6); },
  "おにがしま": L => { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#C9B8D9" }, L); el("rect", { x: 0, y: 0, width: 1600, height: 420, fill: "#7FB8E0" }, L); ogIsland(L, 800, 480, 2.4);
    el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#8E8478" }, L); el("path", { d: "M0 760 H1600", ...S6(5) }, L); },
};
{ const dr = drawRoom; drawRoom = function (place, noSign = false) {
    if (curStage !== "oni" || !ROOMS_OG[place]) return dr(place, noSign); sceneLayer.innerHTML = ""; ROOMS_OG[place](sceneLayer); if (!noSign) ogSign(sceneLayer, place); }; }
/* ---------- 場面の 小道具と うごき（ナレーションと 絵を そろえる、2026-11-25） ---------- */
function ogProp(sc, h, a) {
  const G = el("g", {}, propG), hx = h.x + 200 * h.s, ax = a.x + 200 * a.s, base = 975, id = sc.id;
  const live = () => G.isConnected;
  const F = () => { const g = el("g", {}, front()); addTick(() => { if (!live()) { g.remove(); return false; } }); return g; }; // キャラの まえに かく もの
  const loop = fn => { let t = 0; addTick(dt => { if (!live()) return false; t += dt; return fn(t, dt); }); };
  const word = (x, y, w, col = "#FFFFFF") => { const g = el("g", {}, G); txt(g, x, y, w, 40, { "text-anchor": "middle", fill: col, stroke: INK, "stroke-width": 7, "paint-order": "stroke", "font-weight": 700 }); return g; };
  const dango = (L, x, y, k = 1) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${k}) rotate(-20)` }, L); el("path", { d: "M0 70 V-80", stroke: "#B8946A", "stroke-width": 6 }, g); [["#FFFFFF", -50], ["#FFB3C1", -10], ["#9CCB7E", 30]].forEach(([c, y]) => el("circle", { cy: y, r: 22, fill: c, ...S6(4) }, g)); return g; };
  const sniff = c => loop(t => { if (t > 4) return false; if (Math.floor(t * 2) !== Math.floor((t - .016) * 2)) { const p = world(c, 290, c.top + 60); const w = el("g", { transform: `translate(${p.x + 30} ${p.y})` }, G); txt(w, 0, 0, "くん", 30, { fill: "#8B5A3C", stroke: "#FFFFFF", "stroke-width": 5, "paint-order": "stroke" }); later(700, () => w.remove()); } });
  if (id === "nani") { a.headRot.t = 12; for (let i = 0; i < 3; i++) later(300 + i * 800, () => markAbove(a, "q")); }
  else if (id === "tasukete") { // とおくから おにが はしって くる
    const o = xtra("oni", -140, .42); o.y = 760; o.dx.t = 330; hold(o, "run", 6); o.lean.t = -10; h.sadMouth = true; for (let i = 0; i < 3; i++) later(i * 700, () => markAbove(h, "drop")); }
  else if (id === "obaasan") { // おばあさんが かわで せんたく
    const line = el("g", {}, G); el("path", { d: "M1450 560 V760 M1580 560 V760 M1450 580 Q1515 610 1580 580", fill: "none", stroke: "#8B5A3C", "stroke-width": 6 }, line);
    [["#FFB3C1", 1470], ["#9CC9F0", 1530]].forEach(([c, x]) => el("rect", { x, y: 590, width: 40, height: 50, rx: 6, fill: c, ...S6(3) }, line));
    const f = F(), tx = ax - 20, ty = base - 40; el("ellipse", { cx: tx, cy: ty, rx: 150, ry: 46, fill: "#C98A4B", ...S6(5) }, f); el("ellipse", { cx: tx, cy: ty - 22, rx: 130, ry: 26, fill: "#BDE3F2", ...S6(4) }, f);
    const cloth = el("rect", { x: tx - 60, y: ty - 58, width: 90, height: 40, rx: 8, fill: "#FFFFFF", ...S6(4) }, f);
    a.lean.t = 18; loop(t => { const k = Math.sin(t * 7); a.armL.t = 40 + k * 30; a.armR.t = -40 - k * 30; a.lean.t = 18 + k * 4; cloth.setAttribute("x", (tx - 60 + k * 24).toFixed(0));
      if (Math.random() < .08) mark("puff", tx - 80 + Math.random() * 160, ty - 50, { vy: -90, life: .9, s: .35 }); if (Math.random() < .02) noise(.12, 900, .25); });
    later(5200, () => { if (!live()) return; a.lean.t = 0; a.armL.t = a.armR.t = 0; }); word(ax, base - 470, "ざぶざぶ"); }
  else if (id === "inu1" || id === "kiji2" || id === "saru2") { // こしの きびだんご
    dango(F(), hx + 110 * h.s, base - 180, .9);
    if (id === "inu1") loop(t => { if (t > 6) return false; a.lean.t = Math.sin(t * 14) * 5; if (Math.floor(t) !== Math.floor(t - .016)) jump(a, .25); });
    if (id === "kiji2") sniff(a);
    if (id === "saru2") { a.eyeScale.t = 1.35; later(400, () => word(ax - 60, base - 440, "じーっ")); later(3000, () => a.eyeScale.t = 1); } }
  else if (id === "tomo") { a.dx.v = 1000; a.dx.t = 0; hold(a, "run", 1.2); a.lean.t = -16; for (let i = 0; i < 6; i++) later(i * 140, () => mark("puff", ax + 300 - i * 50, base - 20, { vy: -40, life: .6, s: .5 })); later(1200, () => { a.lean.t = 0; markAbove(a, "ex"); }); }
  else if (id === "hashi") { // はたけ と こわれた はし
    const b = el("g", {}, G); el("path", { d: "M300 640 Q500 610 700 640 V720 H300 Z", fill: "#8FC8E8", ...S6(4) }, b);
    el("path", { d: "M280 640 L420 600", stroke: "#8B5A3C", "stroke-width": 16, "stroke-linecap": "round" }, b); el("path", { d: "M720 640 L560 596", stroke: "#8B5A3C", "stroke-width": 16, "stroke-linecap": "round" }, b);
    el("path", { d: "M430 600 l20 30 M550 598 l-16 34", stroke: "#8B5A3C", "stroke-width": 8 }, b); txt(b, 490, 580, "✕", 40, { "text-anchor": "middle", fill: "#E8473C" });
    const f = F(); el("rect", { x: ax - 260, y: base - 110, width: 520, height: 130, rx: 30, fill: "#8B5A3C", ...S6(5) }, f);
    for (let i = 0; i < 6; i++) { const x = ax - 220 + i * 88; el("path", { d: `M${x} ${base - 110} q-16 -40 -30 -46 M${x} ${base - 110} q16 -44 32 -46`, fill: "#7BD389", stroke: INK, "stroke-width": 4 }, f); }
    const y0 = a.y; a.y = y0 + 260; let t = 0; later(600, () => addTick(dt => { if (!live()) return false; t += dt; a.y = y0 + 260 * Math.max(0, 1 - t / .7); if (t > .7) { a.y = y0; jump(a, .3); return false; } })); }
  else if (id === "saru1") { // きの えだから ぶらさがる
    const b = el("g", {}, G); el("path", { d: `M1600 150 Q${ax + 200} 170 ${ax - 120} 210`, fill: "none", stroke: "#8B5A3C", "stroke-width": 34, "stroke-linecap": "round" }, b); [ax - 100, ax + 60, ax + 220].forEach(x => el("circle", { cx: x, cy: 180, r: 50, fill: "#5FB35A", ...S6(4) }, b));
    const y0 = a.y; a.y = y0 - 330; const vine = el("path", { stroke: "#5A7A3A", "stroke-width": 8 }, G);
    loop(t => { a.lean.t = Math.sin(t * 2.6) * 14; const p = world(a, 200, a.top); vine.setAttribute("d", `M${ax} 205 L${p.x.toFixed(0)} ${(p.y + 20).toFixed(0)}`); if (t > 5.5) { a.lean.t = 0; } });
    a.armR.t = -160; a.armL.t = -160; }
  else if (id === "michi") { // ふたまたの みち
    const b = el("g", {}, G); el("path", { d: "M720 1000 L780 720 L520 520 M780 720 L1060 520", fill: "none", stroke: "#D9B98A", "stroke-width": 70, "stroke-linecap": "round", "stroke-linejoin": "round" }, b);
    const s2 = el("g", { transform: "translate(880 650)" }, b); el("path", { d: "M0 110 V-40", stroke: "#8B5A3C", "stroke-width": 10 }, s2); el("path", { d: "M-80 -60 H-10 V-20 H-80 L-100 -40 Z M10 -60 H80 L100 -40 L80 -20 H10 Z", fill: "#F6E7C8", ...S6(4) }, s2); txt(s2, -45, -30, "？", 26, { "text-anchor": "middle" }); txt(s2, 45, -30, "？", 26, { "text-anchor": "middle" }); a.headRot.t = -10; }
  else if (id === "tsukare") { a.squash.t = .8; a.sadMouth = true; a.armL.t = 30; a.armR.t = -30; for (let i = 0; i < 4; i++) later(i * 600, () => markAbove(a, "drop")); word(ax, base - 330, "はあ はあ"); }
  else if (id === "oni1") { // しげみから とびだす
    const f = F(); const bush = el("g", {}, f); [[-120, 0], [0, -30], [120, 0], [-60, 20], [60, 20]].forEach(([x, y]) => el("circle", { cx: ax + x, cy: base - 80 + y, r: 90, fill: "#5FB35A", ...S6(5) }, bush));
    const y0 = a.y; a.y = y0 + 420; loop(t => { if (t < .9) { bush.setAttribute("transform", `translate(${(Math.sin(t * 50) * 8).toFixed(1)} 0)`); if (Math.random() < .2) noise(.05, 1500, .3); return; }
      if (t < 1.3) { a.y = y0 + 420 - 520 * ((t - .9) / .4); return; } if (t < 1.6) { a.y = y0 - 100 + 100 * ((t - 1.3) / .3); return; } a.y = y0; bush.setAttribute("transform", "translate(0 60)"); a.armR.t = -150; markAbove(h, "ex"); return false; });
    word(ax, base - 520, "がさがさっ！", "#FFE27A"); }
  else if (id === "shizuka") { // とおくの きの かげから おにが のぞく
    const o = el("g", {}, G); ogMiniOni(o, 1020, 650, .7); const tr = el("g", {}, G); ogTree(tr, 1020, 700, 1.4, "#4E9A4B");
    loop(t => { o.setAttribute("transform", `translate(${(Math.sin(t * 1.4) * 70 - 60).toFixed(0)} 0)`); });
    a.armR.t = -110; const sh = el("g", {}, G); txt(sh, ax - 160, base - 440, "しーっ", 42, { fill: "#FFFFFF", stroke: INK, "stroke-width": 7, "paint-order": "stroke" }); h.roundMouth = true; later(3000, () => h.roundMouth = false); }
  else if (id === "kiji1") { // そらから まいおりる
    const y0 = a.y; a.y = y0 - 700; let t = 0; addTick(dt => { if (!live()) return false; t += dt; const k = Math.min(1, t / 1.6); a.y = y0 - 700 * (1 - k) * (1 - k); a.lean.t = (1 - k) * 20 * Math.sin(t * 12); a.armL.t = a.armR.t = (1 - k) * 80 * Math.sin(t * 20); if (k >= 1) { a.lean.t = 0; a.armL.t = a.armR.t = 0; return false; } }); }
  else if (id === "momo") { // かわを ももが ながれて くる
    const pg = el("g", {}, G); const pe = ogPeachArt(pg, 230); loop(t => { const x = Math.min(900, -200 + t * 260); pg.setAttribute("transform", `translate(${x.toFixed(0)} ${(560 + Math.sin(t * 3) * 10).toFixed(0)}) rotate(${(Math.sin(t * 2) * 6).toFixed(1)})`); });
    word(800, 380, "どんぶらこ、どんぶらこ"); }
  else if (id === "fune") { const bt = el("g", {}, G); el("path", { d: "M-200 0 H200 L150 70 H-150 Z", fill: "#B8946A", ...S6(5) }, bt); el("path", { d: "M100 0 L180 -200", stroke: "#8B5A3C", "stroke-width": 10 }, bt); loop(t => bt.setAttribute("transform", `translate(${ax - 60} ${(620 + Math.sin(t * 2.2) * 8).toFixed(0)}) rotate(${(Math.sin(t * 1.6) * 3).toFixed(1)})`)); }
  else if (id === "abunai") { for (let i = 0; i < 3; i++) later(i * 800, () => markAbove(a, "drop")); }
  else if (id === "inu2") { sniff(a); a.lean.t = 16; later(4200, () => a.lean.t = 0); // おにの あしあと
    for (let i = 0; i < 5; i++) { const x = 820 + i * 80, y = base - 30 - (i % 2) * 30; const f2 = el("g", { transform: `translate(${x} ${y})` }, G); el("ellipse", { rx: 20, ry: 12, fill: "#8B5A3C", opacity: .6 }, f2); [-14, 0, 14].forEach(d => el("circle", { cx: d + 4, cy: -16, r: 5, fill: "#8B5A3C", opacity: .6 }, f2)); } }
  else if (id === "mon") { a.armL.t = 40; a.armR.t = -40; later(300, () => markAbove(h, "ex")); }
  else if (id === "issho") { // ももたろうと いぬ・さる・きじ
    const i1 = xtra("inu", 880, .62), s1 = xtra("saru", 1060, .62), k1 = xtra("kiji", 1280, .5); k1.y = 560; [i1, s1, k1].forEach(c => c.dx.v = c.dx.t = 0);
    loop(t => { k1.armL.t = k1.armR.t = Math.sin(t * 18) * 50; k1.y = 560 + Math.sin(t * 3) * 14; if (t > 1 && t < 1.05) [i1, s1].forEach(c => jump(c, .4)); }); a.armR.t = -150; }
  else if (id === "gomen") { a.sadMouth = true; a.headRot.t = 10; for (let i = 0; i < 3; i++) later(400 + i * 700, () => mark("drop", ax - 30, base - 360 * a.s, { vy: 120, life: .7 })); }
  else if (id === "tobira") { a.lean.t = -18; a.armL.t = a.armR.t = -90; loop(t => { if (t > 4) { a.lean.t = 0; a.armL.t = a.armR.t = 0; return false; } a.lean.t = -18 + Math.sin(t * 10) * 3; }); word(ax, base - 380, "うーん！"); }
  else if (id === "yobu") { // もんの うえから おにが いっぱい
    const o = el("g", {}, G); for (let i = 0; i < 7; i++) ogMiniOni(o, 430 + i * 125, 330 + (i % 2) * 24, .55, ["#F0645A", "#5B8DEF", "#7BD389"][i % 3]);
    loop(t => o.setAttribute("transform", `translate(0 ${(Math.abs(Math.sin(t * 4)) * -14).toFixed(1)})`)); h.roundMouth = true; later(2500, () => h.roundMouth = false); }
  else if (id === "owari") { later(400, () => joy(a)); later(900, () => confetti(30)); }
  return G; }
/* ---------- 💬 おにごっこの おはなし ---------- */
function ogPick(area) { let pool = OG.sc.filter(s => s.area === area); const m = Math.min(...pool.map(s => OG_N.get(s.id) || 0)); pool = pool.filter(s => (OG_N.get(s.id) || 0) === m); return pool[rnd(pool.length)]; }
async function ogScene(pc) {
  const hero = pc.kind, sc = ogPick(nArea(pc.node)), t = tierOf(); OG_N.set(sc.id, (OG_N.get(sc.id) || 0) + 1);
  showEngine(null, `おにごっこの おはなし（${sc.id}・段${t + 1}）`);
  OG_CUR = sc.id; const { hero: h, ask: a } = setSitView({ id: "og_" + sc.id, place: sc.place, asker: sc.who, intro: "og" }, hero);
  a.dx.v = a.dx.t = 0;
  enter(h); await sleep(900);
  if (!OG_N.get("_intro")) { OG_N.set("_intro", 1); await speak(C.pony, "ogp_say", OG.txt.ogp_say); }
  ogProp(sc, h, a);
  await speak(C.pony, `ogn_${sc.id}`, sc.n);
  if (["tasukete", "oni1", "abunai"].includes(sc.id)) { h.sadMouth = true; playMove(h, "think"); }
  playMove(a, "nod"); await speak(a, `ogw_${sc.id}`, sc.line);
  let okN = 0, nSay = 0; const log = [];
  const step = async (key, text, keys, tag) => { nSay++; const r = await kmSay(h, key, text, keys, tag); if (r.ok) okN++; log.push(`${r.ok ? "○" : "×"}${r.heard}`); return r.ok; };
  await step(`ogs_${sc.id}`, sc.say, sc.keys, "まるシマに なって いおう");
  h.sadMouth = false;
  playMove(a, "nod"); if (SPECIAL[sc.who]) SPECIAL[sc.who](a); await speak(a, `ogr_${sc.id}`, sc.res);
  if (sc.t2 && t >= 1) { playMove(a, "nod"); await speak(a, `ogw2_${sc.id}`, sc.t2.line); await step(`ogs2_${sc.id}`, sc.t2.say, sc.t2.keys, "つづけて いおう"); joy(a); await speak(a, `ogr2_${sc.id}`, sc.t2.res); }
  const ok = okN * 2 >= nSay; grade(ok); GS.tasks++;
  playLog({ type: "oni", id: sc.id, tier: t, okN, nSay, tries: log, ...(MODE === "multi" ? { who: NAMES[hero] } : {}) });
  if (ok) { confetti(36); joy(h); const k = rnd(2) ? "ogp_ok" : "ogp_good"; await speak(C.pony, k, OG.txt[k]); }
  await sleep(400); setView("board"); return ok; }
Object.assign(LTASK_RUN, { og: ogScene });
/* ---------- はじまりの ことば（1かいめの さいころの まえ） ---------- */
{ const mt = multiTurn; multiTurn = async function (pl, first) { if (curStage === "oni" && OGS.round === 0 && pl === PLAYERS[0] && !OGS.told) { OGS.told = 1; setView("board"); markAbove(ogOni(), "ex"); jump(ogOni(), .6); await speak(C.pony, "ogp_intro", OG.txt.ogp_intro); } return mt(pl, first); }; }
/* ---------- 声の パック ---------- */
{ const lp = loadPack; loadPack = async function (id) { const r = await lp(id); if (id !== "oni") return r;
    if (!PACK.loaded.oni) { try { const q = await fetch("packs/oni.json", { cache: "no-cache" }); if (q.ok) { const d = await q.json(); Object.keys(d).forEach(k => AUD[k] = "data:audio/mpeg;base64," + d[k]); PACK.loaded.oni = Object.keys(d); } } catch (e) { } }
    if (AUD.bgm_oni) await voiceBuf("bgm_oni"); return true; }; }
/* ---------- メニューの タイルの 絵 ---------- */
if (typeof A2 !== "undefined") A2.oni = (L, X) => { el("rect", { x: -200, y: 0, width: 880, height: 300, fill: "#BDE3F2" }, L); el("path", { d: "M-200 230 Q100 200 400 230 T680 226 V300 H-200 Z", fill: "#CDE7A8", ...S6(4) }, L);
  ogIsland(L, X(.42), 140, .45); CH(L, "shima", X(-.32), .32, HAPPY); CH(L, "oni", X(.05), .34, HI); };
/* ---------- 手がきの アイコン ---------- */
Object.assign(ICON_DRAW, {
  "🍑": g => { IC.P(g, "M0 -70 Q-80 -70 -76 4 Q-70 66 0 68 Q70 66 76 4 Q80 -70 0 -70 Z", "#FFB3C1", 7); IC.P(g, "M0 -66 Q-16 0 0 64", "none", 5); IC.P(g, "M0 -70 Q-34 -104 -66 -82 Q-34 -60 0 -70 Z", "#7BD389", 5); },
  "👹": g => { IC.C(g, 0, 0, 70, "#F0645A", 7); IC.P(g, "M-40 -50 L-30 -100 L-14 -58 Z M40 -50 L30 -100 L14 -58 Z", "#FFD25E", 5); IC.C(g, -24, -8, 9, INK, 0); IC.C(g, 24, -8, 9, INK, 0); IC.P(g, "M-30 30 L-18 44 L-6 30 L6 44 L18 30 L30 44", "none", 6); },
  "🐒": g => { IC.C(g, -66, 0, 24, "#F5C9A6", 5); IC.C(g, 66, 0, 24, "#F5C9A6", 5); IC.C(g, 0, 0, 66, "#A9744A", 7); IC.E(g, 0, 14, 48, 44, "#F5C9A6", 5); IC.C(g, -18, -6, 7, INK, 0); IC.C(g, 18, -6, 7, INK, 0); IC.P(g, "M-14 32 Q0 42 14 32", "none", 5); },
  "🐦": g => { IC.P(g, "M-30 10 Q-110 0 -140 -40 Q-90 20 -20 30 Z", "#8B6A4B", 5); IC.E(g, 0, 10, 70, 46, "#3E8E6E", 7); IC.C(g, 60, -30, 32, "#E8473C", 6); IC.C(g, 66, -34, 6, INK, 0); IC.P(g, "M88 -26 L112 -20 L88 -12 Z", "#FFB13B", 4); },
  "🌿": g => { [-60, -20, 20, 60].forEach((x, i) => IC.P(g, `M${x} 70 Q${x - 20} -10 ${x + (i % 2 ? 26 : -26)} -70 Q${x + 14} -10 ${x + 14} 70 Z`, i % 2 ? "#4E9A4B" : "#7BD389", 5)); },
  "🚩": g => { IC.P(g, "M-50 90 V-90", "none", 9); IC.P(g, "M-50 -90 L80 -70 L-50 -20 Z", "#FFFFFF", 6); IC.C(g, -6, -60, 14, "#FF8FA3", 3); },
  "🪖": g => { IC.R(g, -100, 10, 200, 44, "#5A5A66", 6, 20); IC.P(g, "M-84 10 L-70 -36 H80 L94 10 Z", "#7BB36A", 6); IC.P(g, "M-40 -36 Q-40 -80 10 -80 Q60 -80 60 -36 Z", "#6FA35E", 6); IC.R(g, -120, -70, 90, 18, "#5A5A66", 4, 8); IC.C(g, -122, -61, 14, "#FFB3C1", 4); },
  "🪧": g => { IC.P(g, "M0 90 V-10", "none", 9); IC.P(g, "M-80 -70 H60 L90 -40 L60 -10 H-80 Z", "#F6E7C8", 6); IC.P(g, "M-50 -40 H30 M10 -56 L30 -40 L10 -24", "none", 6); },
});
if (typeof ALIAS !== "undefined") delete ALIAS["🌿"]; // くさむらは しげみの え（🌱 では なく）
