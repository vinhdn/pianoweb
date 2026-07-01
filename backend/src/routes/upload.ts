import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAdmin } from "../middleware/auth";

const router = Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Định dạng không được hỗ trợ"));
  },
});

// POST /upload
router.post("/", requireAdmin, upload.array("files", 10), (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files?.length) {
    res.status(400).json({ error: "Không có file" });
    return;
  }
  const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`;
  const urls = files.map((f) => `${baseUrl}/uploads/${f.filename}`);
  res.json({ urls });
});

export default router;
