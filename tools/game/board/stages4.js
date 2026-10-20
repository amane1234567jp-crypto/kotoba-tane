/* ================= ステージ「おうち1」「おともだち1」「せんせい1」（2026-10-14） =================
   台本は sit/sits_new2.py。おうち1＝ママ・おにいちゃん、おともだち1＝こうえん・ともだちの いえ、せんせい1＝きょうしつ・ろうか。 */
const S4 = ["ouchi1", "tomodachi1", "sensei1"];
Object.assign(RIVAL_OF, { ouchi1: "mii", tomodachi1: "chu", sensei1: "pyon" });
Object.assign(KID_S, { onii: .98 }); PIECE_S.onii = .23; PIECE_S.kuma = .24; PIECE_S.tora = .22;

/* ---------- 物の 絵 ---------- */
Object.assign(ITEM2, {
  pad(g) { el("rect", { x: -70, y: -36, width: 140, height: 72, rx: 30, fill: "#5E6A7A", ...S6p() }, g); el("path", { d: "M-44 0 H-20 M-32 -12 V12", stroke: "#FFFFFF", "stroke-width": 7, "stroke-linecap": "round" }, g); [[28, -8, "#FF8FA3"], [46, 8, "#7FCBF0"]].forEach(([x, y, c]) => el("circle", { cx: x, cy: y, r: 9, fill: c, ...S6p(3) }, g)); },
  vacuum(g) { el("path", { d: "M0 -150 Q-40 -60 -20 40", fill: "none", stroke: INK, "stroke-width": 14 }, g); el("path", { d: "M0 -150 Q-40 -60 -20 40", fill: "none", stroke: "#9AA3B2", "stroke-width": 8 }, g); el("rect", { x: -70, y: 30, width: 110, height: 34, rx: 10, fill: "#5E6A7A", ...S6p(5) }, g); el("rect", { x: -20, y: -190, width: 90, height: 60, rx: 18, fill: "#FF8FA3", ...S6p(5) }, g); },
  cup(g) { el("path", { d: "M-34 -50 H34 L26 46 H-26 Z", fill: "#BDE3F2", ...S6p(5) }, g); el("path", { d: "M-28 -10 H28", stroke: "#7FCBF0", "stroke-width": 16 }, g); },
  sock(g) { el("path", { d: "M-20 -60 H20 V10 Q20 30 40 34 Q60 40 56 56 H-10 Q-24 56 -24 40 Z", fill: "#7FCBF0", ...S6p(5) }, g); el("path", { d: "M-20 -44 H20", stroke: "#FFFFFF", "stroke-width": 8 }, g); },
  shirt(g) { el("path", { d: "M-40 -60 L-90 -30 L-70 0 L-50 -10 V60 H50 V-10 L70 0 L90 -30 L40 -60 Q0 -40 -40 -60 Z", fill: "#FFB34D", ...S6p(5) }, g); for (let i = -30; i <= 40; i += 18) el("path", { d: `M-46 ${i} L46 ${i + 8}`, stroke: "#C9762B", "stroke-width": 4 }, g); },
  shirtb(g) { el("path", { d: "M-40 -60 L-90 -30 L-70 0 L-50 -10 V60 H50 V-10 L70 0 L90 -30 L40 -60 Q0 -40 -40 -60 Z", fill: "#7FCBF0", ...S6p(5) }, g); },
  blocks(g) { [[-40, 0, "#FF8FA3"], [10, 0, "#FFD25E"], [-15, -48, "#7BD389"]].forEach(([x, y, c]) => el("rect", { x, y, width: 46, height: 46, rx: 6, fill: c, ...S6p(4) }, g)); },
  robot(g) { el("rect", { x: -40, y: -20, width: 80, height: 76, rx: 10, fill: "#B0B7C3", ...S6p(5) }, g); el("rect", { x: -32, y: -76, width: 64, height: 52, rx: 10, fill: "#C9CED6", ...S6p(5) }, g); [-14, 14].forEach(x => el("circle", { cx: x, cy: -50, r: 7, fill: "#7FCBF0", ...S6p(3) }, g)); el("path", { d: "M0 -76 V-96", ...S6p(5) }, g); el("circle", { cy: -100, r: 7, fill: "#FF8FA3", ...S6p(3) }, g); },
  gamebox(g) { el("rect", { x: -60, y: -46, width: 120, height: 92, rx: 8, fill: "#B9A8D9", ...S6p(5) }, g); el("circle", { r: 22, fill: "#FFD25E", ...S6p(4) }, g); },
  gameboxb(g) { el("rect", { x: -60, y: -46, width: 120, height: 92, rx: 8, fill: "#7BD389", ...S6p(5) }, g); el("path", { d: "M-24 18 L0 -22 L24 18 Z", fill: "#FFFFFF", ...S6p(4) }, g); },
  origami(g) { el("path", { d: "M-50 30 L0 -50 L50 30 Z", fill: "#FF8FA3", ...S6p(5) }, g); el("path", { d: "M0 -50 V30", stroke: "#FFFFFF", "stroke-width": 4 }, g); },
  letter(g) { el("rect", { x: -60, y: -40, width: 120, height: 80, rx: 6, fill: "#FFFFFF", ...S6p(5) }, g); el("path", { d: "M-60 -40 L0 8 L60 -40", fill: "none", ...S6p(4) }, g); el("circle", { cx: 0, cy: 8, r: 10, fill: "#FF8FA3", ...S6p(3) }, g); },
  puddle(g) { el("path", { d: "M-110 0 Q-90 -22 -30 -16 Q30 -28 80 -14 Q120 0 100 12 Q40 22 -30 18 Q-110 20 -110 0 Z", fill: "#BDE3F2", ...S6p(4) }, g); },
});

