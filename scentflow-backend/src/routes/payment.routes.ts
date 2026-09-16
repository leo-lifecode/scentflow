import { Router } from "express";
import { paymentNotificationController } from "../controllers/payment.controller";

const router = Router();

router.post("/notification", paymentNotificationController);

export default router;
