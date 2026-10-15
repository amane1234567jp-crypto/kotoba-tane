# 名：口だけのキャラ＋フキダシ（夕） ／ 本：木のキャラが両手で本を開いて読む（下の一＝本）
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import parts, six_gen as G
OUT = sys.argv[1] if len(sys.argv) > 1 else None
OL = parts.OL
SKIN = G.SKIN
limb, hand, foot, head, overlay = G.limb, G.hand, G.foot, G.head, G.overlay
def txt(x, y, t, size=12, col='#2a2a3a', anchor='middle'):
    return f'<text x="{x}" y="{y}" font-size="{size}" font-weight="900" fill="{col}" font-family="Zen Maru Gothic, sans-serif" text-anchor="{anchor}">{t}</text>'

def mouth_only(x=62, y=98, w=60, h=36, open_=True):
    # 口だけのキャラ（くちびる）。目も体もなし
    s = f'<rect x="{x-6}" y="{y-6}" width="{w+12}" height="{h+12}" rx="16" fill="#ffb3a7" {OL} stroke-width="5"/>'
    s += f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="#c0392b" {OL} stroke-width="4"/>'
    if open_:
        s += f'<rect x="{x+6}" y="{y}" width="{w-12}" height="9" rx="2" fill="#fff"/><ellipse cx="{x+w/2}" cy="{y+h-6}" rx="{w*0.28}" ry="7" fill="#ff6b8a"/>'
    s += f'<ellipse cx="{x-2}" cy="{y+h+2}" rx="5" ry="3.5" fill="#ff8aa8" opacity=".8"/><ellipse cx="{x+w+2}" cy="{y+h+2}" rx="5" ry="3.5" fill="#ff8aa8" opacity=".8"/>'
    return s

# ---- 名：口だけのキャラが「なまえ」とフキダシ。フキダシが夕の形 ----
def namae_f():
    s = ''
    s += mouth_only(62, 98, 60, 36)
    # フキダシ＝夕（ノ＝左上のふち、㇇＝右上〜左下へのびるしっぽ、丶＝中の文字）
    s += f'<path d="M78,24 Q108,22 112,48 Q114,74 88,80 L30,112 L58,82 Q40,76 42,54 Q46,30 78,24 Z" fill="#fff" {OL} stroke-width="5" stroke-linejoin="round"/>'
    s += txt(78, 60, 'なまえ', 15, '#3b6fd9')
    s += f'<g stroke="#3b6fd9" stroke-width="3" stroke-linecap="round" opacity=".5"><path d="M128,40 L138,36 M128,52 L140,52"/></g>'
    return s

def namae_g():
    # 別パターン：フキダシに「たろう」と名前そのもの
    s = mouth_only(62, 98, 60, 36)
    s += f'<path d="M78,24 Q108,22 112,48 Q114,74 88,80 L30,112 L58,82 Q40,76 42,54 Q46,30 78,24 Z" fill="#fff" {OL} stroke-width="5" stroke-linejoin="round"/>'
    s += txt(78, 60, 'たろう', 15, '#ff7a59')
    return s

