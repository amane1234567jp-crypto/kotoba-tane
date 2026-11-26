/* ================= ロングコース「うらしまたろう」（urashima、2026-11-26） =================
   あまねさん：うらしまたろうの おはなしを みんなで さいげん する「げき」。セリフを あそぶ ひとに いって もらう。
   ・🎭 げき：4まく（はまべ → うみの なか → りゅうぐうじょう → かえりみち）×6場面。まくの なかは おはなしの じゅんに すすむ。
     あそぶ ひとは やく（うらしまたろう・かめ・おとひめさま・こども）に なって、おてほんの セリフを いう。やくに あわせて かぶりものを つける。
   ・しかけ（おにごっこを さんこうに、ぜんぶ うらしまたろうの せかいに）：🍱 ごちそう（もう1かい）・🐬 いるか（2マス）・とびうお（3マス）・たいの おどり（つぎ 2ばい）
     ・おうぎ（サイコロ 2こ）・🐢 かめの せなか（すーい すーい ワープ、小・大）・さんごの ベッド（やすみ）・🌀 うずしお（6マス もどる）・くらげの むれ（3マス もどる）
     ・たいや ひらめの ぎょうれつ（みんな 2マス すすむ）・🐋 くじら（がめんの そとから きて、しおふきで 5マス とばす）・わかめ（2マス もどる）・🔀 おおなみで くみかえ。
   ・おもしろ：🐚 かいがら あけ（ふうせん わりの かわり）・🎣 さかなつり（ルーレットの かわり）。
   ・あたらしい しかけ 🎁 たまてばこ：おとひめさまから もらった はこを「あける／あけない」と えらぶ。
     あけない＝やくそくを まもって 3マス すすむ。あける＝けむり もくもく → たいてい おじいさんに へんしん（しろい ひげ。つぎの サイコロは はんぶん）、ときどき つるが きて 8マス ひとっとび。
   ・盤：slong.js の UT_PTS。キャラ：rig/part_chars.js の urashima・otohime・kame。データと 声：sit/urashima_gen.py → urashima_data.js・sit/pony_urashima.json・aivis/jobs/ut1 */
const UT_N = new Map();
const UTS = { told: 0 };
Object.assign(ASK_AT, { urashima: [1230, 1.0], otohime: [1230, 1.0], kame: [1230, .9] });
Object.assign(KID_S, { urashima: 1.0, otohime: 1.0, kame: .9 });
Object.assign(PIECE_S, { urashima: .22, otohime: .22, kame: .2 });
const utI = id => SL_ORDER.urashima.indexOf(id);
const isUT = () => curStage === "urashima";
/* ---------- マスの ならび（48） ---------- */
{ const PL = [null, "ut", "ut", "e:iruka", "ut", "e:gochisou", "ut", "ukai", "e:kame", "ut", "e:sango", "ut",
    "ut", "e:ougi", "ut", "e:wakame", "utsuri", "e:kurage", "ut", "ut", "e:tobiuo", null, "ut", "e:tai",
    "ut", "e:uzu", "ut", "e:kujira", "ut", "e:kame2", "ut", "e:kumikae", "ukai", "e:tamate", "ut", "e:odori",
    "ut", "e:kurage", "ut", "e:tamate", "utsuri", "e:tobiuo", "ut", "ut", "e:wakame", "ut", "ut", null];
  const BASE = { gochisou: "again", ougi: "dice2", tai: "x2", sango: "rest", kumikae: "kumikae" };
  const O = SL_ORDER.urashima, ev = {}, task = {};
  O.forEach((id, i) => { const p = PL[i]; if (!p || id === "0" || id === "4" || id === "15") return;
    if (p.startsWith("e:")) { const t = p.slice(2); ev[id] = t === "tamate" ? ["tamate", 0, "utp_tm_ask", UT.txt.utp_tm_ask, t] : [BASE[t] || t, 0, `sl_urashima_${t}`, UT.evt[t], t]; } else task[id] = p; });
  EVENTS.urashima = ev; LONG_TASKS.urashima = task;
  LEGENDS.urashima = [["ut", "げき"], ["ukai", "かいがら"], ["utsuri", "さかなつり"]]; }
Object.assign(LTASK, { ut: ["#FFE9F2", "🎭"], ukai: ["#FFF4E6", "🐚"], utsuri: ["#DFF3FF", "🎣"] });
BOARD.urashima.style = () => "nami";
ROAD.nami = (L, d, a, b, pass) => { if (pass === "under") { pathEl(L, d, { stroke: "#2F6FA8", "stroke-width": 46, opacity: .35 }); pathEl(L, d, { stroke: "#FFFFFF", "stroke-width": 34, opacity: .75 }); } else pathEl(L, d, { stroke: "#7FCBF0", "stroke-width": 5, "stroke-dasharray": "4 20", opacity: .9 }); };
/* ---------- え：うみの いきもの・たまてばこ・おしろ（みぎむき） ---------- */
const utG = (L, x, y, s = 1) => el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L);
function utTurtle(L, x, y, s = 1) { const g = utG(L, x, y, s);
  [[-52, 30, 30], [44, 30, -30]].forEach(([fx, fy, r]) => el("ellipse", { cx: fx, cy: fy, rx: 30, ry: 13, fill: "#9ADB8A", ...S6(4), transform: `rotate(${r} ${fx} ${fy})` }, g));
  el("path", { d: "M-82 12 Q-104 16 -112 6 Q-100 2 -82 6 Z", fill: "#9ADB8A", ...S6(4) }, g);
  el("path", { d: "M-84 20 Q-80 -52 0 -54 Q80 -52 84 20 Q0 40 -84 20 Z", fill: "#4E9A6B", ...S6(5) }, g);
  el("path", { d: "M-40 -40 L-24 -10 L-48 14 M40 -40 L24 -10 L48 14 M-24 -10 H24 M0 -54 V-10 M-24 -10 L-12 22 M24 -10 L12 22", fill: "none", stroke: "#2E6B52", "stroke-width": 4, "stroke-linecap": "round" }, g);
  el("ellipse", { cx: 104, cy: -6, rx: 32, ry: 26, fill: "#9ADB8A", ...S6(5) }, g); el("circle", { cx: 114, cy: -12, r: 6, fill: INK }, g); el("circle", { cx: 112, cy: -14, r: 2, fill: "#FFFFFF" }, g);
  el("path", { d: "M112 4 Q122 10 130 2", fill: "none", ...S6(3) }, g); el("ellipse", { cx: 98, cy: 4, rx: 7, ry: 4, fill: "#FF9FB0" }, g); return g; }
function utFish(L, x, y, s = 1, col = "#F0645A", fin = "#FFB13B") { const g = utG(L, x, y, s);
  el("path", { d: "M-50 0 L-92 -34 Q-80 0 -92 34 Z", fill: fin, ...S6(4) }, g); el("path", { d: "M-10 -34 Q10 -62 40 -38 Z", fill: fin, ...S6(4) }, g);
  el("path", { d: "M-56 0 Q-10 -52 50 -20 Q72 -6 72 2 Q66 18 46 26 Q-10 48 -56 0 Z", fill: col, ...S6(5) }, g);
  el("path", { d: "M10 -30 Q-2 0 12 30", fill: "none", stroke: INK, "stroke-width": 3, opacity: .5 }, g); el("path", { d: "M-4 6 q14 10 0 22", fill: fin, ...S6(3) }, g);
  el("circle", { cx: 42, cy: -8, r: 9, fill: "#FFFFFF", ...S6(3) }, g); el("circle", { cx: 44, cy: -8, r: 4, fill: INK }, g); el("path", { d: "M58 10 Q66 14 70 8", fill: "none", ...S6(3) }, g); return g; }
function utHirame(L, x, y, s = 1) { const g = utG(L, x, y, s);
  el("path", { d: "M-60 0 L-96 -22 L-90 0 L-96 22 Z", fill: "#C9A26B", ...S6(4) }, g); el("ellipse", { cx: 0, cy: 0, rx: 68, ry: 44, fill: "#D9B98A", ...S6(5) }, g);
  el("path", { d: "M-50 -30 Q0 -62 50 -30 M-50 30 Q0 62 50 30", fill: "none", stroke: "#B8946A", "stroke-width": 8, "stroke-linecap": "round" }, g);
  [[-20, -8], [4, 14], [-34, 14], [10, -18]].forEach(([cx, cy]) => el("circle", { cx, cy, r: 6, fill: "#B8946A" }, g));
  [[34, -12], [46, 4]].forEach(([cx, cy]) => { el("circle", { cx, cy, r: 8, fill: "#FFFFFF", ...S6(3) }, g); el("circle", { cx: cx + 1, cy, r: 3.5, fill: INK }, g); }); el("path", { d: "M50 18 Q58 22 62 16", fill: "none", ...S6(3) }, g); return g; }
function utTako(L, x, y, s = 1) { const g = utG(L, x, y, s);
  [-70, -42, -14, 14, 42, 70].forEach((lx, i) => { const p = el("path", { d: `M${lx * .6} 30 Q${lx} 70 ${lx + (i % 2 ? 14 : -14)} 110 Q${lx + (i % 2 ? 26 : -26)} 126 ${lx + (i % 2 ? 30 : -30)} 108`, fill: "none", stroke: INK, "stroke-width": 26, "stroke-linecap": "round" }, g);
    el("path", { d: p.getAttribute("d"), fill: "none", stroke: "#F0645A", "stroke-width": 17, "stroke-linecap": "round" }, g); });
  el("path", { d: "M-70 20 Q-84 -90 0 -96 Q84 -90 70 20 Q0 50 -70 20 Z", fill: "#F0645A", ...S6(5) }, g);
  [[-24, -14], [24, -14]].forEach(([cx, cy]) => { el("circle", { cx, cy, r: 13, fill: "#FFFFFF", ...S6(3) }, g); el("circle", { cx, cy: cy + 2, r: 6, fill: INK }, g); });
  el("ellipse", { cx: 0, cy: 16, rx: 14, ry: 10, fill: "#FFB8A0", ...S6(4) }, g); [[-44, 6], [44, 6]].forEach(([cx, cy]) => el("ellipse", { cx, cy, rx: 10, ry: 6, fill: "#FF9FB0" }, g));
  el("path", { d: "M-40 -70 H40 L34 -84 H-34 Z", fill: "#FFFFFF", ...S6(3) }, g); el("path", { d: "M34 -78 l22 -10 l-6 18 z", fill: "#FFFFFF", ...S6(3) }, g); return g; }
