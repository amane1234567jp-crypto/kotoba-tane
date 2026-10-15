# 合体字シーン生成（KanjiVG骨格版）
# KanjiVG の部品ごとの位置・大きさに親キャラをはめ込み、絵にならない部品は字の筆画そのものを色つきの太線で描く。
# これで字の形（配置・比率）は常に本物の漢字と一致する。
import sys, os, json
from xml.dom import minidom
sys.path.insert(0, os.path.dirname(__file__))
import parts, kvgpath
OUT = sys.argv[1]
KVG = os.path.join(os.path.dirname(__file__), '..', 'kvg')
OL = parts.OL
SCALE = 144/109.0; OFF = 8.0
BB = json.load(open(os.path.join(os.path.dirname(__file__), 'bbox.json')))

def white(s): return s.replace('#ffd23f', '#fffbe6').replace('#ffb400', '#f0e0a0')
DRAW = {
 'person': parts.person('awake'), 'person_sleep': parts.person('sleep'),
 'tree': parts.tree('awake'), 'tree_noarm': parts.tree('awake', arms=False), 'tree_smile': parts.tree('smile'),
 'sun': parts.sun('awake', rays=False), 'sun_open': parts.sun('open', rays=False), 'sun_white': white(parts.sun('awake', rays=False)),
 'moon': parts.moon(), 'mountain': parts.mountain('half'), 'mountain_awake': parts.mountain('awake'),
 'evening': parts.evening(), 'mouth': parts.mouth_char(), 'field': parts.field(), 'eye': parts.eye_char(),
 'tachan': parts.tachan(), 'baby': parts.baby(), 'fire': parts.fire(), 'earth': parts.earth(), 'big': parts.big_person(),
}
BB['sun_white'] = BB['sun']

# 部首→親キャラ
CHAR = {'亻': 'person', '人': 'person', '木': 'tree', '日': 'sun', '月': 'moon', '山': 'mountain', '夕': 'evening',
        '口': 'mouth', '田': 'field', '目': 'eye', '立': 'tachan', '子': 'baby', '火': 'fire', '土': 'earth', '大': 'big'}
# 筆画のまま描く部品の色
COL = {'艹': '#5fb860', '宀': '#e26b5a', '冖': '#c7a7ff', '力': '#ffcf9e', '十': '#c9a66b', '一': '#ff7a59', '丨': '#c9a66b',
       '儿': '#ffcf9e', '止': '#ffcf9e', '卜': '#ffcf9e', '工': '#9aa3ad', '丁': '#8a8f99', '亅': '#8a8f99', '寸': '#ffe08a',
       '丆': '#ffcf9e', '气': '#cfe3f5', '𠂉': '#cfe3f5', '乂': '#ffffff', '丿': '#ff7a59', '交': '#ffcf9e', '亠': '#5f6fd9',
       '父': '#ffcf9e', '龶': '#6ec46a', '匕': '#ff8ab0', '八': '#9aa3ad', '凵': '#6ec46a', '⺍': '#ffcc33', '穴': '#e26b5a',
       '生': '#6ec46a', '千': '#c9a66b'}
DEF_COL = '#c9a66b'

def kvg_root(k):
    code = f'{ord(k):05x}'
    doc = minidom.parse(os.path.join(KVG, code + '.svg'))
    return [g for g in doc.getElementsByTagName('g') if g.getAttribute('id') == f'kvg:{code}'][0]

def paths_in(n):
    return [c.getAttribute('d') for c in n.getElementsByTagName('path')]

def bbox_of(ds):
    xs = []; ys = []
    for d in ds:
        for x, y in kvgpath.flatten(d):
            xs.append(OFF + x*SCALE); ys.append(OFF + y*SCALE)
    return [min(xs), min(ys), max(xs)-min(xs), max(ys)-min(ys)]