/* ---------- へや ---------- */
function homeRoom(L, wall, floor) { el("rect", { x: 0, y: 0, width: 1600, height: 760, fill: wall }, L); el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: floor }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L);
  for (let x = 0; x < 1600; x += 120) el("path", { d: `M${x} 760 V1000`, stroke: "#00000012", "stroke-width": 4 }, L); }
function homeWin(L, x, y, w, h, night) { el("rect", { x, y, width: w, height: h, rx: 10, fill: night ? "#2E3C6E" : "#BDE3F2", ...S6(6) }, L); el("path", { d: `M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}`, ...S6(5) }, L);
  el("path", { d: `M${x - 20} ${y - 10} Q${x + 20} ${y + h / 2} ${x - 10} ${y + h + 20} L${x - 30} ${y + h + 20} V${y - 10} Z M${x + w + 20} ${y - 10} Q${x + w - 20} ${y + h / 2} ${x + w + 10} ${y + h + 20} L${x + w + 30} ${y + h + 20} V${y - 10} Z`, fill: "#FF9FB8", ...S6(5) }, L); }
const ROOMS4 = {
  リビング(L) { homeRoom(L, "#FFF1E0", "#E3C59A"); homeWin(L, 160, 170, 300, 220);
    el("rect", { x: 1150, y: 360, width: 360, height: 230, rx: 14, fill: "#3A3A46", ...S6(6) }, L); window.__tv = el("rect", { x: 1170, y: 380, width: 320, height: 190, rx: 8, fill: "#5E6A7A" }, L);
    el("rect", { x: 1200, y: 590, width: 260, height: 170, rx: 10, fill: "#C98A4B", ...S6(6) }, L); el("ellipse", { cx: 800, cy: 900, rx: 420, ry: 60, fill: "#FFD9B0", ...S6(5) }, L);
    el("rect", { x: 560, y: 560, width: 380, height: 120, rx: 30, fill: "#7FA7D9", ...S6(6) }, L); el("rect", { x: 540, y: 640, width: 420, height: 100, rx: 30, fill: "#8FB6E4", ...S6(6) }, L); },
  だいどころ(L) { homeRoom(L, "#EFF8EF", "#D9CDB8"); for (let x = 0; x < 1600; x += 80) for (let y = 0; y < 400; y += 80) el("rect", { x, y: y + 160, width: 78, height: 78, fill: (x + y) % 160 ? "#FFFFFF" : "#E3F1E3" }, L);
    el("rect", { x: 820, y: 520, width: 760, height: 240, fill: "#F2E3C2", ...S6(6) }, L); el("rect", { x: 800, y: 500, width: 800, height: 30, rx: 8, fill: "#C98A4B", ...S6(5) }, L); el("rect", { x: 1000, y: 470, width: 160, height: 34, rx: 8, fill: "#B0B7C3", ...S6(5) }, L);
    el("rect", { x: 80, y: 260, width: 240, height: 500, rx: 20, fill: "#FFFFFF", ...S6(6) }, L); el("path", { d: "M80 470 H320 M290 330 V400 M290 520 V600", ...S6(6) }, L); homeWin(L, 520, 150, 220, 170); },
  こどもべや(L) { homeRoom(L, "#EAF2FF", "#E3C59A"); homeWin(L, 160, 160, 260, 220, window.__nightRoom);
    el("rect", { x: 1080, y: 560, width: 460, height: 120, rx: 20, fill: "#FFFFFF", ...S6(6) }, L); el("rect", { x: 1080, y: 620, width: 460, height: 140, rx: 10, fill: "#7FCBF0", ...S6(6) }, L); el("rect", { x: 1060, y: 470, width: 40, height: 290, rx: 10, fill: "#C98A4B", ...S6(6) }, L); el("rect", { x: 1100, y: 540, width: 130, height: 60, rx: 24, fill: "#FFFFFF", ...S6(5) }, L);
    el("rect", { x: 480, y: 640, width: 200, height: 120, rx: 10, fill: "#FFB34D", ...S6(6) }, L); txt(L, 580, 712, "おもちゃ", 30, { "text-anchor": "middle" });
    [[600, 180, "#FFD25E"], [760, 230, "#7BD389"]].forEach(([x, y, c]) => { el("path", { d: `M${x} ${y - 40} L${x + 12} ${y - 12} L${x + 42} ${y - 12} L${x + 18} ${y + 6} L${x + 28} ${y + 36} L${x} ${y + 18} L${x - 28} ${y + 36} L${x - 18} ${y + 6} L${x - 42} ${y - 12} L${x - 12} ${y - 12} Z`, fill: c, ...S6(4) }, L); }); },
  さんすう(L) { classroom(L, "さんすう", L => { txt(L, 560, 380, "3 ＋ 2 ＝ ？", 80, { fill: "#FFFFFF" }); }); },
  "ともだちの いえ"(L) { homeRoom(L, "#FFEFF3", "#E9C893"); homeWin(L, 1180, 170, 280, 210);
    el("rect", { x: 200, y: 160, width: 220, height: 280, rx: 8, fill: "#FFFFFF", ...S6(6) }, L); el("circle", { cx: 310, cy: 270, r: 60, fill: "#FFD25E", ...S6(5) }, L); el("path", { d: "M220 420 L300 330 L360 380 L400 340 L410 420 Z", fill: "#7BD389", ...S6(4) }, L);
    el("ellipse", { cx: 820, cy: 910, rx: 460, ry: 64, fill: "#C9E7FF", ...S6(5) }, L); el("rect", { x: 600, y: 620, width: 420, height: 40, rx: 12, fill: "#C98A4B", ...S6(6) }, L); el("path", { d: "M630 660 V760 M990 660 V760", ...S6(8) }, L); },
};
{ const dr = drawRoom; drawRoom = function (place, noSign = false) {
    if (!S4.includes(curStage)) return dr(place, noSign);
    const R = ROOMS4[place] || (typeof ROOMS3 !== "undefined" && ROOMS3[place]);
    if (!R) return dr(place, noSign);
    sceneLayer.innerHTML = ""; R(sceneLayer);
    if (!noSign) { const g = el("g", {}, sceneLayer); el("rect", { x: 620, y: 24, width: 360, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, place.length > 6 ? 38 : 46, { "text-anchor": "middle" }); }
  }; }

/* ---------- できごとの アニメ ---------- */
const ON4 = ["ocgame", "ocsouji", "ociyana", "octerebi", "ocfuku", "octetsudau", "ockayui", "ocbenkyou", "ocgame2",
  "tdhajime", "tdomocha", "tdonaji", "tdchigau", "tdzuru", "tdbokuno", "tdadana", "tdhazure", "tdnakanaori", "tdsasoi", "tdkatta", "tdkangae",
  "snwait", "snateru", "snpencil", "snnoisy", "snrestless", "snshowme", "sntime", "snletter", "snyes", "snturn"];
ON4.forEach(k => ASK_ON_STAGE.add(k));
["ociyana", "ochitori", "ocyume", "ockayui", "ocsouji", "tdadana", "tdhazure", "snrestless", "snnoisy"].forEach(k => SOFT_INTRO.add(k));
const handP = (c, kind, k = .4, r = 0) => { const g = prop(kind, 0, 0, k); hand(c, g, k, r); return g; };
Object.assign(INTRO, {
  // ---- おうち1 ----
  async ocbotan(h, a) { stay(h); h.armL.t = 50; h.armR.t = -50; hold(h, "shake", 2.4); await sleep(1600); markAbove(h, "q"); h.sadMouth = true; await sleep(700); h.armL.t = h.armR.t = 0; enter(a); await sleep(1000); },
  async ocgame(h, a) { stay(h); window.__pad = handP(h, "pad", .35); hold(h, "shake", 3); for (let i = 0; i < 6; i++) later(i * 250, () => blip(600 + rnd(400), 900, .05, "square")); h.happyOn = true; await sleep(900); a.armR.t = -110; await sleep(700); a.armR.t = 0; },
  async ocsouji(h, a) { handP(a, "vacuum", .6, 10); sway(a, 2600, 6, 500); for (let i = 0; i < 6; i++) later(i * 420, () => noise(.45, 260, .4)); enter(h); await sleep(1000);
    h.armL.t = -165; h.armR.t = 165; h.sadMouth = true; hold(h, "shiver", 2); markAbove(h, "drop"); await sleep(1500); },
  async ociyana(h, a) { h.headY.t = 14; h.sadMouth = true; enter(h); await sleep(1400); markAbove(h, "drop"); await sleep(400); playMove(a, "look"); await sleep(500); },
  async ochitori(h, a) { stay(h); playMove(h, "frustrated"); markAbove(h, "anger"); h.sadMouth = true; await sleep(1400); markAbove(h, "anger"); hold(h, "shiver", 1); await sleep(600); enter(a); await sleep(1000); },
  async ockoppu(h, a) { const c = handP(h, "cup", .35); enter(h); await sleep(1100); c.remove(); const p = world(h, 330, 300); const g = prop("cup", p.x, p.y, .35);
    await tween(400, k => g.setAttribute("transform", `translate(${p.x.toFixed(0)} ${(p.y + (930 - p.y) * k).toFixed(0)}) rotate(${(200 * k).toFixed(0)}) scale(.35)`)); g.remove(); noise(.4, 2500, .8); boom(.3);
    for (let i = 0; i < 7; i++) { const sh = el("path", { d: "M0 0 L22 6 L8 24 Z", fill: "#BDE3F2", ...S6p(3) }, propG); const vx = (Math.random() - .5) * 300; tween(600, k => sh.setAttribute("transform", `translate(${(p.x + vx * k).toFixed(0)} ${(930 - 60 * Math.sin(k * Math.PI)).toFixed(0)}) rotate(${(k * 300).toFixed(0)})`)); }
    surprise(h); markAbove(h, "ex"); await sleep(800); h.sadMouth = true; enter(a); await sleep(1000); },
  async ockutsushita(h, a) { enter(h); await sleep(1000); playMove(h, "look"); hold(h, "shake", 1.2); await sleep(1300); markAbove(h, "q"); await sleep(400); enter(a); await sleep(1000); },
  async octerebi(h, a) { enter(h); h.dx.t = 260; await sleep(1300); playMove(h, "look"); await sleep(600); },
  async ocfuku(h, a) { window.__shirt = handP(a, "shirt", .45); enter(h); await sleep(1100); hold(h, "shake", 1.2); h.sadMouth = true; markAbove(h, "drop"); await sleep(1300); },
  async ocyume(h, a) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#1E2A55", opacity: .45 }, propG); el("circle", { cx: 290, cy: 230, r: 34, fill: "#FFE27A", ...S6p(4) }, propG);
    stay(h); h.tm.closed = 1e6; markAbove(h, "z"); await sleep(1300); delete h.tm.closed; surprise(h); jump(h, .4); h.sadMouth = true; tears(h, 5); await sleep(1000); enter(a); await sleep(1000); },
  async octetsudau(h, a) { handP(a, "pot", .3); hold(a, "run", 2.6); sway(a, 2600, 8, 400); for (let i = 0; i < 3; i++) later(i * 600, () => markAbove(a, "drop", { dx: i % 2 ? 50 : -50 })); enter(h); await sleep(1500); },
  async ockayui(h, a) { stay(h); h.armR.t = 70; hold(h, "shake", 2.4); markAbove(h, "drop"); await sleep(1700); playMove(a, "look"); await sleep(400); },
  async ocbenkyou(h, a) { sit3(a); onDesk(a, "memo", .4); hold(a, "shake", 3); handP(h, "blocks", .4); enter(h); await sleep(1300); playMove(a, "look"); await sleep(400); },
  async ocgame2(h, a) { window.__pad = handP(a, "pad", .35); hold(a, "shake", 3); for (let i = 0; i < 5; i++) later(i * 280, () => blip(600 + rnd(400), 900, .05, "square")); stay(h); await sleep(900);
    for (let i = 0; i < 3; i++) later(i * 400, () => markAbove(h, "drop", { dx: i % 2 ? 50 : -50 })); h.sadMouth = true; await sleep(1000); jump(a, .4); },
  // ---- おともだち1 ----
  async tdhajime(h, a) { a.sadMouth = true; a.headY.t = 12; enter(h); await sleep(1200); wave(h); await sleep(600); playMove(a, "shy"); },
  async tdomocha(h, a) { handP(a, "robot", .45); jump(a, .4); enter(h); await sleep(1200); jump(a, .5); markAbove(a, "sparkle"); await sleep(400); },
  async tdonaji(h, a) { enter(h); await sleep(1100); markAbove(h, "note"); markAbove(a, "note"); for (let i = 0; i < 4; i++) later(i * 160, () => { h.mouthOpen.t = a.mouthOpen.t = i % 2 ? 0 : .5; }); await sleep(700); surprise(h); surprise(a); await sleep(500); },
  async tdchigau(h, a) { a.armR.t = -120; enter(h); await sleep(1100); h.armL.t = -120; markAbove(h, "q"); await sleep(900); a.armR.t = 0; h.armL.t = 0; },
  async tdzuru(h, a) { enter(h); await sleep(1000); for (let i = 0; i < 3; i++) { h.armR.t = a.armR.t = -70; blip(500 + i * 120, 500 + i * 120, .08, "square"); await sleep(260); h.armR.t = a.armR.t = 0; await sleep(200); }
    h.armR.t = -100; await sleep(500); a.armR.t = -100; await sleep(300); jump(a, .5); playMove(a, "laugh"); markAbove(h, "ex"); await sleep(600); h.armR.t = a.armR.t = 0; },
  async tdbokuno(h, a) { const sh = prop("shovel", 900, 900, .5); enter(h); await sleep(1100); a.dx.v = a.dx.t = 600; hold(a, "run", 1); a.dx.t = -170; await sleep(900);
    sh.remove(); window.__sh = handP(a, "shovel", .45); hold(a, "run", .6); a.dx.t = 0; await sleep(700); surprise(h); markAbove(h, "ex"); await sleep(300); },
  async tdadana(h, a) { enter(h); await sleep(1000); playMove(a, "laugh"); a.armR.t = -110; markAbove(a, "note"); await sleep(900); h.sadMouth = true; markAbove(h, "drop"); a.armR.t = 0; await sleep(300); },
  async tdhazure(h, a) { const ks = exKids([960]); enter(h); ks.forEach(c => joy(c)); joy(a); await sleep(1200); playMove(a, "look"); a.armR.t = -80; await sleep(700); h.sadMouth = true; markAbove(h, "drop"); a.armR.t = 0; await sleep(300); },
  async tdnakanaori(h, a) { a.headRot.t = -18; a.armL.t = 40; a.armR.t = -40; markAbove(a, "anger"); h.headY.t = 8; enter(h); await sleep(1400); h.headY.t = 0; },
  async tdsasoi(h, a) { enter(h); await sleep(1100); wave(a); jump(a, .4); await sleep(500); },
  async tdkatta(h, a) { a.dx.v = a.dx.t = -1800; hold(h, "run", 1.2); enter(h); await sleep(700); hold(a, "run", 1.7); a.dx.t = 0; await sleep(1100); jump(h, .4); h.happyOn = true; await sleep(700);
    a.lean.t = 16; for (let i = 0; i < 3; i++) later(i * 300, () => markAbove(a, "drop", { dx: i % 2 ? 50 : -50 })); await sleep(700); h.happyOn = false; },
  async tdkangae(h, a) { prop("gamebox", 720, 600, .45); prop("gameboxb", 860, 600, .45); a.armR.t = -80; enter(h); await sleep(1200); playMove(h, "think"); markAbove(h, "q"); await sleep(900); a.armR.t = 0; },
  // ---- せんせい1 ----
  async snwait(h, a) { const ks = exKids([1000]); markAbove(a, "note"); enter(h); await sleep(1200); playMove(h, "look"); markAbove(h, "drop"); await sleep(1300); ks.forEach(c => wave(c)); playMove(a, "look"); await sleep(400); },
  async snateru(h, a) { desk3(h, ...exKids([940])); a.armR.t = -90; await sleep(900); h.armR.t = -160; markAbove(h, "ex"); await sleep(800); a.armR.t = 0; },
  async snpencil(h, a) { desk3(h); onDesk(h, "memo", .4); hold(h, "shake", 1.4); await sleep(1400); noise(.08, 2500, .8); blip(1800, 600, .06, "square"); surprise(h); markAbove(h, "ex"); await sleep(700); playMove(a, "look"); },
  async snnoisy(h, a) { place(a, 1290, 975, 1.0); const ks = [xtra("gao", 830, .66), xtra("tora", 1010, .64)]; desk3(h, ...ks); for (let i = 0; i < 6; i++) later(i * 300, () => { const c = ks[i % ks.length]; if (c) { markAbove(c, "note"); jump(c, .25); } blip(500 + rnd(500), 700, .05, "triangle"); });
    await sleep(900); h.armL.t = -165; h.armR.t = 165; h.sadMouth = true; await sleep(1200); },
  async snrestless(h, a) { desk3(h); hold(h, "shiver", 2.6); for (let i = 0; i < 3; i++) later(i * 450, () => markAbove(h, "drop", { dx: i % 2 ? 60 : -60 })); await sleep(1900); playMove(a, "look"); },
  async snshowme(h, a) { desk3(h); onDesk(h, "origami", .35); const o = handP(a, "origami", .4); a.armR.t = -60; await sleep(500);
    await tween(800, k => o.firstChild && o.setAttribute("transform", o.getAttribute("transform").replace(/rotate\([^)]*\)/, `rotate(${(180 * k).toFixed(0)})`))); a.armR.t = 0; markAbove(h, "q"); await sleep(700); },
  async sntime(h, a) { desk3(h); onDesk(h, "memo", .4); hold(h, "shake", 2.6); await sleep(1000); ring3(); await sleep(700); a.armR.t = -120; markAbove(h, "ex"); h.sadMouth = true; await sleep(700); },
  async snletter(h, a) { window.__lt = handP(h, "letter", .38); enter(h); await sleep(1200); playMove(a, "look"); await sleep(400); },
  async snoops(h, a) { desk3(h); const c = onDesk(h, "cup", .3, 60); await sleep(700); h.lean.t = 14; await sleep(250); h.lean.t = -6; c.remove(); noise(.3, 900, .4); { const cx = h.x + 200 * h.s, pd = el("g", {}, front()); el("ellipse", { cx: cx + 170, cy: 1000, rx: 130, ry: 24, fill: "#9AD7FF", stroke: "#5BB0E0", "stroke-width": 4 }, pd); txt(pd, cx + 230, 990, "🥤", 60, { "text-anchor": "middle", transform: `rotate(80 ${cx + 230} 970)` }); }
    const d = h.__desk.firstChild, y = +d.getAttribute("y"), x = +d.getAttribute("x") + +d.getAttribute("width"); const pd = el("g", { transform: `translate(${(x + 30).toFixed(0)} ${(y + 230).toFixed(0)}) scale(.6)` }, front()); ITEM2.puddle(pd);
    h.lean.t = 0; surprise(h); await sleep(700); enter(a); await sleep(900); },
  async snbox(h, a) { await INTRO.heavy(h, a); },
  async snyes(h, a) { desk3(h, ...exKids([940])); a.armR.t = -110; markAbove(a, "note"); await sleep(1000); a.armR.t = 0; },
  async snturn(h, a) { const ks = exKids([940]); desk3(h, ...ks); [h, ...ks].forEach(c => onDesk(c, "kbook", .42)); ks.forEach(c => markAbove(c, "note")); await sleep(1300); playMove(a, "look"); await sleep(500); markAbove(h, "q"); await sleep(400); },
});
Object.assign(POST, {
  async ocbotan(h, a) { await walk(a, -330, 800); a.armR.t = -60; hold(h, "shake", 1); await sleep(1000); a.armR.t = 0; h.sadMouth = false; joy(h); await sleep(400); },
  async ocofuro(h, a) { playMove(a, "nod"); hold(h, "shake", 1.4); await sleep(1500); h.happyOn = false; if (window.__pad) window.__pad.remove(); joy(h); await sleep(400); },
  async ocsouji(h, a) { playMove(a, "nod"); h.armL.t = h.armR.t = 0; h.sadMouth = false; await walk(h, -700, 900); },
  async ociyana(h, a) { await walk(a, -330, 800); h.headY.t = 0; await sleep(400); playMove(h, "nod"); await sleep(400); },
  async ochitori(h, a) { playMove(a, "nod"); await walk(a, 800, 1000); h.sadMouth = false; await sleep(300); },
  async ockoppu(h, a) { playMove(a, "nod"); h.sadMouth = false; await sleep(700); },
  async ockutsushita(h, a) { playMove(a, "crouch"); await sleep(500); handP(a, "sock", .35); await walk(a, -260, 700); handP(h, "sock", .35); joy(h); await sleep(400); },
  async octerebi(h, a) { playMove(a, "nod"); if (window.__tv) window.__tv.setAttribute("fill", "#9FD8F5"); blip(400, 1200, .3, "sine"); h.happyOn = true; await sleep(800); },
  async ocfuku(h, a) { playMove(a, "nod"); if (window.__shirt) window.__shirt.remove(); handP(a, "shirtb", .45); await walk(a, -300, 800); h.sadMouth = false; joy(h); await sleep(400); },
  async ocyume(h, a) { await walk(a, -300, 800); h.sadMouth = false; await sleep(300); h.happyOn = true; await sleep(600); },
  async octetsudai(h, a) { a.happyOn = true; handP(h, "chopsticks", .35); joy(h); await sleep(600); },
  async ockayui(h, a) { await walk(a, -330, 800); h.armR.t = 0; await sleep(500); joy(h); await sleep(300); },
  async ocbenkyou(h, a) { playMove(a, "nod"); joy(h); await sleep(600); },
  async ocgame2(h, a) { if (window.__pad) window.__pad.remove(); handP(h, "pad", .35); h.sadMouth = false; playMove(a, "bow"); joy(h); await sleep(600); },
  async tdhajime(h, a) { a.sadMouth = false; a.headY.t = 0; joy(a); joy(h); await sleep(600); },
  async tdomocha(h, a) { joy(h); joy(a); await sleep(600); },
  async tdonaji(h, a) { playMove(h, "nod"); a.happyOn = true; await sleep(700); },
  async tdchigau(h, a) { joy(a); joy(h); await sleep(400); walk(a, -900, 1600); await walk(h, -900, 1600); },
  async tdzuru(h, a) { playMove(a, "frustrated"); await sleep(700); playMove(a, "nod"); await sleep(300); },
  async tdbokuno(h, a) { if (window.__sh) window.__sh.remove(); handP(h, "shovel", .45); playMove(a, "bow"); await sleep(600); },
  async tdadana(h, a) { playMove(a, "bow"); h.sadMouth = false; await sleep(600); },
  async tdhazure(h, a) { playMove(a, "shy"); h.sadMouth = false; joy(h); ((CUR_S && CUR_S.extras) || []).forEach(k => joy(C[k])); await sleep(600); },
  async tdnakanaori(h, a) { a.headRot.t = 0; a.armL.t = a.armR.t = 0; joy(a); joy(h); await sleep(600); },
  async tdsasoi(h, a) { wave(a); wave(h); await sleep(700); },
  async tdkatta(h, a) { a.lean.t = 0; joy(a); joy(h); await sleep(600); },
  async tdkangae(h, a) { playMove(a, "nod"); await sleep(500); markAbove(h, "sparkle"); await sleep(400); },
  async snmachi(h, a) { playMove(a, "nod"); await sleep(600); },
  async snateru(h, a) { h.armR.t = 0; for (let i = 0; i < 4; i++) later(i * 200, () => markAbove(h, "sparkle", { dx: (i - 1.5) * 40 })); h.happyOn = true; await sleep(900); },
  async snenpitsu(h, a) { playMove(a, "nod"); if (h.__desk) h.__desk.remove(); await walk(h, -700, 900); },
  async snurusai(h, a) { a.armR.t = -60; await sleep(500); a.armR.t = 0; ((CUR_S && CUR_S.extras) || []).forEach(k => playMove(C[k], "shy")); h.armL.t = h.armR.t = 0; h.sadMouth = false; await sleep(600); },
  async snochitsuku(h, a) { playMove(a, "nod"); if (h.__desk) h.__desk.remove(); await walk(h, -700, 1000); },
  async snmisete(h, a) { await walk(a, -260, 800); a.armR.t = -60; await sleep(600); a.armR.t = 0; markAbove(h, "sparkle"); await sleep(400); },
  async snjikan(h, a) { a.armR.t = 0; playMove(a, "nod"); hold(h, "shake", 1.5); h.sadMouth = false; await sleep(1500); },
  async sntegami(h, a) { await walk(h, 250, 800); if (window.__lt) window.__lt.remove(); handP(a, "letter", .38); playMove(a, "nod"); await sleep(500); },
  async snwazato(h, a) { playMove(a, "nod"); handP(a, "rag", .3); h.sadMouth = false; await sleep(700); },
  async snnimotsu(h, a) { await walk(h, 330, 900); const bs = window.__boxes; if (bs) { bs[1].c = h; bs[1].n = 0; } a.squash.t = 1; joy(a); await sleep(900); walk(h, 1000, 2000); await walk(a, 1000, 2000); },
  async snhai(h, a) { onDesk(h, "memo", .4); playMove(a, "nod"); await sleep(600); },
  async snjunban(h, a) { playMove(a, "nod"); markAbove(h, "note"); await sleep(600); },
});

