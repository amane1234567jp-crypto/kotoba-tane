/* ================= ロングコース「まけても だいじょうぶ」（makete）・「きょうの できごと」（dekigoto）（2026-10-19） =================
   どちらも ちょうロングの しくみ（slong.js）の うえに のせる。48マス・4だん。データと 声：sit/makete_gen.py・sit/dekigoto_gen.py
   まけても：💪 まけた 場面 → きりかえの ことば →（段2〜）かった 子に「おめでとう」→（段3〜）つぎ どう する？／✊ ぽにーと じゃんけん（ほんとに まける ことも ある）／🌈 きりかえ カード
   できごと：📖 えを みて ママの しつもんに こたえる（どこで・だれと・なにを・どんな きもち）→（段3〜）ぜんぶ つなげて →（段4〜）それから？／🔢 1にちの じゅんばん／🎤 じぶんの きょう（インタビュー） */
const NEWL = ["makete", "dekigoto"], NEWD = { makete: MK, dekigoto: DG };
const MK_N = new Map(), MK_GOT = [], DG_GOT = [];
{ const ap = applyStage; applyStage = function (id, ...a) { if (NEWL.includes(id)) { MK_N.clear(); MK_GOT.length = 0; DG_GOT.length = 0; } return ap(id, ...a); }; }
const nTxt = k => (NEWD[curStage] && NEWD[curStage].txt[k]) || (MK.txt[k] || DG.txt[k] || "");
/* ---------- マスの ならび ---------- */
{ const PL = {
    makete: [null, "mg", "mg", "e:kf1", "mc", "mg", "mj", "mg", "mg", "e:kb1", "mg", "mc",
      "mg", "mj", "mg", "mg", "e:rest", "mg", "mc", "mg", "mg", null, "mj", "mg",
      "mg", "mc", "mg", "e:again", "mg", "mj", "mg", "e:kb2", "mg", "mc", "mg", "mg",
      "mg", "mj", "mg", "e:kf2", "mg", "mc", "mg", "mj", "mg", "mg", "mc", null],
    dekigoto: [null, "ds", "ds", "e:kf1", "dj", "ds", "dv", "ds", "ds", "e:kb1", "ds", "dj",
      "ds", "ds", "dv", "ds", "e:rest", "dj", "ds", "ds", "ds", null, "dj", "ds",
      "ds", "dv", "ds", "e:again", "ds", "dj", "ds", "e:kb2", "ds", "ds", "dv", "ds",
      "ds", "dj", "ds", "e:kf2", "ds", "ds", "dv", "ds", "dj", "ds", "ds", null] };
  NEWL.forEach(sid => { const O = SL_ORDER[sid], ev = {}, task = {};
    O.forEach((id, i) => { const p = PL[sid][i]; if (!p || id === "0" || id === "4" || id === "15") return;
      if (p.startsWith("e:")) { const t = p.slice(2); ev[id] = [t, 0, `sl_${sid}_${t}`, NEWD[sid].evt[t]]; } else task[id] = p; });
    EVENTS[sid] = ev; LONG_TASKS[sid] = task; });
  LEGENDS.makete = [["mg", "まけた とき"], ["mj", "じゃんけん"], ["mc", "きりかえ カード"]];
  }
Object.assign(LTASK, { mg: ["#FFE0C2", "💪"], mj: ["#FFE27A", "✊"], mc: ["#D7F0D2", "🌈"], ds: ["#FFE9D6", "📖"], dj: ["#C9EBB5", "🔢"], dv: ["#C9E7FF", "🎤"] });
const nArea = id => Math.min(4, Math.floor(SL_ORDER[curStage].indexOf(id) / 12) + 1);
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
  el("rect", { x: 540, y: 212, width: 520, height: 80, rx: 22, fill: dk ? "#3E7FD6" : "#F08A3C", ...S6(5) }, L); txt(L, 800, 266, `${T.icon} ${T.name}`, 38, { "text-anchor": "middle", fill: "#FFFFFF" }); }; });
/* ---------- 声の パック ---------- */
{ const lp = loadPack; loadPack = async function (id) { const r = await lp(id); if (!NEWL.includes(id)) return r;
    if (!PACK.loaded[id]) { try { const q = await fetch(`packs/${id}.json`, { cache: "no-cache" }); if (q.ok) { const d = await q.json(); Object.keys(d).forEach(k => AUD[k] = "data:audio/mpeg;base64," + d[k]); PACK.loaded[id] = Object.keys(d); } } catch (e) { /* なくても あそべる */ } }
    if (AUD["bgm_" + id]) await voiceBuf("bgm_" + id); return true; }; }
