const Router = require("express");
const router = new Router();
const typeController = require("../controllers/type.controller");
// const checkRole = require("../middleware/checkRoleMiddleware");

// маршруты Типа созд.,получ.всех,получ.индив.
router.post("/", /* checkRole("ADMIN"), */ typeController.create);
router.get("/", typeController.getAll);
router.get("/:id", typeController.getOne);
router.put("/", typeController.update);
router.get("/", typeController.delAll);
router.delete("/:id", typeController.delOne);

module.exports = router;
