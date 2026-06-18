// src/features/products/EditProduct.tsx
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ProductForm from "../../components/ProductForm";
import { productsApi } from "../../services/api";
import type { Product, ProductFormData, PaginatedResponse } from "../../types";

export function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id,
  });

  const {
    mutate,
    isPending,
    isError: isMutateError,
    error: mutateError,
  } = useMutation({
    mutationFn: (data: ProductFormData) => productsApi.updateProduct(id!, data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["product", id] });
      await queryClient.cancelQueries({ queryKey: ["products"] });

      const previousProduct = queryClient.getQueryData<Product>([
        "product",
        id,
      ]);
      const previousLists = queryClient.getQueriesData({
        queryKey: ["products"],
      });

      if (previousProduct) {
        const updatedProduct: Product = {
          ...previousProduct,
          ...newData,
          updatedAt: new Date().toISOString(),
        };

        queryClient.setQueryData(["product", id], updatedProduct);

        queryClient.setQueriesData<PaginatedResponse<Product>>(
          { queryKey: ["products"] },
          (old: PaginatedResponse<Product> | undefined) => {
            if (!old?.data) return old;
            return {
              ...old,
              data: old.data.filter((p: Product) => p.id !== id),
              total: old.total - 1,
            };
          },
        );
      }

      return { previousProduct, previousLists };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousProduct) {
        queryClient.setQueryData(["product", id], context.previousProduct);
      }
      if (context?.previousLists) {
        context.previousLists.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onSuccess: () => {
      navigate(`/products/${id}`);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading product...</div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg text-red-600">Product not found</div>
        <button
          onClick={() => navigate("/products")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const defaultValues: ProductFormData = {
    sku: product.sku,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    status: product.status,
    stock: product.stock,
    weight: product.weight,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/products/${id}`)}
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
            Back to Product
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-1">{product.name}</p>
        </div>

        {isMutateError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">
              {(mutateError as Error)?.message ?? "Failed to update product."}
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          <ProductForm
            key={id}
            defaultValues={defaultValues}
            originalSku={product.sku}
            existingId={id}
            onSubmit={(data) => mutate(data)}
            onCancel={() => navigate(`/products/${id}`)}
            isSubmitting={isPending}
          />
        </div>
      </div>
    </div>
  );
}
