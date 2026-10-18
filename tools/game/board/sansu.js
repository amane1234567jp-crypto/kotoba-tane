/* ================= ステージ「さんすう」（2026-10-17）：こたえの カードを タッチ（こえでも OK） =================
   データは board/sansu_data.js（sit/sansu_gen.py）。
   むずかしさ：lv1 かぞえる／lv2 たしざん（10まで。えつき→しきだけ）／lv3 ひきざん（10まで）／lv4 くりあがり・くりさがり（20まで）
             lv5 ぶんしょうだい／lv6 ぶんしょうだい（すこし むずかしい）。lv5〜6 は 3かいに 1かい けいさんも まぜる。
   ライバル（ちゅう）も とく。ときどき まちがえるので、ただしい カードを タッチして おしえて あげる。 */
const SN = "sansu";
RIVAL_OF[SN] = "chu";
const snLv = () => E.L <= 1 ? 1 : E.L <= 3 ? 2 : E.L <= 5 ? 3 : E.L <= 6 ? 4 : E.L <= 8 ? 5 : 6;
const SN_KANJI = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十"];
const SN_ZEN = n => String(n).replace(/[0-9]/g, d => "０１２３４５６７８９"[d]);
function snKeys(n, c) { const k = [String(n), SN_ZEN(n), SN_KANJI[n] + (c ? "" : ""), ...(c ? [SANSU.ans[c][n], `${n}${c}`, SN_KANJI[n] + c] : [])];
  const r = SANSU.num[n]; if (r && r.length >= 2) k.push(r); return [k.filter(Boolean)]; }
const snLabel = (n, c) => c ? `${n}${c}` : String(n);
/* ---------- もんだいを つくる ---------- */
function snMake(lv) {
  const IT = Object.keys(SANSU.items), it = IT[rnd(IT.length)], [emo, , c] = SANSU.items[it];
  if (lv >= 5 && rnd(3)) { const ws = SANSU.words.filter(w => w.lv === lv && !/_line_/.test(w.key)); /* ならびの もんだい（なんばんめ・ぜんぶで なんにん）は ださない 2026-10-18 */ const w = ws[rnd(ws.length)]; return { type: "word", w, x: w.x, c: w.c }; }
  if (lv >= 5) lv = 4;
  if (lv === 1) { const n = 2 + rnd(9); return { type: "count", it, emo, c, n, x: n }; }
  if (lv === 2) { const a = 1 + rnd(8), b = 1 + rnd(10 - a); return { type: "add", it, emo, c, a, b, x: a + b, pic: E.L <= 2 || rnd(2) }; }
  if (lv === 3) { const a = 3 + rnd(8), b = 1 + rnd(a - 1); return { type: "sub", it, emo, c, a, b, x: a - b, pic: E.L <= 4 && rnd(2) }; }
  if (rnd(2)) { const a = 2 + rnd(8), b = (11 - a) + rnd(a - 1); return { type: "add", it, emo, c, a, b, x: a + b, pic: false }; } // くりあがり（11〜18）
  const a = 11 + rnd(8), b = (a - 9) + rnd(9 - (a - 9) + 1); return { type: "sub", it, emo, c, a, b: Math.min(9, Math.max(a - 9, b)), x: a - Math.min(9, Math.max(a - 9, b)), pic: false }; // くりさがり
}
function snChoices(q) { const x = q.x, s = new Set([x]); const cand = shuffle([x + 1, x - 1, x + 2, x - 2, q.type === "add" ? Math.abs(q.a - q.b) : q.type === "sub" ? q.a + q.b : x + 3, x + 10 > 20 ? x - 3 : x + 10]);
  for (const v of cand) { if (s.size >= 4) break; if (v >= 1 && v <= 20) s.add(v); } let k = 3; while (s.size < 4) { if (x + k <= 20) s.add(x + k); k++; } return shuffle([...s]); }
