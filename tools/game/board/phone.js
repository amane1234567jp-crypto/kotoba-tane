/* ================= スマホの よこながの 画面（2026-10-26） =================
   iPhone を よこに すると 画面が 2:1 より 横長で、16:10 の 盤は 高さで ちぢみ、左右が あまって コマが ちいさかった。
   → スマホでは 画面いっぱいに ひろげる（ノッチは よける）。
     盤：横はばいっぱいまで 拡大し、うごいている コマを カメラが 上下に おいかける。
     場面：上の かざり（まど など）を すこし きって、横はばいっぱいに ちかづける（2026-10-26 よる。小さいと いわれて）。
       おだいカードと 上に はりついた ふきだしは、きった ぶん 下に ずらす。
   iPad（4:3 ちかい）では なにも かわらない。 */
const PH = { a: 1.6, crop: 0, vb: null, on: false, E: 0, k: 1, cy: 0, ty: 0, follow: null, last: new Map(), bubCam: false, was: null };
const camChars = el("g", {}, charLayer);
function phDecide() {
  const w = innerWidth, h = innerHeight, kid = document.body.classList.contains("kid");
  const on = kid && w / h > 1.7 && h < 620;
  document.body.classList.toggle("phone", on);
  document.body.classList.toggle("phoneport", kid && h / w > 1.3 && w < 620);
  const r = svg.getBoundingClientRect(), a = r.width && r.height ? r.width / r.height : 1.6;
  PH.on = on && a > 1.62; PH.E = PH.on ? (1000 * a - 1600) / 2 : 0; PH.k = PH.on ? (1600 + 2 * PH.E) / 1600 : 1;
  PH.a = a; PH.crop = PH.on ? Math.min(200, Math.max(0, 1000 - 1600 / a)) : 0; PH.vb = null;
}
const phSceneMode = () => PH.on && view !== "menu" && boardLayer.style.display === "none";
function phViewBox(mode) { if (PH.vb === mode) return; PH.vb = mode;
  if (mode === "scene") { const H = 1000 - PH.crop, W = H * PH.a; svg.setAttribute("viewBox", `${(-(W - 1600) / 2).toFixed(1)} ${PH.crop.toFixed(1)} ${W.toFixed(1)} ${H.toFixed(1)}`); }
  else if (mode === "cover") { const H = 1600 / PH.a; svg.setAttribute("viewBox", `0 ${((1000 - H) / 2).toFixed(1)} 1600 ${H.toFixed(1)}`); }
  else svg.setAttribute("viewBox", `${(-PH.E).toFixed(1)} 0 ${(1600 + 2 * PH.E).toFixed(1)} 1000`); }
