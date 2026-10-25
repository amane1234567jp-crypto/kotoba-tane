/* ================= ロングコース「でたらめ がっこう」（detarame、2026-10-25） =================
   へんな こうちょう（いつもの かめじいこうちょう…なのに なにか ちがう）が ありえない ことを いう → キレの ある つっこみ！
   ロボ・ヤンキー・くいしんぼう・どろぼう・あかちゃん・おうさま。すすむ・もどる・ワープなどの しかけも へんな こうちょうの しわざ。
   データ・声：sit/detarame_gen.py（DT）・ぽにー sit/pony_detarame.json・こうちょう Aivis jobs/dt1（ロボの 声は ロボっぽく かこう） */
const DTS = "detarame";
/* ---------- へんな こうちょうの すがた（かめじいを もとに、かざりを たす） ---------- */
const DT_KIND = { robo: "kameRobo", yan: "kameYan", kui: "kameKui", doro: "kameDoro", baby: "kameBaby", king: "kameKing" };
function dtRecolor(root, map) { root.querySelectorAll("[fill]").forEach(e => { const f = (e.getAttribute("fill") || "").toUpperCase(); if (map[f]) e.setAttribute("fill", map[f]); }); }
Object.assign(BUILD, {
  kameRobo(root) { const p = BUILD.kamejii(root), h = p.head.g;
    dtRecolor(root, { "#8CC27A": "#B8C4D0", "#8A6A3C": "#6E7886", "#F3E3B3": "#DDE6EE" });
    el("path", { d: "M200 80 V22", ...ST(6) }, h); el("circle", { cx: 200, cy: 18, r: 14, fill: "#E8473C", ...ST(5) }, h);
    [98, 302].forEach(x => { el("rect", { x: x - 14, y: 150, width: 28, height: 40, rx: 6, fill: "#8E99A8", ...ST(5) }, h); el("circle", { cx: x, cy: 170, r: 5, fill: "#F2C200" }, h); });
    [160, 240].forEach(x => el("rect", { x: x - 24, y: 152, width: 48, height: 36, rx: 8, fill: "#9FE8FF", opacity: .55, ...ST(5) }, h));
    const pnl = el("g", {}); root.insertBefore(pnl, p.arms[0].g);
    el("rect", { x: 160, y: 300, width: 80, height: 54, rx: 8, fill: "#4A5361", ...ST(4) }, pnl); [["#E8473C", 178], ["#7BD389", 200], ["#F2C200", 222]].forEach(([c, x]) => el("circle", { cx: x, cy: 318, r: 7, fill: c }, pnl));
    el("rect", { x: 172, y: 334, width: 56, height: 8, rx: 3, fill: "#9FE8FF" }, pnl); return p; },
  kameYan(root) { const p = BUILD.kamejii(root), h = p.head.g;
    el("path", { d: "M150 92 L160 30 L176 86 L190 18 L204 82 L220 22 L232 88 L248 36 L252 96 Q200 70 150 92 Z", fill: "#E8473C", ...ST(5) }, h);
    el("path", { d: "M118 152 Q160 140 196 152 L192 186 Q160 200 124 186 Z M204 152 Q240 140 282 152 L276 186 Q240 200 208 186 Z", fill: "#1F1F2A", ...ST(5) }, h);
    el("path", { d: "M196 158 Q200 154 204 158", fill: "none", ...ST(5) }, h); el("path", { d: "M134 160 L150 156", stroke: "#FFFFFF", "stroke-width": 5, "stroke-linecap": "round", opacity: .7 }, h);
    const ch = el("g", {}); root.insertBefore(ch, p.arms[0].g); for (let i = 0; i < 9; i++) el("circle", { cx: 150 + i * 12.5, cy: 268 + Math.sin(i / 8 * Math.PI) * 26, r: 7, fill: "#F2C200", ...ST(3) }, ch); return p; },
  kameKui(root) { const p = BUILD.kamejii(root), h = p.head.g;
    root.querySelectorAll("ellipse").forEach(e => { const rx = +e.getAttribute("rx"), cy = +e.getAttribute("cy");
      if (rx === 90 && cy === 326) { e.setAttribute("rx", 138); e.setAttribute("ry", 86); e.setAttribute("cy", 316); } if (rx === 64 && cy === 330) { e.setAttribute("rx", 108); e.setAttribute("ry", 68); e.setAttribute("cy", 320); } });
    root.querySelectorAll("path").forEach(e => { if ((e.getAttribute("d") || "").startsWith("M200 278")) e.setAttribute("d", "M200 256 V384 M108 310 H292 M118 346 H282"); });
    [128, 272].forEach(x => el("circle", { cx: x, cy: 210, r: 26, fill: "#FF9EB0", opacity: .75 }, h));
    [[150, 262], [236, 290], [178, 300]].forEach(([x, y]) => el("circle", { cx: x, cy: y, r: 5, fill: "#C98A4B" }, h)); return p; },
  kameDoro(root) { const p = BUILD.kamejii(root), h = p.head.g;
    const bag = el("g", {}); root.insertBefore(bag, root.firstChild); el("ellipse", { cx: 112, cy: 280, rx: 74, ry: 62, fill: "#3E9E5A", ...ST(6) }, bag);
    for (let i = 0; i < 5; i++) el("path", { d: `M${72 + i * 18} ${250 + (i % 2) * 30} q12 -14 24 0 q-12 14 -24 0`, fill: "none", stroke: "#FFFFFF", "stroke-width": 4 }, bag);
    el("path", { d: "M100 186 Q96 70 200 64 Q304 70 300 186 Q260 140 200 140 Q140 140 100 186 Z", fill: "#3E9E5A", ...ST(6) }, h);
    [[140, 100], [200, 90], [260, 100], [170, 124], [232, 124]].forEach(([x, y]) => el("path", { d: `M${x - 12} ${y} q6 -12 12 0 q6 12 12 0`, fill: "none", stroke: "#FFFFFF", "stroke-width": 4 }, h));
    el("path", { d: "M100 186 Q78 214 60 206 M100 186 Q84 226 66 232", fill: "none", stroke: "#3E9E5A", "stroke-width": 14, "stroke-linecap": "round" }, h);
    for (let i = 0; i < 14; i++) el("circle", { cx: 150 + (i * 37) % 100, cy: 248 + (i * 23) % 50, r: 3, fill: "#4A4A58", opacity: .7 }, h); return p; },
  kameBaby(root) { const p = BUILD.kamejii(root), h = p.head.g;
    el("path", { d: "M92 196 Q80 60 200 56 Q320 60 308 196 Q292 120 200 112 Q108 120 92 196 Z", fill: "#FFC2D9", ...ST(6) }, h);
    el("path", { d: "M110 150 Q200 92 290 150", fill: "none", stroke: "#FFFFFF", "stroke-width": 6, "stroke-dasharray": "10 8" }, h);
    el("path", { d: "M92 196 Q100 236 128 250 M308 196 Q300 236 272 250", fill: "none", stroke: "#FF8FB8", "stroke-width": 8, "stroke-linecap": "round" }, h);
    el("circle", { cx: 200, cy: 238, r: 22, fill: "#7FCBF0", ...ST(5) }, h); el("ellipse", { cx: 200, cy: 238, rx: 34, ry: 12, fill: "#FFD25E", ...ST(4) }, h); el("circle", { cx: 200, cy: 262, r: 10, fill: "none", ...ST(5) }, h);
    const bib = el("g", {}); root.insertBefore(bib, p.arms[0].g); el("path", { d: "M150 270 Q200 260 250 270 Q256 320 200 334 Q144 320 150 270 Z", fill: "#FFFFFF", ...ST(5) }, bib);
    el("path", { d: "M180 296 q20 16 40 0", fill: "none", stroke: "#FF8FB8", "stroke-width": 5 }, bib); return p; },
  kameKing(root) { const p = BUILD.kamejii(root), h = p.head.g;
    const cape = el("g", {}); root.insertBefore(cape, root.firstChild); el("path", { d: "M110 250 Q60 330 70 410 L330 410 Q340 330 290 250 Z", fill: "#D8343F", ...ST(6) }, cape);
    el("path", { d: "M100 252 Q200 222 300 252", fill: "none", stroke: "#FFFFFF", "stroke-width": 18, "stroke-linecap": "round" }, cape);
    el("path", { d: "M138 92 L132 30 L166 62 L200 18 L234 62 L268 30 L262 92 Z", fill: "#F2C200", ...ST(6) }, h);
    [[166, 76, "#E8473C"], [200, 70, "#3E7FD6"], [234, 76, "#7BD389"]].forEach(([x, y, c]) => el("circle", { cx: x, cy: y, r: 9, fill: c, ...ST(3) }, h)); return p; },
});
const DT_CH = {}; Object.values(DT_KIND).forEach(k => { const c = makeChar(k); c.root.style.display = "none"; C[k] = c; chars.push(c); DT_CH[k] = c; });
Object.values(DT_KIND).forEach(k => { ASK_AT[k] = [1170, .9]; NAMES[k] = "こうちょうせんせい"; });
/* ロボの 声は ロボっぽく（すこし ゆれる 金ぞくの こえ） */
DT.t.filter(t => t.v === "robo").forEach(t => { VFX[`dt_${t.id}_b`] = "robo"; VFX[`dt_${t.id}_r`] = "robo"; });
["hi_robo", "ev_warp", "ev_allb", "ev_call"].forEach(k => VFX[`dt_${k}`] = "robo");

