import { useCallback } from "react";
import { useLocalState } from "./useLocalState";
import { STORAGE_KEYS, newId, nowISO } from "@/lib/storage";
import { SAMPLE_FRAMEWORKS } from "@/data/sampleData";
import type { FrameworkItem } from "@/lib/types";

type FrameworkInput = Omit<FrameworkItem, "id" | "createdAt" | "updatedAt">;

export function useFrameworkLibrary() {
  const [frameworks, setFrameworks] = useLocalState<FrameworkItem[]>(
    STORAGE_KEYS.frameworkLibrary,
    SAMPLE_FRAMEWORKS,
  );

  const addFramework = useCallback(
    (data: FrameworkInput) => {
      const framework: FrameworkItem = {
        ...data,
        status: data.status ?? "Active",
        primaryUse: data.primaryUse ?? "Teaching",
        id: newId("fw"),
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };
      setFrameworks((current) => [framework, ...current]);
      return framework;
    },
    [setFrameworks],
  );

  const updateFramework = useCallback(
    (id: string, patch: Partial<FrameworkItem>) => {
      setFrameworks((current) =>
        current.map((framework) =>
          framework.id === id ? { ...framework, ...patch, updatedAt: nowISO() } : framework,
        ),
      );
    },
    [setFrameworks],
  );

  const deleteFramework = useCallback(
    (id: string) => setFrameworks((current) => current.filter((framework) => framework.id !== id)),
    [setFrameworks],
  );

  return { frameworks, setFrameworks, addFramework, updateFramework, deleteFramework };
}
