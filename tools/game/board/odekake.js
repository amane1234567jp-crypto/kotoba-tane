/* ================= ちょうロング「おでかけ だいぼうけん（とほ・じてんしゃ）」（2026-10-19） =================
   みんなで あそぶ 専用。48マスの まちの みち。したの 2だん（いえの まわり・しょうてんがい）は あるいて、うえの 2だん（こうえん・かわぞいの みち）は じてんしゃ。
   こうつう ルールの マス：🚦しんごう（とまる？わたる？→ルールを いう）・🚸おうだんほどう（みぎ・ひだり・みぎ）・🛑とまれ（ブレーキを ながおし）・
   🚗とびだし・🚲じてんしゃの ルール・⭕❌クイズ・⛰くだりざか・🙇すみません・👮おまわりさん。
   場面（いってみよう）は じてんしゃ・とうこう・げこうの ものを つかう。声は ぽにー（sit/pony_odekake.json → packs/odekake.json）。 */
const OD = "odekake", OD_BIKE_AT = 24;
const odIdx = pc => SL_ORDER[OD].indexOf(pc.node);
/* ---------- マスの ならび（くみかえは しない：あるき → じてんしゃ の じゅんばんを まもる） ---------- */
{ const O = SL_ORDER[OD], T = SL_TH[OD];
  const PLAN = [null, "sig", "e:dice2", "scene", "zebra", "e:allb", "kaiwa", "tobi", "e:bonus", "catch", "sumimasen", "e:warp", "maru", "scene", "e:rest", "tomare", "balloon", "e:fake", "police", "hito", "e:janken", null, "sig", "e:x2",
    "bike", "scene", "e:zero", "kado", "stop", "e:back10", "bike", "yasashiku", "e:allf", "maru", "e:again", "tomare", "cups", "e:nebou", "kado", "scene", "e:trolley", "sig", "hito", "e:call", "zebra", "bike", "police"];
  const ev = {}, task = {};
  O.forEach((id, i) => { const p = PLAN[i]; if (!p || id === "0" || id === "4" || id === "15") return;
    if (p.startsWith("e:")) { const t = p.slice(2); ev[id] = [t, 0, `sl_${OD}_${t}`, SL_EVT[OD][t]]; } else task[id] = p; });
  EVENTS[OD] = ev; LONG_TASKS[OD] = task;
  LEGENDS[OD] = [["kaiwa", "ことば"], ["scene", "いってみよう"], ["stop", "おもしろ"], ["sig", "こうつう ルール"]]; }
Object.assign(LTASK, { sig: ["#C9EBB5", "🚦"], zebra: ["#C9EBB5", "🚸"], tomare: ["#C9EBB5", "🛑"], tobi: ["#C9EBB5", "⚽"], bike: ["#C9EBB5", "🚲"], maru: ["#C9EBB5", "⭕"], saka: ["#C9EBB5", "⛰"], kado: ["#C9EBB5", "↱"], hito: ["#C9EBB5", "🚶"], sumimasen: ["#C9EBB5", "🙇"], police: ["#C9EBB5", "👮"] });

