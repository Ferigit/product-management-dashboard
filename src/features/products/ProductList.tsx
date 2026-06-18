import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useDebounce } from "../../hooks/useDebounce";
import { ProductTable } from "../../components/ProductTable";
import { ProductFilters } from "../../components/ProductFilters";
import { PaginationControls } from "../../components/PaginationControls";
import type {
  ProductFilters as ProductFiltersType,
  ProductStatus,
  ProductCategory,
} from "../../types";

export const ProductList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const debouncedSearch = useDebounce(searchInput, 300);

  const filters: ProductFiltersType = {
    search: debouncedSearch || undefined,
    status: (searchParams.get("status") as ProductStatus) || undefined,
    category: (searchParams.get("category") as ProductCategory) || undefined,
    page: parseInt(searchParams.get("page") || "1", 10),
    pageSize: parseInt(searchParams.get("pageSize") || "10", 10),
  };

  const { data, isLoading, error } = useProducts(filters);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) params.set("search", debouncedSearch);
    else params.delete("search");
    params.set("page", "1");
    setSearchParams(params);
  }, [debouncedSearch, searchParams, setSearchParams]);

  const handleFilterChange = (key: "status" | "category", value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageSizeChange = (newSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("pageSize", String(newSize));
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Failed to load products</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header - stacked on mobile */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Products
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your product inventory
          </p>
        </div>
        <button
          onClick={() => navigate("/products/new")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Product
        </button>
      </div>

      <ProductFilters
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        status={searchParams.get("status") || ""}
        onStatusChange={(value) => handleFilterChange("status", value)}
        category={searchParams.get("category") || ""}
        onCategoryChange={(value) => handleFilterChange("category", value)}
      />

      <ProductTable products={data?.data || []} isLoading={isLoading} />

      {data && (
        <PaginationControls
          currentPage={data.page}
          totalPages={data.totalPages}
          totalItems={data.total}
          pageSize={filters.pageSize!}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};
