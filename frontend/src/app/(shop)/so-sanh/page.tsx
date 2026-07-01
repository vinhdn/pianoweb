"use client";

import Image from "next/image";
import Link from "next/link";
import { useCompare } from "@/contexts/compare-context";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ComparePage() {
  const { items, remove, clear } = useCompare();
  const { addItem } = useCart();

  if (!items.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h1 className="text-2xl font-bold mb-2">Chưa có sản phẩm để so sánh</h1>
        <p className="text-gray-500 mb-6">Thêm tối đa 3 sản phẩm để so sánh.</p>
        <Link href="/san-pham"><Button>Chọn sản phẩm</Button></Link>
      </div>
    );
  }

  const allSpecKeys = Array.from(
    new Set(items.flatMap((p) => Object.keys(p.specs || {})))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">So sánh sản phẩm</h1>
        <button onClick={clear} className="text-sm text-red-500 hover:underline">
          Xóa tất cả
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-40 p-3 text-left bg-gray-50 border border-gray-200">Sản phẩm</th>
              {items.map((p) => (
                <th key={p.id} className="p-3 border border-gray-200 align-top">
                  <div className="space-y-2">
                    <div className="relative w-32 h-32 mx-auto">
                      {p.thumbnail ? (
                        <Image src={p.thumbnail} alt={p.name} fill className="object-contain" sizes="128px" />
                      ) : (
                        <div className="w-32 h-32 bg-gray-100 rounded" />
                      )}
                    </div>
                    <Link href={`/san-pham/${p.slug}`} className="font-semibold hover:text-[#c8a96e] line-clamp-2 block">
                      {p.name}
                    </Link>
                    <button
                      onClick={() => remove(p.id)}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Bỏ
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 font-medium bg-gray-50 border border-gray-200">Giá</td>
              {items.map((p) => (
                <td key={p.id} className="p-3 border border-gray-200 text-center">
                  <div className="text-[#c8a96e] font-bold">
                    {formatPrice(p.salePrice ?? p.price)}
                  </div>
                  {p.salePrice && (
                    <div className="text-gray-400 line-through text-xs">{formatPrice(p.price)}</div>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-medium bg-gray-50 border border-gray-200">Thương hiệu</td>
              {items.map((p) => (
                <td key={p.id} className="p-3 border border-gray-200 text-center">{p.brand || "—"}</td>
              ))}
            </tr>
            <tr>
              <td className="p-3 font-medium bg-gray-50 border border-gray-200">Danh mục</td>
              {items.map((p) => (
                <td key={p.id} className="p-3 border border-gray-200 text-center">{p.category?.name || "—"}</td>
              ))}
            </tr>
            {allSpecKeys.map((key) => (
              <tr key={key}>
                <td className="p-3 font-medium bg-gray-50 border border-gray-200">{key}</td>
                {items.map((p) => (
                  <td key={p.id} className="p-3 border border-gray-200 text-center">
                    {(p.specs as Record<string, string>)?.[key] || "—"}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-3 bg-gray-50 border border-gray-200" />
              {items.map((p) => (
                <td key={p.id} className="p-3 border border-gray-200 text-center">
                  <Button size="sm" onClick={() => addItem(p)}>
                    Thêm vào giỏ
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
