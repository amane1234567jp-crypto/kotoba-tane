/* ================= ロングコース「3びきの こぶた」（kobuta、2026-11-26） =================
   あまねさん：うらしまたろうと おなじく、おはなしを みんなで さいげん する「げき」。セリフを あそぶ ひとに いって もらう。コースは うずまき。
   ・🎭 げき：4まく（いえを つくろう → わらの いえ → きの いえ・れんがの いえ → えんとつ・めでたし）×6場面。まくの なかは おはなしの じゅん。
     やく＝こぶた（1ばんめ・2ばんめ・3ばんめ）と おおかみ。おおかみの やくで「ふーっと ふいて、ふきとばすぞ！」と いうと、いえが とんで いく。
   ・しかけ（うらしまたろうと おなじ しゅるいを こぶたの せかいに）：りんご（もう1かい）・にぐるま（2マス）・ことり（3マス）・おべんとう（つぎ 2ばい）・かなづちと のこぎり（サイコロ 2こ）
     ・たる（ごろごろ ワープ、小・大）・わらの ベッド（やすみ）・おおかみに みつかった（6マス もどる）・からす（3マス もどる）・こぶたの こうしん（みんな 2マス）
     ・つむじかぜ（がめんの そとから きて 5マス とばす）・どろんこ（2マス もどる）・おおかぜで くみかえ。
   ・おもしろ：🚪 ドア あけ（かいがら あけの かわり）・🍎 りんご キャッチ（さかなつりの かわり）。
   ・🏠 いえづくり（たまてばこの かわりの えらぶ しかけ）：わら・き・れんがから えらんで いえを つくる → おおかみが ふーっ。
     わら＝すぐ できるが とばされて 2マス もどる。き＝はんぶんの かくりつで たえる（2マス すすむ／2マス もどる）。れんが＝びくとも しない、4マス すすむ。
   ・盤：slong.js の KB_PTS（うずまき。まんなかが れんがの いえ）。キャラ：rig/part_chars.js の kobuta1〜3・butamama・ookamik。
   データと 声：sit/kobuta_gen.py → kobuta_data.js・sit/pony_kobuta.json・aivis/jobs/kb3 */
const KB_N = new Map(), KB_CLEAN = [];
const KBS = { told: 0 };
Object.assign(ASK_AT, { kobuta1: [1230, .95], kobuta2: [1230, .95], kobuta3: [1230, .95], butamama: [1230, 1.1], ookamik: [1230, 1.1] });
Object.assign(KID_S, { kobuta1: .95, kobuta2: .95, kobuta3: .95, butamama: 1.1, ookamik: 1.1 });
Object.assign(PIECE_S, { kobuta1: .21, kobuta2: .21, kobuta3: .21, butamama: .23, ookamik: .24 });
const kbI = id => SL_ORDER.kobuta.indexOf(id);
const isKB = () => curStage === "kobuta";
/* ---------- マスの ならび（48） ---------- */
{ const PL = [null, "kb", "kb", "e:niguruma", "kb", "e:ringo", "kb", "kdoor", "e:taru", "kb", "e:warabed", "kb",
    "kb", "e:dougu", "kb", "e:doro", "kringo", "e:karasu", "kb", "kb", "e:kotori", null, "kb", "e:bentou",
    "kb", "e:mitsuketa", "kb", "e:tsumuji", "kb", "e:taru2", "kb", "e:kumikae", "kdoor", "e:ie", "kb", "e:kyoudai",
    "kb", "e:karasu", "kb", "e:ie", "kringo", "e:kotori", "kb", "kb", "e:doro", "kb", "kb", null];
  const BASE = { ringo: "again", dougu: "dice2", bentou: "x2", warabed: "rest", kumikae: "kumikae" };
  const O = SL_ORDER.kobuta, ev = {}, task = {};
  O.forEach((id, i) => { const p = PL[i]; if (!p || id === "0" || id === "4" || id === "15") return;
    if (p.startsWith("e:")) { const t = p.slice(2); ev[id] = t === "ie" ? ["ie", 0, "kbp_ie_ask", KB.txt.kbp_ie_ask, t] : [BASE[t] || t, 0, `sl_kobuta_${t}`, KB.evt[t], t]; } else task[id] = p; });
  EVENTS.kobuta = ev; LONG_TASKS.kobuta = task;
  LEGENDS.kobuta = [["kb", "げき"], ["kdoor", "ドア あけ"], ["kringo", "りんご"]]; }
Object.assign(LTASK, { kb: ["#FFE9F2", "🎭"], kdoor: ["#FFF4E6", "🚪"], kringo: ["#E3F6D8", "🍎"] });
BOARD.kobuta.style = () => "tsuchi";
/* ---------- え ---------- */
const kbG = (L, x, y, s = 1) => el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L);
function kbHouse(L, x, y, s = 1, kind = "wara") { const g = kbG(L, x, y, s); // あしもとが (x, y)。はば 300 くらい
  if (kind === "wara") { el("path", { d: "M-130 0 V-110 Q-130 -150 0 -150 Q130 -150 130 -110 V0 Z", fill: "#F3DC8A", ...S6(5) }, g); for (let i = -110; i <= 110; i += 22) el("path", { d: `M${i} -6 V-${100 + (Math.abs(i) % 44)}`, stroke: "#C9A64B", "stroke-width": 4, "stroke-linecap": "round" }, g);
    el("path", { d: "M-170 -110 Q-60 -250 0 -260 Q60 -250 170 -110 Q0 -150 -170 -110 Z", fill: "#E9C46A", ...S6(5) }, g); for (let i = -120; i <= 120; i += 30) el("path", { d: `M${i * .2} -250 L${i} -128`, stroke: "#B8946A", "stroke-width": 4, "stroke-linecap": "round" }, g);
    el("path", { d: "M-10 -262 l-14 -30 M0 -264 v-34 M10 -262 l14 -30", stroke: "#C9A64B", "stroke-width": 6, "stroke-linecap": "round" }, g); }
  else if (kind === "ki") { el("rect", { x: -130, y: -150, width: 260, height: 150, fill: "#C98A4B", ...S6(5) }, g); for (let i = 1; i < 5; i++) el("path", { d: `M-130 ${-i * 30} H130`, stroke: "#8B5A3C", "stroke-width": 4 }, g); [[-90, -22], [70, -52], [-30, -112], [100, -128]].forEach(([cx, cy]) => el("circle", { cx, cy, r: 4, fill: "#8B5A3C" }, g));
    el("path", { d: "M-160 -146 L0 -260 L160 -146 Z", fill: "#8B5A3C", ...S6(5) }, g); el("path", { d: "M-110 -180 H110 M-60 -214 H60", stroke: "#6E4630", "stroke-width": 4 }, g); }
  else { const mama = kind === "mama", wall = mama ? "#FFF4EA" : "#D9694F"; el("rect", { x: 70, y: -280, width: 44, height: 110, fill: mama ? "#B8946A" : "#B8473A", ...S6(5) }, g); el("rect", { x: 62, y: -292, width: 60, height: 18, rx: 4, fill: "#8E8478", ...S6(4) }, g);
    el("rect", { x: -130, y: -150, width: 260, height: 150, fill: wall, ...S6(5) }, g);
    if (!mama) for (let r = 0; r < 6; r++) { el("path", { d: `M-130 ${-r * 25} H130`, stroke: "#B8473A", "stroke-width": 3 }, g); for (let c = 0; c < 6; c++) el("path", { d: `M${-130 + c * 48 + (r % 2 ? 24 : 0)} ${-r * 25} v-25`, stroke: "#B8473A", "stroke-width": 3 }, g); }
    el("path", { d: "M-160 -146 L0 -250 L160 -146 Z", fill: mama ? "#E8473C" : "#6E6560", ...S6(5) }, g); }
  el("path", { d: "M-34 0 V-76 Q-34 -100 0 -100 Q34 -100 34 -76 V0 Z", fill: kind === "wara" ? "#B8946A" : "#8B5A3C", ...S6(5) }, g); el("circle", { cx: 20, cy: -46, r: 5, fill: "#FFD25E", ...S6(2) }, g);
  if (kind !== "wara") { el("rect", { x: 62, y: -110, width: 48, height: 44, rx: 4, fill: "#BDE3F2", ...S6(4) }, g); el("path", { d: "M86 -110 v44 M62 -88 h48", stroke: INK, "stroke-width": 3 }, g); }
  return g; }
function kbPig(L, x, y, s = 1, col = "#5B8DEF") { const g = kbG(L, x, y, s);
  el("ellipse", { cx: 0, cy: 12, rx: 24, ry: 24, fill: col, ...S6(4) }, g); el("path", { d: "M-22 -44 l-10 -18 l22 6 Z M22 -44 l10 -18 l-22 6 Z", fill: "#FF9FB5", ...S6(3) }, g); el("circle", { cx: 0, cy: -26, r: 26, fill: "#FFC2CF", ...S6(4) }, g);
  el("ellipse", { cx: 0, cy: -20, rx: 11, ry: 8, fill: "#FF9FB5", ...S6(3) }, g); el("circle", { cx: -4, cy: -20, r: 2, fill: "#C45A78" }, g); el("circle", { cx: 4, cy: -20, r: 2, fill: "#C45A78" }, g);
  el("circle", { cx: -10, cy: -32, r: 3.5, fill: INK }, g); el("circle", { cx: 10, cy: -32, r: 3.5, fill: INK }, g); return g; }
