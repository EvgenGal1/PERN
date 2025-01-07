import express from 'express';

import authMiddleware from '../middleware/authMiddleware';
import RatingController from '../controllers/rating.controller';

const router = express.Router();

router.get('/product/:productId([0-9]+)', RatingController.getOneRating);
router.post(
  '/product/:productId([0-9]+)/rate/:rate([1-5])',
  authMiddleware,
  RatingController.createRating,
);

export default router;
