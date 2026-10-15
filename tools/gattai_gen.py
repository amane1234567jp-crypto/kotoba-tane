# 合体字アートボード生成：親キャラの部品を組み合わせて、枠いっぱいの1キャラに見えるシーンを作る
import sys, os
OUT=sys.argv[1]

OL='stroke="#2a2a3a"'
def g(x,y,sc,inner,rot=0,cx=80,cy=80):
    r=f' rotate({rot} {cx} {cy})' if rot else ''
    return f'<g transform="translate({x},{y}) scale({sc}){r}">{inner}</g>'

def eyes_awake(cxl=68,cxr=92,cy=58):
    return (f'<ellipse cx="{cxl}" cy="{cy}" rx="9" ry="11" fill="#fff" {OL} stroke-width="3"/><ellipse cx="{cxr}" cy="{cy}" rx="9" ry="11" fill="#fff" {OL} stroke-width="3"/>'
            f'<ellipse cx="{cxl+2}" cy="{cy+2}" rx="5.5" ry="7.5" fill="#2a2a3a"/><ellipse cx="{cxr+2}" cy="{cy+2}" rx="5.5" ry="7.5" fill="#2a2a3a"/>'
            f'<circle cx="{cxl+4}" cy="{cy-2}" r="2.5" fill="#fff"/><circle cx="{cxr+4}" cy="{cy-2}" r="2.5" fill="#fff"/>')
def eyes_closed(cxl=68,cxr=92,cy=60):
    return f'<path d="M{cxl-9},{cy} Q{cxl},{cy+7} {cxl+9},{cy} M{cxr-9},{cy} Q{cxr},{cy+7} {cxr+9},{cy}" fill="none" {OL} stroke-width="4" stroke-linecap="round"/>'
def eyes_smile(cxl=68,cxr=92,cy=62):
    return f'<path d="M{cxl-9},{cy} Q{cxl},{cy-12} {cxl+9},{cy} M{cxr-9},{cy} Q{cxr},{cy-12} {cxr+9},{cy}" fill="none" {OL} stroke-width="4" stroke-linecap="round"/>'
def eyes_dot(cxl=66,cxr=94,cy=60):
    return f'<circle cx="{cxl}" cy="{cy}" r="4.5" fill="#2a2a3a"/><circle cx="{cxr}" cy="{cy}" r="4.5" fill="#2a2a3a"/><circle cx="{cxl+1.5}" cy="{cy-1.5}" r="1.5" fill="#fff"/><circle cx="{cxr+1.5}" cy="{cy-1.5}" r="1.5" fill="#fff"/>'
def cheeks(cxl=54,cxr=106,cy=70): return f'<ellipse cx="{cxl}" cy="{cy}" rx="6" ry="4" fill="#ff8aa8" opacity=".7"/><ellipse cx="{cxr}" cy="{cy}" rx="6" ry="4" fill="#ff8aa8" opacity=".7"/>'
def mouth_smile(cx=80,cy=76): return f'<path d="M{cx-12},{cy} Q{cx},{cy+14} {cx+12},{cy} Z" fill="#c0392b" {OL} stroke-width="3" stroke-linejoin="round"/><path d="M{cx-7},{cy+6} Q{cx},{cy+12} {cx+7},{cy+6} Z" fill="#ff6b8a"/>'
def mouth_cat(cx=80,cy=76): return f'<path d="M{cx-10},{cy} Q{cx-5},{cy+8} {cx},{cy} Q{cx+5},{cy+8} {cx+10},{cy}" fill="none" {OL} stroke-width="3.5" stroke-linecap="round"/>'
def mouth_o(cx=80,cy=78): return f'<ellipse cx="{cx}" cy="{cy}" rx="5" ry="6" fill="#c0392b" {OL} stroke-width="3"/>'
def mouth_big(cx=80,cy=74): return f'<path d="M{cx-16},{cy} Q{cx},{cy+24} {cx+16},{cy} Z" fill="#c0392b" {OL} stroke-width="3" stroke-linejoin="round"/><path d="M{cx-8},{cy+10} Q{cx},{cy+18} {cx+8},{cy+10} Z" fill="#ff6b8a"/>'
def feet(y=150,l=62,r=98,col='#8b5a2b'): return f'<ellipse cx="{l}" cy="{y}" rx="12" ry="6" fill="{col}" {OL} stroke-width="4"/><ellipse cx="{r}" cy="{y}" rx="12" ry="6" fill="{col}" {OL} stroke-width="4"/>'

def tree(face='awake',arms=True):
    a=f'<path d="M58,80 Q30,100 26,128" fill="none" stroke="#8b5a2b" stroke-width="12" stroke-linecap="round"/><path d="M102,80 Q130,100 134,128" fill="none" stroke="#8b5a2b" stroke-width="12" stroke-linecap="round"/>' if arms else ''
    f={'awake':eyes_awake()+mouth_smile(), 'sleep':eyes_closed()+mouth_o(80,80), 'smile':eyes_smile()+mouth_cat(80,78)}[face]
    return (a+f'<rect x="70" y="70" width="20" height="80" rx="6" fill="#a66b35" {OL} stroke-width="5"/><circle cx="80" cy="60" r="40" fill="#5fcb75" {OL} stroke-width="5"/>'
            f'<path d="M40,60 A40,40 0 0 0 80,100 L80,20 A40,40 0 0 0 40,60 Z" fill="#000" opacity=".12"/>'+f+cheeks()+feet())

def person(face='awake'):
    legs=(f'<path d="M78,70 Q60,100 36,140" fill="none" {OL} stroke-width="22" stroke-linecap="round"/><path d="M78,70 Q60,100 36,140" fill="none" stroke="#ffcf9e" stroke-width="13" stroke-linecap="round"/>'
          f'<path d="M82,70 Q100,100 124,140" fill="none" {OL} stroke-width="22" stroke-linecap="round"/><path d="M82,70 Q100,100 124,140" fill="none" stroke="#ffcf9e" stroke-width="13" stroke-linecap="round"/>')
    head=(f'<circle cx="80" cy="46" r="34" fill="#ffcf9e" {OL} stroke-width="5"/><path d="M46,46 A34,34 0 0 0 80,80 L80,12 A34,34 0 0 0 46,46 Z" fill="#000" opacity=".1"/>'
          f'<path d="M52,30 Q80,10 108,30 L104,20 Q80,6 56,20 Z" fill="#6b4a2b" {OL} stroke-width="3" stroke-linejoin="round"/>')
    f={'awake':eyes_awake(68,92,46)+cheeks(56,104,58)+mouth_smile(80,62),'sleep':eyes_closed(68,92,48)+cheeks(56,104,58)+mouth_o(80,64)}[face]
    return legs+head+f

