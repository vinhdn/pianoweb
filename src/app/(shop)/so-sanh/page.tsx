"use client";

import { useCompare } from "@/store/compare-context";
import { useCart } from "@/store/cart-context";
import { Button } from "@/components/ui/button";
import { formatPrice, getImageUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart, Scale } from "lucide-react";

const SPECS_KEYS = ["brand", "sku", "stock", "price", "salePrice", "category"];

export default function ComparePage() {
  const { items, remove, clear } = useCompare();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <Scale className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#1a3a5c] mb-2">Chưa Có Sản Phẩm So Sánh</h1>
        <p className="text-gray-500 mb-8">Hãy thêm sản phẩm để so sánh</p>
        <Link href="/san-pham">
          <Button>Xem Sản Phẩm</Button>
        </Link>
      </div>
    );
  }

  // Collect all spec keys from all products
  const allSpecKeys = Array.from(
    new Set(items.flatMap((p) => Object.keys((p.specs as Record<string, string>) || {})))
  );

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#1a3a5c]">So Sánh Sản Phẩm</h1>
        <button onClick={clear} className="text-sm text-red-500 hover:text-red-700">
          Xóa tất cả
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              <td className="w-36 p-3 text-sm font-semibold text-gray-500 bg-gray-50 rounded-tl-xl">Sản Phẩm</td>
              {items.map((p) => (
                <td key={p.id} className="p-3 bg-gray-50 text-center">
                  <div className="relative">
                    <button
                      onClick={() => remove(p.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="relative w-24 h-24 mx-auto mb-2 bg-white rounded-lg overflow-hidden">
                      <Image
                        src={getImageUrl(p.thumbnail || p.images[0])}
                        alt={p.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <Link href={`/san-pham/${p.slug}`} className="text-sm font-medium text-[#1a3a5c] hover:underline line-clamp-2">
                      {p.name}
                    </Link>
                  </div>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price */}
            <tr className="border-t">
              <td className="p-3 text-sm font-medium text-gray-700 bg-gray-50">Giá</td>
              {items.map((p) => (
                <td key={p.id} className="p-3 text-center">
                  <p className="font-bold text-[#1a3a5c]">{formatPrice(p.salePrice ?? p.price)}</p>
                  {p.salePrice && <p className="text-xs text-gray-400 line-through">{formatPrice(p.price)}</p>}
                </td>
              ))}
            </tr>
            {/* Brand */}
            <tr className="border-t bg-gray-50/50">
              <td className="p-3 text-sm font-medium text-gray-700 bg-gray-50">Thương Hiệu</td>
              {items.map((p) => (
                <td key={p.id} className="p-3 text-center text-sm">{p.brand || "—"}</td>
              ))}
            </tr>
            {/* Stock */}
            <tr className="border-t">
              <td className="p-3 text-sm font-medium text-gray-700 bg-gray-50">Tình Trạng</td>
              {items.map((p) => (
                <td key={p.id} className="p-3 text-center">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {p.stock > 0 ? "Còn hàng" : "Hết hàng"}
                  </span>
                </td>
              ))}
            </tr>
            {/* Spec rows */}
            {allSpecKeys.map((key, i) => (
              <tr key={key} className={`border-t ${i % 2 === 0 ? "bg-gray-50/50" : ""}`}>
                <td className="p-3 text-sm font-medium text-gray-700 bg-gray-50">{key}</td>
                {items.map((p) => (
                  <td key={p.id} className="p-3 text-center text-sm text-gray-600">
                    {((p.specs as Record<string, string>) || {})[key] || "—"}
                  </td>
                ))}
              </tr>
            ))}
            {/* Add to cart row */}
            <tr className="border-t">
              <td className="p-3 bg-gray-50" />
              {items.map((p) => (
                <td key={p.id} className="p-3 text-center">
                  <Button
                    size="sm"
                    onClick={() => addItem(p)}
                    disabled={p.stock === 0}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Thêm Vào Giỏ
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
