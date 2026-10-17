"""ステージごとの BGM を つくる（こうしゃ は いままでの sfx/bgm.wav のまま）
  python3 board/make_bgm.py   （tools/game で 実行）
  → stage_audio/bgm_<ステージ>.mp3（ループの 前後に 0.5びょうずつ つづきの 音を つけて いる）
  → board/bgm_data.js（BGM_LEN：ループの ながさ。ゲームは loopStart=0.5, loopEnd=0.5+ながさ で ならす）
メロディーは 音階の 番号（1〜7、' は 1オクターブ上、, は 下、- は のばす、. は やすみ）。1つ＝8分音符。"""
import json, subprocess, wave
from pathlib import Path
import numpy as np

SR = 24000
G = Path(__file__).resolve().parents[1]
rng = np.random.default_rng(7)
mf = lambda m: 440 * 2 ** ((m - 69) / 12)
MAJ, MIN = [0, 2, 4, 5, 7, 9, 11], [0, 2, 3, 5, 7, 8, 10]

def env(n, a, d):  # 立ち上がり a 秒・減衰の 速さ d（秒）
    t = np.arange(n) / SR; e = np.exp(-t / d); k = max(1, int(a * SR)); e[:k] *= np.linspace(0, 1, k); return e
def osc(f, n, kind="sine", vib=0, vr=5.5):
    t = np.arange(n) / SR; ph = 2 * np.pi * np.cumsum(np.full(n, f) * (1 + vib * np.sin(2 * np.pi * vr * t))) / SR
    if kind == "sine": return np.sin(ph)
    if kind == "tri": return 2 / np.pi * np.arcsin(np.sin(ph))
    if kind == "sq": return np.sign(np.sin(ph)) * .6
    if kind == "saw": return ((ph / (2 * np.pi)) % 1) * 2 - 1
def lp(x, fc):  # 1次の ローパス
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = 0.
    for i in range(len(x)): s = (1 - a) * x[i] + a * s; y[i] = s
    return y
def lpf(x, fc):  # 速い ローパス（2回）
    from scipy.signal import lfilter
    a = np.exp(-2 * np.pi * fc / SR); return lfilter([1 - a], [1, -a], lfilter([1 - a], [1, -a], x))
def hpf(x, fc):
    from scipy.signal import lfilter
    a = np.exp(-2 * np.pi * fc / SR); return lfilter([(1 + a) / 2, -(1 + a) / 2], [1, -a], x)

# ---------- 楽器 ----------
def marimba(f, dur): n = int((dur + .6) * SR); return osc(f, n) * env(n, .003, .35) + .35 * osc(f * 4, n) * env(n, .002, .05)
def glock(f, dur): n = int((dur + 1.0) * SR); return osc(f, n) * env(n, .002, .6) + .4 * osc(f * 2.76, n) * env(n, .001, .2) + .2 * osc(f * 5.4, n) * env(n, .001, .08)
def piano(f, dur): n = int((dur + .8) * SR); x = sum(osc(f * h * (1 + .0007 * h), n) * (1 / h ** 1.3) * env(n, .003, .9 / h ** .5) for h in range(1, 6)); return x * .8
def pluck(f, dur, decay=.996):  # カープラス・ストロング（ウクレレ・ピチカート）
    n = int((dur + .5) * SR); p = max(2, int(SR / f)); buf = rng.uniform(-1, 1, p); out = np.empty(n)
    for i in range(n): out[i] = buf[i % p]; buf[i % p] = decay * .5 * (buf[i % p] + buf[(i + 1) % p])
    return lpf(out, 4000) * 1.2
