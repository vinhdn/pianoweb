"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/contexts/cart-context";
import { useCompare } from "@/contexts/compare-context";
import { useState } from "react";
import type { Category } from "@/lib/api";

export function Header({ categories }: { categories: Category[] }) {
  const { data: session } = useSession();
  const { count } = useCart();
  const { items: compareItems } = useCompare();
  const [menuOpen, setMenuOpen] = useState(false);

  const topCategories = categories.filter((c) => !c.parentId).slice(0, 6);

  return (
    <header className="bg-[#1a1a2e] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#c8a96e]">Piano Beauty</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm hover:text-[#c8a96e] transition-colors">
              Trang chủ
            </Link>
            <Link href="/san-pham" className="text-sm hover:text-[#c8a96e] transition-colors">
              Sản phẩm
            </Link>
            {topCategories.map((c) => (
              <Link
                key={c.id}
                href={`/danh-muc/${c.slug}`}
                className="text-sm hover:text-[#c8a96e] transition-colors"
              >
                {c.name}
              </Link>
            ))}
            <Link href="/lien-he" className="text-sm hover:text-[#c8a96e] transition-colors">
              Liên hệ
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/tim-kiem"
              className="p-2 hover:text-[#c8a96e] transition-colors"
              aria-label="Tìm kiếm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {compareItems.length > 0 && (
              <Link href="/so-sanh" className="relative p-2 hover:text-[#c8a96e] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-[#c8a96e] text-[#1a1a2e] text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareItems.length}
                </span>
              </Link>
            )}

            <Link href="/gio-hang" className="relative p-2 hover:text-[#c8a96e] transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c8a96e] text-[#1a1a2e] text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            {session ? (
              <div className="flex items-center gap-2">
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-sm text-[#c8a96e] hover:underline hidden md:block"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="text-sm hover:text-[#c8a96e] transition-colors hidden md:block"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-sm hover:text-[#c8a96e] transition-colors hidden md:block">
                Đăng nhập
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 flex flex-col gap-3">
            <Link href="/" className="text-sm hover:text-[#c8a96e]" onClick={() => setMenuOpen(false)}>Trang chủ</Link>
            <Link href="/san-pham" className="text-sm hover:text-[#c8a96e]" onClick={() => setMenuOpen(false)}>Sản phẩm</Link>
            {topCategories.map((c) => (
              <Link key={c.id} href={`/danh-muc/${c.slug}`} className="text-sm hover:text-[#c8a96e] pl-2" onClick={() => setMenuOpen(false)}>
                {c.name}
              </Link>
            ))}
            <Link href="/lien-he" className="text-sm hover:text-[#c8a96e]" onClick={() => setMenuOpen(false)}>Liên hệ</Link>
            {session ? (
              <button onClick={() => signOut()} className="text-sm text-left hover:text-[#c8a96e]">Đăng xuất</button>
            ) : (
              <Link href="/login" className="text-sm hover:text-[#c8a96e]" onClick={() => setMenuOpen(false)}>Đăng nhập</Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
