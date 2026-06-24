
# Best Collective CEO Dashboard — Build Plan (Revised)

Local-first premium feminine CEO dashboard matching the reference screenshot. No backend of any kind — all state in `localStorage`.

## Build Order (strict)

1. Design system + sidebar shell
2. Dashboard (close visual match to screenshot)
3. Today page
4. Parking Lot page
5. One reusable Branch/Workstream page
6. Duplicate that layout for the other 8 area tabs
7. Weekly Log (with editable notes)

Do not polish later pages until the Dashboard is right.

## No Backend

Local-first only. No Supabase, no auth/login, no DB, no API routes, no server fns, no mock endpoints, no `.server.ts` files. All persistence via `localStorage`.

## Routing

Use the routing already scaffolded in this project: **TanStack Start file-based routes** under `src/routes/` (confirmed: `__root.tsx`, `index.tsx` already exist). No new framework, no SSR data fetching — pages are client-rendered and read directly from localStorage.

Route files to add:
- `index.tsx` (Dashboard — replaces placeholder)
- `today.tsx`, `parking-lot.tsx`, `weekly-log.tsx`
- Core branches: `brand.tsx`, `rise.tsx`, `land.tsx`, `rebuild.tsx`, `meet-at-the-heal.tsx`
- Workstreams: `kit-factory-app.tsx`, `social-media-app.tsx`, `website.tsx`, `social-media.tsx`

Each route: unique `head()` title/description + `errorComponent` + `notFoundComponent`. Root sets `defaultErrorComponent` + `notFoundComponent`.

## Design System

Update `src/styles.css` with the palette as semantic tokens (oklch equivalents) — never hardcoded hex in components:
- Deep plum `#4B234A`, soft plum `#6F3D6B`, cream `#FAF3E8`, warm white `#FFFDF8`, soft lavender `#D9CBEF`, blush `#F4C7D6`, muted green `#8FAE9C`, gold `#C9A451`, ink `#2D2430`, muted text `#756978`
- Map to `--background` (cream), `--foreground` (ink), `--primary` (plum-deep), `--accent` (gold), `--sidebar-*` (plum gradient + cream text), plus status/priority tokens
- Fonts via `<link>` in `__root.tsx` head (never `@import` URLs in styles.css): **Cormorant Garamond** display + **Inter** body. Register `--font-display` and `--font-sans` in `@theme`.
- Card radius 8px, soft shadows, thin borders

## Data Layer (single source of truth)

**`src/data/sampleData.ts`** — ALL seed data lives here, nothing scattered in components:
- starter tasks
- starter parking lot ideas
- starter weekly focus rows
- starter founder reminder text
- starter weekly notes / weekly log entries

**`src/lib/types.ts`** — `TaskItem`, `ParkingLotItem`, `WeeklyNote`, `WeeklyFocus`, `Branch`, `Workstream`, `WorkspaceArea` (= Branch | Workstream), `AreaType`, `Status`, `Priority`, `ProjectType`, `ParkingLotDecision` — exact shapes from spec.

**`src/lib/storage.ts`** — typed localStorage wrapper with exact keys:
- `bc:tasks`
- `bc:parkingLot`
- `bc:weeklyFocus`
- `bc:reminder`
- `bc:weeklyNotes`

**Hooks** (`src/hooks/`): `useTasks`, `useParkingLot`, `useWeeklyFocus`, `useReminder`, `useWeeklyNotes`. Each: load from localStorage on mount (fallback to `sampleData`), write-through on every mutation, expose CRUD + helpers (`toggleDone`, `moveToToday`, `removeFromToday`, `endDayRollover`, `moveIdeaToTask`).

## Layout & Sidebar

`src/routes/__root.tsx` wraps `<Outlet />` in `SidebarProvider` + `<AppSidebar />` + header (Welcome, CEO + crown + date pill).

`src/components/AppSidebar.tsx` — fixed dark plum gradient sidebar, gold crown + stacked "BEST COLLECTIVE" wordmark, groups with small uppercase gold labels:
- **Dashboard** → Dashboard
- **Today & Focus** → Today, Parking Lot
- **Core Branches** → Brand, Rise, Land, Rebuild, Meet at the Heal
- **Workstreams** → Kit Factory App, Social Media App, Website, Social Media
- **Review** → Weekly Log

