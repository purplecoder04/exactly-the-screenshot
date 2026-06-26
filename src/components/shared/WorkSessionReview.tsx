import { useMemo, type ReactNode } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, Pencil, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { PlannerPanel } from "@/components/shared/PlannerPageHeader";
import {
  ALL_AREAS,
  PRIORITIES,
  PROJECT_TYPES,
  STATUSES,
  WORK_SESSION_CATEGORIES,
  type Priority,
  type ProjectType,
  type Status,
  type WorkSessionCategory,
  type WorkspaceArea,
} from "@/lib/types";
import type { ConfidenceLevel, WorkSessionDraft } from "@/lib/workSessionParser";
import { cn } from "@/lib/utils";

type Props = {
  drafts: WorkSessionDraft[];
  sourceDescription: string;
  onUpdate: (draftId: string, patch: Partial<WorkSessionDraft>) => void;
  onBulkUpdate: (updater: (drafts: WorkSessionDraft[]) => WorkSessionDraft[]) => void;
  onRemove: (draftId: string) => void;
  onSave: () => void;
};

export function WorkSessionReview({
  drafts,
  sourceDescription,
  onUpdate,
  onBulkUpdate,
  onRemove,
  onSave,
}: Props) {
  const summary = useMemo(() => summarizeDrafts(drafts), [drafts]);
  const selectedCount = summary.selected;

  const updateAll = (patch: Partial<WorkSessionDraft>, includeSaved = false) => {
    onBulkUpdate((current) =>
      current.map((draft) => (draft.saved && !includeSaved ? draft : { ...draft, ...patch })),
    );
  };

  return (
    <PlannerPanel
      title="Review Before Saving"
      description={`${drafts.length} proposed item${drafts.length === 1 ? "" : "s"} from ${sourceDescription}. Review, accept, edit, or reject before anything is saved.`}
    >
      <div className="sticky top-2 z-20 mb-3 rounded-2xl border border-plum-soft/20 bg-card/95 p-3 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-ink">
            <SummaryPill>{drafts.length} Items Found</SummaryPill>
            <SummaryPill>{summary.tasks} Tasks</SummaryPill>
            <SummaryPill>{summary.ideas} Ideas</SummaryPill>
            <SummaryPill>{summary.frameworks} Frameworks</SummaryPill>
            <SummaryPill>{summary.products} Products</SummaryPill>
            <SummaryPill>Selected: {selectedCount}</SummaryPill>
          </div>
          <Button disabled={selectedCount === 0} onClick={onSave} className="w-full lg:w-auto">
            <Save className="mr-1 h-4 w-4" />
            Save Selected
          </Button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateAll({ selected: true, saved: false })}
        >
          Select All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateAll({ selected: true, collapsed: true, saved: false })}
        >
          Approve All
        </Button>
        <Button variant="outline" size="sm" onClick={() => updateAll({ selected: false })}>
          Reject All
        </Button>
        <Button variant="outline" size="sm" onClick={() => updateAll({ collapsed: true }, true)}>
          Collapse All
        </Button>
        <Button variant="outline" size="sm" onClick={() => updateAll({ collapsed: false }, true)}>
          Expand All
        </Button>
        <Button variant="outline" size="sm" onClick={() => onBulkUpdate(() => [])}>
          <Trash2 className="mr-1 h-4 w-4" />
          Delete All
        </Button>
      </div>

      {drafts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-plum-soft/25 bg-card/70 p-7 text-center text-sm text-muted-foreground">
          <p className="font-medium text-ink">No actionable items detected.</p>
          <p className="mt-3">Try adding labels like:</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2 text-xs font-semibold text-plum-deep">
            <span>Task:</span>
            <span>Idea:</span>
            <span>Framework:</span>
            <span>Product:</span>
            <span>Decision:</span>
          </div>
        </div>
      ) : (
        <div className="grid gap-2.5">
          {drafts.map((draft, index) => (
            <ReviewCard
              key={draft.draftId}
              draft={draft}
              index={index}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </PlannerPanel>
  );
}

function ReviewCard({
  draft,
  index,
  onUpdate,
  onRemove,
}: {
  draft: WorkSessionDraft;
  index: number;
  onUpdate: (draftId: string, patch: Partial<WorkSessionDraft>) => void;
  onRemove: (draftId: string) => void;
}) {
  const isCollapsed = Boolean(draft.collapsed);
  const isTask = draft.category === "Task";
  const isFramework = draft.category === "Framework";
  const isIdea = draft.category === "Idea";
  const isProduct = draft.category === "Product" || draft.category === "Product Update";
  const titleLabel = getTitleLabel(draft.category);
  const destination = draft.project?.trim() || draft.branch;

  const patchDraft = (patch: Partial<WorkSessionDraft>) => {
    onUpdate(draft.draftId, { ...patch, saved: false });
  };

  return (
    <Card
      className={cn(
        "planner-soft-hover bg-card/90 transition-opacity",
        !draft.selected && !draft.saved && "bg-muted/30 opacity-75",
        draft.saved && "border-gold/30 bg-warm-white/90",
      )}
    >
      <CardContent className="flex flex-col gap-2.5 p-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 items-start gap-2.5">
            {draft.saved ? (
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-gold" />
            ) : (
              <Checkbox
                className="mt-1"
                checked={draft.selected}
                onCheckedChange={(checked) => onUpdate(draft.draftId, { selected: !!checked })}
                aria-label={`Select item ${index + 1}`}
              />
            )}
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-1.5">
                <MetaPill tone="plum">{draft.category}</MetaPill>
                <MetaPill>{destination}</MetaPill>
                {isTask && <MetaPill>{draft.priority} Priority</MetaPill>}
                <ConfidencePill level={draft.confidence} />
                {draft.saved && <MetaPill tone="gold">Saved</MetaPill>}
              </div>
              <h4 className="break-words text-sm font-semibold leading-snug text-ink">
                {draft.title.trim() || "Untitled item"}
              </h4>
              {draft.confidenceSignals.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1 text-[11px] leading-5 text-muted-foreground">
                  {draft.confidenceSignals.slice(0, 3).map((signal) => (
                    <span key={signal} className="rounded-full bg-lavender/25 px-2">
                      {signal}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-1.5">
            {draft.saved ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onUpdate(draft.draftId, { saved: false, selected: true, collapsed: false })
                }
              >
                <Pencil className="mr-1 h-3.5 w-3.5" />
                Edit Again
              </Button>
            ) : isCollapsed ? (
              <>
                <Button
                  variant={draft.selected ? "outline" : "default"}
                  size="sm"
                  onClick={() => onUpdate(draft.draftId, { selected: true, collapsed: true })}
                >
                  {draft.selected ? "Accepted" : "Accept"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdate(draft.draftId, { collapsed: false })}
                >
                  <Pencil className="mr-1 h-3.5 w-3.5" />
                  Edit
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdate(draft.draftId, { collapsed: true })}
              >
                <ChevronUp className="mr-1 h-3.5 w-3.5" />
                Collapse
              </Button>
            )}
            {!draft.saved && !isCollapsed && (
              <Button variant="ghost" size="sm" onClick={() => onRemove(draft.draftId)}>
                <X className="mr-1 h-3.5 w-3.5" />
                Remove
              </Button>
            )}
            {!draft.saved && isCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(draft.draftId)}
                aria-label="Remove item"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {isCollapsed || draft.saved ? (
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl border border-plum-soft/10 bg-lavender/10 px-3 py-2 text-left text-xs text-muted-foreground"
            onClick={() => !draft.saved && onUpdate(draft.draftId, { collapsed: false })}
            disabled={draft.saved}
          >
            <span>
              {draft.saved
                ? "Saved to the dashboard system."
                : "Quick accept mode. Open to edit details."}
            </span>
            {!draft.saved && <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        ) : (
          <div className="grid gap-2.5">
            <div className={cn("grid gap-2", isTask ? "md:grid-cols-3" : "md:grid-cols-2")}>
              <Field label="Output Type">
                <Select
                  value={draft.category}
                  onValueChange={(value) =>
                    patchDraft({ category: value as WorkSessionCategory, collapsed: false })
                  }
                >
                  <SelectTrigger className="h-9 bg-warm-white/85 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_SESSION_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Branch / Workstream">
                <Select
                  value={draft.branch}
                  onValueChange={(value) => patchDraft({ branch: value as WorkspaceArea })}
                >
                  <SelectTrigger className="h-9 bg-warm-white/85 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_AREAS.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {isTask && (
                <Field label="Type">
                  <Select
                    value={draft.type}
                    onValueChange={(value) => patchDraft({ type: value as ProjectType })}
                  >
                    <SelectTrigger className="h-9 bg-warm-white/85 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </div>

            <Field label={titleLabel}>
              <Input
                value={draft.title}
                className="h-9 bg-warm-white/85 text-sm"
                onChange={(event) => patchDraft({ title: event.target.value })}
              />
            </Field>

            {isTask && (
              <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                <Field label="Status">
                  <Select
                    value={draft.status}
                    onValueChange={(value) => patchDraft({ status: value as Status })}
                  >
                    <SelectTrigger className="h-9 bg-warm-white/85 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Priority">
                  <Select
                    value={draft.priority}
                    onValueChange={(value) => patchDraft({ priority: value as Priority })}
                  >
                    <SelectTrigger className="h-9 bg-warm-white/85 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <label className="mt-5 flex h-9 items-center gap-2 rounded-xl border border-plum-soft/20 bg-lavender/20 px-3 text-xs font-medium text-ink">
                  <Checkbox
                    checked={draft.isToday}
                    onCheckedChange={(checked) => patchDraft({ isToday: !!checked })}
                  />
                  Add to Today
                </label>
              </div>
            )}

            {isTask && (
              <Field label="Project / Product">
                <Input
                  value={draft.project ?? ""}
                  placeholder="Optional"
                  className="h-9 bg-warm-white/85 text-sm"
                  onChange={(event) => patchDraft({ project: event.target.value })}
                />
              </Field>
            )}

            {isProduct && (
              <Field label="Collection">
                <Input
                  value={draft.project ?? ""}
                  placeholder="Optional"
                  className="h-9 bg-warm-white/85 text-sm"
                  onChange={(event) => patchDraft({ project: event.target.value })}
                />
              </Field>
            )}

            {isTask && (
              <Field label="Next Step">
                <Input
                  value={draft.nextStep}
                  placeholder="Optional"
                  className="h-9 bg-warm-white/85 text-sm"
                  onChange={(event) => patchDraft({ nextStep: event.target.value })}
                />
              </Field>
            )}

            {(isIdea || isFramework || isProduct || !isTask) && (
              <Field label="Notes">
                <Textarea
                  value={draft.notes}
                  rows={2}
                  className="min-h-[68px] bg-warm-white/85 text-sm leading-relaxed"
                  onChange={(event) => patchDraft({ notes: event.target.value })}
                />
              </Field>
            )}

            {isTask && (
              <Field label="Notes">
                <Textarea
                  value={draft.notes}
                  rows={2}
                  className="min-h-[68px] bg-warm-white/85 text-sm leading-relaxed"
                  onChange={(event) => patchDraft({ notes: event.target.value })}
                />
              </Field>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function summarizeDrafts(drafts: WorkSessionDraft[]) {
  return drafts.reduce(
    (summary, draft) => {
      if (draft.selected && !draft.saved) summary.selected += 1;
      if (draft.category === "Task") summary.tasks += 1;
      if (draft.category === "Idea") summary.ideas += 1;
      if (draft.category === "Framework") summary.frameworks += 1;
      if (draft.category === "Product" || draft.category === "Product Update")
        summary.products += 1;
      return summary;
    },
    { selected: 0, tasks: 0, ideas: 0, frameworks: 0, products: 0 },
  );
}

function getTitleLabel(category: WorkSessionCategory) {
  if (category === "Framework") return "Framework Title";
  if (category === "Product" || category === "Product Update") return "Product Name";
  if (category === "Task") return "Task Title";
  return "Title";
}

function confidenceClass(level: ConfidenceLevel) {
  if (level === "High") return "border-gold/30 bg-gold/15 text-plum-deep";
  if (level === "Medium") return "border-plum-soft/25 bg-lavender/35 text-plum-deep";
  return "border-muted-foreground/20 bg-muted/40 text-muted-foreground";
}

function SummaryPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-plum-soft/15 bg-warm-white/80 px-3 py-1">
      {children}
    </span>
  );
}

function MetaPill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "plum" | "gold";
}) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
        tone === "plum" && "border-plum-soft/25 bg-plum-soft/10 text-plum-deep",
        tone === "gold" && "border-gold/25 bg-gold/15 text-plum-deep",
        tone === "neutral" && "border-plum-soft/10 bg-warm-white/75 text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

function ConfidencePill({ level }: { level: ConfidenceLevel }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
        confidenceClass(level),
      )}
    >
      {level} Confidence
    </span>
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
    <div className={cn("grid gap-1", className)}>
      <Label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}
