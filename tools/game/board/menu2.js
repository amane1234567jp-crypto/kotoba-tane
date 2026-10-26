/* ================= メニューを スクロール なしに（2026-10-26） =================
   コースが 50 ちかく あり、スマホでは メニューが 画面に おさまらず スクロールに なっていた。
   → 2だんに する：① ジャンルを えらぶ（大きな ボタン 8つ）→ ② その ジャンルの コース（画面に おさまる ように ならべる）。
   「つづきから」ボタンは なくす。セーブは 自動。とちゅうの コースを おせば つづきから、ほかの コースを おせば あたらしく はじまる。
   セーブを けす・きろくは 「おとなの かたへ」（右下の ちいさな ボタン）の なかに。 */
const M2 = { genre: null };
function m2Fit(grid, n) { // カードが なるべく 正方形に ちかく なる れつの かず
  const r = grid.getBoundingClientRect(); if (!r.width || !r.height) return;
  let best = 1, bs = 0; for (let c = 1; c <= n; c++) { const rows = Math.ceil(n / c), w = r.width / c, h = r.height / rows, s = Math.min(w, h * 1.05); if (s > bs) { bs = s; best = c; } }
  grid.style.setProperty("grid-template-columns", `repeat(${best}, minmax(0, 1fr))`, "important"); grid.style.setProperty("grid-template-rows", `repeat(${Math.ceil(n / best)}, minmax(0, 1fr))`, "important");
  grid.style.setProperty("--cell", Math.min(r.width / best, r.height / Math.ceil(n / best)) + "px");
}
function m2Build() {
  const box = document.getElementById("startBox"); const card = box && box.querySelector(".mcard:not(.mmcard)"); if (!card || card.dataset.m2) return; card.dataset.m2 = 1;
  const list = card.querySelector(".mstages"); if (!list) return;
  card.querySelectorAll(".mbig, .mhead, .mlap").forEach(e => e.remove());
  const h = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  // コースの ボタン：とちゅうなら つづきから、そうで なければ あたらしく（たしかめの まどは 出さない）
  const longs = typeof SOLO_LONGS === "function" ? SOLO_LONGS() : []; let li = 0;
  list.querySelectorAll(":scope > .mst").forEach(b => {
    const id = b.dataset.st || (b.classList.contains("mslong") ? longs[li++] : null); if (!id || b.disabled) return; b.dataset.sid = id;
    const isLong = b.classList.contains("mslong");
    b.onclick = () => { const resume = SAVE.play && SAVE.play.stage === id; if (!resume) { SAVE.play = null; saveNow(); }
      try { localStorage.setItem(GENRE_KEY, b.dataset.g || ""); } catch (e) { }
      boot(); box.remove(); resume ? newGame({ resume: true }) : newGame(isLong ? { stage: id, soloLong: true } : { stage: id }); };
  });
  // ① ジャンル
  const home = h("div", "m2home"), page = h("div", "m2page"); page.hidden = true;
  const playing = SAVE.play && SAVE.play.stage;
  GENRES.forEach(([gid, ic, nm]) => {
    const bs = [...list.querySelectorAll(`:scope > .mst[data-g="${gid}"]`)]; if (!bs.length) return;
    const clr = bs.filter(b => /クリア/.test(b.textContent)).length;
    const t = h("button", "m2g g-" + gid); t.type = "button";
    t.append(h("span", "m2gi", ic), h("span", "m2gn", nm), h("span", "m2gs", bs.some(b => b.dataset.sid === playing) ? "▶ とちゅう" : `★ ${clr} / ${bs.length}`));
    t.onclick = () => m2Open(gid); home.append(t);
  });
  const mm = card.querySelector(".mmulti"); if (mm) { mm.classList.add("m2g", "m2multi"); mm.innerHTML = `<span class="m2gi">👥</span><span class="m2gn">みんなで</span><span class="m2gs">2〜6にん</span>`; home.append(mm); }
  // ② コース
  const bar = h("div", "m2bar"), back = h("button", "m2back", "◀ もどる"), title = h("div", "m2title"); back.type = "button"; back.onclick = () => m2Open(null);
  bar.append(back, title); page.append(bar, list);
  // おとなの かたへ
  const ad = card.querySelector(".madult"); const adBtn = h("button", "m2adult", "おとなの かたへ"); adBtn.type = "button";
  if (ad) { ad.classList.add("m2adpanel"); ad.hidden = true; const cl = h("button", "mreset", "とじる"); cl.type = "button"; cl.onclick = () => ad.hidden = true; ad.append(cl); adBtn.onclick = () => ad.hidden = false; box.append(ad); }
  card.append(home, page); box.append(adBtn);
  M2.home = home; M2.page = page; M2.list = list; M2.title = title; M2.n = home.children.length;
  m2Open(null);
}
function m2Open(gid) {
  M2.genre = gid; const card = M2.home.parentElement; card.classList.toggle("m2in", !!gid);
  M2.home.hidden = !!gid; M2.page.hidden = !gid;
  if (!gid) { requestAnimationFrame(() => m2Fit(M2.home, M2.n)); return; }
  const g = GENRES.find(x => x[0] === gid); M2.title.textContent = `${g[1]} ${g[2]}`; M2.title.className = "m2title g-" + gid;
  let n = 0; M2.list.querySelectorAll(":scope > .mst").forEach(b => { const on = b.dataset.g === gid; b.classList.toggle("m2off", !on); if (on) n++; });
  requestAnimationFrame(() => m2Fit(M2.list, n));
}
addEventListener("resize", () => setTimeout(() => { if (!M2.home || !M2.home.isConnected) return; M2.genre ? m2Open(M2.genre) : m2Fit(M2.home, M2.n); }, 80));
{ const sm = showMenu; showMenu = function () { sm(); try { m2Build(); } catch (e) { console.error(e); } }; }
if (document.querySelector("#startBox .mcard:not(.mmcard) .mstages")) m2Build();
(function () { const s = document.createElement("style"); s.textContent = `
.start.menu:has(.mcard[data-m2]){position:fixed!important;inset:0!important;z-index:50!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;gap:1.2vh!important;
  padding:calc(env(safe-area-inset-top) + 1.2vh) calc(env(safe-area-inset-right) + 10px) calc(env(safe-area-inset-bottom) + 1.2vh) calc(env(safe-area-inset-left) + 10px)!important;box-sizing:border-box;background:transparent!important}
.start.menu:has(.mcard[data-m2]) .mhero{margin:0!important;flex:none;transform-origin:50% 0}
.start.menu:has(.mcard[data-m2]) .mhero .mword span{font-size:min(11vh,7.2vw,82px)!important;-webkit-text-stroke-width:min(1.2vh,.8vw,9px)!important}
.start.menu:has(.mcard[data-m2]) .mhero svg.mseed{width:min(12vh,8vw,96px)!important;height:min(12vh,8vw,96px)!important}
.start.menu:has(.mcard[data-m2]) .msay{font-size:min(3.4vh,2vw,20px)!important;padding:0 14px!important;border-width:3px!important}
.mcard[data-m2]{flex:1 1 auto;min-height:0;max-height:none!important;overflow:hidden!important;display:flex!important;flex-direction:column;width:min(100%,1180px)!important;box-sizing:border-box;padding:1.4vh 1.4vh!important;gap:1vh!important;border-radius:min(4vh,28px)!important}
.mcard[data-m2] .mmic{flex:none;font-size:min(2.8vh,15px);line-height:1.2;margin:0}
.start.menu .mcard[data-m2] .m2home,.start.menu .mcard[data-m2] .mstages.mstages{grid-auto-rows:auto!important;flex:1 1 auto;min-height:0;display:grid!important;gap:min(1.6vh,12px)!important;width:100%;align-content:stretch}
.start.menu .mcard[data-m2] .m2home[hidden],.start.menu .mcard[data-m2] .m2page[hidden],.start.menu .m2adpanel[hidden],.m2adpanel[hidden]{display:none!important}
.mcard[data-m2] .m2page{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;gap:1vh;width:100%}
.start.menu .mcard[data-m2] .mstages.mstages .mst.m2off{display:none!important}
.mcard[data-m2] .m2g{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.3em;border:min(.8vh,5px) solid #2B2A33;border-radius:min(3vh,22px);box-shadow:0 min(.8vh,5px) 0 #2B2A33;cursor:pointer;color:#2B2A33;padding:4px;min-width:0;min-height:0;font-size:calc(var(--cell, 160px) * .13)}
.mcard[data-m2] .m2g .m2gi{font-size:2.4em;line-height:1}.m2g .m2gn{font:400 1.05em var(--display);line-height:1.15;text-align:center}.m2g .m2gs{font:700 .8em var(--body);background:#FFFFFFCC;border-radius:999px;padding:0 .7em}
.mcard[data-m2] .m2g.g-gakkou{background:#FFE0E6}.mcard[data-m2] .m2g.g-jugyou{background:#FFEFC9}.mcard[data-m2] .m2g.g-machi{background:#DDF0FF}.mcard[data-m2] .m2g.g-ouchi{background:#DDF2D0}.mcard[data-m2] .m2g.g-tsutaeru{background:#FFE3F1}.mcard[data-m2] .m2g.g-kangaeru{background:#ECE4FF}.mcard[data-m2] .m2g.g-long{background:#FFE9B8}
.mcard[data-m2] .m2g.m2multi{background:#FFFFFF!important;margin:0!important;width:auto!important}
.m2bar{flex:none;display:flex;align-items:center;gap:12px}
.start.menu .mcard[data-m2] .m2back{font:400 min(5vh,24px) var(--display)!important;padding:.15em .8em;border-radius:999px;border:min(.7vh,4px) solid #2B2A33;background:#FFD25E;color:#2B2A33;cursor:pointer;box-shadow:0 3px 0 #2B2A33}
.start.menu .mcard[data-m2] .m2title{font:400 min(4.4vh,26px) var(--display);padding:0 .6em;border-radius:999px}
.start.menu .mcard[data-m2] .mstages.mstages .mst{min-width:0;min-height:0!important;height:auto!important;padding:2px!important;display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:.15em;font-size:calc(var(--cell, 140px) * .135)}
.start.menu .mcard[data-m2] .mstages.mstages .mst .mico{font-size:2.4em!important;line-height:1}
.start.menu .mcard[data-m2] .mstages.mstages .mst .mname{font-size:1em!important;line-height:1.15}
.start.menu .mcard[data-m2] .mstages.mstages .mst .mstat{font-size:.8em!important}
.start.menu .mcard[data-m2] .mstages.mstages .mst .mno{font-size:.85em!important}
.m2adult{position:fixed;z-index:51;right:calc(env(safe-area-inset-right) + 8px);bottom:calc(env(safe-area-inset-bottom) + 6px);font:700 12px var(--body);color:#5E5A6B;background:#FFFFFFCC;border:2px solid #5E5A6B55;border-radius:999px;padding:4px 12px;cursor:pointer}
.m2adpanel{position:fixed!important;z-index:52;right:12px;bottom:40px;display:flex!important;flex-wrap:wrap;gap:8px;align-items:center;background:#FFFFFF;border:3px solid #2B2A33;border-radius:16px;padding:10px 12px;max-width:90vw}
.mcard[data-m2] .madult{display:none!important}
`; document.head.appendChild(s); })();
