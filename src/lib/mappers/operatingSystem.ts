import type { Database } from "@/integrations/supabase/types";
import {
  ALL_AREAS,
  DECISION_OUTCOMES,
  LIBRARY_CATEGORIES,
  CORE_BRANCHES,
  areaTypeFor,
  type Branch,
  type CapturedInsight,
  type CapturedInsightParsedType,
  type CapturedInsightStatus,
  type ContinueWorkingState,
  type DecisionItem,
  type DecisionItemStatus,
  type DecisionOutcome,
  type DecisionSupportItem,
  type LibraryCategory,
  type LibraryItem,
  type Priority,
  type WeeklyNote,
  type WeeklyPlan,
  type WorkSessionCategory,
  type WorkspaceArea,
} from "@/lib/types";
import type { WorkSessionDraft } from "@/lib/workSessionParser";

type Tables = Database["public"]["Tables"];

export type CapturedInsightRow = Tables["captured_insights"]["Row"];
export type CapturedInsightInsert = Tables["captured_insights"]["Insert"];
export type ContinueWorkingRow = Tables["continue_working_state"]["Row"];
export type ContinueWorkingInsert = Tables["continue_working_state"]["Insert"];
export type DecisionRow = Tables["decision_items"]["Row"];
export type DecisionInsert = Tables["decision_items"]["Insert"];
export type LibraryItemRow = Tables["library_items"]["Row"];
export type LibraryItemInsert = Tables["library_items"]["Insert"];
export type WeeklyNoteRow = Tables["weekly_notes"]["Row"];
export type WeeklyNoteInsert = Tables["weekly_notes"]["Insert"];
export type WeeklyPlanRow = Tables["weekly_plans"]["Row"];
export type WeeklyPlanInsert = Tables["weekly_plans"]["Insert"];

const BC_PAYLOAD_VERSION = 1;

type PackedPayload<T> = {
  __bcKind: string;
  version: number;
  data: T;
};

function now() {
  return new Date().toISOString();
}

function pack<T>(kind: string, data: T): string {
  return JSON.stringify({ __bcKind: kind, version: BC_PAYLOAD_VERSION, data });
}

function unpack<T>(kind: string, value?: string | null): Partial<T> | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<PackedPayload<Partial<T>>>;
    if (parsed && parsed.__bcKind === kind && parsed.data && typeof parsed.data === "object") {
      return parsed.data;
    }
  } catch {
    return null;
  }
  return null;
}

function packedKind(value?: string | null): string {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value) as Partial<PackedPayload<unknown>>;
    return parsed.__bcKind ?? "";
  } catch {
    return "";
  }
}

function safeArea(value?: string | null): WorkspaceArea {
  return ALL_AREAS.includes(value as WorkspaceArea) ? (value as WorkspaceArea) : "Brand";
}

function safeOptionalArea(value?: string | null): WorkspaceArea | undefined {
  return ALL_AREAS.includes(value as WorkspaceArea) ? (value as WorkspaceArea) : undefined;
}

function safeBranchFocus(value?: string | null): Branch | "" {
  return CORE_BRANCHES.includes(value as Branch) ? (value as Branch) : "";
}

function safeLibraryCategory(value?: string | null): LibraryCategory {
  return LIBRARY_CATEGORIES.includes(value as LibraryCategory)
    ? (value as LibraryCategory)
    : "Company";
}

function safeDecisionOutcome(value?: string | null): DecisionOutcome {
  return DECISION_OUTCOMES.includes(value as DecisionOutcome)
    ? (value as DecisionOutcome)
    : "Needs Decision";
}

function safeDecisionItemStatus(value?: string | null): DecisionItemStatus {
  return value === "accepted" || value === "dismissed" ? value : "pending";
}

function safePriority(value?: string | null): Priority {
  return value === "High" || value === "Low" ? value : "Medium";
}

