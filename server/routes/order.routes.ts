import express /* , { Application } */ from "express";
const router /* : Application */ = express();

import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";
import OrderController from "../controllers/order.controller";
import OrderItemsController from "../controllers/orderItems.controller";

/*
 * ЗАКАЗЫ для ADNIN магазина
 */

// получить список всех заказов магазина
router.get(
  "/admin/getall",
  authMiddleware,
  adminMiddleware,
  OrderController.adminGetAll
);
// получить список заказов пользователя
router.get(
  "/admin/getall/user/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  OrderController.adminGetUser
);
// получить заказ по id
router.get(
  "/admin/getone/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  OrderController.adminGetOne
);
// создать новый заказ
router.post(
  "/admin/create",
  authMiddleware,
  adminMiddleware,
  OrderController.adminCreate
);
// обновить заказ
router.put(
  "/admin/update/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  OrderController.adminUpdate
);
// удалить заказ по id
router.delete(
  "/admin/delete/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  OrderController.adminDelete
);

/*
 * ПОЗИЦИИ Заказа
 */
// список позицый заказа
router.get("/:orderId([0-9]+)/item/getall", OrderItemsController.getAll);
// одна позиция заказа
router.get(
  "/:orderId([0-9]+)/item/getone/:id([0-9]+)",
  OrderItemsController.getOne
);
// создать позицию заказа
router.post(
  "/:orderId([0-9]+)/item/create",
  authMiddleware,
  adminMiddleware,
  OrderItemsController.create
);
// обновить позицию заказа
router.put(
  "/:orderId([0-9]+)/item/update/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  OrderItemsController.update
);
// удалить позицию заказа
router.delete(
  "/:orderId([0-9]+)/item/delete/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  OrderItemsController.delete
);

/*
 * для авторизованного пользователя
 */

// получить все заказы пользователя
router.get("/user/getall", authMiddleware, OrderController.userGetAll);
// получить один заказ пользователя
router.get(
  "/user/getone/:id([0-9]+)",
  authMiddleware,
  OrderController.userGetOne
);
// создать новый заказ
router.post("/user/create", authMiddleware, OrderController.userCreate);

/*
 * для неавторизованного пользователя
 */

// создать новый заказ
router.post("/guest/create", OrderController.guestCreate);

export default router;
