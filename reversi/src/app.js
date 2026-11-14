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
const CFG = Object.assign({ slow: 0, hints: 1, sfx: 2, voice: 2, autoOk: 1, relay: 0, fx: 2, devUnlock: 0, myName: "", hasPartner: 0 }, load(CFG_KEY) || {});
const saveCfg = () => keep(CFG_KEY, CFG);

/* ---------- 対局の状態 ---------- */
// A = こども（左）、B = おばあちゃん（右）。blackSide が くろ（先手）の側。対局ごとに交代する。
const G = { hist: [], blackSide: "A", busy: true, started: false, ended: false, paused: false, animating: false, readyMe: false, readyThem: false, theirUnlocked: false, pendingRematch: false };
// 遠隔対戦では、この端末が受け持つ側だけを操作できる（ホスト＝こども A、ゲスト＝おばあちゃん B）
const SOLO = () => !NET.role;
const mySide = () => (NET.role === "guest" ? "B" : "A");
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
    { transform: "translateY(-30%) scale(1.22)", opacity: 0, filter: "drop-shadow(0 18px 10px rgba(0,0,0,.25))" },
    { transform: "translateY(0) scale(1)", opacity: 1, filter: "drop-shadow(0 0 0 rgba(0,0,0,0))", offset: .7 },
    { transform: "translateY(0) scale(.97)", opacity: 1, offset: .82 },
    { transform: "none", opacity: 1 },
  ], { duration: T.drop * K(), easing: "cubic-bezier(.4,0,.6,1)" });
}
// 方向に合わせた軸でくるっと返す（横に並ぶ石はたて軸、たてに並ぶ石はよこ軸）
/* 返すときだけ、厚みのある円柱（表の面・裏の面・側面24枚）を組み立てて回す。
   側面は本物の石と同じく半分ずつ黒と白。光の向きに合わせて明暗をつける。 */
