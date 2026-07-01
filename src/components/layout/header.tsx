"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, Search, User, Menu, X, Phone, ChevronDown, Scale } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/store/cart-context";
import { useCompare } from "@/store/compare-context";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types";

interface HeaderProps {
  categories?: Category[];
}

export function Header({ categories = [] }: HeaderProps) {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const { items: compareItems } = useCompare();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-[#1a3a5c] text-white text-sm py-2">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="tel:0909123456" className="flex items-center gap-1 hover:text-[#c9a84c] transition-colors">
              <Phone className="w-3 h-3" />
              <span>0909 123 456</span>
            </a>
            <span className="hidden sm:inline text-white/60">|</span>
            <span className="hidden sm:inline">Miễn phí giao hàng toàn quốc</span>
          </div>
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <Link href="/account" className="hover:text-[#c9a84c] transition-colors">
                  {session.user.name || session.user.email}
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin" className="hover:text-[#c9a84c] transition-colors">
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="hover:text-[#c9a84c] transition-colors"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-[#c9a84c] transition-colors">
                  Đăng nhập
                </Link>
                <span className="text-white/60">|</span>
                <Link href="/register" className="hover:text-[#c9a84c] transition-colors">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container py-4">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-[#1a3a5c] rounded-full flex items-center justify-center">
              <span className="text-[#c9a84c] font-bold text-lg">P</span>
            </div>
            <div>
              <div className="font-bold text-[#1a3a5c] text-lg leading-tight">Piano Beauty</div>
              <div className="text-xs text-gray-500 leading-tight">Đàn Piano Chính Hãng</div>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto hidden md:flex">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm đàn piano..."
                className="w-full h-10 pl-4 pr-12 border-2 border-[#1a3a5c]/20 rounded-lg focus:outline-none focus:border-[#1a3a5c] text-sm"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 bg-[#1a3a5c] text-white rounded-r-lg hover:bg-[#1a3a5c]/90"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="w-5 h-5 text-[#1a3a5c]" />
            </button>

            {compareItems.length > 0 && (
              <Link
                href="/so-sanh"
                className="relative p-2 rounded-md hover:bg-gray-100"
                title="So sánh sản phẩm"
              >
                <Scale className="w-5 h-5 text-[#1a3a5c]" />
                <span className="absolute -top-1 -right-1 bg-[#c9a84c] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {compareItems.length}
                </span>
              </Link>
            )}

            <Link href="/gio-hang" className="relative p-2 rounded-md hover:bg-gray-100">
              <ShoppingCart className="w-5 h-5 text-[#1a3a5c]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="mt-3 md:hidden">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm đàn piano..."
                className="w-full h-10 pl-4 pr-12 border-2 border-[#1a3a5c]/20 rounded-lg focus:outline-none focus:border-[#1a3a5c] text-sm"
                autoFocus
              />
              <button type="submit" className="absolute right-0 top-0 h-full px-3 bg-[#1a3a5c] text-white rounded-r-lg">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Navigation */}
      <nav className="border-t bg-[#1a3a5c] text-white hidden md:block">
        <div className="container">
          <ul className="flex items-center gap-0">
            <li>
              <Link href="/" className="block px-4 py-3 text-sm font-medium hover:bg-white/10 transition-colors">
                Trang Chủ
              </Link>
            </li>
            <li className="relative group">
              <button className="flex items-center gap-1 px-4 py-3 text-sm font-medium hover:bg-white/10 transition-colors">
                Sản Phẩm <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute top-full left-0 bg-white text-gray-800 shadow-lg rounded-b-lg min-w-48 hidden group-hover:block z-50">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/danh-muc/${cat.slug}`}
                    className="block px-4 py-2.5 text-sm hover:bg-[#1a3a5c] hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  href="/san-pham"
                  className="block px-4 py-2.5 text-sm font-medium border-t hover:bg-[#1a3a5c] hover:text-white transition-colors"
                >
                  Tất Cả Sản Phẩm
                </Link>
              </div>
            </li>
            {categories.slice(0, 4).map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/danh-muc/${cat.slug}`}
                  className="block px-4 py-3 text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/khuyen-mai" className="block px-4 py-3 text-sm font-medium text-[#c9a84c] hover:bg-white/10 transition-colors">
                Khuyến Mãi
              </Link>
            </li>
            <li>
              <Link href="/lien-he" className="block px-4 py-3 text-sm font-medium hover:bg-white/10 transition-colors">
                Liên Hệ
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container py-4">
            <ul className="flex flex-col gap-1">
              <li>
                <Link href="/" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-[#1a3a5c]">
                  Trang Chủ
                </Link>
              </li>
              <li className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">Danh Mục</li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/danh-muc/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 pl-2 text-sm text-gray-700 hover:text-[#1a3a5c]"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/khuyen-mai" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-[#c9a84c]">
                  Khuyến Mãi
                </Link>
              </li>
              <li>
                <Link href="/lien-he" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-[#1a3a5c]">
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
