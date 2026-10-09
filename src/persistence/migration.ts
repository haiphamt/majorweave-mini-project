import type { OperationResult, Workspace, WorkspacePersistence, ValidationIssue } from '../domain/contracts';
import { LEGACY_V1_KEY, inspectLegacyV1 } from './migration-source';
import { previewLegacyV1, type MigrationPreview, type MigrationPreviewOptions } from './migration-preview';

export type MigrationChoices = {
  mode: 'initial' | 'append';
  importProfile: boolean;
  importPreferences: boolean;
  importDraft: boolean;
  importCredentials: boolean;
};
export type MigrationPreparation =
  | { kind: 'already-imported'; fingerprint: string; workspace: Workspace }
  | { kind: 'preview'; ticket: string; choices: MigrationChoices; preview: MigrationPreview; candidate: Workspace };
export type MigrationCommit = {
  workspace: Workspace;
  fingerprint: string;
  sourceRaw: string; // Original source remains exportable even if v1 changes later.
  sourceStateAfterCommit: 'unchanged' | 'changed' | 'unreadable';
};
export type MigrationDependencies = {
  persistence: WorkspacePersistence;
  readLegacy: (key: string) => string | null;
  validate: (value: unknown) => OperationResult<Workspace>;
  context: () => MigrationPreviewOptions;
};
const defaults: MigrationChoices = { mode:'initial', importProfile:false, importPreferences:false, importDraft:true, importCredentials:true };
const error = <T>(code: 'validation' | 'storage' | 'conflict', issueCode: string, field: string, message: string): OperationResult<T> =>
  ({ok:false,code,issues:[{code:issueCode,field,message}]});
const same = (a: unknown,b: unknown) => JSON.stringify(a)===JSON.stringify(b);
const allIds = (w:Workspace) => w.plans.flatMap(p=>[p.id,...p.completions.map(c=>c.id),...[p.current,...p.history].flatMap(g=>[g.id,...g.tasks.map(t=>t.id),...g.closedWeeks.flatMap(c=>c.tasks.map(t=>t.id))])]);

