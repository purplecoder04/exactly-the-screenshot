import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Calendar,
  Camera,
  CheckSquare2,
  Coffee,
  Crown,
  FilePlus2,
  Flower2,
  Heart,
  Library,
  Lightbulb,
  Monitor,
  NotebookPen,
  Play,
  Plus,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { useTasks } from "@/hooks/useTasks";
import { useParkingLot } from "@/hooks/useParkingLot";
import { useWeeklyFocus, useReminder } from "@/hooks/useWeeklyData";
import { useContinueWorking } from "@/hooks/useContinueWorking";
import { DecisionEngineCard } from "@/components/dashboard/DecisionEngineCard";
import { SmartProgressCard } from "@/components/dashboard/SmartProgressCard";
import { PriorityBadge } from "@/components/shared/Badges";
import { TaskDialog } from "@/components/shared/TaskDialog";
import { ParkingLotDialog } from "@/components/shared/ParkingLotDialog";
import { cn } from "@/lib/utils";
import { plannerAssets, type PlannerAssetName } from "@/lib/plannerAssets";
import type { ContinueWorkingState, TaskItem, WorkspaceArea } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard - Best Collective CEO" },
      { name: "description", content: "A premium creative CEO planner for Best Collective." },
      { property: "og:title", content: "Best Collective CEO Dashboard" },
      { property: "og:description", content: "Your creative CEO studio and daily planner." },
    ],
  }),
  component: Dashboard,
});

const AREA_ROUTES: Record<WorkspaceArea, string> = {
  Brand: "/brand",
  Rise: "/rise",
  Land: "/land",
  Rebuild: "/rebuild",
  "Meet at the Heal": "/meet-at-the-heal",
  "Kit Factory App": "/kit-factory-app",
  "Social Media App": "/social-media-app",
  Website: "/website",
  "Social Media": "/social-media",
};

const PROJECTS = [
  {
    area: "Brand" as WorkspaceArea,
    subtitle: "Building the foundation",
    percent: 68,
    accent: "from-plum-soft to-orchid",
    decor: "goldSparkles" as PlannerAssetName,
  },
  {
    area: "Rise" as WorkspaceArea,
    subtitle: "Empowering women",
    percent: 74,
    accent: "from-orchid to-blush",
    decor: "hydrangea" as PlannerAssetName,
  },
  {
    area: "Land" as WorkspaceArea,
    subtitle: "Helping men lead",
    percent: 52,
    accent: "from-green-muted to-sage",
    decor: "leafSage" as PlannerAssetName,
  },
  {
    area: "Rebuild" as WorkspaceArea,
    subtitle: "Starting over strong",
    percent: 41,
    accent: "from-powder-blue to-green-muted",
    decor: "washBlue" as PlannerAssetName,
  },
  {
    area: "Meet at the Heal" as WorkspaceArea,
    subtitle: "Healing relationships",
    percent: 63,
    accent: "from-plum-soft to-gold",
    decor: "lavenderSprig" as PlannerAssetName,
  },
];

const MISSION_DECOR: PlannerAssetName[] = ["butterflyLavender", "leafBlush", "butterflyOrchid"];

const WORKSPACES = [
  { title: "CEO Studio", url: "/", icon: Crown, tint: "text-plum-soft bg-lavender/35" },
  { title: "Workbook Studio", url: "/rise", icon: BookOpen, tint: "text-orchid bg-blush/25" },
  { title: "Content Studio", url: "/social-media", icon: Camera, tint: "text-gold bg-gold/20" },
  {
    title: "Website Studio",
    url: "/website",
    icon: Monitor,
    tint: "text-powder-blue bg-powder-blue/30",
  },
  {
    title: "Resource Library",
    url: "/library",
    icon: Library,
    tint: "text-green-muted bg-sage/45",
  },
];

