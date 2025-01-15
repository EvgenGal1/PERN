import express from 'express';

import authMW from '../middleware/authMiddleware';
import adminMW from '../middleware/adminMiddleware';
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
 * /user/create:
 *   post:
 *     summary: Создать нового пользователя
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
 *         description: Пользователь успешно создан
 *       400:
 *         description: Некорректные данные
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/create', authMW, adminMW, UserController.createUser);
// получить по id
/**
 * @swagger
 * /user/getone/{id}:
 *   get:
 *     summary: Получить информацию о пользователе по ID
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
 *         description: Информация о пользователе
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/getone/:id([0-9]+)', authMW, adminMW, UserController.getOneUser);
// получит всех пользователей
/**
 * @swagger
 * /user/users:
 *   get:
 *     summary: Получить список всех пользователей (только для администратора)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей
 *       403:
 *         description: Недостаточно прав
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/getall', authMW, adminMW, UserController.getAllUser);
// обновить по id
/**
 * @swagger
 * /user/update/{id}:
 *   put:
 *     summary: Обновить данные пользователя
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
 *         description: Пользователь обновлен
 *       400:
 *         description: Некорректные данные
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.put('/update/:id([0-9]+)', authMW, adminMW, UserController.updateUser);
// удалить по id
/**
 * @swagger
 * /user/delete/{id}:
 *   delete:
 *     summary: Удалить пользователя
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
 *         description: Пользователь удален
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
