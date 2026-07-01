import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">Quản Lý Sản Phẩm</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} sản phẩm</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="w-4 h-4" />
            Thêm Sản Phẩm
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có sản phẩm nào</p>
          <Link href="/admin/products/new" className="mt-4 inline-block">
            <Button size="sm">Thêm Sản Phẩm Đầu Tiên</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Sản Phẩm</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Danh Mục</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Giá</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Kho</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Trạng Thái</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900 text-sm line-clamp-1">{p.name}</p>
                        {p.brand && <p className="text-xs text-gray-400">{p.brand}</p>}
                        {p.sku && <p className="text-xs text-gray-400">SKU: {p.sku}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.category.name}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-[#1a3a5c]">{formatPrice(p.salePrice ?? p.price)}</p>
                      {p.salePrice && <p className="text-xs text-gray-400 line-through">{formatPrice(p.price)}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${p.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {p.published ? (
                          <Badge variant="success">Hiện</Badge>
                        ) : (
                          <Badge variant="destructive">Ẩn</Badge>
                        )}
                        {p.featured && <Badge variant="secondary">Nổi Bật</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${p.id}`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <DeleteProductButton id={p.id} name={p.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