function Dashboard() {
  const { tasks, addTask, updateTask, endDayRollover } = useTasks();
  const { items: ideas, addItem } = useParkingLot();
  const { focus } = useWeeklyFocus();
  const { reminder } = useReminder();
  const { state: continueState, rememberTask } = useContinueWorking();

  const [taskOpen, setTaskOpen] = useState(false);
  const [ideaOpen, setIdeaOpen] = useState(false);
  const [editing, setEditing] = useState<TaskItem | null>(null);
  const [confirmEnd, setConfirmEnd] = useState(false);

  const todayTasks = useMemo(
    () =>
      [...tasks.filter((t) => t.isToday)].sort((a, b) => {
        const rank = (task: TaskItem) =>
          task.priority === "High" ? 3 : task.priority === "Medium" ? 2 : 1;
        return rank(b) - rank(a);
      }),
    [tasks],
  );

  const rememberedTask = useMemo(
    () => (continueState.taskId ? tasks.find((task) => task.id === continueState.taskId) : undefined),
    [continueState.taskId, tasks],
  );
  const continueTask = rememberedTask ?? todayTasks[0] ?? tasks.find((task) => !task.isDone) ?? tasks[0];
  const completedThisMonth = tasks.filter((task) => task.isDone).length;
  const gardenProgress = Math.min(
    100,
    Math.round((completedThisMonth / Math.max(tasks.length, 1)) * 100),
  );
  const weeklyFocusLine = focus
    .map((item) => item.value)
    .filter(Boolean)
    .slice(0, 4)
    .join(" • ");

  const openTask = (task?: TaskItem) => {
    setEditing(task ?? null);
    setTaskOpen(true);
  };

  return (
    <div className="space-y-5 pb-4">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_370px]">
        <div className="space-y-5">
          <DecisionEngineCard />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_0.9fr]">
            <ContinueWorkingCard
              task={continueTask}
              state={continueState}
              onResume={rememberTask}
            />
            <WorkspacesCard />
          </div>

          <PlannerSection
            title="Projects at a Glance"
            subtitle="A soft scan of the branches you are tending."
            action={
              <Link
                to="/brand"
                className="inline-flex items-center gap-1 text-xs font-semibold text-plum-soft hover:text-plum-deep"
              >
                See all projects <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {PROJECTS.map((project) => (
                <ProjectCard key={project.area} project={project} />
              ))}
            </div>
          </PlannerSection>
        </div>

        <aside className="space-y-4">
          <DailyInspirationCard reminder={reminder} />
          <SmartProgressCard />
          <ProgressGardenCard completed={completedThisMonth} progress={gardenProgress} />
          <IdeaGardenCard count={ideas.length} />
          <QuickActions onNewTask={() => openTask()} onNewIdea={() => setIdeaOpen(true)} />
        </aside>
      </div>

      <QuoteStrip weeklyFocus={weeklyFocusLine} />

      <TaskDialog
        open={taskOpen}
        onOpenChange={(open) => {
          setTaskOpen(open);
          if (!open) setEditing(null);
        }}
        initial={editing ?? { isToday: true }}
        onSubmit={(data) => {
          if (editing) {
            updateTask(editing.id, data);
            toast.success("Task updated.");
          } else {
            addTask(data);
            toast.success("Task added to Today.");
          }
        }}
      />

      <ParkingLotDialog
        open={ideaOpen}
        onOpenChange={setIdeaOpen}
        onSubmit={(data) => {
          addItem(data);
          toast.success("Idea planted.");
        }}
      />

      <AlertDialog open={confirmEnd} onOpenChange={setConfirmEnd}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">End the day?</AlertDialogTitle>
            <AlertDialogDescription>
              End today and roll unfinished tasks forward?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not yet</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                endDayRollover();
                toast.success("Day closed. Unfinished tasks rolled forward.");
              }}
            >
              End Day
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PlannerSection({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="planner-card rounded-2xl p-4 md:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-ink">
            <Sparkles className="h-4 w-4 text-gold" />
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function MissionTaskCard({
  index,
  task,
  onToggle,
  onEdit,
}: {
  index: number;
  task?: TaskItem;
  onToggle: (id: string) => void;
  onEdit: (task?: TaskItem) => void;
}) {
  if (!task) {
    return (
      <button
        className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-dashed border-blush/70 bg-warm-white/60 p-4 text-center text-sm text-muted-foreground transition hover:-translate-y-0.5 hover:bg-blush/10"
        onClick={() => onEdit()}
      >
        <Plus className="mb-2 h-5 w-5 text-plum-soft" />
        Add a mission task
      </button>
    );
  }

  return (
    <Card className="group relative min-h-36 overflow-hidden border-paper-line bg-warm-white/85 transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(90,48,73,0.14)]">
      <img
        aria-hidden="true"
        src={plannerAssets[MISSION_DECOR[index] ?? "butterflyBlush"]}
        alt=""
        className="pointer-events-none absolute -right-5 -top-6 h-24 w-24 object-contain opacity-20 mix-blend-multiply transition group-hover:opacity-30"
      />
      <CardContent className="relative flex h-full flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-plum-soft text-sm font-bold text-white shadow-sm">
            {index + 1}
          </span>
          <button
            className="rounded-full p-1 text-gold transition hover:bg-gold/15"
            title="Mark complete"
            onClick={() => onToggle(task.id)}
          >
            <Star className={cn("h-5 w-5", task.isDone && "fill-gold")} strokeWidth={1.4} />
          </button>
        </div>
        <button className="text-left" onClick={() => onEdit(task)}>
          <h3
            className={cn(
              "font-display text-xl font-semibold leading-snug text-ink",
              task.isDone && "line-through opacity-60",
            )}
          >
            {task.title}
          </h3>
        </button>
        <div className="mt-auto flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {task.project ?? task.branch}
          </span>
          <PriorityBadge priority={task.priority} />
        </div>
      </CardContent>
    </Card>
  );
}

function ContinueWorkingCard({
  task,
  state,
  onResume,
}: {
  task?: TaskItem;
  state: ContinueWorkingState;
  onResume: (task: TaskItem) => void;
}) {
  const areaUrl = state.lastPage || (task ? AREA_ROUTES[task.branch] : "/today");
  const pageTitle = labelForPage(state.lastPage);
  const title =
    state.lastProduct || task?.project || task?.title || pageTitle || "Choose your next beautiful thing";
  const subtitle =
    state.lastLesson ||
    state.lastWorkbook ||
    state.lastApp ||
    task?.type ||
    (state.lastBranch ? `${state.lastBranch} workspace` : "Creative Project");
  const nextStep =
    task?.nextStep ||
    (state.lastPage ? "Open the last place you were working." : "Open the studio and keep moving.");
  return (
    <section className="planner-card overflow-hidden rounded-2xl p-4 md:p-5">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-ink">
        <Sparkles className="h-4 w-4 text-gold" />
        Continue where you left off
      </h2>
      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <div className="flex min-h-56 items-center justify-center rounded-2xl border border-blush/50 bg-blush/15 shadow-inner">
          <img
            aria-hidden="true"
            src={plannerAssets.bookJournal}
            alt=""
            className="h-52 w-44 rotate-[-4deg] object-contain opacity-95 drop-shadow-[0_16px_24px_rgba(75,22,69,0.16)]"
          />
        </div>
        <div className="flex flex-col justify-center gap-3">
          <div>
            <h3 className="font-display text-3xl leading-tight text-ink">{title}</h3>
            <p className="mt-1 text-sm font-semibold text-plum-soft">{subtitle}</p>
            <p className="text-sm text-muted-foreground">{nextStep}</p>
            {state.lastBranch && (
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Last branch: {state.lastBranch}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Progress value={70} className="h-2 bg-blush/35" />
            <p className="text-xs font-semibold text-ink/75">70% Complete</p>
          </div>
          <Button asChild className="w-fit">
            <a href={areaUrl} onClick={() => task && onResume(task)}>
              <Play className="h-4 w-4 fill-current" />
              Resume
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function labelForPage(page: string) {
  const labels: Record<string, string> = {
    "/today": "Today's Top 3",
    "/brain-dump": "Brain Dump",
    "/parking-lot": "Idea Garden",
    "/import-tasks": "Import Work Session",
    "/weekly-planning": "Weekly Planning",
    "/weekly-log": "Weekly Log",
    "/products": "Product Catalog",
    "/frameworks": "Framework Library",
    "/library": "Library",
  };

  return labels[page] ?? "";
}

function WorkspacesCard() {
  return (
    <section className="planner-card rounded-2xl p-4 md:p-5">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-ink">
        <Sparkles className="h-4 w-4 text-gold" />
        Your Workspaces
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {WORKSPACES.map((workspace) => (
          <a
            key={workspace.title}
            href={workspace.url}
            className="flex min-h-28 flex-col items-center justify-center rounded-2xl border border-paper-line bg-warm-white/70 p-3 text-center text-xs font-semibold text-ink transition hover:-translate-y-0.5 hover:border-blush hover:shadow-sm"
          >
            <span className={cn("mb-2 rounded-xl p-3", workspace.tint)}>
              <workspace.icon className="h-6 w-6" strokeWidth={1.4} />
            </span>
            {workspace.title}
          </a>
        ))}
        <button
          className="flex min-h-28 flex-col items-center justify-center rounded-2xl border border-dashed border-gold/70 bg-warm-white/45 p-3 text-center text-xs font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-gold/10"
          onClick={() => toast.info("New workspace planning is coming soon.")}
        >
          <Plus className="mb-2 h-6 w-6 text-plum-soft" />
          New Workspace
        </button>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: (typeof PROJECTS)[number] }) {
  return (
    <a
      href={AREA_ROUTES[project.area]}
      className="relative overflow-hidden rounded-2xl border border-paper-line bg-warm-white/75 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(90,48,73,0.12)]"
    >
      <img
        aria-hidden="true"
        src={plannerAssets[project.decor]}
        alt=""
        className="pointer-events-none absolute -right-6 -top-5 h-20 w-20 object-contain opacity-20 mix-blend-multiply"
      />
      <div className="relative">
        <h3 className="font-display text-xl font-semibold text-ink">{project.area}</h3>
        <p className="mt-1 min-h-8 text-xs text-muted-foreground">{project.subtitle}</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-blush/30">
          <div
            className={cn("h-full rounded-full bg-gradient-to-r", project.accent)}
            style={{ width: `${project.percent}%` }}
          />
        </div>
        <div className="mt-1 text-right text-[11px] font-semibold text-ink/75">
          {project.percent}%
        </div>
      </div>
    </a>
  );
}

function DailyInspirationCard({ reminder }: { reminder: string }) {
  const quote =
    reminder.split("\n").filter(Boolean)[0] ?? "Girl... Build the simple version first.";
  return (
    <RailCard title="Daily Inspiration" icon={Sparkles} className="min-h-60">
      <div className="relative overflow-hidden rounded-2xl border border-blush/45 bg-warm-white/65 p-5">
        <img
          aria-hidden="true"
          src={plannerAssets.butterflyPurple}
          alt=""
          className="pointer-events-none absolute -right-4 bottom-1 h-24 w-24 object-contain opacity-20 mix-blend-multiply"
        />
        <p className="font-script text-4xl leading-tight text-plum-soft">{quote}</p>
        <Heart className="mt-5 h-5 w-5 fill-transparent text-orchid" strokeWidth={1.3} />
      </div>
    </RailCard>
  );
}

function ProgressGardenCard({ completed, progress }: { completed: number; progress: number }) {
  return (
    <RailCard title="Progress Garden" icon={Flower2}>
      <div className="grid grid-cols-[1fr_120px] items-center gap-3">
        <p className="text-sm leading-relaxed text-ink">
          Every step you take helps something grow.
        </p>
        <div
          className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[conic-gradient(var(--orchid)_0deg,var(--blush)_var(--progress),rgba(246,199,215,0.26)_0deg)] p-2"
          style={{ "--progress": `${progress * 3.6}deg` } as CSSProperties}
        >
          <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-warm-white text-center shadow-inner">
            <span className="text-3xl font-bold text-ink">{completed}</span>
            <span className="text-[10px] font-semibold text-muted-foreground">Tasks Bloomed</span>
          </div>
        </div>
      </div>
    </RailCard>
  );
}

function IdeaGardenCard({ count }: { count: number }) {
  return (
    <RailCard title="Idea Garden" icon={Lightbulb}>
      <div className="relative overflow-hidden rounded-2xl border border-paper-line bg-warm-white/65 p-4">
        <img
          aria-hidden="true"
          src={plannerAssets.jarGarden}
          alt=""
          className="pointer-events-none absolute -right-3 bottom-2 h-24 w-20 object-contain opacity-30 mix-blend-multiply"
        />
        <p className="max-w-48 text-sm leading-relaxed text-ink">
          Big ideas are just seeds. We'll let them grow.
        </p>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <div className="font-display text-3xl font-semibold text-plum-soft">{count}</div>
            <div className="text-xs font-semibold text-muted-foreground">Ideas Planted</div>
          </div>
          <Link
            to="/parking-lot"
            className="inline-flex items-center gap-1 text-xs font-semibold text-plum-soft"
          >
            See Garden <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </RailCard>
  );
}

function QuickActions({ onNewTask, onNewIdea }: { onNewTask: () => void; onNewIdea: () => void }) {
  const actions = [
    { label: "New Task", icon: CheckSquare2, onClick: onNewTask },
    {
      label: "New Note",
      icon: NotebookPen,
      onClick: () => toast.info("Weekly note capture is getting its planner pass in Stage 2."),
    },
    {
      label: "Schedule",
      icon: Calendar,
      onClick: () => toast.info("Schedule is a future studio tool."),
    },
    {
      label: "Brain Dump",
      icon: Brain,
      onClick: () => {
        window.location.href = "/brain-dump";
      },
    },
    { label: "Add Idea", icon: FilePlus2, onClick: onNewIdea },
  ];

  return (
    <RailCard title="Quick Actions" icon={Sparkles}>
      <div className="grid grid-cols-5 gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            className="flex min-h-20 flex-col items-center justify-center rounded-xl border border-paper-line bg-warm-white/65 p-2 text-center text-[11px] font-semibold text-ink transition hover:-translate-y-0.5 hover:border-blush hover:bg-blush/10"
            onClick={action.onClick}
          >
            <action.icon className="mb-2 h-5 w-5 text-plum-soft" strokeWidth={1.4} />
            {action.label}
          </button>
        ))}
      </div>
    </RailCard>
  );
}

function RailCard({
  title,
  icon: Icon,
  className,
  children,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("planner-card rounded-2xl p-4", className)}>
      <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-ink">
        <Icon className="h-4 w-4 text-gold" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function QuoteStrip({ weeklyFocus }: { weeklyFocus: string }) {
  return (
    <section className="planner-card relative grid items-center gap-4 overflow-hidden rounded-2xl px-6 py-5 md:grid-cols-[180px_1fr_320px]">
      <img
        aria-hidden="true"
        src={plannerAssets.dividerGold}
        alt=""
        className="pointer-events-none mx-auto hidden h-12 w-36 object-contain opacity-60 md:block"
      />
      <p className="text-center font-script text-3xl leading-snug text-plum-soft md:text-4xl">
        You are building more than a brand. You are building a legacy.
      </p>
      <div className="rounded-2xl border border-blush/60 bg-warm-white/72 p-4 shadow-sm">
        <div className="text-sm font-semibold text-plum-deep">This Week's Focus</div>
        <div className="mt-1 text-sm text-ink">
          {weeklyFocus || "Build • Create • Serve • Impact"}
        </div>
      </div>
    </section>
  );
}
