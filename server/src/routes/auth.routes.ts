import express from 'express';

import authMW from '../middleware/auth/authMiddleware';
import { validateAuth } from '../middleware/validation/authValidator';
import AuthController from '../controllers/auth.controller';

const router = express.Router();

// настр.swg JSDoc (доки.в JSON/YAML) > swg UI-dist (визуал.в браузере)
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Эндпоинты Авторизации и регистрации
 */

// РЕГИСТРАЦИЯ
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Регистрация нового Пользователя
 *     tags: [Authentication]
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
 *                 description: Электронная почта Пользователя
 *               password:
 *                 type: string
 *                 example: strong@Password123!
 *                 description: Пароль Пользователя
 *     responses:
 *       201:
 *         description: Успешная регистрация
 *       400:
 *         description: Некорректные входные данные
 */
router.post('/register', validateAuth, AuthController.registerUser);

// АВТОРИЗАЦИЯ
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Авторизация Пользователя
 *     tags: [Authentication]
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
 *       200:
 *         description: Успешная авторизация.
 *       401:
 *         description: Неверный логин или пароль.
 */
router.post('/login', validateAuth, AuthController.loginUser);

// АКТИВАЦИЯ АКАУНТА. По ссылке в почту
/**
 * @swagger
 * /auth/activate/{link}:
 *   get:
 *     summary: Активация аккаунта через ссылку в email
 *     tags: [Authentication]
 *     parameters:
 *       - name: link
 *         in: path
 *         required: true
 *         description: Уникальная ссылка для активации
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Аккаунт успешно активирован
 *       400:
 *         description: Ошибка активации
 */
router.get('/activate/:link', AuthController.activateUser);

// ПЕРЕЗАПИСЬ ACCESS токен. Отправ.refresh, получ.access и refresh
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Обновление токена доступа
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Токен успешно обновлён
 *       401:
 *         description: Невалидный токен обновления
 */
router.post('/refresh', AuthController.refreshUser);

// ПРОВЕРКА | auth
router.get('/check', authMW, AuthController.checkUser);

// ВЫХОД. Удален.Token.refreshToken
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Выход из системы
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешный выход
 */
router.post('/logout', AuthController.logoutUser);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Запрос на сброс пароля
 *     tags: [Authentication]
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
 *                 description: Электронная почта Пользователя
 *               password:
 *                 type: string
 *                 example: strong@Password123!
 *                 description: Пароль Пользователя
 *     responses:
 *       200:
 *         description: Ссылка для сброса пароля отправлена на почту
 *       400:
 *         description: Некорректные входные данные
 */
router.post(
  '/reset-password',
  validateAuth,
  AuthController.requestPasswordReset,
);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   patch:
 *     summary: Обновление пароля
 *     tags: [Authentication]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: Токен для сброса пароля
 *         schema:
 *           type: string
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
 *                 description: Электронная почта Пользователя
 *               password:
 *                 type: string
 *                 example: strong@Password123!
 *                 description: Новый Пароль Пользователя
 *     responses:
 *       200:
 *         description: Пароль успешно обновлен
 *       400:
 *         description: Некорректные входные данные
 */
router.patch(
  '/reset-password/:token',
  validateAuth,
  AuthController.completePasswordReset,
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;
