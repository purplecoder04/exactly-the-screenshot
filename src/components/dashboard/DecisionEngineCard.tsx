import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { ArrowRight, Brain, ClipboardCheck, Play, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PriorityBadge, StatusBadge } from "@/components/shared/Badges";
import { AreaPill } from "@/components/shared/AreaPill";
import { useContinueWorking } from "@/hooks/useContinueWorking";
import { useDecisionItems } from "@/hooks/useDecisionItems";
import { useDecisionSupport } from "@/hooks/useDecisionSupport";
import { useParkingLot } from "@/hooks/useParkingLot";
import { useTasks } from "@/hooks/useTasks";
import { useWeeklyPlanning } from "@/hooks/useWeeklyPlanning";
import { scoreDecision } from "@/lib/decisionSupport";
import { recommendTopTasks, type DecisionRecommendation } from "@/lib/decisionEngine";
import { ALL_AREAS, type DecisionItem, type DecisionSupportItem, type WorkspaceArea } from "@/lib/types";

const AREA_ROUTES = {
  Brand: "/brand",
  Rise: "/rise",
  Land: "/land",
  Rebuild: "/rebuild",
  "Meet at the Heal": "/meet-at-the-heal",
  "Kit Factory App": "/kit-factory-app",
  "Social Media App": "/social-media-app",
  Website: "/website",
  "Social Media": "/social-media",
} as const;

