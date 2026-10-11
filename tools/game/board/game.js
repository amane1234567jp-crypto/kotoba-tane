/* ================= すごろく本体 ================= */
const W_KEY = "kotoba-tane-board";
const store = { get() { try { return JSON.parse(localStorage.getItem(W_KEY)) || {}; } catch (e) { return {}; } }, set(v) { try { localStorage.setItem(W_KEY, JSON.stringify(v)); } catch (e) { /* なくても動く */ } } };
const rnd = n => Math.floor(Math.random() * n);
const pad = n => String(n).padStart(2, "0");

/* ---------- キャラ ---------- */
const KINDS = ["doshin", "nobbo", "kamejii", "meebaa", "pony", "shima", "pyon", "mii", "gao", "chu"];
const C = {}; KINDS.forEach(k => C[k] = makeChar(k));
const P = { doshin: makeChar("doshin"), shima: makeChar("shima"), gao: makeChar("gao") };
Object.values(P).forEach(p => p.isPiece = true);
const chars = [...KINDS.map(k => C[k]), ...Object.values(P)];
const visible = [];

/* ---------- 吹き出しと耳の印 ---------- */
const bub = el("g", { opacity: 0 }, hudLayer);
const bubR = el("rect", { rx: 26, fill: "#FFFFFF", stroke: INK, "stroke-width": 5 }, bub);
const bubTip = el("path", { fill: "#FFFFFF", stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }, bub);
const bubT = el("text", { "font-family": "Zen Maru Gothic, sans-serif", "font-weight": 700, "font-size": 44, fill: INK, "text-anchor": "middle" }, bub);
function say(c, text) {
  if (taskText && (text === taskText || text.endsWith("…"))) { unsay(); return; } // おだいはカードに出ているので吹き出しは出さない
  bubT.textContent = text;
  const w = Math.min(1500, text.length * 44 + 70);
  const hx = c.x + 200 * c.s, cx = Math.max(w / 2 + 20, Math.min(1580 - w / 2, hx + (c.isPiece || c === C.pony && view === "board" ? w / 2 - 60 : 0)));
  const y = Math.max(110, c.y + c.top * c.s - 30), tipX = Math.max(60, Math.min(1540, hx));
  bubR.setAttribute("x", cx - w / 2); bubR.setAttribute("y", y - 78); bubR.setAttribute("width", w); bubR.setAttribute("height", 88);
  bubTip.setAttribute("d", `M${tipX - 18} ${y + 8} L${tipX} ${y + 38} L${tipX + 18} ${y + 8}`);
  bubT.setAttribute("x", cx); bubT.setAttribute("y", y - 18); bub.setAttribute("opacity", 1);
}
function unsay() { bub.setAttribute("opacity", 0); }
const ear = el("g", { opacity: 0 }, hudLayer);
const earIn = el("g", {}, ear);
el("circle", { cx: 0, cy: 0, r: 44, fill: "#FFD25E", stroke: INK, "stroke-width": 5 }, earIn);
el("path", { d: "M-10 22 Q-24 22 -22 6 Q-20 -2 -14 -8 Q-16 -30 4 -30 Q22 -30 20 -10 Q18 4 6 10", fill: "none", stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, earIn);
const earWave = [0, 1].map(i => el("path", { d: `M${30 + i * 14} -20 Q${42 + i * 14} 0 ${30 + i * 14} 20`, fill: "none", stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }, earIn));
let earOn = null;
function showEar(c, on) { earOn = on ? c : null; ear.setAttribute("opacity", on ? 1 : 0); }
function stepEar(t) {
  if (!earOn) return; const c = earOn, k = Math.max(.6, Math.min(1.1, c.s * 1.4));
  const p = headTop(c); ear.setAttribute("transform", `translate(${(p.x - 140 * c.s - 40).toFixed(1)} ${(p.y + 20).toFixed(1)}) scale(${k.toFixed(2)})`);
  earWave.forEach((w, i) => w.setAttribute("opacity", (Math.sin(t * 6 - i) > 0 ? 1 : .25)));
}

/* ---------- 盤 ---------- */
const ZONES = [
  { name: "げんかん", x: 40, y: 780, w: 330, h: 190, fill: "#FFE3B3", lx: 58, ly: 818 },
  { name: "げたばこ", x: 370, y: 780, w: 310, h: 190, fill: "#D7ECFF", lx: 388, ly: 818 },
  { name: "ろうか", x: 680, y: 780, w: 610, h: 190, fill: "#FFF1C9", lx: 698, ly: 818 },
  { name: "トイレ", x: 1290, y: 600, w: 280, h: 370, fill: "#CFEFE6", lx: 1470, ly: 640 },
  { name: "ほけんしつ", x: 820, y: 452, w: 470, h: 168, fill: "#FFE0E6", lx: 838, ly: 488 },
  { name: "かいだん", x: 370, y: 620, w: 920, h: 160, fill: "#E9E0F5", lx: 388, ly: 765 },
  { name: "としょしつ", x: 40, y: 380, w: 330, h: 400, fill: "#FFE7D6", lx: 58, ly: 418 },
  { name: "しょくいんしつ", x: 370, y: 200, w: 530, h: 250, fill: "#F1EAD8", lx: 388, ly: 238 },
  { name: "ろうか", x: 900, y: 200, w: 390, h: 250, fill: "#FFF1C9", lx: 918, ly: 238 },
  { name: "ゴール", x: 1290, y: 240, w: 280, h: 210, fill: "#FFD25E", lx: 1430, ly: 285, goal: true },
];
// 15マスでゴール（トイレで道が上下に分かれる）
const NODES = {
  "0": [170, 880, "start"], "1": [400, 880], "2": [610, 880], "3": [820, 880],
  "4": [1010, 880, "block"], "5": [1200, 880], "6": [1430, 720, "fork"],
  "7u": [1150, 540], "8u": [900, 540],
  "7d": [1150, 700], "8d": [900, 700],
  "9": [620, 650], "10": [250, 620], "11": [220, 450],
  "12": [500, 320], "13": [780, 320], "14": [1090, 320], "15": [1430, 370, "goal"],
};
const GOAL = "15", BLOCK = "4", FORK = "6", UP = "7u", DOWN = "7d", MERGE_FROM = ["8u", "8d"], MERGE_TO = "9";
const GOAL_IDX = 15;
const idx = id => parseInt(id, 10);
function NEXT(id) {
  if (id === FORK) return [UP, DOWN];
  if (MERGE_FROM.includes(id)) return [MERGE_TO];
  if (/[ud]$/.test(id)) return [(idx(id) + 1) + id.slice(-1)];
  if (id === GOAL) return [];
  return [String(idx(id) + 1)];
}
const kindOf = id => NODES[id][2] || "normal";
function zoneOf(id) { const [x, y] = NODES[id]; const z = ZONES.find(z => x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h); return z ? z.name : "ろうか"; }

const S6 = (sw = 6) => ({ stroke: INK, "stroke-width": sw, "stroke-linejoin": "round", "stroke-linecap": "round" });
const FONT = "Mochiy Pop One, Zen Maru Gothic, sans-serif";
function txt(g, x, y, s, size, attrs = {}) { const t = el("text", { x, y, "font-family": FONT, "font-size": size, fill: INK, ...attrs }, g); t.textContent = s; return t; }
function chest(g, x, y, s = 1, open = false) {
  const c = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, g);
  el("rect", { x: -34, y: -10, width: 68, height: 40, rx: 6, fill: "#C98A4B", ...S6(5) }, c);
  el("rect", { x: -6, y: -4, width: 12, height: 14, rx: 3, fill: "#FFD25E", ...S6(3) }, c);
  const lid = el("g", {}, c);
  el("path", { d: "M-36 -10 Q-36 -36 0 -36 Q36 -36 36 -10 Z", fill: "#E0A060", ...S6(5) }, lid);
  if (open) lid.setAttribute("transform", "rotate(-35 -36 -10)");
  return { g: c, lid };
}
const treasureIcons = {};
function drawBoard() {
  boardLayer.innerHTML = "";
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#BFE3A6" }, boardLayer);
  // 中庭の草と木
  [[470, 540], [620, 500], [1430, 520]].forEach(([x, y], i) => {
    el("rect", { x: x - 10, y: y - 20, width: 20, height: 46, rx: 6, fill: "#9A6B43", ...S6(4) }, boardLayer);
    el("circle", { cx: x, cy: y - 40, r: 36 - i * 4, fill: "#6DBB5E", ...S6(4) }, boardLayer);
  });
  ZONES.forEach(z => {
    el("rect", { x: z.x + 6, y: z.y + 6, width: z.w - 12, height: z.h - 12, rx: 26, fill: z.fill, ...S6(5) }, boardLayer);
  });
  // 部屋ごとの小物
  const prop = boardLayer;
  el("rect", { x: 56, y: 840, width: 54, height: 116, rx: 6, fill: "#B9824A", ...S6(4) }, prop); el("circle", { cx: 98, cy: 900, r: 5, fill: INK }, prop);
  for (let i = 0; i < 4; i++) el("rect", { x: 60 + i * 42, y: 690, width: 36, height: 74, rx: 4, fill: ["#FF8FA3", "#7FCBF0", "#FFD25E", "#7CC36A"][i], ...S6(4) }, prop);
  el("path", { d: "M54 690 H230", ...S6(5), fill: "none" }, prop);
  el("rect", { x: 1488, y: 760, width: 64, height: 40, rx: 10, fill: "#FFFFFF", ...S6(4) }, prop); el("path", { d: "M1520 760 V744 H1534", ...S6(4), fill: "none" }, prop);
  el("rect", { x: 600, y: 386, width: 190, height: 50, rx: 6, fill: "#C98A4B", ...S6(4) }, prop);
  el("path", { d: "M630 386 v-14 h22 v14", fill: "#FFFFFF", ...S6(4) }, prop);
  for (let x = 930; x < 1270; x += 90) el("rect", { x, y: 380, width: 60, height: 50, rx: 6, fill: "#BDE3F2", ...S6(4) }, prop);
  for (let x = 400; x < 1280; x += 46) el("path", { d: `M${x} 728 h30`, stroke: "#C9B9E6", "stroke-width": 8, "stroke-linecap": "round" }, prop);
  el("path", { d: "M1236 470 h28 M1250 456 v28", stroke: "#E2456F", "stroke-width": 8, "stroke-linecap": "round" }, prop);
  // 道
  const order = [["0", "1", "2", "3", "4", "5", "6", "7u", "8u", "9", "10", "11", "12", "13", "14", "15"], ["6", "7d", "8d", "9"]];
  order.forEach(o => { const d = o.map((id, i) => (i ? "L" : "M") + NODES[id][0] + " " + NODES[id][1]).join(" ");
    el("path", { d, fill: "none", stroke: INK, "stroke-width": 66, "stroke-linejoin": "round", "stroke-linecap": "round" }, boardLayer);
    el("path", { d, fill: "none", stroke: "#FFF8E8", "stroke-width": 54, "stroke-linejoin": "round", "stroke-linecap": "round" }, boardLayer);
    el("path", { d, fill: "none", stroke: "#F2D9A8", "stroke-width": 6, "stroke-dasharray": "2 22", "stroke-linecap": "round" }, boardLayer); });
  ZONES.forEach(z => txt(boardLayer, z.lx, z.ly, z.name, z.goal ? 40 : 28, z.goal ? { "text-anchor": "middle" } : (z.name === "トイレ" ? { "text-anchor": "middle" } : {})));
  // マス
  Object.entries(NODES).forEach(([id, [x, y, k]]) => {
    const g = el("g", {}, boardLayer);
    const z = ZONES.find(z => z.name === zoneOf(id));
    if (k === "goal") {
      el("circle", { cx: x, cy: y, r: 58, fill: "#FFFFFF", ...S6(6) }, g);
      el("path", { d: `M${x - 14} ${y + 34} V${y - 40}`, ...S6(6) }, g);
      el("path", { d: `M${x - 12} ${y - 40} L${x + 34} ${y - 26} L${x - 12} ${y - 10} Z`, fill: "#FF6F91", ...S6(5) }, g);
      return;
    }
    el("circle", { cx: x, cy: y, r: 44, fill: "#FFFFFF", ...S6(6) }, g);
    if (k === "treasure") treasureIcons[id] = chest(g, x, y + 4, .8);
    else if (k === "start") txt(g, x, y + 10, "スタート", 22, { "text-anchor": "middle" });
    else if (k === "fork") { el("path", { d: `M${x - 20} ${y + 18} L${x} ${y - 4} L${x + 20} ${y + 18} M${x} ${y - 4} V${y - 26} M${x - 10} ${y - 16} L${x} ${y - 26} L${x + 10} ${y - 16}`, fill: "none", ...S6(6) }, g); }
    else el("circle", { cx: x, cy: y, r: 26, fill: z ? z.fill : "#FFF1C9", ...S6(4) }, g);
  });
}

