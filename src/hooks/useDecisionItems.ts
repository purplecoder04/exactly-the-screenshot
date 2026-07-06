import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { newId, nowISO } from "@/lib/storage";
import {
  decisionItemToInsert,
  isDecisionEngineRow,
  rowToDecisionItem,
  type DecisionRow,
} from "@/lib/mappers/operatingSystem";
import type { DecisionRecommendation } from "@/lib/decisionEngine";
import type { DecisionItem, DecisionItemStatus } from "@/lib/types";

type DecisionItemInput = Omit<DecisionItem, "id" | "createdAt" | "updatedAt">;

export function useDecisionItems() {
  const [items, setItems] = useState<DecisionItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("decision_items")
        .select("*")
        .order("updated_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error("[useDecisionItems] load failed", error);
        return;
      }
      setItems((data as DecisionRow[]).filter(isDecisionEngineRow).map(rowToDecisionItem));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const saveDecisionItem = useCallback(
    async (input: DecisionItemInput, existingId?: string) => {
      const next: DecisionItem = {
        ...input,
        id: existingId ?? newId("decision_item"),
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };

      setItems((current) => {
        const withoutExisting = current.filter((item) => item.id !== next.id);
        return [next, ...withoutExisting];
      });

      const payload = decisionItemToInsert(next);
      const { data, error } = existingId
        ? await supabase.from("decision_items").update(payload).eq("id", existingId).select().single()
        : await supabase.from("decision_items").insert(payload).select().single();

      if (error || !data) {
        console.error("[useDecisionItems] save failed", error);
        setItems((current) => current.filter((item) => item.id !== next.id));
        return null;
      }

      const saved = rowToDecisionItem(data as DecisionRow);
      setItems((current) => current.map((item) => (item.id === next.id ? saved : item)));
      return saved;
    },
    [],
  );

  const updateDecisionItem = useCallback(
    async (id: string, patch: Partial<DecisionItem>) => {
      const target = items.find((item) => item.id === id);
      if (!target) return null;
      return saveDecisionItem({ ...target, ...patch, updatedAt: nowISO() }, id);
    },
    [items, saveDecisionItem],
  );

  const recordRecommendations = useCallback(
    async (recommendations: DecisionRecommendation[], status: DecisionItemStatus) => {
      const saves = recommendations.map((recommendation) => {
        const existing = items.find((item) => item.taskId === recommendation.task.id);
        if (status === "pending" && existing?.status === "accepted") {
          return Promise.resolve(existing);
        }
        return saveDecisionItem(recommendationToDecisionItem(recommendation, status), existing?.id);
      });
      return Promise.all(saves);
    },
    [items, saveDecisionItem],
  );

  return { items, setItems, saveDecisionItem, updateDecisionItem, recordRecommendations };
}

function recommendationToDecisionItem(
  recommendation: DecisionRecommendation,
  status: DecisionItemStatus,
): DecisionItemInput {
  const { task } = recommendation;
  return {
    title: task.title,
    description: recommendation.reasons.join("\n"),
    status,
    priority: task.priority,
    relatedBranch: task.branch,
    taskId: task.id,
    reasons: recommendation.reasons,
    estimatedMinutes: recommendation.estimatedMinutes,
    impactLabel: recommendation.impactLabel,
  };
}
