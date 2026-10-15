# 四〜十：アラビア数字とむすびつける。「数がかぞえられるもの」＋「大きな数字のゼッケン」
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
sys_argv = sys.argv[:]; sys.argv = [sys.argv[0]]
import parts, six_gen as G, na_hon3 as N
sys.argv = sys_argv
OUT = sys.argv[1] if len(sys.argv) > 1 else None
OL = parts.OL
SKIN = G.SKIN; RED = G.RED
limb, hand, foot, head, face, overlay = G.limb, G.hand, G.foot, G.head, G.face, G.overlay
txt = N.txt

def bib(x, y, n, w=34, h=30, col='#fff', tcol='#e04a4a', size=24):
    return (f'<rect x="{x-w/2}" y="{y-h/2}" width="{w}" height="{h}" rx="6" fill="{col}" {OL} stroke-width="3.5"/>'
            + txt(x, y + size*0.36, n, size, tcol))

def tiny(x, y, n, col='#3b6fd9'):
    return f'<circle cx="{x}" cy="{y}" r="7" fill="#fff" stroke="{col}" stroke-width="2"/>' + txt(x, y + 3.5, n, 9, col)

def open_hand(cx, cy, s=1.0, rot=0, nums=None, col=SKIN):
    """パーの手。指5本。nums=開始番号なら指先に番号"""
    g = f'<g transform="translate({cx},{cy}) rotate({rot}) scale({s})">'
    angs = [-150, -112, -90, -68, -46]  # 親指〜小指
    lens = [20, 30, 33, 30, 24]
    for a, L in zip(angs, lens):
        x = L * math.cos(math.radians(a)); y = L * math.sin(math.radians(a))
        g += f'<path d="M0,0 L{x:.1f},{y:.1f}" {OL} stroke-width="13" stroke-linecap="round"/><path d="M0,0 L{x:.1f},{y:.1f}" stroke="{col}" stroke-width="8" stroke-linecap="round"/>'
    g += f'<ellipse cx="0" cy="2" rx="16" ry="14" fill="{col}" {OL} stroke-width="3.5"/>'
    g += '</g>'
    if nums is not None:
        for i, (a, L) in enumerate(zip(angs, lens)):
            r = math.radians(a + rot)
            g += tiny(cx + (L * s + 13) * math.cos(r), cy + (L * s + 13) * math.sin(r), str(nums + i))
    return g

# ---- 四：うしのよんちゃん（4本あし）。口＝四角い体、ノ乚＝体の下の足 ----
def yon():
    s = ''
    for x in (40, 62, 98, 120):
        s += f'<rect x="{x-6}" y="100" width="12" height="30" rx="4" fill="#fff" {OL} stroke-width="3.5"/><rect x="{x-7}" y="126" width="14" height="8" rx="3" fill="#2a2a3a"/>'
    s += f'<rect x="28" y="54" width="104" height="54" rx="12" fill="#fff" {OL} stroke-width="5"/>'
    s += f'<path d="M40,62 Q52,58 54,70 Q48,80 40,74 Z M104,88 Q118,84 120,96 Q110,104 102,98 Z" fill="#2a2a3a"/>'
    s += bib(80, 80, '4', 34, 30)
    s += f'<path d="M132,62 Q146,58 144,78" fill="none" {OL} stroke-width="4" stroke-linecap="round"/><circle cx="144" cy="80" r="4" fill="#2a2a3a"/>'
    # 頭（左）
    s += f'<path d="M14,40 Q10,30 18,28 M42,40 Q46,30 38,28" fill="none" stroke="#e6c94f" stroke-width="5" stroke-linecap="round"/>'
    s += f'<ellipse cx="28" cy="54" rx="20" ry="18" fill="#fff" {OL} stroke-width="4.5"/><ellipse cx="28" cy="66" rx="14" ry="8" fill="#ffb3c6" {OL} stroke-width="3"/><circle cx="24" cy="66" r="2" fill="#2a2a3a"/><circle cx="32" cy="66" r="2" fill="#2a2a3a"/>'
    s += parts.eyes_dot(21, 35, 48)
    for i, x in enumerate((40, 62, 98, 120)):
        s += tiny(x, 146, str(i + 1))
    return s