function kbWolf(L, x, y, s = 1) { const g = kbG(L, x, y, s); // おおかみ（ひだりむきに ふく）
  el("path", { d: "M30 30 Q70 40 74 0 Q60 10 40 6 Z", fill: "#8E8E9E", ...S6(4) }, g); el("ellipse", { cx: 0, cy: 20, rx: 34, ry: 36, fill: "#8E8E9E", ...S6(4) }, g); el("ellipse", { cx: -4, cy: 30, rx: 18, ry: 22, fill: "#E6E6EE" }, g);
  el("path", { d: "M-34 -64 L-24 -104 L-4 -72 Z M34 -64 L24 -104 L4 -72 Z", fill: "#8E8E9E", ...S6(4) }, g); el("circle", { cx: 0, cy: -44, r: 38, fill: "#8E8E9E", ...S6(4) }, g);
  el("path", { d: "M-20 -40 Q-70 -44 -78 -24 Q-60 -8 -22 -16 Z", fill: "#E6E6EE", ...S6(4) }, g); el("circle", { cx: -76, cy: -28, r: 7, fill: INK }, g);
  el("path", { d: "M-22 -62 l22 8", stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }, g); el("circle", { cx: -8, cy: -50, r: 5, fill: INK }, g); el("path", { d: "M-56 -14 l5 10 l5 -10", fill: "#FFFFFF", ...S6(2) }, g); return g; }
function kbWind(L, x0, y0, x1, y1, n = 5) { const g = el("g", {}, L); for (let i = 0; i < n; i++) { const oy = (i - (n - 1) / 2) * 34, p = el("path", { d: `M${x0} ${y0 + oy * .3} Q${(x0 + x1) / 2} ${(y0 + y1) / 2 + oy - 30} ${x1} ${y1 + oy}`, fill: "none", stroke: "#FFFFFF", "stroke-width": 9, "stroke-linecap": "round", "stroke-dasharray": "50 40", opacity: .9 }, g);
    el("animate", { attributeName: "stroke-dashoffset", values: "0;-180", dur: ".5s", repeatCount: "indefinite" }, p); } return g; }
function kbCart(L, x, y, s = 1) { const g = kbG(L, x, y, s); el("path", { d: "M-80 -70 Q-60 -130 0 -128 Q60 -130 80 -70 Z", fill: "#F3DC8A", ...S6(5) }, g); for (let i = -50; i <= 50; i += 25) el("path", { d: `M${i} -74 q6 -24 -4 -44`, fill: "none", stroke: "#C9A64B", "stroke-width": 4 }, g);
  el("path", { d: "M-90 -70 H90 L76 -24 H-76 Z", fill: "#B8946A", ...S6(5) }, g); el("path", { d: "M90 -60 H150", stroke: INK, "stroke-width": 9, "stroke-linecap": "round" }, g); [-46, 46].forEach(cx => { el("circle", { cx, cy: -8, r: 26, fill: "#8B5A3C", ...S6(5) }, g); el("circle", { cx, cy: -8, r: 6, fill: "#FFD25E", ...S6(2) }, g); }); return g; }
function kbBird(L, x, y, s = 1, col = "#7FCBF0") { const g = kbG(L, x, y, s); const w = el("path", { d: "M-6 -6 Q-30 -60 20 -50 Q14 -26 10 -6 Z", fill: "#5AA5D8", ...S6(4) }, g); el("animateTransform", { attributeName: "transform", type: "scale", values: "1 1;1 -.5;1 1", dur: ".3s", repeatCount: "indefinite" }, w);
  el("path", { d: "M-30 0 L-56 -14 L-50 10 Z", fill: col, ...S6(3) }, g); el("ellipse", { cx: 0, cy: 0, rx: 34, ry: 24, fill: col, ...S6(4) }, g); el("circle", { cx: 26, cy: -14, r: 16, fill: col, ...S6(4) }, g); el("circle", { cx: 30, cy: -16, r: 3.5, fill: INK }, g); el("path", { d: "M40 -12 L56 -8 L40 -2 Z", fill: "#FFB13B", ...S6(3) }, g); return g; }
function kbCrow(L, x, y, s = 1) { const g = kbBird(L, x, y, s, "#3A3944"); g.querySelector("path").setAttribute("fill", "#2B2A33"); return g; }
function kbBarrel(L, x, y, s = 1) { const g = kbG(L, x, y, s), r = el("g", {}, g); el("ellipse", { cx: 0, cy: 0, rx: 56, ry: 46, fill: "#C98A4B", ...S6(5) }, r); el("path", { d: "M-36 -36 V36 M36 -36 V36", stroke: "#5A5A66", "stroke-width": 8 }, r); el("path", { d: "M-56 0 H56 M-12 -45 V45 M12 -45 V45", stroke: "#8B5A3C", "stroke-width": 3 }, r);
  el("animateTransform", { attributeName: "transform", type: "rotate", values: "0;360", dur: ".7s", repeatCount: "indefinite" }, r); return g; }
function kbApple(L, x, y, s = 1, col = "#E8473C") { const g = kbG(L, x, y, s); el("path", { d: "M0 -26 Q-34 -40 -36 -4 Q-34 34 0 36 Q34 34 36 -4 Q34 -40 0 -26 Z", fill: col, ...S6(4) }, g); el("path", { d: "M0 -26 q2 -16 12 -22", fill: "none", ...S6(4) }, g); el("path", { d: "M8 -38 q18 -12 26 2 q-16 8 -26 -2", fill: "#5FB35A", ...S6(3) }, g); el("ellipse", { cx: -16, cy: -6, rx: 6, ry: 10, fill: "#FFFFFF", opacity: .5 }, g); return g; }
function kbTree(L, x, y, s = 1, c = "#5FB35A") { const g = kbG(L, x, y, s); el("rect", { x: -11, y: -20, width: 22, height: 50, fill: "#8B5A3C", ...S6(3) }, g); el("circle", { cx: 0, cy: -50, r: 44, fill: c, ...S6(4) }, g); el("circle", { cx: -30, cy: -28, r: 28, fill: c, ...S6(4) }, g); el("circle", { cx: 30, cy: -28, r: 28, fill: c, ...S6(4) }, g); return g; }
function kbTornado(L, x, y, s = 1) { const g = kbG(L, x, y, s), r = el("g", {}, g); [[0, 110, 16], [-36, 96, 14], [-66, 76, 13], [-94, 56, 12], [-118, 38, 10], [-138, 22, 8]].forEach(([cy, rx, ry], i) => { const e = el("ellipse", { cx: 0, cy, rx, ry, fill: i % 2 ? "#D9DEE6" : "#FFFFFF", ...S6(4) }, r); el("animate", { attributeName: "cx", values: `${-10 - i * 2};${10 + i * 2};${-10 - i * 2}`, dur: `${.5 + i * .05}s`, repeatCount: "indefinite" }, e); }); return g; }
function kbPot(L, x, y, s = 1, fire = false) { const g = kbG(L, x, y, s); // だんろと おなべ（あしもとが y）
  el("path", { d: "M-170 0 V-300 H170 V0 H110 V-170 Q110 -210 0 -210 Q-110 -210 -110 -170 V0 Z", fill: "#D9694F", ...S6(5) }, g); for (let r = 0; r < 12; r++) el("path", { d: `M-170 ${-r * 25} H-110 M110 ${-r * 25} H170`, stroke: "#B8473A", "stroke-width": 3 }, g); el("rect", { x: -190, y: -322, width: 380, height: 26, rx: 6, fill: "#8B5A3C", ...S6(5) }, g);
  el("path", { d: "M-110 0 V-170 Q-110 -210 0 -210 Q110 -210 110 -170 V0 Z", fill: "#3A2E2E" }, g); const f = el("g", { display: fire ? "" : "none" }, g);
  [[-50, 1], [0, 1.4], [50, 1]].forEach(([fx, k]) => { const p = el("path", { d: `M${fx - 22} 0 Q${fx - 30} ${-40 * k} ${fx} ${-70 * k} Q${fx + 30} ${-40 * k} ${fx + 22} 0 Z`, fill: "#FFB13B", stroke: "#E8473C", "stroke-width": 5 }, f); el("animateTransform", { attributeName: "transform", type: "scale", values: "1 1;1 .8;1 1", dur: `${.3 + Math.abs(fx) / 300}s`, repeatCount: "indefinite" }, p); });
  el("path", { d: "M-80 -120 H80 Q84 -40 40 -40 H-40 Q-84 -40 -80 -120 Z", fill: "#5A5A66", ...S6(5) }, g); el("ellipse", { cx: 0, cy: -120, rx: 82, ry: 14, fill: "#BDE3F2", ...S6(4) }, g); g.fire = f; return g; }
