import express from 'express';

import authMW from '../middleware/auth/authMiddleware';
import roleMW from '../middleware/auth/roleMiddleware';
import RatingController from '../controllers/rating.controller';
import { NameUserRoles } from '../types/role.interface';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: API для управления Рейтингами
 */

/**
 * @swagger
 * /ratings/product/{productId}:
 *   get:
 *     summary: Получить Рейтинг Продукта
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Продукта
 *     responses:
 *       200:
 *         description: Информация о Рейтинге Продукта
 *       404:
 *         description: Рейтинг Продукта не найден
 */
router.get('/product/:productId([0-9]+)', RatingController.getOneRating);

/**
 * @swagger
 * /ratings/product/{productId}/rate/{rate}:
 *   post:
 *     summary: Добавить Рейтинг для Продукта
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Продукта
 *       - in: path
 *         name: rate
 *         required: true
 *         schema:
 *           type: integer
 *           enum: [1, 2, 3, 4, 5]
 *         description: Рейтинг от 1 до 5
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Рейтинг Добавлен
 *       400:
 *         description: Некорректные данные
 */
router.post(
  '/product/:productId([0-9]+)/rate/:rate([1-5])',
  authMW,
  roleMW([
    NameUserRoles.USER,
    NameUserRoles.SUPER,
    NameUserRoles.ADMIN,
    NameUserRoles.MODER,
  ]),
  RatingController.createRating,
);

export default router;
