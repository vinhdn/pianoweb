import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const [totalProducts, totalCategories, totalComments, pendingComments, totalViews, recentProducts] =
      await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.comment.count(),
        prisma.comment.count({ where: { approved: false } }),
        prisma.product.aggregate({ _sum: { viewCount: true } }),
        prisma.product.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { category: { select: { name: true } } },
        }),
      ]);

    res.json({
      totalProducts,
      totalCategories,
      totalComments,
      pendingComments,
      totalViews: totalViews._sum.viewCount || 0,
      recentProducts,
    });
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
});

export default router;
