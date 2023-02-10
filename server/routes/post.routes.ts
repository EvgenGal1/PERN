// ^ маршрутизатор запросов постов

// от ошб.повтор.объяв.перем в блоке
export {};

// подкл. Маршрутизатор
const Router = require("express");
// созд. объ.кл.Маршрутизатор. Возможно прослуш.запросов (GET, POST, DELETE,..)
const router = new Router();
// подкл. fn взаим-ия с польз.
const postControllers = require("../controllers/post.controllers");
// подкл. middleware доступ ADMIN
const checkRole = require("../middleware/checkRoleMiddleware");

// опред.марщрутов для отраб.post/
router.post(
  "/",
  checkRole("SUPER", "ADMIN", "MODER"),
  postControllers.createPost
);
router.get("/id", postControllers.getPostById);
router.get("/:id", postControllers.getOnePost);
router.get("/", postControllers.getAllPost);
router.put("/", checkRole("SUPER", "ADMIN", "MODER"), postControllers.updPost);
router.delete(
  "/:id",
  checkRole("SUPER", "ADMIN", "MODER"),
  postControllers.delPost
);

// экспорт объ.Маршрутизатора
module.exports = router;
