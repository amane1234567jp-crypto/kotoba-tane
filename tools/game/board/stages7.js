/* ================= ステージ「ほけんしつ」「びょういん」「はいしゃさん」（2026-10-18） =================
   台本は sit/sits_new6.py。からだの ぐあいを ことばで つたえる。びょういんには「つづけて もんしん」マス（🩺）が ある。
   おいしゃさん＝いぬの わんこせんせい、はいしゃさん＝ビーバーの ビバせんせい、かんごしさん＝ひよこの ぴよこさん。 */
const S7L = ["hoken2", "byouin", "haisha"];
Object.assign(RIVAL_OF, { hoken2: "doshin", byouin: "chu", haisha: "gao" });
Object.assign(KID_S, { wanko: 1.0, biba: .98, piyoko: .6 });

/* ---------- 物の 絵 ---------- */
function thermoG(g, val) { el("rect", { x: -26, y: -90, width: 52, height: 180, rx: 26, fill: "#FFFFFF", ...S6p(5) }, g); el("rect", { x: -16, y: -60, width: 32, height: 70, rx: 6, fill: "#BDE3F2", ...S6p(3) }, g);
  txt(g, 0, -12, val, 22, { "text-anchor": "middle" }); el("circle", { cx: 0, cy: 60, r: 14, fill: "#E8473C", ...S6p(4) }, g); }
Object.assign(ITEM2, {
  thermo375(g) { thermoG(g, "37.5"); }, thermo38(g) { thermoG(g, "38.0"); },
  card(g) { el("rect", { x: -70, y: -46, width: 140, height: 92, rx: 10, fill: "#FFFFFF", ...S6p(5) }, g); el("rect", { x: -70, y: -46, width: 140, height: 26, rx: 10, fill: "#7FCBF0" }, g); el("path", { d: "M-50 0 H50 M-50 22 H20", stroke: "#9DB2E8", "stroke-width": 7 }, g); },
  syringe(g) { el("rect", { x: -70, y: -16, width: 110, height: 32, rx: 8, fill: "#E8F7FF", ...S6p(5) }, g); el("path", { d: "M40 0 H90 M-70 -24 V24 M-70 0 H-100", ...S6p(5), fill: "none" }, g); },
  powder(g) { el("path", { d: "M-50 -40 H50 L60 40 H-60 Z", fill: "#FFFFFF", ...S6p(5) }, g); el("path", { d: "M-30 -10 H30", stroke: "#B9A8D9", "stroke-width": 6 }, g); },
  syrup(g) { el("rect", { x: -30, y: -60, width: 60, height: 110, rx: 12, fill: "#FF8FA3", ...S6p(5) }, g); el("rect", { x: -16, y: -80, width: 32, height: 22, rx: 4, fill: "#FFFFFF", ...S6p(4) }, g); },
  icepack(g) { el("rect", { x: -60, y: -36, width: 120, height: 72, rx: 20, fill: "#9FD8F5", ...S6p(5) }, g); el("path", { d: "M-30 -10 l10 10 l-10 10 M10 -10 l10 10 l-10 10", stroke: "#FFFFFF", "stroke-width": 5, fill: "none" }, g); },
  toothbrush(g) { el("rect", { x: -90, y: -10, width: 150, height: 20, rx: 10, fill: "#7FCBF0", ...S6p(5) }, g); el("rect", { x: 50, y: -34, width: 50, height: 26, rx: 6, fill: "#FFFFFF", ...S6p(4) }, g); },
  cupw(g) { el("path", { d: "M-34 -50 H34 L26 50 H-26 Z", fill: "#BDE3F2", ...S6p(5) }, g); el("path", { d: "M-30 -20 H30", stroke: "#FFFFFF", "stroke-width": 8 }, g); },
  icecream(g) { el("path", { d: "M-30 0 L0 80 L30 0 Z", fill: "#E9B872", ...S6p(5) }, g); el("circle", { cx: 0, cy: -16, r: 34, fill: "#FFE3EA", ...S6p(5) }, g); },
  drill(g) { el("rect", { x: -80, y: -14, width: 130, height: 28, rx: 12, fill: "#C9D3DE", ...S6p(5) }, g); el("path", { d: "M50 0 H92", ...S6p(5) }, g); },
  bread(g) { el("path", { d: "M-60 20 Q-70 -40 0 -44 V20 Z", fill: "#E9B872", ...S6p(5) }, g); },
});
// あたまの よこに 出す「ヒントの ふきだし」（えもじ と みじかい ことば）
function hint7(c, emo, label) { const p = headTop(c), x = Math.min(1380, p.x + 230 * Math.max(.6, c.s)), y = Math.max(150, p.y + 30), g = el("g", {}, front());
  const w = Math.max(150, label.length * 34 + 110); el("rect", { x: x - 40, y: y - 56, width: w, height: 96, rx: 30, fill: "#FFFFFF", ...S6(6) }, g); el("path", { d: `M${x - 30} ${y + 20} L${x - 70} ${y + 50} L${x - 6} ${y + 34}`, fill: "#FFFFFF", ...S6(5) }, g);
  txt(g, x + 10, y + 12, emo, 54, { "text-anchor": "middle" }); txt(g, x + 50, y + 8, label, 34); g.setAttribute("opacity", 0); tween(250, k => g.setAttribute("opacity", k.toFixed(2))); return g; }
