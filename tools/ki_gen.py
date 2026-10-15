# 「気」キャラ案：げんきっ子「げんきち」。はちまき（一一、ノ＝結び目のしっぽ）、左手をのばし右足をけり上げる（㇈）、たすき（丶）、左足（ノ）
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
import parts
from xml.dom import minidom
OUT = sys.argv[1]
OL = parts.OL
S = 144/109; O = 8
SKIN = '#ffcf9e'; RED = '#e04a4a'; SHIRT = '#fff'; NAVY = '#3b6fd9'
doc = minidom.parse(os.path.join(os.path.dirname(__file__), '..', 'kvg', '06c17.svg'))
PATHS = [p.getAttribute('d') for p in doc.getElementsByTagName('path')]

def overlay(op=.45, col='#3b6fd9'):
    d = ' '.join(PATHS)
    return f'<g transform="translate({O},{O}) scale({S:.4f})" fill="none" stroke="{col}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity="{op}"><path d="{d}"/></g>'

def limb(d, col, w=17):
    return f'<path d="{d}" fill="none" {OL} stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/><path d="{d}" fill="none" stroke="{col}" stroke-width="{w-7}" stroke-linecap="round" stroke-linejoin="round"/>'

def aura(n=10, r0=70, r1=84, cx=80, cy=78, col='#ffcc33'):
    s = ''
    for i in range(n):
        a = i*2*math.pi/n + 0.3
        s += f'<line x1="{cx+r0*math.cos(a):.1f}" y1="{cy+r0*math.sin(a):.1f}" x2="{cx+r1*math.cos(a):.1f}" y2="{cy+r1*math.sin(a):.1f}" stroke="{col}" stroke-width="6" stroke-linecap="round"/>'
    return s

def genkichi(face='awake', aura_on=False, puff=False, sweat=False):
    s = ''
    if aura_on: s += aura()
    # 右足：㇈の縦〜はね。体の右側から下りて足先が右へ
    s += limb('M108,98 L112,122 Q114,130 124,130 L134,128', SKIN) + f'<ellipse cx="136" cy="130" rx="11" ry="6" fill="{RED}" {OL} stroke-width="3.5"/>'
    # 左足：ノ。体から左下へけり出す
    s += limb('M70,108 Q58,120 44,130', SKIN) + f'<ellipse cx="41" cy="133" rx="11" ry="6" fill="{RED}" {OL} stroke-width="3.5"/>'
    # 体：まるい（上の縁＝㇈の横棒）
    s += f'<path d="M46,70 Q44,124 80,126 Q116,124 114,66 Q80,60 46,70 Z" fill="{SHIRT}" {OL} stroke-width="5" stroke-linejoin="round"/><path d="M46,70 Q44,124 80,126 L80,64 Q62,64 46,70 Z" fill="#000" opacity=".06"/>'
    # たすき：丶（左上→右下）
    s += f'<path d="M50,84 L96,126" {OL} stroke-width="14" stroke-linecap="round"/><path d="M50,84 L96,126" stroke="{RED}" stroke-width="8" stroke-linecap="round"/>'
    # 左手：㇈の横棒を左へのばした腕。右手は腰
    s += limb('M50,74 L30,70', SKIN) + f'<circle cx="28" cy="70" r="8" fill="{SKIN}" {OL} stroke-width="3.5"/>'
    s += limb('M110,78 Q124,88 112,100', SKIN, 15)
    # 頭（でっかい）
    s += f'<circle cx="78" cy="42" r="30" fill="{SKIN}" {OL} stroke-width="5"/><path d="M48,42 A30,30 0 0 0 78,72 L78,12 A30,30 0 0 0 48,42 Z" fill="#000" opacity=".06"/>'
    # はちまき：一（y36）と一（y48）の二重まき、ノ＝結び目のしっぽ（左上）
    s += f'<path d="M50,32 L106,27" {OL} stroke-width="12" stroke-linecap="round"/><path d="M50,32 L106,27" stroke="{RED}" stroke-width="6.5" stroke-linecap="round"/>'
    s += f'<path d="M48,43 L104,38" {OL} stroke-width="12" stroke-linecap="round"/><path d="M48,43 L104,38" stroke="{RED}" stroke-width="6.5" stroke-linecap="round"/>'
    s += f'<path d="M56,18 Q50,28 40,40" fill="none" {OL} stroke-width="12" stroke-linecap="round"/><path d="M56,18 Q50,28 40,40" fill="none" stroke="{RED}" stroke-width="6" stroke-linecap="round"/><circle cx="52" cy="36" r="6" fill="{RED}" {OL} stroke-width="3"/>'
    # 顔
    if face == 'awake': f = parts.eyes_awake(68, 90, 57) + parts.mouth_big(79, 66)
    elif face == 'sparkle': f = parts.eyes_awake(68, 90, 57) + parts.mouth_big(79, 66) + parts.prop_sparkle(72, 54, .5) + parts.prop_sparkle(94, 54, .5)
    elif face == 'puff': f = parts.eyes_closed(68, 90, 57) + f'<circle cx="79" cy="68" r="5" fill="#c0392b" {OL} stroke-width="3"/>'
    s += f + f'<ellipse cx="56" cy="64" rx="6" ry="4" fill="#ff8aa8" opacity=".75"/><ellipse cx="100" cy="64" rx="6" ry="4" fill="#ff8aa8" opacity=".75"/>'
    if puff:  # くうきを「ふー」
        s += f'<g fill="none" stroke="#8fd3ff" stroke-width="4" stroke-linecap="round"><path d="M92,72 Q102,70 108,76"/><path d="M94,80 Q106,80 112,88"/><path d="M90,88 Q100,92 102,100"/></g>'
    if sweat:
        s += f'<path d="M112,30 C108,38 108,44 112,46 C116,44 116,38 112,30 Z" fill="#7fc8ff" {OL} stroke-width="2.5"/>'
    return s

