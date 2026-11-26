// 「とおくの ひとと あそぶ」を押したあとの流れの検算（アプリと同じ状態＝RVNative あり）。
// ①はじめて：なまえ → だれと あそぶ？（まだ いません＋案内）→ さそう で 招待画面
// ②2回目（なまえ・とうろくした ひと あり）：なまえは聞かない → だれと あそぶ？ に その人が出る
// 実行：node reversi/tests/flow-start.js
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.join(__dirname, "..");
let fail = 0;
const check = (ok, msg) => { console.log((ok ? "OK  " : "NG  ") + msg); if (!ok) fail++; };
const vis = (page, id) => page.evaluate(i => { const e = document.getElementById(i); return !!e && !e.hidden && getComputedStyle(e).display !== "none"; }, id);

(async () => {
  const srv = http.createServer((req, res) => {
    const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
    fs.readFile(p, (e, b) => { if (e) { res.writeHead(404); res.end(); return; } res.writeHead(200, { "content-type": p.endsWith(".html") ? "text/html" : "application/octet-stream" }); res.end(b); });
  }).listen(47914, "127.0.0.1");
  const browser = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
  const ctx = await browser.newContext({ permissions: ["camera", "microphone"] });
  // 中継（Supabase）・相手への接続は このテストでは使わない
  await ctx.route(/supabase\.co|ntfy|metered/, r => r.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  await ctx.addInitScript(`window.ReactNativeWebView={postMessage:function(m){try{var o=JSON.parse(m);if(o.t==="needMedia")setTimeout(function(){window.RV&&window.RV.native({t:"media"})},50);}catch(e){}}};window.RVNative={platform:"ios",version:"1.0.4",push:false};`);
  const page = await ctx.newPage();
  page.on("pageerror", e => console.log("  pageerror:", e.message));

  // ① はじめて
  await page.goto("http://127.0.0.1:47914/play.html");
  await page.waitForTimeout(800);
  check(!(await vis(page, "linkNote")), "開始画面に 点線の案内は 出ない");
  await page.click("#callBtn");
  await page.waitForTimeout(300);
  check(await vis(page, "nameOv"), "はじめては なまえの画面が 出る");
  check(!(await vis(page, "whoOv")), "  （まだ だれと あそぶ？ は 出ない）");
  await page.click("#nameOk"); await page.waitForTimeout(200);
  check(await vis(page, "nameOv"), "なまえが 空のままでは すすめない");
  await page.fill("#myName", "ばあば"); await page.click("#nameOk"); await page.waitForTimeout(300);
  check(!(await vis(page, "nameOv")) && await vis(page, "whoOv"), "なまえの あとは かならず「だれと あそぶ？」");
  check(/まだ いません/.test(await page.textContent("#whoList")), "とうろくした ひとが いなければ「まだ いません」");
  check(/お誘いの番号を入れる/.test(await page.textContent("#whoOv")), "お誘いを もらった ひと への「お誘いの番号を入れる」が ある（2026-11-26）");
  check((await page.textContent("#whoNew")).includes("さそう"), "ボタンは「あたらしい ひとを さそう」");
  await page.click("#whoNew"); await page.waitForTimeout(500);
  check(!(await vis(page, "whoOv")), "さそう を押すと だれと？ は とじる");
  check(await vis(page, "regOv"), "さそう を押すと「なかまを さそう」（とうろくだけ）が 出る");
  check(!(await vis(page, "inviteOv")), "  （対局の 招待画面は 出ない）");
  check(await page.evaluate(() => !document.body.classList.contains("playing")), "  （ゲーム画面に ならない）");
  await page.click("#regClose");

  // ② 2回目：なまえと とうろくした ひと が 保存されている
  await page.evaluate(() => localStorage.setItem("marushima-reversi-people", JSON.stringify([{ dev: "AAAAAAAAAAAAAAAAAAAA", room: "", name: "ゆうくん", at: Date.now() }])));
  await page.goto("http://127.0.0.1:47914/play.html"); await page.waitForTimeout(800);
  await page.click("#callBtn"); await page.waitForTimeout(300);
  check(!(await vis(page, "nameOv")), "2回目は なまえを 聞かない");
  check(await vis(page, "whoOv"), "2回目も「だれと あそぶ？」");
  check(/ゆうくんと あそぶ/.test(await page.textContent("#whoList")), "とうろくした ひと（ゆうくん）が 出る");
  check(!/まだ いません/.test(await page.textContent("#whoList")), "  （まだ いません は 出ない）");
  await page.click("#whoClose"); await page.waitForTimeout(200);
  check(!(await vis(page, "whoOv")), "やめる で とじる");

  await browser.close(); srv.close();
  console.log(fail ? `\n${fail} 件 NG` : "\nぜんぶ OK");
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
