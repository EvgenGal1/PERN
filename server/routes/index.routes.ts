// ^ Tok. Маршрутизатор всех маршрутов приложения (подобие allRoutes)
export {};

import express from "express";

import product from "./product.routes";
import category from "./category.routes";
import brand from "./brand.routes";
import user from "./user.routes";
import basket from "./basket.routes";
import order from "./order.routes";
import rating from "./rating.routes";

const router = express.Router();

router.use("/product", product);
router.use("/category", category);
router.use("/brand", brand);
router.use("/user", user);
router.use("/basket", basket);
router.use("/order", order);
router.use("/rating", rating);

export default router;
