import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const limit = parseInt(searchParams.get("limit") || "10");

  if (q.length < 2) return NextResponse.json([]);

  try {
    const products = await prisma.product.findMany({
      where: {
        published: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { brand: { contains: q, mode: "insensitive" } },
          { shortDesc: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true, name: true, slug: true, thumbnail: true, images: true,
        price: true, salePrice: true, brand: true,
      },
      take: limit,
      orderBy: { viewCount: "desc" },
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
