import sys,re
from xml.dom import minidom
NS='http://kanjivg.tagaini.net'
def walk(n,d=0):
    if n.nodeType!=1: return
    if n.tagName=='g':
        el=n.getAttribute('kvg:element'); pos=n.getAttribute('kvg:position'); part=n.getAttribute('kvg:part'); orig=n.getAttribute('kvg:original')
        if n.hasAttribute('kvg:element') or d>0:
            paths=[c for c in n.childNodes if c.nodeType==1 and c.tagName=='path']
            print('  '*d+f'g el={el!r} pos={pos} part={part} orig={orig} loose_paths={len(paths)}')
        for c in n.childNodes: walk(c,d+1)
for k in "".join(sys.argv[1:]):
    code=f'{ord(k):05x}'
    doc=minidom.parse(f'kvg/{code}.svg')
    root=[g for g in doc.getElementsByTagName('g') if g.getAttribute('id')==f'kvg:{code}'][0]
    print('===',k); walk(root,0)
