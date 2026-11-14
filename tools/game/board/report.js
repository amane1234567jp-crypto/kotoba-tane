/* ================= ふぐあいを しらせる（2026-11-14） =================
   あまねさん：「まだ バグが どこかに ひそんで いる 気が する。バグ報告用の メッセージフォームを」
   ・ゲーム中：⏸ →「ふぐあいを しらせる」（その ときの コース・マス・がめんを いっしょに おくる）
   ・メニュー：⚙（おとなの かたへ）→「ふぐあいを しらせる」
   おくりさき：Supabase（uchinoaji プロジェクトの kt_reports。書きこみ だけ できる。よむのは Claude）。
   おくれない ときは 端末に のこし、つぎに ひらいた ときに おくりなおす。 */
const KT_REP = { url: "https://rlqeoyvevaglwngxtvrw.supabase.co/rest/v1/kt_reports", key: "sb_publishable_y30RlP3UI_NVyH8RRfydHA_UFDIMaRv", q: "kotoba-tane-reportq" };
function repContext(withLog) {
  const g = (f, d) => { try { const v = f(); return v === undefined ? d : v; } catch (e) { return d; } };
  const pc = g(() => (typeof CUR_PL !== "undefined" && CUR_PL && CUR_PL.pc) || P.shima, null);
  const stg = g(() => curStage, "");
  const c = { ver: (new URLSearchParams(location.search).get("v")) || "", app: !!window.KT_APP, uchi: /uchi/.test(location.search), ua: navigator.userAgent.slice(0, 200),
    scr: `${innerWidth}x${innerHeight}@${devicePixelRatio}`, inGame: !document.getElementById("startBox"), stage: stg, node: pc && pc.node, mode: g(() => MODE, ""),
    task: g(() => (LONG_TASKS[stg] || {})[pc.node] || "", ""), view: g(() => view, ""), L: g(() => E.L, null), lap: g(() => SAVE.lap, null), at: new Date().toISOString() };
  if (withLog) { let a = []; try { a = JSON.parse(localStorage.getItem(LOG_KEY) || "[]"); } catch (e) { }
    c.errs = a.filter(x => x.type === "err").slice(-15); c.log = a.slice(-60); }
  return c;
}
async function repPost(rec) {
  const r = await fetch(KT_REP.url, { method: "POST", headers: { "Content-Type": "application/json", apikey: KT_REP.key, Prefer: "return=minimal" }, body: JSON.stringify(rec) });
  if (!r.ok) throw new Error("HTTP " + r.status); }
function repQueue(rec) { try { const a = JSON.parse(localStorage.getItem(KT_REP.q) || "[]"); a.push(rec); localStorage.setItem(KT_REP.q, JSON.stringify(a.slice(-10))); } catch (e) { } }
async function repFlush() { let a = []; try { a = JSON.parse(localStorage.getItem(KT_REP.q) || "[]"); } catch (e) { } if (!a.length) return;
  const left = []; for (const rec of a) { try { await repPost(rec); } catch (e) { left.push(rec); } }
  try { if (left.length) localStorage.setItem(KT_REP.q, JSON.stringify(left)); else localStorage.removeItem(KT_REP.q); } catch (e) { } }