const buzzDrill = () => { if (!ctx) return; for (let i = 0; i < 6; i++) later(i * 120, () => blip(900, 1100, .1, "sawtooth")); };
const cough = c => { for (let i = 0; i < 3; i++) later(i * 350, () => { c.squash.vel += 2; noise(.12, 900, .5); markAbove(c, "puff", { dx: 80 }); }); };

/* ---------- へや ---------- */
function clinicWall(L, wall, floor) { el("rect", { x: 0, y: 0, width: 1600, height: 760, fill: wall }, L); el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: floor }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L);
  el("rect", { x: 0, y: 700, width: 1600, height: 60, fill: "#00000010" }, L); }
function crossSign(L, x, y, s = 1) { el("rect", { x: x - 40 * s, y: y - 40 * s, width: 80 * s, height: 80 * s, rx: 14 * s, fill: "#FFFFFF", ...S6(5) }, L); el("path", { d: `M${x} ${y - 26 * s} V${y + 26 * s} M${x - 26 * s} ${y} H${x + 26 * s}`, stroke: "#E8473C", "stroke-width": 16 * s }, L); }
function bed7(L, x, y, w = 420) { el("rect", { x, y: y - 120, width: w, height: 70, rx: 16, fill: "#FFFFFF", ...S6(6) }, L); el("rect", { x: x + 10, y: y - 150, width: 120, height: 50, rx: 20, fill: "#DCEBFA", ...S6(5) }, L);
  el("rect", { x: x + 130, y: y - 130, width: w - 140, height: 60, rx: 14, fill: "#BFE3F5", ...S6(5) }, L); el("path", { d: `M${x + 20} ${y - 50} V${y} M${x + w - 20} ${y - 50} V${y}`, ...S6(8) }, L); }