function utEbi(L, x, y, s = 1) { const g = utG(L, x, y, s); // もんばんの えび（やりを もって たつ）
  el("path", { d: "M70 150 V-150", stroke: "#8B5A3C", "stroke-width": 9, "stroke-linecap": "round" }, g); el("path", { d: "M70 -150 L54 -110 H86 Z", fill: "#D9DEE6", ...S6(4) }, g);
  el("path", { d: "M-10 -110 Q-70 -170 -110 -150 M10 -110 Q-30 -190 -60 -196", fill: "none", stroke: "#E8473C", "stroke-width": 5, "stroke-linecap": "round" }, g);
  [[-30, 110, 40], [-6, 70, 44], [10, 26, 48], [16, -20, 50]].forEach(([cx, cy, r]) => el("ellipse", { cx, cy, rx: r, ry: 34, fill: "#F0645A", ...S6(5) }, g));
  el("path", { d: "M-60 130 Q-100 150 -96 110 Q-70 120 -50 110 Z", fill: "#FF9F8F", ...S6(4) }, g);
  el("ellipse", { cx: 10, cy: -78, rx: 50, ry: 46, fill: "#F0645A", ...S6(5) }, g); [[-10, -86], [28, -86]].forEach(([cx, cy]) => { el("circle", { cx, cy, r: 11, fill: "#FFFFFF", ...S6(3) }, g); el("circle", { cx: cx - 2, cy, r: 5, fill: INK }, g); });
  el("path", { d: "M-6 -58 Q8 -50 22 -58", fill: "none", ...S6(3) }, g); el("path", { d: "M-30 -126 H50 L40 -146 H-20 Z", fill: "#3E5BD6", ...S6(4) }, g);
  [[40, 0], [44, 44]].forEach(([lx, ly]) => el("path", { d: `M${lx} ${ly} Q60 ${ly + 4} 68 ${ly - 10}`, fill: "none", stroke: "#E8473C", "stroke-width": 7, "stroke-linecap": "round" }, g)); return g; }
function utKurage(L, x, y, s = 1, col = "#D9C2F0") { const g = utG(L, x, y, s);
  [-24, -8, 8, 24].forEach((lx, i) => el("path", { d: `M${lx} 8 q${i % 2 ? 10 : -10} 22 0 44 q${i % 2 ? -10 : 10} 18 0 36`, fill: "none", stroke: col, "stroke-width": 6, "stroke-linecap": "round" }, g));
  el("path", { d: "M-44 10 Q-46 -46 0 -48 Q46 -46 44 10 Q22 20 0 10 Q-22 20 -44 10 Z", fill: col, ...S6(4), opacity: .92 }, g);
  el("circle", { cx: -12, cy: -12, r: 4, fill: INK }, g); el("circle", { cx: 12, cy: -12, r: 4, fill: INK }, g); el("path", { d: "M-6 0 Q0 5 6 0", fill: "none", ...S6(3) }, g);
  el("path", { d: "M26 -44 l8 -14 l2 14 l12 2 l-12 6 z", fill: "#FFE27A", ...S6(2) }, g); return g; }
function utDolphin(L, x, y, s = 1) { const g = utG(L, x, y, s);
  el("path", { d: "M-70 6 Q-104 -6 -116 -34 Q-96 -22 -84 -24 Q-100 10 -112 30 Q-92 22 -70 14 Z", fill: "#6FB7E8", ...S6(4) }, g);
  el("path", { d: "M-78 6 Q-30 -50 40 -34 Q70 -26 86 -6 L112 -2 Q98 12 82 10 Q40 34 -20 26 Q-56 22 -78 6 Z", fill: "#6FB7E8", ...S6(5) }, g);
  el("path", { d: "M-40 16 Q20 30 78 8 Q40 30 -20 26 Z", fill: "#EAF6FF" }, g); el("path", { d: "M-6 -40 Q4 -72 30 -60 Q18 -48 20 -36 Z", fill: "#5AA5D8", ...S6(4) }, g);
  el("path", { d: "M10 14 Q22 40 2 44 Q4 26 -4 18 Z", fill: "#5AA5D8", ...S6(4) }, g); el("circle", { cx: 58, cy: -12, r: 5, fill: INK }, g); el("path", { d: "M84 4 Q96 6 104 0", fill: "none", ...S6(3) }, g); return g; }
function utTobiuo(L, x, y, s = 1) { const g = utG(L, x, y, s);
  el("path", { d: "M-50 0 L-90 -26 L-78 0 L-94 30 Z", fill: "#5AA5D8", ...S6(4) }, g);
  const w = el("path", { d: "M-10 -10 Q-40 -80 30 -96 Q40 -50 24 -12 Z", fill: "#BDE9F5", ...S6(4) }, g); el("animateTransform", { attributeName: "transform", type: "rotate", values: "0 0 -10;-14 0 -10;0 0 -10", dur: ".3s", repeatCount: "indefinite" }, w);
  el("path", { d: "M-56 0 Q0 -30 60 -8 Q74 0 60 10 Q0 28 -56 0 Z", fill: "#7FCBF0", ...S6(5) }, g); el("path", { d: "M-40 6 Q10 20 58 8 Q10 26 -40 6 Z", fill: "#EAF6FF" }, g);
  el("circle", { cx: 44, cy: -4, r: 7, fill: "#FFFFFF", ...S6(3) }, g); el("circle", { cx: 46, cy: -4, r: 3.5, fill: INK }, g); return g; }
function utWhale(L, x, y, s = 1) { const g = utG(L, x, y, s);
  el("path", { d: "M-230 -10 Q-290 -40 -300 -100 Q-262 -78 -240 -84 Q-262 -30 -300 10 Q-262 10 -230 10 Z", fill: "#3E6FB8", ...S6(6) }, g);
  el("path", { d: "M-240 0 Q-200 -130 0 -140 Q200 -134 250 -30 Q262 10 240 50 Q120 110 -60 96 Q-200 80 -240 0 Z", fill: "#4E86D6", ...S6(7) }, g);
  el("path", { d: "M-200 40 Q-40 100 120 84 Q220 68 246 30 Q250 50 240 52 Q120 112 -60 98 Q-170 86 -200 40 Z", fill: "#EAF6FF", ...S6(5) }, g);
  [-90, -30, 30, 90].forEach(lx => el("path", { d: `M${lx} 62 q10 16 0 30`, fill: "none", stroke: "#9FC3E8", "stroke-width": 5 }, g));
  el("circle", { cx: 170, cy: -30, r: 14, fill: "#FFFFFF", ...S6(4) }, g); el("circle", { cx: 174, cy: -30, r: 7, fill: INK }, g); el("path", { d: "M150 30 Q200 46 238 14", fill: "none", ...S6(5) }, g);
  el("ellipse", { cx: 136, cy: 6, rx: 16, ry: 9, fill: "#FF9FB0", opacity: .8 }, g); el("path", { d: "M20 60 Q50 130 -10 130 Q10 100 -20 70 Z", fill: "#3E6FB8", ...S6(5) }, g);
  el("ellipse", { cx: 40, cy: -138, rx: 16, ry: 6, fill: "#2B4E8A" }, g); return g; } // しおふきの あなは (40, -138)
function utCrane(L, x, y, s = 1) { const g = utG(L, x, y, s);
  const w = el("g", {}, g); el("path", { d: "M-10 -10 Q-60 -130 30 -150 Q60 -90 40 -10 Z", fill: "#FFFFFF", ...S6(5) }, w); el("path", { d: "M-34 -96 Q0 -150 30 -150 Q10 -110 -16 -74 Z", fill: "#2B2A33", ...S6(4) }, w);
  el("animateTransform", { attributeName: "transform", type: "scale", values: "1 1;1 -.5;1 1", dur: ".5s", repeatCount: "indefinite" }, w);
  el("path", { d: "M-70 10 Q-110 0 -130 20 Q-100 30 -70 26 Z", fill: "#2B2A33", ...S6(4) }, g); el("ellipse", { cx: 0, cy: 10, rx: 76, ry: 34, fill: "#FFFFFF", ...S6(5) }, g);
  el("path", { d: "M60 0 Q110 -20 120 -70", fill: "none", stroke: INK, "stroke-width": 20, "stroke-linecap": "round" }, g); el("path", { d: "M60 0 Q110 -20 120 -70", fill: "none", stroke: "#FFFFFF", "stroke-width": 12, "stroke-linecap": "round" }, g);
  el("path", { d: "M86 -26 Q112 -34 118 -60", fill: "none", stroke: "#2B2A33", "stroke-width": 12, "stroke-linecap": "round" }, g);
  el("circle", { cx: 122, cy: -80, r: 18, fill: "#FFFFFF", ...S6(4) }, g); el("path", { d: "M110 -94 Q122 -104 134 -94 Z", fill: "#E8473C", ...S6(3) }, g); el("circle", { cx: 128, cy: -80, r: 4, fill: INK }, g);
  el("path", { d: "M138 -84 L184 -76 L138 -70 Z", fill: "#FFD25E", ...S6(3) }, g); el("path", { d: "M-30 40 L-80 70 M-10 42 L-64 78", stroke: INK, "stroke-width": 4, "stroke-linecap": "round" }, g); return g; }
function utBox(L, x, y, s = 1, open = false) { const g = utG(L, x, y, s); // たまてばこ：くろい うるしの はこ・きんの もよう・あかい ひも
  el("rect", { x: -70, y: -30, width: 140, height: 76, rx: 8, fill: "#2B2A33", ...S6(5) }, g); el("path", { d: "M-70 0 H70", stroke: "#FFD25E", "stroke-width": 5 }, g);
  [[-40, 22], [0, 22], [40, 22]].forEach(([cx, cy]) => { el("circle", { cx, cy, r: 9, fill: "none", stroke: "#FFD25E", "stroke-width": 3 }, g); el("circle", { cx, cy, r: 3, fill: "#FFD25E" }, g); });
  const lid = el("g", open ? { transform: "translate(40 -64) rotate(24)" } : {}, g); el("rect", { x: -78, y: -52, width: 156, height: 30, rx: 8, fill: "#3A3944", ...S6(5) }, lid); el("path", { d: "M-60 -37 H60", stroke: "#FFD25E", "stroke-width": 4, "stroke-dasharray": "10 8" }, lid);
  if (!open) { el("path", { d: "M-10 -52 V46 M10 -52 V46", stroke: "#E8473C", "stroke-width": 7 }, g); el("path", { d: "M0 -52 Q-44 -92 -40 -56 Q-30 -44 0 -52 Q44 -92 40 -56 Q30 -44 0 -52 Z", fill: "#E8473C", ...S6(4) }, g); el("path", { d: "M-4 -50 L-22 -18 M4 -50 L22 -18", stroke: "#E8473C", "stroke-width": 7, "stroke-linecap": "round" }, g); }
  g.lid = lid; return g; }