setTimeout(() => { repFlush(); }, 8000);
function showReport() {
  if (document.querySelector(".krep")) return;
  const ctx0 = repContext(false); // ひらいた しゅんかんの ようす（コース・マス・がめん）
  const ov = document.createElement("div"); ov.className = "krep";
  ov.innerHTML = `<div class="krep-box"><div class="krep-t">ふぐあいを しらせる</div>
<div class="krep-s">おかしな 動きや、気づいた ことを 書いて ください（音声入力も つかえます）。</div>
<textarea class="krep-ta" maxlength="3000" placeholder="例：うちゅうの はやくちことばの とちゅうで、課題が 出た まま 盤に もどった"></textarea>
<label class="krep-ck"><input type="checkbox" checked> あそんだ きろく（さいごの 60件。聞きとった ことばを ふくむ）と エラーを そえる</label>
<div class="krep-note">「おくる」を おした ときだけ、書いた 文章・いまの コースと マス・端末の 種類・ゲームの 版を 開発者に おくります。名前や 連絡先は おくりません。</div>
<div class="krep-where"></div>
<div class="krep-row"><button type="button" class="krep-send">おくる</button><button type="button" class="krep-no">やめる</button></div></div>`;
  (document.getElementById("stage") || document.body).append(ov);
  const ta = ov.querySelector(".krep-ta"), send = ov.querySelector(".krep-send"), ck = ov.querySelector("input");
  ov.querySelector(".krep-where").textContent = ctx0.inGame ? `いまの ばしょ：コース ${ctx0.stage || "-"}／マス ${ctx0.node ?? "-"}${ctx0.task ? "（" + ctx0.task + "）" : ""} も いっしょに おくります` : "";
  ov.querySelector(".krep-no").onclick = () => ov.remove();
  ["keydown", "keyup", "keypress"].forEach(t => ta.addEventListener(t, e => e.stopPropagation())); // ゲームの キー操作に とられない
  setTimeout(() => ta.focus(), 50);
  send.onclick = async () => {
    const body = ta.value.trim(); if (!body) { ta.focus(); ta.placeholder = "なにか ひとこと 書いて ください"; return; }
    send.disabled = true; send.textContent = "おくって います…";
    const c = repContext(ck.checked); Object.assign(c, { stage: ctx0.stage, node: ctx0.node, task: ctx0.task, view: ctx0.view, inGame: ctx0.inGame });
    const rec = { body, ctx: c }; let ok = false;
    try { await repPost(rec); ok = true; } catch (e) { repQueue(rec); }
    const box = ov.querySelector(".krep-box");
    box.innerHTML = `<div class="krep-t">${ok ? "おくりました" : "いまは おくれませんでした"}</div><div class="krep-s">${ok ? "ありがとうございます。Claude が 見て なおします。" : "この 端末に のこしました。つぎに ひらいた ときに、じどうで おくりなおします。"}</div><div class="krep-row"><button type="button" class="krep-no">とじる</button></div>`;
    box.querySelector(".krep-no").onclick = () => ov.remove();
  };
}
{ const st = document.createElement("style"); st.textContent = `
.krep{position:absolute;inset:0;z-index:300;background:#2B2A3399;display:grid;place-items:center}
.krep-box{background:#FFF8E8;border:5px solid #2B2A33;border-radius:26px;box-shadow:0 6px 0 #2B2A33;padding:18px 22px;width:min(90%,640px);display:grid;gap:10px;font-family:inherit}
.krep-t{font-size:clamp(20px,3vw,30px);text-align:center}
.krep-s{font-size:clamp(13px,1.8vw,18px);color:#4A4A55;text-align:center}
.krep-ta{width:100%;box-sizing:border-box;min-height:min(28vh,180px);font:inherit;font-size:clamp(15px,2vw,20px);border:3px solid #2B2A33;border-radius:14px;padding:10px;resize:vertical;-webkit-user-select:text;user-select:text}
.krep-ck{font-size:clamp(12px,1.6vw,16px);display:flex;gap:8px;align-items:center}
.krep-ck input{width:20px;height:20px}
.krep-note{font-size:clamp(11px,1.4vw,14px);color:#6b5e4f;line-height:1.4}
.krep-where{font-size:clamp(12px,1.5vw,15px);color:#6b5e4f}
.krep-row{display:flex;gap:14px;justify-content:center}
.krep button{font:inherit;font-size:clamp(17px,2.4vw,26px);padding:.4em 1.3em;border-radius:999px;border:4px solid #2B2A33;box-shadow:0 3px 0 #2B2A33;background:#fff;cursor:pointer;color:#2B2A33}
.krep .krep-send{background:#7BD389}
.krep button:disabled{opacity:.6}
#pauseBox .prep{font-size:clamp(14px,2vw,20px)!important;padding:6px 22px!important;background:#FFFFFF;border-width:3px!important}`; document.head.appendChild(st); }
// ⏸ の ひとやすみ がめんに ボタンを たす
setInterval(() => { const c = document.querySelector("#pauseBox .pcard"); if (!c || c.querySelector(".prep")) return;
  const b = document.createElement("button"); b.type = "button"; b.className = "prep"; b.textContent = "ふぐあいを しらせる"; b.onclick = showReport; c.append(b); }, 300);
// おとなの かたへ（⚙）に ボタンを たす
setInterval(() => { document.querySelectorAll(".madult").forEach(ad => { if (ad.querySelector(".mrep")) return;
  const b = document.createElement("button"); b.type = "button"; b.className = "mreset mrep"; b.textContent = "ふぐあいを しらせる"; b.onclick = showReport;
  const lg = [...ad.querySelectorAll("button")].find(x => /きろくを 見る/.test(x.textContent)); if (lg) lg.after(b); else ad.prepend(b); }); }, 500);
