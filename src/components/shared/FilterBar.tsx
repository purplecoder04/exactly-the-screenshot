import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ALL_AREAS, PRIORITIES, STATUSES, type Priority, type Status, type WorkspaceArea } from "@/lib/types";

export type Filters = {
  area: WorkspaceArea | "all";
  status: Status | "all";
  priority: Priority | "all";
};

export const EMPTY_FILTERS: Filters = { area: "all", status: "all", priority: "all" };

export function FilterBar({
  value,
  onChange,
  hideArea = false,
}: {
  value: Filters;
  onChange: (f: Filters) => void;
  hideArea?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {!hideArea && (
        <Select value={value.area} onValueChange={(v) => onChange({ ...value, area: v as Filters["area"] })}>
          <SelectTrigger className="h-9 w-[180px] bg-card"><SelectValue placeholder="Branch / Area" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branch / Area</SelectItem>
            {ALL_AREAS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
      )}
      <Select value={value.status} onValueChange={(v) => onChange({ ...value, status: v as Filters["status"] })}>
        <SelectTrigger className="h-9 w-[140px] bg-card"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={value.priority} onValueChange={(v) => onChange({ ...value, priority: v as Filters["priority"] })}>
        <SelectTrigger className="h-9 w-[140px] bg-card"><SelectValue placeholder="Priority" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
