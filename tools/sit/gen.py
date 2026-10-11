import json, sys
from pathlib import Path
from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile
VV = Path("vv"); OUT = Path("sit/audio")
ort = Onnxruntime.load_once(filename=str(VV / "voicevox_onnxruntime-linux-x64-1.17.3/lib/libvoicevox_onnxruntime.so.1.17.3"))
syn = Synthesizer(ort, OpenJtalk(str(VV / "open_jtalk_dic_utf_8-1.11")))
for f in ["0.vvm", "2.vvm", "4.vvm", "9.vvm", "10.vvm", "12.vvm", "14.vvm", "21.vvm"]:
    with VoiceModelFile.open(str(VV / "vvmrepo/vvms" / f)) as m: syn.load_voice_model(m)
V = {"metan": (2, .88, 0, 1.15), "gao": (40, 1.0, 0, 1.0), "chu": (33, 1.15, .03, 1.2), "kamejii": (42, .8, 0, 1.0),
     "meebaa": (109, .8, -.03, 1.1), "pyon": (70, 1.05, 0, 1.3), "nobbo": (21, 1.12, .02, 1.1), "mii": (18, .95, 0, 1.2), "doshin": (53, .75, -.04, .8)}
FIX = json.loads(Path("sit/fix.json").read_text()) if Path("sit/fix.json").exists() else {}
only = sys.argv[1:]
IDS = None
if only and only[0].startswith("--ids="): IDS = only[0][6:].split(","); only = []
S = json.loads(Path("sit/sits.json").read_text())
jobs = [("p_ask", "metan", "なんて こたえる？"), ("p_help", "metan", "なんて いって あげる？")]
for s in S:
    if IDS and s["id"] not in IDS: continue
    jobs += [(f"sq_{s['id']}", s["asker"], s["q"]), (f"sr_{s['id']}", s["asker"], s["res"])]
    if s.get("word"): jobs.append((f"sw_{s['id']}", "metan", s["word"]))
    for i, t in enumerate(s["tiers"]):
        jobs.append((f"sa_{s['id']}_{i}", "metan", t["a"]))
        if s["gaoOk"]: jobs.append((f"sg_{s['id']}_{i}", "gao", t["a"]))
        if t.get("wrong"): jobs.append((f"sx_{s['id']}_{i}", "gao", t["wrong"]))
for key, who, text in jobs:
    if only and key not in only: continue
    sid, sp, pi, it = V[who]
    fk = FIX.get(key) or FIX.get(text)
    q = syn.create_audio_query_from_kana(fk, sid) if fk else syn.create_audio_query(text, sid)
    q.speed_scale, q.pitch_scale, q.intonation_scale = sp, pi, it
    q.pre_phoneme_length, q.post_phoneme_length = 0.08, 0.15
    (OUT / f"{key}.wav").write_bytes(syn.synthesis(q, sid))
    print(f"{key}\t{text}\t{q.kana}\t{'FIX' if fk else ''}")
