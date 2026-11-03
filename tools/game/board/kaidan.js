/* ================= ショートコース「かいだん」（kaidan、2026-11-04） =================
   いちばんに なりたくて、かいだんで おにいちゃんを おして しまう ことを やめる ための おはなし。
   とまった マスごとに 1しょう ずつ すすむ（ばしょは かんけい ない）。ゴールに ついたら のこりの しょうと さいごの しょう。
     ゆめ①：かいだんで おして しまう → おにいちゃんが ころげおちる →「たすけて！」→ いえの まえに きゅうきゅうしゃ
     ゆめ②：びょういん（クマの おいしゃさん）→「ぼくが おしました。ごめんなさい」→ おにいちゃん「もう あそばない」
     ゆめ③：イヌの おまわりさん →「ぼくです」→ よるの パトカー → てつの ぼうの へや →「おうちに かえりたい」→ めが さめる →「こわい ゆめを みたの」
     ほんとう①：おなじ かいだん →「かいだんでは きょうそう しないよ」→「さきに いって いいよ」→ てすりを もって ゆっくり
     ほんとう②：むずむず →「いちばんじゃなくても だいじょうぶ」→「ひろい ところで かけっこ しよう」→ こうえんで かけっこ
     さいご（ゴール）：ゆめで あった おまわりさんと おいしゃさんが ほめて くれる
   ゆめの あいだは くもの わく と オルゴールの きょく（bgm_kaidan_yume）。ほんとうに つかまる はなしには しない（あまねさんの きめ）。
   それより おおく とまったら、すべりだい・えきの かいだん の みじかい れんしゅう。ライバル（がお）は 場面に ださない。
   データと 声：sit/kaidan_gen.py → kaidan_data.js・sit/pony_kaidan.json・aivis/jobs/kd1 */
STAGES.push({ id: "kaidan", name: "かいだん", icon: "🪜", ready: true });
Object.assign(RIVAL_OF, { kaidan: "gao" }); SLEEPER_OF.kaidan = "doshin";
Object.assign(ASK_AT, { inukei: [1250, .78], kumadr: [1270, .8] }); Object.assign(KID_S, { inukei: .78, kumadr: .8 }); PIECE_S.inukei = .26; PIECE_S.kumadr = .27;
{ const g = GENRES.find(g => g[0] === "ouchi"); if (g && !g[3].includes("kaidan")) g[3].push("kaidan"); }
SF_SKIP.add("kaidan"); // ルーレット・ふうせんは おかない（とまる たびに おはなしが すすむ）
let KD_STEP = 0, KD_X = 0, KD_FG = null, KD_FR = null, KD_DREAM = false, KD_PLACE = "";
{ const ap = applyStage; applyStage = function (id, ...a) { if (id === "kaidan") { KD_STEP = 0; KD_X = 0; KD_DREAM = false; } return ap(id, ...a); }; }
const kdP = key => KD.pony[key], kdL = key => KD.line[key];
const kdSpeak = (c, key) => speak(c, key, (KD.pony[key] || (KD.line[key] && KD.line[key].text)));
/* ---------- 盤：おおきな かいだん（ひだりしたから みぎうえへ） ---------- */
const KD_NODES = [[150, 880], [275, 880], [400, 880], [400, 768], [525, 768], [650, 768], [650, 656], [775, 656], [900, 656], [900, 544], [1025, 544], [1150, 544], [1150, 432], [1275, 432], [1275, 320], [1130, 310]];
{ const n = {}, pl = {}, nx = {}, ids = KD_NODES.map((_, i) => String(i)), P = ["いっかい", "かいだん", "かいだん", "かいだん", "にかい", "にかい"];
  ids.forEach((id, i) => { n[id] = KD_NODES[i].slice(); pl[id] = i < 3 ? P[0] : i < 12 ? P[1] : P[4]; });
  n["0"].push("start"); n["15"].push("goal"); linkLine(nx, ids);
  STAGE_DEF.kaidan = { ground: "#FFF3E2", sky: "#CFEAFB", names: [P[0], P[1], P[2], P[2], P[3], P[3], P[4], P[4], P[5]], fills: { いっかい: "#FFE3B3", かいだん: "#E9D8F5", にかい: "#D7F0D2" } };
  BOARD.kaidan = { nodes: n, place: pl, next: nx, away: [1300, 760], style: (a, b) => (+b > 2 && +b < 15 ? "stairs" : "hall"), labels: [] };
  EVENTS.kaidan = { "5": ["fwd", 2, "ev_kaidanf", KD.pony.ev_kaidanf], "10": ["back", 2, "ev_kaidanb", KD.pony.ev_kaidanb] }; }
BOARD_BG.kaidan = L => {
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFF3E2" }, L);
  for (let x = 0; x < 1600; x += 60) el("path", { d: `M${x} 0 V1000`, stroke: "#F2DCC0", "stroke-width": 14 }, L); // かべがみの しま
  // おおきな かいだん（マスの したに、いたの だんだん）
  const runs = [[0, 2], [3, 5], [6, 8], [9, 11], [12, 13], [15, 14]];
  runs.forEach(([a, b]) => { const [x0, y0] = KD_NODES[a], [x1] = KD_NODES[b], y = y0 + 52;
    el("path", { d: `M${x0 - 90} ${y} H${x1 + 90} V1000 H${x0 - 90} Z`, fill: "#D9A066", ...S6(6) }, L);
    el("rect", { x: x0 - 96, y: y - 14, width: x1 - x0 + 192, height: 26, rx: 8, fill: "#B87A44", ...S6(5) }, L);
    for (let x = x0 - 60; x < x1 + 80; x += 70) el("path", { d: `M${x} ${y + 30} V1000`, stroke: "#C98A4B", "stroke-width": 4, opacity: .6 }, L); });
  // てすり
  el("path", { d: "M60 690 L1200 120", fill: "none", stroke: INK, "stroke-width": 22, "stroke-linecap": "round" }, L); el("path", { d: "M60 690 L1200 120", fill: "none", stroke: "#B87A44", "stroke-width": 12, "stroke-linecap": "round" }, L);
  for (let k = 0; k < 9; k++) { const x = 130 + k * 125, y = 690 - (x - 60) * .5; el("path", { d: `M${x} ${y} V${y + 160}`, stroke: "#8A5A33", "stroke-width": 8 }, L); }
  // ひだりうえ：まど と たいよう、みぎした：うえきばち
  el("rect", { x: 70, y: 60, width: 300, height: 220, rx: 14, fill: "#CFEAFB", ...S6(6) }, L); IC.sun(L, 300, 130, 34); IC.cloud(L, 170, 150, .6);
  el("path", { d: "M220 60 V280 M70 170 H370", ...S6(5) }, L);
  el("path", { d: "M1460 900 h80 l-12 90 h-56 Z", fill: "#E8735A", ...S6(5) }, L); [[1480, 860], [1520, 850], [1500, 820]].forEach(([x, y]) => el("ellipse", { cx: x, cy: y, rx: 28, ry: 44, fill: "#7BD389", ...S6(4) }, L));
  // ゴール：2かいの ドア
  
  { const tg = el("g", { "data-top": 1 }, L); el("rect", { x: 520, y: 40, width: 460, height: 90, rx: 24, fill: "#8C6BC2", ...S6(5) }, tg); txt(tg, 750, 100, "🪜 かいだん", 44, { "text-anchor": "middle", fill: "#FFFFFF" }); } };
BLOCK_DEF.kaidan = { who: "doshin", sleep: false, intro: ["p_blk_kaidan", KD.pony.p_blk_kaidan], say: ["blk_undou", "とおして ください"], to: "どしんに いおう", keys: [["とおして", "通して", "とうして"], ["ください", "下さい"]], res: ["rs_undou", "あっ、ごめんね。どうぞ、どうぞ"] };
/* ---------- メニューの タイルの 絵 ---------- */
if (typeof A2 !== "undefined") A2.kaidan = (L, X) => { PR2.room(L, "#FFF0DC");
  for (let i = 0; i < 5; i++) el("path", { d: `M${X(-.1) + i * 34} ${236 - i * 24} h34 v${24 * (i + 1)} h-34 Z`, fill: "#D9A066", ...S6(4) }, L);
  CH(L, "onii", X(.3), .3, HI); CH(L, "shima", X(-.32), .32, HAPPY); };
/* ---------- 場面の えと だいじな もの ---------- */
const KD_ST = { x0: 720, y0: 975, R: 72, Q: 58, N: 8 }; // かいだん：だんの はば R・たかさ Q・N だん
const kdStep = i => { const { x0, y0, R, Q, N } = KD_ST; if (i <= 0) return [x0 - 110 + i * 150, y0]; if (i <= N) return [x0 + (i - .5) * R, y0 - i * Q]; return [x0 + N * R + (i - N) * 110, y0 - N * Q]; };
function kdWall(L, c1 = "#FCE8CF", c2 = "#F6DDBE") { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: c1 }, L); for (let x = 20; x < 1600; x += 80) el("path", { d: `M${x} 0 V1000`, stroke: c2, "stroke-width": 26 }, L);
  for (let x = 60; x < 1600; x += 160) for (let y = 70; y < 760; y += 150) el("circle", { cx: x + ((y / 150) % 2) * 80, cy: y, r: 7, fill: "#FFFFFF", opacity: .5 }, L); }
