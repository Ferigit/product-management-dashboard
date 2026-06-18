import type { InputHTMLAttributes } from "react";

interface SKUFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  isChecking?: boolean;
  isAvailable?: boolean | null;
}

export const SKUField = ({
  label,
  error,
  required = false,
  isChecking = false,
  isAvailable = null,
  className = "",
  ...props
}: SKUFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-400" : "border-gray-300"
          } ${className}`}
          {...props}
        />
        {isChecking && (
          <span className="absolute right-3 top-2.5 text-xs text-gray-400">
            Checking…
          </span>
        )}
        {!isChecking && isAvailable === true && (
          <span className="absolute right-3 top-2.5 text-xs text-green-500">
            ✓ Available
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
