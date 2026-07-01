import { auth } from "@/lib/auth";
import { api } from "@/lib/api";
import type { Category } from "@/lib/api";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const session = await auth();
  let categories: Category[] = [];
  try {
    categories = await api.getAllCategories(session!.accessToken);
  } catch {}

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Thêm sản phẩm mới</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
