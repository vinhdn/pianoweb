import { auth } from "@/lib/auth";
import { api } from "@/lib/api";
import type { Product } from "@/lib/api";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await auth();
  let products: Product[] = [];
  try {
    products = await api.getAllProducts(session!.accessToken);
  } catch {}

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sản phẩm</h1>
        <Link
          href="/admin/san-pham/tao-moi"
          className="bg-[#1a1a2e] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#16213e] transition-colors"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Tên sản phẩm</th>
                <th className="text-left p-4 font-medium text-gray-600">Danh mục</th>
                <th className="text-left p-4 font-medium text-gray-600">Giá</th>
                <th className="text-left p-4 font-medium text-gray-600">Kho</th>
                <th className="text-left p-4 font-medium text-gray-600">Trạng thái</th>
                <th className="text-left p-4 font-medium text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium line-clamp-1">{p.name}</div>
                    {p.sku && <div className="text-xs text-gray-400">SKU: {p.sku}</div>}
                  </td>
                  <td className="p-4 text-gray-500">{p.category?.name || "—"}</td>
                  <td className="p-4">
                    <div className="text-[#c8a96e] font-medium">{formatPrice(p.salePrice ?? p.price)}</div>
                    {p.salePrice && (
                      <div className="text-xs text-gray-400 line-through">{formatPrice(p.price)}</div>
                    )}
                  </td>
                  <td className="p-4">{p.stock}</td>
                  <td className="p-4">
                    <Badge variant={p.published ? "success" : "warning"}>
                      {p.published ? "Hiển thị" : "Ẩn"}
                    </Badge>
                    {p.featured && <Badge variant="accent" className="ml-1">Nổi bật</Badge>}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <Link
                        href={`/san-pham/${p.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Xem
                      </Link>
                      <Link
                        href={`/admin/san-pham/${p.id}/sua`}
                        className="text-[#c8a96e] hover:underline text-xs"
                      >
                        Sửa
                      </Link>
                      <DeleteProductButton id={p.id} name={p.name} token={session!.accessToken} />
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Chưa có sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DeleteProductButton({ id, name, token }: { id: string; name: string; token: string }) {
  return (
    <form
      action={async () => {
        "use server";
        try {
          await api.deleteProduct(id, token);
        } catch {}
      }}
    >
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm(`Xóa sản phẩm "${name}"?`)) e.preventDefault();
        }}
        className="text-red-500 hover:underline text-xs"
      >
        Xóa
      </button>
    </form>
  );
}
