import { Response } from "express";
import { createCheckout } from "../services/checkout.service";
import { CheckoutInput } from "../validators/checkout.validator";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export async function createCheckoutController(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ message: "Authentication diperlukan" });
    return;
  }

  const { customer_name, customer_email, items } = req.body as CheckoutInput;

  const data = await createCheckout({
    user_id: req.user.id,
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
