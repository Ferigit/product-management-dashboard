// src/components/ProductForm.tsx
import { useState } from "react";
import type { ProductFormData, ProductCategory, ProductStatus } from "../types";

interface ProductFormProps {
  defaultValues?: Partial<ProductFormData>;
  originalSku?: string; // used to skip SKU availability check in edit mode
  existingId?: string; // reserved for future use (e.g. exclude self from uniqueness check)
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void | Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const CATEGORIES: ProductCategory[] = [
  "Electronics",
  "Clothing",
  "Food",
  "Books",
  "Other",
];

const STATUSES: ProductStatus[] = ["active", "inactive", "archived"];

const emptyValues: ProductFormData = {
  sku: "",
  name: "",
  description: "",
  price: 0,
  category: "Other",
  status: "active",
  stock: 0,
  weight: undefined,
};

export default function ProductForm({
  defaultValues,
  originalSku,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Submit",
}: ProductFormProps) {
  // const [form, setForm] = useState<ProductFormData>({
  //   ...emptyValues,
  //   ...defaultValues,
  // });
  const [form, setForm] = useState<ProductFormData>(() => ({
    ...emptyValues,
    ...defaultValues,
  }));
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormData, string>>
  >({});
  const [skuChecking, setSkuChecking] = useState(false);
  const [skuAvailable, setSkuAvailable] = useState<boolean | null>(null);

  // Hydrate form once defaultValues arrive (edit mode: query resolves after mount)
  // useEffect(() => {
  //   if (defaultValues) {
  //     setForm({ ...emptyValues, ...defaultValues });
  //   }
  // }, [defaultValues]);

  function validate(): boolean {
    const next: Partial<Record<keyof ProductFormData, string>> = {};

    if (!form.sku.trim()) next.sku = "SKU is required.";
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.description.trim()) next.description = "Description is required.";
    if (form.price <= 0) next.price = "Price must be greater than 0.";
    if (form.stock < 0) next.stock = "Stock cannot be negative.";
    if (form.weight !== undefined && form.weight < 0)
      next.weight = "Weight cannot be negative.";

    // Cross‑field: if category is Electronics, weight must be > 0
    if (
      form.category === "Electronics" &&
      (form.weight === undefined || form.weight <= 0)
    ) {
      next.weight = "Weight must be greater than 0 for Electronics.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "number" ? (value === "" ? undefined : Number(value)) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (name === "sku") setSkuAvailable(null);
  }

  async function handleSkuBlur() {
    // Skip check if SKU hasn't changed from the original (edit mode)
    if (!form.sku.trim() || originalSku === form.sku) return;

    setSkuChecking(true);
    try {
      const { productsApi } = await import("../services/api");
      const result = await productsApi.checkSkuAvailability(form.sku);
      setSkuAvailable(result.available);
      if (!result.available) {
        setErrors((prev) => ({ ...prev, sku: "This SKU is already in use." }));
      }
    } catch {
      // server will enforce uniqueness on submit
    } finally {
      setSkuChecking(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* SKU */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          SKU <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            onBlur={handleSkuBlur}
            disabled={isSubmitting}
            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.sku ? "border-red-400" : "border-gray-300"
            }`}
          />
          {skuChecking && (
            <span className="absolute right-3 top-2.5 text-xs text-gray-400">
              Checking…
            </span>
          )}
          {!skuChecking && skuAvailable === true && (
            <span className="absolute right-3 top-2.5 text-xs text-green-500">
              ✓ Available
            </span>
          )}
        </div>
        {errors.sku && (
          <p className="mt-1 text-xs text-red-500">{errors.sku}</p>
        )}
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          disabled={isSubmitting}
          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          disabled={isSubmitting}
          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
            errors.description ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Price & Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            min={0}
            step={0.01}
            disabled={isSubmitting}
            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.price ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-500">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            min={0}
            disabled={isSubmitting}
            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.stock ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.stock && (
            <p className="mt-1 text-xs text-red-500">{errors.stock}</p>
          )}
        </div>
      </div>

      {/* Category & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Weight (optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Weight (kg){" "}
          <span className="text-gray-400 font-normal text-xs">optional</span>
        </label>
        <input
          type="number"
          name="weight"
          value={form.weight ?? ""}
          onChange={handleChange}
          min={0}
          step={0.01}
          disabled={isSubmitting}
          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.weight ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.weight && (
          <p className="mt-1 text-xs text-red-500">{errors.weight}</p>
        )}
      </div>

      {/* Actions */}
      <div className="pt-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-5 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
