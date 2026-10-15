# 合体字キャラ 本命案4・5：白百千生青赤 ／ 正校先
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import parts, six_gen as G, na_hon3 as N
OUT = sys.argv[1] if len(sys.argv) > 1 else None
OL = parts.OL
SKIN = G.SKIN; RED = G.RED
limb, hand, foot, head, face, overlay = G.limb, G.hand, G.foot, G.head, G.face, G.overlay
txt = N.txt

# ---- 白：おとうふくん。日＝白い豆腐（一＝口の線、下の一＝底）、ノ＝のっけたねぎ ----
def shiro():
    s = ''
    s += f'<rect x="42" y="62" width="76" height="76" rx="8" fill="#fffdf6" {OL} stroke-width="5"/><path d="M42,70 L42,130 Q42,138 50,138 L58,138 L58,62 L50,62 Q42,62 42,70 Z" fill="#000" opacity=".05"/>'
    s += f'<path d="M46,96 L116,93" {OL} stroke-width="3" stroke-linecap="round" opacity=".5"/>'
    s += parts.eyes_awake(66, 96, 80) + f'<path d="M70,112 Q80,120 90,112" fill="none" {OL} stroke-width="3.5" stroke-linecap="round"/><ellipse cx="52" cy="106" rx="6" ry="4" fill="#ff8aa8" opacity=".7"/><ellipse cx="110" cy="106" rx="6" ry="4" fill="#ff8aa8" opacity=".7"/>'
    # ねぎ：白い根元が左下、緑の葉が右上（ノの向き）。葉は2つに分かれる
    s += f'<g transform="rotate(-50 70 50)">'
    s += f'<rect x="40" y="43" width="34" height="14" rx="6" fill="#fffdf6" {OL} stroke-width="3.5"/><path d="M40,46 L32,42 M40,50 L31,50 M40,54 L33,58" stroke="#c9a66b" stroke-width="2" stroke-linecap="round"/>'
    s += f'<path d="M72,44 L112,40 Q120,42 112,46 L72,50 Z" fill="#6ec46a" {OL} stroke-width="3.5" stroke-linejoin="round"/><path d="M72,50 L108,54 Q116,58 106,60 L72,56 Z" fill="#5fb860" {OL} stroke-width="3.5" stroke-linejoin="round"/>'
    s += f'<path d="M74,47 L104,44" stroke="#3f8f3a" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>'
    s += '</g>'
    s += txt(132, 50, 'しろい', 10, '#9aa3ad') + txt(132, 62, 'とうふ', 10, '#9aa3ad')
    return s

# ---- 百：100てんの答案。一＝クリップボードの留め具、白＝白い紙（ノ＝めくれた角、一一＝字の線）、赤で「100」 ----
def hyaku():
    """百＝100てんのおとうふくん。白（とうふ）の頭に一＝「100てん」の板をのせてバンザイ。ノ＝うれし涙"""
    s = ''
    s += f'<rect x="48" y="62" width="64" height="74" rx="8" fill="#fffdf6" {OL} stroke-width="5"/><path d="M48,70 L48,128 Q48,136 56,136 L62,136 L62,62 L56,62 Q48,62 48,70 Z" fill="#000" opacity=".05"/>'
    s += f'<path d="M52,96 L108,93" {OL} stroke-width="3" stroke-linecap="round" opacity=".5"/>'
    # 花丸
    s += f'<circle cx="80" cy="116" r="12" fill="none" stroke="#e04a4a" stroke-width="3"/><path d="M70,110 q3,-6 6,0 q3,-6 6,0 q3,-6 6,0 q3,-6 6,0" fill="none" stroke="#e04a4a" stroke-width="2" opacity=".8"/>'
    s += parts.eyes_smile(66, 94, 80) + f'<path d="M70,86 Q80,98 90,86 Z" fill="#c0392b" {OL} stroke-width="3" stroke-linejoin="round"/><ellipse cx="54" cy="88" rx="6" ry="4" fill="#ff8aa8" opacity=".8"/><ellipse cx="106" cy="88" rx="6" ry="4" fill="#ff8aa8" opacity=".8"/>'
    # ノ＝うれし涙
    s += f'<path d="M76,40 C72,50 70,58 66,62" fill="none" stroke="#7fc8ff" {OL} stroke-width="7" stroke-linecap="round"/><path d="M76,40 C72,50 70,58 66,62" fill="none" stroke="#7fc8ff" stroke-width="3.5" stroke-linecap="round"/>'
    # 一＝「100てん」の板（頭上）
    s += f'<rect x="28" y="22" width="104" height="20" rx="6" fill="#ff7a59" {OL} stroke-width="4.5"/>' + txt(80, 37, '100てん！', 14, '#fff')
    s += parts.prop_sparkle(18, 56, .8) + parts.prop_sparkle(142, 54, .8) + parts.prop_sparkle(136, 110, .6)
    return s

