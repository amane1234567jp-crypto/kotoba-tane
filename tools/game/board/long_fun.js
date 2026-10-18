/* ================= だいぼうけん：わらえる 課題（2026-10-13 追加） =================
   😂 つっこみ場面（gag）／👅 はやくちことば（haya）／🔎 さがして タッチ（sagasu）
   声：かけあい＝AivisSpeech（lk_g_*・lk_y_*_b・lk_s_no_*・lk_s_found_*）、ぽにー＝VOICEVOX（lk_g_ask・lk_g_*_a*・lk_y_*・lk_s_*） */

/* ---------- 盤：マスの 種類を ふやす ---------- */
Object.assign(LTASK, { gag: ["#FFD08A", "😂"], haya: ["#FFC6E0", "👅"], sagasu: ["#BFEDE2", "👀"] });
{ const order = ["kaiwa", "gag", "sagasu", "hantai", "haya", "scene", "joshi", "gag", "machi", "kaiwa", "sagasu", "teinei", "haya", "gag", "kaiwa", "joshi", "sagasu", "machi"]; let i = 0;
  Object.keys(LONG_TASK).forEach(k => delete LONG_TASK[k]);
  Object.keys(BOARD.long.nodes).forEach(id => { if (["0", "4", "15"].includes(id) || EVENTS.long[id]) return; LONG_TASK[id] = order[i++ % order.length]; }); }
LEGEND_L.splice(0, LEGEND_L.length, ["kaiwa", "かいわ"], ["gag", "つっこみ"], ["haya", "はやくち"], ["sagasu", "さがす"], ["hantai", "はんたい"], ["joshi", "パズル"], ["machi", "まちがい"], ["teinei", "ていねい"], ["scene", "よみあげ"]);

/* ---------- ふえる キャラ（かぞく・さがす 用）：つかいおわったら かならず けす ---------- */
const CLONES = [], CLEAN = []; // CLEAN：場面の あとに もとに もどす 関数
function clone(kind, x, base, s) { const c = makeChar(kind); resetChar(c); place(c, x, base, s); c.root.style.display = ""; visible.push(c); CLONES.push(c); return c; }
function bigTail(c, k) { const t = c.tail; const inner = el("g", { transform: `translate(${t.px} ${t.py}) scale(${k}) translate(${-t.px} ${-t.py})` }, t.g); [...t.g.childNodes].forEach(n => n !== inner && inner.appendChild(n));
  CLEAN.push(() => { [...inner.childNodes].forEach(n => t.g.appendChild(n)); inner.remove(); }); }
function clearClones() { CLEAN.splice(0).forEach(f => { try { f(); } catch (e) { } }); CLONES.splice(0).forEach(c => { c.root.remove(); const i = visible.indexOf(c); if (i >= 0) visible.splice(i, 1); }); }
// あたまに のせる もの（ぼうし・めがね・ひげ）。head.g に 入れるので 首の 動きに ついてくる
const HAT_COL = { red: "#E8473C", blue: "#3E7FD6", yellow: "#FFD25E" };
const addOn = (c, g) => { if (!CLONES.includes(c)) CLEAN.push(() => g.remove()); return g; };
function putHat(c, col, y = 96) { const g = addOn(c, el("g", {}, c.head.g)); el("rect", { x: 140, y: y - 70, width: 120, height: 74, rx: 16, fill: HAT_COL[col], ...S6(6) }, g); el("rect", { x: 140, y: y - 22, width: 120, height: 16, fill: "#FFFFFF", opacity: .85 }, g);
  el("ellipse", { cx: 200, cy: y + 4, rx: 96, ry: 18, fill: HAT_COL[col], ...S6(6) }, g); return g; }
function putGlasses(c, dy = 0) { const g = addOn(c, el("g", {}, c.head.g)); const [a, b] = c.eyes; const r = 34;
  [a, b].forEach(e => el("circle", { cx: e.cx, cy: e.cy + dy, r, fill: "#FFFFFF44", ...S6(7) }, g)); el("path", { d: `M${a.cx + r} ${a.cy + dy} Q${(a.cx + b.cx) / 2} ${a.cy + dy - 16} ${b.cx - r} ${b.cy + dy}`, fill: "none", ...S6(6) }, g); return g; }
function putMustache(c, y) { const g = addOn(c, el("g", {}, c.head.g)); el("path", { d: `M200 ${y} Q170 ${y - 18} 140 ${y + 4} Q170 ${y + 14} 200 ${y + 4} Q230 ${y + 14} 260 ${y + 4} Q230 ${y - 18} 200 ${y} Z`, fill: "#5A3A2A", ...S6(4) }, g); return g; }

/* ---------- 物の 絵 ---------- */
Object.assign(ITEM2, {
  crate(g) { el("rect", { x: -120, y: -40, width: 240, height: 80, rx: 8, fill: "#C98A4B", ...S6p() }, g); el("path", { d: "M-120 0 H120", ...S6p(4) }, g); },
  berry(g) { el("path", { d: "M0 26 Q-26 4 -20 -12 Q0 -24 20 -12 Q26 4 0 26 Z", fill: "#E8473C", ...S6p(4) }, g); el("path", { d: "M-12 -14 L0 -24 L12 -14", fill: "#4FA35A", ...S6p(3) }, g);
    [[-8, -2], [6, 2], [-2, 10]].forEach(([x, y]) => el("circle", { cx: x, cy: y, r: 2.5, fill: "#FFE27A" }, g)); },
  cheese(g) { el("path", { d: "M-60 30 L60 30 L60 -10 L-60 -30 Z", fill: "#FFD25E", ...S6p(5) }, g); [[-30, 8, 8], [10, 14, 6], [36, 0, 7]].forEach(([x, y, r]) => el("circle", { cx: x, cy: y, r, fill: "#F2B04A" }, g)); },
  bigtree(g) { el("rect", { x: -40, y: 0, width: 80, height: 330, rx: 12, fill: "#9A6A3E", ...S6p() }, g);
    [[0, -40, 190], [-130, 30, 120], [130, 30, 120], [-70, -150, 120], [80, -150, 120]].forEach(([x, y, r]) => el("circle", { cx: x, cy: y, r, fill: "#5DB86A", ...S6p() }, g));
    el("circle", { cx: 0, cy: -40, r: 175, fill: "#5DB86A" }, g); },
  flowers(g) { el("rect", { x: -150, y: 0, width: 300, height: 60, rx: 10, fill: "#9A6A3E", ...S6p() }, g);
    [-110, -40, 30, 100].forEach((x, i) => { el("path", { d: `M${x} 0 V-70`, ...S6p(6), stroke: "#4FA35A" }, g); el("circle", { cx: x, cy: -80, r: 22, fill: ["#FF8FA3", "#FFD25E", "#B9A8D9", "#FF9E5E"][i], ...S6p(4) }, g); el("circle", { cx: x, cy: -80, r: 8, fill: "#FFF6E0" }, g); }); },
  train(g) { el("rect", { x: -420, y: -170, width: 840, height: 300, rx: 40, fill: "#7FCBF0", ...S6p(8) }, g); el("rect", { x: -420, y: 60, width: 840, height: 30, fill: "#3E7FD6" }, g);
    [-330, -170, 10, 170].forEach(x => el("rect", { x, y: -130, width: 120, height: 110, rx: 14, fill: "#E8F6FF", ...S6p(5) }, g)); el("rect", { x: 300, y: -130, width: 80, height: 230, rx: 8, fill: "#C8E6F8", ...S6p(5) }, g);
    [-300, 300].forEach(x => el("circle", { cx: x, cy: 140, r: 34, fill: "#555", ...S6p(5) }, g)); },
  spotlight(g) { el("path", { d: "M-60 -600 L60 -600 L260 0 L-260 0 Z", fill: "#FFF6C8", opacity: .55 }, g); el("ellipse", { cx: 0, cy: 0, rx: 260, ry: 40, fill: "#FFF6C8", opacity: .7 }, g); },
});
/* ---------- へや ---------- */
ROOMS2["ちゅうの いえ"] = function (L) { ROOMS2.いえ(L); el("rect", { x: 0, y: 0, width: 1600, height: 760, fill: "#E9F3FF", opacity: .45 }, L); };
ROOMS2["めえばあの いえ"] = function (L) { ROOMS2.いえ(L); el("rect", { x: 0, y: 0, width: 1600, height: 760, fill: "#F3E9FF", opacity: .45 }, L);
  el("rect", { x: 700, y: 560, width: 300, height: 120, rx: 30, fill: "#C08A5A", ...S6(6) }, L); el("rect", { x: 680, y: 640, width: 340, height: 110, rx: 30, fill: "#D9A066", ...S6(6) }, L); };
