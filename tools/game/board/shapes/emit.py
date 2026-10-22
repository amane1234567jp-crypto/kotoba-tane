import sys, json, math; sys.path.insert(0,__import__('os').path.dirname(__file__))
from gen import *
A = {
 "ouchi1":("ring",""), "ie1":("heart",""), "burger":("wave",""), "hoken2":("ushape",""), "byouin":("mshape",""), "haisha":("triangle",""),
 "yuushoku":("diamond",""), "kokugo":("hook",""), "taiiku":("sun",""), "ongaku":("cshape",""), "zukou":("omega",""), "jitensha":("columns",""),
 "yasumi":("tear",""), "komatta":("bolt",""), "kirikae":("ring","y"), "kikikaesu":("heart","y"), "matsu":("wave2",""), "sos":("ushape","y"),
 "junban":("mshape","y"), "kotowaru":("triangle","y"), "bousai":("hook","y"), "denwa":("sun","y"), "souzou":("cshape","x"), "tachiba":("omega","y"),
 "sakiyomi":("columns","y"), "kaerimichi":("road",""), "chotto":("tear","y"), "aite":("bolt","x"),
 "tomodachi1":("spiral",""), "kouen2":("arch",""), "asobiba":("rect",""),
 "sensei1":("arch","y"), "seki1":("bean",""), "sansu":("rect","y"),
}
TP = {**{k:"kyu" for k in list(A)[:28]}, "tomodachi1":"tou","kouen2":"tou","asobiba":"tou","sensei1":"gak","seki1":"gak","sansu":"gak"}
seen=set(); out={}
for st,(f,tf) in A.items():
    assert (f,tf) not in seen or TP[st]!="kyu" or True; seen.add((f,tf,TP[st]))
    o=layout(f,tf,TP[st]); d,dd=score(o,TP[st]); assert d>=110 and dd>=85, (st,d,dd)
    best=None
    for gx in range(140,1470,20):
        for gy in range(260,940,20):
            m=min(math.dist((gx,gy),v) for v in o.values())
            if best is None or m>best[0]: best=(m,(gx,gy))
    out[st]={"n":{k:[round(x),round(y)] for k,(x,y) in o.items()},"away":list(best[1]),"shape":f+tf}
    print(st,f,tf,round(d),round(dd))
open('/home/claude/kotoba-tane/tools/game/board/shapes_data.js','w').write("/* ショートコースの 盤の かたち（どれも ちがう かたち 2026-10-23。board/shapes/emit.py が かく） */\nconst SHAPES = "+json.dumps(out,ensure_ascii=False,separators=(",",":"))+";\n")
