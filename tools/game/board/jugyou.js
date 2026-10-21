/* ================= ロングコース「じゅぎょうの いちにち」（jugyou、2026-10-21） =================
   ちょうロングの しくみ（slong.js）の うえに のせる。48マス・4だん＝1じかんめ こくご → 2じかんめ さんすう → 3じかんめ おんがく・ずこう → 4じかんめ たいいく → ゴール（きゅうしょく）。
   課題は ショートコースの 場面・声を そのまま つかう（こくご・さんすう・おんがく・ずこう・たいいく・とけい・がっこう2・せんせい1・となりの せき）。
   順位が いれかわる しかけ：🪑せきがえくじ（みんなの ばしょを シャッフル）・🔄となりの せきと こうたい（すぐ まえの ひとと こうかん）・💯テスト100てん（1いの すぐ うしろへ）
   ＋ ✊ドッジボールじゃんけん・🍛きゅうしょくとうばん・🔔チャイム（みんな あつまれ）・🎒わすれもの（3マス もどる）・📝しゅくだいわすれ（1かい やすみ）。
   盤の みぎうえに 順位札（1い・2い…）。いれかわると 札が うごいて 入れ替わる。声：sit/jugyou_gen.py → sit/pony_jugyou.json → packs/jugyou.json */
const JGS = "jugyou";
const jgT = k => JG.txt[k] || "";
/* ---------- マスの ならび（48マス・1だん 12マス） ---------- */
{ const PL = [null, "jk", "jk", "e:wasure", "jk", "jj", "e:kotai", "jk", "jc", "jk", "e:sekigae", "jk",
    "js", "js", "e:test100", "jj", "js", "e:shukudai", "js", "jc", "js", null, "e:dodge", "js",
    "jo", "jz", "e:toban", "jo", "jc", "jz", "e:kotai", "jo", "jz", "e:chime", "jo", "jz",
    "jt", "jt", "e:sekigae", "jt", "jc", "e:test100", "jt", "jj", "e:wasure", "jt", "jt", null];
  const O = SL_ORDER[JGS], ev = {}, task = {};
  O.forEach((id, i) => { const p = PL[i]; if (!p || id === "0" || id === "4" || id === "15") return;
    if (p.startsWith("e:")) { const t = p.slice(2); ev[id] = [t, 0, `jg_ev_${t}`, jgT(`jg_ev_${t}`)]; } else task[id] = p; });
  EVENTS[JGS] = ev; LONG_TASKS[JGS] = task;
  LEGENDS[JGS] = [["jk", "こくご"], ["js", "さんすう"], ["jo", "おんがく"], ["jz", "ずこう"], ["jt", "たいいく"], ["jc", "とけい"], ["jj", "じゅぎょう"]]; }
Object.assign(LTASK, { jk: ["#FFE9D6", "📖"], js: ["#D6E8FF", "🔢"], jo: ["#EBDDFF", "🎵"], jz: ["#FFE0EE", "🎨"], jt: ["#D7F0D2", "⚽"], jc: ["#FFF3B8", "🕐"], jj: ["#FFFFFF", "🙋"] });
Object.assign(SL_ICON, { sekigae: "🪑", kotai: "🔄", test100: "💯", dodge: "✊", toban: "🍛", chime: "🔔", wasure: "🎒", shukudai: "📝" });
Object.assign(SL_EVC, { sekigae: "#FFE27A", kotai: "#FFE27A", test100: "#C9EBB5", dodge: "#FFE27A", toban: "#FFE27A", chime: "#FFE27A", wasure: "#FFC2D1", shukudai: "#FFC2D1" });
const jgArea = id => Math.min(4, Math.floor(SL_ORDER[JGS].indexOf(id) / 12) + 1);

