import express from 'express';
// подкл. валидацию
import { check } from 'express-validator';

import authMW from '../middleware/authMiddleware';
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
router.post(
  '/signup',
  // проверки валидации // ? шаблоны проверки, сам код в controllere
  [
    // валидация. normalize не пропускает RU email е/и записаны в ВерБлюд стиле.
    check('email', 'Некорректый email').isEmail().normalizeEmail(),
    check('password')
      .not()
      .isIn([
        '123qwe',
        '123qwerty',
        'qwerty',
        'qwe123',
        'qwerty123',
        '123456',
        'password123',
        'god123',
        '123qwe!@#',
        '123!@#qwe',
        '!@#123qwe',
        '!@#qwe123',
        'qwe!@#123',
        'qwe123!@#',
        '123Qwe!@#',
        '123!@#Qwe',
        '!@#123Qwe',
        '!@#Qwe123',
        'Qwe!@#123',
        'Qwe123!@#',
      ])
      .withMessage('Не используйте обычные значения в качестве пароля')
      .isLength({ min: 6 })
      .withMessage('Минимальная длина пароля 6 символов')
      .isLength({ max: 32 })
      .withMessage('Максимальная длина пароля 32 символа')
      .matches(/\d/)
      .withMessage('Пароль должен содержать число')
      .matches(/(?=(.*\W){2})/)
      .withMessage('Где два специальных символа'),
  ],
  AuthController.signupUser,
);

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
router.post(
  '/login',
  [check('email', 'Некорректый email на входе').isEmail().normalizeEmail()],
  AuthController.loginUser,
);

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
