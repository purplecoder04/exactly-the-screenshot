import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { nowISO } from "@/lib/storage";
import { SAMPLE_WEEKLY_PLAN } from "@/data/sampleData";
import type { WeeklyPlan } from "@/lib/types";
import {
  rowToWeeklyPlan,
  weeklyPlanToInsert,
  type WeeklyPlanRow,
} from "@/lib/mappers/operatingSystem";

type LegacyWeeklyPlan = WeeklyPlan & { weeklyGoal?: string };

export function useWeeklyPlanning() {
  const [rawPlan, setPlan] = useState<LegacyWeeklyPlan>(SAMPLE_WEEKLY_PLAN);
  const [planRecordId, setPlanRecordId] = useState<string | null>(null);
  const plan = normalizeWeeklyPlan(rawPlan);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("weekly_plans")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error("[useWeeklyPlanning] load failed", error);
        return;
      }
      if (data) {
        setPlanRecordId(data.id);
        setPlan(rowToWeeklyPlan(data as WeeklyPlanRow));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updatePlan = useCallback(
    (patch: Partial<WeeklyPlan>) => {
      setPlan((current) => {
        const next = { ...normalizeWeeklyPlan(current), ...patch, updatedAt: nowISO() };
        const payload = weeklyPlanToInsert(next);
        if (planRecordId) {
          void supabase
            .from("weekly_plans")
            .update(payload)
            .eq("id", planRecordId)
            .then(({ error }) => {
              if (error) console.error("[useWeeklyPlanning] update failed", error);
            });
        } else {
          void supabase
            .from("weekly_plans")
            .insert(payload)
            .select()
            .single()
            .then(({ data, error }) => {
              if (error || !data) {
                console.error("[useWeeklyPlanning] create failed", error);
                return;
              }
              setPlanRecordId(data.id);
            });
        }
        return next;
      });
    },
    [planRecordId],
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
    branchFocus: plan.branchFocus ?? "",
    updatedAt: plan.updatedAt ?? nowISO(),
  };
}
