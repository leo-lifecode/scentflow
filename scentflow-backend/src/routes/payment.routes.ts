import { Router } from "express";
import { paymentNotificationController } from "../controllers/payment.controller";
import { syncPaymentStatusController } from "../controllers/payment-status.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/notification", paymentNotificationController);
router.get("/:orderId/status", requireAuth, syncPaymentStatusController);

export default router;
