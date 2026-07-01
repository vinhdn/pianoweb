"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { useCompare } from "@/contexts/compare-context";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/api";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { add, remove, has } = useCompare();
  const inCompare = has(product.id);

  const displayPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice !== null && product.salePrice < product.price;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
      <Link href={`/san-pham/${product.slug}`} className="block relative aspect-square bg-gray-50">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
        )}
        {product.featured && (
          <div className="absolute top-2 left-2">
            <Badge variant="accent">Nổi bật</Badge>
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-2 right-2">
            <Badge variant="danger">
              -{Math.round(((product.price - product.salePrice!) / product.price) * 100)}%
            </Badge>
          </div>
        )}
      </Link>

      <div className="p-4">
        {product.category && (
          <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
        )}
        <Link href={`/san-pham/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-[#1a1a2e] text-sm leading-snug mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-[#c8a96e] font-bold">{formatPrice(displayPrice)}</span>
          {hasDiscount && (
            <span className="text-gray-400 text-xs line-through">{formatPrice(product.price)}</span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => addItem(product)}
            className="flex-1 bg-[#1a1a2e] text-white text-xs py-2 px-3 rounded-lg hover:bg-[#16213e] transition-colors"
          >
            Thêm vào giỏ
          </button>
          <button
            onClick={() => inCompare ? remove(product.id) : add(product)}
            className={`px-3 py-2 rounded-lg border text-xs transition-colors ${
              inCompare
                ? "bg-[#c8a96e] text-white border-[#c8a96e]"
                : "border-gray-300 text-gray-600 hover:border-[#c8a96e]"
            }`}
            title={inCompare ? "Bỏ so sánh" : "So sánh"}
          >
            So sánh
          </button>
        </div>
      </div>
    </div>
  );
}
