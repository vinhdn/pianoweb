import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/products/product-grid";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tất Cả Sản Phẩm",
  description: "Khám phá toàn bộ bộ sưu tập đàn piano chính hãng tại Piano Beauty",
};

interface Props {
  searchParams: Promise<{ page?: string; sort?: string; category?: string; featured?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { page = "1", sort = "newest", category, featured } = await searchParams;
  const currentPage = Math.max(1, parseInt(page));
  const limit = 16;
  const skip = (currentPage - 1) * limit;

  const orderBy =
    sort === "price-asc" ? { price: "asc" as const } :
    sort === "price-desc" ? { price: "desc" as const } :
    { createdAt: "desc" as const };

  const where = {
    published: true,
    ...(category ? { categoryId: category } : {}),
    ...(featured === "true" ? { featured: true } : {}),
  };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true }, orderBy, skip, take: limit }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#1a3a5c]">Trang Chủ</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#1a3a5c] font-medium">Tất Cả Sản Phẩm</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-56 flex-shrink-0">
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <h3 className="font-semibold text-[#1a3a5c] mb-3">Danh Mục</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/san-pham"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-[#1a3a5c] bg-[#1a3a5c]/5"
                >
                  Tất Cả Sản Phẩm ({total})
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/danh-muc/${cat.slug}`}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-[#1a3a5c]/5 hover:text-[#1a3a5c] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[#1a3a5c]">
              {featured === "true" ? "Sản Phẩm Nổi Bật" : "Tất Cả Sản Phẩm"}
            </h1>
            <span className="text-sm text-gray-500">{total} sản phẩm</span>
          </div>

          <ProductGrid products={products as never} />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/san-pham?page=${p}&sort=${sort}`}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    p === currentPage
                      ? "bg-[#1a3a5c] text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-[#1a3a5c]"
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
