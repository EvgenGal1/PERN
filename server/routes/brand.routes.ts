import express /* , { Application } */ from "express";
const router /* : Application */ = express();

import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";
import BrandController from "../controllers/brand.controller";

router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  BrandController.createBrand
);
router.get("/getone/:id([0-9]+)", BrandController.getOneBrand);
router.get("/getall", BrandController.getAllBrand);
router.put(
  "/update/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  BrandController.updateBrand
);
router.delete(
  "/delete/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  BrandController.deleteBrand
);

export default router;
