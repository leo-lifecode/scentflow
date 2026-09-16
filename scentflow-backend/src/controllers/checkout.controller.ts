import { Request, Response } from "express";
import { createCheckout } from "../services/checkout.service";
import { CheckoutInput } from "../validators/checkout.validator";

export async function createCheckoutController(req: Request, res: Response) {
  const { customer_name, customer_email, items } = req.body as CheckoutInput;

  const data = await createCheckout({
    customer_name,
    customer_email,
    items,
  });

  res.status(201).json({
    success: true,
    message: "Pesanan berhasil dilakukan",
    data,
  });
}
