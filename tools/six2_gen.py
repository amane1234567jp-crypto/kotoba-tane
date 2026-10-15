# 合体字キャラ 本命案2：明・名・見・早・草・本
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import parts, six_gen as G
OUT = sys.argv[1] if len(sys.argv) > 1 else None
OL = parts.OL
SKIN = G.SKIN; RED = G.RED
limb, hand, foot, head, face, overlay = G.limb, G.hand, G.foot, G.head, G.face, G.overlay

# ---- 明：ひーさま＆つきまる、いっしょでピカーン ----
def akarui():
    s = ''
    s += ''.join(parts.prop_sparkle(x, y, sc) for x, y, sc in ((14, 30, .9), (148, 24, .8), (12, 120, .7), (150, 128, .7)))
    # 日＝四角いひーさま（箱、まん中の一＝口の線）
    s += G.foot(40, 112, '#ffb400', 10, 5) + G.foot(60, 112, '#ffb400', 10, 5)
    s += f'<rect x="30" y="42" width="36" height="60" rx="10" fill="#ffd23f" {OL} stroke-width="5"/>'
    s += f'<path d="M33,70 L63,68" {OL} stroke-width="3" stroke-linecap="round"/>'
    s += parts.eyes_smile(40, 56, 58) + f'<path d="M40,92 Q48,98 56,92" fill="none" {OL} stroke-width="3" stroke-linecap="round"/><ellipse cx="36" cy="84" rx="4" ry="3" fill="#ff8aa8" opacity=".7"/><ellipse cx="60" cy="84" rx="4" ry="3" fill="#ff8aa8" opacity=".7"/>'
    # 月＝つきまる（ノ＝左のななめのふち、㇆＝右のふくらみ、一一＝目）
    s += f'<path d="M86,30 L64,132 L104,130 C128,104 130,56 86,30 Z" fill="#fff0a3" {OL} stroke-width="5" stroke-linejoin="round"/>'
    s += f'<path d="M86,30 L64,132 L82,130 C104,100 108,60 86,30 Z" fill="#000" opacity=".06"/>'
    s += f'<path d="M84,62 L104,60 M82,86 L104,84" {OL} stroke-width="4" stroke-linecap="round"/><path d="M86,102 Q94,108 100,100" fill="none" {OL} stroke-width="3" stroke-linecap="round"/><ellipse cx="80" cy="96" rx="4" ry="3" fill="#ff8aa8" opacity=".7"/>'
    # 手をつなぐ
    s += f'<path d="M66,76 L74,76" {OL} stroke-width="8" stroke-linecap="round"/><path d="M66,76 L74,76" stroke="#ffd23f" stroke-width="4" stroke-linecap="round"/>'
    return s

# ---- 名：名札をつけた横顔の子 ----
def namae():
    s = ''
    # 口＝名札（体の前）
    s += G.foot(72, 140, rx=10) + G.foot(104, 138, rx=10)
    s += f'<rect x="64" y="98" width="56" height="34" rx="6" fill="#fff" {OL} stroke-width="5"/><rect x="64" y="98" width="56" height="9" fill="#ff7a59" {OL} stroke-width="0"/><path d="M64,98 L120,96" {OL} stroke-width="5" stroke-linecap="round"/>'
    s += f'<text x="92" y="126" font-size="13" font-weight="900" fill="#2a2a3a" font-family="Zen Maru Gothic, sans-serif" text-anchor="middle">なまえ</text>'
    s += f'<circle cx="92" cy="94" r="4" fill="#ffd23f" {OL} stroke-width="2.5"/>'
    # 夕＝横顔（ノ＝前髪、㇇＝おでこからあごのライン、丶＝目）。左を向いている
    s += head(76, 60, 30) + f'<path d="M48,50 Q58,30 82,28 Q98,30 104,48 Q90,40 70,44 Q56,46 48,58 Z" fill="#6b4a2b" {OL} stroke-width="4" stroke-linejoin="round"/>'
    s += f'<path d="M84,30 Q66,36 46,70" fill="none" {OL} stroke-width="9" stroke-linecap="round"/><path d="M84,30 Q66,36 46,70" fill="none" stroke="#6b4a2b" stroke-width="5" stroke-linecap="round"/>'
    s += f'<ellipse cx="68" cy="68" rx="8" ry="10" fill="#fff" {OL} stroke-width="3"/><ellipse cx="66" cy="70" rx="5" ry="6.5" fill="#2a2a3a"/><circle cx="65" cy="65" r="2" fill="#fff"/>'
    s += f'<path d="M52,82 Q58,88 64,82" fill="none" {OL} stroke-width="3" stroke-linecap="round"/><ellipse cx="60" cy="78" rx="6" ry="4" fill="#ff8aa8" opacity=".7"/><ellipse cx="100" cy="76" rx="6" ry="4" fill="#ff8aa8" opacity=".7"/>'
    s += f'<text x="20" y="48" font-size="12" font-weight="900" fill="#3b6fd9" font-family="Zen Maru Gothic, sans-serif">はーい！</text>'
    return s

