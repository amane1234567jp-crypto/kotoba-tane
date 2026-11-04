"""ゲームを組み立てて リポジトリ直下の index.html を作る: python3 tools/game/make_index.py"""
import subprocess
from pathlib import Path
G = Path(__file__).resolve().parent; R = G.parents[1]
subprocess.run(["python3", "board/build.py"], cwd=G, check=True)
body = (G / "board/board_demo.html").read_text()
# 声の パックの 版（packs/*.json の 中身から 決める）。ページと パックの 版を そろえて、古い 保存版の パックが 使われないように する（2026-10-29）
import hashlib
h = hashlib.md5()
for f in sorted((R / "packs").glob("*.json")): h.update(f.name.encode()); h.update(f.read_bytes())
PACK_VER = h.hexdigest()[:10]
head = ('<!doctype html>\n<html lang="ja"><head><meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
        '<meta name="robots" content="noindex">\n'
        '<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n'
        '<meta name="apple-mobile-web-app-title" content="ことばのたね">\n<meta name="apple-mobile-web-app-status-bar-style" content="default">\n'
        '<link rel="apple-touch-icon" href="icon.png">\n<link rel="manifest" href="manifest.json">\n<style>body{margin:0}</style>\n'
        f'<script>const PACK_VER="{PACK_VER}";{{const f0=window.fetch;window.fetch=function(u,o){{if(typeof u==="string"&&/(^|\\/)packs\\/[^?]+\\.json$/.test(u))u+="?v="+PACK_VER;return f0.call(this,u,o);}};}}</script>\n'
        '<script>if("serviceWorker" in navigator&&location.protocol==="https:")addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));</script>\n</head><body>\n')
# 2026-11-04：ゲーム本体は game.html。index.html は ロードがめん（board/loader.html）で、game.html を よみこみながら パーセントを みせ、おわったら うつる
PRE = ('<div id="ktpre" style="position:fixed;inset:0;z-index:99999;background:#FFF8E8;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif;color:#2B2A33">'
       '<svg viewBox="-80 -80 160 160" width="160" height="160" style="animation:ktspin 3s linear infinite"><g fill="#FF8FA3" stroke="#2B2A33" stroke-width="5"><circle cx="0" cy="-42" r="28"/><circle cx="40" cy="-13" r="28"/><circle cx="25" cy="35" r="28"/><circle cx="-25" cy="35" r="28"/><circle cx="-40" cy="-13" r="28"/></g><circle r="26" fill="#FFD25E" stroke="#2B2A33" stroke-width="5"/></svg>'
       '<div style="font-size:32px;margin-top:20px">はじまるよ！</div><style>@keyframes ktspin{to{transform:rotate(360deg)}}</style></div>'
       '<script>addEventListener("load",function(){var e=document.getElementById("ktpre");if(e)e.remove();});</script>\n')
game = head + PRE + body + "\n</body></html>\n"
(R / "game.html").write_text(game)
import gzip
GVER = hashlib.md5(game.encode()).hexdigest()[:10]
loader = (G / "board/loader.html").read_text().replace("__VER__", GVER).replace("__RAW__", str(len(game.encode()))).replace("__GZ__", str(len(gzip.compress(game.encode(), 6))))
(R / "index.html").write_text(loader)
(G / "board/board_demo.html").unlink(); (G / "board/check.js").unlink(missing_ok=True)
print("game.html / index.html（ロードがめん） updated", GVER)
