// ことばのたね アプリ：ゲーム本体（index.html）を WebView で うごかし、ブラウザに ない ものを アプリ側で てつだう。
//   ・音声認識（ブラウザの SpeechRecognition の かわりに iOS / Android の 音声認識）
//   ・100円の「ぜんぶ ひらく」の 購入・復元
//   ・声の パック（packs/*.json）：はじめて あそぶ コースの ときに 公開ページから とりよせて 保存（2かいめからは ネットなしで）
//   ・「おわる」ボタン（Android は アプリを とじる。iOS は とじない きまりなので「またね」の 画面）
import { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, Image, Pressable, BackHandler, Platform, StyleSheet, AppState } from "react-native";
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
// iPhone：音は 下の スピーカーから。マナーモードでも 鳴らす（子どもが 声を 聞けない と すすめない ため）
// 2026-11-02：マイクの 許可が おりる まえは さわらない（許可の ない まま 録音できる 設定に すると、音が 出なく なる・許可の 確認が おくれる うたがい）
const DBG = { log: [], t0: Date.now(), on: false, set: null };
function dlog(s) { DBG.log.push(`${((Date.now() - DBG.t0) / 1000).toFixed(1)}s ${s}`); if (DBG.log.length > 60) DBG.log.shift(); if (DBG.set) DBG.set([...DBG.log]); }
let PERM_OK = false;
function speakerOn(why = "") { if (Platform.OS !== "ios") return; if (!PERM_OK) { dlog("speakerOn skip(no perm) " + why); return; }
  try { SR.setCategoryIOS({ category: "playAndRecord", categoryOptions: ["defaultToSpeaker", "allowBluetooth", "allowBluetoothA2DP", "mixWithOthers"], mode: "default" }); } catch (e) { dlog("setCategory err " + e.message); }
  try { SR.setAudioSessionActiveIOS(true); } catch (e) { dlog("setActive err " + e.message); }
  dlog("speakerOn " + why + " " + sessionInfo()); }
// マイクを ことわられた ときも、マナーモードで 音が きえない ように「さいせい」あつかいに
function playbackOn(why = "") { if (Platform.OS !== "ios") return; try { SR.setCategoryIOS({ category: "playback", categoryOptions: ["mixWithOthers"], mode: "default" }); SR.setAudioSessionActiveIOS(true); } catch (e) { dlog("playback err " + e.message); } dlog("playbackOn " + why + " " + sessionInfo()); }
function sessionInfo() { try { const c = SR.getAudioSessionCategoryAndOptionsIOS(); return `${c.category}/${c.mode}/${(c.categoryOptions || []).join("+")}`; } catch (e) { return "?"; } }
const PAGES = "https://amane1234567jp-crypto.github.io/kotoba-tane/";
const SKU = "kotoba_tane_all";
const WEB = FS.documentDirectory + "web/";

