import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AreaPill } from "@/components/shared/AreaPill";
import { PlannerPageHeader, PlannerPanel } from "@/components/shared/PlannerPageHeader";
import { useTasks } from "@/hooks/useTasks";
import { useWeeklyNotes } from "@/hooks/useWeeklyData";
import { plannerAssets } from "@/lib/plannerAssets";
import { ALL_AREAS, areaTypeFor, type WeeklyNote, type WorkspaceArea } from "@/lib/types";

export const Route = createFileRoute("/weekly-log")({
  head: () => ({
    meta: [
      { title: "Weekly Log - Best Collective" },
      { name: "description", content: "Review progress and capture weekly notes." },
    ],
  }),
  component: WeeklyLogPage,
});

function WeeklyLogPage() {
  const { tasks } = useTasks();
  const [selectedWeekStart, setSelectedWeekStart] = useState(() => startOfWeekISO());
  const { notes, addNote, updateNote, deleteNote } = useWeeklyNotes(selectedWeekStart);
  const [noteOpen, setNoteOpen] = useState(false);
  const [editing, setEditing] = useState<WeeklyNote | null>(null);

  const completedByDay = useMemo(() => {
    const weekStart = new Date(`${selectedWeekStart}T00:00:00`).getTime();
    const weekEnd = weekStart + 7 * 24 * 60 * 60 * 1000;
    const completed = tasks
      .filter((task) => {
        if (!task.isDone || !task.completedAt) return false;
        const completedAt = new Date(task.completedAt).getTime();
        return completedAt >= weekStart && completedAt < weekEnd;
      })
      .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
    const grouped = new Map<string, typeof completed>();
    for (const task of completed) {
      const day = (task.completedAt ?? "").slice(0, 10);
      if (!grouped.has(day)) grouped.set(day, []);
      grouped.get(day)!.push(task);
    }
    return grouped;
  }, [selectedWeekStart, tasks]);

  const rollovers = useMemo(
    () =>
      tasks
        .filter((task) => !task.isDone && (task.rolloverCount ?? 0) > 0)
        .sort((a, b) => (b.rolloverCount ?? 0) - (a.rolloverCount ?? 0)),
    [tasks],
  );

  const completedCount = [...completedByDay.values()].reduce((sum, items) => sum + items.length, 0);

  return (
    <div className="space-y-6">
      <PlannerPageHeader
        eyebrow="Weekly Log"
        title="Weekly Log"
        description="Review what bloomed, what rolled over, and the notes you want to carry into the next week."
        decorAsset={plannerAssets.heartVine}
        decorClassName="right-10 top-12 h-20 w-56 opacity-30"
        actions={
          <div className="flex flex-wrap items-end gap-2">
            <div className="grid gap-1 text-left">
              <Label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Week Start
              </Label>
              <Input
                type="date"
                value={selectedWeekStart}
                onChange={(event) => setSelectedWeekStart(event.target.value)}
                className="h-9 w-40 bg-warm-white/85"
              />
            </div>
            <Button
              onClick={() => {
                setEditing(null);
                setNoteOpen(true);
              }}
            >
              <Plus className="mr-1 h-4 w-4" /> Add Note
            </Button>
          </div>
        }
      >
        <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
          <WeeklyStat value={completedCount} label="completed this week" />
          <WeeklyStat value={rollovers.length} label="rollover tasks" />
          <WeeklyStat value={notes.length} label="weekly notes" />
        </div>
      </PlannerPageHeader>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PlannerPanel title="Completed - Selected Week" description="A quick scan of finished work.">
          {completedByDay.size === 0 ? (
            <p className="text-sm text-muted-foreground">No completions for this selected week.</p>
          ) : (
            <div className="space-y-5">
              {[...completedByDay.entries()].map(([day, items]) => (
                <div key={day}>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {formatDisplayDate(day, { weekday: "long", month: "short", day: "numeric" })}
                  </div>
                  <ul className="space-y-2">
                    {items.map((task) => (
                      <li key={task.id} className="rounded-2xl border border-border/70 bg-card/75 p-3 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                          <span className="min-w-0 flex-1 text-ink break-words">{task.title}</span>
                          <AreaPill area={task.branch} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </PlannerPanel>

        <PlannerPanel title="Rollovers" description="Unfinished items that followed you into another day.">
          {rollovers.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing rolled over. Clean slate.</p>
          ) : (
            <ul className="space-y-2">
              {rollovers.map((task) => (
                <li key={task.id} className="rounded-2xl border border-border/70 bg-card/75 p-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-priority-high/20 px-1.5 text-[11px] font-semibold text-priority-high">
                      x{task.rolloverCount}
                    </span>
                    <span className="min-w-0 flex-1 text-ink break-words">{task.title}</span>
                    <AreaPill area={task.branch} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </PlannerPanel>
      </div>

      <PlannerPanel title="Weekly Notes" description="Capture decisions, lessons, and follow-up thoughts.">
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notes yet. Capture what mattered this week.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {notes.map((note) => (
              <Card key={note.id} className="planner-soft-hover">
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-display text-xl leading-tight text-ink break-words">{note.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {formatDisplayDate(note.date, { dateStyle: "medium" })}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditing(note);
                          setNoteOpen(true);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => deleteNote(note.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <AreaPill area={note.branch} />
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink break-words">{note.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PlannerPanel>

      <NoteDialog
        open={noteOpen}
        onOpenChange={setNoteOpen}
        initial={editing}
        defaultDate={selectedWeekStart}
        onSubmit={(data) => {
          if (editing) {
            updateNote(editing.id, { ...data, areaType: areaTypeFor(data.branch) });
            toast.success("Note updated.");
          } else {
            addNote(data);
            toast.success("Note added.");
          }
        }}
      />
    </div>
  );
}

function WeeklyStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-3">
      <span className="font-semibold text-ink">{value}</span> {label}
    </div>
  );
}

function startOfWeekISO(date = new Date()) {
  const start = new Date(date);
  const day = start.getDay();
  const daysSinceMonday = (day + 6) % 7;
  start.setDate(start.getDate() - daysSinceMonday);
  start.setHours(0, 0, 0, 0);
  return toDateInputValue(start);
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateInputValueToLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function formatDisplayDate(
  value: string,
  options: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat("en-US", options).format(dateInputValueToLocalDate(value));
}

function NoteDialog({
  open,
  onOpenChange,
  initial,
  defaultDate,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: WeeklyNote | null;
  defaultDate: string;
  onSubmit: (data: { title: string; branch: WorkspaceArea; note: string; date: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [branch, setBranch] = useState<WorkspaceArea>("Brand");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(() => toDateInputValue(new Date()));

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? "");
    setBranch(initial?.branch ?? "Brand");
    setNote(initial?.note ?? "");
    setDate(initial?.date ?? defaultDate);
  }, [open, initial, defaultDate]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{initial ? "Edit Note" : "Add Weekly Note"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Title</Label>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Branch / Area</Label>
              <Select value={branch} onValueChange={(value) => setBranch(value as WorkspaceArea)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_AREAS.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Week Start</Label>
              <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Note</Label>
            <Textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!title.trim()) return;
              onSubmit({ title: title.trim(), branch, note, date });
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