ROOMS2["はやくち ステージ"] = function (L) {
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#5A2A4A" }, L);
  for (let x = 0; x < 1600; x += 100) el("path", { d: `M${x} 0 Q${x + 50} 380 ${x} 760`, stroke: "#8E2F4F", "stroke-width": 50, fill: "none" }, L);
  el("path", { d: "M0 0 H1600 V90 Q1200 150 800 90 Q400 150 0 90 Z", fill: "#C23A4A", ...S6(6) }, L);
  el("rect", { x: 0, y: 740, width: 1600, height: 260, fill: "#C98A4B" }, L); el("path", { d: "M0 740 H1600", ...S6(6) }, L);
  for (let x = 0; x < 1600; x += 200) el("path", { d: `M${x} 740 V1000`, stroke: "#00000018", "stroke-width": 4 }, L);
  [[330, 1], [1100, 1]].forEach(([x]) => { const g = el("g", { transform: `translate(${x} 975)` }, L); ITEM2.spotlight(g); });
};

/* ================= 😂 つっこみ場面 ================= */
const GAG_POS = { // [x, 大きさ]
  tsumami: { doshin: [760, 1.0], gaojii: [1260, 1.0] }, kazoku: { chu: [760, .46] }, osoi: { pyon: [760, .86], kamejii: [1150, .9] },
  kakure: { mii: [700, .86], nobbo: [960, .95] }, henshin: { gao: [760, .9], kon: [1150, .88] }, megane: { chu: [760, .46], meebaa: [1150, .9] },
  jump: { pyon: [800, .86], gao: [1180, .9] }, cheese: { chu: [820, .46], doshinpapa: [1300, 1.4] }, mizu: { mii: [720, .86], doshin: [1260, 1.0] },
  densha: { chu: [700, .46], kamejii: [1000, .9] },
  robo: { gao: [760, .9], nobbo: [1150, .95] }, mimi: { chu: [760, .46], kon: [1150, .88] }, gaokou: { pyon: [760, .86], gao: [1150, .9] }, nuigurumi: { mii: [720, .86], chu: [1220, .46] }, sakasa: { doshin: [760, 1.0], nobbo: [1180, .95] },
};
// にせもの せんせい：ほんにんを かくして、べつの キャラを おなじ ばしょに 出す（ドロンで もどす）
function disguise(c, who, as, x, sc) { const real = c[who], fake = C[as]; resetChar(fake); place(fake, x, 975, sc); show(fake); real.root.style.display = "none"; { const i = visible.indexOf(real); if (i >= 0) visible.splice(i, 1); } c[who] = fake; window["__real_" + who] = real; return fake; }
function undisguise(c, who, x, sc) { const fake = c[who], real = window["__real_" + who] || C[who];
  for (let i = 0; i < 10; i++) { const p = world(fake, 200, 250); mark("puff", p.x + (Math.random() - .5) * 220, p.y + (Math.random() - .5) * 220, { vy: -60, life: 1, s: 1.2 }); } noise(.3, 600, .6);
  fake.root.style.display = "none"; { const i = visible.indexOf(fake); if (i >= 0) visible.splice(i, 1); } (window.__addons || []).forEach(g => g.remove()); window.__addons = [];
  place(real, x, 975, sc); real.root.style.display = ""; visible.push(real); c[who] = real; surprise(real); }
const addon = g => { (window.__addons = window.__addons || []).push(g); return g; };
const pop = (f = 900) => { if (!ctx) return; blip(f, f * 1.8, .12, "sine"); };
const slurp = () => { if (!ctx) return; for (let i = 0; i < 6; i++) later(i * 110, () => blip(300 + i * 60, 200, .1, "sawtooth")); };
const splash = () => { if (!ctx) return; noise(.6, 1200, .5); noise(.3, 3000, .3); };
const choo = () => { if (!ctx) return; for (let i = 0; i < 8; i++) later(i * 260, () => { noise(.12, 260, .35); if (i % 2) blip(90, 70, .1, "square"); }); };
function trunkTube(d) { // どしんの はなを のばす（はなさきから 目的地へ）
  const g = el("g", {}, front()); const p0 = () => world(d, 266, 274);
  const a = el("path", { fill: "none", stroke: INK, "stroke-width": 44 * d.s / 1, "stroke-linecap": "round" }, g), b = el("path", { fill: "none", stroke: "#A9BEDD", "stroke-width": 32 * d.s, "stroke-linecap": "round" }, g);
  const set = (x, y) => { const p = p0(), dd = `M${p.x.toFixed(0)} ${p.y.toFixed(0)} Q${((p.x + x) / 2).toFixed(0)} ${(Math.min(p.y, y) - 80).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)}`; a.setAttribute("d", dd); b.setAttribute("d", dd); };
  return { g, to: (x, y, ms) => { const p = p0(); return tween(ms, k => set(p.x + (x - p.x) * k, p.y + (y - p.y) * k)); }, back: (x, y, ms) => { const p = p0(); return tween(ms, k => set(x + (p.x - x) * k, y + (p.y - y) * k)).then(() => g.remove()); }, tip: () => p0() };
}
function drip(c, n = 6) { for (let i = 0; i < n; i++) later(i * 260, () => { const p = world(c, 140 + rnd(120), 120 + rnd(200)); mark("drop", p.x, p.y, { vy: 80, grav: 900, life: .8, s: .6 }); }); }

