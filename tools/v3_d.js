function heroSVG(){
  return '<ellipse cx="5" cy="9.6" rx="3.4" ry="1" fill="#000" opacity=".2"/>'
   +'<rect x="3.2" y="6" width="3.6" height="3.2" rx="1" fill="#3b6fd9" stroke="#2a2a3a" stroke-width=".5"/>'
   +'<circle cx="5" cy="4.2" r="2.8" fill="#ffcf9e" stroke="#2a2a3a" stroke-width=".5"/>'
   +'<path d="M2.1,3.6 Q5,0.4 7.9,3.6 L8.9,3.9 L7.6,2.6 Q5,-0.1 2.4,2.6 Z" fill="#e04a4a" stroke="#2a2a3a" stroke-width=".4"/>'
   +'<circle cx="4.1" cy="4.5" r=".42" fill="#2a2a3a"/><circle cx="5.9" cy="4.5" r=".42" fill="#2a2a3a"/>'
   +'<path d="M4.3,5.6 Q5,6.1 5.7,5.6" fill="none" stroke="#2a2a3a" stroke-width=".35" stroke-linecap="round"/>';
}

// ---------- せかい ----------
var MW=24, MH=16;
var OBJ={H:[2,2],N:[2,2],K:[5,3],J:[3,2],Q:[4,3]};
var BLOCK='TPWRFMCXhYOLaI#HNKJQ';
function T(m,x,y){var r=MAPS[m].tiles[y];return (r&&x>=0&&x<r.length)?r.charAt(x):'#';}
var MAOU_NPC={x:12,y:2,k:'maou',n:'ヒラガナー',l:['ひらがなも かんじも、どっちも だいじな ことばだね！','また あそびに きてね。']};
function npcList(m){var a=MAPS[m].npcs.slice();if(m===8&&S.ending)a.push(MAOU_NPC);return a;}
function npcAt(m,x,y){var a=npcList(m);for(var i=0;i<a.length;i++)if(a[i].x===x&&a[i].y===y)return a[i];return null;}
function signAt(m,x,y){if(T(m,x,y)!=='Y')return null;var n=0,t=MAPS[m].tiles;for(var yy=0;yy<MH;yy++)for(var xx=0;xx<MW;xx++)if(t[yy].charAt(xx)==='Y'){if(xx===x&&yy===y)return {sign:true,x:x,y:y,text:MAPS[m].signs[n]||''};n++;}return null;}
function walkable(m,x,y){var c=T(m,x,y);if(c==='X')return !!S.cleared[m];if(BLOCK.indexOf(c)>=0)return false;if(npcAt(m,x,y))return false;return true;}
function regKanji(m){return Array.from(MAPS[m].kanji||'');}
function eggsLeft(m){return regKanji(m).filter(function(g){return !S.born[g];});}
function curEgg(m){if(m===0&&S.tut<1)return null;var k=regKanji(m);for(var i=0;i<k.length;i++)if(!S.born[k[i]])return {g:k[i],x:MAPS[m].eggs[i][0],y:MAPS[m].eggs[i][1],i:i};return null;}
function mobsLeft(m){var b=S.mb[m]||[];return MAPS[m].mobs.map(function(d,i){return i;}).filter(function(i){return b.indexOf(i)<0;});}
function mobsOn(m){return !(m===0&&S.tut<4);}
function bossActive(m){var b=MAPS[m].boss;if(!b)return null;
  if(b.final)return (bornCount()>=ORDER.length&&!S.ending)?b:null;
  if(S.cleared[m]||eggsLeft(m).length||mobsLeft(m).length)return null;return b;}
function frontier(){for(var i=0;i<8;i++)if(!S.cleared[i])return i;return 8;}

var hero={m:0,x:9,y:6,px:9,py:6}, moving=false, path=[], mobs=[], pending=null, talking=false, ring=null;
var VW=160,VH=100,cam={x:0,y:0};
function randFree(m){for(var k=0;k<200;k++){var x=1+Math.floor(Math.random()*(MW-2)),y=1+Math.floor(Math.random()*(MH-2));var c=T(m,x,y);if(walkable(m,x,y)&&c!=='<'&&c!=='>'&&c!=='X'&&Math.abs(x-hero.x)+Math.abs(y-hero.y)>5)return [x,y];}return null;}
function spawnMobs(){
  mobs=[];var m=hero.m;if(!mobsOn(m))return;
  if(!S.cleared[m])mobsLeft(m).forEach(function(i){var d=MAPS[m].mobs[i];mobs.push({x:d.x,y:d.y,hx:d.x,hy:d.y,t:d.t,i:i,id:'mob'+i});});
  if((S.cleared[m]||!mobsLeft(m).length)&&MAPS[m].mobs.length)for(var j=0;j<2;j++){var d=MAPS[m].mobs[Math.floor(Math.random()*MAPS[m].mobs.length)],p=randFree(m);if(p)mobs.push({x:p[0],y:p[1],hx:p[0],hy:p[1],t:d.t,i:-1,id:'tmob'+j,train:true});}
}

