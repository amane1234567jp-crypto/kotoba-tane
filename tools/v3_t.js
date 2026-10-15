// ---------- セリフ（ぜんぶ ここに あつめる。こえを つくるときも ここから よみだす） ----------
var GD={
 t1:['こんにちは！ ぼくは ふでの ようせい、ふでこ。','まおう ヒラガナーの せいで、この くにの かんじは ぜんぶ たまごに されちゃったんだ。','あっ！ あそこに たまごが ある！ いきたい ところを タッチすると、そこまで あるいて いけるよ。'],
 t3:['やったね！「{山|やま}」の かんじが もどってきた！','むらの おばあさんに はなしかけて みよう。ひとを タッチすると はなせるよ。'],
 oba:['みて！「やま」が かんじの「{山|やま}」に なってたよ。','かんじを とりもどすと、みんなの ことばも もとに もどるんだ。'],
 slime:['あっ、スライムが あらわれた！','スライムに さわると バトル！ かんじを かくと こうげき できるよ。'],
 t4:['ほしを もらうと レベルアップ！ レベルが あがると、ボスとの たたかいで ながく がんばれるよ。','この くにの たまごを ぜんぶ かえして、てきを やっつけると、ボスが でてくるよ。','ボスを たおせば まおうの いばらが きえて、つぎの くにへ いける！ さあ、ぼうけんの はじまりだ！'],
 castle:['ここが まおうの しろ…！','まおう ヒラガナーは いちばん おくの へやに いるよ。なかまを 5にん えらんで たたかおう！'],
 region:function(m){return ['ここは「'+MAPS[m].name+'」。','この くにには たまごが '+MAPS[m].eggs.length+'こ。てきを ぜんぶ やっつけると、ボスが でてくるよ。'];},
 boss:function(b){return ['ボス「'+b.name+'」が あらわれた！ みちを ふさいでいる！','ボスは こうげきして くるよ。あいしょうの いい なかまと、レベルの たかい なかまを えらぼう。','なかまが つかれて ねむっても、つぎの なかまが たたかえる。3にんで いどもう！'];},
 clear:['やったね！ まおうの いばらが きえた！','みぎの みちから、つぎの くにへ すすもう！'],
 clear7:['いろが もどった！ {王|おう}さまの くにが もとどおりだ！','みぎの みちの さきに、まおうの しろが ある。いよいよ さいごの たたかいだ！'],
 maouPre:[['maouA','まおう ヒラガナー','わっはっは！ よく きたな。'],['maouA','まおう ヒラガナー','ことばは ぜんぶ ひらがなで いいのだ！ かんじなんて いらない！'],['fudeko','ふでこ','そんなこと ない！ みんなで とりもどした かんじの ちから、みせてあげよう！']],
 ending:[['maouA','ヒラガナー','うう… まいった…'],['maou','ヒラガナー','ほんとうは、かんじが かっこよくて、うらやましかったんだ…'],['fudeko','ふでこ','ひらがなも かんじも、どっちも だいじな ことばだよ。いっしょに なかよく しよう！'],['maou','ヒラガナー','…うん！ ありがとう！'],['narr','','こうして、ことばの くにに かんじが ぜんぶ もどりました。']]
};
var EGGTIP=['ピキッ！ ひびが はいった！','ゆれてる！','なかで うごいてる！','もうすこし！'];
var HINTS=['オレンジの まるから スタート！','もういっかい！','おてほんが ひかったよ。いっしょに なぞろう'];
var TX={
 eggTut:'たまごに かいてある 字を、かきじゅんどおりに なぞろう。オレンジの まるから スタート！',
 eggTut1:'ピキッ！ ひびが はいった！ 10かい かくと うまれるよ',
 eggNew:function(g){return 'たまごを みつけた！ この じは「'+readOf(g)+'」。10かい かいてね！';},
 eggCont:'つづきから かこう！',
 eggTip:function(n){return EGGTIP[Math.min(3,Math.floor(n/3))]+' '+n+'かい';},
 born:function(g){return 'うまれた！ '+nameOf(g)+'。'+meanOf(g);},
 card:function(g){return nameOf(g)+'。'+meanOf(g);},
 mob:function(t){var m=MOBS[t];return m.name+'が あらわれた！ '+m.sayw+' '+m.why;},
 team:function(b,max){return (b.final?'まおう ヒラガナーとの たたかい！':'ボス '+b.name+'との たたかい！')+' なかまを '+max+'にん えらんでね。'+MOBS[b.t].sayw;},
 fight:function(g,strong){return (strong?'つよいぞ！ ':'')+'「'+readOf(g)+'」を かいて こうげき！';},
 crit:'こうか ばつぐん！',
 shout:function(g){return readOf(g)+'！';},
 sleep:function(g){return nameOf(g)+'は つかれて ねむっちゃった。';},
 next:function(g){return 'つぎは '+nameOf(g)+'！ たのんだよ！';},
 go:function(g){return 'いけっ、'+nameOf(g)+'！';},
 retreat:'みんな つかれちゃった。でも ボスも へとへとだ！ また いどもう！',
 win:'やっつけた！ ほしが でてきた！',
 lvup:function(g){return nameOf(g)+'が レベルアップ！';},
 bossWin:function(b){return b.name+'を たおした！ みんな レベルアップ！';},
 finalWin:'やった！ まおうを たおした！',
 parade:'おめでとう！ かんじを ぜんぶ とりもどした！'
};
function tipTexts(){var a=['まおうを たおした！ すきな ところを ぼうけんしよう','みぎの みちから つぎの くにへ すすもう ▶','たまごを さがそう！ さわると ひらくよ'];
  for(var n=1;n<10;n++)a.push('とちゅうの たまご。あと '+n+'かい！ さわると ひらくよ');
  for(var k=1;k<=5;k++)a.push('てきを ぜんぶ やっつけよう！ のこり '+k);
  MAPS.forEach(function(m){if(m.boss)a.push('ボス「'+m.boss.name+'」に さわって たたかおう！');});return a;}
