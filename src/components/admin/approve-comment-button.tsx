"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ApproveCommentButton({ id, approved }: { id: string; approved: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: !approved }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={approved ? "outline" : "default"}
      size="sm"
      onClick={toggle}
      loading={loading}
      className={approved ? "text-red-500 border-red-200 hover:bg-red-50" : ""}
    >
      {approved ? <><X className="w-3 h-3" /> Ẩn</> : <><Check className="w-3 h-3" /> Duyệt</>}
    </Button>
  );
}
