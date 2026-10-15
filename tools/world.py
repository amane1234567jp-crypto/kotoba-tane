# かんじぼうけん 世界データ → app/world.js
import json, re, sys
from collections import deque
D='/tmp/claude-0/-home-claude/a581a6c5-b8bb-55ce-8f69-11dc409c4111/scratchpad/'

# てきの しゅるい（weak = つよい漢字）
MOBS=[
 dict(name='みずスライム',col='#6cc0ea',col2='#3b8fc4',weak='火日土',why='{水|みず}は {火|ひ}で わかすと きえる。{日|ひ}（おひさま）で かわく。{土|つち}が すいこむ',sayw='みずスライムには、ほのおの「ひ」と、おひさまの「ひ」と、「つち」が つよい！',deco='drop'),
 dict(name='ほのおスライム',col='#ff8a5c',col2='#e04a2a',weak='水川雨',why='ほのおは {水|みず}や {雨|あめ}で きえる。{川|かわ}の みずでも きえる',sayw='ほのおスライムには、「みず」と「かわ」と「あめ」が つよい！',deco='flame'),
 dict(name='くさスライム',col='#8fdc78',col2='#4fa83a',weak='火虫手',why='くさは {火|ひ}で もえる。{虫|むし}が たべる。{手|て}で ぬける',sayw='くさスライムには、ほのおの「ひ」と、「むし」と、「て」が つよい！',deco='leaf'),
 dict(name='いわスライム',col='#c9c2b6',col2='#8a847a',weak='水力大木',why='いわは {水|みず}で けずれる。{力|ちから}もちや {大|おお}きい ひとが わる。{木|き}の ねっこも わる',sayw='いわスライムには、「みず」と「ちから」と「おおきい」と「き」が つよい！',deco='rock'),
 dict(name='よるおばけ',col='#9a7ad9',col2='#6a4ab0',weak='日火月王',why='くらやみの おばけは、あかるい {日|ひ}や {火|ひ}、{月|つき}の ひかりが にがて。{王|おう}さまも こわい',sayw='よるおばけには、おひさまの「ひ」と、ほのおの「ひ」と、「つき」と「おう」が つよい！',deco='ghost'),
 dict(name='かぜスライム',col='#eef6ff',col2='#a8c8e8',weak='山森林石',why='かぜは {山|やま}や {森|もり}・{林|はやし}に ぶつかって とまる。{石|いし}は とばされない',sayw='かぜスライムには、「やま」と「もり」と「はやし」と「いし」が つよい！',deco='swirl'),
 dict(name='こおりスライム',col='#bfe9ff',col2='#7cc4e8',weak='火日天',why='こおりは {火|ひ}や {日|ひ}の ひかりで とける。{天|てん}（そら）の おひさまにも よわい',sayw='こおりスライムには、ほのおの「ひ」と、おひさまの「ひ」と、「てん」が つよい！',deco='ice'),
 dict(name='ねむねむスライム',col='#ffd1e8',col2='#e69ac0',weak='音早耳目口',why='{大|おお}きな {音|おと}で おきる。{早|はや}く おきて！ {耳|みみ}もとで {口|くち}から よぶと {目|め}を さます',sayw='ねむねむスライムには、「おと」と「はやい」と「みみ」と「め」と「くち」が つよい！',deco='sleep'),
 dict(name='もじくいスライム',col='#ffe08a',col2='#e0b040',weak='字文本学名',why='{字|じ}や {文|ぶん}や {本|ほん}を たべすぎると、おなか いっぱいに なる。{学|がく}も {名|な}まえも だいすき',sayw='もじくいスライムには、「じ」と「ぶん」と「ほん」と「がく」と「な」が つよい！',deco='letter'),
 dict(name='まよいスライム',col='#b8f0d8',col2='#6cc8a0',weak='右左上下見',why='{右|みぎ}・{左|ひだり}・{上|うえ}・{下|した}と みちを おしえて、{見|み}て あげると おうちに かえれる',sayw='まよいスライムには、「みぎ」「ひだり」「うえ」「した」「みる」が つよい！',deco='question'),
 dict(name='いたずらカラス',col='#4a4a5e',col2='#2a2a3a',weak='人男女子犬',why='カラスは {人|ひと}や {犬|いぬ}が くると にげていく。{男|おとこ}の{子|こ}も {女|おんな}の{子|こ}も こわい',sayw='いたずらカラスには、「ひと」と「おとこ」と「おんな」と「こ」と「いぬ」が つよい！',deco='crow'),
 dict(name='いろぬすみスライム',col='#d8d8d8',col2='#a0a0a0',weak='赤青白玉',why='ぬすまれた {赤|あか}・{青|あお}・{白|しろ}の いろや {玉|たま}を とりもどすと よわくなる',sayw='いろぬすみスライムには、「あか」「あお」「しろ」「たま」が つよい！',deco='paint'),
 dict(name='まおう ヒラガナー',col='#8a5cc8',col2='#5a3a98',weak='',why='かんじの ちからで、ことばを とりもどそう',sayw='どの かんじも つよい！',deco='maou'),
]

