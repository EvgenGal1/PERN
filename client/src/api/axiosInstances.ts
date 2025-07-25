// ^ настр.логики перехватов axios/req/res

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { deleteCookie, getCookie } from "@/utils/cookies";

// Базовый URL API
const API_URL = process.env.REACT_APP_SRV_IURL;

// 1. `гостевой экземпляр` axios (неавториз.польз., отправ.cookie в кажд.req ч/з withCredentials)
const guestInstance = axios.create({ baseURL: API_URL, withCredentials: true });

// 2. авторизованный экземпляр axios (провереные пользователи, отправ.cookie в кажд.req)
const authInstance = axios.create({ baseURL: API_URL, withCredentials: true });

// настр.Перехватчика > добав.Токена в заголовки авториз.req
const authInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = localStorage.getItem("tokenAccess");
  if (token) config.headers.authorization = `Bearer ${token}`;
  return config;
};
// в Перехватчик REQ + настр.headers > авториз.req
authInstance.interceptors.request.use(authInterceptor);

// Перехватчик RES > возврат.успех(cd-200-успех) / обраб.ошб.(401/проблемы с req/res.auth), обнов.Токена, повтор req
authInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // приведение(as)/расширение(&) типа нач.req > предовращ.повторных req
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _isRetry?: boolean;
    };
    // опред.req.auth
    const isAuthRequest = originalRequest.url?.startsWith("auth/");
    // пропуск.ВСЕ req.auth от бесконечных req/res // пропуск проверки.user и обнов.токена - originalRequest.url?.includes("auth/check") || + refresh
    if (isAuthRequest) return Promise.reject(error);

    // ошб.401 и не повторный req (Токен обнов.в БД/сохр.в LS)
    if (error.response?.status === 401 && !originalRequest._isRetry) {
      // пометка > предовращ. повторных req
      originalRequest._isRetry = true;

      try {
        // req.обнов.Токена ч/з guestInstance (без interceptor/header и без рекурс.req с authInstance, cookie автозацеп.ч/з withCredentials)
        const { data } = await guestInstance.post("auth/refresh", null, {
          headers: {
            "Content-Type": "application/json",
            // Явно передаем refreshToken из кук
            Cookie: `tokenRefresh=${getCookie("tokenRefresh")}`,
          },
        });
        // сохр.нов.Access Токен
        localStorage.setItem("tokenAccess", data.tokenAccess);
        // обнов.нов.Refresh Токен (откл. обнов.ч/з Backend.cookie)
        // setCookie('tokenRefresh', data.tokenRefresh, COOKIE_OPTIONS);
        // ч/з экземпл.перехватчика повтор нач.req с нов.Токеном
        return authInstance(originalRequest);
      } catch (error: unknown) {
        console.error("Ошибка при req.auth:", error);
        // при ошб.req.auth удал.все Токены и cookie, редирект на вход
        localStorage.removeItem("tokenAccess");
        deleteCookie("tokenRefresh");
        deleteCookie("basketId");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    // проброс не авториз.ошб.дальше
    return Promise.reject(error);
  }
);
// экспорт.экземп.axios
export { guestInstance, authInstance };
