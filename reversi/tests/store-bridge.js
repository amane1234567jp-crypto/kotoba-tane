// アプリの保存の控え（app/storeBridge.js）の検算。
// 本物のゲーム（play.html）を「番号のちがう2つのサーバー」で開き、
// 1回目に入れた名前・登録した人が、2回目（＝保存場所が変わった起動）でも残っているかを見る。
// 実行：node reversi/tests/store-bridge.js
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const { storeScript } = require("../app/storeBridge");
const ROOT = path.join(__dirname, "..");

function serve(port) {
  return new Promise(ok => {
    const s = http.createServer((req, res) => {
      const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
      fs.readFile(p, (e, b) => { if (e) { res.writeHead(404); res.end(); return; } res.writeHead(200, { "content-type": p.endsWith(".html") ? "text/html" : p.endsWith(".js") ? "text/javascript" : "application/octet-stream" }); res.end(b); });
    }).listen(port, "127.0.0.1", () => ok(s));
  });
}

let fail = 0;
const check = (ok, msg) => { console.log((ok ? "OK  " : "NG  ") + msg); if (!ok) fail++; };

(async () => {
  const s1 = await serve(47913), s2 = await serve(52001);
  const browser = await chromium.launch();
  let stored = {};   // 殻のファイルのかわり

  async function open(port, snapshot) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.exposeFunction("__toNative", m => { const o = JSON.parse(m); if (o.t === "store") stored = o.data; });
    // 殻とおなじ順：RVNative と ReactNativeWebView を用意 → 控えを戻すスクリプト
    await page.addInitScript(`window.ReactNativeWebView={postMessage:function(m){window.__toNative(m)}};window.RVNative={platform:"ios",version:"1.0.4",push:false};`);
    await page.addInitScript(storeScript(snapshot));
    await page.goto(`http://127.0.0.1:${port}/play.html`);
    await page.waitForTimeout(800);
    return { ctx, page };
  }

  // 1回目の起動：名前を入れる・登録した人を1人入れる
  let { ctx, page } = await open(47913, {});
  await page.evaluate(() => {
    const i = document.getElementById("myName"); i.value = "ばあば"; i.dispatchEvent(new Event("input"));
    localStorage.setItem("marushima-reversi-partners", JSON.stringify([{ name: "ゆうくん", dev: "abc" }]));
  });
  await page.waitForTimeout(600);
  check(JSON.parse(stored["marushima-reversi-cfg"] || "{}").myName === "ばあば", "書いた中身が 殻へ届く（名前）");
  check(!!stored["marushima-reversi-partners"], "書いた中身が 殻へ届く（登録した人）");
  await ctx.close();

  // 2回目の起動：番号のちがうサーバー（保存場所が空）＋ 殻の控え
  ({ ctx, page } = await open(52001, stored));
  const got = await page.evaluate(() => ({ cfg: JSON.parse(localStorage.getItem("marushima-reversi-cfg") || "{}"), p: localStorage.getItem("marushima-reversi-partners"), v: document.getElementById("myName").value }));
  check(got.cfg.myName === "ばあば", "保存場所が変わっても 名前が もどる");
  check(!!got.p && got.p.includes("ゆうくん"), "保存場所が変わっても 登録した人が もどる");
  // 名前の入力をうながす条件（CFG.myName が空）にならないこと：ゲームの CFG を通して確かめる
  await page.evaluate(() => { const b = document.getElementById("nameBtn2"); return b && b.textContent; }).then(t => check(/ばあば/.test(t || ""), "ゲームの中でも 名前が 入っている（" + t + "）"));
  await ctx.close();

  // 端末の番号（よびだし・登録の かぎ）も 変わらないこと
  const dev1 = JSON.parse(stored["marushima-reversi-dev"] || "{}").id;
  ({ ctx, page } = await open(47913, stored));
  const dev2 = await page.evaluate(() => JSON.parse(localStorage.getItem("marushima-reversi-dev") || "{}").id);
  check(!!dev1 && dev1 === dev2, "端末の番号が 起動ごとに変わらない（" + dev1 + "）");
  await ctx.close();

  // 控えが空のとき（はじめての起動）は ふつうに始まる
  stored = {};
  ({ ctx, page } = await open(52001, {}));
  check(await page.evaluate(() => document.getElementById("myName").value === ""), "控えが空なら ふつうに始まる（名前は空）");
  await page.waitForTimeout(400);
  check(!!stored["marushima-reversi-dev"], "はじめての起動でも 控えが作られる");
  await ctx.close();

  await browser.close(); s1.close(); s2.close();
  console.log(fail ? `\n${fail} 件 NG` : "\nぜんぶ OK");
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
