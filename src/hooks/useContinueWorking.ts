import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { nowISO } from "@/lib/storage";
import { SAMPLE_CONTINUE_WORKING } from "@/data/sampleData";
import {
  continueWorkingToInsert,
  rowToContinueWorking,
  type ContinueWorkingRow,
} from "@/lib/mappers/operatingSystem";
import type { ContinueWorkingState, TaskItem, WorkspaceArea } from "@/lib/types";

const AREA_ROUTES: Record<WorkspaceArea, string> = {
  Brand: "/brand",
  Rise: "/rise",
  Land: "/land",
  Rebuild: "/rebuild",
  "Meet at the Heal": "/meet-at-the-heal",
  "Kit Factory App": "/kit-factory-app",
  "Social Media App": "/social-media-app",
  Website: "/website",
  "Social Media": "/social-media",
};

export function useContinueWorking() {
  const [state, setState] = useState<ContinueWorkingState>(SAMPLE_CONTINUE_WORKING);
  const [recordId, setRecordId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("continue_working_state")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error("[useContinueWorking] load failed", error);
        return;
      }
      if (data) {
        setRecordId(data.id);
        setState(rowToContinueWorking(data as ContinueWorkingRow));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const remember = useCallback(
    (patch: Partial<ContinueWorkingState>) => {
      setState((current) => {
        const next = { ...current, ...patch, updatedAt: nowISO() };
        const payload = continueWorkingToInsert(next);
        if (recordId) {
          void supabase
            .from("continue_working_state")
            .update(payload)
            .eq("id", recordId)
            .then(({ error }) => {
              if (error) console.error("[useContinueWorking] update failed", error);
            });
        } else {
          void supabase
            .from("continue_working_state")
            .insert(payload)
            .select()
            .single()
            .then(({ data, error }) => {
              if (error || !data) {
                console.error("[useContinueWorking] create failed", error);
                return;
              }
              setRecordId(data.id);
            });
        }
        return next;
      });
    },
    [recordId],
  );

  const rememberTask = useCallback(
    (task: TaskItem) => {
      remember({
        lastBranch: task.branch,
        lastProduct: task.project ?? task.title,
        lastLesson: task.type === "Guide" ? task.title : "",
        lastWorkbook: task.type === "Workbook" ? task.title : "",
        lastApp: task.type === "App" ? task.project ?? task.title : "",
        lastPage: AREA_ROUTES[task.branch],
        taskId: task.id,
      });
    },
    [remember],
  );

  return { state, remember, rememberTask };
}
