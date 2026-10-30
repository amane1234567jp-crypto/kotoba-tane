/* ================= スマホでは 盤を 横に ひろげて、ぜんぶ 見せる（2026-10-28） =================
   カメラが コマを おいかける やりかたは やめる（すごろくは 全体が 見えて いる ことが だいじ。ライバルも 見える）。
   iPhone の 横長の 画面（2:1 より 横長）に 16:10 の 盤を そのまま 出すと 左右が あまる ので、
   マスの x 座標を まんなか（800）から 横に 伸ばして、画面の はばに あわせる（さいだい 1.3倍）。
   道・マス・コマ・わかれ道の 矢印・へや（board_art）は マスの 座標から かくので いっしょに 伸びる。
   もとから 絵が かいて ある 盤（うんどうじょう・こうえん・おみせ・でんしゃ・とうこう・がっこう2）は、背景の 絵も 横に 伸ばす。
   こうしゃ は へや（ZONES）を 伸ばす。ロングコースは そのまま（もともと 横いっぱい）。 */
const BW = { k: 1, fit: null };
/* 2026-10-31：盤を 画面いっぱいまで 大きく する（「コースが 小さすぎて キャラが 見えない」）。
   マス（と コマの 頭の ぶん）の はんいを、画面の あいて いる ところ（上の バーの 下〜下の はし）に あわせて、
   たて・よこ 同じ 倍率で 大きく する（さいだい 1.7倍）。よこに あまれば これまでどおり マスの 間を 横に 伸ばす（さいだい 1.3倍）。
   大きく するのは 盤・コマ・こうか（boardLayer / camChars / fxLayer）。ぽにー・さいころ・上の バーは そのまま。 */
function bwFitCalc(src, longish, hasB) {
  if (!PH.on || !src) return null;
  const P = Object.values(src); if (!P.length) return null;
  let x0 = Math.min(...P.map(p => p[0])) - 80, x1 = Math.max(...P.map(p => p[0])) + 80;
  const y0 = Math.min(...P.map(p => p[1])) - 150, y1 = Math.max(...P.map(p => p[1])) + (longish ? 80 : 62);
  if (longish) { x0 = Math.min(x0, 30); x1 = Math.max(x1, 1570); }
  const X0 = -PH.E + 30, X1 = 1600 + PH.E - 30, Y0 = 118, Y1 = 996, TW = X1 - X0, TH = Y1 - Y0;
  const w = x1 - x0, h = y1 - y0, s = Math.min(1.7, TH / h, TW / w);
  if (s < 1.03) return null;
  const k = Math.max(1, Math.min(1.3, TW / (w * s))), cx = 800 + ((x0 + x1) / 2 - 800) * k, W = w * k * s;
  const slack = TW - W, left = X0 + Math.min(slack, longish ? slack / 2 : 200 + Math.max(0, slack - 200) / 2);
  const tx = left - s * (cx - w * k / 2), ty = Y0 + (TH - h * s) / 2 - s * y0;
  return { s, k, tx, ty, long: longish }; }
// ぽにー（ナビ）：左上の すみ。盤を 大きく した ときも 画面の 左はしに
function bwPony() { if (BW.fit) place(C.pony, -PH.E + 60, 372, .42); else place(C.pony, bwX(200), 372, .42); }
// ふきだし：盤を 大きく した ときは、しゃべって いる コマの 頭の ところへ（ふきだしの 大きさは そのまま）
function phFitBub() { const f = BW.fit, c = PH.bubC; if (!f || !c || !c.root) return "";
  const ax = c.x + 200 * c.s, ay = c.y + ((c.base || 0) - 330) * c.s; let dx = (f.s - 1) * ax + f.tx, dy = (f.s - 1) * ay + f.ty;
  try { const x = +bubR.getAttribute("x"), y = +bubR.getAttribute("y"), w = +bubR.getAttribute("width"), h = +bubR.getAttribute("height");
    dx = Math.max(-PH.E + 10 - x, Math.min(1600 + PH.E - 10 - w - x, dx)); dy = Math.max(120 - y, Math.min(990 - h - y, dy)); } catch (e) { }
  return `translate(${dx.toFixed(1)} ${dy.toFixed(1)})`; }
// 上の バーに おく もの（コースの なまえ など。data-top）は 盤と いっしょに 大きく しない
const bwTop = el("g", {}, boardLayer.parentNode); boardLayer.parentNode.insertBefore(bwTop, boardLayer.nextSibling);
function bwTopMove() { while (bwTop.firstChild) bwTop.firstChild.remove(); boardLayer.querySelectorAll("[data-top]").forEach(n => bwTop.appendChild(n)); }
(function bwTopTick() { bwTop.style.display = boardLayer.style.display === "none" || view === "menu" ? "none" : ""; requestAnimationFrame(bwTopTick); })();
const bwX = x => 800 + (x - 800) * BW.k;
function bwCalc() { if (!PH.on) return 1; const vw = 1600 + 2 * PH.E; return Math.max(1, Math.min(1.3, vw / 1600)); }
// 背景の 絵（レーンなど）を 横に 伸ばす。文字は 伸ばさない（文字ごとに 逆に ちぢめる）
function bwWrapBg(id) { const f = BOARD_BG[id]; const w = (L, B) => { if (BW.k <= 1.001) return f(L, B);
    const g = el("g", { transform: `translate(800 0) scale(${BW.k.toFixed(4)} 1) translate(-800 0)` }, L), t0 = txt;
    txt = function (gg, x, y, ...r) { const t = t0(gg, x, y, ...r); try { const tr = t.getAttribute("transform") || ""; t.setAttribute("transform", `translate(${x} ${y}) scale(${(1 / BW.k).toFixed(4)} 1) translate(${-x} ${-y}) ${tr}`); } catch (e) { } return t; };
    try { return f(g, B); } finally { txt = t0; } }; w.__bw = true; BOARD_BG[id] = w; }
