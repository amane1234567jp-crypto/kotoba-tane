/* ================= ステージ「ハンバーガーやさんの あそびば」「ハンバーガーやさん」（2026-10-17） =================
   台本は sit/sits_new5.py。あそびば＝ゆうぐコーナーで きを つける こと。ハンバーガーやさん＝ちゅうもん・たべる・こまった とき。 */
const S6L = ["asobiba", "burger"];
Object.assign(RIVAL_OF, { asobiba: "mii", burger: "pyon" });

/* ---------- 物の 絵 ---------- */
Object.assign(ITEM2, {
  burger(g) { el("path", { d: "M-80 -20 Q-80 -70 0 -70 Q80 -70 80 -20 Z", fill: "#E9B872", ...S6p(5) }, g); el("rect", { x: -84, y: -22, width: 168, height: 18, rx: 6, fill: "#7BD389", ...S6p(4) }, g);
    el("rect", { x: -78, y: -6, width: 156, height: 22, rx: 6, fill: "#8B4A2B", ...S6p(4) }, g); el("rect", { x: -82, y: 14, width: 164, height: 14, rx: 5, fill: "#FFD25E", ...S6p(4) }, g); el("path", { d: "M-80 28 H80 Q80 58 0 58 Q-80 58 -80 28 Z", fill: "#E9B872", ...S6p(5) }, g);
    [[-40, -50], [0, -58], [40, -50]].forEach(([x, y]) => el("ellipse", { cx: x, cy: y, rx: 5, ry: 3, fill: "#FFF6E9" }, g)); },
  fries(g) { [-30, -15, 0, 15, 30].forEach((x, i) => el("rect", { x: x - 8, y: -90 + (i % 2) * 14, width: 16, height: 80, rx: 4, fill: "#FFD25E", ...S6p(3) }, g)); el("path", { d: "M-52 -20 L-40 50 H40 L52 -20 Z", fill: "#E8473C", ...S6p(5) }, g); el("path", { d: "M-20 8 L0 -4 L20 8", fill: "none", stroke: "#FFD25E", "stroke-width": 6 }, g); },
  cupdrink(g) { el("path", { d: "M-34 -60 H34 L26 50 H-26 Z", fill: "#FFFFFF", ...S6p(5) }, g); el("path", { d: "M-30 -20 H30", stroke: "#FF8A5B", "stroke-width": 16 }, g); el("rect", { x: -38, y: -70, width: 76, height: 14, rx: 5, fill: "#E8473C", ...S6p(4) }, g); el("path", { d: "M8 -70 L18 -110", ...S6p(5) }, g); },
  btray(g) { el("rect", { x: -130, y: -14, width: 260, height: 28, rx: 10, fill: "#C98A4B", ...S6p(5) }, g); const b = el("g", { transform: "translate(-60 -40) scale(.55)" }, g); ITEM2.burger(b); const f = el("g", { transform: "translate(40 -20) scale(.5)" }, g); ITEM2.fries(f); const c = el("g", { transform: "translate(100 -24) scale(.55)" }, g); ITEM2.cupdrink(c); },
  numtag(g) { el("rect", { x: -40, y: -50, width: 80, height: 100, rx: 10, fill: "#FFFFFF", ...S6p(5) }, g); txt(g, 0, 20, "12", 50, { "text-anchor": "middle" }); },
  ball2(g) { el("circle", { r: 36, fill: "#FF6F91", ...S6p(4) }, g); el("path", { d: "M-30 -20 Q0 -36 30 -20", fill: "none", stroke: "#FFFFFF", "stroke-width": 6, opacity: .7 }, g); },
  sneakers(g) { [-40, 20].forEach(x => { el("path", { d: `M${x} 0 Q${x - 10} -40 ${x + 20} -40 Q${x + 60} -40 ${x + 60} 0 Z`, fill: "#E8473C", ...S6p(4) }, g); el("path", { d: `M${x + 10} -30 H${x + 40}`, stroke: "#FFFFFF", "stroke-width": 5 }, g); }); },
  tissue(g) { el("rect", { x: -60, y: -30, width: 120, height: 60, rx: 8, fill: "#BDE3F2", ...S6p(5) }, g); el("path", { d: "M-20 -30 Q0 -70 20 -30", fill: "#FFFFFF", ...S6p(4) }, g); },
  ketchup(g) { el("path", { d: "M-40 -10 Q-50 -40 -10 -30 Q20 -50 40 -20 Q60 10 30 20 Q0 36 -30 20 Q-56 10 -40 -10 Z", fill: "#E8473C", opacity: .9, ...S6p(3) }, g); },
});

