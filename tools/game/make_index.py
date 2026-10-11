"""ゲームを組み立てて リポジトリ直下の index.html を作る: python3 tools/game/make_index.py"""
import subprocess
from pathlib import Path
G = Path(__file__).resolve().parent; R = G.parents[1]
subprocess.run(["python3", "board/build.py"], cwd=G, check=True)
body = (G / "board/board_demo.html").read_text()
head = ('<!doctype html>\n<html lang="ja"><head><meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
        '<meta name="robots" content="noindex">\n<style>body{margin:0}</style>\n</head><body>\n')
(R / "index.html").write_text(head + body + "\n</body></html>\n")
(G / "board/board_demo.html").unlink(); (G / "board/check.js").unlink(missing_ok=True)
print("index.html updated")
