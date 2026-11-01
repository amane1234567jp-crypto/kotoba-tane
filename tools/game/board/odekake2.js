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

// 道路と おうだんほどう（2026-10-31：まえは しまが 道路に そって ならび、道路と 平行に なって いた）
//   上から みた 道路：横に のびる 道路を、しまの 線（横長の しろい 線を たてに ならべる）が よこぎる。こどもは 手前の ほどうから 奥へ わたる
function odRoad(g, top = 400, h = 250, cx = 800) {
  el("rect", { x: 140, y: top - 80, width: 1320, height: 80, fill: "#E9E1CC" }, g); el("rect", { x: 140, y: top + h, width: 1320, height: 110, fill: "#E9E1CC" }, g);
  el("rect", { x: 140, y: top, width: 1320, height: h, fill: "#8C939C" }, g);
  for (let x = 170; x < 1440; x += 130) if (Math.abs(x + 30 - cx) > 210) el("rect", { x, y: top + h / 2 - 5, width: 60, height: 10, fill: "#FFFFFF" }, g);
  const n = 5, bh = h / n * .55; for (let i = 0; i < n; i++) el("rect", { x: cx - 160, y: top + (i + .5) * h / n - bh / 2, width: 320, height: bh, fill: "#FFFFFF", ...S6(3) }, g);
  return { top, h, cx, near: top + h + 95, far: top - 12 }; }
async function odCross(c, R, ms = 1600) { const s0 = c.s, x = odCx(c), b0 = odBase(c); hold(c, "run", ms / 1000); if (c.__bike) { } await tween(ms, k => place(c, x, b0 + (R.far - b0) * k, s0 * (1 - .22 * k))); }
// 🚦 しんごう
async function odSig2(pc) { const red = !!rnd(2), g = panel("しんごう", "#EAF6FF");
  const R = odRoad(g, 380, 230, 800); sigG(g, 1060, R.top - 10 - 340 * .4, red ? "red" : "green", .4); /* むこうがわの ほどうに たつ */
  const me = odHero(pc, 800, R.near);
  await speak(C.pony, `od_sig_n_${red ? "red" : "green"}`, red ? "しんごうが あかだよ" : "しんごうが あおに なったよ");
  const wrong = await odChoose(g, [["とまる", "✋", red ? 1 : 0], ["わたる", "🚶", red ? 0 : 1]], 760);
  if (red) { me.armR.t = -150; later(1200, () => me.armR.t = 0); } else { me.headRot.t = -18; await sleep(350); me.headRot.t = 18; await sleep(350); me.headRot.t = 0; odCross(me, R, 1300); }
  await speak(C.pony, "od_say", "ルールを いって みよう");
  const ok = await odSay(pc, `od_sig_r2_${red ? "red" : "green"}`, red ? "しんごうが あかの ときは、とまる" : "しんごうが あおでも、みぎと ひだりを みて わたる", red ? [["あか", "赤"], ["とまる", "止まる", "とまれ", "止まれ"]] : [["みぎ", "右"], ["ひだり", "左"]]);
  return odEnd(pc, g, ok && !wrong, { type: "od_sig", id: red ? "red" : "green", wrong }); }
// 🚸 おうだんほどう：みぎ・ひだり・みぎ（あたまを うごかす）
async function odZebra2(pc) { const g = panel("おうだんほどう", "#EAF6FF");
  const R = odRoad(g, 420, 250, 800); const me = odMe(pc.kind, 800, R.near);
  const car = txt(g, 1300, R.top + R.h * .8, "🚗", 100, { "text-anchor": "middle" });
  const arr = txt(g, 800, 300, "", 90, { "text-anchor": "middle" }); let t = 0;
  addTick(dt => { if (!g.isConnected) return false; t += dt; const k = Math.floor(t / .9) % 4; arr.textContent = ["✋ とまって", "👉 みぎ", "👈 ひだり", "👉 もう いちど みぎ"][k]; me.headRot.t = [0, 22, -22, 22][k]; });
  await speak(C.pony, "od_zb_intro2", "どうろを わたる ときは、まず とまって、みぎ、ひだり、もう いちど みぎを みるよ");
  const ok = await odSay(pc, "od_zb_r3", "どうろを わたる ときは、とまって、みぎ、ひだり、もう いちど みぎ", [["とまって", "止まって"], ["みぎ", "右"], ["ひだり", "左"]]);
  if (ok) { arr.remove(); me.headRot.t = 0; chime(); await odCross(me, R, 1500); }
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
  if (res === "ok") { chime(); await speak(C.pony, "od_tm_ok", "ぴたっと とまれた！"); await speak(C.pony, "od_say", "ルールを いって みよう"); ok = await odSay(pc, "od_tm_r", "「とまれ」の ところでは、いちど とまる", [["とまれ", "止まれ", "とまる", "止まる"]]); }
  else { noise(.3, 500, .5); surprise(me); await speak(C.pony, "od_tm_ng", "せんを こえちゃった！ あぶない！ つぎは はやめに ブレーキを かけようね"); }
  return odEnd(pc, g, ok, { type: "od_tomare", res }); }
