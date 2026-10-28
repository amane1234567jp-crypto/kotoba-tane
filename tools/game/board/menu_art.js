/* ================= メニューの タイルの 絵（2026-10-28） =================
   絵文字は 端末ごとに 絵が ちがい「アプリの 絵」に ならないので、ジャンルごとに ゲームの キャラクターと 景色で 小さな 絵を 作る。
   キャラは rig の makeChar で 作り、タイルの <svg> に うつして 1回だけ かく（うごかさない）。 */
const ART_VB = [0, 0, 480, 300];
function artChar(svg, kind, x, base, s, pose = {}) {
  let c; try { c = makeChar(kind); } catch (e) { return null; }
  svg.appendChild(c.root); place(c, x, base, s);
  if (pose.armL != null) c.armL.v = c.armL.t = pose.armL; if (pose.armR != null) c.armR.v = c.armR.t = pose.armR;
  if (pose.lean != null) c.lean.v = c.lean.t = pose.lean; if (pose.happy) c.happyOn = true; if (pose.eyeX != null) c.eyeX.v = c.eyeX.t = pose.eyeX;
  try { drawChar(c, 0, false); } catch (e) { }
  if (pose.flip) { const t = c.root.getAttribute("transform") || ""; c.root.setAttribute("transform", `translate(${(2 * (x)).toFixed(1)} 0) scale(-1 1) ${t}`); }
  return c;
}
const artSky = (L, c1 = "#BFE6FA", c2 = "#EAF7FF") => { const id = "sky" + Math.random().toString(36).slice(2, 7); const d = el("defs", {}, L); const g = el("linearGradient", { id, x1: 0, y1: 0, x2: 0, y2: 1 }, d); el("stop", { offset: 0, "stop-color": c1 }, g); el("stop", { offset: 1, "stop-color": c2 }, g); el("rect", { x: 0, y: 0, width: 480, height: 300, fill: `url(#${id})` }, L); };
const artGround = (L, y, fill) => el("rect", { x: 0, y, width: 480, height: 300 - y, fill }, L);
const artCloud = (L, x, y, k = 1) => cloud(L, x, y, k);
function artSchool(L, x, y, s = 1) { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L);
  el("rect", { x: 0, y: 60, width: 300, height: 150, fill: "#FFF4E0", ...S6(6) }, g); el("path", { d: "M-20 60 L150 0 L320 60 Z", fill: "#E8735A", ...S6(6) }, g);
  el("rect", { x: 125, y: 140, width: 50, height: 70, rx: 6, fill: "#B97A4A", ...S6(5) }, g); el("circle", { cx: 150, cy: 40, r: 18, fill: "#FFFFFF", ...S6(5) }, g); el("path", { d: "M150 40 V28 M150 40 L160 46", ...S6(4) }, g);
  [[30, 90], [200, 90]].forEach(([x, y]) => el("rect", { x, y, width: 70, height: 50, rx: 6, fill: "#BDE3F2", ...S6(5) }, g)); return g; }
function artHouse(L, x, y, s = 1, wall = "#FFF1C9", roof = "#7FA7D9") { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L);
  el("rect", { x: 0, y: 70, width: 220, height: 130, fill: wall, ...S6(6) }, g); el("path", { d: "M-24 70 L110 -10 L244 70 Z", fill: roof, ...S6(6) }, g);
  el("rect", { x: 90, y: 130, width: 44, height: 70, rx: 6, fill: "#B97A4A", ...S6(5) }, g); el("rect", { x: 20, y: 95, width: 50, height: 44, rx: 6, fill: "#BDE3F2", ...S6(5) }, g); el("rect", { x: 150, y: 95, width: 50, height: 44, rx: 6, fill: "#BDE3F2", ...S6(5) }, g); return g; }
function artBus(L, x, y, s = 1) { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L);
  el("rect", { x: 0, y: 0, width: 300, height: 130, rx: 24, fill: "#FFD25E", ...S6(6) }, g);
  [20, 100, 180].forEach(wx => el("rect", { x: wx, y: 22, width: 60, height: 48, rx: 10, fill: "#BDE3F2", ...S6(5) }, g)); el("rect", { x: 255, y: 22, width: 30, height: 90, rx: 8, fill: "#BDE3F2", ...S6(5) }, g);
  el("rect", { x: 0, y: 92, width: 300, height: 14, fill: "#E8735A" }, g);
  [60, 240].forEach(cx => { el("circle", { cx, cy: 130, r: 26, fill: "#2B2A33" }, g); el("circle", { cx, cy: 130, r: 11, fill: "#E3E3E3" }, g); }); return g; }
