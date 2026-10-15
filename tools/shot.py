import sys, asyncio, re
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name in sys.argv[1:]:
            src=open(f'kanji-bokujo/project/{name}.dc.html').read()
            html=f'<!doctype html><html><head><meta charset="utf-8"><style>body{{margin:0;width:880px;height:560px;background:#fff}} x-dc{{display:block;width:880px;height:560px}}</style></head><body>{src}</body></html>'
            pg = await b.new_page(viewport={'width':880,'height':560})
            await pg.set_content(html)
            await pg.wait_for_timeout(300)
            await pg.screenshot(path=f'shots/{name}.png')
        await b.close()
asyncio.run(main())
