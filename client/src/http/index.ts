// ^ настр.axios
import axios from "axios";
import { AuthResponse } from "../models/response/auth.response";

// перем.:
export const API_URL = "http://localhost:5007/PERN"; // /auth
// export const DEBUG = process.env.NODE_ENV === "development";

// экземпляр axios запр. СОЗД.
const api = axios.create({
  // авто.зацеп cookie + баз.url
  withCredentials: true,
  baseURL: /* process.env. */ API_URL,
});

// interceptor`перехватчик`(раб.на кажд.res,req)
// перехватчики.req.`запрос` На кажд.req в header.authoriz + token из LS
api.interceptors.request.use(
  // парам.callback - config(с баз.полями)
  (config) => {
    const accessToken = localStorage.getItem("tokenAccess");
    // присв.header с token из.в LS
    // if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    // config.headers.common = { Authorization: `Bearer ${accessToken}` };}
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// перехватчики.res`ответ` на 401. 200норм. 401ошб.(нет access)>req на обнов.с refresh>е/и валид.>2 token>aces сохр.в LS>нов.res
// use приним.2парам. 1ый calback е/и всё ОК (возвращ.config), 2ой е/и ошб.
api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    // повтор исходного запроса после перезапис ACCESS (данн.для запроса) (е/и 401)
    const originalRequest = error.config;
    // е/и.статус код 401 приход 2 токен, перезапис ACCESS в LS. Доп.проверки config сущ., поле `повтора` не true
    if (error.status === 401 && error.config && !error.config._isRetry) {
      // `повтор` запроса. От повторных нов.вызовов.исход.запроса
      originalRequest._isRetry = true;
      try {
        const response = await axios.get<AuthResponse>(
          `${/* process.env. */ API_URL}/auth//refresh`,
          {
            withCredentials: true,
          }
        );
        localStorage.setItem("tokenAccess", response.data.tokens.accessToken);
        // в экземпляр перехватчика передаём вызов исход.запроса (данн.для запроса)
        return api.request(originalRequest);
      } catch (error) {
        console.log("CLT.ind.res error НЕ АВТОРИЗ. : " + error);
      }
    }
    // если if не отраб., ошб.переброс на верхн.уровень
    // return error;
    throw error;
  }
);

export default api;