const FACE = { 1: "#1F1F23", 2: "#F4F1E8" }, EDGE = { 1: [46, 46, 52], 2: [208, 204, 192] };
const SEG = 32, THICK = .17;   // 本物の石は 直径34mm・厚さ約6mm
const shade = (rgb, k) => `rgb(${rgb.map(v => Math.round(Math.min(255, v * k))).join(",")})`;
function makeCylinder(from, to, D) {
  const H = D * THICK, w = Math.PI * D / SEG * 1.12;
  const cy = document.createElement("span"); cy.className = "cyl";
  const front = document.createElement("span"); front.className = "f"; front.dataset.c = from; front.style.transform = `translateZ(${H / 2}px)`;
  const back = document.createElement("span"); back.className = "f"; back.dataset.c = to; back.style.transform = `rotateY(180deg) translateZ(${H / 2}px)`;
  for (let k = 0; k < SEG; k++) {
    const ang = k * 360 / SEG, light = .58 + .55 * Math.max(0, Math.cos((ang - 200) * Math.PI / 180));
    const e = document.createElement("span"); e.className = "edge";
    e.style.cssText = `width:${w}px;height:${H}px;margin:${-H / 2}px 0 0 ${-w / 2}px;transform:rotateZ(${ang}deg) translateY(${D / 2 - .6}px) rotateX(90deg);` +
      `background:linear-gradient(to bottom, ${shade(EDGE[to], light)} 0 50%, ${shade(EDGE[from], light)} 50% 100%)`;
    e.appendChild(document.createElement("i"));   // ふちの丸み（上下が少し暗く、中ほどが明るい）
    cy.appendChild(e);
  }
  cy.append(back, front);
  return cy;
}
function flipDisc(i, to, dir, dur) {
  const x = cells[i], ax = -dir[0], ay = dir[1], from = +x.disc.dataset.c || (to === BLACK ? WHITE : BLACK);
  const D = x.disc.offsetWidth, cy = makeCylinder(from, to, D);
  const sh = document.createElement("span"); sh.className = "cylShadow";
  x.b.appendChild(sh); x.b.appendChild(cy); x.disc.style.visibility = "hidden";
  // 影：石が立つほど細く、浮くぶん少し大きく薄く
  const vert = Math.abs(ax) > Math.abs(ay);
  sh.animate([
    { transform: "translateY(var(--e)) scale(1, 1)", opacity: 1 },
    { transform: `translateY(calc(var(--e) * 3)) scale(${vert ? 1.15 : .3}, ${vert ? .3 : 1.15})`, opacity: .55 },
    { transform: "translateY(var(--e)) scale(1, 1)", opacity: 1 },
  ], { duration: dur, easing: "ease-in-out", fill: "forwards" });
  const a = cy.animate([
    { transform: `rotate3d(${ax}, ${ay}, 0, 0deg) scale(1)` },
    { transform: `rotate3d(${ax}, ${ay}, 0, 90deg) scale(1.22)` },
    { transform: `rotate3d(${ax}, ${ay}, 0, 180deg) scale(1)` },
  ], { duration: dur, easing: "ease-in-out", fill: "forwards" });
  a.onfinish = () => { x.fa.dataset.c = to; x.fb.dataset.c = to; x.disc.dataset.c = to; x.disc.style.visibility = ""; cy.remove(); sh.remove(); };
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
  const br = boardEl.getBoundingClientRect(); boardH = br.height;
  Object.values(host).forEach(c => {
    const sc = br.height * .56 / (c.base - c.top);
    place(c, br.left + br.width / 2, br.bottom - br.height * .07, sc);
    c._wk = "";
  });
  placeHosts();
}
let boardH = 600;
// 盤の上に出てくるキャラ（ぽにー・かめじい）：出入りの位置と透明度だけ 毎フレーム。
// かくれて止まっているときは 描かない（display:none）
function placeHosts() {
  Object.values(host).forEach(c => {
    const off = c.enter.v * boardH * .7, op = Math.max(0, Math.min(1, 1 - c.enter.v * 1.3));
    const away = c.hidden && op <= 0.001 && Math.abs(c.enter.vel) < .01;
    const key = away ? "away" : off.toFixed(1) + "/" + op.toFixed(3);
    if (key === c._wk) return; c._wk = key;
    c.wrap.style.display = away ? "none" : "";
    if (!away) { c.wrap.setAttribute("transform", `translate(0 ${off.toFixed(1)})`); c.wrap.setAttribute("opacity", op.toFixed(3)); }
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
let keepBubble = null;
function hideBubble() { keepBubble = null; bubble.classList.remove("on"); }
function bubbleAt(c) {
  const p = headTop(c); bubble.style.left = Math.max(140, Math.min(innerWidth - 140, p.x)) + "px"; bubble.style.top = Math.max(90, p.y - 6) + "px";
}
/* 合成した声（voice/out/*.mp3）。ぽにー＝VOICEVOX 調整版、かめじい＝AivisSpeech。
   ファイルがないとき（1枚だけの確認版など）は、端末の読み上げにまかせる。 */
const VOICE_DIR = "voice/out/", vbuf = {};
const vload = {};
// 声の読みこみは 音の出口（AudioContext）を使わず、オフライン用の箱で行う＝さわる前（開始画面）から読みはじめられる
let dec = null;
function decoder() {
  if (dec) return dec;
  const O = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  try { dec = O ? new O(1, 1, 44100) : audio(); } catch (e) { dec = audio(); }
  return dec;
}
// 同じ声を2回読まない。読みかけなら その読みこみを待つ（前は 読みかけだと すぐ null を返していて、待てていなかった）
function loadVoice(key) {
  if (vbuf[key]) return Promise.resolve(vbuf[key]);
  if (vload[key]) return vload[key];
  return vload[key] = (async () => {
    try {
      const r = await fetch(VOICE_DIR + key + ".mp3"); if (!r.ok) throw new Error("http " + r.status);
      const data = await r.arrayBuffer();
      vbuf[key] = await new Promise((ok, ng) => decoder().decodeAudioData(data, ok, ng));
    } catch (e) { vbuf[key] = null; SOUND.voiceErr = key + ":" + String(e && e.message || e).slice(0, 40); delete vload[key]; }
    return vbuf[key];
  })();
}
// 数の声（くろが Nこ…）は 終局のときに 2本だけ読む。ほかは はじめに読んでおく
// はじめの「くろからだよ」（rv_start）を先に読み、残りは そのあと（いっせいに読むと 最初の声が間に合わず、端末の別の声になった 2026-11-14）
let preloading = null;
const PRE_KEYS = () => ["rv_start", ...Object.keys(VOICE_TEXT).filter(k => k !== "rv_start" && !/^rv_[ks]\d+$/.test(k))];
const VLOAD = { done: 0, total: 0 };
const preloadVoices = () => preloading || (preloading = (async () => {
  const keys = PRE_KEYS(); VLOAD.total = keys.length;
  await loadVoice(keys[0]); VLOAD.done = 1;
  await Promise.all(keys.slice(1).map(k => loadVoice(k).then(() => { VLOAD.done++; })));
})());
/* 2026-11-14：はじまる前に 声がそろっていなければ「じゅんびちゅう」の画面（石がくるくる返る・進みぐあい）を出して待つ。
   ふつうは 開始画面を見ているあいだに 読みおわるので、出ることは少ない */
async function voicesReady() {
  if (!CFG.voice) return;
  const p = preloadVoices();
  if (VLOAD.total && VLOAD.done >= VLOAD.total) return;
  const ov = $("loadOv"), bar = $("loadBar"), pct = $("loadPct");
  let shown = false;
  const showT = setTimeout(() => { shown = true; ov.hidden = false; }, 250);   // すぐ終わるときは 出さない
  const tick = setInterval(() => { const r = VLOAD.total ? VLOAD.done / VLOAD.total : 0; bar.style.width = Math.round(r * 100) + "%"; pct.textContent = Math.round(r * 100) + "%"; }, 100);
  await Promise.race([p, wait(15000)]);
  clearTimeout(showT); clearInterval(tick);
  if (shown) { bar.style.width = "100%"; pct.textContent = "100%"; await wait(350); ov.hidden = true; }
}
function playBuf(buf) {
  return new Promise(res => {
    const s = ctx.createBufferSource(), g = ctx.createGain();
    s.buffer = buf; g.gain.value = [0, .5, .85, 1.2][CFG.voice]; s.connect(g).connect(OUTN());
    s.onended = res; s.start(); setTimeout(res, buf.duration * 1000 + 400);
  });
}
// key（または key の並び）で話す。文は VOICE_TEXT から
async function speak(c, keys, min = 0, keep = false) {
  keys = [].concat(keys);
  // まだ読みこめていない声は 少しだけ待つ（端末の読み上げに なるのを さける）
  if (CFG.voice && keys.some(k => !vbuf[k])) await Promise.race([Promise.all(keys.map(loadVoice)), wait(4000)]);
  return say(c, keys.map(k => VOICE_TEXT[k] || "").join(" ").replace(/、 /g, "、"), min, keep, keys);
}
function say(c, text, min = 0, keep = false, keys = null) {
  bubble.textContent = text; bubble.classList.add("on"); talking = c; bubbleAt(c);
  const fallback = 900 + text.length * 170;
  const t0 = performance.now();
  return new Promise(res => {
    let done = false;
    const end = () => { if (done) return; done = true; const left = Math.max(0, min - (performance.now() - t0)); setTimeout(() => { talking = null; c.speakingLevel = 0; if (!keep) bubble.classList.remove("on"); else keepBubble = c; res(); }, left + 250); };
    const bufs = keys ? keys.map(k => vbuf[k]) : [];
    if (CFG.voice && keys && bufs.every(Boolean)) {
      (async () => { for (const b of bufs) await playBuf(b); end(); })();
    } else if (CFG.voice && "speechSynthesis" in window) {
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
function cellCenter(i) { const r = cells[i].b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
function centerOf(e) { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height * .35]; }

/* ---------- 手番 ---------- */
let cur = replay([]);
function updateButtons() {
  ["A", "B"].forEach(s => {
    const b = $("matta" + s);
    b.hidden = !SOLO() && s !== mySide();
    b.disabled = G.busy || G.ended || G.paused || !undoDepth(G.hist, colorOf(s));
  });
}
let nudgeT = null;
function clearNudge() { clearTimeout(nudgeT); nudgeT = null; cells.forEach(x => x.b.classList.remove("nudge")); }
function armNudge(side) {
  clearNudge();
  nudgeT = setTimeout(() => {
    if (G.busy || G.ended || G.paused) return;
    act(side, "turn"); cells.forEach(x => { if (x.b.classList.contains("can")) x.b.classList.add("nudge"); });
    nudgeT = setTimeout(() => armNudge(side), 25000);
  }, 18000);
}
function setTurn(state, quiet) {
  cur = state; clearNudge();
  const side = sideOf(state.turn);
  ["A", "B"].forEach(s => $("side" + s).classList.toggle("active", s === side && !state.over));
  if (SOLO() || side === mySide()) showHints(legalMoves(state.board, state.turn)); else clearHints();
  G.busy = false; G.animating = false; updateButtons();
  if (!quiet) act(side, "turn");
  if (!state.over && (SOLO() || side === mySide())) armNudge(side);
}
async function afterMove(state) {
  if (state.over) return endGame(state);
  if (state.passed) {
    const ps = sideOf(state.passed);
    ["A", "B"].forEach(s => $("side" + s).classList.remove("active"));
    act(ps, "pass");
    await showHost(host.pony);
    await speak(host.pony, "rv_pass_" + (colorOf(ps) === BLACK ? "k" : "s"), T.passMin);
    await hideHost(host.pony);
  }
  setTurn(state);
}

function shakeCell(r, c) {
  clearNudge(); const b = cells[at(r, c)].b; b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); }
async function tap(r, c) {
  if (G.busy || !G.started || G.ended || G.paused) return;
  const moves = legalMoves(cur.board, cur.turn), side = sideOf(cur.turn);
  if (!SOLO() && side !== mySide()) { shakeCell(r, c); return; }   // 相手の番
  if (!moves.some(m => m.r === r && m.c === c)) { shakeCell(r, c); act(side, "invalid"); return; }
  NET.send({ t: "move", r, c, n: G.hist.length });
  playMove(r, c);
}
async function playMove(r, c) {
  const side = sideOf(cur.turn);
  G.busy = true; G.animating = true; clearHints(); clearNudge(); updateButtons();
  const p = cur.turn;
  G.hist.push([r, c]); saveGame();
  const next = replay(G.hist), step = next.steps.at(-1), k = K();
  SFX.place(); dropDisc(at(r, c), p); act(side, "place"); ringAt(at(r, c));
  await wait(T.flipStart * k);
  // 返す石を 1列に ならべ（置いた石に近い順）、1枚ずつ 返す。だんだん 速く、演出は だんだん 豪華に。
  // 最後の1枚が いちばんの 見せ場（置いた石そのものは はじけない）
  const seq = [];
  step.flips.forEach(d => d.cells.forEach(([y, x], j) => seq.push({ i: at(y, x), j, dir: d.dir })));
  seq.sort((a, b) => a.j - b.j);
  const n = seq.length;
  let tm = 0;
  seq.forEach((s, m) => {
    const L = m + 1, last = L === n;
    setTimeout(() => {
      flipDisc(s.i, p, s.dir, T.flip * k);
      setTimeout(() => {
        SFX.flip(m, n);
        if (last) FX.climax(...cellCenter(s.i), n, p, $("cnt" + side), boardEl);
        else FX.flipHit(...cellCenter(s.i), L, n, p, boardEl);
      }, T.flip * k * .45);
    }, tm);
    if (!last) tm += Math.max(T.flipGap * .55, T.flipGap * (1.15 - m * .05)) * k;
  });
  setTimeout(() => act(other(side), "taken"), T.flip * k);
  await wait(tm + T.flip * k);
  const tier = FX.tierOf(n);
  if (tier >= 3) act(side, "big");
  if (tier >= 3) confettiAt(...centerOf($("slot" + side)), 20 + tier * 10);
  if (tier >= 4) await wait(600 * k);
  await wait(T.afterFlip * k);
  await setCounts(next.board, true);
  await wait(T.toTurn * k);
  paint(next.board);
  await afterMove(next);
  G.animating = false;
}

async function animUndo(side, depth) {
  G.busy = true; G.animating = true; clearHints(); updateButtons(); hideBubble();
  ["A", "B"].forEach(s => $("side" + s).classList.remove("active"));
  act(side, "undoMine"); act(other(side), "undoOther");
  const k = K();
  for (let d = 0; d < depth; d++) {
    const step = replay(G.hist).steps.at(-1);
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
/* まった：自分の手の直後なら すぐもどす。相手が打ったあとなら、相手の「いいよ」で2手もどす。
   こどもからの まったは、設定「あいては じどうで いいよ」なら きかずに もどす。 */
let undoTimer = null;
function requestUndo(side) {
  if (G.busy || G.ended || G.paused) return;
  const depth = undoDepth(G.hist, colorOf(side)); if (!depth) return;
  if (SOLO() || depth === 1 || (side === "A" && CFG.autoOk)) { NET.send({ t: "undo", side, depth, n: G.hist.length }); animUndo(side, depth); return; }
  G.busy = true; updateButtons(); clearHints();
  NET.send({ t: "undoReq", side, n: G.hist.length });
  showHost(host.pony).then(() => speak(host.pony, "rv_wait", 0, true));
  undoTimer = setTimeout(() => { NET.send({ t: "undoCancel" }); undoRefused(side); }, 10000);
}
async function undoRefused(side) {
  clearTimeout(undoTimer); act(side, "pass");
  if (host.pony.hidden) await showHost(host.pony);
  await speak(host.pony, "rv_refused");
  await hideHost(host.pony); setTurn(cur, true);
}
let askTimer = null, askFor = null;
async function askUndo(m) {
  G.busy = true; askFor = m; updateButtons(); clearHints();
  await showHost(host.pony);
  speak(host.pony, "rv_matta_" + (colorOf(m.side) === BLACK ? "k" : "s"), 0, true);
  $("askOv").hidden = false;
  askTimer = setTimeout(() => answerUndo(false), 10000);
}
async function answerUndo(ok) {
  if (!askFor) return;
  const m = askFor; askFor = null; clearTimeout(askTimer); $("askOv").hidden = true; hideBubble();
  NET.send({ t: "undoAns", ok, n: m.n });
  await hideHost(host.pony);
  if (ok && m.n === G.hist.length) animUndo(m.side, undoDepth(G.hist, colorOf(m.side)));
  else setTurn(cur, true);
}
$("okBtn").addEventListener("click", () => answerUndo(true));
$("ngBtn").addEventListener("click", () => answerUndo(false));
$("mattaA").addEventListener("click", () => requestUndo("A"));
$("mattaB").addEventListener("click", () => requestUndo("B"));

/* ---------- 終局 ---------- */
async function endGame(state) {
  G.ended = true; G.busy = true; updateButtons(); clearHints();
  ["A", "B"].forEach(s => $("side" + s).classList.remove("active"));
  const c = count(state.board);
  const countVoice = Promise.all([loadVoice(`rv_k${c.black}`), loadVoice(`rv_s${c.white}`)]);
  await showHost(host.kame);
  // 色ごとに集めて並べなおす（くろは左上から、しろは右下から）
  const sorted = new Array(64).fill(EMPTY);
  for (let i = 0; i < c.black; i++) sorted[i] = BLACK;
  for (let i = 0; i < c.white; i++) sorted[63 - i] = WHITE;
  cells.forEach(x => x.disc.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(.6)" }], { duration: 400, fill: "forwards" }));
  await wait(450);
  cells.forEach((x, i) => { x.disc.getAnimations().forEach(a => a.cancel()); setDisc(i, sorted[i]); x.disc.style.opacity = 0; });
  sorted.forEach((v, i) => { if (!v) return; const d = (v === BLACK ? i : 63 - i) * (T.gather - 600) / 64; setTimeout(() => { const x = cells[i]; x.disc.style.opacity = ""; x.disc.animate([{ opacity: 0, transform: "scale(.5)" }, { opacity: 1, transform: "none" }], { duration: 220 }); }, d); });
  await wait(T.gather - 300);
  await Promise.race([countVoice, wait(3000)]);
  await speak(host.kame, [`rv_k${c.black}`, `rv_s${c.white}`]);
  const win = c.black === c.white ? null : sideOf(c.black > c.white ? BLACK : WHITE);
  if (win) {
    act(win, "win"); act(other(win), "lose"); confettiAt(...centerOf($("slot" + win)), 80);
    FX.victory($("side" + win).getBoundingClientRect(), false); $("side" + win).classList.add("winner");
    await speak(host.kame, "rv_win_" + (colorOf(win) === BLACK ? "k" : "s"));
  } else {
    act("A", "win"); act("B", "win"); FX.victory(null, true);
    await speak(host.kame, "rv_draw");
  }
  await hideHost(host.kame);
  await showHost(host.pony);
  speak(host.pony, "rv_again", 1500);
  $("againOv").hidden = false;
}
async function rematch() {
  ["A", "B"].forEach(s => $("side" + s).classList.remove("winner"));
  G.readyMe = G.readyThem = false; $("againBtn").disabled = false; $("againBtn").textContent = "もういっかい";
  $("againOv").hidden = true; await hideHost(host.pony);
  G.blackSide = other(G.blackSide);
  if (NET.role === "host") {
    if (!remoteAllowed()) { G.pendingRematch = true; lockBoth(); return; }
    countGame();
  }
  newGame();
}
$("againBtn").addEventListener("click", () => {
  if (SOLO()) return rematch();
  G.readyMe = true; NET.send({ t: "again" });
  if (G.readyThem) return rematch();
  $("againBtn").disabled = true; $("againBtn").textContent = "あいてを まってるよ";
});

async function newGame(announce = true) {
  G.hist = []; G.ended = false; G.busy = true; G.animating = true; saveGame(); clearHalo();
  cur = replay([]); paintSides(); paint(cur.board); setCounts(cur.board, false); updateButtons();
  if (announce) {
    await voicesReady();
    await showHost(host.kame);
    act("A", "turn"); act("B", "turn");
    await speak(host.kame, "rv_start");
    await hideHost(host.kame);
  }
  setTurn(cur);
}

/* ---------- 設定（盤の外を3秒ながおし） ---------- */
const setPanel = $("settings");
function syncPanel() {
  setPanel.querySelectorAll(".seg").forEach(seg => seg.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.v === +CFG[seg.dataset.key]))));
  $("resetBtn").textContent = "さいしょから"; $("resetBtn").classList.remove("confirm"); refreshLeft();
  $("newRoomBtn").textContent = "あたらしい部屋にする（リンクを作りなおす）"; $("newRoomBtn").classList.remove("confirm");
  $("partnerInfo").textContent = (CFG.hasPartner ? "相手は登録ずみ（「とおくの ひとと あそぶ」で すぐ待ち受けます）。" : "相手はまだ登録されていません（リンクを開いてつながると登録されます）。") + (partners.list.length ? ` この端末に登録した相手：${partners.list.map(p => p.name).join("、")}` : "");
  $("forgetBtn").hidden = !partners.list.length; $("forgetBtn").textContent = "この端末に登録した相手を けす";
  $("sndInfo").textContent = soundInfo();
  $("routeInfo").textContent = NET.open && NET.via ? `いまのつながり：${NET.via}` : (CFG.relay ? "「中継だけ」は、つぎに「とおくの ひとと あそぶ」を押したときから使います" : "");
}
setPanel.querySelectorAll(".seg").forEach(seg => seg.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  CFG[seg.dataset.key] = +b.dataset.v; saveCfg(); syncPanel();
  if (seg.dataset.key === "hints" && !G.busy && G.started && !G.ended) showHints(legalMoves(cur.board, cur.turn));
  if (seg.dataset.key === "sfx") SFX.place();   // 音の大きさの ためし
  if (seg.dataset.key === "devUnlock") { refreshLeft(); if (NET.open) { sendLic(); if (NET.role === "host") recheckLock(); } }
}));
$("closeX").addEventListener("click", () => { setPanel.hidden = true; });
$("closeBtn").addEventListener("click", () => { setPanel.hidden = true; });
/* なまえの画面：自分の名前（相手の画面の「○○と 対戦する」に出る）と、この端末に登録した相手の名前を変えられる。
   開始画面の「なまえ」ボタン、設定の「名前を変える」から。名前が未設定のまま「たいせんあいてを よぶ」を押したときも先に出す */
let nameNext = null;
function showNames(next) {
  nameNext = next || null;
  $("myName").value = CFG.myName || "";
  $("myNameRow").hidden = NET.role === "guest" && !!NET.room && !CFG.myName;
  const box = $("partnerNames"); box.innerHTML = "";
  partners.list.forEach((p, i) => {
    const l = document.createElement("label"); l.className = "nameRow";
    l.innerHTML = `あいての なまえ（${i + 1}人め）`;
    const inp = document.createElement("input"); inp.type = "text"; inp.maxLength = 10; inp.autocomplete = "off"; inp.value = p.name;
    inp.addEventListener("input", () => { p.name = inp.value.trim().slice(0, 10) || "たいせんあいて"; partners.save(); renderPartners(); });
    l.appendChild(inp); box.appendChild(l);
  });
  callers.list.forEach((p, i) => {
    const l = document.createElement("label"); l.className = "nameRow";
    l.innerHTML = `よびだす あいての なまえ（${i + 1}人め）`;
    const inp = document.createElement("input"); inp.type = "text"; inp.maxLength = 10; inp.autocomplete = "off"; inp.value = p.name;
    inp.addEventListener("input", () => { p.name = inp.value.trim().slice(0, 10) || "あいて"; callers.save(); renderPartners(); });
    l.appendChild(inp); box.appendChild(l);
  });
  $("nameOv").hidden = false;
  if (!$("myNameRow").hidden) setTimeout(() => $("myName").focus(), 50);
}
$("myName").addEventListener("input", e => { CFG.myName = e.target.value.trim().slice(0, 10); saveCfg(); renderNameBtn(); });
$("nameOk").addEventListener("click", () => { $("nameOv").hidden = true; const f = nameNext; nameNext = null; if (f) f(); });
function renderNameBtn() { $("nameBtn2").textContent = CFG.myName ? `なまえを かえる（いま：${CFG.myName}）` : "なまえを きめる"; }
$("nameBtn2").addEventListener("click", () => { setPanel.hidden = true; showNames(() => { renderNameBtn(); }); });
$("newRoomBtn").addEventListener("click", () => {
  const b = $("newRoomBtn");
  if (!b.classList.contains("confirm")) { b.textContent = "もういちど おすと 作りなおします（古いリンクは使えなくなります）"; b.classList.add("confirm"); return; }
  CFG.hasPartner = 0; saveCfg(); callers.list = []; callers.save(); setPanel.hidden = true; callGrandma(true);
});
$("forgetBtn").addEventListener("click", () => { partners.list = []; partners.save(); callers.list = []; callers.save(); CFG.hasPartner = 0; saveCfg(); renderPartners(); renderPush(); $("forgetBtn").textContent = "けしました"; });
$("resetBtn").addEventListener("click", () => {
  const b = $("resetBtn");
  if (!b.classList.contains("confirm")) { b.textContent = "もういちど おすと さいしょから"; b.classList.add("confirm"); return; }
  setPanel.hidden = true; $("againOv").hidden = true; host.pony.enter.t = 1; host.pony.hidden = true; boardEl.classList.remove("dim");
  if (G.started) newGame();
});
$("adultBtn").addEventListener("click", () => { syncPanel(); renderPush(); setPanel.hidden = false; });
// アプリ版では テスト用の設定（中継だけ・テスト用に解放）と Web だけの案内を出さない
if (window.RVNative) document.querySelectorAll("[data-key=relay], [data-key=devUnlock]").forEach(el => { const row = el.closest(".row"); if (row) row.hidden = true; const h = row && row.previousElementSibling; if (h && h.tagName === "H3" && h.textContent.includes("テスト")) h.hidden = true; });
// アプリ版：まだ使えない・関係のない欄は見せない（課金の準備中は「遠隔対戦」の欄ごと、通知の準備前は「よびだし」の欄ごと）
const hideSection = (rowEl) => { const row = rowEl && rowEl.closest(".row"); if (!row) return; row.hidden = true; const h = row.previousElementSibling; if (h && h.tagName === "H3") h.hidden = true; };
if (window.RVNative) { if (!window.MarushimaIAP) hideSection($("remoteInfo")); if (window.RVNative.push === false) hideSection($("pushInfo")); }

/* ---------- 画面を消さない ---------- */
let lock = null;
// iPadOS 16.4 より前は Wake Lock がないので、音なしの小さな動画を くりかえし流して 画面が消えるのを ふせぐ（NoSleep と同じ方法）
let sleepVid = null;
function keepAwakeVideo() {
  if (!sleepVid) {
    sleepVid = document.createElement("video");
    Object.assign(sleepVid, { src: "lib/nosleep.mp4", muted: true, loop: true, playsInline: true });
    sleepVid.setAttribute("playsinline", ""); sleepVid.setAttribute("muted", "");
    sleepVid.style.cssText = "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:0;top:0";
    document.body.appendChild(sleepVid);
    setInterval(() => { if (sleepVid && !sleepVid.paused && sleepVid.currentTime > 1) sleepVid.currentTime = 0; }, 15000);
  }
  sleepVid.play().catch(() => { });
}
async function keepAwake() {
  if (window.RVNative) return;   // アプリ版は殻（expo-keep-awake）がやる
  try { lock = await navigator.wakeLock.request("screen"); } catch (e) { lock = null; }
  if (!lock) keepAwakeVideo();
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && G.started) keepAwake(); });

/* ---------- はじめる ---------- */
/* 鳴らす音は「置く音」「返す音」「返すときの演出の音（と花火）」だけ（2026-11-03 あまねさんの指示）。
   ことばのたね の キャラの演技には 小さな音がついているので、ここでは 鳴らさない */
blip = () => { }; chime = () => { }; tune = () => { }; noise = () => { };
/* ---------- 音の出口（iPad・iPhone のマナーモード対策と、電話のあとの復旧） 2026-11-07 作りなおし ----------
   1) navigator.audioSession（iOS 17 以降）：1台で遊ぶときは "playback"、通話するときは "play-and-record"。
      電話のあとは iOS が種類を戻してしまうことがあるので、画面に戻るたび・さわるたびに 設定しなおす
   2) 1台で遊ぶときは、無音の音声ファイルを audio 要素で くりかえし流しておく（unmute.js と同じ方法。
      こうすると iPhone が「音楽を再生中」とみなして、マナーモードでも Web Audio の音が出る）。
      前は 作った音そのものを audio 要素に通していたが、電話で止まると 戻らなかった
   3) 音の出口（AudioContext）が止まっていたら resume。さわっても動かなければ その場で作りなおす */
const SOUND = { session: "なし", out: "ふつう", keep: null, rebuilt: 0, why: "" };
function setSession(type) {
  // アプリ版も同じ（2026-11-14：殻の設定だけでは WKWebView が音の種類を戻してしまい、マナーモードで 効果音・声が消えた）
  try {
    if (!navigator.audioSession) { SOUND.session = "なし（古いiOS）"; return; }
    if (navigator.audioSession.type !== type) navigator.audioSession.type = type;
    SOUND.session = type;
  } catch (e) { SOUND.session = "設定できず"; }
}
const wantSession = () => NET.role ? "play-and-record" : "playback";
// 無音の WAV（0.5秒・8kHz・8bit）をその場で作る
const SILENT = (() => {
  const n = 4000, b = new Uint8Array(44 + n), v = new DataView(b.buffer), w = (o, t) => [...t].forEach((ch, i) => b[o + i] = ch.charCodeAt(0));
  w(0, "RIFF"); v.setUint32(4, 36 + n, true); w(8, "WAVE"); w(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); w(36, "data"); v.setUint32(40, n, true); b.fill(128, 44);
  let bin = ""; b.forEach(x => bin += String.fromCharCode(x)); return "data:audio/wav;base64," + btoa(bin);
})();
function keepAlive() {
  if (NET.role) { if (SOUND.keep) { SOUND.keep.pause(); } return; }   // 通話中は いらない（play-and-record はマナーモードで消えない）
  if (!SOUND.keep) {
    const el = document.createElement("audio");
    el.setAttribute("playsinline", ""); el.setAttribute("x-webkit-airplay", "deny"); el.preload = "auto"; el.loop = true; el.src = SILENT;
    el.style.display = "none"; document.body.appendChild(el); SOUND.keep = el;
  }
  if (SOUND.keep.paused && !document.hidden) SOUND.keep.play().then(() => SOUND.out = "マナーモード対策あり", () => SOUND.out = "マナーモード対策できず");
}
const audioBase = audio;
audio = function () {
  const first = !ctx;
  if (first) setSession(wantSession());
  audioBase();
  if (first) { keepAlive(); if (SOUND.viaCall) routeViaCall(); }
  return ctx;
};
/* Android（Chrome）の通話中：Web Audio の音（効果音・声）は「メディア」の線、通話の声は「通話」の線で鳴る。
   通話モードのあいだ メディアの線が消される端末があるらしく（2026-11-08 iPhone×Android で Android だけ無音）、
   音を MediaStream にして audio 要素で鳴らす＝通話と同じ線に乗せる。iPhone・iPad では使わない */
function routeViaCall() {
  try {
    const dest = ctx.createMediaStreamDestination();
    window.__out = dest;
    if (typeof analyser !== "undefined" && analyser) { try { analyser.disconnect(); } catch (e) { } analyser.connect(dest); }
    let el = SOUND.callEl;
    if (!el) { el = document.createElement("audio"); el.setAttribute("playsinline", ""); el.autoplay = true; el.style.display = "none"; document.body.appendChild(el); SOUND.callEl = el; }
    el.srcObject = dest.stream; el.muted = false; el.volume = 1;
    el.play().then(() => { SOUND.out = "通話の線"; }, () => { SOUND.out = "通話の線（再生できず）"; });
  } catch (e) { SOUND.out = "通話の線にできず"; window.__out = null; }
}
function rebuildAudio(why) {
  const old = ctx; ctx = null; try { old && old.close(); } catch (e) { }
  SOUND.rebuilt++; SOUND.why = why || ""; SOUND.tried = 0;
  audio();
}
// 通話を始めるとき：種類を play-and-record にして、無音の再生はやめる
function soundForCall() { setSession("play-and-record"); if (SOUND.keep) SOUND.keep.pause(); }
// さわったとき（ユーザー操作の中なので、作りなおしも再生も許される）
/* Android（Chrome）：カメラ・マイクを使い始める前に作った音の出口は、通話が始まると
   「動いているのに 音が出ない」ことがある（2026-11-07 Android×iPhone で、最初の対局だけ Android が無音）。
   通話の線が入ったら、出口を一度だけ作りなおす。iPhone・iPad は今のままで鳴っているので さわらない */
const IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
function freshForCall(why) {
  if (IOS || !ctx || SOUND.fresh) return;
  SOUND.fresh = why; SOUND.viaCall = true;
  // ページで一度でも操作していれば（Android はそれで再生が許される）すぐ作りなおす。まだなら 次にさわったとき
  if (!navigator.userActivation || navigator.userActivation.hasBeenActive) rebuildAudio("通話");
  else SOUND.needFresh = true;
}
function wakeSound(e) {
  if (!ctx) return;
  if (SOUND.callEl && SOUND.callEl.paused && !document.hidden) SOUND.callEl.play().catch(() => { });
  if (SOUND.needFresh && e) { SOUND.needFresh = false; return rebuildAudio("通話"); }
  setSession(wantSession());
  keepAlive();
  if (ctx.state === "running") { SOUND.tried = 0; return; }
  if (ctx.state === "closed" || (e && SOUND.tried)) return rebuildAudio(ctx.state);   // 前にさわっても戻らなかった → 作りなおす
  SOUND.tried = Date.now();
  try { const p = ctx.resume(); if (p && p.then) p.then(() => { if (ctx && ctx.state === "running") SOUND.tried = 0; }, () => { }); } catch (err) { }
}
document.addEventListener("pointerdown", wakeSound, true);
document.addEventListener("touchend", wakeSound, true);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) return;
  setTimeout(() => wakeSound(), 300);
  // 電話のあと：止まったカメラ・マイクを取りなおし、相手の映像・声も再生しなおす
  if (NET.role && G.started) setTimeout(() => { NET.refreshMedia(); ["A", "B"].forEach(sd => { const v = camOf(sd).v; if (v.srcObject && v.paused) v.play().catch(() => { }); }); }, 1200);
});
$("sndTest").addEventListener("click", () => {
  if (ctx) rebuildAudio("テスト"); else audio();
  setTimeout(() => { SFX.place(); setTimeout(() => SFX.flip(1, 1), 220); }, 60);
  setTimeout(() => { $("sndInfo").textContent = soundInfo(); }, 600);
});
// 設定の「音の テスト」：作りなおしてから ポン と鳴らす。いまの状態も出す（実機で原因を見るため）
function soundInfo() {
  const st = ctx ? ctx.state : "まだ";
  return `音：${st}・${SOUND.session}・${SOUND.out}${SOUND.viaCall ? "・通話の線" : ""}${SOUND.rebuilt ? `・作りなおし${SOUND.rebuilt}回` : ""}${SOUND.voiceErr ? `・声：${SOUND.voiceErr}` : ""}`;
}
// 戻るボタンなどで古い画面がそのまま復元されたときは読みなおす（音の出口が死んでいる）
addEventListener("pageshow", e => { if (e.persisted) location.reload(); });
/* ---------- メニューに もどる（とちゅうで やめる） ----------
   確認してから、盤をすてて はじめの画面へ。遠隔対戦なら 相手にも知らせて、カメラと通話を止める */
