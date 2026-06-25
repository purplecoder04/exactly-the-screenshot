import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ALL_AREAS,
  PARKING_LOT_DECISIONS,
  PRIORITIES,
  PROJECT_TYPES,
  areaTypeFor,
  type ParkingLotDecision,
  type ParkingLotItem,
  type Priority,
  type ProjectType,
  type WorkspaceArea,
} from "@/lib/types";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: Partial<ParkingLotItem>;
  onSubmit: (data: Partial<ParkingLotItem> & { idea: string; branch: WorkspaceArea }) => void;
};

export function ParkingLotDialog({ open, onOpenChange, initial, onSubmit }: Props) {
  const [idea, setIdea] = useState("");
  const [branch, setBranch] = useState<WorkspaceArea>("Brand");
  const [type, setType] = useState<ProjectType>("Idea");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [decision, setDecision] = useState<ParkingLotDecision>("Maybe");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setIdea(initial?.idea ?? "");
    setBranch(initial?.branch ?? "Brand");
    setType(initial?.type ?? "Idea");
    setPriority(initial?.priority ?? "Medium");
    setDecision(initial?.decision ?? "Maybe");
    setNotes(initial?.notes ?? "");
  }, [open, initial]);

  const submit = () => {
    if (!idea.trim()) return;
    onSubmit({
      idea: idea.trim(),
      branch,
      areaType: areaTypeFor(branch),
      type,
      priority,
      decision,
      notes,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {initial?.id ? "Edit Idea" : "Plant an Idea"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Idea</Label>
            <Input value={idea} onChange={(e) => setIdea(e.target.value)} />
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
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as ProjectType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
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
              <Label>Decision</Label>
              <Select value={decision} onValueChange={(v) => setDecision(v as ParkingLotDecision)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PARKING_LOT_DECISIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
