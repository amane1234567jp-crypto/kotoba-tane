/* ================= ステージ（うんどうじょう・こうえん・おみせ・でんしゃとバス） =================
   盤の形（15マス・分かれ道・どしん）は こうしゃ と同じ。部屋の名前・色・かざり・場面だけが変わる。
   声は ステージを はじめるときに packs/<ステージ>.json から まとめて 読みこむ（遊ぶ前に 全部 用意しておく）。 */
const KOUSHA_ZONES = ZONES.map(z => ({ ...z }));
const ZMAP = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // ZONES の 0〜8 番（9 はゴール）
const STAGE_DEF = {
  undou: { ground: "#E9D3A3", sky: "#CFEAFB", names: ["てつぼう", "てつぼう", "トラック", "すなば", "すなば", "みずのみば", "てつぼう", "トラック", "みずのみば"],
    fills: { てつぼう: "#FFE3B3", トラック: "#FFD9CF", すなば: "#F6E7B8", みずのみば: "#D7ECFF" } },
  kouen: { ground: "#BFE3A6", sky: "#CFEAFB", names: ["すべりだい", "すべりだい", "ブランコ", "いけ", "いけ", "ベンチ", "すべりだい", "ブランコ", "ベンチ"],
    fills: { すべりだい: "#FFE3B3", ブランコ: "#FFE0E6", いけ: "#CFEFF8", ベンチ: "#F1EAD8" } },
  omise: { ground: "#E6E0D4", sky: "#FFF4D6", names: ["パンや", "パンや", "やおや", "おかしや", "おかしや", "レジ", "パンや", "やおや", "レジ"],
    fills: { パンや: "#FFE3B3", やおや: "#DDF2D0", おかしや: "#FFE0EE", レジ: "#E3E9FF" } },
  densha: { ground: "#D9DDE3", sky: "#CFEAFB", names: ["えき", "えき", "でんしゃ", "バスてい", "バスてい", "バス", "えき", "でんしゃ", "バス"],
    fills: { えき: "#FFF1C9", でんしゃ: "#D7ECFF", バスてい: "#E9E0F5", バス: "#DDF3EE" } },
};
/* ステージごとの ライバル と ねている役 */
const RIVAL_OF = { kousha: "gao", undou: "pyon", kouen: "mii", omise: "chu", densha: "doshin" };
const SLEEPER_OF = { densha: "kamejii" };
/* ステージごとの 盤の形（マスの つながりは 同じ・置き場所が ちがう）。run = 色分けの まとまり（道に そって 色の帯を ひく） */
const KOUSHA_NODES = JSON.parse(JSON.stringify(NODES));
const LAYOUT = {
  undou: { nodes: { "0": [180, 880, "start"], "1": [400, 900], "2": [620, 910], "3": [840, 910], "4": [1060, 900, "block"], "5": [1280, 870], "6": [1450, 720, "fork"], "7u": [1420, 520], "8u": [1260, 330], "7d": [1240, 640], "8d": [1100, 520], "9": [1000, 330], "10": [780, 280], "11": [560, 300], "12": [420, 450], "13": [520, 620], "14": [720, 650], "15": [920, 630, "goal"] },
    runs: [["てつぼう", ["0", "1", "2"]], ["トラック", ["3", "4", "5"]], ["すなば", ["6", "7u", "8u"]], ["すなば", ["6", "7d", "8d"]], ["みずのみば", ["9", "10", "11"]], ["てつぼう", ["12", "13", "14"]]], away: [1060, 760] },
  kouen: { nodes: { "0": [180, 900, "start"], "1": [380, 880], "2": [560, 800], "3": [720, 880], "4": [900, 920, "block"], "5": [1100, 880], "6": [1260, 780, "fork"], "7u": [1120, 560], "8u": [1040, 400], "7d": [1420, 660], "8d": [1400, 480], "9": [1220, 320], "10": [930, 250], "11": [700, 320], "12": [500, 440], "13": [480, 640], "14": [680, 660], "15": [860, 600, "goal"] },
    runs: [["すべりだい", ["0", "1", "2"]], ["ブランコ", ["3", "4", "5"]], ["いけ", ["6", "7u", "8u"]], ["いけ", ["6", "7d", "8d"]], ["ベンチ", ["9", "10", "11"]], ["すべりだい", ["12", "13", "14"]]], away: [900, 780] },
  omise: { nodes: { "0": [480, 260, "start"], "1": [700, 260], "2": [920, 260], "3": [1140, 280], "4": [1360, 330, "block"], "5": [1460, 520], "6": [1300, 660, "fork"], "7u": [1080, 560], "8u": [860, 520], "7d": [1100, 780], "8d": [860, 780], "9": [640, 660], "10": [420, 760], "11": [260, 900], "12": [480, 920], "13": [700, 920], "14": [940, 930], "15": [1180, 915, "goal"] },
    runs: [["パンや", ["0", "1", "2"]], ["やおや", ["3", "4", "5"]], ["おかしや", ["6", "7u", "8u"]], ["おかしや", ["6", "7d", "8d"]], ["パンや", ["9", "10", "11"]], ["レジ", ["12", "13", "14"]]], away: [1240, 430] },
  densha: { nodes: { "0": [1250, 290, "start"], "1": [1030, 270], "2": [810, 260], "3": [590, 280], "4": [440, 430, "block"], "5": [400, 640], "6": [480, 840, "fork"], "7u": [680, 700], "8u": [900, 680], "7d": [720, 900], "8d": [960, 910], "9": [1160, 800], "10": [1360, 860], "11": [1470, 680], "12": [1360, 510], "13": [1150, 560], "14": [960, 470], "15": [760, 470, "goal"] },
    runs: [["えき", ["0", "1", "2", "3"]], ["でんしゃ", ["4", "5"]], ["バスてい", ["6", "7u", "8u"]], ["バスてい", ["6", "7d", "8d"]], ["バス", ["9", "10", "11"]], ["でんしゃ", ["12", "13", "14"]]], away: [280, 540] },
};
const zoneOfKousha = zoneOf;
zoneOf = function (id) { const L = LAYOUT[curStage]; if (!L) return zoneOfKousha(id); const r = L.runs.find(([, ids]) => ids.includes(id)); return r ? r[0] : L.runs[0][0]; };
function sleeperAway() { const L = LAYOUT[curStage]; return L ? L.away : [1000, 792]; }
function applyStage(id) {
  curStage = id;
  ZONES.forEach((z, i) => Object.assign(z, KOUSHA_ZONES[i]));
  Object.keys(NODES).forEach(k => NODES[k] = (LAYOUT[id] ? LAYOUT[id].nodes : KOUSHA_NODES)[k].slice());
  RIVAL = RIVAL_OF[id] || "gao"; SLEEPER = SLEEPER_OF[id] || "doshin";
  P.gao = piece(RIVAL); P.doshin = piece(SLEEPER); delete P.gao.tm.closed; P.gao.human = false;
  BOARD_PIECES = [P.doshin, P.shima, P.gao];
  const d = STAGE_DEF[id]; if (!d) return;
  ZMAP.forEach(i => { const z = ZONES[i]; z.name = d.names[i]; z.fill = d.fills[z.name]; });
}
/* ---------- 盤 ---------- */
const drawBoardKousha = drawBoard;
drawBoard = function () {
  const d = STAGE_DEF[curStage]; if (!d) return drawBoardKousha();
  // こうしゃ用の かざり（げたばこの棚 など）は かかないように、こうしゃの描画を使わず ここで かく
  boardLayer.innerHTML = "";
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: d.ground }, boardLayer);
  BOARD_DECO[curStage] && BOARD_DECO[curStage](boardLayer);
  const L = LAYOUT[curStage], fills = d.fills;
  const pts = ids => ids.map((id, i) => (i ? "L" : "M") + NODES[id][0] + " " + NODES[id][1]).join(" ");
  L.runs.forEach(([name, ids]) => { const p = pts(ids); // 部屋の色の帯（道より 太く）
    el("path", { d: p, fill: "none", stroke: INK, "stroke-width": 184, "stroke-linejoin": "round", "stroke-linecap": "round" }, boardLayer);
    el("path", { d: p, fill: "none", stroke: fills[name], "stroke-width": 172, "stroke-linejoin": "round", "stroke-linecap": "round" }, boardLayer); });
  { const [gx, gy] = NODES[GOAL]; el("circle", { cx: gx, cy: gy, r: 110, fill: "#FFD25E", ...S6(6) }, boardLayer); }
  const order = [["0", "1", "2", "3", "4", "5", "6", "7u", "8u", "9", "10", "11", "12", "13", "14", "15"], ["6", "7d", "8d", "9"]];
  order.forEach(o => { const p = pts(o);
    el("path", { d: p, fill: "none", stroke: INK, "stroke-width": 66, "stroke-linejoin": "round", "stroke-linecap": "round" }, boardLayer);
    el("path", { d: p, fill: "none", stroke: "#FFF8E8", "stroke-width": 54, "stroke-linejoin": "round", "stroke-linecap": "round" }, boardLayer);
    el("path", { d: p, fill: "none", stroke: "#F2D9A8", "stroke-width": 6, "stroke-dasharray": "2 22", "stroke-linecap": "round" }, boardLayer); });
  { const [gx, gy] = NODES[GOAL]; txt(boardLayer, gx, gy - 72, "ゴール", 34, { "text-anchor": "middle", stroke: "#FFFFFF", "stroke-width": 8, "paint-order": "stroke" }); }
  Object.entries(NODES).forEach(([id, [x, y, k]]) => {
    const g = el("g", {}, boardLayer); const z = { fill: fills[zoneOf(id)] };
    if (k === "goal") { el("circle", { cx: x, cy: y, r: 58, fill: "#FFFFFF", ...S6(6) }, g); el("path", { d: `M${x - 14} ${y + 34} V${y - 40}`, ...S6(6) }, g);
      el("path", { d: `M${x - 12} ${y - 40} L${x + 34} ${y - 26} L${x - 12} ${y - 10} Z`, fill: "#FF6F91", ...S6(5) }, g); return; }
    el("circle", { cx: x, cy: y, r: 44, fill: "#FFFFFF", ...S6(6) }, g);
    if (k === "start") txt(g, x, y + 10, "スタート", 22, { "text-anchor": "middle" });
    else if (k === "fork") el("path", { d: `M${x - 20} ${y + 18} L${x} ${y - 4} L${x + 20} ${y + 18} M${x} ${y - 4} V${y - 26} M${x - 10} ${y - 16} L${x} ${y - 26} L${x + 10} ${y - 16}`, fill: "none", ...S6(6) }, g);
    else el("circle", { cx: x, cy: y, r: 26, fill: z ? z.fill : "#FFF1C9", ...S6(4) }, g);
  });  // 部屋の名前（分かれ道の 2本目は くりかえさない）
  const named = new Set();
  L.runs.forEach(([name, ids]) => { if (ids[0] === FORK && named.has(name)) return; named.add(name);
    const cx = ids.reduce((a, i) => a + NODES[i][0], 0) / ids.length, cy = ids.reduce((a, i) => a + NODES[i][1], 0) / ids.length;
    const ty = cy < 500 ? cy - 100 : cy + 124; txt(boardLayer, cx, Math.max(150, Math.min(988, ty)), name, 28, { "text-anchor": "middle", stroke: "#FFFFFF", "stroke-width": 8, "paint-order": "stroke" }); });
};
const tree2 = (L, x, y, r = 40) => { el("rect", { x: x - 10, y: y - 20, width: 20, height: 46, rx: 6, fill: "#9A6B43", ...S6(4) }, L); el("circle", { cx: x, cy: y - 40, r, fill: "#6DBB5E", ...S6(4) }, L); };
const BOARD_DECO = { // 盤の 地面の もよう（道に かからない 軽い もの）
  undou(L) { for (let y = 60; y < 1000; y += 120) el("path", { d: `M0 ${y} H1600`, stroke: "#FFFFFF55", "stroke-width": 6, "stroke-dasharray": "40 30" }, L); },
  kouen(L) { for (let i = 0; i < 40; i++) { const x = (i * 397) % 1600, y = 140 + (i * 233) % 860; el("path", { d: `M${x} ${y} l8 -16 l8 16`, fill: "none", stroke: "#6DBB5E", "stroke-width": 4 }, L); } },
  omise(L) { for (let x = 0; x < 1600; x += 120) el("rect", { x, y: 0, width: 60, height: 1000, fill: "#00000008" }, L); },
  densha(L) { for (let y = 40; y < 1000; y += 80) el("path", { d: `M0 ${y} H1600`, stroke: "#00000010", "stroke-width": 30 }, L); },
};
const BOARD_ROOMS = {
  undou(L) { // てつぼう・すなば・みずのみば の目じるし
    el("path", { d: "M70 760 V700 H170 V760 M120 700 V760", fill: "none", ...S6(6) }, L);
    el("rect", { x: 1310, y: 690, width: 160, height: 60, rx: 20, fill: "#E9C893", ...S6(4) }, L);
    el("rect", { x: 1060, y: 230, width: 140, height: 40, rx: 8, fill: "#BDE3F2", ...S6(4) }, L); },
  kouen(L) { el("path", { d: "M70 760 L70 690 L120 690 L190 760", fill: "#FF8FA3", ...S6(5) }, L);
    el("ellipse", { cx: 1060, cy: 520, rx: 70, ry: 30, fill: "#7FCBF0", ...S6(4) }, L);
    el("rect", { x: 1060, y: 380, width: 140, height: 26, rx: 8, fill: "#C98A4B", ...S6(4) }, L); },
  omise(L) { [[60, 690, "#E8735A"], [1060, 380, "#7CC36A"]].forEach(([x, y, c]) => { for (let i = 0; i < 4; i++) el("rect", { x: x + i * 40, y, width: 40, height: 30, fill: i % 2 ? "#FFFFFF" : c, ...S6(3) }, L); }); },
  densha(L) { el("rect", { x: 60, y: 690, width: 170, height: 60, rx: 18, fill: "#7FCBF0", ...S6(4) }, L); el("rect", { x: 80, y: 700, width: 40, height: 26, fill: "#FFFFFF", ...S6(3) }, L); el("rect", { x: 140, y: 700, width: 40, height: 26, fill: "#FFFFFF", ...S6(3) }, L);
    el("path", { d: "M1100 400 V300", ...S6(6) }, L); el("circle", { cx: 1100, cy: 292, r: 18, fill: "#FFFFFF", ...S6(4) }, L); },
};

