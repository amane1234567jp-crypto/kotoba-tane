/* ================= ロングコース「きもちの だいぼうけん」（kimochi、2026-10-19） =================
   ねらい：マイナスの きもちを ぜんぶ「くやしい」で いわないで、ぴったりの ことばを えらべる ように する。
   48マス・4つの ばしょ：① いえ（きほんの きもち）② がっこう（にて いる マイナスの きもち）③ こうえん（くわしく いう）④ おでかけ（ひとの きもち）
   マス：💗 きもちの 場面（29）・🎭 きもち ぴったり（6）・🎤 きもちの インタビュー（4）・しかけ（すすむ・もどる・やすみ・もういっかい 6）・とおせんぼ（ないて いる こん）
   「くやしい」と いったけど ほかの ことばが ぴったりの ときは、ぽにーが やさしく いいかえを おしえる（まちがいに しない。おとなの きろくに かずが でる）。
   データ・声：sit/kimochi_gen.py → kimochi_data.js ・ pony_kimochi.json ・ aivis/jobs/kc1 → packs/kimochi.json */
const KCS = "kimochi", KF = KC.feel;
const KC_N = new Map(); let KC_GOT = [];
{ const ap = applyStage; applyStage = function (id, ...a) { if (id === KCS) { KC_N.clear(); KC_GOT = []; } return ap(id, ...a); }; }
/* ---------- マスの ならび ---------- */
{ const O = SL_ORDER[KCS];
  const PLAN = [null, "ks", "ks", "e:kf1", "kp", "ks", "ks", "kv", "ks", "ks", "e:kb1", "ks",
    "ks", "kp", "ks", "ks", "ks", "e:rest", "ks", "kp", "ks", null, "ks", "ks",
    "ks", "ks", "kp", "e:again", "ks", "kv", "ks", "ks", "e:kb2", "kv", "ks", "ks",
    "ks", "ks", "kp", "ks", "e:kf2", "ks", "kv", "ks", "kp", "ks", "ks", null];
  const ev = {}, task = {};
  O.forEach((id, i) => { const p = PLAN[i]; if (!p || id === "0" || id === "4" || id === "15") return;
    if (p.startsWith("e:")) { const t = p.slice(2); ev[id] = [t, 0, `sl_${KCS}_${t}`, KC.evt[t]]; } else task[id] = p; });
  EVENTS[KCS] = ev; LONG_TASKS[KCS] = task;
  LEGENDS[KCS] = [["ks", "きもち"], ["kp", "ぴったり"], ["kv", "インタビュー"]]; }
Object.assign(LTASK, { ks: ["#FFD1DC", "💗"], kp: ["#FFE27A", "🎭"], kv: ["#C9E7FF", "🎤"] });
Object.assign(SL_ICON, { kf1: "😊", kf2: "😊", kb1: "😢", kb2: "😥" }); Object.assign(SL_EVC, { kf1: "#C9EBB5", kf2: "#C9EBB5", kb1: "#FFC2D1", kb2: "#FFC2D1" });
const kcArea = id => Math.min(4, Math.floor(SL_ORDER[KCS].indexOf(id) / 12) + 1);
// すすむ・もどる しかけ
{ const be = boardEvent; boardEvent = async function (pc) {
    const ev = curStage === KCS && EVENTS[KCS][pc.node];
    if (!ev || !/^k[fb]/.test(ev[0]) || (pc.player && pc.player.stay)) return be(pc);
    await sleep(300); markAbove(pc, ev[0][1] === "f" ? "heart" : "drop"); chime(); await slSay(ev[2], ev[3]); await slGo(pc, ev[0][1] === "f" ? 2 : -2); await sleep(300); }; }
// とおせんぼの こんは ないて いる
{ const bk = blockEvent; blockEvent = async function (pc) { if (curStage !== KCS) return bk(pc);
    const t = setInterval(() => { if (P.doshin && P.doshin.node) markAbove(P.doshin, "drop", { dx: rnd(2) ? 40 : -40 }); }, 450); try { return await bk(pc); } finally { clearInterval(t); } }; }
