/* ================= おとな むけ：あそんだ きろくの まとめ（2026-10-25） =================
   「あそんだ きろくを 見る」の 上に、14日の グラフ・コース別・にがての ことば・よく いえた ことばを 出す。 */
function dashData() {
  let a = []; try { a = JSON.parse(localStorage.getItem(LOG_KEY) || "[]"); } catch (e) { }
  const day = t => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
  const today = day(Date.now()), days = [...Array(14)].map((_, i) => today - (13 - i) * 864e5);
  const tasks = a.filter(x => typeof x.ok === "boolean");
  const per = days.map(d => { const xs = tasks.filter(x => day(x.t) === d); return { d, n: xs.length, ok: xs.filter(x => x.ok).length, first: xs.filter(x => x.ok && (!x.tries || x.tries.length <= 1)).length }; });
  let stage = null; const byStage = {};
  for (const x of a) { if (x.type === "start") { stage = x.stage || stage || "kousha"; (byStage[stage] = byStage[stage] || { plays: 0, n: 0, ok: 0, goal: 0 }).plays++; }
    else if (stage && typeof x.ok === "boolean") { byStage[stage].n++; if (x.ok) byStage[stage].ok++; } else if (stage && x.type === "goal") byStage[stage].goal++; }
  const ph = {}; for (const x of tasks) { const w = x.answer || x.said || null; if (!w) continue; const p = ph[w] = ph[w] || { n: 0, ok: 0, first: 0, last: 0 }; p.n++; if (x.ok) p.ok++; if (x.ok && (!x.tries || x.tries.length <= 1)) p.first++; p.last = Math.max(p.last, x.t); }
  const hard = Object.entries(ph).filter(([, p]) => p.n - p.ok >= 1).sort((A, B) => (B[1].n - B[1].ok) - (A[1].n - A[1].ok) || B[1].last - A[1].last).slice(0, 8);
  const good = Object.entries(ph).filter(([, p]) => p.first >= 1).sort((A, B) => B[1].last - A[1].last).slice(0, 8);
  const secs = tasks.filter(x => x.sec && day(x.t) >= today - 6 * 864e5).map(x => x.sec), secs0 = tasks.filter(x => x.sec && day(x.t) < today - 6 * 864e5 && day(x.t) >= today - 13 * 864e5).map(x => x.sec);
  const avg = v => v.length ? Math.round(v.reduce((s, x) => s + x, 0) / v.length * 10) / 10 : null;
  return { per, byStage, hard, good, sec: avg(secs), sec0: avg(secs0), total: tasks.length };
}
function dashView() {
  const D = dashData(), w = 560, h = 120, bw = w / 14, mx = Math.max(4, ...D.per.map(p => p.n));
  const md = t => { const x = new Date(t); return `${x.getMonth() + 1}/${x.getDate()}`; };
  const bars = D.per.map((p, i) => { const x = i * bw + 4, H1 = p.n / mx * h, H2 = p.ok / mx * h, H3 = p.first / mx * h;
    return `<rect x="${x}" y="${h - H1}" width="${bw - 8}" height="${H1}" fill="#FFC2D1"/><rect x="${x}" y="${h - H2}" width="${bw - 8}" height="${H2}" fill="#A8DC8F"/><rect x="${x}" y="${h - H3}" width="${bw - 8}" height="${H3}" fill="#5CB85C"/>`
      + (p.n ? `<text x="${x + (bw - 8) / 2}" y="${h - H1 - 4}" font-size="11" text-anchor="middle">${p.n}</text>` : "")
      + (i % 2 === 1 || i === 13 ? `<text x="${x + (bw - 8) / 2}" y="${h + 14}" font-size="10" text-anchor="middle" fill="#6b5e4f">${md(p.d)}</text>` : ""); }).join("");
  const nm = id => (STAGES.find(s => s.id === id) || {}).name || id;
  const st = Object.entries(D.byStage).sort((A, B) => B[1].plays - A[1].plays).slice(0, 10).map(([id, s]) => `<tr><td>${nm(id)}</td><td>${s.plays}</td><td>${s.goal}</td><td>${s.n ? Math.round(s.ok / s.n * 100) + "%" : "-"}</td></tr>`).join("");
  const li = (xs, f) => xs.length ? xs.map(([w, p]) => `<li>「${w}」 <span>${f(p)}</span></li>`).join("") : "<li>まだありません</li>";
  const trend = D.sec == null ? "" : `<div class="dsec">答えるまでの平均時間（この7日）：<b>${D.sec}秒</b>${D.sec0 != null ? `（その前の7日：${D.sec0}秒${D.sec < D.sec0 ? " → 速くなりました" : ""}）` : ""}</div>`;
  const div = document.createElement("div"); div.className = "dash";
  div.innerHTML = `<div class="dttl">この14日（ピンク＝答えた回数／薄い緑＝言えた／緑＝1回目で言えた）</div>
<svg viewBox="0 -18 ${w} ${h + 34}" class="dchart">${bars}</svg>${trend}
<div class="dcols"><div><div class="dttl">コース別</div><table class="dtab"><tr><th>コース</th><th>遊んだ</th><th>ゴール</th><th>言えた</th></tr>${st || "<tr><td colspan=4>まだありません</td></tr>"}</table></div>
<div><div class="dttl">練習したい言葉</div><ul class="dlist">${li(D.hard, p => `${p.n - p.ok}回 言えなかった`)}</ul>
<div class="dttl">最近1回目で言えた言葉</div><ul class="dlist good">${li(D.good, p => `${p.first}回`)}</ul></div></div>`;
  return div; }
{ const sl = showLog; showLog = function () { sl(); try { const c = document.querySelector(".logbox .logcard"); if (c) { c.insertBefore(dashView(), c.querySelector(".logpre")); c.style.gridTemplateRows = "auto auto auto 1fr auto"; c.style.overflow = "auto"; } } catch (e) { console.error(e); } }; }
(function () { const s = document.createElement("style"); s.textContent = `.dash{display:grid;gap:6px;font-size:13px}.dash .dttl{font-weight:700;font-size:13px;margin-top:4px}.dchart{width:100%;max-height:150px;background:#FFFBF0;border-radius:12px}
.dcols{display:grid;grid-template-columns:1fr 1fr;gap:14px}@media (max-width:600px){.dcols{grid-template-columns:1fr}}
.dtab{border-collapse:collapse;width:100%}.dtab th,.dtab td{border-bottom:1px solid #eee;padding:3px 4px;text-align:left}.dtab td+td,.dtab th+th{text-align:right}
.dlist{margin:2px 0 6px;padding-left:18px}.dlist li span{color:#c0506a;font-size:12px}.dlist.good li span{color:#3d8b3d}.dsec{font-size:13px}`; document.head.appendChild(s); })();