/* ---------- 課題：ショートコースの 場面を よぶ ---------- */
// [ステージ, ばしょ（にている ばしょから えらぶ）, おもみ]
const JG_SRC = {
  jk: [["kokugo", "きょうしつ", 4], ["gakkou2", "きょうしつ", 1], ["gakkou2", "としょしつ", 1], ["seki1", "こくご", 1], ["sensei1", "こくご", 1]],
  jo: [["ongaku", "おんがくしつ", 4], ["gakkou2", "おんがくしつ", 1]],
  jz: [["zukou", "ずこうしつ", 4], ["gakkou2", "ずこうしつ", 1]],
  jt: [["taiiku", "こうてい", 3], ["taiiku", "たいいくかん", 2], ["gakkou2", "たいいくかん", 1]],
  jj: { 1: [["seki1", "こくご", 1], ["sensei1", "こくご", 1]], 2: [["seki1", "さんすう", 1], ["sensei1", "さんすう", 1]], 3: [["sensei1", "ずこうしつ", 1], ["seki1", "こくご", 1]], 4: [["seki1", "さんすう", 1], ["sensei1", "こくご", 1]] },
};
let JG_ST = null, JG_TKZ = null;
function jgPick(list) { const tot = list.reduce((a, x) => a + x[2], 0); let r = Math.random() * tot; for (const x of list) { r -= x[2]; if (r < 0) return x; } return list[0]; }
// 場面は その ステージの なかから えらぶ（えらぶ あいだだけ curStage を かえる）
{ const ps = pickSit; pickSit = function (place, heroKind = "shima") { if (curStage !== JGS || !JG_ST) return ps(place, heroKind); curStage = JG_ST; try { return ps(place, heroKind); } finally { curStage = JGS; } }; }
// とけいの へや：1〜2じかんめは あさ、3〜4じかんめは ひる
{ const zo = zoneOf; zoneOf = function (id) { if (curStage === JGS && JG_TKZ) return JG_TKZ; return zo(id); }; }
// 声の パック：コースの パック＋ その ステージの パックを はじめて つかう ときに よみこむ（ぜんぶ さきに よむと おもいので）
async function jgNeed(st) { if (PACK.loaded[st]) return; try { const q = await fetch(`packs/${st}.json`, { cache: "no-cache" }); if (q.ok) { const d = await q.json(); Object.keys(d).filter(k => !k.startsWith("bgm_")).forEach(k => AUD[k] = "data:audio/mpeg;base64," + d[k]); PACK.loaded[st] = Object.keys(d); } } catch (e) { /* なくても あそべる */ } }
{ const lp = loadPack; loadPack = async function (id) { if (id !== JGS) return lp(id);
    Object.keys(PACK.loaded).forEach(s => { if (s !== id) { PACK.loaded[s].forEach(k => delete AUD[k]); delete PACK.loaded[s]; } });
    await jgNeed(JGS); await jgNeed("kokugo"); if (AUD["bgm_" + JGS]) await voiceBuf("bgm_" + JGS); return true; }; }
async function jgScene(pc, code) {
  const src = Array.isArray(JG_SRC[code]) ? JG_SRC[code] : JG_SRC[code][jgArea(pc.node)];
  let [st, place] = jgPick(src); // その ばしょの 場面が もう ない ときは、いちばん おおい ところ（さいしょの もの）から
  if (!SITS.some(s => s.stage === st && s.place === place && !sitUsed.has(s.id))) [st, place] = src[0];
  await jgNeed(st); JG_ST = st; let ok = false;
  try { ok = await runSit(place, pc.kind); } finally { JG_ST = null; }
  if (ok) GS.ok--; // runSit が もう かぞえて いる（そとで もう いちど たす ので）
  return ok; }
async function jgSansu(pc) { await jgNeed("sansu"); const ok = await runSansu(pc); if (ok) GS.ok--; return ok; }
async function jgTokei(pc) { await jgNeed("tokei"); JG_TKZ = jgArea(pc.node) <= 2 ? "あさ" : "ひる"; let ok = false; try { ok = await runTokei(pc); } finally { JG_TKZ = null; } if (ok) GS.ok--; return ok; }
Object.assign(LTASK_RUN, { jk: pc => jgScene(pc, "jk"), jo: pc => jgScene(pc, "jo"), jz: pc => jgScene(pc, "jz"), jt: pc => jgScene(pc, "jt"), jj: pc => jgScene(pc, "jj"), js: jgSansu, jc: jgTokei });

/* ---------- じかんわりの アナウンス（だれかが はじめて その だんに はいった とき） ---------- */
let JG_AREA = 0;
{ const ap = applyStage; applyStage = function (id, ...a) { if (id === JGS) JG_AREA = 0; return ap(id, ...a); }; }
async function jgBell() { for (const [f, t] of [[659, 0], [523, 350], [587, 700], [392, 1050], [392, 1600], [587, 1950], [659, 2300], [523, 2650]]) later(t, () => blip(f, f, .32, "sine")); }
async function jgAreaCheck(pc) { const a = jgArea(pc.node); if (a <= JG_AREA) return; JG_AREA = a;
  jgBell(); showBanner(SL_TH[JGS].areas[a - 1] + "！", 1800); await speak(C.pony, `jg_area${a}`, jgT(`jg_area${a}`)); }

