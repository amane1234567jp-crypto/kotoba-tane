# 右・左：5本指の手で指さし ／ 出：ふんすい ／ 音：たいこ
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import parts, six_gen as G, na_hon3 as N, six3_gen as S3
OUT = sys.argv[1] if len(sys.argv) > 1 else None
OL = parts.OL
SKIN = G.SKIN; RED = G.RED
limb, hand, foot, head, face, overlay = G.limb, G.hand, G.foot, G.head, G.face, G.overlay
txt = N.txt

def pointing_hand(x, y, d=1, s=1.0):
    """指さしの手。x,y＝手首。d=1で右、-1で左。人さし指をのばし、3本は曲げ、親指は上"""
    g = f'<g transform="translate({x},{y}) scale({d*s},{s})">'
    g += f'<path d="M0,-11 L14,-11 Q22,-11 22,-3 L22,10 Q22,18 14,18 L0,18 Z" fill="{SKIN}" {OL} stroke-width="3.5" stroke-linejoin="round"/>'   # 手のひら
    g += f'<path d="M14,-10 L40,-10" {OL} stroke-width="11" stroke-linecap="round"/><path d="M14,-10 L40,-10" stroke="{SKIN}" stroke-width="7" stroke-linecap="round"/>'  # 人さし指
    for i, yy in enumerate((0, 8, 15)):   # 曲げた3本
        g += f'<path d="M16,{yy} L26,{yy}" {OL} stroke-width="9" stroke-linecap="round"/><path d="M16,{yy} L26,{yy}" stroke="{SKIN}" stroke-width="5" stroke-linecap="round"/>'
    g += f'<path d="M6,-12 L10,-26" {OL} stroke-width="9" stroke-linecap="round"/><path d="M6,-12 L10,-26" stroke="{SKIN}" stroke-width="5" stroke-linecap="round"/>'  # 親指
    g += '</g>'
    return g

def migi2():
    s = ''
    s += limb('M74,42 Q58,70 42,104', SKIN, 16) + hand(40, 106, 8)
    s += limb('M30,64 L112,59', SKIN, 16) + pointing_hand(110, 58, 1, 1.0)
    s += N.mouth_only(66, 98, 54, 32)
    s += txt(96, 40, 'みぎ！', 13, '#ff7a59') + f'<path d="M126,34 L150,32 M142,26 L150,32 L142,38" fill="none" stroke="#ff7a59" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'
    return s

def hidari2():
    s = ''
    s += f'<path d="M48,130 L132,126" {OL} stroke-width="14" stroke-linecap="round"/><path d="M48,130 L132,126" stroke="#ff8ab0" stroke-width="8" stroke-linecap="round"/>'
    s += f'<path d="M66,94 L112,90 L118,126 L62,130 Z" fill="#ff8ab0" {OL} stroke-width="5" stroke-linejoin="round"/>'
    s += f'<path d="M66,94 L112,90" {OL} stroke-width="12" stroke-linecap="round"/><path d="M66,94 L112,90" stroke="#ff5c9a" stroke-width="7" stroke-linecap="round"/>'
    s += f'<path d="M78,28 Q60,70 26,126" fill="none" {OL} stroke-width="16" stroke-linecap="round"/><path d="M78,28 Q60,70 26,126" fill="none" stroke="#6b4a2b" stroke-width="10" stroke-linecap="round"/><path d="M70,48 L62,52 M64,66 L56,70 M54,88 L46,92 M44,108 L36,112" stroke="#2a2a3a" stroke-width="2" stroke-linecap="round" opacity=".5"/>'
    s += f'<path d="M22,128 Q18,136 28,138" fill="none" stroke="#ff5c9a" stroke-width="4" stroke-linecap="round"/>'
    s += head(90, 40, 26) + f'<path d="M66,34 Q90,14 114,34 L110,26 Q90,8 70,26 Z" fill="#6b4a2b" {OL} stroke-width="3" stroke-linejoin="round"/>' + face(90, 44, .8, 'awake')
    s += limb('M120,60 L56,61', SKIN, 15) + pointing_hand(58, 61, -1, 1.0)
    s += txt(128, 84, 'ひだり！', 11, '#ff5c9a') + f'<path d="M30,92 L8,93 M16,87 L8,93 L16,99" fill="none" stroke="#ff5c9a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'
    return s

