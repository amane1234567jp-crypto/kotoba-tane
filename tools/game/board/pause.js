/* ================= iPad を とじた・ほかの アプリに うつった とき（2026-10-16） =================
   音を マナーモードでも ならすため「音楽の さいせい」あつかいに しているので、そのままだと とじても 音が ながれつづける。
   → 見えなく なったら 音（BGM・声・こうかおん）と マイクを とめる。もどったら つづきから。
   聞きとりの とちゅうで とじた ときは、もどってから その 問題を もう いちど 聞く。 */
const HIDE = { n: 0, sr: true, voices: new Set(), paused: [] };
{ const A = window.Audio; window.Audio = function (...a) { const x = new A(...a); HIDE.voices.add(x); x.addEventListener("ended", () => HIDE.voices.delete(x)); return x; }; window.Audio.prototype = A.prototype; }
function pauseAll() {
  if (HIDE.off) return; HIDE.off = true; HIDE.n++; HIDE.sr = srUsable;
  try { if (ctx && ctx.state === "running") ctx.suspend(); } catch (e) { }
  try { if (ROUTE.el) ROUTE.el.pause(); } catch (e) { }
  HIDE.paused = [...HIDE.voices].filter(a => !a.paused && !a.ended); HIDE.paused.forEach(a => { try { a.pause(); } catch (e) { } });
  try { if (typeof BGM !== "undefined" && BGM.el && !BGM.el.paused) { BGM.el.pause(); HIDE.bgmEl = true; } } catch (e) { }
}
function resumeAll() {
  if (!HIDE.off) return; HIDE.off = false;
  if (HIDE.sr && !srUsable) { srUsable = true; srStatus("idle"); } // とじた せいで とまった マイクは もとに もどす
  try { if (ctx && ctx.state !== "running") ctx.resume(); } catch (e) { }
  try { if (ROUTE.el) ROUTE.el.play().catch(() => { }); } catch (e) { }
  HIDE.paused.forEach(a => { try { a.play().catch(() => { }); } catch (e) { } }); HIDE.paused = [];
  try { if (HIDE.bgmEl) { BGM.el.play().catch(() => { }); HIDE.bgmEl = false; } } catch (e) { }
}
const whenShown = () => new Promise(r => { if (!HIDE.off) return r(); const t = setInterval(() => { if (!HIDE.off) { clearInterval(t); r(); } }, 200); });
document.addEventListener("visibilitychange", () => document.hidden ? pauseAll() : resumeAll());
window.addEventListener("pagehide", pauseAll); window.addEventListener("pageshow", () => { if (!document.hidden) resumeAll(); });
// 聞きとりの とちゅうで とじたら、もどってから もう いちど
{ const ls = listen; listen = async function (groups, ms) {
    for (;;) { await whenShown(); const n = HIDE.n; const r = await ls(groups, ms); if (HIDE.n === n && !HIDE.off) return r; } }; }
{ const hr = hear; hear = function (onText, ms) {
    const h = hr(onText, ms), n = HIDE.n; const onHide = () => { if (document.hidden) h.stop(); };
    document.addEventListener("visibilitychange", onHide); h.done.then(() => document.removeEventListener("visibilitychange", onHide));
    return h; }; }
// カードを こえで えらぶ（だいぼうけん）も 同じ
{ const sc = sayChoice; sayChoice = async function (...a) {
    for (;;) { await whenShown(); const n = HIDE.n; const r = await sc(...a); if (HIDE.n === n && !HIDE.off) return r; } }; }
