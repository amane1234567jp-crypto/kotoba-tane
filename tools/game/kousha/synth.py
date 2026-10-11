"""こうしゃ台本を四国めたん（ノーマル）で合成する。
使い方: python3 synth.py <vvディレクトリ> [--dry]  --dry は読み（カナ）の一覧だけ出す。
アクセントの手直しは accent_fix.json（文 → AquesTalk風カナ）に書く。"""
import json, sys
from pathlib import Path
from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile

HERE = Path(__file__).parent
VV = Path(sys.argv[1]); DRY = "--dry" in sys.argv
STYLE = 2  # 四国めたん ノーマル
ort = Onnxruntime.load_once(filename=str(VV / "voicevox_onnxruntime-linux-x64-1.17.3/lib/libvoicevox_onnxruntime.so.1.17.3"))
syn = Synthesizer(ort, OpenJtalk(str(VV / "open_jtalk_dic_utf_8-1.11")))
with VoiceModelFile.open(str(VV / "vvmrepo/vvms/0.vvm")) as m:
    syn.load_voice_model(m)

scenes = json.loads((HERE / "scenes.json").read_text())
fixes_path = HERE / "accent_fix.json"
fixes = json.loads(fixes_path.read_text()) if fixes_path.exists() else {}
out = HERE / "audio"; out.mkdir(exist_ok=True)

manifest = []
for s in scenes:
    lines = [("main", s["main"])] + [(f"alt{i}", t) for i, t in enumerate(s["alts"], 1)]
    if s.get("abekobe"): lines.append(("abekobe", s["abekobe"]))
    if s.get("friend"): lines.append(("friend", s["friend"]))
    for kind, text in lines:
        fixed = text in fixes
        q = syn.create_audio_query_from_kana(fixes[text], STYLE) if fixed else syn.create_audio_query(text, STYLE)
        q.speed_scale, q.intonation_scale = 0.88, 1.15
        q.pre_phoneme_length, q.post_phoneme_length = 0.1, 0.2
        fid = f"k{s['no']:02d}_{kind}"
        print(f"{fid}\t{text}\t{q.kana}\t{'FIX' if fixed else ''}")
        if not DRY:
            (out / f"{fid}.wav").write_bytes(syn.synthesis(q, STYLE))
        manifest.append({"id": fid, "no": s["no"], "kind": kind, "text": text, "kana": q.kana, "fixed": fixed})
(HERE / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1))
