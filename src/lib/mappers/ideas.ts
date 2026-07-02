import { areaTypeFor, type ParkingLotDecision, type ParkingLotItem, type WorkspaceArea } from "@/lib/types";
import type { Database } from "@/integrations/supabase/types";

export type IdeaRow = Database["public"]["Tables"]["ideas"]["Row"];
export type IdeaInsert = Database["public"]["Tables"]["ideas"]["Insert"];

const DECISIONS: ParkingLotDecision[] = ["Keep", "Maybe", "Later"];

export function rowToParkingLot(row: IdeaRow): ParkingLotItem {
  const branch = (row.branch ?? "Brand") as WorkspaceArea;
  const decision = (DECISIONS.includes(row.status as ParkingLotDecision)
    ? (row.status as ParkingLotDecision)
    : "Maybe") as ParkingLotDecision;
  return {
    id: row.id,
    idea: row.content,
    branch,
    areaType: areaTypeFor(branch),
    type: (row.type as ParkingLotItem["type"]) ?? "Idea",
    priority: "Medium",
    decision,
    notes: "",
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.created_at ?? new Date().toISOString(),
  };
}

export function parkingLotToInsert(
  i: Partial<ParkingLotItem> & { idea: string; branch: WorkspaceArea },
): IdeaInsert {
  return {
    content: i.idea,
    source_app: "ceo_studio",
    type: i.type ?? "Idea",
    branch: i.branch,
    status: i.decision ?? "Maybe",
  };
}

export function parkingLotPatchToUpdate(patch: Partial<ParkingLotItem>): Partial<IdeaInsert> {
  const u: Partial<IdeaInsert> = {};
  if (patch.idea !== undefined) u.content = patch.idea;
  if (patch.type !== undefined) u.type = patch.type;
  if (patch.branch !== undefined) u.branch = patch.branch;
  if (patch.decision !== undefined) u.status = patch.decision;
  return u;
}
