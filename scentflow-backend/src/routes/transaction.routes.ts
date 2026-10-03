import { Router } from "express";
import { getTransactionsController } from "../controllers/transaction.controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, requireRole("admin"), getTransactionsController);

export default router;
