import re, math
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

