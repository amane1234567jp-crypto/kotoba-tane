"""ぽにー（VOICEVOX 四国めたん）の 全セリフの 読みを 出して、ひらがなの せりふと くらべる（合成は しない）: python3 pony_check.py OUT.json
せりふの 出どころ：sit/pony_*.json、sits.json（sa_/sw_）、game_pony.py の 固定分、listen/lines.json、board/*.js の speak(C.pony, "key", "text")、scratchpad の pony_tables.json・/tmp/pony_sansu.json"""
import json, re, sys, glob
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import gen_listen as g
R = Path(__file__).resolve().parents[1] / "game"  # tools/game
EXTRA = {}
for f in ["sit/fix_pony2.json", "sit/fix_pony3.json", "board/fix.json", "board/fix2.json"]:
    if (R / f).exists(): EXTRA.update(json.loads((R / f).read_text()))
items = {}
def add(k, t, kana=None):
    if k not in items: items[k] = (t, kana)
for f in sorted(glob.glob(str(R / "sit/pony_*.json"))):
    for p in json.loads(Path(f).read_text()): add(p[0], p[1], p[3] if len(p) > 3 else None)
for s in json.loads((R / "sit/sits.json").read_text()):
    for i, t in enumerate(s["tiers"]): add(f"sa_{s['id']}_{i}", t["a"])
    if s.get("word"): add(f"sw_{s['id']}", s["word"])
for k, t in [("p_ask", "なんて こたえる？"), ("p_help", "なんて いって あげる？"), ("n1", "いち！"), ("n2", "に！"), ("n3", "さん！"), ("fork", "うえと したの、どっちに いく？"), ("up", "うえ！"), ("down", "した！"), ("block", "どいて ください"), ("goal", "ゴール！"), ("teach", "がおに おしえて あげよう"), ("roll", "サイコロを ふってね"), ("takara", "たからばこ だよ！"), ("p_again", "もう いっかい いってみよう"), ("p_close", "おしい！"), ("p_great", "すごい！ いえたね！"), ("p_levelup", "レベル アップ！"), ("p_your", "きみの ばんだよ"), ("p_gao", "がおの ばんだよ"), ("p_win", "かったね！ おめでとう！"), ("p_together", "いっしょに いおうね"), ("p_kuya", "くやしい、って いってみよう"), ("p_sticker", "シールを ゲット！"), ("p_doshin", "どしんが ねてる！"), ("p_say", "まねして いってね"), ("p_bonus", "おまけで ひとつ すすもう"), ("k13_main", "くやしい"), ("k16_main", "うれしいです")]: add(k, t)
for l in json.loads((R.parent / "listen/lines.json").read_text()):
    if l["who"] == "metan": add(l["key"], l["text"])
for f in glob.glob(str(R / "board/*.js")):
    for m in re.finditer(r'speak\(C\.pony, "([^"]+)", "([^"]+)"', Path(f).read_text()): add(m.group(1), m.group(2))
for f in ["/tmp/pony_sansu.json", sys.argv[2] if len(sys.argv) > 2 else ""]:
    if f and Path(f).exists():
        for p in json.loads(Path(f).read_text()): add(p[0], p[1], p[3] if len(p) > 3 and isinstance(p, list) else None)
aud = {p.stem for p in (R / "stage_audio").glob("*.mp3")} | {p.stem for p in (R / "sit/audio").glob("*.mp3")}
rep = []
for k, (t, kana) in sorted(items.items()):
    if k not in aud: continue
    fk = kana or EXTRA.get(k) or g.FIX.get(k) or g.FIX.get(t)
    try: res = fk if fk else g.syn.create_audio_query(t, 2).kana
    except Exception as e: res = "ERR " + str(e)[:80]
    rep.append({"key": k, "text": t, "kana": res, "fixed": bool(fk)})
Path(sys.argv[1]).write_text(json.dumps(rep, ensure_ascii=False, indent=0))
print(len(items), "texts;", len(rep), "with audio;", "fixed", sum(r["fixed"] for r in rep))
