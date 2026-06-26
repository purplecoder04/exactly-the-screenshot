import { useCallback } from "react";
import { useLocalState } from "./useLocalState";
import { STORAGE_KEYS, nowISO } from "@/lib/storage";
import { SAMPLE_WEEKLY_PLAN } from "@/data/sampleData";
import type { WeeklyPlan } from "@/lib/types";

export function useWeeklyPlanning() {
  const [plan, setPlan] = useLocalState<WeeklyPlan>(STORAGE_KEYS.weeklyPlan, SAMPLE_WEEKLY_PLAN);

  const updatePlan = useCallback(
    (patch: Partial<WeeklyPlan>) => {
      setPlan((current) => ({ ...current, ...patch, updatedAt: nowISO() }));
    },
    [setPlan],
  );

  return { plan, setPlan, updatePlan };
}
