/* ================= 場面の 直し（2026-10-28 ぜんたい チェック） =================
   1. 絵文字の 小さな ふきだし（hint7/8）を やめた ぶん、せりふに 出る ものを 絵の こもの として 出す（PROP_X）。
   2. 「子どもが さきに 話しかけた／した」のに 画面に 無い 場面：子どもの ひとことを ふきだしで 見せる（声は 子ども 自身なので なし）か、
      うごき（手を あげる・！・ノック の 音）で 見せる（PRE_X）。
   こものの 置き場：床は y=975。主人公は x≈400、相手は x≈1200。あいだ（x 700〜950）か、相手の うしろ。 */
const PXI = (kind, x, y, k = 1, r = 0) => prop(kind, x, y, k, r);
const PX_IN_HAND = (c, kind, k = .4, r = 0) => hp7(c, kind, k, r);
const PX_WALL = (fn) => { const g = el("g", {}, propG); fn(g); return g; };
const PX_CLOCK = (x, y, hour = 5, r = 70) => PX_WALL(g => { el("circle", { cx: x, cy: y, r, fill: "#FFFFFF", ...S6(6) }, g); for (let i = 0; i < 12; i++) { const a = i / 6 * Math.PI; el("circle", { cx: x + Math.cos(a) * r * .8, cy: y + Math.sin(a) * r * .8, r: i % 3 ? 3 : 5, fill: INK }, g); }
  const ah = (hour / 12) * Math.PI * 2 - Math.PI / 2; el("path", { d: `M${x} ${y} L${x + Math.cos(ah) * r * .5} ${y + Math.sin(ah) * r * .5}`, ...S6(8) }, g); el("path", { d: `M${x} ${y} V${y - r * .72}`, ...S6(6) }, g); });
const PX_TV = (x, y, on = true, w = 260) => PX_WALL(g => { el("rect", { x: x - w / 2, y: y - w * .32, width: w, height: w * .64, rx: 14, fill: "#2B2A33", ...S6(6) }, g); el("rect", { x: x - w / 2 + 16, y: y - w * .32 + 16, width: w - 32, height: w * .64 - 32, rx: 6, fill: on ? "#7FCBF0" : "#555B66" }, g);
  if (on) { el("circle", { cx: x - 30, cy: y - 10, r: 26, fill: "#FFD25E" }, g); el("path", { d: `M${x - 60} ${y + 40} q30 -40 60 0 q30 -40 60 0`, fill: "none", stroke: "#7BD389", "stroke-width": 10 }, g); } el("rect", { x: x - 30, y: y + w * .32, width: 60, height: 18, fill: INK }, g); });
const PX_RAIN_OUT = () => { // 雨は まどの そと（まどの 中だけに かく。そらも くもる）
  const g = el("g", {}, propG); const wins = [...sceneLayer.querySelectorAll("rect")].filter(r => (r.getAttribute("fill") || "").toUpperCase() === "#BDE3F2" && +r.getAttribute("width") > 100 && +r.getAttribute("y") < 600);
  wins.forEach(w => { const x = +w.getAttribute("x"), y = +w.getAttribute("y"), W = +w.getAttribute("width"), H = +w.getAttribute("height"); w.setAttribute("fill", "#9FB4C8");
    for (let i = 0; i < 14; i++) { const rx = x + 12 + (i * 53) % (W - 24), ry = y + 10 + (i * 37) % (H - 50); el("path", { d: `M${rx} ${ry} l-8 32`, stroke: "#E8F4FF", "stroke-width": 4, "stroke-linecap": "round" }, g); } }); return g; };
