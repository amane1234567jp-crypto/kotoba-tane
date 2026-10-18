/* ---------- まるシマリバーシ 段階1（1台で交互に打つ） ----------
   秒数は仕様書 第4章・第5章の「ふつう」の値。ゆっくり は 1.5 倍。 */
const T = {
  drop: 250, flipStart: 400, flip: 350, flipGap: 120, afterFlip: 300, countStep: 80, toTurn: 400,
  undoFlip: 250, undoGap: 80, ring: 1000, passMin: 3000, gather: 2000,
};
const K = () => (CFG.slow ? 1.5 : 1);
const wait = ms => new Promise(r => setTimeout(r, ms));

/* ---------- 設定と保存（この端末だけ） ---------- */
const CFG_KEY = "marushima-reversi-cfg", GAME_KEY = "marushima-reversi-game";
const load = k => { try { return JSON.parse(localStorage.getItem(k)) || null; } catch (e) { return null; } };
const keep = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 保存できなくても遊べる */ } };
const CFG = Object.assign({ slow: 0, hints: 1, sfx: 2, voice: 2 }, load(CFG_KEY) || {});
const saveCfg = () => keep(CFG_KEY, CFG);

/* ---------- 対局の状態 ---------- */
// A = こども（左）、B = おばあちゃん（右）。blackSide が くろ（先手）の側。対局ごとに交代する。
const G = { hist: [], blackSide: "A", busy: true, started: false, ended: false };
const colorOf = side => (side === G.blackSide ? BLACK : WHITE);
const sideOf = color => (color === BLACK ? G.blackSide : (G.blackSide === "A" ? "B" : "A"));
const other = side => (side === "A" ? "B" : "A");
// 呼び名は使わず、石の色で呼ぶ（くろ／しろ）
const nameOf = side => (colorOf(side) === BLACK ? "くろ" : "しろ");
const saveGame = () => keep(GAME_KEY, { hist: G.hist, blackSide: G.blackSide });

/* ---------- 盤 ---------- */
const $ = id => document.getElementById(id);
const boardEl = $("board");
const cells = [];
for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
  const b = document.createElement("button");
  b.type = "button"; b.className = "cell"; b.setAttribute("role", "gridcell");
  b.setAttribute("aria-label", `${r + 1}ぎょう ${c + 1}れつ`);
  b.innerHTML = '<span class="hint"><i></i></span><span class="disc" data-c="0"><span class="f a" data-c="0"></span><span class="f b" data-c="0"></span></span>';
  b.addEventListener("click", () => tap(r, c));
  boardEl.appendChild(b);
  cells.push({ b, disc: b.querySelector(".disc"), fa: b.querySelector(".f.a"), fb: b.querySelector(".f.b") });
}
function setDisc(i, v) { const x = cells[i]; x.disc.dataset.c = v; x.fa.dataset.c = v; x.fb.dataset.c = v; x.disc.style.opacity = ""; x.disc.style.visibility = ""; }
function paint(board) { board.forEach((v, i) => setDisc(i, v)); }

function showHints(list) {
  clearHints();
  if (!CFG.hints) return;
  list.forEach(m => cells[at(m.r, m.c)].b.classList.add("can"));
}
function clearHints() { cells.forEach(x => x.b.classList.remove("can")); }

function dropDisc(i, v) {
  setDisc(i, v);
  cells[i].disc.animate([
    { transform: "translateY(-38%) scale(1.35)", opacity: 0 },
    { transform: "translateY(0) scale(.9)", opacity: 1, offset: .78 },
    { transform: "none", opacity: 1 },
  ], { duration: T.drop * K(), easing: "cubic-bezier(.5,0,.7,1)" });
}
// 方向に合わせた軸でくるっと返す（横に並ぶ石はたて軸、たてに並ぶ石はよこ軸）
/* 返すときだけ、厚みのある円柱（表の面・裏の面・側面24枚）を組み立てて回す。
   側面は本物の石と同じく半分ずつ黒と白。光の向きに合わせて明暗をつける。 */
