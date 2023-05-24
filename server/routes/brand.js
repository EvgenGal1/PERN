import express from "express";

import BrandController from "../controllers/Brand.js";
import authMiddleware_Tok from "../middleware/authMiddleware_Tok.js";
import adminMiddleware_Tok from "../middleware/adminMiddleware_Tok.js";

const router = new express.Router();

router.get("/getall", BrandController.getAll);
router.get("/getone/:id([0-9]+)", BrandController.getOne);
router.post(
  "/create",
  authMiddleware_Tok,
  adminMiddleware_Tok,
  BrandController.create
);
router.put(
  "/update/:id([0-9]+)",
  authMiddleware_Tok,
  adminMiddleware_Tok,
  BrandController.update
);
router.delete(
  "/delete/:id([0-9]+)",
  authMiddleware_Tok,
  adminMiddleware_Tok,
  BrandController.delete
);

export default router;
