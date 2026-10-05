import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getProductsController,
  updateProductController,
} from "../controllers/product.controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getProductsController);
router.post("/", requireAuth, requireRole("admin"), createProductController);
router.put("/:id", requireAuth, requireRole("admin"), updateProductController);
router.delete("/:id", requireAuth, requireRole("admin"), deleteProductController);

export default router;
