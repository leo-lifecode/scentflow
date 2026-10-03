import { Router } from "express";
import { createCheckoutController } from "../controllers/checkout.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { checkoutSchema } from "../validators/checkout.validator";

const router = Router();

router.post(
  "/",
  requireAuth,
  validate(checkoutSchema),
  createCheckoutController
);

export default router;
