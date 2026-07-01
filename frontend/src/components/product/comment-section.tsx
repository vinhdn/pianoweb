"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import type { Comment } from "@/lib/api";

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange?.(s)}
          className={`text-xl ${s <= value ? "text-yellow-400" : "text-gray-300"} ${onChange ? "hover:text-yellow-300 cursor-pointer" : "cursor-default"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export function CommentSection({
  productId,
  initialComments,
}: {
  productId: string;
  initialComments: Comment[];
}) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken || !content.trim()) return;
    setSubmitting(true);
    try {
      await api.createComment({ productId, content, rating }, session.accessToken);
      setContent("");
      setRating(5);
      setSubmitted(true);
    } catch {}
    setSubmitting(false);
  };

  const avgRating =
    comments.length > 0
      ? Math.round(comments.reduce((s, c) => s + c.rating, 0) / comments.length)
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold">Đánh giá</h2>
        {comments.length > 0 && (
          <span className="text-gray-500 text-sm">({comments.length} đánh giá)</span>
        )}
        {avgRating > 0 && <StarRating value={avgRating} />}
      </div>

      {comments.length === 0 ? (
        <p className="text-gray-500">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1a1a2e] text-white text-sm flex items-center justify-center font-medium">
                    {c.user.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <span className="font-medium text-sm">{c.user.name || "Ẩn danh"}</span>
                </div>
                <StarRating value={c.rating} />
              </div>
              <p className="text-gray-700 text-sm">{c.content}</p>
              <p className="text-gray-400 text-xs mt-2">
                {new Date(c.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          ))}
        </div>
      )}

      {session ? (
        submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
            Cảm ơn bạn đã đánh giá! Đánh giá của bạn đang chờ duyệt.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold">Viết đánh giá của bạn</h3>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Đánh giá sao</label>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nhận xét của bạn..."
              rows={4}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e] resize-none"
            />
            <Button type="submit" loading={submitting} disabled={!content.trim()}>
              Gửi đánh giá
            </Button>
          </form>
        )
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-500">
          <a href="/login" className="text-[#c8a96e] hover:underline">Đăng nhập</a> để viết đánh giá.
        </div>
      )}
    </div>
  );
}
