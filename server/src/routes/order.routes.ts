// ^ опредео=лить необходимость admin и user routes

import express from 'express';

import authMW from '../middleware/auth/authMiddleware';
import adminMW from '../middleware/auth/adminMiddleware';
import OrderController from '../controllers/order.controller';
import OrderItemsController from '../controllers/orderItems.controller';

const router = express.Router();

/*
 * ЗАКАЗЫ магазина
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API для управления заказами
 */

// создать новый заказ

/**
 * @swagger
 * /order/create:
 *   post:
 *     summary: Создание нового заказа администратором
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Данные для создания заказа
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: number
 *                     quantity:
 *                       type: number
 *     responses:
 *       201:
 *         description: Заказ успешно создан
 *       400:
 *         description: Ошибка валидации данных
 */
router.post('/create', authMW, adminMW, OrderController.createOrder);
// получить заказ по id
/**
 * @swagger
 * /order/getone/{id}:
 *   get:
 *     summary: Получить заказ по ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID заказа
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Информация о заказе
 *       404:
 *         description: Заказ не найден
 */
router.get('/getone/:id([0-9]+)', authMW, adminMW, OrderController.getOneOrder);
// получить список всех заказов магазина
/**
 * @swagger
 * /order/getall:
 *   get:
 *     summary: Получить список всех заказов
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список всех заказов
 */
router.get('/getall', authMW, adminMW, OrderController.getAllOrders);
// // получить список заказов пользователя
// router.get(
//   '/getall/user/:id([0-9]+)',
//   authMW,
//   adminMW,
//   OrderController.getOrder,
// );
// обновить заказ
/**
 * @swagger
 * /order/update/{id}:
 *   put:
 *     summary: Обновить заказ по ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID заказа
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Данные для обновления заказа
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Заказ обновлен
 *       400:
 *         description: Ошибка валидации данных
 *       404:
 *         description: Заказ не найден
 */
router.put('/update/:id([0-9]+)', authMW, adminMW, OrderController.updateOrder);
// удалить заказ по id
/**
 * @swagger
 * /order/delete/{id}:
 *   delete:
 *     summary: Удалить заказ по ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID заказа
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Заказ удален
 *       404:
 *         description: Заказ не найден
 */
router.delete(
  '/delete/:id([0-9]+)',
  authMW,
  adminMW,
  OrderController.deleteOrder,
);

/*
 * ПОЗИЦИИ Заказа
 */

/**
 * @swagger
 * tags:
 *   name: OrderItems
 *   description: API для управления позициями заказов
 */

// создать позицию заказа
/**
 * @swagger
 * /order/{orderId}/item/create:
 *   post:
 *     summary: Создание позиции заказа
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID заказа
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Данные для создания позиции заказа
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Позиция заказа успешно создана
 *       400:
 *         description: Ошибка валидации данных
 */
router.post(
  '/:orderId([0-9]+)/item/create',
  authMW,
  adminMW,
  OrderItemsController.createOrderItems,
);
// одна позиция заказа
/**
 * @swagger
 * /order/{orderId}/item/getone/{id}:
 *   get:
 *     summary: Получить позицию заказа
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID заказа
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID позиции заказа
 *     responses:
 *       200:
 *         description: Информация о позиции заказа
 *       404:
 *         description: Позиция не найдена
 */
router.get(
  '/:orderId([0-9]+)/item/getone/:id([0-9]+)',
  OrderItemsController.getOneOrderItems,
);
// список позицый заказа
/**
 * @swagger
 * /order/{orderId}/item/getall:
 *   get:
 *     summary: Получить список позиций заказа
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID заказа
 *     responses:
 *       200:
 *         description: Список позиций заказа
 */
router.get(
  '/:orderId([0-9]+)/item/getall',
  OrderItemsController.getAllOrderItems,
);
// обновить позицию заказа
/**
 * @swagger
 * /order/{orderId}/item/update/{id}:
 *   put:
 *     summary: Обновить позицию заказа
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID заказа
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID позиции заказа
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Данные для обновления позиции заказа
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Позиция заказа обновлена
 *       400:
 *         description: Ошибка валидации данных
 *       404:
 *         description: Позиция не найдена
 */
router.put(
  '/:orderId([0-9]+)/item/update/:id([0-9]+)',
  authMW,
  adminMW,
  OrderItemsController.updateOrderItems,
);
// удалить позицию заказа
/**
 * @swagger
 * /order/{orderId}/item/delete/{id}:
 *   delete:
 *     summary: Удалить позицию заказа
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID заказа
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID позиции заказа
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Позиция заказа удалена
 *       404:
 *         description: Позиция не найдена
 */
router.delete(
  '/:orderId([0-9]+)/item/delete/:id([0-9]+)',
  authMW,
  adminMW,
  OrderItemsController.deleteOrderItems,
);

/*
 * для авторизованного пользователя
 */

// создать новый заказ
/**
 * @swagger
 * /order/user/create:
 *   post:
 *     summary: Создать новый заказ для авторизованного пользователя
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Данные для создания заказа
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Заказ успешно создан
 *       400:
 *         description: Ошибка валидации данных
 */
router.post('/user/create', authMW, OrderController.createOrder);
// получить один заказ пользователя
/**
 * @swagger
 * /order/user/getone/{id}:
 *   get:
 *     summary: Получить один заказ пользователя
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID заказа
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Информация о заказе
 *       404:
 *         description: Заказ не найден
 */
router.get('/user/getone/:id([0-9]+)', authMW, OrderController.getOneOrder);
// получить все заказы пользователя
/**
 * @swagger
 * /order/user/getall:
 *   get:
 *     summary: Получить все заказы пользователя
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список всех заказов пользователя
 */
router.get('/user/getall', authMW, OrderController.getAllOrders);

/*
 * для неавторизованного пользователя
 */

// создать новый заказ
/**
 * @swagger
 * /order/guest/create:
 *   post:
 *     summary: Создать новый заказ для неавторизованного пользователя
 *     tags: [Orders]
 *     requestBody:
 *       description: Данные для создания заказа
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Заказ успешно создан
 *       400:
 *         description: Ошибка валидации данных
 */
router.post('/guest/create', OrderController.createOrder);

export default router;
