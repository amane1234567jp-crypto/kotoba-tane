/* ================= みんなで あそぶ 専用「ともだちの だいぼうけん」（ステージ ltomo・2026-10-14） =================
   ともだちづきあいで いる ことばの ロングコース。サイコロ 1〜6。盤：こうえん → ともだちの いえ → おまつり → かえりみち。
   マスの 課題：💬 かいわ（だいぼうけんと 同じ）／🗣 いってみよう（読み上げ場面。台本 sit/sits_new3.py）／💗 やさしく いうと？／🔁 つなげよう
   課題の データは sit/ltomo_tasks.py → board/ltomo_data.js（LONG_T）。声：lk_f*・lk_y*・lk_n*・lt_*（packs/ltomo.json）
   場面の 相手は コマに ならない キャラ（くまた・とらお・どしん・こん・どしんの パパ・のっぽせんせい・かめじい）。 */
LONGS.add("ltomo"); LDATA.ltomo = LONG_T;
Object.assign(KID_S, { doshinpapa: 1.12, nobbo: .95, kamejii: .86 });

/* ---------- 盤 ---------- */
{ const n = {}, pl = {}, nx = {}; const R1 = 912, R2 = 748, R3 = 584, R4 = 420, R5 = 268, X = [180, 325, 470, 615, 760, 905, 1050, 1195, 1340, 1470];
  const wob = (i, r) => Math.round(Math.sin(i * 1.15 + r) * 16);
  const put = (id, x, y, place, kind) => { n[id] = kind ? [x, y, kind] : [x, y]; pl[id] = place; };
  ["0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9"].forEach((id, i) => put(id, X[i], R1 + wob(i, 0), "こうえん"));
  ["b0", "b1", "4", "b3", "b4", "b5", "b6", "b7", "b8", "b9"].forEach((id, i) => put(id, X[9 - i], R2 + wob(i, 1), "ともだちの いえ"));
  ["c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9"].forEach((id, i) => put(id, X[i], R3 + wob(i, 2), "おまつり"));
  ["d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7"].forEach((id, i) => put(id, X[9 - i], R4 + wob(i, 3), "かえりみち"));
  [["e0", 520], ["e1", 665], ["e2", 810], ["e3", 955], ["e4", 1100]].forEach(([id, x], i) => put(id, x, R5 + wob(i, 4), "かえりみち"));
  put("15", 1265, 290, "かえりみち", "goal"); n["0"].push("start"); n["4"].push("block");
  put("s1", 1125, 830, "こうえん"); put("s2", 545, 666, "ともだちの いえ"); put("m1", 985, 502, "おまつり"); put("s4", 690, 344, "かえりみち");
  linkLine(nx, ["0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "b0", "b1", "4", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9",
    "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "e0", "e1", "e2", "e3", "e4", "15"]);
  linkLine(nx, ["a6", "s1", "b3"]); linkLine(nx, ["b6", "s2", "c2"]); linkLine(nx, ["c5", "m1", "d4"]); linkLine(nx, ["d5", "s4", "e1"]);
  BOARD.ltomo = { nodes: n, place: pl, next: nx, away: [1520, 640], style: (a, b) => ["s1", "s2", "m1", "s4"].includes(a) || ["s1", "s2", "m1", "s4"].includes(b) ? "alley" : "park",
    labels: [["こうえん", 330, 995], ["ともだちの いえ", 1330, 676], ["おまつり", 330, 512], ["かえりみち", 1420, 348]] }; }
STAGE_DEF.ltomo = { ground: "#BFE3A6", sky: "#CFEAFB", names: STAGE_DEF.undou.names, fills: { こうえん: "#D7F0D2", "ともだちの いえ": "#FFE0EE", おまつり: "#FFE3B3", かえりみち: "#D7ECFF" } };
RIVAL_OF.ltomo = "gao"; SLEEPER_OF.ltomo = "tora";
BLOCK_DEF.ltomo = { who: "tora", sleep: false, intro: ["lt_blk_intro", "とらおくんが みちの まんなかで あそんでる！"], say: ["lt_blk_say", "とらおくん、ちょっと とおしてね"], to: "とらおくんに いおう",
  keys: [["とらお"], ["とおして", "通して", "とうして"]], res: ["lt_blk_res", "あ、わりい！ どうぞ"] };
Object.assign(LTASK, { yasashiku: ["#FFC9DA", "💗"], tsunagu: ["#C9E6FF", "🔁"] });
LONG_TASKS.ltomo = {};
LEGENDS.ltomo = [["kaiwa", "かいわ"], ["scene", "いってみよう"], ["yasashiku", "やさしく いうと？"], ["tsunagu", "つなげよう"]];
EVENTS.ltomo = {
  a3: ["warp", "b6", "lt_ev_warp1", "ひみつの ちかみち！ ずっと さきまで いけるよ"],
  a8: ["fwd", 2, "lt_ev_te", "ともだちが てを ひいて くれた！ 2マス すすむよ"],
  b1: ["back", 2, "lt_ev_wasure", "わすれものを とりに もどる。2マス もどるよ"],
  b4: ["rest", 0, "lt_ev_maigo", "まいごの こを いっしょに さがして あげた。つぎは 1かい やすみだよ"],
  b8: ["trolley", 3, "lt_ev_tsunagu", "みんなで てを つないで すすもう！ ちかくの ひとも いっしょに 3マス すすむよ"],
  c0: ["again", 0, "lt_ev_atarashii", "あたらしい ともだちが できた！ もう いっかい サイコロを ふれるよ"],
  c3: ["swap", 0, "lt_ev_mikoshi", "おみこしが きた！ いちばん まえの ひとと いれかわるよ"],
  c7: ["call", 0, "lt_ev_oide", "おーい、いっしょに いこう！ いちばん うしろの ひとを ここまで よびよせるよ"],
  c8: ["warp", "c1", "lt_ev_mayou", "ひとごみで みちに まよった！ うしろに もどされるよ"],
  m1: ["rest", 0, "lt_ev_hanabi", "はなびに みとれちゃった！ つぎは 1かい やすみだよ"],
  d2: ["warp", "e2", "lt_ev_warp3", "ひみつの ちかみち！ ゴールの ちかくまで いけるよ"],
  d6: ["fwd", 2, "lt_ev_oikaze", "ともだちと かけっこ！ 2マス すすむよ"],
  e3: ["back", 2, "lt_ev_koronda", "ころんじゃった！ 2マス もどるよ"],
};
{ const order = ["scene", "kaiwa", "yasashiku", "scene", "tsunagu", "kaiwa", "scene", "yasashiku", "tsunagu", "scene", "kaiwa", "scene", "tsunagu", "yasashiku"]; let i = 0;
  Object.keys(BOARD.ltomo.nodes).forEach(id => { if (["0", "4", "15"].includes(id) || EVENTS.ltomo[id]) return; LONG_TASKS.ltomo[id] = order[i++ % order.length]; }); }
BOARD_BG.ltomo = function (L) {
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#9FD9F2" }, L);
  el("path", { d: "M110 985 Q30 820 105 640 Q55 420 195 300 Q330 175 560 195 Q900 150 1240 205 Q1525 235 1565 425 Q1595 645 1545 825 Q1505 990 1300 990 Z", fill: "#BFE3A6", ...S6(6) }, L);
  // ちょうちんの ひも（おまつり）
  el("path", { d: "M120 470 Q560 520 1000 470 T1560 470", fill: "none", stroke: INK, "stroke-width": 4 }, L);
  for (let x = 170; x < 1540; x += 120) { const y = 470 + Math.sin((x - 120) / 1440 * Math.PI * 2) * 18 + 22; el("ellipse", { cx: x, cy: y, rx: 16, ry: 20, fill: ["#FF6F61", "#FFD25E"][(x / 120 | 0) % 2], ...S6(3) }, L); }
  [[330, 905, "🛝"], [1535, 760, "🏡"], [150, 600, "🏮"], [1535, 330, "🌇"], [610, 520, "🎆"], [1310, 520, "🍡"], [760, 180, "☁️"], [1395, 985, "🌳"], [80, 985, "🌷"], [430, 360, "🎈"], [1060, 470, "🎪"], [240, 220, "🐦"]]
    .forEach(([x, y, e]) => txt(L, x, y, e, 66, { "text-anchor": "middle", opacity: .9 }));
  Object.entries(EVENTS.ltomo).forEach(([id, [type, to]]) => { if (type !== "warp") return; const [x1, y1] = NODES[id], [x2, y2] = NODES[to];
    el("path", { d: `M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 160} ${x2} ${y2}`, fill: "none", stroke: "#E8735A", "stroke-width": 6, "stroke-dasharray": "16 14", opacity: .7 }, L); });
};
// メニュー：みんなで あそぶ に ボタン（だいぼうけんの となり）
{ const smm = showMultiMenu; showMultiMenu = function () {
    smm(); const st = document.querySelector(".mstages"); if (!st) return;
    const b = document.createElement("button"); b.type = "button"; b.className = "mst mlong mtomo";
    b.innerHTML = '<span class="mno">★</span><span class="mico">🤝</span><span class="mname">ともだちの<br>だいぼうけん</span><span class="mstat">ロングコース</span>';
    b.onclick = () => { const on = document.querySelector(".mnum.on"); if (!on) return; const n = parseInt(on.textContent, 10); boot(); document.getElementById("startBox").remove(); newGame({ stage: "ltomo", multi: n }); };
    const lg = st.querySelector(".mlong"); lg ? lg.after(b) : st.prepend(b);
  }; }
(function () { const s = document.createElement("style"); s.textContent = `.start.menu .mst.mtomo{background:#FFE0EE;border-color:#E86A9A}.start.menu .mst.mtomo .mname{font-size:clamp(10px,1.2vw,14px);line-height:1.1}.start.menu .mmcard .mstages{grid-template-columns:repeat(8,minmax(0,1fr))!important}.start.menu .mmcard .mst .mname{white-space:normal;word-break:keep-all;font-size:clamp(9px,1.06vw,12.5px);letter-spacing:-.06em}.start.menu .mmcard .mst{padding-left:1px!important;padding-right:1px!important}.start.menu .mmcard .mst .mstat{font-size:clamp(9px,1.05vw,12px);padding:2px 6px;letter-spacing:-.04em}.start.menu .mmcard .mstages{gap:6px}`; document.head.appendChild(s); })();

/* ---------- 💗 やさしく いうと？ ---------- */
async function lkYasashiku(pc) {
  const it = pickL("yasashiku"); const g = panel("やさしく いうと？", "#FFF0F5");
  txt(g, 800, 255, it.e, 120, { "text-anchor": "middle" }); txt(g, 800, 360, it.q, it.q.length > 18 ? 46 : 54, { "text-anchor": "middle" });
  const opts = shuffle([{ t: it.ok, ok: true }, { t: it.ng, ok: false }]);
  const cards = opts.map((o, i) => card(g, 150 + i * 670, 450, 630, 250, o.t, o.ok ? "💗" : "💢", { fs: 56, es: 90 }));
  // どっちが やさしいか まだ 見えないように、しるしは あとで 出す
  cards.forEach(c => { const e = c.childNodes[1]; if (e) e.setAttribute("opacity", 0); });
  await speak(C.pony, `lk_${it.id}_q`, `${it.q}。やさしい いいかたは どっちかな？`);
  await speak(C.pony, "lt_yasa_say", "やさしい ほうを、こえに だして よんでね");
  let pick = -1; for (let n = 0; n < 2 && pick < 0; n++) { pick = await sayChoice(pc, opts.map(o => o.t), cards); if (pick < 0 && n === 0) await speak(C.pony, "p_again", "もう いっかい いってみよう"); }
  if (pick < 0) pick = await tapOnce(cards);
  cards.forEach(c => { const e = c.childNodes[1]; if (e) tween(300, k => e.setAttribute("opacity", k)); });
  const ok = opts[pick].ok, okIdx = opts.findIndex(o => o.ok); flashCard(cards[pick], ok);
  if (ok) { confetti(40); chime(); await speak(C.pony, "lt_yasa_ok", "やさしい いいかただね！ ともだちも うれしいね"); }
  else { await sleep(500); flashCard(cards[okIdx], true); await speak(C.pony, `lk_${it.id}_a`, `${it.ok}、と いうと、ともだちが うれしいね`); }
  grade(ok); playLog({ type: "yasashiku", id: it.id, ok, who: NAMES[pc.kind] });
  await sleep(400); g.remove(); await moveAfter(pc, ok ? 1 : 0); return ok;
}
/* ---------- 🔁 つなげよう ---------- */
async function lkTsunagu(pc) {
  const it = pickL("tsunagu", x => x.who !== pc.kind);
  const s = { id: "lk_" + it.id, place: zoneOf(pc.node), asker: ["kamejii", "nobbo", "meebaa"].find(k => k !== it.who && k !== pc.kind), cast: [it.who], intro: "kaiwa", talk: [[it.who, it.t]] };
  STORY_POS[s.id] = [1180];
  const { hero: h } = setSitView(s, pc.kind); const f = STORY_CAST[it.who]; f.dx.v = f.dx.t = 0; await sleep(600);
  playMove(f, "point"); await speak(f, `lk_${it.id}_t`, it.t); playMove(h, "think");
  const opts = shuffle([{ t: it.ok, ok: true }, ...it.ng.map(t => ({ t, ok: false }))]);
  const g = el("g", {}, hudLayer); el("rect", { x: 60, y: 108, width: 1480, height: 450, rx: 34, fill: "#FFFFFFEE", ...S6(6) }, g);
  txt(g, 800, 162, "なんて へんじ したら、おはなしが つづくかな？", 42, { "text-anchor": "middle" });
  const cards = opts.map((o, i) => card(g, 120, 186 + i * 120, 1360, 108, o.t, ["🅰️", "🅱️", "🅲"][i] || null, { fs: 54, es: 64 }));
  await speak(C.pony, "lt_tsuna_ask", "なんて へんじ したら、おはなしが つづくかな？ カードを こえに だして よんでね");
  let pick = -1; for (let n = 0; n < 2 && pick < 0; n++) { pick = await sayChoice(h, opts.map(o => o.t), cards); if (pick < 0 && n === 0) await speak(C.pony, "p_again", "もう いっかい いってみよう"); }
  const okIdx = opts.findIndex(o => o.ok); let ok = false;
  if (pick >= 0 && opts[pick].ok) { ok = true; flashCard(cards[pick], true); confetti(40); chime(); playMove(h, "nod"); await speak(C.pony, "lk_seikai", "せいかい！"); }
  else { if (pick >= 0) { flashCard(cards[pick], false); playMove(f, "sad"); await sleep(600); } flashCard(cards[okIdx], true); await speak(C.pony, `lk_${it.id}_a`, `${it.ok}、って いうと、おはなしが つづくね`); }
  g.remove(); if (ok) { joy(f); await speak(f, `lk_${it.id}_r`, it.r); playMove(h, "laugh"); } else { f.headY.t = 0; playMove(f, "nod"); await sleep(600); }
  grade(ok); playLog({ type: "tsunagu", id: it.id, ok, picked: pick >= 0 ? opts[pick].t : "", who: NAMES[pc.kind] });
  await sleep(500); setView("board"); await moveAfter(pc, ok ? 1 : 0); return ok;
}
Object.assign(LTASK_RUN, { yasashiku: lkYasashiku, tsunagu: lkTsunagu });
// かいわの 動き（せりふと あわせる）
Object.assign(LK_MOVE, {
  fasobu: ["wave", "point", "pump"], fhajimete: ["look", "point", "wave"], fkaeru: ["look", "nod", "wave"], fochita: ["look", "point", "nod"], fitai: ["!hurt", "surprise", "!up"],
  fojama: ["wave", "wave", "nod"], foyatsu: ["nod", "clap", "nod"], fkaeri: ["point", "sad", "wave"], fgemu: ["point", "sad", "nod"], fpresent: ["point", "heart", "banzai"],
  fyatai: ["think", "point", "pump"], fhanabi: ["point", "surprise", "banzai"], fhagure: ["sad", "think", "nod"], fbutsukaru: ["surprise", "point", "nod"], fkingyo: ["pump", "clap", "shy"],
  fame: ["look", "sad", "banzai"], fwasure: ["surprise", "think", "nod"], fmata: ["point", "nod", "wave"], fshukudai: ["think", "think", "nod"], ftsukareta: ["sad", "look", "shy"],
});

/* ---------- 場面の へや ---------- */
function matsuriRoom(L) {
  const sky = el("linearGradient", { id: "mtsky", x1: 0, y1: 0, x2: 0, y2: 1 }, el("defs", {}, L)); el("stop", { offset: 0, "stop-color": "#4A4E8C" }, sky); el("stop", { offset: 1, "stop-color": "#F6A77A" }, sky);
  el("rect", { x: 0, y: 0, width: 1600, height: 760, fill: "url(#mtsky)" }, L);
  [[180, 90], [520, 60], [980, 110], [1380, 70], [1250, 160], [700, 150]].forEach(([x, y]) => el("circle", { cx: x, cy: y, r: 4, fill: "#FFF6C8" }, L));
  // やたい
  [[60, "#FF6F61", "わたあめ"], [560, "#4FA35A", "きんぎょ"], [1060, "#3E7FD6", "ヨーヨー"]].forEach(([x, col, name]) => {
    el("rect", { x, y: 360, width: 480, height: 400, fill: "#C98A4B", ...S6(6) }, L);
    for (let i = 0; i < 6; i++) el("path", { d: `M${x + i * 80} 300 h80 v70 q-40 30 -80 0 z`, fill: i % 2 ? "#FFFFFF" : col, ...S6(5) }, L);
    el("rect", { x: x + 90, y: 400, width: 300, height: 80, rx: 12, fill: "#FFF6E0", ...S6(5) }, L); txt(L, x + 240, 456, name, 44, { "text-anchor": "middle" });
    el("rect", { x: x - 10, y: 600, width: 500, height: 40, rx: 8, fill: "#9A6A3E", ...S6(5) }, L); });
  el("path", { d: "M0 230 Q400 290 800 230 T1600 230", fill: "none", stroke: INK, "stroke-width": 4 }, L);
  for (let x = 60; x < 1600; x += 140) { const y = 250 + Math.sin(x / 1600 * Math.PI * 2) * 22; el("rect", { x: x - 22, y, width: 44, height: 56, rx: 20, fill: (x / 140 | 0) % 2 ? "#FFD25E" : "#FF6F61", ...S6(4) }, L); el("path", { d: `M${x - 22} ${y + 28} h44`, stroke: "#00000033", "stroke-width": 3 }, L); }
  el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#D9C3A0" }, L); el("path", { d: "M0 760 H1600", ...S6(6) }, L);
}
{ const dr = drawRoom; drawRoom = function (place, noSign = false) {
    if (curStage !== "ltomo") return dr(place, noSign);
    if (place === "こうえん") dr("ベンチ", true);
    else if (place === "ともだちの いえ") { sceneLayer.innerHTML = ""; ROOMS4[place](sceneLayer); }
    else if (place === "かえりみち") { sceneLayer.innerHTML = ""; ROOMS3[place](sceneLayer); }
    else if (place === "おまつり") { sceneLayer.innerHTML = ""; matsuriRoom(sceneLayer); }
    else return dr(place, noSign);
    if (!noSign) { const g = el("g", {}, sceneLayer); el("rect", { x: 620, y: 24, width: 360, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, place.length > 6 ? 38 : 46, { "text-anchor": "middle" }); }
  }; }

/* ---------- 物の 絵 ---------- */
Object.assign(ITEM2, {
  ball2(g) { el("circle", { r: 44, fill: "#FF6F61", ...S6p(5) }, g); el("path", { d: "M-44 0 Q0 -26 44 0 M-44 0 Q0 26 44 0", fill: "none", stroke: "#FFFFFF", "stroke-width": 6 }, g); },
  cookies(g) { el("ellipse", { cx: 0, cy: 10, rx: 110, ry: 30, fill: "#FFFFFF", ...S6p(5) }, g); [[-50, -6], [0, -14], [50, -6]].forEach(([x, y]) => { el("circle", { cx: x, cy: y, r: 30, fill: "#E3A657", ...S6p(4) }, g); [[-8, -6], [8, 4], [-2, 10]].forEach(([a, b]) => el("circle", { cx: x + a, cy: y + b, r: 4, fill: "#6B3E1E" }, g)); }); },
  cookie1(g) { el("ellipse", { cx: 0, cy: 10, rx: 110, ry: 30, fill: "#FFFFFF", ...S6p(5) }, g); el("circle", { cx: 0, cy: -14, r: 30, fill: "#E3A657", ...S6p(4) }, g); [[-8, -20], [8, -10], [-2, -4]].forEach(([a, b]) => el("circle", { cx: a, cy: b, r: 4, fill: "#6B3E1E" }, g)); },
  plate(g) { el("ellipse", { cx: 0, cy: 10, rx: 110, ry: 30, fill: "#FFFFFF", ...S6p(5) }, g); },
  halfcookie(g) { el("path", { d: "M-34 0 A34 34 0 0 1 34 0 Z", fill: "#E3A657", ...S6p(4) }, g); [[-10, -12], [8, -18]].forEach(([a, b]) => el("circle", { cx: a, cy: b, r: 4, fill: "#6B3E1E" }, g)); },
  puzzle(g) { el("rect", { x: -150, y: -20, width: 300, height: 40, rx: 8, fill: "#F2E3C9", ...S6p(5) }, g); [[-120, "#FF8FA3"], [-60, "#FFD25E"], [0, "#7FCBF0"], [60, "#7BD389"]].forEach(([x, c]) => el("rect", { x: x, y: -14, width: 50, height: 28, rx: 5, fill: c, ...S6p(3) }, g)); },
  puzzledone(g) { el("rect", { x: -150, y: -20, width: 300, height: 40, rx: 8, fill: "#F2E3C9", ...S6p(5) }, g); [[-130, "#FF8FA3"], [-65, "#FFD25E"], [0, "#7FCBF0"], [65, "#7BD389"]].forEach(([x, c]) => el("rect", { x, y: -16, width: 65, height: 32, fill: c, ...S6p(3) }, g)); },
  cake(g) { el("rect", { x: -90, y: -50, width: 180, height: 80, rx: 14, fill: "#FFF1F4", ...S6p(5) }, g); el("path", { d: "M-90 -30 Q-60 -10 -30 -30 Q0 -10 30 -30 Q60 -10 90 -30", fill: "none", stroke: "#FF8FA3", "stroke-width": 10 }, g);
    [-40, 0, 40].forEach(x => { el("rect", { x: x - 6, y: -96, width: 12, height: 46, fill: ["#7FCBF0", "#FFD25E", "#7BD389"][(x + 40) / 40], ...S6p(3) }, g); el("path", { d: `M${x} -100 q-8 -14 0 -26 q8 12 0 26 z`, fill: "#FF9E3D" }, g); });
    el("circle", { cx: 0, cy: -48, r: 10, fill: "#E8473C", ...S6p(3) }, g); },
  giftbox(g) { el("rect", { x: -60, y: -50, width: 120, height: 100, rx: 8, fill: "#B9A8D9", ...S6p(5) }, g); el("path", { d: "M0 -50 V50 M-60 0 H60", stroke: "#FF6F91", "stroke-width": 14 }, g); el("path", { d: "M0 -50 Q-40 -90 -30 -54 Z M0 -50 Q40 -90 30 -54 Z", fill: "#FF6F91", ...S6p(4) }, g); },
  yoyo(g) { el("path", { d: "M0 -110 V-30", stroke: "#FFFFFF", "stroke-width": 4 }, g); el("circle", { cy: 0, r: 34, fill: "#7FCBF0", ...S6p(5) }, g); el("path", { d: "M-30 -8 Q0 8 30 -8", stroke: "#FF6F91", "stroke-width": 6, fill: "none" }, g); },
  tub(g) { el("ellipse", { cx: 0, cy: 0, rx: 190, ry: 46, fill: "#BDE3F2", ...S6p(6) }, g); el("path", { d: "M-190 0 V60 Q0 110 190 60 V0", fill: "#5FA8E0", ...S6p(6) }, g);
    [[-80, -6], [20, 10], [100, -10]].forEach(([x, y]) => el("path", { d: `M${x} ${y} q20 -14 40 0 q-20 14 -40 0 l-14 -10 v20 z`, fill: "#FF6F3D", ...S6p(3) }, g)); },
  fishbag(g) { el("path", { d: "M-40 -40 Q-60 40 0 50 Q60 40 40 -40 Z", fill: "#DDF3FF", opacity: .9, ...S6p(4) }, g); el("path", { d: "M-14 10 q14 -10 28 0 q-14 10 -28 0 l-10 -8 v16 z", fill: "#FF6F3D", ...S6p(3) }, g); el("path", { d: "M-40 -40 H40", stroke: "#E8473C", "stroke-width": 6 }, g); },
  wataame(g) { el("path", { d: "M0 0 V110", stroke: "#F2E3C9", "stroke-width": 8 }, g); [[-30, -10, 40], [30, -10, 40], [0, -40, 46], [0, 10, 40]].forEach(([x, y, r]) => el("circle", { cx: x, cy: y, r, fill: "#FFC2D1" }, g)); el("circle", { cx: 0, cy: -10, r: 60, fill: "none", stroke: INK, "stroke-width": 0 }, g); },
  jungle(g) { [-170, 0, 170].forEach(x => el("path", { d: `M${x} 0 V-520`, stroke: "#E8473C", "stroke-width": 16 }, g)); [-480, -340, -200, -60].forEach(y => el("path", { d: `M-170 ${y} H170`, stroke: "#3E7FD6", "stroke-width": 14 }, g)); el("path", { d: "M-190 -520 H190", stroke: "#FFD25E", "stroke-width": 18 }, g); },
  clock(g) { el("circle", { r: 60, fill: "#FFFFFF", ...S6p(6) }, g); el("path", { d: "M0 0 V-40 M0 0 L-24 34", ...S6p(6) }, g); [0, 90, 180, 270].forEach(a => el("circle", { cx: Math.sin(a * Math.PI / 180) * 46, cy: -Math.cos(a * Math.PI / 180) * 46, r: 5, fill: INK }, g)); },
  barrier(g) { [-240, 0, 240].forEach(x => { el("rect", { x: x - 12, y: -150, width: 24, height: 150, fill: "#F2E3C9", ...S6p(5) }, g); el("circle", { cx: x, cy: -158, r: 14, fill: "#E8473C", ...S6p(4) }, g); });
    el("path", { d: "M-240 -120 Q-120 -80 0 -120 Q120 -80 240 -120", fill: "none", stroke: "#FFD25E", "stroke-width": 10 }, g); el("rect", { x: -80, y: -100, width: 160, height: 60, rx: 8, fill: "#FFFFFF", ...S6p(4) }, g); txt(g, 0, -56, "✕", 44, { "text-anchor": "middle", fill: "#E8473C" }); },
  startline(g) { el("rect", { x: -260, y: -8, width: 520, height: 16, fill: "#FFFFFF", opacity: .9 }, g); },
  book2(g) { el("rect", { x: -60, y: -76, width: 120, height: 152, rx: 8, fill: "#7FCBF0", ...S6p(5) }, g); el("rect", { x: -40, y: -50, width: 80, height: 50, rx: 6, fill: "#FFF6E0", ...S6p(3) }, g); },
  fruitbag(g) { el("path", { d: "M-70 -40 H70 L60 70 H-60 Z", fill: "#FFF6E0", ...S6p(5) }, g); el("path", { d: "M-40 -40 Q0 -100 40 -40", fill: "none", ...S6p(5) }, g); },
});
// あたまに つける もの（おめん・マスク）。つぎの 場面で かならず はずす
const LT_CLEAN = [];
const ltClean = () => LT_CLEAN.splice(0).forEach(f => { try { f(); } catch (e) { } });
{ const ssv = setSitView; setSitView = function (s, k) { ltClean(); const r = ssv(s, k);
    if (curStage === "ltomo" && s.intro === "kaiwa" && KFX[s.id.slice(3)]) KFX[s.id.slice(3)](STORY_CAST, r.hero);
    return r; }; const sv = setView; setView = function (v, ...a) { ltClean(); return sv(v, ...a); }; }
function putOmen(c) { const g = el("g", { transform: "translate(292 92) rotate(24)" }, c.head.g); LT_CLEAN.push(() => g.remove());
  el("path", { d: "M-46 -10 L-40 -62 L-12 -34 L12 -34 L40 -62 L46 -10 Q40 46 0 54 Q-40 46 -46 -10 Z", fill: "#FFFFFF", ...S6(5) }, g);
  el("path", { d: "M-30 -2 Q-18 -10 -8 -2 M8 -2 Q18 -10 30 -2", fill: "none", stroke: "#E8473C", "stroke-width": 5 }, g); el("path", { d: "M-40 -48 L-24 -32 M40 -48 L24 -32", stroke: "#E8473C", "stroke-width": 6 }, g);
  el("circle", { cx: 0, cy: 30, r: 7, fill: INK }, g); return g; }
function putMask(c) { const m = c.mouth && c.mouth.getBBox ? null : null; const g = el("g", {}, c.head.g); LT_CLEAN.push(() => g.remove());
  el("rect", { x: 140, y: 196, width: 120, height: 70, rx: 22, fill: "#FFFFFF", ...S6(5) }, g); el("path", { d: "M140 214 L96 196 M260 214 L304 196", ...S6(4) }, g); return g; }
const ltSit = c => { c.squash.t = .72; c.headY.t = 24; c.armL.t = -60; c.armR.t = 60; }; // しゃがむ（すわりこむ）。ltStand で もどす
const ltStand = c => { c.squash.t = 1; c.headY.t = 0; c.armL.t = 0; c.armR.t = 0; };
const sunset = (o = .28) => { const r = el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FF8A3D", opacity: 0 }, propG); tween(900, k => r.setAttribute("opacity", (o * k).toFixed(2))); return r; };

/* ---------- かいわ：ならびと、せりふに あわせた もの ---------- */
LONG_T.kaiwa.forEach(it => STORY_POS["lk_" + it.id] = it.cast.includes("doshinpapa") ? [700, 1260] : [740, 1170]);
const give = (from, to, kind, k = .45) => { const g = handP(from, kind, k); return () => { g.remove(); handP(to, kind, k); }; };
const KFX = { // かいわの 場面に 出す もの（せりふの タイミングに あわせる）
  fhanabi() { [[500, 220, 0, 700], [1000, 170, 2, 1300], [760, 260, 3, 2100], [1200, 240, 1, 3600]].forEach(([x, y, c, t]) => later(t, () => firework(x, y, c))); },
  fame(c, h) { handP(h, "umbrella", .5); later(800, () => rainOn()); },
  fkingyo(c) { handP(c.doshin, "fishbag", .5); },
  fpresent(c) { const g = handP(c.kon, "giftbox", .45); later(1900, () => { g.remove(); handP(c.doshin, "book2", .45); }); },
  foyatsu() { prop("cake", 810, 600, .9); },
  fochita(c, h) { const g = handP(c.kon, "cap", .45); later(5000, () => { g.remove(); handP(h, "cap", .45); }); },
  fgemu(c) { handP(c.doshin, "gamebox", .4); },
};
Object.assign(ITEM2, { cap(g) { el("path", { d: "M-60 10 Q-60 -60 0 -60 Q60 -60 60 10 Z", fill: "#3E7FD6", ...S6p(5) }, g); el("path", { d: "M40 10 H110 Q110 26 40 26 Z", fill: "#3E7FD6", ...S6p(5) }, g); } });

/* ---------- 場面の 動き（台本の ことばと あわせる） ---------- */
const FT_ON = ["fttanoshi", "ftganbare", "ftdou", "ftjunbi", "ftgenki", "ftojama", "fttoire", "ftojamashita", "fthanbun", "ftissho", "ftkaesu", "fttanjoubi", "ftniatteru", "ftosoku", "ftbetsu", "ftkuyashii",
  "ftsanji", "ftyakusoku", "ftbokumo", "ftashita", "ftirete", "ftsabishi"];
FT_ON.forEach(k => ASK_ON_STAGE.add(k));
["ftgenki", "ftyakusoku", "ftitakatta", "ftdaijoubu", "ftnaiteru", "ftkenka", "ftiyanan", "ftbokumo", "ftkuyashii", "ftsabishi", "ftbikkuri"].forEach(k => SOFT_INTRO.add(k));
const ft = {}; // 場面ごとの もの（POST で つかう）
Object.assign(INTRO, {
  // ---- こうえん ----
  async fttanoshi(h, a) { enter(h); await sleep(1100); jump(h, .5); jump(a, .5); await sleep(700); sunset(); playMove(a, "look"); await sleep(1100); },
  async ftbikkuri(h, a) { enter(h); await sleep(1100); playMove(h, "look"); a.dx.v = a.dx.t = 700; hold(a, "sneak", 1.6); a.dx.t = -380; await sleep(1700);
    later(150, () => { jump(a, .8); a.armL.t = -150; a.armR.t = 150; surprise(h); markAbove(h, "ex"); noise(.12, 900, .5); later(900, () => { a.armL.t = a.armR.t = 0; }); }); },
  async ftganbare(h, a) { prop("jungle", 1250, 975, 1); place(a, 1250, 640, .9); stay(a); a.armL.t = -150; a.armR.t = -150; hold(a, "shake", 2.4); enter(h); await sleep(1200); markAbove(a, "drop"); playMove(h, "look"); await sleep(900); },
  async ftjanken(h, a) { prop("swing", 900, 870, 1.3); enter(h); await sleep(1100); playMove(h, "point"); await sleep(400); enter(a); a.dx.t = 0; await sleep(1100); a.armR.t = -100; await sleep(500); },
  async ftkoutai(h, a) { const b = handP(h, "ball2", .5); ft.ball = b; enter(h); await sleep(1100); for (let i = 0; i < 3; i++) later(i * 380, () => blip(260, 160, .08, "sine")); hold(h, "shake", 1); await sleep(600); enter(a); await sleep(1000); a.armR.t = -100; await sleep(500); a.armR.t = 0; },
  async ftdou(h, a) { enter(h); await sleep(1100); wave(a); wave(h); await sleep(800); playMove(a, "think"); markAbove(a, "q"); await sleep(600); },
  async fttacchi(h, a) { a.dx.v = a.dx.t = -200; hold(a, "run", 2); hold(h, "run", 2); h.dx.v = h.dx.t = -900; a.dx.t = -300; h.dx.t = 0; await sleep(1500);
    h.armR.t = -80; thud(); for (let i = 0; i < 6; i++) mark("sparkle", 760, 700, { vx: Math.cos(i) * 260, vy: Math.sin(i) * 260, life: .6, s: .5 }); surprise(a); await sleep(500); h.armR.t = 0; },
  async ftjunbi(h, a) { prop("startline", 900, 975, 1); stay(h); h.dx.v = h.dx.t = 0; ltSit(h); a.armR.t = -150; await sleep(1400); markAbove(h, "drop"); await sleep(500); },
  async ftgenki(h, a) { place(a, 1030, 975, 1.1); stay(a); a.headY.t = 18; a.sadMouth = true; enter(h); await sleep(1300); playMove(h, "look"); await sleep(500); },
  // ---- ともだちの いえ ----
  async ftojama(h, a) { enter(h); await sleep(1100); wave(a); await sleep(800); },
  async ftokashi(h, a) { prop("plate", 810, 615, .9); const c = handP(a, "cookies", .5); enter(h); await sleep(900); enter(a); await sleep(1100); a.armR.t = -60; await sleep(300); c.remove(); ft.cookies = prop("cookies", 810, 600, .9); await sleep(400); a.armR.t = 0; },
  async fttoire(h, a) { enter(h); await sleep(1000); hold(h, "shake", 2.2); h.sadMouth = true; markAbove(h, "drop"); await sleep(1200); playMove(a, "look"); await sleep(600); },
  async ftojamashita(h, a) { const cl = prop("clock", 800, 220, 1); enter(h); await sleep(1100); playMove(a, "point"); await sleep(800); },
  async fthanbun(h, a) { ft.plate = prop("cookie1", 810, 600, .9); enter(h); await sleep(1100); a.armR.t = -90; playMove(a, "look"); await sleep(700); a.sadMouth = true; a.armR.t = 0; await sleep(400); },
  async ftissho(h, a) { ft.pz = prop("puzzle", 900, 900, 1.1); stay(a); playMove(a, "frustrated"); enter(h); await sleep(1300); markAbove(a, "drop"); await sleep(500); },
  async ftkaesu(h, a) { ft.book = handP(h, "book2", .45); enter(h); await sleep(1200); a.armR.t = -90; markAbove(a, "q"); await sleep(700); a.armR.t = 0; },
  async fttanjoubi(h, a) { prop("cake", 810, 580, .9); ft.gift = handP(h, "giftbox", .45); for (let i = 0; i < 3; i++) later(i * 400, () => jump(a, .4)); enter(h); await sleep(1300); a.happyOn = true; await sleep(400); },
  // ---- おまつり ----
  async ftniatteru(h, a) { putOmen(a); enter(h); await sleep(1100); jump(a, .5); markAbove(a, "sparkle"); await sleep(700); },
  async ftosoku(h, a) { playMove(a, "look"); hold(a, "shake", 1.4); await sleep(900); h.dx.v = h.dx.t = -1100; hold(h, "run", 1.4); h.dx.t = 0; await sleep(1400); markAbove(h, "drop"); jump(a, .4); await sleep(500); },
  async ftatode(h, a) { const y = handP(h, "yoyo", .5); ft.yoyo = y; enter(h); await sleep(1100); hold(h, "shake", 1.5); for (let i = 0; i < 3; i++) later(i * 450, () => blip(500, 380, .08, "sine")); await sleep(400); enter(a); await sleep(1000); a.armR.t = -100; await sleep(400); },
  async ftnaiteru(h, a) { const [k] = exKids([940]); if (k) { k.sadMouth = true; k.headY.t = 14; tears(k, 4); } enter(h); await sleep(1200); playMove(h, "look"); surprise(h); await sleep(800); enter(a); await sleep(1100); },
  async ftkenka(h, a) { const ks = exKids([830, 1030]); if (ks[1]) ks[1].headRot.t = 0; ks.forEach((c, i) => { playMove(c, "frustrated"); later(500 + i * 300, () => markAbove(c, "anger")); }); enter(h); await sleep(1200); surprise(h); await sleep(600); enter(a); a.dx.t = 210; await sleep(1100); },
  async ftkuyashii(h, a) { prop("tub", 880, 930, 1); handP(a, "fishbag", .5); enter(h); await sleep(1100); jump(a, .6); markAbove(a, "sparkle"); await sleep(500); h.sadMouth = true; playMove(h, "sad"); await sleep(700); },
  async ftbetsu(h, a) { prop("barrier", 1420, 975, .9); enter(h); await sleep(1100); a.armR.t = -110; playMove(a, "laugh"); await sleep(900); a.armR.t = 0; },
  async fttetsudatte(h, a) { ft.items = [handP(h, "fruitbag", .8, -10), handP(h, "wataame", .7, 25), handP(h, "giftbox", .55, -20)]; enter(h); sway(h, 2600, 10, 300); await sleep(1300); markAbove(h, "drop"); enter(a); await sleep(1100); surprise(a); await sleep(300); },
  // ---- かえりみち ----
  async ftashita(h, a) { sunset(.22); h.dx.v = h.dx.t = -900; a.dx.v = a.dx.t = -700; hold(h, "run", 1.2); hold(a, "run", 1.2); h.dx.t = 0; a.dx.t = 0; await sleep(1300); playMove(a, "look"); await sleep(400); wave(a); await sleep(500); },
  async ftsanji(h, a) { enter(h); await sleep(1100); playMove(a, "think"); await sleep(800); },
  async ftyakusoku(h, a) { a.sadMouth = true; a.headY.t = 12; enter(h); await sleep(1200); markAbove(a, "drop"); await sleep(600); },
  async ftbokumo(h, a) { a.headY.t = 14; a.headRot.t = -10; h.headRot.t = 8; enter(h); await sleep(1300); h.headRot.t = 0; playMove(a, "shy"); await sleep(600); },
  async ftsabishi(h, a) { putMask(a); enter(h); await sleep(1100); wave(a); await sleep(700); },
  async ftitakatta(h, a) { stay(a); a.dx.v = a.dx.t = -200; hold(a, "run", .8); await sleep(800); thud(); flop(a); markAbove(a, "ex"); later(400, () => { ltSit(a); a.sadMouth = true; tears(a, 2.5); }); enter(h); await sleep(1300); surprise(h); await sleep(400); },
  async ftiyanan(h, a) { enter(h); await sleep(1000); a.dx.v = a.dx.t = 600; hold(a, "sneak", 1); a.dx.t = -330; await sleep(1100);
    const poke = () => { a.armL.t = 70; blip(1200, 900, .05, "square"); playMove(h, "surprise"); later(180, () => a.armL.t = 0); };
    for (let i = 0; i < 2; i++) { poke(); await sleep(450); } markAbove(h, "anger"); for (let i = 0; i < 4; i++) later(200 + i * 380, () => { poke(); if (i === 3) playMove(a, "laugh"); }); },
  async ftdaijoubu(h, a) { stay(a); ltSit(a); a.sadMouth = true; tears(a, 3); markAbove(a, "drop"); enter(h); await sleep(1300); surprise(h); await sleep(500); },
  async ftirete(h, a) { const [k] = exKids([960]); a.dx.v = a.dx.t = 0; if (k) { k.dx.v = k.dx.t = 0; } h.dx.v = h.dx.t = -900; hold(h, "run", 1); h.dx.t = -200; await sleep(1100); h.sadMouth = true; await sleep(500); playMove(a, "look"); await sleep(300); wave(a); if (k) wave(k); await sleep(400); },
});
Object.assign(POST, {
  async fttanoshi(h, a) { wave(a); wave(h); await sleep(800); },
  async ftbikkuri(h, a) { playMove(a, "bow"); await sleep(600); playMove(h, "nod"); await sleep(400); },
  async ftganbare(h, a) { a.armL.t = a.armR.t = 0; const y0 = a.y; await tween(700, k => { a.y = y0 - 110 * k; }); joy(a); markAbove(a, "sparkle"); playMove(h, "clap"); await sleep(800); },
  async ftjanken(h, a) { for (let i = 0; i < 3; i++) { h.armR.t = a.armL.t = -60; blip(600 + i * 100, 600 + i * 100, .08, "square"); await sleep(250); h.armR.t = a.armL.t = 0; await sleep(150); } markAbove(h, "sparkle"); jump(h, .5); await sleep(500); },
  async ftkoutai(h, a) { if (ft.ball) ft.ball.remove(); for (let i = 0; i < 2; i++) later(i * 500, () => markAbove(a, "note")); handP(a, "ball2", .5); playMove(a, "pump"); await sleep(700); },
  async ftdou(h, a) { joy(a); joy(h); await sleep(500); hold(a, "run", 1.4); hold(h, "run", 1.4); walk(a, 700, 1400); await walk(h, 700, 1400); },
  async fttacchi(h, a) { a.armL.t = -150; a.armR.t = 150; markAbove(a, "note"); await sleep(400); hold(h, "run", 1.4); await walk(h, -900, 1300); a.armL.t = a.armR.t = 0; },
  async ftjunbi(h, a) { ltStand(h); markAbove(h, "sparkle"); playMove(h, "nod"); playMove(a, "nod"); await sleep(600); },
  async ftgenki(h, a) { a.headY.t = 0; playMove(h, "look"); playMove(a, "look"); markAbove(h, "q"); await sleep(900); },
  async ftojama(h, a) { playMove(h, "bow"); await sleep(600); walk(h, 300, 800); await sleep(800); },
  async ftokashi(h, a) { h.armR.t = -60; for (let i = 0; i < 4; i++) later(i * 200, () => { h.mouthOpen.t = i % 2 ? 0 : .5; }); markAbove(h, "heart"); await sleep(900); h.armR.t = 0; },
  async fttoire(h, a) { a.armR.t = -110; await sleep(400); h.sadMouth = false; hold(h, "run", 1); await walk(h, 1000, 900); a.armR.t = 0; },
  async ftojamashita(h, a) { playMove(h, "bow"); await sleep(700); wave(h); wave(a); await sleep(500); hold(h, "run", 1.2); await walk(h, -1000, 1100); },
  async fthanbun(h, a) { if (ft.plate) { ft.plate.remove(); prop("plate", 810, 600, .9); } handP(h, "halfcookie", .5); handP(a, "halfcookie", .5); a.sadMouth = false; joy(a); joy(h); markAbove(a, "heart"); await sleep(800); },
  async ftissho(h, a) { await walk(h, 160, 600); playMove(h, "crouch"); playMove(a, "crouch"); await sleep(900); if (ft.pz) ft.pz.remove(); prop("puzzledone", 900, 900, 1.1); for (let i = 0; i < 6; i++) mark("sparkle", 900, 880, { vx: Math.cos(i) * 240, vy: -200, life: .7, s: .5 }); chime(); joy(a); joy(h); await sleep(700); },
  async ftkaesu(h, a) { if (ft.book) ft.book.remove(); handP(a, "book2", .45); playMove(a, "nod"); await sleep(600); },
  async fttanjoubi(h, a) { if (ft.gift) ft.gift.remove(); handP(a, "giftbox", .45); joy(a); confetti(60); markAbove(a, "heart"); await sleep(900); },
  async ftniatteru(h, a) { playMove(a, "shy"); await sleep(700); },
  async ftosoku(h, a) { joy(a); joy(h); await sleep(400); hold(a, "run", 1.4); hold(h, "run", 1.4); walk(a, 700, 1400); await walk(h, 700, 1400); },
  async ftatode(h, a) { playMove(a, "nod"); markAbove(a, "note"); await sleep(700); },
  async ftnaiteru(h, a) { const k = (CUR_S && CUR_S.extras || []).map(x => C[x])[0]; await walk(a, -200, 700); playMove(a, "nod"); if (k) { await sleep(400); k.headY.t = 0; k.sadMouth = false; playMove(k, "nod"); } await sleep(500); },
  async ftkenka(h, a) { await walk(a, -150, 600); const ks = (CUR_S && CUR_S.extras || []).map(x => C[x]); ks.forEach(c => playMove(c, "bow")); await sleep(800); },
  async ftkuyashii(h, a) { h.sadMouth = false; playMove(a, "highfive"); playMove(h, "highfive"); await sleep(800); },
  async ftbetsu(h, a) { joy(a); joy(h); await sleep(400); hold(a, "run", 1.4); hold(h, "run", 1.4); walk(a, -1500, 1500); await walk(h, -1100, 1400); },
  async fttetsudatte(h, a) { const it = (ft.items || []).shift(); if (it) it.remove(); handP(a, "fruitbag", .8); h.lean.t = 0; joy(h); await sleep(700); },
  async ftashita(h, a) { hold(a, "run", 1.3); walk(a, 800, 1300); wave(h); await sleep(1300); },
  async ftsanji(h, a) { h.armR.t = -80; a.armL.t = -80; markAbove(a, "heart"); await sleep(900); h.armR.t = a.armL.t = 0; },
  async ftyakusoku(h, a) { a.sadMouth = false; a.headY.t = 0; joy(a); await sleep(600); },
  async ftbokumo(h, a) { a.headY.t = 0; a.headRot.t = 0; playMove(a, "highfive"); playMove(h, "highfive"); await sleep(800); },
  async ftsabishi(h, a) { joy(a); joy(h); await sleep(600); },
  async ftitakatta(h, a) { h.armR.t = -70; await sleep(500); a.sadMouth = false; ltStand(a); playMove(a, "nod"); h.armR.t = 0; await sleep(500); },
  async ftiyanan(h, a) { a.dx.t = 0; await sleep(500); playMove(h, "nod"); await sleep(300); },
  async ftdaijoubu(h, a) { a.headY.t = 0; playMove(a, "nod"); await sleep(300); hold(h, "run", 1.2); await walk(h, -1000, 1100); },
  async ftirete(h, a) { h.sadMouth = false; joy(h); await sleep(400); const k = (CUR_S && CUR_S.extras || []).map(x => C[x])[0]; [a, h, k].forEach(c => c && hold(c, "run", 1.6)); if (k) walk(k, 800, 1600); walk(a, 800, 1600); await walk(h, 1000, 1600); },
});
