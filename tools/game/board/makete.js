/* ================= ロングコース「まけても だいじょうぶ」（makete）・「きょうの できごと」（dekigoto）（2026-10-19） =================
   どちらも ちょうロングの しくみ（slong.js）の うえに のせる。48マス・4だん（きょうの できごとは 28マス）。データと 声：sit/makete_gen.py・sit/dekigoto_gen.py
   まけても：💪 まけた 場面 → きりかえの ことば →（段2〜）かった 子に「おめでとう」→（段3〜）つぎ どう する？／✊ ぽにーと じゃんけん（ほんとに まける ことも ある）／🌈 きりかえ カード
   できごと：📖 えを みて ママの しつもんに こたえる（どこで・だれと・なにを・どんな きもち）→（段3〜）ぜんぶ つなげて →（段4〜）それから？／🔢 1にちの じゅんばん／🎤 じぶんの きょう（インタビュー） */
const NEWL = ["makete", "dekigoto"], NEWD = { makete: MK, dekigoto: DG };
const MK_N = new Map(), MK_GOT = [], DG_GOT = [];
{ const ap = applyStage; applyStage = function (id, ...a) { if (NEWL.includes(id)) { MK_N.clear(); MK_GOT.length = 0; DG_GOT.length = 0; } return ap(id, ...a); }; }
const nTxt = k => (NEWD[curStage] && NEWD[curStage].txt[k]) || (MK.txt[k] || DG.txt[k] || "");
/* ---------- マスの ならび ---------- */
{ const PL = {
    makete: [null, "mg", "e:dice2", "e:kf1", "mc", "mg", "mj", "e:warp", "mg", "e:kb1", "mg", "mc", // 2026-10-25 たのしい しかけ（ワープ・くじびき・リレー など）を ふやした
      "e:rand", "mj", "mg", "e:fake", "e:rest", "mg", "mc", "e:trolley", "mg", null, "mj", "mg",
      "e:warp", "mc", "mg", "e:again", "mg", "mj", "e:rand", "e:kb2", "mg", "mc", "e:dice2", "mg",
      "mg", "mj", "e:trolley", "e:kf2", "mg", "mc", "e:fake", "mj", "mg", "e:rand", "mc", null],
    dekigoto: [null, "ds", "dj", "e:kf1", "ds", "dv", "ds", // 28マス（2026-10-25 みじかく。21＝どしん、さいご＝ゴール）
      "ds", "dj", "e:kb1", "ds", "dv", "ds", "e:rest",
      "dj", "ds", "ds", "dv", "e:kf2", "ds", "dj",
      null, "ds", "dv", "e:kb2", "ds", "dj", null] };
  NEWL.forEach(sid => { const O = SL_ORDER[sid], ev = {}, task = {};
    O.forEach((id, i) => { const p = PL[sid][i]; if (!p || id === "0" || id === "4" || id === "15") return;
      if (p.startsWith("e:")) { const t = p.slice(2); ev[id] = [t, 0, `sl_${sid}_${t}`, NEWD[sid].evt[t]]; } else task[id] = p; });
    EVENTS[sid] = ev; LONG_TASKS[sid] = task; });
  LEGENDS.makete = [["mg", "まけた とき"], ["mj", "じゃんけん"], ["mc", "きりかえ カード"]];
  }
SL_VEH.makete = { warp: "🎈" };
Object.assign(LTASK, { mg: ["#FFE0C2", "💪"], mj: ["#FFE27A", "✊"], mc: ["#D7F0D2", "🌈"], ds: ["#FFE9D6", "📖"], dj: ["#C9EBB5", "🔢"], dv: ["#C9E7FF", "🎤"] });
const nArea = id => Math.min(4, Math.floor(SL_ORDER[curStage].indexOf(id) / (SL_ORDER[curStage].length / 4)) + 1);
// すすむ・もどる しかけ
{ const be = boardEvent; boardEvent = async function (pc) {
    const ev = NEWL.includes(curStage) && EVENTS[curStage][pc.node];
    if (!ev || !/^k[fb]/.test(ev[0]) || (pc.player && pc.player.stay)) return be(pc);
    await sleep(300); markAbove(pc, ev[0][1] === "f" ? "heart" : "drop"); chime(); await slSay(ev[2], ev[3]); await slGo(pc, ev[0][1] === "f" ? 2 : -2); await sleep(300); }; }
