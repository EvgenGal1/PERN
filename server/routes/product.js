import express from "express";
import ProductController from "../controllers/Product.js";

const router = new express.Router();

// Стандартные
router.get("/getall", ProductController.getAll);
router.get("/getone/:id([0-9]+)", ProductController.getOne);
router.post("/create", ProductController.create);
router.put("/update/:id([0-9]+)", ProductController.update);
router.delete("/delete/:id([0-9]+)", ProductController.delete);

// Расширенные под фильтрацию
// ^ тесты GET для категорий и брендов - http://localhost:5050/api/product/getall/categoryId/3/brandId/4
// список товаров выбранной категории и выбранного бренда
router.get(
  "/getall/categoryId/:categoryId([0-9]+)/brandId/:brandId([0-9]+)",
  ProductController.getAll
);
// список товаров выбранной категории
router.get("/getall/categoryId/:categoryId([0-9]+)", ProductController.getAll);
// список товаров выбранного бренда
router.get("/getall/brandId/:brandId([0-9]+)", ProductController.getAll);

export default router;
