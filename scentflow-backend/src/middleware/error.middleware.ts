import { NextFunction, Request, Response } from "express";

export function errorMiddleware(
  error: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(error);

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
}