function kbLadder(L, x, y, h) { const g = el("g", {}, L); el("path", { d: `M${x - 24} ${y} L${x - 4} ${y - h} M${x + 24} ${y} L${x + 44} ${y - h}`, stroke: "#8B5A3C", "stroke-width": 9, "stroke-linecap": "round" }, g); for (let i = 1; i < h / 44; i++) el("path", { d: `M${x - 24 + i * 44 * 20 / h} ${y - i * 44} h48`, stroke: "#8B5A3C", "stroke-width": 7 }, g); return g; }
Object.assign(OG_VEH, { NIGURUMA: (g, size) => { const o = el("g", {}, g); kbCart(o, 0, 50, size / 170); return o; }, KOTORI: (g, size) => { const o = el("g", {}, g); kbBird(o, -36, 30, size / 120); kbBird(o, 36, 16, size / 150, "#FFD25E"); return o; },
  TARU: (g, size) => { const o = el("g", {}, g); kbBarrel(o, 0, 16, size / 110); return o; } });
/* ---------- 盤の しるし ---------- */
const KB_EVC = { ringo: "#FFE0DC", niguruma: "#FFF1C9", kotori: "#DFF3FF", bentou: "#FFE9C7", dougu: "#E6E9FF", taru: "#F2DCC6", taru2: "#F2DCC6", warabed: "#FFF4C2", mitsuketa: "#D9D9E3", karasu: "#D9D9E3", kyoudai: "#FFD9E2", tsumuji: "#EAF6FF", doro: "#D9B98A", kumikae: "#E6E9FF", ie: "#FFE27A" };
const KB_MARK = {
  ringo: g => kbApple(g, 0, 2, .62), niguruma: g => kbCart(g, 0, 22, .24), kotori: g => kbBird(g, -2, 4, .5), taru: g => kbBarrel(g, 0, 0, .42), taru2: g => kbBarrel(g, 0, 0, .52),
  bentou: g => { el("rect", { x: -22, y: -14, width: 44, height: 30, rx: 6, fill: "#E8473C", ...S6(3) }, g); el("rect", { x: -17, y: -9, width: 18, height: 20, rx: 3, fill: "#FFFFFF" }, g); el("circle", { cx: -8, cy: 1, r: 4, fill: "#E8473C" }, g); el("circle", { cx: 10, cy: -3, r: 5, fill: "#FFD25E" }, g); el("circle", { cx: 12, cy: 8, r: 4, fill: "#5FB35A" }, g); },
  dougu: g => { el("path", { d: "M-18 20 L4 -12", stroke: "#8B5A3C", "stroke-width": 6, "stroke-linecap": "round" }, g); el("rect", { x: -6, y: -26, width: 26, height: 14, rx: 3, fill: "#8C8C99", ...S6(3), transform: "rotate(35 6 -18)" }, g); el("path", { d: "M-22 -18 L18 22", stroke: "#D9DEE6", "stroke-width": 7, "stroke-linecap": "round" }, g); el("path", { d: "M-22 -18 l-8 -8", stroke: "#8B5A3C", "stroke-width": 8, "stroke-linecap": "round" }, g); },
  warabed: g => { el("path", { d: "M-28 14 Q-30 -8 0 -10 Q30 -8 28 14 Z", fill: "#F3DC8A", ...S6(3) }, g); txt(g, 8, -8, "z", 20, { fill: INK }); txt(g, 18, -20, "z", 14, { fill: INK }); },
  mitsuketa: g => kbWolf(g, 4, 8, .36), karasu: g => kbCrow(g, -2, 4, .5), kyoudai: g => { kbPig(g, -12, 6, .4, "#5B8DEF"); kbPig(g, 12, 6, .4, "#E8473C"); }, tsumuji: g => kbTornado(g, 0, 26, .24),
  doro: g => { el("ellipse", { cx: 0, cy: 6, rx: 28, ry: 14, fill: "#8B5A3C", ...S6(3) }, g); el("circle", { cx: -14, cy: -12, r: 5, fill: "#8B5A3C" }, g); el("circle", { cx: 12, cy: -16, r: 4, fill: "#8B5A3C" }, g); },
  kumikae: g => { el("path", { d: "M-28 -10 q14 -14 28 0 t28 0 M-28 8 q14 -14 28 0 t28 0", fill: "none", stroke: "#7FA7D9", "stroke-width": 6, "stroke-linecap": "round" }, g); },
  ie: g => kbHouse(g, 0, 26, .2, "renga") };
{ const db = drawBoard; drawBoard = function () { db(); if (!isKB()) return;
    Object.entries(EVENTS.kobuta).forEach(([id, e]) => { const [x, y] = NODES[id], t = e[4] || e[0];
      el("circle", { cx: x, cy: y, r: 36, fill: KB_EVC[t] || "#FFF1C9", ...S6(4) }, boardLayer); const g = el("g", { transform: `translate(${x} ${y})` }, boardLayer); (KB_MARK[t] || (() => txt(g, 0, 14, "★", 36, { "text-anchor": "middle" })))(g); }); }; }
/* ---------- 盤の 背景：のはら。ひだりに おかあさんの いえ・わらの いえ・きの いえ、まんなかに れんがの いえ、みぎは おおかみの もり ---------- */
BOARD_BG.kobuta = L => {
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#BFE3A6" }, L); el("rect", { x: 0, y: 0, width: 1600, height: 230, fill: "#BDE3F2" }, L); el("path", { d: "M0 230 Q400 190 800 220 T1600 210 V260 H0 Z", fill: "#BFE3A6" }, L);
  el("ellipse", { cx: 800, cy: 628, rx: 720, ry: 370, fill: "#CDEBB4", opacity: .8 }, L);
  for (let i = 0; i < 26; i++) { const x = (i * 311 + 90) % 1600, y = 280 + (i * 173) % 700; el("circle", { cx: x, cy: y, r: 6, fill: ["#FFFFFF", "#FFD25E", "#FF9FBF"][i % 3], stroke: INK, "stroke-width": 1.5, opacity: .8 }, L); }
  kbHouse(L, 130, 400, .52, "mama"); kbHouse(L, 120, 660, .5, "wara"); kbHouse(L, 130, 930, .5, "ki"); kbHouse(L, 790, 712, .62, "renga");
  [[1500, 420, 1.1], [1560, 560, .9], [1480, 700, 1.2], [1550, 860, 1.1], [1470, 960, .8], [1570, 330, .8]].forEach(([x, y, s], i) => kbTree(L, x, y, s, i % 2 ? "#3E8E6E" : "#4E9A4B"));
  const e = el("g", {}, L); [[1504, 668], [1528, 668]].forEach(([cx, cy]) => el("ellipse", { cx, cy, rx: 7, ry: 5, fill: "#FFE27A", stroke: INK, "stroke-width": 2 }, e)); // もりの なかの おおかみの め
  [[40, 520], [60, 800], [250, 985], [1380, 985]].forEach(([x, y], i) => kbTree(L, x, y, .6, "#5FB35A")); };
/* ---------- こえ・こうしん ---------- */
function kbVoice(kind, x, y, key) { const c = C[kind]; place(c, x - 60, y, .3); return speak(c, key, KB.line[key].text); }
function kbTo(pc, d) { const O = SL_ORDER.kobuta; return O[Math.max(0, Math.min(O.length - 2, kbI(pc.node) + d))]; }
async function kbMarch(kind) { const g = el("g", {}, front()), L = el("g", {}, g), y = 560; const lab = (t, col) => txt(L, 380, -110, t, 40, { "text-anchor": "middle", fill: col, stroke: "#FFFFFF", "stroke-width": 6, "paint-order": "stroke", "font-weight": 700 });
  if (kind === "karasu") { for (let i = 0; i < 7; i++) { const c = kbCrow(L, i * 120, (i % 2) * 60 - 30, 1.1); c.setAttribute("transform", c.getAttribute("transform") + " scale(-1 1)"); } el("path", { d: "M-70 -10 Q-40 -50 -10 -10 Z", fill: "#E9C46A", ...S6(4) }, L); el("ellipse", { cx: -40, cy: -8, rx: 46, ry: 8, fill: "#E9C46A", ...S6(4) }, L); lab("からす", "#3A3944"); }
  else { ["#5B8DEF", "#5FB35A", "#E8473C", "#5B8DEF", "#5FB35A", "#E8473C"].forEach((c, i) => kbPig(L, 60 + i * 130, 0, 1.5, c)); lab("こぶたの こうしん", "#E8473C"); }
  const dir = kind === "karasu" ? -1 : 1, x0 = dir > 0 ? -950 : 1700, x1 = dir > 0 ? 1700 : -950; for (let i = 0; i < 6; i++) later(i * 300, () => blip(kind === "karasu" ? 300 : 520 + (i % 2) * 140, kind === "karasu" ? 200 : 700, .1, kind === "karasu" ? "sawtooth" : "square"));
  await tween(2600, k => g.setAttribute("transform", `translate(${(x0 + (x1 - x0) * k).toFixed(0)} ${(y - Math.abs(Math.sin(k * 30)) * 16).toFixed(0)})`)); g.remove(); }
