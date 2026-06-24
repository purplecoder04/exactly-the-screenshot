import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "lucide-react";
import { CORE_BRANCHES, WORKSTREAMS, type TaskItem, type WorkspaceArea } from "@/lib/types";
import { AreaDot } from "@/components/shared/AreaPill";

function summarize(tasks: TaskItem[], area: WorkspaceArea): string {
  const scoped = tasks.filter((t) => t.branch === area);
  if (scoped.length === 0) return "—";
  const waiting = scoped.filter((t) => t.status === "Waiting").length;
  const inProgress = scoped.filter((t) => ["Writing", "Outline", "Testing"].includes(t.status)).length;
  if (waiting > 0 && waiting >= inProgress) return "Planning";
  if (inProgress > 0) return "In Progress";
  return "On Track";
}

export function QuickStatusCard({ tasks }: { tasks: TaskItem[] }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-plum-deep">
          <LineChart className="h-4 w-4 text-plum-soft" />
          Quick Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {CORE_BRANCHES.map((b) => (
          <Row key={b} name={b} status={summarize(tasks, b)} />
        ))}
        <div className="my-2 border-t border-dashed" />
        {WORKSTREAMS.map((w) => (
          <Row key={w} name={w} status={summarize(tasks, w)} />
        ))}
      </CardContent>
    </Card>
  );
}

function Row({ name, status }: { name: WorkspaceArea; status: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <div className="flex items-center gap-2 text-ink">
        <AreaDot area={name} />
        <span>{name}</span>
      </div>
      <span className="text-muted-foreground">{status}</span>
    </div>
  );
}
