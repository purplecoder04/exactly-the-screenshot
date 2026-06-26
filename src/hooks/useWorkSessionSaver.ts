import { useCallback } from "react";
import { useCapturedInsights } from "./useCapturedInsights";
import { useFrameworkLibrary } from "./useFrameworkLibrary";
import { useParkingLot } from "./useParkingLot";
import { useProductCatalog } from "./useProductCatalog";
import { useTasks } from "./useTasks";
import {
  areaTypeFor,
  type CapturedInsight,
  type ProductCatalogType,
  type ProjectType,
  type WorkSessionCategory,
} from "@/lib/types";
import type { WorkSessionDraft } from "@/lib/workSessionParser";

type SaveResult = {
  total: number;
  byCategory: Record<WorkSessionCategory, number>;
};

const emptyCounts = (): Record<WorkSessionCategory, number> => ({
  Task: 0,
  Idea: 0,
  "Parking Lot": 0,
  Framework: 0,
  Product: 0,
  Decision: 0,
  "Product Update": 0,
  "Meeting Note": 0,
  "License Rule": 0,
  "Captured Insight": 0,
  Note: 0,
  "Founder Note": 0,
  "Prompt Idea": 0,
});

export function useWorkSessionSaver() {
  const { addTask } = useTasks();
  const { addItem } = useParkingLot();
  const { addFramework } = useFrameworkLibrary();
  const { addProduct } = useProductCatalog();
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

        if (draft.category === "Idea" || draft.category === "Parking Lot") {
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
            status: "Active",
            primaryUse: "Teaching",
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

        if (draft.category === "Product" || draft.category === "Product Update") {
          addProduct({
            name: draft.title.trim(),
            branch: draft.branch,
            collection: draft.project ?? "",
            type: productTypeFromProjectType(draft.type),
            status: draft.category === "Product Update" ? "Building" : "Idea",
            lessonGuide: "",
            workbook: "",
            quiz: "",
            app: draft.type === "App" ? draft.title.trim() : "",
            website: draft.type === "Website" ? draft.title.trim() : "",
            bundle: draft.type === "Offer" ? draft.title.trim() : "",
            bridgeProduct: "",
            version: "v0.1",
            notes: `${draft.body}\n\n${draft.notes}`.trim(),
            isLocked: false,
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
    [addFramework, addInsight, addItem, addProduct, addTask],
  );

  return { saveDrafts };
}

function productTypeFromProjectType(type: ProjectType): ProductCatalogType {
  const map: Partial<Record<ProjectType, ProductCatalogType>> = {
    Offer: "Bundle",
    Workbook: "Workbook",
    Guide: "Lesson Guide",
    App: "App",
    Website: "Website",
    Book: "Book",
    System: "Other",
    Content: "Other",
    Task: "Other",
    Idea: "Other",
  };

  return map[type] ?? "Other";
}
