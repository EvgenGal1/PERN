import { BrandData } from "../../types/api/catalog.types";
import { handleRequest } from "../handleRequest";
import { authInstance, guestInstance } from "../axiosInstances";

export const brandsAPI = {
  /**
   * Создание нового бренда
   * @param brand - Данные нового бренда
   */
  async createBrand(brand: string): Promise<BrandData> {
    return handleRequest(
      () => authInstance.post("brands/create", { name: brand }),
      "Brands/Create"
    );
  },

  /**
   * Получение одного бренда по ID
   * @param id - ID бренда
   */
  async getOneBrand(id: number): Promise<BrandData> {
    return handleRequest(
      () => guestInstance.get(`brands/getone/${id}`),
      "Brands/GetOne"
    );
  },

  /**
   * Получение всех брендов
   */
  async getAllBrands(): Promise<BrandData[]> {
    return handleRequest(
      () => guestInstance.get("brands/getall"),
      "Brands/GetAll"
    );
  },

  /**
   * Обновление бренда
   * @param id - ID бренда
   * @param brand - Новые данные бренда
   */
  async updateBrand(id: number, brand: string): Promise<BrandData> {
    return handleRequest(
      () => authInstance.put(`brands/update/${id}`, { name: brand }),
      "Brands/Update"
    );
  },

  /**
   * Удаление бренда
   * @param id - ID бренда
   */
  async deleteBrand(id: number): Promise<void> {
    return handleRequest(
      () => authInstance.delete(`brands/delete/${id}`),
      "Brands/Delete"
    );
  },
};
