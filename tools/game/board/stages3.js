/* ================= ステージ「とうこう」「がっこう3」「きゅうしょく」「げこう」（2026-10-13） =================
   生活で ひつような ことばを おぼえる 場面。台本は sit/sits_new.py（extras＝いっしょに 出る 子）。 */
const S3 = ["toukou", "gakkou3", "kyuushoku", "gekou"];
Object.assign(RIVAL_OF, { toukou: "gao", gakkou3: "mii", kyuushoku: "doshin", gekou: "pyon" });
Object.assign(KID_S, { ookami: 1.0, ojisan: 1.0, omawari: 1.3, mama: 1.0, tora: .9, kuma: 1.05, gaomama: 1.0, miimama: .98, chumama: .62 });
PIECE_S.omawari = .27; PIECE_S.mama = .22;

/* ---------- 場面：いま えらばれた 場面を おぼえる（extras のため） ---------- */
let CUR_S = null;
// extras（いっしょに 出る 子）が 主人公や 相手と かさなったら、べつの 子に かえる（「ふたりで あそぶから」の ふたりめが きえないように）
const EX_SUB = ["chu", "pyon", "doshin", "mii", "kon", "gao", "kuma", "tora"];
{ const ssv = setSitView; setSitView = function (s, k) {
    if (s && s.extras && s.extras.some(x => x === k || x === s.asker)) { const used = new Set([k, s.asker, ...s.extras]); s = { ...s, extras: s.extras.map(x => { if (x !== k && x !== s.asker) return x; const y = EX_SUB.find(z => !used.has(z) && C[z]); used.add(y); return y || x; }) }; }
    CUR_S = s; return ssv(s, k); }; }
{ const ps = pickSit; pickSit = function (place, heroKind = "shima") {
    if (curStage === "long") return ps(place, heroKind);
    // extras に 主人公が いる 場面は えらばない（なんども ためして だめなら そのまま）
    if (MODE === "solo" && heroKind !== "shima") return ps(place, heroKind); // ライバルは つかった 場面から（sit.js）。かさなる extras は setSitView で べつの 子に
    for (let i = 0; i < 12; i++) { const s = ps(place, heroKind); if (!(s.extras || []).includes(heroKind)) return s; sitUsed.delete(s.id); }
    return ps(place, heroKind); }; }
const kidS = k => KID_S[k] || .82;
function xtra(k, x, s) { const c = C[k]; resetChar(c); delete c.tm.closed; place(c, x, 975, s || kidS(k) * .92); show(c); return c; }
const stay = c => { c.dx.v = c.dx.t = 0; };
const at3 = (c, lx, ly) => world(c, lx, ly);
function onDesk(c, kind, k = .5, dx = 0) { const desk = c.__desk; const y = desk ? +desk.firstChild.getAttribute("y") - 8 : 820; const g = el("g", {}, front()); ITEM2[kind] ? ITEM2[kind](el("g", { transform: `translate(${(world(c, 200, 0).x + dx).toFixed(0)} ${y}) scale(${k})` }, g)) : drawItem(el("g", { transform: `translate(${(world(c, 200, 0).x + dx).toFixed(0)} ${y}) scale(${k})` }, g), kind); return g; }
function seat3(c) { const feet = c.y + c.base * c.s, top = world(c, 200, c.top).y, H = feet - top, dt = feet - H * .25, cx = c.x + 200 * c.s;
  const W = Math.max(150, 290 * c.s), g = el("g", {}, front());
  el("rect", { x: cx - W / 2, y: dt, width: W, height: 24, rx: 6, fill: "#D9A066", ...S6p() }, g); el("rect", { x: cx - W / 2 + 12, y: dt + 24, width: W - 24, height: feet - dt - 14, rx: 6, fill: "#C98A4B", ...S6p(5) }, g); return g; }
function sit3(c) { stay(c); c.__desk = seat3(c); return c; }
function exKids(xs = [860, 1010]) { return ((CUR_S && CUR_S.extras) || []).map((k, i) => xtra(k, xs[i] || 900 + i * 160)); }
const buzz3 = () => { if (!ctx) return; blip(180, 120, .5, "square"); };
const ring3 = () => { if (!ctx) return; for (let i = 0; i < 2; i++) later(i * 500, () => { blip(1300, 1300, .15, "sine"); later(160, () => blip(1600, 1600, .15, "sine")); }); };
const siren = () => { if (!ctx) return; for (let i = 0; i < 4; i++) later(i * 500, () => blip(i % 2 ? 900 : 700, i % 2 ? 900 : 700, .45, "triangle")); };

/* ---------- 物の 絵 ---------- */
Object.assign(ITEM2, {
  bottle(g) { el("rect", { x: -26, y: -70, width: 52, height: 120, rx: 18, fill: "#7FCBF0", ...S6p() }, g); el("rect", { x: -18, y: -90, width: 36, height: 24, rx: 6, fill: "#3E7FD6", ...S6p(5) }, g); el("path", { d: "M-26 -40 Q-70 -20 -60 40", fill: "none", ...S6p(5) }, g); },
  flag(g) { el("path", { d: "M0 0 V-220", ...S6p(8) }, g); el("path", { d: "M0 -220 L110 -190 L0 -150 Z", fill: "#FFD25E", ...S6p(5) }, g); },
  phone(g) { el("rect", { x: -30, y: -50, width: 60, height: 100, rx: 12, fill: "#FF8FA3", ...S6p() }, g); el("rect", { x: -20, y: -38, width: 40, height: 46, rx: 6, fill: "#CFEAFB", ...S6p(4) }, g); el("circle", { cy: 30, r: 7, fill: "#FFFFFF", ...S6p(3) }, g); },
  karaage(g) { [[-30, 6], [0, -10], [28, 8], [0, 16]].forEach(([x, y]) => el("ellipse", { cx: x, cy: y, rx: 28, ry: 22, fill: "#C9853E", ...S6p(4) }, g)); },
  piman(g) { el("path", { d: "M-40 -10 Q-46 30 0 36 Q46 30 40 -10 Q20 -30 0 -18 Q-20 -30 -40 -10 Z", fill: "#4FA35A", ...S6p(5) }, g); el("path", { d: "M0 -18 V-36", ...S6p(6), stroke: "#2E7D32" }, g); },
  milk(g) { el("path", { d: "M-34 -60 L0 -90 L34 -60 V50 H-34 Z", fill: "#FFFFFF", ...S6p() }, g); el("rect", { x: -34, y: -20, width: 68, height: 40, fill: "#7FCBF0" }, g); el("path", { d: "M-34 -60 H34", ...S6p(4) }, g); },
  milkpuddle(g) { el("path", { d: "M-130 0 Q-110 -26 -40 -20 Q20 -34 80 -18 Q140 -10 120 10 Q60 26 -20 20 Q-120 24 -130 0 Z", fill: "#FFFFFF", ...S6p(4) }, g); },
  soup(g) { el("path", { d: "M-120 0 Q-100 -24 -30 -18 Q30 -30 90 -14 Q130 0 110 14 Q40 26 -40 20 Q-120 22 -120 0 Z", fill: "#F2B04A", ...S6p(4) }, g); },
  pot(g) { el("path", { d: "M-110 -70 H110 V40 Q110 80 70 80 H-70 Q-110 80 -110 40 Z", fill: "#C9CED6", ...S6p() }, g); el("rect", { x: -120, y: -84, width: 240, height: 22, rx: 10, fill: "#AEB5BF", ...S6p(5) }, g); [-130, 130].forEach(x => el("rect", { x: x - 14, y: -50, width: 28, height: 18, rx: 6, fill: "#AEB5BF", ...S6p(4) }, g)); },
  ladle(g) { el("path", { d: "M0 -150 V0", ...S6p(8) }, g); el("path", { d: "M-40 0 H40 Q40 40 0 40 Q-40 40 -40 0 Z", fill: "#C9CED6", ...S6p(5) }, g); },
  rice(g) { el("path", { d: "M-70 0 Q-60 -90 0 -100 Q60 -90 70 0 Z", fill: "#FFFFFF", ...S6p() }, g); [[-30, -50], [10, -70], [30, -30]].forEach(([x, y]) => el("ellipse", { cx: x, cy: y, rx: 6, ry: 3, fill: "#E8E2D4" }, g)); },
  chopsticks(g) { el("path", { d: "M-60 -30 L60 10 M-60 -10 L60 24", stroke: "#C98A4B", "stroke-width": 10, "stroke-linecap": "round" }, g); },
  kbook(g) { el("rect", { x: -70, y: -50, width: 140, height: 100, rx: 8, fill: "#7FCBF0", ...S6p() }, g); el("path", { d: "M0 -50 V50", ...S6p(5) }, g); el("path", { d: "M-55 -25 H-15 M-55 0 H-15 M15 -25 H55 M15 0 H55", stroke: "#FFFFFF", "stroke-width": 6 }, g); },
  cross(g) { el("path", { d: "M-70 -70 L70 70 M70 -70 L-70 70", stroke: "#E8473C", "stroke-width": 28, "stroke-linecap": "round" }, g); },
  wagon(g) { el("rect", { x: -150, y: -120, width: 300, height: 200, rx: 10, fill: "#C9CED6", ...S6p() }, g); [-80, -40, 0].forEach(y => el("rect", { x: -130, y: y - 14, width: 260, height: 26, rx: 8, fill: "#F2C38F", ...S6p(4) }, g)); [-110, 110].forEach(x => el("circle", { cx: x, cy: 96, r: 20, fill: "#555", ...S6p(4) }, g)); },
  lace(g) { el("path", { d: "M0 0 Q30 30 60 10 Q80 0 100 30", fill: "none", stroke: "#FFFFFF", "stroke-width": 8, "stroke-linecap": "round" }, g); el("path", { d: "M0 0 Q30 30 60 10 Q80 0 100 30", fill: "none", stroke: INK, "stroke-width": 2 }, g); },
  arrowsign(g) { el("path", { d: "M0 0 V-260", ...S6p(10) }, g); el("path", { d: "M-20 -280 H140 L180 -240 L140 -200 H-20 Z", fill: "#FFFFFF", ...S6p(6) }, g); el("text", { x: 60, y: -228, "text-anchor": "middle", "font-family": FONT, "font-size": 40, fill: INK }, g).textContent = "こうえん"; },
});

