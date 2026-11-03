/* ================= ロングコース「かわあそび」（kawa、2026-11-03） =================
   ちょうロングの しくみ（slong.js）の うえに のせる。48マス・4だん：① じゅんび・かわらへ ② かわで あそぶ ③ あぶない！ ④ おひる・かえりみち。
   💬 場面：ぽにーが ようすを はなす → あいてが いう → ぽにーの おてほんを まるシマに なって いう → あいての へんじ（段2〜は 2おうふくめ も）。
   🌊 かわの ながれ：2だんめは かわ。「きし」（うえ）と「みずの なか」（した）の マスが ならぶ。みずの マスの 🌊 に とまると、
      ゆるやかな ながれに のって うきわで ぷかぷか 2〜3マス すすむ。🌀 うずまきは くるくる まわって 2マス もどる（うしろへ ながされる）。
   ⚡ かみなり ゴロゴロ：いちばん まえの ひとが かわの まんなか（17ばんめ）を こえたら 1かいだけ。そらが くらく なり、
      みずの マスに いる ひとは ちかくの「きし」の マスへ あがる。そのあと はれる（こわく しない・とまらない）。
   ほかの しかけ：とびいし（ワープ）・カエル（もう一回）・ちょうちょ（×2）・すいか（サイコロ2こ）・パラソル（休み）・うきわ/にじ（+2）・こけ/ぼうし（-2）。
   データと 声：sit/kawa_gen.py → kawa_data.js・sit/pony_kawa.json・aivis/jobs/ka1 */
const KW_N = new Map(); let KW_CUR = "", KW_THUNDER = 0;
const KW_WATER = new Set([17, 19, 20, 22]); // かわの なかの マス（ばしょは slong.js の KW_PTS）
const KW_SAFE = [15, 16, 18, 23]; // かみなりの とき あがる「きし」（21 は かめじいの とおせんぼ なので のぞく）
{ const ap = applyStage; applyStage = function (id, ...a) { if (id === "kawa") { KW_N.clear(); KW_THUNDER = 0; } return ap(id, ...a); }; }
/* ---------- マスの ならび（48） ---------- */
{ const PL = [null, "ks", "ks", "e:dice2", "ks", "balloon", "ks", "e:warp", "ks", "e:kb1", "ks", "e:again",
    "ks", "ks", "e:kf1", "ks", "ks", "e:flow2", "ks", "e:eddy", "e:flow3", null, "ks", "e:rest",
    "ks", "e:kb2", "ks", "balloon", "ks", "e:x2", "ks", "e:kf2", "ks", "e:again", "e:warp", "ks",
    "ks", "e:dice2", "ks", "balloon", "ks", "e:kb1", "ks", "e:kf2", "ks", "e:x2", "ks", null];
  const O = SL_ORDER.kawa, ev = {}, task = {};
  O.forEach((id, i) => { const p = PL[i]; if (!p || id === "0" || id === "4" || id === "15") return;
    if (p.startsWith("e:")) { const t = p.slice(2); ev[id] = [t, 0, `sl_kawa_${t}`, KW.evt[t]]; } else task[id] = p; });
  EVENTS.kawa = ev; LONG_TASKS.kawa = task;
  LEGENDS.kawa = [["ks", "おはなし"], ["balloon", "ふうせん"]]; }
Object.assign(LTASK, { ks: ["#FFE9D6", "💬"] });
const KW_ICON = { flow2: "🌊", flow3: "🌊", eddy: "🌀", warp: "🪨", again: "🐸", x2: "🦋", dice2: "🍉", rest: "⛱", kf1: "🛟", kf2: "🌈", kb1: "💦", kb2: "🧢" };
const KW_EVC = { flow2: "#BFE3F2", flow3: "#BFE3F2", eddy: "#D9C2F0", warp: "#D9C2F0", kb1: "#FFC2D1", kb2: "#FFC2D1", kf1: "#C9EBB5", kf2: "#C9EBB5" };
const kwI = id => SL_ORDER.kawa.indexOf(id);
{ const db = drawBoard; drawBoard = function () { db(); if (curStage !== "kawa") return;
    // みずの マス：まわりに みずの わ（ここは かわの なか）
    SL_ORDER.kawa.forEach((id, i) => { if (!KW_WATER.has(i) || !NODES[id]) return; const [x, y] = NODES[id];
      el("ellipse", { cx: x, cy: y + 30, rx: 62, ry: 16, fill: "none", stroke: "#FFFFFF", "stroke-width": 5, opacity: .85 }, boardLayer); });
    Object.entries(EVENTS.kawa).forEach(([id, [type]]) => { const [x, y] = NODES[id]; el("circle", { cx: x, cy: y, r: 36, fill: KW_EVC[type] || "#FFF1C9", ...S6(4) }, boardLayer); txt(boardLayer, x, y + 14, KW_ICON[type] || "★", 36, { "text-anchor": "middle" }); }); }; }
/* ---------- しかけ ---------- */
{ const be = boardEvent; boardEvent = async function (pc) {
    const ev = curStage === "kawa" && EVENTS.kawa[pc.node];
    if (!ev || (pc.player && pc.player.stay)) return be(pc);
    const t = ev[0];
    if (t === "flow2" || t === "flow3" || t === "eddy") { await sleep(300); markAbove(pc, t === "eddy" ? "drop" : "sparkle"); kwSplash(); await slSay(ev[2], ev[3]); await kwDrift(pc, t === "flow2" ? 2 : t === "flow3" ? 3 : -2); await sleep(300); return; }
    if (t === "kf1") { await sleep(300); markAbove(pc, "heart"); chime(); await slSay(ev[2], ev[3]); await kwDrift(pc, 2); await sleep(300); return; }
    if (/^k[fb]/.test(t)) { await sleep(300); markAbove(pc, t[1] === "f" ? "heart" : "drop"); chime(); await slSay(ev[2], ev[3]); await slGo(pc, t[1] === "f" ? 2 : -2); await sleep(300); return; }
    if (t === "warp") { await sleep(300); markAbove(pc, "ex"); chime(); await slSay(ev[2], ev[3]); await kwStones(pc, slWarpTo("kawa", pc.node, "warp")); await sleep(300); return; }
    return be(pc); }; }
