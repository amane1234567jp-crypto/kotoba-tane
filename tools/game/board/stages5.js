/* ================= ステージ「ともだちの いえ」「こうえん2」「となりの せき」（2026-10-17） =================
   台本は sit/sits_new4.py。ともだちの いえ＝ぱんなの いえ（ぱんな・ぱんなの ママ・くまた）、
   こうえん2＝ともだちどうしで あそぶ、となりの せき＝きょうしつの となり・うしろの 子。 */
const S5 = ["ie1", "kouen2", "seki1"];
Object.assign(RIVAL_OF, { ie1: "chu", kouen2: "mii", seki1: "gao" });
Object.assign(KID_S, { pyonmama: 1.0, gaojii: 1.0, panna: .9, pannamama: 1.0 }); PIECE_S.panna = .22;

/* ---------- 物の 絵 ---------- */
Object.assign(ITEM2, {
  toycar(g, miss = false) { el("path", { d: "M-90 10 L-70 -30 L-20 -50 L40 -50 L70 -30 L90 10 Z", fill: "#E8473C", ...S6p(5) }, g); el("rect", { x: -100, y: 0, width: 200, height: 44, rx: 14, fill: "#FF6F91", ...S6p(5) }, g);
    el("rect", { x: -50, y: -40, width: 50, height: 30, rx: 6, fill: "#BDE3F2", ...S6p(3) }, g); (miss ? [-55] : [-55, 55]).forEach(x => { el("circle", { cx: x, cy: 46, r: 22, fill: "#3A3A46", ...S6p(4) }, g); el("circle", { cx: x, cy: 46, r: 8, fill: "#C9CED6" }, g); }); },
  toycar3(g) { ITEM2.toycar(g, true); }, // タイヤが ひとつ とれた くるま
  juice(g) { el("path", { d: "M-36 -60 H36 L28 50 H-28 Z", fill: "#FFB34D", ...S6p(5) }, g); el("path", { d: "M-33 -30 H33", stroke: "#FFFFFF", "stroke-width": 10, opacity: .6 }, g); el("path", { d: "M10 -60 L24 -100", ...S6p(5) }, g); },
  crayons(g) { el("rect", { x: -70, y: -30, width: 140, height: 70, rx: 8, fill: "#FFD25E", ...S6p(5) }, g); ["#E8473C", "#7FCBF0", "#7BD389", "#B9A8D9", "#FF8FA3"].forEach((c, i) => el("rect", { x: -58 + i * 24, y: -56, width: 16, height: 50, rx: 4, fill: c, ...S6p(3) }, g)); },
  prints(g) { [[-8, 8], [-4, 4], [0, 0]].forEach(([dx, dy]) => el("rect", { x: -60 + dx, y: -80 + dy, width: 120, height: 160, rx: 6, fill: "#FFFFFF", ...S6p(4) }, g)); [-50, -25, 0, 25].forEach(y => el("path", { d: `M-40 ${y} H40`, stroke: "#9DB2E8", "stroke-width": 6, "stroke-linecap": "round" }, g)); },
  pencil(g) { el("rect", { x: -12, y: -90, width: 24, height: 150, rx: 4, fill: "#FFD25E", ...S6p(4) }, g); el("path", { d: "M-12 60 L0 95 L12 60 Z", fill: "#F2C38F", ...S6p(4) }, g); el("rect", { x: -12, y: -100, width: 24, height: 20, rx: 4, fill: "#FF8FA3", ...S6p(4) }, g); },
  rag(g) { el("path", { d: "M-70 -40 Q0 -60 70 -40 L60 40 Q0 60 -60 40 Z", fill: "#BDE3F2", ...S6p(5) }, g); el("path", { d: "M-40 -20 H40 M-40 10 H40", stroke: "#7FCBF0", "stroke-width": 6 }, g); },
  shoes(g) { [-40, 20].forEach(x => { el("path", { d: `M${x} 0 Q${x - 10} -40 ${x + 20} -40 Q${x + 60} -40 ${x + 60} 0 Z`, fill: "#7FCBF0", ...S6p(4) }, g); el("path", { d: `M${x + 10} -30 H${x + 40}`, stroke: "#FFFFFF", "stroke-width": 5 }, g); }); },
  puddle2(g) { el("path", { d: "M-110 0 Q-90 -22 -30 -16 Q30 -28 80 -14 Q120 0 100 12 Q40 22 -30 18 Q-110 20 -110 0 Z", fill: "#FFB34D", opacity: .85, ...S6p(4) }, g); },
});

