/* ================= メニューを ジャンルごとに（2026-10-23） =================
   コースが ふえて えらびにくく なったので、うえの ジャンルボタンで きりかえる。ロングコースは「ロングコース」で ひとまとめ。 */
const GENRES = [
  ["gakkou", "🏫", "がっこう", ["kousha", "undou", "gakkou2", "gakkou3", "kyuushoku", "sensei1", "seki1", "hoken2", "yasumi"]],
  ["jugyou", "✏️", "じゅぎょう", ["kokugo", "sansu", "tokei", "ongaku", "zukou", "taiiku"]],
  ["machi", "🚃", "まち・おでかけ", ["toukou", "gekou", "kaerimichi", "omise", "densha", "burger", "byouin", "haisha", "jitensha"]],
  ["ouchi", "🏡", "おうち・あそび", ["ouchi1", "ie1", "yuushoku", "kouen", "kouen2", "asobiba", "tomodachi1"]],
  ["tsutaeru", "💬", "きもちを つたえる", ["kikikaesu", "sos", "junban", "kotowaru", "denwa", "aite", "tachiba"]],
  ["kangaeru", "🤔", "かんがえる", ["komatta", "kirikae", "matsu", "bousai", "souzou", "sakiyomi", "chotto"]],
  ["long", "⭐", "ロングコース", []],
];
const GENRE_KEY = "kotoba-tane-genre";
function genreOf(id) { const g = GENRES.find(g => g[3].includes(id)); return g ? g[0] : "gakkou"; }
function groupStages(list, solo) {
  if (!list || list.classList.contains("mgrouped")) return;
  const bs = [...list.querySelectorAll(":scope > .mst")]; let i = 0;
  bs.forEach(b => { if (b.classList.contains("mlong")) b.dataset.g = "long"; else { const s = STAGES[i++]; b.dataset.g = s ? genreOf(s.id) : "gakkou"; } });
  // まえの ずらりと ならぶ 形の まま、ショートコースを ジャンルの じゅんに ならべかえて、ジャンルごとに いろを かえる（2026-10-24）。ロングコースは さいご
  let n = 0; GENRES.forEach(([gid]) => bs.filter(b => b.dataset.g === gid).forEach(b => { b.classList.add("g-" + gid); list.append(b);
    if (gid !== "long") { const no = b.querySelector(".mno"); if (no) no.textContent = String(++n); } }));
  list.classList.add("mgrouped");
}
{ const sm = showMenu; showMenu = function () { sm(); groupStages(document.querySelector("#startBox .mcard:not(.mmcard) .mstages"), true); }; }
{ const smm = showMultiMenu; showMultiMenu = function () { smm(); groupStages(document.querySelector("#startBox .mmcard .mstages"), false); }; }
if (document.querySelector("#startBox .mcard .mstages")) groupStages(document.querySelector("#startBox .mcard:not(.mmcard) .mstages"), true);
(function () { const s = document.createElement("style"); s.textContent = `
.start.menu .mcard .mlap{display:none!important}
.start.menu .mstages .mst.g-gakkou{background:#FFE0E6}.start.menu .mstages .mst.g-jugyou{background:#FFEFC9}.start.menu .mstages .mst.g-machi{background:#DDF0FF}
.start.menu .mstages .mst.g-ouchi{background:#DDF2D0}.start.menu .mstages .mst.g-tsutaeru{background:#FFE3F1}.start.menu .mstages .mst.g-kangaeru{background:#ECE4FF}`; document.head.appendChild(s); })();
