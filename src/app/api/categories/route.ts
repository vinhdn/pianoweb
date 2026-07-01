import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug || slugify(body.name),
        description: body.description || null,
        image: body.image || null,
        parentId: body.parentId || null,
        sortOrder: body.sortOrder || 0,
        published: body.published !== undefined ? body.published : true,
        metaTitle: body.metaTitle || null,
        metaDesc: body.metaDesc || null,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 409 });
    }
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
