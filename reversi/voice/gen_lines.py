"""まるシマリバーシの読み上げ台本を作る: python3 reversi/voice/gen_lines.py
ぽにー（VOICEVOX 調整版）→ pony.json、かめじい（AivisSpeech）→ aivis/lines.json"""
import json
from pathlib import Path
H = Path(__file__).parent
ONES = ["", "いち", "に", "さん", "よん", "ご", "ろく", "なな", "はち", "きゅう"]
def ko(n):
    """数＋「こ」のよみ（いっこ・ろっこ・はっこ・じゅっこ など）"""
    if n == 0: return "ぜろこ"
    t, o = divmod(n, 10)
    tens = "" if t == 0 else ("じゅう" if t == 1 else ONES[t] + "じゅう")
    if o == 0: return tens[:-3] + "じゅっこ"
    return tens + {1: "いっこ", 6: "ろっこ", 8: "はっこ"}.get(o, ONES[o] + "こ")
assert ko(1) == "いっこ" and ko(10) == "じゅっこ" and ko(20) == "にじゅっこ" and ko(36) == "さんじゅうろっこ" and ko(64) == "ろくじゅうよんこ" and ko(0) == "ぜろこ"
PONY = [
    ("rv_pass_k", "くろは おけるところが ないから パス！ しろの ばん！"),
    ("rv_pass_s", "しろは おけるところが ないから パス！ くろの ばん！"),
    ("rv_matta_k", "くろが まったって！ いいかな？"),
    ("rv_matta_s", "しろが まったって！ いいかな？"),
    ("rv_wait", "おへんじを まってるよ"),
    ("rv_refused", "こんどは そのまま つづけよう"),
    ("rv_again", "もういっかい やる？"),
    ("rv_hold", "ちょっと まってね"),
    ("rv_back", "つながったよ！ つづきから やろう"),
]
KAME = [("rv_start", "はじめ！ さきは くろ からだよ"), ("rv_win_k", "くろの かち！"), ("rv_win_s", "しろの かち！"), ("rv_draw", "おなじ かず！ ひきわけ！")]
for n in range(65):
    KAME.append((f"rv_k{n}", f"くろが {ko(n)}、"))
    KAME.append((f"rv_s{n}", f"しろが {ko(n)}"))
(H / "pony.json").write_text(json.dumps([[k, t, {}, None] for k, t in PONY], ensure_ascii=False, indent=0))
# AivisSpeech は漢字まじりのほうが読み・アクセントが安定するので、読ませる文（yomi）を別に持つ
YOMI = {"rv_start": "はじめ！ 先は、黒からだよ。", "rv_win_k": "黒の、勝ち！", "rv_win_s": "白の、勝ち！", "rv_draw": "同じ数！ 引き分け！"}
for n in range(65):
    YOMI[f"rv_k{n}"] = f"黒が、{n}個。"
    YOMI[f"rv_s{n}"] = f"白が、{n}個。"
J = H / "rv1"; J.mkdir(exist_ok=True)
(J / "lines.json").write_text(json.dumps([{"key": k, "who": "kamejii", "text": t} for k, t in KAME], ensure_ascii=False, indent=0))
(J / "yomi.json").write_text(json.dumps(YOMI, ensure_ascii=False, indent=0))
# 画面の吹き出し用（声と同じ文）
(H / "lines.js").write_text("/* 読み上げの文（voice/gen_lines.py が作る） */\nconst VOICE_TEXT = " + json.dumps(dict(PONY + KAME), ensure_ascii=False) + ";\n")
print(len(PONY), "pony,", len(KAME), "kamejii")