/* ---------- 場面の背景 ---------- */
const OUTDOOR = new Set(["てつぼう", "トラック", "すなば", "みずのみば", "すべりだい", "ブランコ", "ベンチ", "いけ", "バスてい", "えき"]);
const drawRoomKousha = drawRoom;
drawRoom = function (place, noSign = false) {
  if (!ROOMS[place]) return drawRoomKousha(place, noSign);
  sceneLayer.innerHTML = ""; const L = sceneLayer, out = OUTDOOR.has(place);
  const wall = { パンや: "#FFEFD9", やおや: "#F1F8E6", おかしや: "#FFF0F6", レジ: "#EEF1FF", でんしゃ: "#EAF4FB", バス: "#EAF7F2" }[place] || "#CFEAFB";
  const floor = { てつぼう: "#E9C893", トラック: "#E3B48F", すなば: "#F2DFAE", みずのみば: "#D9D3C7", すべりだい: "#B9DE9F", ブランコ: "#B9DE9F", ベンチ: "#B9DE9F", いけ: "#B9DE9F", えき: "#C9C9C9", バスてい: "#C9C9C9", でんしゃ: "#9FB3C8", バス: "#9FB3C8" }[place] || "#E9C893";
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: wall }, L);
  if (out) { el("circle", { cx: 1460, cy: 120, r: 60, fill: "#FFE27A", ...S6(5) }, L); [[200, 140], [700, 90]].forEach(([x, y]) => [[0, 0, 50], [50, -18, 40], [90, 6, 36]].forEach(([dx, dy, r]) => el("circle", { cx: x + dx, cy: y + dy, r, fill: "#FFFFFF" }, L))); }
  el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: floor }, L);
  el("path", { d: "M0 760 H1600", ...S6(6) }, L);
  ROOMS[place](L);
  if (!noSign) { const g = el("g", {}, L); el("rect", { x: 620, y: 24, width: 360, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, place.length > 5 ? 40 : 46, { "text-anchor": "middle" }); }
};
const R6 = S6;
function sceneTree(L, x, r) { el("rect", { x: x - 26, y: 760 - 330, width: 52, height: 340, rx: 10, fill: "#9A6B43", ...S6(6) }, L); el("circle", { cx: x, cy: 760 - 360, r, fill: "#6DBB5E", ...S6(6) }, L); el("circle", { cx: x - r * .6, cy: 760 - 300, r: r * .6, fill: "#6DBB5E", ...S6(6) }, L); }
const ROOMS = {
  てつぼう(L) { [[860, 520], [1080, 580], [1300, 640]].forEach(([x, y]) => { el("path", { d: `M${x} 760 V${y} M${x + 200} 760 V${y}`, ...R6(12), fill: "none" }, L); el("path", { d: `M${x - 6} ${y} H${x + 206}`, stroke: "#B0B7C3", "stroke-width": 14, "stroke-linecap": "round" }, L); el("path", { d: `M${x - 6} ${y} H${x + 206}`, ...R6(3), fill: "none" }, L); });
    sceneTree(L, 1480, 110); },
  トラック(L) { for (let i = 0; i < 4; i++) el("path", { d: `M0 ${800 + i * 55} H1600`, stroke: "#FFFFFF", "stroke-width": 8 }, L);
    el("path", { d: "M1360 760 V560 M1500 760 V560", ...R6(8), fill: "none" }, L); el("path", { d: "M1360 600 H1500", stroke: "#FF6F91", "stroke-width": 10 }, L);
    for (let i = 0; i < 8; i++) el("path", { d: `M${i * 200 + 40} 200 l40 0 l-20 40 Z`, fill: ["#FF6F91", "#FFD25E", "#7FCBF0", "#7CC36A"][i % 4], ...R6(3) }, L); el("path", { d: "M0 200 H1600", ...R6(4) }, L); },
  すなば(L) { el("rect", { x: 700, y: 780, width: 860, height: 160, rx: 40, fill: "#F6E2A8", ...R6(6) }, L); el("rect", { x: 680, y: 770, width: 900, height: 30, rx: 12, fill: "#C98A4B", ...R6(5) }, L);
    el("path", { d: "M1400 760 L1430 700 L1480 700 L1510 760 Z", fill: "#FF8FA3", ...R6(5) }, L); },
  みずのみば(L) { el("rect", { x: 820, y: 560, width: 700, height: 200, rx: 12, fill: "#E6E6E6", ...R6(6) }, L);
    [900, 1100, 1300, 1460].forEach(x => { el("path", { d: `M${x} 560 V520 H${x + 30}`, ...R6(8), fill: "none" }, L); el("circle", { cx: x, cy: 512, r: 10, fill: "#7FCBF0", ...R6(4) }, L); }); },
  すべりだい(L) { el("path", { d: "M180 760 V380 M300 760 V380", ...R6(10), fill: "none" }, L); for (let y = 420; y < 760; y += 60) el("path", { d: `M180 ${y} H300`, ...R6(6) }, L);
    el("rect", { x: 160, y: 360, width: 160, height: 30, rx: 8, fill: "#FFD25E", ...R6(5) }, L); el("path", { d: "M300 370 Q520 420 640 740 L700 760 L720 730 Q600 420 320 350 Z", fill: "#FF8FA3", ...R6(6) }, L); },
  ブランコ(L) { el("path", { d: "M860 760 L940 280 L1500 280 L1580 760", fill: "none", ...R6(12) }, L); el("path", { d: "M920 280 H1520", ...R6(16) }, L);
    [1060, 1300].forEach(x => { el("path", { d: `M${x} 280 V620 M${x + 90} 280 V620`, ...R6(5), fill: "none" }, L); el("rect", { x: x - 10, y: 616, width: 110, height: 20, rx: 6, fill: "#E8735A", ...R6(4) }, L); }); },
  ベンチ(L) { sceneTree(L, 1480, 120); el("rect", { x: 820, y: 640, width: 420, height: 30, rx: 8, fill: "#C98A4B", ...R6(5) }, L); el("rect", { x: 820, y: 580, width: 420, height: 26, rx: 8, fill: "#C98A4B", ...R6(5) }, L);
    el("path", { d: "M850 670 V760 M1210 670 V760", ...R6(8) }, L); el("rect", { x: 1290, y: 640, width: 90, height: 120, rx: 10, fill: "#7CC36A", ...R6(5) }, L); txt(L, 1335, 712, "ゴミ", 26, { "text-anchor": "middle" }); },
  いけ(L) { el("ellipse", { cx: 1100, cy: 850, rx: 520, ry: 110, fill: "#7FCBF0", ...R6(6) }, L); [[960, 840], [1180, 880], [1360, 830]].forEach(([x, y]) => el("ellipse", { cx: x, cy: y, rx: 60, ry: 18, fill: "#7CC36A", ...R6(4) }, L));
    for (let x = 560; x < 1600; x += 80) el("path", { d: `M${x} 760 V690`, ...R6(6) }, L); el("path", { d: "M560 705 H1600", ...R6(6) }, L); },
  パンや(L) { awning(L, "#E8735A"); shelfOf(L, 880, 260, 620, 3, ["#E9B872", "#D99A4E", "#F2C38F"], "bread"); counter(L); },
  やおや(L) { awning(L, "#7CC36A"); for (let i = 0; i < 3; i++) { el("rect", { x: 860 + i * 230, y: 600, width: 200, height: 160, rx: 8, fill: "#C98A4B", ...R6(5) }, L);
      for (let j = 0; j < 5; j++) el("circle", { cx: 895 + i * 230 + j * 32, cy: 595, r: 18, fill: ["#E8473C", "#F29F38", "#7CC36A"][i], ...R6(4) }, L); } },
  おかしや(L) { awning(L, "#FF8FA3"); shelfOf(L, 760, 260, 560, 3, ["#FF8FA3", "#FFD25E", "#7FCBF0", "#B9A8D9"], "candy");
    el("rect", { x: 1350, y: 620, width: 230, height: 140, rx: 8, fill: "#C98A4B", ...R6(5) }, L); el("rect", { x: 1460, y: 520, width: 110, height: 100, rx: 10, fill: "#5E6A7A", ...R6(5) }, L); el("rect", { x: 1474, y: 536, width: 82, height: 30, rx: 5, fill: "#BDF2C9", ...R6(3) }, L);
    el("rect", { x: 1370, y: 570, width: 80, height: 50, rx: 6, fill: "#B9A8D9", ...R6(4) }, L); [1385, 1410, 1435].forEach(x => el("rect", { x: x - 8, y: 556, width: 16, height: 26, rx: 4, fill: "#FFFFFF", ...R6(3) }, L)); },
  レジ(L) { awning(L, "#7FCBF0"); counter(L); el("rect", { x: 1180, y: 470, width: 160, height: 110, rx: 12, fill: "#5E6A7A", ...R6(6) }, L); el("rect", { x: 1200, y: 490, width: 120, height: 40, rx: 6, fill: "#BDF2C9", ...R6(4) }, L); },
  えき(L) { el("rect", { x: 1120, y: 260, width: 400, height: 420, rx: 10, fill: "#F6EEDF", ...R6(6) }, L); el("rect", { x: 1180, y: 350, width: 280, height: 150, rx: 8, fill: "#BDE3F2", ...R6(5) }, L); txt(L, 1320, 330, "きっぷうりば", 30, { "text-anchor": "middle" });
    el("rect", { x: 0, y: 680, width: 1600, height: 80, fill: "#8C8478" }, L); el("path", { d: "M0 706 H1600 M0 740 H1600", stroke: "#5B5B5B", "stroke-width": 8 }, L); // おくの せんろ
    el("rect", { x: 0, y: 760, width: 1600, height: 18, fill: "#EDEDED" }, L); el("path", { d: "M0 818 H1600", stroke: "#FFD25E", "stroke-width": 16, "stroke-dasharray": "30 10" }, L); // ホームの はしと きいろい せん
    el("path", { d: "M440 680 V330", ...R6(8) }, L); el("rect", { x: 280, y: 250, width: 320, height: 80, rx: 12, fill: "#FFFFFF", ...R6(6) }, L); txt(L, 440, 305, "がっこうまええき", 34, { "text-anchor": "middle" }); },
  でんしゃ(L) { for (let x = 120; x < 1600; x += 380) { el("rect", { x, y: 220, width: 300, height: 220, rx: 18, fill: "#BDE3F2", ...R6(6) }, L); }
    el("rect", { x: 300, y: 690, width: 620, height: 70, rx: 16, fill: "#5F8FCB", ...R6(6) }, L); // ながい せき
    el("rect", { x: 0, y: 560, width: 1600, height: 90, rx: 0, fill: "#7FA7D9", ...R6(5) }, L); el("path", { d: "M0 150 H1600", ...R6(6) }, L);
    for (let x = 160; x < 1600; x += 160) { el("path", { d: `M${x} 150 V200`, ...R6(4) }, L); el("circle", { cx: x, cy: 214, r: 14, fill: "none", ...R6(5) }, L); } },
  バスてい(L) { el("rect", { x: 0, y: 680, width: 1600, height: 120, fill: "#7A7F88" }, L); el("path", { d: "M0 740 H1600", stroke: "#FFFFFF", "stroke-width": 8, "stroke-dasharray": "60 40" }, L); // おくが どうろ
    el("rect", { x: 0, y: 800, width: 1600, height: 22, fill: "#E3E3E3", ...R6(4) }, L); // てまえが ほどう
    el("path", { d: "M1460 880 V420", ...R6(10) }, L); el("circle", { cx: 1460, cy: 390, r: 60, fill: "#FFFFFF", ...R6(6) }, L); txt(L, 1460, 406, "バス", 36, { "text-anchor": "middle" });
    el("rect", { x: 860, y: 780, width: 360, height: 26, rx: 8, fill: "#C98A4B", ...R6(5) }, L); el("path", { d: "M880 806 V870 M1200 806 V870", ...R6(8) }, L); },
  バス(L) { for (let x = 80; x < 1500; x += 340) el("rect", { x, y: 240, width: 280, height: 200, rx: 20, fill: "#BDE3F2", ...R6(6) }, L);
    for (let x = 100; x < 1500; x += 340) { el("rect", { x, y: 600, width: 220, height: 50, rx: 14, fill: "#E8735A", ...R6(5) }, L); el("rect", { x: x + 150, y: 500, width: 60, height: 110, rx: 14, fill: "#E8735A", ...R6(5) }, L); }
    el("circle", { cx: 1520, cy: 520, r: 26, fill: "#FFD25E", ...R6(5) }, L); el("path", { d: "M0 150 H1600", ...R6(6) }, L); },
};
function awning(L, c) { for (let i = 0; i < 16; i++) el("path", { d: `M${i * 100} 130 h100 v60 q-50 30 -100 0 Z`, fill: i % 2 ? "#FFFFFF" : c, ...S6(4) }, L); el("path", { d: "M0 130 H1600", ...S6(5) }, L); }
function counter(L) { el("rect", { x: 1060, y: 580, width: 520, height: 180, rx: 10, fill: "#C98A4B", ...S6(6) }, L); el("rect", { x: 1040, y: 560, width: 560, height: 30, rx: 8, fill: "#E0A060", ...S6(5) }, L); }
function shelfOf(L, x, y, w, rows, cols, kind) {
  el("rect", { x, y, width: w, height: rows * 100 + 20, rx: 8, fill: "#C98A4B", ...S6(6) }, L);
  for (let r = 0; r < rows; r++) { el("path", { d: `M${x} ${y + 110 + r * 100} H${x + w}`, ...S6(5) }, L);
    for (let c = 0; c < 6; c++) { const cx = x + 55 + c * (w - 80) / 6, cy = y + 80 + r * 100;
      if (kind === "bread") el("ellipse", { cx, cy, rx: 38, ry: 24, fill: cols[(r + c) % cols.length], ...S6(4) }, L);
      else { el("rect", { x: cx - 26, y: cy - 50, width: 52, height: 64, rx: 12, fill: "#FFFFFF", ...S6(4) }, L); for (let k = 0; k < 3; k++) el("circle", { cx: cx - 12 + k * 12, cy: cy - 10 - (k % 2) * 14, r: 9, fill: cols[(r + c + k) % cols.length] }, L); } } }
}