async function kbTsumuji(pc) { const g = el("g", {}, front()); kbTornado(g, 0, 0, 1.3); let x = 1900; const y = pc.py + 30, at = () => g.setAttribute("transform", `translate(${x.toFixed(0)} ${y.toFixed(0)})`); at(); noise(1.6, 500, .4);
  await tween(1300, k => { x = 1900 + (pc.px - 1900) * (1 - Math.pow(1 - k, 2)); at(); });
  const y0 = pc.py, x0 = pc.px; await tween(900, k => { pc.py = y0 - 150 * k; pc.px = x0 + Math.sin(k * 18) * 40; pc.lean.t = k * 720; });
  const to = kbTo(pc, 5), [tx, ty] = nodeXY(pc, to), ax = pc.px, ay = pc.py; blip(400, 1200, .5, "sine");
  await tween(1200, k => { pc.px = ax + (tx - ax) * k; pc.py = ay + (ty - ay) * k - Math.sin(k * Math.PI) * 120; pc.lean.t = 720 + k * 720; x = pc.px; g.setAttribute("transform", `translate(${pc.px.toFixed(0)} ${(pc.py + 150 * (1 - k) + 30).toFixed(0)})`); });
  pc.lean.t = 0; pc.node = to; pc.px = tx; pc.py = ty; pc.trail = []; jump(pc, .5); chime(); confetti(24);
  await tween(900, k => { g.setAttribute("transform", `translate(${(tx + k * 1400).toFixed(0)} ${(ty + 30).toFixed(0)})`); }); g.remove();
  if (to === GOAL && !winner) { winnerPc = pc; winner = pc.kind; } }
/* ---------- 🏠 いえづくり：わら・き・れんが → おおかみが ふーっ ---------- */
async function kbIe(pc) {
  const pl = pc.player, cpu = !pl || pl.cpu, g = panel("いえを つくろう", "#F0FAEA"); const K = ["wara", "ki", "renga"], LAB = ["わら", "き", "れんが"];
  const bs = K.map((k, i) => { const b = el("g", { style: "cursor:pointer" }, g), x = 400 + i * 400; el("rect", { x: x - 170, y: 300, width: 340, height: 480, rx: 30, fill: "#FFFFFF", ...S6(6) }, b); kbHouse(b, x, 640, .9, k); txt(b, x, 740, LAB[i], 54, { "text-anchor": "middle", "font-weight": 700 }); return b; });
  await speak(C.pony, "kbp_ie_ask", KB.txt.kbp_ie_ask);
  const pick = cpu ? (await sleep(900), rnd(3)) : await Promise.race([tapOnce(bs), sleep(15000).then(() => 2)]); bs.forEach(b => b.onclick = null); const kind = K[pick]; blip(700, 900, .1, "square"); await sleep(300); bs.forEach(b => b.remove());
  el("path", { d: "M100 800 Q800 770 1500 800 V900 H100 Z", fill: "#BFE3A6", ...S6(4) }, g);
  // つくる（わらは すぐ、れんがは ゆっくり）
  const hg = el("g", {}, g); const h = kbHouse(hg, 0, 0, 1.4, kind); const ms = kind === "wara" ? 600 : kind === "ki" ? 1400 : 2600, n = kind === "wara" ? 2 : kind === "ki" ? 5 : 9; for (let i = 0; i < n; i++) later(i * ms / n, () => { noise(.05, 900, .5); blip(260, 200, .06, "square"); });
  await tween(ms, k => hg.setAttribute("transform", `translate(600 800) scale(1 ${Math.max(.02, k).toFixed(2)})`)); hg.setAttribute("transform", "translate(600 800)");
  await speak(C.pony, `kbp_ie_${kind}`, KB.txt[`kbp_ie_${kind}`]);
  // おおかみが くる
  const wg = el("g", {}, g); kbWolf(wg, 0, 0, 2.6); await tween(700, k => wg.setAttribute("transform", `translate(${(1700 - 550 * k).toFixed(0)} 700)`)); await speak(C.pony, "kbp_ie_wolf", KB.txt.kbp_ie_wolf);
  const wind = kbWind(g, 950, 610, 720, 640, 5); noise(1.6, 700, .5); kbVoice("ookamik", 1240, 520, "kbl_fuu");
  const fly = kind === "wara" || (kind === "ki" && rnd(2) === 0); let t = 0;
  await tween(1700, k => { if (fly && k > .35) { const u = (k - .35) / .65; hg.setAttribute("transform", `translate(${(600 - u * 900).toFixed(0)} ${(800 - Math.sin(u * 1.6) * 520).toFixed(0)}) rotate(${(-u * 300).toFixed(0)})`); } else hg.setAttribute("transform", `translate(${(600 + (kind === "renga" ? 0 : Math.sin(k * 60) * 8)).toFixed(1)} 800)`); });
  wind.remove(); await sleep(300);
  const res = fly ? "kbp_ie_tonda" : kind === "ki" ? "kbp_ie_taeta" : "kbp_ie_tsuyoi", d = fly ? -2 : kind === "ki" ? 2 : 4;
  if (!fly) { chime(); confetti(30); if (kind === "renga") kbVoice("ookamik", 1240, 520, "kbl_makeru"); } else noise(.3, 300, .5);
  playLog({ type: "ie", kind, fly, who: NAMES[pc.kind] }); await speak(C.pony, res, KB.txt[res]); g.remove(); await slGo(pc, d); }
/* ---------- しかけ ---------- */
{ const be = boardEvent; boardEvent = async function (pc) {
    const ev = isKB() && EVENTS.kobuta[pc.node];
    if (!ev || (pc.player && pc.player.stay)) return be(pc);
    const t = ev[4] || ev[0];
    if (t === "ie") { await sleep(300); markAbove(pc, "ex"); chime(); return kbIe(pc); }
    if (["ringo", "dougu", "bentou", "warabed"].includes(t)) { const g = el("g", {}, front()), m = el("g", {}, g); KB_MARK[t](m); let k = 0; addTick(dt => { if (!g.isConnected) return false; k += dt; g.setAttribute("transform", `translate(${pc.px.toFixed(0)} ${(pc.py - 120 + Math.sin(k * 5) * (t === "warabed" ? 2 : 10)).toFixed(0)}) scale(${Math.min(2.6, k * 8).toFixed(2)})`); if (k > 4.5) { g.remove(); return false; } }); return be(pc); }
    if (t === "kumikae") { const g = kbWind(front(), -600, 500, 0, 500, 7); noise(1.2, 700, .5); tween(1500, k => g.setAttribute("transform", `translate(${(k * 2400).toFixed(0)} 0)`)).then(() => g.remove()); return be(pc); }
    if (!["niguruma", "kotori", "taru", "taru2", "mitsuketa", "karasu", "kyoudai", "tsumuji", "doro"].includes(t)) return be(pc);
    const bad = ["mitsuketa", "karasu", "doro"].includes(t); await sleep(300); markAbove(pc, bad ? "drop" : "sparkle"); chime(); await slSay(ev[2], ev[3]);
    if (t === "niguruma") { kbVoice("ojisan", pc.px, pc.py, "kbl_niguruma"); await slRide(pc, kbTo(pc, 2), "NIGURUMA", { arc: 20, ms: 1500, size: 150 }); }
    else if (t === "kotori") { await slRide(pc, kbTo(pc, 3), "KOTORI", { arc: 200, ms: 1600, size: 120 }); }
    else if (t === "taru" || t === "taru2") { const to = slWarpTo("kobuta", pc.node, t === "taru" ? "warp" : "bigwarp"); kbVoice("kobuta2", pc.px, pc.py, "kbl_taru");
      const sh = setInterval(() => showBanner("ごろごろごろ", 900), 1100); try { await slRide(pc, to, "TARU", { arc: 40, ms: t === "taru" ? 2400 : 3200, size: t === "taru" ? 130 : 170, noflip: true }); } finally { clearInterval(sh); } }
    else if (t === "mitsuketa") { const g = el("g", {}, front()); kbWolf(g, 0, 0, 1.3); await tween(500, k => g.setAttribute("transform", `translate(${(pc.px + 300 - 190 * k).toFixed(0)} ${(pc.py - 10).toFixed(0)})`)); await kbVoice("ookamik", pc.px + 200, pc.py - 60, "kbl_mitsuketa"); jump(pc, .5); await sleep(300); await slGo(pc, -6); g.remove(); }
    else if (t === "karasu") { await kbMarch("karasu"); await slGo(pc, -3); }
    else if (t === "kyoudai") { kbVoice("kobuta1", 300, 620, "kbl_kyoudai"); await kbMarch("kyoudai"); for (const o of PLAYERS.map(p => p.pc)) { jump(o, .5); await slGo(o, 2); if (winner) break; } }
    else if (t === "tsumuji") await kbTsumuji(pc);
    else if (t === "doro") { const g = el("g", {}, front()); el("ellipse", { cx: pc.px, cy: pc.py + 16, rx: 70, ry: 22, fill: "#8B5A3C", ...S6(4) }, g); for (let i = 0; i < 6; i++) later(i * 120, () => mark("drop", pc.px - 40 + rnd(80), pc.py - 10, { vx: -120 + rnd(240), vy: -200, grav: 900, life: .6, s: .5 })); pc.lean.t = 16; await sleep(700); pc.lean.t = -16; await sleep(500); pc.lean.t = 0; g.remove(); await slGo(pc, -2); }
    await sleep(300); }; }
{ const mt = multiTurn; multiTurn = async function (pl, first) { if (isKB() && !KBS.told && pl === PLAYERS[0]) { KBS.told = 1; setView("board"); await utCurtain(); await speak(C.pony, "kbp_intro", KB.txt.kbp_intro); } return mt(pl, first); }; }
{ const ap = applyStage; applyStage = function (id, ...a) { if (id === "kobuta") { KB_N.clear(); KBS.told = 0; } return ap(id, ...a); }; }
/* ---------- 🚪 ドア あけ ---------- */
async function kbDoor(pc) {
  const g = panel("ドア あけ", "#FFF4E6"); const P = shuffle([3, 2, -2, "🎲", "🌱"]); const cols = ["#E8473C", "#5B8DEF", "#5FB35A", "#FFB13B", "#B9A8D9"];
  el("rect", { x: 100, y: 760, width: 1400, height: 130, fill: "#BFE3A6", ...S6(4) }, g);
  const bs = P.map((p, i) => { const b = el("g", { style: "cursor:pointer" }, g), x = 260 + i * 270; el("rect", { x: x - 96, y: 384, width: 192, height: 380, rx: 12, fill: "#8B5A3C", ...S6(6) }, b); const d = el("g", {}, b); el("path", { d: `M${x - 80} 760 V470 Q${x - 80} 400 ${x} 400 Q${x + 80} 400 ${x + 80} 470 V760 Z`, fill: cols[i], ...S6(5) }, d); el("circle", { cx: x + 52, cy: 600, r: 10, fill: "#FFD25E", ...S6(3) }, d); el("rect", { x: x - 40, y: 450, width: 80, height: 70, rx: 8, fill: "#FFFFFF", opacity: .5 }, d); b.x = x; b.door = d; return b; });
  await speak(C.pony, "kbp_door", KB.txt.kbp_door);
  const i = await tapOnce(bs); const p = P[i]; noise(.15, 500, .5); blip(300, 500, .15, "sine");
  const reveal = (b, q, big) => { const x = b.x; b.door.remove(); const o = el("g", { opacity: big ? 1 : .55 }, b); el("path", { d: `M${x - 80} 760 V470 Q${x - 80} 400 ${x} 400 Q${x + 80} 400 ${x + 80} 470 V760 Z`, fill: "#FFF4D6", ...S6(5) }, o);
    if (q === 3) [[-30, 640], [30, 650], [0, 590]].forEach(([dx, y]) => kbApple(o, x + dx, y, 1)); else if (q === 2) kbApple(o, x, 630, 1.2, "#FFD25E"); else if (q === -2) { const w = kbWolf(o, x + 10, 640, 1.5); }
    txt(o, x, 850, typeof q === "number" ? (q > 0 ? "+" + q : String(q)) : q, big ? 80 : 54, { "text-anchor": "middle" }); if (typeof q !== "number") txt(o, x, 630, q, 90, { "text-anchor": "middle" }); };
  reveal(bs[i], p, true); await sleep(900); bs.forEach((b, j) => { if (j !== i) reveal(b, P[j], false); }); await sleep(1300);
  if (p === 3) await speak(C.pony, "kbp_door_ringo", KB.txt.kbp_door_ringo); else if (p === -2) await speak(C.pony, "kbp_door_wolf", KB.txt.kbp_door_wolf);
  g.remove();
  if (p === "🎲") { slFlag(pc, "dice2"); await speak(C.pony, "sl_st_d2", "サイコロ 2こ！ つぎの ばんで 2こ ふれるよ"); }
  else if (p === "🌱") { if (pc.player) pc.player.ok += 2; GS.ok += 2; GS.pend = 0; confetti(40); await speak(C.pony, "sl_bl_tane", "たねが 2こ でて きた！"); }
  else await delta(pc, p);
  return false; }
