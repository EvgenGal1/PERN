import { BasketData } from "../../types/api/shopping.types";
import { guestInstance } from "../axiosInstances";
import { handleRequest } from "../handleRequest";

export const basketAPI = {
  /**
   * Получение Корзины из cookies
   */
  async getOneBasket(): Promise<BasketData> {
    return handleRequest(
      () => guestInstance.get<BasketData>("baskets/getone"),
      "Basket/FetchBasket"
    );
  },

  /**
   * Добавить Продукты в Корзину
   */
  async appendBasket(productId: number): Promise<BasketData> {
    return handleRequest(
      () =>
        guestInstance.put<BasketData>(`baskets/product/${productId}/append/1`),
      "Basket/AppendBasket"
    );
  },

  /**
   * Увеличить количество Продуктов в Корзине
   */
  async incrementBasket(productId: number): Promise<BasketData> {
    return handleRequest(
      () =>
        guestInstance.put<BasketData>(
          `baskets/product/${productId}/increment/1`
        ),
      "Basket/IncrementBasket"
    );
  },

  /**
   * Уменьшить количество Продуктов в Корзине
   */
  async decrementBasket(productId: number): Promise<BasketData> {
    return handleRequest(
      () =>
        guestInstance.put<BasketData>(
          `baskets/product/${productId}/decrement/1`
        ),
      "Basket/DecrementBasket"
    );
  },

  /**
   * Удалить Продукт из Корзины
   */
  async removeBasket(productId: number): Promise<BasketData> {
    return handleRequest(
      () => guestInstance.put(`baskets/product/${productId}/remove`),
      "Basket/RemoveBasket"
    );
  },

  /**
   * Очистить Корзину от Всех Продуктов
   */
  async clearBasket(): Promise<void> {
    return handleRequest(
      () => guestInstance.put(`baskets/clear`),
      "Basket/ClearBasket"
    );
  },

  /**
   * Удалить Корзину и Все Продукты
   */
  async deleteBasket(): Promise<void> {
    return handleRequest(
      () => guestInstance.put(`baskets/delete`),
      "Basket/DeleteBasket"
    );
  },
};

// Интерфейсы