const GAG_ANIM = {
  async tsumami(c, line, h) { const { doshin, gaojii } = c;
    const cr = prop("crate", 1060, 900, .9); const bs = []; for (let i = 0; i < 6; i++) bs.push(prop("berry", 990 + (i % 3) * 60, 850 - Math.floor(i / 3) * 34, .9));
    jump(gaojii, .4); await line(0);
    gaojii.dx.t = 90; gaojii.headRot.t = 18; gaojii.eyeX.t = 16; hold(gaojii, "shake", 3); // うしろを むいて しなものを ならべる
    doshin.eyeX.t = 14; markAbove(doshin, "heart"); await line(1);
    markAbove(h, "ex");
    const eat = async (b, i) => { const tb = trunkTube(doshin), bb = b.transform.baseVal.consolidate().matrix; await tb.to(bb.e, bb.f, 380); b.remove(); slurp(); await tb.back(bb.e, bb.f, 320);
      for (let j = 0; j < 4; j++) later(j * 160, () => { doshin.mouthOpen.t = j % 2 ? 0 : .5; }); later(700, () => doshin.mouthOpen.t = 0); if (i < 2) await sleep(200); };
    const talk = line(2); for (let i = 0; i < 3; i++) await eat(bs.pop(), i); await talk;
    doshin.happyOn = true; markAbove(doshin, "sparkle"); },
  async kazoku(c, line, h) { const { chu } = c; const F = [["", .44], ["brightness(.8)", .5], ["hue-rotate(40deg)", .4], ["sepia(.5)", .42], ["brightness(1.15)", .36]];
    const spots = []; for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) spots.push([960 + i * 105 + (r % 2) * 50, 975 - r * 120, .44 - r * .07]);
    const add = async n => { for (let i = 0; i < n && spots.length; i++) { const [x, y, s] = spots.shift(); const m = clone("chu", x + 400, y, s); m.root.style.filter = F[CLONES.length % F.length][0];
      if (CLONES.length % 4 === 1) putHat(m, ["red", "blue", "yellow"][CLONES.length % 3]); if (CLONES.length % 5 === 3) putGlasses(m);
      m.dx.v = 0; m.dx.t = -400; hold(m, "run", .5); pop(700 + CLONES.length * 40); await sleep(220); } };
    jump(chu, .5); await line(0);
    const a1 = add(4); await line(1); await a1;
    const a2 = add(8); await line(2); await a2;
    markAbove(h, "ex"); hold(h, "shiver", 1.4);
    const a3 = add(6); await line(3); await a3; shake(400, 12);
    CLONES.forEach((m, i) => later(i * 60, () => jump(m, .3))); await sleep(800); },
  async osoi(c, line, h) { const { kamejii, pyon } = c; // かめじいの 話が おそすぎる → 5びょうくらいで つっこむ
    wave(pyon); await line(0);
    later(2200, () => { pyon.tm.closed = 1e6; markAbove(pyon, "z"); later(700, () => markAbove(pyon, "z", { dx: 40 })); }); later(3400, () => playMove(h, "sleepy"));
    await line(1, 5); markAbove(h, "ex"); },
  async kakure(c, line, h) { const { nobbo, mii } = c;
    mii.armL.t = -160; mii.armR.t = 160; mii.headY.t = 14; hold(mii, "shake", 3); await line(0);
    playMove(nobbo, "nod"); await line(1);
    await walk(nobbo, 300, 1300); nobbo.lift.t = 70; // 木の うしろへ（首が 上から まるみえ）
    const t = el("g", {}, front()); const p = world(nobbo, 200, 500); ITEM2.bigtree(el("g", { transform: `translate(${p.x.toFixed(0)} ${p.y.toFixed(0)}) scale(${(nobbo.s * .95).toFixed(2)})` }, t)); window.__tree = t;
    await sleep(500);
    mii.armL.t = 0; mii.armR.t = 0; mii.headY.t = 0; playMove(mii, "look"); await line(2);
    for (let i = 0; i < 3; i++) later(i * 420, () => { nobbo.headRot.t = i % 2 ? -8 : 8; }); await line(3); nobbo.headRot.t = 0;
    markAbove(h, "ex"); playMove(mii, "look"); await sleep(600); },
  // こんが こうちょうせんせい（かめじい）に 化けている。でも きつねの しっぽだけ でている
  async henshin(c, line, h) { const { kon, gao } = c; const kj = C.kamejii; window.__kon = kon; resetChar(kj); place(gao, 640, 975, .9); place(kj, 1080, 975, .9); show(kj);
    kon.root.style.display = "none"; { const i = visible.indexOf(kon); if (i >= 0) visible.splice(i, 1); } c.kon = kj;
    const tl = el("g", {}, kj.root); kj.root.insertBefore(tl, kj.root.firstChild); const tg = el("g", { transform: "translate(130 330) scale(-1.9 1.9) translate(-258 -344)" }, tl);
    el("path", { d: "M258 360 Q340 380 352 300 Q358 250 322 238 Q300 280 300 312 Q290 340 258 344 Z", fill: "#F29F4C", ...S6(6) }, tg); el("path", { d: "M322 238 Q358 250 352 300 Q336 288 318 272 Q314 254 322 238 Z", fill: "#FFF6E9", ...S6(4) }, tg);
    let wag = 0; const t0 = performance.now(); addTick(() => { if (!tl.isConnected) return false; tl.setAttribute("transform", `rotate(${(Math.sin((performance.now() - t0) / 300) * wag).toFixed(1)} 130 330)`); });
    window.__ktail = tl; window.__wag = v => wag = v; CLEAN.push(() => tl.remove());
    await line(0);
    gao.eyeX.t = 14; markAbove(gao, "q"); await line(1); gao.eyeX.t = 0;
    wag = 14; for (let i = 0; i < 5; i++) later(i * 300, () => blip(900, 1300, .06, "triangle")); await line(2);
    markAbove(h, "ex"); wag = 22; await sleep(900); },
  // 🤖 ロボせんせい：のっぽの かおに てつの プレート、アンテナ。カクカク うごく
  async robo(c, line, h) { const { nobbo, gao } = c; const g = addon(el("g", {}, nobbo.head.g));
    el("rect", { x: 96, y: 96, width: 208, height: 170, rx: 16, fill: "#B0B7C3", ...S6(6) }, g); [[150, 150], [250, 150]].forEach(([x, y]) => { el("rect", { x: x - 28, y: y - 24, width: 56, height: 48, rx: 6, fill: "#2B2A33" }, g); el("rect", { x: x - 16, y: y - 12, width: 32, height: 24, rx: 4, fill: "#7FCBF0" }, g); });
    el("rect", { x: 140, y: 210, width: 120, height: 26, rx: 6, fill: "#2B2A33" }, g); [160, 185, 210, 235].forEach(x => el("rect", { x, y: 214, width: 10, height: 18, fill: "#FFFFFF" }, g));
    el("path", { d: "M200 96 V40", ...S6(8), fill: "none" }, g); const ant = el("circle", { cx: 200, cy: 34, r: 16, fill: "#E8473C", ...S6(5) }, g); window.__ant = ant;
    let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; ant.setAttribute("fill", Math.floor(t * 4) % 2 ? "#E8473C" : "#FFD25E"); });
    nobbo.tempo = .5; for (let i = 0; i < 4; i++) later(i * 420, () => { nobbo.armL.t = i % 2 ? -90 : 0; nobbo.armR.t = i % 2 ? 0 : -90; blip(600 + i * 80, 600 + i * 80, .06, "square"); });
    await line(0); nobbo.armL.t = nobbo.armR.t = 0;
    gao.eyeX.t = 14; markAbove(gao, "q"); await line(1); gao.eyeX.t = 0;
    for (let i = 0; i < 4; i++) later(i * 300, () => { nobbo.headRot.t = i % 2 ? 10 : -10; blip(900, 900, .05, "square"); }); await line(2); nobbo.headRot.t = 0;
    markAbove(h, "ex"); await sleep(600); },
  // 🦊 みみが きつね：こんが めえばあせんせいに。しっぽは かくしたけど みみが きつね
  async mimi(c, line, h) { const { chu } = c; const mb = disguise(c, "kon", "meebaa", 1150, .9);
    const e = addon(el("g", {}, mb.head.g)); [["M98 150 L112 40 L182 104 Z", "M112 128 L118 70 L160 106 Z"], ["M302 150 L288 40 L218 104 Z", "M288 128 L282 70 L240 106 Z"]].forEach(([a, b]) => { el("path", { d: a, fill: "#F29F4C", ...S6(6) }, e); el("path", { d: b, fill: "#5A3A2A" }, e); });
    let t = 0; addTick(dt => { if (!e.isConnected) return false; t += dt; e.setAttribute("transform", `rotate(${(Math.sin(t * 6) * 4).toFixed(1)} 200 120)`); });
    await line(0); jump(chu, .6); joy(chu); await line(1);
    mb.armL.t = 40; mb.armR.t = -40; await line(2); mb.armL.t = mb.armR.t = 0; markAbove(h, "ex"); await sleep(600); },
  // 🦁 がお こうちょう：がおが かめじいに。たてがみが はみでて、がおーが まざる
  async gaokou(c, line, h) { const { pyon } = c; const kj = disguise(c, "gao", "kamejii", 1150, .9);
    const m = addon(el("g", {}, kj.head.g)); kj.head.g.insertBefore(m, kj.head.g.firstChild); for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; el("ellipse", { cx: 200 + Math.cos(a) * 128, cy: 176 + Math.sin(a) * 120, rx: 34, ry: 30, fill: "#C8662B", ...S6(5) }, m); }
    await line(0); pyon.eyeX.t = 12; markAbove(pyon, "q"); await line(1); pyon.eyeX.t = 0;
    hold(kj, "shake", 1.5); for (let i = 0; i < 3; i++) later(i * 500, () => markAbove(kj, "drop", { dx: i % 2 ? 50 : -50 })); await line(2); markAbove(h, "ex"); await sleep(600); },
  // 🧸 ぬいぐるみ せんせい：くまたの ぬいぐるみが せんせいの せき。うしろに ちゅうが かくれて しゃべる
  async nuigurumi(c, line, h) { const { mii } = c; const chu = c.chu; const km = C.kuma; resetChar(km); place(km, 1180, 975, 1.0); show(km); km.tm.closed = 1e6; km.tempo = 0; km.root.parentNode.appendChild(km.root);
    const tie = addon(el("g", {}, km.root)); el("path", { d: "M186 300 L200 322 L214 300 L200 290 Z", fill: "#E8473C", ...S6(4) }, tie); el("rect", { x: 160, y: 276, width: 80, height: 14, rx: 7, fill: "#E8473C", ...S6(4) }, tie);
    window.__kuma = km; place(chu, 1300, 975, .46); // ちゅうは くまたの うしろ（はしだけ みえる）
    hold(chu, "shake", 2.5); await line(0);
    mii.eyeX.t = 12; playMove(mii, "look"); await line(1); mii.eyeX.t = 0;
    for (let i = 0; i < 3; i++) later(i * 400, () => jump(chu, .25)); await line(2); markAbove(h, "ex"); await sleep(600); },
  // 🙃 さかさま せんせい：のっぽが さかだちで はいって くる
  async sakasa(c, line, h) { const { nobbo, doshin } = c; const w = el("g", { transform: "rotate(180 200 298)" }); while (nobbo.root.firstChild) w.appendChild(nobbo.root.firstChild); nobbo.root.appendChild(w); window.__flip = w;
    nobbo.dx.v = nobbo.dx.t = 900; hold(nobbo, "run", 1.2); nobbo.dx.t = 0; await sleep(1200);
    await line(0); doshin.eyeX.t = -12; markAbove(doshin, "q"); await line(1); doshin.eyeX.t = 0;
    for (let i = 0; i < 3; i++) later(i * 400, () => { nobbo.lean.t = i % 2 ? 8 : -8; }); await line(2); nobbo.lean.t = 0; markAbove(h, "ex"); await sleep(600); },
  async megane(c, line, h) { const { meebaa, chu } = c; const gl = putGlasses(meebaa, -110); window.__gl = gl; // めがねは あたまの うえ
    playMove(meebaa, "look"); await line(0);
    jump(chu, .5); await line(1);
    await walk(chu, -200, 700); playMove(chu, "crouch"); await sleep(600); await walk(chu, 260, 800);
    playMove(meebaa, "no"); await line(2); markAbove(h, "ex"); },
  async jump(c, line, h) { const { pyon, gao } = c;
    await line(0); jump(gao, .7); await sleep(800);
    await line(1); const y0 = pyon.y, s0 = pyon.s; blip(300, 2400, .9, "sine");
    await tween(700, k => { pyon.y = y0 - 1500 * k * k; }); markAbove(h, "ex"); surprise(gao); await sleep(700);
    pyon.s = .24; pyon.x = 1200 - 200 * pyon.s; pyon.y = 330 - pyon.base * pyon.s; markAbove(pyon, "sparkle"); await line(2); // そらの むこうで「やっほー」
    pyon.s = s0; pyon.x = 800 - 200 * s0; const yt = 975 - pyon.base * s0; blip(2400, 300, .9, "sine");
    await tween(600, k => { pyon.y = (yt - 1500) + 1500 * k * k; }); pyon.y = yt; thud(); boom(.5); shake(400, 22); flop(gao); await sleep(500); },
  async cheese(c, line, h) { const { chu, doshinpapa } = c; const tw = el("g", {}, front()); const ch = [];
    follow(tw, () => { const p = world(chu, 200, chu.top); return [p.x, p.y, Math.sin(performance.now() / 160) * (window.__wob || 0), 1]; });
    jump(chu, .5); await line(0);
    for (let i = 0; i < 9; i++) { ch.push(el("g", {}, tw)); ITEM2.cheese(el("g", { transform: `translate(${(i % 2 ? 8 : -8)} ${-30 - i * 46}) scale(.7)` }, ch[i])); pop(500 + i * 60); await sleep(110); }
    surprise(doshinpapa); markAbove(doshinpapa, "ex"); await line(1);
    window.__wob = 6; hold(chu, "shiver", 3); const l2 = line(2); await sleep(900); window.__wob = 14; await l2;
    window.__wob = 0; tw.remove(); thud(); boom(.6); shake(500, 20); flop(chu);
    const pile = el("g", {}, front()); const p = world(chu, 200, 300); for (let i = 0; i < 9; i++) ITEM2.cheese(el("g", { transform: `translate(${(p.x - 120 + (i % 3) * 120).toFixed(0)} ${(975 - 40 - Math.floor(i / 3) * 50).toFixed(0)}) rotate(${(i * 37) % 40 - 20}) scale(.8)` }, pile));
    window.__pile = pile; markAbove(h, "ex"); await sleep(500); },
  async mizu(c, line, h) { const { mii, doshin } = c; const fl = prop("flowers", 1010, 930, .8);
    playMove(mii, "point"); await line(0);
    const l1 = line(1); doshin.lean.t = 12; slurp(); await sleep(900); doshin.lean.t = -8; await l1;
    splash(); { const st = slam("ザバーッ！", 300, 130, "#7FCBF0"); later(1300, () => st.remove()); } for (let i = 0; i < 70; i++) later(i * 30, () => { const t = world(doshin, 266, 274); mark("drop", t.x, t.y, { vx: -700 - rnd(800), vy: -350 + rnd(400), grav: 900, life: 1.2, s: 1.3 }); });
    await sleep(500); surprise(mii); surprise(h); drip(mii, 10); drip(h, 10); mii.sadMouth = true; h.sadMouth = true;
    await line(2); },
  async densha(c, line, h) { const { chu, kamejii } = c; const tr = el("g", {}, propG); ITEM2.train(tr); let tx = 2200; const pos = () => tr.setAttribute("transform", `translate(${tx} 650) scale(1.45)`); pos();
    choo(); await tween(1600, k => { tx = 2200 - 1300 * (1 - (1 - k) * (1 - k)); pos(); }); noise(.4, 3000, .3);
    playMove(chu, "point"); await line(0);
    await line(1); hold(kamejii, "run", 6); const w = walk(kamejii, 40, 5000);
    const l2 = line(2); await sleep(900); noise(.5, 3000, .35); choo(); await tween(1800, k => { tx = 900 - 1700 * k * k; pos(); }); markAbove(chu, "ex"); markAbove(h, "ex"); await l2; await w; },
};
const GAG_RES = { // つっこまれた あとの 動き（ボケた子の 返事の まえ）
  tsumami: c => { const { doshin } = c; doshin.happyOn = false; playMove(doshin, "shy"); },
  kazoku: c => { playMove(c.chu, "shy"); },
  osoi: c => { const { pyon } = c; delete pyon.tm.closed; surprise(pyon); },
  kakure: c => { surprise(c.nobbo); },
  henshin: c => { const kj = C.kamejii, kon = window.__kon || C.kon; // ドロン！ と もとの こんに もどる
    for (let i = 0; i < 10; i++) { const p = world(kj, 200, 250); mark("puff", p.x + (Math.random() - .5) * 220, p.y + (Math.random() - .5) * 220, { vy: -60, life: 1, s: 1.2 }); } noise(.3, 600, .6);
    kj.root.style.display = "none"; { const i = visible.indexOf(kj); if (i >= 0) visible.splice(i, 1); } if (window.__ktail) window.__ktail.remove();
    place(kon, 1080, 975, .88); kon.root.style.display = ""; visible.push(kon); c.kon = kon; surprise(kon); },
  megane: c => { const { meebaa } = c; meebaa.armR.t = -150; const g = window.__gl; if (g) tween(500, k => g.setAttribute("transform", `translate(0 ${(110 * k).toFixed(0)})`)); later(600, () => meebaa.armR.t = 0); },
  jump: c => playMove(c.pyon, "shy"),
  cheese: c => { const p = window.__pile; if (p) tween(500, k => p.setAttribute("opacity", (1 - k * .8).toFixed(2))); jump(c.chu, .3); },
  mizu: c => playMove(c.doshin, "shy"),
  densha: c => surprise(c.kamejii),
  robo: c => { const { nobbo } = c; for (let i = 0; i < 12; i++) later(i * 120, () => { const p = world(nobbo, 200, 120); mark("puff", p.x + (Math.random() - .5) * 160, p.y - 40, { vy: -90, life: 1.1, s: 1.1 }); if (i % 3 === 0) mark("sparkle", p.x + (Math.random() - .5) * 200, p.y + 40, { vy: 40, life: .5, s: .6 }); }); noise(.5, 2000, .5); hold(nobbo, "shiver", 1.6); if (window.__ant) window.__ant.setAttribute("fill", "#5E6A7A"); },
  mimi: c => undisguise(c, "kon", 1150, .88),
  gaokou: c => undisguise(c, "gao", 1150, .9),
  nuigurumi: c => { const { chu } = c; walk(chu, 150, 600); later(300, () => playMove(chu, "shy")); const km = window.__kuma; if (km) { km.lean.t = 14; later(500, () => { km.lean.t = 0; }); } },
  sakasa: c => { const { nobbo } = c; const w = window.__flip; if (w) { tween(700, k => w.setAttribute("transform", `rotate(${(180 - 180 * k).toFixed(0)} 200 298)`)).then(() => { while (w.firstChild) nobbo.root.appendChild(w.firstChild); w.remove(); window.__flip = null; }); } for (let i = 0; i < 4; i++) later(i * 250, () => markAbove(nobbo, "sparkle", { dx: (i - 1.5) * 50 })); },
};
const GAG_END = {
  tsumami: async c => { playMove(c.gaojii, "laugh"); await sleep(400); },
  kazoku: async () => { CLONES.forEach((m, i) => later(i * 70, () => { jump(m, .5); playMove(m, "bow"); })); await sleep(1400); },
  osoi: async c => { flop(c.pyon); await sleep(600); },
  kakure: async c => { playMove(c.mii, "point"); playMove(c.nobbo, "shy"); await sleep(600); },
  henshin: async c => { playMove(c.gao, "laugh"); playMove(c.kon, "shy"); await sleep(600); },
  megane: async c => { joy(c.meebaa); await sleep(400); },
  jump: async c => { playMove(c.gao, "frustrated"); await sleep(500); },
  cheese: async c => { playMove(c.doshinpapa, "laugh"); await sleep(400); },
  mizu: async c => { c.mii.sadMouth = false; playMove(c.mii, "laugh"); await sleep(500); },
  densha: async c => { playMove(c.kamejii, "nod"); await sleep(400); },
  robo: async c => { playMove(c.gao, "laugh"); c.nobbo.tempo = 1; (window.__addons || []).forEach(g => g.remove()); window.__addons = []; playMove(c.nobbo, "shy"); await sleep(600); },
  mimi: async c => { playMove(c.chu, "laugh"); playMove(c.kon, "shy"); await sleep(600); },
  gaokou: async c => { playMove(c.pyon, "laugh"); playMove(c.gao, "shy"); await sleep(600); },
  nuigurumi: async c => { playMove(c.mii, "laugh"); const km = window.__kuma; if (km) { km.root.style.display = "none"; const i = visible.indexOf(km); if (i >= 0) visible.splice(i, 1); km.tempo = 1; delete km.tm.closed; } (window.__addons || []).forEach(g => g.remove()); window.__addons = []; await sleep(600); },
  sakasa: async c => { playMove(c.doshin, "laugh"); playMove(c.nobbo, "nod"); await sleep(600); },
};
async function lkGag(pc) {
  const it = pickL("gag", x => !x.cast.includes(pc.kind)); const ti = tierOf(), t = it.tiers[ti];
  const dummy = ["meebaa", "kamejii", "nobbo", "kon", "gaojii"].find(k => !it.cast.includes(k) && k !== pc.kind);
  const s = { id: "lkg_" + it.id, place: it.place, asker: dummy, cast: it.cast, intro: "gag", talk: it.talk };
  CAST_X[1] = CAST_X[1] || [900];
  const { hero: h } = setSitView(s, pc.kind); const cast = STORY_CAST, a = cast[it.boke];
  Object.entries(GAG_POS[it.id] || {}).forEach(([k, [x, sc]]) => place(cast[k], x, 975, sc));
  const L0 = E.L, t0 = performance.now(); let ok = false, n = 0; const tries = [];
  try {
    const line = async (i, sec) => { const [who, text] = it.talk[i], k = `lk_g_${it.id}_t${i}`;
      if (!sec) return speak(cast[who], k, text);
      const b = AUD[k] ? await voiceBuf(k) : null; await speakPart(cast[who], k, text, b ? Math.min(1, sec / b.duration) : 1); unsay(cast[who]); }; // とちゅうで きる
    await sleep(500); await GAG_ANIM[it.id](cast, line, h); await sleep(300);
    if (!it.noq) { await speak(cast[it.boke] || a, `lk_g_${it.id}_q`, it.q[1]); unsay(); }
    await speak(C.pony, "lk_g_ask", "なんて つっこむ？"); showTask(t.a, "つっこもう");
    let hh = E.h;
    for (; n < 3; n++) {
      if (hh < 3 && n !== 1) await speak(C.pony, `lk_g_${it.id}_a${ti}`, t.a); else if (n !== 1) { playMove(h, "think"); await sleep(700); }
      unsay(); setListen(h, true); const r = await listen(t.keys, 8000); setListen(h, false);
      tries.push(`${r.r === "ok" ? "○" : r.r === "part" ? "△" : "×"}${r.heard || ""}`);
      if (r.r === "ok") { ok = true; break; }
      if (r.r === "part") { playMove(h, "think"); await speak(C.pony, "p_close", "おしい！"); } else { playMove(h, "think"); await sleep(600); }
      if (n < 2) { hh = 1; await speak(C.pony, "p_again", "もう いっかい いってみよう"); }
    }
    playLog({ type: "gag", id: it.id, tier: ti + 1, L: L0, ok, answer: t.a, tries, sec: Math.round((performance.now() - t0) / 1000), who: NAMES[pc.kind] });
    grade(ok && n === 0);
    if (!ok) { await speak(C.pony, "p_together", "いっしょに いおうね"); await speak(C.pony, `lk_g_${it.id}_a${ti}`, t.a); playMove(h, "nod"); await sleep(500); }
    hideTask();
    if (ok) { playMove(h, "pump"); noise(.06, 3000, .5); blip(1600, 600, .12, "square"); const st = slam("ナイス つっこみ！", 330, 120, "#FF9E5E"); later(1400, () => st.remove()); confetti(40); await sleep(700); }
    if (GAG_RES[it.id]) GAG_RES[it.id](cast, h);
    await speak(cast[it.boke] || a, `lk_g_${it.id}_r`, it.res[1]);
    for (let i = 0; i < it.after.length; i++) { const [who, text] = it.after[i]; await speak(cast[who], `lk_g_${it.id}_e${i}`, text); }
    if (GAG_END[it.id]) await GAG_END[it.id](cast, h);
    if (ok) { joy(C.pony); await speak(C.pony, "p_great", "すごい！ いえたね！"); }
    await sleep(500);
  } finally { clearClones(); h.sadMouth = false; delete window.__wob; }
  setView("board"); return ok;
}

