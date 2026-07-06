import type { Database } from "@/integrations/supabase/types";
import {
  ALL_AREAS,
  DECISION_OUTCOMES,
  LIBRARY_CATEGORIES,
  CORE_BRANCHES,
  areaTypeFor,
  type Branch,
  type CapturedInsight,
  type ContinueWorkingState,
  type DecisionOutcome,
  type DecisionSupportItem,
  type LibraryCategory,
  type LibraryItem,
  type WeeklyNote,
  type WeeklyPlan,
  type WorkSessionCategory,
  type WorkspaceArea,
} from "@/lib/types";

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

function safeInsightCategory(value?: string | null): CapturedInsight["category"] {
  const category = value as WorkSessionCategory;
  if (["Task", "Idea", "Parking Lot", "Framework"].includes(category)) return "Captured Insight";
  return (category || "Captured Insight") as CapturedInsight["category"];
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
  const payload = unpack<DecisionSupportItem>("decision-support", row.context);
  const branch = safeArea(payload?.branch ?? row.branch);
  return {
    id: row.id,
    title: row.title,
    context: payload?.context ?? row.context ?? "",
    branch,
    urgency: payload?.urgency ?? 3,
    impact: payload?.impact ?? 3,
    effort: payload?.effort ?? 2,
    clarity: payload?.clarity ?? 3,
    reversible: payload?.reversible ?? true,
    score: payload?.score ?? 0,
    outcome: payload?.outcome ?? safeDecisionOutcome(row.decision ?? row.status),
    notes: payload?.notes ?? "",
    createdAt: row.created_at ?? now(),
    updatedAt: payload?.updatedAt ?? row.created_at ?? now(),
  };
}

export function decisionToInsert(decision: DecisionSupportItem): DecisionInsert {
  return {
    title: decision.title,
    branch: decision.branch,
    context: pack("decision-support", decision),
    decision: decision.outcome,
    status: decision.outcome,
    created_at: decision.createdAt,
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
  const payload = unpack<CapturedInsight>("captured-insight", row.content);
  const plainTitle = row.content.split("\n")[0]?.slice(0, 90) || "Captured Insight";
  return {
    id: row.id,
    category: safeInsightCategory(payload?.category ?? row.source),
    title: payload?.title ?? plainTitle,
    body: payload?.body ?? row.content,
    branch: safeOptionalArea(payload?.branch ?? row.branch),
    project: payload?.project ?? "",
    notes: payload?.notes ?? "",
    createdAt: row.created_at ?? now(),
    updatedAt: payload?.updatedAt ?? row.created_at ?? now(),
  };
}

export function capturedInsightToInsert(item: CapturedInsight): CapturedInsightInsert {
  return {
    branch: item.branch ?? null,
    content: pack("captured-insight", item),
    source: item.category,
    created_at: item.createdAt,
  };
}

export function rowToLibraryItem(row: LibraryItemRow): LibraryItem {
  const payload = unpack<LibraryItem>("library-item", row.content);
  return {
    id: row.id,
    title: row.title,
    category: safeLibraryCategory(payload?.category ?? row.category),
    location: payload?.location ?? "",
    linkedProduct: payload?.linkedProduct ?? "",
    notes: payload?.notes ?? row.content ?? "",
    createdAt: row.created_at ?? now(),
    updatedAt: payload?.updatedAt ?? row.created_at ?? now(),
  };
}

export function libraryItemToInsert(item: LibraryItem): LibraryItemInsert {
  return {
    title: item.title,
    category: item.category,
    content: pack("library-item", item),
    created_at: item.createdAt,
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
