import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import type { WeeklyFocus } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";

export function WeekFocusCard({
  focus,
  onUpdate,
}: {
  focus: WeeklyFocus[];
  onUpdate: (id: string, value: string) => void;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-plum-deep">
          <Target className="h-4 w-4 text-plum-soft" />
          This Week's Focus
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {focus.map((f) => (
          <div key={f.id} className="flex min-w-0 flex-col gap-1 text-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground break-words">
              {f.label}
            </span>
            <Textarea
              value={f.value}
              onChange={(e) => onUpdate(f.id, e.target.value)}
              rows={1}
              className="min-h-10 resize-none border-transparent bg-transparent px-1.5 py-1 text-sm font-medium leading-snug text-ink shadow-none [field-sizing:content] hover:border-border focus-visible:border-input"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
