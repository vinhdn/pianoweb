import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { slugify } from "../lib/slugify";

const router = Router();

// GET /products
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 12);
    const category = req.query.category as string | undefined;
    const featured = req.query.featured as string | undefined;
    const q = req.query.q as string | undefined;
    const sort = (req.query.sort as string) || "newest";

    const where = {
      published: true,
      ...(category ? { categoryId: category } : {}),
      ...(featured === "true" ? { featured: true } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { brand: { contains: q, mode: "insensitive" as const } },
              { description: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
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

    res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// GET /products/all (admin)
router.get("/all", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// GET /products/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: req.params.id as string }, { slug: req.params.id as string }],
        published: true,
      },
      include: {
        category: true,
        comments: {
          where: { approved: true },
          include: { user: { select: { id: true, name: true, image: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!product) {
      res.status(404).json({ error: "Không tìm thấy sản phẩm" });
      return;
    }
    // increment view
    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });
    res.json(product);
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// GET /products/:id/related
router.get("/:id/related", async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id as string },
      select: { categoryId: true },
    });
    if (!product) { res.status(404).json({ error: "Không tìm thấy" }); return; }
    const related = await prisma.product.findMany({
      where: { categoryId: product.categoryId, published: true, id: { not: req.params.id as string } },
      include: { category: true },
      take: 4,
      orderBy: { createdAt: "desc" },
    });
    res.json(related);
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// POST /products (admin)
router.post("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug || slugify(body.name),
        description: body.description,
        shortDesc: body.shortDesc || null,
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
    res.status(201).json(product);
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2002") {
      res.status(409).json({ error: "Slug đã tồn tại" });
      return;
    }
    res.status(500).json({ error: "Lỗi server" });
  }
});

// PUT /products/:id (admin)
router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const product = await prisma.product.update({
      where: { id: req.params.id as string },
      data: {
        name: body.name,
        slug: body.slug || slugify(body.name),
        description: body.description,
        shortDesc: body.shortDesc || null,
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
    res.json(product);
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// DELETE /products/:id (admin)
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
});

export default router;
