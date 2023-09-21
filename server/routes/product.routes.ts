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
  // "/getall/categoryId/:categoryId([0-9]+)/brandId/:brandId([0-9]+)",
  // ^ запрос под неск.парам.ч/з запятую (,? - опциональная запятая, * - 0 и более повторений, + - 1 и более повторений)
  "/getall/categoryId/:categoryId(,?[0-9]+*)/brandId/:brandId(,?[0-9]+*)",
  ProductController.getAllProduct
);
// список товаров выбранной категории
router.get(
  // "/getall/categoryId/:categoryId([0-9]+)",
  "/getall/categoryId/:categoryId(,?[0-9]+*)",
  ProductController.getAllProduct
);
// список товаров выбранного бренда
router.get(
  // "/getall/brandId/:brandId([0-9]+)",
  "/getall/brandId/:brandId(,?[0-9]+*)",
  ProductController.getAllProduct
);

// ^ Стандартные
// список всех товаров каталога
router.get("/getall", ProductController.getAllProduct);
// получить один товар каталога
router.get("/getone/:id([0-9]+)", ProductController.getOneProduct);
// создать товар каталога — нужны права администратора
router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  ProductController.createProduct
);
// обновить товар каталога  — нужны права администратора
router.put(
  "/update/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  ProductController.updateProduct
);
// удалить товар каталога  — нужны права администратора
router.delete(
  "/delete/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  ProductController.deleteProduct
);

/*
 * Свойства
 */

// список свойств товара
router.get(
  "/:productId([0-9]+)/property/getall",
  ProductPropController.getAllProdProp
);
// одно свойство товара
router.get(
  "/:productId([0-9]+)/property/getone/:id([0-9]+)",
  ProductPropController.getOneProdProp
);
// создать свойство товара
router.post(
  "/:productId([0-9]+)/property/create",
  authMiddleware,
  adminMiddleware,
  ProductPropController.createProdProp
);
// обновить свойство товара
router.put(
  "/:productId([0-9]+)/property/update/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  ProductPropController.updateProdProp
);
// удалить свойство товара
router.delete(
  "/:productId([0-9]+)/property/delete/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  ProductPropController.deleteProdProp
);

export default router;
