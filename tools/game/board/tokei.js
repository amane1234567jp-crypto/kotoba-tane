/* ================= ステージ「とけい」（2026-10-17）：課題は「とけいの よみかた」だけ =================
   盤は とけいの かたち（あさ → ひる → ゆうがた → よる）。マスに とまると おおきな アナログとけいが 出て、ぽにーが「いま なんじ？」。
   むずかしさ（E.L）：1-2 ちょうど／3-4 さんじゅっぷん も／5-6 5ふんきざみ（そとに 分の 数字）／7-8 1ふんきざみ／9-10 1ふんきざみで 数字なし。
   こたえは いつも「〇じ〇ふん」（「はん」「〇ふんまえ」は つかわない。「はん」と いっても せいかい）。
   レベル3から ときどき「ねる じかんは なんじ？」のように、くらしの じかんを きく。
   ライバル（がお）も よむ。ときどき よみまちがえるので、ただしい じかんを おしえて あげる。 */
const TK = "tokei";
RIVAL_OF[TK] = "gao";
const TK_H = { 1: ["いちじ", "1時", "一時", "1じ", "１時"], 2: ["にじ", "2時", "二時", "2じ", "２時"], 3: ["さんじ", "3時", "三時", "3じ", "３時"], 4: ["よじ", "よんじ", "4時", "四時", "4じ", "４時"],
  5: ["ごじ", "5時", "五時", "5じ", "５時"], 6: ["ろくじ", "6時", "六時", "6じ", "６時"], 7: ["しちじ", "ななじ", "7時", "七時", "7じ", "７時"], 8: ["はちじ", "8時", "八時", "8じ", "８時"],
  9: ["くじ", "きゅうじ", "9時", "九時", "9じ", "９時"], 10: ["じゅうじ", "10時", "十時", "10じ", "１０時"], 11: ["じゅういちじ", "11時", "十一時", "11じ", "１１時"], 12: ["じゅうにじ", "12時", "十二時", "12じ", "１２時"] };