# たいけつ時の ボスの わざ
MAPS=[]
def M(**k): MAPS.append(k)

M(name='{花|はな}の はらっぱ',theme='grass',start=[9,6],
 kanji='山木',
 tiles=[
"TTTTTTTTTTTTTTTTTTTTTTTT",
"T..,....T..;;;;....,...T",
"T.Hh.Hh.T..;;;;..RR....T",
"T.hh.hh.......,.....,..T",
"T..==========......T...T",
"T..=..Y.....=..,.......T",
"T..=........======.....T",
"T,.=..O..,.......=..,TTT",
"T..=.............=...TTT",
"TFFFFFFF.,..;;;..=...TTT",
"TFcc.ccF.....;;;.====X=>",
"TFcc.ccF..,......=...TTT",
"TF.....F.........=...TTT",
"TFFF.FFF...RR....=..,..T",
"T,.......,....,.......,T",
"TTTTTTTTTTTTTTTTTTTTTTTT"],
 eggs=[(13,8),(16,5)],
 mobs=[((14,3),5)],
 boss=dict(x=20,y=10,t=3,name='ゴロゴロキング',hp=5,atk='ゴロゴロ アタック！'),
 signs=['← むら　　→ {水|みず}と {川|かわ}の さと'],
 npcs=[
  dict(x=4,y=3,k='oba',n='おばあさん',id='oba0',l=['{山|やま}が きれいに みえるねえ。','{木|き}の したで ひとやすみ するのが すきなのよ。']),
  dict(x=8,y=11,k='farmer',n='のうかの おじさん',l=['{田|た}んぼと はたけの せわを しているんだ。','うしは {一|いっ}とう、{二|に}とう… ぜんぶで {三|さん}とう いるよ。'],a=['{土|つち}が げんきだと やさいも げんきだ！']),
  dict(x=14,y=7,k='boy',n='むらの こ',l=['{日|ひ}が のぼると {花|はな}が さくんだよ！','{草|くさ}むらには スライムが かくれてるよ。']),
  dict(x=19,y=8,k='traveler',n='たびびと',l=['この さきは {水|みず}と {川|かわ}の さと。','でも まおうの いばらで とおれない… ボスを たおせば きえるらしい。'],a=['いばらが きえた！ {水|みず}の さとへ いってらっしゃい！']),
  dict(x=2,y=12,k='cow'),dict(x=6,y=12,k='cow'),dict(x=4,y=10,k='chick'),dict(x=3,y=12,k='pig'),dict(x=10,y=3,k='dog'),dict(x=1,y=5,k='chick'),
 ])