/* ---------- マスの ならび（48マス・4だん） ---------- */
{ const PL = [null, "dt", "e:dice2", "dt", "stop", "e:fake", "dt", "e:warp", "dt", "e:nebou", "cups", "dt",
    "e:trolley", "dt", "e:rand", "dt", "balloon", "e:x2", "dt", "e:home", "dt", null, "e:again", "dt",
    "catch", "e:zero", "dt", "e:warp", "dt", "e:allb", "more", "dt", "e:call", "dt", "e:back10", "dt",
    "e:bonus", "battle", "dt", "e:allf", "dt", "e:atsumare", "dt", "e:janken", "dt", "e:rest", "dt", null];
  const O = SL_ORDER[DTS], ev = {}, task = {};
  O.forEach((id, i) => { const p = PL[i]; if (!p || id === "0" || id === "4" || id === "15") return;
    if (p.startsWith("e:")) { const t = p.slice(2); ev[id] = [t, 0, `dt_ev_${t}`, DT.ev[t].text]; } else task[id] = p; });
  EVENTS[DTS] = ev; LONG_TASKS[DTS] = task;
  LEGENDS[DTS] = [["dt", "つっこみ"], ["stop", "おもしろ"]]; }
SL_VEH[DTS] = { warp: "🚀", bigwarp: "🚀", home: "👟" };
LTASK.dt = ["#FFE27A", "🤪"];

