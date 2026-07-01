import Link from "next/link";
import { requireUserPage } from "@/lib/auth/dal";
import { prisma } from "@/lib/db/prisma";
import ProductsCommandBar from "./_components/ProductsCommandBar";

export default async function SellerProductsPage() {
  const user = await requireUserPage();
  const products = await prisma.product.findMany({
    where: { sellerId: user.id, is_custom: false },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {products.length === 0 ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">สินค้าของฉัน</h1>
            <Link
              href="/seller/products/new"
              className="flex items-center gap-2 bg-black text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              เพิ่มสินค้า
            </Link>
          </div>
          <div className="border border-gray-200 rounded-2xl p-10 text-center">
            <p className="text-gray-500 mb-4">ยังไม่มีสินค้า</p>
            <Link
              href="/seller/products/new"
              className="text-black font-medium hover:underline"
            >
              เพิ่มสินค้าชิ้นแรก
            </Link>
          </div>
        </>
      ) : (
        <ProductsCommandBar products={products} />
      )}
    </div>
  );
}
