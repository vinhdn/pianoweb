"use client";

import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { useCompare } from "@/contexts/compare-context";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/api";

export function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { add, remove, has } = useCompare();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const inCompare = has(product.id);

  const displayPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice !== null && product.salePrice < product.price;

  const handleAddToCart = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Đã sao chép link!");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-[#c8a96e]">{formatPrice(displayPrice)}</span>
        {hasDiscount && (
          <span className="text-gray-400 text-lg line-through">{formatPrice(product.price)}</span>
        )}
      </div>

      {product.stock > 0 ? (
        <p className="text-green-600 text-sm font-medium">Còn hàng</p>
      ) : (
        <p className="text-red-500 text-sm font-medium">Hết hàng</p>
      )}

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-600">Số lượng:</label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
          >
            −
          </button>
          <span className="px-4 py-2 min-w-[3rem] text-center text-sm font-medium">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          size="lg"
          className="flex-1"
        >
          {added ? "Đã thêm!" : "Thêm vào giỏ hàng"}
        </Button>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          size="md"
          onClick={() => inCompare ? remove(product.id) : add(product)}
        >
          {inCompare ? "Bỏ so sánh" : "So sánh"}
        </Button>
        <Button variant="ghost" size="md" onClick={handleShare}>
          Chia sẻ
        </Button>
      </div>
    </div>
  );
}
