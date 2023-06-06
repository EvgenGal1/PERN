import express /* , { Application } */ from "express";
const router /* : Application */ = express();

import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";
import BrandController from "../controllers/brand.controller";

router.get("/getall", BrandController.getAll);
router.get("/getone/:id([0-9]+)", BrandController.getOne);
router.post("/create", authMiddleware, adminMiddleware, BrandController.create);
router.put(
  "/update/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  BrandController.update
);
router.delete(
  "/delete/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  BrandController.delete
);

export default router;
