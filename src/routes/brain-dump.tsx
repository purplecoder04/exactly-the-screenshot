import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Brain, Eraser, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlannerPageHeader, PlannerPanel } from "@/components/shared/PlannerPageHeader";
import { useCapturedInsightQueue } from "@/hooks/useCapturedInsightQueue";
import { WorkSessionReview } from "@/components/shared/WorkSessionReview";
import { useLocalState } from "@/hooks/useLocalState";
import { useWorkSessionSaver } from "@/hooks/useWorkSessionSaver";
import { STORAGE_KEYS } from "@/lib/storage";
import { plannerAssets } from "@/lib/plannerAssets";
import { parseTextToWorkSessionDrafts, type WorkSessionDraft } from "@/lib/workSessionParser";

export const Route = createFileRoute("/brain-dump")({
  head: () => ({
    meta: [
      { title: "Brain Dump - Best Collective" },
      {
        name: "description",
        content: "Capture founder thoughts and convert them into reviewed operating items.",
      },
    ],
  }),
  component: BrainDumpPage,
});

function BrainDumpPage() {
  const [draftText, setDraftText] = useLocalState<string>(STORAGE_KEYS.brainDumpDraft, "");
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { saveDrafts } = useWorkSessionSaver();
  const {
    drafts,
    setDrafts,
    isLoading,
    saveParsedDrafts,
    updateDraft: updateQueuedDraft,
    persistDrafts,
    updateStatuses,
    deleteDraft,
    deleteDrafts,
  } = useCapturedInsightQueue();

  useEffect(() => {
    if (!isLoading && drafts.length > 0) {
      setHasAnalyzed(true);
    }
  }, [drafts.length, isLoading]);

  const analyze = async () => {
    if (!draftText.trim()) {
      toast.info("Add a thought first.");
      return;
    }
    setIsAnalyzing(true);
    try {
      const parsed = await parseTextToWorkSessionDrafts(draftText, "Brain Dump");
      const savedDrafts = await saveParsedDrafts(
        parsed.map((draft) => ({ ...draft, collapsed: draft.confidence === "High" })),
      );
      setHasAnalyzed(true);
      toast.success(
        `${savedDrafts.length} unreviewed item${savedDrafts.length === 1 ? "" : "s"} ready for review.`,
      );
    } catch (error) {
      console.error("[BrainDumpPage] analyze failed", error);
      toast.error("Brain Dump could not save the review queue yet. Check the Supabase table setup.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateDraft = (draftId: string, patch: Partial<WorkSessionDraft>) => {
    const target = drafts.find((draft) => draft.draftId === draftId);
    if (!target) return;
    updateQueuedDraft(normalizeDraftPatch(target, patch));
  };

  const saveReviewed = async () => {
    const selectedIds = new Set(
      drafts
        .filter((draft) => draft.selected && !draft.saved && draft.title.trim())
        .map((draft) => draft.draftId),
    );
    const selectedDrafts = drafts.filter(
      (draft) => selectedIds.has(draft.draftId) && !draft.saved,
    );
    try {
      const result = saveDrafts(drafts.filter((draft) => !draft.saved), {
        saveCapturedInsights: false,
      });
      await updateStatuses(
        selectedDrafts.map((draft) => ({
          id: draft.draftId,
          status: isConvertedDraft(draft) ? "converted" : "reviewed",
        })),
      );
      setDrafts((current) =>
        current.map((draft) =>
          selectedIds.has(draft.draftId)
            ? { ...draft, selected: false, saved: true, collapsed: true }
            : draft,
        ),
      );
      toast.success(`${result.total} reviewed item${result.total === 1 ? "" : "s"} saved.`);
    } catch (error) {
      console.error("[BrainDumpPage] save reviewed failed", error);
      toast.error("Brain Dump could not save yet. Check the Supabase table setup.");
    }
  };

  return (
    <div className="space-y-6">
      <PlannerPageHeader
        eyebrow="CEO Capture"
        title="Brain Dump"
        description="Paste raw thoughts, then let the local parser organize them into reviewable tasks, ideas, frameworks, product updates, meeting notes, founder notes, and prompt ideas."
        decorAsset={plannerAssets.butterflyPurple}
        decorClassName="right-10 top-6 h-28 w-36 opacity-25"
        actions={
          <Button asChild variant="outline">
            <Link to="/import-tasks">Import Work Session</Link>
          </Button>
        }
      />

      <PlannerPanel
        title="Raw Capture"
        description="No formatting required. Prefix lines when you want stronger structure: TODO:, Idea:, Framework:, Product Update:, Meeting Note:, Founder Note:, or Prompt:."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast.success("Draft saved locally.")}>
              <Save className="mr-1 h-4 w-4" />
              Save Draft
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setDraftText("");
                setDrafts([]);
                setHasAnalyzed(false);
                deleteDrafts(drafts.map((draft) => draft.draftId));
              }}
            >
              <Eraser className="mr-1 h-4 w-4" />
              Clear
            </Button>
            <Button onClick={() => void analyze()} disabled={isAnalyzing}>
              <Sparkles className="mr-1 h-4 w-4" />
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
        }
      >
        <Textarea
          value={draftText}
          onChange={(event) => setDraftText(event.target.value)}
          rows={14}
          className="min-h-[360px] bg-warm-white/85 text-base leading-relaxed"
          placeholder="Type or paste anything here. Nothing saves to tasks, ideas, or libraries until you review and save selected items."
        />
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Brain className="h-4 w-4 text-gold" />
          Local-first. Reviewed items save only when you choose.
        </div>
      </PlannerPanel>

      {hasAnalyzed && (
        <WorkSessionReview
          drafts={drafts}
          sourceDescription="Brain Dump"
          onUpdate={updateDraft}
          onBulkUpdate={(updater) => {
            setDrafts((current) => {
              const next = updater(current);
              if (next.length === 0 && current.length > 0) {
                deleteDrafts(current.map((draft) => draft.draftId));
              } else {
                void persistDrafts(next).catch((error) => {
                  console.error("[BrainDumpPage] bulk update failed", error);
                  toast.error("Brain Dump could not update the review queue.");
                });
              }
              return next;
            });
          }}
          onRemove={deleteDraft}
          onSave={() => void saveReviewed()}
        />
      )}
    </div>
  );
}

function isConvertedDraft(draft: WorkSessionDraft) {
  return [
    "Task",
    "Idea",
    "Parking Lot",
    "Framework",
    "Product",
    "Product Update",
  ].includes(draft.category);
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
    type: nextType,
  };
}
