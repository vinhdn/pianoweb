import { prisma } from "@/lib/prisma";
import { ApproveCommentButton } from "@/components/admin/approve-comment-button";
import { Button } from "@/components/ui/button";
import { Star, Check, X } from "lucide-react";

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const pending = comments.filter((c) => !c.approved);
  const approved = comments.filter((c) => c.approved);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1a3a5c] mb-8">
        Quản Lý Đánh Giá
        {pending.length > 0 && (
          <span className="ml-3 bg-yellow-100 text-yellow-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {pending.length} chờ duyệt
          </span>
        )}
      </h1>

      {comments.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <p className="text-gray-500">Chưa có đánh giá nào</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <div>
              <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                Chờ Duyệt ({pending.length})
              </h2>
              <div className="space-y-3">
                {pending.map((c) => (
                  <CommentCard key={c.id} comment={c} />
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              Đã Duyệt ({approved.length})
            </h2>
            <div className="space-y-3">
              {approved.map((c) => (
                <CommentCard key={c.id} comment={c} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CommentCard({ comment }: { comment: any }) {
  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${comment.approved ? "border-green-400" : "border-yellow-400"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.user.name || comment.user.email}</span>
            <span className="text-xs text-gray-400">→</span>
            <span className="text-sm text-[#1a3a5c] font-medium line-clamp-1">{comment.product.name}</span>
          </div>
          <div className="flex gap-0.5 mb-2">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className={`w-3.5 h-3.5 ${s <= comment.rating ? "fill-[#c9a84c] text-[#c9a84c]" : "text-gray-200"}`} />
            ))}
          </div>
          <p className="text-sm text-gray-600">{comment.content}</p>
          <p className="text-xs text-gray-400 mt-2">{new Date(comment.createdAt).toLocaleString("vi-VN")}</p>
        </div>
        <ApproveCommentButton id={comment.id} approved={comment.approved} />
      </div>
    </div>
  );
}
