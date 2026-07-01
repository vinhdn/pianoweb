import { auth } from "@/lib/auth";
import { api } from "@/lib/api";
import type { Category } from "@/lib/api";
import { ProductForm } from "@/components/admin/product-form";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  let product;
  try {
    product = await api.getProduct(id);
  } catch {
    notFound();
  }

  let categories: Category[] = [];
  try {
    categories = await api.getAllCategories(session!.accessToken);
  } catch {}

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sửa sản phẩm: {product.name}</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