// WebView の 中で ページより 先に うごく しかけ
const BRIDGE = `(function(){
  var RN = window.ReactNativeWebView, cb = {}, n = 0;
  function post(o){ RN.postMessage(JSON.stringify(o)); }
  function call(t, a){ return new Promise(function(r){ var id = ++n; cb[id] = r; post({ t: t, id: id, a: a || null }); }); }
  window.__ktReply = function(id, v){ var f = cb[id]; delete cb[id]; if (f) f(v); };
  window.KT_APP = { platform: ${JSON.stringify(Platform.OS)}, buy: function(){ return call("buy"); }, restore: function(){ return call("restore"); }, owned: function(){ return call("owned"); }, exit: function(){ return call("exit"); }, audioReset: function(){ return call("audioReset"); } };
  // おとなの かくにん用：タイトル「ことばのたね」を 5かい つづけて タップすると、音の 状態の 画面が ひらく
  var taps = 0, tapT = 0;
  document.addEventListener("pointerdown", function(e){ var el = e.target.closest && e.target.closest(".m3head, .mhero, .mtitle"); if (!el) { return; } var now = Date.now(); taps = now - tapT < 1500 ? taps + 1 : 1; tapT = now; if (taps >= 5) { taps = 0; post({ t: "debug" }); } }, true);
  window.__ktState = function(){ try { return JSON.stringify({ ctx: (typeof ctx !== "undefined" && ctx) ? ctx.state : null, bgm: (typeof BGM !== "undefined" && BGM.gain) ? +BGM.gain.gain.value.toFixed(2) : null, route: typeof ROUTE !== "undefined" ? ROUTE.out : null, stage: typeof curStage !== "undefined" ? curStage : null, hide: typeof HIDE !== "undefined" ? !!HIDE.off : null }); } catch(e) { return "err " + e.message; } };
  window.addEventListener("load", function(){ post({ t: "pageload" }); });
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
  // ページが「play-and-record」に きりかえると iPhone が 音を 受話口（耳に あてる 小さな スピーカー）に まわして しまう。アプリでは アプリ側が きめるので、ページからの 切りかえは うけつけない
  // 2026-11-03：iPhone の アプリでは、ゲームの 音を いつも「さいせい（playback）」あつかいに する。
  //   なにも しないと「マナーモードで きえる」あつかい（ambient）に なって 無音、「play-and-record」だと 受話口から 小さく なる。
  //   ページが ほかの 種類に しようと しても playback に する（マイクの あいだは アプリ側が 録音できる 設定に きりかえる）
  try { if (navigator.audioSession) { var as = navigator.audioSession, P = Object.getPrototypeOf(as), d = Object.getOwnPropertyDescriptor(P, "type");
      if (d && d.set) { d.set.call(as, "playback"); Object.defineProperty(as, "type", { configurable: true, get: function(){ return d.get.call(as); }, set: function(){ d.set.call(as, "playback"); } }); } } } catch (e) {}
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
    if (sr.perm === null) await askPerm();
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
      SR.addListener("end", () => { const s = sr.cur; sr.busy = false; js(`window.__ktSR(${s},"end",{})`); if (sr.next) { const o = sr.next; sr.next = null; srStart(o); } else playbackOn("sr end"); }),
    ];
    return () => L.forEach(l => l.remove()); }, []);
  // 2026-11-02：ゲームの 音が うまれる まえに、マイクの 許可と 音の 出口（マナーモードでも 鳴る 設定）を きめて おく。
  // まだ 許可が ない ときは、さいしょに おとな むけの「はじめる」画面を 出し、ボタンを おした ときに 許可を きく（アプリが 前に ある ときに きくので すぐ 出る）。
  const [ready, setReady] = useState(false), [gate, setGate] = useState(false);
  useEffect(() => { dlog("mount " + sessionInfo()); prepareWeb().then(setUri).catch(() => setUri(null)); activateKeepAwakeAsync().catch(() => {});
    (async () => { let g = false; try { const r = await SR.getPermissionsAsync(); g = r.granted; dlog("perm now " + r.status); } catch (e) { dlog("perm check err " + e.message); }
      if (g) { sr.perm = true; sr.permP = Promise.resolve(true); PERM_OK = true; playbackOn("start"); setReady(true); } else { SplashScreen.hideAsync().catch(() => {}); setGate(true); } })(); }, []);
  const startGame = async () => { setGate(false); await askPerm(); setReady(true); };
  // マイク・音声認識の 許可は ゲームの とちゅうでは なく、起動して すぐに 聞く
  // ひとつの 約束（promise）に まとめて、なんど よばれても 確認は 1かいだけ
  const askPerm = () => sr.permP || (sr.permP = (async () => { dlog("perm ask"); try { const r = await SR.requestPermissionsAsync(); sr.perm = r.granted; dlog("perm " + r.status + " again=" + r.canAskAgain); } catch (e) { sr.perm = false; dlog("perm err " + e.message); } PERM_OK = !!sr.perm; playbackOn("after perm"); return sr.perm; })());
  useEffect(() => { const s = AppState.addEventListener("change", st => { dlog("appstate " + st); if (st === "active") playbackOn("active"); }); return () => s.remove(); }, []);
  const [dbg, setDbg] = useState(null); useEffect(() => { DBG.set = setDbg; return () => { DBG.set = null; }; }, []);
  // Android の もどるボタン：ゲームの 中では なにも しない（まちがって とじない ように）
  useEffect(() => { const s = BackHandler.addEventListener("hardwareBackPress", () => true); return () => s.remove(); }, []);

  const onMessage = async ev => { let m; try { m = JSON.parse(ev.nativeEvent.data); } catch (e) { return; }
    if (m.t === "pack") reply(m.id, await getPack(m.a));
    else if (m.t === "buy") reply(m.id, await buy());
    else if (m.t === "restore" || m.t === "owned") reply(m.id, await owned());
    else if (m.t === "pageload") { dlog("page load " + sessionInfo()); playbackOn("pageload"); }
    else if (m.t === "audioReset") { dlog("audioReset"); try { if (Platform.OS === "ios") { SR.setAudioSessionActiveIOS(false, { notifyOthersOnDeactivation: true }); } } catch (e) { dlog("reset err " + e.message); } reply(m.id, true); }
    else if (m.t === "debug") { DBG.on = !DBG.on; setDbg([...DBG.log]); if (DBG.on) { web.current && web.current.injectJavaScript(`window.ReactNativeWebView.postMessage(JSON.stringify({t:"state",a:window.__ktState()}));true;`); } }
    else if (m.t === "state") { dlog("page " + m.a); }
    else if (m.t === "exit") { if (Platform.OS === "android") { reply(m.id, true); BackHandler.exitApp(); } else reply(m.id, false); }
    else if (m.t === "sr") { const a = m.a;
      if (a.op === "start") { if (sr.busy) { sr.next = a; try { SR.abort(); } catch (e) { } } else srStart(a); }
      else if (a.sid === sr.cur || a.op === "abort") { if (sr.next && sr.next.sid === a.sid) { sr.next = null; js(`window.__ktSR(${a.sid},"end",{})`); return; }
        if (sr.busy && a.sid === sr.cur) { try { a.op === "stop" ? SR.stop() : SR.abort(); } catch (e) { } } } } };

  return (
    <View style={S.root}>
      <StatusBar hidden />
      {gate && <View style={S.gate}><Image source={require("./assets/splash.png")} style={S.gateImg} resizeMode="contain" />
        <Text style={S.gateT}>ことばのたね は、お子さんが 言った ことばを 聞きとるために、マイクと 音声認識を つかいます。</Text>
        <Pressable onPress={startGame} style={S.gateBtn}><Text style={S.gateBtnT}>▶ はじめる</Text></Pressable></View>}
      {ready && uri && <WebView ref={web} source={{ uri }} originWhitelist={["*"]} style={S.root}
        allowFileAccess allowFileAccessFromFileURLs allowUniversalAccessFromFileURLs allowingReadAccessToURL={WEB}
        javaScriptEnabled domStorageEnabled mediaPlaybackRequiresUserAction={false} allowsInlineMediaPlayback
        injectedJavaScriptBeforeContentLoaded={BRIDGE} onMessage={onMessage}
        bounces={false} overScrollMode="never" setSupportMultipleWindows={false} textZoom={100}
        allowsBackForwardNavigationGestures={false} allowsLinkPreview={false} webviewDebuggingEnabled={__DEV__}
        onLoadEnd={() => { SplashScreen.hideAsync().catch(() => {}); }}
        onContentProcessDidTerminate={() => web.current && web.current.reload()} onRenderProcessGone={() => web.current && web.current.reload()} />}
      {DBG.on && dbg && <View style={S.dbg} pointerEvents="box-none"><ScrollView style={S.dbgBox}><Text style={S.dbgT}>{`音の状態（おとな用）  perm=${PERM_OK} session=${sessionInfo()}\n` + dbg.slice(-40).join("\n")}</Text></ScrollView>
        <Text style={S.dbgBtn} onPress={() => { web.current && web.current.injectJavaScript(`window.ReactNativeWebView.postMessage(JSON.stringify({t:"state",a:window.__ktState()}));true;`); }}>いまの状態をとる</Text>
        <Text style={S.dbgBtn} onPress={() => { DBG.on = false; setDbg(null); }}>とじる</Text></View>}
    </View>); }
const S = StyleSheet.create({ root: { flex: 1, backgroundColor: "#FFF8E8" },
  dbg: { position: "absolute", left: 8, right: 8, bottom: 8, maxHeight: "60%", backgroundColor: "#000000CC", borderRadius: 12, padding: 8 },
  gate: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#FFF8E8" },
  gateImg: { width: 160, height: 160, marginBottom: 12 }, gateT: { fontSize: 18, color: "#2B2A33", textAlign: "center", lineHeight: 28, maxWidth: 560, marginBottom: 20 },
  gateBtn: { backgroundColor: "#7BD389", borderColor: "#2B2A33", borderWidth: 4, borderRadius: 999, paddingVertical: 14, paddingHorizontal: 48 }, gateBtnT: { fontSize: 26, color: "#2B2A33", fontWeight: "700" },
  dbgBox: { maxHeight: 260 }, dbgT: { color: "#9FE870", fontSize: 11, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" },
  dbgBtn: { color: "#FFFFFF", backgroundColor: "#444", padding: 8, marginTop: 6, borderRadius: 8, textAlign: "center", fontSize: 14 } });
