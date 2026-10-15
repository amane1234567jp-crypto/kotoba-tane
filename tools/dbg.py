import asyncio
from playwright.async_api import async_playwright
D='/tmp/claude-0/-home-claude/a581a6c5-b8bb-55ce-8f69-11dc409c4111/scratchpad/'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1180,'height':820})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m:errs.append(m.text))
        await pg.goto('http://localhost:8765/test.html'); await pg.wait_for_timeout(500)
        print(await pg.evaluate("localStorage.getItem('kanjiboken.v1')"))
        svg=await pg.locator('#fieldSvg').bounding_box(); print(svg)
        sc=min(svg['width']/160,svg['height']/100); ox=svg['x']+(svg['width']-160*sc)/2; oy=svg['y']+(svg['height']-100*sc)/2
        await pg.mouse.click(ox+65*sc, oy+55*sc); await pg.wait_for_timeout(2500)
        print(await pg.evaluate("document.getElementById('hero').style.transform"), await pg.locator('#egg').is_visible())
        print(errs); await b.close()
asyncio.run(main())
