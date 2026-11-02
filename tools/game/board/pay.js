/* ================= コースの かぎ・ぜんぶ ひらく（2026-11-02） =================
   基本は むりょう。PAY_FREE の コースだけ さいしょから あそべて、ほかは 100円の「ぜんぶ ひらく」を かうと ひらく（1かい かえば ずっと）。
   かぎの コースを おすと ぽにーが「おうちの ひとに きいてみてね」（声つき）。おうちの ひとは かけざんの こたえを 入れて（こども よけ）、かう・かいものを もどす。
   ストアの アプリでは Capacitor の プラグイン（KotobaPay：buy() / restore() が {ok:true} を かえす）を つかう。
   ブラウザ（いまの 公開ページ）は ためしばん：おかねは かからず、そのまま ひらく。 */
const PAY_FREE = new Set([
  "kousha", "kyuushoku", "yasumi",      // がっこう
  "kokugo", "sansu",                    // じゅぎょう
  "toukou", "omise", "densha",          // まち・おでかけ
  "kouen", "ouchi1",                    // おうち・あそび
  "kikikaesu", "sos",                   // きもちを つたえる
  "komatta",                            // かんがえる
  "long", "kimochi", "dekigoto",        // ロングコース
]);
const PAY_PRICE = "100円", PAY_KEY = "kotoba-tane-unlock";
const PAY = {
  get on() { try { return localStorage.getItem(PAY_KEY) === "1"; } catch (e) { return false; } },
  set on(v) { try { v ? localStorage.setItem(PAY_KEY, "1") : localStorage.removeItem(PAY_KEY); } catch (e) { } },
  native() { try { const C = window.Capacitor; return C && C.isNativePlatform && C.isNativePlatform() && C.Plugins && C.Plugins.KotobaPay || null; } catch (e) { return null; } },
  async buy() { const N = this.native(); if (!N) return { ok: true, trial: true }; try { return await N.buy({ product: "kotoba_tane_all" }); } catch (e) { return { ok: false, err: String(e && e.message || e) }; } },
  async restore() { const N = this.native(); if (!N) return { ok: this.on, trial: true }; try { return await N.restore({ product: "kotoba_tane_all" }); } catch (e) { return { ok: false, err: String(e && e.message || e) }; } },
};
function payLocked(id) { return !!id && !PAY.on && !PAY_FREE.has(id); }
// 声：メニューでは ステージの 声が よみこまれて いないので、packs/pay.json を その ときに よむ
async function paySay(key) {
  try { if (!AUD[key]) { const q = await fetch("packs/pay.json", { cache: "no-cache" }); if (q.ok) { const d = await q.json(); Object.keys(d).forEach(k => AUD[k] = "data:audio/mpeg;base64," + d[k]); } }
    if (!AUD[key]) return; audio(); try { if (ctx.state !== "running") await ctx.resume(); } catch (e) { }
    const buf = await voiceBuf(key); if (!buf) return; payStop(); const s = ctx.createBufferSource(); s.buffer = buf; s.connect(analyser); s.start(); PAY.src = s;
    await new Promise(r => { s.onended = r; setTimeout(r, buf.duration * 1000 + 100); }); } catch (e) { } }
function payStop() { try { PAY.src && PAY.src.stop(); } catch (e) { } PAY.src = null; }
function payPony(box) { const NSs = "http://www.w3.org/2000/svg", sv = document.createElementNS(NSs, "svg"); sv.setAttribute("viewBox", "0 0 300 260"); sv.setAttribute("class", "kpay-pony");
  box.prepend(sv); try { artChar(sv, "pony", 150, 255, .4, { armR: -60, happy: true }); } catch (e) { sv.remove(); } }
function payClose(ov) { payStop(); ov.remove(); payMark(); }
// ① こどもが かぎの コースを おしたとき
function payLockBox() {
  const ov = document.createElement("div"); ov.className = "kpay";
  ov.innerHTML = `<div class="kpay-box"><div class="kpay-q">🔒 この コースは まだ ひらいて いないよ<br>おうちの ひとに きいてみてね</div>
    <div class="kpay-row"><button type="button" class="kpay-no">もどる</button><button type="button" class="kpay-adult">おうちの 方へ</button></div></div>`;
  document.body.append(ov); payPony(ov.querySelector(".kpay-box")); try { iconifyHtml(ov); } catch (e) { }
  ov.querySelector(".kpay-no").onclick = () => payClose(ov);
  ov.querySelector(".kpay-adult").onclick = () => { payClose(ov); payGate(payShop); };
  paySay("pay_lock"); }
