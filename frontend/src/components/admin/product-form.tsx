"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import type { Product, Category } from "@/lib/api";

type FormData = {
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  price: string;
  salePrice: string;
  categoryId: string;
  brand: string;
  sku: string;
  stock: string;
  featured: boolean;
  published: boolean;
  metaTitle: string;
  metaDesc: string;
  metaKeywords: string;
  images: string[];
};

const defaultForm: FormData = {
  name: "", slug: "", description: "", shortDesc: "", price: "", salePrice: "",
  categoryId: "", brand: "", sku: "", stock: "0", featured: false, published: true,
  metaTitle: "", metaDesc: "", metaKeywords: "", images: [],
};

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState<FormData>(() =>
    product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDesc: product.shortDesc || "",
          price: String(product.price),
          salePrice: product.salePrice ? String(product.salePrice) : "",
          categoryId: product.categoryId,
          brand: product.brand || "",
          sku: product.sku || "",
          stock: String(product.stock),
          featured: product.featured,
          published: product.published,
          metaTitle: product.metaTitle || "",
          metaDesc: product.metaDesc || "",
          metaKeywords: product.metaKeywords || "",
          images: product.images,
        }
      : defaultForm
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (field: keyof FormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleNameChange = (name: string) => {
    setForm((prev) => ({ ...prev, name, slug: prev.slug || slugify(name) }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !session?.accessToken) return;
    setUploading(true);
    try {
      const res = await api.uploadFiles(files, session.accessToken);
      set("images", [...form.images, ...res.urls]);
    } catch {
      setError("Lỗi upload ảnh.");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!session?.accessToken) return;
    setLoading(true);
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
        stock: parseInt(form.stock),
        thumbnail: form.images[0] || null,
      };
      if (product) {
        await api.updateProduct(product.id, data, session.accessToken);
      } else {
        await api.createProduct(data, session.accessToken);
      }
      router.push("/admin/san-pham");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lỗi khi lưu sản phẩm.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold">Thông tin cơ bản</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
          <input
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
          <textarea
            value={form.shortDesc}
            onChange={(e) => set("shortDesc", e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e] resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết *</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            required
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e] resize-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold">Giá & Kho hàng</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá gốc (VND) *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              required
              min="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá khuyến mãi</label>
            <input
              type="number"
              value={form.salePrice}
              onChange={(e) => set("salePrice", e.target.value)}
              min="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng kho</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
              min="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold">Phân loại</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục *</label>
            <select
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
            <input
              value={form.brand}
              onChange={(e) => set("brand", e.target.value)}
              placeholder="Yamaha, Kawai..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã SKU</label>
            <input
              value={form.sku}
              onChange={(e) => set("sku", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
            />
          </div>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">Sản phẩm nổi bật</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">Hiển thị</span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold">Hình ảnh</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload ảnh {uploading && "(đang upload...)"}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="text-sm"
          />
        </div>
        {form.images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.images.map((url, i) => (
              <div key={i} className="relative">
                <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg border" />
                <button
                  type="button"
                  onClick={() => set("images", form.images.filter((_, j) => j !== i))}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hoặc nhập URL ảnh</label>
          <input
            type="url"
            placeholder="https://..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const val = (e.target as HTMLInputElement).value.trim();
                if (val) { set("images", [...form.images, val]); (e.target as HTMLInputElement).value = ""; }
              }
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
          />
          <p className="text-xs text-gray-400 mt-1">Nhấn Enter để thêm URL</p>
        </div>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
          <input
            value={form.metaKeywords}
            onChange={(e) => set("metaKeywords", e.target.value)}
            placeholder="keyword1, keyword2, ..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={loading} size="lg">
          {product ? "Cập nhật sản phẩm" : "Tạo sản phẩm"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
          Hủy
        </Button>
      </div>
    </form>
  );
}
