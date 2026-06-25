import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { FileText, RefreshCcw, Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlannerPageHeader } from "@/components/shared/PlannerPageHeader";
import { useTasks } from "@/hooks/useTasks";
import { plannerAssets } from "@/lib/plannerAssets";
import {
  ALL_AREAS,
  PRIORITIES,
  PROJECT_TYPES,
  STATUSES,
  areaTypeFor,
  type Priority,
  type ProjectType,
  type Status,
  type WorkspaceArea,
} from "@/lib/types";
import {
  extractTextFromFile,
  isSupportedImportFile,
  parseDocumentTextToTaskDrafts,
  type ImportedTaskDraft,
} from "@/lib/documentImport";

export const Route = createFileRoute("/import-tasks")({
  head: () => ({
    meta: [
      { title: "Import Tasks - Best Collective" },
      { name: "description", content: "Turn local documents into reviewed dashboard tasks." },
    ],
  }),
  component: ImportTasksPage,
});

type ImportStatus = "idle" | "review" | "saved";

function ImportTasksPage() {
  const { addTask } = useTasks();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [drafts, setDrafts] = useState<ImportedTaskDraft[]>([]);
  const [savedCount, setSavedCount] = useState(0);

  const selectedCount = useMemo(() => drafts.filter((draft) => draft.selected).length, [drafts]);

  const resetImport = () => {
    setStatus("idle");
    setError("");
    setFileName("");
    setSourceText("");
    setDrafts([]);
    setSavedCount(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError("");
    setSavedCount(0);
    setFileName(file.name);
    setSourceText("");
    setDrafts([]);

    if (!isSupportedImportFile(file.name)) {
      setStatus("idle");
      setError("Upload a .txt, .md, or .docx file.");
      return;
    }

    setIsParsing(true);
    try {
      const text = await extractTextFromFile(file);
      const parsedDrafts = await parseDocumentTextToTaskDrafts(text, file.name);
      setSourceText(text);
      setDrafts(parsedDrafts);
      setStatus("review");
      if (parsedDrafts.length === 0) {
        setError("No task lines found. Try lines starting with TODO:, Task:, Next Step:, Fix:, Build:, Add:, Update:, or Test:.");
      }
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "The document could not be imported.");
    } finally {
      setIsParsing(false);
    }
  };

  const updateDraft = (draftId: string, patch: Partial<ImportedTaskDraft>) => {
    setDrafts((current) =>
      current.map((draft) =>
        draft.draftId === draftId
          ? {
              ...draft,
              ...patch,
              areaType: patch.branch ? areaTypeFor(patch.branch) : draft.areaType,
            }
          : draft,
      ),
    );
  };

  const removeDraft = (draftId: string) => {
    setDrafts((current) => current.filter((draft) => draft.draftId !== draftId));
  };

  const saveSelectedTasks = () => {
    const selected = drafts.filter((draft) => draft.selected && draft.title.trim());
    selected.forEach((draft) => {
      addTask({
        title: draft.title.trim(),
        branch: draft.branch,
        areaType: areaTypeFor(draft.branch),
        project: draft.project?.trim() || undefined,
        type: draft.type,
        status: draft.status,
        priority: draft.priority,
        nextStep: draft.nextStep,
        notes: draft.notes,
        isToday: draft.isToday,
        isDone: false,
      });
    });
    setSavedCount(selected.length);
    setStatus("saved");
    setDrafts([]);
    toast.success(`${selected.length} task${selected.length === 1 ? "" : "s"} added.`);
  };

  return (
    <div className="flex flex-col gap-6">
      <PlannerPageHeader
        eyebrow="Task Importer"
        title="Import Tasks"
        description="Upload a local document, review proposed tasks, edit what needs shaping, then choose what gets saved."
        decorAsset={plannerAssets.bookJournal}
        decorClassName="right-10 top-4 h-32 w-32 rotate-[-5deg] opacity-25"
        actions={
          status !== "idle" && (
          <Button variant="outline" onClick={resetImport}>
            <RefreshCcw className="mr-1 h-4 w-4" />
            Import another
          </Button>
          )
        }
      />

      <Card className="planner-card overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-plum-deep">
            <Upload className="h-4 w-4 text-plum-soft" />
            Document Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-2xl border border-dashed border-plum-soft/30 bg-card/70 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-lavender/40 p-2 text-plum-deep">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">Choose a .txt, .md, or .docx file</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Tasks are only saved after you review and click Add selected tasks.
                  </p>
                </div>
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.docx"
                disabled={isParsing}
                onChange={(event) => void handleFile(event.target.files?.[0])}
                className="max-w-md bg-background/80"
              />
            </div>
          </div>

          {isParsing && <p className="text-sm text-muted-foreground">Reading document and finding task lines...</p>}
          {fileName && !isParsing && (
            <p className="text-xs text-muted-foreground">
              Current file: <span className="font-medium text-ink">{fileName}</span>
            </p>
          )}
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {status === "review" && (
        <ReviewPanel
          drafts={drafts}
          selectedCount={selectedCount}
          sourceText={sourceText}
          onUpdate={updateDraft}
          onRemove={removeDraft}
          onSave={saveSelectedTasks}
        />
      )}

      {status === "saved" && (
        <Card className="planner-card">
          <CardContent className="flex flex-col gap-4 p-6">
            <div>
              <h3 className="font-display text-2xl text-ink">Import saved</h3>
              <p className="text-sm text-muted-foreground">
                Added {savedCount} task{savedCount === 1 ? "" : "s"} to your dashboard.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={resetImport}>
                <Upload className="mr-1 h-4 w-4" />
                Import another
              </Button>
              <Button asChild variant="outline">
                <Link to="/today">Go to Today</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ReviewPanel({
  drafts,
  selectedCount,
  sourceText,
  onUpdate,
  onRemove,
  onSave,
}: {
  drafts: ImportedTaskDraft[];
  selectedCount: number;
  sourceText: string;
  onUpdate: (draftId: string, patch: Partial<ImportedTaskDraft>) => void;
  onRemove: (draftId: string) => void;
  onSave: () => void;
}) {
  return (
    <section className="planner-card flex flex-col gap-4 p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-plum-deep">Review Proposed Tasks</h3>
          <p className="text-sm text-muted-foreground">
            {drafts.length} proposed from {sourceText.length.toLocaleString()} characters. {selectedCount} selected.
          </p>
        </div>
        <Button disabled={selectedCount === 0} onClick={onSave}>
          <Save className="mr-1 h-4 w-4" />
          Add selected tasks
        </Button>
      </div>

      {drafts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-plum-soft/25 bg-card/70 p-8 text-center text-sm text-muted-foreground">
          No proposed tasks yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {drafts.map((draft, index) => (
            <TaskReviewCard
              key={draft.draftId}
              draft={draft}
              index={index}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function TaskReviewCard({
  draft,
  index,
  onUpdate,
  onRemove,
}: {
  draft: ImportedTaskDraft;
  index: number;
  onUpdate: (draftId: string, patch: Partial<ImportedTaskDraft>) => void;
  onRemove: (draftId: string) => void;
}) {
  return (
    <Card className={draft.selected ? "planner-soft-hover bg-card/90" : "bg-muted/30 opacity-75"}>
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-ink">
            <Checkbox
              checked={draft.selected}
              onCheckedChange={(checked) => onUpdate(draft.draftId, { selected: !!checked })}
            />
            <span>Import task {index + 1}</span>
          </label>
          <Button variant="ghost" size="sm" onClick={() => onRemove(draft.draftId)}>
            <X className="mr-1 h-4 w-4" />
            Remove
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Task title" className="md:col-span-2">
            <Input
              value={draft.title}
              onChange={(event) => onUpdate(draft.draftId, { title: event.target.value })}
            />
          </Field>

          <Field label="Branch / Workstream">
            <Select
              value={draft.branch}
              onValueChange={(value) => onUpdate(draft.draftId, { branch: value as WorkspaceArea })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ALL_AREAS.map((area) => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Project">
            <Input
              value={draft.project ?? ""}
              placeholder="Optional"
              onChange={(event) => onUpdate(draft.draftId, { project: event.target.value })}
            />
          </Field>

          <Field label="Type">
            <Select
              value={draft.type}
              onValueChange={(value) => onUpdate(draft.draftId, { type: value as ProjectType })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PROJECT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Status">
            <Select
              value={draft.status}
              onValueChange={(value) => onUpdate(draft.draftId, { status: value as Status })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Priority">
            <Select
              value={draft.priority}
              onValueChange={(value) => onUpdate(draft.draftId, { priority: value as Priority })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((priority) => (
                  <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Next step">
            <Input
              value={draft.nextStep}
              placeholder="Optional"
              onChange={(event) => onUpdate(draft.draftId, { nextStep: event.target.value })}
            />
          </Field>

          <Field label="Notes" className="md:col-span-2">
            <Textarea
              value={draft.notes}
              rows={3}
              onChange={(event) => onUpdate(draft.draftId, { notes: event.target.value })}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 rounded-2xl border border-plum-soft/20 bg-lavender/20 px-3 py-2 text-sm text-ink">
          <Checkbox
            checked={draft.isToday}
            onCheckedChange={(checked) => onUpdate(draft.draftId, { isToday: !!checked })}
          />
          <span>Add to Today</span>
        </label>
      </CardContent>
    </Card>
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
