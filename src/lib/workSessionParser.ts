import {
  WORK_SESSION_CATEGORIES,
  areaTypeFor,
  type Priority,
  type ProjectType,
  type Status,
  type WorkSessionCategory,
  type WorkspaceArea,
} from "@/lib/types";

export type WorkSessionDraft = {
  draftId: string;
  selected: boolean;
  category: WorkSessionCategory;
  title: string;
  body: string;
  branch: WorkspaceArea;
  project?: string;
  type: ProjectType;
  status: Status;
  priority: Priority;
  nextStep: string;
  notes: string;
  isToday: boolean;
  rawText: string;
};

const PREFIX_CATEGORY: Array<[RegExp, WorkSessionCategory]> = [
  [/^\s*(TODO|Task|Next Step|Fix|Build|Add|Update|Test):\s*(.+?)\s*$/i, "Task"],
  [/^\s*Idea:\s*(.+?)\s*$/i, "Idea"],
  [/^\s*Framework:\s*(.+?)\s*$/i, "Framework"],
  [/^\s*(Decision):\s*(.+?)\s*$/i, "Decision"],
  [/^\s*Product Update:\s*(.+?)\s*$/i, "Product Update"],
  [/^\s*Meeting Note:\s*(.+?)\s*$/i, "Meeting Note"],
  [/^\s*(Note|Class Notes|Personal Note):\s*(.+?)\s*$/i, "Note"],
  [/^\s*Founder Note:\s*(.+?)\s*$/i, "Founder Note"],
  [/^\s*(Prompt|Prompt Idea):\s*(.+?)\s*$/i, "Prompt Idea"],
];

const KEYWORD_CATEGORY: Array<{ category: WorkSessionCategory; patterns: RegExp[] }> = [
  {
    category: "Framework",
    patterns: [
      /\bbelongs in the framework library\b/i,
      /\bis a framework\b/i,
      /\brule:\s*/i,
    ],
  },
  {
    category: "Decision",
    patterns: [
      /\bdecision:\s*/i,
      /\blocked\b/i,
      /\bwe decided\b/i,
      /\bconfirmed\b/i,
    ],
  },
  {
    category: "Idea",
    patterns: [
      /\bidea:\s*/i,
      /\bmaybe\b/i,
      /\bshould add\b/i,
      /\bwould be cool\b/i,
      /\bfuture idea\b/i,
    ],
  },
  {
    category: "Task",
    patterns: [
      /\bneed to\b/i,
      /\bfinish\b/i,
      /\bupdate\b/i,
      /\badd\b/i,
      /\bcreate\b/i,
      /\btest\b/i,
      /\bcall\b/i,
      /\breview\b/i,
    ],
  },
  {
    category: "Note",
    patterns: [
      /\bremember\b/i,
      /\bnote:\s*/i,
      /\bclass notes?\b/i,
      /\bpersonal note\b/i,
    ],
  },
];

export async function parseTextToWorkSessionDrafts(
  text: string,
  sourceLabel = "Brain Dump",
): Promise<WorkSessionDraft[]> {
  return ruleBasedWorkSessionParser(text, sourceLabel);
}

export function ruleBasedWorkSessionParser(text: string, sourceLabel = "Brain Dump") {
  return extractSegments(text)
    .map((segment, index) => segmentToDraft(segment, index, sourceLabel))
    .filter((draft): draft is WorkSessionDraft => Boolean(draft));
}

function segmentToDraft(segment: string, index: number, sourceLabel: string): WorkSessionDraft | null {
  const cleaned = cleanSegment(segment);
  if (!cleaned) return null;

  for (const [regex, category] of PREFIX_CATEGORY) {
    const match = cleaned.match(regex);
    if (!match) continue;
    const value = (match[2] ?? match[1] ?? "").trim();
    if (!value) return null;
    return baseDraft({
      index,
      sourceLabel,
      category,
      title: titleFrom(value),
      body: value,
      rawText: cleaned,
      isNextStep: /^next step:/i.test(cleaned),
    });
  }

  const category = classifyByKeyword(cleaned);
  return baseDraft({
    index,
    sourceLabel,
    category,
    title: titleFrom(stripInlinePrefix(cleaned)),
    body: stripInlinePrefix(cleaned),
    rawText: cleaned,
  });
}

