const fs = require('fs');
const root = './build'
let html = fs.readFileSync(root+'/index.html', 'utf8');
const jsPath = /<script defer="defer" src="(.+)"><\/script>/.exec(html)[1];
const cssPath = /<link href="(.+)" rel="stylesheet">/.exec(html)[1];
const js = fs.readFileSync(root+jsPath, 'utf8').split('\n')[1];
const css = fs.readFileSync(root+cssPath, 'utf8').split('\n')[0];
html = html.replace(`<script defer="defer" src="${jsPath}"></script>`, '')
           .replace(`<link href="${cssPath}" rel="stylesheet">`, ()=>`<style>${css}</style>`)
           .replace('</body>', ()=>`<script>${js}</script></body>`);
fs.writeFileSync('template.html', html);