/* ---------- 盤の え ---------- */
BOARD_BG[DTS] = L => { const T = SL_TH[DTS];
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: T.ground }, L);
  for (let i = 0; i < 26; i++) txt(L, (i * 263) % 1600, 150 + (i * 173) % 850, ["？", "！", "♪", "★"][i % 4], 40 + (i % 3) * 12, { fill: ["#FF8FA3", "#7FCBF0", "#B9A8D9", "#FFD25E"][i % 4], opacity: .35, transform: `rotate(${(i * 37) % 60 - 30} ${(i * 263) % 1600} ${150 + (i * 173) % 850})` });
  const I4 = ["🏫", "📚", "⚽", "🌇"];
  DT_ROWS.forEach((y, r) => { el("rect", { x: 30, y: y - 88, width: 1540, height: 176, rx: 88, fill: T.fills[r], ...S6(4) }, L);
    const x = r === 3 ? 1520 : 80; txt(L, x, y + 6, I4[r], 46, { "text-anchor": "middle" }); txt(L, x, y + 44, T.areas[r], T.areas[r].length > 3 ? 17 : 20, { "text-anchor": "middle" }); });
  Object.entries(EVENTS[DTS] || {}).forEach(([id, [type]]) => { const to = slWarpTo(DTS, id, type); if (!to || !NODES[id] || !NODES[to]) return; const [x1, y1] = NODES[id], [x2, y2] = NODES[to];
    el("path", { d: `M${x1} ${y1} Q${(x1 + x2) / 2 + 160} ${(y1 + y2) / 2} ${x2} ${y2}`, fill: "none", stroke: "#8E5BD6", "stroke-width": 6, "stroke-dasharray": "16 14", opacity: .6 }, L); });
  el("rect", { x: 935, y: 40, width: 350, height: 68, rx: 12, fill: "#F08A3C", stroke: "#8B5A2B", "stroke-width": 8 }, L);
  txt(L, 1110, 86, `${T.icon} ${T.name}`, 32, { "text-anchor": "middle", fill: "#FFFFFF" }); };

