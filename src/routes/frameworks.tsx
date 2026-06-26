import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BookMarked, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlannerPageHeader, PlannerPanel } from "@/components/shared/PlannerPageHeader";
import { useFrameworkLibrary } from "@/hooks/useFrameworkLibrary";
import { plannerAssets } from "@/lib/plannerAssets";
import type { FrameworkItem } from "@/lib/types";

export const Route = createFileRoute("/frameworks")({
  head: () => ({
    meta: [
      { title: "Framework Library - Best Collective" },
      { name: "description", content: "Best Collective teaching frameworks and relationships." },
    ],
  }),
  component: FrameworkLibraryPage,
});

const EMPTY_FRAMEWORK: Omit<FrameworkItem, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  definition: "",
  purpose: "",
  relatedBooks: "",
  relatedQuizzes: "",
  relatedApps: "",
  relatedLessons: "",
  relatedSocialPosts: "",
  relatedProducts: "",
  notes: "",
};

const SUGGESTED_FRAMEWORKS = [
  "Adjacent Effort",
  "Practical Love vs Emotional Attunement",
  "Follow-Through Test",
  "Comfort Is Not Repair",
  "Safety From Shame vs Safety Through Clarity",
];

function FrameworkLibraryPage() {
  const { frameworks, addFramework, updateFramework, deleteFramework } = useFrameworkLibrary();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FrameworkItem | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return frameworks;
    return frameworks.filter((framework) =>
      Object.values(framework).join(" ").toLowerCase().includes(q),
    );
  }, [frameworks, query]);

  return (
    <div className="space-y-6">
      <PlannerPageHeader
        eyebrow="Teaching Bible"
        title="Framework Library"
        description="A searchable home for Best Collective frameworks, definitions, examples, products, lessons, quizzes, apps, and social post connections."
        decorAsset={plannerAssets.lavenderSprig}
        decorClassName="right-12 top-8 h-24 w-44 opacity-28"
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Framework
          </Button>
        }
      />

      <PlannerPanel title="Search" description="Search definitions, purpose, related products, and notes.">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search frameworks..." className="pl-9" />
        </div>
      </PlannerPanel>

      <PlannerPanel title="Frameworks" description={`${filtered.length} framework${filtered.length === 1 ? "" : "s"} shown.`}>
        <div className="grid gap-3">
          {filtered.map((framework) => (
            <FrameworkCard
              key={framework.id}
              framework={framework}
              onEdit={() => {
                setEditing(framework);
                setOpen(true);
              }}
              onDelete={() => deleteFramework(framework.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-plum-soft/25 bg-card/70 p-8 text-center text-sm text-muted-foreground">
              No frameworks match this search.
            </div>
          )}
        </div>
      </PlannerPanel>

      <PlannerPanel title="Frameworks to Add Next" description="Starter placeholders from the Best Collective teaching system.">
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_FRAMEWORKS.map((name) => (
            <Button
              key={name}
              variant="outline"
              size="sm"
              onClick={() => {
                addFramework({ ...EMPTY_FRAMEWORK, name });
                toast.success(`${name} added.`);
              }}
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              {name}
            </Button>
          ))}
        </div>
      </PlannerPanel>

      <FrameworkDialog
        open={open}
        initial={editing}
        onOpenChange={setOpen}
        onSubmit={(data) => {
          if (editing) {
            updateFramework(editing.id, data);
            toast.success("Framework updated.");
          } else {
            addFramework(data);
            toast.success("Framework added.");
          }
        }}
      />
    </div>
  );
}

function FrameworkCard({ framework, onEdit, onDelete }: { framework: FrameworkItem; onEdit: () => void; onDelete: () => void }) {
  return (
    <Card className="planner-soft-hover bg-card/88">
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <BookMarked className="h-4 w-4 text-gold" />
            <h3 className="font-display text-2xl leading-tight text-ink break-words">{framework.name}</h3>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink break-words">{framework.definition || "No definition yet."}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground break-words">{framework.purpose || "Purpose not defined yet."}</p>
          <div className="mt-3 grid gap-2 text-xs md:grid-cols-3">
            <Mini label="Books" value={framework.relatedBooks} />
            <Mini label="Quizzes" value={framework.relatedQuizzes} />
            <Mini label="Apps" value={framework.relatedApps} />
            <Mini label="Lessons" value={framework.relatedLessons} />
            <Mini label="Social Posts" value={framework.relatedSocialPosts} />
            <Mini label="Products" value={framework.relatedProducts} />
          </div>
        </div>
        <div className="flex justify-end gap-1">
          <Button size="icon" variant="ghost" onClick={onEdit}><Pencil className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FrameworkDialog({
  open,
  initial,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  initial: FrameworkItem | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<FrameworkItem, "id" | "createdAt" | "updatedAt">) => void;
}) {
  const [form, setForm] = useState(EMPTY_FRAMEWORK);

  useEffect(() => {
    if (!open) return;
    setForm(initial ?? EMPTY_FRAMEWORK);
  }, [initial, open]);

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{initial ? "Edit Framework" : "Add Framework"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Framework Name" className="md:col-span-2">
            <Input value={form.name} onChange={(event) => setField("name", event.target.value)} />
          </Field>
          <Field label="Definition" className="md:col-span-2">
            <Textarea value={form.definition} rows={3} onChange={(event) => setField("definition", event.target.value)} />
          </Field>
          <Field label="Purpose" className="md:col-span-2">
            <Textarea value={form.purpose} rows={3} onChange={(event) => setField("purpose", event.target.value)} />
          </Field>
          {(["relatedBooks", "relatedQuizzes", "relatedApps", "relatedLessons", "relatedSocialPosts", "relatedProducts"] as const).map((field) => (
            <Field key={field} label={fieldLabel(field)}>
              <Input value={form[field]} onChange={(event) => setField(field, event.target.value)} />
            </Field>
          ))}
          <Field label="Notes" className="md:col-span-2">
            <Textarea value={form.notes} rows={4} onChange={(event) => setField("notes", event.target.value)} />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (!form.name.trim()) return;
              onSubmit({ ...form, name: form.name.trim() });
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

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-warm-white/60 p-2">
      <div className="font-semibold text-muted-foreground">{label}</div>
      <div className="mt-1 text-ink break-words">{value || "—"}</div>
    </div>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div className={`grid gap-1.5 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function fieldLabel(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}