# ---- 見：目玉が歩いて見にいく ----
def miru():
    s = ''
    # 儿＝あし（ノ＝左、㇟＝右で足先が右へ）
    s += limb('M62,96 Q48,116 28,134', SKIN, 18) + G.foot(24, 138, rx=11)
    s += limb('M82,92 L84,116 Q86,124 96,124 L130,122', SKIN, 18) + G.foot(134, 122, rx=11, ry=6)
    # 目＝大きな目の頭（上の一＝まぶた、下の一＝下まぶた）
    s += f'<rect x="48" y="28" width="56" height="64" rx="18" fill="#fff" {OL} stroke-width="5"/>'
    s += f'<ellipse cx="77" cy="64" rx="18" ry="17" fill="#3b6fd9"/><ellipse cx="77" cy="64" rx="10" ry="9.5" fill="#2a2a3a"/><circle cx="83" cy="58" r="4.5" fill="#fff"/><circle cx="72" cy="69" r="2" fill="#fff"/>'
    s += f'<path d="M52,47 L100,45" {OL} stroke-width="4" stroke-linecap="round"/><path d="M58,44 L56,36 M77,43 L77,34 M96,42 L98,34" {OL} stroke-width="3" stroke-linecap="round"/>'
    s += f'<path d="M52,85 L100,83" {OL} stroke-width="3.5" stroke-linecap="round" opacity=".6"/><ellipse cx="54" cy="78" rx="5" ry="3.5" fill="#ff8aa8" opacity=".7"/><ellipse cx="100" cy="78" rx="5" ry="3.5" fill="#ff8aa8" opacity=".7"/>'
    s += f'<g stroke="#2a2a3a" stroke-width="3" stroke-linecap="round" opacity=".5"><path d="M118,56 L132,54 M118,66 L134,66"/></g>'
    return s

# ---- 早：めざまし時計 ----
def hayai():
    s = ''
    # 十＝スタンド（丨＝軸、一＝台）
    s += f'<path d="M30,95 L134,92" {OL} stroke-width="14" stroke-linecap="round"/><path d="M30,95 L134,92" stroke="#6b7480" stroke-width="8" stroke-linecap="round"/>'
    s += f'<path d="M80,96 L80,136" {OL} stroke-width="12" stroke-linecap="round"/><path d="M80,96 L80,136" stroke="#6b7480" stroke-width="6" stroke-linecap="round"/>'
    s += G.foot(80, 140, '#6b7480', 20, 6)
    # 日＝時計の顔（上の一＝目の線、下の一＝口の線）。ベルは上に2つ
    s += f'<circle cx="58" cy="26" r="9" fill="#ffd23f" {OL} stroke-width="3.5"/><circle cx="102" cy="26" r="9" fill="#ffd23f" {OL} stroke-width="3.5"/>'
    s += f'<rect x="46" y="30" width="68" height="40" rx="12" fill="{RED}" {OL} stroke-width="5"/><rect x="52" y="35" width="56" height="30" rx="8" fill="#fff" {OL} stroke-width="3"/>'
    s += f'<path d="M80,50 L80,40 M80,50 L90,54" {OL} stroke-width="3" stroke-linecap="round"/><circle cx="80" cy="50" r="2.5" fill="#2a2a3a"/>'
    s += f'<path d="M60,44 Q64,38 68,44 M92,44 Q96,38 100,44" fill="none" {OL} stroke-width="3" stroke-linecap="round"/><path d="M70,58 Q80,66 90,58 Z" fill="#c0392b" {OL} stroke-width="2.5" stroke-linejoin="round"/>'
    s += f'<g stroke="#ff7a59" stroke-width="3.5" stroke-linecap="round"><path d="M34,30 L28,22 M30,40 L22,38 M126,30 L132,22 M130,40 L138,38"/></g>'
    s += f'<text x="80" y="118" font-size="13" font-weight="900" fill="#ff7a59" font-family="Zen Maru Gothic, sans-serif" text-anchor="middle">おはよー！</text>'
    return s

