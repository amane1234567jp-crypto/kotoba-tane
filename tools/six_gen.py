# 合体字キャラ 本命1案ずつ：休・男・字・学・空・町
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
import parts
from xml.dom import minidom
OUT = sys.argv[1] if len(sys.argv) > 1 else None
OL = parts.OL
S = 144/109; O = 8
SKIN = '#ffcf9e'; RED = '#e04a4a'

def overlay(k, op=.45, col='#3b6fd9'):
    doc = minidom.parse(os.path.join(os.path.dirname(__file__), '..', 'kvg', f'{ord(k):05x}.svg'))
    d = ' '.join(p.getAttribute('d') for p in doc.getElementsByTagName('path'))
    return f'<g transform="translate({O},{O}) scale({S:.4f})" fill="none" stroke="{col}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity="{op}"><path d="{d}"/></g>'

def limb(d, col, w=16):
    return f'<path d="{d}" fill="none" {OL} stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/><path d="{d}" fill="none" stroke="{col}" stroke-width="{w-7}" stroke-linecap="round" stroke-linejoin="round"/>'
def hand(x, y, r=8, col=SKIN): return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{col}" {OL} stroke-width="3.5"/>'
def foot(x, y, col=RED, rx=11, ry=5): return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{col}" {OL} stroke-width="3.5"/>'
def head(cx, cy, r, col=SKIN): return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{col}" {OL} stroke-width="5"/><path d="M{cx-r},{cy} A{r},{r} 0 0 0 {cx},{cy+r} L{cx},{cy-r} A{r},{r} 0 0 0 {cx-r},{cy} Z" fill="#000" opacity=".06"/>'
def face(cx, cy, s=1, kind='awake'):
    if kind == 'awake': f = parts.eyes_awake(-12, 12, 0) + parts.mouth_smile(0, 14)
    elif kind == 'sleep': f = parts.eyes_closed(-12, 12, 0) + parts.mouth_o(0, 14)
    elif kind == 'smile': f = parts.eyes_smile(-12, 12, 2) + parts.mouth_cat(0, 12)
    elif kind == 'big': f = parts.eyes_awake(-12, 12, 0) + parts.mouth_big(0, 12)
    return f'<g transform="translate({cx},{cy}) scale({s})">{f}{parts.cheeks(-24, 24, 8)}</g>'
def zzz(x, y): return f'<text x="{x}" y="{y}" font-size="16" font-weight="900" fill="#3b6fd9" font-family="Zen Maru Gothic, sans-serif" transform="rotate(-15 {x} {y})">z z Z</text>'

# ---- 休：木にもたれて昼寝する子 ----
def yasumu():
    s = ''
    # 木：幹（丨）、枝（一）に葉のかたまり、根（ノ乀）
    s += f'<path d="M58,112 Q50,124 40,132 M112,112 Q122,124 132,130" fill="none" stroke="#8b5a2b" stroke-width="12" stroke-linecap="round"/><path d="M58,112 Q50,124 40,132 M112,112 Q122,124 132,130" fill="none" stroke="#8b5a2b" stroke-width="7" stroke-linecap="round"/>'
    s += f'<rect x="80" y="26" width="20" height="112" rx="7" fill="#a66b35" {OL} stroke-width="5"/>'
    s += f'<path d="M62,58 L128,56" {OL} stroke-width="14" stroke-linecap="round"/><path d="M62,58 L128,56" stroke="#8b5a2b" stroke-width="8" stroke-linecap="round"/>'
    for cx, cy, r in ((66, 50, 14), (90, 30, 18), (126, 48, 14), (108, 36, 12)):
        s += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#5fcb75" {OL} stroke-width="4"/>'
    # 子：頭（ノの上）、左脚（ノ）、右脚（丨）。幹にもたれて寝る
    s += limb('M44,76 Q36,88 24,96', SKIN) + foot(21, 99, rx=9)
    s += limb('M44,80 L44,128', SKIN) + foot(44, 133, rx=9)
    s += f'<ellipse cx="46" cy="78" rx="22" ry="16" fill="#8fd3ff" {OL} stroke-width="4.5"/>'
    s += head(48, 44, 24) + f'<path d="M30,34 Q48,18 66,34 L62,28 Q48,14 34,28 Z" fill="#6b4a2b" {OL} stroke-width="3" stroke-linejoin="round"/>' + face(48, 46, .8, 'sleep') + zzz(10, 24)
    return s

