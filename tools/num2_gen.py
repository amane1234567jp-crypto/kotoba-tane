# 四〜十 やりなおし：字の形そのまま＋「数える」か「音」で数を感じさせる（アラビア数字なし）
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
sys_argv = sys.argv[:]; sys.argv = [sys.argv[0]]
import parts, six_gen as G, na_hon3 as N, num_gen as NG
sys.argv = sys_argv
OUT = sys.argv[1] if len(sys.argv) > 1 else None
OL = parts.OL
SKIN = G.SKIN; RED = G.RED
limb, hand, foot, head, face, overlay = G.limb, G.hand, G.foot, G.head, G.face, G.overlay
txt = N.txt
open_hand = NG.open_hand

def line(d, col, w=12):
    return f'<path d="{d}" fill="none" {OL} stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/><path d="{d}" fill="none" stroke="{col}" stroke-width="{w-6}" stroke-linecap="round" stroke-linejoin="round"/>'

# ---- 四：四角いおべんとうばこ。口＝箱（かどが4つ）、ノ乚＝中のしきり。4つのかどにおかず ----
def yon():
    s = f'<rect x="22" y="44" width="116" height="80" rx="10" fill="#e04a4a" {OL} stroke-width="5"/>'
    s += f'<rect x="30" y="52" width="100" height="64" rx="6" fill="#fffdf6" {OL} stroke-width="3"/>'
    s += line('M62,54 Q56,72 44,90', '#5fb860', 9) + line('M88,54 L89,70 Q92,78 114,80', '#5fb860', 9)
    # 4つのかどのおかず
    s += f'<rect x="33" y="56" width="18" height="14" rx="3" fill="#ffd23f" {OL} stroke-width="2.5"/><path d="M36,60 L48,60 M36,64 L48,64" stroke="#e6b400" stroke-width="1.5"/>'
    s += f'<circle cx="120" cy="64" r="8" fill="#e04a4a" {OL} stroke-width="2.5"/><path d="M118,56 L122,58" stroke="#5a9e3a" stroke-width="2.5" stroke-linecap="round"/>'
    s += f'<g fill="#5fb860" {OL} stroke-width="2"><circle cx="38" cy="106" r="6"/><circle cx="46" cy="102" r="6"/><circle cx="44" cy="110" r="6"/></g>'
    s += f'<path d="M110,100 Q120,94 126,104 Q122,114 112,112 Q104,108 110,100 Z" fill="#c9783a" {OL} stroke-width="2.5"/>'
    # まん中のごはんに顔
    s += parts.eyes_dot(72, 92, 92) + f'<path d="M78,100 Q82,104 86,100" fill="none" {OL} stroke-width="2.5" stroke-linecap="round"/><ellipse cx="66" cy="100" rx="4" ry="3" fill="#ff8aa8" opacity=".8"/><ellipse cx="98" cy="100" rx="4" ry="3" fill="#ff8aa8" opacity=".8"/>'
    s += f'<circle cx="82" cy="78" r="4" fill="#e04a4a" opacity=".9"/>'
    # かどの印
    for x, y in ((22, 44), (138, 44), (22, 124), (138, 124)):
        s += parts.prop_sparkle(x, y, .55)
    s += txt(80, 146, 'かどが よっつ', 11, '#e04a4a')
    return s

