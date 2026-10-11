/* ---------- 小さな道具 ---------- */
class Spring {
  constructor(v = 0, k = 170, d = 13) { this.v = v; this.t = v; this.vel = 0; this.k = k; this.d = d; }
  step(dt) { const f = -this.k * (this.v - this.t) - this.d * this.vel; this.vel += f * dt; this.v += this.vel * dt; return this.v; }
}
const el = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
const lerp = (a, b, t) => a + (b - a) * t;
const mixHex = (a, b, t) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return "#" + A.map((v, i) => Math.round(lerp(v, B[i], t)).toString(16).padStart(2, "0")).join(""); };
const rot = (deg, x, y) => `rotate(${deg.toFixed(2)} ${x} ${y})`;

/* ---------- 背景（3層＋前景） ---------- */
const defs = el("defs", {}, svg);
const sky = el("linearGradient", { id: "sky", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
const sky0 = el("stop", { offset: "0" }, sky), sky1 = el("stop", { offset: "1" }, sky);
el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "url(#sky)" }, svg);
const sun = el("circle", { r: 70, fill: "#FFE27A", stroke: INK, "stroke-width": 6 }, svg);
const clouds = el("g", {}, svg);
const cloudList = [[200, 140, 1], [700, 90, .8], [1150, 170, 1.1], [1500, 110, .7]].map(([x, y, s]) => {
  const g = el("g", {}, clouds);
  el("path", { d: "M0 40 Q0 0 40 4 Q60 -24 100 0 Q140 -8 150 30 Q190 34 180 60 L10 60 Q-20 58 0 40 Z", fill: "#FFFFFF", stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }, g);
  return { g, x, y, s };
});

function tileLayer(width, draw) {
  const g = el("g", {}, svg);
  for (let i = 0; i < 2; i++) { const t = el("g", { transform: `translate(${i * width} 0)` }, g); draw(t); }
  return { g, width, off: 0 };
}
const far = tileLayer(1600, t => {
  el("path", { d: "M0 640 Q160 520 340 600 Q520 470 760 590 Q960 500 1160 580 Q1380 480 1600 640 L1600 760 L0 760 Z", fill: "#A9D58E", stroke: INK, "stroke-width": 6, "stroke-linejoin": "round" }, t);
});
function tree(g, x, y, s = 1) {
  el("rect", { x: x - 14 * s, y: y - 70 * s, width: 28 * s, height: 80 * s, rx: 8, fill: "#9A6B43", stroke: INK, "stroke-width": 5 }, g);
  [[0, -150, 70], [-55, -110, 52], [55, -110, 52]].forEach(([dx, dy, r]) => el("circle", { cx: x + dx * s, cy: y + dy * s, r: r * s, fill: "#6DBB5E", stroke: INK, "stroke-width": 5 }, g));
}
const mid = tileLayer(2000, t => {
  const s = { stroke: INK, "stroke-width": 6, "stroke-linejoin": "round" };
  el("rect", { x: 520, y: 350, width: 960, height: 390, rx: 10, fill: "#FFF1D6", ...s }, t);
  el("rect", { x: 500, y: 326, width: 1000, height: 36, rx: 8, fill: "#E8735A", ...s }, t);
  el("rect", { x: 920, y: 210, width: 160, height: 150, fill: "#FFF1D6", ...s }, t);
  el("path", { d: "M896 220 L1000 140 L1104 220 Z", fill: "#E8735A", ...s }, t);
  el("circle", { cx: 1000, cy: 284, r: 46, fill: "#FFFFFF", ...s }, t);
  el("path", { d: "M1000 284 L1000 254 M1000 284 L1022 296", stroke: INK, "stroke-width": 6, "stroke-linecap": "round", fill: "none" }, t);
  for (const y of [400, 560]) for (let x = 560; x < 1460; x += 100) {
    if (x > 900 && x < 1060) continue;
    el("rect", { x, y, width: 70, height: 84, rx: 8, fill: "#BDE3F2", ...s, "stroke-width": 5 }, t);
    el("path", { d: `M${x + 35} ${y} V${y + 84} M${x} ${y + 42} H${x + 70}`, stroke: INK, "stroke-width": 4 }, t);
  }
  el("rect", { x: 940, y: 600, width: 120, height: 140, rx: 6, fill: "#B9824A", ...s }, t);
  el("path", { d: "M1000 600 V740", stroke: INK, "stroke-width": 5 }, t);
  el("rect", { x: 910, y: 736, width: 180, height: 18, rx: 4, fill: "#E6D3B0", ...s, "stroke-width": 5 }, t);
  tree(t, 230, 740, 1.1); tree(t, 1780, 740, 1.2);
  el("path", { d: "M1600 740 V420", stroke: INK, "stroke-width": 8 }, t);
  el("path", { d: "M1604 424 L1700 450 L1604 478 Z", fill: "#FF6F91", ...s, "stroke-width": 5 }, t);
});
el("rect", { x: 0, y: 740, width: 1600, height: 260, fill: "#F3D9A4" }, svg);
el("path", { d: "M0 740 H1600", stroke: INK, "stroke-width": 6 }, svg);
const near = tileLayer(800, t => {
  for (let x = 40; x < 800; x += 190) {
    el("path", { d: `M${x} 830 Q${x - 6} 780 ${x + 40} 784 Q${x + 60} 750 ${x + 100} 780 Q${x + 150} 776 ${x + 140} 830 Z`, fill: "#7CC36A", stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }, t);
  }
  el("path", { d: "M0 806 H800", stroke: "#B9824A", "stroke-width": 8 }, t);
});
const charLayer = el("g", {}, svg);
const fxLayer = el("g", {}, svg);
const front = tileLayer(900, t => {
  for (let x = 60; x < 900; x += 230) el("path", { d: `M${x} 1000 L${x + 8} 956 L${x + 18} 1000 L${x + 30} 948 L${x + 40} 1000 Z`, fill: "#6DBB5E", stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }, t);
});
const tint = el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FF8A3D", opacity: 0, "pointer-events": "none" }, svg);

function setTimeOfDay(p) {
  const keys = [["#BDE3F2", "#FFF3D6"], ["#7FCBF0", "#E4F6FF"], ["#F49A7A", "#FFD9A0"]];
  const a = p < .5 ? keys[0] : keys[1], b = p < .5 ? keys[1] : keys[2], t = p < .5 ? p * 2 : (p - .5) * 2;
  sky0.setAttribute("stop-color", mixHex(a[0], b[0], t)); sky1.setAttribute("stop-color", mixHex(a[1], b[1], t));
  const ang = Math.PI * (1 - p);
  sun.setAttribute("cx", 800 + Math.cos(ang) * 620); sun.setAttribute("cy", 560 - Math.sin(ang) * 420);
  sun.setAttribute("fill", mixHex("#FFE27A", "#FF9E5E", Math.max(0, p - .5) * 2));
  tint.setAttribute("opacity", (Math.max(0, p - .55) * 0.35).toFixed(3));
}