const momOf = hero => hero === "shima" ? "mama" : MOM_OF[hero] || "mama";
const mvk = (who, hero) => who === "mama" && momOf(hero) !== "mama" ? "_" + momOf(hero) : "";

/* =============== 💪 まけた 場面 =============== */
function mkPick(area, hero) {
  let pool = MK.sc.filter(s => s.area === area && s.win !== hero); if (!pool.length) pool = MK.sc.filter(s => s.win !== hero);
  const m = Math.min(...pool.map(s => MK_N.get(s.id) || 0)); pool = pool.filter(s => (MK_N.get(s.id) || 0) === m); return pool[rnd(pool.length)]; }
async function mkScene(pc) {
  const hero = pc.kind, sc = mkPick(nArea(pc.node), hero), t = tierOf(), lv = t >= 1 ? 1 : 0; MK_N.set(sc.id, (MK_N.get(sc.id) || 0) + 1);
  const who = sc.win || (sc.com === "mama" ? momOf(hero) : sc.com), vk = sc.win ? "" : mvk(sc.com, hero);
  showEngine(null, `まけた とき（${sc.id}・段${t + 1}）`);
  const { hero: h, ask: a } = setSitView({ id: "mk_" + sc.id, place: sc.place, asker: who, intro: "mk" }, hero); a.dx.v = a.dx.t = 0;
  enter(h); await sleep(900); if (!MK_N.get("_intro")) { MK_N.set("_intro", 1); await speak(C.pony, "mkp_intro", nTxt("mkp_intro")); }
  const hb = hint7(h, sc.emo, sc.win ? "まけちゃった" : "うまく いかなかった"); await speak(C.pony, `mk_${sc.id}_n`, nTxt(`mk_${sc.id}_n`));
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

/* =============== ✊ ぽにーと じゃんけん =============== */
const JK = [["✊", "グー", ["ぐー", "グー"]], ["✌", "チョキ", ["ちょき", "チョキ"]], ["✋", "パー", ["ぱー", "パー"]]];
async function mkJanken(pc) {
  const t = tierOf(), g = panel("ぽにーと じゃんけん", "#FFF6DC"); await speak(C.pony, "mkp_jk_intro", nTxt("mkp_jk_intro"));
  const ph = txt(g, 1180, 360, "❔", 170, { "text-anchor": "middle" }); txt(g, 1180, 470, "ぽにー", 40, { "text-anchor": "middle" });
  const me = txt(g, 420, 360, "❔", 170, { "text-anchor": "middle" }); txt(g, 420, 470, NAMES[pc.kind] || "きみ", 40, { "text-anchor": "middle" }); txt(g, 800, 350, "VS", 80, { "text-anchor": "middle" });
  let res = 0, round = 0; // 1＝かち、-1＝まけ
  while (!res) { round++;
    const cs = JK.map((j, i) => { const c = card(g, 300 + i * 340, 600, 300, 220, j[1], j[0], { es: 100, fs: 44 }); c.i = i; return c; });
    const pick = await new Promise(r => { let live = true; cs.forEach(c => c.onclick = () => { if (live) { live = false; r(c.i); } });
      (async () => { while (live) { setListen(pc, true); const q = await listen([JK.flatMap(j => j[2])], 8000); setListen(pc, false); if (!live) return;
        if (q.r === "ok") { const i = JK.findIndex(j => j[2].some(w => (q.heard || "").includes(w))); live = false; r(i >= 0 ? i : rnd(3)); return; } } })(); });
    cs.forEach(c => c.remove()); await speak(C.pony, round === 1 ? "mkp_jk_pon" : "mkp_jk_aiko", nTxt(round === 1 ? "mkp_jk_pon" : "mkp_jk_aiko"));
    const want = round >= 3 ? (rnd(2) ? 1 : -1) : [1, -1, 0][rnd(3)]; const pi = want === 0 ? pick : want === 1 ? (pick + 1) % 3 : (pick + 2) % 3; // かち・まけ・あいこ
    me.textContent = JK[pick][0]; ph.textContent = JK[pi][0]; blip(600, 900, .1, "square"); await sleep(700); res = want; if (!res) { noise(.08, 500, .2); await sleep(500); } }
  let ok;
  if (res < 0) { ph.setAttribute("font-size", 200); markAbove(C.pony, "sparkle"); await speak(C.pony, "mkp_jk_lose", nTxt("mkp_jk_lose"));
    const r = await kmSay(pc, "mkp_jk_lose_t", nTxt("mkp_jk_lose_t"), [["たのしかった", "楽しかった", "もう いっかい", "もういっかい", "もう一回", "だいじょうぶ", "大丈夫", "くやしいけど", "悔しいけど"]], "まけても かっこよく"); ok = r.ok;
    if (ok) { confetti(40); await speak(C.pony, "mkp_jk_good", nTxt("mkp_jk_good")); MK_GOT.push("まけちゃったけど、たのしかった"); } }
  else { me.setAttribute("font-size", 200); confetti(30); playMove(C.pony, "sad"); await speak(C.pony, "mkp_jk_win", nTxt("mkp_jk_win"));
    const r = await kmSay(pc, "mkp_jk_win_t", nTxt("mkp_jk_win_t"), [["だいじょうぶ", "大丈夫", "たのしかった", "楽しかった", "また", "もう いっかい", "もういっかい"]], "ぽにーに やさしく"); ok = r.ok;
    if (ok) { joy(C.pony); await speak(C.pony, "mkp_jk_thanks", nTxt("mkp_jk_thanks")); } }
  grade(ok); playLog({ type: "mkjanken", res: res > 0 ? "かち" : "まけ", ok, ...(MODE === "multi" ? { who: NAMES[pc.kind] } : {}) });
  await sleep(400); g.remove(); return ok; }

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
  await speak(a, `dgq_start_${mom}`, DG.q.start); await speak(C.pony, "dgp_look", nTxt("dgp_look"));
  let okN = 0, nSay = 0; const log = [], QK = ["doko", "dare", "nani", "kimo"];
  const step = async (key, text, keys, tag, mk) => { nSay++; const r = await kmSay(h, key, text, keys, tag); if (r.ok) { okN++; playMove(a, "nod"); } log.push(`${mk}${r.ok ? "○" : "×"}${r.heard}`); return r.ok; };
  for (let i = 0; i < 4; i++) { cs.forEach((c, j) => c.rect.setAttribute("fill", j === i ? "#FFE27A" : j < i ? "#E2F5D8" : "#FFF8E8"));
    await speak(a, `dgq_${QK[i]}_${mom}`, DG.q[QK[i]]); await step(`dg_${sc.id}_${i}`, sc.s[i][1], sc.s[i][2], ["どこで？", "だれと？", "なにを した？", "どんな きもち？"][i], ["📍", "👫", "🎬", "💗"][i]); }
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
  const t = tierOf(), n = Math.min(4, 2 + t), seq = it.s.slice(0, n), g = panel(`${it.t}の じゅんばん`, "#EAF7E6");
  await speak(C.pony, "dgj_intro", nTxt("dgj_intro")); await speak(C.pony, `dgj_${it.id}_q`, nTxt(`dgj_${it.id}_q`));
  const W = 320, x0 = 800 - n * (W + 30) / 2 + 15, order = shuffle(seq.map((_, i) => i));
  const slots = seq.map((_, i) => { const x = x0 + i * (W + 30); el("rect", { x, y: 160, width: W, height: 200, rx: 24, fill: "#FFFFFF", stroke: "#B9A8D9", "stroke-width": 5, "stroke-dasharray": "14 10" }, g); txt(g, x + W / 2, 400, DG.jw[i === n - 1 ? 3 : i], 40, { "text-anchor": "middle" }); return x; });
  const cs = order.map((k, j) => { const c = card(g, x0 + j * (W + 30), 560, W, 220, seq[k][1], seq[k][0], { es: 90, fs: 36 }); c.k = k; return c; });
  let next = 0, wrong = 0;
  await new Promise(res => { let busy = false; cs.forEach(c => c.onclick = async () => { if (busy || c.done) return;
      if (c.k === next) { c.done = 1; const dx = slots[next] - x0 - cs.indexOf(c) * (W + 30); tween(300, q => c.setAttribute("transform", `translate(${(dx * q).toFixed(0)} ${(-400 * q).toFixed(0)})`)); chime(); next++; if (next === n) res(); return; }
      busy = true; wrong++; noise(.1, 700, .35); await speak(C.pony, "dgj_ng", nTxt("dgj_ng")); busy = false; }); });
  await sleep(400); await speak(C.pony, "dgj_say", nTxt("dgj_say"));
  const line = nTxt(`dgj_${it.id}_${n}`); showTask(line, "じゅんばんに いおう", 260); await speak(C.pony, `dgj_${it.id}_${n}`, line); unsay();
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
