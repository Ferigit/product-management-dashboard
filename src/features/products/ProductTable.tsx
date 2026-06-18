import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { getStatusColor } from "../utils/productUtils";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
}

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow p-4 animate-pulse space-y-3">
    <div className="h-4 bg-gray-200 rounded w-3/4" />
    <div className="h-3 bg-gray-200 rounded w-1/2" />
    <div className="flex justify-between">
      <div className="h-3 bg-gray-200 rounded w-1/4" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
    </div>
    <div className="flex justify-between items-center">
      <div className="h-6 bg-gray-200 rounded-full w-16" />
      <div className="h-4 bg-gray-200 rounded w-12" />
    </div>
  </div>
);

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-4 sm:px-6 py-3 sm:py-4">
      <div className="h-4 bg-gray-200 rounded w-20 sm:w-24" />
    </td>
    <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
      <div className="h-4 bg-gray-200 rounded w-32 sm:w-48" />
    </td>
    <td className="px-4 sm:px-6 py-3 sm:py-4">
      <div className="h-4 bg-gray-200 rounded w-12 sm:w-16" />
    </td>
    <td className="px-4 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
      <div className="h-4 bg-gray-200 rounded w-14 sm:w-20" />
    </td>
    <td className="px-4 sm:px-6 py-3 sm:py-4">
      <div className="h-4 bg-gray-200 rounded w-10 sm:w-12" />
    </td>
    <td className="px-4 sm:px-6 py-3 sm:py-4">
      <div className="h-4 bg-gray-200 rounded w-8" />
    </td>
    <td className="px-4 sm:px-6 py-3 sm:py-4">
      <div className="h-6 bg-gray-200 rounded-full w-14 sm:w-16" />
    </td>
  </tr>
);

const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
            {product.description}
          </p>
        </div>
        <span
          className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}
        >
          {product.status}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
        <span>
          <span className="font-medium">SKU:</span> {product.sku}
        </span>
        <span>
          <span className="font-medium">Category:</span> {product.category}
        </span>
        <span>
          <span className="font-medium">Price:</span> $
          {product.price.toFixed(2)}
        </span>
        <span>
          <span className="font-medium">Stock:</span> {product.stock}
        </span>
      </div>
    </div>
  );
};

export const ProductTable = ({ products, isLoading }: ProductTableProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <>
        {/* Mobile skeleton cards */}
        <div className="block sm:hidden grid grid-cols-1 gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
        {/* Desktop skeleton table */}
        <div className="hidden sm:block overflow-x-auto w-full max-w-full bg-white rounded-lg shadow">
          <table className="min-w-[600px] w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-32 sm:w-48 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="w-40 sm:w-64 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Description
                </th>
                <th className="w-20 sm:w-32 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="w-24 sm:w-32 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Category
                </th>
                <th className="w-16 sm:w-24 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="w-14 sm:w-20 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="w-24 sm:w-28 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
      </>
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
    <>
      {/* Mobile card grid */}
      <div className="block sm:hidden grid grid-cols-1 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Desktop table with horizontal scroll container */}
      <div className="hidden sm:block overflow-x-auto w-full max-w-full bg-white rounded-lg shadow">
        <table className="min-w-[600px] w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-32 sm:w-48 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="w-40 sm:w-64 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Description
              </th>
              <th className="w-20 sm:w-32 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="w-24 sm:w-32 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Category
              </th>
              <th className="w-16 sm:w-24 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="w-14 sm:w-20 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="w-24 sm:w-28 px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-500 hidden md:table-cell">
                  <div className="line-clamp-2">{product.description}</div>
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-500">
                  {product.sku}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-500 hidden lg:table-cell">
                  {product.category}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-900">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-500 text-center">
                  {product.stock}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <span
                    className={`px-3 sm:px-4 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(product.status)}`}
                  >
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
