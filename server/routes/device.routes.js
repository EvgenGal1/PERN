const Router = require("express");
const router = new Router();
const deviceController = require("../controllers/device.controller");

// маршруты Устройства созд.,получ.всех,получ.индив.
router.post("/", deviceController.create);
router.get("/", deviceController.getAll);
router.get("/:id", deviceController.getOne);
// router.put("/", deviceController.update);
// router.get("/", deviceController.delAll);
// router.delete("/:id", deviceController.delOne);

module.exports = router;
