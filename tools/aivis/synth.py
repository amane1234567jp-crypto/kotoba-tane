import json, sys, time, urllib.request, urllib.parse, subprocess, io, wave
from pathlib import Path
import numpy as np
OUT = Path(sys.argv[1]); JOB = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(".")
SUB = "aivis" if JOB == Path(".") else JOB.name
(OUT / SUB).mkdir(parents=True, exist_ok=True)
E = "http://127.0.0.1:10101"
yomi = json.loads((JOB / "yomi.json").read_text()) if (JOB / "yomi.json").exists() else {}
ACC = json.loads(Path("acc.json").read_text()) if Path("acc.json").exists() else {}
if (JOB / "acc.json").exists() and JOB != Path("."): ACC.update(json.loads((JOB / "acc.json").read_text()))
cast = json.loads(Path("cast.json").read_text()); lines = json.loads((JOB / "lines.json").read_text())
def call(method, path, data=None, ctype=None, timeout=600):
    req = urllib.request.Request(E + path, data=data, method=method)
    if ctype: req.add_header("Content-Type", ctype)
    with urllib.request.urlopen(req, timeout=timeout) as r: return r.read()
installed = json.loads(call("GET", "/aivm_models"))
for who, c in cast["chars"].items():
    if c["model"] in installed: continue
    url = f"https://api.aivis-project.com/v1/aivm-models/{c['model']}/download?model_type=AIVMX"
    body = urllib.parse.urlencode({"url": url}).encode()
    try: call("POST", "/aivm_models/install", body, "application/x-www-form-urlencoded"); print("installed", who, c["model"])
    except Exception as e: print("install fail", who, e, getattr(e, "read", lambda: b"")()[:300])
    installed = json.loads(call("GET", "/aivm_models"))
(OUT / "installed.json").write_text(json.dumps(installed, ensure_ascii=False, indent=1)[:300000])
speakers = json.loads(call("GET", "/speakers")); (OUT / "speakers.json").write_text(json.dumps(speakers, ensure_ascii=False, indent=1))
def style_id(model, style):
    info = installed.get(model)
    if not info: return None, None
    sts = [st for ls in info.get("speakers", []) for st in ls["speaker"]["styles"]]
    for st in sts:
        if st["name"] == style: return st["id"], st["name"]
    return (sts[0]["id"], sts[0]["name"] + "(fallback)") if sts else (None, None)
def reshape(aps, spec, key):
    moras = [m for ap in aps for m in ap["moras"]]
    flat = "".join(m["text"] for m in moras)
    if flat != "".join(t for t, _ in spec):
        print("ACC MISMATCH", key, flat, spec, flush=True); return aps
    out, i = [], 0
    for t, a in spec:
        grp, acc = [], ""
        while acc != t: grp.append(moras[i]); acc += moras[i]["text"]; i += 1
        out.append({"moras": grp, "accent": a, "pause_mora": None, "is_interrogative": t.endswith("?")})
    return out
def room_ir(sr, sec=.35):
    r = np.random.default_rng(1); n = int(sr * sec); t = np.arange(n) / sr
    ir = r.standard_normal(n) * np.exp(-t / .07)
    for d, g in [(.007, .5), (.013, .35), (.021, .25)]: ir[int(d * sr)] += g * 4
    ir[:int(.003 * sr)] = 0
    return ir / np.abs(ir).sum() * 6
def post(wav, out):
    with wave.open(io.BytesIO(wav)) as w:
        sr = w.getframerate(); ch = w.getnchannels()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    if ch > 1: x = x.reshape(-1, ch).mean(1)
    wet = np.convolve(x, room_ir(sr))[:len(x) + int(.25 * sr)]
    y = np.zeros_like(wet); y[:len(x)] = x; y = y + wet * .16
    y = (np.clip(y, -1, 1) * 32767).astype(np.int16)
    tmp = out.with_suffix(".wav")
    with wave.open(str(tmp), "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(y.tobytes())
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(tmp), "-af",
        "highpass=f=75,equalizer=f=280:t=q:w=1:g=-1.5,equalizer=f=3200:t=q:w=1.2:g=2,acompressor=threshold=-20dB:ratio=2:attack=5:release=80,loudnorm=I=-17:TP=-1.5:LRA=8",
        "-ar", "48000", "-ac", "1", "-b:a", "112k", str(out)], check=True)
    tmp.unlink()
report = []
for l in lines:
    c = dict(cast["chars"][l["who"]]); c.update(cast["lines"].get(l["key"], {}))
    sid, sname = style_id(c["model"], c["style"])
    text = yomi.get(l["key"]) or l["text"].replace(" ", "")
    if sid is None: report.append({"key": l["key"], "error": "no speaker"}); continue
    t0 = time.time()
    try:
        q = json.loads(call("POST", "/audio_query?" + urllib.parse.urlencode({"text": text, "speaker": sid})))
        if l["key"] in ACC: q["accent_phrases"] = reshape(q["accent_phrases"], ACC[l["key"]], l["key"])
        q["speedScale"] = c.get("speed", 1.0); q["intonationScale"] = c.get("into", q.get("intonationScale", 1.0))
        q["prePhonemeLength"] = .05; q["postPhonemeLength"] = .1
        wav = call("POST", f"/synthesis?speaker={sid}", json.dumps(q).encode(), "application/json")
        post(wav, OUT / SUB / f"{l['key']}.mp3")
        report.append({"key": l["key"], "who": l["who"], "style": sname, "sec": round(time.time() - t0, 1), "text": text, "acc": " / ".join("".join(m["text"] for m in ap["moras"]) + f"[{ap['accent']}]" for ap in q["accent_phrases"])})
    except Exception as e:
        report.append({"key": l["key"], "error": str(e)[:200]})
    print(report[-1], flush=True)
(OUT / ("report.json" if SUB == "aivis" else f"report_{SUB}.json")).write_text(json.dumps(report, ensure_ascii=False, indent=1))
