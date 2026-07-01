"use client";

import { useCart } from "@/store/cart-context";
import { Button } from "@/components/ui/button";
import { formatPrice, getImageUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ChevronRight } from "lucide-react";

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#1a3a5c] mb-2">Giỏ Hàng Trống</h1>
        <p className="text-gray-500 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
        <Link href="/san-pham">
          <Button>Tiếp Tục Mua Sắm</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#1a3a5c]">Trang Chủ</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#1a3a5c] font-medium">Giỏ Hàng</span>
      </nav>

      <h1 className="text-2xl font-bold text-[#1a3a5c] mb-8">Giỏ Hàng ({items.length} sản phẩm)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4">
              <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                <Image
                  src={getImageUrl(item.product.thumbnail || item.product.images[0])}
                  alt={item.product.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex-1">
                <Link href={`/san-pham/${item.product.slug}`} className="font-medium text-sm text-gray-900 hover:text-[#1a3a5c] line-clamp-2">
                  {item.product.name}
                </Link>
                {item.product.brand && <p className="text-xs text-gray-400 mt-0.5">{item.product.brand}</p>}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 rounded-l-lg"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 rounded-r-lg"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#1a3a5c] text-sm">
                      {formatPrice((item.product.salePrice ?? item.product.price) * item.quantity)}
                    </p>
                    {item.product.salePrice && (
                      <p className="text-xs text-gray-400 line-through">{formatPrice(item.product.price * item.quantity)}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
              <Trash2 className="w-3.5 h-3.5" />
              Xóa tất cả
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 h-fit sticky top-24">
          <h2 className="font-semibold text-lg mb-4">Tóm Tắt Đơn Hàng</h2>
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển</span>
              <span className="text-green-600 font-medium">Miễn phí</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Tổng cộng</span>
              <span className="text-[#1a3a5c]">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <Button className="w-full" size="lg">
            Liên Hệ Đặt Hàng
          </Button>
          <a
            href="tel:0909123456"
            className="block text-center mt-3 text-sm text-[#1a3a5c] hover:text-[#c9a84c] transition-colors"
          >
            Hoặc gọi: 0909 123 456
          </a>

          <div className="mt-4 pt-4 border-t">
            <Link href="/san-pham" className="text-sm text-gray-500 hover:text-[#1a3a5c] flex items-center gap-1 transition-colors">
              ← Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
