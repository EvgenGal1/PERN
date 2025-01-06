import express from 'express';
const router = express();

import BasketController from '../controllers/basket.controller';

/**
 * @swagger
 * tags:
 *   name: Basket
 *   description: API для работы с корзинами
 */

/**
 * @swagger
 * /getone:
 *   get:
 *     summary: Получить одну корзину
 *     tags: [Basket]
 *     responses:
 *       200:
 *         description: Успешный ответ
 *       400:
 *         description: Ошибка запроса
 */
router.get('/getone', BasketController.getOneBasket);
/**
 * @swagger
 * /product/{productId}/append/{quantity}:
 *   put:
 *     summary: Добавить продукт в корзину
 *     tags: [Basket]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID продукта
 *       - in: path
 *         name: quantity
 *         schema:
 *           type: integer
 *         required: true
 *         description: Количество
 *     responses:
 *       200:
 *         description: Продукт добавлен в корзину
 *       400:
 *         description: Ошибка запроса
 */
router.put(
  '/product/:productId([0-9]+)/append/:quantity([0-9]+)',
  BasketController.appendBasket,
);
/**
 * @swagger
 * /product/{productId}/increment/{quantity}:
 *   put:
 *     summary: Увеличить количество продукта в корзине
 *     tags: [Basket]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID продукта
 *       - in: path
 *         name: quantity
 *         schema:
 *           type: integer
 *         required: true
 *         description: Количество для увеличения
 *     responses:
 *       200:
 *         description: Количество увеличено
 *       400:
 *         description: Ошибка запроса
 */
router.put(
  '/product/:productId([0-9]+)/increment/:quantity([0-9]+)',
  BasketController.incrementBasket,
);
/**
 * @swagger
 * /product/{productId}/decrement/{quantity}:
 *   put:
 *     summary: Уменьшить количество продукта в корзине
 *     tags: [Basket]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID продукта
 *       - in: path
 *         name: quantity
 *         schema:
 *           type: integer
 *         required: true
 *         description: Количество для уменьшения
 *     responses:
 *       200:
 *         description: Количество уменьшено
 *       400:
 *         description: Ошибка запроса
 */
router.put(
  '/product/:productId([0-9]+)/decrement/:quantity([0-9]+)',
  BasketController.decrementBasket,
);
/**
 * @swagger
 * /product/{productId}/remove:
 *   put:
 *     summary: Удалить продукт из корзины
 *     tags: [Basket]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID продукта
 *     responses:
 *       200:
 *         description: Продукт удалён
 *       400:
 *         description: Ошибка запроса
 */
router.put('/product/:productId([0-9]+)/remove', BasketController.removeBasket);
/**
 * @swagger
 * /clear:
 *   put:
 *     summary: Очистить корзину
 *     tags: [Basket]
 *     responses:
 *       200:
 *         description: Корзина очищена
 *       400:
 *         description: Ошибка запроса
 */
router.put('/clear', BasketController.clearBasket);

export default router;
