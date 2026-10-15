# かんじぼうけん：セリフの こえを VOICEVOX で つくる
#  python3 voice_gen.py check   … よみと アクセントを 一覧に する（合成しない）
#  python3 voice_gen.py synth   … こえを つくって app/voice/ に パックを かきだす
import json, re, sys, os, glob, base64, subprocess, hashlib, time
D='/tmp/claude-0/-home-claude/a581a6c5-b8bb-55ce-8f69-11dc409c4111/scratchpad/'
VV='/tmp/vv/'
from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile, UserDict
from voicevox_core import UserDictWord

# だれ → (style id, はやさ, たかさ, よくよう)
SPK={
 'narr':(2,.95,0,1.12), 'fudeko':(3,.98,0,1.18), 'anim':(8,1.0,0,1.2),
 'maouA':(81,.92,-.02,1.25), 'maou':(83,.95,0,1.15), 'boss':(88,.95,0,1.2),
 'oba':(80,.9,0,1.05), 'oji':(42,.9,0,1.05), 'elder':(42,.88,0,1.0), 'farmer':(11,.95,0,1.1),
 'boy':(32,1.0,0,1.15), 'girl':(45,.98,0,1.15), 'traveler':(52,.95,0,1.05), 'fisher':(12,.95,0,1.1),
 'woman':(16,.95,0,1.1), 'police':(13,.95,0,1.05), 'clerk':(57,1.0,0,1.15), 'teacher':(14,.92,0,1.1),
 'drummer':(39,.98,0,1.2), 'sumo':(40,.92,-.03,1.15), 'king':(53,.9,0,1.1), 'princess':(15,.95,0,1.1),
 'soldier':(21,1.0,0,1.15), 'ghost':(102,.95,0,1.1),
}
# なまえなど、ひとつの ことばとして よませたい もの（よみ, アクセント位置）
WORDS=[('ふでこ','フデコ',1),('ヒラガナー','ヒラガナー',4),('ひらがな','ヒラガナ',3),('レベルアップ','レベルアップ',4),
 ('ばつぐん','バツグン',0),('ゴロゴロキング','ゴロゴロキング',5),('メラメラドン','メラメラドン',4),('ヨルノヌシ','ヨルノヌシ',3),
 ('ボスガラス','ボスガラス',3),('モジクイドン','モジクイドン',4),('ネムネムカバ','ネムネムカバ',4),('フブキング','フブキング',3),('イロヌスミ','イロヌスミ',3),
 ('スライム','スライム',2),('みずスライム','ミズスライム',3),('ほのおスライム','ホノオスライム',4),('くさスライム','クサスライム',3),('いわスライム','イワスライム',3),
 ('かぜスライム','カゼスライム',3),('こおりスライム','コオリスライム',4),('ねむねむスライム','ネムネムスライム',5),('もじくいスライム','モジクイスライム',5),
 ('まよいスライム','マヨイスライム',4),('いろぬすみスライム','イロヌスミスライム',6),('よるおばけ','ヨルオバケ',3),('いたずらカラス','イタズラカラス',5),
 ('かんじぼうけん','カンジボウケン',4)]

def kata(s): return ''.join(chr(ord(c)+0x60) if 'ぁ'<=c<='ゖ' else c for c in s)
VOW={}
for row,v in [('アカサタナハマヤラワガザダバパァャヮ','ア'),('イキシチニヒミリギジヂビピィ','イ'),('ウクスツヌフムユルグズヅブプゥュヴ','ウ'),('エケセテネヘメレゲゼデベペェ','エ'),('オコソトノホモヨロゴゾドボポォョヲ','オ')]:
    for c in row: VOW[c]=v
def norm(k):
    k=re.sub(r"[^ァ-ヶー]","",kata(k)).replace('ヲ','オ').replace('ワ','ハ').replace('ヘ','エ').replace('ヂ','ジ').replace('ヅ','ズ')
    out=''
    for c in k:
        if c=='ー' and out: c=VOW.get(out[-1],'')
        if out and c=='ウ' and VOW.get(out[-1])=='オ': c='オ'
        if out and c=='イ' and VOW.get(out[-1])=='エ': c='エ'
        out+=c
    # ャュョ の 母音
    return out.replace('ャ','ア').replace('ュ','ウ').replace('ョ','オ').replace('ァ','ア').replace('ィ','イ').replace('ェ','エ').replace('ォ','オ')

