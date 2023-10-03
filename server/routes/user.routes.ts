import express /* , { Application } */ from "express";
const router /* : Application */ = express();
// подкл. валидацию
const { check } = require("express-validator");

import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";
// подкл. middleware доступов
// const checkRole = require("../middleware/checkRoleMiddleware");
import UserController from "../controllers/user.controller";

// любой Пользователь
// РЕГИСТРАЦИЯ
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
        "123qwe!@#",
        "123!@#qwe",
        "!@#123qwe",
        "!@#qwe123",
        "qwe!@#123",
        "qwe123!@#",
        "123Qwe!@#",
        "123!@#Qwe",
        "!@#123Qwe",
        "!@#Qwe123",
        "Qwe!@#123",
        "Qwe123!@#",
      ])
      .withMessage("Не используйте обычные значения в качестве пароля")
      .isLength({ min: 6 })
      .withMessage("Минимальная длина пароля 6 символов")
      .isLength({ max: 32 })
      .withMessage("Максимальная длина пароля 32 символа")
      .matches(/\d/)
      .withMessage("Пароль должен содержать число")
      .matches(/(?=(.*\W){2})/)
      .withMessage("Где два специальных символа"),
  ],
  UserController.signupUser
);
// АВТОРИЗАЦИЯ
router.post(
  "/login",
  [check("email", "Некорректый email на входе").isEmail().normalizeEmail()],
  UserController.loginUser
);

// USER Пользователь
// АКТИВАЦИЯ АКАУНТА. По ссылке в почту
router.get("/activate/:link", UserController.activateUser);
// ПЕРЕЗАПИСЬ ACCESS токен. Отправ.refresh, получ.access и refresh
router.get("/refresh", UserController.refreshUser);
// ПРОВЕРКА | auth
router.get("/check", authMiddleware, UserController.checkUser);
// ВЫХОД. Удален.Token.refreshToken
router.post("/logout", UserController.logoutUser);

// ADMIN Пользователь
router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  UserController.createUser
);
router.get(
  "/getone/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  UserController.getOneUser
);
router.get(
  "/getall",
  authMiddleware,
  adminMiddleware,
  UserController.getAllUser
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
