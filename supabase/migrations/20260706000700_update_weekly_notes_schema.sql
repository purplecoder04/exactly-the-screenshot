create extension if not exists pgcrypto with schema extensions;

create table if not exists public.weekly_notes (
  id uuid primary key default gen_random_uuid(),
  week_start_date date,
  note_text text,
  related_branch text,
  created_at timestamptz default now()
);

alter table public.weekly_notes
  add column if not exists week_start_date date,
  add column if not exists note_text text,
  add column if not exists related_branch text,
  add column if not exists created_at timestamptz default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'weekly_notes'
      and column_name = 'week_start'
  ) then
    execute $migration$
      update public.weekly_notes
      set week_start_date = coalesce(week_start_date, week_start::date)
      where week_start is not null
    $migration$;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'weekly_notes'
      and column_name = 'note'
  ) then
    execute $migration$
      update public.weekly_notes
      set note_text = coalesce(note_text, note)
    $migration$;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'weekly_notes'
      and column_name = 'type'
  ) then
    execute $migration$
      update public.weekly_notes
      set related_branch = coalesce(related_branch, type)
    $migration$;
  end if;

  update public.weekly_notes
  set
    week_start_date = coalesce(week_start_date, created_at::date, current_date),
    note_text = coalesce(note_text, ''),
    related_branch = coalesce(related_branch, 'Brand'),
    created_at = coalesce(created_at, now());
end $$;

create index if not exists weekly_notes_week_start_date_idx
  on public.weekly_notes (week_start_date);

create index if not exists weekly_notes_created_at_idx
  on public.weekly_notes (created_at desc);

create index if not exists weekly_notes_related_branch_idx
  on public.weekly_notes (related_branch);

alter table public.weekly_notes enable row level security;

drop policy if exists "weekly_notes_select_all" on public.weekly_notes;
drop policy if exists "weekly_notes_insert_all" on public.weekly_notes;
drop policy if exists "weekly_notes_update_all" on public.weekly_notes;
drop policy if exists "weekly_notes_delete_all" on public.weekly_notes;

create policy "weekly_notes_select_all"
  on public.weekly_notes
  for select
  to anon, authenticated
  using (true);

create policy "weekly_notes_insert_all"
  on public.weekly_notes
  for insert
  to anon, authenticated
  with check (true);

create policy "weekly_notes_update_all"
  on public.weekly_notes
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "weekly_notes_delete_all"
  on public.weekly_notes
  for delete
  to anon, authenticated
  using (true);
