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

export const PRODUCT_STATUSES = ["Idea", "Building", "Active", "Paused", "Complete"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const PRODUCT_CATALOG_TYPES = [
  "Lesson Guide",
  "Workbook",
  "Quiz",
  "App",
  "Website",
  "Bundle",
  "Bridge Product",
  "Book",
  "Course",
  "Other",
] as const;
export type ProductCatalogType = (typeof PRODUCT_CATALOG_TYPES)[number];

export const WORK_SESSION_CATEGORIES = [
  "Task",
  "Idea",
  "Framework",
  "Decision",
  "Product Update",
  "Meeting Note",
  "Note",
  "Founder Note",
  "Prompt Idea",
] as const;
export type WorkSessionCategory = (typeof WORK_SESSION_CATEGORIES)[number];

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

export type CompanyGoal = {
  title: string;
  notes: string;
  updatedAt: string;
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

export type WeeklyPlan = {
  weeklyGoal: string;
  topProjects: string[];
  biggestRisk: string;
  waitingOn: string;
  successThisWeek: string;
  updatedAt: string;
};

export type ProductCatalogItem = {
  id: string;
  name: string;
  branch: WorkspaceArea;
  areaType: AreaType;
  collection: string;
  type: ProductCatalogType;
  status: ProductStatus;
  lessonGuide: string;
  workbook: string;
  quiz: string;
  app: string;
  website: string;
  bundle: string;
  bridgeProduct: string;
  version: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type FrameworkItem = {
  id: string;
  name: string;
  definition: string;
  purpose: string;
  relatedBooks: string;
  relatedQuizzes: string;
  relatedApps: string;
  relatedLessons: string;
  relatedSocialPosts: string;
  relatedProducts: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type CapturedInsight = {
  id: string;
  category: Exclude<WorkSessionCategory, "Task" | "Idea" | "Framework">;
  title: string;
  body: string;
  branch?: WorkspaceArea;
  project?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type ContinueWorkingState = {
  lastBranch: WorkspaceArea | "";
  lastProduct: string;
  lastLesson: string;
  lastWorkbook: string;
  lastApp: string;
  lastPage: string;
  taskId?: string;
  updatedAt: string;
};

export function areaTypeFor(area: WorkspaceArea): AreaType {
  return (CORE_BRANCHES as readonly string[]).includes(area) ? "Branch" : "Workstream";
}
