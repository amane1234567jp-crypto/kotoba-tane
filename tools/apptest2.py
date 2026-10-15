import asyncio, json, re
from playwright.async_api import async_playwright
D='/tmp/claude-0/-home-claude/a581a6c5-b8bb-55ce-8f69-11dc409c4111/scratchpad/'
kj=open(D+'app/kanji1.js',encoding='utf-8').read(); K={k['g']:k for k in json.loads(kj[kj.index('['):kj.rindex(']')+1])}
async def write(pg,g,sc='#egg'):
    box=await pg.locator(sc+' .stage svg').first.bounding_box()
    for s in K[g]['s']:
        pts=[(box['x']+x/160*box['width'], box['y']+y/160*box['height']) for x,y in s]
        await pg.mouse.move(*pts[0]); await pg.mouse.down()
        for i in range(1,len(pts)):
            for t in range(1,9):
                await pg.mouse.move(pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t/8, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t/8)
        await pg.mouse.up(); await pg.wait_for_timeout(80)
async def tile_click(pg,x,y):
    svg=await pg.locator('#fieldSvg').bounding_box()
    sc=min(svg['width']/160,svg['height']/100); ox=svg['x']+(svg['width']-160*sc)/2; oy=svg['y']+(svg['height']-100*sc)/2
    await pg.mouse.click(ox+(x*10+5)*sc, oy+(y*10+5)*sc)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1180,'height':820})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8765/test.html'); await pg.wait_for_timeout(500)
        await pg.screenshot(path=D+'shots/v2_field.png')
        st=json.loads(await pg.evaluate("localStorage.getItem('kanjiboken.v1')"))
        ex,ey=st['eggPos']; await tile_click(pg,ex,ey); await pg.wait_for_timeout(2500); print('egg vis',await pg.locator('#egg').is_visible(), await pg.locator('.stage svg').count())
        g='山'
        for n in range(10):
            if n==0 or n==5 or n==8: await pg.screenshot(path=D+f'shots/v2_egg{n}.png')
            await write(pg,g); await pg.wait_for_timeout(900)
        await pg.wait_for_timeout(1200); await pg.screenshot(path=D+'shots/v2_hatch.png')
        await pg.click('text=ぼうけんに もどる'); await pg.wait_for_timeout(500)
        await pg.screenshot(path=D+'shots/v2_field2.png')
        for tries in range(25):
            if await pg.locator('#battle').is_visible(): break
            tr=await pg.evaluate("Array.from(document.querySelectorAll('.mob')).map(m=>m.style.transform)")
            if not tr: break
            m=re.findall(r'[\d.]+',tr[0]); await tile_click(pg,int(float(m[0])/10),int(float(m[1])/10)); await pg.wait_for_timeout(2500)
        print('battle visible', await pg.locator('#battle').is_visible())
        if await pg.locator('#battle').is_visible():
            await pg.screenshot(path=D+'shots/v2_battle0.png')
            await pg.locator('.pick').first.click(); await pg.wait_for_timeout(400)
            for n in range(3):
                await write(pg,'山','#battle'); await pg.wait_for_timeout(1000)
                if n==0: await pg.screenshot(path=D+'shots/v2_battle1.png')
            await pg.screenshot(path=D+'shots/v2_battle_end.png')
            await pg.locator('#battle .btn.go').click(); await pg.wait_for_timeout(300)
        await pg.click('#navRanch'); await pg.wait_for_timeout(800); await pg.screenshot(path=D+'shots/v2_ranch.png')
        pg2=await b.new_page(viewport={'width':400,'height':800}); await pg2.goto('http://localhost:8765/test.html'); await pg2.wait_for_timeout(500); await pg2.screenshot(path=D+'shots/v2_phone.png')
        print('ERRORS',errs); await b.close()
asyncio.run(main())
