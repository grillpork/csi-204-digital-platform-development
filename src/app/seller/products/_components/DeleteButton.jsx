"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteButton({ id }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("ลบสินค้านี้?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="flex items-center gap-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 text-gray-600 hover:border-red-400 hover:text-red-500 transition-colors"
    >
      <Trash2 size={14} />
      ลบ
    </button>
  );
}
