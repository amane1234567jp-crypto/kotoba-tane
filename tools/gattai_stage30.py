# 合体字30字をステージ方式で：字＝部品ごとに色分けした太い字＋顔ひとつ／親キャラ・小道具は字の外
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import parts, kvgpath
from xml.dom import minidom
OUT = sys.argv[1]
KVG = os.path.join(os.path.dirname(__file__), '..', 'kvg')
OL = parts.OL
SCALE = 144/109.0; OFF = 8.0

# 部品→色（親キャラの色に合わせる）
ELCOL = {'亻': '#ffcf9e', '人': '#ffcf9e', '木': '#5fcb75', '日': '#ffd23f', '月': '#f0dc8a', '山': '#6ec46a', '夕': '#ffa552',
         '口': '#ffb3a7', '田': '#9ad36b', '目': '#7fb8ff', '立': '#8aa0ff', '子': '#ffe2a8', '火': '#ff6b3d', '土': '#b5804a',
         '大': '#ffb86b', '艹': '#5fb860', '宀': '#e26b5a', '冖': '#c7a7ff', '力': '#ffb86b', '十': '#c9a66b', '一': '#ff7a59',
         '丨': '#c9a66b', '儿': '#ffcf9e', '止': '#ffcf9e', '工': '#8fb7d9', '丁': '#8a8f99', '寸': '#ffe08a', '丆': '#ffcf9e',
         '气': '#cfe3f5', '乂': '#eeeeee', '丿': '#ff7a59', '交': '#ffcf9e', '龶': '#6ec46a', '匕': '#ff8ab0', '八': '#8fb7d9',
         '凵': '#3f8f3a', '⺍': '#ffcc33', '生': '#6ec46a', '白': '#f6f6f6', '早': None, '穴': None, '化': None, '林': None}
NAME = {'亻': 'ひと', '人': 'ひと', '木': 'き', '日': 'ひ', '月': 'つき', '山': 'やま', '夕': 'ゆう', '口': 'くち', '田': 'た', '目': 'め',
        '立': 'たつ', '子': 'こ', '火': 'ひ', '土': 'つち', '大': 'おおきい', '艹': 'くさ', '宀': 'やね', '冖': 'ぬの', '力': 'ちから',
        '十': 'じゅう', '一': 'いち', '丨': 'ぼう', '儿': 'あんよ', '止': 'あし', '工': 'どうぐ', '丁': 'くぎ', '寸': 'ものさし',
        '丆': 'て', '气': 'ゆげ', '乂': 'こめ', '丿': 'の', '交': 'まじわる', '龶': 'め', '匕': 'かわる', '八': 'はち', '凵': 'くぼみ',
        '⺍': 'ひらめき', '生': 'め', '白': 'しろ'}

def kvg_root(k):
    code = f'{ord(k):05x}'
    doc = minidom.parse(os.path.join(KVG, code + '.svg'))
    return [g for g in doc.getElementsByTagName('g') if g.getAttribute('id') == f'kvg:{code}'][0]

def strokes(ds, col, w=17):
    d = ' '.join(ds)
    return (f'<g transform="translate({OFF},{OFF}) scale({SCALE:.4f})" fill="none" stroke-linecap="round" stroke-linejoin="round">'
            f'<path d="{d}" stroke="#2a2a3a" stroke-width="{w/SCALE:.1f}"/><path d="{d}" stroke="{col}" stroke-width="{(w-7)/SCALE:.1f}"/></g>')

def face(x, y, s=1.0):
    f = parts.eyes_awake(-12, 12, 0) + parts.mouth_smile(0, 14)
    return f'<g transform="translate({x},{y}) scale({s})">{f}{parts.cheeks(-24, 24, 8)}</g>'