M(name='{水|みず}と {川|かわ}の さと',theme='pond',
 kanji='水川火雨石貝虫竹四五土田',
 tiles=[
"TTTTTTTTTTTTTTTTTTTTTTTT",
"T...,..WWW.....SSSSSS..T",
"T.....WWWWW...SSWWWWSS.T",
"T..;;.WWWWW..,SWWWWWWS.T",
"T..;;..WWW....SSWWWWSS.T",
"T.......W......SSSSSS..T",
"T..R....B=========....,T",
"T.......W...Hh...=.....T",
"T..,....W...hh...=...TTT",
"<=======B........=...TTT",
"T.......W........====X=>",
"T...;;..W..,.........TTT",
"T...;;..WW....RR.....TTT",
"T.,......WW.......,..TTT",
"T.........WWWWWW.....,.T",
"TTTTTTTTTTTTTTTTTTTTTTTT"],
 eggs=[(4,9),(2,3),(5,13),(12,1),(20,5),(19,12),(13,11),(14,4),(18,13),(3,4),(16,13),(2,13)],
 mobs=[((5,5),1),((12,5),2),((16,8),5),((11,13),1),((20,11),0)],
 boss=dict(x=20,y=10,t=1,name='メラメラドン',hp=10,atk='メラメラ ビーム！'),
 signs=[],
 npcs=[
  dict(x=7,y=7,k='fisher',n='つりびと',l=['{川|かわ}で さかなを つっているんだ。','{雨|あめ}が ふると {水|みず}が ふえるよ。']),
  dict(x=22,y=2,k='girl',n='すなはまの こ',l=['すなはまで {貝|かい}を ひろったよ！','{石|いし}を {四|よっ}つ、{五|いつ}つと ならべたの。']),
  dict(x=2,y=11,k='oji',n='たけやの おじいさん',l=['{竹|たけ}は まっすぐ のびるんだ。','{虫|むし}かごも {竹|たけ}で つくるよ。']),
  dict(x=15,y=8,k='woman',n='たきびの おばさん',l=['{火|ひ}に ちかづくときは きをつけてね。','メラメラドンは {水|みず}が にがて なのよ。'],a=['メラメラドンが いなくなって ほっと したわ。']),
  dict(x=12,y=3,k='duck'),dict(x=5,y=8,k='frog'),dict(x=11,y=6,k='duck'),
 ])

M(name='{森|もり}の {村|むら}',theme='forest',
 kanji='森林村犬休気生月六七草日',
 tiles=[
"PPPPPPPPPPPPPPPPPPPPPPPP",
"PP....PPP..........PP..P",
"P..;;..PP..HhHhHh..P...P",
"P..;;......hhhhhh......P",
"PP.....P...........PP..P",
"P...PP.====Y=====......P",
"<===...=........=..P...P",
"P..P...=..PPP...=..PPPPP",
"P.....==..PPP...=...,PPP",
"PP.P..=.........=...;PPP",
"P.....=====.=====.==X==>",
"P..PP.....,......P..PPPP",
"P..PP..;;....PP.....PPPP",
"P.......;;...PP..,..PPPP",
"PP...P.....,...........P",
"PPPPPPPPPPPPPPPPPPPPPPPP"],
 eggs=[(4,6),(2,2),(21,1),(5,9),(9,13),(18,13),(13,7),(22,4),(2,14),(16,14),(12,11),(20,9)],
 mobs=[((1,12),4),((10,4),5),((18,6),2),((11,13),4),((21,14),3)],
 boss=dict(x=19,y=10,t=4,name='ヨルノヌシ',hp=12,atk='まっくら ドロン！'),
 signs=['ここは {森|もり}の {村|むら}　{六|ろっ}けんの いえ'],
 npcs=[
  dict(x=6,y=3,k='oji',n='きこり',l=['{森|もり}は {木|き}が いっぱい。{林|はやし}は {木|き}が すこし。','{木|き}が {三|みっ}つで {森|もり}、{二|ふた}つで {林|はやし}だよ。']),
  dict(x=18,y=3,k='boy',n='いぬと さんぽの こ',l=['{犬|いぬ}の ポチと さんぽ ちゅう！','つかれたら {木|き}の したで {休|やす}もう。']),
  dict(x=19,y=3,k='dog'),
  dict(x=13,y=4,k='elder',n='むらおさ',l=['ここは {森|もり}の {村|むら}。いえは {六|ろっ}けん。','よるに なると {月|つき}が でて、おばけが でるんだ。'],a=['ヨルノヌシが いなくなって、よるも あんしんじゃ。']),
  dict(x=8,y=8,k='oba',n='おばあさん',l=['{気|き}を つけて いっておいで。','{生|い}きものは みんな なかまだよ。{七|なな}ひきの こりすも いるの。']),
  dict(x=15,y=12,k='owl'),dict(x=4,y=13,k='rabbit'),dict(x=21,y=4,k='rabbit'),
 ])