function toMenu() {
  try { ringing.forEach(c => CALL.cancel(c.dev)); } catch (e) { }
  G.hist = []; G.ended = false; saveGame();
  try { NET.local?.getTracks().forEach(tr => tr.stop()); NET.peer?.destroy(); } catch (e) { /* もう切れている */ }
  location.replace(location.pathname);   // ページを読みなおすのが いちばん確実に まっさらに もどる
}
$("menuBtn").addEventListener("click", () => {
  $("quitNote").textContent = NET.role ? "あいてとの つうわも おわります。" : "";
  $("quitOv").hidden = false;
});
$("quitNo").addEventListener("click", () => { $("quitOv").hidden = true; });
$("quitYes").addEventListener("click", () => { NET.send({ t: "quit" }); setTimeout(toMenu, 300); });
async function quitByOther() {
  G.paused = true; G.busy = true; clearHints(); updateButtons(); $("againOv").hidden = true; $("askOv").hidden = true;
  camMsg(otherSide(), "あいてが おわりにしました");
  await showHost(host.pony);
  await say(host.pony, "あいてが おわりにしたよ。また あそぼうね", 2500);
  toMenu();
}
function unlock() {
  audio();
  try { if ("speechSynthesis" in window) { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; speechSynthesis.speak(u); } } catch (e) { /* 読み上げなしでも遊べる */ }
  $("startOv").hidden = true; G.started = true; keepAwake(); preloadVoices(); $("menuBtn").hidden = false;
}
$("startBtn").addEventListener("click", async () => {
  unlock();
  if (NET.role === "guest") return startOnline();
  const saved = G.hist.length > 0;
  if (saved) { const s = replay(G.hist); paint(s.board); setCounts(s.board, false); s.over ? endGame(s) : setTurn(s); }
  else newGame();
});