/* ---------- 順位が いれかわる しかけ ---------- */
const jgRank = () => PLAYERS.map(p => p.pc).sort((a, b) => slIdx(b.node) - slIdx(a.node));
async function jgSekigae(pc) {
  const ps = PLAYERS.map(p => p.pc), n = ps.length, g = panel("🪑 せきがえ くじ", "#FFFBE6");
  const W = 230, x0 = 800 - n * (W + 30) / 2 + 15, boxes = ps.map((o, i) => { const b = el("g", { style: "cursor:pointer" }, g), x = x0 + i * (W + 30);
    el("rect", { x, y: 330, width: W, height: 300, rx: 30, fill: ["#FF8FA3", "#7FCBF0", "#FFD25E", "#7BD389"][i % 4], ...S6(6) }, b); txt(b, x + W / 2, 520, "？", 150, { "text-anchor": "middle", fill: "#FFFFFF" }); return b; });
  if (pc.player && !pc.player.cpu) { await speak(C.pony, "jg_sk_pick", jgT("jg_sk_pick"));
    await new Promise(res => { let done = false; const fin = () => { if (done) return; done = true; res(); }; boxes.forEach(b => b.onpointerdown = fin); later(12000, fin); }); }
  else await sleep(900);
  for (let i = 0; i < 10; i++) { boxes.forEach((b, j) => b.setAttribute("opacity", (i + j) % 2 ? .5 : 1)); blip(600 + i * 40, 700, .05, "square"); await sleep(110); }
  boxes.forEach(b => b.setAttribute("opacity", 1));
  // みんなの いまの ばしょを シャッフル（なるべく ぜんいん うごく）
  const nodes = ps.map(o => o.node); let perm = ps.map((_, i) => i);
  for (let t = 0; t < 20; t++) { perm = shuffle(perm.slice()); if (perm.every((j, i) => nodes[j] !== nodes[i] || n === 1)) break; }
  ps.forEach((o, i) => { const to = nodes[perm[i]], k = slIdx(to) - slIdx(o.node); txt(g, x0 + i * (W + 30) + W / 2, 700, NAMES[o.kind], 40, { "text-anchor": "middle" });
    txt(g, x0 + i * (W + 30) + W / 2, 780, k > 0 ? `⬆ ${k}マス` : k < 0 ? `⬇ ${-k}マス` : "そのまま", 44, { "text-anchor": "middle", fill: k > 0 ? "#2E9E4A" : k < 0 ? "#D9443A" : INK }); });
  boom(.3); await sleep(1800); g.remove();
  if (perm.every((j, i) => nodes[j] === nodes[i])) { await speak(C.pony, "jg_sk_same", jgT("jg_sk_same")); return; }
  await Promise.all(ps.map((o, i) => nodes[perm[i]] !== o.node ? warpTo(o, nodes[perm[i]]) : null)); confetti(50);
  await speak(C.pony, "jg_sk_done", jgT("jg_sk_done")); }
async function jgKotai(pc) {
  const ahead = others(pc).filter(o => slIdx(o.node) > slIdx(pc.node)).sort((a, b) => slIdx(a.node) - slIdx(b.node))[0];
  if (!ahead) { await speak(C.pony, "jg_kt_top", jgT("jg_kt_top")); return; }
  const p1 = pc.node, p2 = ahead.node; await Promise.all([warpTo(pc, p2), warpTo(ahead, p1)]); confetti(30); }
async function jgTest100(pc) {
  const lead = jgRank()[0];
  if (lead === pc || slIdx(lead.node) === slIdx(pc.node)) { await speak(C.pony, "jg_t100_top", jgT("jg_t100_top")); await slGo(pc, 3); return; }
  const to = SL_ORDER[JGS][slIdx(lead.node) - 1];
  if (slIdx(to) <= slIdx(pc.node)) { await speak(C.pony, "jg_t100_near", jgT("jg_t100_near")); await slGo(pc, 2); return; }
  const g = el("g", {}, hudLayer); const st = slam("💯 100てん！", 330, 160, "#E8473C"); later(1500, () => st.remove()); g.remove();
  await warpTo(pc, to); confetti(50); }
{ const be = boardEvent; boardEvent = async function (pc) {
    if (curStage !== JGS) return be(pc);
    if (pc.player && pc.player.stay) return;
    await jgAreaCheck(pc);
    const ev = EVENTS[JGS][pc.node]; if (!ev) return;
    const [type, , key, text] = ev;
    await sleep(300); markAbove(pc, "ex"); chime(); await slSay(key, text);
    if (type === "sekigae") await jgSekigae(pc);
    else if (type === "kotai") await jgKotai(pc);
    else if (type === "test100") await jgTest100(pc);
    else if (type === "dodge") await slJanken(pc);
    else if (type === "toban") { const last = others(pc).filter(o => slIdx(o.node) < slIdx(pc.node)).sort((a, b) => slIdx(a.node) - slIdx(b.node))[0]; if (last) await warpTo(last, pc.node); else await speak(C.pony, "lk_ev_call_none", "うしろに だれも いないね"); }
    else if (type === "chime") { jgBell(); for (const o of others(pc)) { jump(o, .6); await warpTo(o, pc.node); } confetti(40); }
    else if (type === "wasure") { markAbove(pc, "drop"); await slGo(pc, -3); }
    else if (type === "shukudai") { slFlag(pc, "rest"); markAbove(pc, "z", { i: 1 }); }
    await sleep(300); }; }

