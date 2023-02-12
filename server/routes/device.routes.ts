// от ошб.повтор.объяв.перем в блоке
export {};

const Router = require("express");
const router = new Router();
const deviceController = require("../controllers/device.controller");
// подкл. middleware Ролей
const checkRole = require("../middleware/checkRoleMiddleware");

// маршруты Устройства созд.,получ.всех,получ.индив.
router.post("/", checkRole("SUPER", "ADMIN", "MODER"), deviceController.create);
router.get("/", deviceController.getAll);
router.get("/:id", deviceController.getOne);
router.put("/", checkRole("SUPER", "ADMIN", "MODER"), deviceController.update);
router.get("/", checkRole("SUPER", "ADMIN", "MODER"), deviceController.delAll);
router.delete(
  "/:id",
  checkRole("SUPER", "ADMIN", "MODER"),
  deviceController.delOne
);

module.exports = router;