/* ================= 👅 はやくちことば ================= */
async function lkHaya(pc) {
  const L = E.L; let it = pickL("haya", x => x.lv <= L && x.botch[0] !== pc.kind && (L < 5 || x.lv >= 3));
  const bw = it.botch[0]; const s = { id: "lky", place: "はやくち ステージ", asker: ["meebaa", "kamejii", "nobbo", "kon"].find(k => k !== bw && k !== pc.kind), cast: [bw], intro: "haya", talk: [] };
  CAST_X[1] = CAST_X[1] || [900];
  const { hero: h } = setSitView(s, pc.kind); const b = STORY_CAST[bw]; place(b, 1100, 975, { gao: .9, mii: .86, chu: .46, pyon: .86, doshin: 1.0, kamejii: .9 }[bw] || .86);
  // ことばの かんばん
  const sg = el("g", {}, propG); const words = it.t.split(" "); const lines = []; let cur = "";
  words.forEach(w => { if ((cur + w).length > 11 && cur) { lines.push(cur.trim()); cur = ""; } cur += w + " "; }); lines.push(cur.trim());
  const fs = Math.min(84, 1100 / Math.max(...lines.map(l => l.length)));
  el("rect", { x: 230, y: 150, width: 1140, height: 110 + lines.length * fs * 1.2, rx: 30, fill: "#FFF8E8", ...S6(8) }, sg);
  lines.forEach((l, i) => txt(sg, 800, 230 + i * fs * 1.2, l, fs, { "text-anchor": "middle" })); txt(sg, 1300, 210, it.e, 60, { "text-anchor": "middle" });
  let ok = false; const tries = [];
  try {
    tune([[N.C5, .5], [N.E5, .5], [N.G5, .5], [N.C6, 1]], 220, "square", .06); await speak(C.pony, "lk_y_intro", "はやくちことばに ちょうせん！");
    // さきに だれかが ちょうせんして かむ
    jump(b, .5); await sleep(300);
    const bt = speak(b, `lk_y_${it.id}_b`, it.botch[1]); await sleep(1200); hold(b, "shiver", 1.2); await bt;
    markAbove(b, "drop"); flop(b); noise(.1, 600, .4); blip(500, 200, .3, "square"); playMove(h, "laugh"); joy(C.pony); await sleep(900);
    if (L <= 4) { await speak(C.pony, "lk_y_model", "ゆっくりで いいよ。おてほんを きいてね"); await speak(C.pony, `lk_y_${it.id}`, it.t); }
    await speak(C.pony, "lk_y_you", "こんどは きみの ばん！ いって みよう");
    for (let n = 0; n < 2 && !ok; n++) {
      unsay(); setListen(h, true); const off = lampOn(sg.firstChild); const r = await listen(it.keys, 10000); off(); setListen(h, false);
      tries.push(`${r.r === "ok" ? "○" : r.r === "part" ? "△" : "×"}${r.heard || ""}`);
      if (r.r === "ok") ok = true; else if (n === 0) await speak(C.pony, "p_again", "もう いっかい いってみよう");
    }
    playLog({ type: "haya", id: it.id, ok, tries, who: NAMES[pc.kind] }); grade(ok);
    if (ok) { const st = slam("いえたー！", 330, 140); later(1500, () => st.remove()); cannon(60, 1, 30); cannon(1540, -1, 30); hold(b, "clap", 2); joy(h); await speak(C.pony, "lk_y_ok", "いえたね！ すごい！ 1マス よけいに すすむよ"); }
    else { playMove(b, "laugh"); playMove(h, "laugh"); await speak(C.pony, "lk_y_ng", "おしい！ はやくちことばは、むずかしいね"); }
    await sleep(400);
  } finally { }
  setView("board"); if (ok) { await sleep(300); await forceStep(pc, 1); } return ok;
}

