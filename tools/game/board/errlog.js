/* ================= エラーの きろく と あとかたづけ（2026-11-08） =================
   あまねさん：ロングコース「うちゅう」の はやくちことばの とちゅうで、課題が でた まま 盤に もどって すすんで しまった。
   課題の 中で エラーが おきると solo_long.js の まもりが「盤に もどして つづける」が、
   ① なにが おきたか どこにも のこらない ② きいている しるし（わく・きこえた ことば）や かんばんが のこる。
   → エラーは「あそんだ きろく」に のこし（おとなの かたへ → きろくを 見る）、盤に もどる まえに ぜんぶ かたづける。 */
let ERR_AT = -1e9;
function logErr(e, where) {
  try { const t = performance.now(); if (t - ERR_AT < 2000) return; ERR_AT = t; // れんぞくで 同じ エラーが ふえすぎない ように
    const pc = (typeof CUR_PL !== "undefined" && CUR_PL && CUR_PL.pc) || P.shima;
    playLog({ type: "err", where: where || "", stage: typeof curStage !== "undefined" ? curStage : "", node: pc && pc.node, task: ((typeof LONG_TASKS !== "undefined" && LONG_TASKS[curStage]) || {})[pc && pc.node] || "", view: typeof view !== "undefined" ? view : "",
      msg: String(e && e.message || e).slice(0, 200), at: String(e && e.stack || "").split("\n").slice(0, 4).map(s => s.trim()).join(" < ").slice(0, 400), ua: navigator.userAgent.replace(/Mozilla\/5\.0 /, "").slice(0, 90) }); } catch (_) { }
}
window.addEventListener("error", ev => logErr(ev.error || ev.message, "window"));
window.addEventListener("unhandledrejection", ev => logErr(ev.reason, "promise"));
// 課題の 中で とまった ときの あとかたづけ（盤に もどる まえ）
function tidyAfterError() {
  try { clearClones(); } catch (_) { } try { hideTask(); taskListen(false); } catch (_) { } try { unsay(); showEar(null, false); } catch (_) { }
  try { heardEl.textContent = ""; } catch (_) { } try { delete window.__wob; delete window.__stall; } catch (_) { }
  try { if (propG && propG.parentNode) { propG.remove(); propG = null; } } catch (_) { } // かんばん などの こどうぐ
  try { if (typeof hudLayer !== "undefined") [...hudLayer.querySelectorAll("g")].filter(g => g.__panel).forEach(g => g.remove()); } catch (_) { }
}
{ const lc = landChild; landChild = async function (pc = P.shima) { try { return await lc(pc); } catch (e) { logErr(e, "landChild"); tidyAfterError(); setView("board"); } }; }
{ const be = boardEvent; boardEvent = async function (pc) { try { return await be(pc); } catch (e) { logErr(e, "boardEvent"); tidyAfterError(); setView("board"); } }; }
// 「あそんだ きろく」の 1ぎょう
{ const lt = logText; logText = function () { const r = lt(); let a = []; try { a = JSON.parse(localStorage.getItem(LOG_KEY) || "[]"); } catch (e) { }
    const errs = a.filter(x => x.type === "err"); if (!errs.length) return r;
    const d = t => { const x = new Date(t); return `${x.getMonth() + 1}/${x.getDate()} ${String(x.getHours()).padStart(2, "0")}:${String(x.getMinutes()).padStart(2, "0")}`; };
    r.text = r.text.replace(/\n[^\n]*"type":"err"[^\n]*/g, "") + "\n\n⚠ エラーの きろく（Claude に 見せて ください）\n" + errs.map(x => `${d(x.t)} [${x.where}] コース ${x.stage} マス ${x.node} 課題 ${x.task} がめん ${x.view}\n   ${x.msg}\n   ${x.at}\n   ${x.ua}`).join("\n"); return r; }; }
