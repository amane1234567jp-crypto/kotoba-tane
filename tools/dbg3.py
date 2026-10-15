import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1180,'height':820})
        await pg.goto('http://localhost:8765/test.html'); await pg.wait_for_timeout(500)
        allb={g:'x' for g in await pg.evaluate("window.__kb.ord")}
        await pg.evaluate("window.__kb.set({tut:5,born:"+json.dumps(allb)+",cleared:{0:1,1:1,2:1,3:1,4:1,5:1,6:1,7:1},seen:{r8:1}})")
        await pg.evaluate("window.__kb.go(8,12,3)"); await pg.wait_for_timeout(500)
        await pg.keyboard.press('ArrowUp'); await pg.wait_for_timeout(600)
        for i in range(3): await pg.locator('#talk').click(); await pg.wait_for_timeout(200)
        await pg.wait_for_timeout(500)
        print(await pg.evaluate("Array.from(document.querySelectorAll('#battle .btn')).map(b=>b.textContent+'|'+b.getBoundingClientRect().top)"))
        try:
            await pg.click('text=おすすめ',timeout=3000)
        except Exception as e: print(str(e)[-600:])
        await b.close()
asyncio.run(main())
