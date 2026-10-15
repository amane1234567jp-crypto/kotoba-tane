import asyncio, json, re, os, sys
from playwright.async_api import async_playwright
D='/tmp/claude-0/-home-claude/a581a6c5-b8bb-55ce-8f69-11dc409c4111/scratchpad/'
kj=open(D+'app/kanji1.js',encoding='utf-8').read(); K={k['g']:k for k in json.loads(kj[kj.index('['):kj.rindex(']')+1])}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1180,'height':820})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: m.type=='error' and errs.append(m.text))
        await pg.goto('http://localhost:8765/test.html'); await pg.wait_for_timeout(600)
        await pg.screenshot(path=D+'shots/app_farm0.png')
        await pg.click('.bigcta'); await pg.wait_for_timeout(300)
        await pg.screenshot(path=D+'shots/app_eggs.png')
        for egg in range(3):
            await pg.click('.eggb.next'); await pg.wait_for_timeout(400)
            step=0
            while True:
                if await pg.locator('#learn .stage').count()==0: break
                txt=await pg.locator('#learn .steps .on').inner_text() if await pg.locator('#learn .steps .on').count() else ''
                if txt=='みる':
                    if egg==0: await pg.screenshot(path=D+'shots/app_miru.png')
                    await pg.click('text=じに へんしん！'); await pg.wait_for_timeout(900); await pg.click('text=つぎへ'); await pg.wait_for_timeout(300)
                elif txt=='あそぶ':
                    await pg.click('text=かきじゅんを みる'); 
                    g=await pg.evaluate("document.querySelector('#learn .say').textContent")
                    await pg.wait_for_timeout(5500)
                    if egg==0: await pg.screenshot(path=D+'shots/app_asobu.png')
                    await pg.click('#learn button:has-text("つぎへ")'); await pg.wait_for_timeout(300)
                elif txt in ('なぞる','かく'):
                    g=await pg.evaluate("Object.keys(window).length")
                    # 字を取得：hatch前の L.g は非公開なので eggs の state から
                    st=json.loads(await pg.evaluate("localStorage.getItem('kanjibokujo.v1')"))
                    gl=[e for e in st['egg']['list'] if not e['done']][0]['g']
                    box=await pg.locator('#learn .stage svg').bounding_box()
                    for s in K[gl]['s']:
                        pts=[(box['x']+x/160*box['width'], box['y']+y/160*box['height']) for x,y in s]
                        await pg.mouse.move(*pts[0]); await pg.mouse.down()
                        # 細かく補間
                        for i in range(1,len(pts)):
                            for t in range(1,9):
                                x=pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t/8; y=pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t/8
                                await pg.mouse.move(x,y)
                        await pg.mouse.up(); await pg.wait_for_timeout(120)
                    if egg==0 and txt=='かく': pass
                    await pg.wait_for_timeout(1000)
                else:
                    break
                step+=1
                if step>8: break
            await pg.screenshot(path=D+f'shots/app_hatch{egg}.png')
            btn=pg.locator('#learn .btn.go'); await btn.click(); await pg.wait_for_timeout(400)
        await pg.screenshot(path=D+'shots/app_farm1.png')
        await pg.click('#navZukan'); await pg.wait_for_timeout(300); await pg.screenshot(path=D+'shots/app_zukan.png')
        pg2=await b.new_page(viewport={'width':400,'height':800}); await pg2.goto('http://localhost:8765/test.html'); await pg2.wait_for_timeout(500); await pg2.screenshot(path=D+'shots/app_phone.png')
        print('ERRORS',errs)
        await b.close()
asyncio.run(main())
