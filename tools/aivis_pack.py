import json,os,glob,base64,subprocess,sys
D='/tmp/claude-0/-home-claude/a581a6c5-b8bb-55ce-8f69-11dc409c4111/scratchpad/'
SRC=sys.argv[1]
L=json.load(open(D+'tools/aivis_lines.json'))
os.makedirs(D+'tools/awav',exist_ok=True)
packs={};idx={};miss=[]
for x in L:
    f=f"{SRC}/{x['key']}.mp3"
    if not os.path.exists(f): miss.append(x['k']);continue
    o=D+f"tools/awav/{x['key']}.mp3"
    if not os.path.exists(o) or os.path.getmtime(o)<os.path.getmtime(f):
        subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f,'-af','loudnorm=I=-19:TP=-1.5:LRA=9','-ar','24000','-ac','1','-b:a','48k',o],check=True)
    packs.setdefault(x['pack'],{})[x['key']]=base64.b64encode(open(o,'rb').read()).decode()
    idx[x['k']]=x['pack']+'/'+x['key']
for f in glob.glob(D+'app/voice/*.js'): os.remove(f)
for p,d in packs.items(): open(D+f'app/voice/{p}.js','w').write('window.VOICE_PACK('+json.dumps(p)+','+json.dumps(d)+');\n')
open(D+'app/voice/index.js','w',encoding='utf-8').write('window.VOICE_INDEX='+json.dumps(idx,ensure_ascii=False)+';\n')
print('packs',len(packs),'keys',len(idx),'missing',len(miss),miss[:5])
