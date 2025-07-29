import express from 'express';
const router = express();

import BasketController from '../controllers/basket.controller';

/**
 * @swagger
 * tags:
 *   name: Basket
 *   description: API для работы с Корзинами
 */

/**
 * @swagger
 * /baskets/getone:
 *   get:
 *     summary: Получить Одну Корзину
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешный Ответ
 *       400:
 *         description: Ошибка Запроса
 */
router.get('/getone', BasketController.getOneBasket);

/**
 * @swagger
 * /baskets/product/{productId}/append/{quantity}:
 *   post:
 *     summary: Добавить Продукты в Корзину
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID Продукта
 *       - in: path
 *         name: quantity
 *         schema:
 *           type: integer
 *         required: true
 *         description: Количество
 *     responses:
 *       200:
 *         description: Продукт Добавлен в Корзину
 *       400:
 *         description: Ошибка Запроса
 */
router.put(
  '/product/:productId([0-9]+)/append/:quantity([0-9]+)',
  BasketController.appendBasket,
);

/**
 * @swagger
 * /baskets/product/{productId}/increment/{quantity}:
 *   put:
 *     summary: Увеличить количество Продуктов в Корзине
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID Продукта
 *       - in: path
 *         name: quantity
 *         schema:
 *           type: integer
 *         required: true
 *         description: Количество для Увеличения
 *     responses:
 *       200:
 *         description: Количество Увеличено
 *       400:
 *         description: Ошибка Запроса
 */
router.put(
  '/product/:productId([0-9]+)/increment/:quantity([0-9]+)',
  BasketController.incrementBasket,
);

/**
 * @swagger
 * /baskets/product/{productId}/decrement/{quantity}:
 *   put:
 *     summary: Уменьшить количество Продуктов в Корзине
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID Продукта
 *       - in: path
 *         name: quantity
 *         schema:
 *           type: integer
 *         required: true
 *         description: Количество для Уменьшения
 *     responses:
 *       200:
 *         description: Количество Уменьшено
 *       400:
 *         description: Ошибка Запроса
 */
router.put(
  '/product/:productId([0-9]+)/decrement/:quantity([0-9]+)',
  BasketController.decrementBasket,
);

/**
 * @swagger
 * /baskets/product/{productId}/remove:
 *   delete:
 *     summary: Удалить Продукт из Корзины
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID Продукта
 *     responses:
 *       200:
 *         description: Продукт Удалён
 *       400:
 *         description: Ошибка Запроса
 */
router.put('/product/:productId([0-9]+)/remove', BasketController.removeBasket);

/**
 * @swagger
 * /baskets/clear:
 *   delete:
 *     summary: Очистить Корзину
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Корзина Очищена
 *       400:
 *         description: Ошибка Запроса
 */
router.put('/clear', BasketController.clearBasket);

/**
 * @swagger
 * /baskets/product/{productId}/remove:
 *   delete:
 *     summary: Удалить Корзину и Все Продукты
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID Продукта
 *     responses:
 *       200:
 *         description: Продукт Удалён
 *       400:
 *         description: Ошибка Запроса
 */
router.put('/delete', BasketController.deleteBasket);

export default router;
