import { api } from "@/lib/api";
import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { ProductActions } from "@/components/product/product-actions";
import { ProductGrid } from "@/components/product/product-grid";
import { CommentSection } from "@/components/product/comment-section";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await api.getProduct(slug);
    return {
      title: product.metaTitle || product.name,
      description: product.metaDesc || product.shortDesc || product.description.slice(0, 160),
      keywords: product.metaKeywords?.split(",").map((k) => k.trim()),
      openGraph: {
        title: product.name,
        description: product.shortDesc || product.description.slice(0, 160),
        images: product.thumbnail ? [product.thumbnail] : [],
        type: "website",
      },
    };
  } catch {
    return { title: "Sản phẩm" };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product;
  try {
    product = await api.getProduct(slug);
  } catch {
    notFound();
  }

  const related = await api.getRelatedProducts(product.id).catch(() => []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc || product.description.slice(0, 200),
    image: product.images,
    sku: product.sku,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    offers: {
      "@type": "Offer",
      price: product.salePrice ?? product.price,
      priceCurrency: "VND",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/san-pham/${product.slug}`),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex gap-2">
          <a href="/" className="hover:text-[#c8a96e]">Trang chủ</a>
          <span>/</span>
          {product.category && (
            <>
              <a href={`/danh-muc/${product.category.slug}`} className="hover:text-[#c8a96e]">
                {product.category.name}
              </a>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900 line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <ProductImageGallery images={product.images} name={product.name} />

          <div className="space-y-6">
            <div>
              {product.category && (
                <Badge className="mb-2">{product.category.name}</Badge>
              )}
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{product.name}</h1>
              {product.brand && (
                <p className="text-sm text-gray-500">Thương hiệu: <strong>{product.brand}</strong></p>
              )}
              {product.sku && (
                <p className="text-sm text-gray-500">Mã SP: <strong>{product.sku}</strong></p>
              )}
            </div>

            <ProductActions product={product} />

            {product.shortDesc && (
              <p className="text-gray-600 leading-relaxed border-t pt-4">{product.shortDesc}</p>
            )}

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Thông số kỹ thuật</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specs).map(([k, v]) => (
                      <tr key={k} className="border-b">
                        <td className="py-2 pr-4 text-gray-500 w-1/3">{k}</td>
                        <td className="py-2 font-medium">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-10 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">Mô tả sản phẩm</h2>
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>

        {/* Comments */}
        <div className="mt-10 border-t pt-8">
          <CommentSection
            productId={product.id}
            initialComments={product.comments || []}
          />
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-10 border-t pt-8">
            <h2 className="text-xl font-bold mb-4">Sản phẩm liên quan</h2>
            <ProductGrid products={related} />
          </div>
        )}
      </div>
    </>
  );
}
