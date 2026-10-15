# 空・男：オリジナル＋別案2つずつ
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import parts, six_gen as G
OUT = sys.argv[1]
OL = parts.OL
SKIN = G.SKIN; RED = G.RED
limb, hand, foot, head, face = G.limb, G.hand, G.foot, G.head, G.face

# ---- 空 B：雲あたまの子。宀＝雲の頭（丶＝太陽）、八＝ひろげた両腕、工＝空色の体（肩・胴・足もと） ----
def sora_b():
    s = ''
    s += f'<path d="M36,130 L124,126" {OL} stroke-width="16" stroke-linecap="round"/><path d="M36,130 L124,126" stroke="#5fa8e0" stroke-width="10" stroke-linecap="round"/>'
    s += f'<rect x="64" y="92" width="32" height="34" rx="8" fill="#8fd3ff" {OL} stroke-width="5"/>'
    s += f'<path d="M48,98 L112,94" {OL} stroke-width="16" stroke-linecap="round"/><path d="M48,98 L112,94" stroke="#5fa8e0" stroke-width="10" stroke-linecap="round"/>'
    s += limb('M62,70 Q50,82 40,96', SKIN) + hand(38, 98) + limb('M98,68 Q110,80 120,94', SKIN) + hand(122, 96)
    # 雲の頭
    s += f'<path d="M34,70 Q30,46 52,44 Q56,26 80,30 Q104,24 110,44 Q130,46 126,70 Q124,86 100,86 L60,86 Q36,86 34,70 Z" fill="#fff" {OL} stroke-width="5" stroke-linejoin="round"/>'
    s += f'<circle cx="80" cy="18" r="9" fill="#ffd23f" {OL} stroke-width="3.5"/><g stroke="#ffb400" stroke-width="3" stroke-linecap="round"><path d="M80,2 L80,6 M66,6 L69,9 M94,6 L91,9"/></g>'
    s += face(80, 64, .9, 'smile')
    return s

# ---- 空 C：奴凧（やっこだこ）。丶＝頭、冖＝ひろげた袖、八＝足、工＝胴と裾。空にあがる凧 ----
def sora_c():
    s = ''
    s += f'<path d="M80,140 Q70,150 76,156 Q84,150 80,140" fill="none" stroke="#2a2a3a" stroke-width="2.5"/><path d="M80,120 L80,142" stroke="#2a2a3a" stroke-width="2"/>'
    # 工＝胴と裾
    s += f'<path d="M40,128 L120,124 L112,100 L96,104 L80,96 L64,104 L48,100 Z" fill="#5fa8e0" {OL} stroke-width="4.5" stroke-linejoin="round"/>'
    s += f'<path d="M60,100 L100,96 L96,120 L64,122 Z" fill="#3b6fd9" {OL} stroke-width="3.5" stroke-linejoin="round"/>'
    # 八＝足（袴の裾から出る）
    s += f'<path d="M66,84 Q56,96 44,110" fill="none" {OL} stroke-width="14" stroke-linecap="round"/><path d="M66,84 Q56,96 44,110" fill="none" stroke="#e8f4ff" stroke-width="8" stroke-linecap="round"/>'
    s += f'<path d="M94,84 Q104,96 118,108" fill="none" {OL} stroke-width="14" stroke-linecap="round"/><path d="M94,84 Q104,96 118,108" fill="none" stroke="#e8f4ff" stroke-width="8" stroke-linecap="round"/>'
    # 冖＝ひろげた袖（横に長い）
    s += f'<path d="M26,50 L134,46 L136,64 L112,70 L48,72 L24,66 Z" fill="{RED}" {OL} stroke-width="4.5" stroke-linejoin="round"/><path d="M26,50 L80,48 L80,71 L48,72 L24,66 Z" fill="#000" opacity=".1"/>'
    s += f'<path d="M28,52 L24,66 M132,48 L136,64" {OL} stroke-width="6" stroke-linecap="round"/>'
    # 丶＝頭
    s += head(80, 36, 18) + f'<path d="M66,30 Q80,16 94,30 L92,24 Q80,12 68,24 Z" fill="#2a2a3a"/>' + face(80, 38, .7, 'big')
    s += f'<path d="M64,68 L96,66 L94,96 L66,98 Z" fill="#fff" {OL} stroke-width="3.5" stroke-linejoin="round"/>'
    # 風
    s += f'<g fill="none" stroke="#9cc4e4" stroke-width="3.5" stroke-linecap="round"><path d="M8,30 Q20,24 30,30"/><path d="M130,20 Q142,14 152,20"/><path d="M136,104 Q148,98 156,104"/></g>'
    return s