function safeInsightCategory(value?: string | null): CapturedInsight["category"] {
  const category = value as WorkSessionCategory;
  if (["Task", "Idea", "Parking Lot", "Framework"].includes(category)) return "Captured Insight";
  return (category || "Captured Insight") as CapturedInsight["category"];
}

function safeCapturedInsightStatus(value?: string | null): CapturedInsightStatus {
  return value === "reviewed" || value === "converted" ? value : "unreviewed";
}

function safeParsedType(value?: string | null): CapturedInsightParsedType {
  if (
    value === "task" ||
    value === "idea" ||
    value === "framework" ||
    value === "product" ||
    value === "decision"
  ) {
    return value;
  }
  return "note";
}

function parsedTypeToCategory(value?: string | null): WorkSessionCategory {
  const parsedType = safeParsedType(value);
  if (parsedType === "task") return "Task";
  if (parsedType === "idea") return "Idea";
  if (parsedType === "framework") return "Framework";
  if (parsedType === "product") return "Product";
  if (parsedType === "decision") return "Decision";
  return "Note";
}

export function categoryToCapturedInsightParsedType(
  category: WorkSessionCategory,
): CapturedInsightParsedType {
  if (category === "Task") return "task";
  if (category === "Idea" || category === "Parking Lot") return "idea";
  if (category === "Framework") return "framework";
  if (category === "Product" || category === "Product Update") return "product";
  if (category === "Decision") return "decision";
  return "note";
}

function parseTopProjects(value?: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean).slice(0, 3);
  } catch {
    /* fall back to plain text parsing */
  }
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export function rowToWeeklyPlan(row: WeeklyPlanRow): WeeklyPlan {
  return {
    weeklyFocus: row.weekly_focus ?? "",
    topProjects: parseTopProjects(row.top_projects),
    biggestRisk: row.biggest_risk ?? "",
    waitingOn: row.waiting_on ?? "",
    successThisWeek: row.success_this_week ?? "",
    branchFocus: safeBranchFocus(row.branch_focus),
    updatedAt: row.updated_at ?? row.created_at ?? now(),
  };
}

export function weeklyPlanToInsert(plan: WeeklyPlan): WeeklyPlanInsert {
  const timestamp = plan.updatedAt || now();
  return {
    weekly_focus: plan.weeklyFocus,
    top_projects: JSON.stringify(plan.topProjects.filter(Boolean).slice(0, 3)),
    biggest_risk: plan.biggestRisk,
    waiting_on: plan.waitingOn,
    success_this_week: plan.successThisWeek,
    branch_focus: plan.branchFocus || null,
    week_start_date: new Date().toISOString().slice(0, 10),
    updated_at: timestamp,
  };
}

export function rowToDecision(row: DecisionRow): DecisionSupportItem {
  const payload = unpack<DecisionSupportItem>("decision-support", row.description);
  const branch = safeArea(payload?.branch ?? row.related_branch);
  return {
    id: row.id,
    title: row.title,
    context: payload?.context ?? row.description ?? "",
    branch,
    urgency: payload?.urgency ?? 3,
    impact: payload?.impact ?? 3,
    effort: payload?.effort ?? 2,
    clarity: payload?.clarity ?? 3,
    reversible: payload?.reversible ?? true,
    score: payload?.score ?? 0,
    outcome: payload?.outcome ?? safeDecisionOutcome(row.status),
    notes: payload?.notes ?? "",
    createdAt: row.created_at ?? now(),
    updatedAt: payload?.updatedAt ?? row.updated_at ?? row.created_at ?? now(),
  };
}

export function decisionToInsert(decision: DecisionSupportItem): DecisionInsert {
  const timestamp = decision.updatedAt || now();
  return {
    title: decision.title,
    description: pack("decision-support", decision),
    status: "pending",
    priority: decision.outcome === "Do Now" ? "High" : "Medium",
    related_branch: decision.branch,
    created_at: decision.createdAt,
    updated_at: timestamp,
  };
}

