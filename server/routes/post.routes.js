// маршрутизатор запросов постов

// подкл. Маршрутизатор
const Router = require("express");
// подкл. fn взаим-ия с польз.
const postControllers = require("../controllers/post.controllers");

// созд. объ.кл.Маршрутизатор. Возможно прослуш.запросов (GET, POST, DELETE,..)
const router = new Router();

// опред.марщрутов для отраб.post/
router.post("/", postControllers.createPost);
router.get("/id", postControllers.getPostById);
router.get("/", postControllers.getAllPost);
router.get("/:id", postControllers.getOnePost);
router.put("/", postControllers.updPost);
router.delete("/:id", postControllers.delPost);

// экспорт объ.Маршрутизатора
module.exports = router;
