// маршрутизатор запросов

// подкл. Маршрутизатор
const Router = require("express");
// созд. объ.кл.Маршрутизатор. Возможно прослуш.запросов (GET, POST, DELETE,..)
const router = new Router();
// подкл. fn взаим-ия с польз.
const userontroller = require("../controllers/user.controller");

// опред.марщрутов для отраб.
router.post("/user", userontroller.createUser);
router.get("/user", userontroller.getUser);
router.get("/user/:id", userontroller.getOneUser);
router.put("/user", userontroller.updateUser);
router.delete("/user/:id", userontroller.deleteUser);

// экспорт объ.Маршрутизатора
module.exports = router;
