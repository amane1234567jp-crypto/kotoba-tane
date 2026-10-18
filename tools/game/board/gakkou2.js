/* ================= がっこう2（国語のテスト対策）：キャラどうしの やりとりを 見てから、先生に こたえる =================
   場面データ（sits.json）の talk を 声つきで 順に 再生しながら、場面ごとの 動き（STORY）を つける。
   声のキー：st_<場面>_<番号>（やりとり）、sa_（ぽにーのお手本）、sq_/sr_（先生）、se_<場面>_<番号>（先生の返事のあとの やりとり）。
   見ている主人公は 左、やりとりする友だちは まんなか〜右、先生は あとから 右から 来る。 */
const KID_S = { gao: .9, pyon: .88, mii: .88, chu: .46, doshin: 1.0, kon: .9, shima: .86 };
const CAST_X = { 2: [800, 1120], 3: [660, 920, 1180] };
let STORY_CAST = {};
const setSitViewBase = setSitView;
setSitView = function (s, heroKind) {
  if (!s.cast) return setSitViewBase(s, heroKind);
  clearMarks(); view = "scene"; chars.forEach(c => c.root.style.display = "none"); visible.length = 0; unsay(); showEar(null, false); hideTask();
  boardLayer.style.display = "none"; sceneLayer.style.display = ""; hud.style.display = "none"; diceBtn.style.visibility = "hidden";
  drawRoom(s.place); propG = el("g", {}, sceneLayer);
  const hero = C[heroKind], ask = C[s.asker];
  [C.pony, C.shima, hero, ask, ...s.cast.map(k => C[k])].forEach(resetChar);
  place(C.pony, 100, 975, .42); show(C.pony);
  if (MODE === "solo" && heroKind !== "shima") { place(C.shima, 250, 975, .55); show(C.shima); place(hero, 430, 975, KID_S[heroKind] || .8); }
  else place(hero, 330, 975, KID_S[heroKind] || .8);
  show(hero);
  STORY_CAST = {};
  const xs = (STORY_POS[s.id] || CAST_X[s.cast.length]);
  s.cast.forEach((k, i) => { const c = C[k]; place(c, xs[i], 975, KID_S[k] || .78); show(c); STORY_CAST[k] = c; });
  const [, as] = ASK_AT[s.asker]; place(ask, 120, 975, as * .95); show(ask); ask.dx.v = ask.dx.t = -1000; // 先生は あとで 左から 来る（ほかの 子を 追いこさない 2026-10-18）
  return { hero, ask };
};
const STORY_POS = { happyou: [740, 1000, 1220], taiko: [640, 930, 1210], soup: [640, 1080, 1290], oogoe: [660, 920, 1180], dodge: [720, 1020, 1240], nawatobi: [700, 960, 1190], enogu: [740, 1270], ninjin: [760, 1130], honsagashi: [800, 1180] };
const playIntroBase = playIntro;
playIntro = async function (s, h, a) {
  if (s.intro !== "story") return playIntroBase(s, h, a);
  const cast = STORY_CAST, line = async i => { const [who, text] = s.talk[i]; const c = cast[who]; if (!text.replace(/[…。、 ]/g, "")) { await sleep(1300); return; } await speak(c, `st_${s.id}_${i}`, text); };
  await sleep(500);
  if (STORY[s.id]) await STORY[s.id](cast, line, h); else for (let i = 0; i < s.talk.length; i++) await line(i);
  await sleep(400);
  // 先生が 来て、主人公の ほうを 向く
  // 主人公は すこし 右へ、ぽにーは はしへ よけて、先生が 左から 来て 主人公の となりに 立つ
  if (h !== C.shima && visible.includes(C.shima)) walk(C.shima, 170, 600); walk(h, 170, 600); tween(500, k => place(C.pony, 100 - 90 * k, 975, .42 - .1 * k));
  a.dx.t = 0; hold(a, "run", 1.2); await sleep(1300); playMove(a, "nod"); await sleep(400);
};
// 先生の 返事の あとの やりとり（あやまる・なかなおり など）
const resolveBase = resolve;
resolve = async function (s, h, a, ok) {
  if (s.intro !== "story") return resolveBase(s, h, a, ok);
  if (ok) { playMove(h, "nod"); confetti(40); }
  await speak(a, "sr_" + s.id, s.res);
  if (STORY_POST[s.id]) await STORY_POST[s.id](STORY_CAST, h, a);
  for (let i = 0; i < (s.after || []).length; i++) { const [who, text] = s.after[i]; await speak(STORY_CAST[who], `se_${s.id}_${i}`, text); }
  if (STORY_END[s.id]) await STORY_END[s.id](STORY_CAST, h, a); else if (ok) playMove(a, "nod");
  await sleep(600);
};
/* ---------- 物の絵 ---------- */
Object.assign(ITEM2, {
  eraser(g) { el("rect", { x: -50, y: -26, width: 100, height: 52, rx: 10, fill: "#FFFFFF", ...S6p() }, g); el("rect", { x: -50, y: -26, width: 40, height: 52, rx: 8, fill: "#7FCBF0", ...S6p(5) }, g); },
  recorder(g) { el("rect", { x: -14, y: -120, width: 28, height: 240, rx: 12, fill: "#F6E7C8", ...S6p() }, g); [-60, -25, 10, 45].forEach(y => el("circle", { cx: 0, cy: y, r: 6, fill: INK }, g)); },
  drum(g) { el("rect", { x: -90, y: -60, width: 180, height: 120, rx: 14, fill: "#E8473C", ...S6p() }, g); el("ellipse", { cx: 0, cy: -60, rx: 90, ry: 24, fill: "#F6EEDF", ...S6p() }, g); el("path", { d: "M-90 -40 L-40 50 L10 -40 L60 50 L90 -10", fill: "none", stroke: "#FFD25E", "stroke-width": 7 }, g); },
  stick(g) { el("path", { d: "M0 0 L0 -110", ...S6p(10) }, g); el("circle", { cx: 0, cy: -116, r: 14, fill: "#F6EEDF", ...S6p(5) }, g); },
  easel(g) { el("path", { d: "M-90 160 L-40 -150 M90 160 L40 -150 M0 -170 V160", fill: "none", stroke: "#B9824A", "stroke-width": 14, "stroke-linecap": "round" }, g); el("rect", { x: -110, y: -150, width: 220, height: 170, rx: 6, fill: "#FFFFFF", ...S6p() }, g);
    [[-60, -60, "#FFC94D"], [0, -70, "#A9BEDD"], [55, -55, "#FF8FA3"]].forEach(([x, y, c]) => { el("circle", { cx: x, cy: y, r: 22, fill: c, ...S6p(4) }, g); el("path", { d: `M${x} ${y + 22} V${y + 70} M${x - 18} ${y + 42} H${x + 18}`, fill: "none", ...S6p(4) }, g); }); },
  paintcup(g) { el("path", { d: "M-34 -40 H34 L28 40 H-28 Z", fill: "#BDE3F2", ...S6p() }, g); el("rect", { x: -30, y: -30, width: 60, height: 22, fill: "#3E9BD6" }, g); },
  splat(g) { el("path", { d: "M-60 0 Q-70 -40 -30 -40 Q-10 -70 20 -45 Q60 -55 55 -10 Q80 20 40 35 Q20 65 -10 40 Q-50 55 -55 25 Q-85 15 -60 0 Z", fill: "#3E9BD6", ...S6p(4) }, g); },
  clayrabbit(g) { el("ellipse", { cx: 0, cy: 20, rx: 46, ry: 40, fill: "#FFFFFF", ...S6p() }, g); [-18, 18].forEach(x => el("ellipse", { cx: x, cy: -50, rx: 12, ry: 40, fill: "#FFFFFF", ...S6p(5) }, g)); [-14, 14].forEach(x => el("circle", { cx: x, cy: 14, r: 5, fill: INK }, g)); },
  claycat(g) { el("ellipse", { cx: 0, cy: 20, rx: 46, ry: 40, fill: "#B9A8D9", ...S6p() }, g); el("path", { d: "M-40 -4 L-30 -44 L-8 -18 M40 -4 L30 -44 L8 -18", fill: "#B9A8D9", ...S6p(5) }, g); [-14, 14].forEach(x => el("circle", { cx: x, cy: 14, r: 5, fill: INK }, g)); el("path", { d: "M44 30 Q80 20 70 -10", fill: "none", ...S6p(8) }, g); },
  clay(g) { el("ellipse", { cx: 0, cy: 0, rx: 50, ry: 32, fill: "#C9A27A", ...S6p() }, g); },
  tray(g) { el("rect", { x: -110, y: -16, width: 220, height: 32, rx: 10, fill: "#F2C38F", ...S6p() }, g); el("path", { d: "M-80 -16 Q-80 -56 -40 -56 Q0 -56 0 -16", fill: "#FFFFFF", ...S6p(5) }, g); el("rect", { x: 20, y: -46, width: 70, height: 30, rx: 8, fill: "#FFFFFF", ...S6p(5) }, g); },
  bowl(g) { el("path", { d: "M-60 -20 H60 Q60 40 0 40 Q-60 40 -60 -20 Z", fill: "#FFFFFF", ...S6p() }, g); el("ellipse", { cx: 0, cy: -20, rx: 60, ry: 12, fill: "#F2B04A", ...S6p(4) }, g); },
  puddle(g) { el("ellipse", { rx: 130, ry: 26, fill: "#F2B04A", opacity: .85, ...S6p(4) }, g); },
  carrot2(g) { el("path", { d: "M-24 -10 L24 -10 L0 34 Z", fill: "#F29F38", ...S6p(5) }, g); },
  rope(g) { el("path", { d: "M-120 0 Q0 -260 120 0", fill: "none", stroke: "#E8473C", "stroke-width": 9, "stroke-linecap": "round" }, g); },
  desk(g) { el("rect", { x: -130, y: -20, width: 260, height: 26, rx: 6, fill: "#D9A066", ...S6p() }, g); el("rect", { x: -120, y: 6, width: 240, height: 70, rx: 6, fill: "#C98A4B", ...S6p(5) }, g); },
});
/* 席に ついている子：つくえを 手前に かいて、こしから下を かくす */
function seat(c, w) { const feet = c.y + c.base * c.s, top = world(c, 200, c.top).y, H = feet - top, dt = feet - H * .36, cx = c.x + 200 * c.s;
  const W = w || Math.max(150, 290 * c.s), g = el("g", {}, front());
  el("rect", { x: cx - W / 2, y: dt, width: W, height: 24, rx: 6, fill: "#D9A066", ...S6p() }, g); el("rect", { x: cx - W / 2 + 12, y: dt + 24, width: W - 24, height: feet - dt - 14, rx: 6, fill: "#C98A4B", ...S6p(5) }, g); return g; }
