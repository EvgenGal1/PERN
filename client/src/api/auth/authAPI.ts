// ^ HTTP-запросы для работы с пользователями (регистрация, авторизация, проверка токена)

import jwt_decode from "jwt-decode";
import { AxiosError } from "axios";

// перехватчики
import { guestInstance, authInstance } from "../axiosInstances";
// DTO/типы/интерфейсы
import { AuthRes, IUser, TokenDto } from "../../types/api/auth.types";
// обраб.ошб.req/res
import { handlerApiErrors } from "../../utils/handlerApiErrors";

// Регистрация Пользователя
export const register = async (
  email: string,
  password: string
): Promise<TokenDto> => {
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
    throw handlerApiErrors(error as AxiosError);
  }
};

// Авторизация Пользователя
export const login = async (
  email: string,
  password: string
): Promise<IUser> => {
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
    throw handlerApiErrors(error as AxiosError);
  }
};

// Проверка Токена Пользователя
export const check = async (): Promise<IUser> => {
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
    throw handlerApiErrors(error as AxiosError);
  }
};

// Выход Пользователя
export const logout = (): void => {
  localStorage.removeItem("tokenAccess");
};
