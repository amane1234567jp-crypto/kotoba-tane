# 名・本：オリジナル＋別案2つ。早：首つきに修正
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import parts, six_gen as G, six2_gen as G2
OUT = sys.argv[1] if len(sys.argv) > 1 else None
OL = parts.OL
SKIN = G.SKIN; RED = G.RED
limb, hand, foot, head, face, overlay = G.limb, G.hand, G.foot, G.head, G.face, G.overlay

def txt(x, y, t, size=12, col='#2a2a3a', anchor='middle', w=900):
    return f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{w}" fill="{col}" font-family="Zen Maru Gothic, sans-serif" text-anchor="{anchor}">{t}</text>'

# ---- 名 B：名札そのものがキャラ。夕＝安全ピン、口＝札 ----
def namae_b():
    s = ''
    s += G.foot(74, 140, rx=10) + G.foot(108, 138, rx=10)
    s += f'<rect x="60" y="96" width="62" height="40" rx="7" fill="#fff" {OL} stroke-width="5"/><path d="M60,96 L122,94 L122,106 L60,108 Z" fill="#ff7a59" {OL} stroke-width="3"/>'
    s += parts.eyes_dot(80, 102, 118) + f'<path d="M86,124 Q91,129 96,124" fill="none" {OL} stroke-width="3" stroke-linecap="round"/>' + txt(91, 103, 'なまえ', 9, '#fff')
    # 夕＝安全ピン（ノ＝針、㇇＝曲がった本体、丶＝留め具）
    s += f'<path d="M82,28 Q60,40 44,66" fill="none" {OL} stroke-width="9" stroke-linecap="round"/><path d="M82,28 Q60,40 44,66" fill="none" stroke="#c0c6cf" stroke-width="5" stroke-linecap="round"/>'
    s += f'<path d="M80,42 L106,36 Q114,36 110,44 L36,106" fill="none" {OL} stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><path d="M80,42 L106,36 Q114,36 110,44 L36,106" fill="none" stroke="#c0c6cf" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'
    s += f'<circle cx="74" cy="70" r="8" fill="#6b7480" {OL} stroke-width="3.5"/><circle cx="72" cy="68" r="2.5" fill="#fff"/>'
    return s

# ---- 名 C：口に手をあてて名前をよぶ子。夕＝口にそえた手、口＝大きくあけた口 ----
def namae_c():
    s = ''
    s += G.foot(72, 140, rx=10) + G.foot(104, 138, rx=10)
    s += f'<rect x="58" y="100" width="48" height="34" rx="12" fill="#8fd3ff" {OL} stroke-width="5"/>'
    s += head(80, 52, 30) + f'<path d="M52,40 Q80,22 108,40 L104,32 Q80,16 56,32 Z" fill="#6b4a2b" {OL} stroke-width="3" stroke-linejoin="round"/>'
    s += parts.eyes_smile(66, 94, 48) + parts.cheeks(54, 106, 60)
    # 口＝大きくあけた口（四角）
    s += f'<rect x="66" y="64" width="28" height="22" rx="8" fill="#c0392b" {OL} stroke-width="3.5"/><rect x="70" y="64" width="20" height="6" rx="2" fill="#fff"/><ellipse cx="80" cy="82" rx="8" ry="4" fill="#ff6b8a"/>'
    # 夕＝口にそえた手（ノ＝親指、㇇＝手のひら、丶＝指）
    s += limb('M100,118 Q120,96 110,70', SKIN, 16)
    s += f'<path d="M96,56 Q122,52 118,76 Q114,88 96,84 Z" fill="{SKIN}" {OL} stroke-width="4" stroke-linejoin="round"/><path d="M104,58 L112,44" {OL} stroke-width="9" stroke-linecap="round"/><path d="M104,58 L112,44" stroke="{SKIN}" stroke-width="5" stroke-linecap="round"/>'
    s += txt(28, 40, 'たろー！', 13, '#3b6fd9') + f'<g stroke="#3b6fd9" stroke-width="3" stroke-linecap="round" opacity=".6"><path d="M44,56 L34,62 M46,66 L36,68"/></g>'
    return s

