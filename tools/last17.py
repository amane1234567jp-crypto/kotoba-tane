# 残り17字：一〜十・上・下・入・年・円・文・小
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
sys_argv = sys.argv[:]
sys.argv = [sys.argv[0]]
import parts, six_gen as G, na_hon3 as N
sys.argv = sys_argv
OUT = sys.argv[1] if len(sys.argv) > 1 else None
OL = parts.OL
SKIN = G.SKIN; RED = G.RED
limb, hand, foot, head, face, overlay = G.limb, G.hand, G.foot, G.head, G.face, G.overlay
txt = N.txt
spark = parts.prop_sparkle

# ---- いもむし（一二三のなかま） ----
def imomushi(x0, x1, y, col='#8fdc78', col2='#5fb860', r=None, kind='awake'):
    n = max(3, int((x1 - x0) / 15))
    r = r or 9
    s = ''
    xs = [x0 + (x1 - x0 - r * 2) * i / (n - 1) for i in range(n)]
    for i, x in enumerate(xs[:-1]):
        yy = y + (2 if i % 2 else -2)
        s += f'<circle cx="{x:.1f}" cy="{yy}" r="{r}" fill="{col if i % 2 else col2}" {OL} stroke-width="3.5"/>'
        s += f'<path d="M{x-3:.1f},{yy+r} L{x-4:.1f},{yy+r+5}" {OL} stroke-width="3" stroke-linecap="round"/>'
    hx = x1 - r * 1.3; hr = r * 1.35
    s += f'<path d="M{hx-4:.1f},{y-hr} Q{hx-8:.1f},{y-hr-12} {hx-12:.1f},{y-hr-12} M{hx+4:.1f},{y-hr} Q{hx+6:.1f},{y-hr-12} {hx+12:.1f},{y-hr-12}" fill="none" {OL} stroke-width="2.5" stroke-linecap="round"/>'
    s += f'<circle cx="{hx-12:.1f}" cy="{y-hr-12}" r="2.5" fill="#2a2a3a"/><circle cx="{hx+12:.1f}" cy="{y-hr-12}" r="2.5" fill="#2a2a3a"/>'
    s += f'<circle cx="{hx:.1f}" cy="{y}" r="{hr:.1f}" fill="#ffd23f" {OL} stroke-width="3.5"/>'
    sc = hr / 22
    s += face(hx, y - 2 * sc, sc * .9, kind)
    return s

def ichi():
    return imomushi(22, 138, 82, r=10) + txt(40, 54, 'いっぴき', 11, '#5fb860')
def ni():
    return imomushi(42, 116, 50, '#ffd9a8', '#ffb86b', r=8, kind='smile') + imomushi(22, 138, 114, r=10) + txt(130, 30, 'おやこ', 10, '#5fb860')
def san():
    return (imomushi(44, 120, 38, '#ffd9a8', '#ffb86b', r=8, kind='smile') + imomushi(48, 114, 80, '#ffd9e6', '#ff8ab0', r=7, kind='smile')
            + imomushi(22, 138, 122, r=10))

# ---- 四：窓とカーテン。口＝窓、ノ乚＝しばったカーテン、下の一＝窓の桟 ----
def yon():
    s = f'<rect x="26" y="50" width="104" height="66" rx="5" fill="#8fd3ff" {OL} stroke-width="5"/>'
    s += f'<circle cx="80" cy="84" r="20" fill="{SKIN}" {OL} stroke-width="4"/>' + face(80, 86, .6, 'smile')
    s += f'<path d="M30,54 L62,54 Q52,72 46,90 Q42,104 30,108 Z" fill="#ff8ab0" {OL} stroke-width="4" stroke-linejoin="round"/>'
    s += f'<path d="M126,54 L98,54 Q108,72 114,90 Q118,104 126,108 Z" fill="#ff8ab0" {OL} stroke-width="4" stroke-linejoin="round"/>'
    s += f'<circle cx="46" cy="90" r="4" fill="#ffd23f" {OL} stroke-width="2"/><circle cx="114" cy="90" r="4" fill="#ffd23f" {OL} stroke-width="2"/>'
    s += f'<rect x="20" y="110" width="116" height="12" rx="4" fill="#c9a66b" {OL} stroke-width="4"/>'
    s += f'<rect x="20" y="40" width="116" height="12" rx="4" fill="#c9a66b" {OL} stroke-width="4"/>'
    s += f'<g fill="#ff8ab0" {OL} stroke-width="2"><circle cx="40" cy="130" r="5"/><circle cx="120" cy="130" r="5"/></g>'
    return s

