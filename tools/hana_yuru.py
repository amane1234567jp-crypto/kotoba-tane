# 「花」ゆるキャラ案：2頭身ずんぐり、でっかい頭に草の王冠。ポーズは化（左手下げ・右手上げ）
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
import parts
OUT = sys.argv[1] if len(sys.argv) > 1 else None
OL = parts.OL
G1 = '#5fb860'; G2 = '#8fdc78'; PINK = '#ff8ab0'; SKIN = '#ffcf9e'

def limb(d, col, w=18):
    return f'<path d="{d}" fill="none" {OL} stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/><path d="{d}" fill="none" stroke="{col}" stroke-width="{w-7}" stroke-linecap="round" stroke-linejoin="round"/>'

def flower_small(x, y, s=1, col=PINK):
    return (f'<g fill="{col}" {OL} stroke-width="{2.5*s}"><circle cx="{x}" cy="{y-5*s}" r="{4*s}"/><circle cx="{x+5*s}" cy="{y}" r="{4*s}"/><circle cx="{x}" cy="{y+5*s}" r="{4*s}"/><circle cx="{x-5*s}" cy="{y}" r="{4*s}"/></g>'
            f'<circle cx="{x}" cy="{y}" r="{3*s}" fill="#ffd23f" {OL} stroke-width="{1.5*s}"/>')

def crown(style='leaf', y=44, x0=38, x1=122, buds=False):
    """草の王冠。艹：横棒＝帯、2本の縦＝帯をつらぬく葉の尖り"""
    s = ''
    if style == 'leaf':
        # 帯（上の縁がギザギザ）
        pts = ' '.join(f'{x},{y-6 if i%2 else y}' for i, x in enumerate(range(x0, x1+1, 12)))
        s += f'<path d="M{x0},{y+10} L{x0},{y} L{pts} L{x1},{y} L{x1},{y+10} Z" fill="{G1}" {OL} stroke-width="4.5" stroke-linejoin="round"/>'
        s += f'<path d="M{x0+4},{y+6} L{x1-4},{y+6}" stroke="{G2}" stroke-width="3" stroke-linecap="round" opacity=".9"/>'
        # 2本の大きな葉（帯をつらぬく）
        for cx in (x0+24, x1-24):
            s += f'<path d="M{cx-9},{y+14} L{cx-11},{y-22} Q{cx},{y-36} {cx+11},{y-22} L{cx+9},{y+14} Z" fill="{G2}" {OL} stroke-width="4" stroke-linejoin="round"/><path d="M{cx},{y+10} L{cx},{y-26}" stroke="{G1}" stroke-width="3" stroke-linecap="round"/>'
            if buds: s += flower_small(cx, y-28, .9)
    elif style == 'royal':
        # 王冠らしさ優先：帯＋尖り3つ（中央は低め）。2本の縦は左右の尖り
        s += f'<path d="M{x0},{y+12} L{x0},{y-2} L{x0+22},{y-34} L{x0+42},{y-4} L80,{y-18} L{x1-42},{y-4} L{x1-22},{y-34} L{x1},{y-2} L{x1},{y+12} Z" fill="{G1}" {OL} stroke-width="4.5" stroke-linejoin="round"/>'
        s += f'<path d="M{x0+4},{y+6} L{x1-4},{y+6}" stroke="{G2}" stroke-width="4" stroke-linecap="round"/>'
        s += f'<path d="M{x0+22},{y-34} L{x0+22},{y+8} M{x1-22},{y-34} L{x1-22},{y+8}" stroke="{G2}" stroke-width="3.5" stroke-linecap="round" opacity=".9"/>'
        s += flower_small(x0+22, y-36, .8) + flower_small(x1-22, y-36, .8) + f'<circle cx="80" cy="{y+4}" r="5" fill="#ffd23f" {OL} stroke-width="2.5"/>'
    return s

