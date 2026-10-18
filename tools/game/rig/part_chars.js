/* ---------- キャラクター 10体（共通の骨組み） ----------
   どのキャラも同じ形の「部品表」を返す。動かし方は共通のコードが受け持つ。
   座標は原画（キャラクター原画案）のものをそのまま使う。 */
const ST = (sw = 6) => ({ stroke: INK, "stroke-width": sw, "stroke-linejoin": "round", "stroke-linecap": "round" });
function leg(root, x, top, w, len, fill, hoof, sw = 6) {
  const g = el("g", {}, root);
  el("rect", { x: x - w / 2, y: top, width: w, height: hoof ? len - 12 : len, rx: w * 0.44, fill, ...ST(sw) }, g);
  if (hoof) el("rect", { x: x - w / 2, y: top + len - 26, width: w, height: 26, rx: 11, fill: hoof, ...ST(sw) }, g);
  return { g, px: x, py: top + 2 };
}
function arm(root, px, py, rx, ry, fill, paw, rest, sw = 6) {
  const g = el("g", {}, root);
  el("ellipse", { cx: px, cy: py + ry * 0.9, rx, ry, fill, ...ST(sw) }, g);
  if (paw) el("ellipse", { cx: px, cy: py + ry * 1.6, rx: rx * 0.74, ry: ry * 0.25, fill: paw }, g);
  return { g, px, py, rest };
}
function eyesAt(head, list, sw = 0) {
  return list.map(([cx, cy, rx, ry]) => {
    const g = el("g", {}, head);
    el("ellipse", { cx, cy, rx, ry, fill: INK }, g);
    el("circle", { cx: cx - rx * 0.33, cy: cy - ry * 0.37, r: rx * 0.4, fill: "#FFFFFF" }, g);
    el("circle", { cx: cx + rx * 0.33, cy: cy + ry * 0.37, r: rx * 0.2, fill: "#FFFFFF" }, g);
    return { g, cx, cy };
  });
}
function happyAt(head, xs, y, half = 16, sw = 7) {
  const g = el("g", { opacity: 0, fill: "none", stroke: INK, "stroke-width": sw, "stroke-linecap": "round" }, head);
  xs.forEach(x => el("path", { d: `M${x - half} ${y + 6} Q${x} ${y - half} ${x + half} ${y + 6}` }, g));
  return g;
}
function mouthAt(head, x, top, w, sw = 5, closed) {
  const path = el("path", { fill: "#FF6F91", ...ST(sw) }, head);
  const tongue = el("ellipse", { cx: x, fill: "#FFB3C1" }, head);
  return { type: "smile", path, tongue, x, top, w, sw, closed };
}
function clipEllipse(id, cx, cy, rx, ry) { const cp = el("clipPath", { id }, defs); el("ellipse", { cx, cy, rx, ry }, cp); return `url(#${id})`; }
function ring(g, cx, cy, R, r, fill, sw = 6) {
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; el("circle", { cx: cx + Math.cos(a) * R, cy: cy + Math.sin(a) * R, r, fill, ...ST(sw) }, g); }
  el("circle", { cx, cy, r: R + 2, fill }, g);
}

function recolor(root, map) { root.querySelectorAll("*").forEach(e => { ["fill", "stroke"].forEach(a => { const v = e.getAttribute(a); if (v && map[v]) e.setAttribute(a, map[v]); }); }); }
function hideFill(root, colors) { root.querySelectorAll("*").forEach(e => { if (colors.includes(e.getAttribute("fill"))) e.setAttribute("display", "none"); }); }
// たてがみの ない がお型（くま・とら）は、あたまと からだの あいだが あいて 見えるので、くびを うめる
// くび（たてがみを けした キャラ用）：からだの うしろに おく。からだの ふちどりを かくさない（2026-10-18 ぼやけ なおし）
function neckFill(root, p, col) { const n = el("g", {}); root.insertBefore(n, root.firstChild); el("path", { d: "M156 300 Q156 236 200 232 Q244 236 244 300 Z", fill: col, stroke: INK, "stroke-width": 6, "stroke-linejoin": "round" }, n); }
// ママに する：エプロン・まつげ・リボン
function momize(root, p, col, rib, at = [262, 70]) { const bd = el("g", {}); root.insertBefore(bd, p.arms[0].g);
  el("path", { d: "M150 288 Q200 276 250 288 L268 380 Q200 396 132 380 Z", fill: col, ...ST(5) }, bd); el("path", { d: "M160 330 Q200 344 240 330", fill: "none", ...ST(4) }, bd); el("circle", { cx: 200, cy: 356, r: 9, fill: "#FFFFFF", ...ST(3) }, bd);
  (p.eyes || []).forEach(e => { const sx = e.cx < 200 ? -1 : 1; el("path", { d: `M${e.cx + sx * 16} ${e.cy - 14} l${sx * 9} -8 M${e.cx + sx * 4} ${e.cy - 20} l${sx * 4} -10`, fill: "none", ...ST(4) }, p.head.g); });
  const rb = el("g", { transform: `translate(${at[0]} ${at[1]}) rotate(20)` }, p.head.g); el("path", { d: "M0 0 L-30 -16 L-30 16 Z M0 0 L30 -16 L30 16 Z", fill: rib, ...ST(4) }, rb); el("circle", { r: 8, fill: rib, ...ST(4) }, rb); }
// はくい（おいしゃさん・はいしゃさん）
function coatOn(root, p, col) { const bd = el("g", {}); root.insertBefore(bd, p.arms[0].g);
  el("path", { d: "M134 286 Q200 270 266 286 L280 392 Q200 408 120 392 Z", fill: col, ...ST(5) }, bd); el("path", { d: "M176 282 L200 330 L224 282 M200 330 V404", fill: "none", ...ST(4) }, bd);
  el("rect", { x: 222, y: 340, width: 32, height: 26, rx: 4, fill: "none", ...ST(3) }, bd); }
