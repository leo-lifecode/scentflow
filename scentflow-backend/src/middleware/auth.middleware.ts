import { NextFunction, Request, Response } from "express";
import { getUser } from "../services/auth.service";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

function getBearerToken(req: Request) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      res.status(401).json({ message: "Authentication diperlukan" });
      return;
    }

    const user = await getUser(token);
    req.user = {
      id: user.id,
      email: user.email,
      role: user.app_metadata?.role ?? "customer",
    };

    next();
  } catch {
    res.status(401).json({ message: "Session tidak valid atau sudah expired" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: "Authentication diperlukan" });
      return;
    }

    if (!roles.includes(req.user.role ?? "customer")) {
      res.status(403).json({ message: "Tidak memiliki akses" });
      return;
    }

    next();
  };
}
