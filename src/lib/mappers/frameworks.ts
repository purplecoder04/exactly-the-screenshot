import type { FrameworkItem, FrameworkStatus } from "@/lib/types";
import type { Database } from "@/integrations/supabase/types";

export type FrameworkRow = Database["public"]["Tables"]["frameworks"]["Row"];
export type FrameworkInsert = Database["public"]["Tables"]["frameworks"]["Insert"];

export function rowToFramework(row: FrameworkRow): FrameworkItem {
  return {
    id: row.id,
    name: row.name,
    status: (row.status as FrameworkStatus) ?? "Active",
    primaryUse: "Teaching",
    definition: row.description ?? "",
    purpose: "",
    relatedBooks: "",
    relatedQuizzes: "",
    relatedApps: "",
    relatedLessons: "",
    relatedSocialPosts: "",
    relatedProducts: "",
    notes: "",
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.created_at ?? new Date().toISOString(),
  };
}

export function frameworkToInsert(f: Partial<FrameworkItem> & { name: string }): FrameworkInsert {
  return {
    name: f.name,
    branch: f.relatedProducts || null,
    description: f.definition ?? null,
    status: f.status ?? "Active",
  };
}

export function frameworkPatchToUpdate(patch: Partial<FrameworkItem>): Partial<FrameworkInsert> {
  const u: Partial<FrameworkInsert> = {};
  if (patch.name !== undefined) u.name = patch.name;
  if (patch.definition !== undefined) u.description = patch.definition;
  if (patch.status !== undefined) u.status = patch.status;
  return u;
}