# ---- 男 B：田んぼ柄オーバーオールの力持ち。田＝体（四角いオーバーオール）、力＝力こぶの腕と脚。頭は上に ----
def otoko_b():
    s = ''
    s += limb('M78,76 Q60,100 34,128', SKIN, 18) + foot(31, 131)
    s += limb('M40,90 L112,84 Q122,84 120,94 L112,118 Q108,130 90,128', SKIN, 18) + hand(88, 128, 9)
    s += f'<circle cx="100" cy="96" r="12" fill="#ffb86b" {OL} stroke-width="3.5"/><path d="M94,92 Q100,86 106,92" fill="none" {OL} stroke-width="2.5" stroke-linecap="round"/>'
    # 田＝オーバーオール（緑の田んぼ柄、十字のあぜ道）
    s += f'<rect x="46" y="30" width="68" height="46" rx="8" fill="#9ad36b" {OL} stroke-width="5"/>'
    s += f'<path d="M80,30 L80,76 M46,53 L114,51" stroke="#6f3f17" stroke-width="7" stroke-linecap="round"/><path d="M80,30 L80,76 M46,53 L114,51" stroke="#a66b35" stroke-width="3.5" stroke-linecap="round"/>'
    s += f'<g stroke="#5a9e3a" stroke-width="2.5" stroke-linecap="round"><path d="M54,44 L54,38 M60,44 L60,36 M100,44 L100,38 M106,44 L106,36 M54,70 L54,64 M60,70 L60,62 M100,70 L100,64 M106,70 L106,62"/></g>'
    s += f'<path d="M58,30 L58,22 M102,30 L102,22" {OL} stroke-width="8" stroke-linecap="round"/><path d="M58,30 L58,22 M102,30 L102,22" stroke="#6f3f17" stroke-width="4" stroke-linecap="round"/>'
    # 頭（小さめ、はちまき）
    s += head(80, 14, 16) + f'<path d="M64,10 L96,8" {OL} stroke-width="8" stroke-linecap="round"/><path d="M64,10 L96,8" stroke="{RED}" stroke-width="4" stroke-linecap="round"/>' + face(80, 16, .55, 'big')
    return s

