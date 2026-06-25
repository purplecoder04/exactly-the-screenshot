import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type PlannerPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  decorAsset?: string | null;
  decorClassName?: string;
};

export function PlannerPageHeader({
  eyebrow = "Best Collective",
  title,
  description,
  actions,
  children,
  className,
  decorAsset = null,
  decorClassName,
}: PlannerPageHeaderProps) {
  return (
    <section className={cn("planner-card relative overflow-hidden p-5 md:p-6", className)}>
      {decorAsset && (
        <img
          aria-hidden="true"
          src={decorAsset}
          alt=""
          className={cn(
            "pointer-events-none absolute right-8 top-4 hidden h-32 w-48 object-contain opacity-35 mix-blend-multiply md:block",
            decorClassName,
          )}
        />
      )}
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