addEventListener("resize", () => setTimeout(phDecide, 60)); addEventListener("orientationchange", () => setTimeout(phDecide, 300));
phDecide(); setTimeout(phDecide, 500);
const phCam = () => `translate(${(-PH.E).toFixed(1)} ${(-PH.cy).toFixed(1)}) scale(${PH.k.toFixed(4)})`;
const phFeet = c => [c.x + 200 * c.s, c.y + (c.base || 0) * c.s];
{ const _say = say; say = function (c, text) { _say(c, text); PH.bubCam = !!(c && BOARD_PIECES.includes(c)); bub.setAttribute("transform", PH.bubCam && PH.was === "cam" ? phCam() : "");
    if (phSceneMode()) { const y = +bubR.getAttribute("y") || 0; if (y < PH.crop + 10) bub.setAttribute("transform", `translate(0 ${(PH.crop + 10 - y).toFixed(1)})`); } }; }
{ const _st = showTask; showTask = function (text, tag, cy = 230) { return _st(text, tag, PH.on && view !== "board" && view !== "menu" && cy < 500 ? cy + PH.crop : cy); }; }
function phTick() {
  document.body.classList.toggle("inmenu", view === "menu");
  const board = boardLayer.style.display !== "none" && view !== "menu";
  const cam = PH.on && board;
  phViewBox(PH.on && view === "menu" ? "cover" : phSceneMode() ? "scene" : "wide");
  if (cam) {
    BOARD_PIECES.forEach(c => { if (c && c.root && c.root.parentNode !== camChars) camChars.appendChild(c.root); });
    // うごいた コマを おいかける（とまって いる ときは さいごに うごいた コマ。さいしょは こども）
    let moved = null; BOARD_PIECES.forEach(c => { if (!c || c.root.style.display === "none") return; const p = phFeet(c), q = PH.last.get(c); if (q && Math.hypot(p[0] - q[0], p[1] - q[1]) > .8) moved = c; PH.last.set(c, p); });
    if (moved) PH.follow = moved; if (!PH.follow || !BOARD_PIECES.includes(PH.follow)) PH.follow = (typeof P !== "undefined" && P.shima && BOARD_PIECES.includes(P.shima)) ? P.shima : BOARD_PIECES[1] || BOARD_PIECES[0];
    const maxY = 1000 * (PH.k - 1), fy = PH.follow ? phFeet(PH.follow)[1] : 500;
    PH.ty = Math.max(0, Math.min(maxY, fy * PH.k - 640));
    if (PH.was !== "cam") PH.cy = PH.ty; else PH.cy += (PH.ty - PH.cy) * .1;
    const t = phCam(); [boardLayer, camChars, fxLayer].forEach(g => g.setAttribute("transform", t)); if (PH.bubCam) bub.setAttribute("transform", t);
    // ナビの ぽにーは カメラに のせず、左下に ちいさく
    //   盤の 上に いると マスに かさなるので、しゃべって いる ときだけ 出す
    if (typeof C !== "undefined" && C.pony && view === "board") { place(C.pony, -PH.E + 120, 985, .36); C.pony.root.style.display = speaker === C.pony ? "" : "none"; }
    PH.was = "cam";
  } else if (PH.was !== "flat") {
    [boardLayer, camChars, fxLayer, bub].forEach(g => g.removeAttribute("transform")); PH.was = "flat";
    if (view === "board" && typeof C !== "undefined" && C.pony) place(C.pony, 200, 372, .42);
  }
  // わかれみちの やじるし（HTML の ボタン）を カメラに あわせる
  stage.querySelectorAll(".arrow[data-wx]").forEach(b => {
    const x = +b.dataset.wx, y = +b.dataset.wy, r = svg.getBoundingClientRect(), s = r.height / 1000;
    const X = cam ? -PH.E + x * PH.k : x, Y = cam ? y * PH.k - PH.cy : y;
    const sr = stage.getBoundingClientRect();
    b.style.left = (r.left - sr.left + (X + PH.E) * s - b.offsetWidth / 2) + "px"; b.style.top = (r.top - sr.top + Y * s - b.offsetHeight * .5) + "px";
  });
  requestAnimationFrame(phTick);
}
requestAnimationFrame(phTick);
{ const css = document.createElement("style"); css.textContent = `
body.phone { overflow: hidden; overscroll-behavior: none }
body.phone .wrap { padding: 0; max-width: none; display: block }
body.phone .stage { position: fixed; inset: 0; width: 100vw; height: 100dvh; aspect-ratio: auto; border: 0; border-radius: 0; background: #FFF8E1;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left); box-sizing: border-box }
body.phone .dice { width: auto; height: 21%; right: calc(env(safe-area-inset-right) + 1.5%); top: 3% }
body.phone .arrow { width: auto; height: 20% }
body.phone #pauseBtn { left: calc(env(safe-area-inset-left) + 1%); top: 3%; width: 44px; height: 44px }
body.phone.srfail .srfb { position: fixed; z-index: 40; left: 50%; bottom: 6px; transform: translateX(-50%); width: min(560px, 90vw); padding: 6px 10px }
body.phone .srfb-msg, body.phone .srfb-hint { display: none }
body.phone .srfb-row button { min-height: 44px; font-size: 16px }
.rotate-hint { display: none }
body.phoneport:not(.inmenu) .rotate-hint { display: grid; position: fixed; inset: 0; z-index: 100; place-items: center; background: #FFF8E1; font: 400 28px var(--display); color: #2B2A33; text-align: center }
`; document.head.appendChild(css);
  const r = document.createElement("div"); r.className = "rotate-hint"; r.innerHTML = `<div><div style="font-size:72px">📱↻</div>よこに してね</div>`; document.body.appendChild(r); }