// ---------- タイルの え ----------
var TH={grass:['#8fd06a','#86c962'],pond:['#98d872','#8fcf69'],forest:['#78bb5e','#70b256'],town:['#93cf6e','#8ac766'],school:['#9bd673','#92cd6b'],fest:['#a6d977','#9dd06f'],snow:['#f3f7fd','#e8f0fa'],kingdom:['#aee6a6','#a5de9d'],castle:['#6e5f8f','#665887']};
var ROOF=['#e04a4a','#3b6fd9','#5fb860','#ff9a3c','#9a6fc8'];
function R(x,y,w,h,f,extra){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+f+'"'+(extra||'')+'/>';}
function tileSVG(m){
  var mp=MAPS[m],th=mp.theme,G=TH[th],s='',gray=(th==='kingdom'&&!S.cleared[7]);
  for(var y=0;y<MH;y++)for(var x=0;x<MW;x++){
    var c=T(m,x,y),X=x*10,Y=y*10,o=' stroke="#2a2a3a" stroke-width=".5"';
    var gr=G[(x+y)%2];
    if(c==='*'||(th==='snow'&&'MP'.indexOf(c)>=0))gr=((x+y)%2)?'#f3f7fd':'#e8f0fa';
    s+=R(X,Y,10.2,10.2,gr);
    if(c==='='||c==='<'||c==='>'||(c==='X'&&S.cleared[m])){s+=R(X,Y,10.2,10.2,th==='castle'?'#4a3d66':th==='snow'?'#dfe6ef':'#e8cf96')+'<circle cx="'+(X+3)+'" cy="'+(Y+6)+'" r=".7" fill="'+(th==='castle'?'#3a2f52':'#c9a66b')+'"/><circle cx="'+(X+7)+'" cy="'+(Y+3)+'" r=".6" fill="'+(th==='castle'?'#3a2f52':'#c9a66b')+'"/>';}
    else if(c==='S')s+=R(X,Y,10.2,10.2,'#f2dfa6')+'<circle cx="'+(X+2.5)+'" cy="'+(Y+3)+'" r=".5" fill="#d9c07a"/><circle cx="'+(X+7)+'" cy="'+(Y+7)+'" r=".5" fill="#d9c07a"/>';
    else if(c==='z')s+=R(X,Y,10.2,10.2,((x+y)%2)?'#e2dccf':'#d9d2c3')+'<path d="M'+X+','+(Y+5)+' h10 M'+(X+5)+','+Y+' v5 M'+(X+2.5)+','+(Y+5)+' v5" stroke="#c4bba8" stroke-width=".4"/>';
    else if(c==='k')s+=R(X,Y,10.2,10.2,((x+y)%2)?'#4a3d66':'#43375e')+'<path d="M'+X+','+(Y+5)+' h10 M'+(X+5)+','+Y+' v10" stroke="#5a4c7a" stroke-width=".4"/>';
    else if(c==='c')s+=R(X+.5,Y+.5,9,9,'#a0703c')+'<path d="M'+(X+2.5)+','+(Y+7)+' l0,-3 m0,1 l-1,-1 m1,1 l1,-1 M'+(X+7)+','+(Y+7)+' l0,-3 m0,1 l-1,-1 m1,1 l1,-1" stroke="#5fb860" stroke-width=".8" fill="none" stroke-linecap="round"/>';
    else if(c===','){var fc=gray?['#bbb','#ddd']:th==='kingdom'?[['#e04a4a','#ff9a3c','#ffd23f','#5fb860','#3b6fd9','#9a6fc8'][(x*3+y)%6],'#fff']:th==='castle'?['#9a6fc8','#c8b0f0']:['#ff8ab0','#fff'];
      s+='<circle cx="'+(X+3)+'" cy="'+(Y+4)+'" r="1.4" fill="'+fc[0]+'"/><circle cx="'+(X+3)+'" cy="'+(Y+4)+'" r=".5" fill="#ffd23f"/><circle cx="'+(X+7)+'" cy="'+(Y+7)+'" r="1.2" fill="'+fc[1]+'"/><circle cx="'+(X+7)+'" cy="'+(Y+7)+'" r=".45" fill="#ffd23f"/>';}
    else if(c===';')s+='<path d="M'+(X+1.5)+','+(Y+8)+' l1,-4 l1,4 M'+(X+4)+','+(Y+9)+' l1.2,-5 l1.2,5 M'+(X+6.8)+','+(Y+8)+' l1,-4 l1,4" fill="'+(th==='castle'?'#4a3d66':'#4f9a3a')+'" stroke="'+(th==='castle'?'#3a2f52':'#3f8a2a')+'" stroke-width=".4"/>';
    else if(c==='.'&&th!=='snow'&&(x*7+y*3)%5===0)s+='<path d="M'+(X+4)+','+(Y+7)+' l1,-2 l1,2 M'+(X+6)+','+(Y+8)+' l.8,-1.6 l.8,1.6" fill="none" stroke="'+(th==='castle'?'#5a4c7a':'#5a9e3a')+'" stroke-width=".5"/>';
    else if(c==='W'||c==='B')s+=R(X,Y,10.2,10.2,'#6cc0ea')+'<path d="M'+(X+2)+','+(Y+4)+' q1.5,-1.2 3,0 q1.5,1.2 3,0" fill="none" stroke="#fff" stroke-width=".6" opacity=".8"/>'+(c==='B'?R(X,Y+1,10.2,8,'#c9945a',o)+'<path d="M'+(X+2.5)+','+(Y+1)+' v8 M'+(X+5)+','+(Y+1)+' v8 M'+(X+7.5)+','+(Y+1)+' v8" stroke="#8b5a2b" stroke-width=".5"/>':'');
    else if(c==='I')s+=R(X,Y,10.2,10.2,'#cdeeff')+'<path d="M'+(X+2)+','+(Y+7)+' l3,-3 M'+(X+5)+','+(Y+8)+' l2,-2" stroke="#fff" stroke-width=".8"/>';
    else if(c==='T')s+='<ellipse cx="'+(X+5)+'" cy="'+(Y+9.3)+'" rx="3.6" ry="1" fill="#000" opacity=".15"/>'+R(X+4.1,Y+5.5,1.8,3.8,'#8b5a2b')+'<circle cx="'+(X+5)+'" cy="'+(Y+4.4)+'" r="4.2" fill="'+(th==='kingdom'&&(x+y)%3===0&&!gray?'#ffb3c8':'#3f9a4a')+'"'+o+'/><circle cx="'+(X+3.6)+'" cy="'+(Y+3.2)+'" r="1.3" fill="'+(th==='kingdom'&&(x+y)%3===0&&!gray?'#ffd9e4':'#5fcb75')+'"/>';
    else if(c==='P')s+='<ellipse cx="'+(X+5)+'" cy="'+(Y+9.3)+'" rx="3.4" ry="1" fill="#000" opacity=".15"/>'+R(X+4.2,Y+7,1.6,2.5,'#8b5a2b')+'<path d="M'+(X+5)+','+(Y+.3)+' L'+(X+8.6)+','+(Y+7.6)+' L'+(X+1.4)+','+(Y+7.6)+' Z" fill="#2f7a40"'+o+'/>'+(th==='snow'?'<path d="M'+(X+5)+','+(Y+.3)+' L'+(X+6.6)+','+(Y+3.6)+' Q'+(X+5)+','+(Y+4.4)+' '+(X+3.4)+','+(Y+3.6)+' Z" fill="#fff"/>':'<path d="M'+(X+3)+','+(Y+5)+' L'+(X+7)+','+(Y+5)+'" stroke="#3f9a4a" stroke-width=".7"/>');
    else if(c==='R')s+='<path d="M'+(X+1.5)+','+(Y+8.5)+' Q'+(X+2)+','+(Y+2.5)+' '+(X+5)+','+(Y+2.5)+' Q'+(X+8.5)+','+(Y+2.5)+' '+(X+8.5)+','+(Y+8.5)+' Z" fill="#b8b2a8"'+o+'/>';
    else if(c==='M')s+='<path d="M'+(X-1)+','+(Y+10)+' L'+(X+5)+','+(Y+.5)+' L'+(X+11)+','+(Y+10)+' Z" fill="#9aa4b8"'+o+'/><path d="M'+(X+5)+','+(Y+.5)+' L'+(X+7.2)+','+(Y+4)+' L'+(X+5.8)+','+(Y+3.4)+' L'+(X+5)+','+(Y+4.4)+' L'+(X+4)+','+(Y+3.4)+' L'+(X+2.8)+','+(Y+4)+' Z" fill="#fff"/>';
    else if(c==='C')s+=R(X,Y,10.2,10.2,'#3e3358')+'<path d="M'+X+','+(Y+3.3)+' h10 M'+X+','+(Y+6.6)+' h10 M'+(X+5)+','+Y+' v3.3 M'+(X+2.5)+','+(Y+3.3)+' v3.3 M'+(X+7.5)+','+(Y+3.3)+' v3.3 M'+(X+5)+','+(Y+6.6)+' v3.4" stroke="#2a2340" stroke-width=".5"/>';
    else if(c==='F')s+=R(X,Y+3.4,10.2,1,'#c9945a')+R(X,Y+6.2,10.2,1,'#c9945a')+R(X+1,Y+2,1.4,6.8,'#e0b070',o)+R(X+6,Y+2,1.4,6.8,'#e0b070',o);
    else if(c==='Y')s+=R(X+4.4,Y+5,1.2,4.5,'#8b5a2b')+R(X+1.5,Y+1.5,7,4.5,'#e0b070',o+' rx="1"')+'<path d="M'+(X+3)+','+(Y+3)+' h4 M'+(X+3)+','+(Y+4.5)+' h3" stroke="#8b5a2b" stroke-width=".5"/>';
    else if(c==='O')s+='<ellipse cx="'+(X+5)+'" cy="'+(Y+7)+'" rx="3.6" ry="2.2" fill="#9aa4b8"'+o+'/><ellipse cx="'+(X+5)+'" cy="'+(Y+6.2)+'" rx="2.6" ry="1.1" fill="#3b6fd9"/>'+R(X+1.6,Y+1.5,.8,5,'#8b5a2b')+R(X+7.6,Y+1.5,.8,5,'#8b5a2b')+'<path d="M'+(X+1)+','+(Y+2)+' L'+(X+5)+','+(Y+.3)+' L'+(X+9)+','+(Y+2)+' Z" fill="#e04a4a"'+o+'/>';
    else if(c==='L'){if(th==='fest')s+=R(X+4.6,Y+3,.8,6.5,'#8b5a2b')+'<ellipse cx="'+(X+5)+'" cy="'+(Y+3.4)+'" rx="2.4" ry="2.8" fill="#ff5a4a"'+o+'/><path d="M'+(X+2.8)+','+(Y+3.4)+' h4.4" stroke="#ffd23f" stroke-width=".5"/>';
      else if(th==='castle')s+=R(X+4.4,Y+4,1.2,5.5,'#2a2340')+'<path d="M'+(X+5)+','+(Y+.5)+' Q'+(X+7.4)+','+(Y+3)+' '+(X+5)+','+(Y+4.6)+' Q'+(X+2.6)+','+(Y+3)+' '+(X+5)+','+(Y+.5)+' Z" fill="#c070ff"/>';
      else s+=R(X+4.5,Y+3,1,6.5,'#5a5a6e')+'<circle cx="'+(X+5)+'" cy="'+(Y+2.6)+'" r="1.8" fill="#ffe680"'+o+'/>';}
    else if(c==='a'){var cc=['#e04a4a','#3b6fd9'][(x+y)%2];s+=R(X+1,Y+4,8,3.6,cc,o+' rx="1.2"')+'<path d="M'+(X+2.6)+','+(Y+4)+' L'+(X+3.6)+','+(Y+2)+' L'+(X+6.4)+','+(Y+2)+' L'+(X+7.4)+','+(Y+4)+' Z" fill="#cfe8ff"'+o+'/><circle cx="'+(X+3)+'" cy="'+(Y+7.8)+'" r="1.1" fill="#2a2a3a"/><circle cx="'+(X+7)+'" cy="'+(Y+7.8)+'" r="1.1" fill="#2a2a3a"/>';}
    else if(c==='X')s+='<g><path d="M'+X+','+(Y+9)+' Q'+(X+2)+','+Y+' '+(X+5)+','+(Y+1)+' Q'+(X+8)+','+Y+' '+(X+10)+','+(Y+9)+' Z" fill="#7a4ab0"'+o+'/><path d="M'+(X+1)+','+(Y+5)+' l-1.2,-1 M'+(X+9)+','+(Y+5)+' l1.2,-1 M'+(X+5)+','+(Y+1)+' l0,-1.2 M'+(X+3)+','+(Y+3)+' l-1,-1 M'+(X+7)+','+(Y+3)+' l1,-1" stroke="#2a2a3a" stroke-width=".6"/><text x="'+(X+5)+'" y="'+(Y+7.4)+'" text-anchor="middle" font-size="4.6" font-weight="900" fill="#fff" font-family="Zen Maru Gothic,sans-serif">'+'あいうえおかきくけこ'.charAt((m*3+y)%10)+'</text></g>';
    if(c==='>')s+='<path d="M'+(X+3)+','+(Y+3)+' L'+(X+7.5)+','+(Y+5)+' L'+(X+3)+','+(Y+7)+' Z" fill="#ff7a59" stroke="#2a2a3a" stroke-width=".4"/>';
    if(c==='<')s+='<path d="M'+(X+7)+','+(Y+3)+' L'+(X+2.5)+','+(Y+5)+' L'+(X+7)+','+(Y+7)+' Z" fill="#ff7a59" stroke="#2a2a3a" stroke-width=".4"/>';
  }
  // たてもの
  var hi=0;
  for(var yy=0;yy<MH;yy++)for(var xx=0;xx<MW;xx++){var k=T(m,xx,yy);if(OBJ[k]){s+=objSVG(k,xx*10,yy*10,hi++,th,m);}}
  return s;
}
function objSVG(k,X,Y,i,th,m){
  var o=' stroke="#2a2a3a" stroke-width=".6"', s='';
  if(k==='H'){var rc=th==='castle'?'#3e3358':ROOF[(i*3+m)%ROOF.length];
    s+='<ellipse cx="'+(X+10)+'" cy="'+(Y+19.4)+'" rx="9" ry="1.2" fill="#000" opacity=".15"/>'+R(X+2.5,Y+8,15,11,'#fff4dc',o)+'<path d="M'+(X+.5)+','+(Y+9)+' L'+(X+10)+','+(Y+1)+' L'+(X+19.5)+','+(Y+9)+' Z" fill="'+rc+'"'+o+'/>'+(th==='snow'?'<path d="M'+(X+3)+','+(Y+7)+' L'+(X+10)+','+(Y+1)+' L'+(X+17)+','+(Y+7)+' Q'+(X+10)+','+(Y+5)+' '+(X+3)+','+(Y+7)+' Z" fill="#fff"/>':'')
      +R(X+8.2,Y+12.5,3.6,6.5,'#a0703c',o)+R(X+3.6,Y+11,3.4,3,'#bfe6ff',o)+R(X+13,Y+11,3.4,3,'#bfe6ff',o);}
  if(k==='N'){var aw=th==='fest'?'#e04a4a':'#3b6fd9';
    s+=R(X+2,Y+8,16,11,'#fff4dc',o)+R(X+1,Y+4,18,5,'#fff',o)+'<path d="M'+(X+1)+','+(Y+4)+' h3.6 v5 h-3.6 Z M'+(X+8.2)+','+(Y+4)+' h3.6 v5 h-3.6 Z M'+(X+15.4)+','+(Y+4)+' h3.6 v5 h-3.6 Z" fill="'+aw+'"/>'+R(X+4,Y+11,12,4,'#ffe9a8',o)+'<circle cx="'+(X+7)+'" cy="'+(Y+13)+'" r="1.2" fill="#e04a4a"/><circle cx="'+(X+10)+'" cy="'+(Y+13)+'" r="1.2" fill="#ff9a3c"/><circle cx="'+(X+13)+'" cy="'+(Y+13)+'" r="1.2" fill="#5fb860"/>'+(th==='fest'?'<ellipse cx="'+(X+3)+'" cy="'+(Y+10)+'" rx="1.4" ry="1.8" fill="#ff5a4a"'+o+'/><ellipse cx="'+(X+17)+'" cy="'+(Y+10)+'" rx="1.4" ry="1.8" fill="#ff5a4a"'+o+'/>':'');}
  if(k==='K'){var lab=knows('学校')?'学校':'がっこう';
    s+='<ellipse cx="'+(X+25)+'" cy="'+(Y+29.4)+'" rx="22" ry="1.6" fill="#000" opacity=".15"/>'+R(X+2,Y+9,46,20,'#fff4dc',o)+R(X+18,Y+2,14,9,'#fff4dc',o)+'<path d="M'+(X)+','+(Y+10)+' L'+(X+50)+','+(Y+10)+' L'+(X+46)+','+(Y+6)+' L'+(X+4)+','+(Y+6)+' Z" fill="#3f8a5a"'+o+'/>'
      +'<circle cx="'+(X+25)+'" cy="'+(Y+6)+'" r="3.4" fill="#fff"'+o+'/><path d="M'+(X+25)+','+(Y+6)+' v-2 M'+(X+25)+','+(Y+6)+' h1.6" stroke="#2a2a3a" stroke-width=".5"/>';
    for(var w=0;w<6;w++){if(w===3)continue;s+=R(X+5+w*7,Y+13,4.6,4,'#bfe6ff',o)+R(X+5+w*7,Y+20,4.6,4,'#bfe6ff',o);}
    s+=R(X+21.5,Y+20,7,9,'#a0703c',o)+R(X+16,Y+12.6,18,5.6,'#fff',o+' rx="1"')+'<text x="'+(X+25)+'" y="'+(Y+17)+'" text-anchor="middle" font-size="'+(lab.length>2?3.6:4.4)+'" font-weight="900" fill="'+(lab.length>2?'#2a2a3a':'#3b6fd9')+'" font-family="Zen Maru Gothic,sans-serif">'+lab+'</text>';}
  if(k==='J'){s+=R(X+3,Y+8,24,11,'#c9945a',o)+'<path d="M'+(X+3)+','+(Y+8)+' L'+(X+27)+','+(Y+19)+' M'+(X+27)+','+(Y+8)+' L'+(X+3)+','+(Y+19)+'" stroke="#8b5a2b" stroke-width=".8"/>'+R(X+1,Y+5,28,4,'#fff',o)+'<path d="M'+(X+1)+','+(Y+5)+' h4 v4 h-4 Z M'+(X+9)+','+(Y+5)+' h4 v4 h-4 Z M'+(X+17)+','+(Y+5)+' h4 v4 h-4 Z M'+(X+25)+','+(Y+5)+' h4 v4 h-4 Z" fill="#e04a4a"/>'
     +'<path d="M'+(X+2)+','+(Y+5)+' L'+(X+15)+','+(Y-3)+' L'+(X+28)+','+(Y+5)+' Z" fill="#e04a4a"'+o+'/><ellipse cx="'+(X+15)+'" cy="'+(Y+2)+'" rx="3.4" ry="2.6" fill="#c9945a"'+o+'/><ellipse cx="'+(X+15)+'" cy="'+(Y+1)+'" rx="3.4" ry="1.3" fill="#fff4dc"'+o+'/>';}
  if(k==='Q'){var gq=!S.cleared[7], wc=gq?'#d8d8d8':'#fff', rf=gq?'#a0a0a0':'#ff8ab0', fl=gq?'#bbb':'#e04a4a';
    s+='<ellipse cx="'+(X+20)+'" cy="'+(Y+29.4)+'" rx="19" ry="1.6" fill="#000" opacity=".15"/>'+R(X+4,Y+12,32,17,wc,o)+R(X+1,Y+6,9,23,wc,o)+R(X+30,Y+6,9,23,wc,o)+R(X+14,Y+4,12,10,wc,o)
     +'<path d="M'+(X)+','+(Y+6.5)+' L'+(X+5.5)+','+(Y-3)+' L'+(X+11)+','+(Y+6.5)+' Z M'+(X+29)+','+(Y+6.5)+' L'+(X+34.5)+','+(Y-3)+' L'+(X+40)+','+(Y+6.5)+' Z M'+(X+13)+','+(Y+4.5)+' L'+(X+20)+','+(Y-6)+' L'+(X+27)+','+(Y+4.5)+' Z" fill="'+rf+'"'+o+'/>'
     +'<path d="M'+(X+20)+','+(Y-6)+' v-4 l4,1.5 l-4,1.5" fill="'+fl+'" stroke="#2a2a3a" stroke-width=".5"/>'+'<path d="M'+(X+16)+','+(Y+29)+' v-8 a4,4 0 0 1 8,0 v8 Z" fill="#a0703c"'+o+'/>'+R(X+3.5,Y+12,4,5,gq?'#ccc':'#bfe6ff',o)+R(X+32.5,Y+12,4,5,gq?'#ccc':'#bfe6ff',o)+'<circle cx="'+(X+20)+'" cy="'+(Y+9)+'" r="2.4" fill="'+(gq?'#bbb':'#ffd23f')+'"'+o+'/>';}
  return s;
}

