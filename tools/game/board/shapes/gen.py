import json, math, itertools
from PIL import Image, ImageDraw
TOPO = {
 "kyu": (["0","1","2","3","4","f1","a1","a2","a3","m1","m2","f2","c1","c2","c3","15"], [("f1",["b1","b2"],"m1"),("f2",["d1"],"15")]),
 "tou": (["0","1","2","3","4","f1","a1","a2","a3","a4","m1","m2","f2","c1","c2","c3","e1","e2","15"], [("f1",["b1","b2"],"m1"),("f2",["d1"],"e1")]),
 "gak": (["0","1","2","3","4","f1","a1","a2","a3","a4","a5","m1","m2","f2","c1","c2","15"], [("f1",["b1","b2"],"m1"),("f2",["d1"],"15")]),
}
TAU = 2*math.pi
def P(fn, n=400): return [fn(i/(n-1)) for i in range(n)]
def poly(pts):
    pts = [tuple(p) for p in pts]
    def f(t):
        L=[math.dist(pts[i],pts[i+1]) for i in range(len(pts)-1)]; s=t*sum(L)
        for i,l in enumerate(L):
            if s<=l or i==len(L)-1: k=s/l if l else 0; return (pts[i][0]+(pts[i+1][0]-pts[i][0])*k, pts[i][1]+(pts[i+1][1]-pts[i][1])*k)
            s-=l
    return f
def smooth(pts, it=3):
    for _ in range(it):
        q=[pts[0]]
        for a,b in zip(pts,pts[1:]): q+= [(.75*a[0]+.25*b[0],.75*a[1]+.25*b[1]),(.25*a[0]+.75*b[0],.25*a[1]+.75*b[1])]
        q.append(pts[-1]); pts=q
    return pts