# ---- 五：こたつでぬくぬく。上の一＝天板、ノ＝こたつの脚、コ＝ふとん、下の一＝ラグ ----
def go():
    s = f'<rect x="20" y="122" width="120" height="12" rx="5" fill="#9ad36b" {OL} stroke-width="4"/>'
    s += f'<path d="M40,78 Q36,100 42,122 L112,120 Q118,100 112,76 Z" fill="#ff7a59" {OL} stroke-width="5" stroke-linejoin="round"/>'
    s += f'<g stroke="#ffd23f" stroke-width="3" stroke-linecap="round" opacity=".8"><path d="M50,90 L60,90 M74,96 L84,96 M94,88 L104,88 M56,108 L66,108 M88,108 L98,108"/></g>'
    s += f'<path d="M80,46 L58,120" {OL} stroke-width="10" stroke-linecap="round"/><path d="M80,46 L58,120" stroke="#8b5a2b" stroke-width="5" stroke-linecap="round"/>'
    s += f'<rect x="36" y="38" width="88" height="12" rx="3" fill="#a66b35" {OL} stroke-width="4"/>'
    s += f'<circle cx="104" cy="30" r="9" fill="#ffb347" {OL} stroke-width="3"/><path d="M104,21 L106,17" stroke="#5a9e3a" stroke-width="3" stroke-linecap="round"/>'
    # ねこが顔を出す
    s += f'<path d="M98,78 L102,64 L110,74 L118,64 L122,80" fill="#fff6e0" {OL} stroke-width="3.5" stroke-linejoin="round"/><ellipse cx="110" cy="84" rx="14" ry="10" fill="#fff6e0" {OL} stroke-width="3.5"/>'
    s += parts.eyes_closed(104, 116, 84).replace('stroke-width="4"', 'stroke-width="2.5"') + f'<path d="M107,90 Q110,93 113,90" fill="none" {OL} stroke-width="2" stroke-linecap="round"/>'
    s += txt(30, 26, 'ぬくぬく', 10, '#ff7a59')
    return s

# ---- 六：からかさくん。丶＝かさの先、一＝かさ、ノ丶＝2本の足 ----
def roku():
    s = limb('M66,82 Q56,104 36,126', '#ffcf9e', 14) + foot(32, 129, rx=10)
    s += limb('M94,82 Q106,104 126,126', '#ffcf9e', 14) + foot(130, 129, rx=10)
    s += f'<path d="M22,66 Q80,10 138,62 Q124,56 114,64 Q104,56 94,64 Q84,56 74,64 Q64,56 54,64 Q44,56 34,66 Q28,62 22,66 Z" fill="#5fa8e0" {OL} stroke-width="5" stroke-linejoin="round"/>'
    s += f'<path d="M80,28 L54,64 M80,28 L104,62" stroke="#2a2a3a" stroke-width="2.5" opacity=".35"/>'
    s += f'<path d="M80,30 L80,16" {OL} stroke-width="8" stroke-linecap="round"/><path d="M80,30 L80,16" stroke="#c9a66b" stroke-width="4" stroke-linecap="round"/>'
    s += f'<rect x="64" y="62" width="32" height="24" rx="8" fill="#5fa8e0" {OL} stroke-width="4"/>'
    s += parts.eyes_awake(74, 88, 46).replace('rx="9" ry="11"', 'rx="6" ry="7"').replace('rx="5.5" ry="7.5"', 'rx="3.5" ry="4.5"') + f'<path d="M76,58 Q81,62 86,58" fill="none" {OL} stroke-width="2.5" stroke-linecap="round"/>'
    s += f'<g fill="#7fc8ff" {OL} stroke-width="2"><path d="M20,24 C17,30 17,34 20,36 C23,34 23,30 20,24 Z"/><path d="M140,20 C137,26 137,30 140,32 C143,30 143,26 140,20 Z"/><path d="M146,96 C143,102 143,106 146,108 C149,106 149,102 146,96 Z"/></g>'
    return s

