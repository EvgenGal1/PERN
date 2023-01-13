// маршрутизатор запросов

// подкл. Маршрутизатор
const Router = require("express");
// подкл. fn взаим-ия с польз.
const userСontrollers = require("../controllers/user.controllers");
// подкл. валидацию
const { check } = require("express-validator");

// созд. объ.кл.Маршрутизатор. Возможно прослуш.запросов (GET, POST, DELETE,..)
const router = new Router();

// опред.марщрутов для отраб.
router.post(
  "/user",
  // масс. middleware для валидации. `Проверка`(чего,ошб.).валидатор(на email) | ~кастом - проверка(чего).условие.смс ошб.
  [
    check("email", "Некорректый email").isEmail(),
    // ! врем.откл. в Postman приходят ошб. на пароль когда его даже нет в ~модели запроса
    // check("password")
    //   // .not()
    //   .isIn(["123", "password123", "god123", "qwerty123", "123qwerty"])
    //   .withMessage("Не используйте обычные значения в качестве пароля")
    //   .isLength({ min: 6 })
    //   .withMessage("Минимальная длина пароля 6 символов")
    //   .matches(/\d/)
    //   .withMessage("Пароль должен содержать число"),
  ],
  // fn отработки логики. trycatch переехал в controller.register
  userСontrollers.createUser
);
router.get("/user", userСontrollers.getUser);
router.get("/user/:id", userСontrollers.getOneUser);
router.put("/user", userСontrollers.updateUser);
router.delete("/user/:id", userСontrollers.deleteUser);

// экспорт объ.Маршрутизатора
module.exports = router;
