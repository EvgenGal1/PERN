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
 *   description: API для управления Заказами
 */

// создать новый Заказ
/**
 * @swagger
 * /orders/create:
 *   post:
 *     summary: Создание Нового Заказа Администратором
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: данные для Создания Заказа
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
 *         description: Заказ успешно Создан
 *       400:
 *         description: Ошибка валидации данных
 */
router.post('/create', authMW, adminMW, OrderController.createOrder);

// получить Заказ по id
/**
 * @swagger
 * /orders/getone/{id}:
 *   get:
 *     summary: Получить Один Заказ по ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID Заказа
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Информация о Заказе
 *       404:
 *         description: Заказ не найден
 */
router.get('/getone/:id([0-9]+)', authMW, adminMW, OrderController.getOneOrder);

// получить список всех Заказов магазина
/**
 * @swagger
 * /orders/getall:
 *   get:
 *     summary: Получить список Всех Заказов
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список Всех Заказов
 */
router.get('/getall', authMW, adminMW, OrderController.getAllOrders);

// получить список Заказов Пользователя
// router.get(
//   '/getall/user/:id([0-9]+)',
//   authMW,
//   adminMW,
//   OrderController.getOrder,
// );
// обновить Заказ
/**
 * @swagger
 * /orders/update/{id}:
 *   put:
 *     summary: Обновить Заказ по ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID Заказа
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: данные для Обновления Заказа
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
 *         description: Заказ Обновлен
 *       400:
 *         description: Ошибка валидации данных
 *       404:
 *         description: Заказ не найден
 */
router.put('/update/:id([0-9]+)', authMW, adminMW, OrderController.updateOrder);

// удалить Заказ по id
/**
 * @swagger
 * /orders/delete/{id}:
 *   delete:
 *     summary: Удалить Заказ по ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID Заказа
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Заказ Удален
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
 *   description: API для управления Позициями Заказов
 */

// создать Позицию Заказа
/**
 * @swagger
 * /orders/{orderId}/item/create:
 *   post:
 *     summary: Создание Позиции Заказа
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID Заказа
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: данные для Создания Позиции Заказа
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
 *         description: Позиция Заказа успешно Создана
 *       400:
 *         description: Ошибка валидации данных
 */
router.post(
  '/:orderId([0-9]+)/item/create',
  authMW,
  adminMW,
  OrderItemsController.createOrderItems,
);

// Одна Позиция Заказа
/**
 * @swagger
 * /orders/{orderId}/item/getone/{id}:
 *   get:
 *     summary: Получить Одну Позицию Заказа
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID Заказа
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID Позиции Заказа
 *     responses:
 *       200:
 *         description: Информация о Позиции Заказа
 *       404:
 *         description: Позиция не найдена
 */
router.get(
  '/:orderId([0-9]+)/item/getone/:id([0-9]+)',
  OrderItemsController.getOneOrderItems,
);

// список Позицый Заказа
/**
 * @swagger
 * /orders/{orderId}/item/getall:
 *   get:
 *     summary: Получить список Всех Позиций Заказа
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID Заказа
 *     responses:
 *       200:
 *         description: Список Позиций Заказа
 */
router.get(
  '/:orderId([0-9]+)/item/getall',
  OrderItemsController.getAllOrderItems,
);

// обновить Позицию Заказа
/**
 * @swagger
 * /orders/{orderId}/item/update/{id}:
 *   put:
 *     summary: Обновить Позицию Заказа
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID Заказа
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID Позиции Заказа
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: данные для Обновления Позиции Заказа
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
 *         description: Позиция Заказа Обновлена
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

// удалить Позицию Заказа
/**
 * @swagger
 * /orders/{orderId}/item/delete/{id}:
 *   delete:
 *     summary: Удалить Позицию Заказа
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID Заказа
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID Позиции Заказа
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Позиция Заказа Удалена
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
 * для авторизованного Пользователя
 */

// Создать Новый Заказ
/**
 * @swagger
 * /orders/user/create:
 *   post:
 *     summary: Создать Новый Заказ для авторизованного Пользователя
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: данные для Создания Заказа
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
 *         description: Заказ успешно Создан
 *       400:
 *         description: Ошибка валидации данных
 */
router.post('/user/create', authMW, OrderController.createOrder);

// получить один Заказ Пользователя
/**
 * @swagger
 * /orders/user/getone/{id}:
 *   get:
 *     summary: Получить Один Заказ Пользователя
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID Заказа
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Информация о Заказе
 *       404:
 *         description: Заказ не найден
 */
router.get('/user/getone/:id([0-9]+)', authMW, OrderController.getOneOrder);

// получить все Заказы Пользователя
/**
 * @swagger
 * /orders/user/getall:
 *   get:
 *     summary: Получить Все Заказы Пользователя
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список Всех Заказов Пользователя
 */
router.get('/user/getall', authMW, OrderController.getAllOrders);

/*
 * для неавторизованного Пользователя
 */

// создать новый Заказ
/**
 * @swagger
 * /orders/guest/create:
 *   post:
 *     summary: Создать новый Заказ для неавторизованного Пользователя
 *     tags: [Orders]
 *     requestBody:
 *       description: Данные для Создания Заказа
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
 *         description: Заказ успешно Создан
 *       400:
 *         description: Ошибка валидации данных
 */
router.post('/guest/create', OrderController.createOrder);

export default router;
