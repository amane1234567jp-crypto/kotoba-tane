/* ================= 盤の 形に あわせて 背景を かきなおす（2026-10-25） =================
   盤の 形を かえたので、池・こくばん・すなば・へやの 色など 背景の 絵が みちと かさなって いた。
   → みちの ない 「あいて いる ばしょ」を さがして、そこに 絵を おく。 */
function bgFree(B, n = 3, o = {}) {
  const N = B.nodes, E = [], minR = o.minR || 60, maxR = o.maxR || 260, out = [];
  for (const a in B.next) for (const b of B.next[a] || []) if (N[a] && N[b]) E.push([N[a], N[b]]);
  const segd = (x, y, p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], L = dx * dx + dy * dy, t = L ? Math.max(0, Math.min(1, ((x - p[0]) * dx + (y - p[1]) * dy) / L)) : 0; return Math.hypot(x - p[0] - dx * t, y - p[1] - dy * t); };
  const X0 = o.x0 || 70, X1 = o.x1 || 1530, Y0 = o.y0 || 190, Y1 = o.y1 || 970, av = [...(o.avoid || []), [170, 300, 200], [1460, 120, 130]];
  if (N["0"]) av.push([N["0"][0], N["0"][1] - 40, 130]); if (B.away) av.push([B.away[0], B.away[1] - 60, 120]);
  const pts = []; for (let x = X0; x <= X1; x += 20) for (let y = Y0; y <= Y1; y += 20) {
    let d = Math.min(x - X0 + 30, X1 - x + 30, y - Y0 + 30, Y1 - y + 30);
    for (const k in N) d = Math.min(d, Math.hypot(N[k][0] - x, N[k][1] - y) - (N[k].includes("goal") ? 115 : 52));
    for (const [p, q] of E) d = Math.min(d, segd(x, y, p, q) - 38);
    for (const [ax, ay, ar] of av) d = Math.min(d, Math.hypot(ax - x, ay - y) - ar);
    pts.push([x, y, d]); }
  for (let i = 0; i < n; i++) { let best = null;
    for (const [x, y, d0] of pts) { let d = d0; for (const [cx, cy, r] of out) d = Math.min(d, Math.hypot(cx - x, cy - y) - r - 16); if (!best || d > best[2]) best = [x, y, d]; }
    if (!best || best[2] < minR) break; best[2] = Math.min(best[2], maxR); out.push(best); }
  return out; }
function bgBox(B, pad = 70) { const v = Object.values(B.nodes); const xs = v.map(p => p[0]), ys = v.map(p => p[1]);
  return [Math.max(20, Math.min(...xs) - pad), Math.max(150, Math.min(...ys) - pad), Math.min(1580, Math.max(...xs) + pad), Math.min(985, Math.max(...ys) + pad)]; }
const bgRoom = (L, B, fill) => { const [x0, y0, x1, y1] = bgBox(B); el("rect", { x: x0, y: y0, width: x1 - x0, height: y1 - y0, rx: 60, fill, ...S6(6) }, L); };
function bgBoard(L, x, y, r, label) { const w = Math.min(360, r * 1.9), h = w / 2; el("rect", { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 10, fill: "#2F6B4F", ...S6(6) }, L);
  txt(L, x, y + w * .045, label, Math.min(52, w / Math.max(4, label.length) * .95), { "text-anchor": "middle", fill: "#FFFFFF" }); }
function bgPond(L, x, y, r) { const rx = r * 1.15, ry = r * .62; el("ellipse", { cx: x, cy: y, rx, ry, fill: "#8FD3F0", ...S6(6) }, L);
  [[-.4, .1], [.35, -.15]].forEach(([dx, dy]) => el("ellipse", { cx: x + dx * rx, cy: y + dy * ry, rx: 40, ry: 12, fill: "#7CC36A", ...S6(3) }, L)); }
function bgSand(L, x, y, r) { el("ellipse", { cx: x, cy: y, rx: r * 1.1, ry: r * .62, fill: "#F6E2A8", ...S6(5) }, L);
  el("path", { d: `M${x - 30} ${y + 10} q15 -40 30 0 z`, fill: "#E8C77A", ...S6(3) }, L); el("rect", { x: x + 20, y: y - 6, width: 16, height: 26, rx: 4, fill: "#FF6F91", ...S6(3) }, L); }
