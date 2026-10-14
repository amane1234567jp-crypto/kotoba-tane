/* ================= たね と もり =================
   言えたら たねが 1つ もらえる（GS.ok が ふえた ぶん。GS.pend が まだ 見せていない 数）。
   ゴールで もらった たねを まいて、もりを そだてる。もりは この 端末に のこる（store の forest＝まいた 回ごとの たねの 数）。
   たねが ふえるほど 木が ふえ（手前 → おく へ ひろがる）、前に まいた 木は 1回ごとに 大きく なる。
   もりは 4まいの 層（おく・とおく・なか・てまえ）で、ゆっくり ゆれて うごく（ちかい 層ほど 大きく うごく）。 */

/* ---------- 1) もらう ---------- */
async function seedGet(c) {
  const n = GS.pend; if (!n) return; GS.pend = 0;
  const p = c ? headTop(c) : { x: 800, y: 420 }, x0 = Math.min(1450, Math.max(150, p.x)), y0 = Math.max(220, p.y - 70);
  const g = el("g", {}, hudLayer); seedIcon(g, 0, 0, 1);
  tune([[N.E5, .5], [N.G5, .5], [N.C6, 1]], 260, "triangle", .12);
  for (let i = 0; i < 8; i++) mark("sparkle", x0, y0, { vx: Math.cos(i * .785) * 320, vy: Math.sin(i * .785) * 320, life: .8, s: .6 });
  await tween(450, k => g.setAttribute("transform", `translate(${x0} ${(y0 - 50 * k).toFixed(1)}) scale(${(1.9 * easeBack(k)).toFixed(3)})`));
  let a = 0; addTick(dt => { if (!g.isConnected || g.flying) return false; a += dt; g.setAttribute("transform", `translate(${x0} ${(y0 - 50 + Math.sin(a * 5) * 10).toFixed(1)}) scale(1.9) rotate(${(Math.sin(a * 4) * 8).toFixed(1)})`); });
  if (n > 1) txt(g, 70, -40, `+${n}`, 40, { stroke: "#FFFFFF", "stroke-width": 8, "paint-order": "stroke" });
  await speak(C.pony, "p_tane", "たねを ゲット！");
  g.flying = true;
  await tween(520, k => { const e = k * k; g.setAttribute("transform", `translate(${(x0 + (120 - x0) * e).toFixed(1)} ${(y0 - 50 + (80 - y0 + 50) * e - Math.sin(k * Math.PI) * 120).toFixed(1)}) scale(${(1.9 - 1.2 * e).toFixed(3)}) rotate(${(300 * e).toFixed(1)})`); });
  blip(900, 1400, .1, "square"); g.remove();
}
// 盤に もどったら、まだ 見せていない たねを HUD へ とばす（はやくちことば・どいて など、場面の 外で 言えた とき）
let seedFlying = false;
function flySeeds() {
  const n = GS.pend; if (!n) return; seedFlying = true;
  const pc = MODE === "multi" && CUR_PL ? CUR_PL.pc : P.shima;
  for (let i = 0; i < n; i++) later(250 + i * 330, () => {
    const g = el("g", {}, hudLayer); seedIcon(g, 0, 0, .7); const x0 = pc.px, y0 = pc.py - 50;
    tween(650, k => { const x = x0 + (375 - x0) * k, y = y0 + (72 - y0) * k - Math.sin(k * Math.PI) * 170; g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(.7 + .35 * Math.sin(k * Math.PI)).toFixed(2)})`); })
      .then(() => { g.remove(); GS.pend = Math.max(0, GS.pend - 1); lvT.textContent = `× ${seedNow()}`; blip(1000 + i * 90, 1500, .08, "square");
        tween(260, k => lvG.setAttribute("transform", `translate(435 72) scale(${(1 + .15 * Math.sin(k * Math.PI)).toFixed(3)}) translate(-435 -72)`));
        if (i === n - 1) seedFlying = false; });
  });
}
addTick(() => { if (view === "board" && GS.pend > 0 && !seedFlying && !winner) flySeeds(); });

/* ---------- 2) もり ---------- */
const FOREST = {
  get() { const f = store.get().forest; return Array.isArray(f) ? f : []; },
  add(n) { const r = store.get(); r.forest = Array.isArray(r.forest) ? r.forest : []; r.forest.push(n); store.set(r); },
};
function rng32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
// 層：0＝いちばん おく … 3＝てまえ。たねは てまえ から うまっていく
const F_LAY = [
  { n: 160, y: 585, s: .19, x0: 20, x1: 1580, p: 37, ground: "#B9DDB0", hill: 560, amp: 4, zoom: .12, col: ["#86BE8E", "#A8D3AC", "#78B086", "#F4C3D2"], trunk: "#9A8676" },
  { n: 40, y: 655, s: .32, x0: 40, x1: 1560, p: 17, ground: "#A5D493", hill: 625, amp: 9, zoom: .22, col: ["#73B66F", "#98CC8E", "#5FA46D", "#FFC2D1"], trunk: "#8E6E55" },
  { n: 20, y: 760, s: .55, x0: 70, x1: 1530, p: 7, ground: "#90CB7C", hill: 715, amp: 16, zoom: .34, col: ["#62AE58", "#8ACB76", "#4E9A5C", "#FFB3C7"], trunk: "#86603F" },
  { n: 12, y: 905, s: .82, x0: 560, x1: 1530, p: 5, ground: "#7CC36A", hill: 830, amp: 26, zoom: .5, col: ["#5AAA4C", "#86CC6C", "#3F9150", "#FFA8C0"], trunk: "#7A5232" },
];
const F_SLOTS = (() => { const r = rng32(7), out = [];
  for (let L = 3; L >= 0; L--) { const D = F_LAY[L];
    for (let j = 0; j < D.n; j++) { const i = (j * D.p) % D.n, w = (D.x1 - D.x0) / D.n;
      out.push({ L, x: D.x0 + w * (i + .5) + (r() - .5) * w * .6, y: D.y + (r() - .5) * 14 * D.s / .3, t: (out.length * 3 + (r() * 5 | 0)) % 5, ph: r() * 6.28 }); } }
  return out; })();
const F_STAGE = [0, .42, .62, .82, 1, 1.14];
// 木（もとの 大きさ：高さ 320 くらい。ねもとが 0,0）
function fTree(g, t, D) {
  const k = el("g", {}, g), [c0, c1, c2, pink] = D.col, sw = { stroke: INK, "stroke-width": 7, "stroke-linejoin": "round" };
  const trunk = (w, h) => el("path", { d: `M${-w} 0 L${-w * .7} ${-h} L${w * .7} ${-h} L${w} 0 Z`, fill: D.trunk, ...sw }, k);
  const extra = { fruit: [], bloom: [] };
  if (t === 1) { // まつ
    trunk(12, 70); [[-95, -50, -175], [-80, -125, -250], [-58, -195, -318]].forEach(([w, b, top]) => el("path", { d: `M${w} ${b} L0 ${top} L${-w} ${b} Z`, fill: c2, ...sw }, k));
    el("path", { d: "M-30 -215 L0 -300", stroke: c1, "stroke-width": 10, "stroke-linecap": "round", fill: "none" }, k);
  } else if (t === 4) { // ポプラ
    trunk(12, 110); el("ellipse", { cx: 0, cy: -190, rx: 62, ry: 140, fill: c2, ...sw }, k); el("ellipse", { cx: -18, cy: -230, rx: 18, ry: 60, fill: c1, opacity: .8 }, k);
  } else { // まるい 木（2＝りんご、3＝さくら）
    trunk(15, 130); const fill = t === 3 ? pink : c0;
    [[-62, -150, 66], [62, -150, 66], [0, -205, 96]].forEach(([x, y, r]) => el("circle", { cx: x, cy: y, r, fill, ...sw }, k));
    el("circle", { cx: -28, cy: -232, r: 32, fill: t === 3 ? "#FFE1EA" : c1, opacity: .85 }, k);
    if (t === 2) [[-55, -150], [40, -175], [0, -230], [70, -130], [-20, -175]].forEach(([x, y]) => extra.fruit.push(el("circle", { cx: x, cy: y, r: 13, fill: "#FF5D6C", stroke: INK, "stroke-width": 4 }, k)));
    if (t === 3) [[-50, -165], [30, -230], [55, -150], [-10, -180]].forEach(([x, y]) => extra.bloom.push(el("circle", { cx: x, cy: y, r: 9, fill: "#FFFFFF", stroke: "#F28AA8", "stroke-width": 3 }, k)));
    if (t === 0) [[-40, -180], [45, -200]].forEach(([x, y]) => extra.fruit.push(el("circle", { cx: x, cy: y, r: 11, fill: "#FFD25E", stroke: INK, "stroke-width": 4 }, k)));
  }
  return { k, ...extra };
}
function fFlower(g, x, y, s, col) { const f = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, g);
  el("path", { d: "M0 0 V-26", stroke: "#3F9150", "stroke-width": 5 }, f);
  for (let i = 0; i < 5; i++) el("circle", { cx: Math.cos(i * 1.257) * 9, cy: -30 + Math.sin(i * 1.257) * 9, r: 7, fill: col, stroke: INK, "stroke-width": 2.5 }, f);
  el("circle", { cx: 0, cy: -30, r: 5, fill: "#FFD25E" }, f); return f; }

async function forestScene(newSeeds, kinds) {
  const hist = FOREST.get(), old = hist.reduce((a, b) => a + b, 0), sess = hist.length;
  if (newSeeds > 0) FOREST.add(newSeeds);
  const total = old + newSeeds, nDraw = Math.min(total, F_SLOTS.length);
  // だれが いつ まいた 木か（まいた 回の ばんごう）
  const born = []; hist.concat(newSeeds > 0 ? [newSeeds] : []).forEach((n, s) => { for (let i = 0; i < n; i++) born.push(s); });
  const sessAfter = sess + (newSeeds > 0 ? 1 : 0);
  const stageOf = (i, sNow) => Math.min(5, Math.max(1, sNow - born[i]));
  // --- 画面を 作る ---
  setView("parade"); visible.slice().forEach(c => { if (!kinds.includes(c.kind) && c !== C.pony) { c.root.style.display = "none"; visible.splice(visible.indexOf(c), 1); } });
  sceneLayer.innerHTML = ""; const root = el("g", {}, sceneLayer);
  const defs = el("defs", {}, root); const grad = el("linearGradient", { id: "fsky", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  el("stop", { offset: 0, "stop-color": "#8FD3F5" }, grad); el("stop", { offset: .7, "stop-color": "#D9F1FB" }, grad); el("stop", { offset: 1, "stop-color": "#F4FBE8" }, grad);
  const hz = el("linearGradient", { id: "fhaze", x1: 0, y1: 300, x2: 0, y2: 600, gradientUnits: "userSpaceOnUse" }, defs); el("stop", { offset: 0, "stop-color": "#E6F5FB", "stop-opacity": 0 }, hz); el("stop", { offset: 1, "stop-color": "#E6F5FB", "stop-opacity": .26 }, hz);
  const sky = el("g", {}, root); el("rect", { x: -100, y: -100, width: 1800, height: 1200, fill: "url(#fsky)" }, sky);
  const sun = el("g", { transform: "translate(1440 140)" }, sky); const sunR = el("g", {}, sun);
  for (let i = 0; i < 12; i++) el("path", { d: "M0 -92 L12 -70 L-12 -70 Z", fill: "#FFD25E", ...S6(4), transform: `rotate(${i * 30})` }, sunR);
  el("circle", { r: 58, fill: "#FFE27A", ...S6(6) }, sun); el("circle", { cx: -18, cy: -6, r: 5, fill: INK }, sun); el("circle", { cx: 18, cy: -6, r: 5, fill: INK }, sun); el("path", { d: "M-16 14 Q0 28 16 14", fill: "none", ...S6(5) }, sun);
  if (total >= 30) { const rb = el("g", { opacity: 0 }, sky); ["#FF8FA3", "#FFC36E", "#FFE27A", "#9BD68A", "#8FC7F2", "#B9A8D9"].forEach((c, i) => el("path", { d: `M180 620 A${560 - i * 22} ${430 - i * 22} 0 0 1 ${1300 - i * 44 + 44 * 0} 620`, fill: "none", stroke: c, "stroke-width": 22, opacity: .75 }, rb)); later(2500, () => tween(1500, k => rb.setAttribute("opacity", k.toFixed(2)))); }
  const clouds = [[200, 140, 1], [760, 90, .8], [1150, 230, .7]].map(([x, y, s]) => { const c = el("g", {}, sky); [[0, 0, 46], [44, -16, 52], [92, 0, 42]].forEach(([cx, cy, r]) => el("circle", { cx, cy, r, fill: "#FFFFFF", stroke: "#C9D9E6", "stroke-width": 4 }, c)); return { c, x, y, s }; });
  el("path", { d: "M-100 600 L120 430 L300 560 L520 400 L760 570 L980 440 L1200 560 L1420 420 L1700 600 Z", fill: "#B8D8E8", stroke: "#97BBD0", "stroke-width": 6, "stroke-linejoin": "round" }, sky);
  const layers = F_LAY.map((D, L) => {
    const g = el("g", {}, root);
    if (L > 0) el("rect", { x: -300, y: 300, width: 2200, height: 900, fill: "url(#fhaze)" }, g); // かすみ（おくの 層を うすく 見せる）
    let d = `M-200 1100 L-200 ${D.hill}`; for (let x = -200; x <= 1800; x += 200) d += ` Q${x + 100} ${D.hill - 34 + ((x / 200 + L) % 2) * 22} ${x + 200} ${D.hill + (L % 2 ? 10 : -6)}`; d += " L1800 1100 Z";
    el("path", { d, fill: D.ground, ...S6(L === 3 ? 7 : 5) }, g);
    return { D, g, trees: el("g", {}, g), dx: 0, z: 1 + D.zoom };
  });
  // にぎやか：花・ちょうちょ・とり・大きな 木
  const front = layers[3].g, nFl = Math.min(40, total * 2), fr = rng32(11);
  for (let i = 0; i < nFl; i++) fFlower(front, 30 + fr() * 1540, 900 + fr() * 90, .7 + fr() * .5, ["#FF8FA3", "#FFD25E", "#B9A8D9", "#FFFFFF", "#8FC7F2"][i % 5]);
  if (total >= 100) { const big = fTree(layers[0].trees, 0, { ...F_LAY[1], col: ["#4E9A5C", "#72B86E", "#3F8A50", "#FFC2D1"] }); big.k.setAttribute("transform", "translate(800 600) scale(.85)"); big.fruit.forEach(f => f.setAttribute("fill", "#FF5D6C")); }
  const flies = []; const nBf = total >= 5 ? Math.min(5, 1 + Math.floor(total / 12)) : 0;
  for (let i = 0; i < nBf; i++) { const b = el("g", {}, root); const w1 = el("ellipse", { cx: -10, cy: 0, rx: 12, ry: 16, fill: ["#FFD25E", "#FF8FA3", "#8FC7F2", "#B9A8D9", "#FFFFFF"][i], stroke: INK, "stroke-width": 3 }, b), w2 = el("ellipse", { cx: 10, cy: 0, rx: 12, ry: 16, fill: ["#FFD25E", "#FF8FA3", "#8FC7F2", "#B9A8D9", "#FFFFFF"][i], stroke: INK, "stroke-width": 3 }, b); el("ellipse", { cx: 0, cy: 0, rx: 3, ry: 12, fill: INK }, b); flies.push({ b, w1, w2, x: 500 + i * 220, y: 760 + (i % 2) * 70, ph: i * 1.7 }); }
  const birds = total >= 12 ? el("g", {}, root) : null; if (birds) [[0, 0], [50, 22], [-46, 26]].forEach(([x, y]) => el("path", { d: `M${x - 18} ${y} Q${x - 8} ${y - 12} ${x} ${y} Q${x + 8} ${y - 12} ${x + 18} ${y}`, fill: "none", ...S6(5) }, birds));
  // 木を ならべる（まえからの 木）
  const T = []; const putTree = i => { const sl = F_SLOTS[i], D = F_LAY[sl.L], tr = fTree(layers[sl.L].trees, sl.t, D); T[i] = { ...tr, sl, D, z: 0 }; tr.fruit.concat(tr.bloom).forEach(e => e.style.display = "none"); return T[i]; };
  for (let i = 0; i < Math.min(old, nDraw); i++) { const t = putTree(i); t.z = F_STAGE[stageOf(i, sess)]; if (stageOf(i, sess) >= 5) t.fruit.concat(t.bloom).forEach(e => e.style.display = ""); }
  // 数の 札
  const tag = el("g", { transform: "translate(40 30)" }, root); el("rect", { width: 300, height: 92, rx: 46, fill: "#FFFFFF", ...S6(6) }, tag);
  const ti = fTree(tag, 0, F_LAY[3]); ti.k.setAttribute("transform", "translate(62 84) scale(.24)"); const tagT = txt(tag, 190, 64, `× ${old}`, 44, { "text-anchor": "middle" });
  // 動き（層ごとに ちがう 速さで ゆれる。はじめは ちかくから ひいていく）
  const people = kinds.map((k, i) => { const c = C[k]; place(c, 250 + i * 150, 985, (KID_S[k] || .8) * .62); c.dx.v = 0; c.dx.t = 0; return c; }); place(C.pony, 95, 985, .4);
  let tm = 0, drift = 1; const intro = 2600;
  addTick(dt => {
    if (!root.isConnected) return false; tm += dt; const m = Math.max(.2, motion), zk = Math.min(1, tm * 1000 / intro), ez = 1 - Math.pow(1 - zk, 3);
    layers.forEach(l => { const z = l.z + (1 - l.z) * ez; l.dx = Math.sin(tm * .33) * l.D.amp * m * drift; l.g.setAttribute("transform", `translate(${(l.dx + 800 * (1 - z)).toFixed(1)} ${(1000 * (1 - z)).toFixed(1)}) scale(${z.toFixed(4)})`); });
    sunR.setAttribute("transform", `rotate(${(tm * 12).toFixed(1)})`);
    clouds.forEach((c, i) => { const x = ((c.x + tm * (14 + i * 6)) % 1900) - 150; c.c.setAttribute("transform", `translate(${x.toFixed(1)} ${c.y}) scale(${c.s})`); });
    T.forEach(t => { if (!t) return; const a = Math.sin(tm * 1.4 + t.sl.ph) * 1.8 * m * (t.D.s + .4); t.k.setAttribute("transform", `translate(${t.sl.x.toFixed(1)} ${t.sl.y.toFixed(1)}) scale(${(t.D.s * t.z).toFixed(4)}) rotate(${a.toFixed(2)})`); });
    flies.forEach(f => { f.x += Math.cos(tm * .7 + f.ph) * 60 * dt; const y = f.y + Math.sin(tm * 1.9 + f.ph) * 40; const w = .3 + .7 * Math.abs(Math.sin(tm * 14 + f.ph)); f.w1.setAttribute("rx", (12 * w).toFixed(1)); f.w2.setAttribute("rx", (12 * w).toFixed(1)); f.b.setAttribute("transform", `translate(${f.x.toFixed(1)} ${y.toFixed(1)})`); });
    if (birds) { const x = ((tm * 170) % 2600) - 300; birds.setAttribute("transform", `translate(${x.toFixed(1)} ${(250 + Math.sin(tm * 2) * 20).toFixed(1)})`); }
  });
  await sleep(intro + 200);
  // --- まく ---
  if (newSeeds > 0) {
    await speak(C.pony, "p_maku", "もらった たねを まこう！");
    drift = 0; const iv = Math.max(170, 520 - newSeeds * 16), PENTA = [N.C5, N.D5, N.E5, N.G5, N.A5, N.C6];
    const plants = [];
    for (let j = 0; j < newSeeds; j++) {
      const i = old + j, who = people[j % people.length]; if (j % 3 === 0) playMove(who, "pump");
      if (i >= nDraw) { blip(800, 1200, .08, "square"); await sleep(iv * .5); continue; }
      const sl = F_SLOTS[i], l = layers[sl.L], p = headTop(who), x1 = sl.x + l.dx, y1 = sl.y - 10;
      const sd = el("g", {}, root); seedIcon(sd, 0, 0, .55); blip(500, 900, .1, "triangle");
      plants.push(tween(620, k => { const x = p.x + (x1 - p.x) * k, y = p.y + (y1 - p.y) * k - Math.sin(k * Math.PI) * 260; sd.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(k * 540).toFixed(0)}) scale(${(.55 * (1 - .4 * k * (3 - sl.L) / 3)).toFixed(3)})`); }).then(() => {
        sd.remove(); for (let q = 0; q < 5; q++) mark("sparkle", x1, y1, { vx: (q - 2) * 120, vy: -160 - q * 20, life: .5, s: .35 + sl.L * .08 });
        const f = PENTA[j % 6] * (j >= 6 ? 2 : 1); blip(f, f * 1.01, .14, "triangle"); later(60, () => blip(f * 1.5, f * 1.5, .08, "sine"));
        const t = putTree(i); return tween(520, k => { t.z = F_STAGE[1] * easeBack(k); }); }));
      await sleep(iv);
    }
    await Promise.all(plants); drift = 1;
  }
  // --- 前の 木が そだつ ---
  const grow = []; for (let i = 0; i < Math.min(old, nDraw); i++) { const s0 = stageOf(i, sess), s1 = stageOf(i, sessAfter); if (s1 > s0) grow.push([i, s0, s1]); }
  if (grow.length) {
    tune([[N.C5, .25], [N.E5, .25], [N.G5, .25], [N.C6, .25], [N.E5 * 2, 1]], 200, "triangle", .1);
    grow.forEach(([i, s0, s1], q) => later(Math.min(1400, q * 18), () => { const t = T[i]; tween(700, k => { t.z = F_STAGE[s0] + (F_STAGE[s1] - F_STAGE[s0]) * easeBack(k); }).then(() => { if (s1 >= 5) t.fruit.concat(t.bloom).forEach(e => { e.style.display = ""; }); }); }));
    await sleep(Math.min(1400, grow.length * 18) + 800);
  }
  // --- かぞえる ---
  for (let v = old + 1; v <= total; v++) { tagT.textContent = `× ${v}`; if (total - old < 30 || v === total || v % 3 === 0) blip(700 + (v - old) * 18, 900 + (v - old) * 18, .06, "square"); await sleep(Math.max(40, 160 - (total - old) * 6)); }
  chime(); people.forEach((c, i) => later(i * 120, () => joy(c))); confetti(40);
  if (newSeeds > 0) await speak(C.pony, "p_mori", "もりが おおきく なったね！"); else await speak(C.pony, "p_mori0", "つぎは たねを もらって、もりを そだてようね");
  later(300, () => people.forEach((c, i) => later(i * 100, () => playMove(c, "dance"))));
  playLog({ type: "mori", seeds: newSeeds, total });
}
