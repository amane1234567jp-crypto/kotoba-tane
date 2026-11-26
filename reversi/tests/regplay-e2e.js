// 「とうろく」と「あそぶ」を分けた流れを、本物の中継（Supabase）と 本物の通話（PeerJS・WebRTC）で 通しで確かめる（2026-11-19）
// GitHub Actions（reversi-e2e）で動く。ページは チェックアウトした reversi/ を この中の小さなサーバーで出す（公開前の版を ためせる）
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.join(process.env.GITHUB_WORKSPACE || path.join(__dirname, "../.."), "reversi");
const PORT = 47917, HOST = `http://localhost:${PORT}/play.html`;
let fail = 0;
const check = (ok, msg) => { console.log((ok ? "OK  " : "NG  ") + msg); if (!ok) fail++; };
const NATIVE = `window.__shared=[];window.__opened=[];window.__media=0;
window.ReactNativeWebView={postMessage:function(m){try{var o=JSON.parse(m);if(o.t==="open"){window.__opened.push(o.url);var k=o.url.indexOf("text=")>=0?o.url.indexOf("text=")+5:(o.url.indexOf("msg/text/")>=0?o.url.indexOf("msg/text/")+9:-1);if(k>=0)window.__shared.push(decodeURIComponent(o.url.slice(k)));}if(o.t==="share"){window.__shared.push(o.text);var R=window.__shareResult||{ok:true,act:"jp.naver.line.Share"};setTimeout(function(){window.RV.native({t:"shared",ok:R.ok,act:R.act})},50);}if(o.t==="needMedia")setTimeout(function(){window.RV&&window.RV.native({t:"media"})},30);}catch(e){}}};
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

  // 2026-11-26：はじめては 登録と同時に つながる（LINE の 2通目なし）
  const until = async (page, fn, ms) => { const end = Date.now() + ms; while (Date.now() < end) { try { if (await page.evaluate(fn)) return true; } catch (e) { } await page.waitForTimeout(500); } return false; };
  const g = await phone(); await open(g, "?" + regUrl.split("?")[1]);
  const gid = await g.evaluate(() => CALL.id);
  const acc = g.waitForResponse(r => (r.request().postData() || "").includes('"accept"'), { timeout: 20000 }).catch(() => null);
  await g.fill("#myName", "ばあばE2E"); await g.click("#nameOk");
  const r = await acc;
  check(!!r && r.status() === 200, "B：本物の中継に とうろくを 残した（" + (r ? r.status() : "なし") + "）");
  check(await until(g, () => NET.role === "host" && document.getElementById("inviteOv").hidden, 15000), "B：登録したら そのまま A を待つ（LINE の画面は 出さない）");
  const t0 = Date.now();
  const okA1 = await until(a, () => NET.open, 60000), okG1 = await until(g, () => NET.open, 10000);
  check(okA1 && okG1, `はじめて：A が 何も押さずに つながった（${Math.round((Date.now() - t0) / 1000)}秒）`);
  const ap = await a.evaluate(() => JSON.parse(localStorage.getItem("marushima-reversi-people") || "[]"));
  check(ap.some(p => p.dev === gid && p.name === "ばあばE2E"), "A：ばあば が とうろくした ひとに 入った");

  // 2回目：B が「A と あそぶ」→ A は リンクなしで アプリを ひらくだけ →「〇〇が まっているよ」→ つなぐ
  await open(a); await open(g);
  await g.click("#callBtn"); await g.waitForTimeout(500);
  await g.click("#whoList button");
  await g.waitForFunction(() => !document.getElementById("inviteOv").hidden, null, { timeout: 30000 }).catch(() => { });
  await g.click("#inviteClose").catch(() => { });
  await open(a);
  const meet = await until(a, () => !document.getElementById("meetOv").hidden && /ばあばE2E/.test(document.getElementById("meetTitle").textContent), 15000);
  check(meet, "A：アプリを ひらいただけで「ばあばE2Eが まっているよ」が出た");
  if (meet) await a.click("#meetGo");
  const okA2 = await until(a, () => NET.open, 60000), okG2 = await until(g, () => NET.open, 10000);
  check(okA2 && okG2, "2回目：まっているよ → つなぐ で つながった");

  // あそぶ リンクから ひらいたら「はじめる」を押さずに つながる
  await open(a); await open(g);
  await g.click("#callBtn"); await g.waitForTimeout(500);
  await g.click("#whoList button");
  await g.waitForFunction(() => !document.getElementById("inviteOv").hidden, null, { timeout: 30000 }).catch(() => { });
  await g.click("#lineBtn"); await g.waitForTimeout(300);
  const playUrl = (((await g.evaluate(() => window.__shared)).pop() || "").match(/https:\/\/\S+/) || [""])[0];
  check(/m=play/.test(playUrl), "B：あそぶリンクを おくった");
  await open(a, "?" + playUrl.split("?")[1]);
  const okA3 = await until(a, () => NET.open, 60000), okG3 = await until(g, () => NET.open, 10000);
  check(okA3 && okG3, "あそぶリンク：はじめるを 押さずに つながった");
  if (okA3 && okG3) { await a.waitForTimeout(4000); check(await g.evaluate(() => G.begun) === true, "対局が はじまった"); }

  await browser.close(); srv.close();
  console.log(fail ? `\n${fail} 件 NG` : "\nぜんぶ OK");
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
