const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {activities,sequences}=require('./uml-events-data.cjs');
const all=[...activities,...sequences];
const root='docs/diagrams/uml-20261011';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
fs.mkdirSync(root,{recursive:true});
// The project guide owns colors. Only validated hex values are read as data.
const guide=fs.readFileSync(root+'/STYLE_GUIDE.md','utf8');
const skins={light:{},dark:{}};
for(const [key,role] of Object.entries({paper:'paper',surface:'paper-2',ink:'ink',muted:'muted',rule:'rule',boundary:'rule-solid',accent:'accent',tint:'accent-tint',link:'link'})){
 const row=guide.split('\n').find(line=>line.startsWith('| `'+role+'` |'));
 assert(row,'Missing style role '+role);
 const cells=row.split('|').map(c=>c.trim());
 for(const [skin,index] of [['light',3],['dark',4]]){
  const value=cells[index]?.match(/^`(#[a-f0-9]{6})`$/i)?.[1];
  assert(value,'Invalid style color '+role+' '+skin); skins[skin][key]=value;
 }
}
function text(x,y,value,p,size=16,anchor='middle',weight=400) {
 return `<text x="${x}" y="${y}" fill="${p.ink}" font-family="Segoe UI,Arial,sans-serif" font-size="${size}" text-anchor="${anchor}" font-weight="${weight}">${esc(value)}</text>`;
}
function maskLabel(x,y,value,p) {
 assert(value.length<=14,'Arrow label too long '+value);
 const w=Math.max(36,value.length*7.5+16);
 return `<rect data-label-mask="true" x="${x-w/2}" y="${y-14}" width="${w}" height="20" fill="${p.paper}"/>${text(x,y,value,{...p,ink:p.muted},12)}`;
}
function line(x1,y1,x2,y2,p,id,label,kind='call') {
 const dashed=kind==='return'||kind==='async';
 const marker=kind==='async'?'open':'arrow';
 return `<line data-connector="true" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${p.muted}" stroke-width="1.6"${dashed?' stroke-dasharray="5 4"':''} marker-end="url(#${id}-${marker})"/>${label?maskLabel((x1+x2)/2,y1-12,label,p):''}`;
}
function action(cx,cy,label,owner,p,accent=false,width=360) {
 return `<rect data-node="true" x="${cx-width/2}" y="${cy-32}" width="${width}" height="64" rx="8" fill="${accent?p.tint:p.surface}" stroke="${accent?p.accent:p.boundary}" stroke-width="${accent?2:1.2}"/>${text(cx,cy-4,label,p,16,'middle',600)}${text(cx,cy+18,owner,{...p,ink:p.muted},12)}`;
}
function start(cx,cy,p){return `<circle data-node="true" cx="${cx}" cy="${cy}" r="8" fill="${p.ink}"/>`;}
function end(cx,cy,p){return `<circle data-node="true" cx="${cx}" cy="${cy}" r="12" fill="${p.paper}" stroke="${p.ink}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="7" fill="${p.ink}"/>`;}
function diamond(cx,cy,label,p,width=224){
 return `<path data-node="true" d="M${cx} ${cy-32}L${cx+width/2} ${cy}L${cx} ${cy+32}L${cx-width/2} ${cy}Z" fill="${p.surface}" stroke="${p.ink}" stroke-width="1.2"/>${text(cx,cy+5,label,p,16,'middle',600)}`;
}
function defs(id,p){return `<defs><marker id="${id}-arrow" viewBox="0 0 10 8" refX="9" refY="4" markerWidth="7" markerHeight="6" orient="auto"><path d="M0 0L10 4L0 8Z" fill="${p.muted}"/></marker><marker id="${id}-open" viewBox="0 0 10 8" refX="9" refY="4" markerWidth="7" markerHeight="6" orient="auto"><path d="M0 0L10 4L0 8" fill="none" stroke="${p.muted}" stroke-width="1.2"/></marker></defs>`;}
function header(d,p){return text(40,48,`${d.id}  ${d.title}`,p,40,'start',600)+text(40,80,d.type==='activity'?'Activity · nghiệp vụ người dùng':'Sequence · thứ tự trao đổi giữa các thành phần',{...p,ink:p.muted},16,'start');}
function activity(d,p,id){
 let body=header(d,p);
 if(d.layout==='three-way'){
  // 9 nodes: initial, select, decision, three actions, merge, save, final.
  const sx=640;
  const edges=[line(sx,120,sx,144,p,id),line(sx,208,sx,240,p,id),line(sx,304,sx,328,p,id),line(184,360,184,392,p,id),line(1096,360,1096,392,p,id)];
  edges.push(`<path data-connector="true" d="M552 272H192Q184 272 184 280V392" fill="none" stroke="${p.muted}" stroke-width="1.6" marker-end="url(#${id}-arrow)"/>`);
  edges.push(`<path data-connector="true" d="M728 272H1088Q1096 272 1096 280V392" fill="none" stroke="${p.muted}" stroke-width="1.6" marker-end="url(#${id}-arrow)"/>`);
  // Drop unused short guide segments; only the actual action control flows remain.
  edges.splice(3,2);
  edges[2]=line(sx,304,sx,392,p,id);
  edges.push(`<path data-connector="true" d="M184 456V520Q184 528 192 528H624" fill="none" stroke="${p.muted}" stroke-width="1.6" marker-end="url(#${id}-arrow)"/>`);
  edges.push(line(640,456,640,512,p,id));
  edges.push(`<path data-connector="true" d="M1096 456V520Q1096 528 1088 528H656" fill="none" stroke="${p.muted}" stroke-width="1.6" marker-end="url(#${id}-arrow)"/>`);
  edges.push(line(640,544,640,568,p,id));
  edges.push(line(640,632,640,648,p,id));
  body+=edges.join('');
  body+=maskLabel(340,260,'DỜI TUẦN',p)+maskLabel(684,348,'BACKLOG',p)+maskLabel(940,260,'BỎ QUA',p);
  body+=start(640,112,p)+action(640,176,'Nhận phương án đã chọn','Domain sau xác nhận AD09',p);
  body+=diamond(640,272,'Cách xử lý?',p,176);
  body+=action(184,424,'Dời sang tuần tiếp','Domain',p,false,304)+action(640,424,'Đưa về chưa xếp lịch','Domain',p,false,304)+action(1096,424,'Đánh dấu bỏ qua','Domain',p,false,304);
  body+=diamond(640,528,'',p,32)+action(640,600,'Ghi plan và snapshot tuần','Controller → Persistence',p,true)+end(640,660,p);
 }else{
  body+=line(480,120,480,136,p,id)+line(480,200,480,240,p,id)+line(480,304,480,344,p,id)+line(480,408,480,456,p,id)+line(480,520,480,560,p,id)+line(480,624,480,644,p,id);
  body+=line(592,376,840,376,p,id)+line(1000,408,1000,476,p,id);
  body+=maskLabel(452,436,'CÓ',p)+maskLabel(704,360,'KHÔNG',p);
  body+=start(480,112,p);
  body+=action(480,168,...d.prefix[0],p)+action(480,272,...d.prefix[1],p);
  body+=diamond(480,376,d.condition,p);
  body+=action(480,488,...d.success[0],p)+action(480,592,...d.success[1],p,true)+end(480,656,p);
  body+=action(1000,376,...d.other,p,false,320)+end(1000,488,p);
  body+=text(1000,528,'Kết thúc lần thao tác',{...p,ink:p.muted},12);
 }
 body+=`<line x1="40" y1="676" x2="1240" y2="676" stroke="${p.rule}"/>`;
 body+=text(40,704,'● Bắt đầu    ◎ Kết thúc lần thao tác    ◇ Điều kiện hoặc hợp nhánh    ▭ Hoạt động',{...p,ink:p.muted},12,'start');
 return body;
}
function sequence(d,p,id){
 assert(d.actors.length<=5); assert(d.messages.length<=12);
 const n=d.actors.length;
 const xs=n===5?[128,384,640,896,1152]:[160,480,800,1120];
 const ys=[];
 let cursor=216;
 for(let i=0;i<d.messages.length;i++){
  if(d.fragment?.start===i)cursor+=52;
  if(d.fragment?.split===i)cursor+=44;
  ys.push(cursor);cursor+=28;
 }
 assert(cursor<=660,'Sequence too tall '+d.id);
 let body=header(d,p);
 let frameLabels='';
 // Frames precede lifelines and messages so they cannot mask arrowheads or text.
 if(d.fragment){
  const f=d.fragment,top=ys[f.start]-52,bottom=ys.at(-1)+20;
  const participants=d.messages.slice(f.start).flatMap(m=>[m[0],m[1]]);
  const left=Math.min(...participants.map(i=>xs[i]))-24;
  const right=Math.max(...participants.map(i=>xs[i]))+24;
  const width=right-left;
  const guard=(value,y)=>`<rect x="${left+72}" y="${y-14}" width="${Math.min(width-88,value.length*6.5+8)}" height="20" fill="${p.paper}"/>${text(left+76,y,value,{...p,ink:p.muted},12,'start')}`;
  body+=`<rect x="${left}" y="${top}" width="${width}" height="${bottom-top}" rx="4" fill="${p.surface}" fill-opacity="0.35" stroke="${p.boundary}"/>`;
  frameLabels+=`<rect x="${left}" y="${top}" width="64" height="20" fill="${p.paper}" stroke="${p.boundary}"/>`;
  frameLabels+=text(left+32,top+15,f.op.toUpperCase(),{...p,ink:p.muted},12);
  frameLabels+=guard('['+f.guards[0]+']',top+22);
  if(f.split!==undefined){
   const div=ys[f.split]-44;
   body+=`<line x1="${left+8}" y1="${div}" x2="${right-8}" y2="${div}" stroke="${p.boundary}" stroke-dasharray="4 3"/>`;
   frameLabels+=guard('['+f.guards[1]+']',div+14);
  }
 }
 for(const x of xs.slice(0,n))body+=`<line x1="${x}" y1="176" x2="${x}" y2="656" stroke="${p.boundary}" stroke-dasharray="4 4"/>`;
 // Finite activations close at the bottom of the trace, rather than continuing forever.
 for(let actor=1;actor<n;actor++){
  const hits=d.messages.map((m,i)=>m[0]===actor||m[1]===actor?i:-1).filter(i=>i>=0);
  if(hits.length)body+=`<rect x="${xs[actor]-4}" y="${ys[hits[0]]-8}" width="8" height="${ys[hits.at(-1)]-ys[hits[0]]+16}" fill="${p.rule}" fill-opacity="0.35" stroke="${p.muted}" stroke-width="0.8"/>`;
 }
 body+=frameLabels;
 for(let i=0;i<d.messages.length;i++){
  const [a,b,label,kind]=d.messages[i],y=ys[i];
  assert(a<n&&b<n); assert(label.length<=14,`${d.id} ${label}`);
  if(a===b){
   // Self call is a rounded U; label is kept clear of both the stroke and the lifeline.
   const x=xs[a],direction=a===n-1?-1:1;
   body+=`<path data-connector="true" d="M${x+4*direction} ${y}H${x+52*direction}Q${x+60*direction} ${y} ${x+60*direction} ${y+8}V${y+12}Q${x+60*direction} ${y+20} ${x+52*direction} ${y+20}H${x+4*direction}" fill="none" stroke="${p.muted}" stroke-width="1.6" marker-end="url(#${id}-arrow)"/>`;
   body+=maskLabel(x+132*direction,y-12,label,p);
  }else{
   const x1=xs[a]+(xs[b]>xs[a]?4:-4),x2=xs[b]+(xs[b]>xs[a]?-4:4);
   // Shift labels into a lifeline gap for multi-hop messages.
   const lx=xs[b]>xs[a]?xs[a]+(xs[a+1]-xs[a])/2:xs[b]+(xs[b+1]-xs[b])/2;
   body+=line(x1,y,x2,y,p,id,null,kind)+maskLabel(lx,y-12,label,p);
  }
 }
 for(let i=0;i<n;i++){
  const label=d.actors[i],aw=n===5?176:200;
  body+=`<rect data-node="true" x="${xs[i]-aw/2}" y="112" width="${aw}" height="64" rx="6" fill="${p.surface}" stroke="${p.boundary}"/>`;
  const words=label.split(' '); let row1='',row2='';
  for(const word of words){if((row1+' '+word).trim().length<=19&&!row2)row1=(row1+' '+word).trim();else row2=(row2+' '+word).trim();}
  body+=text(xs[i],row2?138:148,row1,p,16,'middle',600);
  if(row2)body+=text(xs[i],160,row2,p,16,'middle',600);
 }
 body+=`<line x1="40" y1="680" x2="1240" y2="680" stroke="${p.rule}"/>`;
 body+=text(40,708,'Nét liền: gọi xử lý    Nét đứt + mũi tên đặc: trả kết quả    Mũi tên rỗng: sự kiện    Thời gian đi xuống',{...p,ink:p.muted},12,'start');
 return body;
}
function svg(d,p,id){
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${esc(d.title)}</title><desc id="${id}-desc">${esc(d.type==='activity'?'Nghiệp vụ '+d.title+' với điều kiện và nhánh thay thế.':'Thứ tự trao đổi khi '+d.title+' trong hệ thống Guest Google Supabase hiện hành.')}</desc>${defs(id,p)}<rect width="1280" height="720" fill="${p.paper}"/>${d.type==='activity'?activity(d,p,id):sequence(d,p,id)}</svg>`;
}
function html(d,variant){
 const skin=variant==='dark'?'dark':'light',p=skins[skin],id=d.id.toLowerCase()+(variant==='light'?'':'-'+variant);
 const descriptions=d.type==='sequence'?`<h2>Đọc các thông điệp</h2><ol>${d.messages.map(m=>`<li><strong>${esc(m[2])}</strong> — ${esc(m[4])}</li>`).join('')}</ol>`:'';
 return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(d.id+' '+d.title)} — uitplans.</title><style>*{box-sizing:border-box}body{margin:0;padding:24px;background:${p.paper};color:${p.ink};font:16px/1.65 'Segoe UI',Arial,sans-serif}main{max-width:1360px;margin:auto}a{color:${p.accent};text-underline-offset:4px}h1{font-size:28px;line-height:1.3;margin:20px 0}h2{font-size:20px;margin-top:28px}nav{display:flex;flex-wrap:wrap;gap:20px}.diagram-container{overflow-x:auto;width:100%;margin:20px 0}svg{display:block;width:100%;min-width:1280px}li{padding:4px 0}small{color:${p.muted}}code{font-size:14px;overflow-wrap:anywhere}footer{margin-top:32px;border-top:1px solid ${p.rule};padding-top:16px}@media print{body{padding:0}.diagram-container{overflow-x:visible}svg{min-width:0}nav{display:none}}:focus-visible{outline:2px solid ${p.accent};outline-offset:4px}</style></head><body><main><nav><a href="index.html">← Danh mục</a><a href="${d.id.toLowerCase()}.html">Sáng</a><a href="${d.id.toLowerCase()}-dark.html">Tối</a><a href="${d.id.toLowerCase()}-full.html">Kèm giải thích</a></nav><h1>${esc(d.id+' '+d.title)}</h1><small>Đối chiếu code ngày 11/10/2026 · ${esc(d.refs.join(', '))}</small><div class="diagram-container">${svg(d,p,id)}</div><h2>Điều kiện và nhánh cần nhớ</h2><ul>${d.notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul>${variant==='full'?descriptions:''}<h2>Nguồn đối chiếu</h2><ul>${d.sources.map(s=>`<li><code>${esc(s)}</code></li>`).join('')}</ul><footer>uitplans. · Diagram Design · Khung 1280 × 720 · Font offline Segoe UI, fallback Arial. Sơ đồ mô tả hành vi hiện hành; không thay bằng chứng đã kiểm thử mọi nhánh online.</footer></main></body></html>`;
}
for(const d of all){
 assert(d.title.length<=60);
 for(const source of d.sources)assert(fs.existsSync(source),'Missing source '+source);
 for(const variant of ['light','dark','full']){
  const filename=d.id.toLowerCase()+(variant==='light'?'':'-'+variant)+'.html';
  fs.writeFileSync(path.join(root,filename),html(d,variant));
 }
}
const list=items=>items.map(d=>`<li><a href="${d.id.toLowerCase()}.html"><strong>${d.id}</strong> ${esc(d.title)}</a><small>${esc(d.refs.join(', '))}</small></li>`).join('');
fs.writeFileSync(root+'/index.html',`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Activity và Sequence của uitplans.</title><style>*{box-sizing:border-box}body{margin:0;background:#f4f1ea;color:#1c1a17;font:17px/1.7 'Segoe UI',Arial,sans-serif}main{max-width:1040px;margin:auto;padding:40px 24px}h1{font-size:36px;line-height:1.3}h2{margin-top:36px}a{color:#a74127}li{padding:12px 0;border-bottom:1px solid #d2ccbe}small{display:block;font-size:13px;color:#736d64}p{max-width:860px}</style></head><body><main><h1>Activity và Sequence của uitplans.</h1><p>15 Activity cho nghiệp vụ và 8 Sequence cho tài khoản, lưu dữ liệu và đồng bộ. Mỗi hình có bản sáng, tối và bản kèm giải thích. Mở một hình rồi dùng thanh cuộn ngang trên màn hình nhỏ; khi in hình tự co vừa trang.</p><p>Activity dùng ký hiệu bắt đầu, hoạt động, điều kiện, hợp nhánh và kết thúc lần thao tác. Sequence dùng lifeline, activation và khung ALT/LOOP để phân biệt thứ tự và nhánh xử lý. Các mã EF giúp đối chiếu bộ 44 luồng cũ.</p><p>Hệ thống hiện tại: Guest dùng IndexedDB; Google qua Supabase Auth; cloud ghi bằng RPC/revision và nhận cập nhật bằng polling. Không dùng Realtime, không tự nhập Guest, không tự gộp xung đột.</p><h2>Nghiệp vụ Activity</h2><ol>${list(activities)}</ol><h2>Trao đổi Sequence</h2><ol>${list(sequences)}</ol><h2>Gợi ý chọn hình cho slides</h2><p>Dùng AD04 để giải thích tạo kế hoạch, AD08 hoặc AD09 để giải thích việc học, SQ01 cho đăng nhập và SQ04 hoặc SQ06 cho dữ liệu online. Những hình còn lại đặt trong Product Brief hoặc phụ lục.</p><p>Đối chiếu code ngày 11/10/2026. Sơ đồ không thay báo cáo QA; hai thiết bị vật lý vẫn cần biên bản kiểm thử. Màu lấy từ uitplans, font offline Segoe UI/Arial được ghi rõ để mở được trên máy khác.</p></main></body></html>`);
const coverage=new Map();
for(const d of all)for(const ef of d.refs){if(!coverage.has(ef))coverage.set(ef,[]);coverage.get(ef).push(d.id);}
for(let i=1;i<=44;i++)assert(coverage.has('EF'+String(i).padStart(2,'0')),'Unmapped EF'+i);
fs.writeFileSync(root+'/coverage.json',JSON.stringify({checkedAt:'2026-10-11',activityCount:activities.length,sequenceCount:sequences.length,skin:skins.light,flows:Object.fromEntries([...coverage].sort()),diagrams:all.map(d=>({id:d.id,title:d.title,type:d.type,refs:d.refs,sources:d.sources}))},null,2));
const md=`# Activity và Sequence của uitplans\n\nCập nhật 11/10/2026. 15 Activity + 8 Sequence. Mở [danh mục](index.html), mỗi hình có bản sáng/tối và kèm giải thích. Khung 1280 × 720; ngôn ngữ Việt với tên thành phần code khi cần. Font offline Segoe UI/Arial.\n\n## Ký hiệu và mức chi tiết\n\nActivity dùng initial/final, action, decision/merge và guard Có/Không. Kết thúc là kết thúc lần thao tác, không phải xóa dữ liệu hoặc đóng toàn app. Không có fork/join vì các nghiệp vụ đang mô tả không cần khẳng định thực thi song song. Sequence có lifeline, activation hữu hạn, call/return/event và ALT/LOOP. Thông điệp là mức thành phần; không giả lập một request HTTP cho mỗi lời gọi nội bộ.\n\nCác luồng dài được chia theo nghiệp vụ, không chuyển mỗi EF thành một hình giống nhau. Chi tiết lỗi ghi dùng AD14 và SQ03–SQ05; các hình khác chỉ đi tiếp sau commit. Không tự nhập Guest, không Realtime, không tự gộp xung đột hoặc offline queue bền vững.\n\n## Danh mục\n\n| Mã | Loại | Nội dung | Luồng liên quan |\n|---|---|---|---|\n`+all.map(d=>`| ${d.id} | ${d.type==='activity'?'Activity':'Sequence'} | [${d.title}](${d.id.toLowerCase()}.html) | ${d.refs.join(', ')} |`).join('\n')+`\n\n## Đối chiếu 44 luồng\n\n| Luồng cũ | Sơ đồ |\n|---|---|\n`+[...coverage].sort().map(([ef,ids])=>`| ${ef} | ${ids.join(', ')} |`).join('\n')+`\n\n## Căn cứ và giới hạn\n\nDữ liệu sơ đồ ở scripts/uml-events-data.cjs; tạo HTML bằng scripts/generate-uml-events.cjs. Code nguồn được ghi trong từng hình và coverage.json. Bộ 44 luồng cũ được giữ để đối chiếu, không bị xóa. Các hành vi là đặc tả từ code, không tuyên bố mọi nhánh đã thử trên cloud thật. Google thật + lưu/tải lại đã có QA; hai thiết bị vật lý, roundtrip mất mạng thật cần thêm biên bản.\n\nGợi ý slides: AD04, AD08/AD09, SQ01, SQ04 hoặc SQ06. Khung 16:9 có tiêu đề/legend trong hình, còn ghi chú dài nằm dưới hình. Không đưa Secret, token hoặc dữ liệu cá nhân vào sơ đồ.\n`;
fs.writeFileSync(root+'/README.md',md);
const publicDir='public/diagrams/uml-20261011';
fs.mkdirSync(publicDir,{recursive:true});
for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.html')))fs.copyFileSync(path.join(root,file),path.join(publicDir,file));
console.log(`Generated ${activities.length} Activity and ${sequences.length} Sequence; all 44 EFs mapped; 69 diagram HTML files + index.`);
module.exports = { svg, skins };