# ---- 七：すべりだい。一＝手すり、乚＝すべり台 ----
def nana():
    s = f'<path d="M64,30 L64,104 Q66,120 90,120 L126,122" fill="none" {OL} stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><path d="M64,30 L64,104 Q66,120 90,120 L126,122" fill="none" stroke="#ff7a59" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>'
    s += f'<path d="M48,40 L48,134 M80,40 L80,104" {OL} stroke-width="6" stroke-linecap="round"/>'
    s += f'<path d="M24,76 L132,66" {OL} stroke-width="12" stroke-linecap="round"/><path d="M24,76 L132,66" stroke="#ffd23f" stroke-width="6" stroke-linecap="round"/>'
    # すべる子
    s += head(100, 102, 14) + face(100, 104, .45, 'big') + limb('M86,112 L72,108', SKIN, 8)
    s += f'<g stroke="#ff7a59" stroke-width="3" stroke-linecap="round" opacity=".6"><path d="M70,92 L60,88 M72,100 L62,98"/></g>'
    s += txt(124, 104, 'しゅー', 11, '#ff7a59')
    return s

# ---- 八：ハのひげのはかせ ----
def hachi():
    s = f'<path d="M40,130 Q40,100 80,96 Q120,100 120,130 Z" fill="#fff" {OL} stroke-width="5" stroke-linejoin="round"/><path d="M80,98 L80,130" stroke="#2a2a3a" stroke-width="2" opacity=".4"/>'
    s += f'<circle cx="80" cy="56" r="38" fill="{SKIN}" {OL} stroke-width="5"/><path d="M50,30 Q80,10 110,30 Q96,22 80,22 Q64,22 50,30 Z" fill="#fff" {OL} stroke-width="3"/>'
    s += f'<circle cx="66" cy="50" r="10" fill="#fff" {OL} stroke-width="3.5"/><circle cx="94" cy="50" r="10" fill="#fff" {OL} stroke-width="3.5"/><path d="M76,50 L84,50" {OL} stroke-width="3"/><circle cx="67" cy="51" r="4" fill="#2a2a3a"/><circle cx="95" cy="51" r="4" fill="#2a2a3a"/>'
    # ハのひげ
    s += f'<path d="M74,66 Q60,78 34,96" fill="none" {OL} stroke-width="14" stroke-linecap="round"/><path d="M74,66 Q60,78 34,96" fill="none" stroke="#6b4a2b" stroke-width="8" stroke-linecap="round"/>'
    s += f'<path d="M86,64 Q104,82 128,96" fill="none" {OL} stroke-width="14" stroke-linecap="round"/><path d="M86,64 Q104,82 128,96" fill="none" stroke="#6b4a2b" stroke-width="8" stroke-linecap="round"/>'
    s += f'<ellipse cx="80" cy="64" rx="6" ry="4" fill="#ffb38a" {OL} stroke-width="2.5"/><path d="M74,80 Q80,84 86,80" fill="none" {OL} stroke-width="2.5" stroke-linecap="round"/>'
    s += txt(132, 22, 'はかせ', 10, '#6b5f4a')
    return s

# ---- 九：ねこがのび〜。ノ＝前足、㇈＝背中からしっぽ ----
def kyu():
    s = f'<path d="M30,70 L98,62 Q118,62 118,84 L120,112 Q122,124 136,118" fill="none" {OL} stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/><path d="M30,70 L98,62 Q118,62 118,84 L120,112 Q122,124 136,118" fill="none" stroke="#ffb347" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>'
    s += f'<g stroke="#e08a1a" stroke-width="3" stroke-linecap="round"><path d="M60,60 L60,72 M76,58 L76,70 M92,56 L92,68 M112,96 L124,96"/></g>'
    s += limb('M70,64 Q56,96 32,124', '#ffb347', 16) + f'<ellipse cx="28" cy="126" rx="10" ry="6" fill="#fff6e0" {OL} stroke-width="3"/>'
    s += limb('M108,74 L112,124', '#ffb347', 14) + f'<ellipse cx="113" cy="128" rx="9" ry="5" fill="#fff6e0" {OL} stroke-width="3"/>'
    # 頭（左）
    s += f'<path d="M14,52 L18,30 L32,44 L46,30 L48,52" fill="#ffb347" {OL} stroke-width="4" stroke-linejoin="round"/><ellipse cx="32" cy="60" rx="22" ry="18" fill="#ffb347" {OL} stroke-width="4.5"/>'
    s += parts.eyes_closed(24, 40, 58).replace('stroke-width="4"', 'stroke-width="3"') + f'<path d="M28,68 Q32,72 36,68" fill="none" {OL} stroke-width="2.5" stroke-linecap="round"/>'
    s += txt(70, 40, 'のび〜', 12, '#e08a1a')
    return s

