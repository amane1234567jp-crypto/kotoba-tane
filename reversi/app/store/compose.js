const { chromium } = require('playwright');
const S = process.argv[2];
const items = [
  ['remote', 'はなれて暮らす家族と', '顔を見ながらリバーシ'],
  ['flip', '本物みたいな石が', 'パタパタひっくり返る'],
  ['mid', '置ける場所が光る', '「まった」もできる'],
  ['start', 'はじめての相手には', 'リンクを送って招待'],
];
const page = (img, l1, l2, ipad, W, H) => `<!doctype html><html><head><style>
html,body{margin:0;width:100%;height:100%;overflow:hidden}
body{background:linear-gradient(170deg,#25a062 0%,#1E8A52 45%,#16693e 100%);font-family:"Noto Sans CJK JP";display:flex;flex-direction:column;align-items:center}
.cap{color:#fff;text-align:center;font-weight:900;letter-spacing:.02em;line-height:1.3;margin-top:${(ipad ? 70 : 150) * W / (ipad ? 2752 : 1320)}px;font-size:${(ipad ? 112 : 104) * W / (ipad ? 2752 : 1320)}px;text-shadow:0 6px 0 rgba(0,0,0,.18)}
.cap span{display:block}
.cap .y{color:#FFE27A}
.shot{margin-top:${(ipad ? 60 : 100) * W / (ipad ? 2752 : 1320)}px;width:${ipad ? (H / W < 0.7 ? 70 : 79) : (H / W < 2 ? 74 : 84)}%;border-radius:${(ipad ? 48 : 64) * W / (ipad ? 2752 : 1320)}px;border:${(ipad ? 14 : 18) * W / (ipad ? 2752 : 1320)}px solid #1b1b20;box-shadow:0 30px 80px rgba(0,0,0,.35);display:block}
</style></head><body><div class="cap"><span>${l1}</span><span class="y">${l2}</span></div><img class="shot" src="file://${img}"></body></html>`;
(async () => {
  const b = await chromium.launch();
  for (const [dev, W, H, name] of [['p', 1320, 2868, 'iphone69'], ['i', 2752, 2064, 'ipad13'], ['p', 1080, 1920, 'play-phone'], ['i', 2560, 1600, 'play-tab']]) {
    const p = await b.newPage({ viewport: { width: W, height: H } });
    let n = 1;
    for (const [k, l1, l2] of items) {
      const f = `${S}/page.html`; require('fs').writeFileSync(f, page(`${S}/${dev}-${k}.png`, l1, l2, dev === 'i', W, H));
      await p.goto('file://' + f); await p.waitForTimeout(300);
      await p.screenshot({ path: `${S}/store/${name}-${n++}.png` });
    }
  }
  await b.close();
})();