/* ---------- 盤の え：まちの ちず ---------- */
BOARD_BG[OD] = L => {
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#DDF0CF" }, L);
  el("rect", { x: 0, y: 0, width: 1600, height: 300, fill: "#CFEAFB" }, L); el("circle", { cx: 1480, cy: 250, r: 46, fill: "#FFE27A", ...S6(5) }, L);
  el("path", { d: "M0 300 L200 220 L380 290 L600 200 L820 290 L1000 230 L1250 300 Z", fill: "#B8D8C0", ...S6(4) }, L);
  el("rect", { x: 0, y: 330, width: 1600, height: 70, fill: "#7FCBF0", ...S6(4) }, L); for (let x = 30; x < 1600; x += 160) el("path", { d: `M${x} 365 q30 -12 60 0`, fill: "none", stroke: "#FFFFFF", "stroke-width": 5 }, L);
  const Y = [930, 770, 610, 450];
  Y.forEach((y, r) => { el("rect", { x: 110, y: y - 34, width: 1380, height: 68, rx: 34, fill: r >= 2 ? "#9AA6B4" : "#8C939C", ...S6(4) }, L); el("path", { d: `M150 ${y} H1450`, stroke: "#FFFFFF", "stroke-width": 5, "stroke-dasharray": "34 24" }, L);
    if (r >= 2) el("path", { d: `M150 ${y + 24} H1450`, stroke: "#5B8DEF", "stroke-width": 6 }, L); });
  [[1435, 930, 770], [170, 770, 610], [1435, 610, 450]].forEach(([x, y1, y2]) => el("rect", { x: x - 34, y: y2, width: 68, height: y1 - y2, fill: "#8C939C", ...S6(4) }, L));
  [["🏠", 260, 870], ["🏡", 520, 870], ["🐕", 760, 870], ["🏪", 1000, 870], ["🌷", 1220, 870], ["🏬", 380, 710], ["🍦", 640, 710], ["📮", 880, 710], ["🏫", 1130, 710], ["🌳", 300, 550], ["⛲", 560, 550], ["🌳", 820, 550], ["🛝", 1000, 550], ["🦆", 420, 385], ["🌉", 980, 385]]
    .forEach(([e, x, y]) => txt(L, x, y + 20, e, 54, { "text-anchor": "middle", opacity: .9 }));
  [["🚶 あるいて", 60, 860], ["🚲 じてんしゃ", 1190, 545]].forEach(([t, x, y]) => { el("rect", { x: x - 10, y: y - 34, width: 40 + t.length * 22, height: 46, rx: 23, fill: "#FFFFFF", ...S6(3) }, L); txt(L, x + 8, y, t, 26); });
  { const tg = el("g", { "data-top": 1 }, L); el("rect", { x: 960, y: 38, width: 440, height: 72, rx: 22, fill: "#3E7FD6", ...S6(5) }, tg); txt(tg, 1180, 86, "🚲 おでかけ だいぼうけん", 32, { "text-anchor": "middle", fill: "#FFFFFF" }); } // コースの なまえは 上の バーに（2026-10-31）
  Object.entries(EVENTS[OD]).forEach(([id, [type]]) => { const to = slWarpTo(OD, id, type); if (!to) return; const [x1, y1] = NODES[id], [x2, y2] = NODES[to];
    el("path", { d: `M${x1} ${y1} Q${(x1 + x2) / 2 + 120} ${(y1 + y2) / 2} ${x2} ${y2}`, fill: "none", stroke: "#8E5BD6", "stroke-width": 6, "stroke-dasharray": "16 14", opacity: .6 }, L); });
};

/* ---------- うしろ はんぶんは コマが じてんしゃに のる ---------- */
let odBikeG = null, odSaid = false;
addTick(() => {
  if (curStage !== OD || typeof PLAYERS === "undefined") { if (odBikeG) { odBikeG.remove(); odBikeG = null; } return; }
  if (!odBikeG || !odBikeG.isConnected) { odBikeG = el("g", {}, fxLayer); odBikeG.__b = new Map(); }
  const onBoard = view === "board"; odBikeG.style.display = onBoard ? "" : "none"; if (!onBoard) return;
  PLAYERS.forEach(p => { const pc = p.pc; if (!pc || !pc.node) return; const on = odIdx(pc) >= OD_BIKE_AT && pc.node !== GOAL; let b = odBikeG.__b.get(pc);
    if (on && !b) { b = bikeG(odBikeG); odBikeG.__b.set(pc, b); if (!odSaid) { odSaid = true; OD_BIKE_SAY = true; } }
    if (b) { b.style.display = on && pc.root.getAttribute("opacity") !== "0" ? "" : "none"; const q = world(pc, 200, pc.base - 50); b.setAttribute("transform", `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)}) scale(${(pc.s * .7).toFixed(3)})`); } });
});
{ const ap = applyStage; applyStage = function (id, ...a) { odSaid = false; if (odBikeG) { odBikeG.remove(); odBikeG = null; } return ap(id, ...a); }; }

