// ^ HTTP-запросы для работы с определёнными Пользователями (аутентификация, регистрация, авторизация, проверка токена и пр.)

import { jwtDecode } from "jwt-decode";

// перехватчики
import { guestInstance, authInstance } from "../axiosInstances";
// обраб.req/res
import { handleRequest } from "../handleRequest";
// общ.клс.ошб.
import { ApiError } from "@/utils/errorAPI";
// DTO/типы/интерфейсы
import type {
  AuthRes,
  CheckRes,
  LoginCredentials,
  RefreshRes,
  RegisterCredentials,
  Token,
} from "@/types/auth.types";
import type { User, UserProfile } from "@/types/user.types";
import { isErrorWithStatus } from "@/utils/errorObject";

export const authAPI = {
  /**
   * Регистрация Пользователя
   * @param email - Email Пользователя
   * @param password - Пароль
   */
  async register(credentials: RegisterCredentials): Promise<AuthRes> {
    return await handleRequest(
      () => guestInstance.post<AuthRes>("auth/register", credentials),
      "Auth/Register"
    );
  },

  /**
   * Авторизация Пользователя
   * @param email - Email Пользователя
   * @param password - Пароль
   */
  async login(credentials: LoginCredentials): Promise<AuthRes> {
    return await handleRequest(
      () => guestInstance.post<AuthRes>("auth/login", credentials),
      "Auth/Login"
    );
  },

  /**
   * Проверка Токена Пользователя
   */
  async check(): Promise<{ isValid: boolean; user?: User }> {
    try {
      const response = await handleRequest(
        () => authInstance.get<CheckRes>("auth/check"),
        "Auth/Check"
      );
      return { isValid: response.success, user: response.data?.user };
    } catch (error: unknown) {
      if (isErrorWithStatus(error, 401)) return { isValid: false };
      console.error("Ошибка Проверки Пользователя : ", error);
      throw error;
    }
  },

  /**
   * Обновление Токена Пользователя
   */
  async refresh(): Promise<Token> {
    try {
      const response = await handleRequest(
        () => authInstance.post<RefreshRes>("auth/refresh"),
        "Auth/Refresh"
      );
      if (!response.data?.tokenAccess) {
        throw new ApiError(401, "Невалидный токен", "INVALID_TOKEN");
      }
      return response?.data;
    } catch (error: unknown) {
      if (isErrorWithStatus(error, 401)) {
        // очистка данн.при неавториз.доступе
        localStorage.removeItem("tokenAccess");
        throw new ApiError(401, "Требуется авторизация", "UNAUTHORIZED");
      }
      throw error;
    }
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
      console.error("Ошибка при Выходе (возможно уже разлогинен):", error);
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

  /**
   * декодирование JWT Токена
   * @param token - JWT Токен
   * @returns данные Пользователя
   * @throws {ApiError} невалидном Токене
   */
  parseToken(token: string): UserProfile {
    try {
      return jwtDecode<UserProfile>(token);
    } catch (error: unknown) {
      throw new ApiError(401, "Невалидный токен", "INVALID_TOKEN", { error });
    }
  },
};