export function DecisionEngineCard() {
  const navigate = useNavigate();
  const { tasks, addTask, moveToToday } = useTasks();
  const { addItem } = useParkingLot();
  const { plan } = useWeeklyPlanning();
  const { rememberTask } = useContinueWorking();
  const { decisions, addDecision } = useDecisionSupport();
  const { items: decisionItems, recordRecommendations } = useDecisionItems();
  const recommendations = recommendTopTasks({ tasks, weeklyPlan: plan });
  const [decisionForm, setDecisionForm] = useState({
    title: "",
    context: "",
    branch: "Brand" as WorkspaceArea,
    urgency: 3,
    impact: 3,
    effort: 2,
    clarity: 3,
    reversible: true,
  });
  const [latestDecision, setLatestDecision] = useState<DecisionSupportItem | null>(null);

  const decisionScore = useMemo(() => scoreDecision(decisionForm), [decisionForm]);

  const acceptPlan = async () => {
    recommendations.forEach((item) => moveToToday(item.task.id));
    await recordRecommendations(recommendations, "accepted");
    toast.success("Today's plan accepted. Your Top 3 are marked for Today.");
  };

  const customizePlan = async () => {
    if (recommendations.length > 0) {
      await recordRecommendations(recommendations, "pending");
    }
    await navigate({ to: "/today" });
  };

  const saveDecision = () => {
    if (!decisionForm.title.trim()) {
      toast.info("Add the decision first.");
      return;
    }

    const saved = addDecision({
      ...decisionForm,
      title: decisionForm.title.trim(),
      context: decisionForm.context.trim(),
      score: decisionScore.score,
      outcome: decisionScore.outcome,
      notes: decisionScore.reason,
    });
    setLatestDecision(saved);
    toast.success(`Decision scored: ${decisionScore.outcome}.`);
  };

  const convertDecisionToTask = (decision: DecisionSupportItem) => {
    addTask({
      title: decision.title,
      branch: decision.branch,
      type: "Task",
      status: "Idea",
      priority: decision.outcome === "Do Now" ? "High" : "Medium",
      nextStep: decision.context,
      notes: `Decision Engine: ${decision.outcome}\nScore: ${decision.score}\n${decision.notes}`,
      isToday: decision.outcome === "Do Now",
      isDone: false,
    });
    toast.success("Decision converted into a task.");
  };

  const convertDecisionToIdea = (decision: DecisionSupportItem) => {
    addItem({
      idea: decision.title,
      branch: decision.branch,
      type: "Task",
      priority: decision.score >= 58 ? "Medium" : "Low",
      decision: decision.outcome === "Park" ? "Later" : "Maybe",
      notes: `Decision Engine: ${decision.outcome}\nScore: ${decision.score}\n${decision.context}\n${decision.notes}`,
    });
    toast.success("Decision sent to Idea Garden.");
  };

  return (
    <section className="planner-card rounded-2xl p-4 md:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-ink">
            <Brain className="h-4 w-4 text-gold" />
            Today's Mission
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Recommended Top 3 based on priority, rollovers, blockers, weekly planning, progress
            state, and company impact.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button disabled={recommendations.length === 0} onClick={() => void acceptPlan()}>
            Accept Today's Plan
          </Button>
          <Button variant="outline" onClick={() => void customizePlan()}>
            <SlidersHorizontal className="mr-1 h-4 w-4" />
            Customize Today's Plan
          </Button>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-plum-soft/25 bg-card/70 p-8 text-center text-sm text-muted-foreground">
          No active tasks to recommend yet. Add tasks or import a work session.
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-3">
          {recommendations.map((recommendation, index) => (
            <RecommendationCard
              key={recommendation.task.id}
              recommendation={recommendation}
              index={index}
              onStart={rememberTask}
            />
          ))}
        </div>
      )}

      <DecisionHistory items={decisionItems} />

      <div className="mt-5 rounded-2xl border border-paper-line bg-warm-white/70 p-4">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-ink">
              <ClipboardCheck className="h-4 w-4 text-gold" />
              Decision Support
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Score a choice, then turn the result into a task or Idea Garden item.
            </p>
          </div>
          <span className="rounded-full bg-lavender/35 px-3 py-1 text-xs font-semibold text-plum-deep">
            {decisions.length} saved
          </span>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="grid gap-3">
            <DecisionField label="Decision">
              <Input
                value={decisionForm.title}
                onChange={(event) =>
                  setDecisionForm((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="What choice needs support?"
              />
            </DecisionField>
            <DecisionField label="Context">
              <Textarea
                value={decisionForm.context}
                rows={3}
                onChange={(event) =>
                  setDecisionForm((current) => ({ ...current, context: event.target.value }))
                }
                placeholder="What do you know, what is waiting, or what would change?"
              />
            </DecisionField>
            <div className="grid gap-2 md:grid-cols-3">
              <DecisionField label="Branch">
                <Select
                  value={decisionForm.branch}
                  onValueChange={(value) =>
                    setDecisionForm((current) => ({ ...current, branch: value as WorkspaceArea }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_AREAS.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DecisionField>
              <ScoreSelect
                label="Urgency"
                value={decisionForm.urgency}
                onChange={(urgency) => setDecisionForm((current) => ({ ...current, urgency }))}
              />
              <ScoreSelect
                label="Impact"
                value={decisionForm.impact}
                onChange={(impact) => setDecisionForm((current) => ({ ...current, impact }))}
              />
              <ScoreSelect
                label="Effort"
                value={decisionForm.effort}
                onChange={(effort) => setDecisionForm((current) => ({ ...current, effort }))}
              />
              <ScoreSelect
                label="Clarity"
                value={decisionForm.clarity}
                onChange={(clarity) => setDecisionForm((current) => ({ ...current, clarity }))}
              />
              <DecisionField label="Reversible">
                <Select
                  value={decisionForm.reversible ? "yes" : "no"}
                  onValueChange={(value) =>
                    setDecisionForm((current) => ({ ...current, reversible: value === "yes" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Easy to adjust</SelectItem>
                    <SelectItem value="no">Hard to reverse</SelectItem>
                  </SelectContent>
                </Select>
              </DecisionField>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/80 p-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-plum-deep">
              Rule-based result
            </div>
            <div className="mt-2 font-display text-3xl text-plum-soft">{decisionScore.score}</div>
            <div className="text-base font-semibold text-ink">{decisionScore.outcome}</div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {decisionScore.reason}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={saveDecision}>
                Save Decision
              </Button>
              {latestDecision && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => convertDecisionToTask(latestDecision)}
                  >
                    Make Task
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => convertDecisionToIdea(latestDecision)}
                  >
                    Send to Idea Garden
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DecisionHistory({ items }: { items: DecisionItem[] }) {
  const visible = items.slice(0, 5);

  if (visible.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 rounded-2xl border border-paper-line bg-warm-white/70 p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-ink">
          Decision History
        </h3>
        <span className="text-xs font-semibold text-muted-foreground">
          {items.length} saved plan item{items.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="grid gap-2">
        {visible.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center gap-2 rounded-xl border border-border/70 bg-card/75 p-2 text-sm"
          >
            <span className="min-w-0 flex-1 font-semibold text-ink break-words">
              {item.title}
            </span>
            {item.relatedBranch && <AreaPill area={item.relatedBranch} />}
            <span className="rounded-full bg-lavender/35 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-plum-deep">
              {item.status}
            </span>
            <PriorityBadge priority={item.priority} />
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendationCard({
  recommendation,
  index,
  onStart,
}: {
  recommendation: DecisionRecommendation;
  index: number;
  onStart: (task: DecisionRecommendation["task"]) => void;
}) {
  const { task } = recommendation;
  const route = AREA_ROUTES[task.branch];

  return (
    <article className="planner-soft-hover flex min-h-80 flex-col rounded-2xl border border-paper-line bg-card/88 p-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-plum-deep text-sm font-bold text-white shadow-sm">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-snug text-ink break-words">
            {task.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <AreaPill area={task.branch} />
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border/70 bg-warm-white/65 p-3">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-plum-deep">
          Reason
        </div>
        <ul className="mt-2 space-y-1 text-sm text-ink">
          {recommendation.reasons.map((reason) => (
            <li key={reason} className="flex gap-2">
              <span className="text-gold">•</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl border border-border/70 bg-card/70 p-2">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Estimated Time
          </div>
          <div className="font-semibold text-ink">{recommendation.estimatedMinutes} min</div>
        </div>
        <div className="rounded-xl border border-border/70 bg-card/70 p-2">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Impact
          </div>
          <div className="font-semibold text-ink">{recommendation.impactLabel}</div>
        </div>
      </div>

      <Button asChild className="mt-auto">
        <Link to={route} onClick={() => onStart(task)}>
          <Play className="mr-1 h-4 w-4 fill-current" />
          Start Working
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </article>
  );
}

function DecisionField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function ScoreSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <DecisionField label={label}>
      <Select value={String(value)} onValueChange={(next) => onChange(Number(next))}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 - Low</SelectItem>
          <SelectItem value="2">2 - Light</SelectItem>
          <SelectItem value="3">3 - Medium</SelectItem>
          <SelectItem value="4">4 - High</SelectItem>
          <SelectItem value="5">5 - Critical</SelectItem>
        </SelectContent>
      </Select>
    </DecisionField>
  );
}
