import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import type { WeeklyFocus } from "@/lib/types";
import { Input } from "@/components/ui/input";

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
      <CardContent className="space-y-2">
        {focus.map((f) => (
          <div key={f.id} className="grid grid-cols-[120px_1fr] items-center gap-2 text-sm">
            <span className="text-muted-foreground">{f.label}:</span>
            <Input
              value={f.value}
              onChange={(e) => onUpdate(f.id, e.target.value)}
              className="h-8 border-transparent bg-transparent px-1.5 font-medium text-ink shadow-none hover:border-border focus-visible:border-input"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