/* ---------- がめん ---------- */
function snView(heroKind) {
  clearMarks(); view = "scene"; chars.forEach(c => c.root.style.display = "none"); visible.length = 0; unsay(); showEar(null, false); hideTask();
  boardLayer.style.display = "none"; sceneLayer.style.display = ""; hud.style.display = "none"; diceBtn.style.visibility = "hidden";
  sceneLayer.innerHTML = ""; const L = sceneLayer;
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFF6E0" }, L); el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#E3C59A" }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L);
  el("rect", { x: 40, y: 30, width: 1520, height: 500, rx: 14, fill: "#2F6B4F", ...S6(8) }, L); el("rect", { x: 40, y: 530, width: 1520, height: 18, fill: "#B9824A", ...S6(5) }, L);
  const hero = C[heroKind]; [C.pony, hero].forEach(resetChar);
  place(C.pony, 110, 975, .4); show(C.pony); place(hero, 330, 975, { chu: .38, doshin: 1.0, gao: .8 }[heroKind] || .76); show(hero); hero.dx.v = hero.dx.t = 0;
  propG = el("g", {}, sceneLayer); return hero;
}
function snRow(g, emo, n, x0, y, size, opt = {}) { const out = []; const per = opt.per || 10, gap = size * 1.05;
  for (let i = 0; i < n; i++) { const t = txt(g, x0 + (i % per) * gap, y + Math.floor(i / per) * gap, emo, size, { "text-anchor": "middle" }); out.push(t); } return out; }
