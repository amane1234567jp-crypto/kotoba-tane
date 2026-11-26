/* ================= ロングコース「のっぺらぼう」（noppera、2026-11-26） =================
   あまねさん：かいだんの コース。つくりかたは うらしまたろう・3びきの こぶたと おなじ「げき」。
   ・🎭 げき：4まく（よるの さかみち → そばやの あかり → わがや → あさまで あそぼう）×6場面。まくの なかは おはなしの じゅん。
     あそぶ ひとは ずっと「たびびと」（あまねさん：ほかの やくに かわると こんらん する）。のっぺらぼうの セリフは のっぺらぼうが いう。
     こわすぎない ように：さいごは のっぺらぼうに かおを かいて あげて、ともだちに なる。
   ・しかけ：おそば（もう1かい）・ちょうちんおばけ（2マス）・ほたる（3マス）・おつきさま（つぎ 2ばい）・おまもり（サイコロ 2こ）
     ・かご／はやかご（ワープ 小・大）・ちゃや（やすみ）・のっぺらぼうが でた（6マス もどる）・こうもり（3マス もどる）・おばけの ぎょうれつ（みんな 2マス）
     ・からかさおばけ（がめんの そとから きて 5マス）・こんにゃく（2マス もどる）・きりで くみかえ。
   ・おもしろ：🏮 ちょうちん えらび・✨ ほたる つかまえ。
   ・👤 だれに みちを きく？（えらぶ しかけ）：うしろむきの 3にん。しんせつな ひと＝4マス すすむ／のっぺらぼう＝2マス もどる／たぬき＝2マス すすむ（しっぽが ちらっと みえる）。
   ・盤：slong.js の NB_PTS（つづらおりの さかみち。ひだりしたから のぼって、ひだりうえの わがやへ）。キャラ：rig/part_chars.js の onna・sobaya・okusan（nbHuman）。
   データと 声：sit/noppera_gen.py → noppera_data.js・sit/pony_noppera.json・aivis/jobs/nb1 */
const NB_N = new Map(), NB_CLEAN = [];
const NBS = { told: 0 };
Object.assign(ASK_AT, { onna: [1230, 1.0], sobaya: [1230, 1.05], okusan: [1230, 1.0] });
Object.assign(KID_S, { onna: 1.0, sobaya: 1.05, okusan: 1.0 });
Object.assign(PIECE_S, { onna: .22, sobaya: .23, okusan: .22 });
const nbI = id => SL_ORDER.noppera.indexOf(id);
const isNB = () => curStage === "noppera";
// かおの きりかえ："back"＝うしろむき、"blank"＝のっぺらぼう、"face"＝ふつうの かお（かいて もらった かお）
function nbFace(c, m) { c.root.querySelectorAll("[data-nb]").forEach(e => e.setAttribute("display", e.getAttribute("data-nb") === m ? "" : "none")); c.nb = m; }
/* ---------- マスの ならび（48） ---------- */
{ const PL = [null, "nb", "nb", "e:chouchin", "nb", "e:soba", "nb", "nchou", "e:kago", "nb", "e:chaya", "nb",
    "nb", "e:omamori", "nb", "e:konnyaku", "nhotaru", "e:koumori", "nb", "nb", "e:hotaru", null, "nb", "e:tsuki",
    "nb", "e:deta", "nb", "e:karakasa", "nb", "e:kago2", "nb", "e:kumikae", "nchou", "e:dare", "nb", "e:gyouretsu",
    "nb", "e:koumori", "nb", "e:dare", "nhotaru", "e:hotaru", "nb", "nb", "e:konnyaku", "nb", "nb", null];
  const BASE = { soba: "again", omamori: "dice2", tsuki: "x2", chaya: "rest", kumikae: "kumikae" };
  const O = SL_ORDER.noppera, ev = {}, task = {};
  O.forEach((id, i) => { const p = PL[i]; if (!p || id === "0" || id === "4" || id === "15") return;
    if (p.startsWith("e:")) { const t = p.slice(2); ev[id] = t === "dare" ? ["dare", 0, "nbp_dare_ask", NB.txt.nbp_dare_ask, t] : [BASE[t] || t, 0, `sl_noppera_${t}`, NB.evt[t], t]; } else task[id] = p; });
  EVENTS.noppera = ev; LONG_TASKS.noppera = task;
  LEGENDS.noppera = [["nb", "げき"], ["nchou", "ちょうちん"], ["nhotaru", "ほたる"]]; }
Object.assign(LTASK, { nb: ["#E9E4FF", "🎭"], nchou: ["#FFE9C7", "🏮"], nhotaru: ["#FFF7B8", "✨"] });
BOARD.noppera.style = () => "yomichi";
ROAD.yomichi = (L, d, a, b, pass) => { if (pass === "under") { pathEl(L, d, { stroke: "#12163A", "stroke-width": 46 }); pathEl(L, d, { stroke: "#8E92C4", "stroke-width": 34 }); } else pathEl(L, d, { stroke: "#C9CCF0", "stroke-width": 5, "stroke-dasharray": "6 22", opacity: .7 }); };
/* ---------- え ---------- */
const NB_SK = "#FFE3CF", NB_HA = "#2B2A33";
function nbLantern(L, x, y, s = 1, face = false, lit = true) { const g = kbG(L, x, y, s); // ちょうちん（まんなかが (x, y)）。face＝ちょうちんおばけ
  if (lit) el("circle", { cx: 0, cy: 0, r: 70, fill: "#FFE27A", opacity: .28 }, g);
  el("path", { d: "M0 -74 V-52", ...S6(4) }, g); el("rect", { x: -20, y: -54, width: 40, height: 12, rx: 3, fill: NB_HA }, g); el("rect", { x: -20, y: 42, width: 40, height: 12, rx: 3, fill: NB_HA }, g);
  el("ellipse", { cx: 0, cy: 0, rx: 38, ry: 44, fill: lit ? "#FFB13B" : "#E9DCC0", ...S6(4) }, g); [-22, 0, 22].forEach(yy => el("path", { d: `M${-36 + Math.abs(yy) * .3} ${yy} Q0 ${yy + 6} ${36 - Math.abs(yy) * .3} ${yy}`, fill: "none", stroke: lit ? "#D9822B" : "#B8A888", "stroke-width": 3 }, g));
  if (face) { el("circle", { cx: 0, cy: -10, r: 13, fill: "#FFFFFF", ...S6(3) }, g); el("circle", { cx: 2, cy: -8, r: 6, fill: INK }, g); el("path", { d: "M-20 14 Q0 26 20 14 Q0 20 -20 14 Z", fill: INK }, g); el("path", { d: "M-4 20 Q0 48 12 40 Q14 28 6 20 Z", fill: "#FF6F91", ...S6(3) }, g); }
  return g; }
function nbFly(L, x, y, s = 1, col = "#FFF27A") { const g = kbG(L, x, y, s); const gl = el("circle", { cx: 0, cy: 0, r: 26, fill: col, opacity: .35 }, g); el("animate", { attributeName: "opacity", values: ".15;.5;.15", dur: `${(.9 + (Math.abs(x) % 7) * .1).toFixed(1)}s`, repeatCount: "indefinite" }, gl);
  el("ellipse", { cx: 0, cy: -4, rx: 7, ry: 9, fill: NB_HA }, g); el("circle", { cx: 0, cy: 6, r: 9, fill: col, stroke: INK, "stroke-width": 2 }, g); return g; }
function nbBat(L, x, y, s = 1) { const g = kbG(L, x, y, s), w = el("g", {}, g); el("path", { d: "M-8 0 Q-30 -34 -62 -14 Q-50 -10 -48 4 Q-36 -4 -30 10 Q-20 2 -8 10 Z M8 0 Q30 -34 62 -14 Q50 -10 48 4 Q36 -4 30 10 Q20 2 8 10 Z", fill: "#4A4070", ...S6(3) }, w);
  el("animateTransform", { attributeName: "transform", type: "scale", values: "1 1;1 .4;1 1", dur: ".28s", repeatCount: "indefinite" }, w); el("ellipse", { cx: 0, cy: 4, rx: 12, ry: 15, fill: "#4A4070", ...S6(3) }, g); el("path", { d: "M-9 -8 l2 -12 l6 9 Z M9 -8 l-2 -12 l-6 9 Z", fill: "#4A4070", ...S6(2) }, g);
  el("circle", { cx: -4, cy: 0, r: 2.5, fill: "#FFE27A" }, g); el("circle", { cx: 4, cy: 0, r: 2.5, fill: "#FFE27A" }, g); return g; }