/* ---------- 対戦相手の登録 ----------
   リンクを一度ひらいた端末は、その部屋を「登録した相手」として覚える。次からは開始画面の「○○と 対戦する」を押すだけでつながる。
   よぶ側は、相手が登録ずみなら「たいせんあいてを よぶ」でリンクの画面を出さず、すぐ待ち受けに入る。 */
const PARTNER_KEY = "marushima-reversi-partners";
const partners = { list: load(PARTNER_KEY) || [], save() { keep(PARTNER_KEY, this.list); } };
function registerPartner(room, name) {
  if (!room) return;
  const i = partners.list.findIndex(p => p.room === room), rec = { room, name: name || (i >= 0 ? partners.list[i].name : "") || "たいせんあいて", dev: i >= 0 ? partners.list[i].dev : undefined, at: Date.now() };
  if (i >= 0) partners.list[i] = rec; else partners.list.unshift(rec);
  partners.list = partners.list.slice(0, 5); partners.save();
}
/* 開始画面の大きいボタンは 1つだけ。登録した相手がいれば「○○と あそぶ」、いなければ「たいせんあいてを よぶ」。
   押したあとの判断（通知で よぶ／リンクを出す／だれと？を聞く）は アプリがやる */
function candidates() {
  const list = callers.list.map(c => ({ kind: "host", name: c.name, dev: c.dev })).concat(partners.list.map(p => ({ kind: "guest", name: p.name, p })));
  return list;
}
function renderPartners() {
  if (NET.role === "guest" || answeringRing) return;
  const cs = candidates();
  $("callBtn").innerHTML = "とおくの ひとと あそぶ<small>テレビでんわで つながるよ</small>";
}
function playWith(c) { if (c.kind === "guest") joinPartner(c.p); else callGrandma(false); }
function pressPlay() {
  if (answeringRing) return callGrandma(false, true);
  const cs = candidates();
  if (!cs.length) return CFG.myName ? callGrandma(false) : showNames(() => callGrandma(false));
  // まえに あそんだ ひとが いれば、かならず「だれと あそぶ？」（あたらしい あいても ここから よべる）
  const box = $("whoList"); box.innerHTML = "";
  cs.forEach(c => { const b = document.createElement("button"); b.type = "button"; b.className = "big partner"; b.textContent = `${c.name}と あそぶ`; b.addEventListener("click", () => { $("whoOv").hidden = true; playWith(c); }); box.appendChild(b); });
  $("whoOv").hidden = false;
}
$("whoClose").addEventListener("click", () => { $("whoOv").hidden = true; });
$("whoNew").addEventListener("click", () => { $("whoOv").hidden = true; CFG.myName ? callGrandma(true) : showNames(() => callGrandma(true)); });
function joinPartner(p) {
  NET.role = "guest"; NET.room = p.room; registerPartner(p.room, p.name);
  unlock(); $("guestLead").hidden = true; startOnline();
  // 相手の端末を知っていれば、通知でよぶ（相手が「たいせんあいてを よぶ」を押すと つながる）
  if (p.dev) ringOut([{ dev: p.dev, name: p.name }], BASE + "?ring=1&fd=" + CALL.id + "&from=" + encodeURIComponent(CFG.myName || ""));
}
/* ---------- よびだし（通知で 直接よぶ。2026-11-07） ---------- */
const BASE = NET.publicBase();
const CALLER_KEY = "marushima-reversi-callers";
// よぶ側（ホスト）が覚えている相手の端末。部屋はホストの部屋なので、相手の端末 id と名前だけ
const callers = { list: load(CALLER_KEY) || [], save() { keep(CALLER_KEY, this.list); } };
function registerCaller(dev, name) {
  if (!dev) return;
  const i = callers.list.findIndex(c => c.dev === dev), rec = { dev, name: name || (i >= 0 ? callers.list[i].name : "") || "あいて", at: Date.now() };
  if (i >= 0) callers.list[i] = rec; else callers.list.unshift(rec);
  callers.list = callers.list.slice(0, 5); callers.save(); renderPartners();
}
let ringTimer = 0, ringing = [];
async function ringOut(list, url) {
  clearTimeout(ringTimer); ringing = list.filter(c => c.dev);
  if (!ringing.length) return false;
  const who = ringing.map(c => c.name).join("・");
  camMsg(otherSide(), `${who}を よびだしています…`);
  const rs = await Promise.all(ringing.map(c => CALL.ring(c.dev, CFG.myName, url)));
  if (NET.open) return true;
  if (!rs.some(r => r && r.ok)) {
    const r = rs[0] || {};
    ringing = [];
    camMsg(otherSide(), r.reason === "nosub" || r.reason === "gone" ? `${who}の 端末は まだ よびだしを うけとれません` : "よびだしを 送れませんでした");
    if (NET.role === "host") $("resendBtn").hidden = false;
    return false;
  }
  camMsg(otherSide(), `${who}を よびだしています…`);
  ringTimer = setTimeout(() => {
    if (NET.open) return;
    ringing.forEach(c => CALL.cancel(c.dev)); ringing = [];
    camMsg(otherSide(), "でられない みたい。また あとで よんでね");
    if (NET.role === "host") $("resendBtn").hidden = false;
  }, 60000);
  return true;
}
function stopRing() { clearTimeout(ringTimer); ringing = []; }
// はじめの画面の「よびだしを うけとる」と 設定の よびだしの欄
function renderPush() {
  $("pushOff").hidden = !CALL.on; $("pushOn").hidden = CALL.on;
  $("pushInfo").textContent = CALL.on ? "この端末は よびだしを うけとれます。" : CALL.blocked ? "通知が「許可しない」になっています。設定アプリで このページ（アイコン）の通知を許可してください。" : CALL.needsHome ? "iPhone・iPad は、ホーム画面に追加したアイコンから開くと うけとれます。" : CALL.canPush ? "まだ うけとらない設定です。" : "この端末では使えません。";
  $("pushOn").disabled = !!CALL.blocked || (!CALL.canPush && !CALL.needsHome);
}
// 一度だけ聞く：登録した相手がいて、まだ うけとれない端末なら
function maybeAskPush() {
  // iPhone・iPad の Safari（ホーム画面に追加していない）では聞かない：手順がややこしいので、アプリ版まで待つ（あまねさん 2026-11-08）。設定からはいつでも
  if (CFG.pushAsked || CALL.on || CALL.blocked || !CALL.canPush || CALL.needsHome) return;
  if (!partners.list.length && !callers.list.length) return;
  CFG.pushAsked = 1; saveCfg();
  $("pushAskOv").hidden = false;
}
$("pushAskYes").addEventListener("click", async () => { $("pushAskOv").hidden = true; await pushOn(); });
$("pushAskNo").addEventListener("click", () => { $("pushAskOv").hidden = true; });
async function pushOn() {
  if (CALL.needsHome) {
    // ホーム画面に追加する前に、いまの登録を持っていける URL に切り替える（追加するときは この URL が使われる）
    try { history.replaceState(null, "", CALL.setupURL()); } catch (e) { }
    $("homeOv").hidden = false; return;
  }
  const r = await CALL.enable(CFG.myName);
  if (r.ok) NET.send({ t: "dev", id: CALL.id, name: CFG.myName });
  else { $("pushInfo").textContent = r.why; }
  renderPush();
  if (r.ok) $("pushInfo").textContent = "うけとれるように なりました。";
}
$("pushOn").addEventListener("click", pushOn);
$("pushOff").addEventListener("click", async () => { await CALL.off(); renderPush(); });
$("homeClose").addEventListener("click", () => { $("homeOv").hidden = true; });
/* ---------- 遠隔対戦（段階2） ---------- */
const otherSide = () => other(mySide());
function camOf(side) { return { box: $("cam" + side), v: $("vid" + side), msg: $("msg" + side) }; }
function camMsg(side, text) { const c = camOf(side); c.msg.textContent = text || ""; c.msg.hidden = !text; $("cam" + side).classList.toggle("msgOn", !!text); }
function playVideo(v) { const p = v.play(); if (p) p.catch(() => camMsg(v === camOf(mySide()).v ? mySide() : otherSide(), "がめんを タップしてね")); }
document.addEventListener("click", () => ["A", "B"].forEach(s => { const v = $("vid" + s); if (v.srcObject && v.paused) v.play().catch(() => {}); }), true);
["A", "B"].forEach(s => { $("vid" + s).addEventListener("playing", () => camMsg(s, "")); });
function showCams() {
  document.body.classList.add("online");
  ["A", "B"].forEach(s => { $("cam" + s).hidden = false; $("cam" + s).classList.toggle("mine", s === mySide()); });
  updateButtons(); layout();
}
NET.on("local", s => {
  const c = camOf(mySide());
  if (!s) {
    camMsg(mySide(), NET.role === "guest" ? "カメラが使えません。設定の「Safari」→「カメラ」「マイク」を「許可」にして、もう一度リンクを開いてください" : "カメラが つかえません");
    return;
  }
  c.v.muted = true; c.v.srcObject = s; playVideo(c.v); camMsg(mySide(), NET.media === "audio" ? "カメラが つかえません（こえだけ）" : NET.media === "video" ? "マイクが つかえません（えいぞうだけ）" : "");
  setTimeout(wakeSound, 300); setTimeout(wakeSound, 1500);   // カメラ・マイクが入ると iPad の音が止まることがある
  setTimeout(() => freshForCall("local"), 400);
});
NET.on("remote", s => { const c = camOf(otherSide()); c.v.muted = false; c.v.srcObject = s; playVideo(c.v); camMsg(otherSide(), ""); setTimeout(() => freshForCall("remote"), 400); });

