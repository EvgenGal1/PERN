// ^^ маршрутизатор запросов пользователей

// от ошб.повтор.объяв.перем в блоке
export {};

// подкл. Маршрутизатор
const Router = require("express");
// подкл. fn взаим-ия с польз.
const userСontrollers = require("../controllers/user.controllers");
// подкл. валидацию
const { check } = require("express-validator");
const exprsValid = require("../middleware/exprsValid.js");

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
  userСontrollers.createUserNPg
);
router.get("/userNPg", userСontrollers.getUserNPg);
router.get("/userNPg/:id", userСontrollers.getOneUserNPg);
router.put("/userNPg", userСontrollers.updateUserNPg);
router.delete("/userNPg/:id", userСontrollers.deleteUserNPg);

// ^ ++++ EvGen
router.get(
  "/userPERN/:id",
  // checkRole(["SUPER", "ADMIN", "MODER"]),
  userСontrollers.getOneUserPERN
);

router.get(
  "/userPERN",
  checkRole("SUPER", "ADMIN", "MODER"),
  // authMiddleware,
  userСontrollers.getAllUserPERN
);

router.put(
  "/userPERN",
  checkRole("SUPER", "ADMIN", "MODER"),
  userСontrollers.updateUserPERN
);

router.delete(
  "/userPERN/:id",
  checkRole("SUPER", "ADMIN", "MODER"),
  userСontrollers.deleteUserPERN
);

// экспорт объ.Маршрутизатора
module.exports = router;
