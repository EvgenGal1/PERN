import express from 'express';
const router = express();

import authMiddleware from '../middleware/authMiddleware';
import adminMiddleware from '../middleware/adminMiddleware';
import BrandController from '../controllers/brand.controller';

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: API для управления брендами
 */

/**
 * @swagger
 * /brands/create:
 *   post:
 *     summary: Создать новый бренд
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название бренда
 *     responses:
 *       200:
 *         description: Бренд успешно создан
 *       400:
 *         description: Ошибка валидации данных
 */
router.post(
  '/create',
  authMiddleware,
  adminMiddleware,
  BrandController.createBrand,
);
/**
 * @swagger
 * /brands/getone/{id}:
 *   get:
 *     summary: Получить один бренд
 *     tags: [Brands]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID бренда
 *     responses:
 *       200:
 *         description: Данные бренда
 *       404:
 *         description: Бренд не найден
 */
router.get('/getone/:id([0-9]+)', BrandController.getOneBrand);
/**
 * @swagger
 * /brands/getall:
 *   get:
 *     summary: Получить все бренды
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: Список брендов
 */

router.get('/getall', BrandController.getAllBrand);
/**
 * @swagger
 * /brands/update/{id}:
 *   put:
 *     summary: Обновить бренд
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID бренда
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Обновленный бренд
 *       404:
 *         description: Бренд не найден
 */
router.put(
  '/update/:id([0-9]+)',
  authMiddleware,
  adminMiddleware,
  BrandController.updateBrand,
);
/**
 * @swagger
 * /brands/delete/{id}:
 *   delete:
 *     summary: Удалить бренд
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID бренда
 *     responses:
 *       200:
 *         description: Бренд удален
 *       404:
 *         description: Бренд не найден
 */
router.delete(
  '/delete/:id([0-9]+)',
  authMiddleware,
  adminMiddleware,
  BrandController.deleteBrand,
);

export default router;
