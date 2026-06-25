import { Bell, Calendar, Heart, Sparkles } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import plannerAssetsUrl from "@/assets/planner/planner-assets.png";

export function AppHeader() {
  const dateStr = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="relative overflow-hidden px-4 pb-5 pt-6 md:px-8 md:pt-8 xl:px-10">
      <div
        className="pointer-events-none absolute right-20 top-0 hidden h-36 w-[520px] opacity-55 mix-blend-multiply lg:block"
        style={{
          backgroundImage: `url(${plannerAssetsUrl})`,
          backgroundSize: "720px auto",
          backgroundPosition: "right -70px top -110px",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="relative flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <SidebarTrigger className="mt-2 md:hidden" />
        <div>
          <h1 className="flex flex-wrap items-center gap-3 font-display text-4xl font-medium leading-tight text-ink md:text-5xl">
            Good Afternoon, Erica
            <Heart className="h-5 w-5 fill-blush text-orchid md:h-6 md:w-6" strokeWidth={1.5} />
          </h1>
          <p className="mt-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink/75">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            You're building something beautiful.
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <button className="relative hidden rounded-full border border-paper-line bg-warm-white/80 p-2 text-ink shadow-sm transition hover:-translate-y-0.5 hover:bg-blush/20 md:inline-flex">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-orchid px-1 text-[10px] font-semibold text-white">
            3
          </span>
        </button>
        <div className="hidden h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-paper-line bg-blush/40 text-sm font-semibold text-plum-deep shadow-sm md:flex">
          E
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-paper-line bg-warm-white/85 px-3 py-2 text-sm font-semibold text-ink shadow-sm">
          <Calendar className="h-4 w-4 text-plum-soft" />
          {dateStr}
        </div>
      </div>
      </div>
    </header>
  );
}
