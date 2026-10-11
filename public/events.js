'use strict';
const tabs = [...document.querySelectorAll('[role=tab]')];
const groups = new Map([...document.querySelectorAll('[data-diagram-group]')].map(el => [el.dataset.diagramGroup, [...el.querySelectorAll('template')]]));
const select = document.getElementById('diagram-select');
const list = document.getElementById('diagram-list');
const canvas = document.getElementById('canvas');
let activeGroup;
function route() {
 const parts = location.hash.slice(1).toLowerCase().split('/');
 let group = groups.has(parts[0]) ? parts[0] : /^(ef)/.test(parts[0]) ? 'flowchart' : /^(sq)/.test(parts[0]) ? 'sequence' : 'activity';
 const items = groups.get(group);
 const selected = items.find(el => el.id === (parts[1] || parts[0])) || items[0];
 const hash = `#${group}/${selected.id}`;
 if(location.hash !== hash) history.replaceState(null, '', hash);
 tabs.forEach(tab => { const current = tab.dataset.group === group; tab.setAttribute('aria-selected', String(current)); tab.tabIndex = current ? 0 : -1; });
 document.getElementById('diagram-panel').setAttribute('aria-labelledby', `tab-${group}`);
 if(activeGroup !== group) {
  select.replaceChildren(...items.map(el => new Option(`${el.id.toUpperCase()} · ${el.dataset.title}`, el.id)));
  list.replaceChildren(...items.map(el => {
   const link = document.createElement('a'); link.href = `#${group}/${el.id}`;
   const code = document.createElement('span'); code.textContent = el.id.toUpperCase();
   link.append(code, document.createTextNode(el.dataset.title)); return link;
  }));
 }
 activeGroup = group; select.value = selected.id;
 [...list.children].forEach(link => link.setAttribute('aria-current', String(link.hash === hash)));
 canvas.replaceChildren(selected.content.cloneNode(true)); canvas.dataset.type = group;
 document.getElementById('diagram-title').textContent = `${selected.id.toUpperCase()} · ${selected.dataset.title}`;
 document.getElementById('position').textContent = `${items.indexOf(selected)+1} / ${items.length}`;
 document.title = `uitplans. — ${selected.dataset.title}`;
}
tabs.forEach(tab => tab.addEventListener('click', () => {location.hash = `${tab.dataset.group}/${groups.get(tab.dataset.group)[0].id}`;}));
document.querySelector('[role=tablist]').addEventListener('keydown', event => {
 const index = tabs.indexOf(document.activeElement); if(index < 0) return;
 let next;
 if(event.key === 'ArrowRight') next=(index+1)%tabs.length;
 else if(event.key === 'ArrowLeft') next=(index+tabs.length-1)%tabs.length;
 else if(event.key === 'Home') next=0;
 else if(event.key === 'End') next=tabs.length-1;
 else return;
 event.preventDefault(); tabs[next].focus(); tabs[next].click();
});
select.addEventListener('change', () => {location.hash = `${activeGroup}/${select.value}`;});
document.getElementById('zoom').addEventListener('click', event => {
 const on=canvas.classList.toggle('zoomed'); event.currentTarget.setAttribute('aria-pressed', String(on)); event.currentTarget.textContent=on?'Thu vừa khung':'Phóng to';
});
document.getElementById('print').addEventListener('click', () => window.print());
window.addEventListener('hashchange', route);
route();