/* ---------- HUD ---------- */
const hud = el("g", {}, hudLayer);
hudLayer.insertBefore(hud, bub);
function pill(g, x, y, w, h, fill) { return el("rect", { x, y, width: w, height: h, rx: h / 2, fill, ...S6(5) }, g); }
const lvG = el("g", {}, hud); pill(lvG, 320, 34, 230, 76, "#FFFFFF"); const lvT = txt(lvG, 435, 86, "レベル 1", 36, { "text-anchor": "middle" });
const stG = el("g", { style: "display:none" }, hud); pill(stG, 570, 34, 210, 76, "#FFFFFF"); chest(stG, 630, 80, .75, true); const stT = txt(stG, 720, 86, "× 0", 34, { "text-anchor": "middle" });
const turnG = el("g", {}, hud); const turnR = pill(turnG, 600, 34, 330, 76, "#FFD25E"); const turnT = txt(turnG, 765, 86, "", 36, { "text-anchor": "middle" });
function setTurn(who) { turnT.textContent = who === "child" ? "きみの ばん" : "がおの ばん"; turnR.setAttribute("fill", who === "child" ? "#FFD25E" : "#FF9E7A"); }
const banner = el("g", { opacity: 0 }, hudLayer);
const bannerR = el("rect", { x: 420, y: 400, width: 760, height: 160, rx: 80, fill: "#FFD25E", ...S6(8) }, banner);
const bannerT = txt(banner, 800, 505, "", 68, { "text-anchor": "middle" });
async function showBanner(text, ms = 1600) {
  bannerT.textContent = text; banner.setAttribute("opacity", 1);
  const t0 = performance.now(); const anim = () => { const k = Math.min(1, (performance.now() - t0) / 260); const s = 1 + (1 - k) * .6 * Math.sin(k * 9) * (motion > .5 ? 1 : 0);
    banner.setAttribute("transform", `translate(800 480) scale(${s.toFixed(3)}) translate(-800 -480)`); if (k < 1) requestAnimationFrame(anim); }; anim();
  await sleep(ms); banner.setAttribute("opacity", 0);
}

/* ---------- おだいカード（言う言葉を大きく出しっぱなしにする） ---------- */
const task = el("g", { opacity: 0 }, hudLayer);
const taskR = el("rect", { rx: 34, fill: "#FFFFFF", stroke: INK, "stroke-width": 8 }, task);
const taskTag = el("g", {}, task);
const taskTagR = el("rect", { rx: 26, height: 52, fill: "#FFD25E", ...S6(5) }, taskTag);
const taskTagT = el("text", { "font-family": FONT, "font-size": 30, fill: INK, "text-anchor": "middle" }, taskTag);
const taskLines = el("g", {}, task);
let taskText = null;
function wrapJa(text, max) {
  const words = text.split(" "), lines = []; let cur = "";
  words.forEach(w => { if (cur && (cur + " " + w).length > max) { lines.push(cur); cur = w; } else cur = cur ? cur + " " + w : w; });
  if (cur) lines.push(cur); return lines;
}
function showTask(text, tag = "いってみよう", cy = 230) {
  taskText = text; taskLines.innerHTML = "";
  let size = 84, lines = wrapJa(text, 14);
  if (lines.length > 2 || Math.max(...lines.map(l => l.length)) > 12) { size = 64; lines = wrapJa(text, 18); }
  const w = Math.min(1500, Math.max(520, Math.max(...lines.map(l => l.length)) * size + 110)), h = lines.length * size * 1.22 + 70;
  const x = 800 - w / 2, y = cy - h / 2;
  taskR.setAttribute("x", x); taskR.setAttribute("y", y); taskR.setAttribute("width", w); taskR.setAttribute("height", h);
  lines.forEach((l, i) => { const tt = el("text", { x: 800, y: y + 35 + size * (i + .9) * 1.22 - size * .2, "text-anchor": "middle", "font-family": FONT, "font-size": size, fill: INK }, taskLines); tt.textContent = l; });
  taskTagT.textContent = tag; const tw = tag.length * 30 + 50;
  taskTagR.setAttribute("x", x + 30); taskTagR.setAttribute("y", y - 30); taskTagR.setAttribute("width", tw); taskTagT.setAttribute("x", x + 30 + tw / 2); taskTagT.setAttribute("y", y + 7);
  task.setAttribute("opacity", 1); taskListen(false);
  const t0 = performance.now(); const f = () => { const k = Math.min(1, (performance.now() - t0) / 300); const s = motion > .5 ? 1 + (1 - k) * .25 * Math.cos(k * 8) : 1;
    task.setAttribute("transform", `translate(800 ${cy}) scale(${s.toFixed(3)}) translate(-800 ${-cy})`); if (k < 1) requestAnimationFrame(f); }; f();
}
function hideTask() { taskText = null; task.setAttribute("opacity", 0); }
function taskListen(on) { taskR.setAttribute("stroke", on ? "#E8735A" : INK); taskR.setAttribute("stroke-width", on ? 12 : 8); }

/* ---------- 場面（部屋の背景） ---------- */
function drawRoom(place, noSign = false) {
  sceneLayer.innerHTML = "";
  const L = sceneLayer, wallC = { げんかん: "#FFE9C7", げたばこ: "#E3F1FF", ろうか: "#FFF4D6", かいだん: "#EEE6FA", トイレ: "#DDF3EE", ほけんしつ: "#FFF0F3", しょくいんしつ: "#F6EEDF", としょしつ: "#FFEFE4", ゴール: "#BDE3F2" }[place] || "#FFF4D6";
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: wallC }, L);
  el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: place === "トイレ" ? "#CFE7F0" : "#E9C893" }, L);
  el("path", { d: "M0 760 H1600", ...S6(6) }, L);
  for (let x = 0; x < 1600; x += 160) el("path", { d: `M${x} 760 L${x - 80} 1000`, stroke: "#00000014", "stroke-width": 4 }, L);
  const win = (x, y, w, h) => { el("rect", { x, y, width: w, height: h, rx: 10, fill: "#BDE3F2", ...S6(6) }, L); el("path", { d: `M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}`, ...S6(5) }, L); };
  const shelf = (x, y, w, rows, cols, colors) => { el("rect", { x, y, width: w, height: rows * 90 + 20, rx: 8, fill: "#C98A4B", ...S6(6) }, L);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const cw = (w - 20) / cols; el("rect", { x: x + 10 + c * cw + 4, y: y + 14 + r * 90, width: cw - 8, height: 76, rx: 4, fill: colors[(r * cols + c) % colors.length], ...S6(4) }, L); } };
  if (place === "げんかん") { el("rect", { x: 980, y: 260, width: 420, height: 500, rx: 10, fill: "#B9824A", ...S6(6) }, L); win(1020, 300, 160, 220); win(1200, 300, 160, 220);
    el("rect", { x: 820, y: 640, width: 90, height: 120, rx: 10, fill: "#7FCBF0", ...S6(5) }, L); el("path", { d: "M840 640 V560 M870 640 V580", ...S6(6) }, L); }
  if (place === "げたばこ") shelf(860, 200, 640, 6, 6, ["#FFFFFF", "#FFFFFF", "#FF8FA3", "#FFFFFF", "#7FCBF0", "#FFFFFF"]);
  if (place === "ろうか" || place === "ゴール") { for (let x = 80; x < 1600; x += 360) win(x, 180, 240, 260); }
  if (place === "かいだん") { for (let i = 0; i < 7; i++) el("rect", { x: 820 + i * 100, y: 680 - i * 80, width: 900, height: 80, fill: i % 2 ? "#D9CBEF" : "#E6DBF6", ...S6(5) }, L); el("path", { d: "M800 600 L1500 40", ...S6(10), fill: "none" }, L); }
  if (place === "トイレ") { for (let x = 860; x < 1560; x += 220) { el("rect", { x, y: 240, width: 160, height: 200, rx: 14, fill: "#E8F7FF", ...S6(6) }, L); el("rect", { x: x - 10, y: 560, width: 180, height: 70, rx: 18, fill: "#FFFFFF", ...S6(6) }, L); el("path", { d: `M${x + 80} 560 V520 H${x + 104}`, ...S6(6), fill: "none" }, L); } }
  if (place === "ほけんしつ") { el("rect", { x: 900, y: 480, width: 620, height: 140, rx: 20, fill: "#FFFFFF", ...S6(6) }, L); el("rect", { x: 900, y: 620, width: 620, height: 140, fill: "#7FCBF0", ...S6(6) }, L);
    el("rect", { x: 1380, y: 500, width: 120, height: 80, rx: 30, fill: "#FFFFFF", ...S6(5) }, L); el("path", { d: "M1080 220 h80 M1120 180 v80", stroke: "#E2456F", "stroke-width": 26, "stroke-linecap": "round" }, L); }
  if (place === "しょくいんしつ") { el("rect", { x: 820, y: 520, width: 700, height: 60, rx: 8, fill: "#C98A4B", ...S6(6) }, L); el("path", { d: "M860 580 V760 M1480 580 V760", ...S6(10) }, L);
    el("rect", { x: 1300, y: 460, width: 64, height: 60, rx: 10, fill: "#FFFFFF", ...S6(5) }, L); el("rect", { x: 900, y: 180, width: 420, height: 220, rx: 10, fill: "#3F7F5E", ...S6(6) }, L); }
  if (place === "としょしつ") { shelf(820, 160, 340, 6, 5, ["#FF8FA3", "#7FCBF0", "#FFD25E", "#7CC36A", "#B9A8D9"]); shelf(1200, 160, 340, 6, 5, ["#7CC36A", "#FFD25E", "#FF8FA3", "#B9A8D9", "#7FCBF0"]); }
  if (place === "ゴール") { for (let i = 0; i < 12; i++) el("path", { d: `M${i * 140} 60 l70 0 l-35 60 Z`, fill: ["#FF6F91", "#FFD25E", "#7FCBF0", "#7CC36A"][i % 4], ...S6(4) }, L); el("path", { d: "M0 60 H1600", ...S6(5) }, L); }
  if (place !== "ゴール" && !noSign) { const g = el("g", {}, L); el("rect", { x: 620, y: 24, width: 360, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, 46, { "text-anchor": "middle" }); }
}

