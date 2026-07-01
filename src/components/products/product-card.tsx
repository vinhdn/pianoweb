"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Scale, Share2, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/store/cart-context";
import { useCompare } from "@/store/compare-context";
import { formatPrice, calculateDiscount, getImageUrl } from "@/lib/utils";
import type { Product } from "@/types";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  showCompare?: boolean;
}

export function ProductCard({ product, showCompare = true }: ProductCardProps) {
  const { addItem } = useCart();
  const { add: addCompare, remove: removeCompare, isComparing } = useCompare();
  const [addingToCart, setAddingToCart] = useState(false);
  const comparing = isComparing(product.id);

  const discount = product.salePrice
    ? calculateDiscount(product.price, product.salePrice)
    : 0;

  const handleAddToCart = async () => {
    setAddingToCart(true);
    addItem(product);
    setTimeout(() => setAddingToCart(false), 600);
  };

  const handleCompare = () => {
    if (comparing) removeCompare(product.id);
    else {
      const ok = addCompare(product);
      if (!ok) alert("Chỉ có thể so sánh tối đa 3 sản phẩm");
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/san-pham/${product.slug}`;
    if (navigator.share) {
      await navigator.share({ title: product.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Đã sao chép đường dẫn!");
    }
  };

  return (
    <div className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Link href={`/san-pham/${product.slug}`}>
          <Image
            src={getImageUrl(product.thumbnail || product.images[0])}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <Badge variant="destructive">-{discount}%</Badge>
          )}
          {product.featured && (
            <Badge variant="secondary">Nổi Bật</Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="outline">Hết hàng</Badge>
          )}
        </div>

        {/* Quick actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/san-pham/${product.slug}`}
            className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-[#1a3a5c] hover:text-white transition-colors"
            title="Xem chi tiết"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
          {showCompare && (
            <button
              onClick={handleCompare}
              className={`w-8 h-8 rounded-full shadow flex items-center justify-center transition-colors ${
                comparing ? "bg-[#1a3a5c] text-white" : "bg-white hover:bg-[#1a3a5c] hover:text-white"
              }`}
              title={comparing ? "Bỏ so sánh" : "So sánh"}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleShare}
            className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-[#1a3a5c] hover:text-white transition-colors"
            title="Chia sẻ"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {product.brand && (
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{product.brand}</p>
        )}
        <Link href={`/san-pham/${product.slug}`}>
          <h3 className="font-medium text-gray-900 text-sm leading-snug mb-2 line-clamp-2 hover:text-[#1a3a5c] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating placeholder */}
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-3 h-3 fill-[#c9a84c] text-[#c9a84c]" />
          ))}
          <span className="text-xs text-gray-400 ml-1">(0)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-[#1a3a5c] text-base">
            {formatPrice(product.salePrice ?? product.price)}
          </span>
          {product.salePrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <Button
          size="sm"
          className="w-full"
          onClick={handleAddToCart}
          loading={addingToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {product.stock === 0 ? "Hết Hàng" : "Thêm Vào Giỏ"}
        </Button>
      </div>
    </div>
  );
}