const FACE = { 1: "#1E1E21", 2: "#F2F2EE" }, EDGE = { 1: [42, 42, 46], 2: [214, 214, 208] };
const SEG = 24, THICK = .2;
const shade = (rgb, k) => `rgb(${rgb.map(v => Math.round(Math.min(255, v * k))).join(",")})`;
function makeCylinder(from, to, D) {
  const H = D * THICK, w = Math.PI * D / SEG * 1.12;
  const cy = document.createElement("span"); cy.className = "cyl";
  const front = document.createElement("span"); front.className = "f"; front.dataset.c = from; front.style.transform = `translateZ(${H / 2}px)`;
  const back = document.createElement("span"); back.className = "f"; back.dataset.c = to; back.style.transform = `rotateY(180deg) translateZ(${H / 2}px)`;
  for (let k = 0; k < SEG; k++) {
    const ang = k * 360 / SEG, light = .62 + .5 * Math.max(0, Math.cos((ang - 200) * Math.PI / 180));
    const e = document.createElement("span"); e.className = "edge";
    e.style.cssText = `width:${w}px;height:${H}px;margin:${-H / 2}px 0 0 ${-w / 2}px;transform:rotateZ(${ang}deg) translateY(${D / 2 - .6}px) rotateX(90deg);` +
      `background:linear-gradient(to bottom, ${shade(EDGE[to], light)} 0 50%, ${shade(EDGE[from], light)} 50% 100%)`;
    cy.appendChild(e);
  }
  cy.append(back, front);
  return cy;
}
function flipDisc(i, to, dir, dur) {
  const x = cells[i], ax = -dir[0], ay = dir[1], from = +x.disc.dataset.c || (to === BLACK ? WHITE : BLACK);
  const D = x.disc.offsetWidth, cy = makeCylinder(from, to, D);
  x.b.appendChild(cy); x.disc.style.visibility = "hidden";
  const a = cy.animate([
    { transform: `rotate3d(${ax}, ${ay}, 0, 0deg) scale(1)` },
    { transform: `rotate3d(${ax}, ${ay}, 0, 90deg) scale(1.22)` },
    { transform: `rotate3d(${ax}, ${ay}, 0, 180deg) scale(1)` },
  ], { duration: dur, easing: "ease-in-out", fill: "forwards" });
  a.onfinish = () => { x.fa.dataset.c = to; x.fb.dataset.c = to; x.disc.dataset.c = to; x.disc.style.visibility = ""; cy.remove(); };
}
// 最後に置いた石を赤い光で示す（次の手まで残す）
const halo = document.createElement("div"); halo.id = "halo"; boardEl.prepend(halo);
[[2, 2], [2, 6], [6, 2], [6, 6]].forEach(([y, x]) => { const s = document.createElement("div"); s.className = "star"; s.style.left = x * 12.5 + "%"; s.style.top = y * 12.5 + "%"; boardEl.appendChild(s); });
function ringAt(i) {
  halo.classList.remove("on"); void halo.offsetWidth;
  halo.style.left = ((i % 8) + .5) * 12.5 + "%"; halo.style.top = (Math.floor(i / 8) + .5) * 12.5 + "%"; halo.classList.add("on");
}
function clearHalo() { halo.classList.remove("on"); }
function haloFor(hist) { const s = replay(hist).steps.at(-1); s ? ringAt(at(s.r, s.c)) : clearHalo(); }