/* ---------- 盤の え ---------- */
NEWL.forEach(sid => { BOARD_BG[sid] = L => {
  const T = SL_TH[sid], dk = sid === "dekigoto";
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: T.ground }, L);
  const Y = [930, 765, 600, 435], I4 = dk ? ["🏫", "🌳", "🏠", "🚃"] : ["🏠", "🏫", "🌳", "🏮"];
  Y.forEach((y, r) => { el("rect", { x: 30, y: y - 70, width: 1540, height: 140, rx: 70, fill: T.fills[r], ...S6(4) }, L);
    const x = r === 3 ? 1520 : 80; txt(L, x, y + 6, I4[r], 46, { "text-anchor": "middle" }); txt(L, x, y + 44, T.areas[r], T.areas[r].length > 3 ? 17 : 20, { "text-anchor": "middle" }); });
  (dk ? [["📖", 150, 300], ["✏️", 400, 330], ["🗓", 1210, 320], ["💬", 1400, 300]] : [["💪", 150, 300], ["🌈", 400, 330], ["🏅", 1210, 320], ["✊", 1400, 300]]).forEach(([e, x, y]) => txt(L, x, y, e, 54, { "text-anchor": "middle", opacity: .85 }));
  Object.entries(EVENTS[sid] || {}).forEach(([id, [type]]) => { const to = slWarpTo(sid, id, type); if (!to || !NODES[id] || !NODES[to]) return; const [x1, y1] = NODES[id], [x2, y2] = NODES[to];
    el("path", { d: `M${x1} ${y1} Q${(x1 + x2) / 2 + 160} ${(y1 + y2) / 2} ${x2} ${y2}`, fill: "none", stroke: "#8E5BD6", "stroke-width": 6, "stroke-dasharray": "16 14", opacity: .6 }, L); });
  el("rect", { x: 540, y: 212, width: 520, height: 80, rx: 22, fill: dk ? "#3E7FD6" : "#F08A3C", ...S6(5) }, L); txt(L, 800, 266, `${T.icon} ${T.name}`, 38, { "text-anchor": "middle", fill: "#FFFFFF" }); }; });
/* ---------- 声の パック ---------- */
{ const lp = loadPack; loadPack = async function (id) { const r = await lp(id); if (!NEWL.includes(id)) return r;
    if (!PACK.loaded[id]) { try { const q = await fetch(`packs/${id}.json`, { cache: "no-cache" }); if (q.ok) { const d = await q.json(); Object.keys(d).forEach(k => AUD[k] = "data:audio/mpeg;base64," + d[k]); PACK.loaded[id] = Object.keys(d); } } catch (e) { /* なくても あそべる */ } }
    if (AUD["bgm_" + id]) await voiceBuf("bgm_" + id); return true; }; }
const momOf = hero => hero === "shima" ? "mama" : MOM_OF[hero] || "mama";
const mvk = (who, hero) => who === "mama" && momOf(hero) !== "mama" ? "_" + momOf(hero) : "";

/* =============== 💪 まけた 場面 =============== */
function mkPick(area, hero) {
  const busy = new Set([hero, ...PLAYERS.map(p => p.kind)]); let pool = MK.sc.filter(s => s.area === area && !busy.has(s.win)); if (!pool.length) pool = MK.sc.filter(s => !busy.has(s.win));
  const m = Math.min(...pool.map(s => MK_N.get(s.id) || 0)); pool = pool.filter(s => (MK_N.get(s.id) || 0) === m); return pool[rnd(pool.length)]; }
