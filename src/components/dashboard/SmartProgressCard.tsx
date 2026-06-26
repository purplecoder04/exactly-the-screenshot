import { BarChart3 } from "lucide-react";
import { useFrameworkLibrary } from "@/hooks/useFrameworkLibrary";
import { useProductCatalog } from "@/hooks/useProductCatalog";
import { useTasks } from "@/hooks/useTasks";
import { useWeeklyPlanning } from "@/hooks/useWeeklyPlanning";
import { CORE_BRANCHES, type TaskItem } from "@/lib/types";

export function SmartProgressCard() {
  const { tasks } = useTasks();
  const { products } = useProductCatalog();
  const { frameworks } = useFrameworkLibrary();
  const { plan } = useWeeklyPlanning();

  const booksCompleted = products.filter(
    (product) => product.type === "Book" && product.status === "Complete",
  ).length;
  const booksInProgress = products.filter(
    (product) => product.type === "Book" && product.status === "Building",
  ).length;
  const apps = products.filter((product) => product.type === "App" || product.app).length;
  const quizzes = products.filter((product) => product.quiz).length;
  const bundles = products.filter((product) => product.type === "Bundle" || product.bundle).length;
  const completedTasks = tasks.filter((task) => task.isDone).length;
  const completedThisWeek = tasks.filter(isCompletedThisWeek);
  const staleHighPriority = tasks.filter(
    (task) =>
      !task.isDone && task.priority === "High" && daysSince(task.updatedAt || task.createdAt) >= 7,
  );
  const rolloverHeavy = tasks.filter((task) => !task.isDone && (task.rolloverCount ?? 0) >= 2);
  const waitingItems = tasks.filter((task) => !task.isDone && task.status === "Waiting");
  const weeklyPriorityTasks = tasks.filter((task) => taskMatchesWeeklyPlan(task, plan));
  const weeklyPriorityDone = weeklyPriorityTasks.filter((task) => task.isDone).length;
  const weeklyPriorityProgress = Math.round(
    (weeklyPriorityDone / Math.max(weeklyPriorityTasks.length, 1)) * 100,
  );
  const productProgress = Math.round(
    (products.filter((product) => product.status === "Complete" || product.status === "Active")
      .length /
      Math.max(products.length, 1)) *
      100,
  );
  const frameworkProgress = Math.round(
    (frameworks.filter((framework) => framework.status === "Active").length /
      Math.max(frameworks.length, 1)) *
      100,
  );
  const overall = Math.round(
    ((completedTasks + products.filter((product) => product.status === "Complete").length) /
      Math.max(tasks.length + products.length, 1)) *
      100,
  );

  return (
    <section className="planner-card rounded-2xl p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-ink">
        <BarChart3 className="h-4 w-4 text-gold" />
        Smart Progress
      </h2>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <ProgressMetric label="Books Completed" value={booksCompleted} />
        <ProgressMetric label="Books In Progress" value={booksInProgress} />
        <ProgressMetric label="Apps" value={apps} />
        <ProgressMetric label="Quizzes" value={quizzes} />
        <ProgressMetric label="Frameworks" value={frameworks.length} />
        <ProgressMetric label="Bundles" value={bundles} />
        <ProgressMetric label="Completed This Week" value={completedThisWeek.length} />
        <ProgressMetric label="Waiting Items" value={waitingItems.length} />
      </div>
      <div className="mt-4 rounded-2xl border border-border/70 bg-warm-white/65 p-3">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold text-ink">Overall Best Collective Progress</span>
          <span className="font-display text-2xl text-plum-soft">{overall}%</span>
        </div>
        <div className="mt-3 grid gap-2">
          {CORE_BRANCHES.map((branch) => {
            const branchTasks = tasks.filter((task) => task.branch === branch);
            const done = branchTasks.filter((task) => task.isDone).length;
            const percent = Math.round((done / Math.max(branchTasks.length, 1)) * 100);
            return (
              <div key={branch}>
                <div className="mb-1 flex justify-between text-[11px] font-semibold text-muted-foreground">
                  <span>{branch}</span>
                  <span>{percent}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-blush/30">
                  <div
                    className="h-full rounded-full bg-plum-soft"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-3 grid gap-2 text-sm">
        <ProgressSignal
          label="Weekly Priority Progress"
          value={`${weeklyPriorityProgress}%`}
          detail={
            weeklyPriorityTasks.length > 0
              ? `${weeklyPriorityDone} of ${weeklyPriorityTasks.length} weekly-focus or Top 3 tasks complete.`
              : "No linked tasks yet. Add a task that names this weekly focus or a Top 3 project when you are ready."
          }
        />
        <ProgressSignal
          label="Product Progress"
          value={`${productProgress}%`}
          detail={`${products.filter((product) => product.status === "Complete" || product.status === "Active").length} of ${products.length} products are active or complete.`}
        />
        <ProgressSignal
          label="Framework Progress"
          value={`${frameworkProgress}%`}
          detail={`${frameworks.filter((framework) => framework.status === "Active").length} of ${frameworks.length} frameworks are active.`}
        />
        <ProgressSignal
          label="Stale High-Priority Tasks"
          value={String(staleHighPriority.length)}
          detail={describeTaskList(
            staleHighPriority,
            "No high-priority tasks need a freshness check.",
          )}
        />
        <ProgressSignal
          label="Rollover-Heavy Tasks"
          value={String(rolloverHeavy.length)}
          detail={describeTaskList(rolloverHeavy, "No repeated rollovers right now.")}
        />
        <ProgressSignal
          label="Waiting Pileup"
          value={String(waitingItems.length)}
          detail={describeWaiting(waitingItems)}
        />
      </div>
    </section>
  );
}

function ProgressMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card/70 p-3">
      <div className="font-display text-2xl leading-none text-plum-soft">{value}</div>
      <div className="mt-1 text-[11px] font-semibold leading-tight text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function ProgressSignal({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-card/70 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="font-semibold text-ink">{label}</div>
        <div className="font-display text-xl leading-none text-plum-soft">{value}</div>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}

function isCompletedThisWeek(task: TaskItem) {
  if (!task.completedAt) return false;
  return daysSince(task.completedAt) <= 7;
}

function daysSince(value: string) {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return 0;
  return Math.floor((Date.now() - time) / 86_400_000);
}

function taskMatchesWeeklyPlan(
  task: TaskItem,
  plan: { weeklyFocus: string; topProjects: string[] },
) {
  const tokens = [plan.weeklyFocus, ...plan.topProjects]
    .join(" ")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 3);
  if (tokens.length === 0) return false;
  const haystack =
    `${task.title} ${task.project ?? ""} ${task.nextStep} ${task.notes}`.toLowerCase();
  return tokens.some((token) => haystack.includes(token));
}

function describeTaskList(tasks: TaskItem[], emptyMessage: string) {
  if (tasks.length === 0) return emptyMessage;
  return tasks
    .slice(0, 2)
    .map((task) => task.title)
    .join(" • ");
}

function describeWaiting(tasks: TaskItem[]) {
  if (tasks.length === 0) return "Nothing is waiting on someone or something else.";
  const byBranch = tasks.reduce<Record<string, number>>((counts, task) => {
    counts[task.branch] = (counts[task.branch] ?? 0) + 1;
    return counts;
  }, {});
  return Object.entries(byBranch)
    .map(([branch, count]) => `${branch}: ${count}`)
    .join(" • ");
}
