import { api } from "@/lib/api";
import { ProductGrid } from "@/components/product/product-grid";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm",
  description: "Khám phá đầy đủ các sản phẩm đàn piano tại Piano Beauty.",
};

export const dynamic = "force-dynamic";

type SearchParams = {
  page?: string;
  q?: string;
  sort?: string;
  featured?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = params.page || "1";
  const q = params.q;
  const sort = params.sort || "newest";
  const featured = params.featured;

  let result: { data: import("@/lib/api").Product[]; total: number; totalPages: number; page: number } = { data: [], total: 0, totalPages: 0, page: 1 };
  try {
    result = await api.getProducts({
      page,
      ...(q ? { q } : {}),
      ...(sort ? { sort } : {}),
      ...(featured ? { featured } : {}),
    });
  } catch {}

  const currentPage = parseInt(page);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {q ? `Kết quả tìm kiếm: "${q}"` : "Tất cả sản phẩm"}
          <span className="text-sm font-normal text-gray-500 ml-2">({result.total} sản phẩm)</span>
        </h1>

        <select
          defaultValue={sort}
          onChange={(e) => {
            const url = new URL(window.location.href);
            url.searchParams.set("sort", e.target.value);
            window.location.href = url.toString();
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
        >
          <option value="newest">Mới nhất</option>
          <option value="popular">Phổ biến nhất</option>
          <option value="price-asc">Giá thấp → cao</option>
          <option value="price-desc">Giá cao → thấp</option>
        </select>
      </div>

      <ProductGrid products={result.data} />

      {result.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => {
            const href = new URLSearchParams({
              ...(q ? { q } : {}),
              sort,
              page: String(p),
            }).toString();
            return (
              <Link
                key={p}
                href={`/san-pham?${href}`}
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
