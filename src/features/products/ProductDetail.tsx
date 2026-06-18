// src/features/products/ProductDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { productsApi } from "../../services/api";
import { ConfirmModal } from "../../components/ConfirmModal";
import type { Product, PaginatedResponse } from "../../types";
import { getStatusColor } from "../../utils/productUtils";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ["related-products", product?.category],
    queryFn: () =>
      productsApi.getProducts({
        category: product?.category,
        pageSize: 4,
      }),
    enabled: !!product?.category,
  });

  const deleteMutation = useMutation({
    mutationFn: () => productsApi.deleteProduct(id!),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["product", id] });
      await queryClient.cancelQueries({ queryKey: ["products"] });

      const previousProduct = queryClient.getQueryData<Product>([
        "product",
        id,
      ]);
      const previousLists = queryClient.getQueriesData({
        queryKey: ["products"],
      });

      // Optimistically update the products list by removing the deleted product
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

      // Optionally remove the individual product from cache immediately
      queryClient.removeQueries({ queryKey: ["product", id] });

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
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["product", id] });
      navigate("/products");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
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

  const images = Array.from(
    { length: 4 },
    (_, i) => `https://picsum.photos/seed/${product.id}-${i}/600/600`,
  );

  const handleAddToCart = () => {
    console.log("Added to cart:", { product, quantity });
    alert(`Added ${quantity} ${product.name} to cart`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/products")}
            className="flex items-center text-gray-600 hover:text-gray-900"
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
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/products/${id}/edit`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded overflow-hidden border-2 ${
                      selectedImage === idx
                        ? "border-blue-600"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}
                  >
                    {product.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    SKU: {product.sku}
                  </span>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-4">
                <div className="text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h2>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-200">
                <div>
                  <span className="text-sm text-gray-500">Category</span>
                  <p className="font-medium text-gray-900">
                    {product.category}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Stock</span>
                  <p className="font-medium text-gray-900">
                    {product.stock} units
                  </p>
                </div>
              </div>

              {product.status === "active" && product.stock > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">
                      Quantity:
                    </label>
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(
                              1,
                              Math.min(
                                product.stock,
                                parseInt(e.target.value) || 1,
                              ),
                            ),
                          )
                        }
                        className="w-16 text-center border-x border-gray-300 py-2"
                        min="1"
                        max={product.stock}
                      />
                      <button
                        onClick={() =>
                          setQuantity(Math.min(product.stock, quantity + 1))
                        }
                        className="px-3 py-2 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              )}

              {product.stock === 0 && (
                <div className="text-red-600 font-semibold text-center py-3 bg-red-50 rounded-lg">
                  Out of Stock
                </div>
              )}
            </div>
          </div>
        </div>

        {relatedProducts && relatedProducts.data.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.data
                .filter((p) => p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <div
                    key={relatedProduct.id}
                    onClick={() => navigate(`/products/${relatedProduct.id}`)}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                  >
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={`https://picsum.photos/seed/${relatedProduct.id}/400/400`}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-lg font-bold text-gray-900">
                        ${relatedProduct.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </div>
  );
}
