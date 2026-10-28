/* ================= スマホでは 盤を 横に ひろげて、ぜんぶ 見せる（2026-10-28） =================
   カメラが コマを おいかける やりかたは やめる（すごろくは 全体が 見えて いる ことが だいじ。ライバルも 見える）。
   iPhone の 横長の 画面（2:1 より 横長）に 16:10 の 盤を そのまま 出すと 左右が あまる ので、
   マスの x 座標を まんなか（800）から 横に 伸ばして、画面の はばに あわせる（さいだい 1.3倍）。
   道・マス・コマ・わかれ道の 矢印・へや（board_art）は マスの 座標から かくので いっしょに 伸びる。
   もとから 絵が かいて ある 盤（うんどうじょう・こうえん・おみせ・でんしゃ・とうこう・がっこう2）は、背景の 絵も 横に 伸ばす。
   こうしゃ は へや（ZONES）を 伸ばす。ロングコースは そのまま（もともと 横いっぱい）。 */
const BW = { k: 1 };
const bwX = x => 800 + (x - 800) * BW.k;
function bwCalc() { if (!PH.on) return 1; const vw = 1600 + 2 * PH.E; return Math.max(1, Math.min(1.3, vw / 1600)); }
const BW_FIXED = ["undou", "kouen", "omise", "densha", "toukou", "gakkou2"];
BW_FIXED.forEach(id => { const f = BOARD_BG[id]; if (!f) return; BOARD_BG[id] = (L, B) => { const g = BW.k > 1.001 ? el("g", { transform: `translate(800 0) scale(${BW.k.toFixed(4)} 1) translate(-800 0)` }, L) : L; return f(g, B); }; });
{ const db = drawBoard; drawBoard = function () {
    const longish = (typeof isLong === "function" && isLong()) || (typeof isSL === "function" && isSL());
    BW.k = longish ? 1 : bwCalc();
    const B = BOARD[curStage];
    const src = B ? B.nodes : (typeof LAYOUT !== "undefined" && LAYOUT[curStage] ? LAYOUT[curStage].nodes : KOUSHA_NODES);
    Object.entries(src).forEach(([id, v]) => { if (NODES[id]) NODES[id][0] = bwX(v[0]); });
    if (!B && typeof KOUSHA_ZONES !== "undefined") ZONES.forEach((z, i) => { const o = KOUSHA_ZONES[i]; if (!o) return; z.x = bwX(o.x); z.w = o.w * BW.k; });
    let keep = null; if (B && B.labels && BW.k > 1.001) { keep = B.labels; B.labels = keep.map(([t, x, y]) => [t, bwX(x), y]); }
    try { db(); } finally { if (keep) B.labels = keep; }
    BOARD_PIECES.forEach(pc => { if (pc && pc.node != null && NODES[pc.node]) setPiece(pc, pc.node); });
    // 盤の 地面を 左右にも（もとの 地面は 0〜1600 しか ない）
    const first = boardLayer.firstElementChild, fill = first && first.tagName === "rect" ? first.getAttribute("fill") : null;
    if (fill) { const r = el("rect", { x: -700, y: 0, width: 3000, height: 1000, fill }); boardLayer.insertBefore(r, first); }
    if (typeof C !== "undefined" && C.pony && view === "board") place(C.pony, bwX(200), 372, .42);
  }; }
{ const sv = setView; setView = function (v, ...a) { const r = sv(v, ...a); if (v === "board" && typeof C !== "undefined" && C.pony) place(C.pony, bwX(200), 372, .42); return r; }; }
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
