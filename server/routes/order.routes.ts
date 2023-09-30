import express /* , { Application } */ from "express";
const router /* : Application */ = express();

import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";
import OrderController from "../controllers/order.controller";
import OrderItemsController from "../controllers/orderItems.controller";

/*
 * ЗАКАЗЫ для ADNIN магазина
 */

// создать новый заказ
router.post(
  "/admin/create",
  authMiddleware,
  adminMiddleware,
  OrderController.adminCreateOrder
);
// получить заказ по id
router.get(
  "/admin/getone/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  OrderController.adminGetOneOrder
);
// получить список всех заказов магазина
router.get(
  "/admin/getall",
  authMiddleware,
  adminMiddleware,
  OrderController.adminGetAllOrder
);
// получить список заказов пользователя
router.get(
  "/admin/getall/user/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  OrderController.adminGetOrder
);
// обновить заказ
router.put(
  "/admin/update/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  OrderController.adminUpdateOrder
);
// удалить заказ по id
router.delete(
  "/admin/delete/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  OrderController.adminDeleteOrder
);

/*
 * ПОЗИЦИИ Заказа
 */

// создать позицию заказа
router.post(
  "/:orderId([0-9]+)/item/create",
  authMiddleware,
  adminMiddleware,
  OrderItemsController.createOrderItems
);
// одна позиция заказа
router.get(
  "/:orderId([0-9]+)/item/getone/:id([0-9]+)",
  OrderItemsController.getOneOrderItems
);
// список позицый заказа
router.get(
  "/:orderId([0-9]+)/item/getall",
  OrderItemsController.getAllOrderItems
);
// обновить позицию заказа
router.put(
  "/:orderId([0-9]+)/item/update/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  OrderItemsController.updateOrderItems
);
// удалить позицию заказа
router.delete(
  "/:orderId([0-9]+)/item/delete/:id([0-9]+)",
  authMiddleware,
  adminMiddleware,
  OrderItemsController.deleteOrderItems
);

/*
 * для авторизованного пользователя
 */

// создать новый заказ
router.post("/user/create", authMiddleware, OrderController.userCreateOrder);
// получить один заказ пользователя
router.get(
  "/user/getone/:id([0-9]+)",
  authMiddleware,
  OrderController.userGetOneOrder
);
// получить все заказы пользователя
router.get("/user/getall", authMiddleware, OrderController.userGetAllOrder);

/*
 * для неавторизованного пользователя
 */

// создать новый заказ
router.post("/guest/create", OrderController.guestCreateOrder);

export default router;
