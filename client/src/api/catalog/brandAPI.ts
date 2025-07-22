import { BrandData } from "@/types/catalog.types";
import { handleRequest } from "../handleRequest";
import { authInstance, guestInstance } from "../axiosInstances";

export const brandAPI = {
  /**
   * Создание Нового Бренда
   * @param brand - данные Нового Бренда
   */
  async createBrand(name: string): Promise<BrandData> {
    return handleRequest(
      () => authInstance.post<BrandData>("brands/create", { name }),
      "Brands/Create"
    );
  },

  /**
   * Получение Одного Бренда по ID
   * @param id - ID Бренда
   */
  async getOneBrand(id: number): Promise<BrandData> {
    return handleRequest(
      () => guestInstance.get<BrandData>(`brands/getone/${id}`),
      "Brands/GetOne"
    );
  },

  /**
   * Получение Всех Брендов
   */
  async getAllBrands(): Promise<BrandData[]> {
    return handleRequest(
      () => guestInstance.get<BrandData[]>("brands/getall"),
      "Brands/GetAll"
      // "brands" // кэш ключ
    );
  },

  /**
   * Обновление Бренда
   * @param id - ID Бренда
   * @param brand - Обновляемые данные Бренда
   */
  async updateBrand(id: number, name: string): Promise<BrandData> {
    return handleRequest(
      () => authInstance.put<BrandData>(`brands/update/${id}`, { name }),
      "Brands/Update"
    );
  },

  /**
   * Удаление Бренда
   * @param id - ID Бренда
   */
  async deleteBrand(id: number): Promise<void> {
    return handleRequest(
      () => authInstance.delete(`brands/delete/${id}`),
      "Brands/Delete"
    );
  },
};