function benches(L, xs, y) { xs.forEach(x => { el("rect", { x, y: y - 70, width: 300, height: 30, rx: 10, fill: "#7FB6E8", ...S6(5) }, L); el("rect", { x, y: y - 150, width: 300, height: 80, rx: 14, fill: "#9FC8F0", ...S6(5) }, L); el("path", { d: `M${x + 30} ${y - 40} V${y} M${x + 270} ${y - 40} V${y}`, ...S6(7) }, L); }); }
const ROOMS7 = {
  ろうか(L) { clinicWall(L, "#FFF6E9", "#E3C59A"); el("rect", { x: 820, y: 240, width: 300, height: 520, rx: 10, fill: "#E8D2B0", ...S6(6) }, L); el("circle", { cx: 1090, cy: 520, r: 12, fill: "#FFD25E", ...S6(4) }, L);
    el("rect", { x: 840, y: 170, width: 260, height: 60, rx: 10, fill: "#FFFFFF", ...S6(5) }, L); txt(L, 970, 214, "ほけんしつ", 34, { "text-anchor": "middle" }); crossSign(L, 1260, 330, .8);
    [120, 420].forEach(x => { el("rect", { x, y: 200, width: 220, height: 160, rx: 8, fill: "#BDE3F2", ...S6(5) }, L); el("path", { d: `M${x + 110} 200 V360`, ...S6(4) }, L); }); },
  ほけんしつ(L) { clinicWall(L, "#FFF0F3", "#E8D6C2"); crossSign(L, 1080, 150);
    el("rect", { x: 80, y: 260, width: 300, height: 420, rx: 10, fill: "#FFFFFF", ...S6(6) }, L); [360, 470, 580].forEach(y => el("path", { d: `M80 ${y} H380`, ...S6(5) }, L)); [[120, 320], [220, 320], [300, 430], [140, 540], [260, 540]].forEach(([x, y], i) => el("rect", { x, y, width: 50, height: 34, rx: 6, fill: ["#FF8FA3", "#7FCBF0", "#FFD25E", "#7BD389", "#B9A8D9"][i], ...S6(3) }, L));
    el("rect", { x: 1200, y: 520, width: 300, height: 30, rx: 8, fill: "#C98A4B", ...S6(6) }, L); el("path", { d: "M1230 550 V760 M1470 550 V760", ...S6(8) }, L);
    el("rect", { x: 1460, y: 160, width: 30, height: 600, fill: "#FFFFFF", ...S6(5) }, L); for (let y = 200; y < 740; y += 60) el("path", { d: `M1460 ${y} H1476`, ...S6(3) }, L);
    el("rect", { x: 520, y: 220, width: 300, height: 170, rx: 12, fill: "#FFFFFF", ...S6(5) }, L); txt(L, 670, 290, "てあらい", 36, { "text-anchor": "middle" }); txt(L, 670, 350, "うがい", 36, { "text-anchor": "middle" }); },
  ベッド(L) { clinicWall(L, "#F3F7FF", "#E8D6C2"); bed7(L, 120, 760, 460); bed7(L, 1020, 760, 460);
    [[80, 130, 540], [980, 130, 540]].forEach(([x, y, w]) => { el("path", { d: `M${x} ${y} H${x + w}`, ...S6(6) }, L); for (let i = 0; i < 6; i++) el("path", { d: `M${x + i * 18} ${y} Q${x + i * 18 + 10} ${y + 300} ${x + i * 18} ${y + 560}`, stroke: "#FFC2D1", "stroke-width": 14, fill: "none" }, L); }); },
  うけつけ(L) { clinicWall(L, "#EAF6FF", "#E3D9C8"); crossSign(L, 160, 140); el("rect", { x: 900, y: 480, width: 700, height: 280, rx: 12, fill: "#FFFFFF", ...S6(6) }, L); el("rect", { x: 880, y: 460, width: 740, height: 30, rx: 8, fill: "#7FCBF0", ...S6(5) }, L);
    el("rect", { x: 980, y: 300, width: 280, height: 80, rx: 12, fill: "#FFFFFF", ...S6(5) }, L); txt(L, 1120, 354, "うけつけ", 40, { "text-anchor": "middle" }); benches(L, [120], 760); },
  まちあい(L) { clinicWall(L, curStage === "haisha" ? "#FFF8E8" : "#EAF6FF", "#E3D9C8"); benches(L, [80, 1180], 760);
    el("rect", { x: 560, y: 160, width: 480, height: 110, rx: 14, fill: "#FFFFFF", ...S6(5) }, L); txt(L, 800, 232, curStage === "haisha" ? "🦷 はを たいせつに" : "おしずかに ねがいます", 36, { "text-anchor": "middle" });
    el("path", { d: "M1460 760 V620", ...S6(6) }, L); [[1440, 590], [1480, 600], [1460, 560]].forEach(([x, y]) => el("circle", { cx: x, cy: y, r: 30, fill: "#7BD389", ...S6(4) }, L)); el("rect", { x: 1430, y: 680, width: 60, height: 80, rx: 8, fill: "#E8735A", ...S6(5) }, L); },
  しんさつしつ(L) { clinicWall(L, "#F2FBF7", "#E3D9C8"); el("rect", { x: 1180, y: 520, width: 360, height: 30, rx: 8, fill: "#C9D3DE", ...S6(6) }, L); el("path", { d: "M1210 550 V760 M1510 550 V760", ...S6(8) }, L);
    el("rect", { x: 1260, y: 400, width: 180, height: 120, rx: 10, fill: "#4A4A58", ...S6(5) }, L); el("rect", { x: 1274, y: 414, width: 152, height: 86, rx: 6, fill: "#9FD8F5" }, L);
    el("rect", { x: 120, y: 180, width: 300, height: 220, rx: 10, fill: "#DCE6EE", ...S6(6) }, L); el("path", { d: "M200 220 Q270 260 200 360 M340 220 Q270 260 340 360", stroke: "#FFFFFF", "stroke-width": 10, fill: "none" }, L);
    bed7(L, 80, 760, 340); crossSign(L, 800, 140, .8); },
  しんさつだい(L) { clinicWall(L, "#EEF8FF", "#E3D9C8");
    el("path", { d: "M480 760 L520 640 H780 L820 760", fill: "#5FB0E8", ...S6(6) }, L); el("rect", { x: 440, y: 560, width: 420, height: 80, rx: 30, fill: "#7FCBF0", ...S6(6) }, L); el("path", { d: "M440 600 Q420 420 520 380 L560 560", fill: "#7FCBF0", ...S6(6) }, L);
    el("path", { d: "M900 760 V300 Q900 240 840 230", fill: "none", ...S6(8) }, L); el("ellipse", { cx: 800, cy: 230, rx: 70, ry: 40, fill: "#FFE27A", ...S6(6) }, L);
    el("rect", { x: 1000, y: 560, width: 120, height: 200, rx: 14, fill: "#FFFFFF", ...S6(6) }, L); el("ellipse", { cx: 1060, cy: 560, rx: 60, ry: 20, fill: "#BDE3F2", ...S6(5) }, L);
    el("rect", { x: 1200, y: 160, width: 300, height: 260, rx: 14, fill: "#FFFFFF", ...S6(5) }, L); txt(L, 1350, 230, "はみがき", 36, { "text-anchor": "middle" }); txt(L, 1350, 330, "🦷✨", 80, { "text-anchor": "middle" }); },
};
{ const dr = drawRoom; drawRoom = function (place, noSign = false) {
    const R = S7L.includes(curStage) && ROOMS7[place]; if (!R) return dr(place, noSign);
    sceneLayer.innerHTML = ""; R(sceneLayer);
    if (!noSign) { const g = el("g", {}, sceneLayer); el("rect", { x: 620, y: 24, width: 360, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, place.length > 6 ? 38 : 46, { "text-anchor": "middle" }); }
  }; }

/* ---------- できごとの アニメ ---------- */
const ON7 = ["hkatama", "hkmuka", "hkhanaji", "hktetsubou", "hktaion", "hkyoku", "hksoutai", "hkhaneru", "hkshitsureishita",
  "byuketsuke", "byyobareru", "bydou", "byitsu", "bydoko", "byhowa", "bynetsu", "bygohan", "byhoka", "bychusha", "bykusuri", "byarigatou", "bymonshin",
  "hsaan", "hsdoko", "hsshimiru", "hsgura", "hsteage", "hsyusugu", "hsbuku", "hshamigaki", "hskowai", "hsowari", "hsnaku", "hssabori", "hkshizuka", "bymachi"];
ON7.forEach(k => ASK_ON_STAGE.add(k));
["hkatama", "hkmuka", "hkhanaji", "hktetsubou", "hktaion", "hksoutai", "hktomo", "bydou", "byitsu", "bydoko", "byhowa", "bynetsu", "bygohan", "byhoka", "bychusha", "hsdoko", "hsshimiru", "hsgura", "hsteage", "hskowai", "hsnaku", "hsyusugu"].forEach(k => SOFT_INTRO.add(k));
// おわりの あいさつの 場面は、こどもが 4つ いじょう こたえてから
["hkshitsureishita", "byarigatou", "hsowari"].forEach(id => { const x = SITS.find(s => s.id === id); if (x) x.late = true; });
const hp7 = (c, kind, k = .4, r = 0) => { const g = prop(kind, 0, 0, k); hand(c, g, k, r); return g; };
const sick = h => { h.sadMouth = true; h.eyeScale.t = .85; };
const comeSit = async (h, ms = 1100) => { enter(h); await sleep(ms); };
Object.assign(INTRO, {
  // ---- ほけんしつ ----
  async hkknock(h, a) { await comeSit(h); h.armR.t = -90; knock(); await sleep(700); h.armR.t = 0; enter(a); await sleep(1000); },
  async hkatama(h, a) { await comeSit(h); sick(h); h.armR.t = -150; hint7(h, "🤕", "ずきずき"); hold(h, "shiver", 1); await sleep(1000); },
  async hkmuka(h, a) { await comeSit(h); sick(h); h.armL.t = 40; h.armR.t = -40; sway(h, 1600, 8, 400); hint7(h, "🤢", "むかむか"); await sleep(1200); },
  async hkhanaji(h, a) { await comeSit(h); sick(h); const d = el("g", {}, front()); el("path", { d: "M-6 0 Q-10 26 0 34 Q10 26 6 0 Z", fill: "#E8473C", ...S6p(3) }, d); follow(d, () => { const p = world(h, 200, 192); return [p.x, p.y, 0, h.s * 1.4]; }); window.__hj = d; markAbove(h, "ex"); await sleep(1100); },
  async hktetsubou(h, a) { await comeSit(h); sick(h); h.armL.t = 50; h.armR.t = -60; hint7(h, "💥", "ひじ"); await sleep(1100); },
  async hktaion(h, a) { await comeSit(h, 900); window.__th = hp7(h, "thermo375", .45); blip(2000, 2000, .08, "square"); later(150, () => blip(2000, 2000, .08, "square")); hint7(h, "🌡", "37ど5ぶ"); await sleep(1000); },
  async hkyoku(h, a) { place(h, 400, 760, .8); stay(h); playMove(h, "sleep"); markAbove(h, "z"); await sleep(1200); h.eyeScale.t = 1; playMove(h, "look"); await sleep(400); },
  async hksoutai(h, a) { place(h, 400, 760, .8); stay(h); sick(h); hint7(h, "🏠", "かえりたい"); await sleep(1200); },
  async hktomo(h, a) { const ks = exKids([880]); const c = ks[0]; enter(h); if (c) { c.dx.v = c.dx.t = -1100; enter(c); c.sadMouth = true; } await sleep(1300); if (c) { hold(c, "shiver", 1.5); markAbove(c, "drop"); c.armL.t = 60; } enter(a); await sleep(1100); },
  async hkshizuka(h, a) { place(a, 1180, 760, .8); stay(a); enter(h); for (let i = 0; i < 4; i++) later(i * 380, () => { jump(a, .6); blip(400, 700, .06, "square"); }); await sleep(1300); markAbove(h, "ex"); },
  async hkhaneru(h, a) { place(h, 360, 760, .8); stay(h); a.dx.v = a.dx.t = 900; for (let i = 0; i < 4; i++) later(i * 380, () => { jump(h, .6); blip(400, 700, .06, "square"); }); await sleep(1500); enter(a); await sleep(1000); surprise(h); },
  async hkshitsureishita(h, a) { await comeSit(h, 900); joy(h); await sleep(500); },
  // ---- びょういん ----
  async byuketsuke(h, a) { window.__cd = hp7(h, "card", .4); await comeSit(h); await sleep(200); },
  async bymachi(h, a) { place(a, 900, 975, .88); stay(a); enter(h); pace(a, 2000, 300, 500); await sleep(1600); markAbove(h, "ex"); },
  async byyobareru(h, a) { h.dx.v = h.dx.t = -380; stay(h); playMove(h, "sleepy"); a.dx.v = a.dx.t = 600; await sleep(600); enter(a); await sleep(1000); playMove(h, "look"); },
  async bydou(h, a) { await comeSit(h); sick(h); h.armR.t = -100; hint7(h, "🔥", "のど"); cough(h); await sleep(1100); },
  async byitsu(h, a) { await comeSit(h); sick(h); h.armL.t = 40; h.armR.t = -40; hint7(h, "🌅", "けさ"); await sleep(1200); },
  async bydoko(h, a) { await comeSit(h); sick(h); const r = el("circle", { r: 26, fill: "#FF6F91", opacity: .55 }, front()); follow(r, () => { const p = world(h, 236, 336); return [p.x, p.y, 0, h.s * 1.4 * (1 + .15 * Math.sin(performance.now() / 160))]; }); h.armR.t = -40; hint7(h, "👉", "おへその みぎ"); await sleep(1300); },
  async byhowa(h, a) { await comeSit(h); sick(h); h.armR.t = -150; for (let i = 0; i < 4; i++) later(i * 300, () => markAbove(h, "anger", { dx: i % 2 ? 70 : -70 })); hint7(h, "⚡", "ずきずき"); await sleep(1300); },
  async bynetsu(h, a) { await comeSit(h, 900); sick(h); window.__th = hp7(h, "thermo38", .45); hint7(h, "🌡", "38ど"); hold(h, "shiver", 1.2); await sleep(1200); },
  async bygohan(h, a) { await comeSit(h); hint7(h, "🍞", "はんぶん"); await sleep(1100); },
  async byhoka(h, a) { await comeSit(h); sick(h); cough(h); later(1100, () => playMove(h, "sneeze")); hint7(h, "😷", "せき・はなみず"); await sleep(1500); },
  async bychusha(h, a) { await comeSit(h, 900); window.__sy = hp7(a, "syringe", .45); await sleep(600); hold(h, "shiver", 1.6); markAbove(h, "drop"); h.sadMouth = true; await sleep(900); },
  async bykusuri(h, a) { await comeSit(h, 900); window.__pw = hp7(a, "powder", .4); await sleep(600); playMove(h, "think"); hint7(h, "💊", "にがて"); await sleep(800); },
  async byarigatou(h, a) { await comeSit(h, 900); h.happyOn = true; await sleep(500); },
  async bymonshin(h, a) { await comeSit(h, 1100); },
  // ---- はいしゃさん ----
  async hsaan(h, a) { place(h, 610, 660, .8); stay(h); await sleep(600); h.mouthOpen.t = .6; await sleep(700); },
  async hsdoko(h, a) { place(h, 610, 660, .8); stay(h); sick(h); h.armR.t = -110; hint7(h, "🦷", "みぎの した"); await sleep(1200); },
  async hsshimiru(h, a) { place(h, 610, 660, .8); stay(h); const ic = hp7(h, "icecream", .4); await sleep(700); ic.remove(); hold(h, "shiver", 1); sick(h); hint7(h, "❄", "しみる"); await sleep(1000); },
  async hsgura(h, a) { place(h, 610, 660, .8); stay(h); h.mouthOpen.t = .5; hint7(h, "🦷", "ぐらぐら"); for (let i = 0; i < 6; i++) later(i * 150, () => { h.headRot.t = i % 2 ? 6 : -6; }); later(950, () => h.headRot.t = 0); await sleep(1200); },
  async hsteage(h, a) { place(h, 610, 660, .8); stay(h); window.__dr = hp7(a, "drill", .45); h.mouthOpen.t = .5; buzzDrill(); await sleep(800); h.armR.t = -160; markAbove(h, "ex"); await sleep(700); },
  async hsyusugu(h, a) { place(h, 610, 660, .8); stay(h); h.squash.vel += 2; markAbove(h, "drop"); hint7(h, "💧", "みずが いっぱい"); await sleep(1200); },
  async hsbuku(h, a) { place(h, 610, 660, .8); stay(h); window.__cw = hp7(h, "cupw", .4); await sleep(900); },
  async hshamigaki(h, a) { place(h, 610, 660, .8); stay(h); window.__tb = hp7(a, "toothbrush", .4); await sleep(1000); },
  async hskowai(h, a) { place(h, 610, 660, .8); stay(h); hold(h, "shiver", 1.8); markAbove(h, "drop"); h.sadMouth = true; await sleep(1300); },
  async hsnaku(h, a) { enter(h); a.sadMouth = true; for (let i = 0; i < 4; i++) later(i * 300, () => markAbove(a, "drop", { dx: i % 2 ? 50 : -50 })); await sleep(1300); },
  async hssabori(h, a) { enter(h); const tb = hp7(a, "toothbrush", .35); await sleep(900); tb.remove(); playMove(a, "sleepy"); await sleep(700); },
  async hsowari(h, a) { place(h, 610, 660, .8); stay(h); await sleep(600); h.happyOn = true; await sleep(400); },
});
Object.assign(POST, {
  async hkhanaji(h, a) { h.armR.t = -90; await sleep(900); if (window.__hj) window.__hj.remove(); h.armR.t = 0; h.sadMouth = false; playMove(h, "nod"); await sleep(300); },
  async hktetsubou(h, a) { hp7(a, "icepack", .35); await walk(a, -330, 800); h.sadMouth = false; playMove(h, "nod"); await sleep(400); },
  async hktaion(h, a) { if (window.__th) window.__th.remove(); playMove(a, "nod"); await sleep(500); },
  async hktomo(h, a) { const c = ((CUR_S && CUR_S.extras) || []).map(k => C[k])[0]; if (c) { playMove(c, "nod"); c.sadMouth = false; } playMove(a, "nod"); joy(h); await sleep(500); },
  async hkshizuka(h, a) { playMove(a, "shy"); a.jumpV = 0; await sleep(500); joy(h); await sleep(300); },
  async hkhaneru(h, a) { playMove(h, "bow"); await sleep(500); playMove(h, "sleep"); markAbove(h, "z"); await sleep(500); },
  async byuketsuke(h, a) { if (window.__cd) window.__cd.remove(); hp7(a, "card", .4); playMove(a, "nod"); await sleep(500); },
  async bymachi(h, a) { a.dx.t = a.dx.v; playMove(a, "shy"); await sleep(500); joy(h); await sleep(300); },
  async bychusha(h, a) { if (window.__sy) window.__sy.remove(); boom(.15); await sleep(300); h.sadMouth = false; joy(h); await sleep(400); },
  async bykusuri(h, a) { if (window.__pw) window.__pw.remove(); hp7(a, "syrup", .4); playMove(a, "nod"); await sleep(500); joy(h); },
  async bynetsu(h, a) { if (window.__th) window.__th.remove(); playMove(a, "nod"); await sleep(400); },
  async hsteage(h, a) { if (window.__dr) window.__dr.remove(); h.armR.t = 0; h.mouthOpen.t = 0; playMove(a, "nod"); await sleep(500); },
  async hsyusugu(h, a) { hp7(h, "cupw", .4); await sleep(400); h.squash.vel += 1.5; await sleep(400); joy(h); },
  async hsbuku(h, a) { for (let i = 0; i < 4; i++) later(i * 160, () => { h.squash.vel += 1.4; blip(300, 200, .06, "sine"); }); await sleep(800); if (window.__cw) window.__cw.remove(); joy(h); },
  async hsnaku(h, a) { a.sadMouth = false; playMove(a, "nod"); await sleep(400); joy(a); joy(h); await sleep(300); },
  async hssabori(h, a) { hp7(a, "toothbrush", .35); playMove(a, "nod"); await sleep(500); },
  async hsgura(h, a) { h.mouthOpen.t = 0; playMove(a, "nod"); await sleep(400); },
  async hsaan(h, a) { h.mouthOpen.t = 0; playMove(a, "nod"); await sleep(400); },
});

/* ---------- つづけて もんしん（びょういんの 🩺 マス）：せんせいが 3つ つづけて きく。こたえは 1つの ぐあいで そろえる ---------- */
const MNQ = { dou: "きょうは どうしましたか？", itsu: "それは、いつからですか？", hoka: "ほかに、へんな ところは ありますか？" };
const K7 = (...a) => a;
const MN_SYM = {
  nodo: { dou: ["🔥", "のど", ["のどが いたいです", [["のど", "喉"], ["いたい", "痛い"]]], ["のどが ひりひりして、つばを のむと いたいです", [["のど", "喉"], ["ひりひり", "ヒリヒリ", "つば", "唾"]]]],
    itsu: ["🌙", "きのうの よる", ["きのうの よるからです", [["きのう", "昨日"], ["よる", "夜"]]], ["きのうの よるから、だんだん いたく なりました", [["きのう", "昨日"], ["だんだん", "段々"]]]],
    hoka: ["😷", "せき", ["せきも でます", [["せき", "咳"]]], ["せきも でるし、すこし ねつも あります", [["せき", "咳"], ["ねつ", "熱"]]]] },
  onaka: { dou: ["🤢", "おなか", ["おなかが いたいです", [["おなか", "お腹"], ["いたい", "痛い"]]], ["おなかが きりきり いたいです", [["おなか", "お腹"], ["きりきり", "キリキリ"]]]],
    itsu: ["🌅", "けさ", ["けさからです", [["けさ", "今朝"]]], ["けさ おきた ときから、ずっと いたいです", [["けさ", "今朝"], ["ずっと"]]]],
    hoka: ["🍚", "たべられない", ["きもちも わるいです", [["きもち", "気持ち"], ["わるい", "悪い"]]], ["きもちが わるくて、ごはんが たべられません", [["きもち", "気持ち"], ["たべられ", "食べられ"]]]] },
  atama: { dou: ["⚡", "あたま", ["あたまが いたいです", [["あたま", "頭"], ["いたい", "痛い"]]], ["あたまが ずきずき いたいです", [["あたま", "頭"], ["ずきずき", "ズキズキ"]]]],
    itsu: ["🌇", "きのうの ゆうがた", ["きのうの ゆうがたからです", [["ゆうがた", "夕方"]]], ["きのうの ゆうがたから、ずっと いたいです", [["ゆうがた", "夕方"], ["ずっと"]]]],
    hoka: ["🌡", "ねつ", ["ねつも あります", [["ねつ", "熱"]]], ["ねつが あって、からだが だるいです", [["ねつ", "熱"], ["だるい", "怠い"]]]] },
  mimi: { dou: ["👂", "みぎの みみ", ["みみが いたいです", [["みみ", "耳"], ["いたい", "痛い"]]], ["みぎの みみが ずきずき いたいです", [["みみ", "耳"], ["ずきずき", "ズキズキ", "みぎ", "右"]]]],
    itsu: ["🌙", "おととい", ["おとといからです", [["おととい", "一昨日"]]], ["おとといの よるから、いたく なりました", [["おととい", "一昨日"], ["よる", "夜"]]]],
    hoka: ["🔇", "きこえにくい", ["きこえにくいです", [["きこえにく", "聞こえにく"]]], ["みみが ぼわっと して、きこえにくいです", [["ぼわっ", "ボワッ"], ["きこえにく", "聞こえにく"]]]] },
};
let MN_PC = null; const MN_NODES = ["a3", "c2"];
{ const mb = moveBy; moveBy = async function (pc, n) { MN_PC = pc; return mb(pc, n); }; }
async function mnRun(heroKind) {
  const ks = Object.keys(MN_SYM), sk = ks[rnd(ks.length)], SY = MN_SYM[sk], lv = tierOf() >= 2 ? 1 : 0;
  const s = { id: "bymonshin", place: "しんさつしつ", asker: "wanko", intro: "bymonshin" };
  const { hero: h, ask: a } = setSitView(s, heroKind); showEngine(null, `つづけて もんしん（${sk}・${lv ? "ながい" : "みじかい"}）`);
  await playIntro(s, h, a); sick(h);
  await speak(C.pony, "mn_intro", "つづけて もんしん！ せんせいの しつもんに、じゅんばんに こたえよう");
  let okN = 0; const tries = [];
  for (const q of ["dou", "itsu", "hoka"]) {
    const [emo, lab] = SY[q], [ans, keys] = SY[q][2 + lv]; const hb = hint7(h, emo, lab);
    await speak(a, `mq_${q}`, MNQ[q]);
    showTask(ans, "こたえよう"); await speak(C.pony, `mn_${sk}_${q}_${lv}`, ans); unsay();
    let ok = false;
    for (let n = 0; n < 2 && !ok; n++) { setListen(h, true); const r = await listen(keys, 8000); setListen(h, false); tries.push(`${q}${r.r === "ok" ? "○" : "×"}${r.heard || ""}`); ok = r.r === "ok";
      if (!ok && n === 0) await speak(C.pony, "p_again", "もう いっかい いってみよう"); }
    if (ok) { okN++; chime(); playMove(a, "nod"); markAbove(h, "sparkle"); } else { await speak(C.pony, "p_together", "いっしょに いおうね"); await speak(C.pony, `mn_${sk}_${q}_${lv}`, ans); }
    hideTask(); hb.remove(); await sleep(300);
  }
  await speak(a, "mq_res", "よく おしえて くれましたね。これで よく わかりました");
  const ok = okN >= 2; grade(ok && okN === 3); GS.tasks++; if (ok) GS.ok++;
  playLog({ type: "monshin", sym: sk, okN, tries, ...(MODE === "multi" ? { who: NAMES[heroKind] } : {}) });
  h.sadMouth = false; h.eyeScale.t = 1;
  if (ok) { joy(h); confetti(50); joy(C.pony); await speak(C.pony, "p_great", "すごい！ いえたね！"); await seedGet(h); }
  await sleep(500); setView("board"); return ok;
}
{ const lc = landChild; landChild = async function (pc = P.shima) {
    if (curStage === "byouin" && MN_PC === pc && MN_NODES.includes(pc.node) && !winner) { const ok = await mnRun(pc.kind); if (ok && pc.player) pc.player.ok++; return; }
    return lc(pc); }; }
EV_STYLE.monshin = ["#FFC6E0", () => "🩺"];
{ const be = boardEvent; boardEvent = async function (pc) { const ev = (EVENTS[curStage] || {})[pc.node]; if (ev && ev[0] === "monshin") return; return be(pc); }; }

/* ---------- 盤 ---------- */
STAGE_DEF.hoken2 = { ground: "#FFF0F3", sky: "#CFEAFB", names: ["ろうか", "ろうか", "ほけんしつ", "ほけんしつ", "ほけんしつ", "ベッド", "ベッド", "ほけんしつ", "ろうか"], fills: { ろうか: "#FFE3B3", ほけんしつ: "#FFD1D9", ベッド: "#D7ECFF" } };
STAGE_DEF.byouin = { ground: "#EAF6FF", sky: "#CFEAFB", names: ["うけつけ", "まちあい", "しんさつしつ", "しんさつしつ", "しんさつしつ", "しんさつしつ", "まちあい", "しんさつしつ", "うけつけ"], fills: { うけつけ: "#FFE3B3", まちあい: "#D7ECFF", しんさつしつ: "#D7F0D2" } };
STAGE_DEF.haisha = { ground: "#FFF8E8", sky: "#CFEAFB", names: ["まちあい", "まちあい", "しんさつだい", "しんさつだい", "しんさつだい", "しんさつだい", "まちあい", "しんさつだい", "まちあい"], fills: { まちあい: "#FFE3B3", しんさつだい: "#D7ECFF" } };
function board7(id, P, style) { const n = {}, pl = {}, nx = {};
  chain(["0", "1", "2", "3", "4", "f1"], [[220, 880], [420, 900], [620, 900], [820, 900], [1020, 900], [1220, 880]], P[0], n, pl); pl["3"] = pl["4"] = pl.f1 = P[1];
  chain(["a1", "a2", "a3"], [[1400, 760], [1420, 580], [1300, 420]], P[2], n, pl);
  chain(["b1", "b2"], [[1120, 700], [1000, 560]], P[2], n, pl);
  chain(["m1", "m2", "f2"], [[1100, 340], [880, 300], [660, 320]], P[3], n, pl);
  chain(["c1", "c2", "c3"], [[440, 360], [300, 500], [380, 660]], P[4], n, pl);
  chain(["d1"], [[620, 520]], P[3], n, pl);
  n["15"] = [600, 700, "goal"]; pl["15"] = P[5]; n["0"].push("start"); n["4"].push("block");
  linkLine(nx, ["0", "1", "2", "3", "4", "f1", "a1", "a2", "a3", "m1", "m2", "f2", "c1", "c2", "c3", "15"]); linkLine(nx, ["f1", "b1", "b2", "m1"]); linkLine(nx, ["f2", "d1", "15"]);
  BOARD[id] = { nodes: n, place: pl, next: nx, away: [1300, 760], style: (a, b) => ["b1", "b2", "d1"].includes(a) || ["b1", "d1"].includes(b) ? "hall" : style,
    labels: [[P[0], 260, 990], [P[2], 1470, 330], [P[3], 880, 200], [P[4], 300, 300]] }; }
board7("hoken2", ["ろうか", "ほけんしつ", "ほけんしつ", "ベッド", "ほけんしつ", "ろうか"], "hall");
board7("byouin", ["うけつけ", "まちあい", "しんさつしつ", "しんさつしつ", "まちあい", "うけつけ"], "hall");
board7("haisha", ["まちあい", "しんさつだい", "しんさつだい", "しんさつだい", "まちあい", "まちあい"], "hall");
function bg7(L, base, deco, title, col) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: base }, L); for (let x = 0; x < 1600; x += 100) el("path", { d: `M${x} 0 V1000`, stroke: "#00000010", "stroke-width": 4 }, L);
  [[60, 760, 520, 230], [1180, 300, 400, 560], [560, 160, 640, 260]].forEach(([x, y, w, h], i) => el("rect", { x, y, width: w, height: h, rx: 30, fill: deco[i], ...S6(5) }, L));
  el("rect", { x: 60, y: 40, width: 460, height: 110, rx: 10, fill: col, ...S6(6) }, L); txt(L, 290, 115, title, 42, { "text-anchor": "middle", fill: "#FFFFFF" }); }