/* ---------- 🍎 りんご キャッチ：かごの うえに きたら タッチ ---------- */
async function kbRingo(pc) {
  const g = panel("りんご キャッチ", "#E3F6D8"); el("rect", { x: 100, y: 800, width: 1400, height: 90, fill: "#BFE3A6", ...S6(4) }, g);
  el("path", { d: "M100 420 Q800 330 1500 420", fill: "none", stroke: INK, "stroke-width": 34, "stroke-linecap": "round" }, g); el("path", { d: "M100 420 Q800 330 1500 420", fill: "none", stroke: "#8B5A3C", "stroke-width": 24, "stroke-linecap": "round" }, g);
  for (let i = 0; i < 9; i++) el("ellipse", { cx: 160 + i * 160, cy: 350 - Math.sin(i / 8 * Math.PI) * 44, rx: 110, ry: 60, fill: i % 2 ? "#4E9A4B" : "#5FB35A", ...S6(4) }, g);
  const bk = el("g", { transform: "translate(800 800)" }, g); el("path", { d: "M-90 -70 H90 L70 0 H-70 Z", fill: "#E9C46A", ...S6(5) }, bk); el("path", { d: "M-80 -46 H80 M-74 -22 H74 M-40 -70 L-32 0 M0 -70 V0 M40 -70 L32 0", stroke: "#B8946A", "stroke-width": 4 }, bk);
  el("path", { d: "M760 440 V720 M840 440 V720", stroke: "#FFFFFF", "stroke-width": 4, "stroke-dasharray": "10 14", opacity: .7 }, g);
  const KT = ["ki", "aka", "hachi", "ki", "aka", "ki"]; const its = KT.map((k, i) => { const e = el("g", {}, g); if (k === "hachi") { el("ellipse", { cx: 0, cy: 6, rx: 34, ry: 40, fill: "#E9C46A", ...S6(4) }, e); [-12, 6, 24].forEach(y => el("path", { d: `M-30 ${y} H30`, stroke: "#B8946A", "stroke-width": 4 }, e)); el("circle", { cx: 0, cy: 20, r: 8, fill: "#3A2E2E" }, e); } else kbApple(e, 0, 10, k === "aka" ? 1.2 : .95, k === "aka" ? "#E8473C" : "#FFD25E");
    return { e, k, x: 1700 + i * 330, y: 450, v: 240 + (i % 3) * 30 }; });
  await speak(C.pony, "kbp_ringo", KB.txt.kbp_ringo);
  let tapped = false, got = null, done; const fin = new Promise(r => done = r); const hit = el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#00000001", style: "cursor:pointer" }, g);
  const drop = async () => { if (tapped) return; tapped = true; hit.onclick = null; got = its.filter(o => Math.abs(o.x - 800) < 115).sort((a, b) => Math.abs(a.x - 800) - Math.abs(b.x - 800))[0] || null;
    if (got) { blip(900, 300, .3, "sine"); const x0 = got.x; await tween(600, k => { got.x = x0 + (800 - x0) * k; got.y = 450 + 290 * k * k; got.e.setAttribute("transform", `translate(${got.x.toFixed(0)} ${got.y.toFixed(0)})`); }); noise(.1, 800, .5); chime(); } else { noise(.15, 600, .3); await sleep(500); }
    done(); };
  addTick(dt => { if (!g.isConnected) return false; its.forEach(o => { if (o === got) return; o.x -= o.v * dt * (tapped ? .3 : 1); if (o.x < -200) o.x += 1980; o.e.setAttribute("transform", `translate(${o.x.toFixed(0)} ${(o.y + Math.sin(o.x * .02) * 6).toFixed(0)})`); }); });
  hit.onclick = drop; later(11000, drop); await fin; await sleep(700);
  const k = got && got.k, key = k === "aka" ? "kbp_rg_aka" : k === "ki" ? "kbp_rg_ki" : k === "hachi" ? "kbp_rg_hachi" : "kbp_rg_none"; await speak(C.pony, key, KB.txt[key]);
  g.remove(); const d = k === "aka" ? 3 : k === "ki" ? 2 : k === "hachi" ? -1 : 0; if (d) await delta(pc, d); return false; }
/* ---------- 場面の へや ---------- */
function kbMeadow(L) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#BDE3F2" }, L); el("circle", { cx: 1420, cy: 190, r: 56, fill: "#FFE27A", stroke: "#FFFFFF", "stroke-width": 10 }, L);
  el("path", { d: "M0 620 Q300 520 620 600 T1200 580 T1600 600 V1000 H0 Z", fill: "#A9D98E", ...S6(5) }, L); el("path", { d: "M0 700 Q400 660 800 690 T1600 680 V1000 H0 Z", fill: "#BFE3A6", ...S6(5) }, L);
  el("rect", { x: 0, y: 800, width: 1600, height: 200, fill: "#D9B98A" }, L); el("path", { d: "M0 800 H1600", ...S6(5) }, L); for (let x = 60; x < 1600; x += 190) el("path", { d: `M${x} 800 q10 -26 20 0`, fill: "#5FB35A", ...S6(3) }, L); }