# ---- 五：サイコロの5の目。上下の一＝ふち、ノとコ＝目のバツの並び。目が顔になる ----
def go():
    s = f'<path d="M40,36 L118,32 L132,22 L56,24 Z" fill="#f0f0f0" {OL} stroke-width="4" stroke-linejoin="round"/>'
    s += f'<path d="M118,32 L132,22 L134,114 L120,126 Z" fill="#dcdcdc" {OL} stroke-width="4" stroke-linejoin="round"/>'
    s += f'<rect x="36" y="34" width="86" height="94" rx="12" fill="#fff" {OL} stroke-width="5"/>'
    s += f'<path d="M50,40 L116,36 M82,42 L58,124 M44,80 L106,77 L101,122 M24,128 L138,124" fill="none" stroke="#c7d3e0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>'
    # 5つの目（左上・右上＝目、まん中＝はな、左下・右下＝ほっぺ）
    for cx, cy in ((56, 56), (102, 54)):
        s += f'<circle cx="{cx}" cy="{cy}" r="10" fill="#2a2a3a"/><circle cx="{cx+3}" cy="{cy-3}" r="3.5" fill="#fff"/>'
    s += f'<circle cx="76" cy="80" r="10" fill="#e04a4a"/>'
    s += f'<circle cx="52" cy="108" r="10" fill="#ff8aa8"/><circle cx="100" cy="106" r="10" fill="#ff8aa8"/>'
    s += f'<path d="M70,98 Q76,104 82,98" fill="none" {OL} stroke-width="3" stroke-linecap="round"/>'
    s += f'<rect x="20" y="126" width="120" height="8" rx="4" fill="#9ad36b" {OL} stroke-width="3"/>'
    s += txt(146, 50, 'ころん', 9, '#6b5f4a')
    return s

# ---- 六：ありんこ。丶＝頭、一＝横にのばした前あし、ハ＝ふんばる後ろあし（まん中のあしと合わせて6本） ----
def roku():
    s = ''
    s += line('M80,64 L28,64', '#6b4a2b', 10) + line('M80,62 L134,60', '#6b4a2b', 10)
    s += line('M72,80 Q56,82 44,94', '#6b4a2b', 8) + line('M88,80 Q104,82 116,94', '#6b4a2b', 8)
    s += line('M70,96 Q50,104 30,124', '#6b4a2b', 10) + line('M90,96 Q112,104 130,124', '#6b4a2b', 10)
    for x, y in ((24, 64), (138, 60), (42, 96), (118, 96), (26, 126), (134, 126)):
        s += f'<circle cx="{x}" cy="{y}" r="5" fill="#6b4a2b" {OL} stroke-width="2.5"/>'
    s += f'<ellipse cx="80" cy="108" rx="18" ry="22" fill="#8a5a3a" {OL} stroke-width="4.5"/><path d="M64,104 Q80,110 96,104 M66,116 Q80,122 94,116" fill="none" stroke="#6b4a2b" stroke-width="2.5"/>'
    s += f'<ellipse cx="80" cy="74" rx="11" ry="13" fill="#8a5a3a" {OL} stroke-width="4"/>'
    s += f'<path d="M72,30 Q64,14 54,12 M88,30 Q96,14 106,12" fill="none" {OL} stroke-width="3.5" stroke-linecap="round"/><circle cx="54" cy="12" r="3.5" fill="#2a2a3a"/><circle cx="106" cy="12" r="3.5" fill="#2a2a3a"/>'
    s += f'<circle cx="80" cy="42" r="18" fill="#a66b45" {OL} stroke-width="4.5"/>' + face(80, 44, .6, 'awake')
    s += txt(140, 150, 'あし6本', 9, '#6b4a2b')
    return s

# ---- 七：ななほしてんとう。乚＝くき、一＝葉っぱ。てんとうむしの星が7つ ----
def nana():
    s = line('M65,30 L66,104 Q68,120 90,120 L126,122', '#5a9e3a', 12)
    s += f'<path d="M26,78 Q50,64 80,72 Q110,64 134,66 Q112,80 80,80 Q50,90 26,78 Z" fill="#6ec46a" {OL} stroke-width="4" stroke-linejoin="round"/><path d="M30,77 Q80,72 130,67" fill="none" stroke="#3f8f3a" stroke-width="2.5"/>'
    s += f'<path d="M65,30 Q54,20 48,26 Q56,34 65,32 Z" fill="#8fdc78" {OL} stroke-width="3"/>'
    # てんとうむし（くきの角のあたり）
    cx, cy = 102, 104
    s += f'<circle cx="{cx+22}" cy="{cy-10}" r="10" fill="#2a2a3a" {OL} stroke-width="3"/><circle cx="{cx+21}" cy="{cy-13}" r="3" fill="#fff"/><circle cx="{cx+27}" cy="{cy-12}" r="3" fill="#fff"/>'
    s += f'<ellipse cx="{cx}" cy="{cy}" rx="22" ry="18" fill="#e04a4a" {OL} stroke-width="4"/><path d="M{cx+20},{cy-6} L{cx-20},{cy+6}" {OL} stroke-width="2.5"/>'
    for x, y in ((cx-10, cy-9), (cx+4, cy-11), (cx-14, cy+4), (cx+10, cy+2), (cx-4, cy+12), (cx+14, cy+10), (cx-3, cy-1)):
        s += f'<circle cx="{x}" cy="{y}" r="3.8" fill="#2a2a3a"/>'
    s += txt(40, 116, 'ほしが', 9, '#e04a4a') + txt(40, 128, 'ななつ', 9, '#e04a4a')
    return s

