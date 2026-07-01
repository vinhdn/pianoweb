import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/category-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function NewCategoryPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/categories" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-[#1a3a5c]">Thêm Danh Mục Mới</h1>
      </div>
      <CategoryForm categories={categories as never} />
    </div>
  );
}
