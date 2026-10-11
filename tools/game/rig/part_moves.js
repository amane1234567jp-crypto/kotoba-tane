/* ---------- 感情マーク（♪・！・？・Z・ハート・涙など） ---------- */
const marks = [];
function world(c, lx, ly) { return { x: c.x + c.dx.v * motion + lx * c.s, y: c.y + (ly + c.jumpY * motion - (c.neck ? c.lift.v * motion : 0)) * c.s }; }
function headTop(c) { return world(c, 200, c.top); }
const MARK_DRAW = {
  note(g) { el("text", { "font-family": "Mochiy Pop One, sans-serif", "font-size": 64, fill: "#FF6F91", stroke: INK, "stroke-width": 3, "text-anchor": "middle" }, g).textContent = "♪"; },
  z(g, i) { el("text", { "font-family": "Mochiy Pop One, sans-serif", "font-size": 44 + i * 12, fill: "#7FCBF0", stroke: INK, "stroke-width": 3, "text-anchor": "middle" }, g).textContent = "Z"; },
  q(g) { el("text", { "font-family": "Mochiy Pop One, sans-serif", "font-size": 84, fill: "#B9A8D9", stroke: INK, "stroke-width": 4, "text-anchor": "middle" }, g).textContent = "?"; },
  ex(g) { el("circle", { cy: -30, r: 40, fill: "#FFD25E", stroke: INK, "stroke-width": 5 }, g); el("text", { y: -8, "font-family": "Mochiy Pop One, sans-serif", "font-size": 64, fill: INK, "text-anchor": "middle" }, g).textContent = "!"; },
  heart(g) { el("path", { d: "M0 18 C-40 -10 -28 -44 0 -26 C28 -44 40 -10 0 18 Z", fill: "#FF6F91", stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }, g); },
  sparkle(g) { el("path", { d: "M0 -32 Q6 -6 32 0 Q6 6 0 32 Q-6 6 -32 0 Q-6 -6 0 -32 Z", fill: "#FFE27A", stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }, g); },
  drop(g) { el("path", { d: "M0 -22 Q16 2 10 12 Q0 22 -10 12 Q-16 2 0 -22 Z", fill: "#9FD6F5", stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }, g); },
  anger(g) { el("path", { d: "M-24 -8 Q-8 -8 -8 -24 M8 -24 Q8 -8 24 -8 M24 8 Q8 8 8 24 M-8 24 Q-8 8 -24 8", fill: "none", stroke: "#E2456F", "stroke-width": 8, "stroke-linecap": "round" }, g); },
  shy(g) { el("path", { d: "M-30 10 L-18 -10 M-8 10 L4 -10 M14 10 L26 -10", fill: "none", stroke: "#E2456F", "stroke-width": 6, "stroke-linecap": "round" }, g); },
  puff(g) { el("circle", { r: 18, fill: "#FFFFFF", stroke: INK, "stroke-width": 4 }, g); },
};
function mark(type, x, y, o = {}) {
  if (motion === 0 && type !== "ex" && type !== "q") return;
  const g = el("g", {}, fxLayer); MARK_DRAW[type](g, o.i || 0);
  marks.push({ g, x, y, vx: o.vx || 0, vy: o.vy ?? -60, grav: o.grav || 0, life: o.life || 1.4, max: o.life || 1.4, sway: o.sway || 0, s: o.s || 1, t: 0 });
}
function stepMarks(dt) {
  for (let i = marks.length - 1; i >= 0; i--) {
    const k = marks[i]; k.t += dt; k.life -= dt; k.vy += k.grav * dt; k.x += k.vx * dt; k.y += k.vy * dt;
    const pop = Math.min(1, k.t * 6), fade = Math.min(1, k.life * 2.5);
    k.g.setAttribute("transform", `translate(${(k.x + Math.sin(k.t * 5) * k.sway).toFixed(1)} ${k.y.toFixed(1)}) scale(${(k.s * pop).toFixed(3)})`);
    k.g.setAttribute("opacity", fade.toFixed(2));
    if (k.life <= 0) { k.g.remove(); marks.splice(i, 1); }
  }
}
const markAbove = (c, type, o = {}) => { const p = headTop(c); mark(type, p.x + (o.dx || 0) * c.s, p.y - 20 + (o.dy || 0) * c.s, { s: Math.max(.9, Math.min(1.5, c.s * 1.3)), ...o }); };
function tears(c, dur = 2) {
  const n = Math.round(dur * 5);
  for (let i = 0; i < n; i++) later(i * 200, () => c.eyes.forEach((e, j) => { const p = world(c, e.cx + (j ? 10 : -10), e.cy + 14); mark("drop", p.x, p.y, { vy: 40, vx: (j ? 70 : -70) * c.s, grav: 900, life: .9, s: .7 * Math.max(.6, c.s) }); }));
}

