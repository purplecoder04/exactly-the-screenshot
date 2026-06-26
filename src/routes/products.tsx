import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PackageOpen, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AreaPill } from "@/components/shared/AreaPill";
import { PlannerPageHeader, PlannerPanel } from "@/components/shared/PlannerPageHeader";
import { useProductCatalog } from "@/hooks/useProductCatalog";
import { plannerAssets } from "@/lib/plannerAssets";
import {
  ALL_AREAS,
  PRODUCT_CATALOG_TYPES,
  PRODUCT_STATUSES,
  type ProductCatalogItem,
  type ProductCatalogType,
  type ProductStatus,
  type WorkspaceArea,
} from "@/lib/types";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Product Catalog - Best Collective" },
      { name: "description", content: "The master catalog for Best Collective products." },
    ],
  }),
  component: ProductCatalogPage,
});

const EMPTY_PRODUCT: Omit<ProductCatalogItem, "id" | "areaType" | "createdAt" | "updatedAt"> = {
  name: "",
  branch: "Brand",
  collection: "",
  type: "Other",
  status: "Idea",
  lessonGuide: "",
  workbook: "",
  quiz: "",
  app: "",
  website: "",
  bundle: "",
  bridgeProduct: "",
  version: "v0.1",
  notes: "",
};

function ProductCatalogPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductCatalog();
  const [query, setQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState<WorkspaceArea | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductCatalogItem | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      if (branchFilter !== "all" && product.branch !== branchFilter) return false;
      if (statusFilter !== "all" && product.status !== statusFilter) return false;
      if (!q) return true;
      return [
        product.name,
        product.branch,
        product.collection,
        product.type,
        product.status,
        product.lessonGuide,
        product.workbook,
        product.quiz,
        product.app,
        product.website,
        product.bundle,
        product.bridgeProduct,
        product.version,
        product.notes,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [branchFilter, products, query, statusFilter]);

  return (
    <div className="space-y-6">
      <PlannerPageHeader
        eyebrow="Master Catalog"
        title="Product Catalog"
        description="Track every Best Collective product, bridge product, app, website, workbook, quiz, and bundle in one place."
        decorAsset={plannerAssets.bookJournal}
        decorClassName="right-10 top-4 h-32 w-32 rotate-[-5deg] opacity-22"
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Product
          </Button>
        }
      />

      <PlannerPanel title="Search & Filters" description="Find products by name, branch, status, version, or connected assets.">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." className="pl-9" />
          </div>
          <Select value={branchFilter} onValueChange={(value) => setBranchFilter(value as WorkspaceArea | "all")}>
            <SelectTrigger><SelectValue placeholder="Branch" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All branches</SelectItem>
              {ALL_AREAS.map((area) => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ProductStatus | "all")}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {PRODUCT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PlannerPanel>

      <PlannerPanel title="Catalog" description={`${filtered.length} product${filtered.length === 1 ? "" : "s"} shown.`}>
        <div className="grid gap-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => {
                setEditing(product);
                setOpen(true);
              }}
              onDelete={() => deleteProduct(product.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-plum-soft/25 bg-card/70 p-8 text-center text-sm text-muted-foreground">
              No products match this view.
            </div>
          )}
        </div>
      </PlannerPanel>

      <ProductDialog
        open={open}
        initial={editing}
        onOpenChange={setOpen}
        onSubmit={(data) => {
          if (editing) {
            updateProduct(editing.id, data);
            toast.success("Product updated.");
          } else {
            addProduct(data);
            toast.success("Product added.");
          }
        }}
      />
    </div>
  );
}

function ProductCard({ product, onEdit, onDelete }: { product: ProductCatalogItem; onEdit: () => void; onDelete: () => void }) {
  return (
    <Card className="planner-soft-hover bg-card/88">
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <PackageOpen className="h-4 w-4 text-gold" />
            <h3 className="font-display text-2xl leading-tight text-ink break-words">{product.name}</h3>
            <AreaPill area={product.branch} />
            <span className="rounded-full bg-lavender/35 px-2.5 py-0.5 text-xs font-medium text-ink">{product.status}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {product.collection || "Unassigned collection"} • {product.type} • {product.version}
          </p>
          <div className="mt-3 grid gap-2 text-xs md:grid-cols-4">
            <Mini label="Lesson Guide" value={product.lessonGuide} />
            <Mini label="Workbook" value={product.workbook} />
            <Mini label="Quiz" value={product.quiz} />
            <Mini label="App" value={product.app} />
            <Mini label="Website" value={product.website} />
            <Mini label="Bundle" value={product.bundle} />
            <Mini label="Bridge Product" value={product.bridgeProduct} />
            <Mini label="Notes" value={product.notes} />
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

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-warm-white/60 p-2">
      <div className="font-semibold text-muted-foreground">{label}</div>
      <div className="mt-1 text-ink break-words">{value || "—"}</div>
    </div>
  );
}

function ProductDialog({
  open,
  initial,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  initial: ProductCatalogItem | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<ProductCatalogItem, "id" | "areaType" | "createdAt" | "updatedAt">) => void;
}) {
  const [form, setForm] = useState(EMPTY_PRODUCT);

  useEffect(() => {
    if (!open) return;
    setForm(initial ?? EMPTY_PRODUCT);
  }, [initial, open]);

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{initial ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Product Name" className="md:col-span-2">
            <Input value={form.name} onChange={(event) => setField("name", event.target.value)} />
          </Field>
          <Field label="Branch">
            <Select value={form.branch} onValueChange={(value) => setField("branch", value as WorkspaceArea)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ALL_AREAS.map((area) => <SelectItem key={area} value={area}>{area}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Collection">
            <Input value={form.collection} onChange={(event) => setField("collection", event.target.value)} />
          </Field>
          <Field label="Type">
            <Select value={form.type} onValueChange={(value) => setField("type", value as ProductCatalogType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRODUCT_CATALOG_TYPES.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={form.status} onValueChange={(value) => setField("status", value as ProductStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRODUCT_STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          {(["lessonGuide", "workbook", "quiz", "app", "website", "bundle", "bridgeProduct", "version"] as const).map((field) => (
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
