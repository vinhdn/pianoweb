import { auth } from "@/lib/auth";
import { api } from "@/lib/api";
import type { Category } from "@/lib/api";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const session = await auth();
  let categories: Category[] = [];
  try {
    categories = await api.getAllCategories(session!.accessToken);
  } catch {}

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Danh mục</h1>
        <Link
          href="/admin/danh-muc/tao-moi"
          className="bg-[#1a1a2e] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#16213e] transition-colors"
        >
          + Thêm danh mục
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium text-gray-600">Tên danh mục</th>
              <th className="text-left p-4 font-medium text-gray-600">Danh mục cha</th>
              <th className="text-left p-4 font-medium text-gray-600">Sản phẩm</th>
              <th className="text-left p-4 font-medium text-gray-600">Thứ tự</th>
              <th className="text-left p-4 font-medium text-gray-600">Trạng thái</th>
              <th className="text-left p-4 font-medium text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-gray-400">/danh-muc/{c.slug}</div>
                </td>
                <td className="p-4 text-gray-500">{c.parent?.name || "—"}</td>
                <td className="p-4">{c._count?.products ?? 0}</td>
                <td className="p-4">{c.sortOrder}</td>
                <td className="p-4">
                  <Badge variant={c.published ? "success" : "warning"}>
                    {c.published ? "Hiển thị" : "Ẩn"}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <Link href={`/admin/danh-muc/${c.id}/sua`} className="text-[#c8a96e] hover:underline text-xs">
                      Sửa
                    </Link>
                    <DeleteCategoryButton id={c.id} name={c.name} token={session!.accessToken} />
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">Chưa có danh mục nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeleteCategoryButton({ id, name, token }: { id: string; name: string; token: string }) {
  return (
    <form
      action={async () => {
        "use server";
        try { await api.deleteCategory(id, token); } catch {}
      }}
    >
      <button
        type="submit"
        onClick={(e) => { if (!confirm(`Xóa danh mục "${name}"?`)) e.preventDefault(); }}
        className="text-red-500 hover:underline text-xs"
      >
        Xóa
      </button>
    </form>
  );
}