# ---- 八：はち（蜂）。ノ乀＝ハの字に大きくひろげたはね ----
def hachi():
    s = f'<path d="M66,58 Q40,80 22,116 Q42,112 70,72 Z" fill="#dff4ff" {OL} stroke-width="4" stroke-linejoin="round"/>'
    s += f'<path d="M74,46 Q106,70 134,112 Q112,110 84,64 Z" fill="#dff4ff" {OL} stroke-width="4" stroke-linejoin="round"/>'
    s += f'<path d="M34,104 Q48,86 62,70 M120,104 Q106,84 88,62" fill="none" stroke="#9cc4e4" stroke-width="2"/>'
    s += f'<ellipse cx="78" cy="96" rx="20" ry="28" fill="#ffd23f" {OL} stroke-width="4.5"/><path d="M60,88 Q78,94 96,88 M60,104 Q78,110 96,104" fill="none" stroke="#2a2a3a" stroke-width="7"/><path d="M78,124 L78,134" {OL} stroke-width="4" stroke-linecap="round"/>'
    s += f'<path d="M70,30 Q62,16 56,16 M86,30 Q94,16 100,16" fill="none" {OL} stroke-width="3" stroke-linecap="round"/><circle cx="56" cy="16" r="3" fill="#2a2a3a"/><circle cx="100" cy="16" r="3" fill="#2a2a3a"/>'
    s += f'<circle cx="78" cy="46" r="18" fill="#ffd23f" {OL} stroke-width="4.5"/>' + face(78, 48, .6, 'awake')
    s += txt(132, 30, 'ぶーん', 10, '#e6b400')
    return s

# ---- 九：きゅう＝球（ボール）。ノ＝からだと軸足、㇈＝ひろげた腕からけり上げる足 ----
def kyu():
    s = ''
    s += line('M56,78 L30,124', SKIN, 14) + foot(26, 127, rx=10)
    s += f'<path d="M58,38 L52,84" {OL} stroke-width="26" stroke-linecap="round"/><path d="M58,38 L52,84" stroke="#5fa8e0" stroke-width="19" stroke-linecap="round"/>'
    s += line('M58,52 L26,68', SKIN, 12) + hand(24, 69, 7)
    s += line('M60,50 L96,60', SKIN, 12) + hand(98, 61, 7)
    s += line('M56,82 L96,82 Q106,84 116,100 L128,112', SKIN, 15) + foot(132, 114, rx=11, ry=6)
    s += f'<circle cx="146" cy="98" r="11" fill="#fff" {OL} stroke-width="3.5"/><path d="M146,90 L141,95 L143,102 L150,102 L152,95 Z" fill="#2a2a3a"/>'
    s += f'<g stroke="#2a2a3a" stroke-width="2.5" stroke-linecap="round" opacity=".5"><path d="M128,94 L120,88 M132,86 L126,78"/></g>'
    s += head(62, 24, 16) + face(62, 26, .55, 'big')
    s += txt(140, 74, 'きゅう！', 10, '#3b6fd9')
    return s

