import { RatingData } from "@/types/api/catalog.types";
import { handleRequest } from "../handleRequest";
import { authInstance, guestInstance } from "../axiosInstances";

export const ratingAPI = {
  /**
   * Получение Рейтинга Продукта
   * @param productId - ID Продукта
   */
  async getProductRating(productId: number): Promise<RatingData> {
    return handleRequest(
      () => guestInstance.get<RatingData>(`ratings/product/${productId}`),
      "Ratings/GetProductRating"
    );
  },

  /**
   * Создание рейтинга Продукта
   * @param userId - ID Пользователя
   * @param productId - ID Продукта
   * @param rate - Оценка (1-5)
   */
  async createProductRating(
    userId: number | null,
    productId: number,
    rate: number
  ): Promise<RatingData> {
    return handleRequest(
      () =>
        authInstance.post<RatingData>(
          `ratings/product/${productId}/rate/${rate}`
        ),
      "Ratings/CreateProductRating"
    );
  },
};
