import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProductsStore } from "@/store/productsStore";
import type { Product, ProductCategory } from "@/@types";

const PRODUCTS_KEY = ["products"] as const;

// Simulates a future API call — swap the store read for a fetch() call when the backend is ready.
async function fetchProducts(): Promise<Product[]> {
  return useProductsStore.getState().products;
}

export function useProductsQuery() {
  return useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: fetchProducts,
    initialData: () => useProductsStore.getState().products,
  });
}

export function useProductsByCategory(category: ProductCategory | "todos") {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, category],
    queryFn: () => {
      const all = useProductsStore.getState().products;
      return category === "todos" ? all : all.filter((p) => p.category === category);
    },
  });
}

export function useCreateProductMutation() {
  const qc = useQueryClient();
  const { addProduct } = useProductsStore();

  return useMutation({
    mutationFn: async (product: Product) => {
      addProduct(product);
      return product;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}

export function useUpdateProductMutation() {
  const qc = useQueryClient();
  const { updateProduct } = useProductsStore();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      updateProduct(id, updates);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}

export function useDeleteProductMutation() {
  const qc = useQueryClient();
  const { deleteProduct } = useProductsStore();

  return useMutation({
    mutationFn: async (id: string) => {
      deleteProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}