# ---- 十：とんぼ。一＝はね、丨＝からだ ----
def ju():
    s = ''
    for x0, x1, y in ((24, 76, 64), (84, 136, 62)):
        s += f'<ellipse cx="{(x0+x1)/2}" cy="{y}" rx="{(x1-x0)/2}" ry="9" fill="#dff4ff" {OL} stroke-width="3.5"/><ellipse cx="{(x0+x1)/2}" cy="{y+14}" rx="{(x1-x0)/2-4}" ry="8" fill="#dff4ff" {OL} stroke-width="3" opacity=".9"/>'
    s += f'<path d="M80,48 L80,140" {OL} stroke-width="14" stroke-linecap="round"/><path d="M80,48 L80,140" stroke="#e04a4a" stroke-width="8" stroke-linecap="round"/>'
    s += f'<g stroke="#2a2a3a" stroke-width="2"><path d="M74,96 L86,96 M74,108 L86,108 M74,120 L86,120"/></g>'
    s += f'<circle cx="80" cy="34" r="16" fill="#e04a4a" {OL} stroke-width="4"/><circle cx="72" cy="30" r="7" fill="#fff" {OL} stroke-width="2.5"/><circle cx="88" cy="30" r="7" fill="#fff" {OL} stroke-width="2.5"/><circle cx="73" cy="31" r="3.5" fill="#2a2a3a"/><circle cx="89" cy="31" r="3.5" fill="#2a2a3a"/>'
    s += f'<path d="M76,42 Q80,45 84,42" fill="none" {OL} stroke-width="2" stroke-linecap="round"/>'
    return s

# ---- 上：旗をあげろ。丨＝ポール、短い一＝旗、下の一＝地面 ----
def ue():
    s = f'<path d="M24,124 L136,122" {OL} stroke-width="14" stroke-linecap="round"/><path d="M24,124 L136,122" stroke="#9ad36b" stroke-width="8" stroke-linecap="round"/>'
    s += f'<path d="M80,30 L80,122" {OL} stroke-width="10" stroke-linecap="round"/><path d="M80,30 L80,122" stroke="#9aa3ad" stroke-width="5" stroke-linecap="round"/><circle cx="80" cy="26" r="6" fill="#ffd23f" {OL} stroke-width="3"/>'
    s += f'<path d="M84,52 L122,48 Q128,58 122,70 L84,74 Z" fill="#ff7a59" {OL} stroke-width="4" stroke-linejoin="round"/>'
    s += parts.eyes_awake(96, 112, 60).replace('rx="9" ry="11"', 'rx="5" ry="6"').replace('rx="5.5" ry="7.5"', 'rx="3" ry="4"')
    s += f'<path d="M40,96 L40,46 M30,58 L40,44 L50,58" fill="none" stroke="#3b6fd9" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
    s += txt(40, 36, 'うえ！', 11, '#3b6fd9')
    return s

# ---- 下：くもがぶらーん。一＝木の枝、丨＝くもの糸、丶＝くも ----
def shita():
    s = f'<path d="M20,34 L140,32" {OL} stroke-width="16" stroke-linecap="round"/><path d="M20,34 L140,32" stroke="#8b5a2b" stroke-width="10" stroke-linecap="round"/>'
    s += f'<path d="M30,26 Q24,14 34,10 Q40,20 30,26 Z M128,24 Q136,12 144,18 Q138,28 128,24 Z" fill="#6ec46a" {OL} stroke-width="3"/>'
    s += f'<path d="M80,40 L80,124" stroke="#9aa3ad" stroke-width="3"/>'
    # くも（右下の点の位置）
    cx, cy = 104, 80
    for a in (-40, -15, 15, 40):
        s += f'<path d="M{cx},{cy} l{-22},{a/2}" fill="none" stroke="#2a2a3a" stroke-width="3" stroke-linecap="round"/><path d="M{cx},{cy} l22,{a/2}" fill="none" stroke="#2a2a3a" stroke-width="3" stroke-linecap="round"/>'
    s += f'<path d="M80,{cy} L{cx-14},{cy}" stroke="#9aa3ad" stroke-width="2.5"/>'
    s += f'<circle cx="{cx}" cy="{cy}" r="14" fill="#6b5f8a" {OL} stroke-width="4"/>' + parts.eyes_dot(cx-6, cx+6, cy-2) + f'<path d="M{cx-4},{cy+5} Q{cx},{cy+8} {cx+4},{cy+5}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>'
    s += f'<path d="M40,60 L40,110 M30,98 L40,112 L50,98" fill="none" stroke="#3b6fd9" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
    s += txt(40, 128, 'した〜', 11, '#3b6fd9')
    return s

