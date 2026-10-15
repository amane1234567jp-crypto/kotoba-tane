# 「金」キャラ案：お金をたくわえた蔵。𠆢＝屋根、一・丨・一＝白壁と扉、ちょんちょん（丶ノ）＝目、下の一＝石段
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import parts
OUT = sys.argv[1] if len(sys.argv) > 1 else None
OL = parts.OL
GOLD = '#ffd23f'; GOLD2 = '#e6b400'; WALL = '#fffaf0'; DARK = '#4a4a5a'

def coin(x, y, r=7):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{GOLD}" {OL} stroke-width="3"/><circle cx="{x}" cy="{y}" r="{r*0.55:.1f}" fill="none" stroke="{GOLD2}" stroke-width="2"/>'

def sparkle(x, y, s=1): return parts.prop_sparkle(x, y, s)

def roof(col='#3f4f6b', ridge=True):
    # 𠆢：ノ(76,24)->(27,85)、乀(77,32)->(134,79)。大きな三角屋根
    s = f'<path d="M80,18 L22,72 L138,72 Z" fill="{col}" {OL} stroke-width="5" stroke-linejoin="round"/><path d="M80,18 L22,72 L80,72 Z" fill="#000" opacity=".12"/>'
    if ridge:
        s += f'<path d="M80,18 L22,72 M80,18 L138,72" fill="none" stroke="#fff" stroke-width="3" opacity=".35" stroke-linecap="round"/>'
        s += f'<path d="M70,14 L90,14 L92,22 L68,22 Z" fill="{col}" {OL} stroke-width="3.5" stroke-linejoin="round"/>'
    return s

def wall(col=WALL, lattice=True, x0=42, x1=118, y0=64, y1=134):
    s = f'<rect x="{x0}" y="{y0}" width="{x1-x0}" height="{y1-y0}" rx="6" fill="{col}" {OL} stroke-width="5"/>'
    s += f'<path d="M{x0},{y0+6} L{x0},{y1-6} Q{x0},{y1} {x0+6},{y1} L{x0+10},{y1} L{x0+10},{y0} Z" fill="#000" opacity=".06"/>'
    if lattice:  # なまこ壁の白いななめ格子（下段だけ）
        s += f'<g stroke="{DARK}" stroke-width="2.5" opacity=".35" stroke-linecap="round"><path d="M{x0+4},118 L{x0+14},108 M{x0+14},128 L{x1-14},100 M{x1-14},128 L{x1-4},118 M{x0+4},106 L{x0+14},116 M{x0+14},96 L{x1-14},124 M{x1-14},96 L{x1-4},106"/></g>'
    return s

def bands():
    # 一(53,70)-(100,67) と 一(48,94)-(107,91)：壁の横木
    return (f'<path d="M48,76 L112,76" {OL} stroke-width="9" stroke-linecap="round"/><path d="M48,76 L112,76" stroke="#8a6a3a" stroke-width="4.5" stroke-linecap="round"/>'
            f'<path d="M46,96 L114,96" {OL} stroke-width="9" stroke-linecap="round"/><path d="M46,96 L114,96" stroke="#8a6a3a" stroke-width="4.5" stroke-linecap="round"/>')

def door(y0=104, y1=134, open_=False, coins=True):
    # 丨(76,72)->(77,131)：扉のまん中の線 → 観音びらきの扉
    s = f'<rect x="66" y="{y0}" width="28" height="{y1-y0}" rx="4" fill="#8a6a3a" {OL} stroke-width="4"/>'
    if open_:
        s = f'<rect x="66" y="{y0}" width="28" height="{y1-y0}" rx="4" fill="#3a2a1a" {OL} stroke-width="4"/>'
        s += f'<path d="M66,{y0} L56,{y0+6} L56,{y1+4} L66,{y1} Z" fill="#8a6a3a" {OL} stroke-width="3.5" stroke-linejoin="round"/><path d="M94,{y0} L104,{y0+6} L104,{y1+4} L94,{y1} Z" fill="#8a6a3a" {OL} stroke-width="3.5" stroke-linejoin="round"/>'
        if coins:
            s += ''.join(coin(x, y, 6) for x, y in ((74, 126), (86, 128), (80, 116), (90, 120), (70, 118)))
    else:
        s += f'<path d="M80,{y0+2} L80,{y1-2}" stroke="#2a2a3a" stroke-width="3" stroke-linecap="round"/>'
    return s

