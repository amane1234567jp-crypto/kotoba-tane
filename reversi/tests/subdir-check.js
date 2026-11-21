// ゲームを 版ごとの フォルダ（/v…/index.html）から ひらいても 動くか・保存が ひきつがれるか（2026-11-21）
// 実行：node reversi/tests/subdir-check.js
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.join(__dirname, "..");
let fail = 0; const check = (ok, m) => { console.log((ok ? "OK  " : "NG  ") + m); if (!ok) fail++; };
(async () => {
  const miss = [];
  const srv = http.createServer((req, res) => {
    let u = decodeURIComponent(req.url.split("?")[0]).replace(/^\/v[0-9A-Za-z]+\//, "/");
    if (u === "/index.html") u = "/play.html";
    fs.readFile(path.join(ROOT, u), (e, b) => { if (e) { miss.push(req.url); res.writeHead(404); res.end(); return; } res.writeHead(200, { "content-type": u.endsWith(".html") ? "text/html" : u.endsWith(".svg") ? "image/svg+xml" : "application/octet-stream" }); res.end(b); });
  }).listen(47918, "127.0.0.1");
  const b = await chromium.launch(); const c = await b.newContext();
  await c.route(/supabase\.co|metered|ntfy/, r => r.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  await c.addInitScript(`window.ReactNativeWebView={postMessage:function(){}};window.RVNative={platform:"ios",version:"1.0.6",push:false};`);
  const p = await c.newPage(); const errs = []; p.on("pageerror", e => errs.push(e.message));
  await p.goto("http://127.0.0.1:47918/v106a/index.html"); await p.waitForTimeout(2500);
  await p.evaluate(() => { const k = "marushima-reversi-cfg", o = JSON.parse(localStorage.getItem(k) || "{}"); o.myName = "ばあば"; localStorage.setItem(k, JSON.stringify(o)); });
  check(errs.length === 0, "版の フォルダから ひらいても エラーなし" + (errs.length ? "（" + errs[0] + "）" : ""));
  check(await p.evaluate(() => typeof CALL === "object" && !!document.getElementById("callBtn")), "ゲームが 起動する");
  await p.goto("http://127.0.0.1:47918/v107b/index.html"); await p.waitForTimeout(1500);
  check(await p.evaluate(() => JSON.parse(localStorage.getItem("marushima-reversi-cfg") || "{}").myName) === "ばあば", "べつの版の フォルダでも 保存（名前）が そのまま");
  check(miss.filter(u => !/favicon/.test(u)).length === 0, "読めない ファイルが ない" + (miss.length ? "（" + miss.join(", ") + "）" : ""));
  await b.close(); srv.close();
  console.log(fail ? `\n${fail} 件 NG` : "\nぜんぶ OK"); process.exit(fail ? 1 : 0);
})();
