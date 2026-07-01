import { auth } from "@/lib/auth";
import { api } from "@/lib/api";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await auth();
  let stats = null;
  try {
    stats = await api.getStats(session!.accessToken);
  } catch {}

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Sản phẩm", value: stats?.totalProducts ?? "—", icon: "🎹", href: "/admin/san-pham" },
          { label: "Danh mục", value: stats?.totalCategories ?? "—", icon: "📂", href: "/admin/danh-muc" },
          { label: "Bình luận chờ", value: stats?.pendingComments ?? "—", icon: "⏳", href: "/admin/binh-luan" },
          { label: "Lượt xem", value: stats?.totalViews?.toLocaleString("vi-VN") ?? "—", icon: "👁️", href: "#" },
        ].map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">{card.icon}</div>
            <div className="text-2xl font-bold text-[#1a1a2e]">{card.value}</div>
            <div className="text-sm text-gray-500">{card.label}</div>
          </Link>
        ))}
      </div>

      {stats?.recentProducts && stats.recentProducts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="font-bold">Sản phẩm mới nhất</h2>
            <Link href="/admin/san-pham" className="text-sm text-[#c8a96e] hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-600">Tên sản phẩm</th>
                  <th className="text-left p-4 font-medium text-gray-600">Danh mục</th>
                  <th className="text-left p-4 font-medium text-gray-600">Giá</th>
                  <th className="text-left p-4 font-medium text-gray-600">Lượt xem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <Link href={`/admin/san-pham/${p.id}/sua`} className="font-medium hover:text-[#c8a96e]">
                        {p.name}
                      </Link>
                    </td>
                    <td className="p-4 text-gray-500">{p.category?.name}</td>
                    <td className="p-4 text-[#c8a96e] font-medium">{formatPrice(p.salePrice ?? p.price)}</td>
                    <td className="p-4 text-gray-500">{p.viewCount}</td>
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