function kwSplash() { if (!ctx) return; noise(.35, 1800, .18); later(120, () => blip(900, 1500, .08, "sine")); later(260, () => blip(700, 1300, .07, "sine")); }
// 🌊 ながれに のって ぷかぷか（うきわに のって、マスを すべるように うごく。まわりの なみも ながれる）
async function kwDrift(pc, d) {
  const O = SL_ORDER.kawa; let i = slIdx(pc.node); const step = d > 0 ? 1 : -1;
  const g = el("g", { "pointer-events": "none" }, boardLayer), ring = el("g", {}, g), fx = el("g", {}, g); let t = 0, alive = true;
  el("ellipse", { cx: 0, cy: 0, rx: 50, ry: 17, fill: "none", stroke: "#FF6F61", "stroke-width": 15 }, ring); el("ellipse", { cx: 0, cy: 0, rx: 50, ry: 17, fill: "none", stroke: INK, "stroke-width": 3 }, ring);
  [-1, 1].forEach(s => el("path", { d: `M${s * 36} -12 L${s * 44} 10`, stroke: "#FFFFFF", "stroke-width": 10 }, ring));
  let lastX = pc.px; const streaks = [];
  addTick(dt => { if (!alive) return false; t += dt;
    ring.setAttribute("transform", `translate(${pc.px.toFixed(0)} ${(pc.py + 4 + Math.sin(t * 6) * 4).toFixed(0)}) rotate(${(Math.sin(t * 3) * 6).toFixed(1)})`);
    // ながれの すじ：うごく ほうへ ながれて きえる
    const dir = Math.sign(pc.px - lastX) || (d > 0 ? -1 : 1); lastX = pc.px;
    if (Math.random() < dt * 9) { const s = el("path", { d: "M0 0 q20 -10 40 0 t40 0", fill: "none", stroke: "#FFFFFF", "stroke-width": 6, "stroke-linecap": "round", opacity: .9 }, fx);
      streaks.push({ s, x: pc.px - dir * (60 + Math.random() * 60), y: pc.py - 10 + (Math.random() - .5) * 70, v: dir * (220 + Math.random() * 120), life: .9 }); }
    for (let k = streaks.length - 1; k >= 0; k--) { const q = streaks[k]; q.life -= dt; q.x += q.v * dt; q.s.setAttribute("transform", `translate(${q.x.toFixed(0)} ${q.y.toFixed(0)})`); q.s.setAttribute("opacity", Math.max(0, q.life).toFixed(2)); if (q.life <= 0) { q.s.remove(); streaks.splice(k, 1); } } });
  await tween(300, k => ring.setAttribute("opacity", k.toFixed(2)));
  if (d < 0) { // 🌀 うずまき：その ばで くるくる
    const w = el("g", {}, g), sp = el("path", { d: "M0 0 m-8 0 a8 8 0 1 1 16 0 a16 16 0 1 1 -32 0 a26 26 0 1 1 52 0 a38 38 0 1 1 -76 0", fill: "none", stroke: "#5B8FD6", "stroke-width": 7, "stroke-linecap": "round" }, w);
    let r = 0; addTick(dt => { if (!w.isConnected) return false; r += dt * 540; w.setAttribute("transform", `translate(${pc.px.toFixed(0)} ${(pc.py + 6).toFixed(0)}) scale(1 .4) rotate(${r.toFixed(0)})`); });
    for (let k = 0; k < 3; k++) { jump(pc, .25); if (ctx) noise(.3, 900 + k * 200, .12); await sleep(420); } w.remove(); }
  for (let k = 0; k < Math.abs(d); k++) { const j = i + step; if (j < 0 || j >= O.length - 1) break; i = j; pc.node = O[i]; const [x, y] = nodeXY(pc, O[i]);
    if (ctx) { noise(.5, 1100, .12); blip(520, 760, .1, "sine"); } await slide(pc, x, y, .75, 0); }
  pc.trail = []; jump(pc, .4); kwSplash();
  await tween(350, k => ring.setAttribute("opacity", (1 - k).toFixed(2))); alive = false; g.remove(); }
// 🪨 とびいし：いしが あらわれて、ぴょん ぴょん わたる
async function kwStones(pc, to) {
  if (!to) return; const [tx, ty] = nodeXY(pc, to), x0 = pc.px, y0 = pc.py, n = 5, g = el("g", { "pointer-events": "none" }, boardLayer), pts = [];
  for (let k = 1; k <= n; k++) { const u = k / (n + 1), x = x0 + (tx - x0) * u, y = y0 + (ty - y0) * u - Math.sin(u * Math.PI) * 120; pts.push([x, y]);
    const s = el("ellipse", { cx: x, cy: y + 14, rx: 0, ry: 0, fill: "#B9B4AA", ...S6(4) }, g); later(k * 90, () => { s.setAttribute("rx", 34); s.setAttribute("ry", 15); blip(400 + k * 80, 600 + k * 80, .05, "triangle"); }); }
  await sleep(n * 90 + 250);
  for (const [x, y] of [...pts, [tx, ty]]) { if (ctx) blip(600, 900, .08, "triangle"); await slide(pc, x, y, .3, .9); await sleep(60); }
  pc.node = to; pc.trail = []; chime(); await tween(400, k => g.setAttribute("opacity", (1 - k).toFixed(2))); g.remove(); }
