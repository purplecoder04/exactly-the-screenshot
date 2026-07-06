create extension if not exists pgcrypto with schema extensions;

create table if not exists public.import_work_sessions (
  id uuid primary key default gen_random_uuid(),
  file_name text,
  file_type text,
  raw_content text,
  parsed_items jsonb,
  status text default 'unreviewed',
  created_at timestamptz default now()
);

alter table public.import_work_sessions
  add column if not exists file_name text,
  add column if not exists file_type text,
  add column if not exists raw_content text,
  add column if not exists parsed_items jsonb,
  add column if not exists status text default 'unreviewed',
  add column if not exists created_at timestamptz default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'import_work_sessions'
      and column_name = 'source_type'
  ) then
    execute $migration$
      update public.import_work_sessions
      set file_type = coalesce(file_type, source_type)
    $migration$;
  end if;

  update public.import_work_sessions
  set
    file_name = coalesce(file_name, 'Imported Work Session'),
    file_type = case
      when lower(coalesce(file_type, '')) in ('.txt', 'txt', 'text', 'pasted work session') then '.txt'
      when lower(coalesce(file_type, '')) in ('.md', 'md', 'markdown') then '.md'
      when lower(coalesce(file_type, '')) in ('.docx', 'docx') then '.docx'
      else '.txt'
    end,
    raw_content = coalesce(raw_content, ''),
    parsed_items = coalesce(parsed_items, '[]'::jsonb),
    status = case
      when lower(coalesce(status, '')) in ('unreviewed', 'reviewed') then lower(status)
      else 'reviewed'
    end,
    created_at = coalesce(created_at, now());
end $$;

create index if not exists import_work_sessions_status_idx
  on public.import_work_sessions (status);

create index if not exists import_work_sessions_created_at_idx
  on public.import_work_sessions (created_at desc);

alter table public.import_work_sessions enable row level security;

drop policy if exists "import_work_sessions_select_all" on public.import_work_sessions;
drop policy if exists "import_work_sessions_insert_all" on public.import_work_sessions;
drop policy if exists "import_work_sessions_update_all" on public.import_work_sessions;
drop policy if exists "import_work_sessions_delete_all" on public.import_work_sessions;

create policy "import_work_sessions_select_all"
  on public.import_work_sessions
  for select
  to anon, authenticated
  using (true);

create policy "import_work_sessions_insert_all"
  on public.import_work_sessions
  for insert
  to anon, authenticated
  with check (true);

create policy "import_work_sessions_update_all"
  on public.import_work_sessions
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "import_work_sessions_delete_all"
  on public.import_work_sessions
  for delete
  to anon, authenticated
  using (true);
