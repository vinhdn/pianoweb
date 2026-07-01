import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { requireAuth, signToken } from "../middleware/auth";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
      return;
    }
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      res.status(409).json({ error: "Email đã được sử dụng" });
      return;
    }
    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true, email: true, name: true, role: true },
    });
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.status(201).json({ user, token });
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Thiếu email hoặc mật khẩu" });
      return;
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });
      return;
    }
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role, image: user.image },
      token,
    });
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
});

router.get("/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, name: true, role: true, image: true, phone: true, address: true },
    });
    if (!user) {
      res.status(404).json({ error: "Không tìm thấy user" });
      return;
    }
    res.json(user);
  } catch {
    res.status(500).json({ error: "Lỗi server" });
  }
});

export default router;