/* ---------- 小物 ---------- */
Object.assign(ITEM2, {
  hat(g) { el("path", { d: "M-70 10 Q-70 -60 0 -60 Q70 -60 70 10 Z", fill: "#FFD25E", ...S6p() }, g); el("path", { d: "M-100 10 H100", ...S6p(10) }, g); },
  shovel(g) { el("path", { d: "M0 -90 V30", ...S6p(10) }, g); el("path", { d: "M-34 30 H34 L24 90 Q0 110 -24 90 Z", fill: "#FF6F91", ...S6p() }, g); },
  castle(g) { el("path", { d: "M-110 60 V-20 H-70 V-50 H-40 V-20 H40 V-50 H70 V-20 H110 V60 Z", fill: "#F2D398", ...S6p() }, g); el("path", { d: "M-15 60 V20 Q0 0 15 20 V60", fill: "#C9A27A", ...S6p(5) }, g); el("path", { d: "M55 -50 V-100 L90 -85 L55 -72", fill: "#FF6F91", ...S6p(5) }, g); },
  ball(g) { el("circle", { r: 60, fill: "#FF9E5E", ...S6p() }, g); el("path", { d: "M-60 0 Q0 30 60 0 M0 -60 Q-30 0 0 60", fill: "none", ...S6p(5) }, g); },
  bread(g) { el("ellipse", { rx: 90, ry: 60, fill: "#E9B872", ...S6p() }, g); el("path", { d: "M-50 -20 L50 20 M-20 -45 L60 -5 M-60 10 L20 45", stroke: "#B97A3A", "stroke-width": 7 }, g); },
  bearbread(g) { el("circle", { r: 70, fill: "#D99A4E", ...S6p() }, g); [[-55, -55], [55, -55]].forEach(([x, y]) => el("circle", { cx: x, cy: y, r: 26, fill: "#D99A4E", ...S6p() }, g)); el("circle", { cx: -22, cy: -6, r: 8, fill: INK }, g); el("circle", { cx: 22, cy: -6, r: 8, fill: INK }, g); el("ellipse", { cy: 22, rx: 22, ry: 14, fill: "#F2C38F", ...S6p(4) }, g); },
  wrapper(g) { el("path", { d: "M-40 -20 L30 -30 L45 10 L-10 30 L-45 15 Z", fill: "#FFD25E", ...S6p(5) }, g); },
  snack(g) { el("rect", { x: -60, y: -70, width: 120, height: 140, rx: 14, fill: "#FF6F91", ...S6p() }, g); el("circle", { r: 30, fill: "#FFD25E", ...S6p(4) }, g); },
  icecream(g) { el("path", { d: "M-40 -10 L0 110 L40 -10 Z", fill: "#E9B872", ...S6p() }, g); el("circle", { cy: -40, r: 50, fill: "#FFC2D1", ...S6p() }, g); },
  frog(g) { el("ellipse", { rx: 50, ry: 34, fill: "#7CC36A", ...S6p() }, g); [-24, 24].forEach(x => { el("circle", { cx: x, cy: -32, r: 16, fill: "#FFFFFF", ...S6p(4) }, g); el("circle", { cx: x, cy: -32, r: 6, fill: INK }, g); }); el("path", { d: "M-20 6 Q0 18 20 6", fill: "none", ...S6p(4) }, g); },
  coin(g) { el("circle", { r: 40, fill: "#DCC7A1", ...S6p() }, g); el("text", { y: 14, "text-anchor": "middle", "font-family": FONT, "font-size": 40, fill: INK }, g).textContent = "10"; },
  purse(g) { el("path", { d: "M-70 -30 H70 Q80 60 0 70 Q-80 60 -70 -30 Z", fill: "#B9A8D9", ...S6p() }, g); el("circle", { cy: -30, r: 12, fill: "#FFD25E", ...S6p(4) }, g); },
  ticket(g) { el("rect", { x: -70, y: -40, width: 140, height: 80, rx: 8, fill: "#FFF1B8", ...S6p() }, g); el("path", { d: "M-50 -10 H50 M-50 15 H20", stroke: "#9DB2E8", "stroke-width": 8 }, g); },
  bag(g) { el("rect", { x: -70, y: -50, width: 140, height: 110, rx: 22, fill: "#7FCBF0", ...S6p() }, g); el("path", { d: "M-40 -50 Q0 -110 40 -50", fill: "none", ...S6p(8) }, g); },
  memo(g) { el("rect", { x: -50, y: -65, width: 100, height: 130, rx: 6, fill: "#FFFFFF", ...S6p() }, g); [-35, -10, 15, 40].forEach(y => el("path", { d: `M-30 ${y} H30`, stroke: "#9DB2E8", "stroke-width": 7 }, g)); },
  carrot(g) { el("path", { d: "M0 90 L-28 -40 Q0 -60 28 -40 Z", fill: "#F29F38", ...S6p() }, g); el("path", { d: "M-10 -50 L-24 -90 M0 -52 V-96 M10 -50 L24 -90", stroke: "#7CC36A", "stroke-width": 10, "stroke-linecap": "round" }, g); },
  apple(g) { el("circle", { r: 40, fill: "#E8473C", ...S6p() }, g); el("path", { d: "M0 -40 V-56", ...S6p(6) }, g); el("ellipse", { cx: 14, cy: -52, rx: 14, ry: 7, fill: "#7CC36A", ...S6p(3) }, g); },
  candy(g) { el("circle", { r: 40, fill: "#FF8FA3", ...S6p() }, g); el("path", { d: "M-40 0 L-80 -26 L-80 26 Z M40 0 L80 -26 L80 26 Z", fill: "#FF8FA3", ...S6p(5) }, g); },
  price(g) { el("rect", { x: -100, y: -50, width: 200, height: 100, rx: 16, fill: "#FFFFFF", ...S6p() }, g); el("text", { y: 18, "text-anchor": "middle", "font-family": FONT, "font-size": 52, fill: "#E8473C" }, g).textContent = "100えん"; },
  cane(g) { el("path", { d: "M0 100 V-60 Q0 -90 30 -90 Q50 -90 50 -70", fill: "none", ...S6p(10) }, g); },
  wheel(g) { el("circle", { r: 70, fill: "none", ...S6p(14) }, g); el("path", { d: "M-70 0 H70 M0 0 V70", ...S6p(10) }, g); },
});
function propAt(kind, x, y, k = 1, r = 0) { return prop(kind, x, y, k, r); }
function moveProp(g, x0, y0, x1, y1, ms, k = 1, arc = 0, spin = 0) { return tween(ms, q => g.setAttribute("transform", `translate(${(x0 + (x1 - x0) * q).toFixed(0)} ${(y0 + (y1 - y0) * q - Math.sin(q * Math.PI) * arc).toFixed(0)}) rotate(${(spin * q).toFixed(0)}) scale(${k})`)); }
function onHead(c, g, k = .5, dy = -10) { follow(g, () => { const p = headTop(c); return [p.x, p.y + dy, 0, k * c.s / .88]; }); }
function waterArc(x, y) { const g = el("path", { d: `M${x} ${y} q40 -30 70 40`, fill: "none", stroke: "#7FCBF0", "stroke-width": 10, "stroke-linecap": "round" }, propG);
  let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; g.setAttribute("stroke-dasharray", `${20 + Math.sin(t * 20) * 6} 8`); }); return g; }
