import { auth } from "@/lib/auth";
import { api } from "@/lib/api";
import type { Category } from "@/lib/api";
import { CategoryForm } from "@/components/admin/category-form";

export default async function NewCategoryPage() {
  const session = await auth();
  let categories: Category[] = [];
  try {
    categories = await api.getAllCategories(session!.accessToken);
  } catch {}

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Thêm danh mục mới</h1>
      <CategoryForm categories={categories} />
    </div>
  );
}