// いえの かいだん（よこから みた ところ）
function kdStairsRoom(L) {
  const { x0, y0, R, Q, N } = KD_ST, top = y0 - N * Q, xe = x0 + N * R;
  kdWall(L);
  // 1かいの まど（カーテン）と かぞくの しゃしん
  el("rect", { x: 170, y: 150, width: 260, height: 300, rx: 16, fill: KD_DREAM ? "#B8B0D8" : "#CFEAFB", ...S6(6) }, L);
  if (!KD_DREAM) { IC.cloud(L, 260, 240, .5); el("path", { d: "M200 420 q30 -50 70 -20 q40 -40 80 10 q40 -20 50 30 Z", fill: "#7BD389", ...S6(4) }, L); } else { el("circle", { cx: 360, cy: 220, r: 32, fill: "#FFF3C4", ...S6(4) }, L); }
  el("path", { d: "M300 150 V450 M170 300 H430", ...S6(5) }, L);
  el("path", { d: "M150 140 Q190 300 160 470 L200 470 Q215 300 196 140 Z M450 140 Q410 300 440 470 L400 470 Q385 300 404 140 Z", fill: "#FF8FA3", ...S6(5) }, L);
  el("rect", { x: 140, y: 126, width: 320, height: 22, rx: 8, fill: "#C98A4B", ...S6(4) }, L);
  { const g = el("g", { transform: "translate(960 190) rotate(3)" }, L); el("rect", { x: -120, y: -80, width: 240, height: 170, rx: 10, fill: "#C98A4B", ...S6(6) }, g); el("rect", { x: -100, y: -60, width: 200, height: 130, fill: "#FFF6E0", ...S6(3) }, g);
    // しゃしんの なか：おにいちゃんと まるシマ（しろくろの しま）
    [[-40, 18, 34], [40, 26, 28]].forEach(([x, y, r]) => { el("circle", { cx: x, cy: y - 10, r, fill: "#FFFFFF", ...S6(3) }, g); for (let k = -1; k <= 1; k++) el("path", { d: `M${x + k * r * .5} ${y - 10 - r} q4 ${r * .5} 0 ${r * .6}`, stroke: INK, "stroke-width": 5, fill: "none" }, g); el("ellipse", { cx: x, cy: y + 6, rx: r * .5, ry: r * .3, fill: "#4A4A58" }, g); });
    el("path", { d: "M-60 64 H60", stroke: "#FF8FA3", "stroke-width": 8 }, g); }
  // 2かいの ゆか と ドア
  el("rect", { x: xe, y: top, width: 1600 - xe, height: 30, fill: "#B87A44", ...S6(6) }, L);
  el("rect", { x: xe, y: top + 30, width: 1600 - xe, height: y0 - top - 30, fill: "#EED8BC", ...S6(5) }, L);
  el("rect", { x: 1360, y: top - 330, width: 170, height: 330, rx: 8, fill: "#E8B36B", ...S6(6) }, L); el("rect", { x: 1385, y: top - 300, width: 120, height: 110, rx: 6, fill: "#F2C98A", ...S6(4) }, L); el("rect", { x: 1385, y: top - 170, width: 120, height: 130, rx: 6, fill: "#F2C98A", ...S6(4) }, L); el("circle", { cx: 1380, cy: top - 160, r: 9, fill: "#FFD25E", ...S6(3) }, L);
  { const p = el("g", { transform: `translate(1445 ${top - 240})` }, L); el("rect", { x: -44, y: -20, width: 88, height: 40, rx: 10, fill: "#FFFFFF", ...S6(4) }, p); txt(p, 0, 12, "🦓", 28, { "text-anchor": "middle" }); }
  // 2かいの てすり（さく）
  el("path", { d: `M${xe} ${top - 150} H${1340}`, ...S6(14) }, L); el("path", { d: `M${xe} ${top - 150} H${1340}`, stroke: "#B87A44", "stroke-width": 7 }, L);
  for (let x = xe + 30; x < 1340; x += 44) el("path", { d: `M${x} ${top - 145} V${top}`, stroke: "#8A5A33", "stroke-width": 7 }, L);
  // かいだん：よこの いた（ささら）
  el("path", { d: `M${x0} ${y0} L${xe} ${top + 30} L${xe} ${y0} Z`, fill: "#C98A4B", ...S6(6) }, L);
  for (let k = 0; k < 6; k++) el("path", { d: `M${x0 + 80 + k * 90} ${y0 - 10} L${x0 + 80 + k * 90} ${y0 - 40 - k * 50}`, stroke: "#B87A44", "stroke-width": 5, opacity: .5 }, L); // もくめ
  // だん（ふみいた と けこみ）
  for (let i = 1; i <= N; i++) { const x = x0 + (i - 1) * R, y = y0 - i * Q;
    el("rect", { x: x, y: y, width: R, height: Q, fill: "#E8C08A", ...S6(5) }, L);
    el("rect", { x: x - 8, y: y - 6, width: R + 16, height: 16, rx: 6, fill: "#B87A44", ...S6(5) }, L);
    el("path", { d: `M${x + 6} ${y + 2} h${R - 12}`, stroke: "#FFFFFF", "stroke-width": 3, opacity: .45 }, L); }
  // かいだんの てすり（ななめ）と はしら
  const rx0 = x0 - 30, ry0 = y0 - 240, rx1 = xe, ry1 = top - 150;
  el("path", { d: `M${rx0} ${ry0} L${rx1} ${ry1}`, ...S6(16) }, L); el("path", { d: `M${rx0} ${ry0} L${rx1} ${ry1}`, stroke: "#B87A44", "stroke-width": 8, "stroke-linecap": "round" }, L);
  for (let i = 1; i <= N; i++) { const x = x0 + (i - .5) * R, y = y0 - i * Q - 6, ry = ry0 + (x - rx0) * (ry1 - ry0) / (rx1 - rx0); el("path", { d: `M${x} ${y} V${ry + 6}`, stroke: "#8A5A33", "stroke-width": 7 }, L); }
  el("rect", { x: rx0 - 22, y: ry0 - 4, width: 44, height: y0 - ry0 + 4, rx: 8, fill: "#B87A44", ...S6(5) }, L); el("circle", { cx: rx0, cy: ry0 - 18, r: 26, fill: "#C98A4B", ...S6(5) }, L);
  // 1かいの ゆか・しきもの・スリッパ・うえきばち
  el("rect", { x: 0, y: y0, width: 1600, height: 30, fill: "#B87A44" }, L);
  el("ellipse", { cx: 250, cy: 985, rx: 220, ry: 26, fill: "#9FD6F5", ...S6(4) }, L);
  [[60, 970], [100, 976]].forEach(([x, y]) => el("ellipse", { cx: x, cy: y, rx: 30, ry: 11, fill: "#FF8FA3", ...S6(3) }, L));
  el("path", { d: `M1470 850 h90 l-14 120 h-62 Z`, fill: "#E8735A", ...S6(5) }, L); [[1500, 800], [1530, 780], [1560, 810]].forEach(([x, y], k) => el("ellipse", { cx: x, cy: y, rx: 26, ry: 50, fill: "#6DBB5E", ...S6(4), transform: `rotate(${(k - 1) * 24} ${x} ${y + 40})` }, L));
}
// いえの まえの みち（きゅうきゅうしゃが くる）
function kdHouseFront(L, night = false) {
  const sky = night ? "#2E3A66" : KD_DREAM ? "#C8C0E8" : "#CFEAFB";
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: sky }, L);
  if (night) { el("circle", { cx: 1380, cy: 140, r: 54, fill: "#FFF3C4", ...S6(5) }, L); el("circle", { cx: 1404, cy: 126, r: 48, fill: sky }, L); for (let k = 0; k < 16; k++) el("circle", { cx: 60 + (k * 233) % 1500, cy: 40 + (k * 97) % 260, r: 4 + k % 3, fill: "#FFF3C4" }, L); }
  else { IC.cloud(L, 260, 140, 1); IC.cloud(L, 980, 110, .8); }
  // いえ
  const hx = 120, hy = 330, hc = night ? "#C9B8A0" : "#FFE7C2";
  el("path", { d: `M${hx - 40} ${hy} L${hx + 300} ${hy - 200} L${hx + 640} ${hy} Z`, fill: "#C0564B", ...S6(7) }, L);
  for (let k = 1; k < 6; k++) el("path", { d: `M${hx - 40 + k * 56} ${hy - k * 33} L${hx + 640 - k * 56} ${hy - k * 33}`, stroke: "#9E4038", "stroke-width": 5 }, L);
  el("rect", { x: hx, y: hy, width: 560, height: 470, fill: hc, ...S6(7) }, L);
  [[hx + 60, hy + 70], [hx + 380, hy + 70]].forEach(([x, y]) => { el("rect", { x, y, width: 130, height: 110, rx: 8, fill: night ? "#FFE27A" : "#CFEAFB", ...S6(5) }, L); el("path", { d: `M${x + 65} ${y} V${y + 110} M${x} ${y + 55} H${x + 130}`, ...S6(4) }, L); });
  el("rect", { x: hx + 220, y: hy + 250, width: 130, height: 220, rx: 8, fill: "#B87A44", ...S6(6) }, L); el("circle", { cx: hx + 330, cy: hy + 370, r: 8, fill: "#FFD25E", ...S6(3) }, L);
  el("rect", { x: hx + 380, y: hy + 300, width: 90, height: 40, rx: 8, fill: "#FFFFFF", ...S6(4) }, L); txt(L, hx + 425, hy + 330, "🦓", 26, { "text-anchor": "middle" }); // ひょうさつ
  // へい と うえこみ
  el("rect", { x: 0, y: 760, width: 1600, height: 40, fill: night ? "#8E8A84" : "#D8D2C6", ...S6(5) }, L);
  [[40, 740], [820, 740], [960, 745], [1500, 740]].forEach(([x, y], k) => IC.tree(L, x, y - 40, .6, k % 2 ? "#6DBB5E" : "#7BD389"));
  // みち
  el("rect", { x: 0, y: 800, width: 1600, height: 200, fill: night ? "#4A4D57" : "#8E929C", ...S6(5) }, L);
  for (let x = 40; x < 1600; x += 220) el("rect", { x, y: 890, width: 120, height: 14, rx: 6, fill: "#FFFFFF", opacity: .85 }, L);
  // でんちゅう と がいとう
  el("rect", { x: 1180, y: 300, width: 30, height: 470, fill: "#B9B4AA", ...S6(5) }, L); el("path", { d: "M1195 340 q80 -10 100 30", fill: "none", ...S6(7) }, L);
  el("ellipse", { cx: 1300, cy: 380, rx: 30, ry: 16, fill: night ? "#FFF3C4" : "#FFFFFF", ...S6(4) }, L);
  if (night) el("path", { d: "M1270 390 L1180 780 H1420 L1330 390 Z", fill: "#FFF3C4", opacity: .25 }, L);
}
// びょういんの へや
function kdHospital(L) {
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#E3F2EC" }, L); for (let x = 0; x < 1600; x += 120) el("path", { d: `M${x} 0 V760`, stroke: "#D3E8DF", "stroke-width": 50 }, L);
  el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#CFE0E8" }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L);
  for (let x = 0; x < 1600; x += 160) el("path", { d: `M${x} 760 L${x - 80} 1000`, stroke: "#B9CDD6", "stroke-width": 4 }, L);
  // まど と カーテン
  el("rect", { x: 560, y: 120, width: 420, height: 300, rx: 14, fill: KD_DREAM ? "#C8C0E8" : "#CFEAFB", ...S6(6) }, L); IC.cloud(L, 700, 220, .6); IC.tree(L, 900, 360, .5, "#7BD389");
  el("path", { d: "M770 120 V420 M560 270 H980", ...S6(5) }, L);
  el("path", { d: "M540 100 Q600 260 560 440 L640 440 Q650 260 610 100 Z", fill: "#BFE3D3", ...S6(5) }, L); el("rect", { x: 520, y: 92, width: 480, height: 18, rx: 8, fill: "#C9D3DE", ...S6(4) }, L);
  // じゅうじの マーク と とけい
  { const g = el("g", { transform: "translate(250 190)" }, L); el("circle", { r: 70, fill: "#FFFFFF", ...S6(5) }, g); el("path", { d: "M-16 -46 h32 v30 h30 v32 h-30 v30 h-32 v-30 h-30 v-32 h30 Z", fill: "#7BD389", ...S6(4) }, g); }
  { const g = el("g", { transform: "translate(1460 150)" }, L); el("circle", { r: 54, fill: "#FFFFFF", ...S6(5) }, g); el("path", { d: "M0 0 V-34 M0 0 L24 12", ...S6(6) }, g); }
  // はなびん
  el("rect", { x: 540, y: 420, width: 460, height: 20, rx: 6, fill: "#FFFFFF", ...S6(4) }, L); el("path", { d: "M880 420 q-6 -60 10 -80 h30 q16 20 10 80 Z", fill: "#9FD6F5", ...S6(4) }, L);
  [[890, 320, "#FF8FA3"], [925, 310, "#FFD25E"], [905, 290, "#FF6F61"]].forEach(([x, y, c]) => { el("path", { d: `M${x} ${y} L905 345`, stroke: "#5BA34D", "stroke-width": 5 }, L); for (let a = 0; a < 5; a++) el("circle", { cx: x + 11 * Math.cos(a * 1.256), cy: y + 11 * Math.sin(a * 1.256), r: 10, fill: c, ...S6(2) }, L); el("circle", { cx: x, cy: y, r: 7, fill: "#FFD25E" }, L); });
}
// てんてき と しんでんずの きかい（うごく）
function kdHospProps(G) {
  { const g = el("g", { transform: "translate(500 310)" }, G); el("path", { d: "M0 0 V650 M-50 650 H50 M0 10 H60", fill: "none", ...S6(7) }, g); el("path", { d: "M40 10 q-10 0 -10 14 v60 q0 18 20 18 h20 q20 0 20 -18 v-60 q0 -14 -10 -14 Z", fill: "#E8F7FF", ...S6(4) }, g);
    el("path", { d: "M60 104 q40 120 180 200", fill: "none", stroke: "#9FD6F5", "stroke-width": 5 }, g);
    const d = el("ellipse", { cx: 60, cy: 120, rx: 5, ry: 7, fill: "#9FD6F5" }, g); let t = 0; addTick(dt => { if (!d.isConnected) return false; t = (t + dt) % 1.4; d.setAttribute("cy", (112 + t * 30).toFixed(1)); d.setAttribute("opacity", t < 1 ? 1 : 0); }); }
  { const g = el("g", { transform: "translate(1200 330)" }, G); el("path", { d: "M0 -70 V-150 M-60 -150 H120", fill: "none", ...S6(8) }, g); el("rect", { x: -90, y: -70, width: 180, height: 130, rx: 14, fill: "#3B3A44", ...S6(5) }, g); el("rect", { x: -74, y: -56, width: 148, height: 84, rx: 6, fill: "#18323A" }, g);
    const ln = el("path", { fill: "none", stroke: "#7BD389", "stroke-width": 4, "stroke-linejoin": "round" }, g); let t = 0;
    addTick(dt => { if (!ln.isConnected) return false; t += dt; let d = ""; for (let i = 0; i <= 37; i++) { const x = -70 + i * 4, ph = ((i * 4 + t * 120) % 148) / 148, y = -14 + (ph > .45 && ph < .5 ? -30 : ph >= .5 && ph < .55 ? 18 : 0); d += (i ? "L" : "M") + x + " " + y; } ln.setAttribute("d", d); });
    let b = 0; addTick(dt => { if (!g.isConnected) return false; b += dt; if (b > 1.23) { b = 0; if (ctx && KD_PLACE === "びょういん") blip(1320, 1320, .05, "sine"); } }); }
}
// ベッド（まえに かく。ひとが ねて いる ように みえる）
function kdBed(G, x, w, top, cast) {
  el("path", { d: `M${x - w / 2 - 20} ${top - 170} V${top + 170} M${x + w / 2 + 20} ${top - 60} V${top + 170}`, fill: "none", ...S6(10) }, G);
  el("path", { d: `M${x - w / 2 - 20} ${top - 170} H${x - w / 2 + 40}`, fill: "none", ...S6(10) }, G);
  el("rect", { x: x - w / 2, y: top, width: w, height: 110, rx: 30, fill: "#FFFFFF", ...S6(6) }, G); // ふとん
  el("path", { d: `M${x - w / 2 + 10} ${top + 24} H${x + w / 2 - 10}`, stroke: "#9FD6F5", "stroke-width": 10 }, G);
  for (let k = 0; k < 4; k++) el("path", { d: `M${x - w / 2 + 70 + k * 110} ${top + 50} q20 20 40 0`, fill: "none", stroke: "#D3E8DF", "stroke-width": 6 }, G);
  el("rect", { x: x - w / 2 - 10, y: top + 100, width: w + 20, height: 40, rx: 8, fill: "#C9D3DE", ...S6(5) }, G);
  [x - w / 2 + 20, x + w / 2 - 20].forEach(cx => { el("circle", { cx, cy: top + 180, r: 18, fill: "#3B3A44", ...S6(4) }, G); });
  if (cast) { // ギプスの あし：つりさげて いる
    el("path", { d: `M${x + w / 2 - 40} ${top - 330} H${x + w / 2 + 110} V${top + 170}`, fill: "none", ...S6(9) }, G);
    el("path", { d: `M${x + w / 2 + 40} ${top - 330} V${top - 160}`, stroke: "#8E929C", "stroke-width": 5 }, G);
    const lg = el("g", { transform: `translate(${x + w / 2 - 70} ${top - 40}) rotate(-24)` }, G);
    el("rect", { x: 0, y: -40, width: 210, height: 80, rx: 36, fill: "#FFFFFF", ...S6(6) }, lg); for (let k = 1; k < 5; k++) el("path", { d: `M${k * 40} -38 q10 38 0 76`, fill: "none", stroke: "#DCE3EA", "stroke-width": 5 }, lg);
    el("ellipse", { cx: 214, cy: 0, rx: 26, ry: 34, fill: "#3B3A44", ...S6(5) }, lg); // ひづめ
    el("path", { d: "M120 -40 Q150 -70 180 -40", fill: "none", stroke: "#8E929C", "stroke-width": 5 }, lg);
    txt(lg, 70, 14, "♥", 30, { fill: "#FF8FA3" }); }
}
// よるの みち と パトカー
function kdPatrolCar(G, x, y) { const g = el("g", { transform: `translate(${x} ${y})` }, G);
  el("path", { d: "M-260 -40 V-110 Q-260 -130 -240 -130 H-150 L-100 -200 H110 Q140 -200 160 -170 L200 -130 Q230 -128 230 -100 V-40 Z", fill: "#FFFFFF", ...S6(6) }, g);
  el("path", { d: "M-260 -90 H230 V-40 H-260 Z", fill: "#2B2A33", ...S6(5) }, g);
  el("path", { d: "M-90 -186 H0 V-136 H-130 Z M14 -186 H100 L140 -136 H14 Z", fill: "#BFD7F2", ...S6(4) }, g);
  { const e = el("g", { transform: "translate(-20 -110)" }, g); el("path", { d: "M0 -16 L4.7 -6 L15 -5 L7.5 2.5 L9.4 13 L0 8 L-9.4 13 L-7.5 2.5 L-15 -5 L-4.7 -6 Z", fill: "#F2C14E", ...S6(3) }, e); }
  const lb = el("g", {}, g); el("rect", { x: -70, y: -226, width: 140, height: 26, rx: 10, fill: "#3B3A44", ...S6(4) }, lb); const r1 = el("rect", { x: -64, y: -222, width: 60, height: 18, rx: 6, fill: "#FF3B3B" }, lb), r2 = el("rect", { x: 4, y: -222, width: 60, height: 18, rx: 6, fill: "#FF3B3B" }, lb);
  const wh = [-160, 130].map(cx => { const w = el("g", { transform: `translate(${cx} -40)` }, g); el("circle", { r: 40, fill: "#2B2A33" }, w); el("circle", { r: 16, fill: "#D0D4DA" }, w); el("path", { d: "M-14 0 H14 M0 -14 V14", stroke: "#2B2A33", "stroke-width": 4 }, w); return w; });
  let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; const on = Math.floor(t * 6) % 2; r1.setAttribute("opacity", on ? 1 : .25); r2.setAttribute("opacity", on ? .25 : 1); });
  g.wheels = wh; g.lightOn = true; return g; }
