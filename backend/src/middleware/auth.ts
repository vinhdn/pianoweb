import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Cần đăng nhập" });
    return;
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Token không hợp lệ" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (req.user?.role !== "ADMIN") {
      res.status(403).json({ error: "Không có quyền admin" });
      return;
    }
    next();
  });
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
}
