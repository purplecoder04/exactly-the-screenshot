import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  capturedInsightDraftToInsert,
  capturedInsightDraftToUpdate,
  rowToWorkSessionDraft,
  type CapturedInsightRow,
} from "@/lib/mappers/operatingSystem";
import type { CapturedInsightStatus } from "@/lib/types";
import type { WorkSessionDraft } from "@/lib/workSessionParser";

export function useCapturedInsightQueue() {
  const [drafts, setDrafts] = useState<WorkSessionDraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUnreviewed = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("captured_insights")
      .select("*")
      .eq("status", "unreviewed")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[useCapturedInsightQueue] load failed", error);
      setIsLoading(false);
      return [];
    }

    const nextDrafts = (data as CapturedInsightRow[]).map(rowToWorkSessionDraft);
    setDrafts(nextDrafts);
    setIsLoading(false);
    return nextDrafts;
  }, []);

  useEffect(() => {
    void loadUnreviewed();
  }, [loadUnreviewed]);

  const saveParsedDrafts = useCallback(
    async (parsedDrafts: WorkSessionDraft[]) => {
      if (parsedDrafts.length === 0) {
        return loadUnreviewed();
      }

      const { data, error } = await supabase
        .from("captured_insights")
        .insert(parsedDrafts.map(capturedInsightDraftToInsert))
        .select("*");

      if (error) {
        console.error("[useCapturedInsightQueue] save parsed drafts failed", error);
        throw error;
      }

      const savedDrafts = (data as CapturedInsightRow[]).map(rowToWorkSessionDraft);
      const allDrafts = await loadUnreviewed();
      return allDrafts.length > 0 ? allDrafts : savedDrafts;
    },
    [loadUnreviewed],
  );

  const persistDraft = useCallback((draft: WorkSessionDraft) => {
    return supabase
      .from("captured_insights")
      .update(capturedInsightDraftToUpdate(draft))
      .eq("id", draft.draftId);
  }, []);

  const updateDraft = useCallback(
    (draft: WorkSessionDraft) => {
      setDrafts((current) =>
        current.map((item) => (item.draftId === draft.draftId ? draft : item)),
      );
      void persistDraft(draft).then(({ error }) => {
        if (error) console.error("[useCapturedInsightQueue] update draft failed", error);
      });
    },
    [persistDraft],
  );

  const persistDrafts = useCallback(
    async (nextDrafts: WorkSessionDraft[]) => {
      const results = await Promise.all(nextDrafts.map((draft) => persistDraft(draft)));
      const failed = results.find(({ error }) => error);
      if (failed?.error) throw failed.error;
    },
    [persistDraft],
  );

  const updateStatuses = useCallback(
    async (updates: Array<{ id: string; status: CapturedInsightStatus }>) => {
      const results = await Promise.all(
        updates.map(({ id, status }) =>
          supabase.from("captured_insights").update({ status }).eq("id", id),
        ),
      );
      const failed = results.find(({ error }) => error);
      if (failed?.error) throw failed.error;

      setDrafts((current) =>
        current.filter((draft) => !updates.some((update) => update.id === draft.draftId)),
      );
    },
    [],
  );

  const deleteDraft = useCallback((draftId: string) => {
    setDrafts((current) => current.filter((draft) => draft.draftId !== draftId));
    void supabase
      .from("captured_insights")
      .delete()
      .eq("id", draftId)
      .then(({ error }) => {
        if (error) console.error("[useCapturedInsightQueue] delete failed", error);
      });
  }, []);

  const deleteDrafts = useCallback((draftIds: string[]) => {
    setDrafts((current) => current.filter((draft) => !draftIds.includes(draft.draftId)));
    if (draftIds.length === 0) return;
    void supabase
      .from("captured_insights")
      .delete()
      .in("id", draftIds)
      .then(({ error }) => {
        if (error) console.error("[useCapturedInsightQueue] bulk delete failed", error);
      });
  }, []);

  return {
    drafts,
    setDrafts,
    isLoading,
    loadUnreviewed,
    saveParsedDrafts,
    updateDraft,
    persistDrafts,
    updateStatuses,
    deleteDraft,
    deleteDrafts,
  };
}
