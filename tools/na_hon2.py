# 名：口を活かす案 ／ 本：木に伏せた本を重ねる案
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import parts, six_gen as G
OUT = sys.argv[1]
OL = parts.OL
SKIN = G.SKIN; RED = G.RED
limb, hand, foot, head, face, overlay = G.limb, G.hand, G.foot, G.head, G.face, G.overlay
def txt(x, y, t, size=12, col='#2a2a3a', anchor='middle'):
    return f'<text x="{x}" y="{y}" font-size="{size}" font-weight="900" fill="{col}" font-family="Zen Maru Gothic, sans-serif" text-anchor="{anchor}">{t}</text>'

def big_mouth(x=62, y=96, w=58, h=38):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="#c0392b" {OL} stroke-width="5"/>'
            f'<rect x="{x+6}" y="{y}" width="{w-12}" height="8" rx="2" fill="#fff"/><ellipse cx="{x+w/2}" cy="{y+h-6}" rx="{w*0.3}" ry="7" fill="#ff6b8a"/>'
            f'<path d="M{x+w/2-8},{y+h-8} Q{x+w/2},{y+h-16} {x+w/2+8},{y+h-8}" fill="none" stroke="#2a2a3a" stroke-width="2" opacity=".4"/>')

# ---- 名 D：名前をよぶ大きな口の顔。夕＝顔の上半分（ノ＝前髪、㇇＝まゆ〜ほっぺ、丶＝目）、口＝大きくあけた口 ----
def namae_d():
    s = ''
    s += G.foot(70, 146, rx=10) + G.foot(104, 144, rx=10)
    s += f'<path d="M44,80 Q30,120 56,140 L120,138 Q144,118 128,78 Z" fill="{SKIN}" {OL} stroke-width="5" stroke-linejoin="round"/>'
    s += head(84, 66, 42)
    # ノ＝前髪、㇇＝まゆ〜ほっぺの線
    s += f'<path d="M48,40 Q70,18 100,24 Q124,30 128,56 Q110,36 84,38 Q62,40 48,60 Z" fill="#6b4a2b" {OL} stroke-width="4" stroke-linejoin="round"/>'
    s += f'<path d="M86,26 Q66,40 46,70" fill="none" {OL} stroke-width="10" stroke-linecap="round"/><path d="M86,26 Q66,40 46,70" fill="none" stroke="#6b4a2b" stroke-width="6" stroke-linecap="round"/>'
    s += f'<path d="M80,42 L108,38" {OL} stroke-width="5" stroke-linecap="round"/>'
    # 丶＝目（片目。もう片方はウインク）
    s += f'<ellipse cx="74" cy="68" rx="9" ry="11" fill="#fff" {OL} stroke-width="3"/><ellipse cx="76" cy="70" rx="5.5" ry="7.5" fill="#2a2a3a"/><circle cx="78" cy="66" r="2.5" fill="#fff"/>'
    s += f'<path d="M100,66 Q108,60 116,68" fill="none" {OL} stroke-width="4" stroke-linecap="round"/>'
    s += f'<ellipse cx="54" cy="84" rx="7" ry="5" fill="#ff8aa8" opacity=".75"/><ellipse cx="120" cy="84" rx="7" ry="5" fill="#ff8aa8" opacity=".75"/>'
    # 口＝大きくあけた口
    s += big_mouth(62, 94, 58, 40)
    s += txt(26, 36, 'たろー！', 13, '#3b6fd9') + f'<g stroke="#3b6fd9" stroke-width="3" stroke-linecap="round" opacity=".6"><path d="M40,50 L28,58 M42,62 L30,66"/></g>'
    return s