def tokens_kanji(src): return re.sub(r'\{([^|}]+)\|([^}]+)\}',lambda m:m[1],src)
def tokens_kana(src): return re.sub(r'\{([^|}]+)\|([^}]+)\}',lambda m:m[2],src)
N1={1:'いち',2:'に',3:'さん',4:'よん',5:'ご',6:'ろく',7:'なな',8:'はち',9:'きゅう',10:'じゅう',100:'ひゃく',1000:'せん'}
CNT={'かい':{1:'いっかい',6:'ろっかい',8:'はっかい',10:'じゅっかい'},'こ':{1:'いっこ',6:'ろっこ',8:'はっこ',10:'じゅっこ'},
 'ぽん':{1:'いっぽん',2:'にほん',3:'さんぼん',4:'よんほん',5:'ごほん',6:'ろっぽん',8:'はっぽん',10:'じゅっぽん'},
 'ぴき':{1:'いっぴき',2:'にひき',3:'さんびき',6:'ろっぴき',10:'じゅっぴき'},
 'つ':{1:'ひとつ',2:'ふたつ',3:'みっつ',4:'よっつ',5:'いつつ',6:'むっつ',7:'ななつ',8:'やっつ',9:'ここのつ'},
 'にん':{1:'ひとり',2:'ふたり'},'がつ':{4:'しがつ',7:'しちがつ',9:'くがつ'},'けん':{6:'ろっけん',1:'いっけん'}}
for k in ('ほん','ぼん'): CNT[k]=CNT['ぽん']
for k in ('ひき','びき'): CNT[k]=CNT['ぴき']
def numkana(t):
    def f(m):
        n=int(m[1]);c=m[2] or ''
        if c and c in CNT and n in CNT[c]: return CNT[c][n]
        base=N1.get(n,m[1])
        if c in ('ぽん','ほん','ぼん'): c='ほん' if n in (2,4,5,7,9) else 'ぼん' if n==3 else 'ぽん'
        if c in ('ぴき','ひき','びき'): c='ひき' if n in (2,4,5,7,9) else 'びき' if n==3 else 'ぴき'
        return base+c
    return re.sub(r'(\d+)\s*(かい|こ|ぽん|ほん|ぼん|ぴき|ひき|びき|つ|にん|ねん|がつ|えん|てん|けん)?',f,t)
OVR={'ある日、まおう ヒラガナーが あらわれて、かんじを ぜんぶ たまごに ふうじこめて しまいました！':'ある 日、まおう ヒラガナーが あらわれて、かんじを ぜんぶ たまごに ふうじこめて しまいました！','いえは ろっけん。':'いえは 六軒。','ここは もりの むら ろっけんの いえ':'ここは 森の 村、 六軒の 家','うしは いっとう、にとう… ぜんぶで さんとう いるよ。':'うしは 1頭、 2頭… ぜんぶで 3頭 いるよ。','せんせいの 先。':'せんせいの せん。','「いちにち」の 日でも ある。':'いちにちの にちでも ある。','はち（蜂）の「はち」と おなじ おと。':'虫の はちと おなじ おと。','1がつ、2がつの 月でも ある。':'1月、2月の 月でも ある。'}
def prep(t):
    t=OVR.get(t,t)
    t=t.replace('▶','').replace('◀','').replace('「','').replace('」','').replace('『','').replace('』','')
    t=re.sub(r'（([^）]*)）',lambda m:'' if re.fullmatch(r'[一-龥]+',m[1]) else '、'+m[1]+'、',t)
    t=numkana(t)
    t=re.sub(r'(?<=[^\s])\s+(?=[^\s])','',t)   # ことばの あいだの くうはくは とる（「、」の ところだけ 間を あける）
    t=t.replace('…','、')
    return t.strip()
