import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Archive, BookOpen, Brain, Library, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AreaPill } from "@/components/shared/AreaPill";
import { PlannerPageHeader, PlannerPanel } from "@/components/shared/PlannerPageHeader";
import { useCapturedInsights } from "@/hooks/useCapturedInsights";
import { useFrameworkLibrary } from "@/hooks/useFrameworkLibrary";
import { useLibraryItems } from "@/hooks/useLibraryItems";
import { useParkingLot } from "@/hooks/useParkingLot";
import { useProductCatalog } from "@/hooks/useProductCatalog";
import { useTasks } from "@/hooks/useTasks";
import { useWeeklyNotes } from "@/hooks/useWeeklyData";
import { plannerAssets } from "@/lib/plannerAssets";
import {
  CORE_BRANCHES,
  LIBRARY_CATEGORIES,
  WORKSTREAMS,
  type LibraryCategory,
  type LibraryItem,
  type WorkspaceArea,
} from "@/lib/types";

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
  {
    title: "Company",
    url: "/",
    description: "Weekly planning, CEO decisions, and operating notes.",
  },
  { title: "Brand", url: "/brand", description: "Voice, offers, positioning, bibles." },
  { title: "Rise", url: "/rise", description: "Women, repair, return, emotional clarity." },
  { title: "Land", url: "/land", description: "Men, leadership, grounded action." },
  { title: "Rebuild", url: "/rebuild", description: "Starting over strong." },
  {
    title: "Meet at the Heal",
    url: "/meet-at-the-heal",
    description: "Couples, repair, rebuilding trust.",
  },
  { title: "Kit Factory", url: "/kit-factory-app", description: "Production system and app work." },
  { title: "Apps", url: "/products", description: "Apps, websites, quizzes, bundles." },
  {
    title: "Framework Library",
    url: "/frameworks",
    description: "Teaching models and definitions.",
  },
  {
    title: "Prompt Library",
    url: "/brain-dump",
    description: "Prompt ideas captured from work sessions.",
  },
  { title: "Teaching Bible", url: "/frameworks", description: "Frameworks, lessons, examples." },
  {
    title: "Communication Bible",
    url: "/weekly-log",
    description: "Notes, voice, messaging observations.",
  },
  {
    title: "Founder Bible",
    url: "/brain-dump",
    description: "Founder notes, operating principles, decisions.",
  },
];

type SearchResult = {
  id: string;
  title: string;
  type: string;
  body: string;
  area?: WorkspaceArea;
  url: string;
};

const EMPTY_LIBRARY_ITEM: Omit<LibraryItem, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  category: "Company",
  location: "",
  linkedProduct: "",
  notes: "",
};

