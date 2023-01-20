// маршрутизатор запросов пользователей

// подкл. Маршрутизатор
const Router = require("express");
// подкл. fn взаим-ия с польз.
const userСontrollers = require("../controllers/user.controllers");
// подкл. валидацию
const { check } = require("express-validator");
const exprsValid = require("../middleware/exprsValid");

// ^ ++++ UlbiTV.PERNstore
// подкл.декодер.токен,проверка валидности
const authMiddleware = require("../middleware/authMiddleware");
// подкл. middleware доступ ADMIN
const checkRole = require("../middleware/checkRoleMiddleware");

// созд. объ.кл.Маршрутизатор. Возможно прослуш.запросов (GET, POST, DELETE,..)
const router = new Router();

// ^ ++++ UlbiTV. NPg
// конкатен.марщрутов|масс.валид.|мтд.для отраб.
router.post(
  "/userNPg",
  // масс. middleware для валидации.
  // ! не раб из Переезд в exprsValid
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
      .isLength({ max: 20 })
      .withMessage("Максимальная длина пароля 6 символов")
      .matches(/\d/)
      .withMessage("Пароль должен содержать число"),
  ],
  // fn отработки логики. trycatch переехал в controller.register
  userСontrollers.createUser
);
router.get("/userNPg", userСontrollers.getUser);
router.get("/userNPg/:id", userСontrollers.getOneUser);
router.put("/userNPg", userСontrollers.updateUser);
router.delete("/userNPg/:id", userСontrollers.deleteUser);

// ^ ++++ UlbiTV.PERNstore
// опред.марщрутов|мтд. для отраб. Ригистр.,Авториз.,проверка на Авториз. по jwt токену(2ой парам.)
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
      .isLength({ max: 20 })
      .withMessage("Максимальная длина пароля 6 символов")
      .matches(/\d/)
      .withMessage("Пароль должен содержать число"),
  ],
  userСontrollers.registration
);
router.post(
  "/login",
  // exprsValid
  [check("email", "Некорректый email").isEmail().normalizeEmail()],
  userСontrollers.login
);
router.get("/auth", authMiddleware, userСontrollers.check);

router.get(
  "/userPERN/:id",
  authMiddleware,
  // checkRole("SUPERADMIN", "ADMIN", "MODER"),
  userСontrollers.userPERN
);
router.get(
  "/userPERN",
  // authMiddleware,
  checkRole(["SUPERADMIN"]), //, "SUPERADMIN"
  userСontrollers.usersPERN
);

// экспорт объ.Маршрутизатора
module.exports = router;
