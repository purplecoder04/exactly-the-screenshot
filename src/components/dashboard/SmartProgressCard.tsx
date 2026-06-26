import { BarChart3 } from "lucide-react";
import { useFrameworkLibrary } from "@/hooks/useFrameworkLibrary";
import { useProductCatalog } from "@/hooks/useProductCatalog";
import { useTasks } from "@/hooks/useTasks";
import { CORE_BRANCHES } from "@/lib/types";

export function SmartProgressCard() {
  const { tasks } = useTasks();
  const { products } = useProductCatalog();
  const { frameworks } = useFrameworkLibrary();

  const booksCompleted = products.filter((product) => product.type === "Book" && product.status === "Complete").length;
  const booksInProgress = products.filter((product) => product.type === "Book" && product.status === "Building").length;
  const apps = products.filter((product) => product.type === "App" || product.app).length;
  const quizzes = products.filter((product) => product.quiz).length;
  const bundles = products.filter((product) => product.type === "Bundle" || product.bundle).length;
  const completedTasks = tasks.filter((task) => task.isDone).length;
  const overall = Math.round(((completedTasks + products.filter((product) => product.status === "Complete").length) / Math.max(tasks.length + products.length, 1)) * 100);

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
                  <div className="h-full rounded-full bg-plum-soft" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProgressMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card/70 p-3">
      <div className="font-display text-2xl leading-none text-plum-soft">{value}</div>
      <div className="mt-1 text-[11px] font-semibold leading-tight text-muted-foreground">{label}</div>
    </div>
  );
}
