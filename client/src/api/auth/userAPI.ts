import { AxiosError } from "axios";

import { IUser } from "../../types/api/auth.types";
import { errorHandler } from "../../utils/errorHandler";
import { authInstance } from "../axiosInstances";

// Создание Пользователя
export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  try {
    const response = await authInstance.post<IUser>("auth/create", userData);
    return response.data;
  } catch (error) {
    throw errorHandler(error as AxiosError);
  }
};

// Получение одного Пользователя
export const getOneUser = async (id: number): Promise<IUser> => {
  try {
    const response = await authInstance.get<IUser>(`auth/${id}`);
    return response.data;
  } catch (error) {
    throw errorHandler(error as AxiosError);
  }
};

// Получение всех Пользователей
export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    const response = await authInstance.get<IUser[]>("users");
    return response.data;
  } catch (error) {
    throw errorHandler(error as AxiosError);
  }
};

// Обновление Пользователя
export const updateUser = async (
  id: number,
  userData: Partial<IUser>
): Promise<IUser> => {
  try {
    const response = await authInstance.put<IUser>(`auth/${id}`, userData);
    return response.data;
  } catch (error) {
    throw errorHandler(error as AxiosError);
  }
};

// Удаление Пользователя
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await authInstance.delete(`auth/${id}`);
  } catch (error) {
    throw errorHandler(error as AxiosError);
  }
};
