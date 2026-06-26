import {
  WORK_SESSION_CATEGORIES,
  areaTypeFor,
  type Priority,
  type ProjectType,
  type Status,
  type WorkSessionCategory,
  type WorkspaceArea,
} from "@/lib/types";

export type ConfidenceLevel = "High" | "Medium" | "Low";

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
  confidence: ConfidenceLevel;
  confidenceSignals: string[];
  collapsed?: boolean;
  saved?: boolean;
};

const PREFIX_CATEGORY: Array<[RegExp, WorkSessionCategory]> = [
  [/^\s*(TODO|Task|Next Step|Fix|Build|Add|Update|Test):\s*(.+?)\s*$/i, "Task"],
  [/^\s*Idea:\s*(.+?)\s*$/i, "Idea"],
  [/^\s*(Parking Lot|Idea Garden):\s*(.+?)\s*$/i, "Parking Lot"],
  [/^\s*Framework:\s*(.+?)\s*$/i, "Framework"],
  [/^\s*Product:\s*(.+?)\s*$/i, "Product"],
  [/^\s*(Decision):\s*(.+?)\s*$/i, "Decision"],
  [/^\s*Product Update:\s*(.+?)\s*$/i, "Product Update"],
  [/^\s*Meeting Note:\s*(.+?)\s*$/i, "Meeting Note"],
  [/^\s*License Rule:\s*(.+?)\s*$/i, "License Rule"],
  [/^\s*(Note|Class Notes|Personal Note):\s*(.+?)\s*$/i, "Note"],
  [/^\s*Founder Note:\s*(.+?)\s*$/i, "Founder Note"],
  [/^\s*Captured Insight:\s*(.+?)\s*$/i, "Captured Insight"],
  [/^\s*(Prompt|Prompt Idea):\s*(.+?)\s*$/i, "Prompt Idea"],
];

const KEYWORD_CATEGORY: Array<{ category: WorkSessionCategory; patterns: RegExp[] }> = [
  {
    category: "Framework",
    patterns: [
      /\bbelongs in the framework library\b/i,
      /\bis a framework\b/i,
      /\bframework:\s*/i,
      /\brule:\s*/i,
    ],
  },
  {
    category: "Decision",
    patterns: [/\bdecision:\s*/i, /\blocked\b/i, /\bwe decided\b/i, /\bconfirmed\b/i],
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
    category: "Parking Lot",
    patterns: [/\bparking lot:\s*/i, /\bidea garden:\s*/i, /\bpark this\b/i],
  },
  {
    category: "Task",
    patterns: [
      /\bneed(?:s)?(?:\s+to)?\b/i,
      /\bfinish(?:ed)?\b/i,
      /\bupdate\b/i,
      /\badd\b/i,
      /\bcreate\b/i,
      /\btest\b/i,
      /\bcall\b/i,
      /\breview\b/i,
    ],
  },
  {
    category: "Prompt Idea",
    patterns: [/\bprompt\b/i],
  },
  {
    category: "Product",
    patterns: [/\bproduct catalog\b/i, /\blesson\b/i, /\bbook\b/i, /\bchapter\b/i, /\bquiz\b/i],
  },
  {
    category: "License Rule",
    patterns: [/\blicense rule\b/i, /\blicensing rule\b/i],
  },
  {
    category: "Note",
    patterns: [/\bremember\b/i, /\bnote:\s*/i, /\bclass notes?\b/i, /\bpersonal note\b/i],
  },
];

type CategoryMatch = {
  category: WorkSessionCategory;
  matched: boolean;
};

type RoutingHint = {
  branch: WorkspaceArea;
  branchMatched: boolean;
  project?: string;
  projectMatched: boolean;
  categoryHint?: WorkSessionCategory;
};

type RoutingRule = {
  patterns: RegExp[];
  branch?: WorkspaceArea;
  project?: string;
  categoryHint?: WorkSessionCategory;
};

