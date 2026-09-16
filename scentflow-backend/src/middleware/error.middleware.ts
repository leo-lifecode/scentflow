import { Request, Response, NextFunction } from "express";

export function errorMiddleware(error: unknown, _req: Request, res: Response, next: NextFunction) {
  console.error(error);

  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan pada server",
  });
}
