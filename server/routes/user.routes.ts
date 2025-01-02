import express from 'express';
const router = express();
// подкл. валидацию
import { check } from 'express-validator';

import authMiddleware from '../middleware/authMiddleware';
import adminMiddleware from '../middleware/adminMiddleware';
// подкл. middleware доступов
// const checkRole = require("../middleware/checkRoleMiddleware");
import UserController from '../controllers/user.controller';

// настр.swg JSDoc (доки.в JSON/YAML) > swg UI-dist (визуал.в браузере)
/**
 * @swagger
 * tags:
 *   name: User
 *   description: Управление Пользователями
 */

// любой Пользователь
// РЕГИСТРАЦИЯ
/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Регистрация нового Пользователя
 *     tags: [User]
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Пользователь успешно зарегистрирован.
 *       400:
 *         description: Ошибка валидации данных.
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
  UserController.signupUser,
);

// АВТОРИЗАЦИЯ
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Авторизация Пользователя
 *     tags: [User]
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
  UserController.loginUser,
);

// USER Пользователь
// АКТИВАЦИЯ АКАУНТА. По ссылке в почту
router.get('/activate/:link', UserController.activateUser);
// ПЕРЕЗАПИСЬ ACCESS токен. Отправ.refresh, получ.access и refresh
router.get('/refresh', UserController.refreshUser);
// ПРОВЕРКА | auth
router.get('/check', authMiddleware, UserController.checkUser);
// ВЫХОД. Удален.Token.refreshToken
router.post('/logout', UserController.logoutUser);

// ADMIN Пользователь
router.post(
  '/create',
  authMiddleware,
  adminMiddleware,
  UserController.createUser,
);
router.get(
  '/getone/:id([0-9]+)',
  authMiddleware,
  adminMiddleware,
  UserController.getOneUser,
);
router.get(
  '/getall',
  authMiddleware,
  adminMiddleware,
  UserController.getAllUser,
);
router.put(
  '/update/:id([0-9]+)',
  authMiddleware,
  adminMiddleware,
  UserController.updateUser,
);
router.delete(
  '/delete/:id([0-9]+)',
  authMiddleware,
  adminMiddleware,
  UserController.deleteUser,
);

export default router;