function vehicle(kind, y = 650) { // でんしゃ・バス・くるま（横に通りすぎる）
  const g = el("g", {}, propG); const w = kind === "car" ? 260 : 900, h = kind === "car" ? 120 : 260, c = { train: "#7FCBF0", bus: "#7CC36A", car: "#E8473C" }[kind];
  el("rect", { x: 0, y: -h, width: w, height: h, rx: 30, fill: c, ...S6p(7) }, g);
  for (let x = 40; x < w - 80; x += 150) el("rect", { x, y: -h + 30, width: 110, height: h * .4, rx: 10, fill: "#E8F7FF", ...S6p(5) }, g);
  [80, w - 80].forEach(x => el("circle", { cx: x, cy: 0, r: 34, fill: "#444", ...S6p(6) }, g));
  g.setAttribute("transform", `translate(1700 ${y})`); return g; }
function pass(g, ms = 1600, y = 650, from = 1700, to = -1200) { blip(200, 120, ms / 1000, "sawtooth"); return tween(ms, k => g.setAttribute("transform", `translate(${(from + (to - from) * k).toFixed(0)} ${y})`)); }
const horn = () => { if (!ctx) return; blip(440, 440, .35, "square"); later(420, () => blip(440, 440, .5, "square")); };
const ding = () => { if (!ctx) return; blip(1320, 1320, .25, "sine"); later(260, () => blip(990, 990, .4, "sine")); };
const whoosh2 = () => noise(.5, 1200, .3);
function sway(c, ms, amp = 12, per = 380) { const t0 = performance.now(); addTick(() => { const t = performance.now() - t0; if (t > ms) { c.lean.t = 0; return false; } c.lean.t = Math.sin(t / per * Math.PI) * amp; }); }
function pace(c, ms, amp = 160, per = 900) { const x0 = c.dx.v; hold(c, "run", ms / 1000); const t0 = performance.now(); addTick(() => { const t = performance.now() - t0; if (t > ms) { c.dx.t = x0; return false; } c.dx.v = c.dx.t = x0 + Math.sin(t / per * Math.PI) * amp; }); return sleep(ms); }
const comeIn = async (c, ms = 900) => { enter(c); await sleep(ms); };

/* ---------- できごとのアニメ（新しい場面） ---------- */
["yellowline", "cutline", "kururin", "castle", "shovel", "race", "tired", "tapon", "dizzy", "slideup", "tag", "slidebump", "swinglong", "pushme", "chimes", "litter", "leanpond",
 "bakery", "pricetag", "sneakbite", "errand", "lostkid", "candy", "register", "change", "notenough", "ticket", "crowded", "loudtrain", "blockdoor", "boardbus", "busride", "carsick", "bigpoop"].forEach(k => ASK_ON_STAGE.add(k));