Object.assign(BOARD_BG, {
  hoken2(L) { bg7(L, "#FFF0F3", ["#FFE3B3", "#D7ECFF", "#FFD1D9"], "🩹 ほけんしつ", "#FF8FA3"); crossSign(L, 1460, 140, 1.2); },
  byouin(L) { bg7(L, "#EAF6FF", ["#FFE3B3", "#D7F0D2", "#D7F0D2"], "🏥 びょういん", "#5B8DEF"); crossSign(L, 1460, 140, 1.2); },
  haisha(L) { bg7(L, "#FFF8E8", ["#FFE3B3", "#D7ECFF", "#D7ECFF"], "🦷 はいしゃさん", "#3EB489"); txt(L, 1460, 180, "🦷", 110, { "text-anchor": "middle" }); },
});
BLOCK_DEF.hoken2 = { who: "chu", sleep: false, intro: ["p_blk_hoken2", "ちゅうくんが ろうかで ないて いるよ。こえを かけて あげよう"], say: ["blk_hoken2", "だいじょうぶ？"], to: "ちゅうくんに いおう",
  keys: [["だいじょうぶ", "大丈夫"]], res: ["rs_hoken2", "ありがとう。ほけんしつに いく ところなんだ"] };
BLOCK_DEF.byouin = { who: "kamejii", sleep: false, intro: ["p_blk_byouin", "かめじいが まちあいの いすに すわって いるよ。となりに すわって いいか きこう"], say: ["blk_byouin", "となり、いいですか"], to: "かめじいに いおう",
  keys: [["となり", "隣"]], res: ["rs_byouin", "ほっほ、どうぞ どうぞ"] };
