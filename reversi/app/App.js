/* まるシマリバーシ アプリ版の「殻」（Expo）。
   ゲーム本体は Web 版とおなじ 1枚の HTML（assets/web.zip）。起動時に端末の中に展開し、
   端末の中だけの小さなサーバー（http://127.0.0.1:ポート）で配って WebView に表示する。
   ファイル直読み（file://）にしないのは、カメラ・マイク・fetch・crypto が「安全な文脈」でしか使えないため。
   殻がやること：カメラ・マイクの許可、通知（よびだし）の受けとり、共有（LINE）、画面を消さない、音の種類（マナーモードでも鳴る）。
   Web ↔ 殻：Web → postMessage(JSON)、殻 → window.RV.native(JSON) */
import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, Platform, Share, PermissionsAndroid, Linking, AppState, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import { useKeepAwake } from "expo-keep-awake";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as FS from "expo-file-system/legacy";
import { Asset } from "expo-asset";
import * as Notifications from "expo-notifications";
import { setAudioModeAsync } from "expo-audio";
import { unzip } from "react-native-zip-archive";
import Server from "@dr.pogodin/react-native-static-server";

const WEB_ZIP = require("./assets/web.zip");
const WEB_VER = require("./assets/web-version.json");
const PUSH_READY = !!(Constants.expoConfig && Constants.expoConfig.extra && Constants.expoConfig.extra.pushReady);
const APP_VER = (Constants.expoConfig && Constants.expoConfig.version) || "0";

// 前面でも通知を出す（対局中に よばれたとき）
Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
});