const BUILD = {
  pony(root) {
    const s = ST(), B = "#D98A4E", H = "#6B4A36", T = "#FFD36E";
    const tail = el("g", {}, root); el("path", { d: "M262 338 Q322 318 324 372 Q302 394 286 368 Q292 352 262 356 Z", fill: T, ...s }, tail);
    const legs = [168, 232].map(x => leg(root, x, 360, 36, 54, "#FFF6E9", H));
    el("ellipse", { cx: 200, cy: 325, rx: 72, ry: 62, fill: B, ...s }, root);
    el("ellipse", { cx: 200, cy: 338, rx: 40, ry: 38, fill: "#FFE9CF" }, root);
    const arms = [arm(root, 132, 290, 19, 40, B, H, 20), arm(root, 268, 290, 19, 40, B, H, -20)];
    const head = el("g", {}, root);
    el("path", { d: "M92 118 Q58 170 76 242 Q100 266 114 238 Q96 180 122 118 Z", fill: T, ...s }, head);
    const ears = [[-1, 122, 124], [1, 278, 276]].map(([d, ex, px]) => { const g = el("g", {}, head); const e = el("g", { transform: `translate(${ex} 72) rotate(${d * 24})` }, g);
      el("path", { d: "M-24 34 Q-22 -30 0 -42 Q22 -30 24 34 Z", fill: B, ...s }, e); el("path", { d: "M-11 26 Q-10 -12 0 -22 Q10 -12 11 26 Z", fill: "#FFB3C1" }, e); return { g, px, py: 112 }; });
    el("ellipse", { cx: 200, cy: 172, rx: 112, ry: 108, fill: B, ...s }, head);
    el("path", { d: "M184 60 Q200 52 216 60 Q226 140 214 196 L186 196 Q174 140 184 60 Z", fill: "#FFF6E9", "clip-path": clipEllipse("c-pony", 200, 172, 112, 108) }, head);
    el("ellipse", { cx: 200, cy: 172, rx: 112, ry: 108, fill: "none", ...s }, head);
    el("ellipse", { cx: 200, cy: 236, rx: 78, ry: 52, fill: "#FFE9CF", ...s }, head);
    [172, 228].forEach(x => el("ellipse", { cx: x, cy: 214, rx: 7, ry: 5, fill: INK }, head));
    const mouth = mouthAt(head, 200, 238, 22);
    const eyes = eyesAt(head, [[156, 162, 15, 19], [244, 162, 15, 19]]);
    const happy = happyAt(head, [156, 244], 162);
    [116, 284].forEach(x => el("ellipse", { cx: x, cy: 210, rx: 14, ry: 9, fill: "#FF9FB0" }, head));
    el("path", { d: "M150 74 Q170 30 214 34 Q250 40 250 72 Q232 62 226 96 Q206 70 196 112 Q182 80 168 104 Q164 84 150 74 Z", fill: T, ...s }, head);
    return { base: 414, top: 30, tail: { g: tail, px: 262, py: 345 }, legs, arms, head: { g: head, px: 200, py: 262 }, ears, eyes, happy, mouth };
  },
  shima(root) {
    const s = ST(), H = "#4A4754";
    const tail = el("g", {}, root); el("path", { d: "M262 345 Q310 340 312 300", fill: "none", ...s, "stroke-width": 8 }, tail); el("ellipse", { cx: 314, cy: 292, rx: 14, ry: 20, fill: INK, ...s }, tail);
    const legs = [168, 232].map(x => leg(root, x, 360, 36, 54, "#FFFFFF", H));
    el("ellipse", { cx: 200, cy: 325, rx: 72, ry: 62, fill: "#FFFFFF", ...s }, root);
    const st = el("g", { "clip-path": clipEllipse("c-shima-b", 200, 325, 72, 62), fill: "none", stroke: INK, "stroke-width": 11, "stroke-linecap": "round" }, root);
    ["M120 300 q30 10 50 0", "M122 328 q30 10 48 0", "M130 356 q26 8 40 0", "M280 300 q-30 10 -50 0", "M278 328 q-30 10 -48 0", "M270 356 q-26 8 -40 0"].forEach(d => el("path", { d }, st));
    el("ellipse", { cx: 200, cy: 325, rx: 72, ry: 62, fill: "none", ...s }, root);
    const arms = [arm(root, 132, 290, 19, 40, "#FFFFFF", H, 20), arm(root, 268, 290, 19, 40, "#FFFFFF", H, -20)];
    const head = el("g", {}, root);
    const ears = [[-1, 108, 124], [1, 292, 276]].map(([d, ex, px]) => { const g = el("g", {}, head); const e = el("g", { transform: `translate(${ex} 78) rotate(${d * 28})` }, g);
      el("ellipse", { rx: 26, ry: 44, fill: "#FFFFFF", ...s }, e); el("ellipse", { cy: 4, rx: 13, ry: 28, fill: "#FFB3C1" }, e); return { g, px, py: 112 }; });
    el("path", { d: "M168 78 Q174 28 200 26 Q226 28 232 78 Z", fill: INK, ...s }, head);
    el("ellipse", { cx: 200, cy: 170, rx: 122, ry: 104, fill: "#FFFFFF", ...s }, head);
    const hs = el("g", { "clip-path": clipEllipse("c-shima-h", 200, 170, 122, 104), fill: INK }, head);
    ["M60 118 Q104 122 130 138 Q100 142 62 150 Z", "M64 176 Q98 172 122 184 Q98 192 70 204 Z", "M96 80 Q130 96 150 118 Q122 112 84 104 Z", "M340 118 Q296 122 270 138 Q300 142 338 150 Z", "M336 176 Q302 172 278 184 Q302 192 330 204 Z", "M304 80 Q270 96 250 118 Q278 112 316 104 Z"].forEach(d => el("path", { d }, hs));
    el("ellipse", { cx: 200, cy: 170, rx: 122, ry: 104, fill: "none", ...s }, head);
    el("ellipse", { cx: 200, cy: 232, rx: 80, ry: 50, fill: H, ...s }, head);
    [172, 228].forEach(x => el("ellipse", { cx: x, cy: 212, rx: 7, ry: 5, fill: INK }, head));
    const mouth = mouthAt(head, 200, 236, 22);
    const eyes = eyesAt(head, [[158, 165, 15, 19], [242, 165, 15, 19]]);
    const happy = happyAt(head, [158, 242], 165);
    [112, 288].forEach(x => el("ellipse", { cx: x, cy: 224, rx: 13, ry: 8, fill: "#FFB3C1" }, head));
    el("path", { d: "M178 72 Q200 52 222 72 Q216 100 200 110 Q184 100 178 72 Z", fill: INK, ...s }, head);
    return { base: 414, top: 26, tail: { g: tail, px: 262, py: 345 }, legs, arms, head: { g: head, px: 200, py: 262 }, ears, eyes, happy, mouth };
  },
  doshin(root) {
    const s = ST(), B = "#A9BEDD";
    const legs = [159, 241].map(x => leg(root, x, 352, 50, 62, B, null));
    el("ellipse", { cx: 200, cy: 328, rx: 92, ry: 66, fill: B, ...s }, root);
    el("ellipse", { cx: 200, cy: 342, rx: 52, ry: 40, fill: "#D3DEF0" }, root);
    const arms = [arm(root, 106, 290, 21, 42, B, null, 18), arm(root, 294, 290, 21, 42, B, null, -18)];
    const head = el("g", {}, root);
    const ears = [[66, 72, 132], [334, 328, 268]].map(([ex, ix, px]) => { const g = el("g", {}, head);
      el("ellipse", { cx: ex, cy: 168, rx: 82, ry: 102, fill: B, ...s }, g); el("ellipse", { cx: ix, cy: 172, rx: 52, ry: 72, fill: "#FFB3C1" }, g); return { g, px, py: 150 }; });
    el("ellipse", { cx: 200, cy: 170, rx: 120, ry: 108, fill: B, ...s }, head);
    const eyes = eyesAt(head, [[150, 160, 15, 19], [250, 160, 15, 19]]);
    [[132, 168], [232, 268]].forEach(([a, b]) => el("path", { d: `M${a} 160 A18 22 0 0 1 ${b} 160 Z`, fill: "#8FA6C9", ...ST(4) }, head));
    el("path", { d: "M138 184 q12 6 24 0 M238 184 q12 6 24 0", fill: "none", ...ST(3) }, head);
    [112, 288].forEach(x => el("ellipse", { cx: x, cy: 204, rx: 14, ry: 9, fill: "#FF9FB0" }, head));
    [[158, 24], [242, -24]].forEach(([x, r]) => el("ellipse", { rx: 10, ry: 22, fill: "#FFFFFF", ...ST(5), transform: `translate(${x} 240) rotate(${r})` }, head));
    const trunk = el("g", {}, head);
    el("path", { d: "M200 196 Q200 292 238 302 Q266 306 266 274", fill: "none", ...s, "stroke-width": 48 }, trunk);
    el("path", { d: "M200 196 Q200 292 238 302 Q266 306 266 274", fill: "none", stroke: B, "stroke-width": 36, "stroke-linecap": "round" }, trunk);
    el("path", { d: "M186 226 h28 M187 250 h27 M192 274 h26", fill: "none", ...ST(4) }, trunk);
    return { base: 414, top: 62, tail: null, legs, arms, head: { g: head, px: 200, py: 270 }, ears, eyes, happy: null,
      mouth: { type: "trunk", g: trunk, px: 200, py: 205 }, tempo: 0.7 };
  },
  nobbo(root) {
    const s = ST(), Y = "#FFD25E", Br = "#B9713A";
    const tail = el("g", {}, root); el("path", { d: "M262 490 Q306 486 308 452", fill: "none", ...s, "stroke-width": 8 }, tail); el("ellipse", { cx: 310, cy: 442, rx: 12, ry: 18, fill: Br, ...s }, tail);
    const legs = [170, 230].map(x => leg(root, x, 510, 36, 72, Y, "#6B4A36"));
    el("ellipse", { cx: 200, cy: 470, rx: 72, ry: 60, fill: Y, ...s }, root);
    [[156, 456, 14, 11], [246, 462, 13, 12], [200, 500, 15, 11], [164, 496, 9, 8]].forEach(([cx, cy, rx, ry]) => el("ellipse", { cx, cy, rx, ry, fill: Br }, root));
    const neck = el("g", {}, root);
    el("rect", { x: 170, y: 140, width: 60, height: 300, rx: 26, fill: Y, ...s }, neck);
    [[190, 212, 11, 13], [212, 252, 10, 12], [188, 292, 11, 12], [212, 334, 10, 13], [190, 376, 11, 12], [212, 412, 9, 10]].forEach(([cx, cy, rx, ry]) => el("ellipse", { cx, cy, rx, ry, fill: Br }, neck));
    const arms = [arm(root, 128, 436, 18, 38, Y, "#6B4A36", 18), arm(root, 272, 436, 18, 38, Y, "#6B4A36", -18)];
    const head = el("g", {}, root);
    const ears = [[118, -62, 140], [282, 62, 260]].map(([ex, r, px]) => { const g = el("g", {}, head); const e = el("g", { transform: `translate(${ex} 92) rotate(${r})` }, g);
      el("ellipse", { rx: 15, ry: 30, fill: Y, ...s }, e); el("ellipse", { cy: 2, rx: 7, ry: 18, fill: "#FFB3C1" }, e); return { g, px, py: 100 }; });
    el("path", { d: "M176 60 L172 28 M224 60 L228 28", fill: "none", ...s, "stroke-width": 12 }, head);
    [172, 228].forEach(x => el("circle", { cx: x, cy: 24, r: 11, fill: Br, ...s }, head));
    el("ellipse", { cx: 200, cy: 112, rx: 74, ry: 64, fill: Y, ...s }, head);
    el("ellipse", { cx: 200, cy: 146, rx: 50, ry: 34, fill: "#FFF1D6", ...s }, head);
    [184, 216].forEach(x => el("ellipse", { cx: x, cy: 134, rx: 5, ry: 4, fill: INK }, head));
    const mouth = mouthAt(head, 200, 150, 16, 4);
    const eyes = eyesAt(head, [[170, 98, 12, 16], [230, 98, 12, 16]]);
    const happy = happyAt(head, [170, 230], 98, 12, 6);
    [140, 260].forEach(x => el("ellipse", { cx: x, cy: 124, rx: 10, ry: 7, fill: "#FF9FB0" }, head));
    const glasses = el("g", {}, head);
    [170, 230].forEach(x => el("circle", { cx: x, cy: 98, r: 25, fill: "#FFFFFF", "fill-opacity": 0.35, ...ST(5) }, glasses));
    el("path", { d: "M195 96 Q200 92 205 96 M145 96 L128 90 M255 96 L272 90", fill: "none", ...ST(5) }, glasses);
    const glint = el("path", { d: "M156 84 L164 76 M216 84 L224 76", stroke: "#FFFFFF", "stroke-width": 5, "stroke-linecap": "round", opacity: 0 }, glasses);
    return { base: 582, top: 14, tail: { g: tail, px: 262, py: 490 }, legs, arms, head: { g: head, px: 200, py: 160 }, ears, eyes, happy, mouth,
      neck: { g: neck, bottom: 440, len: 300 }, glint };
  },
  gao(root) {
    const s = ST(), Y = "#FFC94D", M = "#C8662B";
    const tail = el("g", {}, root); el("path", { d: "M262 350 Q312 346 314 308", fill: "none", ...s, "stroke-width": 8 }, tail); el("ellipse", { cx: 316, cy: 298, rx: 14, ry: 20, fill: M, ...s }, tail);
    const legs = [168, 232].map(x => leg(root, x, 360, 36, 48, Y, null));
    el("ellipse", { cx: 200, cy: 330, rx: 72, ry: 60, fill: Y, ...s }, root);
    el("ellipse", { cx: 200, cy: 344, rx: 40, ry: 36, fill: "#FFF1D6" }, root);
    const arms = [arm(root, 118, 300, 19, 38, Y, null, 18), arm(root, 282, 300, 19, 38, Y, null, -18)];
    const head = el("g", {}, root);
    ring(head, 200, 170, 112, 34, M);
    const ears = [132, 268].map(x => { const g = el("g", {}, head); el("circle", { cx: x, cy: 102, r: 22, fill: Y, ...s }, g); el("circle", { cx: x, cy: 102, r: 10, fill: "#FFB3C1" }, g); return { g, px: x, py: 120 }; });
    el("ellipse", { cx: 200, cy: 172, rx: 92, ry: 86, fill: Y, ...s }, head);
    el("ellipse", { cx: 200, cy: 214, rx: 50, ry: 38, fill: "#FFF1D6", ...s }, head);
    el("path", { d: "M186 194 Q200 188 214 194 Q200 212 186 194 Z", fill: INK, ...s }, head);
    const mouth = mouthAt(head, 200, 218, 20, 4);
    const eyes = [[160, 165], [240, 235]].map(([cx, px]) => { const g = el("g", {}, head);
      el("ellipse", { cx, cy: 162, rx: 17, ry: 14, fill: "#FFFFFF", ...ST(4) }, g); el("circle", { cx: px === 165 ? 165 : px, cy: 165, r: 6, fill: INK }, g); return { g, cx, cy: 162 }; });
    eyes[0].g.lastChild.setAttribute("cx", 165);
    const brows = el("g", {}, head);
    el("path", { d: "M138 146 L184 161 L184 142 L138 130 Z M262 146 L216 161 L216 142 L262 130 Z", fill: Y }, brows);
    el("path", { d: "M138 146 L184 161 M262 146 L216 161", fill: "none", ...s, "stroke-width": 9 }, brows);
    const happy = happyAt(head, [160, 240], 164, 15, 7);
    [132, 268].forEach(x => el("ellipse", { cx: x, cy: 198, rx: 12, ry: 8, fill: "#FF9FB0" }, head));
    const blush = el("g", { opacity: 0 }, head);
    [128, 272].forEach(x => el("ellipse", { cx: x, cy: 196, rx: 26, ry: 14, fill: "#FF6F91", "fill-opacity": .55 }, blush));
    return { base: 408, top: 30, tail: { g: tail, px: 262, py: 350 }, legs, arms, head: { g: head, px: 200, py: 270 }, ears, eyes, happy, mouth, brows, blush };
  },
  chu(root) {
    const sw = 12, s = ST(sw), G = "#C9C5D6";
    const tail = el("g", {}, root);
    el("path", { d: "M256 356 Q340 376 372 320 Q396 276 430 300", fill: "none", ...s, "stroke-width": 26 }, tail);
    el("path", { d: "M256 356 Q340 376 372 320 Q396 276 430 300", fill: "none", stroke: "#FFB3C1", "stroke-width": 10, "stroke-linecap": "round" }, tail);
    const legs = [170, 230].map(x => { const g = el("g", {}, root); el("ellipse", { cx: x, cy: 400, rx: 26, ry: 16, fill: "#FFB3C1", ...s }, g); return { g, px: x, py: 392 }; });
    el("ellipse", { cx: 200, cy: 336, rx: 64, ry: 58, fill: G, ...s }, root);
    el("ellipse", { cx: 200, cy: 346, rx: 34, ry: 32, fill: "#F1EFF6" }, root);
    const arms = [arm(root, 146, 300, 14, 28, G, null, 30, sw), arm(root, 254, 300, 14, 28, G, null, -30, sw)];
    const head = el("g", {}, root);
    const ears = [98, 302].map(x => { const g = el("g", {}, head); el("circle", { cx: x, cy: 92, r: 62, fill: G, ...s }, g); el("circle", { cx: x, cy: 92, r: 36, fill: "#FFB3C1" }, g); return { g, px: x < 200 ? 130 : 270, py: 132 }; });
    el("ellipse", { cx: 200, cy: 184, rx: 112, ry: 98, fill: G, ...s }, head);
    el("path", { d: "M118 214 L70 204 M120 232 L74 240 M282 214 L330 204 M280 232 L326 240", fill: "none", ...s, "stroke-width": 7 }, head);
    el("ellipse", { cx: 200, cy: 212, rx: 14, ry: 10, fill: "#FF6F91" }, head);
    const mouth = mouthAt(head, 200, 234, 18, 8);
    const eyes = [[154, 158], [246, 242]].map(([cx, px]) => { const g = el("g", {}, head);
      el("circle", { cx, cy: 174, r: 25, fill: "#FFFFFF", ...ST(8) }, g); el("circle", { cx: px, cy: 178, r: 8, fill: INK }, g); return { g, cx, cy: 174 }; });
    el("path", { d: "M126 140 L166 126 M274 140 L234 126", fill: "none", ...s, "stroke-width": 9 }, head);
    const happy = happyAt(head, [154, 246], 174, 20, 9);
    return { base: 416, top: 30, tail: { g: tail, px: 256, py: 356 }, legs, arms, head: { g: head, px: 200, py: 282 }, ears, eyes, happy, mouth, sw };
  },
  pyon(root) {
    const s = ST(), P = "#FFE3EA";
    const legs = [171, 229].map(x => leg(root, x, 362, 34, 44, P, null));
    el("path", { d: "M152 286 Q200 268 248 286 L278 370 Q200 392 122 370 Z", fill: "#FF7FA0", ...s }, root);
    el("path", { d: "M176 284 Q200 304 224 284", fill: "#FFFFFF", ...ST(5) }, root);
    const arms = [arm(root, 134, 292, 18, 38, P, null, 22), arm(root, 266, 292, 18, 38, P, null, -22)];
    const head = el("g", {}, root);
    const ears = [[156, -8, 160], [244, 8, 240]].map(([ex, r, px]) => { const g = el("g", {}, head); const e = el("g", { transform: `translate(${ex} 44) rotate(${r})` }, g);
      el("ellipse", { rx: 24, ry: 66, fill: P, ...s }, e); el("ellipse", { cy: 4, rx: 11, ry: 46, fill: "#FFB3C1" }, e); return { g, px, py: 104 }; });
    el("ellipse", { cx: 200, cy: 182, rx: 110, ry: 96, fill: P, ...s }, head);
    const eyes = eyesAt(head, [[156, 172, 15, 19], [244, 172, 15, 19]]);
    el("path", { d: "M142 158 L128 148 M146 152 L136 138 M258 158 L272 148 M254 152 L264 138", fill: "none", ...ST(4) }, head);
    el("path", { d: "M190 202 Q200 196 210 202 Q200 214 190 202 Z", fill: "#FF6F91", ...ST(4) }, head);
    const mouth = mouthAt(head, 200, 222, 22, 4);
    const happy = happyAt(head, [156, 244], 172);
    [118, 282].forEach(x => el("ellipse", { cx: x, cy: 212, rx: 15, ry: 10, fill: "#FF9FB0" }, head));
    el("path", { d: "M262 96 L226 76 L230 118 Z M262 96 L298 76 L294 118 Z", fill: "#FF4F7B", ...s }, head);
    el("circle", { cx: 262, cy: 96, r: 10, fill: "#FFD36E", ...s }, head);
    return { base: 406, top: -24, tail: null, legs, arms, head: { g: head, px: 200, py: 270 }, ears, eyes, happy, mouth };
  },
  mii(root) {
    const s = ST(), L = "#B9A8D9";
    const tail = el("g", {}, root);
    el("path", { d: "M264 356 Q330 352 326 296 Q324 270 304 276", fill: "none", ...s, "stroke-width": 26 }, tail);
    el("path", { d: "M264 356 Q330 352 326 296 Q324 270 304 276", fill: "none", stroke: L, "stroke-width": 14, "stroke-linecap": "round" }, tail);
    const legs = [170, 230].map(x => leg(root, x, 362, 36, 44, L, null));
    el("ellipse", { cx: 200, cy: 328, rx: 70, ry: 60, fill: L, ...s }, root);
    el("ellipse", { cx: 200, cy: 342, rx: 38, ry: 36, fill: "#EDE6F8" }, root);
    const arms = [arm(root, 128, 296, 18, 38, L, null, 16), arm(root, 272, 296, 18, 38, L, null, -16)];
    el("path", { d: "M150 276 Q200 296 250 276 L250 290 Q200 310 150 290 Z", fill: "#FF4F7B", ...ST(5) }, root);
    el("circle", { cx: 200, cy: 304, r: 11, fill: "#FFD36E", ...ST(5) }, root);
    const head = el("g", {}, root);
    const ears = [["M92 132 L104 44 L176 86 Z", "M112 112 L116 68 L152 90 Z", 130], ["M308 132 L296 44 L224 86 Z", "M288 112 L284 68 L248 90 Z", 270]].map(([a, b, px]) => {
      const g = el("g", {}, head); el("path", { d: a, fill: L, ...s }, g); el("path", { d: b, fill: "#FFB3C1" }, g); return { g, px, py: 112 }; });
    el("ellipse", { cx: 200, cy: 176, rx: 116, ry: 98, fill: L, ...s }, head);
    const eyes = [[157, "M134 172 Q156 150 180 172 Q156 190 134 172 Z", 168], [243, "M220 172 Q244 150 266 172 Q244 190 220 172 Z", 254]].map(([cx, d, px]) => {
      const g = el("g", {}, head); el("path", { d, fill: "#FFFFFF", ...ST(4) }, g); const p = el("ellipse", { cx: px, cy: 173, rx: 8, ry: 10, fill: INK }, g); return { g, cx, cy: 172, pupil: p, px }; });
    el("path", { d: "M132 164 L182 164 M218 164 L268 164 M132 164 L118 154 M268 164 L282 154", fill: "none", ...s, "stroke-width": 6 }, head);
    el("path", { d: "M192 204 Q200 200 208 204 Q200 214 192 204 Z", fill: "#FF6F91", ...ST(4) }, head);
    const mouth = mouthAt(head, 200, 222, 18, 5, "M180 222 Q190 232 200 222 Q210 232 220 222");
    el("path", { d: "M112 206 L72 198 M112 220 L74 226 M288 206 L328 198 M288 220 L326 226", fill: "none", ...ST(4) }, head);
    el("path", { d: "M130 92 L137 108 L154 110 L141 121 L145 138 L130 129 L115 138 L119 121 L106 110 L123 108 Z", fill: "#FFD36E", ...ST(5) }, head);
    const happy = happyAt(head, [157, 243], 172, 18, 7);
    return { base: 406, top: 44, tail: { g: tail, px: 264, py: 356 }, legs, arms, head: { g: head, px: 200, py: 272 }, ears, eyes, happy, mouth };
  },
  kamejii(root) {
    const s = ST(), G = "#8CC27A";
    el("path", { d: "M306 250 Q306 230 322 230 Q338 230 338 250 M306 250 L306 410", fill: "none", ...s, "stroke-width": 16 }, root);
    el("path", { d: "M306 250 Q306 230 322 230 Q338 230 338 250 M306 250 L306 410", fill: "none", stroke: "#B9824A", "stroke-width": 7, "stroke-linecap": "round" }, root);
    const legs = [169, 231].map(x => leg(root, x, 366, 38, 40, G, null));
    el("ellipse", { cx: 200, cy: 326, rx: 90, ry: 70, fill: "#8A6A3C", ...s }, root);
    el("ellipse", { cx: 200, cy: 330, rx: 64, ry: 54, fill: "#F3E3B3", ...s }, root);
    el("path", { d: "M200 278 V382 M140 318 H260 M148 350 H252", fill: "none", ...ST(4) }, root);
    const arms = [arm(root, 116, 292, 18, 36, G, null, 18), arm(root, 288, 290, 18, 36, G, null, -14)];
    const head = el("g", {}, root);
    el("ellipse", { cx: 200, cy: 168, rx: 100, ry: 92, fill: G, ...s }, head);
    el("path", { d: "M172 104 Q200 96 228 104 M180 120 Q200 114 220 120", fill: "none", ...ST(4) }, head);
    const eyes = [160, 240].map(cx => { const g = el("g", {}, head); el("circle", { cx, cy: 170, r: 7, fill: INK }, g); return { g, cx, cy: 170 }; });
    const brows = el("g", {}, head);
    el("path", { d: "M184 150 Q160 132 130 150 Q116 162 124 178 Q150 160 186 164 Z M216 150 Q240 132 270 150 Q284 162 276 178 Q250 160 214 164 Z", fill: "#FFFFFF", ...ST(5) }, brows);
    el("path", { d: "M158 222 Q200 206 242 222 Q238 292 200 322 Q162 292 158 222 Z", fill: "#FFFFFF", ...s }, head);
    const jaw = el("ellipse", { cx: 200, cy: 238, rx: 16, ry: 2, fill: "#5A3D2A" }, head);
    el("path", { d: "M200 214 Q170 198 140 214 Q150 236 178 232 Q192 230 200 220 Q208 230 222 232 Q250 236 260 214 Q230 198 200 214 Z", fill: "#FFFFFF", ...ST(5) }, head);
    [192, 208].forEach(x => el("ellipse", { cx: x, cy: 198, rx: 4, ry: 3, fill: INK }, head));
    el("path", { d: "M186 262 Q200 270 214 262 M190 286 Q200 292 210 286", fill: "none", ...ST(3) }, head);
    return { base: 406, top: 76, tail: null, legs, arms, head: { g: head, px: 200, py: 262 }, ears: [], eyes, happy: null,
      mouth: { type: "jaw", el: jaw }, brows, tempo: 0.65 };
  },
  meebaa(root) {
    const s = ST(), W = "#FFF6E9", F = "#F2D2B6";
    const legs = [172, 228].map(x => leg(root, x, 366, 28, 42, "#6B4A36", null));
    el("ellipse", { cx: 200, cy: 330, rx: 76, ry: 60, fill: W, ...s }, root);
    const arms = [arm(root, 124, 306, 17, 34, F, null, 16), arm(root, 276, 306, 17, 34, F, null, -16)];
    el("path", { d: "M118 304 Q200 262 282 304 L270 356 Q200 326 130 356 Z", fill: "#9B7FD1", ...s }, root);
    el("circle", { cx: 200, cy: 306, r: 11, fill: "#FFD36E", ...ST(5) }, root);
    const head = el("g", {}, root);
    el("circle", { cx: 200, cy: 40, r: 30, fill: W, ...s }, head);
    ring(head, 200, 170, 112, 34, W);
    const ears = [[104, 62, 124], [296, -62, 276]].map(([ex, r, px]) => { const g = el("g", {}, head);
      el("ellipse", { rx: 14, ry: 30, fill: F, ...s, transform: `translate(${ex} 178) rotate(${r})` }, g); return { g, px, py: 176 }; });
    el("ellipse", { cx: 200, cy: 184, rx: 74, ry: 72, fill: F, ...s }, head);
    const closedEyes = el("path", { d: "M148 172 Q163 154 178 172 M222 172 Q237 154 252 172", fill: "none", ...s }, head);
    const eyes = [163, 237].map(cx => { const g = el("g", { opacity: 0 }, head); el("circle", { cx, cy: 168, r: 8, fill: INK }, g); return { g, cx, cy: 168 }; });
    el("path", { d: "M140 180 L132 186 M260 180 L268 186", fill: "none", ...ST(3) }, head);
    el("path", { d: "M192 196 Q200 192 208 196 Q200 206 192 196 Z", fill: INK, ...ST(3) }, head);
    const mouth = mouthAt(head, 200, 218, 16, 4);
    [152, 248].forEach(x => el("ellipse", { cx: x, cy: 204, rx: 13, ry: 9, fill: "#FF9FB0" }, head));
    return { base: 408, top: 10, tail: null, legs, arms, head: { g: head, px: 200, py: 272 }, ears, eyes, happy: null, mouth, closedEyes, noBlink: true };
  },  // ---------- おみせの 店員さん（学校の友だちの 家族）と、てんこうせい こん ----------
  pyonmama(root) { // ぴょんの おかあさん（パンや）：エプロンと 三角きん
    const p = BUILD.pyon(root); recolor(root, { "#FFE3EA": "#FFF2E8", "#FF7FA0": "#8FB8E8" }); hideFill(p.head.g, ["#FF4F7B", "#FFD36E"]);
    const bd = el("g", {}); root.insertBefore(bd, p.arms[0].g); el("path", { d: "M160 300 Q200 290 240 300 L262 372 Q200 388 138 372 Z", fill: "#FFFFFF", ...ST(5) }, bd); el("path", { d: "M176 330 h48", fill: "none", ...ST(4) }, bd);
    el("path", { d: "M104 128 Q200 52 296 128 Q250 112 200 112 Q150 112 104 128 Z", fill: "#FFFFFF", ...ST(6) }, p.head.g);
    el("path", { d: "M138 160 l-10 -8 M262 160 l10 -8", fill: "none", ...ST(4) }, p.head.g);
    return p; },
  gaojii(root) { // がおの おじいちゃん（やおや）：白い たてがみ・めがね・ひげ・はちまき・前かけ
    const p = BUILD.gao(root); recolor(root, { "#C8662B": "#C9C1B6", "#FFC94D": "#F0C978" }); p.brows.innerHTML = ""; el("path", { d: "M134 136 Q160 122 186 138 M214 138 Q240 122 266 136", fill: "none", stroke: "#FFFFFF", "stroke-width": 12, "stroke-linecap": "round" }, p.brows); el("path", { d: "M134 136 Q160 122 186 138 M214 138 Q240 122 266 136", fill: "none", ...ST(3) }, p.brows);
    const bd = el("g", {}); root.insertBefore(bd, p.arms[0].g); el("path", { d: "M138 330 Q200 316 262 330 L268 394 Q200 408 132 394 Z", fill: "#5BA34D", ...ST(5) }, bd); el("text", { x: 200, y: 376, "text-anchor": "middle", "font-family": "Zen Maru Gothic, sans-serif", "font-weight": 700, "font-size": 30, fill: "#FFFFFF" }, bd).textContent = "やおや";
    el("path", { d: "M120 118 Q200 92 280 118 L276 136 Q200 112 124 136 Z", fill: "#FFFFFF", ...ST(5) }, p.head.g); el("path", { d: "M276 124 l22 -12 l4 20 Z", fill: "#FFFFFF", ...ST(4) }, p.head.g);
    [160, 240].forEach(x => el("circle", { cx: x, cy: 163, r: 26, fill: "#FFFFFF", "fill-opacity": .3, ...ST(5) }, p.head.g)); el("path", { d: "M186 160 Q200 154 214 160", fill: "none", ...ST(5) }, p.head.g);
    el("path", { d: "M200 208 Q182 212 170 226 Q186 224 200 216 Q214 224 230 226 Q218 212 200 208 Z", fill: "#FFFFFF", ...ST(4) }, p.head.g);
    p.tempo = .8; return p; },
  miibaa(root) { // みいの おばあちゃん（おかしや）：めがね・ショール
    const p = BUILD.mii(root); recolor(root, { "#B9A8D9": "#CFC6D8", "#EDE6F8": "#F4F0F8", "#FF4F7B": "#E89BB8" }); hideFill(p.head.g, ["#FFD36E"]);
    const bd = el("g", {}); root.insertBefore(bd, p.arms[0].g); el("path", { d: "M126 286 Q200 318 274 286 L282 318 Q200 352 118 318 Z", fill: "#F7A8C4", ...ST(5) }, bd); el("path", { d: "M150 300 l6 12 M176 308 l4 12 M224 308 l-4 12 M250 300 l-6 12", fill: "none", ...ST(3) }, bd);
    [157, 243].forEach(x => el("circle", { cx: x, cy: 172, r: 30, fill: "#FFFFFF", "fill-opacity": .3, ...ST(5) }, p.head.g)); el("path", { d: "M187 170 Q200 162 213 170", fill: "none", ...ST(5) }, p.head.g);
    el("circle", { cx: 200, cy: 72, r: 26, fill: "#CFC6D8", ...ST(5) }, p.head.g);
    p.tempo = .8; return p; },
  doshinpapa(root) { // どしんの おとうさん（レジ）：ぼうしと 前かけ
    const p = BUILD.doshin(root); recolor(root, { "#A9BEDD": "#93A8C8", "#D3DEF0": "#C4D1E6" });
    const bd = el("g", {}); root.insertBefore(bd, p.arms[0].g); el("path", { d: "M126 300 Q200 280 274 300 L280 380 Q200 400 120 380 Z", fill: "#3E9BD6", ...ST(5) }, bd); el("rect", { x: 216, y: 318, width: 48, height: 26, rx: 5, fill: "#FFFFFF", ...ST(4) }, bd);
    el("path", { d: "M110 96 Q200 30 290 96 L290 108 L110 108 Z", fill: "#3E9BD6", ...ST(6) }, p.head.g); el("path", { d: "M180 108 Q230 104 300 122 L296 132 Q232 118 176 120 Z", fill: "#2E7DB5", ...ST(5) }, p.head.g);
    return p; },
  kon(root) { // きつねの こん（がっこう2の てんこうせい）
    const s = ST(), O = "#F29F4C", W = "#FFF6E9";
    const tail = el("g", {}, root);
    el("path", { d: "M258 360 Q340 380 352 300 Q358 250 322 238 Q300 280 300 312 Q290 340 258 344 Z", fill: O, ...s }, tail);
    el("path", { d: "M322 238 Q358 250 352 300 Q336 288 318 272 Q314 254 322 238 Z", fill: W, ...ST(4) }, tail);
    const legs = [170, 230].map(x => leg(root, x, 362, 34, 44, "#7A4A2A", null));
    el("ellipse", { cx: 200, cy: 328, rx: 68, ry: 58, fill: O, ...s }, root);
    el("ellipse", { cx: 200, cy: 342, rx: 36, ry: 34, fill: W }, root);
    const arms = [arm(root, 130, 296, 18, 36, O, "#7A4A2A", 16), arm(root, 270, 296, 18, 36, O, "#7A4A2A", -16)];
    el("path", { d: "M150 278 Q200 300 250 278 L240 300 Q200 318 160 300 Z", fill: "#7CC36A", ...ST(5) }, root); el("path", { d: "M214 300 l16 30 l-26 -8 Z", fill: "#7CC36A", ...ST(4) }, root);
    const head = el("g", {}, root);
    const ears = [["M98 150 L112 40 L182 104 Z", "M112 128 L118 70 L160 106 Z", 132], ["M302 150 L288 40 L218 104 Z", "M288 128 L282 70 L240 106 Z", 268]].map(([a, b, px]) => {
      const g = el("g", {}, head); el("path", { d: a, fill: O, ...s }, g); el("path", { d: b, fill: "#5A3A2A" }, g); return { g, px, py: 118 }; });
    el("ellipse", { cx: 200, cy: 178, rx: 114, ry: 96, fill: O, ...s }, head);
    el("path", { d: "M92 190 Q140 196 168 176 Q200 196 232 176 Q260 196 308 190 Q290 266 200 274 Q110 266 92 190 Z", fill: W, "clip-path": clipEllipse("c-kon", 200, 178, 114, 96) }, head);
    el("ellipse", { cx: 200, cy: 178, rx: 114, ry: 96, fill: "none", ...s }, head);
    const eyes = eyesAt(head, [[156, 166, 13, 18], [244, 166, 13, 18]]);
    el("path", { d: "M188 204 Q200 196 212 204 Q200 216 188 204 Z", fill: INK, ...ST(4) }, head);
    const mouth = mouthAt(head, 200, 224, 18, 4, "M182 222 Q191 232 200 222 Q209 232 218 222");
    const happy = happyAt(head, [156, 244], 166);
    [122, 278].forEach(x => el("ellipse", { cx: x, cy: 206, rx: 13, ry: 8, fill: "#FF9FB0" }, head));
    el("path", { d: "M176 96 Q190 80 200 96 Q210 80 224 96", fill: "none", ...ST(5) }, head);
    return { base: 406, top: 40, tail: { g: tail, px: 258, py: 350 }, legs, arms, head: { g: head, px: 200, py: 272 }, ears, eyes, happy, mouth };
  },
  mama(root) { // しまの ママ（とうこう）：エプロン・リボン・まつげ
    const p = BUILD.shima(root);
    const bd = el("g", {}); root.insertBefore(bd, p.arms[0].g); el("path", { d: "M150 288 Q200 276 250 288 L268 380 Q200 396 132 380 Z", fill: "#FF9FB8", ...ST(5) }, bd);
    el("path", { d: "M160 330 Q200 344 240 330", fill: "none", ...ST(4) }, bd); el("circle", { cx: 200, cy: 356, r: 9, fill: "#FFFFFF", ...ST(3) }, bd);
    const rb = el("g", { transform: "translate(250 64) rotate(20)" }, p.head.g); el("path", { d: "M0 0 L-34 -18 L-34 18 Z M0 0 L34 -18 L34 18 Z", fill: "#FF6F91", ...ST(4) }, rb); el("circle", { r: 9, fill: "#FF6F91", ...ST(4) }, rb);
    [[140, 150], [126, 156], [260, 150], [274, 156]].forEach(([x, y]) => el("path", { d: `M${x} ${y} l${x < 200 ? -8 : 8} -8`, fill: "none", ...ST(4) }, p.head.g));
    return p; },
  // みんなで あそぶ ときの 「じぶんの ママ」（2026-10-18）：がお・みい・ちゅうの おかあさん
  gaomama(root) { // がおの ママ（らいおん）：たてがみ なし・オレンジの エプロン・まつげ
    const p = BUILD.gao(root); hideFill(root, ["#C8662B"]); if (p.brows) p.brows.innerHTML = ""; neckFill(root, p, "#FFC94D"); momize(root, p, "#FFB36B", "#FF6F91"); p.tempo = .95; return p; },
  miimama(root) { // みいの ママ（ねこ）：すこし こい むらさき・みずいろの エプロン・しんじゅの くびかざり
    const p = BUILD.mii(root); recolor(root, { "#B9A8D9": "#A897CF", "#FF4F7B": "#FFFFFF" }); hideFill(p.head.g, ["#FFD36E"]); momize(root, p, "#9FC8F0", "#B98AE0");
    [160, 180, 200, 220, 240].forEach((x, i) => el("circle", { cx: x, cy: 286 + Math.abs(i - 2) * -4 + 8, r: 7, fill: "#FFFFFF", ...ST(3) }, root)); p.tempo = .95; return p; },
  chumama(root) { // ちゅうの ママ（ねずみ）：きいろの エプロン・みみに リボン
    const p = BUILD.chu(root); momize(root, p, "#FFE07A", "#FF6F91", [98, 40]); p.tempo = .95; return p; },
  // びょういん・はいしゃさん（2026-10-18）：いぬの わんこせんせい（おいしゃさん）・ビーバーの ビバせんせい（はいしゃさん）・ひよこの ぴよこさん（かんごしさん）
  wanko(root) { const p = BUILD.gao(root); hideFill(root, ["#C8662B"]); if (p.brows) p.brows.innerHTML = ""; recolor(root, { "#FFC94D": "#E3B47C", "#FFF1D6": "#FFF6E9" });
    neckFill(root, p, "#E3B47C"); p.ears.forEach(e => e.g.setAttribute("display", "none"));
    [[104, 20], [296, -20]].forEach(([x, r]) => el("ellipse", { cx: x, cy: 176, rx: 28, ry: 60, fill: "#8B5A3C", ...ST(6), transform: `rotate(${r} ${x} 150)` }, p.head.g));
    coatOn(root, p, "#FFFFFF"); const st = el("g", {}); root.insertBefore(st, p.arms[0].g);
    el("path", { d: "M170 288 Q158 334 188 350 M230 288 Q242 334 212 350", fill: "none", stroke: "#4A4A58", "stroke-width": 7, "stroke-linecap": "round" }, st); el("circle", { cx: 200, cy: 356, r: 13, fill: "#C9D3DE", ...ST(4) }, st);
    p.tempo = .9; return p; },
  biba(root) { const p = BUILD.gao(root); hideFill(root, ["#C8662B"]); if (p.brows) p.brows.innerHTML = ""; recolor(root, { "#FFC94D": "#A0693F", "#FFF1D6": "#E9C9A0", "#FFB3C1": "#D9A07A" });
    neckFill(root, p, "#A0693F"); p.tail.g.setAttribute("display", "none");
    const tl = el("g", {}); root.insertBefore(tl, root.firstChild); el("ellipse", { cx: 300, cy: 380, rx: 46, ry: 22, fill: "#5E3B22", ...ST(6), transform: "rotate(-20 300 380)" }, tl);
    [0, 1].forEach(i => el("rect", { x: 189 + i * 12, y: 222, width: 11, height: 18, rx: 3, fill: "#FFFFFF", ...ST(3) }, p.head.g));
    coatOn(root, p, "#BFE3F5");
    el("path", { d: "M108 124 Q200 74 292 124", fill: "none", stroke: "#4A4A58", "stroke-width": 8 }, p.head.g); el("circle", { cx: 200, cy: 98, r: 22, fill: "#E8EEF4", ...ST(5) }, p.head.g); el("circle", { cx: 200, cy: 98, r: 8, fill: "#4A4A58" }, p.head.g);
    p.tempo = .95; return p; },
  piyoko(root) { const p = BUILD.chu(root); recolor(root, { "#C9C5D6": "#FFE066", "#F1EFF6": "#FFF6C2", "#FFB3C1": "#FFA94D" });
    p.ears.forEach(e => e.g.setAttribute("display", "none")); if (p.tail) p.tail.g.setAttribute("display", "none");
    p.head.g.querySelectorAll("path").forEach(e => { const d = e.getAttribute("d") || ""; if (d.startsWith("M118 214") || d.startsWith("M126 140")) e.setAttribute("display", "none"); });
    p.head.g.querySelectorAll("ellipse").forEach(e => { if (e.getAttribute("fill") === "#FF6F91") e.setAttribute("display", "none"); });
    el("path", { d: "M182 200 L218 200 L200 226 Z", fill: "#FF9F1C", ...ST(5) }, p.head.g);
    el("path", { d: "M194 88 Q186 60 202 66 Q214 54 210 86", fill: "#FFE066", ...ST(5) }, p.head.g);
    const cap = el("g", {}, p.head.g); el("path", { d: "M146 98 L254 98 L240 62 L160 62 Z", fill: "#FFFFFF", ...ST(6) }, cap); el("path", { d: "M200 68 V92 M188 80 H212", stroke: "#E8473C", "stroke-width": 7 }, cap);
    const bd = el("g", {}); root.insertBefore(bd, p.arms[0].g); el("path", { d: "M160 296 Q200 286 240 296 L252 380 Q200 394 148 380 Z", fill: "#FFC2D1", ...ST(5) }, bd);
    p.tempo = 1.05; return p; },
  ookami(root) { // あやしい おおかみ（とうこう）：サングラス・ぼうし・コート
    const p = BUILD.kon(root); recolor(root, { "#F29F4C": "#8E8E9E", "#FFF6E9": "#E6E6EE", "#7CC36A": "#4A4A58", "#7A4A2A": "#4A4A58" });
    const bd = el("g", {}); root.insertBefore(bd, p.arms[0].g); el("path", { d: "M134 290 Q200 270 266 290 L276 392 Q200 404 124 392 Z", fill: "#5E5A50", ...ST(5) }, bd); el("path", { d: "M200 282 V398", fill: "none", ...ST(4) }, bd);
    [156, 244].forEach(x => el("ellipse", { cx: x, cy: 166, rx: 36, ry: 26, fill: "#2B2A33", ...ST(5) }, p.head.g)); el("path", { d: "M192 162 H208", fill: "none", ...ST(6) }, p.head.g);
    el("path", { d: "M96 108 Q200 70 304 108 L300 122 Q200 96 100 122 Z", fill: "#3A3A46", ...ST(6) }, p.head.g); el("path", { d: "M130 106 Q140 30 200 30 Q260 30 270 106 Z", fill: "#3A3A46", ...ST(6) }, p.head.g);
    el("path", { d: "M136 92 Q200 74 264 92", fill: "none", stroke: "#B0303A", "stroke-width": 12 }, p.head.g);
    p.tempo = .9; return p; },
  ojisan(root) { // くるまの うんてんしゅさん（げこう）：ちゃいろの たてがみ・ぼうし・シャツ
    const p = BUILD.gao(root); recolor(root, { "#C8662B": "#7A5236", "#FFC94D": "#E9C08A" }); if (p.brows) p.brows.innerHTML = "";
    const bd = el("g", {}); root.insertBefore(bd, p.arms[0].g); el("path", { d: "M134 296 Q200 280 266 296 L272 384 Q200 400 128 384 Z", fill: "#7FA7D9", ...ST(5) }, bd); el("path", { d: "M184 290 L200 318 L216 290", fill: "none", ...ST(4) }, bd);
    el("path", { d: "M112 112 Q200 40 288 112 L288 124 L112 124 Z", fill: "#5BA34D", ...ST(6) }, p.head.g); el("path", { d: "M200 124 Q260 120 314 136 L310 146 Q256 134 196 136 Z", fill: "#4A8A3E", ...ST(5) }, p.head.g);
    p.tempo = .95; return p; },
  // ゆうごはん（2026-10-19）：まるシマの パパ・がおの パパ・がおの おにいちゃん
  papa(root) { // まるシマの パパ（しまうま）：みどりの シャツ・ネクタイ・ふとい まゆ・くちひげ
    const p = BUILD.shima(root);
    const bd = el("g", {}); root.insertBefore(bd, p.arms[0].g); el("path", { d: "M134 288 Q200 272 266 288 L274 386 Q200 402 126 386 Z", fill: "#7BC4A0", ...ST(5) }, bd);
    el("path", { d: "M180 288 L200 306 L220 288", fill: "#FFFFFF", ...ST(4) }, bd); el("path", { d: "M192 306 L208 306 L214 360 L200 374 L186 360 Z", fill: "#3E6FD6", ...ST(4) }, bd);
    [[160, 1], [240, -1]].forEach(([x, k]) => el("path", { d: `M${x - 26 * k} ${128} Q${x} ${114} ${x + 26 * k} ${130}`, fill: "none", stroke: INK, "stroke-width": 11, "stroke-linecap": "round" }, p.head.g));
    el("path", { d: "M170 212 Q186 202 200 210 Q214 202 230 212 Q214 220 200 214 Q186 220 170 212 Z", fill: INK }, p.head.g);
    p.tempo = .92; return p; },
  gaopapa(root) { // がおの パパ（らいおん）：こい たてがみ・あかい シャツ・ひげ
    const p = BUILD.gao(root); recolor(root, { "#C8662B": "#9C4A1E" });
    const bd = el("g", {}); root.insertBefore(bd, p.arms[0].g); el("path", { d: "M134 296 Q200 280 266 296 L272 388 Q200 402 128 388 Z", fill: "#E8735A", ...ST(5) }, bd); el("path", { d: "M182 292 L200 318 L218 292", fill: "none", ...ST(4) }, bd);
    el("path", { d: "M176 214 Q200 204 224 214 Q212 226 200 220 Q188 226 176 214 Z", fill: "#9C4A1E", ...ST(3) }, p.head.g);
    p.tempo = .9; return p; },
  gaonii(root) { // がおの おにいちゃん（らいおん）：みじかい たてがみ・ぼうしを うしろむき・きいろの シャツ
    const p = BUILD.gao(root); recolor(root, { "#C8662B": "#E08A3A" });
    const bd = el("g", {}); root.insertBefore(bd, p.arms[0].g); el("path", { d: "M138 292 Q200 276 262 292 L270 384 Q200 400 130 384 Z", fill: "#5BA34D", ...ST(5) }, bd); el("text", { x: 200, y: 360, "text-anchor": "middle", "font-family": "Zen Maru Gothic, sans-serif", "font-weight": 700, "font-size": 34, fill: "#FFFFFF" }, bd).textContent = "7";
    el("path", { d: "M120 104 Q200 40 280 104 L280 116 L120 116 Z", fill: "#3E6FD6", ...ST(6) }, p.head.g); el("path", { d: "M120 116 Q90 110 66 124 L70 134 Q96 124 124 128 Z", fill: "#2E57AE", ...ST(5) }, p.head.g);
    p.tempo = 1.0; return p; },
  onii(root) { // まるシマの おにいちゃん（おうち1）：あおい シャツ・めがね。すこし せが たかい
    const p = BUILD.shima(root);
    const bd = el("g", {}); root.insertBefore(bd, p.arms[0].g); el("path", { d: "M138 290 Q200 274 262 290 L270 384 Q200 400 130 384 Z", fill: "#5B8DEF", ...ST(5) }, bd); el("path", { d: "M180 292 Q200 310 220 292", fill: "none", ...ST(4) }, bd);
    const gl = el("g", {}, p.head.g); const [a, b] = p.eyes;
    [a, b].forEach(e => el("rect", { x: e.cx - 30, y: e.cy - 24, width: 60, height: 48, rx: 14, fill: "#FFFFFF33", ...ST(6) }, gl)); el("path", { d: `M${a.cx + 30} ${a.cy - 4} Q${(a.cx + b.cx) / 2} ${a.cy - 16} ${b.cx - 30} ${b.cy - 4}`, fill: "none", ...ST(5) }, gl);
    p.tempo = .95; return p; },
  tora(root) { // とらの とらお（ステージの 場面で ライバルの かわりに 出る）：オレンジに くろい しま
    const p = BUILD.gao(root); hideFill(root, ["#C8662B"]); const tip = p.tail.g.lastChild; tip.removeAttribute("display"); tip.setAttribute("fill", "#F7A23B");
    recolor(root, { "#FFC94D": "#F7A23B" }); const K = { fill: "none", stroke: INK, "stroke-width": 9, "stroke-linecap": "round" };
    const sh = el("g", {}, p.head.g); ["M184 90 L190 118", "M200 86 V120", "M216 90 L210 118", "M110 170 L134 176", "M112 192 L134 192", "M290 170 L266 176", "M288 192 L266 192"].forEach(d => el("path", { d, ...K }, sh));
    const bd = el("g", {}); root.insertBefore(bd, p.arms[0].g); ["M136 312 Q150 318 154 330", "M134 340 Q148 344 152 354", "M264 312 Q250 318 246 330", "M266 340 Q252 344 248 354"].forEach(d => el("path", { d, ...K, "stroke-width": 8 }, bd));
    el("path", { d: "M306 300 L326 306", ...K, "stroke-width": 6 }, p.tail.g); neckFill(root, p, "#F7A23B");
    return p; },
  kuma(root) { // くまの くまた（ステージの 場面で ライバルの かわりに 出る）：ちゃいろ・まるい みみ
    const p = BUILD.gao(root); hideFill(root, ["#C8662B"]); recolor(root, { "#FFC94D": "#A9744A", "#FFF1D6": "#EBCFA8", "#FFB3C1": "#E3A982" }); if (p.brows) p.brows.innerHTML = "";
    const tip = p.tail.g; tip.setAttribute("display", "none"); neckFill(root, p, "#A9744A");
    p.tempo = .92; return p; },
  panna(root) { // ぱんだの ぱんな（ともだちの いえ）：しろい からだ・くろい みみと てあし・めの まわりが くろい・あかい リボン
    const p = BUILD.gao(root); hideFill(root, ["#C8662B"]); if (p.brows) p.brows.innerHTML = ""; p.tail.g.setAttribute("display", "none");
    recolor(root, { "#FFC94D": "#FFFFFF", "#FFF1D6": "#FFFFFF" }); const K = "#2B2A33";
    p.arms.forEach(a => a.g.firstChild.setAttribute("fill", K)); p.legs.forEach(l => l.g.firstChild.setAttribute("fill", K));
    p.ears.forEach(e => { e.g.firstChild.setAttribute("fill", K); e.g.lastChild.setAttribute("display", "none"); });
    p.eyes.forEach(e => { const pt = el("ellipse", { cx: e.cx + (e.cx < 200 ? -4 : 4), cy: 160, rx: 28, ry: 24, fill: K, transform: `rotate(${e.cx < 200 ? -18 : 18} ${e.cx} 160)` }); p.head.g.insertBefore(pt, e.g); });
    const rb = el("g", { transform: "translate(262 96) rotate(24)" }, p.head.g); el("path", { d: "M0 0 L-30 -16 L-30 16 Z M0 0 L30 -16 L30 16 Z", fill: "#FF6F91", ...ST(4) }, rb); el("circle", { r: 8, fill: "#FF6F91", ...ST(4) }, rb);
    neckFill(root, p, "#FFFFFF"); p.tempo = .95; return p; },
  pannamama(root) { // ぱんなの おかあさん：みどりの エプロン
    const p = BUILD.panna(root); const rb = p.head.g.lastChild; rb.setAttribute("display", "none");
    const bd = el("g", {}); root.insertBefore(bd, p.arms[0].g); el("path", { d: "M146 290 Q200 276 254 290 L270 384 Q200 400 130 384 Z", fill: "#9FD68A", ...ST(5) }, bd); el("path", { d: "M160 332 Q200 346 240 332", fill: "none", ...ST(4) }, bd);
    [[140, 150], [126, 156], [260, 150], [274, 156]].forEach(([x, y]) => el("path", { d: `M${x} ${y} l${x < 200 ? -8 : 8} -8`, fill: "none", ...ST(4) }, p.head.g));
    p.tempo = .9; return p; },
  omawari(root) { // おまわりさん（げこう）：こんの せいふく・ぼうし
    const p = BUILD.doshin(root); recolor(root, { "#A9BEDD": "#B8C2CE", "#D3DEF0": "#DCE2EA" });
    const bd = el("g", {}); root.insertBefore(bd, p.arms[0].g); el("path", { d: "M118 296 Q200 270 282 296 L288 390 Q200 410 112 390 Z", fill: "#2E4A7A", ...ST(5) }, bd);
    el("path", { d: "M200 280 V400", fill: "none", stroke: "#FFD25E", "stroke-width": 4 }, bd); [312, 346, 380].forEach(y => el("circle", { cx: 200, cy: y, r: 6, fill: "#FFD25E", ...ST(3) }, bd));
    el("path", { d: "M104 100 Q200 20 296 100 L296 116 L104 116 Z", fill: "#2E4A7A", ...ST(6) }, p.head.g); el("path", { d: "M100 116 Q200 104 300 116 L300 132 Q200 120 100 132 Z", fill: "#1E2E50", ...ST(5) }, p.head.g);
    el("circle", { cx: 200, cy: 84, r: 16, fill: "#FFD25E", ...ST(4) }, p.head.g);
    return p; },
};

