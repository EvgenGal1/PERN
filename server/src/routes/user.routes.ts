import express from 'express';

import authMW from '../middleware/auth/authMiddleware';
import adminMW from '../middleware/auth/adminMiddleware';
import UserController from '../controllers/user.controller';

const router = express.Router();

// настр.swg JSDoc (доки.в JSON/YAML) > swg UI-dist (визуал.в браузере)
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API Управление Пользователями
 */

// ADMIN Пользователь
/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Создать Нового Пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: strong@Password123!
 *     responses:
 *       201:
 *         description: Пользователь успешно Создан
 *       400:
 *         description: Некорректные данные
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/create', authMW, adminMW, UserController.createUser);

// получить по id
/**
 * @swagger
 * /users/getone/{id}:
 *   get:
 *     summary: Получить информацию о Пользователе по ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Информация о Пользователе
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/getone/:id([0-9]+)', authMW, adminMW, UserController.getOneUser);

// получит всех Пользователей
/**
 * @swagger
 * /users/users:
 *   get:
 *     summary: Получить список Всех Пользователей
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список Пользователей
 *       403:
 *         description: Недостаточно прав
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/getall', authMW, adminMW, UserController.getAllUser);

// обновить по id
/**
 * @swagger
 * /users/update/{id}:
 *   put:
 *     summary: Обновить данные Пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: updatedUser@example.com
 *               password:
 *                 type: string
 *                 example: newPassword123!
 *     responses:
 *       200:
 *         description: Пользователь Обновлен
 *       400:
 *         description: Некорректные данные
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.put('/update/:id([0-9]+)', authMW, adminMW, UserController.updateUser);

// удалить по id
/**
 * @swagger
 * /users/delete/{id}:
 *   delete:
 *     summary: Удалить Пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Пользователь Удален
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.delete(
  '/delete/:id([0-9]+)',
  authMW,
  adminMW,
  UserController.deleteUser,
);

export default router;
