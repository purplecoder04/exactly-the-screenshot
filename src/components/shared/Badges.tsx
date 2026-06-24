import { cn } from "@/lib/utils";
import type { Status, Priority } from "@/lib/types";
import { Star } from "lucide-react";

const STATUS_COLOR: Record<Status, string> = {
  Idea: "bg-status-idea/40 text-ink",
  Outline: "bg-status-outline/30 text-ink",
  Writing: "bg-status-writing/30 text-ink",
  Testing: "bg-status-testing/30 text-ink",
  Waiting: "bg-status-waiting/30 text-ink",
  Done: "bg-status-done/40 text-ink",
};

const STATUS_DOT: Record<Status, string> = {
  Idea: "bg-status-idea",
  Outline: "bg-status-outline",
  Writing: "bg-status-writing",
  Testing: "bg-status-testing",
  Waiting: "bg-status-waiting",
  Done: "bg-status-done",
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_COLOR[status],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[status])} />
      {status}
    </span>
  );
}

export function StatusDot({ status, className }: { status: Status; className?: string }) {
  return <span className={cn("inline-block h-2.5 w-2.5 rounded-full", STATUS_DOT[status], className)} />;
}

const PRIORITY_BADGE: Record<Priority, string> = {
  High: "bg-priority-high/25 text-priority-high",
  Medium: "bg-priority-medium/25 text-ink",
  Low: "bg-priority-low/25 text-ink",
};

const PRIORITY_STAR: Record<Priority, string> = {
  High: "fill-priority-high text-priority-high",
  Medium: "fill-priority-medium text-priority-medium",
  Low: "fill-priority-low text-priority-low",
};

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        PRIORITY_BADGE[priority],
        className,
      )}
    >
      {priority}
    </span>
  );
}

export function PriorityStar({ priority, className }: { priority: Priority; className?: string }) {
  return <Star className={cn("h-4 w-4", PRIORITY_STAR[priority], className)} strokeWidth={1.5} />;
}