/* ---------- へや（ばしょの え） ---------- */
function outBase(L, sky = "#CFEAFB", ground = "#C9C9C9") { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: sky }, L); el("circle", { cx: 1460, cy: 110, r: 56, fill: "#FFE27A", ...S6(5) }, L);
  [[180, 130], [720, 90]].forEach(([x, y]) => [[0, 0, 46], [46, -16, 36], [84, 6, 32]].forEach(([dx, dy, r]) => el("circle", { cx: x + dx, cy: y + dy, r, fill: "#FFFFFF" }, L)));
  el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: ground }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L); }
function house(L, x, y, w, h, wall, roof) { el("rect", { x, y, width: w, height: h, fill: wall, ...S6(6) }, L); el("path", { d: `M${x - 30} ${y} L${x + w / 2} ${y - h * .45} L${x + w + 30} ${y} Z`, fill: roof, ...S6(6) }, L);
  el("rect", { x: x + w * .12, y: y + h * .2, width: w * .26, height: h * .26, rx: 6, fill: "#CFEAFB", ...S6(4) }, L); }
function street(L) { el("rect", { x: 0, y: 640, width: 1600, height: 130, fill: "#7A7F88" }, L); el("path", { d: "M0 705 H1600", stroke: "#FFFFFF", "stroke-width": 8, "stroke-dasharray": "60 40" }, L);
  el("rect", { x: 0, y: 770, width: 1600, height: 18, fill: "#E3E3E3", ...S6(4) }, L); el("path", { d: "M0 800 H1600", stroke: "#FFFFFF", "stroke-width": 10 }, L); }
function signal(L, x) { const hold = el("g", {}, L); // ほこうしゃようの しんごう（えは odekake.js の sigG）
  window.__sig = col => { hold.innerHTML = ""; sigG(hold, x, 540, col, .74); if (col !== "red") chime(); }; window.__sig("red"); }
function classroom(L, title, extra) { el("rect", { x: 0, y: 0, width: 1600, height: 760, fill: "#FFF6E0" }, L); el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#E3C59A" }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L);
  for (let x = 0; x < 1600; x += 160) el("path", { d: `M${x} 760 L${x - 80} 1000`, stroke: "#00000010", "stroke-width": 4 }, L);
  el("rect", { x: 300, y: 150, width: 820, height: 300, rx: 10, fill: "#2F6B4F", ...S6(8) }, L); el("rect", { x: 300, y: 450, width: 820, height: 18, fill: "#B9824A", ...S6(5) }, L);
  if (title) txt(L, 360, 230, title, 48, { fill: "#FFFFFF" }); if (extra) extra(L);
  el("circle", { cx: 1290, cy: 170, r: 50, fill: "#FFFFFF", ...S6(6) }, L); el("path", { d: "M1290 170 V134 M1290 170 L1316 184", ...S6(6) }, L);
  [[1210, 270], [1380, 270]].forEach(([x, y]) => el("rect", { x, y, width: 150, height: 200, rx: 8, fill: "#CFEAFB", ...S6(6) }, L)); }
