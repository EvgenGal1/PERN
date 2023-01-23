// маршрутизатор всех маршрутов приложения

const Router = require("express");
const router = new Router();

const authRouter = require("./auth.routes");
const deviceRouter = require("./device.routes");
const userRouter = require("./user.routes");
const brandRouter = require("./brand.routes");
const typeRouter = require("./type.routes");

// вызов подроутеры ч/з use
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/type", typeRouter);
router.use("/brand", brandRouter);
router.use("/device", deviceRouter);

module.exports = router;
