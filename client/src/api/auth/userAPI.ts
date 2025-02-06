import { IUser } from "../../types/api/auth.types";
import { authInstance } from "../axiosInstances";
import { handleRequest } from "../handleRequest";

export const userAPI = {
  /**
   * Создание Пользователя (Admin)
   */
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    return handleRequest(
      () => authInstance.post<IUser>("users/create", userData),
      "User/Create"
    ).then((response) => response);
  },

  /**
   * Получение Одного Пользователя
   * @param id - ID Пользователя
   */
  async getOneUser(id: number): Promise<IUser> {
    return handleRequest(
      () => authInstance.get<IUser>(`users/${id}`),
      "User/GetOne"
    ).then((response) => response);
  },

  /**
   * Получение Всех Пользователей (Admin)
   */
  async getAllUsers(): Promise<IUser[]> {
    return handleRequest(
      () => authInstance.get<IUser[]>("users"),
      "User/GetAll"
    ).then((response) => response);
  },

  /**
   * Обновление данных Пользователя
   * @param id - ID Пользователя
   * @param userData - новые данные
   */
  async updateUser(id: number, userData: Partial<IUser>): Promise<IUser> {
    return handleRequest(
      () => authInstance.put<IUser>(`users/${id}`, userData),
      "User/Update"
    ).then((response) => response);
  },

  /**
   * Удаление Пользователя
   * @param id - ID Пользователя
   */
  async deleteUser(id: number): Promise<void> {
    await handleRequest(
      () => authInstance.delete(`users/${id}`),
      "User/Delete"
    );
  },
};
