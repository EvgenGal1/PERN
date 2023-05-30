import express from "express";

import OrderController from "../controllers/Order.js";
import authMiddleware_Tok from "../middleware/authMiddleware_Tok.js";
import adminMiddleware_Tok from "../middleware/adminMiddleware_Tok.js";

const router = new express.Router();

/*
 * только для администратора магазина
 */

// получить список всех заказов магазина
router.get(
  "/admin/getall",
  authMiddleware_Tok,
  adminMiddleware_Tok,
  OrderController.adminGetAll
);
// получить список заказов пользователя
router.get(
  "/admin/getall/user/:id([0-9]+)",
  authMiddleware_Tok,
  adminMiddleware_Tok,
  OrderController.adminGetUser
);
// получить заказ по id
router.get(
  "/admin/getone/:id([0-9]+)",
  authMiddleware_Tok,
  adminMiddleware_Tok,
  OrderController.adminGetOne
);
// создать новый заказ
router.post(
  "/admin/create",
  authMiddleware_Tok,
  adminMiddleware_Tok,
  OrderController.adminCreate
);
// удалить заказ по id
router.delete(
  "/admin/delete/:id([0-9]+)",
  authMiddleware_Tok,
  adminMiddleware_Tok,
  OrderController.adminDelete
);

/*
 * для авторизованного пользователя
 */

// получить все заказы пользователя
router.get("/user/getall", authMiddleware_Tok, OrderController.userGetAll);
// получить один заказ пользователя
router.get(
  "/user/getone/:id([0-9]+)",
  authMiddleware_Tok,
  OrderController.userGetOne
);
// создать новый заказ
router.post("/user/create", authMiddleware_Tok, OrderController.userCreate);

/*
 * для неавторизованного пользователя
 */

// создать новый заказ
router.post("/guest/create", OrderController.guestCreate);

export default router;