const NAMES = { pony: "ぽにー", shima: "まるシマ", doshin: "どしん", nobbo: "のっぽ", gao: "がお", chu: "ちゅう", pyon: "ぴょん", mii: "みい", kamejii: "かめじい", meebaa: "めえばあ",
  pyonmama: "ぴょんの おかあさん", gaojii: "がおの おじいちゃん", miibaa: "みいの おばあちゃん", doshinpapa: "どしんの おとうさん", papa: "パパ", gaopapa: "がおの パパ", gaonii: "がおの おにいちゃん", kon: "こん", panna: "ぱんな", pannamama: "ぱんなの おかあさん", mama: "ママ", gaomama: "がおの ママ", miimama: "みいの ママ", chumama: "ちゅうの ママ", wanko: "わんこせんせい", biba: "ビバせんせい", piyoko: "ぴよこさん", ookami: "しらない ひと", ojisan: "うんてんしゅさん", omawari: "おまわりさん", tora: "とらお", kuma: "くまた", onii: "おにいちゃん" };
const LINES = { pony: "きょねん、うみに いったね", shima: "やったー！ いえたね！", doshin: "どいて、あげるよ", nobbo: "それは、ずかんに のって いますよ", gao: "つぎは、まけないぞ",
  chu: "こ、こわかったよう", pyon: "いっしょに あそぼう！", mii: "ふーん。まあまあ じゃない", kamejii: "よく いえましたね", meebaa: "いらっしゃいませ" };