/* ---------- 盤 ---------- */
STAGE_DEF.ouchi1 = { ground: "#F3E3C8", sky: "#FFF1E0", names: ["こどもべや", "こどもべや", "リビング", "リビング", "リビング", "だいどころ", "だいどころ", "こどもべや", "リビング"],
  fills: { こどもべや: "#D7ECFF", リビング: "#FFE3B3", だいどころ: "#D7F0D2" } };
STAGE_DEF.tomodachi1 = { ground: "#BFE3A6", sky: "#CFEAFB", names: ["ともだちの いえ", "ともだちの いえ", "ベンチ", "すなば", "すなば", "すべりだい", "ベンチ", "すべりだい", "ベンチ"],
  fills: { "ともだちの いえ": "#FFE0E6", ベンチ: "#F1EAD8", すなば: "#F6E7B8", すべりだい: "#FFE3B3" } };
STAGE_DEF.sensei1 = { ground: "#F6E7C8", sky: "#CFEAFB", names: ["あさの かい", "あさの かい", "こくご", "こくご", "さんすう", "さんすう", "やすみじかん", "ろうか", "こくご"],
  fills: { "あさの かい": "#FFE3B3", こくご: "#FFE0E6", さんすう: "#D7ECFF", やすみじかん: "#D7F0D2", ろうか: "#EEE6FA" } };
