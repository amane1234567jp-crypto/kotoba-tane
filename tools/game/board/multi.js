/* ================= みんなで あそぶ（2〜6人・人どうしで きょうそう） =================
   CPUの ライバルは 出ない。順番に サイコロを ふって、止まった マスの 場面に それぞれ こたえる。
   レベルは 人ごと（はじめは 1）。ひとりで あそぶ ときの レベル・セーブには 影響しない。 */
const MULTI_KINDS = ["shima", "pyon", "mii", "chu", "gao", "meebaa"];
const MULTI_OFF = [[-38, -4], [-12, -4], [14, -4], [40, -4], [-24, -34], [26, -34]];
let soloE = null, lastMulti = null;
function setupMulti(n) {
  MODE = "multi"; soloE = soloE || { ...E };
  PLAYERS = MULTI_KINDS.slice(0, n).map((kind, idx) => {
    const pc = piece(kind); pc.human = true; pc.off = MULTI_OFF[idx]; pc.s0 = PIECE_S[kind] || .21; delete pc.tm.closed;
    const pl = { kind, idx, pc, E: { L: 1, h: 1, streak: 0 }, ok: 0 }; pc.player = pl; return pl; });
  BOARD_PIECES = [P.doshin, ...PLAYERS.map(p => p.pc)];
  PLAYERS.forEach(p => setPiece(p.pc, "0"));
}
function endMultiState() { // ひとりで あそぶ 形に もどす
  PLAYERS.forEach(p => { delete p.pc.off; delete p.pc.player; if (p.pc !== P.shima) p.pc.human = false; });
  P.shima.human = true; PLAYERS = []; MODE = "solo";
  if (soloE) { Object.assign(E, soloE); soloE = null; }
  BOARD_PIECES = [P.doshin, P.shima, P.gao];
}
async function runMulti() {
  setTurn(PLAYERS[0].kind, 0); turnT.textContent = "みんなで！";
  await showBanner("みんなで きょうそう！", 1500);
  PLAYERS.forEach((p, i) => later(i * 160, () => jump(p.pc, .8)));
  await speak(C.pony, "p_multi", "みんなで きょうそうだよ。さきに ゴールに ついた ひとが かち！");
  let first = true;
  while (!winner) {
    for (const pl of PLAYERS) { await multiTurn(pl, first); first = false; if (winner) break; }
  }
  await sleep(500); await endingMulti();
}
async function multiTurn(pl, first) {
  setTurn(pl.kind, pl.idx); Object.assign(E, pl.E); showEngine(null, `${NAMES[pl.kind]}の ばん`);
  markAbove(pl.pc, "ex"); jump(pl.pc, .6); await sleep(300);
  await speak(C.pony, `p_turn_${pl.kind}`, `${NAMES[pl.kind]}の ばんだよ`);
  if (first) await speak(C.pony, "roll", "サイコロを ふってね");
  await waitDice(); const v = await rollDice();
  await speak(C.pony, "n" + v, NUMS[v]);
  await moveBy(pl.pc, v); await sleep(250);
  await landChild(pl.pc);
  pl.E = { ...E };
}
async function endingMulti() {
  const w = winnerPc, wk = w ? w.kind : "shima";
  flash(); fanfare(); const title = slam("ゴール！！", 470, 210); cannon(60, 1); cannon(1540, -1);
  joy(w); await sleep(700); await speak(C.pony, "goal", "ゴール！"); await sleep(500); title.remove();
  setView("parade"); rays(); flash();
  visible.forEach((c, i) => later(i * 110, () => jump(c, .9)));
  [[400, 260, 0], [1200, 220, 1], [800, 160, 2]].forEach(([x, y, h], i) => later(300 + i * 650, () => firework(x, y, h)));
  crownOn(C[wk]); await showBanner(`${NAMES[wk]}の かち！`, 1600);
  await speak(C.pony, "p_win", "かったね！ おめでとう！");
  const card = el("g", {}, hudLayer);
  const rows = PLAYERS.slice().sort((a, b) => (b.pc === w) - (a.pc === w) || b.ok - a.ok);
  el("rect", { x: 560, y: 110, width: 980, height: 90 + rows.length * 66, rx: 34, fill: "#FFFFFF", ...S6(8), opacity: .95 }, card);
  rows.forEach((p, i) => { const t = txt(card, 610, 180 + i * 66, `${p.pc === w ? "👑 " : ""}${NAMES[p.kind]}　いえた ${p.ok}こ　レベル ${p.E.L}`, 42, { stroke: "#FFFFFF", "stroke-width": 8, "paint-order": "stroke" }); t.setAttribute("opacity", 0); later(i * 250, () => { t.setAttribute("opacity", 1); blip(700 + i * 90, 900, .1, "square"); }); });
  playLog({ type: "goal", winner: NAMES[wk], multi: PLAYERS.length, stage: curStage });
  await sleep(600 + rows.length * 250);
  const again = document.createElement("button"); again.type = "button"; again.className = "again"; again.textContent = "もういっかい";
  again.style.left = "30%"; again.style.top = "74%"; stage.appendChild(again);
  const toMenu = document.createElement("button"); toMenu.type = "button"; toMenu.className = "again menuBtn"; toMenu.textContent = "メニュー";
  toMenu.style.left = "70%"; toMenu.style.top = "74%"; stage.appendChild(toMenu);
  const n = PLAYERS.length, st = curStage;
  again.onclick = () => { again.remove(); toMenu.remove(); card.remove(); endMultiState(); newGame({ stage: st, multi: n }); };
  toMenu.onclick = () => { again.remove(); toMenu.remove(); card.remove(); endMultiState(); applyStage(curStage); setView("board"); showMenu(); };
}
/* ---------- メニュー：みんなで あそぶ ---------- */
function showMultiMenu() {
  const box = document.getElementById("startBox"); box.innerHTML = ""; box.className = "start menu";
  const h = (tag, cls, t) => { const e = document.createElement(tag); if (cls) e.className = cls; if (t != null) e.textContent = t; return e; };
  const card = h("div", "mcard"); card.append(h("div", "mtitle", "みんなで あそぶ"));
  card.append(h("div", "mhead", "なんにんで あそぶ？"));
  const nums = h("div", "mnums"); let chosen = 0;
  const who = h("div", "mwho");
  const stages = h("div", "mstages"); stages.style.display = "none";
  const head2 = h("div", "mhead", "ステージを えらぶ"); head2.style.display = "none";
  for (let n = 2; n <= 6; n++) { const b = h("button", "mnum", `${n}にん`); b.type = "button";
    b.onclick = () => { chosen = n; nums.querySelectorAll(".mnum").forEach(x => x.classList.toggle("on", x === b));
      who.innerHTML = ""; MULTI_KINDS.slice(0, n).forEach((k, i) => { const c = h("span", "mchip", `${i + 1} ${NAMES[k]}`); c.style.background = TURN_COL[i]; who.append(c); });
      stages.style.display = ""; head2.style.display = ""; };
    nums.append(b); }
  STAGES.forEach((s, i) => { const b = h("button", "mst"); b.type = "button";
    b.append(h("span", "mno", String(i + 1)), h("span", "mico", s.icon), h("span", "mname", s.name), h("span", "mstat", "あそぶ"));
    b.onclick = () => { if (!chosen) return; boot(); box.remove(); newGame({ stage: s.id, multi: chosen }); }; stages.append(b); });
  const back = h("button", "mreset", "← もどる"); back.type = "button"; back.onclick = () => showMenu();
  card.append(nums, who, head2, stages, back); box.append(card);
}
(function multiStyle() {
  const st = document.createElement("style");
  st.textContent = `.mnums{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.start.menu .mnum{font:400 clamp(20px,3vw,30px) var(--display);padding:8px 22px;border-radius:999px;border:5px solid #2B2A33;background:#FFF3D6;box-shadow:0 5px 0 #2B2A33;cursor:pointer}
.start.menu .mnum.on{background:#7BD389}
.mwho{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;min-height:10px}
.mchip{font:400 clamp(14px,2vw,20px) var(--display);border:3px solid #2B2A33;border-radius:999px;padding:2px 12px}
.start.menu .mmulti{font:400 clamp(16px,2.2vw,22px) var(--display);padding:8px 24px;border-radius:999px;border:5px solid #2B2A33;background:#B9E3FF;box-shadow:0 5px 0 #2B2A33;cursor:pointer}`;
  document.head.appendChild(st);
})();