FAM = {
 "spiral": lambda t: (.5+.5*(1-.62*t)*math.cos(math.pi/2+TAU*1.15*t), .5+.5*(1-.62*t)*math.sin(math.pi/2+TAU*1.15*t)),
 "zigzag": poly(smooth([(0,1),(1,1),(1,.5),(0,.5),(0,0),(1,0)],2)),
 "columns": poly(smooth([(0,1),(0,0),(.33,0),(.33,1),(.67,1),(.67,0),(1,0),(1,.6)],2)),
 "ring": lambda t: (.5+.5*math.cos(math.pi/2+TAU*.88*t), .5+.5*math.sin(math.pi/2+TAU*.88*t)),
 "eight": lambda t: (.5+.5*math.sin(TAU*.95*t+.15), .5+.5*math.sin(2*(TAU*.95*t+.15))),
 "heart": lambda t: (lambda a:(.5+16*math.sin(a)**3/34, .45-(13*math.cos(a)-5*math.cos(2*a)-2*math.cos(3*a)-math.cos(4*a))/30))(math.pi*.06+TAU*.88*t),
 "wave": lambda t: (t, .5+.48*math.sin(3.2*math.pi*t)),
 "ushape": poly(smooth([(0,0),(0,1),(1,1),(1,0),(.55,0)],2)),
 "mshape": poly(smooth([(0,1),(.22,0),(.5,.75),(.78,0),(1,1)],1)),
 "zshape": poly(smooth([(0,0),(1,0),(0,1),(1,1)],1)),
 "stairs": poly(smooth([(0,1),(.25,1),(.25,.66),(.5,.66),(.5,.33),(.75,.33),(.75,0),(1,0)],1)),
 "star": poly(smooth([(.5+.5*math.cos(-math.pi/2+i*4*math.pi/5), .52+.5*math.sin(-math.pi/2+i*4*math.pi/5)) for i in range(5)]+[(.5+.5*math.cos(-math.pi/2+4*4*math.pi/5)*.2, .52+.1)],1)),
 "glasses": lambda t: (lambda a: (.25+.25*math.cos(a)+(.5 if t>.5 else 0), .5+.5*math.sin(a)))(math.pi+TAU*.92*(2*t if t<=.5 else 2*t-1)*(1 if t<=.5 else -1)),
 "triangle": poly(smooth([(0,1),(1,1),(.5,0),(.15,.55)],1)),
 "diamond": poly(smooth([(.5,1),(1,.5),(.5,0),(0,.5),(.4,.85)],1)),
 "clover": lambda t: (lambda a:(.5+.5*math.cos(2*a)*math.cos(a), .5+.5*math.cos(2*a)*math.sin(a)))(math.pi*.03+math.pi*.94*t),
 "hook": poly(smooth([(1,1),(0,1),(0,.2),(.2,0),(.8,0),(1,.3),(.6,.55)],2)),
 "sun": lambda t: (.5+(.42+.08*math.sin(TAU*6*t))*math.cos(TAU*.85*t-math.pi/2), .5+(.42+.08*math.sin(TAU*6*t))*math.sin(TAU*.85*t-math.pi/2)/.95),
 "snail": lambda t: (lambda u: (t*1.0 if t<.35 else .35+.65*(.5+.5*(1-(t-.35)/.65*.55)*math.cos(math.pi/2+TAU*1.0*(t-.35)/.65)) , .95 if t<.35 else .5+.45*(1-(t-.35)/.65*.55)*math.sin(math.pi/2+TAU*1.0*(t-.35)/.65)))(t),
}
BOX=(150,250,1450,910)
def layout(fam, tf, topo):
    main, br = TOPO[topo]; f=FAM[fam]
    pts=P(f,1200)
    if "x" in tf: pts=[(1-x,y) for x,y in pts]
    if "y" in tf: pts=[(x,1-y) for x,y in pts]
    if "r" in tf: pts=pts[::-1]
    xs=[p[0] for p in pts]; ys=[p[1] for p in pts]; mx,Mx,my,My=min(xs),max(xs),min(ys),max(ys)
    pts=[(BOX[0]+(x-mx)/(Mx-mx or 1)*(BOX[2]-BOX[0]), BOX[1]+(y-my)/(My-my or 1)*(BOX[3]-BOX[1])) for x,y in pts]
    L=[0]
    for a,b in zip(pts,pts[1:]): L.append(L[-1]+math.dist(a,b))
    N=len(main); out={}
    j=0
    for i,k in enumerate(main):
        s=L[-1]*i/(N-1)
        while j<len(L)-2 and L[j+1]<s: j+=1
        a,b=pts[j],pts[j+1]; u=(s-L[j])/((L[j+1]-L[j]) or 1); out[k]=(a[0]+(b[0]-a[0])*u, a[1]+(b[1]-a[1])*u)
    for s,mid,e in br:
        A,B=out[s],out[e]; best=None
        for side in (1,-1):
            for mag in (0,.15,.3,.45,.6,.8,1.0):
                dx,dy=B[0]-A[0],B[1]-A[1]; nx,ny=-dy*side,dx*side
                cand={}
                for q,k in enumerate(mid):
                    t=(q+1)/(len(mid)+1); bul=4*t*(1-t)*mag
                    cand[k]=(A[0]+dx*t+nx*bul, A[1]+dy*t+ny*bul)
                if any(not(BOX[0]-40<=x<=BOX[2]+40 and BOX[1]-40<=y<=BOX[3]+40) for x,y in cand.values()): continue
                others=[v for k,v in out.items()]
                d=min(math.dist(c,o) for c in cand.values() for o in others)
                # 枝の線が 他の マスの 上を とおらない
                seg=[A]+list(cand.values())+[B]; dd=min(segd(o,p,q) for o in [v for k,v in out.items() if k not in (s,e)] for p,q in zip(seg,seg[1:]))
                sc=min(d,dd*1.6)
                if best is None or sc>best[0]: best=(sc,cand)
        out.update(best[1])
    return out
def segd(o,p,q):
    dx,dy=q[0]-p[0],q[1]-p[1]; L=dx*dx+dy*dy
    t=max(0,min(1,((o[0]-p[0])*dx+(o[1]-p[1])*dy)/L)) if L else 0
    return math.dist(o,(p[0]+dx*t,p[1]+dy*t))
def edges(topo):
    main,br=TOPO[topo]; E=list(zip(main,main[1:]))
    for s,mid,e in br: ch=[s]+mid+[e]; E+=list(zip(ch,ch[1:]))
    return E