// 受け取った知らせは順番に処理する。盤が動いている間は待つ。
const inbox = [];
function pump() {
  if (!inbox.length) return;
  const m = inbox[0], waitAnim = ["move", "undo", "undoReq", "state", "new"].includes(m.t);
  if (waitAnim && G.animating) return setTimeout(pump, 120);
  inbox.shift(); handle(m); pump();
}
NET.on("msg", m => { inbox.push(m); pump(); });
function sendState() { NET.send({ t: "state", hist: G.hist, blackSide: G.blackSide }); }
function handle(m) {
  switch (m.t) {
    case "move": {
      const ok = m.n === G.hist.length && !G.ended && legalMoves(cur.board, cur.turn).some(x => x.r === m.r && x.c === m.c) && sideOf(cur.turn) === otherSide();
      if (ok) playMove(m.r, m.c); else resync(); break;
    }
    case "undo": if (m.n === G.hist.length && undoDepth(G.hist, colorOf(m.side))) animUndo(m.side, m.depth); else resync(); break;
    case "undoReq": if (m.n === G.hist.length) askUndo(m); else NET.send({ t: "undoAns", ok: false, n: m.n }); break;
    case "undoAns":
      clearTimeout(undoTimer); hideBubble();
      if (m.ok && m.n === G.hist.length) hideHost(host.pony).then(() => animUndo(mySide(), undoDepth(G.hist, colorOf(mySide()))));
      else undoRefused(mySide());
      break;
    case "undoCancel": if (askFor) { askFor = null; clearTimeout(askTimer); $("askOv").hidden = true; hideBubble(); hideHost(host.pony).then(() => setTurn(cur, true)); } break;
    case "again": G.readyThem = true; if (G.readyMe) rematch(); break;
    case "sync": if (NET.role === "host") sendState(); break;
    case "state": applyState(m); break;
    case "new": newGame(); break;
    case "quit": quitByOther(); break;
    case "dev":
      // 相手の端末 id（よびだし用）を覚える
      if (NET.role === "guest") { const p = partners.list.find(x => x.room === NET.room); if (p && m.id) { p.dev = m.id; partners.save(); } }
      else if (NET.role === "host") { registerCaller(m.id, m.name); if (!CFG.hasPartner) { CFG.hasPartner = 1; saveCfg(); } }
      break;
    case "hello":
      if (m.reg && NET.role === "host" && !CFG.hasPartner) { CFG.hasPartner = 1; saveCfg(); }
      // よぶ側が名前を変えたら、こちらの「○○と 対戦する」も新しい名前に
      if (m.name && NET.role === "guest") { registerPartner(NET.room, m.name); renderPartners(); }
      break;
    case "lic": G.theirUnlocked = !!m.u; refreshLeft(); if (NET.role === "host") recheckLock(); break;
    case "locked": if (NET.role === "guest") { G.busy = true; clearHints(); updateButtons(); showUnlock(); } break;
    case "unlocked": $("unlockOv").hidden = true; break;
  }
}
function resync() { NET.role === "host" ? sendState() : NET.send({ t: "sync" }); }
// ホストの状態に合わせる（ゲスト側）
function applyState(m) {
  let s; try { s = replay(m.hist); } catch (e) { return; }
  const same = m.hist.length === G.hist.length && m.hist.every((x, i) => x[0] === G.hist[i][0] && x[1] === G.hist[i][1]) && m.blackSide === G.blackSide;
  G.paused = false; camMsg(otherSide(), "");
  if (same && G.started && !G.busy) { updateButtons(); return; }
  G.hist = m.hist.slice(); G.blackSide = m.blackSide; G.ended = false; saveGame();
  $("againOv").hidden = true; $("askOv").hidden = true; askFor = null; hideBubble();
  paintSides(); paint(s.board); setCounts(s.board, false); haloFor(G.hist);
  if (!m.hist.length) { G.busy = true; return; }   // ホストの「はじめ」を待つ
  if (s.over) endGame(s); else setTurn(s, true);
}
let lostSaid = false;
NET.on("open", () => {
  const back = lostSaid; G.paused = false; lostSaid = false; $("inviteOv").hidden = true; camMsg(otherSide(), "");
  if (back && !G.animating) speak(host.pony, "rv_back");
  setTimeout(() => { if (NET.open && !NET.remote) camMsg(otherSide(), "あいての カメラが うつりません（ゲームは できます）"); }, 9000);
  sendLic(); stopRing();
  NET.send({ t: "dev", id: CALL.id, name: CFG.myName });
  if (NET.role === "guest") { registerPartner(NET.room, NET.linkName || (partners.list.find(p => p.room === NET.room) || {}).name); NET.send({ t: "hello", reg: true }); }
  if (NET.role !== "host") return;
  NET.send({ t: "hello", name: CFG.myName });
  $("resendBtn").hidden = true;
  sendState();
  if (G.begun) return updateButtons();
  // 相手の「解放ずみか」が届くのを 少しだけ待ってから 始める
  clearTimeout(G.licWait); G.licWait = setTimeout(hostBegin, 1500);
});
function hostBegin() {
  clearTimeout(G.licWait);
  if (G.begun || !NET.open) return;
  if (!remoteAllowed()) { lockBoth(); return; }
  G.begun = true; $("unlockOv").hidden = true;
  const s = replay(G.hist);
  if (!G.hist.length) { NET.send({ t: "new" }); countGame(); newGame(); }
  else s.over ? endGame(s) : setTurn(s, true);
}
NET.on("lost", () => {
  G.paused = true; updateButtons();
  camMsg(otherSide(), "つなぎなおしています…");
  if (!lostSaid && !G.animating) { lostSaid = true; speak(host.pony, "rv_hold"); }
});
NET.on("ready", () => { if (!NET.open && !ringing.length) camMsg(otherSide(), CFG.hasPartner ? "登録ずみの あいてを まっています…" : "まっています…"); });
// 同じリンクを もう1つの画面で ひらいていて、そちらが つながっているとき
NET.on("busy", () => { G.paused = true; G.busy = true; clearHints(); updateButtons(); camMsg(otherSide(), "ほかの がめんで つながっています。この がめんは とじてください"); });
NET.on("route", via => { $("routeInfo").textContent = via ? `いまのつながり：${via}` : ""; });
NET.on("error", type => camMsg(otherSide(), type === "network" || type === "server-error" ? "インターネットを たしかめてね" : "つなぎなおしています…"));

