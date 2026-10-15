# 合体字キャラ 本命案3：出・村・音・右・左・中
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import parts, six_gen as G, na_hon3 as N
OUT = sys.argv[1] if len(sys.argv) > 1 else None
OL = parts.OL
SKIN = G.SKIN; RED = G.RED
limb, hand, foot, head, face, overlay = G.limb, G.hand, G.foot, G.head, G.face, G.overlay
txt = N.txt

# ---- 出：びっくり箱から ぴょーん ----
def deru():
    s = ''
    # 下の凵＝箱、上の凵＝ふたが上にあいたところ（2段）
    s += f'<rect x="40" y="98" width="80" height="30" rx="4" fill="#c9a66b" {OL} stroke-width="5"/><rect x="46" y="96" width="68" height="8" rx="2" fill="#5a3a1a" {OL} stroke-width="3"/>'
    s += f'<rect x="44" y="54" width="78" height="26" rx="4" fill="#ffd23f" {OL} stroke-width="5"/><rect x="50" y="52" width="66" height="8" rx="2" fill="#7a5a00" {OL} stroke-width="3"/>'
    s += f'<g stroke="#e04a4a" stroke-width="3" stroke-linecap="round"><path d="M52,62 L52,72 M112,58 L112,68"/></g>'
    # 丨＝ばね
    s += f'<path d="M80,36 L80,122" {OL} stroke-width="12" stroke-linecap="round"/><path d="M80,36 L80,122" stroke="#9aa3ad" stroke-width="6" stroke-linecap="round"/><path d="M74,46 L86,54 L74,62 L86,70 L74,78 L86,86 L74,94 L86,102 L74,110" fill="none" stroke="#2a2a3a" stroke-width="2.5" stroke-linecap="round"/>'
    # 頭（ばねの先）
    s += head(80, 28, 18) + face(80, 30, .65, 'big')
    s += f'<g stroke="#ff7a59" stroke-width="3.5" stroke-linecap="round"><path d="M50,22 L40,14 M110,22 L120,14 M44,36 L34,36 M116,36 L126,36"/></g>'
    s += txt(132, 90, 'でたー！', 11, '#ff7a59')
    return s

# ---- 村：きーぼうと「むら」の看板 ----
def mura():
    s = ''
    # 木＝きーぼう（丨＝幹、一＝枝の腕、ノ丶＝あし）
    s += limb('M56,62 Q44,84 30,104', '#8b5a2b', 14) + G.foot(28, 107, '#8b5a2b', 9, 5)
    s += limb('M60,72 Q66,80 72,90', '#8b5a2b', 14) + G.foot(74, 93, '#8b5a2b', 9, 5)
    s += f'<rect x="49" y="56" width="14" height="78" rx="5" fill="#a66b35" {OL} stroke-width="4.5"/>'
    s += f'<path d="M26,60 L74,57" {OL} stroke-width="12" stroke-linecap="round"/><path d="M26,60 L74,57" stroke="#8b5a2b" stroke-width="7" stroke-linecap="round"/>'
    s += f'<circle cx="56" cy="36" r="24" fill="#5fcb75" {OL} stroke-width="4.5"/><path d="M32,36 A24,24 0 0 0 56,60 L56,12 A24,24 0 0 0 32,36 Z" fill="#000" opacity=".1"/>'
    s += face(56, 38, .62, 'awake')
    # 寸＝看板（一＝板、亅＝柱、丶＝足もとの花）
    s += f'<path d="M116,70 L116,116 Q116,128 104,126" fill="none" {OL} stroke-width="12" stroke-linecap="round"/><path d="M116,70 L116,116 Q116,128 104,126" fill="none" stroke="#c9a66b" stroke-width="6" stroke-linecap="round"/>'
    s += f'<rect x="80" y="46" width="60" height="28" rx="5" fill="#fff6c0" {OL} stroke-width="4.5"/><path d="M84,50 L136,50 M84,70 L136,70" stroke="#c9a66b" stroke-width="2" opacity=".6"/>'
    s += txt(110, 66, 'むら', 16, '#2a2a3a')
    s += f'<g fill="#ff8ab0" {OL} stroke-width="2.5"><circle cx="92" cy="84" r="4.5"/><circle cx="99" cy="89" r="4.5"/><circle cx="92" cy="95" r="4.5"/><circle cx="85" cy="89" r="4.5"/></g><circle cx="92" cy="89" r="3.5" fill="#ffd23f" {OL} stroke-width="2"/>'
    s += f'<path d="M20,134 L140,134" {OL} stroke-width="4" stroke-linecap="round" opacity=".4"/>'
    return s