// ---------- フィールドを かく ----------
function fitView(){var r=$('field').getBoundingClientRect();if(!r.width||!r.height)return;var a=r.width/r.height;VW=Math.min(MW*10,Math.max(100,100*a));VH=Math.max(100,Math.min(MH*10,VW/a));$('fieldSvg').setAttribute('viewBox','0 0 '+VW+' '+VH);}
function camTo(anim){cam.x=Math.max(0,Math.min(MW*10-VW,hero.x*10+5-VW/2));cam.y=Math.max(0,Math.min(MH*10-VH,hero.y*10+5-VH/2));
  var w=$('world');if(!w)return;if(!anim)w.classList.add('noanim');w.style.transform='translate('+(-cam.x)+'px,'+(-cam.y)+'px)';if(!anim){void w.getBoundingClientRect();w.classList.remove('noanim');}drawArrow();}
function drawField(){
  fitView();var m=hero.m,svg=$('fieldSvg');svg.innerHTML='';
  var world=el('g',{id:'world'});world.innerHTML=tileSVG(m);svg.appendChild(world);
  var e=curEgg(m);
  if(e){var eg=el('g',{transform:'translate('+(e.x*10+0.6)+','+(e.y*10-1.4)+') scale(.058)'});eg.innerHTML='<g class="eggshine">'+eggSVG(ORDER.indexOf(e.g),Math.min(S.egg[e.g]||0,10),'')+'</g>';world.appendChild(eg);}
  var b=bossActive(m);
  if(b){var bg=el('g',{transform:'translate('+(b.x*10-(b.final?4.6:3))+','+(b.y*10-(b.final?9:6))+') scale('+(b.final?.12:.1)+')'});bg.innerHTML='<g class="mobbob">'+mobSVG(b.t,true)+'</g>';world.appendChild(bg);}
  npcList(m).forEach(function(n,i){var g=el('g',{transform:'translate('+(n.x*10)+','+(n.y*10)+')'});g.innerHTML='<g class="npcbob" style="animation-delay:-'+(i*.37).toFixed(2)+'s">'+spriteSVG(n.k)+'</g>';world.appendChild(g);});
  mobs.forEach(function(mb){var g=el('g',{class:'mob',id:mb.id});g.style.transform='translate('+(mb.x*10)+'px,'+(mb.y*10)+'px)';var inner=el('g',{transform:'translate(1,1.6) scale(.05)'});inner.innerHTML='<g class="mobbob">'+mobSVG(mb.t)+'</g>';g.appendChild(inner);world.appendChild(g);});
  var rg=el('g',{id:'ringG'});world.appendChild(rg);
  var h=el('g',{id:'hero'});h.innerHTML=heroSVG();h.style.transform='translate('+(hero.x*10)+'px,'+(hero.y*10)+'px)';world.appendChild(h);
  var fx=el('g',{id:'fxG'});world.appendChild(fx);
  svg.appendChild(el('g',{id:'uiG'}));
  $('mapName').innerHTML=kt(MAPS[m].name);bgm(MAPS[m].theme);prefetchPacks(['m'+m,'sys']);
  camTo(false);drawRing();updateTip();
}
function drawRing(){var g=$('ringG');if(!g)return;clear(g);if(!ring||ring.m!==hero.m)return;var c=el('circle',{cx:ring.x*10+5,cy:ring.y*10+5,r:6.5,fill:'none',stroke:'#ffd23f','stroke-width':1.6});c.setAttribute('class','pulse');g.appendChild(c);var a=el('path',{d:'M'+(ring.x*10+5)+','+(ring.y*10-1)+' l-2.4,-3 h4.8 Z',fill:'#ff7a59',stroke:'#2a2a3a','stroke-width':.4});a.setAttribute('class','bounce');g.appendChild(a);}
// めあて（つぎに することと その ばしょ）
function objective(){
  var m=hero.m,f=frontier();
  if(S.ending)return {t:'まおうを たおした！ すきな ところを ぼうけんしよう'};
  if(m<f){var ex=findTile(m,'>');return {t:'みぎの みちから つぎの くにへ すすもう ▶',x:ex[0],y:ex[1]};}
  if(m===0&&S.tut<1)return {t:''};
  var e=curEgg(m);if(e)return {t:(S.egg[e.g]?'とちゅうの たまご。あと '+(EGG_GOAL-S.egg[e.g])+'かい！':'たまごを さがそう！')+' さわると ひらくよ',x:e.x,y:e.y};
  var live=mobs.filter(function(q){return !q.train;});
  if(live.length){var best=live[0],bd=1e9;live.forEach(function(q){var d=Math.abs(q.x-hero.x)+Math.abs(q.y-hero.y);if(d<bd){bd=d;best=q;}});return {t:'てきを ぜんぶ やっつけよう！ のこり '+live.length,x:best.x,y:best.y};}
  if(!mobsOn(m))return {t:''};
  var b=bossActive(m);if(b)return {t:'ボス「'+b.name+'」に さわって たたかおう！',x:b.x,y:b.y};
  return {t:''};
}
function findTile(m,ch){for(var y=0;y<MH;y++){var i=MAPS[m].tiles[y].indexOf(ch);if(i>=0)return [i,y];}return [0,0];}
function updateTip(){
  var o=objective();$('tip').innerHTML=o.t?'<span class="spk">🔊</span>'+esc(o.t):'';$('tip').dataset.t=o.t;$('tip').hidden=!o.t||talking;
  var m=hero.m,p=$('prog');
  if(MAPS[m].kanji){var k=regKanji(m),eb=k.length-eggsLeft(m).length,mb=(S.mb[m]||[]).length;
    p.innerHTML=S.cleared[m]?'<b>クリア！</b>':'たまご <b>'+eb+'/'+k.length+'</b>　てき <b>'+mb+'/'+MAPS[m].mobs.length+'</b>'+(bossActive(m)?'　<b class="bossmark">ボス！</b>':'');p.hidden=false;}
  else p.hidden=true;
  drawArrow();
}
function drawArrow(){
  var g=$('uiG');if(!g)return;clear(g);var o=objective();if(o.x==null||talking)return;
  var tx=o.x*10+5-cam.x,ty=o.y*10+5-cam.y;if(tx>4&&tx<VW-4&&ty>4&&ty<VH-4)return;
  var cx=VW/2,cy=VH/2,dx=tx-cx,dy=ty-cy,L=Math.sqrt(dx*dx+dy*dy)||1;dx/=L;dy/=L;
  var k=Math.min((VW/2-9)/Math.abs(dx||1e-6),(VH/2-9)/Math.abs(dy||1e-6)),ax=cx+dx*k,ay=cy+dy*k,ang=Math.atan2(dy,dx)*180/Math.PI;
  var a=el('g',{transform:'translate('+ax+','+ay+') rotate('+ang+')'});a.appendChild(el('circle',{r:6,fill:'#fffaf0',stroke:'#2a2a3a','stroke-width':.8}));a.appendChild(el('path',{d:'M-2.6,-3 L3.4,0 L-2.6,3 Z',fill:'#ff7a59'}));a.setAttribute('class','arrowui');g.appendChild(a);
}

