import { api } from "@/lib/api";
import { ProductGrid } from "@/components/product/product-grid";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await api.getCategory(slug);
    return {
      title: category.metaTitle || category.name,
      description: category.metaDesc || category.description || `Khám phá các sản phẩm ${category.name} tại Piano Beauty`,
    };
  } catch {
    return { title: "Danh mục" };
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = sp.page || "1";
  const sort = sp.sort || "newest";

  let category;
  try {
    category = await api.getCategory(slug);
  } catch {
    notFound();
  }

  let result: { data: import("@/lib/api").Product[]; total: number; totalPages: number } = { data: [], total: 0, totalPages: 0 };
  try {
    result = await api.getProducts({ category: category.id, page, sort });
  } catch {}

  const currentPage = parseInt(page);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex gap-2">
        <a href="/" className="hover:text-[#c8a96e]">Trang chủ</a>
        <span>/</span>
        <span className="text-gray-900">{category.name}</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{category.name}</h1>
          {category.description && (
            <p className="text-gray-500 mt-1 text-sm">{category.description}</p>
          )}
          <p className="text-sm text-gray-400 mt-1">{result.total} sản phẩm</p>
        </div>

        <select
          defaultValue={sort}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
        >
          <option value="newest">Mới nhất</option>
          <option value="popular">Phổ biến nhất</option>
          <option value="price-asc">Giá thấp → cao</option>
          <option value="price-desc">Giá cao → thấp</option>
        </select>
      </div>

      {/* Subcategories */}
      {category.children && category.children.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {category.children.map((child) => (
            <Link
              key={child.id}
              href={`/danh-muc/${child.slug}`}
              className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:border-[#c8a96e] hover:text-[#c8a96e] transition-colors"
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}

      <ProductGrid products={result.data} emptyMessage="Danh mục này chưa có sản phẩm." />

      {result.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => {
            const href = `/danh-muc/${slug}?page=${p}&sort=${sort}`;
            return (
              <Link
                key={p}
                href={href}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm transition-colors ${
                  p === currentPage
                    ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                    : "border-gray-300 hover:border-[#c8a96e]"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