const strip = u => u.replace(/^file:\/\//, "");

// ゲーム本体を端末の中に展開（アプリの版か中身の版が変わったときだけ やりなおす）
async function ensureWeb() {
  const dir = FS.documentDirectory + "web/";
  const stamp = dir + ".ver";
  const want = APP_VER + "|" + WEB_VER.ver + "|" + WEB_VER.at;
  try { const cur = await FS.readAsStringAsync(stamp); if (cur === want) return dir; } catch (e) { /* まだない */ }
  try { await FS.deleteAsync(dir, { idempotent: true }); } catch (e) { }
  await FS.makeDirectoryAsync(dir, { intermediates: true });
  const asset = Asset.fromModule(WEB_ZIP);
  await asset.downloadAsync();
  await unzip(strip(asset.localUri || asset.uri), strip(dir));
  await FS.writeAsStringAsync(stamp, want);
  return dir;
}

export default function App() {
  useKeepAwake();
  const web = useRef(null);
  const server = useRef(null);
  const [origin, setOrigin] = useState(null);
  const [query, setQuery] = useState("");
  const [err, setErr] = useState("");
  const [key, setKey] = useState(0);

  // 起動：音の種類 → 展開 → サーバー
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // マナーモードでも鳴らす。マイクを使う設定（PlayAndRecord）は ここでは入れない＝通話のときに WebView が自分で切り替える
        await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false, interruptionMode: "mixWithOthers", shouldPlayInBackground: false, shouldRouteThroughEarpiece: false });
      } catch (e) { }
      try {
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("call", {
            name: "よびだし", importance: Notifications.AndroidImportance.MAX, sound: "default",
            vibrationPattern: [0, 400, 200, 400, 200, 400], lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC, bypassDnd: false,
          });
        }
      } catch (e) { }
      try {
        const dir = await ensureWeb();
        const s = new Server({ fileDir: strip(dir), hostname: "127.0.0.1", port: 0, stopInBackground: false });
        const o = await s.start();
        server.current = s;
        if (alive) setOrigin(o.replace(/\/$/, ""));
      } catch (e) { if (alive) setErr(String(e && e.message || e)); }
    })();
    return () => { alive = false; try { server.current && server.current.stop(); } catch (e) { } };
  }, []);

  // 通知をタップして開いたとき：その URL の ?以降 を持って ゲームを開きなおす
  const openFromNotification = useCallback(resp => {
    try {
      const d = resp && resp.notification && resp.notification.request.content.data;
      const url = d && d.url; if (!url) return;
      const q = url.includes("?") ? url.slice(url.indexOf("?")) : "";
      if (d.at && Date.now() - d.at > 90000) return;   // 古い よびだしは ひらかない
      setQuery(q); setKey(k => k + 1);
    } catch (e) { }
  }, []);
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(openFromNotification);
    Notifications.getLastNotificationResponseAsync().then(r => { if (r) openFromNotification(r); }).catch(() => { });
    return () => sub.remove();
  }, [openFromNotification]);

  const send = m => { try { web.current && web.current.injectJavaScript(`window.RV && window.RV.native(${JSON.stringify(m)}); true;`); } catch (e) { } };

  async function getPushToken(askIfNeeded) {
    if (!PUSH_READY || !Device.isDevice) return null;
    let { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted" && askIfNeeded) status = (await Notifications.requestPermissionsAsync()).status;
    if (status !== "granted") { send({ t: "denied" }); return null; }
    const projectId = Constants.easConfig && Constants.easConfig.projectId || (Constants.expoConfig && Constants.expoConfig.extra && Constants.expoConfig.extra.eas && Constants.expoConfig.extra.eas.projectId);
    const tok = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : {});
    send({ t: "token", expo: tok.data });
    return tok.data;
  }

  async function askMedia() {
    if (Platform.OS === "android") {
      try { await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.RECORD_AUDIO]); } catch (e) { }
    }
    send({ t: "media" });
  }

  const onMessage = async e => {
    let m = null; try { m = JSON.parse(e.nativeEvent.data); } catch (err) { return; }
    if (!m) return;
    if (m.t === "share") { try { await Share.share(Platform.OS === "ios" ? { message: m.text } : { message: m.text }); } catch (err) { } }
    else if (m.t === "needPush") { try { await getPushToken(true); } catch (err) { send({ t: "denied" }); } }
    else if (m.t === "pushIfGranted") { try { await getPushToken(false); } catch (err) { } }
    else if (m.t === "needMedia") { await askMedia(); }
    else if (m.t === "open") { try { await Linking.openURL(m.url); } catch (err) { } }
  };

  const boot = `window.RVNative = ${JSON.stringify({ platform: Platform.OS, version: APP_VER, push: PUSH_READY })}; true;`;

  if (err) return <View style={st.center}><Text style={st.msg}>ゲームを よみこめませんでした。{"\n"}アプリを いちど とじて、もう一度ひらいてください。{"\n\n"}{err}</Text></View>;
  if (!origin) return <View style={st.center}><Text style={st.msg}>じゅんびちゅう…</Text></View>;
  return (
    <View style={st.root}>
      <StatusBar style="dark" hidden />
      <WebView
        key={key}
        ref={web}
        source={{ uri: origin + "/index.html" + query }}
        style={st.web}
        originWhitelist={["*"]}
        injectedJavaScriptBeforeContentLoaded={boot}
        onMessage={onMessage}
        javaScriptEnabled domStorageEnabled
        allowsInlineMediaPlayback mediaPlaybackRequiresUserAction={false}
        mediaCapturePermissionGrantType="grant"
        allowsBackForwardNavigationGestures={false}
        bounces={false} overScrollMode="never"
        setSupportMultipleWindows={false}
        allowsFullscreenVideo={false}
        textZoom={100}
        applicationNameForUserAgent={"MarushimaReversi/" + APP_VER}
        onShouldStartLoadWithRequest={req => {
          // ゲーム以外のリンク（ライセンスなど）は 外のブラウザで
          if (req.url.startsWith(origin) || req.url.startsWith("about:")) return true;
          Linking.openURL(req.url).catch(() => { }); return false;
        }}
      />
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F7F1E6" },
  web: { flex: 1, backgroundColor: "#F7F1E6" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F7F1E6", padding: 24 },
  msg: { fontSize: 18, color: "#2B2A33", textAlign: "center", lineHeight: 28 },
});