function standUp(c) { jump(c, .4); }
const at = (c, lx, ly) => world(c, lx, ly);
const sq = () => { if (!ctx) return; blip(1900, 2300, .18, "square"); later(60, () => blip(2400, 1800, .14, "square")); }; // リコーダーの ピーッ
const tap = (f = 160, v = .5) => { if (!ctx) return; noise(.08, 400, v); blip(f, f * .6, .12, "sine"); };

/* ---------- 場面ごとの 動き ---------- */
const STORY = {
  async keshigomu(c, line) { const { chu, gao } = c; const d1 = seat(chu), d2 = seat(gao);
    const e0 = at(gao, 290, 0), dy = d2.firstChild.getAttribute("y") - 14; const er = prop("eraser", e0.x, dy, .5); front().appendChild(er); window.__er = er; hold(chu, "shake", 1); await sleep(900);
    playMove(chu, "look"); markAbove(chu, "q"); await line(0);
    gao.armR.t = -120; const hp = at(gao, 320, 150); moveProp(er, e0.x, dy, hp.x, hp.y, 400, .5, 40); await line(1); gao.armR.t = 0; moveProp(er, hp.x, hp.y, e0.x, dy, 400, .5, 20);
    chu.sadMouth = true; markAbove(chu, "anger"); await line(2);
    playMove(gao, "shy"); await line(3);
    tears(chu, 2.5); playMove(chu, "sad"); await line(4); },
  async happyou(c, line) { const { pyon, mii, doshin } = c; seat(mii); seat(doshin);
    await line(0); hold(pyon, "shiver", 3); for (let i = 0; i < 3; i++) later(i * 400, () => markAbove(pyon, "drop", { dx: i % 2 ? 60 : -60, vy: 50 }));
    await line(1); hold(doshin, "clap", 1.4); await line(2);
    jump(pyon, .6); pyon.armR.t = -120; await line(3); pyon.armR.t = 0;
    hold(mii, "clap", 2); hold(doshin, "clap", 2); for (let i = 0; i < 6; i++) later(i * 150, () => blip(1200 + i * 60, 900, .05, "square")); await line(4);
    joy(pyon); await line(5); },
  async recorder(c, line) { const { mii, gao } = c; const r = prop("recorder", 0, 0, .3); follow(r, () => { const p = at(mii, 200, 285); return [p.x, p.y, 0, .3 * mii.s / .78]; });
    tune([[N.C5, 1], [N.D5, 1], [N.E5, 1]], 160, "sine", .12); later(900, sq); later(1000, () => { surprise(mii); markAbove(mii, "ex"); }); await sleep(1200); await line(0);
    playMove(gao, "laugh"); await line(1);
    tune([[N.C5, 1], [N.D5, 1], [N.E5, 1], [N.C5, 1], [N.D5, 1], [N.E5, 1]], 170, "sine", .12); await sleep(2200); await line(2);
    later(100, sq); playMove(mii, "frustrated"); await sleep(400); await line(3);
    playMove(mii, "pump"); await sleep(400); tune([[N.E5, 1], [N.D5, 1], [N.C5, 1], [N.D5, 1], [N.E5, 1], [N.E5, 1], [N.E5, 2]], 170, "sine", .13);
    for (let i = 0; i < 5; i++) later(i * 380, () => markAbove(mii, "note", { dx: i % 2 ? 80 : -80 })); await sleep(2700); joy(mii); await line(4); },
  async taiko(c, line) { const { pyon, doshin, chu } = c; const dr = prop("drum", 0, 0, .7); follow(dr, () => { const p = at(doshin, 200, 330); return [p.x, p.y + 40, 0, .7]; });
    playMove(pyon, "point"); await line(0);
    doshin.armR.t = -150; await line(1); doshin.armR.t = 40; boom(1.2); flash(); shake(600, 30); markAbove(doshin, "ex"); { const t = slam("ドーン！！", 330, 150, "#E8473C"); later(1300, () => t.remove()); }
    surprise(chu); surprise(pyon); chu.armL.t = -150; chu.armR.t = 150; hold(chu, "shiver", 2); await sleep(400); await line(2); chu.armL.t = 0; chu.armR.t = 0;
    playMove(doshin, "shy"); markAbove(doshin, "drop"); await line(3);
    await line(4);
    for (let i = 0; i < 4; i++) later(i * 380, () => { doshin.armR.t = i % 2 ? -30 : 20; tap(180, .25); }); await sleep(1400); doshin.armR.t = 0; await line(5); },
  async enogu(c, line, h) { const { chu, gao } = c;
    const ea = prop("easel", 960, 760, .9); const st = el("g", {}, propG); el("rect", { x: 1080, y: 840, width: 90, height: 135, rx: 8, fill: "#C98A4B", ...S6p(5) }, st); const cup = prop("paintcup", 1125, 815, .5); window.__easel = ea;
    gao.dx.v = gao.dx.t = 700; hold(chu, "shake", 2.4); later(300, () => markAbove(chu, "note")); await line(0);
    gao.dx.t = 0; hold(gao, "run", 1.2); await line(1); await sleep(300);
    thud(); boom(.4); flop(gao); await moveProp(cup, 1125, 815, 970, 680, 380, .5, 160, 200); cup.remove();
    const sp = prop("splat", 960, 700, .1); await tween(220, k => sp.setAttribute("transform", `translate(960 700) scale(${(.1 + .7 * k).toFixed(2)})`)); window.__splat = sp; noise(.2, 800, .5);
    surprise(chu); markAbove(chu, "ex"); await line(2);
    playMove(gao, "bow"); await line(3);
    chu.sadMouth = true; playMove(chu, "nod"); await line(4); chu.sadMouth = false; },
  async nendo(c, line) { const { pyon, mii } = c; const tb = el("g", {}, front()); el("rect", { x: 640, y: 870, width: 640, height: 26, rx: 8, fill: "#D9A066", ...S6p() }, tb); el("rect", { x: 660, y: 896, width: 600, height: 79, rx: 6, fill: "#C98A4B", ...S6p(5) }, tb);
    const F = g => (tb.appendChild(g), g); const cl1 = F(prop("clay", 900, 850, .8)), cl2 = F(prop("clay", 1060, 850, .8)); hold(pyon, "shake", 1.6); hold(mii, "shake", 1.6); await sleep(900);
    await line(0); cl2.remove(); const cat = F(prop("claycat", 1080, 830, .9)); markAbove(mii, "sparkle"); await line(1);
    cl1.remove(); const rb = F(prop("clayrabbit", 880, 830, .9)); markAbove(pyon, "sparkle"); await line(2);
    joy(mii); await line(3);
    await Promise.all([moveProp(rb, 880, 830, 940, 830, 500, .9), moveProp(cat, 1080, 830, 1030, 830, 500, .9)]); joy(pyon); markAbove(pyon, "heart"); await line(4); },
  async ninjin(c, line, h) { const { gao, doshin } = c; // 主人公が にがてな にんじんを たべて みる
    const dh = seat(h), d1 = seat(gao, 300), d2 = seat(doshin, 300), F = g => (front().appendChild(g), g), ty = +dh.firstChild.getAttribute("y");
    [h, gao, doshin].forEach(k => F(prop("tray", at(k, 200, 0).x, ty - 6, .7)));
    const hx = at(h, 200, 0).x, cr = [0, 1, 2].map(i => F(prop("carrot2", hx - 40 + i * 30, ty - 30, .6))); await sleep(500);
    await line(0);
    h.sadMouth = true; playMove(h, "no"); cr.forEach((g, i) => moveProp(g, hx - 40 + i * 30, ty - 30, hx + 70 + i * 14, ty - 26, 500, .6)); await sleep(700);
    gao.eyeX.t = -14; await line(1); gao.eyeX.t = 0;
    playMove(doshin, "point"); await line(2);
    h.sadMouth = false; const p = at(h, 200, 230); await moveProp(cr[0], hx + 70, ty - 26, p.x, p.y, 500, .6, 60); cr[0].remove();
    for (let i = 0; i < 4; i++) later(i * 220, () => { h.mouthOpen.t = i % 2 ? 0 : .5; }); await sleep(1000); h.mouthOpen.t = 0;
    surprise(h); await sleep(500); h.happyOn = true; markAbove(h, "sparkle"); markAbove(h, "heart", { dx: 80 }); await sleep(800);
    playMove(gao, "point"); await line(3); },
  async soup(c, line) { const { chu, pyon, doshin } = c; chu.dx.v = chu.dx.t = -120; const tr = prop("tray", 0, 0, .55);
    follow(tr, () => { const q = at(chu, 200, 300); return [q.x, q.y, 0, .55]; }); window.__tray = tr;
    hold(chu, "tiptoe", 2.6); await walk(chu, 150, 1400); await line(0);
    await walk(chu, 140, 500); thud(); flop(chu); tr.remove(); const b = prop("bowl", at(chu, 200, 0).x + 60, 830, .5);
    await moveProp(b, at(chu, 200, 0).x + 60, 830, at(chu, 200, 0).x + 180, 900, 300, .5, 60, 120); const pd = prop("puddle", at(chu, 200, 0).x + 170, 935, 1); window.__pud = pd; noise(.3, 900, .5);
    await line(1); surprise(pyon); surprise(doshin);
    await line(2); hold(pyon, "run", .8); pyon.dx.t = 800; await sleep(800);
    await walk(doshin, -120, 600); await line(3); playMove(doshin, "crouch"); hand(doshin, prop("rag", 0, 0, .3), .3, 0);
    pyon.dx.t = -60; hold(pyon, "run", .9); await sleep(900); hand(pyon, prop("rag", 0, 0, .3), .3, 0); playMove(pyon, "crouch"); hold(pyon, "shake", 1.6); hold(doshin, "shake", 1.6);
    tween(1600, k => pd.setAttribute("opacity", (1 - k * .9).toFixed(2))); await sleep(1600);
    chu.happyOn = true; await line(4); },
  async honsagashi(c, line) { const { mii, doshin } = c; mii.dx.v = mii.dx.t = -220; doshin.dx.v = doshin.dx.t = 700;
    const bk = el("g", {}, propG); el("rect", { x: -20, y: -55, width: 40, height: 110, rx: 4, fill: "#7CC36A", ...S6p(5) }, bk); el("path", { d: "M-10 -20 q10 -14 20 0", fill: "none", ...S6p(3) }, bk); bk.setAttribute("transform", "translate(1250 215)");
    playMove(mii, "look"); await walk(mii, 120, 900); await line(0);
    await walk(mii, 120, 700); markAbove(mii, "ex"); mii.armR.t = -150; hold(mii, "tiptoe", 2.5); for (let i = 0; i < 3; i++) later(400 + i * 500, () => jump(mii, .3)); await line(1);
    doshin.dx.t = 40; hold(doshin, "run", 1); await sleep(1000); mii.armR.t = 0; await line(2); doshin.armL.t = 150;
    await sleep(500); await moveProp(bk, 1250, 215, at(mii, 330, 300).x, at(mii, 330, 300).y, 700, 1, 60, -20); bk.remove(); hand(mii, prop("book", 0, 0, .35), .35, 0); doshin.armL.t = 0;
    joy(mii); await line(3); playMove(doshin, "nod"); await line(4); },
  async oogoe(c, line) { const { gao, pyon, chu } = c; [gao, pyon, chu].forEach(k => hand(k, prop("book", 0, 0, .35), .35, -6)); await sleep(1500);
    playMove(gao, "laugh"); for (let i = 0; i < 4; i++) later(i * 250, () => { markAbove(gao, "ex", { dx: i % 2 ? 90 : -90 }); blip(500, 700, .1, "square"); }); jump(gao, .4); await line(0);
    pyon.eyeX.t = -14; chu.eyeX.t = -14; markAbove(pyon, "q"); pyon.armR.t = -100; await line(1); pyon.armR.t = 0;
    await line(2);
    surprise(gao); gao.armR.t = -150; gao.armL.t = 150; playMove(gao, "shy"); await line(3); gao.armR.t = 0; gao.armL.t = 0; pyon.eyeX.t = 0; chu.eyeX.t = 0; },
  async dodge(c, line) { const { gao, pyon, mii } = c;
    const b = prop("ball", 0, 0, .4); follow(b, () => { const p = at(gao, 330, 260); return [p.x, p.y, 0, .4]; }); window.__ball = b;
    gao.armR.t = -150; await line(0); gao.armR.t = 60; b.remove(); const p0 = at(gao, 330, 260), p1 = at(pyon, 200, 220);
    const fly = prop("ball", p0.x, p0.y, .4); await moveProp(fly, p0.x, p0.y, p1.x, p1.y, 380, .4, 80, 360); thud(); flop(pyon); markAbove(pyon, "ex");
    await moveProp(fly, p1.x, p1.y, p1.x + 220, 930, 400, .4, 120, 360); gao.armR.t = 0;
    await line(1); tears(pyon, 1.2);
    hold(mii, "run", .9); await walk(mii, -170, 700); playMove(mii, "crouch"); await line(2);
    await line(3); playMove(mii, "nod"); await line(4); },
  async nawatobi(c, line) { const { chu, gao, doshin } = c;
    // なわとび：なわの りょうはしは ちゅうの て。なわは あたまの うえ → まえ → あしの した と まわる（よこから 見た まわしかた）
    const rp = el("path", { fill: "none", stroke: "#E8473C", "stroke-width": 9, "stroke-linecap": "round" }, front()); let ph = 0;
    addTick(() => { if (!rp.isConnected) return false; const L = world(chu, 70, 340), R = world(chu, 330, 340), top = world(chu, 200, (chu.top || 30) - 50).y, feet = world(chu, 200, (chu.base || 416) + 18).y;
      const hy = (L.y + R.y) / 2, mid = (top + feet) / 2 - (feet - top) / 2 * Math.cos(ph), cy = 2 * mid - hy;
      rp.setAttribute("d", `M${L.x.toFixed(1)} ${L.y.toFixed(1)} Q${((L.x + R.x) / 2).toFixed(1)} ${cy.toFixed(1)} ${R.x.toFixed(1)} ${R.y.toFixed(1)}`);
      chu.armL.t = 30 + 25 * Math.sin(ph); chu.armR.t = -30 - 25 * Math.sin(ph); });
    // 1かい まわして、あしの したに きた ところで ひっかかる
    const spin = ms => tween(ms, k => { ph = k * Math.PI; }).then(() => { ph = Math.PI; });
    const turn = async () => { ph = 0; await sleep(200); await spin(600); jump(chu, .5); await sleep(150); thud(); flop(chu); await sleep(500); await tween(400, k => { ph = Math.PI * (1 + k); }); };
    await line(0); await turn(); await sleep(200);
    await line(1); await turn(); await sleep(200);
    playMove(gao, "laugh"); markAbove(gao, "note"); await line(2);
    chu.headRot.t = 0; chu.headY.t = 30; chu.sadMouth = true; chu.eyeY.t = 12; await sleep(1500);
    playMove(doshin, "no"); await line(4);
    surprise(gao); playMove(gao, "bow"); await line(5); },
};
const STORY_POST = {
  async keshigomu(c) { const { chu, gao } = c; playMove(gao, "bow"); await sleep(800); },
  async happyou(c) { },
  async enogu(c) { },
  async nawatobi(c) { const { chu } = c; chu.headY.t = 0; chu.eyeY.t = 0; chu.sadMouth = false; },
};
const STORY_END = {
  async keshigomu(c) { const { chu, gao } = c; const er = window.__er; if (er) { const b = er.transform.baseVal.consolidate().matrix, q = at(chu, 250, 0); await moveProp(er, b.e, b.f, q.x, b.f, 600, .5, 80); } chu.happyOn = true; joy(gao); await sleep(500); },
  async happyou(c) { joy(c.pyon); hold(c.mii, "clap", 1.2); await sleep(500); },
  async recorder(c) { const { gao, mii } = c; await walk(gao, -150, 600); joy(mii); await sleep(400); },
  async taiko(c) { const { doshin } = c; for (let i = 0; i < 6; i++) later(i * 300, () => tap(160 + (i % 3) * 30, .3)); hold(c.pyon, "dance", 1.8); hold(c.chu, "dance", 1.8); await sleep(1800); },
  async enogu(c) { const { chu, gao } = c; await walk(gao, -60, 500); playMove(chu, "crouch"); playMove(gao, "crouch"); hold(chu, "shake", 1.4); hold(gao, "shake", 1.4); await sleep(1400); joy(chu); joy(gao); },
  async nendo(c) { joy(c.pyon); joy(c.mii); await sleep(400); },
  async ninjin(c, h) { joy(c.doshin); h.happyOn = false; await sleep(400); },
  async soup(c) { joy(c.chu); await sleep(400); },
  async honsagashi(c) { const { mii, doshin } = c; await walk(doshin, -120, 600); joy(mii); await sleep(400); },
  async oogoe(c) { const { gao } = c; gao.happyOn = true; playMove(gao, "nod"); await sleep(800); },
  async dodge(c) { const { pyon, mii } = c; jump(pyon, .5); pyon.happyOn = true; await sleep(400); walk(pyon, 900, 2000); await walk(mii, 900, 2000); },
  async nawatobi(c) { const { chu, gao } = c; joy(chu); await walk(gao, -120, 600); hold(gao, "dance", 1.2); await sleep(600); },
};