/* ---------- 順位札（盤の みぎうえ）：いれかわると 札が うごく ---------- */
let JG_RK = null;
function jgRankTick() {
  const on = curStage === JGS && typeof PLAYERS !== "undefined" && PLAYERS.length > 1 && boardLayer.style.display !== "none" && view !== "scene";
  if (!on) { if (JG_RK) { JG_RK.g.remove(); JG_RK = null; } return; }
  if (!JG_RK || !JG_RK.g.isConnected) { const g = el("g", {}, hudLayer), items = {};
    PLAYERS.forEach(p => { const it = el("g", {}, g); const r = el("rect", { x: 0, y: 0, width: 270, height: 42, rx: 21, fill: "#FFFFFF", ...S6(4) }, it);
      const n = txt(it, 44, 31, "", 26, { "text-anchor": "middle" }), nm = txt(it, 170, 31, NAMES[p.kind], 24, { "text-anchor": "middle" }); items[p.kind] = { it, r, n, y: null }; });
    JG_RK = { g, items, order: "" }; }
  const rk = jgRank(), order = rk.map(o => o.kind).join(",");
  if (order === JG_RK.order) return;
  const first = JG_RK.order === ""; JG_RK.order = order;
  const MED = ["#FFD25E", "#D9DEE6", "#E8B38A", "#FFFFFF"];
  rk.forEach((o, i) => { const it = JG_RK.items[o.kind]; if (!it) return; const y1 = 176 + i * 46, y0 = it.y == null ? y1 : it.y; it.y = y1;
    it.r.setAttribute("fill", MED[Math.min(3, i)]); it.n.textContent = `${i + 1}い`;
    if (first || y0 === y1) it.it.setAttribute("transform", `translate(1170 ${y1})`);
    else tween(600, k => it.it.setAttribute("transform", `translate(${1170 - Math.sin(k * Math.PI) * 60} ${(y0 + (y1 - y0) * k).toFixed(1)})`)); });
  if (!first) { blip(700, 1100, .12, "square"); later(150, () => blip(1100, 1500, .12, "square")); }
}
setInterval(jgRankTick, 400);

/* ---------- 盤の え：じかんわりの ような 4だん ---------- */
BOARD_BG[JGS] = L => {
  const T = SL_TH[JGS]; el("rect", { x: 0, y: 0, width: 1600, height: 1000, fill: T.ground }, L);
  for (let x = 0; x < 1600; x += 80) el("path", { d: `M${x} 0 V1000`, stroke: "#00000008", "stroke-width": 2 }, L);
  const Y = [930, 765, 600, 435], I4 = ["📖", "🔢", "🎵", "⚽"];
  Y.forEach((y, r) => { el("rect", { x: 30, y: y - 70, width: 1540, height: 140, rx: 70, fill: T.fills[r], ...S6(4) }, L);
    const x = r === 3 ? 1520 : 80; txt(L, x, y + 6, I4[r], 46, { "text-anchor": "middle" }); txt(L, x, y + 44, `${r + 1}じかんめ`, 18, { "text-anchor": "middle" }); });
  // こくばん（コースの なまえ）と きゅうしょく（ゴール）
  el("rect", { x: 470, y: 180, width: 660, height: 130, rx: 14, fill: "#2F6B4F", stroke: "#8B5A2B", "stroke-width": 14 }, L);
  txt(L, 800, 262, `${T.icon} ${T.name}`, 46, { "text-anchor": "middle", fill: "#FFFFFF" });
  [["✏️", 150, 300], ["📏", 330, 250], ["🎒", 1520, 200]].forEach(([e, x, y]) => txt(L, x, y, e, 54, { "text-anchor": "middle", opacity: .85 }));
};