/* ---------- ⚡ かみなり ゴロゴロ（1かいだけ） ---------- */
function kwBankFor(i) { let best = null; KW_SAFE.forEach(b => { if (best == null || Math.abs(b - i) < Math.abs(best - i) || (Math.abs(b - i) === Math.abs(best - i) && b > i)) best = b; }); return best; }
async function kwThunder() {
  KW_THUNDER = 1; const O = SL_ORDER.kawa, pcs = PLAYERS.map(p => p.pc);
  const g = el("g", { "pointer-events": "none" }, hudLayer), dark = el("rect", { x: -1200, y: -400, width: 4000, height: 1800, fill: "#2A3354", opacity: 0 }, g);
  const cl = el("g", {}, g), body = el("g", {}, cl); // くもくん（にっこり。こわく しない）
  [[-120, 20, 70], [-40, -20, 90], [60, -10, 80], [140, 25, 60], [0, 40, 80]].forEach(([x, y, r]) => el("circle", { cx: x, cy: y, r, fill: "#9AA3B8", ...S6(6) }, body));
  [[-120, 20, 64], [-40, -20, 84], [60, -10, 74], [140, 25, 54], [0, 40, 74]].forEach(([x, y, r]) => el("circle", { cx: x, cy: y, r, fill: "#9AA3B8" }, body));
  el("path", { d: "M-50 10 q12 -12 24 0 M26 10 q12 -12 24 0", fill: "none", ...S6(6) }, body); el("path", { d: "M-16 44 q16 14 32 0", fill: "none", ...S6(6) }, body);
  el("circle", { cx: -66, cy: 34, r: 12, fill: "#FFB0C0" }, body); el("circle", { cx: 66, cy: 34, r: 12, fill: "#FFB0C0" }, body);
  const bolt = el("path", { d: "M10 110 L-30 200 L10 200 L-20 290 L60 170 L20 170 L50 110 Z", fill: "#FFE27A", ...S6(5), opacity: 0 }, cl);
  const flash = el("rect", { x: -1200, y: -400, width: 4000, height: 1800, fill: "#FFFFFF", opacity: 0 }, g);
  const at = (x, y) => cl.setAttribute("transform", `translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(.8)`);
  if (ctx) noise(1.6, 120, .25);
  await tween(900, k => { dark.setAttribute("opacity", (k * .38).toFixed(3)); at(1250 - 300 * k, -120 + 290 * k); });
  const rumble = async () => { bolt.setAttribute("opacity", 1); flash.setAttribute("opacity", .3); if (ctx) { noise(1.2, 150, .28); blip(90, 40, 1.0, "sine"); }
    await tween(320, k => flash.setAttribute("opacity", (.3 * (1 - k)).toFixed(2))); await sleep(200); bolt.setAttribute("opacity", 0); };
  await rumble(); await sleep(250);
  showBanner("かみなり ゴロゴロ！", 1600); await speak(C.pony, "kwp_kaminari", KW.txt.kwp_kaminari);
  await rumble();
  const inW = pcs.filter(pc => KW_WATER.has(kwI(pc.node)));
  for (const pc of inW) { let i = kwI(pc.node); const to = kwBankFor(i), st = to > i ? 1 : -1; markAbove(pc, "ex"); surprise(pc);
    while (i !== to) { i += st; await hop(pc, O[i], .32, 0); } jump(pc, .5); }
  await speak(C.pony, inW.length ? "kwp_kaminari_ok" : "kwp_kaminari_none", inW.length ? KW.txt.kwp_kaminari_ok : KW.txt.kwp_kaminari_none);
  if (inW.length) confetti(30);
  await tween(1000, k => { dark.setAttribute("opacity", (.38 * (1 - k)).toFixed(3)); at(950 + 900 * k, 170 - 300 * k); }); g.remove();
  for (let i = 0; i < 6; i++) later(i * 80, () => mark("sparkle", 1460 - i * 40, 120 + (i % 2) * 40, { vx: (i - 3) * 80, vy: -120, life: .7, s: .6 }));
  chime(); await speak(C.pony, "kwp_hare", KW.txt.kwp_hare); }
{ const mt = multiTurn; multiTurn = async function (pl, first) { await mt(pl, first);
    if (curStage === "kawa" && !KW_THUNDER && !winner && PLAYERS.some(p => kwI(p.pc.node) >= 17)) await kwThunder(); }; }