Object.assign(INTRO, {
  // こうしゃ：ゾウの でっかい うんち
  async bigpoop(h, a) {
    const st = el("g", { transform: "translate(-110 0)" }, propG); // 個室と便器（ドアは開いている）
    el("rect", { x: 780, y: 330, width: 330, height: 430, rx: 10, fill: "#E8F7FF", ...S6p() }, st);
    el("path", { d: "M800 760 V700 Q800 650 860 650 H1010 Q1070 650 1070 700 V760", fill: "#FFFFFF", ...S6p() }, st);
    el("rect", { x: 1040, y: 470, width: 50, height: 120, rx: 10, fill: "#FFFFFF", ...S6p(5) }, st); el("path", { d: "M1090 500 h30", ...S6p(8) }, st);
    const poo = el("g", {}, propG); [[0, 0, 150, 70], [0, -70, 115, 58], [0, -130, 78, 46], [10, -175, 40, 34]].forEach(([x, y, rx, ry]) => el("ellipse", { cx: x, cy: y, rx, ry, fill: "#8B5A2B", ...S6p(6) }, poo));
    el("path", { d: "M-70 -20 Q-30 0 10 -20 M-40 -90 Q0 -70 30 -90", fill: "none", stroke: "#B07A45", "stroke-width": 8 }, poo);
    poo.setAttribute("transform", "translate(825 640) scale(0)"); window.__poo = poo;
    a.dx.v = a.dx.t = -150; hold(a, "run", 1.4); a.dx.t = 160; await sleep(1200); joy(a); markAbove(a, "note"); await sleep(700); // どしんが すっきり顔で 個室から出てくる
    h.dx.t = -170; enter(h); h.dx.t = -170; hold(h, "run", 1); await sleep(1000); playMove(h, "look"); await sleep(500);
    flash(); boom(1); shake(600, 30); await tween(380, k => poo.setAttribute("transform", `translate(825 640) scale(${easeBack(k).toFixed(3)})`));
    const t = slam("ドーン！", 300, 170, "#C98A4B"); for (let i = 0; i < 6; i++) later(i * 120, () => mark("puff", 825 + (Math.random() - .5) * 300, 520, { vy: -160, life: 1.2, s: .9 }));
    surprise(h); markAbove(h, "ex"); playMove(h, "scared"); await sleep(1300); t.remove(); surprise(a); await sleep(400);
  },
  // うんどうじょう
  async cutline(h, a) { enter(h); await sleep(1100); playMove(h, "look"); await sleep(400);
    a.dx.v = a.dx.t = 900; hold(a, "run", 1.2); a.lean.t = -14; a.dx.t = -120; await sleep(1100); a.lean.t = 0; markAbove(a, "note"); jump(a, .5); await sleep(400);
    surprise(h); markAbove(h, "anger"); await sleep(700); },
  async kururin(h, a) { a.y -= 160; enter(h); await sleep(700); for (let i = 0; i < 2; i++) { playMove(a, "spin"); await sleep(700); } a.y += 160; jump(a, .6); joy(a); await sleep(500); surprise(h); await sleep(300); },
  async hatfly(h, a) { const hat = prop("hat", 0, 0, .5); onHead(h, hat, .55, -6); enter(h); await sleep(1100); whoosh2(); await sleep(300);
    hat.remove(); const p = headTop(h); const g = prop("hat", p.x, p.y, .5); await moveProp(g, p.x, p.y, 1440, 330, 1200, .5, 200, 360); window.__hat = g;
    surprise(h); h.armR.t = -150; for (let i = 0; i < 3; i++) later(i * 500, () => jump(h, .6)); await sleep(1600); h.armR.t = 0; playMove(h, "sad"); await sleep(400); enter(a); await sleep(900); },
  async sandeye(h, a) { enter(h); await sleep(1000); playMove(h, "crouch"); hold(h, "shake", 1); await sleep(900); whoosh2();
    for (let i = 0; i < 14; i++) later(i * 50, () => { const p = headTop(h); mark("puff", p.x + 300 - i * 20, p.y + 40, { vx: -400, vy: 0, life: .6, s: .35 }); });
    await sleep(800); surprise(h); playMove(h, "sad"); tears(h, 1.6); await sleep(1300); enter(a); await sleep(900); surprise(a); },
  async castle(h, a) { h.dx.v = h.dx.t = -40; const c = prop("castle", 860, 700, .9); window.__castle = c; playMove(h, "crouch"); hold(h, "shake", 1.4); later(300, () => markAbove(h, "note")); await sleep(1600);
    a.dx.v = a.dx.t = 600; hold(a, "run", 1.2); a.dx.t = -170; await sleep(900); thud(); boom(.4);
    await tween(250, k => c.setAttribute("transform", `translate(860 ${700 + 60 * k}) scale(${.9 + .3 * k} ${(.9 - .7 * k).toFixed(2)})`));
    a.dx.t = 0; hold(a, "run", .6); surprise(a); markAbove(h, "ex"); surprise(h); await sleep(900); playMove(a, "sad"); await sleep(300); },
  async shovel(h, a) { const s = prop("shovel", 0, 0, .5); hand(a, s, .5, 20); playMove(a, "crouch"); hold(a, "shake", 2); const m = prop("castle", 1000, 740, .35); window.__mound = m;
    enter(h); await sleep(1200); playMove(h, "look"); markAbove(h, "q"); await sleep(800); },
  async race(h, a) { const tape = el("path", { d: "M1360 600 H1500", stroke: "#FF6F91", "stroke-width": 10 }, propG);
    a.dx.v = a.dx.t = -1300; hold(a, "run", 1.6); a.lean.t = -14; a.dx.t = 0; await sleep(800); h.dx.v = h.dx.t = -1300; h.dx.t = 0; hold(h, "run", 1.8); h.lean.t = -14; await sleep(700);
    tape.remove(); a.lean.t = 0; playMove(a, "pump"); markAbove(a, "sparkle"); await sleep(700); h.lean.t = 0; for (let i = 0; i < 3; i++) later(i * 300, () => markAbove(h, "drop", { dx: i % 2 ? 60 : -60, vy: 60 })); playMove(h, "sad"); await sleep(900); },
  async trip(h, a) { a.dx.v = a.dx.t = 500; hold(a, "run", 1.4); a.dx.t = 0; a.lean.t = -14; await sleep(1100); a.lean.t = 0; thud(); flop(a); markAbove(a, "ex"); await sleep(600); tears(a, 2); playMove(a, "sad");
    enter(h); await sleep(1100); surprise(h); await sleep(300); },
  async tired(h, a) { hold(a, "shiver", 3); for (let i = 0; i < 6; i++) later(i * 350, () => markAbove(a, "drop", { dx: i % 2 ? 80 : -80, vy: 60 })); a.squash.t = .9;
    h.dx.v = h.dx.t = -1100; hold(h, "run", 1.4); h.dx.t = 0; await sleep(1400); playMove(h, "look"); await sleep(700); },
  async drinklong(h, a) { h.dx.v = h.dx.t = 940 - (h.x + h.s * 200); playMove(h, "crouch"); const w = waterArc(930, 516); window.__arc = w; for (let i = 0; i < 8; i++) later(i * 300, () => blip(300, 220, .08));
    await sleep(1200); a.dx.t = 1410 - (a.x + a.s * 200); hold(a, "run", .9); await sleep(1000); hold(a, "tiptoe", 2); markAbove(a, "anger"); await sleep(900); },
  async tapon(h, a) { const w = waterArc(1310, 512); window.__arc = w; for (let i = 0; i < 6; i++) later(i * 250, () => blip(300, 220, .08)); playMove(a, "crouch"); await sleep(1100);
    joy(a); a.dx.t = 120; hold(a, "run", .7); await sleep(800); enter(h); await sleep(1100); playMove(h, "look"); surprise(h); markAbove(h, "ex"); noise(1.4, 3000, .12); await sleep(900); },
  async dizzy(h, a) { sway(a, 3500, 14, 500); for (let i = 0; i < 5; i++) later(i * 500, () => markAbove(a, "puff", { vy: -60 })); a.eyeScale.t = .7;
    enter(h); await sleep(1300); playMove(h, "look"); await sleep(800); surprise(h); },
  // こうえん
  async slideup(h, a) { const slope = cx => 350 + (cx - 320) * (390 / 380) + 10; // すべりだいの面の高さ（中心xから）
    const at = cx => { a.dx.v = a.dx.t = cx - a.s * 200 - a.x; a.y = slope(cx); };
    at(690); h.dx.v = h.dx.t = -1100; hold(h, "run", 1); h.dx.t = 330; await sleep(1000); hold(a, "run", 2.2); a.lean.t = 20;
    await tween(2000, k => at(690 - 240 * k)); markAbove(a, "note"); surprise(h); markAbove(h, "ex"); await sleep(700); },
  async tag(h, a) { const ch = C.chu; resetChar(ch); place(ch, 1450, 975, .42); show(ch); pace(ch, 3000, 220, 700); pace(a, 3000, 220, 800); later(300, () => markAbove(a, "note")); later(1200, () => markAbove(ch, "note"));
    enter(h); await sleep(1300); playMove(h, "look"); await sleep(1300); a.dx.t = 0; },
  async slidebump(h, a) { h.dx.v = h.dx.t = -380; const y0 = h.y; h.y = y0 - 420; await sleep(500); markAbove(h, "note");
    await tween(900, k => { h.dx.v = h.dx.t = -380 + 760 * k; h.y = y0 - 420 * (1 - k); }); thud(); boom(.4); flop(h); flop(a); markAbove(a, "ex"); await sleep(700); h.dx.t = 300; playMove(a, "sad"); await sleep(500); },
  async swinglong(h, a) { a.y -= 280; const t0 = performance.now(); addTick(() => { if (view !== "scene" || window.__swingStop) return false; const s = Math.sin((performance.now() - t0) / 700); a.dx.v = a.dx.t = s * 120; a.lean.t = s * 14; });
    window.__swingStop = false; later(200, () => markAbove(a, "note")); enter(h); await sleep(1300); hold(h, "tiptoe", 1.6); await sleep(1600); markAbove(h, "drop"); await sleep(400); },
  async pushme(h, a) { a.y -= 280; a.dx.v = a.dx.t = -100; enter(h); await sleep(1100); wave(a); await sleep(400); },
  async chimes(h, a) { const dusk = el("rect", { x: 0, y: 0, width: 1600, height: 760, fill: "#FF9E5E", opacity: 0 }, propG); tween(2000, k => dusk.setAttribute("opacity", (.35 * k).toFixed(2)));
    tune([[N.E5, 1], [N.C5, 1], [N.D5, 1], [N.G4, 2], [N.G4, 1], [N.D5, 1], [N.E5, 1], [N.C5, 2]], 150, "sine", .1);
    a.y -= 280; const t0 = performance.now(); addTick(() => { if (view !== "scene" || window.__swingStop) return false; const s = Math.sin((performance.now() - t0) / 700); a.dx.v = a.dx.t = s * 100; }); window.__swingStop = false;
    enter(h); await sleep(1500); playMove(h, "look"); await sleep(1000); },
  async litter(h, a) { a.y -= 120; const sn = prop("snack", 0, 0, .3); hand(a, sn, .3, 0); await sleep(500); markAbove(a, "note"); await sleep(700); sn.remove();
    const p = world(a, 330, 300); const w = prop("wrapper", p.x, p.y, .5); moveProp(w, p.x, p.y, 1050, 900, 700, .5, 120, 300); window.__wrap = w; blip(600, 300, .2);
    enter(h); await sleep(1200); surprise(h); markAbove(h, "ex"); await sleep(600); },
  async snack(h, a) { const sn = prop("snack", 0, 0, .35); hand(h, sn, .35, 0); window.__snack = sn; enter(h); await sleep(1000); joy(h); await sleep(400);
    enter(a); await sleep(1100); for (let i = 0; i < 3; i++) later(i * 300, () => markAbove(a, "drop", { dx: 40, vy: 40 })); a.eyeScale.t = 1.3; await sleep(900); },
  async icedrop(h, a) { const ic = prop("icecream", 0, 0, .35); hand(a, ic, .35, 0); enter(h); await sleep(700);
    a.dx.v = a.dx.t = 600; hold(a, "run", 1.3); a.dx.t = 0; await sleep(1000); a.lean.t = 16; thud(); ic.remove(); const p = world(a, 330, 300);
    const g = prop("icecream", p.x, p.y, .35); await moveProp(g, p.x, p.y, p.x - 120, 930, 500, .35, 60, 160); noise(.15, 600, .5); a.lean.t = 0; playMove(a, "sad"); tears(a, 2.2); surprise(h); await sleep(1100); },
  async lostway(h, a) { enter(h); await sleep(1000); a.dx.v = a.dx.t = 500; hold(a, "tiptoe", 2.4); a.dx.t = 0; await sleep(1500); playMove(a, "look"); markAbove(a, "q"); await sleep(1000); },
  async frog(h, a) { const f = prop("frog", 1180, 860, .5); window.__frog = f; enter(h); await sleep(1100); playMove(h, "crouch"); markAbove(h, "sparkle"); await sleep(1000); enter(a); await sleep(900); },
  async leanpond(h, a) { a.lean.t = 26; a.dx.v = a.dx.t = -60; hold(a, "tiptoe", 3); later(300, () => markAbove(a, "note")); enter(h); await sleep(1300); surprise(h); markAbove(h, "ex"); await sleep(700); },
  // おみせ
  async bakery(h, a) { a.dx.v = a.dx.t = 40; enter(h); await sleep(1200); playMove(h, "look"); await sleep(600); wave(a); await sleep(400); },
  async pricetag(h, a) { const b = prop("bearbread", 1000, 560, .55); window.__bear = b; enter(h); await sleep(1200); playMove(h, "think"); markAbove(h, "q"); await sleep(1100); },
  async sneakbite(h, a) { a.dx.v = a.dx.t = -200; const b = prop("bread", 0, 0, .35); hand(a, b, .35, 0); window.__bread = b; a.armR.t = -60; await sleep(300);
    enter(h); await sleep(1100); a.roundMouth = true; markAbove(a, "note"); await sleep(500); surprise(h); markAbove(h, "ex"); a.roundMouth = false; await sleep(500); },
  async errand(h, a) { const m = prop("memo", 0, 0, .4); hand(h, m, .4, 0); window.__memo = m; enter(h); await sleep(1300); playMove(h, "look"); await sleep(500); wave(a); },
  async applespill(h, a) { enter(h); await sleep(1000); thud(); flop(h); const ap = [];
    for (let i = 0; i < 5; i++) { const g = prop("apple", 900 + i * 20, 600, .45); ap.push(g); moveProp(g, 900 + i * 20, 600, 700 + i * 120, 920, 700 + i * 120, .45, 80, 360); } window.__apples = ap;
    for (let i = 0; i < 5; i++) later(i * 120, () => blip(300 - i * 20, 200, .1)); await sleep(1200); surprise(h); markAbove(h, "ex"); enter(a); await sleep(900); },
  async lostkid(h, a) { tears(a, 2.5); playMove(a, "look"); later(800, () => markAbove(a, "q")); enter(h); await sleep(1400); surprise(h); await sleep(400); },
  async candy(h, a) { enter(h); await sleep(1200); playMove(h, "think"); markAbove(h, "sparkle"); await sleep(1100); },
  async storerun(h, a) { enter(h); await sleep(1000); a.dx.v = a.dx.t = -1200; hold(a, "run", 1.8); a.lean.t = -12; tween(1400, k => { a.dx.v = a.dx.t = -1200 + 1200 * k; });
    later(700, () => { noise(.3, 1500, .5); for (let i = 0; i < 4; i++) { const g = prop("candy", 1000 + i * 90, 360, .3); moveProp(g, 1000 + i * 90, 360, 980 + i * 110, 920, 600, .3, 0, 200); } });
    await sleep(1500); a.lean.t = 0; markAbove(a, "note"); surprise(h); markAbove(h, "ex"); await sleep(600); },
  async searchshelf(h, a) { enter(h); await sleep(1100); playMove(h, "look"); await sleep(900); markAbove(h, "q"); playMove(h, "think"); await sleep(600); enter(a); await sleep(900); },
  async register(h, a) { a.dx.v = a.dx.t = 40; const b = prop("bag", 0, 0, .4); hand(h, b, .4, 0); window.__bag = b; enter(h); await sleep(1200); for (let i = 0; i < 3; i++) later(i * 250, () => blip(1500, 1500, .06, "square")); await sleep(900); },
  async change(h, a) { a.dx.v = a.dx.t = 40; enter(h); await sleep(1200); const c = prop("coin", 0, 0, .35); hand(h, c, .35, 0); window.__coin = c; blip(1200, 1600, .1); await sleep(600); playMove(h, "think"); markAbove(h, "q"); await sleep(1000); },
  async notenough(h, a) { a.dx.v = a.dx.t = 40; enter(h); await sleep(1200); const pu = prop("purse", 0, 0, .35); hand(h, pu, .35, 0); playMove(h, "look"); await sleep(900);
    for (let i = 0; i < 4; i++) later(i * 300, () => markAbove(h, "drop", { dx: i % 2 ? 70 : -70, vy: 50 })); playMove(h, "sad"); await sleep(1100); },
  // でんしゃとバス
  async ticket(h, a) { enter(h); await sleep(1300); playMove(h, "look"); await sleep(600); wave(a); await sleep(400); },
  async platformrun(h, a) { enter(h); await sleep(1000); horn(); a.dx.v = a.dx.t = -1200; hold(a, "run", 1.6); a.lean.t = -14; a.dx.t = 0; await sleep(1200); a.lean.t = 0; surprise(h); markAbove(h, "ex"); await sleep(500); },
  async yellowline(h, a) { window.__y0 = a.y; a.y -= 175; a.lean.t = 20; hold(a, "tiptoe", 3); enter(h); await sleep(1100); horn(); await sleep(400); surprise(h); markAbove(h, "ex"); await sleep(600); },
  async crowded(h, a) { h.dx.v = h.dx.t = 0; window.__y0 = h.y; h.y -= 70; const f = front(); el("rect", { x: 370, y: 838, width: 470, height: 70, rx: 16, fill: "#5F8FCB", ...S6p(6) }, f); // まえの せき（すわっている） a.dx.v = a.dx.t = 600; hold(a, "tiptoe", 2.4); a.dx.t = -100; const cn = prop("cane", 0, 0, .5); hand(a, cn, .5, 0);
    await sleep(1600); shake(500, 20); sway(a, 1400, 16, 300); markAbove(a, "drop"); await sleep(1300); },
  async loudtrain(h, a) { enter(h); await sleep(900); for (let i = 0; i < 3; i++) later(i * 500, () => { jump(a, .5); markAbove(a, "ex"); blip(400, 700, .15, "square"); }); await sleep(1700); surprise(h); playMove(h, "shy"); await sleep(400); },
  async blockdoor(h, a) { a.dx.v = a.dx.t = 1110 - (a.x + a.s * 200); delete a.tm.closed;
    const dr = el("g", {}, propG); el("rect", { x: 990, y: 190, width: 240, height: 570, fill: "#C9D3DE", ...S6p(6) }, dr);
    window.__doors = [0, 1].map(i => { const g = el("g", {}, dr); el("rect", { x: 1000 + i * 110, y: 200, width: 110, height: 560, fill: "#E9EEF3", ...S6p(5) }, g); el("rect", { x: 1018 + i * 110, y: 250, width: 74, height: 200, rx: 8, fill: "#BDE3F2", ...S6p(4) }, g); return g; }); let zt = 0; addTick(dt => { if (view !== "scene" || window.__awake) return false; zt -= dt; if (zt < 0) { zt = .9; markAbove(a, "z", { i: 1, vx: 30, vy: -50, life: 1.4 }); } }); window.__awake = false;
    enter(h); await sleep(1100); ding(); await sleep(600); playMove(h, "look"); markAbove(h, "drop"); await sleep(800); },
  async busstop(h, a) { enter(h); await sleep(1100); playMove(h, "look"); hold(h, "tiptoe", 1.2); await sleep(1200); enter(a); await sleep(900); },
  async bagleft(h, a) { a.y -= 70; a.dx.v = a.dx.t = -120; const b = prop("bag", 960, 740, .4); window.__bag = b; enter(h); await sleep(1000);
    const bus = vehicle("bus", 790); await pass(bus, 900, 790, 1700, 980); horn(); a.y += 70; a.dx.t = 260; hold(a, "run", .8); await sleep(800); surprise(h); markAbove(h, "ex"); window.__bus = bus; await sleep(400); },
  async ballroad(h, a) { const b = prop("ball", 900, 900, .4); a.dx.v = a.dx.t = -300; window.__y0 = a.y; enter(h); await sleep(900);
    moveProp(b, 900, 900, 1500, 760, 1200, .4, 0, 540); hold(a, "run", 1.3); a.dx.t = 200; const y0 = a.y; tween(900, k => a.y = y0 - 190 * k); // どうろへ とびだす
    await sleep(800); horn(); surprise(h); markAbove(h, "ex"); await sleep(400); },
  async boardbus(h, a) { const wl = prop("wheel", 1360, 620, .7); a.dx.v = a.dx.t = 160; enter(h); await sleep(1300); wave(a); await sleep(500); },
  async busride(h, a) { h.dx.v = h.dx.t = -120; const g = el("g", {}, propG); const ts = [[300, "#7CC36A"], [700, "#6DBB5E"], [1100, "#7CC36A"], [1500, "#6DBB5E"]].map(([x, c]) => { const t = el("circle", { cx: 0, cy: 380, r: 50, fill: c, ...S6p(4) }, g); return { t, x }; });
    addTick(dt => { if (!g.isConnected) return false; ts.forEach(o => { o.x -= 300 * dt; if (o.x < 0) o.x += 1600; o.t.setAttribute("cx", o.x.toFixed(0)); }); });
    sway(h, 3000, 6, 300); sway(a, 3000, 6, 300); await sleep(1500); playMove(a, "look"); await sleep(700); },
  async carsick(h, a) { h.dx.v = h.dx.t = -120; sway(a, 3500, 12, 500); a.eyeScale.t = .7; for (let i = 0; i < 4; i++) later(i * 500, () => markAbove(a, "drop", { dx: 60, vy: 50 })); await sleep(1600); playMove(a, "sad"); await sleep(800); surprise(h); },
});
Object.assign(PRE, {
  chime() { window.__swingStop = true; },
  orimasu(h, a) { window.__awake = true; surprise(a); a.eyeScale.t = 1; return sleep(400); },
});
Object.assign(POST, {
  async unko(h, a) { await walk(a, -260, 700); a.armR.t = -80; await sleep(300); noise(1.6, 900, .7); blip(500, 120, 1.4, "sine"); const poo = window.__poo;
    if (poo) await tween(1400, k => poo.setAttribute("transform", `translate(825 ${(640 + 60 * k).toFixed(0)}) rotate(${(k * 720).toFixed(0)}) scale(${(1 - k).toFixed(3)})`));
    a.armR.t = 0; joy(a); joy(h); chime(); await sleep(700); },
  async junban(h, a) { playMove(a, "shy"); await sleep(500);
    const hx = h.x + h.dx.v + h.s * 200, ax = a.x + a.dx.v + a.s * 200; await walk(a, Math.max(400, hx - 260) - ax, 1300); // うしろへ
    playMove(a, "nod"); await sleep(300); await walk(h, 280, 900); joy(h); },
  async sakaagari(h, a) { await walk(h, 300, 900); playMove(h, "crouch"); a.y -= 0; await sleep(600); playMove(h, "spin"); await sleep(800); joy(h); joy(a); await sleep(400); },
  async boushi(h, a) { a.lift.t = 280; blip(400, 1400, .5, "triangle"); await sleep(900); const g = window.__hat; if (g) { const p = headTop(h); await moveProp(g, 1440, 330, p.x, p.y, 800, .5, 100, -360); g.remove(); onHead(h, prop("hat", 0, 0, .5), .55, -6); }
    a.lift.t = 0; joy(h); await sleep(600); },
  async sunanome(h, a) { const w = waterArc(world(h, 200, 200).x - 40, world(h, 200, 200).y); hold(h, "shake", 1.2); await sleep(1300); w.remove(); h.eyeScale.t = 1; joy(h); await sleep(300); },
  async oshiro(h, a) { a.armR.t = -40; for (let i = 0; i < 18; i++) later(i * 70, () => { const p = world(a, 150, 330); mark("drop", p.x, p.y, { vx: -420 - Math.random() * 160, vy: -260 - Math.random() * 120, grav: 900, life: .9, s: .5 }); });
    noise(1.3, 2500, .25); await sleep(1400); a.armR.t = 0; playMove(h, "crouch"); playMove(a, "crouch"); hold(h, "shake", 1.4); hold(a, "shake", 1.4); const c = window.__castle;
    if (c) await tween(1400, k => c.setAttribute("transform", `translate(860 ${(760 - 60 * k).toFixed(0)}) scale(${(1.2 - .3 * k).toFixed(2)} ${(.2 + .7 * k).toFixed(2)})`)); joy(h); SPECIAL.doshin(a); await sleep(600); },
  async scoop(h, a) { await walk(h, 300, 900); playMove(h, "crouch"); playMove(a, "crouch"); hold(h, "shake", 1.6); const m = window.__mound;
    if (m) await tween(1600, k => m.setAttribute("transform", `translate(1000 ${(740 - 30 * k).toFixed(0)}) scale(${(.35 + .5 * k).toFixed(2)})`)); joy(a); joy(h); await sleep(300); },
  async kakekko(h, a) { playMove(a, "pump"); await sleep(600); playMove(h, "pump"); await sleep(600); },
  async koronda(h, a) { await walk(h, 360, 900); a.happyOn = true; joy(a); await sleep(500); walk(h, 900, 2000); await walk(a, 900, 2000); },
  async ouen(h, a) { hold(h, "clap", 1.4); await sleep(600); walk(h, 1100, 2000); await walk(a, 1100, 2000); confetti(40); },
  async mizunomi(h, a) { await walk(h, -340, 800); await walk(a, 940 - (a.x + a.dx.v + a.s * 200), 900); playMove(a, "crouch"); await sleep(1200); joy(a); },
  async jaguchi(h, a) { await walk(a, -120, 600); a.armR.t = -60; await sleep(300); blip(1200, 800, .1, "square"); later(150, () => blip(1200, 800, .1, "square")); if (window.__arc) window.__arc.remove(); a.armR.t = 0; await sleep(500); playMove(a, "nod"); },
  async kurakura(h, a) { await walk(h, 300, 800); a.eyeScale.t = 1; walk(h, -900, 1800); await walk(a, -900, 1800); },
  async sakasama(h, a) { a.lean.t = 0; const cx0 = a.x + a.dx.v + a.s * 200, y0 = a.y; await tween(700, k => { const cx = cx0 + (720 - cx0) * k; a.dx.v = a.dx.t = cx - a.s * 200 - a.x; a.y = y0 + (975 - y0) * k; });
    a.y = 975; playMove(a, "nod"); await walk(a, -500, 1100); },
  async irete(h, a) { joy(a); joy(h); await sleep(400); const ch = C.chu; walk(h, 900, 1800); walk(a, 700, 1600); await walk(ch, 500, 1400); },
  async shitabutsu(h, a) { playMove(h, "bow"); await sleep(900); a.happyOn = true; joy(a); },
  async kawatte(h, a) { await sleep(900); window.__swingStop = true; a.dx.t = 0; a.lean.t = 0; await sleep(400); a.y += 280; jump(a, .6); await walk(a, 250, 700);
    const cx = a.x + a.s * 200; await walk(h, cx - (h.x + h.dx.v + h.s * 200), 1100); // ブランコに のって こぐ
    h.y -= 280; jump(h, .4); const x0 = h.dx.v, t0 = performance.now(); addTick(() => { if (view !== "scene") return false; const k = Math.sin((performance.now() - t0) / 700); h.dx.v = h.dx.t = x0 + k * 120; h.lean.t = k * 14; });
    later(500, () => markAbove(h, "note")); playMove(a, "clap"); await sleep(1600); },
  async oshite(h, a) { await walk(h, 300, 900); for (let i = 0; i < 4; i++) { h.armR.t = -80; h.armL.t = -80; await tween(500, k => { a.dx.v = a.dx.t = -100 + Math.sin(k * Math.PI) * 220; a.lean.t = Math.sin(k * Math.PI) * 18; }); h.armR.t = 0; h.armL.t = 0; } joy(a); },
  async chime(h, a) { a.dx.t = 0; a.y += 280; jump(a, .5); await sleep(500); wave(a); wave(h); walk(h, -900, 2000); await walk(a, -1100, 2000); },
  async gomi(h, a) { a.y += 120; playMove(a, "crouch"); await sleep(600); const w = window.__wrap; if (w) { await moveProp(w, 1050, 900, 1335, 660, 700, .5, 120, 200); w.remove(); } chime(); playMove(a, "nod"); },
  async hanbunko(h, a) { const sn = window.__snack; if (sn) sn.remove(); hand(h, prop("snack", 0, 0, .2), .2, 0); hand(a, prop("snack", 0, 0, .2), .2, 0); joy(a); joy(h); await sleep(800); },
  async aisu(h, a) { await walk(h, 300, 800); playMove(h, "nod"); a.happyOn = true; joy(a); await sleep(500); },
  async michi(h, a) { playMove(h, "point"); await sleep(900); playMove(a, "nod"); await sleep(400); a.dx.t = -1400; hold(a, "tiptoe", 2.5); await sleep(1600); },
  async kaeru(h, a) { const f = window.__frog; if (f) { await moveProp(f, 1180, 860, 1380, 840, 600, .5, 200, 0); noise(.25, 1500, .4); f.remove(); for (let i = 0; i < 6; i++) mark("drop", 1380, 840, { vx: (Math.random() - .5) * 400, vy: -300, grav: 900, life: .9, s: .6 }); } surprise(a); joy(h); await sleep(600); },
  async nozoku(h, a) { a.lean.t = 0; await walk(a, -160, 600); playMove(a, "nod"); },
  pan(h) { hand(h, prop("bread", 0, 0, .35), .35, 0); joy(h); return sleep(800); },
  async ikura(h, a) { const g = prop("price", 1000, 420, .1); await tween(400, k => g.setAttribute("transform", `translate(1000 420) scale(${(.1 + .7 * easeBack(k)).toFixed(3)})`)); chime(); await sleep(900); },
  async tsumami(h, a) { a.armR.t = 0; playMove(a, "shy"); await sleep(600); await walk(a, 300, 900); const b = window.__bread; if (b) b.remove();
    const p = world(a, 330, 300), c = prop("coin", p.x, p.y, .35); await moveProp(c, p.x, p.y, 1300, 560, 600, .35, 120, 0); c.remove(); blip(1500, 1500, .06, "square"); later(150, () => blip(1800, 1800, .08, "square"));
    hand(a, prop("bread", 0, 0, .35), .35, 0); playMove(a, "nod"); await sleep(500); },
  async otsukai(h, a) { const m = window.__memo; if (m) m.remove(); hand(h, prop("carrot", 0, 0, .35), .35, -10); await sleep(500); const q = world(h, 330, 300), ap = prop("apple", 1100, 560, .4); await moveProp(ap, 1100, 560, q.x - 40, q.y - 40, 600, .4, 120, 0); joy(h); },
  async ringo(h, a) { playMove(h, "crouch"); const ap = window.__apples || []; for (let i = 0; i < ap.length; i++) { await moveProp(ap[i], 700 + i * 120, 920, 920 + i * 20, 600, 250, .45, 60, 0); blip(500, 700, .06); } playMove(a, "nod"); },
  async maigo(h, a) { a.happyOn = true; joy(a); await sleep(400); walk(h, 1000, 2200); await walk(a, 1000, 2200); },
  erabu(h) { hand(h, prop("candy", 0, 0, .3), .3, 0); joy(h); return sleep(700); },
  async hashiru(h, a) { playMove(a, "shy"); await sleep(500); hold(a, "tiptoe", 2); await walk(a, 300, 1600); },
  async sagasu(h, a) { playMove(a, "point"); await sleep(700); await walk(h, 250, 900); const g = prop("candy", 1420, 600, .22); await moveProp(g, 1420, 600, world(h, 330, 300).x, world(h, 330, 300).y, 500, .22, 100, 0); g.remove();
    hand(h, prop("candy", 0, 0, .25), .25, 0); joy(h); },
  fukuro(h, a) { playMove(a, "nod"); joy(h); return sleep(700); },
  async otsuri(h, a) { const c = window.__coin; if (c) c.remove(); const q = world(h, 330, 300), g = prop("coin", q.x, q.y, .35); await moveProp(g, q.x, q.y, 1180, 600, 600, .35, 120, 0); g.remove(); SPECIAL.doshin(a); joy(h); await sleep(400); },
  tarinai(h, a) { playMove(a, "nod"); joy(h); return sleep(700); },
  kippu(h) { hand(h, prop("ticket", 0, 0, .3), .3, 0); joy(h); return sleep(700); },
  async hoomu(h, a) { hold(a, "tiptoe", 2); const t = vehicle("train", 760); await pass(t, 1500, 760); },
  async kiiro(h, a) { a.lean.t = 0; const y0 = a.y, y1 = window.__y0 || y0 + 175; hold(a, "run", .7); await tween(700, k => { a.y = y0 + (y1 - y0) * k; a.dx.v = a.dx.t = -120 * k; }); // きいろい せんの うちがわへ
    const t = vehicle("train", 760); await pass(t, 1400, 760); joy(a); },
  async yuzuru(h, a) { const hy = window.__y0 || h.y + 70; jump(h, .5); h.y = hy; await walk(h, 960 + Math.max(0, h.s - .88) * 220 - (h.x + h.dx.v + h.s * 200), 800); // たちあがって せきを あける
    await walk(a, 605 - (a.x + a.dx.v + a.s * 200), 1100); a.y -= 70; thud(); playMove(a, "nod"); await sleep(300); playMove(h, "nod"); await sleep(500); },
  shizukani(h, a) { playMove(a, "shy"); return sleep(600); },
  async orimasu(h, a) { await walk(a, 420, 1000); const ds = window.__doors; noise(.4, 900, .3);
    if (ds) await tween(500, k => { ds[0].setAttribute("transform", `translate(${(-100 * k).toFixed(0)} 0)`); ds[1].setAttribute("transform", `translate(${(100 * k).toFixed(0)} 0)`); });
    await walk(h, 1110 - (h.x + h.dx.v + h.s * 200), 1300); playMove(h, "bow"); await sleep(600); await tween(400, k => h.root.style.opacity = (1 - k).toFixed(2)); h.root.style.display = "none"; h.root.style.opacity = ""; },
  jikan(h, a) { playMove(a, "nod"); joy(h); return sleep(600); },
  async kaban(h, a) { await walk(a, -260, 800); const b = window.__bag; if (b) { b.remove(); hand(a, prop("bag", 0, 0, .35), .35, 0); } joy(a); await sleep(400); },
  async tobidashi(h, a) { a.dx.t = a.dx.v; surprise(a); await sleep(300); const y0 = a.y, y1 = window.__y0 || y0 + 190; hold(a, "run", .7); await tween(700, k => { a.y = y0 + (y1 - y0) * k; a.dx.v = a.dx.t = 200 - 120 * k; }); // ほどうへ もどる
    const car = vehicle("car", 790); await pass(car, 1000, 790); playMove(a, "nod"); },
  async untenshu(h, a) { playMove(h, "bow"); await sleep(900); const cx = h.x + h.dx.v + h.s * 200; await walk(h, Math.max(cx - 300, 450 + h.s * 200) - cx, 900); }, // バスの おくへ（となりの 子に ぶつからない ところまで）
  async botan(h, a) { await walk(a, 1440 - (a.x + a.dx.v + a.s * 200), 700); a.armR.t = -150; await sleep(400); ding(); blip(1600, 1600, .2, "square");
    const g = el("g", {}, front()); el("circle", { cx: 1520, cy: 520, r: 30, fill: "#FF6F91", ...S6p(5) }, g); const gl = el("circle", { cx: 1520, cy: 520, r: 50, fill: "none", stroke: "#FF6F91", "stroke-width": 8, opacity: .6 }, g);
    el("rect", { x: 1290, y: 380, width: 270, height: 70, rx: 14, fill: "#2B2A33", ...S6p(4) }, g); txt(g, 1425, 428, "つぎ とまります", 30, { "text-anchor": "middle", fill: "#FFD25E" });
    tween(800, k => gl.setAttribute("r", (40 + 30 * k).toFixed(0))); await sleep(500); a.armR.t = 0; joy(a); await sleep(800); },
  async yoi(h, a) { noise(.6, 2000, .2); a.eyeScale.t = 1; await sleep(600); a.happyOn = true; joy(a); },
});

