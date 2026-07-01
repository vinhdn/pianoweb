"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import type { Category } from "@/lib/api";

type FormData = {
  name: string;
  slug: string;
  description: string;
  parentId: string;
  sortOrder: string;
  published: boolean;
  metaTitle: string;
  metaDesc: string;
  image: string;
};

export function CategoryForm({
  category,
  categories,
}: {
  category?: Category;
  categories: Category[];
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState<FormData>(() =>
    category
      ? {
          name: category.name,
          slug: category.slug,
          description: category.description || "",
          parentId: category.parentId || "",
          sortOrder: String(category.sortOrder),
          published: category.published,
          metaTitle: category.metaTitle || "",
          metaDesc: category.metaDesc || "",
          image: category.image || "",
        }
      : {
          name: "", slug: "", description: "", parentId: "", sortOrder: "0",
          published: true, metaTitle: "", metaDesc: "", image: "",
        }
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const topLevelCats = categories.filter(
    (c) => !c.parentId && c.id !== category?.id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!session?.accessToken) return;
    setLoading(true);
    try {
      const data = {
        ...form,
        sortOrder: parseInt(form.sortOrder) || 0,
        parentId: form.parentId || null,
      };
      if (category) {
        await api.updateCategory(category.id, data, session.accessToken);
      } else {
        await api.createCategory(data, session.accessToken);
      }
      router.push("/admin/danh-muc");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lỗi khi lưu danh mục.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold">Thông tin danh mục</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
          <input
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm((prev) => ({ ...prev, name, slug: prev.slug || slugify(name) }));
            }}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e] resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục cha</label>
            <select
              value={form.parentId}
              onChange={(e) => set("parentId", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
            >
              <option value="">-- Không có --</option>
              {topLevelCats.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự hiển thị</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => set("sortOrder", e.target.value)}
              min="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL hình ảnh</label>
          <input
            value={form.image}
            onChange={(e) => set("image", e.target.value)}
            placeholder="https://..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm">Hiển thị danh mục</span>
        </label>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold">SEO</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
          <input
            value={form.metaTitle}
            onChange={(e) => set("metaTitle", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
          <textarea
            value={form.metaDesc}
            onChange={(e) => set("metaDesc", e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e] resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={loading} size="lg">
          {category ? "Cập nhật danh mục" : "Tạo danh mục"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
          Hủy
        </Button>
      </div>
    </form>
  );
}