function kdAmbulance(G, x, y) { const g = el("g", { transform: `translate(${x} ${y})` }, G);
  el("path", { d: "M-300 -40 V-250 Q-300 -270 -280 -270 H110 Q130 -270 140 -250 L200 -150 Q240 -146 240 -110 V-40 Z", fill: "#FFFFFF", ...S6(7) }, g);
  el("path", { d: "M-300 -130 H240 V-104 H-300 Z", fill: "#FF5A4E", ...S6(4) }, g);
  el("path", { d: "M120 -246 L170 -160 H100 V-246 Z", fill: "#BFD7F2", ...S6(4) }, g); el("rect", { x: -40, y: -240, width: 110, height: 80, rx: 6, fill: "#BFD7F2", ...S6(4) }, g);
  { const s = el("g", { transform: "translate(-170 -190)" }, g); for (let a = 0; a < 3; a++) el("rect", { x: -12, y: -42, width: 24, height: 84, rx: 6, fill: "#3E7FD6", transform: `rotate(${a * 60})` }, s); el("circle", { r: 10, fill: "#FFFFFF" }, s); }
  el("path", { d: "M-300 -250 V-50", ...S6(4) }, g); el("path", { d: "M-214 -250 V-50", stroke: INK, "stroke-width": 3, opacity: .4 }, g); // うしろの ドア
  const lb = el("g", {}, g); el("rect", { x: -80, y: -294, width: 160, height: 26, rx: 10, fill: "#3B3A44", ...S6(4) }, lb); const r1 = el("rect", { x: -74, y: -290, width: 70, height: 18, rx: 6, fill: "#FF3B3B" }, lb), r2 = el("rect", { x: 4, y: -290, width: 70, height: 18, rx: 6, fill: "#FF3B3B" }, lb);
  const wh = [-200, 140].map(cx => { const w = el("g", { transform: `translate(${cx} -40)` }, g); el("circle", { r: 42, fill: "#2B2A33" }, w); el("circle", { r: 17, fill: "#D0D4DA" }, w); el("path", { d: "M-15 0 H15 M0 -15 V15", stroke: "#2B2A33", "stroke-width": 4 }, w); return w; });
  let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; const on = Math.floor(t * 5) % 2; r1.setAttribute("opacity", on ? 1 : .25); r2.setAttribute("opacity", on ? .25 : 1); });
  g.wheels = wh; return g; }