/* ---------- 場面は じてんしゃ・とうこう・げこう から ---------- */
{ const ps = pickSit; pickSit = function (place, heroKind = "shima") { if (curStage !== OD) return ps(place, heroKind);
    const src = ["jitensha", "jitensha", "toukou", "gekou"][rnd(4)]; curStage = src; try { return ps(place, heroKind); } finally { curStage = OD; } }; }
{ const lp = loadPack; loadPack = async function (id) { const r = await lp(id); if (id !== OD) return r;
    for (const p of ["jitensha", "toukou", "gekou", OD]) if (!PACK.loaded[p]) { try { const q = await fetch(`packs/${p}.json`, { cache: "no-cache" }); if (q.ok) { const d = await q.json(); Object.keys(d).forEach(k => AUD[k] = "data:audio/mpeg;base64," + d[k]); PACK.loaded[p] = Object.keys(d); } } catch (e) { /* なくても あそべる */ } }
    if (AUD["bgm_" + OD]) await voiceBuf("bgm_" + OD); return true; }; }

/* ---------- こうつう ルールの マス ---------- */
// ルールを こえに だす（2かいまで）
async function odSay(pc, key, text, keys) {
  showTask(text, "いって みよう", 260); await speak(C.pony, key, text); unsay();
  let ok = false; for (let n = 0; n < 2 && !ok; n++) { setListen(pc, true); const r = await listen(keys, 8000); setListen(pc, false); ok = r.r === "ok"; if (!ok && n === 0) await speak(C.pony, "p_again", "もう いっかい いってみよう"); }
  hideTask(); return ok; }
// 2まいの カード：ただしい ほうを タッチ（こえでも いい）。まちがえたら うすく なる
function odChoose(g, opts, y = 640) { const cs = opts.map(([lab, emo, good], j) => { const c = card(g, 220 + j * 600, y, 560, 190, lab, emo, { es: 90, fs: 52 }); c.good = good; return c; });
  return new Promise(res => { let fin = false, live = true, wrong = 0; const done = () => { if (fin) return; fin = true; live = false; cs.forEach(c => c.onclick = null); const h = cs.find(c => c.good); h.rect.setAttribute("fill", "#FFE27A"); chime(); res(wrong); };
    cs.forEach(c => c.onclick = () => { if (fin || c.dim) return; if (c.good) done(); else { c.dim = 1; c.setAttribute("opacity", .35); wrong++; noise(.1, 700, .35); playMove(C.pony, "think"); speak(C.pony, "od_ng", "ちがうよ。もう いっかい かんがえて みよう"); } });
    const gl = opts.find(o => o[2])[0].split(" ")[0]; (async () => { while (live) { const r = await listen([[gl]], 9000); if (r.r === "ok") { done(); return; } if (!live) return; await sleep(200); } })(); }); }
async function odEnd(pc, g, ok, log) { playLog({ ...log, ok, who: NAMES[pc.kind] }); g.remove();
  if (ok) { grade(true); confetti(50); joy(C.pony); await speak(C.pony, "p_great", "すごい！ いえたね！"); await delta(pc, 2); } else await delta(pc, 0); return ok; }
// しんごうの え
function sigG(par, x, y, col, k = 1, pole = true) { // ほこうしゃようの しんごう（にほんの かたち）：たてに 2つ。うえ＝あかの たって いる ひと、した＝あおの あるく ひと
  const g = el("g", { transform: `translate(${x} ${y}) scale(${k})` }, par), red = col === "red";
  if (pole) el("rect", { x: -14, y: 0, width: 28, height: 340, fill: "#9AA3AD", ...S6(6) }, g); // ポール
  el("rect", { x: -78, y: -330, width: 156, height: 330, rx: 14, fill: "#4A5059", ...S6(6) }, g); // はこ
  const lamp = (cy, on, c, walk) => { const lg = el("g", { transform: `translate(0 ${cy})` }, g);
    el("rect", { x: -62, y: -66, width: 124, height: 132, rx: 12, fill: "#1F2329", ...S6(4) }, lg); // かお
    el("path", { d: "M-70 -70 H70 L58 -86 H-58 Z", fill: "#3A3F47", ...S6(4) }, lg); // ひさし
    const f = on ? c : "#3B4048", gl = el("g", { fill: f }, lg);
    el("circle", { cx: walk ? 6 : 0, cy: -38, r: 13 }, gl);
    if (!walk) { el("path", { d: "M-17 -20 H17 L19 18 H8 L8 52 H-8 L-8 18 H-19 Z" }, gl); } // たって いる ひと
    else { el("path", { d: "M-6 -22 L14 -22 L22 4 L36 18 L28 26 L12 10 L10 22 L28 52 L16 58 L-2 28 L-14 56 L-28 50 L-10 14 L-8 -4 L-24 12 L-32 4 Z" }, gl); } // あるく ひと
    if (on) { const glow = el("rect", { x: -62, y: -66, width: 124, height: 132, rx: 12, fill: c, opacity: .14 }, lg); } return lg; };
  lamp(-245, red, "#FF3B30", false); lamp(-85, !red, "#1FC7A4", true);
  return g; }
