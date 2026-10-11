const fs = require('node:fs');
const { activities, sequences } = require('./uml-events-data.cjs');
const { svg, skins } = require('./generate-uml-events.cjs');
const { flows, figure, esc } = require('./generate-current-events.cjs');
const groups = [
  { id: 'activity', label: 'Activity', items: activities.map(d => ({id:d.id, title:d.title, image:svg(d, skins.light, 'viewer-'+d.id.toLowerCase())})) },
  { id: 'sequence', label: 'Sequence', items: sequences.map(d => ({id:d.id, title:d.title, image:svg(d, skins.light, 'viewer-'+d.id.toLowerCase())})) },
  { id: 'flowchart', label: 'Flowchart', items: flows.map(d => ({id:d.id, title:d.name, image:figure(d)})) },
];
const tabs = groups.map((g,i)=>`<button type="button" role="tab" id="tab-${g.id}" aria-controls="diagram-panel" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-group="${g.id}">${g.label}<span>${g.items.length}</span></button>`).join('');
const data = groups.map(g=>`<section data-diagram-group="${g.id}" hidden>${g.items.map(d=>`<template id="${d.id.toLowerCase()}" data-title="${esc(d.title)}">${d.image}</template>`).join('')}</section>`).join('');
fs.writeFileSync('public/events.html',`<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f4f1ea"><title>uitplans. — System diagrams</title><link rel="icon" href="/beaverplans-favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="events.css"><script src="events.js" defer></script></head>
<body><header><a class="wordmark" href="/#/explore" aria-label="uitplans — về Explore">uitplans<span>.</span></a><a class="back" href="/#/explore">Back to Explore <span aria-hidden="true">↗</span></a></header>
<main><h1>System diagrams<span>.</span></h1><div class="viewer"><div class="tabs" role="tablist" aria-label="Loại sơ đồ">${tabs}</div><div class="workspace"><aside aria-label="Chọn sơ đồ"><label for="diagram-select">Sơ đồ</label><select id="diagram-select"></select><nav id="diagram-list" aria-label="Danh sách sơ đồ"></nav></aside><section id="diagram-panel" role="tabpanel" aria-labelledby="tab-activity" tabindex="0"><div class="figure-toolbar"><h2 id="diagram-title"></h2><button id="zoom" type="button" aria-pressed="false">Phóng to</button><button id="print" type="button">In sơ đồ</button></div><div class="canvas" id="canvas"></div><p class="position" id="position" aria-live="polite"></p></section></div></div><noscript>Bật JavaScript để chọn sơ đồ. <a href="diagrams/uml-20261011/ad01.html">Xem Activity</a></noscript></main>${data}</body></html>`);
// Legacy links keep their meaning, without publishing the old explanatory wrappers.
const dir='public/diagrams/uml-20261011';
for(const g of groups.slice(0,2)) for(const d of g.items) for(const suffix of ['', '-dark', '-full']) {
 const target=`/events.html#${g.id}/${d.id.toLowerCase()}`;
 fs.writeFileSync(`${dir}/${d.id.toLowerCase()}${suffix}.html`,`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=${target}"><title>${esc(d.title)} — uitplans.</title></head><body><a href="${target}">${esc(d.title)}</a><noscript>${d.image}</noscript></body></html>`);
}
fs.writeFileSync(`${dir}/index.html`,'<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/events.html#activity"><title>uitplans. — System diagrams</title></head><body><a href="/events.html#activity">Activity / Sequence / Flowchart</a></body></html>');
console.log('Generated unified viewer: 15 Activity, 8 Sequence, 44 Flowchart.');

fs.writeFileSync('docs/diagrams/uml-20261011/index.html', '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=../../../public/events.html#activity"><title>uitplans. — System diagrams</title></head><body><a href="../../../public/events.html#activity">Activity / Sequence / Flowchart</a></body></html>');
fs.writeFileSync('docs/diagrams/uml-20261011/README.md', `# System diagrams

[Live viewer](https://uitplans.netlify.app/events.html) · [Local viewer](../../../public/events.html)

15 Activity, 8 Sequence and 44 Flowchart diagrams. Select a type and diagram in the unified viewer; zoom or print the current figure. Existing EF/AD/SQ links are preserved.

## Sources

- Business Activity and component Sequence definitions: \`scripts/uml-events-data.cjs\`
- Earlier event Flowcharts: \`scripts/event-flows-current.cjs\`, \`event-flows-v2.cjs\`, \`event-flows-account.cjs\`
- SVG rendering: \`scripts/generate-uml-events.cjs\` and \`generate-current-events.cjs\`
- Viewer: \`scripts/generate-diagram-viewer.cjs\`, \`public/events.css\`, \`public/events.js\`
- Brand palette: [STYLE_GUIDE.md](STYLE_GUIDE.md)
- EF-to-UML coverage: [coverage.json](coverage.json)

Regenerate with \`node scripts/prepare-docs.mjs\` or \`npm run build\`. Definitions describe the implemented Guest/Google/Supabase behavior, including explicit import, revision conflicts and polling. They do not certify that every hosted error branch has been tested; see [testing](../../testing.md).

Standalone diagram files retain their SVG and technical notes for offline reference. The public routes redirect into the compact viewer. SVG text uses offline Segoe UI with Arial fallback.
`);