/* ---------- 声の パック ---------- */
{ const lp = loadPack; loadPack = async function (id) { const r = await lp(id); if (id !== DTS) return r;
    if (!PACK.loaded[id]) { try { const q = await fetch(`packs/${id}.json`, { cache: "no-cache" }); if (q.ok) { const d = await q.json(); Object.keys(d).forEach(k => AUD[k] = "data:audio/mpeg;base64," + d[k]); PACK.loaded[id] = Object.keys(d); } } catch (e) { } }
    if (AUD["bgm_" + id]) await voiceBuf("bgm_" + id); return true; }; }
{ const ap = applyStage; applyStage = function (id, ...a) { if (id === DTS) { DT_N.clear(); DT_SEEN.clear(); DT_LAST.v = null; } return ap(id, ...a); }; }
const DT_N = new Map(), DT_SEEN = new Set(), DT_LAST = { v: null };

/* ---------- 🤪 つっこみ ---------- */
function dtPick() { let pool = DT.t.filter(t => t.v !== DT_LAST.v); const m = Math.min(...pool.map(t => DT_N.get(t.id) || 0)); pool = pool.filter(t => (DT_N.get(t.id) || 0) === m); const it = pool[rnd(pool.length)]; DT_N.set(it.id, m + 1); DT_LAST.v = it.v; return it; }
const dtTxt = k => DT.txt[k] || "";
function dtPoof(x, y, n = 14) { noise(.25, 900, .5); for (let i = 0; i < n; i++) mark("puff", x + (rnd(160) - 80), y + (rnd(160) - 80), { vx: (rnd(400) - 200), vy: -(rnd(200) + 60), life: .8, s: .9 }); }
const DT_MOVE = { robo: "shake", yan: "dance", kui: "laugh", doro: "think", baby: "shake", king: "pump" };
function dtActs(a, v) { // ボケの あいだの うごき
  if (v === "robo") { for (let i = 0; i < 8; i++) later(i * 180, () => { a.headRot.t = i % 2 ? 10 : -10; a.armL.t = i % 2 ? -80 : 0; a.armR.t = i % 2 ? 0 : 80; blip(700 + (i % 3) * 300, 700 + (i % 3) * 300, .05, "square"); }); later(1500, () => { a.headRot.t = 0; a.armL.t = 0; a.armR.t = 0; }); }
  else if (v === "yan") { a.lean.t = -14; hold(a, "run", 1.4); later(1500, () => a.lean.t = 0); }
  else if (v === "kui") { for (let i = 0; i < 6; i++) later(i * 260, () => { a.mouthOpen.t = i % 2 ? 0 : .9; a.armR.t = i % 2 ? 0 : -120; }); later(1600, () => { a.mouthOpen.t = 0; a.armR.t = 0; }); }
  else if (v === "doro") { a.dx.t = -60; later(500, () => a.dx.t = 60); later(1000, () => a.dx.t = 0); markAbove(a, "q"); }
  else if (v === "baby") { for (let i = 0; i < 6; i++) later(i * 220, () => { a.headRot.t = i % 2 ? 14 : -14; }); later(1400, () => a.headRot.t = 0); }
  else if (v === "king") { a.armL.t = -150; a.armR.t = 150; jump(a, .5); later(1400, () => { a.armL.t = 0; a.armR.t = 0; }); } }
