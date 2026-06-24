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
    <div className="overflow-hidden rounded-lg border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-primary text-primary-foreground">
          <tr className="text-left">
            {showCheckbox && <th className="w-10 px-3 py-2.5"></th>}
            <th className="px-3 py-2.5 font-medium">Task</th>
            <th className="px-3 py-2.5 font-medium">Project</th>
            <th className="px-3 py-2.5 font-medium">Branch / Area</th>
            <th className="px-3 py-2.5 font-medium">Priority</th>
            <th className="px-3 py-2.5 font-medium">Status</th>
            <th className="px-3 py-2.5 font-medium">Notes</th>
            <th className="w-24 px-3 py-2.5"></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id} className="border-t hover:bg-muted/40">
              {showCheckbox && (
                <td className="px-3 py-2">
                  <Checkbox checked={t.isDone} onCheckedChange={() => onToggle(t.id)} />
                </td>
              )}
              <td className={cn("px-3 py-2 font-medium", t.isDone && "text-muted-foreground line-through")}>
                {t.title}
              </td>
              <td className="px-3 py-2 text-muted-foreground">{t.project ?? "—"}</td>
              <td className="px-3 py-2"><AreaPill area={t.branch} /></td>
              <td className="px-3 py-2"><PriorityBadge priority={t.priority} /></td>
              <td className="px-3 py-2"><StatusBadge status={t.status} /></td>
              <td className="px-3 py-2 max-w-[16rem] truncate text-muted-foreground">{t.notes || "—"}</td>
              <td className="px-3 py-2">
                <div className="flex justify-end gap-1">
                  {onMoveToToday && !t.isToday && (
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onMoveToToday(t.id)} title="Move to Today">
                      <CalendarPlus className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(t)} title="Edit">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onDelete(t.id)} title="Delete">
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