def sun(face='awake',rays=True):
    r=(f'<g stroke="#ffb400" stroke-width="5" stroke-linecap="round"><line x1="80" y1="8" x2="80" y2="20"/><line x1="28" y1="30" x2="36" y2="38"/><line x1="132" y1="30" x2="124" y2="38"/><line x1="14" y1="82" x2="26" y2="82"/><line x1="146" y1="82" x2="134" y2="82"/></g>') if rays else ''
    body=(f'<rect x="36" y="26" width="88" height="112" rx="26" fill="#ffd23f" {OL} stroke-width="5"/><path d="M36,52 L36,112 Q36,138 62,138 L64,138 L64,26 L62,26 Q36,26 36,52 Z" fill="#000" opacity=".1"/>')
    f={'awake':eyes_smile(66,94,70)+f'<path d="M50,92 L110,92" {OL} stroke-width="4" stroke-linecap="round"/>'+mouth_cat(80,104),
       'open':eyes_smile(66,94,70)+f'<path d="M50,92 L110,92" {OL} stroke-width="4" stroke-linecap="round"/>'+mouth_big(80,100)}[face]
    return r+body+f+cheeks(52,108,84)+feet(144,60,100,'#ffb400')

def moon(face='awake'):
    # ふくらみ右・開き左
    body=(f'<path d="M104,12 C56,20 28,62 34,104 C40,134 68,152 102,148 C78,134 64,106 68,76 C72,48 86,28 104,12 Z" fill="#fff0a3" {OL} stroke-width="5" stroke-linejoin="round"/>'
          f'<path d="M54,78 Q70,74 84,80 M50,104 Q66,100 82,108" fill="none" {OL} stroke-width="4" stroke-linecap="round" opacity=".7"/>')
    f=f'<path d="M46,52 Q54,42 62,52 M64,36 Q72,26 80,36" fill="none" {OL} stroke-width="4" stroke-linecap="round"/><ellipse cx="44" cy="64" rx="6" ry="4" fill="#ff8aa8" opacity=".7"/>'+mouth_cat(62,64)
    ft=f'<path d="M34,118 Q26,134 36,146" fill="none" {OL} stroke-width="12" stroke-linecap="round"/><path d="M34,118 Q26,134 36,146" fill="none" stroke="#e6c94f" stroke-width="6" stroke-linecap="round"/>'
    return f'<g transform="translate(160,0) scale(-1,1)">{body+f+ft}</g>'

def mountain(face='half'):
    body=(f'<path d="M12,132 L48,66 L66,104 L80,34 L94,104 L112,66 L148,132 Z" fill="#6ec46a" {OL} stroke-width="5" stroke-linejoin="round"/>'
          f'<path d="M12,132 L48,66 L66,104 L80,34 L82,34 L82,132 Z" fill="#000" opacity=".12"/><path d="M80,34 L70,56 L90,56 Z" fill="#fff" {OL} stroke-width="3" stroke-linejoin="round"/>')
    if face=='half':
        f=(f'<ellipse cx="68" cy="100" rx="9" ry="11" fill="#fff" {OL} stroke-width="3"/><ellipse cx="92" cy="100" rx="9" ry="11" fill="#fff" {OL} stroke-width="3"/><ellipse cx="70" cy="104" rx="5.5" ry="7" fill="#2a2a3a"/><ellipse cx="94" cy="104" rx="5.5" ry="7" fill="#2a2a3a"/>'
           f'<path d="M58,99 A9,11 0 0 1 78,99 Z M82,99 A9,11 0 0 1 102,99 Z" fill="#6ec46a"/><path d="M58,99 L78,99 M82,99 L102,99" {OL} stroke-width="3.5" stroke-linecap="round"/><path d="M68,121 Q82,130 94,114" fill="none" {OL} stroke-width="4" stroke-linecap="round"/>')
    else:
        f=eyes_awake(68,92,98)+mouth_big(80,116)
    return body+f+cheeks(54,114,114)+feet(136,46,114,'#4ea04a')

def evening():
    body=(f'<path d="M100,20 C56,22 30,56 34,96 C38,128 66,146 96,142 C72,130 60,104 64,76 C68,50 82,34 100,20 Z" fill="#ffa552" {OL} stroke-width="5" stroke-linejoin="round"/>'
          f'<circle cx="112" cy="84" r="9" fill="#ffd23f" {OL} stroke-width="4"/>'
          f'<ellipse cx="52" cy="76" rx="9" ry="5" fill="#fff" {OL} stroke-width="3"/><ellipse cx="74" cy="60" rx="9" ry="5" fill="#fff" {OL} stroke-width="3"/><ellipse cx="54" cy="77" rx="4.5" ry="3" fill="#2a2a3a"/><ellipse cx="76" cy="61" rx="4.5" ry="3" fill="#2a2a3a"/>'
          f'<path d="M42,72 L62,72 M64,56 L84,56" {OL} stroke-width="3.5" stroke-linecap="round"/><ellipse cx="46" cy="92" rx="6" ry="4" fill="#ff8aa8" opacity=".7"/>'+mouth_cat(64,100))
    return f'<g transform="translate(160,0) scale(-1,1)">{body}</g>'

