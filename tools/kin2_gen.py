# 「金」決定稿づくり：金ぴか蔵（案4ベース）＋吊り目＋真ん中の柱（丨）
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import parts, kin_gen as K
OUT = sys.argv[1] if len(sys.argv) > 1 else None
OL = parts.OL
GOLD = K.GOLD; GOLD2 = K.GOLD2

def eyes_niyari():
    # 目を細めてにやり（吊り目のライン）
    return (f'<path d="M40,110 L58,126" {OL} stroke-width="5" stroke-linecap="round"/><path d="M120,110 L102,126" {OL} stroke-width="5" stroke-linecap="round"/>'
            f'<path d="M72,100 Q80,106 88,100" fill="none" {OL} stroke-width="3.5" stroke-linecap="round"/>')

def eyes_tsuri(yen=True):
    # 丶(49,107)->(60,123)：左目は＼、ノ(104,103)->(91,122)：右目は／
    s = ''
    for cx, rot in ((49, -40), (111, 40)):
        s += f'<g transform="rotate({rot} {cx} 118)"><ellipse cx="{cx}" cy="118" rx="6" ry="11" fill="#fff" {OL} stroke-width="3"/>'
        if yen:
            s += f'<g fill="none" stroke="{GOLD2}" stroke-width="2.6" stroke-linecap="round"><path d="M{cx-4},112 L{cx},118 L{cx+4},112 M{cx},118 L{cx},125 M{cx-4},120 L{cx+4},120 M{cx-4},123 L{cx+4},123"/></g>'
        else:
            s += f'<ellipse cx="{cx}" cy="120" rx="4" ry="7" fill="#2a2a3a"/><circle cx="{cx+1.5}" cy="116" r="2" fill="#fff"/>'
        s += '</g>'
    return s

def pillar():
    # 丨(77,72)->(77,131)：真ん中の柱
    return f'<rect x="75" y="70" width="10" height="66" rx="3" fill="#8a6a3a" {OL} stroke-width="3.5"/><path d="M78,74 L78,132" stroke="#b58a4a" stroke-width="2.5" stroke-linecap="round"/>'

def doors(open_=False, coins=True):
    y0, y1 = 104, 134
    if not open_:
        return (f'<rect x="62" y="{y0}" width="13" height="{y1-y0}" rx="3" fill="#8a6a3a" {OL} stroke-width="3.5"/><rect x="85" y="{y0}" width="13" height="{y1-y0}" rx="3" fill="#8a6a3a" {OL} stroke-width="3.5"/>'
                f'<circle cx="72" cy="120" r="2" fill="#2a2a3a"/><circle cx="88" cy="120" r="2" fill="#2a2a3a"/>')
    s = f'<rect x="62" y="{y0}" width="36" height="{y1-y0}" rx="3" fill="#3a2a1a" {OL} stroke-width="3.5"/>'
    if coins: s += ''.join(K.coin(x, y, 5.5) for x, y in ((68, 128), (78, 130), (88, 128), (72, 118), (92, 120), (82, 120)))
    s += f'<path d="M62,{y0} L56,{y0+4} L56,{y1+3} L62,{y1} Z" fill="#8a6a3a" {OL} stroke-width="3.5" stroke-linejoin="round"/><path d="M98,{y0} L104,{y0+4} L104,{y1+3} L98,{y1} Z" fill="#8a6a3a" {OL} stroke-width="3.5" stroke-linejoin="round"/>'
    return s

def mouth_closed(): return f'<path d="M70,98 Q80,104 90,98" fill="none" {OL} stroke-width="3.5" stroke-linecap="round" opacity="0"/>'

def kura(open_=False, spill=False, yen=True, niyari=False):
    s = K.step() + K.wall(col=GOLD, lattice=False, x0=38, x1=122) + K.bands() + doors(open_) + pillar() + (eyes_niyari() if niyari else eyes_tsuri(yen)) + f'<ellipse cx="44" cy="132" rx="5" ry="3.5" fill="#ff8aa8" opacity=".7"/><ellipse cx="116" cy="132" rx="5" ry="3.5" fill="#ff8aa8" opacity=".7"/>' + K.roof(col=GOLD2)
    s += K.sparkle(30, 46, 1) + K.sparkle(132, 42, 1)
    if spill:
        s += ''.join(K.coin(x, y, 6) for x, y in ((30, 118), (22, 140), (40, 146), (120, 144), (136, 124), (134, 148)))
        s += K.sparkle(16, 100, .8) + K.sparkle(146, 104, .8) + K.sparkle(150, 136, .7)
    return s

CASES = [
 ('1', 'ふだんの姿（黒目の吊り目）', '左目＝丶（＼）、右目＝ノ（／）。外側が上がった吊り目。扉は閉じている', kura(yen=False)),
 ('2', 'なぞり終わりのごほうび', '扉がバンと開いて金貨がこぼれ、目が¥に変わる', kura(open_=True, spill=True, yen=True)),
 ('3', 'にやり顔', '目を細めて「ふふふ、たまってるぞ」。吊り目の線そのものが丶ノになる', kura(niyari=True)),
]
svg = lambda inner, size: f'<svg viewBox="0 0 160 160" width="{size}" height="{size}">{inner}</svg>'
cells = ''.join(f'''
    <div style="display:flex;flex-direction:column;align-items:center;gap:4px;background:#fff;border-radius:20px;padding:8px 12px;min-height:0">
      {svg(b, 236)}
      <div style="font-size:17px;font-weight:900;line-height:1.1;text-align:center"><span style="background:#e6b400;color:#fff;border-radius:8px;padding:0 8px;margin-right:6px">{lab}</span>{title}</div>
      <div style="font-size:11.5px;color:#6b5f4a;line-height:1.45;text-align:center">{desc}</div>
    </div>''' for lab, title, desc, b in CASES)
html = f'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>A-23 金 決定稿づくり</title>
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
    <div style="font-size: 26px; font-weight: 900; background: #e6b400; color: #fff; padding: 2px 14px; border-radius: 12px; white-space:nowrap">A-23</div>
    <h1 style="margin: 0; font-size: 22px; font-weight: 900; white-space:nowrap">「金」決定稿づくり — 金ぴか蔵</h1>
    <div style="font-size: 12.5px; font-weight: 500; color: #6b5f4a">案4ベース。吊り目（丶ノ）＋真ん中の柱（丨）</div>
  </div>
  <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; flex: 1 1 auto; min-height: 0">{cells}
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
if OUT: open(os.path.join(OUT, 'A23_Kin2.dc.html'), 'w', encoding='utf-8').write(html)
print('ok')