def fit(key, tb, pad=6, rmin=0.45, rmax=2.2):
    cx0, cy0, cw, ch = BB[key]
    x, y, w, h = tb
    x -= pad; y -= pad; w += 2*pad; h += 2*pad
    sx = w/cw; sy = h/ch
    r = sx/sy
    if r > rmax: sx = sy*rmax
    if r < rmin: sx = sy*rmin
    tx = (x + w/2) - (cx0 + cw/2)*sx; ty = (y + h/2) - (cy0 + ch/2)*sy
    return f'<g transform="translate({tx:.1f},{ty:.1f}) scale({sx:.3f},{sy:.3f})">{DRAW[key]}</g>'

def strokes(ds, col, w=15):
    d = ' '.join(ds)
    s = f'<g transform="translate({OFF},{OFF}) scale({SCALE:.4f})" fill="none" stroke-linecap="round" stroke-linejoin="round">'
    s += f'<path d="{d}" stroke="#2a2a3a" stroke-width="{w/SCALE:.1f}"/><path d="{d}" stroke="{col}" stroke-width="{(w-7)/SCALE:.1f}"/></g>'
    return s

def build(k, override=None, extra='', depth_chars=None):
    """override: {element or (element,pos): drawkey or 'strokes:#color'}"""
    override = override or {}
    root = kvg_root(k)
    chars = []; lines = []
    def pick(n, el, pos):
        for key in ((el, pos), el):
            if key in override: return override[key]
        if el in CHAR: return CHAR[el]
        return None
    def walk(n, top):
        if n.nodeType != 1 or n.tagName != 'g': return
        el = n.getAttribute('kvg:element'); pos = n.getAttribute('kvg:position')
        sel = None if top else pick(n, el, pos)
        if sel and not sel.startswith('strokes'):
            key = sel
            if key == 'tree':
                tb = bbox_of(paths_in(n))
                key = 'tree' if tb[2] > 96 else 'tree_noarm'
            chars.append(fit(key, bbox_of(paths_in(n)))); return
        if sel and sel.startswith('strokes'):
            lines.append(strokes(paths_in(n), sel.split(':')[1])); return
        kids = [c for c in n.childNodes if c.nodeType == 1]
        loose = [c.getAttribute('d') for c in kids if c.tagName == 'path']
        subs = [c for c in kids if c.tagName == 'g']
        if loose:
            lines.append(strokes(loose, COL.get(el, DEF_COL)))
        for c in subs: walk(c, False)
    walk(root, True)
    return ''.join(chars) + ''.join(lines) + extra

def spark(x, y, s=1): return parts.prop_sparkle(x, y, s)
def face(x, y, s=1.0):
    return f'<g transform="translate({x},{y}) scale({s})">'+parts.eyes_dot(-12, 12, 0)+parts.cheeks(-22, 22, 8)+parts.mouth_cat(0, 10)+'</g>'
def flag(): return f'<path d="M84,16 L124,28 L84,40 Z" fill="#ff7a59" {OL} stroke-width="4" stroke-linejoin="round"/>'