// ② おうちの ひとの かくにん（かけざん）
function payGate(next) {
  const a = 12 + Math.floor(Math.random() * 7), b = 3 + Math.floor(Math.random() * 6); let v = "", miss = 0;
  const ov = document.createElement("div"); ov.className = "kpay kpay-adultui";
  ov.innerHTML = `<div class="kpay-box"><div class="kpay-h">おうちの方へ</div><div class="kpay-p">確認のため、答えを入力してください。</div>
    <div class="kpay-qz">${a} × ${b} = <span class="kpay-ans">　</span></div><div class="kpay-pad"></div>
    <div class="kpay-row"><button type="button" class="kpay-no">やめる</button><button type="button" class="kpay-ok">OK</button></div></div>`;
  document.body.append(ov); const ans = ov.querySelector(".kpay-ans"), pad = ov.querySelector(".kpay-pad");
  [1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫", 0].forEach(n => { const k = document.createElement("button"); k.type = "button"; k.textContent = n;
    k.onclick = () => { v = n === "⌫" ? v.slice(0, -1) : (v + n).slice(0, 3); ans.textContent = v || "　"; }; pad.append(k); });
  ov.querySelector(".kpay-no").onclick = () => ov.remove();
  ov.querySelector(".kpay-ok").onclick = () => { if (+v === a * b && v) { ov.remove(); next(); return; }
    if (++miss >= 3) { ov.remove(); return; } v = ""; ans.textContent = "　"; ov.querySelector(".kpay-p").textContent = "答えがちがいます。もう一度入力してください。"; }; }
// ③ かう・もどす
function payShop() {
  const all = STAGES.length + (typeof SOLO_LONGS === "function" ? SOLO_LONGS().length : 0), free = PAY_FREE.size, trial = !PAY.native();
  const ov = document.createElement("div"); ov.className = "kpay kpay-adultui";
  const body = () => PAY.on
    ? `<div class="kpay-h">すべてのコースが開いています</div><div class="kpay-p">ご購入ありがとうございます。全${all}コースで遊べます。</div>
       <div class="kpay-row"><button type="button" class="kpay-no">とじる</button>${trial ? `<button type="button" class="kpay-relock">ロックに戻す（確認用）</button>` : ""}</div>`
    : `<div class="kpay-h">すべてのコースを開く</div>
       <div class="kpay-p">いまは${all}コースのうち${free}コースを無料で遊べます。<br>${PAY_PRICE}（1回だけのお支払い）で、残りの${all - free}コースもすべて遊べるようになります。<br>広告や毎月の料金はありません。</div>
       ${trial ? `<div class="kpay-note">この公開ページはお試し版です。お金はかからず、そのまま開きます。</div>` : ""}
       <div class="kpay-row"><button type="button" class="kpay-buy">${PAY_PRICE}で すべて開く</button></div>
       <div class="kpay-row"><button type="button" class="kpay-restore">購入を復元</button><button type="button" class="kpay-no">とじる</button></div><div class="kpay-msg"></div>`;
  const draw = () => { ov.innerHTML = `<div class="kpay-box">${body()}</div>`; const q = s => ov.querySelector(s), msg = t => { const m = q(".kpay-msg"); if (m) m.textContent = t; };
    q(".kpay-no").onclick = () => payClose(ov);
    if (q(".kpay-relock")) q(".kpay-relock").onclick = () => { PAY.on = false; draw(); };
    if (q(".kpay-buy")) q(".kpay-buy").onclick = async () => { msg("お待ちください…"); const r = await PAY.buy(); if (r && r.ok) payDone(ov); else msg(r && r.cancel ? "" : "購入できませんでした。時間をおいてもう一度お試しください。"); };
    if (q(".kpay-restore")) q(".kpay-restore").onclick = async () => { msg("確認しています…"); const r = await PAY.restore(); if (r && r.ok) payDone(ov); else msg("この端末・アカウントでの購入が見つかりませんでした。"); }; };
  document.body.append(ov); draw(); }
function payDone(ov) { PAY.on = true; ov.className = "kpay"; ov.innerHTML = `<div class="kpay-box"><div class="kpay-q">🎉 やったあ！<br>ぜんぶの コースで あそべるよ</div><div class="kpay-row"><button type="button" class="kpay-no">あそぶ</button></div></div>`;
  payPony(ov.querySelector(".kpay-box")); try { iconifyHtml(ov); } catch (e) { } ov.querySelector(".kpay-no").onclick = () => payClose(ov); payMark(); paySay("pay_open"); }
