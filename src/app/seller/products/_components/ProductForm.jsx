"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const CATEGORIES = [
  { value: "TSHIRT", label: "T-Shirt" },
  { value: "POLO", label: "Polo" },
  { value: "HOODIE", label: "Hoodie" },
  { value: "LONG_SLEEVE", label: "Long Sleeve" },
  { value: "TANK_TOP", label: "Tank Top" },
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductForm({ mode, productId, initial, onCreated, onUpdated }) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price != null ? String(initial.price) : "");
  const [stock, setStock] = useState(initial?.stock != null ? String(initial.stock) : "0");
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0].value);
  const [sizes, setSizes] = useState(initial?.sizes ?? []);
  const [colors, setColors] = useState(initial?.colors ?? []);
  const [colorInput, setColorInput] = useState("");
  const [files, setFiles] = useState([]); // File[]
  const [errors, setErrors] = useState({}); // { field: [msg] }
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const existingImages = initial?.images ?? [];

  const toggleSize = (size) =>
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );

  const addColor = () => {
    const c = colorInput.trim();
    if (!c || colors.includes(c)) {
      setColorInput("");
      return;
    }
    setColors((prev) => [...prev, c]);
    setColorInput("");
  };

  const removeColor = (c) => setColors((prev) => prev.filter((x) => x !== c));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setFormError("");

    // create ต้องมีรูป 1–5 ; edit รูปเป็น optional (0 = เก็บรูปเดิม)
    if (!isEdit && (files.length < 1 || files.length > 5)) {
      setErrors({ images: ["at least 1, at most 5 images"] });
      return;
    }
    if (isEdit && files.length > 5) {
      setErrors({ images: ["at most 5 images"] });
      return;
    }

    const body = new FormData();
    body.append("name", name);
    body.append("description", description);
    body.append("price", price);
    body.append("stock", stock);
    body.append("category", category);
    colors.forEach((c) => body.append("colors", c));
    sizes.forEach((s) => body.append("sizes", s));
    files.forEach((f) => body.append("images", f));

    setSubmitting(true);
    try {
      const url = isEdit ? `/api/products/${productId}` : "/api/products";
      const res = await fetch(url, { method: isEdit ? "PATCH" : "POST", body });

      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.status === 400) {
        const data = await res.json();
        setErrors(data.errors ?? {});
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setFormError(data.error ?? "Something went wrong");
        return;
      }

      if (!isEdit && onCreated) {
        const { data } = await res.json();
        onCreated(data);
        setName("");
        setDescription("");
        setPrice("");
        setStock("0");
        setCategory(CATEGORIES[0].value);
        setSizes([]);
        setColors([]);
        setFiles([]);
        return;
      }

      if (isEdit && onUpdated) {
        const { data } = await res.json();
        onUpdated(data);
        return;
      }

      router.push("/seller/products");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (field) =>
    errors[field]?.length ? (
      <p className="text-sm text-red-500 mt-1">{errors[field][0]}</p>
    ) : null;

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-500";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      {/* name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
        {fieldError("name")}
      </div>

      {/* description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={inputClass}
        />
        {fieldError("description")}
      </div>

      {/* price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price (฿)</label>
        <input
          type="number"
          min="1"
          step="1"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={inputClass}
        />
        {fieldError("price")}
      </div>

      {/* stock */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนในคลัง (stock)</label>
        <input
          type="number"
          min="0"
          step="1"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className={inputClass}
        />
        {fieldError("stock")}
      </div>

      {/* category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        {fieldError("category")}
      </div>

      {/* sizes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`px-3 py-1 text-sm border rounded-lg transition-colors ${
                sizes.includes(size)
                  ? "bg-black text-white border-black"
                  : "border-gray-300 text-gray-600 hover:border-gray-500"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        {fieldError("sizes")}
      </div>

      {/* colors */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addColor();
              }
            }}
            placeholder="e.g. Black"
            className={inputClass}
          />
          <button
            type="button"
            onClick={addColor}
            className="border border-gray-300 rounded-lg px-4 text-sm text-gray-700 hover:border-gray-500 transition-colors"
          >
            Add
          </button>
        </div>
        {colors.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {colors.map((c) => (
              <span
                key={c}
                className="flex items-center gap-1 bg-gray-100 text-gray-700 text-sm rounded-full pl-3 pr-2 py-1"
              >
                {c}
                <button
                  type="button"
                  onClick={() => removeColor(c)}
                  className="text-gray-400 hover:text-black"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
        {fieldError("colors")}
      </div>

      {/* images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
          className="text-sm text-gray-600"
        />
        <p className="text-xs text-gray-400 mt-1">
          {isEdit
            ? "Upload 1–5 images to replace, or leave empty to keep current images."
            : "Upload 1–5 images."}
        </p>

        {isEdit && existingImages.length > 0 && files.length === 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {existingImages.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
              />
            ))}
          </div>
        )}

        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {files.map((f, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={URL.createObjectURL(f)}
                alt=""
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
              />
            ))}
          </div>
        )}
        {fieldError("images")}
      </div>

      {formError && <p className="text-sm text-red-500">{formError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-black text-white rounded-xl py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {submitting ? "Saving..." : isEdit ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