/* ---------- 石の数（数えあがる） ---------- */
const shown = { A: 2, B: 2 };
function setCounts(board, animate) {
  const c = count(board), target = { [G.blackSide]: c.black, [other(G.blackSide)]: c.white };
  if (!animate) { ["A", "B"].forEach(s => { shown[s] = target[s]; $("cnt" + s).textContent = target[s]; }); return Promise.resolve(); }
  const steps = Math.max(...["A", "B"].map(s => Math.abs(target[s] - shown[s])));
  return new Promise(res => {
    let k = 0;
    const tick = () => {
      if (k++ >= steps) return res();
      ["A", "B"].forEach(s => { if (shown[s] !== target[s]) { shown[s] += Math.sign(target[s] - shown[s]); $("cnt" + s).textContent = shown[s]; } });
      setTimeout(tick, T.countStep * K());
    };
    tick();
  });
}
function paintSides() {
  ["A", "B"].forEach(s => {
    $("side" + s).querySelectorAll(".stone").forEach(e => { e.dataset.c = colorOf(s); });
    $("name" + s).textContent = nameOf(s);
  });
}

/* ---------- キャラクター（ことばのたね の原画をそのまま使う） ---------- */
const seat = { A: makeChar("shima"), B: makeChar("meebaa") };
const host = { pony: makeChar("pony"), kame: makeChar("kamejii") };
const all = [seat.A, seat.B, host.pony, host.kame];
// 進行役は下から顔を出す。wrap の位置と透明度だけを別に動かす。
Object.values(host).forEach(c => {
  const w = el("g", { opacity: 0 }, charLayer); w.appendChild(c.root);
  c.wrap = w; c.enter = new Spring(1, 90, 13); c.hidden = true;
});
const VOICE = { shima: { pitch: 1.45, rate: 1.05 }, meebaa: { pitch: 1.05, rate: .9 }, pony: { pitch: 1.3, rate: 1 }, kamejii: { pitch: .7, rate: .88 } };

function layout() {
  const W = innerWidth, H = innerHeight;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  const app = $("app").getBoundingClientRect(), portrait = matchMedia("(orientation: portrait), (max-aspect-ratio: 11/10)").matches;
  const bs = portrait ? Math.min(app.width - 32, (app.height - 24) * .64) : Math.min(app.height - 30, app.width - 2 * Math.max(230, app.width * .2) - 40);
  document.documentElement.style.setProperty("--bs", Math.max(240, Math.floor(bs)) + "px");
}
addEventListener("resize", layout);
function placeAll() {
  ["A", "B"].forEach(s => {
    const c = seat[s], r = $("slot" + s).getBoundingClientRect();
    const sc = Math.min(r.height / (c.base - c.top + 24), r.width / 285) * .98;
    place(c, r.left + r.width / 2, r.bottom - 2, Math.max(.12, sc));
  });
  const br = boardEl.getBoundingClientRect();
  Object.values(host).forEach(c => {
    const sc = br.height * .56 / (c.base - c.top);
    place(c, br.left + br.width / 2, br.bottom - br.height * .07, sc);
    const off = c.enter.v * br.height * .7;
    c.wrap.setAttribute("transform", `translate(0 ${off.toFixed(1)})`);
    c.wrap.setAttribute("opacity", Math.max(0, Math.min(1, 1 - c.enter.v * 1.3)).toFixed(3));
  });
}
async function showHost(c) { c.hidden = false; c.enter.t = 0; boardEl.classList.add("dim"); await wait(450); }
async function hideHost(c) { c.enter.t = 1; await wait(350); c.hidden = true; if (Object.values(host).every(h => h.hidden)) boardEl.classList.remove("dim"); }

