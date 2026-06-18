// src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../services/api";
import type { ProductFilters } from "../types";

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => productsApi.getProducts(filters),
  });
};