S = {}
S['休'] = build('休', {'亻': 'person_sleep', '木': 'tree_smile'})
S['明'] = build('明', extra=spark(10, 20)+spark(150, 26, .8)+spark(150, 130, .7))
S['出'] = build('出', {'山': 'mountain_awake'})
S['名'] = build('名', extra=f'<path d="M138,110 Q150,104 154,92 M140,124 Q156,124 160,116" fill="none" {OL} stroke-width="3.5" stroke-linecap="round" opacity=".7"/>')
S['男'] = build('男', extra=f'<circle cx="118" cy="124" r="13" fill="#ffb86b" {OL} stroke-width="4"/><path d="M112,120 Q118,113 124,120" fill="none" {OL} stroke-width="3" stroke-linecap="round"/>')
S['見'] = build('見')
S['早'] = build('早')
S['草'] = build('草')
S['本'] = build('本', extra=spark(26, 120, .7)+spark(134, 120, .7))
S['村'] = build('村', {'木': 'tree_noarm'})
S['字'] = build('字')
S['音'] = build('音', {'日': 'sun_open'}, extra=f'<path d="M134,104 Q146,100 152,90 M136,118 Q154,118 160,110 M134,132 Q148,136 152,146" fill="none" {OL} stroke-width="3.5" stroke-linecap="round" opacity=".7"/>')
S['白'] = build('白', {('', 'top'): 'strokes:#ffffff', '日': 'sun_white'}, extra=spark(18, 30)+spark(144, 40, .8)+spark(20, 132, .7))
S['百'] = build('百', {('', 'top'): 'strokes:#ffffff', '日': 'sun_white'})
S['右'] = build('右')
S['左'] = build('左', {('', 'kamae'): 'strokes:#ffcf9e'}, extra=face(96, 106, .8))
S['中'] = build('中', extra=flag())
S['千'] = build('千', extra=face(104, 60, .8)+''.join(spark(x, y, .55) for x, y in [(20, 60), (140, 56), (24, 120), (136, 124), (46, 148), (116, 148)]))
S['生'] = build('生', {'生': 'strokes:#6ec46a'}, extra=face(100, 72, .9))
S['青'] = build('青')
S['赤'] = build('赤', {('', 'bottom'): 'strokes:#ff6b3d'}, extra=f'<path d="M80,88 C90,104 100,112 98,126 C96,138 88,144 80,144 C72,144 64,138 62,126 C60,112 70,104 80,88 Z" fill="#ffd93d" {OL} stroke-width="4" stroke-linejoin="round"/>'+face(80, 124, .7))
S['正'] = build('正', extra=face(104, 92, .8))
S['町'] = build('町')
S['校'] = build('校', {'木': 'tree_smile'})
S['空'] = build('空', extra=face(80, 110, .8))
S['気'] = build('気', extra=face(92, 104, .8))
S['金'] = build('金', {('', 'top'): 'strokes:#ffd23f', ('', 'bottom'): 'strokes:#ffcc33'}, extra=spark(50, 92, .8)+spark(110, 92, .8)+face(80, 112, .8))
S['花'] = build('花', extra=f'<g fill="#ff8ab0" {OL} stroke-width="2.5"><circle cx="128" cy="100" r="6"/><circle cx="140" cy="108" r="6"/><circle cx="130" cy="116" r="6"/></g><circle cx="134" cy="108" r="4" fill="#ffd23f"/>')
S['学'] = build('学')
S['先'] = build('先', {('', 'top'): 'strokes:#6ec46a'}, extra=face(104, 52, .75))