function nbKasa(L, x, y, s = 1) { const g = kbG(L, x, y, s); // からかさおばけ（あしもとが y）
  el("path", { d: "M-6 -40 V-6", stroke: NB_SK, "stroke-width": 14, "stroke-linecap": "round" }, g); el("path", { d: "M-6 -40 V-6", fill: "none" }, g); el("rect", { x: -26, y: -8, width: 40, height: 9, rx: 3, fill: "#8B5A3C", ...S6(3) }, g); el("path", { d: "M-18 0 v8 M6 0 v8", stroke: "#8B5A3C", "stroke-width": 6 }, g);
  el("path", { d: "M0 -170 Q-66 -110 -58 -40 Q0 -56 58 -40 Q66 -110 0 -170 Z", fill: "#C0504D", ...S6(4) }, g); el("path", { d: "M0 -170 Q-22 -100 -24 -46 M0 -170 Q22 -100 24 -46", fill: "none", stroke: "#8E2E2B", "stroke-width": 3 }, g); el("path", { d: "M0 -170 v-14", ...S6(4) }, g);
  el("circle", { cx: 0, cy: -108, r: 17, fill: "#FFFFFF", ...S6(3) }, g); el("circle", { cx: 3, cy: -106, r: 8, fill: INK }, g); el("path", { d: "M-22 -74 Q0 -62 22 -74 Q0 -68 -22 -74 Z", fill: INK }, g); el("path", { d: "M-4 -68 Q0 -36 14 -44 Q16 -58 8 -68 Z", fill: "#FF6F91", ...S6(3) }, g); return g; }
function nbKago(L, x, y, s = 1) { const g = kbG(L, x, y, s); el("path", { d: "M-120 -92 H120", stroke: "#8B5A3C", "stroke-width": 12, "stroke-linecap": "round" }, g); el("path", { d: "M-120 -92 H120", fill: "none", ...S6(0) }, g);
  el("path", { d: "M-50 -90 L-60 -20 M50 -90 L60 -20", stroke: INK, "stroke-width": 5 }, g); el("path", { d: "M-70 -74 Q0 -98 70 -74 L64 -62 H-64 Z", fill: "#C0504D", ...S6(4) }, g); el("rect", { x: -62, y: -62, width: 124, height: 62, rx: 8, fill: "#E9C46A", ...S6(4) }, g); el("rect", { x: -34, y: -50, width: 68, height: 38, rx: 4, fill: "#FFF4D6", ...S6(3) }, g); return g; }
function nbBowl(L, x, y, s = 1) { const g = kbG(L, x, y, s); [-14, 4, 20].forEach((dx, i) => { const p = el("path", { d: `M${dx} -34 q-10 -14 0 -26 q10 -12 0 -26`, fill: "none", stroke: "#FFFFFF", "stroke-width": 5, "stroke-linecap": "round", opacity: .8 }, g); el("animate", { attributeName: "opacity", values: ".2;.9;.2", dur: `${1.2 + i * .3}s`, repeatCount: "indefinite" }, p); });
  el("ellipse", { cx: 0, cy: -26, rx: 46, ry: 12, fill: "#E7D2A8", ...S6(4) }, g); el("path", { d: "M-46 -26 Q-44 16 -18 20 H18 Q44 16 46 -26 Z", fill: "#3A5A8C", ...S6(4) }, g); el("path", { d: "M-30 -28 q10 -8 20 0 t20 0 t20 0", fill: "none", stroke: "#B8946A", "stroke-width": 4 }, g);
  el("path", { d: "M20 -30 L52 -66 M30 -28 L62 -62", stroke: "#8B5A3C", "stroke-width": 5, "stroke-linecap": "round" }, g); return g; }
// かんたんな ひとの え（盤・パネルよう）。mode："back"・"blank"・"face"
function nbNope(L, x, y, s = 1, kim = "#B9A8D9", mode = "blank", tail = false) { const g = kbG(L, x, y, s); // あしもとが y
  if (tail) el("path", { d: "M26 -20 Q66 -14 64 -50 Q50 -40 30 -44 Z", fill: "#8B5A3C", ...S6(4) }, g);
  el("path", { d: "M-34 0 Q-40 -70 0 -76 Q40 -70 34 0 Z", fill: kim, ...S6(4) }, g); el("path", { d: "M-14 -74 L0 -50 L14 -74", fill: "none", stroke: "#FFFFFF", "stroke-width": 5 }, g); el("path", { d: "M-33 -34 H33 V-22 H-33 Z", fill: "#E8473C", ...S6(3) }, g);
  el("circle", { cx: 0, cy: -108, r: 38, fill: mode === "back" ? NB_HA : NB_SK, ...S6(4) }, g);
  if (mode !== "back") { el("path", { d: "M-38 -108 Q-40 -150 0 -150 Q40 -150 38 -108 Q24 -134 0 -134 Q-24 -134 -38 -108 Z", fill: NB_HA, ...S6(3) }, g);
    if (mode === "face") { el("circle", { cx: -13, cy: -106, r: 4, fill: INK }, g); el("circle", { cx: 13, cy: -106, r: 4, fill: INK }, g); el("path", { d: "M-10 -92 Q0 -82 10 -92", fill: "none", ...S6(3) }, g); el("ellipse", { cx: -22, cy: -96, rx: 6, ry: 4, fill: "#FF9FB0" }, g); el("ellipse", { cx: 22, cy: -96, rx: 6, ry: 4, fill: "#FF9FB0" }, g); } }
  else el("ellipse", { cx: 0, cy: -150, rx: 18, ry: 12, fill: NB_HA, ...S6(3) }, g);
  return g; }
function nbTanuki(L, x, y, s = 1) { const g = kbG(L, x, y, s); el("path", { d: "M26 -20 Q76 -10 72 -60 Q54 -44 30 -48 Z", fill: "#8B5A3C", ...S6(4) }, g); el("ellipse", { cx: 0, cy: -34, rx: 40, ry: 38, fill: "#B8946A", ...S6(4) }, g); el("ellipse", { cx: 0, cy: -26, rx: 24, ry: 24, fill: "#FFF1D6", ...S6(3) }, g);
  el("path", { d: "M-34 -128 l-4 -26 l24 12 Z M34 -128 l4 -26 l-24 12 Z", fill: "#8B5A3C", ...S6(3) }, g); el("circle", { cx: 0, cy: -104, r: 38, fill: "#B8946A", ...S6(4) }, g);
  el("ellipse", { cx: -15, cy: -106, rx: 13, ry: 11, fill: "#5A3C28" }, g); el("ellipse", { cx: 15, cy: -106, rx: 13, ry: 11, fill: "#5A3C28" }, g); el("circle", { cx: -14, cy: -106, r: 4, fill: "#FFFFFF" }, g); el("circle", { cx: 14, cy: -106, r: 4, fill: "#FFFFFF" }, g);
  el("ellipse", { cx: 0, cy: -92, rx: 6, ry: 4, fill: INK }, g); el("path", { d: "M-8 -84 Q0 -78 8 -84", fill: "none", ...S6(3) }, g); el("path", { d: "M-6 -150 q8 -16 22 -8 q-10 8 -22 8 Z", fill: "#5FB35A", ...S6(3) }, g); return g; }
function nbMoon(L, x, y, r = 60) { el("circle", { cx: x, cy: y, r: r * 1.5, fill: "#FFF7C2", opacity: .18 }, L); el("circle", { cx: x, cy: y, r, fill: "#FFF2A8", stroke: "#FFFFFF", "stroke-width": 6 }, L); el("circle", { cx: x - r * .3, cy: y - r * .2, r: r * .16, fill: "#F0DE8A" }, L); el("circle", { cx: x + r * .25, cy: y + r * .3, r: r * .12, fill: "#F0DE8A" }, L); }
function nbWillow(L, x, y, s = 1) { const g = kbG(L, x, y, s); el("path", { d: "M-10 0 Q-16 -120 10 -220 L26 -214 Q4 -120 12 0 Z", fill: "#5A4A3C", ...S6(4) }, g);
  for (let i = 0; i < 7; i++) { const dx = -110 + i * 36; el("path", { d: `M14 -216 Q${dx * .6} -260 ${dx} -150 Q${dx - 6} -90 ${dx + 4} -40`, fill: "none", stroke: i % 2 ? "#4E8A5E" : "#6FA87A", "stroke-width": 9, "stroke-linecap": "round" }, g); } return g; }
function nbStall(L, x, y, s = 1, part = "all") { const g = kbG(L, x, y, s); // そばの やたい（あしもとが y）。part："back"＝やねと はしら、"front"＝だい
  if (part !== "front") { el("path", { d: "M-190 -330 V0 M190 -330 V0", stroke: "#8B5A3C", "stroke-width": 14, "stroke-linecap": "round" }, g); el("path", { d: "M-230 -330 L-200 -400 H200 L230 -330 Z", fill: "#5A4A3C", ...S6(5) }, g);
    [-130, -44, 42, 128].forEach((dx, i) => { el("rect", { x: dx - 40, y: -330, width: 82, height: 74, fill: "#3A5A8C", ...S6(4) }, g); txt(g, dx + 1, -278, "そば"[i % 2], 44, { "text-anchor": "middle", fill: "#FFFFFF", "font-weight": 700 }); });
    nbLantern(g, 236, -250, .9); }
  if (part !== "back") { el("rect", { x: -210, y: -150, width: 420, height: 150, rx: 8, fill: "#C98A4B", ...S6(5) }, g); el("rect", { x: -224, y: -168, width: 448, height: 26, rx: 6, fill: "#8B5A3C", ...S6(5) }, g); for (let i = -2; i <= 2; i++) el("path", { d: `M${i * 80} -140 V-6`, stroke: "#8B5A3C", "stroke-width": 4 }, g); }
  return g; }