def hasKanji(s): return re.search(r'[一-龥]',s) is not None

def setup(models):
    ort=Onnxruntime.load_once(filename=glob.glob(VV+'voicevox_onnxruntime-linux-x64-1.17.3/lib/libvoicevox_onnxruntime.so.1.17.3')[0])
    oj=OpenJtalk(VV+'open_jtalk_dic_utf_8-1.11')
    ud=UserDict()
    for s,p,a in WORDS: ud.add_word(UserDictWord(s,p,accent_type=a,word_type='PROPER_NOUN',priority=8))
    for g,n in NAMES.items():
        if n not in [w[0] for w in WORDS]: ud.add_word(UserDictWord(n,kata(n),accent_type=name_acc(n),word_type='PROPER_NOUN',priority=8))
    oj.use_user_dict(ud)
    syn=Synthesizer(ort,oj,cpu_num_threads=os.cpu_count())
    for i in models:
        with VoiceModelFile.open(f'{VV}{i}.vvm') as m: syn.load_voice_model(m)
    return syn
def morae(k): return len(re.sub(r'[ャュョァィゥェォ]','',k))
def name_acc(n):
    k=kata(n);m=re.search(r'(チャン|クン|サマ|サン)$',k)
    if m:
        b=morae(k[:m.start()]);return 1 if b<=2 else b
    return 0
cs=open(D+'app/chars.js',encoding='utf-8').read(); CH=json.loads(cs[cs.index('{'):cs.rindex('}')+1])
NAMES={g:v['name'] for g,v in CH.items()}
MODELS=[0,1,2,4,9,10,11,12,13,15,16,20]

KJC={'かい':'回','こ':'個','にん':'人','ほん':'本','ぽん':'本','ぼん':'本','ひき':'匹','ぴき':'匹','びき':'匹','ねん':'年','がつ':'月','えん':'円','てん':'点','けん':'軒','とう':'頭','かくめ':'画目'}
def numkanji(t): return re.sub(r'(\d+)(かくめ|かい|こ|にん|ほん|ぽん|ぼん|ひき|ぴき|びき|ねん|がつ|えん|てん|けん|とう)?',lambda m:m[1]+(KJC.get(m[2],'') if m[2] else ''),t)
def cprep(c):
    c=c.replace('▶','').replace('◀','').replace('「','').replace('」','').replace('『','').replace('』','').replace('…','、')
    c=re.sub(r'（([^）]*)）',lambda m:'' if re.fullmatch(r'[一-龥]+',m[1]) else '、'+m[1]+'、',c)
    return numkanji(c)
def particle(c):  # ぶんせつの さいごの「は」「へ」は じょし
    return re.sub(r'は(?=[、。！？!?…]|$)','わ',re.sub(r'へ(?=[、。！？!?…]|$)','え',c))
def apkana(aps):
    out=[]
    for ap in aps:
        s=''.join(m.text for m in ap.moras);a=ap.accent
        out.append((s[:a]+"'"+s[a:])+('、' if ap.pause_mora else '/'))
    return ''.join(out)
SUBS={'よこぼう':'横棒','ななつ。':'七つ。','としを':'年を','とし。':'年。','ただしいを':'正しいを','ななほしてんとうの':'七星てんとうの'}
def norm2(k):  # ハ と ワ は くべつ する
    k=re.sub(r"[^ァ-ヶー]","",kata(k)).replace('ヲ','オ').replace('ヂ','ジ').replace('ヅ','ズ')
    out=''
    for c in k:
        if c=='ー' and out: c=VOW.get(out[-1],'')
        if out and c=='ウ' and VOW.get(out[-1])=='オ': c='オ'
        if out and c=='イ' and VOW.get(out[-1])=='エ': c='エ'
        out+=c
    return out.replace('ャ','ア').replace('ュ','ウ').replace('ョ','オ').replace('ァ','ア').replace('ィ','イ').replace('ェ','エ').replace('ォ','オ')
