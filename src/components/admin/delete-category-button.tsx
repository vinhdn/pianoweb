"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Xóa danh mục "${name}"? Các sản phẩm trong danh mục sẽ mất danh mục.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
      else alert("Xóa thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete} loading={loading} className="text-red-500 hover:text-red-700 hover:bg-red-50">
      <Trash2 className="w-3.5 h-3.5" />
    </Button>
  );
}
