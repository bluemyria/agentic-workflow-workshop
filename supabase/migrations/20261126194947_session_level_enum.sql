-- Sessions get a difficulty level. An enum makes the allowed values part of
-- the schema, and `pnpm db:types` then generates a union type for them.
--
-- No RLS or grant changes: the existing per-row select policy and the
-- table-level `grant select ... to anon, authenticated` already cover new
-- columns.

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'session_level'
      and n.nspname = 'public'
  ) then
    create type public.session_level as enum (
      'beginner',
      'intermediate',
      'advanced'
    );
  end if;
end $$;

alter table public.sessions
  add column if not exists level public.session_level;

update public.sessions
set level = v.level::public.session_level
from (
  values
    ('opening-keynote', 'beginner'),
    ('build-your-agentic-workflow', 'intermediate'),
    ('server-components-deep-dive', 'advanced'),
    ('rsc-payload-budget', 'advanced'),
    ('agent-context-windows', 'intermediate'),
    ('micro-frontends-2026', 'intermediate'),
    ('testing-ai-generated-code', 'intermediate'),
    ('closing-panel', 'beginner')
) as v(id, level)
where sessions.id = v.id;

-- No default on purpose: any row left without a level fails here, loudly.
alter table public.sessions
  alter column level set not null;