def mouth_char(shout=False):
    body=(f'<rect x="30" y="40" width="100" height="90" rx="18" fill="#ffb3a7" {OL} stroke-width="5"/><path d="M30,58 L30,112 Q30,130 48,130 L50,130 L50,40 L48,40 Q30,40 30,58 Z" fill="#000" opacity=".1"/>'
          f'<circle cx="62" cy="34" r="4.5" fill="#2a2a3a"/><circle cx="98" cy="34" r="4.5" fill="#2a2a3a"/><circle cx="63.5" cy="32.5" r="1.5" fill="#fff"/><circle cx="99.5" cy="32.5" r="1.5" fill="#fff"/>'
          f'<rect x="44" y="60" width="72" height="54" rx="12" fill="#c0392b" {OL} stroke-width="4"/><rect x="52" y="60" width="56" height="12" rx="4" fill="#fff"/><ellipse cx="80" cy="104" rx="18" ry="10" fill="#ff6b8a"/>'
          f'<ellipse cx="46" cy="124" rx="6" ry="4" fill="#ff8aa8" opacity=".9"/><ellipse cx="114" cy="124" rx="6" ry="4" fill="#ff8aa8" opacity=".9"/>')
    return body+feet(138,56,104,'#e08b7f')

def field():
    return (f'<rect x="30" y="34" width="100" height="100" rx="16" fill="#9ad36b" {OL} stroke-width="5"/><path d="M30,50 L30,118 Q30,134 46,134 L48,134 L48,34 L46,34 Q30,34 30,50 Z" fill="#000" opacity=".1"/>'
            f'<path d="M80,34 L80,134 M30,84 L130,84" stroke="#6f3f17" stroke-width="10" stroke-linecap="round"/><path d="M80,34 L80,134 M30,84 L130,84" stroke="#a66b35" stroke-width="5" stroke-linecap="round"/>'
            f'<g stroke="#5a9e3a" stroke-width="3" stroke-linecap="round"><path d="M40,70 L40,60 M48,70 L48,58 M56,70 L56,62 M104,70 L104,60 M112,70 L112,58 M120,70 L120,62 M40,122 L40,112 M48,122 L48,110 M56,122 L56,114 M104,122 L104,112 M112,122 L112,110 M120,122 L120,114"/></g>'
            f'<ellipse cx="62" cy="62" rx="9" ry="11" fill="#fff" {OL} stroke-width="3"/><ellipse cx="98" cy="62" rx="9" ry="11" fill="#fff" {OL} stroke-width="3"/><ellipse cx="64" cy="66" rx="5.5" ry="7" fill="#2a2a3a"/><ellipse cx="100" cy="66" rx="5.5" ry="7" fill="#2a2a3a"/>'
            f'<path d="M52,61 A9,11 0 0 1 72,61 Z M88,61 A9,11 0 0 1 108,61 Z" fill="#9ad36b"/><path d="M52,61 L72,61 M88,61 L108,61" {OL} stroke-width="3.5" stroke-linecap="round"/>'
            f'<path d="M58,104 Q68,114 72,104 M88,104 Q92,114 102,104" fill="none" {OL} stroke-width="3.5" stroke-linecap="round"/>')

def eye_char():
    return (f'<rect x="44" y="22" width="72" height="118" rx="20" fill="#fff" {OL} stroke-width="5"/><path d="M44,42 L44,120 Q44,140 64,140 L66,140 L66,22 L64,22 Q44,22 44,42 Z" fill="#000" opacity=".08"/>'
            f'<path d="M52,60 L108,60 M52,100 L108,100" {OL} stroke-width="4" stroke-linecap="round"/><ellipse cx="80" cy="80" rx="20" ry="18" fill="#3b6fd9"/><ellipse cx="80" cy="80" rx="11" ry="10" fill="#2a2a3a"/><circle cx="86" cy="74" r="5" fill="#fff"/><circle cx="74" cy="86" r="2.5" fill="#fff"/>'
            f'<ellipse cx="54" cy="112" rx="6" ry="4" fill="#ff8aa8" opacity=".7"/><ellipse cx="106" cy="112" rx="6" ry="4" fill="#ff8aa8" opacity=".7"/>'+mouth_o(80,120))

def tachan():
    return (f'<path d="M24,140 L136,140" {OL} stroke-width="16" stroke-linecap="round"/><path d="M24,140 L136,140" stroke="#8aa0ff" stroke-width="9" stroke-linecap="round"/>'
            f'<path d="M44,60 L116,60 L124,132 L36,132 Z" fill="#8aa0ff" {OL} stroke-width="5" stroke-linejoin="round"/><path d="M44,60 L36,132 L80,132 L80,60 Z" fill="#000" opacity=".1"/>'
            f'<path d="M56,86 Q50,100 54,112 M104,86 Q110,100 106,112" fill="none" {OL} stroke-width="12" stroke-linecap="round"/><path d="M56,86 Q50,100 54,112 M104,86 Q110,100 106,112" fill="none" stroke="#ffcf9e" stroke-width="6" stroke-linecap="round"/>'
            f'<path d="M34,58 L126,58" {OL} stroke-width="14" stroke-linecap="round"/><path d="M34,58 L126,58" stroke="#5f6fd9" stroke-width="7" stroke-linecap="round"/><path d="M80,14 L80,54" {OL} stroke-width="12" stroke-linecap="round"/><path d="M80,14 L80,54" stroke="#5f6fd9" stroke-width="6" stroke-linecap="round"/><circle cx="80" cy="12" r="7" fill="#ffd23f" {OL} stroke-width="3"/>'
            +eyes_awake(68,92,84)+cheeks(58,102,100)+f'<path d="M72,108 L88,108" {OL} stroke-width="4" stroke-linecap="round"/>')

def baby():
    return (f'<path d="M80,74 L80,126 Q80,140 66,138" fill="none" {OL} stroke-width="30" stroke-linecap="round"/><path d="M80,74 L80,126 Q80,140 66,138" fill="none" stroke="#fff3b0" stroke-width="20" stroke-linecap="round"/>'
            f'<path d="M28,100 L132,100" {OL} stroke-width="16" stroke-linecap="round"/><path d="M28,100 L132,100" stroke="#ffcf9e" stroke-width="8" stroke-linecap="round"/>'
            f'<circle cx="80" cy="46" r="36" fill="#ffcf9e" {OL} stroke-width="5"/><path d="M44,46 A36,36 0 0 0 80,82 L80,10 A36,36 0 0 0 44,46 Z" fill="#000" opacity=".1"/><path d="M80,10 Q86,2 94,6" fill="none" {OL} stroke-width="4" stroke-linecap="round"/>'
            +eyes_dot(66,94,48)+f'<ellipse cx="54" cy="60" rx="7" ry="5" fill="#ff8aa8" opacity=".8"/><ellipse cx="106" cy="60" rx="7" ry="5" fill="#ff8aa8" opacity=".8"/>'+mouth_o(80,64))

