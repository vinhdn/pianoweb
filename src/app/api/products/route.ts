import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "12"));
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const q = searchParams.get("q");
    const sort = searchParams.get("sort") || "newest";

    const where = {
      published: true,
      ...(category ? { categoryId: category } : {}),
      ...(featured === "true" ? { featured: true } : {}),
      ...(q ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { brand: { contains: q, mode: "insensitive" as const } },
          { description: { contains: q, mode: "insensitive" as const } },
        ],
      } : {}),
    };

    const orderBy =
      sort === "price-asc" ? { price: "asc" as const } :
      sort === "price-desc" ? { price: "desc" as const } :
      sort === "popular" ? { viewCount: "desc" as const } :
      { createdAt: "desc" as const };

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { select: { id: true, name: true, slug: true } } },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
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
    const slug = body.slug || slugify(body.name);

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        shortDesc: body.shortDesc,
        price: parseFloat(body.price),
        salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
        images: body.images || [],
        thumbnail: body.thumbnail || body.images?.[0] || null,
        categoryId: body.categoryId,
        brand: body.brand || null,
        sku: body.sku || null,
        stock: parseInt(body.stock) || 0,
        featured: body.featured || false,
        published: body.published !== undefined ? body.published : true,
        specs: body.specs || null,
        metaTitle: body.metaTitle || null,
        metaDesc: body.metaDesc || null,
        metaKeywords: body.metaKeywords || null,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 409 });
    }
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
