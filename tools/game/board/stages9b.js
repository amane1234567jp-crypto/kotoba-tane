/* ================= 「かんがえて みよう！」の 作りかえ（2026-10-29） =================
   きく役を 先生・ママ から ナレーターの ぽにー に。先生が「どうして そう なったと おもいますか？」と きくのは 現実には ありえない、との 指摘。
   ① こまった 子が ひとりで いる → ぽにーが 声を かけて、じゅんばんに かんがえる（なにが こまった？／どうして？／どうする？（カード）／どれに する？／つぎから）
   ② さいごに ぽにー「じゃあ、せんせいに いって みよう！」→ 相手が 来る → 子どもが 相手に いう（KM2.say）→ 相手が ふつうに こたえる（kmr_…）
   データは sit/komatta_gen2.py → komatta_data2.js（KM2）。stages9.js の kmIntro / kmRun / kmRival を 上書きする。 */
KM_STEP[0][1] = "なにが こまった？";
// 場面の はじまり：こまって いる 子だけ。相手は 右の そとで まつ（いう ときに 来る）
kmIntro = async function (sc, hero, asker) {
  const s = { id: "km_" + sc.id, place: sc.place, asker, intro: "km_" + sc.id };
  const v = setSitView(s, hero), h = v.hero, a = v.ask; a.dx.v = a.dx.t = 900;
  let ex = null; if (sc.extra) { ex = xtra(sc.extra, 1000); if (sc.extra === "chu") { ex.sadMouth = true; for (let i = 0; i < 4; i++) later(400 + i * 350, () => markAbove(ex, "drop", { dx: i % 2 ? 50 : -50 })); } else { hp7(ex, "shovel", .35); } }
  if (sc.id === "toriai") window.__kms = hp7(h, "shovel", .35);
  enter(h); await sleep(1000); h.sadMouth = true; playMove(h, "think"); const hb = hint7(h, sc.emo, sc.hint); markAbove(h, "q"); await sleep(900);
  return { h, a, hb, ex }; };
// さいごの ステップ：相手に いって、へんじを もらう
async function kmGo(sc, h, a, ex, asker) {
  const d = KM2.say[sc.id]; if (!d) return { ok: true, heard: "" };
  const who = d.to || asker, tgt = d.to ? ex : a;
  await speak(C.pony, KM2.go[who] || "kmp_go_sensei", KM2.go[who] ? ({ kmp_go_sensei: "じゃあ、せんせいに いって みよう！", kmp_go_mama: "じゃあ、ママに いって みよう！", kmp_go_papa: "じゃあ、パパに いって みよう！", kmp_go_tenin: "じゃあ、おみせの ひとに いって みよう！", kmp_go_kon: "じゃあ、こんくんに いって みよう！", kmp_go_chu: "じゃあ、ちゅうくんに いって みよう！" })[KM2.go[who]] : "じゃあ、いって みよう！");
  if (!d.to) { enter(a); await sleep(1100); }
  h.sadMouth = false; const r = await kmSay(h, `km_${sc.id}_say`, d.say, d.keys, "いって みよう");
  playMove(tgt, "nod"); await speak(tgt, `kmr_${sc.id}_${who}`, d.reply); return r; }