const ROOMS3 = {
  "いえの まえ"(L) { outBase(L, "#CFEAFB", "#D9CDB8"); house(L, 900, 330, 560, 430, "#FFF1D6", "#E8735A"); el("rect", { x: 1120, y: 520, width: 130, height: 240, rx: 8, fill: "#B97A4A", ...S6(6) }, L); el("circle", { cx: 1225, cy: 645, r: 9, fill: "#FFD25E", ...S6(3) }, L);
    for (let x = 20; x < 880; x += 60) el("rect", { x, y: 640, width: 34, height: 120, rx: 6, fill: "#FFFFFF", ...S6(4) }, L); el("path", { d: "M0 670 H880 M0 720 H880", ...S6(5) }, L);
    [120, 300, 480].forEach((x, i) => flower(L, x, 620, ["#FF8FA3", "#FFD25E", "#B9A8D9"][i])); },
  "しゅうごうばしょ"(L) { outBase(L); house(L, 80, 360, 340, 300, "#FFE3B3", "#7FA7D9"); house(L, 560, 380, 300, 280, "#E8F4E0", "#E8735A"); street(L);
    el("path", { d: "M1440 760 V380", ...S6(8) }, L); el("rect", { x: 1300, y: 300, width: 280, height: 100, rx: 14, fill: "#FFD25E", ...S6(6) }, L); txt(L, 1440, 365, "しゅうごうばしょ", 34, { "text-anchor": "middle" }); sceneTree(L, 1080, 100); },
  "つうがくろ"(L) { outBase(L); house(L, 60, 380, 300, 260, "#FFF1D6", "#B9A8D9"); house(L, 520, 360, 320, 280, "#E3F0FF", "#E8735A"); house(L, 1040, 380, 300, 260, "#FFE0E6", "#7CC36A"); street(L);
    el("path", { d: "M1460 640 V200", stroke: "#9A8A7A", "stroke-width": 26 }, L); el("path", { d: "M1400 240 H1520", stroke: "#9A8A7A", "stroke-width": 12 }, L); },
  "おうだんほどう"(L) { outBase(L); house(L, 80, 380, 300, 260, "#FFF1D6", "#E8735A"); street(L); for (let x = 560; x < 1160; x += 70) el("rect", { x, y: 650, width: 40, height: 115, fill: "#FFFFFF" }, L); signal(L, 1420); },
  "こうもん"(L) { outBase(L, "#CFEAFB", "#D9CDB8"); el("rect", { x: 300, y: 220, width: 1000, height: 540, fill: "#FFF4E0", ...S6(8) }, L); el("rect", { x: 740, y: 620, width: 120, height: 140, rx: 6, fill: "#B9824A", ...S6(5) }, L); el("path", { d: "M800 620 V760", ...S6(4) }, L); [[380, 470], [600, 470], [960, 470], [1180, 470]].forEach(([x, y]) => el("rect", { x, y, width: 110, height: 90, rx: 6, fill: "#CFEAFB", ...S6(4) }, L)); el("path", { d: "M300 220 L800 140 L1300 220 Z", fill: "#E8735A", ...S6(8) }, L);
    [[380, 300], [600, 300], [960, 300], [1180, 300]].forEach(([x, y]) => el("rect", { x, y, width: 110, height: 90, rx: 6, fill: "#CFEAFB", ...S6(4) }, L)); el("circle", { cx: 800, cy: 190, r: 26, fill: "#FFFFFF", ...S6(5) }, L);
    [920, 1460].forEach(x => el("rect", { x: x - 40, y: 440, width: 80, height: 320, rx: 6, fill: "#BDB6AA", ...S6(6) }, L)); el("rect", { x: 1420, y: 480, width: 80, height: 180, fill: "#FFFFFF", ...S6(4) }, L);
    ["が", "っ", "こ", "う"].forEach((t, i) => txt(L, 1460, 520 + i * 40, t, 34, { "text-anchor": "middle" })); el("circle", { cx: 160, cy: 380, r: 130, fill: "#FFC2D1", ...S6(6) }, L); el("rect", { x: 140, y: 480, width: 40, height: 280, fill: "#9A6B43", ...S6(5) }, L); },
  "かえりみち"(L) { outBase(L, "#FFE3C2"); house(L, 60, 380, 300, 260, "#FFF1D6", "#B9A8D9"); house(L, 620, 360, 320, 280, "#E3F0FF", "#E8735A"); street(L); [180, 320, 460].forEach((x, i) => flower(L, x, 740, ["#FF8FA3", "#FFD25E", "#B9A8D9"][i])); },
  "こうさてん"(L) { outBase(L, "#FFE3C2"); house(L, 60, 380, 300, 260, "#FFF1D6", "#E8735A"); street(L); for (let x = 460; x < 900; x += 70) el("rect", { x, y: 650, width: 40, height: 115, fill: "#FFFFFF" }, L); signal(L, 1500); window.__sig("green"); },
  "びょういん"(L) { el("rect", { x: 0, y: 0, width: 1600, height: 760, fill: "#EAF7F2" }, L); el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#CDE6DA" }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L);
    el("rect", { x: 380, y: 150, width: 160, height: 160, rx: 20, fill: "#FFFFFF", ...S6(6) }, L); el("path", { d: "M460 180 V280 M410 230 H510", stroke: "#E8473C", "stroke-width": 30 }, L);
    el("rect", { x: 700, y: 560, width: 380, height: 60, rx: 14, fill: "#FFFFFF", ...S6(6) }, L); el("rect", { x: 700, y: 620, width: 380, height: 40, fill: "#BFE3F7", ...S6(4) }, L); el("path", { d: "M720 660 V760 M1060 660 V760", ...S6(8) }, L);
    el("rect", { x: 1380, y: 200, width: 160, height: 220, rx: 8, fill: "#CFEAFB", ...S6(6) }, L); },
  "いえ"(L) { el("rect", { x: 0, y: 0, width: 1600, height: 760, fill: "#FDEBD3" }, L); el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#E3C59A" }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L); ROOMS2.いえ(L); },
  "あさの かい"(L) { classroom(L, "あさの かい", L => { txt(L, 360, 310, "きょうの よてい", 36, { fill: "#FFFFFF" }); el("path", { d: "M360 360 H800 M360 410 H700", stroke: "#FFFFFF", "stroke-width": 6, "stroke-dasharray": "30 14", opacity: .7 }, L); }); },
  "こくご"(L) { classroom(L, "こくご", L => { for (let x = 1040; x > 600; x -= 70) el("path", { d: `M${x} 190 V420`, stroke: "#FFFFFF", "stroke-width": 6, "stroke-dasharray": "26 14", opacity: .7 }, L); }); },
  "さんすう"(L) { classroom(L, "さんすう", L => { txt(L, 520, 380, "8 ＋ 7 ＝ ？", 80, { fill: "#FFFFFF" }); }); },
  "やすみじかん"(L) { classroom(L, "", L => { txt(L, 420, 300, "やすみじかん", 60, { fill: "#FFFFFF" }); el("circle", { cx: 960, cy: 330, r: 50, fill: "none", stroke: "#FFD25E", "stroke-width": 8 }, L); }); },
  "かえりの かい"(L) { classroom(L, "かえりの かい", L => { txt(L, 360, 320, "あしたの もちもの", 36, { fill: "#FFFFFF" }); }); el("rect", { x: 1210, y: 270, width: 320, height: 200, fill: "#FFC98A", opacity: .5 }, L); },
  "テーブル"(L) { classroom(L, "", L => { txt(L, 360, 230, "きょうの こんだて", 44, { fill: "#FFFFFF" }); ["・カレー", "・からあげ", "・ぎゅうにゅう"].forEach((t, i) => txt(L, 380, 300 + i * 50, t, 36, { fill: "#FFFFFF" })); }); },
  "はいぜん"(L) { classroom(L, "", L => txt(L, 360, 260, "きゅうしょく とうばん", 44, { fill: "#FFFFFF" })); el("rect", { x: 900, y: 600, width: 560, height: 40, rx: 10, fill: "#E0A060", ...S6(6) }, L); el("path", { d: "M930 640 V760 M1430 640 V760", ...S6(8) }, L);
    const pg = el("g", { transform: "translate(1180 520) scale(.8)" }, L); ITEM2.pot(pg); },
  "かたづけ"(L) { classroom(L, "", L => txt(L, 360, 260, "ごちそうさま", 50, { fill: "#FFFFFF" })); const wg = el("g", { transform: "translate(1350 680) scale(.9)" }, L); ITEM2.wagon(wg); },
};
{ const dr = drawRoom; drawRoom = function (place, noSign = false) {
    if (!S3.includes(curStage) || !ROOMS3[place]) return dr(place, noSign);
    sceneLayer.innerHTML = ""; ROOMS3[place](sceneLayer);
    if (!noSign) { const g = el("g", {}, sceneLayer); el("rect", { x: 620, y: 24, width: 360, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, place.length > 6 ? 38 : 46, { "text-anchor": "middle" }); }
  }; }

/* ---------- できごとの アニメ ---------- */
const ON3 = ["sendoff", "group", "shoelace", "roadstep", "tktrip", "redlight", "guard", "scaredgate", "pale",
  "nohomework", "nobook", "sharebook", "called", "laughed", "fidget", "mumble", "sick", "crying", "goodbye",
  "lunchstart", "spill", "bellyache", "yummy", "peppers", "milkspill", "seconds", "bigscoop", "full", "nochopsticks", "tray", "lunchend",
  "gkgate", "gkalone", "gkdetour", "gkrain", "gkdoctor", "gkbandage", "gkneighbor", "gkhome", "gktalk"];
ON3.forEach(k => ASK_ON_STAGE.add(k));
["tktrip", "stranger", "scaredgate", "pale", "sick", "fidget", "crying", "bellyache", "gkhit", "gkphone", "gkpolice", "gkdoctor", "gkbandage"].forEach(k => SOFT_INTRO.add(k));
const desk3 = (h, ...cs) => { sit3(h); cs.forEach(sit3); };
const trayOn = (c, food) => { onDesk(c, "tray", .55); if (food) onDesk(c, food, .45, 30); };
Object.assign(INTRO, {
  // ---- とうこう ----
  async sendoff(h, a) { stay(h); place(a, 1180, 975, 1.0); await sleep(500); jump(h, .4); await sleep(300); wave(a); await sleep(900); },
  async bottle(h, a) { stay(h); await walk(h, -160, 800); const b = prop("bottle", 0, 0, .45); hand(a, b, .45, 0); window.__bottle = b; enter(a); await sleep(1000); markAbove(a, "ex"); surprise(h); await sleep(400); },
  async group(h, a) { exKids([850, 1000]).forEach((c, i) => later(1200 + i * 200, () => wave(c))); hand(a, prop("flag", 0, 0, .5), .5, 0); enter(h); await sleep(1300); jump(a, .5); await sleep(500); },
  async shoelace(h, a) { place(a, 1250, 975, 1.1); hand(a, prop("flag", 0, 0, .5), .5, 0); enter(h); await sleep(1100); const p = world(h, 170, h.base); const l = el("g", { transform: `translate(${p.x.toFixed(0)} ${(p.y - 10).toFixed(0)}) scale(.9)` }, front()); ITEM2.lace(l);
    playMove(h, "crouch"); markAbove(h, "drop"); await sleep(900); },
  async roadstep(h, a) { window.__y0 = a.y; enter(h); await sleep(900); hold(a, "tiptoe", 2); a.dx.t = 120; const y0 = a.y; await tween(800, k => a.y = y0 - 170 * k);
    const car = vehicle("car", 760); window.__car = car; await pass(car, 900, 760, 1700, 1480); horn(); surprise(h); markAbove(h, "ex"); await sleep(400); },
  async tktrip(h, a) { a.dx.v = a.dx.t = 0; hold(a, "run", 1); enter(h); await sleep(900); thud(); flop(a); await sleep(500); a.sadMouth = true; tears(a, 2); surprise(h); await sleep(700); },
  async stranger(h, a) { const car = vehicle("car", 770); car.setAttribute("transform", "translate(1330 770)"); enter(h); await sleep(1000);
    hold(a, "tiptoe", 2.4); a.dx.t = -60; await sleep(1500); hand(a, prop("candy", 0, 0, .35), .35, 0); a.lean.t = -12; h.eyeScale.t = 1.2; markAbove(h, "drop"); await sleep(600); },
  async redlight(h, a) { window.__sig("red"); a.lean.t = -14; hold(a, "tiptoe", 2.5); enter(h); await sleep(1100); a.armR.t = -120; markAbove(h, "ex"); await sleep(600); a.armR.t = 0; },
  async guard(h, a) { window.__sig("red"); const f = prop("flag", 0, 0, .55); hand(a, f, .55, -90); window.__flag = f; enter(h); await sleep(1300); window.__sig("green"); await sleep(500); playMove(a, "nod"); },
  async tkbump(h, a) { enter(h); await sleep(500); hold(a, "run", 1.2); a.dx.t = -330; await sleep(1100); thud(); noise(.15, 500, .4); flop(a); a.sadMouth = true; markAbove(a, "drop"); surprise(h); markAbove(h, "ex"); await sleep(600); },
  async scaredgate(h, a) { hold(h, "run", 1); h.dx.t = 0; await sleep(900); hold(h, "shiver", 2.5); h.sadMouth = true; for (let i = 0; i < 3; i++) later(i * 400, () => markAbove(h, "drop", { dx: i % 2 ? 60 : -60 })); await sleep(1000); playMove(a, "look"); await sleep(400); },
  async pale(h, a) { h.sadMouth = true; h.eyeScale.t = .75; hold(h, "run", 2); h.dx.t = 0; await sleep(1800); h.armL.t = 40; h.armR.t = -40; hold(h, "shiver", 1.5); markAbove(h, "drop"); await sleep(800); },
  // ---- がっこう3 ----
  async teacherin(h, a) { const ks = exKids(); desk3(h, ...ks); a.dx.v = a.dx.t = 700; await sleep(500); hold(a, "run", 1); a.dx.t = 0; await sleep(1100); playMove(a, "bow"); await sleep(600); },
  async nohomework(h, a) { desk3(h, ...exKids([940])); const b = onDesk(h, "bag", .4); window.__bag = b; await sleep(400); hold(h, "shake", 1.6); playMove(h, "look"); await sleep(1600); markAbove(h, "drop"); h.sadMouth = true; await sleep(500); },
  async nobook(h, a) { const ks = exKids([940]); desk3(h, ...ks); ks.forEach(c => onDesk(c, "kbook", .5)); await sleep(400); playMove(h, "look"); await sleep(1200); surprise(h); markAbove(h, "drop"); await sleep(500); },
  async sharebook(h, a) { place(a, 950, 975, .95); desk3(h, a); window.__book = onDesk(a, "kbook", .5); await sleep(600); h.eyeX.t = 14; markAbove(h, "q"); await sleep(800); h.eyeX.t = 0; playMove(a, "look"); await sleep(500); },
  async called(h, a) { desk3(h, ...exKids([940])); await sleep(500); a.armR.t = -110; await sleep(400); surprise(h); markAbove(h, "ex"); await sleep(600); },
  async laughed(h, a) { place(a, 950, 975, .9); desk3(h, a); await sleep(500); jump(h, .3); await sleep(500); buzz3(); const x = el("g", {}, front()); const p = world(h, 200, 100); ITEM2.cross(el("g", { transform: `translate(${p.x.toFixed(0)} ${p.y.toFixed(0)}) scale(.8)` }, x)); later(1300, () => x.remove());
    h.sadMouth = true; await sleep(700); playMove(a, "laugh"); a.armL.t = -100; await sleep(500); },
  async fidget(h, a) { desk3(h); await sleep(400); hold(h, "shiver", 3); for (let i = 0; i < 3; i++) later(i * 500, () => markAbove(h, "drop", { dx: i % 2 ? 60 : -60 })); await sleep(1600); playMove(a, "look"); await sleep(400); },
  async mumble(h, a) { desk3(h, ...exKids([940])); await sleep(500); playMove(h, "look"); h.lean.t = 10; markAbove(h, "q"); await sleep(1000); h.lean.t = 0; },
  async sick(h, a) { desk3(h); h.sadMouth = true; h.eyeScale.t = .7; sway(h, 2600, 8, 500); markAbove(h, "drop"); await sleep(1500); await walk(a, -120, 700); },
  async snatch(h, a) { stay(h); const p = prop("pencil", 0, 0, .35); hand(h, p, .35, 0); a.dx.v = a.dx.t = 900; await sleep(500); hold(a, "run", 1); a.dx.t = -260; await sleep(1000);
    p.remove(); const q = prop("pencil", 0, 0, .35); hand(a, q, .35, 0); window.__pen = q; a.armR.t = -150; a.tm.wag = 2; surprise(h); await sleep(700); },
  async crying(h, a) { playMove(a, "crouch"); a.sadMouth = true; tears(a, 3); for (let i = 0; i < 4; i++) later(i * 600, () => markAbove(a, "drop", { dx: i % 2 ? 50 : -50 })); enter(h); await sleep(1300); surprise(h); await sleep(400); },
  async goodbye(h, a) { const ks = exKids(); desk3(h, ...ks); await sleep(600); playMove(a, "bow"); await sleep(600); },
  // ---- きゅうしょく ----
  async lunchstart(h, a) { const ks = exKids([920, 1080]); desk3(h, ...ks); [h, ...ks].forEach(c => trayOn(c, "karaage")); await sleep(500); a.armL.t = -60; a.armR.t = 60; await sleep(700); },
  async spill(h, a) { desk3(h); trayOn(h); const p = world(h, 200, 0); const b = onDesk(h, "bowl", .5, 40); await sleep(700);
    await tween(400, k => b.setAttribute("transform", `rotate(${(80 * k).toFixed(0)} ${(p.x + 40).toFixed(0)} ${(+h.__desk.firstChild.getAttribute("y")).toFixed(0)})`)); noise(.3, 900, .4);
    const sp = el("g", { transform: `translate(${(p.x + 90).toFixed(0)} ${(+h.__desk.firstChild.getAttribute("y") + 6).toFixed(0)}) scale(.7)` }, front()); ITEM2.soup(sp); surprise(h); markAbove(h, "ex"); await sleep(700); },
  async bellyache(h, a) { desk3(h); trayOn(h, "karaage"); h.sadMouth = true; h.armL.t = 40; h.armR.t = -40; await sleep(800); markAbove(h, "drop"); hold(h, "shiver", 1.2); await sleep(900); },
  async yummy(h, a) { place(a, 940, 975, .86); const ks = exKids([1120]); desk3(h, a, ...ks); [h, a, ...ks].forEach(c => trayOn(c, "karaage")); await sleep(500);
    for (let i = 0; i < 4; i++) later(i * 220, () => { a.mouthOpen.t = i % 2 ? 0 : .5; }); await sleep(1000); a.happyOn = true; markAbove(a, "heart"); await sleep(400); },
  async peppers(h, a) { place(a, 940, 975, .46); desk3(h, a); trayOn(h, "piman"); trayOn(a, "piman"); await sleep(600); a.armR.t = -100; markAbove(a, "q"); await sleep(700); },
  async milkspill(h, a) { place(a, 980, 975, .95); desk3(h, a); trayOn(h); trayOn(a); const m = onDesk(a, "milk", .5, -70); await sleep(600);
    a.lean.t = -18; later(300, () => a.lean.t = 0); const y = +a.__desk.firstChild.getAttribute("y"), x = world(a, 130, 0).x;
    await tween(400, k => m.setAttribute("transform", `rotate(${(-90 * k).toFixed(0)} ${x.toFixed(0)} ${y})`)); noise(.3, 900, .4);
    const pd = el("g", { transform: `translate(${(x - 120).toFixed(0)} ${y + 4}) scale(.8)` }, front()); ITEM2.milkpuddle(pd); surprise(a); surprise(h); await sleep(500); },
  async seconds(h, a) { const b = prop("bowl", 0, 0, .4); hand(h, b, .4, 0); enter(h); await sleep(1100); playMove(h, "look"); await sleep(500); },
  async bigscoop(h, a) { const lad = prop("ladle", 0, 0, .5); hand(a, lad, .5, 0); const bw = prop("bowl", 0, 0, .4); hand(h, bw, .4, 0); enter(h); await sleep(1100);
    const r = el("g", {}, front()); window.__rice = r; for (let i = 1; i <= 6; i++) { const p = world(h, 330, 280); r.innerHTML = ""; ITEM2.rice(el("g", { transform: `translate(${p.x.toFixed(0)} ${p.y.toFixed(0)}) scale(${(.3 + i * .15).toFixed(2)})` }, r)); pop(); await sleep(250); }
    surprise(h); await sleep(400); },
  async full(h, a) { desk3(h); trayOn(h, "karaage"); await sleep(400); h.lean.t = -10; h.roundMouth = true; h.armL.t = 40; h.armR.t = -40; await sleep(1200); markAbove(h, "drop"); await sleep(500); },
  async nochopsticks(h, a) { desk3(h); trayOn(h, "karaage"); onDesk(h, "bag", .3, -70); await sleep(500); hold(h, "shake", 1.2); playMove(h, "look"); await sleep(1300); markAbove(h, "q"); await sleep(400); },
  async tray(h, a) { place(a, 940, 975, .9); desk3(h, a); trayOn(h); window.__tray = onDesk(a, "tray", .55); await sleep(500); a.__desk.remove(); jump(a, .4); hold(a, "run", 1); a.dx.t = 320; await sleep(1000); markAbove(h, "ex"); await sleep(300); },
  async lunchend(h, a) { const ks = exKids([920, 1080]); desk3(h, ...ks); [h, ...ks].forEach(c => trayOn(c)); await sleep(800); },
  // ---- げこう ----
  async gkgate(h, a) { enter(h); await sleep(1100); wave(a); await sleep(600); },
  async gkalone(h, a) { a.sadMouth = true; a.headY.t = 14; enter(h); await sleep(1200); playMove(h, "look"); await sleep(500); },
  async gkdetour(h, a) { prop("arrowsign", 1450, 760, .9); a.armR.t = -130; enter(h); await sleep(1200); a.armR.t = 0; jump(a, .4); await sleep(400); },
  async gkrain(h, a) { const rn = el("g", {}, front()); window.__rain = rn; for (let i = 0; i < 50; i++) el("path", { d: `M${(i * 97) % 1600} ${(i * 53) % 900} l-14 40`, stroke: "#7FCBF0", "stroke-width": 4 }, rn);
    let t = 0; addTick(dt => { if (!rn.isConnected) return false; t += dt; rn.setAttribute("transform", `translate(${(-((t * 140) % 40)).toFixed(0)} ${((t * 400) % 120).toFixed(0)})`); });
    noise(1.2, 3000, .15); a.armL.t = -150; a.armR.t = 150; hold(a, "shiver", 3); const u = umbOver(h); window.__umb2 = u; enter(h); await sleep(1300); },
  async gkhit(h, a) { stay(h); hold(h, "run", 1.2); await sleep(800); const car = vehicle("car", 800); window.__car = car; await pass(car, 700, 800, 1700, world(h, 300, 0).x - 20); thud(); boom(.5); shake(400, 18); flop(h);
    { const st = slam("ドン！", 300, 110, "#FFD25E"); later(900, () => st.remove()); } await sleep(500); playMove(h, "crouch"); h.sadMouth = true; tears(h, 3); for (let i = 0; i < 3; i++) later(i * 300, () => markAbove(h, "drop", { dx: i % 2 ? 60 : -60 })); await sleep(700); hold(a, "run", 1); a.dx.t = 0; await sleep(1000); playMove(a, "crouch"); },
  async gkphone(h, a) { stay(h); hold(h, "run", 1.2); await sleep(600); const car = vehicle("car", 800); await pass(car, 700, 800, 1300, world(h, 300, 0).x - 20); thud(); boom(.4); shake(300, 14); flop(h); // くるまに はねられる → すわりこんで ママに でんわ
    { const st = slam("ドン！", 300, 110, "#FFD25E"); later(900, () => st.remove()); } await sleep(700); playMove(h, "crouch"); h.sadMouth = true; tears(h, 2); await sleep(700); const p = prop("phone", 0, 0, .45); hand(h, p, .45, 0);
    await sleep(600); ring3(); a.dx.v = a.dx.t = 0; const ph = prop("phone", 0, 0, .45); hand(a, ph, .45, 0); markAbove(a, "ex"); await sleep(900); },
  async gkpolice(h, a) { stay(h); const car = vehicle("car", 800); car.setAttribute("transform", "translate(1250 800)"); const oj = xtra("ojisan", 930, .9); playMove(oj, "shy"); siren(); hold(a, "run", 1.2); a.dx.t = 0; await sleep(1300); playMove(a, "bow"); await sleep(400); },
  async gkdoctor(h, a) { stay(h); h.sadMouth = true; await sleep(700); playMove(a, "look"); await sleep(600); },
  async gkbandage(h, a) { stay(h); const p = world(h, 170, h.base - 60); const b = el("g", { transform: `translate(${p.x.toFixed(0)} ${p.y.toFixed(0)}) scale(.3)` }, front()); drawItem(b, "bandage"); await sleep(600); jump(h, .3); h.happyOn = true; await sleep(700); h.happyOn = false; },
  async gkneighbor(h, a) { const w = waterArc(world(a, 330, 300).x, world(a, 330, 300).y); window.__water = w; enter(h); await sleep(1300); w.remove(); wave(a); await sleep(400); },
  async gkhome(h, a) { enter(h); await sleep(1300); jump(a, .4); await sleep(400); },
  async gktalk(h, a) { stay(h); const t = el("g", {}, front()); el("rect", { x: 760, y: 820, width: 340, height: 30, rx: 10, fill: "#C98A4B", ...S6p() }, t); prop("apple", 900, 800, .4); await sleep(900); },
});
Object.assign(POST, {
  async tkittekimasu(h, a) { wave(a); wave(h); await sleep(400); await walk(h, -500, 1000); },
  async tksuitou(h, a) { const b = window.__bottle; if (b) b.remove(); hand(h, prop("bottle", 0, 0, .45), .45, 0); joy(h); await sleep(600); },
  async tkminna(h, a) { joy(a); await sleep(500); },
  async tkmatte(h, a) { playMove(a, "nod"); hold(h, "shake", 1.2); await sleep(1300); jump(h, .4); },
  async tkhamidashi(h, a) { const y0 = a.y, y1 = window.__y0 || y0 + 170; hold(a, "run", .7); await tween(700, k => { a.y = y0 + (y1 - y0) * k; }); a.dx.t = 0; const car = window.__car; if (car) pass(car, 900, 760, 1480, -1200); playMove(a, "bow"); await sleep(600); },
  async tkkoronda(h, a) { a.sadMouth = false; jump(a, .3); await sleep(400); a.happyOn = true; await sleep(500); },
  async tktasukete(h, a) { surprise(a); hold(a, "run", 1.2); await walk(a, 1000, 900); await sleep(300); },
  async tkakashingou(h, a) { a.lean.t = 0; await walk(a, 60, 400); await sleep(400); window.__sig && window.__sig("green"); playMove(a, "nod"); await sleep(500); },
  async tkmidori(h, a) { playMove(a, "nod"); await sleep(500); },
  async tkbutsukatta(h, a) { a.sadMouth = false; jump(a, .3); a.happyOn = true; playMove(h, "bow"); await sleep(600); },
  async tkshiraseru(h, a) { h.sadMouth = false; playMove(a, "nod"); await sleep(600); },
  async tkonakaitai(h, a) { h.sadMouth = false; h.armL.t = 0; h.armR.t = 0; playMove(a, "nod"); await sleep(500); },
  async gsohayou3(h, a) { playMove(h, "bow"); CUR_S && (CUR_S.extras || []).forEach(k => playMove(C[k], "bow")); await sleep(700); },
  async gsshukudai(h, a) { h.sadMouth = false; playMove(h, "bow"); await sleep(600); },
  async gsmisete(h, a) { const b = window.__book; if (b) { const m = b.transform.baseVal.consolidate(); const x0 = m ? m.matrix.e : 0; await tween(600, k => b.setAttribute("transform", `translate(${(-130 * k).toFixed(0)} 0)`)); } joy(a); await sleep(400); },
  async gswarawanaide(h, a) { h.sadMouth = false; a.armL.t = 0; playMove(a, "shy"); await sleep(600); },
  async gstoire3(h, a) { if (h.__desk) h.__desk.remove(); await walk(h, -700, 900); },
  async gskimochi(h, a) { playMove(a, "nod"); await sleep(500); },
  async gskaeshite(h, a) { const p = window.__pen; if (p) p.remove(); a.armR.t = 0; hand(h, prop("pencil", 0, 0, .35), .35, 0); playMove(a, "bow"); await sleep(600); },
  async gsdoushita(h, a) { playMove(h, "look"); playMove(a, "look"); await sleep(800); },
  async gssayounara(h, a) { wave(a); wave(h); CUR_S && (CUR_S.extras || []).forEach(k => wave(C[k])); await sleep(700); },
  async kyitadakimasu(h, a) { a.armL.t = 0; a.armR.t = 0; [h, ...((CUR_S && CUR_S.extras) || []).map(k => C[k])].forEach(c => { for (let i = 0; i < 4; i++) later(i * 220, () => { c.mouthOpen.t = i % 2 ? 0 : .5; }); }); await sleep(1000); },
  async kykoboshita(h, a) { hand(a, prop("rag", 0, 0, .3), .3, 0); await walk(a, -300, 900); playMove(a, "crouch"); await sleep(600); },
  async kygyuunyuu(h, a) { playMove(a, "bow"); await sleep(600); },
  async kyokawari(h, a) { const lad = prop("ladle", 0, 0, .5); hand(a, lad, .5, 0); a.armR.t = -60; await sleep(500); a.armR.t = 0; joy(h); await sleep(500); },
  async kysukoshi(h, a) { const r = window.__rice; if (r) { const g = r.firstChild; await tween(500, k => g && g.setAttribute("transform", g.getAttribute("transform").replace(/scale\([^)]*\)/, `scale(${(1.2 - .8 * k).toFixed(2)})`))); } playMove(a, "shy"); await sleep(400); },
  async kykatazuke(h, a) { await walk(a, -320, 900); const t = window.__tray; if (t) t.remove(); hand(a, prop("tray", 0, 0, .5), .5, 0); await sleep(400); await walk(a, 400, 900); },
  async kyohashi(h, a) { hand(h, prop("chopsticks", 0, 0, .35), .35, 0); joy(h); await sleep(500); },
  async kygochisousama(h, a) { playMove(h, "bow"); CUR_S && (CUR_S.extras || []).forEach(k => playMove(C[k], "bow")); await sleep(700); },
  async gkisshoni(h, a) { a.sadMouth = false; a.headY.t = 0; joy(a); await sleep(500); },
  async gkyorimichi(h, a) { playMove(a, "frustrated"); await sleep(700); },
  async gkkasa(h, a) { a.armL.t = 0; a.armR.t = 0; const d = (h.x + 200 * h.s + 170) - (a.x + 200 * a.s + a.dx.v); await walk(a, d, 900); if (window.__umb2) window.__umb2.share = a; a.happyOn = true; await sleep(800); },
  async gkitai(h, a) { playMove(a, "bow"); await sleep(600); },
  async gkdenwa(h, a) { hold(a, "run", 1); await walk(a, 900, 900); },
  async gkomawari(h, a) { playMove(a, "nod"); await sleep(500); },
  async gkkyuukyuu(h, a) { for (let i = 0; i < 4; i++) later(i * 200, () => markAbove(h, "sparkle", { dx: (i - 1.5) * 40 })); h.sadMouth = false; await sleep(900); },
  async gkchiryou(h, a) { playMove(h, "bow"); await sleep(600); },
  async gktadaima(h, a) { await walk(h, -700, 900); },
});

/* ---------- 盤 ---------- */
STAGE_DEF.toukou = { ground: "#CFE8B8", sky: "#CFEAFB", names: ["いえの まえ", "いえの まえ", "しゅうごうばしょ", "つうがくろ", "つうがくろ", "おうだんほどう", "つうがくろ", "おうだんほどう", "こうもん"],
  fills: { "いえの まえ": "#FFE3B3", しゅうごうばしょ: "#FFF1B8", つうがくろ: "#E9E4DA", おうだんほどう: "#D7ECFF", こうもん: "#FFE0E6" } };
STAGE_DEF.gakkou3 = { ground: "#F6E7C8", sky: "#CFEAFB", names: ["あさの かい", "あさの かい", "こくご", "こくご", "さんすう", "さんすう", "やすみじかん", "さんすう", "かえりの かい"],
  fills: { "あさの かい": "#FFE3B3", こくご: "#FFE0E6", さんすう: "#D7ECFF", やすみじかん: "#D7F0D2", "かえりの かい": "#E7DCFA" } };
STAGE_DEF.kyuushoku = { ground: "#FFF1D6", sky: "#CFEAFB", names: ["はいぜん", "はいぜん", "テーブル", "テーブル", "テーブル", "テーブル", "テーブル", "テーブル", "かたづけ"],
  fills: { はいぜん: "#FFE3B3", テーブル: "#FFD9CF", かたづけ: "#D7ECFF" } };
STAGE_DEF.gekou = { ground: "#F6E2C8", sky: "#FFE3C2", names: ["こうもん", "こうもん", "かえりみち", "こうさてん", "こうさてん", "びょういん", "かえりみち", "びょういん", "いえ"],
  fills: { こうもん: "#FFE0E6", かえりみち: "#FFF1B8", こうさてん: "#E9E4DA", びょういん: "#D7F0E6", いえ: "#FFE3B3" } };
/* とうこう：いえ（ひだり下）から がっこう（みぎ上）へ。ちかみちは こうえんの なか */
{ const n = {}, pl = {}, nx = {};
  chain(["0", "1", "2", "3", "4", "f1"], [[200, 900], [400, 900], [600, 900], [800, 900], [1000, 900], [1200, 860]], "いえの まえ", n, pl); pl["2"] = pl["3"] = "しゅうごうばしょ"; pl["4"] = pl.f1 = "つうがくろ";
  chain(["a1", "a2", "a3", "a4"], [[1400, 760], [1440, 600], [1300, 500], [1100, 470]], "おうだんほどう", n, pl);
  chain(["b1", "b2"], [[1100, 720], [920, 620]], "つうがくろ", n, pl);
  chain(["m1", "m2", "f2"], [[900, 470], [700, 500], [500, 480]], "つうがくろ", n, pl);
  chain(["c1", "c2", "c3"], [[360, 380], [460, 250], [680, 220]], "おうだんほどう", n, pl);
  chain(["d1"], [[700, 340]], "つうがくろ", n, pl);
  chain(["e1", "e2"], [[880, 240], [1080, 240]], "こうもん", n, pl);
  n["15"] = [1290, 250, "goal"]; pl["15"] = "こうもん"; n["0"].push("start"); n["4"].push("block");
  linkLine(nx, ["0", "1", "2", "3", "4", "f1", "a1", "a2", "a3", "a4", "m1", "m2", "f2", "c1", "c2", "c3", "e1", "e2", "15"]); linkLine(nx, ["f1", "b1", "b2", "m1"]); linkLine(nx, ["f2", "d1", "e1"]);
  BOARD.toukou = { nodes: n, place: pl, next: nx, away: [1000, 760], style: (a, b) => ["b1", "b2", "d1"].includes(a) || ["b1", "d1"].includes(b) ? "park" : (pl[a] === "おうだんほどう" && pl[b] === "おうだんほどう") ? "zebra" : "sidewalk",
    labels: [["いえの まえ", 260, 990], ["しゅうごうばしょ", 700, 990], ["おうだんほどう", 1440, 420], ["つうがくろ", 700, 600], ["こうもん", 1080, 160]] }; }
/* がっこう3：きょうしつの 1にち（とけいの まわり） */
{ const n = {}, pl = {}, nx = {}; const T = arcPts(800, 560, 600, 330, [150, 128, 106, 84, 62, 40, 18, -6]);
  chain(["0", "1", "2", "3", "4", "f1", "a1", "a2"], T, "あさの かい", n, pl); pl["3"] = pl["4"] = pl.f1 = "こくご"; pl.a1 = pl.a2 = "さんすう";
  chain(["a3", "a4", "a5"], arcPts(800, 560, 600, 330, [-30, -55, -80]), "さんすう", n, pl);
  chain(["b1", "b2"], [[1150, 600], [960, 560]], "やすみじかん", n, pl);
  chain(["m1", "m2", "f2"], arcPts(800, 560, 600, 330, [-105, -130, -155]), "やすみじかん", n, pl);
  chain(["c1", "c2"], arcPts(800, 560, 600, 330, [-180, -205]), "かえりの かい", n, pl);
  chain(["d1"], [[560, 420]], "かえりの かい", n, pl);
  n["15"] = [800, 560, "goal"]; pl["15"] = "かえりの かい"; n["0"].push("start"); n["4"].push("block");
  linkLine(nx, ["0", "1", "2", "3", "4", "f1", "a1", "a2", "a3", "a4", "a5", "m1", "m2", "f2", "c1", "c2", "15"]); linkLine(nx, ["f1", "b1", "b2", "m1"]); linkLine(nx, ["f2", "d1", "15"]);
  BOARD.gakkou3 = { nodes: n, place: pl, next: nx, away: [300, 760], style: (a, b) => ["b1", "b2", "d1"].includes(a) || ["b1", "d1"].includes(b) ? "hall" : "classwood",
    labels: [["あさの かい", 300, 990], ["こくご", 900, 990], ["さんすう", 1480, 520], ["やすみじかん", 800, 150], ["かえりの かい", 210, 500]] }; }
/* きゅうしょく：おぼんの うえを ぐるっと */
{ const n = {}, pl = {}, nx = {};
  chain(["0", "1", "2", "3", "4", "f1"], [[220, 880], [420, 900], [620, 900], [820, 900], [1020, 900], [1220, 880]], "はいぜん", n, pl); pl["3"] = pl["4"] = pl.f1 = "テーブル";
  chain(["a1", "a2", "a3"], [[1400, 760], [1420, 580], [1300, 420]], "テーブル", n, pl);
  chain(["b1", "b2"], [[1120, 700], [1000, 560]], "テーブル", n, pl);
  chain(["m1", "m2", "f2"], [[1100, 340], [880, 300], [660, 320]], "テーブル", n, pl);
  chain(["c1", "c2", "c3"], [[440, 360], [300, 500], [380, 660]], "かたづけ", n, pl);
  chain(["d1"], [[620, 520]], "かたづけ", n, pl);
  n["15"] = [600, 700, "goal"]; pl["15"] = "かたづけ"; n["0"].push("start"); n["4"].push("block");
  linkLine(nx, ["0", "1", "2", "3", "4", "f1", "a1", "a2", "a3", "m1", "m2", "f2", "c1", "c2", "c3", "15"]); linkLine(nx, ["f1", "b1", "b2", "m1"]); linkLine(nx, ["f2", "d1", "15"]);
  BOARD.kyuushoku = { nodes: n, place: pl, next: nx, away: [1300, 760], style: (a, b) => ["b1", "b2", "d1"].includes(a) || ["b1", "d1"].includes(b) ? "hall" : "mat",
    labels: [["はいぜん", 360, 990], ["テーブル", 1480, 300], ["かたづけ", 200, 580]] }; }
/* げこう：がっこう（ひだり上）から いえ（みぎ下）へ。びょういんに よる みちも */
{ const n = {}, pl = {}, nx = {};
  chain(["0", "1", "2", "3", "4", "f1"], [[260, 240], [460, 230], [660, 240], [860, 260], [1060, 260], [1260, 300]], "こうもん", n, pl); pl["3"] = pl["4"] = pl.f1 = "かえりみち";
  chain(["a1", "a2", "a3"], [[1400, 440], [1380, 600], [1200, 660]], "こうさてん", n, pl);
  chain(["b1", "b2"], [[1100, 420], [940, 500]], "びょういん", n, pl);
  chain(["m1", "m2", "f2"], [[1000, 660], [800, 640], [600, 600]], "びょういん", n, pl); pl.m1 = "こうさてん";
  chain(["c1", "c2", "c3"], [[400, 640], [360, 800], [560, 880]], "かえりみち", n, pl);
  chain(["d1"], [[700, 760]], "かえりみち", n, pl);
  chain(["e1", "e2"], [[800, 900], [1020, 900]], "いえ", n, pl);
  n["15"] = [1240, 880, "goal"]; pl["15"] = "いえ"; n["0"].push("start"); n["4"].push("block");
  linkLine(nx, ["0", "1", "2", "3", "4", "f1", "a1", "a2", "a3", "m1", "m2", "f2", "c1", "c2", "c3", "e1", "e2", "15"]); linkLine(nx, ["f1", "b1", "b2", "m1"]); linkLine(nx, ["f2", "d1", "e1"]);
  BOARD.gekou = { nodes: n, place: pl, next: nx, away: [700, 120], style: (a, b) => ["b1", "b2", "d1"].includes(a) || ["b1", "d1"].includes(b) ? "park" : (pl[a] === "こうさてん" && pl[b] === "こうさてん") ? "zebra" : "sidewalk",
    labels: [["こうもん", 300, 150], ["こうさてん", 1460, 760], ["びょういん", 900, 400], ["かえりみち", 260, 700], ["いえ", 1000, 990]] }; }
Object.assign(ROAD, {
  sidewalk(L, d, a, b, pass) { if (pass === "under") { pathEl(L, d, { stroke: INK, "stroke-width": 76 }); pathEl(L, d, { stroke: "#D9D4C8", "stroke-width": 64 }); } else pathEl(L, d, { stroke: "#FFFFFF", "stroke-width": 6 }); },
  zebra(L, d, a, b, pass) { if (pass === "under") { pathEl(L, d, { stroke: INK, "stroke-width": 80 }); pathEl(L, d, { stroke: "#7A7F88", "stroke-width": 68 }); } else pathEl(L, d, { stroke: "#FFFFFF", "stroke-width": 50, "stroke-dasharray": "14 14" }); },
  classwood(L, d, a, b, pass) { if (pass === "under") { pathEl(L, d, { stroke: INK, "stroke-width": 74 }); pathEl(L, d, { stroke: "#E3C59A", "stroke-width": 62 }); } else pathEl(L, d, { stroke: "#C9A27A", "stroke-width": 4, "stroke-dasharray": "30 12" }); },
  mat(L, d, a, b, pass) { if (pass === "under") { pathEl(L, d, { stroke: INK, "stroke-width": 74 }); pathEl(L, d, { stroke: "#FFB98A", "stroke-width": 62 }); } else pathEl(L, d, { stroke: "#FFFFFF", "stroke-width": 8, "stroke-dasharray": "2 18" }); },
});
Object.assign(BOARD_BG, {
  toukou(L) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#CFE8B8" }, L); el("rect", { x: 0, y: 0, width: 1600, height: 150, fill: "#CFEAFB" }, L); cloud(L, 300, 80); cloud(L, 1300, 70, .8);
    [[90, 820, "#FFF1D6", "#E8735A"], [880, 50, "#FFF4E0", "#E8735A"]].forEach(([x, y, w, r], i) => { el("rect", { x, y, width: i ? 220 : 150, height: i ? 120 : 120, fill: w, ...S6(5) }, L); el("path", { d: `M${x - 14} ${y} L${x + (i ? 110 : 75)} ${y - 60} L${x + (i ? 234 : 164)} ${y} Z`, fill: r, ...S6(5) }, L); });
    txt(L, 165, 920, "いえ", 30, { "text-anchor": "middle" }); txt(L, 990, 140, "がっこう", 30, { "text-anchor": "middle" }); el("ellipse", { cx: 1000, cy: 600, rx: 200, ry: 110, fill: "#9FD68A", ...S6(5) }, L); [[960, 560], [1060, 620]].forEach(([x, y]) => tree2(L, x, y, 36)); },
  gakkou3(L) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFF6E0" }, L); el("ellipse", { cx: 800, cy: 560, rx: 700, ry: 420, fill: "#F6E7C8", ...S6(6) }, L);
    el("circle", { cx: 800, cy: 560, r: 150, fill: "#FFFFFF", ...S6(6) }, L); for (let i = 0; i < 12; i++) { const an = i / 12 * Math.PI * 2; el("path", { d: `M${800 + Math.cos(an) * 130} ${560 + Math.sin(an) * 130} L${800 + Math.cos(an) * 145} ${560 + Math.sin(an) * 145}`, ...S6(5) }, L); }
    el("rect", { x: 60, y: 40, width: 360, height: 130, rx: 10, fill: "#2F6B4F", ...S6(6) }, L); txt(L, 240, 120, "がっこう3", 44, { "text-anchor": "middle", fill: "#FFFFFF" }); },
  kyuushoku(L) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFF6E0" }, L); el("rect", { x: 140, y: 160, width: 1380, height: 820, rx: 60, fill: "#F2C38F", ...S6(8) }, L);
    [[300, 260, "#FFFFFF"], [1460, 900, "#FFFFFF"]].forEach(([x, y, c]) => { el("ellipse", { cx: x, cy: y, rx: 90, ry: 50, fill: c, ...S6(5) }, L); }); el("rect", { x: 1440, y: 200, width: 80, height: 120, rx: 10, fill: "#FFFFFF", ...S6(5) }, L); el("rect", { x: 1440, y: 240, width: 80, height: 40, fill: "#7FCBF0" }, L);
    txt(L, 800, 110, "きょうの きゅうしょく", 44, { "text-anchor": "middle" }); },
  gekou(L) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#F6E2C8" }, L); el("rect", { x: 0, y: 0, width: 1600, height: 120, fill: "#FFD9B0" }, L); el("circle", { cx: 1480, cy: 70, r: 50, fill: "#FF9E5E", ...S6(5) }, L);
    el("rect", { x: 40, y: 140, width: 200, height: 160, fill: "#FFF4E0", ...S6(5) }, L); el("path", { d: "M26 140 L140 80 L254 140 Z", fill: "#E8735A", ...S6(5) }, L);
    el("rect", { x: 1300, y: 900, width: 200, height: 90, fill: "#FFF1D6", ...S6(5) }, L); el("rect", { x: 820, y: 330, width: 150, height: 120, fill: "#FFFFFF", ...S6(5) }, L); el("path", { d: "M895 355 V425 M860 390 H930", stroke: "#E8473C", "stroke-width": 14 }, L); },
});
BLOCK_DEF.toukou = { who: "kamejii", sleep: false, intro: ["p_blk_toukou", "みどりの おじさんが はたで とめて くれたよ。おれいを いおう！"], say: ["blk_toukou", "ありがとう ございます"], to: "みどりの おじさんに いおう",
  keys: [["ありがとう", "有難う", "有り難う"], ["ござい", "御座い"]], res: ["rs_toukou", "ほっほ。きを つけて いくんじゃよ"] };
