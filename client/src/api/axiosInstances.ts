// ^ настр.логики перехватов axios/req/res

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { AuthRes } from "@/types/api/auth.types";

// Базовый URL API
const API_URL = process.env.REACT_APP_SRV_IURL;

// 1. `гостевой экземпляр` axios (неавториз.польз., отправ.cookie в кажд.req(refresh,basketId))
const guestInstance = axios.create({ baseURL: API_URL, withCredentials: true });

// 2. авторизованный экземпляр axios (провереные пользователи, отправ.cookie в кажд.req)
const authInstance = axios.create({ baseURL: API_URL, withCredentials: true });

// Перехватчик > добав.Токена в заголовки авториз.req
const authInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = localStorage.getItem("tokenAccess");
  if (token) config.headers.authorization = `Bearer ${token}`;
  return config;
};
// добав.Перехватчик > авториз.req
authInstance.interceptors.request.use(authInterceptor);

// Перехватчик > возврат.успех(cd-200-успех) / обраб.ошб.(401/нет access), обнов.Токена, повтор req
authInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // приведение(as)/расширение(&) типа нач.req > предовращ.повторных req
    const initialReq = error.config as InternalAxiosRequestConfig & {
      _isRetry?: boolean;
    };
    // ошб.401 и не повторный req (Токен обнов.в БД/сохр.в LS)
    if (error.response?.status === 401 && initialReq && !initialReq._isRetry) {
      // пометка > предовращ. повторных req
      initialReq._isRetry = true;
      try {
        // req обнов.Токена
        const response = await axios.post<AuthRes>(`${API_URL}/auth/refresh`, {
          withCredentials: true,
        });
        // сохр.нов. accessToken в LS
        localStorage.setItem("tokenAccess", response.data.data.accessToken);
        // ч/з экземпл.перехватчика повтор нач.req с нов.Токеном
        return authInstance.request(initialReq);
      } catch (error: unknown) {
        // console.error("Ошибка при обновлении токена:", error);
        // удал.Токена при неудаче
        localStorage.removeItem("tokenAccess");
        throw error;
      }
    }
    // проброс не авториз.ошб.дальше
    throw error;
  }
);
// экспорт.экземп.axios
export { guestInstance, authInstance };