// くるまを はしらせる（x0 → x1、タイヤが まわる）
function kdDrive(g, y, x0, x1, ms) { let a = 0; return tween(ms, k => { const e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, x = x0 + (x1 - x0) * e; g.setAttribute("transform", `translate(${x.toFixed(1)} ${(y + Math.sin(k * 60) * 1.5).toFixed(1)})`); a += (x1 - x0) / Math.abs(x1 - x0) * 14; g.wheels.forEach(w => { const m = w.getAttribute("transform").match(/translate\(([-\d.]+) /); w.setAttribute("transform", `translate(${m[1]} -40) rotate(${a.toFixed(0)})`); }); }); }
// サイレン（ピーポー）
function kdSiren(sec, hi = 960, lo = 770) { const n = Math.round(sec / .9); for (let i = 0; i < n; i++) { later(i * 900, () => { if (ctx) blip(hi, hi, .42, "triangle"); }); later(i * 900 + 450, () => { if (ctx) blip(lo, lo, .42, "triangle"); }); } }
function kdPiPo(sec) { for (let i = 0; i < Math.round(sec / .5); i++) later(i * 500, () => { if (ctx) blip(i % 2 ? 640 : 860, i % 2 ? 640 : 860, .22, "square"); }); } // パトカーの ウー
// てつの ぼうの へや（よる）
function kdCell(L) {
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#4A4F63" }, L);
  for (let y = 0; y < 780; y += 70) for (let x = (y / 70) % 2 ? -60 : 0; x < 1600; x += 120) el("rect", { x, y, width: 120, height: 70, fill: "none", stroke: "#3C4152", "stroke-width": 4 }, L);
  el("rect", { x: 0, y: 780, width: 1600, height: 220, fill: "#3A3E4E" }, L); el("path", { d: "M0 780 H1600", ...S6(6) }, L);
  // たかい ところの ちいさい まど（つきと ほし）
  el("rect", { x: 1060, y: 150, width: 220, height: 160, rx: 6, fill: "#1E2A4A", ...S6(6) }, L); el("circle", { cx: 1200, cy: 210, r: 32, fill: "#FFF3C4" }, L); el("circle", { cx: 1216, cy: 200, r: 28, fill: "#1E2A4A" }, L);
  [[1100, 180], [1140, 260], [1250, 280]].forEach(([x, y]) => el("circle", { cx: x, cy: y, r: 4, fill: "#FFF3C4" }, L));
  for (let x = 1090; x < 1280; x += 40) el("path", { d: `M${x} 150 V310`, stroke: "#8E929C", "stroke-width": 9 }, L);
  // つきの ひかり
  el("path", { d: "M1060 310 L760 980 H1260 L1280 310 Z", fill: "#FFF3C4", opacity: .1 }, L);
  // ベンチ と もうふ
  el("rect", { x: 520, y: 760, width: 560, height: 40, rx: 8, fill: "#8A6A4A", ...S6(5) }, L); el("path", { d: "M560 800 V880 M1040 800 V880", ...S6(9) }, L);
  el("path", { d: "M900 742 h150 q14 0 14 14 v6 h-178 v-6 q0 -14 14 -14 Z", fill: "#7D8597", ...S6(4) }, L);
  // かべの らくがき なし。ぽたっと おちる しずく
  const d = el("ellipse", { cx: 380, cy: 120, rx: 6, ry: 9, fill: "#9FD6F5", ...S6(2) }, L); let t = 0;
  addTick(dt => { if (!d.isConnected) return false; t += dt; const p = t % 2.4; d.setAttribute("cy", (120 + (p > 1.6 ? (p - 1.6) * (p - 1.6) * 1200 : 0)).toFixed(0)); if (p > 2.38 && ctx && KD_PLACE === "てつの へや") blip(1400, 900, .05, "sine"); });
}
function kdBars(G) { // てつの ぼう（まえ）
  el("rect", { x: 0, y: 70, width: 1600, height: 26, fill: "#5C6170", ...S6(5) }, G); el("rect", { x: 0, y: 900, width: 1600, height: 26, fill: "#5C6170", ...S6(5) }, G);
  for (let x = 60; x < 1600; x += 130) { el("rect", { x: x - 11, y: 0, width: 22, height: 1000, fill: "#6E7384", ...S6(5) }, G); el("path", { d: `M${x - 3} 0 V1000`, stroke: "#9AA0AE", "stroke-width": 4 }, G); }
  { const g = el("g", { transform: "translate(1430 520)" }, G); el("rect", { x: -40, y: -50, width: 80, height: 100, rx: 10, fill: "#8E929C", ...S6(5) }, g); el("circle", { cy: -6, r: 12, fill: INK }, g); el("path", { d: "M0 0 V24", ...S6(7) }, g); } }
// ねる へや（あさ）
function kdBedroom(L) {
  kdWall(L, "#FFF1DC", "#FCE6C6");
  el("rect", { x: 980, y: 110, width: 420, height: 330, rx: 16, fill: "#CFEAFB", ...S6(6) }, L); IC.sun(L, 1300, 210, 46); IC.cloud(L, 1100, 300, .6); el("path", { d: "M1190 110 V440 M980 275 H1400", ...S6(5) }, L);
  el("path", { d: "M960 96 Q1010 270 980 460 L1040 460 Q1050 270 1020 96 Z M1420 96 Q1370 270 1400 460 L1340 460 Q1330 270 1360 96 Z", fill: "#FFD25E", ...S6(5) }, L);
  el("path", { d: "M1050 440 L700 1000 H1400 L1360 440 Z", fill: "#FFF3C4", opacity: .4 }, L); // あさの ひかり
  el("rect", { x: 0, y: 820, width: 1600, height: 180, fill: "#E8C08A" }, L); el("path", { d: "M0 820 H1600", ...S6(6) }, L);
  // つくえの うえの めざましどけい
  el("rect", { x: 110, y: 660, width: 240, height: 24, rx: 6, fill: "#C98A4B", ...S6(5) }, L); el("path", { d: "M130 684 V820 M330 684 V820", ...S6(8) }, L);
  { const g = el("g", { transform: "translate(230 600)" }, L); el("circle", { r: 50, fill: "#FF8FA3", ...S6(5) }, g); el("circle", { r: 36, fill: "#FFFFFF", ...S6(3) }, g); el("path", { d: "M0 0 V-24 M0 0 L16 8", ...S6(5) }, g); [-1, 1].forEach(s => el("circle", { cx: s * 34, cy: -48, r: 14, fill: "#FFD25E", ...S6(4) }, g)); }
  // ほんだな
  el("rect", { x: 1440, y: 480, width: 150, height: 340, fill: "#C98A4B", ...S6(5) }, L); [560, 660, 760].forEach(y => el("path", { d: `M1440 ${y} H1590`, ...S6(5) }, L));
  [["#FF8FA3", 1452], ["#7FCBF0", 1478], ["#FFD25E", 1504], ["#7BD389", 1530]].forEach(([c, x]) => [490, 590, 690].forEach((y, k) => el("rect", { x: x + k * 6, y: y + 6, width: 20, height: 60, rx: 3, fill: c, ...S6(3) }, L)));
}
function kdFuton(G, x, top, w = 560) { el("rect", { x: x - w / 2 - 30, y: top - 160, width: 70, height: 340, rx: 16, fill: "#7FCBF0", ...S6(6) }, G); // ベッドの あたま
  el("rect", { x: x - w / 2, y: top, width: w, height: 160, rx: 40, fill: "#9FD6F5", ...S6(6) }, G); for (let k = 0; k < 5; k++) el("circle", { cx: x - w / 2 + 80 + k * 100, cy: top + 70, r: 16, fill: "#FFFFFF", opacity: .8 }, G);
  el("rect", { x: x - w / 2 - 20, y: top + 140, width: w + 40, height: 50, rx: 10, fill: "#C98A4B", ...S6(5) }, G); }
// こうえん
function kdPark(L, slide = false) {
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#CFEAFB" }, L); IC.sun(L, 1460, 110, 50); IC.cloud(L, 240, 130, 1); IC.cloud(L, 860, 90, .8);
  el("path", { d: "M0 560 Q300 470 620 540 Q980 450 1300 530 Q1450 500 1600 520 V700 H0 Z", fill: "#A8DB8F", ...S6(5) }, L);
  [[90, 560, .9], [330, 540, .7], [1160, 540, .8], [1440, 560, .9]].forEach(([x, y, k], i) => IC.tree(L, x, y, k, i % 2 ? "#6DBB5E" : "#7BD389"));
  el("rect", { x: 0, y: 700, width: 1600, height: 300, fill: "#BFE3A6" }, L); el("path", { d: "M0 700 H1600", ...S6(6) }, L);
  if (!slide) { el("path", { d: "M0 860 H1600 M0 960 H1600", stroke: "#FFFFFF", "stroke-width": 8, "stroke-dasharray": "40 22" }, L); // はしる ところ
    el("rect", { x: 262, y: 820, width: 14, height: 180, fill: "#FFFFFF", ...S6(3) }, L); } // スタートの せん
  // ベンチ と はな
  el("rect", { x: 700, y: 650, width: 220, height: 20, rx: 6, fill: "#C98A4B", ...S6(5) }, L); el("path", { d: "M720 670 V710 M900 670 V710", ...S6(7) }, L);
  for (let k = 0; k < 10; k++) { const x = 40 + (k * 167) % 1560, y = 730 + (k * 37) % 50; [0, 72, 144, 216, 288].forEach(a => el("circle", { cx: x + 9 * Math.cos(a * Math.PI / 180), cy: y + 9 * Math.sin(a * Math.PI / 180), r: 7, fill: ["#FF8FA3", "#FFD25E", "#FFFFFF"][k % 3] }, L)); }
  if (slide) { // すべりだい（はしごの かいだん）
    const g = el("g", { transform: "translate(860 975)" }, L);
    el("path", { d: "M0 0 L60 -520 M140 0 L200 -520", ...S6(12) }, g); for (let k = 1; k < 8; k++) el("path", { d: `M${k * 7.5} ${-k * 65} H${140 + k * 7.5}`, stroke: "#E8735A", "stroke-width": 14, "stroke-linecap": "round" }, g);
    el("rect", { x: 40, y: -560, width: 200, height: 44, rx: 10, fill: "#FFD25E", ...S6(6) }, g);
    el("path", { d: "M220 -540 Q420 -500 520 -100 Q540 -20 640 -10 L640 20 Q500 20 470 -80 Q380 -460 200 -500 Z", fill: "#FF8FA3", ...S6(6) }, g); }
}
// えきの かいだん
function kdStation(L) {
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#E9E4DA" }, L); for (let y = 0; y < 400; y += 80) el("path", { d: `M0 ${y} H1600`, stroke: "#DAD4C8", "stroke-width": 3 }, L);
  { const g = el("g", { transform: "translate(1200 120)" }, L); el("rect", { x: -150, y: -50, width: 300, height: 100, rx: 12, fill: "#3E7FD6", ...S6(5) }, g); txt(g, -40, 18, "🚃", 46, { "text-anchor": "middle" }); el("path", { d: "M40 0 l50 -30 v18 h40 v24 h-40 v18 Z", fill: "#FFFFFF", ...S6(3) }, g); }
  const x0 = 380, y0 = 975, R = 90, Q = 50, N = 10;
  el("path", { d: `M${x0} ${y0} L${x0 + N * R} ${y0 - N * Q} H1600 V1000 H${x0} Z`, fill: "#C9C2B4", ...S6(6) }, L);
  for (let i = 1; i <= N; i++) { const x = x0 + (i - 1) * R, y = y0 - i * Q; el("rect", { x, y, width: R, height: Q, fill: "#D9D3C7", ...S6(4) }, L); el("rect", { x: x - 4, y: y - 4, width: R + 8, height: 10, rx: 4, fill: "#F2C14E", ...S6(3) }, L); }
  el("path", { d: `M${x0 - 20} ${y0 - 200} L${x0 + N * R} ${y0 - N * Q - 200}`, ...S6(14) }, L); el("path", { d: `M${x0 - 20} ${y0 - 200} L${x0 + N * R} ${y0 - N * Q - 200}`, stroke: "#C9D3DE", "stroke-width": 7 }, L);
  for (let i = 1; i <= N; i += 2) { const x = x0 + (i - .5) * R; el("path", { d: `M${x} ${y0 - i * Q} V${y0 - i * Q - 200 + 10}`, stroke: "#8E929C", "stroke-width": 6 }, L); }
  el("rect", { x: 0, y: y0, width: 1600, height: 30, fill: "#B9B4AA" }, L);
}
const ROOMS_KD = { "かいだん": kdStairsRoom, "いえの まえ": L => kdHouseFront(L), "よるの みち": L => kdHouseFront(L, true), "びょういん": kdHospital, "てつの へや": kdCell, "ねる へや": kdBedroom, "こうえん": L => kdPark(L), "すべりだい": L => kdPark(L, true), "えきの かいだん": kdStation };
{ const dr = drawRoom; drawRoom = function (place, noSign = false) {
    if (curStage !== "kaidan" || !ROOMS_KD[place]) return dr(place, noSign);
    sceneLayer.innerHTML = ""; KD_PLACE = place; ROOMS_KD[place](sceneLayer);
    if (KD_DREAM) el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#9C8AD8", opacity: place === "てつの へや" ? .08 : .16 }, sceneLayer); // ゆめの いろ
    if (!noSign) { const g = el("g", {}, sceneLayer); el("rect", { x: 620, y: 24, width: 360, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, place.length > 6 ? 38 : 46, { "text-anchor": "middle" }); } }; }
/* ---------- ゆめの わく（くもの ふち）と めざめ ---------- */
function kdFrame() {
  if (!KD_DREAM) return; const g = el("g", { "pointer-events": "none" }, KD_FR), puffs = [];
  const add = (x, y, r) => puffs.push([x, y, r, Math.random() * 6]);
  for (let x = 0; x <= 1600; x += 90) { add(x, -10, 70 + (x % 3) * 8); add(x, 1018, 44 + (x % 2) * 6); }
  for (let y = 80; y <= 940; y += 110) { add(-10, y, 66 + (y % 3) * 8); add(1610, y, 66 + (y % 2) * 8); }
  const cs = puffs.map(([x, y, r]) => el("circle", { cx: x, cy: y, r, fill: "#F3EEFF", stroke: "#B9A8D9", "stroke-width": 6 }, g));
  const ins = puffs.map(([x, y, r]) => el("circle", { cx: x, cy: y, r: r - 5, fill: "#F3EEFF" }, g));
  const lab = el("g", { transform: "translate(1340 70)" }, g); el("rect", { x: -170, y: -34, width: 340, height: 68, rx: 34, fill: "#FFFFFF", stroke: "#8C6BC2", "stroke-width": 6 }, lab); txt(lab, 0, 14, "💭 もしもの おはなし", 32, { "text-anchor": "middle", fill: "#6B4FA8" });
  let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; puffs.forEach(([x, y, r, ph], i) => { const k = 1 + Math.sin(t * 1.6 + ph) * .06; cs[i].setAttribute("r", (r * k).toFixed(1)); ins[i].setAttribute("r", (r * k - 5).toFixed(1)); }); });
  for (let k = 0; k < 6; k++) { const s = el("g", {}, g); el("path", { d: "M0 -14 Q3 -3 14 0 Q3 3 0 14 Q-3 3 -14 0 Q-3 -3 0 -14 Z", fill: "#FFFFFF", stroke: "#B9A8D9", "stroke-width": 3 }, s); let a = Math.random() * 6;
    addTick(dt => { if (!s.isConnected) return false; a += dt; const x = 120 + (k * 271) % 1360, y = 160 + (k * 173) % 640 + Math.sin(a) * 30; s.setAttribute("transform", `translate(${x} ${y.toFixed(0)}) scale(${(.6 + .4 * Math.abs(Math.sin(a * 1.3))).toFixed(2)})`); s.setAttribute("opacity", (.4 + .4 * Math.sin(a * 1.3)).toFixed(2)); }); }
  return g; }
