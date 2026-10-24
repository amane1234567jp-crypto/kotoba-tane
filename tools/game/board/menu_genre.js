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
  if (!list || list.querySelector(".mghead")) return;
  const bs = [...list.querySelectorAll(":scope > .mst")]; let i = 0;
  bs.forEach(b => { if (b.classList.contains("mlong")) b.dataset.g = "long"; else { const s = STAGES[i++]; b.dataset.g = s ? genreOf(s.id) : "gakkou"; } });
  const clears = solo ? (SAVE.cleared[SAVE.lap] || []) : [];
  // 階層なし：ジャンルの 見出しの したに、その ジャンルの コースを ぜんぶ ならべる（2026-10-24）
  GENRES.forEach(([gid, ic, nm]) => { const mine = bs.filter(b => b.dataset.g === gid); if (!mine.length) return;
    const h = document.createElement("div"); h.className = "mghead g-" + gid;
    const ids = gid === "long" ? [] : GENRES.find(g => g[0] === gid)[3]; const done = ids.filter(id => clears.includes(id)).length;
    h.innerHTML = `<span class="mgi">${ic}</span><span class="mgn">${nm}</span>` + (solo && ids.length ? `<span class="mgc">★ ${done}/${mine.length}</span>` : "");
    list.append(h); mine.forEach(b => list.append(b)); });
  list.classList.add("mgrouped");
}
{ const sm = showMenu; showMenu = function () { sm(); groupStages(document.querySelector("#startBox .mcard:not(.mmcard) .mstages"), true); }; }
{ const smm = showMultiMenu; showMultiMenu = function () { smm(); groupStages(document.querySelector("#startBox .mmcard .mstages"), false); }; }
if (document.querySelector("#startBox .mcard .mstages")) groupStages(document.querySelector("#startBox .mcard:not(.mmcard) .mstages"), true);
(function () { const s = document.createElement("style"); s.textContent = `
.start.menu .mcard .mlap{display:none!important}
.start.menu .mstages.mgrouped,.start.menu .mcard .mstages.mwide.mgrouped,.start.menu .mmcard .mstages.mgrouped{grid-template-columns:repeat(auto-fill,minmax(96px,1fr))!important;gap:8px!important}
.start.menu .mstages .mghead{grid-column:1/-1;display:flex;align-items:center;gap:8px;font:400 clamp(16px,1.9vw,22px) var(--display);color:#2B2A33;border-bottom:4px solid #2B2A33;padding:6px 4px 2px;margin-top:6px}
.start.menu .mstages .mghead:first-child{margin-top:0}.start.menu .mstages .mghead .mgi{font-size:1.3em;line-height:1}
.start.menu .mstages .mghead .mgc{font-size:.7em;background:#FFF1B8;border:2px solid #2B2A33;border-radius:999px;padding:0 8px}
.start.menu .mstages .mghead.g-gakkou{border-color:#FF8FA3}.start.menu .mstages .mghead.g-jugyou{border-color:#FFB34D}.start.menu .mstages .mghead.g-machi{border-color:#7FCBF0}.start.menu .mstages .mghead.g-ouchi{border-color:#7BD389}.start.menu .mstages .mghead.g-tsutaeru{border-color:#E86A9A}.start.menu .mstages .mghead.g-kangaeru{border-color:#B9A8D9}.start.menu .mstages .mghead.g-long{border-color:#3E7FD6}
.start.menu .mstages.mgrouped .mst:not(.mlong) .mno{visibility:hidden}
.start.menu .mstages.mgrouped .mst{min-height:86px}`; document.head.appendChild(s); })();
