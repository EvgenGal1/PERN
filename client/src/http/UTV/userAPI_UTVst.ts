import { /* $ */ authHost, /* $ */ host } from "./index_UTVst";
import jwt_decode from "jwt-decode";

export const registration = async (email: string, password: string) => {
  const { data } = await /* $ */ host.post("api/user/registration", {
    email,
    password,
    role: "ADMIN",
  });
  localStorage.setItem("tokenAccess", data.token);
  return jwt_decode(data.token);
};

export const login = async (email: string, password: string) => {
  const { data } = await /* $ */ host.post("api/user/login", {
    email,
    password,
  });
  localStorage.setItem("tokenAccess", data.token);
  return jwt_decode(data.token);
};

export const check = async () => {
  const { data } = await /* $ */ authHost.get("api/user/auth");
  localStorage.setItem("tokenAccess", data.token);
  return jwt_decode(data.token);
};