/* ---------- 盤の え ---------- */
BOARD_BG[KCS] = L => {
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFF4F7" }, L);
  const Y = [930, 765, 600, 435], C4 = ["#FFE9D6", "#E3F0FF", "#DDF2D0", "#FFE0EE"], I4 = ["🏠", "🏫", "🌳", "🚌"], N4 = ["いえ", "がっこう", "こうえん", "おでかけ"];
  Y.forEach((y, r) => { el("rect", { x: 30, y: y - 70, width: 1540, height: 140, rx: 70, fill: C4[r], ...S6(4) }, L);
    const x = r === 3 ? 1520 : 80; /* おでかけ は ゴールの はんたいがわ */ txt(L, x, y + 6, I4[r], 46, { "text-anchor": "middle" }); txt(L, x, y + 44, N4[r], N4[r].length > 3 ? 17 : 20, { "text-anchor": "middle" }); });
  [["💗", 150, 300], ["😊", 400, 330], ["😳", 1210, 320], ["😢", 1400, 300], ["😨", 300, 240], ["🤗", 1320, 230]].forEach(([e, x, y]) => txt(L, x, y, e, 54, { "text-anchor": "middle", opacity: .85 }));
  el("rect", { x: 540, y: 212, width: 520, height: 80, rx: 22, fill: "#E86A9A", ...S6(5) }, L); txt(L, 800, 266, "💗 きもちの だいぼうけん", 38, { "text-anchor": "middle", fill: "#FFFFFF" });
};
/* ---------- 声の パック ---------- */
{ const lp = loadPack; loadPack = async function (id) { const r = await lp(id); if (id !== KCS) return r;
    if (!PACK.loaded[KCS]) { try { const q = await fetch(`packs/${KCS}.json`, { cache: "no-cache" }); if (q.ok) { const d = await q.json(); Object.keys(d).forEach(k => AUD[k] = "data:audio/mpeg;base64," + d[k]); PACK.loaded[KCS] = Object.keys(d); } } catch (e) { /* なくても あそべる */ } }
    if (AUD["bgm_" + KCS]) await voiceBuf("bgm_" + KCS); return true; }; }

