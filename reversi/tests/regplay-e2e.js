// 「とうろく」と「あそぶ」を分けた流れを、本物の中継（Supabase）と 本物の通話（PeerJS・WebRTC）で 通しで確かめる（2026-11-19）
// GitHub Actions（reversi-e2e）で動く。ページは チェックアウトした reversi/ を この中の小さなサーバーで出す（公開前の版を ためせる）
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.join(process.env.GITHUB_WORKSPACE || path.join(__dirname, "../.."), "reversi");
const PORT = 47917, HOST = `http://localhost:${PORT}/play.html`;
let fail = 0;
const check = (ok, msg) => { console.log((ok ? "OK  " : "NG  ") + msg); if (!ok) fail++; };
const NATIVE = `window.__shared=[];window.__media=0;
window.ReactNativeWebView={postMessage:function(m){try{var o=JSON.parse(m);if(o.t==="share")window.__shared.push(o.text);if(o.t==="needMedia")setTimeout(function(){window.RV&&window.RV.native({t:"media"})},30);}catch(e){}}};
window.RVNative={platform:"ios",version:"1.0.5",push:false};
try{localStorage.setItem("marushima-reversi-claimed","1")}catch(e){}
(function(){var md=navigator.mediaDevices;if(md&&md.getUserMedia){var g=md.getUserMedia.bind(md);md.getUserMedia=function(c){window.__media++;return g(c)}}})();`;

(async () => {
  const srv = http.createServer((req, res) => {
    const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
    fs.readFile(p, (e, b) => { if (e) { res.writeHead(404); res.end(); return; } res.writeHead(200, { "content-type": p.endsWith(".html") ? "text/html" : p.endsWith(".js") ? "text/javascript" : "application/octet-stream" }); res.end(b); });
  }).listen(PORT);
  const browser = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
  async function phone() {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ["camera", "microphone"], locale: "ja-JP", timezoneId: "Asia/Tokyo" });
    await ctx.addInitScript(NATIVE);
    const page = await ctx.newPage();
    page.on("pageerror", e => console.log("  pageerror:", e.message));
    return page;
  }
  const open = async (page, q) => { await page.goto(HOST + (q || ""), { waitUntil: "load" }); await page.waitForTimeout(1500); };

  const a = await phone(); await open(a);
  const aid = await a.evaluate(() => CALL.id);
  await a.click("#callBtn"); await a.fill("#myName", "ゆうくんE2E"); await a.click("#nameOk"); await a.waitForTimeout(500);
  await a.click("#whoNew"); await a.waitForTimeout(500);
  await a.click("#regLine"); await a.waitForTimeout(300);
  const regUrl = ((await a.evaluate(() => window.__shared))[0].match(/https:\/\/\S+/) || [""])[0];
  check(/m=reg/.test(regUrl) && await a.evaluate(() => window.__media) === 0, "A：さそう（とうろくだけ・カメラなし）");

  const g = await phone(); await open(g, "?" + regUrl.split("?")[1]);
  const gid = await g.evaluate(() => CALL.id);
  const acc = g.waitForResponse(r => (r.request().postData() || "").includes('"accept"'), { timeout: 20000 }).catch(() => null);
  await g.fill("#myName", "ばあばE2E"); await g.click("#nameOk");
  const r = await acc;
  check(!!r && r.status() === 200, "B：本物の中継に とうろくを 残した（" + (r ? r.status() : "なし") + "）");
  check(await g.evaluate(() => !document.getElementById("regDoneOv").hidden) && await g.evaluate(() => window.__media) === 0, "B：なかまに なった（カメラなし）");

  await a.waitForFunction(() => /ばあばE2Eが なかまに なりました/.test(document.getElementById("ringNote").textContent), null, { timeout: 45000 }).catch(() => { });
  const ap = await a.evaluate(() => JSON.parse(localStorage.getItem("marushima-reversi-people") || "[]"));
  check(ap.some(p => p.dev === gid && p.name === "ばあばE2E"), "A：開いたまま 本物の中継から ばあば を うけとった");

  // B（さそわれた側）から あそぶ → A が あそぶリンクを ひらく → 本当に つながる
  await g.click("#regDoneOk");
  await g.click("#callBtn"); await g.waitForTimeout(500);
  await g.click("#whoList button");
  await g.waitForFunction(() => !document.getElementById("inviteOv").hidden, null, { timeout: 30000 }).catch(() => { });
  await g.click("#lineBtn"); await g.waitForTimeout(300);
  const playUrl = (((await g.evaluate(() => window.__shared)).pop() || "").match(/https:\/\/\S+/) || [""])[0];
  check(/m=play/.test(playUrl), "B：あそぶリンクを おくった");
  await open(a, "?" + playUrl.split("?")[1]);
  await a.click("#startBtn").catch(() => { });
  const okA = await a.waitForFunction(() => NET.open, null, { timeout: 60000 }).then(() => true).catch(() => false);
  const okG = await g.waitForFunction(() => NET.open, null, { timeout: 10000 }).then(() => true).catch(() => false);
  check(okA && okG, "B（さそわれた側）から よんで、A と 本当に つながった");
  if (okA && okG) {
    await a.waitForTimeout(4000);
    check(await g.evaluate(() => G.begun) === true, "対局が はじまった");
  }

  await browser.close(); srv.close();
  console.log(fail ? `\n${fail} 件 NG` : "\nぜんぶ OK");
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