def flute(f, dur): n = int((dur + .15) * SR); x = osc(f, n, vib=.006) + .25 * osc(f * 2, n, vib=.006) + .02 * rng.normal(size=n); e = np.minimum(1, np.arange(n) / (.04 * SR)) * np.clip((n - np.arange(n)) / (.12 * SR), 0, 1); return x * e * .8
def brass(f, dur): n = int((dur + .1) * SR); x = lpf(osc(f, n, "saw", vib=.004), 1800 + 600 * np.sin(1)); e = np.minimum(1, np.arange(n) / (.03 * SR)) * np.clip((n - np.arange(n)) / (.08 * SR), 0, 1); return x * e * .7
def clar(f, dur): n = int((dur + .1) * SR); x = lpf(osc(f, n, "sq", vib=.004), 2200); e = np.minimum(1, np.arange(n) / (.025 * SR)) * np.clip((n - np.arange(n)) / (.08 * SR), 0, 1); return x * e
def recorder(f, dur): n = int((dur + .1) * SR); x = osc(f, n, "tri", vib=.005) + .15 * osc(f * 2, n); e = np.minimum(1, np.arange(n) / (.03 * SR)) * np.clip((n - np.arange(n)) / (.06 * SR), 0, 1); return x * e * .9
def bassI(f, dur, kind="tri"): n = int((dur + .05) * SR); x = osc(f, n, kind) + .3 * osc(f * 2, n); return lpf(x, 900) * env(n, .005, max(.15, dur * .9))
def pad(fs, dur): n = int((dur + .3) * SR); x = sum(osc(f * (1 + d), n, "tri") for f in fs for d in (-.003, .003)) / (2 * len(fs)); e = np.minimum(1, np.arange(n) / (.25 * SR)) * np.clip((n - np.arange(n)) / (.3 * SR), 0, 1); return lpf(x, 1600) * e
def kick(): n = int(.3 * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * np.cumsum(50 + 110 * np.exp(-t / .04)) / SR) * env(n, .001, .12)
def snare(): n = int(.22 * SR); return hpf(rng.normal(size=n), 900) * env(n, .001, .06) * .6 + osc(190, n) * env(n, .001, .04) * .4
def hat(o=False): n = int((.25 if o else .06) * SR); return hpf(rng.normal(size=n), 7000) * env(n, .001, .09 if o else .02) * .35
def shaker(): n = int(.08 * SR); return hpf(rng.normal(size=n), 5000) * env(n, .01, .03) * .25
def tom(f=110): n = int(.35 * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * np.cumsum(f * (1 + .6 * np.exp(-t / .05))) / SR) * env(n, .002, .15)
def clap(): n = int(.18 * SR); x = hpf(rng.normal(size=n), 1200); e = np.zeros(n); [e.__setitem__(slice(int(o * SR), n), e[int(o * SR):] + env(n - int(o * SR), .001, .03)) for o in (0, .012, .024)]; return x * e * .4
def bird(): n = int(.35 * SR); t = np.arange(n) / SR; f = 3200 + 900 * np.sin(2 * np.pi * 9 * t) + 1200 * t; return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .01, .09) * .12
def wood(): n = int(.1 * SR); return osc(1600, n) * env(n, .001, .02) * .5 + osc(2400, n) * env(n, .001, .01) * .2

# ---------- 曲の しくみ ----------
def parse(mel, root, scale):
    out = []; t = 0
    for tok in mel.replace("|", " ").split():
        if tok == "-": (out[-1].__setitem__(1, out[-1][1] + 1) if out and out[-1][0] is not None else None); t += 1; continue
        if tok == ".": out.append([None, 1, t]); t += 1; continue
        d = int(tok[0]); octv = tok.count("'") - tok.count(","); acc = tok.count("#") - tok.count("b")
        m = root + scale[d - 1] + 12 * octv + acc; out.append([m, 1, t]); t += 1
    return [(m, l, s) for m, l, s in out if m is not None]
