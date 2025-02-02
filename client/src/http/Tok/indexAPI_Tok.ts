// ^ настр.логики перехватов axios/req/res

import axios, { InternalAxiosRequestConfig } from "axios";

import { AuthRes } from "../../types/api/ayth.types";

// 1ый экземпляр req на сервер от любого посетителя (`гостевой экземпляр`)
const guestInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL_PERN,
  // отправлять cookie с id корзины при http-запросах к серверу
  withCredentials: true,
});

// 2ый экземпляр req на сервер от авториз.посетителя
const authInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL_PERN,
  // отправлять cookie с id корзины при http-запросах к серверу
  withCredentials: true,
});

// добав.в req данн. > авторизации с помощью перехватчика (interceptor)
const authInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("tokenAccess");
  if (token) {
    config.headers.authorization =
      "Bearer " + localStorage.getItem("tokenAccess");
  }
  return config;
};
authInstance.interceptors.request.use(authInterceptor);

// перехватчик ответа. cb - 200 - config / error - 401 - (нет access) req обнов.с refresh - валид. - 2 token - aces сохр.в LS - нов.res
authInstance.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    console.log("ind API RES async ERR 000 : " + error);
    // повтор исходного запроса после перезапис ACCESS (данн.для запроса) (е/и 401)
    const originalRequest = error.config;
    // е/и.статус код 401 приход 2 токен, перезапис ACCESS в LS. Доп.проверки config сущ., поле `повтора` не true
    if (error.status === 401 && error.config && !error.config._isRetry) {
      // `повтор` запроса. От повторных нов.вызовов.исход.запроса
      originalRequest._isRetry = true;
      try {
        console.log("ind API RES IF 123 : " + 123);
        const response = await axios.get<AuthRes>(
          `${process.env.REACT_APP_API_URL_PERN}/auth/refresh`,
          {
            withCredentials: true,
          }
        );
        localStorage.setItem("tokenAccess", response.data.accessToken);
        // в экземпляр перехватчика передаём вызов исход.запроса (данн.для запроса)
        return authInstance.request(originalRequest);
      } catch (error) {
        console.log("ind API RES catch ERR : " + error);
      }
    }
    // если if не отраб., ошб.переброс на верхн.уровень
    // return error;
    console.log("ind_API RES  error : " + error);
    throw error;
  }
);

export { guestInstance, authInstance };