function utCastle(L, x, y, s = 1) { const g = utG(L, x, y, s); // りゅうぐうじょう
  const roof = (cx, cy, w, h) => { el("path", { d: `M${cx - w} ${cy} Q${cx - w * .6} ${cy - h * .5} ${cx - w * .3} ${cy - h} H${cx + w * .3} Q${cx + w * .6} ${cy - h * .5} ${cx + w} ${cy} Z`, fill: "#3FA7A0", ...S6(5) }, g);
    el("path", { d: `M${cx - w} ${cy} q-18 -4 -24 -22 M${cx + w} ${cy} q18 -4 24 -22`, fill: "none", stroke: "#FFD25E", "stroke-width": 7, "stroke-linecap": "round" }, g); el("path", { d: `M${cx - w * .3} ${cy - h} H${cx + w * .3}`, stroke: "#FFD25E", "stroke-width": 8, "stroke-linecap": "round" }, g); };
  el("rect", { x: -250, y: -60, width: 500, height: 130, fill: "#FFF4EA", ...S6(5) }, g); [-210, -120, 120, 210].forEach(px => el("rect", { x: px - 14, y: -60, width: 28, height: 130, fill: "#E8473C", ...S6(4) }, g));
  el("path", { d: "M-56 70 V-10 Q-56 -50 0 -50 Q56 -50 56 -10 V70 Z", fill: "#5A2420", ...S6(5) }, g); el("path", { d: "M0 -50 V70", stroke: "#FFD25E", "stroke-width": 4 }, g); [[-16, 14], [16, 14]].forEach(([cx, cy]) => el("circle", { cx, cy, r: 6, fill: "#FFD25E", ...S6(2) }, g));
  roof(0, -60, 300, 70); el("rect", { x: -130, y: -200, width: 260, height: 80, fill: "#FFF4EA", ...S6(5) }, g); [-100, 100].forEach(px => el("rect", { x: px - 12, y: -200, width: 24, height: 80, fill: "#E8473C", ...S6(4) }, g));
  [-40, 40].forEach(px => el("circle", { cx: px, cy: -160, r: 20, fill: "#BDE9F5", ...S6(4) }, g)); roof(0, -200, 170, 60); el("circle", { cx: 0, cy: -276, r: 14, fill: "#FFD25E", ...S6(4) }, g);
  el("rect", { x: -280, y: 70, width: 560, height: 22, rx: 6, fill: "#D9DEE6", ...S6(4) }, g); return g; }
function utCoral(L, x, y, s = 1, col = "#FF8FA3") { const g = utG(L, x, y, s); el("path", { d: "M0 0 V-60 M0 -30 Q-30 -40 -34 -78 M0 -40 Q30 -50 36 -90 M-34 -78 q-16 -8 -18 -26 M36 -90 q14 -10 12 -28 M0 -60 q-4 -24 6 -44", fill: "none", stroke: INK, "stroke-width": 22, "stroke-linecap": "round" }, g);
  el("path", { d: "M0 0 V-60 M0 -30 Q-30 -40 -34 -78 M0 -40 Q30 -50 36 -90 M-34 -78 q-16 -8 -18 -26 M36 -90 q14 -10 12 -28 M0 -60 q-4 -24 6 -44", fill: "none", stroke: col, "stroke-width": 13, "stroke-linecap": "round" }, g); return g; }
function utWeed(L, x, y, s = 1, col = "#4E9A6B") { const g = utG(L, x, y, s); [-18, 0, 18].forEach((lx, i) => { const p = el("path", { d: `M${lx} 0 q${i % 2 ? 18 : -18} -30 0 -60 q${i % 2 ? -18 : 18} -30 0 -${60 + i * 12}`, fill: "none", stroke: col, "stroke-width": 12, "stroke-linecap": "round" }, g);
    el("animateTransform", { attributeName: "transform", type: "skewX", values: "-6;6;-6", dur: `${2.4 + i * .5}s`, repeatCount: "indefinite" }, p); }); return g; }
function utBubbles(L, pts) { pts.forEach(([x, y, r], i) => { const c = el("circle", { cx: x, cy: y, r, fill: "#FFFFFF", opacity: .5, stroke: "#FFFFFF", "stroke-width": 2 }, L); el("animate", { attributeName: "cy", values: `${y};${y - 60};${y}`, dur: `${3 + i % 4}s`, repeatCount: "indefinite" }, c); }); }
function utPine(L, x, y, s = 1) { const g = utG(L, x, y, s); el("path", { d: "M0 0 Q-14 -50 10 -100", fill: "none", stroke: INK, "stroke-width": 20, "stroke-linecap": "round" }, g); el("path", { d: "M0 0 Q-14 -50 10 -100", fill: "none", stroke: "#8B5A3C", "stroke-width": 12, "stroke-linecap": "round" }, g);
  [[-30, -96, 44], [34, -110, 40], [4, -134, 38]].forEach(([cx, cy, r]) => el("ellipse", { cx, cy, rx: r, ry: r * .5, fill: "#3E8E6E", ...S6(4) }, g)); return g; }
function utHut(L, x, y, s = 1, roof = "#C9A26B") { const g = utG(L, x, y, s); el("rect", { x: -50, y: -40, width: 100, height: 60, fill: "#F6E7C8", ...S6(4) }, g); el("path", { d: "M-72 -36 L0 -92 L72 -36 Z", fill: roof, ...S6(4) }, g); el("rect", { x: -14, y: -14, width: 28, height: 34, fill: "#8B5A3C", ...S6(3) }, g); return g; }
// のりもの（slRide の え）
Object.assign(OG_VEH, { KAME: (g, size) => { const o = el("g", {}, g); utTurtle(o, 0, 20, size / 130); return o; }, IRUKA: (g, size) => { const o = el("g", {}, g); utDolphin(o, 0, 20, size / 150); return o; },
  TOBIUO: (g, size) => { const o = el("g", {}, g); utTobiuo(o, 0, 26, size / 100); return o; }, TSURU: (g, size) => { const o = el("g", {}, g); utCrane(o, 0, 30, size / 150); return o; } });
/* ---------- 盤の しるし ---------- */
const UT_EVC = { gochisou: "#FFE9C7", iruka: "#DFF3FF", tobiuo: "#DFF3FF", tai: "#FFD9D2", ougi: "#FFF4D6", kame: "#C9EBB5", kame2: "#C9EBB5", sango: "#FFD9E8", uzu: "#B9D6F2", kurage: "#E6DAF7", odori: "#FFE27A", kujira: "#CFE0F7", wakame: "#C9EBB5", kumikae: "#E6E9FF", tamate: "#FFE27A" };
const UT_MARK = {
  gochisou: g => { el("ellipse", { cx: 0, cy: 10, rx: 28, ry: 9, fill: "#FFFFFF", ...S6(3) }, g); utFish(g, 0, -2, .22); el("path", { d: "M-10 -22 q4 -6 0 -12 M2 -24 q4 -6 0 -12 M14 -22 q4 -6 0 -12", fill: "none", stroke: "#8B8B99", "stroke-width": 2.5, "stroke-linecap": "round" }, g); },
  iruka: g => utDolphin(g, 0, 2, .26), tobiuo: g => utTobiuo(g, 0, 8, .34), tai: g => utFish(g, 2, 0, .34), kame: g => utTurtle(g, -2, 2, .25), kame2: g => utTurtle(g, -2, 2, .3),
  ougi: g => { el("path", { d: "M0 20 L-26 -12 Q0 -30 26 -12 Z", fill: "#FF9FBF", ...S6(3) }, g); el("path", { d: "M0 20 L-10 -20 M0 20 L10 -20 M0 20 V-22", stroke: INK, "stroke-width": 2 }, g); el("circle", { cy: 20, r: 4, fill: "#FFD25E", ...S6(2) }, g); },
  sango: g => utCoral(g, 0, 24, .42), kurage: g => utKurage(g, 0, -4, .42), odori: g => { utFish(g, -8, -8, .2); utHirame(g, 8, 12, .2); }, kujira: g => utWhale(g, 0, 6, .11), wakame: g => utWeed(g, 0, 24, .4),
  uzu: g => { el("path", { d: "M0 0 q10 -14 22 0 q6 22 -22 26 q-32 -2 -30 -30 q6 -30 40 -24", fill: "none", stroke: "#2F6FA8", "stroke-width": 6, "stroke-linecap": "round" }, g); },
  kumikae: g => { el("path", { d: "M-28 8 Q-14 -24 2 -4 Q14 12 28 -14", fill: "none", stroke: "#2F6FA8", "stroke-width": 7, "stroke-linecap": "round" }, g); el("path", { d: "M-28 22 Q-10 8 4 22 Q16 30 28 18", fill: "none", stroke: "#7FCBF0", "stroke-width": 6, "stroke-linecap": "round" }, g); },
  tamate: g => utBox(g, 0, 2, .34) };
{ const db = drawBoard; drawBoard = function () { db(); if (!isUT()) return;
    Object.entries(EVENTS.urashima).forEach(([id, e]) => { const [x, y] = NODES[id], t = e[4] || e[0];
      el("circle", { cx: x, cy: y, r: 36, fill: UT_EVC[t] || "#FFF1C9", ...S6(4) }, boardLayer); const g = el("g", { transform: `translate(${x} ${y})` }, boardLayer); (UT_MARK[t] || (() => txt(g, 0, 14, "★", 36, { "text-anchor": "middle" })))(g); });
    utJiiRedraw(); }; }
/* ---------- 盤の 背景：そら・はまべ・うみ（だんだん ふかく）・りゅうぐうじょう・みぎは かえりみち ---------- */
BOARD_BG.urashima = L => {
  el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#BDE3F2" }, L); el("circle", { cx: 1380, cy: 70, r: 44, fill: "#FFE27A", stroke: "#FFFFFF", "stroke-width": 8 }, L);
  el("path", { d: "M0 238 Q400 218 800 235 T1600 228 V380 H0 Z", fill: "#F3E3B3", ...S6(4) }, L); // すなはま
  utPine(L, 60, 276, .9); utPine(L, 1330, 258, .8); utHut(L, 1585, 262, .62, "#8E8478"); utHut(L, 1400, 250, .5, "#B8946A");
  el("rect", { x: 0, y: 366, width: 1600, height: 214, fill: "#8FD3F0" }, L); el("rect", { x: 0, y: 570, width: 1600, height: 200, fill: "#5BB5E0" }, L); el("rect", { x: 0, y: 760, width: 1600, height: 240, fill: "#3E8FCC" }, L);
  el("path", { d: "M0 371 q40 -22 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 V396 H0 Z", fill: "#FFFFFF", opacity: .9 }, L);
  for (let i = 0; i < 12; i++) el("path", { d: `M${40 + i * 135} ${418 + (i % 3) * 10} q18 -10 36 0 q18 10 36 0`, fill: "none", stroke: "#FFFFFF", "stroke-width": 4, opacity: .6 }, L);
  for (let i = 0; i < 5; i++) el("path", { d: `M${200 + i * 300} 350 L${120 + i * 300} 1000 L${220 + i * 300} 1000 Z`, fill: "#FFFFFF", opacity: .07 }, L); // ひかりの すじ
  el("path", { d: "M0 960 Q400 930 800 950 T1600 940 V1000 H0 Z", fill: "#E9D9A6", ...S6(4) }, L); // うみの そこ
  utCastle(L, 760, 900, .6); utCoral(L, 420, 970, .9); utCoral(L, 1120, 968, .8, "#FFB13B"); utCoral(L, 240, 975, .6, "#D9C2F0");
  utWeed(L, 60, 990, 1.1); utWeed(L, 1290, 985, 1.0, "#3E8E6E"); utWeed(L, 1570, 990, 1.2); utWeed(L, 560, 985, .7, "#3E8E6E");
  utFish(L, 700, 570, .3, "#FFD25E", "#FFB13B"); utFish(L, 1010, 395, .26, "#FF9FBF", "#F0645A"); utKurage(L, 1380, 560, .4); utFish(L, 420, 770, .3, "#7BD389", "#4E9A6B");
  utBubbles(L, [[90, 560, 7], [1390, 820, 9], [1420, 760, 5], [640, 790, 6], [1100, 560, 6], [300, 590, 5], [1545, 520, 8], [1555, 430, 5], [1560, 620, 6], [960, 800, 5]]);
  txt(L, 1490, 800, "↑ かえりみち", 22, { "text-anchor": "middle", fill: "#FFFFFF", opacity: .85 }); };