function nbGhostArt(L, i) { return [() => nbLantern(L, 0, -60, 1.1, true), () => nbKasa(L, 0, 0, .9), () => nbNope(L, 0, 0, 1, "#B9A8D9"), () => nbNope(L, 0, 0, 1, "#3A5A8C"), () => nbLantern(L, 0, -60, 1.1, true), () => nbNope(L, 0, 0, 1, "#7FB069")][i % 6](); }
Object.assign(OG_VEH, { KAGO: (g, size) => { const o = el("g", {}, g); nbKago(o, 0, 60, size / 170); return o; } });
/* ---------- 盤の しるし ---------- */
const NB_EVC = { soba: "#FFE9C7", chouchin: "#FFD9A0", hotaru: "#FFF7B8", tsuki: "#FFF2A8", omamori: "#FFD9E2", kago: "#F2DCC6", kago2: "#F2DCC6", chaya: "#D8E8C8", deta: "#C9CCF0", koumori: "#B9B4E0", gyouretsu: "#FFD9E2", karakasa: "#F7C4C2", konnyaku: "#D9D9E3", kumikae: "#E6E9FF", dare: "#FFE27A" };
const NB_MARK = {
  soba: g => nbBowl(g, -4, 14, .52), chouchin: g => nbLantern(g, 0, 2, .5, true), hotaru: g => { nbFly(g, -12, 6, .7); nbFly(g, 12, -8, .55); }, kago: g => nbKago(g, 0, 24, .26), kago2: g => nbKago(g, 0, 28, .32),
  tsuki: g => { el("circle", { cx: 0, cy: 0, r: 22, fill: "#FFE27A", ...S6(3) }, g); el("circle", { cx: 9, cy: -6, r: 18, fill: NB_EVC.tsuki }, g); },
  omamori: g => { [[-13, "#E8473C"], [13, "#5B8DEF"]].forEach(([x, c]) => { el("path", { d: `M${x - 10} -12 L${x} -22 L${x + 10} -12 V20 H${x - 10} Z`, fill: c, ...S6(3) }, g); el("rect", { x: x - 5, y: -4, width: 10, height: 16, fill: "#FFFFFF" }, g); }); },
  chaya: g => { el("path", { d: "M-18 -8 H18 L14 18 H-14 Z", fill: "#7FB069", ...S6(3) }, g); el("path", { d: "M-8 -16 q-6 -8 0 -14 M6 -16 q-6 -8 0 -14", fill: "none", stroke: INK, "stroke-width": 3, "stroke-linecap": "round" }, g); },
  deta: g => nbNope(g, 0, 28, .36), koumori: g => nbBat(g, 0, 0, .5), gyouretsu: g => { nbLantern(g, -12, 2, .34, true); nbKasa(g, 14, 26, .26); }, karakasa: g => nbKasa(g, 0, 30, .34),
  konnyaku: g => { el("path", { d: "M0 -30 V-12", ...S6(3) }, g); el("rect", { x: -20, y: -12, width: 40, height: 30, rx: 6, fill: "#A8A8B4", ...S6(3) }, g); [[-8, -2], [6, 6], [-4, 10], [10, -6]].forEach(([x, y]) => el("circle", { cx: x, cy: y, r: 2, fill: "#5A5A66" }, g)); },
  kumikae: g => { el("path", { d: "M-28 -10 q14 -14 28 0 t28 0 M-28 8 q14 -14 28 0 t28 0", fill: "none", stroke: "#8E92C4", "stroke-width": 6, "stroke-linecap": "round" }, g); },
  dare: g => { nbNope(g, -14, 26, .28, "#B9A8D9", "back"); nbNope(g, 14, 26, .28, "#7FB069", "back"); txt(g, 0, -8, "？", 26, { "text-anchor": "middle", "font-weight": 700 }); } };
{ const db = drawBoard; drawBoard = function () { db(); if (!isNB()) return;
    Object.entries(EVENTS.noppera).forEach(([id, e]) => { const [x, y] = NODES[id], t = e[4] || e[0];
      el("circle", { cx: x, cy: y, r: 36, fill: NB_EVC[t] || "#FFF1C9", ...S6(4) }, boardLayer); const g = el("g", { transform: `translate(${x} ${y})` }, boardLayer); (NB_MARK[t] || (() => txt(g, 0, 14, "★", 36, { "text-anchor": "middle" })))(g); }); }; }
/* ---------- 盤の 背景：よるの さかみち。した＝ほりと やなぎ、まんなか＝そばやの あかり、ひだりうえ＝わがや ---------- */
BOARD_BG.noppera = L => {
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#232A5C" }, L); el("rect", { x: 0, y: 0, width: 1600, height: 300, fill: "#1A2050" }, L);
  for (let i = 0; i < 46; i++) { const x = (i * 337 + 60) % 1600, y = 30 + (i * 97) % 270; el("circle", { cx: x, cy: y, r: 2 + (i % 3), fill: "#FFFFFF", opacity: .5 + (i % 4) * .12 }, L); }
  nbMoon(L, 1500, 330, 54);
  el("path", { d: "M0 1000 V900 Q400 960 800 930 T1600 880 V1000 Z", fill: "#2F4F8C", opacity: .8 }, L); for (let i = 0; i < 7; i++) el("path", { d: `M${80 + i * 230} ${958 + (i % 2) * 14} q20 -10 40 0 t40 0`, fill: "none", stroke: "#9FC3E8", "stroke-width": 4, opacity: .6 }, L);
  [0, 1, 2, 3].forEach(r => el("path", { d: `M60 ${948 - r * 160 + (r % 2 ? -62 : 0)} L1540 ${948 - r * 160 + (r % 2 ? 0 : -62)} V${1000 - r * 160} H60 Z`, fill: ["#2C3468", "#333C74", "#3A447F", "#414C8A"][r], opacity: .55 }, L));
  nbWillow(L, 70, 880, .8); nbWillow(L, 1548, 720, .7); nbWillow(L, 60, 560, .6);
  const st = el("g", {}, L); nbStall(st, 1500, 590, .3); el("circle", { cx: 1500, cy: 540, r: 90, fill: "#FFE27A", opacity: .12 }, L);
  const hs = el("g", { transform: "translate(76 318) scale(.46)" }, L); el("rect", { x: -120, y: -140, width: 240, height: 140, fill: "#E7D2A8", ...S6(5) }, hs); el("path", { d: "M-160 -136 L0 -240 L160 -136 Z", fill: "#5A4A3C", ...S6(5) }, hs); el("rect", { x: -90, y: -110, width: 80, height: 110, fill: "#FFF4D6", ...S6(4) }, hs); el("path", { d: "M-50 -110 V0 M-90 -56 H-10", stroke: INK, "stroke-width": 3 }, hs); el("rect", { x: 30, y: -100, width: 60, height: 50, fill: "#FFE27A", ...S6(4) }, hs);
  [[330, 250, .5], [900, 215, .4], [1190, 262, .45]].forEach(([x, y, s]) => nbBat(L, x, y, s)); [[420, 820], [980, 690], [640, 540], [1250, 400], [300, 660]].forEach(([x, y]) => nbFly(L, x, y, .5)); };
/* ---------- こえ・こうしん ---------- */
function nbVoice(kind, x, y, key, mode = "blank") { const c = C[kind]; nbFace(c, mode); place(c, x - 60, y, .3); return speak(c, key, NB.line[key].text); }
function nbTo(pc, d) { const O = SL_ORDER.noppera; return O[Math.max(0, Math.min(O.length - 2, nbI(pc.node) + d))]; }
async function nbMarch(kind) { const g = el("g", {}, front()), L = el("g", {}, g), y = 560; const lab = (t, col) => txt(L, 380, -200, t, 40, { "text-anchor": "middle", fill: col, stroke: "#FFFFFF", "stroke-width": 6, "paint-order": "stroke", "font-weight": 700 });
  if (kind === "koumori") { for (let i = 0; i < 9; i++) nbBat(L, i * 100, (i % 3) * 50 - 60, 1.3); lab("こうもりの むれ", "#4A4070"); }
  else { for (let i = 0; i < 6; i++) { const o = el("g", { transform: `translate(${60 + i * 140} 0)` }, L); nbGhostArt(o, i); } lab("おばけの ぎょうれつ", "#C0504D"); }
  const dir = kind === "koumori" ? -1 : 1, x0 = dir > 0 ? -950 : 1700, x1 = dir > 0 ? 1700 : -950; for (let i = 0; i < 6; i++) later(i * 300, () => blip(kind === "koumori" ? 900 + (i % 2) * 300 : 420 + (i % 3) * 110, kind === "koumori" ? 1400 : 300, .1, kind === "koumori" ? "square" : "triangle"));
  await tween(2600, k => g.setAttribute("transform", `translate(${(x0 + (x1 - x0) * k).toFixed(0)} ${(y - Math.abs(Math.sin(k * 30)) * 16).toFixed(0)})`)); g.remove(); }
