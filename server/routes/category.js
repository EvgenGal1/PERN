import express from "express";
import CategoryController from "../controllers/Category.js";

const router = new express.Router();

router.get("/getall", CategoryController.getAll);
router.get("/getone/:id([0-9]+)", CategoryController.getOne);
router.post("/create", CategoryController.create);
router.put("/update/:id([0-9]+)", CategoryController.update);
router.delete("/delete/:id([0-9]+)", CategoryController.delete);

export default router;
