import sys
from PIL import Image
out=sys.argv[1]; fs=sys.argv[2:]
ims=[Image.open(f).convert('RGB') for f in fs]
w=590; ims=[i.resize((w,int(i.height*w/i.width))) for i in ims]
h=max(i.height for i in ims); rows=(len(ims)+1)//2
W=Image.new('RGB',(w*2,h*rows),'white')
for k,i in enumerate(ims): W.paste(i,((k%2)*w,(k//2)*h))
W.save(out)
