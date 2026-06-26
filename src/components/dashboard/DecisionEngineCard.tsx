import { Link } from "@tanstack/react-router";
import { ArrowRight, Brain, Play, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PriorityBadge, StatusBadge } from "@/components/shared/Badges";
import { AreaPill } from "@/components/shared/AreaPill";
import { useCompanyGoal } from "@/hooks/useCompanyGoal";
import { useContinueWorking } from "@/hooks/useContinueWorking";
import { useTasks } from "@/hooks/useTasks";
import { useWeeklyPlanning } from "@/hooks/useWeeklyPlanning";
import { recommendTopTasks, type DecisionRecommendation } from "@/lib/decisionEngine";

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
  const { tasks, moveToToday } = useTasks();
  const { goal } = useCompanyGoal();
  const { plan } = useWeeklyPlanning();
  const { rememberTask } = useContinueWorking();
  const recommendations = recommendTopTasks({ tasks, companyGoal: goal, weeklyPlan: plan });

  const acceptPlan = () => {
    recommendations.forEach((item) => moveToToday(item.task.id));
    toast.success("Today's plan accepted. Your Top 3 are marked for Today.");
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
            Recommended Top 3 based on priority, rollovers, blockers, weekly planning, progress state, and company impact.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button disabled={recommendations.length === 0} onClick={acceptPlan}>
            Accept Today's Plan
          </Button>
          <Button asChild variant="outline">
            <Link to="/today">
              <SlidersHorizontal className="mr-1 h-4 w-4" />
              Customize Today's Plan
            </Link>
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
            <RecommendationCard key={recommendation.task.id} recommendation={recommendation} index={index} onStart={rememberTask} />
          ))}
        </div>
      )}
    </section>
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
          <h3 className="text-base font-semibold leading-snug text-ink break-words">{task.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <AreaPill area={task.branch} />
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border/70 bg-warm-white/65 p-3">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-plum-deep">Reason</div>
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
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Estimated Time</div>
          <div className="font-semibold text-ink">{recommendation.estimatedMinutes} min</div>
        </div>
        <div className="rounded-xl border border-border/70 bg-card/70 p-2">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Impact</div>
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
