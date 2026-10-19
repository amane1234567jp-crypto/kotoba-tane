/* ================= 「かんがえて みよう！」コース（komatta、2026-10-19） =================
   こまった ことが おきた ときに、すじみちを たてて かんがえる 練習。どの マスも おなじ ステップで かんがえる：
   👀① なにが こまった？ → 🤔② どうして？ → 💡③ どうする？（カードを えらぶ。よくない やりかたも まぜる）→ ✅④ どれに する？ どうして？ → 🔁⑤ つぎから どう する？
   レベルで ステップを ふやす：段1〜2＝①③、段3〜4＝①〜④、段5〜6＝①〜⑤。データは sit/komatta_gen.py → komatta_data.js。
   ライバルの がおは、あわてて よくない やりかたを いう 係。こどもが「いい やりかた」を おしえる。 */
const S9L = ["komatta"];
RIVAL_OF.komatta = "gao";
const KM_N = new Map(); // つかった かず
const KM_STEP = [["👀", "なにが こまった？"], ["🤔", "どうして？"], ["💡", "どうする？"], ["✅", "どれに する？"], ["🔁", "つぎから"]];
// こたえる 子の かぞく・ばしょの 人
function kmAsker(sc, hero) { if (sc.asker !== "mama") return sc.asker; if (hero === "shima") return "mama"; return MOM_OF[hero] || (hero === "doshin" ? "doshinpapa" : null); }
function kmPick(hero, done) {
  let pool = KM.sc.filter(s => s.extra !== hero && s.asker !== hero && kmAsker(s, hero));
  if (done) { const d = pool.filter(s => KM_N.get(s.id)); if (d.length) pool = d; }
  const m = Math.min(...pool.map(s => KM_N.get(s.id) || 0)); pool = pool.filter(s => (KM_N.get(s.id) || 0) === m);
  return pool[rnd(pool.length)]; }
{ const ap = applyStage; applyStage = function (id, ...a) { if (id === "komatta") KM_N.clear(); return ap(id, ...a); }; }
// ステップの バー（いま どこを かんがえて いるか）
function kmBar(steps) { const g = el("g", {}, hudLayer); // ひだりの はしに たてに ならべる（ふきだし・こたえと かさならない）
  const items = steps.map((si, i) => { const y = 130 + i * 118, gg = el("g", {}, g); const r = el("rect", { x: 12, y, width: 176, height: 106, rx: 24, fill: "#FFFFFF", ...S6(6) }, gg);
    txt(gg, 100, y + 50, KM_STEP[si][0], 46, { "text-anchor": "middle" }); txt(gg, 100, y + 90, KM_STEP[si][1], KM_STEP[si][1].length > 6 ? 22 : 26, { "text-anchor": "middle" }); gg.setAttribute("opacity", .45); return { gg, r }; });
  return { g, on(i) { items.forEach((it, j) => { it.gg.setAttribute("opacity", j <= i ? 1 : .45); it.r.setAttribute("fill", j === i ? "#FFE27A" : j < i ? "#C9EBB5" : "#FFFFFF"); }); }, remove() { g.remove(); } }; }
// こたえを いう（お手本 → 2かいまで）
async function kmSay(h, key, text, keys, tag = "こたえよう") {
  showTask(text, tag); await speak(C.pony, key, text); unsay();
  let ok = false, heard = ""; for (let n = 0; n < 2 && !ok; n++) { setListen(h, true); const r = await listen(keys, 8000); setListen(h, false); heard = r.heard || ""; ok = r.r === "ok";
    if (!ok && n === 0) await speak(C.pony, "p_again", "もう いっかい いってみよう"); }
  if (!ok) { await speak(C.pony, "p_together", "いっしょに いおうね"); await speak(C.pony, key, text); }
  hideTask(); if (ok) { chime(); markAbove(h, "sparkle"); } return { ok, heard }; }
// 場面の はじまり：こまって いる ようす → あいてが くる
async function kmIntro(sc, hero, asker) {
  const s = { id: "km_" + sc.id, place: sc.place, asker, intro: "km_" + sc.id };
  const v = setSitView(s, hero), h = v.hero, a = v.ask; a.dx.v = a.dx.t = 900;
  let ex = null; if (sc.extra) { ex = xtra(sc.extra, 1000); if (sc.extra === "chu") { ex.sadMouth = true; for (let i = 0; i < 4; i++) later(400 + i * 350, () => markAbove(ex, "drop", { dx: i % 2 ? 50 : -50 })); } else { hp7(ex, "shovel", .35); } }
  if (sc.id === "toriai") window.__kms = hp7(h, "shovel", .35);
  enter(h); await sleep(1000); h.sadMouth = true; playMove(h, "think"); const hb = hint7(h, sc.emo, sc.hint); markAbove(h, "q"); await sleep(1100);
  enter(a); await sleep(1000); return { h, a, hb, ex }; }
