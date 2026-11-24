/* ================= ロングコース「えきの だいぼうけん」作り替え（eki2、2026-11-24） =================
   あまねさん：こどもは「うちゅうの だいぼうけん」（suchu）が やたら すき → えきを うちゅうに ならって 作り替え。
   ・盤：うちゅうと おなじ うずまき（slong.js の SL_SHAPE.eki）。そとから まんなかの しゅうてんへ。よるの えきの 背景（ekNightBG）。
   ・しかけ：うちゅうと おなじ ならび（slong.js の EVS）。🔀 くみかえも 2かしょ。ふりだしは まっくらな トンネルに のみこまれる（ekTunnelArt）。
   ・課題：「30びょう いえるかな」を やめ、ことば・いってみよう の マスは 駅専用の 会話 💬（ekScene）。
   データと 声：sit/eki2_gen.py → eki2_data.js・sit/pony_eki2.json・aivis/jobs/ek1。
   もとに もどす とき：ブランチ backup-2026-11-24-before-eki-remake。 */
const EK_N = new Map(); let EK_CUR = "";
{ const ap = applyStage; applyStage = function (id, ...a) { if (id === "eki") EK_N.clear(); return ap(id, ...a); }; }
Object.assign(LTASK, { ek: ["#E6EEF5", "💬"] });
LEGENDS.eki = [["ek", "おはなし"], ["stop", "おもしろ"], ["monomane", "こえ"]];
// ふりだしの マス：トンネルの ことばと 声
Object.entries(EVENTS.eki).forEach(([id, e]) => { if (e[0] === "home") EVENTS.eki[id] = ["home", 0, "sl_eki2_home", EK.txt.sl_eki2_home]; });
SL_EVT.eki.home = EK.txt.sl_eki2_home;
/* ---------- トンネル（ふりだしに もどる） ---------- */
function ekTunnelArt(g, size) { const k = size / 130, o = el("g", {}, g), t = el("g", { transform: `scale(${k.toFixed(3)})` }, o);
  el("path", { d: "M-95 40 V-10 A95 95 0 0 1 95 -10 V40 Z", fill: "#7A7368", stroke: INK, "stroke-width": 6 }, t); // いしの わく
  [[-80, -20], [-62, -62], [-24, -88], [24, -88], [62, -62], [80, -20]].forEach(([x, y]) => el("rect", { x: x - 12, y: y - 9, width: 24, height: 18, rx: 4, fill: "#9A9284", stroke: INK, "stroke-width": 3 }, t));
  el("path", { d: "M-66 40 V-6 A66 66 0 0 1 66 -6 V40 Z", fill: "#0E0E16", stroke: INK, "stroke-width": 5 }, t); // まっくら
  const eye = el("g", {}, t); el("circle", { cx: -18, cy: -10, r: 6, fill: "#FFE27A" }, eye); el("circle", { cx: 18, cy: -10, r: 6, fill: "#FFE27A" }, eye); // おくから でんしゃの あかり
  el("animate", { attributeName: "opacity", values: ".2;1;.2", dur: "1s", repeatCount: "indefinite" }, eye);
  el("path", { d: "M-40 40 L-12 0 M40 40 L12 0", stroke: "#8C8C99", "stroke-width": 5 }, t); // せんろ
  for (let i = 0; i < 4; i++) el("path", { d: `M${-30 + i * 2} ${34 - i * 10} H${30 - i * 2}`, stroke: "#6B5B4B", "stroke-width": 4 }, t);
  return o; }