/* ---------- こえ：ばんに いない キャラの ふきだし ---------- */
function utVoice(kind, x, y, key) { const c = C[kind]; place(c, x - 60, y, .3); return speak(c, key, UT.line[key].text); }
/* ---------- おじいさんの ひげ（たまてばこ） ---------- */
function utBeard(c) { const hd = c.head.g, e = c.eyes || [], cy = e.length ? e[0].cy : 170, g = el("g", {}, hd);
  e.forEach(q => el("path", { d: `M${q.cx - 26} ${q.cy - 24} Q${q.cx} ${q.cy - 40} ${q.cx + 26} ${q.cy - 24} Q${q.cx} ${q.cy - 30} ${q.cx - 26} ${q.cy - 24} Z`, fill: "#FFFFFF", stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }, g));
  const by = cy + 78; // あごから さがる ひげ（かおは かくさない）
  el("path", { d: `M146 ${by} Q200 ${by + 18} 254 ${by} Q262 ${by + 50} 244 ${by + 74} Q236 ${by + 60} 228 ${by + 84} Q218 ${by + 70} 208 ${by + 98} Q200 ${by + 80} 192 ${by + 98} Q182 ${by + 70} 172 ${by + 84} Q164 ${by + 60} 156 ${by + 74} Q138 ${by + 50} 146 ${by} Z`, fill: "#FFFFFF", stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }, g);
  el("path", { d: `M200 ${by - 4} Q172 ${by - 22} 144 ${by - 2} Q172 ${by + 14} 200 ${by + 4} Q228 ${by + 14} 256 ${by - 2} Q228 ${by - 22} 200 ${by - 4} Z`, fill: "#FFFFFF", stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }, g);
  return g; }
function utJiiOn(pl) { if (pl.utBeard) return; pl.utBeard = utBeard(pl.pc); }
function utJiiOff(pl) { if (pl.utBeard) { pl.utBeard.remove(); pl.utBeard = null; } pl.utJii = 0; }
function utJiiRedraw() { if (typeof PLAYERS === "undefined") return; PLAYERS.forEach(p => { if (p.utJii && p.utBeard && !p.utBeard.isConnected) { p.utBeard = null; utJiiOn(p); } }); }
async function slDiceMod(pl, v) { if (!isUT() || !pl.utJii) return v; pl.utJii = 2; await speak(C.pony, "utp_tm_half", UT.txt.utp_tm_half); v = Math.ceil(v / 2); popNumber(v); await sleep(500); return v; }
{ const mt = multiTurn; multiTurn = async function (pl, first) {
    if (isUT() && !UTS.told && pl === PLAYERS[0]) { UTS.told = 1; setView("board"); await utCurtain(); await speak(C.pony, "utp_intro", UT.txt.utp_intro); }
    const r = await mt(pl, first);
    if (isUT() && pl.utJii === 2) { for (let i = 0; i < 8; i++) mark("puff", pl.pc.px, pl.pc.py - 40, { vx: Math.cos(i) * 160, vy: Math.sin(i) * 160, life: .6, s: .6 }); utJiiOff(pl); if (!winner) await speak(C.pony, "utp_tm_modoru", UT.txt.utp_tm_modoru); }
    return r; }; }
{ const ap = applyStage; applyStage = function (id, ...a) { if (id === "urashima") { UT_N.clear(); UTS.told = 0; } return ap(id, ...a); }; }
// げきの まく（あかい まくが ひらく）
async function utCurtain() { const g = el("g", {}, front()); const a = el("rect", { x: 0, y: 0, width: 800, height: 1000, fill: "#B8322A", ...S6(6) }, g), b = el("rect", { x: 800, y: 0, width: 800, height: 1000, fill: "#B8322A", ...S6(6) }, g);
  const top = el("path", { d: "M0 0 H1600 V70 q-50 50 -100 0 t-100 0 t-100 0 t-100 0 t-100 0 t-100 0 t-100 0 t-100 0 t-100 0 t-100 0 t-100 0 t-100 0 t-100 0 t-100 0 t-100 0 t-100 0 Z", fill: "#8E241E", ...S6(5) }, g);
  for (let i = 1; i < 8; i++) { el("path", { d: `M${i * 100} 0 V1000`, stroke: "#8E241E", "stroke-width": 6, opacity: .5 }, g); el("path", { d: `M${800 + i * 100} 0 V1000`, stroke: "#8E241E", "stroke-width": 6, opacity: .5 }, g); }
  const lines = [...g.querySelectorAll("path")].filter(p => p !== top); blip(660, 660, .12, "square"); later(180, () => blip(660, 660, .12, "square")); await sleep(500);
  await tween(900, k => { const w = 800 * (1 - k); a.setAttribute("width", w.toFixed(0)); b.setAttribute("x", (1600 - w).toFixed(0)); b.setAttribute("width", w.toFixed(0)); lines.forEach(p => p.setAttribute("opacity", (.5 * (1 - k)).toFixed(2))); });
  g.remove(); }
/* ---------- しかけ ---------- */
function utTo(pc, d) { const O = SL_ORDER.urashima; return O[Math.max(0, Math.min(O.length - 2, utI(pc.node) + d))]; }
async function utMarch(kind) { // がめんを よこぎる ぎょうれつ
  const g = el("g", {}, front()), L = el("g", {}, g), y = 520; const lab = (t, col) => txt(L, 380, -110, t, 40, { "text-anchor": "middle", fill: col, stroke: "#FFFFFF", "stroke-width": 6, "paint-order": "stroke", "font-weight": 700 });
  if (kind === "kurage") { for (let i = 0; i < 8; i++) utKurage(L, i * 105, (i % 2) * 50 - 20, .9, ["#D9C2F0", "#BDE9F5", "#FFD9E8"][i % 3]); lab("くらげの むれ", "#7A5CB0"); }
  else { for (let i = 0; i < 8; i++) (i % 2 ? utHirame : utFish)(L, i * 110, (i % 2) * 44, .7); lab("たいや ひらめの おどり", "#E8473C"); }
  const dir = kind === "kurage" ? -1 : 1, x0 = dir > 0 ? -950 : 1700, x1 = dir > 0 ? 1700 : -950; for (let i = 0; i < 6; i++) later(i * 300, () => blip(520 + (i % 3) * 120, 700, .1, "sine"));
  await tween(2600, k => g.setAttribute("transform", `translate(${(x0 + (x1 - x0) * k).toFixed(0)} ${(y + Math.sin(k * 26) * 14).toFixed(0)})`)); g.remove(); }
async function utWhaleRide(pc) { // がめんの そとから くじら → しおふきで とばす
  const S = .62, g = el("g", {}, front()); utWhale(g, 0, 0, S).setAttribute("transform", `scale(${-S} ${S})`); /* ひだりむき（みぎから くる） */ const y = Math.min(900, pc.py + 150); let x = 2000; const at = () => g.setAttribute("transform", `translate(${x.toFixed(0)} ${y.toFixed(0)})`); at(); noise(1.2, 90, .35);
  const stop = pc.px + 40 * S; await tween(1700, k => { x = 2000 + (stop - 2000) * (1 - Math.pow(1 - k, 2)); at(); });
  await utVoice("kame", pc.px + 80, pc.py + 60, "utl_kujira");
  const sx = stop - 40 * S, sy = y - 138 * S, jet = el("g", {}, front()); const col = el("path", { fill: "#BDE9F5", stroke: "#FFFFFF", "stroke-width": 6 }, jet);
  noise(.9, 1400, .5); const y0 = pc.py, topY = Math.max(120, y0 - 260);
  await tween(650, k => { const h = (sy - topY) * k; col.setAttribute("d", `M${sx - 16} ${sy} Q${sx - 30} ${sy - h * .5} ${sx - 44} ${sy - h} H${sx + 44} Q${sx + 30} ${sy - h * .5} ${sx + 16} ${sy} Z`); pc.py = y0 - (y0 - topY + 30) * k; pc.px = sx; });
  for (let i = 0; i < 10; i++) mark("drop", sx - 60 + rnd(120), topY, { vx: -200 + rnd(400), vy: -100 - rnd(160), grav: 900, life: .9, s: .6 });
  const to = utTo(pc, 5), [tx, ty] = nodeXY(pc, to), ax = pc.px, ay = pc.py; blip(400, 1200, .5, "sine");
  await tween(1100, k => { pc.px = ax + (tx - ax) * k; pc.py = ay + (ty - ay) * k - Math.sin(k * Math.PI) * 160; pc.lean.t = k * 360; if (k > .3) jet.setAttribute("opacity", Math.max(0, 1 - (k - .3) * 3).toFixed(2)); });
  jet.remove(); pc.lean.t = 0; pc.node = to; pc.px = tx; pc.py = ty; pc.trail = []; jump(pc, .5); chime(); confetti(24);
  await tween(1200, k => { x = stop + (2000 - stop) * k; at(); }); g.remove();
  if (to === GOAL && !winner) { winnerPc = pc; winner = pc.kind; } }
