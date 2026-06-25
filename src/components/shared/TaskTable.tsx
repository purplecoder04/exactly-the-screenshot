import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CalendarPlus } from "lucide-react";
import type { TaskItem } from "@/lib/types";
import { PriorityBadge, StatusBadge } from "./Badges";
import { AreaPill } from "./AreaPill";
import { cn } from "@/lib/utils";

type Props = {
  tasks: TaskItem[];
  onToggle: (id: string) => void;
  onEdit?: (t: TaskItem) => void;
  onDelete?: (id: string) => void;
  onMoveToToday?: (id: string) => void;
  showCheckbox?: boolean;
  emptyLabel?: string;
};

export function TaskTable({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onMoveToToday,
  showCheckbox = true,
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
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full min-w-[980px] table-fixed text-[13px]">
        <colgroup>
          {showCheckbox && <col className="w-12" />}
          <col className="w-[28%]" />
          <col className="w-[16%]" />
          <col className="w-[15%]" />
          <col className="w-[10%]" />
          <col className="w-[10%]" />
          <col className="w-[16%]" />
          <col className="w-28" />
        </colgroup>
        <thead className="bg-primary text-primary-foreground">
          <tr className="text-left">
            {showCheckbox && <th className="px-4 py-3"></th>}
            <th className="px-4 py-3 font-medium">Task</th>
            <th className="px-4 py-3 font-medium">Project</th>
            <th className="px-4 py-3 font-medium">Branch / Area</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Notes</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id} className="border-t align-top hover:bg-muted/40">
              {showCheckbox && (
                <td className="px-4 py-3.5">
                  <Checkbox checked={t.isDone} onCheckedChange={() => onToggle(t.id)} />
                </td>
              )}
              <td className="px-4 py-3.5">
                <span
                  className={cn(
                    "block text-sm font-medium leading-relaxed text-ink break-words",
                    t.isDone && "text-muted-foreground line-through",
                  )}
                >
                  {t.title}
                </span>
              </td>
              <td className="px-4 py-3.5 leading-relaxed text-muted-foreground break-words">
                {t.project ?? "-"}
              </td>
              <td className="px-4 py-3.5">
                <AreaPill area={t.branch} />
              </td>
              <td className="px-4 py-3.5">
                <PriorityBadge priority={t.priority} />
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={t.status} />
              </td>
              <td className="px-4 py-3.5 text-xs leading-relaxed text-muted-foreground break-words">
                {t.notes || "-"}
              </td>
              <td className="px-4 py-3.5">
                <div className="flex justify-end gap-1">
                  {onMoveToToday && !t.isToday && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => onMoveToToday(t.id)}
                      title="Move to Today"
                    >
                      <CalendarPlus className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => onEdit(t)}
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => onDelete(t.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
