/* ================= 「かえりみち なかま」ショートコース（kaerimichi、2026-10-23） =================
   台本は sit/sits_new9.py。あだなじゃんけん（まけた ひとに たべものの あだなを つける）と、よりみちの きまり（ママと いっしょなら いい）。
   a3・c2 マスは「あだなじゃんけん」：グー・チョキ・パーを タッチ → かったら あいてに あだなを つけて いう／まけたら つけられた あだなに こたえる。
   ライバルは がお（場面には ださない）。とおりかかる ともだちは くま・ちゅう など。ママは こたえる 子の ママ。 */
const S12L = ["kaerimichi"];
const S12_READY = true; /* 声が そろうまで false */
Object.assign(RIVAL_OF, { kaerimichi: "gao" });
STAGES.push({ id: "kaerimichi", name: "かえりみち なかま", icon: "🎒", ready: S12_READY });
const ACT_ASK12 = ["kniyadatta", "knurayamashii"]; // あいての きもちの 場面：うごくのは あいて
const S12 = SITS.filter(s => S12L.includes(s.stage));
S12.forEach(s => ASK_ON_STAGE.add(s.intro));
S12.filter(s => s.help || ACT_ASK12.includes(s.id)).forEach(s => SOFT_INTRO.add(s.intro));
S12.forEach(s => INTRO[s.intro] = (h, a) => intro10(h, a, ACT_ASK12.includes(s.id) ? { ...s, help: true } : s));
{ const dr = drawRoom; drawRoom = function (place, noSign = false) { if (S12L.includes(curStage)) { const R = room8(place); if (R) { const S = S10L; S.push(curStage); try { return dr(place, noSign); } finally { S.pop(); } } } return dr(place, noSign); }; }
/* ---------- 場面の こもの ---------- */
const charKind12 = c => Object.keys(C).find(k => C[k] === c);
const momOf12 = c => { const k = charKind12(c); return k === "shima" ? "mama" : MOM_OF[k]; };
function momBeside(h) { const m = momOf12(h); if (!m || !C[m]) return; const c = xtra(m, h.x + 430, (ASK_AT[m] || [0, 1])[1] * .9); c.dx.v = c.dx.t = 0; c.happyOn = true; }
const PROP12 = {
  kndameda: h => momBeside(h), knurayamashii: h => momBeside(h),
  knwaruguchi: () => { const c = xtra("kuma", 860, (ASK_AT.kuma || [0, 1])[1] * .85); c.dx.v = c.dx.t = 0; c.sadMouth = true; later(900, () => playMove(c, "sad")); },
};
S12.forEach(s => { if (!PROP12[s.id]) return; const f = INTRO[s.intro]; INTRO[s.intro] = (h, a) => { PROP12[s.id](h, a); return f(h, a); }; });

/* ---------- ✊ あだなじゃんけん（a3・c2 マス） ---------- */
const JK_C = [["yaki", "やき", "🔥"], ["yude", "ゆで", "♨️"], ["age", "あげ", "🍳"], ["mushi", "むし", "☁️"], ["hiya", "ひや", "🧊"], ["koge", "こげ", "💥"]];
const JK_F = [["manju", "おまんじゅう", "🥮"], ["take", "たけのこ", "🎍"], ["onigiri", "おにぎり", "🍙"], ["chikuwa", "ちくわ", "🍢"], ["gyoza", "ぎょうざ", "🥟"], ["daikon", "だいこん", "🥬"]];
const JK_KEYS = { yaki: ["やき", "焼き"], yude: ["ゆで", "茹で"], age: ["あげ", "揚げ"], mushi: ["むし", "蒸し"], hiya: ["ひや", "冷や"], koge: ["こげ", "焦げ"],
  manju: ["まんじゅう", "饅頭"], take: ["たけのこ", "筍", "竹の子"], onigiri: ["おにぎり", "お握り"], chikuwa: ["ちくわ", "竹輪"], gyoza: ["ぎょうざ", "餃子"], daikon: ["だいこん", "大根"] };
const JK_H = [["gu", "✊", "グー"], ["choki", "✌️", "チョキ"], ["pa", "✋", "パー"]];
const JK_P = [["kuma", "くまくん", "🐻"], ["tora", "とらおくん", "🐯"]];
let JK_N = 0;
async function jkSpin(g, x, list, pick) { const box = el("g", {}, g); el("rect", { x: x - 180, y: 120, width: 360, height: 220, rx: 30, fill: "#FFFFFF", ...S6(6) }, box);
  const e = txt(box, x, 235, "", 100, { "text-anchor": "middle" }), w = txt(box, x, 315, "", 50, { "text-anchor": "middle" });
  for (let i = 0; i < 14; i++) { const it = list[(pick + i + 1) % list.length]; e.textContent = it[2]; w.textContent = it[1]; blip(500 + i * 40, 600, .03, "square"); await sleep(60 + i * 12); }
  e.textContent = list[pick][2]; w.textContent = list[pick][1]; chime(); }