const TK_HY = { 1: "いちじ", 2: "にじ", 3: "さんじ", 4: "よじ", 5: "ごじ", 6: "ろくじ", 7: "しちじ", 8: "はちじ", 9: "くじ", 10: "じゅうじ", 11: "じゅういちじ", 12: "じゅうにじ" };
const TK_M1 = { 1: ["いっぷん"], 2: ["にふん"], 3: ["さんぷん"], 4: ["よんぷん"], 5: ["ごふん"], 6: ["ろっぷん"], 7: ["ななふん", "しちふん"], 8: ["はっぷん", "はちふん"], 9: ["きゅうふん"], 10: ["じゅっぷん", "じっぷん"] };
const TK_TEN = { 1: "じゅう", 2: "にじゅう", 3: "さんじゅう", 4: "よんじゅう", 5: "ごじゅう" };
const KANJI = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const kanjiNum = n => n < 10 ? KANJI[n] : (n < 20 ? "十" : KANJI[Math.floor(n / 10)] + "十") + KANJI[n % 10];
function tkMinRead(m) { // よみ（ひらがな）の くみあわせ
  if (m % 10 === 0) { const pre = TK_TEN[m / 10].replace(/じゅう$/, ""); return TK_M1[10].map(x => pre + x); }
  const t = m >= 10 ? TK_TEN[Math.floor(m / 10)] : ""; return TK_M1[m % 10].map(x => t + x);
}
const tkMinKeys = m => [...tkMinRead(m), `${m}分`, `${kanjiNum(m)}分`, `${m}ふん`, `${m}ぷん`, ...(m === 30 ? ["はん", "半"] : [])];
const tkMinText = m => tkMinRead(m)[0];
const TK_MAE = { 5: ["ごふんまえ", "5分前", "五分前", "ごふん まえ"], 10: ["じゅっぷんまえ", "じっぷんまえ", "10分前", "十分前", "じゅっぷん まえ"] };
/* くらしの じかん：盤の ばしょ（あさ・ひる・ゆうがた・よる）に あう しつもん */
const TK_LIFE = {
  あさ: [["okiru", "おきる じかんは なんじ？", [[6, 30], [7, 0], [6, 45], [7, 10]]], ["gakkou", "がっこうに いく じかんは なんじ？", [[7, 30], [8, 0], [7, 45], [8, 10]]]],
  ひる: [["kyushoku", "きゅうしょくの じかんは なんじ？", [[12, 0], [12, 30], [12, 15], [12, 20]]], ["oyatsu", "おやつの じかんは なんじ？", [[3, 0]]]],
  ゆうがた: [["gohan", "ばんごはんの じかんは なんじ？", [[6, 0], [6, 30], [6, 45], [7, 0]]], ["ofuro", "おふろの じかんは なんじ？", [[7, 0], [7, 30], [7, 45], [7, 20]]]],
  よる: [["neru", "ねる じかんは なんじ？", [[8, 0], [8, 30], [9, 0], [8, 45]]], ["hamigaki", "はみがきの じかんは なんじ？", [[8, 0], [8, 30], [7, 50], [8, 15]]]],
};
const TK_HOURS = { あさ: [6, 7, 8, 9, 10, 11], ひる: [12, 1, 2, 3], ゆうがた: [4, 5, 6, 7], よる: [7, 8, 9, 10, 11, 12] };
const tkLv = () => E.L <= 2 ? 1 : E.L <= 4 ? 2 : E.L <= 6 ? 3 : E.L <= 8 ? 4 : 5;
const tkReadable = (m, lv) => lv === 1 ? m === 0 : lv === 2 ? m % 30 === 0 : lv === 3 ? m % 5 === 0 : true;
/* もんだいを つくる：{h, m, mae, text, keys, parts, qkey, qtext} */
function tkPick(place, lv, canLife = true) {
  const hs = TK_HOURS[place] || TK_HOURS.あさ;
  let life = null;
  if (canLife && lv >= 2 && TK_LIFE[place] && rnd(3) === 0) { const ev = TK_LIFE[place][rnd(TK_LIFE[place].length)]; const ts = ev[2].filter(([, m]) => tkReadable(m, Math.min(lv, 4))); if (ts.length) { const [h, m] = ts[rnd(ts.length)]; life = { id: ev[0], q: ev[1], h, m }; } }
  let h, m, mae = 0;
  if (life) { h = life.h; m = life.m; }
  else { h = hs[rnd(hs.length)];
    if (lv === 1) m = 0; else if (lv === 2) m = rnd(2) ? 30 : 0; else if (lv === 3) m = rnd(12) * 5; else if (lv === 4) m = rnd(60);
    else m = rnd(60); }
  const H = mae ? (h % 12) + 1 : h;
  const keys = [TK_H[H]], parts = [[`tk_h_${H}`, TK_HY[H]]]; let text = TK_HY[H];
  if (mae) { keys.push(TK_MAE[mae]); parts.push([`tk_mae_${mae}`, TK_MAE[mae][0]]); text += " " + TK_MAE[mae][0]; }
  else if (m) { keys.push(tkMinKeys(m)); parts.push([`tk_m_${m}`, tkMinText(m)]); text += " " + tkMinText(m); }
  return { h, m, mae, text, keys, parts, life };
}
/* まちがえた よみ（ライバル用）：じを 1つ ずらす／はんを わすれる／ふんを ずらす */
function tkWrong(q) {
  const lv = tkLv(); let h = q.h, m = q.m, mae = q.mae;
  const r = rnd(3);
  if (r === 0) h = (q.h % 12) + 1;
  else if (r === 1 && q.m) m = q.m === 30 ? 0 : (q.m + 5) % 60 || 5;
  else if (q.m === 0) m = 30; else h = q.h === 1 ? 12 : q.h - 1;
  const H = mae ? (h % 12) + 1 : h; const parts = [[`tk_h_${H}`, TK_HY[H]]]; let text = TK_HY[H];
  if (m) { parts.push([`tk_m_${m}`, tkMinText(m)]); text += " " + tkMinText(m); }
  return { text, parts };
}
async function tkSay(c, parts, pre = "") { for (let i = 0; i < parts.length; i++) { const [k, t] = parts[i]; await speak(c, pre + k, t); } }

