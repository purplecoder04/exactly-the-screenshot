create extension if not exists pgcrypto with schema extensions;

create table if not exists public.captured_insights (
  id uuid primary key default gen_random_uuid(),
  branch text,
  content text,
  raw_text text,
  parsed_type text,
  source text,
  status text default 'unreviewed',
  created_at timestamptz default now()
);

alter table public.captured_insights
  add column if not exists branch text,
  add column if not exists content text,
  add column if not exists raw_text text,
  add column if not exists parsed_type text,
  add column if not exists source text,
  add column if not exists status text default 'unreviewed';

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'captured_insights'
      and column_name = 'content'
  ) then
    execute 'update public.captured_insights set raw_text = coalesce(raw_text, content)';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'captured_insights'
      and column_name = 'source'
  ) then
    execute $migration$
      update public.captured_insights
      set parsed_type = coalesce(
        parsed_type,
        case
          when lower(coalesce(source, '')) like '%task%' then 'task'
          when lower(coalesce(source, '')) like '%idea%' then 'idea'
          when lower(coalesce(source, '')) like '%framework%' then 'framework'
          when lower(coalesce(source, '')) like '%product%' then 'product'
          when lower(coalesce(source, '')) like '%decision%' then 'decision'
          else 'note'
        end
      )
    $migration$;
  end if;

  update public.captured_insights
  set
    raw_text = coalesce(raw_text, ''),
    parsed_type = case
      when lower(coalesce(parsed_type, '')) in ('task', 'idea', 'framework', 'product', 'decision', 'note') then lower(parsed_type)
      else 'note'
    end,
    status = case
      when lower(coalesce(status, '')) in ('unreviewed', 'reviewed', 'converted') then lower(status)
      else 'reviewed'
    end;
end $$;

create index if not exists captured_insights_status_idx
  on public.captured_insights (status);

create index if not exists captured_insights_created_at_idx
  on public.captured_insights (created_at desc);

alter table public.captured_insights enable row level security;

drop policy if exists "captured_insights_select_all" on public.captured_insights;
drop policy if exists "captured_insights_insert_all" on public.captured_insights;
drop policy if exists "captured_insights_update_all" on public.captured_insights;
drop policy if exists "captured_insights_delete_all" on public.captured_insights;

create policy "captured_insights_select_all"
  on public.captured_insights
  for select
  to anon, authenticated
  using (true);

create policy "captured_insights_insert_all"
  on public.captured_insights
  for insert
  to anon, authenticated
  with check (true);

create policy "captured_insights_update_all"
  on public.captured_insights
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "captured_insights_delete_all"
  on public.captured_insights
  for delete
  to anon, authenticated
  using (true);
