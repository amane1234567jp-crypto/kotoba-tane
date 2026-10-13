/* ================= ステージごとの BGM =================
   こうしゃは いままでの 曲（sfx_bgm）。ほかの ステージは packs/<ステージ>.json の bgm_<ステージ>（mp3）。
   mp3 は 前後に 0.5びょうずつ つづきの 音が ついて いるので、loopStart=0.5・loopEnd=0.5+ながさ で つなぎめなく まわす。 */
async function stageBgm(id) {
  if (!ctx) return;
  const key = AUD["bgm_" + id] ? "bgm_" + id : "sfx_bgm";
  if (key === "sfx_bgm" && BGM.src && !BGM.key) { BGM.key = key; return; }
  if (BGM.key === key && BGM.src) return;
  let buf = null; try { buf = await voiceBuf(key); } catch (e) { }
  if (!buf && key === "sfx_bgm" && BGM.buf && !BGM.key) buf = BGM.buf;
  if (!buf) return;
  if (BGM.src) { try { BGM.src.stop(); } catch (e) { } BGM.src = null; }
  if (!BGM.gain) { BGM.gain = ctx.createGain(); BGM.gain.gain.value = BGM.on ? BGM_VOL : 0; BGM.gain.connect(ctx.destination); }
  const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; let off = 0;
  if (key !== "sfx_bgm" && BGM_LEN[id] && buf.duration > BGM_LEN[id] + .9) { s.loopStart = .5; s.loopEnd = .5 + BGM_LEN[id]; off = .5; }
  // すっと 入れかえる
  const g = ctx.createGain(); g.gain.setValueAtTime(0, ctx.currentTime); g.gain.linearRampToValueAtTime(1, ctx.currentTime + .8);
  s.connect(g).connect(BGM.gain); s.start(0, off); BGM.src = s; BGM.key = key; BGM.buf = buf;
}
{ const loadPackBgm = loadPack;
  loadPack = async function (id) { const r = await loadPackBgm(id); stageBgm(id); return r; }; }
