import numpy as np, wave
SR = 44100
rng = np.random.default_rng(3)
def modal(modes, dur, amp=1.0):
    t = np.arange(int(SR*dur))/SR; y = np.zeros_like(t)
    for f, a, d in modes: y += a*np.sin(2*np.pi*f*t + rng.random()*6)*np.exp(-t/d)
    n = rng.standard_normal(len(t))*np.exp(-t/0.004)*0.5  # 当たりの瞬間のこすれ
    return amp*(y+n)
def click(amp=1.0, pitch=1.0):
    p = pitch*(0.93+0.14*rng.random())
    return modal([(1250*p,1,.030),(2750*p,.6,.018),(4300*p,.35,.010),(650*p,.4,.040)], .12, amp)
def place(buf, snd, at):
    i = int(at*SR); buf[i:i+len(snd)] += snd[:max(0, len(buf)-i)]
def save(name, y, gain=0.9):
    y = y/np.max(np.abs(y))*gain
    with wave.open(f"board/sfx/{name}.wav","wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y*32767).astype(np.int16).tobytes())
# カラカラ：アニメの12コマに合わせ、1コマに2〜3回ぶつかる
times=[]; t=0.0
for i in range(12):
    step=(45+i*13)/1000
    for k in range(2 if i<8 else 1): times.append(t + k*step*0.45 + rng.random()*0.01)
    t += step
y = np.zeros(int(SR*(t+0.2)))
for j, at in enumerate(times): place(y, click(0.55+0.45*rng.random(), 1.0 + (0.15 if j%3==0 else 0)), at)
save("rattle", y, 0.85)
# コトン：軽い「コト」＋重い「ン」
y = np.zeros(int(SR*0.55))
place(y, click(0.6, 1.1), 0.0)
place(y, click(0.7, 1.0), 0.06)
place(y, modal([(520,1,.11),(1180,.7,.07),(2100,.45,.04),(3300,.25,.02),(260,.6,.12)], .45, 1.6), 0.13)
save("thunk", y, 0.95)