# ---- 本 B：ひらいて立てた本。一＝ページの上の辺、丨＝背表紙、ノ乀＝ひろがるページの裾、一＝台 ----
def hon_b():
    s = ''
    s += f'<path d="M48,108 L112,106" {OL} stroke-width="8" stroke-linecap="round"/><path d="M48,108 L112,106" stroke="#c9a66b" stroke-width="4" stroke-linecap="round"/>'
    s += f'<path d="M38,52 L80,50 L80,104 L26,108 Z" fill="#fff" {OL} stroke-width="4.5" stroke-linejoin="round"/><path d="M80,50 L122,48 L136,103 L80,104 Z" fill="#fff" {OL} stroke-width="4.5" stroke-linejoin="round"/>'
    s += f'<g stroke="#9aa3ad" stroke-width="2.2" stroke-linecap="round"><path d="M46,64 L72,63 M44,76 L72,75 M42,88 L72,87 M88,63 L114,62 M88,75 L118,74 M88,87 L122,86"/></g>'
    s += f'<path d="M80,24 L80,138" {OL} stroke-width="10" stroke-linecap="round"/><path d="M80,24 L80,138" stroke="#c0392b" stroke-width="5" stroke-linecap="round"/>'
    s += f'<path d="M76,26 L80,18 L84,26 Z" fill="#ffd23f" {OL} stroke-width="2.5" stroke-linejoin="round"/>'
    s += parts.eyes_awake(60, 102, 72) + f'<path d="M72,92 Q80,98 88,92" fill="none" {OL} stroke-width="3" stroke-linecap="round"/>'
    return s

# ---- 本 C：本を高くかかげた子。一（上）＝かかげた本、丨＝体、ノ乀＝あし、一（下）＝ベルト ----
def hon_c():
    s = ''
    s += limb('M74,96 Q56,112 30,128', SKIN, 16) + G.foot(26, 131, rx=10)
    s += limb('M86,96 Q104,112 132,126', SKIN, 16) + G.foot(136, 129, rx=10)
    s += f'<rect x="64" y="74" width="32" height="40" rx="9" fill="#5fa8e0" {OL} stroke-width="5"/>'
    s += f'<path d="M58,106 L102,104" {OL} stroke-width="9" stroke-linecap="round"/><path d="M58,106 L102,104" stroke="#ffd23f" stroke-width="5" stroke-linecap="round"/>'
    s += limb('M64,80 L44,58', SKIN, 13) + limb('M96,80 L116,56', SKIN, 13) + hand(42, 56, 7) + hand(118, 54, 7)
    s += f'<rect x="34" y="40" width="92" height="20" rx="4" fill="#ff7a59" {OL} stroke-width="4.5"/><path d="M80,40 L80,60" {OL} stroke-width="3"/>' + txt(57, 54, 'ほん', 10, '#fff')
    s += head(80, 70, 0)  # 頭は本の下に小さく
    s += f'<circle cx="80" cy="68" r="14" fill="{SKIN}" {OL} stroke-width="4"/>' + parts.eyes_dot(74, 86, 66) + f'<path d="M76,74 Q80,78 84,74" fill="none" {OL} stroke-width="2.5" stroke-linecap="round"/>'
    s += f'<path d="M78,20 L80,34 M72,22 L76,32 M88,20 L84,32" stroke="#ffcc33" stroke-width="3.5" stroke-linecap="round"/>'
    return s