function bgClock(L, x, y, r) { r = Math.min(r, 150); el("circle", { cx: x, cy: y, r, fill: "#FFFFFF", ...S6(6) }, L);
  for (let i = 0; i < 12; i++) { const an = i / 12 * Math.PI * 2; el("path", { d: `M${x + Math.cos(an) * r * .86} ${y + Math.sin(an) * r * .86} L${x + Math.cos(an) * r * .96} ${y + Math.sin(an) * r * .96}`, ...S6(5) }, L); }
  el("path", { d: `M${x} ${y} L${x} ${y - r * .6} M${x} ${y} L${x + r * .4} ${y}`, ...S6(8) }, L); }
function bgPool(L, x, y, r) { const rx = r * 1.1, ry = r * .55; el("ellipse", { cx: x, cy: y, rx, ry, fill: "#7FCBF0", ...S6(5) }, L);
  for (let i = 0; i < 12; i++) el("circle", { cx: x - rx * .6 + (i * 61) % (rx * 1.2), cy: y - ry * .3 + (i * 37) % (ry * .6), r: 14, fill: ["#FF6F91", "#FFD25E", "#7BD389", "#B9A8D9"][i % 4], ...S6(3) }, L); }
function bgSlide(L, x, y, r) { const s = Math.min(1, r / 120); el("path", { d: `M${x - 60 * s} ${y - 80 * s} Q${x + 80 * s} ${y - 40 * s} ${x + 60 * s} ${y + 90 * s}`, fill: "none", stroke: "#E8473C", "stroke-width": 34 * s, "stroke-linecap": "round" }, L);
  el("path", { d: `M${x - 70 * s} ${y - 80 * s} V${y + 90 * s} M${x - 100 * s} ${y - 80 * s} V${y + 90 * s}`, ...S6(6) }, L); }
const bgTrees = (L, spots) => spots.forEach(([x, y, r]) => tree2(L, x, y + Math.min(40, r * .3), Math.min(46, r * .5)));
const bgFlowers = (L, spots) => spots.forEach(([x, y, r], j) => { for (let i = 0; i < 4; i++) flower(L, x - r * .4 + (i * 53) % (r * .8 + 1), y - 20 + (i * 31) % 40, ["#FF8FA3", "#FFFFFF", "#B9A8D9"][(i + j) % 3]); });

/* bg7（へやの 色わけ）：3つの へやを あいて いる ばしょに */
bg7 = function (L, base, deco, title, col) { const B = BOARD[curStage];
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: base }, L); for (let x = 0; x < 1600; x += 100) el("path", { d: `M${x} 0 V1000`, stroke: "#00000010", "stroke-width": 4 }, L);
  const sp = B ? bgFree(B, 3, { minR: 70, maxR: 220, avoid: [[290, 95, 260]] }) : [];
  sp.forEach(([x, y, r], i) => { const w = r * 2.1, h = r * 1.5; el("rect", { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 30, fill: deco[i % deco.length], ...S6(5) }, L); });
  el("rect", { x: 60, y: 40, width: 460, height: 110, rx: 10, fill: col, ...S6(6) }, L); txt(L, 290, 115, title, 42, { "text-anchor": "middle", fill: "#FFFFFF" }); };