/* ---------- へや ---------- */
const ROOMS5 = {
  げんかん(L) { homeRoom(L, "#FFF6E8", "#E3C59A"); el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#D9D3C7" }, L); el("rect", { x: 760, y: 700, width: 840, height: 300, fill: "#E3C59A", ...S6(6) }, L); // たたき と あがりかまち
    el("rect", { x: 40, y: 200, width: 300, height: 560, rx: 10, fill: "#B97A4A", ...S6(6) }, L); el("rect", { x: 80, y: 260, width: 100, height: 140, rx: 8, fill: "#BDE3F2", ...S6(5) }, L); el("circle", { cx: 300, cy: 500, r: 12, fill: "#FFD25E", ...S6(4) }, L); // ドア
    el("rect", { x: 420, y: 480, width: 260, height: 280, rx: 10, fill: "#F2E3C2", ...S6(6) }, L); [540, 640].forEach(y => el("path", { d: `M420 ${y} H680`, ...S6(5) }, L)); [[450, 520, "#E8473C"], [560, 520, "#7FCBF0"], [450, 620, "#7BD389"], [560, 620, "#FFD25E"]].forEach(([x, y, c]) => el("ellipse", { cx: x + 40, cy: y + 10, rx: 36, ry: 12, fill: c, ...S6(3) }, L)); // げたばこ
    el("rect", { x: 1300, y: 180, width: 220, height: 170, rx: 14, fill: "#FFFFFF", ...S6(5) }, L); el("path", { d: "M1330 260 Q1410 200 1490 260 Q1410 320 1330 260 Z", fill: "#FF9FB8", ...S6(4) }, L); txt(L, 1410, 230, "ぱんな", 30, { "text-anchor": "middle" });
    el("rect", { x: 1440, y: 560, width: 70, height: 140, rx: 10, fill: "#7FA7D9", ...S6(5) }, L); el("path", { d: "M1460 560 V470 M1495 560 V480", ...S6(6) }, L); },
  "ともだちの へや"(L) { homeRoom(L, "#FFEFF3", "#E9C893"); homeWin(L, 1180, 170, 280, 210);
    el("rect", { x: 120, y: 520, width: 460, height: 120, rx: 20, fill: "#FFFFFF", ...S6(6) }, L); el("rect", { x: 120, y: 580, width: 460, height: 140, rx: 10, fill: "#FF9FB8", ...S6(6) }, L); el("rect", { x: 100, y: 430, width: 40, height: 290, rx: 10, fill: "#C98A4B", ...S6(6) }, L); // ベッド
    el("rect", { x: 700, y: 400, width: 340, height: 360, rx: 10, fill: "#F2E3C2", ...S6(6) }, L); [520, 640].forEach(y => el("path", { d: `M700 ${y} H1040`, ...S6(5) }, L)); // たな
    [[740, 470, "#7BD389"], [800, 470, "#FFD25E"], [860, 470, "#7FCBF0"]].forEach(([x, y, c]) => el("rect", { x, y, width: 46, height: 46, rx: 6, fill: c, ...S6(4) }, L)); el("circle", { cx: 960, cy: 490, r: 28, fill: "#FF8FA3", ...S6(4) }, L);
    el("rect", { x: 730, y: 560, width: 140, height: 70, rx: 8, fill: "#B9A8D9", ...S6(4) }, L); el("rect", { x: 900, y: 560, width: 110, height: 70, rx: 8, fill: "#FFB34D", ...S6(4) }, L);
    el("ellipse", { cx: 820, cy: 910, rx: 420, ry: 60, fill: "#FFD9E6", ...S6(5) }, L); },
  ダイニング(L) { homeRoom(L, "#FFF8E6", "#D9CDB8"); homeWin(L, 160, 160, 260, 200);
    el("rect", { x: 1180, y: 300, width: 400, height: 460, fill: "#F2E3C2", ...S6(6) }, L); el("rect", { x: 1160, y: 280, width: 440, height: 30, rx: 8, fill: "#C98A4B", ...S6(5) }, L); [[1230, 400], [1420, 400]].forEach(([x, y]) => el("rect", { x, y, width: 120, height: 100, rx: 8, fill: "#FFFFFF", ...S6(4) }, L)); // キッチン
    el("rect", { x: 420, y: 600, width: 640, height: 40, rx: 12, fill: "#C98A4B", ...S6(6) }, L); el("path", { d: "M460 640 V760 M1020 640 V760", ...S6(8) }, L); // テーブル
    [[380, 560], [1080, 560]].forEach(([x, y]) => { el("rect", { x: x - 40, y, width: 80, height: 24, rx: 8, fill: "#D9A066", ...S6(4) }, L); el("path", { d: `M${x - 30} ${y + 24} V760 M${x + 30} ${y + 24} V760`, ...S6(6) }, L); });
    el("rect", { x: 560, y: 180, width: 240, height: 120, rx: 14, fill: "#FFFFFF", ...S6(5) }, L); [600, 680, 760].forEach(x => el("circle", { cx: x, cy: 240, r: 22, fill: ["#FF8FA3", "#FFD25E", "#7BD389"][(x / 80) % 3 | 0], ...S6(3) }, L)); },
  ひろば(L) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#CFEAFB" }, L); el("circle", { cx: 1460, cy: 120, r: 60, fill: "#FFE27A", ...S6(5) }, L); cloud(L, 260, 140); cloud(L, 800, 90, .8);
    el("rect", { x: 0, y: 620, width: 1600, height: 380, fill: "#B9DE9F" }, L); el("path", { d: "M0 620 H1600", ...S6(5) }, L);
    for (let x = 40; x < 1600; x += 110) { el("path", { d: `M${x} 620 V540`, ...S6(6) }, L); } el("path", { d: "M0 560 H1600 M0 600 H1600", ...S6(5) }, L); // さく
    sceneTree(L, 1480, 120); sceneTree(L, 120, 100); [500, 900, 1250].forEach((x, i) => flower(L, x, 700 + (i % 2) * 40, ["#FF8FA3", "#FFD25E", "#B9A8D9"][i]));
    el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#9FD68A" }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L); },
};
{ const dr = drawRoom; drawRoom = function (place, noSign = false) {
    const R = S5.includes(curStage) && (ROOMS5[place] || (typeof ROOMS3 !== "undefined" && ROOMS3[place])); if (!R) return dr(place, noSign);
    sceneLayer.innerHTML = ""; R(sceneLayer);
    if (!noSign) { const g = el("g", {}, sceneLayer); el("rect", { x: 620, y: 24, width: 360, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, place.length > 6 ? 38 : 46, { "text-anchor": "middle" }); }
  }; }

/* ---------- できごとの アニメ ---------- */
const ON5 = ["ieojama", "ieheya", "iekashite", "iekowashita", "iejuice", "ieippai", "ietoire", "iechigau", "iekaeri", "iematane",
  "kpjanken", "kpyasumu", "kpbetsuno", "kptotte", "kptotte2", "kpkoronda", "kpjunban", "kpiyada", "kpmizu", "kpbokumo",
  "skochita", "skenpitsu", "skkaesu", "sktsukue", "skpage", "skprint", "skmawasu", "skatodene", "sknaiteru", "skmisete", "sknani", "skhiji"];
ON5.forEach(k => ASK_ON_STAGE.add(k));
["iekowashita", "iekoboshita", "kpkoronda", "kpiyada", "sknaiteru", "skhiji"].forEach(k => SOFT_INTRO.add(k));
const hp5 = (c, kind, k = .4, r = 0) => { const g = prop(kind, 0, 0, k); hand(c, g, k, r); return g; };
const doorbell = () => { if (!ctx) return; blip(1320, 1320, .25, "sine"); later(300, () => blip(1050, 1050, .4, "sine")); };
const slideDesk = (c, dx, ms = 600) => { const d = c.__desk; if (!d) return; const x0 = +(d.dataset.dx || 0); return tween(ms, k => { const x = x0 + dx * k; d.setAttribute("transform", `translate(${x.toFixed(0)} 0)`); d.dataset.dx = x; }); };
Object.assign(INTRO, {
  // ---- ともだちの いえ ----
  async ieaisatsu(h, a) { enter(h); await sleep(1100); doorbell(); h.armR.t = -70; await sleep(900); h.armR.t = 0; enter(a); await sleep(1000); wave(a); await sleep(500); },
  async ieojama(h, a) { enter(h); await sleep(1100); a.armR.t = -70; markAbove(a, "note"); await sleep(700); a.armR.t = 0; },
  async ieheya(h, a) { const d = el("g", {}, propG); el("rect", { x: 1040, y: 200, width: 320, height: 560, rx: 10, fill: "#B97A4A", ...S6(6) }, d); el("circle", { cx: 1080, cy: 500, r: 12, fill: "#FFD25E", ...S6(4) }, d); window.__door = d;
    enter(h); await sleep(1100); knock(); h.armR.t = -80; await sleep(400); h.armR.t = -60; await sleep(400); h.armR.t = 0; await sleep(300); },
  async iekashite(h, a) { window.__car = hp5(a, "toycar", .55); jump(a, .4); enter(h); await sleep(1200); markAbove(h, "sparkle"); jump(a, .4); a.armR.t = -40; await sleep(600); a.armR.t = 0; },
  async iekowashita(h, a) { const c = hp5(h, "toycar", .4); enter(h); await sleep(1100); hold(h, "shake", 1); await sleep(900); noise(.1, 1500, .6); c.remove(); window.__car = hp5(h, "toycar3", .4);
    const p = world(h, 330, 300); const w = prop("wheel", p.x, p.y, .3); tween(500, k => w.setAttribute("transform", `translate(${(p.x + 120 * k).toFixed(0)} ${(p.y + (940 - p.y) * k).toFixed(0)}) rotate(${(300 * k).toFixed(0)}) scale(.3)`)); window.__wheel = w;
    surprise(h); markAbove(h, "ex"); await sleep(700); h.sadMouth = true; playMove(a, "look"); await sleep(500); },
  async iejuice(h, a) { window.__cup = hp5(a, "juice", .4); enter(h); await sleep(1100); a.armR.t = -50; playMove(a, "look"); await sleep(600); a.armR.t = 0; },
  async ieippai(h, a) { prop("cookies", 740, 600, .5); prop("juice", 940, 585, .35); enter(h); await sleep(1100); h.armL.t = 50; h.armR.t = -50; markAbove(h, "note"); await sleep(900); playMove(a, "look"); },
  async ietoire(h, a) { enter(h); await sleep(1000); hold(h, "shiver", 2.2); h.armL.t = 40; h.armR.t = -40; markAbove(h, "drop"); await sleep(1400); playMove(a, "look"); await sleep(300); },
  async iekoboshita(h, a) { const cup = prop("juice", 740, 585, .35); enter(h); await sleep(1100); h.armR.t = -60; await sleep(300); noise(.3, 900, .4);
    await tween(300, k => cup.setAttribute("transform", `translate(${(740 + 60 * k).toFixed(0)} ${(585 + 20 * k).toFixed(0)}) rotate(${(95 * k).toFixed(0)}) scale(.35)`)); window.__pd = prop("puddle2", 860, 612, .6); h.armR.t = 0; surprise(h); markAbove(h, "ex"); await sleep(600); h.sadMouth = true; enter(a); await sleep(1000); },
  async iekumata(h, a) { prop("blocks", 760, 920, .5); enter(h); await sleep(1000); enter(a); await sleep(1000); wave(a); jump(a, .4); await sleep(500); },
  async iechigau(h, a) { prop("blocks", 820, 920, .5); window.__cr = hp5(a, "crayons", .4); enter(h); await sleep(1100); a.armR.t = -80; jump(a, .3); await sleep(700); a.armR.t = 0; playMove(h, "think"); markAbove(h, "q"); await sleep(500); },
  async iekaeri(h, a) { enter(h); await sleep(1100); wave(a); await sleep(600); },
  async iematane(h, a) { enter(h); await sleep(1000); jump(a, .4); a.happyOn = true; await sleep(600); },
  // ---- こうえん2 ----
  async kpjanken(h, a) { enter(h); await sleep(1000); a.armR.t = -120; jump(a, .3); markAbove(a, "ex"); await sleep(700); a.armR.t = 0; markAbove(h, "q"); await sleep(300); },
  async kponi(h, a) { hold(h, "run", 1); enter(h); await sleep(900); a.dx.v = a.dx.t = 900; hold(a, "run", 1); a.dx.t = 0; await sleep(900); a.armR.t = -70; blip(800, 1200, .1, "square"); surprise(h); markAbove(h, "ex"); await sleep(600); a.armR.t = 0; },
  async kpyasumu(h, a) { hold(h, "run", 1.1); enter(h); hold(a, "run", 2); await sleep(1100); h.lean.t = 14; hold(h, "shake", 1.6); for (let i = 0; i < 3; i++) later(i * 400, () => markAbove(h, "drop", { dx: i % 2 ? 50 : -50 })); await sleep(1300); h.lean.t = 0; jump(a, .4); await sleep(300); },
  async kpbetsuno(h, a) { enter(h); await sleep(1000); jump(a, .4); a.armR.t = -100; await sleep(700); a.armR.t = 0; playMove(h, "think"); await sleep(500); },
  async kptotte(h, a) { const b = prop("ball", 1000, 925, .5); enter(h); await sleep(900); tween(900, k => b.setAttribute("transform", `translate(${(1000 - 980 * k).toFixed(0)} ${(925 - 40 * Math.abs(Math.sin(k * 6))).toFixed(0)}) rotate(${(-720 * k).toFixed(0)}) scale(.5)`));
    a.armL.t = 120; markAbove(a, "ex"); await sleep(1000); a.armL.t = 0; playMove(h, "look"); await sleep(300); },
  async kptotte2(h, a) { window.__ball = prop("ball", 1080, 925, .5); enter(h); await sleep(1000); playMove(a, "look"); markAbove(a, "q"); await sleep(600); },
  async kpkoronda(h, a) { enter(h); await sleep(700); a.dx.v = a.dx.t = 300; hold(a, "run", .5); a.dx.t = 0; await sleep(500); thud(); flop(a); markAbove(a, "ex"); await sleep(700); a.sadMouth = true; tears(a, 2); await sleep(1000); surprise(h); await sleep(300); },
  async kpjunban(h, a) { place(a, 240, 372, .6); show(a); stay(a); enter(h); await sleep(1000); hold(a, "shiver", 2.2); a.sadMouth = true; markAbove(a, "drop"); await sleep(1300); playMove(h, "look"); await sleep(300); },
  async kpiyada(h, a) { enter(h); await sleep(1000); h.armR.t = -70; await sleep(200); a.armR.t = -70; playMove(a, "laugh"); await sleep(500); h.armR.t = 0; a.armR.t = 0; await sleep(200); h.headRot.t = 10; a.headRot.t = -10; await sleep(500); h.headRot.t = a.headRot.t = 0; h.sadMouth = true; markAbove(h, "drop"); await sleep(400); },
  async kpmizu(h, a) { hold(h, "run", 1); enter(h); await sleep(1000); hold(h, "shake", 1); h.armR.t = -40; markAbove(h, "drop", { dx: 40 }); await sleep(900); h.armR.t = 0; jump(a, .4); await sleep(400); },
  async kpiiyo(h, a) { enter(h); await sleep(800); enter(a); await sleep(1000); playMove(a, "shy"); a.headY.t = 10; await sleep(500); },
  async kpbokumo(h, a) { const ks = [xtra("doshin", 920, .8)]; ks.forEach(c => hp5(c, "shovel", .4)); enter(h); await sleep(1000); a.armR.t = -70; ks.forEach(c => jump(c, .4)); await sleep(700); a.armR.t = 0; h.sadMouth = true; markAbove(h, "drop"); await sleep(400); },
  // ---- となりの せき ----
  async skochita(h, a) { desk3(h, a); await sleep(500); const p = world(a, 100, 0); const e = prop("eraser", p.x, 820, .4); await tween(400, k => e.setAttribute("transform", `translate(${(p.x - 60 * k).toFixed(0)} ${(820 + 120 * k).toFixed(0)}) rotate(${(180 * k).toFixed(0)}) scale(.4)`)); window.__er = e; blip(600, 300, .06, "triangle");
    await sleep(400); playMove(a, "look"); hold(a, "shake", 1.2); markAbove(a, "q"); await sleep(1200); },
  async skenpitsu(h, a) { desk3(h, a); onDesk(a, "memo", .4); onDesk(h, "memo", .4); await sleep(400); hold(h, "shake", 1.6); playMove(h, "look"); await sleep(1300); markAbove(h, "drop"); h.sadMouth = true; await sleep(400); playMove(a, "look"); },
  async skkaesu(h, a) { desk3(h, a); window.__pen = hp5(h, "pencil", .3, -30); onDesk(h, "memo", .4); onDesk(a, "memo", .4); await sleep(600); ring3(); await sleep(700); a.armL.t = 160; a.armR.t = -160; a.headRot.t = -8; await sleep(900); a.armL.t = a.armR.t = 0; a.headRot.t = 0; },
  async sktsukue(h, a) { desk3(h, a); onDesk(a, "memo", .4); await sleep(600); noise(.5, 500, .35); hold(a, "shake", .8); slideDesk(a, -150, 700); a.dx.t = -150; await sleep(900); surprise(h); markAbove(h, "ex"); await sleep(500); },
  async skpage(h, a) { desk3(h, ...exKids([940, 1080])); a.armR.t = -90; await sleep(800); ((CUR_S && CUR_S.extras) || []).forEach(k => onDesk(C[k], "kbook", .42)); await sleep(500); a.armR.t = 0; h.armR.t = -40; h.headRot.t = 10; markAbove(h, "q"); await sleep(700); h.headRot.t = 0; },
  async skprint(h, a) { desk3(h, a); window.__pr = hp5(a, "prints", .35); await sleep(600); a.armR.t = -70; markAbove(a, "note"); await sleep(800); playMove(h, "look"); await sleep(300); },
  async skmawasu(h, a) { desk3(h, a); window.__pr = hp5(h, "prints", .35); await sleep(600); a.armR.t = -60; hold(a, "shake", 1.2); markAbove(a, "note"); await sleep(1100); a.armR.t = 0; },
  async skatodene(h, a) { desk3(h, a); onDesk(h, "memo", .4); hold(h, "shake", 1.4); await sleep(900); for (let i = 0; i < 3; i++) { a.armR.t = -60; blip(500, 500, .05, "triangle"); await sleep(220); a.armR.t = 0; await sleep(180); } markAbove(a, "note"); surprise(h); await sleep(500); },
  async sknaiteru(h, a) { desk3(h, a); a.headY.t = 14; a.sadMouth = true; tears(a, 3); await sleep(800); markAbove(a, "drop"); await sleep(600); playMove(h, "look"); await sleep(600); },
  async skmisete(h, a) { desk3(h, a); onDesk(a, "kbook", .42); await sleep(500); hold(h, "shake", 1.4); playMove(h, "look"); await sleep(1300); h.sadMouth = true; markAbove(h, "drop"); await sleep(400); playMove(a, "look"); },
  async sknani(h, a) { sit3(a); onDesk(a, "memo", .4); hold(a, "shake", 2.4); markAbove(a, "note"); enter(h); await sleep(1200); playMove(h, "look"); markAbove(h, "q"); await sleep(600); },
  async skhiji(h, a) { desk3(h, a); onDesk(h, "memo", .4); onDesk(a, "memo", .4); await sleep(600); h.armR.t = -110; h.lean.t = 10; await sleep(300); thud(); surprise(a); markAbove(a, "ex"); a.sadMouth = true; h.armR.t = 0; h.lean.t = 0; await sleep(300); surprise(h); await sleep(500); },
});
Object.assign(POST, {
  async ieaisatsu(h, a) { a.armR.t = -60; playMove(a, "nod"); await sleep(600); a.armR.t = 0; joy(h); await sleep(400); },
  async ieojama(h, a) { playMove(h, "crouch"); await sleep(500); const p = world(h, 200, 0); prop("shoes", p.x - 20, 985, .5); chime(); await sleep(600); playMove(a, "nod"); joy(h); await sleep(400); },
  async ieheya(h, a) { const d = window.__door; if (d) { await tween(500, k => d.setAttribute("transform", `translate(${(300 * k).toFixed(0)} 0) scale(${(1 - .6 * k).toFixed(2)} 1)`)); d.remove(); } joy(a); joy(h); await sleep(600); },
  async iekashite(h, a) { if (window.__car) window.__car.remove(); await walk(a, -300, 700); hp5(h, "toycar", .4); playMove(a, "nod"); joy(h); await sleep(500); },
  async iekowashita(h, a) { if (window.__wheel) window.__wheel.remove(); await walk(a, -300, 700); a.armR.t = -60; await sleep(500); if (window.__car) window.__car.remove(); hp5(h, "toycar", .4); chime(); markAbove(h, "sparkle"); a.armR.t = 0; h.sadMouth = false; playMove(a, "nod"); joy(h); await sleep(500); },
  async iejuice(h, a) { await walk(a, -330, 800); if (window.__cup) window.__cup.remove(); hp5(h, "juice", .4); playMove(a, "nod"); joy(h); await sleep(500); },
  async ieippai(h, a) { playMove(a, "nod"); h.armL.t = h.armR.t = 0; h.happyOn = true; await sleep(700); },
  async ietoire(h, a) { h.armL.t = h.armR.t = 0; playMove(a, "nod"); await sleep(400); walk(a, 700, 1200); await walk(h, 1300, 1400); },
  async iekoboshita(h, a) { hp5(a, "rag", .35); await walk(a, -330, 800); playMove(a, "crouch"); await sleep(400); if (window.__pd) window.__pd.remove(); h.sadMouth = false; playMove(h, "nod"); await sleep(500); },
  async iekumata(h, a) { joy(a); joy(h); await sleep(600); },
  async iechigau(h, a) { playMove(a, "nod"); if (window.__cr) window.__cr.remove(); prop("crayons", 620, 920, .5); chime(); joy(h); await sleep(500); },
  async iekaeri(h, a) { playMove(h, "bow"); await sleep(600); wave(a); await sleep(500); },
  async iematane(h, a) { wave(a); wave(h); await sleep(800); await walk(h, -900, 1200); },
  async kpjanken(h, a) { for (let i = 0; i < 3; i++) { h.armR.t = a.armR.t = -70; blip(500 + i * 120, 500 + i * 120, .08, "square"); await sleep(250); h.armR.t = a.armR.t = 0; await sleep(200); } h.armR.t = -100; a.armR.t = -100; await sleep(600); h.armR.t = a.armR.t = 0; joy(h); joy(a); await sleep(400); },
  async kponi(h, a) { playMove(a, "laugh"); walk(a, 900, 1000); h.armL.t = -165; h.armR.t = 165; for (let i = 0; i < 3; i++) later(i * 300, () => markAbove(h, "note")); await sleep(1000); h.armL.t = h.armR.t = 0; playMove(h, "nod"); await sleep(300); },
  async kpyasumu(h, a) { playMove(a, "nod"); h.sadMouth = false; walk(a, -250, 700); await walk(h, 250, 700); playMove(h, "nod"); await sleep(500); },
  async kpbetsuno(h, a) { joy(a); joy(h); await sleep(500); walk(a, -1000, 1500); await walk(h, -900, 1500); },
  async kptotte(h, a) { playMove(a, "nod"); await walk(h, -800, 1100); hp5(h, "ball", .45); await walk(h, 800, 1100); joy(a); joy(h); await sleep(400); },
  async kptotte2(h, a) { playMove(a, "crouch"); await sleep(500); if (window.__ball) window.__ball.remove(); const b = hp5(a, "ball", .45); await walk(a, -260, 700); b.remove(); hp5(h, "ball", .45); playMove(h, "bow"); await sleep(600); playMove(a, "nod"); await sleep(300); },
  async kpkoronda(h, a) { await walk(h, 350, 800); playMove(h, "crouch"); await sleep(500); a.sadMouth = false; playMove(a, "nod"); await sleep(500); jump(a, .3); await sleep(300); },
  async kpjunban(h, a) { playMove(a, "nod"); a.sadMouth = false; await walk(h, -300, 800); jump(h, .5); markAbove(h, "sparkle"); await sleep(600); },
  async kpiyada(h, a) { playMove(a, "bow"); h.sadMouth = false; await sleep(600); playMove(h, "nod"); await sleep(300); },
  async kpmizu(h, a) { playMove(a, "nod"); await walk(h, 450, 900); h.lean.t = 18; for (let i = 0; i < 4; i++) later(i * 250, () => { const p = world(h, 330, 300); mark("puff", p.x + 40, p.y, { vy: -80, life: .8, s: .5 }); }); await sleep(1000); h.lean.t = 0; joy(h); await sleep(300); },
  async kpiiyo(h, a) { a.headY.t = 0; joy(a); joy(h); await sleep(600); },
  async kpbokumo(h, a) { h.sadMouth = false; joy(a); ((CUR_S && CUR_S.extras) || []).forEach(k => joy(C[k])); joy(h); await sleep(600); },
  async skochita(h, a) { playMove(h, "crouch"); await sleep(500); if (window.__er) window.__er.remove(); const e = hp5(h, "eraser", .3); h.armR.t = -70; await sleep(500); e.remove(); hp5(a, "eraser", .3); h.armR.t = 0; joy(a); await sleep(500); },
  async skenpitsu(h, a) { const p = hp5(a, "pencil", .3, -30); a.armR.t = -70; await sleep(500); p.remove(); hp5(h, "pencil", .3, -30); a.armR.t = 0; h.sadMouth = false; joy(h); await sleep(500); },
  async skkaesu(h, a) { if (window.__pen) window.__pen.remove(); h.armR.t = -70; await sleep(400); hp5(a, "pencil", .3, -30); h.armR.t = 0; playMove(a, "nod"); joy(h); await sleep(400); },
  async sktsukue(h, a) { playMove(a, "bow"); await sleep(400); slideDesk(a, 150, 600); a.dx.t = 0; await sleep(700); joy(h); await sleep(300); },
  async skpage(h, a) { playMove(a, "nod"); onDesk(h, "kbook", .42); h.armR.t = 0; markAbove(h, "sparkle"); await sleep(700); },
  async skprint(h, a) { if (window.__pr) window.__pr.remove(); const p = hp5(h, "prints", .35); a.armR.t = 0; await sleep(400); h.armR.t = -90; await sleep(500); p.remove(); h.armR.t = 0; markAbove(h, "sparkle"); await sleep(400); },
  async skmawasu(h, a) { if (window.__pr) window.__pr.remove(); h.armR.t = -60; await sleep(300); hp5(a, "prints", .35); h.armR.t = 0; joy(a); await sleep(500); },
  async skatodene(h, a) { a.headY.t = 8; playMove(a, "nod"); await sleep(600); a.headY.t = 0; playMove(h, "nod"); await sleep(300); },
  async sknaiteru(h, a) { h.armR.t = -40; await sleep(400); a.headY.t = 0; a.sadMouth = false; playMove(a, "nod"); await sleep(500); h.armR.t = 0; playMove(h, "nod"); await sleep(300); },
  async skmisete(h, a) { playMove(a, "nod"); slideDesk(a, -140, 600); a.dx.t = -140; await sleep(700); chime(); h.sadMouth = false; joy(h); await sleep(400); },
  async sknani(h, a) { a.armR.t = -70; markAbove(a, "sparkle"); await sleep(500); a.armR.t = 0; joy(h); await sleep(500); },
  async skhiji(h, a) { a.sadMouth = false; playMove(a, "nod"); await sleep(500); playMove(h, "nod"); await sleep(300); },
});

/* ---------- 盤 ---------- */
STAGE_DEF.ie1 = { ground: "#FFEFF3", sky: "#CFEAFB", names: ["げんかん", "げんかん", "ともだちの へや", "ともだちの へや", "ダイニング", "ダイニング", "ともだちの へや", "ともだちの へや", "げんかん"],
  fills: { げんかん: "#F1EAD8", "ともだちの へや": "#FFE0E6", ダイニング: "#FFE3B3" } };
STAGE_DEF.kouen2 = { ground: "#BFE3A6", sky: "#CFEAFB", names: ["ひろば", "ひろば", "すべりだい", "すべりだい", "ベンチ", "ベンチ", "みずのみば", "ベンチ", "ひろば"],
  fills: { ひろば: "#D7F0D2", すべりだい: "#FFE3B3", ベンチ: "#F1EAD8", みずのみば: "#D7ECFF" } };
STAGE_DEF.seki1 = { ground: "#F6E7C8", sky: "#CFEAFB", names: ["こくご", "こくご", "さんすう", "さんすう", "さんすう", "さんすう", "やすみじかん", "やすみじかん", "こくご"],
  fills: { こくご: "#FFE0E6", さんすう: "#D7ECFF", やすみじかん: "#D7F0D2" } };
/* ともだちの いえ：げんかん → ともだちの へや → ダイニング → ともだちの へや → げんかん（かえる） */
{ const n = {}, pl = {}, nx = {};
  chain(["0", "1", "2", "3", "4", "f1"], [[220, 880], [420, 900], [620, 900], [820, 900], [1020, 900], [1220, 880]], "げんかん", n, pl); pl["3"] = pl["4"] = pl.f1 = "ともだちの へや";
  chain(["a1", "a2", "a3"], [[1400, 760], [1420, 580], [1300, 420]], "ダイニング", n, pl);
  chain(["b1", "b2"], [[1120, 700], [1000, 560]], "ダイニング", n, pl);
  chain(["m1", "m2", "f2"], [[1100, 340], [880, 300], [660, 320]], "ともだちの へや", n, pl);
  chain(["c1", "c2", "c3"], [[440, 360], [300, 500], [380, 660]], "ともだちの へや", n, pl);
  chain(["d1"], [[620, 520]], "ともだちの へや", n, pl);
  n["15"] = [600, 700, "goal"]; pl["15"] = "げんかん"; n["0"].push("start"); n["4"].push("block");
  linkLine(nx, ["0", "1", "2", "3", "4", "f1", "a1", "a2", "a3", "m1", "m2", "f2", "c1", "c2", "c3", "15"]); linkLine(nx, ["f1", "b1", "b2", "m1"]); linkLine(nx, ["f2", "d1", "15"]);
  BOARD.ie1 = { nodes: n, place: pl, next: nx, away: [1300, 760], style: (a, b) => ["b1", "b2", "d1"].includes(a) || ["b1", "d1"].includes(b) ? "hall" : "classwood",
    labels: [["げんかん", 260, 990], ["ダイニング", 1470, 330], ["ともだちの へや", 880, 200]] }; }
/* こうえん2：ひろば → すべりだい → ベンチ → みずのみば → ひろば */
{ const n = {}, pl = {}, nx = {};
  chain(["0", "1", "2", "3", "4", "f1"], [[200, 900], [400, 900], [600, 900], [800, 900], [1000, 900], [1200, 860]], "ひろば", n, pl); pl["4"] = pl.f1 = "すべりだい";
  chain(["a1", "a2", "a3", "a4"], [[1400, 760], [1440, 600], [1300, 500], [1100, 470]], "すべりだい", n, pl); pl.a3 = pl.a4 = "ベンチ";
  chain(["b1", "b2"], [[1100, 720], [920, 620]], "すべりだい", n, pl);
  chain(["m1", "m2", "f2"], [[900, 470], [700, 500], [500, 480]], "ベンチ", n, pl);
  chain(["c1", "c2", "c3"], [[360, 380], [460, 250], [680, 220]], "みずのみば", n, pl);
  chain(["d1"], [[700, 340]], "ベンチ", n, pl);
  chain(["e1", "e2"], [[880, 240], [1080, 240]], "ひろば", n, pl);
  n["15"] = [1290, 250, "goal"]; pl["15"] = "ひろば"; n["0"].push("start"); n["4"].push("block");
  linkLine(nx, ["0", "1", "2", "3", "4", "f1", "a1", "a2", "a3", "a4", "m1", "m2", "f2", "c1", "c2", "c3", "e1", "e2", "15"]); linkLine(nx, ["f1", "b1", "b2", "m1"]); linkLine(nx, ["f2", "d1", "e1"]);
  BOARD.kouen2 = { nodes: n, place: pl, next: nx, away: [1000, 760], style: (a, b) => ["b1", "b2", "d1"].includes(a) || ["b1", "d1"].includes(b) ? "sand" : "park",
    labels: [["ひろば", 260, 990], ["すべりだい", 1460, 420], ["ベンチ", 700, 600], ["みずのみば", 360, 160], ["ひろば", 1080, 160]] }; }
/* となりの せき：こくご → さんすう → やすみじかん → こくご */
{ const n = {}, pl = {}, nx = {}; const T = arcPts(800, 560, 600, 330, [150, 128, 106, 84, 62, 40, 18, -6]);
  chain(["0", "1", "2", "3", "4", "f1", "a1", "a2"], T, "こくご", n, pl); pl.a1 = pl.a2 = "さんすう";
  chain(["a3", "a4", "a5"], arcPts(800, 560, 600, 330, [-30, -55, -80]), "さんすう", n, pl);
  chain(["b1", "b2"], [[1150, 600], [960, 560]], "さんすう", n, pl);
  chain(["m1", "m2", "f2"], arcPts(800, 560, 600, 330, [-105, -130, -155]), "やすみじかん", n, pl);
  chain(["c1", "c2"], arcPts(800, 560, 600, 330, [-180, -205]), "こくご", n, pl);
  chain(["d1"], [[560, 420]], "やすみじかん", n, pl);
  n["15"] = [800, 560, "goal"]; pl["15"] = "こくご"; n["0"].push("start"); n["4"].push("block");
  linkLine(nx, ["0", "1", "2", "3", "4", "f1", "a1", "a2", "a3", "a4", "a5", "m1", "m2", "f2", "c1", "c2", "15"]); linkLine(nx, ["f1", "b1", "b2", "m1"]); linkLine(nx, ["f2", "d1", "15"]);
  BOARD.seki1 = { nodes: n, place: pl, next: nx, away: [300, 760], style: (a, b) => ["b1", "b2", "d1"].includes(a) || ["b1", "d1"].includes(b) ? "hall" : "classwood",
    labels: [["こくご", 300, 990], ["さんすう", 1480, 520], ["やすみじかん", 800, 150]] }; }
Object.assign(BOARD_BG, {
  ie1(L) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFEFF3" }, L); for (let x = 0; x < 1600; x += 100) el("path", { d: `M${x} 0 V1000`, stroke: "#00000010", "stroke-width": 4 }, L);
    [[60, 760, 520, 230, "#F1EAD8"], [1180, 300, 400, 560, "#FFE9C7"], [560, 160, 640, 260, "#FFE0E6"]].forEach(([x, y, w, h, c]) => el("rect", { x, y, width: w, height: h, rx: 30, fill: c, ...S6(5) }, L));
    el("rect", { x: 60, y: 40, width: 420, height: 110, rx: 10, fill: "#FFFFFF", ...S6(6) }, L); txt(L, 270, 115, "ともだちの いえ", 44, { "text-anchor": "middle" });
    el("path", { d: "M1300 160 L1400 80 L1500 160 Z", fill: "#FF9FB8", ...S6(5) }, L); el("rect", { x: 1320, y: 160, width: 160, height: 100, fill: "#FFF1D6", ...S6(5) }, L); el("circle", { cx: 1400, cy: 210, r: 22, fill: "#FFD25E", ...S6(4) }, L); },
  kouen2(L) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#BFE3A6" }, L); el("rect", { x: 0, y: 0, width: 1600, height: 130, fill: "#CFEAFB" }, L); cloud(L, 300, 70); cloud(L, 1200, 60, .8);
    el("ellipse", { cx: 1000, cy: 600, rx: 200, ry: 110, fill: "#F6E2A8", ...S6(5) }, L); [[180, 560], [1500, 260], [600, 640]].forEach(([x, y]) => tree2(L, x, y, 40));
    el("circle", { cx: 700, cy: 820, r: 26, fill: "#FF6F91", ...S6(4) }, L); txt(L, 800, 100, "こうえん2", 48, { "text-anchor": "middle" }); },
  seki1(L) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFF6E0" }, L); el("ellipse", { cx: 800, cy: 560, rx: 700, ry: 420, fill: "#F6E7C8", ...S6(6) }, L);
    el("rect", { x: 620, y: 470, width: 360, height: 180, rx: 10, fill: "#2F6B4F", ...S6(6) }, L); txt(L, 800, 580, "となりの せき", 46, { "text-anchor": "middle", fill: "#FFFFFF" }); },
});
BLOCK_DEF.ie1 = { who: "pannamama", sleep: false, intro: ["p_blk_ie1", "ぱんなの ママが げんかんに いるよ。あいさつ しよう！"], say: ["blk_ie1", "こんにちは"], to: "ぱんなの ママに いおう",
  keys: [["こんにちは", "今日は", "こんにちわ"]], res: ["rs_ie1", "はい、どうぞ。ゆっくり あそんでいってね"] };
