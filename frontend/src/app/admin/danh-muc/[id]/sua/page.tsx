import { auth } from "@/lib/auth";
import { api } from "@/lib/api";
import type { Category } from "@/lib/api";
import { CategoryForm } from "@/components/admin/category-form";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  let category;
  try {
    category = await api.getCategory(id);
  } catch {
    notFound();
  }

  let categories: Category[] = [];
  try {
    categories = await api.getAllCategories(session!.accessToken);
  } catch {}

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sửa danh mục: {category.name}</h1>
      <CategoryForm category={category} categories={categories} />
    </div>
  );
}
