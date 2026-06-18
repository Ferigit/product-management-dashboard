import { useState } from "react";
import type { ProductFormData } from "../types";
import { CATEGORIES, STATUSES } from "../constants/product";
import {
  TextField,
  TextAreaField,
  NumberField,
  SelectField,
  SKUField,
} from "./form";

interface ProductFormProps {
  defaultValues?: Partial<ProductFormData>;
  originalSku?: string;
  existingId?: string;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void | Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
}

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
  const [form, setForm] = useState<ProductFormData>(() => ({
    ...emptyValues,
    ...defaultValues,
  }));
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormData, string>>
  >({});
  const [skuChecking, setSkuChecking] = useState(false);
  const [skuAvailable, setSkuAvailable] = useState<boolean | null>(null);

  const validate = (): boolean => {
    const next: Partial<Record<keyof ProductFormData, string>> = {};

    if (!form.sku.trim()) next.sku = "SKU is required.";
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.description.trim()) next.description = "Description is required.";
    if (form.price <= 0) next.price = "Price must be greater than 0.";
    if (form.stock < 0) next.stock = "Stock cannot be negative.";
    if (form.weight !== undefined && form.weight < 0)
      next.weight = "Weight cannot be negative.";
    if (
      form.category === "Electronics" &&
      (form.weight === undefined || form.weight <= 0)
    ) {
      next.weight = "Weight must be greater than 0 for Electronics.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "number" ? (value === "" ? undefined : Number(value)) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (name === "sku") setSkuAvailable(null);
  };

  const handleSkuBlur = async () => {
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <SKUField
        label="SKU"
        name="sku"
        value={form.sku}
        onChange={handleChange}
        onBlur={handleSkuBlur}
        error={errors.sku}
        required
        disabled={isSubmitting}
        isChecking={skuChecking}
        isAvailable={skuAvailable}
      />

      <TextField
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        required
        disabled={isSubmitting}
      />

      <TextAreaField
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        rows={3}
        error={errors.description}
        required
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-2 gap-4">
        <NumberField
          label="Price ($)"
          name="price"
          value={form.price}
          onChange={handleChange}
          min={0}
          step={0.01}
          error={errors.price}
          required
          disabled={isSubmitting}
        />
        <NumberField
          label="Stock"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          min={0}
          error={errors.stock}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          error={errors.category}
          required
          disabled={isSubmitting}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          error={errors.status}
          required
          disabled={isSubmitting}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </SelectField>
      </div>

      <NumberField
        label="Weight (kg)"
        name="weight"
        value={form.weight ?? ""}
        onChange={handleChange}
        min={0}
        step={0.01}
        error={errors.weight}
        disabled={isSubmitting}
        placeholder="Optional"
      />

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