/* ---------- 画面の切りかえ ---------- */
let view = "start";
const PART = { pyon: [1180, .95], gao: [1180, 1.0], mii: [1180, .95], chu: [1200, .4], kamejii: [1160, .95], doshin: [1280, 2.4], nobbo: [1160, 1.05], meebaa: [1180, .95] };
function partnersOf(sc) {
  if (!sc || sc.partner === "まるシマ") return [];
  if (sc.partner === "みんな") return [["pyon", 900, .55], ["mii", 1080, .55], ["gao", 1270, .58], ["chu", 1450, .22]];
  if (sc.partner.includes("、")) return [["gao", 1060, .95], ["chu", 1400, .38]];
  const k = Object.keys(NAMES).find(k => NAMES[k] === sc.partner); const [x, s] = PART[k]; return [[k, x, s]];
}
let partners = [];
function show(c) { c.root.style.display = ""; visible.push(c); }
let doer = null;
function setView(v, sc, opt = {}) {
  clearMarks(); view = v; chars.forEach(c => c.root.style.display = "none"); visible.length = 0; unsay(); showEar(null, false); hideTask();
  boardLayer.style.display = v === "board" ? "" : "none"; sceneLayer.style.display = v === "board" ? "none" : ""; hud.style.display = v === "board" ? "" : "none";
  diceBtn.style.visibility = v === "board" ? "visible" : "hidden";
  if (v === "board") {
    place(C.pony, 200, 372, .42); show(C.pony);
    [P.doshin, P.shima, P.gao].forEach(show);
  } else if (v === "scene") {
    drawRoom(sc.place);
    place(C.pony, 200, 975, .7); show(C.pony);
    if (opt.gao) {
      // がおが課題をする場面：まるシマは見まもり役、がおが主役、相手は右はし
      place(C.shima, 520, 975, .78); show(C.shima);
      doer = C.gao; place(C.gao, 890, 975, .95); C.gao.dx.v = 600; C.gao.dx.t = 0; show(C.gao);
      let list = partnersOf(sc).filter(([k]) => k !== "gao");
      if (sc.partner === "みんな") list = [["pyon", 1170, .5], ["mii", 1320, .5], ["chu", 1470, .2]];
      else list = list.map(([k, x, s]) => [k, 1330, s * .85]);
      partners = list.map(([k, x, s]) => { const c = C[k]; place(c, x, 975, s); c.dx.v = 700; c.dx.t = 0; show(c); return c; });
    } else {
      doer = null; place(C.shima, 560, 975, .9); show(C.shima);
      partners = partnersOf(sc).map(([k, x, s]) => { const c = C[k]; place(c, x, 975, s); c.dx.v = 700; c.dx.t = 0; show(c); return c; });
    }
  } else if (v === "parade") {
    drawRoom("ゴール");
    [["doshin", 120, 1.2], ["nobbo", 340, .62], ["kamejii", 490, .5], ["meebaa", 630, .5], ["pony", 770, .5], ["shima", 910, .56], ["pyon", 1050, .5], ["mii", 1190, .5], ["gao", 1340, .54], ["chu", 1480, .2]]
      .forEach(([k, x, s]) => { place(C[k], x, 985, s); show(C[k]); });
  }
}

/* ---------- コマの移動 ---------- */
const OFF = { shima: -26, gao: 30, doshin: 0 };
function nodeXY(pc, id) {
  const [x, y] = NODES[id];
  if (pc === P.doshin) return [x, y + 16];
  const onDoshin = pc === P.gao && id === BLOCK && doshinAsleep;
  return [x + OFF[pc.kind], y + 18 - (onDoshin ? 92 : 0)];
}
function setPiece(pc, id) { pc.node = id; [pc.px, pc.py] = nodeXY(pc, id); }
const tweens = [];
function slide(pc, x, y, dur, hopPower = 0) {
  return new Promise(res => { tweens.push({ pc, x0: pc.px, y0: pc.py, x1: x, y1: y, t: 0, dur, res }); if (hopPower) jump(pc, hopPower); });
}
const STEP_NOTES = [N.C5, N.D5, N.E5, N.F5, N.G5, N.A5];
function stepSound(pc, i) {
  if (!ctx) return;
  if (pc === P.gao) { const f = STEP_NOTES[i % 6] * .5; blip(f, f * 1.6, .09, "square"); }
  else { const f = STEP_NOTES[i % 6]; blip(f, f * 1.5, .14, "triangle"); later(60, () => blip(f * 2, f * 2.2, .06, "sine")); }
}
function landSound(pc) { if (!ctx) return; noise(.06, pc === P.gao ? 900 : 1400, .22); blip(pc === P.gao ? 160 : 220, 90, .08, "sine"); }
async function hop(pc, id, dur, i = 0) {
  pc.node = id; const [x, y] = nodeXY(pc, id); pc.moving = true; stepSound(pc, i);
  await slide(pc, x, y, dur, dur * 1.45); landSound(pc); pc.moving = false; await sleep(dur * 250);
}
let winner = null, doshinAsleep = true;
async function moveBy(pc, n) {
  const fast = pc === P.gao;
  for (let i = 0; i < n; i++) {
    const nx = NEXT(pc.node); if (!nx.length) break;
    let to = nx[0];
    if (nx.length > 1) to = pc === P.shima ? await askFork() : nx[rnd(2)];
    if (to === BLOCK && doshinAsleep && pc === P.shima) await blockEvent();
    await hop(pc, to, fast ? .2 : .38, i);
    if (fast && i < n - 1) await sleep(40);
    if (to === GOAL) { if (!winner) winner = pc === P.shima ? "child" : "gao"; break; }
  }
}

