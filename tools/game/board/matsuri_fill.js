/* ================= おまつりの やたいに 中身と 店番を（2026-11-01） =================
   まえは やたいの 中が からっぽ だった。おくの かべ → 店番の ひと → かんばん → カウンター → しなもの の じゅんに かく。 */
const MT_VENDOR = { わたあめ: "pannamama", きんぎょ: "ojisan", ヨーヨー: "miibaa", わなげ: "gaojii" };
function mtGoods(L, kind, x, w, cy) {
  const g = el("g", {}, L), cx = x + w / 2;
  if (kind === "わたあめ") { // ぼうに ついた ふわふわの わたあめ（カウンターの 上の たて）
    el("rect", { x: x + w - 150, y: cy - 22, width: 120, height: 26, rx: 8, fill: "#9A6A3E", ...S6(4) }, g);
    [[-110, "#FFC2D9"], [-70, "#FFFFFF"], [-30, "#D9C2FF"]].forEach(([dx, c], i) => { const px = x + w + dx - 20, top = cy - 120 - (i % 2) * 22;
      el("path", { d: `M${px} ${cy - 20} V${top + 36}`, stroke: "#C98A4B", "stroke-width": 7 }, g);
      [[0, 0, 34], [-22, 14, 24], [22, 14, 24], [0, 26, 26]].forEach(([ox, oy, r]) => el("circle", { cx: px + ox, cy: top + oy, r, fill: c, stroke: INK, "stroke-width": 4 }, g)); });
    el("ellipse", { cx: x + w * .55, cy: cy - 6, rx: 60, ry: 18, fill: "#D7E3EC", ...S6(4) }, g); el("path", { d: `M${x + w * .55 - 60} ${cy - 6} Q${x + w * .55} ${cy + 46} ${x + w * .55 + 60} ${cy - 6}`, fill: "#BFCFDB", ...S6(4) }, g); // わたあめの きかい
    el("path", { d: `M${x + w * .55 - 30} ${cy - 16} q30 -28 60 0`, fill: "none", stroke: "#FFC2D9", "stroke-width": 10, "stroke-linecap": "round" }, g); }
  else if (kind === "きんぎょ") { // カウンターの まえの すいそう
    el("rect", { x: x + 20, y: cy + 10, width: w - 40, height: 110, rx: 18, fill: "#7FCBF0", ...S6(5) }, g); el("rect", { x: x + 34, y: cy + 22, width: w - 68, height: 18, rx: 8, fill: "#BDE3F2" }, g);
    for (let i = 0; i < 6; i++) { const fx = x + 70 + i * (w - 140) / 5, fy = cy + 66 + (i % 2) * 22, d = i % 2 ? -1 : 1;
      el("path", { d: `M${fx - 20 * d} ${fy} q${20 * d} -16 ${36 * d} 0 q${-16 * d} 16 ${-36 * d} 0 z M${fx - 20 * d} ${fy} l${-14 * d} -10 v20 z`, fill: i % 3 ? "#FF6F3C" : "#E8473C", stroke: INK, "stroke-width": 3 }, g); }
    [0, 1].forEach(i => { const px = x + w - 120 + i * 40; el("ellipse", { cx: px, cy: cy - 14, rx: 18, ry: 12, fill: "#FFFFFF", ...S6(3) }, g); el("path", { d: `M${px} ${cy - 2} V${cy + 18}`, ...S6(4) }, g); }); } // ポイ
  else if (kind === "ヨーヨー") { // みずの プールに うかぶ ヨーヨー
    el("rect", { x: x + 20, y: cy + 10, width: w - 40, height: 110, rx: 18, fill: "#9FD8F5", ...S6(5) }, g);
    const cols = ["#FF6F91", "#FFD25E", "#7BD389", "#B9A8D9", "#FF8C42", "#7FCBF0"];
    for (let i = 0; i < 7; i++) { const bx = x + 60 + i * (w - 120) / 6, by = cy + 56 + (i % 2) * 26;
      el("circle", { cx: bx, cy: by, r: 22, fill: cols[i % 6], stroke: INK, "stroke-width": 3 }, g); el("path", { d: `M${bx - 16} ${by - 4} q16 10 32 0`, fill: "none", stroke: "#FFFFFF", "stroke-width": 4 }, g); el("path", { d: `M${bx} ${by - 22} q8 -14 0 -24`, fill: "none", stroke: INK, "stroke-width": 3 }, g); } }
  else if (kind === "わなげ") { // たなの しなものと わ
    el("rect", { x: x + 30, y: cy + 10, width: w - 60, height: 80, rx: 10, fill: "#E9C893", ...S6(4) }, g);
    for (let i = 0; i < 5; i++) { const px = x + 70 + i * (w - 140) / 4; el("rect", { x: px - 6, y: cy - 30, width: 12, height: 48, rx: 4, fill: "#C98A4B", ...S6(3) }, g); el("ellipse", { cx: px, cy: cy + 12, rx: 26, ry: 9, fill: "none", stroke: ["#FF6F91", "#7BD389", "#FFD25E"][i % 3], "stroke-width": 7 }, g); } }
  return g; }
function mtStall(L, x, w, name, col, innerTop, counterY, counterH, frontTo) {
  // おくの かべ（もとの かんばんを かくす）
  el("rect", { x: x + 8, y: innerTop, width: w - 16, height: counterY - innerTop, fill: "#F3D6A4" }, L);
  el("path", { d: `M${x + 8} ${innerTop + 60} H${x + w - 8}`, stroke: "#E2BE85", "stroke-width": 4 }, L);
  // 店番（カウンターで 下を かくす）
  const vk = MT_VENDOR[name]; if (vk) { const k = (ASK_AT[vk] || [0, 1])[1] * .5, c = artChar(L, vk, x + w * .26, counterY + 30, k, { happy: true, armR: -30 }); }
  // かんばん（のきの すぐ 下）
  el("rect", { x: x + w / 2 - 130, y: innerTop + 4, width: 260, height: 56, rx: 12, fill: "#FFF6E0", ...S6(5) }, L); txt(L, x + w / 2, innerTop + 46, name, 38, { "text-anchor": "middle" });
  // カウンター（その 下は やたいの まえいた で ふさぐ）
  if (frontTo) el("rect", { x: x, y: counterY + counterH - 4, width: w, height: frontTo - counterY - counterH + 4, fill: "#C98A4B", ...S6(6) }, L);
  el("rect", { x: x - 10, y: counterY, width: w + 20, height: counterH, rx: 8, fill: "#9A6A3E", ...S6(5) }, L);
  mtGoods(L, name, x, w, counterY); }
// ともだちの だいぼうけん（ltomo）の おまつり
{ const mr = matsuriRoom; matsuriRoom = function (L) { mr(L);
    [[60, "#FF6F61", "わたあめ"], [560, "#4FA35A", "きんぎょ"], [1060, "#3E7FD6", "ヨーヨー"]].forEach(([x, col, name]) => mtStall(L, x, 480, name, col, 372, 600, 40, 760));
    el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#D9C3A0" }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L); }; }
// がっこうの おまつり（ROOMS8）
if (typeof ROOMS8 !== "undefined" && ROOMS8.おまつり) { const r8 = ROOMS8.おまつり; ROOMS8.おまつり = L => { r8(L);
    [[120, "#F25C54", "きんぎょ"], [620, "#3E7FD6", "わなげ"], [1120, "#2FA36B", "わたあめ"]].forEach(([x, c, name]) => mtStall(L, x, 380, name, c, 392, 600, 60)); }; }
