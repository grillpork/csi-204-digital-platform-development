"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import ProductsTable from "./ProductsTable";

export default function ProductsCommandBar({ products }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter((p) => p.name.toLowerCase().includes(term));
  }, [products, search]);

  const handleDelete = async (id) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">
          สินค้าของฉัน
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center flex-1 border border-gray-300 rounded-full px-4 py-2.5 gap-2 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-colors">
            <Search size={17} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="ค้นหาสินค้าของฉัน..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm outline-none w-full text-gray-700 placeholder-gray-400 bg-transparent"
            />
            <span className="text-xs text-gray-400 whitespace-nowrap">{filtered.length} รายการ</span>
          </div>
          <Link
            href="/seller/products/new"
            aria-label="เพิ่มสินค้า"
            className="flex items-center justify-center h-11 w-11 shrink-0 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <Plus size={18} />
          </Link>
        </div>
      </div>

      <ProductsTable products={filtered} onDelete={handleDelete} emptyMessage="ไม่พบสินค้าที่ค้นหา" />
    </>
  );
}