/* ---------- きもちの うごき（からだの かんじ） ---------- */
Object.assign(MARK_DRAW, {
  moya(g) { el("path", { d: "M-34 6 C-40 -16 -18 -26 -6 -16 C0 -34 26 -30 26 -12 C44 -12 44 14 24 14 C14 26 -10 26 -16 14 C-30 20 -40 14 -34 6 Z", fill: "#C9C9D6", stroke: INK, "stroke-width": 4 }, g);
    el("path", { d: "M-18 0 q8 -10 16 0 t16 0", fill: "none", stroke: "#8A8AA0", "stroke-width": 4, "stroke-linecap": "round" }, g); },
  steam(g) { el("path", { d: "M-10 18 Q-24 0 -8 -12 Q4 -22 -4 -36 M10 18 Q-2 2 12 -10 Q22 -20 14 -34", fill: "none", stroke: "#FFFFFF", "stroke-width": 9, "stroke-linecap": "round" }, g);
    el("path", { d: "M-10 18 Q-24 0 -8 -12 Q4 -22 -4 -36 M10 18 Q-2 2 12 -10 Q22 -20 14 -34", fill: "none", stroke: "#E2456F", "stroke-width": 4, "stroke-linecap": "round" }, g); },
});
function feelAnim(c, f) {
  if (!c) return; const back = (ms, fn) => later(ms, fn);
  switch (f) {
    case "kuyashii": playMove(c, "frustrated"); later(500, () => tears(c, 1)); break;
    case "kanashii": playMove(c, "sad"); break;
    case "gakkari": c.sadMouth = true; c.headY.t = 24; c.squash.t = .9; c.armL.t = -4; c.armR.t = 4; c.eyeY.t = 8; noise(.4, 300, .25);
      back(2600, () => { c.sadMouth = false; c.headY.t = 0; c.squash.t = 1; c.armL.t = 0; c.armR.t = 0; c.eyeY.t = 0; }); break;
    case "samishii": c.sadMouth = true; c.squash.t = .93; playMove(c, "look"); back(2600, () => { c.sadMouth = false; c.squash.t = 1; }); break;
    case "hazukashii": playMove(c, "shy"); markAbove(c, "shy", { dy: 160, vy: -5, life: 2.2 }); break;
    case "mukamuka": hold(c, "shake", 1.2); c.armL.t = -40; c.armR.t = 40; [0, 400, 800].forEach(ms => later(ms, () => markAbove(c, ms === 400 ? "anger" : "steam", { dx: ms === 400 ? 110 : -60, vy: -50 })));
      back(1600, () => { c.armL.t = 0; c.armR.t = 0; }); break;
    case "zurui": c.squash.t = 1.06; c.mouthOpen.t = 0; playMove(c, "point"); markAbove(c, "anger", { dx: 110 }); back(2000, () => { c.squash.t = 1; }); break;
    case "urayamashii": c.eyeScale.t = 1.3; c.lean.t = 8; [0, 350, 700].forEach(ms => later(ms, () => markAbove(c, "sparkle", { dx: 90, vy: -30 }))); back(2400, () => { c.eyeScale.t = 1; c.lean.t = 0; }); break;
    case "kowai": playMove(c, "scared"); break;
    case "shinpai": playMove(c, "look"); c.sadMouth = true; markAbove(c, "drop", { dx: 120, dy: 60, vy: 30, grav: 200 }); later(900, () => markAbove(c, "q", { dx: -60 })); back(2600, () => { c.sadMouth = false; }); break;
    case "komatta": playMove(c, "think"); markAbove(c, "drop", { dx: 120, dy: 60, vy: 30, grav: 200 }); later(700, () => markAbove(c, "drop", { dx: -120, dy: 60, vy: 30, grav: 200 })); break;
    case "tsumaranai": playMove(c, "sleepy"); c.squash.t = .95; back(1800, () => { c.squash.t = 1; }); break;
    case "iraira": hold(c, "shake", 1.6); for (let i = 0; i < 6; i++) later(i * 260, () => { blip(180, 120, .05, "square"); c.squash.vel += 1.2; }); later(300, () => markAbove(c, "anger", { dx: 110 })); break;
    case "moyamoya": c.sadMouth = true; [0, 450, 900].forEach((ms, i) => later(ms, () => markAbove(c, "moya", { dx: (i - 1) * 70, vy: -25, life: 2 }))); back(2400, () => { c.sadMouth = false; }); break;
    case "ureshii": joy(c); break;
    case "tanoshii": playMove(c, "laugh"); break;
    case "wakuwaku": [0, 380, 760].forEach(ms => later(ms, () => { jump(c, .45); markAbove(c, "sparkle", { dx: 90 }); })); break;
    case "bikkuri": playMove(c, "surprise"); break;
    case "hotto": c.squash.t = .94; markAbove(c, "puff", { dx: 120, vy: -20 }); back(900, () => { c.squash.t = 1; c.happyOn = true; }); back(2200, () => { c.happyOn = false; }); break;
    case "dokidoki": [0, 500, 1000, 1500].forEach(ms => later(ms, () => { markAbove(c, "heart", { dx: 100, vy: -30, s: .8 }); blip(120, 80, .08, "sine"); c.squash.vel += 1.5; })); break;
  }
}
/* ---------- ききとり ---------- */
const kcPraise = () => { const k = rnd(2) ? "kp_ok" : "kp_ok2"; return speak(C.pony, k, KC.txt[k]); };
const kcHas = (heard, f) => KF[f].keys.some(v => heard.includes(v) || norm(heard).includes(norm(v)));
function kcWhich(heard, prefer = []) { for (const f of prefer) if (kcHas(heard, f)) return f; for (const f of Object.keys(KF)) if (kcHas(heard, f)) return f; return null; }
const KC_ALL = [Object.values(KF).flatMap(v => v.keys)];
// じぶんの ことばで こたえる（なにを いっても いい。しずかに なったら おわり）
function freeListen(ms = 12000) {
  if (!srUsable) return listen([[""]], ms);
  return new Promise(res => { let heard = "", fin = false, idle = null; heardEl.textContent = "…"; taskListen(true);
    const end = () => { if (fin) return; fin = true; clearTimeout(idle); clearTimeout(tm); h.stop(); taskListen(false); heardEl.textContent = heard || "（きこえなかった）"; res({ r: heard ? "ok" : "none", heard }); };
    const h = hear(ts => { for (const t of ts) if (t.length > heard.length) heard = t; heardEl.textContent = heard; clearTimeout(idle); idle = setTimeout(end, 2300); }, ms);
    h.done.then(() => setTimeout(end, 300)); const tm = setTimeout(end, ms + 400); }); }