def kanji(k, override, fx, fy, fs):
    """override: {(element,position) or element: (color,name)}。色が決まった部品はまとめて塗る。"""
    root = kvg_root(k); out = []; legend = []
    if 'mono' in override:
        col, nm = override['mono']
        return strokes([p.getAttribute('d') for p in root.getElementsByTagName('path')], col) + face(fx, fy, fs), [(col, nm)]
    def pick(el, pos):
        for key in ((el, pos), el):
            if key in override: return override[key]
        if ELCOL.get(el): return (ELCOL[el], NAME.get(el, el))
        return None
    def walk(n, top, inherit):
        el = n.getAttribute('kvg:element'); pos = n.getAttribute('kvg:position')
        sel = None if top else pick(el, pos)
        if sel:
            out.append(strokes([p.getAttribute('d') for p in n.getElementsByTagName('path')], sel[0]))
            if sel[1] and (sel[0], sel[1]) not in legend: legend.append((sel[0], sel[1])); return
            return
        kids = [c for c in n.childNodes if c.nodeType == 1]
        loose = [c.getAttribute('d') for c in kids if c.tagName == 'path']
        if loose:
            lo = override.get('loose') if top else None
            col = (lo[0] if lo else None) or inherit or ELCOL.get(el) or '#c9a66b'
            out.append(strokes(loose, col))
            nm = lo[1] if lo else (NAME.get(el) if top else None)
            if nm and (col, nm) not in legend: legend.append((col, nm))
        for c in kids:
            if c.tagName == 'g': walk(c, False, inherit)
    walk(root, True, override.get('*', (None,))[0])
    return ''.join(out) + face(fx, fy, fs), legend

def svg(inner, size): return f'<svg viewBox="0 0 160 160" width="{size}" height="{size}">{inner}</svg>'
flip = lambda s: f'<g transform="translate(160,0) scale(-1,1)">{s}</g>'
bar = f'<path d="M20,80 L140,80" {OL} stroke-width="22" stroke-linecap="round"/><path d="M20,80 L140,80" stroke="#ff7a59" stroke-width="13" stroke-linecap="round"/>'
P = parts
W = lambda s: s.replace('#ffd23f', '#f6f6f6').replace('#ffb400', '#e8e8e8')

