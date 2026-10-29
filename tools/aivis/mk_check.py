"""いま ゲームで つかっている Aivis の 全セリフを jobs/check/check.json に あつめる（読みチェック用）: python3 tools/aivis/mk_check.py
同じ key が 複数の ジョブに ある ときは、git で いちばん 新しい ジョブの ものを つかう（直しの ジョブが 上書き）。RUN に check と 書いて push すると report_check.json が aivis-out に 出る。"""
import json, glob, subprocess
from pathlib import Path
R = Path(__file__).resolve().parents[2]; J = R / "tools/aivis/jobs"
aud = {p.stem for p in (R / "tools/game/stage_audio").glob("*.mp3")} | {p.stem for p in (R / "tools/game/sit/audio").glob("*.mp3")}
best = {}
for lp in sorted(J.glob("*/lines.json")):
    job = lp.parent.name
    if job == "check": continue
    ts = subprocess.run(["git", "log", "-1", "--format=%ct", "--", str(lp)], capture_output=True, text=True, cwd=R).stdout.strip()
    ts = int(ts) if ts else 9999999999  # まだ コミット して いない ものは いちばん 新しい
    Y = json.loads((lp.parent / "yomi.json").read_text()) if (lp.parent / "yomi.json").exists() else {}
    for l in json.loads(lp.read_text()):
        k = l["key"]
        if k not in aud: continue
        if k not in best or best[k][0] < ts: best[k] = (ts, {"key": k, "who": l["who"], "text": l["text"], "yomi": Y.get(k, l["text"]), "acc": None, "job": job})
items = [v[1] for k, v in sorted(best.items())]
(J / "check/check.json").write_text(json.dumps(items, ensure_ascii=False, indent=0))
print(len(items), "lines")
