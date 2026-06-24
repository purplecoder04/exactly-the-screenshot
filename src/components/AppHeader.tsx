import { Calendar, Crown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  const dateStr = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="flex items-start justify-between gap-4 px-8 pb-6 pt-8 md:px-10">
      <div className="flex items-start gap-3">
        <SidebarTrigger className="mt-2 md:hidden" />
        <div>
          <h1 className="flex items-center gap-3 font-display text-4xl font-medium leading-tight text-ink md:text-5xl">
            Welcome, CEO
            <Crown className="h-6 w-6 text-gold md:h-7 md:w-7" strokeWidth={1.5} />
          </h1>
          <p className="mt-1 text-sm italic text-muted-foreground">
            Focus is a choice. Progress is the result. Impact is the mission.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-ink shadow-sm">
        <Calendar className="h-4 w-4 text-plum-soft" />
        {dateStr}
      </div>
    </header>
  );
}
