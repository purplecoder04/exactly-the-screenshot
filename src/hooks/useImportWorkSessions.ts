import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { SupportedImportFileType } from "@/lib/documentImport";
import type { WorkSessionDraft } from "@/lib/workSessionParser";

type Tables = import("@/integrations/supabase/types").Database["public"]["Tables"];
type ImportWorkSessionRow = Tables["import_work_sessions"]["Row"];
type ImportWorkSessionInsert = Tables["import_work_sessions"]["Insert"];

export type ImportWorkSessionStatus = "unreviewed" | "reviewed";

export type ImportWorkSession = {
  id: string;
  fileName: string;
  fileType: SupportedImportFileType;
  rawContent: string;
  drafts: WorkSessionDraft[];
  status: ImportWorkSessionStatus;
  createdAt: string;
};

type CreateSessionInput = {
  fileName: string;
  fileType: SupportedImportFileType;
  rawContent: string;
  drafts: WorkSessionDraft[];
};

function now() {
  return new Date().toISOString();
}

function safeFileType(value?: string | null): SupportedImportFileType {
  if (value === ".md" || value === ".docx") return value;
  return ".txt";
}

function safeStatus(value?: string | null): ImportWorkSessionStatus {
  return value === "reviewed" ? "reviewed" : "unreviewed";
}

function draftsToJson(drafts: WorkSessionDraft[]): Json {
  return JSON.parse(JSON.stringify(drafts)) as Json;
}

function rowToSession(row: ImportWorkSessionRow): ImportWorkSession {
  const parsed = Array.isArray(row.parsed_items) ? row.parsed_items : [];
  return {
    id: row.id,
    fileName: row.file_name ?? "Imported Work Session",
    fileType: safeFileType(row.file_type ?? row.source_type),
    rawContent: row.raw_content ?? "",
    drafts: parsed as unknown as WorkSessionDraft[],
    status: safeStatus(row.status),
    createdAt: row.created_at ?? now(),
  };
}

function sessionToInsert(input: CreateSessionInput): ImportWorkSessionInsert {
  return {
    file_name: input.fileName,
    file_type: input.fileType,
    raw_content: input.rawContent,
    parsed_items: draftsToJson(input.drafts),
    status: "unreviewed",
    created_at: now(),
  };
}

export function useImportWorkSessions() {
  const [activeSession, setActiveSession] = useState<ImportWorkSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUnreviewedSession = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("import_work_sessions")
      .select("*")
      .eq("status", "unreviewed")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[useImportWorkSessions] load failed", error);
      setIsLoading(false);
      return null;
    }

    const next = data ? rowToSession(data as ImportWorkSessionRow) : null;
    setActiveSession(next);
    setIsLoading(false);
    return next;
  }, []);

  useEffect(() => {
    void loadUnreviewedSession();
  }, [loadUnreviewedSession]);

  const createSession = useCallback(async (input: CreateSessionInput) => {
    const { data, error } = await supabase
      .from("import_work_sessions")
      .insert(sessionToInsert(input))
      .select("*")
      .single();

    if (error || !data) {
      console.error("[useImportWorkSessions] create failed", error);
      throw error ?? new Error("Import work session could not be saved.");
    }

    const next = rowToSession(data as ImportWorkSessionRow);
    setActiveSession(next);
    return next;
  }, []);

  const updateSessionDrafts = useCallback(
    async (sessionId: string, drafts: WorkSessionDraft[]) => {
      const { data, error } = await supabase
        .from("import_work_sessions")
        .update({ parsed_items: draftsToJson(drafts), status: "unreviewed" })
        .eq("id", sessionId)
        .select("*")
        .single();

      if (error || !data) {
        console.error("[useImportWorkSessions] update drafts failed", error);
        throw error ?? new Error("Import work session could not be updated.");
      }

      const next = rowToSession(data as ImportWorkSessionRow);
      setActiveSession(next);
      return next;
    },
    [],
  );

  const markReviewed = useCallback(async (sessionId: string, drafts: WorkSessionDraft[]) => {
    const { data, error } = await supabase
      .from("import_work_sessions")
      .update({ parsed_items: draftsToJson(drafts), status: "reviewed" })
      .eq("id", sessionId)
      .select("*")
      .single();

    if (error || !data) {
      console.error("[useImportWorkSessions] mark reviewed failed", error);
      throw error ?? new Error("Import work session could not be marked reviewed.");
    }

    const next = rowToSession(data as ImportWorkSessionRow);
    setActiveSession(null);
    return next;
  }, []);

  return {
    activeSession,
    setActiveSession,
    isLoading,
    loadUnreviewedSession,
    createSession,
    updateSessionDrafts,
    markReviewed,
  };
}
