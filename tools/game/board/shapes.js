/* ショートコースの 盤を みんな ちがう かたちに（2026-10-23）。マスの なまえ・つながりは そのまま、ばしょだけ かえる */
function shapeLabels(B) { const N = B.nodes, ks = Object.keys(N), E = [];
  for (const a of ks) for (const b of B.next[a] || []) E.push([N[a], N[b]]);
  const segd = (o, p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], L = dx * dx + dy * dy, t = L ? Math.max(0, Math.min(1, ((o[0] - p[0]) * dx + (o[1] - p[1]) * dy) / L)) : 0; return Math.hypot(o[0] - p[0] - dx * t, o[1] - p[1] - dy * t); };
  const used = [];
  return B.labels.map(([t]) => { const own = ks.filter(k => B.place[k] === t); if (!own.length) return null;
    const cx = own.reduce((s, k) => s + N[k][0], 0) / own.length, cy = own.reduce((s, k) => s + N[k][1], 0) / own.length; let best = null;
    for (let r = 70; r <= 260; r += 30) for (let a = 0; a < 16; a++) { const x = cx + r * Math.cos(a * Math.PI / 8), y = cy + r * Math.sin(a * Math.PI / 8) * .8, w = t.length * 30 + 34;
      if (x - w / 2 < 20 || x + w / 2 > 1580 || y < 200 || y > 985 || (x < 560 && y < 190)) continue;
      let m = Infinity; for (const k of ks) { const [nx, ny] = N[k]; m = Math.min(m, Math.max(Math.abs(nx - x) - w / 2, Math.abs(ny - (y - 12)) - 23) - 50); }
      for (const [p, q] of E) for (let i = -1; i <= 1; i++) m = Math.min(m, segd([x + i * w / 2.4, y - 12], p, q) - 28);
      for (const [ux, uy, uw] of used) m = Math.min(m, Math.max(Math.abs(ux - x) - (uw + w) / 2, Math.abs(uy - y) - 46));
      const sc = Math.min(m, 40) - r * .05; if (!best || sc > best[0]) best = [sc, x, y, w]; }
    used.push([best[1], best[2], best[3]]); return [t, Math.round(best[1]), Math.round(best[2])]; }).filter(Boolean); }
for (const [id, S] of Object.entries(SHAPES)) { const B = BOARD[id]; if (!B) continue;
  for (const [k, [x, y]] of Object.entries(S.n)) if (B.nodes[k]) { B.nodes[k][0] = x; B.nodes[k][1] = y; }
  B.away = S.away; B.shape = S.shape; B.labels = shapeLabels(B); }
