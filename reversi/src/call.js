/* ---------- よびだし（2026-11-07）：一度つながった相手を、通知で直接よぶ ----------
   Web Push を使う。中継は Supabase（uchinoaji プロジェクト）の Edge Function「rv-push」。
   端末ごとに id と secret をこの端末で作って覚える（ログインなし）。つながったときに おたがいの id を教えあう。
   - Android：Chrome のままで通知が届く
   - iPhone・iPad：「ホーム画面に追加」したアイコンから開いたときだけ届く（iOS 16.4 以降）。
     ホーム画面のアプリは Safari と保存場所が別なので、追加する前に「引っこし用のリンク」に切り替えて、
     登録した相手や部屋をそのまま持っていく（?setup=…。アイコンで初めて開いたときに一度だけ読みこむ）
   ストア版（Capacitor）では、ここを ネイティブの通知（APNs／FCM）に差しかえる。 */
const CALL = (() => {
  const API = "https://rlqeoyvevaglwngxtvrw.supabase.co/functions/v1/rv-push";
  const VAPID = "BNR0O2kVDy02vPUZJ5m8Uuz6BRhgXChA3sUmOwxcGPzUDVLj2OtjjN8UftIlT2P1AuSzOLSB75aCyU9dd0-_7HY";
  const DEV_KEY = "marushima-reversi-dev", MOVE_KEYS = ["marushima-reversi-cfg", "marushima-reversi-room", "marushima-reversi-partners", "marushima-reversi-callers", "marushima-reversi-remote", DEV_KEY];
  const rnd = n => { const a = new Uint8Array(n); crypto.getRandomValues(a); return Array.from(a, b => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[b % 62]).join(""); };
  const get = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } };
  const q = new URLSearchParams(location.search);

  // ホーム画面のアイコンで初めて開いたとき：引っこし用のリンクの中身を読みこむ（この端末にまだ何もないときだけ）
  (function importSetup() {
    const s = q.get("setup"); if (!s) return;
    try {
      if (get(DEV_KEY)) return;
      const data = JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/")))));
      for (const k of MOVE_KEYS) if (data[k] != null) localStorage.setItem(k, JSON.stringify(data[k]));
    } catch (e) { /* 読めなければ ふつうに始める */ }
  })();

  let dev = get(DEV_KEY);
  if (!dev || !dev.id) { dev = { id: rnd(22), secret: rnd(32), push: false }; put(DEV_KEY, dev); }
  const save = () => put(DEV_KEY, dev);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  // アプリ版（Expo の殻の中）：通知はアプリ（APNs／FCM → Expo）で受けとる。window.RVNative は殻が入れる
  const NATIVE = !!window.RVNative;
  const canPush = NATIVE ? window.RVNative.push !== false : ("serviceWorker" in navigator && "PushManager" in window && "Notification" in window);
  const C = {
    get id() { return dev.id; },
    get on() { return NATIVE ? !!dev.expo : (!!dev.push && canPush && Notification.permission === "granted"); },
    isIOS, standalone, canPush, native: NATIVE,
    // iPhone・iPad の Safari では 通知が使えない → まずホーム画面に追加（アプリ版は不要）
    get needsHome() { return !NATIVE && isIOS && !standalone; },
    get blocked() { return NATIVE ? dev.pushDenied === true : (canPush && Notification.permission === "denied"); },
  };
  // 殻との やりとり（web → app は postMessage、app → web は window.RV.native(msg)）
  const toApp = m => { try { window.ReactNativeWebView.postMessage(JSON.stringify(m)); } catch (e) { } };
  let tokenWait = null;
  window.RV = window.RV || {};
  let mediaWait = null;
  window.RV.askMedia = () => new Promise(res => { mediaWait = res; toApp({ t: "needMedia" }); setTimeout(() => { if (mediaWait) { mediaWait(); mediaWait = null; } }, 20000); });
  window.RV.native = m => {
    if (!m) return;
    if (m.t === "media") { if (mediaWait) { mediaWait(); mediaWait = null; } }
    if (m.t === "token") { dev.pushDenied = false; if (m.expo && m.expo !== dev.expo) { dev.expo = m.expo; save(); } if (tokenWait) { tokenWait(m.expo || null); tokenWait = null; } }
    if (m.t === "denied") { dev.pushDenied = true; dev.expo = ""; save(); if (tokenWait) { tokenWait(null); tokenWait = null; } }
  };
  async function post(body) {
    const r = await fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.assign({ id: dev.id, secret: dev.secret }, body)) });
    return r.json().catch(() => ({}));
  }
  const b64 = s => { const p = "=".repeat((4 - s.length % 4) % 4), raw = atob((s + p).replace(/-/g, "+").replace(/_/g, "/")); return Uint8Array.from(raw, c => c.charCodeAt(0)); };
  async function swReg() { return navigator.serviceWorker.register("sw.js", { scope: "./" }); }

  // 「よびだしを うけとる」：通知を許可してもらい、宛先を中継に登録する（ボタンを押したときに呼ぶ）
  C.enable = async name => {
    if (NATIVE) {
      const expo = await new Promise(res => { tokenWait = res; toApp({ t: "needPush" }); setTimeout(() => { if (tokenWait) { tokenWait(null); tokenWait = null; } }, 15000); });
      if (!expo) return { ok: false, why: dev.pushDenied ? "通知が「許可しない」になっています。設定アプリで このアプリの通知を許可してください" : "通知の登録が できませんでした" };
      const r = await post({ op: "reg", name: name || "", expo }).catch(() => ({}));
      if (!r.ok) return { ok: false, why: "登録できませんでした" + (r.error ? "（" + r.error + "）" : "") };
      return { ok: true };
    }
    if (!canPush) return { ok: false, why: "この端末では使えません" };
    const perm = await Notification.requestPermission();
    if (perm !== "granted") return { ok: false, why: perm === "denied" ? "通知が「許可しない」になっています" : "通知が許可されませんでした" };
    try {
      const reg = await swReg(); await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(VAPID) });
      const r = await post({ op: "reg", name: name || "", sub: sub.toJSON() });
      if (!r.ok) return { ok: false, why: "登録できませんでした" + (r.error ? "（" + r.error + "）" : "") };
      dev.push = true; save();
      return { ok: true };
    } catch (e) { return { ok: false, why: "登録できませんでした（" + String(e && e.message || e).slice(0, 60) + "）" }; }
  };
  // 開くたびに 宛先と名前を登録しなおす（購読は ときどき 入れかわる）
  C.refresh = async name => {
    try {
      if (NATIVE) { if (dev.expo) await post({ op: "reg", name: name || "", expo: dev.expo }); else { await post({ op: "reg", name: name || "" }); toApp({ t: "pushIfGranted" }); } return; }
      if ("serviceWorker" in navigator) swReg().catch(() => { });   // ホーム画面に追加できるように いつも入れておく
      if (!C.on) { await post({ op: "reg", name: name || "" }); return; }
      const reg = await swReg(); const sub = await reg.pushManager.getSubscription();
      await post({ op: "reg", name: name || "", sub: sub ? sub.toJSON() : null, clear: !sub });
      if (!sub) { dev.push = false; save(); }
    } catch (e) { /* 通信できなくても遊べる */ }
  };
  C.off = async () => {
    if (NATIVE) { dev.expo = ""; save(); post({ op: "reg", clear: true }).catch(() => { }); return; }
    try { const reg = await navigator.serviceWorker.getRegistration(); const sub = reg && await reg.pushManager.getSubscription(); if (sub) await sub.unsubscribe(); } catch (e) { }
    dev.push = false; save(); post({ op: "reg", clear: true }).catch(() => { });
  };
  // 相手をよぶ。url は 相手が通知をタップしたときに開く場所
  C.ring = async (to, name, url) => {
    if (!to) return { ok: false, reason: "noid" };
    try {
      return await post({ op: "call", to, tag: "rv-call", title: "まるシマリバーシ", body: `${name || "あいて"}から よびだしです。タップして はじめてね`, url });
    } catch (e) { return { ok: false, reason: "net" }; }
  };
  C.toApp = toApp;
  C.cancel = to => { if (to) post({ op: "cancel", to, tag: "rv-call" }).catch(() => { }); };
  // 引っこし用のリンク（iPhone・iPad で ホーム画面に追加する前に、この URL に切り替える）
  C.setupURL = () => {
    const data = {}; for (const k of MOVE_KEYS) { const v = get(k); if (v != null) data[k] = v; }
    const s = btoa(unescape(encodeURIComponent(JSON.stringify(data)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return location.origin + location.pathname + "?setup=" + s;
  };
  return C;
})();