function zebraG(par, x, y, w = 600) { for (let i = 0; i < 7; i++) el("rect", { x: x + i * w / 7, y, width: w / 14, height: 120, fill: "#FFFFFF", ...S6(3) }, par); }
// 🚦 しんごう
async function odSig(pc) { const red = !!rnd(2), g = panel("しんごう", "#EAF6FF");
  el("rect", { x: 140, y: 470, width: 1320, height: 120, fill: "#8C939C" }, g); zebraG(g, 520, 470); sigG(g, 1260, 450, red ? "red" : "green", .9); txt(g, 360, 450, "🚶", 140, { "text-anchor": "middle" });
  await speak(C.pony, `od_sig_q_${red ? "red" : "green"}`, red ? "しんごうが あかだよ。とまる？ わたる？ タッチしてね" : "しんごうが あおに なったよ。とまる？ わたる？ タッチしてね");
  const wrong = await odChoose(g, [["とまる", "✋", red ? 1 : 0], ["わたる", "🚶", red ? 0 : 1]]);
  await speak(C.pony, "od_ok", "せいかい！"); await speak(C.pony, "od_say", "ルールを いって みよう");
  const ok = await odSay(pc, `od_sig_r_${red ? "red" : "green"}`, red ? "あかは とまれ" : "あおでも、みぎと ひだりを みて わたる", red ? [["あか", "赤"], ["とまれ", "止まれ", "とまる", "止まる"]] : [["みぎ", "右"], ["ひだり", "左"]]);
  return odEnd(pc, g, ok && !wrong, { type: "od_sig", id: red ? "red" : "green", wrong }); }
// 🚸 おうだんほどう：みぎ・ひだり・みぎ
async function odZebra(pc) { const g = panel("おうだんほどう", "#EAF6FF");
  el("rect", { x: 140, y: 560, width: 1320, height: 140, fill: "#8C939C" }, g); zebraG(g, 500, 570); const kid = txt(g, 800, 520, "🧒", 150, { "text-anchor": "middle" });
  const arr = txt(g, 800, 330, "", 100, { "text-anchor": "middle" }); let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; const k = Math.floor(t / .9) % 4; arr.textContent = ["✋ とまって", "👉 みぎ", "👈 ひだり", "👉 もう いちど みぎ"][k]; });
  await speak(C.pony, "od_zb_intro2", "どうろを わたる ときは、まず とまって、みぎ、ひだり、もう いちど みぎを みるよ");
  const ok = await odSay(pc, "od_zb_r2", "とまって、みぎ、ひだり、もう いちど みぎ", [["とまって", "止まって"], ["みぎ", "右"], ["ひだり", "左"]]);
  if (ok) { tween(1200, k => kid.setAttribute("transform", `translate(0 ${(-60 * Math.sin(k * Math.PI)).toFixed(0)})`)); chime(); }
  return odEnd(pc, g, ok, { type: "od_zebra" }); }