// ぜんぶの セリフを ならべる（こえを つくる ための 一覧）
function allLines(){
  var L=[],P='sys';function add(who,text){var a=splitS(plain(text)),b=splitS(text);a.forEach(function(s,i){L.push({who:who,s:s,src:(b.length===a.length?b[i]:s),pack:P});});}
  ['t1','t3','oba','slime','t4','castle','clear','clear7'].forEach(function(k){GD[k].forEach(function(t){add('fudeko',t);});});
  MAPS.forEach(function(m,i){P='sys';if(i>0&&i<8)GD.region(i).forEach(function(t){add('fudeko',t);});if(m.boss&&!m.boss.final)GD.boss(m.boss).forEach(function(t){add('fudeko',t);});
    P='m'+i;if(m.boss)add('boss',m.boss.atk);
    m.npcs.forEach(function(n){if(isAnimal(n.k))return;(n.l||[]).concat(n.a||[]).forEach(function(t){add(n.k,t);});});
    (m.signs||[]).forEach(function(t){add('narr',t);});
    P='sys';if(m.boss)add('narr',TX.team(m.boss,m.boss.final?5:3));});
  MAOU_NPC.l.forEach(function(t){add('maou',t);});
  GD.maouPre.concat(GD.ending).forEach(function(x){add(x[0],x[2]);});
  Object.keys(ANIMAL).forEach(function(k){if(ANIMAL[k].say)add('anim',ANIMAL[k].say);});
  STORY.forEach(function(p){add('narr',p.t);});
  [TX.eggTut,TX.eggTut1].forEach(function(t){add('fudeko',t);});
  [TX.eggCont,TX.crit,TX.retreat,TX.win,TX.finalWin,TX.parade].concat(HINTS).forEach(function(t){add('narr',t);});
  for(var n=1;n<10;n++)add('narr',TX.eggTip(n));
  for(var t=0;t<MOBS.length;t++)if(t!==MAOU)add('narr',TX.mob(t));
  tipTexts().forEach(function(t){add('narr',t);});
  ORDER.forEach(function(g,gi){P='g'+gi;[TX.eggNew(g),TX.born(g),TX.card(g),TX.fight(g,true),TX.fight(g,false),TX.shout(g),TX.sleep(g),TX.next(g),TX.go(g),TX.lvup(g)].forEach(function(t){add('narr',t);});});
  P='sys';MAPS.forEach(function(m){if(m.boss&&!m.boss.final)add('narr',TX.bossWin(m.boss));});
  var seen={},out=[];L.forEach(function(x){var k=x.who+'|'+x.s;if(!seen[k]){seen[k]=1;out.push(x);}});return out;
}
window.__lines=allLines;