async function snDraw(q) {
  const g = el("g", {}, propG), W = "#FFFFFF";
  if (q.type === "word") { const w = q.w; w.lines.forEach((l, i) => txt(g, 80, 115 + i * 84, l, 64, { fill: W }));
    const pg = el("g", {}, g); const sz = 70, X0 = 1150, perRow = 5; let row = 0;
    if (w.pic.length && w.pic[0][0] === "line") { const [, n, p] = w.pic[0]; const ts = snRow(pg, "🧒", n, X0, 110, sz * .9, { per: 6 }); ts.forEach((t, i) => { if (i === p - 1) t.textContent = "🐰"; }); txt(pg, X0 - 40, 120, "まえ", 30, { fill: W, "text-anchor": "end" }); }
    else for (const [e, n, st, gone] of w.pic) { const ts = snRow(pg, e, n, X0, 110 + row * sz * 1.08, sz, { per: perRow }); row += Math.ceil(n / perRow) + .25;
        if (st === "in") ts.forEach(t => t.setAttribute("opacity", 0)); if (gone) ts.slice(n - gone).forEach(t => t.__gone = 1); pg.__rows = (pg.__rows || []).concat([[ts, st, gone]]); }
    if (row > 6) pg.setAttribute("transform", `translate(${X0 * (1 - 6 / row)} 30) scale(${(6 / row).toFixed(2)})`);
    g.__pic = pg; return g; }
  if (q.type === "count") { snRow(g, q.emo, q.n, 220, q.n > 5 ? 220 : 300, 150, { per: 5 }).forEach((t, i) => t.setAttribute("x", 260 + (i % 5) * 230)); return g; }
  const sym = q.type === "add" ? "＋" : "−";
  if (q.pic) { txt(g, 800, 130, `${q.a} ${sym} ${q.b} ＝ ？`, 100, { fill: W, "text-anchor": "middle" });
    const sz = (q.type === "add" ? q.a + q.b : q.a) > 8 ? 100 : 130;
    if (q.type === "add") { const a = snRow(g, q.emo, q.a, 130, 330, sz, { per: 10 }); const b = snRow(g, q.emo, q.b, 130 + q.a * sz * 1.05 + 70, 330, sz, { per: 10 }); b.forEach(t => t.setAttribute("opacity", 0)); g.__in = b; }
    else { const a = snRow(g, q.emo, q.a, 130, 330, sz, { per: 14 }); g.__out = a.slice(q.a - q.b); } }
  else txt(g, 800, 330, `${q.a} ${sym} ${q.b} ＝ ？`, 180, { fill: W, "text-anchor": "middle" });
  return g;
}
async function snAnimate(g, q) { // えの うごき：くる・いなくなる
  if (g.__in) { for (const t of g.__in) { pop(900); await tween(220, k => t.setAttribute("opacity", k.toFixed(2))); } }
  if (g.__out) { await sleep(300); for (const t of g.__out) { noise(.08, 1500, .3); const x = +t.getAttribute("x"), y = +t.getAttribute("y"); await tween(260, k => { t.setAttribute("opacity", (1 - k * .8).toFixed(2)); }); const s = txt(g, x, y + 10, "✕", 110, { "text-anchor": "middle", fill: "#FF6F91" }); } }
  const pg = g.__pic; if (pg && pg.__rows) for (const [ts, st, gone] of pg.__rows) { if (st === "in") for (const t of ts) { pop(900); await tween(200, k => t.setAttribute("opacity", k.toFixed(2))); }
    if (gone) for (const t of ts.filter(t => t.__gone)) { const x = +t.getAttribute("x"), y = +t.getAttribute("y"); t.setAttribute("opacity", .25); txt(pg, x, y + 6, "✕", 70, { "text-anchor": "middle", fill: "#FF6F91" }); noise(.06, 1500, .25); await sleep(140); } }
}
async function snAsk(q) {
  if (q.type === "word") return speak(C.pony, q.w.key, q.w.say);
  if (q.type === "count") return speak(C.pony, `sn_q_count_${q.it}`, `${SANSU.items[q.it][1]}は ${SANSU.nan[q.c]}？`);
  if (q.pic) return speak(C.pony, `sn_q_${q.type}_${q.it}`, `${SANSU.items[q.it][1]}は、${q.type === "add" ? "あわせて" : "のこり"} ${SANSU.nan[q.c]}？`);
  await speak(C.pony, `sn_n_${q.a}`, SANSU.num[q.a]); await speak(C.pony, q.type === "add" ? "sn_plus" : "sn_minus", q.type === "add" ? "たす" : "ひく"); await speak(C.pony, `sn_n_${q.b}`, SANSU.num[q.b]); await speak(C.pony, "sn_wa", "は？");
}
const snUnit = q => q.type === "word" || q.type === "count" || q.pic ? q.c : "";
const snSayAns = (c, q, pre = "") => { const u = snUnit(q); return u ? speak(c, `${pre}sn_a_${u}_${q.x}`, SANSU.ans[u][q.x]) : speak(c, `${pre}sn_n_${q.x}`, SANSU.num[q.x]); };
function snCards(q, opts) { const g = el("g", {}, front()), u = snUnit(q), W = 210, H = 160, x0 = 640, gap = 22;
  return { g, cs: opts.map((v, i) => { const c = card(g, x0 + i * (W + gap), 575, W, H, snLabel(v, u), null, { fs: 84 }); c.v = v; return c; }) }; }
const snCancel = () => { const b = devB.none; if (b && b.onclick) b.onclick(); };
/* こたえを まつ：タッチ か こえ（ただしい かずを いえたら）。まちがえた カードは うすく する */
function snWait(q, cards, onWrong) { return new Promise(res => { let fin = false, live = true;
  const done = (v, how) => { if (fin) return; fin = true; live = false; cards.cs.forEach(c => c.onclick = null); snCancel(); res({ v, how }); };
  cards.cs.forEach(c => c.onclick = () => { if (fin || c.dim) return; if (c.v === q.x) done(c.v, "tap"); else { c.dim = 1; c.setAttribute("opacity", .35); noise(.1, 700, .35); onWrong && onWrong(c.v); } });
  (async () => { while (live) { const r = await listen(snKeys(q.x, snUnit(q)), 9000); if (r.r === "ok") { done(q.x, "voice"); return; } if (!live) return; await sleep(200); } })(); }); }

