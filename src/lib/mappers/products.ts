import {
  areaTypeFor,
  type ProductCatalogItem,
  type ProductCatalogType,
  type ProductStatus,
  type WorkspaceArea,
} from "@/lib/types";
import type { Database } from "@/integrations/supabase/types";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];

export function rowToProduct(row: ProductRow): ProductCatalogItem {
  const branch = (row.branch ?? "Brand") as WorkspaceArea;
  return {
    id: row.id,
    name: row.name,
    branch,
    areaType: areaTypeFor(branch),
    collection: row.design_preset ?? "",
    type: (row.type as ProductCatalogType) ?? "Other",
    status: (row.status as ProductStatus) ?? "Idea",
    lessonGuide: "",
    workbook: "",
    quiz: "",
    app: "",
    website: "",
    bundle: "",
    bridgeProduct: "",
    version: "",
    notes: "",
    isLocked: false,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.created_at ?? new Date().toISOString(),
  };
}

export function productToInsert(p: Partial<ProductCatalogItem> & { name: string; branch: WorkspaceArea }): ProductInsert {
  return {
    name: p.name,
    branch: p.branch,
    type: p.type ?? "Other",
    status: p.status ?? "Idea",
    design_preset: p.collection ?? null,
    created_from: "ceo_studio",
  };
}

export function productPatchToUpdate(patch: Partial<ProductCatalogItem>): Partial<ProductInsert> {
  const u: Partial<ProductInsert> = {};
  if (patch.name !== undefined) u.name = patch.name;
  if (patch.branch !== undefined) u.branch = patch.branch;
  if (patch.type !== undefined) u.type = patch.type;
  if (patch.status !== undefined) u.status = patch.status;
  if (patch.collection !== undefined) u.design_preset = patch.collection;
  return u;
}
