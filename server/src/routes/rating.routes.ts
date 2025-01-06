import express /* , { Application } */ from "express";
const router /* : Application */ = express();

import authMiddleware from "../middleware/authMiddleware";
import RatingController from "../controllers/rating.controller";

router.get("/product/:productId([0-9]+)", RatingController.getOneRating);
router.post(
  "/product/:productId([0-9]+)/rate/:rate([1-5])",
  authMiddleware,
  RatingController.createRating
);

export default router;
