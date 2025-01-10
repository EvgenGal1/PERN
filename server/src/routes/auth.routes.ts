import express from 'express';

import authMW from '../middleware/authMiddleware';
import { validateSignup } from '../middleware/validation/authValidator';
import AuthController from '../controllers/auth.controller';

const router = express.Router();

// настр.swg JSDoc (доки.в JSON/YAML) > swg UI-dist (визуал.в браузере)
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Эндпоинты Авторизации и регистрации
 */

// любой Пользователь
// РЕГИСТРАЦИЯ
/**
 * @swagger
 * /auth/signup:
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
 *                 description: Электронная почта Пользователя
 *               password:
 *                 type: string
 *                 description: Пароль Пользователя
 *     responses:
 *       201:
 *         description: Успешная регистрация
 *       400:
 *         description: Некорректные входные данные
 */
router.post('/signup', validateSignup, AuthController.signupUser);

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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешная авторизация.
 *       401:
 *         description: Неверный логин или пароль.
 */
router.post('/login', validateSignup, AuthController.loginUser);

// USER Пользователь
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
 *   get:
 *     summary: Обновление токена доступа
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Токен успешно обновлён
 *       401:
 *         description: Невалидный токен обновления
 */
router.get('/refresh', AuthController.refreshUser);
// ПРОВЕРКА | auth
router.get('/check', authMW, AuthController.checkUser);
// ВЫХОД. Удален.Token.refreshToken
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Выход из системы
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Успешный выход
 */
router.post('/logout', AuthController.logoutUser);

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
