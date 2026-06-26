import { useEffect, useState } from "react";
import { Target, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCompanyGoal } from "@/hooks/useCompanyGoal";

export function CompanyGoalCard() {
  const { goal, updateGoal, clearGoal } = useCompanyGoal();
  const [title, setTitle] = useState(goal.title);
  const [notes, setNotes] = useState(goal.notes);

  useEffect(() => {
    setTitle(goal.title);
    setNotes(goal.notes);
  }, [goal.title, goal.notes]);

  return (
    <section className="planner-card rounded-2xl p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-ink">
            <Target className="h-4 w-4 text-gold" />
            Current Company Goal
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">One active goal at a time. The Decision Engine prioritizes it first.</p>
        </div>
        {goal.title && (
          <Button variant="ghost" size="sm" onClick={clearGoal}>
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)_auto] lg:items-start">
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Example: Finish Why Do Men Come Back"
          className="bg-warm-white/80"
        />
        <Textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Why this matters right now"
          rows={2}
          className="min-h-16 bg-warm-white/80"
        />
        <Button
          onClick={() => {
            updateGoal({ title: title.trim(), notes });
            toast.success("Company goal updated.");
          }}
        >
          Save Goal
        </Button>
      </div>
    </section>
  );
}
