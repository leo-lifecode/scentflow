import { Router } from "express";
import { createCheckoutController } from "../controllers/checkout.controller";
import { validate } from "../middleware/validate.middleware";
import { checkoutSchema } from "../validators/checkout.validator";

const router = Router();

router.post(
  "/",
  validate(checkoutSchema),
  createCheckoutController
);

export default router;