async function mkScene(pc) {
  const hero = pc.kind, sc = mkPick(nArea(pc.node), hero), t = tierOf(), lv = t >= 1 ? 1 : 0; MK_N.set(sc.id, (MK_N.get(sc.id) || 0) + 1);
  const who = sc.win || (sc.com === "mama" ? momOf(hero) : sc.com), vk = sc.win ? "" : mvk(sc.com, hero);
  showEngine(null, `まけた とき（${sc.id}・段${t + 1}）`);
  const { hero: h, ask: a } = setSitView({ id: "mk_" + sc.id, place: sc.place, asker: who, intro: "mk" }, hero); a.dx.v = a.dx.t = 0;
  enter(h); await sleep(900); if (!MK_N.get("_intro")) { MK_N.set("_intro", 1); await speak(C.pony, "mkp_intro", nTxt("mkp_intro")); }
  const tw = sc.id === "tsumiki" ? mkTower(h) : null; const hb = hint7(h, sc.emo, sc.win ? "まけちゃった" : "うまく いかなかった"); if (tw) later(1400, tw.fall); await speak(C.pony, `mk_${sc.id}_n`, nTxt(`mk_${sc.id}_n`));
  playMove(h, "frustrated"); if (sc.win) { joy(a); later(400, () => joy(a)); } else playMove(a, "nod");
  await speak(a, `mkw_${sc.id}${vk}`, sc.line); hb.remove();
  let okN = 0, nSay = 0; const log = [];
  const step = async (key, text, keys, tag, mark) => { nSay++; const r = await kmSay(h, key, text, keys, tag); if (r.ok) { okN++; playMove(a, "nod"); } log.push(`${mark}${r.ok ? "○" : "×"}${r.heard}`); return r.ok; };
  await speak(C.pony, sc.win ? "mkp_feel" : "mkp_oops", nTxt(sc.win ? "mkp_feel" : "mkp_oops"));
  if (await step(`mk_${sc.id}_c${lv}`, sc.cope[lv], sc.cope[2], "きりかえの ことば", "🌈")) { MK_GOT.push(sc.cope[0]); h.sadMouth = false; joy(h); }
  if (sc.win && t >= 1) { await speak(C.pony, "mkp_cong", nTxt("mkp_cong"));
    if (await step(`mk_${sc.id}_o`, sc.cong, [["おめでとう"]], "かった 子に", "🎉")) { joy(a); markAbove(a, "heart"); await speak(a, `mkr_${sc.win}`, "ありがとう！ また やろうね"); } }
  if (t >= 2) { await speak(C.pony, "mkp_next", nTxt("mkp_next")); await step(`mk_${sc.id}_x`, sc.next[0], sc.next[1], "つぎ どう する？", "➡"); }
  const ok = okN * 2 >= nSay; grade(ok); GS.tasks++;
  playLog({ type: "makete", id: sc.id, tier: t, okN, nSay, tries: log, ...(MODE === "multi" ? { who: NAMES[hero] } : {}) });
  if (ok) { confetti(40); joy(h); const k = rnd(2) ? "mkp_ok" : "mkp_good"; await speak(C.pony, k, nTxt(k)); }
  await sleep(400); setView("board"); return ok; }

// 🧱 つみき：たかく つんで → ぐらぐら → くずれる（2026-10-25）
function mkTower(h) { const g = el("g", {}, propG), cx = h.x + 200 * h.s + 330, base = h.y + h.base * h.s, cols = ["#FF8FA3", "#FFD25E", "#7FCBF0", "#7BD389", "#B9A8D9", "#FFB36B", "#FF8FA3"];
  const bs = cols.map((c, i) => { const b = el("rect", { x: -45, y: -50, width: 90, height: 50, rx: 6, fill: c, ...S6(4) }, g); b.st = { x: cx + (i % 2 ? 6 : -6), y: base - i * 50, r: 0 }; return b; });
  let mode = "build", t = 0; const put = b => b.setAttribute("transform", `translate(${b.st.x.toFixed(1)} ${b.st.y.toFixed(1)}) rotate(${b.st.r.toFixed(1)})`);
  bs.forEach((b, i) => { b.setAttribute("opacity", 0); later(i * 120, () => { b.setAttribute("opacity", 1); blip(500 + i * 60, 600, .04, "square"); }); });
  addTick(dt => { if (!g.isConnected) return false; t += dt;
    if (mode === "wobble") bs.forEach((b, i) => { b.st.r = Math.sin(t * 9) * i * 1.6; b.st.x = cx + Math.sin(t * 9) * i * 4; });
    if (mode === "fall") bs.forEach((b, i) => { b.v = b.v || { x: (rnd(2) ? 1 : -1) * (80 + rnd(220)), y: -100 - rnd(150), r: (rnd(2) ? 1 : -1) * (200 + rnd(300)) }; if (b.st.y < base - 1) { b.v.y += 1400 * dt; b.st.x += b.v.x * dt; b.st.y = Math.min(base, b.st.y + b.v.y * dt); b.st.r += b.v.r * dt; } else { b.st.y = base; b.v.x *= .8; b.v.r *= .7; b.st.x += b.v.x * dt; } });
    bs.forEach(put); });
  return { g, fall: () => { mode = "wobble"; t = 0; later(900, () => { mode = "fall"; bs.forEach((b, i) => { b.st.y -= 1; }); noise(.5, 300, .5); later(250, () => noise(.3, 200, .4)); }); } }; }
