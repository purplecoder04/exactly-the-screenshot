import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowRightToLine, Filter, Pencil, Plus, Sprout, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PriorityBadge } from "@/components/shared/Badges";
import { AreaPill } from "@/components/shared/AreaPill";
import { FilterBar, EMPTY_FILTERS, type Filters } from "@/components/shared/FilterBar";
import { ParkingLotDialog } from "@/components/shared/ParkingLotDialog";
import { PlannerPageHeader, PlannerPanel } from "@/components/shared/PlannerPageHeader";
import { useParkingLot } from "@/hooks/useParkingLot";
import { useTasks } from "@/hooks/useTasks";
import { plannerAssets } from "@/lib/plannerAssets";
import { PARKING_LOT_DECISIONS, type ParkingLotItem } from "@/lib/types";

export const Route = createFileRoute("/parking-lot")({
  head: () => ({
    meta: [
      { title: "Idea Garden - Best Collective" },
      { name: "description", content: "A soft place to plant ideas before they become active work." },
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
      items.filter((item) => {
        if (filters.area !== "all" && item.branch !== filters.area) return false;
        if (filters.priority !== "all" && item.priority !== filters.priority) return false;
        if (decisionFilter !== "all" && item.decision !== decisionFilter) return false;
        return true;
      }),
    [items, filters, decisionFilter],
  );

  return (
    <div className="space-y-6">
      <PlannerPageHeader
        eyebrow="Idea Garden"
        title="Idea Garden"
        description="Plant thoughts here without forcing them into active work. Keep, maybe, or move them when they are ready."
        decorAsset={plannerAssets.jarGarden}
        decorClassName="right-10 top-3 h-36 w-36 opacity-35"
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="mr-1 h-4 w-4" /> Add Idea
          </Button>
        }
      >
        <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
          <GardenStat value={items.length} label="ideas planted" />
          <GardenStat value={items.filter((item) => item.decision === "Keep").length} label="marked keep" />
          <GardenStat value={items.filter((item) => item.decision === "Later").length} label="saved for later" />
        </div>
      </PlannerPageHeader>

      <PlannerPanel
        title="Garden Filters"
        description="Sort seeds by branch, priority, and decision."
        action={<Filter className="h-5 w-5 text-gold" />}
      >
        <div className="flex flex-wrap items-center gap-2">
          <FilterBar value={{ ...filters, status: "all" }} onChange={(filter) => setFilters({ ...filter, status: "all" })} />
          <Select value={decisionFilter} onValueChange={setDecisionFilter}>
            <SelectTrigger className="h-9 w-[170px] bg-card/80">
              <SelectValue placeholder="Decision" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All decisions</SelectItem>
              {PARKING_LOT_DECISIONS.map((decision) => (
                <SelectItem key={decision} value={decision}>
                  {decision}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PlannerPanel>

      <PlannerPanel title="Planted Ideas" description="Review, edit, prune, or turn an idea into an active dashboard task.">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-plum-soft/25 bg-card/70 p-8 text-center text-sm text-muted-foreground">
            No ideas match these filters.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <article key={item.id} className="planner-soft-hover rounded-2xl border border-border/80 bg-card/90 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <AreaPill area={item.branch} />
                      <PriorityBadge priority={item.priority} />
                      <DecisionBadge decision={item.decision} />
                    </div>
                    <h3 className="text-base font-semibold leading-snug text-ink break-words">{item.idea}</h3>
                  </div>
                  <Sprout className="mt-1 h-5 w-5 shrink-0 text-sage" />
                </div>

                <div className="mt-3 grid gap-2 text-xs leading-relaxed text-muted-foreground">
                  <p>
                    <span className="font-semibold text-ink">Type:</span> {item.type}
                  </p>
                  <p>
                    <span className="font-semibold text-ink">Created:</span>{" "}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <p className="break-words">
                    <span className="font-semibold text-ink">Notes:</span> {item.notes || "No notes yet."}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap justify-end gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    title="Move to active tasks"
                    onClick={() => {
                      addTask({
                        title: item.idea,
                        branch: item.branch,
                        areaType: item.areaType,
                        type: item.type,
                        status: "Idea",
                        priority: item.priority,
                        notes: item.notes,
                      });
                      deleteItem(item.id);
                      toast.success("Idea moved to active tasks.");
                    }}
                  >
                    <ArrowRightToLine className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    title="Edit idea"
                    onClick={() => {
                      setEditing(item);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" title="Delete idea" onClick={() => deleteItem(item.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </PlannerPanel>

      <ParkingLotDialog
        open={open}
        onOpenChange={setOpen}
        initial={editing ?? undefined}
        onSubmit={(data) => {
          if (editing) {
            updateItem(editing.id, data);
            toast.success("Idea updated.");
          } else {
            addItem(data);
            toast.success("Idea planted.");
          }
        }}
      />
    </div>
  );
}

function GardenStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-3">
      <span className="font-semibold text-ink">{value}</span> {label}
    </div>
  );
}

function DecisionBadge({ decision }: { decision: ParkingLotItem["decision"] }) {
  const map: Record<ParkingLotItem["decision"], string> = {
    Keep: "bg-sage/25 text-ink",
    Maybe: "bg-gold/25 text-ink",
    Later: "bg-lavender/50 text-ink",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[decision]}`}>{decision}</span>;
}
