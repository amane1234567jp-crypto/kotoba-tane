/* ================= メニュー画面（2026-10-14 作りこみ） =================
   うしろは 絵の 世界（そら・おか・がっこう・木・くも・キャラたち）。
   タイトルは 1もじずつ ちがう 色の ふくらんだ 文字と、ことばの たね（めが でた たね ＋ ふきだし）。 */
let MENU_TIMERS = [];
function menuScene() {
  MENU_TIMERS.forEach(clearInterval); MENU_TIMERS = [];
  clearMarks(); view = "menu"; chars.forEach(c => c.root.style.display = "none"); visible.length = 0; unsay(); showEar(null, false); hideTask();
  boardLayer.style.display = "none"; sceneLayer.style.display = ""; hud.style.display = "none"; diceBtn.style.visibility = "hidden";
  const L = sceneLayer; L.innerHTML = "";
  // そら（グラデーション）
  const df = el("defs", {}, L);
  const sky = el("linearGradient", { id: "mSky", x1: 0, y1: 0, x2: 0, y2: 1 }, df);
  [["0", "#9FD8F5"], [".6", "#D9F1FB"], ["1", "#FFF6DC"]].forEach(([o, c]) => el("stop", { offset: o, "stop-color": c }, sky));
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "url(#mSky)" }, L);
  // おひさま（ゆっくり まわる ひかり）
  const sun = el("g", { transform: "translate(1515 95) scale(.68)" }, L); const rays = el("g", {}, sun);
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; el("path", { d: `M${Math.cos(a) * 92} ${Math.sin(a) * 92} L${Math.cos(a + .13) * 130} ${Math.sin(a + .13) * 130} L${Math.cos(a - .13) * 130} ${Math.sin(a - .13) * 130} Z`, fill: "#FFD25E", ...S6(4) }, rays); }
  el("circle", { r: 78, fill: "#FFE27A", ...S6(6) }, sun);
  [[-26, -10], [26, -10]].forEach(([x, y]) => el("ellipse", { cx: x, cy: y, rx: 7, ry: 10, fill: INK }, sun));
  el("path", { d: "M-24 18 Q0 40 24 18", fill: "none", ...S6(6) }, sun); [[-46, 14], [46, 14]].forEach(([x, y]) => el("ellipse", { cx: x, cy: y, rx: 12, ry: 7, fill: "#FF9FB0" }, sun));
  // くも（ながれる）
  const clouds = [[180, 120, 1], [620, 70, .8], [1000, 170, .9], [-200, 230, .7]].map(([x, y, k]) => { const g = el("g", {}, L);
    [[0, 0, 50], [52, -20, 42], [96, 4, 38], [46, 18, 40]].forEach(([dx, dy, r]) => el("circle", { cx: dx, cy: dy, r, fill: "#FFFFFF", stroke: "#2B2A3322", "stroke-width": 4 }, g)); return { g, x, y, k }; });
  // おか（3まい）
  el("path", { d: "M0 640 Q260 520 560 600 Q860 680 1120 560 Q1380 450 1600 560 V1000 H0 Z", fill: "#BFE3A6", ...S6(6) }, L);
  // がっこう（おかの うえ）
  const sc = el("g", { transform: "translate(1040 380)" }, L);
  el("rect", { x: 0, y: 60, width: 300, height: 170, fill: "#FFF4E0", ...S6(6) }, sc); el("path", { d: "M-20 60 L150 0 L320 60 Z", fill: "#E8735A", ...S6(6) }, sc);
  el("rect", { x: 125, y: 140, width: 50, height: 90, rx: 6, fill: "#B97A4A", ...S6(5) }, sc); el("circle", { cx: 150, cy: 40, r: 18, fill: "#FFFFFF", ...S6(5) }, sc); el("path", { d: "M150 40 V28 M150 40 L160 46", ...S6(4) }, sc);
  [[30, 90], [200, 90]].forEach(([x, y]) => el("rect", { x, y, width: 70, height: 50, rx: 6, fill: "#BDE3F2", ...S6(5) }, sc));
  el("path", { d: "M330 230 V0", ...S6(6) }, sc); el("path", { d: "M330 6 L390 22 L330 40 Z", fill: "#FFD25E", ...S6(5) }, sc);
  el("path", { d: "M0 760 Q300 700 560 740 Q900 790 1200 700 Q1420 640 1600 690 V1000 H0 Z", fill: "#9FD68A", ...S6(6) }, L);
  // みち
  el("path", { d: "M1180 610 Q1100 700 900 760 Q620 840 640 1000", fill: "none", stroke: INK, "stroke-width": 88, "stroke-linecap": "round" }, L);
  el("path", { d: "M1180 610 Q1100 700 900 760 Q620 840 640 1000", fill: "none", stroke: "#F2E3C2", "stroke-width": 76, "stroke-linecap": "round" }, L);
  el("path", { d: "M1180 610 Q1100 700 900 760 Q620 840 640 1000", fill: "none", stroke: "#FFFFFF", "stroke-width": 6, "stroke-dasharray": "26 22" }, L);
  // 木と 花
  [[110, 640, 70], [300, 600, 56], [1500, 620, 64]].forEach(([x, y, r]) => { el("rect", { x: x - 16, y: y, width: 32, height: 120, rx: 8, fill: "#9A6B43", ...S6(5) }, L); el("circle", { cx: x, cy: y - 20, r, fill: "#6DBB5E", ...S6(6) }, L); el("circle", { cx: x - r * .5, cy: y + 10, r: r * .7, fill: "#7CC36A", ...S6(5) }, L); el("circle", { cx: x + r * .5, cy: y + 6, r: r * .7, fill: "#7CC36A", ...S6(5) }, L); });
  const fl = el("g", {}, L); [[200, 900, "#FF8FA3"], [420, 950, "#FFD25E"], [880, 930, "#B9A8D9"], [1080, 880, "#FF8FA3"], [1300, 940, "#FFD25E"], [1480, 880, "#7FCBF0"], [60, 960, "#B9A8D9"]].forEach(([x, y, c]) => {
    el("path", { d: `M${x} ${y} V${y + 40}`, stroke: "#4FA35A", "stroke-width": 6 }, fl); for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; el("circle", { cx: x + Math.cos(a) * 14, cy: y + Math.sin(a) * 14, r: 11, fill: c, ...S6(3) }, fl); } el("circle", { cx: x, cy: y, r: 9, fill: "#FFE27A", ...S6(3) }, fl); });
  // ふわふわ うかぶ ことばの たね（ひらがなの シャボンだま）
  const bubbles = ["あ", "い", "う", "え", "お", "か", "さ", "た", "な", "は"].map((t, i) => { const g = el("g", { opacity: .85 }, L);
    el("circle", { r: 30, fill: ["#FFE0E6", "#E3F0FF", "#FFF1B8", "#DDF2D0", "#EDE3FA"][i % 5], ...S6(4) }, g); txt(g, 0, 11, t, 32, { "text-anchor": "middle" }); return { g, x: 120 + i * 150, ph: i * .7 }; });
  // キャラたち（みぎと ひだりの はしに たって、ときどき 手を ふる）
  const cast = [["pony", 30, .5], ["shima", 150, .62], ["pyon", 1290, .58], ["gao", 1400, .6], ["chu", 1340, .3], ["mii", 1490, .56]];
  const cs = cast.map(([k, x, s]) => { const c = C[k]; resetChar(c); place(c, x, 1000, s); show(c); return c; });
  const t0 = performance.now();
  addTick(() => { if (view !== "menu") return false; const t = (performance.now() - t0) / 1000;
    rays.setAttribute("transform", `rotate(${(t * 6) % 360})`);
    clouds.forEach(c => { const x = ((c.x + t * 14 * c.k + 300) % 1900) - 300; c.g.setAttribute("transform", `translate(${x.toFixed(1)} ${c.y}) scale(${c.k})`); });
    bubbles.forEach(b => { const y = 1000 - ((t * 38 + b.ph * 140) % 1100); b.g.setAttribute("transform", `translate(${(b.x + Math.sin(t + b.ph) * 26).toFixed(1)} ${y.toFixed(1)})`); }); });
  let n = 0; MENU_TIMERS.push(setInterval(() => { if (view !== "menu") return; const c = cs[n++ % cs.length]; (n % 3 ? wave : c2 => jump(c2, .5))(c); }, 1700));
}
function menuTitle() {
  const t = document.createElement("div"); t.className = "mhero";
  t.innerHTML = `<div class="mrow"><svg class="mseed" viewBox="0 0 120 120" aria-hidden="true"><path d="M60 70 C40 40 18 40 14 52 C30 66 48 66 60 70 Z" fill="#7CC36A" stroke="#2B2A33" stroke-width="5" stroke-linejoin="round"/><path d="M60 70 C78 34 104 30 108 44 C92 62 74 66 60 70 Z" fill="#9FD68A" stroke="#2B2A33" stroke-width="5" stroke-linejoin="round"/><path d="M60 70 V82" stroke="#2B2A33" stroke-width="6" stroke-linecap="round"/><ellipse cx="60" cy="96" rx="30" ry="20" fill="#C98A4B" stroke="#2B2A33" stroke-width="5"/><ellipse cx="50" cy="90" rx="8" ry="5" fill="#E9B872"/><circle cx="51" cy="98" r="3" fill="#2B2A33"/><circle cx="69" cy="98" r="3" fill="#2B2A33"/><path d="M55 104 Q60 108 65 104" fill="none" stroke="#2B2A33" stroke-width="3" stroke-linecap="round"/></svg>`
    + `<div class="mword">${[..."ことばのたね"].map((c, i) => `<span style="--c:${["#FF8FA3", "#FFB34D", "#FFD25E", "#7BD389", "#7FCBF0", "#B9A8D9"][i]};--d:${i * .12}s">${c}</span>`).join("")}</div></div>`
    + `<div class="msay">いえたら めが でる！ ことばの すごろく</div>`;
  return t;
}
{ const sm = showMenu; showMenu = function () { menuScene(); sm(); const box = document.getElementById("startBox"); const card = box && box.querySelector(".mcard");
    if (card) { const ot = card.querySelector(".mtitle"); if (ot) ot.remove(); box.insertBefore(menuTitle(), card); } }; }
{ const smm = showMultiMenu; showMultiMenu = function () { if (view !== "menu") menuScene(); smm(); }; }
(function menuStyle2() {
  const st = document.createElement("style");
  st.textContent = `.start.menu{background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:6px;padding:12px 10px 20px}
.mhero{display:flex;flex-direction:column;align-items:center;gap:2px;margin-top:0;pointer-events:none;position:relative}
.mrow{display:flex;align-items:center;justify-content:center;gap:6px}
.mhero svg.mseed{width:clamp(56px,8vw,96px);height:clamp(56px,8vw,96px);flex:none;position:static;filter:drop-shadow(0 5px 0 #2B2A3355);animation:mseed 2.4s ease-in-out infinite;transform-origin:50% 90%}
@keyframes mseed{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg) translateY(-4px)}}
.mword{display:flex;gap:.04em}
.mword span{font:400 clamp(40px,7.2vw,82px) var(--display);color:var(--c);-webkit-text-stroke:clamp(5px,.8vw,9px) #2B2A33;paint-order:stroke fill;text-shadow:0 6px 0 #2B2A33,0 10px 14px #2B2A3333;display:inline-block;animation:mbob 2.2s ease-in-out infinite;animation-delay:var(--d);line-height:1.1;letter-spacing:.02em}
@keyframes mbob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-8px) rotate(2deg)}}
.msay{text-align:center;font:400 clamp(14px,2vw,20px) var(--display);color:#2B2A33;background:#FFFFFFd9;border:4px solid #2B2A33;border-radius:999px;padding:3px 18px;width:max-content;margin:4px auto 0;box-shadow:0 4px 0 #2B2A33}
.start.menu .mcard{background:#FFFFFFe8;backdrop-filter:blur(2px);width:min(88%,940px);max-height:88%;overflow-y:auto;padding:12px 18px 10px;gap:8px}
.start.menu .mcard .mstages{grid-template-columns:repeat(8,minmax(0,1fr))}.start.menu .mcard .mhead{display:none}.start.menu .mcard{gap:4px}.mcard .mst .mstat{padding:0 6px;border-width:2px;line-height:1.3}.start.menu .mcard .mst{box-shadow:0 4px 0 #2B2A33}.start.menu .mmcard h2{margin:0}.start.menu .mcard .mstages{gap:6px}.start.menu .mcard .mst{padding:3px 2px 4px;gap:0;border-radius:16px}.mcard .mst .mico{font-size:clamp(16px,2.1vw,24px);line-height:1.1}.mcard .mst .mname{font-size:clamp(10px,1.2vw,14px);overflow-wrap:anywhere;white-space:normal;line-height:1.15}.mcard .mst .mstat{font-size:clamp(9px,1.1vw,12px)}
.start.menu .mmulti{padding:6px 26px}
.mmcard .mtitle{color:#7FCBF0;-webkit-text-stroke:6px #2B2A33;paint-order:stroke fill;text-shadow:0 5px 0 #2B2A33}
@media (prefers-reduced-motion: reduce){.mword span,.mseed{animation:none}}`;
  document.head.appendChild(st);
})();

// はじめの メニューは game.js で 先に 出ているので、ここで 作りなおす
if (document.getElementById("startBox")) showMenu();