/* =============== ✊ ぽにーと じゃんけん =============== */
const JK = [["✊", "グー", ["ぐー", "グー"]], ["✌", "チョキ", ["ちょき", "チョキ"]], ["✋", "パー", ["ぱー", "パー"]]];
async function mkJanken(pc) { // 2026-10-25 つくりなおし：3かい しょうぶ・てを ふる アニメ・ぽにーの せりふを しぜんに
  const g = panel("ぽにーと じゃんけん", "#FFF6DC"), name = NAMES[pc.kind] || "きみ";
  const me = clone(pc.kind, 330, 900, (KID_S[pc.kind] || .8) * .62), po = clone("pony", 1270, 900, .5); hudLayer.appendChild(me.root); hudLayer.appendChild(po.root);
  const hm = txt(g, 560, 420, "✊", 150, { "text-anchor": "middle" }), hp = txt(g, 1040, 420, "✊", 150, { "text-anchor": "middle", transform: "scale(-1 1) translate(-2080 0)" });
  txt(g, 800, 400, "VS", 70, { "text-anchor": "middle" }); const sc = txt(g, 800, 250, "", 64, { "text-anchor": "middle" });
  let w = 0, l = 0; const show = () => { sc.textContent = `${name} ${w} − ${l} ぽにー`; }; show();
  await speak(C.pony, "mkp_jk3_intro", nTxt("mkp_jk3_intro"));
  while (w < 2 && l < 2) { let first = true, res = 0;
    while (!res) { hm.textContent = hp.textContent = "✊"; if (first) await speak(C.pony, "mkp_jk3_pick", nTxt("mkp_jk3_pick"));
      const cs = JK.map((j, i) => { const c = card(g, 330 + i * 330, 580, 280, 200, j[1], j[0], { es: 90, fs: 40 }); c.i = i; return c; });
      const pick = await new Promise(r => { let live = true; cs.forEach(c => c.onclick = () => { if (live) { live = false; r(c.i); } });
        (async () => { while (live) { setListen(pc, true); const q = await listen([JK.flatMap(j => j[2])], 8000); setListen(pc, false); if (!live) return;
          if (q.r === "ok") { const i = JK.findIndex(j => j[2].some(x => (q.heard || "").includes(x))); live = false; r(i >= 0 ? i : rnd(3)); return; } } })(); });
      cs.forEach(c => c.remove());
      // てを ふりながら「じゃん、けん、ぽん！」
      const sp = speak(C.pony, first ? "mkp_jk3_jan" : "mkp_jk3_aiko", nTxt(first ? "mkp_jk3_jan" : "mkp_jk3_aiko")); let t = 0;
      addTick(dt => { if (t > 1.1 || !g.isConnected) { hm.removeAttribute("dy"); return false; } t += dt; const y = Math.abs(Math.sin(t * 8)) * -40; hm.setAttribute("y", 420 + y); hp.setAttribute("y", 420 + y); });
      await sleep(1150); const want = (w + l >= 1 && rnd(4) === 0) ? 0 : [1, -1, 0][rnd(3)], pi = want === 0 ? pick : want === 1 ? (pick + 1) % 3 : (pick + 2) % 3;
      hm.textContent = JK[pick][0]; hp.textContent = JK[pi][0]; hm.setAttribute("y", 420); hp.setAttribute("y", 420); blip(600, 900, .1, "square"); await sp; await sleep(500);
      res = want; first = false; if (!res) { noise(.08, 500, .2); playMove(me, "think"); playMove(po, "think"); } }
    if (res > 0) { w++; show(); joy(me); playMove(po, "frustrated"); markAbove(me, "sparkle"); await speak(C.pony, "mkp_jk3_rw", nTxt("mkp_jk3_rw")); }
    else { l++; show(); joy(po); playMove(me, "frustrated"); await speak(C.pony, "mkp_jk3_rl", nTxt("mkp_jk3_rl")); }
    await sleep(400); }
  let ok;
  if (w < l) { joy(po); await speak(C.pony, "mkp_jk3_lose", nTxt("mkp_jk3_lose")); await speak(C.pony, "mkp_jk3_say", nTxt("mkp_jk3_say"));
    const r = await kmSay(pc, "mkp_jk_lose_t", nTxt("mkp_jk_lose_t"), [["くやしい", "悔しい", "もう いっかい", "もういっかい", "もう一回", "やろう"]], "まけても かっこよく"); ok = r.ok;
    if (ok) { confetti(40); joy(po); await speak(C.pony, "mkp_jk_good", nTxt("mkp_jk_good")); MK_GOT.push("くやしい！ もう いっかい やろう"); } }
  else { confetti(30); playMove(po, "frustrated"); await speak(C.pony, "mkp_jk3_win", nTxt("mkp_jk3_win")); await speak(C.pony, "mkp_jk3_say", nTxt("mkp_jk3_say"));
    const r = await kmSay(pc, "mkp_jk_win_t", nTxt("mkp_jk_win_t"), [["しょうぶ", "勝負", "また", "やろう", "たのしかった", "楽しかった"]], "ぽにーに ひとこと"); ok = r.ok;
    if (ok) { joy(po); await speak(C.pony, "mkp_jk_thanks", nTxt("mkp_jk_thanks")); } }
  grade(ok); playLog({ type: "mkjanken", res: w > l ? "かち" : "まけ", ok, ...(MODE === "multi" ? { who: NAMES[pc.kind] } : {}) });
  await sleep(400); clearClones(); g.remove(); return ok; }

