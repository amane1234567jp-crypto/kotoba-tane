const { chromium } = require('playwright');
(async () => {
  const [S, W, H, DSF, tag] = [process.argv[2], +process.argv[3], +process.argv[4], +process.argv[5], process.argv[6]];
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DSF }); await require('./fontroute.js')(ctx); const p = await ctx.newPage();
  await p.addInitScript(() => { window.RVNative = { platform: 'ios', version: '1.0.0', push: false }; let s = 7; Math.random = () => (s = (s * 16807) % 2147483647) / 2147483647; });
  await p.goto('http://localhost:8000/reversi/index.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(2500);
  await p.screenshot({ path: `${S}/${tag}-start.png` });
  await p.click('#startBtn'); await p.waitForTimeout(3500);
  for (let m = 0; m < 40; m++) {
    await p.waitForSelector('.cell.can', { timeout: 15000 }).catch(() => null);
    const cans = await p.$$('.cell.can'); if (!cans.length) break;
    await cans[(m * 7) % cans.length].click();
    if (m === 21) { await p.waitForTimeout(650); await p.screenshot({ path: `${S}/${tag}-flip.png` }); }
    await p.waitForTimeout(2600);
    if (m === 27) { await p.screenshot({ path: `${S}/${tag}-mid.png` }); }
  }
  await b.close();
})();
