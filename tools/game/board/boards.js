/* ================= すごろく盤：ステージごとに ちがう 形 =================
   こうしゃ 以外は、ここの BOARD に マス（nodes）・つながり（next）・場所（place）・かざり を かく。
   分かれ道は いくつでも よい（next に 2つ）。"0"＝スタート、"15"＝ゴール、"4"＝ねている 子（どいて ください）。
   分かれ道の 声：上下に 分かれる ときは「うえと した」、左右に 分かれる ときは「みぎと ひだり」。 */
const P2 = (a, b) => ({ x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2 });
const arcPts = (cx, cy, rx, ry, degs) => degs.map(d => [Math.round(cx + rx * Math.cos(d * Math.PI / 180)), Math.round(cy + ry * Math.sin(d * Math.PI / 180))]);
function chain(ids, pts, place, nodes, places) { ids.forEach((id, i) => { nodes[id] = pts[i].slice(); places[id] = place; }); }
function linkLine(next, ids) { for (let i = 0; i < ids.length - 1; i++) (next[ids[i]] = next[ids[i]] || []).push(ids[i + 1]); }
const BOARD = {};
/* ---------- うんどうじょう：トラックを 1しゅう（なかの すなばを ぬける ちかみち あり） ---------- */
{ const n = {}, pl = {}, nx = {}; const T = arcPts(860, 640, 560, 270, [110, 86, 62, 40, 18, -6]);
  chain(["0", "1", "2", "3", "4", "f1"], T, "トラック", n, pl); pl["3"] = pl["4"] = pl.f1 = "みずのみば";
  chain(["a1", "a2", "a3", "a4", "a5"], arcPts(860, 640, 560, 270, [-30, -55, -80, -105, -130]), "てつぼう", n, pl);
  chain(["b1", "b2", "b3", "b4"], [[1200, 700], [980, 680], [760, 660], [560, 610]], "すなば", n, pl);
  chain(["m1", "m2", "m3", "15"], arcPts(860, 640, 560, 270, [-155, 180, 155, 132]), "トラック", n, pl); n["15"].push("goal"); n["0"].push("start"); n["4"].push("block");
  linkLine(nx, ["0", "1", "2", "3", "4", "f1", "a1", "a2", "a3", "a4", "a5", "m1", "m2", "m3", "15"]); linkLine(nx, ["f1", "b1", "b2", "b3", "b4", "m1"]);
  BOARD.undou = { nodes: n, place: pl, next: nx, away: [1130, 760], style: (a, b) => pl[a] === "すなば" || pl[b] === "すなば" ? "sand" : "track",
    labels: [["トラック", 860, 975], ["みずのみば", 1480, 900], ["てつぼう", 900, 265], ["すなば", 860, 720]] }; }
/* ---------- こうえん：S字の さんぽみち（いけの とびいし・すべりだいの ちかみち） ---------- */
{ const n = {}, pl = {}, nx = {};
  chain(["0", "1", "2", "3", "4", "5", "f1"], [[420, 905], [620, 912], [820, 900], [1020, 892], [1215, 868], [1380, 790], [1400, 640]], "ベンチ", n, pl); pl["0"] = pl["1"] = pl["2"] = "ブランコ";
  chain(["a1", "a2", "a3"], [[1260, 580], [1070, 560], [870, 560]], "ベンチ", n, pl);
  chain(["b1", "b2"], [[1170, 690], [930, 690]], "いけ", n, pl);
  chain(["m1", "m2", "m3", "f2"], [[660, 610], [500, 530], [470, 410], [640, 330]], "いけ", n, pl); pl.m2 = pl.m3 = pl.f2 = "すべりだい";
  chain(["c1", "c2", "c3"], [[830, 250], [1020, 235], [1200, 280]], "すべりだい", n, pl);
  chain(["d1"], [[900, 420]], "すべりだい", n, pl);
  n["15"] = [1240, 425, "goal"]; pl["15"] = "すべりだい"; n["0"].push("start"); n["4"].push("block");
  linkLine(nx, ["0", "1", "2", "3", "4", "5", "f1", "a1", "a2", "a3", "m1", "m2", "m3", "f2", "c1", "c2", "c3", "15"]); linkLine(nx, ["f1", "b1", "b2", "m1"]); linkLine(nx, ["f2", "d1", "15"]);
  BOARD.kouen = { nodes: n, place: pl, next: nx, away: [700, 760], style: (a, b) => (pl[a] === "いけ" && pl[b] === "いけ") || a === "f1" && b === "b1" || a === "b2" ? "stones" : a === "f2" && b === "d1" || a === "d1" ? "slide" : "park",
    labels: [["ブランコ", 600, 990], ["ベンチ", 1480, 560], ["いけ", 1050, 800], ["すべりだい", 560, 230]] }; }
