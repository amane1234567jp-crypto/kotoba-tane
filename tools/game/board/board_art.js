/* ================= すごろくの 盤の 背景を 絵に する（2026-10-28） =================
   bg7（色の 四角 ＋ ことばの 札 ＋ 絵文字）だった 盤を、コースごとの 絵に かきかえる。
   やりかた：
   1. 地面（床板・タイル・じゅうたん・しばふ・みち）を 全面に。
   2. マスの「ばしょ」ごとに、その マスを かこむ「へや／エリア」を かく（色は STAGE_DEF の fills）。
   3. へやの 中の あいた ところに、その ばしょらしい 道具（つくえ・ベッド・レジ・すべりだい…）を おく。
   4. へやの そとの あいた ところに、テーマの かざり（木・花・まど・かんようしょく）。
   5. ことばの 札は 木の 看板に。
   道具の 部品は menu_art2.js の PR2 を つかう（盤は 1600×1000 なので 大きめに）。 */
const BA = {};
BA.themeOf = {
  gakkou2: "school", gakkou3: "class", kyuushoku: "class", sensei1: "class", seki1: "class", kokugo: "class", ongaku: "class", zukou: "class", yasumi: "class", taiiku: "school", hoken2: "hospital", tokei: "class", sansu: "class",
  toukou: "town", gekou: "town", jitensha: "town", kaerimichi: "town", densha: "town", omise: "shop", burger: "shop",
  ouchi1: "home", yuushoku: "home", ie1: "home", denwa: "home",
  tomodachi1: "park", kouen: "park", kouen2: "park", undou: "yard", asobiba: "play",
  byouin: "hospital", haisha: "hospital",
  komatta: "mix", kirikae: "mix", kikikaesu: "mix", matsu: "mix", sos: "mix", junban: "mix", kotowaru: "mix", bousai: "mix", souzou: "mix", tachiba: "mix", sakiyomi: "mix", chotto: "mix", aite: "mix", manekko: "mix",
};
const BA_WALL = { school: "#F6EEDF", class: "#F6EEDF", hospital: "#F0FAFF", town: "#E9E4DA", shop: "#FFF1D6", home: "#FFF1E6", park: "#BFE3A6", yard: "#E9D3A3", play: "#FFF3D6", mix: "#FFF6E8" };
/* ---- 地面 ---- */
BA.ground = {
  wood(L, c = "#F3DDB4") { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: c }, L); for (let y = 0; y < 1000; y += 70) { el("path", { d: `M0 ${y} H1600`, stroke: "#00000012", "stroke-width": 4 }, L); for (let x = (y / 70) % 2 ? 160 : 0; x < 1600; x += 320) el("path", { d: `M${x} ${y} V${y + 70}`, stroke: "#00000010", "stroke-width": 3 }, L); } },
  tile(L, c = "#EAF4F8") { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: c }, L); for (let x = 0; x < 1600; x += 100) el("path", { d: `M${x} 0 V1000`, stroke: "#00000010", "stroke-width": 3 }, L); for (let y = 0; y < 1000; y += 100) el("path", { d: `M0 ${y} H1600`, stroke: "#00000010", "stroke-width": 3 }, L); },
  grass(L, c = "#BFE3A6") { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: c }, L); for (let i = 0; i < 70; i++) { const x = (i * 211) % 1600, y = (i * 137 + 40) % 1000; el("path", { d: `M${x} ${y} l6 -14 l6 14 M${x + 14} ${y} l6 -12 l6 12`, fill: "none", stroke: "#8FCB7A", "stroke-width": 3, "stroke-linecap": "round" }, L); } },
  dirt(L, c = "#E9D3A3") { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: c }, L); for (let i = 0; i < 50; i++) el("circle", { cx: (i * 263) % 1600, cy: (i * 149 + 20) % 1000, r: 4 + i % 4, fill: "#D9BC85" }, L); },
  town(L, c = "#E9E4DA") { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: c }, L); for (let x = 0; x < 1600; x += 80) el("path", { d: `M${x} 0 V1000`, stroke: "#00000008", "stroke-width": 3 }, L); for (let y = 0; y < 1000; y += 80) el("path", { d: `M0 ${y} H1600`, stroke: "#00000008", "stroke-width": 3 }, L); },
  carpet(L, c = "#FFE9C7") { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: c }, L); for (let i = 0; i < 120; i++) el("circle", { cx: (i * 173) % 1600, cy: (i * 97 + 30) % 1000, r: 5, fill: "#00000008" }, L); },
};
const BA_GROUND = { school: "wood", class: "wood", hospital: "tile", town: "town", shop: "tile", home: "carpet", park: "grass", yard: "dirt", play: "carpet", mix: "wood" };
/* ---- へやの 中の 道具（ばしょの 名前 → かきかた）。(L, x, y, r) r＝あいている 半径 ---- */
const K = (L, x, y, s, fn) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L); fn(g); return g; };
const BA_PROPS = {
  きょうしつ: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.board(g, -130, -120, 260, 90, "", 0); for (let i = 0; i < 3; i++) { PR2.desk(g, -90 + i * 90, 50, 70); PR2.chair(g, -90 + i * 90, 72); } }); },
  こくご: (L, x, y, r) => BA_PROPS.きょうしつ(L, x, y, r), さんすう: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.board(g, -130, -120, 260, 90, "1 + 2 = 3", 34); for (let i = 0; i < 3; i++) PR2.desk(g, -90 + i * 90, 50, 70); }); },
  "あさの かい": (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.board(g, -130, -120, 260, 90, "おはよう", 32); for (let i = 0; i < 3; i++) PR2.desk(g, -90 + i * 90, 50, 70); }); },
  "かえりの かい": (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.board(g, -130, -120, 260, 90, "さようなら", 30); PR2.bag(g, -60, 50, .8); PR2.bag(g, 40, 50, .8); }); },
  やすみじかん: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.shelf(g, -40, 60, 160, 150); PR2.book(g, 90, 40, .8); PR2.ball(g, 110, -40, 22); }); },
  おんがくしつ: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.piano(g, 0, 40); PR2.note(g, -110, -60, .9); PR2.note(g, 100, -80, .9); }); },
  ずこうしつ: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.easel(g, -50, 60); PR2.palette(g, 90, 0, 1); }); },
  としょしつ: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.shelf(g, -70, 60, 150, 150); PR2.shelf(g, 90, 60, 150, 150); }); },
  たいいくかん: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { el("rect", { x: -140, y: -90, width: 280, height: 160, rx: 14, fill: "none", stroke: "#FFFFFF", "stroke-width": 8 }, g); el("circle", { r: 40, fill: "none", stroke: "#FFFFFF", "stroke-width": 8 }, g); PR2.ball(g, 110, -50, 24); PR2.ball(g, -100, 40, 20); }); },
  こうてい: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.bar(g, -70, 40, 120); PR2.ball(g, 80, 30, 24); tree2(g, 120, -40, 30); }); },
  きゅうしょく: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.table(g, 0, 40, 240); PR2.bowl(g, -70, 0, "#FFFFFF", "#F2B01E"); PR2.bowl(g, 10, 0, "#FFFFFF", "#FFFFFF"); PR2.bowl(g, 80, 0, "#FFFFFF", "#7BD389"); }); },
  はいぜん: (L, x, y, r) => BA_PROPS.きゅうしょく(L, x, y, r), テーブル: (L, x, y, r) => BA_PROPS.きゅうしょく(L, x, y, r),
  かたづけ: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { el("rect", { x: -110, y: -40, width: 220, height: 80, rx: 10, fill: "#B0B6C3", ...S6(5) }, g); PR2.bowl(g, -60, -40, "#FFFFFF", "#FFFFFF"); PR2.bowl(g, 10, -46, "#FFFFFF", "#FFFFFF"); PR2.bowl(g, 70, -40, "#FFFFFF", "#FFFFFF"); }); },
  ろうか: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.win(g, -120, -70, 80, 60); PR2.win(g, -10, -70, 80, 60); PR2.win(g, 100, -70, 80, 60); }); },
  げんかん: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { el("rect", { x: -40, y: -90, width: 80, height: 150, rx: 6, fill: "#B97A4A", ...S6(5) }, g); el("circle", { cx: 24, cy: 0, r: 5, fill: INK }, g); el("rect", { x: -120, y: 30, width: 240, height: 24, rx: 6, fill: "#D8A06A", ...S6(4) }, g); }); },
  げたばこ: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { el("rect", { x: -120, y: -80, width: 240, height: 150, fill: "#D8A06A", ...S6(5) }, g); for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) el("rect", { x: -110 + i * 58, y: -70 + j * 48, width: 50, height: 40, fill: "#FFFFFF", ...S6(3) }, g); }); },
  ほけんしつ: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.bed(g, -40, 50, 170); PR2.cross(g, 110, -70, .7); }); },
  ベッド: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.bed(g, -70, 50, 150); PR2.bed(g, 90, 50, 150); }); },
  うけつけ: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.counter(g, 0, 50, 220, "#FFFFFF"); PR2.cross(g, 100, -70, .6); }); },
  まちあい: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.bench(g, 0, 50, 200); PR2.book(g, -80, -40, .7, "#7FCBF0"); }); },
  しんさつしつ: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.bed(g, -30, 50, 150); PR2.cross(g, 110, -60, .6); }); },
  しんさつだい: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.dchair(g, 0, 50); PR2.tooth(g, 110, -70, .7); }); },
  びょういん: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { el("rect", { x: -120, y: -70, width: 240, height: 130, fill: "#FFFFFF", ...S6(5) }, g); PR2.cross(g, 0, -10, .8); }); },
  リビング: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.sofa(g, -40, 50, 170); PR2.tv(g, 110, -30, true); }); },
  こどもべや: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.bed(g, -50, 50, 150); PR2.book(g, 90, 30, .7); PR2.ball(g, 110, -30, 20); }); },
  "ともだちの へや": (L, x, y, r) => BA_PROPS.こどもべや(L, x, y, r),
  だいどころ: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { el("rect", { x: -120, y: -40, width: 240, height: 90, rx: 8, fill: "#B0B6C3", ...S6(5) }, g); el("rect", { x: -100, y: -30, width: 70, height: 40, rx: 6, fill: "#7FCBF0", ...S6(4) }, g); el("circle", { cx: 50, cy: -10, r: 16, fill: "#2B2A33" }, g); el("circle", { cx: 90, cy: -10, r: 16, fill: "#2B2A33" }, g); PR2.bowl(g, -40, -60, "#FFFFFF", "#F2B01E"); }); },
  ダイニング: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.table(g, 0, 40, 220); PR2.bowl(g, -60, 0, "#FFFFFF", "#E8735A"); PR2.bowl(g, 40, 0, "#FFFFFF", "#7BD389"); PR2.chair(g, -110, 60); PR2.chair(g, 110, 60); }); },
  いえ: (L, x, y, r) => { const s = Math.min(1.3, r / 150); K(L, x, y, s, g => artHouse(g, -110, -90, .9)); },
  "いえの まえ": (L, x, y, r) => { const s = Math.min(1.3, r / 150); K(L, x, y, s, g => { artHouse(g, -110, -100, .85); flower(g, -120, 100, "#FF8FA3"); flower(g, 120, 100, "#FFFFFF"); }); },
  "ともだちの いえ": (L, x, y, r) => { const s = Math.min(1.3, r / 150); K(L, x, y, s, g => artHouse(g, -110, -90, .9, "#FFE0E6", "#E8735A")); },
  がっこう: (L, x, y, r) => { const s = Math.min(1.3, r / 150); K(L, x, y, s, g => artSchool(g, -150, -110, .95)); },
  こうもん: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.gate(g, 0, 60); tree2(g, -150, 0, 30); }); },
  こうえん: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.slide(g, 20, 60, .9); tree2(g, -120, 0, 34); flower(g, 120, 70, "#FF8FA3"); }); },
  ひろば: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { tree2(g, -110, 0, 34); tree2(g, 110, 10, 30); PR2.ball(g, 0, 50, 22); flower(g, -40, 80, "#B9A8D9"); }); },
  すべりだい: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => PR2.slide(g, 0, 60, 1)); },
  ブランコ: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => PR2.swing(g, 0, 60)); },
  ベンチ: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.bench(g, 0, 50, 160); tree2(g, 130, -10, 28); }); },
  すなば: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { el("ellipse", { rx: 130, ry: 70, fill: "#F6E2A8", ...S6(5) }, g); el("path", { d: "M-40 10 q20 -50 40 0 z", fill: "#E8C77A", ...S6(3) }, g); el("rect", { x: 30, y: -16, width: 18, height: 30, rx: 4, fill: "#FF6F91", ...S6(3) }, g); }); },
  いけ: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { el("ellipse", { rx: 130, ry: 70, fill: "#8FD3F0", ...S6(5) }, g); el("ellipse", { cx: -50, cy: 10, rx: 30, ry: 10, fill: "#7CC36A", ...S6(3) }, g); el("ellipse", { cx: 50, cy: -15, rx: 30, ry: 10, fill: "#7CC36A", ...S6(3) }, g); }); },
  みずのみば: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => PR2.fountain(g, 0, 60)); },
  てつぼう: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.bar(g, -60, 60, 120); PR2.bar(g, 90, 60, 100); }); },
  トラック: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { el("ellipse", { rx: 140, ry: 70, fill: "none", stroke: "#FFFFFF", "stroke-width": 8 }, g); el("ellipse", { rx: 100, ry: 40, fill: "none", stroke: "#FFFFFF", "stroke-width": 8 }, g); }); },
  ボールプール: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { el("rect", { x: -140, y: -60, width: 280, height: 120, rx: 30, fill: "#BDE3F2", ...S6(5) }, g); for (let i = 0; i < 16; i++) el("circle", { cx: -120 + (i * 37) % 240, cy: -40 + (i * 23) % 80, r: 14, fill: ["#FF6F91", "#FFD25E", "#7BD389", "#B9A8D9"][i % 4], ...S6(3) }, g); }); },
  いりぐち: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { el("path", { d: "M-100 60 V-60 Q0 -120 100 -60 V60", fill: "#FFD25E", ...S6(5) }, g); txt(g, 0, -40, "いりぐち", 30, { "text-anchor": "middle" }); }); },
  パンや: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.counter(g, 0, 50, 220, "#FFD25E"); PR2.bread(g, -60, -40); PR2.bread(g, 10, -50); PR2.bread(g, 70, -40); }); },
  やおや: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.counter(g, 0, 50, 220, "#7BD389"); PR2.apple(g, -60, -40); PR2.apple(g, 0, -50, "#7BD389"); PR2.apple(g, 60, -40, "#FFB34D"); }); },
  おかしや: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.counter(g, 0, 50, 220, "#FFB4D1"); PR2.lolli(g, -60, -70, .7); PR2.cake(g, 50, -30, .5); }); },
  レジ: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.counter(g, 0, 50, 200, "#E8735A"); el("rect", { x: -40, y: -70, width: 80, height: 50, rx: 8, fill: "#B0B6C3", ...S6(4) }, g); el("rect", { x: -30, y: -62, width: 60, height: 20, rx: 4, fill: "#7FCBF0" }, g); }); },
  せき: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.table(g, 0, 40, 160); PR2.chair(g, -100, 60); PR2.chair(g, 100, 60); PR2.burger(g, 0, -6, .7); }); },
  えき: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.clock(g, 0, -60, 34); el("rect", { x: -110, y: -10, width: 220, height: 70, rx: 8, fill: "#FFFFFF", ...S6(5) }, g); txt(g, 0, 36, "えき", 32, { "text-anchor": "middle" }); }); },
  でんしゃ: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => PR2.train(g, 0, 60, 260)); },
  バス: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => artBus(g, -120, -40, .8)); },
  バスてい: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { el("path", { d: "M60 60 V-80", ...S6(8) }, g); el("circle", { cx: 60, cy: -100, r: 34, fill: "#FFFFFF", ...S6(5) }, g); txt(g, 60, -90, "バス", 24, { "text-anchor": "middle" }); PR2.bench(g, -60, 50, 130); }); },
  おうだんほどう: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { for (let i = 0; i < 6; i++) el("rect", { x: -120 + i * 42, y: -40, width: 26, height: 90, fill: "#FFFFFF", ...S6(3) }, g); BA.light(g, 120, -40, .8); }); },
  こうさてん: (L, x, y, r) => BA_PROPS.おうだんほどう(L, x, y, r),
  つうがくろ: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { tree2(g, -100, 0, 30); tree2(g, 100, 0, 30); el("rect", { x: -40, y: -80, width: 80, height: 60, rx: 8, fill: "#FFD25E", ...S6(5) }, g); txt(g, 0, -38, "学", 34, { "text-anchor": "middle" }); }); },
  かえりみち: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { tree2(g, -110, 0, 32); artHouse(g, -10, -70, .55); flower(g, 120, 60, "#FF8FA3"); }); },
  みち: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { BA.light(g, 0, -30, 1); tree2(g, -110, 10, 30); }); },
  ほどう: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { el("rect", { x: -140, y: -20, width: 280, height: 40, fill: "#E3E3E3", ...S6(4) }, g); tree2(g, -90, -40, 28); tree2(g, 90, -40, 28); }); },
  サイクリングロード: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { PR2.bike(g, 0, 50, .9); tree2(g, -130, 0, 28); flower(g, 120, 50, "#FFFFFF"); }); },
  まち: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { el("rect", { x: -130, y: -90, width: 110, height: 150, fill: "#FFE0E6", ...S6(5) }, g); el("rect", { x: -10, y: -60, width: 140, height: 120, fill: "#DDF0FF", ...S6(5) }, g); el("rect", { x: -130, y: -110, width: 110, height: 24, fill: "#E8735A", ...S6(4) }, g); el("rect", { x: -10, y: -80, width: 140, height: 24, fill: "#7FA7D9", ...S6(4) }, g); [[-110, -60], [-70, -60], [-110, -10], [-70, -10]].forEach(([wx, wy]) => el("rect", { x: wx, y: wy, width: 26, height: 26, fill: "#FFFFFF", ...S6(3) }, g)); }); },
  あさ: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { el("circle", { cx: 0, cy: -20, r: 50, fill: "#FFE27A", ...S6(5) }, g); for (let i = 0; i < 8; i++) { const a = i / 4 * Math.PI; el("path", { d: `M${Math.cos(a) * 64} ${-20 + Math.sin(a) * 64} L${Math.cos(a) * 86} ${-20 + Math.sin(a) * 86}`, ...S6(6) }, g); } PR2.clock(g, 110, 50, 30); }); },
  ひる: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { el("circle", { cx: 0, cy: -30, r: 56, fill: "#FFD25E", ...S6(5) }, g); PR2.bowl(g, 0, 60, "#FFFFFF", "#F2B01E"); }); },
  ゆうがた: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { el("rect", { x: -150, y: 0, width: 300, height: 10, fill: INK }, g); el("circle", { cx: 0, cy: 0, r: 56, fill: "#FF9E5E", ...S6(5) }, g); el("rect", { x: -150, y: 0, width: 300, height: 80, fill: "#2B2A3355" }, g); }); },
  よる: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { el("rect", { x: -150, y: -100, width: 300, height: 200, rx: 20, fill: "#2E3A6E" }, g); PR2.moon(g, 40, -20, 36); PR2.star(g, -90, -50, 14, "#FFE27A"); PR2.star(g, -60, 40, 10, "#FFE27A"); PR2.star(g, 110, 50, 12, "#FFE27A"); }); },
  おでかけ: (L, x, y, r) => BA_PROPS.まち(L, x, y, r),
  おまつり: (L, x, y, r) => { const s = Math.min(1.2, r / 150); K(L, x, y, s, g => { el("rect", { x: -120, y: -40, width: 240, height: 100, fill: "#FFFFFF", ...S6(5) }, g); el("path", { d: "M-130 -40 L0 -100 L130 -40 Z", fill: "#E8473C", ...S6(5) }, g); txt(g, 0, 20, "やきそば", 28, { "text-anchor": "middle" }); }); },
};
BA.light = (g, x, y, s = 1) => { const k = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, g); el("rect", { x: -22, y: -70, width: 44, height: 110, rx: 10, fill: "#2B2A33" }, k); [["#E8473C", -48], ["#FFD25E", -20], ["#5FC46A", 8]].forEach(([c, yy]) => el("circle", { cx: 0, cy: yy + 10, r: 12, fill: c }, k)); el("path", { d: "M0 40 V100", ...S6(8) }, k); };
/* ---- へやの そとの かざり（テーマごと） ---- */
BA.decor = {
  class: (L, x, y, r) => BA.plant(L, x, y + 30, Math.min(1, r / 90)),
  school: (L, x, y, r) => BA.decor.class(L, x, y, r),
  hospital: (L, x, y, r) => BA.plant(L, x, y + 30, .9),
  home: (L, x, y, r) => (Math.floor(x / 90) % 2 ? BA.plant(L, x, y + 30, Math.min(1, r / 90)) : BA.rug(L, x, y, Math.min(1, r / 90))),
  shop: (L, x, y, r) => BA.plant(L, x, y + 30, .9),
  town: (L, x, y, r) => (r > 90 ? artHouse(L, x - 70, y - 60, .55) : tree2(L, x, y + 20, Math.min(34, r * .5))),
  park: (L, x, y, r) => (r > 70 ? tree2(L, x, y + 20, Math.min(40, r * .5)) : flower(L, x, y, ["#FF8FA3", "#FFFFFF", "#B9A8D9"][Math.floor(x / 100) % 3])),
  yard: (L, x, y, r) => (r > 70 ? tree2(L, x, y + 20, Math.min(36, r * .5)) : null),
  play: (L, x, y, r) => PR2.star(L, x, y, Math.min(22, r * .3), ["#FF8FA3", "#FFD25E", "#7FCBF0"][Math.floor(x / 100) % 3]),
  mix: (L, x, y, r) => (r > 70 ? tree2(L, x, y + 20, Math.min(34, r * .5)) : flower(L, x, y, "#FF8FA3")),
};
BA.rug = (L, x, y, s = 1) => { el("ellipse", { cx: x, cy: y, rx: 90 * s, ry: 55 * s, fill: "#FFD9E0", ...S6(4) }, L); el("ellipse", { cx: x, cy: y, rx: 60 * s, ry: 34 * s, fill: "none", stroke: "#FFFFFF", "stroke-width": 5 }, L); };
BA.plant = (L, x, y, s = 1) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L); el("path", { d: "M-26 0 H26 L20 40 H-20 Z", fill: "#D9774A", ...S6(4) }, g); [[-20, -30], [0, -50], [20, -30], [-8, -70], [10, -72]].forEach(([dx, dy]) => el("ellipse", { cx: dx, cy: dy, rx: 16, ry: 26, fill: "#6DBB5E", transform: `rotate(${dx * 1.2} ${dx} ${dy})`, ...S6(4) }, g)); };
/* ---- 木の 看板 ---- */
BA.sign = (L, x, y, t, fill) => { const w = t.length * 30 + 44; el("path", { d: `M${x} ${y + 12} V${y + 36}`, ...S6(8) }, L); el("rect", { x: x - w / 2, y: y - 36, width: w, height: 50, rx: 10, fill: fill || "#FFF1C9", ...S6(5) }, L); el("rect", { x: x - w / 2 + 6, y: y - 30, width: w - 12, height: 38, rx: 7, fill: "none", stroke: "#2B2A3322", "stroke-width": 3 }, L); txt(L, x, y - 1, t, 28, { "text-anchor": "middle" }); };
/* ---- 本体 ---- */
BA.areaBox = (B, place, pad = 80) => { const pts = Object.entries(B.nodes).filter(([id]) => B.place[id] === place).map(([, p]) => p); if (!pts.length) return null;
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); return [Math.max(24, Math.min(...xs) - pad), Math.max(150, Math.min(...ys) - pad), Math.min(1576, Math.max(...xs) + pad), Math.min(985, Math.max(...ys) + pad)]; };
BA.paint = function (L, B, stage) {
  const theme = BA.themeOf[stage] || "mix", d = STAGE_DEF[stage] || {};
  BA.ground[BA_GROUND[theme]](L, d.ground);
  const places = [...new Set(Object.values(B.place))], boxes = {};
  const outdoor = ["park", "yard", "town", "mix"].includes(theme);
  // へや／エリア（大きい ものから かく）
  places.map(p => [p, BA.areaBox(B, p)]).filter(x => x[1]).sort((a, b) => (b[1][2] - b[1][0]) * (b[1][3] - b[1][1]) - (a[1][2] - a[1][0]) * (a[1][3] - a[1][1])).forEach(([p, bx]) => {
    const [x0, y0, x1, y1] = bx; boxes[p] = bx; const fill = (d.fills && d.fills[p]) || "#FFF1C9";
    el("rect", { x: x0, y: y0, width: x1 - x0, height: y1 - y0, rx: outdoor ? 90 : 36, fill, stroke: outdoor ? "#00000022" : INK, "stroke-width": outdoor ? 6 : 7, "stroke-linejoin": "round" }, L);
  });
  // へやの 中の 道具
  places.forEach(p => { const bx = boxes[p]; if (!bx) return; const fn = BA_PROPS[p]; if (!fn) return;
    const sp = bgFree(B, 2, { minR: 50, maxR: 220, x0: bx[0] + 30, x1: bx[2] - 30, y0: bx[1] + 30, y1: bx[3] - 30 });
    sp.forEach(([x, y, r], i) => { if (i === 0 || r > 130) fn(L, x, y, r); }); });
  // そとの かざり
  const used = Object.values(boxes);
  const sp = bgFree(B, 8, { minR: 45, maxR: 120, avoid: used.map(([x0, y0, x1, y1]) => [(x0 + x1) / 2, (y0 + y1) / 2, Math.max(x1 - x0, y1 - y0) / 2]) });
  sp.forEach(([x, y, r]) => { try { BA.decor[theme](L, x, y, r); } catch (e) { } });
};
/* ---- どの コースを かきかえるか：bg7 を つかって いた もの ＋ 色の 四角だけ だった もの ---- */
BA.stages = ["gakkou3", "kyuushoku", "gekou", "ouchi1", "tomodachi1", "sensei1", "ie1", "kouen2", "seki1", "asobiba", "burger", "hoken2", "byouin", "haisha", "yuushoku", "kokugo", "taiiku", "ongaku", "zukou", "jitensha", "yasumi", "komatta", "kirikae", "kikikaesu", "matsu", "sos", "junban", "kotowaru", "bousai", "denwa", "tokei", "souzou", "tachiba", "sakiyomi", "chotto", "aite", "kaerimichi", "manekko"];
BA.stages.forEach(id => { BOARD_BG[id] = (L, B) => BA.paint(L, B, id); });
// 看板は BA.paint で かくので、もとの 札は 出さない
{ const db = drawBoard; drawBoard = function () { const B = BOARD[curStage]; let keep = null; if (B && BA.stages.includes(curStage) && B.labels) { keep = B.labels; B.labels = []; }
    try { db(); } finally { if (keep) B.labels = keep; }
    if (keep) { const d = STAGE_DEF[curStage] || {}; keep.forEach(([t, x, y]) => BA.sign(boardLayer, x, y, t, d.fills && d.fills[t])); } }; }
