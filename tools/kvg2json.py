import re, json, math, sys, os

KVG_DIR = sys.argv[1]
OUT = sys.argv[2]

ORDER = "一右雨円王音下火花貝学気九休玉金空月犬見五口校左三山子四糸字耳七車手十出女小上森人水正生青夕石赤千川先早草足村大男竹中虫町天田土二日入年白八百文木本名目立力林六"
READ = {'一':'いち','右':'みぎ','雨':'あめ','円':'えん','王':'おう','音':'おと','下':'した','火':'ひ','花':'はな','貝':'かい',
'学':'がく','気':'き','九':'きゅう','休':'やすむ','玉':'たま','金':'きん','空':'そら','月':'つき','犬':'いぬ','見':'みる',
'五':'ご','口':'くち','校':'こう','左':'ひだり','三':'さん','山':'やま','子':'こ','四':'し','糸':'いと','字':'じ',
'耳':'みみ','七':'しち','車':'くるま','手':'て','十':'じゅう','出':'でる','女':'おんな','小':'ちいさい','上':'うえ','森':'もり',
'人':'ひと','水':'みず','正':'ただしい','生':'いきる','青':'あお','夕':'ゆう','石':'いし','赤':'あか','千':'せん','川':'かわ',
'先':'さき','早':'はやい','草':'くさ','足':'あし','村':'むら','大':'おおきい','男':'おとこ','竹':'たけ','中':'なか','虫':'むし',
'町':'まち','天':'てん','田':'た','土':'つち','二':'に','日':'ひ','入':'はいる','年':'とし','白':'しろ','八':'はち',
'百':'ひゃく','文':'ぶん','木':'き','本':'ほん','名':'な','目':'め','立':'たつ','力':'ちから','林':'はやし','六':'ろく'}

HANE = set('㇁㇂㇃㇆㇈㇉㇌㇍㇖㇚㇟㇠')
HARAI = set('㇀㇇㇊㇋㇏㇒㇓㇙')

def end_kind(t):
    t = (t or '').split('/')[0]
    c = t[0] if t else ''
    if c in HANE: return 'hane'
    if c in HARAI: return 'harai'
    return 'tome'

num = re.compile(r'[-+]?(?:\d+\.\d*|\.\d+|\d+)(?:[eE][-+]?\d+)?')

def tokenize(d):
    toks = []
    for m in re.finditer(r'[MmCcLlZzHhVvSsQqTtAa]|' + num.pattern, d):
        s = m.group(0)
        toks.append(s if s.isalpha() else float(s))
    return toks

def bez(p0,p1,p2,p3,n=10):
    out=[]
    for i in range(1,n+1):
        t=i/n; u=1-t
        x=u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0]
        y=u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]
        out.append((x,y))
    return out

def flatten(d):
    toks=tokenize(d); i=0; cur=(0,0); pts=[]; cmd=None; prev_ctrl=None
    while i<len(toks):
        t=toks[i]
        if isinstance(t,str): cmd=t; i+=1; continue
        if cmd in ('M','m'):
            x,y=toks[i],toks[i+1]; i+=2
            cur=(x,y) if cmd=='M' else (cur[0]+x,cur[1]+y); pts.append(cur); cmd='L' if cmd=='M' else 'l'
        elif cmd in ('L','l'):
            x,y=toks[i],toks[i+1]; i+=2
            cur=(x,y) if cmd=='L' else (cur[0]+x,cur[1]+y); pts.append(cur)
        elif cmd in ('H','h'):
            x=toks[i]; i+=1; cur=(x,cur[1]) if cmd=='H' else (cur[0]+x,cur[1]); pts.append(cur)
        elif cmd in ('V','v'):
            y=toks[i]; i+=1; cur=(cur[0],y) if cmd=='V' else (cur[0],cur[1]+y); pts.append(cur)
        elif cmd in ('C','c'):
            vals=toks[i:i+6]; i+=6
            if cmd=='c':
                p1=(cur[0]+vals[0],cur[1]+vals[1]); p2=(cur[0]+vals[2],cur[1]+vals[3]); p3=(cur[0]+vals[4],cur[1]+vals[5])
            else:
                p1=(vals[0],vals[1]); p2=(vals[2],vals[3]); p3=(vals[4],vals[5])
            pts+=bez(cur,p1,p2,p3); prev_ctrl=p2; cur=p3
        elif cmd in ('S','s'):
            vals=toks[i:i+4]; i+=4
            if cmd=='s':
                p2=(cur[0]+vals[0],cur[1]+vals[1]); p3=(cur[0]+vals[2],cur[1]+vals[3])
            else:
                p2=(vals[0],vals[1]); p3=(vals[2],vals[3])
            p1=(2*cur[0]-prev_ctrl[0],2*cur[1]-prev_ctrl[1]) if prev_ctrl else cur
            pts+=bez(cur,p1,p2,p3); prev_ctrl=p2; cur=p3
        else:
            raise ValueError('unsupported cmd '+str(cmd))
    return pts

def resample(pts, step):
    out=[pts[0]]; acc=0.0
    for a,b in zip(pts,pts[1:]):
        d=math.hypot(b[0]-a[0],b[1]-a[1])
        if d==0: continue
        while acc+d>=step:
            t=(step-acc)/d
            a=(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t); out.append(a)
            d=math.hypot(b[0]-a[0],b[1]-a[1]); acc=0.0
        acc+=d
    if out[-1]!=pts[-1]: out.append(pts[-1])
    return out

def rdp(pts, eps):
    if len(pts)<3: return pts
    a,b=pts[0],pts[-1]; dx,dy=b[0]-a[0],b[1]-a[1]; L=math.hypot(dx,dy) or 1e-9
    maxd=0; idx=0
    for i in range(1,len(pts)-1):
        p=pts[i]; d=abs(dy*p[0]-dx*p[1]+b[0]*a[1]-b[1]*a[0])/L
        if d>maxd: maxd=d; idx=i
    if maxd>eps:
        return rdp(pts[:idx+1],eps)[:-1]+rdp(pts[idx:],eps)
    return [a,b]

SCALE=144/109.0; OFF=8.0
def tr(p): return [round(OFF+p[0]*SCALE,1), round(OFF+p[1]*SCALE,1)]

result=[]
for ch in ORDER:
    fn=os.path.join(KVG_DIR, format(ord(ch),'05x')+'.svg')
    svg=open(fn,encoding='utf-8').read()
    paths=re.findall(r'<path id="kvg:[0-9a-f]+-s(\d+)"(?:[^>]*?kvg:type="([^"]*)")?[^>]*?\sd="([^"]+)"',svg)
    paths.sort(key=lambda x:int(x[0]))
    strokes=[]; ends=[]
    for n,typ,d in paths:
        pts=flatten(d); pts=resample(pts,2.0); pts=rdp(pts,0.9)
        strokes.append([tr(p) for p in pts]); ends.append(end_kind(typ))
    result.append({'g':ch,'r':READ[ch],'s':strokes,'e':ends})

with open(OUT,'w',encoding='utf-8') as f:
    f.write('// KanjiVG (c) Ulrich Apel, CC BY-SA 3.0  http://kanjivg.tagaini.net  — 1年生80字を160x160の折れ線に変換\n')
    f.write('var KANJI1='+json.dumps(result,ensure_ascii=False,separators=(',',':'))+';\n')
print('kanji:',len(result),'bytes:',os.path.getsize(OUT))
for r in result[:3]+[x for x in result if x['g'] in '小木火']:
    print(r['g'],r['r'],len(r['s']),r['e'],[len(s) for s in r['s']])
