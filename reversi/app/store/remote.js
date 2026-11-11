const { chromium } = require('playwright');
const [S, W, H, DSF, tag] = [process.argv[2], +process.argv[3], +process.argv[4], +process.argv[5], process.argv[6]];
const BASE = "http://localhost:8000/reversi/?ps=127.0.0.1:9000";
const cam = (emoji, c1, c2) => `(() => {
  window.RVNative = { platform: 'ios', version: '1.0.0', push: false };
  window.ReactNativeWebView = { postMessage: (s) => { try { const m = JSON.parse(s); if (m.t === 'needMedia') setTimeout(() => window.RV.native({ t: 'media' }), 10); } catch (e) {} } };
  const mk = () => { const c = document.createElement('canvas'); c.width = 320; c.height = 240; const x = c.getContext('2d'); let t = 0;
    const draw = () => { t += 0.05; const g = x.createLinearGradient(0, 0, 0, 240); g.addColorStop(0, '${c1}'); g.addColorStop(1, '${c2}'); x.fillStyle = g; x.fillRect(0, 0, 320, 240);
      x.fillStyle = 'rgba(255,255,255,.25)'; x.beginPath(); x.arc(250, 50, 60, 0, 7); x.fill();
      x.fillStyle = '#000'; x.font = '150px "Noto Color Emoji"'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('${emoji}', 160, 140 + Math.sin(t) * 4); requestAnimationFrame(draw); };
    draw(); const s = c.captureStream(12);
    const ac = new AudioContext(); const d = ac.createMediaStreamDestination(); s.addTrack(d.stream.getAudioTracks()[0]); return s; };
  navigator.mediaDevices.getUserMedia = async () => mk();
})();`;
(async () => {
  const br = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'] });
  const errs = [];
  const mk = async (name, emoji, c1, c2) => {
    const c = await br.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DSF, permissions: ['camera', 'microphone'] });
    await require('./fontroute.js')(c); await c.addInitScript(cam(emoji, c1, c2));
    await c.addInitScript(`try{var k="marushima-reversi-cfg",o=JSON.parse(localStorage.getItem(k)||"{}");o.myName="${name}";o.pushAsked=1;localStorage.setItem(k,JSON.stringify(o))}catch(e){}`);
    const p = await c.newPage(); p.on('pageerror', e => errs.push(name + ': ' + e.message)); return p;
  };
  const h = await mk('ゆうくん', '👦', '#bfe3ff', '#e9f6ff');
  await h.goto(BASE); await h.waitForTimeout(800); await h.click('#callBtn'); await h.waitForTimeout(1500);
  const url = await h.textContent('#inviteLink').catch(() => null);
  console.log('invite', url);
  const g = await mk('おばあちゃん', '👵', '#ffe0c2', '#fff4e6');
  await g.goto(url.replace(/^https:\/\/[^/]+\/kotoba-tane\/reversi\/?/, 'http://localhost:8000/reversi/') + (url.includes('ps=') ? '' : '&ps=127.0.0.1:9000'));
  await g.waitForTimeout(800); await g.click('#startBtn').catch(() => {}); await g.waitForTimeout(7000);
  for (let m = 0; m < 30; m++) {
    for (const pg of [h, g]) { const c = await pg.$$('.cell.can'); if (c.length) { await c[(m * 5) % c.length].click(); await pg.waitForTimeout(2600); } }
    if (m === 9) { await h.waitForTimeout(800); await h.screenshot({ path: `${S}/${tag}-remote.png` }); await g.screenshot({ path: `${S}/${tag}-remoteG.png` }); break; }
  }
  console.log(errs.length ? errs : 'no errors'); await br.close();
})();
