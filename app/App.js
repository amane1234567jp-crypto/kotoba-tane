// ことばのたね アプリ：ゲーム本体（index.html）を WebView で うごかし、ブラウザに ない ものを アプリ側で てつだう。
//   ・音声認識（ブラウザの SpeechRecognition の かわりに iOS / Android の 音声認識）
//   ・100円の「ぜんぶ ひらく」の 購入・復元
//   ・声の パック（packs/*.json）：はじめて あそぶ コースの ときに 公開ページから とりよせて 保存（2かいめからは ネットなしで）
//   ・「おわる」ボタン（Android は アプリを とじる。iOS は とじない きまりなので「またね」の 画面）
import { useEffect, useRef, useState } from "react";
import { View, BackHandler, Platform, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { WebView } from "react-native-webview";
import { Asset } from "expo-asset";
import * as FS from "expo-file-system/legacy";
import { activateKeepAwakeAsync } from "expo-keep-awake";
import * as SplashScreen from "expo-splash-screen";
import { ExpoSpeechRecognitionModule as SR } from "expo-speech-recognition";
import * as IAP from "expo-iap";
import WEB_VER from "./assets/web/version.json";

SplashScreen.preventAutoHideAsync().catch(() => {});
const PAGES = "https://amane1234567jp-crypto.github.io/kotoba-tane/";
const SKU = "kotoba_tane_all";
const WEB = FS.documentDirectory + "web/";

// WebView の 中で ページより 先に うごく しかけ
const BRIDGE = `(function(){
  var RN = window.ReactNativeWebView, cb = {}, n = 0;
  function post(o){ RN.postMessage(JSON.stringify(o)); }
  function call(t, a){ return new Promise(function(r){ var id = ++n; cb[id] = r; post({ t: t, id: id, a: a || null }); }); }
  window.__ktReply = function(id, v){ var f = cb[id]; delete cb[id]; if (f) f(v); };
  window.KT_APP = { platform: ${JSON.stringify(Platform.OS)}, buy: function(){ return call("buy"); }, restore: function(){ return call("restore"); }, owned: function(){ return call("owned"); }, exit: function(){ return call("exit"); } };
  // 声の パック：アプリが 保存した ファイルを よむ
  var f0 = window.fetch.bind(window);
  window.fetch = function(u, o){
    if (typeof u === "string") { var m = u.match(/^(?:\\.\\/)?packs\\/([\\w-]+)\\.json(?:\\?v=(\\w+))?/);
      if (m) return call("pack", { name: m[1], v: m[2] || "" }).then(function(p){
        if (!p) return new Response("", { status: 504 });
        return new Promise(function(res){ var x = new XMLHttpRequest(); x.open("GET", p); x.onload = function(){ res(new Response(x.responseText, { status: 200, headers: { "content-type": "application/json" } })); }; x.onerror = function(){ res(new Response("", { status: 504 })); }; x.send(); }); }); }
    return f0(u, o); };
  // 音声認識：ブラウザの SpeechRecognition と おなじ つかいかた
  var sid = 0, live = {};
  function SRec(){ this.lang = "ja-JP"; this.interimResults = false; this.maxAlternatives = 1; this.continuous = false; }
  SRec.prototype.start = function(){ this.sid = ++sid; live[this.sid] = this; post({ t: "sr", a: { op: "start", sid: this.sid, lang: this.lang, interim: !!this.interimResults, maxAlt: this.maxAlternatives || 1, continuous: !!this.continuous } }); };
  SRec.prototype.stop = function(){ post({ t: "sr", a: { op: "stop", sid: this.sid } }); };
  SRec.prototype.abort = function(){ post({ t: "sr", a: { op: "abort", sid: this.sid } }); };
  window.__ktSR = function(s, ev, d){ var r = live[s]; if (!r) return;
    if (ev === "result") { var alts = (d.results || []).map(function(x){ return { transcript: x.transcript || "", confidence: x.confidence || 0 }; }); alts.isFinal = !!d.isFinal; if (r.onresult) r.onresult({ results: [alts], resultIndex: 0 }); }
    else if (ev === "error") { if (r.onerror) r.onerror({ error: d.error, message: d.message || "" }); }
    else if (ev === "start") { if (r.onstart) r.onstart(); }
    else if (ev === "end") { delete live[s]; if (r.onend) r.onend(); } };
  window.SpeechRecognition = window.webkitSpeechRecognition = SRec;
  // マイクは アプリ側の 音声認識が つかうので、ページからは ひらかない
  if (navigator.mediaDevices) navigator.mediaDevices.getUserMedia = function(){ return Promise.resolve(new MediaStream()); };
  true; })();`;

// ゲーム本体を 書きこみできる 場所へ（パックと おなじ フォルダに おくと、ページから ファイルとして よめる）
async function prepareWeb() {
  await FS.makeDirectoryAsync(WEB + "packs/", { intermediates: true }).catch(() => {});
  const vf = WEB + "version.txt"; const have = await FS.readAsStringAsync(vf).catch(() => "");
  if (have !== WEB_VER.ver || !(await FS.getInfoAsync(WEB + "index.html")).exists) {
    const a = Asset.fromModule(require("./assets/web/index.html")); await a.downloadAsync();
    await FS.deleteAsync(WEB + "index.html", { idempotent: true }); await FS.copyAsync({ from: a.localUri, to: WEB + "index.html" });
    await FS.writeAsStringAsync(vf, WEB_VER.ver); }
  return WEB + "index.html"; }

const packJobs = {};
function getPack({ name, v }) { const key = name + "@" + v; return packJobs[key] || (packJobs[key] = loadPack(name, v).finally(() => delete packJobs[key])); }
async function loadPack(name, v) {
  const file = WEB + "packs/" + name + ".json", meta = WEB + "packs/" + name + ".ver";
  const has = (await FS.getInfoAsync(file)).exists, ver = has ? await FS.readAsStringAsync(meta).catch(() => "") : "";
  if (has && (!v || ver === v)) return file;
  try { const tmp = file + ".dl"; const r = await FS.downloadAsync(PAGES + "packs/" + name + ".json?v=" + v, tmp);
    if (r.status !== 200) throw new Error("http " + r.status);
    await FS.deleteAsync(file, { idempotent: true }); await FS.moveAsync({ from: tmp, to: file }); await FS.writeAsStringAsync(meta, v); return file;
  } catch (e) { return has ? file : null; } } // ネットが ない ときは ふるい 版でも つかう

// 購入
let iapReady = null;
const iapInit = () => iapReady || (iapReady = IAP.initConnection().catch(e => { iapReady = null; throw e; }));
async function owned() { try { await iapInit(); const ps = await IAP.getAvailablePurchases(); const p = ps.find(x => x.productId === SKU);
    if (p) { try { await IAP.finishTransaction({ purchase: p, isConsumable: false }); } catch (e) { } } return { ok: !!p }; } catch (e) { return { ok: false, err: String(e && e.message || e) }; } }
async function buy() {
  try { await iapInit(); await IAP.fetchProducts({ skus: [SKU], type: "in-app" }); } catch (e) { return { ok: false, err: String(e && e.message || e) }; }
  return new Promise(res => { let done = false;
    const fin = v => { if (done) return; done = true; a.remove(); b.remove(); res(v); };
    const a = IAP.purchaseUpdatedListener(async p => { if (p.productId !== SKU) return; try { await IAP.finishTransaction({ purchase: p, isConsumable: false }); } catch (e) { } fin({ ok: true }); });
    const b = IAP.purchaseErrorListener(async e => { if (e && e.code === "already-owned") return fin(await owned()); fin({ ok: false, cancel: e && e.code === "user-cancelled", err: e && e.code }); });
    IAP.requestPurchase({ request: { apple: { sku: SKU }, google: { skus: [SKU] } }, type: "in-app" }).catch(e => fin({ ok: false, err: String(e && e.message || e) })); }); }

export default function App() {
  const web = useRef(null); const [uri, setUri] = useState(null);
  const js = s => web.current && web.current.injectJavaScript(s + ";true;");
  const reply = (id, v) => js(`window.__ktReply(${id},${JSON.stringify(v === undefined ? null : v)})`);
  // 音声認識：まえの きき取りが おわってから つぎを はじめる
  const sr = useRef({ cur: 0, busy: false, next: null, perm: null }).current;
  const srStart = async o => {
    if (sr.perm === null) { try { sr.perm = (await SR.requestPermissionsAsync()).granted; } catch (e) { sr.perm = false; } }
    if (!sr.perm) { js(`window.__ktSR(${o.sid},"error",{error:"not-allowed"});window.__ktSR(${o.sid},"end",{})`); return; }
    sr.cur = o.sid; sr.busy = true;
    try { SR.start({ lang: o.lang || "ja-JP", interimResults: o.interim, maxAlternatives: o.maxAlt, continuous: false, iosTaskHint: "confirmation",
        iosCategory: { category: "playAndRecord", categoryOptions: ["defaultToSpeaker", "allowBluetooth", "mixWithOthers"], mode: "default" },
        androidIntentOptions: { EXTRA_LANGUAGE_MODEL: "web_search" } });
    } catch (e) { sr.busy = false; js(`window.__ktSR(${o.sid},"end",{})`); } };
  useEffect(() => {
    const L = [
      SR.addListener("start", () => js(`window.__ktSR(${sr.cur},"start",{})`)),
      SR.addListener("result", e => js(`window.__ktSR(${sr.cur},"result",${JSON.stringify({ results: (e.results || []).map(r => ({ transcript: r.transcript, confidence: r.confidence })), isFinal: e.isFinal })})`)),
      // 「きこえなかった」以外の まちがいで ゲームが 音声認識を あきらめない ように、こまかい ものは「no-speech」に まとめる
      SR.addListener("error", e => { const real = ["not-allowed", "service-not-allowed", "language-not-supported"].includes(e.error); js(`window.__ktSR(${sr.cur},"error",${JSON.stringify({ error: real ? e.error : (e.error === "aborted" ? "aborted" : "no-speech"), message: e.message })})`); }),
      SR.addListener("end", () => { const s = sr.cur; sr.busy = false; js(`window.__ktSR(${s},"end",{})`); if (sr.next) { const o = sr.next; sr.next = null; srStart(o); } }),
    ];
    return () => L.forEach(l => l.remove()); }, []);
  useEffect(() => { prepareWeb().then(setUri).catch(() => setUri(null)); activateKeepAwakeAsync().catch(() => {}); }, []);
  // Android の もどるボタン：ゲームの 中では なにも しない（まちがって とじない ように）
  useEffect(() => { const s = BackHandler.addEventListener("hardwareBackPress", () => true); return () => s.remove(); }, []);

  const onMessage = async ev => { let m; try { m = JSON.parse(ev.nativeEvent.data); } catch (e) { return; }
    if (m.t === "pack") reply(m.id, await getPack(m.a));
    else if (m.t === "buy") reply(m.id, await buy());
    else if (m.t === "restore" || m.t === "owned") reply(m.id, await owned());
    else if (m.t === "exit") { if (Platform.OS === "android") { reply(m.id, true); BackHandler.exitApp(); } else reply(m.id, false); }
    else if (m.t === "sr") { const a = m.a;
      if (a.op === "start") { if (sr.busy) { sr.next = a; try { SR.abort(); } catch (e) { } } else srStart(a); }
      else if (a.sid === sr.cur || a.op === "abort") { if (sr.next && sr.next.sid === a.sid) { sr.next = null; js(`window.__ktSR(${a.sid},"end",{})`); return; }
        if (sr.busy && a.sid === sr.cur) { try { a.op === "stop" ? SR.stop() : SR.abort(); } catch (e) { } } } } };

  return (
    <View style={S.root}>
      <StatusBar hidden />
      {uri && <WebView ref={web} source={{ uri }} originWhitelist={["*"]} style={S.root}
        allowFileAccess allowFileAccessFromFileURLs allowUniversalAccessFromFileURLs allowingReadAccessToURL={WEB}
        javaScriptEnabled domStorageEnabled mediaPlaybackRequiresUserAction={false} allowsInlineMediaPlayback
        injectedJavaScriptBeforeContentLoaded={BRIDGE} onMessage={onMessage}
        bounces={false} overScrollMode="never" setSupportMultipleWindows={false} textZoom={100}
        allowsBackForwardNavigationGestures={false} allowsLinkPreview={false} webviewDebuggingEnabled={__DEV__}
        onLoadEnd={() => SplashScreen.hideAsync().catch(() => {})}
        onContentProcessDidTerminate={() => web.current && web.current.reload()} onRenderProcessGone={() => web.current && web.current.reload()} />}
    </View>); }
const S = StyleSheet.create({ root: { flex: 1, backgroundColor: "#FFF8E8" } });
