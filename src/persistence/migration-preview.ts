import { backendPack, legacyStageMap, legacyWorkMap } from '../content/paths/backend';
import type { LearningPlan, PlanTask, RoadmapDraft, StudyCompletion, OperationResult, ValidationIssue, Instant } from '../domain/contracts';
import type { PlanMeta } from '../state';
import { inspectLegacyV1 } from './migration-source';

export type MigrationPreviewOptions = {
  now: Instant;
  timeZone: string;
  nextId: () => string;
  // Explicitly supplied only when an older save has no planMeta. UI must show
  // this choice; do not silently reuse the draft's stack/goal/dates as plan data.
  missingPlanMeta?: PlanMeta;
};
export type MigrationPreview = {
  raw: string;
  fingerprint: string;
  plan: LearningPlan | null;
  draft: RoadmapDraft;
  savedCredentialIds: string[];
  summary: { taskCount: number; doneCount: number; customizedCount: number; missingSourceCount: number; planTrackId: string | null; draftTrackId: string };
  warnings: ValidationIssue[];
  blockingIssues: ValidationIssue[];
  // Explicit inventory instead of silently dropping items absent from v2 maps.
  unresolved: { selected: string[]; known: string[]; sources: Record<string, string>; credentials: string[] };
};
const uid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const date = (v: string) => { const d = new Date(`${v}T00:00:00Z`); return /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(d.getTime()) && d.toISOString().slice(0,10) === v; };
const instant = (v: string) => /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.test(v) && date(v.slice(0,10)) && Number.isFinite(Date.parse(v));
const lookup = (map: Record<string,string>, key: string): string | undefined => Object.hasOwn(map,key) ? map[key] : undefined;
const localDate = (at: string, zone: string) => {
  const parts = new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(at));
  const part = (type:string) => parts.find(p=>p.type===type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
};

