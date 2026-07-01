import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { ProductGrid } from "@/components/product/product-grid";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Piano Beauty - Đàn Piano Chất Lượng Cao",
  description:
    "Cửa hàng đàn piano chính hãng: Yamaha, Kawai, Roland, Steinway. Bảo hành uy tín, giao hàng toàn quốc.",
};

export default async function HomePage() {
  const [featuredRes, newRes, categories] = await Promise.allSettled([
    api.getProducts({ featured: "true", limit: "8" }),
    api.getProducts({ limit: "8", sort: "newest" }),
    api.getCategories(),
  ]);

  const featured = featuredRes.status === "fulfilled" ? featuredRes.value.data : [];
  const newest = newRes.status === "fulfilled" ? newRes.value.data : [];
  const cats = categories.status === "fulfilled"
    ? categories.value.filter((c) => !c.parentId)
    : [];
  const allCats = categories.status === "fulfilled" ? categories.value : [];

  return (
    <>
      <Header categories={allCats} />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Đàn Piano <span className="text-[#c8a96e]">Chất Lượng Cao</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Yamaha · Kawai · Roland · Steinway & Sons. Bảo hành chính hãng, giao hàng toàn quốc.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/san-pham"
                className="bg-[#c8a96e] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#b8935a] transition-colors"
              >
                Xem sản phẩm
              </Link>
              <Link
                href="/lien-he"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#1a1a2e] transition-colors"
              >
                Liên hệ tư vấn
              </Link>
            </div>
          </div>
        </section>

        {/* Categories */}
        {cats.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold mb-6">Danh mục sản phẩm</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {cats.map((c) => (
                <Link
                  key={c.id}
                  href={`/danh-muc/${c.slug}`}
                  className="bg-gray-50 rounded-xl border border-gray-200 hover:border-[#c8a96e] transition-colors p-6 text-center"
                >
                  {c.image && (
                    <div className="relative w-16 h-16 mx-auto mb-3">
                      <Image src={c.image} alt={c.name} fill className="object-contain" sizes="64px" />
                    </div>
                  )}
                  <h3 className="font-semibold text-sm">{c.name}</h3>
                  {c._count && (
                    <p className="text-xs text-gray-500 mt-1">{c._count.products} sản phẩm</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {featured.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Sản phẩm nổi bật</h2>
              <Link href="/san-pham?featured=true" className="text-[#c8a96e] text-sm hover:underline">
                Xem tất cả →
              </Link>
            </div>
            <ProductGrid products={featured} />
          </section>
        )}

        {newest.length > 0 && (
          <section className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Sản phẩm mới</h2>
                <Link href="/san-pham" className="text-[#c8a96e] text-sm hover:underline">
                  Xem tất cả →
                </Link>
              </div>
              <ProductGrid products={newest} />
            </div>
          </section>
        )}

        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-center mb-8">Tại sao chọn Piano Beauty?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "🎹", title: "Hàng chính hãng 100%", desc: "Cam kết nguồn gốc xuất xứ rõ ràng từ nhà sản xuất" },
              { icon: "🛡️", title: "Bảo hành dài hạn", desc: "Hỗ trợ bảo hành chính hãng, sửa chữa tận nơi" },
              { icon: "🚚", title: "Giao hàng toàn quốc", desc: "Miễn phí vận chuyển, lắp đặt chuyên nghiệp" },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