function makeChar(kind) {
  const root = el("g", {}, charLayer);
  const p = BUILD[kind](root);
  const tempo = p.tempo || 1;
  const sp = (v, k, d) => new Spring(v, k * tempo * tempo, d * tempo);
  return Object.assign(p, {
    kind, root, x: 0, y: 0, s: 1, tempo,
    jumpY: 0, jumpV: 0, squash: sp(1, 260, 12), lean: sp(0, 90, 9), headRot: sp(0, 120, 11), earL: sp(0, 200, 10), earR: sp(0, 200, 10),
    armL: sp(0, 140, 11), armR: sp(0, 140, 11), eyeScale: sp(1, 300, 18), mouthOpen: sp(0, 400, 24), dx: new Spring(0, 40, 9), lift: sp(0, 120, 12),
    headY: sp(0, 160, 13), eyeX: sp(0, 220, 18), eyeY: sp(0, 220, 18),
    blink: 1, nextBlink: 1 + Math.random() * 3, happyOn: false, roundMouth: false, listening: false, speakingLevel: 0, wave: 0,
    tm: {}, spinDur: 0.8, idleAt: 6 + Math.random() * 6, t: Math.random() * 10,
  });
}
function place(c, cx, base, s) { c.s = s; c.x = cx - 200 * s; c.y = base - c.base * s; }

