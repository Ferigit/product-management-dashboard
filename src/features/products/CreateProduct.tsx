// src/features/products/CreateProduct.tsx
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ProductForm from "../../components/ProductForm";
import { productsApi } from "../../services/api";
import type { ProductFormData } from "../../types";

export function CreateProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: ProductFormData) => productsApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/products")}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Products
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Product
          </h1>
          <p className="text-gray-600 mt-1">
            Add a new product to your inventory
          </p>
        </div>

        {/* Error alert */}
        {isError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">
              {(error as Error)?.message ?? "Failed to create product."}
            </p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <ProductForm
            onSubmit={(data) => mutate(data)}
            onCancel={() => navigate("/products")}
            isSubmitting={isPending}
          />
        </div>
      </div>
    </div>
  );
}