/* おうち1：いえの なかを ぐるっと（こどもべや → リビング → だいどころ → こどもべや → リビング） */
{ const n = {}, pl = {}, nx = {};
  chain(["0", "1", "2", "3", "4", "f1"], [[220, 880], [420, 900], [620, 900], [820, 900], [1020, 900], [1220, 880]], "こどもべや", n, pl); pl["3"] = pl["4"] = pl.f1 = "リビング";
  chain(["a1", "a2", "a3"], [[1400, 760], [1420, 580], [1300, 420]], "リビング", n, pl);
  chain(["b1", "b2"], [[1120, 700], [1000, 560]], "リビング", n, pl);
  chain(["m1", "m2", "f2"], [[1100, 340], [880, 300], [660, 320]], "だいどころ", n, pl);
  chain(["c1", "c2", "c3"], [[440, 360], [300, 500], [380, 660]], "こどもべや", n, pl);
  chain(["d1"], [[620, 520]], "だいどころ", n, pl);
  n["15"] = [600, 700, "goal"]; pl["15"] = "リビング"; n["0"].push("start"); n["4"].push("block");
  linkLine(nx, ["0", "1", "2", "3", "4", "f1", "a1", "a2", "a3", "m1", "m2", "f2", "c1", "c2", "c3", "15"]); linkLine(nx, ["f1", "b1", "b2", "m1"]); linkLine(nx, ["f2", "d1", "15"]);
  BOARD.ouchi1 = { nodes: n, place: pl, next: nx, away: [1300, 760], style: (a, b) => ["b1", "b2", "d1"].includes(a) || ["b1", "d1"].includes(b) ? "hall" : "classwood",
    labels: [["こどもべや", 260, 990], ["リビング", 1470, 330], ["だいどころ", 880, 200]] }; }
