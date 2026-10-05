import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { syncPaymentStatus } from "../services/payment-status.service";

export async function syncPaymentStatusController(req: AuthenticatedRequest, res: Response) {
  const orderId = req.params.orderId;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Authentication diperlukan" });
    return;
  }

  if (!orderId) {
    res.status(400).json({ message: "orderId wajib diisi" });
    return;
  }

  const result = await syncPaymentStatus(orderId, userId);
  res.status(200).json({ success: true, data: result });
}