/* ---------- とけいの 絵 ---------- */
function drawClock(L, cx, cy, r, opts = {}) {
  const g = el("g", { transform: `translate(${cx} ${cy})` }, L);
  el("circle", { r: r + 26, fill: opts.rim || "#FFD25E", ...S6(8) }, g); el("circle", { r, fill: "#FFFFFF", ...S6(6) }, g);
  for (let i = 0; i < 60; i++) { const a = i * Math.PI / 30, big = i % 5 === 0, r0 = r - (big ? 34 : 18); el("path", { d: `M${(r0 * Math.sin(a)).toFixed(1)} ${(-r0 * Math.cos(a)).toFixed(1)} L${((r - 8) * Math.sin(a)).toFixed(1)} ${(-(r - 8) * Math.cos(a)).toFixed(1)}`, stroke: INK, "stroke-width": big ? 7 : 3, "stroke-linecap": "round" }, g); }
  for (let i = 1; i <= 12; i++) { const a = i * Math.PI / 6, rr = r - 72; txt(g, rr * Math.sin(a), -rr * Math.cos(a) + r * .085, String(i), r * .2, { "text-anchor": "middle" }); }
  if (opts.minNums) for (let i = 1; i <= 12; i++) { const a = i * Math.PI / 6, rr = r + 62; txt(g, rr * Math.sin(a), -rr * Math.cos(a) + 12, String(i * 5), 34, { "text-anchor": "middle", fill: "#7A6A8A" }); }
  const hour = el("g", {}, g); el("path", { d: `M0 26 L0 ${-r * .52}`, stroke: INK, "stroke-width": 22, "stroke-linecap": "round" }, hour); el("path", { d: `M0 26 L0 ${-r * .52}`, stroke: "#5B8DEF", "stroke-width": 12, "stroke-linecap": "round" }, hour);
  const minute = el("g", {}, g); el("path", { d: `M0 30 L0 ${-r * .8}`, stroke: INK, "stroke-width": 18, "stroke-linecap": "round" }, minute); el("path", { d: `M0 30 L0 ${-r * .8}`, stroke: "#E8473C", "stroke-width": 9, "stroke-linecap": "round" }, minute);
  el("circle", { r: 16, fill: INK }, g); el("circle", { r: 7, fill: "#FFFFFF" }, g);
  const set = (h, m) => { hour.setAttribute("transform", `rotate(${(((h % 12) + m / 60) * 30).toFixed(2)})`); minute.setAttribute("transform", `rotate(${(m * 6).toFixed(2)})`); };
  set(12, 0); return { g, set, hour, minute };
}
const TK_SKY = { あさ: ["#CFEAFB", "#FFF6E0"], ひる: ["#BDE3F2", "#FFFBE6"], ゆうがた: ["#FFD9A8", "#FFE9D6"], よる: ["#2E3C6E", "#4A5A8E"] };
function tkRoom(place) {
  sceneLayer.innerHTML = ""; const L = sceneLayer, [sky, wall] = TK_SKY[place] || TK_SKY.あさ;
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: wall }, L); el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#E3C59A" }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L);
  el("rect", { x: 120, y: 120, width: 300, height: 220, rx: 10, fill: sky, ...S6(6) }, L); el("path", { d: "M270 120 V340 M120 230 H420", ...S6(5) }, L);
  if (place === "よる") { el("circle", { cx: 350, cy: 180, r: 30, fill: "#FFE27A" }, L); [[160, 160], [210, 300], [380, 290]].forEach(([x, y]) => el("circle", { cx: x, cy: y, r: 4, fill: "#FFF6C8" }, L)); }
  else { el("circle", { cx: place === "ゆうがた" ? 200 : 350, cy: place === "ゆうがた" ? 300 : 170, r: 34, fill: place === "ゆうがた" ? "#FF8A5B" : "#FFE27A", ...S6(4) }, L); cloud(L, 180, 230, .6); }
  const g = el("g", {}, L); el("rect", { x: 620, y: 24, width: 360, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, 46, { "text-anchor": "middle" });
  return L;
}
function tkView(heroKind, zone) {
  clearMarks(); view = "scene"; chars.forEach(c => c.root.style.display = "none"); visible.length = 0; unsay(); showEar(null, false); hideTask();
  boardLayer.style.display = "none"; sceneLayer.style.display = ""; hud.style.display = "none"; diceBtn.style.visibility = "hidden";
  const hero = C[heroKind]; [C.pony, hero].forEach(resetChar);
  place(C.pony, 150, 975, .5); show(C.pony); place(hero, 520, 975, { chu: .42, doshin: 1.15, gao: .9 }[heroKind] || .88); show(hero); hero.dx.v = hero.dx.t = 0;
  tkRoom(zone); propG = el("g", {}, sceneLayer); return hero;
}
async function tkShowClock(q, lv) {
  const ck = drawClock(propG, 1140, 545, 215, { minNums: lv === 3 || lv === 4 }); // レベル5は そとの 数字なし
  const h0 = 12, m0 = 0, H = q.h, M = q.m; // 12じから はりが まわって とまる
  blip(900, 1400, .15, "sine");
  await tween(1300, k => { const e = 1 - Math.pow(1 - k, 3); ck.set(h0 + ((H - h0 + 12) % 12 || (M ? 0 : 12)) * e, (m0 + M * e) % 60); });
  ck.set(H, M); chime(); return ck;
}
const tkFlash = ck => { for (let i = 0; i < 10; i++) later(i * 60, () => mark("sparkle", 1140 + Math.cos(i * .63) * 250, 545 + Math.sin(i * .63) * 250, { vy: -120, life: .7, s: .7 })); ck.g.firstChild.setAttribute("fill", "#FFF1A8"); };