const PX_SINK = (x) => PX_WALL(g => { el("rect", { x: x - 130, y: 820, width: 260, height: 30, rx: 8, fill: "#DDE6EE", ...S6(6) }, g); el("rect", { x: x - 110, y: 850, width: 220, height: 125, fill: "#E9EEF3", ...S6(6) }, g); el("path", { d: `M${x} 820 V760 Q${x} 730 ${x + 30} 730 H${x + 50}`, fill: "none", ...S6(9) }, g); el("ellipse", { cx: x, cy: 835, rx: 70, ry: 10, fill: "#BFE3F2", ...S6(3) }, g); });
const PX_COUNTER_TRAY = (x) => PX_WALL(g => { el("rect", { x: x - 200, y: 820, width: 400, height: 155, rx: 10, fill: "#C9B9A2", ...S6(6) }, g); el("rect", { x: x - 210, y: 806, width: 420, height: 20, rx: 6, fill: "#A88B6A", ...S6(5) }, g);
  [[-140, "#F2B01E"], [-50, "#FFFFFF"], [40, "#7BD389"], [130, "#E8735A"]].forEach(([dx, c]) => { el("path", { d: `M${x + dx - 36} 800 Q${x + dx} 840 ${x + dx + 36} 800 Z`, fill: "#FFFFFF", ...S6(4) }, g); el("ellipse", { cx: x + dx, cy: 800, rx: 36, ry: 12, fill: c, ...S6(4) }, g); }); });
const PX_WINDOW_SKY = (kind) => PX_WALL(g => { const x = 1240, y = 330, w = 260, h = 200; el("rect", { x, y, width: w, height: h, rx: 14, fill: kind === "night" ? "#2E3A6E" : "#FFD9A8", ...S6(6) }, g);
  if (kind === "night") { el("circle", { cx: x + 190, cy: y + 60, r: 36, fill: "#FFE27A", ...S6(4) }, g); el("circle", { cx: x + 206, cy: y + 50, r: 30, fill: "#2E3A6E" }, g); [[40, 40], [90, 130], [170, 150]].forEach(([dx, dy]) => el("circle", { cx: x + dx, cy: y + dy, r: 5, fill: "#FFE27A" }, g)); }
  else { el("circle", { cx: x + 130, cy: y + 150, r: 60, fill: "#FFB34D", ...S6(5) }, g); el("rect", { x: x + 6, y: y + 150, width: w - 12, height: h - 156, fill: "#9FD38A" }, g); }
  el("path", { d: `M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}`, ...S6(5) }, g); });
