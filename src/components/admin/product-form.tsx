"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Category, Product } from "@/types";
import Image from "next/image";
import { X, Plus, Upload } from "lucide-react";
import { slugify } from "@/lib/utils";

interface Props {
  categories: Category[];
  product?: Partial<Product>;
}

export function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const isEdit = !!product?.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    shortDesc: product?.shortDesc || "",
    price: product?.price?.toString() || "",
    salePrice: product?.salePrice?.toString() || "",
    categoryId: product?.categoryId || "",
    brand: product?.brand || "",
    sku: product?.sku || "",
    stock: product?.stock?.toString() || "0",
    featured: product?.featured || false,
    published: product?.published !== false,
    images: product?.images || [],
    thumbnail: product?.thumbnail || "",
    metaTitle: product?.metaTitle || "",
    metaDesc: product?.metaDesc || "",
    metaKeywords: product?.metaKeywords || "",
    specsRaw: product?.specs ? JSON.stringify(product.specs, null, 2) : '{\n  "Bàn phím": "",\n  "Âm sắc": "",\n  "Kết nối": ""\n}',
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.urls) {
        setForm((f) => ({
          ...f,
          images: [...f.images, ...data.urls],
          thumbnail: f.thumbnail || data.urls[0],
        }));
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let specs = null;
      try { specs = JSON.parse(form.specsRaw); } catch {}

      const body = { ...form, specs };
      const res = await fetch(
        isEdit ? `/api/products/${product!.id}` : "/api/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Lỗi"); return; }
      router.push("/admin/products");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, key: keyof typeof form, type = "text", required = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && " *"}</label>
      <input
        type={type}
        value={form[key] as string}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        required={required}
        className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a5c]"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-2">Thông Tin Cơ Bản</h2>
          {field("Tên Sản Phẩm", "name", "text", true)}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a5c]"
                placeholder="tu-dong-tao-tu-ten"
              />
              <Button type="button" variant="outline" size="sm" onClick={() => setForm((f) => ({ ...f, slug: slugify(f.name) }))}>
                Tạo
              </Button>
            </div>
          </div>
          {field("Mô Tả Ngắn", "shortDesc")}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô Tả Đầy Đủ *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              required
              rows={6}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a5c] resize-none"
              placeholder="Mô tả HTML được hỗ trợ..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh Mục *</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              required
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a5c] bg-white"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {field("Thương Hiệu", "brand")}
            {field("SKU", "sku")}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-800">Giá & Kho</h2>
            <div className="grid grid-cols-2 gap-3">
              {field("Giá Gốc (VNĐ)", "price", "number", true)}
              {field("Giá Khuyến Mãi", "salePrice", "number")}
            </div>
            {field("Số Lượng Kho", "stock", "number")}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm space-y-3">
            <h2 className="font-semibold text-gray-800">Trạng Thái</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                className="w-4 h-4 accent-[#1a3a5c]"
              />
              <span className="text-sm">Hiển thị (Đã xuất bản)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                className="w-4 h-4 accent-[#1a3a5c]"
              />
              <span className="text-sm">Sản Phẩm Nổi Bật</span>
            </label>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm space-y-3">
            <h2 className="font-semibold text-gray-800">SEO</h2>
            {field("Tiêu Đề SEO", "metaTitle")}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô Tả SEO</label>
              <textarea
                value={form.metaDesc}
                onChange={(e) => setForm((f) => ({ ...f, metaDesc: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a5c] resize-none"
                maxLength={160}
              />
              <p className="text-xs text-gray-400 mt-0.5">{form.metaDesc.length}/160</p>
            </div>
            {field("Từ Khóa SEO", "metaKeywords")}
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4">Hình Ảnh Sản Phẩm</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          {form.images.map((img, i) => (
            <div key={i} className="relative group">
              <div className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${form.thumbnail === img ? "border-[#1a3a5c]" : "border-gray-200"}`}>
                <Image src={img} alt="" fill className="object-cover" onClick={() => setForm((f) => ({ ...f, thumbnail: img }))} />
              </div>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i), thumbnail: f.thumbnail === img ? f.images[0] || "" : f.thumbnail }))}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
              >
                <X className="w-3 h-3" />
              </button>
              {form.thumbnail === img && <p className="text-xs text-center text-[#1a3a5c] mt-0.5">Ảnh chính</p>}
            </div>
          ))}
          <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#1a3a5c] transition-colors">
            <Upload className="w-5 h-5 text-gray-400 mb-1" />
            <span className="text-xs text-gray-400">Upload</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
        {uploading && <p className="text-sm text-gray-500">Đang upload...</p>}
        <p className="text-xs text-gray-400">Click vào ảnh để đặt làm ảnh chính. Hỗ trợ JPG, PNG, WebP.</p>
      </div>

      {/* Specs */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4">Thông Số Kỹ Thuật (JSON)</h2>
        <textarea
          value={form.specsRaw}
          onChange={(e) => setForm((f) => ({ ...f, specsRaw: e.target.value }))}
          rows={8}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-[#1a3a5c] resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">Format: {"{ \"Tên thông số\": \"Giá trị\" }"}</p>
      </div>

      {/* Submit */}
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Hủy
        </Button>
        <Button type="submit" loading={loading}>
          {isEdit ? "Lưu Thay Đổi" : "Thêm Sản Phẩm"}
        </Button>
      </div>
    </form>
  );
}