/* ================= 🔎 さがして タッチ ================= */
const SG_S = { pyon: .62, mii: .62, chu: .4, gao: .64, doshin: .72, kamejii: .62, nobbo: .5, meebaa: .62, kon: .62 };
const FAMILY = { pyon: ["pyonmama"], gao: ["gaojii"], mii: ["miibaa"], doshin: ["doshinpapa"] };
const SG_ANIMAL = { chu: "ネズミ", pyon: "うさぎ", mii: "ねこ" };
const HAT_JP = { red: "あかい", blue: "あおい", yellow: "きいろい" };
function sgQuestion(L) {
  const kinds = Object.keys(SG_S);
  if (L <= 2) { const t = kinds[rnd(kinds.length)]; return { type: "name", t, key: `lk_s_n_${t}`, text: `${LONG.sagasu.name[t]}は どこかな？` }; }
  const A = ["chu", "pyon", "mii"][rnd(3)], nm = SG_ANIMAL[A];
  if (L <= 4) { if (rnd(3) === 0) return { type: "glasses", A, key: `lk_s_g_${A}`, text: `めがねを かけた ${nm}は どこ？` };
    const col = ["red", "blue", "yellow"][rnd(3)]; return { type: "hat", A, col, key: `lk_s_h_${col}_${A}`, text: `${HAT_JP[col]} ぼうしの ${nm}は どこ？` }; }
  const ty = ["nohat", "big", "small"][rnd(3)];
  return { type: ty, A, key: `lk_s_x_${ty}_${A}`, text: { nohat: `ぼうしを かぶって いない ${nm}は どこ？`, big: `いちばん おおきい ${nm}は どこ？`, small: `いちばん ちいさい ${nm}は どこ？` }[ty] };
}
async function lkSagasu(pc) {
  const L = E.L, q = sgQuestion(L); const places = curStage === "eki" ? ["えき", "バスてい"] : ["すなば", "ベンチ", "いけ", "トラック", "ブランコ"]; // えきの コースは えきで
  const s = { id: "lks", place: places[rnd(places.length)], asker: "kon", cast: [], intro: "sagasu", talk: [] };
  const { hero: h } = setSitView(s, pc.kind); h.root.style.display = "none"; { const i = visible.indexOf(h); if (i >= 0) visible.splice(i, 1); }
  place(C.pony, 90, 985, .36);
  // ならぶ ばしょ（うしろの れつから）
  const rows = [[700, .62, 8], [830, .8, 7], [975, 1, 6]], spots = [];
  rows.forEach(([y, k, n]) => { for (let i = 0; i < n; i++) spots.push({ x: 300 + (1220 / (n - 1)) * i + (rnd(50) - 25), y, k }); });
  const sp = shuffle(spots).slice(0, L <= 2 ? 14 : 16).sort((a, b) => a.y - b.y || a.x - b.x);
  const others = Object.keys(SG_S).filter(k => k !== q.t && k !== q.A && !(FAMILY[q.t] || []).includes(k));
  const plan = sp.map(() => ({ kind: others[rnd(others.length)] }));
  const cand = sp.map((p, i) => i).filter(i => q.type === "small" ? sp[i].k === 1 : sp[i].k === .8); // さがす 子は まんなかの れつ（まえの 子の うしろに かくれる）
  const ti = cand[rnd(cand.length)]; const target = plan[ti];
  if (q.type === "name") target.kind = q.t;
  else { // おなじ どうぶつを たくさん まぜる
    const idxs = shuffle(plan.map((_, i) => i).filter(i => i !== ti)).slice(0, 6); idxs.forEach(i => plan[i].kind = q.A); target.kind = q.A;
    const cols = ["red", "blue", "yellow"];
    if (q.type === "hat") { idxs.forEach((i, j) => { const c = cols.filter(x => x !== q.col)[j % 2]; if (j % 3 !== 2) plan[i].hat = c; }); target.hat = q.col; }
    if (q.type === "glasses") { idxs.forEach((i, j) => { if (j % 2) plan[i].hat = cols[j % 3]; }); target.glasses = true; }
    if (q.type === "nohat") { idxs.forEach((i, j) => plan[i].hat = cols[j % 3]); }
    if (q.type === "big") { idxs.forEach(i => plan[i].size = .8 + rnd(25) / 100); target.size = 1.55; }
    if (q.type === "small") { idxs.forEach(i => plan[i].size = .85 + rnd(30) / 100); target.size = .5; }
  }
  const crowd = sp.map((p, i) => { const pl = plan[i]; const c = clone(pl.kind, p.x, p.y, SG_S[pl.kind] * p.k * (pl.size || 1)); if (pl.hat) putHat(c, pl.hat); if (pl.glasses) putGlasses(c);
    c.root.style.cursor = "pointer"; c.idx = i; return c; });
  // しげみ（まえの れつの 足もとを かくす）
  const bush = el("g", {}, front()); [[420, 990], [880, 1000], [1320, 990]].forEach(([x, y]) => [[-70, 0, 70], [0, -30, 80], [70, 0, 70]].forEach(([dx, dy, r]) => el("circle", { cx: x + dx, cy: y + dy, r, fill: "#5DB86A", ...S6(5) }, bush)));
  const tc = crowd[ti]; let ok = false, wrong = 0;
  // かくれんぼ：さがす 子は なにかの うしろに かくれて、あたましか 見えない。ほかの 子も いくつか おなじように かくす（それだけで わからない ように）
  const hideBehind = (c, kind) => { const cx = c.x + 200 * c.s, top = c.y + c.top * c.s, feet = c.y + c.base * c.s, eyeY = c.y + ((c.eyes && c.eyes[0] && c.eyes[0].cy) || 170) * c.s,
      y0 = Math.max(top + (feet - top) * .36, eyeY + 34 * c.s), w = 470 * c.s, g = el("g", {}, front()); // めより したを かくす（ぼうしや かおは かならず 見える）
    if (kind === 0) { const r = w * .2; [-.3, 0, .3].forEach(dx => el("circle", { cx: cx + dx * w, cy: y0 + r * (dx ? 1.15 : .9), r, fill: "#5DB86A", ...S6(5) }, g)); el("rect", { x: cx - w / 2, y: y0 + r, width: w, height: feet - y0, fill: "#5DB86A" }, g); }
    else if (kind === 1) { el("rect", { x: cx - w / 2, y: y0, width: w, height: feet - y0 + 10, rx: 10, fill: "#D9A066", ...S6(6) }, g); el("path", { d: `M${cx - w / 2} ${y0 + 24} H${cx + w / 2} M${cx} ${y0 + 24} V${feet + 10}`, ...S6(5), fill: "none" }, g); }
    else { el("rect", { x: cx - w / 2, y: y0, width: w, height: feet - y0 + 10, rx: w / 2 * .4, fill: "#7FA7D9", ...S6(6) }, g); [.25, .5, .75].forEach(k => el("path", { d: `M${cx - w / 2} ${y0 + (feet - y0) * k} H${cx + w / 2}`, stroke: "#5B8DEF", "stroke-width": 8 }, g)); }
    return g; };
  const hiders = shuffle(crowd.map((c, i) => i).filter(i => i !== ti)).slice(0, 3 + rnd(2)); hiders.push(ti);
  hiders.forEach(i => hideBehind(crowd[i], rnd(3)));
  // 10びょうの じかんせいげん
  const tbar = el("rect", { x: 300, y: 960, width: 1000, height: 24, rx: 12, fill: "#7BD389", ...S6(4) }, front()); let tleft = 10, timeUp = false, stopT = false;
  try {
    crowd.forEach((c, i) => later(i * 50, () => jump(c, .3))); await sleep(600);
    showTask(q.text, "さがして タッチ", 150);
    await speak(C.pony, q.key, q.text + " タッチしてね");
    // タッチは「いちばん ちかい あたま」で きめる（まえの 子の からだに かさなって いても、うしろの 子の あたまを えらべる 2026-10-18）
    let pickH = null; const unpick = () => { if (pickH) { svg.removeEventListener("pointerdown", pickH, true); pickH = null; } };
    const pick = () => new Promise(res => { unpick(); pickH = ev => { const m = svg.getScreenCTM(); if (!m) return; const p = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(m.inverse());
        let best = null, bd = 1e9;
        crowd.forEach(c => { const hc = world(c, 200, ((c.eyes && c.eyes[0] && c.eyes[0].cy) || 170)), r = 130 * c.s, d = Math.hypot(p.x - hc.x, p.y - hc.y) / r; if (d < 1.2 && d < bd) { bd = d; best = c; } });
        if (!best) crowd.forEach(c => { const a0 = world(c, 50, c.top || 0), b0 = world(c, 350, c.base || 400); if (p.x > a0.x && p.x < b0.x && p.y > a0.y && p.y < b0.y) { const d = Math.abs(p.x - (a0.x + b0.x) / 2); if (d < bd) { bd = d; best = c; } } });
        if (best) { ev.stopPropagation(); unpick(); res(best); } }; svg.addEventListener("pointerdown", pickH, true); });
    const timer = new Promise(res => addTick(dt => { if (stopT) return false; tleft -= dt; tbar.setAttribute("width", Math.max(0, 100 * tleft).toFixed(0)); if (tleft <= 3 && tleft + dt > 3) tbar.setAttribute("fill", "#FF8FA3"); if (tleft <= 0) { timeUp = true; res(null); return false; } }));
    while (true) {
      const c = await Promise.race([pick(), timer]);
      if (!c) break; // じかんぎれ
      if (c === tc) break;
      wrong++; flop(c); noise(.1, 700, .35); speak(c, `lk_s_no_${c.kind}`, LONG.sagasu.no[c.kind]);
      if (wrong === 3) { const p = world(tc, 200, 200); const ring = el("circle", { cx: p.x, cy: p.y, r: 200 * tc.s + 60, fill: "none", stroke: "#FFD25E", "stroke-width": 14, opacity: .9 }, front());
        tween(2400, k => ring.setAttribute("stroke-width", (14 + Math.sin(k * 20) * 6).toFixed(1))); await speak(C.pony, "lk_s_hint", "ヒント！ ひかって いる ところを みてね"); }
    }
    unpick(); crowd.forEach(c => c.root.onclick = null); stopT = true; tbar.remove(); ok = wrong === 0 && !timeUp;
    unsay(); hideTask();
    if (timeUp) { const p = world(tc, 200, 200); const ring = el("circle", { cx: p.x, cy: p.y, r: 200 * tc.s + 60, fill: "none", stroke: "#FFD25E", "stroke-width": 14, opacity: .9 }, front()); tween(2400, k => ring.setAttribute("stroke-width", (14 + Math.sin(k * 20) * 6).toFixed(1)));
      jump(tc, .5); noise(.3, 400, .4); await speak(C.pony, "lk_s_time", "じかんぎれ！ ここに いたよ"); playLog({ type: "sagasu", q: q.text, ok: false, wrong, timeUp: true, who: NAMES[pc.kind] }); grade(false); await sleep(600); }
    else {
    joy(tc); markAbove(tc, "sparkle"); chime(); confetti(40);
    await speak(tc, `lk_s_found_${tc.kind}`, LONG.sagasu.found[tc.kind]);
    crowd.forEach((c, i) => c !== tc && later(i * 40, () => jump(c, .4)));
    if (ok) await speak(C.pony, "lk_s_ok", "みつけた！ すごい！ 1マス よけいに すすむよ"); else await speak(C.pony, "lk_s_ok2", "みつけたね！");
    playLog({ type: "sagasu", q: q.text, ok, wrong, who: NAMES[pc.kind] }); grade(ok);
    await sleep(500); }
  } finally { stopT = true; tbar.remove(); crowd.forEach(c => c.root.onclick = null); clearClones(); }
  setView("board"); if (ok) { await sleep(300); await forceStep(pc, 1); } return ok;
}
Object.assign(LTASK_RUN, { gag: lkGag, haya: lkHaya, sagasu: lkSagasu });
