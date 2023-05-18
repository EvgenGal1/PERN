import express from "express";
import CategoryController from "../controllers/Category.js";
import authMiddleware_Tok from "../middleware/authMiddleware_Tok.js";
import adminMiddleware_Tok from "../middleware/adminMiddleware_Tok.js";

const router = new express.Router();

router.get("/getall", CategoryController.getAll);
router.get("/getone/:id([0-9]+)", CategoryController.getOne);
router.post(
  "/create",
  authMiddleware_Tok,
  adminMiddleware_Tok,
  CategoryController.create
);
router.put(
  "/update/:id([0-9]+)",
  authMiddleware_Tok,
  adminMiddleware_Tok,
  CategoryController.update
);
router.delete(
  "/delete/:id([0-9]+)",
  authMiddleware_Tok,
  adminMiddleware_Tok,
  CategoryController.delete
);

export default router;
