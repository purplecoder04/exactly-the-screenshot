import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, X, Pencil, FileUp } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { TaskDialog } from "@/components/shared/TaskDialog";
import { TaskTable } from "@/components/shared/TaskTable";
import { PriorityBadge, StatusBadge } from "@/components/shared/Badges";
import { AreaPill } from "@/components/shared/AreaPill";
import type { TaskItem } from "@/lib/types";

export const Route = createFileRoute("/today")({
  head: () => ({
    meta: [
      { title: "Today — Best Collective" },
      { name: "description", content: "Your daily execution page: Big 3, extra tasks, and End Day rollover." },
    ],
  }),
  component: TodayPage,
});

function TodayPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleDone, removeFromToday, endDayRollover } = useTasks();
  const [dlgOpen, setDlgOpen] = useState(false);
  const [editing, setEditing] = useState<TaskItem | null>(null);
  const [confirmEnd, setConfirmEnd] = useState(false);

  const todayTasks = useMemo(
    () =>
      [...tasks.filter((t) => t.isToday)].sort((a, b) => {
        const r = (p: TaskItem["priority"]) => (p === "High" ? 3 : p === "Medium" ? 2 : 1);
        return r(b.priority) - r(a.priority);
      }),
    [tasks],
  );
  const big3 = todayTasks.slice(0, 3);
  const extras = todayTasks.slice(3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-ink">Today</h2>
          <p className="text-sm text-muted-foreground">Pick three. Move them. Close the day.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/import-tasks">
              <FileUp className="mr-1 h-4 w-4" /> Import Tasks
            </Link>
          </Button>
          <Button
            onClick={() => {
              setEditing(null);
              setDlgOpen(true);
            }}
          >
            <Plus className="mr-1 h-4 w-4" /> Add Task
          </Button>
          <Button variant="default" onClick={() => setConfirmEnd(true)}>
            End Day & Rollover
          </Button>
        </div>
      </div>

      {/* Big 3 hero cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => {
          const t = big3[i];
          if (!t) {
            return (
              <Card key={i} className="flex h-44 items-center justify-center border-dashed">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditing(null);
                    setDlgOpen(true);
                  }}
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Big 3 task
                </Button>
              </Card>
            );
          }
          return (
            <Card key={t.id} className="relative h-full">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start gap-3">
                  <Checkbox checked={t.isDone} onCheckedChange={() => toggleDone(t.id)} className="mt-1" />
                  <div className="flex-1">
                    <div className={`font-display text-lg leading-snug text-ink ${t.isDone ? "line-through opacity-60" : ""}`}>
                      {t.title}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      <AreaPill area={t.branch} />
                      {t.project && <span>· {t.project}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <PriorityBadge priority={t.priority} />
                  <StatusBadge status={t.status} />
                </div>
                {t.notes && <p className="text-sm text-muted-foreground">{t.notes}</p>}
                <div className="flex items-center justify-end gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditing(t);
                      setDlgOpen(true);
                    }}
                  >
                    <Pencil className="mr-1 h-3 w-3" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => removeFromToday(t.id)}>
                    <X className="mr-1 h-3 w-3" /> Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Extra tasks */}
      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-plum-deep">Extra Tasks</h3>
        <TaskTable
          tasks={extras}
          onToggle={toggleDone}
          onEdit={(t) => {
            setEditing(t);
            setDlgOpen(true);
          }}
          onDelete={deleteTask}
          emptyLabel="No extra Today tasks."
        />
      </div>

      <TaskDialog
        open={dlgOpen}
        onOpenChange={setDlgOpen}
        initial={editing ?? { isToday: true }}
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

      <AlertDialog open={confirmEnd} onOpenChange={setConfirmEnd}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">End the day?</AlertDialogTitle>
            <AlertDialogDescription>
              End today and roll unfinished tasks forward?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not yet</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                endDayRollover();
                toast.success("Day closed. Unfinished tasks rolled forward.");
              }}
            >
              End Day
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
