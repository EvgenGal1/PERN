// ^ от Tok
import express from "express";

const router = new express.Router();

router.get("/getall", (req, res) => {
  console.log("1 ", 1),
    console.log("getall ", res),
    res.status(200).send("Список всех категорий");
});
router.get("/getone/:id([0-9]+)", (req, res) => {
  console.log("2 ", 2),
    console.log("getone ", res),
    res.status(200).send("Получение одной категории");
});
router.post("/create", (req, res) => {
  console.log("2 ", 2),
    console.log("getone ", res),
    res.status(200).send("Создание новой категории");
});
router.put("/update/:id([0-9]+)", (req, res) =>
  res.status(200).send("Обновление категории")
);
router.delete("/delete/:id([0-9]+)", (req, res) =>
  res.status(200).send("Удаление категории")
);

export default router;

// ^ от UTV
// от ошб.повтор.объяв.перем в блоке
// export {};

// const Router = require("express");
// const router = new Router();
// const brandController = require("../controllers/brand.controller");
// подкл. middleware доступ ADMIN
// const checkRole = require("../middleware/checkRoleMiddleware");

// маршруты Категорий созд.,получ.всех,получ.индив.
// router.get("/", brandController.getAll);
// router.get("/:id", brandController.getOne);
// router.post("/", checkRole("SUPER", "ADMIN", "MODER"), brandController.create);
// router.put("/", checkRole("SUPER", "ADMIN", "MODER"), brandController.update);
// router.delete(
//   "/:id",
//   checkRole("SUPER", "ADMIN", "MODER"),
//   brandController.delOne
// );
// router.delete("/",   checkRole("SUPER", "ADMIN", "MODER"), brandController.delAll);

// module.exports = router;

// ^ СЛН. UTV и Tok
// ^ позже переделать под device, проверить необходимость отделн. пути для getall,getone,create

// router.get("/getall", (req, res) =>
//   res.status(200).send("Список всех категорий")
// );
// router.get("/getone/:id([0-9]+)", (req, res) =>
//   res.status(200).send("Получение одной категории")
// );
// router.post("/create", (req, res) =>
//   res.status(200).send("Создание новой категории")
// );
// router.put("/update/:id([0-9]+)", (req, res) =>
//   res.status(200).send("Обновление категории")
// );
// router.delete("/delete/:id([0-9]+)", (req, res) =>
//   res.status(200).send("Удаление категории")
// );

// module.exports = router;
