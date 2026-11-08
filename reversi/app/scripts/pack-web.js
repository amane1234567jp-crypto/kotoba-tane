// ゲーム本体（../index.html と lib・voice・icons）を assets/web.zip にまとめる
const AdmZip = require("adm-zip"), path = require("path"), fs = require("fs");
const root = path.resolve(__dirname, "..", "..");
const zip = new AdmZip();
zip.addLocalFile(path.join(root, "index.html"));
for (const d of ["lib", "icons"]) zip.addLocalFolder(path.join(root, d), d);
zip.addLocalFolder(path.join(root, "voice", "out"), "voice/out");
const out = path.resolve(__dirname, "..", "assets", "web.zip");
zip.writeZip(out);
const ver = (fs.readFileSync(path.join(root, "index.html"), "utf8").match(/VER = "([^"]+)"/) || [])[1] || "";
fs.writeFileSync(path.resolve(__dirname, "..", "assets", "web-version.json"), JSON.stringify({ ver, at: new Date().toISOString() }));
console.log("web.zip", (fs.statSync(out).size / 1024 | 0) + " KB", ver);