/* ---------- おみせ：しょうてんがいの とおり（かどを まがる・ろじの ちかみち） ---------- */
{ const n = {}, pl = {}, nx = {};
  chain(["0", "1", "2", "f1"], [[440, 890], [640, 890], [840, 890], [1040, 890]], "パンや", n, pl);
  chain(["a1", "4", "a3"], [[1240, 890], [1440, 890], [1440, 720]], "やおや", n, pl);
  chain(["b1", "b2"], [[1040, 720], [1240, 580]], "やおや", n, pl);
  chain(["m1", "m2", "m3", "f2"], [[1440, 560], [1440, 400], [1240, 330], [1040, 330]], "おかしや", n, pl);
  chain(["c1", "c2", "c3", "c4"], [[840, 330], [640, 330], [460, 430], [460, 590]], "レジ", n, pl);
  chain(["d1", "d2"], [[920, 500], [760, 620]], "レジ", n, pl);
  n["15"] = [580, 720, "goal"]; pl["15"] = "レジ"; n["0"].push("start"); n["4"].push("block");
  // 1つめの 分かれ道：まっすぐ（やおやの まえ）か、ろじを ぬけるか。2つめ：とおりを まわるか、ろじの ちかみち
  linkLine(nx, ["0", "1", "2", "f1", "a1", "4", "a3", "m1", "m2", "m3", "f2", "c1", "c2", "c3", "c4", "15"]); linkLine(nx, ["f1", "b1", "b2", "m1"]); linkLine(nx, ["f2", "d1", "d2", "15"]);
  // ねている 子（"4"）は まっすぐの みち だけ → ろじを えらぶと よけられる
  BOARD.omise = { nodes: n, place: pl, next: nx, away: [1300, 760], style: (a, b) => ["b1", "b2", "d1", "d2"].includes(a) || ["b1", "d1"].includes(b) ? "alley" : "street",
    labels: [["パンや", 640, 990], ["やおや", 1300, 990], ["おかしや", 1380, 250], ["レジ", 300, 700]] }; }
/* ---------- でんしゃとバス：ろせんず（でんしゃの せん と バスの みち） ---------- */
{ const n = {}, pl = {}, nx = {};
  chain(["0", "1", "2", "3", "4", "f1"], [[440, 880], [640, 880], [840, 880], [1040, 880], [1240, 880], [1400, 740]], "えき", n, pl); pl["3"] = pl["4"] = pl.f1 = "でんしゃ";
  chain(["a1", "a2", "a3"], [[1400, 540], [1240, 400], [1040, 400]], "でんしゃ", n, pl);
  chain(["b1", "b2", "b3", "b4"], [[1220, 780], [1040, 700], [860, 720], [720, 600]], "バス", n, pl);
  chain(["m1", "f2"], [[840, 400], [640, 400]], "えき", n, pl);
  chain(["c1", "c2"], [[460, 460], [460, 640]], "バスてい", n, pl);
  chain(["d1"], [[640, 560]], "バスてい", n, pl);
  n["15"] = [560, 760, "goal"]; pl["15"] = "えき"; n["0"].push("start"); n["4"].push("block");
  linkLine(nx, ["0", "1", "2", "3", "4", "f1", "a1", "a2", "a3", "m1", "f2", "c1", "c2", "15"]); linkLine(nx, ["f1", "b1", "b2", "b3", "b4", "m1"]); linkLine(nx, ["f2", "d1", "15"]);
  BOARD.densha = { nodes: n, place: pl, next: nx, away: [300, 760], style: (a, b) => pl[a] === "バス" || pl[b] === "バス" || ["f2", "d1", "c1", "c2"].includes(a) ? "bus" : "rail",
    labels: [["えき", 640, 985], ["でんしゃ", 1470, 340], ["バス", 1040, 760], ["バスてい", 300, 560]] }; }
/* ---------- がっこう2：こうしゃの 1かい → 2かい → 3かい（かいだんを えらぶ） ---------- */
{ const n = {}, pl = {}, nx = {}; const F1 = 900, F2 = 620, F3 = 340;
  chain(["0", "1", "2", "3", "4", "f1"], [[420, F1], [620, F1], [820, F1], [1020, F1], [1220, F1], [1420, F1]], "たいいくかん", n, pl); pl["0"] = pl["1"] = pl["2"] = "きゅうしょく";
  chain(["a1", "a2"], [[1420, 760], [1420, F2]], "おんがくしつ", n, pl);
  chain(["b1", "b2"], [[1280, 780], [1180, F2]], "おんがくしつ", n, pl);
  chain(["m1", "m2", "f2"], [[1000, F2], [820, F2], [640, F2]], "ずこうしつ", n, pl); pl.m1 = "おんがくしつ";
  chain(["c1", "c2", "c3"], [[460, F2], [460, 480], [560, F3]], "としょしつ", n, pl);
  chain(["d1"], [[740, 480]], "きょうしつ", n, pl);
  chain(["e1", "e2"], [[820, F3], [1020, F3]], "きょうしつ", n, pl);
  n["15"] = [1220, F3, "goal"]; pl["15"] = "きょうしつ"; n["0"].push("start"); n["4"].push("block");
  linkLine(nx, ["0", "1", "2", "3", "4", "f1", "a1", "a2", "m1", "m2", "f2", "c1", "c2", "c3", "e1", "e2", "15"]); linkLine(nx, ["f1", "b1", "b2", "m1"]); linkLine(nx, ["f2", "d1", "e1"]);
  BOARD.gakkou2 = { nodes: n, place: pl, next: nx, away: [300, 760], style: (a, b) => n[a][1] !== n[b][1] ? "stairs" : "hall",
    labels: [["きゅうしょく", 620, 985], ["たいいくかん", 1220, 985], ["おんがくしつ", 1300, 545], ["ずこうしつ", 820, 545], ["としょしつ", 330, 700], ["きょうしつ", 900, 265]] }; }

