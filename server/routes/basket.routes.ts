import express /* , { Application } */ from "express";
const router /* : Application */ = express();

import BasketController from "../controllers/basket.controller";

router.get("/getone", BasketController.getOneBasket);
router.put(
  "/product/:productId([0-9]+)/append/:quantity([0-9]+)",
  BasketController.appendBasket
);
router.put(
  "/product/:productId([0-9]+)/increment/:quantity([0-9]+)",
  BasketController.incrementBasket
);
router.put(
  "/product/:productId([0-9]+)/decrement/:quantity([0-9]+)",
  BasketController.decrementBasket
);
router.put("/product/:productId([0-9]+)/remove", BasketController.removeBasket);
router.put("/clear", BasketController.clearBasket);

export default router;