# ---- 音：うたう顔。立＝頭の上半分（丶＝アホ毛、一＝前髪、丶ノ＝閉じた目、一＝ほっぺの線）、日＝大きくあけた口 ----
def oto():
    s = ''
    s += f'<path d="M30,64 Q24,120 62,136 L98,136 Q136,120 130,64 Z" fill="{SKIN}" {OL} stroke-width="5" stroke-linejoin="round"/>'
    s += f'<ellipse cx="80" cy="60" rx="52" ry="38" fill="{SKIN}" {OL} stroke-width="5"/>'
    s += f'<path d="M30,60 Q36,30 80,26 Q124,30 130,60 Q110,44 80,44 Q50,44 30,60 Z" fill="#6b4a2b" {OL} stroke-width="4" stroke-linejoin="round"/>'
    s += f'<path d="M80,26 Q84,14 92,10" fill="none" {OL} stroke-width="5" stroke-linecap="round"/>'
    # 丶ノ＝ぎゅっと閉じた目（うれしい）
    s += f'<path d="M56,62 Q62,70 64,76 M100,58 Q96,68 90,76" fill="none" {OL} stroke-width="5" stroke-linecap="round"/>'
    s += f'<ellipse cx="38" cy="78" rx="8" ry="5" fill="#ff8aa8" opacity=".8"/><ellipse cx="122" cy="76" rx="8" ry="5" fill="#ff8aa8" opacity=".8"/>'
    # 一（広い）＝上くちびる、日＝大きくあけた口（一一＝歯と舌の線）
    s += f'<rect x="54" y="86" width="52" height="46" rx="10" fill="#c0392b" {OL} stroke-width="4.5"/><rect x="60" y="86" width="40" height="9" rx="2" fill="#fff"/><ellipse cx="80" cy="124" rx="16" ry="8" fill="#ff6b8a"/>'
    s += f'<path d="M58,106 L102,104" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>'
    s += f'<path d="M26,76 L134,70" {OL} stroke-width="6" stroke-linecap="round"/>'
    # 音符
    s += f'<g fill="#3b6fd9" {OL} stroke-width="0"><path d="M12,40 L12,18 L26,14 L26,32" fill="none" stroke="#3b6fd9" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="9" cy="41" rx="5" ry="3.5"/><ellipse cx="23" cy="33" rx="5" ry="3.5"/></g>'
    s += f'<g><path d="M144,46 L144,22" fill="none" stroke="#ff7a59" stroke-width="3.5" stroke-linecap="round"/><path d="M144,22 Q154,26 150,36" fill="none" stroke="#ff7a59" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="141" cy="47" rx="5" ry="3.5" fill="#ff7a59"/></g>'
    return s

# ---- 右：くちべえが右手で右をさす。一＝右へのばした腕、ノ＝下ろした左腕、口＝口だけのキャラ ----
def migi():
    s = ''
    s += limb('M74,42 Q58,70 42,104', SKIN, 16) + hand(40, 106, 8)
    s += limb('M30,64 L128,58', SKIN, 16)
    s += f'<circle cx="130" cy="58" r="10" fill="{SKIN}" {OL} stroke-width="3.5"/><path d="M138,56 L154,54" {OL} stroke-width="9" stroke-linecap="round"/><path d="M138,56 L154,54" stroke="{SKIN}" stroke-width="5" stroke-linecap="round"/>'
    s += N.mouth_only(66, 98, 54, 32)
    s += txt(100, 44, 'みぎ！', 13, '#ff7a59')
    return s

# ---- 左：ひだりちゃん。一＝左へのばした腕、ノ＝長い三つ編み、工＝ワンピースの体（肩・胴・すそ） ----
def hidari():
    s = ''
    s += f'<path d="M48,130 L132,126" {OL} stroke-width="14" stroke-linecap="round"/><path d="M48,130 L132,126" stroke="#ff8ab0" stroke-width="8" stroke-linecap="round"/>'
    s += f'<path d="M66,94 L112,90 L118,126 L62,130 Z" fill="#ff8ab0" {OL} stroke-width="5" stroke-linejoin="round"/>'
    s += f'<path d="M66,94 L112,90" {OL} stroke-width="12" stroke-linecap="round"/><path d="M66,94 L112,90" stroke="#ff5c9a" stroke-width="7" stroke-linecap="round"/>'
    s += f'<path d="M86,96 L88,126" stroke="#2a2a3a" stroke-width="2.5" stroke-linecap="round" opacity=".4"/>'
    # ノ＝長い三つ編み（頭から左下へ）
    s += f'<path d="M78,28 Q60,70 26,126" fill="none" {OL} stroke-width="16" stroke-linecap="round"/><path d="M78,28 Q60,70 26,126" fill="none" stroke="#6b4a2b" stroke-width="10" stroke-linecap="round"/><path d="M70,48 L62,52 M64,66 L56,70 M54,88 L46,92 M44,108 L36,112" stroke="#2a2a3a" stroke-width="2" stroke-linecap="round" opacity=".5"/>'
    s += f'<path d="M22,128 Q18,136 28,138" fill="none" stroke="#ff5c9a" stroke-width="4" stroke-linecap="round"/>'
    # 頭
    s += head(90, 40, 26) + f'<path d="M66,34 Q90,14 114,34 L110,26 Q90,8 70,26 Z" fill="#6b4a2b" {OL} stroke-width="3" stroke-linejoin="round"/>' + face(90, 44, .8, 'awake')
    # 一＝左へのばした腕（指さし）
    s += limb('M120,60 L44,60', SKIN, 15) + f'<circle cx="42" cy="60" r="9" fill="{SKIN}" {OL} stroke-width="3.5"/><path d="M36,60 L20,61" {OL} stroke-width="9" stroke-linecap="round"/><path d="M36,60 L20,61" stroke="{SKIN}" stroke-width="5" stroke-linecap="round"/>'
    s += txt(128, 84, 'ひだり！', 11, '#ff5c9a')
    return s