BLOCK_DEF.gakkou3 = { who: "doshin", sleep: false, intro: ["p_blk_gakkou3", "どしんの おおきな ランドセルで とおれない！"], say: ["blk_gakkou3", "ちょっと どいて くれる？"], to: "どしんに いおう",
  keys: [["どいて", "退いて"], ["くれる"]], res: ["rs_gakkou3", "あっ、ごめんね。どうぞ"] };
BLOCK_DEF.kyuushoku = { who: "gao", sleep: false, intro: ["p_blk_kyuushoku", "がおが おおきな おなべを はこんで いるよ！"], say: ["blk_kyuushoku", "おさきに どうぞ"], to: "がおに いおう",
  keys: [["おさき", "お先"], ["どうぞ"]], res: ["rs_kyuushoku", "サンキュー！ たすかったぜ"] };
BLOCK_DEF.gekou = { who: "omawari", sleep: false, intro: ["p_blk_gekou", "おまわりさんが いるよ。あいさつ しよう！"], say: ["blk_gekou", "こんにちは"], to: "おまわりさんに いおう",
  keys: [["こんにちは", "今日は"]], res: ["rs_gekou", "こんにちは。きを つけて かえってね"] };
["toukou", "gakkou3", "kyuushoku", "gekou"].forEach(st => SLEEPER_OF[st] = BLOCK_DEF[st].who);
Object.assign(EVENTS, {
  toukou: { a2: ["fwd", 2, "ev_aoshingou", "あおしんごうが つづいた！ 2マス すすむよ"], m2: ["back", 2, "ev_wasure2", "わすれものに きづいた！ 2マス もどるよ"], d1: ["home", 0, "ev_randoseru", "ランドセルを わすれた！ スタートに もどるよ"] },
  gakkou3: { a2: ["fwd", 3, "ev_hanamaru", "はなまるを もらった！ 3マス すすむよ"], m2: ["back", 2, "ev_enpitsu", "えんぴつが おれちゃった！ 2マス もどるよ"], d1: ["home", 0, "ev_shukudai", "しゅくだいを わすれた！ スタートに もどるよ"] },
  kyuushoku: { a2: ["fwd", 3, "ev_curry", "だいすきな カレーだ！ 3マス すすむよ"], m2: ["back", 2, "ev_ohashi", "おはしを おとした！ 2マス もどるよ"], d1: ["home", 0, "ev_apron", "きゅうしょく エプロンを わすれた！ スタートに もどるよ"] },
  gekou: { a2: ["rest", 0, "ev_kyuukyuusha", "くるまに ぶつかった！ きゅうきゅうしゃで びょういんへ。つぎは 1かい やすみだよ"], m2: ["fwd", 2, "ev_midori", "みどりの しんごうで わたれた！ 2マス すすむよ"], d1: ["home", 0, "ev_wasure3", "わすれものを とりに がっこうへ！ スタートに もどるよ"] },
});
EV_STYLE.rest = ["#B9E3FF", () => "やすみ"];
/* 1かい やすみ（きゅうきゅうしゃ）：ひとりでも みんなでも */
{ const be = boardEvent; boardEvent = async function (pc) {
    const ev = (EVENTS[curStage] || {})[pc.node];
    if (isLong() || !ev || ev[0] !== "rest") return be(pc);
    await sleep(300); markAbove(pc, "ex"); siren(); showBanner("きゅうきゅうしゃ！", 1400); await speak(C.pony, ev[2], ev[3]);
    if (pc.player) pc.player.rest = 1; else pc.rest = 1; markAbove(pc, "z"); await sleep(300); }; }
{ const ct = childTurn; childTurn = async function (first) { if (P.shima.rest) { P.shima.rest = 0; setTurn("child"); markAbove(P.shima, "z"); await speak(C.pony, "ev_rest_now", "びょういんで ひとやすみ。つぎの ばんまで まってね"); return; } return ct(first); }; }
{ const gt = gaoTurn; gaoTurn = async function () { if (P.gao.rest) { P.gao.rest = 0; setTurn("gao"); markAbove(P.gao, "z"); await speak(C.pony, "ev_rest_now", "びょういんで ひとやすみ。つぎの ばんまで まってね"); return; } return gt(); }; }
{ const mt = multiTurn; multiTurn = async function (pl, first) { if (!isLong() && pl.rest) { pl.rest = 0; setTurn(pl.kind, pl.idx); markAbove(pl.pc, "z"); await speak(C.pony, "ev_rest_now", "びょういんで ひとやすみ。つぎの ばんまで まってね"); return; } return mt(pl, first); }; }
{ const as = applyStage; applyStage = function (id) { as(id); [P.shima, P.gao].forEach(p => p && (p.rest = 0)); }; }