const ROOMS_KB = {
  "ぶたの おうち": kbMeadow, "みち": L => { kbMeadow(L); kbTree(L, 180, 700, 1.8); kbTree(L, 1480, 690, 1.5, "#4E9A4B"); },
  "わらの いえ": kbMeadow, "きの いえ": kbMeadow, "れんがの いえ": kbMeadow,
  "もり": L => { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#B7D9A8" }, L); [[120, 700, 2.8], [430, 640, 2.2], [760, 610, 1.8], [1100, 640, 2.2], [1450, 700, 2.8]].forEach(([x, y, s], i) => kbTree(L, x, y, s, i % 2 ? "#3E8E6E" : "#4E9A4B"));
    el("rect", { x: 0, y: 800, width: 1600, height: 200, fill: "#B8946A" }, L); el("path", { d: "M0 800 H1600", ...S6(5) }, L); },
  "れんがの いえの なか": L => { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFF1DC" }, L); el("rect", { x: 0, y: 560, width: 1600, height: 240, fill: "#E7B08F" }, L);
    for (let r = 0; r < 6; r++) { el("path", { d: `M0 ${560 + r * 40} H1600`, stroke: "#D9694F", "stroke-width": 4 }, L); for (let c = 0; c < 17; c++) el("path", { d: `M${c * 100 + (r % 2 ? 50 : 0)} ${560 + r * 40} v40`, stroke: "#D9694F", "stroke-width": 4 }, L); }
    el("rect", { x: 250, y: 220, width: 240, height: 220, rx: 10, fill: "#BDE3F2", ...S6(6) }, L); el("path", { d: "M370 220 V440 M250 330 H490", ...S6(5) }, L);
    el("rect", { x: 0, y: 800, width: 1600, height: 200, fill: "#C98A4B" }, L); el("path", { d: "M0 800 H1600", ...S6(5) }, L); for (let x = 0; x < 1600; x += 200) el("path", { d: `M${x} 800 V1000`, stroke: "#8B5A3C", "stroke-width": 4 }, L); },
};
{ const dr = drawRoom; drawRoom = function (place, noSign = false) {
    if (!isKB() || !ROOMS_KB[place]) return dr(place, noSign); sceneLayer.innerHTML = ""; ROOMS_KB[place](sceneLayer); if (!noSign) { const g = el("g", {}, sceneLayer); el("rect", { x: 520, y: 24, width: 560, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, 44, { "text-anchor": "middle" }); } }; }
/* ---------- やくの かぶりもの ---------- */
function kbCostume(c, role) { const out = [], top = (c.top ?? 80) + 24, hd = c.head.g, e = c.eyes || [], cy = e.length ? e[0].cy : 170, g = el("g", {}, hd); out.push(g);
  if (role === "ookami") { [[150, -1], [250, 1]].forEach(([x, s]) => el("path", { d: `M${x - 26} ${top + 16} L${x + s * 8} ${top - 56} L${x + 26} ${top + 16} Z`, fill: "#8E8E9E", ...S6(5) }, g)); el("ellipse", { cx: 200, cy: cy + 38, rx: 30, ry: 18, fill: "#E6E6EE", ...S6(4) }, g); el("ellipse", { cx: 200, cy: cy + 30, rx: 10, ry: 7, fill: INK }, g);
    [[188], [212]].forEach(([x]) => el("path", { d: `M${x - 5} ${cy + 52} L${x} ${cy + 66} L${x + 5} ${cy + 52} Z`, fill: "#FFFFFF", ...S6(3) }, g)); }
  else { [[140, -1], [260, 1]].forEach(([x, s]) => el("path", { d: `M${x - s * 24} ${top + 20} Q${x + s * 10} ${top - 36} ${x + s * 40} ${top + 6} Q${x + s * 26} ${top + 30} ${x} ${top + 34} Z`, fill: "#FF9FB5", ...S6(5) }, g));
    el("ellipse", { cx: 200, cy: cy + 36, rx: 30, ry: 19, fill: "#FF9FB5", ...S6(4) }, g); [190, 210].forEach(x => el("ellipse", { cx: x, cy: cy + 36, rx: 5, ry: 8, fill: "#C45A78" }, g));
    if (role === "kobuta1") { el("ellipse", { cx: 200, cy: top + 8, rx: 96, ry: 18, fill: "#E9C46A", ...S6(5) }, g); el("path", { d: `M150 ${top + 8} Q154 ${top - 46} 200 ${top - 48} Q246 ${top - 46} 250 ${top + 8} Z`, fill: "#E9C46A", ...S6(5) }, g); el("path", { d: `M152 ${top - 4} Q200 ${top - 16} 248 ${top - 4}`, fill: "none", stroke: "#E8473C", "stroke-width": 8 }, g); }
    else if (role === "kobuta2") { el("path", { d: `M134 ${top + 14} Q138 ${top - 44} 200 ${top - 46} Q262 ${top - 44} 266 ${top + 14} Z`, fill: "#3E8E6E", ...S6(5) }, g); el("path", { d: `M200 ${top + 14} Q262 ${top + 6} 296 ${top + 22} L290 ${top + 34} Q250 ${top + 22} 196 ${top + 28} Z`, fill: "#2E6B52", ...S6(5) }, g); }
    else if (role === "kobuta3") { el("path", { d: `M130 ${top + 14} Q132 ${top - 50} 200 ${top - 52} Q268 ${top - 50} 270 ${top + 14} Z`, fill: "#FFD25E", ...S6(5) }, g); el("path", { d: `M118 ${top + 12} H282 L278 ${top + 26} H122 Z`, fill: "#FFD25E", ...S6(5) }, g); } }
  return () => out.forEach(x => x.remove()); }
/* ---------- 場面の 小道具と うごき（ナレーションと 絵を そろえる）。after＝セリフを いった あとの うごき ---------- */
function kbProp(sc, h, a) {
  const G = el("g", {}, propG), hx = h.x + 200 * h.s, ax = a.x + 200 * a.s, base = 975, gy = 800, id = sc.id; let after = null, after2 = null;
  const live = () => G.isConnected && view === "scene";
  const F = () => { const g = el("g", {}, front()); addTick(() => { if (!live()) { g.remove(); return false; } }); return g; };
  const loop = fn => { let t = 0; addTick(dt => { if (!live()) return false; t += dt; return fn(t, dt); }); };
  const word = (x, y, w, col = "#FFFFFF", L = G) => { const g = el("g", {}, L); txt(g, x, y, w, 40, { "text-anchor": "middle", fill: col, stroke: INK, "stroke-width": 7, "paint-order": "stroke", "font-weight": 700 }); return g; };
  const house = (kind, x, s = 1.7) => { const g = el("g", {}, G); kbHouse(g, 0, 0, 1, kind); g.setAttribute("transform", `translate(${x} ${gy}) scale(${s})`); g.x = x; g.s = s; return g; };
  // いえの なかに いる ように みせる：うしろ（なかの かべ）と まえ（したの かべ・はしら・やね）で キャラを はさむ
  const houseIn = (kind, x, w = 230) => { const col = { wara: "#F3DC8A", ki: "#C98A4B", renga: "#D9694F" }[kind], ln = { wara: "#C9A64B", ki: "#8B5A3C", renga: "#B8473A" }[kind], roof = { wara: "#E9C46A", ki: "#8B5A3C", renga: "#6E6560" }[kind];
    const back = el("g", {}, G), front = F(), T = base - 350, M = base - 130; el("rect", { x: x - w, y: T, width: w * 2, height: 350, fill: "#7A5A4A", ...S6(5) }, back);
    const tex = (g, x0, y0, ww, hh) => { el("rect", { x: x0, y: y0, width: ww, height: hh, fill: col, ...S6(5) }, g);
      if (kind === "wara") for (let i = x0 + 14; i < x0 + ww; i += 22) el("path", { d: `M${i} ${y0 + 6} V${y0 + hh - 6}`, stroke: ln, "stroke-width": 4, "stroke-linecap": "round" }, g);
      else if (kind === "ki") for (let j = y0 + 30; j < y0 + hh; j += 30) el("path", { d: `M${x0} ${j} H${x0 + ww}`, stroke: ln, "stroke-width": 4 }, g);
      else for (let j = 0; j * 26 < hh; j++) { if (j) el("path", { d: `M${x0} ${y0 + j * 26} H${x0 + ww}`, stroke: ln, "stroke-width": 3 }, g); for (let i = x0 + (j % 2 ? 26 : 52); i < x0 + ww; i += 52) el("path", { d: `M${i} ${y0 + j * 26} v${Math.min(26, hh - j * 26)}`, stroke: ln, "stroke-width": 3 }, g); } };
    tex(front, x - w, M, w * 2, 130); tex(front, x - w, T, 56, 220); tex(front, x + w - 56, T, 56, 220); tex(front, x - w, T - 44, w * 2, 44);
    if (kind === "renga") { el("rect", { x: x + w - 130, y: T - 250, width: 60, height: 150, fill: "#B8473A", ...S6(5) }, front); el("rect", { x: x + w - 140, y: T - 266, width: 80, height: 22, rx: 4, fill: "#8E8478", ...S6(4) }, front); }
    if (kind === "wara") el("path", { d: `M${x - w - 60} ${T - 30} Q${x - w * .4} ${T - 230} ${x} ${T - 240} Q${x + w * .4} ${T - 230} ${x + w + 60} ${T - 30} Q${x} ${T - 70} ${x - w - 60} ${T - 30} Z`, fill: roof, ...S6(5) }, front);
    else el("path", { d: `M${x - w - 60} ${T - 30} L${x} ${T - 230} L${x + w + 60} ${T - 30} Z`, fill: roof, ...S6(5) }, front);
    el("rect", { x: x - w + 56, y: T, width: w * 2 - 112, height: 220, fill: "none", ...S6(7) }, front);
    return { parts: [back, front], x, s: 1, setAttribute(k, v) { back.setAttribute(k, v); front.setAttribute(k, v); }, remove() { back.remove(); front.remove(); } }; };
  const kid = (k, x, s = .62) => { const c = xtra(k, x, s); c.dx.v = c.dx.t = 0; return c; };
  const HL = 300, HR = 1290;
  const blow = async (hs, flies) => { h.squash.t = 1.12; await sleep(350); h.squash.t = .94; const p = world(h, 200, h.top + 150); const w = kbWind(front(), p.x + 60, p.y, hs.x - 200, base - 260, 5); noise(1.8, 700, .55);
    if (flies) { jump(a, .5); a.roundMouth = true; await tween(1700, k => { const u = Math.max(0, (k - .25) / .75); hs.setAttribute("transform", `translate(${(u * 800).toFixed(0)} ${(-Math.sin(u * 1.5) * 800).toFixed(0)}) rotate(${(u * 200).toFixed(0)} ${hs.x} ${base - 200})`); if (Math.random() < .3) mark("puff", hs.x - 100 + rnd(200), base - 100 - rnd(300), { vx: 300, vy: -100, life: .7, s: .5 }); }); hs.remove(); a.roundMouth = false; markAbove(a, "ex"); }
    else { await tween(1700, () => { }); }
    w.remove(); h.squash.t = 1; };
  if (id === "tabidachi") { house("mama", HR + 60, 1.5); kid("kobuta1", 830); kid("kobuta2", 990); a.armR.t = -140; later(1800, () => a.armR.t = 0); }
  else if (id === "wara_morau") { const f = F(); kbCart(f, ax - 290, base - 4, 1.5); }
  else if (id === "ki_morau") { const f = F(); [[0, 0], [70, 0], [35, -44]].forEach(([dx, dy]) => { el("rect", { x: ax - 380 + dx, y: base - 50 + dy, width: 130, height: 44, rx: 22, fill: "#C98A4B", ...S6(5) }, f); el("ellipse", { cx: ax - 380 + dx + 8, cy: base - 28 + dy, rx: 10, ry: 20, fill: "#F3DC8A", ...S6(3) }, f); });
    el("path", { d: `M${ax + 150} ${base - 10} L${ax + 190} ${base - 190}`, stroke: "#8B5A3C", "stroke-width": 10, "stroke-linecap": "round" }, G); el("path", { d: `M${ax + 176} ${base - 200} l50 -6 l6 44 l-46 4 z`, fill: "#D9DEE6", ...S6(4) }, G); }
  else if (id === "renga_morau") { const f = F(); for (let r = 0; r < 4; r++) for (let c = 0; c < 4 - r; c++) el("rect", { x: ax - 430 + c * 62 + r * 31, y: base - 36 - r * 34, width: 58, height: 30, rx: 4, fill: "#D9694F", ...S6(4) }, f); }
  else if (id === "asobou") { const g = el("g", {}, G); for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) el("rect", { x: HL - 220 + c * 62 + (r % 2 ? 31 : 0) - 15, y: gy - 36 - r * 34, width: 58, height: 30, rx: 4, fill: "#D9694F", ...S6(4) }, g);
    const f = F(); for (let c = 0; c < 3; c++) el("rect", { x: hx + 90 + c * 30, y: base - 34 - c * 30, width: 58, height: 30, rx: 4, fill: "#D9694F", ...S6(4) }, f); loop(t => { h.armR.t = -60 + Math.sin(t * 5) * 40; });
    const bl = el("circle", { r: 34, fill: "#FFD25E", ...S6(5) }, F()); loop(t => { bl.setAttribute("cx", ax - 150); bl.setAttribute("cy", (base - 40 - Math.abs(Math.sin(t * 4)) * 150).toFixed(0)); }); house("wara", 1010, .6); house("ki", 1160, .6); }
  else if (id === "dekita") { house("renga", HL); loop(() => { if (Math.random() < .08) mark("sparkle", HL - 200 + rnd(400), gy - 80 - rnd(380), { vy: -20, life: .8, s: .7 }); }); a.eyeScale.t = 1.3; later(3000, () => a.eyeScale.t = 1); }
  else if (id === "harapeko") { word(hx + 40, base - 480, "ぐうう〜", "#FFE27A"); for (let i = 0; i < 3; i++) later(400 + i * 1200, () => { blip(120, 80, .5, "sawtooth"); h.squash.t = .92; later(300, () => h.squash.t = 1); }); h.sadMouth = true; later(5000, () => h.sadMouth = false); }
  else if (id === "tonton" || id === "dame") { houseIn("wara", hx); if (id === "tonton") { word(ax - 140, base - 470, "とん、とん、とん"); loop(t => { if (t > 4) { a.armL.t = 0; return false; } a.armL.t = 70 + Math.sin(t * 12) * 30; if (Math.floor(t * 2.5) !== Math.floor((t - .016) * 2.5)) { noise(.06, 700, .8); blip(180, 120, .06, "triangle"); } }); }
    else { h.sadMouth = true; loop(t => { if (t > 5) { h.lean.t = 0; h.sadMouth = false; return false; } h.lean.t = Math.sin(t * 30) * 3; }); for (let i = 0; i < 3; i++) later(i * 700, () => markAbove(h, "drop")); a.lean.t = -14; later(4000, () => a.lean.t = 0); } }
  else if (id === "fuku_wara" || id === "ki_fuku") { const hs = houseIn(id === "fuku_wara" ? "wara" : "ki", id === "ki_fuku" ? ax + 80 : ax, id === "ki_fuku" ? 300 : 230); if (id === "ki_fuku") kid("kobuta1", 1420); h.squash.t = 1.14; later(2600, () => h.squash.t = 1); word(hx, base - 520, "すううう……"); after = () => blow(hs, true); }
  else if (id === "nigeru") { const w = xtra("ookamik", 260, .42); w.y = 740; w.dx.v = -300; w.dx.t = 0; hold(w, "run", 6); h.sadMouth = true; for (let i = 0; i < 3; i++) later(i * 700, () => markAbove(h, "drop"));
    loop(t => { if (t < 4 && Math.random() < .12) mark("puff", 200 + rnd(1200), 300 + rnd(300), { vx: 260, vy: 20, life: .9, s: .3 }); }); for (let i = 0; i < 6; i++) { const s = el("path", { d: "M0 0 l40 -8", stroke: "#E9C46A", "stroke-width": 7, "stroke-linecap": "round" }, G); loop(t => s.setAttribute("transform", `translate(${(300 + i * 190 + t * 160).toFixed(0)} ${(260 + i * 50 + Math.sin(t * 3 + i) * 30).toFixed(0)}) rotate(${(t * 200 + i * 60).toFixed(0)})`)); } }
  else if (id === "ireru") { houseIn("ki", hx); a.dx.v = 1000; a.dx.t = 0; hold(a, "run", 1.2); a.sadMouth = true; for (let i = 0; i < 3; i++) later(1200 + i * 600, () => markAbove(a, "drop")); after2 = async () => { a.sadMouth = false; hold(a, "run", 1); a.dx.t = hx + 170 - ax; noise(.1, 400, .6); await sleep(1100); }; } // いえの なかへ はいる
  else if (id === "ki_tonton") { houseIn("ki", hx - 80, 300); const k1 = kid("kobuta1", 400); k1.sadMouth = true; loop(t => { if (t > 5) { k1.lean.t = 0; return false; } k1.lean.t = Math.sin(t * 30) * 3; }); a.lean.t = -14; later(4000, () => a.lean.t = 0); }
  else if (id === "ki_nigeru") { house("renga", HR + 40); const k1 = kid("kobuta1", 400); k1.dx.v = -500; k1.dx.t = 0; hold(k1, "run", 1.2); h.sadMouth = true; for (let i = 0; i < 3; i++) later(i * 700, () => markAbove(h, "drop"));
    for (let i = 0; i < 5; i++) { const s = el("rect", { x: -30, y: -8, width: 60, height: 16, fill: "#C98A4B", ...S6(3) }, G); loop(t => s.setAttribute("transform", `translate(${(200 + i * 150 + t * 120).toFixed(0)} ${(240 + i * 40 + Math.sin(t * 3 + i) * 30).toFixed(0)}) rotate(${(t * 160 + i * 60).toFixed(0)})`)); } }
  else if (id === "renga_hairu") { kid("kobuta2", 1420); const w = el("g", {}, G); kbWolf(w, 0, 0, 1.3); loop(t => w.setAttribute("transform", `translate(${(400 + Math.sin(t * 1.5) * 30).toFixed(0)} ${(420 - Math.max(0, Math.sin(t * 1.5)) * 30).toFixed(0)})`)); el("rect", { x: 230, y: 440, width: 280, height: 30, fill: "#C98A4B", ...S6(5) }, G); a.sadMouth = true; later(5000, () => a.sadMouth = false); }
  else if (id === "renga_tonton") { houseIn("renga", hx); a.lean.t = -14; a.armR.t = -150; later(3000, () => { a.lean.t = 0; a.armR.t = 0; }); markAbove(a, "anger"); }
  else if (id === "renga_fuku") { const hs = houseIn("renga", ax); const p = () => world(h, 200, h.top + 150); let w = null; later(600, () => { if (!live()) return; const q = p(); w = kbWind(F(), q.x + 60, q.y, hs.x - 200, base - 260, 5); noise(2.5, 700, .5); h.squash.t = .94; }); later(3600, () => { if (w) w.remove(); h.squash.t = 1; if (live()) for (let i = 0; i < 3; i++) later(i * 500, () => markAbove(h, "drop")); });
    word(hs.x, base - 640, "びくとも しない！", "#FFE27A", F()); after = async () => { flop(h); await sleep(900); joy(a); }; }
  else if (id === "entotsu") { const hs = house("renga", HR + 40); kbLadder(G, HR - 190, gy, 420); loop(() => { if (Math.random() < .1) mark("sparkle", HR + 170 + rnd(60), gy - 500 - rnd(40), { vy: -20, life: .7, s: .6 }); if (Math.random() < .04) mark("puff", HR + 195, gy - 520, { vy: -80, life: 1, s: .5 }); }); h.headRot.t = -12; h.armR.t = -150; later(3500, () => { h.headRot.t = 0; h.armR.t = 0; }); }
  else if (id === "oyu") { const pot = kbPot(G, 960, gy, 1, false); word(800, 190, "ごそごそ……", "#8B5A3C"); for (let i = 0; i < 5; i++) later(300 + i * 500, () => noise(.12, 1500, .3)); h.headRot.t = -10; a.sadMouth = true; later(3000, () => h.headRot.t = 0);
    after2 = async () => { a.sadMouth = false; pot.fire.setAttribute("display", ""); noise(.4, 900, .4); loop(() => { if (Math.random() < .12) mark("puff", 920 + rnd(80), gy - 140, { vy: -110, life: 1, s: .4 }); }); await sleep(900); }; }
  else if (id === "ochiru") { kbPot(G, ax, gy, 1, true); const f = F(); el("path", { d: `M${ax - 80} ${gy - 120} H${ax + 80} Q${ax + 84} ${gy - 40} ${ax + 40} ${gy - 40} H${ax - 40} Q${ax - 84} ${gy - 40} ${ax - 80} ${gy - 120} Z`, fill: "#5A5A66", ...S6(5) }, f);
    const y0 = a.y, yin = y0 - 150; a.y = y0 - 1200; let fell = false; loop(t => { if (t < 2.4) return; if (t < 3.1) { a.y = y0 - 1200 + (yin - (y0 - 1200)) * ((t - 2.4) / .7); return; } if (!fell) { fell = true; noise(.6, 1200, .6); word(ax, gy - 420, "どぼーん！", "#BDE9F5"); for (let i = 0; i < 12; i++) mark("drop", ax - 60 + rnd(120), gy - 130, { vx: -260 + rnd(520), vy: -260 - rnd(200), grav: 900, life: .9, s: .7 }); a.sadMouth = true; a.roundMouth = true; }
      a.y = yin - Math.abs(Math.sin((t - 3.1) * 7)) * 70; if (Math.random() < .1) mark("puff", ax - 60 + rnd(120), gy - 150, { vy: -110, life: .9, s: .4 }); a.armL.t = 150; a.armR.t = -150; }); KB_CLEAN.push(() => { a.y = y0; a.roundMouth = false; a.sadMouth = false; }); }
  else if (id === "ayamaru") { house("renga", HR + 40); h.sadMouth = true; h.headRot.t = 10; for (let i = 0; i < 5; i++) later(i * 600, () => { const p = world(h, 120 + rnd(160), h.top + 60); mark("drop", p.x, p.y, { vy: 120, life: .7, s: .6 }); }); after = async () => { h.lean.t = 22; await sleep(900); h.lean.t = 0; }; }
  else if (id === "yorokobu") { house("renga", HL); kid("kobuta2", 1420); const w = el("g", {}, G); kbWolf(w, 0, 0, 1); loop(t => { const k = Math.min(1, t / 7); w.setAttribute("transform", `translate(${(900 + k * 560).toFixed(0)} ${(700 - k * 110).toFixed(0)}) scale(${(-.7 + k * .35).toFixed(2)} ${(.7 - k * .35).toFixed(2)})`); }); kbTree(G, 1540, 620, 1.2, "#3E8E6E"); later(800, () => { joy(a); confetti(30); }); }
  else if (id === "mama") { kbPot(G, 420, gy, .8, true); kid("kobuta1", 880); kid("kobuta2", 1040); for (let i = 0; i < 5; i++) later(600 + i * 700, () => mark("heart", 760 + rnd(480), base - 420, { vy: -40, life: 1, s: .8 })); later(5200, () => { if (live()) word(800, 240, "めでたし、めでたし", "#FFE27A"); }); }
  return { G, after: () => after && after(), after2: () => after2 && after2() }; }