M(name='にぎやかな {町|まち}',theme='town',
 kanji='町人車男女子金円八九一',
 tiles=[
"TTTTTTTTTTTTTTTTTTTTTTTT",
"T,.zzzzzzzzzzzzzzzzzz.,T",
"T..zNhzHhzNhzzHhzNhzz..T",
"T..zhhzhhzhhzzhhzhhzz..T",
"T..zzLzzzzzzLzzzzzzLz..T",
"<====================..T",
"T..zzzzazzzzzzzzazzzz..T",
"T..zHhzzzNhzzHhzzzNhz..T",
"T..zhhzzzhhzzhhzzzhhz.TT",
"T..zzzzzzzzzzzzzzzzzz.TT",
"T....,.....==========X=>",
"T.;;......,=.....,...TTT",
"T.;;..TT...=..RR.....TTT",
"T......,...=.........TTT",
"T..,.......=.....,.....T",
"TTTTTTTTTTTTTTTTTTTTTTTT"],
 eggs=[(4,5),(21,2),(1,12),(8,13),(20,1),(6,9),(17,14),(22,14),(13,12),(12,3),(15,13)],
 mobs=[((6,1),10),((19,6),0),((4,11),1),((16,13),10),((19,12),3)],
 boss=dict(x=20,y=10,t=10,name='ボスガラス',hp=12,atk='カーカー つっつき！'),
 signs=[],
 npcs=[
  dict(x=11,y=6,k='police',n='おまわりさん',l=['{町|まち}には {人|ひと}が いっぱい。','{車|くるま}に きを つけてね。']),
  dict(x=9,y=9,k='clerk',n='おみせの ひと',l=['いらっしゃい！ りんごは {八|はち}じゅう{円|えん}だよ。','{金|きん}いろの りんごも あるよ。']),
  dict(x=14,y=4,k='boy',n='おとこのこ',l=['{男|おとこ}の{子|こ}と {女|おんな}の{子|こ}で おにごっこ！']),
  dict(x=15,y=4,k='girl',n='おんなのこ',l=['もう {九|きゅう}かいも つかまっちゃった〜。','カラスが {人|ひと}の パンを とっていくの。'],a=['カラスが いなくなって、パンが たべられる！']),
  dict(x=2,y=13,k='cat'),dict(x=17,y=11,k='pigeon'),dict(x=7,y=1,k='pigeon'),
 ])

M(name='{学校|がっこう}の おか',theme='school',
 kanji='学校先字文本名年正十二',
 tiles=[
"TTTTTTTTTTTTTTTTTTTTTTTT",
"T,...,..T..Khhhh...,...T",
"T..;;......hhhhh.......T",
"T..;;......hhhhh..TT...T",
"T.....SSSSSS=SSSSSS....T",
"<======SSSSS=SSSSSS....T",
"T.....SSSSSS=SSSSSS..,.T",
"T..,..SSSSSS=SSSSSS....T",
"T...........=.......,TTT",
"T.TT..Hh....=....,...TTT",
"T.....hh..,.=========X=>",
"T,..........;;.......TTT",
"T..FF.FF....;;..TT...TTT",
"T..F...F.........,...TTT",
"T..FFFFF....,.........,T",
"TTTTTTTTTTTTTTTTTTTTTTTT"],
 eggs=[(3,5),(2,1),(20,2),(8,6),(17,7),(1,13),(10,13),(19,14),(15,11),(22,4),(4,10)],
 mobs=[((7,2),8),((16,6),4),((9,11),2),((18,12),8),((1,9),5)],
 boss=dict(x=20,y=10,t=8,name='モジクイドン',hp=14,atk='もぐもぐ パクリ！'),
 signs=[],
 npcs=[
  dict(x=11,y=4,k='teacher',n='{先生|せんせい}',l=['{学校|がっこう}へ ようこそ！ わたしは {先生|せんせい}です。','{字|じ}を {正|ただ}しく かくと、{文|ぶん}が よめるように なるよ。']),
  dict(x=16,y=3,k='girl',n='としょいいん',l=['{本|ほん}が いっぱい！','{名|な}まえを かいて かりてね。モジクイドンに たべられないように！'],a=['{本|ほん}の {字|じ}が もどってきたよ！']),
  dict(x=9,y=8,k='boy',n='{一年生|いちねんせい}',l=['ぼく、{一年生|いちねんせい}！','{十|じゅう}まで かぞえられるよ。いち、に、さん…']),
  dict(x=4,y=13,k='rabbit'),dict(x=6,y=13,k='rabbit'),dict(x=14,y=8,k='chick'),
 ])

