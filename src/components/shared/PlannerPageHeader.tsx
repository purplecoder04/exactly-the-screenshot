import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import plannerAssetsUrl from "@/assets/planner/planner-assets.png";
import { cn } from "@/lib/utils";

type PlannerPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function PlannerPageHeader({
  eyebrow = "Best Collective",
  title,
  description,
  actions,
  children,
  className,
}: PlannerPageHeaderProps) {
  return (
    <section className={cn("planner-card relative overflow-hidden p-5 md:p-6", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-cover bg-center opacity-45 md:block"
        style={{ backgroundImage: `url(${plannerAssetsUrl})` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-card via-card/95 to-card/65" />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-2xl">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            <Sparkles className="h-4 w-4" />
            {eyebrow}
          </div>
          <h2 className="font-display text-3xl leading-tight text-ink md:text-4xl">{title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        {actions && <div className="relative flex flex-wrap gap-2">{actions}</div>}
      </div>
      {children && <div className="relative mt-5">{children}</div>}
    </section>
  );
}

export function PlannerPanel({
  title,
  description,
  children,
  action,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("planner-card p-4 md:p-5", className)}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-plum-deep">{title}</h3>
          {description && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
