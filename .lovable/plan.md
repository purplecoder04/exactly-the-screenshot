# Storage Swap: localStorage → Supabase (4 tables)

Swap the persistence layer for Tasks, Ideas (Idea Garden + Brain Dump), Products, and Frameworks from `localStorage` to the existing Supabase tables. No schema changes, no RLS changes, no UI changes.

## Scope

**In scope (swap to Supabase):**
- `useTasks` → `public.tasks`
- `useParkingLot` + Brain Dump ideas → `public.ideas` (with `source_app = "ceo_studio"`)
- `useProductCatalog` → `public.products`
- `useFrameworkLibrary` → `public.frameworks`

**Out of scope (stay on localStorage):**
- Weekly focus/notes/plan, Library items, Decision Support, Captured Insights, Continue Working, Brain Dump draft text, Reminder — no matching tables exist and the user said not to create any.
- The 9 unrelated tables (posts, hooks, stories, etc.) — untouched.

## Column mapping

Since the DB columns are a subset of the current local types, extra UI-only fields (e.g. task `nextStep`, `notes`, `project`, `isDone`, `rolloverCount`, `completedAt`; product `collection`, `lessonGuide`, `workbook`, `version`, `notes`, `isLocked`; framework `definition`, `purpose`, related*, `notes`, `primaryUse`; parking-lot `decision`, `notes`, `priority`) are **not persisted**. They remain in the in-memory shape so the UI keeps rendering, but they reset on reload. This is a consequence of the "do not create new tables / match columns exactly" constraint.

- **tasks**: `title, branch, workstream (= areaType), status, is_today, priority, due_date`. `isDone` is derived from `status === "Done"`.
- **ideas**: `content (= idea/body), source_app = "ceo_studio", type, branch, status`. Parking-lot `decision` maps into `status` (`Keep`/`Maybe`/`Later`). Brain Dump items saved as `type = "Idea"`.
- **products**: `name, branch, type, status, design_preset (= collection), created_from, export_url`.
- **frameworks**: `name, branch, description (= definition), status`.

Row → UI mapping fills missing fields with sensible defaults (`""`, `false`, `"Medium"`, etc.) so no component breaks.

## Approach

1. Add a shared row⇄item mapper module per table under `src/lib/mappers/` (tasks, ideas, products, frameworks).
2. Rewrite the four hooks (`useTasks`, `useParkingLot`, `useProductCatalog`, `useFrameworkLibrary`) to:
   - Fetch via TanStack Query (`useQuery`) on mount, keyed per table.
   - Expose the same `add/update/delete/toggle...` API as today so **no consumer changes**.
   - Perform optimistic updates + Supabase mutations, then `invalidateQueries` on settle.
   - Use the browser `supabase` client (`@/integrations/supabase/client`) directly — no server functions needed since RLS stays off.
3. Remove `SAMPLE_*` seeding for these four datasets (sample arrays stay in the file but hooks no longer read them). Other hooks that still use samples keep working.
4. Leave `useLocalState` and other hooks untouched.

## Files touched

- `src/hooks/useTasks.ts` — rewrite internals, same exported API.
- `src/hooks/useParkingLot.ts` — rewrite internals, same exported API.
- `src/hooks/useProductCatalog.ts` — rewrite internals, same exported API.
- `src/hooks/useFrameworkLibrary.ts` — rewrite internals, same exported API.
- `src/hooks/useCapturedInsights.ts` — no change; Brain Dump's *idea* saves route through `useParkingLot`/ideas hook via existing `useWorkSessionSaver` path. Only the ideas branch is redirected; other categories stay local.
- `src/hooks/useWorkSessionSaver.ts` — verify it delegates idea creation to the ideas hook (adjust only if it currently writes ideas directly to localStorage).
- `src/lib/mappers/{tasks,ideas,products,frameworks}.ts` — new small mapping helpers.
- No route/component/UI files change.

## Verification

- Typecheck.
- Preview: create/edit/toggle/delete a Task on Today; add an Idea in Parking Lot; run Brain Dump → save an Idea; add a Product; add a Framework. Reload page and confirm each persists (and appears in Supabase).

## Caveats to flag to user after build

- The "extra" fields listed above are lost on reload since the DB columns don't include them. If any of these matter (e.g. task notes/next step, parking-lot decision beyond mapping to status), the fix is to add columns — which the user has explicitly disallowed for now.
- With RLS off and the anon key in the browser, all four tables are world-readable/writable. The user chose this explicitly; worth re-flagging once before shipping.