/* ---------- こどもの ばん ---------- */
async function runSansu(pc) {
  const lv = snLv(), q = snMake(lv), h = snView(pc.kind);
  showEngine({ no: "sansu", main: q.type === "word" ? q.w.key : `${q.type} ${q.x}` }, `さんすう レベル${lv}`);
  const g = await snDraw(q); await sleep(400); await snAnimate(g, q); await snAsk(q);
  const cards = snCards(q, snChoices(q)); let wrong = 0; const t0 = performance.now(), L0 = E.L;
  await speak(C.pony, "sn_touch", "こたえの カードを タッチしてね。こえで いっても いいよ"); unsay();
  setListen(h, true);
  const r = await snWait(q, cards, () => { wrong++; playMove(h, "think"); speak(C.pony, "sn_ng", "ちがうよ。もう いちど かんがえて みよう"); });
  setListen(h, false); const ok = wrong === 0;
  const hit = cards.cs.find(c => c.v === q.x); hit.rect.setAttribute("fill", "#FFE27A"); for (let i = 0; i < 8; i++) { const bx = +hit.rect.getAttribute("x") + 105, by = 655; mark("sparkle", bx, by, { vx: Math.cos(i) * 260, vy: Math.sin(i) * 260, life: .6, s: .6 }); }
  chime(); joy(h); confetti(ok ? 50 : 20); await speak(C.pony, "sn_ok", "せいかい！"); await snSayAns(C.pony, q);
  playLog({ type: "sansu", id: q.type === "word" ? q.w.key : `${q.type}:${q.a ?? ""}${q.type === "add" ? "+" : q.type === "sub" ? "-" : ""}${q.b ?? q.n ?? ""}`, tier: lv, L: L0, ok, answer: q.x, wrong, how: r.how, sec: Math.round((performance.now() - t0) / 1000), ...(MODE === "multi" ? { who: NAMES[pc.kind] } : {}) });
  grade(ok); GS.tasks++; if (ok) { GS.ok++; await seedGet(h); }
  await sleep(500); cards.g.remove(); setView("board"); return ok;
}
/* ---------- ちゅうの ばん ---------- */
async function sansuRival(before) {
  let lv = snLv(); const q = snMake(lv), h = snView(RIVAL); const mistake = E.L >= 2 && Math.random() < .35;
  showEngine({ no: "sansu", main: `${q.x}` }, `${NAMES[RIVAL]}の さんすう${mistake ? "（まちがえる回）" : ""}`);
  const g = await snDraw(q); await sleep(400); await snAnimate(g, q); await snAsk(q);
  await speak(C.pony, "sn_ask_r", "ちゅうくん、こたえは？"); playMove(h, "think"); await sleep(800);
  const u = snUnit(q), say = (v) => u ? speak(h, `csn_a_${u}_${v}`, SANSU.ans[u][v] + "！") : speak(h, `csn_n_${v}`, SANSU.num[v] + "！");
  if (!mistake) { await say(q.x); unsay(); chime(); joy(h); playMove(C.pony, "clap"); await speak(C.pony, "sn_ok", "せいかい！"); await sleep(400); setView("board"); return; }
  const wv = snChoices(q).find(v => v !== q.x); await say(wv); unsay(); surprise(C.pony); markAbove(C.pony, "q"); await sleep(400);
  await speak(C.pony, "sn_teach", "ちゅうくんに こたえを おしえて あげよう。ただしい カードを タッチしてね"); playMove(h, "think"); await rivalSay(h, "huh");
  const cards = snCards(q, snChoices(q)); let wrong = 0; setListen(C.shima, true);
  await snWait(q, cards, () => { wrong++; speak(C.pony, "sn_ng", "ちがうよ。もう いちど かんがえて みよう"); }); setListen(C.shima, false);
  const ok = wrong === 0; playLog({ type: "teach", id: "sansu", ok, tries: [String(wrong)] }); if (ok) GS.ok++;
  confetti(40); chime(); markAbove(h, "ex"); await rivalSay(h, "thanks"); await say(q.x); unsay(); cards.g.remove(); joy(h); await sleep(400); setView("board");
  if (ok) { markAbove(P.gao, "drop"); P.gao.node = before; const [x, y] = nodeXY(P.gao, before); await slide(P.gao, x, y, .5, .3); }
}
{ const lc = landChild; landChild = async function (pc = P.shima) { if (curStage !== SN) return lc(pc); const id = pc.node; if (winner) return; if (kindOf(id) === "start") return; const ok = await runSansu(pc); if (ok && pc.player) pc.player.ok++; }; }
{ const gs = gaoSit; gaoSit = async function (before) { if (curStage !== SN) return gs(before); return sansuRival(before); }; }

