// const Router = require("express");
// const router = new Router();
import express /* , { Application } */ from "express";
const router /* : Application */ = express();

import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";
import CategoryController from "../controllers/сategory.controller";
// ! разбор из UTV
// const checkRole = require("../middleware/checkRoleMiddleware");
// const brandController = require("../controllers/brand.controller");

router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  CategoryController.createCategory
);
router.get("/getone/:id([0-9]+)", CategoryController.getOneCategory);
router.get("/getall", CategoryController.getAllCategory);
router.put(
  "/update/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  CategoryController.updateCategory
);
router.delete(
  "/delete/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  CategoryController.deleteCategory
);

export default router;