/** Advisory preview only: no storage API, no save, no migration marker. */
export async function previewLegacyV1(raw: string | null, options: MigrationPreviewOptions): Promise<OperationResult<MigrationPreview | null>> {
  const inspected = await inspectLegacyV1(raw);
  if (!inspected.ok) return inspected;
  if (!inspected.value) return {ok:true,value:null};
  if (!instant(options.now)) return {ok:false,code:'validation',issues:[{code:'MIGRATION_CLOCK',field:'options.now',message:'Cần thời điểm thực có timezone.'}]};
  try { if (!options.timeZone.trim()) throw Error('timezone'); localDate(options.now, options.timeZone); }
  catch { return {ok:false,code:'validation',issues:[{code:'MIGRATION_TIMEZONE',field:'options.timeZone',message:'Timezone không hợp lệ.'}]}; }
  const {state, fingerprint}=inspected.value;
  const warnings=[...inspected.value.warnings], blockingIssues:ValidationIssue[]=[];
  const warn=(code:string,field:string,message:string)=>warnings.push({code,field,message});
  const block=(code:string,field:string,message:string)=>blockingIssues.push({code,field,message});
  const unresolved:MigrationPreview['unresolved']={selected:[],known:[],sources:{},credentials:[]};
  const draftMap=legacyStageMap[state.stack];
  const mapIds=(values:string[],target:string[],field:'selected'|'known')=> {
    for(const old of values){ const id=lookup(draftMap,old); if(id){if(!target.includes(id))target.push(id);}else unresolved[field].push(old); }
  };
  const draft:RoadmapDraft={trackId:`backend.${state.stack}`,selectedStageIds:[],knownStageIds:[],resourceByStage:{},goal:state.goal,hoursPerWeek:state.hours,startDate:state.startDate};
  mapIds(state.selected,draft.selectedStageIds,'selected');mapIds(state.known,draft.knownStageIds,'known');
  for(const [oldStage,oldResource] of Object.entries(state.sourceByModule)){
    const stage=lookup(draftMap,oldStage),resource=backendPack.resources.find(r=>r.id===`resource.${oldResource}`);
    const allowed=backendPack.stages.find(s=>s.id===stage)?.resourceIds.includes(resource?.id??'');
    if(stage&&resource&&allowed)draft.resourceByStage[stage]=resource.id;
    else Object.defineProperty(unresolved.sources,oldStage,{value:oldResource,enumerable:true,configurable:true,writable:true});
  }
  if(unresolved.selected.length||unresolved.known.length||Object.keys(unresolved.sources).length)
    warn('MIGRATION_DRAFT_UNRESOLVED','draft','Một số lựa chọn/nguồn cũ chưa ánh xạ; raw và danh sách unresolved được giữ. Cần xử lý rõ trước khi lưu draft.');
  const available=new Set([...draft.selectedStageIds,...draft.knownStageIds]);
  for(const selected of draft.selectedStageIds.filter(id=>!draft.knownStageIds.includes(id))){
    const stage=backendPack.stages.find(s=>s.id===selected);
    for(const pre of stage?.prerequisiteIds??[])if(!available.has(pre))block('MIGRATION_DRAFT_PREREQUISITE','draft.selectedStageIds',`Nháp cũ thiếu tiên quyết ${pre}; không tự thêm hoặc đánh dấu đã biết.`);
  }
  if(new Date(`${draft.startDate}T00:00:00Z`).getUTCDay()!==1)block('MIGRATION_START_DAY','draft.startDate','Ngày nháp cũ không phải Thứ Hai; không tự đổi lịch.');
  const savedCredentialIds:string[]=[];
  for(const old of state.credentials){const id=`credential.${old}`;if(backendPack.credentials.some(c=>c.id===id)){if(!savedCredentialIds.includes(id))savedCredentialIds.push(id);}else unresolved.credentials.push(old);}
  if(unresolved.credentials.length)warn('MIGRATION_CREDENTIAL_UNRESOLVED','credentials','Mục tiêu cũ chưa ánh xạ được; giữ danh sách gốc để xử lý.');
  let plan:LearningPlan|null=null,customizedCount=0,missingSourceCount=0;
  let metadata=state.planMeta;
  if(state.tasks.length&&!metadata){
    metadata=options.missingPlanMeta;
    if(!metadata)block('MIGRATION_PLAN_META_REQUIRED','planMeta','Plan cũ thiếu bối cảnh; cần người dùng xác nhận stack, mục tiêu, quỹ giờ và ngày bắt đầu.');
    else warn('MIGRATION_PLAN_META_CHOSEN','planMeta','Bối cảnh plan được chọn rõ cho bản cũ thiếu planMeta; cần hiển thị lựa chọn trong màn xác nhận.');
  }
  if(metadata&&state.tasks.length){
    if(!['node','python','java'].includes(metadata.stack)||typeof metadata.goal!=='string'||!Number.isInteger(metadata.hours)||metadata.hours<2||metadata.hours>20||!date(metadata.startDate))
      return {ok:false,code:'validation',issues:[{code:'MIGRATION_PLAN_META',field:'planMeta',message:'Bối cảnh plan được cung cấp không hợp lệ.'}]};
    if(new Date(`${metadata.startDate}T00:00:00Z`).getUTCDay()!==1)block('MIGRATION_START_DAY','planMeta.startDate','Ngày plan cũ không phải Thứ Hai; giữ ngày gốc và cần giải quyết rõ trước ghi.');
    const map=legacyStageMap[metadata.stack],workMap=legacyWorkMap[metadata.stack],ids=new Set<string>();
    const nextId=()=>{const id=options.nextId();if(typeof id!=='string'||!uid.test(id)||ids.has(id.toLowerCase()))throw Error('ID factory trả UUID lỗi hoặc trùng');ids.add(id.toLowerCase());return id;};
    try{
      const planId=nextId(),generationId=nextId(),completions:StudyCompletion[]=[],selectedStageIds:string[]=[],resourceByStage:Record<string,string>={};
      const tasks:PlanTask[]=state.tasks.map((old,index)=>{
        const mappedStage=lookup(map,old.moduleId);
        const stageId=mappedStage??`legacy.custom-stage-${index}`;
        if(!selectedStageIds.includes(stageId))selectedStageIds.push(stageId);
        const stage=backendPack.stages.find(s=>s.id===mappedStage),workId=lookup(workMap,old.id);
        const work=stage?.work.find(w=>w.id===workId);
        const matches=!!work&&work.title===old.title&&work.minutes===old.minutes;
        const customized=!matches;if(customized)customizedCount++;
        if(!mappedStage)warn('MIGRATION_UNKNOWN_STAGE',`tasks[${index}].stageId`,`Giữ module cũ ${old.moduleId} thành việc tùy chỉnh; không gán sang bài gần giống.`);
        if(!matches)warn('MIGRATION_CUSTOMIZED',`tasks[${index}]`,'Việc không khớp template hoặc đã sửa; giữ title/phút và segment=null.');
        const resource=backendPack.resources.find(r=>r.id===`resource.${old.sourceId}`);
        const usable=resource&&(()=>{try{const u=new URL(resource.url);return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password;}catch{return false;}})();
        const source=usable?{id:resource.id,title:resource.title,provider:resource.provider,url:resource.url}:null;
        let notes=old.notes;
        if(!source){missingSourceCount++;notes+=`${notes?'\n':''}[Nguồn v1 cần chọn lại: ${old.sourceId}]`;warn('MIGRATION_SOURCE_MISSING',`tasks[${index}].source`,'Không có nguồn an toàn tương ứng; giữ ID nguồn cũ trong ghi chú và raw.');}
        else if(stage?.resourceIds.includes(source.id))resourceByStage[stageId]??=source.id;
        const taskId=nextId(),completionId=old.completed?nextId():null;
        if(completionId)completions.push({id:completionId,taskId,completedAt:old.completedAt??null,localDate:old.completedAt?localDate(old.completedAt,options.timeZone):null,timeZone:old.completedAt?options.timeZone:null,estimatedMinutes:old.minutes,revertedAt:null});
        return {id:taskId,stageId,workId:work?.id??null,workRevision:work?.revision??null,segment:matches?{fromMinute:0,toMinute:old.minutes}:null,title:old.title,minutes:old.minutes,acceptance:work?.acceptance??['Giữ công việc cũ; người học cần bổ sung tiêu chí nghiệm thu.'],source,weekIndex:old.week,dayIndex:null,status:old.completed?'done':'todo',customized,completionId,notes};
      });
      const trackId=`backend.${metadata.stack}`;
      plan={id:planId,name:metadata.goal.trim()||'Kế hoạch chuyển từ v1',pathId:'backend',trackId,contentVersion:backendPack.contentVersion,createdAt:options.now,status:'active',current:{id:generationId,createdAt:options.now,trackId,contentVersion:backendPack.contentVersion,selectedStageIds,knownStageIds:[],resourceByStage,tasks,closedWeeks:[],goal:metadata.goal,hoursPerWeek:metadata.hours,startDate:metadata.startDate},history:[],completions};
    }catch(error){return {ok:false,code:'validation',issues:[{code:'MIGRATION_ID_OR_MAPPING',field:'migration',message:String(error)}]};}
  }
  warn('MIGRATION_PREVIEW_ONLY','migration','Đây là bản xem trước, chưa xác nhận hoặc ghi dữ liệu. Raw đầy đủ còn nguyên; dữ liệu chưa biểu diễn trong v2 cần được xử lý trước khi chốt.');
  if(state.tasks.some(t=>t.completedAt))warn('MIGRATION_COMPLETION_TIMEZONE','completions','Timestamp gốc được giữ; ngày hiển thị tính theo timezone đã chọn trong preview vì v1 không lưu timezone riêng.');
  return {ok:true,value:{raw:inspected.value.raw,fingerprint,plan,draft,savedCredentialIds,summary:{taskCount:state.tasks.length,doneCount:state.tasks.filter(t=>t.completed).length,customizedCount,missingSourceCount,planTrackId:plan?.trackId??null,draftTrackId:draft.trackId},warnings,blockingIssues,unresolved}};
}
