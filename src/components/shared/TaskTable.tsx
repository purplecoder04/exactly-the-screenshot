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
      <div className="rounded-2xl border border-dashed border-plum-soft/25 bg-card/70 p-8 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card/90 shadow-sm">
      <table className="w-full min-w-[1120px] table-fixed text-[13px]">
        <colgroup>
          {showCheckbox && <col className="w-12" />}
          <col className="w-[32%]" />
          <col className="w-[17%]" />
          <col className="w-[13%]" />
          <col className="w-[9%]" />
          <col className="w-[9%]" />
          <col className="w-[16%]" />
          <col className="w-28" />
        </colgroup>
        <thead className="bg-lavender/35 text-plum-deep">
          <tr className="text-left text-[11px] uppercase tracking-[0.18em]">
            {showCheckbox && <th className="px-5 py-3"></th>}
            <th className="px-5 py-3 font-semibold">Task</th>
            <th className="px-5 py-3 font-semibold">Project</th>
            <th className="px-5 py-3 font-semibold">Branch / Area</th>
            <th className="px-5 py-3 font-semibold">Priority</th>
            <th className="px-5 py-3 font-semibold">Status</th>
            <th className="px-5 py-3 font-semibold">Notes</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id} className="border-t border-border/70 align-top hover:bg-lavender/15">
              {showCheckbox && (
                <td className="px-5 py-4">
                  <Checkbox checked={t.isDone} onCheckedChange={() => onToggle(t.id)} />
                </td>
              )}
              <td className="px-5 py-4">
                <span
                  className={cn(
                    "block text-sm font-semibold leading-relaxed text-ink whitespace-normal [overflow-wrap:anywhere]",
                    t.isDone && "text-muted-foreground line-through",
                  )}
                >
                  {t.title}
                </span>
              </td>
              <td className="px-5 py-4 leading-relaxed text-muted-foreground whitespace-normal [overflow-wrap:anywhere]">
                {t.project ?? "-"}
              </td>
              <td className="px-5 py-4">
                <AreaPill area={t.branch} />
              </td>
              <td className="px-5 py-4">
                <PriorityBadge priority={t.priority} />
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={t.status} />
              </td>
              <td className="px-5 py-4 text-xs leading-relaxed text-muted-foreground whitespace-normal [overflow-wrap:anywhere]">
                {t.notes || "-"}
              </td>
              <td className="px-4 py-4">
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
