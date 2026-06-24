import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, CheckCircle2, RotateCcw } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useWeeklyNotes } from "@/hooks/useWeeklyData";
import { AreaPill } from "@/components/shared/AreaPill";
import { ALL_AREAS, areaTypeFor, type WeeklyNote, type WorkspaceArea } from "@/lib/types";

export const Route = createFileRoute("/weekly-log")({
  head: () => ({
    meta: [
      { title: "Weekly Log — Best Collective" },
      { name: "description", content: "Review progress and capture weekly notes." },
    ],
  }),
  component: WeeklyLogPage,
});

function WeeklyLogPage() {
  const { tasks } = useTasks();
  const { notes, addNote, updateNote, deleteNote } = useWeeklyNotes();

  const completedByDay = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const completed = tasks
      .filter((t) => t.isDone && t.completedAt && new Date(t.completedAt).getTime() >= cutoff)
      .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
    const grouped = new Map<string, typeof completed>();
    for (const t of completed) {
      const day = (t.completedAt ?? "").slice(0, 10);
      if (!grouped.has(day)) grouped.set(day, []);
      grouped.get(day)!.push(t);
    }
    return grouped;
  }, [tasks]);

  const rollovers = useMemo(
    () => tasks.filter((t) => !t.isDone && (t.rolloverCount ?? 0) > 0).sort((a, b) => (b.rolloverCount ?? 0) - (a.rolloverCount ?? 0)),
    [tasks],
  );

  const [noteOpen, setNoteOpen] = useState(false);
  const [editing, setEditing] = useState<WeeklyNote | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl text-ink">Weekly Log</h2>
          <p className="text-sm text-muted-foreground">What got done, what's still moving, and your weekly notes.</p>
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-plum-deep">
              <CheckCircle2 className="h-4 w-4 text-green-muted" />
              Completed — Last 7 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completedByDay.size === 0 && <p className="text-sm text-muted-foreground">No completions in the last 7 days.</p>}
            <div className="space-y-4">
              {[...completedByDay.entries()].map(([day, items]) => (
                <div key={day}>
                  <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric" }).format(new Date(day))}
                  </div>
                  <ul className="space-y-1.5">
                    {items.map((t) => (
                      <li key={t.id} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-muted" />
                        <span className="flex-1 text-ink">{t.title}</span>
                        <AreaPill area={t.branch} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-plum-deep">
              <RotateCcw className="h-4 w-4 text-priority-high" />
              Rollovers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rollovers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing rolled over. Clean slate.</p>
            ) : (
              <ul className="space-y-2">
                {rollovers.map((t) => (
                  <li key={t.id} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-priority-high/20 px-1.5 text-[11px] font-semibold text-priority-high">
                      ×{t.rolloverCount}
                    </span>
                    <span className="flex-1 text-ink">{t.title}</span>
                    <AreaPill area={t.branch} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="mb-3 font-display text-2xl text-ink">Weekly Notes</h3>
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notes yet. Capture what mattered this week.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((n) => (
              <Card key={n.id}>
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-display text-lg text-ink">{n.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(n.date))}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditing(n); setNoteOpen(true); }}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => deleteNote(n.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <AreaPill area={n.branch} />
                  <p className="text-sm text-ink whitespace-pre-wrap">{n.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <NoteDialog
        open={noteOpen}
        onOpenChange={setNoteOpen}
        initial={editing}
        onSubmit={(d) => {
          if (editing) {
            updateNote(editing.id, { ...d, areaType: areaTypeFor(d.branch) });
            toast.success("Note updated.");
          } else {
            addNote(d);
            toast.success("Note added.");
          }
        }}
      />
    </div>
  );
}

function NoteDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial: WeeklyNote | null;
  onSubmit: (d: { title: string; branch: WorkspaceArea; note: string; date: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [branch, setBranch] = useState<WorkspaceArea>("Brand");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? "");
    setBranch(initial?.branch ?? "Brand");
    setNote(initial?.note ?? "");
    setDate(initial?.date ?? new Date().toISOString().slice(0, 10));
  }, [open, initial]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{initial ? "Edit Note" : "Add Weekly Note"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Branch / Area</Label>
              <Select value={branch} onValueChange={(v) => setBranch(v as WorkspaceArea)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_AREAS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Note</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
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
