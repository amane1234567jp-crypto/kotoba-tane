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
import asyncio, json, sys
D='/tmp/claude-0/-home-claude/a581a6c5-b8bb-55ce-8f69-11dc409c4111/scratchpad/shots/'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1180,'height':820})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8765/test.html'); await pg.wait_for_timeout(500)
        R0=list('山木田日花一二三土草')
        await pg.evaluate("window.__kb.set({tut:5,seen:{t1:1,t3:1,b0:1},born:"+json.dumps({g:'x' for g in R0})+",mb:{0:[0,1,2,3,4]}})")
        await pg.evaluate("window.__kb.go(0,19,10)"); await pg.wait_for_timeout(600)
        await tile(pg,20,10); await pg.wait_for_timeout(900)
        await pg.locator('#battle .pick', has_text='一').first.click(); await pg.locator('#battle .pick', has_text='二').first.click()
        await pg.screenshot(path=D+'v3_40team.png')
        await pg.click('text=しゅつげき'); await pg.wait_for_timeout(500)
        seq=['一','一','二','二']
        for i,g in enumerate(seq):
            await write(pg,g,'#battle'); await pg.wait_for_timeout(4000 if i in (1,3) else 2600)
            if i==1: await pg.screenshot(path=D+'v3_41sleep.png')
        await pg.wait_for_timeout(1500); await pg.screenshot(path=D+'v3_42retreat.png')
        print(await pg.evaluate("JSON.stringify(window.__kb.S().bossHp)"))
        await pg.click('#battle >> text=ぼうけんに もどる'); await pg.wait_for_timeout(600)
        print('hero',await pg.evaluate("[window.__kb.hero().x,window.__kb.hero().y]"))
        await tile(pg,20,10); await pg.wait_for_timeout(900); await pg.screenshot(path=D+'v3_43again.png')
        print('ERR',errs); await b.close()
asyncio.run(main())