// 🛑 とまれ：ブレーキを ながく おして、せんの まえで とまる
async function odTomare(pc) { const g = panel("とまれ", "#FFF6E9");
  el("rect", { x: 140, y: 500, width: 1320, height: 160, fill: "#8C939C" }, g); el("rect", { x: 1080, y: 500, width: 18, height: 160, fill: "#FFFFFF" }, g); txt(g, 1160, 600, "とまれ", 50, { fill: "#FFFFFF" });
  const sg = el("g", { transform: "translate(1260 300)" }, g); el("path", { d: "M-90 -80 H90 L0 80 Z", fill: "#E8473C", ...S6(6) }, sg); txt(sg, 0, -18, "とまれ", 40, { "text-anchor": "middle", fill: "#FFFFFF" });
  const bk = el("g", {}, g); bikeG(bk).setAttribute("transform", "scale(.6)"); txt(bk, 0, -70, "🧒", 90, { "text-anchor": "middle" });
  const btn = el("g", { style: "cursor:pointer" }, g); el("rect", { x: 560, y: 720, width: 480, height: 150, rx: 75, fill: "#E8473C", ...S6(6) }, btn); txt(btn, 800, 815, "✋ ブレーキ", 60, { "text-anchor": "middle", fill: "#FFFFFF" });
  await speak(C.pony, "od_tm_intro", "とまれの マークだ！ ブレーキの ボタンを ながく おして、せんの まえで とまろう");
  let x = 200, v = 260, brake = false; const LINE = 1040; btn.onpointerdown = () => { brake = true; btn.setAttribute("opacity", .7); }; btn.onpointerup = btn.onpointerleave = () => { brake = false; btn.setAttribute("opacity", 1); };
  const res = await new Promise(r => addTick(dt => { if (!g.isConnected) { r("x"); return false; } if (brake) v = Math.max(0, v - 330 * dt); x += v * dt; bk.setAttribute("transform", `translate(${x.toFixed(1)} 600)`);
      if (v === 0) { r(x <= LINE ? "ok" : "over"); return false; } if (x > LINE + 120) { r("over"); return false; } }));
  let ok = false;
  if (res === "ok") { chime(); await speak(C.pony, "od_tm_ok", "ぴたっと とまれた！"); await speak(C.pony, "od_say", "ルールを いって みよう"); ok = await odSay(pc, "rl_tomare", "とまれでは いちど とまる", [["とまれ", "止まれ", "とまる", "止まる"]]); }
  else { noise(.3, 500, .5); await speak(C.pony, "od_tm_ng", "せんを こえちゃった！ あぶない！ つぎは はやめに ブレーキを かけようね"); }
  return odEnd(pc, g, ok, { type: "od_tomare", res }); }
// ⚽ とびだし
async function odTobi(pc) { const g = panel("あぶない！", "#FFF0F5");
  el("rect", { x: 140, y: 380, width: 1320, height: 160, fill: "#8C939C" }, g); txt(g, 1300, 500, "🚗", 120, { "text-anchor": "middle" }); const b = txt(g, 300, 600, "⚽", 80, { "text-anchor": "middle" });
  tween(900, k => b.setAttribute("transform", `translate(${(500 * k).toFixed(0)} ${(-120 * k).toFixed(0)}) rotate(${(k * 540).toFixed(0)} 300 580)`)); noise(.1, 900, .3);
  await speak(C.pony, "od_tb_q", "ボールが どうろに ころがって いったよ。どうする？");
  const wrong = await odChoose(g, [["おいかける", "🏃", 0], ["とまる", "✋", 1]]);
  await speak(C.pony, "od_ok", "せいかい！"); await speak(C.pony, "od_say", "ルールを いって みよう");
  const ok = await odSay(pc, "od_tb_r", "どうろに とびださない", [["とびださない", "飛び出さない", "とびだしちゃ", "飛び出しちゃ"]]);
  return odEnd(pc, g, ok && !wrong, { type: "od_tobi", wrong }); }
