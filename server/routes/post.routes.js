// маршрутизатор запросов постов

// подкл. Маршрутизатор
const Router = require("express");
// подкл. fn взаим-ия с польз.
const postControllers = require("../controllers/post.controllers");

// созд. объ.кл.Маршрутизатор. Возможно прослуш.запросов (GET, POST, DELETE,..)
const router = new Router();

// опред.марщрутов для отраб.
router.post("/post", postControllers.createPost);
router.get("/post", postControllers.getPostByUser);

// экспорт объ.Маршрутизатора
module.exports = router;
