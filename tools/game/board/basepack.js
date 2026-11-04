/* ================= ページに うめこまない 声（packs/base.json）（2026-11-04） =================
   メモリの すくない iPad で Safari が おちたので、ページを かるく した。コースで つかう きょうつうの 声（盤の しかけ・とおせんぼ・
   ライバル・こうしゃの 場面 など）は base.json に わけ、さいしょに コースを はじめる ときに 1かいだけ 読みこむ（PACK.loaded には いれない＝手ばなさない）。 */
let BASE_P = null;
function baseLoad() { return BASE_P || (BASE_P = (async () => { for (let t = 0; t < 3; t++) { try { const r = await fetch("packs/base.json", { cache: "no-cache" }); if (r.ok) { const d = await r.json(); Object.keys(d).forEach(k => { if (!AUD[k]) AUD[k] = "data:audio/mpeg;base64," + d[k]; }); return true; } } catch (e) { } await sleep(800); } BASE_P = null; return false; })()); }
{ const lp = loadPack; loadPack = async function (id) { await baseLoad(); return lp(id); }; }