# ---- 入：テントに「はいる」。ノ乀＝テントの入口 ----
def hairu():
    s = f'<path d="M20,128 L80,40 L140,128 Z" fill="#ffd23f" {OL} stroke-width="5" stroke-linejoin="round"/><path d="M20,128 L80,40 L80,128 Z" fill="#000" opacity=".08"/>'
    s += f'<path d="M80,64 L46,128 L114,128 Z" fill="#3a2a1a" {OL} stroke-width="4" stroke-linejoin="round"/>'
    s += f'<path d="M80,64 L46,128 L60,128 Q68,96 80,70 Z" fill="#ff7a59" {OL} stroke-width="3.5" stroke-linejoin="round"/>'
    s += f'<path d="M60,40 L80,40 M80,40 L80,28" {OL} stroke-width="4" stroke-linecap="round"/><path d="M80,28 L96,32 L80,36 Z" fill="#e04a4a" {OL} stroke-width="2.5"/>'
    # 入っていく子（おしり＋足）
    s += f'<ellipse cx="88" cy="114" rx="12" ry="10" fill="#5fa8e0" {OL} stroke-width="3.5"/>' + limb('M90,122 L104,130', SKIN, 9) + foot(108, 131, rx=7, ry=4)
    s += f'<g stroke="#2a2a3a" stroke-width="2.5" stroke-linecap="round" opacity=".5"><path d="M110,106 L118,102 M112,114 L122,114"/></g>'
    s += txt(126, 60, 'おじゃま', 9, '#6b5f4a') + txt(126, 72, 'しまーす', 9, '#6b5f4a')
    return s

# ---- 年：たんじょうびケーキ。ノ＝ろうそくの炎、一一＝ケーキの段、丨＝ろうそく、下の一＝お皿 ----
def toshi():
    s = f'<path d="M22,128 L138,126" {OL} stroke-width="12" stroke-linecap="round"/><path d="M22,128 L138,126" stroke="#9aa3ad" stroke-width="6" stroke-linecap="round"/>'
    s += f'<rect x="34" y="94" width="92" height="30" rx="6" fill="#ffe2a8" {OL} stroke-width="4.5"/><path d="M34,100 Q44,108 54,100 Q64,108 74,100 Q84,108 94,100 Q104,108 114,100 Q120,106 126,100" fill="none" stroke="#fff" stroke-width="5"/>'
    s += f'<rect x="46" y="62" width="70" height="32" rx="6" fill="#ffd9e6" {OL} stroke-width="4.5"/>'
    s += f'<g fill="#e04a4a" {OL} stroke-width="2"><circle cx="58" cy="62" r="5"/><circle cx="102" cy="62" r="5"/></g>'
    s += f'<rect x="80" y="30" width="10" height="34" rx="3" fill="#7fb8ff" {OL} stroke-width="3"/>'
    s += f'<path d="M85,12 C78,20 78,28 85,30 C92,28 92,20 85,12 Z" fill="#ffb347" {OL} stroke-width="3"/>'
    s += parts.eyes_smile(62, 92, 80).replace('stroke-width="4"', 'stroke-width="3"') + f'<path d="M72,86 Q77,90 82,86" fill="none" {OL} stroke-width="2.5" stroke-linecap="round"/>'
    s += txt(44, 30, '1さい', 12, '#ff5c9a') + txt(44, 44, 'あがった！', 9, '#ff5c9a')
    return s

