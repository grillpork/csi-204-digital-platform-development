import { notFound } from "next/navigation";
import { requireUserPage } from "@/lib/auth/dal";
import { prisma } from "@/lib/db/prisma";
import ProductForm from "../../_components/ProductForm";

export default async function EditProductPage({ params }) {
  const user = await requireUserPage();
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: { id: Number(id), sellerId: user.id },
  });
  if (!product) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">แก้ไขสินค้า</h1>
      <ProductForm mode="edit" productId={id} initial={product} />
    </div>
  );
}