/* ---------- 演技（同じものが続かないよう順送り） ---------- */
const mv = (c, id) => MOVES.find(m => m.id === id).play(c);
function shrug(c) { c.armL.t = -75; c.armR.t = 75; c.headRot.t = 10; c.mouthOpen.t = .15; later(1200, () => { c.armL.t = 0; c.armR.t = 0; c.headRot.t = 0; c.mouthOpen.t = 0; }); }
function upset(c) { c.headRot.t = -14; c.headY.t = -10; c.eyeY.t = -7; c.sadMouth = true; c.armL.t = 30; c.armR.t = -30; later(1300, () => { c.headRot.t = 0; c.headY.t = 0; c.eyeY.t = 0; c.sadMouth = false; c.armL.t = 0; c.armR.t = 0; }); }
function relieved(c) { c.happyOn = true; c.squash.t = .95; mv(c, "nod"); later(1200, () => { c.happyOn = false; c.squash.t = 1; }); }
const ACTS = {
  shima: {
    turn: [c => mv(c, "point"), c => jump(c, .55), c => mv(c, "look")],
    place: [c => joy(c), c => mv(c, "spin")],
    big: [c => mv(c, "dance"), c => mv(c, "laugh")],
    taken: [c => mv(c, "frustrated"), c => upset(c), c => mv(c, "frustrated")],
    invalid: [c => mv(c, "no")], pass: [shrug], undoMine: [relieved], undoOther: [c => surprise(c)],
    win: [c => mv(c, "pump")], lose: [c => mv(c, "cheer")],
  },
  meebaa: {
    turn: [c => mv(c, "nod"), c => mv(c, "look")],
    place: [c => mv(c, "nod"), c => mv(c, "clap")],
    big: [c => { surprise(c); later(700, () => mv(c, "clap")); }],
    taken: [shrug, c => mv(c, "laugh")],
    invalid: [c => mv(c, "no")], pass: [shrug], undoMine: [relieved], undoOther: [c => { mv(c, "nod"); }],
    win: [c => { mv(c, "clap"); later(800, () => mv(c, "heart")); }], lose: [c => mv(c, "cheer")],
  },
};
const actIdx = {};
function act(side, ev) {
  const c = seat[side], list = ACTS[c.kind][ev]; if (!list) return;
  const k = c.kind + ev, i = actIdx[k] || 0; actIdx[k] = i + 1;
  list[i % list.length](c);
}

/* ---------- 読み上げ（段階1は端末の音声合成。段階3で AivisSpeech／VOICEVOX の合成音声に差し替える） ---------- */
const bubble = $("bubble");
let jaVoice = null, talking = null;
function pickVoice() { const v = speechSynthesis?.getVoices?.() || []; jaVoice = v.find(x => /ja[-_]JP/i.test(x.lang) && /Kyoko|O-ren|Otoya/i.test(x.name)) || v.find(x => /^ja/i.test(x.lang)) || null; }
if ("speechSynthesis" in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function bubbleAt(c) {
  const p = headTop(c); bubble.style.left = Math.max(140, Math.min(innerWidth - 140, p.x)) + "px"; bubble.style.top = Math.max(90, p.y - 6) + "px";
}
function say(c, text, min = 0) {
  bubble.textContent = text; bubble.classList.add("on"); talking = c; bubbleAt(c);
  const fallback = 900 + text.length * 170;
  const t0 = performance.now();
  return new Promise(res => {
    let done = false;
    const end = () => { if (done) return; done = true; const left = Math.max(0, min - (performance.now() - t0)); setTimeout(() => { talking = null; c.speakingLevel = 0; bubble.classList.remove("on"); res(); }, left + 250); };
    if (CFG.voice && "speechSynthesis" in window) {
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text), v = VOICE[c.kind] || {};
        u.lang = "ja-JP"; if (jaVoice) u.voice = jaVoice; u.pitch = v.pitch || 1; u.rate = v.rate || 1; u.volume = [0, .45, .8, 1][CFG.voice];
        u.onend = end; u.onerror = end; speechSynthesis.speak(u);
        setTimeout(end, fallback + 2500);
      } catch (e) { setTimeout(end, fallback); }
    } else setTimeout(end, fallback);
  });
}