/* ---------- 部屋の 背景（がっこう2） ---------- */
const ROOMS2 = {
  きょうしつ(L) { el("rect", { x: 380, y: 170, width: 760, height: 300, rx: 10, fill: "#2F6B4F", ...S6(8) }, L); el("rect", { x: 380, y: 470, width: 760, height: 18, fill: "#B9824A", ...S6(5) }, L);
    txt(L, 520, 250, "こくご", 48, { fill: "#FFFFFF" }); el("path", { d: "M520 300 H900 M520 360 H820 M520 420 H960", stroke: "#FFFFFF", "stroke-width": 6, "stroke-dasharray": "40 18", opacity: .7 }, L);
    el("circle", { cx: 1290, cy: 190, r: 56, fill: "#FFFFFF", ...S6(6) }, L); el("path", { d: "M1290 190 V150 M1290 190 L1320 205", ...S6(6) }, L);
    [1220, 1380].forEach(x => el("rect", { x, y: 300, width: 140, height: 200, rx: 8, fill: "#CFEAFB", ...S6(6) }, L)); },
  おんがくしつ(L) { el("rect", { x: 300, y: 180, width: 700, height: 220, rx: 10, fill: "#FFFFFF", ...S6(8) }, L);
    for (let i = 0; i < 5; i++) el("path", { d: `M330 ${220 + i * 32} H970`, stroke: INK, "stroke-width": 4 }, L);
    [[420, 300], [520, 268], [620, 236], [720, 268], [820, 300]].forEach(([x, y]) => { el("ellipse", { cx: x, cy: y, rx: 18, ry: 13, fill: INK }, L); el("path", { d: `M${x + 16} ${y} V${y - 70}`, stroke: INK, "stroke-width": 5 }, L); });
    el("rect", { x: 1120, y: 420, width: 400, height: 210, rx: 10, fill: "#2B2A33", ...S6(6) }, L); for (let x = 1140; x < 1500; x += 34) el("rect", { x, y: 560, width: 30, height: 60, fill: "#FFFFFF" }, L);
    txt(L, 1320, 500, "ピアノ", 40, { fill: "#FFFFFF", "text-anchor": "middle" }); },
  ずこうしつ(L) { [[300, 200, "#FF8FA3"], [520, 230, "#7FCBF0"], [1260, 200, "#FFD25E"]].forEach(([x, y, c]) => { el("rect", { x, y, width: 170, height: 130, rx: 6, fill: "#FFFFFF", ...S6(6) }, L); el("circle", { cx: x + 85, cy: y + 65, r: 36, fill: c, ...S6(4) }, L); });
    el("rect", { x: 760, y: 220, width: 420, height: 240, rx: 8, fill: "#C98A4B", ...S6(6) }, L); for (let i = 0; i < 2; i++) el("path", { d: `M760 ${300 + i * 80} H1180`, ...S6(5) }, L);
    [800, 880, 960, 1040, 1120].forEach((x, i) => el("rect", { x, y: 250 + (i % 2) * 6, width: 50, height: 40, rx: 8, fill: ["#E8473C", "#FFD25E", "#7CC36A", "#3E9BD6", "#B9A8D9"][i], ...S6(4) }, L)); },
  きゅうしょく(L) { el("rect", { x: 380, y: 170, width: 640, height: 280, rx: 10, fill: "#2F6B4F", ...S6(8) }, L); txt(L, 430, 250, "きょうの こんだて", 40, { fill: "#FFFFFF" });
    ["カレー", "サラダ", "ぎゅうにゅう"].forEach((t, i) => txt(L, 460, 320 + i * 48, "・" + t, 34, { fill: "#FFFFFF" }));
    el("rect", { x: 1140, y: 420, width: 330, height: 220, rx: 14, fill: "#E3E3E3", ...S6(6) }, L); el("rect", { x: 1170, y: 360, width: 120, height: 70, rx: 20, fill: "#BDBDBD", ...S6(5) }, L); el("rect", { x: 1310, y: 370, width: 120, height: 60, rx: 10, fill: "#F2B04A", ...S6(5) }, L);
    [1180, 1430].forEach(x => el("circle", { cx: x, cy: 650, r: 18, fill: "#555", ...S6(4) }, L)); },
  たいいくかん(L) { el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#E9C893" }, L); for (let x = 0; x < 1600; x += 120) el("path", { d: `M${x} 760 V1000`, stroke: "#D9B57A", "stroke-width": 4 }, L);
    el("path", { d: "M0 900 H1600", stroke: "#FFFFFF", "stroke-width": 6 }, L);
    el("rect", { x: 1280, y: 180, width: 180, height: 120, rx: 6, fill: "#FFFFFF", ...S6(6) }, L); el("rect", { x: 1330, y: 230, width: 80, height: 50, fill: "none", stroke: "#E8473C", "stroke-width": 5 }, L); el("ellipse", { cx: 1370, cy: 316, rx: 50, ry: 12, fill: "none", stroke: "#E8735A", "stroke-width": 7 }, L);
    el("rect", { x: 260, y: 150, width: 820, height: 70, rx: 10, fill: "#C24A4A", ...S6(6) }, L); for (let x = 300; x < 1060; x += 70) el("path", { d: `M${x} 150 Q${x + 35} 200 ${x + 70} 150`, fill: "none", stroke: "#FFD25E", "stroke-width": 5 }, L);
    [[200, 420], [1500, 470]].forEach(([x, y]) => { el("rect", { x: x - 60, y, width: 120, height: 150, rx: 8, fill: "#CFEAFB", ...S6(6) }, L); }); },
};
const drawRoomG1 = drawRoom;
drawRoom = function (place, noSign = false) {
  if ((curStage !== "gakkou2" && !isLong()) || !ROOMS2[place]) return drawRoomG1(place, noSign);
  sceneLayer.innerHTML = ""; const L = sceneLayer;
  const wall = { きょうしつ: "#FFF6E0", おんがくしつ: "#F3ECFF", ずこうしつ: "#FFF0E3", きゅうしょく: "#FFF6E0", たいいくかん: "#F4EAD8", いえ: "#FDEBD3" }[place] || "#FDEBD3";
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: wall }, L);
  el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: { たいいくかん: "#E9C893" }[place] || "#E3C59A" }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L);
  for (let x = 0; x < 1600; x += 160) el("path", { d: `M${x} 760 L${x - 80} 1000`, stroke: "#00000010", "stroke-width": 4 }, L);
  ROOMS2[place](L);
  if (!noSign) { const g = el("g", {}, L); el("rect", { x: 620, y: 24, width: 360, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, place.length > 5 ? 40 : 46, { "text-anchor": "middle" }); }
};
