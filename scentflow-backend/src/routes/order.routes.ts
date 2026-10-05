import { Router } from "express";
import { getMyOrdersController } from "../controllers/order.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, getMyOrdersController);

export default router;