ASK_ON_STAGE.add("knjanken");
const handOver = (c, em) => { const g = el("g", {}, front()); txt(g, 0, 0, em, 120, { "text-anchor": "middle" }); follow(g, () => { const p = headTop(c); return [p.x, p.y - 30, 0, 1]; }); return g; };
async function jkRun(heroKind) {
  const [pk, pn] = JK_P[JK_N++ % JK_P.length], t = tierOf();
  const s = { id: "knjanken", place: "かえりみち", asker: pk, intro: "knjanken" }; const { hero: h, ask: a } = setSitView(s, heroKind);
  showEngine(null, "あだなじゃんけん"); enter(h); await sleep(900); const g = el("g", {}, hudLayer);
  await speak(C.pony, "jk_intro", "あだなじゃんけん！ まけた ひとに、たべものの あだなを つけるよ");
  let res = 0, first = true;
  while (!res) {
    await speak(C.pony, first ? "jk_touch" : "jk_aiko", first ? "グー、チョキ、パーの どれかを タッチしてね" : "あいこ！ もう いちど タッチしてね"); first = false;
    const bg = el("rect", { x: 250, y: 110, width: 1100, height: 260, rx: 34, fill: "#FFFFFFE8", ...S6(5) }, g);
    const cs = JK_H.map(([id, em, lb], i) => { const c = card(g, 290 + i * 350, 135, 320, 210, lb, em, { es: 100, fs: 44 }); c.i = i; return c; });
    const i = await tapOnce(cs); cs.forEach(c => c.remove()); bg.remove();
    const r = rnd(10), j = r < 2 ? i : r < 6 ? (i + 1) % 3 : (i + 2) % 3; // (i+1)%3 → こどもの かち（だいたい はんぶんは かてる）
    const hh = handOver(h, JK_H[i][1]); playMove(h, "pump");
    await speak(a, `jka_${pk}_pon`, "じゃんけん ぽん！"); const ah = handOver(a, JK_H[j][1]); blip(900, 900, .08, "square"); await sleep(1300);
    hh.remove(); ah.remove();
    if (i === j) { noise(.1, 900, .2); continue; }
    res = (j === (i + 1) % 3) ? 1 : -1; }
  const ci = rnd(JK_C.length), fi = rnd(JK_F.length), [ck, cw] = JK_C[ci], [fk, fw] = JK_F[fi], nick = cw + fw, nk = `${ck}_${fk}`;
  let line, say, keys;
  if (res > 0) { confetti(30); joy(h); playMove(a, "sad"); await speak(C.pony, `jk_win_${pk}`, `かった！ ${pn}に あだなを つけよう`);
    await jkSpin(g, 600, JK_C, ci); await jkSpin(g, 1000, JK_F, fi); await sleep(500);
    await speak(a, `jka_${pk}_ask`, "まけたー。ぼくの あだなは なに？");
    line = t <= 1 ? nick + "！" : t <= 3 ? `${pn}は ${nick}！` : `きょうから ${pn}は ${nick}！`;
    say = async () => { if (t >= 2) await speak(C.pony, t <= 3 ? `jk_wa_${pk}` : `jk_kyou_${pk}`, t <= 3 ? `${pn}は` : `きょうから ${pn}は`); await speak(C.pony, `jk_n_${nk}`, nick + "！"); };
    keys = [JK_KEYS[ck], JK_KEYS[fk]]; }
  else { joy(a); noise(.15, 500, .3); await speak(C.pony, "jk_lose", "まけちゃった！ どんな あだなに なるかな？");
    await jkSpin(g, 600, JK_C, ci); await jkSpin(g, 1000, JK_F, fi); await sleep(500);
    await speak(a, `jka_${pk}_l_${nk}`, `かった！ きょうから きみは ${nick}！`);
    // 2026-10-31：つけられた あだなは「おもしろい！」と うけいれず、「あだなで よばないで」と いう（「ゆでたけのこ」が あだなだと わかりにくい、との 指摘）
    line = t <= 1 ? "あだなで よばないで" : t <= 3 ? `${nick}？ あだなで よばないで` : `えー、${nick}？ その あだなで よばないで。なまえで よんでね`;
    say = async () => { if (t >= 4) await speak(C.pony, "jk_ee", "えー、"); if (t >= 2) await speak(C.pony, `jk_nq_${nk}`, nick + "？");
      if (t >= 4) await speak(C.pony, "jk_sono", "その あだなで よばないで。なまえで よんでね"); else await speak(C.pony, "jk_yobanai", "あだなで よばないで"); };
    keys = [["あだな", "あだ名"], ["よばないで", "呼ばないで", "よばない", "呼ばない"]]; }
  g.innerHTML = "";
  showTask(line, res > 0 ? `${pn}に いおう` : `${pn}に こたえよう`); await say(); unsay();
  let ok = false; for (let n = 0; n < 2 && !ok; n++) { setListen(h, true); const r = await listen(keys, 9000); setListen(h, false); ok = r.r === "ok"; if (!ok && n === 0) await speak(C.pony, "p_again", "もう いっかい いってみよう"); }
  hideTask();
  if (ok) { confetti(40); joy(C.pony); joy(a); await speak(a, res > 0 ? `jka_${pk}_ok` : `jka_${pk}_sorry`, res > 0 ? "あはは、おもしろい あだな！" : "あ、ごめん。もう いわないね"); }
  else { await speak(C.pony, "p_together", "いっしょに いおうね"); await say(); if (res < 0) { playMove(a, "nod"); await speak(a, `jka_${pk}_sorry`, "あ、ごめん。もう いわないね"); } }
  grade(ok); GS.tasks++; if (ok) GS.ok++;
  playLog({ type: "adana", nick, win: res > 0, ok, ...(MODE === "multi" ? { who: NAMES[heroKind] } : {}) });
  await sleep(500); g.remove(); setView("board"); return ok;
}
{ const lc = landChild; landChild = async function (pc = P.shima) {
    if (!winner && KN_PC === pc && ["a3", "c2"].includes(pc.node) && curStage === "kaerimichi") {
      const dice = document.getElementById("dice"); if (dice) dice.style.visibility = "hidden";
      let ok = false; try { ok = await jkRun(pc.kind); } finally { if (dice) dice.style.visibility = ""; }
      if (ok) { if (pc.player) pc.player.ok++; await seedGet(pc); } return; }
    return lc(pc); }; }
