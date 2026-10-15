import asyncio, json, parts
from playwright.async_api import async_playwright
DRAW={'person':parts.person('awake'),'person_sleep':parts.person('sleep'),'tree':parts.tree('awake'),'tree_noarm':parts.tree('awake',arms=False),'tree_smile':parts.tree('smile'),
 'sun':parts.sun('awake',rays=False),'sun_open':parts.sun('open',rays=False),'moon':parts.moon(),'mountain':parts.mountain('half'),'mountain_awake':parts.mountain('awake'),
 'evening':parts.evening(),'mouth':parts.mouth_char(),'field':parts.field(),'eye':parts.eye_char(),'tachan':parts.tachan(),'baby':parts.baby(),'fire':parts.fire(),'earth':parts.earth(),'big':parts.big_person(),'bowl':parts.prop_bowl()}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page()
        res={}
        for k,v in DRAW.items():
            await pg.set_content(f'<svg id="s" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160"><g id="g">{v}</g></svg>')
            bb=await pg.evaluate("(()=>{const b=document.getElementById('g').getBBox();return [b.x,b.y,b.width,b.height]})()")
            res[k]=[round(x,1) for x in bb]
        await b.close()
    json.dump(res,open('bbox.json','w'),indent=0); print(res)
asyncio.run(main())