# ---- 円：がまぐち。冂＝さいふ、丨一＝口金の留め具 ----
def en():
    s = f'<path d="M34,36 L126,34 L120,128 Q80,138 40,128 Z" fill="#e04a4a" {OL} stroke-width="5" stroke-linejoin="round"/><path d="M34,36 L80,35 L80,134 Q56,134 40,128 Z" fill="#000" opacity=".08"/>'
    s += f'<path d="M32,38 L128,36" {OL} stroke-width="10" stroke-linecap="round"/><path d="M32,38 L128,36" stroke="#ffd23f" stroke-width="5" stroke-linecap="round"/>'
    s += f'<circle cx="72" cy="28" r="7" fill="#ffd23f" {OL} stroke-width="3"/><circle cx="88" cy="28" r="7" fill="#ffd23f" {OL} stroke-width="3"/>'
    s += f'<path d="M80,38 L80,84 M38,86 L122,82" {OL} stroke-width="5" stroke-linecap="round"/>'
    s += parts.eyes_awake(58, 102, 60).replace('rx="9" ry="11"', 'rx="7" ry="8"').replace('rx="5.5" ry="7.5"', 'rx="4" ry="5"') + f'<path d="M70,104 Q80,112 90,104" fill="none" {OL} stroke-width="3" stroke-linecap="round"/>'
    s += f'<ellipse cx="46" cy="100" rx="6" ry="4" fill="#ff8aa8" opacity=".8"/><ellipse cx="114" cy="98" rx="6" ry="4" fill="#ff8aa8" opacity=".8"/>'
    for x, y in ((134, 108), (144, 124), (126, 126)):
        s += f'<circle cx="{x}" cy="{y}" r="7" fill="#ffd23f" {OL} stroke-width="2.5"/>'
    s += txt(140, 96, '¥', 12, '#e6b400')
    return s

# ---- 文：おてがみ（ふうとう）。丶＝ハートのシール、一＝ふたの線、ノ乀＝封筒のバツの折り目 ----
def bun():
    s = f'<rect x="24" y="44" width="112" height="88" rx="6" fill="#fff6e0" {OL} stroke-width="5"/>'
    s += f'<path d="M24,52 L80,96 L136,52" fill="none" {OL} stroke-width="4" stroke-linejoin="round"/>'
    s += f'<path d="M100,52 L36,130 M50,64 L126,130" stroke="#c9a66b" stroke-width="5" stroke-linecap="round"/>'
    s += f'<path d="M80,30 C70,18 58,30 80,46 C102,30 90,18 80,30 Z" fill="#ff5c9a" {OL} stroke-width="3.5"/>'
    s += f'<path d="M28,48 L132,46" stroke="#ff7a59" stroke-width="5" stroke-linecap="round"/>'
    s += parts.eyes_awake(62, 98, 110).replace('rx="9" ry="11"', 'rx="6" ry="7"').replace('rx="5.5" ry="7.5"', 'rx="3.5" ry="4.5"') + f'<path d="M74,120 Q80,124 86,120" fill="none" {OL} stroke-width="2.5" stroke-linecap="round"/>'
    s += txt(136, 30, 'おてがみ', 9, '#ff5c9a')
    return s

# ---- 小：ひよこ。亅＝体と足、ノ丶＝ひろげた小さなつばさ ----
def chiisai():
    s = f'<ellipse cx="80" cy="84" rx="24" ry="30" fill="#ffe14d" {OL} stroke-width="5"/>'
    s += f'<path d="M80,112 L80,126 Q80,134 70,132" fill="none" {OL} stroke-width="7" stroke-linecap="round"/><path d="M80,112 L80,126 Q80,134 70,132" fill="none" stroke="#ff9a3d" stroke-width="3.5" stroke-linecap="round"/>'
    s += f'<path d="M58,80 Q44,92 34,108 Q50,104 60,92 Z" fill="#ffd23f" {OL} stroke-width="4" stroke-linejoin="round"/>'
    s += f'<path d="M102,80 Q116,92 126,108 Q110,104 100,92 Z" fill="#ffd23f" {OL} stroke-width="4" stroke-linejoin="round"/>'
    s += f'<circle cx="80" cy="44" r="18" fill="#ffe14d" {OL} stroke-width="4.5"/><path d="M78,26 Q74,16 82,14 M82,26 Q88,18 92,22" fill="none" {OL} stroke-width="2.5" stroke-linecap="round"/>'
    s += parts.eyes_dot(72, 88, 42) + f'<path d="M76,50 L84,50 L80,56 Z" fill="#ff9a3d" {OL} stroke-width="2" stroke-linejoin="round"/>'
    s += f'<ellipse cx="66" cy="50" rx="4" ry="3" fill="#ff8aa8" opacity=".8"/><ellipse cx="94" cy="50" rx="4" ry="3" fill="#ff8aa8" opacity=".8"/>'
    s += txt(128, 40, 'ぴよ', 11, '#e6b400') + f'<path d="M20,140 L140,140" {OL} stroke-width="3" stroke-linecap="round" opacity=".3"/>'
    return s

