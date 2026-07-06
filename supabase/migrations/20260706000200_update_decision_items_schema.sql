create extension if not exists pgcrypto with schema extensions;

create table if not exists public.decision_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text default 'pending',
  priority text,
  related_branch text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.decision_items
  add column if not exists description text,
  add column if not exists priority text,
  add column if not exists related_branch text,
  add column if not exists updated_at timestamptz default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'decision_items'
      and column_name = 'context'
  ) then
    update public.decision_items
    set description = coalesce(description, context);
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'decision_items'
      and column_name = 'branch'
  ) then
    update public.decision_items
    set related_branch = coalesce(related_branch, branch);
  end if;
end $$;

update public.decision_items
set
  priority = coalesce(priority, 'Medium'),
  status = case
    when lower(coalesce(status, '')) in ('accepted', 'dismissed', 'pending') then lower(status)
    else 'pending'
  end,
  updated_at = coalesce(updated_at, created_at, now());

create index if not exists decision_items_updated_at_idx
  on public.decision_items (updated_at desc);

create index if not exists decision_items_status_idx
  on public.decision_items (status);