function drawChar(c, dt, walking) {
  c.t += dt;
  const m = motion, T = c.tempo, tm = c.tm;
  for (const k in tm) { tm[k] -= dt; if (tm[k] <= 0) delete tm[k]; }
  if (c.jumpY < 0 || c.jumpV < 0) {
    c.jumpV += 3200 * dt; c.jumpY += c.jumpV * dt;
    if (c.jumpY >= 0) { c.jumpY = 0; c.squash.vel -= 2.2 * Math.min(1, Math.abs(c.jumpV) / 900); c.jumpV = 0; blip(180 / Math.sqrt(c.s), 90 / Math.sqrt(c.s), .05); }
  }
  [c.squash, c.lean, c.headRot, c.earL, c.earR, c.armL, c.armR, c.eyeScale, c.mouthOpen, c.dx, c.lift, c.headY, c.eyeX, c.eyeY].forEach(s => s.step(dt));
  if (!c.noBlink) {
    c.nextBlink -= dt;
    if (c.nextBlink < 0) { c.blink = 0; c.nextBlink = 2 + Math.random() * 3.5; if (Math.random() < .2) c.nextBlink = .18; }
    c.blink = Math.min(1, c.blink + dt * 7 * T);
  }
  let blinkS = c.blink < .5 ? 1 - c.blink * 1.8 : (c.blink - .5) * 2 * .9 + .1;
  if (tm.closed) blinkS = 0.08;
  if (tm.squint) blinkS = Math.min(blinkS, 0.35);
  const run = !!tm.run || walking;
  const walkPhase = run ? Math.sin(c.t * (tm.run ? 17 : 9) * T) : 0;
  let bob = run ? -Math.abs(walkPhase) * (tm.run ? 22 : 14) * m : 0;
  let headX = (c.listening ? Math.sin(c.t * 3) * 3 : 0) + c.speakingLevel * 3 * Math.sin(c.t * 18);
  let headYx = 0, leanX = 0, sqX = 0, dxX = 0, armLx = 0, armRx = 0, mouthX = 0;
  if (tm.shake) headX += Math.sin(c.t * 16) * 15;
  if (tm.nod) headYx += Math.abs(Math.sin(c.t * 7)) * 18;
  if (tm.shiver) dxX += Math.sin(c.t * 70) * 5;
  if (tm.dance) { const b = Math.sin(c.t * 7.3); leanX += b * 12; armLx += 70 + b * 50; armRx += -70 + b * 50; sqX += Math.abs(b) * 0.06; }
  if (tm.laugh) { sqX += Math.sin(c.t * 22) * 0.05; mouthX = 0.45 + 0.3 * Math.sin(c.t * 22); }
  if (tm.look) headX += Math.sin(c.t * 2.6) * 7;
  if (tm.pump) armRx += Math.sin(c.t * 14) * 28;
  if (tm.shy) leanX += Math.sin(c.t * 4) * 5;
  if (tm.tiptoe) bob += -Math.abs(Math.sin(c.t * 6)) * 10 * m;
  if (tm.clap) { const a = -40 + Math.sin(c.t * 7) * 18; armLx += a; armRx -= a; }
  let spinA = 0;
  if (tm.spin) { const p = Math.max(0, Math.min(1, 1 - tm.spin / c.spinDur)); spinA = 360 * p * p * (3 - 2 * p) * (c.spinTurns || 1); }
  const breathe = Math.sin(c.t * 2.2 * T) * 0.014 * m;
  const sq = 1 + (c.squash.v - 1 + sqX) * m, sx = 1 / Math.sqrt(sq), sy = sq + breathe;
  const jy = c.jumpY * m + bob;
  c.root.setAttribute("transform", `translate(${(c.x + (c.dx.v + dxX) * m).toFixed(1)} ${c.y}) scale(${c.s}) translate(0 ${jy.toFixed(1)}) ${rot(spinA, 200, c.base - 180)} ${rot((c.lean.v + leanX) * m, 200, c.base)} translate(200 ${c.base}) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(-200 ${-c.base})`);
  let headUp = 0;
  if (c.neck) { const L = c.neck.len, k = (L + c.lift.v * m) / L; c.neck.g.setAttribute("transform", `translate(200 ${c.neck.bottom}) scale(1 ${k.toFixed(3)}) translate(-200 ${-c.neck.bottom})`); headUp = c.lift.v * m; }
  c.head.g.setAttribute("transform", `translate(0 ${(-headUp + (c.headY.v + headYx) * m).toFixed(1)}) ${rot((c.headRot.v + headX) * m, c.head.px, c.head.py)}`);
  if (c.tail) { const amp = tm.wag ? 28 : 10, spd = tm.wag ? 12 : 2.6; c.tail.g.setAttribute("transform", rot(Math.sin(c.t * spd) * amp * m, c.tail.px, c.tail.py)); }
  c.legs.forEach((l, i) => l.g.setAttribute("transform", rot((i ? -1 : 1) * walkPhase * 12 * m, l.px, l.py)));
  const waveA = c.wave > 0 ? Math.sin(c.t * 14) * 22 : 0;
  c.arms.forEach((a, i) => { const off = i ? c.armR.v + waveA + armRx : c.armL.v + armLx; a.g.setAttribute("transform", rot(a.rest + off * m, a.px, a.py)); });
  const flap = tm.clap && c.kind === "doshin" ? Math.sin(c.t * 7) * 14 : 0;
  c.ears.forEach((e, i) => e.g.setAttribute("transform", rot((i ? c.earR.v - flap : c.earL.v + flap) * m, e.px, e.py)));
  const es = c.eyeScale.v, ex = c.eyeX.v, ey = c.eyeY.v;
  c.eyes.forEach(e => {
    e.g.setAttribute("transform", `translate(${ex.toFixed(1)} ${ey.toFixed(1)}) translate(${e.cx} ${e.cy}) scale(${es.toFixed(3)} ${(es * blinkS).toFixed(3)}) translate(${-e.cx} ${-e.cy})`);
    if (c.happy) e.g.setAttribute("opacity", c.happyOn ? 0 : 1);
  });
  if (c.happy) c.happy.setAttribute("opacity", c.happyOn ? 1 : 0);
  if (c.closedEyes) { const open = es > 1.1; c.closedEyes.setAttribute("opacity", open ? 0 : 1); c.eyes.forEach(e => e.g.setAttribute("opacity", open ? 1 : 0)); }
  if (c.brows) c.brows.setAttribute("transform", `translate(0 ${(-(es - 1) * 40 - (c.kind === "gao" ? c.lift.v * .2 : 0)).toFixed(1)})`);
  if (c.blush) c.blush.setAttribute("opacity", c.headRot.t > 10 || tm.shy ? 1 : 0);
  if (c.glint) c.glint.setAttribute("opacity", c.lift.v > 40 ? 1 : 0);
  const o = Math.max(0, Math.min(1, Math.max(c.mouthOpen.v, c.speakingLevel, mouthX)));
  const M = c.mouth;
  if (M.type === "trunk") { M.g.setAttribute("transform", rot((Math.sin(c.t * 10) * Math.max(c.speakingLevel, mouthX) * 10 + c.mouthOpen.v * 12) * m, M.px, M.py)); return; }
  if (M.type === "jaw") { M.el.setAttribute("ry", (2 + o * 14).toFixed(1)); M.el.setAttribute("cy", (238 + o * 8).toFixed(1)); return; }
  const top = M.top, k = M.w / 22;
  if (c.roundMouth) {
    const r = (8 + o * 8) * k; M.path.setAttribute("fill", "#FF6F91");
    M.path.setAttribute("d", `M${M.x} ${top} m${-r} 0 a${r} ${r * 1.2} 0 1 0 ${r * 2} 0 a${r} ${r * 1.2} 0 1 0 ${-r * 2} 0`);
    M.tongue.setAttribute("rx", 0); M.tongue.setAttribute("ry", 0);
  } else if (o < 0.06) {
    M.path.setAttribute("d", c.sadMouth ? `M${M.x - 18 * k} ${top + 12} Q${M.x} ${top} ${M.x + 18 * k} ${top + 12}` : (M.closed || `M${M.x - 22 * k} ${top + 2} Q${M.x} ${top + 14 * k} ${M.x + 22 * k} ${top + 2}`));
    M.path.setAttribute("fill", "none"); M.tongue.setAttribute("rx", 0); M.tongue.setAttribute("ry", 0);
  } else {
    const w = (22 + 6 * o) * k, depth = (8 + 30 * o) * k;
    M.path.setAttribute("fill", "#FF6F91");
    M.path.setAttribute("d", `M${M.x - w} ${top} Q${M.x} ${top + 5 * k} ${M.x + w} ${top} Q${M.x} ${top + depth * 2} ${M.x - w} ${top} Z`);
    M.tongue.setAttribute("cy", top + depth * 0.68); M.tongue.setAttribute("rx", w * 0.45); M.tongue.setAttribute("ry", depth * 0.22);
  }
}