/* ---------- 盤の しくみ（こうしゃ 以外） ---------- */
const NEXT_K = NEXT;
NEXT = function (id) { const B = BOARD[curStage]; if (!B) return NEXT_K(id); return (B.next[id] || []).slice(); };
const zoneOfB = zoneOf;
zoneOf = function (id) { const B = BOARD[curStage]; if (!B) return zoneOfB(id); return B.place[id] || Object.values(B.place)[0]; };
sleeperAway = function () { const B = BOARD[curStage]; return B ? B.away : LAYOUT[curStage] ? LAYOUT[curStage].away : [1000, 792]; };
const applyStageB = applyStage;
applyStage = function (id) {
  applyStageB(id === "gakkou2" ? "kousha" : id); curStage = id;
  const src = BOARD[id] ? BOARD[id].nodes : KOUSHA_NODES;
  Object.keys(NODES).forEach(k => delete NODES[k]); Object.entries(src).forEach(([k, v]) => NODES[k] = v.slice());
  if (id === "gakkou2") { RIVAL = RIVAL_OF[id]; SLEEPER = SLEEPER_OF[id] || "doshin"; P.gao = piece(RIVAL); P.doshin = piece(SLEEPER); delete P.gao.tm.closed; P.gao.human = false; BOARD_PIECES = [P.doshin, P.shima, P.gao]; }
};
// 分かれ道：2つの 行き先が 左右に はなれて いれば「みぎ・ひだり」、上下なら「うえ・した」
// それぞれの 行き先を、分かれ道から 見た むきで よぶ（同じ むきに なったら、ちがいの 大きい ほうで よびわける）
const DIR_ORDER = ["うえ", "した", "みぎ", "ひだり"], DIR_KEY = { うえ: "u", した: "d", みぎ: "r", ひだり: "l" };
function forkSides(id) {
  const [p, q] = NEXT(id), F = NODES[id], A = NODES[p], B = NODES[q];
  const dir = P => { const dx = P[0] - F[0], dy = P[1] - F[1]; return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "みぎ" : "ひだり") : (dy < 0 ? "うえ" : "した"); };
  let a = dir(A), b = dir(B);
  if (a === b) { if (Math.abs(A[0] - B[0]) > Math.abs(A[1] - B[1])) [a, b] = A[0] < B[0] ? ["ひだり", "みぎ"] : ["みぎ", "ひだり"]; else [a, b] = A[1] < B[1] ? ["うえ", "した"] : ["した", "うえ"]; }
  const out = [[a, p], [b, q]]; out.sort((x, y) => DIR_ORDER.indexOf(x[0]) - DIR_ORDER.indexOf(y[0])); return out;
}
const forkKey = sides => { const k = sides.map(([l]) => DIR_KEY[l]).join(""); return k === "ud" ? "fork" : "fork_" + k; };
const askForkK = askFork;
askFork = async function (pc = P.shima) {
  if (!BOARD[curStage]) return askForkK(pc);
  const sides = forkSides(pc.node);
  await speak(C.pony, forkKey(sides), `${sides[0][0]}と ${sides[1][0]}の、どっちに いく？`);
  const mk = ([label, id]) => { const b = document.createElement("button"); b.type = "button"; b.className = "arrow"; b.textContent = label;
    const [x, y] = NODES[id]; b.style.left = `calc(${x / 16}% - 4.5%)`; b.style.top = `calc(${y / 10}% - 7.2%)`; stage.appendChild(b); return b; };
  const bs = sides.map(mk);
  const pick = await new Promise(res => {
    let done = false; const fin = v => { if (done) return; done = true; h && h.stop(); bs.forEach(b => b.remove()); res(v); };
    bs.forEach((b, i) => b.onclick = () => fin(sides[i]));
    setListen(pc, true);
    const re = { うえ: /うえ|上/, した: /した|下/, みぎ: /みぎ|右/, ひだり: /ひだり|左/ };
    const h = srUsable ? hear(texts => { const t = kata2hira(texts.join(" ")); const s = sides.find(([l]) => re[l].test(t)); if (s) fin(s); heardEl.textContent = t; }, 15000) : null;
  });
  setListen(pc, false);
  const key = { うえ: "up", した: "down", みぎ: "right", ひだり: "left" }[pick[0]];
  await speak(C.pony, key, pick[0] + "！");
  return pick[1];
};

