import { useCallback } from "react";
import { useLocalState } from "./useLocalState";
import { STORAGE_KEYS, newId, nowISO } from "@/lib/storage";
import { SAMPLE_PARKING_LOT } from "@/data/sampleData";
import {
  areaTypeFor,
  type ParkingLotItem,
  type WorkspaceArea,
} from "@/lib/types";

export function useParkingLot() {
  const [items, setItems] = useLocalState<ParkingLotItem[]>(
    STORAGE_KEYS.parkingLot,
    SAMPLE_PARKING_LOT,
  );

  const addItem = useCallback(
    (data: Partial<ParkingLotItem> & { idea: string; branch: WorkspaceArea }) => {
      const item: ParkingLotItem = {
        id: newId("p"),
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
      setItems((prev) => [item, ...prev]);
      return item;
    },
    [setItems],
  );

  const updateItem = useCallback(
    (id: string, patch: Partial<ParkingLotItem>) => {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...patch, updatedAt: nowISO() } : i)),
      );
    },
    [setItems],
  );

  const deleteItem = useCallback(
    (id: string) => setItems((prev) => prev.filter((i) => i.id !== id)),
    [setItems],
  );

  return { items, setItems, addItem, updateItem, deleteItem };
}