# ---- 本：きーぼうが両手で本を開いて読む。ノ乀＝両腕、一（下）＝ひらいた本、丨＝幹、一（上）＝枝 ----
def hon_f(flutter=True):
    s = ''
    s += f'<rect x="72" y="60" width="16" height="78" rx="6" fill="#a66b35" {OL} stroke-width="5"/>' + G.foot(80, 142, '#8b5a2b', 16, 5)
    s += f'<path d="M36,62 L124,58" {OL} stroke-width="14" stroke-linecap="round"/><path d="M36,62 L124,58" stroke="#8b5a2b" stroke-width="8" stroke-linecap="round"/>'
    s += f'<circle cx="80" cy="34" r="30" fill="#5fcb75" {OL} stroke-width="5"/><path d="M50,34 A30,30 0 0 0 80,64 L80,4 A30,30 0 0 0 50,34 Z" fill="#000" opacity=".1"/>'
    # 目は本を見おろす
    s += f'<ellipse cx="68" cy="36" rx="8" ry="10" fill="#fff" {OL} stroke-width="3"/><ellipse cx="92" cy="36" rx="8" ry="10" fill="#fff" {OL} stroke-width="3"/><ellipse cx="68" cy="41" rx="5" ry="6" fill="#2a2a3a"/><ellipse cx="92" cy="41" rx="5" ry="6" fill="#2a2a3a"/>'
    s += f'<path d="M74,52 Q80,57 86,52" fill="none" {OL} stroke-width="3" stroke-linecap="round"/>' + parts.cheeks(56, 104, 46)
    # 腕（ノ乀）：枝のつけ根から本の両はしへ
    s += f'<path d="M72,64 Q50,84 30,104" fill="none" {OL} stroke-width="16" stroke-linecap="round"/><path d="M72,64 Q50,84 30,104" fill="none" stroke="#8b5a2b" stroke-width="9" stroke-linecap="round"/>'
    s += f'<path d="M88,64 Q110,84 130,102" fill="none" {OL} stroke-width="16" stroke-linecap="round"/><path d="M88,64 Q110,84 130,102" fill="none" stroke="#8b5a2b" stroke-width="9" stroke-linecap="round"/>'
    # ひらいた本（一）：両手で持つ
    s += f'<path d="M30,100 Q55,92 80,100 Q105,92 130,100 L130,114 Q105,106 80,114 Q55,106 30,114 Z" fill="#fff" {OL} stroke-width="4.5" stroke-linejoin="round"/><path d="M80,100 L80,114" {OL} stroke-width="3"/>'
    s += f'<path d="M30,114 Q55,106 80,114 Q105,106 130,114 L130,118 Q105,110 80,118 Q55,110 30,118 Z" fill="#ff7a59" {OL} stroke-width="3" stroke-linejoin="round"/>'
    if flutter:
        s += f'<g fill="#fff" {OL} stroke-width="3" stroke-linejoin="round"><path d="M80,100 Q62,94 54,78 Q70,84 80,100 Z"/><path d="M80,100 Q74,86 76,74 Q84,86 80,100 Z"/><path d="M80,100 Q98,94 106,80 Q92,86 80,100 Z"/></g>'
    s += hand(28, 106, 9, '#8b5a2b') + hand(132, 104, 9, '#8b5a2b')
    return s

ROWS = [
 ('名', 'なまえ', [('F 口だけのキャラ＋フキダシ「なまえ」', '口＝口だけのキャラ（体も目もなし）。夕＝フキダシ（ノ＝左上のふち、㇇＝右から左下へのびるしっぽ、丶＝中の文字）', namae_f()),
                   ('G 同じ形で、中身が名前', 'フキダシの中を実際の名前に（お子さんの名前を入れる想定）', namae_g())]),
 ('本', 'ほん', [('F きーぼうが本を読む', 'きーぼう（丨＝幹、一（上）＝枝）が両腕（ノ乀）で本を開いて読む。一（下）＝ひらいた本、ページがパラパラ', hon_f()),
                 ('G パラパラなし', '同じ形で、ページのめくれをなくした落ち着いた版', hon_f(flutter=False))]),
]

svg = lambda inner, size: f'<svg viewBox="0 0 160 160" width="{size}" height="{size}">{inner}</svg>'
rows = ''
for k, yomi, cases in ROWS:
    cells = ''.join(f'''
      <div style="display:flex;align-items:center;gap:8px;background:#fff;border-radius:18px;padding:6px 12px;min-height:0;flex:1">
        {svg(b, 170)}{svg(b + overlay(k), 76)}
        <div style="display:flex;flex-direction:column;gap:4px;min-width:0;flex:1">
          <div style="font-size:14px;font-weight:900;line-height:1.2">{title}</div>
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
<title>A-30 名・本の別案3</title>
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
    <div style="font-size: 26px; font-weight: 900; background: #ff7a59; color: #fff; padding: 2px 14px; border-radius: 12px; white-space:nowrap">A-30</div>
    <h1 style="margin: 0; font-size: 22px; font-weight: 900; white-space:nowrap">名（口＋フキダシ）・本（きーぼうが本を読む）</h1>
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
if OUT:
    open(os.path.join(OUT, 'A30_NaHon3.dc.html'), 'w', encoding='utf-8').write(html)
    print('ok')
