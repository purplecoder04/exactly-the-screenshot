import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ClipboardPaste, FileText, RefreshCcw, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlannerPageHeader } from "@/components/shared/PlannerPageHeader";
import { WorkSessionReview } from "@/components/shared/WorkSessionReview";
import { useWorkSessionSaver } from "@/hooks/useWorkSessionSaver";
import { plannerAssets } from "@/lib/plannerAssets";
import { extractTextFromFile, isSupportedImportFile } from "@/lib/documentImport";
import { parseTextToWorkSessionDrafts, type WorkSessionDraft } from "@/lib/workSessionParser";

export const Route = createFileRoute("/import-tasks")({
  head: () => ({
    meta: [
      { title: "Import Work Session - Best Collective" },
      {
        name: "description",
        content: "Turn local documents into reviewed operating-system items.",
      },
    ],
  }),
  component: ImportWorkSessionPage,
});

type ImportStatus = "idle" | "review" | "saved";

function ImportWorkSessionPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [drafts, setDrafts] = useState<WorkSessionDraft[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const { saveDrafts } = useWorkSessionSaver();

  const resetImport = () => {
    setStatus("idle");
    setError("");
    setFileName("");
    setSourceText("");
    setPastedText("");
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
      setError("Upload a .txt, .md, or .docx file. PDF support is planned for a later version.");
      return;
    }

    setIsParsing(true);
    try {
      const text = await extractTextFromFile(file);
      await parseTextForReview(text, file.name);
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "The document could not be imported.");
    } finally {
      setIsParsing(false);
    }
  };

  const parseTextForReview = async (text: string, label: string) => {
    const parsedDrafts = await parseTextToWorkSessionDrafts(text, label);
    setSourceText(text);
    setDrafts(parsedDrafts);
    setStatus("review");
    if (parsedDrafts.length === 0) {
      setError(
        "No structured items found. Try Task:, Idea:, Parking Lot:, Framework:, Product:, Product Update:, Decision:, License Rule:, Current Goal:, Meeting Note:, Founder Note:, or Prompt:.",
      );
    }
  };

  const analyzePastedText = async () => {
    if (!pastedText.trim()) {
      toast.info("Paste a work session first.");
      return;
    }
    setError("");
    setFileName("Pasted Work Session");
    setSavedCount(0);
    setIsParsing(true);
    try {
      await parseTextForReview(pastedText, "Pasted Work Session");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "The pasted work session could not be parsed.");
    } finally {
      setIsParsing(false);
    }
  };

  const updateDraft = (draftId: string, patch: Partial<WorkSessionDraft>) => {
    setDrafts((current) =>
      current.map((draft) =>
        draft.draftId === draftId ? normalizeDraftPatch(draft, patch) : draft,
      ),
    );
  };

  const saveReviewed = () => {
    const result = saveDrafts(drafts);
    setSavedCount(result.total);
    setStatus("saved");
    setDrafts([]);
    toast.success(`${result.total} reviewed item${result.total === 1 ? "" : "s"} saved.`);
  };

  return (
    <div className="flex flex-col gap-6">
      <PlannerPageHeader
        eyebrow="Work Session Import"
        title="Import Work Session"
        description="Upload a local TXT, MD, or DOCX session and review proposed tasks, ideas, frameworks, product updates, meeting notes, prompt ideas, and founder notes before saving."
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
                    Nothing is saved until the review step. PDF support is planned for the future.
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

          {isParsing && (
            <p className="text-sm text-muted-foreground">
              Reading document and structuring your work session...
            </p>
          )}
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

      <Card className="planner-card overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-plum-deep">
            <ClipboardPaste className="h-4 w-4 text-plum-soft" />
            Paste Work Session
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Textarea
            value={pastedText}
            onChange={(event) => setPastedText(event.target.value)}
            rows={9}
            className="min-h-56 bg-warm-white/85 text-sm leading-relaxed"
            placeholder="Paste a long work session here. Labels like Task:, Decision:, Product:, Framework:, Parking Lot:, License Rule:, and Current Goal: make routing stronger."
          />
          <div className="flex justify-end">
            <Button onClick={() => void analyzePastedText()} disabled={isParsing}>
              <Sparkles className="mr-1 h-4 w-4" />
              {isParsing ? "Analyzing..." : "Analyze Pasted Session"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {status === "review" && (
        <WorkSessionReview
          drafts={drafts}
          sourceDescription={`${sourceText.length.toLocaleString()} characters in ${fileName || "uploaded file"}`}
          onUpdate={updateDraft}
          onBulkUpdate={(updater) => setDrafts((current) => updater(current))}
          onRemove={(draftId) =>
            setDrafts((current) => current.filter((draft) => draft.draftId !== draftId))
          }
          onSave={saveReviewed}
        />
      )}

      {status === "saved" && (
        <Card className="planner-card">
          <CardContent className="flex flex-col gap-4 p-6">
            <div>
              <h3 className="font-display text-2xl text-ink">Work session saved</h3>
              <p className="text-sm text-muted-foreground">
                Added {savedCount} reviewed item{savedCount === 1 ? "" : "s"} to the dashboard
                system.
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
              <Button asChild variant="outline">
                <Link to="/library">Open Library</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function normalizeDraftPatch(
  draft: WorkSessionDraft,
  patch: Partial<WorkSessionDraft>,
): WorkSessionDraft {
  const nextCategory = patch.category ?? draft.category;
  const nextType =
    patch.type ??
    (nextCategory === "Task" ? (draft.type === "Idea" ? "Task" : draft.type) : "Idea");

  return {
    ...draft,
    ...patch,
    branch: patch.branch ?? draft.branch,
    type: nextType,
  };
}