/* ---------- よるの えき（盤の 背景） ---------- */
function ekNightBG(L) {
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#1B2348" }, L);
  el("rect", { x: 0, y: 0, width: 1600, height: 260, fill: "#263068", opacity: .7 }, L);
  for (let i = 0; i < 55; i++) el("circle", { cx: (i * 233) % 1600, cy: (i * 97) % 300, r: 1.5 + (i % 3), fill: "#FFF6C8", opacity: .75 }, L); // ほし
  el("circle", { cx: 1460, cy: 110, r: 52, fill: "#FFF3B8", ...S6(4) }, L); el("circle", { cx: 1484, cy: 96, r: 46, fill: "#263068" }, L); // みかづき
  // ビルの かげと あかりの ついた まど（うえの はし と よこ）
  [[0, 170, 120, 200], [130, 120, 90, 250], [1250, 150, 100, 220], [1360, 200, 140, 170], [1500, 130, 100, 240], [520, 190, 80, 140], [980, 170, 90, 160]].forEach(([x, y, w, h], j) => {
    el("rect", { x, y, width: w, height: h, fill: "#11173A", stroke: "#0A0E24", "stroke-width": 4 }, L);
    for (let yy = y + 18; yy < y + h - 14; yy += 34) for (let xx = x + 12; xx < x + w - 16; xx += 26) if ((xx * 7 + yy * 3 + j) % 5) el("rect", { x: xx, y: yy, width: 14, height: 18, fill: (xx + yy) % 3 ? "#FFE27A" : "#FFB36B", opacity: .85 }, L); });
  // まんなかの しゅうてん：ひかる えきの たてもの
  const st = el("g", { transform: "translate(800 600)" }, L);
  el("ellipse", { cx: 0, cy: 10, rx: 240, ry: 110, fill: "#FFE27A", opacity: .12 }, st);
  // ホームの あかり（はしらと ランプ）
  [[90, 990], [1520, 990], [90, 700], [1520, 760]].forEach(([x, y]) => { el("path", { d: `M${x} ${y} V${y - 150}`, stroke: "#3B3F5C", "stroke-width": 8 }, L); el("circle", { cx: x, cy: y - 158, r: 14, fill: "#FFF3B8", ...S6(3) }, L); el("circle", { cx: x, cy: y - 158, r: 40, fill: "#FFF3B8", opacity: .18 }, L); });
}
/* ---------- 場面の へや ---------- */
function ekSign(L, place) { const g = el("g", {}, L); el("rect", { x: 620, y: 24, width: 360, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, place.length > 6 ? 38 : 46, { "text-anchor": "middle" }); }
function ekGateRoom(L) { // かいさつ：かいさつきが ならぶ
  el("rect", { x: 0, y: 0, width: 1600, height: 760, fill: "#E6EEF5" }, L); el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#C9CED6" }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L);
  for (let x = 0; x < 1600; x += 120) el("path", { d: `M${x} 760 L${x - 60} 1000`, stroke: "#00000014", "stroke-width": 4 }, L);
  el("rect", { x: 200, y: 150, width: 1200, height: 70, rx: 10, fill: "#2E5AAC", ...S6(5) }, L); txt(L, 800, 198, "のりば →　　かいさつ　　← でぐち", 34, { "text-anchor": "middle", fill: "#FFFFFF" });
  el("rect", { x: 1180, y: 280, width: 300, height: 260, rx: 10, fill: "#F6EEDF", ...S6(6) }, L); el("rect", { x: 1210, y: 320, width: 240, height: 120, rx: 8, fill: "#BDE3F2", ...S6(4) }, L); txt(L, 1330, 500, "きっぷうりば", 28, { "text-anchor": "middle" });
  for (let i = 0; i < 4; i++) { const x = 760 + i * 120; el("rect", { x, y: 640, width: 46, height: 140, rx: 10, fill: "#D9DEE6", ...S6(5) }, L); el("rect", { x: x + 6, y: 652, width: 34, height: 16, rx: 4, fill: "#3E7FD6" }, L); el("circle", { cx: x + 23, cy: 700, r: 8, fill: "#7BD389" }, L); }
  el("circle", { cx: 160, cy: 330, r: 70, fill: "#FFFFFF", ...S6(6) }, L); el("path", { d: "M160 290 V330 L190 348", ...S6(6), fill: "none" }, L); }
function ekTrainRoom(L) { // でんしゃの なか：まどの そとが ながれる
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#F3EEE2" }, L); el("rect", { x: 0, y: 780, width: 1600, height: 220, fill: "#9AA3AE" }, L); el("path", { d: "M0 780 H1600", ...S6(6) }, L);
  const sc = el("g", {}, L), clip = "ekwin"; const d = el("defs", {}, L), cp = el("clipPath", { id: clip }, d);
  for (let x = 120; x < 1600; x += 380) el("rect", { x, y: 230, width: 300, height: 220, rx: 18 }, cp);
  const out = el("g", { "clip-path": `url(#${clip})` }, sc); el("rect", { x: 0, y: 220, width: 1600, height: 240, fill: "#BDE3F2" }, out);
  const mv = el("g", {}, out); for (let i = 0; i < 16; i++) { const x = i * 220; el("path", { d: `M${x} 450 Q${x + 60} ${360 - (i % 3) * 30} ${x + 120} 450 Z`, fill: i % 2 ? "#7BD389" : "#5FB35A" }, mv); if (i % 4 === 1) el("rect", { x: x + 40, y: 360, width: 40, height: 90, fill: "#FFFFFF", ...S6(3) }, mv); }
  let t = 0; addTick(dt => { if (!mv.isConnected) return false; t += dt; mv.setAttribute("transform", `translate(${(-(t * 160) % 880).toFixed(0)} 0)`); });
  for (let x = 120; x < 1600; x += 380) el("rect", { x, y: 230, width: 300, height: 220, rx: 18, fill: "none", ...S6(6) }, L);
  el("rect", { x: 300, y: 700, width: 620, height: 80, rx: 16, fill: "#5F8FCB", ...S6(6) }, L); el("path", { d: "M0 150 H1600", ...S6(6) }, L);
  for (let x = 160; x < 1600; x += 160) { el("path", { d: `M${x} 150 V200`, ...S6(4) }, L); el("circle", { cx: x, cy: 214, r: 14, fill: "none", ...S6(5) }, L); } }
const ROOMS_EK = { "かいさつ": L => ekGateRoom(L), "でんしゃの なか": L => ekTrainRoom(L) };
{ const dr = drawRoom; drawRoom = function (place, noSign = false) {
    if (curStage !== "eki") return dr(place, noSign);
    if (ROOMS_EK[place]) { sceneLayer.innerHTML = ""; ROOMS_EK[place](sceneLayer); if (!noSign) ekSign(sceneLayer, place); return; }
    if (place === "ホーム" || place === "しゅうてん") { dr("えき", true); if (place === "しゅうてん") { const L = sceneLayer; // くるまどめ と でぐちの あんない
        el("rect", { x: 40, y: 640, width: 120, height: 60, rx: 8, fill: "#FFD25E", ...S6(5) }, L); for (let i = 0; i < 3; i++) el("path", { d: `M${56 + i * 36} 640 l20 60`, stroke: INK, "stroke-width": 8 }, L);
        el("rect", { x: 620, y: 360, width: 300, height: 70, rx: 12, fill: "#FFE27A", ...S6(5) }, L); txt(L, 770, 408, "でぐち →", 36, { "text-anchor": "middle" }); }
      if (!noSign) ekSign(sceneLayer, place); return; }
    return dr(place, noSign); }; }
/* ---------- 場面の 小道具 ---------- */
function ekProp(sc, h, a) {
  const G = el("g", {}, propG), hx = h.x + 200 * h.s, ax = a ? a.x + 200 * a.s : 1200, base = 975, id = sc.id;
  if (id === "kippu") { const k = el("g", { transform: `translate(${hx + 120} ${base - 330}) rotate(-12)` }, G); el("rect", { x: -40, y: -24, width: 80, height: 48, rx: 6, fill: "#FFF1C2", ...S6(4) }, k); txt(k, 0, 8, "きっぷ", 18, { "text-anchor": "middle" }); }
  else if (id === "card") { for (let i = 0; i < 4; i++) later(i * 500, () => { blip(1200, 1200, .08, "square"); markAbove(h, "ex"); }); const b = el("rect", { x: 1006, y: 652, width: 34, height: 16, rx: 4, fill: "#FF6F61" }, G); el("animate", { attributeName: "opacity", values: "1;.2;1", dur: ".5s", repeatCount: "indefinite" }, b); }
  else if (id === "nodo") { const v = el("g", { transform: `translate(${ax + 150} ${base - 120})` }, G); el("rect", { x: -70, y: -360, width: 140, height: 360, rx: 10, fill: "#3E7FD6", ...S6(5) }, v); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) el("rect", { x: -54 + c * 38, y: -330 + r * 70, width: 26, height: 46, rx: 6, fill: ["#FF8FA3", "#7BD389", "#FFD25E"][(r + c) % 3], ...S6(2) }, v); el("rect", { x: -40, y: -90, width: 80, height: 40, rx: 6, fill: "#2B2A33" }, v); }
  else if (id === "sen" || id === "announce" || id === "oriru" || id === "kakekomi" || id === "sukima" || id === "shuten") { // ホームに でんしゃが くる
    const tr = el("g", {}, G); const draw = x => { tr.innerHTML = ""; el("rect", { x, y: 560, width: 900, height: 150, rx: 26, fill: "#F4F7FA", ...S6(6) }, tr); el("rect", { x, y: 640, width: 900, height: 18, fill: "#3E7FD6" }, tr); for (let i = 0; i < 5; i++) el("rect", { x: x + 40 + i * 170, y: 580, width: 110, height: 50, rx: 8, fill: "#BDE3F2", ...S6(3) }, tr); };
    const stop = id === "sen" ? 1700 : 700; let x = 1700; draw(x); if (id !== "sen") { noise(.8, 500, .25); addTick(dt => { if (!tr.isConnected) return false; x = Math.max(stop, x - dt * 900); draw(x); if (x <= stop) return false; }); } else later(3500, () => { noise(.8, 500, .25); addTick(dt => { if (!tr.isConnected) return false; x = Math.max(700, x - dt * 900); draw(x); if (x <= 700) return false; }); });
    if (id === "announce") { const sp = el("g", { transform: "translate(1000 300)" }, G); el("path", { d: "M-30 -20 L0 -20 L30 -45 V45 L0 20 L-30 20 Z", fill: "#D9DEE6", ...S6(4) }, sp); for (let k = 0; k < 3; k++) { const w = el("path", { d: `M${45 + k * 22} -30 q16 30 0 60`, fill: "none", stroke: "#3E7FD6", "stroke-width": 5 }, sp); el("animate", { attributeName: "opacity", values: "0;1;0", dur: "1s", begin: `${k * .2}s`, repeatCount: "indefinite" }, w); } blip(1046, 1046, .15, "sine"); later(250, () => blip(784, 784, .15, "sine")); }
    if (id === "kakekomi") later(1200, () => { for (let i = 0; i < 3; i++) later(i * 300, () => blip(1500, 1500, .08, "square")); }); }
  else if (id === "boushi") { const b = el("g", { transform: `translate(1000 720)` }, G); el("path", { d: "M-40 0 Q-36 -40 0 -42 Q36 -40 40 0 Z", fill: "#3E7FD6", ...S6(4) }, b); el("path", { d: "M-56 0 H56", stroke: INK, "stroke-width": 8, "stroke-linecap": "round" }, b); }
  else if (id === "yure") { let t = 0; addTick(dt => { if (!sceneLayer.isConnected) return false; t += dt; if (t > 2) { sceneLayer.setAttribute("transform", ""); return false; } sceneLayer.setAttribute("transform", `translate(${(Math.sin(t * 40) * 10 * (1 - t / 2)).toFixed(1)} 0)`); }); noise(.6, 300, .4); }
  else if (id === "nemuri") { later(100, () => { a.eyesClosed = true; }); for (let i = 0; i < 4; i++) later(400 + i * 900, () => markAbove(a, "z", { i })); }
  else if (id === "saifu" || id === "wasure") { const w = el("g", { transform: `translate(${id === "saifu" ? 460 : 1000} ${id === "saifu" ? 770 : 700})` }, G); el("rect", { x: -34, y: -22, width: 68, height: 44, rx: 8, fill: id === "saifu" ? "#C98A4B" : "#3E7FD6", ...S6(4) }, w); const sp = el("path", { d: "M40 -30 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z", fill: "#FFE27A" }, w); el("animate", { attributeName: "opacity", values: "1;.2;1", dur: ".8s", repeatCount: "indefinite" }, sp); }
  else if (id === "chizu") { const m = el("g", { transform: "translate(1100 420)" }, G); el("rect", { x: -150, y: -110, width: 300, height: 220, rx: 12, fill: "#FFFFFF", ...S6(5) }, m); el("path", { d: "M-120 60 H120 M-40 -90 V90 M60 -90 L90 90", stroke: "#BFC6CF", "stroke-width": 10 }, m); el("circle", { cx: 80, cy: -50, r: 20, fill: "#7BD389", ...S6(3) }, m); txt(m, 80, -80, "こうえん", 18, { "text-anchor": "middle" }); el("circle", { cx: -40, cy: 60, r: 12, fill: "#FF6F61", ...S6(3) }, m); txt(m, -40, 96, "いま ここ", 16, { "text-anchor": "middle" }); }
  else if (id === "ekiben") { const b = el("g", { transform: `translate(${ax - 140} ${base - 300})` }, G); el("rect", { x: -60, y: -30, width: 120, height: 60, rx: 8, fill: "#FFF1C2", ...S6(4) }, b); el("path", { d: "M-60 -6 H60 M0 -30 V30", stroke: "#FF6F61", "stroke-width": 6 }, b); for (let k = 0; k < 3; k++) later(k * 600, () => mark("puff", ax - 140 + k * 20, base - 340, { vy: -60, life: .8, s: .4 })); }
  else if (id === "maigo") { for (let i = 0; i < 3; i++) later(300 + i * 700, () => markAbove(h, "q")); h.sadMouth = true; }
  else if (id === "escala") { later(800, () => { a.dx.t = -120; hold(a, "run", .8); }); }
  else if (id === "tanoshi") { later(600, () => { joy(h); }); }
  return G; }