/* ---------- 盤を かく ---------- */
const drawBoardB = drawBoard;
drawBoard = function () {
  const B = BOARD[curStage]; if (!B) return drawBoardB();
  const d = STAGE_DEF[curStage]; boardLayer.innerHTML = ""; const L = boardLayer;
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: d.ground }, L);
  BOARD_BG[curStage](L, B);
  // みち
  const edges = []; Object.entries(B.next).forEach(([a, bs]) => bs.forEach(b => edges.push([a, b])));
  const seg = (a, b) => `M${NODES[a][0]} ${NODES[a][1]} L${NODES[b][0]} ${NODES[b][1]}`;
  edges.forEach(([a, b]) => ROAD[B.style(a, b)](L, seg(a, b), NODES[a], NODES[b], "under"));
  edges.forEach(([a, b]) => ROAD[B.style(a, b)](L, seg(a, b), NODES[a], NODES[b], "over"));
  { const [gx, gy] = NODES["15"]; el("circle", { cx: gx, cy: gy, r: 100, fill: "#FFD25E", ...S6(6) }, L); }
  Object.entries(NODES).forEach(([id, [x, y, k]]) => {
    const g = el("g", {}, L); const fill = d.fills[B.place[id]] || "#FFF1C9";
    if (k === "goal") { el("circle", { cx: x, cy: y, r: 58, fill: "#FFFFFF", ...S6(6) }, g); el("path", { d: `M${x - 14} ${y + 34} V${y - 40}`, ...S6(6) }, g);
      el("path", { d: `M${x - 12} ${y - 40} L${x + 34} ${y - 26} L${x - 12} ${y - 10} Z`, fill: "#FF6F91", ...S6(5) }, g); txt(L, x, y - 70, "ゴール", 34, { "text-anchor": "middle", stroke: "#FFFFFF", "stroke-width": 8, "paint-order": "stroke" }); return; }
    el("circle", { cx: x, cy: y, r: 44, fill: "#FFFFFF", ...S6(6) }, g);
    if (k === "start") txt(g, x, y + 10, "スタート", 22, { "text-anchor": "middle" });
    else if ((B.next[id] || []).length > 1) el("path", { d: `M${x - 20} ${y + 18} L${x} ${y - 4} L${x + 20} ${y + 18} M${x} ${y - 4} V${y - 26} M${x - 10} ${y - 16} L${x} ${y - 26} L${x + 10} ${y - 16}`, fill: "none", ...S6(6) }, g);
    else el("circle", { cx: x, cy: y, r: 26, fill, ...S6(4) }, g);
  });
  B.labels.forEach(([t, x, y]) => { const w = t.length * 30 + 34; el("rect", { x: x - w / 2, y: y - 34, width: w, height: 46, rx: 23, fill: d.fills[t] || "#FFFFFF", ...S6(4) }, L); txt(L, x, y - 2, t, 28, { "text-anchor": "middle" }); });
};
/* みちの かきかた */
const pathEl = (L, d, attrs) => el("path", { d, fill: "none", "stroke-linejoin": "round", "stroke-linecap": "round", ...attrs }, L);
const ROAD = {
  track(L, d, a, b, pass) { if (pass === "under") { pathEl(L, d, { stroke: INK, "stroke-width": 78 }); pathEl(L, d, { stroke: "#D9774A", "stroke-width": 66 }); } else pathEl(L, d, { stroke: "#FFFFFF", "stroke-width": 5, "stroke-dasharray": "26 18" }); },
  sand(L, d, a, b, pass) { if (pass === "under") { pathEl(L, d, { stroke: INK, "stroke-width": 70 }); pathEl(L, d, { stroke: "#F6E2A8", "stroke-width": 58 }); } else pathEl(L, d, { stroke: "#E2C27A", "stroke-width": 6, "stroke-dasharray": "2 20" }); },
  park(L, d, a, b, pass) { if (pass === "under") { pathEl(L, d, { stroke: INK, "stroke-width": 70 }); pathEl(L, d, { stroke: "#F2E3C2", "stroke-width": 58 }); } else pathEl(L, d, { stroke: "#D9C49A", "stroke-width": 6, "stroke-dasharray": "2 22" }); },
  stones(L, d, a, b, pass) { if (pass !== "over") return; const n = 4; for (let i = 1; i < n; i++) { const x = a[0] + (b[0] - a[0]) * i / n, y = a[1] + (b[1] - a[1]) * i / n; el("ellipse", { cx: x, cy: y, rx: 30, ry: 20, fill: "#B8B2A6", ...S6(5) }, L); } },
  slide(L, d, a, b, pass) { if (pass === "under") { pathEl(L, d, { stroke: INK, "stroke-width": 64 }); pathEl(L, d, { stroke: "#FF8FA3", "stroke-width": 52 }); } else pathEl(L, d, { stroke: "#FFFFFF", "stroke-width": 8, opacity: .6 }); },
  street(L, d, a, b, pass) { if (pass === "under") { pathEl(L, d, { stroke: INK, "stroke-width": 84 }); pathEl(L, d, { stroke: "#E9E4DA", "stroke-width": 72 }); } else pathEl(L, d, { stroke: "#FFFFFF", "stroke-width": 8, "stroke-dasharray": "30 20" }); },
  alley(L, d, a, b, pass) { if (pass === "under") { pathEl(L, d, { stroke: INK, "stroke-width": 58 }); pathEl(L, d, { stroke: "#D8C8A8", "stroke-width": 46 }); } else pathEl(L, d, { stroke: "#BFAE8A", "stroke-width": 5, "stroke-dasharray": "12 12" }); },
  rail(L, d, a, b, pass) { if (pass === "under") { pathEl(L, d, { stroke: INK, "stroke-width": 44 }); pathEl(L, d, { stroke: "#3E7FD6", "stroke-width": 32 }); } else { pathEl(L, d, { stroke: "#FFFFFF", "stroke-width": 6 }); pathEl(L, d, { stroke: "#FFFFFF", "stroke-width": 20, "stroke-dasharray": "4 22" }); } },
  bus(L, d, a, b, pass) { if (pass === "under") { pathEl(L, d, { stroke: INK, "stroke-width": 50 }); pathEl(L, d, { stroke: "#5FB35A", "stroke-width": 38 }); } else pathEl(L, d, { stroke: "#FFFFFF", "stroke-width": 6, "stroke-dasharray": "22 16" }); },
  hall(L, d, a, b, pass) { if (pass === "under") { pathEl(L, d, { stroke: INK, "stroke-width": 72 }); pathEl(L, d, { stroke: "#F7EBD3", "stroke-width": 60 }); } else pathEl(L, d, { stroke: "#E3CFA8", "stroke-width": 5, "stroke-dasharray": "40 14" }); },
  stairs(L, d, a, b, pass) { if (pass === "under") { pathEl(L, d, { stroke: INK, "stroke-width": 72 }); pathEl(L, d, { stroke: "#D9C2E8", "stroke-width": 60 }); return; }
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.floor(len / 24), ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len;
    for (let i = 1; i < n; i++) { const x = a[0] + ux * i * 24, y = a[1] + uy * i * 24; el("path", { d: `M${x - uy * 26} ${y + ux * 26} L${x + uy * 26} ${y - ux * 26}`, stroke: "#A88BC2", "stroke-width": 4 }, L); } },
};
/* ---------- 盤の 背景の かざり ---------- */
const flower = (L, x, y, c) => { [0, 72, 144, 216, 288].forEach(a => el("circle", { cx: x + 10 * Math.cos(a * Math.PI / 180), cy: y + 10 * Math.sin(a * Math.PI / 180), r: 8, fill: c }, L)); el("circle", { cx: x, cy: y, r: 6, fill: "#FFD25E" }, L); };
const cloud = (L, x, y, k = 1) => [[0, 0, 40], [40, -14, 32], [72, 4, 28]].forEach(([dx, dy, r]) => el("circle", { cx: x + dx * k, cy: y + dy * k, r: r * k, fill: "#FFFFFF" }, L));
const BOARD_BG = {
  undou(L) { el("rect", { x: 0, y: 0, width: 1600, height: 180, fill: "#CFEAFB" }, L); cloud(L, 420, 90); cloud(L, 980, 70, .8);
    for (let i = 0; i < 16; i++) el("path", { d: `M${i * 100 + 20} 150 l40 0 l-20 34 Z`, fill: ["#FF6F91", "#FFD25E", "#7FCBF0", "#7CC36A"][i % 4], ...S6(3) }, L); el("path", { d: "M0 150 H1600", ...S6(4) }, L);
    el("ellipse", { cx: 860, cy: 640, rx: 640, ry: 340, fill: "#C9653F", ...S6(6) }, L); el("ellipse", { cx: 860, cy: 640, rx: 480, ry: 200, fill: "#8CCB6E", ...S6(6) }, L);
    [600, 620, 660].forEach(r => el("ellipse", { cx: 860, cy: 640, rx: r - 60 + 40, ry: (r - 60) * .52 + 40, fill: "none", stroke: "#FFFFFF66", "stroke-width": 3 }, L));
    el("rect", { x: 620, y: 560, width: 300, height: 150, rx: 50, fill: "#F6E2A8", ...S6(5) }, L); el("path", { d: "M1030 590 h80 v70 M1030 590 v70", fill: "none", ...S6(6) }, L); for (let x = 1036; x < 1110; x += 12) el("path", { d: `M${x} 596 v60`, stroke: "#FFFFFF", "stroke-width": 3 }, L);
    [[600, 210], [760, 230], [920, 210]].forEach(([x, y]) => { el("path", { d: `M${x} ${y + 60} V${y} M${x + 120} ${y + 60} V${y}`, ...S6(8) }, L); el("path", { d: `M${x - 4} ${y} H${x + 124}`, stroke: "#B0B7C3", "stroke-width": 12, "stroke-linecap": "round" }, L); });
    el("rect", { x: 1470, y: 840, width: 110, height: 40, rx: 8, fill: "#E6E6E6", ...S6(5) }, L); [1495, 1555].forEach(x => el("path", { d: `M${x} 840 v-22 h12`, fill: "none", ...S6(5) }, L));
    el("path", { d: "M300 750 L360 820", stroke: "#FFFFFF", "stroke-width": 12 }, L); [[150, 980], [1540, 560], [120, 640]].forEach(([x, y]) => tree2(L, x, y, 46)); },
  kouen(L) { for (let i = 0; i < 60; i++) { const x = (i * 397) % 1600, y = 120 + (i * 233) % 860; el("path", { d: `M${x} ${y} l8 -16 l8 16`, fill: "none", stroke: "#6DBB5E", "stroke-width": 4 }, L); }
    el("path", { d: "M760 620 Q900 540 1150 560 Q1340 600 1310 700 Q1260 780 1040 770 Q800 770 720 710 Q690 660 760 620 Z", fill: "#8FD3F0", ...S6(6) }, L);
    [[820, 690], [1240, 650]].forEach(([x, y]) => el("ellipse", { cx: x, cy: y, rx: 50, ry: 14, fill: "#7CC36A", ...S6(3) }, L));
    
    [[160, 980, 56], [130, 640, 48], [1520, 980, 50], [1520, 640, 44], [760, 180, 40], [1260, 190, 40], [330, 470, 40]].forEach(([x, y, r]) => tree2(L, x, y, r));
    for (let i = 0; i < 14; i++) flower(L, 200 + (i * 211) % 1250, 720 + (i * 97) % 120 + (i % 3) * 60, ["#FF8FA3", "#FFFFFF", "#B9A8D9"][i % 3]);
    el("path", { d: "M300 800 L330 760 L380 760 L410 800", fill: "#FF8FA3", ...S6(4) }, L); el("path", { d: "M330 990 L360 900 M430 990 L400 900 M352 900 H408", ...S6(6) }, L);
    el("rect", { x: 1300, y: 420, width: 150, height: 22, rx: 6, fill: "#C98A4B", ...S6(4) }, L); el("path", { d: "M1310 442 v30 M1440 442 v30", ...S6(5) }, L); },
  omise(L) { const shop = (x, y, w, h, c, t) => { el("rect", { x, y, width: w, height: h, rx: 8, fill: "#FFF6E6", ...S6(5) }, L); for (let i = 0; i < Math.floor(w / 40); i++) el("path", { d: `M${x + i * 40} ${y} h40 v26 q-20 14 -40 0 Z`, fill: i % 2 ? "#FFFFFF" : c, ...S6(3) }, L);
      el("rect", { x: x + 16, y: y + 46, width: w - 32, height: h - 62, rx: 6, fill: "#CFEAFB", ...S6(4) }, L); if (t) txt(L, x + w / 2, y + h - 22, t, 26, { "text-anchor": "middle" }); };
    shop(860, 640, 160, 110, "#E8735A", "パン"); shop(1070, 400, 160, 110, "#FF8FA3", "おかし"); shop(640, 430, 170, 110, "#7FCBF0", "");
    shop(600, 160, 200, 120, "#7FCBF0", ""); shop(880, 160, 200, 120, "#E8735A", ""); shop(1160, 160, 160, 120, "#7CC36A", "");
    shop(1260, 650, 130, 110, "#7CC36A", "やおや"); shop(250, 760, 130, 120, "#7FCBF0", "");
    for (let i = 0; i < 8; i++) el("circle", { cx: 420 + i * 150, cy: 980, r: 12, fill: "#FFD25E", ...S6(3) }, L); el("path", { d: "M380 980 H1520", stroke: INK, "stroke-width": 3 }, L); },
  densha(L) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#EEF3F8" }, L); for (let x = 0; x < 1600; x += 80) el("path", { d: `M${x} 0 V1000`, stroke: "#E0E8F0", "stroke-width": 2 }, L); for (let y = 0; y < 1000; y += 80) el("path", { d: `M0 ${y} H1600`, stroke: "#E0E8F0", "stroke-width": 2 }, L);
    el("path", { d: "M1500 300 Q1560 500 1500 700 Q1450 900 1560 1000 L1600 1000 L1600 300 Z", fill: "#BFE3F7" }, L);
    [[860, 220, 70], [1080, 210, 50]].forEach(([x, y, r]) => el("path", { d: `M${x - r * 1.6} ${y + 50} L${x} ${y - r} L${x + r * 1.6} ${y + 50} Z`, fill: "#9CC58A", ...S6(4) }, L));
    const train = (x, y) => { el("rect", { x, y, width: 150, height: 60, rx: 20, fill: "#7FCBF0", ...S6(5) }, L); [16, 62, 108].forEach(dx => el("rect", { x: x + dx, y: y + 12, width: 30, height: 22, rx: 4, fill: "#FFFFFF", ...S6(3) }, L)); };
    train(1080, 940); const bus = (x, y) => { el("rect", { x, y, width: 130, height: 60, rx: 14, fill: "#7CC36A", ...S6(5) }, L); [14, 54, 94].forEach(dx => el("rect", { x: x + dx, y: y + 10, width: 24, height: 20, rx: 4, fill: "#FFFFFF", ...S6(3) }, L)); [x + 26, x + 104].forEach(cx => el("circle", { cx, cy: y + 60, r: 12, fill: "#555", ...S6(3) }, L)); };
    bus(900, 760); el("rect", { x: 220, y: 830, width: 140, height: 110, rx: 10, fill: "#FFF1C9", ...S6(5) }, L); txt(L, 290, 900, "えき", 30, { "text-anchor": "middle" }); },
  gakkou2(L) { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#CFEAFB" }, L); cloud(L, 1000, 80); cloud(L, 560, 110, .7);
    el("rect", { x: 330, y: 230, width: 1200, height: 740, fill: "#FFF4E0", ...S6(8) }, L); el("path", { d: "M330 230 L930 150 L1530 230 Z", fill: "#E8735A", ...S6(8) }, L);
    el("circle", { cx: 930, cy: 196, r: 26, fill: "#FFFFFF", ...S6(5) }, L); el("path", { d: "M930 196 V180 M930 196 L942 204", ...S6(4) }, L);
    el("path", { d: "M330 690 H1530 M330 410 H1530", ...S6(6) }, L);
    const win = (x, y) => el("rect", { x, y, width: 90, height: 70, rx: 6, fill: "#CFEAFB", ...S6(4) }, L);
    [[380, 250], [600, 250], [1100, 250], [1320, 250], [600, 430], [900, 430], [1300, 430], [600, 710], [900, 710]].forEach(([x, y]) => win(x, y));
    el("rect", { x: 1060, y: 730, width: 300, height: 120, rx: 10, fill: "#E9C893", ...S6(5) }, L); txt(L, 1210, 800, "たいいくかん", 26, { "text-anchor": "middle" });
    [[1350, 440], [380, 440]].forEach(([x, y]) => { for (let i = 0; i < 5; i++) el("rect", { x: x + i * 14, y: y + 200 - i * 40, width: 100 - i * 14, height: 40, fill: "#E6DAF2", ...S6(3) }, L); });
    el("rect", { x: 0, y: 940, width: 1600, height: 60, fill: "#9CC58A" }, L); [[150, 980], [210, 700]].forEach(([x, y]) => tree2(L, x, y, 50)); },
};
STAGE_DEF.gakkou2 = { ground: "#BFE3A6", sky: "#CFEAFB", names: ["きょうしつ", "きょうしつ", "おんがくしつ", "ずこうしつ", "ずこうしつ", "きゅうしょく", "としょしつ", "たいいくかん", "きょうしつ"],
  fills: { きょうしつ: "#FFE3B3", おんがくしつ: "#E7DCFA", ずこうしつ: "#FFE0CC", きゅうしょく: "#FFF1B8", としょしつ: "#D7F0D2", たいいくかん: "#F0DDB8" } };
