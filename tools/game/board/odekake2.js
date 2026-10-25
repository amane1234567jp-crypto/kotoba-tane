/* ================= おでかけ だいぼうけん：課題の 絵を キャラの アニメに（2026-10-25） =================
   まえは 絵文字の ひとや「くびだけ じてんしゃに のって いる」絵で、すこし ぶきみ だった。
   こたえる 子（あそんで いる キャラ）・くまくん・おまわりさん などの キャラが うごく。テンポは はやめ。 */
const odMe = (kind, x, base, k = .62) => { const c = clone(kind, x, base, (KID_S[kind] || .8) * k); hudLayer.appendChild(c.root); return c; };
const odWho = (kind, x, base, k = 1) => { const c = clone(kind, x, base, (ASK_AT[kind] || [0, 1])[1] * .62 * k); hudLayer.appendChild(c.root); return c; };
const odCx = c => c.x + 200 * c.s, odBase = c => c.y + c.base * c.s;
// じてんしゃに のせる（じてんしゃが あしの まえに くる）
function odRide(c) { const g = el("g", {}, hudLayer); bikeG(g); follow(g, () => { const q = world(c, 200, c.base - 50); return [q.x, q.y, 0, c.s * .7]; }); hudLayer.appendChild(g); c.__bike = g; return g; }
async function odWalk(c, x2, ms = 900, run = true) { const x0 = odCx(c), b = odBase(c); if (run) hold(c, "run", ms / 1000); await tween(ms, k => place(c, x0 + (x2 - x0) * k, b, c.s)); }
const odUseBike = pc => odIdx(pc) >= OD_BIKE_AT;
function odHero(pc, x, base) { const c = odMe(pc.kind, x, base); if (odUseBike(pc)) odRide(c); return c; }
{ const oe = odEnd; odEnd = async function (pc, g, ok, log) { clearClones(); document.querySelectorAll(".odfx").forEach(e => e.remove()); return oe(pc, g, ok, log); }; }
const odFx = () => { const g = el("g", { class: "odfx" }, front()); return g; };

// 🚦 しんごう
async function odSig2(pc) { const red = !!rnd(2), g = panel("しんごう", "#EAF6FF");
  el("rect", { x: 140, y: 560, width: 1320, height: 170, fill: "#8C939C" }, g); zebraG(g, 560, 585); sigG(g, 1300, 470, red ? "red" : "green", .9);
  const me = odHero(pc, 380, 600);
  await speak(C.pony, `od_sig_q_${red ? "red" : "green"}`, red ? "しんごうが あかだよ。とまる？ わたる？ タッチしてね" : "しんごうが あおに なったよ。とまる？ わたる？ タッチしてね");
  const wrong = await odChoose(g, [["とまる", "✋", red ? 1 : 0], ["わたる", "🚶", red ? 0 : 1]], 760);
  if (red) { me.armR.t = -150; later(1200, () => me.armR.t = 0); } else { me.headRot.t = -18; await sleep(350); me.headRot.t = 18; await sleep(350); me.headRot.t = 0; odWalk(me, 1000, 1300); }
  await speak(C.pony, "od_ok", "せいかい！"); await speak(C.pony, "od_say", "ルールを いって みよう");
  const ok = await odSay(pc, `od_sig_r_${red ? "red" : "green"}`, red ? "あかは とまれ" : "あおでも、みぎと ひだりを みて わたる", red ? [["あか", "赤"], ["とまれ", "止まれ", "とまる", "止まる"]] : [["みぎ", "右"], ["ひだり", "左"]]);
  return odEnd(pc, g, ok && !wrong, { type: "od_sig", id: red ? "red" : "green", wrong }); }
