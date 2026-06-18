export type ProductStatus = "active" | "inactive" | "archived";
export type ProductCategory =
  | "Electronics"
  | "Clothing"
  | "Food"
  | "Books"
  | "Other";

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  status: ProductStatus;
  stock: number;
  weight?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  sku: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  status: ProductStatus;
  stock: number;
  weight?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductFilters {
  search?: string;
  status?: ProductStatus;
  category?: ProductCategory;
  page?: number;
  pageSize?: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  status: ProductStatus;
  stock: number;
  weight?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  sku: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  status: ProductStatus;
  stock: number;
  weight?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductFilters {
  search?: string;
  status?: ProductStatus;
  category?: ProductCategory;
  page?: number;
  pageSize?: number;
}
