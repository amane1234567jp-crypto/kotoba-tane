/* ================= ショートコース 7つ（2026-10-19） =================
   台本は sit/sits_new7.py。
   yuushoku＝かぞくの ゆうごはん（まるシマの ママ・パパ・おにいちゃん。がおの ときは がおの かぞく）。「つづけて おはなし」マス（💬）で ママが 5つ つづけて きく。
   kokugo・taiiku・ongaku・zukou＝じゅぎょう。こまった ときに たすけを もとめる ことば（わかりません／もう いちど いって ください／まって ください）。
   jitensha＝ほじょりんつきの じてんしゃで かぞく サイクリング。「ルールクイズ」マス（🚦）。
   yasumi＝やすみじかん。ほんを よむ 子が ともだちと はなす。 */
const S8L = ["yuushoku", "kokugo", "taiiku", "ongaku", "zukou", "jitensha", "yasumi"];
Object.assign(RIVAL_OF, { yuushoku: "gao", kokugo: "kon", taiiku: "pyon", ongaku: "mii", zukou: "chu", jitensha: "doshin", yasumi: "kon" });
Object.assign(KID_S, { papa: 1.04, gaopapa: 1.04, gaonii: .98 });

/* ---------- 物の 絵 ---------- */
Object.assign(ITEM2, {
  plate(g) { el("ellipse", { rx: 110, ry: 34, fill: "#FFFFFF", ...S6p(5) }, g); el("ellipse", { rx: 70, ry: 18, fill: "none", stroke: "#DCE6EE", "stroke-width": 5 }, g); },
  hamburg(g) { ITEM2.plate(g); el("ellipse", { cy: -16, rx: 58, ry: 26, fill: "#8B5A3C", ...S6p(5) }, g); el("path", { d: "M-40 -30 Q0 -44 40 -30", fill: "none", stroke: "#C0392B", "stroke-width": 9, "stroke-linecap": "round" }, g); },
  shouyu(g) { el("path", { d: "M-24 -40 H24 L30 50 H-30 Z", fill: "#5A2E1E", ...S6p(5) }, g); el("rect", { x: -16, y: -70, width: 32, height: 32, rx: 6, fill: "#E8473C", ...S6p(4) }, g); el("rect", { x: -20, y: -6, width: 40, height: 26, fill: "#FFFFFF" }, g); },
  misobowl(g) { el("path", { d: "M-60 -20 H60 Q56 40 0 44 Q-56 40 -60 -20 Z", fill: "#B5462F", ...S6p(5) }, g); el("ellipse", { cy: -20, rx: 60, ry: 14, fill: "#E3A95A", ...S6p(4) }, g); },
  notebook(g) { el("rect", { x: -70, y: -50, width: 140, height: 100, rx: 6, fill: "#FFFFFF", ...S6p(5) }, g); for (let y = -26; y < 50; y += 22) el("path", { d: `M-56 ${y} H56`, stroke: "#9DB2E8", "stroke-width": 4 }, g); el("rect", { x: -70, y: -50, width: 140, height: 18, fill: "#7BD389" }, g); },
  pencilbroken(g) { el("rect", { x: -80, y: -10, width: 70, height: 20, fill: "#FFD25E", ...S6p(4) }, g); el("rect", { x: 10, y: -10, width: 60, height: 20, fill: "#FFD25E", ...S6p(4), transform: "rotate(25 10 0)" }, g); },
  scissors(g) { el("circle", { cx: -50, cy: 24, r: 20, fill: "none", stroke: "#E8473C", "stroke-width": 10 }, g); el("circle", { cx: -50, cy: -24, r: 20, fill: "none", stroke: "#E8473C", "stroke-width": 10 }, g); el("path", { d: "M-32 16 L70 -10 M-32 -16 L70 10", stroke: "#AEB5BF", "stroke-width": 12, "stroke-linecap": "round" }, g); },
  glue(g) { el("rect", { x: -30, y: -50, width: 60, height: 90, rx: 10, fill: "#FFFFFF", ...S6p(5) }, g); el("rect", { x: -20, y: -76, width: 40, height: 28, rx: 6, fill: "#7FCBF0", ...S6p(4) }, g); txt(g, 0, 8, "のり", 22, { "text-anchor": "middle" }); },
  kenban(g) { el("rect", { x: -120, y: -30, width: 240, height: 60, rx: 14, fill: "#E8473C", ...S6p(5) }, g); el("rect", { x: -104, y: -18, width: 208, height: 36, fill: "#FFFFFF", ...S6p(3) }, g); for (let x = -86; x < 104; x += 26) el("rect", { x, y: -18, width: 12, height: 20, fill: INK }, g); },
  paper(g) { el("rect", { x: -90, y: -70, width: 180, height: 140, fill: "#FFFFFF", ...S6p(5) }, g); },
  famdraw(g) { ITEM2.paper(g); [[-50, "#4A4754"], [0, "#FF9FB8"], [44, "#7BC4A0"]].forEach(([x, c]) => { el("circle", { cx: x, cy: -10, r: 18, fill: c, ...S6p(3) }, g); el("rect", { x: x - 14, y: 10, width: 28, height: 36, rx: 8, fill: c, ...S6p(3) }, g); }); },
  elephant(g) { ITEM2.paper(g); el("ellipse", { cx: 0, cy: 10, rx: 50, ry: 36, fill: "#A9BEDD", ...S6p(4) }, g); el("path", { d: "M-44 0 Q-80 20 -70 50", fill: "none", stroke: "#A9BEDD", "stroke-width": 14 }, g); el("circle", { cx: -24, cy: -6, r: 5, fill: INK }, g); },
  helmet(g) { el("path", { d: "M-70 20 Q-70 -60 0 -62 Q70 -60 70 20 Z", fill: "#FFD25E", ...S6p(5) }, g); el("path", { d: "M-40 -40 V10 M0 -56 V10 M40 -40 V10", stroke: "#FFFFFF", "stroke-width": 8 }, g); },
  tobibako(g) { [0, 1, 2].forEach(i => el("rect", { x: -120 + i * 10, y: -60 - i * 50, width: 240 - i * 20, height: 50, rx: 6, fill: "#E9C893", ...S6p(5) }, g)); el("rect", { x: -100, y: -200, width: 200, height: 40, rx: 14, fill: "#FFFFFF", ...S6p(5) }, g); },
  books(g) { [["#FF8FA3", -40], ["#7FCBF0", -10], ["#FFD25E", 20]].forEach(([c, x]) => el("rect", { x, y: -70, width: 28, height: 100, rx: 4, fill: c, ...S6p(4) }, g)); },
  dinobook(g) { ITEM2.ehon(g); txt(g, 0, 20, "🦖", 70, { "text-anchor": "middle" }); },
});
// ほじょりんつきの じてんしゃ（キャラの あしもとに ついて いく）
function bikeG(par) { const g = el("g", {}, par), W = { fill: "#FFFFFF", stroke: INK, "stroke-width": 8 };
  [-120, 120].forEach(x => { el("circle", { cx: x, cy: 0, r: 62, fill: "none", stroke: INK, "stroke-width": 14 }, g); el("circle", { cx: x, cy: 0, r: 10, fill: INK }, g); });
  el("circle", { cx: -150, cy: 34, r: 22, ...W }, g); el("path", { d: "M-120 0 L-40 -80 L80 -80 L120 0 M-40 -80 L0 0 L80 -80 M80 -80 L100 -150 M80 -150 H130", fill: "none", stroke: "#E8473C", "stroke-width": 14, "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
  el("rect", { x: -70, y: -104, width: 64, height: 18, rx: 8, fill: INK }, g); return g; }
function rideBike(c) { const g = bikeG(front()); follow(g, () => { const p = world(c, 200, c.base - 60); return [p.x, p.y, 0, c.s * .78]; }); return g; }

/* ---------- へや ---------- */
// がっこう2の へや（ROOMS2）を、かべと ゆかつきで かく
function room2(L, place) { const wall = { きょうしつ: "#FFF6E0", おんがくしつ: "#F3ECFF", ずこうしつ: "#FFF0E3", たいいくかん: "#F4EAD8" }[place] || "#FFF6E0";
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: wall }, L); el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: place === "たいいくかん" ? "#E9C893" : "#E3C59A" }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L);
  for (let x = 0; x < 1600; x += 160) el("path", { d: `M${x} 760 L${x - 80} 1000`, stroke: "#00000010", "stroke-width": 4 }, L); ROOMS2[place](L); }
