import type { ReactNode } from "react";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import type { WorkSessionDraft } from "@/lib/workSessionParser";

type Props = {
  drafts: WorkSessionDraft[];
  sourceDescription: string;
  onUpdate: (draftId: string, patch: Partial<WorkSessionDraft>) => void;
  onRemove: (draftId: string) => void;
  onSave: () => void;
};

export function WorkSessionReview({ drafts, sourceDescription, onUpdate, onRemove, onSave }: Props) {
  const selectedCount = drafts.filter((draft) => draft.selected).length;

  return (
    <PlannerPanel
      title="Review Before Saving"
      description={`${drafts.length} proposed item${drafts.length === 1 ? "" : "s"} from ${sourceDescription}. ${selectedCount} selected.`}
      action={
        <Button disabled={selectedCount === 0} onClick={onSave}>
          <Save className="mr-1 h-4 w-4" />
          Save selected
        </Button>
      }
    >
      {drafts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-plum-soft/25 bg-card/70 p-8 text-center text-sm text-muted-foreground">
          Nothing structured yet. Add lines like TODO:, Idea:, Framework:, Product Update:, Meeting Note:, Founder Note:, or Prompt:.
        </div>
      ) : (
        <div className="grid gap-4">
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
  const isTask = draft.category === "Task";

  return (
    <Card className={draft.selected ? "planner-soft-hover bg-card/90" : "bg-muted/30 opacity-75"}>
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-ink">
            <Checkbox
              checked={draft.selected}
              onCheckedChange={(checked) => onUpdate(draft.draftId, { selected: !!checked })}
            />
            <span>Save item {index + 1}</span>
          </label>
          <Button variant="ghost" size="sm" onClick={() => onRemove(draft.draftId)}>
            <X className="mr-1 h-4 w-4" />
            Remove
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Output type">
            <Select
              value={draft.category}
              onValueChange={(value) => onUpdate(draft.draftId, { category: value as WorkSessionCategory })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {WORK_SESSION_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <Field label={isTask ? "Task title" : "Title"} className="md:col-span-2">
            <Input value={draft.title} onChange={(event) => onUpdate(draft.draftId, { title: event.target.value })} />
          </Field>

          <Field label="Project / Product">
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

          {isTask && (
            <>
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

              <Field label="Next step" className="md:col-span-2">
                <Input
                  value={draft.nextStep}
                  placeholder="Optional"
                  onChange={(event) => onUpdate(draft.draftId, { nextStep: event.target.value })}
                />
              </Field>
            </>
          )}

          <Field label={isTask ? "Notes" : "Body / Notes"} className="md:col-span-2">
            <Textarea
              value={isTask ? draft.notes : draft.body}
              rows={3}
              onChange={(event) =>
                onUpdate(draft.draftId, isTask ? { notes: event.target.value } : { body: event.target.value })
              }
            />
          </Field>
        </div>

        {isTask && (
          <label className="flex items-center gap-2 rounded-2xl border border-plum-soft/20 bg-lavender/20 px-3 py-2 text-sm text-ink">
            <Checkbox
              checked={draft.isToday}
              onCheckedChange={(checked) => onUpdate(draft.draftId, { isToday: !!checked })}
            />
            <span>Add to Today</span>
          </label>
        )}
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