// ↱ まがりかど：むこうが みえない → とまって たしかめる（かどから ひとが でて くる）
async function odKado(pc) { const g = panel("まがりかど", "#EAF6FF");
  el("rect", { x: 140, y: 560, width: 1320, height: 150, fill: "#8C939C" }, g); el("rect", { x: 980, y: 180, width: 170, height: 530, fill: "#8C939C" }, g); // L の みち
  el("rect", { x: 1150, y: 180, width: 310, height: 380, fill: "#E9DCC6", ...S6(6) }, g); txt(g, 1305, 400, "🏠", 140, { "text-anchor": "middle" }); // かどの へい
  el("rect", { x: 140, y: 180, width: 840, height: 380, fill: "#C9E7B8" }, g); el("rect", { x: 700, y: 300, width: 280, height: 260, fill: "#D9C6A8", ...S6(6) }, g); // みえない かべ
  const bk = el("g", { transform: "translate(360 560)" }, g); if (odIdx(pc) >= OD_BIKE_AT) { const bb = bikeG(bk); bb.setAttribute("transform", "scale(.5)"); txt(bk, 0, -60, "🧒", 80, { "text-anchor": "middle" }); } else txt(bk, 0, -10, "🚶", 120, { "text-anchor": "middle", transform: "scale(-1 1)" });
  const hito = txt(g, 1065, 260, "🚶", 110, { "text-anchor": "middle", opacity: 0 });
  await tween(900, k => bk.setAttribute("transform", `translate(${(360 + 360 * k).toFixed(0)} 560)`));
  await speak(C.pony, "od_kd_q", "まがりかどに きたよ。むこうが みえないね。どうする？");
  const wrong = await odChoose(g, [["とまって たしかめる", "✋", 1], ["そのまま まがる", "💨", 0]]);
  hito.setAttribute("opacity", 1); tween(1200, k => hito.setAttribute("transform", `translate(0 ${(260 * k).toFixed(0)})`)); markAbove(C.pony, "ex");
  await speak(C.pony, "od_kd_see", "ほら、かどから ひとが でて きたね。とまって よかった！");
  await speak(C.pony, "od_say", "ルールを いって みよう");
  const ok = await odSay(pc, "od_kd_r", "まがりかどは、とまって たしかめる", [["まがりかど", "曲がり角"], ["とまって", "止まって", "たしかめ", "確かめ"]]);
  return odEnd(pc, g, ok && !wrong, { type: "od_kado", wrong }); }
// 🚶 ひとの とびだし：とめて ある くるまの かげから ひとが でて くる
async function odHito(pc) { const g = panel("とびだしに ちゅうい", "#FFF0F5");
  el("rect", { x: 140, y: 470, width: 1320, height: 170, fill: "#8C939C" }, g); el("rect", { x: 140, y: 640, width: 1320, height: 60, fill: "#D9CDB8", ...S6(4) }, g);
  const kid = txt(g, 1040, 570, "🧒", 130, { "text-anchor": "middle", opacity: 0 }); txt(g, 1000, 600, "🚙", 210, { "text-anchor": "middle" });
  const bk = el("g", { transform: "translate(300 640)" }, g); if (odIdx(pc) >= OD_BIKE_AT) { const bb = bikeG(bk); bb.setAttribute("transform", "scale(.5)"); txt(bk, 0, -60, "🧒", 80, { "text-anchor": "middle" }); } else txt(bk, 0, -10, "🚶", 120, { "text-anchor": "middle", transform: "scale(-1 1)" });
  await tween(800, k => bk.setAttribute("transform", `translate(${(300 + 200 * k).toFixed(0)} 640)`));
  await speak(C.pony, "od_ht_q", "とめて ある くるまの かげから、ひとが でて くるかも しれないよ。どう する？");
  const wrong = await odChoose(g, [["ゆっくり、よく みる", "👀", 1], ["いそいで いく", "💨", 0]]);
  kid.setAttribute("opacity", 1); tween(700, k => kid.setAttribute("transform", `translate(${(-160 * k).toFixed(0)} 0)`)); noise(.1, 900, .3);
  await speak(C.pony, "od_ht_see", "ほら、くるまの かげから こどもが でて きた！ ゆっくりで よかったね");
  await speak(C.pony, "od_say", "ルールを いって みよう");
  const ok = await odSay(pc, "od_ht_r", "ひとの とびだしに きを つける", [["とびだし", "飛び出し"], ["きを つけ", "気をつけ", "気を付け", "ちゅうい", "注意"]]);
  return odEnd(pc, g, ok && !wrong, { type: "od_hito", wrong }); }
