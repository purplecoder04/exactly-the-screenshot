import { useCallback } from "react";
import { useLocalState } from "./useLocalState";
import { STORAGE_KEYS, newId, nowISO } from "@/lib/storage";
import { SAMPLE_PRODUCT_CATALOG } from "@/data/sampleData";
import { areaTypeFor, type ProductCatalogItem, type WorkspaceArea } from "@/lib/types";

type ProductInput = Omit<ProductCatalogItem, "id" | "areaType" | "createdAt" | "updatedAt"> & {
  branch: WorkspaceArea;
};

export function useProductCatalog() {
  const [products, setProducts] = useLocalState<ProductCatalogItem[]>(
    STORAGE_KEYS.productCatalog,
    SAMPLE_PRODUCT_CATALOG,
  );

  const addProduct = useCallback(
    (data: ProductInput) => {
      const product: ProductCatalogItem = {
        ...data,
        id: newId("prod"),
        areaType: areaTypeFor(data.branch),
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };
      setProducts((current) => [product, ...current]);
      return product;
    },
    [setProducts],
  );

  const updateProduct = useCallback(
    (id: string, patch: Partial<ProductCatalogItem>) => {
      setProducts((current) =>
        current.map((product) =>
          product.id === id
            ? {
                ...product,
                ...patch,
                areaType: patch.branch ? areaTypeFor(patch.branch) : product.areaType,
                updatedAt: nowISO(),
              }
            : product,
        ),
      );
    },
    [setProducts],
  );

  const deleteProduct = useCallback(
    (id: string) => setProducts((current) => current.filter((product) => product.id !== id)),
    [setProducts],
  );

  return { products, setProducts, addProduct, updateProduct, deleteProduct };
}
