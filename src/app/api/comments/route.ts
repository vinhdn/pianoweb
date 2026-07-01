import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  try {
    const comments = await prisma.comment.findMany({
      where: {
        ...(productId ? { productId } : {}),
        approved: true,
      },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(comments);
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Cần đăng nhập" }, { status: 401 });
  }
  try {
    const { productId, content, rating } = await req.json();
    if (!productId || !content) {
      return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
    }
    const comment = await prisma.comment.create({
      data: {
        productId,
        userId: session.user.id,
        content,
        rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
        approved: false,
      },
      include: { user: { select: { id: true, name: true, image: true } } },
    });
    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
