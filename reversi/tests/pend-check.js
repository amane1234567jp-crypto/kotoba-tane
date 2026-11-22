// 誘った側が 相手の とうろくを うけとるまで（2026-11-22 けい の件）の検算
// ・画面が 作りなおされても（読みこみなおし）たしかめつづける ・「だれと あそぶ？」を ひらいた瞬間にも たしかめる
// 実行：node reversi/tests/pend-check.js
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.join(__dirname, "..");
let fail = 0; const check = (ok, m) => { console.log((ok ? "OK  " : "NG  ") + m); if (!ok) fail++; };
const pairs = [];
async function relay(route) {
  let b = {}; try { b = JSON.parse(route.request().postData() || "{}"); } catch (e) { }
  let out = { ok: true };
  if (b.op === "pending") { const mine = pairs.filter(p => p.to === b.id); mine.forEach(m => pairs.splice(pairs.indexOf(m), 1)); out = { ok: true, list: mine.map(m => ({ dev: m.from, name: m.name })) }; }
  await route.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify(out) });
}
(async () => {
  const srv = http.createServer((q, r) => { fs.readFile(path.join(ROOT, q.url.split("?")[0]), (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { "content-type": q.url.includes(".html") ? "text/html" : "application/octet-stream" }); r.end(b); }); }).listen(47920, "127.0.0.1");
  const br = await chromium.launch(); const c = await br.newContext();
  await c.route(/supabase\.co/, relay); await c.route(/metered|ntfy/, r => r.fulfill({ status: 200, body: "[]" }));
  await c.addInitScript(`window.ReactNativeWebView={postMessage:function(){}};window.RVNative={platform:"ios",version:"1.0.7",push:false};try{localStorage.setItem("marushima-reversi-claimed","1")}catch(e){}`);
  const p = await c.newPage(); p.on("pageerror", e => console.log("  pageerror:", e.message));
  const U = "http://127.0.0.1:47920/play.html";
  await p.goto(U); await p.waitForTimeout(600);
  await p.evaluate(() => { const k = "marushima-reversi-cfg", o = JSON.parse(localStorage.getItem(k) || "{}"); o.myName = "あらた"; localStorage.setItem(k, JSON.stringify(o)); });
  await p.goto(U); await p.waitForTimeout(600);
  const me = await p.evaluate(() => CALL.id);
  await p.evaluate(() => showRegInvite()); await p.click("#regLine"); await p.waitForTimeout(200);
  check(await p.evaluate(() => !!JSON.parse(localStorage.getItem("marushima-reversi-cfg")).pendUntil), "送ったら「いつまで たしかめるか」を 保存する");
  // LINE から もどったときに 画面が 作りなおされた
  await p.goto(U); await p.waitForTimeout(500);
  pairs.push({ to: me, from: "CdAhpQxxxxxxxxxxxxxx", name: "けい" });
  const t0 = Date.now();
  await p.waitForFunction(() => /けいが とうろく しました/.test(document.getElementById("ringNote").textContent), null, { timeout: 25000 }).catch(() => { });
  const dt = (Date.now() - t0) / 1000;
  check(/けいが とうろく しました/.test(await p.textContent("#ringNote")) && dt < 13, `画面が 作りなおされても たしかめつづけ、10秒ほどで 出る（${dt.toFixed(1)}秒）`);
  // 「だれと あそぶ？」を ひらいた瞬間
  pairs.push({ to: me, from: "ZZZZZZxxxxxxxxxxxxxx", name: "じいじ" });
  await p.click("#callBtn");
  await p.waitForFunction(() => /じいじと あそぶ/.test(document.getElementById("whoList").textContent), null, { timeout: 3000 }).catch(() => { });
  check(/じいじと あそぶ/.test(await p.textContent("#whoList")) && /けいと あそぶ/.test(await p.textContent("#whoList")), "「だれと あそぶ？」を ひらくと すぐ 一覧に 出る");
  // 24時間 すぎたら やめる
  await p.evaluate(() => { CFG.pendUntil = Date.now() - 1; saveCfg(); pendTick(); });
  check(await p.evaluate(() => !CFG.pendUntil && !pendTimer), "24時間 すぎたら たしかめるのを やめる");
  await br.close(); srv.close();
  console.log(fail ? `\n${fail} 件 NG` : "\nぜんぶ OK"); process.exit(fail ? 1 : 0);
})();
