// ^ HTTP-запросы для работы с определёнными Пользователями (аутентификация, регистрация, авторизация, проверка токена и пр.)

import { jwtDecode } from "jwt-decode";

// перехватчики
import { guestInstance, authInstance } from "../axiosInstances";
// обраб.req/res
import { handleRequest } from "../handleRequest";
// общ.клс.ошб.
import { ApiError } from "@/utils/errorAPI";
// DTO/типы/интерфейсы
import {
  AuthRes,
  CheckRes,
  IUser,
  TokenPayload,
  UserDataRes,
} from "@/types/api/auth.types";
import { isErrorWithStatus } from "@/utils/errorObject";

export const authAPI = {
  /**
   * обработка ответа Авторизации
   * @param response - ответ Сервера
   * @returns данные Пользователя
   */
  processAuthResponse(response: AuthRes): UserDataRes {
    const { tokenAccess, user, roles, basket, isActivated } = response.data;
    if (!tokenAccess) {
      throw new ApiError(401, "Токен отсутствует", "MISSING_TOKEN");
    }
    localStorage.setItem("tokenAccess", tokenAccess);
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: roles,
      basket,
      isActivated,
    };
  },

  /**
   * декодирование JWT Токена
   * @param token - JWT Токен
   * @returns данные Пользователя
   * @throws {ApiError} невалидном Токене
   */
  parseToken(token: string): TokenPayload {
    try {
      return jwtDecode<TokenPayload>(token);
    } catch (error: unknown) {
      throw new ApiError(401, "Невалидный токен", "INVALID_TOKEN", { error });
    }
  },

  /**
   * Регистрация Пользователя
   * @param email - Email Пользователя
   * @param password - Пароль
   */
  async register(email: string, password: string): Promise<TokenPayload> {
    const response = await handleRequest(
      () => guestInstance.post<AuthRes>("auth/register", { email, password }),
      "Auth/Register"
    );
    return this.processAuthResponse(response);
  },

  /**
   * Авторизация Пользователя
   * @param email - Email Пользователя
   * @param password - Пароль
   */
  async login(email: string, password: string): Promise<TokenPayload> {
    const response = await handleRequest(
      () => guestInstance.post<AuthRes>("auth/login", { email, password }),
      "Auth/Login"
    );
    return this.processAuthResponse(response);
  },

  /**
   * Проверка Токена Пользователя
   */
  async check(): Promise<{ isValid: boolean; userData?: IUser }> {
    try {
      const response = await handleRequest(
        () => authInstance.get<CheckRes>("auth/check"),
        "Auth/Check"
      );
      return { isValid: response.success, userData: response.data.user };
    } catch (error: unknown) {
      if (isErrorWithStatus(error, 401)) return { isValid: false };
      console.error("Ошибка Проверки Пользователя : ", error);
      throw error;
    }
  },

  /**
   * Обновление Токена Пользователя
   */
  async refresh(): Promise</* AuthRes */ any /* // ! типы настроить  */> {
    const response = await handleRequest(
      () => authInstance.post<AuthRes>("auth/refresh"),
      "Auth/Refresh"
    );
    return this.processAuthResponse(response);
  },

  /**
   * Выход Пользователя
   * удал. tokenRefresh в БД
   * удал. tokenRefresh из cookie
   * удал. tokenAccess из LS
   */
  async logout(): Promise<void> {
    try {
      await handleRequest(
        () => authInstance.post<AuthRes>("auth/logout"),
        "Auth/Logout"
      );
    } catch (error) {
      console.warn("Ошибка при Выходе (возможно уже разлогинен):", error);
    } finally {
      localStorage.removeItem("tokenAccess");
    }
  },

  /**
   * Активация Аккаунта по Ссылке
   * @param activationLink - Ссылка Активация
   */
  async activate(activationLink: string): Promise<void> {
    await handleRequest(
      () => guestInstance.get(`auth/activate/${activationLink}`),
      "Auth/Activate"
    );
  },

  /**
   * запрос Сброса Пароля
   * @param email - Email Пользователя
   */
  async requestPasswordReset(email: string): Promise<void> {
    await handleRequest(
      () => guestInstance.post("auth/reset-password", { email }),
      "Auth/requestPasswordReset"
    );
  },

  /**
   * подтверждение Сброса Пароля
   * @param token - Токен Сброса
   * @param newPassword - новый Пароль
   */
  async confirmPasswordReset(
    token: string,
    newPassword: string
  ): Promise<void> {
    await handleRequest(
      () => guestInstance.post(`auth/reset-password/${token}`, { newPassword }),
      "Auth/confirmPasswordReset"
    );
  },
};
