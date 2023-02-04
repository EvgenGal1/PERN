// ^ настр.axios
import axios from "axios";
import { response } from "express";
import { request } from "http";
import { config } from "process";
// const axios = require('axios');

// перем.:
export const API_URL = "https://localhost:5050";

// пример axios запр. СОЗД.
const $api = axios.create({
  // зацеп cookie авто.+баз.url
  withCredentials: true,
  baseURL: API_URL,
  // interceptor`перехватчик`(раб.на кажд.res,req)
  // intrcep.req + header.autocapitalize.access.token
  // intrcep.res 200,401(>req на 2token,повтор res)
});

// intrcep.req. На кажд.req+token
$api.interceptors.request.use((config) => {
  // присв.header с token сохр.в LS
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

export default $api;
