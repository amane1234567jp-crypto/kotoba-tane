/* ================= メニューの 見た目を アプリらしく（2026-10-28） =================
   2だんメニュー（menu2.js）の 中身は そのままで、見た目だけ 作りなおす。
   - 白い 枠の 中に 枠、という 入れ子を やめ、タイルを 背景の 上に じかに ならべる。
   - 上に ほそい ヘッダー：左に ことばのたね の ロゴ、右に マイクの 丸と おとな用の ⚙。
   - ジャンルの タイル：大きな えもじ・名前・クリアの すすみぐあいの 棒（「★ 0 / 9」の 文字は やめる）。
   - コースの タイル：「あそぶ」の 札を やめ、クリアは ★、とちゅうは ▶ の 小さな バッジだけ。
   - 画面の 切りかえは ふわっと（フェード）。 */
function m3Decorate() {
  const box = document.getElementById("startBox"); if (!box || !box.classList.contains("menu")) return; box.classList.add("m3");
  const h = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  // ヘッダー：ロゴ（既存の .mhero を 小さく 使う）＋ 右の 丸ボタン
  let head = box.querySelector(".m3head");
  if (!head) { head = h("div", "m3head"); const hero = box.querySelector(".mhero"); box.prepend(head); if (hero) head.append(hero);
    const right = h("div", "m3right"); head.append(right);
    const mic = h("button", "m3mic"); mic.type = "button"; mic.id = "m3mic"; mic.setAttribute("aria-label", "マイク"); mic.innerHTML = "🎤"; mic.onclick = () => micAlwaysOn(); right.append(mic);
    const ad = box.querySelector(".m2adult"); if (ad) { ad.classList.add("m3gear"); ad.textContent = "⚙"; ad.setAttribute("aria-label", "おとなの かたへ"); right.append(ad); }
  }
  m3Mic();
  // ジャンルの タイル：★ n / m → 棒
  box.querySelectorAll(".m2g").forEach(t => { const s = t.querySelector(".m2gs"); if (!s || t.querySelector(".m3bar")) return;
    const m = /(\d+)\s*\/\s*(\d+)/.exec(s.textContent);
    if (m) { const bar = h("div", "m3bar"), f = h("div", "m3fill"); f.style.width = (100 * m[1] / m[2]).toFixed(0) + "%"; bar.append(f); const n = h("span", "m3n", `${m[1]}/${m[2]}`); const play = /▶/.test(s.textContent); s.replaceWith(bar); bar.append(n); if (+m[1] && +m[1] === +m[2]) t.classList.add("m3done"); if (play) t.append(h("span", "m3badge m3play", "▶")); }
    else if (/とちゅう/.test(s.textContent)) { s.className = "m3badge m3play"; s.textContent = "▶"; }
    else if (/コース$/.test(s.textContent)) { s.className = "m3n"; }
    else if (/にん/.test(s.textContent)) { s.className = "m3n"; } });
  // コースの タイル：札 → バッジ
  box.querySelectorAll(".mst").forEach(b => { const s = b.querySelector(".mstat"); if (!s || s.dataset.m3) return; s.dataset.m3 = 1;
    if (/クリア/.test(s.textContent)) { s.className = "mstat m3badge m3clear"; s.textContent = "★"; }
    else if (/とちゅう/.test(s.textContent)) { s.className = "mstat m3badge m3play"; s.textContent = "▶"; }
    else if (/ロング/.test(s.textContent)) { s.className = "mstat m3tag"; }
    else s.className = "mstat m3hide"; });
  // 「◀ もどる」→ 丸い ← ボタン
  box.querySelectorAll(".m2back").forEach(b => { if (b.dataset.m3) return; b.dataset.m3 = 1; b.textContent = "←"; b.setAttribute("aria-label", "もどる"); });
}
function m3Mic() { const b = document.getElementById("m3mic"); if (b) b.classList.toggle("on", !!MIC.stream); }
{ const mb = micBadge; micBadge = function () { mb(); m3Mic(); }; }
{ const sm = showMenu; showMenu = function () { sm(); try { m3Decorate(); } catch (e) { console.error(e); } }; }
{ const smm = showMultiMenu; showMultiMenu = function () { smm(); try { m3Decorate(); } catch (e) { console.error(e); } }; }
{ const mo = m2Open; m2Open = function (gid) { mo(gid); try { m3Decorate(); const pg = M2.genre ? M2.page : M2.home; pg.classList.remove("m3in"); void pg.offsetWidth; pg.classList.add("m3in"); } catch (e) { } }; }
if (document.getElementById("startBox")) m3Decorate();
(function () { const s = document.createElement("style"); s.textContent = `
/* ---- 土台 ---- */
.start.menu.m3{gap:0!important;padding:0!important;background:transparent!important}
.start.menu.m3::before{content:"";position:fixed;inset:0;z-index:-1;background:linear-gradient(180deg,#FFF8E100 0%,#FFF8E1CC 32%,#FFF8E1F2 100%)}
.start.menu.m3 .mcard[data-m2]{background:transparent!important;border:0!important;box-shadow:none!important;border-radius:0!important;padding:0 max(12px,env(safe-area-inset-right)) max(8px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left))!important;backdrop-filter:none!important;width:100%!important;gap:min(1.6vh,12px)!important}
.start.menu.m3 .mmic{display:none!important}
/* ---- ヘッダー ---- */
.start.menu.m3 .m3head{flex:none;display:flex;align-items:center;justify-content:space-between;width:100%;box-sizing:border-box;height:min(15vh,76px);padding:max(6px,env(safe-area-inset-top)) max(14px,env(safe-area-inset-right)) 0 max(14px,env(safe-area-inset-left))}
.start.menu.m3 .mhero{margin:0!important;transform:none!important;flex-direction:row!important;align-items:center;gap:6px!important}
.start.menu.m3 .mhero .msay{display:none!important}
.start.menu.m3:has(.mcard[data-m2]) .m3head .mhero svg.mseed{width:min(9vh,8vw,44px)!important;height:min(9vh,8vw,44px)!important;filter:drop-shadow(0 2px 0 #2B2A3355)!important}
.start.menu.m3:has(.mcard[data-m2]) .m3head .mhero .mword span{font-size:min(7.5vh,6.2vw,36px)!important;-webkit-text-stroke-width:min(.9vh,.7vw,4px)!important;text-shadow:0 3px 0 #2B2A33!important;animation:none!important}
.start.menu.m3 .m3right{margin-left:auto;display:flex;gap:10px;align-items:center}
.start.menu.m3 .m3mic,.start.menu.m3 .m3gear{width:min(10vh,48px);height:min(10vh,48px);border-radius:50%!important;border:3px solid #2B2A33!important;background:#FFFFFF!important;box-shadow:0 3px 0 #2B2A33!important;font-size:min(5vh,24px)!important;display:grid;place-items:center;cursor:pointer;position:static!important;padding:0!important;color:#2B2A33!important;font-family:var(--body)!important;line-height:1}
.start.menu.m3 .m3mic{position:relative!important}
.start.menu.m3 .m3mic::after{content:"";position:absolute;right:-2px;top:-2px;width:30%;height:30%;border-radius:50%;background:#E8473C;border:2px solid #2B2A33}
.start.menu.m3 .m3mic.on::after{background:#5FC46A}
/* ---- ジャンルの タイル ---- */
.start.menu.m3 .mcard[data-m2] .m2home{gap:min(2vh,14px)!important}
.start.menu.m3 .mcard[data-m2] .m2g{position:relative;border:3px solid #2B2A33!important;border-radius:min(3.4vh,22px)!important;box-shadow:0 5px 0 #2B2A33!important;padding:calc(var(--cell,160px)*.06) calc(var(--cell,160px)*.08)!important;gap:0!important;justify-content:center!important;align-items:flex-start!important;text-align:left;font-size:calc(var(--cell,160px)*.12)!important;overflow:hidden;transition:transform .08s}
.start.menu.m3 .mcard[data-m2] .m2g:active{transform:translateY(3px);box-shadow:0 2px 0 #2B2A33!important}
.start.menu.m3 .mcard[data-m2] .m2g .m2gi{font-size:2em!important;line-height:1.1!important;filter:drop-shadow(0 2px 0 #2B2A3322)}
.start.menu.m3 .mcard[data-m2] .m2g .m2gn{font:400 1em var(--display)!important;line-height:1.15!important;text-align:left!important;margin-top:.2em;white-space:normal;overflow-wrap:anywhere;max-width:100%}
.start.menu.m3 .mcard[data-m2] .m2g .m3bar{position:relative;width:100%;height:.5em;margin-top:.45em;border-radius:999px;background:#2B2A3318;overflow:visible}
.start.menu.m3 .mcard[data-m2] .m2g .m3fill{height:100%;border-radius:999px;background:#5FC46A;min-width:0}
.start.menu.m3 .mcard[data-m2] .m2g .m3bar .m3n{position:absolute;right:0;bottom:.75em;font:700 .62em var(--body);color:#2B2A3399;line-height:1}
.start.menu.m3 .mcard[data-m2] .m2g .m3n{font:700 .68em var(--body);color:#2B2A3399;background:none;padding:0;margin-top:.3em}
.start.menu.m3 .mcard[data-m2] .m2g .m3badge{position:absolute;right:.5em;top:.5em}
.start.menu.m3 .mcard[data-m2] .m2g.m3done .m2gi::after{content:"★";position:absolute;right:.5em;top:.4em;font-size:.9em;color:#F2B01E;-webkit-text-stroke:2px #2B2A33;paint-order:stroke fill}
.start.menu.m3 .mcard[data-m2] .m2g.m2multi{background:#FFFFFF!important}
/* ---- コースの ページ ---- */
.start.menu.m3 .mcard[data-m2] .m2bar{gap:10px;align-items:center;min-height:min(10vh,48px)}
.start.menu.m3 .mcard[data-m2] .m2back{width:min(10vh,48px);height:min(10vh,48px);padding:0!important;border-radius:50%!important;border:3px solid #2B2A33!important;background:#FFFFFF!important;box-shadow:0 3px 0 #2B2A33!important;font:400 min(6vh,28px) var(--display)!important;display:grid;place-items:center;line-height:1}
.start.menu.m3 .mcard[data-m2] .m2title{font:400 min(5.6vh,28px) var(--display);padding:0;background:none!important;color:#2B2A33}
.start.menu.m3 .mcard[data-m2] .mstages.mstages{gap:min(1.8vh,12px)!important}
.start.menu.m3 .mcard[data-m2] .mstages.mstages .mst{border:3px solid #2B2A33!important;border-radius:min(3vh,20px)!important;box-shadow:0 4px 0 #2B2A33!important;gap:.1em!important;padding:.3em .2em!important;font-size:calc(var(--cell,140px)*.14)!important;transition:transform .08s}
.start.menu.m3 .mcard[data-m2] .mstages.mstages .mst:active{transform:translateY(3px);box-shadow:0 1px 0 #2B2A33!important}
.start.menu.m3 .mcard[data-m2] .mstages.mstages .mst .mico{font-size:2.2em!important;filter:drop-shadow(0 2px 0 #2B2A3322)}
.start.menu.m3 .mcard[data-m2] .mstages.mstages .mst .mname{font-size:.95em!important}
.start.menu.m3 .mcard[data-m2] .mstages.mstages .mst .mno{position:absolute;left:.5em;top:.35em;font:700 .7em var(--body)!important;color:#2B2A3366}
.start.menu.m3 .mcard[data-m2] .mstages.mstages .mst.mlong .mno{color:#F2B01E;-webkit-text-stroke:1.5px #2B2A33;paint-order:stroke fill;font-size:.75em!important}
.start.menu.m3 .mcard[data-m2] .mstages.mstages .mst .m3hide{display:none!important}
.start.menu.m3 .mcard[data-m2] .mstages.mstages .mst .m3tag{font:700 .62em var(--body)!important;color:#2B2A3399;background:#FFFFFFAA;border:0;border-radius:999px;padding:0 .6em!important;line-height:1.4}
.start.menu.m3 .m3badge{position:absolute;right:.4em;top:.3em;width:1.5em;height:1.5em;border-radius:50%;display:grid;place-items:center;font:700 .8em var(--body)!important;border:2px solid #2B2A33;padding:0!important;line-height:1;background:#FFD25E;color:#2B2A33}
.start.menu.m3 .m3badge.m3clear{background:#F2B01E;color:#fff;-webkit-text-stroke:0}
.start.menu.m3 .m3badge.m3play{background:#5FC46A;color:#fff;font-size:.7em!important;padding-left:.1em!important}
/* ---- みんなで ---- */
.start.menu.m3 .mcard[data-m2] .m2q{font-size:min(5vh,26px)!important}
.start.menu.m3 .mcard[data-m2] .mnums .mnum{border:3px solid #2B2A33!important;box-shadow:0 5px 0 #2B2A33!important;background:#FFFFFF!important}
.start.menu.m3 .mcard[data-m2] .mnums .mnum.on{background:#7BD389!important}
.start.menu.m3 .mcard[data-m2] .mwho .mchip{border-width:2px!important}
/* ---- 切りかえ ---- */
@keyframes m3in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.start.menu.m3 .m3in{animation:m3in .22s ease-out}
@media (prefers-reduced-motion: reduce){.start.menu.m3 .m3in{animation:none}}
/* ---- おとなの 窓 ---- */
.start.menu.m3 .m2adpanel{right:max(12px,env(safe-area-inset-right));bottom:auto;top:calc(max(6px,env(safe-area-inset-top)) + min(15vh,76px));border-width:3px;border-radius:18px;box-shadow:0 4px 0 #2B2A33}
.start.menu.m3 .m2adpanel .mreset{font:700 15px var(--body)!important;border:2px solid #2B2A33!important;border-radius:999px!important;padding:6px 14px!important;background:#FFF3D6!important}
`; document.head.appendChild(s); })();