Active item = blush→plum gradient pill, white text. Lucide icons per spec (Home / Calendar / Briefcase / Gem / Heart / Star / Leaf / HeartHandshake / Settings / Smartphone / Globe / Hash / BarChart). Gold-bordered quote at bottom:
> One Vision.
> Many Branches.
> One Mission.

## Reusable Building Blocks (`src/components/shared/`)

- `StatusBadge`, `PriorityBadge` (colored star), `BranchPill` — single combined label **"Branch / Area"** everywhere
- `FilterBar` — combined Branch/Area select + Status select + Priority select
- `TaskTable` — checkbox, Task, Project, Branch / Area, Priority, Status, Notes
- `TaskDialog` — add/edit task (title, branch, project, type, status, priority, notes, isToday)
- `ParkingLotDialog` — add/edit idea
- `EmptyState`

## Dashboard (`src/components/dashboard/`) — closely match screenshot

Grid: 3 main columns + xl right rail. Cards:
- `TodaysBig3Card` — top 3 priority Today tasks, numbered circles, priority badges, "View Today →"
- `WeekFocusCard` — labeled rows (Main Book, Main App, Main Website Task, Main Marketing Task, Focus Area)
- `QuickStatusCard` — colored dot per branch/workstream + status text
- `FounderReminderCard` — dark plum gradient, gold hearts, serif italics, editable via dialog
- `RecentProgressCard` — green-check rows, "View Weekly Log →"
- `OverdueWaitingCard` — coral dots, "Go to Today →", row click → move to Today
- `AtAGlanceCard` — 6 pastel stat tiles (Active / In Progress / Waiting / Testing / Completed / Parking Lot count)
- `StatusKeyCard`, `PriorityKeyCard`, `HowToUseCard` — right rail
- `TodayChecklistTable` — bottom-left preview with plum header, Add Task + End Day & Rollover buttons
- `ParkingLotPreviewTable` — bottom-right preview, "Go to Parking Lot →"
- `QuoteStripFooter` — cream/lavender strip with serif italic quote + stars

## Page Composition

- **Today** — three Big 3 hero cards (empty slot shows Add), Extra Tasks table, Add Task dialog, **End Day & Rollover** button with confirm dialog: mark `isDone` tasks completed (`completedAt`), increment `rolloverCount` for unfinished Today tasks (kept visible as rollover candidates). Toast via `sonner`.
- **Parking Lot** — full table (Idea, Branch / Area, Type, Priority, Keep/Maybe/Later, Notes, Created), filters, Add/Edit/Delete, **Move to Active Tasks** (converts idea → task, status=Idea, copies branch/type/priority/notes).
- **AreaPage (reusable)** — header with area name + icon, small stats row (active/done/waiting/high), FilterBar, TaskTable scoped to that area, Add Task pre-filled with that area. Used by all 9 branch/workstream routes.
- **Weekly Log** — NOT read-only:
  - Tasks completed in the last 7 days, grouped by day
  - Rollover counts for unfinished tasks
  - Manual weekly notes section: Add Note dialog (Title, Branch / Area, Note, Date), edit/delete, persisted to `bc:weeklyNotes`

## Global Features

Add/edit/delete tasks, mark done, move to Today, End Day & Rollover, add/edit/delete parking lot ideas, move idea → task, filter by Branch / Area + Status + Priority everywhere, full localStorage persistence, data survives refresh.

## Technical Notes

- Sidebar via existing shadcn `Sidebar` in `src/components/ui/sidebar.tsx`
- Toasts via existing `sonner`
- No new npm packages required
- All colors via semantic tokens — no `text-white` / `bg-[#...]` literals
- Dates via `Intl.DateTimeFormat`
- No `createServerFn`, no `.server.ts`, no `src/routes/api/*`

## Out of Scope (V1)

Auth, Cloud, multi-user, file uploads, integrations, reporting beyond Weekly Log.
