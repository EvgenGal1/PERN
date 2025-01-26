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
// создать Продукт каталога — нужны права администратора
/**
 * @swagger
 * /products/create:
 *   post:
 *     summary: Создать Продукт каталога
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Данные для создания Продукта
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
 *         description: Продукт успешно создан
 *       400:
 *         description: Ошибка валидации данных
 */
router.post('/create', authMW, adminMW, ProductController.createProduct);

// получить один Продукт каталога
/**
 * @swagger
 * /products/getone/{id}:
 *   get:
 *     summary: Получить один Продукт каталога
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

// список всех Продуктов каталога
/**
 * @swagger
 * /products/getall:
 *   get:
 *     summary: Получить список всех Продуктов каталога
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список всех Продуктов
 */
router.get('/getall', ProductController.getAllProduct);

// обновить Продукт каталога  — нужны права администратора
/**
 * @swagger
 * /products/update/{id}:
 *   put:
 *     summary: Обновить Продукт каталога
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
 *       description: Данные для обновления Продукта
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
 *         description: Продукт успешно обновлен
 *       404:
 *         description: Продукт не найден
 */
router.put(
  '/update/:id([0-9]+)',
  authMW,
  adminMW,
  ProductController.updateProduct,
);

// удалить Продукт каталога  — нужны права администратора
/**
 * @swagger
 * /products/delete/{id}:
 *   delete:
 *     summary: Удалить Продукт каталога
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
 *         description: Продукт успешно удален
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
// список Продуктов выбранной категории и выбранного бренда
/**
 * @swagger
 * /products/getall/categoryId/{categoryId}/brandId/{brandId}:
 *   get:
 *     summary: Получить список Продуктов по категории и бренду
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID категории
 *       - in: path
 *         name: brandId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID бренда
 *     responses:
 *       200:
 *         description: Список Продуктов
 */
router.get(
  // "/getall/categoryId/:categoryId([0-9]+)/brandId/:brandId([0-9]+)",
  // ^ запрос под неск.парам.ч/з запятую (,? - опциональная запятая, * - 0 и более повторений, + - 1 и более повторений)
  '/getall/categoryId/:categoryId(,?[0-9]+*)/brandId/:brandId(,?[0-9]+*)',
  ProductController.getAllProduct,
);

// список Продуктов выбранной категории
/**
 * @swagger
 * /products/getall/categoryId/{categoryId}:
 *   get:
 *     summary: Получить список Продуктов выбранной категории
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID категории
 *     responses:
 *       200:
 *         description: Список Продуктов
 */
router.get(
  // "/getall/categoryId/:categoryId([0-9]+)",
  '/getall/categoryId/:categoryId(,?[0-9]+*)',
  ProductController.getAllProduct,
);

// список Продуктов выбранного бренда
/**
 * @swagger
 * /products/getall/brandId/{brandId}:
 *   get:
 *     summary: Получить список Продуктов выбранного бренда
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: brandId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID бренда
 *     responses:
 *       200:
 *         description: Список Продуктов
 */
router.get(
  // "/getall/brandId/:brandId([0-9]+)",
  '/getall/brandId/:brandId(,?[0-9]+*)',
  ProductController.getAllProduct,
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

// создать свойство Продукта
/**
 * @swagger
 * /products/{productId}/property/create:
 *   post:
 *     summary: Создать свойство Продукта
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
 *       description: Данные для создания свойства
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
 *         description: Свойство успешно создано
 */
router.post(
  '/:productId([0-9]+)/property/create',
  authMW,
  adminMW,
  ProductPropController.createProdProp,
);

// одно свойство Продукта
/**
 * @swagger
 * /products/{productId}/property/getone/{id}:
 *   get:
 *     summary: Получить одно свойство Продукта
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
 *         description: ID свойства
 *     responses:
 *       200:
 *         description: Информация о свойстве
 *       404:
 *         description: Свойство не найдено
 */
router.get(
  '/:productId([0-9]+)/property/getone/:id([0-9]+)',
  ProductPropController.getOneProdProp,
);

// список свойств Продукта
/**
 * @swagger
 * /products/{productId}/property/getall:
 *   get:
 *     summary: Получить список всех свойств Продукта
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
 *         description: Список свойств Продукта
 */
router.get(
  '/:productId([0-9]+)/property/getall',
  ProductPropController.getAllProdProp,
);

// обновить свойство Продукта
/**
 * @swagger
 * /products/{productId}/property/update/{id}:
 *   put:
 *     summary: Обновить свойство Продукта
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
 *         description: ID свойства
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Данные для обновления свойства
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
 *         description: Свойство обновлено
 */
router.put(
  '/:productId([0-9]+)/property/update/:id([0-9]+)',
  authMW,
  adminMW,
  ProductPropController.updateProdProp,
);

// удалить свойство Продукта
/**
 * @swagger
 * /products/{productId}/property/delete/{id}:
 *   delete:
 *     summary: Удалить свойство Продукта
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
 *         description: ID свойства
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Свойство удалено
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