/* ================= ステージ2〜5の 見直し（ピンチの ときの ことば） ================= */
["rptired", "rpsplash", "rplosthat", "rpalone", "rpnewgame", "rpneedtoilet", "rphighshelf", "rplostwallet", "rpmissedstop", "rplostticket"].forEach(k => ASK_ON_STAGE.add(k));
["rptired", "rplostmama", "rplostwallet", "rplostticket", "rpmissedstop", "rpneedtoilet"].forEach(k => SOFT_INTRO.add(k));
Object.assign(INTRO, {
  async rptired(h, a) { stay(h); hold(h, "run", 1.6); await sleep(1600); h.lean.t = 14; h.sadMouth = true; blush(h); for (let i = 0; i < 4; i++) later(i * 350, () => markAbove(h, "drop", { dx: i % 2 ? 60 : -60 })); await sleep(900); await walk(a, -150, 700); },
  async rpsplash(h, a) { enter(h); await sleep(1100); for (let i = 0; i < 30; i++) later(i * 40, () => { const t = world(a, 120, 260); mark("drop", t.x, t.y, { vx: -600 - rnd(300), vy: -200 + rnd(200), grav: 800, life: 1, s: .9 }); });
    noise(.8, 2000, .3); a.armR.t = -60; jump(a, .3); await sleep(700); surprise(h); h.armL.t = -150; h.armR.t = 150; h.sadMouth = true; drip(h, 6); await sleep(700); },
  async rpswingmine(h, a) { stay(h); place(h, 1105, 700, .62); sway(h, 3200, 14, 600); const s0 = h.dx.v; const t0 = performance.now(); addTick(() => { if (!window.__swingOn) return false; h.dx.v = h.dx.t = Math.sin((performance.now() - t0) / 600 * Math.PI) * 60; });
    window.__swingOn = true; h.happyOn = true; await sleep(900); place(a, 1460, 975, .42); a.dx.v = 400; a.dx.t = 0; hold(a, "run", .9); await sleep(1000); h.happyOn = false; },
  async rplosthat(h, a) { enter(h); await sleep(1100); playMove(h, "look"); markAbove(h, "q"); await sleep(1000); h.sadMouth = true; },
  async rpalone(h, a) { a.sadMouth = true; a.headY.t = 14; enter(h); await sleep(1300); playMove(h, "look"); await sleep(500); },
  async rpnewgame(h, a) { enter(h); await sleep(1100); wave(a); await sleep(500); },
  async rpneedtoilet(h, a) { hold(h, "run", 1); h.dx.t = 0; await sleep(1000); hold(h, "shiver", 2.5); for (let i = 0; i < 3; i++) later(i * 450, () => markAbove(h, "drop", { dx: i % 2 ? 60 : -60 })); await sleep(1200); playMove(a, "look"); },
  async rplostmama(h, a) { stay(h); playMove(h, "look"); h.sadMouth = true; await sleep(1200); tears(h, 2); await sleep(600); enter(a); await sleep(1000); },
  async rphighshelf(h, a) { enter(h); await sleep(1100); h.armR.t = -160; hold(h, "tiptoe", 2); for (let i = 0; i < 2; i++) later(i * 600, () => jump(h, .35)); await sleep(1500); h.armR.t = 0; markAbove(h, "drop"); await sleep(400); },
  async rplostwallet(h, a) { enter(h); await sleep(1100); hold(h, "shake", 1.6); playMove(h, "look"); await sleep(1500); h.sadMouth = true; markAbove(h, "drop"); await sleep(500); },
  async rpmissedstop(h, a) { stay(h); h.tm.closed = 1e6; markAbove(h, "z"); sway(h, 2600, 6, 300); await sleep(1800); ding(); delete h.tm.closed; surprise(h); playMove(h, "look"); markAbove(h, "ex"); await sleep(800); },
  async rplostticket(h, a) { enter(h); await sleep(1100); hold(h, "shake", 1.4); playMove(h, "look"); await sleep(1400); h.sadMouth = true; markAbove(h, "drop"); await sleep(400); },
});
Object.assign(POST, {
  async yasumu(h, a) { h.lean.t = 0; h.sadMouth = false; await walk(h, -400, 900); },
  async yamete(h, a) { h.armL.t = 0; h.armR.t = 0; h.sadMouth = false; a.armR.t = 0; playMove(a, "shy"); await sleep(600); },
  async atodene(h, a) { playMove(a, "nod"); await sleep(800); window.__swingOn = false; },
  async sagashite(h, a) { a.armR.t = -120; await sleep(400); const g = prop("hat", 0, 0, .35); onHead(h, g, .45); h.sadMouth = false; joy(h); await sleep(600); a.armR.t = 0; },
  async asobou(h, a) { a.sadMouth = false; a.headY.t = 0; joy(a); await sleep(600); },
  async toiredoko(h, a) { a.armR.t = -100; await sleep(400); await walk(h, -700, 800); a.armR.t = 0; },
  async hagure(h, a) { playMove(a, "nod"); h.sadMouth = false; await sleep(500); },
  async totte(h, a) { hand(h, prop("bread", 0, 0, .35), .35, 0); joy(h); await sleep(500); },
  async saifu(h, a) { hand(h, prop("purse", 0, 0, .3), .3, 0); h.sadMouth = false; joy(h); await sleep(500); },
  async norisugoshi(h, a) { playMove(a, "nod"); await sleep(500); },
  async kippunakushi(h, a) { h.sadMouth = false; playMove(h, "bow"); await sleep(500); },
});