// ハリセンで「スパーン！」
async function dtHarisen(h, a) { const g = el("g", {}, front()), p0 = headTop(h), p1 = headTop(a);
  const fan = el("g", {}, g); el("path", { d: "M0 0 L150 -60 L170 -20 L160 20 L150 60 Z", fill: "#FFFFFF", ...S6(5) }, fan); for (let i = 1; i < 5; i++) el("path", { d: `M0 0 L${150 + i * 4} ${-60 + i * 24}`, ...S6(3) }, fan);
  el("rect", { x: -60, y: -10, width: 64, height: 20, rx: 6, fill: "#E8473C", ...S6(4) }, fan);
  playMove(h, "point");
  await tween(380, k => { const x = p0.x + (p1.x - 150 - p0.x) * k, y = p0.y + 40 + (p1.y + 40 - p0.y - 40) * k - Math.sin(k * Math.PI) * 160; fan.setAttribute("transform", `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${(-70 + 110 * k).toFixed(0)})`); });
  noise(.12, 3200, .7); blip(1800, 500, .12, "square"); boom(.25); surprise(a); a.lean.t = 26; markAbove(a, "ex");
  const st = el("g", {}, front()); const tt = el("text", { x: p1.x - 40, y: p1.y - 30, "text-anchor": "middle", "font-family": FONT, "font-size": 86, fill: "#FF9E5E", stroke: INK, "stroke-width": 9, "paint-order": "stroke", "stroke-linejoin": "round", transform: `rotate(-12 ${p1.x - 40} ${p1.y - 30})` }, st); tt.textContent = "スパーン！"; later(1100, () => st.remove()); await sleep(700); g.remove(); a.lean.t = 0; }