/* ---------- サイコロ ---------- */
const diceBtn = document.getElementById("dice");
const PIPS = { 1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[26, 26], [50, 50], [74, 74]] };
function drawFace(v) { diceBtn.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true">${PIPS[v].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="#E8735A" stroke="#2B2A33" stroke-width="4"/>`).join("")}</svg>`; diceBtn.setAttribute("aria-label", `サイコロ ${v}`); }
drawFace(3);
function whoosh() {
  if (!ctx) return; const d = .35, b = ctx.createBuffer(1, ctx.sampleRate * d, ctx.sampleRate), x = b.getChannelData(0);
  for (let i = 0; i < x.length; i++) x[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / x.length);
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(), t = ctx.currentTime;
  s.buffer = b; f.type = "bandpass"; f.Q.value = 1.2; f.frequency.setValueAtTime(500, t); f.frequency.exponentialRampToValueAtTime(3000, t + d); g.gain.value = .35;
  s.connect(f).connect(g).connect(ctx.destination); s.start();
}
/* iPadのスピーカーでも聞こえるよう、中高音域でしっかりした音量にする */
function hit(freq, dur, gain, type = "triangle", f1) {
  const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + .02);
}
function burst(dur, freq, q, gain) {
  const b = ctx.createBuffer(1, Math.max(1, ctx.sampleRate * dur), ctx.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = b; f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q; g.gain.value = gain;
  s.connect(f).connect(g).connect(ctx.destination); s.start();
}
/* サイコロの音は録音のように作った音源（rattle / thunk）を鳴らす */
const SFXBUF = {};
function loadSfx() {
  ["sfx_rattle", "sfx_thunk"].forEach(k => { if (SFXBUF[k] || !ctx) return; SFXBUF[k] = "loading";
    voiceBuf(k).then(buf => SFXBUF[k] = buf); });
}
function playSfx(k, vol = 1) {
  if (!ctx) return; const buf = SFXBUF[k];
  if (buf && buf !== "loading") { const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = buf; g.gain.value = vol; s.connect(g).connect(ctx.destination); s.start(); }
  else { const a = new Audio(AUD[k]); a.play().catch(() => {}); }
}
function clack(i) { // （予備）合成のカラカラ
  if (!ctx) return; const f = 900 + Math.random() * 500;
  hit(f, .05, .32, "triangle", f * .8); hit(f * 2.7, .025, .12, "sine"); burst(.04, 2500 + Math.random() * 1500, 2, .9);
}
function thunk() { // コトン！
  if (!ctx) return;
  hit(520, .16, .45, "triangle", 260); hit(1040, .07, .2, "sine", 700); burst(.08, 1200, 1.5, 1.2);
  later(90, () => { hit(700, .12, .3, "triangle", 420); burst(.05, 1800, 2, .6); });
}
const numPop = el("g", { opacity: 0 }, hudLayer);
el("circle", { cx: 0, cy: 0, r: 70, fill: "#FFD25E", stroke: INK, "stroke-width": 6 }, numPop);
const numPopT = el("text", { x: 0, y: 30, "text-anchor": "middle", "font-family": FONT, "font-size": 90, fill: INK }, numPop);
const NUMS = { 1: "いち！", 2: "に！", 3: "さん！" };
function popNumber(v) {
  numPopT.textContent = v; numPop.setAttribute("opacity", 1); const t0 = performance.now();
  const f = () => { const k = (performance.now() - t0) / 1000; const s = k < .25 ? .4 + 2.4 * k + Math.sin(k * 40) * .1 * (1 - k * 4) : 1;
    numPop.setAttribute("transform", `translate(1280 170) scale(${s.toFixed(3)})`); if (k < 1.1) requestAnimationFrame(f); else numPop.setAttribute("opacity", 0); }; f();
}
async function rollDice(forced) {
  diceBtn.classList.remove("ready"); let v = 1; whoosh(); playSfx("sfx_rattle");
  for (let i = 0; i < 12; i++) { v = 1 + rnd(3); drawFace(v); diceBtn.style.transform = `rotate(${(i % 2 ? -1 : 1) * (18 - i) * motion}deg) translateY(${-8 * motion * (1 - i / 12)}%)`; await sleep(45 + i * 13); }
  if (forced) v = forced; drawFace(v); diceBtn.style.transform = `scale(${1 + .12 * motion})`; playSfx("sfx_thunk");
  await sleep(120); diceBtn.style.transform = "";
  // 出た目の数だけ「ぴん」と鳴らす（数を音でも感じられるように）
  popNumber(v); for (let i = 0; i < v; i++) { const f = [N.C6, N.E5 * 2, N.G5 * 2][i]; later(i * 170, () => blip(f, f * 1.01, .25, "triangle")); }
  await sleep(250 + v * 170); return v;
}
function waitDice() { return new Promise(res => { diceBtn.disabled = false; diceBtn.classList.add("ready"); diceBtn.onclick = () => { audio(); diceBtn.onclick = null; diceBtn.disabled = true; res(); }; }); }

/* ---------- 音声認識 ---------- */
const SRC = window.SpeechRecognition || window.webkitSpeechRecognition;
let srUsable = !!SRC;
const srEl = document.getElementById("srState"), heardEl = document.getElementById("heard"), engEl = document.getElementById("engine");
const devB = { ok: document.getElementById("d-ok"), part: document.getElementById("d-part"), none: document.getElementById("d-none") };
function srStatus(s) { srEl.textContent = "音声認識: " + ({ ready: "つかえます（はじめるとマイクの許可を聞かれます）", on: "きいています", idle: "まっています", off: "このページでは使えません。判定は下のボタンで行います" }[s] || s); }
srStatus(SRC ? "ready" : "off");
const kata2hira = s => s.replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
const norm = s => kata2hira(s).replace(/[\s、。！？!?,.・「」]/g, "");
const countMatch = (t, groups) => groups.filter(g => g.some(v => norm(t).includes(norm(v)) || t.includes(v))).length;
function hear(onText, ms) {
  let stopped = false, rec = null, resolveDone; const endAt = performance.now() + ms;
  const done = new Promise(r => resolveDone = r);
  const finish = () => { stopped = true; resolveDone(); };
  const start = () => {
    if (stopped || !srUsable) return finish();
    try {
      rec = new SRC(); rec.lang = "ja-JP"; rec.interimResults = true; rec.maxAlternatives = 3; rec.continuous = false;
      rec.onresult = e => { const out = []; for (let i = 0; i < e.results.length; i++) for (let j = 0; j < e.results[i].length; j++) out.push(e.results[i][j].transcript); onText(out); };
      rec.onerror = e => { if (e.error !== "no-speech" && e.error !== "aborted") { srUsable = false; srStatus("off"); } };
      rec.onend = () => { rec = null; if (!stopped && srUsable && performance.now() < endAt - 700) start(); else { srStatus(srUsable ? "idle" : "off"); finish(); } };
      rec.start(); srStatus("on");
    } catch (err) { srUsable = false; srStatus("off"); finish(); }
  };
  start();
  return { done, stop() { if (stopped) return; stopped = true; try { rec && rec.abort(); } catch (e) { } resolveDone(); } };
}
function devOn(cb) { Object.entries(devB).forEach(([k, b]) => { b.disabled = false; b.onclick = () => cb(k, "（確認ボタン）"); }); }
function devOff() { Object.values(devB).forEach(b => { b.disabled = true; b.onclick = null; }); }
function listen(groups, ms = 7000) {
  return new Promise(resolve => {
    let best = 0, heard = "", fin = false;
    const verdict = () => best === groups.length ? "ok" : best > 0 ? "part" : "none";
    const end = (r, why) => { if (fin) return; fin = true; taskListen(false); h.stop(); devOff(); clearTimeout(tmr); if (why) heard = why; heardEl.textContent = heard || "（きこえなかった）"; resolve({ r, heard }); };
    heardEl.textContent = "…"; taskListen(true);
    devOn(end);
    const h = hear(texts => {
      for (const t of texts) { const n = countMatch(t, groups); if (n > best || !heard) { best = Math.max(best, n); heard = t; } }
      heardEl.textContent = heard; if (best === groups.length) end("ok");
    }, ms);
    h.done.then(() => { if (srUsable) end(verdict()); });
    const tmr = setTimeout(() => { if (srUsable) end(verdict()); }, ms + 400);
  });
}

/* ---------- 声のしごと ---------- */
let speakPart = function (c, key, text, frac) {
  return new Promise(res => {
    audio(); const a = new Audio(AUD[key]); const src = ctx.createMediaElementSource(a); src.connect(analyser);
    speaker = c; say(c, text); let done = false;
    const fin = () => { if (done) return; done = true; a.pause(); speaker = null; c.speakingLevel = 0; res(); };
    a.onloadedmetadata = () => setTimeout(fin, (isFinite(a.duration) ? a.duration : 2) * frac * 1000);
    a.onended = fin; setTimeout(fin, 4000); a.play().catch(fin);
  });
}
const playMove = (c, id) => MOVES.find(m => m.id === id).play(c);
const JOY = ["banzai", "dance", "spin", "laugh", "clap", "pump", "heart"];

/* ---------- 難しさの調整 ---------- */
const E = { L: 1, h: 1, streak: 0 };
const used = new Set();
function showEngine(sc, note = "") {
  engEl.textContent = `むずかしさ: レベル ${E.L}／ヒント段階 ${E.h}（1=お手本ぜんぶ 2=はじめだけ 3=声なし）／連続あがり ${E.streak}` + (sc ? `／いまの場面 No.${sc.no}「${sc.main}」` : "") + (note ? `／${note}` : "");
  lvT.textContent = `レベル ${E.L}`;
}
function grade(firstOk) {
  const before = E.L;
  if (firstOk) { if (E.h < 3) E.h++; else { E.streak++; E.L = Math.min(10, E.L + [1, 2, 4][Math.min(E.streak, 3) - 1]); E.h = 2; } }
  else { E.streak = 0; if (E.h > 1) E.h--; else if (E.L > 1) { E.L--; E.h = 2; } }
  return E.L - before;
}
function pickScene(place) {
  const fresh = s => !used.has(s.no);
  let pool = SCENES.filter(s => s.lv === E.L && s.place === place && fresh(s));
  if (!pool.length) pool = SCENES.filter(s => s.lv === E.L && fresh(s));
  if (!pool.length) pool = SCENES.filter(s => s.lv === E.L);
  const sc = pool[rnd(pool.length)]; used.add(sc.no); return sc;
}

/* ---------- まねっこ（場面） ---------- */
async function present(sc, h, first) {
  const key = `k${pad(sc.no)}_main`;
  if (h === 1) { if (first) await speak(C.pony, "p_say", "まねして いってね"); await speak(C.pony, key, sc.main); return; }
  if (h === 2) { const cut = Math.max(1, Math.ceil(sc.main.length * .45)); await speakPart(C.pony, key, sc.main.slice(0, cut) + "…", .45); return; }
  partners.forEach(p => playMove(p, "point")); markAbove(C.shima, "ex"); await sleep(1000);
}
async function runScene(place) {
  const sc = pickScene(place); setView("scene", sc); showEngine(sc);
  showTask(sc.main, "いってみよう");
  await sleep(650); partners.forEach((p, i) => later(i * 150, () => wave(p)));
  await sleep(500);
  let h = E.h, ok = false, a = 0;
  for (; a < 3; a++) {
    await present(sc, h, a === 0);
    setListen(C.shima, true); const res = await listen(KEYS[sc.no]); setListen(C.shima, false); unsay();
    if (res.r === "ok") { ok = true; break; }
    if (res.r === "part") { playMove(C.shima, "think"); await speak(C.pony, "p_close", "おしい！"); }
    else { playMove(C.shima, "think"); await sleep(700); }
    if (a < 2) { h = Math.max(1, h - 1); if (h === 1) await speak(C.pony, "p_again", "もう いっかい いってみよう"); }
  }
  const up = grade(ok && a === 0); GS.tasks++; if (ok) GS.ok++;
  if (ok) {
    playMove(C.shima, JOY[rnd(JOY.length)]); partners.forEach((p, i) => later(200 + i * 150, () => SPECIAL[p.kind](p))); confetti(60);
    await sleep(500); await (rnd(2) ? speak(C.shima, "shima", "やったー！ いえたね！") : speak(C.pony, "p_great", "すごい！ いえたね！"));
    if (sc.partner === "かめじい" && rnd(2)) await speak(C.kamejii, "kamejii", "よく いえましたね");
  } else {
    await speak(C.pony, "p_together", "いっしょに いおうね"); await speak(C.pony, `k${pad(sc.no)}_main`, sc.main); playMove(C.shima, "nod");
  }
  if (up > 0) { tune([[N.C5, .5], [N.E5, .5], [N.G5, .5], [N.C6, 1.5]], 220); later(100, () => showBanner("レベル アップ！")); await speak(C.pony, "p_levelup", "レベル アップ！"); await sleep(900); }
  showEngine(null, ok ? (a === 0 ? "1回目で言えた" : `${a + 1}回目で言えた`) : "3回とも言えなかった");
  await sleep(700); setView("board");
  return ok;
}

/* ---------- 盤のできごと ---------- */
let stickers = 0; const got = new Set();
async function treasure(id) {
  got.add(id); stickers++; const t = treasureIcons[id];
  if (t) t.lid.setAttribute("transform", "rotate(-35 -36 -10)");
  const [x, y] = NODES[id]; for (let i = 0; i < 6; i++) mark("sparkle", x, y - 30, { vx: Math.cos(i) * 200, vy: -200 - i * 30, life: .9, s: .6 });
  tune([[N.G5, .5], [N.C6, 1]], 200); joy(P.shima);
  await speak(C.pony, "takara", "たからばこ だよ！"); await speak(C.pony, "p_sticker", "シールを ゲット！");
  stT.textContent = `× ${stickers}`;
}
async function landChild() {
  const id = P.shima.node; if (winner) return;
  const k = kindOf(id);
  if (k === "treasure" && !got.has(id)) { await treasure(id); return; }
  if (k === "start" || k === "treasure") return;
  const ok = await runSit(zoneOf(id));
}
async function askFork() {
  await speak(C.pony, "fork", "うえと したの、どっちに いく？");
  const mk = (label, id) => { const b = document.createElement("button"); b.type = "button"; b.className = "arrow"; b.textContent = label;
    const [x, y] = NODES[id]; b.style.left = `calc(${x / 16}% - 4.5%)`; b.style.top = `calc(${y / 10}% - 7.2%)`; stage.appendChild(b); return b; };
  const up = mk("うえ", UP), down = mk("した", DOWN);
  const pick = await new Promise(res => {
    let done = false; const fin = v => { if (done) return; done = true; h && h.stop(); up.remove(); down.remove(); res(v); };
    up.onclick = () => fin(UP); down.onclick = () => fin(DOWN);
    setListen(P.shima, true);
    const h = srUsable ? hear(texts => { const t = texts.join(" "); if (/うえ|上/.test(kata2hira(t))) fin(UP); else if (/した|下/.test(kata2hira(t))) fin(DOWN); heardEl.textContent = t; }, 15000) : null;
  });
  setListen(P.shima, false);
  await speak(C.pony, pick === UP ? "up" : "down", pick === UP ? "うえ！" : "した！");
  return pick;
}
async function blockEvent() {
  await speak(C.pony, "p_doshin", "どしんが ねてる！"); surprise(P.shima);
  showTask("どいて ください", "どしんに いおう", 520);
  for (let a = 0; a < 2; a++) {
    await speak(C.pony, "block", "どいて ください");
    setListen(P.shima, true); const r = await listen([["どいて", "退いて", "どいで"]]); setListen(P.shima, false);
    if (r.r === "ok") { joy(P.shima); GS.ok++; break; }
    if (a === 0) await speak(C.pony, "p_again", "もう いっかい いってみよう");
  }
  hideTask(); doshinAsleep = false; delete P.doshin.tm.closed; surprise(P.doshin); await sleep(700);
  await speak(P.doshin, "doshin", "どいて、あげるよ");
  P.doshin.tm.run = 1.2;
  if (P.gao.node === BLOCK) { const [gx, gy] = nodeXY(P.gao, BLOCK); slide(P.gao, gx, gy, .4, .3); }
  await slide(P.doshin, 1000, 792, 1.1); P.doshin.node = null;
}
const ABE = [17, 18, 20];
let abeLeft = [];
async function gaoTask(before) {
  // がおも課題をする。ときどき（レベル2から）あべこべに言いまちがえ、子どもが正しく教える
  const mistake = E.L >= 2 && abeLeft.length > 0 && Math.random() < .3;
  let sc;
  if (mistake) { const no = abeLeft.splice(rnd(abeLeft.length), 1)[0]; sc = SCENES.find(s => s.no === no); }
  else sc = pickScene(zoneOf(P.gao.node));
  const key = `k${pad(sc.no)}_main`;
  setView("scene", sc, { gao: true }); showEngine(sc, "がおの課題");
  if (!mistake) showTask(sc.main, "がおの おだい");
  await sleep(650); partners.forEach((p, i) => later(i * 150, () => wave(p))); await sleep(450);
  await speak(C.pony, key, sc.main);
  setListen(C.gao, true); playMove(C.gao, "think"); await sleep(900); setListen(C.gao, false);
  if (!mistake) {
    await speak(C.gao, "g" + key.slice(0, 3), sc.main);
    SPECIAL.gao(C.gao); chime(); playMove(C.shima, "clap"); markAbove(C.gao, "sparkle");
    await sleep(1300); setView("board"); return;
  }
  await speak(C.gao, "g_abe" + sc.no, sc.abekobe);
  surprise(C.shima); partners.forEach(p => surprise(p)); markAbove(C.pony, "q");
  await sleep(500);
  showTask(sc.main, "がおに おしえよう");
  await speak(C.pony, "teach", "がおに おしえて あげよう");
  playMove(C.gao, "think"); await speak(C.gao, "g_huh", "あれ？ ちがった？");
  let ok = false;
  for (let a = 0; a < 2 && !ok; a++) {
    await speak(C.pony, key, sc.main);
    setListen(C.shima, true); const r = await listen(KEYS[sc.no]); setListen(C.shima, false);
    ok = r.r === "ok"; if (ok) GS.ok++; if (!ok && a === 0) await speak(C.pony, "p_again", "もう いっかい いってみよう");
  }
  if (ok) {
    joy(C.shima); confetti(50); chime(); markAbove(C.gao, "ex");
    await speak(C.gao, "g_thanks", "そっか、ありがとな");
  } else {
    await speak(C.pony, "p_together", "いっしょに いおうね"); await speak(C.pony, key, sc.main);
  }
  await speak(C.gao, "g" + key.slice(0, 3), sc.main); playMove(C.gao, "nod");
  await sleep(700); setView("board");
  if (ok) {
    markAbove(P.gao, "drop"); P.gao.node = before; const [x, y] = nodeXY(P.gao, before); await slide(P.gao, x, y, .5, .3);
    await speak(C.pony, "p_bonus", "おまけで ひとつ すすもう"); await moveBy(P.shima, 1);
    if (kindOf(P.shima.node) === "treasure" && !got.has(P.shima.node) && !winner) await treasure(P.shima.node);
  }
}

/* ---------- 番の流れ ---------- */
let childShouldWin = true;
function gaoRoll() {
  const g = idx(P.gao.node), k = idx(P.shima.node); let r = 1 + rnd(3);
  if (childShouldWin) {
    const lead = GOAL_IDX - k > 5 ? 1 : -1;
    const cap = Math.min(GOAL_IDX - 1 - g, Math.max(0, k + lead - g));
    r = Math.min(r, cap);
  } else {
    if (k + 1 - g > r) r = Math.min(3, k + 1 - g);
    if (GOAL_IDX - g <= 3) r = GOAL_IDX - g;
  }
  return r;
}
async function childTurn(first) {
  setTurn("child"); await sleep(300);
  if (first) await speak(C.pony, "roll", "サイコロを ふってね"); else await speak(C.pony, "p_your", "きみの ばんだよ");
  await waitDice(); const v = await rollDice();
  await speak(C.pony, "n" + v, NUMS[v]);
  await moveBy(P.shima, v); await sleep(250);
  await landChild();
}
async function gaoTurn() {
  setTurn("gao"); await sleep(300);
  await speak(P.gao, "g_go", "いくぞ！");
  const r = gaoRoll(); const shown = await rollDice(Math.max(1, r));
  await speak(C.pony, "n" + shown, NUMS[shown]);
  if (r <= 0) { P.gao.tm.run = .3; await sleep(300); flop(P.gao); markAbove(P.gao, "drop"); await sleep(1300); return; }
  const before = P.gao.node; await moveBy(P.gao, r); await sleep(200);
  if (winner) return;
  if (kindOf(P.gao.node) === "normal") await gaoSit(before);
}
/* ---------- ゴールの演出（ドパッと派手に） ---------- */
const GS = { ok: 0, tasks: 0, startL: 1 };
const fxTicks = [];
const addTick = f => fxTicks.push(f);
function stepFx(dt) { for (let i = fxTicks.length - 1; i >= 0; i--) if (fxTicks[i](dt) === false) fxTicks.splice(i, 1); }
function tween(ms, f) { return new Promise(res => { let t = 0; addTick(dt => { t += dt * 1000; const k = Math.min(1, t / ms); f(k); if (k >= 1) { res(); return false; } }); }); }
const easeBack = k => { const c = 1.9; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
function flash() { const r = el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFFFFF" }, hudLayer); tween(450, k => r.setAttribute("opacity", (1 - k).toFixed(2))).then(() => r.remove()); }
function shake(ms = 500, amp = 18) { const a = amp * motion; return tween(ms, k => { svg.style.transform = k < 1 ? `translate(${((Math.random() - .5) * a * (1 - k)).toFixed(1)}px, ${((Math.random() - .5) * a * (1 - k)).toFixed(1)}px)` : ""; }); }
function slam(text, cy, size, fill = "#FFD25E") {
  const g = el("g", {}, hudLayer);
  const t = el("text", { x: 800, y: cy + size * .35, "text-anchor": "middle", "font-family": FONT, "font-size": size, fill, stroke: INK, "stroke-width": size / 9, "paint-order": "stroke", "stroke-linejoin": "round" }, g); t.textContent = text;
  tween(380, k => g.setAttribute("transform", `translate(800 ${cy}) scale(${(3 - 2 * easeBack(k)).toFixed(3)}) translate(-800 ${-cy})`)).then(() => { shake(); boom(.5); });
  return g;
}
function cannon(x, dir, n = 60) {
  const cols = ["#FF6F91", "#FFD25E", "#7FCBF0", "#7CC36A", "#B9A8D9", "#FF9E5E"];
  n = Math.round(n * Math.max(.2, motion));
  for (let i = 0; i < n; i++) {
    const r = el(i % 3 ? "rect" : "circle", i % 3 ? { width: 22, height: 12, rx: 3, fill: cols[i % cols.length], stroke: INK, "stroke-width": 2 } : { r: 9, fill: cols[i % cols.length], stroke: INK, "stroke-width": 2 }, fxLayer);
    bits.push({ r, x, y: 980, vx: dir * (300 + Math.random() * 700), vy: -1300 - Math.random() * 700, a: Math.random() * 360, va: (Math.random() - .5) * 900, life: 3.2 });
  }
  noise(.25, 900, .6); blip(300, 1200, .25, "sawtooth");
}
function boom(v = 1) { if (!ctx) return; noise(.5, 160, .9 * v); noise(.3, 500, .5 * v); blip(140, 40, .5, "sine"); }
function firework(x, y, hue) {
  const cols = [["#FF6F91", "#FFC2D1"], ["#FFD25E", "#FFF1B8"], ["#7FCBF0", "#D3F0FF"], ["#7CC36A", "#D6F2C9"], ["#B9A8D9", "#EDE5FF"]][hue % 5];
  const trail = el("circle", { r: 8, fill: cols[1], stroke: INK, "stroke-width": 2 }, fxLayer);
  if (ctx) blip(400, 1600, .7, "sine");
  tween(700, k => { trail.setAttribute("cx", x); trail.setAttribute("cy", (1000 - (1000 - y) * (1 - Math.pow(1 - k, 3))).toFixed(1)); }).then(() => {
    trail.remove(); boom(.6); later(120, () => { if (ctx) for (let i = 0; i < 6; i++) later(i * 60, () => noise(.04, 3000 + Math.random() * 3000, .3)); });
    const parts = [], N = 26;
    for (let i = 0; i < N; i++) { const a = i / N * Math.PI * 2, sp = 460 + (i % 2) * 180;
      parts.push({ e: el("circle", { r: i % 2 ? 13 : 18, fill: cols[i % 2], stroke: INK, "stroke-width": 2 }, fxLayer), x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp }); }
    let life = 1.6;
    addTick(dt => { life -= dt; parts.forEach(p => { p.vy += 380 * dt; p.vx *= .985; p.vy *= .985; p.x += p.vx * dt; p.y += p.vy * dt;
      p.e.setAttribute("cx", p.x.toFixed(1)); p.e.setAttribute("cy", p.y.toFixed(1)); p.e.setAttribute("opacity", Math.max(0, Math.min(1, life * 1.4)).toFixed(2)); });
      if (life <= 0) { parts.forEach(p => p.e.remove()); return false; } });
  });
}
function rays() {
  const g = el("g", { opacity: .55 }, sceneLayer);
  for (let i = 0; i < 18; i++) { const a0 = i / 18 * Math.PI * 2, a1 = a0 + Math.PI / 18;
    el("path", { d: `M800 430 L${800 + Math.cos(a0) * 1400} ${430 + Math.sin(a0) * 1400} L${800 + Math.cos(a1) * 1400} ${430 + Math.sin(a1) * 1400} Z`, fill: i % 2 ? "#FFE27A" : "#FFFFFF" }, g); }
  let ang = 0; addTick(dt => { if (!g.isConnected) return false; ang += dt * 14 * Math.max(.2, motion); g.setAttribute("transform", `rotate(${ang.toFixed(2)} 800 430)`); });
}
function fanfare() {
  tune([[N.G5, .5], [N.G5, .5], [N.G5, .5], [N.C6, 1.5], [0, .5], [N.A5, .5], [N.B5, .5], [N.C6, 2]], 260, "square", .07);
  tune([[N.E5, .5], [N.E5, .5], [N.E5, .5], [N.G5, 1.5], [0, .5], [N.F5, .5], [N.G5, .5], [N.E5, 2]], 260, "triangle", .1);
  tune([[N.C4, 1.5], [N.C4, 1.5], [0, .5], [N.F5 / 4, 1], [N.C4, 2]], 260, "triangle", .14);
}
function crownOn(c) {
  const g = el("g", {}, fxLayer);
  el("path", { d: "M-60 20 L-70 -40 L-35 -10 L0 -55 L35 -10 L70 -40 L60 20 Z", fill: "#FFD25E", ...S6(6) }, g);
  [[-70, -40], [0, -55], [70, -40]].forEach(([x, y]) => el("circle", { cx: x, cy: y, r: 10, fill: "#FF6F91", ...S6(4) }, g));
  let k = 0;
  addTick(dt => { if (view !== "parade") { g.remove(); return false; } k = Math.min(1, k + dt * 2.5); const p = headTop(c), s = Math.max(.5, c.s * 1.3);
    g.setAttribute("transform", `translate(${p.x.toFixed(1)} ${(p.y - 10 - (1 - easeBack(k)) * 300).toFixed(1)}) scale(${s.toFixed(2)}) rotate(${(Math.sin(performance.now() / 300) * 6).toFixed(1)})`); });
}
function medal(x, y, gold, label) {
  const g = el("g", {}, hudLayer);
  el("path", { d: "M-60 -150 L-20 -40 L20 -40 L60 -150 L25 -150 L0 -80 L-25 -150 Z", fill: "#FF6F91", ...S6(6) }, g);
  el("circle", { r: 105, fill: gold ? "#FFD25E" : "#DCE3EA", ...S6(8) }, g);
  el("circle", { r: 78, fill: "none", stroke: gold ? "#E8A93A" : "#AEB8C2", "stroke-width": 8 }, g);
  el("path", { d: "M0 -52 L15 -16 L54 -16 L23 8 L34 46 L0 24 L-34 46 L-23 8 L-54 -16 L-15 -16 Z", fill: "#FFFFFF", ...S6(5) }, g);
  const lab = el("text", { y: 160, "text-anchor": "middle", "font-family": FONT, "font-size": 44, fill: INK, stroke: "#FFFFFF", "stroke-width": 10, "paint-order": "stroke" }, g); lab.textContent = label;
  tween(700, k => g.setAttribute("transform", `translate(${x} ${(y - (1 - easeBack(k)) * 700).toFixed(1)}) rotate(${((1 - k) * 25).toFixed(1)})`)).then(() => {
    boom(.4); for (let i = 0; i < 10; i++) mark("sparkle", x, y, { vx: Math.cos(i * .63) * 420, vy: Math.sin(i * .63) * 420, life: .9, s: .8 });
    let a = 0; addTick(dt => { if (!g.isConnected) return false; a += dt; g.setAttribute("transform", `translate(${x} ${y}) rotate(${(Math.sin(a * 2.2) * 5).toFixed(2)})`); });
  });
  return g;
}
async function countLine(g, x, y, label, to, unit, from = 0) {
  const t = el("text", { x, y, "font-family": FONT, "font-size": 50, fill: INK, stroke: "#FFFFFF", "stroke-width": 10, "paint-order": "stroke" }, g);
  t.textContent = `${label} ${from}${unit}`;
  await tween(250, k => t.setAttribute("opacity", k));
  for (let v = from + 1; v <= to; v++) {
    t.textContent = `${label} ${v}${unit}`; const f = 520 * Math.pow(2, (v - from) / 12 * 2);
    blip(f, f * 1.02, .12, "square"); later(40, () => blip(f * 2, f * 2, .08, "sine"));
    tween(140, k => t.setAttribute("transform", `translate(${x} ${y}) scale(${(1 + .25 * (1 - k)).toFixed(3)}) translate(${-x} ${-y})`));
    await sleep(Math.max(90, 260 - (v - from) * 25));
  }
  chime(); markAbove(C.shima, "sparkle");
  return t;
}
async function ending() {
  const childWon = winner === "child"; const rec = store.get(); rec.games = (rec.games || 0) + 1; rec.wins = (rec.wins || 0) + (childWon ? 1 : 0); rec.stickers = (rec.stickers || 0) + stickers; store.set(rec);
  const winP = childWon ? P.shima : P.gao;
  // 1) 盤の上で：フラッシュ＋どーん＋紙ふぶき大砲
  flash(); fanfare(); const title = slam("ゴール！！", 470, 210); cannon(60, 1); cannon(1540, -1);
  joy(winP); later(300, () => joy(winP)); markAbove(winP, "sparkle");
  await sleep(700); await speak(C.pony, "goal", "ゴール！"); await sleep(600);
  title.remove();
  // 2) お祝いのステージへ
  setView("parade"); rays(); flash();
  visible.forEach((c, i) => later(i * 110, () => jump(c, .9))); later(1400, () => visible.forEach((c, i) => later(i * 110, () => jump(c, .9))));
  later(2600, () => visible.forEach((c, i) => later(i * 90, () => playMove(c, "dance"))));
  [[400, 260, 0], [1200, 220, 1], [800, 160, 2], [250, 330, 3], [1350, 300, 4]].forEach(([x, y, h], i) => later(300 + i * 650, () => firework(x, y, h)));
  later(4000, () => { cannon(60, 1, 40); cannon(1540, -1, 40); });
  await sleep(1200);
  if (childWon) {
    await speak(C.pony, "p_win", "かったね！ おめでとう！");
    showTask("うれしいです", "いってみよう", 260); await speak(C.pony, "k16_main", "うれしいです");
    setListen(C.shima, true); const r = await listen(KEYS[16]); setListen(C.shima, false);
    hideTask(); if (r.r === "ok") { joy(C.shima); chime(); confetti(50); }
  } else {
    await speak(C.gao, "g_win", "へへっ、おれの かちだ"); jump(C.gao, .8); later(500, () => flop(C.gao)); later(700, () => noise(.12, 600, .4)); await sleep(1300);
    await speak(C.pony, "p_kuya", "くやしい、って いってみよう"); showTask("くやしい", "いってみよう", 260); await speak(C.pony, "k13_main", "くやしい");
    setListen(C.shima, true); const r = await listen(KEYS[13]); setListen(C.shima, false);
    hideTask(); if (r.r === "ok") { playMove(C.shima, "pump"); chime(); }
  }
  // 3) メダルと王かん（負けても まるシマにメダル。がんばりをほめる）
  crownOn(childWon ? C.shima : C.gao); later(200, () => blip(600, 1800, .3, "triangle"));
  const md = medal(330, 300, childWon, childWon ? "1い！" : "よく がんばった！"); fanfare();
  await sleep(1300);
  // 4) 数がどんどん増える（できた数・シール・レベル）
  const card = el("g", {}, hudLayer);
  el("rect", { x: 620, y: 120, width: 900, height: 260, rx: 34, fill: "#FFFFFF", ...S6(8), opacity: .95 }, card);
  await countLine(card, 670, 210, "まねっこ できた", GS.ok, "こ");
  const lvT2 = await countLine(card, 670, 320, "レベル", E.L, "", GS.startL);
  if (E.L > GS.startL) { const up = el("text", { x: 1150, y: 320, "font-family": FONT, "font-size": 44, fill: "#E8735A", stroke: "#FFFFFF", "stroke-width": 8, "paint-order": "stroke" }, card); up.textContent = `${E.L - GS.startL}つ アップ！`; boom(.4); tween(300, k => up.setAttribute("opacity", k)); }
  firework(1450, 200, 1); later(500, () => firework(1150, 160, 3));
  await sleep(900);
  await speak(C.gao, "g_good", "いい しょうぶ だったな");
  if (childWon) await speak(C.gao, "gao", "つぎは、まけないぞ");
  const lapUp = childWon ? markClear() : false;
  if (childWon) { await speak(C.pony, "p_clear", "ステージ クリア！"); }
  if (lapUp) { const t = slam(`${SAVE.lap}しゅうめへ！`, 520, 150, "#FF9E7A"); fanfare(); await speak(C.pony, "p_lap2", "にしゅうめの はじまりだよ！ こんどは もっと むずかしいよ"); await sleep(600); t.remove(); }
  // 5) もういっかい
  const again = document.createElement("button"); again.type = "button"; again.className = "again"; again.textContent = "もういっかい";
  again.style.left = "70%"; again.style.top = "50%"; stage.appendChild(again);
  again.animate && again.animate([{ transform: "translateX(-50%) scale(1)" }, { transform: "translateX(-50%) scale(1.08)" }, { transform: "translateX(-50%) scale(1)" }], { duration: 900, iterations: Infinity });
  if (lapUp) again.textContent = `${SAVE.lap}しゅうめへ`;
  const toMenu = document.createElement("button"); toMenu.type = "button"; toMenu.className = "again menuBtn"; toMenu.textContent = "メニュー";
  toMenu.style.left = "70%"; toMenu.style.top = "68%"; stage.appendChild(toMenu);
  again.onclick = () => { again.remove(); toMenu.remove(); md.remove(); card.remove(); newGame(); };
  toMenu.onclick = () => { again.remove(); toMenu.remove(); md.remove(); card.remove(); setView("board"); showMenu(); };
}

/* ---------- 音の出口（iPhone・iPadのマナーモード対策） ----------
   1) navigator.audioSession.type = "playback"：この画面の音はマナーモードでも鳴らす、と端末に伝える
   2) さらに、作った音を全部「音声ファイルの再生」（audio要素）を通して鳴らす。音声ファイル扱いはマナーモードでも鳴る
   2がうまく動かないときは、自動でふつうの出口に戻す */
const ROUTE = { session: "なし", out: "ふつう" };

const audioBase = audio;
audio = function () {
  const first = !ctx;
  if (first) { try { if (navigator.audioSession) { navigator.audioSession.type = "playback"; ROUTE.session = "playback"; } } catch (e) { ROUTE.session = "設定できず"; } }
  audioBase();
  if (first) routeThroughMedia();
  return ctx;
};
function routeThroughMedia() {
  const real = ctx.destination;
  const master = ctx.createGain(); master.connect(real); // まずはふつうの出口へ
  Object.defineProperty(ctx, "destination", { value: master, configurable: true }); // 以後の音はすべて master を通る
  analyser.disconnect(); analyser.connect(master);
  const back = why => { try { master.disconnect(); } catch (e) { } master.connect(real); ROUTE.out = "ふつう（" + why + "）"; showRoute(); };
  ROUTE.out = "ふつう"; showRoute();
  try {
    if (!ctx.createMediaStreamDestination) { back("未対応"); return; }
    const dest = ctx.createMediaStreamDestination();
    const el = document.createElement("audio"); el.setAttribute("playsinline", ""); el.srcObject = dest.stream; el.style.display = "none";
    document.body.appendChild(el);
    master.disconnect(); master.connect(dest); ROUTE.out = "音声ファイル経由"; showRoute();
    const p = el.play(); if (p && p.catch) p.catch(() => back("再生できず"));
    setTimeout(() => { if (el.paused && ROUTE.out === "音声ファイル経由") back("止まっていた"); }, 1500);
  } catch (e) { back("エラー"); }
}
function showRoute() { const r = document.getElementById("route"); if (r) r.textContent = `音の出口: ${ROUTE.out}／マナーモード設定: ${ROUTE.session}／状態: ${ctx ? ctx.state : "-"}`; }
setInterval(() => ctx && showRoute(), 2000);

/* ---------- BGM ----------
   8小節の曲を、はじめに一度だけ音のデータに書き出して（OfflineAudioContext）、ループ再生する。
   画面の動きや処理の重さに左右されず、とぎれない。音量は下げない（一定）。 */
const BGM = { on: true, gain: null, src: null, buf: null };
const BGM_VOL = .6;
const mf = m => 440 * Math.pow(2, (m - 69) / 12);
const CHORDS = [[48, [60, 64, 67]], [45, [60, 64, 69]], [41, [60, 65, 69]], [43, [59, 62, 67]], [48, [60, 64, 67]], [45, [60, 64, 69]], [41, [60, 65, 69]], [48, [60, 64, 67]]];
const MELODY = [
  [76, 0, 79, 0, 84, 0, 79, 0], [81, 0, 79, 76, 0, 0, 0, 0], [77, 0, 81, 0, 84, 0, 81, 0], [79, 0, 0, 74, 76, 0, 74, 0],
  [76, 0, 79, 0, 84, 0, 86, 0], [88, 0, 86, 84, 81, 0, 0, 0], [77, 0, 81, 0, 79, 0, 83, 0], [84, 0, 0, 0, 0, 0, 0, 0]];
function marimba(ac, t, m, vol) {
  const f = mf(m);
  [[1, vol, .55], [4, vol * .35, .08], [10, vol * .08, .03]].filter(([h]) => f * h < ac.sampleRate / 2 - 500).forEach(([h, v, d]) => {
    const o = ac.createOscillator(), g = ac.createGain(); o.type = "sine"; o.frequency.value = f * h;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .005); g.gain.exponentialRampToValueAtTime(.0005, t + d);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d + .05);
  });
}
function bassNote(ac, t, m) {
  const o = ac.createOscillator(), g = ac.createGain(), lp = ac.createBiquadFilter(); o.type = "square"; o.frequency.value = mf(m + 12);
  lp.type = "lowpass"; lp.frequency.value = 1200;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.1, t + .01); g.gain.exponentialRampToValueAtTime(.001, t + .28);
  o.connect(lp).connect(g).connect(ac.destination); o.start(t); o.stop(t + .32);
}
function shaker(ac, t, vol, nb) {
  const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = nb; f.type = "highpass"; f.frequency.value = 6000; g.gain.value = vol;
  s.connect(f).connect(g).connect(ac.destination); s.start(t);
}
function chordPad(ac, t, notes, dur, vol) {
  const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1800; lp.connect(ac.destination);
  notes.forEach(m => [-6, 6].forEach(cents => {
    const o = ac.createOscillator(), g = ac.createGain(); o.type = "triangle"; o.frequency.value = mf(m); o.detune.value = cents;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .25); g.gain.setValueAtTime(vol, t + dur - .2); g.gain.linearRampToValueAtTime(0, t + dur + .1);
    o.connect(g).connect(lp); o.start(t); o.stop(t + dur + .15);
  }));
}
async function renderBgm() {
  const sr = 32000, spb = 60 / 112 / 2, L = 64 * spb; // 1ループ ≒ 17秒
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const ac = new OAC(1, Math.ceil(sr * L * 2), sr);
  const nb = ac.createBuffer(1, Math.floor(sr * .05), sr), d = nb.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  for (let s = 0; s < 128; s++) {
    const t = s * spb, bar = Math.floor((s % 64) / 8), e = s % 8, [root, ch] = CHORDS[bar];
    if (e === 0) chordPad(ac, t, ch, spb * 8, .024);
    if (e === 0 || e === 4) bassNote(ac, t, root);
    if (e === 6) bassNote(ac, t, root + 7);
    if (e % 2 === 1) ch.forEach((m, i) => marimba(ac, t + i * .012, m, .06));
    const mel = MELODY[bar][e]; if (mel) marimba(ac, t, mel, .12);
    shaker(ac, t, e % 2 ? .05 : .025, nb);
  }
  const full = await new Promise((ok, ng) => { const p = ac.startRendering(); if (p && p.then) p.then(ok, ng); else ac.oncomplete = ev => ok(ev.renderedBuffer); });
  // 2周目だけを切り出す（1周目の余韻がつながるので、つなぎ目が自然）
  const n = Math.round(sr * L), out = ctx.createBuffer(1, n, sr);
  out.getChannelData(0).set(full.getChannelData(0).subarray(n, 2 * n));
  return out;
}
async function bgmStart() {
  if (!ctx || BGM.src) return;
  try {
    // 曲は renderBgm() で作って書き出したもの（sfx_bgm）を使う。重い計算を iPad でしないため
    BGM.buf = BGM.buf || await voiceBuf("sfx_bgm") || await renderBgm();
    BGM.gain = ctx.createGain(); BGM.gain.gain.value = BGM.on ? BGM_VOL : 0; BGM.gain.connect(ctx.destination);
    const s = ctx.createBufferSource(); s.buffer = BGM.buf; s.loop = true; s.connect(BGM.gain); s.start(); BGM.src = s;
  } catch (e) { /* BGMなしでも遊べる */ }
}
const bgmBtn = document.getElementById("d-bgm");
if (bgmBtn) bgmBtn.onclick = () => { BGM.on = !BGM.on; bgmBtn.textContent = BGM.on ? "BGM: オン" : "BGM: オフ"; bgmBtn.setAttribute("aria-pressed", BGM.on); if (BGM.gain) BGM.gain.gain.value = BGM.on ? BGM_VOL : 0; };

