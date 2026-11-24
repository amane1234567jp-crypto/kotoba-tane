/* Web 版は 2026-11-24 に なくした。前に Web 版を開いた端末に 残っている この Service Worker は、
   次に 更新を たしかめたときに 自分で 消える（通知の登録も 解除する）。 */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil((async () => {
  try { const sub = await self.registration.pushManager.getSubscription(); if (sub) await sub.unsubscribe(); } catch (err) { }
  await self.registration.unregister();
})()));