# 字, よみ, 親キャラ/小道具, 色の上書き, 顔(x,y,s), ひとこと
ROWS = [
 ('休', 'やすむ', [P.person('sleep'), P.tree('smile')], {}, (112, 58, .7), '人が木にもたれて休む'),
 ('明', 'あかるい', [P.sun('awake'), P.moon()], {}, (46, 82, .65), '日と月で明るい'),
 ('出', 'でる', [P.mountain('awake')], {}, (80, 100, .7), 'くぼみから山が出る'),
 ('名', 'なまえ', [P.evening(), P.mouth_char()], {}, (80, 118, .65), '夕方、口で名前を呼ぶ'),
 ('男', 'おとこ', [P.field(), P.prop_power()], {}, (80, 52, .65), '田んぼで力を出す'),
 ('見', 'みる', [P.eye_char(), P.prop_legs()], {}, (80, 56, .65), '目に足が生えて見にいく'),
 ('早', 'はやい', [P.sun('awake'), P.prop_stake()], {}, (80, 46, .65), '朝日が杭の上に出る'),
 ('草', 'くさ', [P.prop_grass_hat(), P.sun('awake', rays=False)], {}, (80, 78, .55), '早に草の帽子'),
 ('本', 'もと・ほん', [P.tree('awake'), bar], {'loose': ('#ff7a59', 'いち')}, (80, 66, .65), '木の根元に印'),
 ('村', 'むら', [P.tree('awake', arms=False), P.prop_ruler()], {}, (44, 76, .55), '木をはかって家を建てる'),
 ('字', 'じ', [P.prop_roof(), P.baby()], {}, (80, 110, .65), 'おうちで子が育つ'),
 ('音', 'おと', [P.tachan(), P.sun('open', rays=False)], {}, (80, 120, .6), '立の下の日が声を出す'),
 ('白', 'しろ', [W(P.sun('awake', rays=False))], {('', 'top'): ('#f6f6f6', 'ひかり'), '日': ('#f6f6f6', 'ひ')}, (80, 98, .65), '日のてっぺんの光'),
 ('百', 'ひゃく', [bar, W(P.sun('awake', rays=False))], {'白': ('#f6f6f6', 'しろ')}, (80, 108, .6), '白の上に一本'),
 ('右', 'みぎ', [P.prop_hand(), P.mouth_char()], {}, (96, 118, .6), '右手で口をさす'),
 ('左', 'ひだり', [flip(P.prop_hand()), P.prop_tool()], {('', 'kamae'): ('#ffcf9e', 'て')}, (96, 114, .6), '左手で道具をささえる'),
 ('中', 'なか', [P.mouth_char(), P.prop_pole()], {}, (80, 76, .65), '口のまん中に棒'),
 ('千', 'せん', [P.prop_stake()], {}, (80, 98, .6), '十に帽子をかぶせたら千'),
 ('生', 'うまれる', [P.earth(), P.prop_sprout()], {'*': ('#6ec46a',)}, (98, 82, .6), '土から芽が出る'),
 ('青', 'あお', [P.prop_sprout(), P.moon()], {}, (80, 116, .6), '芽と月＝澄んだ色'),
 ('赤', 'あか', [P.earth(), P.fire()], {('', 'bottom'): ('#ff6b3d', 'ひ')}, (80, 104, .6), '土の上で火がもえる色'),
 ('正', 'ただしい', [bar, P.prop_foot()], {}, (104, 92, .6), '線までまっすぐ足を止める'),
 ('町', 'まち', [P.field(), P.prop_nail()], {}, (44, 78, .6), '田んぼの横にくぎで区切り'),
 ('校', 'こう', [P.tree('smile', arms=False), P.person_cross()], {}, (44, 76, .55), '木のとなりで人が交わる'),
 ('空', 'そら', [P.prop_roof(), P.prop_tool()], {}, (80, 118, .6), '屋根の下を道具で掘って穴'),
 ('気', 'き', [P.prop_steam(), P.prop_bowl()], {}, (92, 100, .6), '湯気が立ちのぼる'),
 ('金', 'きん', [P.prop_roof2(), P.earth()], {('', 'top'): ('#ffd23f', 'やね'), ('', 'bottom'): ('#b5804a', 'つち')}, (80, 112, .6), '土の中に光る粒'),
 ('花', 'はな', [P.prop_grass_hat(), P.person('awake')], {}, (58, 112, .55), '草の下で人がかわって花が咲く'),
 ('学', 'がく', [P.prop_cloth(), P.baby()], {}, (80, 118, .6), '布の下で子どもがひらめく'),
 ('先', 'さき', [P.prop_foot(), P.prop_legs()], {('', 'top'): ('#6ec46a', 'め')}, (96, 52, .55), '先に歩いたほうへ'),
]

# ---- 意味の絵（A-18用：成り立ちではなく今の意味で） ----
def ic_sky():
    return (f'<rect x="12" y="20" width="136" height="120" rx="24" fill="#8fd3ff" {OL} stroke-width="5"/>'
            f'<circle cx="118" cy="52" r="16" fill="#ffd23f" {OL} stroke-width="4"/>'
            f'<g fill="#fff" {OL} stroke-width="4" stroke-linejoin="round"><path d="M34,96 a14,14 0 0 1 14,-18 a18,18 0 0 1 34,2 a12,12 0 0 1 8,16 Z"/><path d="M84,122 a10,10 0 0 1 12,-12 a14,14 0 0 1 26,2 a9,9 0 0 1 6,10 Z"/></g>')
def ic_genki():
    rays = ''.join(f'<line x1="{80+46*__import__("math").cos(a)}" y1="{70+46*__import__("math").sin(a)}" x2="{80+62*__import__("math").cos(a)}" y2="{70+62*__import__("math").sin(a)}"/>' for a in [i*0.785 for i in range(8)])
    return (f'<g stroke="#ffcc33" stroke-width="6" stroke-linecap="round">{rays}</g>'
            f'<path d="M62,66 Q46,52 36,38 M98,66 Q114,52 124,38" fill="none" {OL} stroke-width="20" stroke-linecap="round"/><path d="M62,66 Q46,52 36,38 M98,66 Q114,52 124,38" fill="none" stroke="#ffcf9e" stroke-width="12" stroke-linecap="round"/>'
            + P.person('awake'))
