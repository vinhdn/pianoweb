"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { api } from "@/lib/api";
import { ProductGrid } from "@/components/product/product-grid";
import type { Product } from "@/lib/api";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";
  const [query, setQuery] = useState(q);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    api.getProducts({ q, limit: "20" })
      .then((res) => { setProducts(res.data); setTotal(res.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/tim-kiem?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tìm kiếm sản phẩm</h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập tên sản phẩm, thương hiệu..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
        />
        <button
          type="submit"
          className="bg-[#1a1a2e] text-white px-6 py-3 rounded-lg hover:bg-[#16213e] transition-colors"
        >
          Tìm
        </button>
      </form>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Đang tìm kiếm...</div>
      ) : q ? (
        <>
          <p className="text-gray-500 mb-4">
            Tìm thấy <strong>{total}</strong> kết quả cho &ldquo;<strong>{q}</strong>&rdquo;
          </p>
          <ProductGrid products={products} emptyMessage="Không tìm thấy sản phẩm phù hợp." />
        </>
      ) : (
        <p className="text-gray-400 text-center py-12">Nhập từ khóa để tìm kiếm sản phẩm.</p>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
