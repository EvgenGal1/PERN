// ^ настр.axios
import axios from "axios";
import { response } from "express";
import { request } from "http";
import { config } from "process";
// const axios = require('axios');

// перем.:
export const API_URL = "http://localhost:5007/PERN/auth";
export const DEBUG = process.env.NODE_ENV === "development";

// экземпляр axios запр. СОЗД.
const api = axios.create({
  // авто.зацеп cookie + баз.url
  withCredentials: true,
  baseURL: API_URL,
  // interceptor`перехватчик`(раб.на кажд.res,req)
  // intrcep.req + header.autocapitalize.access.token
  // intrcep.res 200,401(>req на 2token,повтор res)
});

// перехватчики.req. На кажд.req + token из LS
api.interceptors.request.use(
  (config) => {
    // config.headers.genericKey = "someGenericValue";
    const accessToken = localStorage.getItem("tokenAccess");
    // присв.header с token сохр.в LS
    // config.headers.Authorization = `Bearer ${localStorage.getItem(
    //   "tokenAccess"
    // )}`;
    // if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    // config.headers.common = { Authorization: `Bearer ${accessToken}` };
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
