import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import { PriorityBadge } from "@/components/shared/Badges";
import type { TaskItem } from "@/lib/types";

export function TodaysBig3Card({ tasks }: { tasks: TaskItem[] }) {
  const big3 = [...tasks]
    .filter((t) => t.isToday && !t.isDone)
    .sort((a, b) => priorityRank(b.priority) - priorityRank(a.priority))
    .slice(0, 3);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-plum-deep">
          <Star className="h-4 w-4 fill-blush text-blush" />
          Today's Big 3
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {big3.length === 0 && (
          <p className="text-sm text-muted-foreground">No Today tasks yet. Pick three.</p>
        )}
        {big3.map((t, i) => (
          <div key={t.id} className="flex items-center gap-3 rounded-md bg-muted/40 px-3 py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-plum-soft/15 text-sm font-semibold text-plum-deep">
              {i + 1}
            </div>
            <div className="flex-1 text-sm font-medium leading-tight text-ink">{t.title}</div>
            <PriorityBadge priority={t.priority} />
          </div>
        ))}
        <Link to="/today" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-plum-soft hover:text-plum-deep">
          View Today <ArrowRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}

function priorityRank(p: TaskItem["priority"]) {
  return p === "High" ? 3 : p === "Medium" ? 2 : 1;
}