RIVAL_OF.gakkou2 = "kon";
RIVAL_TEXT.kon = { go: "いくよっ", huh: "あれ？ ちがった？", thanks: "そっか。ありがとう！", rival: "てんこうせいの こんだよ。がっこうの なかで きょうそうしよう！", rival2: "こんどは まけないよ！", win: "やった、こんの かち！", good: "たのしかったね", next: "つぎも がんばるね" };

/* ================= 盤の しかけ（ステージごと） =================
   ・とおせんぼ（"4"）：ステージごとに いる人・言う ことばが ちがう（BLOCK_DEF）
   ・とまると うごく マス（events）：〇マス すすむ／〇マス もどる／スタートに もどる */
const BLOCK_DEF = {
  undou: { who: "doshin", sleep: false, intro: ["p_blk_undou", "どしんが たいそうしてて とおれない！"], say: ["blk_undou", "とおして ください"], to: "どしんに いおう",
    keys: [["とおして", "通して", "とうして"], ["ください", "下さい"]], res: ["rs_undou", "あっ、ごめんね。どうぞ、どうぞ"] },
  kouen: { who: "kamejii", sleep: false, intro: ["p_blk_kouen", "かめじいが はとに えさを あげてる！"], say: ["blk_kouen", "すみません、とおります"], to: "かめじいに いおう",
    keys: [["すみません", "済みません"], ["とおります", "通ります", "とうります"]], res: ["rs_kouen", "ほっほ、どうぞ どうぞ"] },
  omise: { who: "doshinpapa", sleep: false, intro: ["p_blk_omise", "どしんの おとうさんが にもつで たいへんそう！"], say: ["blk_omise", "てつだいましょうか"], to: "どしんの おとうさんに いおう",
    keys: [["てつだ", "手伝"]], res: ["rs_omise", "ありがとう。もう だいじょうぶ。さきに どうぞ"] },
  densha: { who: "kamejii", sleep: true, intro: ["p_kame", "かめじいが ねてる！"], say: ["blk_densha", "すみません、とおして ください"], to: "かめじいに いおう",
    keys: [["すみません", "済みません"], ["とおして", "通して", "とうして"], ["ください", "下さい"]], res: ["rs_densha", "おお、すまんのう。どうぞ"] },
  gakkou2: { who: "kamejii", sleep: false, intro: ["p_blk_gakkou2", "こうちょうせんせいが いるよ。あいさつ しよう！"], say: ["blk_gakkou2", "おはよう ございます"], to: "こうちょうせんせいに いおう",
    keys: [["おはよう", "お早う"], ["ござい", "御座い"]], res: ["rs_gakkou2", "ほっほ、おはよう。げんきが いいのう"] },
};
Object.entries(BLOCK_DEF).forEach(([st, d]) => SLEEPER_OF[st] = d.who);
PIECE_S.doshinpapa = .28;
function blockSleeps() { const d = BLOCK_DEF[curStage]; return d ? d.sleep : true; }
const blockEventK = blockEvent;
blockEvent = async function (pc = P.shima) {
  const d = BLOCK_DEF[curStage]; if (!d) return blockEventK(pc);
  const dtries = [];
  await speak(C.pony, d.intro[0], d.intro[1]); surprise(pc);
  showTask(d.say[1], d.to, 520);
  for (let a = 0; a < 2; a++) {
    await speak(C.pony, d.say[0], d.say[1]);
    setListen(pc, true); const r = await listen(d.keys); setListen(pc, false);
    dtries.push(`${r.r === "ok" ? "○" : r.r === "part" ? "△" : "×"}${r.heard || ""}`);
    if (r.r === "ok") { joy(pc); GS.ok++; if (pc.player) pc.player.ok++; break; }
    if (a === 0) await speak(C.pony, "p_again", "もう いっかい いってみよう");
  }
  playLog({ type: "doite", ok: dtries.some(x => x[0] === "○"), tries: dtries, stage: curStage });
  hideTask(); doshinAsleep = false; delete P.doshin.tm.closed; surprise(P.doshin); await sleep(700);
  await speak(P.doshin, d.res[0], d.res[1]);
  P.doshin.tm.run = 1.2;
  if (MODE === "solo" && P.gao.node === BLOCK) { const [gx, gy] = nodeXY(P.gao, BLOCK); slide(P.gao, gx, gy, .4, .3); }
  const [ax, ay] = sleeperAway(); await slide(P.doshin, ax, ay, 1.1); P.doshin.node = null;
};
/* とまると うごく マス */
const EVENTS = {
  undou: { a2: ["fwd", 3, "ev_baton", "バトンを もらった！ 3マス すすむよ"], b3: ["home", 0, "ev_sunaba", "すなに はまっちゃった！ スタートに もどるよ"], m2: ["back", 2, "ev_kutsu", "くつが ぬげちゃった！ 2マス もどるよ"] },
  kouen: { "5": ["fwd", 2, "ev_kaze", "かぜに のって 2マス すすむよ"], b1: ["home", 0, "ev_ishi", "いしから すべって びしょぬれ！ スタートに もどるよ"], c2: ["back", 2, "ev_boushi", "ぼうしが とんだ！ 2マス もどるよ"] },
  omise: { a3: ["fwd", 3, "ev_kuji", "くじびきで あたり！ 3マス すすむよ"], b2: ["back", 2, "ev_otsuri", "おつりを わすれた！ 2マス もどるよ"], d1: ["home", 0, "ev_saifu", "おさいふを わすれた！ スタートに もどるよ"] },
  densha: { a2: ["fwd", 3, "ev_kyuukou", "きゅうこうに のれた！ 3マス すすむよ"], b3: ["back", 2, "ev_juutai", "バスが じゅうたい！ 2マス もどるよ"], d1: ["home", 0, "ev_norisugoshi", "のりすごしちゃった！ スタートに もどるよ"] },
  gakkou2: { a1: ["fwd", 2, "ev_kaidan", "かいだんを かけあがって 2マス すすむよ"], m2: ["back", 2, "ev_wasuremono", "わすれものを とりに 2マス もどるよ"], d1: ["home", 0, "ev_uwabaki", "うわばきを わすれた！ スタートに もどるよ"] },
};
const EV_STYLE = { fwd: ["#7CC36A", n => `+${n}`], back: ["#FF8FA3", n => `−${n}`], home: ["#B9A8D9", () => "もどる"] };
// 通った マスを おぼえて おく（「もどる」は 来た 道を もどる）
const hopB = hop;
hop = async function (pc, id, dur, i = 0) { if (!pc.backing) (pc.trail = pc.trail || []).push(pc.node); return hopB(pc, id, dur, i); };
const setPieceB = setPiece;
setPiece = function (pc, id) { pc.trail = []; setPieceB(pc, id); };
const moveByE = moveBy;
moveBy = async function (pc, n) { await moveByE(pc, n); if (!winner) await boardEvent(pc); };
async function boardEvent(pc) {
  const ev = (EVENTS[curStage] || {})[pc.node]; if (!ev) return;
  const [type, n, key, text] = ev;
  await sleep(300); markAbove(pc, type === "fwd" ? "sparkle" : "ex"); if (type === "fwd") chime(); else blip(500, 200, .3, "triangle");
  showBanner(text.split("！")[0] + (text.includes("！") ? "！" : ""), 1400); await speak(C.pony, key, text);
  if (type === "fwd") { for (let i = 0; i < n; i++) { const nx = NEXT(pc.node); if (!nx.length) break; const to = nx[0]; await hop(pc, to, .3, i);
      if (to === GOAL) { if (!winner) { winnerPc = pc; winner = MODE === "multi" ? pc.kind : pc === P.shima ? "child" : "gao"; } return; } } }
  else if (type === "back") { pc.backing = true; for (let i = 0; i < n; i++) { const to = (pc.trail || []).pop(); if (!to) break; await hop(pc, to, .3, i); } pc.backing = false; }
  else { pc.trail = []; const [x, y] = nodeXY(pc, "0"); pc.node = "0"; jump(pc, 1); await slide(pc, x, y, 1.2, .8); }
  await sleep(300);
}
// しかけの マスは 色と しるしで 見せる
const drawBoardE = drawBoard;
drawBoard = function () {
  drawBoardE(); const evs = EVENTS[curStage]; if (!evs || !BOARD[curStage]) return;
  Object.entries(evs).forEach(([id, [type, n]]) => { const [x, y] = NODES[id]; const [c, label] = EV_STYLE[type];
    el("circle", { cx: x, cy: y, r: 34, fill: c, ...S6(4) }, boardLayer); txt(boardLayer, x, y + (type === "home" ? 7 : 11), label(n), type === "home" ? 20 : 32, { "text-anchor": "middle" }); });
};