# ---- 早：首つき。丨を時計の下から台を貫いて下まで ----
def hayai_neck():
    s = ''
    s += f'<path d="M80,70 L80,136" {OL} stroke-width="12" stroke-linecap="round"/><path d="M80,70 L80,136" stroke="#6b7480" stroke-width="6" stroke-linecap="round"/>'
    s += f'<path d="M30,95 L134,92" {OL} stroke-width="14" stroke-linecap="round"/><path d="M30,95 L134,92" stroke="#6b7480" stroke-width="8" stroke-linecap="round"/>'
    s += f'<path d="M80,70 L80,136" stroke="#6b7480" stroke-width="6" stroke-linecap="round"/>'
    s += G.foot(80, 140, '#6b7480', 20, 6)
    s += f'<circle cx="58" cy="26" r="9" fill="#ffd23f" {OL} stroke-width="3.5"/><circle cx="102" cy="26" r="9" fill="#ffd23f" {OL} stroke-width="3.5"/>'
    s += f'<rect x="46" y="30" width="68" height="40" rx="12" fill="{RED}" {OL} stroke-width="5"/><rect x="52" y="35" width="56" height="30" rx="8" fill="#fff" {OL} stroke-width="3"/>'
    s += f'<path d="M80,50 L80,40 M80,50 L90,54" {OL} stroke-width="3" stroke-linecap="round"/><circle cx="80" cy="50" r="2.5" fill="#2a2a3a"/>'
    s += f'<path d="M60,44 Q64,38 68,44 M92,44 Q96,38 100,44" fill="none" {OL} stroke-width="3" stroke-linecap="round"/><path d="M70,58 Q80,66 90,58 Z" fill="#c0392b" {OL} stroke-width="2.5" stroke-linejoin="round"/>'
    s += f'<g stroke="#ff7a59" stroke-width="3.5" stroke-linecap="round"><path d="M34,30 L28,22 M30,40 L22,38 M126,30 L132,22 M130,40 L138,38"/></g>'
    s += txt(118, 122, 'おはよー！', 12, '#ff7a59')
    return s

ROWS = [
 ('名', 'なまえ', [('A オリジナル', '名札をつけた横顔の子', G2.namae()),
                   ('B 名札そのもの', '夕＝安全ピン（ノ＝針、㇇＝曲がった本体、丶＝留め具）、口＝札。札に顔と「なまえ」', namae_b()),
                   ('C 名前をよぶ子', '口＝大きくあけた口、夕＝口にそえた手（ノ＝親指、㇇＝手のひら、丶＝指）。「たろー！」', namae_c())]),
 ('本', 'ほん', [('A オリジナル', 'しおりが立った本のキャラ', G2.hon()),
                 ('B ひらいて立てた本', '一（上）＝ページの上の辺、丨＝背表紙としおり、ノ乀＝ひろがるページの裾、一（下）＝台', hon_b()),
                 ('C 本をかかげた子', '一（上）＝両手でかかげた本、丨＝体、一（下）＝ベルト、ノ乀＝あし。「ほん、だいすき！」', hon_c())]),
 ('早', 'はやい', [('A オリジナル', 'めざまし時計（首なし）', G2.hayai()),
                   ('B 首つき（修正版）', '丨を時計の下から台をつらぬいて下まで。時計が柱の上にのった形', hayai_neck())]),
]

svg = lambda inner, size: f'<svg viewBox="0 0 160 160" width="{size}" height="{size}">{inner}</svg>'
rows = ''
for k, yomi, cases in ROWS:
    cells = ''.join(f'''
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px;background:#fff;border-radius:16px;padding:4px 8px;min-height:0;flex:1">
        <div style="display:flex;align-items:center;gap:4px">{svg(b, 118)}{svg(b + overlay(k), 54)}</div>
        <div style="font-size:12px;font-weight:900;line-height:1.2;text-align:center">{title}</div>
        <div style="font-size:9.5px;color:#6b5f4a;line-height:1.3;text-align:center">{desc}</div>
      </div>''' for title, desc, b in cases)
    if len(cases) == 2: cells += '<div style="flex:1"></div>'
    rows += f'''
    <div style="display:flex;align-items:stretch;gap:8px;flex:1;min-height:0">
      <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;width:48px"><div style="font-size:30px;font-weight:900;line-height:1">{k}</div><div style="font-size:10px;font-weight:900">{yomi}</div></div>{cells}
    </div>'''
html = f'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>A-28 名・本の別案、早の修正</title>
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
<div style="width: 880px; height: 560px; box-sizing: border-box; padding: 18px 28px; background: #fff6d6; font-family: 'Zen Maru Gothic', sans-serif; color: #2a2a3a; display: flex; flex-direction: column; gap: 6px">
  <div style="display: flex; align-items: baseline; gap: 14px">
    <div style="font-size: 26px; font-weight: 900; background: #ff7a59; color: #fff; padding: 2px 14px; border-radius: 12px; white-space:nowrap">A-28</div>
    <h1 style="margin: 0; font-size: 22px; font-weight: 900; white-space:nowrap">名・本の別案、早の首つき修正</h1>
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
if OUT: open(os.path.join(OUT, 'A28_NaHonHaya.dc.html'), 'w', encoding='utf-8').write(html)
print('ok')
