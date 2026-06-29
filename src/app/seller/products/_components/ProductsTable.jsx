"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import Pagination from "@/components/ui/Pagination";

const PAGE_SIZE = 10;

const CATEGORY_LABELS = {
  TSHIRT: "T-Shirt",
  POLO: "Polo",
  HOODIE: "Hoodie",
  LONG_SLEEVE: "Long Sleeve",
  TANK_TOP: "Tank Top",
};

const LOW_STOCK = 5;

function StockBadge({ stock }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
        หมด
      </span>
    );
  }
  if (stock <= LOW_STOCK) {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
        เหลือน้อย ({stock})
      </span>
    );
  }
  return <span className="text-sm text-gray-600">{stock}</span>;
}

function CategoryChip({ category }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
      {CATEGORY_LABELS[category] ?? category}
    </span>
  );
}

export default function ProductsTable({ products, onDelete, emptyMessage = "ไม่พบสินค้า" }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const paged = useMemo(
    () => products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [products, page],
  );

  const handleDelete = (id) => {
    if (!confirm("ลบสินค้านี้?")) return;
    onDelete(id);
  };

  if (products.length === 0) {
    return (
      <div className="border border-gray-200 rounded-2xl p-10 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-500 bg-black text-xs font-semibold uppercase tracking-wide text-white">
            <th className="px-5 py-3 font-semibold">รูป</th>
            <th className="px-5 py-3 font-semibold">ชื่อ</th>
            <th className="px-5 py-3 font-semibold">หมวด</th>
            <th className="px-5 py-3 font-semibold">ราคา</th>
            <th className="px-5 py-3 font-semibold">สต็อก</th>
            <th className="px-5 py-3 text-right font-semibold">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {paged.map((product) => (
            <tr key={product.id} className="transition-colors hover:bg-gray-50">
              <td className="px-5 py-3">
                <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                  {product.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </td>
              <td className="px-5 py-3 font-medium text-gray-800">{product.name}</td>
              <td className="px-5 py-3">
                <CategoryChip category={product.category} />
              </td>
              <td className="px-5 py-3 font-medium text-gray-800">฿{product.price}</td>
              <td className="px-5 py-3">
                <StockBadge stock={product.stock} />
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-1.5">
                  <Link
                    href={`/seller/products/${product.id}/edit`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-black hover:text-black"
                    aria-label="แก้ไข"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex items-center gap-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 text-gray-600 hover:border-red-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                    ลบ
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
}