async function utTamate(pc) { // 🎁 たまてばこ：あける？ あけない？
  const pl = pc.player, cpu = !pl || pl.cpu, g = panel("たまてばこ", "#FFF4D6"); const bx = utBox(g, 800, 500, 2.2); let t = 0, live = true;
  addTick(dt => { if (!g.isConnected || !live) return false; t += dt; bx.setAttribute("transform", `translate(800 ${(500 + Math.sin(t * 2.4) * 8).toFixed(1)}) scale(2.2)`); if (Math.random() < .05) mark("sparkle", 640 + rnd(320), 380 + rnd(200), { vy: -30, life: .7, s: .6 }); });
  await utVoice("otohime", 1150, 420, "utl_oto_ask");
  const btn = (x, label, fill) => { const b = el("g", { style: "cursor:pointer" }, g); el("rect", { x: x - 190, y: 760, width: 380, height: 120, rx: 60, fill, ...S6(6) }, b); txt(b, x, 842, label, 60, { "text-anchor": "middle", "font-weight": 700 }); return b; };
  const bs = [btn(520, "あける", "#FFC2D1"), btn(1080, "あけない", "#C9EBB5")];
  await speak(C.pony, "utp_tm_ask", UT.txt.utp_tm_ask);
  let pick = cpu ? (await sleep(900), rnd(5) < 2 ? 0 : 1) : await Promise.race([tapOnce(bs), sleep(15000).then(() => 1)]); bs.forEach(b => b.onclick = null);
  bs[1 - pick].setAttribute("opacity", .3); blip(700, 900, .1, "square"); await sleep(400);
  if (pick === 1) { live = false; chime(); confetti(30); await utVoice("otohime", 1150, 420, "utl_oto_keep"); await speak(C.pony, "utp_tm_keep", UT.txt.utp_tm_keep); g.remove(); playLog({ type: "tamate", open: false, who: NAMES[pc.kind] }); await slGo(pc, 3); return; }
  // あける：ふたが あいて けむり もくもく
  live = false; bs.forEach(b => b.remove()); bx.remove(); const ob = utBox(g, 800, 520, 2.2, true); noise(.5, 500, .5);
  const smoke = el("g", {}, g); let st = 0, on = true; addTick(dt => { if (!g.isConnected || !on) return false; st += dt; if (Math.random() < .5) { const c = el("circle", { cx: 760 + rnd(80), cy: 400, r: 30 + rnd(40), fill: "#FFFFFF", opacity: .85, stroke: "#D9DEE6", "stroke-width": 4 }, smoke); const vx = -160 + rnd(320); let a = 0;
        addTick(d2 => { if (!c.isConnected) return false; a += d2; c.setAttribute("cy", (400 - a * 220).toFixed(0)); c.setAttribute("cx", (+c.getAttribute("cx") + vx * d2).toFixed(0)); c.setAttribute("r", (+c.getAttribute("r") + 30 * d2).toFixed(0)); c.setAttribute("opacity", Math.max(0, .85 - a * .5).toFixed(2)); if (a > 1.7) { c.remove(); return false; } }); } });
  txt(g, 800, 250, "もくもくもく……", 64, { "text-anchor": "middle", fill: "#FFFFFF", stroke: INK, "stroke-width": 8, "paint-order": "stroke" });
  await speak(C.pony, "utp_tm_open", UT.txt.utp_tm_open); utVoice("otohime", 1150, 420, "utl_oto_open"); await sleep(1600);
  const crane = rnd(3) === 0; on = false; playLog({ type: "tamate", open: true, crane, who: NAMES[pc.kind] });
  if (crane) { utCrane(g, 800, 420, 1.3); chime(); await speak(C.pony, "utp_tm_tsuru", UT.txt.utp_tm_tsuru); g.remove(); await slRide(pc, utTo(pc, 8), "TSURU", { arc: 260, ms: 2000, size: 150 }); if (pc.node === GOAL && !winner) { winnerPc = pc; winner = pc.kind; } return; }
  g.remove(); for (let i = 0; i < 12; i++) mark("puff", pc.px, pc.py - 40, { vx: Math.cos(i * .52) * 200, vy: Math.sin(i * .52) * 200, life: .7, s: .7 });
  if (pl) { pl.utJii = 1; utJiiOn(pl); } else utBeard(pc); pc.squash.t = .86; later(600, () => pc.squash.t = 1); blip(300, 140, .4, "triangle");
  await speak(C.pony, "utp_tm_jii", UT.txt.utp_tm_jii); pc.lean.t = 14; await speak(pc, "utl_jii", UT.line.utl_jii.text); pc.lean.t = 0; }
{ const be = boardEvent; boardEvent = async function (pc) {
    const ev = isUT() && EVENTS.urashima[pc.node];
    if (!ev || (pc.player && pc.player.stay)) return be(pc);
    const t = ev[4] || ev[0];
    if (t === "tamate") { await sleep(300); markAbove(pc, "ex"); chime(); return utTamate(pc); }
    if (!["iruka", "tobiuo", "kame", "kame2", "uzu", "kurage", "odori", "kujira", "wakame"].includes(t)) return be(pc);
    const bad = ["uzu", "kurage", "wakame"].includes(t); await sleep(300); markAbove(pc, bad ? "drop" : "sparkle"); chime(); await slSay(ev[2], ev[3]);
    if (t === "iruka") { utVoice("kame", pc.px, pc.py, "utl_iruka"); await slRide(pc, utTo(pc, 2), "IRUKA", { arc: 40, ms: 1400, size: 130 }); }
    else if (t === "tobiuo") { await slRide(pc, utTo(pc, 3), "TOBIUO", { arc: 200, ms: 1500, size: 110 }); }
    else if (t === "kame" || t === "kame2") { const to = slWarpTo("urashima", pc.node, t === "kame" ? "warp" : "bigwarp"); utVoice("kame", pc.px, pc.py, "utl_kame");
      const sh = setInterval(() => showBanner("すーい、すーい", 900), 1100); try { await slRide(pc, to, "KAME", { arc: 60, ms: t === "kame" ? 2600 : 3400, size: t === "kame" ? 150 : 190 }); } finally { clearInterval(sh); } }
    else if (t === "uzu") { const g = el("g", { transform: `translate(${pc.px} ${pc.py})` }, front()), sp = el("g", {}, g); [60, 44, 28].forEach((r, i) => el("path", { d: `M${-r} 0 A${r} ${r * .5} 0 1 1 ${r * .6} ${r * .4}`, fill: "none", stroke: i % 2 ? "#FFFFFF" : "#2F6FA8", "stroke-width": 7, "stroke-linecap": "round" }, sp));
      const x0 = pc.px, y0 = pc.py; noise(1.2, 300, .4); await tween(1500, k => { sp.setAttribute("transform", `rotate(${(k * 1080).toFixed(0)})`); pc.px = x0 + Math.cos(k * 20) * 26 * (1 - k); pc.py = y0 + Math.sin(k * 20) * 12 * (1 - k); pc.lean.t = Math.sin(k * 20) * 30; });
      g.remove(); pc.lean.t = 0; pc.px = x0; pc.py = y0; await warpTo(pc, utTo(pc, -6)); }
    else if (t === "kurage") { await utMarch("kurage"); for (let i = 0; i < 4; i++) later(i * 120, () => { blip(1400, 1000, .05, "square"); markAbove(pc, "sparkle"); }); jump(pc, .3); await slGo(pc, -3); }
    else if (t === "odori") { utVoice("kame", 300, 600, "utl_odori"); await utMarch("odori"); for (const o of PLAYERS.map(p => p.pc)) { jump(o, .5); await slGo(o, 2); if (winner) break; } }
    else if (t === "kujira") await utWhaleRide(pc);
    else if (t === "wakame") { const g = el("g", {}, front()); utWeed(g, pc.px - 10, pc.py + 30, .8); utWeed(g, pc.px + 24, pc.py + 34, .6, "#3E8E6E"); pc.lean.t = 16; await sleep(900); pc.lean.t = -16; await sleep(500); pc.lean.t = 0; g.remove(); await slGo(pc, -2); }
    await sleep(300); }; }
/* ---------- 🐚 かいがら あけ（ふうせん わりの かわり） ---------- */
function utShell(L, x, y, s = 1, col = "#FFD9E8") { const g = utG(L, x, y, s);
  el("path", { d: "M-90 40 Q-110 -70 0 -90 Q110 -70 90 40 Q0 74 -90 40 Z", fill: col, ...S6(6) }, g); [-60, -30, 0, 30, 60].forEach(lx => el("path", { d: `M0 50 L${lx * 1.1} ${-70 + Math.abs(lx) * .35}`, stroke: INK, "stroke-width": 3, opacity: .45 }, g));
  el("path", { d: "M-34 44 H34 L26 70 H-26 Z", fill: col, ...S6(5) }, g); return g; }
