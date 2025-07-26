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
    const response = await handleRequest(
      () => authInstance.get<CheckRes>("auth/check"),
      "Auth/Check"
    );
    return { isValid: response.success, user: response.data?.user };
  },

  /**
   * Обновление Токена Пользователя
   */
  async refresh(): Promise<Token> {
    const response = await handleRequest(
      () => authInstance.post<RefreshRes>("auth/refresh"),
      "Auth/Refresh"
    );
    if (!response.data?.tokenAccess) {
      throw new ApiError(401, "Невалидный токен", "INVALID_TOKEN");
    }
    return response?.data;
  },

  /**
   * Выход Пользователя
   * удал. tokenRefresh в БД
   * удал. tokenRefresh из cookie
   * удал. tokenAccess из LS
   */
  async logout(): Promise<void> {
    await handleRequest(
      () => authInstance.post<AuthRes>("auth/logout"),
      "Auth/Logout"
    );
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
