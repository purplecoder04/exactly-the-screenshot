import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { newId, nowISO } from "@/lib/storage";
import {
  decisionToInsert,
  isDecisionSupportRow,
  rowToDecision,
  type DecisionRow,
} from "@/lib/mappers/operatingSystem";
import type { DecisionSupportItem } from "@/lib/types";

type DecisionSupportInput = Omit<DecisionSupportItem, "id" | "createdAt" | "updatedAt">;

export function useDecisionSupport() {
  const [decisions, setDecisions] = useState<DecisionSupportItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("decision_items")
        .select("*")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error("[useDecisionSupport] load failed", error);
        return;
      }
      setDecisions((data as DecisionRow[]).filter(isDecisionSupportRow).map(rowToDecision));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addDecision = useCallback(
    (data: DecisionSupportInput) => {
      const decision: DecisionSupportItem = {
        ...data,
        id: newId("decision"),
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };
      setDecisions((current) => [decision, ...current]);
      void supabase
        .from("decision_items")
        .insert(decisionToInsert(decision))
        .select()
        .single()
        .then(({ data: row, error }) => {
          if (error || !row) {
            console.error("[useDecisionSupport] add failed", error);
            setDecisions((current) => current.filter((item) => item.id !== decision.id));
            return;
          }
          setDecisions((current) =>
            current.map((item) => (item.id === decision.id ? rowToDecision(row as DecisionRow) : item)),
          );
        });
      return decision;
    },
    [],
  );

  const updateDecision = useCallback(
    (id: string, patch: Partial<DecisionSupportItem>) => {
      setDecisions((current) =>
        current.map((decision) => {
          if (decision.id !== id) return decision;
          const next = { ...decision, ...patch, updatedAt: nowISO() };
          void supabase
            .from("decision_items")
            .update(decisionToInsert(next))
            .eq("id", id)
            .then(({ error }) => {
              if (error) console.error("[useDecisionSupport] update failed", error);
            });
          return next;
        }),
      );
    },
    [],
  );

  const deleteDecision = useCallback(
    (id: string) => {
      setDecisions((current) => current.filter((decision) => decision.id !== id));
      void supabase
        .from("decision_items")
        .delete()
        .eq("id", id)
        .then(({ error }) => {
          if (error) console.error("[useDecisionSupport] delete failed", error);
        });
    },
    [],
  );

  return { decisions, setDecisions, addDecision, updateDecision, deleteDecision };
}
