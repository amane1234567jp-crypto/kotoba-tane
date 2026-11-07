"""まるシマリバーシを1枚のHTMLに組み立てる: python3 reversi/build.py → reversi/index.html
キャラは ことばのたね の原画（tools/game/rig）をそのまま読み込む。"""
from pathlib import Path
S = Path(__file__).parent / "src"
hand = ('<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 26V12a3 3 0 0 1 6 0v10V8a3 3 0 0 1 6 0v14V10a3 3 0 0 1 6 0v14v-8a3 3 0 0 1 6 0v14'
        'c0 9-6 14-13 14s-11-3-15-9l-5-8a3 3 0 0 1 5-3l4 5z" fill="#FFE9CF" stroke="#2B2A33" stroke-width="3.5" stroke-linejoin="round"/></svg>')
RIG = Path(__file__).resolve().parents[1] / "tools/game/rig"
vendor = "\n".join((RIG / f).read_text() for f in ["part_chars.js", "part_sound.js", "part_moves.js"])
rules = (S / "rules.js").read_text().split("if (typeof module")[0]
import subprocess, datetime
try: sha = subprocess.run(["git", "rev-parse", "--short", "HEAD"], capture_output=True, text=True, cwd=S).stdout.strip()
except Exception: sha = ""
VER = "v" + datetime.date.today().strftime("%Y.%m.%d") + (" " + sha if sha else "")
html = (S / "shell.html").read_text().replace("__VER__", VER)
for k, v in {"__HAND__": hand, "__VENDOR__": vendor, "__RULES__": rules + "\n" + (S.parent / "voice/lines.js").read_text(), "__FIXTURES__": (S / "fixtures.js").read_text(), "__SFX__": (S / "sfx.js").read_text(), "__NET__": (S / "net.js").read_text(), "__FX__": (S / "fx.js").read_text(), "__BILLING__": (S / "billing.js").read_text(), "__CALL__": (S / "call.js").read_text(), "__APP__": (S / "app.js").read_text(), "__FELT__": (S / "felt.txt").read_text().strip()}.items():
    html = html.replace(k, v)
head = ('<!doctype html>\n<html lang="ja"><head><meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<meta name="robots" content="noindex">\n'
        '<meta name="apple-mobile-web-app-title" content="まるシマリバーシ">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="theme-color" content="#1E8A52">\n<link rel="manifest" href="manifest.webmanifest">\n<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">\n<style>body{margin:0}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}[hidden]{display:none!important}</style>\n</head><body>\n')
Path(__file__).parent.joinpath("index.html").write_text(head + html + "\n</body></html>\n")
js = html[html.index("<script>") + 8: html.rindex("</script>")]
import subprocess, tempfile
with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as f: f.write(js)
subprocess.run(["node", "--check", f.name], check=True)
print(f"{len(html)/1e3:.0f} KB")
