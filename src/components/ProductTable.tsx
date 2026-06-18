import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { getStatusColor } from "../utils/productUtils";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
}

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-24" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-48" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-16" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-20" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-12" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-8" />
    </td>
    <td className="px-6 py-4">
      <div className="h-6 bg-gray-200 rounded-full w-16" />
    </td>
  </tr>
);

export const ProductTable = ({ products, isLoading }: ProductTableProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-48 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="w-64 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="w-20 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="w-28 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: 5 }).map((_, idx) => (
              <SkeletonRow key={idx} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No products found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full table-fixed divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-48 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="w-64 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SKU
            </th>
            <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="w-20 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="w-28 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr
              key={product.id}
              onClick={() => navigate(`/products/${product.id}`)}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {product.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div className="line-clamp-2">{product.description}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{product.sku}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {product.category}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                ${product.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 text-center">
                {product.stock}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-4 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(product.status)}`}
                >
                  {product.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
