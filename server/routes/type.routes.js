const Router = require("express");
const router = new Router();
const typeController = require("../controllers/type.controller");
// подкл. middleware доступ ADMIN
const checkRole = require("../middleware/checkRoleMiddleware");

// маршруты Типа созд.,получ.всех,получ.индив.
// довить только для админ
router.post("/", checkRole("SUPER", "ADMIN", "MODER"), typeController.create);
router.get("/", typeController.getAll);
router.get("/:id", typeController.getOne);
router.put("/", checkRole("SUPER", "ADMIN", "MODER"), typeController.update);
router.delete(
  "/:id",
  checkRole("SUPER", "ADMIN", "MODER"),
  typeController.delOne
);
// router.delete("/",   checkRole("SUPER", "ADMIN", "MODER"),typeController.delAll);

module.exports = router;
