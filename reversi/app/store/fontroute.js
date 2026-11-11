const fs = require('fs'), path = require('path');
const F = path.join(__dirname, 'fonts/node_modules/@fontsource');
const css = ['zen-maru-gothic/500.css', 'zen-maru-gothic/700.css', 'zen-maru-gothic/900.css', 'mochiy-pop-one/400.css']
  .map(f => fs.readFileSync(path.join(F, f), 'utf8').replace(/url\(\.\/files\//g, `url(https://fontfiles.local/${f.split('/')[0]}/files/`)).join('\n');
module.exports = async ctx => {
  await ctx.route('https://fonts.googleapis.com/**', r => r.fulfill({ status: 200, contentType: 'text/css', body: css }));
  await ctx.route('https://fonts.gstatic.com/**', r => r.abort());
  await ctx.route('https://fontfiles.local/**', r => { const u = new URL(r.request().url()); r.fulfill({ status: 200, contentType: 'font/woff2', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(path.join(F, u.pathname)) }); });
};
