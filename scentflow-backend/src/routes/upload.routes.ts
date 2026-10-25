import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { uploadProductImage } from "../controllers/upload.controller";

const router = Router();
router.post("/product-image", requireAuth, requireRole("admin"), uploadProductImage);
export default router;