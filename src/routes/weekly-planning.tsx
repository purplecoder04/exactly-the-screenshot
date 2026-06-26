import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { CalendarClock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlannerPageHeader, PlannerPanel } from "@/components/shared/PlannerPageHeader";
import { useWeeklyPlanning } from "@/hooks/useWeeklyPlanning";
import { plannerAssets } from "@/lib/plannerAssets";

export const Route = createFileRoute("/weekly-planning")({
  head: () => ({
    meta: [
      { title: "Weekly Planning - Best Collective" },
      { name: "description", content: "Plan the week so the Decision Engine can recommend smarter daily priorities." },
    ],
  }),
  component: WeeklyPlanningPage,
});

function WeeklyPlanningPage() {
  const { plan, updatePlan } = useWeeklyPlanning();

  const setProject = (index: number, value: string) => {
    const next = [...plan.topProjects];
    next[index] = value;
    updatePlan({ topProjects: next });
  };

  return (
    <div className="space-y-6">
      <PlannerPageHeader
        eyebrow="CEO Planning"
        title="Weekly Planning"
        description="Set the weekly goal, Top 3 projects, biggest risk, waiting-on list, and success definition. The Decision Engine references this every morning."
        decorAsset={plannerAssets.goldSparkles}
        decorClassName="right-12 top-8 h-24 w-24 opacity-30"
        actions={
          <Button onClick={() => toast.success("Weekly plan saved locally.")}>
            <Save className="mr-1 h-4 w-4" />
            Save Plan
          </Button>
        }
      />

      <PlannerPanel title="This Week" description="Only one weekly plan is active at a time. Edits save locally as you work.">
        <div className="grid gap-4">
          <Field label="Weekly Goal">
            <Textarea
              value={plan.weeklyGoal}
              rows={3}
              onChange={(event) => updatePlan({ weeklyGoal: event.target.value })}
              placeholder="What would make this week a meaningful company win?"
            />
          </Field>

          <div className="grid gap-3 md:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <Field key={index} label={`Top Project ${index + 1}`}>
                <Input
                  value={plan.topProjects[index] ?? ""}
                  onChange={(event) => setProject(index, event.target.value)}
                  placeholder="Project name"
                />
              </Field>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Biggest Risk">
              <Textarea value={plan.biggestRisk} rows={4} onChange={(event) => updatePlan({ biggestRisk: event.target.value })} />
            </Field>
            <Field label="Waiting On">
              <Textarea value={plan.waitingOn} rows={4} onChange={(event) => updatePlan({ waitingOn: event.target.value })} />
            </Field>
            <Field label="Success This Week">
              <Textarea value={plan.successThisWeek} rows={4} onChange={(event) => updatePlan({ successThisWeek: event.target.value })} />
            </Field>
          </div>

          <div className="rounded-2xl border border-border/70 bg-warm-white/70 p-4 text-sm text-ink">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <CalendarClock className="h-4 w-4 text-gold" />
              Decision Engine inputs
            </div>
            <p className="leading-relaxed text-muted-foreground">
              Tasks matching the weekly goal or Top 3 projects receive extra priority in Today's Mission. Waiting-on and risk language also helps identify blocking work.
            </p>
          </div>
        </div>
      </PlannerPanel>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