function tree8(L, x, y, s = 1) { el("rect", { x: x - 16 * s, y: y - 120 * s, width: 32 * s, height: 120 * s, fill: "#A0693F", ...S6(5) }, L); [[0, -170, 80], [-60, -130, 60], [60, -130, 60]].forEach(([dx, dy, r]) => el("circle", { cx: x + dx * s, cy: y + dy * s, r: r * s, fill: "#7BD389", ...S6(5) }, L)); }
const ROOMS8 = {
  こうてい(L) { outBase(L, "#CFEAFB", "#E3B48F"); el("rect", { x: 260, y: 220, width: 1080, height: 420, fill: "#FFF4E0", ...S6(8) }, L); for (let i = 0; i < 6; i++) el("rect", { x: 320 + i * 170, y: 300, width: 120, height: 90, rx: 6, fill: "#CFEAFB", ...S6(4) }, L);
    el("circle", { cx: 800, cy: 190, r: 34, fill: "#FFFFFF", ...S6(5) }, L); el("path", { d: "M800 168 V190 L816 200", ...S6(4), fill: "none" }, L); el("rect", { x: 0, y: 640, width: 1600, height: 120, fill: "#B9DE9F" }, L);
    el("ellipse", { cx: 800, cy: 880, rx: 640, ry: 90, fill: "none", stroke: "#FFFFFF", "stroke-width": 8, "stroke-dasharray": "40 26" }, L); tree8(L, 120, 700, .9); tree8(L, 1480, 700, .9); },
  ほどう(L) { outBase(L); [[40, "#FFE3B3", "パン"], [460, "#E3F0FF", "ほん"], [880, "#FFE0E6", "はな"]].forEach(([x, c, t]) => { el("rect", { x, y: 300, width: 380, height: 340, fill: c, ...S6(6) }, L); el("rect", { x: x + 20, y: 320, width: 340, height: 70, rx: 10, fill: "#FFFFFF", ...S6(4) }, L); txt(L, x + 190, 370, t + "や", 40, { "text-anchor": "middle" }); el("rect", { x: x + 40, y: 420, width: 140, height: 220, rx: 8, fill: "#CFEAFB", ...S6(4) }, L); });
    el("rect", { x: 0, y: 640, width: 1600, height: 120, fill: "#D9CDB8" }, L); for (let x = 0; x < 1600; x += 80) el("path", { d: `M${x} 640 V760`, stroke: "#00000014", "stroke-width": 4 }, L); el("path", { d: "M0 640 H1600", ...S6(5) }, L);
    el("rect", { x: 1340, y: 380, width: 200, height: 200, rx: 100, fill: "#3E7FD6", ...S6(6) }, L); txt(L, 1440, 470, "🚶", 70, { "text-anchor": "middle" }); txt(L, 1440, 545, "🚲", 50, { "text-anchor": "middle" }); el("path", { d: "M1440 580 V760", ...S6(8) }, L); },
  サイクリングロード(L) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#CFEAFB" }, L); el("circle", { cx: 1460, cy: 110, r: 56, fill: "#FFE27A", ...S6(5) }, L);
    el("path", { d: "M0 470 Q400 400 800 450 T1600 430 V560 H0 Z", fill: "#9FD3A0", ...S6(5) }, L); el("path", { d: "M0 560 H1600 V640 H0 Z", fill: "#7FCBF0", ...S6(5) }, L); for (let x = 40; x < 1600; x += 220) el("path", { d: `M${x} 600 q30 -14 60 0`, fill: "none", stroke: "#FFFFFF", "stroke-width": 6 }, L);
    el("rect", { x: 0, y: 640, width: 1600, height: 360, fill: "#B9DE9F" }, L); el("rect", { x: 0, y: 720, width: 1600, height: 120, fill: "#E6A86A", ...S6(5) }, L); el("path", { d: "M0 780 H1600", stroke: "#FFFFFF", "stroke-width": 6, "stroke-dasharray": "40 30" }, L);
    [200, 700, 1250].forEach(x => tree8(L, x, 700, .8)); el("rect", { x: 980, y: 660, width: 180, height: 26, rx: 8, fill: "#C98A4B", ...S6(5) }, L); el("path", { d: "M1000 686 V716 M1140 686 V716", ...S6(6) }, L); },
};
// こうえん・おまつり（2026-10-19：ショートコース・ロングコースで つかう）
ROOMS8.こうえん = L => { outBase(L, "#CFEAFB", "#E3CFA5"); el("rect", { x: 0, y: 600, width: 1600, height: 160, fill: "#B9DE9F" }, L); el("path", { d: "M0 600 H1600", ...S6(4) }, L);
  tree8(L, 140, 640, 1); tree8(L, 1460, 640, 1); // すべりだい
  el("path", { d: "M1050 760 V430 M1150 760 V430", ...S6(10), fill: "none" }, L); el("rect", { x: 1030, y: 410, width: 140, height: 30, rx: 8, fill: "#FF8FA3", ...S6(5) }, L);
  el("path", { d: "M1170 430 Q1300 520 1340 760", stroke: "#FFD25E", "stroke-width": 34, fill: "none" }, L); el("path", { d: "M1170 430 Q1300 520 1340 760", ...S6(4), fill: "none" }, L);
  for (let i = 0; i < 5; i++) el("path", { d: `M${1060} ${470 + i * 60} H1140`, ...S6(6) }, L);
  el("rect", { x: 330, y: 650, width: 260, height: 28, rx: 10, fill: "#C98A4B", ...S6(5) }, L); el("path", { d: "M350 678 V720 M570 678 V720", ...S6(7) }, L); // ベンチ
  for (let x = 0; x < 1600; x += 60) el("path", { d: `M${x} 600 V560`, stroke: "#FFFFFF", "stroke-width": 8 }, L); el("path", { d: "M0 572 H1600", stroke: "#FFFFFF", "stroke-width": 6 }, L); };
ROOMS8.おまつり = L => { outBase(L, "#FFD7B0", "#E9C893");
  el("path", { d: "M0 140 Q400 210 800 140 T1600 140", fill: "none", ...S6(4) }, L); for (let i = 0; i < 9; i++) { const x = 90 + i * 180, y = 158 + Math.sin(i * .9) * 26;
    el("ellipse", { cx: x, cy: y + 40, rx: 34, ry: 44, fill: i % 2 ? "#FFFFFF" : "#F25C54", ...S6(4) }, L); el("rect", { x: x - 18, y: y - 8, width: 36, height: 12, fill: INK }, L); }
  [[120, "#F25C54", "きんぎょ"], [620, "#3E7FD6", "わなげ"], [1120, "#2FA36B", "わたあめ"]].forEach(([x, c, t]) => { el("rect", { x, y: 360, width: 380, height: 300, fill: "#FFF4E0", ...S6(6) }, L);
    for (let k = 0; k < 6; k++) el("rect", { x: x + k * 63.3, y: 330, width: 63.3, height: 60, fill: k % 2 ? "#FFFFFF" : c }, L); el("rect", { x, y: 330, width: 380, height: 60, fill: "none", ...S6(5) }, L);
    el("rect", { x: x + 60, y: 410, width: 260, height: 70, rx: 12, fill: "#FFFFFF", ...S6(4) }, L); txt(L, x + 190, 462, t, 40, { "text-anchor": "middle" }); el("rect", { x: x - 10, y: 600, width: 400, height: 60, fill: "#C98A4B", ...S6(5) }, L); }); };