async function kmRun(heroKind) {
  const sc = kmPick(heroKind), asker = kmAsker(sc, heroKind), Q = KM.q[asker], t = tierOf();
  KM_N.set(sc.id, (KM_N.get(sc.id) || 0) + 1);
  const steps = t <= 1 ? [0, 2] : t <= 3 ? [0, 1, 2, 3] : [0, 1, 2, 3, 4], lv = t >= 3 ? 1 : 0;
  showEngine(null, `かんがえて みよう（${sc.id}・段${t + 1}）`);
  const { h, a, hb } = await kmIntro(sc, heroKind, asker);
  await speak(a, `kmq_open_${asker}`, Q.open);
  const bar = kmBar(steps); await speak(C.pony, "kmp_intro", "こまった！ じゅんばんに かんがえて みよう");
  let okN = 0, nSay = 0, wrong = 0, pickG = null; const log = [];
  for (let si = 0; si < steps.length; si++) { const st = steps[si]; bar.on(si); if (winner) break;
    if (st === 0 || st === 1 || st === 4) { const A = sc[["a1", "a2", "", "", "a5"][st]], q = ["q1", "q2", "", "", "q5"][st];
      await speak(a, `kmq_${q}_${asker}`, Q[q]); nSay++;
      const r = await kmSay(h, `km_${sc.id}_${["a1", "a2", "", "", "a5"][st]}_${lv}`, A[lv], A[2]); if (r.ok) { okN++; playMove(a, "nod"); } log.push(`${st + 1}${r.ok ? "○" : "×"}${r.heard}`); continue; }
    if (st === 2) { // 💡 カードを えらぶ
      await speak(a, `kmq_q3_${asker}`, Q.q3);
      const opts = shuffle([[sc.good[0], 1, 0], ...(t >= 1 ? [[sc.good[1], 1, 1]] : []), [sc.bad[0], 0, 0], ...(t >= 3 ? [[sc.bad[1], 0, 1]] : [])]);
      const g = el("g", {}, hudLayer); el("rect", { x: 205, y: 120, width: 1370, height: 300, rx: 30, fill: "#FFFFFFE8", ...S6(5) }, g);
      const W = Math.min(420, 1320 / opts.length - 20), x0 = 890 - opts.length * (W + 20) / 2 + 10;
      const cs = opts.map(([o, good, i], j) => { const c = card(g, x0 + j * (W + 20), 160, W, 220, o.label, o.emo, { es: 90, fs: 46 }); c.o = o; c.good = good; c.i = i; return c; });
      await speak(C.pony, "kmp_tap", "どれが いいかな？ タッチしてね");
      const pick = await new Promise(res => { let fin = false, live = true; const done = c => { if (fin) return; fin = true; live = false; cs.forEach(x => x.onclick = null); res(c); };
        let busy = false;
        cs.forEach(c => c.onclick = async () => { if (fin || c.dim || busy) return;
          if (c.good) { done(c); return; }
          busy = true; c.dim = 1; c.setAttribute("opacity", .35); wrong++; noise(.1, 700, .35); log.push(`3×${c.o.label}`);
          // よくない やりかたを えらんだら：どう なるかを 見せて、えらびなおす
          const bb = hint7(h, c.o.emo, "✖"); h.sadMouth = true; hold(h, "shiver", .8);
          await speak(C.pony, `km_${sc.id}_b${c.i}`, c.o.why); await speak(C.pony, "kmp_bad", "ほかの やりかたも かんがえて みよう"); bb.remove(); busy = false; });
        (async () => { const ks = cs.filter(c => c.good).map(c => c.o.keys.flat()); while (live) { const r = await listen([ks.flat()], 9000); if (r.r === "ok") { const hd = r.heard || ""; const c = cs.find(c => c.good && c.o.keys.flat().some(k_ => hd.includes(k_))) || cs.find(c => c.good); done(c); return; } if (!live) return; await sleep(200); } })(); });
      pickG = pick; pick.rect.setAttribute("fill", "#FFE27A"); chime(); await speak(C.pony, "kmp_good", "いい かんがえだね！"); await sleep(300); g.remove();
      hb.remove(); const gb = hint7(h, pick.o.emo, pick.o.label); h.sadMouth = false; joy(h); setTimeout(() => gb.remove(), 2600);
      if (t <= 1) { nSay++; const r = await kmSay(h, `km_${sc.id}_g${pick.i}_0`, pick.o.s, pick.o.keys); if (r.ok) okN++; log.push(`3○${pick.o.label}`); }
      continue; }
    if (st === 3) { // ✅ わけを つけて いう
      await speak(a, `kmq_q4_${asker}`, Q.q4); nSay++;
      const r = await kmSay(h, `km_${sc.id}_g${pickG.i}_1`, pickG.o.l, pickG.o.keys.concat([["から"]])); if (r.ok) { okN++; playMove(a, "nod"); } log.push(`4${r.ok ? "○" : "×"}${r.heard}`); }
  }
  bar.remove(); await speak(a, `kmq_res_${asker}`, Q.res);
  const ok = okN * 2 >= nSay; grade(ok && wrong === 0 && okN === nSay); GS.tasks++; if (ok) GS.ok++;
  playLog({ type: "komatta", id: sc.id, tier: t, okN, nSay, wrong, tries: log, ...(MODE === "multi" ? { who: NAMES[heroKind] } : {}) });
  if (window.__kms) { window.__kms.remove(); window.__kms = null; }
  if (ok) { joy(h); confetti(50); joy(C.pony); await speak(C.pony, "kmp_ok", "じぶんで かんがえられたね！"); await seedGet(h); }
  await sleep(500); setView("board"); return ok;
}
// ライバル（がお）の ばん：あわてて よくない やりかたを いう → こどもが おしえる
async function kmRival() {
  const sc = kmPick(RIVAL, true), asker = kmAsker(sc, RIVAL) || "nobbo", Q = KM.q[asker];
  showEngine(null, `${NAMES[RIVAL]}の ばん（${sc.id}）`);
  const { h, a, hb } = await kmIntro(sc, RIVAL, asker);
  await speak(a, `kmq_open_${asker}`, Q.open);
  playMove(h, "pump"); markAbove(h, "anger"); await speak(h, `kmg_${sc.id}`, sc.gao);
  surprise(C.shima); surprise(a); markAbove(C.pony, "q"); await sleep(400);
  const gd = sc.good[0]; await speak(C.pony, "kmp_teach", "がおくんに、いい やりかたを おしえて あげよう");
  playMove(h, "think"); await rivalSay(h, "huh");
  const r = await kmSay(C.shima, `km_${sc.id}_g0_1`, gd.l, gd.keys, `${NAMES[RIVAL]}に おしえよう`);
  playLog({ type: "teach", id: "km_" + sc.id, ok: r.ok, tries: [r.heard] }); if (r.ok) GS.ok++;
  hb.remove(); h.sadMouth = false;
  if (r.ok) { joy(C.shima); confetti(50); markAbove(h, "ex"); await rivalSay(h, "thanks"); } else await rivalSay(h, "thanks");
  hint7(h, gd.emo, gd.label); joy(h); await sleep(1000); setView("board");
}
{ const gs = gaoSit; gaoSit = async function (before) { if (curStage === "komatta") return kmRival(); return gs(before); }; }
{ const lc = landChild; landChild = async function (pc = P.shima) {
    if (curStage !== "komatta" || winner) return lc(pc);
    const k = kindOf(pc.node); if (k === "start" || k === "treasure") return lc(pc);
    const ok = await kmRun(pc.kind); if (ok && pc.player) pc.player.ok++; }; }