// きもちの カード（かお＋ことば）
function kcCards(fs, y = 130, par = hudLayer) { const g = el("g", {}, par); const W = 330, x0 = 800 - fs.length * (W + 24) / 2 + 12;
  el("rect", { x: x0 - 30, y: y - 14, width: fs.length * (W + 24) + 36, height: 200, rx: 30, fill: "#FFFFFFE8", ...S6(5) }, g);
  const cs = fs.map((f, i) => { const c = card(g, x0 + i * (W + 24), y, W, 172, KF[f].w, KF[f].e, { es: 84, fs: 50 }); c.f = f; return c; }); g.cs = cs; return g; }
// 「どんな きもち？」に こたえる。くやしいと いったら、ぴったりの ことばを おしえる
async function kcFeel(h, sc, t, ask, qKey, qText, tag) {
  const F = sc.f, okSet = [F, ...(sc.also || [])], st = { said: null, iikae: false, wrong: false, ok: false };
  if (ask) await speak(ask, qKey, qText); else await speak(C.pony, qKey, qText);
  let cg = null; const showC = () => { if (!cg) cg = kcCards(shuffle([F, ...sc.opts])); };
  if (t < 3) showC(); /* 段4から：カードは いちど いえなかった ときだけ */
  for (let n = 0; n < 2 && !st.said; n++) {
    showTask("？", tag); setListen(h, true);
    const tap = cg ? new Promise(r => cg.cs.forEach(c => c.onclick = () => r({ r: "ok", heard: KF[c.f].w, tap: c.f }))) : new Promise(() => { });
    const r = await Promise.race([listen(KC_ALL, 9000), tap]); setListen(h, false); hideTask(); if (cg) cg.cs.forEach(c => c.onclick = null);
    let f = r.tap || kcWhich(r.heard || "", okSet);
    if (!f && r.r === "ok") f = F; // 確認ボタン・にて いる おとで あった とき
    if (f) { st.said = f; break; }
    if (n === 0) { showC(); await speak(C.pony, "kp_tap", "カードを みても いいよ"); }
  }
  const f = st.said;
  if (f && okSet.includes(f)) { st.ok = true; if (cg) { const c = cg.cs.find(x => x.f === f) || cg.cs.find(x => x.f === F); if (c) c.rect.setAttribute("fill", "#FFE27A"); } chime(); markAbove(h, "sparkle");
    await kcPraise(); }
  else {
    if (f === "kuyashii") { st.iikae = true; await speak(C.pony, `kp_ii_${F}`, KC.txt[`kp_ii_${F}`]); }
    else { st.wrong = !!f; await speak(C.pony, `kp_pt_${F}`, KC.txt[`kp_pt_${F}`]); }
    if (cg) { const c = cg.cs.find(x => x.f === F); if (c) c.rect.setAttribute("fill", "#FFE27A"); }
    const r = await kmSay(h, `kp_w_${F}`, KF[F].w, [KF[F].keys], "まねして いおう"); st.ok = r.ok && st.iikae; }
  if (cg) cg.remove();
  return st;
}
/* ---------- 💗 きもちの 場面 ---------- */
function kcAsker(sc, hero) { if (sc.ask === "sensei") return "nobbo"; return hero === "shima" ? "mama" : MOM_OF[hero] || null; }
function kcPick(area, hero) {
  let pool = KC.sc.filter(s => s.area === area && kcAsker(s, hero)); if (!pool.length) pool = KC.sc.filter(s => kcAsker(s, hero));
  const m = Math.min(...pool.map(s => KC_N.get(s.id) || 0)); pool = pool.filter(s => (KC_N.get(s.id) || 0) === m); return pool[rnd(pool.length)]; }