# ---- 五：てのひらくん（指5本）。上の一＝指先のならび、コ＝てのひら、下の一＝そで ----
def go():
    s = f'<rect x="54" y="118" width="52" height="24" rx="6" fill="#5fa8e0" {OL} stroke-width="4"/>' + txt(80, 136, '5', 18, '#fff')
    s += open_hand(80, 96, 1.7, 0, nums=1)
    s += face(80, 98, .75, 'big')
    return s

# ---- 六：ありんこ（6本あし）。丶＝頭、一＝しょっかく、ノ丶＝あし ----
def roku():
    s = ''
    for (x0, y0, x1, y1) in ((70, 96, 36, 84), (70, 104, 30, 108), (72, 110, 40, 134), (90, 96, 124, 84), (90, 104, 130, 108), (88, 110, 120, 134)):
        s += f'<path d="M{x0},{y0} Q{(x0+x1)/2},{min(y0,y1)-6} {x1},{y1}" fill="none" {OL} stroke-width="5" stroke-linecap="round"/>'
    for i, (x, y) in enumerate(((30, 80), (22, 108), (34, 142), (130, 80), (138, 108), (126, 142))):
        s += tiny(x, y, str(i + 1))
    s += f'<ellipse cx="80" cy="120" rx="22" ry="18" fill="#6b4a2b" {OL} stroke-width="4"/>' + txt(80, 128, '6', 20, '#fff')
    s += f'<ellipse cx="80" cy="98" rx="12" ry="10" fill="#6b4a2b" {OL} stroke-width="4"/>'
    s += f'<path d="M70,56 Q60,34 46,30 M90,56 Q100,34 114,30" fill="none" {OL} stroke-width="4" stroke-linecap="round"/><circle cx="46" cy="30" r="4" fill="#2a2a3a"/><circle cx="114" cy="30" r="4" fill="#2a2a3a"/>'
    s += f'<circle cx="80" cy="68" r="20" fill="#8a5a3a" {OL} stroke-width="4.5"/>' + face(80, 70, .6, 'awake')
    return s

# ---- 七：ななほしてんとう（ほし7つ）。一＝葉っぱ、乚＝てんとうがのぼるくき ----
def nana():
    s = f'<path d="M50,24 L50,110 Q52,128 80,128 L132,130" fill="none" {OL} stroke-width="12" stroke-linecap="round"/><path d="M50,24 L50,110 Q52,128 80,128 L132,130" fill="none" stroke="#5a9e3a" stroke-width="6" stroke-linecap="round"/>'
    s += f'<path d="M50,60 Q30,46 18,56 Q30,70 50,64 Z" fill="#6ec46a" {OL} stroke-width="3.5" stroke-linejoin="round"/>'
    # てんとうむし
    cx, cy = 98, 86
    s += f'<circle cx="{cx}" cy="{cy-44}" r="16" fill="#2a2a3a" {OL} stroke-width="3.5"/><circle cx="{cx-6}" cy="{cy-48}" r="5" fill="#fff"/><circle cx="{cx+6}" cy="{cy-48}" r="5" fill="#fff"/><circle cx="{cx-5}" cy="{cy-47}" r="2.5" fill="#2a2a3a"/><circle cx="{cx+7}" cy="{cy-47}" r="2.5" fill="#2a2a3a"/><path d="M{cx-5},{cy-38} Q{cx},{cy-34} {cx+5},{cy-38}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>'
    s += f'<path d="M{cx-44},{cy} A44,40 0 0 1 {cx+44},{cy} L{cx+44},{cy+4} Q{cx},{cy+44} {cx-44},{cy+4} Z" fill="#e04a4a" {OL} stroke-width="5" stroke-linejoin="round"/>'
    s += f'<ellipse cx="{cx}" cy="{cy+2}" rx="44" ry="40" fill="#e04a4a" {OL} stroke-width="5"/><path d="M{cx},{cy-38} L{cx},{cy+42}" {OL} stroke-width="4"/>'
    spots = [(cx-24, cy-14), (cx+24, cy-14), (cx-30, cy+12), (cx+30, cy+12), (cx-16, cy+30), (cx+16, cy+30), (cx, cy-4)]
    for i, (x, y) in enumerate(spots):
        s += f'<circle cx="{x}" cy="{y}" r="9" fill="#2a2a3a"/>' + txt(x, y + 4, str(i + 1), 10, '#fff')
    s += bib(28, 112, '7', 30, 28)
    return s