const BW_FIXED = ["undou", "kouen", "omise", "densha", "toukou", "gakkou2"];
BW_FIXED.forEach(id => { const f = BOARD_BG[id]; if (!f) return; BOARD_BG[id] = (L, B) => { const g = BW.k > 1.001 ? el("g", { transform: `translate(800 0) scale(${BW.k.toFixed(4)} 1) translate(-800 0)` }, L) : L; return f(g, B); }; });
{ const db = drawBoard; drawBoard = function () {
    const longish = (typeof isLong === "function" && isLong()) || (typeof isSL === "function" && isSL());
    BW.k = bwCalc(); // 2026-10-30：ロングコースも 横に 伸ばす（まえは 伸ばさず、左右が あいて いた）
    if (longish && BOARD_BG[curStage] && !BOARD_BG[curStage].__bw) bwWrapBg(curStage);
    const B = BOARD[curStage];
    const src = B ? B.nodes : (typeof LAYOUT !== "undefined" && LAYOUT[curStage] ? LAYOUT[curStage].nodes : KOUSHA_NODES);
    BW.fit = bwFitCalc(src, longish, !!B); if (BW.fit) BW.k = BW.fit.k;
    Object.entries(src).forEach(([id, v]) => { if (NODES[id]) NODES[id][0] = bwX(v[0]); });
    if (!B && typeof KOUSHA_ZONES !== "undefined") ZONES.forEach((z, i) => { const o = KOUSHA_ZONES[i]; if (!o) return; z.x = bwX(o.x); z.w = o.w * BW.k; });
    let keep = null; if (B && B.labels && BW.k > 1.001) { keep = B.labels; B.labels = keep.map(([t, x, y]) => [t, bwX(x), y]); }
    try { db(); } finally { if (keep) B.labels = keep; }
    BOARD_PIECES.forEach(pc => { if (pc && pc.node != null && NODES[pc.node]) setPiece(pc, pc.node); });
    // 盤の 地面を 左右にも（もとの 地面は 0〜1600 しか ない）
    const first = boardLayer.firstElementChild, fill = first && first.tagName === "rect" ? first.getAttribute("fill") : null;
    if (fill) { const r = el("rect", { x: -1200, y: -600, width: 4000, height: 2200, fill }); boardLayer.insertBefore(r, first); }
    bwTopMove();
    if (typeof C !== "undefined" && C.pony && view === "board") bwPony();
  }; }
{ const sv = setView; setView = function (v, ...a) { const r = sv(v, ...a); if (v === "board" && typeof C !== "undefined" && C.pony) bwPony(); return r; }; }
// ねむっている どしんの 「どいた あとの 場所」も 伸ばす
{ const sa = sleeperAway; sleeperAway = function () { const p = sa(); return [bwX(p[0]), p[1]]; }; }
// あいた ばしょ さがし（bgFree）の はんいも 画面の はばに
{ const bf = bgFree; bgFree = function (B, n = 3, o = {}) { const half = 730 * BW.k; return bf(B, n, { x0: 800 - half, x1: 800 + half, ...o }); }; }
// board_art の へやの はしも
if (typeof BA !== "undefined") { BA.areaBox = (B, place, pad = 80) => { const pts = Object.entries(B.nodes).filter(([id]) => B.place[id] === place).map(([, p]) => [bwX(p[0]), p[1]]); if (!pts.length) return null;
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), lo = 800 - 776 * BW.k, hi = 800 + 776 * BW.k; return [Math.max(lo, Math.min(...xs) - pad), Math.max(150, Math.min(...ys) - pad), Math.min(hi, Math.max(...xs) + pad), Math.min(985, Math.max(...ys) + pad)]; };
  Object.values(BA.ground).forEach(() => { }); // 地面は 下で ひろげる
  const G = BA.ground; for (const k in G) { const f = G[k]; G[k] = (L, c) => { const g = el("g", {}, L); f(g, c); el("rect", { x: -600, y: 0, width: 600, height: 1000, fill: g.firstChild && g.firstChild.getAttribute("fill") || c || "#FFF8E1" }, L); el("rect", { x: 1600, y: 0, width: 600, height: 1000, fill: g.firstChild && g.firstChild.getAttribute("fill") || c || "#FFF8E1" }, L); L.appendChild(g); }; } }
// むきが かわったら かきなおす
addEventListener("resize", () => setTimeout(() => { if (view === "board" && boardLayer.style.display !== "none" && typeof started !== "undefined" && started) { try { if (Math.abs(bwCalc() - BW.k) > .01) drawBoard(); } catch (e) { } } }, 400));
