import { useCallback } from "react";
import { useLocalState } from "./useLocalState";
import { STORAGE_KEYS, newId, nowISO } from "@/lib/storage";
import type { DecisionSupportItem } from "@/lib/types";

type DecisionSupportInput = Omit<DecisionSupportItem, "id" | "createdAt" | "updatedAt">;

export function useDecisionSupport() {
  const [decisions, setDecisions] = useLocalState<DecisionSupportItem[]>(
    STORAGE_KEYS.decisionSupport,
    [],
  );

  const addDecision = useCallback(
    (data: DecisionSupportInput) => {
      const decision: DecisionSupportItem = {
        ...data,
        id: newId("decision"),
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };
      setDecisions((current) => [decision, ...current]);
      return decision;
    },
    [setDecisions],
  );

  const updateDecision = useCallback(
    (id: string, patch: Partial<DecisionSupportItem>) => {
      setDecisions((current) =>
        current.map((decision) =>
          decision.id === id ? { ...decision, ...patch, updatedAt: nowISO() } : decision,
        ),
      );
    },
    [setDecisions],
  );

  const deleteDecision = useCallback(
    (id: string) => setDecisions((current) => current.filter((decision) => decision.id !== id)),
    [setDecisions],
  );

  return { decisions, setDecisions, addDecision, updateDecision, deleteDecision };
}
