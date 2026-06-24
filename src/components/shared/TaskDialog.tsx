import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ALL_AREAS,
  PRIORITIES,
  PROJECT_TYPES,
  STATUSES,
  areaTypeFor,
  type Priority,
  type ProjectType,
  type Status,
  type TaskItem,
  type WorkspaceArea,
} from "@/lib/types";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: Partial<TaskItem>;
  lockedBranch?: WorkspaceArea;
  onSubmit: (data: Partial<TaskItem> & { title: string; branch: WorkspaceArea }) => void;
  title?: string;
};

export function TaskDialog({ open, onOpenChange, initial, lockedBranch, onSubmit, title }: Props) {
  const [titleVal, setTitleVal] = useState("");
  const [branch, setBranch] = useState<WorkspaceArea>(lockedBranch ?? "Brand");
  const [project, setProject] = useState("");
  const [type, setType] = useState<ProjectType>("Task");
  const [status, setStatus] = useState<Status>("Idea");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [notes, setNotes] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitleVal(initial?.title ?? "");
    setBranch(lockedBranch ?? initial?.branch ?? "Brand");
    setProject(initial?.project ?? "");
    setType(initial?.type ?? "Task");
    setStatus(initial?.status ?? "Idea");
    setPriority(initial?.priority ?? "Medium");
    setNotes(initial?.notes ?? "");
    setNextStep(initial?.nextStep ?? "");
    setIsToday(initial?.isToday ?? false);
  }, [open, initial, lockedBranch]);

  const submit = () => {
    if (!titleVal.trim()) return;
    onSubmit({
      title: titleVal.trim(),
      branch,
      areaType: areaTypeFor(branch),
      project: project.trim() || undefined,
      type,
      status,
      priority,
      notes,
      nextStep,
      isToday,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{title ?? (initial?.id ? "Edit Task" : "Add Task")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Task title</Label>
            <Input value={titleVal} onChange={(e) => setTitleVal(e.target.value)} placeholder="What needs doing?" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Branch / Area</Label>
              <Select value={branch} onValueChange={(v) => setBranch(v as WorkspaceArea)} disabled={!!lockedBranch}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_AREAS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Project</Label>
              <Input value={project} onChange={(e) => setProject(e.target.value)} placeholder="Optional" />
            </div>
            <div className="grid gap-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as ProjectType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Next step</Label>
              <Input value={nextStep} onChange={(e) => setNextStep(e.target.value)} placeholder="Optional" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={isToday} onCheckedChange={(v) => setIsToday(!!v)} />
            <span>Mark for Today</span>
          </label>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
