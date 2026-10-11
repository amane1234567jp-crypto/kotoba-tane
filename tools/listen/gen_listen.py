"""聞き比べ用: いま / 調整(A) / 調整+高音質(A+B) を代表セリフで作る"""
import json, random, shutil, subprocess, sys
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
import os; os.chdir(ROOT)
from voicevox_core import Mora
from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile

VV = Path("vv"); OUT = Path("listen/out")
ort = Onnxruntime.load_once(filename=str(VV / "voicevox_onnxruntime-linux-x64-1.17.3/lib/libvoicevox_onnxruntime.so.1.17.3"))
syn = Synthesizer(ort, OpenJtalk(str(VV / "open_jtalk_dic_utf_8-1.11")))
for f in ["0.vvm", "2.vvm", "4.vvm", "9.vvm", "10.vvm", "12.vvm", "14.vvm", "21.vvm"]:
    with VoiceModelFile.open(str(VV / "vvmrepo/vvms" / f)) as m: syn.load_voice_model(m)

FIX = json.loads(Path("sit/fix.json").read_text())
S = {s["id"]: s for s in json.loads(Path("sit/sits.json").read_text())}

# 調整版の基本設定 (style, speed, pitch, intonation)
BASE = {"metan": (2, .88, 0, 1.25), "meebaa": (109, .86, -.02, 1.28), "kamejii": (42, .86, 0, 1.18),
        "gao": (11, 1.06, 0, 1.25), "chu": (12, 1.1, .03, 1.32), "doshin": (53, .8, -.03, 1.0),
        "pyon": (70, 1.06, 0, 1.38), "mii": (16, 1.0, 0, 1.28), "nobbo": (21, 1.05, .01, 1.22)}
NAME = {"metan": "ぽにー（おてほん）", "meebaa": "めえばあ（ほけんの先生）", "kamejii": "かめじい（校長先生）",
        "gao": "がお", "chu": "ちゅう", "doshin": "どしん", "pyon": "ぴょん", "mii": "みい", "nobbo": "のっぽ（としょの先生）"}
# 代表セリフ: (key, 話し手, 気持ちメモ, 上書き{style/speed/pitch/into})
LINES = [
    ("p_ask", "metan", "やさしく問いかけ", {"style": 0, "speed": .95, "pitch": .02, "into": 1.3}),
    ("sa_hoken_2", "metan", "おてほん", {}),
    ("sa_kinou_3", "metan", "おてほん", {}),
    ("sa_kaminai_3", "metan", "おてほん", {}),
    ("sa_kariru_2", "metan", "おてほん", {}),
    ("sq_hoken", "meebaa", "しんぱい", {"into": 1.35}),
    ("sr_hoken", "meebaa", "なだめる", {"speed": .82}),
    ("sq_netsu", "meebaa", "おどろき・しんぱい", {"pitch": 0}),
    ("sr_tabesugi", "meebaa", "やさしく", {"speed": .82}),
    ("sq_uwabaki", "kamejii", "ふしぎそう", {}),
    ("sr_shitsurei", "kamejii", "ほめる", {}),
    ("sq_osaki", "kamejii", "ゆったり", {"speed": .82}),
    ("sr_kabin", "kamejii", "やさしくほめる", {"speed": .82}),
    ("sq_butsukaru", "gao", "あわててあやまる", {"speed": 1.15, "into": 1.35}),
    ("sq_locker", "gao", "りきむ", {"style": 40}),
    ("sq_tobioriru", "gao", "とくい", {"style": 39, "speed": 1.1}),
    ("sr_locker", "gao", "うれしい", {"style": 39}),
    ("sx_hoken_1", "gao", "じしんまんまんで まちがえる", {}),
    ("sq_tetsudau", "chu", "こまる", {"style": 33}),
    ("sr_tetsudau", "chu", "うれしい", {"style": 32}),
    ("sq_kowai", "chu", "こわい", {"style": 33}),
    ("sr_otoshimono", "chu", "びっくり→うれしい", {"style": 32}),
    ("sq_sayonara", "doshin", "のんびり", {}),
    ("sr_sayonara", "doshin", "げんきに", {"into": 1.15, "speed": .85}),
    ("sq_dekkai", "doshin", "あれっ？", {"into": 1.1}),
    ("sr_dekkai", "doshin", "おおらか", {}),
    ("sq_kinou", "pyon", "わくわく", {}),
    ("sr_kinou", "pyon", "うらやましい", {}),
    ("sq_kasa", "pyon", "あわてる", {"speed": 1.12}),
    ("sq_mizu", "pyon", "びっくり", {"speed": 1.15, "pitch": .03}),
    ("sq_tearai", "mii", "ちょっと きびしく", {"style": 18}),
    ("sr_tearai", "mii", "にこにこ", {}),
    ("sq_gyaku", "mii", "からかう", {"into": 1.35}),
    ("sr_gyaku", "mii", "くすっと", {"style": 15}),
    ("sq_zukan", "nobbo", "ていねい", {}),
    ("sr_zukan", "nobbo", "あんない", {}),
    ("sq_kariru", "nobbo", "ていねい", {}),
    ("sr_takai", "nobbo", "やさしく", {}),
]

def text_of(key):
    if key == "p_ask": return "なんて こたえる？"
    pre, rest = key.split("_", 1)
    if pre in ("sq", "sr"): s = S[rest]; return s["q"] if pre == "sq" else s["res"]
    sid, i = rest.rsplit("_", 1); t = S[sid]["tiers"][int(i)]
    return t["a"] if pre == "sa" else t["wrong"]

