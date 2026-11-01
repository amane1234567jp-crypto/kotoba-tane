/* ================= アプリを おわる ボタン（2026-11-01） =================
   メニューの 右上（⚙ の となり）に「おわる」。おすと たしかめて、音・マイクを とめて「またね」の 画面に する。
   アプリ（ホームがめんに おいた もの・ストアの アプリ）では とじる。ブラウザでは とじられない ことが ある ので、おしまいの 画面を 出す。 */
function appExit() {
  const ov = document.createElement("div"); ov.className = "kexit";
  ov.innerHTML = `<div class="kexit-box"><div class="kexit-q">🚪 おわりに する？</div><div class="kexit-row"><button type="button" class="kexit-yes">おわる</button><button type="button" class="kexit-no">まだ あそぶ</button></div></div>`;
  document.body.append(ov); try { iconifyHtml(ov); } catch (e) { }
  ov.querySelector(".kexit-no").onclick = () => ov.remove();
  ov.querySelector(".kexit-yes").onclick = () => {
    try { pauseAll(); } catch (e) { } try { if (typeof MIC !== "undefined" && MIC.stream) MIC.stream.getTracks().forEach(t => t.stop()); } catch (e) { }
    try { if (ctx) ctx.suspend(); } catch (e) { }
    try { const C = window.Capacitor; if (C && C.Plugins && C.Plugins.App && C.Plugins.App.exitApp) { C.Plugins.App.exitApp(); return; } } catch (e) { }
    try { window.close(); } catch (e) { }
    ov.innerHTML = `<div class="kexit-box kexit-bye"><div class="kexit-big">👋</div><div class="kexit-q">またね！</div><div class="kexit-sub">この がめんは とじて だいじょうぶ</div><button type="button" class="kexit-no">もう いちど あそぶ</button></div>`;
    try { iconifyHtml(ov); } catch (e) { }
    ov.querySelector(".kexit-no").onclick = () => { ov.remove(); try { HIDE.off = true; resumeAll(); } catch (e) { } try { audio(); } catch (e) { } };
  };
}
{ const add = () => { const r = document.querySelector("#startBox .m3right"); if (!r || r.querySelector(".m3exit")) return;
    const b = document.createElement("button"); b.type = "button"; b.className = "m3exit"; b.setAttribute("aria-label", "おわる"); b.innerHTML = "おわる"; b.onclick = appExit; r.append(b); };
  setInterval(add, 500); add(); // メニューの ときだけ はたらく（ゲーム中は なにも しない）
  const st = document.createElement("style"); st.textContent = `
.start.menu.m3 .m3exit{height:min(10vh,48px);padding:0 .8em;border-radius:999px!important;border:3px solid #2B2A33!important;background:#FFE0E6!important;box-shadow:0 3px 0 #2B2A33!important;font:inherit;font-size:min(4.2vh,20px);color:#2B2A33;margin-left:.4em;cursor:pointer}
.kexit{position:fixed;inset:0;z-index:200;background:#2B2A3399;display:grid;place-items:center}
.kexit-box{background:#FFF8E8;border:4px solid #2B2A33;border-radius:28px;box-shadow:0 6px 0 #2B2A33;padding:28px 34px;text-align:center;max-width:min(90vw,560px)}
.kexit-q{font-size:min(7vh,40px);margin-bottom:18px}
.kexit-big{font-size:min(16vh,96px);line-height:1}
.kexit-sub{font-size:min(4vh,20px);margin:-6px 0 18px;color:#5A5F6E}
.kexit-row{display:flex;gap:16px;justify-content:center}
.kexit button{font:inherit;font-size:min(5vh,28px);padding:.5em 1.1em;border-radius:999px;border:3px solid #2B2A33;box-shadow:0 3px 0 #2B2A33;background:#FFFFFF;cursor:pointer}
.kexit .kexit-yes{background:#FF8FA3;color:#FFFFFF}
`; document.head.appendChild(st); }
