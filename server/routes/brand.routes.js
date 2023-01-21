const Router = require("express");
const router = new Router();
const brandController = require("../controllers/brand.controller");
// подкл. middleware доступ ADMIN
const checkRole = require("../middleware/checkRoleMiddleware");

// маршруты Бренда созд.,получ.всех,получ.индив.
router.post("/", checkRole("SUPERADMIN", "ADMIN"), brandController.create);
router.get("/", brandController.getAll);
router.get("/:id", brandController.getOne);
router.put("/", checkRole("SUPERADMIN", "ADMIN"), brandController.update);
router.delete("/:id", checkRole("SUPERADMIN", "ADMIN"), brandController.delOne);
// router.get("/", brandController.delAll);

module.exports = router;