# ---- 千：かかし。ノ＝麦わら帽子のつば（ななめ）、一＝両腕、丨＝柱。「1000」のふだ ----
def sen():
    s = ''
    s += f'<path d="M82,40 L82,140" {OL} stroke-width="12" stroke-linecap="round"/><path d="M82,40 L82,140" stroke="#c9a66b" stroke-width="6" stroke-linecap="round"/>'
    s += f'<path d="M26,75 L138,70" {OL} stroke-width="12" stroke-linecap="round"/><path d="M26,75 L138,70" stroke="#c9a66b" stroke-width="6" stroke-linecap="round"/>'
    s += f'<rect x="60" y="78" width="44" height="34" rx="6" fill="#8fd3ff" {OL} stroke-width="4.5"/><rect x="66" y="84" width="32" height="20" rx="3" fill="#fff" {OL} stroke-width="2.5"/>' + txt(82, 99, '1000', 10, '#2a2a3a')
    s += head(82, 52, 19) + face(82, 56, .62, 'smile')
    # 麦わら帽子：つば（楕円）＋山（ドーム）＋赤いリボン。ノの向きにななめ
    s += f'<g transform="rotate(-16 82 34)">'
    s += f'<ellipse cx="82" cy="36" rx="40" ry="10" fill="#ffd23f" {OL} stroke-width="4"/>'
    s += f'<path d="M58,36 Q58,14 82,14 Q106,14 106,36 Z" fill="#ffd23f" {OL} stroke-width="4" stroke-linejoin="round"/>'
    s += f'<path d="M58,32 L106,32 L106,36 L58,36 Z" fill="#e04a4a" {OL} stroke-width="2.5"/>'
    s += f'<g stroke="#e6b400" stroke-width="1.5" stroke-linecap="round"><path d="M48,36 L116,36 M66,22 L98,22 M62,28 L102,28"/></g>'
    s += '</g>'
    s += f'<g fill="#2a2a3a"><path d="M20,30 q4,-4 8,0 q4,-4 8,0" fill="none" stroke="#2a2a3a" stroke-width="2"/><path d="M130,44 q4,-4 8,0 q4,-4 8,0" fill="none" stroke="#2a2a3a" stroke-width="2"/><path d="M28,52 q4,-4 8,0 q4,-4 8,0" fill="none" stroke="#2a2a3a" stroke-width="2"/></g>'
    s += txt(126, 124, 'たくさん', 10, '#6b5f4a')
    return s

# ---- 生：めばえちゃん。ノ＝ひらきかけの新しい葉、一一＝葉、丨＝くきと先のつぼみ（顔）、一（下）＝土 ----
def umareru():
    s = ''
    s += f'<path d="M28,128 L132,124" {OL} stroke-width="16" stroke-linecap="round"/><path d="M28,128 L132,124" stroke="#b5804a" stroke-width="10" stroke-linecap="round"/>'
    s += f'<path d="M80,124 L80,44" {OL} stroke-width="12" stroke-linecap="round"/><path d="M80,124 L80,44" stroke="#5a9e3a" stroke-width="6" stroke-linecap="round"/>'
    for y, w in ((58, 32), (90, 34)):
        s += f'<path d="M{80-w},{y+3} Q80,{y-14} {80+w},{y-3} Q80,{y+12} {80-w},{y+3} Z" fill="#6ec46a" {OL} stroke-width="4" stroke-linejoin="round"/><path d="M{80-w+6},{y+2} L{80+w-6},{y-2}" stroke="#5a9e3a" stroke-width="2.5" stroke-linecap="round"/>'
    s += f'<path d="M50,44 Q36,56 30,80 Q48,66 56,50 Z" fill="#8fdc78" {OL} stroke-width="4" stroke-linejoin="round"/>'
    s += f'<circle cx="80" cy="34" r="18" fill="#8fdc78" {OL} stroke-width="4.5"/>' + face(80, 36, .6, 'awake')
    s += parts.prop_sparkle(112, 30, .7) + parts.prop_sparkle(46, 24, .6) + txt(126, 60, 'めが', 10, '#5a9e3a') + txt(126, 72, 'でた！', 10, '#5a9e3a')
    return s