# ---- 八：たこのはっちゃん（あし8本）。ノ乀＝いちばん大きくひろげた2本 ----
def hachi():
    s = ''
    legs = [(-60, 46), (-36, 40), (-14, 36), (8, 36), (28, 38), (50, 44)]
    for ang, L in legs:
        a = math.radians(90 + ang)
        x1 = 80 + L * math.cos(a) * 1.0; y1 = 96 + L * math.sin(a)
        s += f'<path d="M80,96 Q{80 + L*0.5*math.cos(a)},{106} {x1:.1f},{y1+8:.1f}" fill="none" {OL} stroke-width="11" stroke-linecap="round"/><path d="M80,96 Q{80 + L*0.5*math.cos(a)},{106} {x1:.1f},{y1+8:.1f}" fill="none" stroke="#ff7a59" stroke-width="6" stroke-linecap="round"/>'
    s += f'<path d="M70,90 Q50,104 22,132" fill="none" {OL} stroke-width="15" stroke-linecap="round"/><path d="M70,90 Q50,104 22,132" fill="none" stroke="#ff7a59" stroke-width="9" stroke-linecap="round"/>'
    s += f'<path d="M90,88 Q112,106 138,130" fill="none" {OL} stroke-width="15" stroke-linecap="round"/><path d="M90,88 Q112,106 138,130" fill="none" stroke="#ff7a59" stroke-width="9" stroke-linecap="round"/>'
    s += f'<path d="M36,82 Q34,22 80,20 Q126,22 124,82 Q80,96 36,82 Z" fill="#ff7a59" {OL} stroke-width="5" stroke-linejoin="round"/>'
    s += f'<path d="M44,40 L116,36" {OL} stroke-width="10" stroke-linecap="round"/><path d="M44,40 L116,36" stroke="#fff" stroke-width="5" stroke-linecap="round"/>'
    s += bib(80, 38, '8', 28, 26, size=20)
    s += parts.eyes_awake(66, 94, 64) + f'<ellipse cx="80" cy="80" rx="6" ry="5" fill="#ff5c3a" {OL} stroke-width="3"/>'
    pts = [(14, 140), (30, 148), (50, 150), (68, 150), (92, 150), (110, 150), (130, 148), (146, 140)]
    for i, (x, y) in enumerate(pts):
        s += tiny(x, y - 6, str(i + 1))
    return s

# ---- 九：おたまじゃくし（「9」の形）。ノ＝しっぽのさき、㇈＝あたまからしっぽ ----
def kyu():
    s = f'<path d="M104,62 Q112,108 92,128 Q76,142 60,134" fill="none" {OL} stroke-width="16" stroke-linecap="round"/><path d="M104,62 Q112,108 92,128 Q76,142 60,134" fill="none" stroke="#3f6b5a" stroke-width="10" stroke-linecap="round"/>'
    s += f'<circle cx="80" cy="56" r="34" fill="#3f6b5a" {OL} stroke-width="5"/>'
    s += f'<circle cx="68" cy="50" r="9" fill="#fff" {OL} stroke-width="3"/><circle cx="92" cy="50" r="9" fill="#fff" {OL} stroke-width="3"/><circle cx="69" cy="52" r="4.5" fill="#2a2a3a"/><circle cx="93" cy="52" r="4.5" fill="#2a2a3a"/>'
    s += f'<path d="M72,70 Q80,76 88,70" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>'
    s += txt(128, 40, '9', 34, '#3f6b5a') + txt(128, 58, 'みたい！', 9, '#3f6b5a')
    s += f'<g fill="#bfe6ff" {OL} stroke-width="2"><circle cx="30" cy="40" r="5"/><circle cx="24" cy="60" r="4"/><circle cx="34" cy="76" r="3"/></g>'
    return s

# ---- 十：りょうてをひろげた子（指10本）。一＝ひろげた両うで、丨＝からだ ----
def ju():
    s = limb('M74,112 L66,140', SKIN, 14) + limb('M86,112 L94,140', SKIN, 14) + foot(62, 143, rx=9) + foot(98, 143, rx=9)
    s += f'<rect x="64" y="70" width="32" height="46" rx="10" fill="#ffd23f" {OL} stroke-width="4.5"/>' + txt(80, 100, '10', 15, '#e04a4a')
    s += limb('M40,76 L120,76', SKIN, 13)
    s += open_hand(30, 76, .85, -90, nums=1) + open_hand(130, 76, .85, 90, nums=6)
    s += head(80, 44, 22) + f'<path d="M60,36 Q80,16 100,36 L96,28 Q80,14 64,28 Z" fill="#6b4a2b" {OL} stroke-width="3" stroke-linejoin="round"/>' + face(80, 46, .7, 'big')
    return s

