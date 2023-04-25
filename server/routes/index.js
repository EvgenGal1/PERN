// ^ Tok. Маршрутизатор всех маршрутов приложения (подобие allRoutes)
import express from "express";
// import product from "./product.routes.js";
import category from "./category.routes.js";
// import brand from "./brand.routes.js";
// import user from "./user.routes.js";

const router = new express.Router();

// router.use("/product", product);
router.use("/category", category);
// router.use("/brand", brand);
// router.use("/user", user);

export default router;