/* おともだち1：こうえん（ともだちの いえ → ベンチ → すなば → すべりだい） */
{ const n = {}, pl = {}, nx = {};
  chain(["0", "1", "2", "3", "4", "f1"], [[200, 900], [400, 900], [600, 900], [800, 900], [1000, 900], [1200, 860]], "ともだちの いえ", n, pl); pl["2"] = pl["3"] = "ベンチ"; pl["4"] = pl.f1 = "すなば";
  chain(["a1", "a2", "a3", "a4"], [[1400, 760], [1440, 600], [1300, 500], [1100, 470]], "すべりだい", n, pl);
  chain(["b1", "b2"], [[1100, 720], [920, 620]], "すなば", n, pl);
  chain(["m1", "m2", "f2"], [[900, 470], [700, 500], [500, 480]], "ベンチ", n, pl);
  chain(["c1", "c2", "c3"], [[360, 380], [460, 250], [680, 220]], "すべりだい", n, pl);
  chain(["d1"], [[700, 340]], "ベンチ", n, pl);
  chain(["e1", "e2"], [[880, 240], [1080, 240]], "ともだちの いえ", n, pl);
  n["15"] = [1290, 250, "goal"]; pl["15"] = "ともだちの いえ"; n["0"].push("start"); n["4"].push("block");
  linkLine(nx, ["0", "1", "2", "3", "4", "f1", "a1", "a2", "a3", "a4", "m1", "m2", "f2", "c1", "c2", "c3", "e1", "e2", "15"]); linkLine(nx, ["f1", "b1", "b2", "m1"]); linkLine(nx, ["f2", "d1", "e1"]);
  BOARD.tomodachi1 = { nodes: n, place: pl, next: nx, away: [1000, 760], style: (a, b) => ["b1", "b2", "d1"].includes(a) || ["b1", "d1"].includes(b) ? "sand" : "park",
    labels: [["ともだちの いえ", 260, 990], ["ベンチ", 700, 990], ["すべりだい", 1460, 420], ["すなば", 980, 560], ["ともだちの いえ", 1080, 160]] }; }