# ---- 男 C：ロボットぼうや。田＝四角いロボの頭（十字のパネル線、上に目・下に口）、力＝アーム ----
def otoko_c():
    s = ''
    s += limb('M78,76 Q60,100 34,128', '#9aa3ad', 18) + foot(31, 131, '#6b7480')
    s += f'<rect x="54" y="72" width="48" height="36" rx="8" fill="#5fa8e0" {OL} stroke-width="5"/><circle cx="68" cy="90" r="5" fill="#ffd23f" {OL} stroke-width="2.5"/><circle cx="88" cy="90" r="5" fill="{RED}" {OL} stroke-width="2.5"/>'
    s += limb('M40,90 L112,84 Q122,84 120,94 L112,118 Q108,130 90,128', '#9aa3ad', 18) + f'<path d="M80,130 L92,122 L98,134 Z" fill="#9aa3ad" {OL} stroke-width="3.5" stroke-linejoin="round"/>'
    s += f'<circle cx="100" cy="96" r="11" fill="#6b7480" {OL} stroke-width="3.5"/><circle cx="100" cy="96" r="4" fill="#2a2a3a"/>'
    # 田＝ロボの頭
    s += f'<rect x="46" y="28" width="68" height="46" rx="8" fill="#dfe6ee" {OL} stroke-width="5"/>'
    s += f'<path d="M80,28 L80,74 M46,51 L114,49" {OL} stroke-width="4" stroke-linecap="round"/>'
    s += f'<rect x="54" y="34" width="20" height="12" rx="4" fill="#3b4a6b" {OL} stroke-width="2.5"/><rect x="86" y="34" width="20" height="12" rx="4" fill="#3b4a6b" {OL} stroke-width="2.5"/><circle cx="66" cy="40" r="3.5" fill="#8fd3ff"/><circle cx="98" cy="40" r="3.5" fill="#8fd3ff"/>'
    s += f'<path d="M58,62 Q70,70 76,62 M84,62 Q90,70 102,62" fill="none" {OL} stroke-width="3" stroke-linecap="round"/>'
    s += f'<path d="M80,28 L80,16" {OL} stroke-width="6" stroke-linecap="round"/><circle cx="80" cy="12" r="6" fill="{RED}" {OL} stroke-width="3"/>'
    s += parts.cheeks(52, 108, 66)
    return s

ROWS = [
 ('空', 'そら', [('A オリジナル', '雲の帽子をかぶった空色の鳥', G.sora()),
                 ('B 雲あたまの子', '宀＝雲の頭（丶＝太陽）、八＝ひろげた両腕、工＝空色の体（肩・胴・足もと）。2頭身で一番シンプル', sora_b()),
                 ('C 奴凧（やっこだこ）', '空にあがる人型の凧。丶＝頭、冖＝ひろげた袖、八＝足、工＝胴と裾。糸でつながってふわふわ', sora_c())]),
 ('男', 'おとこ', [('A オリジナル', '野球帽の力持ちぼうや', G.otoko()),
                   ('B 田んぼオーバーオール', '田＝田んぼ柄のオーバーオール（十字＝あぜ道）、力＝力こぶの腕と脚。頭は上に小さく', otoko_b()),
                   ('C ロボットぼうや', '田＝四角いロボの頭（十字＝パネルの線、上段が目・下段が口）、力＝ロボアーム', otoko_c())]),
]

svg = lambda inner, size: f'<svg viewBox="0 0 160 160" width="{size}" height="{size}">{inner}</svg>'
rows = ''
for k, yomi, cases in ROWS:
    cells = ''.join(f'''
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px;background:#fff;border-radius:18px;padding:6px 8px;min-height:0;flex:1">
        <div style="display:flex;align-items:center;gap:4px">{svg(b, 150)}{svg(b + G.overlay(k), 64)}</div>
        <div style="font-size:13px;font-weight:900;line-height:1.2;text-align:center">{title}</div>
        <div style="font-size:10px;color:#6b5f4a;line-height:1.35;text-align:center">{desc}</div>
      </div>''' for title, desc, b in cases)
    rows += f'''
    <div style="display:flex;align-items:stretch;gap:8px;flex:1;min-height:0">
      <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;width:52px"><div style="font-size:34px;font-weight:900;line-height:1">{k}</div><div style="font-size:11px;font-weight:900">{yomi}</div></div>{cells}
    </div>'''
html = f'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>A-26 空・男の別案</title>
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
    <div style="font-size: 26px; font-weight: 900; background: #ff7a59; color: #fff; padding: 2px 14px; border-radius: 12px; white-space:nowrap">A-26</div>
    <h1 style="margin: 0; font-size: 22px; font-weight: 900; white-space:nowrap">空・男 — オリジナルと別案</h1>
    <div style="font-size: 12px; font-weight: 500; color: #6b5f4a">Aは本命案1そのまま。B・Cは読み替えを変えたもの</div>
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
open(os.path.join(OUT, 'A26_SoraOtoko.dc.html'), 'w', encoding='utf-8').write(html)
print('ok')