// ふわふわ くもが ふえて がめんを おおう（ゆめに はいる／でる とき）
async function kdCloudWipe(cover) {
  const g = el("g", { "pointer-events": "none" }, hudLayer), cs = [];
  for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2, x = 800 + Math.cos(a) * 900, y = 500 + Math.sin(a) * 620; cs.push([el("circle", { cx: x, cy: y, r: 10, fill: "#F3EEFF", stroke: "#B9A8D9", "stroke-width": 6 }, g), x, y]); }
  const mid = el("circle", { cx: 800, cy: 500, r: 0, fill: "#F3EEFF" }, g);
  if (ctx) { for (let i = 0; i < 6; i++) later(i * 90, () => blip(900 + i * 140, 1300 + i * 160, .25, "sine")); }
  await tween(900, k => { const e = cover ? k : 1 - k; cs.forEach(([c, x, y]) => { c.setAttribute("r", (10 + e * 520).toFixed(0)); c.setAttribute("cx", (x + (800 - x) * e * .45).toFixed(0)); c.setAttribute("cy", (y + (500 - y) * e * .45).toFixed(0)); }); mid.setAttribute("r", (e * 900).toFixed(0)); });
  return g; }
/* ---------- 場面の よういと うごき ---------- */
// ばしょを かえる（ひとは かくして、まるシマと ぽにー だけ だす）。あいては asker
function kdView(place, asker = "onii", noSign = false) {
  if (KD_FG) KD_FG.remove(); if (KD_FR) KD_FR.remove();
  setSitView({ id: "kd_" + place, place, asker, intro: "kd" }, "shima"); const h = C.shima, a = C[asker];
  h.dx.v = h.dx.t = 0; a.dx.v = a.dx.t = 0;
  KD_FG = el("g", {}, front()); KD_FR = el("g", {}, front()); kdFrame(); if (noSign) [...sceneLayer.children].slice(-1)[0].remove();
  return { h, a }; }