/* ---------- 声（音のデータにしてから鳴らす。iPadで再生が抜けないように） ---------- */
const VBUF = {};
// 公開ページでは fetch で data: を読めないことがあるので、base64 を自分でほどく
function dataToArrayBuffer(uri) {
  const s = atob(uri.slice(uri.indexOf(",") + 1)), u = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
  return u.buffer;
}
function decodeData(uri) {
  return new Promise((ok, ng) => { try { const p = ctx.decodeAudioData(dataToArrayBuffer(uri), ok, ng); if (p && p.catch) p.catch(ng); } catch (e) { ng(e); } });
}
function voiceBuf(key) {
  if (!VBUF[key]) VBUF[key] = decodeData(AUD[key]).catch(() => null);
  return VBUF[key];
}
function preloadVoices(keys) { keys.forEach(k => AUD[k] && voiceBuf(k)); }
async function playVoice(c, key, text, frac = 1) {
  audio(); const buf = AUD[key] ? await voiceBuf(key) : null;
  speaker = c; say(c, text);
  if (!buf) { speaker = null; await speakEl(c, key, text); return; } // 予備：前のやり方で鳴らす
  const s = ctx.createBufferSource(); s.buffer = buf; s.connect(analyser);
  const dur = buf.duration * frac;
  await new Promise(res => { let done = false; const fin = () => { if (done) return; done = true; try { s.stop(); } catch (e) { } res(); };
    s.onended = fin; s.start(); setTimeout(fin, dur * 1000 + 80); });
  speaker = null; c.speakingLevel = 0;
}
// 共通部品の speak をこちらに置きかえる（前のやり方は予備として残す）
const speakEl = speak;
speak = async function (c, key, text) { await playVoice(c, key, text, 1); unsay(c); };
speakPart = (c, key, text, frac) => playVoice(c, key, text, frac);

