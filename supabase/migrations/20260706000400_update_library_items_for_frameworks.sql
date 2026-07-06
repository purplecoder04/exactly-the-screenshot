create extension if not exists pgcrypto with schema extensions;

create table if not exists public.library_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  branch text,
  content text,
  content_body text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.library_items
  add column if not exists description text,
  add column if not exists branch text,
  add column if not exists content text,
  add column if not exists content_body text,
  add column if not exists updated_at timestamptz default now();

update public.library_items
set
  content_body = coalesce(content_body, content),
  description = coalesce(description, content),
  updated_at = coalesce(updated_at, created_at, now());

do $$
begin
  if to_regclass('public.frameworks') is not null then
    execute $migration$
      insert into public.library_items (
        title,
        description,
        category,
        branch,
        content,
        content_body,
        created_at,
        updated_at
      )
      select
        f.name,
        f.description,
        'Framework',
        coalesce(f.branch, 'Framework Library'),
        jsonb_build_object(
          '__bcKind', 'framework-library-item',
          'version', 1,
          'data', jsonb_build_object(
            'name', f.name,
            'status', coalesce(f.status, 'Active'),
            'primaryUse', 'Teaching',
            'definition', coalesce(f.description, ''),
            'purpose', '',
            'relatedBooks', '',
            'relatedQuizzes', '',
            'relatedApps', '',
            'relatedLessons', '',
            'relatedSocialPosts', '',
            'relatedProducts', '',
            'notes', '',
            'createdAt', coalesce(f.created_at, now()),
            'updatedAt', coalesce(f.created_at, now())
          )
        )::text,
        jsonb_build_object(
          '__bcKind', 'framework-library-item',
          'version', 1,
          'data', jsonb_build_object(
            'name', f.name,
            'status', coalesce(f.status, 'Active'),
            'primaryUse', 'Teaching',
            'definition', coalesce(f.description, ''),
            'purpose', '',
            'relatedBooks', '',
            'relatedQuizzes', '',
            'relatedApps', '',
            'relatedLessons', '',
            'relatedSocialPosts', '',
            'relatedProducts', '',
            'notes', '',
            'createdAt', coalesce(f.created_at, now()),
            'updatedAt', coalesce(f.created_at, now())
          )
        )::text,
        coalesce(f.created_at, now()),
        coalesce(f.created_at, now())
      from public.frameworks f
      where not exists (
        select 1
        from public.library_items li
        where li.category = 'Framework'
          and lower(li.title) = lower(f.name)
      )
    $migration$;
  end if;
end $$;

create index if not exists library_items_category_idx
  on public.library_items (category);

create index if not exists library_items_updated_at_idx
  on public.library_items (updated_at desc);

create index if not exists library_items_branch_idx
  on public.library_items (branch);

alter table public.library_items enable row level security;

drop policy if exists "library_items_select_all" on public.library_items;
drop policy if exists "library_items_insert_all" on public.library_items;
drop policy if exists "library_items_update_all" on public.library_items;
drop policy if exists "library_items_delete_all" on public.library_items;

create policy "library_items_select_all"
  on public.library_items
  for select
  to anon, authenticated
  using (true);

create policy "library_items_insert_all"
  on public.library_items
  for insert
  to anon, authenticated
  with check (true);

create policy "library_items_update_all"
  on public.library_items
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "library_items_delete_all"
  on public.library_items
  for delete
  to anon, authenticated
  using (true);