/* ---------- 紙吹雪 ---------- */
const paper = [];
function confettiAt(x, y, n = 60) {
  const cols = ["#FF6F91", "#FFD25E", "#7FCBF0", "#7CC36A", "#B9A8D9"]; n = Math.round(n * Math.max(.2, motion));
  for (let i = 0; i < n; i++) {
    const r = el("rect", { width: 14, height: 8, rx: 2, fill: cols[i % cols.length], stroke: INK, "stroke-width": 1.5 }, fxLayer);
    paper.push({ r, x, y, vx: (Math.random() - .5) * 700, vy: -500 - Math.random() * 500, a: Math.random() * 360, va: (Math.random() - .5) * 720, life: 2.2 });
  }
}
function stepConfetti(dt) {
  for (let i = paper.length - 1; i >= 0; i--) {
    const b = paper[i]; b.vy += 1300 * dt; b.vx *= .99; b.x += b.vx * dt; b.y += b.vy * dt; b.a += b.va * dt; b.life -= dt;
    b.r.setAttribute("transform", `translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) rotate(${b.a.toFixed(0)})`);
    if (b.life < 0 || b.y > innerHeight + 40) { b.r.remove(); paper.splice(i, 1); }
  }
}
function centerOf(e) { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height * .35]; }

/* ---------- 手番 ---------- */
let cur = replay([]);
function updateButtons() {
  ["A", "B"].forEach(s => { $("matta" + s).disabled = G.busy || G.ended || !undoDepth(G.hist, colorOf(s)); });
}
function setTurn(state, quiet) {
  cur = state;
  const side = sideOf(state.turn);
  ["A", "B"].forEach(s => $("side" + s).classList.toggle("active", s === side && !state.over));
  showHints(legalMoves(state.board, state.turn));
  G.busy = false; updateButtons();
  if (!quiet) { SFX.turn(); act(side, "turn"); }
}
async function afterMove(state) {
  if (state.over) return endGame(state);
  if (state.passed) {
    const ps = sideOf(state.passed);
    ["A", "B"].forEach(s => $("side" + s).classList.remove("active"));
    act(ps, "pass");
    await showHost(host.pony);
    await say(host.pony, `${nameOf(ps)}は おけるところが ないから パス！ ${nameOf(other(ps))}の ばん！`, T.passMin);
    await hideHost(host.pony);
  }
  setTurn(state);
}

async function tap(r, c) {
  if (G.busy || !G.started || G.ended) return;
  const moves = legalMoves(cur.board, cur.turn), side = sideOf(cur.turn);
  if (!moves.some(m => m.r === r && m.c === c)) { const b = cells[at(r, c)].b; b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); act(side, "invalid"); return; }
  G.busy = true; clearHints(); updateButtons();
  const p = cur.turn;
  G.hist.push([r, c]); saveGame();
  const next = replay(G.hist), step = next.steps.at(-1), k = K();
  SFX.place(); dropDisc(at(r, c), p); act(side, "place"); ringAt(at(r, c));
  await wait(T.flipStart * k);
  let longest = 0;
  step.flips.forEach(d => {
    longest = Math.max(longest, d.cells.length);
    d.cells.forEach(([y, x], j) => setTimeout(() => flipDisc(at(y, x), p, d.dir, T.flip * k), j * T.flipGap * k));
  });
  for (let j = 0; j < longest; j++) setTimeout(() => SFX.flip(j), j * T.flipGap * k + T.flip * k * .45);
  const n = flipCount(step.flips);
  setTimeout(() => act(other(side), "taken"), T.flip * k);
  await wait(((longest - 1) * T.flipGap + T.flip) * k);
  if (n >= 4) { SFX.sparkle(); act(side, "big"); confettiAt(...centerOf($("slot" + side)), 40); }
  await wait(T.afterFlip * k);
  await setCounts(next.board, true);
  await wait(T.toTurn * k);
  paint(next.board);
  afterMove(next);
}