M(name='{音|おと}の おまつり ひろば',theme='fest',
 kanji='音目耳口手足見立力出三',
 tiles=[
"TTTTTTTTTTTTTTTTTTTTTTTT",
"T.L..L..L..L..L..L..L..T",
"T......................T",
"T..Nh...SSSSSSS...Nh...T",
"T..hh...SSJhhSS...hh...T",
"<=====..SShhhSS........T",
"T....=..SSSSSSS...Nh...T",
"T..Nh=..SSSSSSS...hh...T",
"T..hh=........=........T",
"T....=====....=......TTT",
"T.......,=....=======X=>",
"T.;;.....=..,........TTT",
"T.;;..RR.=...........TTT",
"T........=====...,...TTT",
"T..,.........,.........T",
"TTTTTTTTTTTTTTTTTTTTTTTT"],
 eggs=[(3,5),(21,2),(1,1),(12,7),(16,4),(11,13),(2,11),(19,14),(15,12),(7,2),(12,9)],
 mobs=[((6,8),7),((19,2),3),((12,11),2),((3,14),7),((18,12),1)],
 boss=dict(x=20,y=10,t=7,name='ネムネムカバ',hp=14,atk='ふわぁ〜 あくび こうげき！'),
 signs=[],
 npcs=[
  dict(x=11,y=6,k='drummer',n='たいこの おじさん',l=['ドンドン！ {音|おと}が きこえるかい？','{耳|みみ}を すませてごらん。']),
  dict(x=16,y=9,k='boy',n='かけっこの こ',l=['{足|あし}が はやいんだ！','「よーい、どん！」で {立|た}って はしるよ。']),
  dict(x=5,y=12,k='sumo',n='おすもうさん',l=['{力|ちから}くらべ しよう！','{手|て}と {手|て}で ぐぐっと！']),
  dict(x=20,y=6,k='woman',n='ふえの おねえさん',l=['{目|め}を つむって、{口|くち}で ふえを ふくの。','{見|み}て！ はなびが {出|で}てきた！'],a=['ネムネムカバも おきて、いっしょに おどってるわ！']),
  dict(x=2,y=8,k='dog'),dict(x=16,y=2,k='cat'),
 ])

M(name='{空|そら}の {山|やま}みち',theme='snow',
 kanji='空天上下中大小入百千',
 tiles=[
"MMMMMMMMMMMMMMMMMMMMMMMM",
"MM****MMMM**Y**MMM****MM",
"M***;**MM*******MM*****M",
"M**PP****==**PP****PP**M",
"M*****===*=*********P**M",
"<=====*****=***III*****M",
"M*PP*******=**IIIII**PPM",
"M**********=***III***MMM",
"MM**Hh*****=*********MMM",
"M***hh**PP*=*****,***MMM",
"M**********==========X=>",
"M*PP***MMM***********MMM",
"M******MMM****PP*****MMM",
"MM**,**********P****MMMM",
"MMM*****MM*********MMMMM",
"MMMMMMMMMMMMMMMMMMMMMMMM"],
 eggs=[(3,5),(2,1),(20,1),(16,8),(1,12),(13,14),(19,13),(9,2),(13,6),(6,4)],
 mobs=[((5,7),6),((19,6),9),((12,12),5),((14,2),6),((5,11),3)],
 boss=dict(x=20,y=10,t=6,name='フブキング',hp=16,atk='ビュービュー ふぶき！'),
 signs=['この {上|うえ}は {天|てん}に いちばん ちかい {山|やま}'],
 npcs=[
  dict(x=12,y=2,k='oji',n='やまびと',l=['{山|やま}の {上|うえ}は {空|そら}に ちかい。{天|てん}きが かわりやすいよ。','{下|した}を みると、{町|まち}が {小|ちい}さく みえる！']),
  dict(x=6,y=9,k='elder',n='ほしみの おじいさん',l=['よるには ほしが {百|ひゃく}、{千|せん}… かぞえきれない。']),
  dict(x=18,y=4,k='girl',n='ゆきあそびの こ',l=['{大|おお}きな ゆきだるま つくったよ。','{中|なか}に {入|はい}れる かまくらも あるの！'],a=['ふぶきが やんで、そりあそびが できる！']),
  dict(x=20,y=2,k='goat'),dict(x=4,y=13,k='goat'),dict(x=17,y=12,k='rabbit'),
 ])