/* ================= こうしゃの 見直し・がっこう3の 追加（2026-10-13。台本 sit/sits_fix2.py・sits_new.py） ================= */
["ksblame", "kspush", "ksblock", "ksknock", "ksfound", "kssneak", "gskenkou", "gsdone", "gslost"].forEach(k => ASK_ON_STAGE.add(k));
["kshit", "kschufall", "ksalone", "kswait", "kswet"].forEach(k => SOFT_INTRO.add(k));
const hide3 = c => { c.root.style.display = "none"; const i = visible.indexOf(c); if (i >= 0) visible.splice(i, 1); };
Object.assign(INTRO, {
  // ろうか：がおが 走ってきて せなかを たたいて にげる → ないていると めえばあ先生が くる
  async kshit(h, a) { enter(h); await sleep(1000); const g = C.tora; resetChar(g); place(g, 1300, 975, .9); show(g); g.dx.v = g.dx.t = 500; hold(g, "run", 1); g.dx.t = -360; await sleep(1000);
    g.armR.t = -150; await sleep(250); g.armR.t = 40; thud(); noise(.12, 900, .7); h.lean.t = -16; markAbove(h, "ex"); await sleep(300); h.lean.t = 0; g.armR.t = 0;
    playMove(g, "laugh"); await sleep(500); hold(g, "run", 1); g.dx.t = 700; await sleep(900); hide3(g);
    playMove(h, "sad"); h.sadMouth = true; tears(h, 6); await sleep(900); enter(a); await sleep(900); surprise(a); },
  // げんかん：ちゅうが 走って ころぶ → めえばあ先生が とおりかかる
  async kschufall(h, a) { const c = xtra("chu", 860); window.__kchu = c; c.dx.v = 500; c.dx.t = 0; hold(c, "run", 1); enter(h); await sleep(1000);
    thud(); flop(c); later(300, () => { c.squash.t = .8; c.sadMouth = true; tears(c, 8); hold(c, "shiver", 6); }); markAbove(c, "drop"); surprise(h); markAbove(h, "ex"); await sleep(1100); enter(a); await sleep(900); },
  // ろうか：みんなと はぐれて、ひとりで きょろきょろ
  async ksalone(h, a) { enter(h); await sleep(1000); playMove(h, "look"); await sleep(1000); markAbove(h, "q"); h.sadMouth = true; await sleep(700); enter(a); await sleep(900); },
  // げたばこ：がおが うわばきを さがして おこっている → こっちを ゆびさす
  async ksblame(h, a) { hold(a, "shake", 1.6); for (let i = 0; i < 3; i++) later(i * 450, () => noise(.08, 1200, .4)); enter(h); await sleep(1500);
    playMove(a, "point"); markAbove(a, "anger"); await sleep(400); surprise(h); markAbove(h, "ex"); await sleep(500); },
  // こうえんの ブランコ：まるシマが のっていると、とらおが うしろから つよく おす
  async kspush(h, a) { stay(h); place(h, 1105, 700, .62); place(a, 1330, 975, .9); a.dx.v = a.dx.t = 600; const t0 = performance.now(); let amp = 40; window.__swingOn = true; window.__swingAmp = () => amp;
    addTick(() => { if (!window.__swingOn) { h.dx.v = h.dx.t = 0; return false; } h.dx.v = h.dx.t = Math.sin((performance.now() - t0) / 700 * Math.PI) * amp; });
    h.happyOn = true; await sleep(900); hold(a, "run", 1); a.dx.t = 0; await sleep(1100); h.happyOn = false;
    for (let i = 0; i < 3; i++) { a.armL.t = -90; a.armR.t = 90; a.lean.t = -14; noise(.08, 700, .4); amp += 45; await sleep(350); a.armL.t = 0; a.armR.t = 0; a.lean.t = 0; await sleep(350); }
    h.sadMouth = true; h.eyeScale.t = 1.25; markAbove(h, "ex"); for (let i = 0; i < 3; i++) later(i * 300, () => markAbove(h, "drop", { dx: i % 2 ? 50 : -50 })); await sleep(700); },
  // としょしつ：よみきかせ。まえに 立っている どしんが 大きくて 絵が みえない
  async ksblock(h, a) { const st = el("g", {}, propG); el("path", { d: "M1420 760 L1470 520 L1520 760", fill: "none", ...S6p(8) }, st); const b = prop("ehon", 1470, 470, .9); window.__eh = b;
    place(a, 930, 975, 1.15); enter(h); await sleep(1000); hold(h, "tiptoe", 1.6); for (let i = 0; i < 2; i++) later(300 + i * 600, () => jump(h, .45)); await sleep(1500);
    markAbove(h, "q"); h.sadMouth = true; await sleep(500); playMove(a, "look"); await sleep(500); },
  // トイレ：こしかけの かべの むこうに まるシマ。ちゅうが トントン
  async ksknock(h, a) { stay(h); const w = el("g", {}, front()); window.__stall = w; [470, 966].forEach(x => el("rect", { x, y: 520, width: 24, height: 455, rx: 6, fill: "#5FA9D6", ...S6p(5) }, w)); el("rect", { x: 494, y: 790, width: 472, height: 185, rx: 8, fill: "#7FCBF0", ...S6p() }, w); el("circle", { cx: 930, cy: 880, r: 10, fill: INK }, w);
    el("rect", { x: 530, y: 815, width: 100, height: 50, rx: 10, fill: "#FFFFFF", ...S6p(4) }, w); txt(w, 580, 851, "WC", 30, { "text-anchor": "middle" });
    place(a, 1060, 975, .46); await sleep(600); hold(a, "shiver", 3); markAbove(a, "drop", { dx: 60 }); await sleep(600); knock(); markAbove(a, "note"); await sleep(700); surprise(h); markAbove(h, "ex"); await sleep(500); },
  // げんかん：ゆうがた。おむかえが こない
  async kswait(h, a) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FF9E5E", opacity: .16 }, propG); hand(h, prop("bag", 0, 0, .4), .4, 0); enter(h); await sleep(1100);
    playMove(h, "look"); await sleep(1100); markAbove(h, "q"); h.sadMouth = true; await sleep(800); enter(a); await sleep(900); },
  // しょくいんしつ：ひろった ハンカチを もって いく
  async ksfound(h, a) { const hk = prop("hankachi", 0, 0, .35); hand(h, hk, .35, 0); window.__hk2 = hk; knock(); await sleep(600); enter(h); await sleep(1100); playMove(a, "look"); await sleep(500); },
  // しょくいんしつ：つくえの おかしを がおが こっそり ねらう
  async kssneak(h, a) { prop("snack", 1180, 500, .6); playMove(a, "sneak"); enter(h); await sleep(1300); a.armR.t = -100; markAbove(a, "note"); await sleep(600); a.armR.t = 0; },
  // ほけんしつ：てを あらって いたら、みずが はねて びしょびしょ
  async kswet(h, a) { enter(h); await sleep(900); h.armL.t = -40; h.armR.t = 40; h.sadMouth = true; drip(h, 40); hold(h, "shiver", 2); await sleep(1600); enter(a); await sleep(900); surprise(a); },
  // ---- がっこう3 ----
  async gskenkou(h, a) { const ks = exKids([940]); desk3(h, ...ks); hand(a, prop("memo", 0, 0, .4), .4, 0); await sleep(500);
    if (ks[0]) { ks[0].armR.t = -150; markAbove(ks[0], "note"); await sleep(800); ks[0].armR.t = 0; } playMove(a, "look"); await sleep(500); },
  async gsdone(h, a) { const ks = exKids([940]); desk3(h, ...ks); onDesk(h, "memo", .4); ks.forEach(c => onDesk(c, "memo", .4)); await sleep(400);
    hold(h, "shake", 1.4); ks.forEach(c => hold(c, "shake", 2.5)); await sleep(1500); h.armR.t = -150; markAbove(h, "ex"); await sleep(500); playMove(a, "look"); await sleep(400); },
  async gslost(h, a) { const ks = exKids([880, 1030]); desk3(h, ...ks); [h, ...ks].forEach(c => onDesk(c, "kbook", .45)); await sleep(400);
    ks.forEach(c => hold(c, "shake", 3)); playMove(h, "look"); await sleep(1200); markAbove(h, "q"); await sleep(700); },
});
Object.assign(POST, {
  async tatakareta(h, a) { playMove(a, "nod"); h.sadMouth = false; await sleep(600); playMove(h, "nod"); await sleep(500); },
  async kegashita(h, a) { await walk(a, -260, 800); playMove(a, "crouch"); const c = window.__kchu; if (c) { c.sadMouth = false; } await sleep(700); },
  async mayotta(h, a) { a.armR.t = -150; await sleep(700); a.armR.t = 0; h.sadMouth = false; joy(h); await sleep(400); walk(a, 900, 1800); await walk(h, 1200, 1800); },
  async bokujanai(h, a) { playMove(a, "bow"); await sleep(700); { const e = el("g", {}, propG); el("rect", { x: -40, y: -24, width: 80, height: 48, rx: 8, fill: "#FFFFFF", ...S6p(5) }, e); el("rect", { x: -40, y: -24, width: 34, height: 48, rx: 6, fill: "#7FCBF0", ...S6p(5) }, e); hand(a, e, .6, 0); } jump(a, .4); markAbove(a, "ex"); await sleep(500); joy(h); await sleep(400); },
  async osanaide(h, a) { playMove(a, "bow"); const t0 = performance.now(), A0 = 175; window.__swingOn = false; await tween(1500, k => { h.dx.v = h.dx.t = Math.sin((performance.now() - t0) / 700 * Math.PI) * A0 * (1 - k); }); h.sadMouth = false; h.eyeScale.t = 1; h.happyOn = true; await sleep(500); },
  async mienai(h, a) { playMove(a, "shy"); await walk(a, 380, 900); h.sadMouth = false; h.happyOn = true; await sleep(600); },
  async haittemasu(h, a) { jump(a, .5); await sleep(700); noise(1.0, 700, .5); await sleep(900); await walk(h, -650, 900); hold(a, "run", .6); await walk(a, -420, 600); },
  async mukae(h, a) { playMove(a, "nod"); h.sadMouth = false; await sleep(600); walk(a, 800, 1600); await walk(h, 1100, 1800); },
  async hirotta(h, a) { await walk(h, 250, 800); const hk = window.__hk2; if (hk) hk.remove(); hand(a, prop("hankachi", 0, 0, .35), .35, 0); playMove(a, "nod"); joy(h); await sleep(600); },
  async damedayo(h, a) { playMove(a, "frustrated"); await sleep(800); const k = xtra("kamejii", 1500, .86); k.dx.v = 300; k.dx.t = 0; hold(k, "run", .8); await sleep(900); surprise(a); jump(a, .6); await sleep(500); playMove(k, "nod"); await sleep(600); },
  async nureta(h, a) { hand(a, prop("towel", 0, 0, .3), .3, 0); await walk(a, -250, 700); h.armL.t = 0; h.armR.t = 0; h.sadMouth = false; hand(h, prop("towel", 0, 0, .3), .3, 0); joy(h); await sleep(500); },
  async gskenkou(h, a) { playMove(a, "nod"); h.happyOn = true; await sleep(600); },
  async gsdekimashita(h, a) { h.armR.t = 0; await walk(a, -260, 800); for (let i = 0; i < 4; i++) later(i * 200, () => markAbove(h, "sparkle", { dx: (i - 1.5) * 40 })); h.happyOn = true; await sleep(900); },
  async gsnanisuru(h, a) { a.armR.t = -120; await sleep(800); a.armR.t = 0; hold(h, "shake", 1.6); await sleep(1400); },
});

/* ---------- かさを あたまの 上に さす（2026-10-16。手に もつ だけだと 小さくて からだが 入って いなかった） ----------
   u.share に もう ひとりを 入れると、ふたりの まんなかで 大きく なる（あいあいがさ）。 */
function umbOver(c) {
  const g = el("g", {}); drawItem(g, "umbrella"); front().appendChild(g); g.share = null; let k0 = null, x0 = null;
  addTick(() => { if (!g.isConnected) return false;
    const p = headTop(c), w1 = 200 * c.s * 1.45; let cx = p.x, top = p.y, w = w1;
    if (g.share) { const q = headTop(g.share); cx = (p.x + q.x) / 2; top = Math.min(p.y, q.y); w = Math.min(Math.abs(p.x - q.x) + 200 * Math.max(c.s, g.share.s) * 1.15, w1 * 2.1); }
    const k = w / 220, ky = w1 / 220; k0 = k0 == null ? k : k0 + (k - k0) * .12; x0 = x0 == null ? cx : x0 + (cx - x0) * .12;
    g.setAttribute("transform", `translate(${x0.toFixed(1)} ${(top - 18).toFixed(1)}) scale(${k0.toFixed(3)} ${ky.toFixed(3)})`); });
  c.armR.t = -150; return g; }