/* ---------- 演技（共通） ---------- */
const later = (ms, f) => setTimeout(f, ms);
function jump(c, power = 1) { c.jumpV = -1100 * power * Math.sqrt(c.tempo); c.jumpY = -0.01; c.squash.vel += 1.6; }
function joy(c) {
  if (c.mouth.type !== "smile") { c.mouthOpen.t = .8; later(800, () => c.mouthOpen.t = 0); }
  jump(c, 1); c.happyOn = true; c.armL.t = 130; c.armR.t = -130; c.mouthOpen.t = .7; c.earL.t = 12; c.earR.t = -12;
  later(900, () => { c.armL.t = 0; c.armR.t = 0; c.mouthOpen.t = 0; c.earL.t = 0; c.earR.t = 0; });
  later(1300, () => { c.happyOn = false; });
}
function surprise(c) {
  jump(c, .55); c.eyeScale.t = 1.3; c.roundMouth = true; c.mouthOpen.t = .6; c.earL.t = 18; c.earR.t = -18; c.armL.t = 40; c.armR.t = -40;
  later(900, () => { c.eyeScale.t = 1; c.roundMouth = false; c.mouthOpen.t = 0; c.earL.t = 0; c.earR.t = 0; c.armL.t = 0; c.armR.t = 0; });
}
function flop(c) {
  c.lean.t = 38; c.squash.t = .82; c.headRot.t = 14; c.blink = 0; c.nextBlink = 1.2; c.armL.t = 50; c.armR.t = -50;
  blip(300, 120, .12, "sawtooth");
  later(750 / c.tempo, () => { c.lean.t = 0; c.squash.t = 1; c.headRot.t = 0; c.armL.t = 0; c.armR.t = 0; c.squash.vel += 1.2; blip(420, 700, .1); });
}
function wave(c) { c.armR.t = -130; c.wave = 1; c.headRot.t = -6; later(1600, () => { c.wave = 0; c.armR.t = 0; c.headRot.t = 0; }); }
function setListen(c, on) { c.listening = on; c.headRot.t = on ? -10 : 0; c.earL.t = on ? -14 : 0; c.earR.t = on ? 14 : 0; showEar(c, on); }

