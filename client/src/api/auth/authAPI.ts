// ^ HTTP-запросы для работы с определёнными Пользователями (аутентификация, регистрация, авторизация, проверка токена и пр.)

import jwt_decode from "jwt-decode";

// перехватчики
import { guestInstance, authInstance } from "../axiosInstances";
// DTO/типы/интерфейсы
import { AuthRes, TokenPayload } from "../../types/api/auth.types";
// обраб.req/res
import { handleRequest } from "../handleRequest";

export const authAPI = {
  /**
   * Общая обработка успешного ответа аутентификации
   */
  processAuthResponse(response: AuthRes): TokenPayload {
    if (!response.data.accessToken) {
      throw Object.assign(new Error("Токен отсутствует"), {
        status: 401,
        code: "MISSING_TOKEN",
      });
    }

    const userData = this.parseToken(response.data.accessToken);
    localStorage.setItem("tokenAccess", response.data.accessToken);
    return userData;
  },

  /**
   * Парсинг JWT токена
   */
  parseToken(token: string): TokenPayload {
    try {
      return jwt_decode<TokenPayload>(token);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      throw Object.assign(new Error("Невалидный токен"), {
        status: 401,
        code: "INVALID_TOKEN",
      });
    }
  },

  /**
   * Регистрация Пользователя
   * @param email - Email пользователя
   * @param password - Пароль
   */
  async register(email: string, password: string): Promise<TokenPayload> {
    const response = await handleRequest(
      () => guestInstance.post<AuthRes>("auth/signup", { email, password }),
      "Auth/Register"
    );
    return this.processAuthResponse(response);
  },

  /**
   * Авторизация пользователя
   * @param email - Email пользователя
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
  async check(): Promise<TokenPayload> {
    const response = await handleRequest(
      () => authInstance.get<AuthRes>("auth/check"),
      "Auth/Check"
    );
    return this.processAuthResponse(response);
  },

  /**
   * Обновление Токена Пользователя
   */
  async refresh(): Promise<TokenPayload> {
    const response = await handleRequest(
      () => authInstance.get<AuthRes>("auth/refresh"),
      "Auth/Refresh"
    );
    return this.processAuthResponse(response);
  },

  /**
   * Выход Пользователя
   */
  async logout(): Promise<void> {
    localStorage.removeItem("tokenAccess");
    await handleRequest(() => authInstance.post("auth/logout"), "Auth/Logout");
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
