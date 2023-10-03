// ^ HTTP-запросы на сервер для работы с пользователями
import jwt_decode from "jwt-decode";

import { guestInstance, authInstance } from "./index_Tok";

// регистр. Пользователя
export const signupUser = async (email: string, password: string | any) => {
  try {
    const response = await guestInstance.post("user/signup", {
      email,
      password,
    });

    const status = response.status;

    let userTokenAcs: any = "";
    if (response.data.tokens) {
      const tokenAcs = response.data.tokens.accessToken;
      userTokenAcs = jwt_decode(tokenAcs);
      localStorage.setItem("tokenAccess", tokenAcs);
    }

    let data = { userTokenAcs, status };

    return data;
  } catch (e: any) {
    const status = e.response.status;
    const errors = e?.response.data.errors;
    const message = e?.response.data.message;

    let data = { errors, message, status };
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

    const status = response.status;

    let userTokenAcs: any = "";
    if (response.data.tokens) {
      const tokenAcs = response.data.tokens.accessToken;
      userTokenAcs = jwt_decode(tokenAcs);
      localStorage.setItem("tokenAccess", tokenAcs);
    }

    let data = { userTokenAcs, status };

    return data;
  } catch (e: any) {
    const status = e.response.status;
    const errors = e?.response.data.errors;
    const message = e?.response.data.message;

    let data = { errors, message, status };
    return data;
  }
};

// `проверить Пользователя`
export const checkUser = async () => {
  let userToken, userData;
  try {
    userToken = localStorage.getItem("tokenAccess");

    // false е/и tokenAccess нет в LS
    if (!userToken) return false;

    // проверка tokenAccess на подлинность
    const response = await authInstance.get("user/check");

    // сохр.токен, расшифр.токен, подтверждение почты
    userToken = response.data.token;
    localStorage.setItem("tokenAccess", userToken);
    userData = jwt_decode(userToken);
    let activLink = response.data.activationLink;

    // возвращ.расшифр.токен и подтверждение почты
    return { userData, activLink };
  } catch (e: any) {
    localStorage.removeItem("tokenAccess");
    return false;
  }
};

// `выход Пользователя`
export const logoutUser = () => {
  localStorage.removeItem("tokenAccess");
};