function kcFriend(hero, asker) { const used = new Set([hero, asker, SLEEPER, ...PLAYERS.map(p => p.kind)]); const c = shuffle(["kuma", "tora", "pyon", "mii", "chu"]).filter(k => !used.has(k)); return c[0] || null; }
async function kcScene(pc) {
  const hero = pc.kind, sc = kcPick(kcArea(pc.node), hero), asker = kcAsker(sc, hero), Q = KC.q[asker], t = tierOf(), other = sc.area === 4;
  KC_N.set(sc.id, (KC_N.get(sc.id) || 0) + 1);
  showEngine(null, `きもち（${sc.id}・段${t + 1}）`);
  const v = setSitView({ id: "kc_" + sc.id, place: sc.place, asker, intro: "kc" }, hero), h = v.hero, a = v.ask; a.dx.v = a.dx.t = 900;
  const fk = sc.ex ? kcFriend(hero, asker) : null; const ex = fk ? xtra(fk, 990) : null; if (ex) { ex.dx.v = ex.dx.t = 0; }
  const who = other ? ex : h; // きもちを かんじて いる 子
  enter(h); await sleep(1000);
  const hb = hint7(other && ex ? ex : h, sc.emo, sc.hint); feelAnim(who, sc.f); if (other) playMove(h, "look");
  let loop = null; if (other && ex) loop = setInterval(() => feelAnim(ex, sc.f), 3200);
  await speak(C.pony, `kc_${sc.id}_n`, KC.txt[`kc_${sc.id}_n`]);
  enter(a); await sleep(1000);
  const log = [], said = []; let okN = 0, nSay = 1, iikae = false, wrong = false;
  // 1) どんな きもち？
  const st = await kcFeel(h, sc, t, a, `kcq_${other ? "other" : "feel"}_${asker}`, Q[other ? "other" : "feel"], other ? "ともだちの きもちは？" : "きもちの ことばで");
  if (loop) { clearInterval(loop); loop = null; }
  if (st.ok) okN++; iikae = st.iikae; wrong = st.wrong; said.push(st.said); log.push(`きもち:${st.said ? KF[st.said].w : "-"}${st.iikae ? "→" + KF[sc.f].w : ""}${st.ok ? "○" : "×"}`);
  feelAnim(who, sc.f); await speak(C.pony, `kp_body_${sc.f}`, KC.txt[`kp_body_${sc.f}`]); hb.remove();
  KC_GOT.push({ kind: hero, f: sc.f });
  // 2) くわしく
  const step = async (qk, key, keys, tag) => { nSay++; if (qk) await speak(a, `kcq_${qk}_${asker}`, Q[qk]); const r = await kmSay(h, key, KC.txt[key], keys, tag); if (r.ok) { okN++; playMove(a, "nod"); } log.push(`${qk || "x"}${r.ok ? "○" : "×"}${r.heard}`); return r.ok; };
  if (sc.area <= 2 && t >= 1 && sc.why) await step("why", `kc_${sc.id}_r`, sc.why, "わけを いおう");
  if (sc.area <= 2 && t >= 2 && sc.want) await step("want", `kc_${sc.id}_h`, sc.want, "どう したい？");
  if (sc.area === 3 && t >= 1) {
    const F2 = sc.f2;
    if (sc.sp === "mix") { await speak(a, `kcq_mix_${asker}`, Q.mix); await speak(C.pony, "kp_mix", KC.txt.kp_mix); feelAnim(h, F2); KC_GOT.push({ kind: hero, f: F2 }); await step(null, `kc_${sc.id}_x`, [KF[sc.f].keys, KF[F2].keys], "ふたつの きもち"); }
    else if (sc.sp === "chg") { await speak(a, `kcq_before_${asker}`, Q.before); feelAnim(h, F2); await speak(C.pony, "kp_chg", KC.txt.kp_chg); KC_GOT.push({ kind: hero, f: F2 }); await step(null, `kc_${sc.id}_x`, [KF[F2].keys, KF[sc.f].keys], "かわった きもち"); }
    else if (sc.sp === "deg") { await speak(a, `kcq_deg_${asker}`, Q.deg); await speak(C.pony, "kp_deg", KC.txt.kp_deg); await step(null, `kc_${sc.id}_x`, [["すごく", "すっごく", "とても", "ちょっと", "すこし", "少し", "めっちゃ", "かなり"], KF[sc.f].keys], "どのくらい？"); }
    else if (sc.sp === "req") { await speak(a, `kcq_req_${asker}`, Q.req); await speak(C.pony, "kp_req", KC.txt.kp_req); await step(null, `kc_${sc.id}_x`, sc.xkeys, "して ほしい こと"); }
  }
  if (other && t >= 1) { await speak(C.pony, "kp_other", KC.txt.kp_other); const ok = await step("otherSay", `kc_${sc.id}_x`, sc.xkeys, "ともだちに いおう");
    if (ex) { ex.sadMouth = false; ex.headY.t = 0; if (ok) { joy(ex); markAbove(ex, "heart"); await speak(C.pony, "kp_say_ok", KC.txt.kp_say_ok); } } }
  await speak(a, `kcq_res_${asker}`, Q.res);
  const ok = okN * 2 >= nSay; grade(ok && !wrong); GS.tasks++;
  playLog({ type: "kimochi", id: sc.id, f: sc.f, said: said[0] || "", iikae, wrong, tier: t, okN, nSay, tries: log, ...(MODE === "multi" ? { who: NAMES[hero] } : {}) });
  if (ok) { joy(h); confetti(40); await speak(C.pony, "kp_end", KC.txt.kp_end); }
  await sleep(400); setView("board"); return ok;
}
/* ---------- 🎭 きもち ぴったり ---------- */
const KC_PN = new Map();
async function kcPitta(pc) {
  let pool = KC.pitta; const m = Math.min(...pool.map(x => KC_PN.get(x.id) || 0)); pool = pool.filter(x => (KC_PN.get(x.id) || 0) === m); const it = pool[rnd(pool.length)]; KC_PN.set(it.id, m + 1);
  const t = tierOf(), g = panel("きもち ぴったり", "#FFF6E0");
  el("rect", { x: 170, y: 140, width: 1260, height: 330, rx: 30, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 330, 360, it.emo, 170, { "text-anchor": "middle" });
  const words = it.t.split("、"); words.forEach((l, i) => txt(g, 900, 315 + (i - (words.length - 1) / 2) * 72, l + (i < words.length - 1 ? "、" : ""), l.length > 13 ? 42 : 50, { "text-anchor": "middle" }));
  await speak(C.pony, "kp_pitta", KC.txt.kp_pitta); await speak(C.pony, `kpt_${it.id}_q`, it.t);
  const fs = shuffle([it.f, ...it.opts]), cs = fs.map((f, j) => { const c = card(g, 190 + j * 420, 530, 380, 250, KF[f].w, KF[f].e, { es: 110, fs: 50 }); c.f = f; return c; });
  let first = true, iikae = false; const picks = [];
  const chosen = await new Promise(res => { let live = true, busy = false;
    const pick = async f => { if (!live || busy) return; const c = cs.find(x => x.f === f); if (!c || c.dim) return; picks.push(f);
      if (f === it.f) { live = false; cs.forEach(x => x.onclick = null); res(c); return; }
      busy = true; first = false; if (f === "kuyashii") iikae = true; c.dim = 1; c.setAttribute("opacity", .35); noise(.1, 700, .35);
      await speak(C.pony, `kp_def_${f}`, KC.txt[`kp_def_${f}`]); busy = false; };
    cs.forEach(c => c.onclick = () => pick(c.f));
    (async () => { const ks = [fs.flatMap(f => KF[f].keys)]; while (live) { setListen(pc, true); const r = await listen(ks, 9000); setListen(pc, false); if (!live) return;
        if (r.r === "ok") { const f = kcWhich(r.heard || "", [it.f]) || (r.heard && r.heard.includes("確認") ? it.f : null); if (f && fs.includes(f)) await pick(f); }
        await sleep(200); } })(); });
  chosen.rect.setAttribute("fill", "#FFE27A"); chime(); confetti(30); const big = chosen.childNodes[1]; if (big) tween(500, k => big.setAttribute("transform", `translate(0 ${(-30 * Math.sin(k * Math.PI)).toFixed(0)})`));
  await kcPraise(); await speak(C.pony, `kp_def_${it.f}`, KC.txt[`kp_def_${it.f}`]);
  let okR = true; if (t >= 1) { await speak(C.pony, "kp_pitta_why", KC.txt.kp_pitta_why); const r = await kmSay(pc, `kpt_${it.id}_r`, KC.txt[`kpt_${it.id}_r`], it.keys, "わけを いおう"); okR = r.ok; }
  KC_GOT.push({ kind: pc.kind, f: it.f });
  const ok = first && okR; grade(ok); playLog({ type: "pitta", id: it.id, f: it.f, picks, iikae, ok, ...(MODE === "multi" ? { who: NAMES[pc.kind] } : {}) });
  await sleep(500); g.remove(); if (ok) await slGo(pc, 1); return ok;
}
/* ---------- 🎤 きもちの インタビュー（じぶんの ことを はなす） ---------- */
async function kcInterview(pc) {
  const t = tierOf(), g = panel("きもちの インタビュー", "#EAF6FF");
  const me = clone(pc.kind, 470, 920, (KID_S[pc.kind] || .8) * .78); hudLayer.appendChild(me.root);
  const po = clone("pony", 1230, 920, .62); hudLayer.appendChild(po.root); // インタビュアーの ぽにー
  const mic = txt(g, 960, 700, "🎤", 130, { "text-anchor": "middle" }); el("rect", { x: 900, y: 170, width: 560, height: 130, rx: 30, fill: "#FFFFFF", ...S6(5) }, g); const qt = txt(g, 1180, 255, "", 46, { "text-anchor": "middle" });
  await speak(C.pony, "kv_intro", KC.txt.kv_intro);
  const p = rnd(5), qs = [`kv_p${p}`, "kv_q1", ...(t >= 1 ? ["kv_q2"] : []), ...(t >= 3 ? ["kv_q3", "kv_q4"] : []), ...(t >= 2 ? ["kv_q5"] : [])];
  const short = { kv_q1: "どんな きもち？", kv_q2: "どうして？", kv_q3: "からだは？", kv_q4: "どう したかった？", kv_q5: "いまは？" };
  const ans = []; let n = 0;
  for (const q of qs) {
    qt.textContent = short[q] || "おしえて！"; tween(400, k => mic.setAttribute("transform", `translate(0 ${(-20 * Math.sin(k * Math.PI)).toFixed(0)})`));
    playMove(po, "point"); await speak(C.pony, q, KC.txt[q]); showTask("🎤", "じぶんの ことばで"); setListen(pc, true); const r = await freeListen(13000); setListen(pc, false); hideTask();
    const heard = (r.heard || "").replace("（確認ボタン）", "○"); ans.push(`${short[q] || "はなし"}「${heard}」`);
    if (r.r === "ok") { n++; playMove(po, "nod"); const f = (q === "kv_q1" || q === "kv_q5") ? kcWhich(heard) : null;
      if (f) { feelAnim(me, f); await speak(C.pony, `kp_echo_${f}`, KC.txt[`kp_echo_${f}`]); KC_GOT.push({ kind: pc.kind, f }); } else { const a = rnd(4); playMove(me, "nod"); await speak(C.pony, `kv_a${a}`, KC.txt[`kv_a${a}`]); } }
    else await speak(C.pony, "kv_think", KC.txt.kv_think);
  }
  const ok = n * 2 >= qs.length; if (ok) { confetti(40); joy(me); } await speak(C.pony, "kv_end", KC.txt.kv_end);
  playLog({ type: "interview", q: `kv_p${p}`, n, of: qs.length, ans, ...(MODE === "multi" ? { who: NAMES[pc.kind] } : {}) });
  grade(ok); clearClones(); g.remove(); return ok;
}
Object.assign(LTASK_RUN, { ks: kcScene, kp: kcPitta, kv: kcInterview });
/* ---------- ゴール：きもち ずかん ---------- */
{ const em = endingMulti; endingMulti = async function () {
    if (curStage === KCS && KC_GOT.length) {
      const fs = [...new Set(KC_GOT.map(x => x.f))], g = panel("きもち ずかん", "#FFF4F7"); const COL = 5, W = 250, H = 165;
      const rows = Math.ceil(fs.length / COL), y0 = Math.max(150, 520 - rows * (H + 20) / 2);
      fs.forEach((f, i) => { const r = Math.floor(i / COL), cnt = Math.min(COL, fs.length - r * COL), x = 800 - cnt * (W + 20) / 2 + (i % COL) * (W + 20);
        const c = el("g", {}, g), y = y0 + r * (H + 20); el("rect", { x, y, width: W, height: H, rx: 26, fill: KC.neg.includes(f) ? "#E9F2FF" : "#FFF3D6", ...S6(6) }, c);
        txt(c, x + W / 2, y + 78, KF[f].e, 66, { "text-anchor": "middle" }); txt(c, x + W / 2, y + 140, KF[f].w, KF[f].w.length > 5 ? 34 : 40, { "text-anchor": "middle" }); c.setAttribute("opacity", 0); later(300 + i * 180, () => { c.setAttribute("opacity", 1); blip(700 + i * 40, 1000, .08, "square"); }); });
      txt(g, 800, 900, `${fs.length}この きもちの ことば`, 46, { "text-anchor": "middle" });
      await speak(C.pony, "kp_zukan", KC.txt.kp_zukan); await sleep(1200 + fs.length * 180); g.remove(); }
    return em(); }; }
/* ---------- おとなの きろく：くやしいの いいかえ ---------- */
{ const lt = logText; logText = function () {
    const o = lt(); let a = []; try { a = JSON.parse(localStorage.getItem(LOG_KEY) || "[]"); } catch (e) { }
    const kc = a.filter(x => x.type === "kimochi" || x.type === "pitta"); if (!kc.length) return o;
    const cnt = (arr) => Object.entries(arr.reduce((m, f) => (m[f] = (m[f] || 0) + 1, m), {})).sort((p, q) => q[1] - p[1]).map(([f, n]) => `${KF[f] ? KF[f].w : f}${n}`).join("・");
    const ii = kc.filter(x => x.iikae);
    const said = a.filter(x => x.type === "kimochi" && x.said).map(x => x.said);
    const add = `\nきもち：はじめに 言った ことば ${cnt(said) || "なし"}／「くやしい」から 言いかえ ${ii.length}回${ii.length ? `（${cnt(ii.map(x => x.f))}）` : ""}`;
    const fmt = x => x.type === "kimochi" ? `きもち ${x.id}（${KF[x.f].w}） 言った:${x.said ? KF[x.said].w : "-"}${x.iikae ? " ←くやしいから言いかえ" : ""} ${x.okN}/${x.nSay} ${(x.tries || []).join(" / ")}`
      : x.type === "pitta" ? `ぴったり ${x.id}（${KF[x.f].w}） えらんだ: ${x.picks.map(f => KF[f] ? KF[f].w : f).join("→")} ${x.ok ? "○" : "△"}`
      : x.type === "interview" ? `インタビュー ${x.n}/${x.of} ${x.ans.join(" ")}` : null;
    const lines = o.text.split("\n"); let j = 0; const out = lines.map(l => l); // 「{json}」の 行を よみやすく
    const items = a; const d = tt => { const x = new Date(tt); return `${x.getMonth() + 1}/${x.getDate()} ${String(x.getHours()).padStart(2, "0")}:${String(x.getMinutes()).padStart(2, "0")}`; };
    items.forEach(x => { const f = fmt(x); if (!f) return; const raw = `${d(x.t)} ${JSON.stringify(x)}`; const k = out.indexOf(raw); if (k >= 0) out[k] = `${d(x.t)} ${f}${x.who ? `（${x.who}）` : ""}`; });
    const sum = o.sum + add; return { sum, text: out.join("\n").replace(o.sum, sum) }; }; }
