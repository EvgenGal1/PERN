// от ошб.повтор.объяв.перем в блоке
export {};

const Router = require("express");
const router = new Router();
const brandController = require("../controllers/brand.controller");
// подкл. middleware доступ ADMIN
const checkRole = require("../middleware/checkRoleMiddleware");

// маршруты Бренда созд.,получ.всех,получ.индив.
router.post("/", checkRole("SUPER", "ADMIN", "MODER"), brandController.create);
router.get("/", brandController.getAll);
router.get("/:id", brandController.getOne);
router.put("/", checkRole("SUPER", "ADMIN", "MODER"), brandController.update);
router.delete(
  "/:id",
  checkRole("SUPER", "ADMIN", "MODER"),
  brandController.delOne
);
// router.delete("/",   checkRole("SUPER", "ADMIN", "MODER"), brandController.delAll);

module.exports = router;