function utCrab(L, x, y, s = 1) { const g = utG(L, x, y, s); [[-1], [1]].forEach(([d]) => { el("path", { d: `M${d * 40} -6 Q${d * 74} -30 ${d * 70} -56`, fill: "none", stroke: INK, "stroke-width": 14, "stroke-linecap": "round" }, g); el("path", { d: `M${d * 40} -6 Q${d * 74} -30 ${d * 70} -56`, fill: "none", stroke: "#F0645A", "stroke-width": 8, "stroke-linecap": "round" }, g);
    el("path", { d: `M${d * 70} -56 q${d * -20} -22 ${d * 2} -34 q${d * 4} 16 ${d * 4} 16 q${d * 12} -10 ${d * 14} -12 q${d * 6} 22 ${d * -20} 30 Z`, fill: "#F0645A", ...S6(4) }, g); [14, 30].forEach(ly => el("path", { d: `M${d * 44} ${ly} l${d * 26} 14`, stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, g)); });
  el("ellipse", { cx: 0, cy: 6, rx: 52, ry: 36, fill: "#F0645A", ...S6(5) }, g); [[-16, -30], [16, -30]].forEach(([cx, cy]) => { el("path", { d: `M${cx} -20 V${cy}`, stroke: INK, "stroke-width": 4 }, g); el("circle", { cx, cy: cy - 6, r: 8, fill: "#FFFFFF", ...S6(3) }, g); el("circle", { cx, cy: cy - 6, r: 3.5, fill: INK }, g); });
  el("path", { d: "M-14 16 Q0 26 14 16", fill: "none", ...S6(3) }, g); return g; }
async function utKai(pc) {
  const g = panel("かいがら あけ", "#FFF4E6"); const P = shuffle([3, 2, -2, "🎲", "🌱"]); const cols = ["#FFD9E8", "#FFF1C9", "#CFE9F7", "#D9F0C8", "#E6DAF7"];
  el("path", { d: "M100 800 Q800 760 1500 800 V900 H100 Z", fill: "#F3E3B3", ...S6(4) }, g);
  const bs = P.map((p, i) => { const b = el("g", { style: "cursor:pointer" }, g), x = 260 + i * 270; el("rect", { x: x - 120, y: 430, width: 240, height: 300, fill: "#FFFFFF01" }, b); b.art = utShell(b, x, 600, 1.1, cols[i]); b.x = x; return b; });
  let t = 0; addTick(dt => { if (!g.isConnected) return false; t += dt; bs.forEach((b, i) => { if (!b.done) b.setAttribute("transform", `translate(0 ${(Math.sin(t * 2 + i) * 10).toFixed(1)}) `); }); });
  await speak(C.pony, "utp_kai", UT.txt.utp_kai);
  const i = await tapOnce(bs); const p = P[i]; blip(500, 1000, .15, "sine"); noise(.1, 1800, .4);
  const reveal = (b, q, big) => { b.done = 1; b.setAttribute("transform", ""); b.art.remove(); const x = b.x, o = el("g", { opacity: big ? 1 : .55 }, b);
    const up = utShell(o, x, 520, 1.1, cols[bs.indexOf(b)]); up.setAttribute("transform", `translate(${x} 500) scale(1.1 -.7)`); el("path", { d: `M${x - 100} 640 Q${x} 700 ${x + 100} 640 Q${x} 610 ${x - 100} 640 Z`, fill: cols[bs.indexOf(b)], ...S6(6) }, o);
    if (q === 3) { el("circle", { cx: x, cy: 610, r: 40, fill: "#FFFFFF", ...S6(5) }, o); el("circle", { cx: x - 12, cy: 598, r: 10, fill: "#EAF6FF" }, o); }
    else if (q === -2) utCrab(o, x, 600, .9); else if (q === 2) el("path", { d: `M${x} 560 l14 34 36 4 -28 24 8 36 -30 -18 -30 18 8 -36 -28 -24 36 -4 z`, fill: "#FFB13B", ...S6(4) }, o);
    txt(o, x, 800, typeof q === "number" ? (q > 0 ? "+" + q : String(q)) : q, big ? 90 : 60, { "text-anchor": "middle" }); };
  reveal(bs[i], p, true); for (let k = 0; k < 10; k++) mark("sparkle", bs[i].x, 580, { vx: Math.cos(k * .63) * 320, vy: Math.sin(k * .63) * 320, life: .6, s: .6 });
  await sleep(900); bs.forEach((b, j) => { if (j !== i) reveal(b, P[j], false); }); await sleep(1300);
  if (p === 3) await speak(C.pony, "utp_shinju", UT.txt.utp_shinju); else if (p === -2) await speak(C.pony, "utp_kani", UT.txt.utp_kani);
  g.remove();
  if (p === "🎲") { slFlag(pc, "dice2"); await speak(C.pony, "sl_st_d2", "サイコロ 2こ！ つぎの ばんで 2こ ふれるよ"); }
  else if (p === "🌱") { if (pc.player) pc.player.ok += 2; GS.ok += 2; GS.pend = 0; confetti(40); await speak(C.pony, "sl_bl_tane", "たねが 2こ でて きた！"); }
  else await delta(pc, p);
  return false; }
/* ---------- 🎣 さかなつり（ルーレットの かわり）：さかなが まんなかに きたら タッチ ---------- */
function utBoot(L, x, y, s = 1) { const g = utG(L, x, y, s); el("path", { d: "M-20 -50 H20 V10 H50 Q64 12 64 30 V44 H-20 Z", fill: "#8B6A4B", ...S6(5) }, g); el("path", { d: "M-20 44 H64", stroke: INK, "stroke-width": 8 }, g); el("path", { d: "M-20 -34 H20", stroke: "#5A4636", "stroke-width": 6 }, g); return g; }
async function utTsuri(pc) {
  const g = panel("さかなつり", "#DFF3FF"); el("rect", { x: 100, y: 330, width: 1400, height: 560, rx: 30, fill: "#8FD3F0", ...S6(5) }, g); el("rect", { x: 103, y: 600, width: 1394, height: 287, rx: 28, fill: "#5BB5E0" }, g);
  el("path", { d: "M100 350 q35 -20 70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0", fill: "none", stroke: "#FFFFFF", "stroke-width": 7 }, g);
  el("path", { d: "M640 300 H900 L860 350 H680 Z", fill: "#B8946A", ...S6(5) }, g); el("path", { d: "M860 300 L800 190", stroke: "#8B5A3C", "stroke-width": 8, "stroke-linecap": "round" }, g); // ふねと さお
  const line = el("path", { stroke: INK, "stroke-width": 3 }, g), hook = el("path", { d: "M0 0 v14 q0 12 -10 10", fill: "none", stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }, g); let hy = 400;
  const drawLine = () => { line.setAttribute("d", `M800 190 V${hy}`); hook.setAttribute("transform", `translate(800 ${hy})`); }; drawLine();
  el("path", { d: "M770 420 V860 M830 420 V860", stroke: "#FFFFFF", "stroke-width": 4, "stroke-dasharray": "10 14", opacity: .6 }, g);
  const KINDS_T = ["saka", "tai", "kutsu", "saka", "tai", "saka"]; const its = KINDS_T.map((k, i) => { const e = el("g", {}, g); const art = k === "tai" ? utFish(e, 0, 0, 1.05) : k === "kutsu" ? utBoot(e, 0, 0, .9) : utFish(e, 0, 0, .75, "#FFD25E", "#FFB13B"); art.setAttribute("transform", art.getAttribute("transform") + " scale(-1 1)");
    return { e, k, x: 1700 + i * 330, y: [700, 640, 760, 620, 740, 680][i], v: 250 + (i % 3) * 30 }; });
  await speak(C.pony, "utp_tsuri", UT.txt.utp_tsuri);
  let tapped = false, got = null, done; const fin = new Promise(r => done = r); const span = KINDS_T.length * 330;
  const hit = el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#00000001", style: "cursor:pointer" }, g);
  const drop = async () => { if (tapped) return; tapped = true; hit.onclick = null; got = its.filter(o => Math.abs(o.x - 800) < 115).sort((a, b) => Math.abs(a.x - 800) - Math.abs(b.x - 800))[0] || null;
    const ty = got ? got.y - 20 : 720; blip(900, 400, .25, "sine"); await tween(350, k => { hy = 400 + (ty - 400) * k; drawLine(); if (got) got.x += (800 - got.x) * k * .3; });
    if (got) { got.x = 800; noise(.2, 1500, .5); chime(); await tween(700, k => { hy = ty + (430 - ty) * k; drawLine(); got.y = hy + 20; got.e.setAttribute("transform", `translate(800 ${got.y.toFixed(0)}) rotate(${(-70 * k).toFixed(0)})`); }); } else { noise(.15, 600, .3); await tween(400, k => { hy = ty + (400 - ty) * k; drawLine(); }); }
    done(); };
  addTick(dt => { if (!g.isConnected) return false; its.forEach(o => { if (o === got) return; if (!tapped || true) { o.x -= o.v * dt * (tapped ? .35 : 1); if (o.x < -200) o.x += Math.max(span, 1900); } o.e.setAttribute("transform", `translate(${o.x.toFixed(0)} ${(o.y + Math.sin(o.x * .02) * 8).toFixed(0)})`); }); });
  hit.onclick = drop; later(11000, drop); await fin; await sleep(700);
  const k = got && got.k; await speak(C.pony, k === "tai" ? "utp_tsu_tai" : k === "saka" ? "utp_tsu_saka" : k === "kutsu" ? "utp_tsu_kutsu" : "utp_tsu_none", UT.txt[k === "tai" ? "utp_tsu_tai" : k === "saka" ? "utp_tsu_saka" : k === "kutsu" ? "utp_tsu_kutsu" : "utp_tsu_none"]);
  g.remove(); const d = k === "tai" ? 3 : k === "saka" ? 2 : k === "kutsu" ? -1 : 0; if (d) await delta(pc, d); return false; }
/* ---------- 場面の へや ---------- */
function utSign(L, place) { const g = el("g", {}, L); el("rect", { x: 580, y: 24, width: 440, height: 92, rx: 20, fill: "#FFFFFF", ...S6(6) }, g); txt(g, 800, 88, place, 46, { "text-anchor": "middle" }); }
const ROOMS_UT = {
  "はまべ": L => { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#BDE3F2" }, L); el("circle", { cx: 1380, cy: 170, r: 60, fill: "#FFE27A", stroke: "#FFFFFF", "stroke-width": 10 }, L);
    el("rect", { x: 0, y: 420, width: 1600, height: 300, fill: "#7FC4EA" }, L); el("path", { d: "M0 420 H1600", ...S6(5) }, L); for (let i = 0; i < 12; i++) el("path", { d: `M${60 + i * 130} ${470 + (i % 3) * 50} q20 -12 40 0 q20 12 40 0`, fill: "none", stroke: "#FFFFFF", "stroke-width": 5 }, L);
    el("path", { d: "M0 700 q50 -30 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 V1000 H0 Z", fill: "#FFFFFF" }, L);
    el("path", { d: "M0 730 Q400 700 800 724 T1600 716 V1000 H0 Z", fill: "#F3E3B3", ...S6(5) }, L); utPine(L, 130, 760, 2.4); utPine(L, 1500, 750, 1.8);
    [[420, 940], [1040, 960], [760, 990]].forEach(([x, y]) => el("path", { d: `M${x} ${y} l10 -14 l10 14 l-10 6 z`, fill: "#FFD9E8", ...S6(3) }, L)); },
  "うみの なか": L => { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#8FD3F0" }, L); el("rect", { x: 0, y: 330, width: 1600, height: 340, fill: "#5BB5E0" }, L); el("rect", { x: 0, y: 660, width: 1600, height: 340, fill: "#3E8FCC" }, L);
    for (let i = 0; i < 6; i++) el("path", { d: `M${150 + i * 270} 0 L${40 + i * 270} 1000 L${170 + i * 270} 1000 Z`, fill: "#FFFFFF", opacity: .08 }, L);
    el("path", { d: "M0 800 Q400 760 800 790 T1600 780 V1000 H0 Z", fill: "#E9D9A6", ...S6(5) }, L); utCoral(L, 110, 830, 2.2); utCoral(L, 1500, 820, 2, "#FFB13B"); utWeed(L, 330, 820, 2.2); utWeed(L, 1330, 810, 2, "#3E8E6E");
    utFish(L, 300, 300, .6, "#FFD25E", "#FFB13B"); utFish(L, 1300, 240, .5, "#7BD389", "#4E9A6B"); utBubbles(L, [[200, 500, 12], [520, 260, 9], [980, 200, 14], [1420, 480, 10], [760, 420, 8], [1180, 620, 9]]); },
  "りゅうぐうじょう": L => { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFF4EA" }, L); el("rect", { x: 0, y: 0, width: 1600, height: 150, fill: "#3FA7A0", ...S6(5) }, L);
    for (let x = 0; x < 1600; x += 80) el("path", { d: `M${x} 150 q40 40 80 0`, fill: "#3FA7A0", ...S6(4) }, L); el("path", { d: "M0 150 H1600", stroke: "#FFD25E", "stroke-width": 10 }, L);
    [90, 520, 1080, 1510].forEach(x => { el("rect", { x: x - 34, y: 150, width: 68, height: 640, fill: "#E8473C", ...S6(5) }, L); el("rect", { x: x - 44, y: 740, width: 88, height: 50, fill: "#FFD25E", ...S6(4) }, L); });
    [300, 800, 1300].forEach(x => { el("circle", { cx: x, cy: 420, r: 110, fill: "#8FD3F0", ...S6(6) }, L); el("path", { d: `M${x - 110} 420 H${x + 110} M${x} 310 V530`, stroke: "#E8473C", "stroke-width": 8 }, L); utFish(L, x + 10, 400, .4, "#FFD25E", "#FFB13B"); });
    el("rect", { x: 0, y: 780, width: 1600, height: 220, fill: "#FFD9E8" }, L); el("path", { d: "M0 780 H1600", ...S6(5) }, L); for (let x = 0; x < 1600; x += 200) el("path", { d: `M${x} 780 L${x + 100} 1000 M${x + 200} 780 L${x + 100} 1000`, stroke: "#FFFFFF", "stroke-width": 5, opacity: .7 }, L);
    utCoral(L, 180, 800, 1.4); utCoral(L, 1420, 800, 1.4, "#FFB13B"); },
  "むら": L => { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#FFE3C2" }, L); el("circle", { cx: 1300, cy: 250, r: 70, fill: "#FF9F6B", opacity: .9 }, L); // ゆうがたの いろ（300ねんご）
    el("rect", { x: 0, y: 520, width: 1600, height: 90, fill: "#7FC4EA" }, L); el("path", { d: "M0 590 Q400 540 800 580 T1600 560 V1000 H0 Z", fill: "#D9E8B0", ...S6(5) }, L);
    utHut(L, 280, 650, 2.3, "#8E8478"); utHut(L, 1340, 630, 1.9, "#6E6560"); utHut(L, 800, 600, 1.2, "#8E8478"); utPine(L, 1540, 720, 2.2); utPine(L, 60, 730, 1.6);
    el("rect", { x: 0, y: 780, width: 1600, height: 220, fill: "#E9D9A6" }, L); el("path", { d: "M0 780 H1600", ...S6(5) }, L);
    const s = el("g", { transform: "translate(1010 700)" }, L); el("path", { d: "M0 80 V-20", stroke: "#8B5A3C", "stroke-width": 10 }, s); el("rect", { x: -70, y: -70, width: 140, height: 56, rx: 8, fill: "#F6E7C8", ...S6(4) }, s); txt(s, 0, -32, "300ねんご", 26, { "text-anchor": "middle" }); },
};
{ const dr = drawRoom; drawRoom = function (place, noSign = false) {
    if (!isUT() || !ROOMS_UT[place]) return dr(place, noSign); sceneLayer.innerHTML = ""; ROOMS_UT[place](sceneLayer); if (!noSign) utSign(sceneLayer, place); }; }
/* ---------- やくの かぶりもの ---------- */
function utCostume(c, role) { const out = [], top = (c.top ?? 80) + 24, hd = c.head.g;
  if (role === "urashima") { const g = el("g", {}, hd); out.push(g); el("path", { d: `M184 ${top + 6} Q176 ${top - 56} 204 ${top - 60} Q230 ${top - 56} 216 ${top + 6} Z`, fill: "#2B2A33", ...S6(5) }, g); el("path", { d: `M182 ${top - 4} H218`, stroke: "#E8473C", "stroke-width": 9, "stroke-linecap": "round" }, g);
    const r = el("g", {}); c.root.insertBefore(r, c.root.firstChild); out.push(r); el("path", { d: `M270 ${c.base - 20} L340 ${top - 40}`, stroke: "#B9824A", "stroke-width": 8, "stroke-linecap": "round" }, r); el("path", { d: `M340 ${top - 40} Q380 ${top + 40} 360 ${top + 130} q-8 16 6 20`, fill: "none", stroke: INK, "stroke-width": 3 }, r); }
  else if (role === "kame") { const g = el("g", {}, hd); out.push(g); el("path", { d: `M120 ${top + 22} Q124 ${top - 62} 200 ${top - 64} Q276 ${top - 62} 280 ${top + 22} Q200 ${top + 2} 120 ${top + 22} Z`, fill: "#4E9A6B", ...S6(5) }, g);
    el("path", { d: `M170 ${top - 50} L186 ${top - 18} L160 ${top + 8} M230 ${top - 50} L214 ${top - 18} L240 ${top + 8} M186 ${top - 18} H214 M200 ${top - 64} V${top - 18}`, fill: "none", stroke: "#2E6B52", "stroke-width": 4, "stroke-linecap": "round" }, g); }
  else if (role === "otohime") { const g = el("g", {}, hd); out.push(g); [[168, -1], [232, 1]].forEach(([x, s]) => { el("ellipse", { cx: x, cy: top - 44, rx: 24, ry: 32, fill: "#2B2A33", ...S6(5), transform: `rotate(${s * 14} ${x} ${top - 20})` }, g); el("ellipse", { cx: x, cy: top - 42, rx: 9, ry: 15, fill: "#BFE3F2", transform: `rotate(${s * 14} ${x} ${top - 20})` }, g); });
    el("path", { d: `M158 ${top + 14} L170 ${top - 22} L186 ${top + 4} L200 ${top - 32} L214 ${top + 4} L230 ${top - 22} L242 ${top + 14} Z`, fill: "#FFD25E", ...S6(4) }, g); [[170, -22], [200, -32], [230, -22]].forEach(([x, y]) => el("circle", { cx: x, cy: top + y, r: 7, fill: "#FF6F91", ...S6(3) }, g)); }
  return () => out.forEach(g => g.remove()); }
/* ---------- 場面の 小道具と うごき（ナレーションと 絵を そろえる） ---------- */
function utProp(sc, h, a) {
  const G = el("g", {}, propG), hx = h.x + 200 * h.s, ax = a.x + 200 * a.s, base = 975, id = sc.id;
  const live = () => G.isConnected && view === "scene";
  const F = () => { const g = el("g", {}, front()); addTick(() => { if (!live()) { g.remove(); return false; } }); return g; };
  const loop = fn => { let t = 0; addTick(dt => { if (!live()) return false; t += dt; return fn(t, dt); }); };
  const word = (x, y, w, col = "#FFFFFF", L = G) => { const g = el("g", {}, L); txt(g, x, y, w, 40, { "text-anchor": "middle", fill: col, stroke: INK, "stroke-width": 7, "paint-order": "stroke", "font-weight": 700 }); return g; };
  const bob = (g, x, y, s, amp = 10, sp = 2.4) => loop(t => g.setAttribute("transform", `translate(${x} ${(y + Math.sin(t * sp) * amp).toFixed(1)}) scale(${s})`));
  const box = (L, x, y, s = .8) => utBox(L, x, y, s);
  if (id === "dekake") { const b = el("g", {}, G); el("path", { d: "M-110 0 H110 L80 50 H-80 Z", fill: "#B8946A", ...S6(5) }, b); loop(t => b.setAttribute("transform", `translate(900 ${(560 + Math.sin(t * 2) * 8).toFixed(1)}) rotate(${(Math.sin(t * 1.5) * 3).toFixed(1)})`)); a.armR.t = -150; later(1500, () => a.armR.t = 0); }
  else if (id === "ijime" || id === "ayamaru") { // はまべの ちいさな かめ
    const f = F(), tg = utTurtle(f, 0, 0, 1); const tx = (hx + ax) / 2 + 20; loop(t => tg.setAttribute("transform", `translate(${(tx + Math.sin(t * 9) * (id === "ijime" ? 5 : 0)).toFixed(1)} ${base - 30}) scale(.8)`));
    if (id === "ijime") { const k2 = xtra(h.kind === "chu" || a.kind === "chu" ? "pyon" : "chu", ax + 150, h.kind === "chu" || a.kind === "chu" ? .62 : .4); k2.dx.v = k2.dx.t = 0; const st = el("path", { stroke: "#8B5A3C", "stroke-width": 8, "stroke-linecap": "round" }, f);
      loop(t => { const k = Math.sin(t * 6); a.armL.t = 60 + k * 20; st.setAttribute("d", `M${ax - 120 * a.s} ${base - 150} L${tx + 70} ${base - 60 + k * 14}`); if (Math.random() < .03) mark("drop", tx - 30 + rnd(60), base - 110, { vy: -60, life: .6, s: .6 }); }); }
    else { h.sadMouth = true; h.headRot.t = 8; later(4000, () => { h.headRot.t = 0; }); a.armR.t = -40; } }
  else if (id === "nigasu") { a.lean.t = 18; later(1500, () => a.lean.t = 0); later(2400, () => { if (live()) a.lean.t = 18; }); later(3600, () => a.lean.t = 0); for (let i = 0; i < 3; i++) later(600 + i * 500, () => markAbove(a, "heart")); }
  else if (id === "mukae") { markAbove(a, "ex"); a.armR.t = -120; later(1800, () => a.armR.t = 0); }
  else if (id === "noru") { a.lean.t = 26; later(5000, () => { if (live()) a.lean.t = 0; }); word(ax, base - 420, "どうぞ"); }
  else if (id === "moguru") { word(800, 260, "ざぶーん！", "#FFFFFF"); noise(.6, 1200, .5); loop(t => { if (Math.random() < .12) mark("puff", hx - 80 + rnd(160), base - 200 - rnd(200), { vy: -160, life: 1.1, s: .35 }); }); }
  else if (id === "sakana" || id === "tako" || id === "mon") { // えだけの あいて（たい・たこ・えび）
    a.root.style.display = "none"; const g = el("g", {}, G);
    if (id === "sakana") { const m = utFish(g, 0, 0, 1); m.setAttribute("transform", "scale(-1.5 1.5)"); bob(g, ax, base - 210, 1, 14); [[-190, 60], [170, -40], [200, 90]].forEach(([dx, dy], i) => { const s = el("g", {}, G); const q = utFish(s, 0, 0, 1, "#FFD25E", "#FFB13B"); q.setAttribute("transform", "scale(-.45 .45)"); bob(s, ax + dx, base - 210 + dy, 1, 8, 3 + i); }); }
    else if (id === "tako") { utTako(g, 0, 0, 1); bob(g, ax - 40, base - 260, 1.7, 8, 1.8); }
    else { const gate = el("g", {}, G); G.insertBefore(gate, g); el("rect", { x: 880, y: 300, width: 60, height: 500, fill: "#E8473C", ...S6(5) }, gate); el("rect", { x: 1450, y: 300, width: 60, height: 500, fill: "#E8473C", ...S6(5) }, gate);
      el("path", { d: "M820 300 Q1195 200 1570 300 L1540 240 Q1195 150 850 240 Z", fill: "#3FA7A0", ...S6(5) }, gate); el("rect", { x: 940, y: 330, width: 510, height: 470, fill: "#5A2420", ...S6(5) }, gate); el("path", { d: "M1195 330 V800", stroke: "#FFD25E", "stroke-width": 6 }, gate);
      utEbi(g, 0, 0, 1); bob(g, ax - 20, base - 190, 1.15, 4, 2); } }
  else if (id === "kurai") { el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: "#0E2A4A", opacity: .5 }, G); const an = el("g", {}, G); const gl = el("circle", { cx: 70, cy: -70, r: 60, fill: "#FFE27A", opacity: .5 }, an); el("animate", { attributeName: "r", values: "50;76;50", dur: "1.6s", repeatCount: "indefinite" }, gl);
    el("path", { d: "M0 -40 Q30 -90 70 -70", fill: "none", stroke: INK, "stroke-width": 5 }, an); el("circle", { cx: 70, cy: -70, r: 14, fill: "#FFE27A", ...S6(3) }, an); const b = utFish(an, 0, 0, 1, "#6E5A8A", "#4A3D66"); bob(an, 820, 380, 1.2, 12, 1.6); h.sadMouth = true; later(4500, () => h.sadMouth = false); }
  else if (id === "mieta") { const c = el("g", {}, G); utCastle(c, 0, 0, 1); c.setAttribute("transform", "translate(330 560) scale(.75)"); loop(t => { if (Math.random() < .08) mark("sparkle", 180 + rnd(300), 320 + rnd(240), { vy: -20, life: .8, s: .6 }); }); a.armR.t = -130; later(2500, () => a.armR.t = 0); }
  else if (id === "otohime") { h.lean.t = 16; later(1500, () => h.lean.t = 0); for (let i = 0; i < 4; i++) later(i * 500, () => markAbove(a, "sparkle")); a.armL.t = 40; a.armR.t = -40; later(2500, () => { a.armL.t = a.armR.t = 0; }); }
  else if (id === "gochisou") { const f = F(), tx = (hx + ax) / 2 + 10, ty = base - 150; el("rect", { x: tx - 230, y: ty, width: 460, height: 30, rx: 10, fill: "#E8473C", ...S6(5) }, f); el("rect", { x: tx - 200, y: ty + 30, width: 24, height: 130, fill: "#B8322A", ...S6(4) }, f); el("rect", { x: tx + 176, y: ty + 30, width: 24, height: 130, fill: "#B8322A", ...S6(4) }, f);
    const d1 = utFish(f, tx - 130, ty - 34, .5); el("ellipse", { cx: tx - 130, cy: ty - 6, rx: 70, ry: 12, fill: "#FFFFFF", ...S6(4) }, f); f.appendChild(d1);
    [[tx - 10, "#FFD25E"], [tx + 60, "#FFFFFF"], [tx + 130, "#7BD389"]].forEach(([x, c]) => { el("path", { d: `M${x - 30} ${ty - 30} Q${x} ${ty + 10} ${x + 30} ${ty - 30} Z`, fill: "#3E5BD6", ...S6(4) }, f); el("ellipse", { cx: x, cy: ty - 32, rx: 28, ry: 12, fill: c, ...S6(3) }, f); });
    loop(t => { if (Math.random() < .04) mark("puff", tx - 100 + rnd(240), ty - 60, { vy: -70, life: .8, s: .3 }); }); }
  else if (id === "odori") { [[700, 300, 0], [900, 340, 1], [1060, 280, 0], [540, 360, 1]].forEach(([x, y, k], i) => { const g = el("g", {}, G); (k ? utHirame : utFish)(g, 0, 0, .8); loop(t => g.setAttribute("transform", `translate(${(x + Math.sin(t * 2.4 + i) * 60).toFixed(0)} ${(y + Math.cos(t * 4.8 + i) * 26).toFixed(0)}) rotate(${(Math.sin(t * 4.8 + i) * 16).toFixed(0)})`)); });
    loop(t => { if (Math.floor(t * 1.5) !== Math.floor((t - .016) * 1.5)) mark("note", 560 + rnd(520), 220 + rnd(120), { vy: -40, life: 1, s: .8 }); }); }
  else if (id === "zutto") { for (let i = 0; i < 5; i++) later(i * 700, () => mark("note", ax - 100 + rnd(200), base - 520, { vy: -40, life: 1, s: .8 })); later(600, () => joy(a)); }
  else if (id === "kaeritai") { const p = world(h, 200, h.top), g = el("g", { transform: `translate(${p.x + 150} ${p.y - 150})` }, G); el("ellipse", { rx: 130, ry: 90, fill: "#FFFFFF", ...S6(5) }, g); el("circle", { cx: -90, cy: 96, r: 16, fill: "#FFFFFF", ...S6(4) }, g); el("circle", { cx: -118, cy: 128, r: 9, fill: "#FFFFFF", ...S6(3) }, g); utHut(g, 0, 26, .9); h.sadMouth = true; h.headRot.t = 8; later(5000, () => { h.headRot.t = 0; }); }
  else if (id === "tamate") { const f = F(), b = box(f, 0, 0); loop(t => { b.setAttribute("transform", `translate(${ax - 170} ${(base - 250 + Math.sin(t * 2) * 6).toFixed(1)}) scale(.9)`); if (Math.random() < .05) mark("sparkle", ax - 230 + rnd(120), base - 320 + rnd(100), { vy: -20, life: .7, s: .5 }); }); a.armL.t = 60; }
  else if (id === "wakare") { box(F(), hx + 120 * h.s, base - 200, .6); loop(t => { a.armR.t = -140 + Math.sin(t * 6) * 24; }); [[620, 320], [960, 300]].forEach(([x, y], i) => { const g = el("g", {}, G); utFish(g, 0, 0, .6, i ? "#FFD25E" : "#F0645A", "#FFB13B"); bob(g, x, y, 1, 12, 2 + i); }); for (let i = 0; i < 3; i++) later(800 + i * 900, () => markAbove(a, "drop")); }
  else if (id === "okuru") { box(F(), hx + 120 * h.s, base - 200, .6); a.lean.t = 14; later(1500, () => a.lean.t = 0); loop(t => { if (t > 3 && t < 6) a.armR.t = -140 + Math.sin(t * 6) * 24; else if (t >= 6) { a.armR.t = 0; return false; } }); }
  else if (id === "shiranai") { box(F(), hx + 120 * h.s, base - 200, .6); for (let i = 0; i < 3; i++) later(300 + i * 800, () => markAbove(h, "q")); a.headRot.t = 10; later(3000, () => a.headRot.t = 0); }
  else if (id === "nannen") { box(F(), hx + 120 * h.s, base - 200, .6); later(3500, () => { if (live()) word((hx + ax) / 2, base - 560, "300ねん！？", "#FFE27A"); }); later(3600, () => { if (live()) { markAbove(h, "ex"); h.roundMouth = true; later(2500, () => h.roundMouth = false); } }); }
  else if (id === "hako") { const f = F(); box(f, hx + 190, base - 40, .9); loop(t => { if (Math.random() < .06) mark("sparkle", hx + 130 + rnd(120), base - 130 + rnd(80), { vy: -20, life: .7, s: .5 }); }); h.headRot.t = 10; a.eyeScale.t = 1.3; later(4000, () => { a.eyeScale.t = 1; h.headRot.t = 0; }); }
  else if (id === "kemuri") { const f = F(); let bx2 = box(f, hx + 190, base - 40, .9), smoke = false;
    later(3200, () => { if (!live()) return; bx2.remove(); bx2 = utBox(f, hx + 190, base - 40, .9, true); smoke = true; noise(.5, 500, .5); word(800, 300, "もくもくもく……", "#FFFFFF"); });
    loop(t => { if (smoke && t < 9.5 && Math.random() < .35) mark("puff", hx + 60 + rnd(220), base - 120 - rnd(300), { vx: -60 + rnd(120), vy: -150, life: 1.3, s: .8 + Math.random() * .8 }); });
    later(8200, () => { if (!live()) return; const b = utBeard(h); UT_CLEAN.push(() => b.remove()); h.squash.t = .88; h.lean.t = 12; blip(300, 140, .4, "triangle"); later(900, () => h.squash.t = 1); }); }
  return G; }