/* ---------- へや ---------- */
function shopWall(L, wall, floor) { el("rect", { x: 0, y: 0, width: 1600, height: 760, fill: wall }, L); el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: floor }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L);
  for (let x = 0; x < 1600; x += 100) for (let y = 760; y < 1000; y += 100) el("rect", { x, y, width: 100, height: 100, fill: ((x + y) / 100) % 2 ? "#00000008" : "none" }, L); }
function menuBoard(L, x, y) { el("rect", { x, y, width: 520, height: 150, rx: 14, fill: "#2B2A33", ...S6(6) }, L); [[x + 40, "🍔 ハンバーガー"], [x + 290, "🍟 ポテト"], [x + 40, "🥤 ジュース"], [x + 290, "🍦 アイス"]].forEach(([tx, t], i) => txt(L, tx, y + 60 + Math.floor(i / 2) * 60, t, 32, { fill: "#FFFFFF" })); }
const ROOMS6 = {
  いりぐち(L) { shopWall(L, "#FFF3D6", "#F2D9A8"); el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#BDE3F2", opacity: .6 }, L); // あそびばの ゆか（マット）
    el("rect", { x: 80, y: 420, width: 360, height: 340, rx: 10, fill: "#F2E3C2", ...S6(6) }, L); [520, 630].forEach(y => el("path", { d: `M80 ${y} H440`, ...S6(5) }, L)); [[110, 450, "#E8473C"], [230, 450, "#7FCBF0"], [110, 560, "#7BD389"], [230, 560, "#FFD25E"], [110, 670, "#B9A8D9"]].forEach(([x, y, c]) => [0, 48].forEach(dx => el("ellipse", { cx: x + 24 + dx, cy: y + 30, rx: 22, ry: 10, fill: c, ...S6(3) }, L)));
    el("rect", { x: 560, y: 160, width: 420, height: 130, rx: 16, fill: "#FFFFFF", ...S6(6) }, L); txt(L, 770, 215, "くつを ぬいでね", 40, { "text-anchor": "middle" }); txt(L, 770, 268, "👟 ➡ 🧦", 36, { "text-anchor": "middle" });
    el("rect", { x: 1120, y: 300, width: 440, height: 460, rx: 30, fill: "#FF8FA3", opacity: .5, ...S6(5) }, L); el("path", { d: "M1180 760 V560 Q1180 360 1380 360 Q1560 360 1560 560", fill: "none", stroke: "#FFD25E", "stroke-width": 44, ...{ "stroke-linecap": "round" } }, L); el("path", { d: "M1180 760 V560 Q1180 360 1380 360 Q1560 360 1560 560", fill: "none", ...S6(6) }, L); },
  すべりだい(L) { shopWall(L, "#FFF3D6", "#F2D9A8"); el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#BDE3F2", opacity: .6 }, L);
    el("path", { d: "M180 760 V300 M300 760 V300", ...S6(10), fill: "none" }, L); for (let y = 340; y < 760; y += 60) el("path", { d: `M180 ${y} H300`, ...S6(6) }, L); el("rect", { x: 160, y: 280, width: 160, height: 30, rx: 8, fill: "#FFD25E", ...S6(5) }, L);
    el("path", { d: "M300 290 Q560 340 760 700 L820 760 L900 760 L920 720 Q700 300 320 270 Z", fill: "#E8473C", ...S6(6) }, L); el("path", { d: "M330 300 Q580 360 790 730", fill: "none", stroke: "#FFFFFF", "stroke-width": 10, opacity: .5 }, L);
    el("ellipse", { cx: 1250, cy: 900, rx: 320, ry: 80, fill: "#7FCBF0", ...S6(5) }, L); for (let i = 0; i < 18; i++) el("circle", { cx: 960 + (i * 37) % 580, cy: 860 + (i * 23) % 70, r: 26, fill: ["#FF6F91", "#FFD25E", "#7BD389", "#B9A8D9"][i % 4], ...S6(3) }, L);
    el("rect", { x: 1240, y: 120, width: 300, height: 110, rx: 14, fill: "#FFFFFF", ...S6(5) }, L); txt(L, 1390, 190, "じゅんばんに", 36, { "text-anchor": "middle" }); },
  ボールプール(L) { shopWall(L, "#EAF6FF", "#F2D9A8"); el("rect", { x: 100, y: 560, width: 1400, height: 60, rx: 20, fill: "#5B8DEF", ...S6(6) }, L); el("rect", { x: 100, y: 600, width: 1400, height: 400, fill: "#7FCBF0" }, L);
    for (let i = 0; i < 60; i++) el("circle", { cx: 140 + (i * 97) % 1320, cy: 640 + (i * 53) % 320, r: 30, fill: ["#FF6F91", "#FFD25E", "#7BD389", "#B9A8D9", "#FF8A5B"][i % 5], ...S6(3) }, L);
    el("rect", { x: 560, y: 120, width: 480, height: 110, rx: 14, fill: "#FFFFFF", ...S6(5) }, L); txt(L, 800, 190, "ボールは なげないでね", 34, { "text-anchor": "middle" }); },
  テーブル(L) { shopWall(L, "#FFF3D6", "#E3C59A"); el("rect", { x: 520, y: 560, width: 560, height: 36, rx: 10, fill: "#C98A4B", ...S6(6) }, L); el("path", { d: "M600 596 V760 M1000 596 V760", ...S6(8) }, L);
    const t = el("g", { transform: "translate(800 540) scale(.7)" }, L); ITEM2.tray(t); el("rect", { x: 1200, y: 200, width: 320, height: 200, rx: 12, fill: "#BDE3F2", ...S6(6) }, L); el("path", { d: "M1360 200 V400", ...S6(5) }, L); },
  レジ(L) { shopWall(L, "#FFF3D6", "#E3C59A"); menuBoard(L, 540, 120);
    el("rect", { x: 900, y: 500, width: 700, height: 260, rx: 12, fill: "#E8473C", ...S6(6) }, L); el("rect", { x: 880, y: 480, width: 740, height: 30, rx: 8, fill: "#C9302B", ...S6(5) }, L);
    el("rect", { x: 1300, y: 380, width: 160, height: 100, rx: 10, fill: "#5E6A7A", ...S6(5) }, L); el("rect", { x: 1316, y: 396, width: 128, height: 50, rx: 6, fill: "#9FD8F5" }, L);
    const t = el("g", { transform: "translate(1060 470) scale(.6)" }, L); ITEM2.tray(t); },
  せき(L) { shopWall(L, "#FFF3D6", "#E3C59A"); el("rect", { x: 420, y: 560, width: 760, height: 36, rx: 10, fill: "#C98A4B", ...S6(6) }, L); el("path", { d: "M500 596 V760 M1100 596 V760", ...S6(8) }, L);
    const t = el("g", { transform: "translate(800 540) scale(.75)" }, L); ITEM2.tray(t); window.__tray = t; el("rect", { x: 1240, y: 180, width: 320, height: 220, rx: 12, fill: "#BDE3F2", ...S6(6) }, L); el("path", { d: "M1400 180 V400 M1240 290 H1560", ...S6(5) }, L);
    [[160, 320], [330, 320]].forEach(([x, y]) => { el("rect", { x, y, width: 120, height: 150, rx: 12, fill: "#FFD9B0", ...S6(5) }, L); }); },
};
{ const dr = drawRoom; drawRoom = function (place, noSign = false) {
    const R = S6L.includes(curStage) && ROOMS6[place]; if (!R) return dr(place, noSign);
    sceneLayer.innerHTML = ""; R(sceneLayer);
    if (!noSign) { const g = el("g", {}, sceneLayer); el("rect", { x: 620, y: 24, width: 360, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, place.length > 6 ? 38 : 46, { "text-anchor": "middle" }); }
  }; }

/* ---------- できごとの アニメ ---------- */
const ON6 = ["abkutsu", "abgyaku", "abgyaku2", "aboogoe", "abshizuka", "abwarikomi", "abosanai", "abdoite", "abchiisai", "abnagenai", "abkaeru",
  "bgchumon", "bgnomimono", "bgkochira", "bguketori", "bgseki", "bgitadaki", "bgbetabeta", "bgtoire", "bgbokuno", "bggochisou"];
ON6.forEach(k => ASK_ON_STAGE.add(k));
["abshizuka", "abosanai", "bgkoboshita"].forEach(k => SOFT_INTRO.add(k));
const hp6 = (c, kind, k = .4, r = 0) => { const g = prop(kind, 0, 0, k); hand(c, g, k, r); return g; };
const shout = (c, n = 4) => { for (let i = 0; i < n; i++) later(i * 300, () => { markAbove(c, "note", { dx: i % 2 ? 60 : -60 }); blip(300 + rnd(200), 500, .12, "sawtooth"); }); };
Object.assign(INTRO, {
  // ---- あそびば ----
  async abkutsu(h, a) { enter(h); await sleep(1100); a.armR.t = -70; await sleep(700); a.armR.t = 0; playMove(h, "look"); await sleep(300); },
  async abgyaku(h, a) { place(a, 700, 760, .7); stay(a); a.lean.t = -30; hold(a, "run", 2.2); enter(h); await sleep(1000); // とらおが すべりだいを したから のぼる
    await tween(1200, k => { place(a, 700 - 150 * k, 760 - 190 * k, .7); }); a.lean.t = 0; markAbove(h, "ex"); surprise(h); await sleep(600); },
  async abgyaku2(h, a) { enter(h); await sleep(900); h.lean.t = -24; hold(h, "run", 1); await tween(800, k => { h.dx.v = h.dx.t = 120 * k; }); h.lean.t = 0; // じぶんが したから のぼろうと する
    a.armR.t = -120; markAbove(a, "ex"); await sleep(800); a.armR.t = 0; h.dx.t = 0; await sleep(300); },
  async aboogoe(h, a) { enter(h); await sleep(900); a.armL.t = -160; a.armR.t = 160; jump(a, .6); shout(a, 5); await sleep(1500); a.armL.t = a.armR.t = 0; h.armL.t = -165; h.armR.t = 165; await sleep(500); h.armL.t = h.armR.t = 0; },
  async abshizuka(h, a) { enter(h); await sleep(800); h.armL.t = -160; h.armR.t = 160; jump(h, .6); shout(h, 4); await sleep(1300); h.armL.t = h.armR.t = 0; playMove(a, "look"); a.armR.t = -60; await sleep(600); a.armR.t = 0; },
  async abwarikomi(h, a) { place(h, 240, 300, .5); stay(h); const ks = [xtra("kuma", 400, .55)]; place(ks[0], 420, 300, .5); // うえで ならんでいる
    a.dx.v = a.dx.t = 900; place(a, 700, 300, .55); hold(a, "run", 1.2); a.dx.t = 0; await sleep(1300); a.armR.t = -110; jump(a, .4); await sleep(600); a.armR.t = 0; surprise(h); markAbove(h, "ex"); await sleep(400); },
  async abosanai(h, a) { place(h, 300, 300, .5); stay(h); place(a, 150, 300, .5); stay(a); await sleep(600); for (let i = 0; i < 3; i++) { a.armR.t = -70; a.dx.t = 30; await sleep(220); a.armR.t = 0; a.dx.t = 0; h.lean.t = 12; await sleep(220); h.lean.t = 0; } surprise(h); markAbove(h, "ex"); await sleep(500); },
  async abdoite(h, a) { place(h, 240, 300, .5); stay(h); place(a, 880, 975, .42); stay(a); a.tm.closed = 1e6; await sleep(800); delete a.tm.closed; markAbove(h, "q"); await sleep(600); },
  async abchiisai(h, a) { const ks = exKids([1000]); ks.forEach(c => place(c, 1000, 975, .36)); enter(h); await sleep(900); a.armL.t = -160; a.armR.t = 160; jump(a, .7); await sleep(600); a.armL.t = a.armR.t = 0; playMove(h, "look"); ks.forEach(c => markAbove(c, "drop")); await sleep(600); },
  async abnagenai(h, a) { enter(h); await sleep(900); const b = hp6(a, "ball2", .5); a.armR.t = -140; await sleep(500); b.remove(); const p = world(a, 330, 300); const bb = prop("ball2", p.x, p.y, .5);
    await tween(600, k => bb.setAttribute("transform", `translate(${(p.x - 500 * k).toFixed(0)} ${(p.y - 200 * Math.sin(k * Math.PI)).toFixed(0)}) rotate(${(360 * k).toFixed(0)}) scale(.5)`)); a.armR.t = 0; thud(); surprise(h); h.lean.t = -10; markAbove(h, "ex"); await sleep(400); h.lean.t = 0; bb.remove(); },
  async abpoteto(h, a) { hp6(a, "fries", .45); enter(h); await sleep(1000); enter(a); await sleep(1000); a.armR.t = -60; await sleep(500); a.armR.t = 0; markAbove(h, "ex"); },
  async abkaeru(h, a) { enter(h); await sleep(1000); a.armR.t = -60; await sleep(600); a.armR.t = 0; h.sadMouth = true; markAbove(h, "drop"); await sleep(500); },
  // ---- ハンバーガーやさん ----
  async bgchumon(h, a) { enter(h); await sleep(1100); playMove(a, "bow"); await sleep(600); playMove(h, "look"); await sleep(300); },
  async bgnomimono(h, a) { enter(h); await sleep(1000); a.armR.t = -60; await sleep(600); a.armR.t = 0; playMove(h, "think"); await sleep(300); },
  async bgkochira(h, a) { enter(h); await sleep(1000); playMove(a, "look"); await sleep(500); playMove(h, "think"); markAbove(h, "q"); await sleep(600); },
  async bgbangou(h, a) { window.__tag = hp6(h, "numtag", .4); enter(h); await sleep(1100); hold(h, "shake", 1); await sleep(700); a.dx.v = a.dx.t = 900; hold(a, "run", 1); a.dx.t = 0; await sleep(1000); a.armL.t = -120; await sleep(500); a.armL.t = 0; surprise(h); await sleep(300); },
  async bguketori(h, a) { enter(h); await sleep(1000); window.__tr = hp6(a, "btray", .45); a.armR.t = -60; await sleep(600); a.armR.t = 0; markAbove(h, "sparkle"); },
  async bgseki(h, a) { const ks = exKids([880, 1060]); ks.forEach(c => { place(c, c.x + 200 * c.s, 975, c.s * .85); sit3(c); }); hp6(h, "btray", .4); enter(h); await sleep(1100); playMove(h, "look"); hold(h, "shake", 1.4); await sleep(1300); markAbove(h, "drop"); await sleep(300); },
  async bgitadaki(h, a) { sit3(h); onDesk(h, "btray", .5); enter(a); await sleep(1000); playMove(a, "nod"); await sleep(400); markAbove(h, "sparkle"); },
  async bgbetabeta(h, a) { sit3(h); onDesk(h, "burger", .5); await sleep(500); h.armR.t = -80; await sleep(400); h.armR.t = 0; const k = el("g", {}, front()); follow(k, () => { const p = world(h, 330, 300); return [p.x, p.y, 0, .5]; }); ITEM2.ketchup(k); window.__kc = k; h.armR.t = -60; markAbove(h, "drop"); await sleep(900); playMove(a, "look"); },
  async bgkoboshita(h, a) { sit3(h); const c = onDesk(h, "cupdrink", .45, 80); await sleep(700); h.armR.t = -70; await sleep(300); const d = h.__desk.firstChild, y = +d.getAttribute("y"), x = +d.getAttribute("x") + +d.getAttribute("width"); const cx = world(h, 200, 0).x + 80, ty = y - 8;
    // コップが たおれて、ジュースが テーブルから したへ ながれる
    noise(.3, 900, .4); await tween(380, k => c.setAttribute("transform", `rotate(${(88 * easeBack(k)).toFixed(1)} ${(cx + 30).toFixed(0)} ${ty})`));
    const J = "#FFA62B", fy = h.y + h.base * h.s - 6, ex = Math.max(x, cx + 60); // ジュースが テーブルに ひろがり、はしから ゆかへ ながれおちて、ゆかに たまる
    const sp = el("ellipse", { cx: cx + 40, cy: ty + 2, rx: 4, ry: 6, fill: J, stroke: INK, "stroke-width": 4 }, front());
    await tween(450, k => { sp.setAttribute("cx", (cx + 40 + (ex - cx - 40) * k * .5).toFixed(0)); sp.setAttribute("rx", (4 + (ex - cx - 40) * .5 * k + 10).toFixed(0)); });
    const st = el("rect", { x: ex - 6, y: ty, width: 14, height: 0, rx: 7, fill: J, stroke: INK, "stroke-width": 3 }, front());
    const pd = el("ellipse", { cx: ex + 20, cy: fy, rx: 0, ry: 0, fill: J, stroke: INK, "stroke-width": 4 }, front());
    for (let i = 0; i < 5; i++) later(i * 110, () => blip(520 - i * 40, 300, .05, "sine"));
    await tween(500, k => st.setAttribute("height", ((fy - ty) * k).toFixed(0)));
    await tween(700, k => { pd.setAttribute("rx", (90 * k).toFixed(0)); pd.setAttribute("ry", (22 * k).toFixed(0)); st.setAttribute("width", (14 * (1 - k * .6)).toFixed(1)); });
    st.remove(); window.__sp = [sp, pd]; await sleep(300); h.armR.t = 0; surprise(h); markAbove(h, "ex"); await sleep(700); h.sadMouth = true; enter(a); await sleep(1000); },
  async bgtoire(h, a) { sit3(h); onDesk(h, "fries", .45); await sleep(600); hold(h, "shiver", 1.8); h.armL.t = 40; h.armR.t = -40; markAbove(h, "drop"); await sleep(1300); playMove(a, "look"); await sleep(300); },
  async bgbokuno(h, a) { sit3(h); onDesk(h, "fries", .45, 60); place(a, 1050, 975, .42); sit3(a); await sleep(600); a.armL.t = 100; a.dx.t = -60; await sleep(800); surprise(h); markAbove(h, "ex"); await sleep(400); },
  async bggochisou(h, a) { window.__tr = hp6(h, "btray", .4); enter(h); await sleep(1100); playMove(a, "bow"); await sleep(500); },
});
Object.assign(POST, {
  async abkutsu(h, a) { playMove(h, "crouch"); await sleep(500); const p = world(h, 200, 0); prop("sneakers", p.x - 20, 985, .5); chime(); await sleep(500); playMove(a, "nod"); joy(h); await sleep(400); },
  async abgyaku(h, a) { playMove(a, "nod"); await tween(700, k => { place(a, 550 + 150 * k, 570 + 190 * k, .7); }); a.lean.t = 0; await walk(a, -150, 600); joy(h); await sleep(300); },
  async abgyaku2(h, a) { playMove(a, "nod"); joy(a); await walk(h, -300, 900); jump(h, .5); await sleep(400); },
  async aboogoe(h, a) { playMove(a, "shy"); await sleep(400); a.mouthOpen.t = .2; await sleep(400); joy(h); await sleep(300); },
  async abshizuka(h, a) { playMove(a, "nod"); playMove(h, "bow"); await sleep(600); h.happyOn = true; await sleep(400); },
  async abwarikomi(h, a) { playMove(a, "frustrated"); await sleep(500); await tween(800, k => place(a, 700 + 300 * k, 300, .55)); playMove(a, "nod"); joy(h); await sleep(400); },
  async abosanai(h, a) { playMove(a, "bow"); await sleep(500); await tween(900, k => place(h, 300 + 420 * k, 300 + 460 * k, .5 + .38 * k)); jump(h, .4); joy(h); await sleep(400); },
  async abdoite(h, a) { playMove(a, "bow"); await walk(a, 300, 700); await sleep(300); await tween(900, k => place(h, 240 + 480 * k, 300 + 460 * k, .5 + .38 * k)); jump(h, .4); joy(h); await sleep(400); },
  async abchiisai(h, a) { playMove(a, "nod"); ((CUR_S && CUR_S.extras) || []).forEach(k => joy(C[k])); joy(h); await sleep(600); },
  async abnagenai(h, a) { playMove(a, "bow"); await sleep(500); joy(h); await sleep(300); },
  async abpoteto(h, a) { playMove(a, "nod"); await walk(a, 900, 1200); joy(h); await sleep(300); },
  async abkaeru(h, a) { playMove(a, "nod"); h.sadMouth = false; joy(h); await sleep(500); },
  async bgchumon(h, a) { playMove(a, "nod"); markAbove(a, "note"); await sleep(600); joy(h); await sleep(300); },
  async bgnomimono(h, a) { playMove(a, "nod"); const c = hp6(a, "cupdrink", .4); await sleep(600); joy(h); await sleep(300); },
  async bgkochira(h, a) { playMove(a, "bow"); const t = hp6(a, "numtag", .4); await sleep(500); t.remove(); hp6(h, "numtag", .4); joy(h); await sleep(400); },
  async bgbangou(h, a) { if (window.__tag) window.__tag.remove(); playMove(h, "pump"); await walk(h, 300, 800); hp6(h, "btray", .4); playMove(a, "nod"); joy(h); await sleep(400); },
  async bguketori(h, a) { if (window.__tr) window.__tr.remove(); hp6(h, "btray", .4); a.armR.t = -70; await sleep(500); a.armR.t = 0; playMove(h, "nod"); await sleep(400); },
  async bgseki(h, a) { playMove(a, "nod"); await sleep(500); ((CUR_S && CUR_S.extras) || []).forEach(k => { const c = C[k]; if (c.__desk) c.__desk.remove(); walk(c, 900, 1400); }); await sleep(1500); joy(h); await sleep(300); },
  async bgitadaki(h, a) { playMove(a, "nod"); h.happyOn = true; h.armL.t = h.armR.t = 0; await sleep(700); },
  async bgbetabeta(h, a) { hp6(a, "tissue", .4); await walk(a, -330, 800); if (window.__kc) window.__kc.remove(); hold(h, "shake", 1.2); await sleep(1200); joy(h); await sleep(300); },
  async bgkoboshita(h, a) { hp6(a, "rag", .35); await walk(a, -330, 800); playMove(a, "crouch"); await sleep(400); if (window.__pd) window.__pd.remove(); (window.__sp || []).forEach(e => e.remove()); h.sadMouth = false; playMove(h, "bow"); await sleep(500); },
  async bgtoire(h, a) { playMove(a, "nod"); if (h.__desk) h.__desk.remove(); h.armL.t = h.armR.t = 0; await walk(h, 900, 1200); },
  async bgbokuno(h, a) { a.armL.t = 0; a.dx.t = 0; playMove(a, "shy"); await sleep(500); h.armR.t = -70; await sleep(500); h.armR.t = 0; joy(a); joy(h); await sleep(400); },
  async bggochisou(h, a) { if (window.__tr) window.__tr.remove(); hp6(a, "btray", .4); playMove(h, "bow"); await sleep(600); playMove(a, "bow"); await sleep(400); },
});

/* ---------- 盤 ---------- */
STAGE_DEF.asobiba = { ground: "#FFF3D6", sky: "#CFEAFB", names: ["いりぐち", "いりぐち", "すべりだい", "すべりだい", "すべりだい", "ボールプール", "ボールプール", "すべりだい", "いりぐち"],
  fills: { いりぐち: "#FFE3B3", すべりだい: "#FFD1D9", ボールプール: "#D7ECFF" } };
STAGE_DEF.burger = { ground: "#FFF3D6", sky: "#CFEAFB", names: ["レジ", "レジ", "せき", "せき", "せき", "せき", "レジ", "せき", "レジ"],
  fills: { レジ: "#FFD1D9", せき: "#FFE3B3" } };
/* あそびば：いりぐち → すべりだい → ボールプール → すべりだい → いりぐち（かえる） */
{ const n = {}, pl = {}, nx = {};
  chain(["0", "1", "2", "3", "4", "f1"], [[200, 900], [400, 900], [600, 900], [800, 900], [1000, 900], [1200, 860]], "いりぐち", n, pl); pl["3"] = pl["4"] = pl.f1 = "すべりだい";
  chain(["a1", "a2", "a3", "a4"], [[1400, 760], [1440, 600], [1300, 500], [1100, 470]], "すべりだい", n, pl); pl.a3 = pl.a4 = "ボールプール";
  chain(["b1", "b2"], [[1100, 720], [920, 620]], "すべりだい", n, pl);
  chain(["m1", "m2", "f2"], [[900, 470], [700, 500], [500, 480]], "ボールプール", n, pl);
  chain(["c1", "c2", "c3"], [[360, 380], [460, 250], [680, 220]], "すべりだい", n, pl);
  chain(["d1"], [[700, 340]], "ボールプール", n, pl);
  chain(["e1", "e2"], [[880, 240], [1080, 240]], "いりぐち", n, pl);
  n["15"] = [1290, 250, "goal"]; pl["15"] = "いりぐち"; n["0"].push("start"); n["4"].push("block");
  linkLine(nx, ["0", "1", "2", "3", "4", "f1", "a1", "a2", "a3", "a4", "m1", "m2", "f2", "c1", "c2", "c3", "e1", "e2", "15"]); linkLine(nx, ["f1", "b1", "b2", "m1"]); linkLine(nx, ["f2", "d1", "e1"]);
  BOARD.asobiba = { nodes: n, place: pl, next: nx, away: [1000, 760], style: (a, b) => ["b1", "b2", "d1"].includes(a) || ["b1", "d1"].includes(b) ? "slide" : "hall",
    labels: [["いりぐち", 260, 990], ["すべりだい", 1460, 420], ["ボールプール", 700, 600], ["すべりだい", 360, 160], ["いりぐち", 1080, 160]] }; }
/* ハンバーガーやさん：レジ → せき → レジ（へんきゃく） */
{ const n = {}, pl = {}, nx = {};
  chain(["0", "1", "2", "3", "4", "f1"], [[220, 880], [420, 900], [620, 900], [820, 900], [1020, 900], [1220, 880]], "レジ", n, pl); pl["3"] = pl["4"] = pl.f1 = "せき";
  chain(["a1", "a2", "a3"], [[1400, 760], [1420, 580], [1300, 420]], "せき", n, pl);
  chain(["b1", "b2"], [[1120, 700], [1000, 560]], "せき", n, pl);
  chain(["m1", "m2", "f2"], [[1100, 340], [880, 300], [660, 320]], "せき", n, pl);
  chain(["c1", "c2", "c3"], [[440, 360], [300, 500], [380, 660]], "レジ", n, pl);
  chain(["d1"], [[620, 520]], "せき", n, pl);
  n["15"] = [600, 700, "goal"]; pl["15"] = "レジ"; n["0"].push("start"); n["4"].push("block");
  linkLine(nx, ["0", "1", "2", "3", "4", "f1", "a1", "a2", "a3", "m1", "m2", "f2", "c1", "c2", "c3", "15"]); linkLine(nx, ["f1", "b1", "b2", "m1"]); linkLine(nx, ["f2", "d1", "15"]);
  BOARD.burger = { nodes: n, place: pl, next: nx, away: [1300, 760], style: (a, b) => ["b1", "b2", "d1"].includes(a) || ["b1", "d1"].includes(b) ? "hall" : "classwood",
    labels: [["レジ", 260, 990], ["せき", 1470, 330], ["せき", 880, 200], ["レジ", 300, 300]] }; }
Object.assign(BOARD_BG, {
  asobiba(L) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFF3D6" }, L); el("rect", { x: 40, y: 40, width: 1520, height: 920, rx: 40, fill: "#BDE3F2", opacity: .5, ...S6(5) }, L);
    el("ellipse", { cx: 700, cy: 560, rx: 240, ry: 110, fill: "#7FCBF0", ...S6(5) }, L); for (let i = 0; i < 14; i++) el("circle", { cx: 500 + (i * 61) % 400, cy: 520 + (i * 37) % 80, r: 16, fill: ["#FF6F91", "#FFD25E", "#7BD389", "#B9A8D9"][i % 4], ...S6(3) }, L);
    el("path", { d: "M1300 500 Q1500 560 1440 760", fill: "none", stroke: "#E8473C", "stroke-width": 40, "stroke-linecap": "round" }, L);
    el("rect", { x: 60, y: 40, width: 520, height: 110, rx: 10, fill: "#FFFFFF", ...S6(6) }, L); txt(L, 320, 115, "🍔 あそびば", 48, { "text-anchor": "middle" }); },
  burger(L) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFF3D6" }, L); for (let x = 0; x < 1600; x += 100) el("path", { d: `M${x} 0 V1000`, stroke: "#00000010", "stroke-width": 4 }, L);
    [[60, 760, 520, 230, "#FFD1D9"], [1180, 300, 400, 560, "#FFE9C7"], [560, 160, 640, 260, "#FFE9C7"]].forEach(([x, y, w, h, c]) => el("rect", { x, y, width: w, height: h, rx: 30, fill: c, ...S6(5) }, L));
    el("rect", { x: 60, y: 40, width: 460, height: 110, rx: 10, fill: "#E8473C", ...S6(6) }, L); txt(L, 290, 115, "🍔 ハンバーガーやさん", 40, { "text-anchor": "middle", fill: "#FFFFFF" });
    const t = el("g", { transform: "translate(1400 160) scale(.7)" }, L); ITEM2.burger(t); },
});
BLOCK_DEF.asobiba = { who: "tenin", sleep: false, intro: ["p_blk_asobiba", "かかりの ひとが くつを ならべて いるよ。とおして もらおう"], say: ["blk_asobiba", "すみません、とおして ください"], to: "かかりの ひとに いおう",
  keys: [["とおして", "通して"]], res: ["rs_asobiba", "はい、どうぞ。きを つけてね"] };
BLOCK_DEF.burger = { who: "kamejii", sleep: false, intro: ["p_blk_burger", "かめじいが トレーを もって とおれないよ。みちを あけて あげよう"], say: ["blk_burger", "どうぞ、おさきに"], to: "かめじいに いおう",
  keys: [["どうぞ"], ["おさき", "お先"]], res: ["rs_burger", "ほっほ、どうぞ どうぞ"] };
S6L.forEach(st => SLEEPER_OF[st] = BLOCK_DEF[st].who);
Object.assign(EVENTS, {
  asobiba: { a2: ["fwd", 2, "ev_asobibaf", "くつを きれいに そろえた！ 2マス すすむよ"], m2: ["back", 2, "ev_asobibab", "くつしたで すべって ころんだ！ 2マス もどるよ"], d1: ["home", 0, "ev_asobibah", "ボールプールで ボールに うもれた！ スタートに もどるよ"] },
  burger: { a2: ["fwd", 2, "ev_burgerf", "ポテトの おまけが ついてきた！ 2マス すすむよ"], m2: ["back", 2, "ev_burgerb", "ばんごうを ききのがした！ 2マス もどるよ"], d1: ["home", 0, "ev_burgerh", "おさいふを わすれた！ スタートに もどるよ"] },
});
