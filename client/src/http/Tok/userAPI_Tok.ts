// ^ HTTP-запросы на сервер для работы с пользователями
import jwt_decode from "jwt-decode";

import { guestInstance, authInstance } from "./indexAPI_Tok";

// любой Пользователь
// регистр. Пользователя
export const signupUser = async (email: string, password: string | any) => {
  try {
    const response = await guestInstance.post("user/signup", {
      email,
      password,
    });
    console.log("user_API sign response : ", response);

    const status = response.status;

    let userTokenAcs: any = "";
    if (response.data.tokens) {
      const tokenAcs = response.data.tokens; /* .accessToken */
      userTokenAcs = jwt_decode(tokenAcs);
      localStorage.setItem("tokenAccess", tokenAcs);
    }

    const data = { userTokenAcs, status };
    console.log("user_API sign data : ", data);
    return data;
  } catch (e: any) {
    const status = e.response.status;
    const errors = e?.response.data.errors;
    const message = e?.response.data.message;

    const data = { errors, message, status };
    return data;
  }
};
// вход Пользователя
export const loginUser = async (email: string, password: string | any) => {
  try {
    const response = await guestInstance.post("user/login", {
      email,
      password,
    });
    console.log("user_API login response : ", response);

    const status = response.status;

    let userTokenAcs: any = "";
    let activated: boolean = false;
    if (response.data.tokens) {
      const tokenAcs = response.data.tokens; /* .accessToken */
      userTokenAcs = jwt_decode(tokenAcs);
      localStorage.setItem("tokenAccess", tokenAcs);
      activated = response.data.activated;
    }

    const data = { userTokenAcs, status, activated };
    console.log("user_API login data : ", data);
    return data;
  } catch (e: any) {
    const status = e.response.status;
    const errors = e?.response.data.errors;
    const message = e?.response.data.message;

    const data = { errors, message, status };
    return data;
  }
};

// USER Пользователь
// activateUser ч/з ссылку в почте (отправка из БД в signupUser)
// refreshUser ч/з плохой ответ с БД (authInstance.interceptors.response в indexAPI)
// `проверить Пользователя`
export const checkUser = async () => {
  try {
    let userToken;
    userToken = localStorage.getItem("tokenAccess");

    // false е/и tokenAccess нет в LS
    if (!userToken) return false;

    // проверка tokenAccess на подлинность
    const response = await authInstance.get("user/check");

    // сохр.токен, расшифр.токен, подтверждение почты
    userToken = response.data.token;
    localStorage.setItem("tokenAccess", userToken);
    const userData = jwt_decode(userToken);
    const activated = response.data.activated;

    // возвращ.расшифр.токен и подтверждение почты
    console.log("user_API check userToken, userData : ", userToken, userData);
    return { userData, activated };
  } catch (e: any) {
    console.log("checkUser e : ", e);
    localStorage.removeItem("tokenAccess");
    return false;
  }
};
// `выход Пользователя`
export const logoutUser = () => {
  localStorage.removeItem("tokenAccess");
};

// ADMIN Пользователь
// createUser
// getOneUser
// getAllUser
// updateUser
// deleteUser
