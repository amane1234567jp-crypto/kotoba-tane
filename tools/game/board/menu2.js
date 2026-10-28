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
    const start = (resume) => { if (!resume) { SAVE.play = null; saveNow(); }
      try { localStorage.setItem(GENRE_KEY, b.dataset.g || ""); } catch (e) { }
      boot(); box.remove(); resume ? newGame({ resume: true }) : newGame(isLong ? { stage: id, soloLong: true } : { stage: id }); };
    // とちゅうの コースは「つづきから／はじめから」を えらぶ（2026-10-27）
    b.onclick = () => SAVE.play && SAVE.play.stage === id ? m2Ask(box, b, start) : start(false);
  });
  // ① ジャンル
  const home = h("div", "m2home"), page = h("div", "m2page"); page.hidden = true;
  const playing = SAVE.play && SAVE.play.stage;
  GENRES.forEach(([gid, ic, nm]) => {
    const bs = [...list.querySelectorAll(`:scope > .mst[data-g="${gid}"]`)]; if (!bs.length) return;
    const clr = bs.filter(b => /クリア/.test(b.textContent)).length;
    const t = h("button", "m2g g-" + gid); t.type = "button";
    t.append(h("span", "m2gi", ic), h("span", "m2gn", nm), h("span", "m2gs", `★ ${clr} / ${bs.length}` + (bs.some(b => b.dataset.sid === playing) ? " ▶" : "")));
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
  Object.assign(M2, { home, page, list, title, n: home.children.length, homeBar: null, nump: null });
  m2Open(null);
}
function m2Ask(box, b, start) {
  const h = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const ov = h("div", "m2ask"), pn = h("div", "m2askp");
  const ic = b.querySelector(".mico"), nm = b.querySelector(".mname");
  pn.append(h("div", "m2askt", `${ic ? ic.textContent : ""} ${nm ? nm.textContent : ""}`));
  const row = h("div", "m2askr"), go = h("button", "m2go", "▶ つづきから"), re = h("button", "m2re", "↻ はじめから"), x = h("button", "m2x", "×");
  [go, re, x].forEach(e => e.type = "button"); go.onclick = () => start(true); re.onclick = () => start(false); x.onclick = () => ov.remove();
  ov.onclick = e => { if (e.target === ov) ov.remove(); };
  row.append(go, re); pn.append(x, row); ov.append(pn); box.append(ov);
}
/* みんなで あそぶ も おなじ 形に（2026-10-27）：① なんにん → ② ジャンル → ③ コース */
function m2BuildMulti() {
  const box = document.getElementById("startBox"); const card = box && box.querySelector(".mmcard"); if (!card || card.dataset.m2) return;
  const list = card.querySelector(".mstages"), nums = card.querySelector(".mnums"), who = card.querySelector(".mwho"); if (!list || !nums) return; card.dataset.m2 = 1;
  card.querySelectorAll(".mhead, .mtitle, .mreset").forEach(e => e.remove()); list.style.display = "";
  const h = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const bk = (fn) => { const b = h("button", "m2back", "◀ もどる"); b.type = "button"; b.onclick = fn; return b; };
  const nump = h("div", "m2nump"), nbar = h("div", "m2bar"); nbar.append(bk(() => showMenu()), h("div", "m2title", "👥 みんなで あそぶ"));
  nump.append(nbar, h("div", "m2q", "なんにんで あそぶ？"), nums);
  nums.querySelectorAll(".mnum").forEach(b => b.addEventListener("click", () => m2Nums(false)));
  const hbar = h("div", "m2bar"); hbar.append(bk(() => m2Nums(true))); if (who) hbar.append(who);
  const home = h("div", "m2home"), page = h("div", "m2page");
  GENRES.forEach(([gid, ic, nm]) => { const n = list.querySelectorAll(`:scope > .mst[data-g="${gid}"]`).length; if (!n) return;
    const t = h("button", "m2g g-" + gid); t.type = "button"; t.append(h("span", "m2gi", ic), h("span", "m2gn", nm), h("span", "m2gs", `${n}コース`)); t.onclick = () => m2Open(gid); home.append(t); });
  const bar = h("div", "m2bar"), title = h("div", "m2title"); bar.append(bk(() => m2Open(null)), title); page.append(bar, list);
  card.append(nump, hbar, home, page);
  Object.assign(M2, { home, page, list, title, n: home.children.length, homeBar: hbar, nump });
  m2Nums(true);
}
function m2Nums(on) { M2.nump.hidden = !on; if (on) requestAnimationFrame(() => m2Fit(M2.nump.querySelector(".mnums"), 5)); if (on) { M2.home.hidden = M2.page.hidden = M2.homeBar.hidden = true; M2.genre = "nums"; } else m2Open(null); }
function m2Open(gid) {
  M2.genre = gid; const card = M2.home.parentElement; card.classList.toggle("m2in", !!gid);
  M2.home.hidden = !!gid; M2.page.hidden = !gid; if (M2.homeBar) M2.homeBar.hidden = !!gid; if (M2.nump) M2.nump.hidden = true;
  if (!gid) { requestAnimationFrame(() => m2Fit(M2.home, M2.n)); return; }
  const g = GENRES.find(x => x[0] === gid); M2.title.textContent = `${g[1]} ${g[2]}`; M2.title.className = "m2title g-" + gid;
  let n = 0; M2.list.querySelectorAll(":scope > .mst").forEach(b => { const on = b.dataset.g === gid; b.classList.toggle("m2off", !on); if (on) n++; });
  requestAnimationFrame(() => m2Fit(M2.list, n));
}
addEventListener("resize", () => setTimeout(() => { if (!M2.home || !M2.home.isConnected) return; M2.genre === "nums" ? 0 : M2.genre ? m2Open(M2.genre) : m2Fit(M2.home, M2.n); }, 80));
{ const smm = showMultiMenu; showMultiMenu = function () { smm(); try { m2BuildMulti(); } catch (e) { console.error(e); } }; }
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
.start.menu .mcard[data-m2] .m2nump[hidden],.start.menu .mcard[data-m2] .m2bar[hidden],.start.menu .mcard[data-m2] .m2home[hidden],.start.menu .mcard[data-m2] .m2page[hidden],.start.menu .m2adpanel[hidden],.m2adpanel[hidden]{display:none!important}
.mcard[data-m2] .m2page{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;gap:1vh;width:100%}
.start.menu .mcard[data-m2] .mstages.mstages .mst.m2off{display:none!important}
.mcard[data-m2] .m2g{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.3em;border:min(.8vh,5px) solid #2B2A33;border-radius:min(3vh,22px);box-shadow:0 min(.8vh,5px) 0 #2B2A33;cursor:pointer;color:#2B2A33;padding:4px;min-width:0;min-height:0;font-size:calc(var(--cell, 160px) * .13)}
.mcard[data-m2] .m2g .m2gi{font-size:2.4em;line-height:1}.m2g .m2gn{font:400 1.05em var(--display);line-height:1.15;text-align:center}.m2g .m2gs{font:700 .8em var(--body);background:#FFFFFFCC;border-radius:999px;padding:0 .7em}
.mcard[data-m2] .m2g.g-gakkou{background:#FFE0E6}.mcard[data-m2] .m2g.g-jugyou{background:#FFEFC9}.mcard[data-m2] .m2g.g-machi{background:#DDF0FF}.mcard[data-m2] .m2g.g-ouchi{background:#DDF2D0}.mcard[data-m2] .m2g.g-tsutaeru{background:#FFE3F1}.mcard[data-m2] .m2g.g-kangaeru{background:#ECE4FF}.mcard[data-m2] .m2g.g-long{background:#FFE9B8}
.mcard[data-m2] .m2g.m2multi{background:#FFFFFF!important;margin:0!important;width:auto!important}
.m2bar{flex:none;display:flex;align-items:center;gap:12px}
.start.menu .mcard[data-m2] .m2back{white-space:nowrap;flex:none;font:400 min(5vh,24px) var(--display)!important;padding:.15em .8em;border-radius:999px;border:min(.7vh,4px) solid #2B2A33;background:#FFD25E;color:#2B2A33;cursor:pointer;box-shadow:0 3px 0 #2B2A33}
.start.menu .mcard[data-m2] .m2title{font:400 min(4.4vh,26px) var(--display);padding:0 .6em;border-radius:999px}
.start.menu .mcard[data-m2] .mstages.mstages .mst{min-width:0;min-height:0!important;height:auto!important;padding:2px!important;display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:.15em;font-size:calc(var(--cell, 140px) * .135)}
.start.menu .mcard[data-m2] .mstages.mstages .mst .mico{font-size:2.4em!important;line-height:1}
.start.menu .mcard[data-m2] .mstages.mstages .mst .mname{font-size:1em!important;line-height:1.15}
.start.menu .mcard[data-m2] .mstages.mstages .mst .mstat{font-size:.8em!important}
.start.menu .mcard[data-m2] .mstages.mstages .mst .mno{font-size:.85em!important}
.start.menu .mcard[data-m2] .m2nump{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;gap:2vh;width:100%}
.start.menu .mcard[data-m2] .m2q{font:400 min(6vh,32px) var(--display);text-align:center;color:#2B2A33}
.start.menu .mcard[data-m2] .mnums{flex:1 1 auto;min-height:0;display:grid!important;gap:min(2vh,14px)!important;width:100%;margin:0!important}
.start.menu .mcard[data-m2] .mnums .mnum{min-height:0!important;height:auto!important;font:400 min(9vh,6vw,48px) var(--display)!important;border-radius:min(4vh,26px)!important;padding:0!important}
.start.menu .mcard[data-m2] .mwho{display:flex;flex-wrap:wrap;gap:6px;margin:0!important;font-size:min(3.4vh,16px)}
.start.menu .mcard[data-m2] .mwho .mchip{padding:0 .6em!important}
.m2ask{position:fixed;inset:0;z-index:60;display:grid;place-items:center;background:#2B2A3366}
.start.menu .m2ask .m2askp{position:relative;background:#fff;border:min(.9vh,6px) solid #2B2A33;border-radius:min(5vh,32px);box-shadow:0 8px 0 #2B2A33;padding:min(4vh,28px) min(5vw,36px);display:grid;gap:min(3vh,20px);justify-items:center;width:min(86vw,640px);box-sizing:border-box}
.start.menu .m2ask .m2askt{font:400 min(6vh,30px) var(--display);color:#2B2A33;text-align:center}
.start.menu .m2ask .m2askr{display:grid;grid-template-columns:1fr 1fr;gap:min(3vw,18px);width:100%}
.start.menu .m2ask .m2askr button{font:400 min(7vh,4.4vw,34px) var(--display)!important;padding:min(4vh,22px) 4px;border-radius:999px!important;border:min(.8vh,5px) solid #2B2A33!important;box-shadow:0 6px 0 #2B2A33!important;color:#2B2A33!important;cursor:pointer;white-space:nowrap}
.start.menu .m2ask .m2askr .m2go{background:#8FD18B!important}.start.menu .m2ask .m2askr .m2re{background:#FFD25E!important}
.start.menu .m2ask .m2x{position:absolute;right:10px;top:6px;font:700 min(6vh,28px) var(--body);background:none;border:0;color:#5E5A6B;cursor:pointer;padding:4px 10px}
.m2adult{position:fixed;z-index:51;right:calc(env(safe-area-inset-right) + 8px);bottom:calc(env(safe-area-inset-bottom) + 6px);font:700 12px var(--body);color:#5E5A6B;background:#FFFFFFCC;border:2px solid #5E5A6B55;border-radius:999px;padding:4px 12px;cursor:pointer}
.m2adpanel{position:fixed!important;z-index:52;right:12px;bottom:40px;display:flex!important;flex-wrap:wrap;gap:8px;align-items:center;background:#FFFFFF;border:3px solid #2B2A33;border-radius:16px;padding:10px 12px;max-width:90vw}
.mcard[data-m2] .madult{display:none!important}
`; document.head.appendChild(s); })();
