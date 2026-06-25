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
import { CalendarCheck2, FileUp, Pencil, Plus, RotateCcw, X } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { PriorityBadge, StatusBadge } from "@/components/shared/Badges";
import { AreaPill } from "@/components/shared/AreaPill";
import { PlannerPageHeader, PlannerPanel } from "@/components/shared/PlannerPageHeader";
import { TaskChecklistCards } from "@/components/shared/TaskChecklistCards";
import { TaskDialog } from "@/components/shared/TaskDialog";
import type { TaskItem } from "@/lib/types";

export const Route = createFileRoute("/today")({
  head: () => ({
    meta: [
      { title: "Today - Best Collective" },
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
        const rank = (priority: TaskItem["priority"]) => (priority === "High" ? 3 : priority === "Medium" ? 2 : 1);
        return rank(b.priority) - rank(a.priority);
      }),
    [tasks],
  );
  const big3 = todayTasks.slice(0, 3);
  const extras = todayTasks.slice(3);
  const completed = todayTasks.filter((task) => task.isDone).length;

  return (
    <div className="space-y-6">
      <PlannerPageHeader
        eyebrow="Today & Focus"
        title="Today Daily CEO Checklist"
        description="Pick the few moves that matter, tend the extras, then close the day with a clean rollover."
        actions={
          <>
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
            <Button onClick={() => setConfirmEnd(true)}>
              <RotateCcw className="mr-1 h-4 w-4" /> End Day
            </Button>
          </>
        }
      >
        <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
          <TodayStat value={todayTasks.length} label="tasks marked for Today" />
          <TodayStat value={completed} label="completed" />
          <TodayStat value={todayTasks.length - completed} label="still blooming" />
        </div>
      </PlannerPageHeader>

      <PlannerPanel title="Today's Mission" description="Your top three Today tasks are promoted by priority.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[0, 1, 2].map((index) => {
            const task = big3[index];
            if (!task) {
              return (
                <Card key={index} className="flex min-h-48 items-center justify-center border-dashed bg-card/60">
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
              <Card key={task.id} className="planner-soft-hover h-full overflow-hidden">
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-plum-deep text-sm font-semibold text-white shadow-md">
                      {index + 1}
                    </span>
                    <Checkbox checked={task.isDone} onCheckedChange={() => toggleDone(task.id)} className="mt-1" />
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-base font-semibold leading-snug text-ink break-words ${
                          task.isDone ? "line-through opacity-60" : ""
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                        <AreaPill area={task.branch} />
                        {task.project && <span className="rounded-full bg-background/80 px-2 py-1">{task.project}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                  {task.notes && <p className="text-sm leading-relaxed text-muted-foreground break-words">{task.notes}</p>}

                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditing(task);
                        setDlgOpen(true);
                      }}
                    >
                      <Pencil className="mr-1 h-3 w-3" /> Edit
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => removeFromToday(task.id)}>
                      <X className="mr-1 h-3 w-3" /> Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </PlannerPanel>

      <PlannerPanel
        title="Supporting Tasks"
        description="Everything after the Big 3 stays visible as reviewable task cards."
        action={<CalendarCheck2 className="h-5 w-5 text-gold" />}
      >
        <TaskChecklistCards
          tasks={extras}
          onToggle={toggleDone}
          onEdit={(task) => {
            setEditing(task);
            setDlgOpen(true);
          }}
          onRemoveFromToday={removeFromToday}
          onDelete={deleteTask}
          emptyLabel="No extra Today tasks."
        />
      </PlannerPanel>

      <TaskDialog
        open={dlgOpen}
        onOpenChange={setDlgOpen}
        initial={editing ?? { isToday: true }}
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

      <AlertDialog open={confirmEnd} onOpenChange={setConfirmEnd}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">End the day?</AlertDialogTitle>
            <AlertDialogDescription>End today and roll unfinished tasks forward?</AlertDialogDescription>
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

function TodayStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-3">
      <span className="font-semibold text-ink">{value}</span> {label}
    </div>
  );
}
