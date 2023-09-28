// ^ настр.логики axios перехватов req/res
import axios from "axios";

export interface AuthResponse {
  // tokens: ITokens;
  accessToken: string;
  refreshToken: string;
  // указ.интерф. как тип
  user: IUser;
}

export interface IUser {
  id: string;
  email: string;
  username: string;
  // role: string;
  isActivated: boolean;
}

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

// добавляем в запрос данные для авторизации с помощью перехватчика (interceptor)
const authInterceptor = (config: any) => {
  // ! е/и тип - : { headers: { authorization: string; }; } - то ошб. - Типы свойства "headers" несовместимы. в authInstance.interceptors.request.use(authInterceptor)
  const token = localStorage.getItem("tokenAccess");
  if (token) {
    config.headers.authorization =
      "Bearer " + localStorage.getItem("tokenAccess");
  }
  return config;
};
authInstance.interceptors.request.use(authInterceptor);

// перехватчики.res`ответ` на 401. 200норм. 401ошб.(нет access)>req на обнов.с refresh>е/и валид.>2 token>aces сохр.в LS>нов.res
// use приним.2парам. 1ый calback е/и всё ОК (возвращ.config), 2ой е/и ошб.
authInstance.interceptors.response.use(
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
          `${process.env.REACT_APP_API_URL_PERN}/user/refresh`,
          {
            withCredentials: true,
          }
        );
        localStorage.setItem("tokenAccess", response.data.accessToken);
        // в экземпляр перехватчика передаём вызов исход.запроса (данн.для запроса)
        return authInstance.request(originalRequest);
      } catch (error) {
        console.log("CLT.ind.res error НЕ АВТОРИЗ. : " + error);
      }
    }
    // если if не отраб., ошб.переброс на верхн.уровень
    // return error;
    throw error;
  }
);

export { guestInstance, authInstance };
