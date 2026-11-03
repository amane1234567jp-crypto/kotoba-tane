/* ---------- はでな演出（ドパドリル風：返す枚数が多いほど、重ねて はでにする） ----------
   画面いっぱいの canvas に、火花・衝撃の輪・光の筋・紙ふぶき・花火を描く。
   設定「えんしゅつ」：2＝はで（初期値）、1＝ひかえめ（ゆれ・フラッシュなし、粒は少なめ）。 */
const FX = (() => {
  const cv = document.getElementById("fx"), g = cv.getContext("2d");
  let W = 0, H = 0, dpr = 1;
  const parts = [], rings = [], rays = [], rockets = [];
  let flash = 0, flashCol = "255,255,255";
  const night = { a: 0, to: 0 };   // 花火のときは 夜空にして 光を目立たせる（キャラは上の層なので明るいまま）
  function size() {
    dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + "px"; cv.style.height = H + "px";
  }
  addEventListener("resize", size); size();
  const amt = () => (CFG.fx === 1 ? .45 : 1) * Math.max(.3, motion);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const PAL = ["#FF6F91", "#FFD25E", "#7FE3C9", "#7FCBF0", "#B9A8D9", "#FF9F45", "#FFFFFF"];
  const GOLD = ["#FFF3B0", "#FFD25E", "#FFB13B", "#FFFFFF"];

  // 粒：kind = spark（光る点・尾つき）／star（きらきら）／paper（紙ふぶき）
  function burst(x, y, o = {}) {
    const n = Math.round((o.n || 20) * amt()), cols = o.cols || GOLD;
    for (let i = 0; i < n; i++) {
      const a = o.angle != null ? o.angle + rnd(-o.spread, o.spread) : rnd(0, Math.PI * 2), sp = rnd(o.min || 120, o.max || 420);
      parts.push({ kind: o.kind || "spark", x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: o.g ?? 500, drag: o.drag ?? 1.6,
        life: rnd(o.life || .7, (o.life || .7) * 1.5), t: 0, size: rnd(o.size || 3, (o.size || 3) * 1.8), col: cols[i % cols.length],
        rot: rnd(0, 6.28), vr: rnd(-12, 12), px: x, py: y, twinkle: o.twinkle });
    }
  }
  function ring(x, y, r1, col = "255,226,122", life = .55, w = 10) { rings.push({ x, y, r0: 6, r1, t: 0, life, col, w }); }
  function rayBurst(x, y, n, len, col = "255,240,180") { const a0 = rnd(0, 6.28); for (let i = 0; i < n; i++) rays.push({ x, y, a: a0 + i * 6.283 / n, len, t: 0, life: .7, col }); }
  function doFlash(v, col = "255,255,255") { if (CFG.fx === 1) return; flash = Math.max(flash, v); flashCol = col; }
  function rain(n, x0 = 0, x1 = W) { // 上から紙ふぶきが降る
    n = Math.round(n * amt());
    for (let i = 0; i < n; i++) parts.push({ kind: "paper", x: rnd(x0, x1), y: rnd(-H * .3, -10), vx: rnd(-60, 60), vy: rnd(80, 220), g: 120, drag: .4,
      life: rnd(2.6, 4), t: 0, size: rnd(7, 12), col: PAL[i % PAL.length], rot: rnd(0, 6.28), vr: rnd(-8, 8), sway: rnd(1.5, 3.5) });
  }
  function shake(el, power) {
    if (CFG.fx === 1 || motion < .5) return;
    const k = power * 9;
    el.animate([{ transform: "none" }, { transform: `translate(${-k}px, ${k * .5}px) rotate(-.4deg)` }, { transform: `translate(${k}px, ${-k * .6}px) rotate(.4deg)` },
      { transform: `translate(${-k * .6}px, ${k * .3}px)` }, { transform: `translate(${k * .3}px, 0)` }, { transform: "none" }], { duration: 420 + power * 80, easing: "ease-out" });
  }

  /* 花火：下から打ち上げ、てっぺんで はじける */
  function rocket(x, yTop, cols, big = 1) {
    rockets.push({ x, y: H + 10, vx: rnd(-40, 40), vy: -Math.sqrt(2 * 900 * (H + 10 - yTop)), tx: yTop, cols, big, t: 0 });
    SFX.whistle();
  }
  function explode(r) {
    const n = Math.round(90 * r.big), cols = r.cols, style = Math.floor(rnd(0, 3));
    for (let i = 0; i < n * amt(); i++) {
      const a = (i / n) * 6.283 + rnd(-.05, .05), sp = (style === 1 ? 300 : rnd(180, 360)) * r.big;
      parts.push({ kind: "spark", x: r.x, y: r.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 160, drag: 1.1, life: rnd(1.1, 1.7), t: 0,
        size: rnd(3.4, 5.2), col: cols[i % cols.length], px: r.x, py: r.y, twinkle: style === 2 });
    }
    if (style === 1) burst(r.x, r.y, { n: 30, cols: ["#FFFFFF"], min: 60, max: 140, life: 1, g: 100, size: 2.5 }); // しんの ある 花火
    ring(r.x, r.y, 160 * r.big, "255,255,255", .35, 6);
    doFlash(.18 * r.big, "255,240,220");
    SFX.boom(r.big);
    setTimeout(() => SFX.crackle(), 450);
  }
  function fireworks(sec, xFrom, xTo, cols) {
    const end = performance.now() + sec * 1000;
    const fire = () => {
      if (performance.now() > end) return;
      rocket(rnd(xFrom, xTo), rnd(H * .12, H * .42), cols || [PAL[Math.floor(rnd(0, 6))], PAL[Math.floor(rnd(0, 6))], "#FFFFFF"], rnd(.85, 1.25));
      setTimeout(fire, rnd(260, 520) / Math.max(.6, amt()));
    };
    fire();
  }

  function step(dt) {
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    night.a += (night.to - night.a) * Math.min(1, dt * 2.2);
    if (night.a > .01) {
      const sky = g.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, `rgba(14,18,52,${night.a})`); sky.addColorStop(1, `rgba(40,30,80,${night.a * .75})`);
      g.fillStyle = sky; g.fillRect(0, 0, W, H);
    }
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i]; r.t += dt; r.vy += 900 * dt; r.x += r.vx * dt; r.y += r.vy * dt;
      parts.push({ kind: "spark", x: r.x, y: r.y, vx: rnd(-20, 20), vy: rnd(10, 60), g: 0, drag: 2, life: .35, t: 0, size: 2.2, col: "#FFE8A8", px: r.x, py: r.y });
      if (r.vy >= 0) { explode(r); rockets.splice(i, 1); }
    }
    g.globalCompositeOperation = "lighter";
    for (let i = rays.length - 1; i >= 0; i--) {
      const r = rays[i]; r.t += dt; const p = r.t / r.life; if (p >= 1) { rays.splice(i, 1); continue; }
      const L = r.len * (.4 + .6 * Math.sin(Math.min(1, p * 1.6) * 1.57)), w = 16 * (1 - p);
      const gr = g.createLinearGradient(r.x, r.y, r.x + Math.cos(r.a) * L, r.y + Math.sin(r.a) * L);
      gr.addColorStop(0, `rgba(${r.col},${.75 * (1 - p)})`); gr.addColorStop(1, `rgba(${r.col},0)`);
      g.strokeStyle = gr; g.lineWidth = w; g.lineCap = "round";
      g.beginPath(); g.moveTo(r.x, r.y); g.lineTo(r.x + Math.cos(r.a) * L, r.y + Math.sin(r.a) * L); g.stroke();
    }
    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i]; r.t += dt; const p = r.t / r.life; if (p >= 1) { rings.splice(i, 1); continue; }
      const e = 1 - Math.pow(1 - p, 3);
      g.strokeStyle = `rgba(${r.col},${(1 - p) * .9})`; g.lineWidth = r.w * (1 - p) + 1;
      g.beginPath(); g.arc(r.x, r.y, r.r0 + (r.r1 - r.r0) * e, 0, 6.283); g.stroke();
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.t += dt; if (q.t >= q.life) { parts.splice(i, 1); continue; }
      q.px = q.x; q.py = q.y;
      const d = Math.exp(-q.drag * dt); q.vx *= d; q.vy = q.vy * d + q.g * dt;
      if (q.sway) q.vx += Math.sin(q.t * q.sway * 2) * 40 * dt;
      q.x += q.vx * dt; q.y += q.vy * dt; q.rot += q.vr * dt;
      const fade = Math.min(1, (q.life - q.t) * 3);
      if (q.kind === "paper") {
        g.globalCompositeOperation = "source-over";
        g.save(); g.translate(q.x, q.y); g.rotate(q.rot); g.scale(1, Math.abs(Math.cos(q.t * 6 + q.rot)));
        g.globalAlpha = fade; g.fillStyle = q.col; g.fillRect(-q.size / 2, -q.size / 3, q.size, q.size * .66); g.restore();
        g.globalAlpha = 1; g.globalCompositeOperation = "lighter";
      } else if (q.kind === "star") {
        const s = q.size * (1 + .3 * Math.sin(q.t * 18));
        g.save(); g.translate(q.x, q.y); g.rotate(q.rot); g.globalAlpha = fade; g.fillStyle = q.col;
        g.beginPath(); for (let k = 0; k < 8; k++) { const rr = k % 2 ? s * .35 : s; const a = k * .785; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.fill(); g.restore(); g.globalAlpha = 1;
      } else {
        const tw = q.twinkle ? (Math.sin(q.t * 40 + q.rot * 10) > 0 ? 1 : .25) : 1;
        g.globalAlpha = fade * tw; g.strokeStyle = q.col; g.lineWidth = q.size; g.lineCap = "round";
        g.beginPath(); g.moveTo(q.px - q.vx * .02, q.py - q.vy * .02); g.lineTo(q.x, q.y); g.stroke(); g.globalAlpha = 1;
      }
    }
    g.globalCompositeOperation = "source-over";
    if (flash > .005) { g.fillStyle = `rgba(${flashCol},${flash})`; g.fillRect(0, 0, W, H); flash *= Math.exp(-7 * dt); }
  }

  function tierOf(n) { return n >= 12 ? 5 : n >= 8 ? 4 : n >= 5 ? 3 : n >= 3 ? 2 : 1; }
  const colsOf = color => color === BLACK ? ["#C9C9FF", "#FFFFFF", "#FFD25E"] : ["#FFFFFF", "#FFF3B0", "#7FE3C9"];
  /* ---- 1枚返るたび：L 枚目ほど 豪華に（火花→輪→星と光の筋→ゆれ） ---- */
  /* 全体の枚数 n による 強さ（少ない枚数は控えめ、11枚以上で いまの最大と同じ） */
  const amp = n => .3 + .7 * Math.pow(Math.min(1, (n - 1) / 10), 1.3);
  function flipHit(x, y, L, n, color, boardEl) {
    const a = amp(n);
    const cols = L >= 5 ? [...colsOf(color), ...GOLD] : colsOf(color);
    burst(x, y, { n: Math.max(3, Math.round((6 + L * 3) * a)), cols, min: 60 + 20 * a, max: (140 + 60 * a) + L * 35, life: .35 + .1 * a + L * .02, size: 1.8 + .6 * a + Math.min(2, L * .15), g: 200 });
    if (L >= 3) ring(x, y, 40 + L * 9, "255,236,160", .4, 4 + L * .5);
    if (L >= 5) burst(x, y, { kind: "star", n: 2 + Math.floor(L / 2), cols: GOLD, min: 120, max: 260 + L * 15, life: .7, size: 7, g: 240 });
    if (L >= 7) rayBurst(x, y, 6 + L, 50 + L * 10);
    if (L >= 9) shake(boardEl, Math.min(2, (L - 7) * .4));
  }
  /* ---- 最後の1枚：いちばんの見せ場。全体の枚数 n の段階（1〜5）で 重ねる ---- */
  function climax(x, y, n, color, scoreEl, boardEl) {
    const t = tierOf(n), cols = [...colsOf(color), ...GOLD];
    const a = amp(n);
    SFX.tier(t, a);
    burst(x, y, { n: Math.round((14 + n * 4) * a), cols, min: 90 + 30 * a, max: (160 + 100 * a) + n * 30, life: .45 + .15 * a + t * .08, size: 2.2 + .8 * a + t * .4, g: 220 });
    if (t >= 2) ring(x, y, (40 + 30 * a) + t * 45, "255,226,122", .45 + .1 * a, 4 + 4 * a + t * 2);
    if (t >= 3) { rayBurst(x, y, 10 + t * 3, 120 + t * 60); burst(x, y, { kind: "star", n: 8 + t * 4, cols: GOLD, min: 140, max: 380 + t * 40, life: .95, size: 9, g: 260 }); shake(boardEl, t - 1.5); }
    if (t >= 4) {
      doFlash(.3 + (t - 4) * .15); ring(x, y, 420, "255,255,255", .7, 14);
      rain(t === 4 ? 80 : 160);
      // 星が 自分の 石の数へ 飛んでいく（「ふえた」が目で見える）
      const r = scoreEl.getBoundingClientRect(), tx = r.left + r.width / 2, ty = r.top + r.height / 2, a = Math.atan2(ty - y, tx - x);
      burst(x, y, { kind: "star", n: 10, cols: ["#FFE27A"], angle: a, spread: .45, min: 500, max: 820, life: .9, g: 0, drag: .6, size: 10 });
    }
    if (t >= 5) { const br = boardEl.getBoundingClientRect(), cx = Math.min(br.right - 160, Math.max(br.left + 160, x)), cy = Math.max(br.top + 120, Math.min(br.bottom - 160, y - 100));
      [0, 220, 440].forEach((ms, i) => setTimeout(() => explode({ x: cx + (i - 1) * 140, y: cy - (i % 2) * 60, cols: PAL, big: .95 }), ms)); }
    return t;
  }
  /* ---- 勝ったとき：勝った側の上を中心に花火。ひきわけは両方に少しずつ ---- */
  function victory(winRect, draw) {
    if (CFG.fx !== 1) { night.to = .62; setTimeout(() => { night.to = 0; }, draw ? 5000 : 9500); }
    if (draw) { fireworks(3.5, W * .15, W * .85, ["#FFFFFF", "#7FE3C9", "#FFD25E"]); rain(80); return; }
    const cx = winRect.left + winRect.width / 2;
    fireworks(7, Math.max(40, cx - W * .3), Math.min(W - 40, cx + W * .3));
    setTimeout(() => fireworks(4, W * .2, W * .8), 1500);
    rain(160); setTimeout(() => rain(120), 1800);
    doFlash(.5, "255,236,170");
  }
  return { step, burst, ring, flipHit, climax, victory, tierOf };
})();