// ---------- あるく ----------
function bfs(m,sx,sy,tx,ty,trig){
  var ok=function(x,y){return walkable(m,x,y)||(trig&&x===tx&&y===ty);};
  if(!ok(tx,ty))return null;var key=function(x,y){return x+','+y;};var prev={},q=[[sx,sy]];prev[key(sx,sy)]=null;
  while(q.length){var c=q.shift();if(c[0]===tx&&c[1]===ty)break;[[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){var nx=c[0]+d[0],ny=c[1]+d[1];if(nx<0||ny<0||nx>=MW||ny>=MH)return;var k=key(nx,ny);if(k in prev||!ok(nx,ny))return;prev[k]=c;q.push([nx,ny]);});}
  if(!(key(tx,ty) in prev))return null;var p=[],c=[tx,ty];while(c&&!(c[0]===sx&&c[1]===sy)){p.unshift(c);c=prev[key(c[0],c[1])];}return p;
}
function walkTo(tx,ty){var p=bfs(hero.m,hero.x,hero.y,tx,ty);if(!p)return false;path=p;if(!moving)stepAlong();return true;}
function stepAlong(){
  if(cur!=='field'||talking){path=[];moving=false;return;}
  if(!path.length){moving=false;if(pending){var n=pending;pending=null;if(Math.abs(n.x-hero.x)+Math.abs(n.y-hero.y)===1)interact(n);}return;}
  moving=true;var n=path.shift();if(!moveHero(n[0],n[1])){path=[];moving=false;pending=null;return;}setTimeout(stepAlong,170);
}
function adjTarget(tx,ty){var best=null,bl=1e9;[[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){var x=tx+d[0],y=ty+d[1];if(x===hero.x&&y===hero.y){best=[];bl=0;return;}var p=bfs(hero.m,hero.x,hero.y,x,y);if(p&&p.length<bl){bl=p.length;best=p;}});return best;}
function onTap(tx,ty){
  if(tx<0||ty<0||tx>=MW||ty>=MH)return;
  var n=npcAt(hero.m,tx,ty)||signAt(hero.m,tx,ty);
  if(n){var p=adjTarget(tx,ty);if(!p)return;if(!p.length){interact(n);return;}pending=n;path=p;if(!moving)stepAlong();return;}
  if(tx===hero.x&&ty===hero.y){arrive(true);return;}
  walkTo(tx,ty);
}
// 1マス すすむ。イベントが おきたら false
function moveHero(x,y){
  hero.px=hero.x;hero.py=hero.y;hero.x=x;hero.y=y;step();
  var h=$('hero');if(h)h.style.transform='translate('+(x*10)+'px,'+(y*10)+'px)';
  S.map=hero.m;S.pos=[x,y];camTo(true);
  if(ring&&ring.m===hero.m&&ring.x===x&&ring.y===y&&!ring.npc){ring=null;drawRing();}
  var c=T(hero.m,x,y);
  if(c==='>'&&hero.m<MAPS.length-1){goMap(hero.m+1,'<');return false;}
  if(c==='<'&&hero.m>0){goMap(hero.m-1,'>');return false;}
  save();
  return arrive(false);
}
function arrive(tapSelf){
  var x=hero.x,y=hero.y,e=curEgg(hero.m);
  if(e&&e.x===x&&e.y===y){path=[];setTimeout(function(){openEgg(e);},180);return false;}
  var b=bossActive(hero.m);
  if(b&&b.x===x&&b.y===y){path=[];setTimeout(function(){bossEncounter(hero.m);},180);return false;}
  if(!tapSelf&&checkMob())return false;
  updateTip();return true;
}
function stepBack(){hero.x=hero.px;hero.y=hero.py;S.pos=[hero.x,hero.y];save();}
function goMap(m,from){
  path=[];pending=null;var p=findTile(m,from);hero.m=m;hero.x=p[0]+(from==='<'?1:-1);hero.y=p[1];hero.px=hero.x;hero.py=hero.y;
  S.map=m;S.pos=[hero.x,hero.y];save();spawnMobs();sfx('warp');
  var f=$('field');f.classList.remove('fadein');void f.offsetWidth;f.classList.add('fadein');
  drawField();setTimeout(hooks,450);
}
function checkMob(){for(var i=0;i<mobs.length;i++){var mb=mobs[i];if(mb.x===hero.x&&mb.y===hero.y){path=[];pending=null;var it=mb;setTimeout(function(){startMob(it);},150);return true;}}return false;}
function moveMobs(){
  if(cur!=='field'||talking)return;var e=curEgg(hero.m),b=bossActive(hero.m);
  mobs.forEach(function(mb){if(Math.random()<.35)return;var d=shuffle([[1,0],[-1,0],[0,1],[0,-1]])[0];var nx=mb.x+d[0],ny=mb.y+d[1],c=T(hero.m,nx,ny);
    if(Math.abs(nx-mb.hx)>3||Math.abs(ny-mb.hy)>3)return;
    if(walkable(hero.m,nx,ny)&&c!=='>'&&c!=='<'&&c!=='X'&&!(e&&e.x===nx&&e.y===ny)&&!(b&&b.x===nx&&b.y===ny)&&!mobs.some(function(o){return o!==mb&&o.x===nx&&o.y===ny;})){mb.x=nx;mb.y=ny;var g=$(mb.id);if(g)g.style.transform='translate('+(nx*10)+'px,'+(ny*10)+'px)';}});
  if(!moving&&checkMob())return;
  drawArrow();
}
function toWorld(ev){var w=$('world'),pt=$('fieldSvg').createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;return pt.matrixTransform(w.getScreenCTM().inverse());}
$('fieldSvg').addEventListener('click',function(ev){ac();if(talking){nextTalk();return;}var p=toWorld(ev);onTap(Math.floor(p.x/10),Math.floor(p.y/10));});
function nudge(dx,dy){ac();if(talking){nextTalk();return;}if(moving)return;var nx=hero.x+dx,ny=hero.y+dy;var n=npcAt(hero.m,nx,ny)||signAt(hero.m,nx,ny);if(n){interact(n);return;}
  var e=curEgg(hero.m),b=bossActive(hero.m);if(walkable(hero.m,nx,ny)||(b&&b.x===nx&&b.y===ny))moveHero(nx,ny);}