function kdClean() { if (KD_FG) KD_FG.remove(); if (KD_FR) KD_FR.remove(); KD_FG = KD_FR = null; }
const kdPut = (c, x, base, s) => { resetChar(c); delete c.tm.closed; place(c, x, base, s); c.root.style.display = ""; c.root.setAttribute("opacity", 1); if (!visible.includes(c)) visible.push(c); c.dx.v = c.dx.t = 0; return c; };
const KD_S = .6; // かいだんの うえの おおきさ
async function kdMove(c, x1, y1, ms, hop = 0) { const x0 = c.x + 200 * c.s, y0 = c.y + c.base * c.s; hold(c, "run", ms / 1000); await tween(ms, k => place(c, x0 + (x1 - x0) * k, y0 + (y1 - y0) * k - Math.sin(k * Math.PI) * hop, c.s)); }
async function kdClimb(c, from, to, ms = 380) { const d = to > from ? 1 : -1; for (let i = from; i !== to; i += d) { const [x, y] = kdStep(i + d); await kdMove(c, x, y, ms, 26); if (ctx) blip(260 + (i + d) * 30, 200 + (i + d) * 30, .05, "triangle"); } }
function kdBurst(G, x, y, word = "ドン！") { const g = el("g", { transform: `translate(${x} ${y})` }, G);
  el("path", { d: "M0 -110 L26 -40 L100 -70 L54 -10 L120 30 L44 40 L60 110 L0 60 L-60 110 L-44 40 L-120 30 L-54 -10 L-100 -70 L-26 -40 Z", fill: "#FFE27A", ...S6(6) }, g); txt(g, 0, 18, word, 52, { "text-anchor": "middle", fill: "#E8473C", stroke: "#FFFFFF", "stroke-width": 8, "paint-order": "stroke" });
  tween(260, k => g.setAttribute("transform", `translate(${x} ${y}) scale(${(.3 + .7 * easeBack(k)).toFixed(3)})`)); later(1200, () => tween(300, k => g.setAttribute("opacity", (1 - k).toFixed(2))).then(() => g.remove())); return g; }
function kdThud(v = 1) { if (!ctx) return; noise(.18, 260, .9 * v); blip(150, 55, .25, "sine"); }
// いたい ところ（あしに あかい しるし）
function kdOuch(G, c) { const g = el("g", {}, G); let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; g.innerHTML = ""; const p = world(c, 240, 400), k = 1 + .2 * Math.sin(t * 8);
    [0, 1, 2, 3].forEach(i => { const a = -1.2 + i * .5; el("path", { d: `M${(p.x + Math.cos(a) * 46 * k).toFixed(0)} ${(p.y + Math.sin(a) * 46 * k).toFixed(0)} L${(p.x + Math.cos(a) * 80 * k).toFixed(0)} ${(p.y + Math.sin(a) * 80 * k).toFixed(0)}`, stroke: "#E8473C", "stroke-width": 8, "stroke-linecap": "round" }, g); }); }); return g; }
