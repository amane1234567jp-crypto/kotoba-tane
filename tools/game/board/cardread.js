/* ================= カードの よみあげ（2026-10-25） =================
   えらぶ カードは 1かい タッチで ぽにーが よみあげる（ひかる）。おなじ カードを もう いちど タッチで えらぶ。
   声が ある ことばは その 声、ない ことばは 端末の よみあげ。 */
const CR = { last: null, t: 0, on: true };
const crNorm = t => (t || "").replace(/[^ぁ-んァ-ヶ一-龯々0-9A-Za-z]/g, "");
const crText = g => [...g.querySelectorAll("text")].map(t => t.textContent).join(" ");
function crEligible(g) {
  if (!g || g.tagName !== "g" || typeof g.onclick !== "function" || g.dim) return false;
  if (!/[ぁ-んァ-ヶ一-龯]{2}/.test(crText(g))) return false;
  const sib = [...g.parentNode.children].filter(x => x !== g && x.tagName === "g" && typeof x.onclick === "function");
  return sib.length >= 1; }
function crGlow(g) { document.querySelectorAll(".crGlow").forEach(x => x.remove());
  const b = g.getBBox(); const r = el("rect", { class: "crGlow", x: b.x - 10, y: b.y - 10, width: b.width + 20, height: b.height + 20, rx: 30, fill: "none", stroke: "#FFB020", "stroke-width": 12, "pointer-events": "none" }, g);
  later(6000, () => r.remove()); }
async function crRead(g) {
  const raw = crText(g).replace(/[^\sぁ-んァ-ヶ一-龯々ー0-9A-Za-z、。！？]/g, "").trim(), key = CARDV[crNorm(raw)];
  try { speechSynthesis.cancel(); } catch (e) { }
  if (key && AUD[key]) { const buf = await voiceBuf(key); if (buf) { audio(); const s = ctx.createBufferSource(); s.buffer = buf; s.connect(analyser); s.start(); return; } }
  try { const u = new SpeechSynthesisUtterance(raw.replace(/\s+/g, "")); u.lang = "ja-JP"; u.rate = .95; speechSynthesis.speak(u); } catch (e) { } }
document.addEventListener("click", e => {
  if (!CR.on) return; const g = e.target.closest && e.target.closest('g[style*="cursor:pointer"]'); if (!crEligible(g)) return;
  if (CR.last === g && performance.now() - CR.t < 8000) { CR.last = null; document.querySelectorAll(".crGlow").forEach(x => x.remove()); return; } // 2かいめ → えらぶ
  e.stopPropagation(); e.preventDefault(); CR.last = g; CR.t = performance.now(); crGlow(g); crRead(g);
}, true);
