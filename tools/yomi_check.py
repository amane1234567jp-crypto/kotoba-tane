import json,re,glob,sys
sys.argv=['x','none']
src=open('/tmp/claude-0/-home-claude/a581a6c5-b8bb-55ce-8f69-11dc409c4111/scratchpad/tools/voice_gen.py',encoding='utf-8').read().replace('\nmain()\n','\n')
exec(src)
syn=setup([0])
L=json.load(open(D+'tools/aivis_lines.json'));Yo=json.load(open(D+'tools/aivis_yomi.json'))
bad=[]
for x in L:
    y=Yo[x['key']]; plain=x['text']
    if re.search(r'[一-龥]',plain): continue
    try: q=syn.create_audio_query(y,2)
    except Exception as e: bad.append(('ERR',plain,y));continue
    raw=''.join(m.text for ap in q.accent_phrases for m in ap.moras)
    exp=norm(numkana(plain.replace('〜','ー').replace('…','')))
    got=norm(raw)
    if exp!=got: bad.append((plain,y,raw))
for b in bad: print(b)
print(len(bad))
