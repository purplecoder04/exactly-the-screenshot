import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { nowISO } from "@/lib/storage";
import { areaTypeFor, type ParkingLotItem, type WorkspaceArea } from "@/lib/types";
import {
  parkingLotPatchToUpdate,
  parkingLotToInsert,
  rowToParkingLot,
  type IdeaRow,
} from "@/lib/mappers/ideas";

export function useParkingLot() {
  const [items, setItems] = useState<ParkingLotItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("source_app", "ceo_studio")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error("[useParkingLot] load failed", error);
        return;
      }
      setItems((data as IdeaRow[]).map(rowToParkingLot));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addItem = useCallback(
    (data: Partial<ParkingLotItem> & { idea: string; branch: WorkspaceArea }) => {
      const optimistic: ParkingLotItem = {
        id: `tmp_${Date.now()}`,
        idea: data.idea,
        branch: data.branch,
        areaType: data.areaType ?? areaTypeFor(data.branch),
        type: data.type ?? "Idea",
        priority: data.priority ?? "Medium",
        decision: data.decision ?? "Maybe",
        notes: data.notes ?? "",
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };
      setItems((prev) => [optimistic, ...prev]);
      void supabase
        .from("ideas")
        .insert(parkingLotToInsert(data))
        .select()
        .single()
        .then(({ data: row, error }) => {
          if (error || !row) {
            console.error("[useParkingLot] add failed", error);
            setItems((prev) => prev.filter((i) => i.id !== optimistic.id));
            return;
          }
          setItems((prev) =>
            prev.map((i) => (i.id === optimistic.id ? rowToParkingLot(row as IdeaRow) : i)),
          );
        });
      return optimistic;
    },
    [],
  );

  const updateItem = useCallback((id: string, patch: Partial<ParkingLotItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch, updatedAt: nowISO() } : i)));
    const upd = parkingLotPatchToUpdate(patch);
    if (Object.keys(upd).length === 0) return;
    void supabase
      .from("ideas")
      .update(upd)
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error("[useParkingLot] update failed", error);
      });
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    void supabase
      .from("ideas")
      .delete()
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error("[useParkingLot] delete failed", error);
      });
  }, []);

  return { items, setItems, addItem, updateItem, deleteItem };
}