/* ---------- 盤 ---------- */
STAGE_DEF.komatta = { ground: "#FFF8E8", sky: "#CFEAFB", names: ["いえ", "いえ", "がっこう", "がっこう", "こうえん", "こうえん", "まち", "まち", "いえ"], fills: { いえ: "#FFE3B3", がっこう: "#D7ECFF", こうえん: "#D7F0D2", まち: "#FFD1D9" } };
board7("komatta", ["いえ", "いえ", "がっこう", "こうえん", "まち", "いえ"], "hall");
BOARD_BG.komatta = L => { bg7(L, "#FFF8E8", ["#FFE3B3", "#D7ECFF", "#D7F0D2"], "🤔 かんがえて みよう", "#8E6FD6"); txt(L, 1460, 180, "💡", 110, { "text-anchor": "middle" }); };
BLOCK_DEF.komatta = { who: "doshin", sleep: false, intro: ["p_blk_komatta", "どしんが おおきな にもつを もって こまって いるよ。どう したら いいかな？"], say: ["blk_komatta", "いっしょに はこぼう"], to: "どしんに いおう",
  keys: [["いっしょ", "一緒", "はこぼう", "運ぼう"]], res: ["rs_komatta", "ありがとう！ ふたりなら はこべるね"] };
SLEEPER_OF.komatta = "doshin";
EVENTS.komatta = { a2: ["fwd", 2, "ev_komattaf", "いい アイデアが うかんだ！ 2マス すすむよ"], m2: ["back", 2, "ev_komattab", "みちに まよった！ 2マス もどるよ"], d1: ["back", 4, "ev_komattah", "わすれものを した！ 4マス もどるよ"] };
