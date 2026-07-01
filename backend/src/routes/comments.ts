import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

// GET /comments?productId=xxx
router.get("/", async (req: Request, res: Response) => {
  try {
    const productId = req.query.productId as string | undefined;
    const comments = await prisma.comment.findMany({
      where: { ...(productId ? { productId } : {}), approved: true },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(comments);
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// GET /comments/all (admin)
router.get("/all", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(comments);
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// POST /comments
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const { productId, content, rating } = req.body;
    if (!productId || !content) {
      res.status(400).json({ error: "Thiếu thông tin" });
      return;
    }
    const comment = await prisma.comment.create({
      data: {
        productId,
        userId: req.user!.id,
        content,
        rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
        approved: false,
      },
      include: { user: { select: { id: true, name: true, image: true } } },
    });
    res.status(201).json(comment);
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// PATCH /comments/:id (admin - approve/reject)
router.patch("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { approved } = req.body;
    const comment = await prisma.comment.update({
      where: { id: req.params.id as string },
      data: { approved },
    });
    res.json(comment);
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// DELETE /comments/:id (admin)
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    await prisma.comment.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
});

export default router;