INFO = {
 '休': ('やすむ', 'ひとっち＋きーぼう', '人が木にもたれて昼寝。「きに もたれて、やすむ」'),
 '明': ('あかるい', 'ひーさま＋つきまる', '太陽と月が並ぶと牧場がパッと明るくなる'),
 '出': ('でる', 'やまちゃん＋凵（くぼみ）', 'くぼみから山が顔を出す。「やまが でる」'),
 '名': ('なまえ', 'ゆうこ＋くちべえ', '夕方、口で名前を呼ぶ'),
 '男': ('おとこ', 'たんぼ＋力（ちから）', '田んぼで力を出す'),
 '見': ('みる', 'めだまん＋儿（あんよ）', '目に足が生えて見にいく'),
 '早': ('はやい', 'ひーさま＋十（杭）', '朝日が杭の上に出る'),
 '草': ('くさ', '艹（草の帽子）＋早', '早に草の帽子'),
 '本': ('もと・ほん', 'きーぼう＋一（印）', '木の根元に「ここ」の印'),
 '村': ('むら', 'きーぼう＋寸（ものさし）', '木をはかって家を建てる'),
 '字': ('じ', '宀（屋根）＋こぼう', 'おうちで子が育つ＝字が増える'),
 '音': ('おと', 'たっちゃん＋ひーさま', '立の下の日が口になって声を出す'),
 '白': ('しろ', 'ノ（光）＋ひーさま', '日のてっぺんの光。白くまぶしい'),
 '百': ('ひゃく', '一＋白', '白の上に一本'),
 '右': ('みぎ', '丆（手）＋くちべえ', '右手で口をさす'),
 '左': ('ひだり', '手＋工（道具）', '左手で道具をささえる'),
 '中': ('なか', 'くちべえ＋丨（旗の棒）', '口のまん中に棒'),
 '千': ('せん', 'ノ＋十（杭）', '十に帽子をかぶせたら千'),
 '生': ('うまれる', '芽（生）', '土から芽が出る'),
 '青': ('あお', '龶（芽）＋つきまる', '芽と月＝澄んだ色'),
 '赤': ('あか', 'つっちー＋ひーくん', '土の上で大きな火が燃える色'),
 '正': ('ただしい', '一＋止（足）', '線までまっすぐ足を止める'),
 '町': ('まち', 'たんぼ＋丁（くぎ）', '田んぼの横にくぎで区切り'),
 '校': ('こう', 'きーぼう＋交', '木のとなりで人が交わる＝学校'),
 '空': ('そら', '穴（屋根と八）＋工', '屋根の下を道具で掘って穴があく'),
 '気': ('き', '气（湯気）＋乂', '湯気が立ちのぼる'),
 '金': ('きん', 'とんがり屋根＋土＋きらきら', '土の中に光る粒'),
 '花': ('はな', '艹＋ひとっち＋匕', '草の下で人がかわって花が咲く'),
 '学': ('がく', '⺍（ひらめき）＋冖（布）＋こぼう', '布の下で子どもがひらめく'),
 '先': ('さき', '龶（芽）＋儿（あんよ）', '先に歩いたほうへ'),
}

def board(num, title, sub, keys, bg='#fff6d6', badge='#ff7a59'):
    cells = ''
    for gly in keys:
        yomi, prt, desc = INFO[gly]
        cells += f'''
    <div style="display: flex; flex-direction: row; align-items: center; gap: 8px; background: #fff; border-radius: 22px; padding: 8px 10px">
      <svg viewBox="0 0 160 160" width="150" height="150" role="img" aria-label="{gly}のシーン">
        {S[gly]}
      </svg>
      <div style="display:flex;flex-direction:column;gap:2px;min-width:0"><div style="font-size: 30px; font-weight: 900; line-height: 1">{gly}</div><div style="font-size: 13px; font-weight: 900">{yomi}　<span style="font-weight:700;color:#6b5f4a">{prt}</span></div><div style="font-size: 10.5px; color: #6b5f4a">{desc}</div></div>
    </div>'''
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
<div style="width: 880px; height: 560px; box-sizing: border-box; padding: 28px 40px; background: {bg}; font-family: 'Zen Maru Gothic', sans-serif; color: #2a2a3a; display: flex; flex-direction: column; gap: 12px">
  <div style="display: flex; align-items: baseline; gap: 16px">
    <div style="font-size: 28px; font-weight: 900; background: {badge}; color: #fff; padding: 2px 14px; border-radius: 12px">{num}</div>
    <h1 style="margin: 0; font-size: 26px; font-weight: 900">{title}</h1>
    <div style="font-size: 14px; font-weight: 500; color: #6b5f4a">{sub}</div>
  </div>
  <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; flex: 1 1 auto">{cells}
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
SUB = '字の骨格（KanjiVG）に親キャラをはめ込み。配置・比率は本物の字と同じ'
for fn, num, title, keys in [
    ('A14_Gattai1', 'A-14', '合体字のシーン1', '休明出名男見'),
    ('A15_Gattai2', 'A-15', '合体字のシーン2', '早草本村字音'),
    ('A16_Gattai3', 'A-16', '合体字のシーン3', '白百右左中千'),
    ('A17_Gattai4', 'A-17', '合体字のシーン4', '生青赤正町校'),
    ('A18_Gattai5', 'A-18', '合体字のシーン5', '空気金花学先')]:
    open(os.path.join(OUT, fn + '.dc.html'), 'w', encoding='utf-8').write(board(num, title, SUB, keys))
print('ok')
