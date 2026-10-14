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
  CUR_PL = pl; setTurn(pl.kind, pl.idx); Object.assign(E, pl.E); showEngine(null, `${NAMES[pl.kind]}の ばん`);
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
  // 1) ドラムロール → ゴール！！
  drumroll(1.1); joy(w); later(300, () => joy(w)); markAbove(w, "sparkle"); await sleep(1100);
  flash(); fanfare(); shake(700, 30); const title = slam("ゴール！！", 470, 230); cannon(60, 1, 80); cannon(1540, -1, 80);
  await sleep(700); await speak(C.pony, "goal", "ゴール！"); await sleep(400); title.remove();
  // 2) お祝いの ステージ：ひょうしょうだい
  setView("parade"); visible.slice().forEach(c => { if (c !== C.pony && !PLAYERS.some(p => p.kind === c.kind)) { c.root.style.display = "none"; visible.splice(visible.indexOf(c), 1); } });
  rays(); flash(); victoryBGM();
  const rank = PLAYERS.slice().sort((a, b) => (b.pc === w) - (a.pc === w) || distToGoal(a.pc.node) - distToGoal(b.pc.node));
  const pod = el("g", {}, sceneLayer), POD = [[800, 230, "#FFD25E"], [530, 150, "#D9DEE8"], [1070, 100, "#E8A86B"]];
  POD.forEach(([x, hgt, col], i) => { if (!rank[i]) return; el("rect", { x: x - 130, y: 975 - hgt, width: 260, height: hgt + 30, rx: 12, fill: col, ...S6(7) }, pod); txt(pod, x, 975 - hgt + 90, String(i + 1), 80, { "text-anchor": "middle", fill: "#FFFFFF", stroke: INK, "stroke-width": 8, "paint-order": "stroke" }); });
  const side = [[220, 975], [1380, 975], [1520, 975]];
  rank.forEach((p, i) => { const c = C[p.kind], ks = (KID_S[p.kind] || .8); if (i < 3) place(c, POD[i][0], 975 - POD[i][1], ks * (i ? .7 : .85)); else place(c, side[i - 3][0], side[i - 3][1], ks * .6); c.dx.v = 0; c.dx.t = 0; });
  place(C.pony, 90, 985, .4);
  balloons(14);
  for (let i = 0; i < 12; i++) later(200 + i * 650, () => firework(250 + rnd(1100), 140 + rnd(220), i));
  later(2500, () => { cannon(60, 1, 50); cannon(1540, -1, 50); }); later(6000, () => { cannon(60, 1, 50); cannon(1540, -1, 50); });
  visible.forEach((c, i) => later(i * 110, () => jump(c, .9)));
  later(1800, () => rank.slice(1).forEach((p, i) => later(i * 120, () => hold(C[p.kind], "clap", 3))));
  crownOn(C[wk]); later(1400, () => { joy(C[wk]); markAbove(C[wk], "sparkle"); });
  const big = slam(`${NAMES[wk]}の かち！！`, 330, 150, "#FF8FA3"); rainbow(big);
  await speak(C.pony, `mw_${wk}`, `${NAMES[wk]}の かち！ おめでとう！`);
  later(400, () => playMove(C[wk], "dance")); await sleep(2600); big.remove();
  const card = el("g", {}, hudLayer);
  const rows = PLAYERS.slice().sort((a, b) => (b.pc === w) - (a.pc === w) || b.ok - a.ok);
  el("rect", { x: 560, y: 110, width: 980, height: 90 + rows.length * 66, rx: 34, fill: "#FFFFFF", ...S6(8), opacity: .95 }, card);
  rows.forEach((p, i) => { const t = txt(card, 610, 180 + i * 66, `${p.pc === w ? "👑 " : ""}${NAMES[p.kind]}　たね ${p.ok}こ`, 42, { stroke: "#FFFFFF", "stroke-width": 8, "paint-order": "stroke" }); t.setAttribute("opacity", 0); later(i * 250, () => { t.setAttribute("opacity", 1); blip(700 + i * 90, 900, .1, "square"); }); });
  playLog({ type: "goal", winner: NAMES[wk], multi: PLAYERS.length, stage: curStage });
  await sleep(1800 + rows.length * 250);
  card.remove(); await forestScene(PLAYERS.reduce((a, p) => a + p.ok, 0), PLAYERS.map(p => p.kind));
  const again = document.createElement("button"); again.type = "button"; again.className = "again"; again.textContent = "もういっかい";
  again.style.left = "40%"; again.style.top = "38%"; stage.appendChild(again);
  const toMenu = document.createElement("button"); toMenu.type = "button"; toMenu.className = "again menuBtn"; toMenu.textContent = "メニュー";
  toMenu.style.left = "70%"; toMenu.style.top = "38%"; stage.appendChild(toMenu);
  const n = PLAYERS.length, st = curStage;
  again.onclick = () => { again.remove(); toMenu.remove(); card.remove(); endMultiState(); newGame({ stage: st, multi: n }); };
  toMenu.onclick = () => { again.remove(); toMenu.remove(); card.remove(); endMultiState(); applyStage(curStage); setView("board"); showMenu(); };
}
/* ---------- ゴールの お祝い（BGM・ふうせん・にじいろの 文字） ---------- */
function drumroll(sec) { if (!ctx) return; const n = Math.round(sec * 22); for (let i = 0; i < n; i++) later(i * 1000 / 22, () => noise(.05, 1800, .12 + .25 * i / n)); later(sec * 1000, () => { noise(.4, 300, .7); boom(.6); }); }
function victoryBGM() {
  if (!ctx) return; const D6 = 1174.66, E6 = 1318.51, bpm = 152, beat = 60 / bpm * 1000;
  const mel = [[N.G5, .5], [N.G5, .5], [N.C6, 1], [N.G5, .5], [N.E5, .5], [N.C5, 1], [N.F5, .5], [N.A5, .5], [N.C6, 1], [N.B5, .5], [N.A5, .5], [N.G5, 1],
    [N.E5, .5], [N.G5, .5], [N.C6, 1], [D6, .5], [E6, .5], [D6, 1], [N.C6, .5], [N.G5, .5], [N.E5, .5], [N.G5, .5], [N.C6, 2]];
  const har = [[N.E5, 2], [N.C5, 2], [N.F5, 2], [N.D5, 2], [N.G5, 2], [N.B5, 2], [N.E5, 2], [N.E5, 2]];
  const bass = [[N.C4 / 2, 1], [N.C4, 1], [N.C4 / 2, 1], [N.C4, 1], [349.23 / 2, 1], [349.23 / 4, 1], [N.G4 / 2, 1], [N.G4 / 4, 1], [N.C4 / 2, 1], [N.C4, 1], [N.A4 / 2, 1], [N.A4 / 4, 1], [N.G4 / 2, 1], [N.G4 / 4, 1], [N.C4 / 2, 2]];
  for (let r = 0; r < 2; r++) later(r * 16 * beat, () => { tune(mel, bpm, "square", .06); tune(har, bpm, "triangle", .07); tune(bass, bpm, "triangle", .16);
    for (let b = 0; b < 16; b++) { later(b * beat, () => blip(150, 45, .14, "sine")); if (b % 2) later(b * beat, () => noise(.09, 2200, .22)); later(b * beat + beat / 2, () => noise(.03, 6000, .08)); } });
  later(32 * beat, () => { tune([[N.C5, .5], [N.E5, .5], [N.G5, .5], [N.C6, 2]], bpm, "square", .07); boom(.5); });
}
function balloons(n) { const cols = ["#FF6F91", "#FFD25E", "#7FCBF0", "#7CC36A", "#B9A8D9", "#FF9E5E"];
  for (let i = 0; i < n; i++) later(i * 280, () => { const g = el("g", {}, fxLayer), x = 120 + rnd(1360), sw = rnd(60) - 30, sp = 5 + rnd(30) / 10;
    el("path", { d: "M0 60 Q10 100 -6 150", fill: "none", ...S6(3) }, g); el("ellipse", { cx: 0, cy: 0, rx: 46, ry: 58, fill: cols[i % cols.length], ...S6(5) }, g); el("ellipse", { cx: -16, cy: -20, rx: 10, ry: 16, fill: "#FFFFFF", opacity: .6 }, g);
    tween(sp * 1000, k => g.setAttribute("transform", `translate(${(x + Math.sin(k * 6) * sw).toFixed(0)} ${(1100 - 1400 * k).toFixed(0)})`)).then(() => g.remove()); }); }
