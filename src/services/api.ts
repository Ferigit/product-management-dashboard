import type {
  Product,
  PaginatedResponse,
  ProductFilters,
  ProductFormData,
} from "../types";

const API_BASE = "/api";

export const productsApi = {
  getProducts: async (
    filters?: ProductFilters,
  ): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.pageSize)
      params.append("pageSize", filters.pageSize.toString());

    const response = await fetch(`${API_BASE}/products?${params}`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  getProduct: async (id: string | undefined): Promise<Product> => {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
  },

  createProduct: async (data: ProductFormData): Promise<Product> => {
    const response = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create product");
    return response.json();
  },

  updateProduct: async (
    id: string,
    data: ProductFormData,
  ): Promise<Product> => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update product");
    return response.json();
  },

  deleteProduct: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete product");
  },

  checkSkuAvailability: async (
    sku: string,
  ): Promise<{ available: boolean }> => {
    const response = await fetch(`${API_BASE}/products/check-sku/${sku}`);
    if (!response.ok) throw new Error("Failed to check SKU");
    return response.json();
  },
};
