// 待ちあわせ（2026-11-23）の検算：2人が 相手の名前を押したとき 必ず 片方の部屋に そろうか。
// 中継は にせもの（wait／peek／unwait）。本物の通話は reversi/tests/meet-e2e.js（Actions）で確かめる。
// 実行：node reversi/tests/meet.js
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.join(__dirname, "..");
const PORT = 47922, U = `http://127.0.0.1:${PORT}/play.html`;
let fail = 0; const check = (ok, m) => { console.log((ok ? "OK  " : "NG  ") + m); if (!ok) fail++; };
let waits = {}, clockSkew = 0;
async function relay(route) {
  let b = {}; try { b = JSON.parse(route.request().postData() || "{}"); } catch (e) { }
  const now = Date.now() + clockSkew;
  let out = { ok: true };
  if (b.op === "unwait") delete waits[b.id];
  if (b.op === "wait") waits[b.id] = { to: b.to, room: b.room, at: now };
  if (b.op === "wait" || b.op === "peek") { const w = waits[b.to]; out.other = w && w.to === b.id && now - w.at < 20000 ? { room: w.room } : null; }
  if (b.op === "call") out = { ok: false, reason: "nosub" };
  if (b.op === "pending") out = { ok: true, list: [] };
  await route.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify(out) });
}
const DA = "AAAAAAAAAAAAAAAAAAAAAAAA", DB = "BBBBBBBBBBBBBBBBBBBBBBBB";   // B の ほうが 大きい → 同時なら B が A の部屋へ
(async () => {
  const srv = http.createServer((q, r) => { fs.readFile(path.join(ROOT, q.url.split("?")[0]), (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { "content-type": q.url.includes(".html") ? "text/html" : "application/octet-stream" }); r.end(b); }); }).listen(PORT, "127.0.0.1");
  const br = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
  async function phone(me, other, myName, otherName) {
    const c = await br.newContext({ permissions: ["camera", "microphone"] });
    await c.route(/supabase\.co/, relay); await c.route(/metered|ntfy/, r => r.fulfill({ status: 200, body: "{}" }));
    await c.addInitScript(`window.ReactNativeWebView={postMessage:function(m){try{var o=JSON.parse(m);if(o.t==="needMedia")setTimeout(function(){window.RV&&window.RV.native({t:"media"})},30)}catch(e){}}};window.RVNative={platform:"ios",version:"1.0.8",push:false};
      if(!localStorage.getItem("marushima-reversi-people")){localStorage.setItem("marushima-reversi-claimed","1");
      localStorage.setItem("marushima-reversi-dev",JSON.stringify({id:"${me}",secret:"ssssssssssssssssssssssss"}));
      localStorage.setItem("marushima-reversi-cfg",JSON.stringify({myName:"${myName}",hasPartner:1}));
      localStorage.setItem("marushima-reversi-people",JSON.stringify([{dev:"${other}",room:"",name:"${otherName}",at:1}]));}`);
    const p = await c.newPage(); p.on("pageerror", e => console.log("  pageerror:", e.message));
    await p.goto(U); await p.waitForTimeout(700); return p;
  }
  const press = async p => { await p.click("#callBtn"); await p.waitForTimeout(200); await p.click("#whoList button"); };
  const state = p => p.evaluate(() => ({ role: NET.role, room: NET.room, q: location.search }));

  // ① A が先に押して待つ → あとから B が押す → B は A の部屋へ（LINE いらず）
  waits = {};
  let a = await phone(DA, DB, "あらた", "けい"), b = await phone(DB, DA, "けい", "あらた");
  await press(a); await a.waitForTimeout(1500);
  const ar = (await state(a)).room;
  check(!!waits[DA] && waits[DA].to === DB && waits[DA].room === ar, "① A：自分の部屋で けいを 待っていると 中継に伝えた");
  await press(b); await b.waitForURL(/[?&]go=1/, { timeout: 5000 }).catch(() => { }); await b.waitForTimeout(800);
  let bs = await state(b);
  check(bs.role === "guest" && bs.room === ar, "① B：あらたが 待っていたので その部屋に 入った（" + bs.room + "）");
  check(!(await b.evaluate(() => !document.getElementById("inviteOv").hidden)), "① B：LINE で知らせる画面は 出ない");
  check(await b.evaluate(() => document.getElementById("startOv").hidden || !!NET.peer), "① B：「はじめる」を押さなくても つなぎに行く");
  await a.context().close(); await b.context().close();

  // ② ほぼ同時に 押す → 必ず 片方（端末番号の 大きい B）が 相手の部屋へ
  waits = {};
  a = await phone(DA, DB, "あらた", "けい"); b = await phone(DB, DA, "けい", "あらた");
  await Promise.all([press(a), press(b)]);
  await b.waitForURL(/[?&]go=1/, { timeout: 12000 }).catch(() => { }); await b.waitForTimeout(1000);
  const as2 = await state(a), bs2 = await state(b);
  check(as2.role === "host" && bs2.role === "guest" && bs2.room === as2.room, `② 同時に押しても A＝待つ・B＝A の部屋へ に そろう（A:${as2.role} ${as2.room} / B:${bs2.role} ${bs2.room}）`);
  check(!/go=1/.test(as2.q), "② A は 自分の部屋のまま（移らない）");
  await a.context().close(); await b.context().close();

  // ③ A が待つのを やめた（とちゅうで閉じて unwait も 届かなかった）→ 20秒たったら B は 入りに行かず 自分で待つ
  waits = { [DA]: { to: DB, room: "oldroom1", at: Date.now() - 30000 } };
  b = await phone(DB, DA, "けい", "あらた");
  await press(b); await b.waitForTimeout(2500);
  const bs3 = await state(b);
  check(bs3.role === "host" && bs3.room !== "oldroom1", "③ 古い待ち（20秒より前）には 入らず、自分の部屋で 待つ");
  check(await b.evaluate(() => !document.getElementById("inviteOv").hidden), "③ そのときは これまでどおり「あらたに知らせる」（LINE）が 出る");
  check(!!waits[DB] && waits[DB].to === DA, "③ B が 待っていると 中継に伝えた");
  // B が メニューに もどる → 待ちを 消す
  await b.evaluate(() => toMenu()); await b.waitForTimeout(800);
  check(!waits[DB], "③ やめたら 待ちを 消す（unwait）");
  await b.context().close();

  await br.close(); srv.close();
  console.log(fail ? `\n${fail} 件 NG` : "\nぜんぶ OK"); process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
