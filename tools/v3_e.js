// ---------- タイトル・おはなし ----------
function eggG(ci,n,x,y,s){return '<g transform="translate('+x+','+y+') scale('+s+')">'+eggSVG(ci,n,'').replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')+'</g>';}
function ch(g,x,y,s){return C[g]?'<g transform="translate('+x+','+y+') scale('+s+')">'+C[g].svg+'</g>':'';}
function renderTitle(){
  var v=$('title');v.innerHTML='';
  var art=mk('div','titleart','<svg viewBox="0 0 320 150" aria-hidden="true"><ellipse cx="160" cy="140" rx="150" ry="10" fill="#000" opacity=".1"/>'
   +''+eggG(0,3,8,52,.5)+''+eggG(2,6,250,58,.45)+''
   +ch('山',70,40,.62)+ch('花',150,44,.6)
   +'<g transform="translate(118,62) scale(.8)"><svg viewBox="0 0 100 100" width="100" height="100">'+fudekoSVG()+'</svg></g>'
   +'<g transform="translate(258,0) scale(.36)" opacity=".9">'+maouSVG(false)+'</g></svg>');
  v.appendChild(mk('h2','logo','かんじぼうけん'));
  v.appendChild(mk('p','sub','まおうに ふうじられた かんじを とりもどせ！'));
  v.appendChild(art);
  var row=mk('div','row');
  row.appendChild(btn(S.tut>0?'つづきから':'はじめる','go big',function(){ac();if(S.tut>0)enterField();else story();}));
  v.appendChild(row);
}
function enterField(){var p=S.pos;hero.m=S.map||0;if(p){hero.x=p[0];hero.y=p[1];}else{var st=MAPS[0].start;hero.x=st[0];hero.y=st[1];}
  if(!walkable(hero.m,hero.x,hero.y)&&!curEgg(hero.m)){hero.m=0;hero.x=MAPS[0].start[0];hero.y=MAPS[0].start[1];}
  hero.px=hero.x;hero.py=hero.y;spawnMobs();show('field');}
var STORY=[
 {t:'むかしむかし、ことばの くにでは、かんじたちが みんな なかよく くらしていました。',art:function(){return '<rect width="320" height="200" fill="#bfe6ff"/><path d="M0,130 L60,70 L110,120 L170,60 L240,130 L320,90 L320,200 L0,200 Z" fill="#8fd06a"/><rect y="150" width="320" height="50" fill="#9ad36b"/>'+ch('山',20,90,.55)+ch('花',100,96,.5)+ch('木',180,92,.52)+ch('日',250,30,.4)+'<g transform="translate(240,120)"><rect x="0" y="0" width="70" height="40" rx="6" fill="#e0b070" stroke="#2a2a3a" stroke-width="3"/><text x="35" y="28" text-anchor="middle" font-size="22" font-weight="900" fill="#2a2a3a" font-family="Klee One,serif">山と川</text></g>';}},
 {t:'ある日、まおう ヒラガナーが あらわれて、かんじを ぜんぶ たまごに ふうじこめて しまいました！',art:function(){var s='<rect width="320" height="200" fill="#3a2460"/><path d="M40,20 l10,30 l-8,0 l12,34" fill="none" stroke="#ffd23f" stroke-width="5"/><path d="M270,14 l-10,28 l8,0 l-12,30" fill="none" stroke="#ffd23f" stroke-width="5"/>'+'<g transform="translate(90,30) scale(.9)">'+maouSVG(false)+'</g>';for(var i=0;i<6;i++)s+=eggG(i,0,14+i*50,140-(i%2)*24,.26);return s;}},
 {t:'たまごは せかいじゅうに ちらばり、ことばは ぜんぶ ひらがなに なって しまいました。',art:function(){return '<rect width="320" height="200" fill="#d8efff"/><rect y="120" width="320" height="80" fill="#9ad36b"/><g transform="translate(110,60)"><rect x="0" y="0" width="100" height="56" rx="8" fill="#e0b070" stroke="#2a2a3a" stroke-width="3"/><text x="50" y="38" text-anchor="middle" font-size="24" font-weight="900" fill="#2a2a3a" font-family="Zen Maru Gothic,sans-serif">やまとかわ</text><rect x="44" y="56" width="12" height="40" fill="#8b5a2b"/></g><g transform="translate(20,40)"><svg viewBox="0 0 10 10" width="80" height="80">'+personSVG('oba')+'</svg></g><text x="64" y="40" font-size="30" font-weight="900" fill="#2a2a3a">？</text><g transform="translate(230,44)"><svg viewBox="0 0 10 10" width="80" height="80">'+personSVG('boy')+'</svg></g><text x="290" y="40" font-size="30" font-weight="900" fill="#2a2a3a">？</text>'+''+eggG(1,0,30,140,.22)+''+eggG(3,0,260,150,.2)+'';}},
 {t:'そこに あらわれたのは、ふでの ようせい ふでこ。「きみが かんじを かけば、たまごの ふういんが とけるんだ！ いっしょに とりもどそう！」',art:function(){return '<rect width="320" height="200" fill="#fff4dc"/><circle cx="160" cy="100" r="86" fill="#ffe9a8"/><g transform="translate(60,40)"><svg viewBox="0 0 100 100" width="120" height="120">'+fudekoSVG()+'</svg></g><g transform="translate(170,46)"><svg viewBox="0 0 10 10" width="110" height="110">'+heroSVG()+'</svg></g>'+eggG(4,2,140,140,.3)+'';}}
];
function story(){
  show('story');var v=$('story'),i=0;
  function page(){v.innerHTML='';var p=STORY[i];
    v.appendChild(mk('div','panel','<svg viewBox="0 0 320 200" aria-hidden="true">'+p.art()+'</svg>'));
    v.appendChild(mk('p','storytxt',esc(p.t)));
    var row=mk('div','row');
    row.appendChild(btn('とばす','',function(){finish();}));
    row.appendChild(btn(i<STORY.length-1?'つぎへ ▶':'ぼうけんへ！','go',function(){i++;if(i>=STORY.length)finish();else page();}));
    v.appendChild(row);say(p.t,'narr');}
  function finish(){S.tut=1;save();enterField();}
  page();
}
