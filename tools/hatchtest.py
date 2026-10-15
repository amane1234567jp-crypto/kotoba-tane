import asyncio, json
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
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']); pg=await b.new_page(viewport={'width':1180,'height':820})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        miss=[]; await pg.expose_function('__vm',lambda k:miss.append(k))
        await pg.goto('http://localhost:8765/test.html'); await pg.wait_for_timeout(600)
        await pg.evaluate("window.__voiceMissing=function(k){window.__vm(k)}")
        await pg.evaluate("window.__kb.set({tut:5,seen:{t1:1,t3:1}})")
        await pg.click('#title .btn'); await pg.wait_for_timeout(500)
        await pg.evaluate("window.__kb.go(0,12,8)"); await pg.wait_for_timeout(600)
        await pg.keyboard.press('ArrowRight'); await pg.wait_for_timeout(1200)
        await pg.screenshot(path=D+'shots/h0.png')
        for n in range(10):
            await write(pg,'山','#egg'); await pg.wait_for_timeout(700)
            if n==4: await pg.screenshot(path=D+'shots/h1.png')
        for i,t in enumerate([300,700,500,250,400,900,1500]):
            await pg.wait_for_timeout(t); await pg.screenshot(path=D+f'shots/h{i+2}.png')
        st=await pg.evaluate("({ctx:!!window.__kb, bg:document.querySelector('#bgmBtn').textContent})")
        print('ERR',errs,'MISS',miss,await pg.evaluate('window.__kb.miss()')); await b.close()
asyncio.run(main())
