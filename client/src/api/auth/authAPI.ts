// ^ HTTP-запросы для работы с пользователями (регистрация, авторизация, проверка токена)

import jwt_decode from "jwt-decode";

import { guestInstance, authInstance } from "../axiosInstances";
import { AuthRes, ErrorRes, IUser, TokenDto } from "../../types/api/auth.types";

// общ.обраб.ошб.
const handleApiError = (error: unknown): ErrorRes => {
  const axiosError = error as {
    response?: {
      status: number;
      data: { errors?: Record<string, unknown>; message?: string };
    };
  };
  return {
    status: axiosError.response?.status || 500,
    errors: axiosError.response?.data.errors,
    message: axiosError.response?.data.message || "Неизвестная ошибка",
  };
};

// Регистрация Пользователя
export const register = async (
  email: string,
  password: string
): Promise<TokenDto | ErrorRes> => {
  try {
    const response = await guestInstance.post<AuthRes>("auth/signup", {
      email,
      password,
    });
    const token = response.data?.data.accessToken;
    if (!token) throw new Error("Токен отсутствует в ответе сервера");

    const userData = jwt_decode(token) as TokenDto;
    localStorage.setItem("tokenAccess", token);

    return userData;
  } catch (error) {
    return handleApiError(error);
  }
};

// Авторизация Пользователя
export const login = async (
  email: string,
  password: string
): Promise<IUser | ErrorRes> => {
  try {
    const response = await guestInstance.post<AuthRes>("auth/login", {
      email,
      password,
    });
    const token = response.data?.data.accessToken;
    if (!token) throw new Error("Токен отсутствует в ответе сервера");

    const userData = jwt_decode(token) as TokenDto;
    localStorage.setItem("tokenAccess", token);

    return userData;
  } catch (error) {
    return handleApiError(error);
  }
};

// Проверка Токена Пользователя
export const check = async (): Promise<IUser | ErrorRes> => {
  try {
    const token = localStorage.getItem("tokenAccess");
    if (!token) throw new Error("Токен отсутствует");

    const response = await authInstance.get("auth/check");
    const newToken = response.data.accessToken;

    if (!newToken) throw new Error("Невалидный токен");

    const userData = jwt_decode(newToken) as TokenDto;
    localStorage.setItem("tokenAccess", newToken);

    return userData;
  } catch (error: unknown) {
    localStorage.removeItem("tokenAccess");
    return handleApiError(error);
  }
};

// Выход Пользователя
export const logout = (): void => {
  localStorage.removeItem("tokenAccess");
};
