import { useCallback } from "react";
import { useLocalState } from "./useLocalState";
import { STORAGE_KEYS, newId, nowISO } from "@/lib/storage";
import { SAMPLE_CAPTURED_INSIGHTS } from "@/data/sampleData";
import type { CapturedInsight } from "@/lib/types";

type CapturedInsightInput = Omit<CapturedInsight, "id" | "createdAt" | "updatedAt">;

export function useCapturedInsights() {
  const [items, setItems] = useLocalState<CapturedInsight[]>(
    STORAGE_KEYS.capturedInsights,
    SAMPLE_CAPTURED_INSIGHTS,
  );

  const addInsight = useCallback(
    (data: CapturedInsightInput) => {
      const item: CapturedInsight = {
        ...data,
        id: newId("insight"),
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };
      setItems((current) => [item, ...current]);
      return item;
    },
    [setItems],
  );

  const deleteInsight = useCallback(
    (id: string) => setItems((current) => current.filter((item) => item.id !== id)),
    [setItems],
  );

  return { items, setItems, addInsight, deleteInsight };
}