kmRun = async function (heroKind) {
  const sc = kmPick(heroKind), asker = kmAsker(sc, heroKind), t = tierOf();
  KM_N.set(sc.id, (KM_N.get(sc.id) || 0) + 1);
  const steps = t <= 1 ? [0, 2] : t <= 3 ? [0, 1, 2, 3] : [0, 1, 2, 3, 4], lv = t >= 3 ? 1 : 0;
  showEngine(null, `かんがえて みよう（${sc.id}・段${t + 1}）`);
  const { h, a, hb, ex } = await kmIntro(sc, heroKind, asker);
  await speak(C.pony, "kmp_open", "あれ？ こまった かおを して いるね");
  const bar = kmBar(steps); await speak(C.pony, "kmp_intro2", "ぽにーと いっしょに、じゅんばんに かんがえて みよう");
  const PQ = { q1: "なにが こまって いるの？", q2: "どうして、そう なったのかな？", q3: "どんな やりかたが あるかな？", q4: "どれに する？ どうして？", q5: "つぎからは、どう する？" };
  let okN = 0, nSay = 0, wrong = 0, pickG = null; const log = [];
  for (let si = 0; si < steps.length; si++) { const st = steps[si]; bar.on(si); if (winner) break;
    if (st === 0 || st === 1 || st === 4) { const A = sc[["a1", "a2", "", "", "a5"][st]], q = ["q1", "q2", "", "", "q5"][st];
      await speak(C.pony, `kmp_${q}`, PQ[q]); nSay++;
      const r = await kmSay(h, `km_${sc.id}_${["a1", "a2", "", "", "a5"][st]}_${lv}`, A[lv], A[2]); if (r.ok) { okN++; playMove(C.pony, "nod"); } log.push(`${st + 1}${r.ok ? "○" : "×"}${r.heard}`); continue; }
    if (st === 2) { // 💡 カードを えらぶ
      await speak(C.pony, "kmp_q3", PQ.q3);
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
          const bb = hint7(h, c.o.emo, "✖"); h.sadMouth = true; hold(h, "shiver", .8);
          await speak(C.pony, `km_${sc.id}_b${c.i}`, c.o.why); await speak(C.pony, "kmp_bad", "ほかの やりかたも かんがえて みよう"); bb.remove(); busy = false; });
        (async () => { const ks = cs.filter(c => c.good).map(c => c.o.keys.flat()); while (live) { const r = await listen([ks.flat()], 9000); if (r.r === "ok") { const hd = r.heard || ""; const c = cs.find(c => c.good && c.o.keys.flat().some(k_ => hd.includes(k_))) || cs.find(c => c.good); done(c); return; } if (!live) return; await sleep(200); } })(); });
      pickG = pick; pick.rect.setAttribute("fill", "#FFE27A"); chime(); await speak(C.pony, "kmp_good", "いい かんがえだね！"); await sleep(300); g.remove();
      hb.remove(); const gb = hint7(h, pick.o.emo, pick.o.label); h.sadMouth = false; joy(h); setTimeout(() => gb.remove(), 2600);
      if (t <= 1) { nSay++; const r = await kmSay(h, `km_${sc.id}_g${pick.i}_0`, pick.o.s, pick.o.keys); if (r.ok) okN++; log.push(`3○${pick.o.label}`); }
      continue; }
    if (st === 3) { // ✅ わけを つけて いう
      await speak(C.pony, "kmp_q4", PQ.q4); nSay++;
      const r = await kmSay(h, `km_${sc.id}_g${pickG.i}_1`, pickG.o.l, pickG.o.keys.concat([["から"]])); if (r.ok) { okN++; playMove(C.pony, "nod"); } log.push(`4${r.ok ? "○" : "×"}${r.heard}`); }
  }
  bar.remove();
  // 🗣 さいご：相手に いう
  if (!winner) { nSay++; const r = await kmGo(sc, h, a, ex, asker); if (r.ok) okN++; log.push(`6${r.ok ? "○" : "×"}${r.heard}`); }
  await speak(C.pony, "kmp_res2", "じぶんで かんがえて、ちゃんと いえたね！");
  const ok = okN * 2 >= nSay; grade(ok && wrong === 0 && okN === nSay); GS.tasks++; if (ok) GS.ok++;
  playLog({ type: "komatta", id: sc.id, tier: t, okN, nSay, wrong, tries: log, ...(MODE === "multi" ? { who: NAMES[heroKind] } : {}) });
  if (window.__kms) { window.__kms.remove(); window.__kms = null; }
  if (ok) { joy(h); confetti(50); joy(C.pony); await seedGet(h); }
  await sleep(500); setView("board"); return ok;
};
// ライバル（がお）の ばん：あわてて よくない やりかたを いう → こどもが おしえる（相手は 来ない）
kmRival = async function () {
  const sc = kmPick(RIVAL, true), asker = kmAsker(sc, RIVAL) || "nobbo";
  showEngine(null, `${NAMES[RIVAL]}の ばん（${sc.id}）`);
  const { h, hb } = await kmIntro(sc, RIVAL, asker);
  await speak(C.pony, "kmp_rival", "がおくんも こまって いるみたい");
  playMove(h, "pump"); markAbove(h, "anger"); await speak(h, `kmg_${sc.id}`, sc.gao);
  surprise(C.shima); markAbove(C.pony, "q"); await sleep(400);
  const gd = sc.good[0]; await speak(C.pony, "kmp_teach", "がおくんに、いい やりかたを おしえて あげよう");
  playMove(h, "think"); await rivalSay(h, "huh");
  const r = await kmSay(C.shima, `km_${sc.id}_g0_1`, gd.l, gd.keys, `${NAMES[RIVAL]}に おしえよう`);
  playLog({ type: "teach", id: "km_" + sc.id, ok: r.ok, tries: [r.heard] }); if (r.ok) GS.ok++;
  hb.remove(); h.sadMouth = false;
  if (r.ok) { joy(C.shima); confetti(50); markAbove(h, "ex"); await rivalSay(h, "thanks"); } else await rivalSay(h, "thanks");
  hint7(h, gd.emo, gd.label); joy(h); await sleep(1000); setView("board");
};
