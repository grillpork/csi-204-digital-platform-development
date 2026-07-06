"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function Favorites() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((j) => setItems(j.data || []))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id }),
    });
    load();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">สินค้าที่ถูกใจ</h1>
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-500">
          <span className="animate-pulse">กำลังโหลด…</span>
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 p-20 text-center text-slate-500">
          ยังไม่มีสินค้าที่ถูกใจ
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <article key={p.id} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all hover:shadow-md">
              <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
                <Link href={`/product/${p.id}`}>
                  <img
                    src={p.images?.[0] || "/placeholder.png"}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <button
                  onClick={() => remove(p.id)}
                  className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white text-red-500 hover:scale-110 active:scale-95 transition-all"
                  title="นำออกจากรายการโปรด"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-slate-800 line-clamp-1 group-hover:text-black transition-colors">
                  {p.name}
                </h2>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  ฿{p.price.toLocaleString("th-TH")}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