# ---- 男：野球帽の力持ちぼうや ----
def otoko():
    s = ''
    # 力：㇆＝力こぶの右腕（肩→ひじ→こぶし）、ノ＝左脚
    s += limb('M78,76 Q60,100 34,128', SKIN, 18) + foot(31, 131)
    s += f'<rect x="54" y="72" width="48" height="36" rx="12" fill="#5fa8e0" {OL} stroke-width="5"/>'
    s += limb('M40,90 L112,84 Q122,84 120,94 L112,118 Q108,130 90,128', SKIN, 18) + hand(88, 128, 9)
    s += f'<circle cx="100" cy="96" r="12" fill="#ffb86b" {OL} stroke-width="3.5"/><path d="M94,92 Q100,86 106,92" fill="none" {OL} stroke-width="2.5" stroke-linecap="round"/>'
    # 田：四角い顔＋野球帽（上半分）。たての線＝帽子の縫い目〜鼻、よこの線＝つば
    s += f'<rect x="46" y="28" width="68" height="46" rx="12" fill="{SKIN}" {OL} stroke-width="5"/>'
    s += f'<path d="M46,40 Q46,28 58,28 L102,28 Q114,28 114,40 L114,48 L46,48 Z" fill="{RED}" {OL} stroke-width="4" stroke-linejoin="round"/>'
    s += f'<path d="M44,49 L118,46" {OL} stroke-width="9" stroke-linecap="round"/><path d="M44,49 L118,46" stroke="#c0392b" stroke-width="5" stroke-linecap="round"/>'
    s += f'<path d="M80,30 L80,46" stroke="#2a2a3a" stroke-width="3" stroke-linecap="round"/><path d="M80,52 L80,66" stroke="#2a2a3a" stroke-width="3.5" stroke-linecap="round"/>'
    s += parts.eyes_awake(66, 94, 60) + f'<path d="M72,70 Q80,76 88,70" fill="none" {OL} stroke-width="3.5" stroke-linecap="round"/>' + parts.cheeks(54, 106, 66)
    return s

# ---- 字：おうち帽子をかぶって字を書く子 ----
def kid(cx=80, hat='', pen=True):
    s = ''
    # 子：㇁＝体〜足、一＝両手を広げる
    s += limb(f'M{cx},86 L{cx+2},126 Q{cx+2},136 {cx-12},134', '#fff3b0', 22) + foot(cx-16, 136, rx=10)
    s += limb(f'M30,92 L{cx-10},90', SKIN, 14) + limb(f'M{cx+10},90 L130,86', SKIN, 14) + hand(28, 92, 8) + hand(132, 86, 8)
    s += head(cx, 60, 26) + f'<path d="M{cx-20},50 Q{cx},34 {cx+22},52 Q{cx+10},44 {cx-2},50 Z" fill="#6b4a2b" {OL} stroke-width="3" stroke-linejoin="round"/>' + face(cx, 62, .85, 'big' if pen else 'awake')
    s += hat
    return s
def roof_hat():
    return (f'<path d="M36,46 L80,22 L124,44 L124,52 L36,52 Z" fill="{RED}" {OL} stroke-width="4.5" stroke-linejoin="round"/><path d="M36,46 L80,22 L80,52 L36,52 Z" fill="#000" opacity=".1"/>'
            f'<circle cx="80" cy="18" r="6" fill="#ffd23f" {OL} stroke-width="3"/><path d="M36,52 L34,64 M124,52 L126,64" {OL} stroke-width="8" stroke-linecap="round"/><path d="M36,52 L34,64 M124,52 L126,64" stroke="{RED}" stroke-width="4" stroke-linecap="round"/>')
def ji():
    s = kid(80, roof_hat())
    # 右手にえんぴつ、書いた「じ」
    s += f'<path d="M134,84 L148,60" {OL} stroke-width="8" stroke-linecap="round"/><path d="M134,84 L148,60" stroke="#ffd23f" stroke-width="4" stroke-linecap="round"/><path d="M146,64 L150,56 L152,62 Z" fill="#2a2a3a"/>'
    s += f'<text x="140" y="124" font-size="26" font-weight="900" fill="#3b6fd9" font-family="Zen Maru Gothic, sans-serif" text-anchor="middle">じ</text>'
    return s

