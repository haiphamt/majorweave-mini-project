import React from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter} from 'react-router-dom';
import {AppShell} from '../src/app/AppShell';
import {contentPacks} from '../src/content';
import {createRoadmapStore} from '../src/persistence/roadmap-store';
import {validateWorkspace} from '../src/domain/validate';
import {backendPack,legacyStageMap} from '../src/content/paths/backend';
import '../src/styles.css';
// Full application with an explicitly named QA database and v1 source fixture.
// Never reads/writes/deletes production storage or the legacy source key.
const url=new URL(location.href);
let session=url.searchParams.get('session');
if(!session||!/^[a-f0-9-]{36}$/i.test(session))session=crypto.randomUUID();
url.searchParams.set('session',session);history.replaceState(null,'',url);
const databaseName=`majorweave.qa.integration.${session}`;
const stage=backendPack.stages.find(s=>s.id===legacyStageMap.node.js)!;
const work=stage.work[0];
const legacyRaw=JSON.stringify({version:1,stack:'node',profileName:'QA v1',major:'software',browseFaculty:'all',level:'basic',preferFree:true,language:'all',selected:['js'],known:[],sourceByModule:{js:stage.defaultResourceId.replace('resource.','')},goal:'Draft v1',hours:5,startDate:'2026-10-05',credentials:[],planMeta:{stack:'node',goal:'Legacy QA',hours:5,startDate:'2026-10-05'},tasks:[{id:'js-0',moduleId:'js',title:work.title,minutes:work.minutes,sourceId:stage.defaultResourceId.replace('resource.',''),week:0,completed:true,notes:'Original v1',completedAt:'2026-10-07T03:00:00Z'}]});
const options={packs:contentPacks,persistence:createRoadmapStore({databaseName,timeZone:'Asia/Bangkok',validate:validateWorkspace}),readLegacy:()=>legacyRaw,now:()=>new Date().toISOString(),today:()=> '2026-10-09',nextId:()=>crypto.randomUUID()};
createRoot(document.getElementById('root')!).render(<React.StrictMode><HashRouter><AppShell options={options}/></HashRouter></React.StrictMode>);
