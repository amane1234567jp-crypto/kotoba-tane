// 「とうろく」と「あそぶ」を分けた流れ（2026-11-19）の検算。中継（Supabase）は このテストの中の にせもの で代わりをする。
// 本物の中継・本物の通話は reversi/tests/regplay-e2e.js（GitHub Actions）で確かめる。
// 実行：node reversi/tests/regplay.js
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.join(__dirname, "..");
const PORT = 47916, HOST = `http://127.0.0.1:${PORT}/play.html`;
let fail = 0;
const check = (ok, msg) => { console.log((ok ? "OK  " : "NG  ") + msg); if (!ok) fail++; };
const vis = (page, id) => page.evaluate(i => { const e = document.getElementById(i); return !!e && !e.hidden && getComputedStyle(e).display !== "none"; }, id);
const txt = (page, id) => page.evaluate(i => document.getElementById(i).textContent, id);
const ppl = page => page.evaluate(() => JSON.parse(localStorage.getItem("marushima-reversi-people") || "[]"));

// にせの中継：reg（端末の登録）・accept（とうろくを残す）・pending（受けとる）だけ
const pairs = [], accepts = [], waitsLog = [];
async function relay(route) {
  let b = {}; try { b = JSON.parse(route.request().postData() || "{}"); } catch (e) { }
  let out = { ok: true };
  if (b.op === "accept") { pairs.push({ to: b.to, from: b.id, name: b.name }); accepts.push({ to: b.to, from: b.id, name: b.name }); }
  if (b.op === "wait") waitsLog.push({ from: b.id, to: b.to, room: b.room });
  if (b.op === "pending") { const mine = pairs.filter(p => p.to === b.id); for (const m of mine) pairs.splice(pairs.indexOf(m), 1); out = { ok: true, list: mine.map(m => ({ dev: m.from, name: m.name })) }; }
  if (b.op === "call") out = { ok: false, reason: "nosub" };
  await route.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify(out) });
}
const NATIVE = `window.__shared=[];window.__opened=[];window.__media=0;
window.ReactNativeWebView={postMessage:function(m){try{var o=JSON.parse(m);if(o.t==="open"){window.__opened.push(o.url);var k=o.url.indexOf("text=")>=0?o.url.indexOf("text=")+5:(o.url.indexOf("msg/text/")>=0?o.url.indexOf("msg/text/")+9:-1);if(k>=0)window.__shared.push(decodeURIComponent(o.url.slice(k)));}if(o.t==="share"){window.__shared.push(o.text);var R=window.__shareResult||{ok:true,act:"jp.naver.line.Share"};setTimeout(function(){window.RV.native({t:"shared",ok:R.ok,act:R.act})},50);}if(o.t==="needMedia")setTimeout(function(){window.RV&&window.RV.native({t:"media"})},30);}catch(e){}}};
window.RVNative={platform:"ios",version:"1.0.5",push:false};
try{localStorage.setItem("marushima-reversi-claimed","1")}catch(e){}
(function(){var md=navigator.mediaDevices;if(md&&md.getUserMedia){var g=md.getUserMedia.bind(md);md.getUserMedia=function(c){window.__media++;return g(c)}}})();`;