# ---- 中：だんごの串。口＝だんご（顔つき）、丨＝まんなかをつらぬく串 ----
def naka():
    s = ''
    s += f'<path d="M80,24 L80,140" {OL} stroke-width="12" stroke-linecap="round"/><path d="M80,24 L80,140" stroke="#c9a66b" stroke-width="6" stroke-linecap="round"/>'
    s += f'<rect x="38" y="56" width="84" height="38" rx="19" fill="#fff6e0" {OL} stroke-width="5"/><path d="M38,75 A19,19 0 0 0 57,94 L80,94 L80,56 L57,56 A19,19 0 0 0 38,75 Z" fill="#000" opacity=".06"/>'
    s += parts.eyes_awake(66, 94, 72) + f'<path d="M74,84 Q80,89 86,84" fill="none" {OL} stroke-width="3" stroke-linecap="round"/><ellipse cx="50" cy="82" rx="6" ry="4" fill="#ff8aa8" opacity=".7"/><ellipse cx="110" cy="82" rx="6" ry="4" fill="#ff8aa8" opacity=".7"/>'
    s += f'<path d="M80,24 L80,54" stroke="#c9a66b" stroke-width="6" stroke-linecap="round"/><path d="M80,96 L80,140" stroke="#c9a66b" stroke-width="6" stroke-linecap="round"/>'
    s += f'<path d="M74,28 L86,28" {OL} stroke-width="3" stroke-linecap="round"/>'
    s += txt(128, 40, 'まんなか', 11, '#8b5a2b') + f'<path d="M118,46 L96,56" fill="none" stroke="#8b5a2b" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>'
    return s

CASES = [
 ('出', 'でる', 'びっくり箱から ぴょーん', '下の凵＝箱、上の凵＝2段目の箱（ふたが上にあく）、丨＝ばね。ばねの先に顔が飛び出す。「でたー！」', deru()),
 ('村', 'むら', 'きーぼうと「むら」の看板', '木＝きーぼう（丨＝幹、一＝枝の腕、ノ丶＝あし）、寸＝看板（一＝板、亅＝柱、丶＝足もとの花）', mura()),
 ('音', 'おと', 'うたう顔', '立＝頭（丶＝アホ毛、一＝前髪、丶ノ＝ぎゅっと閉じた目、広い一＝上くちびる）、日＝大きくあけた口（一一＝歯と舌）。♪', oto()),
 ('右', 'みぎ', 'くちべえが右をさす', '一＝右へのばした腕（指さし）、ノ＝下ろした左腕、口＝口だけのキャラ（名と同じ）。「みぎ！」', migi()),
 ('左', 'ひだり', 'ひだりちゃん', '一＝左へのばした腕（指さし）、ノ＝長い三つ編み、工＝ワンピース（肩・胴・すそ）。「ひだり！」', hidari()),
 ('中', 'なか', 'だんごの串', '口＝だんご（顔つき）、丨＝まんなかをつらぬく串。「まんなかに ぐさっ」', naka()),
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
<title>A-31 合体字キャラ 本命案3</title>
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
    <div style="font-size: 26px; font-weight: 900; background: #ff7a59; color: #fff; padding: 2px 14px; border-radius: 12px; white-space:nowrap">A-31</div>
    <h1 style="margin: 0; font-size: 22px; font-weight: 900; white-space:nowrap">合体字キャラ 本命案3（出村音右左中）</h1>
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
    open(os.path.join(OUT, 'A31_Six3.dc.html'), 'w', encoding='utf-8').write(html)
    print('ok')
