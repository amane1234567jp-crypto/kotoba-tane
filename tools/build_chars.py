import re, json, sys, os
sys.path.insert(0,'tools'); sys.argv=['x']
P='kanji-bokujo/project/'
CH={}
pat=re.compile(r'<svg viewBox="0 0 160 160"[^>]*aria-label="(.)[^"]*">(.*?)</svg>\s*(?:<div[^>]*>)*?\s*<div[^>]*>(.)</div>\s*<div[^>]*>([^<]+)</div>',re.S)
for f in ['A5_Personality','A7_Pond','A8_Field2','A9_Nature','A10_Things','A11_People']:
    s=open(P+f+'.dc.html',encoding='utf-8').read()
    for m in pat.finditer(s):
        g,inner,g2,name=m.groups()
        if g not in CH: CH[g]={'name':name.strip(),'svg':inner.strip()}
print('singles',len(CH),''.join(CH))
import final30, last17, num2_gen
for k,n,b in final30.FINAL: CH[k]={'name':n,'svg':b}
L={'一':(last17.ichi,'いもむし'),'二':(last17.ni,'いもむしおやこ'),'三':(last17.san,'いもむし3きょうだい'),'上':(last17.ue,'はたあげくん'),'下':(last17.shita,'ぶらーんぐも'),'入':(last17.hairu,'テント'),'年':(last17.toshi,'ケーキ'),'円':(last17.en,'がまぐち'),'文':(last17.bun,'おてがみ'),'小':(last17.chiisai,'ひよこ'),
   '四':(num2_gen.yon,'おべんとう'),'五':(num2_gen.go,'サイコロ'),'六':(num2_gen.roku,'ありんこ'),'七':(num2_gen.nana,'ななほし'),'八':(num2_gen.hachi,'はちさん'),'九':(num2_gen.kyu,'サッカーくん'),'十':(num2_gen.ju,'りょうてくん')}
for k,(fn,n) in L.items(): CH[k]={'name':n,'svg':fn()}
import six_gen as G, parts
OL=parts.OL
def chikara():
    t = G.limb('M70,84 Q56,108 32,134', G.SKIN, 18) + G.foot(28, 137)
    t += f'<rect x="50" y="62" width="44" height="40" rx="12" fill="#ff7a59" {OL} stroke-width="5"/>'
    t += G.limb('M36,66 L112,60 Q124,60 122,72 L114,110 Q110,126 92,126', G.SKIN, 18) + G.hand(90, 126, 10)
    t += f'<circle cx="102" cy="74" r="14" fill="#ffb86b" {OL} stroke-width="4"/><path d="M95,70 Q102,62 109,70" fill="none" {OL} stroke-width="3" stroke-linecap="round"/>'
    t += G.head(54, 34, 22) + f'<path d="M34,26 L76,24" {OL} stroke-width="9" stroke-linecap="round"/><path d="M34,26 L76,24" stroke="#e04a4a" stroke-width="5" stroke-linecap="round"/>' + G.face(54, 38, .7, 'big')
    t += parts.prop_sparkle(132, 40, .8) + parts.prop_sparkle(140, 96, .6)
    return t
CH['力']={'name':'ちからもち','svg':chikara()}
CH.pop('明',None)
import json
kj=open('kanji-demo/kanji1.js',encoding='utf-8').read()
allk=re.findall(r'"g":"(.)"',kj)
miss=[k for k in allk if k not in CH]
print('total',len(CH),'missing',miss)
ids=re.findall(r'\bid="([^"]+)"',''.join(v['svg'] for v in CH.values()))
print('ids in svgs',set(ids))
open('app/chars.js','w',encoding='utf-8').write('// かんじ牧場 キャラ（viewBox 0 0 160 160 の中身）\nvar CHARS='+json.dumps(CH,ensure_ascii=False)+';\n')
print(os.path.getsize('app/chars.js'))