function extractSegments(text: string) {
  return text
    .replace(/\r/g, "")
    .split(/\n+/)
    .flatMap((line) => {
      const cleanLine = cleanSegment(line);
      if (!cleanLine) return [];
      return splitIntoSentences(cleanLine);
    })
    .map(cleanSegment)
    .filter(Boolean);
}

function splitIntoSentences(value: string) {
  const pieces = value.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  return pieces && pieces.length > 0 ? pieces : [value];
}

function cleanSegment(value: string) {
  return value
    .trim()
    .replace(/^\s*[-*]\s+/, "")
    .replace(/^\s*\d+[.)]\s+/, "")
    .trim();
}

function classifyByKeyword(value: string): WorkSessionCategory {
  for (const rule of KEYWORD_CATEGORY) {
    if (rule.patterns.some((pattern) => pattern.test(value))) return rule.category;
  }
  return "Note";
}

function stripInlinePrefix(value: string) {
  return value
    .replace(/^\s*(decision|idea|framework|note|class notes|personal note|rule):\s*/i, "")
    .trim();
}

function baseDraft({
  index,
  sourceLabel,
  category,
  title,
  body,
  rawText,
  isNextStep = false,
}: {
  index: number;
  sourceLabel: string;
  category: WorkSessionCategory;
  title: string;
  body: string;
  rawText: string;
  isNextStep?: boolean;
}): WorkSessionDraft {
  const branch: WorkspaceArea = inferBranch(body);
  return {
    draftId: `draft_${index}_${title.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 28)}`,
    selected: true,
    category,
    title,
    body,
    branch,
    project: inferProject(body),
    type: category === "Task" ? inferTaskType(body) : "Idea",
    status: category === "Task" ? "Idea" : "Outline",
    priority: inferPriority(body),
    nextStep: isNextStep ? title : "",
    notes: `Source: ${sourceLabel}\nOriginal: ${rawText}`,
    isToday: false,
    rawText,
  };
}

function titleFrom(value: string) {
  return value.replace(/\s+/g, " ").slice(0, 110);
}

function inferBranch(value: string): WorkspaceArea {
  const lower = value.toLowerCase();
  if (lower.includes("rise") || lower.includes("woman") || lower.includes("women")) return "Rise";
  if (lower.includes("land") || lower.includes("men ")) return "Land";
  if (lower.includes("rebuild")) return "Rebuild";
  if (lower.includes("heal") || lower.includes("couple")) return "Meet at the Heal";
  if (lower.includes("kit factory")) return "Kit Factory App";
  if (lower.includes("social")) return "Social Media";
  if (lower.includes("website") || lower.includes("shop")) return "Website";
  return "Brand";
}

function inferProject(value: string) {
  const match = value.match(/(?:for|on|in)\s+([A-Z][A-Za-z0-9' ]{2,40})/);
  return match?.[1]?.trim();
}

function inferTaskType(value: string): ProjectType {
  const lower = value.toLowerCase();
  if (lower.includes("workbook")) return "Workbook";
  if (lower.includes("guide") || lower.includes("lesson")) return "Guide";
  if (lower.includes("app")) return "App";
  if (lower.includes("website") || lower.includes("page") || lower.includes("shop")) return "Website";
  if (lower.includes("post") || lower.includes("reel") || lower.includes("hook")) return "Content";
  if (lower.includes("system") || lower.includes("bible") || lower.includes("prompt")) return "System";
  if (lower.includes("book")) return "Book";
  return "Task";
}

function inferPriority(value: string): Priority {
  const lower = value.toLowerCase();
  if (/\b(urgent|important|block|blocking|launch|today|high)\b/.test(lower)) return "High";
  if (/\b(low|later|someday)\b/.test(lower)) return "Low";
  return "Medium";
}

export function isTaskCategory(category: WorkSessionCategory) {
  return category === "Task";
}

export function selectableCategories() {
  return WORK_SESSION_CATEGORIES;
}

export function draftAreaType(branch: WorkspaceArea) {
  return areaTypeFor(branch);
}
