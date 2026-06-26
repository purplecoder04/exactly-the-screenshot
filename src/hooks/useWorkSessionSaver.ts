import { useCallback } from "react";
import { useCapturedInsights } from "./useCapturedInsights";
import { useFrameworkLibrary } from "./useFrameworkLibrary";
import { useParkingLot } from "./useParkingLot";
import { useTasks } from "./useTasks";
import { areaTypeFor, type CapturedInsight, type WorkSessionCategory } from "@/lib/types";
import type { WorkSessionDraft } from "@/lib/workSessionParser";

type SaveResult = {
  total: number;
  byCategory: Record<WorkSessionCategory, number>;
};

const emptyCounts = (): Record<WorkSessionCategory, number> => ({
  Task: 0,
  Idea: 0,
  Framework: 0,
  Decision: 0,
  "Product Update": 0,
  "Meeting Note": 0,
  Note: 0,
  "Founder Note": 0,
  "Prompt Idea": 0,
});

export function useWorkSessionSaver() {
  const { addTask } = useTasks();
  const { addItem } = useParkingLot();
  const { addFramework } = useFrameworkLibrary();
  const { addInsight } = useCapturedInsights();

  const saveDrafts = useCallback(
    (drafts: WorkSessionDraft[]): SaveResult => {
      const selected = drafts.filter((draft) => draft.selected && draft.title.trim());
      const byCategory = emptyCounts();

      selected.forEach((draft) => {
        byCategory[draft.category] += 1;

        if (draft.category === "Task") {
          addTask({
            title: draft.title.trim(),
            branch: draft.branch,
            areaType: areaTypeFor(draft.branch),
            project: draft.project?.trim() || undefined,
            type: draft.type,
            status: draft.status,
            priority: draft.priority,
            nextStep: draft.nextStep,
            notes: draft.notes,
            isToday: draft.isToday,
            isDone: false,
          });
          return;
        }

        if (draft.category === "Idea") {
          addItem({
            idea: draft.title.trim(),
            branch: draft.branch,
            areaType: areaTypeFor(draft.branch),
            type: draft.type,
            priority: draft.priority,
            decision: "Maybe",
            notes: `${draft.body}\n\n${draft.notes}`.trim(),
          });
          return;
        }

        if (draft.category === "Framework") {
          addFramework({
            name: draft.title.trim(),
            definition: draft.body,
            purpose: "",
            relatedBooks: "",
            relatedQuizzes: "",
            relatedApps: "",
            relatedLessons: "",
            relatedSocialPosts: "",
            relatedProducts: draft.project ?? "",
            notes: draft.notes,
          });
          return;
        }

        addInsight({
          category: draft.category as CapturedInsight["category"],
          title: draft.title.trim(),
          body: draft.body,
          branch: draft.branch,
          project: draft.project,
          notes: draft.notes,
        });
      });

      return { total: selected.length, byCategory };
    },
    [addFramework, addInsight, addItem, addTask],
  );

  return { saveDrafts };
}
