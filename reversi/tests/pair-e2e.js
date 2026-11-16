// おたがいの登録を 本物の中継で通しで確かめる：招待した人A → 招待リンクを開いた人B（accept）→ A が開きなおすと B が「とうろくした ひと」に入る
const { chromium, devices } = require("playwright");
const BASE = "https://amane1234567jp-crypto.github.io/kotoba-tane/reversi/";
(async () => {
  const b = await chromium.launch();
  const mk = async () => { const c = await b.newContext({ ...devices["iPhone 13"], locale: "ja-JP", timezoneId: "Asia/Tokyo" }); await c.addInitScript(() => { window.RVNative = { platform: "ios", version: "1.0.3", push: false }; try { localStorage.setItem("marushima-reversi-claimed", "1"); } catch (e) {} }); return c; };
  const A = await mk(); const a = await A.newPage();
  await a.goto(BASE + "play.html", { waitUntil: "load" }); await a.waitForTimeout(3000);
  const aid = await a.evaluate(() => JSON.parse(localStorage.getItem("marushima-reversi-dev")).id);
  console.log("A の端末:", aid.slice(0, 6) + "…");
  const B = await mk(); const g = await B.newPage();
  const acc = g.waitForResponse(r => (r.request().postData() || "").includes('"accept"'), { timeout: 20000 }).catch(() => null);
  await g.goto(BASE + "play.html?r=e2eroom" + Date.now().toString(36) + "&n=" + encodeURIComponent("あまね") + "&fd=" + aid, { waitUntil: "load" });
  await g.evaluate(() => { try { const k = "marushima-reversi-cfg", o = JSON.parse(localStorage.getItem(k) || "{}"); o.myName = "おばあちゃん"; localStorage.setItem(k, JSON.stringify(o)); } catch (e) {} });
  const r = await acc; console.log("B → accept:", r ? r.status() + " " + await r.text().catch(() => "") : "なし");
  console.log("B の とうろくした ひと:", await g.evaluate(() => localStorage.getItem("marushima-reversi-partners")));
  await a.reload({ waitUntil: "load" }); await a.waitForTimeout(4000);
  const callers = await a.evaluate(() => localStorage.getItem("marushima-reversi-callers"));
  const note = await a.evaluate(() => !document.getElementById("ringNote").hidden && document.getElementById("ringNote").textContent);
  console.log("A が受けとった:", callers, "／ 開始画面:", note);
  const ok = !!callers && callers.includes("dev");
  console.log(ok ? "→ 成功" : "→ 失敗");
  await b.close(); process.exitCode = ok ? 0 : 1;
})();
