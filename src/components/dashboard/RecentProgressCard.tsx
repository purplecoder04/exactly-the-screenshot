import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { TaskItem } from "@/lib/types";

export function RecentProgressCard({ tasks }: { tasks: TaskItem[] }) {
  const recent = [...tasks]
    .filter((t) => t.isDone && t.completedAt)
    .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""))
    .slice(0, 5);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-plum-deep">
          <CheckCircle2 className="h-4 w-4 text-green-muted" />
          Recent Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {recent.length === 0 && (
          <p className="text-sm text-muted-foreground">Nothing completed recently.</p>
        )}
        {recent.map((t) => (
          <div key={t.id} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 fill-green-muted/20 text-green-muted" />
            <span className="leading-snug text-ink">{t.title}</span>
          </div>
        ))}
        <Link
          to="/weekly-log"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-plum-soft hover:text-plum-deep"
        >
          View Weekly Log <ArrowRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
