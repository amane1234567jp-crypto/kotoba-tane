import json
from pathlib import Path
from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile
VV = Path("vv"); OUT = Path("board/audio_gao")
ort = Onnxruntime.load_once(filename=str(VV / "voicevox_onnxruntime-linux-x64-1.17.3/lib/libvoicevox_onnxruntime.so.1.17.3"))
syn = Synthesizer(ort, OpenJtalk(str(VV / "open_jtalk_dic_utf_8-1.11")))
with VoiceModelFile.open(str(VV / "vvmrepo/vvms/10.vvm")) as m: syn.load_voice_model(m)
fix = json.loads(Path("kousha/accent_fix.json").read_text())
for s in json.loads(Path("kousha/scenes.json").read_text()):
    t = s["main"]; q = syn.create_audio_query_from_kana(fix[t], 40) if t in fix else syn.create_audio_query(t, 40)
    q.speed_scale = 0.95; q.intonation_scale = 1.15; q.pre_phoneme_length, q.post_phoneme_length = 0.08, 0.15
    (OUT / f"gk{s['no']:02d}.wav").write_bytes(syn.synthesis(q, 40))