def chord(root, scale, deg):  # 音階の 番号 → 3和音（ルート・3・5）
    i = deg - 1; return [root + scale[(i + k) % 7] + 12 * ((i + k) // 7) for k in (0, 2, 4)]

def song(name, bpm, root, scale, bars, mel, chords, lead, lead2, drums, bass="tri", comp="pad", extra=None, per_bar=8, swing=0.):
    e8 = 60 / bpm / 2; barlen = per_bar * e8; L = bars * barlen * 2  # メロディーを 2回（2回目は 楽器を かえる）
    n = int(L * 3 * SR) + SR; mix = np.zeros(n); bus = {k: np.zeros(n) for k in ("lead", "comp", "bass", "drum", "fx")}
    def put(k, t, x, v=1.):
        i = int(t * SR); j = min(n, i + len(x)); bus[k][i:j] += x[:j - i] * v
    tim = lambda s: (s + (swing if s % 2 == 1 else 0)) * e8  # スウィング
    notes = parse(mel, root, scale)
    for c in range(3 * 2):  # 3しゅうぶん（まんなかを つかう）× 2回
        base = c * bars * barlen; ins = lead if c % 2 == 0 else lead2
        for m, l, s in notes:
            f = mf(m + (12 if (c % 2 == 1 and ins in (glock, flute, recorder)) and m < 79 else 0)); put("lead", base + tim(s), ins(f, l * e8 * .95), .5)
        for b in range(bars):
            t0 = base + b * barlen; deg = chords[b]; ch = chord(root, scale, deg)
            if comp == "pad": put("comp", t0, pad([mf(m) for m in ch], barlen), .35)
            elif comp == "piano":
                for k in range(0, per_bar, 2 if per_bar == 8 else 2): put("comp", t0 + tim(k) + (0 if k == 0 else 0), sum(piano(mf(m), e8 * 1.5) for m in (ch if k else ch[:1])) / 3, .22 if k else .3)
            elif comp == "pluck":
                for k in range(per_bar): put("comp", t0 + tim(k), pluck(mf(ch[k % 3] + (0 if k < 4 else 12)), e8), .18)
            elif comp == "marimba":
                for k in range(1, per_bar, 2): put("comp", t0 + tim(k), sum(marimba(mf(m), e8) for m in ch) / 3, .25)
            elif comp == "pizz":
                for k in (0, 2, 4, 6)[:per_bar // 2]: put("comp", t0 + tim(k), sum(pluck(mf(m + 12), e8, .99) for m in ch) / 3, .25)
            bm = ch[0] - 24 if ch[0] - 24 >= 33 else ch[0] - 12
            for k in ((0, 4) if per_bar == 8 else (0,)): put("bass", t0 + tim(k), bassI(mf(bm), e8 * 3, bass), .5)
            if per_bar == 8: put("bass", t0 + tim(6), bassI(mf(bm + 7), e8, bass), .4)
            else: [put("bass", t0 + tim(k), bassI(mf(bm + 7), e8, bass), .3) for k in (2, 4)]
            drums(put, t0, tim, b, per_bar)
            if extra: extra(put, t0, tim, b, per_bar, c)
    for k, v in (("lead", 1), ("comp", 1), ("bass", 1), ("drum", 1), ("fx", 1)): mix += bus[k] * v
    # かるい ひびき
    for dly, g in ((.083, .18), (.131, .12), (.197, .08)): d = int(dly * SR); mix[d:] += mix[:-d] * g * .5
    seg = mix[int((L * 2 - .5) * SR) - int(L * SR): int((L * 2 + .5) * SR)]  # ループ1つ ＋ 前後 0.5びょう（2しゅうめ）
    seg = seg[: int((L + 1.0) * SR)]
    return seg, L

def norm(x, target=.135):
    r = np.sqrt((x ** 2).mean()); x = x * (target / r); pk = np.abs(x).max()
    return np.tanh(x / .95) * .95 if pk > .95 else x

def D_march(put, t0, tim, b, pb):
    for k in range(0, 8, 2): put("drum", t0 + tim(k), kick() if k in (0, 4) else snare(), .6)
    for k in range(8): put("drum", t0 + tim(k), hat(), .5)
    if b % 4 == 3: [put("drum", t0 + tim(6) + i * .06, snare(), .35) for i in range(4)]
def D_easy(put, t0, tim, b, pb):
    put("drum", t0, kick(), .45); put("drum", t0 + tim(4), kick(), .35)
    for k in range(8): put("drum", t0 + tim(k), shaker(), .8 if k % 2 else .5)
    put("drum", t0 + tim(2), clap(), .25); put("drum", t0 + tim(6), clap(), .25)
def D_shop(put, t0, tim, b, pb):
    for k in (0, 4): put("drum", t0 + tim(k), kick(), .5)
    for k in (2, 6): put("drum", t0 + tim(k), snare(), .35)
    for k in range(8): put("drum", t0 + tim(k), hat(k == 7), .45)
def D_train(put, t0, tim, b, pb):  # シュッシュッ（ブラシの きざみ）
    for k in range(8): put("drum", t0 + tim(k), hpf(rng.normal(size=int(.07 * SR)), 2500) * env(int(.07 * SR), .005, .03) * (.5 if k % 2 else .25), 1)
    for k in (0, 4): put("drum", t0 + tim(k), kick(), .45)
    if b % 2 == 1: put("drum", t0 + tim(7), wood(), .4)
def D_waltz(put, t0, tim, b, pb):
    put("drum", t0, kick(), .3); [put("drum", t0 + tim(k), shaker(), .4) for k in (2, 4)]
def D_adv(put, t0, tim, b, pb):
    for k in (0, 3, 4): put("drum", t0 + tim(k), kick(), .55)
    for k in (2, 6): put("drum", t0 + tim(k), snare(), .45)
    for k in range(8): put("drum", t0 + tim(k), hat(), .4)
    if b % 4 == 3: [put("drum", t0 + tim(4 + i), tom(160 - i * 25), .5) for i in range(4)]
def D_walk(put, t0, tim, b, pb):
    for k in (0, 4): put("drum", t0 + tim(k), kick(), .4)
    for k in range(8): put("drum", t0 + tim(k), wood() if k in (2, 6) else shaker(), .45)
def D_class(put, t0, tim, b, pb):
    for k in (0, 4): put("drum", t0 + tim(k), kick(), .4)
    for k in (2, 6): put("drum", t0 + tim(k), clap(), .3)
    for k in range(1, 8, 2): put("drum", t0 + tim(k), hat(), .4)
def X_birds(put, t0, tim, b, pb, c):
    if b % 2 == 0: put("fx", t0 + tim(3), bird(), 1); put("fx", t0 + tim(3) + .18, bird(), .8)
def X_bell(put, t0, tim, b, pb, c):
    if b == 0 and c % 2 == 0: [put("fx", t0 + i * .32, glock(mf(m), .3), .2) for i, m in enumerate((76, 72, 74, 67))]

SONGS = {
 "undou": dict(bpm=138, root=67, scale=MAJ, bars=8, lead=brass, lead2=clar, drums=D_march, comp="pad", bass="sq",
   mel="1 - 1 - 3 - 5 - | 1' - - - 5 - . . | 6 - 5 - 4 - 3 - | 2 - - - 5, - . . | 1 - 1 - 3 - 5 - | 6 - 1' - 6 - 5 - | 4 - 3 - 2 - 7, - | 1 - - - . . . .",
   chords=[1, 1, 4, 5, 1, 4, 5, 1]),
 "kouen": dict(bpm=120, root=69, scale=MAJ, bars=8, lead=marimba, lead2=flute, drums=D_shop, comp="pluck", swing=.25,
   mel="3 - 5 - 6 5 3 - | 2 - - - . . 1 2 | 3 - 5 - 6 1' 6 5 | 5 - - - . . . . | 6 - 6 5 3 - 2 1 | 2 - 3 - 5 - - - | 6 - 5 3 2 - 3 2 | 1 - - - . . . .",
   chords=[1, 5, 4, 1, 4, 1, 5, 1]),
 "omise": dict(bpm=128, root=64, scale=MAJ, bars=8, lead=glock, lead2=marimba, drums=D_shop, comp="piano", swing=.3,
   mel="5 3 5 - 6 5 3 - | 4 2 4 - 5 4 2 - | 3 1 3 - 5 3 1' - | 7 - 6 - 5 - . . | 5 3 5 - 6 5 3 - | 4 2 4 - 5 4 2 - | 3 5 1' 7 6 5 2 3 | 1 - - - . . . .",
   chords=[1, 5, 1, 5, 1, 5, 4, 1]),
 "densha": dict(bpm=148, root=65, scale=MAJ, bars=8, lead=clar, lead2=flute, drums=D_train, comp="marimba",
   mel="1 - 3 - 5 - 3 - | 4 - 6 - 5 - - - | 3 - 5 - 1' - 6 - | 5 - - - . . . . | 6 - 6 - 5 - 4 - | 3 - 3 - 2 - 1 - | 2 - 3 - 4 - 7, - | 1 - - - . . . .",
   chords=[1, 4, 1, 5, 4, 1, 5, 1]),
 "gakkou2": dict(bpm=144, root=72, scale=MAJ, bars=8, lead=glock, lead2=piano, drums=D_waltz, comp="pad", per_bar=6,
   mel="3 - - 4 5 - | 1' - - - 5 - | 6 - 5 - 4 - | 3 - - - . . | 2 - - 3 4 - | 7 - - - 6 - | 5 - 4 - 2 - | 1 - - - . .",
   chords=[1, 1, 4, 1, 2, 5, 5, 1]),
 # だいぼうけん：ようきに はずむ（長調・はやめ・スウィング）
 "long": dict(bpm=144, root=67, scale=MAJ, bars=8, lead=brass, lead2=glock, drums=D_adv, comp="piano", bass="sq", swing=.2,
   mel="1 - 3 5 1' - 5 - | 6 - 5 3 4 - 3 - | 2 - 4 6 5 - 4 - | 3 - 2 - 5 - . . | 1 - 3 5 1' - 5 - | 6 - 1' 6 5 - 3 - | 4 - 3 4 2 - 7, - | 1 - 3 - 1 - . .",
   chords=[1, 4, 2, 5, 1, 4, 5, 1]),
 "toukou": dict(bpm=128, root=69, scale=MAJ, bars=8, lead=glock, lead2=marimba, drums=D_walk, comp="pizz", extra=X_birds,
   mel="5, - 1 - 3 - 5 - | 6 - 5 - 3 - - - | 4 - 6 - 5 - 3 - | 2 - - - . . . . | 5, - 1 - 3 - 5 - | 1' - 7 - 6 - 5 - | 4 - 3 - 2 - 5, - | 1 - - - . . . .",
   chords=[1, 4, 4, 5, 1, 4, 5, 1]),
 "gakkou3": dict(bpm=124, root=67, scale=MAJ, bars=8, lead=recorder, lead2=glock, drums=D_shop, comp="piano", extra=X_bell,
   mel="1 2 3 - 1 2 3 - | 5 3 2 1 2 - - - | 1 2 3 - 1 2 3 - | 5 3 2 3 1 - - - | 5 5 6 - 5 4 3 - | 4 4 5 - 4 3 2 - | 3 3 4 - 5 - 6 7 | 1' - - - . . . .",
   chords=[1, 5, 1, 5, 1, 4, 5, 1]),
 # きゅうしょく：はずむ マリンバと ウクレレ。おなかが すく たのしい おひる
 "kyuushoku": dict(bpm=132, root=69, scale=MAJ, bars=8, lead=marimba, lead2=glock, drums=D_easy, comp="pluck", swing=.3,
   mel="1 3 5 3 6 5 3 - | 4 6 5 4 3 - - - | 2 4 6 4 5 4 2 - | 5 - 4 - 3 - 2 - | 1 3 5 3 6 5 3 - | 1' - 6 - 5 - 3 - | 4 3 2 - 5, 7, 2 - | 1 - - - . . . .",
   chords=[1, 4, 2, 5, 1, 6, 5, 1]),
 # げこう：たのしい かえりみち。はずむ マリンバと グロッケン
 "gekou": dict(bpm=120, root=67, scale=MAJ, bars=8, lead=marimba, lead2=glock, drums=D_easy, comp="pluck", swing=.25, extra=X_birds,
   mel="3 - 2 - 1 - 5, - | 6, - 1 - 2 - - - | 3 - 5 - 6 - 5 3 | 2 - - - . . . . | 3 - 2 - 1 - 6, - | 5, - 6, - 1 - 3 - | 2 - 3 - 2 - 7, - | 1 - - - . . . .",
   chords=[1, 4, 1, 5, 1, 4, 5, 1]),
 # ゴールの あと：はでで ハッピー（ファンファーレ風）
 "goal": dict(bpm=160, root=67, scale=MAJ, bars=8, lead=brass, lead2=glock, drums=D_march, comp="piano", bass="sq",
   mel="5 5 5 - 1' - 5 - | 6 6 6 - 5 - 3 - | 4 4 4 - 6 - 4 - | 3 - 5 - 1' - - - | 5 5 5 - 1' - 2' - | 3' - 2' - 1' - 6 - | 5 - 6 - 7 - 2' - | 1' - 5 - 1' - - -",
   chords=[1, 4, 4, 1, 1, 6, 5, 1]),
 # ちょうロング うみ：カリブ風（マリンバ・スチールドラムっぽい グロッケン）
 "sumi": dict(bpm=132, root=65, scale=MAJ, bars=8, lead=marimba, lead2=glock, drums=D_easy, comp="pluck", bass="sq", swing=.3, extra=X_birds,
   mel="1 - 3 5 6 5 3 - | 4 - 6 1' 7 6 5 - | 3 - 5 6 5 3 1 - | 2 3 4 2 5 - . . | 1 - 3 5 6 5 3 - | 4 - 6 1' 2' 1' 6 - | 5 3 4 2 7, 2 5, - | 1 - - - . . . .",
   chords=[1, 4, 1, 5, 1, 4, 5, 1]),
 # ちょうロング おかし：かわいく はずむ ワルツ
 "sokashi": dict(bpm=168, root=72, scale=MAJ, bars=8, lead=glock, lead2=marimba, drums=D_waltz, comp="pad", per_bar=6,
   mel="5 - 3 1 3 5 | 1' - - 7 6 5 | 6 - 4 2 4 6 | 5 - - . . . | 5 - 3 1 3 5 | 1' - 2' 1' 7 6 | 5 - 4 3 2 7, | 1 - - . . .",
   chords=[1, 1, 4, 5, 1, 1, 5, 1]),
 # ちょうロング うちゅう：わくわく マーチ（ブラス）
 "suchu": dict(bpm=150, root=67, scale=MAJ, bars=8, lead=brass, lead2=glock, drums=D_adv, comp="piano", bass="sq",
   mel="1 - 5, - 1 - 3 - | 5 - - - 3 - 1 - | 6 - 4 - 6 - 1' - | 7 - - - 5 - . . | 1' - 7 - 6 - 5 - | 4 - 6 - 5 - 3 - | 2 - 3 - 4 - 7, - | 1 - - - 5, - 1 -",
   chords=[1, 1, 4, 5, 4, 4, 5, 1]),
 # ともだちの だいぼうけん：みんなで わいわい。はずむ マリンバと グロッケン、てびょうし
 "ltomo": dict(bpm=140, root=67, scale=MAJ, bars=8, lead=marimba, lead2=glock, drums=D_shop, comp="pluck", bass="sq", swing=.25, extra=X_birds,
   mel="5 5 6 5 1' - 7 - | 6 6 5 3 5 - - - | 4 4 5 4 2 - 4 - | 3 2 1 2 3 - - - | 5 5 6 5 1' - 7 - | 6 6 5 3 1' - 6 - | 5 3 4 2 7, - 2 - | 1 - 3 - 1 - . .",
   chords=[1, 4, 5, 1, 1, 4, 5, 1]),
 # おうち1：ほっとする あかるい へや。ピアノと フルート
 "ouchi1": dict(bpm=116, root=65, scale=MAJ, bars=8, lead=flute, lead2=glock, drums=D_easy, comp="piano", swing=.2,
   mel="5 - 3 - 4 - 5 - | 6 - 5 - 3 - - - | 4 - 2 - 3 - 4 - | 5 - - - . . . . | 5 - 3 - 4 - 5 - | 1' - 7 - 6 - 5 - | 4 - 3 - 2 - 5, - | 1 - - - . . . .",
   chords=[1, 4, 5, 1, 1, 4, 5, 1]),
 # おともだち1：わいわい はずむ。マリンバと クラリネット
 "tomodachi1": dict(bpm=136, root=67, scale=MAJ, bars=8, lead=clar, lead2=marimba, drums=D_shop, comp="pluck", swing=.3, extra=X_birds,
   mel="1 1 3 - 5 5 3 - | 6 6 5 - 3 - - - | 4 4 2 - 5 5 3 - | 2 - 3 - 2 - . . | 1 1 3 - 5 5 3 - | 6 6 1' - 6 5 3 - | 4 - 3 - 2 - 7, - | 1 - - - . . . .",
   chords=[1, 4, 2, 5, 1, 4, 5, 1]),
 # せんせい1：きちんと たのしい じゅぎょう。リコーダーと グロッケン
 # ともだちの いえ：おじゃましまーす。ウクレレと グロッケン、ゆったり はずむ
 "ie1": dict(bpm=124, root=65, scale=MAJ, bars=8, lead=glock, lead2=flute, drums=D_easy, comp="pluck", swing=.3,
   mel="3 - 5 - 1' - 5 - | 6 - 5 - 3 - - - | 2 - 4 - 6 - 4 - | 5 - 3 - 2 - - - | 3 - 5 - 1' - 5 - | 6 - 1' - 2' - 7 - | 6 - 5 - 4 - 2 - | 1 - - - . . . .",
   chords=[1, 4, 2, 5, 1, 4, 5, 1]),
 # こうえん2：かけっこ！ はやくて げんき。マリンバと クラリネット
 "kouen2": dict(bpm=144, root=67, scale=MAJ, bars=8, lead=marimba, lead2=clar, drums=D_shop, comp="pluck", bass="sq", swing=.2, extra=X_birds,
   mel="1 3 5 3 1 3 5 - | 6 5 6 5 3 - - - | 4 6 1' 6 4 6 1' - | 7 5 7 5 2 - - - | 1 3 5 3 1 3 5 - | 6 5 6 1' 2' - 7 - | 6 - 4 - 5 - 7, - | 1 - 3 - 1 - . .",
   chords=[1, 4, 4, 5, 1, 4, 5, 1]),
 # となりの せき：きょうしつの こそこそ はなし。ピアノと リコーダー、かるく
 "seki1": dict(bpm=112, root=69, scale=MAJ, bars=8, lead=recorder, lead2=piano, drums=D_class, comp="piano", swing=.1, extra=X_bell,
   mel="5 - 5 - 6 - 5 - | 3 - - - 1 - - - | 4 - 4 - 5 - 4 - | 2 - - - 5, - - - | 5 - 5 - 6 - 5 - | 1' - - - 6 - - - | 5 - 4 - 3 - 2 - | 1 - - - . . . .",
   chords=[1, 1, 4, 5, 1, 4, 5, 1]),
 # とけい：チクタク きざむ。グロッケンと マリンバ、ピチカート
 "tokei": dict(bpm=120, root=67, scale=MAJ, bars=8, lead=glock, lead2=marimba, drums=D_class, comp="pluck", swing=0, extra=X_bell,
   mel="1 - 3 - 5 - 3 - | 1 - 3 - 5 - - - | 2 - 4 - 6 - 4 - | 2 - 4 - 5 - - - | 1 - 3 - 5 - 3 - | 6 - 5 - 3 - 1 - | 4 - 3 - 2 - 7, - | 1 - - - . . . .",
   chords=[1, 1, 4, 5, 1, 4, 5, 1]),
 # あそびば：ぴょんぴょん はずむ。マリンバと グロッケン
 "asobiba": dict(bpm=132, root=69, scale=MAJ, bars=8, lead=marimba, lead2=glock, drums=D_shop, comp="pluck", swing=.3,
   mel="1 3 5 - 3 5 1' - | 6 - 5 - 3 - - - | 2 4 6 - 4 6 2' - | 7 - 5 - 2 - - - | 1 3 5 - 3 5 1' - | 6 5 6 1' 2' - 7 - | 6 - 4 - 5 - 7, - | 1 - - - . . . .",
   chords=[1, 4, 2, 5, 1, 4, 5, 1]),
 # ハンバーガーやさん：おみせの ゆかいな BGM。クラリネットと ピアノ
 "burger": dict(bpm=124, root=65, scale=MAJ, bars=8, lead=clar, lead2=piano, drums=D_shop, comp="piano", swing=.35,
   mel="5 - 5 6 5 3 1 - | 2 - 3 - 2 - - - | 4 - 4 5 4 2 7, - | 1 - 2 - 1 - - - | 5 - 5 6 5 3 1 - | 6 - 1' - 6 - 5 - | 4 - 3 - 2 - 5, - | 1 - - - . . . .",
   chords=[1, 5, 4, 1, 1, 4, 5, 1]),
 "sensei1": dict(bpm=120, root=70, scale=MAJ, bars=8, lead=recorder, lead2=glock, drums=D_class, comp="piano", extra=X_bell,
   mel="3 - 3 - 4 - 5 - | 5 - 4 - 3 - 2 - | 1 - 1 - 2 - 3 - | 3 - - 2 2 - - - | 3 - 3 - 4 - 5 - | 5 - 4 - 3 - 2 - | 1 - 1 - 2 - 3 - | 2 - - 1 1 - - -",
   chords=[1, 5, 1, 5, 1, 5, 1, 5]),
}

if __name__ == "__main__":
    import sys
    only = sys.argv[1:]; LEN = {}
    out = G / "stage_audio"; out.mkdir(exist_ok=True); data = G / "board/bgm_data.js"
    if data.exists():
        import re; LEN.update(json.loads(re.search(r"=\s*(\{.*\})", data.read_text()).group(1)))
    for name, kw in SONGS.items():
        if only and name not in only: continue
        x, L = song(name, **kw); x = norm(x)
        tmp = out / f"bgm_{name}.wav"
        with wave.open(str(tmp), "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(tmp), "-ar", str(SR), "-ac", "1", "-b:a", "64k", str(out / f"bgm_{name}.mp3")], check=True); tmp.unlink()
        LEN[name] = round(L, 5); print(name, round(L, 2), "s")
    data.write_text("/* ステージごとの BGM の ループの ながさ（びょう）。make_bgm.py が かく */\nconst BGM_LEN = " + json.dumps(LEN) + ";\n")