def ic_medal():
    return (f'<path d="M58,10 L80,70 L102,10 Z" fill="#e04a4a" {OL} stroke-width="4" stroke-linejoin="round"/><path d="M68,10 L80,44 L92,10" fill="#fff" opacity=".5"/>'
            f'<circle cx="80" cy="98" r="44" fill="#ffd23f" {OL} stroke-width="5"/><circle cx="80" cy="98" r="32" fill="none" stroke="#e6b400" stroke-width="4"/>'
            f'<polygon points="80,74 86,92 104,92 90,102 95,120 80,109 65,120 70,102 56,92 74,92" fill="#fff6c0" {OL} stroke-width="3" stroke-linejoin="round"/>'
            + P.prop_sparkle(24, 60, .9) + P.prop_sparkle(136, 70, .8))
def ic_flower():
    pet = ''.join(f'<ellipse cx="80" cy="46" rx="16" ry="26" transform="rotate({a} 80 70)" fill="#ff8ab0" {OL} stroke-width="4"/>' for a in range(0, 360, 60))
    return (f'<path d="M80,96 L80,150" {OL} stroke-width="14" stroke-linecap="round"/><path d="M80,96 L80,150" stroke="#5a9e3a" stroke-width="7" stroke-linecap="round"/>'
            f'<path d="M80,128 Q56,126 46,108 Q72,106 80,128 Z" fill="#6ec46a" {OL} stroke-width="4" stroke-linejoin="round"/><path d="M80,116 Q104,112 114,94 Q88,94 80,116 Z" fill="#6ec46a" {OL} stroke-width="4" stroke-linejoin="round"/>'
            + pet + f'<circle cx="80" cy="70" r="18" fill="#ffd23f" {OL} stroke-width="4"/>' + P.eyes_dot(74, 86, 68) + P.mouth_cat(80, 76))
def ic_school():
    win = ''.join(f'<rect x="{x}" y="{y}" width="16" height="16" rx="3" fill="#8fd3ff" {OL} stroke-width="3"/>' for x in (34, 62, 90, 118) for y in (70, 100))
    return (f'<rect x="20" y="56" width="120" height="84" rx="8" fill="#fff0c2" {OL} stroke-width="5"/><rect x="14" y="48" width="132" height="14" rx="4" fill="#9aa3ad" {OL} stroke-width="4"/>'
            f'<circle cx="80" cy="30" r="14" fill="#fff" {OL} stroke-width="4"/><path d="M80,30 L80,21 M80,30 L87,30" {OL} stroke-width="3" stroke-linecap="round"/>'
            f'<path d="M130,46 L130,8 M130,10 L152,18 L130,26" fill="#ff7a59" {OL} stroke-width="3.5" stroke-linejoin="round"/>' + win +
            f'<rect x="70" y="112" width="20" height="28" rx="3" fill="#b5804a" {OL} stroke-width="3"/>')
def ic_first():
    return (f'<path d="M8,146 L152,146" {OL} stroke-width="6" stroke-linecap="round"/>'
            f'<g transform="translate(96,0) scale(0.62)">{P.person("awake")}</g>'
            f'<g transform="translate(14,26) scale(0.62)" opacity=".55">{P.person("awake")}</g>'
            f'<path d="M140,60 L140,146" {OL} stroke-width="5" stroke-linecap="round"/><path d="M140,62 L112,72 L140,82 Z" fill="#fff" {OL} stroke-width="3" stroke-linejoin="round"/>'
            f'<path d="M126,66 L112,72 L126,78 Z M140,66 L126,70 L140,76 Z" fill="#2a2a3a"/>'
            f'<path d="M30,100 L62,100 M52,92 L62,100 L52,108" fill="none" stroke="#ff7a59" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>')

