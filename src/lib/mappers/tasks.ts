import { areaTypeFor, type Priority, type Status, type TaskItem, type WorkspaceArea } from "@/lib/types";
import type { Database } from "@/integrations/supabase/types";

export type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];

export function rowToTask(row: TaskRow): TaskItem {
  const branch = (row.branch ?? "Brand") as WorkspaceArea;
  const status = (row.status ?? "Idea") as Status;
  return {
    id: row.id,
    title: row.title,
    branch,
    areaType: areaTypeFor(branch),
    project: undefined,
    type: "Task",
    status,
    priority: (row.priority ?? "Medium") as Priority,
    nextStep: "",
    notes: "",
    isToday: row.is_today ?? false,
    isDone: status === "Done",
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.created_at ?? new Date().toISOString(),
    completedAt: status === "Done" ? row.created_at ?? undefined : undefined,
    rolloverCount: 0,
  };
}

export function taskToInsert(t: Partial<TaskItem> & { title: string; branch: WorkspaceArea }): TaskInsert {
  return {
    title: t.title,
    branch: t.branch,
    workstream: t.areaType ?? areaTypeFor(t.branch),
    status: t.status ?? "Idea",
    is_today: t.isToday ?? false,
    priority: t.priority ?? "Medium",
  };
}

export function taskPatchToUpdate(patch: Partial<TaskItem>): Partial<TaskInsert> {
  const u: Partial<TaskInsert> = {};
  if (patch.title !== undefined) u.title = patch.title;
  if (patch.branch !== undefined) u.branch = patch.branch;
  if (patch.areaType !== undefined) u.workstream = patch.areaType;
  if (patch.status !== undefined) u.status = patch.status;
  if (patch.isToday !== undefined) u.is_today = patch.isToday;
  if (patch.priority !== undefined) u.priority = patch.priority;
  return u;
}