/* ---------- 💬 えきの おはなし ---------- */
function ekPick(area) { let pool = EK.sc.filter(s => s.area === area); const m = Math.min(...pool.map(s => EK_N.get(s.id) || 0)); pool = pool.filter(s => (EK_N.get(s.id) || 0) === m); return pool[rnd(pool.length)]; }
async function ekScene(pc) {
  const hero = pc.kind, sc = ekPick(nArea(pc.node)), t = tierOf(); EK_N.set(sc.id, (EK_N.get(sc.id) || 0) + 1);
  showEngine(null, `えきの おはなし（${sc.id}・段${t + 1}）`);
  EK_CUR = sc.id; const { hero: h, ask: a } = setSitView({ id: "ek_" + sc.id, place: sc.place, asker: sc.who, intro: "ek" }, hero);
  a.dx.v = a.dx.t = 0;
  enter(h); await sleep(900);
  if (!EK_N.get("_intro")) { EK_N.set("_intro", 1); await speak(C.pony, "ekp_intro", EK.txt.ekp_intro); }
  ekProp(sc, h, a);
  await speak(C.pony, `ekn_${sc.id}`, sc.n);
  if (["card", "maigo", "boushi", "wasure", "toire", "nodo"].includes(sc.id)) { h.sadMouth = true; playMove(h, "think"); }
  if (sc.line) { playMove(a, "nod"); await speak(a, `ekw_${sc.id}`, sc.line); }
  let okN = 0, nSay = 0; const log = [];
  const step = async (key, text, keys, tag) => { nSay++; const r = await kmSay(h, key, text, keys, tag); if (r.ok) okN++; log.push(`${r.ok ? "○" : "×"}${r.heard}`); return r.ok; };
  await step(`eks_${sc.id}`, sc.say, sc.keys, "まるシマに なって いおう");
  h.sadMouth = false; if (sc.id === "nemuri") a.eyesClosed = false;
  if (sc.res) { playMove(a, "nod"); await speak(a, `ekr_${sc.id}`, sc.res); }
  const t2 = sc.t2 && (t >= 1 || !sc.res) ? sc.t2 : null;
  if (t2) { if (t2.line) { playMove(a, "nod"); await speak(a, `ekw2_${sc.id}`, t2.line); }
    await step(`eks2_${sc.id}`, t2.say, t2.keys, "つづけて いおう");
    if (t2.res) { joy(a); await speak(a, `ekr2_${sc.id}`, t2.res); } }
  const ok = okN * 2 >= nSay; grade(ok); GS.tasks++;
  playLog({ type: "eki2", id: sc.id, tier: t, okN, nSay, tries: log, ...(MODE === "multi" ? { who: NAMES[hero] } : {}) });
  if (ok) { confetti(36); joy(h); const k = rnd(2) ? "ekp_ok" : "ekp_good"; await speak(C.pony, k, EK.txt[k]); }
  await sleep(400); setView("board"); return ok; }
Object.assign(LTASK_RUN, { ek: ekScene });
/* ---------- 声の パック ---------- */
{ const lp = loadPack; loadPack = async function (id) { const r = await lp(id); if (id !== "eki") return r;
    if (!PACK.loaded.eki2) { try { const q = await fetch("packs/eki2.json", { cache: "no-cache" }); if (q.ok) { const d = await q.json(); Object.keys(d).forEach(k => AUD[k] = "data:audio/mpeg;base64," + d[k]); PACK.loaded.eki2 = Object.keys(d); } } catch (e) { } }
    return r; }; }
/* ---------- 盤の しるし：ふりだしマスは トンネルの え ---------- */
{ const db = drawBoard; drawBoard = function () { db(); if (curStage !== "eki") return;
    Object.entries(EVENTS.eki).forEach(([id, [type]]) => { if (type !== "home") return; const [x, y] = NODES[id];
      el("circle", { cx: x, cy: y, r: 38, fill: "#3B3A55", ...S6(4) }, boardLayer); const g = el("g", { transform: `translate(${x} ${y + 6})` }, boardLayer); ekTunnelArt(g, 52); }); }; }