/* ---------- 声の まとめ読み（ステージごと） ---------- */
const PACK = { loaded: {} };
const SCENE_KEY = /^(sq|sr|sa|sg|sx|sw)_([a-z0-9]+)/;
const STAGE_OF = {}; SITS.forEach(s => STAGE_OF[s.id] = s.stage || "kousha");
const stageOfKey = k => { const m = SCENE_KEY.exec(k); return m ? STAGE_OF[m[2]] : null; };
async function loadPack(id) {
  // 1) ほかの ステージの 場面の声は 手ばなす（メモリを あける）。ページに 入っている こうしゃの声は データだけ のこす
  Object.keys(VBUF).forEach(k => { const st = stageOfKey(k); if (st && st !== id) delete VBUF[k]; });
  Object.keys(PACK.loaded).forEach(s => { if (s !== id) { PACK.loaded[s].forEach(k => delete AUD[k]); delete PACK.loaded[s]; } });
  // 2) このステージの声（パック）を 読みこむ
  if (!PACK.loaded[id]) {
    let data = null;
    try { const r = await fetch(`packs/${id}.json`, { cache: "no-cache" }); if (r.ok) data = await r.json(); } catch (e) { data = null; }
    if (data) { const keys = Object.keys(data); keys.forEach(k => AUD[k] = "data:audio/mpeg;base64," + data[k]); PACK.loaded[id] = keys; }
    else playLog({ type: "pack", stage: id, ok: false });
  }
  // 3) このステージの 場面の声を ぜんぶ 音のデータに しておく（遊ぶ前に 用意）
  const mine = Object.keys(AUD).filter(k => stageOfKey(k) === id);
  await Promise.all(mine.map(k => voiceBuf(k)));
  return !!PACK.loaded[id];
}
async function withLoading(fn) {
  const box = document.createElement("div"); box.className = "start loading"; box.innerHTML = '<div class="mcard"><div class="mtitle" style="font-size:clamp(26px,4vw,44px)">じゅんび ちゅう…</div></div>'; stage.appendChild(box);
  try { return await fn(); } finally { box.remove(); }
}
