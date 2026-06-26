import { useCallback } from "react";
import { useLocalState } from "./useLocalState";
import { STORAGE_KEYS, newId, nowISO } from "@/lib/storage";
import type { LibraryItem } from "@/lib/types";

type LibraryItemInput = Omit<LibraryItem, "id" | "createdAt" | "updatedAt">;

export function useLibraryItems() {
  const [items, setItems] = useLocalState<LibraryItem[]>(STORAGE_KEYS.libraryItems, []);

  const addLibraryItem = useCallback(
    (data: LibraryItemInput) => {
      const item: LibraryItem = {
        ...data,
        id: newId("lib"),
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };
      setItems((current) => [item, ...current]);
      return item;
    },
    [setItems],
  );

  const updateLibraryItem = useCallback(
    (id: string, patch: Partial<LibraryItem>) => {
      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, ...patch, updatedAt: nowISO() } : item)),
      );
    },
    [setItems],
  );

  const deleteLibraryItem = useCallback(
    (id: string) => setItems((current) => current.filter((item) => item.id !== id)),
    [setItems],
  );

  return { items, setItems, addLibraryItem, updateLibraryItem, deleteLibraryItem };
}