/* ---------- こどもの ばん ---------- */
async function runTokei(pc) {
  const place = zoneOf(pc.node), lv = tkLv(), q = tkPick(place, lv), h = tkView(pc.kind, place);
  showEngine({ no: "tokei", main: q.text }, `とけい レベル${lv}${q.life ? "（くらしの じかん）" : ""}`);
  await sleep(500); const ck = await tkShowClock(q, lv); await sleep(300);
  if (q.life) await speak(C.pony, `tk_q_${q.life.id}`, q.life.q); else await speak(C.pony, "tk_ask", "いま なんじ？");
  showTask(q.text, "とけいを よもう");
  let hh = E.h, ok = false, n = 0; const tries = [], L0 = E.L, t0 = performance.now();
  for (; n < 3; n++) {
    if (hh < 3 && n !== 1) await tkSay(C.pony, q.parts); else if (n !== 1) { playMove(h, "think"); await sleep(700); }
    unsay();
    setListen(h, true); const r = await listen(q.keys, 8000); setListen(h, false);
    tries.push(`${r.r === "ok" ? "○" : r.r === "part" ? "△" : "×"}${r.heard || ""}`);
    if (r.r === "ok") { ok = true; break; }
    if (r.r === "part") { playMove(h, "think"); await speak(C.pony, "p_close", "おしい！"); } else { playMove(h, "think"); await sleep(600); }
    if (n < 2) { hh = 1; await speak(C.pony, "p_again", "もう いっかい いってみよう"); }
  }
  playLog({ type: "tokei", id: `${q.h}:${String(q.m).padStart(2, "0")}${q.life ? "/" + q.life.id : ""}`, tier: lv, L: L0, ok, answer: q.text, tries, sec: Math.round((performance.now() - t0) / 1000), ...(MODE === "multi" ? { who: NAMES[pc.kind] } : {}) });
  grade(ok && n === 0); GS.tasks++; if (ok) GS.ok++;
  if (!ok) { await speak(C.pony, "p_together", "いっしょに いおうね"); await tkSay(C.pony, q.parts); playMove(h, "nod"); await sleep(600); }
  hideTask();
  if (ok) { tkFlash(ck); joy(h); confetti(50); await speak(C.pony, "tk_ok", "せいかい！ よく よめたね！"); await seedGet(h); }
  showEngine(null, ok ? (n === 0 ? "1回目で言えた" : `${n + 1}回目で言えた`) : "3回とも言えなかった");
  await sleep(500); setView("board"); return ok;
}
/* ---------- がおの ばん：よむ。ときどき まちがえる ---------- */
async function tokeiRival(before) {
  const place = zoneOf(P.gao.node), lv = tkLv(), q = tkPick(place, lv, false), h = tkView(RIVAL, place);
  const mistake = E.L >= 2 && Math.random() < .35;
  showEngine({ no: "tokei", main: q.text }, `${NAMES[RIVAL]}の とけい${mistake ? "（まちがえる回）" : ""}`);
  await sleep(500); const ck = await tkShowClock(q, lv); await sleep(300);
  await speak(C.pony, "tk_ask_r", "がお、いま なんじ？"); playMove(h, "think"); await sleep(700);
  if (!mistake) { showTask(q.text, `${NAMES[RIVAL]}の こたえ`); await tkSay(h, q.parts, "g"); unsay(); hideTask(); tkFlash(ck); playMove(C.pony, "clap"); joy(h); await speak(C.pony, "tk_ok_r", "せいかい！"); await sleep(400); setView("board"); return; }
  const w = tkWrong(q); await tkSay(h, w.parts, "g"); surprise(C.pony); markAbove(C.pony, "q"); await sleep(500);
  showTask(q.text, `${NAMES[RIVAL]}に おしえよう`); await speak(C.pony, "teach", `${NAMES[RIVAL]}に おしえて あげよう`);
  playMove(h, "think"); await rivalSay(h, "huh");
  let ok = false; const ttries = [];
  for (let n = 0; n < 2 && !ok; n++) {
    await tkSay(C.pony, q.parts); unsay();
    setListen(C.shima, true); const r = await listen(q.keys, 8000); setListen(C.shima, false);
    ttries.push(`${r.r === "ok" ? "○" : r.r === "part" ? "△" : "×"}${r.heard || ""}`);
    ok = r.r === "ok"; if (ok) GS.ok++; if (!ok && n === 0) await speak(C.pony, "p_again", "もう いっかい いってみよう");
  }
  playLog({ type: "teach", id: "tokei", ok, tries: ttries });
  if (ok) { confetti(50); chime(); markAbove(h, "ex"); await rivalSay(h, "thanks"); } else { await speak(C.pony, "p_together", "いっしょに いおうね"); await tkSay(C.pony, q.parts); }
  await tkSay(h, q.parts, "g"); unsay(); hideTask(); tkFlash(ck); joy(h); await sleep(600); setView("board");
  if (ok) { markAbove(P.gao, "drop"); P.gao.node = before; const [x, y] = nodeXY(P.gao, before); await slide(P.gao, x, y, .5, .3); }
}
{ const lc = landChild; landChild = async function (pc = P.shima) { if (curStage !== TK) return lc(pc); const id = pc.node; if (winner) return; const k = kindOf(id); if (k === "start") return; const ok = await runTokei(pc); if (ok && pc.player) pc.player.ok++; }; }
{ const gs = gaoSit; gaoSit = async function (before) { if (curStage !== TK) return gs(before); return tokeiRival(before); }; }

