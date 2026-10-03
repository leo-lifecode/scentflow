import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { getOrdersForUser } from "../services/order.service";

export async function getMyOrdersController(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ message: "Authentication diperlukan" });
    return;
  }

  const orders = await getOrdersForUser(req.user.id);
  res.json({ data: orders });
}