M(name='{王|おう}さまの くに',theme='kingdom',
 kanji='王玉赤青白左右糸早夕花',
 tiles=[
"TTTTTTTTTTTTTTTTTTTTTTTT",
"T,,..,,...Qhhh...,,.,,.T",
"T,,.......hhhh.........T",
"T..L......hhhh......L..T",
"T.....,,,...=..,,,.....T",
"TWWWWWWWWWWWBWWWWWWWWWWT",
"<===........=..........T",
"T..=..,,,...=...,,,....T",
"T..=..,,,...=...,,,..TTT",
"T..=====Hh..=.......,TTT",
"T.......hh..=========X=>",
"T.;;.................TTT",
"T.;;...RR.....WWW....TTT",
"T.............WWW..,.TTT",
"T..,,,.....,.........,.T",
"TTTTTTTTTTTTTTTTTTTTTTTT"],
 eggs=[(4,6),(2,1),(21,2),(17,7),(7,7),(1,13),(10,12),(19,13),(16,9),(20,4),(9,14)],
 mobs=[((6,3),11),((18,3),9),((8,11),4),((12,13),11),((19,11),6)],
 boss=dict(x=20,y=10,t=11,name='イロヌスミ',hp=16,atk='いろ すいとり！'),
 signs=[],
 npcs=[
  dict(x=14,y=3,k='king',n='{王|おう}さま',l=['よくぞ きた！ わしは この くにの {王|おう}さま じゃ。','まおうの てしたに、{赤|あか}・{青|あお}・{白|しろ}の いろを ぬすまれて しもうた…'],a=['いろが もどった！ まおうの しろは {右|みぎ}の ほうじゃ。','{王|おう}さまからの おねがいじゃ。ことばを とりもどしておくれ！']),
  dict(x=15,y=3,k='princess',n='おひめさま',l=['{玉|たま}の ネックレス、{糸|いと}が きれちゃったの。']),
  dict(x=9,y=3,k='soldier',n='へいたい',l=['{左|ひだり}、{右|みぎ}、{左|ひだり}、{右|みぎ}！ まいにち {早|はや}おき！','{夕|ゆう}がたに なると、おしろが あかく そまるんだ。']),
  dict(x=5,y=12,k='horse'),dict(x=15,y=12,k='swan'),dict(x=2,y=7,k='sheep'),
 ])

M(name='まおうの しろ',theme='castle',
 kanji='',
 tiles=[
"CCCCCCCCCCCCCCCCCCCCCCCC",
"CCCCCCCCkkkkkkkkCCCCCCCC",
"CCCCCCCkkkkkkkkkkCCCCCCC",
"CCCCCCCkkLkkkkLkkCCCCCCC",
"CCCCCCCkkkkkkkkkkCCCCCCC",
"CCCCCCCCCCCkkCCCCCCCCCCC",
"C.....,....kk..........C",
"C..RR......kk.....RR...C",
"C..........kk..........C",
"C....kkkkkkkkkkkkkk....C",
"<kkkkkk....kk......,...C",
"C.....;;...kk...;;.....C",
"C..,..;;.......,;;.....C",
"C.........RR...........C",
"C...........,......,...C",
"CCCCCCCCCCCCCCCCCCCCCCCC"],
 eggs=[],mobs=[],
 boss=dict(x=12,y=2,t=12,name='まおう ヒラガナー',hp=30,atk='ひらがな ビーム！',final=True),
 signs=[],
 npcs=[
  dict(x=5,y=8,k='ghost',n='まいごの おばけ',l=['まおうさまは この {上|うえ}の へやに いるよ。','ほんとうは ちょっと さみしがりや なんだって…']),
 ])

