"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Comment } from "@/types";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";

interface Props {
  productId: string;
  initialComments: Comment[];
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHover(s)}
          onMouseLeave={() => onChange && setHover(0)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            className={`w-5 h-5 ${
              s <= (hover || value) ? "fill-[#c9a84c] text-[#c9a84c]" : "text-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function CommentSection({ productId, initialComments }: Props) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const avgRating = comments.length
    ? comments.reduce((s, c) => s + c.rating, 0) / comments.length
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, content, rating }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [data, ...prev]);
        setContent("");
        setRating(5);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <MessageSquare className="w-5 h-5 text-[#1a3a5c]" />
        <h3 className="text-lg font-semibold text-[#1a3a5c]">
          Đánh Giá ({comments.length})
        </h3>
        {avgRating > 0 && (
          <div className="flex items-center gap-1">
            <StarRating value={Math.round(avgRating)} />
            <span className="text-sm text-gray-500">({avgRating.toFixed(1)})</span>
          </div>
        )}
      </div>

      {/* Form */}
      {session ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4 mb-6">
          <h4 className="font-medium mb-3">Viết Đánh Giá</h4>
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-1">Đánh giá của bạn:</p>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a5c] resize-none"
            required
          />
          <div className="flex justify-end mt-2">
            <Button type="submit" size="sm" loading={submitting}>
              Gửi Đánh Giá
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center text-sm text-gray-600">
          <Link href="/login" className="text-[#1a3a5c] font-medium hover:underline">Đăng nhập</Link> để viết đánh giá
        </div>
      )}

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="text-gray-400 text-center py-8">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-4 bg-white border border-gray-100 rounded-xl">
              <div className="w-9 h-9 rounded-full bg-[#1a3a5c]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {comment.user.image ? (
                  <Image src={getImageUrl(comment.user.image)} alt={comment.user.name || ""} width={36} height={36} className="object-cover" />
                ) : (
                  <span className="text-[#1a3a5c] font-semibold text-sm">
                    {(comment.user.name || "U")[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{comment.user.name || "Ẩn danh"}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <StarRating value={comment.rating} />
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
