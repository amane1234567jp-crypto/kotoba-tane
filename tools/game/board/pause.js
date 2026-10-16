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

/* ================= ゴールの あとは はでで ハッピーな 曲に きりかえる（2026-10-17） ================= */
{ const en = ending; ending = async function (...a) { stageBgm("goal"); return en(...a); }; }
{ const em = endingMulti; endingMulti = async function (...a) { stageBgm("goal"); return em(...a); }; }

/* ================= とちゅうで やめる ボタン（2026-10-17） =================
   ゲーム中は 左上に「⏸」。おすと「つづける」「メニューに もどる」。もどる ときは セーブしない（ページを よみなおす）。 */
(function () {
  const st = document.getElementById("stage"); if (!st) return;
  const css = document.createElement("style");
  css.textContent = `#pauseBtn{position:absolute;left:1.2%;top:1.6%;z-index:30;width:clamp(40px,5vw,60px);height:clamp(40px,5vw,60px);border-radius:50%;border:4px solid #2B2A33;background:#FFFFFFE6;font-size:clamp(18px,2.4vw,28px);line-height:1;cursor:pointer;box-shadow:0 4px 0 #2B2A3355}
#pauseBox{position:absolute;inset:0;z-index:40;background:#2B2A3399;display:flex;align-items:center;justify-content:center}
#pauseBox .pcard{background:#FFF8E8;border:6px solid #2B2A33;border-radius:32px;padding:4% 6%;display:flex;flex-direction:column;gap:18px;align-items:center}
#pauseBox .pcard b{font-size:clamp(20px,3vw,34px)}#pauseBox button{font-size:clamp(18px,2.6vw,30px);padding:10px 40px;border-radius:999px;border:5px solid #2B2A33;cursor:pointer}`;
  document.head.appendChild(css);
  const b = document.createElement("button"); b.id = "pauseBtn"; b.type = "button"; b.textContent = "⏸"; b.setAttribute("aria-label", "とめる"); st.appendChild(b);
  setInterval(() => { b.style.display = document.getElementById("startBox") || document.getElementById("pauseBox") ? "none" : ""; }, 400);
  b.onclick = () => {
    if (document.getElementById("pauseBox")) return; pauseAll();
    const box = document.createElement("div"); box.id = "pauseBox";
    box.innerHTML = '<div class="pcard"><b>ひとやすみ</b><button type="button" class="pgo" style="background:#7BD389">つづける</button><button type="button" class="pmenu" style="background:#FFD25E">メニューに もどる</button></div>';
    st.appendChild(box);
    box.querySelector(".pgo").onclick = () => { box.remove(); resumeAll(); };
    box.querySelector(".pmenu").onclick = () => { try { localStorage.setItem("kotoba-tane-skipresume", "1"); } catch (e) { } location.reload(); };
  };
})();

/* ================= れんだ しても 音が つぶれない ように（2026-10-17） =================
   こうかおんを みじかい あいだに たくさん ならすと、音が われたり 小さく なったり する。
   → 0.15びょうに 6つまで。さいごに リミッター（コンプレッサー）を はさむ。 */
{ const RL = []; const allow = () => { const t = performance.now(); while (RL.length && t - RL[0] > 150) RL.shift(); if (RL.length >= 6) return false; RL.push(t); return true; };
  const b0 = blip; blip = function (...a) { if (!allow()) return; return b0(...a); };
  if (typeof noise === "function") { const n0 = noise; noise = function (...a) { if (!allow()) return; return n0(...a); }; } }
{ const au = audio; audio = function () { const first = !ctx; const r = au(); if (first && ctx && !ctx.__lim) { try { const d = ctx.destination, c = ctx.createDynamicsCompressor(); c.threshold.value = -10; c.knee.value = 8; c.ratio.value = 6; c.attack.value = .003; c.release.value = .2; c.connect(d);
      Object.defineProperty(ctx, "destination", { value: c, configurable: true }); ctx.__lim = c; } catch (e) { } } return r; }; }
