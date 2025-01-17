import express from 'express';

import authMW from '../middleware/auth/authMiddleware';
import adminMW from '../middleware/auth/adminMiddleware';
import CategoryController from '../controllers/category.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API для работы с Категориями
 */

/**
 * @swagger
 * /categories/create:
 *   post:
 *     summary: Создать Категорию
 *     tags: [Categories]
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
 *                 example: Новая Категория
 *     responses:
 *       201:
 *         description: Категория успешно создана
 *       400:
 *         description: Ошибка валидации или другая ошибка
 */
router.post('/create', authMW, adminMW, CategoryController.createCategory);
/**
 * @swagger
 * /categories/getone/{id}:
 *   get:
 *     summary: Получить одну Категорию по ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID Категории
 *     responses:
 *       200:
 *         description: Успешное получение данных
 *       404:
 *         description: Категория не найдена
 */
router.get('/getone/:id([0-9]+)', CategoryController.getOneCategory);
/**
 * @swagger
 * /categories/getall:
 *   get:
 *     summary: Получить все Категории
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Список всех Категорий
 */
router.get('/getall', CategoryController.getAllCategory);
/**
 * @swagger
 * /categories/update/{id}:
 *   put:
 *     summary: Обновить Категорию по ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Обновленное имя Категории
 *     responses:
 *       200:
 *         description: Категория успешно обновлена
 *       404:
 *         description: Категория не найдена
 */
router.put(
  '/update/:id([0-9]+)',
  authMW,
  adminMW,
  CategoryController.updateCategory,
);
/**
 * @swagger
 * /categories/delete/{id}:
 *   delete:
 *     summary: Удалить Категорию
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID Категории
 *     responses:
 *       200:
 *         description: Категория успешно удалена
 *       404:
 *         description: Категория не найдена
 */
router.delete(
  '/delete/:id([0-9]+)',
  authMW,
  adminMW,
  CategoryController.deleteCategory,
);

export default router;
