import json, sys
from pathlib import Path
from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile
VV = Path("vv"); OUT = Path("board/audio")
ort = Onnxruntime.load_once(filename=str(VV / "voicevox_onnxruntime-linux-x64-1.17.3/lib/libvoicevox_onnxruntime.so.1.17.3"))
syn = Synthesizer(ort, OpenJtalk(str(VV / "open_jtalk_dic_utf_8-1.11")))
for f in ["0.vvm", "10.vvm"]:
    with VoiceModelFile.open(str(VV / "vvmrepo/vvms" / f)) as m: syn.load_voice_model(m)
FIX = json.loads(Path("board/fix.json").read_text()) if Path("board/fix.json").exists() else {}
LINES = [
 ("n1", 2, "いち！"), ("n2", 2, "に！"), ("n3", 2, "さん！"),
 ("fork", 2, "うえと したの、どっちに いく？"), ("up", 2, "うえ！"), ("down", 2, "した！"),
 ("block", 2, "どいて ください"), ("takara", 2, "たからばこ だよ！"), ("goal", 2, "ゴール！"),
 ("teach", 2, "がおに おしえて あげよう"), ("roll", 2, "サイコロを ふってね"),
 ("g_go", 40, "いくぞ！"), ("g_huh", 40, "あれ？ ちがった？"), ("g_thanks", 40, "そっか、ありがとな"),
 ("g_good", 40, "いい しょうぶ だったな"), ("g_win", 40, "へへっ、おれの かちだ"),
 ("g_abe17", 40, "ちゅうが がおを おいかける"), ("g_abe18", 40, "げたばこを くつに いれる"), ("g_abe20", 40, "ほんが ちゅうを はこぶ"),
]
for key, sid, text in LINES:
    q = syn.create_audio_query_from_kana(FIX[key], sid) if key in FIX else syn.create_audio_query(text, sid)
    q.speed_scale = 0.9 if sid == 2 else 1.0; q.intonation_scale = 1.15
    q.pre_phoneme_length, q.post_phoneme_length = 0.08, 0.15
    (OUT / f"{key}.wav").write_bytes(syn.synthesis(q, sid)); print(key, text, q.kana, "FIX" if key in FIX else "")
