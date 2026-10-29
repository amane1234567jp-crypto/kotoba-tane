/* ================= 2026-10-29 の 直し：ロングの ライバルの 場面 =================
   ・ともだち ロング（ltomo）：ライバル（がお）に あう 場面が ltomo に なく、pickSit が undefined を かえして 止まって いた → こうしゃの 場面を つかう
   ・じゅぎょう・ちょうロング など：こうしゃの 場面を つかうが、こうしゃの パックは 読んで いないので、ページに 入って いる 場面（声が ある もの）だけ えらぶ（PICK_NEED_AUDIO） */
{ const ps = pickSit;
  pickSit = function (place, heroKind = "shima") {
    const sl = (typeof isSL === "function" && isSL()) || curStage === "ltomo" || curStage === "jugyou";
    if (!sl) return ps(place, heroKind);
    PICK_NEED_AUDIO = true;
    try { if (curStage === "ltomo") { curStage = "kousha"; try { return ps(place, heroKind); } finally { curStage = "ltomo"; } } return ps(place, heroKind); }
    finally { PICK_NEED_AUDIO = false; } }; }

/* ================= 2026-10-29 の 直し：「？」と 気もちの うごきの タイミング =================
   あまねさんの 指摘「きりかえで、へんな タイミングで ？が 出る。くまくんが こられないと 知る まえから ないて いて、知った ときには ないて いない。ぎゃくでは？」
   → 相手の ことば（しらせ・しつもん）が きっかけの 気もちは、相手が 話し おわってから 出す（REACT_X）。
     はじめの うごきは「しらせを まつ ようす」に かえる（PRE_AN）。きっかけが まだ ないのに 出て いた「？」「かんがえる」は 出さない（Q_MUTE_X）。 */
// 待って いる あいだの ひとりでの うごき（IDLE）に「かんがえる（？が 出る）」「ねむい（あくび）」が まじって いて、話の ながれと 関係なく ？や あくびが 出て いた → 出さない
IDLE.splice(0, IDLE.length, "look", "nod");
// くしゃみ・しゃっくりも 場面と 関係なく 出て いたので やめる（耳を ぴくっと する・きょろきょろ・うなずく だけ）
idleTick = function (c, dt, busy) {
  if (busy || c === speaker || Object.keys(c.tm).length) { c.idleAt = Math.max(c.idleAt, 4); return; }
  c.idleAt -= dt; if (c.idleAt >= 0) return; c.idleAt = 7 + Math.random() * 7;
  if (Math.random() < .5) { c.earL.vel += 120; c.earR.vel -= 120; c.headRot.vel += (Math.random() - .5) * 60; }
  else { const m = MOVES.find(x => x.id === IDLE[Math.floor(Math.random() * IDLE.length)]); if (m) m.play(c); } };
const PRE_AN = { // 場面の はじめの うごき（an[0]）：しらせの まえの ようす
  krkouen: "look", krgame: "clap", krsekigae: "look", krkuma: "clap", krtv: "clap", krburanko: "frustrated", krnaka: "frustrated",
  khshamoji: "look", khshitaku: "look", khpoint: "look", khmichi: "look",
  szdakitsuki: "look", jbrandoseru: "look", jbtoast: "look", jbonigokko: "look",
  kwitazura: "look", kwkusuguri: "look", kwnakama: "look", mtoogoe: "look",
  bssoto: "look", bsatsumaru: "look",
  kntsukerareta: "look", knadana: "look", kniyadatta: "look", kndameda: "look",
};
const REACT_X = { // 相手が 話し おわったら：主人公の 気もち
  krkouen: "sad", krgame: "sad", krtaiiku: "sad", krsekigae: "surprise", krkuma: "cry", krtv: "sad", krjikanwari: "surprise", kromukae: "sad",
  khchiisai: "think", khhayai: "think", khshamoji: "think", khjunbi: "think", khdensha: "think", khpage: "think", khshitaku: "think", khpoint: "think", khmichi: "think",
  szdakitsuki: "surprise", jbrandoseru: "think", jbtoast: "think", jbonigokko: "think",
  kwitazura: "surprise", kwkusuguri: "laugh", kwnakama: "surprise", mtoogoe: "surprise",
  bssoto: "think", bsatsumaru: "think",
  kntsukerareta: "laugh", knadana: "think", kniyadatta: "shy", kndameda: "surprise",
  // 場面ごとの アニメ（INTRO）で、しつもんの まえに ？を 出して いた もの
  bgnomimono: "think", bgkochira: "think", kpjanken: "think", kpbetsuno: "think", bykusuri: "think", kgiken: "think", tinarabu: "think",
  ogkenban: "think", zknanio: "think", zkkataduke: "surprise", jthidari: "think", ftgenki: "think", gsmouichido: "think",
};
const Q_MUTE_X = new Set(["bgnomimono", "bgkochira", "kpjanken", "kpbetsuno", "bykusuri", "kgiken", "tinarabu", "ogkenban", "zknanio", "zkkataduke", "jthidari", "ftgenki", "gsmouichido", "tdchigau"]);
SITS.forEach(s => { if (PRE_AN[s.id] && s.an) s.an = [PRE_AN[s.id], ...s.an.slice(1)]; });
let Q_MUTE = false;
{ const m0 = mark; mark = function (type, ...r) { if (Q_MUTE && type === "q") return; return m0(type, ...r); }; }
{ const th = MOVES.find(m => m.id === "think"); if (th) { const p0 = th.play; th.play = c => Q_MUTE ? MOVES.find(m => m.id === "look").play(c) : p0(c); } }
{ const pi = playIntro; playIntro = async function (s, h, a) { Q_MUTE = Q_MUTE_X.has(s.id); try { return await pi(s, h, a); } finally { later(900, () => { if (Q_MUTE && !CUR_Q) Q_MUTE = false; }); } }; }
let CUR_Q = false;
{ const aq = askQ; askQ = async function (s, h, a) { CUR_Q = true; Q_MUTE = false; try { await aq(s, h, a); } finally { CUR_Q = false; }
    const r = REACT_X[s.id]; if (!r || !h) return;
    if (r === "cry") { playMove(h, "sad"); tears(h, 2.2); later(400, () => markAbove(h, "drop", { dx: 90 })); await sleep(1300); }
    else { playMove(h, r); await sleep(r === "think" ? 900 : 700); } }; }