function startOnline() {
  showCams();
  G.busy = true;
  if (NET.role === "guest") {
    camMsg(otherSide(), "つないでいます…"); NET.guest();
    // 30秒たっても つながらないときは、あいての画面を たしかめてもらう
    setTimeout(() => { if (!NET.open && !NET.busy) camMsg(otherSide(), "まだ つながりません。あいての iPad で「とおくの ひとと あそぶ」の画面が ひらいているか たしかめてね"); }, 30000);
  }
}
// たいせんあいてを よぶ（ホスト）
async function callGrandma(fresh, answering) {
  NET.role = "host"; if (ctx) soundForCall(); unlock(); NET.relayOnly = !!CFG.relay; startOnline();
  // 相手を よんだら、1台で遊んでいた とちゅうの盤は すてて、新しい対局から始める（くろ＝こども）
  G.hist = []; G.blackSide = "A"; G.ended = false; G.begun = false; saveGame(); clearHalo();
  $("againOv").hidden = true; ["A", "B"].forEach(s => $("side" + s).classList.remove("winner", "active"));
  const s = replay(G.hist); cur = s; paintSides(); paint(s.board); setCounts(s.board, false); clearHints(); updateButtons();
  NET.name = CFG.myName;
  await NET.host(fresh);
  // 相手から よばれて 開いたとき：つなぐだけ
  if (answering) { camMsg(otherSide(), "つないでいます…"); $("resendBtn").hidden = false; return; }
  // 相手の端末に 通知を送れるなら それで よぶ。送れなかったら リンクの画面へ
  if (!fresh && !forceLink && CFG.hasPartner && callers.list.length) {
    $("resendBtn").hidden = false;
    const ok = await ringOut(callers.list.slice(0, 1), BASE + "?r=" + NET.room + "&n=" + encodeURIComponent(CFG.myName || "") + "&ring=1");
    if (!ok && !NET.open) showInvite(true);
    return;
  }
  // 通知で よべない相手 → すぐ リンクの画面（2回目からは まえと同じリンク。あいては「○○と 対戦する」からも入れる）
  $("resendBtn").hidden = false; forceLink = false;
  showInvite(!fresh && CFG.hasPartner);
}
$("resendBtn").addEventListener("click", () => showInvite());
NET.on("lost", () => { if (NET.role === "host") $("resendBtn").hidden = false; });
function showInvite(again) {
  const url = NET.inviteURL();
  $("inviteAgain").hidden = !again;
  try { const q = qrcode(0, "M"); q.addData(url); q.make(); $("qr").innerHTML = q.createSvgTag({ cellSize: 6, margin: 2, scalable: true }); } catch (e) { $("qr").textContent = ""; }
  $("inviteLink").textContent = url;
  $("inviteWarn").hidden = remoteAllowed();

  $("inviteOv").hidden = false;
}
/* ---------- 遠隔対戦の回数（10回まで無料。払うのは よぶ側だけ） ---------- */
/* どちらかが解放ずみなら遊べる。解放ずみの人がいないときは、よぶ側の無料分（10回）を使う */
// アプリ版で まだ課金が つながっていないあいだは 制限しない（暫定。IAP をつないだら外す）
const IAP_PENDING = () => !!window.RVNative && !window.MarushimaIAP;
const myUnlocked = () => IAP_PENDING() || BILLING.unlocked || !!CFG.devUnlock;
const remoteAllowed = () => IAP_PENDING() || myUnlocked() || !!G.theirUnlocked || BILLING.left > 0;
function sendLic() { NET.send({ t: "lic", u: myUnlocked() }); }
function countGame() { if (!myUnlocked() && !G.theirUnlocked) BILLING.count(); refreshLeft(); }
// ホスト：無料分を使い切り、どちらも解放していない → 両方の画面に案内。どちらかが解放したら 続きが始まる
function lockBoth() { NET.send({ t: "locked" }); showUnlock(); }
function recheckLock() {
  if (!remoteAllowed()) return;
  $("unlockOv").hidden = true; NET.send({ t: "unlocked" });
  if (!G.begun) hostBegin();
  else if (G.pendingRematch) { G.pendingRematch = false; countGame(); newGame(); }
}
function afterUnlock() {
  refreshLeft(); sendLic();
  if (NET.role === "host") recheckLock();
  else if (NET.role === "guest") { $("unlockOv").hidden = true; camMsg(otherSide(), "かいほうしました。すこし まってね"); }
  else { $("unlockOv").hidden = true; }
}
function refreshLeft() {
  const el = $("leftNote"), un = myUnlocked();
  // 「あと N回」は のこり3回からだけ出す（それまでは何も出さない）
  el.hidden = NET.role === "guest" || un || BILLING.left > 3;
  el.textContent = BILLING.left > 0 ? `遠隔対戦：あと ${BILLING.left}回 むりょう` : "遠隔対戦：無料分おわり（相手が解放ずみなら遊べます）";
  el.classList.toggle("zero", !un && BILLING.left === 0);
  $("remoteInfo").textContent = IAP_PENDING() ? `いまは回数の制限なし（課金の準備中）。これまで ${BILLING.used}回` : un ? `解放ずみ（${BILLING.unlocked ? "購入" : "テスト用"}）。これまで ${BILLING.used}回` : `これまで ${BILLING.used}回・のこり ${BILLING.left}回`;
}
function showUnlock() {
  $("unlockTitle").textContent = NET.role === "guest" ? "呼んだ側の無料分（10回）が終わりました" : "遠隔対戦の無料分（10回）を使い切りました";
  $("unlockNote").textContent = (BILLING.canBuy ? "" : "この Web 版では購入できません。App Store／Google Play 版で解放できます（準備中）。") + (NET.open ? " どちらか一方が解放すれば、そのまま対局が始まります。" : "");
  $("buyBtn").disabled = !BILLING.canBuy; $("restoreBtn").disabled = !BILLING.canBuy;
  $("unlockOv").hidden = false;
}
$("unlockClose").addEventListener("click", () => { $("unlockOv").hidden = true; });
$("buyBtn").addEventListener("click", async () => {
  $("buyBtn").disabled = true; const r = await BILLING.purchase(); $("buyBtn").disabled = false;
  if (r.ok) afterUnlock(); else $("unlockNote").textContent = "購入できませんでした。";
});
$("restoreBtn").addEventListener("click", async () => {
  const r = await BILLING.restore();
  if (r.ok) afterUnlock(); else $("unlockNote").textContent = "引きつげる購入が見つかりませんでした。";
});
const answeringRing = !NET.role && new URLSearchParams(location.search).get("ring") === "1";
$("callBtn").addEventListener("click", pressPlay);
$("copyBtn").addEventListener("click", () => {
  const url = NET.inviteURL(), done = () => { $("copyBtn").textContent = "コピーしました"; setTimeout(() => $("copyBtn").textContent = "リンクを コピー", 2000); };
  const pick = () => { const r = document.createRange(); r.selectNodeContents($("inviteLink")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
  try { navigator.clipboard.writeText(url).then(done, pick); } catch (e) { pick(); }
});
/* LINEで おくる：iPad の「共有」画面を出す（LINE を選ぶ）。共有画面は この画面の上に重なるだけなので、
   送り終わると 自動でリバーシの画面に戻る。共有画面が使えない端末だけ、LINE アプリを直接ひらく */
const inviteText = () => "テレビ電話リバーシで あそぼう！ ここを タップしてね\n" + NET.inviteURL();
$("lineBtn").addEventListener("click", async () => {
  if (window.RVNative) { CALL.toApp({ t: "share", text: inviteText() }); $("inviteOv").hidden = true; camMsg(otherSide(), "まっています…"); return; }
  if (navigator.share) {
    try { await navigator.share({ text: inviteText() }); $("inviteOv").hidden = true; camMsg(otherSide(), "まっています…"); } catch (e) { /* やめたときは そのまま */ }
  } else location.href = "line://msg/text/" + encodeURIComponent(inviteText());
});
// リンクの画面をとじて待つあいだも、「リンクを おくる」を出しておく（また LINE で送れる）
$("inviteClose").addEventListener("click", () => { $("inviteOv").hidden = true; if (NET.role === "host" && !NET.open) $("resendBtn").hidden = false; });
$("reinviteBtn").addEventListener("click", () => { setPanel.hidden = true; if (NET.role === "host") showInvite(!!CFG.hasPartner); else { forceLink = true; CFG.myName ? callGrandma(false) : showNames(() => callGrandma(false)); } });
let forceLink = false;

/* ---------- 起動：前回の続き、または確認用の局面（#pass / #end） ---------- */
(function boot() {
  // リンクを開いたら いつも最初から（前回の とちゅうの盤は 読みこまない。2026-11-03）
  // 遠隔対戦の とちゅうで つなぎなおしたときは、相手（ホスト）の盤に 合わせて 続きから になる
  const tag = location.hash.slice(1);
  G.hist = FIX[tag] ? FIX[tag].slice() : []; G.blackSide = "A"; saveGame();
  const s = replay(G.hist); cur = s;
  paintSides(); paint(s.board); setCounts(s.board, false); haloFor(G.hist);
  if (NET.role === "guest") {
    registerPartner(NET.room, NET.linkName);
    $("regNote").hidden = false;
    // おばあちゃん向け：大人なので漢字まじりで、大きく、手順を2つだけ
    $("callBtn").hidden = true; $("startOv").classList.add("guest");
    $("startBtn").textContent = "はじめる"; $("startBtn").classList.remove("sub");
    $("guestLead").hidden = false; $("callBtn").before($("guestLead"));   // 説明を「はじめる」の上に
  }
  else if (!NET.available) $("callBtn").hidden = true;
  refreshLeft(); renderPartners(); renderNameBtn(); renderPush();
  CALL.refresh(CFG.myName);
  if (!NET.role) setTimeout(maybeAskPush, 600);
  // 相手からの よびだしを タップして 開いたとき（よぶ側の端末）
  if (NET.role === "guest" && new URLSearchParams(location.search).get("ring") === "1") {
    $("ringNote").textContent = `${NET.linkName || "あいて"}から よびだし！`; $("ringNote").hidden = false;
  }
  if (answeringRing) {
    const uq = new URLSearchParams(location.search), known = callers.list.find(c => c.dev === uq.get("fd"));
    const from = (known && known.name !== "あいて" && known.name) || uq.get("from") || (known && known.name) || "あいて";
    $("ringNote").textContent = `${from}から よびだし！ 下の ボタンを おしてね`; $("ringNote").hidden = false;
    $("callBtn").textContent = `${from}と つなぐ`;
    try { history.replaceState(null, "", location.pathname); } catch (e) { }
  }
  layout(); placeAll();
  setTimeout(() => { if (!G.started) { wave(seat.A); mv(seat.B, "nod"); } }, 900);
})();

/* ---------- 毎フレーム ---------- */
/* 発熱対策（2026-11-07）：キャラの描画は 30fps まで（120Hz の iPhone で 4分の1）。
   位置決め（getBoundingClientRect）は毎フレームやらず、大きさが変わったときだけ */
let last = performance.now(), acc = 0;
let placeDirty = true;
addEventListener("resize", () => { placeDirty = true; });
if (window.ResizeObserver) new ResizeObserver(() => { placeDirty = true; }).observe($("app"));
const SPRINGS = ["squash", "lean", "headRot", "earL", "earR", "armL", "armR", "eyeScale", "mouthOpen", "dx", "lift", "headY", "eyeX", "eyeY"];
function atRest(c) {
  if (c.enter) { if (!(c.hidden && Math.abs(c.enter.vel) < .01 && c.enter.v > .999)) return false; return true; }
  if (talking === c || c.speakingLevel > .001 || c.listening || c.jumpY || c.jumpV || Object.keys(c.tm).length) return false;
  if (!c.noBlink && (c.blink < 1 || c.nextBlink < .06)) return false;
  if (!c._seen || now0() - c._seen < 400) return false;   // 止まる前に 最後の形まで描ききる
  for (const k of SPRINGS) { const p = c[k]; if (p && (Math.abs(p.vel) > .02 || Math.abs(p.v - p.t) > .004)) { c._seen = now0(); return false; } }
  return true;
}
const now0 = () => performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  const raw = (now - last) / 1000;
  if (raw < 1 / 31) return;
  const dt = Math.min(.05, raw); last = now;
  if (placeDirty) { placeDirty = false; placeAll(); all.forEach(c => c._seen = now); } else placeHosts();
  all.forEach(c => {
    if (talking === c) c.speakingLevel = .3 + .4 * Math.abs(Math.sin(now / 70));
    if (c.enter) c.enter.step(dt);
    // 発熱対策：じっとしているキャラ（動き・声・まばたき・ばねの揺れがない）は 描きなおさない。
    // 時計だけ進めて、まばたきの直前や 動きが入ったら また描く（呼吸のわずかな揺れは 止まる）
    if (atRest(c)) { c.t += dt; c.nextBlink -= dt; return; }
    drawChar(c, dt, false);
  });
  idleTick(seat.A, dt, G.busy); idleTick(seat.B, dt, G.busy);
  if (talking || keepBubble) bubbleAt(talking || keepBubble);
  stepMarks(dt); stepConfetti(dt); FX.step(dt);
}
requestAnimationFrame(frame);

// 開始画面を見ているあいだに 声を読みはじめる（2026-11-14）
setTimeout(() => { try { if (CFG.voice) preloadVoices(); } catch (e) { } }, 400);
