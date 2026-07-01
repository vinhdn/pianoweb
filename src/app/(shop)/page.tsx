import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Shield, Truck, HeadphonesIcon, Award } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/products/product-grid";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Piano Beauty | Đàn Piano Chính Hãng Tại Việt Nam",
  description:
    "Mua đàn piano acoustic, piano điện, grand piano chính hãng. Yamaha, Kawai, Roland, Casio. Giao hàng toàn quốc, bảo hành chính hãng.",
};

async function getData() {
  const [featuredProducts, categories, newProducts] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true, published: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.category.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    }),
    prisma.product.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);
  return { featuredProducts, categories, newProducts };
}

export default async function HomePage() {
  const { featuredProducts, categories, newProducts } = await getData();

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-[#1a3a5c] to-[#0d1f33] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a84c] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#c9a84c] rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="container relative py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#c9a84c]/20 text-[#c9a84c] px-3 py-1 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              Đại Lý Chính Hãng Yamaha, Kawai, Roland
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Đàn Piano{" "}
              <span className="text-[#c9a84c]">Chính Hãng</span>
              <br />
              Tại Việt Nam
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Khám phá bộ sưu tập đàn piano acoustic, piano điện và grand piano chính hãng từ các thương hiệu hàng đầu thế giới. Giao hàng toàn quốc, bảo hành tận nhà.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/san-pham">
                <Button size="lg" variant="secondary">
                  Xem Tất Cả Sản Phẩm
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/lien-he">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#1a3a5c]">
                  Tư Vấn Miễn Phí
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#c9a84c] py-4">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-sm">
            {[
              { icon: Truck, text: "Miễn Phí Giao Hàng Toàn Quốc" },
              { icon: Shield, text: "Bảo Hành Chính Hãng 12 Tháng" },
              { icon: HeadphonesIcon, text: "Hỗ Trợ 24/7" },
              { icon: Award, text: "Sản Phẩm Chính Hãng 100%" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 justify-center py-1">
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium text-center">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1a3a5c]">Danh Mục Sản Phẩm</h2>
              <p className="text-gray-500 text-sm mt-1">Khám phá các dòng đàn piano đa dạng</p>
            </div>
            <Link href="/san-pham" className="text-sm text-[#1a3a5c] hover:text-[#c9a84c] flex items-center gap-1 transition-colors">
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/danh-muc/${cat.slug}`}
                className="group flex flex-col items-center p-4 bg-white border border-gray-100 rounded-xl hover:border-[#1a3a5c] hover:shadow-md transition-all text-center"
              >
                <div className="w-16 h-16 bg-[#1a3a5c]/5 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#1a3a5c]/10 transition-colors">
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.name} width={40} height={40} className="object-contain" />
                  ) : (
                    <span className="text-2xl">🎹</span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-800 group-hover:text-[#1a3a5c] transition-colors line-clamp-2">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#1a3a5c]">Sản Phẩm Nổi Bật</h2>
                <p className="text-gray-500 text-sm mt-1">Những chiếc đàn piano được yêu thích nhất</p>
              </div>
              <Link href="/san-pham?featured=true" className="text-sm text-[#1a3a5c] hover:text-[#c9a84c] flex items-center gap-1 transition-colors">
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <ProductGrid products={featuredProducts as never} />
          </div>
        </section>
      )}

      {/* Banner middle */}
      <section className="container py-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative bg-gradient-to-br from-[#1a3a5c] to-[#1a3a5c]/80 rounded-2xl p-8 text-white overflow-hidden">
            <div className="absolute right-0 bottom-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/4 translate-y-1/4" />
            <p className="text-[#c9a84c] font-medium text-sm mb-2">Piano Cơ Acoustic</p>
            <h3 className="text-2xl font-bold mb-3">Âm thanh thuần khiết<br />từ thiên nhiên</h3>
            <p className="text-white/70 text-sm mb-6">Trải nghiệm cảm giác chơi đàn thật sự với piano cơ chính hãng</p>
            <Link href="/danh-muc/dan-piano-co">
              <Button variant="secondary" size="sm">Khám Phá Ngay</Button>
            </Link>
          </div>
          <div className="relative bg-gradient-to-br from-[#c9a84c] to-[#a8863b] rounded-2xl p-8 text-white overflow-hidden">
            <div className="absolute right-0 bottom-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/4 translate-y-1/4" />
            <p className="text-white/80 font-medium text-sm mb-2">Piano Điện Digital</p>
            <h3 className="text-2xl font-bold mb-3">Công nghệ hiện đại<br />tiện lợi mọi nơi</h3>
            <p className="text-white/80 text-sm mb-6">Piano điện với âm thanh chất lượng cao, phù hợp mọi không gian</p>
            <Link href="/danh-muc/dan-piano-dien">
              <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-[#c9a84c]">Khám Phá Ngay</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Products */}
      {newProducts.length > 0 && (
        <section className="container py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1a3a5c]">Sản Phẩm Mới Nhất</h2>
              <p className="text-gray-500 text-sm mt-1">Cập nhật liên tục những mẫu đàn mới nhất</p>
            </div>
            <Link href="/san-pham" className="text-sm text-[#1a3a5c] hover:text-[#c9a84c] flex items-center gap-1 transition-colors">
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={newProducts as never} />
        </section>
      )}

      {/* Empty state when no products */}
      {featuredProducts.length === 0 && newProducts.length === 0 && (
        <section className="container py-20 text-center">
          <div className="text-6xl mb-4">🎹</div>
          <h2 className="text-2xl font-bold text-[#1a3a5c] mb-2">Đang Cập Nhật Sản Phẩm</h2>
          <p className="text-gray-500 mb-8">Chúng tôi đang chuẩn bị bộ sưu tập đàn piano đặc sắc cho bạn</p>
          <Link href="/lien-he">
            <Button>Liên Hệ Tư Vấn</Button>
          </Link>
        </section>
      )}

      {/* Brands */}
      <section className="bg-gray-50 py-10">
        <div className="container">
          <h2 className="text-center text-lg font-semibold text-gray-500 mb-6">Thương Hiệu Chính Hãng</h2>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {["YAMAHA", "KAWAI", "ROLAND", "CASIO", "STEINWAY", "BÖSENDORFER"].map((brand) => (
              <span
                key={brand}
                className="text-xl font-bold text-gray-300 hover:text-[#1a3a5c] transition-colors cursor-default tracking-wider"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
