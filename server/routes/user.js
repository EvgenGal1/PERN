import express from "express";

import UserController from "../controllers/User.js";
import authMiddleware_Tok from "../middleware/authMiddleware_Tok.js";
import adminMiddleware_Tok from "../middleware/adminMiddleware_Tok.js";

const router = new express.Router();

router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.get("/check", authMiddleware_Tok, UserController.check);

router.get(
  "/getall",
  authMiddleware_Tok,
  adminMiddleware_Tok,
  UserController.getAll
);
router.get(
  "/getone/:id([0-9]+)",
  authMiddleware_Tok,
  adminMiddleware_Tok,
  UserController.getOne
);
router.post(
  "/create",
  authMiddleware_Tok,
  adminMiddleware_Tok,
  UserController.create
);
router.put(
  "/update/:id([0-9]+)",
  authMiddleware_Tok,
  adminMiddleware_Tok,
  UserController.update
);
router.delete(
  "/delete/:id([0-9]+)",
  authMiddleware_Tok,
  adminMiddleware_Tok,
  UserController.delete
);

export default router;