/* せんせい1：きょうしつの 1にち */
{ const n = {}, pl = {}, nx = {}; const T = arcPts(800, 560, 600, 330, [150, 128, 106, 84, 62, 40, 18, -6]);
  chain(["0", "1", "2", "3", "4", "f1", "a1", "a2"], T, "あさの かい", n, pl); pl["3"] = pl["4"] = pl.f1 = "こくご"; pl.a1 = pl.a2 = "さんすう";
  chain(["a3", "a4", "a5"], arcPts(800, 560, 600, 330, [-30, -55, -80]), "さんすう", n, pl);
  chain(["b1", "b2"], [[1150, 600], [960, 560]], "ろうか", n, pl);
  chain(["m1", "m2", "f2"], arcPts(800, 560, 600, 330, [-105, -130, -155]), "やすみじかん", n, pl);
  chain(["c1", "c2"], arcPts(800, 560, 600, 330, [-180, -205]), "こくご", n, pl);
  chain(["d1"], [[560, 420]], "ろうか", n, pl);
  n["15"] = [800, 560, "goal"]; pl["15"] = "こくご"; n["0"].push("start"); n["4"].push("block");
  linkLine(nx, ["0", "1", "2", "3", "4", "f1", "a1", "a2", "a3", "a4", "a5", "m1", "m2", "f2", "c1", "c2", "15"]); linkLine(nx, ["f1", "b1", "b2", "m1"]); linkLine(nx, ["f2", "d1", "15"]);
  BOARD.sensei1 = { nodes: n, place: pl, next: nx, away: [300, 760], style: (a, b) => ["b1", "b2", "d1"].includes(a) || ["b1", "d1"].includes(b) ? "hall" : "classwood",
    labels: [["あさの かい", 300, 990], ["こくご", 900, 990], ["さんすう", 1480, 520], ["やすみじかん", 800, 150], ["ろうか", 1150, 680]] }; }
