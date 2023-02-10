// ^^ маршрутизатор всех маршрутов приложения

// от ошб.повтор.объяв.перем в блоке
export {};

const Router = require("express");
const router = new Router();

const authRouter = require("./auth.routes");
const userRouter = require("./user.routes");
const typeRouter = require("./type.routes");
const brandRouter = require("./brand.routes");
const deviceRouter = require("./device.routes");
const postRouter = require("./post.routes");

// вызов подроутеры ч/з use
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/type", typeRouter);
router.use("/brand", brandRouter);
router.use("/device", deviceRouter);
router.use("/posts", postRouter);

module.exports = router;
