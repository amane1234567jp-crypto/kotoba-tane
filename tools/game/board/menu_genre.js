/* ================= メニューを ジャンルごとに（2026-10-23） =================
   コースが ふえて えらびにくく なったので、うえの ジャンルボタンで きりかえる。ロングコースは「ロングコース」で ひとまとめ。 */
const GENRES = [
  ["gakkou", "🏫", "がっこう", ["kousha", "undou", "gakkou2", "gakkou3", "kyuushoku", "sensei1", "seki1", "hoken2", "yasumi"]],
  ["jugyou", "✏️", "じゅぎょう", ["kokugo", "sansu", "tokei", "ongaku", "zukou", "taiiku"]],
  ["machi", "🚃", "まち・おでかけ", ["toukou", "gekou", "kaerimichi", "omise", "densha", "burger", "byouin", "haisha", "jitensha"]],
  ["ouchi", "🏡", "おうち・あそび", ["ouchi1", "ie1", "yuushoku", "kouen", "kouen2", "asobiba", "tomodachi1"]],
  ["tsutaeru", "💬", "きもちを つたえる", ["manekko", "kikikaesu", "sos", "junban", "kotowaru", "denwa", "aite"]],
  ["kangaeru", "🤔", "かんがえる", ["komatta", "kirikae"]],
  ["long", "⭐", "ロングコース", []],
];
const GENRE_KEY = "kotoba-tane-genre";
function genreOf(id) { const g = GENRES.find(g => g[3].includes(id)); return g ? g[0] : "gakkou"; }
function groupStages(list, solo) {
  if (!list || list.classList.contains("mgrouped")) return;
  const bs = [...list.querySelectorAll(":scope > .mst")]; let i = 0;
  bs.forEach(b => { if (b.classList.contains("mlong")) b.dataset.g = "long"; else { const s = STAGES[i++]; b.dataset.g = s ? genreOf(s.id) : "gakkou"; if (s) b.dataset.st = s.id; } });
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

/* コースの なまえの おりかえし（2026-10-25）：ことばの とちゅうで きれない ように、きりの いい ところで 2ぎょうに。はみでる ときは 文字を すこし 小さく */
function fitNames(list) { if (!list) return;
  const SMALL = "ゃゅょっぁぃぅぇぉャュョッァィゥェォー・、";
  list.querySelectorAll(".mst .mname").forEach(n => { if (n.dataset.fit) return; n.dataset.fit = 1; if (n.querySelector("br")) return;
    const t = n.textContent.trim(); let lines = [t];
    const BRK = { "だいぼうけん": 2, "おともだち1": 0, "ゆうごはん": 0, "じてんしゃ": 0, "ききかえす": 0, "ほけんしつ": 0 };
    if (BRK[t] > 0) lines = [t.slice(0, BRK[t]), t.slice(BRK[t])];
    else if (t.length > 5 && BRK[t] !== 0) { const sp = [...t].map((c, i) => c === " " || c === "・" ? i : -1).filter(i => i > 0);
      let cut = sp.sort((a, b) => Math.abs(a - t.length / 2) - Math.abs(b - t.length / 2))[0], skip = 1;
      if (cut == null) { const no = [...t].map((c, i) => c === "の" && i > 1 && i < t.length - 2 ? i + 1 : -1).filter(i => i > 0)[0];
        if (no) { cut = no; skip = 0; } else { cut = Math.ceil(t.length / 2); while (cut < t.length - 1 && SMALL.includes(t[cut])) cut++; skip = 0; } }
      lines = [t.slice(0, cut + (t[cut] === "・" ? 1 : 0)), t.slice(cut + skip)].map(s => s.trim()).filter(Boolean); }
    n.innerHTML = ""; lines.forEach((l, i) => { if (i) n.append(document.createElement("br")); n.append(l); });
    n.style.whiteSpace = "nowrap"; n.style.lineHeight = "1.12"; n.style.display = "block"; n.style.maxWidth = "100%"; n.style.overflow = "hidden"; });
  requestAnimationFrame(() => list.querySelectorAll(".mst .mname").forEach(n => { let fs = parseFloat(getComputedStyle(n).fontSize), k = 0;
    while (n.scrollWidth > n.clientWidth + 1 && fs > 9 && k++ < 12) { fs -= 1; n.style.setProperty("font-size", fs + "px", "important"); } })); }
{ const g0 = groupStages; groupStages = function (list, solo) { const r = g0(list, solo); try { fitNames(list); } catch (e) { } return r; }; }
if (document.querySelector("#startBox .mcard .mstages")) fitNames(document.querySelector("#startBox .mcard:not(.mmcard) .mstages"));
