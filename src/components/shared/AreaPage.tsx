import { useMemo, useState } from "react";
import type { ComponentType } from "react";
import { BookOpen, Flower2, HeartHandshake, Mountain, Plus, Settings2, Sprout } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AreaDot } from "@/components/shared/AreaPill";
import { FilterBar, EMPTY_FILTERS, type Filters } from "@/components/shared/FilterBar";
import { PlannerPageHeader, PlannerPanel } from "@/components/shared/PlannerPageHeader";
import { TaskDialog } from "@/components/shared/TaskDialog";
import { TaskTable } from "@/components/shared/TaskTable";
import { useTasks } from "@/hooks/useTasks";
import { plannerAssets } from "@/lib/plannerAssets";
import { areaTypeFor, type TaskItem, type WorkspaceArea } from "@/lib/types";

type AreaTreatment = {
  eyebrow: string;
  icon: ComponentType<{ className?: string }>;
  heroClass: string;
  statTints: [string, string, string, string];
  decorAsset: string;
  decorClassName?: string;
};

const WORKSTREAM_TREATMENT: AreaTreatment = {
  eyebrow: "Workstream Studio",
  icon: Settings2,
  heroClass: "bg-[linear-gradient(135deg,rgba(255,251,245,0.96),rgba(231,240,237,0.72))]",
  statTints: ["bg-lavender/35", "bg-sage/25", "bg-powder-blue/30", "bg-gold/20"],
  decorAsset: plannerAssets.goldSparkles,
  decorClassName: "right-12 top-8 h-24 w-24 opacity-25",
};

const AREA_TREATMENTS: Partial<Record<WorkspaceArea, AreaTreatment>> = {
  Brand: {
    eyebrow: "Brand Studio",
    icon: BookOpen,
    heroClass: "bg-[linear-gradient(135deg,rgba(255,251,245,0.96),rgba(246,225,239,0.72))]",
    statTints: ["bg-lavender/45", "bg-gold/25", "bg-blush/35", "bg-primary/10"],
    decorAsset: plannerAssets.bookJournal,
    decorClassName: "right-12 top-4 h-32 w-32 rotate-[-5deg] opacity-25",
  },
  Rise: {
    eyebrow: "Rise Studio",
    icon: Flower2,
    heroClass: "bg-[linear-gradient(135deg,rgba(255,251,245,0.96),rgba(250,211,226,0.62))]",
    statTints: ["bg-blush/45", "bg-lavender/35", "bg-gold/20", "bg-priority-high/15"],
    decorAsset: plannerAssets.floralBouquet,
    decorClassName: "right-10 top-2 h-32 w-44 opacity-30",
  },
  Land: {
    eyebrow: "Land Studio",
    icon: Mountain,
    heroClass: "bg-[linear-gradient(135deg,rgba(255,251,245,0.96),rgba(191,207,166,0.45))]",
    statTints: ["bg-sage/35", "bg-green-muted/25", "bg-gold/20", "bg-lavender/25"],
    decorAsset: plannerAssets.leafSage,
    decorClassName: "right-14 top-4 h-32 w-28 opacity-30",
  },
  Rebuild: {
    eyebrow: "Rebuild Studio",
    icon: Sprout,
    heroClass: "bg-[linear-gradient(135deg,rgba(255,251,245,0.96),rgba(199,228,238,0.55))]",
    statTints: ["bg-powder-blue/40", "bg-sage/25", "bg-lavender/25", "bg-blush/25"],
    decorAsset: plannerAssets.washBlue,
    decorClassName: "right-10 top-6 h-32 w-40 opacity-30",
  },
  "Meet at the Heal": {
    eyebrow: "Meet at the Heal",
    icon: HeartHandshake,
    heroClass: "bg-[linear-gradient(135deg,rgba(255,251,245,0.96),rgba(250,211,226,0.5),rgba(217,163,87,0.16))]",
    statTints: ["bg-blush/40", "bg-gold/25", "bg-lavender/30", "bg-sage/20"],
    decorAsset: plannerAssets.jarGarden,
    decorClassName: "right-12 top-3 h-36 w-32 opacity-30",
  },
};

export function AreaPage({ area, blurb }: { area: WorkspaceArea; blurb?: string }) {
  const { tasks, addTask, updateTask, deleteTask, toggleDone, moveToToday } = useTasks();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TaskItem | null>(null);

  const scoped = useMemo(() => tasks.filter((task) => task.branch === area), [tasks, area]);

  const filtered = useMemo(
    () =>
      scoped.filter((task) => {
        if (filters.status !== "all" && task.status !== filters.status) return false;
        if (filters.priority !== "all" && task.priority !== filters.priority) return false;
        return true;
      }),
    [scoped, filters],
  );

  const stats = useMemo(
    () => ({
      active: scoped.filter((task) => !task.isDone).length,
      done: scoped.filter((task) => task.isDone).length,
      waiting: scoped.filter((task) => task.status === "Waiting").length,
      high: scoped.filter((task) => task.priority === "High" && !task.isDone).length,
    }),
    [scoped],
  );

  const treatment = AREA_TREATMENTS[area] ?? WORKSTREAM_TREATMENT;
  const AccentIcon = treatment.icon;
  const typeLabel = areaTypeFor(area);

  return (
    <div className="space-y-6">
      <PlannerPageHeader
        eyebrow={treatment.eyebrow}
        title={area}
        description={blurb ?? `${typeLabel} tasks, focus, and progress.`}
        className={treatment.heroClass}
        decorAsset={treatment.decorAsset}
        decorClassName={treatment.decorClassName}
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="mr-1 h-4 w-4" /> Add Task
          </Button>
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/75 px-3 py-2 text-sm text-ink">
            <AreaDot area={area} className="h-3 w-3" />
            {typeLabel}
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/75 px-3 py-2 text-sm text-ink">
            <AccentIcon className="h-4 w-4 text-gold" />
            {filtered.length} shown
          </div>
        </div>
      </PlannerPageHeader>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Active" value={stats.active} tint={treatment.statTints[0]} />
        <StatTile label="Done" value={stats.done} tint={treatment.statTints[1]} />
        <StatTile label="Waiting" value={stats.waiting} tint={treatment.statTints[2]} />
        <StatTile label="High Priority" value={stats.high} tint={treatment.statTints[3]} />
      </div>

      <PlannerPanel title="Filters" description="Focus this page by status or priority.">
        <FilterBar value={filters} onChange={setFilters} hideArea />
      </PlannerPanel>

      <PlannerPanel title={`${area} Task Board`} description="Add, edit, delete, complete, or move tasks into Today.">
        <TaskTable
          tasks={filtered}
          onToggle={toggleDone}
          onEdit={(task) => {
            setEditing(task);
            setOpen(true);
          }}
          onDelete={deleteTask}
          onMoveToToday={moveToToday}
          emptyLabel={`No tasks in ${area} yet.`}
        />
      </PlannerPanel>

      <TaskDialog
        open={open}
        onOpenChange={setOpen}
        initial={editing ?? { branch: area }}
        lockedBranch={editing ? undefined : area}
        onSubmit={(data) => {
          if (editing) {
            updateTask(editing.id, data);
            toast.success("Task updated.");
          } else {
            addTask(data);
            toast.success("Task added.");
          }
        }}
      />
    </div>
  );
}

function StatTile({ label, value, tint }: { label: string; value: number; tint: string }) {
  return (
    <div className={`planner-soft-hover rounded-2xl border border-border/70 ${tint} px-4 py-4 text-center`}>
      <div className="text-3xl font-semibold leading-none text-ink">{value}</div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
    </div>
  );
}