# ---- 学：ひらめき＋学帽の子、本を読む ----
def gaku():
    s = ''
    s += limb('M80,88 L82,126 Q82,136 68,134', '#fff3b0', 22) + foot(64, 136, rx=10)
    # 本を両手で持つ（一）
    s += f'<path d="M34,86 L80,96 L126,84 L126,110 L80,120 L34,112 Z" fill="#fff" {OL} stroke-width="4" stroke-linejoin="round"/><path d="M80,96 L80,120" {OL} stroke-width="3"/><g stroke="#9aa3ad" stroke-width="2" stroke-linecap="round"><path d="M42,96 L72,102 M42,104 L72,110 M88,102 L118,96 M88,110 L118,104"/></g>'
    s += hand(32, 96, 8) + hand(128, 92, 8)
    s += head(80, 64, 26) + face(80, 70, .85, 'smile')
    # 冖＝学帽（平らな板）、⺍＝ひらめきの3本
    s += f'<path d="M36,44 L124,38 L124,50 L36,54 Z" fill="#3b4a6b" {OL} stroke-width="4" stroke-linejoin="round"/><path d="M36,54 L34,62 M124,50 L126,58" {OL} stroke-width="8" stroke-linecap="round"/><path d="M36,54 L34,62 M124,50 L126,58" stroke="#3b4a6b" stroke-width="4" stroke-linecap="round"/>'
    s += f'<path d="M48,24 L58,38 M74,18 L80,34 M108,16 L98,34" {OL} stroke-width="10" stroke-linecap="round"/><path d="M48,24 L58,38 M74,18 L80,34 M108,16 L98,34" stroke="#ffcc33" stroke-width="5" stroke-linecap="round"/>'
    s += parts.prop_sparkle(40, 20, .7) + parts.prop_sparkle(120, 16, .7)
    return s

# ---- 空：雲の帽子をかぶった空色の鳥 ----
def sora():
    s = ''
    # 工＝体（上の一＝肩、丨＝胴、下の一＝しっぽの羽）
    s += f'<path d="M34,130 L128,126 L118,112 L100,118 L80,100 L60,118 L44,112 Z" fill="#8fd3ff" {OL} stroke-width="4.5" stroke-linejoin="round"/>'
    s += f'<ellipse cx="80" cy="104" rx="22" ry="26" fill="#8fd3ff" {OL} stroke-width="5"/><ellipse cx="80" cy="110" rx="12" ry="14" fill="#fff" opacity=".8"/>'
    # 八＝つばさ
    s += f'<path d="M64,62 Q40,74 36,92 Q54,84 68,70 Z" fill="#5fa8e0" {OL} stroke-width="4.5" stroke-linejoin="round"/><path d="M92,56 Q112,64 124,80 Q104,78 90,68 Z" fill="#5fa8e0" {OL} stroke-width="4.5" stroke-linejoin="round"/>'
    # 頭（宀の中）
    s += head(80, 66, 24, '#8fd3ff') + f'<path d="M80,72 L90,76 L80,80 Z" fill="#ffb347" {OL} stroke-width="2.5" stroke-linejoin="round"/>'
    s += parts.eyes_awake(70, 92, 64) + parts.cheeks(58, 102, 74)
    # 冖＝雲の帽子、丶＝太陽
    s += f'<path d="M40,50 Q44,34 60,38 Q66,24 82,30 Q96,22 106,34 Q122,32 120,50 Z" fill="#fff" {OL} stroke-width="4.5" stroke-linejoin="round"/>'
    s += f'<circle cx="80" cy="22" r="9" fill="#ffd23f" {OL} stroke-width="3.5"/><g stroke="#ffb400" stroke-width="3" stroke-linecap="round"><path d="M80,6 L80,10 M66,10 L69,13 M94,10 L91,13"/></g>'
    s += f'<path d="M40,50 L36,64 M120,50 L124,60" {OL} stroke-width="7" stroke-linecap="round"/><path d="M40,50 L36,64 M120,50 L124,60" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>'
    return s