# ---- 名 E：口に手をそえて名前をよぶ（口を大きく下に）。夕＝手、口＝口 ----
def namae_e():
    s = ''
    s += G.foot(70, 146, rx=10) + G.foot(104, 144, rx=10)
    s += f'<path d="M44,80 Q30,120 56,140 L120,138 Q144,118 128,78 Z" fill="#8fd3ff" {OL} stroke-width="5" stroke-linejoin="round"/>'
    s += head(84, 62, 40) + f'<path d="M50,50 Q84,24 118,50 L114,42 Q84,18 54,42 Z" fill="#6b4a2b" {OL} stroke-width="3" stroke-linejoin="round"/>'
    s += parts.eyes_smile(68, 100, 58) + f'<ellipse cx="54" cy="76" rx="7" ry="5" fill="#ff8aa8" opacity=".75"/><ellipse cx="116" cy="76" rx="7" ry="5" fill="#ff8aa8" opacity=".75"/>'
    s += big_mouth(62, 94, 58, 40)
    # 夕＝口にそえた手（ノ＝親指、㇇＝手のひらの輪郭、丶＝指）
    s += limb('M112,132 Q136,110 118,80', SKIN, 16)
    s += f'<path d="M96,58 Q126,50 124,80 Q120,96 98,92 Z" fill="{SKIN}" {OL} stroke-width="4" stroke-linejoin="round"/><path d="M104,60 L112,42" {OL} stroke-width="10" stroke-linecap="round"/><path d="M104,60 L112,42" stroke="{SKIN}" stroke-width="6" stroke-linecap="round"/><circle cx="110" cy="78" r="4" fill="#2a2a3a" opacity=".3"/>'
    s += txt(26, 36, 'たろー！', 13, '#3b6fd9') + f'<g stroke="#3b6fd9" stroke-width="3" stroke-linecap="round" opacity=".6"><path d="M40,50 L28,58 M42,62 L30,66"/></g>'
    return s

# ---- 本 D：木（きーぼう）に伏せた本を重ねる。一（上）＝枝の腕、丨＝幹、ノ乀＝伏せた本の表紙、一（下）＝ページの端 ----
def hon_d():
    s = ''
    s += f'<rect x="72" y="60" width="16" height="80" rx="6" fill="#a66b35" {OL} stroke-width="5"/>'
    s += f'<path d="M36,52 L124,48" {OL} stroke-width="14" stroke-linecap="round"/><path d="M36,52 L124,48" stroke="#8b5a2b" stroke-width="8" stroke-linecap="round"/>'
    s += f'<circle cx="80" cy="34" r="30" fill="#5fcb75" {OL} stroke-width="5"/><path d="M50,34 A30,30 0 0 0 80,64 L80,4 A30,30 0 0 0 50,34 Z" fill="#000" opacity=".1"/>'
    s += parts.eyes_closed(68, 92, 32) + parts.mouth_cat(80, 44) + parts.cheeks(56, 104, 40)
    s += f'<circle cx="34" cy="52" r="8" fill="#8b5a2b" {OL} stroke-width="3.5"/><circle cx="126" cy="48" r="8" fill="#8b5a2b" {OL} stroke-width="3.5"/>'
    # 伏せた本（Λ）：ノ乀＝表紙、一（下）＝ページの端
    s += f'<path d="M78,54 L26,108 L135,103 Z" fill="#ff7a59" {OL} stroke-width="5" stroke-linejoin="round"/><path d="M78,54 L26,108 L80,106 Z" fill="#000" opacity=".1"/>'
    s += f'<path d="M40,112 L120,108 L120,100 L40,104 Z" fill="#fff" {OL} stroke-width="3.5" stroke-linejoin="round"/><g stroke="#9aa3ad" stroke-width="1.5"><path d="M42,107 L118,103 M42,110 L118,106"/></g>'
    s += f'<path d="M78,54 L78,100" stroke="#2a2a3a" stroke-width="3" stroke-linecap="round" opacity=".6"/><path d="M100,70 L104,86" stroke="#ffd23f" stroke-width="4" stroke-linecap="round"/>'
    s += txt(104, 92, 'ほん', 10, '#fff') + f'<path d="M62,82 Q64,74 70,74" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>'
    s += txt(128, 30, 'zzz', 13, '#3b6fd9')
    s += G.foot(80, 142, '#8b5a2b', 16, 5)
    return s