// ⚽ とびだし：ボールが どうろへ → おいかけそうに なって とまる
async function odTobi2(pc) { const g = panel("あぶない！", "#FFF0F5");
  el("rect", { x: 140, y: 380, width: 1320, height: 170, fill: "#8C939C" }, g); el("rect", { x: 140, y: 550, width: 1320, height: 90, fill: "#D9CDB8", ...S6(4) }, g);
  const car = txt(g, 1500, 500, "🚗", 120, { "text-anchor": "middle" }); const me = odMe(pc.kind, 380, 640); const b = txt(g, 470, 620, "⚽", 70, { "text-anchor": "middle" });
  tween(900, k => b.setAttribute("transform", `translate(${(420 * k).toFixed(0)} ${(-140 * k).toFixed(0)}) rotate(${(k * 540).toFixed(0)} 470 600)`)); noise(.1, 900, .3);
  await sleep(500); surprise(me); hold(me, "run", .5);
  await speak(C.pony, "od_tb_n", "ボールが どうろに ころがって いったよ");
  const wrong = await odChoose(g, [["おいかける", "🏃", 0], ["とまる", "✋", 1]], 700);
  me.armR.t = -150; later(1000, () => me.armR.t = 0); tween(1200, k => car.setAttribute("transform", `translate(${(-1500 * k).toFixed(0)} 0)`)); noise(.4, 200, .3);
  await speak(C.pony, "od_say", "ルールを いって みよう");
  const ok = await odSay(pc, "od_tb_r2", "ボールが ころがっても、どうろに とびださない", [["とびださない", "飛び出さない", "とびだしちゃ", "飛び出しちゃ"]]);
  return odEnd(pc, g, ok && !wrong, { type: "od_tobi", wrong }); }
// ↱ まがりかど：むこうが みえない → とまって たしかめる → かどから くまくんが でて くる
async function odKado2(pc) { const g = panel("まがりかど", "#EAF6FF");
  // 2026-11-01：上から 見た L字の みち に。てまえの みちを 右へ すすむと、かどで 上からの みちに つながる。かどの いえで 上の みちが 見えない
  el("rect", { x: 140, y: 120, width: 1320, height: 800, fill: "#CFE8B8" }, g);
  el("rect", { x: 140, y: 560, width: 1080, height: 180, fill: "#8C939C" }, g); el("rect", { x: 1040, y: 120, width: 180, height: 620, fill: "#8C939C" }, g);
  el("path", { d: "M160 650 H1020 M1130 140 V540", stroke: "#FFFFFF", "stroke-width": 7, "stroke-dasharray": "44 32" }, g);
  el("rect", { x: 520, y: 150, width: 500, height: 390, rx: 10, fill: "#E9DCC6", ...S6(6) }, g); txt(g, 770, 420, "🏠", 170, { "text-anchor": "middle" }); // かどの いえ（上の みちが 見えない）
  el("path", { d: "M520 540 H1020 V150", fill: "none", stroke: "#B9824A", "stroke-width": 12 }, g); // へい
  const me = odHero(pc, 300, 700); await odWalk(me, 880, 1100);
  await speak(C.pony, "od_kd_n", "まがりかどに きたよ。むこうが みえないね");
  me.headRot.t = 15; markAbove(me, "q"); await sleep(400);
  const k2 = odWho("kuma", 1130, 210, .8); k2.dx.v = k2.dx.t = 0; hold(k2, "run", 1.2); await tween(1200, k => place(k2, 1130, 210 + 420 * k, k2.s)); surprise(k2); surprise(me); markAbove(C.pony, "ex");
  await speak(C.pony, "od_kd_see2", "ほら、かどの むこうから ひとが きたね。とまって よかった！"); me.headRot.t = 0;
  await speak(C.pony, "od_say", "ルールを いって みよう");
  const ok = await odSay(pc, "od_kd_r", "まがりかどは、とまって たしかめる", [["まがりかど", "曲がり角"], ["とまって", "止まって", "たしかめ", "確かめ"]]);
  return odEnd(pc, g, ok, { type: "od_kado" }); }