document.querySelectorAll('.dpad button').forEach(function(b){var d=b.getAttribute('data-d').split(',').map(Number);b.addEventListener('click',function(ev){ev.stopPropagation();nudge(d[0],d[1]);});});
document.addEventListener('keydown',function(e){if(cur!=='field')return;var m={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[e.key];if(m){e.preventDefault();nudge(m[0],m[1]);}else if((e.key==='Enter'||e.key===' ')&&talking){e.preventDefault();nextTalk();}});
window.addEventListener('resize',function(){if(cur==='field'){fitView();camTo(false);}});

// ---------- はなす ----------
var TQ=null;
function talk(lines,done){sfx('talk');talking=true;$('field').classList.add('talking');path=[];pending=null;TQ={l:lines,i:0,done:done};$('tip').hidden=true;drawArrow();showLine();}
function guide(texts,done){talk(texts.map(function(t){return {who:'fudeko',name:'ふでこ',text:t};}),done);}
function faceSVG(who){
  if(who==='fudeko')return '<svg viewBox="0 0 100 100">'+fudekoSVG()+'</svg>';
  if(who==='sign')return '<svg viewBox="0 0 10 10"><rect x="0" y="0" width="10" height="10" fill="#e8f6d8"/>'+tileSign()+'</svg>';
  return '<svg viewBox="0.5 0 9 9.4">'+spriteSVG(who)+'</svg>';
}
function tileSign(){return R(4.4,5,1.2,4.5,'#8b5a2b')+R(1.5,1.5,7,4.5,'#e0b070',' stroke="#2a2a3a" stroke-width=".4" rx="1"');}
function showLine(){var L=TQ.l[TQ.i],b=$('talk');b.hidden=false;b.querySelector('.face').innerHTML=faceSVG(L.who);b.querySelector('.who').innerHTML=kt(L.name||'');
  var tx=b.querySelector('.txt');tx.innerHTML=kt(L.text);tx.classList.remove('typein');void tx.offsetWidth;tx.classList.add('typein');say(L.text,L.who==='sign'?'narr':L.who);}
function nextTalk(){if(!TQ)return;TQ.i++;if(TQ.i>=TQ.l.length){endTalk(true);}else showLine();}
function endTalk(run){var d=TQ&&TQ.done;TQ=null;talking=false;$('field').classList.remove('talking');$('talk').hidden=true;stopVoice();updateTip();if(run&&d)d();}
$('talk').addEventListener('click',function(ev){ev.stopPropagation();ac();nextTalk();});
function bubble(n,t){var g=$('fxG');if(!g)return;var b=el('g',{transform:'translate('+(n.x*10+5)+','+(n.y*10-2)+')'});b.innerHTML='<rect x="-9" y="-6" width="18" height="6.4" rx="3" fill="#fff" stroke="#2a2a3a" stroke-width=".5"/><text y="-1.4" text-anchor="middle" font-size="3.6" font-weight="900" fill="#2a2a3a" font-family="Zen Maru Gothic,sans-serif">'+esc(t)+'</text><path d="M-1,0.3 L0,2 L1,0.3" fill="#fff" stroke="#2a2a3a" stroke-width=".4"/>';b.setAttribute('class','pop');g.appendChild(b);setTimeout(function(){b.remove();},1400);}
function interact(n){
  if(n.sign){talk([{who:'sign',name:'かんばん',text:n.text}]);return;}
  if(isAnimal(n.k)){var a=ANIMAL[n.k];bubble(n,a.say);tone(a.hz[0],'triangle',.18,.18,a.hz[1]);setTimeout(function(){tone(a.hz[1],'triangle',.18,.15,a.hz[0]);},200);say(a.say,'anim');return;}
  var lines=(S.cleared[hero.m]&&n.a)?n.a:n.l;
  talk(lines.map(function(t){return {who:n.k,name:n.n,text:t};}),function(){
    if(ring&&ring.npc&&ring.m===hero.m&&ring.x===n.x&&ring.y===n.y){ring=null;drawRing();}
    if(n.id==='oba0'&&S.tut===3){
      guide(GD.oba,function(){
        S.tut=4;save();spawnMobs();drawField();
        var t=mobs[0];
        guide(GD.slime,function(){if(t){ring={m:0,x:t.hx,y:t.hy};drawRing();}});
      });
    }
  });
}

// ---------- ガイド（チュートリアルと できごと） ----------
var pendingGuide=null;
function hooks(){
  if(cur!=='field'||talking)return;
  var m=hero.m;
  if(pendingGuide){var p=pendingGuide;pendingGuide=null;if(p.gate)sfx('gate');guide(p.lines,function(){if(p.done)p.done();hooks();});return;}
  if(S.tut===1&&!S.seen.t1){S.seen.t1=1;save();var e=curEgg(0);
    guide(GD.t1,function(){if(e){ring={m:0,x:e.x,y:e.y};drawRing();}});return;}
  if(S.tut===3&&!S.seen.t3){S.seen.t3=1;save();
    guide(GD.t3,function(){ring={m:0,x:4,y:3,npc:true};drawRing();});return;}
  if(m>0&&!S.seen['r'+m]){S.seen['r'+m]=1;save();
    if(m===8)guide(GD.castle);
    else guide(GD.region(m));
    return;}
  var b=bossActive(m);
  if(b&&!b.final&&!S.seen['b'+m]){S.seen['b'+m]=1;save();drawField();
    guide(GD.boss(b),function(){ring={m:m,x:b.x,y:b.y};drawRing();});return;}
}

$('tip').addEventListener('click',function(e){e.stopPropagation();ac();var t=$('tip').dataset.t;if(t)say(t);});
