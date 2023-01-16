const Router = require("express");
const router = new Router();
const typeController = require("../controllers/type.controller");
// const checkRole = require("../middleware/checkRoleMiddleware");

// маршруты Типа созд.,получ.всех
router.post("/", /* checkRole("ADMIN"), */ typeController.create);
router.get("/", typeController.getAll);

module.exports = router;
