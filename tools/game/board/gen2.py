import json
from pathlib import Path
from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile
VV = Path("vv"); OUT = Path("board/audio")
ort = Onnxruntime.load_once(filename=str(VV / "voicevox_onnxruntime-linux-x64-1.17.3/lib/libvoicevox_onnxruntime.so.1.17.3"))
syn = Synthesizer(ort, OpenJtalk(str(VV / "open_jtalk_dic_utf_8-1.11")))
with VoiceModelFile.open(str(VV / "vvmrepo/vvms/0.vvm")) as m: syn.load_voice_model(m)
FIX = json.loads(Path("board/fix2.json").read_text()) if Path("board/fix2.json").exists() else {}
LINES = [
 ("p_again", "もう いっかい いってみよう"), ("p_close", "おしい！"), ("p_great", "すごい！ いえたね！"),
 ("p_levelup", "レベル アップ！"), ("p_your", "きみの ばんだよ"), ("p_gao", "がおの ばんだよ"),
 ("p_win", "かったね！ おめでとう！"), ("p_together", "いっしょに いおうね"), ("p_kuya", "くやしい、って いってみよう"),
 ("p_sticker", "シールを ゲット！"), ("p_doshin", "どしんが ねてる！"), ("p_say", "まねして いってね"), ("p_bonus", "おまけで ひとつ すすもう"),
]
for key, text in LINES:
    q = syn.create_audio_query_from_kana(FIX[key], 2) if key in FIX else syn.create_audio_query(text, 2)
    q.speed_scale = 0.9; q.intonation_scale = 1.15
    q.pre_phoneme_length, q.post_phoneme_length = 0.08, 0.15
    (OUT / f"{key}.wav").write_bytes(syn.synthesis(q, 2)); print(key, text, q.kana)