// むずむず（まわりに ぎざぎざ）
function kdMozu(G, c) { const g = el("g", {}, G); let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; g.innerHTML = ""; const p = world(c, 200, 230);
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + t * .6, r = 150 * c.s / .6, x = p.x + Math.cos(a) * r, y = p.y + Math.sin(a) * r * .9; el("path", { d: `M${x - 18} ${y} l9 -12 l9 12 l9 -12 l9 12`, fill: "none", stroke: "#E2456F", "stroke-width": 6, "stroke-linecap": "round", "stroke-linejoin": "round", transform: `rotate(${(a * 57).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})` }, g); } }); return g; }
// せりふを いう（kmSay の ラッパー）
async function kdSay(key, tag = "まるシマに なって いおう") { const s = KD.say[key]; const r = await kmSay(C.shima, key, s.text, s.keys, tag); KD_LOG.push(`${r.ok ? "○" : "×"}${r.heard}`); if (r.ok) KD_OKN++; KD_N++; return r.ok; }
let KD_LOG = [], KD_OKN = 0, KD_N = 0;
async function kdBgm(dream) { try { if (dream) { if (!AUD.bgm_kaidan_yume) return; await stageBgm("kaidan_yume"); } else await stageBgm("kaidan"); } catch (e) { } }
/* ---------- しょう ---------- */
const KD_CH = [
  // ゆめ①：おして しまう
  async function () {
    KD_DREAM = false; let { h, a } = kdView("かいだん");
    kdPut(a, ...kdStep(0), KD_S); kdPut(h, ...kdStep(-1), KD_S); kdPut(C.pony, 120, 975, .46);
    await sleep(500); await kdSpeak(C.pony, "kdp_intro"); joy(h);
    await kdSpeak(C.pony, "kdp_moshi"); markAbove(C.pony, "q");
    // ゆめの せかいへ
    const w = await kdCloudWipe(true); KD_DREAM = true; kdBgm(true); ({ h, a } = kdView("かいだん"));
    kdPut(a, ...kdStep(0), KD_S); kdPut(h, ...kdStep(-1), KD_S); kdPut(C.pony, 120, 975, .46);
    await sleep(200); await kdCloudWipe(false).then(g => g.remove()); w.remove();
    playMove(a, "point"); await kdSpeak(a, "kdw_onii_race"); playMove(h, "pump");
    // かけあがる：おにいちゃんが さき
    const up1 = kdClimb(a, 0, 5, 330); await sleep(260); await kdClimb(h, -1, 4, 300); await up1;
    await kdSpeak(C.pony, "kdp_push");
    // おす（ゆっくり → ドン）
    h.lean.t = 18; h.armR.t = -95; h.armL.t = 95; await sleep(500); kdBurst(KD_FG, ...((p => [p.x - 40, p.y - 40])(world(a, 140, 260))));
    kdThud(1.2); shake(500, 26); surprise(a); markAbove(a, "ex"); a.lean.t = -30; await sleep(350); h.lean.t = 0; h.armR.t = 0; h.armL.t = 0;
    // ころげおちる（だんで はねながら）
    a.spinDur = 1.6; a.spinTurns = -2; hold(a, "spin", 1.6); hold(a, "closed", 2);
    for (const i of [3, 1]) { const [x, y] = kdStep(i); await kdMove(a, x - 30, y, 300, 70); kdThud(.8); shake(200, 14); }
    { await kdMove(a, 650, 948, 360, 60); } kdThud(1.3); shake(600, 30); flash();
    a.lean.t = -86; a.squash.vel -= 2; await sleep(500); delete a.tm.closed; a.sadMouth = true; tears(a, 6); const ouch = kdOuch(KD_FG, a);
    if (ctx) for (let i = 0; i < 4; i++) later(i * 700, () => blip(520, 380, .35, "triangle"));
    h.sadMouth = true; surprise(h); h.eyeScale.t = 1.4; await sleep(600); await kdSpeak(a, "kdw_onii_itai");
    await kdSpeak(C.pony, "kdp_fall"); h.eyeScale.t = 1;
    // ママが はしって くる
    const m = kdPut(C.mama, -200, 975, .66); await kdMove(m, 290, 975, 1000); playMove(m, "surprise"); await kdSpeak(m, "kdw_mama_dou");
    await kdClimb(h, 4, 1, 260);
    await kdSay("kds_tasukete");
    m.armR.t = -60; await kdSpeak(m, "kdw_mama_kyu"); ouch.remove();
    // いえの まえ：きゅうきゅうしゃ
    ({ h, a } = kdView("いえの まえ", "mama"));
    kdPut(h, 330, 975, .6); kdPut(C.mama, 520, 975, .64); kdPut(C.pony, 120, 975, .46);
    const on = kdPut(C.onii, 800, 935, .56); on.lean.v = on.lean.t = -86; on.sadMouth = true; tears(on, 8);
    const st = el("g", {}, KD_FG); el("rect", { x: 570, y: 925, width: 290, height: 24, rx: 8, fill: "#FFFFFF", ...S6(5) }, st); el("path", { d: "M590 949 L600 975 M840 949 L830 975", ...S6(5) }, st); [600, 830].forEach(x => el("circle", { cx: x, cy: 980, r: 11, fill: "#3B3A44" }, st)); // たんか
    const amb = kdAmbulance(propG, 2000, 905); kdSiren(7); const red = el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FF3B3B", opacity: 0 }, sceneLayer);
    let rt = 0; addTick(dt => { if (!red.isConnected) return false; rt += dt; red.setAttribute("opacity", (Math.max(0, Math.sin(rt * 10)) * .12).toFixed(3)); });
    const sp = kdSpeak(C.pony, "kdp_amb"); await kdDrive(amb, 905, 2000, 1260, 2600); playMove(h, "scared"); await sp;
    // うしろの ドアが あいて、たんかで くるまへ
    const door = el("rect", { x: 0, y: 0, width: 86, height: 200, fill: "#FFFFFF", ...S6(5) }, amb); door.setAttribute("transform", "translate(-300 -250)"); await tween(400, k => door.setAttribute("transform", `translate(-300 -250) skewY(${(-k * 30).toFixed(0)}) scale(${(1 - k * .4).toFixed(2)} 1)`));
    await tween(1400, k => { const dx = k * 200; on.x = 800 + dx - 200 * on.s; st.setAttribute("transform", `translate(${dx.toFixed(0)} 0)`); on.root.setAttribute("opacity", k > .7 ? ((1 - k) / .3).toFixed(2) : 1); st.setAttribute("opacity", k > .7 ? ((1 - k) / .3).toFixed(2) : 1); });
    on.root.style.display = "none"; on.root.setAttribute("opacity", 1); st.remove(); await kdMove(C.mama, 960, 975, 700); C.mama.root.style.display = "none";
    await tween(300, k => door.setAttribute("transform", `translate(-300 -250) skewY(${(-(1 - k) * 30).toFixed(0)}) scale(${(.6 + k * .4).toFixed(2)} 1)`)); if (ctx) noise(.1, 400, .8);
    await sleep(300); kdSiren(4); await kdDrive(amb, 905, 1260, -700, 2400); red.remove(); h.sadMouth = true; playMove(h, "sad"); await sleep(600);
    return [h]; },
  // ゆめ②：びょういん
  async function () {
    KD_DREAM = true; kdBgm(true); let { h, a } = kdView("びょういん", "kumadr");
    kdHospProps(propG); const on = kdPut(C.onii, 760, 790, .6); on.sadMouth = true; kdBed(KD_FG, 770, 460, 720, true);
    kdPut(h, 320, 975, .62); kdPut(C.pony, 120, 975, .46); kdPut(a, 1310, 975, .82); a.dx.v = a.dx.t = 500; h.sadMouth = true;
    await sleep(500); await kdSpeak(C.pony, "kdp_hosp"); a.dx.t = 0; hold(a, "run", .9); await sleep(1000);
    playMove(a, "nod"); await kdSpeak(a, "kdw_dr_hone"); tears(on, 3);
    await kdSpeak(a, "kdw_dr_naze"); playMove(h, "sad");
    await kdSay("kds_gomen");
    on.headRot.t = 25; on.eyeX.t = 1; await kdSpeak(on, "kdw_onii_iya"); tears(on, 4);
    h.sadMouth = true; tears(h, 3); await kdSpeak(C.pony, "kdp_hosp2"); markAbove(h, "drop");
    return [h]; },
  // ゆめ③：おまわりさん → てつの へや → めざめ
  async function () {
    KD_DREAM = true; kdBgm(true); let { h, a } = kdView("びょういん", "inukei");
    kdHospProps(propG); const on = kdPut(C.onii, 760, 790, .6); on.sadMouth = true; on.headRot.t = 25; kdBed(KD_FG, 770, 460, 720, true);
    kdPut(h, 320, 975, .62); kdPut(C.pony, 120, 975, .46); kdPut(a, 1300, 975, .8); a.dx.v = a.dx.t = 600; h.sadMouth = true;
    await kdSpeak(C.pony, "kdp_police"); a.dx.t = 0; hold(a, "run", 1); await sleep(1100); SPECIAL.inukei(a); await sleep(900);
    await kdSpeak(a, "kdw_pol_dare"); playMove(h, "scared");
    await kdSay("kds_boku");
    a.armR.t = -40; await kdSpeak(a, "kdw_pol_ikenai"); a.armR.t = 0; h.sadMouth = true; tears(h, 2);
    // よるの パトカー
    ({ h, a } = kdView("よるの みち", "inukei")); kdPut(C.pony, 120, 975, .46);
    const car = kdPatrolCar(propG, 1150, 930); kdPut(a, 560, 975, .74); kdPut(h, 760, 975, .56); h.sadMouth = true; kdPiPo(4);
    const red = el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FF3B3B", opacity: 0 }, sceneLayer); let rt = 0;
    addTick(dt => { if (!red.isConnected) return false; rt += dt; red.setAttribute("opacity", (Math.max(0, Math.sin(rt * 12)) * .1).toFixed(3)); });
    const sp = kdSpeak(C.pony, "kdp_patrol"); await sleep(600);
    await kdMove(h, 960, 940, 900); h.root.style.display = "none"; await kdMove(a, 1000, 940, 700); a.root.style.display = "none"; if (ctx) noise(.1, 400, .8);
    await sp; kdPiPo(3); await kdDrive(car, 930, 1150, 2200, 2000); red.remove();
    // てつの へや
    ({ h, a } = kdView("てつの へや", "inukei")); a.root.style.display = "none"; kdPut(C.pony, 120, 975, .46);
    kdPut(h, 760, 790, .55); h.sadMouth = true; kdBars(KD_FG); if (ctx) { noise(.3, 200, .9); later(200, () => blip(120, 60, .4, "square")); }
    const dark = el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#101830", opacity: 0, "pointer-events": "none" }, KD_FG); tween(800, k => dark.setAttribute("opacity", (k * .25).toFixed(2)));
    await sleep(600); playMove(h, "sad"); await kdSpeak(C.pony, "kdp_cell"); tears(h, 4);
    await kdSay("kds_kaeritai", "まるシマの きもちを いおう");
    tears(h, 3); await sleep(1500);
    // めが さめる
    if (ctx) for (let i = 0; i < 5; i++) later(i * 160, () => blip(500 + i * 200, 900 + i * 200, .3, "sine"));
    const w = await kdCloudWipe(true); KD_DREAM = false; kdBgm(false);
    ({ h, a } = kdView("ねる へや", "mama")); kdPut(C.pony, 120, 975, .46); kdPut(h, 760, 900, .6); hold(h, "closed", 30); kdFuton(KD_FG, 760, 800);
    a.root.style.display = "none"; await sleep(300); await kdCloudWipe(false).then(g => g.remove()); w.remove();
    if (ctx) for (let i = 0; i < 6; i++) later(400 + i * 180, () => blip(2400, 2900, .06, "sine")); // とりの こえ
    await sleep(800); delete h.tm.closed; surprise(h); jump(h, .8); markAbove(h, "ex"); await kdSpeak(C.pony, "kdp_wake");
    const m = kdPut(C.mama, 1250, 975, .66); m.dx.v = m.dx.t = 500; await sleep(50); m.dx.t = 0; hold(m, "run", .8); await sleep(1000); await kdSpeak(m, "kdw_mama_ohayo");
    await kdSay("kds_yume");
    // ぎゅっ
    await kdMove(m, 1010, 975, 600); m.armL.t = 120; m.armR.t = -120; h.sadMouth = false; await kdSpeak(m, "kdw_mama_daijobu");
    for (let i = 0; i < 4; i++) later(i * 220, () => markAbove(h, "heart", { dx: (i % 2 ? 60 : -60) })); joy(h); await sleep(900);
    return [h]; },
  // ほんとう①：おなじ かいだん
  async function () {
    KD_DREAM = false; kdBgm(false); let { h, a } = kdView("かいだん");
    kdPut(a, ...kdStep(0), KD_S); kdPut(h, ...kdStep(-1), KD_S); kdPut(C.pony, 120, 975, .46);
    await sleep(400); await kdSpeak(C.pony, "kdp_real"); joy(a);
    playMove(a, "point"); await kdSpeak(a, "kdw_onii_race");
    await kdSay("kds_kyousou");
    playMove(a, "nod"); await kdSpeak(a, "kdw_onii_souka");
    await kdSpeak(C.pony, "kdp_real2"); await kdSpeak(a, "kdw_onii_saki");
    await kdSay("kds_saki");
    joy(a); await kdSpeak(a, "kdw_onii_arigato");
    // てすりを もって ゆっくり（てを あげて てすりに）
    a.armL.t = 150; h.armL.t = 150; const u = kdClimb(a, 0, 9, 520); await sleep(1100); await kdClimb(h, -1, 7, 520); await u; a.armL.t = h.armL.t = 0;
    joy(a); joy(h); confetti(30); return [h]; },
  // ほんとう②：むずむず → こうえんで かけっこ
  async function () {
    KD_DREAM = false; kdBgm(false); let { h, a } = kdView("かいだん");
    kdPut(a, ...kdStep(0), KD_S); kdPut(h, ...kdStep(-1), KD_S); kdPut(C.pony, 120, 975, .46); a.happyOn = true;
    await sleep(400); const mz = kdMozu(KD_FG, h); hold(h, "shiver", 3); h.sadMouth = true; await kdSpeak(C.pony, "kdp_mozu");
    await kdSay("kds_daijoubu", "じぶんに いおう"); mz.remove(); h.sadMouth = false; for (let i = 0; i < 6; i++) later(i * 120, () => markAbove(h, "sparkle", { dx: (i - 3) * 30 })); joy(h);
    await kdSay("kds_kakekko", "おにいちゃんに いおう");
    // こうえん
    ({ h, a } = kdView("こうえん")); kdPut(C.pony, 120, 975, .46); kdPut(a, 470, 905, .5); kdPut(h, 330, 990, .56); a.happyOn = false;
    await kdSpeak(C.pony, "kdp_park"); await kdSpeak(a, "kdw_onii_ii");
    if (ctx) { blip(880, 880, .12, "square"); later(500, () => blip(880, 880, .12, "square")); later(1000, () => blip(1320, 1320, .3, "square")); } await sleep(1100);
    const tape = el("path", { d: "M1360 830 V1000", stroke: "#FF6F91", "stroke-width": 10 }, KD_FG);
    hold(h, "run", 3); hold(a, "run", 3); const ra = kdMove(a, 1300, 905, 2900); await kdMove(h, 1400, 990, 2600); tape.setAttribute("d", "M1400 830 q40 80 -10 170"); confetti(40); chime();
    await ra; joy(h); joy(a); await kdSpeak(a, "kdw_onii_hayai"); await kdSpeak(C.pony, "kdp_race_end");
    return [h]; },
];
// それより おおく とまったら：みじかい れんしゅう（すべりだい・えき）
const KD_EXTRA = [
  async function () { let { h, a } = kdView("すべりだい", "tora"); kdPut(C.pony, 120, 975, .46);
    kdPut(h, 920, 975 - 3 * 65, .5); kdPut(a, 870, 975, .5); await kdSpeak(C.pony, "kdp_x_slide");
    playMove(a, "pump"); await kdSpeak(a, "kdw_tora_hayaku"); a.lean.t = 14; surprise(h);
    await kdSay("kds_x_osanai"); a.lean.t = 0; playMove(a, "nod"); await kdSpeak(a, "kdw_tora_gomen"); await kdSpeak(C.pony, "kdp_x_ok"); return [h]; },
  async function () { let { h, a } = kdView("えきの かいだん", "mama"); kdPut(C.pony, 120, 975, .46);
    kdPut(h, 330, 975, .56); kdPut(a, 470, 975, .64); [["kuma", 600, 920], ["pyon", 780, 830], ["kon", 980, 730]].forEach(([k, x, y]) => { const c = xtra(k, x, .5); place(c, x, y, .5); });
    await kdSpeak(C.pony, "kdp_x_eki"); await kdSpeak(a, "kdw_mama_eki");
    await kdSay("kds_x_tesuri"); joy(a); await kdSpeak(a, "kdw_mama_erai"); await kdSpeak(C.pony, "kdp_x_ok"); return [h]; },
];
// 1かい ぶん（とまった とき）
async function kdNext(more) {
  KD_LOG = []; KD_OKN = 0; KD_N = 0; const st = KD_STEP < KD_CH.length ? KD_STEP : -1;
  showEngine(null, `かいだん（${st >= 0 ? "しょう" + (st + 1) : "れんしゅう"}・段${tierOf() + 1}）`);
  if (more && st > 0) { setSitView({ id: "kd_more", place: "かいだん", asker: "onii", intro: "kd" }, "shima"); KD_DREAM = st <= 2; await kdSpeak(C.pony, "kdp_more"); }
  if (st >= 0) { KD_STEP++; await KD_CH[st](); } else { await KD_EXTRA[KD_X++ % KD_EXTRA.length](); }
  const ok = KD_N === 0 || KD_OKN * 2 >= KD_N; grade(ok); GS.tasks++; if (ok) GS.ok++;
  playLog({ type: "kaidan", id: st >= 0 ? "ch" + (st + 1) : "x", okN: KD_OKN, nSay: KD_N, tries: KD_LOG });
  if (ok) { confetti(36); joy(C.shima); const k = rnd(2) ? "kdp_ok" : "kdp_good"; await kdSpeak(C.pony, k); await seedGet(C.shima); }
  await sleep(400); kdClean(); setView("board"); return ok; }
