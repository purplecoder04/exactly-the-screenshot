export const STORAGE_KEYS = {
  tasks: "bc:tasks",
  parkingLot: "bc:parkingLot",
  weeklyFocus: "bc:weeklyFocus",
  reminder: "bc:reminder",
  weeklyNotes: "bc:weeklyNotes",
  weeklyPlan: "bc:weeklyPlan",
  productCatalog: "bc:productCatalog",
  frameworkLibrary: "bc:frameworkLibrary",
  capturedInsights: "bc:capturedInsights",
  brainDumpDraft: "bc:brainDumpDraft",
  continueWorking: "bc:continueWorking",
} as const;

export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}

export function newId(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}
