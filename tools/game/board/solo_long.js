/* ================= ロングコースを ひとりでも（2026-10-19） =================
   こども（まるシマ）＋ コンピューターの ライバル 1にんで、みんなで あそぶ しくみを つかう。
   ライバルは サイコロを じぶんで ふり、マスの 課題は みじかく「できた／ざんねん」で おわる（こどもの 時間を とらない）。
   レベルは ひとりで あそぶ ときの レベルを つかい、おわったら もどす。 */
let SOLO_LONG_ON = null;
const SOLO_LONGS = () => ["long", "ltomo", ...SL.filter(sid => !SL_HIDE.has(sid))];
function soloRival() {
  const bad = new Set([SLEEPER, (BLOCK_DEF[curStage] || {}).who, "shima"]);
  const pool = MULTI_KINDS.filter(k => !bad.has(k)); return pool[rnd(pool.length)] || "pyon";
}
function setupSoloLong() {
  MODE = "multi"; soloE = soloE || { ...E }; const rk = soloRival();
  PLAYERS = [["shima", 0], [rk, 1]].map(([kind, idx]) => {
    const pc = piece(kind); pc.human = idx === 0; pc.off = MULTI_OFF[idx]; pc.s0 = PIECE_S[kind] || .21; delete pc.tm.closed;
    const pl = { kind, idx, pc, E: idx ? { L: soloE.L, h: 1, streak: 0 } : { ...soloE }, ok: 0, cpu: idx === 1 }; pc.player = pl; return pl; });
  BOARD_PIECES = [P.doshin, ...PLAYERS.map(p => p.pc)];
  PLAYERS.forEach(p => setPiece(p.pc, "0"));
}
{ const sm = setupMulti; setupMulti = function (n) { if (SOLO_LONG_ON) return setupSoloLong(); return sm(n); }; }
// ひとりで あそんだ ぶんの レベルは、ひとりの レベルに のこす
{ const em = endMultiState; endMultiState = function () {
    const me = PLAYERS[0], cpu = PLAYERS[1] && PLAYERS[1].cpu;
    if (cpu && me && soloE) soloE = { ...soloE, L: me.E.L, streak: me.E.streak || 0 };
    return em(); }; }
{ const sv = saveMultiL; saveMultiL = function (k, L) { if (PLAYERS[1] && PLAYERS[1].cpu) return; return sv(k, L); }; }
// コンピューターの ばんは、サイコロを じぶんで ふる
{ const wd = waitDice; waitDice = function () { if (MODE === "multi" && CUR_PL && CUR_PL.cpu) return sleep(700); return wd(); }; }
// コンピューターが マスに とまったら：みじかく けっか だけ
async function cpuTask(pc) {
  const pl = pc.player, t = (LONG_TASKS[curStage] || {})[pc.node]; const ic = t && LTASK[t] ? LTASK[t][1] : "❓";
  const g = el("g", {}, hudLayer); el("rect", { x: 500, y: 300, width: 600, height: 300, rx: 40, fill: "#FFFFFFEE", ...S6(7) }, g);
  txt(g, 800, 380, `${NAMES[pc.kind]}の ちょうせん`, 46, { "text-anchor": "middle" }); txt(g, 680, 530, ic, 110, { "text-anchor": "middle" });
  const q = txt(g, 920, 540, "…", 120, { "text-anchor": "middle" });
  markAbove(pc, "ex"); jump(pc, .6); await speak(C.pony, "s1_cpu", "できるかな？");
  for (let i = 0; i < 6; i++) { q.textContent = ["…", "？", "…", "！"][i % 4]; blip(500 + i * 70, 600, .05, "square"); await sleep(220); }
  const ok = rnd(100) < 50; q.textContent = ok ? "⭕" : "❌"; if (ok) { chime(); markAbove(pc, "sparkle"); } else noise(.2, 400, .4);
  await sleep(500);
  if (ok) { pl.ok++; await speak(C.pony, "s1_cpu_ok", "できた！ 1マス すすむよ"); g.remove(); if (isSL()) await slGo(pc, 1); else await forceStep(pc, 1); }
  else { await speak(C.pony, "s1_cpu_ng", "ざんねん！ そのままだよ"); g.remove(); }
  playLog({ type: "cpu", task: t || "", ok, who: NAMES[pc.kind] });
}
{ const lc = landChild; landChild = async function (pc = P.shima) {
    if (!(pc.player && pc.player.cpu)) return lc(pc);
    if (pc.player.stay) { pc.player.stay = 0; return; }
    if (winner || !(LONG_TASKS[curStage] || {})[pc.node]) return;
    return cpuTask(pc); }; }
// つっこみマスは こえで こたえるので、コンピューターは みじかく
{ const be = boardEvent; boardEvent = async function (pc) {
    if (pc.player && pc.player.cpu && EVENTS[curStage] && (EVENTS[curStage][pc.node] || [])[0] === "tsukkomi" && !(pc.player.stay)) { await sleep(300); return cpuTask(pc); }
    return be(pc); }; }