/* ---------- 🎭 げき ---------- */
const UT_CLEAN = [];
function utPick(area) { const pool = UT.sc.filter(s => s.area === area); const m = Math.min(...pool.map(s => UT_N.get(s.id) || 0)); return pool.find(s => (UT_N.get(s.id) || 0) === m); } // おはなしの じゅんに
async function utScene(pc) {
  const hero = pc.kind, sc = utPick(nArea(pc.node)), t = tierOf(); UT_N.set(sc.id, (UT_N.get(sc.id) || 0) + 1);
  showEngine(null, `うらしまたろうの げき（${sc.id}・段${t + 1}）`);
  const art = ["tai", "tako", "ebi"].includes(sc.who), who = art ? "kame" : sc.who === hero ? (hero === "gao" ? "tora" : "gao") : sc.who; /* あそぶ ひとと おなじ キャラは だせないので かわりの こ */
  const { hero: h, ask: a } = setSitView({ id: "ut_" + sc.id, place: sc.place, asker: who, intro: "ut" }, hero);
  a.dx.v = a.dx.t = 0; UT_CLEAN.push(utCostume(h, sc.role));
  const role = UT.role[sc.role], chip = el("g", {}, propG); el("rect", { x: 40, y: 150, width: 430, height: 70, rx: 35, fill: "#FFE27A", ...S6(5) }, chip); txt(chip, 255, 200, `やく：${role}`, 36, { "text-anchor": "middle", "font-weight": 700 });
  try {
    enter(h); await sleep(900);
    if (!UT_N.get("_intro")) { UT_N.set("_intro", 1); await speak(C.pony, "utp_say", UT.txt.utp_say); }
    utProp(sc, h, a);
    await speak(C.pony, `utn_${sc.id}`, sc.n);
    if (!art) playMove(a, "nod"); await speak(a, `utw_${sc.id}`, sc.line);
    let okN = 0, nSay = 0; const log = [];
    const step = async (key, text, keys, tag) => { nSay++; const r = await kmSay(h, key, text, keys, tag); if (r.ok) okN++; log.push(`${r.ok ? "○" : "×"}${r.heard}`); return r.ok; };
    await step(`uts_${sc.id}`, sc.say, sc.keys, `${role}に なって いおう`);
    if (sc.id !== "kemuri") h.sadMouth = false;
    if (!art) { playMove(a, "nod"); if (SPECIAL[who]) SPECIAL[who](a); } await speak(a, `utr_${sc.id}`, sc.res);
    if (sc.t2 && t >= 1) { await speak(a, `utw2_${sc.id}`, sc.t2.line); await step(`uts2_${sc.id}`, sc.t2.say, sc.t2.keys, "つづけて いおう"); if (!art) joy(a); await speak(a, `utr2_${sc.id}`, sc.t2.res); }
    const ok = okN * 2 >= nSay; grade(ok); GS.tasks++;
    playLog({ type: "urashima", id: sc.id, role: sc.role, tier: t, okN, nSay, tries: log, ...(MODE === "multi" ? { who: NAMES[hero] } : {}) });
    if (ok) { confetti(36); joy(h); const k = rnd(2) ? "utp_ok" : "utp_good"; await speak(C.pony, k, UT.txt[k]); }
    await sleep(400); return ok;
  } finally { UT_CLEAN.splice(0).forEach(f => { try { f(); } catch (e) { } }); h.sadMouth = false; h.lean.t = 0; setView("board"); } }
