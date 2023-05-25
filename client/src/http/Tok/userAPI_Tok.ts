// ^ HTTP-запросы на сервер для работы с пользователями
import jwt_decode from "jwt-decode";

import { guestInstance, authInstance } from "./index_Tok";

export const signup = async (email: string, password: string) => {
  console.log("CLT.userAPI signup : " + 1);
  try {
    console.log("CLT.userAPI signup try : " + 2);
    const response = await guestInstance.post("user/signup", {
      email,
      password,
      // role: "USER",
    });
    console.log("CLT.userAPI signup response : " + response);
    const token = response.data.token;
    console.log("CLT.userAPI signup token: " + token);
    const user = jwt_decode(token);
    localStorage.setItem("token", token);
    return user;
  } catch (e: any) {
    console.log("CLT.userAPI signup catch : " + 3);
    console.log("CLT.userAPI signup catch e : " + e);
    alert(e?.response?.data?.message);
    return false;
  }
};

export const login = async (email: string, password: string) => {
  console.log("CLT.userAPI login : " + 1);
  try {
    console.log("CLT.userAPI login try : " + 2);
    const response = await guestInstance.post("user/login", {
      email,
      password,
    });
    const token = response.data.token;
    const user = jwt_decode(token);
    localStorage.setItem("token", token);
    return user;
  } catch (e: any) {
    console.log("CLT.userAPI login catch : " + 3);
    console.log("CLT.userAPI login catch e : " + e);
    alert(e?.response?.data?.message);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const check = async () => {
  console.log("CLT.userAPI check : " + 1);
  let userToken, userData;
  try {
    let userToken = localStorage.getItem("token");
    // если в хранилище нет действительного токена
    if (!userToken) {
      return false;
    }
    // токен есть, надо проверить его подлинность
    const /* response */ { data } = await authInstance.get("user/check");
    /* userToken = response.data.token
        userData = jwt_decode(userToken) */
    localStorage.setItem("token", /* userToken */ data.token);
    return /* userData */ jwt_decode(data.token);
  } catch (e: any) {
    localStorage.removeItem("token");
    return false;
  }
};
