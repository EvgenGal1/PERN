import { CategoryData } from "../../types/api/catalog.types";
import { handleRequest } from "../handleRequest";
import { authInstance, guestInstance } from "../axiosInstances";

export const categoryAPI = {
  /**
   * Создание новой Категории
   * @param category - данные новой Категории
   */
  async createCategory(name: string): Promise<CategoryData> {
    return handleRequest(
      () => authInstance.post("categories/create", { name }),
      "Categories/Create"
    );
  },

  /**
   * Получение Одной Категории по ID
   * @param id - ID Категории
   */
  async getOneCategory(id: number): Promise<CategoryData> {
    return handleRequest(
      () => guestInstance.get(`categories/getone/${id}`),
      "Categories/GetOne"
    );
  },

  /**
   * Получение Всех Категорий
   */
  async getAllCategories(): Promise<CategoryData[]> {
    return handleRequest(
      () => guestInstance.get("categories/getall"),
      "Categories/GetAll"
    );
  },

  /**
   * Обновление Категории
   * @param id - ID Категории
   * @param category - новые данные Категории
   */
  async updateCategory(id: number, name: string): Promise<CategoryData> {
    return handleRequest(
      () => authInstance.put(`categories/update/${id}`, { name }),
      "Categories/Update"
    );
  },

  /**
   * Удаление Категории
   * @param id - ID Категории
   */
  async deleteCategory(id: number): Promise<void> {
    return handleRequest(
      () => authInstance.delete(`categories/delete/${id}`),
      "Categories/Delete"
    );
  },
};