/* ---------- 盤：とけいの かたち ---------- */
STAGE_DEF[TK] = { ground: "#FFF6E0", sky: "#CFEAFB", names: ["あさ", "あさ", "ひる", "ひる", "ゆうがた", "ゆうがた", "よる", "よる", "あさ"], fills: { あさ: "#D7ECFF", ひる: "#FFF3B8", ゆうがた: "#FFD9B8", よる: "#D9D2F0" } };
{ const n = {}, pl = {}, nx = {}; const D = k => -90 + k * 24, R = (a, b) => arcPts(800, 540, 560, 400, [...Array(b - a)].map((_, i) => D(a + i)));
  chain(["0", "1", "2", "3", "4", "f1"], R(0, 6), "あさ", n, pl); pl["3"] = pl["4"] = pl.f1 = "ひる";
  chain(["a1", "a2", "a3", "a4"], R(6, 10), "ゆうがた", n, pl);
  chain(["b1", "b2"], [[980, 756], [677, 775]], "ゆうがた", n, pl);
  chain(["m1", "m2", "f2"], R(10, 13), "よる", n, pl);
  chain(["c1", "c2"], R(13, 15), "よる", n, pl); pl.c2 = "あさ";
  chain(["d1"], [[500, 480]], "よる", n, pl);
  n["15"] = [800, 540, "goal"]; pl["15"] = "あさ"; n["0"].push("start"); n["4"].push("block");
  linkLine(nx, ["0", "1", "2", "3", "4", "f1", "a1", "a2", "a3", "a4", "m1", "m2", "f2", "c1", "c2", "15"]); linkLine(nx, ["f1", "b1", "b2", "m1"]); linkLine(nx, ["f2", "d1", "15"]);
  BOARD[TK] = { nodes: n, place: pl, next: nx, away: [1300, 200], style: (a, b) => ["b1", "b2", "d1"].includes(a) || ["b1", "d1"].includes(b) ? "hall" : "classwood",
    labels: [["あさ", 1000, 100], ["ひる", 1500, 540], ["ゆうがた", 800, 990], ["よる", 120, 540]] }; }
