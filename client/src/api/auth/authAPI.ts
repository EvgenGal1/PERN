// ^ HTTP-запросы для работы с определёнными Пользователями (аутентификация, регистрация, авторизация, проверка токена и пр.)

import { jwtDecode } from "jwt-decode";

// перехватчики
import { guestInstance, authInstance } from "../axiosInstances";
// обраб.req/res
import { handleRequest } from "../handleRequest";
// общ.клс.ошб.
import { ApiError } from "@/utils/errorClasses";
// DTO/типы/интерфейсы
import { AuthRes, TokenPayload, UserResData } from "@/types/api/auth.types";

export const authAPI = {
  /**
   * обработка ответа Авторизации
   * @param response - ответ Сервера
   * @returns данные Пользователя
   */
  processAuthResponse(response: AuthRes): UserResData {
    const {
      tokenAccess,
      user: userData,
      roles,
      basket,
      isActivated,
    } = response.data;
    if (!tokenAccess) {
      throw new ApiError("Токен отсутствует", 401, "MISSING_TOKEN");
    }
    localStorage.setItem("tokenAccess", tokenAccess);
    const userDataPars = this.parseToken(tokenAccess);
    return {
      id: userDataPars.id,
      email: userDataPars.email,
      username: userDataPars.username || "",
      roles: userDataPars.roles,
      basket,
      isActivated,
    };
  },

  /**
   * декодирование JWT Токена
   * @param token - JWT Токен
   * @returns данные Пользователя
   */
  parseToken(token: string): UserResData {
    try {
      return jwtDecode<UserResData>(token);
    } catch (error: unknown) {
      throw new ApiError("Невалидный токен", 401, "INVALID_TOKEN", { error });
    }
  },

  /**
   * Регистрация Пользователя
   * @param email - Email Пользователя
   * @param password - Пароль
   */
  async register(email: string, password: string): Promise<TokenPayload> {
    try {
      const response = await handleRequest(
        () => guestInstance.post<AuthRes>("auth/register", { email, password }),
        "Auth/Register"
      );
      return this.processAuthResponse(response);
    } catch (error) {
      console.error("Ошибка Регистрация Пользователя : ", error);
      throw error;
    }
  },

  /**
   * Авторизация Пользователя
   * @param email - Email Пользователя
   * @param password - Пароль
   */
  async login(email: string, password: string): Promise<TokenPayload> {
    try {
      const response = await handleRequest(
        () => guestInstance.post<AuthRes>("auth/login", { email, password }),
        "Auth/Login"
      );
      return this.processAuthResponse(response);
    } catch (error) {
      console.error("Ошибка Авторизация Пользователя : ", error);
      throw error;
    }
  },

  /**
   * Проверка Токена Пользователя
   */
  async check(): Promise<{ userData: TokenPayload; activated: boolean }> {
    const response = await handleRequest(
      () => authInstance.get<AuthRes>("auth/check"),
      "Auth/Check"
    );
    const token = this.processAuthResponse(response);
    return {
      userData: token,
      activated: response.data.isActivated!,
    };
  },

  /**
   * Обновление Токена Пользователя
   */
  async refresh(): Promise<TokenPayload> {
    try {
      const response = await handleRequest(
        () => authInstance.post<AuthRes>("auth/refresh"),
        "Auth/Refresh"
      );
      return this.processAuthResponse(response);
    } catch (error) {
      console.error("Ошибка обновления Токена : ", error);
      throw error;
    }
  },

  /**
   * Выход Пользователя
   * удал. tokenRefresh в БД
   * удал. tokenRefresh и BasketId из cookie
   * удал. tokenAccess из LS
   */
  async logout(): Promise<void> {
    try {
      await handleRequest(
        () => authInstance.post<AuthRes>("auth/logout"),
        "Auth/Logout"
      );
      localStorage.removeItem("tokenAccess");
    } catch (error) {
      console.error("Ошибка при Выходе : ", error);
      throw error;
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
