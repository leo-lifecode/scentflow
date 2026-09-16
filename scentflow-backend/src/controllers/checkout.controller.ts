import { Request, Response } from "express";
import { createCheckout } from "../services/checkout.service";

export async function createCheckoutController(req: Request, res: Response) {
  const { customer_name, customer_email, items } = req.body;

  if (
    !customer_name ||
    !customer_email ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    res.status(400).json({ success: false, message: "Data tidak lengkap" });
    return;
  }

  const data = await createCheckout({ customer_name, customer_email, items });

  res.status(201).json({
    success: true,
    message: "Pesanan berhasil dilakukan",
    data,
  });
}