const ROUTING_RULES: RoutingRule[] = [
  {
    patterns: [/\bcall\b.*\binsurance\b/i, /\binsurance company\b/i],
    project: "Personal Admin",
    categoryHint: "Task",
  },
  {
    patterns: [/\bgrocer(?:y|ies)\b/i, /\bdentist\b/i, /\boil change\b/i],
    project: "Personal",
    categoryHint: "Task",
  },
  {
    patterns: [/\bresume\b/i],
    branch: "Rebuild",
  },
  {
    patterns: [/\bworkbook\b/i],
    branch: "Kit Factory App",
    project: "Kit Factory",
  },
  {
    patterns: [/\bframework\b/i],
    project: "Framework Library",
    categoryHint: "Framework",
  },
  {
    patterns: [/\bprompt\b/i],
    project: "Prompt Library",
    categoryHint: "Prompt Idea",
  },
  {
    patterns: [/\bvideo\b/i, /\breel\b/i, /\bsocial media\b/i],
    branch: "Social Media",
  },
  {
    patterns: [/\bwebsite\b/i, /\blanding page\b/i],
    branch: "Website",
  },
  {
    patterns: [/\blesson\b/i, /\bbook\b/i, /\bchapter\b/i, /\bquiz\b/i, /\bproduct catalog\b/i],
    project: "Product Catalog",
    categoryHint: "Product",
  },
  {
    patterns: [/\bcustomer\b/i, /\bpricing\b/i, /\bbrand\b/i],
    branch: "Brand",
  },
  {
    patterns: [/\brelationship\b/i, /\bheal\b/i],
    branch: "Meet at the Heal",
  },
  {
    patterns: [/\bdating\b/i, /\brise\b/i, /\bwoman\b/i, /\bwomen\b/i],
    branch: "Rise",
  },
  {
    patterns: [/\bmen\b/i, /\bland\b/i],
    branch: "Land",
  },
  {
    patterns: [/\brebuild\b/i],
    branch: "Rebuild",
  },
  {
    patterns: [/\bkit factory\b/i],
    branch: "Kit Factory App",
    project: "Kit Factory",
  },
  {
    patterns: [/\bapp\b/i],
    branch: "Kit Factory App",
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

function segmentToDraft(
  segment: string,
  index: number,
  sourceLabel: string,
): WorkSessionDraft | null {
  const cleaned = cleanSegment(segment);
  if (!cleaned) return null;
  if (isRemovedPlanningLabel(cleaned)) return null;

  const prefixed = prefixMatch(cleaned);
  const body = prefixed?.value ?? stripInlinePrefix(cleaned);
  if (!body) return null;

  const routing = inferRouting(body);
  const keywordMatch = classifyByKeyword(cleaned);
  const category =
    prefixed?.category ??
    (keywordMatch.matched ? keywordMatch.category : undefined) ??
    routing.categoryHint ??
    "Note";

  return baseDraft({
    index,
    sourceLabel,
    category,
    title: titleFrom(body),
    body,
    rawText: cleaned,
    routing,
    hasPrefix: Boolean(prefixed),
    keywordMatched: keywordMatch.matched,
    isNextStep: /^next step:/i.test(cleaned),
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

function isRemovedPlanningLabel(value: string) {
  const lower = value.toLowerCase();
  const label = lower.slice(0, lower.indexOf(":") + 1);
  if (!label) return false;
  const removed = ["current company", "current", "company"].map((prefix) => `${prefix} goal:`);
  return removed.includes(label.trim());
}

function prefixMatch(value: string) {
  for (const [regex, category] of PREFIX_CATEGORY) {
    const match = value.match(regex);
    if (!match) continue;
    const matchedValue = (match[2] ?? match[1] ?? "").trim();
    if (!matchedValue) return null;
    return { category, value: matchedValue };
  }
  return null;
}

function classifyByKeyword(value: string): CategoryMatch {
  for (const rule of KEYWORD_CATEGORY) {
    if (rule.patterns.some((pattern) => pattern.test(value))) {
      return { category: rule.category, matched: true };
    }
  }
  return { category: "Note", matched: false };
}

function stripInlinePrefix(value: string) {
  return value
    .replace(
      /^\s*(decision|idea|framework|product|product update|meeting note|note|class notes|personal note|founder note|prompt|prompt idea|rule):\s*/i,
      "",
    )
    .replace(/^\s*(parking lot|idea garden|license rule|captured insight):\s*/i, "")
    .trim();
}

function baseDraft({
  index,
  sourceLabel,
  category,
  title,
  body,
  rawText,
  routing,
  hasPrefix,
  keywordMatched,
  isNextStep = false,
}: {
  index: number;
  sourceLabel: string;
  category: WorkSessionCategory;
  title: string;
  body: string;
  rawText: string;
  routing: RoutingHint;
  hasPrefix: boolean;
  keywordMatched: boolean;
  isNextStep?: boolean;
}): WorkSessionDraft {
  const priority = inferPriority(body);
  const confidence = inferConfidence({
    category,
    priority,
    hasPrefix,
    keywordMatched,
    routing,
  });

  return {
    draftId: `draft_${index}_${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .slice(0, 28)}`,
    selected: true,
    category,
    title,
    body,
    branch: routing.branch,
    project: routing.project ?? inferProject(body),
    type: category === "Task" ? inferTaskType(body) : "Idea",
    status: category === "Task" ? "Idea" : "Outline",
    priority,
    nextStep: isNextStep ? title : "",
    notes: `Source: ${sourceLabel}\nOriginal: ${rawText}`,
    isToday: false,
    rawText,
    confidence: confidence.level,
    confidenceSignals: confidence.signals,
  };
}

function inferRouting(value: string): RoutingHint {
  const routing: RoutingHint = {
    branch: "Brand",
    branchMatched: false,
    projectMatched: false,
  };

  ROUTING_RULES.forEach((rule) => {
    if (!rule.patterns.some((pattern) => pattern.test(value))) return;

    if (rule.branch && !routing.branchMatched) {
      routing.branch = rule.branch;
      routing.branchMatched = true;
    }

    if (rule.project && !routing.projectMatched) {
      routing.project = rule.project;
      routing.projectMatched = true;
    }

    if (rule.categoryHint && !routing.categoryHint) {
      routing.categoryHint = rule.categoryHint;
    }
  });

  return routing;
}

function inferConfidence({
  category,
  priority,
  hasPrefix,
  keywordMatched,
  routing,
}: {
  category: WorkSessionCategory;
  priority: Priority;
  hasPrefix: boolean;
  keywordMatched: boolean;
  routing: RoutingHint;
}): { level: ConfidenceLevel; signals: string[] } {
  const destinationMatched = routing.branchMatched || routing.projectMatched;
  const categoryCertain = hasPrefix || keywordMatched || routing.categoryHint === category;
  const signals = [
    `${categoryCertain ? "Confirmed" : "Possible"} ${category}`,
    routing.branchMatched
      ? `Confirmed ${routing.branch}`
      : routing.projectMatched
        ? `Confirmed ${routing.project}`
        : "Unknown branch",
  ];

  if (category === "Task") {
    signals.push(`${priority} Priority`);
  }

  let level: ConfidenceLevel = "Low";
  if (hasPrefix || (categoryCertain && destinationMatched)) {
    level = "High";
  } else if (categoryCertain || destinationMatched) {
    level = "Medium";
  }

  return { level, signals };
}

function titleFrom(value: string) {
  return value.replace(/\s+/g, " ").slice(0, 110);
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
  if (lower.includes("website") || lower.includes("page") || lower.includes("shop"))
    return "Website";
  if (
    lower.includes("post") ||
    lower.includes("reel") ||
    lower.includes("hook") ||
    lower.includes("video")
  )
    return "Content";
  if (lower.includes("system") || lower.includes("bible") || lower.includes("prompt"))
    return "System";
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