def eyes(kind='dots'):
    # 丶(49,107)->(60,123) と ノ(104,103)->(91,122)：ちょんちょんを目に
    if kind == 'dots':
        return (f'<ellipse cx="54" cy="118" rx="9" ry="11" fill="#fff" {OL} stroke-width="3"/><ellipse cx="106" cy="118" rx="9" ry="11" fill="#fff" {OL} stroke-width="3"/>'
                f'<ellipse cx="56" cy="120" rx="5.5" ry="7.5" fill="#2a2a3a"/><ellipse cx="104" cy="120" rx="5.5" ry="7.5" fill="#2a2a3a"/><circle cx="58" cy="116" r="2.5" fill="#fff"/><circle cx="106" cy="116" r="2.5" fill="#fff"/>')
    if kind == 'yen':  # 目が￥マーク（お金大好き）
        return (f'<ellipse cx="54" cy="118" rx="10" ry="11" fill="#fff" {OL} stroke-width="3"/><ellipse cx="106" cy="118" rx="10" ry="11" fill="#fff" {OL} stroke-width="3"/>'
                f'<g fill="none" stroke="{GOLD2}" stroke-width="3" stroke-linecap="round"><path d="M49,112 L54,119 L59,112 M54,119 L54,126 M49,121 L59,121 M49,124 L59,124"/><path d="M101,112 L106,119 L111,112 M106,119 L106,126 M101,121 L111,121 M101,124 L111,124"/></g>')
    if kind == 'happy':
        return f'<path d="M46,112 Q55,102 64,112 M96,112 Q105,102 114,112" fill="none" {OL} stroke-width="4" stroke-linecap="round"/>'

def mouth(kind='smile', y=82):
    if kind == 'smile': return f'<path d="M70,{y} Q80,{y+9} 90,{y}" fill="none" {OL} stroke-width="3.5" stroke-linecap="round"/>'
    if kind == 'open': return f'<path d="M68,{y-2} Q80,{y+16} 92,{y-2} Z" fill="#c0392b" {OL} stroke-width="3" stroke-linejoin="round"/>'
    return ''

def cheeks(): return f'<ellipse cx="44" cy="130" rx="6" ry="4" fill="#ff8aa8" opacity=".7"/><ellipse cx="116" cy="130" rx="6" ry="4" fill="#ff8aa8" opacity=".7"/>'

def step():  # 下の一(32,133)-(125,130)：石段
    return f'<rect x="28" y="130" width="104" height="14" rx="5" fill="#9aa3ad" {OL} stroke-width="4"/><path d="M40,137 L52,137 M70,137 L90,137 M108,137 L120,137" stroke="#6b7480" stroke-width="2.5" stroke-linecap="round"/>'

def feet():
    return f'<ellipse cx="54" cy="150" rx="13" ry="6" fill="#6b7480" {OL} stroke-width="4"/><ellipse cx="106" cy="150" rx="13" ry="6" fill="#6b7480" {OL} stroke-width="4"/>'

def arms_bag():
    return (f'<path d="M44,100 Q26,112 30,130" fill="none" {OL} stroke-width="16" stroke-linecap="round"/><path d="M44,100 Q26,112 30,130" fill="none" stroke="{WALL}" stroke-width="9" stroke-linecap="round"/>'
            f'<path d="M116,100 Q134,112 130,130" fill="none" {OL} stroke-width="16" stroke-linecap="round"/><path d="M116,100 Q134,112 130,130" fill="none" stroke="{WALL}" stroke-width="9" stroke-linecap="round"/>'
            f'<path d="M20,146 Q18,122 34,120 Q50,122 48,146 Z" fill="#c9a66b" {OL} stroke-width="3.5" stroke-linejoin="round"/><path d="M26,122 L42,122" stroke="#2a2a3a" stroke-width="3" stroke-linecap="round"/><text x="34" y="140" font-size="12" font-weight="900" text-anchor="middle" fill="#2a2a3a" font-family="Zen Maru Gothic, sans-serif">¥</text>'
            f'<path d="M112,146 Q110,122 126,120 Q142,122 140,146 Z" fill="#c9a66b" {OL} stroke-width="3.5" stroke-linejoin="round"/><path d="M118,122 L134,122" stroke="#2a2a3a" stroke-width="3" stroke-linecap="round"/><text x="126" y="140" font-size="12" font-weight="900" text-anchor="middle" fill="#2a2a3a" font-family="Zen Maru Gothic, sans-serif">¥</text>')

