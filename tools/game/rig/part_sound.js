/* ---------- 音 ---------- */
let ctx = null, analyser = null, buf = null;
function audio() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = ctx.createAnalyser(); analyser.fftSize = 1024; analyser.connect(ctx.destination);
    buf = new Float32Array(analyser.fftSize);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}
function blip(f0, f1, dur, type = "sine") {
  if (!ctx || motion === 0) return;
  const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + .02);
}
function chime() {
  if (!ctx) return;
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
    const t = ctx.currentTime + i * .09, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "triangle"; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.14, t + .01); g.gain.exponentialRampToValueAtTime(.001, t + .5);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + .55);
  });
}
let speaker = null;
function speak(c, key, text) {
  return new Promise(res => {
    audio();
    const a = new Audio(AUD[key]);
    const src = ctx.createMediaElementSource(a); src.connect(analyser);
    speaker = c; say(c, text);
    a.onended = () => { speaker = null; c.speakingLevel = 0; unsay(c); res(); };
    a.play().catch(() => { speaker = null; unsay(c); res(); });
  });
}
function level() {
  if (!analyser) return 0;
  analyser.getFloatTimeDomainData(buf);
  let s = 0; for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i];
  const rms = Math.sqrt(s / buf.length);
  return Math.max(0, Math.min(1, (rms - 0.015) * 9));
}

/* ---------- 紙吹雪 ---------- */
const bits = [];
function confetti(n = 70) {
  const cols = ["#FF6F91", "#FFD25E", "#7FCBF0", "#7CC36A", "#B9A8D9"];
  n = Math.round(n * Math.max(.15, motion));
  for (let i = 0; i < n; i++) {
    const r = el("rect", { width: 18, height: 10, rx: 3, fill: cols[i % cols.length], stroke: INK, "stroke-width": 2 }, fxLayer);
    bits.push({ r, x: 800 + (Math.random() - .5) * 300, y: 520, vx: (Math.random() - .5) * 900, vy: -700 - Math.random() * 600, a: Math.random() * 360, va: (Math.random() - .5) * 720, life: 2.4 });
  }
}
function stepBits(dt) {
  for (let i = bits.length - 1; i >= 0; i--) {
    const b = bits[i]; b.vy += 1400 * dt; b.vx *= .99; b.x += b.vx * dt; b.y += b.vy * dt; b.a += b.va * dt; b.life -= dt;
    b.r.setAttribute("transform", `translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) rotate(${b.a.toFixed(0)})`);
    if (b.life < 0 || b.y > 1050) { b.r.remove(); bits.splice(i, 1); }
  }
}

