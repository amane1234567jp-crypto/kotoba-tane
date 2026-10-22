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
  if (!list || list.querySelector(".mgenres")) return;
  const bs = [...list.querySelectorAll(":scope > .mst")]; let i = 0;
  bs.forEach(b => { if (b.classList.contains("mlong")) b.dataset.g = "long"; else { const s = STAGES[i++]; b.dataset.g = s ? genreOf(s.id) : "gakkou"; } });
  const clears = solo ? (SAVE.cleared[SAVE.lap] || []) : [];
  const bar = document.createElement("div"); bar.className = "mgenres";
  let cur = null; try { cur = localStorage.getItem(GENRE_KEY); } catch (e) { }
  if (solo && SAVE.play) cur = SL.includes(SAVE.play.stage) || ["long", "ltomo"].includes(SAVE.play.stage) ? "long" : genreOf(SAVE.play.stage);
  if (!GENRES.some(g => g[0] === cur && bs.some(b => b.dataset.g === cur))) cur = GENRES[0][0];
  const pick = gid => { cur = gid; try { localStorage.setItem(GENRE_KEY, gid); } catch (e) { }
    bar.querySelectorAll(".mgen").forEach(x => x.classList.toggle("on", x.dataset.g === gid)); bs.forEach(b => b.style.display = b.dataset.g === gid ? "" : "none"); };
  GENRES.forEach(([gid, ic, nm]) => { const mine = bs.filter(b => b.dataset.g === gid); if (!mine.length) return;
    const b = document.createElement("button"); b.type = "button"; b.className = "mgen g-" + gid; b.dataset.g = gid;
    const ids = gid === "long" ? [] : GENRES.find(g => g[0] === gid)[3]; const done = ids.filter(id => clears.includes(id)).length;
    b.innerHTML = `<span class="mgi">${ic}</span><span class="mgn">${nm}</span>` + (solo && ids.length ? `<span class="mgc">★ ${done}/${mine.length}</span>` : "");
    b.onclick = () => { pick(gid); try { blip(700, 900, .04, "square"); } catch (e) { } }; bar.append(b); });
  list.prepend(bar); list.classList.add("mgrouped"); pick(cur);
}
{ const sm = showMenu; showMenu = function () { sm(); groupStages(document.querySelector("#startBox .mcard:not(.mmcard) .mstages"), true); }; }
{ const smm = showMultiMenu; showMultiMenu = function () { smm(); groupStages(document.querySelector("#startBox .mmcard .mstages"), false); }; }
if (document.querySelector("#startBox .mcard .mstages")) groupStages(document.querySelector("#startBox .mcard:not(.mmcard) .mstages"), true);
(function () { const s = document.createElement("style"); s.textContent = `
.start.menu .mstages.mgrouped,.start.menu .mcard .mstages.mwide.mgrouped,.start.menu .mmcard .mstages.mgrouped{grid-template-columns:repeat(auto-fill,minmax(104px,1fr))!important;gap:8px!important}
.mstages .mgenres{grid-column:1/-1;display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:2px 0 6px}
.start.menu .mstages .mgen{display:flex;align-items:center;gap:6px;font:400 clamp(14px,1.7vw,20px) var(--display);color:#2B2A33;background:#FFFFFF;border:4px solid #2B2A33;border-radius:999px;padding:4px 14px 4px 8px;box-shadow:0 4px 0 #2B2A33;cursor:pointer}
.start.menu .mstages .mgen .mgi{font-size:1.4em;line-height:1}.start.menu .mstages .mgen .mgc{font-size:.72em;background:#FFF1B8;border:2px solid #2B2A33;border-radius:999px;padding:0 6px}
.start.menu .mstages .mgen.on{transform:translateY(3px);box-shadow:0 1px 0 #2B2A33}
.start.menu .mstages .mgen.g-gakkou.on{background:#FFD1D9}.start.menu .mstages .mgen.g-jugyou.on{background:#FFE9B8}.start.menu .mstages .mgen.g-machi.on{background:#D7ECFF}.start.menu .mstages .mgen.g-ouchi.on{background:#D7F0D2}.start.menu .mstages .mgen.g-tsutaeru.on{background:#FFE0EE}.start.menu .mstages .mgen.g-kangaeru.on{background:#EDE3FF}.start.menu .mstages .mgen.g-long.on{background:#FFD25E}
.start.menu .mstages.mgrouped .mst{min-height:92px}.start.menu .mstages.mgrouped .mst .mico{font-size:clamp(24px,3vw,34px)!important}.start.menu .mstages.mgrouped .mst .mname{font-size:clamp(12px,1.4vw,16px)!important}
.start.menu .mstages.mgrouped .mst:not(.mlong) .mno{visibility:hidden}
@media (max-width:700px){.start.menu .mstages .mgenres{display:grid;grid-template-columns:1fr 1fr;gap:6px}.start.menu .mstages .mgen{font-size:14px;padding:3px 10px 3px 6px}}`; document.head.appendChild(s); })();
