# 合体字「ステージ方式」：字は色分けした太い字＋顔ひとつ、親キャラは字の外に立つ
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import parts, kvgpath
from xml.dom import minidom
OUT = sys.argv[1]
KVG = os.path.join(os.path.dirname(__file__), '..', 'kvg')
OL = parts.OL
SCALE = 144/109.0; OFF = 8.0

def kvg_root(k):
    code = f'{ord(k):05x}'
    doc = minidom.parse(os.path.join(KVG, code + '.svg'))
    return [g for g in doc.getElementsByTagName('g') if g.getAttribute('id') == f'kvg:{code}'][0]

def groups(k):
    """直下の部品グループ → [(element, position, [d...])]"""
    root = kvg_root(k)
    out = []
    for c in root.childNodes:
        if c.nodeType == 1 and c.tagName == 'g':
            out.append((c.getAttribute('kvg:element'), c.getAttribute('kvg:position'), [p.getAttribute('d') for p in c.getElementsByTagName('path')]))
    return out

def strokes(ds, col, w=22):
    d = ' '.join(ds)
    return (f'<g transform="translate({OFF},{OFF}) scale({SCALE:.4f})" fill="none" stroke-linecap="round" stroke-linejoin="round">'
            f'<path d="{d}" stroke="#2a2a3a" stroke-width="{w/SCALE:.1f}"/><path d="{d}" stroke="{col}" stroke-width="{(w-8)/SCALE:.1f}"/></g>')

def face(x, y, s=1.0, kind='awake'):
    if kind == 'smile':
        f = parts.eyes_smile(-12, 12, 0) + parts.mouth_cat(0, 8)
    else:
        f = parts.eyes_awake(-12, 12, 0) + parts.mouth_smile(0, 14)
    return f'<g transform="translate({x},{y}) scale({s})">{f}{parts.cheeks(-24, 24, 8)}</g>'

def kanji(k, cols, fx, fy, fs=0.8, fk='awake'):
    """cols: 部品index→色"""
    s = ''
    for i, (el, pos, ds) in enumerate(groups(k)):
        s += strokes(ds, cols[i])
    return s + face(fx, fy, fs, fk)

def svg(inner, size, vb=160):
    return f'<svg viewBox="0 0 {vb} {vb}" width="{size}" height="{size}">{inner}</svg>'

def bubble(text):
    return f'<div style="background:#fff;border:3px solid #2a2a3a;border-radius:14px;padding:4px 10px;font-size:13px;font-weight:900;position:relative;white-space:nowrap">{text}</div>'

ROWS = [
 # (字, 読み, 親キャラSVG列, 色分け字SVG, 色の対応, 演出メモ)
 ('休', 'やすむ',
  [svg(parts.person('sleep'), 110), svg(parts.tree('smile'), 110)],
  kanji('休', ['#ffcf9e', '#5fcb75'], 112, 58, 0.75, 'smile'),
  [('#ffcf9e', 'ひとっち'), ('#5fcb75', 'きーぼう')],
  'なぞり終わると2体が字の位置に走り込んでピカッ。「ひとが きに よりかかって、やすむ」'),
 ('赤', 'あか',
  [svg(parts.earth(), 110), svg(parts.fire(), 110)],
  kanji('赤', ['#b5804a', '#ff6b3d'], 80, 104, 0.62),
  [('#b5804a', 'つっちー'), ('#ff6b3d', 'ひーくん')],
  '土の上で火がもえる色。顔は火のほうにひとつだけ'),
 ('空', 'そら',
  [svg(parts.prop_roof(), 110), svg(parts.prop_tool(), 110)],
  kanji('空', ['#e26b5a', '#8fb7d9'], 80, 118, 0.8),
  [('#e26b5a', '屋根（穴）'), ('#8fb7d9', '工（道具）')],
  '親キャラがいない字は、小道具が横に立つだけ。字は2色＋顔ひとつでシンプルに'),
]

def row(k, yomi, chars, kan, legend, memo):
    cs = ''.join(f'<div style="display:flex;flex-direction:column;align-items:center">{c}</div>' for c in chars)
    lg = ''.join(f'<span style="display:inline-flex;align-items:center;gap:4px"><span style="width:14px;height:14px;border-radius:4px;background:{c};border:2px solid #2a2a3a"></span>{n}</span>' for c, n in legend)
    return f'''
  <div style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:22px;padding:6px 18px;flex:1 1 0;min-height:0">
    <div style="display:flex;align-items:center;gap:2px">{cs}</div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:2px"><div style="font-size:12px;font-weight:900;color:#ff7a59">がったい！</div><div style="font-size:30px;font-weight:900;color:#ff7a59;line-height:1">→</div></div>
    {svg(kan, 136)}
    <div style="display:flex;flex-direction:column;gap:4px;min-width:0;flex:1">
      <div style="display:flex;align-items:baseline;gap:10px"><div style="font-size:30px;font-weight:900;line-height:1">{k}</div><div style="font-size:14px;font-weight:900">{yomi}</div></div>
      <div style="display:flex;gap:12px;font-size:12px;font-weight:700;color:#6b5f4a">{lg}</div>
      <div style="font-size:11.5px;color:#6b5f4a;line-height:1.4">{memo}</div>
    </div>
  </div>'''

body = ''.join(row(*r) for r in ROWS)
html = f'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>A-19 合体字ステージ方式</title>
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
<div style="width: 880px; height: 560px; box-sizing: border-box; padding: 24px 40px; background: #e8f4ff; font-family: 'Zen Maru Gothic', sans-serif; color: #2a2a3a; display: flex; flex-direction: column; gap: 10px">
  <div style="display: flex; align-items: baseline; gap: 16px">
    <div style="font-size: 28px; font-weight: 900; background: #3b6fd9; color: #fff; padding: 2px 14px; border-radius: 12px">A-19</div>
    <h1 style="margin: 0; font-size: 26px; font-weight: 900">合体字のステージ方式（試作）</h1>
    <div style="font-size: 13px; font-weight: 500; color: #6b5f4a">字＝色分けした太い字＋顔ひとつ／親キャラは字の外で演じる</div>
  </div>{body}
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
open(os.path.join(OUT, 'A19_Stage.dc.html'), 'w', encoding='utf-8').write(html)
print('ok')
