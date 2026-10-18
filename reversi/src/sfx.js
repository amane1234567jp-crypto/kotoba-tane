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
    fanfare(gentle) {
      const t = now(), seq = gentle ? [[523.25, 0, .3], [659.25, .3, .3], [783.99, .6, .7]] : [[523.25, 0, .16], [659.25, .16, .16], [783.99, .32, .16], [1046.5, .48, .5], [783.99, .98, .14], [1046.5, 1.12, .6]];
      seq.forEach(([f, d, l]) => { tone(f, t + d, l + .2, gentle ? "sine" : "triangle", gentle ? .14 : .16, .01); if (!gentle) tone(f / 2, t + d, l, "sine", .08, .01); });
    },
  };
})();