// ピースの そばに えを うかべて、いっしょに すすむ（ちょうちんおばけ・ほたる）
async function nbEscort(pc, d, draw) { const g = el("g", {}, front()); draw(g); let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; g.setAttribute("transform", `translate(${(pc.px + 56).toFixed(0)} ${(pc.py - 70 + Math.sin(t * 5) * 8).toFixed(0)})`); }); await sleep(500); await slGo(pc, d); await sleep(300); g.remove(); }
async function nbKarakasa(pc) { const g = el("g", {}, front()); nbKasa(g, 0, 0, 1.5); let x = 1900; const y = pc.py - 20, at = () => g.setAttribute("transform", `translate(${x.toFixed(0)} ${y.toFixed(0)})`); at(); blip(300, 900, .8, "sine");
  await tween(1300, k => { x = 1900 + (pc.px - 1900) * (1 - Math.pow(1 - k, 2)); at(); }); nbVoice("sobaya", pc.px + 260, pc.py - 40, "nbl_karakasa");
  const y0 = pc.py; await tween(700, k => { pc.py = y0 - 130 * k; g.setAttribute("transform", `translate(${pc.px.toFixed(0)} ${(pc.py - 20).toFixed(0)})`); });
  const to = nbTo(pc, 5), [tx, ty] = nodeXY(pc, to), ax = pc.px, ay = pc.py; blip(400, 1200, .5, "sine");
  await tween(1300, k => { pc.px = ax + (tx - ax) * k; pc.py = ay + (ty - ay) * k - Math.sin(k * Math.PI) * 120; g.setAttribute("transform", `translate(${pc.px.toFixed(0)} ${(pc.py - 20).toFixed(0)}) rotate(${(Math.sin(k * 12) * 10).toFixed(0)})`); });
  pc.node = to; pc.px = tx; pc.py = ty; pc.trail = []; jump(pc, .5); chime(); confetti(24);
  await tween(900, k => { g.setAttribute("transform", `translate(${(tx + k * 300).toFixed(0)} ${(ty - 20 - k * 900).toFixed(0)})`); }); g.remove();
  if (to === GOAL && !winner) { winnerPc = pc; winner = pc.kind; } }
/* ---------- 👤 だれに みちを きく？：うしろむきの 3にん ---------- */
async function nbDare(pc) {
  const pl = pc.player, cpu = !pl || pl.cpu, g = panel("だれに みちを きく？", "#2A2F5A"); const K = shuffle(["hito", "nope", "tanuki"]), KIM = ["#B9A8D9", "#7FB069", "#E9A0B0"];
  nbMoon(g, 1380, 250, 44); el("path", { d: "M100 800 Q800 770 1500 800 V900 H100 Z", fill: "#3A447F", ...S6(4) }, g);
  const bs = K.map((k, i) => { const b = el("g", { style: "cursor:pointer" }, g), x = 400 + i * 400; el("ellipse", { cx: x, cy: 800, rx: 150, ry: 26, fill: "#12163A", opacity: .4 }, b); b.fig = el("g", {}, b); nbNope(b.fig, x, 800, 2.3, KIM[i], "back", k === "tanuki"); el("rect", { x: x - 170, y: 360, width: 340, height: 470, fill: "#00000001" }, b); b.x = x; return b; });
  await speak(C.pony, "nbp_dare_ask", NB.txt.nbp_dare_ask);
  const pick = cpu ? (await sleep(900), rnd(3)) : await Promise.race([tapOnce(bs), sleep(15000).then(() => rnd(3))]); bs.forEach(b => b.onclick = null); const kind = K[pick], b = bs[pick], x = b.x; blip(700, 900, .1, "square");
  bs.forEach((o, j) => { if (j !== pick) o.setAttribute("opacity", .35); }); await sleep(500);
  // ふりむく（よこに ちぢんで → ひろがる）
  await tween(350, k => b.fig.setAttribute("transform", `translate(${x} 0) scale(${(1 - k).toFixed(2)} 1) translate(${-x} 0)`)); b.fig.innerHTML = "";
  if (kind === "tanuki") { for (let i = 0; i < 12; i++) mark("puff", x - 80 + rnd(160), 560 + rnd(200), { vx: -200 + rnd(400), vy: -160, life: .7, s: .8 }); noise(.3, 500, .5); nbTanuki(b.fig, x, 800, 2.3); } else nbNope(b.fig, x, 800, 2.3, KIM[pick], kind === "hito" ? "face" : "blank");
  await tween(350, k => b.fig.setAttribute("transform", `translate(${x} 0) scale(${k.toFixed(2)} 1) translate(${-x} 0)`)); b.fig.removeAttribute("transform");
  if (kind === "hito") { chime(); confetti(30); await nbVoice("okusan", x + 300, 700, "nbl_michi", "face"); } else if (kind === "nope") { blip(200, 90, .5, "sawtooth"); await nbVoice("onna", x + 300, 700, "nbl_konnakao"); } else await nbVoice("sobaya", x + 300, 700, "nbl_tanuki", "face");
  const res = `nbp_dare_${kind}`, d = kind === "hito" ? 4 : kind === "nope" ? -2 : 2; playLog({ type: "dare", kind, who: NAMES[pc.kind] }); await speak(C.pony, res, NB.txt[res]); nbFaceReset(); g.remove(); await slGo(pc, d); }
function nbFaceReset() { ["onna", "sobaya", "okusan"].forEach(k => C[k] && nbFace(C[k], "face")); }
/* ---------- しかけ ---------- */
{ const be = boardEvent; boardEvent = async function (pc) {
    const ev = isNB() && EVENTS.noppera[pc.node];
    if (!ev || (pc.player && pc.player.stay)) return be(pc);
    const t = ev[4] || ev[0];
    if (t === "dare") { await sleep(300); markAbove(pc, "q"); chime(); return nbDare(pc); }
    if (["soba", "omamori", "tsuki", "chaya"].includes(t)) { const g = el("g", {}, front()), m = el("g", {}, g); NB_MARK[t](m); let k = 0; addTick(dt => { if (!g.isConnected) return false; k += dt; g.setAttribute("transform", `translate(${pc.px.toFixed(0)} ${(pc.py - 120 + Math.sin(k * 5) * (t === "chaya" ? 2 : 10)).toFixed(0)}) scale(${Math.min(2.6, k * 8).toFixed(2)})`); if (k > 4.5) { g.remove(); return false; } }); return be(pc); }
    if (t === "kumikae") { const g = el("g", {}, front()); for (let i = 0; i < 9; i++) el("ellipse", { cx: -900 + i * 190, cy: 300 + (i % 3) * 220, rx: 330, ry: 110, fill: "#FFFFFF", opacity: .5 }, g); noise(1.2, 400, .3); tween(2200, k => g.setAttribute("transform", `translate(${(k * 3200 - 400).toFixed(0)} 0)`)).then(() => g.remove()); return be(pc); }
    if (!["chouchin", "hotaru", "kago", "kago2", "deta", "koumori", "gyouretsu", "karakasa", "konnyaku"].includes(t)) return be(pc);
    const bad = ["deta", "koumori", "konnyaku"].includes(t); await sleep(300); markAbove(pc, bad ? "drop" : "sparkle"); chime(); await slSay(ev[2], ev[3]);
    try {
      if (t === "chouchin") await nbEscort(pc, 2, g => nbLantern(g, 0, 0, .9, true));
      else if (t === "hotaru") await nbEscort(pc, 3, g => { nbFly(g, 0, 0, 1); nbFly(g, -110, 20, .8); nbFly(g, -40, -50, .7); nbFly(g, 40, 40, .6); });
      else if (t === "kago" || t === "kago2") { const to = slWarpTo("noppera", pc.node, t === "kago" ? "warp" : "bigwarp"); nbVoice("sobaya", pc.px, pc.py, "nbl_kago", "face");
        const sh = setInterval(() => showBanner("えっさ、ほいさ", 900), 1100); try { await slRide(pc, to, "KAGO", { arc: 30, ms: t === "kago" ? 2400 : 3200, size: t === "kago" ? 150 : 180, noflip: true }); } finally { clearInterval(sh); } }
      else if (t === "deta") { const g = el("g", {}, front()); nbNope(g, 0, 0, 1.2, "#B9A8D9", "back"); g.setAttribute("transform", `translate(${(pc.px + 110).toFixed(0)} ${(pc.py + 30).toFixed(0)})`); await sleep(600); g.innerHTML = ""; nbNope(g, 0, 0, 1.2, "#B9A8D9", "blank"); blip(200, 90, .5, "sawtooth"); await nbVoice("onna", pc.px + 260, pc.py - 60, "nbl_konnakao"); jump(pc, .5); await sleep(300); await slGo(pc, -6); g.remove(); }
      else if (t === "koumori") { await nbMarch("koumori"); await slGo(pc, -3); }
      else if (t === "gyouretsu") { nbVoice("onna", 300, 620, "nbl_gyouretsu"); await nbMarch("gyouretsu"); for (const o of PLAYERS.map(p => p.pc)) { jump(o, .5); await slGo(o, 2); if (winner) break; } }
      else if (t === "karakasa") await nbKarakasa(pc);
      else if (t === "konnyaku") { const g = el("g", {}, front()), m = el("g", {}, g); el("path", { d: "M0 -400 V-12", ...S6(3) }, m); NB_MARK.konnyaku(m); m.setAttribute("transform", "scale(1.6)"); await tween(450, k => g.setAttribute("transform", `translate(${(pc.px + 14).toFixed(0)} ${(pc.py - 60 - 300 * (1 - k)).toFixed(0)})`)); noise(.1, 500, .6); blip(500, 200, .2, "sine"); pc.lean.t = 16; jump(pc, .4); await sleep(700); pc.lean.t = 0; await tween(400, k => g.setAttribute("transform", `translate(${(pc.px + 14).toFixed(0)} ${(pc.py - 60 - 500 * k).toFixed(0)})`)); g.remove(); await slGo(pc, -2); }
    } finally { nbFaceReset(); }
    await sleep(300); }; }
{ const mt = multiTurn; multiTurn = async function (pl, first) { if (isNB() && !NBS.told && pl === PLAYERS[0]) { NBS.told = 1; setView("board"); await utCurtain(); await speak(C.pony, "nbp_intro", NB.txt.nbp_intro); } return mt(pl, first); }; }
{ const ap = applyStage; applyStage = function (id, ...a) { if (id === "noppera") { NB_N.clear(); NBS.told = 0; } return ap(id, ...a); }; }
/* ---------- 🏮 ちょうちん えらび ---------- */
async function nbChou(pc) {
  const g = panel("ちょうちん えらび", "#2A2F5A"); const P = shuffle([3, 2, -2, "🎲", "🌱"]);
  el("path", { d: "M100 330 Q800 420 1500 330", fill: "none", ...S6(6) }, g);
  const bs = P.map((p, i) => { const b = el("g", { style: "cursor:pointer" }, g), x = 260 + i * 270, y = 560 - Math.abs(i - 2) * 22; el("path", { d: `M${x} ${y - 190} V${y - 110}`, ...S6(4) }, b); b.lamp = el("g", {}, b); nbLantern(b.lamp, x, y, 2.4, false, false); el("rect", { x: x - 110, y: y - 130, width: 220, height: 280, fill: "#00000001" }, b); b.x = x; b.y = y; return b; });
  await speak(C.pony, "nbp_chouchin", NB.txt.nbp_chouchin);
  const i = await tapOnce(bs); const p = P[i]; blip(500, 900, .2, "sine");
  const reveal = (b, q, big) => { const { x, y } = b; b.lamp.innerHTML = ""; const o = el("g", { opacity: big ? 1 : .6 }, b.lamp); nbLantern(o, x, y, 2.4, q === -2, true);
    if (q === 3 || q === 2) { const n = q === 3 ? 3 : 1; for (let j = 0; j < n; j++) { const dx = (j - (n - 1) / 2) * 44; el("path", { d: `M${x + dx} ${y - 40} V${y + 50}`, stroke: "#B8946A", "stroke-width": 5, "stroke-linecap": "round" }, o); ["#FF9FBF", "#FFFFFF", "#9ADB8A"].forEach((c, m) => el("circle", { cx: x + dx, cy: y - 30 + m * 26, r: 14, fill: c, ...S6(3) }, o)); } }
    else if (typeof q !== "number") txt(o, x, y + 26, q, 70, { "text-anchor": "middle" });
    txt(o, x, y + 210, typeof q === "number" ? (q > 0 ? "+" + q : String(q)) : q, big ? 76 : 50, { "text-anchor": "middle", fill: "#FFFFFF" }); };
  reveal(bs[i], p, true); await sleep(900); bs.forEach((b, j) => { if (j !== i) reveal(b, P[j], false); }); await sleep(1300);
  if (p === 3) await speak(C.pony, "nbp_ch_dango", NB.txt.nbp_ch_dango); else if (p === -2) await speak(C.pony, "nbp_ch_obake", NB.txt.nbp_ch_obake);
  g.remove();
  if (p === "🎲") { slFlag(pc, "dice2"); await speak(C.pony, "sl_st_d2", "サイコロ 2こ！ つぎの ばんで 2こ ふれるよ"); }
  else if (p === "🌱") { if (pc.player) pc.player.ok += 2; GS.ok += 2; GS.pend = 0; confetti(40); await speak(C.pony, "sl_bl_tane", "たねが 2こ でて きた！"); }
  else await delta(pc, p);
  return false; }
