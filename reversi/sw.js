/* まるシマリバーシ：よびだしの通知を受けとる Service Worker（2026-11-07）
   中継（rv-push）から {title, body, url, tag} が届いたら通知を出す。{cancel, tag} なら その通知を消す。
   通知をタップしたら、ひらいている画面があれば そこで url に移り、なければ 新しく開く。 */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { title: "まるシマリバーシ", body: e.data && e.data.text() }; }
  const tag = d.tag || "rv-call";
  if (d.cancel) {
    e.waitUntil(self.registration.getNotifications({ tag }).then(ns => ns.forEach(n => n.close())));
    return;
  }
  // 90秒より前の よびだしは 出さない（届くのが おくれたとき）
  if (d.at && Date.now() - d.at > 90000) return;
  e.waitUntil(self.registration.showNotification(d.title || "まるシマリバーシ", {
    body: d.body || "よびだしです",
    tag, renotify: true, requireInteraction: true,
    icon: "icons/icon-192.png", badge: "icons/badge-96.png",
    vibrate: [400, 200, 400, 200, 400, 200, 400],
    data: { url: d.url || "./" },
  }));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = new URL(e.notification.data && e.notification.data.url || "./", self.registration.scope).href;
  e.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of list) {
      if (c.url.startsWith(self.registration.scope)) {
        try { await c.focus(); await c.navigate(url); return; } catch (err) { /* 次の方法 */ }
      }
    }
    await self.clients.openWindow(url);
  })());
});