function rainbow(g) { const t = g.querySelector("text"); if (!t) return; const cols = ["#FF6F91", "#FF9E5E", "#FFD25E", "#7CC36A", "#7FCBF0", "#B9A8D9"]; let i = 0;
  addTick(() => { if (!g.isConnected) return false; i++; if (i % 6 === 0) t.setAttribute("fill", cols[(i / 6) % cols.length]); }); }
/* ---------- メニュー：みんなで あそぶ ---------- */
function showMultiMenu() {
  const box = document.getElementById("startBox"); box.innerHTML = ""; box.className = "start menu";
  const h = (tag, cls, t) => { const e = document.createElement(tag); if (cls) e.className = cls; if (t != null) e.textContent = t; return e; };
  const card = h("div", "mcard mmcard"); card.append(h("div", "mtitle", "みんなで あそぶ"));
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
  st.textContent = `.mmcard{width:min(96%,900px)}.mmcard .mstages{grid-template-columns:repeat(6,1fr);gap:8px}
.start.menu .mmcard .mst{padding:8px 2px 6px;gap:2px}.mmcard .mst .mico{font-size:clamp(24px,3.4vw,36px)}.mmcard .mst .mname{font-size:clamp(12px,1.5vw,15px)}.mmcard .mst .mstat{font-size:clamp(11px,1.3vw,13px)}
@media (max-width:760px){.mmcard .mstages{grid-template-columns:repeat(4,1fr)}}
.mnums{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.start.menu .mnum{font:400 clamp(20px,3vw,30px) var(--display);padding:8px 22px;border-radius:999px;border:5px solid #2B2A33;background:#FFF3D6;box-shadow:0 5px 0 #2B2A33;cursor:pointer}
.start.menu .mnum.on{background:#7BD389}
.mwho{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;min-height:10px}
.mchip{font:400 clamp(14px,2vw,20px) var(--display);border:3px solid #2B2A33;border-radius:999px;padding:2px 12px}
.start.menu .mmulti{font:400 clamp(16px,2.2vw,22px) var(--display);padding:8px 24px;border-radius:999px;border:5px solid #2B2A33;background:#B9E3FF;box-shadow:0 5px 0 #2B2A33;cursor:pointer}`;
  document.head.appendChild(st);
})();
