import { useCallback } from "react";
import { useLocalState } from "./useLocalState";
import { STORAGE_KEYS, nowISO } from "@/lib/storage";
import { SAMPLE_WEEKLY_PLAN } from "@/data/sampleData";
import type { WeeklyPlan } from "@/lib/types";

type LegacyWeeklyPlan = WeeklyPlan & { weeklyGoal?: string };

export function useWeeklyPlanning() {
  const [rawPlan, setPlan] = useLocalState<LegacyWeeklyPlan>(
    STORAGE_KEYS.weeklyPlan,
    SAMPLE_WEEKLY_PLAN,
  );
  const plan = normalizeWeeklyPlan(rawPlan);

  const updatePlan = useCallback(
    (patch: Partial<WeeklyPlan>) => {
      setPlan((current) => ({ ...normalizeWeeklyPlan(current), ...patch, updatedAt: nowISO() }));
    },
    [setPlan],
  );

  return { plan, setPlan, updatePlan };
}

function normalizeWeeklyPlan(plan: LegacyWeeklyPlan): WeeklyPlan {
  const weeklyFocus = plan.weeklyFocus || plan.weeklyGoal || "";
  return {
    weeklyFocus,
    topProjects: plan.topProjects ?? [],
    biggestRisk: plan.biggestRisk ?? "",
    waitingOn: plan.waitingOn ?? "",
    successThisWeek: plan.successThisWeek ?? "",
    updatedAt: plan.updatedAt ?? nowISO(),
  };
}
