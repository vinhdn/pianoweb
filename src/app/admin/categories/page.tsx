import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } }, parent: { select: { name: true } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">Quản Lý Danh Mục</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} danh mục</p>
        </div>
        <Link href="/admin/categories/new">
          <Button><Plus className="w-4 h-4" />Thêm Danh Mục</Button>
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <FolderOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có danh mục nào</p>
          <Link href="/admin/categories/new" className="mt-4 inline-block">
            <Button size="sm">Thêm Danh Mục Đầu Tiên</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Danh Mục</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Danh Mục Cha</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Sản Phẩm</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Thứ Tự</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 text-sm">{c.name}</p>
                    <p className="text-xs text-gray-400">/danh-muc/{c.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.parent?.name || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c._count.products}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/categories/${c.id}`}>
                        <Button variant="ghost" size="icon"><Edit className="w-3.5 h-3.5" /></Button>
                      </Link>
                      <DeleteCategoryButton id={c.id} name={c.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