async function undo(side) {
  if (G.busy || G.ended) return;
  const depth = undoDepth(G.hist, colorOf(side)); if (!depth) return;
  G.busy = true; clearHints(); updateButtons();
  ["A", "B"].forEach(s => $("side" + s).classList.remove("active"));
  act(side, "undoMine"); act(other(side), "undoOther");
  const k = K();
  for (let d = 0; d < depth; d++) {
    const step = replay(G.hist).steps.at(-1);
    SFX.swoosh();
    // 返したときと逆順に、逆回転でもどす
    const order = [];
    step.flips.forEach(f => f.cells.forEach(([y, x], j) => order.push({ i: at(y, x), j, dir: f.dir })));
    order.sort((a, b) => b.j - a.j);
    const back = step.player === BLACK ? WHITE : BLACK;
    const maxJ = order.length ? order[0].j : 0;
    order.forEach(o => setTimeout(() => flipDisc(o.i, back, [-o.dir[0], -o.dir[1]], T.undoFlip * k), (maxJ - o.j) * T.undoGap * k));
    await wait((maxJ * T.undoGap + T.undoFlip) * k);
    const pi = at(step.r, step.c);
    await cells[pi].disc.animate([{ transform: "none", opacity: 1 }, { transform: "translateY(-30%) scale(1.25)", opacity: 0 }], { duration: 250 * k, easing: "ease-in" }).finished;
    setDisc(pi, EMPTY);
    G.hist.pop(); haloFor(G.hist);
    await setCounts(replay(G.hist).board, true);
  }
  saveGame();
  const s = replay(G.hist); paint(s.board);
  await wait(250 * k);
  setTurn(s);
}
$("mattaA").addEventListener("click", () => undo("A"));
$("mattaB").addEventListener("click", () => undo("B"));

/* ---------- 終局 ---------- */
async function endGame(state) {
  G.ended = true; G.busy = true; updateButtons(); clearHints();
  ["A", "B"].forEach(s => $("side" + s).classList.remove("active"));
  const c = count(state.board);
  await showHost(host.kame);
  // 色ごとに集めて並べなおす（くろは左上から、しろは右下から）
  const sorted = new Array(64).fill(EMPTY);
  for (let i = 0; i < c.black; i++) sorted[i] = BLACK;
  for (let i = 0; i < c.white; i++) sorted[63 - i] = WHITE;
  SFX.gather(T.gather / 1000);
  cells.forEach(x => x.disc.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(.6)" }], { duration: 400, fill: "forwards" }));
  await wait(450);
  cells.forEach((x, i) => { x.disc.getAnimations().forEach(a => a.cancel()); setDisc(i, sorted[i]); x.disc.style.opacity = 0; });
  sorted.forEach((v, i) => { if (!v) return; const d = (v === BLACK ? i : 63 - i) * (T.gather - 600) / 64; setTimeout(() => { const x = cells[i]; x.disc.style.opacity = ""; x.disc.animate([{ opacity: 0, transform: "scale(.5)" }, { opacity: 1, transform: "none" }], { duration: 220 }); }, d); });
  await wait(T.gather - 300);
  await say(host.kame, `くろが ${c.black}こ、しろが ${c.white}こ`);
  const win = c.black === c.white ? null : sideOf(c.black > c.white ? BLACK : WHITE);
  if (win) {
    SFX.fanfare(false); act(win, "win"); act(other(win), "lose"); confettiAt(...centerOf($("slot" + win)), 80);
    await say(host.kame, `${nameOf(win)}の かち！`);
  } else {
    SFX.fanfare(true); act("A", "win"); act("B", "win");
    await say(host.kame, "おなじ かず！ ひきわけ！");
  }
  await hideHost(host.kame);
  await showHost(host.pony);
  say(host.pony, "もういっかい やる？", 1500);
  $("againOv").hidden = false;
}
$("againBtn").addEventListener("click", async () => {
  $("againOv").hidden = true; await hideHost(host.pony);
  G.blackSide = other(G.blackSide);
  newGame();
});

async function newGame(announce = true) {
  G.hist = []; G.ended = false; G.busy = true; saveGame(); clearHalo();
  cur = replay([]); paintSides(); paint(cur.board); setCounts(cur.board, false); updateButtons();
  if (announce) {
    await showHost(host.kame);
    act("A", "turn"); act("B", "turn");
    await say(host.kame, "はじめ！ さきは くろ からだよ");
    await hideHost(host.kame);
  }
  setTurn(cur);
}

/* ---------- 設定（盤の外を3秒ながおし） ---------- */
const setPanel = $("settings");
function syncPanel() {
  setPanel.querySelectorAll(".seg").forEach(seg => seg.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.v === +CFG[seg.dataset.key]))));
  $("resetBtn").textContent = "さいしょから"; $("resetBtn").classList.remove("confirm");
}
setPanel.querySelectorAll(".seg").forEach(seg => seg.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  CFG[seg.dataset.key] = +b.dataset.v; saveCfg(); syncPanel();
  if (seg.dataset.key === "hints" && !G.busy && G.started && !G.ended) showHints(legalMoves(cur.board, cur.turn));
  if (seg.dataset.key === "sfx") SFX.turn();
}));
$("closeBtn").addEventListener("click", () => { setPanel.hidden = true; });
$("resetBtn").addEventListener("click", () => {
  const b = $("resetBtn");
  if (!b.classList.contains("confirm")) { b.textContent = "もういちど おすと さいしょから"; b.classList.add("confirm"); return; }
  setPanel.hidden = true; $("againOv").hidden = true; host.pony.enter.t = 1; host.pony.hidden = true; boardEl.classList.remove("dim");
  if (G.started) newGame();
});
let pressT = null;
document.addEventListener("pointerdown", e => {
  if (e.target.closest("button, input, .panel, #board")) return;
  clearTimeout(pressT); pressT = setTimeout(() => { syncPanel(); setPanel.hidden = false; }, 3000);
});
["pointerup", "pointercancel", "pointerleave"].forEach(t => document.addEventListener(t, () => clearTimeout(pressT)));

