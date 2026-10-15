# 「気」やりなおし：ふわふわ立ちのぼる湯気・雲の精。气＝雲の体（ノ＝てっぺんの湯気、一一＝ふわふわの層、㇈＝体の右側としっぽ）。メをどうするか4案
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
import parts
from xml.dom import minidom
OUT = sys.argv[1] if len(sys.argv) > 1 else None
OL = parts.OL
S = 144/109; O = 8
WHITE = '#ffffff'; SHADE = '#dceaf7'; LINE = '#9cc4e4'
doc = minidom.parse(os.path.join(os.path.dirname(__file__), '..', 'kvg', '06c17.svg'))
PATHS = [p.getAttribute('d') for p in doc.getElementsByTagName('path')]

def overlay(op=.45, col='#3b6fd9'):
    d = ' '.join(PATHS)
    return f'<g transform="translate({O},{O}) scale({S:.4f})" fill="none" stroke="{col}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity="{op}"><path d="{d}"/></g>'

def cloud_body():
    # 气＝「ㄱ」の形の雲：上の帯（ノ・一・一）＋右の帯（㇈の縦）＋右下で上にはねるしっぽ。左下はあいていて、そこにメが入る
    circles = [(44, 60, 13), (50, 42, 14), (68, 34, 18), (90, 32, 18), (108, 40, 16), (118, 60, 15), (118, 82, 15), (116, 104, 14), (112, 122, 12), (82, 50, 22), (104, 60, 18)]
    def blob(extra, col):
        s = ''.join(f'<circle cx="{x}" cy="{y}" r="{r+extra}" fill="{col}"/>' for x, y, r in circles)
        # ノ：てっぺんの湯気のとがり（根元は左、先は右上）
        s += f'<path d="M{40-extra},{50+extra} Q46,30 {60+extra},{16-extra} Q58,34 {56+extra},{48} Z" fill="{col}"/>'
        # しっぽ：㇈のはね。右下から右へ出て上にはねる
        s += f'<path d="M{104},{126+extra} Q118,{142+extra} {140+extra},{124} Q{144+extra},{108-extra} {132},{106-extra} Q136,118 122,{118} Z" fill="{col}"/>'
        return s
    s = '<g>' + blob(3, '#2a2a3a') + '</g><g>' + blob(0, WHITE) + '</g>'
    # 一一：ふわふわの層（水色のひだ）
    s += f'<g fill="none" stroke="{LINE}" stroke-width="4" stroke-linecap="round"><path d="M52,40 Q74,32 100,30"/><path d="M48,56 Q74,48 102,46"/></g>'
    # 右側の影
    s += f'<path d="M100,36 Q130,56 128,100 Q126,120 112,130 Q122,110 116,80 Q112,56 100,36 Z" fill="{SHADE}" opacity=".9"/>'
    return s

def face(kind='sleepy', cx=80, cy=48):
    if kind == 'sleepy':
        f = parts.eyes_closed(cx-14, cx+14, cy) + parts.mouth_cat(cx, cy+12)
    elif kind == 'awake':
        f = parts.eyes_awake(cx-14, cx+14, cy) + parts.mouth_smile(cx, cy+14)
    elif kind == 'blow':
        f = parts.eyes_closed(cx-14, cx+14, cy) + f'<ellipse cx="{cx}" cy="{cy+16}" rx="5" ry="6" fill="#c0392b" {OL} stroke-width="3"/>'
    elif kind == 'xmouth':
        f = parts.eyes_awake(cx-14, cx+14, cy) + f'<path d="M{cx-7},{cy+8} L{cx+7},{cy+20} M{cx+7},{cy+8} L{cx-7},{cy+20}" {OL} stroke-width="4" stroke-linecap="round"/>'
    return f + f'<ellipse cx="{cx-26}" cy="{cy+12}" rx="6" ry="4" fill="#ff8aa8" opacity=".7"/><ellipse cx="{cx+26}" cy="{cy+12}" rx="6" ry="4" fill="#ff8aa8" opacity=".7"/>'

def pinwheel(cx=66, cy=104, s=1.05):
    # メ＝風車（かざぐるま）。4枚の羽をXの向きに
    cols = ['#ff7a59', '#ffd23f', '#5fcb75', '#7fb8ff']
    b = ''
    for i, c in enumerate(cols):
        a = 45 + i*90
        b += f'<path d="M0,0 L22,-10 L22,10 Z" fill="{c}" {OL} stroke-width="3" stroke-linejoin="round" transform="rotate({a})"/>'
    stick = f'<path d="M{cx},{cy} L{cx-20},{cy+26}" {OL} stroke-width="8" stroke-linecap="round"/><path d="M{cx},{cy} L{cx-20},{cy+26}" stroke="#c9a66b" stroke-width="4" stroke-linecap="round"/>'
    return stick + f'<g transform="translate({cx},{cy}) scale({s})">{b}<circle r="4" fill="#fff" {OL} stroke-width="2.5"/></g>'

def arms_crossed():
    # メ＝胸の前で腕組み（雲の腕）
    a = (f'<path d="M48,74 Q66,100 92,128" fill="none" {OL} stroke-width="20" stroke-linecap="round"/><path d="M48,74 Q66,100 92,128" fill="none" stroke="{WHITE}" stroke-width="13" stroke-linecap="round"/>'
         f'<path d="M84,74 Q70,100 44,130" fill="none" {OL} stroke-width="20" stroke-linecap="round"/><path d="M84,74 Q70,100 44,130" fill="none" stroke="{WHITE}" stroke-width="13" stroke-linecap="round"/>'
         f'<circle cx="44" cy="131" r="9" fill="{WHITE}" {OL} stroke-width="3.5"/><circle cx="92" cy="129" r="9" fill="{WHITE}" {OL} stroke-width="3.5"/>')
    return a