(async () => {
  const srv = http.createServer((req, res) => {
    const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
    fs.readFile(p, (e, b) => { if (e) { res.writeHead(404); res.end(); return; } res.writeHead(200, { "content-type": p.endsWith(".html") ? "text/html" : "application/octet-stream" }); res.end(b); });
  }).listen(PORT, "127.0.0.1");
  const browser = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
  async function phone() {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ["camera", "microphone"] });
    await ctx.route(/supabase\.co/, relay);
    await ctx.route(/metered|ntfy/, r => r.fulfill({ status: 200, contentType: "application/json", body: "[]" }));
    await ctx.addInitScript(NATIVE);
    const page = await ctx.newPage();
    page.on("pageerror", e => console.log("  pageerror:", e.message));
    return { ctx, page };
  }
  const open = async (page, q) => { await page.goto(HOST + (q || "")); await page.waitForTimeout(700); };

  // ---------- A（ゆうくん）が なかまを さそう ----------
  const { page: a } = await phone();
  await open(a);
  const aid = await a.evaluate(() => CALL.id);
  await a.click("#callBtn"); await a.fill("#myName", "ゆうくん"); await a.click("#nameOk"); await a.waitForTimeout(200);
  await a.click("#whoNew"); await a.waitForTimeout(300);
  check(await vis(a, "regOv"), "A：「なかまを さそう」が 出る");
  check(await a.evaluate(() => window.__media) === 0, "A：カメラは つかない");
  check(await a.evaluate(() => !document.body.classList.contains("playing")), "A：ゲーム画面に ならない");
  await a.click("#regLine"); await a.waitForTimeout(200);
  const opened = (await a.evaluate(() => window.__opened))[0] || "";
  check(opened.startsWith("https://line.me/R/share?text="), "A：「LINEで おくる」は LINE を 直接ひらく");
  const shared = (await a.evaluate(() => window.__shared))[0] || "";
  check(/^ゆうくんです。テレビ電話をしながらリバーシで遊べるアプリがあるので/.test(shared) && !/なかま|まだ ゲーム/.test(shared), "A：送る文は 決めた文（なかま・まだゲーム… は 入らない）");
  check(/LINEで送ったら/.test(await txt(a, "ringNote")), "A：送ったか わからないので「おくったら〜」と 言う（「おくりました」と 言いきらない）");
  const regUrl = (shared.match(/https:\/\/\S+/) || [""])[0];
  check(/[?&]m=reg/.test(regUrl) && !/openExternalBrowser/.test(regUrl) && !/[?&]r=/.test(regUrl) && regUrl.includes("fd=" + aid), "A：リンクは とうろく用（部屋なし・A の端末番号）");
  check(!(await vis(a, "regOv")), "A：LINE を ひらくと 開始画面に もどる");
  // 送る前に 本文を 見て 直せる（LINE 側では 見えない：11/21 実機）
  await a.evaluate(() => showRegInvite()); await a.waitForTimeout(200);
  check(await a.evaluate(() => document.getElementById("regMsg").value) === shared, "A：さそう画面に 送る文面が リンクごと 出ている（送った文面と おなじ）");
  check(!(await vis(a, "regMsgReset")), "A：直していなければ「もとの ぶんに もどす」は 出ない");
  await a.fill("#regMsg", "ばあばへ\nこんど いっしょに リバーシ しよう！");
  check(await vis(a, "regMsgReset"), "A：直すと「もとの ぶんに もどす」が 出る");
  await a.click("#regLine"); await a.waitForTimeout(200);
  const edited = (await a.evaluate(() => window.__shared)).pop() || "";
  check(edited.startsWith("ばあばへ\nこんど いっしょに リバーシ しよう！\nhttps://") && /[?&]m=reg/.test(edited), "A：直した本文で 送る（リンクは 最後に つく）");
  await a.evaluate(() => showRegInvite()); await a.waitForTimeout(100);
  check((await a.evaluate(() => document.getElementById("regMsg").value)).startsWith("ばあばへ"), "A：直した本文は 次も 出る");
  await a.click("#regMsgReset");
  check((await a.evaluate(() => document.getElementById("regMsg").value)).startsWith("ゆうくんです。テレビ電話を"), "A：「もとの ぶんに もどす」で もどる");
  await a.fill("#regMsg", "ばあばへ\nhttps://www.uchinoaji.com/rv/?m=reg&n=こわれ");
  await a.click("#regLine"); await a.waitForTimeout(200);
  const fixed = (await a.evaluate(() => window.__shared)).pop() || "";
  check(fixed.startsWith("ばあばへ\nhttps://") && fixed.includes("fd=" + aid) && fixed.split("https://").length === 2, "A：リンクを 書きかえて 壊しても 正しい リンクで 送る");
  await a.evaluate(() => showRegInvite());
  await a.fill("#regMsg", "");
  await a.click("#regLine"); await a.waitForTimeout(200);
  check(/^https:\/\/\S+m=reg/.test((await a.evaluate(() => window.__shared)).pop() || ""), "A：本文を 消しても リンクは 送る");
  await a.click("#callBtn").catch(() => { }); await a.evaluate(() => { document.getElementById("whoOv").hidden = true; });
  await a.evaluate(() => showRegInvite()); await a.click("#regMsgReset").catch(() => { }); await a.click("#regClose");

  // ほかの アプリで おくる（共有画面）：閉じただけ／コピー／送った
  check(await a.evaluate(() => !document.querySelector("#regOv .otherFold").open), "A：「ほかの方法で送る」は 最初 たたんである（LINE が きほん）");
  await a.evaluate(() => { document.querySelector("#regOv .otherFold").open = true; });
  await a.evaluate(() => { window.__shareResult = { ok: false, act: "" }; document.getElementById("regOv").hidden = false; });
  await a.click("#regOther"); await a.waitForTimeout(300);
  check(await vis(a, "regOv"), "A：共有画面を 閉じただけなら さそう画面の まま（「おくりました」と 出ない）");
  await a.evaluate(() => { window.__shareResult = { ok: true, act: "com.apple.UIKit.activity.CopyToPasteboard" }; });
  await a.click("#regOther"); await a.waitForTimeout(300);
  check(!(await vis(a, "regOv")) && /コピーしました/.test(await txt(a, "ringNote")), "A：コピーを えらんだら「コピーしました。はりつけて おくってね」");
  await a.evaluate(() => { window.__shareResult = { ok: true, act: "jp.naver.line.Share" }; document.getElementById("regOv").hidden = false; });
  await a.click("#regOther"); await a.waitForTimeout(300);
  check(!(await vis(a, "regOv")) && /送りました/.test(await txt(a, "ringNote")), "A：本当に 送ったときだけ「おくりました」");

  // ---------- B（おばあちゃん）が リンクを ひらく ----------
  const { page: g } = await phone();
  await open(g, "?" + regUrl.split("?")[1]);
  const gid = await g.evaluate(() => CALL.id);
  check(await vis(g, "nameOv"), "B：はじめては なまえを きかれる");
  check(!(await vis(g, "inviteOv")) && await g.evaluate(() => NET.role === null), "B：対局には ならない");
  await g.fill("#myName", "ばあば"); await g.click("#nameOk"); await g.waitForTimeout(400);
  // 2026-11-26：登録したら そのまま ゆうくんを 待つ（LINE の画面は 出さない）
  await g.waitForFunction(() => /ゆうくんを とうろくしました/.test(document.getElementById("camA").textContent + document.getElementById("camB").textContent), null, { timeout: 15000 }).catch(() => { });
  check(await g.evaluate(() => NET.role === "host") && !(await vis(g, "inviteOv")), "B：登録したら そのまま ゆうくんを 待つ（LINE の画面は 出さない）");
  await g.waitForTimeout(600);
  check(await g.evaluate(() => target && target.name === "ゆうくん") && waitsLog.some(w => w.from === gid && w.to === aid), "B：ゆうくんを 待っていると 中継に 伝えた（wait）");
  check(/ゆうくんに LINEで 知らせる/.test(await txt(g, "resendBtn")) && await vis(g, "resendBtn"), "B：「ゆうくんに LINEで 知らせる」を 出しておく");
  check(await g.evaluate(() => location.search === ""), "B：リンクの中身は 消す（開きなおしても くりかえさない）");
  let gp = await ppl(g);
  check(gp.length === 1 && gp[0].dev === aid && gp[0].name === "ゆうくん", "B：とうろくした ひと に ゆうくん（A の端末番号）");
  check(accepts.some(p => p.to === aid && p.from === gid && p.name === "ばあば"), "B：中継に「ばあば → ゆうくん」の とうろくを 残した");
  await open(g);   // 開始画面に もどる

  // ---------- A が うけとる（開いたまま：20秒ごとに たしかめる） ----------
  await a.waitForFunction(() => /ばあばが とうろく しました/.test(document.getElementById("ringNote").textContent), null, { timeout: 30000 }).catch(() => { });
  check(/ばあばが とうろく しました/.test(await txt(a, "ringNote")), "A：開いたままでも「ばあばが とうろく しました」");
  let ap = await ppl(a);
  check(ap.length === 1 && ap[0].dev === gid && ap[0].name === "ばあば", "A：とうろくした ひと に ばあば（B の端末番号）");

  // ---------- B（さそわれた側）から あそぶ ----------
  await g.click("#callBtn"); await g.waitForTimeout(300);
  check(/ゆうくんと あそぶ/.test(await txt(g, "whoList")), "B：だれと あそぶ？ に ゆうくん");
  await g.click("#whoList button");
  await g.waitForFunction(() => !document.getElementById("inviteOv").hidden, null, { timeout: 15000 }).catch(() => { });
  check(await vis(g, "inviteOv") && /ゆうくんに知らせる/.test(await txt(g, "inviteTitle")), "B：自分の部屋で まって「ゆうくんに知らせる」");
  await g.evaluate(() => document.getElementById("lineBtn").click());
  const waitTxt = await g.evaluate(() => document.getElementById("camB").textContent + document.getElementById("camA").textContent);
  await g.waitForTimeout(200);
  const playMsg = (await g.evaluate(() => window.__shared)).pop() || "";
  const playUrl = (playMsg.match(/https:\/\/\S+/) || [""])[0];
  const groom = await g.evaluate(() => NET.room);
  check(/いまリバーシで遊べるよ/.test(playMsg) && /[?&]m=play/.test(playUrl) && playUrl.includes("r=" + groom) && playUrl.includes("fd=" + gid), "B：LINE の文は あそぶリンク（B の部屋・B の端末番号）");
  check(/ゆうくんを まっています/.test(waitTxt), "B：「ゆうくんを まっています」");

  // ---------- A が あそぶリンクを ひらく ----------
  await open(a, "?" + playUrl.split("?")[1]);
  check(await a.evaluate(() => NET.role === "guest" && NET.room) === groom, "A：あそぶリンクで B の部屋に はいる");
  ap = await ppl(a);
  check(ap.length === 1 && ap[0].dev === gid && ap[0].room === groom, "A：ばあばは 1人のまま（部屋を おぼえる）");

  // ---------- むかしの リンク（1.0.4 までの招待）----------
  const { page: c } = await phone();
  await open(c, `?r=old12345&n=${encodeURIComponent("おじいちゃん")}&fd=${gid}`);
  check(await c.evaluate(() => NET.role === "guest"), "むかしのリンク：これまでどおり 対局の 招待として ひらく");
  const cp = await ppl(c);
  check(cp.length === 1 && cp[0].room === "old12345" && cp[0].dev === gid, "むかしのリンク：とうろくも する");

  // ---------- 1.0.4 までの記録の ひきつぎ ----------
  const { page: d } = await phone();
  await open(d);
  await d.evaluate(() => {
    localStorage.removeItem("marushima-reversi-people");
    localStorage.setItem("marushima-reversi-partners", JSON.stringify([{ room: "room1111", name: "ばあば", dev: "DDDDDDDDDDDDDDDDDDDD", at: 1 }]));
    localStorage.setItem("marushima-reversi-callers", JSON.stringify([{ dev: "EEEEEEEEEEEEEEEEEEEE", name: "じいじ", at: 2 }]));
    const k = "marushima-reversi-cfg", o = JSON.parse(localStorage.getItem(k) || "{}"); o.myName = "まご"; localStorage.setItem(k, JSON.stringify(o));
  });
  await open(d);
  await d.click("#callBtn"); await d.waitForTimeout(300);
  const wl = await txt(d, "whoList");
  check(/ばあばと あそぶ/.test(wl) && /じいじと あそぶ/.test(wl), "1.0.4 までの とうろくが そのまま 出る");
  await d.click("#whoClose");

  // ---------- とうろくを けす ----------
  await d.evaluate(() => { syncPanel(); document.getElementById("settings").hidden = false; });
  const rows = await d.$$("#peopleSet .personRow button");
  check(rows.length === 2, "せっていに 2人 ならぶ");
  await rows[0].click(); await d.waitForTimeout(100);
  check((await ppl(d)).length === 2, "1回 おしただけでは けさない");
  await rows[0].click(); await d.waitForTimeout(100);
  check((await ppl(d)).length === 1, "2回 おすと けす");

  // ---------- 自分の さそいリンクを 自分で ひらいた ----------
  const { page: e } = await phone();
  await open(e); const eid = await e.evaluate(() => CALL.id);
  await open(e, `?m=reg&n=x&fd=${eid}`);
  check(/じぶんが おくった/.test(await txt(e, "ringNote")) && (await ppl(e)).length === 0, "自分の リンクでは 自分を とうろくしない");

  await browser.close(); srv.close();
  console.log(fail ? `\n${fail} 件 NG` : "\nぜんぶ OK");
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