// 🚲 じてんしゃの ルール（じてんしゃの ルールクイズと おなじ もんだい）
const OD_BQ = { kado: "まがりかどに きたよ。むこうが みえないね。どうする？", tobidashi: "みせの まえを はしるよ。ひとが でて きそう。どうする？", aka: "しんごうが あかだよ。どうする？", helmet: "じてんしゃに のる まえに、あたまに なにを する？", hidari: "じてんしゃは、みちの どっちがわを はしる？", kasa: "あめの ひに じてんしゃに のる ときは？", narabi: "ともだちと いっしょに はしる ときは？", tomare: "とまれの マークが あったら？", hodou: "ほどうに ひとが たくさん いるよ。どうする？", light: "くらく なって きたよ。どうする？" };
const OD_BQ_USED = new Set();
async function odBike(pc) { let pool = RQ.filter(x => !OD_BQ_USED.has(x.id)); if (!pool.length) { OD_BQ_USED.clear(); pool = RQ; } const it = pool[rnd(pool.length)]; OD_BQ_USED.add(it.id);
  const g = panel("じてんしゃの ルール", "#EAF6FF"); el("rect", { x: 560, y: 160, width: 480, height: 300, rx: 30, fill: "#FFFFFF", ...S6(6) }, g); (it.id === "aka" ? sigG(g, 800, 445, "red", .82, false) : txt(g, 800, 360, it.pic, it.pic.length > 2 ? 120 : 170, { "text-anchor": "middle" }));
  await speak(C.pony, `od_bq_${it.id}`, OD_BQ[it.id]);
  const wrong = await odChoose(g, it.cards.map(c => c.slice()), 560);
  await speak(C.pony, "od_ok", "せいかい！"); await speak(C.pony, "od_say", "ルールを いって みよう");
  const ok = await odSay(pc, `rl_${it.id}`, it.rule, it.keys);
  return odEnd(pc, g, ok && !wrong, { type: "od_bike", id: it.id, wrong }); }
// ⭕❌ クイズ
const OD_MQ = [
  { id: "akawataru", q: "あかしんごうでも、くるまが こなければ わたって いい？", a: 0, r: "あかしんごうは ぜったいに わたらないよ" },
  { id: "helmet", q: "じてんしゃに のる ときは、ヘルメットを かぶる？", a: 1, r: "ヘルメットは あたまを まもって くれるよ" },
  { id: "ball", q: "どうろで ボールあそびを しても いい？", a: 0, r: "どうろで あそぶと あぶないよ。こうえんで あそぼうね" },
  { id: "te", q: "おうだんほどうを わたる ときは、てを あげると いい？", a: 1, r: "てを あげると、くるまから よく みえるよ" },
  { id: "futari", q: "じてんしゃで ふたりのりを しても いい？", a: 0, r: "ふたりのりは あぶないから しないよ" },
  { id: "light", q: "くらい みちでは、じてんしゃの ライトを つける？", a: 1, r: "ライトを つけると、まわりから よく みえるよ" },
  { id: "hodou", q: "ほどうでは、じてんしゃで びゅんびゅん はしって いい？", a: 0, r: "ほどうは あるく ひとが さき。ゆっくり だよ" },
  { id: "kado", q: "まがりかどは、スピードを だして まがって いい？", a: 0, r: "まがりかどは、とまって たしかめようね" },
  { id: "kage", q: "とめて ある くるまの かげから、ひとが でて くる ことが ある？", a: 1, r: "かげから ひとが でて くるかも。きを つけようね" },
  { id: "migihidari", q: "どうろを わたる ときは、とまって、みぎ、ひだり、もう いちど みぎを みる？", a: 1, r: "とまって、みぎ、ひだり、もう いちど みぎ。ちゃんと みてから わたろうね" },
  { id: "keitai", q: "じてんしゃに のりながら、スマホを みて いい？", a: 0, r: "まえを みて はしろうね" },
];
const OD_MQ_USED = new Set();
async function odMaru(pc) { let pool = OD_MQ.filter(x => !OD_MQ_USED.has(x.id)); if (!pool.length) { OD_MQ_USED.clear(); pool = OD_MQ; } const it = pool[rnd(pool.length)]; OD_MQ_USED.add(it.id);
  const g = panel("まる・ばつ クイズ", "#FFFBE6"); el("rect", { x: 160, y: 170, width: 1280, height: 280, rx: 30, fill: "#FFFFFF", ...S6(6) }, g);
  const lines = it.q.split("、"); lines.forEach((l, i) => txt(g, 800, 290 + (i - (lines.length - 1) / 2) * 80, l + (i < lines.length - 1 ? "、" : ""), 54, { "text-anchor": "middle" }));
  await speak(C.pony, "od_mq_intro", "まるか ばつか、タッチしてね"); await speak(C.pony, `od_mq_${it.id}`, it.q);
  const cs = [["まる", "⭕", 1], ["ばつ", "❌", 0]].map(([lab, emo, v], j) => { const c = card(g, 300 + j * 560, 540, 440, 260, null, emo, { es: 180 }); c.v = v; return c; });
  const pick = await new Promise(res => { let live = true; cs.forEach(c => c.onclick = () => { live = false; res(c.v); });
    (async () => { while (live) { const r = await listen([["まる", "丸", "ばつ", "バツ", "×"]], 9000); if (!live) return; if (r.r === "ok") { const h = r.heard || ""; live = false; res(/ばつ|バツ|×/.test(h) ? 0 : 1); return; } await sleep(200); } })(); });
  cs.forEach(c => c.onclick = null); const ok = pick === it.a; const hit = cs[it.a ? 0 : 1]; hit.rect.setAttribute("fill", "#FFE27A");
  if (ok) { chime(); await speak(C.pony, "od_ok", "せいかい！"); } else { noise(.2, 500, .4); await speak(C.pony, "od_mq_ng", "ざんねん！"); }
  await speak(C.pony, `od_mr_${it.id}`, it.r);
  return odEnd(pc, g, ok, { type: "od_maru", id: it.id, pick }); }
