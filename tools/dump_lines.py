import asyncio, json
from playwright.async_api import async_playwright
D='/tmp/claude-0/-home-claude/a581a6c5-b8bb-55ce-8f69-11dc409c4111/scratchpad/'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page()
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8765/test.html'); await pg.wait_for_timeout(800)
        L=await pg.evaluate("window.__lines()")
        json.dump(L,open(D+'tools/lines.json','w'),ensure_ascii=False,indent=0)
        print(len(L),errs)
        await b.close()
asyncio.run(main())
