// アプリ版で 通知を 入れたとき（2026-11-26 pushReady=true）の 検算。中継は にせもの
// ・許可ずみの端末は 起動したときに 宛先（Expo トークン）を 中継に登録する
// ・登録した相手が いれば 一度だけ「つぎから よびだしで つながる？」→ する → 許可 → 宛先を登録
// ・「〇〇と あそぶ」で 相手に 通知（call）を送る
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.join(__dirname, "..");
const PORT = 47919, HOST = `http://127.0.0.1:${PORT}/play.html`;
let fail = 0; const check = (ok, msg) => { console.log((ok ? "OK  " : "NG  ") + msg); if (!ok) fail++; };
const log = [];
async function relay(route) {
  let b = {}; try { b = JSON.parse(route.request().postData() || "{}"); } catch (e) { }
  log.push(b);
  let out = { ok: true };
  if (b.op === "pending") out = { ok: true, list: [], waits: [] };
  if (b.op === "call") out = { ok: true };
  await route.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify(out) });
}
const native = granted => `window.__msgs=[];
window.ReactNativeWebView={postMessage:function(m){var o=JSON.parse(m);window.__msgs.push(o.t);
 if(o.t==="pushIfGranted"&&${granted})setTimeout(function(){window.RV.native({t:"token",expo:"ExponentPushToken[abcDEF123]"})},50);
 if(o.t==="needPush")setTimeout(function(){window.RV.native({t:"token",expo:"ExponentPushToken[xyzXYZ789]"})},50);
 if(o.t==="needMedia")setTimeout(function(){window.RV.native({t:"media"})},30);}};
window.RVNative={platform:"android",version:"1.0.9",push:true};
try{localStorage.setItem("marushima-reversi-claimed","1")}catch(e){}`;
(async () => {
  const srv = http.createServer((req, res) => { const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0])); fs.readFile(p, (e, b) => { if (e) { res.writeHead(404); res.end(); return; } res.writeHead(200, { "content-type": p.endsWith(".html") ? "text/html" : p.endsWith(".js") ? "text/javascript" : "application/octet-stream" }); res.end(b); }); }).listen(PORT);
  const browser = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
  async function phone(granted) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ["camera", "microphone"] });
    await ctx.addInitScript(native(granted)); await ctx.route("**/functions/v1/rv-push", relay); await ctx.route("**/peerjs/**", r => r.abort()); await ctx.route("**/0.peerjs.com/**", r => r.abort());
    const page = await ctx.newPage(); page.on("pageerror", e => console.log("  pageerror:", e.message)); return page;
  }
  // 1) 許可ずみ：起動しただけで 宛先を登録
  const a = await phone(true); await a.goto(HOST); await a.waitForTimeout(1500);
  check(log.some(b => b.op === "reg" && b.expo === "ExponentPushToken[abcDEF123]"), "許可ずみの端末は 起動したときに 宛先を 中継に登録");
  check(await a.evaluate(() => !document.getElementById("pushInfo").closest(".row").hidden), "設定の「よびだし」の欄が 出る");
  // 2) まだ許可していない：相手がいれば 一度だけ聞く → する → 宛先を登録
  const b = await phone(false); await b.goto(HOST); await b.waitForTimeout(800);
  await b.evaluate(() => { const k = "marushima-reversi-cfg", o = JSON.parse(localStorage.getItem(k) || "{}"); o.myName = "まご"; localStorage.setItem(k, JSON.stringify(o)); localStorage.setItem("marushima-reversi-people", JSON.stringify([{ dev: "DDDDDDDDDDDDDDDDDDDDDD", room: "", name: "ばあば", at: 1 }])); });
  await b.reload(); await b.waitForTimeout(1500);
  check(await b.evaluate(() => !document.getElementById("pushAskOv").hidden), "相手が いれば「つぎから よびだしで つながる？」を 聞く");
  log.length = 0;
  await b.click("#pushAskYes"); await b.waitForTimeout(800);
  check(await b.evaluate(() => window.__msgs.includes("needPush")), "する → 通知の許可を たのむ");
  check(log.some(x => x.op === "reg" && x.expo === "ExponentPushToken[xyzXYZ789]"), "許可 → 宛先を 中継に登録");
  await b.reload(); await b.waitForTimeout(1200);
  check(await b.evaluate(() => document.getElementById("pushAskOv").hidden), "2回目は 聞かない");
  // 3) 「ばあばと あそぶ」→ 通知で よぶ
  log.length = 0;
  await b.click("#callBtn"); await b.waitForTimeout(400); await b.click("#whoList button"); await b.waitForTimeout(2500);
  const call = log.find(x => x.op === "call");
  check(!!call && call.to === "DDDDDDDDDDDDDDDDDDDDDD" && /m=play/.test(call.url) && /ring=1/.test(call.url), "「ばあばと あそぶ」で ばあばに 通知（あそぶリンク付き）");
  check(await b.evaluate(() => document.getElementById("inviteOv").hidden), "通知が 送れたときは LINE の画面を 出さない");
  await browser.close(); srv.close();
  console.log(fail ? `\n${fail} 件 NG` : "\nぜんぶ OK"); process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