// 🚸 おうだんほどう：みぎ・ひだり・みぎ（あたまを うごかす）
async function odZebra2(pc) { const g = panel("おうだんほどう", "#EAF6FF");
  el("rect", { x: 140, y: 600, width: 1320, height: 170, fill: "#8C939C" }, g); zebraG(g, 520, 625); const me = odMe(pc.kind, 400, 640);
  const car = txt(g, 1380, 700, "🚗", 110, { "text-anchor": "middle" });
  const arr = txt(g, 800, 300, "", 90, { "text-anchor": "middle" }); let t = 0;
  addTick(dt => { if (!g.isConnected) return false; t += dt; const k = Math.floor(t / .9) % 4; arr.textContent = ["✋ とまって", "👉 みぎ", "👈 ひだり", "👉 もう いちど みぎ"][k]; me.headRot.t = [0, 22, -22, 22][k]; });
  await speak(C.pony, "od_zb_intro2", "どうろを わたる ときは、まず とまって、みぎ、ひだり、もう いちど みぎを みるよ");
  const ok = await odSay(pc, "od_zb_r2", "とまって、みぎ、ひだり、もう いちど みぎ", [["とまって", "止まって"], ["みぎ", "右"], ["ひだり", "左"]]);
  if (ok) { arr.remove(); me.headRot.t = 0; chime(); await odWalk(me, 1150, 1300); }
  return odEnd(pc, g, ok, { type: "od_zebra" }); }
// 🛑 とまれ：ブレーキを ながく おして、せんの まえで とまる（キャラが じてんしゃに のる）
async function odTomare2(pc) { const g = panel("とまれ", "#FFF6E9");
  el("rect", { x: 140, y: 500, width: 1320, height: 180, fill: "#8C939C" }, g); el("rect", { x: 1080, y: 500, width: 18, height: 180, fill: "#FFFFFF" }, g); txt(g, 1160, 610, "とまれ", 50, { fill: "#FFFFFF" });
  const sg = el("g", { transform: "translate(1260 300)" }, g); el("path", { d: "M-90 -80 H90 L0 80 Z", fill: "#E8473C", ...S6(6) }, sg); txt(sg, 0, -18, "とまれ", 40, { "text-anchor": "middle", fill: "#FFFFFF" });
  const me = odMe(pc.kind, 200, 640, .55); odRide(me);
  const btn = el("g", { style: "cursor:pointer" }, g); el("rect", { x: 560, y: 740, width: 480, height: 150, rx: 75, fill: "#E8473C", ...S6(6) }, btn); txt(btn, 800, 835, "✋ ブレーキ", 60, { "text-anchor": "middle", fill: "#FFFFFF" });
  await speak(C.pony, "od_tm_intro", "とまれの マークだ！ ブレーキの ボタンを ながく おして、せんの まえで とまろう");
  let x = 200, v = 260, brake = false; const LINE = 1040; btn.onpointerdown = () => { brake = true; btn.setAttribute("opacity", .7); }; btn.onpointerup = btn.onpointerleave = () => { brake = false; btn.setAttribute("opacity", 1); };
  const res = await new Promise(r => addTick(dt => { if (!g.isConnected) { r("x"); return false; } if (brake) v = Math.max(0, v - 330 * dt); x += v * dt; place(me, x, 640, me.s);
      if (v === 0) { r(x + 60 <= LINE ? "ok" : "over"); return false; } if (x > LINE + 120) { r("over"); return false; } }));
  let ok = false;
  if (res === "ok") { chime(); await speak(C.pony, "od_tm_ok", "ぴたっと とまれた！"); await speak(C.pony, "od_say", "ルールを いって みよう"); ok = await odSay(pc, "rl_tomare", "とまれでは いちど とまる", [["とまれ", "止まれ", "とまる", "止まる"]]); }
  else { noise(.3, 500, .5); surprise(me); await speak(C.pony, "od_tm_ng", "せんを こえちゃった！ あぶない！ つぎは はやめに ブレーキを かけようね"); }
  return odEnd(pc, g, ok, { type: "od_tomare", res }); }