/** Owns only one preview session, never a second persistence store. */
export function createLegacyMigration(deps: MigrationDependencies) {
  type Session = {ticket:string;raw:string;fingerprint:string;base:Workspace;candidate:Workspace};
  let session:Session|null=null, busy=false,sequence=0;
  const checked = (value:unknown):OperationResult<Workspace> => {
    try { const r=deps.validate(structuredClone(value));return r.ok?{ok:true,value:structuredClone(r.value)}:r; }
    catch {return error('validation','MIGRATION_VALIDATOR','workspace','Validator gặp lỗi; chưa ghi migration.');}
  };
  const read = ():OperationResult<string|null> => {
    try {return {ok:true,value:deps.readLegacy(LEGACY_V1_KEY)};}
    catch {return error('storage','LEGACY_READ','legacy','Không đọc được nguồn v1; không dùng defaults.');}
  };
  const load = async ():Promise<OperationResult<Workspace>> => {
    try {const r=await deps.persistence.loadWorkspace();return r.ok?checked(r.value):r;}
    catch {return error('storage','MIGRATION_LOAD','workspace','Không tải được workspace; chưa ghi dữ liệu.');}
  };
  async function prepare(choices:Partial<MigrationChoices>={}):Promise<OperationResult<MigrationPreparation>> {
    if(busy)return error('conflict','MIGRATION_BUSY','migration','Một thao tác đang chạy.');
    busy=true;session=null; // A new preview invalidates any old ticket.
    try {
      const decision={...defaults,...choices};
      if(!['initial','append'].includes(decision.mode)||['importProfile','importPreferences','importDraft','importCredentials'].some(k=>typeof decision[k as keyof MigrationChoices]!=='boolean')||Object.keys(choices).some(k=>!Object.hasOwn(defaults,k)))
        return error('validation','MIGRATION_CHOICES','choices','Lựa chọn migration không hợp lệ.');
      const source=read();if(!source.ok)return source;
      const inspected=await inspectLegacyV1(source.value);if(!inspected.ok)return inspected;
      if(!inspected.value)return error('validation','MIGRATION_NO_SOURCE','legacy','Không có nguồn v1 để chuyển.');
      const loaded=await load();if(!loaded.ok)return loaded;
      const base=loaded.value;
      if(base.imports.some(i=>i.fingerprint===inspected.value!.fingerprint)){const latest=read();if(!latest.ok)return latest;if(latest.value!==inspected.value.raw)return error('conflict','MIGRATION_SOURCE_CHANGED','legacy','Nguồn đã đổi trong khi kiểm fingerprint; cần xem lại.');return {ok:true,value:{kind:'already-imported',fingerprint:inspected.value.fingerprint,workspace:structuredClone(base)}};}
      if(decision.mode==='initial'&&(base.revision!==0||base.plans.length!==0))return error('conflict','MIGRATION_EXISTING_WORKSPACE','workspace','Workspace đã có dữ liệu; cần chọn rõ chế độ thêm, không thay workspace.');
      const supplied=deps.context();
      const reserved=new Set(allIds(base).map(id=>id.toLowerCase()));
      const factory=supplied.nextId;
      const context:MigrationPreviewOptions={...supplied,missingPlanMeta:supplied.missingPlanMeta?structuredClone(supplied.missingPlanMeta):undefined,nextId:()=>{
        const id=factory();if(typeof id!=='string'||reserved.has(id.toLowerCase()))throw Error('ID đã dùng trong workspace');reserved.add(id.toLowerCase());return id;
      }};
      const p=await previewLegacyV1(inspected.value.raw,context);if(!p.ok)return p;
      if(!p.value)return error('validation','MIGRATION_NO_SOURCE','legacy','Nguồn v1 không còn.');
      const preview=p.value;
      const blockers:ValidationIssue[]=preview.blockingIssues.filter(i=>decision.importDraft||!i.field.startsWith('draft.'));
      if(decision.importDraft&&(preview.unresolved.selected.length||preview.unresolved.known.length))blockers.push({code:'MIGRATION_DRAFT_UNRESOLVED',field:'draft',message:'Lựa chọn nháp chưa ánh xạ được; cần giải quyết hoặc chọn rõ không nhập draft, giữ nguồn v1.'});
      const usedOldStages=new Set([...inspected.value.state.selected,...inspected.value.state.known]);
      if(decision.importDraft&&Object.keys(preview.unresolved.sources).some(id=>usedOldStages.has(id)))blockers.push({code:'MIGRATION_DRAFT_SOURCE',field:'draft.resourceByStage',message:'Nguồn của chặng nháp đang chọn chưa ánh xạ được; chưa nhập draft đó.'});
      if(decision.importCredentials&&preview.unresolved.credentials.length)blockers.push({code:'MIGRATION_CREDENTIAL_UNRESOLVED',field:'credentials',message:'Mục tiêu cũ chưa ánh xạ; cần giải quyết hoặc chọn rõ không nhập mục tiêu, giữ nguồn v1.'});
      if(decision.importDraft&&Object.hasOwn(base.drafts,preview.draft.trackId))blockers.push({code:'MIGRATION_DRAFT_EXISTS',field:'draft',message:'Đã có draft cho track này; chọn không nhập draft để giữ bản hiện tại.'});
      if(blockers.length)return {ok:false,code:'validation',issues:blockers};
      const candidate=structuredClone(base);
      if(preview.plan){candidate.plans.push(structuredClone(preview.plan));if(candidate.activePlanId===null)candidate.activePlanId=preview.plan.id;}
      if(decision.importDraft)candidate.drafts[preview.draft.trackId]=structuredClone(preview.draft);
      if(decision.importCredentials)candidate.savedCredentialIds=[...new Set([...candidate.savedCredentialIds,...preview.savedCredentialIds])];
      if(decision.importProfile)candidate.profile={displayName:inspected.value.state.profileName,majorId:inspected.value.state.major||null,timeZone:context.timeZone};
      if(decision.importPreferences)candidate.preferences={resourceLanguage:inspected.value.state.language==='vi'?'vi':inspected.value.state.language==='en'?'en':'all',preferFree:inspected.value.state.preferFree};
      candidate.imports.push({fingerprint:preview.fingerprint,importedAt:context.now,planIds:preview.plan?[preview.plan.id]:[]});
      const valid=checked(candidate);if(!valid.ok)return valid;
      const sourceNow=read();if(!sourceNow.ok)return sourceNow;
      if(sourceNow.value!==inspected.value.raw)return error('conflict','MIGRATION_SOURCE_CHANGED','legacy','Nguồn v1 đã đổi trong lúc preview; cần xem lại.');
      const ticket=`migration-${++sequence}`;
      session={ticket,raw:inspected.value.raw,fingerprint:preview.fingerprint,base:structuredClone(base),candidate:valid.value};
      return {ok:true,value:{kind:'preview',ticket,choices:structuredClone(decision),preview:structuredClone(preview),candidate:structuredClone(valid.value)}};
    } catch {return error('validation','MIGRATION_PREPARE','migration','Không chuẩn bị được migration; giữ nguồn nguyên trạng.');}
    finally {busy=false;}
  }
  async function confirm(ticket:string):Promise<OperationResult<MigrationCommit>> {
    if(busy)return error('conflict','MIGRATION_BUSY','migration','Một thao tác đang chạy; không gửi xác nhận hai lần.');
    if(!session||session.ticket!==ticket)return error('validation','MIGRATION_TICKET','ticket','Preview đã hủy hoặc không còn hiệu lực.');
    busy=true;const current=session;
    try {
      const source=read();if(!source.ok)return source;
      if(source.value!==current.raw)return error('conflict','MIGRATION_SOURCE_CHANGED','legacy','Nguồn v1 đã đổi; giữ bản đề xuất, cần preview lại trước ghi.');
      const loaded=await load();if(!loaded.ok)return loaded;
      if(loaded.value.imports.some(i=>i.fingerprint===current.fingerprint)){
        session=null;const after=read();return {ok:true,value:{workspace:loaded.value,fingerprint:current.fingerprint,sourceRaw:current.raw,sourceStateAfterCommit:!after.ok?'unreadable':after.value===current.raw?'unchanged':'changed'}};
      }
      if(loaded.value.revision!==current.base.revision||!same(loaded.value,current.base))return error('conflict','MIGRATION_REVISION','workspace.revision','Workspace đã đổi; giữ đề xuất, không ghi đè. Cần preview lại trên bản mới.');
      const valid=checked(current.candidate);if(!valid.ok)return valid;
      const lastRead=read();if(!lastRead.ok)return lastRead;
      if(lastRead.value!==current.raw)return error('conflict','MIGRATION_SOURCE_CHANGED','legacy','Nguồn đổi trước save; chưa ghi migration.');
      let saved:OperationResult<Workspace>;
      try {saved=await deps.persistence.saveWorkspace(structuredClone(valid.value),current.base.revision);}
      catch {return error('storage','MIGRATION_SAVE','workspace','Save gặp lỗi; giữ cùng bản đề xuất để retry hoặc xuất.');}
      if(!saved.ok)return saved; // Keep the exact IDs/history for retry.
      session=null;
      const after=read();
      return {ok:true,value:{workspace:structuredClone(saved.value),fingerprint:current.fingerprint,sourceRaw:current.raw,sourceStateAfterCommit:!after.ok?'unreadable':after.value===current.raw?'unchanged':'changed'}};
    } finally {busy=false;}
  }
  function cancel(ticket:string):OperationResult<void> {
    if(busy)return error('conflict','MIGRATION_BUSY','migration','Đang thực hiện thao tác; không coi hủy UI là hủy transaction.');
    if(!session||session.ticket!==ticket)return error('validation','MIGRATION_TICKET','ticket','Preview không còn hiệu lực.');
    session=null;return {ok:true,value:undefined};
  }
  return {prepare,confirm,cancel,getProposal:()=>session?structuredClone(session.candidate):null,getSourceBackup:()=>session?.raw??null,isBusy:()=>busy};
}
