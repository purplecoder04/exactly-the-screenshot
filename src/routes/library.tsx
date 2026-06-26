import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Archive, BookOpen, Brain, Library, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AreaPill } from "@/components/shared/AreaPill";
import { PlannerPageHeader, PlannerPanel } from "@/components/shared/PlannerPageHeader";
import { useCapturedInsights } from "@/hooks/useCapturedInsights";
import { useFrameworkLibrary } from "@/hooks/useFrameworkLibrary";
import { useParkingLot } from "@/hooks/useParkingLot";
import { useProductCatalog } from "@/hooks/useProductCatalog";
import { useTasks } from "@/hooks/useTasks";
import { useWeeklyNotes } from "@/hooks/useWeeklyData";
import { plannerAssets } from "@/lib/plannerAssets";
import { CORE_BRANCHES, WORKSTREAMS, type WorkspaceArea } from "@/lib/types";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library - Best Collective" },
      { name: "description", content: "Search the Best Collective operating library." },
    ],
  }),
  component: LibraryPage,
});

const SECTIONS = [
  { title: "Company", url: "/", description: "Goals, weekly planning, CEO decisions." },
  { title: "Brand", url: "/brand", description: "Voice, offers, positioning, bibles." },
  { title: "Rise", url: "/rise", description: "Women, repair, return, emotional clarity." },
  { title: "Land", url: "/land", description: "Men, leadership, grounded action." },
  { title: "Rebuild", url: "/rebuild", description: "Starting over strong." },
  { title: "Meet at the Heal", url: "/meet-at-the-heal", description: "Couples, repair, rebuilding trust." },
  { title: "Kit Factory", url: "/kit-factory-app", description: "Production system and app work." },
  { title: "Apps", url: "/products", description: "Apps, websites, quizzes, bundles." },
  { title: "Framework Library", url: "/frameworks", description: "Teaching models and definitions." },
  { title: "Prompt Library", url: "/brain-dump", description: "Prompt ideas captured from work sessions." },
  { title: "Teaching Bible", url: "/frameworks", description: "Frameworks, lessons, examples." },
  { title: "Communication Bible", url: "/weekly-log", description: "Notes, voice, messaging observations." },
  { title: "Founder Bible", url: "/brain-dump", description: "Founder notes, operating principles, decisions." },
];

type SearchResult = {
  id: string;
  title: string;
  type: string;
  body: string;
  area?: WorkspaceArea;
  url: string;
};

function LibraryPage() {
  const [query, setQuery] = useState("");
  const { tasks } = useTasks();
  const { products } = useProductCatalog();
  const { frameworks } = useFrameworkLibrary();
  const { items: ideas } = useParkingLot();
  const { notes } = useWeeklyNotes();
  const { items: insights } = useCapturedInsights();

  const results = useMemo<SearchResult[]>(() => {
    const all: SearchResult[] = [
      ...tasks.map((task) => ({
        id: task.id,
        title: task.title,
        type: "Task",
        body: [task.project, task.type, task.status, task.nextStep, task.notes].filter(Boolean).join(" • "),
        area: task.branch,
        url: "/today",
      })),
      ...products.map((product) => ({
        id: product.id,
        title: product.name,
        type: "Product",
        body: [product.collection, product.type, product.status, product.notes].filter(Boolean).join(" • "),
        area: product.branch,
        url: "/products",
      })),
      ...frameworks.map((framework) => ({
        id: framework.id,
        title: framework.name,
        type: "Framework",
        body: [framework.definition, framework.purpose, framework.relatedProducts, framework.notes].filter(Boolean).join(" • "),
        url: "/frameworks",
      })),
      ...ideas.map((idea) => ({
        id: idea.id,
        title: idea.idea,
        type: "Idea",
        body: [idea.type, idea.decision, idea.notes].filter(Boolean).join(" • "),
        area: idea.branch,
        url: "/parking-lot",
      })),
      ...notes.map((note) => ({
        id: note.id,
        title: note.title,
        type: "Weekly Note",
        body: note.note,
        area: note.branch,
        url: "/weekly-log",
      })),
      ...insights.map((item) => ({
        id: item.id,
        title: item.title,
        type: item.category,
        body: [item.body, item.notes].filter(Boolean).join(" • "),
        area: item.branch,
        url: item.category === "Prompt Idea" ? "/brain-dump" : "/library",
      })),
    ];

    const q = query.trim().toLowerCase();
    if (!q) return all.slice(0, 18);
    return all.filter((item) => `${item.title} ${item.type} ${item.body} ${item.area ?? ""}`.toLowerCase().includes(q));
  }, [frameworks, ideas, insights, notes, products, query, tasks]);

  return (
    <div className="space-y-6">
      <PlannerPageHeader
        eyebrow="Operating Library"
        title="Library"
        description="Search everything: company notes, branches, apps, frameworks, prompts, teaching material, communication notes, and founder thinking."
        decorAsset={plannerAssets.dividerGold}
        decorClassName="right-10 top-14 h-16 w-48 opacity-35"
      />

      <PlannerPanel title="Search Everything" description="Search tasks, ideas, products, frameworks, notes, and imported work-session outputs.">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Best Collective..." className="pl-9" />
        </div>
      </PlannerPanel>

      <PlannerPanel title="Library Sections" description="Fast paths into the parts of the company brain.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SECTIONS.map((section) => (
            <Link
              key={section.title}
              to={section.url as never}
              className="planner-soft-hover rounded-2xl border border-border/70 bg-card/80 p-4"
            >
              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-lavender/35 p-2 text-plum-soft">
                  {section.title.includes("Bible") ? <BookOpen className="h-4 w-4" /> : section.title.includes("Prompt") ? <Brain className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                </span>
                <div>
                  <h3 className="font-semibold text-ink">{section.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{section.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </PlannerPanel>

      <PlannerPanel title="Search Results" description={`${results.length} result${results.length === 1 ? "" : "s"} shown.`}>
        <div className="grid gap-3">
          {results.map((result) => (
            <Link key={`${result.type}-${result.id}`} to={result.url as never} className="planner-soft-hover rounded-2xl border border-border/70 bg-card/82 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Library className="h-4 w-4 text-gold" />
                <h3 className="font-display text-xl text-ink break-words">{result.title}</h3>
                <span className="rounded-full bg-blush/35 px-2.5 py-0.5 text-xs font-medium text-ink">{result.type}</span>
                {result.area && <AreaPill area={result.area} />}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground break-words">{result.body || "No details yet."}</p>
            </Link>
          ))}
          {results.length === 0 && (
            <div className="rounded-2xl border border-dashed border-plum-soft/25 bg-card/70 p-8 text-center text-sm text-muted-foreground">
              No library results match this search.
            </div>
          )}
        </div>
      </PlannerPanel>

      <PlannerPanel title="Branch Completion Sources" description="Library sections currently draw from branch tasks, products, frameworks, ideas, and notes.">
        <div className="flex flex-wrap gap-2">
          {[...CORE_BRANCHES, ...WORKSTREAMS].map((area) => (
            <AreaPill key={area} area={area} />
          ))}
        </div>
      </PlannerPanel>
    </div>
  );
}