const PX_KIDS_LINE = (xs, kinds) => xs.map((x, i) => { const c = xtra(kinds[i % kinds.length], x, (KID_S[kinds[i % kinds.length]] || .9) * .6); c.dx.v = c.dx.t = 0; return c; });
const PX_SIGN = (x, y, text, fill = "#FFD25E") => PX_WALL(g => { const w = text.length * 52 + 60; el("path", { d: `M${x} ${y + 40} V975`, ...S6(10) }, g); el("rect", { x: x - w / 2, y: y - 50, width: w, height: 100, rx: 14, fill, ...S6(6) }, g); txt(g, x, y + 18, text, 48, { "text-anchor": "middle" }); });
const PROP_X = {
  // ---- まつ ----
  mtdenwa: (h, a) => { PX_IN_HAND(a, "phone", .6, -10); },
  mtgame: (h, a) => { PX_IN_HAND(a, "gamebox", .34, 0); },
  mtretsu: (h, a) => { PX_COUNTER_TRAY(1000); PX_KIDS_LINE([700, 830], ["pyon", "chu"]); },
  mtyobu: (h, a) => { /* 遠くの ちゅう は PROP10 で 出る */ },
  mthappyou: (h, a) => PX_WALL(g => { el("path", { d: "M800 975 V700", ...S6(10) }, g); el("rect", { x: 770, y: 640, width: 60, height: 80, rx: 30, fill: "#3A3F4A", ...S6(6) }, g); el("path", { d: "M740 975 H860", ...S6(10) }, g); }),
  mtbyouin: (h, a) => PX_SIGN(1450, 420, "まちあいしつ", "#FFFFFF"),
  // ---- でんわ（主人公の でんわ は intro10 で 出る。相手の でんわ を 足す） ----
  dwmoshimoshi: (h, a) => PX_IN_HAND(a, "phone", .55, 10), dwkikoenai: (h, a) => PX_IN_HAND(a, "phone", .55, 10), dwkawaru: (h, a) => PX_IN_HAND(a, "phone", .55, 10), dwkyou: (h, a) => PX_IN_HAND(a, "phone", .55, 10),
  dwowari: (h, a) => PX_IN_HAND(a, "phone", .55, 10), dwkaze: (h, a) => PX_IN_HAND(a, "phone", .55, 10), dwdare: (h, a) => PX_IN_HAND(a, "phone", .55, 10), dwkakeru: (h, a) => PX_IN_HAND(a, "phone", .55, 10),
  dwdengon: (h, a) => { PX_IN_HAND(a, "phone", .55, 10); PXI("notebook", 760, 940, .5); PXI("pencil", 840, 950, .45, 40); }, dworei: (h, a) => { PX_IN_HAND(a, "phone", .55, 10); PXI("ehon", 780, 930, .55); },
  // ---- きりかえ ----
  krkouen: () => PX_RAIN_OUT(), krgame: (h, a) => { PX_TV(820, 560); PX_IN_HAND(h, "gamebox", .34, 0); }, krkuma: (h) => PX_IN_HAND(h, "robot", .36, 0),
  krjikanwari: () => PX_WALL(g => { el("rect", { x: 1320, y: 280, width: 230, height: 300, rx: 10, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 1435, 330, "じかんわり", 30, { "text-anchor": "middle" }); ["こくご", "さんすう", "ずこう", "たいいく"].forEach((t, i) => { el("rect", { x: 1340, y: 350 + i * 55, width: 190, height: 44, rx: 8, fill: i === 2 ? "#FFB4B4" : "#F6EEDF", ...S6(3) }, g); txt(g, 1435, 382 + i * 55, t, 28, { "text-anchor": "middle" }); }); el("path", { d: "M1350 450 L1520 494 M1520 450 L1350 494", stroke: "#E8473C", "stroke-width": 8, "stroke-linecap": "round" }, g); }),
  krsekigae: () => PX_WALL(g => { [[700, 900], [860, 900], [1020, 900]].forEach(([x, y]) => { el("rect", { x: x - 60, y: y - 30, width: 120, height: 18, rx: 5, fill: "#C98A4B", ...S6(5) }, g); el("path", { d: `M${x - 48} ${y - 12} V${y + 60} M${x + 48} ${y - 12} V${y + 60}`, ...S6(7) }, g); }); }),
  // ---- ききかえす ----
  khshamoji: (h, a) => PXI("ladle", 640, 905, .5, -30), khoshiete: (h, a) => PXI("pencil", 1000, 930, .5, 30), khpage: () => PX_WALL(g => { el("rect", { x: 1360, y: 270, width: 160, height: 110, rx: 12, fill: "#B0B6C3", ...S6(6) }, g); for (let i = 0; i < 4; i++) el("path", { d: `M1380 ${290 + i * 24} H1500`, stroke: "#2B2A33", "stroke-width": 6 }, g); }),
  khmichi: () => PX_SIGN(900, 560, "← えき", "#7FCBF0"), khjunbi: (h, a) => PXI("btray", 980, 945, .6), khshitaku: (h) => PXI("shirt", 780, 930, .5),
  // ---- SOS ----
  szkutsushita: (h) => { PXI("sock", 700, 950, .5, -20); for (let i = 0; i < 5; i++) PX_WALL(g => el("ellipse", { cx: 640 + i * 40, cy: 972, rx: 16, ry: 5, fill: "#7FB4E0", opacity: .7 }, g)); },
  szfue: (h, a) => PX_IN_HAND(a, "recorder", .3, -30), szmabushii: () => PX_WALL(g => { el("circle", { cx: 1380, cy: 140, r: 90, fill: "#FFE27A", ...S6(6) }, g); for (let i = 0; i < 12; i++) { const an = i / 6 * Math.PI; el("path", { d: `M${1380 + Math.cos(an) * 110} ${140 + Math.sin(an) * 110} L${1380 + Math.cos(an) * 150} ${140 + Math.sin(an) * 150}`, ...S6(8) }, g); } }),
  sznioi: () => PX_WALL(g => { [820, 870, 920].forEach((x, i) => el("path", { d: `M${x} 900 q20 -40 0 -80 q-20 -40 0 -80`, fill: "none", stroke: "#8FA86A", "stroke-width": 8, "stroke-linecap": "round", opacity: .8 }, g)); el("rect", { x: 790, y: 900, width: 160, height: 75, rx: 10, fill: "#8A9B6A", ...S6(6) }, g); }),
  sznodo: (h, a) => PXI("bottle", 980, 940, .5), szfuku: (h) => PXI("shirtb", 780, 930, .5),
  szdakitsuki: (h, a) => later(600, () => { a.dx.t = -(a.x - h.x - 330 * h.s - 100); hold(a, "run", .7); later(900, () => { a.armL.t = 60; a.armR.t = -60; a.happyOn = true; }); }),
  // ---- じゅんばん ----
  jbkatazuke: () => { PXI("blocks", 700, 950, .6); PXI("ball", 820, 950, .5); PXI("toycar", 940, 955, .5); PXI("ehon", 1040, 945, .45, 15); }, jbenogu: () => PXI("pot", 980, 945, .5),
  jbsekken: (h, a) => PXI("soap", 1130, 835, .3), jbasa: () => PX_WINDOW_SKY("morning"), jbrandoseru: (h) => PXI("card", 760, 940, .5), jbtoast: () => { PX_WALL(g => { el("rect", { x: 760, y: 870, width: 420, height: 22, rx: 6, fill: "#C98A4B", ...S6(5) }, g); el("path", { d: "M790 892 V975 M1150 892 V975", ...S6(8) }, g); }); PXI("bread", 900, 850, .5); PXI("milk", 1040, 845, .45); },
  jbofuro: () => PX_WALL(g => { el("rect", { x: 700, y: 820, width: 460, height: 155, rx: 30, fill: "#FFFFFF", ...S6(6) }, g); el("rect", { x: 720, y: 840, width: 420, height: 60, rx: 20, fill: "#BFE3F2" }, g); for (let i = 0; i < 6; i++) el("circle", { cx: 760 + i * 70, cy: 760 - (i % 3) * 40, r: 14 + (i % 3) * 5, fill: "#FFFFFF", ...S6(4) }, g); }),
  jbneru: () => PX_WINDOW_SKY("night"), jbonigokko: () => PX_KIDS_LINE([760, 900], ["pyon", "kuma"]),
  // ---- ことわる ----
  kwasobi: (h) => { PXI("pad", 330, 862, .36); PXI("pencil", 400, 866, .3, 70); }, kwitazura: (h, a) => PX_IN_HAND(a, "pencil", .4, 30), kwshukudai: (h) => PX_IN_HAND(h, "notebook", .4, -10), kwoyatsu: (h, a) => PXI("cookies", 980, 945, .55),
  kwkaeru: () => PX_CLOCK(1000, 330, 5, 60), kwmiteru: () => PXI("castle", 1000, 945, .7),
  gskaeshite: (h, a) => PX_IN_HAND(a, "pencil", .38, 40),
  hkhaneru: (h, a) => { const c = xtra("kon", 980, .5); c.dx.v = c.dx.t = 0; later(400, () => jump(c, .7)); later(1300, () => jump(c, .7)); },
  // ---- ぼうさい ----
  bssiren: () => PX_WALL(g => { el("rect", { x: 1380, y: 300, width: 140, height: 60, rx: 10, fill: "#B0B6C3", ...S6(6) }, g); el("path", { d: "M1400 300 Q1450 230 1500 300 Z", fill: "#E8473C", ...S6(6) }, g); }), bswasuremono: (h) => PXI("bottle", 760, 940, .5), bssoto: () => PX_SIGN(900, 560, "ひなんじょ →", "#7BD389"), bsowari: () => PXI("numtag", 980, 940, .5),
  bskaji: () => PX_WALL(g => { el("rect", { x: 1380, y: 300, width: 140, height: 60, rx: 10, fill: "#B0B6C3", ...S6(6) }, g); el("circle", { cx: 1450, cy: 270, r: 34, fill: "#E8473C", ...S6(6) }, g); }),
  bsjishin: (h) => PX_WALL(g => { el("rect", { x: 540, y: 820, width: 200, height: 22, rx: 6, fill: "#C98A4B", ...S6(5) }, g); el("path", { d: "M560 842 V975 M720 842 V975", ...S6(8) }, g); }),
  bskemuri: () => PX_WALL(g => { for (let i = 0; i < 9; i++) { const x = 80 + i * 180, y = 120 + (i % 3) * 40; [[0, 0, 70], [70, -20, 55], [130, 10, 60]].forEach(([dx, dy, r]) => el("circle", { cx: x + dx, cy: y + dy, r, fill: "#9AA3B5", opacity: .75 }, g)); } }),
};
// 絵の こものを 出す（intro の まえに）
{ const pi = playIntro; playIntro = async function (s, h, a) { if (PROP_X[s.id]) { try { PROP_X[s.id](h, a); } catch (e) { console.error("PROP_X", s.id, e); } } return pi(s, h, a); }; }

/* ---- 子どもの さきの ひとこと／うごき（PRE_X） ----
   text: 主人公の ふきだし（声つき：pre_<id>／pre_<id>_<子>）。knock: ドアを ノックする 音と「コンコン」。raise: 手を あげて ！。 */
const PRE_X = {
  mtdenwa: { raise: true, text: "ママ、あのね！" },
  irete: { text: "ねえ、いれて！" }, chime: { bell: true }, ocbenkyou: { text: "あそぼう！" },
  ftiyanan: { text: "やめてよ" }, kniyadatta: { text: "こげおにぎり！" }, tdchigau: { text: "すべりだい しようよ" }, tdnakanaori: { text: "……" },
  hkknock: { knock: true }, shitsurei: { knock: true }, snmachi: { busy: true }, mtshitsumon: { raise: true },
};
{ const pi = playIntro; playIntro = async function (s, h, a) {
    const p = PRE_X[s.id]; if (!p) return pi(s, h, a);
    if (p.busy) { const c = xtra("pyon", 1000, .5); c.dx.v = c.dx.t = 0; await speak(a, "pre_snmachi_busy", "……はい、では そういう ことで"); c.dx.t = -1400; hold(c, "run", .8); await sleep(700); c.root.style.display = "none"; }
    const r = await pi(s, h, a);
    if (p.knock) { for (let i = 0; i < 2; i++) later(i * 260, () => noise(.08, 600, .4)); say(h, "コンコン"); await sleep(1100); unsay(); }
    if (p.bell) { for (let i = 0; i < 6; i++) later(i * 140, () => blip(1800, 1800, .08, "square")); say(h, "（チャイム）"); await sleep(1000); unsay(); }
    if (p.raise) { h.armR.t = -160; markAbove(h, "ex"); later(1500, () => h.armR.t = 0); }
    if (p.text && /^[…・.\s]+$/.test(p.text)) { say(h, p.text); await sleep(1100); unsay(); await sleep(200); } // 「……」（だまって いる）は 声なし
    else if (p.text) { const k = AUD[`pre_${s.id}_${h.kind}`] ? `pre_${s.id}_${h.kind}` : `pre_${s.id}`; await speak(h, k, p.text); await sleep(200); } // 声を つける（2026-10-29：ひらがなが 読めない 子にも わかるように）。その 子の 声（まるシマは AivisSpeech「まい」）。ない ときは ぽにーの 声
    return r; }; }
