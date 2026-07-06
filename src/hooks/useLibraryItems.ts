import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { newId, nowISO } from "@/lib/storage";
import {
  libraryItemToInsert,
  rowToLibraryItem,
  type LibraryItemRow,
} from "@/lib/mappers/operatingSystem";
import type { LibraryItem } from "@/lib/types";

type LibraryItemInput = Omit<LibraryItem, "id" | "createdAt" | "updatedAt">;

export function useLibraryItems() {
  const [items, setItems] = useState<LibraryItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("library_items")
        .select("*")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error("[useLibraryItems] load failed", error);
        return;
      }
      setItems(
        (data as LibraryItemRow[])
          .filter((row) => row.category !== "Framework")
          .map(rowToLibraryItem),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addLibraryItem = useCallback(
    (data: LibraryItemInput) => {
      const item: LibraryItem = {
        ...data,
        id: newId("lib"),
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };
      setItems((current) => [item, ...current]);
      void supabase
        .from("library_items")
        .insert(libraryItemToInsert(item))
        .select()
        .single()
        .then(({ data: row, error }) => {
          if (error || !row) {
            console.error("[useLibraryItems] add failed", error);
            setItems((current) => current.filter((entry) => entry.id !== item.id));
            return;
          }
          setItems((current) =>
            current.map((entry) =>
              entry.id === item.id ? rowToLibraryItem(row as LibraryItemRow) : entry,
            ),
          );
        });
      return item;
    },
    [],
  );

  const updateLibraryItem = useCallback(
    (id: string, patch: Partial<LibraryItem>) => {
      setItems((current) =>
        current.map((item) => {
          if (item.id !== id) return item;
          const next = { ...item, ...patch, updatedAt: nowISO() };
          void supabase
            .from("library_items")
            .update(libraryItemToInsert(next))
            .eq("id", id)
            .then(({ error }) => {
              if (error) console.error("[useLibraryItems] update failed", error);
            });
          return next;
        }),
      );
    },
    [],
  );

  const deleteLibraryItem = useCallback(
    (id: string) => {
      setItems((current) => current.filter((item) => item.id !== id));
      void supabase
        .from("library_items")
        .delete()
        .eq("id", id)
        .then(({ error }) => {
          if (error) console.error("[useLibraryItems] delete failed", error);
        });
    },
    [],
  );

  return { items, setItems, addLibraryItem, updateLibraryItem, deleteLibraryItem };
}
