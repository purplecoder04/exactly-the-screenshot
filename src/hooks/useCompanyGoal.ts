import { useCallback } from "react";
import { useLocalState } from "./useLocalState";
import { STORAGE_KEYS, nowISO } from "@/lib/storage";
import { SAMPLE_COMPANY_GOAL } from "@/data/sampleData";
import type { CompanyGoal } from "@/lib/types";

export function useCompanyGoal() {
  const [goal, setGoal] = useLocalState<CompanyGoal>(STORAGE_KEYS.companyGoal, SAMPLE_COMPANY_GOAL);

  const updateGoal = useCallback(
    (patch: Partial<CompanyGoal>) => {
      setGoal((current) => ({ ...current, ...patch, updatedAt: nowISO() }));
    },
    [setGoal],
  );

  const clearGoal = useCallback(() => {
    setGoal({ title: "", notes: "", updatedAt: nowISO() });
  }, [setGoal]);

  return { goal, updateGoal, clearGoal };
}
