import { prisma } from "@/lib/prisma";
import { Package, FolderOpen, MessageSquare, Eye, TrendingUp } from "lucide-react";
import Link from "next/link";

async function getStats() {
  const [totalProducts, totalCategories, totalComments, pendingComments, totalViews] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.comment.count(),
    prisma.comment.count({ where: { approved: false } }),
    prisma.product.aggregate({ _sum: { viewCount: true } }),
  ]);
  const recentProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { category: { select: { name: true } } },
  });
  return { totalProducts, totalCategories, totalComments, pendingComments, totalViews: totalViews._sum.viewCount || 0, recentProducts };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Tổng Sản Phẩm", value: stats.totalProducts, icon: Package, href: "/admin/products", color: "bg-blue-500" },
    { label: "Danh Mục", value: stats.totalCategories, icon: FolderOpen, href: "/admin/categories", color: "bg-green-500" },
    { label: "Đánh Giá Chờ Duyệt", value: stats.pendingComments, icon: MessageSquare, href: "/admin/comments", color: "bg-yellow-500" },
    { label: "Tổng Lượt Xem", value: stats.totalViews.toLocaleString("vi-VN"), icon: Eye, href: "#", color: "bg-purple-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1a3a5c] mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Thao Tác Nhanh</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/products/new" className="flex items-center gap-2 p-3 bg-[#1a3a5c]/5 rounded-lg text-sm font-medium text-[#1a3a5c] hover:bg-[#1a3a5c]/10 transition-colors">
              <Package className="w-4 h-4" />
              Thêm Sản Phẩm
            </Link>
            <Link href="/admin/categories/new" className="flex items-center gap-2 p-3 bg-[#1a3a5c]/5 rounded-lg text-sm font-medium text-[#1a3a5c] hover:bg-[#1a3a5c]/10 transition-colors">
              <FolderOpen className="w-4 h-4" />
              Thêm Danh Mục
            </Link>
            <Link href="/admin/comments" className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg text-sm font-medium text-yellow-700 hover:bg-yellow-100 transition-colors">
              <MessageSquare className="w-4 h-4" />
              Duyệt Đánh Giá ({stats.pendingComments})
            </Link>
            <Link href="/" target="_blank" className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-sm font-medium text-green-700 hover:bg-green-100 transition-colors">
              <Eye className="w-4 h-4" />
              Xem Website
            </Link>
          </div>
        </div>

        {/* Recent products */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Sản Phẩm Mới Nhất</h2>
          <div className="space-y-3">
            {stats.recentProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-800 line-clamp-1">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.category.name}</p>
                </div>
                <Link href={`/admin/products/${p.id}`} className="text-[#1a3a5c] hover:underline text-xs">
                  Sửa
                </Link>
              </div>
            ))}
            {stats.recentProducts.length === 0 && (
              <p className="text-sm text-gray-400">Chưa có sản phẩm nào</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
