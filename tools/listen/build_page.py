"""聞き比べページを作り直す: python3 tools/listen/build_page.py
listen/a/aivis/ に全セリフの mp3 がそろっていれば AivisSpeech の列が自動で有効になる"""
import json
from pathlib import Path
R = Path(__file__).resolve().parents[2]
T = Path(__file__).resolve().parent
lines = json.loads((T / "lines.json").read_text())
aiv = R / "listen/a/aivis"
has = all((aiv / f"{l['key']}.mp3").exists() for l in lines)
html = (T / "page.html").read_text().replace("__LINES__", json.dumps(lines, ensure_ascii=False)).replace("__HAS_AIVIS__", "true" if has else "false")
(R / "listen/index.html").write_text(html)
print("written listen/index.html  HAS_AIVIS =", has)
