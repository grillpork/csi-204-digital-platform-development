import { requireUserPage } from "@/lib/auth/dal";
import ProductForm from "../_components/ProductForm";

export default async function NewProductPage() {
  await requireUserPage();

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">เพิ่มสินค้า</h1>
      <ProductForm mode="create" />
    </div>
  );
}
