import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Brain, Eraser, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlannerPageHeader, PlannerPanel } from "@/components/shared/PlannerPageHeader";
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
      { name: "description", content: "Capture founder thoughts and convert them into reviewed operating items." },
    ],
  }),
  component: BrainDumpPage,
});

function BrainDumpPage() {
  const [draftText, setDraftText] = useLocalState<string>(STORAGE_KEYS.brainDumpDraft, "");
  const [drafts, setDrafts] = useState<WorkSessionDraft[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { saveDrafts } = useWorkSessionSaver();

  const analyze = async () => {
    if (!draftText.trim()) {
      toast.info("Add a thought first.");
      return;
    }
    setIsAnalyzing(true);
    try {
      const parsed = await parseTextToWorkSessionDrafts(draftText, "Brain Dump");
      setDrafts(parsed);
      toast.success(`${parsed.length} item${parsed.length === 1 ? "" : "s"} ready for review.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateDraft = (draftId: string, patch: Partial<WorkSessionDraft>) => {
    setDrafts((current) =>
      current.map((draft) =>
        draft.draftId === draftId
          ? {
              ...draft,
              ...patch,
              type: patch.category && patch.category !== "Task" ? "Idea" : patch.type ?? draft.type,
            }
          : draft,
      ),
    );
  };

  const saveReviewed = () => {
    const result = saveDrafts(drafts);
    setDrafts([]);
    toast.success(`${result.total} reviewed item${result.total === 1 ? "" : "s"} saved.`);
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

      {drafts.length > 0 && (
        <WorkSessionReview
          drafts={drafts}
          sourceDescription="Brain Dump"
          onUpdate={updateDraft}
          onRemove={(draftId) => setDrafts((current) => current.filter((draft) => draft.draftId !== draftId))}
          onSave={saveReviewed}
        />
      )}
    </div>
  );
}
