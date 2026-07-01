import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1a2e] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="text-[#c8a96e] font-bold text-lg">Piano Beauty</Link>
          <p className="text-gray-400 text-xs mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: "/admin", label: "Dashboard", icon: "📊" },
            { href: "/admin/san-pham", label: "Sản phẩm", icon: "🎹" },
            { href: "/admin/danh-muc", label: "Danh mục", icon: "📂" },
            { href: "/admin/binh-luan", label: "Bình luận", icon: "💬" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-gray-400 mb-2">{session.user.email}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="w-full text-sm text-left text-gray-300 hover:text-white transition-colors py-1"
            >
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
