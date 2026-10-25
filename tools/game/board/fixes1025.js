/* ================= 2026-10-25 あまねさんの ためしあそびの なおし（ぜんたい） ================= */
// ① こたえた すぐ あとの こえは、すこし まってから（はじめが きこえない・ママの こえの あたまが きれる）
let LAST_HEAR = 0;
{ const ls = listen; listen = function (...a) { return ls(...a).then(r => { LAST_HEAR = performance.now(); return r; }); }; }
{ const sp = speak; speak = async function (c, key, text) { const w = 650 - (performance.now() - LAST_HEAR); if (w > 0) await sleep(w); return sp(c, key, text); }; }
// ② ききとりの ゆれ：かんじ・カタカナ・のばす おと（ちゅう＝チュー・中、とらお＝虎男 など）も あう ように
const SYN = { "とら": ["虎", "寅"], "ちゅう": ["中", "チュー", "ちゅー"], "くま": ["熊", "クマ"], "みい": ["ミー", "みー"], "ぱんな": ["パンナ"], "かさ": ["傘", "笠"], "ほどう": ["歩道", "舗道", "ほど"],
  "さき": ["先", "崎", "咲き"], "あわ": ["泡", "アワ"], "いちご": ["苺", "イチゴ"], "のらない": ["乗らない", "のれない", "乗れない"], "ひと": ["人"], "こうえん": ["公園"], "ママ": ["まま", "お母さん"], "パパ": ["ぱぱ", "お父さん"] };
const synOf = v => { const out = [v]; if (SYN[v]) out.push(...SYN[v]); if (v.length >= 2 && /^[ぁ-ん]+$/.test(v)) { const w = v[0] + v.slice(1).replace(/う/g, "ー").replace(/い$/, "ー"); if (w !== v) out.push(w); } return out; };
{ const ls = listen; listen = function (groups, ms) { const g2 = (groups || []).map(g => [...new Set(g.flatMap(synOf))]); return ls(g2, ms); }; }
// ③ はじめから マイクを いれて おく（マイクが はいるまで 音が ちいさい 端末が ある）
{ const ng = newGame; newGame = function (...a) { try { if (!MIC.stream) micAlwaysOn(); } catch (e) { } return ng(...a); }; }
// ④ おでかけ：「じてんしゃに のるよ」は 課題の まえに（かさならない ように）
var OD_BIKE_SAY = false;
{ const lc = landChild; landChild = async function (pc = P.shima) { if (curStage === "odekake" && OD_BIKE_SAY) { OD_BIKE_SAY = false; await speak(C.pony, "od_bike", "ここからは じてんしゃに のるよ！ ヘルメットを かぶって しゅっぱつ！"); } return lc(pc); }; }
{ const be = boardEvent; boardEvent = async function (pc) { if (curStage === "odekake" && OD_BIKE_SAY) { OD_BIKE_SAY = false; await speak(C.pony, "od_bike", "ここからは じてんしゃに のるよ！ ヘルメットを かぶって しゅっぱつ！"); } return be(pc); }; }
// ⑤ ロングコース：うえの しるしの せつめい（凡例）は ださない。その ぶん マスを おおきく
{ const db = drawBoard; drawBoard = function () { db(); if (!(typeof isLong === "function" && isLong())) return;
    boardLayer.querySelectorAll("rect").forEach(r => { if (r.getAttribute("width") === "1180" && r.getAttribute("height") === "64") r.parentNode.remove(); });
    const R = { 44: 56, 26: 33, 34: 44, 36: 45, 58: 66 };
    boardLayer.querySelectorAll("circle").forEach(c => { const r = +c.getAttribute("r"); if (R[r]) c.setAttribute("r", R[r]); });
    boardLayer.querySelectorAll("text").forEach(t => { const f = +t.getAttribute("font-size"); if (f >= 34 && f <= 38) { t.setAttribute("font-size", Math.round(f * 1.25)); t.setAttribute("y", +t.getAttribute("y") + 4); } }); }; }

/* ⏸（ひとやすみ）中に こうかおんが たまって、もどった とき いっきに「ビビビ」と なるのを ふせぐ（2026-10-25） */
{ const b0 = blip; blip = function (...a) { if (HIDE.off) return; return b0(...a); };
  const n0 = noise; noise = function (...a) { if (HIDE.off) return; return n0(...a); };
  if (typeof tune === "function") { const t0 = tune; tune = function (...a) { if (HIDE.off) return; return t0(...a); }; }
  const sp = speak; speak = async function (...a) { await whenShown(); return sp(...a); }; }

/* ゴールの てまえの マイナスマスを ショートコース みんなに（さんすうの ゴール付近が たのしい、2026-10-25）
   ゴールに つながる マスで しかけの ない ものを「2マス もどる」に する */
{ const isLongSt = id => typeof SL_SHAPE !== "undefined" && SL_SHAPE[id];
  for (const st of Object.keys(BOARD)) { if (isLongSt(st) || !EVENTS[st]) continue; const B = BOARD[st];
    const goal = Object.keys(B.nodes).find(k => B.nodes[k].includes("goal")); if (!goal) continue;
    for (const a of Object.keys(B.next)) if ((B.next[a] || []).includes(goal) && !EVENTS[st][a] && a !== "0" && !Object.keys(B.next).some(z => (B.next[z] || []).includes(a) && EVENTS[st][z] && ["back", "home"].includes(EVENTS[st][z][0])))
      EVENTS[st][a] = ["back", 2, "ev_goalb", "ゴールの てまえで つまずいた！ 2マス もどるよ"]; } }

/* なんども きく 決まり文句は、2かいめからは みじかく（2026-10-25） */
const SHORT = { mk_pick: ["mk_pick_s", "どれに する？"], mk_retry: ["mk_retry_s", "べつの いいかたは？"], mk_say: ["mk_say_s", "いって みよう"],
  mk_help: ["mk_help_s", "なんて いう？"], mk_teach: ["mk_teach_s", "おしえて あげよう"], mkp_cardq: ["mkp_cardq_s", "どれが いいかな？"],
  mkp_card_ok: ["mk_say_s", "いって みよう"], kp_pitta: ["kp_pitta_s", "どの きもちが ぴったり？"], kp_pitta_say: ["mk_say_s", "いって みよう"] };
const SAID_N = {};
{ const sp = speak; speak = function (c, key, text) { if (SHORT[key]) { SAID_N[key] = (SAID_N[key] || 0) + 1; if (SAID_N[key] > 1 && AUD[SHORT[key][0]]) return sp(c, ...SHORT[key]); } return sp(c, key, text); };
  const ng = newGame; newGame = function (...a) { for (const k in SAID_N) delete SAID_N[k]; return ng(...a); }; }