# ---- 青：青いペンキのバケツ。龶＝立てたハケ（丨＝柄、一一＝柄の輪、広い一＝バケツのふち）、月＝バケツ（一一＝青の帯） ----
def ao():
    s = ''
    s += f'<path d="M58,82 L58,134 Q58,140 64,140 L98,140 Q104,140 104,134 L104,82 Z" fill="#5fa8e0" {OL} stroke-width="5" stroke-linejoin="round"/><path d="M58,82 L58,134 Q58,140 64,140 L80,140 L80,82 Z" fill="#000" opacity=".08"/>'
    s += f'<path d="M60,97 L102,95 M60,113 L102,111" {OL} stroke-width="4" stroke-linecap="round"/><path d="M60,97 L102,95 M60,113 L102,111" stroke="#3b6fd9" stroke-width="2" stroke-linecap="round"/>'
    s += parts.eyes_dot(72, 90, 126) + f'<path d="M78,133 Q81,136 84,133" fill="none" {OL} stroke-width="2.5" stroke-linecap="round"/>'
    s += f'<path d="M28,70 L136,64" {OL} stroke-width="14" stroke-linecap="round"/><path d="M28,70 L136,64" stroke="#3b6fd9" stroke-width="8" stroke-linecap="round"/>'
    s += f'<g fill="#3b6fd9" {OL} stroke-width="2.5"><path d="M40,72 C36,80 36,86 40,88 C44,86 44,80 40,72 Z"/><path d="M124,68 C120,76 120,82 124,84 C128,82 128,76 124,68 Z"/></g>'
    # 刷毛：木の柄（穴つき）＋金具（一一）＋毛先。バケツのふちに立てかけ、毛先に青
    s += f'<rect x="72" y="14" width="16" height="30" rx="6" fill="#c9a66b" {OL} stroke-width="4"/><circle cx="80" cy="21" r="2.5" fill="#2a2a3a"/>'
    s += f'<rect x="62" y="42" width="36" height="16" rx="3" fill="#9aa3ad" {OL} stroke-width="4"/><path d="M64,47 L96,47 M64,53 L96,53" stroke="#2a2a3a" stroke-width="2" stroke-linecap="round" opacity=".6"/>'
    s += f'<path d="M62,58 L98,58 L100,80 L60,80 Z" fill="#fff6c0" {OL} stroke-width="4" stroke-linejoin="round"/><path d="M68,60 L68,78 M76,60 L76,78 M84,60 L84,78 M92,60 L92,78" stroke="#c9a66b" stroke-width="2" stroke-linecap="round"/>'
    s += f'<path d="M60,72 L100,72 L100,80 L60,80 Z" fill="#3b6fd9" {OL} stroke-width="3" stroke-linejoin="round"/><path d="M70,80 C66,88 66,94 70,96 C74,94 74,88 70,80 Z M90,80 C86,88 86,94 90,96 C94,94 94,88 90,80 Z" fill="#3b6fd9" {OL} stroke-width="2.5"/>'
    s += txt(136, 110, 'あお', 12, '#3b6fd9')
    return s

