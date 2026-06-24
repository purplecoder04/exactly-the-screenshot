import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/useTasks";
import { FilterBar, EMPTY_FILTERS, type Filters } from "@/components/shared/FilterBar";
import { TaskTable } from "@/components/shared/TaskTable";
import { TaskDialog } from "@/components/shared/TaskDialog";
import { AreaDot } from "@/components/shared/AreaPill";
import type { TaskItem, WorkspaceArea } from "@/lib/types";

export function AreaPage({ area, blurb }: { area: WorkspaceArea; blurb?: string }) {
  const { tasks, addTask, updateTask, deleteTask, toggleDone, moveToToday } = useTasks();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TaskItem | null>(null);

  const scoped = useMemo(() => tasks.filter((t) => t.branch === area), [tasks, area]);

  const filtered = useMemo(
    () =>
      scoped.filter((t) => {
        if (filters.status !== "all" && t.status !== filters.status) return false;
        if (filters.priority !== "all" && t.priority !== filters.priority) return false;
        return true;
      }),
    [scoped, filters],
  );

  const stats = useMemo(() => {
    return {
      active: scoped.filter((t) => !t.isDone).length,
      done: scoped.filter((t) => t.isDone).length,
      waiting: scoped.filter((t) => t.status === "Waiting").length,
      high: scoped.filter((t) => t.priority === "High" && !t.isDone).length,
    };
  }, [scoped]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-display text-3xl text-ink">
            <AreaDot area={area} className="h-3 w-3" />
            {area}
          </h2>
          {blurb && <p className="text-sm text-muted-foreground">{blurb}</p>}
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="mr-1 h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <StatTile label="Active" value={stats.active} tint="bg-lavender/40" />
        <StatTile label="Done" value={stats.done} tint="bg-green-muted/30" />
        <StatTile label="Waiting" value={stats.waiting} tint="bg-status-waiting/25" />
        <StatTile label="High Priority" value={stats.high} tint="bg-blush/40" />
      </div>

      <FilterBar value={filters} onChange={setFilters} hideArea />

      <TaskTable
        tasks={filtered}
        onToggle={toggleDone}
        onEdit={(t) => {
          setEditing(t);
          setOpen(true);
        }}
        onDelete={deleteTask}
        onMoveToToday={moveToToday}
        emptyLabel={`No tasks in ${area} yet.`}
      />

      <TaskDialog
        open={open}
        onOpenChange={setOpen}
        initial={editing ?? { branch: area }}
        lockedBranch={editing ? undefined : area}
        onSubmit={(d) => {
          if (editing) {
            updateTask(editing.id, d);
            toast.success("Task updated.");
          } else {
            addTask(d);
            toast.success("Task added.");
          }
        }}
      />
    </div>
  );
}

function StatTile({ label, value, tint }: { label: string; value: number; tint: string }) {
  return (
    <div className={`rounded-md ${tint} px-3 py-3 text-center`}>
      <div className="font-display text-2xl font-medium text-ink">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