function artBoard(L, x, y, w, h, label) { el("rect", { x, y, width: w, height: h, rx: 10, fill: "#2F6B4F", ...S6(6) }, L); el("rect", { x: x - 10, y: y + h - 6, width: w + 20, height: 14, rx: 4, fill: "#C98A4B", ...S6(4) }, L);
  if (label) txt(L, x + w / 2, y + h / 2 + 16, label, 44, { "text-anchor": "middle", fill: "#FFFFFF" }); }
function artBubble(L, x, y, w, h, fill = "#FFFFFF", tipDx = -20) { el("rect", { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: h / 2, fill, ...S6(5) }, L); el("path", { d: `M${x + tipDx - 12} ${y + h / 2 - 4} L${x + tipDx} ${y + h / 2 + 22} L${x + tipDx + 14} ${y + h / 2 - 4}`, fill, ...S6(5) }, L); el("path", { d: `M${x + tipDx - 12} ${y + h / 2 - 4} L${x + tipDx} ${y + h / 2 + 22} L${x + tipDx + 14} ${y + h / 2 - 4}`, fill, stroke: "none" }, L); }
function artHeart(L, x, y, s = 1, fill = "#FF6F91") { el("path", { d: `M${x} ${y + 18 * s} C${x - 26 * s} ${y - 2 * s} ${x - 16 * s} ${y - 24 * s} ${x} ${y - 10 * s} C${x + 16 * s} ${y - 24 * s} ${x + 26 * s} ${y - 2 * s} ${x} ${y + 18 * s} Z`, fill, ...S6(4) }, L); }
function artThought(L, x, y, s = 1) { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L);
  el("circle", { cx: -70, cy: 70, r: 10, fill: "#FFFFFF", ...S6(4) }, g); el("circle", { cx: -50, cy: 44, r: 16, fill: "#FFFFFF", ...S6(4) }, g);
  [[0, 0, 46], [40, -12, 36], [-38, -6, 34], [10, -34, 30]].forEach(([dx, dy, r]) => el("circle", { cx: dx, cy: dy, r, fill: "#FFFFFF", stroke: INK, "stroke-width": 4 }, g));
  [[0, 0, 44], [40, -12, 34], [-38, -6, 32], [10, -34, 28]].forEach(([dx, dy, r]) => el("circle", { cx: dx, cy: dy, r, fill: "#FFFFFF" }, g));
  txt(g, 4, 14, "？", 56, { "text-anchor": "middle", fill: "#B9A8D9" }); return g; }
