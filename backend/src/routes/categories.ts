import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/auth";
import { slugify } from "../lib/slugify";

const router = Router();

// GET /categories
router.get("/", async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      include: {
        children: { where: { published: true } },
        _count: { select: { products: true } },
      },
    });
    res.json(categories);
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// GET /categories/all (admin - includes unpublished)
router.get("/all", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        parent: { select: { name: true } },
        _count: { select: { products: true } },
      },
    });
    res.json(categories);
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// GET /categories/:slug
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.findFirst({
      where: {
        OR: [{ slug: req.params.slug as string }, { id: req.params.slug as string }],
        published: true,
      },
      include: { children: { where: { published: true } } },
    });
    if (!category) {
      res.status(404).json({ error: "Không tìm thấy danh mục" });
      return;
    }
    res.json(category);
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// POST /categories (admin)
router.post("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const body = req.body;
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
    res.status(201).json(category);
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2002") {
      res.status(409).json({ error: "Slug đã tồn tại" });
      return;
    }
    res.status(500).json({ error: "Lỗi server" });
  }
});

// PUT /categories/:id (admin)
router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const category = await prisma.category.update({
      where: { id: req.params.id as string },
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
    res.json(category);
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// DELETE /categories/:id (admin)
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
});

export default router;