EV_STYLE.adana = ["#FFD9B3", () => "✊"];
{ const be = boardEvent; boardEvent = async function (pc) { const ev = (EVENTS[curStage] || {})[pc.node]; if (ev && ev[0] === "adana") return; return be(pc); }; }

/* ---------- 盤 ---------- */
{ const P = ["こうもん", "かえりみち", "かえりみち", "つうがくろ", "こうえん", "いえの まえ"], fills = {}; P.forEach((p, i) => fills[p] = FILL8[i % FILL8.length]);
  STAGE_DEF.kaerimichi = { ground: "#FFF3E6", sky: "#CFEAFB", names: [P[0], P[1], P[2], P[2], P[3], P[3], P[4], P[4], P[5]], fills };
  board7("kaerimichi", P, "sidewalk"); }
BOARD_BG.kaerimichi = L => { bg7(L, "#FFF3E6", ["#D7F0D2", "#FFE3B3", "#D7ECFF"], "🎒 かえりみち", "#F29F4C"); txt(L, 1460, 180, "✊", 110, { "text-anchor": "middle" }); };
BLOCK_DEF.kaerimichi = { who: "doshin", sleep: false, intro: ["p_blk_kaerimichi", "どしんが、かえりみちに こうえんで あそんで いこうと して いるよ"], say: ["blk_kaerimichi", "よりみちは だめだよ"], to: "どしんに いおう", keys: [["よりみち", "寄り道"], ["だめ", "駄目"]], res: ["rs_kaerimichi", "そうだった！ いえに かえってから あそぶね"] };
SLEEPER_OF.kaerimichi = "doshin";
EVENTS.kaerimichi = { a2: ["fwd", 2, "ev_kaerimichif", "みんなで なかよく かえれた！ 2マス すすむよ"], m2: ["back", 2, "ev_kaerimichib", "くつひもが ほどけた！ 2マス もどるよ"], d1: ["back", 4, "ev_kaerimichih", "がっこうに わすれものを した！ 4マス もどるよ"],
  a3: ["adana", 0, "", ""], c2: ["adana", 0, "", ""] };