# ---- 本 E：伏せた本の下から木が生えている（本が屋根）。顔は本に ----
def hon_e():
    s = ''
    s += f'<rect x="72" y="20" width="16" height="120" rx="6" fill="#a66b35" {OL} stroke-width="5"/>'
    s += f'<path d="M36,52 L124,48" {OL} stroke-width="14" stroke-linecap="round"/><path d="M36,52 L124,48" stroke="#8b5a2b" stroke-width="8" stroke-linecap="round"/>'
    for cx, cy, r in ((38, 48, 12), (122, 44, 12), (80, 20, 14)):
        s += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#5fcb75" {OL} stroke-width="4"/>'
    s += f'<path d="M78,54 L26,108 L135,103 Z" fill="#ff7a59" {OL} stroke-width="5" stroke-linejoin="round"/><path d="M78,54 L26,108 L80,106 Z" fill="#000" opacity=".1"/>'
    s += f'<path d="M40,112 L120,108 L120,100 L40,104 Z" fill="#fff" {OL} stroke-width="3.5" stroke-linejoin="round"/><g stroke="#9aa3ad" stroke-width="1.5"><path d="M42,107 L118,103 M42,110 L118,106"/></g>'
    s += f'<path d="M78,54 L78,100" stroke="#2a2a3a" stroke-width="3" stroke-linecap="round" opacity=".6"/><path d="M100,70 L104,86" stroke="#ffd23f" stroke-width="4" stroke-linecap="round"/>'
    s += parts.eyes_awake(62, 100, 84) + f'<path d="M74,96 Q80,101 86,96" fill="none" {OL} stroke-width="3" stroke-linecap="round"/><ellipse cx="48" cy="96" rx="5" ry="3.5" fill="#ff8aa8" opacity=".7"/><ellipse cx="114" cy="94" rx="5" ry="3.5" fill="#ff8aa8" opacity=".7"/>'
    s += G.foot(80, 142, '#8b5a2b', 16, 5)
    return s

ROWS = [
 ('名', 'なまえ', [('D 大きな口でよぶ顔', '口＝大きくあけた口（下半分ぜんぶ）。夕＝顔の上半分：ノ＝前髪、㇇＝まゆ〜ほっぺ、丶＝目（片目はウインク）', namae_d()),
                   ('E 手をそえてよぶ', '口＝大きくあけた口、夕＝口にそえた手（ノ＝親指、㇇＝手のひら、丶＝指のかげ）', namae_e())]),
 ('本', 'ほん', [('D 木に伏せた本', 'きーぼう（一＝枝の腕、丨＝幹）が読みかけの本を伏せてひと休み。ノ乀＝伏せた本の表紙、一（下）＝ページの端', hon_d()),
                 ('E 本の屋根の木', '伏せた本が屋根、その下から幹が出ている。顔は本のほうに', hon_e())]),
]

svg = lambda inner, size: f'<svg viewBox="0 0 160 160" width="{size}" height="{size}">{inner}</svg>'
rows = ''
for k, yomi, cases in ROWS:
    cells = ''.join(f'''
      <div style="display:flex;align-items:center;gap:8px;background:#fff;border-radius:18px;padding:6px 12px;min-height:0;flex:1">
        {svg(b, 170)}{svg(b + overlay(k), 76)}
        <div style="display:flex;flex-direction:column;gap:4px;min-width:0;flex:1">
          <div style="font-size:15px;font-weight:900;line-height:1.2">{title}</div>
          <div style="font-size:11px;color:#6b5f4a;line-height:1.4">{desc}</div>
        </div>
      </div>''' for title, desc, b in cases)
    rows += f'''
    <div style="display:flex;align-items:stretch;gap:8px;flex:1;min-height:0">
      <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;width:52px"><div style="font-size:34px;font-weight:900;line-height:1">{k}</div><div style="font-size:11px;font-weight:900">{yomi}</div></div>{cells}
    </div>'''
html = f'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>A-29 名・本の別案2</title>
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
    <div style="font-size: 26px; font-weight: 900; background: #ff7a59; color: #fff; padding: 2px 14px; border-radius: 12px; white-space:nowrap">A-29</div>
    <h1 style="margin: 0; font-size: 22px; font-weight: 900; white-space:nowrap">名（口を活かす）・本（木に伏せた本）</h1>
  </div>{rows}
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
open(os.path.join(OUT, 'A29_NaHon2.dc.html'), 'w', encoding='utf-8').write(html)
print('ok')
