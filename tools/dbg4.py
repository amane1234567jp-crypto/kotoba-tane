import asyncio, json
from playwright.async_api import async_playwright
D='/tmp/claude-0/-home-claude/a581a6c5-b8bb-55ce-8f69-11dc409c4111/scratchpad/shots/'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1180,'height':820})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8765/test.html'); await pg.wait_for_timeout(500); await pg.screenshot(path=D+'v3_30title.png')
        await pg.click('text=はじめる'); await pg.wait_for_timeout(300); await pg.click('text=つぎへ'); await pg.wait_for_timeout(300); await pg.screenshot(path=D+'v3_31story2.png')
        o=await pg.evaluate("window.__kb.ord"); half={g:'x' for g in o[:23]}
        await pg.evaluate("window.__kb.set({tut:5,born:"+json.dumps(half)+",cleared:{0:1,1:1},lv:{'山':5,'水':3}})")
        await pg.evaluate("window.__kb.go(2,4,6)"); await pg.wait_for_timeout(600); await pg.screenshot(path=D+'v3_32map2guide.png')
        await pg.locator('#talk').click(); await pg.locator('#talk').click(); await pg.wait_for_timeout(300)
        await pg.evaluate("window.__kb.go(1,7,8)"); await pg.wait_for_timeout(600)
        await pg.keyboard.press('ArrowUp'); await pg.wait_for_timeout(700); await pg.screenshot(path=D+'v3_33fisher.png')
        await pg.click('#navRanch'); await pg.wait_for_timeout(700); await pg.screenshot(path=D+'v3_34ranch.png',full_page=False)
        await pg.evaluate("document.getElementById('ranch').scrollTop=600"); await pg.wait_for_timeout(300); await pg.screenshot(path=D+'v3_35ranch2.png')
        pg2=await b.new_page(viewport={'width':820,'height':1180}); await pg2.goto('http://localhost:8765/test.html'); await pg2.wait_for_timeout(500)
        await pg2.click('#title .btn'); await pg2.wait_for_timeout(900); await pg2.screenshot(path=D+'v3_36portrait.png')
        pg3=await b.new_page(viewport={'width':390,'height':844}); await pg3.goto('http://localhost:8765/test.html'); await pg3.wait_for_timeout(500); await pg3.screenshot(path=D+'v3_37phone_title.png')
        await pg3.click('#title .btn'); await pg3.wait_for_timeout(900); await pg3.screenshot(path=D+'v3_38phone.png')
        print('ERR',errs); await b.close()
asyncio.run(main())