// ⛰ くだりざか
async function odSaka(pc) { const g = panel("くだりざか", "#EAF6FF"); el("path", { d: "M140 300 L1460 800 L1460 900 L140 900 Z", fill: "#B9DE9F", ...S6(5) }, g);
  const bk = el("g", {}, g); bikeG(bk).setAttribute("transform", "scale(.55)"); txt(bk, 0, -66, "🧒", 80, { "text-anchor": "middle" }); bk.setAttribute("transform", "translate(260 300) rotate(20)");
  await speak(C.pony, "od_sk_intro", "ながい くだりざかだ！ なにに きを つける？");
  const ok = await odSay(pc, "od_sk_r", "スピードを だしすぎない", [["すぴーど", "スピード"], ["だしすぎ", "出しすぎ", "出し過ぎ", "ださない", "出さない"]]);
  await tween(ok ? 1600 : 900, k => bk.setAttribute("transform", `translate(${(260 + 1000 * k).toFixed(0)} ${(300 + 380 * k).toFixed(0)}) rotate(20)`));
  return odEnd(pc, g, ok, { type: "od_saka" }); }
// 🙇 すみません、とおります
async function odSumimasen(pc) { const g = panel("ほそい みち", "#FFF0E3"); el("rect", { x: 140, y: 600, width: 1320, height: 120, fill: "#D9CDB8", ...S6(4) }, g);
  ["👵", "🧑‍🦯", "👨‍👧"].forEach((e, i) => txt(g, 700 + i * 220, 620, e, 130, { "text-anchor": "middle" })); txt(g, 330, 620, "🧒", 130, { "text-anchor": "middle" });
  await speak(C.pony, "od_sm_intro", "ほそい みちに ひとが いるよ。こえを かけて とおして もらおう");
  const ok = await odSay(pc, "blk_jitensha", "すみません、とおります", [["すみません", "済みません"], ["とおります", "通ります", "とうります"]]);
  return odEnd(pc, g, ok, { type: "od_sumimasen" }); }
// 👮 おまわりさんに あいさつ
async function odPolice(pc) { const g = panel("おまわりさん", "#EAF6FF"); const po = txt(g, 1050, 640, "👮", 260, { "text-anchor": "middle" }); txt(g, 520, 640, "🧒", 200, { "text-anchor": "middle" });
  await speak(C.pony, "od_po_intro", "おまわりさんだ！ げんきに あいさつ しよう");
  const ok = await odSay(pc, "od_po_r", "こんにちは", [["こんにちは", "今日は", "こんにちわ"]]);
  if (ok) { tween(600, k => po.setAttribute("transform", `translate(0 ${(-40 * Math.sin(k * Math.PI)).toFixed(0)})`)); await speak(C.pony, "od_po_ok", "おまわりさんに ほめられた！"); }
  return odEnd(pc, g, ok, { type: "od_police" }); }
Object.assign(LTASK_RUN, { sig: odSig, zebra: odZebra, tomare: odTomare, tobi: odTobi, bike: odBike, maru: odMaru, saka: odSaka, sumimasen: odSumimasen, police: odPolice, kado: odKado, hito: odHito });