// ⚽ とびだし：ボールが どうろへ → おいかけそうに なって とまる
async function odTobi2(pc) { const g = panel("あぶない！", "#FFF0F5");
  el("rect", { x: 140, y: 380, width: 1320, height: 170, fill: "#8C939C" }, g); el("rect", { x: 140, y: 550, width: 1320, height: 90, fill: "#D9CDB8", ...S6(4) }, g);
  const car = txt(g, 1500, 500, "🚗", 120, { "text-anchor": "middle" }); const me = odMe(pc.kind, 380, 640); const b = txt(g, 470, 620, "⚽", 70, { "text-anchor": "middle" });
  tween(900, k => b.setAttribute("transform", `translate(${(420 * k).toFixed(0)} ${(-140 * k).toFixed(0)}) rotate(${(k * 540).toFixed(0)} 470 600)`)); noise(.1, 900, .3);
  await sleep(500); surprise(me); hold(me, "run", .5);
  await speak(C.pony, "od_tb_q", "ボールが どうろに ころがって いったよ。どうする？");
  const wrong = await odChoose(g, [["おいかける", "🏃", 0], ["とまる", "✋", 1]], 700);
  me.armR.t = -150; later(1000, () => me.armR.t = 0); tween(1200, k => car.setAttribute("transform", `translate(${(-1500 * k).toFixed(0)} 0)`)); noise(.4, 200, .3);
  await speak(C.pony, "od_ok", "せいかい！"); await speak(C.pony, "od_say", "ルールを いって みよう");
  const ok = await odSay(pc, "od_tb_r", "どうろに とびださない", [["とびださない", "飛び出さない", "とびだしちゃ", "飛び出しちゃ"]]);
  return odEnd(pc, g, ok && !wrong, { type: "od_tobi", wrong }); }
// ↱ まがりかど：むこうが みえない → とまって たしかめる → かどから くまくんが でて くる
async function odKado2(pc) { const g = panel("まがりかど", "#EAF6FF");
  el("rect", { x: 140, y: 560, width: 1320, height: 170, fill: "#8C939C" }, g);
  el("rect", { x: 980, y: 180, width: 420, height: 380, fill: "#E9DCC6", ...S6(6) }, g); txt(g, 1190, 420, "🏠", 140, { "text-anchor": "middle" }); // かどの いえ（むこうが みえない）
  const me = odHero(pc, 260, 660); await odWalk(me, 560, 900);
  await speak(C.pony, "od_kd_q", "まがりかどに きたよ。むこうが みえないね。どうする？");
  const wrong = await odChoose(g, [["とまって たしかめる", "✋", 1], ["そのまま まがる", "💨", 0]], 760);
  me.headRot.t = 15; markAbove(me, "q"); const k2 = odWho("kuma", 1560, 660); k2.dx.v = k2.dx.t = 0; await odWalk(k2, 1100, 1100); surprise(k2); markAbove(C.pony, "ex");
  await speak(C.pony, "od_kd_see", "ほら、かどから ひとが でて きたね。とまって よかった！"); me.headRot.t = 0;
  await speak(C.pony, "od_say", "ルールを いって みよう");
  const ok = await odSay(pc, "od_kd_r", "まがりかどは、とまって たしかめる", [["まがりかど", "曲がり角"], ["とまって", "止まって", "たしかめ", "確かめ"]]);
  return odEnd(pc, g, ok && !wrong, { type: "od_kado", wrong }); }
// 🚶 とめて ある くるまの かげから こどもが でて くる
async function odHito2(pc) { const g = panel("とびだしに ちゅうい", "#FFF0F5");
  el("rect", { x: 140, y: 470, width: 1320, height: 190, fill: "#8C939C" }, g); el("rect", { x: 140, y: 660, width: 1320, height: 60, fill: "#D9CDB8", ...S6(4) }, g);
  const kid = odWho("panna", 1150, 650, .9); kid.root.style.display = "none"; const car = el("g", {}, hudLayer); txt(car, 1020, 640, "🚙", 230, { "text-anchor": "middle" });
  const me = odHero(pc, 260, 690); await odWalk(me, 480, 800);
  await speak(C.pony, "od_ht_q", "とめて ある くるまの かげから、ひとが でて くるかも しれないよ。どう する？");
  const wrong = await odChoose(g, [["ゆっくり、よく みる", "👀", 1], ["いそいで いく", "💨", 0]], 760);
  kid.root.style.display = ""; await odWalk(kid, 860, 700); surprise(me); noise(.1, 900, .3);
  await speak(C.pony, "od_ht_see", "ほら、くるまの かげから こどもが でて きた！ ゆっくりで よかったね");
  await speak(C.pony, "od_say", "ルールを いって みよう");
  const ok = await odSay(pc, "od_ht_r", "ひとの とびだしに きを つける", [["とびだし", "飛び出し"], ["きを つけ", "気をつけ", "気を付け", "ちゅうい", "注意"]]);
  car.remove(); return odEnd(pc, g, ok && !wrong, { type: "od_hito", wrong }); }
