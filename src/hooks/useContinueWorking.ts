import { useCallback } from "react";
import { useLocalState } from "./useLocalState";
import { STORAGE_KEYS, nowISO } from "@/lib/storage";
import { SAMPLE_CONTINUE_WORKING } from "@/data/sampleData";
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
  const [state, setState] = useLocalState<ContinueWorkingState>(
    STORAGE_KEYS.continueWorking,
    SAMPLE_CONTINUE_WORKING,
  );

  const remember = useCallback(
    (patch: Partial<ContinueWorkingState>) => {
      setState((current) => ({ ...current, ...patch, updatedAt: nowISO() }));
    },
    [setState],
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
