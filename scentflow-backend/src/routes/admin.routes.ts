import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { listAdminCustomers, listAdminOrders, updateOrderShipping } from "../controllers/admin.controller";

const router = Router();
router.use(requireAuth, requireRole("admin"));
router.get("/orders", listAdminOrders);
router.patch("/orders/:id/shipping", updateOrderShipping);
router.get("/customers", listAdminCustomers);
export default router;