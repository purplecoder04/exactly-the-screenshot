import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { newId, nowISO } from "@/lib/storage";
import { SAMPLE_CAPTURED_INSIGHTS } from "@/data/sampleData";
import {
  capturedInsightToInsert,
  rowToCapturedInsight,
  type CapturedInsightRow,
} from "@/lib/mappers/operatingSystem";
import type { CapturedInsight } from "@/lib/types";

type CapturedInsightInput = Omit<CapturedInsight, "id" | "createdAt" | "updatedAt">;

export function useCapturedInsights() {
  const [items, setItems] = useState<CapturedInsight[]>(SAMPLE_CAPTURED_INSIGHTS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("captured_insights")
        .select("*")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error("[useCapturedInsights] load failed", error);
        return;
      }
      setItems((data as CapturedInsightRow[]).map(rowToCapturedInsight));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addInsight = useCallback(
    (data: CapturedInsightInput) => {
      const item: CapturedInsight = {
        ...data,
        id: newId("insight"),
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };
      setItems((current) => [item, ...current]);
      void supabase
        .from("captured_insights")
        .insert(capturedInsightToInsert(item))
        .select()
        .single()
        .then(({ data: row, error }) => {
          if (error || !row) {
            console.error("[useCapturedInsights] add failed", error);
            setItems((current) => current.filter((entry) => entry.id !== item.id));
            return;
          }
          setItems((current) =>
            current.map((entry) =>
              entry.id === item.id ? rowToCapturedInsight(row as CapturedInsightRow) : entry,
            ),
          );
        });
      return item;
    },
    [],
  );

  const deleteInsight = useCallback(
    (id: string) => {
      setItems((current) => current.filter((item) => item.id !== id));
      void supabase
        .from("captured_insights")
        .delete()
        .eq("id", id)
        .then(({ error }) => {
          if (error) console.error("[useCapturedInsights] delete failed", error);
        });
    },
    [],
  );

  return { items, setItems, addInsight, deleteInsight };
}