# ---- 町：まどが4つのたてもの＋街灯 ----
def machi():
    s = ''
    # 田＝たてもの（4つの窓、上2つが目）
    s += f'<rect x="22" y="46" width="44" height="62" rx="6" fill="#ffb86b" {OL} stroke-width="5"/>'
    s += f'<path d="M22,76 L66,74 M44,48 L44,104" {OL} stroke-width="4" stroke-linecap="round"/>'
    s += f'<rect x="28" y="82" width="11" height="16" rx="2" fill="#fff6c0" {OL} stroke-width="2.5"/><rect x="49" y="82" width="11" height="16" rx="2" fill="#fff6c0" {OL} stroke-width="2.5"/>'
    s += f'<ellipse cx="34" cy="62" rx="6" ry="7" fill="#fff" {OL} stroke-width="2.5"/><ellipse cx="55" cy="62" rx="6" ry="7" fill="#fff" {OL} stroke-width="2.5"/><ellipse cx="35.5" cy="63.5" rx="3.5" ry="4.5" fill="#2a2a3a"/><ellipse cx="56.5" cy="63.5" rx="3.5" ry="4.5" fill="#2a2a3a"/><circle cx="37" cy="61" r="1.5" fill="#fff"/><circle cx="58" cy="61" r="1.5" fill="#fff"/>'
    s += f'<path d="M22,46 L44,34 L66,46 Z" fill="#e26b5a" {OL} stroke-width="4" stroke-linejoin="round"/><path d="M38,106 L50,106 L50,96 Q44,92 38,96 Z" fill="#8a6a3a" {OL} stroke-width="2.5"/>'
    s += f'<path d="M40,100 Q44,104 48,100" fill="none" {OL} stroke-width="2.5" stroke-linecap="round"/>'
    s += f'<ellipse cx="16" cy="112" rx="7" ry="4" fill="#9aa3ad" {OL} stroke-width="3"/><ellipse cx="70" cy="112" rx="7" ry="4" fill="#9aa3ad" {OL} stroke-width="3"/>'
    # 丁＝街灯（一＝かさ、亅＝柱、はねは台）。夜は光る
    s += f'<path d="M104,48 L104,110 Q104,128 90,128" fill="none" {OL} stroke-width="12" stroke-linecap="round"/><path d="M104,48 L104,110 Q104,128 90,128" fill="none" stroke="#6b7480" stroke-width="6" stroke-linecap="round"/>'
    s += f'<path d="M72,44 L136,41" {OL} stroke-width="14" stroke-linecap="round"/><path d="M72,44 L136,41" stroke="#3b4a6b" stroke-width="8" stroke-linecap="round"/>'
    s += f'<path d="M92,48 L116,47 L112,62 L96,62 Z" fill="#ffd23f" {OL} stroke-width="3" stroke-linejoin="round"/>' + parts.prop_sparkle(124, 66, .7) + parts.prop_sparkle(86, 70, .6)
    # 地面
    s += f'<path d="M8,134 L152,134" {OL} stroke-width="4" stroke-linecap="round" opacity=".5"/>'
    return s

CASES = [
 ('休', 'やすむ', '木にもたれて昼寝する子', '亻＝子（頭・左脚ノ・右脚丨）、木＝幹（丨）・枝と葉（一）・根（ノ乀）。幹に背中をあずけてzzz', yasumu()),
 ('男', 'おとこ', '野球帽の力持ちぼうや', '田＝四角い顔。よこ線＝帽子のつば、たて線＝縫い目〜鼻。力＝力こぶの右腕（㇆）と左脚（ノ）', otoko()),
 ('字', 'じ', 'おうち帽子で字を書く子', '宀＝屋根の帽子（丶＝てっぺんの玉）。子＝頭・体（㇁）・両手（一）。右手にえんぴつ', ji()),
 ('学', 'がく', 'ひらめき学帽で本を読む子', '⺍＝頭から出る3本のひらめき、冖＝平らな学帽、子＝体、一＝両手で持つ本', gaku()),
 ('空', 'そら', '雲の帽子をかぶった空色の鳥', '丶＝太陽、冖＝雲の帽子、八＝つばさ、工＝体（肩・胴・しっぽの羽）', sora()),
 ('町', 'まち', '窓が目のたてもの＋街灯', '田＝4つ窓のたてもの（上の2つが目、下は明かり）、丁＝街灯（一＝かさ、亅＝柱と台）', machi()),
]

svg = lambda inner, size: f'<svg viewBox="0 0 160 160" width="{size}" height="{size}">{inner}</svg>'
cells = ''.join(f'''
    <div style="display:flex;align-items:center;gap:8px;background:#fff;border-radius:18px;padding:6px 10px;min-height:0">
      {svg(b, 150)}
      {svg(b + overlay(k), 72)}
      <div style="display:flex;flex-direction:column;gap:3px;min-width:0;flex:1">
        <div style="display:flex;align-items:baseline;gap:8px"><div style="font-size:26px;font-weight:900;line-height:1">{k}</div><div style="font-size:12px;font-weight:900">{yomi}</div></div>
        <div style="font-size:13px;font-weight:900;line-height:1.2">{title}</div>
        <div style="font-size:10.5px;color:#6b5f4a;line-height:1.4">{desc}</div>
      </div>
    </div>''' for k, yomi, title, desc, b in CASES)
html = f'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>A-25 合体字キャラ 本命案1</title>
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
    <div style="font-size: 26px; font-weight: 900; background: #ff7a59; color: #fff; padding: 2px 14px; border-radius: 12px; white-space:nowrap">A-25</div>
    <h1 style="margin: 0; font-size: 22px; font-weight: 900; white-space:nowrap">合体字キャラ 本命案1（休男字学空町）</h1>
    <div style="font-size: 12px; font-weight: 500; color: #6b5f4a">今の意味で1体ずつ。小さい図は筆画（青）を重ねたもの</div>
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
if OUT:
    open(os.path.join(OUT, 'A25_Six1.dc.html'), 'w', encoding='utf-8').write(html)
    print('ok')
