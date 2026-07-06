import type { FrameworkItem, FrameworkStatus, FrameworkUse } from "@/lib/types";
import type { Database } from "@/integrations/supabase/types";

export type FrameworkRow = Database["public"]["Tables"]["library_items"]["Row"];
export type FrameworkInsert = Database["public"]["Tables"]["library_items"]["Insert"];

const BC_PAYLOAD_VERSION = 1;

type PackedPayload<T> = {
  __bcKind: string;
  version: number;
  data: T;
};

type FrameworkPayload = Omit<FrameworkItem, "id"> & {
  id?: string;
};

function now() {
  return new Date().toISOString();
}

function pack(data: FrameworkPayload): string {
  return JSON.stringify({
    __bcKind: "framework-library-item",
    version: BC_PAYLOAD_VERSION,
    data,
  });
}

function unpack(value?: string | null): Partial<FrameworkPayload> | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<PackedPayload<Partial<FrameworkPayload>>>;
    if (
      parsed &&
      parsed.__bcKind === "framework-library-item" &&
      parsed.data &&
      typeof parsed.data === "object"
    ) {
      return parsed.data;
    }
  } catch {
    return null;
  }
  return null;
}

function safeFrameworkStatus(value?: string | null): FrameworkStatus {
  if (value === "Idea" || value === "Draft" || value === "Active" || value === "Archived") {
    return value;
  }
  return "Active";
}

function safeFrameworkUse(value?: string | null): FrameworkUse {
  if (
    value === "Teaching" ||
    value === "Product" ||
    value === "Marketing" ||
    value === "Decision" ||
    value === "Prompt" ||
    value === "Internal"
  ) {
    return value;
  }
  return "Teaching";
}

export function rowToFramework(row: FrameworkRow): FrameworkItem {
  const payload = unpack(row.content_body ?? row.content);
  return {
    id: row.id,
    name: payload?.name ?? row.title,
    status: safeFrameworkStatus(payload?.status),
    primaryUse: safeFrameworkUse(payload?.primaryUse),
    definition: payload?.definition ?? row.description ?? "",
    purpose: payload?.purpose ?? "",
    relatedBooks: payload?.relatedBooks ?? "",
    relatedQuizzes: payload?.relatedQuizzes ?? "",
    relatedApps: payload?.relatedApps ?? "",
    relatedLessons: payload?.relatedLessons ?? "",
    relatedSocialPosts: payload?.relatedSocialPosts ?? "",
    relatedProducts: payload?.relatedProducts ?? "",
    notes: payload?.notes ?? "",
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: payload?.updatedAt ?? row.updated_at ?? row.created_at ?? new Date().toISOString(),
  };
}

export function frameworkToInsert(f: Partial<FrameworkItem> & { name: string }): FrameworkInsert {
  const createdAt = f.createdAt ?? now();
  const updatedAt = f.updatedAt ?? now();
  const framework: FrameworkPayload = {
    name: f.name,
    status: safeFrameworkStatus(f.status),
    primaryUse: safeFrameworkUse(f.primaryUse),
    definition: f.definition ?? "",
    purpose: f.purpose ?? "",
    relatedBooks: f.relatedBooks ?? "",
    relatedQuizzes: f.relatedQuizzes ?? "",
    relatedApps: f.relatedApps ?? "",
    relatedLessons: f.relatedLessons ?? "",
    relatedSocialPosts: f.relatedSocialPosts ?? "",
    relatedProducts: f.relatedProducts ?? "",
    notes: f.notes ?? "",
    createdAt,
    updatedAt,
  };
  const body = pack(framework);
  return {
    title: f.name,
    description: f.definition || f.purpose || null,
    category: "Framework",
    branch: "Framework Library",
    content: body,
    content_body: body,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

export function frameworkToUpdate(framework: FrameworkItem): Partial<FrameworkInsert> {
  return frameworkToInsert(framework);
}
