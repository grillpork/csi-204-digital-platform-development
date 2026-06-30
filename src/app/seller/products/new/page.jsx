import { requireUserPage } from "@/lib/auth/dal";
import { prisma } from "@/lib/db/prisma";
import CreateProductWithLivePanel from "../_components/CreateProductWithLivePanel";

export default async function NewProductPage() {
  const user = await requireUserPage();
  const products = await prisma.product.findMany({
    where: { sellerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-10">
      <CreateProductWithLivePanel initialProducts={products} />
    </div>
  );
}
