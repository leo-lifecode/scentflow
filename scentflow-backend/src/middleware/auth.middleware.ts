import { NextFunction, Request, Response } from "express";
import { getUser } from "../services/auth.service";

const ACCESS_COOKIE = "scentflow_access_token";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

function getCookie(req: Request, name: string) {
  const header = req.headers.cookie ?? "";
  for (const item of header.split(";")) {
    const index = item.indexOf("=");
    if (index === -1) continue;
    if (item.slice(0, index).trim() === name) {
      return decodeURIComponent(item.slice(index + 1).trim()) || null;
    }
  }
  return null;
}

function getAccessToken(req: Request) {
  const authorization = req.headers.authorization;
  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim() || null;
  }

  return getCookie(req, ACCESS_COOKIE);
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = getAccessToken(req);
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
