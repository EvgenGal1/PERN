const Router = require("express");
const router = new Router();
const authControllers = require("../controllers/auth.controllers");
// подкл. валидацию
const { check } = require("express-validator");
// const exprsValid = require("../middleware/exprsValid");
// подкл.декодер.токен,проверка валидности
const authMiddleware = require("../middleware/authMiddleware");
// подкл. middleware доступ ADMIN
const checkRole = require("../middleware/checkRoleMiddleware");

// ^ ++++ UlbiTV.PERNstore
// опред.марщрутов|мтд. для отраб. Ригистр.,Авториз.,проверка на Авториз. по jwt токену(2ой парам.)
// РЕГИСТРАЦИЯ
router.post(
  "/registration",
  // exprsValid
  [
    // валидация. normalize не пропускает RU email е/и записаны в ВерБлюд стиле.
    check("email", "Некорректый email").isEmail().normalizeEmail(),
    check("password")
      .not()
      .isIn([
        "123qwe",
        "123qwerty",
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
  authControllers.registration
);

// АВТОРИЗАЦИЯ
router.post(
  "/login",
  // exprsValid
  [check("email", "Некорректый email").isEmail().normalizeEmail()],
  authControllers.login
);

// ВЫХОД. Удален.Token.refreshToken
router.post("/logout", authControllers.logout);

// АКТИВАЦИЯ АКАУНТА. По ссылке в почту
router.get("/activate/:link", authControllers.activate);

// ПЕРЕЗАПИСЬ ACCESS токен. Отправ.refresh, получ.access и refresh
router.get("/refresh", authControllers.refresh);

// ПРОВЕРКА | auth // ^ удалить или уровнять с login
router.get("/", authMiddleware, authControllers.check);

// ~ врем.из User.contrl,serv Получ.всех польз.
router.get(
  "/users",
  checkRole("SUPER", "ADMIN", "MODER"),
  // authMiddleware,
  authControllers.getAllUsers
);

module.exports = router;
