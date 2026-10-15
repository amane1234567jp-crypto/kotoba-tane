# 「花」キャラ案：艹＝草の冠、化＝片手を下ろし片手を上げてポーズをとる人型。字の骨格（KanjiVG）の上に体を置く
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import parts, kvgpath
from xml.dom import minidom
OUT = sys.argv[1]
OL = parts.OL
S = 144/109; O = 8
doc = minidom.parse(os.path.join(os.path.dirname(__file__), '..', 'kvg', '082b1.svg'))
PATHS = [p.getAttribute('d') for p in doc.getElementsByTagName('path')]

def kanji_overlay(op=.35, col='#2a2a3a'):
    d = ' '.join(PATHS)
    return f'<g transform="translate({O},{O}) scale({S:.4f})" fill="none" stroke="{col}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity="{op}"><path d="{d}"/></g>'

def limb(d, col, w=16):
    return f'<path d="{d}" fill="none" {OL} stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/><path d="{d}" fill="none" stroke="{col}" stroke-width="{w-7}" stroke-linecap="round" stroke-linejoin="round"/>'

def hand(x, y, col='#ffcf9e', r=9):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{col}" {OL} stroke-width="4"/>'

def foot(x, y, col, rx=13, ry=6):
    return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{col}" {OL} stroke-width="4"/>'

def crown(flowers=False):
    # 艹：横棒(30,47)-(127,42) と2本の葉(51,29)-(61,60),(102,25)-(93,58)
    s = limb('M30,47 L127,43', '#5fb860', 14)
    s += limb('M52,28 L60,56', '#5fb860', 13) + limb('M102,26 L94,56', '#5fb860', 13)
    s += f'<path d="M52,28 Q42,16 36,22 Q44,30 52,28 Z M102,26 Q112,14 118,20 Q110,28 102,26 Z" fill="#6ec46a" {OL} stroke-width="3.5" stroke-linejoin="round"/>'
    if flowers:
        for cx, cy in ((44, 24), (112, 22)):
            s += f'<g fill="#ff8ab0" {OL} stroke-width="2.5"><circle cx="{cx}" cy="{cy-7}" r="5"/><circle cx="{cx+7}" cy="{cy}" r="5"/><circle cx="{cx}" cy="{cy+7}" r="5"/><circle cx="{cx-7}" cy="{cy}" r="5"/></g><circle cx="{cx}" cy="{cy}" r="4" fill="#ffd23f" {OL} stroke-width="2"/>'
    return s

def petals(cx, cy, r=22, n=8, col='#ff8ab0'):
    import math
    s = ''
    for i in range(n):
        a = i*2*math.pi/n
        s += f'<ellipse cx="{cx+r*math.cos(a):.1f}" cy="{cy+r*math.sin(a):.1f}" rx="11" ry="8" transform="rotate({a*180/math.pi:.1f} {cx+r*math.cos(a):.1f} {cy+r*math.sin(a):.1f})" fill="{col}" {OL} stroke-width="3.5"/>'
    return s

def face(cx, cy, s=.9, kind='smile'):
    if kind == 'smile': f = parts.eyes_smile(-11, 11, 0) + parts.mouth_cat(0, 8)
    else: f = parts.eyes_awake(-11, 11, 0) + parts.mouth_smile(0, 12)
    return f'<g transform="translate({cx},{cy}) scale({s})">{f}{parts.cheeks(-20, 20, 7)}</g>'

def tulip(x, y, col='#ff6b8a'):
    return (f'<path d="M{x},{y+2} L{x},{y+24}" {OL} stroke-width="6" stroke-linecap="round"/><path d="M{x},{y+2} L{x},{y+24}" stroke="#5a9e3a" stroke-width="3" stroke-linecap="round"/>'
            f'<path d="M{x-10},{y+4} L{x-10},{y-10} L{x-4},{y-4} L{x},{y-12} L{x+4},{y-4} L{x+10},{y-10} L{x+10},{y+4} Q{x},{y+12} {x-10},{y+4} Z" fill="{col}" {OL} stroke-width="3.5" stroke-linejoin="round"/>')

