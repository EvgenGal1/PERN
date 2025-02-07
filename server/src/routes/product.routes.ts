import express from 'express';

import authMW from '../middleware/auth/authMiddleware';
import adminMW from '../middleware/auth/adminMiddleware';
import ProductController from '../controllers/product.controller';
import ProductPropController from '../controllers/productProp.controller';

const router = express.Router();

/*
 * Продукты
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API для управления Продуктами
 */

// ^ Стандартные
// создать Продукт Каталога (Админ)
/**
 * @swagger
 * /products/create:
 *   post:
 *     summary: Создать Продукт Каталога
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: данные для Создания Продукта
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               brandId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Продукт успешно Создан
 *       400:
 *         description: Ошибка валидации данных
 */
router.post('/create', authMW, adminMW, ProductController.createProduct);

// получить Один Продукт Каталога
/**
 * @swagger
 * /products/getone/{id}:
 *   get:
 *     summary: Получить Один Продукт Каталога
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID Продукта
 *     responses:
 *       200:
 *         description: Информация о Продукте
 *       404:
 *         description: Продукт не найден
 */
router.get('/getone/:id([0-9]+)', ProductController.getOneProduct);

// список Всех Продуктов Каталога
/**
 * @swagger
 * /products/getall:
 *   get:
 *     summary: Получить список Всех Продуктов Каталога
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список Всех Продуктов
 */
router.get('/getall', ProductController.getAllProducts);

// обновить Продукт Каталога (Админ)
/**
 * @swagger
 * /products/update/{id}:
 *   put:
 *     summary: Обновить Продукт Каталога
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID Продукта
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: данные для Обновления Продукта
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Продукт успешно Обновлен
 *       404:
 *         description: Продукт не найден
 */
router.put(
  '/update/:id([0-9]+)',
  authMW,
  adminMW,
  ProductController.updateProduct,
);

// удалить Продукт Каталога (Админ)
/**
 * @swagger
 * /products/delete/{id}:
 *   delete:
 *     summary: Удалить Продукт Каталога
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID Продукта
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Продукт успешно Удален
 *       404:
 *         description: Продукт не найден
 */
router.delete(
  '/delete/:id([0-9]+)',
  authMW,
  adminMW,
  ProductController.deleteProduct,
);

// ^ Расширенные под фильтрацию. тесты GET для категорий и брендов - http://localhost:5050/api/products/getall/categoryId/3/brandId/4
// список Продуктов выбранной Категории и выбранного Бренда
/**
 * @swagger
 * /products/getall/categoryId/{categoryId}/brandId/{brandId}:
 *   get:
 *     summary: Получить список Продуктов по Категории и Бренду
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Категории
 *       - in: path
 *         name: brandId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Бренда
 *     responses:
 *       200:
 *         description: Список Продуктов
 */
router.get(
  // "/getall/categoryId/:categoryId([0-9]+)/brandId/:brandId([0-9]+)",
  // ^ запрос под неск.парам.ч/з запятую (,? - опциональная запятая, * - 0 и более повторений, + - 1 и более повторений)
  '/getall/categoryId/:categoryId(,?[0-9]+*)/brandId/:brandId(,?[0-9]+*)',
  ProductController.getAllProducts,
);

// список Продуктов выбранной Категории
/**
 * @swagger
 * /products/getall/categoryId/{categoryId}:
 *   get:
 *     summary: Получить список Всех Продуктов выбранной Категории
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Категории
 *     responses:
 *       200:
 *         description: Список Продуктов
 */
router.get(
  // "/getall/categoryId/:categoryId([0-9]+)",
  '/getall/categoryId/:categoryId(,?[0-9]+*)',
  ProductController.getAllProducts,
);

// список Продуктов выбранного бренда
/**
 * @swagger
 * /products/getall/brandId/{brandId}:
 *   get:
 *     summary: Получить список Всех Продуктов выбранного Бренда
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: brandId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Бренда
 *     responses:
 *       200:
 *         description: Список Продуктов
 */
router.get(
  // "/getall/brandId/:brandId([0-9]+)",
  '/getall/brandId/:brandId(,?[0-9]+*)',
  ProductController.getAllProducts,
);

/*
 * Свойства
 */

/**
 * @swagger
 * tags:
 *   name: Product Properties
 *   description: API для управления Свойствами Продукта
 */

// создать Свойство Продукта
/**
 * @swagger
 * /products/{productId}/property/create:
 *   post:
 *     summary: Создать Свойство Продукта
 *     tags: [Product Properties]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Продукта
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: данные для Создания Свойства
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       201:
 *         description: Свойство успешно Создано
 */
router.post(
  '/:productId([0-9]+)/property/create',
  authMW,
  adminMW,
  ProductPropController.createProdProp,
);

// одно Свойство Продукта
/**
 * @swagger
 * /products/{productId}/property/getone/{id}:
 *   get:
 *     summary: Получить Одно Свойство Продукта
 *     tags: [Product Properties]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Продукта
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Свойства
 *     responses:
 *       200:
 *         description: Информация о Свойстве
 *       404:
 *         description: Свойство не найдено
 */
router.get(
  '/:productId([0-9]+)/property/getone/:id([0-9]+)',
  ProductPropController.getOneProdProp,
);

// список Свойств Продукта
/**
 * @swagger
 * /products/{productId}/property/getall:
 *   get:
 *     summary: Получить список Всех Свойств Продукта
 *     tags: [Product Properties]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Продукта
 *     responses:
 *       200:
 *         description: Список Свойств Продукта
 */
router.get(
  '/:productId([0-9]+)/property/getall',
  ProductPropController.getAllProdProp,
);

// обновить Свойство Продукта
/**
 * @swagger
 * /products/{productId}/property/update/{id}:
 *   put:
 *     summary: Обновить Свойство Продукта
 *     tags: [Product Properties]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Продукта
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Свойства
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Данные для Обновления Свойства
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Свойство Обновлено
 */
router.put(
  '/:productId([0-9]+)/property/update/:id([0-9]+)',
  authMW,
  adminMW,
  ProductPropController.updateProdProp,
);

// удалить Свойство Продукта
/**
 * @swagger
 * /products/{productId}/property/delete/{id}:
 *   delete:
 *     summary: Удалить Свойство Продукта
 *     tags: [Product Properties]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Продукта
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Свойства
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Свойство Удалено
 *       404:
 *         description: Свойство не найдено
 */
router.delete(
  '/:productId([0-9]+)/property/delete/:id([0-9]+)',
  authMW,
  adminMW,
  ProductPropController.deleteProdProp,
);

export default router;
