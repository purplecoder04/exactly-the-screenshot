import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { nowISO } from "@/lib/storage";
import type { FrameworkItem } from "@/lib/types";
import {
  frameworkToInsert,
  frameworkToUpdate,
  rowToFramework,
  type FrameworkRow,
} from "@/lib/mappers/frameworks";

type FrameworkInput = Omit<FrameworkItem, "id" | "createdAt" | "updatedAt">;

export function useFrameworkLibrary() {
  const [frameworks, setFrameworks] = useState<FrameworkItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("library_items")
        .select("*")
        .eq("category", "Framework")
        .order("updated_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error("[useFrameworkLibrary] load failed", error);
        return;
      }
      setFrameworks((data as FrameworkRow[]).map(rowToFramework));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addFramework = useCallback((data: FrameworkInput) => {
    const optimistic: FrameworkItem = {
      ...data,
      status: data.status ?? "Active",
      primaryUse: data.primaryUse ?? "Teaching",
      id: `tmp_${Date.now()}`,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    setFrameworks((prev) => [optimistic, ...prev]);
    void supabase
      .from("library_items")
      .insert(frameworkToInsert({ ...optimistic, name: optimistic.name }))
      .select()
      .single()
      .then(({ data: row, error }) => {
        if (error || !row) {
          console.error("[useFrameworkLibrary] add failed", error);
          setFrameworks((prev) => prev.filter((f) => f.id !== optimistic.id));
          return;
        }
        setFrameworks((prev) =>
          prev.map((f) => (f.id === optimistic.id ? rowToFramework(row as FrameworkRow) : f)),
        );
      });
    return optimistic;
  }, []);

  const updateFramework = useCallback(
    (id: string, patch: Partial<FrameworkItem>) => {
      const previous = frameworks.find((framework) => framework.id === id);
      if (!previous) return;
      const next = { ...previous, ...patch, updatedAt: nowISO() };
      setFrameworks((prev) => prev.map((f) => (f.id === id ? next : f)));
      void supabase
        .from("library_items")
        .update(frameworkToUpdate(next))
        .eq("id", id)
        .then(({ error }) => {
          if (error) {
            console.error("[useFrameworkLibrary] update failed", error);
            setFrameworks((prev) => prev.map((f) => (f.id === id ? previous : f)));
          }
        });
    },
    [frameworks],
  );

  const deleteFramework = useCallback(
    (id: string) => {
      const previous = frameworks.find((framework) => framework.id === id);
      setFrameworks((prev) => prev.filter((f) => f.id !== id));
      void supabase
        .from("library_items")
        .delete()
        .eq("id", id)
        .then(({ error }) => {
          if (error) {
            console.error("[useFrameworkLibrary] delete failed", error);
            if (previous) setFrameworks((prev) => [previous, ...prev]);
          }
        });
    },
    [frameworks],
  );

  return { frameworks, setFrameworks, addFramework, updateFramework, deleteFramework };
}