/* ---------- 🎭 げき ---------- */
function kbPick(area) { const pool = KB.sc.filter(s => s.area === area); const m = Math.min(...pool.map(s => KB_N.get(s.id) || 0)); return pool.find(s => (KB_N.get(s.id) || 0) === m); }
async function kbScene(pc) {
  const hero = pc.kind, sc = kbPick(nArea(pc.node)), t = tierOf(); KB_N.set(sc.id, (KB_N.get(sc.id) || 0) + 1);
  showEngine(null, `3びきの こぶたの げき（${sc.id}・段${t + 1}）`);
  const who = sc.who === hero ? (hero === "gao" ? "tora" : "gao") : sc.who;
  const { hero: h, ask: a } = setSitView({ id: "kb_" + sc.id, place: sc.place, asker: who, intro: "kb" }, hero);
  a.dx.v = a.dx.t = 0; KB_CLEAN.push(kbCostume(h, sc.role));
  const role = KB.role[sc.role], chip = el("g", {}, propG); el("rect", { x: 40, y: 150, width: 470, height: 70, rx: 35, fill: "#FFE27A", ...S6(5) }, chip); txt(chip, 275, 200, `やく：${role}`, 34, { "text-anchor": "middle", "font-weight": 700 });
  try {
    enter(h); await sleep(900);
    if (!KB_N.get("_intro")) { KB_N.set("_intro", 1); await speak(C.pony, "kbp_say", KB.txt.kbp_say); }
    const pr = kbProp(sc, h, a);
    await speak(C.pony, `kbn_${sc.id}`, sc.n);
    playMove(a, "nod"); await speak(a, `kbw_${sc.id}`, sc.line);
    let okN = 0, nSay = 0; const log = [];
    const step = async (key, text, keys, tag) => { nSay++; const r = await kmSay(h, key, text, keys, tag); if (r.ok) okN++; log.push(`${r.ok ? "○" : "×"}${r.heard}`); return r.ok; };
    await step(`kbs_${sc.id}`, sc.say, sc.keys, `${role}に なって いおう`);
    await pr.after(); h.sadMouth = false;
    if (sc.id !== "ochiru") { playMove(a, "nod"); if (SPECIAL[who]) SPECIAL[who](a); } await speak(a, `kbr_${sc.id}`, sc.res); await pr.after2();
    if (sc.t2 && t >= 1) { await speak(a, `kbw2_${sc.id}`, sc.t2.line); await step(`kbs2_${sc.id}`, sc.t2.say, sc.t2.keys, "つづけて いおう"); if (sc.id !== "ochiru") joy(a); await speak(a, `kbr2_${sc.id}`, sc.t2.res); }
    const ok = okN * 2 >= nSay; grade(ok); GS.tasks++;
    playLog({ type: "kobuta", id: sc.id, role: sc.role, tier: t, okN, nSay, tries: log, ...(MODE === "multi" ? { who: NAMES[hero] } : {}) });
    if (ok) { confetti(36); joy(h); const k = rnd(2) ? "kbp_ok" : "kbp_good"; await speak(C.pony, k, KB.txt[k]); }
    await sleep(400); return ok;
  } finally { KB_CLEAN.splice(0).forEach(f => { try { f(); } catch (e) { } }); h.sadMouth = false; h.lean.t = 0; h.squash.t = 1; setView("board"); } }