def ribbon(cx=66, cy=100):
    # メ＝リボンの結び目。湯気を束ねている
    return (f'<path d="M{cx},{cy} L{cx-18},{cy-14} L{cx-14},{cy+2} Z M{cx},{cy} L{cx+16},{cy-12} L{cx+18},{cy+4} Z" fill="#ff8ab0" {OL} stroke-width="3" stroke-linejoin="round"/>'
            f'<path d="M{cx},{cy} L{cx-22},{cy+26} M{cx},{cy} L{cx+20},{cy+24}" fill="none" {OL} stroke-width="9" stroke-linecap="round"/><path d="M{cx},{cy} L{cx-22},{cy+26} M{cx},{cy} L{cx+20},{cy+24}" fill="none" stroke="#ff8ab0" stroke-width="5" stroke-linecap="round"/>'
            f'<circle cx="{cx}" cy="{cy}" r="5" fill="#ffd23f" {OL} stroke-width="2.5"/>')

def leaves(cx=66, cy=104):
    # メ＝風に舞う2枚の葉っぱ（交差）
    def leaf(a, col):
        return f'<g transform="translate({cx},{cy}) rotate({a})"><path d="M-22,0 Q0,-14 22,0 Q0,14 -22,0 Z" fill="{col}" {OL} stroke-width="3.5" stroke-linejoin="round"/><path d="M-16,0 L16,0" stroke="#2a2a3a" stroke-width="2" stroke-linecap="round" opacity=".6"/></g>'
    return leaf(-50, '#6ec46a') + leaf(50, '#ffb347')

def blow_lines(x=70, y=70):
    return f'<g fill="none" stroke="#8fd3ff" stroke-width="4" stroke-linecap="round"><path d="M{x},{y} Q{x-4},{y+12} {x-10},{y+18}"/><path d="M{x+12},{y+2} Q{x+12},{y+14} {x+6},{y+22}"/></g>'

def steam_bg():
    return f'<g fill="none" stroke="#c9dff0" stroke-width="5" stroke-linecap="round" opacity=".8"><path d="M20,120 Q10,100 24,86 Q36,74 24,60"/><path d="M146,96 Q156,80 144,66 Q134,54 146,40"/></g>'

CASES = [
 ('1', 'メ＝風車（かざぐるま）', '湯気の精が「ふー」と吹くと、おなかの風車がくるくる回る。空気の流れが目に見える。なぞり終わりは風車が高速回転', cloud_body() + face('blow') + blow_lines() + pinwheel()),
 ('2', 'メ＝腕組み', '雲の腕を胸の前で組んで、ぬくぬく気持ちよさそう。メがそのまま腕のX', cloud_body() + arms_crossed() + face('sleepy')),
 ('3', 'メ＝リボンの結び目', '立ちのぼる湯気をリボンで束ねたしっぽ。結び目がメ', cloud_body() + face('awake') + ribbon()),
 ('4', 'メ＝風に舞う葉っぱ', '吹かれて飛ぶ2枚の葉っぱが交差してメ。風車より静かで秋っぽい', cloud_body() + face('blow') + blow_lines() + leaves()),
]

svg = lambda inner, size: f'<svg viewBox="0 0 160 160" width="{size}" height="{size}">{inner}</svg>'
cells = ''.join(f'''
    <div style="display:flex;align-items:center;gap:10px;background:#fff;border-radius:20px;padding:6px 12px;min-height:0">
      {svg(steam_bg() + b, 170)}
      {svg(b + overlay(), 84)}
      <div style="display:flex;flex-direction:column;gap:4px;min-width:130px;flex:1">
        <div style="font-size:16px;font-weight:900;line-height:1.1"><span style="background:#5fa8e0;color:#fff;border-radius:8px;padding:0 8px;margin-right:6px">{lab}</span>{title}</div>
        <div style="font-size:11.5px;color:#6b5f4a;line-height:1.45">{desc}</div>
      </div>
    </div>''' for lab, title, desc, b in CASES)
html = f'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>A-24 気キャラ案（湯気の精）</title>
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
<div style="width: 880px; height: 560px; box-sizing: border-box; padding: 22px 32px; background: #e8f4ff; font-family: 'Zen Maru Gothic', sans-serif; color: #2a2a3a; display: flex; flex-direction: column; gap: 8px">
  <div style="display: flex; align-items: baseline; gap: 14px">
    <div style="font-size: 26px; font-weight: 900; background: #5fa8e0; color: #fff; padding: 2px 14px; border-radius: 12px; white-space:nowrap">A-24</div>
    <h1 style="margin: 0; font-size: 22px; font-weight: 900; white-space:nowrap">「気」キャラ案 — ふわふわ湯気の精</h1>
    <div style="font-size: 12px; font-weight: 500; color: #6b5f4a">气＝雲の体（ノ＝てっぺんの湯気、一一＝ふわふわの層、㇈＝右の輪郭と上にはねるしっぽ）。メの扱いを4案</div>
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
if OUT: open(os.path.join(OUT, 'A24_Ki.dc.html'), 'w', encoding='utf-8').write(html)
print('ok')