def body(outfit='flower', facek='awake', collar=False, crown_style='leaf', buds=False, headcol=SKIN):
    s = ''
    # 脚（ずんぐり）：左は短い丨、右は乚で足先が右へ
    s += limb('M66,140 L66,150', SKIN, 16) + f'<ellipse cx="66" cy="154" rx="11" ry="5" fill="#e04a4a" {OL} stroke-width="3.5"/>'
    s += limb('M96,140 L97,150 Q98,154 104,154 L118,154', SKIN, 16) + f'<ellipse cx="122" cy="154" rx="11" ry="5" fill="#e04a4a" {OL} stroke-width="3.5"/>'
    # 胴（まるい）
    bc = '#fff' if outfit == 'flower' else PINK
    s += f'<ellipse cx="81" cy="122" rx="30" ry="24" fill="{bc}" {OL} stroke-width="5"/><path d="M51,122 A30,24 0 0 0 81,146 L81,98 A30,24 0 0 0 51,122 Z" fill="#000" opacity=".07"/>'
    if outfit == 'flower':
        s += flower_small(68, 118, .8) + flower_small(92, 126, .8) + flower_small(82, 108, .6)
    if collar:
        s += ''.join(f'<ellipse cx="{x}" cy="104" rx="8" ry="6" fill="{PINK}" {OL} stroke-width="3"/>' for x in (60, 74, 88, 102))
    # 腕：左下げ（ノ）、右上げ（ヒの斜め）
    s += limb('M58,116 Q48,128 40,140', SKIN) + f'<circle cx="39" cy="142" r="8" fill="{SKIN}" {OL} stroke-width="3.5"/>'
    s += limb('M104,112 Q116,100 126,86', SKIN) + f'<circle cx="127" cy="84" r="8" fill="{SKIN}" {OL} stroke-width="3.5"/>'
    # 頭（でっかい）
    s += f'<circle cx="80" cy="66" r="40" fill="{headcol}" {OL} stroke-width="5"/><path d="M40,66 A40,40 0 0 0 80,106 L80,26 A40,40 0 0 0 40,66 Z" fill="#000" opacity=".07"/>'
    if facek == 'awake': f = parts.eyes_awake(64, 96, 70) + parts.mouth_smile(80, 88)
    else: f = parts.eyes_smile(64, 96, 72) + parts.mouth_cat(80, 88)
    s += f + f'<ellipse cx="50" cy="84" rx="7" ry="5" fill="#ff8aa8" opacity=".75"/><ellipse cx="110" cy="84" rx="7" ry="5" fill="#ff8aa8" opacity=".75"/>'
    s += crown(crown_style, buds=buds)
    return s

CASES = [
 ('1', '基本形', '2頭身・でっかい頭・草の王冠（葉の尖りが帯をつらぬく）・花がらの服。腕は左下げ右上げ', body()),
 ('2', '王冠をもっと王冠に', '尖り3つの王冠に。左右の尖りに花、まん中に宝石。顔はにっこり', body(facek='smile', crown_style='royal')),
 ('3', '花の首かざり', '王冠の葉先につぼみ、首に花びらのえり。服は無地ピンク', body(outfit='plain', collar=True, buds=True)),
 ('4', 'ほっぺもピンク', '頭をうすピンクに。花びら色の顔で「花」感を強める。王冠は王冠型', body(facek='smile', crown_style='royal', headcol='#ffd9e6')),
]

def svg(inner, size): return f'<svg viewBox="0 0 160 160" width="{size}" height="{size}">{inner}</svg>'

cells = ''
for lab, title, desc, b in CASES:
    cells += f'''
    <div style="display:flex;align-items:center;gap:12px;background:#fff;border-radius:20px;padding:6px 14px;min-height:0">
      {svg(b, 196)}
      <div style="display:flex;flex-direction:column;gap:4px;min-width:120px;flex:1">
        <div style="font-size:21px;font-weight:900;line-height:1.1"><span style="background:#ff5c9a;color:#fff;border-radius:8px;padding:0 8px;margin-right:6px">{lab}</span>{title}</div>
        <div style="font-size:12px;color:#6b5f4a;line-height:1.45">{desc}</div>
      </div>
    </div>'''

html = f'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>A-21 花ゆるキャラ案</title>
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
    <div style="font-size: 26px; font-weight: 900; background: #ff5c9a; color: #fff; padding: 2px 14px; border-radius: 12px; white-space:nowrap">A-21</div>
    <h1 style="margin: 0; font-size: 22px; font-weight: 900; white-space:nowrap">「花」ゆるキャラ案（A-20 Dの改良）</h1>
    <div style="font-size: 12.5px; font-weight: 500; color: #6b5f4a">2頭身ずんぐり。でっかい頭に草の王冠。字の形より王冠に見えることを優先</div>
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
if OUT: open(os.path.join(OUT, 'A21_HanaYuru.dc.html'), 'w', encoding='utf-8').write(html)
print('ok')
