import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { TaskItem } from "@/lib/types";
import { PriorityBadge, StatusBadge } from "./Badges";
import { AreaPill } from "./AreaPill";
import { cn } from "@/lib/utils";

type Props = {
  tasks: TaskItem[];
  onToggle: (id: string) => void;
  onEdit?: (task: TaskItem) => void;
  emptyLabel?: string;
};

export function TaskChecklistCards({
  tasks,
  onToggle,
  onEdit,
  emptyLabel = "No tasks yet.",
}: Props) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-card/50 p-8 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {tasks.map((task) => (
        <article
          key={task.id}
          className="rounded-lg border bg-muted/25 p-3.5 shadow-sm transition-colors hover:bg-muted/35"
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
                    "min-w-0 text-sm font-semibold leading-snug text-ink break-words",
                    task.isDone && "text-muted-foreground line-through",
                  )}
                >
                  {task.title}
                </h4>
                {onEdit && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 shrink-0 px-2 text-[11px]"
                    onClick={() => onEdit(task)}
                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                )}
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