function artFlag(L, x, y, s = 1) { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L); el("path", { d: "M0 0 V-120", ...S6(8) }, g); el("path", { d: "M0 -120 L80 -98 L0 -76 Z", fill: "#FF6F91", ...S6(5) }, g); return g; }
function artPath(L, d) { el("path", { d, fill: "none", stroke: "#FFF1C9", "stroke-width": 26, "stroke-linecap": "round" }, L); el("path", { d, fill: "none", stroke: "#2B2A33", "stroke-width": 4, "stroke-dasharray": "12 14", "stroke-linecap": "round" }, L); }
const ART = {
  gakkou(L) { artSky(L); artCloud(L, 60, 60, .7); artCloud(L, 380, 40, .55); artGround(L, 225, "#BFE3A6"); artSchool(L, 150, 60, .72); tree2(L, 50, 220, 30); tree2(L, 440, 215, 34);
    artChar(L, "shima", 110, 292, .34, { armR: -40, happy: true }); },
  jugyou(L) { artSky(L, "#FFF6E0", "#FFF6E0"); artBoard(L, 110, 40, 300, 120, "あいうえお"); el("rect", { x: 0, y: 232, width: 480, height: 68, fill: "#F6E7C8" }, L);
    el("rect", { x: 300, y: 200, width: 140, height: 18, rx: 6, fill: "#C98A4B", ...S6(4) }, L); el("path", { d: "M316 218 V280 M424 218 V280", ...S6(6) }, L);
    artChar(L, "pony", 150, 292, .36, { armR: -120, happy: true }); },
  machi(L) { artSky(L); artCloud(L, 400, 50, .6); artGround(L, 210, "#BFE3A6"); el("rect", { x: 0, y: 236, width: 480, height: 64, fill: "#7A7F88" }, L); el("path", { d: "M0 268 H480", stroke: "#FFFFFF", "stroke-width": 5, "stroke-dasharray": "22 18" }, L);
    artBus(L, 190, 110, .82); tree2(L, 40, 205, 28); artChar(L, "doshin", 100, 292, .3, { armL: 40, happy: true }); },
  ouchi(L) { artSky(L); artCloud(L, 90, 50, .6); artGround(L, 220, "#BFE3A6"); artHouse(L, 230, 60, .78); tree2(L, 60, 215, 30); flower(L, 200, 262, "#FF8FA3"); flower(L, 420, 268, "#FFFFFF"); flower(L, 380, 255, "#B9A8D9");
    artChar(L, "pyon", 110, 292, .32, { armL: 30, armR: -30, happy: true }); },
  tsutaeru(L) { artSky(L, "#FFE3F1", "#FFF6FA"); artGround(L, 236, "#F6E7C8"); artBubble(L, 150, 70, 150, 64, "#FFFFFF", 10); artHeart(L, 150, 72, 1.1); artBubble(L, 335, 70, 150, 64, "#FFFFFF", -10); txt(L, 335, 86, "！", 44, { "text-anchor": "middle", fill: "#E8735A" });
    artChar(L, "chu", 150, 292, .5, { armR: -60, happy: true }); artChar(L, "mii", 330, 292, .3, { armL: 60, happy: true, flip: false }); },
  kangaeru(L) { artSky(L, "#ECE4FF", "#F7F3FF"); artGround(L, 236, "#DDD2F2"); artThought(L, 300, 90, 1.05); artChar(L, "shima", 160, 292, .34, { armR: -150, lean: 4 }); },
  long(L) { artSky(L, "#FFEFC9", "#FFF9E8"); artGround(L, 225, "#BFE3A6"); artPath(L, "M30 300 C 120 230 60 150 160 140 S 300 190 320 120 S 430 60 450 70"); artFlag(L, 450, 100, .8); tree2(L, 250, 70, 24); tree2(L, 90, 110, 22);
    artChar(L, "gao", 160, 292, .32, { armR: -140, armL: 40, lean: -6, happy: true }); },
  multi(L) { artSky(L, "#CFEAFB", "#F4FBFF"); artGround(L, 240, "#BFE3A6"); artCloud(L, 80, 60, .5); artCloud(L, 390, 50, .5);
    artChar(L, "pyon", 90, 292, .28, { armR: -40, happy: true }); artChar(L, "shima", 240, 292, .32, { armL: 30, armR: -30, happy: true }); artChar(L, "mii", 390, 292, .27, { armL: 40, happy: true }); },
};
function artTile(t, gid) { if (!ART[gid] || t.querySelector(".m3art")) return; const ic = t.querySelector(".m2gi"); if (!ic) return;
  const svg = document.createElementNS(NS, "svg"); svg.setAttribute("viewBox", ART_VB.join(" ")); svg.setAttribute("class", "m3art"); svg.setAttribute("aria-hidden", "true"); svg.setAttribute("preserveAspectRatio", "xMidYMax slice");
  try { ART[gid](svg); } catch (e) { console.error(e); return; } ic.replaceWith(svg); }
{ const md = m3Decorate; m3Decorate = function () { md(); try { document.querySelectorAll("#startBox .m2g").forEach(t => { const m = /\bg-([a-z0-9]+)\b/.exec(t.className); artTile(t, t.classList.contains("m2multi") ? "multi" : m && m[1]); }); } catch (e) { console.error(e); } }; }
if (document.getElementById("startBox")) m3Decorate();
(function () { const s = document.createElement("style"); s.textContent = `
.start.menu.m3 .mcard[data-m2] .m2g{padding:0!important;gap:0!important;justify-content:flex-start!important;overflow:hidden}
.start.menu.m3 .mcard[data-m2] .m2g .m3art{display:block;width:100%;flex:1 1 auto;min-height:0;border-bottom:3px solid #2B2A33}
.start.menu.m3 .mcard[data-m2] .m2g .m2gn{flex:none;padding:.25em .4em .35em;margin:0!important;font-size:.95em!important}
.start.menu.m3 .mcard[data-m2] .m2g .m3n{flex:none;margin:-.35em 0 .3em!important}
`; document.head.appendChild(s); })();

