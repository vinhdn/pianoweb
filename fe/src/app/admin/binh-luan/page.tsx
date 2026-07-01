import { auth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const dynamic = "force-dynamic";

type AdminComment = {
  id: string;
  content: string;
  rating: number;
  approved: boolean;
  createdAt: string;
  user: { name: string; email: string };
  product: { name: string; slug: string };
};

export default async function AdminCommentsPage() {
  const session = await auth();
  let comments: AdminComment[] = [];
  try {
    comments = (await api.getAllComments(session!.accessToken)) as unknown as AdminComment[];
  } catch {}

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bình luận ({comments.length})</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Người dùng</th>
                <th className="text-left p-4 font-medium text-gray-600">Sản phẩm</th>
                <th className="text-left p-4 font-medium text-gray-600">Nội dung</th>
                <th className="text-left p-4 font-medium text-gray-600">Sao</th>
                <th className="text-left p-4 font-medium text-gray-600">Trạng thái</th>
                <th className="text-left p-4 font-medium text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {comments.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium">{c.user.name}</div>
                    <div className="text-xs text-gray-400">{c.user.email}</div>
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/san-pham/${c.product.slug}`}
                      className="text-[#c8a96e] hover:underline line-clamp-1"
                      target="_blank"
                    >
                      {c.product.name}
                    </Link>
                  </td>
                  <td className="p-4 max-w-xs">
                    <p className="line-clamp-2 text-gray-700">{c.content}</p>
                  </td>
                  <td className="p-4 text-yellow-500">
                    {"★".repeat(c.rating)}{"☆".repeat(5 - c.rating)}
                  </td>
                  <td className="p-4">
                    <Badge variant={c.approved ? "success" : "warning"}>
                      {c.approved ? "Đã duyệt" : "Chờ duyệt"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {!c.approved && <ApproveButton id={c.id} token={session!.accessToken} />}
                      <DeleteCommentButton id={c.id} token={session!.accessToken} />
                    </div>
                  </td>
                </tr>
              ))}
              {comments.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">Chưa có bình luận nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ApproveButton({ id, token }: { id: string; token: string }) {
  return (
    <form action={async () => { "use server"; try { await api.approveComment(id, true, token); } catch {} }}>
      <button type="submit" className="text-green-600 hover:underline text-xs">Duyệt</button>
    </form>
  );
}

function DeleteCommentButton({ id, token }: { id: string; token: string }) {
  return (
    <form action={async () => { "use server"; try { await api.deleteComment(id, token); } catch {} }}>
      <button
        type="submit"
        onClick={(e) => { if (!confirm("Xóa bình luận này?")) e.preventDefault(); }}
        className="text-red-500 hover:underline text-xs"
      >
        Xóa
      </button>
    </form>
  );
}
