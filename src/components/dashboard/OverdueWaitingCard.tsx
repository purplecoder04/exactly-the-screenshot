import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowRight, Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import type { TaskItem } from "@/lib/types";

export function OverdueWaitingCard({
  tasks,
  onMoveToToday,
}: {
  tasks: TaskItem[];
  onMoveToToday: (id: string) => void;
}) {
  const items = tasks
    .filter((t) => !t.isDone && (t.status === "Waiting" || (t.rolloverCount ?? 0) > 0))
    .slice(0, 5);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-plum-deep">
          <Clock className="h-4 w-4 text-priority-high" />
          Overdue / Waiting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">All caught up. Nice work.</p>
        )}
        {items.map((t) => (
          <div key={t.id} className="group flex items-start gap-2 text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-priority-high" />
            <span className="flex-1 leading-snug text-ink">{t.title}</span>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-[11px] opacity-0 group-hover:opacity-100"
              onClick={() => onMoveToToday(t.id)}
            >
              Today
            </Button>
          </div>
        ))}
        <Link
          to="/today"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-plum-soft hover:text-plum-deep"
        >
          Go to Today <ArrowRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
