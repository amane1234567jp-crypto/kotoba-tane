"""ぽにー（調整版 VOICEVOX）の声を作る: python3 pony_gen.py jobs.json outdir
jobs.json = [[key, text, {上書き}, "アクセント指定 or null"], ...]"""
import json, subprocess, sys
from pathlib import Path
jobs = json.loads(Path(sys.argv[1]).resolve().read_text()); OUT = Path(sys.argv[2]).resolve()
sys.path.insert(0, str(Path(__file__).resolve().parent / "listen"))
import gen_listen as g
g.EMPH["p_great"] = [{"i": 0, "p": .06, "pause": .18}, {"i": 1, "p": .04, "last_p": .16, "len": 1.35}]
OUT.mkdir(parents=True, exist_ok=True)
# これまでに 手で なおした アクセント（key → カナ）。jobs の カナが 空の ときに つかう
EXTRA = json.loads((Path(__file__).resolve().parents[1] / "game/sit/fix_pony3.json").read_text()) if (Path(__file__).resolve().parents[1] / "game/sit/fix_pony3.json").exists() else {}
for key, text, ov, kana in jobs:
    kana = kana or EXTRA.get(key)
    w, t, k2, note = g.tuned(key, "metan", ov or {}, 24000, text=text, extra_fix=({key: kana} if kana else {}))
    tmp = OUT / f"{key}.wav"; tmp.write_bytes(w)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(tmp), "-af", "loudnorm=I=-22:TP=-1.5:LRA=8", "-ar", "24000", "-ac", "1", "-b:a", "40k", str(OUT / f"{key}.mp3")], check=True)
    tmp.unlink(); print(key, t, "→", k2, note, flush=True)