async function dtScene(pc) {
  const it = dtPick(), kind = DT_KIND[it.v], t = tierOf(), lv = t <= 0 ? 0 : t <= 2 ? 1 : 2, line = it.ts[lv];
  showEngine(null, `でたらめ（${it.id}・${DT.v[it.v].name}・段${lv + 1}）`);
  const { hero: h, ask: a } = setSitView({ id: "dt_" + it.id, place: it.place, asker: kind, intro: "dt" }, pc.kind);
  a.dx.v = a.dx.t = 0; a.root.style.display = "none"; enter(h); await sleep(700);
  if (!DT_N.get("_intro")) { DT_N.set("_intro", 1); await speak(C.pony, "dtp_intro", dtTxt("dtp_intro")); }
  const ap = headTop(a); dtPoof(ap.x, ap.y + 150, 18); await sleep(200); a.root.style.display = ""; jump(a, .8); await sleep(400);
  if (!DT_SEEN.has(it.v)) { DT_SEEN.add(it.v); playMove(a, DT_MOVE[it.v]); await speak(a, `dt_hi_${it.v}`, DT.v[it.v].hi); unsay(); }
  let bike = null; if (it.id === "y1") { // じてんしゃで ろうかを はしりまくる（2026-10-25）
    bike = el("g", {}); bikeG(bike); follow(bike, () => { const q = world(a, 200, a.base - 50); return [q.x, q.y, 0, a.s * .7]; });
    hold(a, "run", 3.2); [[0, 260], [700, -320], [1400, 220], [2100, -180], [2800, 0]].forEach(([t, x]) => later(t, () => { a.dx.t = x; })); for (let i = 0; i < 5; i++) later(i * 500, () => noise(.25, 500, .35)); }
  if (it.id !== "y1") dtActs(a, it.v); await speak(a, `dt_${it.id}_b`, it.boke); unsay();
  surprise(C.pony); markAbove(C.pony, "ex"); await speak(C.pony, "dtp_go", dtTxt("dtp_go"));
  showTask(line, "つっこもう！", 260);
  let ok = false; const tries = [];
  for (let n = 0; n < 2 && !ok; n++) {
    await speak(C.pony, `dtp_${it.id}_${lv}`, line); unsay(); // ぽにーの お手本は いつも（2026-10-25）
    setListen(h, true); LISTEN_TAIL = true; const r = await listen(it.keys, 10000).finally(() => LISTEN_TAIL = false); setListen(h, false);
    tries.push(`${r.r === "ok" ? "○" : r.r === "part" ? "△" : "×"}${r.heard || ""}`); ok = r.r === "ok";
    if (!ok && n === 0) await speak(C.pony, "p_again", "もう いっかい いってみよう"); }
  hideTask(); grade(ok); GS.tasks++;
  playLog({ type: "detarame", id: it.id, v: it.v, tier: lv, ok, answer: line, tries, ...(MODE === "multi" ? { who: NAMES[pc.kind] } : {}) });
  if (ok) { await dtHarisen(h, a); const st = slam("ナイス つっこみ！", 330, 140, "#FF9E5E"); later(1400, () => st.remove()); confetti(40); playMove(h, "pump"); }
  else { await speak(C.pony, "dtp_ng", dtTxt("dtp_ng")); await speak(C.pony, `dtp_${it.id}_${lv}`, line); unsay(); }
  if (bike) { await sleep(200); bike.remove(); a.dx.t = 0; jump(a, .4); }
  await speak(a, `dt_${it.id}_r`, it.res); unsay();
  // もとの かめじいこうちょうに もどる
  const q = headTop(a); dtPoof(q.x, q.y + 150, 18); await sleep(150); const kj = C.kamejii; resetChar(kj); kj.dx.v = kj.dx.t = 0; place(kj, ASK_AT.kamejii[0], 975, ASK_AT.kamejii[1]); a.root.style.display = "none"; show(kj); playMove(kj, "nod"); await sleep(900);
  if (ok) { joy(C.pony); await speak(C.pony, "dtp_ok", dtTxt("dtp_ok")); }
  await sleep(300); setView("board"); if (ok && !winner) await slGo(pc, 2); return ok; }
LTASK_RUN.dt = dtScene;

/* ---------- しかけは へんな こうちょうの しわざ（ばんの うえに あらわれて しゃべる） ---------- */
{ const be = boardEvent; boardEvent = async function (pc) {
    if (curStage !== DTS) return be(pc); const ev = EVENTS[DTS][pc.node]; if (!ev || (pc.player && pc.player.stay)) return be(pc);
    const v = DT.ev[ev[0]].v, c = clone(DT_KIND[v], 1330, 990, .62); hudLayer.appendChild(c.root); dtPoof(1330, 800, 10); jump(c, .6); playMove(c, DT_MOVE[v]);
    showBanner(`${DT.v[v].name}の しわざ！`, 1500);
    const sp = speak; let once = true; speak = function (ch, k, t) { if (once && k.startsWith("dt_ev_")) { once = false; return sp(c, k, t); } return sp(ch, k, t); };
    const ss = slSay; slSay = async (k, t) => speak(C.pony, k, t);
    try { await be(pc); } finally { speak = sp; slSay = ss; dtPoof(1330, 800, 8); c.root.remove(); const i = visible.indexOf(c); if (i >= 0) visible.splice(i, 1); } }; }