CASES = [
 ('1', 'ふだんの「げんきち」', '2頭身。はちまき（一一）の結び目のしっぽがノ。左手をピンとのばし右足をけり上げ（㇈）、たすき（丶）、左足（ノ）で運動会ジャンプ', genkichi()),
 ('2', 'ごほうび：げんきオーラ', 'なぞり終わると黄色いオーラがバッと出て目がキラキラ。「げんき 100ぱーせんと！」', genkichi('sparkle', aura_on=True)),
 ('3', '「ふー」くうきを吹く', '気＝くうきの意味も。ほっぺをふくらませて息を吹く表情差分', genkichi('puff', puff=True)),
 ('4', 'がんばりすぎて汗', '負けそうなときの顔。それでも笑ってる（ドパドリル流・失敗で盛り下がらない）', genkichi('awake', sweat=True)),
]

svg = lambda inner, size: f'<svg viewBox="0 0 160 160" width="{size}" height="{size}">{inner}</svg>'
cells = ''.join(f'''
    <div style="display:flex;align-items:center;gap:10px;background:#fff;border-radius:20px;padding:6px 12px;min-height:0">
      {svg(b, 170)}
      {svg(b + overlay(), 84)}
      <div style="display:flex;flex-direction:column;gap:4px;min-width:130px;flex:1">
        <div style="font-size:16px;font-weight:900;line-height:1.1"><span style="background:#ff7a59;color:#fff;border-radius:8px;padding:0 8px;margin-right:6px">{lab}</span>{title}</div>
        <div style="font-size:11.5px;color:#6b5f4a;line-height:1.45">{desc}</div>
      </div>
    </div>''' for lab, title, desc, b in CASES)
html = f'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>A-24 気キャラ案</title>
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
<div style="width: 880px; height: 560px; box-sizing: border-box; padding: 22px 32px; background: #fff0e0; font-family: 'Zen Maru Gothic', sans-serif; color: #2a2a3a; display: flex; flex-direction: column; gap: 8px">
  <div style="display: flex; align-items: baseline; gap: 14px">
    <div style="font-size: 26px; font-weight: 900; background: #ff7a59; color: #fff; padding: 2px 14px; border-radius: 12px; white-space:nowrap">A-24</div>
    <h1 style="margin: 0; font-size: 22px; font-weight: 900; white-space:nowrap">「気」キャラ案 — げんきっ子「げんきち」</h1>
    <div style="font-size: 12px; font-weight: 500; color: #6b5f4a">意味＝げんき。はちまき＝一一、しっぽ＝ノ、左手〜右足＝㇈、たすき＝丶、左足＝ノ。小さい図は筆画を重ねたもの</div>
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
open(os.path.join(OUT, 'A24_Ki.dc.html'), 'w', encoding='utf-8').write(html)
print('ok')