BLOCK_DEF.haisha = { who: "doshin", sleep: false, intro: ["p_blk_haisha", "どしんが はいしゃさんの まえで こわがって いるよ。はげまして あげよう"], say: ["blk_haisha", "いっしょに いこう"], to: "どしんに いおう",
  keys: [["いっしょ", "一緒"]], res: ["rs_haisha", "うん……いっしょなら がんばる"] };
S7L.forEach(st => SLEEPER_OF[st] = BLOCK_DEF[st].who);
Object.assign(EVENTS, {
  hoken2: { a2: ["fwd", 2, "ev_hoken2f", "てを きれいに あらった！ 2マス すすむよ"], m2: ["back", 2, "ev_hoken2b", "ろうかで すべった！ 2マス もどるよ"], d1: ["back", 4, "ev_hoken2h", "ハンカチを わすれた！ 4マス もどるよ"] },
  byouin: { a2: ["fwd", 2, "ev_byouinf", "じゅんばんが すぐ きた！ 2マス すすむよ"], m2: ["back", 2, "ev_byouinb", "しんさつけんを おとした！ 2マス もどるよ"], d1: ["back", 4, "ev_byouinh", "マスクを わすれた！ 4マス もどるよ"], a3: ["monshin", 0, "", ""], c2: ["monshin", 0, "", ""] },
  haisha: { a2: ["fwd", 2, "ev_haishaf", "はみがきを ほめられた！ 2マス すすむよ"], m2: ["back", 2, "ev_haishab", "うがいの みずを こぼした！ 2マス もどるよ"], d1: ["back", 4, "ev_haishah", "はブラシを わすれた！ 4マス もどるよ"] },
});
