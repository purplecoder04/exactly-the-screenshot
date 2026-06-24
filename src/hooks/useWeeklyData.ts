import { useCallback } from "react";
import { useLocalState } from "./useLocalState";
import { STORAGE_KEYS, newId, nowISO } from "@/lib/storage";
import { SAMPLE_WEEKLY_FOCUS, SAMPLE_REMINDER, SAMPLE_WEEKLY_NOTES } from "@/data/sampleData";
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
  const [notes, setNotes] = useLocalState<WeeklyNote[]>(STORAGE_KEYS.weeklyNotes, SAMPLE_WEEKLY_NOTES);

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
      return note;
    },
    [setNotes],
  );

  const updateNote = useCallback(
    (id: string, patch: Partial<WeeklyNote>) => {
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
    },
    [setNotes],
  );

  const deleteNote = useCallback(
    (id: string) => setNotes((prev) => prev.filter((n) => n.id !== id)),
    [setNotes],
  );

  return { notes, setNotes, addNote, updateNote, deleteNote };
}