PUNCT = "、。！？…"
def separators(text):
    """テキスト中の区切り(空白 or 句読点)を順に。末尾は除く"""
    out, i, n = [], 0, len(text)
    while i < n:
        if text[i] == " " or text[i] in PUNCT:
            j = i
            while j < n and (text[j] == " " or text[j] in PUNCT): j += 1
            run = text[i:j]
            if j < n:
                if "…" in run: out.append("…")
                elif any(c in run for c in "。！？"): out.append("。")
                elif "、" in run: out.append("、")
                else: out.append("S")
            i = j
        else: i += 1
    return out

def mk_pause(l): return Mora(text='、', consonant=None, consonant_length=None, vowel='pau', vowel_length=l, pitch=0.0)
PAUSE = {"、": .15, "。": .36, "…": .5}
FINAL = set("ねよなのぞかわいう")

def tuned(key, who, ov, rate):
    text = text_of(key)
    st, sp, pi, it = BASE[who]
    st = ov.get("style", st); sp = ov.get("speed", sp); pi = ov.get("pitch", pi); it = ov.get("into", it)
    fk = FIX.get(key) or FIX.get(text)
    q = syn.create_audio_query_from_kana(fk, st) if fk else syn.create_audio_query(text, st)
    seps = separators(text)
    aps = q.accent_phrases
    pz = [ap for ap in aps if ap.pause_mora is not None]
    note = ""
    while len(pz) < len(seps) and "S" in seps:  # 手直しカナで既につないだ所
        i = len(seps) - 1 - seps[::-1].index("S"); seps = seps[:i] + seps[i+1:]
    if len(pz) == len(seps):
        for ap, s in zip(pz, seps):
            if s == "S": ap.pause_mora = None  # 分かち書きの空白では止まらない
        aps = syn.replace_mora_data(aps, st)
        pz2 = [ap for ap in aps if ap.pause_mora is not None]
        for ap, s in zip(pz2, [s for s in seps if s != "S"]):
            ap.pause_mora = mk_pause(PAUSE[s])
    else:
        note = f"MISMATCH {len(pz)} vs {seps}"
        for ap in pz: ap.pause_mora = mk_pause(.2)
    rnd = random.Random(key)
    for k, ap in enumerate(aps):
        for m in ap.moras:  # ほんの少しの揺らぎ
            if m.pitch > 0: m.pitch += rnd.gauss(0, .012)
        last = ap.moras[-1]
        if ap.pause_mora is not None: last.vowel_length *= 1.12   # 句の終わりを少しのばす
    last = aps[-1].moras[-1]
    if last.text and last.text[-1] in "ネヨナノゾカワイウ": last.vowel_length *= 1.3
    # 「！」の前の句を少し高く
    if "！" in text:
        bang = [i for i, c in enumerate(text) if c == "！"]
        # 先頭句(多くは感嘆)を持ち上げる
        for m in aps[0].moras:
            if m.pitch > 0: m.pitch += .05
    q.accent_phrases = aps
    q.speed_scale, q.pitch_scale, q.intonation_scale = sp, pi, it
    q.pre_phoneme_length, q.post_phoneme_length = .05, .1
    return syn.synthesis(q, st), text, q.kana, note

def room_ir(sr=48000, sec=.35):
    r = np.random.default_rng(1); n = int(sr * sec); t = np.arange(n) / sr
    ir = r.standard_normal(n) * np.exp(-t / .07)
    for d, g in [(.007, .5), (.013, .35), (.021, .25)]: ir[int(d * sr)] += g * 4
    ir[:int(.003 * sr)] = 0
    return ir / np.abs(ir).sum() * 6

def hq_post(wav_bytes, out_mp3):
    import io, wave
    with wave.open(io.BytesIO(wav_bytes)) as w:
        sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    ir = room_ir(sr)
    wet = np.convolve(x, ir)[:len(x) + int(.25 * sr)]
    y = np.zeros_like(wet); y[:len(x)] = x
    y = y + wet * .16
    y = (np.clip(y, -1, 1) * 32767).astype(np.int16)
    tmp = out_mp3.with_suffix(".raw.wav")
    with wave.open(str(tmp), "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(y.tobytes())
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(tmp), "-af",
                    "highpass=f=75,equalizer=f=280:t=q:w=1:g=-1.5,equalizer=f=3200:t=q:w=1.2:g=2,"
                    "acompressor=threshold=-20dB:ratio=2:attack=5:release=80,loudnorm=I=-17:TP=-1.5:LRA=8",
                    "-ar", "48000", "-ac", "1", "-b:a", "112k", str(out_mp3)], check=True)
    tmp.unlink()

def lq(wav_bytes, out_mp3):
    tmp = out_mp3.with_suffix(".raw.wav"); tmp.write_bytes(wav_bytes)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(tmp), "-ac", "1", "-ar", "24000", "-b:a", "40k", str(out_mp3)], check=True)
    tmp.unlink()

if __name__ == "__main__":
    for d in ["now", "tuned", "hq"]: (OUT / d).mkdir(parents=True, exist_ok=True)
    rows = []
    for key, who, mood, ov in LINES:
        src = Path("sit/audio") / f"{key}.mp3"
        shutil.copy(src, OUT / "now" / f"{key}.mp3")
        w24, text, kana, note = tuned(key, who, ov, 24000); lq(w24, OUT / "tuned" / f"{key}.mp3")
        w48 = w24; hq_post(w48, OUT / "hq" / f"{key}.mp3")
        rows.append({"key": key, "who": who, "name": NAME[who], "mood": mood, "text": text})
        print(key, text, "→", kana, note)
    (OUT / "lines.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1))