// 🚶 とめて ある くるまの かげから こどもが でて くる
async function odHito2(pc) { const g = panel("とびだしに ちゅうい", "#FFF0F5");
  // 2026-11-01：あるく こども むけに。とめて ある くるまの かげから、どうろに とびださない（まえは「ひとの とびだしに きを つける」で うんてんする ひと むけ だった）
  el("rect", { x: 140, y: 470, width: 1320, height: 190, fill: "#8C939C" }, g); el("path", { d: "M140 565 H1460", stroke: "#FFFFFF", "stroke-width": 8, "stroke-dasharray": "50 36" }, g);
  el("rect", { x: 140, y: 660, width: 1320, height: 60, fill: "#D9CDB8", ...S6(4) }, g);
  const park = el("g", {}, hudLayer); txt(park, 1010, 650, "🚙", 230, { "text-anchor": "middle" });
  const me = odHero(pc, 260, 700); await odWalk(me, 760, 900);
  await speak(C.pony, "od_ht_n2", "どうろの むこうに いきたいよ。でも、とめて ある くるまの かげで、むこうが みえないね");
  const wrong = await odChoose(g, [["とまって、よく みる", "👀", 1], ["とびだす", "💨", 0]], 760);
  const mv = el("g", {}, hudLayer); const c = txt(mv, 0, 0, "🚗", 170, { "text-anchor": "middle" }); c.setAttribute("transform", "scale(-1 1)");
  surprise(me); noise(.12, 600, .3); await tween(1300, k => mv.setAttribute("transform", `translate(${(1560 - 1500 * k).toFixed(0)} 560)`)); mv.remove();
  await speak(C.pony, "od_ht_see2", "ほら、くるまが はしって きた！ くるまの かげから とびだすと、うんてんする ひとから みえなくて あぶないよ");
  await speak(C.pony, "od_say", "ルールを いって みよう");
  const ok = await odSay(pc, "od_ht_r3", "とめて ある くるまの かげから、どうろに とびださない", [["くるま", "車"], ["とびださない", "飛び出さない", "とびだしちゃ", "飛び出しちゃ"]]);
  park.remove(); return odEnd(pc, g, ok && !wrong, { type: "od_hito", wrong }); }
// ⛰ くだりざか（キャラが じてんしゃで おりる）
async function odSaka2(pc) { const g = panel("くだりざか", "#EAF6FF"); el("path", { d: "M140 380 L1460 820 L1460 900 L140 900 Z", fill: "#B9DE9F", ...S6(5) }, g);
  const me = odMe(pc.kind, 300, 430, .5); odRide(me);
  await speak(C.pony, "od_sk_intro", "ながい くだりざかだ！ なにに きを つける？");
  const ok = await odSay(pc, "od_sk_r2", "くだりざかは、スピードを だしすぎない", [["すぴーど", "スピード"], ["だしすぎ", "出しすぎ", "出し過ぎ", "ださない", "出さない"]]);
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
Object.assign(LTASK_RUN, { sig: odSig2, zebra: odZebra2, tomare: pc => odKado2(pc) /* ブレーキの ゲームは なし（2026-11-01） */, tobi: odTobi2, kado: odKado2, hito: odHito2, saka: odSaka2, sumimasen: odSumimasen2, police: odPolice2 });

/* 2026-11-01：「とまる？ わたる？」の ように えらばせるのは やめた（えらばなくても、ようすを 見て ルールを いえば いい）。
   odChoose は なにも ださずに すすむ（ただしい うごきの アニメは そのまま）。まる・ばつ クイズも なし（じてんしゃの ルールに） */
odChoose = async () => 0;
async function odBike2(pc) { let pool = RQ.filter(x => !OD_BQ_USED.has(x.id)); if (!pool.length) { OD_BQ_USED.clear(); pool = RQ; } const it = pool[rnd(pool.length)]; OD_BQ_USED.add(it.id);
  const g = panel("じてんしゃの ルール", "#EAF6FF"); el("rect", { x: 560, y: 300, width: 480, height: 300, rx: 30, fill: "#FFFFFF", ...S6(6) }, g); (it.id === "aka" ? sigG(g, 800, 585, "red", .82, false) : txt(g, 800, 500, it.pic, it.pic.length > 2 ? 120 : 170, { "text-anchor": "middle" }));
  await speak(C.pony, "od_bk_intro", "じてんしゃの ルールを いって みよう");
  const ok = await odSay(pc, `rl_${it.id}`, it.rule, it.keys);
  return odEnd(pc, g, ok, { type: "od_bike", id: it.id }); }
Object.assign(LTASK_RUN, { bike: odBike2, maru: odBike2 });