/* ---------- ✨ ほたる つかまえ：あみの うえに きたら タッチ ---------- */
async function nbHotaru(pc) {
  const g = panel("ほたる つかまえ", "#2A2F5A"); nbMoon(g, 1380, 260, 44); el("path", { d: "M100 800 Q800 770 1500 800 V900 H100 Z", fill: "#3A6B4A", ...S6(4) }, g);
  for (let i = 0; i < 12; i++) el("path", { d: `M${150 + i * 118} 800 q-6 -70 10 -120 M${170 + i * 118} 800 q10 -50 30 -80`, fill: "none", stroke: "#4E8A5E", "stroke-width": 7, "stroke-linecap": "round" }, g);
  const net = el("g", { transform: "translate(800 760)" }, g); el("path", { d: "M0 100 V-40", stroke: "#8B5A3C", "stroke-width": 12, "stroke-linecap": "round" }, net); el("path", { d: "M-80 -40 Q-70 -130 0 -140 Q70 -130 80 -40 Z", fill: "#FFFFFF", opacity: .35, ...S6(4) }, net); el("ellipse", { cx: 0, cy: -40, rx: 80, ry: 16, fill: "none", ...S6(5) }, net);
  el("path", { d: "M740 440 V700 M860 440 V700", stroke: "#FFFFFF", "stroke-width": 4, "stroke-dasharray": "10 14", opacity: .5 }, g);
  const KT = ["ko", "oo", "ga", "ko", "oo", "ko"]; const its = KT.map((k, i) => { const e = el("g", {}, g); if (k === "ga") { el("path", { d: "M0 0 Q-44 -40 -50 4 Q-40 30 0 8 Q40 30 50 4 Q44 -40 0 0 Z", fill: "#B8A888", ...S6(3) }, e); el("ellipse", { cx: 0, cy: 4, rx: 7, ry: 18, fill: "#8B7A5A", ...S6(2) }, e); } else nbFly(e, 0, 0, k === "oo" ? 2.2 : 1.4);
    return { e, k, x: 1700 + i * 330, y: 470, v: 240 + (i % 3) * 30 }; });
  await speak(C.pony, "nbp_hotaru", NB.txt.nbp_hotaru);
  let tapped = false, got = null, done; const fin = new Promise(r => done = r); const hit = el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#00000001", style: "cursor:pointer" }, g);
  const swing = async () => { if (tapped) return; tapped = true; hit.onclick = null; got = its.filter(o => Math.abs(o.x - 800) < 115).sort((a, b) => Math.abs(a.x - 800) - Math.abs(b.x - 800))[0] || null; blip(300, 700, .15, "sine");
    await tween(300, k => net.setAttribute("transform", `translate(800 ${(760 - 190 * k).toFixed(0)})`));
    if (got) { got.x = 800; got.y = 500; got.e.setAttribute("transform", "translate(800 500)"); chime(); await tween(400, k => { net.setAttribute("transform", `translate(800 ${(570 + 190 * k).toFixed(0)})`); got.y = 500 + 190 * k; got.e.setAttribute("transform", `translate(800 ${got.y.toFixed(0)})`); }); } else { noise(.15, 600, .3); await tween(400, k => net.setAttribute("transform", `translate(800 ${(570 + 190 * k).toFixed(0)})`)); }
    done(); };
  addTick(dt => { if (!g.isConnected) return false; its.forEach(o => { if (o === got) return; o.x -= o.v * dt * (tapped ? .3 : 1); if (o.x < -200) o.x += 1980; o.e.setAttribute("transform", `translate(${o.x.toFixed(0)} ${(o.y + Math.sin(o.x * .02) * 40).toFixed(0)})`); }); });
  hit.onclick = swing; later(11000, swing); await fin; await sleep(700);
  const k = got && got.k, key = k === "oo" ? "nbp_ht_oo" : k === "ko" ? "nbp_ht_ko" : k === "ga" ? "nbp_ht_ga" : "nbp_ht_none"; await speak(C.pony, key, NB.txt[key]);
  g.remove(); const d = k === "oo" ? 3 : k === "ko" ? 2 : k === "ga" ? -1 : 0; if (d) await delta(pc, d); return false; }
/* ---------- 場面の へや ---------- */
function nbNight(L, dawn = false) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: dawn ? "#FFD9C2" : "#1E2452" }, L);
  if (dawn) { el("rect", { x: 0, y: 0, width: 1600, height: 260, fill: "#BFD8F2" }, L); el("rect", { x: 0, y: 260, width: 1600, height: 160, fill: "#FFE9D2" }, L); el("circle", { cx: 1380, cy: 640, r: 150, fill: "#FFE27A", opacity: .4 }, L); el("circle", { cx: 1380, cy: 640, r: 96, fill: "#FFB13B", stroke: "#FFFFFF", "stroke-width": 8 }, L); }
  else { for (let i = 0; i < 40; i++) el("circle", { cx: (i * 337 + 60) % 1600, cy: 30 + (i * 97) % 480, r: 2 + (i % 3), fill: "#FFFFFF", opacity: .5 + (i % 4) * .12 }, L); nbMoon(L, 1400, 200, 62); }
  el("path", { d: "M0 660 Q300 560 620 640 T1200 620 T1600 640 V1000 H0 Z", fill: dawn ? "#A9D98E" : "#2C3A6B", ...S6(5) }, L); el("path", { d: "M0 730 Q400 690 800 720 T1600 710 V1000 H0 Z", fill: dawn ? "#BFE3A6" : "#34447A", ...S6(5) }, L);
  el("rect", { x: 0, y: 800, width: 1600, height: 200, fill: dawn ? "#D9B98A" : "#5A5578" }, L); el("path", { d: "M0 800 H1600", ...S6(5) }, L); }