# 化の骨格：左腕 ノ(59,72)->(34,106)／左脚 丨(49,95)->(50,137)／右腕 ノ(119,74)->(92,92)／胴＋右脚 乚(85,66)->(87,113)->(134,118)
L_ARM = 'M60,74 Q50,88 36,104'
L_LEG = 'M50,96 L50,136'
R_ARM = 'M92,90 Q106,84 118,74'
R_LEG = 'M86,98 L87,112 Q90,118 100,118 L132,118'

def body_A():
    """A：顔が花。黄色い顔のまわりに花びら、ピンクのワンピース"""
    s = ''
    s += limb(L_LEG, '#5a9e3a') + limb(R_LEG, '#5a9e3a') + foot(50, 140, '#6ec46a') + foot(134, 118, '#6ec46a', 12, 7)
    s += f'<path d="M58,66 L94,66 L98,102 L52,102 Z" fill="#ff8ab0" {OL} stroke-width="5" stroke-linejoin="round"/><path d="M58,66 L52,102 L76,102 L76,66 Z" fill="#000" opacity=".08"/>'
    s += limb(L_ARM, '#ffcf9e') + hand(35, 106) + limb(R_ARM, '#ffcf9e') + hand(119, 73)
    s += crown()
    s += petals(78, 60, 20, 8) + f'<circle cx="78" cy="60" r="16" fill="#ffd23f" {OL} stroke-width="4"/>' + face(78, 61, .75)
    return s

def body_B():
    """B：顔はふつう。草の冠に花が咲き、上げた手にチューリップ"""
    s = ''
    s += limb(L_LEG, '#ffcf9e') + limb(R_LEG, '#ffcf9e') + foot(50, 140, '#e04a4a') + foot(134, 118, '#e04a4a', 12, 7)
    s += f'<rect x="56" y="66" width="40" height="38" rx="10" fill="#ff8ab0" {OL} stroke-width="5"/><path d="M56,76 L56,94 Q56,104 66,104 L76,104 L76,66 L66,66 Q56,66 56,76 Z" fill="#000" opacity=".08"/>'
    s += limb(L_ARM, '#ffcf9e') + hand(35, 106) + limb(R_ARM, '#ffcf9e') + hand(119, 73) + tulip(122, 56)
    s += crown(flowers=True)
    s += f'<circle cx="78" cy="60" r="16" fill="#ffcf9e" {OL} stroke-width="4"/>' + face(78, 62, .7, 'awake')
    return s

def body_C():
    """C：全身が花。頭＝花、体＝茎（緑）、手＝葉っぱ、乚の裾＝花びらスカート"""
    s = ''
    s += limb(L_LEG, '#5a9e3a') + limb(R_LEG, '#5a9e3a')
    s += f'<path d="M44,136 Q50,148 56,136 Z" fill="#6ec46a" {OL} stroke-width="3"/><path d="M130,110 Q146,118 130,126 Z" fill="#6ec46a" {OL} stroke-width="3"/>'
    # 花びらスカート
    s += ''.join(f'<ellipse cx="{x}" cy="100" rx="10" ry="9" fill="#ffb3d0" {OL} stroke-width="3.5"/>' for x in (54, 68, 82, 96))
    s += f'<rect x="58" y="64" width="38" height="36" rx="9" fill="#5a9e3a" {OL} stroke-width="5"/>'
    # 葉っぱの手
    s += limb(L_ARM, '#5a9e3a', 16) + f'<path d="M36,104 Q20,96 24,112 Q34,118 36,104 Z" fill="#6ec46a" {OL} stroke-width="3.5" stroke-linejoin="round"/>'
    s += limb(R_ARM, '#5a9e3a', 16) + f'<path d="M118,74 Q134,60 136,76 Q126,84 118,74 Z" fill="#6ec46a" {OL} stroke-width="3.5" stroke-linejoin="round"/>'
    s += crown()
    s += petals(78, 60, 20, 8, '#ff6b8a') + f'<circle cx="78" cy="60" r="16" fill="#ffd23f" {OL} stroke-width="4"/>' + face(78, 61, .75)
    return s

