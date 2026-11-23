// 待ちあわせ（2026-11-23）を 本物の中継（rv-push v9）と 本物の通話で：2人が 同時に 相手の名前を押して、LINE なしで つながるか
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.join(process.env.GITHUB_WORKSPACE || path.join(__dirname, "../.."), "reversi");
const PORT = 47923, U = `http://localhost:${PORT}/play.html`;
let fail = 0; const check = (ok, m) => { console.log((ok ? "OK  " : "NG  ") + m); if (!ok) fail++; };
(async () => {
  const srv = http.createServer((q, r) => { const p = path.join(ROOT, decodeURIComponent(q.url.split("?")[0])); fs.readFile(p, (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { "content-type": p.endsWith(".html") ? "text/html" : "application/octet-stream" }); r.end(b); }); }).listen(PORT);
  const br = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
  async function phone(name) {
    const c = await br.newContext({ permissions: ["camera", "microphone"], locale: "ja-JP" });
    await c.addInitScript(`window.ReactNativeWebView={postMessage:function(m){try{var o=JSON.parse(m);if(o.t==="needMedia")setTimeout(function(){window.RV&&window.RV.native({t:"media"})},30)}catch(e){}}};window.RVNative={platform:"ios",version:"1.0.8",push:false};try{localStorage.setItem("marushima-reversi-claimed","1")}catch(e){}`);
    const p = await c.newPage(); p.on("pageerror", e => console.log("  pageerror:", e.message));
    await p.goto(U); await p.waitForTimeout(1500);
    await p.evaluate(n => { CFG.myName = n; CFG.hasPartner = 1; saveCfg(); }, name);
    return p;
  }
  const a = await phone("あらたE2E"), b = await phone("けいE2E");
  const ida = await a.evaluate(() => CALL.id), idb = await b.evaluate(() => CALL.id);
  await a.evaluate(([d, n]) => { localStorage.setItem("marushima-reversi-people", JSON.stringify([{ dev: d, room: "", name: n, at: 1 }])); }, [idb, "けいE2E"]);
  await b.evaluate(([d, n]) => { localStorage.setItem("marushima-reversi-people", JSON.stringify([{ dev: d, room: "", name: n, at: 1 }])); }, [ida, "あらたE2E"]);
  await a.reload(); await b.reload(); await a.waitForTimeout(2500); await b.waitForTimeout(2500);   // 起動で 中継に 登録（reg）
  const press = async p => { await p.click("#callBtn"); await p.waitForTimeout(300); await p.click("#whoList button"); };
  await Promise.all([press(a), press(b)]);
  const okA = await a.waitForFunction(() => NET.open, null, { timeout: 90000 }).then(() => true).catch(() => false);
  const okB = await b.waitForFunction(() => NET.open, null, { timeout: 10000 }).then(() => true).catch(() => false);
  const sa = await a.evaluate(() => [NET.role, NET.room]), sb = await b.evaluate(() => [NET.role, NET.room]);
  check(okA && okB, `2人が 同時に 名前を押して、LINE なしで つながった（A:${sa} B:${sb}）`);
  check(sa[1] === sb[1] && sa[0] !== sb[0], "片方が 待ち・片方が 入る に そろった");
  await br.close(); srv.close();
  console.log(fail ? `\n${fail} 件 NG` : "\nぜんぶ OK"); process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