/* ---------- 盤：ノートの ます目 ---------- */
STAGE_DEF[SN] = { ground: "#FFFFFF", sky: "#CFEAFB", names: ["こくばん", "こくばん", "ノート", "ノート", "ノート", "こくばん", "こくばん", "ノート", "こくばん"], fills: { こくばん: "#D7F0D2", ノート: "#D7ECFF" } };
{ const n = {}, pl = {}, nx = {}; const T = arcPts(800, 560, 600, 330, [150, 128, 106, 84, 62, 40, 18, -6]);
  chain(["0", "1", "2", "3", "4", "f1", "a1", "a2"], T, "こくばん", n, pl); pl["3"] = pl["4"] = pl.f1 = "ノート";
  chain(["a3", "a4", "a5"], arcPts(800, 560, 600, 330, [-30, -55, -80]), "ノート", n, pl);
  chain(["b1", "b2"], [[1150, 600], [960, 560]], "ノート", n, pl);
  chain(["m1", "m2", "f2"], arcPts(800, 560, 600, 330, [-105, -130, -155]), "こくばん", n, pl);
  chain(["c1", "c2"], arcPts(800, 560, 600, 330, [-180, -205]), "ノート", n, pl);
  chain(["d1"], [[560, 420]], "こくばん", n, pl);
  n["15"] = [800, 560, "goal"]; pl["15"] = "こくばん"; n["0"].push("start"); n["4"].push("block");
  linkLine(nx, ["0", "1", "2", "3", "4", "f1", "a1", "a2", "a3", "a4", "a5", "m1", "m2", "f2", "c1", "c2", "15"]); linkLine(nx, ["f1", "b1", "b2", "m1"]); linkLine(nx, ["f2", "d1", "15"]);
  BOARD[SN] = { nodes: n, place: pl, next: nx, away: [300, 760], style: (a, b) => ["b1", "b2", "d1"].includes(a) || ["b1", "d1"].includes(b) ? "hall" : "classwood", labels: [] }; }
BOARD_BG[SN] = L => { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFFFFF" }, L);
  for (let x = 0; x < 1600; x += 50) el("path", { d: `M${x} 0 V1000`, stroke: "#BDE3F2", "stroke-width": 2 }, L); for (let y = 0; y < 1000; y += 50) el("path", { d: `M0 ${y} H1600`, stroke: "#BDE3F2", "stroke-width": 2 }, L);
  ["1+1", "3−2", "5+4", "10", "7", "2+8", "9−3", "＝"].forEach((t, i) => txt(L, 120 + (i * 197) % 1400, 120 + (i * 131) % 820, t, 54, { fill: "#B9A8D9", opacity: .5 }));
  el("rect", { x: 620, y: 470, width: 360, height: 180, rx: 10, fill: "#2F6B4F", ...S6(6) }, L); txt(L, 800, 580, "さんすう", 56, { "text-anchor": "middle", fill: "#FFFFFF" }); };
BLOCK_DEF[SN] = { who: "nobbo", sleep: false, intro: ["p_blk_sansu", "のっぽせんせいが こくばんを けして いるよ"], say: ["blk_sansu", "せんせい、とおして ください"], to: "のっぽせんせいに いおう",
  keys: [["とおして", "通して"]], res: ["rs_sansu", "はい、どうぞ。けいさん、がんばってね"] };
SLEEPER_OF[SN] = "nobbo";
EVENTS[SN] = { a2: ["fwd", 2, "ev_sansuf", "けいさんが はやく できた！ 2マス すすむよ"], m2: ["back", 2, "ev_sansub", "けしゴムを おとした！ 2マス もどるよ"], d1: ["home", 0, "ev_sansuh", "さんすうセットを わすれた！ スタートに もどるよ"] };
