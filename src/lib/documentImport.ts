import {
  areaTypeFor,
  type Priority,
  type ProjectType,
  type Status,
  type TaskItem,
  type WorkspaceArea,
} from "@/lib/types";

type MammothModule = {
  extractRawText: (input: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
};

export type ImportedTaskDraft = Pick<
  TaskItem,
  | "title"
  | "branch"
  | "areaType"
  | "type"
  | "status"
  | "priority"
  | "nextStep"
  | "notes"
  | "isToday"
  | "isDone"
> & {
  draftId: string;
  selected: boolean;
  project?: string;
};

const SUPPORTED_EXTENSIONS = [".txt", ".md", ".docx"] as const;
const TASK_PREFIX_RE = /^\s*(TODO|Task|Next Step|Fix|Build|Add|Update|Test):\s*(.+?)\s*$/i;

export function isSupportedImportFile(fileName: string) {
  const lower = fileName.toLowerCase();
  return SUPPORTED_EXTENSIONS.some((extension) => lower.endsWith(extension));
}

export async function extractTextFromFile(file: File): Promise<string> {
  const lowerName = file.name.toLowerCase();

  if (lowerName.endsWith(".txt") || lowerName.endsWith(".md")) {
    return file.text();
  }

  if (lowerName.endsWith(".docx")) {
    const mammoth = (await import("mammoth")) as unknown as MammothModule;
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return result.value;
  }

  throw new Error("Upload a .txt, .md, or .docx file.");
}

export async function parseDocumentTextToTaskDrafts(
  text: string,
  fileName: string,
): Promise<ImportedTaskDraft[]> {
  return ruleBasedTaskParser(text, fileName);
}

export function ruleBasedTaskParser(text: string, fileName: string): ImportedTaskDraft[] {
  return text
    .split(/\r?\n/)
    .map((line, index) => lineToDraft(line, index, fileName))
    .filter((draft): draft is ImportedTaskDraft => Boolean(draft));
}

function lineToDraft(line: string, index: number, fileName: string): ImportedTaskDraft | null {
  const match = line.match(TASK_PREFIX_RE);
  if (!match) return null;

  const prefix = match[1].toLowerCase();
  const title = match[2].trim();
  if (!title) return null;

  const branch: WorkspaceArea = "Brand";
  const type: ProjectType = "Task";
  const status: Status = "Idea";
  const priority: Priority = "Medium";
  const isNextStep = prefix === "next step";

  return {
    draftId: `draft_${index}_${title.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 24)}`,
    selected: true,
    title,
    branch,
    areaType: areaTypeFor(branch),
    project: undefined,
    type,
    status,
    priority,
    nextStep: isNextStep ? title : "",
    notes: `Imported from ${fileName}\nOriginal line: ${line.trim()}`,
    isToday: false,
    isDone: false,
  };
}