# ---- 小道具 ----
def prop_power():  # 力：力こぶの腕（すき）
    return (f'<path d="M30,30 L118,30 Q134,30 130,46 L118,118 Q114,140 92,136" fill="none" {OL} stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<path d="M30,30 L118,30 Q134,30 130,46 L118,118 Q114,140 92,136" fill="none" stroke="#ffcf9e" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<path d="M68,34 Q66,90 28,146" fill="none" {OL} stroke-width="26" stroke-linecap="round"/><path d="M68,34 Q66,90 28,146" fill="none" stroke="#ffcf9e" stroke-width="16" stroke-linecap="round"/>'
            f'<circle cx="104" cy="72" r="18" fill="#ffb86b" {OL} stroke-width="4"/><path d="M96,66 Q104,58 112,66" fill="none" {OL} stroke-width="3" stroke-linecap="round"/>')
def prop_stake():  # 十：十字の杭
    return f'<path d="M80,20 L80,150 M24,76 L136,76" {OL} stroke-width="18" stroke-linecap="round"/><path d="M80,20 L80,150 M24,76 L136,76" stroke="#c9a66b" stroke-width="10" stroke-linecap="round"/>'
def prop_grass_hat():  # 艹：草の帽子
    return (f'<path d="M14,40 L146,40" {OL} stroke-width="16" stroke-linecap="round"/><path d="M14,40 L146,40" stroke="#5fb860" stroke-width="9" stroke-linecap="round"/>'
            f'<path d="M50,52 L46,8 M110,52 L114,8" {OL} stroke-width="16" stroke-linecap="round"/><path d="M50,52 L46,8 M110,52 L114,8" stroke="#5fb860" stroke-width="9" stroke-linecap="round"/>'
            f'<path d="M46,8 Q36,0 30,6 M114,8 Q124,0 130,6" fill="none" stroke="#5fb860" stroke-width="6" stroke-linecap="round"/>')
def prop_roof():  # 宀：おうちの屋根
    return (f'<path d="M22,56 L80,16 L138,56 Z" fill="#e26b5a" {OL} stroke-width="5" stroke-linejoin="round"/><path d="M22,56 L80,16 L80,56 Z" fill="#000" opacity=".12"/>'
            f'<rect x="74" y="4" width="12" height="14" rx="3" fill="#8a5a3a" {OL} stroke-width="3"/><path d="M30,56 L30,72 M130,56 L130,72" {OL} stroke-width="10" stroke-linecap="round"/><path d="M30,56 L30,72 M130,56 L130,72" stroke="#e26b5a" stroke-width="5" stroke-linecap="round"/>')
def prop_ruler():  # 寸：ものさし（手に持つ）
    return (f'<rect x="30" y="58" width="100" height="22" rx="6" fill="#ffe08a" {OL} stroke-width="4"/><g {OL} stroke-width="2.5"><path d="M44,58 L44,68 M58,58 L58,72 M72,58 L72,68 M86,58 L86,72 M100,58 L100,68 M114,58 L114,72"/></g>'
            f'<path d="M80,82 L80,140 Q80,152 66,150" fill="none" {OL} stroke-width="14" stroke-linecap="round"/><path d="M80,82 L80,140 Q80,152 66,150" fill="none" stroke="#c9a66b" stroke-width="7" stroke-linecap="round"/><circle cx="54" cy="104" r="7" fill="#2a2a3a"/>')
def prop_legs():  # 儿：あんよ
    return (f'<path d="M62,20 Q56,80 30,140" fill="none" {OL} stroke-width="22" stroke-linecap="round"/><path d="M62,20 Q56,80 30,140" fill="none" stroke="#ffcf9e" stroke-width="13" stroke-linecap="round"/>'
            f'<path d="M98,20 L100,120 Q102,140 128,134" fill="none" {OL} stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/><path d="M98,20 L100,120 Q102,140 128,134" fill="none" stroke="#ffcf9e" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<ellipse cx="26" cy="148" rx="14" ry="6" fill="#e04a4a" {OL} stroke-width="4"/><ellipse cx="134" cy="146" rx="14" ry="6" fill="#e04a4a" {OL} stroke-width="4"/>')
def prop_sparkle(x,y,s=1): return f'<polygon points="{x},{y-10*s} {x+3*s},{y-3*s} {x+10*s},{y} {x+3*s},{y+3*s} {x},{y+10*s} {x-3*s},{y+3*s} {x-10*s},{y} {x-3*s},{y-3*s}" fill="#ffcc33"/>'

