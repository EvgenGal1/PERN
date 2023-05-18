// ^ Tok. Маршрутизатор всех маршрутов приложения (подобие allRoutes)
import express from "express";

import product from "./product.js";
import category from "./category.js";
import brand from "./brand.js";
import user from "./user.js";
import basket from "./basket.js";

const router = new express.Router();

router.use("/product", product);
router.use("/category", category);
router.use("/brand", brand);
router.use("/user", user);
router.use("/basket", basket);

export default router;
