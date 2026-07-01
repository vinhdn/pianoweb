"use client";

import { useState } from "react";
import { ShoppingCart, Scale, Share2, Phone, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart-context";
import { useCompare } from "@/store/compare-context";
import type { Product } from "@/types";

interface Props {
  product: Product;
}

export function ProductActions({ product }: Props) {
  const { addItem } = useCart();
  const { add: addCompare, remove: removeCompare, isComparing } = useCompare();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const comparing = isComparing(product.id);

  const handleAddToCart = () => {
    setAdding(true);
    addItem(product, quantity);
    setTimeout(() => setAdding(false), 600);
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
    <div className="space-y-4">
      {/* Quantity */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Số lượng:</span>
        <div className="flex items-center border border-gray-200 rounded-lg">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 rounded-l-lg transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-12 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 rounded-r-lg transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Add to cart */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          loading={adding}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="w-4 h-4" />
          {product.stock === 0 ? "Hết Hàng" : "Thêm Vào Giỏ Hàng"}
        </Button>

        <Button
          size="lg"
          variant={comparing ? "default" : "outline"}
          onClick={() => comparing ? removeCompare(product.id) : addCompare(product)}
          title={comparing ? "Bỏ so sánh" : "So sánh"}
        >
          <Scale className="w-4 h-4" />
        </Button>

        <Button size="lg" variant="outline" onClick={handleShare} title="Chia sẻ">
          <Share2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Contact */}
      <a
        href="tel:0909123456"
        className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-[#c9a84c] text-[#c9a84c] rounded-xl text-sm font-medium hover:bg-[#c9a84c]/5 transition-colors"
      >
        <Phone className="w-4 h-4" />
        Gọi Tư Vấn: 0909 123 456
      </a>
    </div>
  );
}
