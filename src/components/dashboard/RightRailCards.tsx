import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { STATUSES, PRIORITIES } from "@/lib/types";
import { StatusDot } from "@/components/shared/Badges";

export function StatusKeyCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-plum-deep">
          Status Key
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-y-1.5 text-sm">
        {STATUSES.map((s) => (
          <div key={s} className="flex items-center gap-2 text-ink">
            <StatusDot status={s} />
            {s}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const PRIORITY_FILL: Record<(typeof PRIORITIES)[number], string> = {
  High: "fill-priority-high text-priority-high",
  Medium: "fill-priority-medium text-priority-medium",
  Low: "fill-priority-low text-priority-low",
};

export function PriorityKeyCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-plum-deep">
          Priority Key
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 text-sm">
        {PRIORITIES.map((p) => (
          <div key={p} className="flex items-center gap-2 text-ink">
            <Star className={`h-4 w-4 ${PRIORITY_FILL[p]}`} strokeWidth={1.5} />
            {p}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function HowToUseCard() {
  const steps = [
    "Start on Dashboard",
    "Pick only 3 priorities",
    "Work from Today tab",
    "Knock tasks out",
    "Review progress weekly",
  ];
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-plum-deep">
          How To Use
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-1 text-sm text-ink">
          {steps.map((s, i) => (
            <li key={s} className="flex gap-2">
              <span className="text-muted-foreground">{i + 1}.</span>
              {s}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