function LibraryPage() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LibraryItem | null>(null);
  const { tasks } = useTasks();
  const { products } = useProductCatalog();
  const { frameworks } = useFrameworkLibrary();
  const { items: ideas } = useParkingLot();
  const { notes } = useWeeklyNotes();
  const { items: insights } = useCapturedInsights();
  const {
    items: libraryItems,
    addLibraryItem,
    updateLibraryItem,
    deleteLibraryItem,
  } = useLibraryItems();

  const results = useMemo<SearchResult[]>(() => {
    const all: SearchResult[] = [
      ...libraryItems.map((item) => ({
        id: item.id,
        title: item.title,
        type: item.category,
        body: [item.location, item.linkedProduct, item.notes].filter(Boolean).join(" â€¢ "),
        url: "/library",
      })),
      ...tasks.map((task) => ({
        id: task.id,
        title: task.title,
        type: "Task",
        body: [task.project, task.type, task.status, task.nextStep, task.notes]
          .filter(Boolean)
          .join(" • "),
        area: task.branch,
        url: "/today",
      })),
      ...products.map((product) => ({
        id: product.id,
        title: product.name,
        type: "Product",
        body: [product.collection, product.type, product.status, product.notes]
          .filter(Boolean)
          .join(" • "),
        area: product.branch,
        url: "/products",
      })),
      ...frameworks.map((framework) => ({
        id: framework.id,
        title: framework.name,
        type: "Framework",
        body: [framework.definition, framework.purpose, framework.relatedProducts, framework.notes]
          .filter(Boolean)
          .join(" • "),
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
    return all.filter((item) =>
      `${item.title} ${item.type} ${item.body} ${item.area ?? ""}`.toLowerCase().includes(q),
    );
  }, [frameworks, ideas, insights, libraryItems, notes, products, query, tasks]);

  return (
    <div className="space-y-6">
      <PlannerPageHeader
        eyebrow="Operating Library"
        title="Library"
        description="Search everything: company notes, branches, apps, frameworks, prompts, teaching material, communication notes, and founder thinking."
        decorAsset={plannerAssets.dividerGold}
        decorClassName="right-10 top-14 h-16 w-48 opacity-35"
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Library Item
          </Button>
        }
      />

      <PlannerPanel
        title="Search Everything"
        description="Search tasks, ideas, products, frameworks, notes, and imported work-session outputs."
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Best Collective..."
            className="pl-9"
          />
        </div>
      </PlannerPanel>

      <PlannerPanel
        title="Library Sections"
        description="Fast paths into the parts of the company brain."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SECTIONS.map((section) => (
            <Link
              key={section.title}
              to={section.url as never}
              className="planner-soft-hover rounded-2xl border border-border/70 bg-card/80 p-4"
            >
              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-lavender/35 p-2 text-plum-soft">
                  {section.title.includes("Bible") ? (
                    <BookOpen className="h-4 w-4" />
                  ) : section.title.includes("Prompt") ? (
                    <Brain className="h-4 w-4" />
                  ) : (
                    <Archive className="h-4 w-4" />
                  )}
                </span>
                <div>
                  <h3 className="font-semibold text-ink">{section.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </PlannerPanel>

      <PlannerPanel
        title="Search Results"
        description={`${results.length} result${results.length === 1 ? "" : "s"} shown.`}
      >
        <div className="grid gap-3">
          {results.map((result) => (
            <Link
              key={`${result.type}-${result.id}`}
              to={result.url as never}
              className="planner-soft-hover rounded-2xl border border-border/70 bg-card/82 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Library className="h-4 w-4 text-gold" />
                <h3 className="font-display text-xl text-ink break-words">{result.title}</h3>
                <span className="rounded-full bg-blush/35 px-2.5 py-0.5 text-xs font-medium text-ink">
                  {result.type}
                </span>
                {result.area && <AreaPill area={result.area} />}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground break-words">
                {result.body || "No details yet."}
              </p>
            </Link>
          ))}
          {results.length === 0 && (
            <div className="rounded-2xl border border-dashed border-plum-soft/25 bg-card/70 p-8 text-center text-sm text-muted-foreground">
              No library results match this search.
            </div>
          )}
        </div>
      </PlannerPanel>

      <PlannerPanel
        title="Manual Library Items"
        description={`${libraryItems.length} saved reference${libraryItems.length === 1 ? "" : "s"} with optional location, path, link, and product connection.`}
      >
        <div className="grid gap-3">
          {libraryItems.map((item) => (
            <div
              key={item.id}
              className="planner-soft-hover rounded-2xl border border-border/70 bg-card/82 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Library className="h-4 w-4 text-gold" />
                    <h3 className="font-display text-xl text-ink break-words">{item.title}</h3>
                    <span className="rounded-full bg-blush/35 px-2.5 py-0.5 text-xs font-medium text-ink">
                      {item.category}
                    </span>
                    {item.linkedProduct && (
                      <span className="rounded-full bg-lavender/35 px-2.5 py-0.5 text-xs font-medium text-plum-deep">
                        {item.linkedProduct}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground break-words">
                    {item.location || "No manual location yet."}
                  </p>
                  {item.notes && (
                    <p className="mt-1 text-sm leading-relaxed text-ink break-words">
                      {item.notes}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditing(item);
                      setOpen(true);
                    }}
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      deleteLibraryItem(item.id);
                      toast.success("Library item deleted.");
                    }}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {libraryItems.length === 0 && (
            <div className="rounded-2xl border border-dashed border-plum-soft/25 bg-card/70 p-8 text-center text-sm text-muted-foreground">
              No manual library items yet. Add a link, file path, note location, or product
              reference whenever something needs a home.
            </div>
          )}
        </div>
      </PlannerPanel>

      <PlannerPanel
        title="Branch Completion Sources"
        description="Library sections currently draw from branch tasks, products, frameworks, ideas, and notes."
      >
        <div className="flex flex-wrap gap-2">
          {[...CORE_BRANCHES, ...WORKSTREAMS].map((area) => (
            <AreaPill key={area} area={area} />
          ))}
        </div>
      </PlannerPanel>

      <LibraryItemDialog
        open={open}
        initial={editing}
        products={products.map((product) => product.name)}
        onOpenChange={setOpen}
        onSubmit={(data) => {
          if (editing) {
            updateLibraryItem(editing.id, data);
            toast.success("Library item updated.");
          } else {
            addLibraryItem(data);
            toast.success("Library item added.");
          }
        }}
      />
    </div>
  );
}

function LibraryItemDialog({
  open,
  initial,
  products,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  initial: LibraryItem | null;
  products: string[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<LibraryItem, "id" | "createdAt" | "updatedAt">) => void;
}) {
  const [form, setForm] = useState(EMPTY_LIBRARY_ITEM);

  useEffect(() => {
    if (!open) return;
    setForm({ ...EMPTY_LIBRARY_ITEM, ...initial });
  }, [initial, open]);

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {initial ? "Edit Library Item" : "Add Library Item"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Title" className="md:col-span-2">
            <Input value={form.title} onChange={(event) => setField("title", event.target.value)} />
          </Field>
          <Field label="Category">
            <Select
              value={form.category}
              onValueChange={(value) => setField("category", value as LibraryCategory)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LIBRARY_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Connected Product">
            <Select
              value={form.linkedProduct || "__none"}
              onValueChange={(value) => setField("linkedProduct", value === "__none" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Optional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">No product</SelectItem>
                {products.map((product) => (
                  <SelectItem key={product} value={product}>
                    {product}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Location / Path / Link" className="md:col-span-2">
            <Input
              value={form.location}
              onChange={(event) => setField("location", event.target.value)}
              placeholder="URL, file path, folder, notebook, or manual reference"
            />
          </Field>
          <Field label="Notes" className="md:col-span-2">
            <Textarea
              value={form.notes}
              rows={4}
              onChange={(event) => setField("notes", event.target.value)}
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!form.title.trim()) {
                toast.info("Add a title first.");
                return;
              }
              onSubmit({ ...form, title: form.title.trim() });
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`grid gap-1.5 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
