import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/products/product-grid";
import { Search } from "lucide-react";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Tìm kiếm: ${q}` : "Tìm Kiếm",
    description: `Kết quả tìm kiếm cho "${q}" tại Piano Beauty`,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;

  const products = q.trim().length >= 2
    ? await prisma.product.findMany({
        where: {
          published: true,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { brand: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { shortDesc: { contains: q, mode: "insensitive" } },
          ],
        },
        include: { category: true },
        orderBy: { viewCount: "desc" },
        take: 24,
      })
    : [];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a3a5c] mb-2">
          {q ? `Kết quả tìm kiếm cho "${q}"` : "Tìm Kiếm"}
        </h1>
        <p className="text-gray-500 text-sm">
          {products.length > 0 ? `Tìm thấy ${products.length} sản phẩm` : q ? "Không tìm thấy sản phẩm phù hợp" : "Nhập từ khóa để tìm kiếm"}
        </p>
      </div>

      {products.length === 0 && q ? (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy kết quả</h2>
          <p className="text-gray-400">Thử tìm kiếm với từ khóa khác</p>
        </div>
      ) : (
        <ProductGrid products={products as never} />
      )}
    </div>
  );
}