Object.assign(LTASK_RUN, { kb: kbScene, kdoor: kbDoor, kringo: kbRingo });
/* ---------- 声の パック ---------- */
{ const lp = loadPack; loadPack = async function (id) { const r = await lp(id); if (id !== "kobuta") return r;
    if (!PACK.loaded.kobuta) { try { const q = await fetch("packs/kobuta.json", { cache: "no-cache" }); if (q.ok) { const d = await q.json(); Object.keys(d).forEach(k => AUD[k] = "data:audio/mpeg;base64," + d[k]); PACK.loaded.kobuta = Object.keys(d); } } catch (e) { } }
    if (AUD.bgm_kobuta) await voiceBuf("bgm_kobuta"); return true; }; }
/* ---------- メニューの タイルの 絵 ---------- */
if (typeof A2 !== "undefined") A2.kobuta = (L, X) => { el("rect", { x: -200, y: 0, width: 880, height: 300, fill: "#BDE3F2" }, L); el("path", { d: "M-200 220 Q100 190 400 216 T680 210 V300 H-200 Z", fill: "#BFE3A6", ...S6(4) }, L);
  kbHouse(L, X(-.38), 250, .42, "wara"); kbHouse(L, X(-.06), 250, .42, "ki"); kbHouse(L, X(.26), 250, .46, "renga"); CH(L, "kobuta3", X(.02), .26, HAPPY); CH(L, "ookamik", X(.46), .28, HI); };
/* ---------- 手がきの アイコン ---------- */
Object.assign(ICON_DRAW, {
  "🚪": g => { IC.P(g, "M-60 90 V-50 Q-60 -90 0 -90 Q60 -90 60 -50 V90 Z", "#C98A4B", 7); IC.C(g, 34, 10, 9, "#FFD25E", 4); IC.P(g, "M-30 -40 H30 V-10 H-30 Z", "#F3DC8A", 4); },
});
