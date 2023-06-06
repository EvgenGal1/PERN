// const Router = require("express");
// const router = new Router();
import express /* , { Application } */ from "express";
const router /* : Application */ = express();

import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";
import ProductController from "../controllers/product.controller";
import ProductPropController from "../controllers/productProp.controller";

/*
 * Товары
 */

// ^ Расширенные под фильтрацию. тесты GET для категорий и брендов - http://localhost:5050/api/product/getall/categoryId/3/brandId/4
// список товаров выбранной категории и выбранного бренда
router.get(
  "/getall/categoryId/:categoryId([0-9]+)/brandId/:brandId([0-9]+)",
  ProductController.getAll
);
// список товаров выбранной категории
router.get("/getall/categoryId/:categoryId([0-9]+)", ProductController.getAll);
// список товаров выбранного бренда
router.get("/getall/brandId/:brandId([0-9]+)", ProductController.getAll);

// ^ Стандартные
// список всех товаров каталога
router.get("/getall", ProductController.getAll);
// получить один товар каталога
router.get("/getone/:id([0-9]+)", ProductController.getOne);
// создать товар каталога — нужны права администратора
router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  ProductController.create
);
// обновить товар каталога  — нужны права администратора
router.put(
  "/update/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  ProductController.update
);
// удалить товар каталога  — нужны права администратора
router.delete(
  "/delete/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  ProductController.delete
);

/*
 * Свойства
 */

// список свойств товара
router.get("/:productId([0-9]+)/property/getall", ProductPropController.getAll);
// одно свойство товара
router.get(
  "/:productId([0-9]+)/property/getone/:id([0-9]+)",
  ProductPropController.getOne
);
// создать свойство товара
router.post(
  "/:productId([0-9]+)/property/create",
  authMiddleware,
  adminMiddleware,
  ProductPropController.create
);
// обновить свойство товара
router.put(
  "/:productId([0-9]+)/property/update/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  ProductPropController.update
);
// удалить свойство товара
router.delete(
  "/:productId([0-9]+)/property/delete/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  ProductPropController.delete
);

export default router;
