const Router = require("express");
const router = new Router();
const brandController = require("../controllers/brand.controller");
// подкл. middleware доступ ADMIN
const checkRole = require("../middleware/checkRoleMiddleware");

// маршруты Бренда созд.,получ.всех,получ.индив.
router.post("/", checkRole("ADMIN"), brandController.create);
router.get("/", brandController.getAll);
router.get("/:id", brandController.getOne);
// router.put("/", brandController.update);
// router.get("/", brandController.delAll);
// router.delete("/:id", brandController.delOne);

module.exports = router;