// さいごの しょう（ゴールの とき）
async function kdFinale() {
  KD_DREAM = false; kdBgm(false); let { h, a } = kdView("こうえん", "inukei"); kdPut(C.pony, 120, 975, .46);
  kdPut(h, 520, 975, .58); kdPut(C.onii, 330, 975, .6); a.root.style.display = "none";
  const dr = kdPut(C.kumadr, 1330, 975, .8); const po = kdPut(C.inukei, 1100, 975, .78); dr.dx.v = dr.dx.t = 700; po.dx.v = po.dx.t = 700;
  await sleep(300); dr.dx.t = 0; po.dx.t = 0; hold(dr, "run", 1.2); hold(po, "run", 1.1); await sleep(1300);
  surprise(h); await kdSpeak(C.pony, "kdp_finale"); SPECIAL.inukei(po); await sleep(700);
  await kdSpeak(po, "kdw_pol_erai"); joy(h); playMove(dr, "nod"); await kdSpeak(dr, "kdw_dr_ichiban");
  C.onii.happyOn = true; await kdMove(C.onii, 420, 975, 500); C.onii.armR.t = -60; h.armL.t = 60; await kdSpeak(C.onii, "kdw_onii_daisuki");
  for (let i = 0; i < 6; i++) later(i * 200, () => markAbove(i % 2 ? h : C.onii, "heart")); confetti(70); chime();
  await kdSpeak(C.pony, "kdp_end"); await sleep(600); kdClean(); }
async function kdFinish() { // ゴールの まえに のこりの おはなし → さいごの しょう
  while (KD_STEP < KD_CH.length) { const st = KD_STEP; KD_LOG = []; KD_OKN = 0; KD_N = 0;
    if (st > 0) { setSitView({ id: "kd_more", place: "かいだん", asker: "onii", intro: "kd" }, "shima"); KD_DREAM = false; await kdSpeak(C.pony, "kdp_more"); }
    KD_STEP++; await KD_CH[st](); const ok = KD_N === 0 || KD_OKN * 2 >= KD_N; grade(ok); GS.tasks++; if (ok) GS.ok++;
    playLog({ type: "kaidan", id: "ch" + (st + 1), okN: KD_OKN, nSay: KD_N, tries: KD_LOG, late: 1 }); kdClean(); }
  await kdFinale(); setView("board"); }
/* ---------- しくみに つなぐ ---------- */
{ const lc = landChild; landChild = async function (pc = P.shima) {
    if (curStage !== "kaidan" || winner) return lc(pc);
    const k = kindOf(pc.node); if (k === "start" || k === "treasure") return lc(pc);
    const ok = await kdNext(false); if (ok && pc.player) pc.player.ok++; }; }
{ const gs = gaoSit; gaoSit = async function (before) { if (curStage === "kaidan") return; return gs(before); }; } // ライバルの ばんは 場面なし
{ const en = ending; ending = async function (...a) { if (curStage === "kaidan") await kdFinish(); return en.apply(this, a); }; }
if (typeof endingMulti === "function") { const em = endingMulti; endingMulti = async function (...a) { if (curStage === "kaidan") await kdFinish(); return em.apply(this, a); }; }
/* ---------- 声の パック ---------- */
{ const lp = loadPack; loadPack = async function (id) { const r = await lp(id); if (id !== "kaidan") return r;
    if (!PACK.loaded.kaidan) { try { const q = await fetch("packs/kaidan.json", { cache: "no-cache" }); if (q.ok) { const d = await q.json(); Object.keys(d).forEach(k => AUD[k] = "data:audio/mpeg;base64," + d[k]); PACK.loaded.kaidan = Object.keys(d); } } catch (e) { } }
    if (AUD.bgm_kaidan) await voiceBuf("bgm_kaidan"); return true; }; }