/* ---------- 毎フレーム ---------- */
const stage = document.getElementById("stage");
let last = performance.now(), zt = 0, zi = 0;
function frame(now) {
  const dt = Math.min(1 / 30, (now - last) / 1000); last = now;
  const lv = level();
  visible.forEach(c => { c.speakingLevel = c === speaker ? lerp(c.speakingLevel, lv, .5) : lerp(c.speakingLevel, 0, .3); });
  for (let i = tweens.length - 1; i >= 0; i--) {
    const w = tweens[i]; w.t += dt; const k = Math.min(1, w.t / w.dur), e = k * k * (3 - 2 * k);
    w.pc.px = lerp(w.x0, w.x1, e); w.pc.py = lerp(w.y0, w.y1, e);
    if (k >= 1) { tweens.splice(i, 1); w.res(); }
  }
  Object.values(P).forEach(p => place(p, p.px, p.py, p.s0));
  if (doshinAsleep && view === "board") { zt -= dt; if (zt < 0) { zt = 1.5; markAbove(P.doshin, "z", { i: zi++ % 3, vx: 30, vy: -50, sway: 10, life: 1.8 }); } }
  visible.forEach(c => { if (!(c === P.doshin && doshinAsleep)) idleTick(c, dt, c.moving || c === speaker || earOn === c || view === "parade"); drawChar(c, dt, false); });
  stepBits(dt); stepMarks(dt); stepEar(now / 1000); stepFx(dt);

  requestAnimationFrame(frame);
}

