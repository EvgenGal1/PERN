// ^ настр.логики axios перехватов req/res
import axios from "axios";

// 1ый экземпляр req на сервер от любого посетителя
const guestInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// 2ый экземпляр req на сервер от авториз.посетителя
const authInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// добавляем в запрос данные для авторизации с помощью перехватчика (interceptor)
const authInterceptor = (config: any) => {
  // ! е/и тип - : { headers: { authorization: string; }; } - то ошб. - Типы свойства "headers" несовместимы. в authInstance.interceptors.request.use(authInterceptor)
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.authorization = "Bearer " + localStorage.getItem("token");
  }
  return config;
};
authInstance.interceptors.request.use(authInterceptor);

export { guestInstance, authInstance };