# ---- 出：ふんすい。下の凵＝大きな水盤、上の凵＝小さな水盤、丨＝ふき出す水 ----
def deru2():
    s = ''
    s += f'<path d="M36,100 L40,128 L120,124 L124,96 Z" fill="#9aa3ad" {OL} stroke-width="5" stroke-linejoin="round"/><path d="M36,100 L40,128 L80,126 L80,98 Z" fill="#000" opacity=".1"/>'
    s += f'<ellipse cx="80" cy="99" rx="46" ry="8" fill="#8fd3ff" {OL} stroke-width="4"/>'
    s += f'<path d="M44,56 L46,80 L118,76 L120,52 Z" fill="#9aa3ad" {OL} stroke-width="5" stroke-linejoin="round"/><path d="M44,56 L46,80 L82,78 L82,54 Z" fill="#000" opacity=".1"/>'
    s += f'<ellipse cx="82" cy="54" rx="40" ry="7" fill="#8fd3ff" {OL} stroke-width="4"/>'
    s += f'<rect x="76" y="80" width="10" height="18" fill="#9aa3ad" {OL} stroke-width="3"/>'
    # 丨＝ふき出す水
    s += f'<path d="M80,54 L80,20" {OL} stroke-width="14" stroke-linecap="round"/><path d="M80,54 L80,20" stroke="#8fd3ff" stroke-width="8" stroke-linecap="round"/><path d="M80,40 L80,24" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>'
    s += f'<g fill="#8fd3ff" {OL} stroke-width="2.5"><path d="M64,30 C60,38 60,44 64,46 C68,44 68,38 64,30 Z"/><path d="M98,24 C94,32 94,38 98,40 C102,38 102,32 98,24 Z"/><path d="M54,54 C51,60 51,64 54,66 C57,64 57,60 54,54 Z"/><path d="M110,50 C107,56 107,60 110,62 C113,60 113,56 110,50 Z"/></g>'
    s += f'<path d="M72,18 Q80,8 88,18" fill="none" stroke="#8fd3ff" stroke-width="4" stroke-linecap="round"/>'
    # 顔は上の水盤に
    s += parts.eyes_awake(70, 94, 66) + f'<path d="M76,74 Q82,78 88,74" fill="none" {OL} stroke-width="3" stroke-linecap="round"/><ellipse cx="56" cy="72" rx="5" ry="3.5" fill="#ff8aa8" opacity=".7"/><ellipse cx="108" cy="72" rx="5" ry="3.5" fill="#ff8aa8" opacity=".7"/>'
    s += txt(134, 30, 'みずが', 10, '#3b6fd9') + txt(134, 42, 'でる！', 10, '#3b6fd9')
    return s

