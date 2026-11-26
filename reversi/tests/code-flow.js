// お誘いの番号（2026-11-26）の 検算。中継は にせもの
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.join(__dirname, ".."), PORT = 47921, HOST = `http://127.0.0.1:${PORT}/play.html`;
let fail = 0; const check = (ok, msg) => { console.log((ok ? "OK  " : "NG  ") + msg); if (!ok) fail++; };
const codes = {}, log = [];
async function relay(route) {
  let b = {}; try { b = JSON.parse(route.request().postData() || "{}"); } catch (e) { }
  log.push(b); let out = { ok: true };
  if (b.op === "pending") out = { ok: true, list: [], waits: [] };
  if (b.op === "code") { codes["482915"] = { dev: b.id, name: b.name }; out = { ok: true, code: "482915" }; }
  if (b.op === "redeem") { const c = codes[b.code]; out = !c ? { ok: false, reason: "nocode" } : c.dev === b.id ? { ok: false, reason: "self" } : { ok: true, dev: c.dev, name: c.name }; }
  await route.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify(out) });
}
const native = `window.__shared=[];window.ReactNativeWebView={postMessage:function(m){var o=JSON.parse(m);if(o.t==="share"){window.__shared.push(o.text);setTimeout(function(){window.RV.native({t:"shared",ok:true})},20)}if(o.t==="open")window.__shared.push(o.url);if(o.t==="needMedia")setTimeout(function(){window.RV.native({t:"media"})},30);}};
window.RVNative={platform:"ios",version:"1.0.10",push:false};try{localStorage.setItem("marushima-reversi-claimed","1")}catch(e){}`;
(async () => {
  const srv = http.createServer((req, res) => { const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0])); fs.readFile(p, (e, b) => { if (e) { res.writeHead(404); res.end(); return; } res.writeHead(200, { "content-type": p.endsWith(".html") ? "text/html" : "text/javascript" }); res.end(b); }); }).listen(PORT);
  const browser = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
  async function phone() {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ["camera", "microphone"] });
    await ctx.addInitScript(native); await ctx.route("**/functions/v1/rv-push", relay); await ctx.route("**/0.peerjs.com/**", r => r.abort());
    const page = await ctx.newPage(); page.on("pageerror", e => console.log("  pageerror:", e.message)); return page;
  }
  const vis = (p, id) => p.evaluate(i => !document.getElementById(i).hidden, id);
  // A：さそう
  const a = await phone(); await a.goto(HOST); await a.waitForTimeout(600);
  check(await vis(a, "codeBtn"), "A：まだ だれも いないとき 開始画面に「お誘いの番号を入れる」");
  await a.click("#callBtn"); await a.waitForTimeout(400);
  if (await vis(a, "nameOv")) { await a.fill("#myName", "ゆうくん"); await a.click("#nameOk"); await a.waitForTimeout(400); }
  if (await vis(a, "whoOv")) { await a.click("#whoNew"); }
  await a.waitForFunction(() => !document.getElementById("regOv").hidden, null, { timeout: 8000 }).catch(() => { });
  check(await a.evaluate(() => document.getElementById("regCode").textContent) === "482915" && await vis(a, "regCodeBox"), "A：さそう画面に 番号 482915 が 大きく出る");
  const msg = await a.evaluate(() => document.getElementById("regMsg").value);
  check(/「お誘いの番号」を聞かれたら 482915 と入れてください/.test(msg), "A：LINE の文面に 番号が入る");
  await a.click("#regLine"); await a.waitForTimeout(300);
  const sent = (await a.evaluate(() => window.__shared)).map(x => { try { return decodeURIComponent(x); } catch (e) { return x; } }).join("\n");
  check(/482915/.test(sent) && /[?&]c=482915/.test(sent), "A：送る文面に 番号、リンクにも c=482915");
  const aid = await a.evaluate(() => CALL.id);
  // B：アプリを入れたが 引きつげなかった → 番号を入れる
  const b = await phone(); await b.goto(HOST); await b.waitForTimeout(600);
  check(await vis(b, "codeBtn"), "B：開始画面に「お誘いの番号を入れる」");
  await b.click("#codeBtn"); await b.waitForTimeout(200);
  await b.fill("#codeIn", "12a3"); check(await b.evaluate(() => document.getElementById("codeIn").value) === "123", "B：数字だけ 入る");
  await b.click("#codeGo"); check(/6けた/.test(await b.evaluate(() => document.getElementById("codeErr").textContent)), "B：6けた でないと 注意");
  await b.fill("#codeIn", "111111"); await b.click("#codeGo"); await b.waitForTimeout(300);
  if (await vis(b, "nameOv")) { await b.fill("#myName", "ばあば"); await b.click("#nameOk"); await b.waitForTimeout(600); }
  check(await vis(b, "codeOv") && /見つかりません/.test(await b.evaluate(() => document.getElementById("codeErr").textContent)), "B：ちがう番号 →「見つかりませんでした」");
  await b.fill("#codeIn", "482915"); await b.click("#codeGo"); await b.waitForTimeout(1200);
  check(!(await vis(b, "codeOv")), "B：正しい番号 → 画面が 閉じる");
  const bp = await b.evaluate(() => JSON.parse(localStorage.getItem("marushima-reversi-people") || "[]"));
  check(bp.some(p => p.dev === aid && p.name === "ゆうくん"), "B：ゆうくんが とうろくした ひとに 入った");
  check(await b.evaluate(() => NET.role === "host" && target && target.name === "ゆうくん"), "B：そのまま ゆうくんを 待つ");
  check(log.some(x => x.op === "redeem" && x.code === "482915" && x.name === "ばあば"), "B：中継に 番号と 名前を 伝えた");
  // A：自分の番号は 使えない
  await a.goto(HOST); await a.waitForTimeout(500);
  await a.evaluate(() => { showCode(); }); await a.fill("#codeIn", "482915"); await a.click("#codeGo"); await a.waitForTimeout(400);
  check(/ご自分で送った/.test(await a.evaluate(() => document.getElementById("codeErr").textContent)), "A：自分の番号を入れると「ご自分で送った番号です」");
  await browser.close(); srv.close();
  console.log(fail ? `\n${fail} 件 NG` : "\nぜんぶ OK"); process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