// ⛰ くだりざか（キャラが じてんしゃで おりる）
async function odSaka2(pc) { const g = panel("くだりざか", "#EAF6FF"); el("path", { d: "M140 380 L1460 820 L1460 900 L140 900 Z", fill: "#B9DE9F", ...S6(5) }, g);
  const me = odMe(pc.kind, 300, 430, .5); odRide(me);
  await speak(C.pony, "od_sk_intro", "ながい くだりざかだ！ なにに きを つける？");
  const ok = await odSay(pc, "od_sk_r", "スピードを だしすぎない", [["すぴーど", "スピード"], ["だしすぎ", "出しすぎ", "出し過ぎ", "ださない", "出さない"]]);
  await tween(ok ? 1500 : 800, k => place(me, 300 + 1000 * k, 430 + 333 * k, me.s));
  return odEnd(pc, g, ok, { type: "od_saka" }); }
// 🙇 ほそい みち：「すみません、とおります」→ みんなが よけて くれる
async function odSumimasen2(pc) { const g = panel("ほそい みち", "#FFF0E3"); el("rect", { x: 140, y: 620, width: 1320, height: 120, fill: "#D9CDB8", ...S6(4) }, g);
  const ppl = [["meebaa", 760], ["kamejii", 980], ["pannamama", 1200]].filter(([k]) => C[k] || typeof makeChar === "function").map(([k, x]) => odWho(k, x, 700));
  const me = odHero(pc, 330, 700);
  await speak(C.pony, "od_sm_intro", "ほそい みちに ひとが いるよ。こえを かけて とおして もらおう");
  const ok = await odSay(pc, "blk_jitensha", "すみません、とおります", [["すみません", "済みません"], ["とおります", "通ります", "とうります"]]);
  if (ok) { ppl.forEach((c, i) => { playMove(c, "nod"); const b = odBase(c); tween(500, k => place(c, odCx(c), b - 60 * k, c.s)); }); await sleep(500); await odWalk(me, 1400, 1300); }
  return odEnd(pc, g, ok, { type: "od_sumimasen" }); }
// 👮 おまわりさんに あいさつ
async function odPolice2(pc) { const g = panel("おまわりさん", "#EAF6FF"); el("rect", { x: 140, y: 640, width: 1320, height: 100, fill: "#D9CDB8", ...S6(4) }, g);
  const po = odWho("omawari", 1100, 720); const me = odHero(pc, 480, 720);
  await speak(C.pony, "od_po_intro", "おまわりさんだ！ げんきに あいさつ しよう");
  const ok = await odSay(pc, "od_po_r", "こんにちは", [["こんにちは", "今日は", "こんにちわ"]]);
  if (ok) { po.armR.t = -140; playMove(po, "nod"); later(1300, () => po.armR.t = 0); joy(me); await speak(C.pony, "od_po_ok", "おまわりさんに ほめられた！"); }
  return odEnd(pc, g, ok, { type: "od_police" }); }
Object.assign(LTASK_RUN, { sig: odSig2, zebra: odZebra2, tomare: odTomare2, tobi: odTobi2, kado: odKado2, hito: odHito2, saka: odSaka2, sumimasen: odSumimasen2, police: odPolice2 });