def badsplit(a): return len(a)>1 and min(len(ap.moras) for ap in a)==1
def build_query(syn,who,src,plain):
    sid,sp,pi,it=SPK[who]
    if plain in OVR: src=OVR[plain]
    src=re.sub(r'「([^」]*)」([^\s「]*)',r' \1\2 ',src)
    cs=[c for c in re.split(r'\s+|(?<=、)',src.strip()) if c and c.strip()]
    aps=[];st='ok';notes=[]
    for c in cs:
        pc=tokens_kana(c)
        exp=None if hasKanji(pc) else norm2(particle(numkana(pc)))
        base=cprep(pc)
        cands=[]
        if '{' in c: cands.append(cprep(tokens_kanji(c)))
        if base in SUBS: cands.append(SUBS[base])
        for k,v in SUBS.items():
            if k in base and len(k)>3: cands.append(base.replace(k,v))
        cands+= [base, particle(base), kata(particle(base))]
        best=None
        for cc in cands:
            if not re.sub(r'[、。！？!?・]','',cc): continue
            try: a=syn.create_accent_phrases(cc,sid)
            except Exception as e: continue
            raw=''.join(m.text for ap in a for m in ap.moras)
            ok=(exp is None) or norm2(raw)==exp
            score=(0 if ok else 2)+(1 if badsplit(a) else 0)
            if best is None or score<best[0]: best=(score,a,cc)
            if score==0: break
        if best is None: continue
        if best[0]>=2: st='MISMATCH';notes.append(c)
        elif best[0]==1: notes.append('split:'+c)
        aps+=best[1]
    if st=='ok' and notes: st='SPLIT'
    if st=='ok' and hasKanji(tokens_kana(src)): st='kanji?'
    q=syn.create_audio_query('あ',sid)
    q.accent_phrases=aps
    q.speed_scale=sp;q.pitch_scale=pi;q.intonation_scale=it;q.pre_phoneme_length=.06;q.post_phoneme_length=.12
    return ' '.join(cs)+(' #'+','.join(notes) if notes else ''),q,st

def main():
    mode=sys.argv[1]
    L=json.load(open(D+'tools/lines.json',encoding='utf-8'))
    syn=setup(MODELS)
    rep=[];
    if mode=='check':
        for x in L:
            c,q,st=build_query(syn,x['who'],x['src'],x['s'])
            rep.append(f"{st}\t{x['who']}\t{x['s']}\t{c}\t{apkana(q.accent_phrases)}")
        open(D+'tools/voice_check.tsv','w',encoding='utf-8').write('\n'.join(rep))
        print('done',sum(1 for r in rep if not r.startswith('ok')),'flags')
        return
    os.makedirs(D+'tools/vwav',exist_ok=True)
    packs={};idx={};t0=time.time()
    for n,x in enumerate(L):
        key=x['who']+'|'+x['s']
        h=hashlib.md5(key.encode()).hexdigest()[:10]
        mp=D+f'tools/vwav/{h}.mp3'
        if not os.path.exists(mp):
            c,q,st=build_query(syn,x['who'],x['src'],x['s'])
            w=syn.synthesis(q,SPK[x['who']][0])
            wp=D+f'tools/vwav/{h}.wav';open(wp,'wb').write(w)
            subprocess.run(['ffmpeg','-loglevel','error','-y','-i',wp,'-af','loudnorm=I=-19:TP=-1.5:LRA=9','-ar','24000','-ac','1','-b:a','48k',mp],check=True)
            os.remove(wp)
        packs.setdefault(x['pack'],{})[h]=base64.b64encode(open(mp,'rb').read()).decode()
        idx[key]=x['pack']+'/'+h
        if n%50==0: print(n,len(L),round(time.time()-t0),flush=True)
    os.makedirs(D+'app/voice',exist_ok=True)
    for f in glob.glob(D+'app/voice/*.js'): os.remove(f)
    for p,d in packs.items():
        open(D+f'app/voice/{p}.js','w').write('window.VOICE_PACK('+json.dumps(p)+','+json.dumps(d)+');\n')
    open(D+'app/voice/index.js','w',encoding='utf-8').write('window.VOICE_INDEX='+json.dumps(idx,ensure_ascii=False)+';\n')
    print('packs',len(packs),'keys',len(idx))
main()
