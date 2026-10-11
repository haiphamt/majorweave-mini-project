-- Apply to your own Supabase project, using the SQL editor or Supabase CLI.
-- One private Workspace v2 per account. Guest data stays in browser IndexedDB.
begin;

create table if not exists public.uitplans_workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  revision bigint not null check (revision between 1 and 9007199254740991),
  workspace jsonb not null,
  last_request_id uuid not null,
  updated_at timestamptz not null default now(),
  constraint uitplans_workspace_version check (
    jsonb_typeof(workspace) = 'object'
    and workspace->>'schemaVersion' = '2'
    and (workspace->>'revision')::bigint = revision
  )
);
alter table public.uitplans_workspaces enable row level security;
revoke all on public.uitplans_workspaces from anon, authenticated;
grant select on public.uitplans_workspaces to authenticated;
drop policy if exists "Read own uitplans workspace" on public.uitplans_workspaces;
create policy "Read own uitplans workspace" on public.uitplans_workspaces
  for select to authenticated using ((select auth.uid()) = user_id);

-- Direct writes are not granted. All writes go through this atomic CAS operation.
create or replace function public.save_uitplans_workspace(
  p_user_id uuid,
  p_workspace jsonb,
  p_expected_revision bigint,
  p_request_id uuid
) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  account_id uuid := auth.uid();
  existing public.uitplans_workspaces%rowtype;
  saved jsonb;
begin
  if account_id is null or p_user_id is distinct from account_id then
    raise sqlstate 'PT401' using message = 'Authentication required';
  end if;
  if p_expected_revision is null or p_expected_revision < 0 or p_expected_revision >= 9007199254740991
    or p_request_id is null or p_workspace is null
    or jsonb_typeof(p_workspace) is distinct from 'object'
    or p_workspace->>'schemaVersion' is distinct from '2'
    or jsonb_typeof(p_workspace->'revision') is distinct from 'number'
    or p_workspace->>'revision' is distinct from p_expected_revision::text
    or jsonb_typeof(p_workspace->'plans') is distinct from 'array'
    or jsonb_typeof(p_workspace->'drafts') is distinct from 'object'
    or jsonb_typeof(p_workspace->'profile') is distinct from 'object'
  then
    raise sqlstate 'PT422' using message = 'Invalid workspace or revision';
  end if;
  -- Lock also covers the first write, when the row does not exist yet.
  perform pg_advisory_xact_lock(hashtextextended(account_id::text, 0));
  select * into existing from public.uitplans_workspaces where user_id = account_id for update;
  if found then
    -- A lost HTTP acknowledgement can be retried without saving twice.
    if existing.last_request_id = p_request_id
      and existing.revision = p_expected_revision + 1
      and (existing.workspace - 'revision') = (p_workspace - 'revision') then
      return existing.workspace;
    end if;
    if existing.revision <> p_expected_revision then
      raise sqlstate 'PT409' using message = 'Workspace changed on another device';
    end if;
  elsif p_expected_revision <> 0 then
    raise sqlstate 'PT409' using message = 'Workspace revision does not exist';
  end if;
  saved := jsonb_set(p_workspace, '{revision}', to_jsonb(p_expected_revision + 1), true);
  insert into public.uitplans_workspaces(user_id, revision, workspace, last_request_id)
    values (account_id, p_expected_revision + 1, saved, p_request_id)
    on conflict(user_id) do update set
      revision = excluded.revision,
      workspace = excluded.workspace,
      last_request_id = excluded.last_request_id,
      updated_at = now();
  return saved;
end;
$$;
revoke all on function public.save_uitplans_workspace(uuid,jsonb,bigint,uuid) from public, anon;
grant execute on function public.save_uitplans_workspace(uuid,jsonb,bigint,uuid) to authenticated;

commit;