# ---- 草：草の王冠をかぶった四角い草っこ（早の形の体） ----
def kusa():
    s = ''
    # 十＝体（丨＝くき、一＝葉っぱの腕）
    s += f'<path d="M34,110 L130,106" {OL} stroke-width="14" stroke-linecap="round"/><path d="M34,110 L130,106" stroke="#5a9e3a" stroke-width="8" stroke-linecap="round"/>'
    s += f'<path d="M30,110 Q18,100 26,92 Q34,102 30,110 Z M134,106 Q146,96 138,88 Q130,98 134,106 Z" fill="#6ec46a" {OL} stroke-width="3.5" stroke-linejoin="round"/>'
    s += f'<path d="M81,110 L81,138" {OL} stroke-width="12" stroke-linecap="round"/><path d="M81,110 L81,138" stroke="#5a9e3a" stroke-width="6" stroke-linecap="round"/>' + G.foot(81, 142, '#8b5a2b', 16, 5)
    # 日＝四角い顔（上の一＝目、下の一＝口）
    s += f'<rect x="50" y="56" width="62" height="38" rx="12" fill="#9ad36b" {OL} stroke-width="5"/>'
    s += parts.eyes_awake(66, 96, 72) + f'<path d="M74,86 Q81,91 88,86" fill="none" {OL} stroke-width="3" stroke-linecap="round"/><ellipse cx="56" cy="84" rx="5" ry="3.5" fill="#ff8aa8" opacity=".7"/><ellipse cx="106" cy="84" rx="5" ry="3.5" fill="#ff8aa8" opacity=".7"/>'
    # 艹＝草の王冠（はなっこと同じ）
    s += f'<path d="M36,56 L36,44 L46,38 L56,44 L66,38 L76,44 L86,38 L96,44 L106,38 L116,44 L126,38 L126,56 Z" fill="#5fb860" {OL} stroke-width="4.5" stroke-linejoin="round"/><path d="M40,50 L122,50" stroke="#8fdc78" stroke-width="3" stroke-linecap="round" opacity=".9"/>'
    for cx in (62, 98):
        s += f'<path d="M{cx-8},58 L{cx-10},26 Q{cx},14 {cx+10},26 L{cx+8},58 Z" fill="#8fdc78" {OL} stroke-width="4" stroke-linejoin="round"/><path d="M{cx},54 L{cx},28" stroke="#5fb860" stroke-width="3" stroke-linecap="round"/>'
    return s

# ---- 本：しおりが立った本のキャラ ----
def hon():
    s = ''
    # ノ乀＝あし
    s += limb('M70,106 Q50,124 30,138', SKIN, 16) + G.foot(26, 140, rx=10)
    s += limb('M92,106 Q112,124 132,136', SKIN, 16) + G.foot(136, 138, rx=10)
    # 本体（上の一＝上の辺、下の一＝下の辺）、丨＝背表紙としおり
    s += f'<rect x="38" y="48" width="84" height="58" rx="6" fill="#ff7a59" {OL} stroke-width="5"/><path d="M38,48 L80,48 L80,106 L38,106 Z" fill="#000" opacity=".08"/>'
    s += f'<rect x="74" y="44" width="12" height="66" rx="3" fill="#c0392b" {OL} stroke-width="4"/>'
    s += f'<path d="M80,46 L80,22" {OL} stroke-width="9" stroke-linecap="round"/><path d="M80,46 L80,22" stroke="#ffd23f" stroke-width="5" stroke-linecap="round"/><path d="M76,24 L80,18 L84,24 Z" fill="#ffd23f" {OL} stroke-width="2.5" stroke-linejoin="round"/>'
    s += f'<path d="M52,104 L108,102" {OL} stroke-width="5" stroke-linecap="round" opacity=".5"/>'
    s += parts.eyes_awake(58, 102, 72) + f'<path d="M74,88 Q80,94 86,88" fill="none" {OL} stroke-width="3" stroke-linecap="round"/><ellipse cx="48" cy="86" rx="5" ry="3.5" fill="#ff8aa8" opacity=".7"/><ellipse cx="112" cy="86" rx="5" ry="3.5" fill="#ff8aa8" opacity=".7"/>'
    s += f'<text x="48" y="64" font-size="10" font-weight="900" fill="#fff" font-family="Zen Maru Gothic, sans-serif">ほん</text>'
    return s

CASES = [
 ('明', 'あかるい', 'ひーさま＆つきまる、いっしょでピカーン', '日＝四角いひーさま（まん中の一＝口）、月＝つきまる（ノ＝左のふち、㇆＝右のふくらみ、一一＝目）。手をつなぐと明るくなる', akarui()),
 ('名', 'なまえ', '名札をつけた横顔の子', '夕＝横顔（ノ＝前髪、㇇＝おでこ〜あご、丶＝目）、口＝胸の名札「なまえ」。よばれて「はーい！」', namae()),
 ('見', 'みる', '目玉が歩いて見にいく', '目＝大きな目の頭（上の一＝まぶた、下の一＝下まぶた）、儿＝あし（ノ＝左、㇟＝右）', miru()),
 ('早', 'はやい', 'めざまし時計', '日＝時計の顔（上の一＝目、下の一＝口）、ベルは上に2つ、十＝スタンド（丨＝軸、一＝台）。朝いちばんに「おはよー！」', hayai()),
 ('草', 'くさ', '草の王冠の草っこ', '艹＝はなっこと同じ草の王冠、早＝体（日＝四角い顔、十＝くきと葉っぱの腕）。「花」と「早」の両方とつながる', kusa()),
 ('本', 'ほん', 'しおりが立った本のキャラ', '一（上）＝本の上の辺、丨＝背表紙と上に出たしおり、一（下）＝本の下の辺、ノ乀＝あし', hon()),
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
<title>A-27 合体字キャラ 本命案2</title>
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
    <div style="font-size: 26px; font-weight: 900; background: #ff7a59; color: #fff; padding: 2px 14px; border-radius: 12px; white-space:nowrap">A-27</div>
    <h1 style="margin: 0; font-size: 22px; font-weight: 900; white-space:nowrap">合体字キャラ 本命案2（明名見早草本）</h1>
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
    open(os.path.join(OUT, 'A27_Six2.dc.html'), 'w', encoding='utf-8').write(html)
    print('ok')
