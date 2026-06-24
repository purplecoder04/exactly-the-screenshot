import { ALL_AREAS, type WorkspaceArea } from "@/lib/types";
import { cn } from "@/lib/utils";

// Color hint per area for dots/pills
const AREA_DOT: Record<WorkspaceArea, string> = {
  Brand: "bg-green-muted",
  Rise: "bg-blush",
  Land: "bg-gold",
  Rebuild: "bg-plum-soft",
  "Meet at the Heal": "bg-green-muted",
  "Kit Factory App": "bg-status-writing",
  "Social Media App": "bg-blush",
  Website: "bg-plum-soft",
  "Social Media": "bg-green-muted",
};

export function AreaDot({ area, className }: { area: WorkspaceArea; className?: string }) {
  return <span className={cn("inline-block h-2.5 w-2.5 rounded-full", AREA_DOT[area], className)} />;
}

export function AreaPill({ area, className }: { area: WorkspaceArea; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-ink",
        className,
      )}
    >
      <AreaDot area={area} />
      {area}
    </span>
  );
}

export { ALL_AREAS };