BOARD_BG[TK] = L => { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFF6E0" }, L);
  el("ellipse", { cx: 800, cy: 540, rx: 690, ry: 490, fill: "#FFD25E", ...S6(6) }, L); el("ellipse", { cx: 800, cy: 540, rx: 640, ry: 450, fill: "#FFFFFF", ...S6(5) }, L);
  for (let i = 1; i <= 12; i++) { const a = i * Math.PI / 6; txt(L, 800 + 450 * Math.sin(a), 540 - 300 * Math.cos(a) + 16, String(i), 44, { "text-anchor": "middle", fill: "#B9A8D9" }); }
  el("rect", { x: 620, y: 420, width: 360, height: 110, rx: 14, fill: "#FFFFFF", ...S6(6) }, L); txt(L, 800, 492, "とけい", 52, { "text-anchor": "middle" }); };
BLOCK_DEF[TK] = { who: "nobbo", sleep: false, intro: ["p_blk_tokei", "のっぽせんせいが とけいを なおして いるよ"], say: ["blk_tokei", "せんせい、とおして ください"], to: "のっぽせんせいに いおう",
  keys: [["とおして", "通して"]], res: ["rs_tokei", "はい、どうぞ。とけいは なおりましたよ"] };
SLEEPER_OF[TK] = "nobbo";
EVENTS[TK] = { a2: ["fwd", 2, "ev_tokeif", "じかんどおりに できた！ 2マス すすむよ"], m2: ["back", 2, "ev_tokeib", "ねぼうした！ 2マス もどるよ"], d1: ["home", 0, "ev_tokeih", "とけいが とまってた！ スタートに もどるよ"] };