// はじまり と おわり
async function runSoloLong() {
  const rv = PLAYERS[1]; setTurn("shima", 0); turnT.textContent = "ひとりで！";
  await showBanner(`${NAMES[rv.kind]}と きょうそう！`, 1500);
  PLAYERS.forEach((p, i) => later(i * 160, () => jump(p.pc, .8)));
  await speak(C.pony, `s1_vs_${rv.kind}`, `${NAMES[rv.kind]}と きょうそうだよ。さきに ゴールに ついた ほうが かち！`);
  let first = true;
  while (!winner) { for (const pl of PLAYERS) { await multiTurn(pl, first && !pl.cpu); if (!pl.cpu) first = false; if (winner) break; } }
  await sleep(500); const st = curStage; await endingMulti();
  const again = [...document.querySelectorAll(".again")].find(b => !b.classList.contains("menuBtn"));
  if (again) again.onclick = () => { document.querySelectorAll(".again").forEach(b => b.remove()); endMultiState(); newGame({ stage: st, soloLong: true }); };
}
{ const rm = runMulti; runMulti = function () { return SOLO_LONG_ON ? runSoloLong() : rm(); }; }
{ const ng = newGame; newGame = function (opt = {}) { SOLO_LONG_ON = opt.soloLong ? opt.stage : null; return ng(opt.soloLong ? { ...opt, multi: 2 } : opt); }; }
// メニュー：ひとりで あそぶ ロングコース
function soloLongInfo(sid) { // メニューでは みじかい なまえ（1ぎょう）
  const N = { long: ["🗺️", "だいぼうけん"], ltomo: ["🤝", "ともだち"] }; if (N[sid]) return N[sid];
  const T = SL_TH[sid]; return [T.icon, T.name.replace(/の? ?だいぼうけん/, "").replace("の くに", "").replace(/の$/, "").trim()];
}
{ const sm = showMenu; showMenu = function () {
    sm(); const card = document.querySelector("#startBox .mcard"); if (!card) return;
    const list = card.querySelector(".mstages"); if (!list) return; list.classList.add("mwide");
    SOLO_LONGS().forEach(sid => { const [ic, nm] = soloLongInfo(sid); const b = document.createElement("button"); b.type = "button"; b.className = "mst mlong mslong";
      b.innerHTML = `<span class="mno">★</span><span class="mico">${ic}</span><span class="mname">${nm}</span><span class="mstat">ロング</span>`;
      b.onclick = () => { if (SAVE.play && !confirm("とちゅうの きろくは きえるよ。はじめから あそぶ？")) return; SAVE.play = null; saveNow(); boot(); document.getElementById("startBox").remove(); newGame({ stage: sid, soloLong: true }); };
      list.append(b); });
  }; }
if (document.getElementById("startBox")) showMenu();
(function () { const s = document.createElement("style"); s.textContent = `.start.menu .mcard .mstages.mwide{grid-template-columns:repeat(13,minmax(0,1fr))}.start.menu .mcard{width:min(96%,1180px)}@media (max-aspect-ratio: 1/1){.start.menu .mcard .mstages.mwide{gap:4px}.start.menu .mcard .mmulti{padding:4px 18px;font-size:clamp(14px,2vw,20px)}.start.menu .mcard .mlap{padding:0 14px}}.start.menu .mst.mslong .mname{font-size:clamp(9px,1.1vw,13px);line-height:1.1}`; document.head.appendChild(s); })();
// マスの 課題で もし エラーが おきても、ゲームが とまらない ように（盤に もどって つづける）
{ const lc = landChild; landChild = async function (pc = P.shima) { try { return await lc(pc); } catch (e) { console.error(e); try { clearClones(); hideTask(); } catch (_) { } setView("board"); } }; }
// スマホ（たての せまい がめん）：メニューは がめん いっぱいに ひろげて、4れつで スクロール
(function () { const s = document.createElement("style"); s.textContent = `@media (max-width:700px),(max-height:520px){
.start.menu{position:fixed!important;inset:0!important;z-index:50!important;overflow-y:auto!important;background:#FFF8E1!important;padding:8px 8px 28px!important;display:block!important}
.start.menu .mhero{margin:4px auto 8px!important}.start.menu .mcard,.start.menu .mmcard{width:100%!important;box-sizing:border-box;padding:10px 8px!important;border-radius:22px!important;margin:0 auto;max-height:none!important;overflow:visible!important}
.start.menu .mcard .mstages,.start.menu .mcard .mstages.mwide,.start.menu .mmcard .mstages{grid-template-columns:repeat(auto-fill,minmax(80px,1fr))!important;gap:8px!important;width:100%}
.start.menu .mcard .mst{padding:6px 2px!important;min-height:88px}.start.menu .mcard .mst .mico{font-size:30px!important}.start.menu .mcard .mst .mname{font-size:13px!important;line-height:1.15}
.start.menu .mcard .mst .mstat{display:inline-block!important;font-size:11px!important}.start.menu .mcard .mst .mno{font-size:13px!important}.start.menu .mmcard .mnum{font-size:18px!important;padding:6px 14px!important}.start.menu .mmcard .mst .mname{font-size:11px!important}.start.menu .mmcard .mst .mstat{font-size:9px!important;padding:0 3px!important}}`; document.head.appendChild(s); })();
