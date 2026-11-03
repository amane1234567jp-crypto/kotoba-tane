/* ---------- 効果音（すべてその場で合成。素材ファイルなし） ----------
   ctx / audio() は ことばのたね の part_sound.js のものを使う。
   音量は master を通す（キャラの演技の小さな音は part_moves.js が直接鳴らす）。 */
const SFX = (() => {
  let master = null;
  const LV = [0, .45, .8, 1.15];
  function out() {
    audio();
    if (!master) { master = ctx.createGain(); master.connect(ctx.destination); }
    master.gain.value = LV[CFG.sfx] ?? .8;
    return master;
  }
  function tone(f, t0, dur, type = "sine", vol = .2, attack = .005) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + attack);
    g.gain.exponentialRampToValueAtTime(.0008, t0 + dur);
    o.connect(g).connect(out()); o.start(t0); o.stop(t0 + dur + .05);
  }
  function hiss(t0, dur, f, q, vol, sweepTo) {
    const n = Math.max(1, Math.floor(ctx.sampleRate * dur)), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2);
    const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = b; fl.type = "bandpass"; fl.Q.value = q; fl.frequency.setValueAtTime(f, t0);
    if (sweepTo) fl.frequency.exponentialRampToValueAtTime(sweepTo, t0 + dur);
    g.gain.value = vol; s.connect(fl).connect(g).connect(out()); s.start(t0);
  }
  // 木琴の音階（ド→レ→ミ…、最大8段）
  const XYLO = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5];
  const now = () => (out(), ctx.currentTime + .01);
  return {
    place() { const t = now(); hiss(t, .09, 900, 2.5, .9); tone(190, t, .12, "sine", .35, .002); tone(380, t, .06, "triangle", .08, .002); },
    flip(k) { const t = now(), f = XYLO[Math.min(k, 7)]; tone(f, t, .15 * 1.6, "sine", .22); tone(f * 4, t, .06, "sine", .05); tone(f * 2, t, .1, "triangle", .05); },
    sparkle() { const t = now(); [1046.5, 1318.5, 1568, 2093, 2637].forEach((f, i) => tone(f, t + i * .07, .35, "sine", .12)); },
    turn() { const t = now(); tone(659.25, t, .3 * 1.4, "sine", .16, .01); tone(1318.5, t, .2, "sine", .04, .01); },
    swoosh() { const t = now(); hiss(t, .2, 3200, 1.2, .5, 600); },
    ok() { const t = now(); tone(1318.5, t, .2, "sine", .18); },
    ng() { const t = now(); tone(392, t, .2, "triangle", .14); },
    gather(sec) { const t = now(); for (let i = 0; i < sec * 22; i++) { const tt = t + i / 22 + Math.random() * .02; hiss(tt, .03, 1800 + Math.random() * 1600, 4, .5); } },
    // 返した枚数の段階（1〜5）ごとの ごほうびの音。段階が上がるほど 楽器を重ねる
    tier(k) {
      const t = now(), C = [523.25, 659.25, 783.99], up = [1046.5, 1318.5, 1568, 2093];
      if (k === 1) { tone(1568, t, .25, "sine", .08); return; }
      C.forEach(f => tone(f, t, .5, "triangle", .07));                                     // 2：和音
      if (k >= 3) { tone(130.8, t, .45, "sine", .3, .003); hiss(t, .25, 5000, .8, .25); up.forEach((f, i) => tone(f, t + .06 * i, .4, "sine", .06)); } // 3：低音＋シャララ
      if (k >= 4) { hiss(t + .02, .9, 7000, .5, .35, 3000); [783.99, 987.77, 1174.66, 1567.98, 1975.53].forEach((f, i) => tone(f, t + .08 * i, .35, "square", .035)); } // 4：シンバル＋かけあがり
      if (k >= 5) { [[523.25, 0, .14], [659.25, .14, .14], [783.99, .28, .14], [1046.5, .42, .7]].forEach(([f, d, l]) => { tone(f, t + .5 + d, l + .2, "triangle", .14); tone(f / 2, t + .5 + d, l, "sine", .08); }); } // 5：ファンファーレ
    },
    whistle() { const t = now(), o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(2400, t + .7);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.035, t + .05); g.gain.exponentialRampToValueAtTime(.001, t + .75); o.connect(g).connect(out()); o.start(t); o.stop(t + .8); },
    boom(big = 1) { const t = now(); tone(70, t, .9, "sine", .45 * big, .002); hiss(t, .7, 400, .7, .9 * big, 120); hiss(t, .25, 2500, 1, .3); },
    crackle() { const t = now(); for (let i = 0; i < 14; i++) hiss(t + Math.random() * .7, .02, 3000 + Math.random() * 4000, 3, .35); },
    fanfare(gentle) {
      const t = now(), seq = gentle ? [[523.25, 0, .3], [659.25, .3, .3], [783.99, .6, .7]] : [[523.25, 0, .16], [659.25, .16, .16], [783.99, .32, .16], [1046.5, .48, .5], [783.99, .98, .14], [1046.5, 1.12, .6]];
      seq.forEach(([f, d, l]) => { tone(f, t + d, l + .2, gentle ? "sine" : "triangle", gentle ? .14 : .16, .01); if (!gentle) tone(f / 2, t + d, l, "sine", .08, .01); });
    },
  };
})();