# ---- 十：りょうてをひろげた子。一＝ひろげた両うで、丨＝からだ。指が5本＋5本 ----
def ju():
    s = line('M78,96 L76,138', SKIN, 14) + line('M84,96 L86,138', SKIN, 14) + foot(72, 141, rx=9) + foot(90, 141, rx=9)
    s += f'<rect x="64" y="60" width="32" height="44" rx="10" fill="#ffd23f" {OL} stroke-width="4.5"/>'
    s += line('M40,72 L120,70', SKIN, 13)
    s += open_hand(30, 72, .85, -90) + open_hand(130, 70, .85, 90)
    s += head(80, 32, 20) + f'<path d="M62,26 Q80,8 98,26 L94,18 Q80,6 66,18 Z" fill="#6b4a2b" {OL} stroke-width="3" stroke-linejoin="round"/>' + face(80, 34, .65, 'big')
    s += txt(30, 112, 'ゆびが', 9, '#e04a4a') + txt(30, 124, 'とお', 9, '#e04a4a')
    return s

CASES = [
 ('四', 'よん', 'おべんとうばこ', '口＝四角い箱（かどが4つ）、ノ乚＝中のしきり。4つのかどにおかずが1つずつ', yon()),
 ('五', 'ご', 'サイコロの5', '上下の一＝ふち、ノとコ＝5つの目のバツの並び。目が2つ、はな、ほっぺ2つで顔になる', go()),
 ('六', 'ろく', 'ありんこ', '丶＝頭、一＝横にのばした前あし、ハ＝ふんばる後ろあし。まん中のあしと合わせて6本', roku()),
 ('七', 'なな', 'ななほしてんとう', '乚＝くき、一＝葉っぱ。くきの角にいるてんとうむしの星が7つ', nana()),
 ('八', 'はち', 'はち（蜂）', 'ノ乀＝ハの字にひろげた大きなはね。「はち」の音でおぼえる', hachi()),
 ('九', 'きゅう', 'きゅう＝球（ボール）', 'ノ＝からだと軸足、㇈＝ひろげた腕からけり上げる足。足の先にボール', kyu()),
 ('十', 'じゅう', 'りょうてをひろげた子', '一＝ひろげた両うで、丨＝からだ。両手がパーで指が10本（五の片手と対）', ju()),
]

svg = lambda inner, size: f'<svg viewBox="0 0 160 160" width="{size}" height="{size}">{inner}</svg>'
cells = ''.join(f'''
    <div style="display:flex;align-items:center;gap:6px;background:#fff;border-radius:16px;padding:4px 8px;min-height:0">
      {svg(b, 128)}
      {svg(b + overlay(k), 60)}
      <div style="display:flex;flex-direction:column;gap:2px;min-width:0;flex:1">
        <div style="display:flex;align-items:baseline;gap:8px"><div style="font-size:26px;font-weight:900;line-height:1">{k}</div><div style="font-size:12px;font-weight:900">{yomi}</div></div>
        <div style="font-size:12.5px;font-weight:900;line-height:1.2">{t}</div>
        <div style="font-size:10px;color:#6b5f4a;line-height:1.35">{desc}</div>
      </div>
    </div>''' for k, yomi, t, desc, b in CASES)
html = f'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>A-40 数字の字（四〜十）やりなおし2</title>
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
    <div style="font-size: 26px; font-weight: 900; background: #5fb860; color: #fff; padding: 2px 14px; border-radius: 12px; white-space:nowrap">A-40</div>
    <h1 style="margin: 0; font-size: 21px; font-weight: 900; white-space:nowrap">数字の字（四〜十）— 字の形のまま、数をかんじる</h1>
    <div style="font-size: 11.5px; font-weight: 500; color: #6b5f4a">アラビア数字なし。四五六七十は「数えたらその数」、八九は「音」</div>
  </div>
  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 1fr; gap: 6px; flex: 1 1 auto; min-height: 0">{cells}
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
    open(os.path.join(OUT, 'A40_Numbers2.dc.html'), 'w', encoding='utf-8').write(html)
    print('ok')