# ---- 合体シーン ----
SCENES=[
 ('休','やすむ','左右','ひとっち＋きーぼう','人が木にもたれて昼寝。「きに もたれて、やすむ」',
   g(-30,24,0.85,person('sleep'),rot=14,cx=80,cy=140)+g(36,18,0.9,tree('smile'))+'<path d="M118,40 L130,40 L118,52 L130,52" fill="none" '+OL+' stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'),
 ('明','あかるい','左右','ひーさま＋つきまる','太陽と月が並ぶと牧場がパッと明るくなる。「ひと つきで、あかるい！」',
   prop_sparkle(14,24)+prop_sparkle(148,30,0.8)+prop_sparkle(150,120,0.7)+g(-28,12,0.88,sun('awake'))+g(34,10,0.92,moon())),
 ('出','でる','上下','やまちゃん×2','山が山に肩車して、上の山が顔を出す。「やまの うえに やま、でる！」',
   g(22,-34,0.72,mountain('awake'))+g(0,36,0.9,mountain('half'))),
 ('名','なまえ','上下','ゆうこ＋くちべえ','夕方、口が「おーい」と名前を呼ぶ。「ゆうがた くちで よぶ、なまえ」',
   g(20,-20,0.74,evening())+g(8,52,0.84,mouth_char())+'<path d="M126,100 Q140,96 146,86 M128,110 Q146,110 152,104" fill="none" '+OL+' stroke-width="3.5" stroke-linecap="round" opacity=".7"/>'),
 ('男','おとこ','上下','たんぼ＋力こぶ','田んぼの下で力こぶが踏んばる。「たんぼで ちからを だす、おとこ」',
   g(16,46,0.74,prop_power())+g(20,-16,0.74,field())+'<path d="M134,54 C128,64 128,72 134,74 C140,72 140,64 134,54 Z" fill="#7fc8ff" '+OL+' stroke-width="2.5"/>'),
 ('見','みる','上下','めだまん＋あんよ','目に足が生えて歩き回る。「めが あるいて、みる」',
   g(16,54,0.7,prop_legs())+g(22,-14,0.72,eye_char())+'<g stroke="#2a2a3a" stroke-width="3" stroke-linecap="round" opacity=".5"><line x1="6" y1="120" x2="22" y2="120"/><line x1="4" y1="132" x2="20" y2="132"/></g>'),
]
SCENES2=[
 ('早','はやい','上下','ひーさま＋十（杭）','朝日が杭の上に顔を出す。「あさの ひが でた、はやい」',
   g(18,62,0.68,prop_stake())+g(22,-20,0.72,sun('awake'))),
 ('草','くさ','上下','草の帽子＋早','早に草の帽子をかぶせる。「はっぱの ぼうし、くさ」',
   g(24,80,0.6,prop_stake())+g(26,8,0.64,sun('awake',rays=False))+g(16,-6,0.8,prop_grass_hat())),
 ('本','もと・ほん','重ね','きーぼう＋一（印）','木の根元に「ここ！」の印。「きの ねもとが、もと（ほん）」',
   g(8,4,0.9,tree('awake'))+'<path d="M40,134 L120,134" stroke="#2a2a3a" stroke-width="12" stroke-linecap="round"/><path d="M40,134 L120,134" stroke="#ff7a59" stroke-width="6" stroke-linecap="round"/>'+prop_sparkle(34,122,0.7)+prop_sparkle(126,122,0.7)),
 ('村','むら','左右','きーぼう＋ものさし（寸）','木をはかって家を建てる。「きを はかって、むら」',
   g(-28,14,0.9,tree('awake',arms=False))+g(62,20,0.82,prop_ruler())+'<path d="M48,90 Q70,78 92,88" fill="none" stroke="#8b5a2b" stroke-width="12" stroke-linecap="round"/><path d="M22,88 Q4,106 2,130" fill="none" stroke="#8b5a2b" stroke-width="12" stroke-linecap="round"/>'),
 ('字','じ','上下','屋根＋こぼう','おうちの中で赤ちゃんが育つ＝字が増える。「おうちで そだつ、じ」',
   g(18,44,0.78,baby())+g(0,-8,1.0,prop_roof())),
 ('音','おと','上下','たっちゃん＋ひーさま','立の下の日が口になって声を出す。「たって くちから、おと」',
   g(22,56,0.66,sun('open',rays=False))+g(24,-26,0.7,tachan())+'<path d="M128,100 Q140,96 146,86 M130,112 Q148,112 154,104 M128,124 Q142,128 146,138" fill="none" '+OL+' stroke-width="3.5" stroke-linecap="round" opacity=".7"/>'),
]