Object.assign(LTASK_RUN, { ut: utScene, ukai: utKai, utsuri: utTsuri });
/* ---------- 声の パック ---------- */
{ const lp = loadPack; loadPack = async function (id) { const r = await lp(id); if (id !== "urashima") return r;
    if (!PACK.loaded.urashima) { try { const q = await fetch("packs/urashima.json", { cache: "no-cache" }); if (q.ok) { const d = await q.json(); Object.keys(d).forEach(k => AUD[k] = "data:audio/mpeg;base64," + d[k]); PACK.loaded.urashima = Object.keys(d); } } catch (e) { } }
    if (AUD.bgm_urashima) await voiceBuf("bgm_urashima"); return true; }; }
/* ---------- メニューの タイルの 絵 ---------- */
if (typeof A2 !== "undefined") A2.urashima = (L, X) => { el("rect", { x: -200, y: 0, width: 880, height: 300, fill: "#8FD3F0" }, L); el("rect", { x: -200, y: 170, width: 880, height: 130, fill: "#5BB5E0" }, L);
  el("path", { d: "M-200 262 Q100 240 400 258 T680 250 V300 H-200 Z", fill: "#E9D9A6", ...S6(4) }, L); utCastle(L, X(.44), 236, .3); utTurtle(L, X(-.02), 214, .62); utFish(L, X(.2), 70, .3); utBubbles(L, [[X(-.4), 80, 6], [X(.1), 50, 5]]);
  CH(L, "shima", X(-.36), .3, HAPPY); CH(L, "otohime", X(.2), .3, HI); };
/* ---------- 手がきの アイコン ---------- */
Object.assign(ICON_DRAW, {
  "🎭": g => { IC.P(g, "M-90 -60 Q-40 -80 10 -60 Q14 30 -40 60 Q-94 30 -90 -60 Z", "#FFE27A", 6); IC.C(g, -62, -22, 8, INK, 0); IC.C(g, -20, -22, 8, INK, 0); IC.P(g, "M-66 14 Q-40 38 -14 14", "none", 6);
    IC.P(g, "M0 -20 Q46 -44 92 -20 Q94 66 46 92 Q-2 66 0 -20 Z", "#BDE9F5", 6); IC.C(g, 26, 14, 8, INK, 0); IC.C(g, 66, 14, 8, INK, 0); IC.P(g, "M22 60 Q46 40 70 60", "none", 6); },
  "🎣": g => { IC.P(g, "M-80 90 L60 -90", "none", 9); IC.P(g, "M60 -90 Q90 -20 70 40", "none", 4); IC.P(g, "M70 40 q-2 24 -20 18", "none", 6); IC.P(g, "M-6 50 Q30 20 64 50 Q30 80 -6 50 Z M-6 50 l-26 -18 v36 z", "#F0645A", 5); IC.C(g, 44, 44, 5, INK, 0); },
});