/* ---------- その子らしい喜び方 ---------- */
const SPECIAL = {
  pony: c => joy(c),
  shima: c => joy(c),
  doshin: c => { c.tm.clap = 2.2; c.mouthOpen.t = .6; later(2200, () => c.mouthOpen.t = 0); blip(90, 70, .25, "triangle"); later(500, () => blip(90, 70, .25, "triangle")); },
  nobbo: c => { c.lift.t = 110; c.happyOn = true; blip(400, 1200, .35, "triangle"); later(1200, () => { c.lift.t = 0; c.happyOn = false; }); },
  gao: c => { jump(c, .5); c.headRot.t = 20; c.lean.t = -8; c.lift.t = 40; later(1500, () => { c.headRot.t = 0; c.lean.t = 0; c.lift.t = 0; }); },
  chu: c => { jump(c, 1.3); c.eyeScale.t = 1.4; blip(900, 1600, .12, "square"); later(500, () => { c.eyeScale.t = 1; c.happyOn = true; }); later(1400, () => c.happyOn = false); },
  pyon: c => { jump(c, .75); c.happyOn = true; c.earL.t = -25; c.earR.t = 25; later(480, () => jump(c, .75)); later(1300, () => { c.happyOn = false; c.earL.t = 0; c.earR.t = 0; }); },
  mii: c => { c.headRot.t = -18; c.blink = 0; c.nextBlink = 1.4; c.tm.wag = 1.6; later(1600, () => c.headRot.t = 0); },
  kamejii: c => { c.dx.t = 2200; c.lean.t = -20; blip(200, 900, .4, "sawtooth"); later(900, () => { c.dx.t = 0; c.lean.t = 0; }); },
  pyonmama: c => { c.happyOn = true; wave(c); later(1400, () => c.happyOn = false); },
  gaojii: c => { c.tm.nod = 1.2; c.happyOn = true; later(1300, () => c.happyOn = false); },
  miibaa: c => { c.tm.nod = 1.2; c.happyOn = true; c.tm.wag = 1.4; later(1300, () => c.happyOn = false); },
  doshinpapa: c => { c.tm.clap = 1.6; c.mouthOpen.t = .5; later(1600, () => c.mouthOpen.t = 0); },
  kon: c => { jump(c, .8); c.happyOn = true; c.tm.wag = 1.6; later(1300, () => c.happyOn = false); },
  mama: c => { c.happyOn = true; wave(c); later(1400, () => c.happyOn = false); },
  gaomama: c => { c.happyOn = true; wave(c); later(1400, () => c.happyOn = false); },
  miimama: c => { c.happyOn = true; wave(c); later(1400, () => c.happyOn = false); },
  chumama: c => { c.happyOn = true; wave(c); later(1400, () => c.happyOn = false); },
  wanko: c => { c.tm.nod = 1.4; c.happyOn = true; later(1400, () => c.happyOn = false); },
  biba: c => { c.happyOn = true; wave(c); later(1400, () => c.happyOn = false); },
  piyoko: c => { c.happyOn = true; wave(c); later(1400, () => c.happyOn = false); },
  ookami: c => { c.tm.shiver = 1; },
  ojisan: c => { c.tm.nod = 1.2; },
  papa: c => { c.tm.nod = 1.2; c.happyOn = true; later(1300, () => c.happyOn = false); },
  gaopapa: c => { c.tm.clap = 1.4; c.mouthOpen.t = .5; later(1400, () => c.mouthOpen.t = 0); },
  gaonii: c => { c.tm.nod = 1.2; c.happyOn = true; later(1300, () => c.happyOn = false); },
  onii: c => { c.tm.nod = 1.2; c.happyOn = true; later(1300, () => c.happyOn = false); },
  tora: c => { jump(c, .6); c.happyOn = true; later(1200, () => c.happyOn = false); },
  kuma: c => { c.tm.nod = 1.4; c.happyOn = true; later(1400, () => c.happyOn = false); },
  panna: c => { jump(c, .5); c.happyOn = true; later(1200, () => c.happyOn = false); },
  pannamama: c => { c.tm.nod = 1.4; c.happyOn = true; later(1400, () => c.happyOn = false); },
  omawari: c => { c.tm.nod = 1.2; c.armR.t = -140; later(1000, () => c.armR.t = 0); },
  meebaa: c => { c.armL.t = -55; c.armR.t = 55; c.happyOn = true; c.lean.t = 6; later(500, () => c.lean.t = -6); later(1000, () => c.lean.t = 0); later(1400, () => { c.armL.t = 0; c.armR.t = 0; c.happyOn = false; }); },
};