/* ---- コースの タイルの 絵（2026-10-28）：その コースの さいしょの 場面の へや（drawRoom）を ちいさく かき、まるシマと あいてを 立たせる ---- */
const ART_COURSE = { // sits に ない コース：へや（どの ステージの かきかたで・どの 場所か）と あいて
  tokei: ["gakkou2", "きょうしつ", "nobbo"], sansu: ["gakkou2", "きょうしつ", "nobbo"], komatta: ["ouchi1", "リビング", "mama"],
  souzou: ["gakkou2", "きょうしつ", "nobbo"], tachiba: ["kouen", "すべりだい", "tora"], sakiyomi: ["ouchi1", "リビング", "mama"], chotto: ["gakkou2", "きょうしつ", "pyon"], aite: ["kouen", "ベンチ", "mii"],
  manekko: ["gakkou2", "きょうしつ", "tora"], long: ["kousha", "げんかん", "gao"], ltomo: ["kouen", "すべりだい", "kuma"],
  kokugo: ["kokugo", "きょうしつ", "nobbo"],
};
function artCourseSpec(sid) {
  const s = (typeof SITS !== "undefined" ? SITS : []).find(x => x.stage === sid);
  if (s) return [sid, s.place, s.asker];
  if (ART_COURSE[sid]) return ART_COURSE[sid];
  if (typeof SL_TH !== "undefined" && SL_TH[sid]) return [sid, SL_TH[sid].areas[0], (SL_TH[sid].blk && SL_TH[sid].blk.who) || "nobbo"];
  return ["kousha", "ろうか", "nobbo"];
}
function artRoom(svg, stage, place) {
  const keep = [...sceneLayer.childNodes], saveStage = curStage, saveDisp = sceneLayer.style.display;
  curStage = stage;
  try { drawRoom(place, true); } catch (e) { console.error("artRoom", stage, place, e); }
  const g = el("g", { transform: "scale(0.3)" }, svg); [...sceneLayer.childNodes].forEach(n => g.appendChild(n));
  curStage = saveStage; keep.forEach(n => sceneLayer.appendChild(n)); sceneLayer.style.display = saveDisp;
  g.querySelectorAll("text").forEach(t => { if (/つぎは|の ばめん/.test(t.textContent)) t.remove(); });
}
function artCourse(svg, sid, aspect = 1.6) {
  const [stage, place, asker] = artCourseSpec(sid);
  artRoom(svg, stage, place);
  const kind = (typeof BUILD !== "undefined" && BUILD[asker]) ? asker : asker === "piyoko" ? "piyo" : "nobbo";
  const ak = (typeof ASK_AT !== "undefined" && ASK_AT[kind]) ? ASK_AT[kind][1] : 1;
  // タイルが ほそい ときは 見える はばに あわせて 2人を よせる
  const W = Math.max(200, Math.min(480, 300 * aspect)), cx = 240; svg.setAttribute("viewBox", `${(cx - W / 2).toFixed(0)} 0 ${W.toFixed(0)} 300`);
  const hx = cx - W * .21, ax = cx + W * .23;
  artChar(svg, "shima", hx, 292, .34, { happy: true, armR: -30 });
  const TALL = { nobbo: .27, doshin: .26, omawari: .28, kuma: .3, tenin: .3, ekiin: .3 }; // せが 高い キャラは 上が きれない ように 小さく
  artChar(svg, kind, ax, 292, TALL[kind] || Math.min(.36, .34 * ak), { happy: true, armL: 30 });
}
function artCourseTile(b) { if (b.querySelector(".m3art")) return; const sid = b.dataset.sid; const ic = b.querySelector(".mico"); if (!sid || !ic) return;
  const svg = document.createElementNS(NS, "svg"); svg.setAttribute("viewBox", ART_VB.join(" ")); svg.setAttribute("class", "m3art"); svg.setAttribute("aria-hidden", "true"); svg.setAttribute("preserveAspectRatio", "xMidYMax slice");
  const r = b.getBoundingClientRect(), nm = b.querySelector(".mname"), nh = nm ? nm.getBoundingClientRect().height : 0, aspect = r.width && r.height ? r.width / Math.max(40, r.height - nh) : 1.6;
  try { artCourse(svg, sid, aspect); } catch (e) { console.error(e); return; } ic.replaceWith(svg); }
{ const mo = m2Open; m2Open = function (gid) { mo(gid); if (!gid) return; requestAnimationFrame(() => requestAnimationFrame(() => { try { document.querySelectorAll("#startBox .mstages .mst:not(.m2off)").forEach(artCourseTile); } catch (e) { console.error(e); } })); }; }
(function () { const s = document.createElement("style"); s.textContent = `
.start.menu .mcard[data-m2] .mstages.mstages .mst{padding:0!important;gap:0!important;justify-content:flex-start!important;overflow:hidden}
.start.menu .mcard[data-m2] .mstages.mstages .mst .m3art{display:block;width:100%;flex:1 1 auto;min-height:0;border-bottom:3px solid #2B2A33}
.start.menu .mcard[data-m2] .mstages.mstages .mst .mname{flex:none;padding:.2em .3em .3em;margin:0!important}
.start.menu .mcard[data-m2] .mstages.mstages .mst .mno{background:#FFFFFFCC;border-radius:999px;padding:0 .45em;color:#2B2A33!important;left:.4em!important;top:.3em!important}
.start.menu .mcard[data-m2] .mstages.mstages .mst .m3tag{position:absolute;right:.4em;top:.3em}
`; document.head.appendChild(s); })();