CASES = [
 ('四', '4', 'よん', 'うしのよんちゃん', 'あしが4本。口＝四角い体、ノ乚＝体の下の足。おなかに「4」', yon()),
 ('五', '5', 'ご', 'てのひらくん', '指が5本。パーの手に1〜5の番号。そでに「5」', go()),
 ('六', '6', 'ろく', 'ありんこ', 'あしが6本。丶＝頭、一＝しょっかく、ノ丶＝あし。おしりに「6」', roku()),
 ('七', '7', 'なな', 'ななほしてんとう', 'せなかのほしが7つ。一＝葉っぱ、乚＝くき', nana()),
 ('八', '8', 'はち', 'たこのはっちゃん', 'あしが8本。ノ乀＝いちばん大きくひろげた2本。はちまきに「8」', hachi()),
 ('九', '9', 'きゅう', 'おたまじゃくし', 'からだが「9」の形。㇈＝頭からしっぽ', kyu()),
 ('十', '10', 'じゅう', 'りょうてをひろげた子', '指が5本＋5本で10本。一＝ひろげた両うで、丨＝からだ。五（片手）とつながる', ju()),
]

svg = lambda inner, size: f'<svg viewBox="0 0 160 160" width="{size}" height="{size}">{inner}</svg>'
cells = ''.join(f'''
    <div style="display:flex;align-items:center;gap:6px;background:#fff;border-radius:16px;padding:4px 8px;min-height:0">
      {svg(b, 128)}
      {svg(b + overlay(k), 56)}
      <div style="display:flex;flex-direction:column;gap:2px;min-width:0;flex:1">
        <div style="display:flex;align-items:baseline;gap:6px"><div style="font-size:26px;font-weight:900;line-height:1">{k}</div><div style="font-size:22px;font-weight:900;color:#e04a4a;line-height:1">{d}</div><div style="font-size:11px;font-weight:900">{yomi}</div></div>
        <div style="font-size:12.5px;font-weight:900;line-height:1.2">{t}</div>
        <div style="font-size:10px;color:#6b5f4a;line-height:1.35">{desc}</div>
      </div>
    </div>''' for k, d, yomi, t, desc, b in CASES)
html = f'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>A-39 数字の字（四〜十）やりなおし</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700;900&display=swap">
<style>
body{{margin:0}}
a{{color:#2a2a3a}}a:hover{{color:#000}}
</style>
</helmet>
<div style="width: 880px; height: 560px; box-sizing: border-box; padding: 18px 24px; background: #f0ffe8; font-family: 'Zen Maru Gothic', sans-serif; color: #2a2a3a; display: flex; flex-direction: column; gap: 6px">
  <div style="display: flex; align-items: baseline; gap: 14px">
    <div style="font-size: 26px; font-weight: 900; background: #5fb860; color: #fff; padding: 2px 14px; border-radius: 12px; white-space:nowrap">A-39</div>
    <h1 style="margin: 0; font-size: 21px; font-weight: 900; white-space:nowrap">数字の字（四〜十）— アラビア数字とむすぶ</h1>
    <div style="font-size: 11.5px; font-weight: 500; color: #6b5f4a">その数だけ「かぞえられるもの」を持つキャラ＋大きな数字。青い丸は数える番号</div>
  </div>
  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 1fr; gap: 6px; flex: 1 1 auto; min-height: 0">{cells}
    <div style="display:flex;flex-direction:column;justify-content:center;gap:6px;background:#fff6d6;border-radius:16px;padding:8px 14px;min-height:0;font-size:11px;color:#6b5f4a;line-height:1.5">
      <div style="font-size:13px;font-weight:900;color:#2a2a3a">アプリでの見せ方</div>
      <div>・なぞる前に「1、2、3…」と青い番号を順にピカッと光らせて音声で数える</div>
      <div>・数え終わると大きなアラビア数字がポンと出て、その数字が漢字に変身</div>
      <div>・五（片手）と十（両手）はセットで出すと「5＋5＝10」がわかる</div>
    </div>
  </div>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":880,"height":560}}}}'>
class Component extends DCLogic {{
renderVals() {{ return {{}}; }}
}}
</script>
</body>
</html>
'''
if OUT:
    open(os.path.join(OUT, 'A39_Numbers.dc.html'), 'w', encoding='utf-8').write(html)
    print('ok')
