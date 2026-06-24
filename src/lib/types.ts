export const CORE_BRANCHES = [
  "Brand",
  "Rise",
  "Land",
  "Rebuild",
  "Meet at the Heal",
] as const;

export const WORKSTREAMS = [
  "Kit Factory App",
  "Social Media App",
  "Website",
  "Social Media",
] as const;

export type Branch = (typeof CORE_BRANCHES)[number];
export type Workstream = (typeof WORKSTREAMS)[number];
export type WorkspaceArea = Branch | Workstream;
export type AreaType = "Branch" | "Workstream";

export const ALL_AREAS: WorkspaceArea[] = [...CORE_BRANCHES, ...WORKSTREAMS];

export const STATUSES = [
  "Idea",
  "Outline",
  "Writing",
  "Testing",
  "Waiting",
  "Done",
] as const;
export type Status = (typeof STATUSES)[number];

export const PRIORITIES = ["High", "Medium", "Low"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const PROJECT_TYPES = [
  "Offer",
  "Workbook",
  "Guide",
  "App",
  "Website",
  "Content",
  "System",
  "Task",
  "Idea",
  "Book",
  "Couple Book",
  "Future Branch",
] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const PARKING_LOT_DECISIONS = ["Keep", "Maybe", "Later"] as const;
export type ParkingLotDecision = (typeof PARKING_LOT_DECISIONS)[number];

export type TaskItem = {
  id: string;
  title: string;
  branch: WorkspaceArea;
  areaType: AreaType;
  project?: string;
  type: ProjectType;
  status: Status;
  priority: Priority;
  nextStep: string;
  notes: string;
  isToday: boolean;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  rolloverCount?: number;
};

export type ParkingLotItem = {
  id: string;
  idea: string;
  branch: WorkspaceArea;
  areaType: AreaType;
  type: ProjectType;
  priority: Priority;
  decision: ParkingLotDecision;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type WeeklyFocus = {
  id: string;
  label: string;
  value: string;
};

export type WeeklyNote = {
  id: string;
  title: string;
  branch: WorkspaceArea;
  areaType: AreaType;
  note: string;
  date: string;
  createdAt: string;
};

export function areaTypeFor(area: WorkspaceArea): AreaType {
  return (CORE_BRANCHES as readonly string[]).includes(area) ? "Branch" : "Workstream";
}
