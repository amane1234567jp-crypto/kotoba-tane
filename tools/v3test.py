import asyncio, json, sys
from playwright.async_api import async_playwright
D='/tmp/claude-0/-home-claude/a581a6c5-b8bb-55ce-8f69-11dc409c4111/scratchpad/'
kj=open(D+'app/kanji1.js',encoding='utf-8').read(); K={k['g']:k for k in json.loads(kj[kj.index('['):kj.rindex(']')+1])}
async def write(pg,g,sc):
    box=await pg.locator(sc+' .stage svg').first.bounding_box()
    for s in K[g]['s']:
        pts=[(box['x']+x/160*box['width'], box['y']+y/160*box['height']) for x,y in s]
        await pg.mouse.move(*pts[0]); await pg.mouse.down()
        for i in range(1,len(pts)):
            for t in range(1,7):
                await pg.mouse.move(pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t/6, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t/6)
        await pg.mouse.up(); await pg.wait_for_timeout(60)
async def tile(pg,x,y):
    p=await pg.evaluate(f"(()=>{{const m=document.getElementById('world').getScreenCTM();const X={x}*10+5,Y={y}*10+5;return [m.a*X+m.c*Y+m.e,m.b*X+m.d*Y+m.f]}})()")
    await pg.mouse.click(*p)
async def talkall(pg,n=12):
    for i in range(n):
        if not await pg.locator('#talk').is_visible(): return
        await pg.locator('#talk').click(); await pg.wait_for_timeout(250)
