/* ---------- 遠隔対戦（段階2）：ビデオ通話と手の同期 ----------
   PeerJS（WebRTC）で、映像・音声・手の情報を端末どうしで直接やりとりする。
   親機（こども側、A）が部屋を作って「ホスト」になり、おばあちゃん（B）はリンクを開くだけで「ゲスト」としてつながる。
   つなぐ前の紹介役は PeerJS の公開サーバー。
   直接つながらない回線（モバイル回線どうし など）のために、中継サーバー（TURN）も使う。
   いまは Metered の無料「Open Relay」（月20GBまで、だれでも使える共有の鍵）。ストア版では自前のアカウントに切り替える。
   盤面は「手の履歴」だけで同期する。ホストの履歴を正とする。 */
const NET = (() => {
  const q = new URLSearchParams(location.search);
  const ROOM_KEY = "marushima-reversi-room";
  // 確認用：?ps=localhost:9000 で手元の紹介役サーバーを使う
  const ps = q.get("ps");
  const OPT = ps ? { host: ps.split(":")[0], port: +ps.split(":")[1], path: "/", secure: false } : {};
  const STUN = [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }];
  OPT.config = { iceServers: STUN };
  // TURN の合言葉：有効期限つきの名前と、その名前を共有の鍵で署名したもの（coturn の REST 方式）
  const TURN_HOST = "staticauth.openrelay.metered.ca", TURN_SECRET = "openrelayprojectsecret";
  async function turnServers() {
    try {
      const user = `${Math.floor(Date.now() / 1000) + 12 * 3600}:marushima`;
      const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(TURN_SECRET), { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
      const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(user)));
      const credential = btoa(String.fromCharCode(...sig));
      return [{ urls: [`turn:${TURN_HOST}:80`, `turn:${TURN_HOST}:80?transport=tcp`, `turn:${TURN_HOST}:443`, `turns:${TURN_HOST}:443?transport=tcp`], username: user, credential }];
    } catch (e) { return []; }
  }
  async function prepareIce() {
    OPT.config = { iceServers: [...STUN, ...(await turnServers())] };
    // 確認用：中継サーバーだけでつなぐ（設定「中継の テスト」）。片方がこれなら、かならず中継を通る
    if (N.relayOnly) OPT.config.iceTransportPolicy = "relay";
  }
  const idOf = room => "marushima-rv-" + room;

  const N = {
    role: q.get("r") ? "guest" : null,   // null = 1台で遊ぶ
    room: q.get("r") || null,
    peer: null, conn: null, call: null, local: null, remote: null,
    open: false, lastHeard: 0, handlers: {}, relayOnly: false, via: "",
    on(type, fn) { this.handlers[type] = fn; },
    send(msg) { if (this.conn && this.open) try { this.conn.send(msg); } catch (e) { /* 切れていたら再接続で送り直す */ } },
    get available() { return typeof Peer !== "undefined" && !!navigator.mediaDevices; },
  };
  const emit = (type, ...a) => N.handlers[type]?.(...a);

  async function camera() {
    try {
      N.local = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 320 }, height: { ideal: 240 }, frameRate: { ideal: 15 } },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch (e) { N.local = null; }
    emit("local", N.local);
    return N.local;
  }

  function adopt(conn) {
    if (N.conn && N.conn !== conn) try { N.conn.close(); } catch (e) { /* 古い接続 */ }
    N.conn = conn;
    conn.on("open", () => {
      N.open = true; N.lastHeard = Date.now(); emit("open"); setTimeout(() => route(conn), 1500);
      if (N.role === "host" && N.local) callGuest(conn.peer);
    });
    conn.on("data", m => { N.lastHeard = Date.now(); if (m && m.t !== "ping") emit("msg", m); });
    conn.on("close", () => lost(conn));
    conn.on("error", () => lost(conn));
  }
  // いまの通り道が「中継」か「直接」かを調べる（設定画面に出す）
  async function route(conn) {
    try {
      const stats = await conn.peerConnection.getStats();
      let pair = null; const local = {};
      stats.forEach(s => { if (s.type === "candidate-pair" && s.state === "succeeded" && (s.nominated || s.selected)) pair = s; if (s.type === "local-candidate") local[s.id] = s; });
      const c = pair && local[pair.localCandidateId];
      N.via = c ? (c.candidateType === "relay" ? "中継サーバー" : "直接") : "";
      emit("route", N.via);
    } catch (e) { /* 調べられなくても続ける */ }
  }
  function watchCall(call) {
    if (N.call && N.call !== call) try { N.call.close(); } catch (e) { /* 古い通話 */ }
    N.call = call;
    call.on("stream", s => { N.remote = s; emit("remote", s); });
  }
  function callGuest(id) { try { watchCall(N.peer.call(id, N.local)); } catch (e) { /* 映像なしでも対局は続ける */ } }

  function lost(conn) {
    if (conn && conn !== N.conn) return;
    if (!N.open) return;
    N.open = false; emit("lost");
    if (N.role === "guest") setTimeout(dialHost, 1500);
  }

  function makePeer(id) {
    const p = id ? new Peer(id, OPT) : new Peer(OPT);
    p.on("disconnected", () => setTimeout(() => { try { if (!p.destroyed) p.reconnect(); } catch (e) { /* 次の再試行で */ } }, 1500));
    return p;
  }

  // ホスト：部屋を作る（3時間以内なら同じ部屋をつかいなおす）
  async function host(fresh) {
    N.role = "host";
    let saved = null; try { saved = JSON.parse(localStorage.getItem(ROOM_KEY)); } catch (e) { saved = null; }
    if (!fresh && saved && Date.now() - saved.at < 3 * 3600e3) N.room = saved.room;
    else N.room = Math.random().toString(36).slice(2, 10);
    try { localStorage.setItem(ROOM_KEY, JSON.stringify({ room: N.room, at: Date.now() })); } catch (e) { /* 保存できなくても続ける */ }
    await camera(); await prepareIce();
    const start = () => {
      N.peer = makePeer(idOf(N.room));
      N.peer.on("open", () => emit("ready"));
      N.peer.on("connection", adopt);
      N.peer.on("call", c => { c.answer(N.local || undefined); watchCall(c); });
      N.peer.on("error", e => { if (e.type === "unavailable-id") { N.peer.destroy(); setTimeout(start, 3000); } else emit("error", e.type); });
    };
    start();
  }
  // ゲスト：リンクの部屋につなぐ
  async function guest() {
    await camera(); await prepareIce();
    N.peer = makePeer(null);
    N.peer.on("open", dialHost);
    N.peer.on("call", c => { c.answer(N.local || undefined); watchCall(c); });
    N.peer.on("error", e => { if (e.type === "peer-unavailable") setTimeout(dialHost, 3000); else emit("error", e.type); });
  }
  function dialHost() {
    if (N.open || !N.peer || N.peer.destroyed) return;
    if (N.peer.disconnected) { try { N.peer.reconnect(); } catch (e) { /* 再試行 */ } setTimeout(dialHost, 3000); return; }
    adopt(N.peer.connect(idOf(N.room), { serialization: "json", reliable: true }));
    setTimeout(() => { if (!N.open) dialHost(); }, 6000);
  }

  // 生きているかの合図。12秒なにも届かなければ切れたとみなす（iPad が眠ったときなど）
  setInterval(() => {
    if (!N.open) return;
    N.send({ t: "ping" });
    if (Date.now() - N.lastHeard > 12000) { const c = N.conn; lost(c); try { c.close(); } catch (e) { /* もう切れている */ } }
  }, 4000);

  N.host = host; N.guest = guest;
  // openExternalBrowser=1：LINE の中のブラウザではなく Safari／Chrome で開かせる（LINE の中ではカメラが使えないことがある）
  N.inviteURL = () => location.origin + location.pathname + "?r=" + N.room + (ps ? "&ps=" + ps : "") + "&openExternalBrowser=1";
  return N;
})();