/* ---------- 効果音（追加分） ---------- */
function noise(dur = .15, f = 2500, gain = .25) {
  if (!ctx) return;
  const b = ctx.createBuffer(1, Math.max(1, ctx.sampleRate * dur), ctx.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = b; fl.type = "bandpass"; fl.frequency.value = f; g.gain.value = gain;
  s.connect(fl).connect(g).connect(ctx.destination); s.start();
}
function tune(notes, bpm = 150, type = "triangle", vol = .12) {
  if (!ctx) return; const beat = 60 / bpm; let t = ctx.currentTime + .02;
  notes.forEach(([f, len]) => { if (f) { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.001, t + beat * len * .95);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + beat * len); } t += beat * len; });
}
const N = { C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880, B5: 987.77, C6: 1046.5, G4: 392, A4: 440, E4: 329.63, C4: 261.63 };

/* ---------- 動きのカタログ ----------
   cat: よろこぶ / きもち / あいさつ・へんじ / ようす / ちんじ / ふたりで
   play(c, partner) を呼ぶ。partner は「ふたりで」の相手（いなければ null）。 */
const hold = (c, key, sec) => { c.tm[key] = sec; };
const MOVES = [
  // よろこぶ（正解したときの反応。毎回ちがうものを選べるように多めに用意）
  { id: "banzai", cat: "よろこぶ", label: "ばんざい", play: c => { joy(c); chime(); } },
  { id: "dance", cat: "よろこぶ", label: "おどる", play: c => { hold(c, "dance", 2.6); c.happyOn = true; later(2600, () => c.happyOn = false);
      tune([[N.C5, .5], [N.E5, .5], [N.G5, .5], [N.E5, .5], [N.F5, .5], [N.A5, .5], [N.G5, 1]], 160);
      for (let i = 0; i < 4; i++) later(i * 600, () => markAbove(c, "note", { dx: i % 2 ? 90 : -90, vy: -90, sway: 18 })); } },
  { id: "spin", cat: "よろこぶ", label: "くるりん", play: c => { jump(c, .8); c.spinDur = .8; c.spinTurns = 1; hold(c, "spin", .8); c.happyOn = true; later(1100, () => c.happyOn = false);
      blip(500, 1400, .5, "triangle"); later(700, () => [-1, 1].forEach(d => markAbove(c, "sparkle", { dx: d * 120, dy: 60, vy: -40 }))); } },
  { id: "laugh", cat: "よろこぶ", label: "けらけら", play: c => { hold(c, "laugh", 1.8); c.happyOn = true; later(1800, () => c.happyOn = false);
      for (let i = 0; i < 6; i++) later(i * 140, () => blip(700 + (i % 2) * 180, 600, .07, "square")); markAbove(c, "note", { dx: 80 }); } },
  { id: "clap", cat: "よろこぶ", label: "はくしゅ", play: c => { hold(c, "clap", 2.2); c.happyOn = true; c.mouthOpen.t = .4; later(2200, () => { c.happyOn = false; c.mouthOpen.t = 0; });
      for (let i = 0; i < 8; i++) later(150 + i * 270, () => noise(.06, 1800, .3)); } },
  { id: "pump", cat: "よろこぶ", label: "ガッツポーズ", play: c => { c.armR.t = -150; hold(c, "pump", 1.4); jump(c, .45); c.mouthOpen.t = .5; c.eyeScale.t = 1.12;
      blip(300, 900, .2, "square"); later(300, () => markAbove(c, "sparkle", { dx: 130, dy: 40 })); later(1400, () => { c.armR.t = 0; c.mouthOpen.t = 0; c.eyeScale.t = 1; }); } },
  { id: "heart", cat: "よろこぶ", label: "だいすき", play: c => { c.armL.t = -40; c.armR.t = 40; c.happyOn = true; c.headRot.t = 8; jump(c, .3);
      for (let i = 0; i < 3; i++) later(i * 300, () => markAbove(c, "heart", { dx: (i - 1) * 80, vy: -110, sway: 14 })); tune([[N.E5, .5], [N.C6, 1]], 140, "sine");
      later(1500, () => { c.armL.t = 0; c.armR.t = 0; c.happyOn = false; c.headRot.t = 0; }); } },
  // きもち
  { id: "shy", cat: "きもち", label: "てれる", play: c => { hold(c, "shy", 2.2); c.headRot.t = 12; c.armL.t = -45; c.armR.t = 45; c.eyeY.t = 5;
      markAbove(c, "shy", { dy: 150, vy: -10, life: 2 }); later(2200, () => { c.headRot.t = 0; c.armL.t = 0; c.armR.t = 0; c.eyeY.t = 0; }); } },
  { id: "sad", cat: "きもち", label: "かなしい", play: c => { hold(c, "squint", 2.4); c.sadMouth = true; c.headY.t = 16; c.headRot.t = -6; c.squash.t = .94; c.armL.t = -10; c.armR.t = 10;
      tears(c, 2); tune([[N.E5, 1], [N.C5, 1], [N.A4, 2]], 110, "sine", .08);
      later(2400, () => { c.sadMouth = false; c.headY.t = 0; c.headRot.t = 0; c.squash.t = 1; c.armL.t = 0; c.armR.t = 0; }); } },
  { id: "frustrated", cat: "きもち", label: "くやしい", play: c => { c.roundMouth = false; c.armL.t = -30; c.armR.t = 30; hold(c, "shake", .9);
      [0, 380].forEach(ms => later(ms, () => { jump(c, .35); noise(.08, 300, .4); })); later(100, () => markAbove(c, "anger", { dx: 110, dy: 30, vy: -20 }));
      later(1300, () => { c.armL.t = 0; c.armR.t = 0; }); } },
  { id: "scared", cat: "きもち", label: "こわい", play: c => { hold(c, "shiver", 1.8); c.eyeScale.t = 1.25; c.armL.t = -70; c.armR.t = 70; c.squash.t = .92; c.roundMouth = true; c.mouthOpen.t = .3;
      later(200, () => markAbove(c, "drop", { dx: 130, dy: 90, vy: 30, grav: 200 })); later(700, () => markAbove(c, "drop", { dx: -130, dy: 90, vy: 30, grav: 200 }));
      later(1800, () => { c.eyeScale.t = 1; c.armL.t = 0; c.armR.t = 0; c.squash.t = 1; c.roundMouth = false; c.mouthOpen.t = 0; }); } },
  { id: "surprise", cat: "きもち", label: "びっくり", play: c => { surprise(c); markAbove(c, "ex", { vy: -40 }); blip(500, 1100, .15, "square"); } },
  { id: "think", cat: "きもち", label: "かんがえる", play: c => { c.armR.t = -125; c.headRot.t = 10; c.eyeX.t = 6; c.eyeY.t = -6;
      later(300, () => markAbove(c, "q", { dx: 110, vy: -30, life: 1.8 })); blip(400, 300, .2, "sine");
      later(2000, () => { c.armR.t = 0; c.headRot.t = 0; c.eyeX.t = 0; c.eyeY.t = 0; }); } },
  { id: "sleepy", cat: "きもち", label: "ねむい", play: c => { hold(c, "closed", 1.6); c.mouthOpen.t = .9; c.armL.t = 150; c.armR.t = -150; c.squash.t = 1.08;
      tune([[N.G4, 2], [N.E4, 2]], 90, "sine", .06); later(1300, () => { c.mouthOpen.t = 0; c.armL.t = 0; c.armR.t = 0; c.squash.t = 1; }); } },
  // あいさつ・へんじ
  { id: "bow", cat: "あいさつ・へんじ", label: "おじぎ", play: c => { hold(c, "closed", 1.3); c.squash.t = .9; c.headY.t = 48; c.armL.t = -15; c.armR.t = 15;
      later(1100, () => { c.squash.t = 1; c.headY.t = 0; c.armL.t = 0; c.armR.t = 0; }); } },
  { id: "nod", cat: "あいさつ・へんじ", label: "うなずく", play: c => { hold(c, "nod", 1.2); c.happyOn = !!c.happy; later(1200, () => c.happyOn = false); } },
  { id: "no", cat: "あいさつ・へんじ", label: "くびを ふる", play: c => { hold(c, "shake", 1.2); c.roundMouth = false; c.armL.t = 10; c.armR.t = -10; later(1200, () => { c.armL.t = 0; c.armR.t = 0; }); } },
  { id: "wave", cat: "あいさつ・へんじ", label: "てを ふる", play: c => wave(c) },
  { id: "point", cat: "あいさつ・へんじ", label: "ゆびさす", play: c => { c.armR.t = -78; c.eyeX.t = 7; c.headRot.t = -5; later(200, () => markAbove(c, "ex", { dx: 150, vy: -20 }));
      later(1800, () => { c.armR.t = 0; c.eyeX.t = 0; c.headRot.t = 0; }); } },
  { id: "cheer", cat: "あいさつ・へんじ", label: "はげます", play: c => { c.armL.t = 60; c.armR.t = -150; hold(c, "pump", 1.2); hold(c, "nod", 1.2); c.mouthOpen.t = .4;
      later(1300, () => { c.armL.t = 0; c.armR.t = 0; c.mouthOpen.t = 0; }); } },
  // ようす
  { id: "look", cat: "ようす", label: "きょろきょろ", play: c => { hold(c, "look", 2.4); const f = () => { if (!c.tm.look) { c.eyeX.t = 0; return; } c.eyeX.t = c.eyeX.t > 0 ? -7 : 7; later(500, f); }; f(); } },
  { id: "crouch", cat: "ようす", label: "かくれて ばあ", play: c => { c.squash.t = .7; c.headY.t = 26; c.armL.t = -60; c.armR.t = 60; hold(c, "closed", 1);
      later(1100, () => { c.squash.t = 1; c.headY.t = 0; c.armL.t = 120; c.armR.t = -120; jump(c, .7); c.eyeScale.t = 1.2; c.mouthOpen.t = .8; blip(300, 1200, .2, "square"); });
      later(1900, () => { c.armL.t = 0; c.armR.t = 0; c.eyeScale.t = 1; c.mouthOpen.t = 0; }); } },
  { id: "sneak", cat: "ようす", label: "しのびあし", play: c => { hold(c, "tiptoe", 3); c.lean.t = 8; c.armL.t = 50; c.armR.t = -50; c.dx.t = 160; c.eyeX.t = 6;
      for (let i = 0; i < 6; i++) later(i * 480, () => blip(220, 180, .05, "sine"));
      later(1500, () => { c.dx.t = 0; c.lean.t = -8; c.eyeX.t = -6; }); later(3000, () => { c.lean.t = 0; c.armL.t = 0; c.armR.t = 0; c.eyeX.t = 0; }); } },
  { id: "sleep", cat: "ようす", label: "いねむり", play: c => { hold(c, "closed", 3.2); c.headY.t = 18; c.headRot.t = 12; c.squash.t = .96;
      for (let i = 0; i < 4; i++) later(300 + i * 650, () => markAbove(c, "z", { dx: 110, vy: -50, sway: 10, i: i % 3, life: 1.6 }));
      later(3200, () => { c.headY.t = 0; c.headRot.t = 0; c.squash.t = 1; surprise(c); markAbove(c, "ex"); }); } },
  { id: "run", cat: "ようす", label: "その場ダッシュ", play: c => { hold(c, "run", 2); c.lean.t = -10; c.armL.t = 40; c.armR.t = -40;
      for (let i = 0; i < 6; i++) later(i * 300, () => { const p = world(c, 200, c.base); mark("puff", p.x + 60 * c.s, p.y - 10, { vx: 160, vy: -30, life: .6, s: c.s }); });
      later(2000, () => { c.lean.t = 0; c.armL.t = 0; c.armR.t = 0; }); } },
  { id: "flop", cat: "ようす", label: "ずっこける", play: c => flop(c) },
  // ちんじ（10回に1回くらい予告なしに起こす）
  { id: "sneeze", cat: "ちんじ", label: "くしゃみ", play: c => { c.headY.t = -14; c.headRot.t = -8; hold(c, "closed", 1.2); c.mouthOpen.t = .35;
      later(900, () => { c.headY.t = 14; c.headRot.t = 8; jump(c, .5); c.mouthOpen.t = .9; noise(.35, 1200, .35);
        for (let i = 0; i < 6; i++) { const p = headTop(c); mark("puff", p.x, p.y + 180 * c.s, { vx: (Math.random() - .5) * 500, vy: -200 - Math.random() * 200, grav: 600, life: .9, s: c.s * .8 }); } });
      later(1500, () => { c.headY.t = 0; c.headRot.t = 0; c.mouthOpen.t = 0; }); } },
  { id: "hiccup", cat: "ちんじ", label: "しゃっくり", play: c => { for (let i = 0; i < 4; i++) later(i * 650, () => { jump(c, .32); c.eyeScale.vel += 4; blip(650, 1300, .07, "square"); markAbove(c, "q", { dx: 100, vy: -60, life: .7, s: .6 }); }); } },
  { id: "roll", cat: "ちんじ", label: "ころころ", play: c => { c.spinDur = 1.6; c.spinTurns = 2; hold(c, "spin", 1.6); c.dx.t = 260; hold(c, "closed", 1.6);
      blip(300, 900, .8, "triangle"); later(1600, () => { c.dx.t = 0; c.squash.vel += 2; markAbove(c, "sparkle", { dx: 90 }); }); } },
  { id: "special", cat: "ちんじ", label: "その子らしく", play: c => { SPECIAL[c.kind](c); chime(); } },
];
// ふたりで（相手がいるときだけ）
const DUO = [
  { id: "highfive", label: "ハイタッチ", play: (a, b) => {
      const ca = a.x + 200 * a.s, cb = b.x + 200 * b.s, gap = Math.max(0, (cb - ca) / 2 - 105 * (a.s + b.s));
      a.dx.t = gap; b.dx.t = -gap; a.armR.t = -150; b.armL.t = 150; a.lean.t = -6; b.lean.t = 6;
      later(650, () => { noise(.09, 2200, .5); const p = world(a, 200, 140); [0, 1, 2, 3, 4, 5].forEach(i => { const an = i / 6 * Math.PI * 2; mark("sparkle", ca + gap + 40, p.y, { vx: Math.cos(an) * 260, vy: Math.sin(an) * 260, life: .7, s: .7 }); });
        a.happyOn = b.happyOn = true; jump(a, .4); jump(b, .4); });
      later(1300, () => { a.dx.t = 0; b.dx.t = 0; a.armR.t = 0; b.armL.t = 0; a.lean.t = 0; b.lean.t = 0; a.happyOn = b.happyOn = false; }); } },
  { id: "bow2", label: "いっしょに おじぎ", play: (a, b) => { MOVES.find(m => m.id === "bow").play(a); later(150, () => MOVES.find(m => m.id === "bow").play(b)); } },
  { id: "dance2", label: "いっしょに おどる", play: (a, b) => { MOVES.find(m => m.id === "dance").play(a); hold(b, "dance", 2.6); b.happyOn = true; later(2600, () => b.happyOn = false); } },
  { id: "cheer2", label: "はげまして もらう", play: (a, b) => { MOVES.find(m => m.id === "sad").play(a); later(900, () => MOVES.find(m => m.id === "cheer").play(b)); later(2600, () => MOVES.find(m => m.id === "pump").play(a)); } },
];

/* ---------- ひまなときの小さな動き ---------- */
const IDLE = ["look", "nod", "think", "sleepy"];
function idleTick(c, dt, busy) {
  if (busy || c === speaker || Object.keys(c.tm).length) { c.idleAt = Math.max(c.idleAt, 4); return; }
  c.idleAt -= dt;
  if (c.idleAt < 0) {
    c.idleAt = 7 + Math.random() * 7;
    const r = Math.random();
    const pick = id => MOVES.find(m => m.id === id).play(c);
    if (r < .08) pick(Math.random() < .5 ? "sneeze" : "hiccup");
    else if (r < .5) { c.earL.vel += 120; c.earR.vel -= 120; c.headRot.vel += (Math.random() - .5) * 60; }
    else pick(IDLE[Math.floor(Math.random() * IDLE.length)]);
  }
}