# ---- 音：たっちゃんがたいこをたたく。立＝たっちゃん（丶＝頭、一＝両腕とバチ、丶ノ＝あし、広い一＝たいこのふち）、日＝たいこ（一一＝ひも） ----
def oto2():
    s = ''
    # 日＝たいこ
    s += f'<rect x="52" y="76" width="56" height="60" rx="8" fill="#e04a4a" {OL} stroke-width="5"/>'
    s += f'<path d="M52,106 L108,104 M52,126 L108,124" {OL} stroke-width="5" stroke-linecap="round"/><path d="M52,106 L108,104 M52,126 L108,124" stroke="#ffd23f" stroke-width="2.5" stroke-linecap="round"/>'
    s += f'<g stroke="#ffd23f" stroke-width="2" stroke-linecap="round"><path d="M60,80 L60,102 M76,80 L76,102 M92,80 L92,102 M100,80 L100,102"/></g>'
    s += parts.eyes_awake(70, 92, 92) + f'<path d="M76,114 Q80,118 84,114" fill="none" {OL} stroke-width="2.5" stroke-linecap="round"/>'
    # 広い一＝たいこのふち（上面）
    s += f'<ellipse cx="80" cy="74" rx="56" ry="9" fill="#fff6c0" {OL} stroke-width="4.5"/><ellipse cx="80" cy="74" rx="44" ry="6" fill="none" stroke="#c9a66b" stroke-width="2"/>'
    # 立＝たっちゃん（たいこの上に立つ）
    s += limb('M66,54 Q60,62 62,70', SKIN, 12) + limb('M94,46 Q96,58 92,68', SKIN, 12) + G.foot(60, 72, RED, 8, 4) + G.foot(92, 70, RED, 8, 4)
    s += f'<rect x="64" y="30" width="32" height="26" rx="8" fill="#8aa0ff" {OL} stroke-width="4.5"/>'
    s += limb('M46,46 L114,40', SKIN, 12) + hand(44, 47, 7) + hand(116, 40, 7)
    s += f'<path d="M44,47 L30,30 M116,40 L132,24" {OL} stroke-width="8" stroke-linecap="round"/><path d="M44,47 L30,30 M116,40 L132,24" stroke="#c9a66b" stroke-width="4" stroke-linecap="round"/>'
    s += head(80, 22, 14) + face(80, 24, .5, 'big')
    s += txt(18, 70, 'ドン！', 13, '#e04a4a') + txt(142, 60, 'ドン！', 13, '#e04a4a')
    s += f'<g stroke="#e04a4a" stroke-width="3" stroke-linecap="round" opacity=".6"><path d="M28,84 L20,90 M30,94 L22,98 M132,82 L140,88 M130,92 L138,96"/></g>'
    return s

CASES = [
 ('右', 'みぎ', '5本指で右をさす', '人さし指をのばし、3本は曲げ、親指を上に。→ 「みぎ！」', migi2()),
 ('左', 'ひだり', '5本指で左をさす', '同じ手を左向きに。← 「ひだり！」', hidari2()),
 ('出', 'でる', 'ふんすい（やりなおし）', '下の凵＝大きな水盤、上の凵＝小さな水盤、丨＝ふき出す水。「みずが でる！」', deru2()),
 ('音', 'おと', 'たっちゃんがたいこをたたく（やりなおし）', '立＝たっちゃん（丶＝頭、一＝両腕とバチ、丶ノ＝あし、広い一＝たいこのふち）、日＝たいこ（一一＝ひも）。「ドン！」', oto2()),
]

svg = lambda inner, size: f'<svg viewBox="0 0 160 160" width="{size}" height="{size}">{inner}</svg>'
cells = ''.join(f'''
    <div style="display:flex;align-items:center;gap:8px;background:#fff;border-radius:18px;padding:6px 12px;min-height:0">
      {svg(b, 180)}
      {svg(b + overlay(k), 80)}
      <div style="display:flex;flex-direction:column;gap:3px;min-width:0;flex:1">
        <div style="display:flex;align-items:baseline;gap:8px"><div style="font-size:26px;font-weight:900;line-height:1">{k}</div><div style="font-size:12px;font-weight:900">{yomi}</div></div>
        <div style="font-size:14px;font-weight:900;line-height:1.2">{title}</div>
        <div style="font-size:11px;color:#6b5f4a;line-height:1.4">{desc}</div>
      </div>
    </div>''' for k, yomi, title, desc, b in CASES)
html = f'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>A-32 右左の手、出・音のやりなおし</title>
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
<div style="width: 880px; height: 560px; box-sizing: border-box; padding: 20px 28px; background: #fff6d6; font-family: 'Zen Maru Gothic', sans-serif; color: #2a2a3a; display: flex; flex-direction: column; gap: 8px">
  <div style="display: flex; align-items: baseline; gap: 14px">
    <div style="font-size: 26px; font-weight: 900; background: #ff7a59; color: #fff; padding: 2px 14px; border-radius: 12px; white-space:nowrap">A-32</div>
    <h1 style="margin: 0; font-size: 22px; font-weight: 900; white-space:nowrap">右・左は5本指で指さし、出・音はやりなおし</h1>
  </div>
  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 1fr; gap: 8px; flex: 1 1 auto; min-height: 0">{cells}
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
if OUT: open(os.path.join(OUT, 'A32_Redo.dc.html'), 'w', encoding='utf-8').write(html)
print('ok')
