create extension if not exists pgcrypto with schema extensions;

create table if not exists public.weekly_plans (
  id uuid primary key default gen_random_uuid(),
  week_start_date date,
  weekly_focus text,
  top_projects text,
  biggest_risk text,
  waiting_on text,
  success_this_week text,
  branch_focus text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'weekly_plans'
      and column_name = 'week_start'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'weekly_plans'
      and column_name = 'week_start_date'
  ) then
    alter table public.weekly_plans rename column week_start to week_start_date;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'weekly_plans'
      and column_name = 'focus'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'weekly_plans'
      and column_name = 'weekly_focus'
  ) then
    alter table public.weekly_plans rename column focus to weekly_focus;
  end if;
end $$;

alter table public.weekly_plans
  add column if not exists branch_focus text,
  add column if not exists updated_at timestamptz default now();

update public.weekly_plans
set updated_at = coalesce(updated_at, created_at, now());

create index if not exists weekly_plans_updated_at_idx
  on public.weekly_plans (updated_at desc);
