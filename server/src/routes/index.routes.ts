// ^ Маршрутизатор всех маршрутов приложения (подобие allRoutes)

export {};

import express from 'express';

import auth from './auth.routes';
import user from './user.routes';
import product from './product.routes';
import order from './order.routes';
import category from './category.routes';
import brand from './brand.routes';
import basket from './basket.routes';
import rating from './rating.routes';

const router = express.Router();

router.use('/auth', auth);
router.use('/users', user);
router.use('/categories', category);
router.use('/brands', brand);
router.use('/products', product);
router.use('/orders', order);
router.use('/baskets', basket);
router.use('/ratings', rating);

export default router;