def board(num,title,sub,scenes,bg,badge):
    cells=''
    for gly,yomi,lay,parts,desc,svg in scenes:
        cells+=f'''
    <div style="display: flex; flex-direction: row; align-items: center; gap: 8px; background: #fff; border-radius: 22px; padding: 8px 10px">
      <svg viewBox="0 0 160 160" width="150" height="150" role="img" aria-label="{gly}のシーン">
        {svg}
      </svg>
      <div style="display:flex;flex-direction:column;gap:2px;min-width:0"><div style="font-size: 26px; font-weight: 900; line-height: 1">{gly} <span style="font-size:13px;color:#3b6fd9">{lay}</span></div><div style="font-size: 13px; font-weight: 900">{yomi}　<span style="font-weight:700;color:#6b5f4a">{parts}</span></div><div style="font-size: 10.5px; color: #6b5f4a">{desc}</div></div>
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
open(os.path.join(OUT,'A14_Gattai1.dc.html'),'w',encoding='utf-8').write(board('A-14','合体字のシーン1','親キャラは8〜9割の大きさのまま重ねて、枠いっぱいの1キャラに',SCENES,'#fff6d6','#ff7a59'))
open(os.path.join(OUT,'A15_Gattai2.dc.html'),'w',encoding='utf-8').write(board('A-15','合体字のシーン2','小道具（杭・草の帽子・ものさし・屋根）つき',SCENES2,'#fff6d6','#ff7a59'))
print('ok')

# ---------- 追加の小道具 ----------
def prop_hand():  # ナ：手（横棒＝腕、ノ＝親指）。右手でさす
    return (f'<path d="M14,50 L120,50" {OL} stroke-width="26" stroke-linecap="round"/><path d="M14,50 L120,50" stroke="#ffcf9e" stroke-width="16" stroke-linecap="round"/>'
            f'<path d="M76,56 Q60,96 34,136" fill="none" {OL} stroke-width="24" stroke-linecap="round"/><path d="M76,56 Q60,96 34,136" fill="none" stroke="#ffcf9e" stroke-width="14" stroke-linecap="round"/>'
            f'<circle cx="124" cy="50" r="16" fill="#ffcf9e" {OL} stroke-width="4"/><path d="M132,36 L146,30 M136,50 L152,50 M132,64 L146,70" {OL} stroke-width="7" stroke-linecap="round"/><path d="M132,36 L146,30 M136,50 L152,50 M132,64 L146,70" stroke="#ffcf9e" stroke-width="3.5" stroke-linecap="round"/>')
def prop_tool():  # 工：道具（I字の台）
    return (f'<path d="M30,34 L130,34 M80,34 L80,126 M24,126 L136,126" {OL} stroke-width="20" stroke-linecap="round"/><path d="M30,34 L130,34 M80,34 L80,126 M24,126 L136,126" stroke="#9aa3ad" stroke-width="11" stroke-linecap="round"/>'
            f'<circle cx="60" cy="80" r="3.5" fill="#2a2a3a"/><circle cx="100" cy="80" r="3.5" fill="#2a2a3a"/><path d="M72,94 Q80,100 88,94" fill="none" {OL} stroke-width="2.5" stroke-linecap="round"/>')
def prop_nail():  # 丁：くぎ
    return (f'<path d="M30,34 L130,34" {OL} stroke-width="20" stroke-linecap="round"/><path d="M30,34 L130,34" stroke="#8a8f99" stroke-width="11" stroke-linecap="round"/>'
            f'<path d="M80,40 L80,118 Q80,134 64,132" fill="none" {OL} stroke-width="18" stroke-linecap="round"/><path d="M80,40 L80,118 Q80,134 64,132" fill="none" stroke="#8a8f99" stroke-width="9" stroke-linecap="round"/>'
            f'<path d="M100,120 L116,104 M104,132 L124,128" {OL} stroke-width="4" stroke-linecap="round" opacity=".6"/>')
def prop_pole():  # 丨：旗つきの棒
    return (f'<path d="M80,6 L80,154" {OL} stroke-width="16" stroke-linecap="round"/><path d="M80,6 L80,154" stroke="#c9a66b" stroke-width="8" stroke-linecap="round"/>'
            f'<path d="M86,10 L130,22 L86,36 Z" fill="#ff7a59" {OL} stroke-width="4" stroke-linejoin="round"/>')
def prop_sprout():  # 屮：芽
    return (f'<path d="M80,150 L80,70" {OL} stroke-width="16" stroke-linecap="round"/><path d="M80,150 L80,70" stroke="#5a9e3a" stroke-width="8" stroke-linecap="round"/>'
            f'<path d="M80,92 Q52,86 40,56 Q72,58 80,92 Z" fill="#6ec46a" {OL} stroke-width="4" stroke-linejoin="round"/><path d="M80,80 Q108,74 120,44 Q88,46 80,80 Z" fill="#6ec46a" {OL} stroke-width="4" stroke-linejoin="round"/>'
            f'<circle cx="80" cy="60" r="10" fill="#8fdcb0" {OL} stroke-width="4"/>')
def prop_well():  # 丹／井：水の入った井戸（青の由来）
    return (f'<rect x="34" y="30" width="92" height="110" rx="14" fill="#4fb3f0" {OL} stroke-width="5"/><path d="M34,50 L34,120 Q34,140 54,140 L56,140 L56,30 L54,30 Q34,30 34,50 Z" fill="#000" opacity=".1"/>'
            f'<path d="M48,66 Q64,58 80,66 Q96,74 112,66 M48,96 Q64,88 80,96 Q96,104 112,96" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>'
            f'<circle cx="68" cy="120" r="4" fill="#2a2a3a"/><circle cx="92" cy="120" r="4" fill="#2a2a3a"/>')
def prop_foot():  # 止：足あと（足）
    return (f'<path d="M50,30 L52,120 Q52,136 68,136 L128,136" fill="none" {OL} stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/><path d="M50,30 L52,120 Q52,136 68,136 L128,136" fill="none" stroke="#ffcf9e" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<path d="M94,60 L94,110" {OL} stroke-width="18" stroke-linecap="round"/><path d="M94,60 L94,110" stroke="#ffcf9e" stroke-width="9" stroke-linecap="round"/>'
            f'<ellipse cx="104" cy="150" rx="40" ry="8" fill="#e04a4a" {OL} stroke-width="4"/>')
def prop_steam():  # 气：湯気
    return (f'<path d="M40,120 Q24,100 44,86 Q62,74 48,56 Q36,42 56,30" fill="none" {OL} stroke-width="14" stroke-linecap="round"/><path d="M40,120 Q24,100 44,86 Q62,74 48,56 Q36,42 56,30" fill="none" stroke="#dfe9f3" stroke-width="7" stroke-linecap="round"/>'
            f'<path d="M80,120 Q64,100 84,86 Q102,74 88,56 Q76,42 96,30" fill="none" {OL} stroke-width="14" stroke-linecap="round"/><path d="M80,120 Q64,100 84,86 Q102,74 88,56 Q76,42 96,30" fill="none" stroke="#dfe9f3" stroke-width="7" stroke-linecap="round"/>'
            f'<path d="M120,120 Q104,100 124,86 Q142,74 128,56 Q116,42 136,30" fill="none" {OL} stroke-width="14" stroke-linecap="round"/><path d="M120,120 Q104,100 124,86 Q142,74 128,56 Q116,42 136,30" fill="none" stroke="#dfe9f3" stroke-width="7" stroke-linecap="round"/>')
def prop_bowl():  # ごはん茶碗（気の下のメ＝米つぶ）
    return (f'<path d="M26,96 L134,96 Q130,150 80,152 Q30,150 26,96 Z" fill="#fff" {OL} stroke-width="5" stroke-linejoin="round"/><path d="M26,96 L80,96 L80,152 Q30,150 26,96 Z" fill="#000" opacity=".08"/>'
            f'<ellipse cx="80" cy="96" rx="54" ry="14" fill="#fff6e0" {OL} stroke-width="5"/><g fill="#fff" {OL} stroke-width="2"><ellipse cx="60" cy="92" rx="7" ry="4"/><ellipse cx="80" cy="88" rx="7" ry="4"/><ellipse cx="100" cy="92" rx="7" ry="4"/><ellipse cx="70" cy="100" rx="7" ry="4"/><ellipse cx="92" cy="100" rx="7" ry="4"/></g>'
            f'<circle cx="66" cy="124" r="4" fill="#2a2a3a"/><circle cx="94" cy="124" r="4" fill="#2a2a3a"/><path d="M74,134 Q80,139 86,134" fill="none" {OL} stroke-width="2.5" stroke-linecap="round"/>')
def prop_roof2():  # 𠆢：とんがり屋根（金・会）
    return f'<path d="M14,70 L80,14 L146,70 Z" fill="#ffd23f" {OL} stroke-width="5" stroke-linejoin="round"/><path d="M14,70 L80,14 L80,70 Z" fill="#000" opacity=".12"/>'
def prop_cloth():  # 冖＋⺍：布と3つのひらめき
    return (f'<path d="M20,60 L140,60 L140,76 L20,76 Z" fill="#c7a7ff" {OL} stroke-width="5" stroke-linejoin="round"/><path d="M20,76 L20,92 M140,76 L140,92" {OL} stroke-width="10" stroke-linecap="round"/><path d="M20,76 L20,92 M140,76 L140,92" stroke="#c7a7ff" stroke-width="5" stroke-linecap="round"/>'
            f'<path d="M46,44 L40,16 M80,44 L80,12 M114,44 L120,16" {OL} stroke-width="12" stroke-linecap="round"/><path d="M46,44 L40,16 M80,44 L80,12 M114,44 L120,16" stroke="#ffcc33" stroke-width="6" stroke-linecap="round"/>')
def person_cross():  # 交：帽子をかぶって足を組んだ人
    return (f'<path d="M58,66 L104,130 M102,66 L56,130" {OL} stroke-width="22" stroke-linecap="round"/><path d="M58,66 L104,130 M102,66 L56,130" stroke="#ffcf9e" stroke-width="13" stroke-linecap="round"/>'
            f'<circle cx="80" cy="44" r="30" fill="#ffcf9e" {OL} stroke-width="5"/><path d="M50,44 A30,30 0 0 0 80,74 L80,14 A30,30 0 0 0 50,44 Z" fill="#000" opacity=".1"/>'
            f'<path d="M44,26 L116,26" {OL} stroke-width="12" stroke-linecap="round"/><path d="M44,26 L116,26" stroke="#5f6fd9" stroke-width="6" stroke-linecap="round"/><circle cx="80" cy="10" r="7" fill="#5f6fd9" {OL} stroke-width="3"/>'
            +eyes_dot(68,92,46)+cheeks(58,102,58)+mouth_cat(80,62))
def big_person():  # 大：でっかいさん（上半身中心）
    return (f'<path d="M78,76 Q62,104 40,142" fill="none" {OL} stroke-width="22" stroke-linecap="round"/><path d="M78,76 Q62,104 40,142" fill="none" stroke="#ffb86b" stroke-width="13" stroke-linecap="round"/>'
            f'<path d="M82,76 Q98,104 120,142" fill="none" {OL} stroke-width="22" stroke-linecap="round"/><path d="M82,76 Q98,104 120,142" fill="none" stroke="#ffb86b" stroke-width="13" stroke-linecap="round"/>'
            f'<path d="M14,66 L146,66" {OL} stroke-width="20" stroke-linecap="round"/><path d="M14,66 L146,66" stroke="#ffb86b" stroke-width="11" stroke-linecap="round"/>'
            f'<circle cx="80" cy="42" r="34" fill="#ffb86b" {OL} stroke-width="5"/><path d="M46,42 A34,34 0 0 0 80,76 L80,8 A34,34 0 0 0 46,42 Z" fill="#000" opacity=".1"/>'
            +eyes_awake(68,92,42)+cheeks(56,104,54)+mouth_big(80,58))
def fire():
    return (f'<path d="M30,62 C22,74 24,88 34,92 C44,88 46,74 30,62 Z" fill="#ffb347" {OL} stroke-width="4" stroke-linejoin="round"/><path d="M130,62 C122,74 124,88 134,92 C144,88 146,74 130,62 Z" fill="#ffb347" {OL} stroke-width="4" stroke-linejoin="round"/>'
            f'<path d="M80,16 C100,48 128,68 124,106 C121,136 98,150 80,150 C62,150 39,136 36,106 C32,68 60,48 80,16 Z" fill="#ff6b3d" {OL} stroke-width="5" stroke-linejoin="round"/><path d="M80,16 C60,48 32,68 36,106 C39,136 62,150 80,150 L82,150 L82,16 Z" fill="#000" opacity=".12"/>'
            f'<path d="M80,60 C92,80 106,90 104,112 C102,130 90,138 80,138 C70,138 58,130 56,112 C54,90 68,80 80,60 Z" fill="#ffd93d"/>'
            +eyes_awake(68,102)+cheeks(56,104,118)+mouth_smile(80,120))
def earth():
    return (f'<path d="M20,138 Q30,88 80,84 Q130,88 140,138 Z" fill="#b5804a" {OL} stroke-width="5" stroke-linejoin="round"/><path d="M20,138 Q30,88 80,84 L80,138 Z" fill="#000" opacity=".12"/>'
            f'<rect x="72" y="36" width="16" height="56" rx="6" fill="#8b5a2b" {OL} stroke-width="4"/><path d="M44,40 L116,40" {OL} stroke-width="14" stroke-linecap="round"/><path d="M44,40 L116,40" stroke="#b5804a" stroke-width="7" stroke-linecap="round"/>'
            +eyes_dot(64,96,112)+cheeks(50,110,124)+mouth_cat(80,124)+f'<path d="M24,138 L136,138" {OL} stroke-width="5" stroke-linecap="round"/>')

SCENES3=[
 ('白','しろ','重ね','ひーさま＋光（ノ）','日のてっぺんから光がひとすじ。白くまぶしい。「ひの ひかり、しろ」',
   g(16,12,0.84,sun('awake',rays=False).replace('#ffd23f','#fffbe6').replace('#ffb400','#f0e0a0'))+f'<path d="M80,4 L66,30" {OL} stroke-width="12" stroke-linecap="round"/><path d="M80,4 L66,30" stroke="#fff" stroke-width="6" stroke-linecap="round"/>'+prop_sparkle(22,28)+prop_sparkle(138,34,0.8)+prop_sparkle(24,130,0.7)),
 ('百','ひゃく','上下','一＋白','白の上に棒を1本。「しろの うえに いち、ひゃく」',
   g(24,34,0.7,sun('awake',rays=False).replace('#ffd23f','#fffbe6').replace('#ffb400','#f0e0a0'))+f'<path d="M76,36 L64,56" {OL} stroke-width="10" stroke-linecap="round"/><path d="M76,36 L64,56" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M18,18 L142,18" {OL} stroke-width="20" stroke-linecap="round"/><path d="M18,18 L142,18" stroke="#ff7a59" stroke-width="11" stroke-linecap="round"/>'),
 ('右','みぎ','上下','手（ナ）＋くちべえ','右手で口をさす。「みぎてで くちを、みぎ」',
   g(10,56,0.7,mouth_char())+g(8,-14,0.82,prop_hand())),
 ('左','ひだり','上下','手（ナ）＋工（道具）','左手で道具をささえる。「ひだりてで どうぐを、ひだり」',
   g(14,54,0.68,prop_tool())+g(-6,-14,0.82,f'<g transform="translate(160,0) scale(-1,1)">{prop_hand()}</g>')),
 ('中','なか','貫く','くちべえ＋旗の棒（丨）','口のまん中に旗の棒がささる。「まんなかに ぼう、なか」',
   g(8,26,0.86,mouth_char())+g(16,0,0.82,prop_pole())),
 ('千','せん','重ね','ノ＋十（杭）＋たくさんの粒','杭に帽子をかぶせたらいっぱいになった。「じゅうの うえに、せん」',
   g(16,10,0.84,prop_stake())+f'<path d="M100,18 L56,34" {OL} stroke-width="16" stroke-linecap="round"/><path d="M100,18 L56,34" stroke="#ff7a59" stroke-width="9" stroke-linecap="round"/>'+''.join(prop_sparkle(x,y,0.55) for x,y in [(22,70),(140,66),(26,120),(134,124),(46,146),(116,146)])),
]
SCENES4=[
 ('生','うまれる','上下','芽＋つっちー','土から芽が出る。「つちから めが でて、うまれる」',
   g(12,40,0.84,earth())+g(28,-18,0.68,prop_sprout())),
 ('青','あお','上下','芽＋井戸の水','生えた草と澄んだ水の色。「くさと みずの いろ、あお」',
   g(28,-30,0.6,prop_sprout())+g(22,52,0.68,prop_well())),
 ('赤','あか','上下','でっかいさん＋ひーくん','大きな火が燃える色。「おおきな ひの いろ、あか」',
   g(22,54,0.68,fire())+g(22,-22,0.72,big_person())),
 ('正','ただしい','上下','一＋足（止）','線まで足がまっすぐ進む。「まっすぐ すすんで、ただしい」',
   g(14,30,0.78,prop_foot())+f'<path d="M20,18 L140,18" {OL} stroke-width="20" stroke-linecap="round"/><path d="M20,18 L140,18" stroke="#ff7a59" stroke-width="11" stroke-linecap="round"/><path d="M28,56 L28,30 M22,38 L28,30 L34,38" fill="none" {OL} stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" opacity=".6"/>'),
 ('町','まち','左右','たんぼ＋くぎ（丁）','田んぼの横にくぎで区切り。「たんぼの よこ、まち」',
   g(-26,18,0.84,field())+g(60,22,0.8,prop_nail())),
 ('校','こう','左右','きーぼう＋交（足を組んだ人）','木と人が交わる＝学校。「きの となりに、こう」',
   g(-30,14,0.9,tree('smile',arms=False))+g(50,20,0.86,person_cross())+'<path d="M44,90 Q64,80 84,92" fill="none" stroke="#8b5a2b" stroke-width="12" stroke-linecap="round"/><path d="M20,88 Q4,106 2,130" fill="none" stroke="#8b5a2b" stroke-width="12" stroke-linecap="round"/>'),
]
SCENES5=[
 ('空','そら','上下','屋根＋穴＋工（道具）','屋根の下を道具で掘って穴があく。「あなが あいて、そら」',
   g(0,-6,1.0,prop_roof())+f'<ellipse cx="80" cy="96" rx="46" ry="30" fill="#8fd3ff" {OL} stroke-width="5"/><ellipse cx="66" cy="88" rx="12" ry="5" fill="#fff" opacity=".9"/><ellipse cx="94" cy="102" rx="14" ry="5" fill="#fff" opacity=".9"/>'+g(34,74,0.56,prop_tool())),
 ('気','き','囲み','湯気（气）＋ごはん（メ）','ごはんの湯気が立ちのぼる。「ゆげが たつ、き」',
   g(10,60,0.9,prop_bowl())+g(10,-10,0.9,prop_steam())),
 ('金','きん','上下','とんがり屋根＋つっちー＋きらきら2つ','土の中に光る粒。「つちの なかの きらきら、きん」',
   g(12,44,0.8,earth())+g(0,-4,1.0,prop_roof2())+prop_sparkle(52,104,0.9)+prop_sparkle(108,104,0.9)),
 ('花','はな','上下','草の帽子＋ひとっち＋花（匕）','草の帽子の下で人がかわって花が咲く。「はっぱの したで、はな」',
   g(-18,36,0.74,person('awake'))+f'<path d="M116,80 L116,140" {OL} stroke-width="10" stroke-linecap="round"/><path d="M116,80 L116,140" stroke="#5a9e3a" stroke-width="5" stroke-linecap="round"/><g fill="#ff8ab0" {OL} stroke-width="3"><circle cx="116" cy="62" r="9"/><circle cx="100" cy="74" r="9"/><circle cx="132" cy="74" r="9"/><circle cx="106" cy="90" r="9"/><circle cx="126" cy="90" r="9"/></g><circle cx="116" cy="76" r="9" fill="#ffd23f" {OL} stroke-width="3"/>'+g(12,-6,0.86,prop_grass_hat())),
 ('学','がく','上下','ひらめき＋布（冖）＋こぼう','布の下で子どもがひらめく。「こどもが まなぶ、がく」',
   g(18,56,0.72,baby())+g(8,-6,0.9,prop_cloth())),
 ('先','さき','上下','足あと＋あんよ','先に歩いた足あとのほうへ。「さきに あるいた、さき」',
   g(14,54,0.7,prop_legs())+g(28,-26,0.6,prop_foot())+f'<path d="M122,40 L146,40 M138,32 L146,40 L138,48" fill="none" {OL} stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".6"/>'),
]
open(os.path.join(OUT,'A16_Gattai3.dc.html'),'w',encoding='utf-8').write(board('A-16','合体字のシーン3','白・百・右・左・中・千',SCENES3,'#fff6d6','#ff7a59'))
open(os.path.join(OUT,'A17_Gattai4.dc.html'),'w',encoding='utf-8').write(board('A-17','合体字のシーン4','生・青・赤・正・町・校',SCENES4,'#fff6d6','#ff7a59'))
open(os.path.join(OUT,'A18_Gattai5.dc.html'),'w',encoding='utf-8').write(board('A-18','合体字のシーン5','空・気・金・花・学・先',SCENES5,'#fff6d6','#ff7a59'))
print('ok2')