// へやの えらびかた：じぶんの へや → がっこう2・とうこう・おうち の へやを つかう
const R8_ALIAS = { kokugo: { きょうしつ: ["3", "こくご"] }, yasumi: { きょうしつ: ["3", "やすみじかん"] }, jitensha: { みち: ["3", "つうがくろ"] }, odekake: { みち: ["3", "つうがくろ"] } };
function room8(place) {
  const al = (R8_ALIAS[curStage] || {})[place]; if (al) return ROOMS3[al[1]];
  if (ROOMS8[place]) return ROOMS8[place];
  if (typeof ROOMS2 !== "undefined" && ROOMS2[place] && place !== "いえ") return L => room2(L, place);
  return (typeof ROOMS4 !== "undefined" && ROOMS4[place]) || (typeof ROOMS5 !== "undefined" && ROOMS5[place]) || (typeof ROOMS3 !== "undefined" && ROOMS3[place]) || (typeof ROOMS6 !== "undefined" && ROOMS6[place]) || (typeof ROOMS7 !== "undefined" && ROOMS7[place]) || null; }
{ const dr = drawRoom; drawRoom = function (place, noSign = false) {
    const R = (S8L.includes(curStage) || curStage === "odekake" || curStage === "komatta" || curStage === "kimochi" || S10L.includes(curStage) || (typeof S11L !== "undefined" && S11L.includes(curStage)) || curStage === "makete" || curStage === "dekigoto") && room8(place); /* おでかけ だいぼうけんの 場面（じてんしゃ・とうこう・げこう）も */ if (!R) return dr(place, noSign);
    sceneLayer.innerHTML = ""; R(sceneLayer);
    if (!noSign) { const g = el("g", {}, sceneLayer); el("rect", { x: 620, y: 24, width: 360, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, place.length > 6 ? 38 : 46, { "text-anchor": "middle" }); }
  }; }

/* ---------- できごとの アニメ ---------- */
const ON8 = SITS.filter(s => S8L.includes(s.stage)).map(s => s.id);
[...ON8, "ysohanashi", "jtrulequiz"].forEach(k => ASK_ON_STAGE.add(k));
["yskoboshi", "kgtsukareta", "tishindoi", "tikoronda", "tikowai", "ogoto", "jtkoronda", "zkenogu", "jtmatte"].forEach(k => SOFT_INTRO.add(k));
const on8 = (x, y, kind, k = .5) => prop(kind, x, y, k);
// みぎがわの キャラ（あいて）の ヒントは、あたまの ひだりに だす（はみださない ように）
function hint8(c, emo, label) { if (c.x < 900) return hint7(c, emo, label); const p = headTop(c), w = Math.max(150, label.length * 34 + 110), xr = Math.max(w + 40, p.x - 150 * Math.max(.6, c.s)), y = Math.max(150, p.y + 30), g = el("g", {}, front());
  el("rect", { x: xr - w, y: y - 56, width: w, height: 96, rx: 30, fill: "#FFFFFF", ...S6(6) }, g); el("path", { d: `M${xr - 10} ${y + 20} L${xr + 30} ${y + 50} L${xr - 34} ${y + 34}`, fill: "#FFFFFF", ...S6(5) }, g);
  txt(g, xr - w + 50, y + 12, emo, 54, { "text-anchor": "middle" }); txt(g, xr - w + 90, y + 8, label, 34); g.setAttribute("opacity", 0); tween(250, k => g.setAttribute("opacity", k.toFixed(2))); return g; }
const desk8 = h => { enter(h); return sleep(900).then(() => sit3(h)); };
// こどもと あいての あいだに ひくい テーブル（まえの そうに かく）。たべものは T8(x) で その うえに
const TB8 = { x: 900, y: 830 };
const tableAt = () => { const g = el("g", {}, front()), { x, y } = TB8; el("path", { d: `M${x - 120} ${y + 20} V975 M${x + 120} ${y + 20} V975`, ...S6(9) }, g); el("rect", { x: x - 150, y, width: 300, height: 26, rx: 8, fill: "#C98A4B", ...S6(5) }, g); return g; };
const T8 = (kind, dx = 0, k = .45) => { const g = el("g", { transform: `translate(${TB8.x + dx} ${TB8.y - 6}) scale(${k})` }, front()); drawItem(g, kind); return g; };
const offR = (a, d = 900) => { a.dx.v = a.dx.t = d; };
const talkFast = a => { for (let i = 0; i < 6; i++) later(i * 180, () => { a.mouthOpen.t = i % 2 ? 0 : .6; markAbove(a, "note", { dx: (i % 3 - 1) * 60, vy: -160 }); }); later(1200, () => a.mouthOpen.t = 0); };
const book8 = (h, kind = "kbook") => { window.__bk = hp7(h, kind, .4); return window.__bk; };
const rm8 = (...ks) => ks.forEach(k => { if (window[k]) { window[k].remove(); window[k] = null; } });
Object.assign(INTRO, {
  // ---- ゆうごはん ----
  async ysdekita(h, a) { place(h, 520, 975, .88); stay(h); on8(380, 960, "blocks", .55); offR(a, 700); playMove(h, "crouch"); await sleep(600); a.dx.t = 300; hold(a, "run", .5); await sleep(500); markAbove(h, "ex"); playMove(h, "look"); await sleep(600); },
  async ysitadaki(h, a) { tableAt(); T8("hamburg", -40, .5); T8("rice", 90, .3); // みんな そろった：ママと きょうだいも テーブルに（2026-10-20）
    const mom = h.kind === "shima" ? "mama" : MOM_OF[h.kind], sib = { shima: "onii", gao: "gaonii" }[h.kind];
    const fam = [mom && xtra(mom, 1470, .8), sib && xtra(sib, 330, .78)].filter(Boolean); fam.forEach(c => { stay(c); later(300, () => playMove(c, "wave")); });
    await comeSit(h, 1000); markAbove(h, "sparkle"); await sleep(400); },
  async ysshouyu(h, a) { tableAt(); T8("hamburg", -60, .45); T8("shouyu", 110, .5); await comeSit(h, 900); h.armR.t = -70; h.lean.t = 12; hint7(h, "🙌", "とどかない"); await sleep(1200); h.lean.t = 0; h.armR.t = 0; },
  async yspiman(h, a) { tableAt(); T8("plate", 0, .5); window.__pm = T8("piman", 0, .4); await comeSit(h, 900); playMove(h, "no"); hint7(h, "🫑", "にがい"); await sleep(1200); },
  async ysokawari(h, a) { tableAt(); await comeSit(h, 900); window.__rc = hp7(h, "rice", .32); await sleep(400); h.armR.t = -60; hint7(h, "🍚", "からっぽ"); await sleep(1000); },
  async yskoboshi(h, a) { tableAt(); await comeSit(h, 900); const b = hp7(h, "misobowl", .32); await sleep(500); b.remove(); noise(.2, 600, .5); window.__sp = T8("soup", -20, .6); surprise(h); markAbove(h, "drop"); await sleep(1000); h.sadMouth = true; },
  async ysterebi(h, a) { tableAt(); T8("hamburg", 0, .45); { const tv = el("g", {}, propG); el("rect", { x: 1300, y: 380, width: 250, height: 160, rx: 14, fill: "#3A3F4A", stroke: INK, "stroke-width": 6 }, tv); el("rect", { x: 1316, y: 396, width: 218, height: 128, rx: 6, fill: "#8FD3FF" }, tv); txt(tv, 1425, 475, "🐻", 60, { "text-anchor": "middle" }); } await comeSit(h, 900); h.headRot.t = -14; hint7(h, "📺", "テレビ"); for (let i = 0; i < 3; i++) later(i * 400, () => markAbove(h, "note", { dx: -120 })); await sleep(1400); h.headRot.t = 0; },
  async ystoranaide(h, a) { tableAt(); window.__ka = T8("karaage", 0, .55); await comeSit(h, 900); offR(a, 700); a.dx.t = 0; hold(a, "run", .7); await sleep(800); if (window.__ka) { const k = window.__ka; tween(400, t => k.setAttribute("transform", `translate(${TB8.x + 240 * t} ${TB8.y - 6 - 160 * t}) scale(.55)`)); } await sleep(500); surprise(h); markAbove(h, "anger"); await sleep(500); },
  async ysippai(h, a) { tableAt(); T8("plate", 0, .5); T8("karaage", 0, .3); await comeSit(h, 900); h.armL.t = 50; h.armR.t = -50; h.squash.vel += 1.5; hint7(h, "😋", "いっぱい"); await sleep(1200); h.armL.t = h.armR.t = 0; },
  async ysgochi(h, a) { tableAt(); T8("plate", -40, .5); T8("rice", 90, .25); await comeSit(h, 900); h.happyOn = true; markAbove(h, "heart"); await sleep(900); h.happyOn = false; },
  async yskatazuke(h, a) { window.__pl = hp7(h, "plate", .3); await comeSit(h, 1100); },
  async ystetsudai(h, a) { place(a, 1200, 975, 1.0); stay(a); pace(a, 1600, 120, 500); await comeSit(h, 900); window.__cs = on8(800, 760, "chopsticks", .5); markAbove(a, "drop"); await sleep(800); },
  // ---- こくご ----
  async kgyomu(h, a) { await desk8(h); book8(h); await sleep(300); playMove(h, "look"); hint7(h, "📖", "どこ？"); await sleep(1100); },
  async kgkanji(h, a) { await desk8(h); book8(h); await sleep(300); playMove(h, "think"); hint7(h, "❓", "山"); await sleep(1200); },
  async kghayai(h, a) { await desk8(h); talkFast(a); await sleep(700); hold(h, "shiver", .8); markAbove(h, "q"); await sleep(700); },
  async kgiken(h, a) { await desk8(h); book8(h); await sleep(300); playMove(h, "think"); hint7(h, "🐻", "どんな きもち？"); await sleep(1100); },
  async kgwaraware(h, a) { place(h, 520, 975, .88); stay(h); sit3(h); book8(h); a.dx.v = a.dx.t = 0; await sleep(500); playMove(a, "laugh"); for (let i = 0; i < 3; i++) later(i * 300, () => markAbove(a, "note", { dx: 60 })); await sleep(900); h.sadMouth = true; markAbove(h, "drop"); await sleep(400); },
  async kgnote(h, a) { await desk8(h); window.__nb = on8(world(h, 200, 0).x, h.__desk ? +h.__desk.firstChild.getAttribute("y") - 10 : 820, "notebook", .5); h.armR.t = -30; for (let i = 0; i < 4; i++) later(i * 220, () => blip(1800, 1600, .03, "square")); await sleep(500); talkFast(a); hint7(h, "✏", "まだ かいてる"); await sleep(900); h.armR.t = 0; },
  async kgenpitsu(h, a) { await desk8(h); const p = hp7(h, "pencil", .35); await sleep(500); noise(.08, 1500, .5); p.remove(); window.__pb = hp7(h, "pencilbroken", .35); surprise(h); await sleep(700); playMove(h, "sad"); await sleep(500); },
  async kghappyou(h, a) { await comeSit(h, 1000); h.armR.t = -150; await sleep(500); h.armR.t = 0; },
  async kgtsukareta(h, a) { await desk8(h); playMove(h, "sleepy"); await sleep(1300); h.lean.t = 24; h.tm.closed = 1e6; h.sadMouth = true; later(6000, () => { delete h.tm.closed; h.lean.t = 0; }); },
  async kgkeshigomu(h, a) { await desk8(h); const e = on8(world(h, 200, 0).x, 820, "eraser", .3); await sleep(300); tween(700, t => e.setAttribute("transform", `translate(${world(h, 200, 0).x + 200 * t} ${820 + 140 * t}) rotate(${t * 360}) scale(.3)`)); noise(.06, 900, .3); await sleep(700); playMove(h, "look"); h.lean.t = 14; await sleep(600); h.lean.t = 0; },
  async kgwakaranai(h, a) { await desk8(h); window.__pr = on8(world(h, 200, 0).x, 820, "prints", .4); await sleep(300); playMove(h, "think"); markAbove(h, "q"); hint7(h, "3", "❓"); await sleep(1100); },
  async kgowari(h, a) { await desk8(h); ring3(); await sleep(900); },
  // ---- たいいく ----
  async tishindoi(h, a) { enter(h); await sleep(900); h.sadMouth = true; for (let i = 0; i < 4; i++) later(i * 300, () => { h.squash.vel += 1.2; markAbove(h, "puff", { dx: 80 }); }); hint7(h, "💦", "はあ はあ"); await sleep(1300); },
  async tinarabu(h, a) { const ks = exKids([840, 980]); ks.forEach(c => stay(c)); enter(h); await sleep(900); playMove(h, "look"); markAbove(h, "q"); hint7(h, "❓", "どこ？"); await sleep(1000); },
  async tinawatobi(h, a) { enter(h); window.__rp = hp7(h, "rope", .4); await sleep(900); jump(h, .6); await sleep(500); noise(.08, 400, .4); playMove(h, "flop"); h.sadMouth = true; markAbove(h, "drop"); await sleep(800); },
  async tiataru(h, a) { const b = on8(1100, 700, "ball", .45); enter(h); await sleep(900); playMove(a, "point"); tween(400, t => b.setAttribute("transform", `translate(${1100 - 400 * t} ${700 - 100 * Math.sin(t * Math.PI)}) scale(.45)`)); await sleep(400); boom(.2); h.squash.vel += 2; surprise(h); await sleep(600); b.remove(); },
  async tikuyashii(h, a) { enter(h); await sleep(800); joy(a); confetti(20); await sleep(500); playMove(h, "frustrated"); await sleep(800); },
  async tiouen(h, a) { const ks = exKids([1000]); const c = ks[0]; enter(h); if (c) { c.dx.v = c.dx.t = 400; c.dx.t = -200; hold(c, "run", 1.5); } await sleep(1300); },
  async tisuitou(h, a) { enter(h); await sleep(900); playMove(h, "look"); hint7(h, "🧴", "ない"); await sleep(1100); },
  async tikigae(h, a) { enter(h); await sleep(800); h.armL.t = 40; h.armR.t = -40; hold(h, "shiver", 1); hint7(h, "👕", "ボタン"); await sleep(1200); h.armL.t = h.armR.t = 0; },
  async tikoronda(h, a) { offR(a, 600); h.dx.v = h.dx.t = -700; hold(h, "run", 1); h.dx.t = 0; await sleep(800); playMove(h, "flop"); noise(.12, 300, .5); await sleep(500); h.sadMouth = true; markAbove(h, "drop"); a.dx.t = 0; hold(a, "run", .6); await sleep(700); },
  async tikowai(h, a) { on8(900, 975, "tobibako", .9); enter(h); await sleep(900); hold(h, "shiver", 1.4); markAbove(h, "drop"); h.sadMouth = true; await sleep(1000); },
  async tiowari(h, a) { enter(h); await sleep(900); markAbove(h, "puff", { dx: 80 }); await sleep(300); },
  // ---- おんがく ----
  async ogutau(h, a) { enter(h); await sleep(900); playMove(h, "shy"); await sleep(900); },
  async ogkenban(h, a) { await desk8(h); window.__kb = on8(world(h, 200, 0).x, 830, "kenban", .45); await sleep(300); playMove(h, "think"); hint7(h, "🎹", "ド？"); await sleep(1100); },
  async ogoto(h, a) { window.__dm = hp7(a, "drum", .4); enter(h); await sleep(900); for (let i = 0; i < 3; i++) later(i * 280, () => { boom(.12); markAbove(a, "anger", { dx: -60 }); }); await sleep(400); h.armL.t = -150; h.armR.t = -150; hold(h, "shiver", 1); await sleep(800); h.armL.t = h.armR.t = 0; },
  async ogrhythm(h, a) { enter(h); await sleep(800); for (const t of [0, 400, 800, 1000, 1200]) later(t, () => { blip(1000, 800, .05, "square"); a.tm.clap = .2; }); await sleep(1500); markAbove(h, "q"); },
  async oghomeru(h, a) { window.__kb = hp7(a, "kenban", .3); enter(h); await sleep(800); for (let i = 0; i < 5; i++) later(i * 220, () => { blip(520 + i * 80, 520 + i * 80, .12, "sine"); markAbove(a, "note", { dx: 80 }); }); await sleep(1300); },
  async ogwasureta(h, a) { await desk8(h); playMove(h, "look"); hint7(h, "🎹", "ない"); await sleep(1000); h.sadMouth = true; },
  async oghappyou(h, a) { enter(h); await sleep(900); hold(h, "shiver", 1); markAbove(h, "drop"); hint7(h, "💓", "どきどき"); await sleep(1100); },
  async ogurusai(h, a) { window.__rc8 = hp7(a, "recorder", .3); enter(h); await sleep(800); for (let i = 0; i < 6; i++) later(i * 180, () => { blip(1400 + (i % 2) * 300, 1400, .08, "square"); markAbove(a, "note", { dx: 60, vy: -160 }); }); await sleep(1200); markAbove(h, "ex"); },
  async ogkashi(h, a) { await desk8(h); book8(h); await sleep(300); for (let i = 0; i < 3; i++) later(i * 300, () => markAbove(a, "note", { dx: -60 })); playMove(h, "look"); markAbove(h, "q"); await sleep(1000); },
  async ogtanoshii(h, a) { enter(h); await sleep(900); for (let i = 0; i < 3; i++) later(i * 300, () => markAbove(h, "note", { dx: 70 })); await sleep(800); },
  async ogowari(h, a) { enter(h); await sleep(1000); },
  // ---- ずこう ----
  async zknanio(h, a) { await desk8(h); window.__pp = on8(world(h, 200, 0).x, 820, "paper", .45); await sleep(300); playMove(h, "think"); hint7(h, "🖍", "なにを かく？"); await sleep(1100); },
  async zkhasami(h, a) { place(h, 560, 975, .88); stay(h); sit3(h); a.dx.v = a.dx.t = 0; await sleep(400); playMove(a, "look"); hint8(a, "❓", "のり"); await sleep(1100); window.__gl = hp7(h, "glue", .3); },
  async zkkariru(h, a) { await desk8(h); playMove(h, "look"); hint7(h, "✂", "ない"); await sleep(1100); },
  async zkenogu(h, a) { await desk8(h); const c = on8(world(h, 200, 0).x + 60, 815, "paintcup", .35); await sleep(400); h.armR.t = -40; c.setAttribute("transform", `translate(${world(h, 200, 0).x + 80} 820) rotate(80) scale(.35)`); noise(.15, 700, .5); window.__sp = on8(world(h, 200, 0).x + 120, 975, "puddle", .6); surprise(h); await sleep(900); h.armR.t = 0; h.sadMouth = true; },
  async zksetsumei(h, a) { window.__fd = on8(860, 700, "famdraw", .9); await comeSit(h, 1000); h.armR.t = -60; await sleep(500); h.armR.t = 0; },
  async zkhomeru(h, a) { window.__el = hp7(a, "elephant", .5); enter(h); await sleep(900); playMove(a, "cheer"); await sleep(500); },
  async zkjikan(h, a) { await desk8(h); h.armR.t = -30; for (let i = 0; i < 4; i++) later(i * 250, () => blip(1600, 1500, .03, "square")); await sleep(500); playMove(a, "point"); hint7(h, "⏰", "あと 5ふん"); await sleep(1000); h.armR.t = 0; },
  async zkhasamitsukau(h, a) { window.__sc = hp7(h, "scissors", .35); h.dx.v = h.dx.t = -500; hold(h, "run", 1.2); h.dx.t = 0; await sleep(1200); playMove(a, "no"); markAbove(a, "ex"); await sleep(500); },
  async zktetsudai(h, a) { await desk8(h); window.__og = hp7(h, "origami", .35); await sleep(300); hold(h, "shiver", .8); playMove(h, "frustrated"); await sleep(1000); },
  async zkkataduke(h, a) { window.__pc = hp7(h, "paintcup", .3); await comeSit(h, 1000); playMove(h, "look"); markAbove(h, "q"); await sleep(600); },
  async zkowari(h, a) { await desk8(h); ring3(); await sleep(800); },
  // ---- じてんしゃ ----
  async jthelmet(h, a) { const hm = hp7(h, "helmet", .35); await comeSit(h, 900); hm.remove(); window.__hm = el("g", {}, front()); ITEM2.helmet(window.__hm); follow(window.__hm, () => { const p = headTop(h); return [p.x, p.y + 30 * h.s, 0, h.s * .9]; }); chime(); await sleep(500); window.__bk8 = rideBike(h); await sleep(600); },
  async jtkuruma(h, a) { window.__bk8 = rideBike(h); a.dx.v = a.dx.t = 0; await comeSit(h, 900); const car = el("g", {}, front()); txt(car, 0, 0, "🚗", 200, { "text-anchor": "middle" }); tween(1400, t => car.setAttribute("transform", `translate(${1800 - 420 * t} 900) scale(${-.55 - .2 * t} ${.55 + .2 * t})`)); later(200, () => blip(500, 500, .3, "square")); await sleep(500); surprise(h); await sleep(900); window.__car8 = car; },
  async jthidari(h, a) { window.__bk8 = rideBike(h); await comeSit(h, 900); hint7(h, "⬅➡", "どっち？"); playMove(h, "think"); await sleep(1100); },
  async jtshingou(h, a) { window.__bk8 = rideBike(h); await comeSit(h, 900); if (window.__sig) window.__sig("red"); markAbove(h, "ex"); hint7(h, "🔴", "あか"); await sleep(1000); },
  async jttomare(h, a) { const g = el("g", {}, propG); el("path", { d: "M300 975 V560", ...S6(10) }, g); el("path", { d: "M220 470 H380 L300 600 Z", fill: "#E8473C", ...S6(6) }, g); txt(g, 300, 520, "とまれ", 34, { "text-anchor": "middle", fill: "#FFFFFF" }); window.__bk8 = rideBike(h); await comeSit(h, 1000); playMove(h, "look"); await sleep(500); },
  async jthodou(h, a) { const ks = ["kamejii", "meebaa"].map((k, i) => xtra(k, 880 + i * 170, .7)); window.__bk8 = rideBike(h); await comeSit(h, 900); ks.forEach(c => pace(c, 1200, 60, 600)); markAbove(h, "ex"); await sleep(900); },
  async jtnarabu(h, a) { window.__bk8 = rideBike(h); const b2 = rideBike(a); window.__bk9 = b2; a.dx.v = a.dx.t = 600; a.dx.t = 0; hold(a, "run", 1); await comeSit(h, 1000); playMove(a, "wave"); await sleep(400); },
  async jtkasa(h, a) { window.__bk8 = rideBike(h); await comeSit(h, 900); const r = el("g", {}, front()); for (let i = 0; i < 40; i++) el("path", { d: `M${(i * 97) % 1600} ${(i * 53) % 700} l-14 40`, stroke: "#7FB6E8", "stroke-width": 5 }, r); window.__rn = r; tween(1200, t => r.setAttribute("transform", `translate(0 ${t * 120})`)); markAbove(h, "drop"); await sleep(1000); },
  async jtmatte(h, a) { window.__bk8 = rideBike(h); window.__bk9 = rideBike(a); a.dx.v = a.dx.t = 0; await comeSit(h, 900); a.dx.t = 300; hold(a, "run", .8); await sleep(700); h.sadMouth = true; for (let i = 0; i < 3; i++) later(i * 300, () => markAbove(h, "puff", { dx: 80 })); hint7(h, "💦", "つかれた"); await sleep(1000); },
  async jtbell(h, a) { const c = xtra("meebaa", 980, .7); stay(c); window.__bk8 = rideBike(h); await comeSit(h, 1000); hint7(h, "🔔", "ベル？"); await sleep(1000); },
  async jtkoronda(h, a) { window.__bk8 = rideBike(h); a.dx.v = a.dx.t = 0; await comeSit(h, 900); noise(.15, 300, .5); window.__bk8.remove(); playMove(h, "flop"); h.sadMouth = true; await sleep(700); markAbove(h, "drop"); await sleep(500); },
  async jttomodachi(h, a) { window.__hm = hp7(h, "helmet", .3); a.dx.v = a.dx.t = 600; a.dx.t = 0; hold(a, "run", 1); await comeSit(h, 1000); playMove(a, "no"); await sleep(600); },
  // ---- やすみじかん ----
  async ymnaniyomu(h, a) { place(h, 560, 975, .88); stay(h); sit3(h); book8(h, "dinobook"); a.dx.v = a.dx.t = 600; a.dx.t = 0; hold(a, "run", .9); await sleep(1100); playMove(a, "look"); await sleep(300); },
  async ymsasoi(h, a) { place(h, 560, 975, .88); stay(h); sit3(h); book8(h); window.__bl = hp7(a, "ball", .35); a.dx.v = a.dx.t = 600; a.dx.t = 0; hold(a, "run", .9); await sleep(1100); },
  async ymkotowaru(h, a) { place(h, 560, 975, .88); stay(h); sit3(h); book8(h); a.dx.v = a.dx.t = 600; a.dx.t = 0; hold(a, "run", .9); await sleep(1100); },
  async ymanime(h, a) { enter(h); await sleep(800); joy(a); hint8(a, "📺", "アニメ"); await sleep(1100); },
  async ymkyara(h, a) { enter(h); await sleep(800); playMove(a, "pump"); hint8(a, "📺", "ぜんぶ みた"); await sleep(1100); },
  async ymkiminona(h, a) { enter(h); await sleep(900); hint8(a, "🎬", "すきな えいが？"); await sleep(1000); },
  async ymlupin(h, a) { enter(h); await sleep(900); hint8(a, "🐘", "ぞうの えいが"); await sleep(1100); },
  async ymshiranai(h, a) { enter(h); await sleep(900); playMove(a, "no"); markAbove(a, "q"); await sleep(900); },
  async ymhanashikake(h, a) { place(a, 1150, 975, ASK_AT.chu[1]); stay(a); playMove(a, "crouch"); const s = el("g", {}, propG); el("ellipse", { cx: 1000, cy: 960, rx: 140, ry: 26, fill: "#F2DFAE", ...S6(4) }, s); el("path", { d: "M940 955 q30 -20 60 0 q20 10 50 -4", fill: "none", ...S6(4) }, s); enter(h); await sleep(1100); playMove(h, "look"); },
  async ymkaritai(h, a) { place(h, 560, 975, .88); stay(h); sit3(h); book8(h, "ehon"); a.dx.v = a.dx.t = 600; a.dx.t = 0; hold(a, "run", .9); await sleep(1100); markAbove(a, "sparkle"); },
  async ymhitori(h, a) { place(h, 560, 975, .88); stay(h); sit3(h); book8(h); a.dx.v = a.dx.t = 600; a.dx.t = 0; hold(a, "run", .9); await sleep(1100); markAbove(a, "q"); },
  async ymchime(h, a) { place(h, 560, 975, .88); stay(h); sit3(h); book8(h); ring3(); await sleep(1300); },
});
Object.assign(POST, {
  async ysdekita(h, a) { joy(h); await sleep(300); h.dx.t = 700; hold(h, "run", .8); await sleep(800); },
  async ysshouyu(h, a) { hp7(a, "shouyu", .3); playMove(a, "nod"); await sleep(600); },
  async yspiman(h, a) { if (window.__pm) { window.__pm.remove(); window.__pm = null; } h.mouthOpen.t = .5; await sleep(300); h.mouthOpen.t = 0; hold(h, "shiver", .5); await sleep(400); joy(h); },
  async ysokawari(h, a) { rm8("__rc"); hp7(h, "rice", .32); playMove(a, "nod"); await sleep(500); joy(h); },
  async yskoboshi(h, a) { hp7(a, "rag", .35); await walk(a, -300, 700); rm8("__sp"); h.sadMouth = false; playMove(h, "nod"); await sleep(300); },
  async ystoranaide(h, a) { playMove(a, "bow"); await sleep(500); joy(h); },
  async yskatazuke(h, a) { rm8("__pl"); playMove(a, "nod"); await sleep(400); },
  async ystetsudai(h, a) { rm8("__cs"); joy(a); await sleep(400); },
  async kgenpitsu(h, a) { rm8("__pb"); hp7(h, "pencil", .35); joy(h); await sleep(400); },
  async kgwaraware(h, a) { playMove(a, "bow"); h.sadMouth = false; await sleep(600); },
  async tinawatobi(h, a) { h.sadMouth = false; playMove(a, "nod"); await sleep(400); },
  async tikoronda(h, a) { a.dx.t = -250; hold(a, "run", .5); await sleep(500); playMove(a, "nod"); h.sadMouth = false; await sleep(300); },
  async tikowai(h, a) { h.sadMouth = false; playMove(a, "nod"); await sleep(400); jump(h, .5); },
  async ogoto(h, a) { rm8("__dm"); a.dx.t = 150; hold(a, "run", .5); await sleep(500); joy(h); },
  async ogurusai(h, a) { rm8("__rc8"); playMove(a, "bow"); await sleep(500); },
  async zkhasami(h, a) { rm8("__gl"); hp7(a, "glue", .3); joy(a); await sleep(400); },
  async zkkariru(h, a) { hp7(h, "scissors", .3); playMove(a, "nod"); await sleep(400); },
  async zkenogu(h, a) { hp7(h, "rag", .35); h.sadMouth = false; await sleep(400); rm8("__sp"); },
  async zkhasamitsukau(h, a) { playMove(h, "bow"); await sleep(500); },
  async jtkoronda(h, a) { h.sadMouth = false; playMove(a, "nod"); await sleep(400); window.__bk8 = rideBike(h); },
  async jtkasa(h, a) { rm8("__rn"); await sleep(200); },
  async jtmatte(h, a) { a.dx.t = 0; hold(a, "run", .6); await sleep(600); h.sadMouth = false; joy(h); },
  async jttomodachi(h, a) { rm8("__hm"); const hm = el("g", {}, front()); ITEM2.helmet(hm); follow(hm, () => { const p = headTop(a); return [p.x, p.y + 30 * a.s, 0, a.s * .9]; }); joy(a); await sleep(500); },
  async jtnarabu(h, a) { a.dx.t = 260; hold(a, "run", .6); await sleep(600); },
  async ymnaniyomu(h, a) { joy(a); await sleep(400); },
  async ymchime(h, a) { rm8("__bk"); joy(h); await sleep(400); },
});

/* ---------- つづけて おはなし（ゆうごはんの 💬 マス）：ママが 5つ つづけて きく ---------- */
const KQ_ASK = { shima: "mama", gao: "gaomama", pyon: "pyonmama", mii: "miimama", chu: "chumama", doshin: "doshinpapa" };
const KQ = { dou: "ねえ、きょう がっこうは どうだった？", nani: "へえ。なにが あったの？", dare: "だれと いっしょだったの？", dounatta: "それで、どう なったの？", kimochi: "そのとき、どんな きもちだった？", res: "たくさん おはなし して くれて ありがとう。よく わかったよ" };
const KN = {
  dodge: { dou: ["😊", "たのしかった", ["たのしかった", [["たのしかった", "楽しかった"]]], ["すごく たのしかったよ", [["たのしかった", "楽しかった"]]]],
    nani: ["⚽", "ドッジボール", ["ドッジボールを したよ", [["どっじ", "ドッジ"]]], ["やすみじかんに、みんなで ドッジボールを したよ", [["やすみじかん", "休み時間"], ["どっじ", "ドッジ"]]]],
    dare: ["🦊", "こんくん", ["こんくんと したよ", [["こん"]]], ["こんくんと おなじ チームだったよ", [["こん"], ["ちーむ", "チーム"]]]],
    dounatta: ["🙌", "ボールを とった", ["ボールを とったよ", [["ぼーる", "ボール"], ["とった", "取った", "捕った"]]], ["ボールを とって、なげたら あたったよ", [["とって", "取って", "捕って"], ["あたった", "当たった"]]]],
    kimochi: ["💖", "うれしい", ["うれしかった", [["うれしかった", "嬉しかった"]]], ["とっても うれしくて、とびはねたよ", [["うれしく", "嬉しく"], ["とびはね", "跳びはね", "飛び跳ね"]]]] },
  kyushoku: { dou: ["😋", "おいしかった", ["おいしかった", [["おいしかった", "美味しかった"]]], ["きゅうしょくが おいしかったよ", [["きゅうしょく", "給食"], ["おいしかった", "美味しかった"]]]],
    nani: ["🍛", "カレー", ["カレーが でたよ", [["かれー", "カレー"]]], ["きゅうしょくに、カレーが でたよ", [["きゅうしょく", "給食"], ["かれー", "カレー"]]]],
    dare: ["🐼", "ぱんなちゃん", ["ぱんなちゃんと たべたよ", [["ぱんな"]]], ["となりの ぱんなちゃんと、いっしょに たべたよ", [["となり", "隣"], ["ぱんな"]]]],
    dounatta: ["🍚", "おかわり", ["おかわり したよ", [["おかわり", "お代わり"]]], ["カレーが おいしくて、おかわり したよ", [["かれー", "カレー"], ["おかわり", "お代わり"]]]],
    kimochi: ["😋", "まんぷく", ["まんぷくだった", [["まんぷく", "満腹"]]], ["カレーを いっぱい たべて、まんぷくだったよ", [["まんぷく", "満腹"]]]] },
  koronda: { dou: ["😣", "いたかった", ["ちょっと いたかった", [["いたかった", "痛かった"]]], ["ちょっと いたい ことが あったよ", [["いたい", "痛い"], ["あった"]]]],
    nani: ["💥", "ころんだ", ["ころんだの", [["ころん", "転ん"]]], ["はしって いたら、ころんじゃったの", [["はしって", "走って"], ["ころん", "転ん"]]]],
    dare: ["🦊", "こんくん", ["こんくんと いたよ", [["こん"]]], ["こんくんと、おにごっこを して いたよ", [["こん"], ["おにごっこ", "鬼ごっこ"]]]],
    dounatta: ["🩹", "ほけんしつ", ["ほけんしつに いったよ", [["ほけんしつ", "保健室"]]], ["ひざを すりむいて、ほけんしつに いったよ", [["ひざ", "膝"], ["ほけんしつ", "保健室"]]]],
    kimochi: ["💪", "がんばった", ["いたかった", [["いたかった", "痛かった"]]], ["いたかったけど、なかないで がんばったよ", [["なかない", "泣かない"], ["がんばった", "頑張った"]]]] },
  hon: { dou: ["😊", "たのしかった", ["たのしかった", [["たのしかった", "楽しかった"]]], ["しずかで、たのしかったよ", [["しずか", "静か"], ["たのしかった", "楽しかった"]]]],
    nani: ["📚", "ほん", ["ほんを よんだよ", [["ほん", "本"], ["よんだ", "読んだ"]]], ["としょしつで、きょうりゅうの ほんを よんだよ", [["としょしつ", "図書室"], ["きょうりゅう", "恐竜"]]]],
    dare: ["🙋", "ひとりで", ["ひとりで よんだよ", [["ひとり", "一人"]]], ["ひとりで、ゆっくり よんだよ", [["ひとり", "一人"], ["ゆっくり"]]]],
    dounatta: ["📖", "さいごまで", ["さいごまで よんだよ", [["さいご", "最後"]]], ["ぜんぶ よんで、もう いっさつ かりたよ", [["ぜんぶ", "全部"], ["かりた", "借りた"]]]],
    kimochi: ["🦖", "わくわく", ["おもしろかった", [["おもしろかった", "面白かった"]]], ["きょうりゅうが かっこよくて、わくわく したよ", [["かっこよ", "格好よ"], ["わくわく", "ワクワク"]]]] },
  homerareta: { dou: ["😄", "うれしかった", ["うれしかった", [["うれしかった", "嬉しかった"]]], ["うれしい ことが あったよ", [["うれしい", "嬉しい"], ["あった"]]]],
    nani: ["👏", "ほめられた", ["ほめられたよ", [["ほめられ", "褒められ"]]], ["せんせいに ほめられたよ", [["せんせい", "先生"], ["ほめられ", "褒められ"]]]],
    dare: ["🦒", "のっぽせんせい", ["のっぽせんせいだよ", [["のっぽ"]]], ["のっぽせんせいが、ほめて くれたよ", [["のっぽ"], ["ほめて", "褒めて"]]]],
    dounatta: ["💮", "はなまる", ["はなまるを もらったよ", [["はなまる", "花丸"]]], ["ノートに、はなまるを もらったよ", [["のーと", "ノート"], ["はなまる", "花丸"]]]],
    kimochi: ["💖", "うれしい", ["うれしかった", [["うれしかった", "嬉しかった"]]], ["うれしくて、はやく みせたかったよ", [["うれしく", "嬉しく"], ["みせたかった", "見せたかった"]]]] },
  kenka: { dou: ["😞", "いやだった", ["ちょっと いやだった", [["いやだった", "嫌だった"]]], ["ちょっと、いやな ことが あったよ", [["いやな", "嫌な"], ["あった"]]]],
    nani: ["💢", "けんか", ["けんか したの", [["けんか", "喧嘩"]]], ["ブランコの じゅんばんで、けんか したの", [["ぶらんこ", "ブランコ"], ["けんか", "喧嘩"]]]],
    dare: ["🦊", "こんくん", ["こんくんと", [["こん"]]], ["こんくんと、けんか したの", [["こん"], ["けんか", "喧嘩"]]]],
    dounatta: ["🤝", "なかなおり", ["ごめんねって いったよ", [["ごめん", "御免"]]], ["ふたりで ごめんねって いって、なかなおり したよ", [["ごめん", "御免"], ["なかなおり", "仲直り"]]]],
    kimochi: ["😌", "ほっと した", ["ほっと したよ", [["ほっと", "ホッと"]]], ["なかなおり できて、ほっと したよ", [["なかなおり", "仲直り"], ["ほっと", "ホッと"]]]] },
};
let KN_PC = null; const KN_NODES = ["a3", "c2"], RQ_NODES = ["a3", "c2"];
{ const mb = moveBy; moveBy = async function (pc, n) { KN_PC = pc; return mb(pc, n); }; }
async function knRun(heroKind) {
  const ks = Object.keys(KN), tk = ks[rnd(ks.length)], TP = KN[tk], lv = tierOf() >= 2 ? 1 : 0, ak = KQ_ASK[heroKind] || "mama";
  const s = { id: "ysohanashi", place: "ダイニング", asker: ak, intro: "ysohanashi" };
  const { hero: h, ask: a } = setSitView(s, heroKind); showEngine(null, `つづけて おはなし（${tk}・${lv ? "ながい" : "みじかい"}）`);
  tableAt(); T8("hamburg", 0, .45); await comeSit(h, 900);
  await speak(C.pony, "kn_intro", "つづけて おはなし！ きょうの ことを、じゅんばんに おはなし しよう");
  let okN = 0; const tries = [];
  for (const q of ["dou", "nani", "dare", "dounatta", "kimochi"]) {
    const [emo, lab] = TP[q], [ans, keys] = TP[q][2 + lv]; const hb = hint7(h, emo, lab);
    await speak(a, `kq_${q}_${ak}`, KQ[q]);
    showTask(ans, "こたえよう"); await speak(C.pony, `kn_${tk}_${q}_${lv}`, ans); unsay();
    let ok = false;
    for (let n = 0; n < 2 && !ok; n++) { setListen(h, true); const r = await listen(keys, 8000); setListen(h, false); tries.push(`${q}${r.r === "ok" ? "○" : "×"}${r.heard || ""}`); ok = r.r === "ok";
      if (!ok && n === 0) await speak(C.pony, "p_again", "もう いっかい いってみよう"); }
    if (ok) { okN++; chime(); playMove(a, "nod"); markAbove(h, "sparkle"); } else { await speak(C.pony, "p_together", "いっしょに いおうね"); await speak(C.pony, `kn_${tk}_${q}_${lv}`, ans); }
    hideTask(); hb.remove(); await sleep(300);
  }
  await speak(a, `kq_res_${ak}`, KQ.res);
  const ok = okN >= 3; grade(ok && okN === 5); GS.tasks++; if (ok) GS.ok++;
  playLog({ type: "ohanashi", topic: tk, okN, tries, ...(MODE === "multi" ? { who: NAMES[heroKind] } : {}) });
  if (ok) { joy(h); confetti(50); joy(C.pony); await speak(C.pony, "p_great", "すごい！ いえたね！"); await seedGet(h); }
  await sleep(500); setView("board"); return ok;
}

/* ---------- ルールクイズ（じてんしゃの 🚦 マス）：ただしい ほうを タッチ → ルールを いう ---------- */
const RQ = [
  { id: "aka", q: "しんごうが あかだよ。どうする？", pic: "🔴", cards: [["とまる", "✋", 1], ["すすむ", "🚲", 0]], rule: "あかは とまれ", keys: [["あか", "赤"], ["とまれ", "止まれ", "とまる", "止まる"]] },
  { id: "helmet", q: "じてんしゃに のる まえに、あたまに なにを する？", pic: "🚲", cards: [["ヘルメットを かぶる", "⛑", 1], ["なにも しない", "🙅", 0]], rule: "じてんしゃに のる ときは ヘルメット", keys: [["へるめっと", "ヘルメット"]] },
  { id: "hidari", q: "じてんしゃは、みちの どっちがわを はしる？", pic: "🛣", cards: [["ひだりがわ", "⬅", 1], ["みぎがわ", "➡", 0]], rule: "じてんしゃは ひだりがわ", keys: [["ひだり", "左"]] },
  { id: "kasa", q: "あめの ひに じてんしゃに のる ときは？", pic: "🌧", cards: [["かさを さす", "☂", 0], ["カッパを きる", "🧥", 1]], rule: "かさを さして のらない", keys: [["かさ", "傘"], ["のらない", "乗らない"]] },
  { id: "narabi", q: "ともだちと いっしょに はしる ときは？", pic: "🚲🚲", cards: [["よこに ならぶ", "↔", 0], ["いちれつに なる", "⬇", 1]], rule: "ならんで はしらない", keys: [["ならんで", "並んで", "いちれつ", "一列"]] },
  { id: "tomare", q: "「とまれ」の マークが あったら？", pic: "🛑", cards: [["いちど とまる", "✋", 1], ["そのまま すすむ", "💨", 0]], rule: "とまれでは いちど とまる", keys: [["とまれ", "止まれ", "とまる", "止まる"], ["いちど", "一度", "とまる", "止まる"]] },
  { id: "hodou", q: "ほどうに ひとが たくさん いるよ。どうする？", pic: "🚶", cards: [["おりて おす", "🚶", 1], ["そのまま はしる", "🚲", 0]], rule: "ほどうは ひとが さき", keys: [["ほどう", "歩道"], ["さき", "先"]] },
  { id: "kado", q: "まがりかどに きたよ。むこうが みえないね。どうする？", pic: "↱", cards: [["とまって たしかめる", "✋", 1], ["そのまま まがる", "💨", 0]], rule: "まがりかどは とまって たしかめる", keys: [["まがりかど", "曲がり角"], ["とまって", "止まって", "たしかめ", "確かめ"]] },
  { id: "tobidashi", q: "みせの まえを はしるよ。ひとが でて きそう。どうする？", pic: "🏪", cards: [["ゆっくり はしる", "🐢", 1], ["スピードを だす", "💨", 0]], rule: "ひとの とびだしに きを つける", keys: [["とびだし", "飛び出し"], ["きを つけ", "気をつけ", "気を付け", "ちゅうい", "注意"]] },
  { id: "light", q: "くらく なって きたよ。どうする？", pic: "🌙", cards: [["ライトを つける", "💡", 1], ["そのまま はしる", "🌑", 0]], rule: "くらく なったら ライトを つける", keys: [["らいと", "ライト"], ["つける", "点ける"]] },
];
const RQ_USED = new Set();
async function rqRun(heroKind) {
  let pool = RQ.filter(x => !RQ_USED.has(x.id)); if (!pool.length) { RQ_USED.clear(); pool = RQ; } const it = pool[rnd(pool.length)]; RQ_USED.add(it.id);
  const s = { id: "jtrulequiz", place: "こうさてん", asker: "omawari", intro: "jtrulequiz" };
  const { hero: h, ask: a } = setSitView(s, heroKind); showEngine(null, `ルールクイズ（${it.id}）`);
  window.__bk8 = rideBike(h); await comeSit(h, 900); if (it.id === "aka" && window.__sig) window.__sig("red");
  await speak(C.pony, "rl_intro", "ルールクイズ！ ただしい ほうを タッチしてね");
  const pic = el("g", {}, front()); el("rect", { x: 40, y: 150, width: 260, height: 200, rx: 30, fill: "#FFFFFF", ...S6(6) }, pic); if (it.id === "aka") sigG(pic, 170, 340, "red", .54, false); else txt(pic, 170, 290, it.pic, it.pic.length > 2 ? 90 : 130, { "text-anchor": "middle" });
  await speak(a, `rq_${it.id}`, it.q);
  const g = el("g", {}, front()); const order = rnd(2) ? [0, 1] : [1, 0];
  const cs = order.map((i, j) => { const [lab, emo, good] = it.cards[i]; const c = card(g, 340 + j * 520, 160, 480, 180, lab, emo, { es: 80 }); c.good = good; return c; });
  let wrong = 0; setListen(h, true);
  const goodLab = it.cards.find(c => c[2])[0];
  await new Promise(res => { let fin = false, live = true; const done = () => { if (fin) return; fin = true; live = false; cs.forEach(c => c.onclick = null); res(); };
    cs.forEach(c => c.onclick = () => { if (fin || c.dim) return; if (c.good) done(); else { c.dim = 1; c.setAttribute("opacity", .35); wrong++; noise(.1, 700, .35); speak(a, "rq_ng", "ざんねん。もう いっぽうが ただしいよ"); } });
    (async () => { while (live) { const r = await listen([[goodLab.split(" ")[0]]], 9000); if (r.r === "ok") { done(); return; } if (!live) return; await sleep(200); } })(); });
  setListen(h, false);
  const hit = cs.find(c => c.good); hit.rect.setAttribute("fill", "#FFE27A"); chime(); playMove(a, "nod"); await speak(a, "rq_ok", "せいかい！");
  g.remove(); showTask(it.rule, "ルールを いおう"); await speak(a, "rq_say", "じゃあ、ルールを いって みよう"); await speak(C.pony, `rl_${it.id}`, it.rule); unsay();
  let ok = false, heard = "";
  for (let n = 0; n < 2 && !ok; n++) { setListen(h, true); const r = await listen(it.keys, 8000); setListen(h, false); heard = r.heard || ""; ok = r.r === "ok"; if (!ok && n === 0) await speak(C.pony, "p_again", "もう いっかい いってみよう"); }
  if (!ok) { await speak(C.pony, "p_together", "いっしょに いおうね"); await speak(C.pony, `rl_${it.id}`, it.rule); }
  hideTask(); pic.remove();
  await speak(a, "rq_res", "ルールを まもって、あんぜんに のろうね");
  const good = ok && wrong === 0; grade(good); GS.tasks++; if (ok) GS.ok++;
  playLog({ type: "rulequiz", id: it.id, wrong, ok, heard, ...(MODE === "multi" ? { who: NAMES[heroKind] } : {}) });
  if (ok) { joy(h); confetti(50); joy(C.pony); await speak(C.pony, "p_great", "すごい！ いえたね！"); await seedGet(h); }
  await sleep(500); setView("board"); return ok;
}
{ const lc = landChild; landChild = async function (pc = P.shima) {
    if (!winner && KN_PC === pc) {
      if (curStage === "yuushoku" && KN_NODES.includes(pc.node)) { const ok = await knRun(pc.kind); if (ok && pc.player) pc.player.ok++; return; }
      if (curStage === "jitensha" && RQ_NODES.includes(pc.node)) { const ok = await rqRun(pc.kind); if (ok && pc.player) pc.player.ok++; return; } }
    return lc(pc); }; }
EV_STYLE.ohanashi = ["#FFE3B3", () => "💬"]; EV_STYLE.rulequiz = ["#D7F0D2", () => "🚦"];
{ const be = boardEvent; boardEvent = async function (pc) { const ev = (EVENTS[curStage] || {})[pc.node]; if (ev && (ev[0] === "ohanashi" || ev[0] === "rulequiz")) return; return be(pc); }; }

/* ---------- 盤 ---------- */
const SD8 = { yuushoku: ["#FFF1E0", "リビング", "ダイニング", "だいどころ"], kokugo: ["#FFF6E0", "きょうしつ"], taiiku: ["#E9F6E0", "こうてい", "たいいくかん"], ongaku: ["#F3ECFF", "おんがくしつ"], zukou: ["#FFF0E3", "ずこうしつ"], jitensha: ["#EAF6FF", "いえの まえ", "みち", "こうさてん", "ほどう", "サイクリングロード"], yasumi: ["#FFF6E0", "きょうしつ", "こうてい"] };
const FILL8 = ["#FFE3B3", "#D7ECFF", "#D7F0D2", "#FFD1D9", "#EDE3FF"];
const P8 = { yuushoku: ["リビング", "ダイニング", "ダイニング", "だいどころ", "ダイニング", "ダイニング"], kokugo: Array(6).fill("きょうしつ"), taiiku: ["こうてい", "こうてい", "たいいくかん", "こうてい", "たいいくかん", "こうてい"],
  ongaku: Array(6).fill("おんがくしつ"), zukou: Array(6).fill("ずこうしつ"), jitensha: ["いえの まえ", "みち", "こうさてん", "ほどう", "サイクリングロード", "いえの まえ"], yasumi: ["きょうしつ", "きょうしつ", "こうてい", "こうてい", "きょうしつ", "きょうしつ"] };
S8L.forEach(id => { const [gr, ...pl] = SD8[id], P = P8[id], fills = {}; pl.forEach((p, i) => fills[p] = FILL8[i % FILL8.length]);
  STAGE_DEF[id] = { ground: gr, sky: "#CFEAFB", names: [P[0], P[1], P[2], P[2], P[3], P[3], P[4], P[4], P[5]], fills };
  board7(id, P, "hall"); });
Object.assign(BOARD_BG, {
  yuushoku(L) { bg7(L, "#FFF1E0", ["#FFE3B3", "#D7ECFF", "#D7F0D2"], "🍽 ゆうごはん", "#E8735A"); txt(L, 1460, 180, "🍛", 110, { "text-anchor": "middle" }); },
  kokugo(L) { bg7(L, "#FFF6E0", ["#FFE3B3", "#FFE3B3", "#FFE3B3"], "📖 こくご", "#2F6B4F"); txt(L, 1460, 180, "あ", 110, { "text-anchor": "middle" }); },
  taiiku(L) { bg7(L, "#E9F6E0", ["#FFE3B3", "#D7ECFF", "#D7ECFF"], "🏃 たいいく", "#E8473C"); txt(L, 1460, 180, "⚽", 110, { "text-anchor": "middle" }); },
  ongaku(L) { bg7(L, "#F3ECFF", ["#FFE3B3", "#FFE3B3", "#FFE3B3"], "🎵 おんがく", "#8E6FD6"); txt(L, 1460, 180, "🎹", 110, { "text-anchor": "middle" }); },
  zukou(L) { bg7(L, "#FFF0E3", ["#FFE3B3", "#FFE3B3", "#FFE3B3"], "🎨 ずこう", "#F29F4C"); txt(L, 1460, 180, "🖍", 110, { "text-anchor": "middle" }); },
  jitensha(L) { bg7(L, "#EAF6FF", ["#FFE3B3", "#D7F0D2", "#FFD1D9"], "🚲 じてんしゃ", "#3E7FD6"); txt(L, 1460, 180, "🚦", 110, { "text-anchor": "middle" }); },
  yasumi(L) { bg7(L, "#FFF6E0", ["#FFE3B3", "#D7ECFF", "#D7ECFF"], "📚 やすみじかん", "#7BC4A0"); txt(L, 1460, 180, "📚", 110, { "text-anchor": "middle" }); },
});
Object.assign(BLOCK_DEF, {
  yuushoku: { who: "onii", sleep: false, intro: ["p_blk_yuushoku", "おにいちゃんが ゲームに むちゅうで、ごはんに こないよ。よんで あげよう"], say: ["blk_yuushoku", "ごはんだよ"], to: "おにいちゃんに いおう", keys: [["ごはん", "ご飯"]], res: ["rs_yuushoku", "おっ、いま いく！"] },
  kokugo: { who: "pyon", sleep: false, intro: ["p_blk_kokugo", "ぴょんちゃんが つうろで ほんを ひろげて いるよ。とおして もらおう"], say: ["blk_kokugo", "とおして ください"], to: "ぴょんちゃんに いおう", keys: [["とおして", "通して"]], res: ["rs_kokugo", "あ、ごめんね。どうぞ"] },
  taiiku: { who: "doshin", sleep: false, intro: ["p_blk_taiiku", "どしんが くつひもを むすべなくて こまって いるよ。こえを かけよう"], say: ["blk_taiiku", "てつだおうか"], to: "どしんに いおう", keys: [["てつだ", "手伝"]], res: ["rs_taiiku", "ありがとう！ たすかったよ"] },
  ongaku: { who: "panna", sleep: false, intro: ["p_blk_ongaku", "ぱんなちゃんが がっきを たくさん もって いるよ。てつだって あげよう"], say: ["blk_ongaku", "ひとつ もつよ"], to: "ぱんなちゃんに いおう", keys: [["もつ", "持つ"]], res: ["rs_ongaku", "ありがとう！ たすかる"] },
  zukou: { who: "doshin", sleep: false, intro: ["p_blk_zukou", "どしんが えのぐを こぼして こまって いるよ。こえを かけよう"], say: ["blk_zukou", "いっしょに ふこう"], to: "どしんに いおう", keys: [["ふこう", "拭こう"]], res: ["rs_zukou", "ありがとう。たすかったよ"] },
  jitensha: { who: "kamejii", sleep: false, intro: ["p_blk_jitensha", "かめじいが ほどうを ゆっくり あるいて いるよ。じてんしゃを おりて こえを かけよう"], say: ["blk_jitensha", "すみません、とおります"], to: "かめじいに いおう", keys: [["すみません"]], res: ["rs_jitensha", "ほっほ、ていねいに ありがとう"] },
  yasumi: { who: "mii", sleep: false, intro: ["p_blk_yasumi", "みいちゃんが ひとりで さみしそう。あそびに さそって みよう"], say: ["blk_yasumi", "いっしょに あそぼう"], to: "みいちゃんに いおう", keys: [["あそぼう", "遊ぼう"]], res: ["rs_yasumi", "……うん、いいわよ！"] },
});
S8L.forEach(st => SLEEPER_OF[st] = BLOCK_DEF[st].who); /* とおせんぼの 子は ライバルと べつの 子に（おなじだと ライバルの コマが きえる） */
const EV8 = { yuushoku: ["おてつだいを ほめられた！", "おはしを おとした！", "てを あらうのを わすれた！"], kokugo: ["おおきな こえで よめた！", "ページが わからなく なった！", "きょうかしょを わすれた！"],
  taiiku: ["かけっこで いちばん！", "くつが ぬげた！", "たいそうふくを わすれた！"], ongaku: ["きれいな こえで うたえた！", "がくふが とんで いった！", "けんばんハーモニカを わすれた！"],
  zukou: ["すてきな えが かけた！", "えのぐが こぼれた！", "はさみを わすれた！"], jitensha: ["おいかぜで すいすい！", "タイヤの くうきが ぬけた！", "ヘルメットを わすれた！"], yasumi: ["おもしろい ほんを みつけた！", "ボールが ころがって いった！", "しおりを なくした！"] };
S8L.forEach(st => { const [f, b, h] = EV8[st]; EVENTS[st] = { a2: ["fwd", 2, `ev_${st}f`, f + " 2マス すすむよ"], m2: ["back", 2, `ev_${st}b`, b + " 2マス もどるよ"], d1: ["back", 4, `ev_${st}h`, h + " 4マス もどるよ"] };
  if (st === "yuushoku") Object.assign(EVENTS[st], { a3: ["ohanashi", 0, "", ""], c2: ["ohanashi", 0, "", ""] });
  if (st === "jitensha") Object.assign(EVENTS[st], { a3: ["rulequiz", 0, "", ""], c2: ["rulequiz", 0, "", ""] }); });
// おわりの あいさつの 場面は、こどもが 4つ いじょう こたえてから（sits.json の late）
