// ゲーム本体（../index.html）を アプリ用に assets/web/index.html へ うつす。
// ・Google Fonts は ネットが ないと よめないので、ゲームで つかう 文字が ふくまれる 分だけ フォントを html に うめこむ
// ・ウェブ版 だけの しくみ（service worker・manifest）は はずす
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "../.."), OUT = path.resolve(__dirname, "../assets/web");
// アプリに 入れる ゲーム本体は、あまねさんが OK した 版（app/web_commit.txt の コミット）に 固定する（2026-11-02）。
// 公開ページの 最新版を そのまま アプリに 入れない。新しい 版を 入れる ときは web_commit.txt を かきかえる。
const pin = (() => { try { return fs.readFileSync(path.resolve(__dirname, "../web_commit.txt"), "utf8").trim(); } catch (e) { return ""; } })();
let html = pin ? require("child_process").execSync(`git show ${pin}:index.html`, { cwd: ROOT, maxBuffer: 1 << 28 }).toString("utf8") : fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
console.log("web:", pin || "(いまの index.html)");
const used = new Set([...html].map(c => c.codePointAt(0)));
function fontCss(pkg, family, weights) {
  const dir = path.dirname(require.resolve(`@fontsource/${pkg}/package.json`)); let css = "", n = 0, bytes = 0;
  for (const w of weights) {
    const src = fs.readFileSync(path.join(dir, `${w}.css`), "utf8");
    for (const block of src.match(/@font-face\s*{[^}]*}/g) || []) {
      const ur = (block.match(/unicode-range:\s*([^;]+);/) || [])[1]; const file = (block.match(/url\(\.\/files\/([^)]+\.woff2)\)/) || [])[1]; if (!file) continue;
      if (ur) { const hit = ur.split(",").some(r => { const m = r.trim().replace(/^U\+/i, "").split("-"); const a = parseInt(m[0].replace(/\?/g, "0"), 16), b = m[1] ? parseInt(m[1], 16) : parseInt(m[0].replace(/\?/g, "F"), 16);
        for (const c of used) if (c >= a && c <= b) return true; return false; }); if (!hit) continue; }
      const data = fs.readFileSync(path.join(dir, "files", file)); bytes += data.length; n++;
      css += `@font-face{font-family:'${family}';font-style:normal;font-display:swap;font-weight:${w};src:url(data:font/woff2;base64,${data.toString("base64")}) format('woff2');${ur ? `unicode-range:${ur};` : ""}}\n`;
    } }
  console.log(family, n, "files", (bytes / 1e6).toFixed(2), "MB"); return css; }
const css = fontCss("mochiy-pop-one", "Mochiy Pop One", [400]) + fontCss("zen-maru-gothic", "Zen Maru Gothic", [500, 700]);
const before = html.length;
html = html.replace(/<link[^>]*fonts\.googleapis\.com[^>]*>/g, "").replace(/<link[^>]*fonts\.gstatic\.com[^>]*>/g, "").replace(/<link rel="manifest"[^>]*>/, "");
html = html.replace("</head>", `<style>${css}</style>\n<script>window.KT_IN_APP=true;</script>\n</head>`);
html = html.replace(/navigator\.serviceWorker\.register\([^)]*\)/g, "Promise.resolve()");
fs.mkdirSync(OUT, { recursive: true }); fs.writeFileSync(path.join(OUT, "index.html"), html);
// 版の しるし（アプリが 古い ゲーム本体を つかいつづけない ように）
const ver = require("crypto").createHash("sha1").update(html).digest("hex").slice(0, 12);
fs.writeFileSync(path.join(OUT, "version.json"), JSON.stringify({ ver }));
console.log("index.html", (before / 1e6).toFixed(1), "→", (html.length / 1e6).toFixed(1), "MB  ver", ver);
