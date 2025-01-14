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
 * /basket/getone:
 *   get:
 *     summary: Получить одну корзину
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешный ответ
 *       400:
 *         description: Ошибка запроса
 */
router.get('/getone', BasketController.getOneBasket);
/**
 * @swagger
 * /basket/product/{productId}/append/{quantity}:
 *   put:
 *     summary: Добавить продукт в корзину
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
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
  // ! Cannot read properties of undefined (reading 'getBasketId')
  // BasketController.appendBasket,
  // вызов с привязкой к экземпл.клс. > доступа к конексту с getBasketId
  BasketController.appendBasket.bind(BasketController),
);
/**
 * @swagger
 * /basket/product/{productId}/increment/{quantity}:
 *   put:
 *     summary: Увеличить количество продукта в корзине
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
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
 * /basket/product/{productId}/decrement/{quantity}:
 *   put:
 *     summary: Уменьшить количество продукта в корзине
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
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
 * /basket/product/{productId}/remove:
 *   put:
 *     summary: Удалить продукт из корзины
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
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
 * /basket/clear:
 *   put:
 *     summary: Очистить корзину
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Корзина очищена
 *       400:
 *         description: Ошибка запроса
 */
router.put('/clear', BasketController.clearBasket);

export default router;
