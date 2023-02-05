// ^ настр.axios
import axios from "axios";
import { response } from "express";
import { request } from "http";
import { config } from "process";
// const axios = require('axios');

// перем.:
export const API_URL = "http://localhost:5007/PERN/auth";
// export const DEBUG = process.env.NODE_ENV === "development";

// экземпляр axios запр. СОЗД.
const api = axios.create({
  // авто.зацеп cookie + баз.url
  withCredentials: true,
  baseURL: API_URL,
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

// перехватчики.res`ответ`. 200норм. 401ошб.(нет access)>req на обнов.с refresh>е/и валид.>2 token>aces сохр.в LS>нов.res

export default api;
