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
router.use('/user', user);
router.use('/category', category);
router.use('/brand', brand);
router.use('/product', product);
router.use('/order', order);
router.use('/basket', basket);
router.use('/rating', rating);

export default router;
