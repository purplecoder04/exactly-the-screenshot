import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { nowISO } from "@/lib/storage";
import type { FrameworkItem } from "@/lib/types";
import {
  frameworkPatchToUpdate,
  frameworkToInsert,
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
        .from("frameworks")
        .select("*")
        .order("created_at", { ascending: false });
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
      .from("frameworks")
      .insert(frameworkToInsert({ ...data, name: data.name }))
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

  const updateFramework = useCallback((id: string, patch: Partial<FrameworkItem>) => {
    setFrameworks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...patch, updatedAt: nowISO() } : f)),
    );
    const upd = frameworkPatchToUpdate(patch);
    if (Object.keys(upd).length === 0) return;
    void supabase
      .from("frameworks")
      .update(upd)
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error("[useFrameworkLibrary] update failed", error);
      });
  }, []);

  const deleteFramework = useCallback((id: string) => {
    setFrameworks((prev) => prev.filter((f) => f.id !== id));
    void supabase
      .from("frameworks")
      .delete()
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error("[useFrameworkLibrary] delete failed", error);
      });
  }, []);

  return { frameworks, setFrameworks, addFramework, updateFramework, deleteFramework };
}
