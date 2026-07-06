import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocalState } from "./useLocalState";
import { STORAGE_KEYS, newId, nowISO } from "@/lib/storage";
import { SAMPLE_WEEKLY_FOCUS, SAMPLE_REMINDER, SAMPLE_WEEKLY_NOTES } from "@/data/sampleData";
import {
  rowToWeeklyNote,
  weeklyNoteToInsert,
  type WeeklyNoteRow,
} from "@/lib/mappers/operatingSystem";
import { areaTypeFor, type WeeklyFocus, type WeeklyNote, type WorkspaceArea } from "@/lib/types";

export function useWeeklyFocus() {
  const [focus, setFocus] = useLocalState<WeeklyFocus[]>(STORAGE_KEYS.weeklyFocus, SAMPLE_WEEKLY_FOCUS);

  const updateValue = useCallback(
    (id: string, value: string) => {
      setFocus((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
    },
    [setFocus],
  );

  return { focus, setFocus, updateValue };
}

export function useReminder() {
  const [reminder, setReminder] = useLocalState<string>(STORAGE_KEYS.reminder, SAMPLE_REMINDER);
  return { reminder, setReminder };
}

export function useWeeklyNotes() {
  const [notes, setNotes] = useState<WeeklyNote[]>(SAMPLE_WEEKLY_NOTES);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("weekly_notes")
        .select("*")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error("[useWeeklyNotes] load failed", error);
        return;
      }
      setNotes((data as WeeklyNoteRow[]).map(rowToWeeklyNote));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addNote = useCallback(
    (data: Omit<WeeklyNote, "id" | "createdAt" | "areaType"> & { branch: WorkspaceArea }) => {
      const note: WeeklyNote = {
        id: newId("wn"),
        title: data.title,
        branch: data.branch,
        areaType: areaTypeFor(data.branch),
        note: data.note,
        date: data.date,
        createdAt: nowISO(),
      };
      setNotes((prev) => [note, ...prev]);
      void supabase
        .from("weekly_notes")
        .insert(weeklyNoteToInsert(note))
        .select()
        .single()
        .then(({ data: row, error }) => {
          if (error || !row) {
            console.error("[useWeeklyNotes] add failed", error);
            setNotes((prev) => prev.filter((entry) => entry.id !== note.id));
            return;
          }
          setNotes((prev) =>
            prev.map((entry) =>
              entry.id === note.id ? rowToWeeklyNote(row as WeeklyNoteRow) : entry,
            ),
          );
        });
      return note;
    },
    [],
  );

  const updateNote = useCallback(
    (id: string, patch: Partial<WeeklyNote>) => {
      setNotes((prev) =>
        prev.map((n) => {
          if (n.id !== id) return n;
          const branch = patch.branch ?? n.branch;
          const next = { ...n, ...patch, branch, areaType: areaTypeFor(branch) };
          void supabase
            .from("weekly_notes")
            .update(weeklyNoteToInsert(next))
            .eq("id", id)
            .then(({ error }) => {
              if (error) console.error("[useWeeklyNotes] update failed", error);
            });
          return next;
        }),
      );
    },
    [],
  );

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      void supabase
        .from("weekly_notes")
        .delete()
        .eq("id", id)
        .then(({ error }) => {
          if (error) console.error("[useWeeklyNotes] delete failed", error);
        });
    },
    [],
  );

  return { notes, setNotes, addNote, updateNote, deleteNote };
}