/* ---------- 画面を消さない ---------- */
let lock = null;
async function keepAwake() { try { lock = await navigator.wakeLock?.request("screen"); } catch (e) { lock = null; } }
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && G.started) keepAwake(); });

/* ---------- はじめる ---------- */
$("startBtn").addEventListener("click", async () => {
  audio(); SFX.turn();
  try { if ("speechSynthesis" in window) { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; speechSynthesis.speak(u); } } catch (e) { /* 読み上げなしでも遊べる */ }
  $("startOv").hidden = true; G.started = true; keepAwake();
  const saved = G.hist.length > 0;
  if (saved) { const s = replay(G.hist); paint(s.board); setCounts(s.board, false); s.over ? endGame(s) : setTurn(s); }
  else newGame();
});

/* ---------- 起動：前回の続き、または確認用の局面（#pass / #end） ---------- */
(function boot() {
  const saved = load(GAME_KEY), tag = location.hash.slice(1);
  if (FIX[tag]) { G.hist = FIX[tag].slice(); G.blackSide = "A"; }
  else if (saved && Array.isArray(saved.hist)) {
    try { replay(saved.hist); G.hist = saved.hist; G.blackSide = saved.blackSide === "B" ? "B" : "A"; } catch (e) { G.hist = []; }
  }
  window.claude?.hot?.snapshot?.(() => ({ hist: G.hist, blackSide: G.blackSide }));
  const hd = window.claude?.hot?.data;
  if (hd && Array.isArray(hd.hist)) { try { replay(hd.hist); G.hist = hd.hist; G.blackSide = hd.blackSide; } catch (e) { /* 保存がこわれていたら最初から */ } }
  const s = replay(G.hist); cur = s;
  paintSides(); paint(s.board); setCounts(s.board, false); haloFor(G.hist);
  layout(); placeAll();
})();

/* ---------- 毎フレーム ---------- */
let last = performance.now();
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  placeAll();
  all.forEach(c => {
    if (talking === c) c.speakingLevel = .3 + .4 * Math.abs(Math.sin(now / 70));
    if (c.enter) c.enter.step(dt);
    drawChar(c, dt, false);
  });
  idleTick(seat.A, dt, G.busy); idleTick(seat.B, dt, G.busy);
  if (talking) bubbleAt(talking);
  stepMarks(dt); stepConfetti(dt);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
