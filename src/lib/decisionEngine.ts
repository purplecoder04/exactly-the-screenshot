import type { CompanyGoal, TaskItem, WeeklyPlan } from "@/lib/types";

export type DecisionRecommendation = {
  task: TaskItem;
  score: number;
  reasons: string[];
  estimatedMinutes: number;
  impactLabel: "High" | "Medium" | "Low";
  blocksCount: number;
};

const PRIORITY_SCORE: Record<TaskItem["priority"], number> = {
  High: 42,
  Medium: 22,
  Low: 8,
};

const IMPACT_BY_TYPE: Partial<Record<TaskItem["type"], number>> = {
  Book: 26,
  Guide: 24,
  Workbook: 22,
  App: 22,
  Website: 18,
  Offer: 18,
  Content: 12,
  System: 16,
  Task: 10,
  Idea: 6,
};

const ACTIVE_STATUSES = new Set<TaskItem["status"]>(["Outline", "Writing", "Testing"]);

export function recommendTopTasks({
  tasks,
  companyGoal,
  weeklyPlan,
}: {
  tasks: TaskItem[];
  companyGoal: CompanyGoal;
  weeklyPlan: WeeklyPlan;
}): DecisionRecommendation[] {
  const active = tasks.filter((task) => !task.isDone);
  return active
    .map((task) => scoreTask(task, active, companyGoal, weeklyPlan))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function scoreTask(
  task: TaskItem,
  allActive: TaskItem[],
  companyGoal: CompanyGoal,
  weeklyPlan: WeeklyPlan,
): DecisionRecommendation {
  const reasons: string[] = [];
  let score = PRIORITY_SCORE[task.priority];

  if (task.priority === "High") reasons.push("High Priority");

  const rollovers = task.rolloverCount ?? 0;
  if (rollovers > 0) {
    score += Math.min(30, rollovers * 10);
    reasons.push(`${rollovers} rollover${rollovers === 1 ? "" : "s"}`);
  }

  const blocksCount = estimateBlocks(task, allActive);
  if (blocksCount > 0) {
    score += Math.min(32, blocksCount * 8);
    reasons.push(`Blocks ${blocksCount} project${blocksCount === 1 ? "" : "s"}`);
  }

  if (goalMatches(task, companyGoal.title) || goalMatches(task, weeklyPlan.weeklyGoal)) {
    score += 28;
    reasons.push("Supports active company goal");
  }

  if (weeklyPlan.topProjects.some((project) => goalMatches(task, project))) {
    score += 18;
    reasons.push("Matches this week's Top 3 projects");
  }

  if (ACTIVE_STATUSES.has(task.status)) {
    score += 16;
    reasons.push("Already started");
  }

  const impactScore = IMPACT_BY_TYPE[task.type] ?? 10;
  score += impactScore;
  if (impactScore >= 20) reasons.push("High company impact");

  if (task.isToday) {
    score += 8;
    reasons.push("Already marked for Today");
  }

  if (task.status === "Waiting") {
    score += 6;
    reasons.push("Waiting item to unblock");
  }

  return {
    task,
    score,
    reasons: uniqueReasons(reasons).slice(0, 4),
    estimatedMinutes: estimateMinutes(task),
    impactLabel: impactScore >= 20 ? "High" : impactScore >= 14 ? "Medium" : "Low",
    blocksCount,
  };
}

function estimateBlocks(task: TaskItem, allActive: TaskItem[]) {
  const explicitBlocker = /\b(block|blocking|blocked|unblock|waiting on|depends on|dependency)\b/i.test(
    `${task.title} ${task.nextStep} ${task.notes}`,
  );
  const related = allActive.filter(
    (other) =>
      other.id !== task.id &&
      ((task.project && other.project === task.project) || other.branch === task.branch),
  ).length;

  if (explicitBlocker) return Math.max(1, Math.min(related, 5));
  if (task.status === "Waiting" && related > 0) return Math.min(related, 4);
  if ((task.rolloverCount ?? 0) > 1 && related > 1) return Math.min(related, 3);
  return 0;
}

function estimateMinutes(task: TaskItem) {
  if (task.type === "Content") return 35;
  if (task.type === "Task" || task.type === "Idea") return 30;
  if (task.status === "Testing") return 45;
  if (task.priority === "High") return 75;
  if (task.priority === "Medium") return 55;
  return 30;
}

function goalMatches(task: TaskItem, value: string) {
  const tokens = tokenize(value);
  if (tokens.length === 0) return false;
  const haystack = `${task.title} ${task.project ?? ""} ${task.nextStep} ${task.notes}`.toLowerCase();
  return tokens.some((token) => haystack.includes(token));
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 3);
}

function uniqueReasons(reasons: string[]) {
  return [...new Set(reasons)];
}