def v1():
    s = step() + wall() + bands() + door(open_=False) + eyes('dots') + cheeks() + f'<path d="M72,114 Q80,122 88,114" fill="none" {OL} stroke-width="3.5" stroke-linecap="round"/>' + roof()
    s += ''.join(coin(x, y, 5) for x, y in ((34, 62), (126, 60))) + sparkle(30, 44, .8) + sparkle(132, 40, .8)
    return s
def v2():
    s = step() + wall(lattice=False) + bands() + door(open_=True) + eyes('dots') + cheeks() + '' + roof()
    s += ''.join(coin(x, y, 6) for x, y in ((34, 60), (126, 58), (30, 76))) + sparkle(28, 40, .9) + sparkle(136, 36, .9)
    return s
def v3():
    s = feet() + arms_bag() + wall() + bands() + door(open_=False) + eyes('dots') + cheeks() + f'<path d="M72,114 Q80,122 88,114" fill="none" {OL} stroke-width="3.5" stroke-linecap="round"/>' + roof()
    return s
def v4():
    s = step() + wall(col=GOLD, lattice=False) + bands() + door(open_=True) + eyes('yen') + cheeks() + '' + roof(col=GOLD2)
    s += sparkle(30, 46, 1) + sparkle(132, 42, 1) + sparkle(136, 118, .8) + sparkle(24, 120, .8)
    return s

CASES = [
 ('1', '基本の蔵', '三角屋根（𠆢）・白壁となまこ壁・横木2本（一一）・扉（丨）・ちょんちょんが目・石段（下の一）。中にお金', v1()),
 ('2', '扉がひらいてお金がザクザク', '扉をあけると金貨がぎっしり。口もあけてにっこり', v2()),
 ('3', '手足つきの蔵', '石段を足に、両手に¥の袋。動き回れるゆるキャラ寄り', v3()),
 ('4', '金ぴか蔵', '壁も屋根も金色。目が¥マークの「お金だいすき」キャラ', v4()),
]

def svg(inner, size): return f'<svg viewBox="0 0 160 160" width="{size}" height="{size}">{inner}</svg>'

cells = ''
for lab, title, desc, b in CASES:
    cells += f'''
    <div style="display:flex;align-items:center;gap:12px;background:#fff;border-radius:20px;padding:6px 14px;min-height:0">
      {svg(b, 196)}
      <div style="display:flex;flex-direction:column;gap:4px;min-width:120px;flex:1">
        <div style="font-size:21px;font-weight:900;line-height:1.1"><span style="background:#e6b400;color:#fff;border-radius:8px;padding:0 8px;margin-right:6px">{lab}</span>{title}</div>
        <div style="font-size:12px;color:#6b5f4a;line-height:1.45">{desc}</div>
      </div>
    </div>'''

html = f'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>A-22 金キャラ案</title>
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
<div style="width: 880px; height: 560px; box-sizing: border-box; padding: 22px 32px; background: #fff6d6; font-family: 'Zen Maru Gothic', sans-serif; color: #2a2a3a; display: flex; flex-direction: column; gap: 8px">
  <div style="display: flex; align-items: baseline; gap: 14px">
    <div style="font-size: 26px; font-weight: 900; background: #e6b400; color: #fff; padding: 2px 14px; border-radius: 12px; white-space:nowrap">A-22</div>
    <h1 style="margin: 0; font-size: 22px; font-weight: 900; white-space:nowrap">「金」キャラ案 — お金をたくわえた蔵</h1>
    <div style="font-size: 12.5px; font-weight: 500; color: #6b5f4a">𠆢＝屋根、一丨一＝壁と扉、ちょんちょん＝目、下の一＝石段</div>
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
if OUT:
    open(os.path.join(OUT, 'A22_Kin.dc.html'), 'w', encoding='utf-8').write(html)
    print('ok')
