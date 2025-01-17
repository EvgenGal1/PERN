import express from 'express';

import authMW from '../middleware/auth/authMiddleware';
import adminMW from '../middleware/auth/adminMiddleware';
import ProductController from '../controllers/product.controller';
import ProductPropController from '../controllers/productProp.controller';

const router = express.Router();

/*
 * Товары
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API для управления Товарами
 */

// ^ Стандартные
// создать товар каталога — нужны права администратора
/**
 * @swagger
 * /product/create:
 *   post:
 *     summary: Создать товар каталога (требуются права администратора)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Данные для создания товара
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
 *         description: Товар успешно создан
 *       400:
 *         description: Ошибка валидации данных
 */
router.post('/create', authMW, adminMW, ProductController.createProduct);
// получить один товар каталога
/**
 * @swagger
 * /product/getone/{id}:
 *   get:
 *     summary: Получить один товар каталога
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Информация о товаре
 *       404:
 *         description: Товар не найден
 */
router.get('/getone/:id([0-9]+)', ProductController.getOneProduct);
// список всех товаров каталога
/**
 * @swagger
 * /product/getall:
 *   get:
 *     summary: Получить список всех товаров каталога
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список всех товаров
 */
router.get('/getall', ProductController.getAllProduct);
// обновить товар каталога  — нужны права администратора
/**
 * @swagger
 * /product/update/{id}:
 *   put:
 *     summary: Обновить товар каталога (требуются права администратора)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID товара
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Данные для обновления товара
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
 *         description: Товар успешно обновлен
 *       404:
 *         description: Товар не найден
 */
router.put(
  '/update/:id([0-9]+)',
  authMW,
  adminMW,
  ProductController.updateProduct,
);
// удалить товар каталога  — нужны права администратора
/**
 * @swagger
 * /product/delete/{id}:
 *   delete:
 *     summary: Удалить товар каталога (требуются права администратора)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID товара
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Товар успешно удален
 *       404:
 *         description: Товар не найден
 */
router.delete(
  '/delete/:id([0-9]+)',
  authMW,
  adminMW,
  ProductController.deleteProduct,
);

// ^ Расширенные под фильтрацию. тесты GET для категорий и брендов - http://localhost:5050/api/product/getall/categoryId/3/brandId/4
// список товаров выбранной категории и выбранного бренда
/**
 * @swagger
 * /product/getall/categoryId/{categoryId}/brandId/{brandId}:
 *   get:
 *     summary: Получить список товаров по категории и бренду
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
 *         description: Список товаров
 */
router.get(
  // "/getall/categoryId/:categoryId([0-9]+)/brandId/:brandId([0-9]+)",
  // ^ запрос под неск.парам.ч/з запятую (,? - опциональная запятая, * - 0 и более повторений, + - 1 и более повторений)
  '/getall/categoryId/:categoryId(,?[0-9]+*)/brandId/:brandId(,?[0-9]+*)',
  ProductController.getAllProduct,
);
// список товаров выбранной категории
/**
 * @swagger
 * /product/getall/categoryId/{categoryId}:
 *   get:
 *     summary: Получить список товаров выбранной категории
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
 *         description: Список товаров
 */
router.get(
  // "/getall/categoryId/:categoryId([0-9]+)",
  '/getall/categoryId/:categoryId(,?[0-9]+*)',
  ProductController.getAllProduct,
);
// список товаров выбранного бренда
/**
 * @swagger
 * /product/getall/brandId/{brandId}:
 *   get:
 *     summary: Получить список товаров выбранного бренда
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
 *         description: Список товаров
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
 *   description: API для управления Свойствами Товара
 */

// создать свойство товара
/**
 * @swagger
 * /product/{productId}/property/create:
 *   post:
 *     summary: Создать свойство товара (требуются права администратора)
 *     tags: [Product Properties]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
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
// одно свойство товара
/**
 * @swagger
 * /product/{productId}/property/getone/{id}:
 *   get:
 *     summary: Получить одно свойство товара
 *     tags: [Product Properties]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
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
// список свойств товара
/**
 * @swagger
 * /product/{productId}/property/getall:
 *   get:
 *     summary: Получить список всех свойств товара
 *     tags: [Product Properties]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Список свойств товара
 */
router.get(
  '/:productId([0-9]+)/property/getall',
  ProductPropController.getAllProdProp,
);
// обновить свойство товара
/**
 * @swagger
 * /product/{productId}/property/update/{id}:
 *   put:
 *     summary: Обновить свойство товара (требуются права администратора)
 *     tags: [Product Properties]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
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
// удалить свойство товара
/**
 * @swagger
 * /product/{productId}/property/delete/{id}:
 *   delete:
 *     summary: Удалить свойство товара (требуются права администратора)
 *     tags: [Product Properties]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID товара
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
