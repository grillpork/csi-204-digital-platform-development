import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { requireUserPage } from "@/lib/auth/dal";
import { prisma } from "@/lib/db/prisma";
import DeleteButton from "./_components/DeleteButton";

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
      {category}
    </span>
  );
}

export default async function SellerProductsPage() {
  const user = await requireUserPage();
  const products = await prisma.product.findMany({
    where: { sellerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">สินค้าของฉัน</h1>
        <Link
          href="/seller/products/new"
          className="flex items-center gap-2 bg-black text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          เพิ่มสินค้า
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="border border-gray-200 rounded-2xl p-10 text-center">
          <p className="text-gray-500 mb-4">ยังไม่มีสินค้า</p>
          <Link
            href="/seller/products/new"
            className="text-black font-medium hover:underline"
          >
            เพิ่มสินค้าชิ้นแรก
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3 font-semibold">รูป</th>
                <th className="px-5 py-3 font-semibold">ชื่อ</th>
                <th className="px-5 py-3 font-semibold">หมวด</th>
                <th className="px-5 py-3 font-semibold">ราคา</th>
                <th className="px-5 py-3 font-semibold">สต็อก</th>
                <th className="px-5 py-3 text-right font-semibold">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
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
                    <CategoryChip category={CATEGORY_LABELS[product.category] ?? product.category} />
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
                      <DeleteButton id={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
