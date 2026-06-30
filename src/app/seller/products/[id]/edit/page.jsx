import { notFound } from "next/navigation";
import { requireUserPage } from "@/lib/auth/dal";
import { prisma } from "@/lib/db/prisma";
import EditProductWithLivePanel from "../../_components/EditProductWithLivePanel";

export default async function EditProductPage({ params }) {
  const user = await requireUserPage();
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: { id: Number(id), sellerId: user.id },
  });
  if (!product) notFound();

  const products = await prisma.product.findMany({
    where: { sellerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-10">
      <EditProductWithLivePanel productId={id} initial={product} initialProducts={products} />
    </div>
  );
}