Object.assign(BOARD_BG, {
  sansu(L, B) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFFFFF" }, L);
    for (let x = 0; x < 1600; x += 50) el("path", { d: `M${x} 0 V1000`, stroke: "#BDE3F2", "stroke-width": 2 }, L); for (let y = 0; y < 1000; y += 50) el("path", { d: `M0 ${y} H1600`, stroke: "#BDE3F2", "stroke-width": 2 }, L);
    const sp = bgFree(B, 6, { minR: 50 }); if (sp[0]) bgBoard(L, sp[0][0], sp[0][1], sp[0][2], "さんすう");
    ["1+1", "3−2", "5+4", "2+8", "9−3"].forEach((t, i) => sp[i + 1] && txt(L, sp[i + 1][0], sp[i + 1][1] + 18, t, 54, { "text-anchor": "middle", fill: "#B9A8D9", opacity: .55 })); },
  sensei1(L, B) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFF6E0" }, L); bgRoom(L, B, "#F6E7C8");
    const sp = bgFree(B, 1, { minR: 50 }); if (sp[0]) bgBoard(L, sp[0][0], sp[0][1], sp[0][2], "せんせい1"); },
  seki1(L, B) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFF6E0" }, L); bgRoom(L, B, "#F6E7C8");
    const sp = bgFree(B, 1, { minR: 50 }); if (sp[0]) bgBoard(L, sp[0][0], sp[0][1], sp[0][2], "となりの せき"); },
  gakkou3(L, B) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFF6E0" }, L); bgRoom(L, B, "#F6E7C8");
    const sp = bgFree(B, 1, { minR: 50, avoid: [[240, 105, 220]] }); if (sp[0]) bgClock(L, sp[0][0], sp[0][1], sp[0][2]);
    el("rect", { x: 60, y: 40, width: 360, height: 130, rx: 10, fill: "#2F6B4F", ...S6(6) }, L); txt(L, 240, 120, "がっこう3", 44, { "text-anchor": "middle", fill: "#FFFFFF" }); },
  tomodachi1(L, B) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#BFE3A6" }, L); el("rect", { x: 0, y: 0, width: 1600, height: 130, fill: "#CFEAFB" }, L); cloud(L, 300, 70); cloud(L, 1200, 60, .8);
    const sp = bgFree(B, 4, { minR: 45 }); if (sp[0]) bgSand(L, sp[0][0], sp[0][1], Math.min(sp[0][2], 200)); bgTrees(L, sp.slice(1));
    el("rect", { x: 60, y: 760, width: 180, height: 120, fill: "#FFE0E6", ...S6(5) }, L); el("path", { d: "M44 760 L150 690 L256 760 Z", fill: "#7FA7D9", ...S6(5) }, L); txt(L, 800, 100, "おともだち1", 48, { "text-anchor": "middle" }); },
  kouen2(L, B) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#BFE3A6" }, L); el("rect", { x: 0, y: 0, width: 1600, height: 130, fill: "#CFEAFB" }, L); cloud(L, 300, 70); cloud(L, 1200, 60, .8);
    const sp = bgFree(B, 5, { minR: 45 }); if (sp[0]) bgSand(L, sp[0][0], sp[0][1], Math.min(sp[0][2], 200)); bgTrees(L, sp.slice(1, 4)); bgFlowers(L, sp.slice(4));
    txt(L, 800, 100, "こうえん2", 48, { "text-anchor": "middle" }); },
  kouen(L, B) { for (let i = 0; i < 60; i++) { const x = (i * 397) % 1600, y = 120 + (i * 233) % 860; el("path", { d: `M${x} ${y} l8 -16 l8 16`, fill: "none", stroke: "#6DBB5E", "stroke-width": 4 }, L); }
    const sp = bgFree(B, 7, { minR: 40 }); if (sp[0]) bgPond(L, sp[0][0], sp[0][1], Math.min(sp[0][2], 230)); bgTrees(L, sp.slice(1, 5)); bgFlowers(L, sp.slice(5)); },
  asobiba(L, B) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFF3D6" }, L); el("rect", { x: 40, y: 40, width: 1520, height: 920, rx: 40, fill: "#BDE3F2", opacity: .5, ...S6(5) }, L);
    const sp = bgFree(B, 2, { minR: 50, avoid: [[320, 95, 300]] }); if (sp[0]) bgPool(L, sp[0][0], sp[0][1], Math.min(sp[0][2], 230)); if (sp[1]) bgSlide(L, sp[1][0], sp[1][1], sp[1][2]);
    el("rect", { x: 60, y: 40, width: 520, height: 110, rx: 10, fill: "#FFFFFF", ...S6(6) }, L); txt(L, 320, 115, "🍔 あそびば", 48, { "text-anchor": "middle" }); },
});
