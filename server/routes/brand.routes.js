const Router = require("express");
const router = new Router();
// const brandController = require("../controllers/brand.controller");

// маршруты Бренда созд.,получ.всех
router.post("/" /* , brandController.create */);
router.get("/" /* , brandController.getAll */);

// ^ нужно прописать удалени конкретного и всех в brand.controller

module.exports = router;
