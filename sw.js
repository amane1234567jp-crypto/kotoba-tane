/* ことばのたね：オフラインでも うごく ための しくみ（2026-10-25）
   ページ本体は「まず ネット、だめなら 保存版」。声の パックは「まず 保存版、うらで 新しく する」。 */
const CACHE = "kt-v3"; // v2（2026-10-29）：パックは ?v= の 版ごとに 保存。v3（2026-11-04）：index.html は ロードがめん、ゲーム本体は game.html（どちらも ばしょ ごとに 保存）
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "./index.html", "./icon.png", "./manifest.json"]).catch(() => {}))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return; const u = new URL(r.url);
  if (u.origin === location.origin && u.pathname.includes("/packs/")) {
    const key = u.origin + u.pathname + u.search;
    e.respondWith(caches.open(CACHE).then(async c => { const hit = await c.match(key);
      const net = fetch(r.url, { cache: "no-cache" }).then(async res => { if (res.ok) { for (const q of await c.keys()) { const qu = new URL(q.url); if (qu.pathname === u.pathname && qu.search !== u.search) await c.delete(q); } c.put(key, res.clone()); } return res; }).catch(() => null);
      if (hit) { e.waitUntil(net); return hit; } return (await net) || new Response("", { status: 504 }); }));
    return; }
  if (r.mode === "navigate" || (u.origin === location.origin && /\/(index\.html|game\.html)?$/.test(u.pathname))) {
    const key = /game\.html$/.test(u.pathname) ? "./game.html" : "./index.html"; // ?v= や ?uchi は くべつ しない
    e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(key, cp)); } return res; })
      .catch(() => caches.match(key))); return; }
  if (u.host.includes("fonts.g")) e.respondWith(caches.open(CACHE).then(async c => (await c.match(r)) || fetch(r).then(res => { c.put(r, res.clone()); return res; })));
});
