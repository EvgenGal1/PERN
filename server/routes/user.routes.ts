import express /* , { Application } */ from "express";
const router /* : Application */ = express();

import UserController from "../controllers/user.controller";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";

// любой
router.post("/signup", UserController.signupUser);
router.post("/login", UserController.loginUser);
// USER
router.get("/check", authMiddleware, UserController.checkUser);
// ADMIN
router.get(
  "/getall",
  authMiddleware,
  adminMiddleware,
  UserController.getAllUser
);
router.get(
  "/getone/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  UserController.getOneUser
);
router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  UserController.createUser
);
router.put(
  "/update/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  UserController.updateUser
);
router.delete(
  "/delete/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  UserController.deleteUser
);

export default router;
