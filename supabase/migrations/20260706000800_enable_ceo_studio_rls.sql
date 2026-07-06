do $$
declare
  table_name text;
  ceo_studio_tables text[] := array[
    'tasks',
    'ideas',
    'products',
    'frameworks',
    'weekly_plans',
    'decision_items',
    'captured_insights',
    'library_items',
    'continue_working_state',
    'import_work_sessions',
    'weekly_notes'
  ];
begin
  foreach table_name in array ceo_studio_tables loop
    if to_regclass(format('public.%I', table_name)) is null then
      raise notice 'Skipping missing table public.%', table_name;
      continue;
    end if;

    execute format('alter table public.%I enable row level security', table_name);

    execute format('drop policy if exists %I on public.%I', table_name || '_select_all', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_insert_all', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_update_all', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_delete_all', table_name);

    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true)',
      table_name || '_select_all',
      table_name
    );

    execute format(
      'create policy %I on public.%I for insert to anon, authenticated with check (true)',
      table_name || '_insert_all',
      table_name
    );

    execute format(
      'create policy %I on public.%I for update to anon, authenticated using (true) with check (true)',
      table_name || '_update_all',
      table_name
    );

    execute format(
      'create policy %I on public.%I for delete to anon, authenticated using (true)',
      table_name || '_delete_all',
      table_name
    );
  end loop;
end $$;
