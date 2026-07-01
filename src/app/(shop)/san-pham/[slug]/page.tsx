export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductImageGallery } from "@/components/products/product-image-gallery";
import { ProductActions } from "@/components/products/product-actions";
import { CommentSection } from "@/components/comments/comment-section";
import { ProductGrid } from "@/components/products/product-grid";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Package, Shield, Truck, Phone } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import Script from "next/script";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, published: true },
    include: {
      category: true,
      comments: {
        where: { approved: true },
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  const images = product.images.length > 0 ? [product.images[0]] : [];

  return {
    title: product.metaTitle || product.name,
    description: product.metaDesc || product.shortDesc || product.description.slice(0, 160),
    keywords: product.metaKeywords || undefined,
    openGraph: {
      title: product.metaTitle || product.name,
      description: product.metaDesc || product.shortDesc || "",
      images: images.map((img) => ({ url: img, alt: product.name })),
      type: "website",
    },
    alternates: {
      canonical: `/san-pham/${slug}`,
    },
  };
}


export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  // Increment view count
  await prisma.product.update({ where: { id: product.id }, data: { viewCount: { increment: 1 } } });

  // Related products
  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, published: true, id: { not: product.id } },
    include: { category: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const specs = product.specs as Record<string, string> | null;
  const currentPrice = product.salePrice ?? product.price;
  const avgRating = product.comments.length
    ? product.comments.reduce((s, c) => s + c.rating, 0) / product.comments.length
    : 5;

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc || product.description,
    image: product.images,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand || "Piano Beauty" },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_URL}/san-pham/${slug}`,
      priceCurrency: "VND",
      price: currentPrice,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Piano Beauty" },
    },
    aggregateRating: product.comments.length > 0 ? {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: product.comments.length,
    } : undefined,
  };

  return (
    <>
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#1a3a5c]">Trang Chủ</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/san-pham" className="hover:text-[#1a3a5c]">Sản Phẩm</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/danh-muc/${product.category.slug}`} className="hover:text-[#1a3a5c]">
            {product.category.name}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1a3a5c] font-medium line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Gallery */}
          <ProductImageGallery images={product.images} name={product.name} />

          {/* Product info */}
          <div>
            {product.brand && (
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">{product.brand}</p>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a3a5c] mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {product.featured && <Badge variant="secondary">Nổi Bật</Badge>}
              {product.sku && (
                <span className="text-xs text-gray-400">SKU: {product.sku}</span>
              )}
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {product.stock > 0 ? `Còn hàng (${product.stock})` : "Hết hàng"}
              </span>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#1a3a5c]">
                  {formatPrice(currentPrice)}
                </span>
                {product.salePrice && (
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                )}
              </div>
              {product.salePrice && (
                <div className="mt-1 inline-flex items-center gap-1 bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded">
                  Tiết kiệm {formatPrice(product.price - product.salePrice)}
                </div>
              )}
            </div>

            {/* Short desc */}
            {product.shortDesc && (
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.shortDesc}</p>
            )}

            {/* Actions */}
            <ProductActions product={product as never} />

            {/* Benefits */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { icon: Truck, text: "Miễn phí giao hàng" },
                { icon: Shield, text: "Bảo hành chính hãng" },
                { icon: Package, text: "Đổi trả 7 ngày" },
                { icon: Phone, text: "Tư vấn 24/7" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-gray-600">
                  <Icon className="w-4 h-4 text-[#c9a84c]" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Description, Specs, Reviews */}
        <div className="mb-12">
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-6">
              {["Mô Tả", "Thông Số Kỹ Thuật", `Đánh Giá (${product.comments.length})`].map((tab, i) => (
                <button
                  key={tab}
                  data-tab={i}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                    i === 0
                      ? "border-[#1a3a5c] text-[#1a3a5c]"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed mb-8">
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>

          {/* Specs */}
          {specs && Object.keys(specs).length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#1a3a5c] mb-4">Thông Số Kỹ Thuật</h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(specs).map(([key, value], i) => (
                      <tr key={key} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-4 py-3 font-medium text-gray-700 w-1/3">{key}</td>
                        <td className="px-4 py-3 text-gray-600">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Comments */}
          <CommentSection productId={product.id} initialComments={product.comments as never} />
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-[#1a3a5c] mb-6">Sản Phẩm Liên Quan</h2>
            <ProductGrid products={related as never} />
          </div>
        )}
      </div>
    </>
  );
}