async def shot(pg,n): await pg.screenshot(path=D+f'shots/v3_{n}.png')
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']); pg=await b.new_page(viewport={'width':1180,'height':820})
        miss=[]; await pg.expose_function('__vm',lambda k:miss.append(k))
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: m.type=='error' and errs.append(m.text))
        await pg.goto('http://localhost:8765/test.html'); await pg.wait_for_timeout(800)
        await pg.evaluate("window.__voiceMissing=function(k){window.__vm(k)}")
        await shot(pg,'01title')
        await pg.click('text=はじめる'); await pg.wait_for_timeout(400); await shot(pg,'02story1')
        await pg.click('text=つぎへ'); await pg.wait_for_timeout(300); await shot(pg,'03story2')
        await pg.click('text=つぎへ'); await pg.wait_for_timeout(200); await shot(pg,'03story3'); await pg.click('text=つぎへ'); await pg.wait_for_timeout(200); await shot(pg,'03story4')
        await pg.click('text=ぼうけんへ'); await pg.wait_for_timeout(900); await shot(pg,'04field_guide')
        await talkall(pg); await pg.wait_for_timeout(300); await shot(pg,'05field_ring')
        await tile(pg,13,8); await pg.wait_for_timeout(2500); print('egg view',await pg.locator('#egg').is_visible()); await shot(pg,'06egg')
        for n in range(10):
            await write(pg,'山','#egg'); await pg.wait_for_timeout(800)
        await pg.wait_for_timeout(1200); await shot(pg,'07hatch')
        await pg.click('text=ぼうけんに もどる'); await pg.wait_for_timeout(900); await shot(pg,'08guide3')
        await talkall(pg); await tile(pg,6,4); await pg.wait_for_timeout(2200); await tile(pg,4,3); await pg.wait_for_timeout(1500); await shot(pg,'09oba')
        await talkall(pg,4); await pg.wait_for_timeout(200); await shot(pg,'10guide_mob'); await talkall(pg)
        st=json.loads(await pg.evaluate("JSON.stringify(window.__kb.S())")); print('tut',st['tut'])
        mobs=await pg.evaluate("window.__kb.mobs().map(m=>[m.x,m.y,m.t])"); print('mobs',mobs)
        await shot(pg,'11field_mobs')
        for tries in range(12):
            if await pg.locator('#battle').is_visible(): break
            hx=await pg.evaluate("[window.__kb.hero().x,window.__kb.hero().y]")
            mb=await pg.evaluate("window.__kb.mobs().map(m=>[m.x,m.y])")
            mb.sort(key=lambda q:abs(q[0]-hx[0])+abs(q[1]-hx[1]))
            await tile(pg,*mb[0]); await pg.wait_for_timeout(1800)
        print('battle',await pg.locator('#battle').is_visible()); await shot(pg,'12mobpick')
        await pg.locator('#battle .pick').first.click(); await pg.wait_for_timeout(400)
        for n in range(4):
            if not await pg.locator('#battle .stage').count(): break
            await write(pg,'山','#battle'); await pg.wait_for_timeout(900)
        await pg.wait_for_timeout(4200); await shot(pg,'13mobwin')
        await pg.click('#battle >> text=ぼうけんに もどる'); await pg.wait_for_timeout(900); await shot(pg,'14guide4'); await talkall(pg)
        # くに1を ほぼ クリアした ことに する
        R0=list('山木田日花一二三土草')
        await pg.evaluate("window.__kb.set({born:"+json.dumps({g:'2026/10/15' for g in R0})+",mb:{0:[0,1,2,3,4]},lv:{'山':3,'木':2,'田':2}})")
        await pg.evaluate("window.__kb.go(0,18,10)"); await pg.wait_for_timeout(900); await shot(pg,'15boss_guide'); await talkall(pg)
        await tile(pg,20,10); await pg.wait_for_timeout(1500); await shot(pg,'16team')
        await pg.click('text=おすすめ'); await pg.wait_for_timeout(200); await shot(pg,'17team2'); await pg.click('text=しゅつげき'); await pg.wait_for_timeout(500)
        for n in range(20):
            if not await pg.locator('#battle .stage').count(): break
            g=await pg.evaluate("document.querySelector('#battle .fighter b')?null:null")
            cur=await pg.evaluate("(()=>{const t=document.querySelector('#battle .count');return t?t.textContent:''})()")
            # いまの キャラの 字を さがす
            name=cur.split(' ')[0]
            gg=await pg.evaluate("(n=>{for(const g of window.__kb.ord){if(window.CHARS[g]&&window.CHARS[g].name===n)return g}return null})",name)
            await write(pg,gg,'#battle'); await pg.wait_for_timeout(2600)
            if n==1: await shot(pg,'18bossfight')
        await pg.wait_for_timeout(4000); await shot(pg,'19bossend')
        st=json.loads(await pg.evaluate("JSON.stringify(window.__kb.S())")); print('cleared',st['cleared'],'bossHp',st['bossHp'],'lv',st['lv'])
        # ぜんぶの くにを みる
        for mi in range(1,9):
            await pg.evaluate(f"window.__kb.set({{cleared:Object.fromEntries([...Array({mi})].map((_,i)=>[i,true]))}})")
            await pg.evaluate(f"(()=>{{const m=window.WORLD.maps[{mi}];const r=m.tiles.findIndex(t=>t.includes('<'));window.__kb.go({mi},1,r)}})()"); await pg.wait_for_timeout(700)
            await talkall(pg); await pg.wait_for_timeout(300); await shot(pg,f'20map{mi}')
        # ラスボス
        allb={g:'2026/10/15' for g in await pg.evaluate("window.__kb.ord")}
        await pg.evaluate("window.__kb.set({born:"+json.dumps(allb)+",cleared:{0:1,1:1,2:1,3:1,4:1,5:1,6:1,7:1}})")
        await pg.evaluate("window.__kb.go(8,12,4)"); await pg.wait_for_timeout(800); await talkall(pg); await shot(pg,'21castle')
        await tile(pg,12,2); await pg.wait_for_timeout(900); await shot(pg,'22maou_talk'); await talkall(pg); await pg.wait_for_timeout(500); await shot(pg,'23maou_team')
        await pg.click('text=おすすめ'); await pg.click('text=しゅつげき'); await pg.wait_for_timeout(500); await shot(pg,'24maou_fight')
        await pg.evaluate("window.__kb.set({bossHp:{8:1}})")
        await pg.click('text=にげる'); await pg.wait_for_timeout(500); await tile(pg,12,2); await pg.wait_for_timeout(900); await talkall(pg); await pg.wait_for_timeout(300)
        await pg.click('text=おすすめ'); await pg.click('text=しゅつげき'); await pg.wait_for_timeout(500)
        cur=await pg.evaluate("document.querySelector('#battle .count').textContent"); name=cur.split(' ')[0]
        gg=await pg.evaluate("(n=>{for(const g of window.__kb.ord){if(window.CHARS[g]&&window.CHARS[g].name===n)return g}return null})",name)
        await write(pg,gg,'#battle'); await pg.wait_for_timeout(2500); await shot(pg,'25ending1')
        for i in range(5):
            await pg.click('#ending >> text=つぎへ'); await pg.wait_for_timeout(400)
        await pg.wait_for_timeout(4000); await shot(pg,'26parade')
        await pg.click('#ending >> text=かんじ牧場を みる'); await pg.wait_for_timeout(600); await shot(pg,'27ranch')
        pg2=await b.new_page(viewport={'width':820,'height':1180}); await pg2.goto('http://localhost:8765/test.html'); await pg2.wait_for_timeout(500); await pg2.click('#title .btn'); await pg2.wait_for_timeout(900); await pg2.screenshot(path=D+'shots/v3_28portrait.png')
        print('ERRORS',errs);print('MISSING',sorted(set(miss))); await b.close()
asyncio.run(main())
