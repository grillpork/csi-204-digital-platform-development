"use client";

import { useState } from "react";
import ProductForm from "./ProductForm";
import ProductsTable from "./ProductsTable";

export default function CreateProductWithLivePanel({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);

  const handleCreated = (product) => setProducts((prev) => [product, ...prev]);

  const handleDelete = async (id) => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">เพิ่มสินค้า</h1>
        <ProductForm mode="create" onCreated={handleCreated} />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">
          สินค้าของฉัน ({products.length})
        </p>
        <ProductsTable products={products} onDelete={handleDelete} emptyMessage="ยังไม่มีสินค้า" />
      </div>
    </div>
  );
}