# ---------- 検証 ----------
OBJ={'H':(2,2),'N':(2,2),'K':(5,3),'J':(3,2),'Q':(4,3)}
BLOCK=set('TPWRFMCXhYOLaI')|set(OBJ)
ALL=set('一二三四五六七八九十百千日月火水木金土山川林森石田天空雨気夕花草竹虫犬貝人男女子王名先生目耳口手足上下中左右大小学校字文本年円正町村出入立休見音早力糸車玉赤青白')
assert len(ALL)==80
seen=[]
err=[]
for mi,m in enumerate(MAPS):
    t=m['tiles']; H=len(t); W=len(t[0])
    for y,r in enumerate(t):
        if len(r)!=24: err.append(f'map{mi} row{y} len {len(r)}')
    assert H==16
    for g in m['kanji']: seen.append(g)
    if m['kanji']: assert len(m['kanji'])==len(m['eggs']), mi
    occ={(n['x'],n['y']) for n in m['npcs']}
    def walk(x,y,gate_open):
        if not(0<=x<W and 0<=y<H): return False
        c=t[y][x]
        if c=='X': return gate_open
        if c in BLOCK: return False
        if (x,y) in occ: return False
        return True
    for n in m['npcs']:
        if t[n['y']][n['x']] in BLOCK and n['k'] not in ('swan',): err.append(f'map{mi} npc on block {n}')
    # 入口
    if mi==0: s=tuple(m['start'])
    else:
        s=None
        for y,r in enumerate(t):
            if '<' in r: s=(r.index('<')+1,y)
    def reach(gate):
        R={s};q=deque([s])
        while q:
            x,y=q.popleft()
            for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
                p=(x+dx,y+dy)
                if p not in R and walk(*p,gate): R.add(p);q.append(p)
        return R
    R0=reach(False);R1=reach(True)
    for i,(x,y) in enumerate(m['eggs']):
        if (x,y) not in R0: err.append(f'map{mi} egg{i} {(x,y)} unreachable {t[y][x]}')
    for (x,y),tp in m['mobs']:
        if (x,y) not in R0: err.append(f'map{mi} mob {(x,y)} unreachable')
    b=m['boss']
    if b and not b.get('final') and (b['x'],b['y']) not in R0: err.append(f'map{mi} boss unreachable')
    if b.get('final'):
        if not any((b['x']+dx,b['y']+dy) in R0 for dx,dy in((0,1),(1,0),(-1,0))): err.append('final unreachable')
    for n in m['npcs']:
        if not any((n['x']+dx,n['y']+dy) in R0 for dx,dy in((1,0),(-1,0),(0,1),(0,-1))): err.append(f'map{mi} npc {n.get("n",n["k"])} unreachable')
    ex=[(r.index('>'),y) for y,r in enumerate(t) if '>' in r]
    for e in ex:
        if e in R0 or any(p in R0 for p in [(e[0]-1,e[1])]): err.append(f'map{mi} exit reachable w/o gate')
        if (e[0]-1,e[1]) not in R1: err.append(f'map{mi} exit unreachable with gate')
    if m.get('signs') is not None:
        ny=sum(r.count('Y') for r in t)
        if ny!=len(m['signs']): err.append(f'map{mi} signs {ny} vs {len(m["signs"])}')
    # 卵と敵・NPCの重なり
    pts=[tuple(e) for e in m['eggs']]+[p for p,_ in m['mobs']]+[(b['x'],b['y'])]
    if len(set(pts))!=len(pts): err.append(f'map{mi} overlap')
    for p in pts:
        if p in occ: err.append(f'map{mi} point on npc {p}')
if set(seen)!=ALL or len(seen)!=80: err.append(f'kanji set mismatch {ALL-set(seen)} {len(seen)}')
# ことばの トークンが 正しいか
for mi,m in enumerate(MAPS):
    texts=[m['name']]+m['signs']+[l for n in m['npcs'] for l in n.get('l',[])+n.get('a',[])]
    for tx in texts:
        for k,y in re.findall(r'\{([^|}]+)\|([^}]+)\}',tx):
            for ch in k:
                if ch not in ALL: err.append(f'not 1st grade {ch} in {tx}')
        if re.sub(r'\{[^}]*\}','',tx).count('{') or re.sub(r'\{[^}]*\}','',tx).count('}'): err.append('brace '+tx)
print('\n'.join(err) or 'OK')
for m in MAPS:
    m['eggs']=[list(e) for e in m['eggs']]
    m['mobs']=[dict(x=p[0],y=p[1],t=tp) for p,tp in m['mobs']]
open(D+'app/world.js','w',encoding='utf-8').write('// かんじぼうけん せかい データ（tools/world.py で せいせい）\nwindow.WORLD='+json.dumps(dict(maps=MAPS,mobs=MOBS),ensure_ascii=False)+';\n')
