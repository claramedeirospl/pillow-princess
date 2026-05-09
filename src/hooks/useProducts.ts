import { useState, useMemo } from "react";
import { useProductsStore } from "@/store/productsStore";
import type { ProductCategory } from "@/@types";

type SortOption = "default" | "asc" | "desc";

export function useFilteredProducts() {
  const products = useProductsStore((s) => s.products);
  const [category, setCategory] = useState<ProductCategory | "todos">("todos");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("default");

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchCategory = category === "todos" || p.category === category;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });

    if (sort === "asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "desc") list = [...list].sort((a, b) => b.price - a.price);

    return list;
  }, [products, category, search, sort]);

  return { filtered, category, setCategory, search, setSearch, sort, setSort };
}

export function useProductsByCategory() {
  const products = useProductsStore((s) => s.products);
  return {
    pijamas: products.filter((p) => p.category === "pijamas"),
    lingerie: products.filter((p) => p.category === "lingerie"),
    featured: products.filter((p) => p.tag).slice(0, 4),
  };
}
