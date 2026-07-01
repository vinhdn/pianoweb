"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types";
import { slugify } from "@/lib/utils";

interface Props {
  categories: Category[];
  category?: Partial<Category>;
}

export function CategoryForm({ categories, category }: Props) {
  const router = useRouter();
  const isEdit = !!category?.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    image: category?.image || "",
    parentId: category?.parentId || "",
    sortOrder: category?.sortOrder?.toString() || "0",
    published: category?.published !== false,
    metaTitle: category?.metaTitle || "",
    metaDesc: category?.metaDesc || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        isEdit ? `/api/categories/${category!.id}` : "/api/categories",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Lỗi"); return; }
      router.push("/admin/categories");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>}

      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-800">Thông Tin Danh Mục</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên Danh Mục *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a5c]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a5c]"
            />
            <Button type="button" variant="outline" size="sm" onClick={() => setForm((f) => ({ ...f, slug: slugify(f.name) }))}>
              Tạo
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô Tả</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a5c] resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Danh Mục Cha</label>
          <select
            value={form.parentId}
            onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a5c] bg-white"
          >
            <option value="">-- Không có (danh mục gốc) --</option>
            {categories.filter((c) => c.id !== category?.id).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thứ Tự Hiển Thị</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a5c]"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer h-10">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                className="w-4 h-4 accent-[#1a3a5c]"
              />
              <span className="text-sm font-medium text-gray-700">Hiển Thị</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-800">SEO</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu Đề SEO</label>
          <input
            type="text"
            value={form.metaTitle}
            onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a5c]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô Tả SEO</label>
          <textarea
            value={form.metaDesc}
            onChange={(e) => setForm((f) => ({ ...f, metaDesc: e.target.value }))}
            rows={2}
            maxLength={160}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a5c] resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>Hủy</Button>
        <Button type="submit" loading={loading}>{isEdit ? "Lưu Thay Đổi" : "Thêm Danh Mục"}</Button>
      </div>
    </form>
  );
}
