import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ArrowRightToLine } from "lucide-react";
import { FilterBar, EMPTY_FILTERS, type Filters } from "@/components/shared/FilterBar";
import { ParkingLotDialog } from "@/components/shared/ParkingLotDialog";
import { PriorityBadge } from "@/components/shared/Badges";
import { AreaPill } from "@/components/shared/AreaPill";
import { useParkingLot } from "@/hooks/useParkingLot";
import { useTasks } from "@/hooks/useTasks";
import type { ParkingLotItem } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PARKING_LOT_DECISIONS } from "@/lib/types";

export const Route = createFileRoute("/parking-lot")({
  head: () => ({
    meta: [
      { title: "Parking Lot — Best Collective" },
      { name: "description", content: "All ideas go here. Decide later." },
    ],
  }),
  component: ParkingLotPage,
});

function ParkingLotPage() {
  const { items, addItem, updateItem, deleteItem } = useParkingLot();
  const { addTask } = useTasks();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [decisionFilter, setDecisionFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ParkingLotItem | null>(null);

  const filtered = useMemo(
    () =>
      items.filter((i) => {
        if (filters.area !== "all" && i.branch !== filters.area) return false;
        if (filters.priority !== "all" && i.priority !== filters.priority) return false;
        if (decisionFilter !== "all" && i.decision !== decisionFilter) return false;
        return true;
      }),
    [items, filters, decisionFilter],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl text-ink">Parking Lot</h2>
          <p className="text-sm text-muted-foreground">All ideas go here. No clutter on active work.</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="mr-1 h-4 w-4" /> Add Idea
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterBar value={{ ...filters, status: "all" }} onChange={(f) => setFilters({ ...f, status: "all" })} />
        <Select value={decisionFilter} onValueChange={setDecisionFilter}>
          <SelectTrigger className="h-9 w-[160px] bg-card"><SelectValue placeholder="Decision" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All decisions</SelectItem>
            {PARKING_LOT_DECISIONS.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-primary text-primary-foreground">
            <tr className="text-left">
              <th className="px-3 py-2.5 font-medium">Idea</th>
              <th className="px-3 py-2.5 font-medium">Branch / Area</th>
              <th className="px-3 py-2.5 font-medium">Type</th>
              <th className="px-3 py-2.5 font-medium">Priority</th>
              <th className="px-3 py-2.5 font-medium">Decision</th>
              <th className="px-3 py-2.5 font-medium">Notes</th>
              <th className="px-3 py-2.5 font-medium">Created</th>
              <th className="w-32 px-3 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">No ideas match.</td></tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="border-t hover:bg-muted/40">
                <td className="px-3 py-2 font-medium">{p.idea}</td>
                <td className="px-3 py-2"><AreaPill area={p.branch} /></td>
                <td className="px-3 py-2 text-muted-foreground">{p.type}</td>
                <td className="px-3 py-2"><PriorityBadge priority={p.priority} /></td>
                <td className="px-3 py-2"><DecisionBadge decision={p.decision} /></td>
                <td className="px-3 py-2 max-w-[14rem] truncate text-muted-foreground">{p.notes || "—"}</td>
                <td className="px-3 py-2 text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      title="Move to active tasks"
                      onClick={() => {
                        addTask({
                          title: p.idea,
                          branch: p.branch,
                          areaType: p.areaType,
                          type: p.type,
                          status: "Idea",
                          priority: p.priority,
                          notes: p.notes,
                        });
                        deleteItem(p.id);
                        toast.success("Moved to active tasks.");
                      }}
                    >
                      <ArrowRightToLine className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => {
                        setEditing(p);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => deleteItem(p.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ParkingLotDialog
        open={open}
        onOpenChange={setOpen}
        initial={editing ?? undefined}
        onSubmit={(d) => {
          if (editing) {
            updateItem(editing.id, d);
            toast.success("Idea updated.");
          } else {
            addItem(d);
            toast.success("Idea parked.");
          }
        }}
      />
    </div>
  );
}

function DecisionBadge({ decision }: { decision: ParkingLotItem["decision"] }) {
  const map: Record<ParkingLotItem["decision"], string> = {
    Keep: "bg-green-muted/30 text-ink",
    Maybe: "bg-gold/25 text-ink",
    Later: "bg-lavender/50 text-ink",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[decision]}`}>
      {decision}
    </span>
  );
}