Object.assign(BOARD_BG, {
  ouchi1(L) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#F3E3C8" }, L); for (let x = 0; x < 1600; x += 100) el("path", { d: `M${x} 0 V1000`, stroke: "#00000010", "stroke-width": 4 }, L);
    [[60, 760, 520, 230, "#D7ECFF"], [1180, 300, 400, 560, "#FFE9C7"], [560, 160, 640, 260, "#E3F5DF"]].forEach(([x, y, w, h, c]) => el("rect", { x, y, width: w, height: h, rx: 30, fill: c, ...S6(5) }, L));
    el("rect", { x: 60, y: 40, width: 360, height: 110, rx: 10, fill: "#FFFFFF", ...S6(6) }, L); txt(L, 240, 115, "おうち1", 48, { "text-anchor": "middle" });
    el("path", { d: "M1300 160 L1400 80 L1500 160 Z", fill: "#E8735A", ...S6(5) }, L); el("rect", { x: 1320, y: 160, width: 160, height: 100, fill: "#FFF1D6", ...S6(5) }, L); },
  tomodachi1(L) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#BFE3A6" }, L); el("rect", { x: 0, y: 0, width: 1600, height: 130, fill: "#CFEAFB" }, L); cloud(L, 300, 70); cloud(L, 1200, 60, .8);
    el("ellipse", { cx: 1000, cy: 600, rx: 200, ry: 110, fill: "#F6E2A8", ...S6(5) }, L); [[180, 560], [1500, 260], [600, 640]].forEach(([x, y]) => tree2(L, x, y, 40));
    el("rect", { x: 60, y: 760, width: 180, height: 120, fill: "#FFE0E6", ...S6(5) }, L); el("path", { d: "M44 760 L150 690 L256 760 Z", fill: "#7FA7D9", ...S6(5) }, L); txt(L, 800, 100, "おともだち1", 48, { "text-anchor": "middle" }); },
  sensei1(L) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFF6E0" }, L); el("ellipse", { cx: 800, cy: 560, rx: 700, ry: 420, fill: "#F6E7C8", ...S6(6) }, L);
    el("rect", { x: 620, y: 470, width: 360, height: 180, rx: 10, fill: "#2F6B4F", ...S6(6) }, L); txt(L, 800, 580, "せんせい1", 52, { "text-anchor": "middle", fill: "#FFFFFF" }); },
});
BLOCK_DEF.ouchi1 = { who: "onii", sleep: false, intro: ["p_blk_ouchi1", "おにいちゃんが ろうかで まんがを よんで いるよ"], say: ["blk_ouchi1", "おにいちゃん、ちょっと とおして"], to: "おにいちゃんに いおう",
  keys: [["とおして", "通して"]], res: ["rs_ouchi1", "おっと、ごめん ごめん。どうぞ"] };
