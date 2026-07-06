create extension if not exists pgcrypto with schema extensions;

create table if not exists public.continue_working_state (
  id uuid primary key default gen_random_uuid(),
  last_branch text,
  last_product text,
  last_lesson text,
  last_workbook text,
  last_app text,
  last_page text,
  last_task text,
  updated_at timestamptz default now()
);

alter table public.continue_working_state
  add column if not exists last_branch text,
  add column if not exists last_product text,
  add column if not exists last_lesson text,
  add column if not exists last_workbook text,
  add column if not exists last_app text,
  add column if not exists last_page text,
  add column if not exists last_task text,
  add column if not exists updated_at timestamptz default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'continue_working_state'
      and column_name = 'branch'
  ) then
    execute 'update public.continue_working_state set last_branch = coalesce(last_branch, branch)';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'continue_working_state'
      and column_name = 'product'
  ) then
    execute 'update public.continue_working_state set last_product = coalesce(last_product, product)';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'continue_working_state'
      and column_name = 'lesson'
  ) then
    execute 'update public.continue_working_state set last_lesson = coalesce(last_lesson, lesson)';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'continue_working_state'
      and column_name = 'workbook'
  ) then
    execute 'update public.continue_working_state set last_workbook = coalesce(last_workbook, workbook)';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'continue_working_state'
      and column_name = 'app'
  ) then
    execute 'update public.continue_working_state set last_app = coalesce(last_app, app)';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'continue_working_state'
      and column_name = 'page'
  ) then
    execute 'update public.continue_working_state set last_page = coalesce(last_page, page)';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'continue_working_state'
      and column_name = 'task'
  ) then
    execute 'update public.continue_working_state set last_task = coalesce(last_task, task)';
  end if;

  update public.continue_working_state
  set updated_at = coalesce(updated_at, now());
end $$;

create index if not exists continue_working_state_updated_at_idx
  on public.continue_working_state (updated_at desc);

alter table public.continue_working_state enable row level security;

drop policy if exists "continue_working_state_select_all" on public.continue_working_state;
drop policy if exists "continue_working_state_insert_all" on public.continue_working_state;
drop policy if exists "continue_working_state_update_all" on public.continue_working_state;
drop policy if exists "continue_working_state_delete_all" on public.continue_working_state;

create policy "continue_working_state_select_all"
  on public.continue_working_state
  for select
  to anon, authenticated
  using (true);

create policy "continue_working_state_insert_all"
  on public.continue_working_state
  for insert
  to anon, authenticated
  with check (true);

create policy "continue_working_state_update_all"
  on public.continue_working_state
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "continue_working_state_delete_all"
  on public.continue_working_state
  for delete
  to anon, authenticated
  using (true);