def score(out,topo):
    ks=list(out); d=min(math.dist(out[a],out[b]) for a,b in itertools.combinations(ks,2))
    dd=min(segd(out[o],out[a],out[b]) for a,b in edges(topo) for o in ks if o not in (a,b))
    return d, dd
def draw(out,topo,path,title):
    im=Image.new("RGB",(800,500),"white"); D=ImageDraw.Draw(im); s=.5
    for a,b in edges(topo): D.line([tuple(v*s for v in out[a]),tuple(v*s for v in out[b])],fill=(160,160,160),width=3)
    for k,(x,y) in out.items():
        c=(255,120,120) if k=="0" else (90,180,90) if k=="15" else (90,140,220) if k[0] in "bd" else (255,200,90)
        D.ellipse([x*s-22,y*s-22,x*s+22,y*s+22],fill=c); D.text((x*s-6,y*s-6),k,fill="black")
    D.text((10,10),title,fill="black"); im.save(path)
if __name__=="__main__":
    import sys
    res=[]
    for fam in FAM:
        for tf in ["","x"]:
            for topo in TOPO:
                o=layout(fam,tf,topo); d,dd=score(o,topo); res.append((fam,tf,topo,round(d),round(dd)))
    for r in res: print(*r)
def circ(cx,cy,r,a0,a1,n=60,ry=None): return [(cx+r*math.cos(a0+(a1-a0)*i/n), cy+(ry or r)*math.sin(a0+(a1-a0)*i/n)) for i in range(n+1)]
FAM2 = {
 "sshape": poly(circ(.5,.27,.5,0,-1.5*math.pi,ry=.27)[::-1][::1] and (circ(.5,.27,.5,.0*math.pi,-1.5*math.pi,ry=.27)[::-1]+circ(.5,.73,.5,-math.pi/2,math.pi*1.0,ry=.27))),
 "cshape": lambda t: (.6+.6*math.cos(math.pi*.3+math.pi*1.4*t)*.85, .5+.5*math.sin(math.pi*.3+math.pi*1.4*t)),
 "omega": poly(smooth([(0,1),(.3,1),(.12,.6),(.2,.15),(.5,0),(.8,.15),(.88,.6),(.7,1),(1,1)],2)),
 "camel": poly(smooth([(0,1),(.12,.2),(.3,0),(.45,.3),(.5,.75),(.55,.3),(.7,0),(.88,.2),(1,1)],2)),
 "pshape": poly([(0,1),(.3,1)]+circ(.66,.5,.36,math.pi/2+.3,math.pi/2+.3+TAU*.86,ry=.5)),
 "bolt": poly(smooth([(.15,0),(.85,0),(.4,.45),(.95,.5),(.55,1),(0,1)],1)),
 "arch": poly(smooth([(0,1),(0,.3),(.2,0),(.8,0),(1,.3),(1,1),(.7,1),(.7,.5),(.4,.45)],2)),
 "lolli": poly([(.5,1),(.5,.62)]+circ(.5,.33,.5,math.pi/2,math.pi/2+TAU*.85,ry=.33)),
 "bean": lambda t: (lambda a:(.5+.5*math.cos(a), .5+.5*math.sin(a)*(1-.55*math.exp(-((a-3*math.pi/2)%TAU-math.pi)**2*2))))(math.pi/2+TAU*.88*t),
 "rect": poly(smooth([(.08,1),(1,1),(1,0),(0,0),(0,.62),(.6,.62)],1)),
 "tear": lambda t: (lambda a:(.5+.5*math.sin(a)*math.sin(a/2)**1.2, .5-.5*math.cos(a)))(.35+ (TAU-.9)*t),
}
FAM.update(FAM2)
FAM["wave2"]=lambda t:(t,.5+.48*math.sin(2.1*math.pi*t))
FAM["road"]=poly(smooth([(0,.9),(.3,.95),(.45,.6),(.25,.3),(.4,0),(.7,.05),(.8,.4),(.6,.7),(.8,1),(1,.85)],2))
FAM["house"]=poly(smooth([(.1,1),(0,.42),(.5,0),(1,.42),(.9,1),(.55,1),(.5,.62)],1))
