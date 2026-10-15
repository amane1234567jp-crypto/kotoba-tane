import json,re,hashlib,sys,glob
sys.path.insert(0,'/tmp/claude-0/-home-claude/a581a6c5-b8bb-55ce-8f69-11dc409c4111/scratchpad/tools')
from yomi_map import Y
D='/tmp/claude-0/-home-claude/a581a6c5-b8bb-55ce-8f69-11dc409c4111/scratchpad/'
L=json.load(open(D+'tools/lines.json',encoding='utf-8'))
W=json.load(open(D+'app/world.js',encoding='utf-8').read().split('=',1)[1].rstrip(';\n')) if False else None
ws=open(D+'app/world.js',encoding='utf-8').read(); W=json.loads(ws[ws.index('{'):ws.rindex('}')+1])
KN='〇一二三四五六七八九十'
def kn(n):
    n=int(n)
    if n<=10: return KN[n] if n<10 else '十'
    return ('' if n//10==1 else KN[n//10])+'十'+(KN[n%10] if n%10 else '')
def tk(s): return re.sub(r'\{([^|}]+)\|([^}]+)\}',lambda m:m[1],s)
REG={re.sub(r'\{([^|}]+)\|([^}]+)\}',lambda m:m[2],m['name']):tk(m['name']).replace(' ','') for m in W['maps']}
SAYW={
'みずスライムには、ほのおの「ひ」と、おひさまの「ひ」と、「つち」が つよい！':'みずスライムには、炎の火と、お日様の日と、土が強い！',
'ほのおスライムには、「みず」と「かわ」と「あめ」が つよい！':'ほのおスライムには、水と、川と、雨が強い！',
'くさスライムには、ほのおの「ひ」と、「むし」と、「て」が つよい！':'くさスライムには、炎の火と、虫と、手が強い！',
'いわスライムには、「みず」と「ちから」と「おおきい」と「き」が つよい！':'いわスライムには、水と、力と、大きいと、木が強い！',
'よるおばけには、おひさまの「ひ」と、ほのおの「ひ」と、「つき」と「おう」が つよい！':'よるおばけには、お日様の日と、炎の火と、月と、王が強い！',
'かぜスライムには、「やま」と「もり」と「はやし」と「いし」が つよい！':'かぜスライムには、山と、森と、林と、石が強い！',
'こおりスライムには、ほのおの「ひ」と、おひさまの「ひ」と、「てん」が つよい！':'こおりスライムには、炎の火と、お日様の日と、天が強い！',
'ねむねむスライムには、「おと」と「はやい」と「みみ」と「め」と「くち」が つよい！':'ねむねむスライムには、音と、早いと、耳と、目と、口が強い！',
'もじくいスライムには、「じ」と「ぶん」と「ほん」と「がく」と「な」が つよい！':'もじくいスライムには、字と、文と、本と、学と、名が強い！',
'まよいスライムには、「みぎ」「ひだり」「うえ」「した」「みる」が つよい！':'まよいスライムには、右、左、上、下、見るが強い！',
'いたずらカラスには、「ひと」と「おとこ」と「おんな」と「こ」と「いぬ」が つよい！':'いたずらカラスには、人と、男と、女と、子と、犬が強い！',
'いろぬすみスライムには、「あか」「あお」「しろ」「たま」が つよい！':'いろぬすみスライムには、赤、青、白、玉が強い！',
}
def yomi(s):
    if s in Y: return Y[s]
    if s in SAYW: return SAYW[s]
    pats=[(r'^たまごを みつけた！$',lambda m:'卵を見つけた！'),(r'^この じは「(.+)」。$',lambda m:'この字は、'+m[1]+'。'),
      (r'^10かい かいてね！$',lambda m:'十回、書いてね！'),(r'^うまれた！$',lambda m:'生まれた！'),(r'^つよいぞ！$',lambda m:'強いぞ！'),
      (r'^「(.+)」を かいて こうげき！$',lambda m:m[1]+'を書いて、攻撃！'),(r'^(.+)は つかれて ねむっちゃった。$',lambda m:m[1]+'は、疲れて眠っちゃった。'),
      (r'^つぎは (.+)！$',lambda m:'次は、'+m[1]+'！'),(r'^たのんだよ！$',lambda m:'頼んだよ！'),(r'^(.+)が レベルアップ！$',lambda m:m[1]+'が、レベルアップ！'),
      (r'^ボス「(.+)」が あらわれた！$',lambda m:'ボス、'+m[1]+'が現れた！'),(r'^ボス (.+)との たたかい！$',lambda m:'ボス、'+m[1]+'との戦い！'),
      (r'^まおう ヒラガナーとの たたかい！$',lambda m:'魔王ヒラガナーとの戦い！'),(r'^(.+)を たおした！$',lambda m:m[1]+'を倒した！'),
      (r'^ボス「(.+)」に さわって たたかおう！$',lambda m:'ボス、'+m[1].replace('まおう ','魔王')+'に触って、戦おう！'),(r'^(.+)が あらわれた！$',lambda m:m[1]+'が現れた！'),
      (r'^ここは「(.+)」。$',lambda m:'ここは、'+REG.get(m[1],m[1])+'。'),(r'^この くにには たまごが (\d+)こ。$',lambda m:'この国には、卵が'+kn(m[1])+'個。'),
      (r'^(\d+)かい$',lambda m:kn(m[1])+'回'),(r'^あと (\d+)かい！$',lambda m:'あと'+kn(m[1])+'回！'),(r'^のこり (\d+)$',lambda m:'残り'+kn(m[1]))]
    for p,f in pats:
        m=re.match(p,s)
        if m: return f(m)
    return s.replace(' ','')
CAST={'narr':'metan','fudeko':'pyon','anim':'mii','maouA':'ookami','maou':'ookami','boss':'tora','oba':'miibaa','oji':'kamejii','elder':'kamejii','king':'gaojii','farmer':'ojisan','boy':'kon','girl':'mii','traveler':'onii','fisher':'doshinpapa','woman':'mama','police':'omawari','clerk':'chu','teacher':'nobbo','drummer':'gao','sumo':'kuma','princess':'pyonmama','soldier':'onii','ghost':'meebaa'}
out=[];yo={}
for x in L:
    k=x['who']+'|'+x['s'];h=hashlib.md5(k.encode()).hexdigest()[:10]
    out.append({'key':'kb'+h,'who':'kb_'+x['who'],'text':x['s'],'pack':x['pack'],'k':k})
    yo['kb'+h]=yomi(x['s'])
json.dump(out,open(D+'tools/aivis_lines.json','w'),ensure_ascii=False,indent=0)
json.dump(yo,open(D+'tools/aivis_yomi.json','w'),ensure_ascii=False,indent=0)
json.dump(CAST,open(D+'tools/aivis_cast.json','w'),ensure_ascii=False)
print(len(out))
