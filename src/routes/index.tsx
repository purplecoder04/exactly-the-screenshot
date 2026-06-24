import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, ArrowRight, ClipboardList, Briefcase } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useParkingLot } from "@/hooks/useParkingLot";
import { useWeeklyFocus, useReminder } from "@/hooks/useWeeklyData";
import { TodaysBig3Card } from "@/components/dashboard/TodaysBig3Card";
import { WeekFocusCard } from "@/components/dashboard/WeekFocusCard";
import { QuickStatusCard } from "@/components/dashboard/QuickStatusCard";
import { FounderReminderCard } from "@/components/dashboard/FounderReminderCard";
import { RecentProgressCard } from "@/components/dashboard/RecentProgressCard";
import { OverdueWaitingCard } from "@/components/dashboard/OverdueWaitingCard";
import { AtAGlanceCard } from "@/components/dashboard/AtAGlanceCard";
import { StatusKeyCard, PriorityKeyCard, HowToUseCard } from "@/components/dashboard/RightRailCards";
import { QuoteStripFooter } from "@/components/dashboard/QuoteStripFooter";
import { TaskTable } from "@/components/shared/TaskTable";
import { PriorityBadge, StatusBadge } from "@/components/shared/Badges";
import { AreaPill } from "@/components/shared/AreaPill";
import { TaskDialog } from "@/components/shared/TaskDialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Best Collective CEO" },
      { name: "description", content: "Your command center for Best Collective. See today, focus, and progress at a glance." },
      { property: "og:title", content: "Best Collective CEO Dashboard" },
      { property: "og:description", content: "Your command center for Best Collective." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { tasks, addTask, toggleDone, moveToToday, endDayRollover, stats } = useTasks();
  const { items: parkingLot } = useParkingLot();
  const { focus, updateValue } = useWeeklyFocus();
  const { reminder, setReminder } = useReminder();

  const [addOpen, setAddOpen] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);

  const todayTasks = useMemo(() => tasks.filter((t) => t.isToday).slice(0, 5), [tasks]);
  const parkingPreview = parkingLot.slice(0, 5);

  const tiles = [
    { label: "Active Projects", value: stats.active, tint: "bg-lavender/40" },
    { label: "In Progress", value: stats.inProgress, tint: "bg-blush/40" },
    { label: "Waiting", value: stats.waiting, tint: "bg-status-waiting/25" },
    { label: "Testing", value: stats.testing, tint: "bg-status-testing/25" },
    { label: "Completed", value: stats.completed, tint: "bg-green-muted/30" },
    { label: "Ideas in Parking Lot", value: parkingLot.length, tint: "bg-gold/25" },
  ];

  return (
    <div className="space-y-5">
      {/* Top row: Big 3, Week Focus, Quick Status, Founder Reminder */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <TodaysBig3Card tasks={tasks} />
        <WeekFocusCard focus={focus} onUpdate={updateValue} />
        <QuickStatusCard tasks={tasks} />
        <FounderReminderCard reminder={reminder} onChange={setReminder} />
      </div>

      {/* Middle row: Recent, Overdue, AtAGlance, Right rail keys */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <RecentProgressCard tasks={tasks} />
        <OverdueWaitingCard tasks={tasks} onMoveToToday={moveToToday} />
        <AtAGlanceCard tiles={tiles} />
        <div className="space-y-4">
          <StatusKeyCard />
          <PriorityKeyCard />
        </div>
      </div>

      {/* Bottom row: Today checklist + Parking lot preview + How To Use */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-plum-deep">
              <ClipboardList className="h-4 w-4 text-plum-soft" />
              Today — Daily CEO Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TaskTable
              tasks={todayTasks}
              onToggle={toggleDone}
              emptyLabel="Nothing for today yet."
            />
            <div className="mt-3 flex items-center justify-between">
              <Button size="sm" onClick={() => setAddOpen(true)}>
                <Plus className="mr-1 h-4 w-4" /> Add Task
              </Button>
              <Button size="sm" variant="default" onClick={() => setConfirmEnd(true)}>
                End Day & Rollover
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-plum-deep">
              <Briefcase className="h-4 w-4 text-plum-soft" />
              Parking Lot — All Ideas Go Here
            </CardTitle>
          </CardHeader>
          <CardContent>
            {parkingPreview.length === 0 ? (
              <p className="text-sm text-muted-foreground">No ideas parked yet.</p>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-primary text-primary-foreground">
                    <tr className="text-left">
                      <th className="px-3 py-2 font-medium">Idea</th>
                      <th className="px-3 py-2 font-medium">Branch / Area</th>
                      <th className="px-3 py-2 font-medium">Type</th>
                      <th className="px-3 py-2 font-medium">Decision</th>
                      <th className="px-3 py-2 font-medium">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parkingPreview.map((p) => (
                      <tr key={p.id} className="border-t">
                        <td className="px-3 py-2 font-medium">{p.idea}</td>
                        <td className="px-3 py-2"><AreaPill area={p.branch} /></td>
                        <td className="px-3 py-2 text-muted-foreground">{p.type}</td>
                        <td className="px-3 py-2"><StatusBadge status="Idea" /></td>
                        <td className="px-3 py-2"><PriorityBadge priority={p.priority} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Link to="/parking-lot" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-plum-soft hover:text-plum-deep">
              Go to Parking Lot <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="lg:col-span-4">
          <HowToUseCard />
        </div>
      </div>

      <QuoteStripFooter />

      <TaskDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        initial={{ isToday: true }}
        onSubmit={(d) => {
          addTask(d);
          toast.success("Task added to Today.");
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