def body_D():
    """D：ひとっち（人キャラ）そのまま。草の冠と、花がらの服。ポーズだけ化の形"""
    s = ''
    s += limb(L_LEG, '#ffcf9e') + limb(R_LEG, '#ffcf9e') + foot(50, 140, '#8b5a2b') + foot(134, 118, '#8b5a2b', 12, 7)
    s += f'<rect x="56" y="64" width="40" height="40" rx="10" fill="#fff" {OL} stroke-width="5"/>'
    s += ''.join(f'<g fill="#ff8ab0"><circle cx="{x}" cy="{y-4}" r="3"/><circle cx="{x+4}" cy="{y}" r="3"/><circle cx="{x}" cy="{y+4}" r="3"/><circle cx="{x-4}" cy="{y}" r="3"/></g><circle cx="{x}" cy="{y}" r="2" fill="#ffd23f"/>' for x, y in ((66, 76), (86, 76), (76, 92)))
    s += limb(L_ARM, '#ffcf9e') + hand(35, 106) + limb(R_ARM, '#ffcf9e') + hand(119, 73)
    s += crown(flowers=True)
    s += f'<circle cx="78" cy="60" r="16" fill="#ffcf9e" {OL} stroke-width="4"/><path d="M64,54 Q78,42 92,54 L90,48 Q78,38 66,48 Z" fill="#6b4a2b" {OL} stroke-width="3" stroke-linejoin="round"/>' + face(78, 62, .7, 'awake')
    return s

CASES = [
 ('A', '顔が花', '黄色い顔に花びら。体はピンクのワンピース、脚は茎の緑', body_A()),
 ('B', '顔はふつう＋花かんむり', '草の冠に花が咲き、上げた手にチューリップ。ひとっちの仲間に見える', body_B()),
 ('C', '全身が花', '頭＝花、体＝茎、手＝葉っぱ、乚の裾は花びらスカート', body_C()),
 ('D', 'ひとっちの花コスプレ', '顔・手足はひとっち。草の冠と花がらの服で「花」', body_D()),
]

def svg(inner, size): return f'<svg viewBox="0 0 160 160" width="{size}" height="{size}">{inner}</svg>'

cells = ''
for lab, title, desc, body in CASES:
    cells += f'''
    <div style="display:flex;align-items:center;gap:10px;background:#fff;border-radius:20px;padding:6px 14px;min-height:0">
      {svg(body, 150)}
      {svg(body + kanji_overlay(.45, '#3b6fd9'), 110)}
      <div style="display:flex;flex-direction:column;gap:4px;min-width:120px;flex:1">
        <div style="font-size:22px;font-weight:900;line-height:1.1"><span style="background:#3b6fd9;color:#fff;border-radius:8px;padding:0 8px;margin-right:6px">{lab}</span>{title}</div>
        <div style="font-size:12px;color:#6b5f4a;line-height:1.4">{desc}</div>
        <div style="font-size:10.5px;color:#9a8f7a">右は「花」の筆画（青）を重ねたもの</div>
      </div>
    </div>'''

html = f'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>A-20 花キャラ案</title>
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
<div style="width: 880px; height: 560px; box-sizing: border-box; padding: 22px 32px; background: #ffeef5; font-family: 'Zen Maru Gothic', sans-serif; color: #2a2a3a; display: flex; flex-direction: column; gap: 8px">
  <div style="display: flex; align-items: baseline; gap: 14px">
    <div style="font-size: 26px; font-weight: 900; background: #ff5c9a; color: #fff; padding: 2px 14px; border-radius: 12px">A-20</div>
    <h1 style="margin: 0; font-size: 22px; font-weight: 900; white-space:nowrap">「花」キャラ案</h1>
    <div style="font-size: 12.5px; font-weight: 500; color: #6b5f4a">艹＝冠、化＝左手を下ろし右手を上げた人型。筆画の位置に手足を置く</div>
  </div>
  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 1fr; gap: 10px; flex: 1 1 auto; min-height: 0">{cells}
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
open(os.path.join(OUT, 'A20_Hana.dc.html'), 'w', encoding='utf-8').write(html)
print('ok')