ROWS_MEAN = [
 ('空', 'そら', [ic_sky()], {'mono': ('#8fd3ff', 'そら')}, (80, 118, .6), 'あおい そら。くもが うかぶ'),
 ('気', 'き', [ic_genki()], {'mono': ('#ffb347', 'げんき')}, (92, 100, .6), 'げんき！ きもち。「げんきの き」'),
 ('金', 'きん', [ic_medal()], {'mono': ('#ffd23f', 'きん')}, (80, 112, .6), 'きんメダル。ぴかぴかの きん'),
 ('花', 'はな', [ic_flower()], {'艹': ('#5fb860', 'はっぱ'), '化': ('#ff8ab0', 'はな')}, (58, 112, .55), 'はっぱの うえに はなが さく'),
 ('学', 'がく', [ic_school()], {'mono': ('#c7a7ff', 'がっこう')}, (80, 118, .6), 'がっこうで まなぶ。「がっこうの がく」'),
 ('先', 'さき', [ic_first()], {'mono': ('#ff7a59', 'さき')}, (96, 52, .55), 'いちばん さき。せんとう！'),
]

def cell(k, yomi, chars, ov, fc, memo):
    kan, legend = kanji(k, ov, *fc)
    cs = ''.join(svg(c, 100 if len(chars) == 1 else 66) for c in chars)
    lg = ''.join(f'<span style="display:inline-flex;align-items:center;gap:3px"><span style="width:11px;height:11px;border-radius:3px;background:{c};border:2px solid #2a2a3a"></span>{n}</span>' for c, n in legend)
    return f'''
    <div style="display:flex;align-items:center;gap:6px;background:#fff;border-radius:18px;padding:4px 10px;min-height:0">
      <div style="display:flex;align-items:center">{cs}</div>
      <div style="font-size:22px;font-weight:900;color:#ff7a59;line-height:1">→</div>
      {svg(kan, 112)}
      <div style="display:flex;flex-direction:column;gap:3px;min-width:0;flex:1">
        <div style="display:flex;align-items:baseline;gap:8px"><div style="font-size:26px;font-weight:900;line-height:1">{k}</div><div style="font-size:12px;font-weight:900">{yomi}</div></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;font-size:10.5px;font-weight:700;color:#6b5f4a">{lg}</div>
        <div style="font-size:10.5px;color:#6b5f4a;line-height:1.3">{memo}</div>
      </div>
    </div>'''

def board(num, title, rows, sub='親キャラ・小道具 → 色分けした字＋顔ひとつ'):
    cells = ''.join(cell(*r) for r in rows)
    return f'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>{num} {title}</title>
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
    <div style="font-size: 26px; font-weight: 900; background: #3b6fd9; color: #fff; padding: 2px 14px; border-radius: 12px">{num}</div>
    <h1 style="margin: 0; font-size: 24px; font-weight: 900">{title}</h1>
    <div style="font-size: 12.5px; font-weight: 500; color: #6b5f4a">{sub}</div>
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
for i, (fn, num) in enumerate([('A14_Gattai1', 'A-14'), ('A15_Gattai2', 'A-15'), ('A16_Gattai3', 'A-16'), ('A17_Gattai4', 'A-17'), ('A18_Gattai5', 'A-18')]):
    rows = ROWS[i*6:(i+1)*6]
    if fn == 'A18_Gattai5':
        open(os.path.join(OUT, fn + '.dc.html'), 'w', encoding='utf-8').write(board(num, '意味で覚える字（空気金花学先）', ROWS_MEAN, '成り立ちは使わない。今の意味の絵 → 1色の字＋顔ひとつ'))
        continue
    open(os.path.join(OUT, fn + '.dc.html'), 'w', encoding='utf-8').write(board(num, f'合体字ステージ{i+1}（{"".join(r[0] for r in rows)}）', rows))
print('ok')
