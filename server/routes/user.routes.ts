import express /* , { Application } */ from "express";
const router /* : Application */ = express();
// подкл. валидацию
const { check } = require("express-validator");

import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";
// подкл. middleware доступов
// const checkRole = require("../middleware/checkRoleMiddleware");
import UserController from "../controllers/user.controller";

// любой
router.post(
  "/signup",
  // проверки валидации // ? шаблоны проверки, сам код в controllere
  [
    // валидация. normalize не пропускает RU email е/и записаны в ВерБлюд стиле.
    check("email", "Некорректый email").isEmail().normalizeEmail(),
    check("password")
      .not()
      .isIn([
        "123qwe",
        "123qwerty",
        "qwerty",
        "qwe123",
        "qwerty123",
        "123456",
        "password123",
        "god123",
      ])
      .withMessage("Не используйте обычные значения в качестве пароля")
      .isLength({ min: 6 })
      .withMessage("Минимальная длина пароля 6 символов")
      .isLength({ max: 32 })
      .withMessage("Максимальная длина пароля 32 символа")
      .matches(/\d/)
      .withMessage("Пароль должен содержать число"),
  ],
  UserController.signupUser
);
router.post(
  "/login",
  [check("email", "Некорректый email на входе").isEmail().normalizeEmail()],
  UserController.loginUser
);
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