/* =============== 🌈 きりかえ カード =============== */
const MK_CN = new Map();
async function mkCard(pc) {
  let pool = MK.cards; const m = Math.min(...pool.map(x => MK_CN.get(x.id) || 0)); pool = pool.filter(x => (MK_CN.get(x.id) || 0) === m); const it = pool[rnd(pool.length)]; MK_CN.set(it.id, m + 1);
  const g = panel("きりかえ カード", "#EFFAEA"); el("rect", { x: 170, y: 140, width: 1260, height: 200, rx: 30, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 260, it.q, it.q.length > 18 ? 44 : 52, { "text-anchor": "middle" });
  await speak(C.pony, `mkc_${it.id}_q`, it.q); await speak(C.pony, "mkp_cardq", nTxt("mkp_cardq"));
  const opts = shuffle([[...it.good, -1], ...it.bad.map((b, i) => [...b, i])]);
  const cs = opts.map((o, j) => { const c = card(g, 130 + j * 460, 420, 420, 300, o[1], o[0], { es: 100, fs: 40 }); c.bi = o[2]; return c; });
  let wrong = 0;
  await new Promise(res => { let busy = false; cs.forEach(c => c.onclick = async () => { if (busy || c.dim) return; if (c.bi < 0) { cs.forEach(x => x.onclick = null); c.rect.setAttribute("fill", "#FFE27A"); chime(); res(); return; }
      busy = true; wrong++; c.dim = 1; c.setAttribute("opacity", .35); noise(.1, 700, .35); await speak(C.pony, `mkc_${it.id}_b${c.bi}`, nTxt(`mkc_${it.id}_b${c.bi}`)); busy = false; }); });
  await speak(C.pony, "mkp_card_ok", nTxt("mkp_card_ok")); const r = await kmSay(pc, `mkc_${it.id}_a`, it.good[1], it.keys, "いって みよう");
  if (r.ok) { MK_GOT.push(it.good[1]); confetti(30); }
  const ok = r.ok && !wrong; grade(ok); playLog({ type: "mkcard", id: it.id, wrong, ok: r.ok, ...(MODE === "multi" ? { who: NAMES[pc.kind] } : {}) });
  await sleep(400); g.remove(); return r.ok; }

/* =============== 📖 きょうの できごと（ママに おはなし） =============== */
const DG_N = new Map();
async function dgStory(pc) {
  const hero = pc.kind, area = nArea(pc.node), t = tierOf();
  let pool = DG.st.filter(s => s.area === area); const m = Math.min(...pool.map(s => DG_N.get(s.id) || 0)); pool = pool.filter(s => (DG_N.get(s.id) || 0) === m); const sc = pool[rnd(pool.length)]; DG_N.set(sc.id, m + 1);
  const mom = momOf(hero); showEngine(null, `できごと（${sc.id}・段${t + 1}）`);
  const { hero: h, ask: a } = setSitView({ id: "dg_" + sc.id, place: "リビング", asker: mom, intro: "dg" }, hero); a.dx.v = a.dx.t = 0;
  enter(h); await sleep(900); if (!DG_N.get("_intro")) { DG_N.set("_intro", 1); await speak(C.pony, "dgp_intro", nTxt("dgp_intro")); }
  // おもいでの え（4まい）。段1は ことばも でる
  const g = el("g", {}, hudLayer), W = 330, x0 = 800 - 4 * (W + 20) / 2 + 10; el("rect", { x: x0 - 26, y: 322, width: 4 * (W + 20) + 32, height: 186, rx: 30, fill: "#FFFFFFE8", ...S6(5) }, g);
  const cs = sc.s.map((s, i) => { const c = card(g, x0 + i * (W + 20), 338, W, 154, t === 0 ? s[1] : null, s[0], { es: t === 0 ? 70 : 100, fs: 36 }); c.style.cursor = ""; return c; });
  // ききかたと じゅんばんを かえる（2026-10-25：いつも おなじ だった）
  const qv = q => { const v = rnd(3); return v ? [`dgq_${q}${v}_${mom}`, DG.qv[q][v - 1]] : [`dgq_${q}_${mom}`, DG.q[q]]; };
  { const [k, t0] = qv("start"); await speak(a, k, t0); } await speak(C.pony, "dgp_look", nTxt("dgp_look"));
  let okN = 0, nSay = 0; const log = [], QK = ["doko", "dare", "nani", "kimo"], ORD = [[0, 1, 2, 3], [2, 0, 1, 3], [1, 2, 0, 3], [2, 1, 0, 3]][rnd(4)];
  const step = async (key, text, keys, tag, mk) => { nSay++; const r = await kmSay(h, key, text, keys, tag); if (r.ok) { okN++; playMove(a, "nod"); } log.push(`${mk}${r.ok ? "○" : "×"}${r.heard}`); return r.ok; };
  for (let o = 0; o < 4; o++) { const i = ORD[o]; cs.forEach((c, j) => c.rect.setAttribute("fill", j === i ? "#FFE27A" : ORD.indexOf(j) < o ? "#E2F5D8" : "#FFF8E8"));
    { const [k, t0] = qv(QK[i]); await speak(a, k, t0); } await step(`dg_${sc.id}_${i}`, sc.s[i][1], sc.s[i][2], ["どこで？", "だれと？", "なにを した？", "どんな きもち？"][i], ["📍", "👫", "🎬", "💗"][i]); }
  cs.forEach(c => c.rect.setAttribute("fill", "#E2F5D8"));
  if (t >= 2) { await speak(a, `dgq_all_${mom}`, DG.q.all); await speak(C.pony, "dgp_all", nTxt("dgp_all")); await step(`dg_${sc.id}_a`, sc.all, sc.allK.map(x => x), "はじめから ぜんぶ", "📖"); }
  if (t >= 3) { await speak(a, `dgq_sore_${mom}`, DG.q.sore); const c5 = card(g, 1240, 520, 260, 130, null, sc.sore[0], { es: 84 }); await step(`dg_${sc.id}_s`, sc.sore[1], sc.sore[2], "それから？", "➡"); c5.remove(); }
  joy(a); await speak(a, `dgq_res_${mom}`, DG.q.res); g.remove();
  const ok = okN * 2 >= nSay; grade(ok); GS.tasks++; if (ok) DG_GOT.push(sc.id);
  playLog({ type: "dekigoto", id: sc.id, tier: t, okN, nSay, tries: log, ...(MODE === "multi" ? { who: NAMES[hero] } : {}) });
  if (ok) { confetti(40); joy(h); await speak(C.pony, "dgp_ok", nTxt("dgp_ok")); }
  await sleep(400); setView("board"); return ok; }

/* =============== 🔢 1にちの じゅんばん =============== */
const DG_JN = new Map();
async function dgDay(pc) {
  let pool = DG.day; const m = Math.min(...pool.map(x => DG_JN.get(x.id) || 0)); pool = pool.filter(x => (DG_JN.get(x.id) || 0) === m); const it = pool[rnd(pool.length)]; DG_JN.set(it.id, m + 1);
  const t = tierOf(), n = Math.min(4, 2 + t), seq = it.s.slice(0, n), g = panel(`${it.t}の じゅんばん`, "#EAF7E6"), jj = rnd(3), JWv = (DG.jws || [DG.jw])[jj] || DG.jw, js = jj ? `_j${jj}` : "";
  await speak(C.pony, "dgj_intro", nTxt("dgj_intro")); await speak(C.pony, `dgj_${it.id}_q`, nTxt(`dgj_${it.id}_q`));
  const W = 320, x0 = 800 - n * (W + 30) / 2 + 15, order = shuffle(seq.map((_, i) => i));
  const slots = seq.map((_, i) => { const x = x0 + i * (W + 30); el("rect", { x, y: 160, width: W, height: 200, rx: 24, fill: "#FFFFFF", stroke: "#B9A8D9", "stroke-width": 5, "stroke-dasharray": "14 10" }, g); txt(g, x + W / 2, 400, JWv[i === n - 1 ? 3 : i], 40, { "text-anchor": "middle" }); return x; });
  const cs = order.map((k, j) => { const c = card(g, x0 + j * (W + 30), 560, W, 220, seq[k][1], seq[k][0], { es: 90, fs: 36 }); c.k = k; return c; });
  let next = 0, wrong = 0;
  // まちがえた こえの とちゅうでも、つぎの タッチは ちゃんと みる（あって いるのに ばつに ならない ように 2026-10-25）
  await new Promise(res => { let talking = false; cs.forEach(c => c.onclick = () => { if (c.done || next >= n) return;
      if (c.k === next) { c.done = 1; const dx = slots[next] - x0 - cs.indexOf(c) * (W + 30); tween(300, q => c.setAttribute("transform", `translate(${(dx * q).toFixed(0)} ${(-400 * q).toFixed(0)})`)); chime(); next++; if (next === n) res(); return; }
      wrong++; noise(.1, 700, .35); flashCard(c, false); later(450, () => { if (!c.done) c.rect.setAttribute("fill", "#FFF8E8"); }); if (!talking) { talking = true; speak(C.pony, "dgj_ng", nTxt("dgj_ng")).then(() => talking = false); } }); });
  await sleep(400); await speak(C.pony, `dgj_say${js}`, nTxt(`dgj_say${js}`));
  const line = nTxt(`dgj_${it.id}_${n}${js}`); showTask(line, "じゅんばんに いおう", 260); await speak(C.pony, `dgj_${it.id}_${n}${js}`, line); unsay();
  let ok = false; for (let k = 0; k < 2 && !ok; k++) { setListen(pc, true); const r = await listen(seq.map(s => s[2][0]), 9000); setListen(pc, false); ok = r.r === "ok"; if (!ok && k === 0) await speak(C.pony, "p_again", "もう いっかい いってみよう"); }
  hideTask(); if (ok) { confetti(40); joy(C.pony); await speak(C.pony, "dgj_ok", nTxt("dgj_ok")); }
  grade(ok && !wrong); playLog({ type: "dgday", id: it.id, n, wrong, ok, ...(MODE === "multi" ? { who: NAMES[pc.kind] } : {}) });
  await sleep(400); g.remove(); return ok; }

/* =============== 🎤 つづけて おはなし（インタビューの かわり、2026-10-20） ===============
   ぽにーが つづけて きく → まるシマ（あそんで いる キャラ）に なって、カードと お手本の こえで こたえる。じぶんの ほんとうの ことは きかない。 */
const CH_N = new Map();
async function chainRun(pc, list, pre, title, color) {
  let pool = list; const m = Math.min(...pool.map(x => CH_N.get(pre + x.id) || 0)); pool = pool.filter(x => (CH_N.get(pre + x.id) || 0) === m); const it = pool[rnd(pool.length)]; CH_N.set(pre + it.id, m + 1);
  const t = tierOf(), lv = t >= 2 ? 1 : 0, g = panel(title, color), T = k => nTxt(k) || (KC.txt[k] || DG.txt[k] || "");
  const me = clone(pc.kind, 430, 930, (KID_S[pc.kind] || .8) * .74); hudLayer.appendChild(me.root);
  const po = clone("pony", 1260, 930, .6); hudLayer.appendChild(po.root);
  el("rect", { x: 700, y: 400, width: 820, height: 110, rx: 30, fill: "#FFFFFF", ...S6(5) }, g); el("path", { d: "M1240 510 L1270 560 L1300 510", fill: "#FFFFFF", ...S6(5) }, g); const qt = txt(g, 1110, 472, "", 44, { "text-anchor": "middle" });
  await speak(C.pony, `${pre}_intro`, T(`${pre}_intro`));
  let okN = 0; const tries = [];
  for (let i = 0; i < it.q.length; i++) { const [q, emo, short, long, keys] = it.q[i], ans = lv ? long : short;
    qt.textContent = q; qt.setAttribute("font-size", q.length > 16 ? 36 : 44); playMove(po, "point"); await speak(C.pony, `${pre}_${it.id}_q${i}`, q);
    const cd = card(g, 560, 560, 400, 190, short, emo, { es: 96, fs: 42 }); cd.style.cursor = "";
    showTask(ans, `${NAMES[pc.kind] || "まるシマ"}に なって`, 260); await speak(C.pony, `${pre}_${it.id}_${i}_${lv}`, ans); unsay();
    let ok = false; for (let n = 0; n < 2 && !ok; n++) { setListen(pc, true); const r = await listen(keys, 8000); setListen(pc, false); tries.push(`${i}${r.r === "ok" ? "○" : "×"}${r.heard || ""}`); ok = r.r === "ok";
      if (!ok && n === 0) await speak(C.pony, "p_again", "もう いっかい いってみよう"); }
    hideTask(); if (ok) { okN++; chime(); playMove(po, "nod"); playMove(me, "nod"); cd.rect.setAttribute("fill", "#E2F5D8"); const k = `${pre}_a${rnd(3)}`; await speak(C.pony, k, T(k)); }
    else { await speak(C.pony, "p_together", "いっしょに いおうね"); await speak(C.pony, `${pre}_${it.id}_${i}_${lv}`, ans); }
    await sleep(300); cd.remove(); }
  const ok = okN >= it.q.length - 1; if (ok) { confetti(40); joy(me); } await speak(C.pony, `${pre}_end`, T(`${pre}_end`));
  playLog({ type: "chain", id: pre + ":" + it.id, okN, of: it.q.length, tries, ...(MODE === "multi" ? { who: NAMES[pc.kind] } : {}) });
  grade(ok); clearClones(); g.remove(); return ok; }
const dgInterview = pc => chainRun(pc, DG.chain, "dc", "きのうの こと", "#EAF6FF");
LTASK_RUN.kv = pc => chainRun(pc, KC.chain, "kc", "つづけて おはなし", "#FFF4F7");
LEGENDS.kimochi = [["ks", "きもち"], ["kp", "ぴったり"], ["kv", "つづけて おはなし"]];
LEGENDS.dekigoto = [["ds", "できごと"], ["dj", "じゅんばん"], ["dv", "きのうの こと"]];
Object.assign(LTASK_RUN, { mg: mkScene, mj: mkJanken, mc: mkCard, ds: dgStory, dj: dgDay, dv: dgInterview });

/* ---------- ゴール：いえた ことば・おはなし できた できごと ---------- */
{ const em = endingMulti; endingMulti = async function () {
    try {
      if (curStage === "makete" && MK_GOT.length) { const ws = [...new Set(MK_GOT)].slice(0, 8), g = panel("きりかえの ことば", "#FFF6DC");
        ws.forEach((w, i) => { const y = 200 + i * 82, c = el("g", {}, g); el("rect", { x: 260, y: y - 52, width: 1080, height: 70, rx: 35, fill: "#FFFFFF", ...S6(5) }, c); txt(c, 320, y - 4, "🌈", 44, { "text-anchor": "middle" }); txt(c, 820, y - 2, w, 40, { "text-anchor": "middle" });
          c.setAttribute("opacity", 0); later(300 + i * 220, () => { c.setAttribute("opacity", 1); blip(700 + i * 40, 1000, .08, "square"); }); });
        await speak(C.pony, "mkp_goal", nTxt("mkp_goal")); await sleep(1500 + ws.length * 220); g.remove(); }
      if (curStage === "dekigoto" && DG_GOT.length) { const ids = [...new Set(DG_GOT)].slice(0, 8), g = panel("おはなし できた できごと", "#EAF6FF");
        ids.forEach((id, i) => { const sc = DG.st.find(s => s.id === id), x = 260 + (i % 4) * 360, y = 220 + Math.floor(i / 4) * 300, c = el("g", {}, g);
          el("rect", { x: x - 160, y, width: 320, height: 240, rx: 26, fill: "#FFFFFF", ...S6(5) }, c); txt(c, x, y + 110, sc.s.map(s => s[0]).join(""), 54, { "text-anchor": "middle" }); txt(c, x, y + 190, sc.s[2][1], sc.s[2][1].length > 9 ? 26 : 32, { "text-anchor": "middle" });
          c.setAttribute("opacity", 0); later(300 + i * 220, () => { c.setAttribute("opacity", 1); blip(700 + i * 40, 1000, .08, "square"); }); });
        await speak(C.pony, "dgp_goal", nTxt("dgp_goal")); await sleep(1500 + ids.length * 220); g.remove(); }
    } catch (e) { }
    return em(); }; }
/* ---------- おとなの きろく ---------- */
{ const lt = logText; logText = function () {
    const o = lt(); let a = []; try { a = JSON.parse(localStorage.getItem(LOG_KEY) || "[]"); } catch (e) { }
    const fmt = x => x.type === "makete" ? `まけても ${x.id} ${x.okN}/${x.nSay} ${(x.tries || []).join(" / ")}` : x.type === "mkjanken" ? `じゃんけん（${x.res}） ${x.ok ? "○" : "△"}`
      : x.type === "mkcard" ? `きりかえカード ${x.id} ${x.wrong ? "まちがい" + x.wrong : ""}${x.ok ? "○" : "△"}` : x.type === "dekigoto" ? `できごと ${x.id} ${x.okN}/${x.nSay} ${(x.tries || []).join(" / ")}`
      : x.type === "dgday" ? `じゅんばん ${x.id}（${x.n}まい） ${x.ok ? "○" : "△"}` : x.type === "chain" ? `つづけて おはなし ${x.id} ${x.okN}/${x.of} ${(x.tries || []).join(" / ")}` : null;
    const d = tt => { const x = new Date(tt); return `${x.getMonth() + 1}/${x.getDate()} ${String(x.getHours()).padStart(2, "0")}:${String(x.getMinutes()).padStart(2, "0")}`; };
    const lines = o.text.split("\n");
    a.forEach(x => { const f = fmt(x); if (!f) return; const raw = `${d(x.t)} ${JSON.stringify(x)}`; const k = lines.indexOf(raw); if (k >= 0) lines[k] = `${d(x.t)} ${f}${x.who ? `（${x.who}）` : ""}`; });
    return { sum: o.sum, text: lines.join("\n") }; }; }