export function isDecisionSupportRow(row: DecisionRow): boolean {
  return packedKind(row.description) === "decision-support";
}

export function isDecisionEngineRow(row: DecisionRow): boolean {
  return packedKind(row.description) === "decision-engine-recommendation";
}

type DecisionEnginePayload = {
  description: string;
  taskId?: string;
  reasons?: string[];
  estimatedMinutes?: number;
  impactLabel?: "High" | "Medium" | "Low";
};

export function rowToDecisionItem(row: DecisionRow): DecisionItem {
  const payload = unpack<DecisionEnginePayload>("decision-engine-recommendation", row.description);
  return {
    id: row.id,
    title: row.title,
    description: payload?.description ?? row.description ?? "",
    status: safeDecisionItemStatus(row.status),
    priority: safePriority(row.priority),
    relatedBranch: safeOptionalArea(row.related_branch) ?? "",
    taskId: payload?.taskId,
    reasons: payload?.reasons,
    estimatedMinutes: payload?.estimatedMinutes,
    impactLabel: payload?.impactLabel,
    createdAt: row.created_at ?? now(),
    updatedAt: row.updated_at ?? row.created_at ?? now(),
  };
}

export function decisionItemToInsert(item: DecisionItem): DecisionInsert {
  const timestamp = item.updatedAt || now();
  const payload: DecisionEnginePayload = {
    description: item.description,
    taskId: item.taskId,
    reasons: item.reasons,
    estimatedMinutes: item.estimatedMinutes,
    impactLabel: item.impactLabel,
  };
  return {
    title: item.title,
    description: pack("decision-engine-recommendation", payload),
    status: item.status,
    priority: item.priority,
    related_branch: item.relatedBranch || null,
    created_at: item.createdAt,
    updated_at: timestamp,
  };
}

export function rowToContinueWorking(row: ContinueWorkingRow): ContinueWorkingState {
  return {
    lastBranch: safeOptionalArea(row.branch) ?? "",
    lastProduct: row.product ?? "",
    lastLesson: row.lesson ?? "",
    lastWorkbook: row.workbook ?? "",
    lastApp: row.app ?? "",
    lastPage: row.page ?? "/",
    taskId: row.task ?? undefined,
    updatedAt: row.updated_at ?? now(),
  };
}

export function continueWorkingToInsert(state: ContinueWorkingState): ContinueWorkingInsert {
  return {
    branch: state.lastBranch || null,
    product: state.lastProduct || null,
    lesson: state.lastLesson || null,
    workbook: state.lastWorkbook || null,
    app: state.lastApp || null,
    page: state.lastPage || null,
    task: state.taskId ?? null,
    updated_at: state.updatedAt,
  };
}

export function rowToCapturedInsight(row: CapturedInsightRow): CapturedInsight {
  const rawValue = row.raw_text ?? row.content;
  const payload = unpack<CapturedInsight>("captured-insight", rawValue);
  const draftPayload = unpack<CapturedInsightDraftPayload>("brain-dump-draft", rawValue);
  const draft = draftPayload?.draft;
  const plainTitle = rawValue.split("\n")[0]?.slice(0, 90) || "Captured Insight";
  return {
    id: row.id,
    category: safeInsightCategory(payload?.category ?? draft?.category ?? row.source),
    title: payload?.title ?? draft?.title ?? plainTitle,
    body: payload?.body ?? draft?.body ?? rawValue,
    branch: safeOptionalArea(payload?.branch ?? draft?.branch ?? row.branch),
    project: payload?.project ?? draft?.project ?? "",
    notes: payload?.notes ?? draft?.notes ?? "",
    createdAt: row.created_at ?? now(),
    updatedAt: payload?.updatedAt ?? row.created_at ?? now(),
  };
}

export function capturedInsightToInsert(item: CapturedInsight): CapturedInsightInsert {
  const rawText = pack("captured-insight", item);
  return {
    branch: item.branch ?? null,
    content: rawText,
    raw_text: rawText,
    parsed_type: categoryToCapturedInsightParsedType(item.category),
    source: item.category,
    status: "reviewed",
    created_at: item.createdAt,
  };
}

