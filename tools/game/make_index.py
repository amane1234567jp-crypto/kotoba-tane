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
(R / "index.html").write_text(head + body + "\n</body></html>\n")
(G / "board/board_demo.html").unlink(); (G / "board/check.js").unlink(missing_ok=True)
print("index.html updated")