// メニューの タイルに かぎを つける・おしたら とめる
// みんなでの ロングコースの ボタンには id が ないので、なまえで みわける
const PAY_LONGNAME = [["ともだち", "ltomo"], ["うみ", "sumi"], ["おかし", "sokashi"], ["うちゅう", "suchu"], ["えき", "eki"], ["おでかけ", "odekake"], ["きもち", "kimochi"], ["まけても", "makete"], ["できごと", "dekigoto"], ["じゅぎょう", "jugyou"], ["でたらめ", "detarame"], ["だいぼうけん", "long"]];
function payId(b) { if (b.dataset.sid || b.dataset.st) return b.dataset.sid || b.dataset.st;
  if (!b.classList.contains("mlong") && !/ロング/.test(b.textContent)) return ""; const t = b.textContent.replace(/\s+/g, ""), m = PAY_LONGNAME.find(([w]) => t.includes(w)); return m ? m[1] : ""; }
function payMark() { const box = document.getElementById("startBox"); if (!box) return;
  box.querySelectorAll(".mstages .mst").forEach(b => { const L = payLocked(payId(b)); b.classList.toggle("kpaylock", L);
    let k = b.querySelector(".kpay-key"); if (L && !k) { k = document.createElement("span"); k.className = "kpay-key"; k.textContent = "🔒"; b.append(k); } else if (!L && k) k.remove(); });
  const r = box.querySelector(".m3right"); if (r) { let u = r.querySelector(".m3pay"); if (!PAY.on && !u) { u = document.createElement("button"); u.type = "button"; u.className = "m3pay"; u.textContent = "🔓 ぜんぶ ひらく"; u.onclick = () => payGate(payShop); r.prepend(u); } else if (PAY.on && u) u.remove(); } }
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("#startBox .mstages .mst"); if (!b || !payLocked(payId(b))) return;
  e.stopPropagation(); e.preventDefault(); payLockBox(); }, true);
setInterval(() => { const sb = document.getElementById("startBox"); if (sb && sb.getClientRects().length) payMark(); }, 500);
{ const st = document.createElement("style"); st.textContent = `
.start.menu .mstages .mst.kpaylock{position:relative;filter:saturate(.35) brightness(.96)}
.start.menu .mstages .mst.kpaylock .mico,.start.menu .mstages .mst.kpaylock svg{opacity:.55}
.mst .kpay-key{position:absolute;right:.25em;top:.15em;font-size:1.25em;line-height:1;filter:none;z-index:2}
.start.menu.m3 .m3pay{height:min(10vh,48px);padding:0 .8em;border-radius:999px!important;border:3px solid #2B2A33!important;background:#FFF1C9!important;box-shadow:0 3px 0 #2B2A33!important;font:inherit;font-size:min(4vh,18px);color:#2B2A33;margin-right:.4em;cursor:pointer;white-space:nowrap}
.kpay{position:fixed;inset:0;z-index:210;background:#2B2A3399;display:grid;place-items:center;padding:16px}
.kpay-box{background:#FFF8E8;border:4px solid #2B2A33;border-radius:28px;box-shadow:0 6px 0 #2B2A33;padding:22px 30px;text-align:center;max-width:min(92vw,620px);max-height:94vh;overflow:auto}
.kpay-pony{width:min(34vh,200px);height:auto;display:block;margin:0 auto 4px}
.kpay-q{font-size:min(5.4vh,32px);line-height:1.45;margin-bottom:16px}
.kpay-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:10px}
.kpay button{font:inherit;font-size:min(4.6vh,26px);padding:.45em 1.1em;border-radius:999px;border:3px solid #2B2A33;box-shadow:0 3px 0 #2B2A33;background:#FFFFFF;cursor:pointer;color:#2B2A33}
.kpay .kpay-adult{font-size:min(3.4vh,18px);background:#FFF1C9}
.kpay-adultui .kpay-box{font-family:system-ui,-apple-system,"Hiragino Sans",sans-serif;text-align:center}
.kpay-h{font-size:min(4.6vh,26px);font-weight:700;margin-bottom:8px}
.kpay-p{font-size:min(3.2vh,17px);line-height:1.7;color:#3B3A44}
.kpay-note{font-size:min(2.8vh,14px);color:#8A5A00;background:#FFF1C9;border-radius:12px;padding:6px 10px;margin-top:10px}
.kpay-msg{min-height:1.4em;font-size:min(2.8vh,14px);color:#B23A3A;margin-top:8px}
.kpay .kpay-buy{background:#5FC46A;color:#FFFFFF;font-weight:700}
.kpay .kpay-restore,.kpay .kpay-relock{font-size:min(3vh,16px)}
.kpay-qz{font-size:min(6vh,34px);font-weight:700;margin:12px 0}
.kpay-ans{display:inline-block;min-width:2.6em;border-bottom:3px solid #2B2A33}
.kpay-pad{display:grid;grid-template-columns:repeat(3,min(11vh,64px));gap:8px;justify-content:center}
.kpay-pad button{padding:.25em 0;border-radius:14px;font-size:min(4.4vh,24px)}
.kpay-pad button:last-child{grid-column:2}
`; document.head.appendChild(st); }