type CapturedInsightDraftPayload = {
  source: "Brain Dump";
  draft: WorkSessionDraft;
};

export function capturedInsightDraftToInsert(draft: WorkSessionDraft): CapturedInsightInsert {
  const rawText = pack("brain-dump-draft", { source: "Brain Dump", draft });
  return {
    branch: draft.branch,
    content: draft.rawText || draft.title,
    raw_text: rawText,
    parsed_type: categoryToCapturedInsightParsedType(draft.category),
    source: "Brain Dump",
    status: "unreviewed",
    created_at: now(),
  };
}

export function capturedInsightDraftToUpdate(
  draft: WorkSessionDraft,
): Partial<CapturedInsightInsert> {
  const { created_at, ...update } = capturedInsightDraftToInsert(draft);
  return update;
}

export function rowToWorkSessionDraft(row: CapturedInsightRow): WorkSessionDraft {
  const rawValue = row.raw_text ?? row.content;
  const payload = unpack<CapturedInsightDraftPayload>("brain-dump-draft", rawValue);
  if (payload?.draft) {
    return {
      ...payload.draft,
      draftId: row.id,
      selected: payload.draft.selected ?? true,
      saved: safeCapturedInsightStatus(row.status) !== "unreviewed",
    };
  }

  const category = parsedTypeToCategory(row.parsed_type);
  const title = row.content || rawValue.split("\n")[0]?.slice(0, 110) || "Captured insight";
  return {
    draftId: row.id,
    selected: true,
    category,
    title,
    body: row.content || rawValue,
    branch: safeArea(row.branch),
    project: "",
    type: category === "Task" ? "Task" : "Idea",
    status: category === "Task" ? "Idea" : "Outline",
    priority: "Medium",
    nextStep: "",
    notes: "Source: Brain Dump",
    isToday: false,
    rawText: rawValue,
    confidence: "Low",
    confidenceSignals: ["Recovered from captured insight"],
    saved: safeCapturedInsightStatus(row.status) !== "unreviewed",
  };
}

export function rowToLibraryItem(row: LibraryItemRow): LibraryItem {
  const body = row.content_body ?? row.content;
  const payload = unpack<LibraryItem>("library-item", body);
  return {
    id: row.id,
    title: row.title,
    category: safeLibraryCategory(payload?.category ?? row.category),
    location: payload?.location ?? "",
    linkedProduct: payload?.linkedProduct ?? "",
    notes: payload?.notes ?? row.description ?? body ?? "",
    createdAt: row.created_at ?? now(),
    updatedAt: payload?.updatedAt ?? row.updated_at ?? row.created_at ?? now(),
  };
}

export function libraryItemToInsert(item: LibraryItem): LibraryItemInsert {
  const body = pack("library-item", item);
  return {
    title: item.title,
    category: item.category,
    branch: item.location || null,
    description: item.notes || item.linkedProduct || item.location || null,
    content: body,
    content_body: body,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

export function rowToWeeklyNote(row: WeeklyNoteRow): WeeklyNote {
  const payload = unpack<WeeklyNote>("weekly-note", row.note);
  const branch = safeArea(payload?.branch ?? row.type);
  return {
    id: row.id,
    title: payload?.title ?? row.type ?? "Weekly note",
    branch,
    areaType: areaTypeFor(branch),
    note: payload?.note ?? row.note ?? "",
    date: payload?.date ?? row.week_start ?? (row.created_at ?? now()).slice(0, 10),
    createdAt: row.created_at ?? now(),
  };
}

export function weeklyNoteToInsert(note: WeeklyNote): WeeklyNoteInsert {
  return {
    type: note.branch,
    note: pack("weekly-note", note),
    week_start: note.date,
    created_at: note.createdAt,
  };
}
