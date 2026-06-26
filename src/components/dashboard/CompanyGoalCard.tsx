import { useEffect, useState } from "react";
import { ListPlus, Target, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCompanyGoal } from "@/hooks/useCompanyGoal";
import { useTasks } from "@/hooks/useTasks";
import type { WorkspaceArea } from "@/lib/types";

export function CompanyGoalCard() {
  const { goal, updateGoal, clearGoal } = useCompanyGoal();
  const { addTask } = useTasks();
  const [title, setTitle] = useState(goal.title);
  const [nextStep, setNextStep] = useState(goal.nextStep ?? "");
  const [notes, setNotes] = useState(goal.notes);

  useEffect(() => {
    setTitle(goal.title);
    setNextStep(goal.nextStep ?? "");
    setNotes(goal.notes);
  }, [goal.title, goal.nextStep, goal.notes]);

  const saveGoal = () => {
    updateGoal({ title: title.trim(), nextStep: nextStep.trim(), notes });
    toast.success("Company goal updated.");
  };

  const addNextStepToToday = () => {
    const cleanNextStep = nextStep.trim();
    const cleanTitle = title.trim();

    if (!cleanNextStep) {
      toast.info("Add a next step first.");
      return;
    }

    updateGoal({ title: cleanTitle, nextStep: cleanNextStep, notes });
    addTask({
      title: cleanNextStep,
      branch: inferGoalBranch(`${cleanTitle} ${cleanNextStep} ${notes}`),
      project: cleanTitle || "Current Company Goal",
      type: "Task",
      status: "Idea",
      priority: "High",
      nextStep: "",
      notes: [`Company Goal: ${cleanTitle || "Untitled goal"}`, notes].filter(Boolean).join("\n\n"),
      isToday: true,
      isDone: false,
    });
    toast.success("Goal next step added to Today.");
  };

  return (
    <section className="planner-card rounded-2xl p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-ink">
            <Target className="h-4 w-4 text-gold" />
            Current Company Goal
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            One active goal at a time. The Decision Engine prioritizes it first.
          </p>
        </div>
        {goal.title && (
          <Button variant="ghost" size="sm" onClick={clearGoal}>
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)] lg:items-start">
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
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
        <Input
          value={nextStep}
          onChange={(event) => setNextStep(event.target.value)}
          placeholder="Next step for this goal"
          className="bg-warm-white/80"
        />
        <Button variant="outline" onClick={addNextStepToToday} disabled={!nextStep.trim()}>
          <ListPlus className="mr-1 h-4 w-4" />
          Add Next Step to Today
        </Button>
        <Button onClick={saveGoal}>Save Goal</Button>
      </div>
    </section>
  );
}

function inferGoalBranch(value: string): WorkspaceArea {
  const lower = value.toLowerCase();
  if (/\brise\b|\bdating\b|\bwoman\b|\bwomen\b/.test(lower)) return "Rise";
  if (/\bland\b|\bmen\b/.test(lower)) return "Land";
  if (/\brebuild\b|\bresume\b/.test(lower)) return "Rebuild";
  if (/\bheal\b|\brelationship\b|\bcouple\b/.test(lower)) return "Meet at the Heal";
  if (/\bkit factory\b|\bworkbook\b|\bapp\b/.test(lower)) return "Kit Factory App";
  if (/\bsocial\b|\breel\b|\bvideo\b/.test(lower)) return "Social Media";
  if (/\bwebsite\b|\blanding page\b|\bshop\b/.test(lower)) return "Website";
  return "Brand";
}
