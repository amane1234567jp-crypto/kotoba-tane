/* ================= ショートコースにも おもしろマス（2026-11-01） =================
   ロングコースの 🎯ルーレット（ストップ ゲーム）・🎈ふうせん わり・✖2 サイコロ2ばい を、ショートコースの とちゅうに 1つずつ おく。
   この マスに とまったら 場面（会話）の かわりに それを する。声は packs/sfun.json（make_packs.py が slong から ぬきだす） */
const SF_KEYS = ["sf_x2"];
const SF_SKIP = new Set(["kousha", "sansu", "tokei", "kaerimichi", "komatta", "manekko"]); // じぶんの しくみが ある コースは そのまま
const sfShort = id => !!BOARD[id] && !(typeof SL !== "undefined" && SL.includes(id)) && !(typeof LONGS !== "undefined" && LONGS.has(id)) && id !== "ltomo" && !SF_SKIP.has(id);
const SF_POS = {};
function sfPlace(id) { if (SF_POS[id] !== undefined) return SF_POS[id]; const B = BOARD[id]; SF_POS[id] = null; if (!B || !B.next) return null;
  const path = []; let cur = "0", guard = 0; while (cur && guard++ < 80) { path.push(cur); const nx = B.next[cur] || []; if (!nx.length) break; cur = nx[0]; }
  const ev = (EVENTS[id] || {}), ok = n => { const v = B.nodes[n]; return v && !v[2] && !ev[n] && (B.next[n] || []).length === 1 && n !== "0" && n !== "15"; };
  const cand = path.filter(ok); if (cand.length < 3) return null;
  const pick = [.35, .7].map(f => cand[Math.min(cand.length - 1, Math.round(f * (cand.length - 1)))]); if (new Set(pick).size < 2) return null;
  return SF_POS[id] = { [pick[0]]: "stop", [pick[1]]: "balloon" }; } // サイコロ2ばいの マスは なし（2026-11-01）
const sfAt = (id, n) => { if (!sfShort(id)) return null; const m = sfPlace(id); return m && m[n] || null; };
// 盤に しるし
{ const db = drawBoard; drawBoard = function () { db(); try { const m = sfShort(curStage) && sfPlace(curStage); if (!m) return;
    Object.entries(m).forEach(([n, t]) => { if (!NODES[n]) return; const [x, y] = NODES[n], c = { stop: "#FFE27A", x2: "#C9E7FF", balloon: "#FFC2D1" }[t];
      el("circle", { cx: x, cy: y, r: 36, fill: c, ...S6(4) }, boardLayer); txt(boardLayer, x, y + (t === "x2" ? 13 : 16), { stop: "🎯", x2: "×2", balloon: "🎈" }[t], t === "x2" ? 34 : 44, { "text-anchor": "middle" }); }); } catch (e) { } }; }
// うごく（ショートコースは わかれみちが あるので、すすむ＝つぎの マス、もどる＝きた みち）
async function sfGo(pc, d) {
  if (d > 0) { for (let i = 0; i < d; i++) { const nx = NEXT(pc.node); if (!nx.length) break; const to = nx[0]; await hop(pc, to, .3, i);
      if (to === GOAL) { if (!winner) { winnerPc = pc; winner = MODE === "multi" ? pc.kind : pc === P.shima ? "child" : "gao"; } return; } } }
  else if (d < 0) { pc.backing = true; for (let i = 0; i < -d; i++) { const to = (pc.trail || []).pop(); if (!to) break; await hop(pc, to, .3, i); } pc.backing = false; } }
{ const g0 = slGo; slGo = async function (pc, d) { if (isSL()) return g0(pc, d); return sfGo(pc, d); }; }
const sfF = pc => pc.player || (pc.__pl = pc.__pl || {}); // フラグの いれもの（ひとりで あそぶ ときは pc.player が ない）
// サイコロ：2こ・2ばい（ショートコース）
{ const rd = rollDice; rollDice = async function (forced) { if (isSL() || forced || !sfShort(curStage)) return rd(forced);
    const pc = MODE === "multi" ? (CUR_PL && CUR_PL.pc) : P.shima; let v = await rd(); if (!pc) return v;
    const F = sfF(pc); if (F.dice2) { F.dice2 = 0; await speak(C.pony, "sl_d2_more", "もう ひとつ ふってね"); await waitDice(); const w = await rd(); v += w; popNumber(v); await sleep(400); }
    if (F.x2) { F.x2 = 0; await speak(C.pony, "sl_x2_now", "2ばいに なるよ！"); v *= 2; popNumber(v); await sleep(400); }
    return v; }; }
// とまったら
async function sfRun(pc, t) {
  const cpu = MODE === "multi" ? !!(pc.player && pc.player.cpu) : pc !== P.shima;
  markAbove(pc, "ex"); chime();
  if (t === "x2") { showBanner("サイコロ 2ばい！", 1400); await speak(C.pony, "sf_x2", "サイコロ 2ばいの マス！ つぎの サイコロは 2ばいだよ"); sfF(pc).x2 = 1; markAbove(pc, "sparkle"); return; }
  if (cpu) { const v = t === "stop" ? [3, -1, 2, 0, 4, -2, 1][rnd(7)] : [3, 2, -2][rnd(3)]; showBanner(t === "stop" ? "ルーレット！" : "ふうせん わり！", 1200); await sleep(1200); await slMove(pc, v); return; }
  const had = pc.player; if (!had) pc.player = sfF(pc); // slStop / slBalloon の「サイコロ 2こ」は pc.player に しるす
  try { if (t === "stop") await slStop(pc); else await slBalloon(pc); } finally { if (!had) delete pc.player; } }
{ const lc = landChild; landChild = async function (pc = P.shima) { const t = !winner && sfAt(curStage, pc.node); if (t) { await sfRun(pc, t); return; } return lc(pc); }; }
// ライバル（がお）の ばん：場面の かわりに
{ const gs = gaoSit; gaoSit = async function (...a) { const t = sfAt(curStage, P.gao && P.gao.node); if (t) return sfRun(P.gao, t); return gs(...a); }; }
// 声
{ const lp = loadPack; loadPack = async function (id) { const r = await lp(id); if (sfShort(id) && !PACK.loaded.sfun) { try { const q = await fetch("packs/sfun.json", { cache: "no-cache" }); if (q.ok) { const d = await q.json(); Object.keys(d).forEach(k => AUD[k] = "data:audio/mpeg;base64," + d[k]); PACK.loaded.sfun = Object.keys(d); } } catch (e) { } } return r; }; }
{ const gr = gaoRoll; gaoRoll = function (...a) { let r = gr(...a); if (sfShort(curStage) && P.gao) { const F = sfF(P.gao); if (F.x2) { F.x2 = 0; r *= 2; } if (F.dice2) { F.dice2 = 0; r += 1 + rnd(3); } } return r; }; }
