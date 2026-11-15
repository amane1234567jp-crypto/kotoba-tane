// 招待の引きつぎを 本物の公開ページと中継（Supabase）で通しで確かめる（GitHub Actions で動かす）
// 1) iPhone のふりで 案内ページ（?r=部屋&n=名前）を開く → 中継に記録  2) 同じ端末のふりで アプリの中のゲーム（play.html・RVNative あり）を はじめて開く
// 3) 照合で 同じ部屋の ?r= に移れば 成功
const { chromium, devices } = require("playwright");
const BASE = "https://amane1234567jp-crypto.github.io/kotoba-tane/reversi/";
(async () => {
  const room = "e2e" + Math.random().toString(36).slice(2, 10);
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices["iPhone 13"], locale: "ja-JP", timezoneId: "Asia/Tokyo" });
  const land = await ctx.newPage();
  const hint = land.waitForResponse(r => r.url().includes("rv-push"), { timeout: 20000 }).catch(() => null);
  await land.goto(BASE + "?r=" + room + "&n=" + encodeURIComponent("テスト"), { waitUntil: "load" });
  const h = await hint; console.log("1) 案内ページ:", land.url(), "記録:", h ? h.status() + " " + await h.text() : "なし");
  console.log("   アプリで ひらく:", await land.getAttribute("#open", "href"));
  await new Promise(z => setTimeout(z, 2000));
  const ctx2 = await b.newContext({ ...devices["iPhone 13"], locale: "ja-JP", timezoneId: "Asia/Tokyo" });
  await ctx2.addInitScript(() => { window.RVNative = { platform: "ios", version: "1.0.2", push: false }; });
  const app = await ctx2.newPage();
  const claim = app.waitForResponse(r => r.url().includes("rv-push") && (r.request().postData() || "").includes("claim"), { timeout: 30000 }).catch(() => null);
  await app.goto(BASE + "play.html", { waitUntil: "load" });
  const c = await claim; console.log("2) アプリ初回の照合:", c ? c.status() + " " + await c.text() : "なし");
  await app.waitForURL(u => String(u).includes("r=" + room), { timeout: 15000 }).catch(() => { });
  const ok = app.url().includes("r=" + room);
  console.log("3) アプリの行き先:", app.url(), ok ? "→ 成功（その部屋につながる）" : "→ 失敗");
  // 2回目に開いたときは 照合しない（1回だけ）
  await b.close();
  process.exit(ok ? 0 : 1);
})();
