import express /* , { Application } */ from "express";
const router /* : Application */ = express();

import UserController from "../controllers/user.controller";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";

router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.get("/check", authMiddleware, UserController.check);

router.get("/getall", authMiddleware, adminMiddleware, UserController.getAll);
router.get(
  "/getone/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  UserController.getOne
);
router.post("/create", authMiddleware, adminMiddleware, UserController.create);
router.put(
  "/update/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  UserController.update
);
router.delete(
  "/delete/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  UserController.delete
);

export default router;