# ---- 赤：あかだこ。土＝頭（丨＝はちまきの結び目、一＝はちまき）、広い一＝顔の下、4本＝あし ----
def aka():
    s = ''
    for d in ('M66,74 Q62,100 54,130', 'M90,70 Q94,100 84,126', 'M46,92 Q40,106 32,118', 'M112,92 Q120,104 128,118'):
        s += f'<path d="{d}" fill="none" {OL} stroke-width="14" stroke-linecap="round"/><path d="{d}" fill="none" stroke="#e04a4a" stroke-width="8" stroke-linecap="round"/>'
    for x, y in ((54, 130), (84, 126), (32, 118), (128, 118)):
        s += f'<circle cx="{x}" cy="{y}" r="4" fill="#ff8ab0" {OL} stroke-width="2"/>'
    s += f'<path d="M28,74 Q28,24 80,22 Q132,24 130,70 Q116,82 80,82 Q44,82 28,74 Z" fill="#e04a4a" {OL} stroke-width="5" stroke-linejoin="round"/>'
    s += f'<path d="M48,47 L110,42" {OL} stroke-width="11" stroke-linecap="round"/><path d="M48,47 L110,42" stroke="#fff" stroke-width="6" stroke-linecap="round"/>'
    s += f'<path d="M80,44 L80,24" {OL} stroke-width="10" stroke-linecap="round"/><path d="M80,44 L80,24" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M76,24 Q80,14 86,22" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>'
    s += parts.eyes_awake(66, 94, 60) + f'<path d="M76,72 Q80,76 84,72" fill="none" {OL} stroke-width="3" stroke-linecap="round"/><ellipse cx="46" cy="66" rx="7" ry="5" fill="#ff8aa8" opacity=".8"/><ellipse cx="114" cy="66" rx="7" ry="5" fill="#ff8aa8" opacity=".8"/>'
    s += txt(140, 36, 'あか', 12, '#e04a4a')
    return s

# ---- 正：せいかいロボ。一（上）＝頭、丨＝体、一（短）＝まるを持つ腕、丨（短）＝左足、一（下）＝台 ----
def tadashii():
    s = ''
    s += f'<path d="M28,128 L132,128" {OL} stroke-width="14" stroke-linecap="round"/><path d="M28,128 L132,128" stroke="#6b7480" stroke-width="8" stroke-linecap="round"/>'
    s += f'<path d="M48,84 L48,124" {OL} stroke-width="14" stroke-linecap="round"/><path d="M48,84 L48,124" stroke="#9aa3ad" stroke-width="8" stroke-linecap="round"/>'
    s += f'<rect x="64" y="44" width="34" height="82" rx="8" fill="#dfe6ee" {OL} stroke-width="5"/>'
    s += f'<rect x="42" y="30" width="78" height="16" rx="5" fill="#3b4a6b" {OL} stroke-width="4.5"/><circle cx="56" cy="38" r="4" fill="#8fd3ff" {OL} stroke-width="2"/><circle cx="106" cy="38" r="4" fill="#8fd3ff" {OL} stroke-width="2"/>'
    s += parts.eyes_awake(74, 88, 62) + f'<path d="M76,78 Q81,82 86,78" fill="none" {OL} stroke-width="3" stroke-linecap="round"/>'
    s += f'<path d="M98,80 L118,78" {OL} stroke-width="12" stroke-linecap="round"/><path d="M98,80 L118,78" stroke="#9aa3ad" stroke-width="6" stroke-linecap="round"/>'
    s += f'<circle cx="130" cy="74" r="14" fill="#fff" {OL} stroke-width="4"/><circle cx="130" cy="74" r="8" fill="none" stroke="#e04a4a" stroke-width="4"/>'
    s += f'<path d="M70,100 L92,100 M70,110 L92,110" stroke="#9aa3ad" stroke-width="2.5" stroke-linecap="round"/>'
    s += txt(26, 70, 'せいかい！', 11, '#e04a4a')
    return s