B1 = [
 ('一', 'いち', 'いもむし1ぴき', '一＝横にながーいいもむし。一二三はいもむし家族', ichi()),
 ('二', 'に', 'いもむし親子', '上の短い一＝子ども、下の長い一＝お母さん', ni()),
 ('三', 'さん', 'いもむし3きょうだい', '上・まん中（いちばん短い）・下（いちばん長い）の3びき', san()),
 ('四', 'よん', 'まどとカーテン', '口＝まど、ノと乚＝しばった2枚のカーテン、下の一＝まどの桟。まどから顔がのぞく', yon()),
 ('五', 'ご', 'こたつでぬくぬく', '上の一＝天板、ノ＝脚、コ＝こたつぶとん、下の一＝ラグ。ねこがひょっこり', go()),
 ('六', 'ろく', 'からかさくん', '丶＝かさの先、一＝かさ、ノ丶＝2本の足。雨の日にとことこ', roku()),
]
B2 = [
 ('七', 'なな', 'すべりだい', '一＝手すり、乚＝すべり台。子どもがしゅーっ', nana()),
 ('八', 'はち', 'ハのひげのはかせ', 'ノ＝左のひげ、乀＝右のひげ。めがねの博士', hachi()),
 ('九', 'きゅう', 'ねこがのび〜', 'ノ＝のばした前足、㇈＝せなかからしっぽ', kyu()),
 ('十', 'じゅう', 'とんぼ', '一＝はね、丨＝からだ', ju()),
 ('上', 'うえ', '旗をあげろ', '丨＝ポール、短い一＝あがった旗、下の一＝地面。「うえ！」', ue()),
 ('下', 'した', 'くもがぶらーん', '一＝木の枝、丨＝くもの糸、丶＝下りてきたくも。「した〜」', shita()),
]
B3 = [
 ('入', 'はいる', 'テントにはいる', 'ノと乀＝テントの入口。子どもがもぐりこむ', hairu()),
 ('年', 'とし', 'たんじょうびケーキ', 'ノ＝炎、一一＝ケーキの段、丨＝ろうそく、下の一＝お皿。「1さい あがった！」', toshi()),
 ('円', 'えん', 'がまぐち', '冂＝さいふ、丨と一＝口金の留め具。お金がこぼれる', en()),
 ('文', 'ぶん', 'おてがみ', '丶＝ハートのシール、一＝ふたの線、ノ乀＝ふうとうのバツの折り目', bun()),
 ('小', 'ちいさい', 'ひよこ', '亅＝体と足、ノ丶＝ひろげた小さなつばさ。「ぴよ」', chiisai()),
]

svg = lambda inner, size: f'<svg viewBox="0 0 160 160" width="{size}" height="{size}">{inner}</svg>'
def board(num, title, cases):
    cells = ''.join(f'''
    <div style="display:flex;align-items:center;gap:8px;background:#fff;border-radius:18px;padding:6px 10px;min-height:0">
      {svg(b, 150)}
      {svg(b + overlay(k), 72)}
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
<div style="width: 880px; height: 560px; box-sizing: border-box; padding: 20px 28px; background: #f0ffe8; font-family: 'Zen Maru Gothic', sans-serif; color: #2a2a3a; display: flex; flex-direction: column; gap: 8px">
  <div style="display: flex; align-items: baseline; gap: 14px">
    <div style="font-size: 26px; font-weight: 900; background: #5fb860; color: #fff; padding: 2px 14px; border-radius: 12px; white-space:nowrap">{num}</div>
    <h1 style="margin: 0; font-size: 22px; font-weight: 900; white-space:nowrap">{title}</h1>
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
    open(os.path.join(OUT, 'A36_Last1.dc.html'), 'w', encoding='utf-8').write(board('A-36', 'のこり17字 本命案1（一二三四五六）', B1))
    open(os.path.join(OUT, 'A37_Last2.dc.html'), 'w', encoding='utf-8').write(board('A-37', 'のこり17字 本命案2（七八九十上下）', B2))
    open(os.path.join(OUT, 'A38_Last3.dc.html'), 'w', encoding='utf-8').write(board('A-38', 'のこり17字 本命案3（入年円文小）', B3))
    print('ok')
