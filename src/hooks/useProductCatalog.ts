import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { nowISO } from "@/lib/storage";
import { areaTypeFor, type ProductCatalogItem, type WorkspaceArea } from "@/lib/types";
import {
  productPatchToUpdate,
  productToInsert,
  rowToProduct,
  type ProductRow,
} from "@/lib/mappers/products";

type ProductInput = Omit<ProductCatalogItem, "id" | "areaType" | "createdAt" | "updatedAt"> & {
  branch: WorkspaceArea;
};

export function useProductCatalog() {
  const [products, setProducts] = useState<ProductCatalogItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error("[useProductCatalog] load failed", error);
        return;
      }
      setProducts((data as ProductRow[]).map(rowToProduct));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addProduct = useCallback((data: ProductInput) => {
    const optimistic: ProductCatalogItem = {
      ...data,
      isLocked: data.isLocked ?? false,
      id: `tmp_${Date.now()}`,
      areaType: areaTypeFor(data.branch),
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    setProducts((prev) => [optimistic, ...prev]);
    void supabase
      .from("products")
      .insert(productToInsert(data))
      .select()
      .single()
      .then(({ data: row, error }) => {
        if (error || !row) {
          console.error("[useProductCatalog] add failed", error);
          setProducts((prev) => prev.filter((p) => p.id !== optimistic.id));
          return;
        }
        setProducts((prev) =>
          prev.map((p) => (p.id === optimistic.id ? rowToProduct(row as ProductRow) : p)),
        );
      });
    return optimistic;
  }, []);

  const updateProduct = useCallback((id: string, patch: Partial<ProductCatalogItem>) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? product.isLocked && patch.isLocked !== false
            ? product
            : {
                ...product,
                ...patch,
                areaType: patch.branch ? areaTypeFor(patch.branch) : product.areaType,
                updatedAt: nowISO(),
              }
          : product,
      ),
    );
    const upd = productPatchToUpdate(patch);
    if (Object.keys(upd).length === 0) return;
    void supabase
      .from("products")
      .update(upd)
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error("[useProductCatalog] update failed", error);
      });
  }, []);

  const toggleProductLock = useCallback((id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isLocked: !p.isLocked, updatedAt: nowISO() } : p)),
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    let allowed = true;
    setProducts((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target?.isLocked) {
        allowed = false;
        return prev;
      }
      return prev.filter((p) => p.id !== id);
    });
    if (!allowed) return;
    void supabase
      .from("products")
      .delete()
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error("[useProductCatalog] delete failed", error);
      });
  }, []);

  return { products, setProducts, addProduct, updateProduct, deleteProduct, toggleProductLock };
}