# ---- 校：きーぼうと校舎。木＝きーぼう、交＝校舎（丶＝旗、一＝屋根、ノ丶＝窓の目、乂＝入口の階段） ----
def kou():
    s = ''
    s += limb('M48,64 Q40,84 28,100', '#8b5a2b', 13) + G.foot(26, 103, '#8b5a2b', 9, 5)
    s += limb('M52,74 Q58,80 62,86', '#8b5a2b', 13) + G.foot(64, 89, '#8b5a2b', 9, 5)
    s += f'<rect x="42" y="56" width="13" height="78" rx="5" fill="#a66b35" {OL} stroke-width="4.5"/>'
    s += f'<path d="M24,62 L66,58" {OL} stroke-width="11" stroke-linecap="round"/><path d="M24,62 L66,58" stroke="#8b5a2b" stroke-width="6" stroke-linecap="round"/>'
    s += f'<circle cx="48" cy="38" r="22" fill="#5fcb75" {OL} stroke-width="4.5"/>' + face(48, 40, .58, 'awake')
    # 交＝校舎
    s += f'<rect x="78" y="52" width="58" height="80" rx="5" fill="#fff0c2" {OL} stroke-width="5"/>'
    s += f'<rect x="72" y="46" width="70" height="12" rx="4" fill="#9aa3ad" {OL} stroke-width="4"/>'
    s += f'<path d="M98,46 L98,22 M98,24 L114,30 L98,36" fill="#ff7a59" {OL} stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>'
    s += f'<ellipse cx="90" cy="70" rx="7" ry="8" fill="#8fd3ff" {OL} stroke-width="3"/><ellipse cx="122" cy="70" rx="7" ry="8" fill="#8fd3ff" {OL} stroke-width="3"/><ellipse cx="91" cy="72" rx="4" ry="5" fill="#2a2a3a"/><ellipse cx="123" cy="72" rx="4" ry="5" fill="#2a2a3a"/>'
    s += f'<path d="M100,90 Q106,96 112,90" fill="none" {OL} stroke-width="3" stroke-linecap="round"/>'
    s += f'<path d="M82,132 L106,100 L130,132 Z" fill="#9aa3ad" {OL} stroke-width="4" stroke-linejoin="round"/><path d="M106,100 L82,132 M106,100 L130,132" stroke="#fff" stroke-width="2" opacity=".5"/>'
    s += f'<rect x="100" y="112" width="12" height="20" rx="2" fill="#8a6a3a" {OL} stroke-width="3"/>'
    s += txt(108, 44, 'がっこう', 8, '#fff')
    return s

# ---- 先：せんとうくん。丨＝体（上に頭）、ノ＝はちまきのしっぽ、一（短）＝腕、広い一＝ゴールテープ、儿＝走るあし ----
def saki():
    s = ''
    s += limb('M70,84 Q56,108 34,134', SKIN, 16) + G.foot(30, 137, rx=10)
    s += limb('M88,82 L90,108 Q92,118 104,118 L130,120', SKIN, 16) + G.foot(134, 121, rx=10, ry=6)
    s += f'<rect x="66" y="48" width="28" height="36" rx="8" fill="#ffd23f" {OL} stroke-width="5"/>'
    s += limb('M58,52 L106,48', SKIN, 12) + hand(56, 53, 7) + hand(108, 48, 7)
    s += f'<path d="M28,78 L134,74" {OL} stroke-width="10" stroke-linecap="round"/><path d="M28,78 L134,74" stroke="#ff7a59" stroke-width="5" stroke-linecap="round"/><path d="M60,76 L70,80 L62,84 Z M100,74 L92,78 L100,82 Z" fill="#ff7a59" {OL} stroke-width="2"/>'
    s += head(80, 30, 18) + f'<path d="M64,26 L96,24" {OL} stroke-width="8" stroke-linecap="round"/><path d="M64,26 L96,24" stroke="{RED}" stroke-width="4" stroke-linecap="round"/>' + face(80, 32, .6, 'big')
    s += f'<path d="M62,30 Q50,44 42,64" fill="none" {OL} stroke-width="9" stroke-linecap="round"/><path d="M62,30 Q50,44 42,64" fill="none" stroke="{RED}" stroke-width="5" stroke-linecap="round"/>'
    s += txt(130, 44, 'いちばん', 9, '#ff7a59') + txt(130, 56, 'さき！', 11, '#ff7a59')
    return s

