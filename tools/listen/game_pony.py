"""ぽにー（四国めたん）の全セリフを「ちょうせい」方式で作り直し、ゲーム用に書き出す"""
import json, subprocess, sys
from pathlib import Path
sys.path.insert(0, "listen")
import gen_listen as g
g.EMPH["p_great"] = [{"i": 0, "p": .06, "pause": .18}, {"i": 1, "p": .04, "last_p": .16, "len": 1.35}]
S = json.loads(Path("sit/sits.json").read_text())
BF = {"p_great": "スゴ'イ、イエタネ'"}
for f in ["board/fix.json", "board/fix2.json"]:
    if Path(f).exists(): BF.update(json.loads(Path(f).read_text()))
CHEER = {"style": 2, "speed": .95, "pitch": .03, "into": 1.45}
jobs = [("p_ask", "なんて こたえる？", {"style": 0, "speed": .95, "pitch": .02, "into": 1.3}),
        ("p_help", "なんて いって あげる？", {"style": 0, "speed": .95, "pitch": .02, "into": 1.3})]
for s in S:
    for i, t in enumerate(s["tiers"]): jobs.append((f"sa_{s['id']}_{i}", t["a"], {}))
    if s.get("word"): jobs.append((f"sw_{s['id']}", s["word"], {}))
B = [("n1","いち！",CHEER),("n2","に！",CHEER),("n3","さん！",CHEER),("fork","うえと したの、どっちに いく？",{}),("up","うえ！",CHEER),("down","した！",CHEER),
     ("block","どいて ください",{}),("goal","ゴール！",CHEER),("teach","がおに おしえて あげよう",{}),("roll","サイコロを ふってね",{}),("takara","たからばこ だよ！",CHEER),
     ("p_again","もう いっかい いってみよう",{"style":0}),("p_close","おしい！",{"into":1.4}),("p_great","すごい！ いえたね！",CHEER),("p_levelup","レベル アップ！",CHEER),
     ("p_your","きみの ばんだよ",{}),("p_gao","がおの ばんだよ",{}),("p_win","かったね！ おめでとう！",CHEER),("p_together","いっしょに いおうね",{"style":0}),
     ("p_kuya","くやしい、って いってみよう",{}),("p_sticker","シールを ゲット！",CHEER),("p_doshin","どしんが ねてる！",{"into":1.4}),("p_say","まねして いってね",{}),
     ("p_bonus","おまけで ひとつ すすもう",{}),("k13_main","くやしい",{}),("k16_main","うれしいです",{})]
jobs += B
OUT = Path("game_out/pony"); OUT.mkdir(parents=True, exist_ok=True)
for key, text, ov in jobs:
    w, t, kana, note = g.tuned(key, "metan", ov, 24000, text=text, extra_fix=BF)
    tmp = OUT / f"{key}.wav"; tmp.write_bytes(w)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(tmp), "-af", "loudnorm=I=-22:TP=-1.5:LRA=8", "-ar", "24000", "-ac", "1", "-b:a", "40k", str(OUT / f"{key}.mp3")], check=True)
    tmp.unlink(); print(key, t, "→", kana, note)