BLOCK_DEF.kouen2 = { who: "tora", sleep: false, intro: ["p_blk_kouen2", "とらおが みちに ねころんで いるよ"], say: ["blk_kouen2", "とらおくん、とおして"], to: "とらおに いおう",
  keys: [["とおして", "通して"]], res: ["rs_kouen2", "おっ、いいぜ。とおりな"] };
BLOCK_DEF.seki1 = { who: "doshin", sleep: false, intro: ["p_blk_seki1", "どしんの つくえが はみでて いるよ"], say: ["blk_seki1", "どしんくん、つくえ、つめて"], to: "どしんに いおう",
  keys: [["つめて", "詰めて"]], res: ["rs_seki1", "あ、ごめんね。はい、どうぞ"] };
S5.forEach(st => SLEEPER_OF[st] = BLOCK_DEF[st].who);
Object.assign(EVENTS, {
  ie1: { a2: ["fwd", 2, "ev_ie1f", "おもちゃを かたづけて ほめられた！ 2マス すすむよ"], m2: ["back", 2, "ev_ie1b", "くつしたで すべった！ 2マス もどるよ"], d1: ["home", 0, "ev_ie1h", "おみやげを わすれた！ スタートに もどるよ"] },
  kouen2: { a2: ["fwd", 3, "ev_kouen2f", "ボールを ナイス キャッチ！ 3マス すすむよ"], m2: ["back", 2, "ev_kouen2b", "くつが ぬげた！ 2マス もどるよ"], d1: ["home", 0, "ev_kouen2h", "すいとうを わすれた！ スタートに もどるよ"] },
  seki1: { a2: ["fwd", 2, "ev_seki1f", "ノートが きれいって ほめられた！ 2マス すすむよ"], m2: ["back", 2, "ev_seki1b", "えんぴつが ころがった！ 2マス もどるよ"], d1: ["home", 0, "ev_seki1h", "ふでばこを わすれた！ スタートに もどるよ"] },
});