function nbSaka(L, dawn = false) { nbNight(L, dawn); el("path", { d: "M0 800 V742 H520 V800 Z", fill: dawn ? "#9FC3E8" : "#2F4F8C", ...S6(4) }, L); for (let i = 0; i < 3; i++) el("path", { d: `M${60 + i * 160} ${768 + (i % 2) * 10} q20 -10 40 0 t40 0`, fill: "none", stroke: "#FFFFFF", "stroke-width": 4, opacity: .5 }, L);
  for (let i = 0; i < 6; i++) el("rect", { x: i * 90 - 10, y: 716, width: 84, height: 30, rx: 6, fill: dawn ? "#B8B4A8" : "#6E6A8C", ...S6(4) }, L); nbWillow(L, 150, 800, 1.9); }
const ROOMS_NB = {
  "ちゃや": L => { nbNight(L); const g = el("g", { transform: "translate(1180 800)" }, L); el("rect", { x: -260, y: -330, width: 520, height: 330, fill: "#E7D2A8", ...S6(5) }, g); el("path", { d: "M-310 -320 L-250 -420 H250 L310 -320 Z", fill: "#5A4A3C", ...S6(5) }, g); el("rect", { x: -220, y: -280, width: 180, height: 110, fill: "#C0504D", ...S6(4) }, g); txt(g, -130, -204, "ちゃや", 50, { "text-anchor": "middle", fill: "#FFFFFF", "font-weight": 700 });
    el("rect", { x: 20, y: -270, width: 200, height: 270, fill: "#5A4A3C", ...S6(4) }, g); nbLantern(g, -290, -250, 1); el("rect", { x: -640, y: -70, width: 320, height: 30, rx: 6, fill: "#C0504D", ...S6(5) }, g); el("path", { d: "M-610 -40 V0 M-350 -40 V0", stroke: "#8B5A3C", "stroke-width": 12 }, g); },
  "さかみち": L => nbSaka(L), "くらやみ": L => nbSaka(L), "あさの さかみち": L => nbSaka(L, true),
  "そばや": L => nbNight(L),
  "わがや": L => { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#EFE2C4" }, L); el("rect", { x: 0, y: 0, width: 1600, height: 90, fill: "#8B5A3C", ...S6(5) }, L);
    [[200], [520]].forEach(([x]) => { el("rect", { x, y: 200, width: 300, height: 600, fill: "#FFF9EC", ...S6(6) }, L); for (let i = 1; i < 3; i++) el("path", { d: `M${x + i * 100} 200 V800`, stroke: "#B8946A", "stroke-width": 5 }, L); for (let j = 1; j < 5; j++) el("path", { d: `M${x} ${200 + j * 120} H${x + 300}`, stroke: "#B8946A", "stroke-width": 5 }, L); });
    const a = el("g", { transform: "translate(960 800)" }, L); el("path", { d: "M-40 0 L-30 -150 H30 L40 0 Z", fill: "#FFF4D6", ...S6(5) }, a); el("circle", { cx: 0, cy: -70, r: 80, fill: "#FFE27A", opacity: .3 }, a); el("rect", { x: -46, y: -164, width: 92, height: 16, rx: 4, fill: "#5A4A3C" }, a); el("rect", { x: -46, y: -6, width: 92, height: 12, rx: 4, fill: "#5A4A3C" }, a);
    el("rect", { x: 0, y: 800, width: 1600, height: 200, fill: "#C9D49A" }, L); el("path", { d: "M0 800 H1600", ...S6(5) }, L); for (let x = 0; x < 1600; x += 320) el("path", { d: `M${x} 800 V1000`, stroke: "#5A6B3C", "stroke-width": 6 }, L); el("path", { d: "M0 900 H1600", stroke: "#5A6B3C", "stroke-width": 4, opacity: .5 }, L); },
  "にわ": L => { nbNight(L); const g = el("g", { transform: "translate(240 800)" }, L); el("rect", { x: -260, y: -360, width: 520, height: 360, fill: "#E7D2A8", ...S6(5) }, g); el("path", { d: "M-320 -350 L-240 -470 H240 L320 -350 Z", fill: "#5A4A3C", ...S6(5) }, g); el("rect", { x: -200, y: -300, width: 180, height: 250, fill: "#FFE27A", ...S6(4) }, g); el("path", { d: "M-110 -300 V-50 M-200 -175 H-20", stroke: INK, "stroke-width": 4 }, g); el("rect", { x: -280, y: -50, width: 560, height: 30, fill: "#8B5A3C", ...S6(5) }, g);
    for (let i = 0; i < 6; i++) { el("rect", { x: 1000 + i * 110, y: 660, width: 24, height: 140, fill: "#8B7A5A", ...S6(4) }, L); } el("rect", { x: 980, y: 690, width: 640, height: 20, fill: "#8B7A5A", ...S6(4) }, L); },
};
{ const dr = drawRoom; drawRoom = function (place, noSign = false) {
    if (!isNB() || !ROOMS_NB[place]) return dr(place, noSign); sceneLayer.innerHTML = ""; ROOMS_NB[place](sceneLayer); if (!noSign) { const g = el("g", {}, sceneLayer); el("rect", { x: 520, y: 24, width: 560, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, 44, { "text-anchor": "middle" }); } }; }
/* ---------- たびびとの かさ ---------- */
function nbCostume(c) { const top = (c.top ?? 80) + 24, g = el("g", {}, c.head.g);
  el("path", { d: `M84 ${top + 34} L200 ${top - 58} L316 ${top + 34} Q200 ${top + 58} 84 ${top + 34} Z`, fill: "#E9C46A", ...S6(5) }, g); [[-70], [-34], [0], [34], [70]].forEach(([dx]) => el("path", { d: `M200 ${top - 54} L${200 + dx} ${top + 42 - Math.abs(dx) * .1}`, stroke: "#B8946A", "stroke-width": 4 }, g));
  el("path", { d: `M104 ${top + 20} Q200 ${top + 2} 296 ${top + 20}`, fill: "none", stroke: "#B8946A", "stroke-width": 4 }, g); return () => g.remove(); }
/* ---------- 場面の 小道具と うごき（ナレーションと 絵を そろえる）。after＝セリフを いった あと、after2＝あいての へんじの あと ---------- */
function nbProp(sc, h, a) {
  const G = el("g", {}, propG), hx = h.x + 200 * h.s, ax = a.x + 200 * a.s, base = 975, gy = 800, id = sc.id; let after = null, after2 = null;
  const live = () => G.isConnected && view === "scene";
  const F = () => { const g = el("g", {}, front()); addTick(() => { if (!live()) { g.remove(); return false; } }); return g; };
  const loop = fn => { let t = 0; addTick(dt => { if (!live()) return false; t += dt; return fn(t, dt); }); };
  const word = (x, y, w, col = "#FFFFFF", L = G) => { const g = el("g", {}, L); txt(g, x, y, w, 40, { "text-anchor": "middle", fill: col, stroke: INK, "stroke-width": 7, "paint-order": "stroke", "font-weight": 700 }); return g; };
  const kid = (k, x, s = .62, mode = "blank") => { const c = xtra(k, x, s); c.dx.v = c.dx.t = 0; nbFace(c, mode); return c; };
  const tears = (c, n = 4) => { for (let i = 0; i < n; i++) later(i * 600, () => { if (!live()) return; const p = world(c, 120 + rnd(160), (c.top ?? 80) + 110); mark("drop", p.x, p.y, { vy: 120, life: .7, s: .6 }); }); };
  const scared = (c, ms = 5000) => { c.sadMouth = true; loop(t => { if (t > ms / 1000) { c.lean.t = 0; return false; } c.lean.t = Math.sin(t * 30) * 3; }); NB_CLEAN.push(() => { c.sadMouth = false; c.lean.t = 0; }); };
  // ふりむく：よこに ちぢんで かおを かえて ひろがる
  const turn = async (c, mode) => { const r = c.root, sx0 = c.s; blip(500, 300, .3, "sine"); c.squash.t = .9; await sleep(250); nbFace(c, mode); c.squash.t = 1.06; await sleep(200); c.squash.t = 1; };
  const reveal = async () => { await turn(a, "blank"); blip(200, 90, .6, "sawtooth"); word(ax, base - 560, "つるーん", "#C9CCF0"); jump(h, .6); h.roundMouth = true; markAbove(h, "ex"); later(1800, () => h.roundMouth = false); };
  const flies = (n = 7, x0 = 200, w = 1200) => { const g = el("g", {}, G); for (let i = 0; i < n; i++) { const f = el("g", {}, g); nbFly(f, 0, 0, .8); loop(t => f.setAttribute("transform", `translate(${(x0 + (i * 173) % w + Math.sin(t * .9 + i) * 60).toFixed(0)} ${(380 + (i * 97) % 300 + Math.cos(t * 1.3 + i * 2) * 40).toFixed(0)})`)); } return g; };
  const stall = () => { nbStall(G, ax + 10, base, 1, "back"); nbStall(F(), ax + 10, base, 1, "front"); };
  const back = () => { nbFace(a, "back"); };
  NB_CLEAN.push(() => { nbFaceReset(); a.squash.t = 1; });
  if (id === "dekake") { a.armR.t = -140; later(1800, () => a.armR.t = 0); loop(() => { if (Math.random() < .02) mark("puff", 200 + rnd(1200), 560 + rnd(100), { vx: 60, vy: 0, life: 1.4, s: .5 }); }); }
  else if (id === "chouchin") { const f = F(), lg = el("g", {}, f); nbLantern(lg, 0, 0, 1.1); const at = (x, y) => lg.setAttribute("transform", `translate(${x.toFixed(0)} ${y.toFixed(0)})`); let lx = ax - 150; at(lx, base - 250); el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#0A0C24", opacity: .3, "pointer-events": "none" }, G);
    after2 = async () => { await tween(900, k => at(lx + (hx + 130 - lx) * k, base - 250 - Math.sin(k * Math.PI) * 60)); chime(); joy(h); await sleep(500); }; } // ちょうちんを かして もらう
  else if (id === "naku" || id === "tetsudau") { back(); a.squash.t = .86; a.headRot.t = 8; NB_CLEAN.push(() => a.headRot.t = 0); word(ax, base - 520, "しくしく……", "#BDE3F2"); loop(t => { if (Math.random() < .04) mark("drop", ax - 60 + rnd(120), base - 300, { vy: 140, life: .7, s: .6 }); });
    nbLantern(F(), hx + 130, base - 250, 1.1); if (id === "naku") { h.headRot.t = -8; later(3000, () => h.headRot.t = 0); } }
  else if (id === "furimuku") { back(); nbLantern(F(), hx + 130, base - 250, 1.1); later(2700, () => { if (live()) reveal(); }); after = async () => { scared(h, 3000); await sleep(300); }; }
  else if (id === "nigeru") { const w = kid("onna", 340, .42); w.y = 760; hold(w, "run", 6); loop(t => { w.dx.t = Math.sin(t * 2) * 30; }); scared(h, 5000); for (let i = 0; i < 3; i++) later(i * 700, () => markAbove(h, "drop")); loop(t => { if (t < 5 && Math.random() < .14) mark("puff", hx - 160 + rnd(80), base - 40, { vx: -200, vy: -40, life: .6, s: .5 }); });
    const lg = el("g", {}, G); nbLantern(lg, 0, 0, .5); lg.setAttribute("transform", "translate(1500 520)"); el("circle", { cx: 1500, cy: 520, r: 70, fill: "#FFE27A", opacity: .25 }, G); a.armR.t = -150; later(6000, () => a.armR.t = 0); NB_CLEAN.push(() => a.armR.t = 0); } // みいは とおくの あかりを ゆびさす
  else if (id === "akari" || id === "hanasu" || id === "donna" || id === "konnakao") { stall(); back(); loop(() => { if (Math.random() < .06) mark("puff", ax - 120 + rnd(40), base - 200, { vy: -90, life: 1, s: .4 }); });
    if (id === "akari") { h.squash.t = .94; loop(t => { if (t > 4) { h.squash.t = 1; return false; } h.squash.t = .96 + Math.sin(t * 9) * .03; }); for (let i = 0; i < 3; i++) later(i * 700, () => markAbove(h, "drop"));
      after2 = async () => { const c = el("g", {}, F()); el("path", { d: "M-18 -30 H18 L14 14 H-14 Z", fill: "#BDE3F2", ...S6(4) }, c); await tween(700, k => c.setAttribute("transform", `translate(${(ax - 150 + (hx + 120 - (ax - 150)) * k).toFixed(0)} ${(base - 190 - Math.sin(k * Math.PI) * 50).toFixed(0)})`)); blip(700, 900, .15, "sine"); h.squash.t = 1; await sleep(500); }; }
    else if (id === "hanasu") { a.armR.t = -40; loop(t => { a.armR.t = -40 + Math.sin(t * 6) * 20; }); NB_CLEAN.push(() => a.armR.t = 0); }
    else if (id === "konnakao") { later(1200, () => { if (live()) { a.armL.t = 150; later(900, () => a.armL.t = 0); } }); later(2900, () => { if (live()) reveal(); }); after = async () => { scared(h, 3000); await sleep(300); }; } }
  else if (id === "kieru") { const d = el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#05061A", opacity: 0, "pointer-events": "none" }, F()); blip(600, 150, .5, "sine"); tween(700, k => d.setAttribute("opacity", (.82 * k).toFixed(2))); scared(h, 5000); const wd = word(800, 300, "まっくら……", "#C9CCF0", F());
    after2 = async () => { wd.remove(); const g = flies(8); front().appendChild(g); NB_CLEAN.push(() => g.remove()); chime(); await tween(900, k => d.setAttribute("opacity", (.82 - .5 * k).toFixed(2))); h.sadMouth = false; await sleep(400); }; }
  else if (id === "otomo") { flies(7); nbLantern(F(), hx + 130, base - 250, 1.1); after2 = async () => { hold(h, "run", 1.2); hold(a, "run", 1.2); await sleep(900); }; }
  else if (id === "tadaima" || id === "nikai" || id === "okusan") { back(); const f = F(), ax0 = ax; { const ax = ax0 + 215; el("rect", { x: ax - 150, y: base - 150, width: 300, height: 150, rx: 10, fill: "#8E8478", ...S6(5) }, f); el("path", { d: `M${ax - 60} ${base - 20} Q${ax} ${base - 90} ${ax + 60} ${base - 20} Z`, fill: "#3A2E2E" }, f); el("path", { d: `M${ax - 70} ${base - 210} H${ax + 70} Q${ax + 74} ${base - 150} ${ax + 40} ${base - 150} H${ax - 40} Q${ax - 74} ${base - 150} ${ax - 70} ${base - 210} Z`, fill: "#5A5A66", ...S6(5) }, f); }
    loop(() => { if (Math.random() < .08) mark("puff", ax + 175 + rnd(80), base - 230, { vy: -100, life: 1, s: .4 }); }); if (id !== "tadaima") loop(t => { a.armR.t = -50 + Math.sin(t * 5) * 20; }); NB_CLEAN.push(() => a.armR.t = 0);
    if (id === "tadaima") { h.sadMouth = true; for (let i = 0; i < 3; i++) later(i * 700, () => markAbove(h, "drop")); later(4000, () => h.sadMouth = false); }
    if (id === "okusan") { markAbove(h, "q"); after = async () => { await reveal(); await sleep(500); }; after2 = async () => { flop(h); await sleep(900); }; } }
  else if (id === "futon") { nbFace(a, "blank"); const f = F(); el("path", { d: `M${hx - 230} ${base} Q${hx - 240} ${base - 250} ${hx} ${base - 270} Q${hx + 240} ${base - 250} ${hx + 230} ${base} Z`, fill: "#E98AA0", ...S6(5) }, f); for (let i = -2; i <= 2; i++) el("circle", { cx: hx + i * 80, cy: base - 120 + Math.abs(i) * 30, r: 16, fill: "#FFFFFF", opacity: .7 }, f);
    scared(h, 6000); loop(t => { f.setAttribute("transform", `translate(${(Math.sin(t * 30) * 3).toFixed(1)} 0)`); if (t > 6) { f.setAttribute("transform", ""); return false; } }); word(hx, base - 520, "ぶるぶる……", "#BDE3F2"); }
  else if (id === "naze") { nbFace(a, "blank"); h.headRot.t = -6; later(3000, () => h.headRot.t = 0); markAbove(h, "q"); after2 = async () => { a.headRot.t = 10; tears(a, 3); NB_CLEAN.push(() => a.headRot.t = 0); await sleep(900); }; }
  else if (id === "tomodachi") { nbFace(a, "blank"); a.headRot.t = 12; a.squash.t = .94; tears(a, 5); NB_CLEAN.push(() => a.headRot.t = 0); after = async () => { h.armR.t = -120; await sleep(500); h.armR.t = 0; }; after2 = async () => { a.headRot.t = 0; a.squash.t = 1; joy(a); for (let i = 0; i < 5; i++) later(i * 250, () => mark("heart", (hx + ax) / 2 - 100 + rnd(200), base - 420, { vy: -40, life: 1, s: .8 })); await sleep(900); }; }
  else if (id === "minna") { nbFace(a, "blank"); const k1 = kid("onna", 830), k2 = kid("okusan", 1010); [k1, k2].forEach((c, i) => { c.dx.v = 500; c.dx.t = 0; hold(c, "run", 1 + i * .3); }); after2 = async () => { joy(a); jump(k1, .5); jump(k2, .5); confetti(24); await sleep(700); }; }
  else if (id === "fude" || id === "kaketa") { nbFace(a, "blank"); const f = F(), br = el("g", {}, f); el("path", { d: "M0 0 L18 -110", stroke: "#8B5A3C", "stroke-width": 9, "stroke-linecap": "round" }, br); el("path", { d: "M-8 0 Q0 34 4 0 Z", fill: INK, ...S6(2) }, br); el("path", { d: "M-9 -4 L9 -4 L7 4 L-7 4 Z", fill: "#D9DEE6", ...S6(2) }, br);
    let bx = hx + 130, by = base - 230; const at = () => br.setAttribute("transform", `translate(${bx.toFixed(0)} ${by.toFixed(0)})`); at();
    if (id === "fude") { h.armR.t = -120; later(2500, () => h.armR.t = 0); loop(t => { if (t < 3 && Math.random() < .1) mark("sparkle", bx - 20 + rnd(40), by - 120 + rnd(40), { vy: -20, life: .6, s: .5 }); }); }
    else { const fp = world(a, 200, (a.top ?? 80) + 120); loop(t => { if (t < .8) { bx = hx + 130 + (fp.x - 30 - hx - 130) * (t / .8); by = base - 230 + (fp.y + 60 - (base - 230)) * (t / .8); } else if (t < 2.8) { bx = fp.x - 30 + Math.sin(t * 9) * 40; by = fp.y + 60 + Math.cos(t * 7) * 30; if (Math.random() < .1) blip(900 + rnd(300), 700, .05, "sine"); } else if (t < 3.4) { bx += (hx + 130 - bx) * .15; by += (base - 230 - by) * .15; } at(); });
      later(2800, () => { if (!live()) return; nbFace(a, "face"); chime(); for (let i = 0; i < 8; i++) mark("sparkle", fp.x - 80 + rnd(160), fp.y - 40 + rnd(160), { vy: -30, life: .9, s: .7 }); }); after2 = async () => { joy(a); await sleep(700); }; } }
  else if (id === "kagami") { nbFace(a, "face"); const f = F(), mx = ax - 190; el("ellipse", { cx: mx, cy: base - 260, rx: 70, ry: 86, fill: "#BDE3F2", ...S6(6) }, f); el("path", { d: `M${mx - 30} ${base - 300} l30 -30 M${mx - 10} ${base - 240} l40 -40`, stroke: "#FFFFFF", "stroke-width": 7, "stroke-linecap": "round" }, f); el("path", { d: `M${mx} ${base - 174} V${base - 60}`, stroke: "#C0504D", "stroke-width": 16, "stroke-linecap": "round" }, f);
    a.eyeScale.t = 1.3; NB_CLEAN.push(() => a.eyeScale.t = 1); later(1500, () => { if (live()) joy(a); }); loop(() => { if (Math.random() < .06) mark("sparkle", mx - 60 + rnd(120), base - 340 + rnd(160), { vy: -20, life: .7, s: .6 }); }); after2 = async () => { for (let i = 0; i < 5; i++) later(i * 200, () => mark("heart", ax - 100 + rnd(200), base - 460, { vy: -40, life: 1, s: .8 })); await sleep(800); }; }
  else if (id === "osoba") { stall(); nbFace(a, "face"); const k1 = kid("onna", 760, .62, "face"), k2 = kid("okusan", 930, .62, "face"); const f = F(); nbBowl(f, ax - 130, base - 175, 1); nbBowl(f, ax + 110, base - 175, 1); const hb = el("g", {}, f); nbBowl(hb, hx + 130, base - 210, 1.1);
    loop(t => { h.armR.t = -70 + Math.sin(t * 6) * 20; if (Math.random() < .03) blip(300, 260, .08, "sawtooth"); }); NB_CLEAN.push(() => h.armR.t = 0); after2 = async () => { joy(a); await sleep(600); }; }
  else if (id === "asa") { nbFace(a, "face"); const k1 = kid("sobaya", 1420, .55, "face"), k2 = kid("okusan", 1010, .55, "face"); [a, k1, k2].forEach((c, i) => { c.armR.t = -150; loop(t => { c.armR.t = -150 + Math.sin(t * 7 + i) * 20; }); }); NB_CLEAN.push(() => { [a, k1, k2].forEach(c => c.armR.t = 0); h.armL.t = 0; });
    later(5200, () => { if (live()) word(800, 240, "めでたし、めでたし", "#C0504D"); }); after = async () => { h.armL.t = 150; await sleep(400); }; after2 = async () => { confetti(30); [a, k1, k2].forEach(c => { hold(c, "run", 1.6); c.dx.t = 700; }); await sleep(1500); }; } // てを ふって かえって いく
  return { G, after: () => after && after(), after2: () => after2 && after2() }; }
/* ---------- 🎭 げき ---------- */
function nbPick(area) { const pool = NB.sc.filter(s => s.area === area); const m = Math.min(...pool.map(s => NB_N.get(s.id) || 0)); return pool.find(s => (NB_N.get(s.id) || 0) === m); }
async function nbScene(pc) {
  const hero = pc.kind, sc = nbPick(nArea(pc.node)), t = tierOf(); NB_N.set(sc.id, (NB_N.get(sc.id) || 0) + 1);
  showEngine(null, `のっぺらぼうの げき（${sc.id}・段${t + 1}）`);
  const who = sc.who === hero ? (hero === "gao" ? "tora" : "gao") : sc.who;
  const { hero: h, ask: a } = setSitView({ id: "nb_" + sc.id, place: sc.place, asker: who, intro: "nb" }, hero);
  a.dx.v = a.dx.t = 0; NB_CLEAN.push(nbCostume(h));
  const role = NB.role[sc.role], chip = el("g", {}, propG); el("rect", { x: 40, y: 150, width: 470, height: 70, rx: 35, fill: "#FFE27A", ...S6(5) }, chip); txt(chip, 275, 200, `やく：${role}`, 34, { "text-anchor": "middle", "font-weight": 700 });
  try {
    enter(h); await sleep(900);
    if (!NB_N.get("_intro")) { NB_N.set("_intro", 1); await speak(C.pony, "nbp_say", NB.txt.nbp_say); }
    const pr = nbProp(sc, h, a);
    await speak(C.pony, `nbn_${sc.id}`, sc.n);
    if (a.nb !== "back" && a.nb !== "blank") playMove(a, "nod"); await speak(a, `nbw_${sc.id}`, sc.line);
    let okN = 0, nSay = 0; const log = [];
    const step = async (key, text, keys, tag) => { nSay++; const r = await kmSay(h, key, text, keys, tag); if (r.ok) okN++; log.push(`${r.ok ? "○" : "×"}${r.heard}`); return r.ok; };
    await step(`nbs_${sc.id}`, sc.say, sc.keys, `${role}に なって いおう`);
    await pr.after(); if (!["furimuku", "konnakao"].includes(sc.id)) h.sadMouth = false;
    await speak(a, `nbr_${sc.id}`, sc.res); await pr.after2();
    if (sc.t2 && t >= 1) { await speak(a, `nbw2_${sc.id}`, sc.t2.line); await step(`nbs2_${sc.id}`, sc.t2.say, sc.t2.keys, "つづけて いおう"); await speak(a, `nbr2_${sc.id}`, sc.t2.res); }
    const ok = okN * 2 >= nSay; grade(ok); GS.tasks++;
    playLog({ type: "noppera", id: sc.id, tier: t, okN, nSay, tries: log, ...(MODE === "multi" ? { who: NAMES[hero] } : {}) });
    if (ok) { confetti(36); joy(h); const k = rnd(2) ? "nbp_ok" : "nbp_good"; await speak(C.pony, k, NB.txt[k]); }
    await sleep(400); return ok;
  } finally { NB_CLEAN.splice(0).forEach(f => { try { f(); } catch (e) { } }); h.sadMouth = false; h.roundMouth = false; h.lean.t = 0; h.squash.t = 1; h.headRot.t = 0; h.armR.t = 0; setView("board"); } }
Object.assign(LTASK_RUN, { nb: nbScene, nchou: nbChou, nhotaru: nbHotaru });
/* ---------- 声の パック ---------- */
{ const lp = loadPack; loadPack = async function (id) { const r = await lp(id); if (id !== "noppera") return r;
    if (!PACK.loaded.noppera) { try { const q = await fetch("packs/noppera.json", { cache: "no-cache" }); if (q.ok) { const d = await q.json(); Object.keys(d).forEach(k => AUD[k] = "data:audio/mpeg;base64," + d[k]); PACK.loaded.noppera = Object.keys(d); } } catch (e) { } }
    if (AUD.bgm_noppera) await voiceBuf("bgm_noppera"); return true; }; }
/* ---------- メニューの タイルの 絵 ---------- */
if (typeof A2 !== "undefined") A2.noppera = (L, X) => { el("rect", { x: -200, y: 0, width: 880, height: 300, fill: "#1E2452" }, L); for (let i = 0; i < 16; i++) el("circle", { cx: -180 + (i * 131) % 840, cy: 14 + (i * 47) % 150, r: 2 + (i % 2), fill: "#FFFFFF", opacity: .7 }, L); nbMoon(L, X(.42), 62, 30);
  el("path", { d: "M-200 226 Q100 196 400 222 T680 216 V300 H-200 Z", fill: "#34447A", ...S6(4) }, L); nbWillow(L, X(-.44), 262, .62); nbLantern(L, X(-.18), 150, .7, true); nbNope(L, X(.1), 268, 1.05, "#B9A8D9", "blank"); nbKasa(L, X(.34), 262, .62); nbFly(L, X(-.02), 70, .5); nbFly(L, X(.24), 110, .4); };
/* ---------- 手がきの アイコン ---------- */
Object.assign(ICON_DRAW, {
  "🏮": g => { IC.P(g, "M-26 -70 H26 V-54 H-26 Z M-26 54 H26 V70 H-26 Z", "#2B2A33", 5); IC.P(g, "M0 -56 Q-70 -50 -70 0 Q-70 50 0 56 Q70 50 70 0 Q70 -50 0 -56 Z", "#FFB13B", 7); IC.P(g, "M-62 -20 Q0 -8 62 -20 M-66 10 Q0 22 66 10", "none", 4); },
});
