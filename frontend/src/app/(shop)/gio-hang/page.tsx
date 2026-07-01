"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, total, updateItem, removeItem, clearCart } = useCart();

  if (!items.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold mb-2">Giỏ hàng trống</h1>
        <p className="text-gray-500 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
        <Link href="/san-pham">
          <Button>Tiếp tục mua hàng</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng ({items.length} sản phẩm)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4">
              <Link href={`/san-pham/${product.slug}`} className="relative w-24 h-24 flex-shrink-0">
                {product.thumbnail ? (
                  <Image src={product.thumbnail} alt={product.name} fill className="object-cover rounded-lg" sizes="96px" />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-lg" />
                )}
              </Link>

              <div className="flex-1">
                <Link href={`/san-pham/${product.slug}`} className="font-semibold hover:text-[#c8a96e] line-clamp-2">
                  {product.name}
                </Link>
                {product.brand && <p className="text-sm text-gray-500">{product.brand}</p>}
                <p className="text-[#c8a96e] font-bold mt-1">
                  {formatPrice(product.salePrice ?? product.price)}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => quantity > 1 ? updateItem(product.id, quantity - 1) : removeItem(product.id)}
                      className="px-3 py-1 hover:bg-gray-100 text-sm"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 text-sm min-w-[2.5rem] text-center">{quantity}</span>
                    <button
                      onClick={() => updateItem(product.id, quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100 text-sm"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              </div>

              <div className="text-right font-bold text-[#1a1a2e]">
                {formatPrice((product.salePrice ?? product.price) * quantity)}
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:underline"
          >
            Xóa toàn bộ giỏ hàng
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 h-fit space-y-4">
          <h2 className="font-bold text-lg">Tóm tắt đơn hàng</h2>

          <div className="flex justify-between text-sm">
            <span>Tạm tính</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Vận chuyển</span>
            <span className="text-green-600">Miễn phí</span>
          </div>

          <div className="border-t pt-3 flex justify-between font-bold text-lg">
            <span>Tổng cộng</span>
            <span className="text-[#c8a96e]">{formatPrice(total)}</span>
          </div>

          <Button size="lg" className="w-full">
            Liên hệ đặt hàng
          </Button>

          <a
            href="tel:0901234567"
            className="block text-center text-sm text-gray-500 hover:text-[#c8a96e]"
          >
            Hoặc gọi: 090 123 4567
          </a>
        </div>
      </div>
    </div>
  );
}