/* ---------- 盤の え ---------- */
BOARD_BG.kawa = L => { // くねくね の 盤：やまから ながれる かわ に そって あそぶ
  const T = SL_TH.kawa, P = SL_PTS.kawa; el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: T.ground }, L);
  // ひだりうえ：なつの やま と たいよう（かわの みなもと）
  IC.sun(L, 90, 80, 40); IC.cloud(L, 330, 70, .7);
  el("path", { d: "M-20 360 L150 150 L300 300 L470 120 L640 330 L700 300 L700 360 Z", fill: "#9BCB8A", ...S6(5) }, L);
  el("path", { d: "M430 170 L470 120 L510 170 Q490 160 470 175 Q450 160 430 170 Z", fill: "#FFFFFF", ...S6(3) }, L);
  // かわ：やまから おりて きて、ひだりへ まがって ながれて いく
  const pts = KW_RIV, path = (() => { let d = `M${pts[0][0]} ${pts[0][1]}`; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(0)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(0)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(0)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(0)} ${p2[0]} ${p2[1]}`; } return d; })();
  el("path", { d: path, fill: "none", stroke: "#E6D9BC", "stroke-width": 190, "stroke-linecap": "round", "stroke-linejoin": "round" }, L); // じゃりの きし
  el("path", { d: path, fill: "none", stroke: INK, "stroke-width": 136, "stroke-linecap": "round", "stroke-linejoin": "round" }, L);
  el("path", { d: path, fill: "none", stroke: "#7CC4EA", "stroke-width": 126, "stroke-linecap": "round", "stroke-linejoin": "round" }, L);
  [0, 1, 2].forEach(k => { const p = el("path", { d: path, fill: "none", stroke: "#FFFFFF", "stroke-width": 5, "stroke-linecap": "round", "stroke-dasharray": `${40 + k * 12} ${110 + k * 30}`, opacity: .75, transform: `translate(${(k - 1) * 14} ${(k - 1) * 22})` }, L);
    el("animate", { attributeName: "stroke-dashoffset", values: `0;${-(150 + k * 42) * 2}`, dur: `${2 + k * .5}s`, repeatCount: "indefinite" }, p); }); // やまから ひだりへ ながれる
  [[300, 420, "#FFB36B"], [90, 640, "#FF8FA3"]].forEach(([x, y, c]) => el("path", { d: `M${x} ${y} q20 -12 40 0 q-20 12 -40 0 Z M${x + 38} ${y} l14 -9 v18 Z`, fill: c, ...S6(3) }, L)); // さかな
  // みずの マスの したの いし（わたれる あさせ）
  P.forEach(([x, y], i) => { if (KW_WATER.has(i)) el("ellipse", { cx: x, cy: y + 26, rx: 56, ry: 18, fill: "#A9D9F0", stroke: "#5FA9D6", "stroke-width": 3 }, L); });
  // かわらの こいし（したの くねくねの なか）・き・パラソル
  for (let k = 0; k < 14; k++) { const x = 470 + (k * 97) % 240, y = 730 + (k * 41) % 150; el("ellipse", { cx: x, cy: y, rx: 12 + k % 3 * 4, ry: 7 + k % 2 * 3, fill: "#C9C2B4", stroke: "#8E877A", "stroke-width": 2 }, L); }
  [[1000, 900, .6], [1180, 950, .5], [1530, 880, .55], [1560, 380, .45], [700, 220, .45], [1240, 560, .4]].forEach(([x, y, k], i) => IC.tree(L, x, y, k, i % 2 ? "#6DBB5E" : "#7BD389"));
  kwParasolS(L, 1370, 625); // やすみの ひろば（みぎの わ の なか）
  // バーベキュー（ゴールの ちかく）
  { const x = 1400, y = 150; el("rect", { x: x - 40, y: y - 20, width: 80, height: 30, rx: 6, fill: "#3B3A44", ...S6(4) }, L); el("path", { d: `M${x - 30} ${y + 10} L${x - 40} ${y + 50} M${x + 30} ${y + 10} L${x + 40} ${y + 50}`, ...S6(4) }, L);
    el("path", { d: `M${x - 10} ${y - 28} q-8 -14 0 -28 M${x + 12} ${y - 28} q-8 -14 0 -28`, fill: "none", stroke: "#FFFFFF", "stroke-width": 5, "stroke-linecap": "round" }, L); }
  // ばしょの かんばん（それぞれの だんの はじめの そば）
  const SG = [[560, 800, "🚗"], [270, 640, "🐟"], [1215, 545, "⚠"] /* ⚠ は「❗」の え（icons.js の ALIAS） */, [1150, 340, "🍖"]];
  SG.forEach(([x, y, ic], r) => { const w = T.areas[r].length * 22 + 70; el("rect", { x: x - w / 2, y: y - 30, width: w, height: 60, rx: 18, fill: "#FFFFFFDD", ...S6(4) }, L); txt(L, x - w / 2 + 34, y + 14, ic, 32, { "text-anchor": "middle" }); txt(L, x + 18, y + 10, T.areas[r], 20, { "text-anchor": "middle" }); });
  { const tg = el("g", { "data-top": 1 }, L); el("rect", { x: 960, y: 38, width: 440, height: 72, rx: 22, fill: "#3E9BD6", ...S6(5) }, tg); txt(tg, 1180, 86, `${T.icon} ${T.name}`, 32, { "text-anchor": "middle", fill: "#FFFFFF" }); } };
function kwParasolS(L, x, y) { el("path", { d: `M${x} ${y} V${y - 110}`, ...S6(5) }, L); el("path", { d: `M${x - 80} ${y - 100} Q${x} ${y - 160} ${x + 80} ${y - 100} Z`, fill: "#FF8FA3", ...S6(4) }, L); el("ellipse", { cx: x, cy: y + 4, rx: 70, ry: 14, fill: "#7FCBF0", ...S6(3) }, L); }
/* ---------- 場面の はいけい（かわの ばしょ） ---------- */
const KW_EVE = () => ["mada", "matakuru"].includes(KW_CUR);
function kwSky(L, ground = "#BFE3A6", gy = 760) {
  const eve = KW_EVE(), rain = KW_CUR === "nigori";
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: eve ? "#FFC9A0" : "#CFEAFB" }, L);
  if (eve) el("circle", { cx: 1380, cy: 300, r: 70, fill: "#FF8A5B", ...S6(5) }, L); else if (!rain) IC.sun(L, 1460, 110, 50);
  if (!rain) [[180, 130, 1], [700, 90, .8]].forEach(([x, y, k]) => IC.cloud(L, x, y, k));
  el("path", { d: "M0 470 V380 Q200 220 420 350 Q600 200 820 340 Q1050 180 1280 330 Q1450 250 1600 320 V470 Z", fill: eve ? "#B9A07A" : "#9BCB8A", ...S6(5) }, L);
  if (rain) { // やまの ほうに くろい くもと あめ
    [[300, 200], [520, 170], [720, 210]].forEach(([x, y]) => IC.cloud(L, x, y, 1.6, "#7D8597"));
    for (let k = 0; k < 18; k++) el("path", { d: `M${180 + k * 36} ${250 + (k % 3) * 14} l-14 60`, stroke: "#5B8FD6", "stroke-width": 5, "stroke-linecap": "round" }, L); }
  [80, 330, 1250, 1520].forEach((x, i) => IC.tree(L, x, 430, .8, i % 2 ? "#6DBB5E" : "#7BD389"));
  el("rect", { x: 0, y: gy, width: 1600, height: 1000 - gy, fill: ground }, L); el("path", { d: `M0 ${gy} H1600`, ...S6(6) }, L); }
function kwRiver(L, y1, y2, color) { // おくの かわ（ひだりへ ながれる）
  const c = color || (KW_CUR === "nigori" ? "#B8946A" : "#7CC4EA");
  el("rect", { x: 0, y: y1, width: 1600, height: y2 - y1, fill: c }, L); el("path", { d: `M0 ${y1} H1600 M0 ${y2} H1600`, ...S6(5) }, L);
  for (let k = 0; k < 9; k++) { const x = 60 + k * 180, y = y1 + 18 + (k % 3) * (y2 - y1 - 36) / 2; el("path", { d: `M${x} ${y} q20 -10 40 0 t40 0`, fill: "none", stroke: "#FFFFFF", "stroke-width": 5, "stroke-linecap": "round", opacity: .7 }, L); } }
function kwPebbles(L, y1, y2, n = 40, fill = "#C9C2B4") { for (let k = 0; k < n; k++) { const x = 20 + (k * 389) % 1560, y = y1 + (k * 61) % (y2 - y1); el("ellipse", { cx: x, cy: y, rx: 20 + k % 4 * 7, ry: 11 + k % 3 * 4, fill, stroke: "#8E877A", "stroke-width": 3 }, L); } }
function kwWaterFloor(L, gy = 700, deep = false) { el("rect", { x: 0, y: gy, width: 1600, height: 1000 - gy, fill: KW_CUR === "nigori" ? "#C9A57A" : "#9ED8F0" }, L); el("path", { d: `M0 ${gy} H1600`, ...S6(5) }, L);
  kwPebbles(L, gy + 40, 990, 26, "#BFD9E4");
  for (let k = 0; k < 12; k++) { const x = 40 + (k * 271) % 1520, y = gy + 30 + (k * 53) % (980 - gy); el("path", { d: `M${x} ${y} q24 -10 48 0`, fill: "none", stroke: "#FFFFFF", "stroke-width": 5, "stroke-linecap": "round", opacity: .8 }, L); } }
function kwCar(L, x, y, open) { const g = el("g", { transform: `translate(${x} ${y})` }, L); // y＝タイヤの した
  el("path", { d: "M0 -40 V-120 Q0 -140 20 -140 H90 L150 -210 H330 Q360 -210 380 -180 L420 -130 Q440 -128 440 -100 V-40 Z", fill: "#7FCBF0", ...S6(6) }, g);
  el("path", { d: "M165 -195 H245 V-140 H125 Z M260 -195 H325 L365 -140 H260 Z", fill: "#DDF1FA", ...S6(4) }, g);
  [90, 350].forEach(cx => { el("circle", { cx, cy: -40, r: 40, fill: "#2B2A33" }, g); el("circle", { cx, cy: -40, r: 16, fill: "#D0D4DA" }, g); });
  if (open) { el("path", { d: "M420 -130 L470 -250 L500 -240 L440 -128 Z", fill: "#7FCBF0", ...S6(5) }, g); // うしろの ドアが あいて、にもつ
    el("rect", { x: 330, y: -125, width: 70, height: 60, rx: 8, fill: "#E8735A", ...S6(4) }, g); el("rect", { x: 380, y: -150, width: 60, height: 50, rx: 8, fill: "#FFD25E", ...S6(4) }, g); }
  return g; }
function kwParasol(L, x, y = 760, c = "#FF8FA3") { el("path", { d: `M${x} ${y} V${y - 300}`, ...S6(8) }, L); el("path", { d: `M${x - 190} ${y - 270} Q${x} ${y - 420} ${x + 190} ${y - 270} Z`, fill: c, ...S6(6) }, L);
  for (let k = -1; k <= 1; k++) el("path", { d: `M${x} ${y - 380} Q${x + k * 90} ${y - 330} ${x + k * 130} ${y - 280}`, fill: "none", ...S6(3) }, L); }
function kwMat(L, x, y, w = 360) { el("path", { d: `M${x - w / 2} ${y} L${x - w / 2 + 40} ${y - 70} H${x + w / 2 + 40} L${x + w / 2} ${y} Z`, fill: "#7FCBF0", ...S6(5) }, L);
  for (let k = 1; k < 4; k++) el("path", { d: `M${x - w / 2 + k * w / 4} ${y} l40 -70`, stroke: "#FFFFFF", "stroke-width": 8 }, L); }
function kwGrill(L, x, y = 800, meat = true) { el("path", { d: `M${x - 100} ${y} L${x - 70} ${y - 120} M${x + 100} ${y} L${x + 70} ${y - 120}`, ...S6(7) }, L);
  el("rect", { x: x - 130, y: y - 190, width: 260, height: 80, rx: 12, fill: "#3B3A44", ...S6(6) }, L); el("path", { d: `M${x - 130} ${y - 190} H${x + 130}`, stroke: "#FF8A3D", "stroke-width": 8 }, L);
  for (let k = -2; k <= 2; k++) el("path", { d: `M${x + k * 50} ${y - 200} V${y - 186}`, ...S6(4) }, L);
  if (meat) [[-80, "#B5543A"], [-20, "#7BD389"], [40, "#B5543A"], [95, "#FFD25E"]].forEach(([dx, c]) => el("ellipse", { cx: x + dx, cy: y - 204, rx: 26, ry: 13, fill: c, ...S6(4) }, L));
  const sm = el("g", {}, L); let t = 0; addTick(dt => { if (!sm.isConnected) return false; t += dt; sm.innerHTML = ""; for (let k = 0; k < 3; k++) { const p = (t * .5 + k / 3) % 1;
      el("path", { d: `M${x - 60 + k * 60} ${y - 230 - p * 160} q-18 -24 0 -48 q18 -24 0 -48`, fill: "none", stroke: "#FFFFFF", "stroke-width": 10, "stroke-linecap": "round", opacity: (1 - p).toFixed(2) }, sm); } }); }
const ROOMS_KW = {
  ちゅうしゃじょう(L) { kwSky(L, "#A3A8B0", 690); kwRiver(L, 600, 690);
    for (let k = 0; k < 6; k++) el("path", { d: `M${80 + k * 280} 1000 L${160 + k * 280} 690`, stroke: "#FFFFFF", "stroke-width": 10 }, L); // ちゅうしゃじょうの せん
    kwCar(L, 860, 790, KW_CUR === "hitori"); },
  かわら(L) { kwSky(L, "#E6DCC8", 720); kwRiver(L, 560, 720); kwPebbles(L, 750, 990, 34);
    if (KW_CUR === "ishi") for (let k = 0; k < 6; k++) { const x = 700 + k * 110, y = 860 + (k % 2) * 60; el("ellipse", { cx: x, cy: y, rx: 46, ry: 20, fill: "#8E9AA8", ...S6(4) }, L); el("path", { d: `M${x - 20} ${y - 8} q14 -6 28 0`, stroke: "#FFFFFF", "stroke-width": 6, fill: "none", "stroke-linecap": "round" }, L); } },
  あさせ(L) { kwSky(L, "#E6DCC8", 560); kwPebbles(L, 575, 640, 12); kwWaterFloor(L, 640); },
  ふかみ(L) { kwSky(L, "#E6DCC8", 520); kwWaterFloor(L, 560);
    // おくの ほうは こい あお（ふかい）。いろの さかいめが はっきり わかるように
    el("path", { d: "M480 560 Q640 720 980 740 Q1300 750 1600 790 V560 Z", fill: "#2E6FA8", ...S6(5) }, L);
    el("path", { d: "M760 560 Q900 660 1160 670 Q1400 680 1600 700 V560 Z", fill: "#1F4F82" }, L);
    if (KW_CUR === "nagare" || KW_CUR === "tomodachi") { const g = el("g", {}, L); let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; g.innerHTML = "";
        for (let k = 0; k < 7; k++) { const x = 1600 - ((t * 420 + k * 230) % 1000), y = 590 + (k % 4) * 34; el("path", { d: `M${x} ${y} q24 -12 48 0 t48 0`, fill: "none", stroke: "#FFFFFF", "stroke-width": 6, "stroke-linecap": "round" }, g); } }); }
    { const x = 1460; el("path", { d: `M${x} 520 V380`, ...S6(8) }, L); el("rect", { x: x - 100, y: 280, width: 200, height: 110, rx: 14, fill: "#FFE27A", ...S6(6) }, L); txt(L, x, 330, "ふかい", 40, { "text-anchor": "middle" }); txt(L, x, 375, "あぶない", 34, { "text-anchor": "middle", fill: "#E8473C" }); } },
  きし(L) { kwSky(L, "#BFE3A6", 700); kwRiver(L, 560, 700); kwParasol(L, 1420, 760); kwMat(L, 980, 800, 320);
    el("rect", { x: 1300, y: 720, width: 90, height: 60, rx: 8, fill: "#FFFFFF", ...S6(5) }, L); el("rect", { x: 1300, y: 720, width: 90, height: 18, rx: 6, fill: "#3E9BD6", ...S6(4) }, L); }, // クーラーボックス
  バーベキュー(L) { kwSky(L, "#BFE3A6", 700); kwRiver(L, 560, 700); kwGrill(L, 900, 800, KW_CUR !== "gomi");
    el("rect", { x: 1330, y: 640, width: 220, height: 20, rx: 6, fill: "#C98A4B", ...S6(5) }, L); el("path", { d: "M1350 660 V760 M1530 660 V760", ...S6(7) }, L); // テーブル
    [1380, 1450].forEach(x => el("ellipse", { cx: x, cy: 634, rx: 30, ry: 9, fill: "#FFFFFF", ...S6(4) }, L)); },
};
{ const dr = drawRoom; drawRoom = function (place, noSign = false) {
    if (curStage !== "kawa" || !ROOMS_KW[place]) return dr(place, noSign);
    sceneLayer.innerHTML = ""; ROOMS_KW[place](sceneLayer);
    if (!noSign) { const g = el("g", {}, sceneLayer); el("rect", { x: 620, y: 24, width: 360, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, place.length > 6 ? 38 : 46, { "text-anchor": "middle" }); } }; }
/* ---------- 場面の 小道具（ことばと 絵を あわせる） ---------- */
function kwRipple(G, x, base = 975) { el("ellipse", { cx: x, cy: base - 8, rx: 120, ry: 22, fill: "#FFFFFF44", stroke: "#FFFFFF", "stroke-width": 5 }, G); }
function kwFish(G, x, y, s = 1, c = "#FFB36B") { const f = el("g", {}, G); el("path", { d: "M-30 0 Q0 -20 30 0 Q0 20 -30 0 Z M28 0 L48 -14 V14 Z", fill: c, ...S6(4) }, f); el("circle", { cx: -14, cy: -3, r: 4, fill: INK }, f);
  let t = Math.random() * 6; addTick(dt => { if (!f.isConnected) return false; t += dt; f.setAttribute("transform", `translate(${(x + Math.sin(t * .9) * 90).toFixed(0)} ${(y + Math.sin(t * 2.3) * 8).toFixed(0)}) scale(${(Math.cos(t * .9) > 0 ? -s : s).toFixed(2)} ${s})`); }); return f; }
function kwBee(G, x, y) { const b0 = el("g", {}, G), b = el("g", {}, b0); el("ellipse", { cx: -10, cy: -26, rx: 18, ry: 12, fill: "#FFFFFF", ...S6(3), opacity: .9 }, b); el("ellipse", { cx: 12, cy: -26, rx: 18, ry: 12, fill: "#FFFFFF", ...S6(3), opacity: .9 }, b);
  el("ellipse", { cx: 0, cy: 0, rx: 34, ry: 22, fill: "#FFD25E", ...S6(4) }, b); el("path", { d: "M-8 -20 V20 M10 -20 V20", stroke: INK, "stroke-width": 8 }, b); el("circle", { cx: -24, cy: -4, r: 4, fill: INK }, b);
  let t = 0; addTick(dt => { if (!b0.isConnected) return false; t += dt; b.setAttribute("transform", `translate(${(x + Math.sin(t * 1.6) * 140).toFixed(0)} ${(y + Math.sin(t * 3.2) * 50).toFixed(0)}) scale(1.6)`); });
  for (let i = 0; i < 4; i++) later(i * 500, () => { if (ctx) blip(220, 240, .35, "sawtooth"); }); return b; }
function kwProp(sc, h, a) {
  const G = el("g", {}, propG), hx = h.x + 200 * h.s, ax = a ? a.x + 200 * a.s : 1200, base = 975, id = sc.id;
  if (["あさせ", "ふかみ"].includes(sc.place)) { [hx, ax, C.pony.x + 200 * C.pony.s].forEach(x => kwRipple(G, x)); }
  if (id === "hiyake") { const b = el("g", { transform: `translate(${ax - 150} ${base - 290}) rotate(-14)` }, G); el("rect", { x: -26, y: -60, width: 52, height: 110, rx: 14, fill: "#FFFFFF", ...S6(4) }, b); el("rect", { x: -14, y: -84, width: 28, height: 26, rx: 6, fill: "#FF8A3D", ...S6(4) }, b); IC.sun(b, 0, 0, 12); }
  else if (id === "boushi") { const t = el("g", { transform: `translate(${hx + 120} ${base - 70})` }, G); el("path", { d: "M-70 0 Q-70 -70 0 -70 Q70 -70 70 0 Z", fill: "#FFE27A", ...S6(5) }, t); el("ellipse", { cx: 0, cy: 0, rx: 100, ry: 18, fill: "#FFE27A", ...S6(5) }, t); el("path", { d: "M-66 -16 H66", stroke: "#E8473C", "stroke-width": 10 }, t);
    const w = el("g", { transform: `translate(${hx + 300} ${base - 70})` }, G); el("rect", { x: -30, y: -110, width: 60, height: 110, rx: 18, fill: "#7FCBF0", ...S6(5) }, w); el("rect", { x: -20, y: -134, width: 40, height: 28, rx: 8, fill: "#3E9BD6", ...S6(4) }, w); el("path", { d: "M-30 -90 Q-60 -150 0 -150 Q60 -150 30 -90", fill: "none", ...S6(4) }, w); }
  else if (id === "tsumetai") { for (let i = 0; i < 4; i++) later(i * 400, () => markAbove(h, "drop", { dx: i % 2 ? 50 : -50 })); }
  else if (id === "sakana") { [[hx + 60, base - 40, .9], [hx + 260, base - 80, .7, "#7FCBF0"], [hx - 220, base - 20, .8, "#FF8FA3"]].forEach(([x, y, s, c]) => kwFish(G, x, y, s, c)); }
  else if (id === "kani") { const x = ax - 200, y = base - 30; el("ellipse", { cx: x + 90, cy: y - 10, rx: 80, ry: 36, fill: "#A8A396", ...S6(5), transform: `rotate(-24 ${x + 90} ${y - 10})` }, G);
    const c = el("g", { transform: `translate(${x - 40} ${y})` }, G); el("ellipse", { cx: 0, cy: 0, rx: 44, ry: 28, fill: "#E8473C", ...S6(4) }, c); [-1, 1].forEach(s => { el("path", { d: `M${s * 30} -14 L${s * 60} -46`, ...S6(5) }, c); el("path", { d: `M${s * 52} -60 L${s * 72} -40 L${s * 56} -34 Z`, fill: "#E8473C", ...S6(4) }, c); for (let k = 0; k < 3; k++) el("path", { d: `M${s * 30} ${4 + k * 8} l${s * 26} ${8 + k * 4}`, ...S6(4) }, c); });
    [-12, 12].forEach(dx => { el("path", { d: `M${dx} -24 V-40`, ...S6(4) }, c); el("circle", { cx: dx, cy: -44, r: 6, fill: INK }, c); }); }
  else if (id === "mizukiri") { const s = el("ellipse", { cx: ax - 110, cy: base - 250, rx: 26, ry: 12, fill: "#A8A396", ...S6(4) }, G);
    for (let k = 0; k < 4; k++) el("path", { d: `M${900 - k * 160} 640 q-70 -${60 - k * 10} -140 0`, fill: "none", stroke: "#FFFFFF", "stroke-width": 6, "stroke-dasharray": "14 12" }, G); }
  else if (id === "nageru") { el("ellipse", { cx: ax - 95, cy: base - 230, rx: 50, ry: 38, fill: "#A8A396", ...S6(5) }, G); // とらおの もつ おおきな いし
    [[1060, "#FF8FA3"], [1180, "#FFD25E"], [1320, "#7BD389"]].forEach(([x, c]) => { el("circle", { cx: x, cy: 610, r: 26, fill: "#FFE0B2", ...S6(4) }, G); el("path", { d: `M${x - 26} 606 Q${x} 570 ${x + 26} 606 Z`, fill: c, ...S6(4) }, G); el("path", { d: `M${x - 50} 636 q25 -10 50 0 t50 0`, fill: "none", stroke: "#FFFFFF", "stroke-width": 5 }, G); }); }
  else if (id === "mizukake") { const g = el("g", {}, G); let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; g.innerHTML = ""; for (let k = 0; k < 6; k++) { const p = (t * .9 + k / 6) % 1, x = ax - 120 - (ax - 120 - hx) * p, y = base - 360 - Math.sin(p * Math.PI) * 140;
      el("path", { d: `M${x} ${y - 16} Q${x + 12} ${y} ${x} ${y + 12} Q${x - 12} ${y} ${x} ${y - 16} Z`, fill: "#9FD6F5", ...S6(3) }, g); } }); }
  else if (id === "ukiwa") { const r = el("g", { transform: `translate(${hx + 70} ${base - 40})` }, G); el("ellipse", { cx: 0, cy: 0, rx: 90, ry: 32, fill: "none", stroke: "#FF6F61", "stroke-width": 26 }, r); el("ellipse", { cx: 0, cy: 0, rx: 90, ry: 32, fill: "none", stroke: INK, "stroke-width": 3 }, r); [-1, 1].forEach(s => el("path", { d: `M${s * 64} -24 L${s * 80} 18`, stroke: "#FFFFFF", "stroke-width": 16 }, r)); }
  else if (id === "sandal") { const s0 = el("g", {}, G), s = el("g", {}, s0); el("path", { d: "M-40 -10 Q-40 -26 -20 -26 H34 Q50 -26 50 -10 Q50 6 34 6 H-20 Q-40 6 -40 -10 Z", fill: "#7FCBF0", ...S6(4) }, s); el("path", { d: "M-6 -24 Q10 -44 26 -24", fill: "none", stroke: "#3E9BD6", "stroke-width": 8 }, s);
    let t = 0; addTick(dt => { if (!s0.isConnected) return false; t += dt; s.setAttribute("transform", `translate(${(hx - 60 - t * 110).toFixed(0)} ${(base - 30 + Math.sin(t * 4) * 6).toFixed(0)}) rotate(${(Math.sin(t * 3) * 10).toFixed(1)}) scale(1.5)`); if (t > 8) return false; }); }
  else if (id === "kuchibiru") { const tw = el("g", { transform: `translate(${ax - 140} ${base - 290})` }, G); el("path", { d: "M-50 -60 H50 V80 H-50 Z", fill: "#FFB36B", ...S6(5) }, tw); for (let k = 0; k < 3; k++) el("path", { d: `M-50 ${-30 + k * 40} H50`, stroke: "#FFFFFF", "stroke-width": 8 }, tw);
    const g = el("g", {}, G); let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; g.innerHTML = ""; const j = Math.sin(t * 40) * 4; [-1, 1].forEach(s => [0, 1].forEach(k => el("path", { d: `M${hx + s * (150 + k * 26) + j} ${base - 420 + k * 30} q${s * 10} 14 0 28 q${-s * 10} 14 0 28`, fill: "none", stroke: "#5B8FD6", "stroke-width": 6, "stroke-linecap": "round" }, g))); }); }
  else if (id === "kega") { el("path", { d: `M${h.x + 90} ${base - 10} L${h.x + 120} ${base - 70} L${h.x + 150} ${base - 10} Z`, fill: "#A8A396", ...S6(4) }, G); later(400, () => markAbove(h, "drop", { dx: 60 })); }
  else if (id === "hachi") { kwBee(G, hx + 40, base - 470); }
  else if (id === "gomi") { const b = el("g", { transform: `translate(${ax - 150} ${base - 20})` }, G); el("path", { d: "M-50 0 Q-60 -90 -30 -110 L-20 -130 H20 L30 -110 Q60 -90 50 0 Z", fill: "#FFFFFF", ...S6(5) }, b); el("path", { d: "M-20 -130 L-30 -150 M20 -130 L30 -150", ...S6(4) }, b);
    [[hx + 40, "#E8473C"], [hx + 170, "#7FCBF0"]].forEach(([x, c]) => el("rect", { x: x - 16, y: base - 40, width: 32, height: 48, rx: 6, fill: c, ...S6(4), transform: `rotate(70 ${x} ${base - 16})` }, G)); el("path", { d: `M${hx + 260} ${base - 20} l40 -14 l10 24 l-36 10 Z`, fill: "#FFFFFF", ...S6(3) }, G); }
  else if (id === "bbq") { const p = el("g", { transform: `translate(${ax - 130} ${base - 290})` }, G); el("ellipse", { cx: 0, cy: 0, rx: 56, ry: 16, fill: "#FFFFFF", ...S6(4) }, p); el("ellipse", { cx: -10, cy: -10, rx: 28, ry: 12, fill: "#B5543A", ...S6(4) }, p); }
  return G; }
/* ---------- 💬 場面 ---------- */
function kwPick(area) { let pool = KW.sc.filter(s => s.area === area); const m = Math.min(...pool.map(s => KW_N.get(s.id) || 0)); pool = pool.filter(s => (KW_N.get(s.id) || 0) === m); return pool[rnd(pool.length)]; }
async function kwScene(pc) {
  const hero = pc.kind, sc = kwPick(nArea(pc.node)), t = tierOf(); KW_N.set(sc.id, (KW_N.get(sc.id) || 0) + 1);
  showEngine(null, `かわあそび（${sc.id}・段${t + 1}）`);
  KW_CUR = sc.id; const { hero: h, ask: a } = setSitView({ id: "kw_" + sc.id, place: sc.place, asker: sc.who, intro: "kw" }, hero);
  const late = sc.id === "tomodachi"; if (!late) a.dx.v = a.dx.t = 0; // ともだちが あぶない：おとなは よばれてから くる
  enter(h); await sleep(900);
  let tora = null; if (late) { tora = xtra("tora", 960, (ASK_AT.tora || [0, .92])[1] * .9); tora.dx.v = tora.dx.t = 0; walk(tora, 260, 4200); }
  if (!KW_N.get("_intro")) { KW_N.set("_intro", 1); await speak(C.pony, "kwp_intro", KW.txt.kwp_intro); }
  kwProp(sc, h, a);
  await speak(C.pony, `kwn_${sc.id}`, sc.n);
  if (["mizukake", "sandal", "kuchibiru", "kega", "hachi", "tomodachi", "fukai", "nagare", "nigori"].includes(sc.id)) { h.sadMouth = true; playMove(h, "think"); }
  if (sc.line) { playMove(a, "nod"); await speak(a, `kww_${sc.id}`, sc.line); }
  let okN = 0, nSay = 0; const log = [];
  const step = async (key, text, keys, tag) => { nSay++; const r = await kmSay(h, key, text, keys, tag); if (r.ok) okN++; log.push(`${r.ok ? "○" : "×"}${r.heard}`); return r.ok; };
  await step(`kws_${sc.id}`, sc.say, sc.keys, "まるシマに なって いおう");
  h.sadMouth = false;
  if (late) { enter(a); await sleep(1000); }
  if (sc.res) { playMove(a, "nod"); await speak(a, `kwr_${sc.id}`, sc.res); }
  if (sc.id === "kega") { const b = el("g", { transform: `translate(${h.x + 150} ${975 - 120}) scale(.4)` }, propG); drawItem(b, "bandage"); }
  const t2 = sc.t2 && t >= 1 ? sc.t2 : null;
  if (t2) { if (t2.line) { playMove(a, "nod"); await speak(a, `kww2_${sc.id}`, t2.line); }
    await step(`kws2_${sc.id}`, t2.say, t2.keys, "つづけて いおう");
    if (t2.res) { joy(a); await speak(a, `kwr2_${sc.id}`, t2.res); } }
  const ok = okN * 2 >= nSay; grade(ok); GS.tasks++;
  playLog({ type: "kawa", id: sc.id, tier: t, okN, nSay, tries: log, ...(MODE === "multi" ? { who: NAMES[hero] } : {}) });
  if (ok) { confetti(36); joy(h); const k = rnd(2) ? "kwp_ok" : "kwp_good"; await speak(C.pony, k, KW.txt[k]); }
  await sleep(400); setView("board"); return ok; }
Object.assign(LTASK_RUN, { ks: kwScene });
/* ---------- 声の パック ---------- */
{ const lp = loadPack; loadPack = async function (id) { const r = await lp(id); if (id !== "kawa") return r;
    if (!PACK.loaded.kawa) { try { const q = await fetch("packs/kawa.json", { cache: "no-cache" }); if (q.ok) { const d = await q.json(); Object.keys(d).forEach(k => AUD[k] = "data:audio/mpeg;base64," + d[k]); PACK.loaded.kawa = Object.keys(d); } } catch (e) { } }
    if (AUD.bgm_kawa) await voiceBuf("bgm_kawa"); return true; }; }
/* ---------- メニューの タイルの 絵 ---------- */
if (typeof A2 !== "undefined") A2.kawa = (L, X) => { PR2.out(L, ...SKY, "#E6DCC8", 236); el("rect", { x: -200, y: 170, width: 880, height: 66, fill: "#7CC4EA" }, L); el("path", { d: "M-200 170 H680 M-200 236 H680", ...S6(5) }, L);
  [[X(-.4), 200], [X(.1), 214], [X(.45), 196]].forEach(([x, y]) => el("path", { d: `M${x} ${y} q16 -8 32 0 t32 0`, fill: "none", stroke: "#FFFFFF", "stroke-width": 5, "stroke-linecap": "round" }, L));
  IC.tree(L, X(.42), 120, .5); CH(L, "shima", X(-.22), .34, HAPPY); CH(L, "pony", X(.06), .3, HI); };
/* ---------- 手がきの アイコン（かわの しかけ） ---------- */
Object.assign(ICON_DRAW, {
  "🏞": g => { IC.R(g, -95, -80, 190, 160, "#CFEAFB", 18); IC.P(g, "M-95 20 L-40 -40 L0 0 L40 -50 L95 10 V30 H-95 Z", "#9BCB8A", 5); IC.P(g, "M-95 40 Q0 20 95 50 V80 H-95 Z", "#7CC4EA", 5); IC.C(g, 55, -50, 14, "#FFD25E", 4); },
  "🪨": g => { IC.E(g, -40, 40, 50, 26, "#B9B4AA", 6); IC.E(g, 45, 10, 44, 22, "#B9B4AA", 6); IC.E(g, 0, -45, 38, 20, "#B9B4AA", 6); IC.P(g, "M-90 85 q30 -14 60 0 t60 0 t60 0", "none", 5); },
  "🛟": g => { IC.C(g, 0, 0, 80, "#FF6F61", 7); IC.C(g, 0, 0, 36, "#BFE3F2", 6); [0, 1, 2, 3].forEach(i => { const a = i * Math.PI / 2 + Math.PI / 4; IC.P(g, `M${Math.cos(a) * 40} ${Math.sin(a) * 40} L${Math.cos(a) * 78} ${Math.sin(a) * 78}`, "none", 0); el("path", { d: `M${Math.cos(a) * 42} ${Math.sin(a) * 42} L${Math.cos(a) * 76} ${Math.sin(a) * 76}`, stroke: "#FFFFFF", "stroke-width": 18 }, g); }); },
  "🍉": g => { IC.P(g, "M-95 -20 A95 95 0 0 0 95 -20 Z", "#7BD389", 7); IC.P(g, "M-78 -20 A78 78 0 0 0 78 -20 Z", "#FF6F61", 0); [[-40, 10], [0, 30], [40, 10], [-15, 0], [20, 52]].forEach(([x, y]) => IC.E(g, x, y, 6, 10, INK, 0)); },
  "🍖": g => { IC.P(g, "M-60 40 Q-90 -10 -40 -60 Q20 -100 60 -40 Q80 0 30 40 Z", "#B5543A", 7); IC.R(g, 20, 30, 60, 22, "#FFF6E0", 10, 5); IC.C(g, 86, 30, 16, "#FFF6E0", 5); IC.C(g, 86, 56, 16, "#FFF6E0", 5); },
});
