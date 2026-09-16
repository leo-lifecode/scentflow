import { Request, Response } from "express";
import { processPaymentNotification } from "../services/payment.service";

export async function paymentNotificationController(req: Request, res: Response) {
  const notification = req.body;
  const orderId = notification.order_id;

  if (!orderId) {
    res.status(400).json({ success: false, message: "order_id wajib diisi" });
    return;
  }

  if (orderId.startsWith("payment_notif_test_")) {
    res.status(200).json({ status: "success", message: "Test notification received" });
    return;
  }

  await processPaymentNotification(notification);

  res.status(200).json({
    success: true,
    status: "OK",
    message: "Notifikasi pembayaran berhasil diproses",
  });
}