/* ---------- はじめる ---------- */
/* ---------- ステージ・自動セーブ・メニュー ----------
   ステージは STAGES に足していく（ready: false は「じゅんびちゅう」と表示）。
   セーブは毎回の「きみの ばん」の始めに自動で。全部のステージをクリアすると、むずかしくなった2しゅうめへ。 */
const STAGES = [
  { id: "kousha", name: "こうしゃ", icon: "🏫", ready: true },
  { id: "undou", name: "うんどうじょう", icon: "⚽", ready: false },
  { id: "kouen", name: "こうえん", icon: "🌳", ready: false },
  { id: "omise", name: "おみせ", icon: "🛒", ready: false },
];
const SAVE_KEY = "kotoba-tane-save";
const SAVE = (() => { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || null; } catch (e) { return null; } })() || { v: 1, lap: 1, cleared: {}, E: null, play: null };
function saveNow() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(SAVE)); } catch (e) { /* 保存できなくても遊べる */ } }
if (SAVE.E) Object.assign(E, SAVE.E);
let curStage = "kousha";
const lapClears = () => SAVE.cleared[SAVE.lap] || (SAVE.cleared[SAVE.lap] = []);
function snapshot() {
  SAVE.E = { ...E };
  SAVE.play = { stage: curStage, lap: SAVE.lap, shima: P.shima.node, gao: P.gao.node, doshinAsleep, sitUsed: [...sitUsed], GS: { ...GS }, childShouldWin, t: Date.now() };
  saveNow();
}
function markClear() { // クリアを記録。全部クリアしたら つぎの しゅうへ（true を返す）
  const c = lapClears(); if (!c.includes(curStage)) c.push(curStage);
  const all = STAGES.filter(s => s.ready).every(s => c.includes(s.id));
  if (all) { SAVE.lap++; lapSetup(); }
  SAVE.E = { ...E }; saveNow(); return all;
}
function lapSetup() { // しゅうが進むほど むずかしく：はじめから長めの答え・お手本は半分から
  if (SAVE.lap >= 2) { E.L = Math.max(E.L, SAVE.lap >= 3 ? 8 : 5); E.h = Math.max(E.h, 2); }
}
function newGame(opt = {}) {
  const resume = !!(opt.resume && SAVE.play);
  if (opt.stage) curStage = opt.stage; else if (resume) curStage = SAVE.play.stage;
  GS.ok = 0; GS.tasks = 0; sitUsed.clear();
  winner = null; doshinAsleep = true; stickers = 0; got.clear(); abeLeft = ABE.slice(); E.h = Math.max(1, E.h);
  const rec = store.get(); childShouldWin = (rec.games || 0) < 3 ? true : Math.random() < (SAVE.lap >= 2 ? .6 : .75);
  if (!resume) lapSetup();
  GS.startL = E.L;
  drawBoard(); stT.textContent = "× 0";
  P.shima.s0 = .22; P.gao.s0 = .22; P.doshin.s0 = .3;
  setPiece(P.shima, "0"); setPiece(P.gao, "0"); setPiece(P.doshin, BLOCK); P.doshin.tm.closed = 1e6;
  if (resume) {
    const p = SAVE.play;
    setPiece(P.shima, p.shima); setPiece(P.gao, p.gao);
    doshinAsleep = p.doshinAsleep; (p.sitUsed || []).forEach(x => sitUsed.add(x)); Object.assign(GS, p.GS || {}); childShouldWin = p.childShouldWin;
    if (!doshinAsleep) { delete P.doshin.tm.closed; P.doshin.node = null; P.doshin.px = 1000; P.doshin.py = 792; }
  }
  setView("board"); showEngine(null, (childShouldWin ? "こんかいは きみが勝つ回" : "こんかいは がおが本気の回") + `／${SAVE.lap}しゅうめ`);
  run({ resume, intro: !resume });
}
async function rivalIntro() {
  setTurn("gao"); turnT.textContent = "ライバル！";
  if (SAVE.lap >= 2) { await showBanner(`${SAVE.lap}しゅうめ スタート！`, 1400); }
  await showBanner("ライバル がお が きた！", 1500);
  markAbove(P.gao, "ex"); jump(P.gao, .9);
  if (SAVE.lap >= 2) await speak(P.gao, "g_rival2", "こんどは ほんきで いくぞ！");
  else await speak(P.gao, "g_rival", "おれは がお！ どっちが さきに ゴールするか、きょうそうだ！");
  await speak(C.pony, "p_rival", "がおと きょうそうだよ。さきに ゴールに ついた ほうが かち！");
}
async function run(o = {}) {
  let first = true;
  if (o.intro) await rivalIntro();
  else if (o.resume) await speak(C.pony, "p_resume", "つづきから はじめるよ");
  while (!winner) { snapshot(); await childTurn(first && !o.resume); first = false; if (winner) break; await gaoTurn(); }
  SAVE.play = null; SAVE.E = { ...E }; saveNow();
  await sleep(500); await ending();
}
let started = false;
function boot() { // 最初のタップで音を使えるようにする
  if (started) return; started = true;
  audio(); loadSfx(); bgmStart();
  preloadVoices(Object.keys(AUD).filter(k => !/^k\d|^gk/.test(k)));
}
function showMenu() {
  let box = document.getElementById("startBox");
  if (!box) { box = document.createElement("div"); box.id = "startBox"; box.className = "start"; stage.appendChild(box); }
  box.innerHTML = ""; box.className = "start menu";
  const h = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const card = h("div", "mcard");
  card.append(h("div", "mtitle", "ことばのたね"));
  card.append(h("div", "mlap", SAVE.lap >= 2 ? `${SAVE.lap}しゅうめ（むずかしい）` : "1しゅうめ"));
  const go = (fn) => { boot(); box.remove(); fn(); };
  if (SAVE.play) {
    const st = STAGES.find(s => s.id === SAVE.play.stage) || STAGES[0];
    const b = h("button", "mbig", "▶ つづきから"); b.type = "button";
    const sub = h("span", "msub", `${st.icon} ${st.name}の とちゅうから`); b.append(sub);
    b.onclick = () => go(() => newGame({ resume: true })); card.append(b);
  }
  card.append(h("div", "mhead", "ステージを えらぶ"));
  const list = h("div", "mstages");
  const clears = SAVE.cleared[SAVE.lap] || [];
  STAGES.forEach((s, i) => {
    const b = h("button", "mst" + (s.ready ? "" : " locked")); b.type = "button";
    b.append(h("span", "mno", String(i + 1)), h("span", "mico", s.icon), h("span", "mname", s.name),
      h("span", "mstat", !s.ready ? "じゅんびちゅう" : clears.includes(s.id) ? "★ クリア" : SAVE.play && SAVE.play.stage === s.id ? "とちゅう" : "あそぶ"));
    if (!s.ready) b.disabled = true;
    else b.onclick = () => { if (SAVE.play && !confirm("とちゅうの きろくは きえるよ。はじめから あそぶ？")) return; SAVE.play = null; saveNow(); go(() => newGame({ stage: s.id })); };
    list.append(b);
  });
  card.append(list);
  const rs = h("button", "mreset", "セーブを けす（おとなの かたへ）"); rs.type = "button";
  rs.onclick = () => { if (!confirm("レベル・クリア・とちゅうの きろくを ぜんぶ けしますか？")) return; SAVE.lap = 1; SAVE.cleared = {}; SAVE.E = null; SAVE.play = null; saveNow(); Object.assign(E, { L: 1, h: 1, streak: 0 }); showMenu(); };
  card.append(rs);
  box.append(card);
}
(function menuStyle() {
  const st = document.createElement("style");
  st.textContent = `.start.menu{background:rgba(255,248,225,.86);overflow:auto;padding:10px}
.start.menu button{font:inherit;padding:0;box-shadow:none;border-radius:0;background:none;border:none;color:inherit}
.mcard{background:#fff;border:6px solid #2B2A33;border-radius:32px;box-shadow:0 8px 0 #2B2A33;padding:16px 22px 12px;display:grid;gap:10px;justify-items:center;width:min(92%,780px)}
.mtitle{font:400 clamp(30px,5.2vw,58px) var(--display);color:#2B2A33;letter-spacing:.06em;line-height:1.1}
.mlap{font:400 clamp(15px,2.2vw,22px) var(--display);background:#FFD25E;border:4px solid #2B2A33;border-radius:999px;padding:2px 16px}
.start.menu .mbig{font:400 clamp(22px,3.4vw,34px) var(--display);padding:10px 38px;border-radius:999px;border:6px solid #2B2A33;background:#7BD389;color:#2B2A33;cursor:pointer;box-shadow:0 6px 0 #2B2A33;display:grid;gap:0;justify-items:center}
.msub{font:400 clamp(13px,1.7vw,17px) var(--display)}
.mhead{font:400 clamp(15px,2vw,20px) var(--display);color:#6b5e4f}
.mstages{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;width:100%}
@media (max-width:640px){.mstages{grid-template-columns:repeat(2,1fr)}}
.start.menu .mst{position:relative;display:grid;justify-items:center;gap:4px;padding:12px 4px 10px;border-radius:22px;border:5px solid #2B2A33;background:#FFF3D6;cursor:pointer;font-family:var(--display);color:#2B2A33;box-shadow:0 6px 0 #2B2A33}
.mst .mno{position:absolute;left:10px;top:4px;font-size:17px}
.mst .mico{font-size:clamp(30px,4.4vw,46px);line-height:1.15}
.mst .mname{font-size:clamp(14px,1.9vw,19px);white-space:nowrap}
.mst .mstat{font-size:clamp(12px,1.5vw,15px);background:#FFD25E;border-radius:999px;padding:1px 10px;border:3px solid #2B2A33;white-space:nowrap}
.start.menu .mst.locked{background:#ece7df;color:#8a8073;box-shadow:0 6px 0 #a59a8c;border-color:#a59a8c;cursor:default}
.mst.locked .mico{filter:grayscale(1);opacity:.45}.mst.locked .mstat{background:#fff;border-color:#a59a8c}
.start.menu .mreset{margin-top:4px;color:#8a8073;font-size:13px;text-decoration:underline;cursor:pointer;font-family:inherit}
.again.menuBtn{background:#fff}`;
  document.head.appendChild(st);
})();
drawBoard(); P.shima.s0 = .22; P.gao.s0 = .22; P.doshin.s0 = .3; setPiece(P.shima, "0"); setPiece(P.gao, "0"); setPiece(P.doshin, BLOCK); P.doshin.tm.closed = 1e6;
setView("board"); diceBtn.style.visibility = "visible"; showEngine(null);
showMenu();
requestAnimationFrame(frame);
