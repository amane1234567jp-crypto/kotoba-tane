import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1180,'height':820})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8765/test.html'); await pg.wait_for_timeout(500)
        await pg.evaluate("window.__kb.set({tut:5,seen:{t1:1,t3:1},born:{'山':'x'},mb:{0:[0]}})")
        await pg.click('#title .btn'); await pg.evaluate("window.__kb.go(0,18,10)"); await pg.wait_for_timeout(700)
        print('boss before',await pg.evaluate("!!window.__kb.boss()"), await pg.evaluate("document.getElementById('prog').textContent"))
        await pg.evaluate("window.__kb.set({born:{'山':'x','木':'x'}})"); await pg.evaluate("window.__kb.go(0,18,10)"); await pg.wait_for_timeout(700)
        print('boss after',await pg.evaluate("!!window.__kb.boss()"), await pg.evaluate("document.getElementById('prog').textContent"))
        await pg.screenshot(path='/tmp/claude-0/-home-claude/a581a6c5-b8bb-55ce-8f69-11dc409c4111/scratchpad/shots/tut_boss.png')
        print(errs); await b.close()
asyncio.run(main())
