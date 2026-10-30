/* ================= 2026-10-31：じてんしゃに ちゃんと のって いる ように 見せる =================
   まえは、たって いる キャラの まえに じてんしゃの 絵を かさねた だけで、「じてんしゃを もって いる」ように 見えた。
   → キャラを サドルの 高さまで もちあげ、あしは ペダルへ（こぐ うごき）、うでは ハンドルへ。じてんしゃは キャラの うしろに かき、
     ハンドルの にぎりだけ キャラの まえに かさねる。目は すすむ ほう（みぎ）を みる。 */
const RIDE = { k: .76, lift: 92, dx: 34 }; // じてんしゃの 大きさ（キャラの 何倍）・もちあげる 高さ・じてんしゃの 中心の ずれ（キャラ単位）
function bikeBack(par) { const g = el("g", {}, par);
  [-120, 120].forEach(x => { el("circle", { cx: x, cy: 0, r: 62, fill: "#FFFFFF66", stroke: INK, "stroke-width": 14 }, g); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; el("path", { d: `M${x} 0 L${x + Math.cos(a) * 54} ${Math.sin(a) * 54}`, stroke: "#9AA3AD", "stroke-width": 4 }, g); } el("circle", { cx: x, cy: 0, r: 10, fill: INK }, g); });
  el("path", { d: "M-120 0 L-40 -80 L80 -80 L120 0 M-40 -80 L0 0 L80 -80 M80 -80 L100 -150 M-40 -80 L-50 -100", fill: "none", stroke: "#E8473C", "stroke-width": 14, "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
  el("rect", { x: -82, y: -112, width: 64, height: 18, rx: 8, fill: INK }, g); // サドル
  el("circle", { cx: 0, cy: 0, r: 20, fill: "#D7DDE3", stroke: INK, "stroke-width": 6 }, g); // ギア
  el("path", { d: "M-150 -40 Q-120 -60 -90 -40", fill: "none", stroke: INK, "stroke-width": 8 }, g); // うしろの どろよけ
  return g; }
function bikeFrontBar(par) { const g = el("g", {}, par);
  el("path", { d: "M100 -150 L78 -158 M100 -150 L128 -150", fill: "none", stroke: INK, "stroke-width": 12, "stroke-linecap": "round" }, g);
  el("rect", { x: 118, y: -160, width: 30, height: 20, rx: 9, fill: "#5A5F6E", stroke: INK, "stroke-width": 5 }, g); return g; }
function rideOn(c, layerBack, layerFront, k = RIDE.k) {
  const back = el("g", {}, layerBack || propG || front()), fr = el("g", {}, layerFront || front());
  bikeBack(back); bikeFrontBar(fr);
  const pos = () => { const q = world(c, 200 + RIDE.dx, c.base - 62 * k); return [q.x, q.y, 0, c.s * k]; };
  follow(back, pos); follow(fr, pos);
  c.ride = { k, t0: c.t }; c.eyeX.t = 7;
  const done = () => { if (!c.ride) return; c.ride = null; c.eyeX.t = 0; Element.prototype.remove.call(back); Element.prototype.remove.call(fr); };
  fr.remove = done; fr.ride = true; c.__rideDone = done; return fr; }
// 場面が かわったら おろす（のせた まま つぎの 場面に いかない）
{ const rc = resetChar; resetChar = function (c) { if (c && c.ride && c.__rideDone) c.__rideDone(); return rc(c); }; }
{ const sv = setView; setView = function (v, ...a) { if (v === "board" && typeof C !== "undefined") Object.values(C).forEach(c => { if (c && c.ride && c.__rideDone) c.__rideDone(); }); return sv(v, ...a); }; }
// キャラの 絵：のって いる あいだは もちあげて、あし・うでを のる かたちに
{ const dc = drawChar; drawChar = function (c, dt, walking) {
    if (!c.ride) return dc(c, dt, walking);
    const y0 = c.y; c.y = y0 - RIDE.lift * c.s; let r; try { r = dc(c, dt, false); } finally { c.y = y0; }
    const moving = !!c.tm.run || Math.abs(c.dx.t - c.dx.v) > 2, ph = c.t * (moving ? 9 : 2.2);
    c.legs.forEach((l, i) => { const a = -18 + Math.sin(ph + i * Math.PI) * (moving ? 16 : 5); l.g.setAttribute("transform", `${rot(a, l.px, l.py)} translate(${l.px} ${l.py}) scale(1 1.55) translate(${-l.px} ${-l.py})`); });
    c.arms.forEach((a, i) => a.g.setAttribute("transform", rot(i ? -46 : -66, a.px, a.py)));
    return r; }; }
// 場面の じてんしゃ（じてんしゃ コース・おでかけ・でたらめ）を のる かたちに
rideBike = c => rideOn(c);
odRide = c => { const g = rideOn(c, propG, hudLayer, .58); c.__bike = g; return g; };
