import express from 'express';

import authMW from '../middleware/auth/authMiddleware';
import adminMW from '../middleware/auth/adminMiddleware';
import roleMW from '../middleware/auth/roleMiddleware';
import RatingController from '../controllers/rating.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: API для управления Рейтингами
 */

/**
 * @swagger
 * /rating/product/{productId}:
 *   get:
 *     summary: Получить рейтинг товара
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Информация о рейтинге товара
 *       404:
 *         description: Рейтинг товара не найден
 */
router.get('/product/:productId([0-9]+)', RatingController.getOneRating);

/**
 * @swagger
 * /rating/product/{productId}/rate/{rate}:
 *   post:
 *     summary: Добавить рейтинг для товара (требуются права администратора или модератора)
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
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
 *         description: Рейтинг добавлен
 *       400:
 *         description: Некорректные данные
 */
router.post(
  '/product/:productId([0-9]+)/rate/:rate([1-5])',
  authMW,
  adminMW,
  roleMW(['SUPER', 'ADMIN', 'MODER']),
  RatingController.createRating,
);

export default router;
