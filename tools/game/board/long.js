/* ================= みんなで あそぶ 専用「だいぼうけん」ロングコース =================
   盤：約45マス・分かれ道4つ・ワープ3つ・トロッコ・つむじかぜ・よびよせ・ひとやすみ・もういっかい など
   マスの 課題：かいわの つづき（読み上げで4択）／はんたい ことば／ことば パズル／まちがい さがし／ていねいな ことば／読み上げ場面
   声：lk_*（このコース 専用。packs/long.json）。読み上げ場面は こうしゃ の場面を つかう。 */
{ const n = {}, pl = {}, nx = {}; const R1 = 915, R2 = 750, R3 = 585, R4 = 420, R5 = 265, X = [190, 335, 480, 625, 770, 915, 1060, 1205, 1350, 1475];
  const put = (id, x, y, place, kind) => { n[id] = kind ? [x, y, kind] : [x, y]; pl[id] = place; };
  ["0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9"].forEach((id, i) => put(id, X[i], R1, i < 5 ? "げんかん" : "げたばこ"));
  ["b0", "b1", "4", "b3", "b4", "b5", "b6", "b7", "b8", "b9"].forEach((id, i) => put(id, X[9 - i], R2, i < 5 ? "ろうか" : "ほけんしつ"));
  ["c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9"].forEach((id, i) => put(id, X[i], R3, i < 5 ? "としょしつ" : "かいだん"));
  ["d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7"].forEach((id, i) => put(id, X[9 - i], R4, "しょくいんしつ"));
  [["e0", 520], ["e1", 665], ["e2", 810], ["e3", 955], ["e4", 1100]].forEach(([id, x]) => put(id, x, R5, "ろうか"));
  put("15", 1250, 285, "ろうか", "goal"); n["0"].push("start"); n["4"].push("block");
  put("s1", 1130, 832, "げたばこ"); put("s2", 540, 668, "ほけんしつ"); put("m1", 990, 502, "かいだん"); put("s4", 690, 342, "しょくいんしつ");
  linkLine(nx, ["0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "b0", "b1", "4", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9",
    "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "e0", "e1", "e2", "e3", "e4", "15"]);
  linkLine(nx, ["a6", "s1", "b3"]); linkLine(nx, ["b6", "s2", "c2"]); linkLine(nx, ["c5", "m1", "d4"]); linkLine(nx, ["d5", "s4", "e1"]);
  BOARD.long = { nodes: n, place: pl, next: nx, away: [1520, 640], style: (a, b) => ["s1", "s2", "m1", "s4"].includes(a) || ["s1", "s2", "m1", "s4"].includes(b) ? "alley" : "park",
    labels: [["がっこう", 330, 990], ["こうえん", 1300, 680], ["おみせ", 330, 510], ["えき", 1420, 345], ["やま", 1150, 505]] }; }
STAGE_DEF.long = { ground: "#BFE3A6", sky: "#CFEAFB", names: STAGE_DEF.undou.names, fills: { がっこう: "#FFE3B3", こうえん: "#D7F0D2", おみせ: "#FFE0EE", えき: "#D7ECFF", やま: "#E9D9C3", げんかん: "#FFF1C9", げたばこ: "#FFF1C9", ろうか: "#FFF1C9", ほけんしつ: "#FFF1C9", としょしつ: "#FFF1C9", かいだん: "#FFF1C9", しょくいんしつ: "#FFF1C9" } };
RIVAL_OF.long = "gao"; SLEEPER_OF.long = "nobbo";
// ロングコースは ほかにも ある（ltomo＝ともだちの だいぼうけん）。共通の しくみは isLong() で きりかえる
const LONGS = new Set(["long"]); const isLong = () => LONGS.has(curStage);
BLOCK_DEF.long = { who: "nobbo", sleep: false, intro: ["lk_blk_intro", "のっぽせんせいが まえを ふさいでる！"], say: ["lk_blk_say", "せんせい、とおして ください"], to: "せんせいに いおう",
  keys: [["せんせい", "先生"], ["とおして", "通して", "とうして"], ["ください", "下さい"]], res: ["lk_blk_res", "おっと、すみません。どうぞ"] };
PIECE_S.nobbo = .2;
/* マスの 課題（色と しるし） */
const LTASK = { kaiwa: ["#FFB98A", "💬"], hantai: ["#B9E3FF", "↔"], joshi: ["#C9EBB5", "🧩"], machi: ["#FFE27A", "🔍"], teinei: ["#E2D4FF", "🎩"], scene: ["#FFFFFF", "🗣"] };
const LONG_TASKS = { long: {} }; const LONG_TASK = LONG_TASKS.long;
const LEGEND_L = [["kaiwa", "かいわ"], ["hantai", "はんたい"], ["joshi", "パズル"], ["machi", "まちがい"], ["teinei", "ていねい"], ["scene", "いってみよう"]];
const LEGENDS = { long: LEGEND_L };
{ const order = ["kaiwa", "scene", "hantai", "kaiwa", "joshi", "machi", "kaiwa", "teinei", "scene", "kaiwa", "hantai", "joshi", "kaiwa", "machi", "teinei"]; let i = 0;
  Object.keys(BOARD.long.nodes).forEach(id => { if (["0", "4", "15"].includes(id)) return; LONG_TASK[id] = order[i++ % order.length]; }); }
/* しかけ（とまると おきる） */
EVENTS.long = {
  a3: ["warp", "b6", "lk_ev_warp1", "ワープの あなだ！ ずっと さきまで とぶよ"],
  a8: ["push", 1, "lk_ev_push", "おしくらまんじゅう！ ほかの みんなが 1マス もどるよ"],
  b1: ["home", 0, "lk_ev_home", "わすれものに きづいた！ スタートに もどるよ"],
  b4: ["rest", 0, "lk_ev_rest", "ほけんしつで ひとやすみ。つぎは 1かい やすみだよ"],
  b8: ["trolley", 3, "lk_ev_trolley", "トロッコが きた！ ちかくの ひとも いっしょに 3マス すすむよ"],
  c0: ["fwd", 2, "lk_ev_kaze", "おいかぜだ！ 2マス すすむよ"],
  c3: ["swap", 0, "lk_ev_swap", "つむじかぜ！ いちばん まえの ひとと いれかわるよ"],
  c7: ["again", 0, "lk_ev_again", "ラッキー！ もう いっかい サイコロを ふれるよ"],
  c8: ["warp", "c1", "lk_ev_warp2", "あれれ、ワープの あなに おちた！ うしろに もどされるよ"],
  m1: ["rest", 0, "lk_ev_kiri", "やまみちで きりに まよった！ つぎは 1かい やすみだよ"],
  d2: ["warp", "e2", "lk_ev_warp3", "ワープの あなだ！ ゴールの ちかくまで とぶよ"],
  d6: ["call", 0, "lk_ev_call", "おーい！ いちばん うしろの ひとを ここまで よびよせるよ"],
  e3: ["back", 2, "lk_ev_koronda", "ころんじゃった！ 2マス もどるよ"],
};
Object.keys(EVENTS.long).forEach(id => delete LONG_TASK[id]);
const EV_ICON = { warp: "🌀", push: "💨", home: "↩", rest: "💤", trolley: "🚃", fwd: "⏩", swap: "🌪", again: "🎲", call: "🧲", back: "⏪" };
/* ゴールまでの のこりマス（「いちばん まえ」「いちばん うしろ」を きめる） */
function distToGoal(id) { const seen = { [id]: 0 }, q = [id]; while (q.length) { const a = q.shift(); if (a === GOAL) return seen[a]; NEXT(a).forEach(b => { if (seen[b] == null) { seen[b] = seen[a] + 1; q.push(b); } }); } return 999; }
function distFromStart(id) { const seen = { "0": 0 }, q = ["0"]; while (q.length) { const a = q.shift(); if (a === id) return seen[a]; NEXT(a).forEach(b => { if (seen[b] == null) { seen[b] = seen[a] + 1; q.push(b); } }); } return 0; }
async function forceStep(pc, n) { // 自動で すすむ（分かれ道は 1つめ）。ゴールに ついたら かち
  for (let i = 0; i < n; i++) { const nx = NEXT(pc.node); if (!nx.length) return; const to = nx[0]; await hop(pc, to, .26, i);
    if (to === GOAL) { if (!winner) { winnerPc = pc; winner = pc.kind; } return; } } }
async function backStep(pc, n) { pc.backing = true; for (let i = 0; i < n; i++) { const to = (pc.trail || []).pop(); if (!to) break; await hop(pc, to, .26, i); } pc.backing = false; }
async function warpTo(pc, id) { const [x, y] = nodeXY(pc, id); for (let i = 0; i < 8; i++) later(i * 60, () => mark("sparkle", pc.px, pc.py - 30, { vx: Math.cos(i) * 260, vy: Math.sin(i) * 260, life: .6, s: .5 }));
  noise(.5, 1800, .3); blip(300, 1400, .5, "sine"); await tween(350, k => { pc.s = pc.s0 * (1 - k); }); pc.node = id; pc.px = x; pc.py = y; pc.trail = []; await tween(350, k => { pc.s = pc.s0 * k; }); pc.s = pc.s0; }
const boardEventL = boardEvent;
boardEvent = async function (pc) {
  if (!isLong()) return boardEventL(pc);
  const ev = EVENTS[curStage][pc.node]; if (!ev) return;
  const [type, arg, key, text] = ev;
  if (type === "home" && distFromStart(pc.node) > 8) { // とおくまで きてからの「スタートに もどる」は きつすぎる → 5マス もどる（2026-10-25）
    await sleep(300); markAbove(pc, "drop"); chime(); showBanner("わすれものに きづいた！", 1400); await speak(C.pony, "lk_ev_home_b", "わすれものに きづいた！ 5マス もどるよ"); await backStep(pc, 5); return; }
  if (["fwd", "back", "home"].includes(type)) return boardEventL(pc);
  await sleep(300); markAbove(pc, "ex"); chime(); showBanner(text.split("！")[0] + "！", 1400); await speak(C.pony, key, text);
  const others = PLAYERS.map(p => p.pc).filter(p => p !== pc);
  if (type === "warp") { await warpTo(pc, arg); }
  else if (type === "push") { for (const o of others) { if (o.node !== "0") { markAbove(o, "drop"); await backStep(o, arg); } } }
  else if (type === "rest") { pc.player && (pc.player.rest = 1); markAbove(pc, "z", { i: 1 }); }
  else if (type === "again") { pc.player && (pc.player.again = 1); }
  else if (type === "trolley") { const d0 = distToGoal(pc.node); const near = others.filter(o => Math.abs(distToGoal(o.node) - d0) <= 3);
    for (const o of [pc, ...near]) { jump(o, .6); await forceStep(o, arg); if (winner) break; } }
  else if (type === "swap") { const lead = others.filter(o => distToGoal(o.node) < distToGoal(pc.node)).sort((p, q) => distToGoal(p.node) - distToGoal(q.node))[0];
    if (lead) { const a = pc.node, b = lead.node; await Promise.all([warpTo(pc, b), warpTo(lead, a)]); } else await speak(C.pony, "lk_ev_swap_none", "きみが いちばん まえだから、そのままだよ"); }
  else if (type === "call") { const last = others.filter(o => distToGoal(o.node) > distToGoal(pc.node)).sort((p, q) => distToGoal(q.node) - distToGoal(p.node))[0];
    if (last) await warpTo(last, pc.node); else await speak(C.pony, "lk_ev_call_none", "うしろに だれも いないね"); }
  await sleep(300);
};
/* ばん：ひとやすみ・もういっかい */
const multiTurnL = multiTurn;
multiTurn = async function (pl, first) {
  if (isLong() && pl.rest) { pl.rest = 0; setTurn(pl.kind, pl.idx); markAbove(pl.pc, "z", { i: 2 }); await speak(C.pony, "lk_rest_now", "ひとやすみ ちゅう だから、つぎの ひとの ばんだよ"); return; }
  await multiTurnL(pl, first);
  if (isLong() && pl.again && !winner) { pl.again = 0; await speak(C.pony, "lk_again_now", "もう いっかい ふってね"); await multiTurnL(pl, false); }
};
/* マスに とまったら：課題 */
const landChildL = landChild;
landChild = async function (pc = P.shima) {
  if (!isLong()) return landChildL(pc);
  if (winner) return; const t = LONG_TASKS[curStage][pc.node]; if (!t) return;
  if (t === "scene") return landChildL(pc);
  const dice = document.getElementById("dice"); if (dice) dice.style.visibility = "hidden";
  let ok = false; try { ok = await LTASK_RUN[t](pc); } finally { if (dice) dice.style.visibility = ""; } if (ok) GS.ok++; if (ok && pc.player) pc.player.ok++;
};
// 読み上げ場面は こうしゃ の場面を つかう
const pickSitL = pickSit;
pickSit = function (place, heroKind = "shima") { if (curStage !== "long") return pickSitL(place, heroKind); curStage = "kousha"; try { return pickSitL(place, heroKind); } finally { curStage = "long"; } };
const loadPackL = loadPack;
loadPack = async function (id) {
  if (id !== "long") return loadPackL(id);
  await loadPackL("kousha");
  if (!PACK.loaded.long) { try { const r = await fetch("packs/long.json", { cache: "no-cache" }); if (r.ok) { const d = await r.json(); Object.keys(d).forEach(k => AUD[k] = "data:audio/mpeg;base64," + d[k]); PACK.loaded.long = Object.keys(d); } } catch (e) { } }
  await Promise.all((PACK.loaded.long || []).map(k => voiceBuf(k))); return true;
};

/* ---------- 課題の 画面（カード） ---------- */
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const LDATA = { long: LONG }; // ステージごとの 課題の データ
const usedL = {}; function pickL(kind, ok = () => true) { const all = (LDATA[curStage] || LONG)[kind].filter(ok); const u = usedL[curStage + kind] = usedL[curStage + kind] || new Set(); let pool = all.filter(x => !u.has(x.id)); if (!pool.length) { u.clear(); pool = all; } const x = pool[rnd(pool.length)]; u.add(x.id); return x; }
function panel(title, color = "#FFFFFF") { const g = el("g", {}, hudLayer); el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#2B2A3388" }, g);
  el("rect", { x: 70, y: 60, width: 1460, height: 880, rx: 40, fill: color, ...S6(8) }, g); const t = el("g", {}, g); const tw = title.length * 40 + 80;
  el("rect", { x: 800 - tw / 2, y: 30, width: tw, height: 70, rx: 35, fill: "#FFD25E", ...S6(6) }, t); txt(t, 800, 80, title, 40, { "text-anchor": "middle" }); return g; }
function card(parent, x, y, w, h, label, emo, opt = {}) {
  const g = el("g", { style: "cursor:pointer" }, parent); const r = el("rect", { x, y, width: w, height: h, rx: 26, fill: opt.fill || "#FFF8E8", ...S6(6) }, g);
  if (emo) { const es = opt.es || Math.min(h * .55, 110); txt(g, x + (label ? 20 + es * .62 : w / 2), y + h / 2 + es * .36, emo, es, { "text-anchor": "middle" }); }
  if (label) { const avail = w - (emo ? 180 : 40), cx = x + (emo ? 150 + (w - 150) / 2 : w / 2);
    let lines = [label]; if (label.length * 40 > avail && label.length > 7) { // ながい ことばは 2ぎょうに（「、」か 空白で わける）
      const cut = [...label].map((c, i) => (c === "、" || c === " ") ? i : -1).filter(i => i > 0).sort((a, b) => Math.abs(a - label.length / 2) - Math.abs(b - label.length / 2))[0];
      if (cut) lines = [label.slice(0, cut + (label[cut] === "、" ? 1 : 0)), label.slice(cut + 1)]; }
    const mx = Math.max(...lines.map(l => l.length)); let fs = Math.min(opt.fs || 56, avail / Math.max(1, mx) * 1.02, (h - 24) / lines.length * .8);
    lines.forEach((l, i) => txt(g, cx, y + h / 2 + fs * .36 + (i - (lines.length - 1) / 2) * fs * 1.15, l, fs, { "text-anchor": "middle" })); }
  g.rect = r; return g; }
const flashCard = (c, ok) => { c.rect.setAttribute("fill", ok ? "#C9EBB5" : "#FFC2D1"); if (!ok) tween(400, k => c.setAttribute("transform", `translate(${(Math.sin(k * 30) * 10 * (1 - k)).toFixed(1)} 0)`)); };
const tapOnce = cards => new Promise(res => cards.forEach((c, i) => c.onclick = () => { cards.forEach(x => x.onclick = null); res(i); }));
// 声で えらぶ：聞きとった 文と いちばん 近い カード（ひらがなで くらべる）
function scoreOpt(heard, text) { const a = norm(heard), b = norm(text); if (!b) return 0; if (a.includes(b)) return 1; let hit = 0; const used = new Set();
  for (const ch of b) { const j = [...a].findIndex((c, k) => c === ch && !used.has(k)); if (j >= 0) { used.add(j); hit++; } } return hit / b.length * (a.length > b.length * 2.2 ? .8 : 1); }
async function sayChoice(pc, texts, cards, ms = 9000) {
  if (!srUsable) { await speak(C.pony, "lk_tap", "カードに タッチしてね"); return tapOnce(cards); }
  return new Promise(res => { let fin = false, best = { i: -1, s: 0 }; setListen(pc, true); heardEl.textContent = "…";
    const end = i => { if (fin) return; fin = true; h.stop(); clearTimeout(tm); setListen(pc, false); cards.forEach(c => c.onclick = null); res(i); };
    if (typeof devOn === "function") cards.forEach((c, i) => c.onclick = () => DEV && end(i));
    const h = hear(ts => { for (const t of ts) { heardEl.textContent = t; texts.forEach((x, i) => { const s = scoreOpt(t, x); if (s > best.s) best = { i, s }; }); }
      const sc = texts.map(x => Math.max(...ts.map(t => scoreOpt(t, x)))); const top = Math.max(...sc), cnt = sc.filter(s => s >= top - .05).length;
      const second = Math.max(0, ...sc.filter((s, i) => i !== sc.indexOf(top)));
      if ((top >= .85 && cnt === 1) || (top >= .6 && top - second >= .25)) end(sc.indexOf(top)); }, ms);
    const tm = setTimeout(() => end(best.s >= .5 ? best.i : -1), ms); h.done.then(() => setTimeout(() => end(best.s >= .5 ? best.i : -1), 300)); });
}
const DEV = location.search.includes("dev");
async function moveAfter(pc, n) { await sleep(400); if (n > 0) { await speak(C.pony, "lk_plus1", "1マス よけいに すすむよ！"); await forceStep(pc, n); } else if (n < 0) { await speak(C.pony, "lk_minus1", "1マス もどるよ"); await backStep(pc, -n); } }

// かけあいの 動き（せりふと あう ものを えらぶ。ないものは うなずく）
const LK_MOVE = { ohayou: ["wave", "point", "nod"], itadaki: ["clap", "nod", "bow"], gochisou: ["nod", "nod", "bow"], arigatou: ["point", "nod", "shy"], gomen: ["sad", "point", "nod"],
  kashite: ["think", "pump", "nod"], irete: ["laugh", "look", "wave"], seki: ["sleepy", "look", "bow"], daijoubu: ["!hurt", "surprise", "!up"], oshiete: ["think", "no", "nod"],
  sumimasen: ["point", "look", "nod"], junban: ["point", "look", "nod"], omedetou: ["clap", "shy", "heart"], odaiji: ["sneeze", "nod", "!sickok"], ittekimasu: ["pump", "nod", "wave"],
  ojama: ["wave", "bow", "nod"], shitsurei: ["nod", "nod", "nod"], iiyo: ["point", "nod", "banzai"], michi: ["look", "think", "banzai"], atode: ["wave", "nod", "nod"] };
// せりふに あわせた とくべつな 動き（いたい・かぜ）
const LK_ACT = {
  hurt: c => { surprise(c); later(350, () => { c.sadMouth = true; c.headY.t = 26; c.eyeY.t = 10; markAbove(c, "drop"); tears(c, 2.5); }); },
  up: c => { c.headY.t = 0; c.eyeY.t = 0; later(400, () => { c.sadMouth = false; playMove(c, "nod"); }); },
  sickok: c => { c.sadMouth = false; playMove(c, "nod"); },
};
const lkMove = (c, m) => { m = m || "nod"; if (m[0] === "!") LK_ACT[m.slice(1)](c); else playMove(c, m); };
/* 1) かいわの つづき：キャラの やりとり → 4まいの カードを 声で えらぶ */
async function lkKaiwa(pc) {
  const it = pickL("kaiwa", x => !x.cast.includes(pc.kind));
  const s = { id: "lk_" + it.id, place: it.place, asker: ["meebaa", "kamejii", "nobbo"].find(k => !it.cast.includes(k) && k !== pc.kind), cast: it.cast, // asker は 画面の外（使わない）
    intro: "kaiwa", talk: it.talk };
  const { hero: h } = setSitView(s, pc.kind); const cast = STORY_CAST; await sleep(600);
  for (let i = 0; i < it.talk.length; i++) { const [who, text] = it.talk[i]; lkMove(cast[who], (LK_MOVE[it.id] || [])[i]); if (it.id === "odaiji" && i === 0) later(900, () => cast[who].sadMouth = true); await speak(cast[who], `lk_${it.id}_t${i}`, text); }
  playMove(h, "think");
  const opts = shuffle(it.opts.map((o, i) => ({ t: o[0], e: o[1], ok: i === 0 })));
  const g = el("g", {}, hudLayer); el("rect", { x: 60, y: 130, width: 1480, height: 470, rx: 34, fill: "#FFFFFFEE", ...S6(6) }, g);
  txt(g, 800, 190, "つぎに なんて いえば いいかな？", 46, { "text-anchor": "middle" });
  const cards = opts.map((o, i) => card(g, 100 + (i % 2) * 710, 225 + Math.floor(i / 2) * 180, 690, 160, o.t, o.e, { fs: 56, es: 90 }));
  await speak(C.pony, "lk_ask", "つぎに なんて いえば いいかな？ カードを こえに だして よんでね");
  let pick = -1; for (let n = 0; n < 2 && pick < 0; n++) { pick = await sayChoice(h, opts.map(o => o.t), cards); if (pick < 0 && n === 0) await speak(C.pony, "p_again", "もう いっかい いってみよう"); }
  const okIdx = opts.findIndex(o => o.ok); let ok = false, move = 0;
  if (pick < 0) { flashCard(cards[okIdx], true); await speak(C.pony, `lk_${it.id}_a`, `こたえは「${it.opts[0][0]}」`); }
  else if (opts[pick].ok) { ok = true; move = 1; flashCard(cards[pick], true); confetti(40); chime(); playMove(h, "nod"); await speak(C.pony, "lk_seikai", "せいかい！"); }
  else { move = -1; flashCard(cards[pick], false); await sleep(500); flashCard(cards[okIdx], true); await speak(C.pony, `lk_${it.id}_a`, `こたえは「${it.opts[0][0]}」`); }
  g.remove(); const [rw, rt] = it.reply; lkMove(cast[rw], (LK_MOVE[it.id] || [])[2]); await speak(cast[rw], `lk_${it.id}_r`, rt);
  grade(ok); playLog({ type: "kaiwa", id: it.id, ok, picked: pick >= 0 ? opts[pick].t : "", who: NAMES[pc.kind] });
  await sleep(500); setView("board"); await moveAfter(pc, move); return ok;
}
/* 2) はんたい ことば */
async function lkHantai(pc) {
  const it = pickL("hantai"); const byVoice = E.L >= 3;
  const g = panel("はんたい ことば", "#EAF6FF"); txt(g, 800, 230, it.e, 130, { "text-anchor": "middle" }); txt(g, 800, 340, `「${it.w}」の はんたいは？`, 60, { "text-anchor": "middle" });
  const opts = shuffle([{ t: it.a, e: it.ae, ok: true }, ...it.ng.map(([t, e]) => ({ t, e, ok: false }))]);
  const cards = opts.map((o, i) => card(g, 140 + i * 450, 420, 420, 380, null, o.e, { es: 150 }));
  opts.forEach((o, i) => txt(cards[i], 140 + i * 450 + 210, 760, o.t, 56, { "text-anchor": "middle" }));
  await speak(C.pony, `lk_${it.id}_q`, `「${it.w}」の はんたいは どれかな？`);
  if (byVoice) await speak(C.pony, "lk_sayit", "こたえを こえに だして いってね");
  let pick = byVoice ? await sayChoice(pc, opts.map(o => o.t), cards) : await tapOnce(cards); if (pick < 0) pick = await tapOnce(cards);
  const ok = opts[pick].ok, okIdx = opts.findIndex(o => o.ok); flashCard(cards[pick], ok); if (!ok) { await sleep(500); flashCard(cards[okIdx], true); } else { confetti(30); chime(); }
  await speak(C.pony, `lk_${it.id}_a`, `「${it.w}」の はんたいは「${it.a}」`); grade(ok); await sleep(400); g.remove(); return ok;
}
/* 3) ことば パズル（が・を） */
async function lkJoshi(pc) {
  const it = pickL("joshi"); const L = E.L;
  const g = panel("ことば パズル", "#F0FAEA"); txt(g, 800, 250, it.e, 140, { "text-anchor": "middle" });
  const words = it.words, parts = words.map(w => w.startsWith("[") ? w.slice(1, -1) : null);
  let ok = true;
  if (L <= 4) { // 助詞の タイルを 入れる（2まい → 3まい）
    const slots = []; let x = 800 - words.reduce((a, w) => a + (w.startsWith("[") ? 120 : w.length * 64 + 30), 0) / 2;
    words.forEach(w => { if (w.startsWith("[")) { const b = el("rect", { x, y: 360, width: 100, height: 100, rx: 16, fill: "#FFFFFF", ...S6(6), "stroke-dasharray": "14 10" }, g); slots.push({ x, b, ans: w.slice(1, -1) }); x += 120; }
      else { txt(g, x + w.length * 32 + 5, 435, w, 64, { "text-anchor": "middle" }); x += w.length * 64 + 30; } });
    const pool = L <= 2 ? [...new Set(["が", parts.find(p => p && p !== "が") || "を"])] : ["が", "を", "に"];
    await speak(C.pony, "lk_joshi_q", "あいて いる ところに、ただしい じを いれてね");
    for (const sl of slots) {
      sl.b.setAttribute("stroke", "#E8735A");
      const tiles = shuffle(pool).map((p, i, a) => { const c = card(g, 800 - a.length * 110 + i * 220, 600, 190, 190, p, null, { fs: 110 }); c.p = p; return c; });
      let first = true;
      while (true) { const i = await tapOnce(tiles); if (tiles[i].p === sl.ans) { flashCard(tiles[i], true); break; } flashCard(tiles[i], false); first = false; ok = false; blip(300, 200, .2); }
      tiles.forEach(t => t.remove()); txt(g, sl.x + 50, 435, sl.ans, 64, { "text-anchor": "middle", fill: "#E8473C" }); sl.b.setAttribute("stroke", INK); chime();
    }
  } else { // ことばカードを ならべる
    const chunks = []; for (let i = 0; i < words.length; i++) { if (words[i + 1] && words[i + 1].startsWith("[")) { chunks.push(words[i] + words[i + 1].slice(1, -1)); i++; } else chunks.push(words[i]); }
    await speak(C.pony, "lk_joshi_q2", "ことばの カードを、ただしい じゅんばんに タッチしてね");
    const order = shuffle(chunks.map((c, i) => ({ c, i }))); const placed = []; let y0 = 400;
    const cs = order.map((o, j) => { const c = card(g, 180 + j * (1240 / order.length), 620, 1240 / order.length - 30, 150, o.c, null, { fs: 60 }); c.o = o; return c; });
    while (placed.length < chunks.length) { const i = await new Promise(res => cs.forEach((c, k) => { if (!c.done) c.onclick = () => res(k); }));
      const c = cs[i]; if (c.o.i === placed.length) { c.done = true; c.onclick = null; flashCard(c, true); placed.push(c.o.c); tween(300, k => c.setAttribute("transform", `translate(${(((placed.length - 1) * 1240 / chunks.length + 180) - (180 + i * 1240 / order.length)) * k} ${(-250 * k).toFixed(0)})`)); blip(800 + placed.length * 100, 900, .1); }
      else { flashCard(c, false); ok = false; await sleep(400); c.rect.setAttribute("fill", "#FFF8E8"); } }
    if (L >= 7) { await speak(C.pony, "lk_sayit2", "できた ぶんを、こえに だして よんでね"); const keys = chunks.map(c => [c]); setListen(pc, true); const r = await listen(keys, 8000); setListen(pc, false); if (r.r !== "ok") ok = false; }
  }
  confetti(30); await speak(C.pony, `lk_${it.id}`, words.map(w => w.replace(/[[\]]/g, "")).join("").replace(/(が|を|に)/g, "$1 ")); grade(ok); await sleep(400); g.remove(); return ok;
}
/* 4) まちがい さがし */
async function lkMachi(pc) {
  const it = pickL("machi", x => E.L >= 4 || x.errs.length === 1);
  const g = panel("まちがい さがし", "#FFFBE6"); txt(g, 800, 200, "まちがって いる じを みつけよう", 50, { "text-anchor": "middle" }); await speak(C.pony, "lk_machi_q", "まちがって いる じが あるよ。みつけて タッチしてね");
  const chars = [...it.s]; const w = Math.min(110, 1300 / chars.length), x0 = 800 - chars.length * w / 2; let ok = true;
  const tiles = chars.map((ch, i) => { const c = card(g, x0 + i * w, 300, w - 8, w * 1.3, ch === " " ? "" : ch, null, { fs: w * .7 }); c.i = i; if (ch === " ") c.setAttribute("opacity", .3); return c; });
  // まちがいが 2こ ある ときは、のこりの かずを みせる（2026-10-25：2こめに きづきにくい）
  const left = it.errs.length > 1 ? el("g", {}, g) : null; const drawLeft = n => { if (!left) return; left.innerHTML = ""; el("rect", { x: 1180, y: 228, width: 300, height: 62, rx: 31, fill: "#FF8FA3", ...S6(5) }, left); txt(left, 1330, 272, `のこり ${n}こ`, 40, { "text-anchor": "middle", fill: "#FFFFFF" }); };
  drawLeft(it.errs.length);
  for (const [ei, er] of it.errs.entries()) {
    if (ei > 0) { drawLeft(it.errs.length - ei); if (left) tween(500, k => left.setAttribute("transform", `translate(1330 259) scale(${(1 + .25 * Math.sin(k * Math.PI)).toFixed(3)}) translate(-1330 -259)`)); await speak(C.pony, "lk_machi_more", "まだ もう ひとつ、まちがいが あるよ。さがして みよう"); }
    let misses = 0;
    while (true) { const i = await tapOnce(tiles); if (i === er.pos) { flashCard(tiles[i], false); break; } misses++; ok = false; flashCard(tiles[i], true); await sleep(300); tiles[i].rect.setAttribute("fill", "#FFF8E8");
      if (misses >= 2) { tiles[er.pos].rect.setAttribute("fill", "#FFE27A"); await speak(C.pony, "lk_machi_hint", "ひかって いる じを みて みよう"); } }
    await speak(C.pony, "lk_machi_fix", "ただしい じは どれかな？");
    const cands = shuffle([er.ok, er.bad, er.alt]); const cs = cands.map((c, i) => card(g, 800 - 330 + i * 230, 600, 200, 200, c, null, { fs: 110 }));
    while (true) { const i = await tapOnce(cs); if (cands[i] === er.ok) { flashCard(cs[i], true); break; } ok = false; flashCard(cs[i], false); await sleep(300); cs[i].rect.setAttribute("fill", "#FFF8E8"); }
    await sleep(300); cs.forEach(c => c.remove()); const t = tiles[er.pos]; t.remove(); tiles[er.pos] = card(g, x0 + er.pos * w, 300, w - 8, w * 1.3, er.ok, null, { fs: w * .7, fill: "#C9EBB5" }); chime();
  }
  if (left) drawLeft(0); confetti(30); await speak(C.pony, `lk_${it.id}`, it.fix); grade(ok); await sleep(400); g.remove(); return ok;
}
/* 5) ていねいな ことば */
async function lkTeinei(pc) {
  const it = pickL("teinei"); const g = panel("ていねいな ことば", "#F4EEFF");
  txt(g, 800, 250, it.e, 120, { "text-anchor": "middle" }); txt(g, 800, 360, it.kind === "which" ? `${it.q}、どっちを いう？` : it.q, it.q.length > 20 ? 46 : 54, { "text-anchor": "middle" });
  const opts = shuffle([{ t: it.ok, e: it.oke, ok: true }, { t: it.ng, e: it.nge, ok: false }]);
  const cards = opts.map((o, i) => card(g, 150 + i * 670, 470, 630, 260, o.t, o.e || null, { fs: 58, es: 110 }));
  await speak(C.pony, `lk_${it.id}_q`, it.kind === "which" ? `${it.q}、どっちを いうと いいかな？` : it.q);
  const pick = await tapOnce(cards); const ok = opts[pick].ok; flashCard(cards[pick], ok); if (!ok) { await sleep(500); flashCard(cards[opts.findIndex(o => o.ok)], true); } else { confetti(30); chime(); }
  await speak(C.pony, `lk_${it.id}_a`, it.kind === "which" ? `「${it.ok}」と いうと いいね` : `「${it.ok}」だね`); grade(ok); await sleep(400); g.remove(); return ok;
}
const LTASK_RUN = { kaiwa: lkKaiwa, hantai: lkHantai, joshi: lkJoshi, machi: lkMachi, teinei: lkTeinei };

/* ---------- 盤の 見た目 ---------- */
BOARD_BG.long = function (L) {
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#8FD3F0" }, L);
  el("path", { d: "M120 980 Q40 820 110 640 Q60 420 200 300 Q330 170 560 190 Q900 150 1240 200 Q1520 230 1560 420 Q1590 640 1540 820 Q1500 990 1300 990 Z", fill: "#BFE3A6", ...S6(6) }, L);
  [[330, 900, "🏫"], [1530, 760, "🌳"], [150, 560, "🏪"], [1520, 320, "🚉"], [1060, 470, "⛰️"], [760, 180, "☁️"], [1400, 980, "🌊"], [80, 980, "🌊"], [600, 520, "🌷"], [1300, 520, "🌲"], [430, 360, "🎈"]].forEach(([x, y, e]) => txt(L, x, y, e, 70, { "text-anchor": "middle", opacity: .9 }));
  // ワープの つながり
  Object.entries(EVENTS.long).forEach(([id, [type, to]]) => { if (type !== "warp") return; const [x1, y1] = NODES[id], [x2, y2] = NODES[to];
    el("path", { d: `M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 160} ${x2} ${y2}`, fill: "none", stroke: "#8E5BD6", "stroke-width": 6, "stroke-dasharray": "16 14", opacity: .7 }, L); });
};
const drawBoardLL = drawBoard;
drawBoard = function () {
  drawBoardLL(); if (!isLong()) return;
  Object.entries(LONG_TASKS[curStage]).forEach(([id, t]) => { const [x, y] = NODES[id]; const [c, ic] = LTASK[t]; el("circle", { cx: x, cy: y, r: 34, fill: c, ...S6(4) }, boardLayer); txt(boardLayer, x, y + 13, ic, 34, { "text-anchor": "middle" }); });
  Object.entries(EVENTS[curStage]).forEach(([id, [type]]) => { const [x, y] = NODES[id]; el("circle", { cx: x, cy: y, r: 36, fill: type === "warp" ? "#D9C2F0" : "#FFF1C9", ...S6(4) }, boardLayer); txt(boardLayer, x, y + 14, EV_ICON[type], 38, { "text-anchor": "middle" }); });
  // しるしの せつめい
  const LG = LEGENDS[curStage], lg = el("g", {}, boardLayer), W = 1130 / LG.length; el("rect", { x: 140, y: 118, width: 1180, height: 64, rx: 32, fill: "#FFFFFFDD", ...S6(4) }, lg);
  LG.forEach(([k, t], i) => { const x = 172 + i * W; el("circle", { cx: x, cy: 150, r: 18, fill: LTASK[k][0], ...S6(3) }, lg); txt(lg, x, 158, LTASK[k][1], 20, { "text-anchor": "middle" }); txt(lg, x + 24, 159, t, Math.min(24, (W - 34) / t.length)); });
};
// 「だいぼうけん」は みんなで あそぶ ときだけ（メニューに ボタン）
const showMultiMenuL = showMultiMenu;
showMultiMenu = function () {
  showMultiMenuL(); const st = document.querySelector(".mstages"); if (!st) return;
  const b = document.createElement("button"); b.type = "button"; b.className = "mst mlong";
  b.innerHTML = '<span class="mno">★</span><span class="mico">🗺️</span><span class="mname">だいぼうけん</span><span class="mstat">ロングコース</span>';
  b.onclick = () => { const on = document.querySelector(".mnum.on"); if (!on) return; const n = parseInt(on.textContent, 10); boot(); document.getElementById("startBox").remove(); newGame({ stage: "long", multi: n }); };
  st.prepend(b);
};
(function () { const s = document.createElement("style"); s.textContent = `.start.menu .mst.mlong{background:#FFE9B8;border-color:#E8735A}`; document.head.appendChild(s); })();
// いえ（ぴょんの おうち）の へや
ROOMS2.いえ = function (L) {
  for (let x = 0; x < 1600; x += 80) el("path", { d: `M${x} 0 V760`, stroke: "#F3D9B8", "stroke-width": 26, opacity: .5 }, L);
  el("rect", { x: 300, y: 170, width: 340, height: 280, rx: 8, fill: "#CFEAFB", ...S6(7) }, L); el("path", { d: "M470 170 V450 M300 310 H640", ...S6(6) }, L);
  el("path", { d: "M280 150 H660 V200 Q600 360 560 470 H520 Q560 330 600 200 H340 Q380 330 420 470 H380 Q340 360 280 200 Z", fill: "#F49FB6", ...S6(6) }, L);
  el("rect", { x: 820, y: 230, width: 170, height: 130, rx: 6, fill: "#FFF8E8", ...S6(6) }, L); el("path", { d: "M840 340 L885 280 L915 315 L940 290 L975 340 Z", fill: "#7BD389", ...S6(4) }, L); el("circle", { cx: 950, cy: 262, r: 14, fill: "#FFD25E", ...S6(3) }, L);
  el("rect", { x: 1220, y: 140, width: 220, height: 620, rx: 10, fill: "#C98B5A", ...S6(7) }, L); el("circle", { cx: 1400, cy: 460, r: 13, fill: "#FFD25E", ...S6(4) }, L);
  el("rect", { x: 1060, y: 610, width: 110, height: 150, rx: 10, fill: "#E8735A", ...S6(6) }, L); el("path", { d: "M1115 610 Q1060 520 1090 470 M1115 610 Q1120 500 1150 460 M1115 610 Q1170 540 1190 500", stroke: "#4FA35A", "stroke-width": 14, fill: "none", "stroke-linecap": "round" }, L);
  el("rect", { x: 0, y: 740, width: 1600, height: 22, fill: "#F2E3C9", ...S6(5) }, L);
};