BLOCK_DEF.tomodachi1 = { who: "kuma", sleep: false, intro: ["p_blk_tomodachi1", "くまくんが みちに すわって いるよ"], say: ["blk_tomodachi1", "となりを とおっても いい？"], to: "くまたに いおう",
  keys: [["とおって", "通って"], ["いい", "良い"]], res: ["rs_tomodachi1", "うん、どうぞ"] };
BLOCK_DEF.sensei1 = { who: "meebaa", sleep: false, intro: ["p_blk_sensei1", "めえばあせんせいが いるよ。あいさつ しよう！"], say: ["blk_sensei1", "めえばあせんせい、こんにちは"], to: "めえばあせんせいに いおう",
  keys: [["こんにちは", "今日は"]], res: ["rs_sensei1", "はい、こんにちは。げんきね"] };
S4.forEach(st => SLEEPER_OF[st] = BLOCK_DEF[st].who);
Object.assign(EVENTS, {
  ouchi1: { a2: ["fwd", 2, "ev_ouchif", "おてつだいで ほめられた！ 2マス すすむよ"], m2: ["back", 2, "ev_ouchib", "おもちゃを ふんじゃった！ 2マス もどるよ"], d1: ["home", 0, "ev_ouchih", "ランドセルの なかみを ぶちまけた！ スタートに もどるよ"] },
  tomodachi1: { a2: ["fwd", 3, "ev_tomof", "あたらしい ともだちが できた！ 3マス すすむよ"], m2: ["back", 2, "ev_tomob", "ボールが ころがって いった！ 2マス もどるよ"], d1: ["home", 0, "ev_tomoh", "ぼうしを わすれた！ スタートに もどるよ"] },
  sensei1: { a2: ["fwd", 2, "ev_senseif", "せんせいに ほめられた！ 2マス すすむよ"], m2: ["back", 2, "ev_senseib", "けしゴムを おとした！ 2マス もどるよ"], d1: ["home", 0, "ev_senseih", "れんらくちょうを わすれた！ スタートに もどるよ"] },
});
