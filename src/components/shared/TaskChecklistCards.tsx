import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CalendarMinus, CalendarPlus, Pencil, Trash2 } from "lucide-react";
import type { TaskItem } from "@/lib/types";
import { PriorityBadge, StatusBadge } from "./Badges";
import { AreaPill } from "./AreaPill";
import { cn } from "@/lib/utils";

type Props = {
  tasks: TaskItem[];
  onToggle: (id: string) => void;
  onEdit?: (task: TaskItem) => void;
  onDelete?: (id: string) => void;
  onMoveToToday?: (id: string) => void;
  onRemoveFromToday?: (id: string) => void;
  emptyLabel?: string;
};

export function TaskChecklistCards({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onMoveToToday,
  onRemoveFromToday,
  emptyLabel = "No tasks yet.",
}: Props) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-plum-soft/25 bg-card/70 p-8 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {tasks.map((task) => (
        <article
          key={task.id}
          className="planner-soft-hover rounded-2xl border border-border/80 bg-card/85 p-4 shadow-sm"
        >
          <div className="flex min-w-0 items-start gap-3">
            <Checkbox
              checked={task.isDone}
              onCheckedChange={() => onToggle(task.id)}
              className="mt-1 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-start justify-between gap-2">
                <h4
                  className={cn(
                    "min-w-0 text-base font-semibold leading-snug text-ink break-words",
                    task.isDone && "text-muted-foreground line-through",
                  )}
                >
                  {task.title}
                </h4>
                <div className="flex shrink-0 flex-wrap justify-end gap-1">
                  {onMoveToToday && !task.isToday && (
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onMoveToToday(task.id)} title="Move to Today">
                      <CalendarPlus className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {onRemoveFromToday && task.isToday && (
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onRemoveFromToday(task.id)} title="Remove from Today">
                      <CalendarMinus className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEdit(task)} title="Edit">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onDelete(task.id)} title="Delete">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="max-w-full rounded-md bg-background/75 px-2 py-1 text-xs leading-tight text-muted-foreground">
                  <span className="font-medium text-ink">Project:</span>{" "}
                  <span className="break-words">{task.project || "Unassigned"}</span>
                </span>
                <AreaPill area={task.branch} />
                <PriorityBadge priority={task.priority} />
                <StatusBadge status={task.status} />
              </div>

              <p className="mt-2 text-xs leading-relaxed text-muted-foreground break-words">
                {task.notes || "No notes yet."}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
