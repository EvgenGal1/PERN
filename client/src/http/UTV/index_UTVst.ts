import axios from "axios";

const /* $ */ host = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

const /* $ */ authHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

import { InternalAxiosRequestConfig } from "axios";

const authInterceptor = (config: InternalAxiosRequestConfig) => {
  if (!config.headers) {
    config.headers = new axios.AxiosHeaders();
  }
  config.headers.authorization = `Bearer ${localStorage.getItem(
    "tokenAccess"
  )}`;
  return config;
};

/* $ */ authHost.interceptors.request.use(authInterceptor);

export { /* $ */ host, /* $ */ authHost };