CASES1 = [
 ('白', 'しろ', 'おとうふくん', '日＝白い豆腐（まん中の一＝口の線、下の一＝底）、ノ＝のっけたねぎ', shiro()),
 ('百', 'ひゃく', '100てんのおとうふくん', '白＝おとうふくん（白と同じ）が、一＝「100てん！」の板を頭にのせて大よろこび。ノ＝うれし涙。白に一本たすと百', hyaku()),
 ('千', 'せん', 'かかし', 'ノ＝ななめにかぶった麦わら帽子、一＝両腕、丨＝柱。胸に「1000」のふだ、鳥がたくさん', sen()),
 ('生', 'うまれる', 'めばえちゃん', 'ノ＝ひらきかけの新しい葉、一一＝葉っぱ、丨＝くき（先がつぼみの顔）、一（下）＝土。「めが でた！」', umareru()),
 ('青', 'あお', '青いペンキのバケツ', '月＝バケツ（一一＝青の帯）、広い一＝バケツのふち、丨＝立てたハケ、一一＝ハケの柄の輪。青がたれる', ao()),
 ('赤', 'あか', 'あかだこ', '土＝頭（一＝白いはちまき、丨＝結び目）、広い一＝顔の下のふち、4本の筆画＝あし', aka()),
]
CASES2 = [
 ('正', 'ただしい', 'せいかいロボ', '一（上）＝頭、丨＝体、一（短）＝まるを持つ腕、丨（短）＝左足、一（下）＝台。「せいかい！」', tadashii()),
 ('校', 'こう', 'きーぼうと校舎', '木＝きーぼう、交＝校舎（丶＝旗、一＝屋根、ノ丶＝窓の目、乂＝入口の階段）', kou()),
 ('先', 'さき', 'せんとうくん', '丨＝体（上に頭）、ノ＝はちまきのしっぽ、一（短）＝腕、広い一＝ゴールテープ、儿＝走るあし。「いちばん さき！」', saki()),
]

svg = lambda inner, size: f'<svg viewBox="0 0 160 160" width="{size}" height="{size}">{inner}</svg>'
def board(num, title, cases, cols, big):
    cells = ''.join(f'''
    <div style="display:flex;align-items:center;gap:8px;background:#fff;border-radius:18px;padding:6px 10px;min-height:0">
      {svg(b, big)}
      {svg(b + overlay(k), int(big*0.48))}
      <div style="display:flex;flex-direction:column;gap:3px;min-width:0;flex:1">
        <div style="display:flex;align-items:baseline;gap:8px"><div style="font-size:26px;font-weight:900;line-height:1">{k}</div><div style="font-size:12px;font-weight:900">{yomi}</div></div>
        <div style="font-size:13px;font-weight:900;line-height:1.2">{t}</div>
        <div style="font-size:10.5px;color:#6b5f4a;line-height:1.4">{desc}</div>
      </div>
    </div>''' for k, yomi, t, desc, b in cases)
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
<div style="width: 880px; height: 560px; box-sizing: border-box; padding: 20px 28px; background: #fff6d6; font-family: 'Zen Maru Gothic', sans-serif; color: #2a2a3a; display: flex; flex-direction: column; gap: 8px">
  <div style="display: flex; align-items: baseline; gap: 14px">
    <div style="font-size: 26px; font-weight: 900; background: #ff7a59; color: #fff; padding: 2px 14px; border-radius: 12px; white-space:nowrap">{num}</div>
    <h1 style="margin: 0; font-size: 22px; font-weight: 900; white-space:nowrap">{title}</h1>
    <div style="font-size: 12px; font-weight: 500; color: #6b5f4a">今の意味で1体ずつ。小さい図は筆画（青）を重ねたもの</div>
  </div>
  <div style="display: grid; grid-template-columns: repeat({cols}, minmax(0, 1fr)); grid-auto-rows: 1fr; gap: 8px; flex: 1 1 auto; min-height: 0">{cells}
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
if OUT: open(os.path.join(OUT, 'A33_Six4.dc.html'), 'w', encoding='utf-8').write(board('A-33', '合体字キャラ 本命案4（白百千生青赤）', CASES1, 2, 150))
if OUT: open(os.path.join(OUT, 'A34_Six5.dc.html'), 'w', encoding='utf-8').write(board('A-34', '合体字キャラ 本命案5（正校先）', CASES2, 1, 190))
print('ok')
