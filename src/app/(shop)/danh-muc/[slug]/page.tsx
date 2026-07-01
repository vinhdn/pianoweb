export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/products/product-grid";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

async function getCategory(slug: string) {
  return prisma.category.findUnique({
    where: { slug, published: true },
    include: { children: { where: { published: true } } },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};
  return {
    title: category.metaTitle || category.name,
    description: category.metaDesc || category.description || `Mua ${category.name} chính hãng tại Piano Beauty`,
    openGraph: {
      title: category.metaTitle || category.name,
      description: category.metaDesc || category.description || "",
      images: category.image ? [category.image] : [],
    },
  };
}


const SORT_OPTIONS = [
  { value: "newest", label: "Mới Nhất" },
  { value: "price-asc", label: "Giá Tăng Dần" },
  { value: "price-desc", label: "Giá Giảm Dần" },
  { value: "popular", label: "Phổ Biến" },
];

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page = "1", sort = "newest" } = await searchParams;

  const category = await getCategory(slug);
  if (!category) notFound();

  const currentPage = Math.max(1, parseInt(page));
  const limit = 12;
  const skip = (currentPage - 1) * limit;

  const orderBy =
    sort === "price-asc" ? { price: "asc" as const } :
    sort === "price-desc" ? { price: "desc" as const } :
    sort === "popular" ? { viewCount: "desc" as const } :
    { createdAt: "desc" as const };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { categoryId: category.id, published: true },
      include: { category: true },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where: { categoryId: category.id, published: true } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#1a3a5c]">Trang Chủ</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/san-pham" className="hover:text-[#1a3a5c]">Sản Phẩm</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#1a3a5c] font-medium">{category.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <h3 className="font-semibold text-[#1a3a5c] mb-3">Danh Mục</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/san-pham"
                  className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-[#1a3a5c]/5 hover:text-[#1a3a5c] transition-colors"
                >
                  Tất Cả Sản Phẩm
                </Link>
              </li>
            </ul>
          </div>

          {category.children.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-xl p-4 mt-4">
              <h3 className="font-semibold text-[#1a3a5c] mb-3">Danh Mục Con</h3>
              <ul className="space-y-1">
                {category.children.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={`/danh-muc/${child.slug}`}
                      className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-[#1a3a5c]/5 hover:text-[#1a3a5c] transition-colors"
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#1a3a5c]">{category.name}</h1>
              {category.description && (
                <p className="text-gray-500 text-sm mt-1">{category.description}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">{total} sản phẩm</p>
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <select
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#1a3a5c] bg-white"
                defaultValue={sort}
                onChange={(e) => {
                  const url = new URL(window.location.href);
                  url.searchParams.set("sort", e.target.value);
                  url.searchParams.set("page", "1");
                  window.location.href = url.toString();
                }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <ProductGrid products={products as never} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/danh-muc/${slug}?page=${p}&sort=${sort}`}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    p === currentPage
                      ? "bg-[#1a3a5c] text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-[#1a3a5c] hover:text-[#1a3a5c]"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
