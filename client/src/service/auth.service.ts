import api from "../http";
import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/auth.response";
import { config } from "process";

export default class AuthService {
  static async login(
    email: string,
    username: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return api.post("/login", {
      email,
      username,
      password,
    });
  }

  static async registration(
    email: string,
    username: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return api.post<AuthResponse>("/registration", {
      email,
      username,
      password,
    });
  }

  static async logout(): Promise<void> {
    return api.post("/logout");
  }
}

// стат.fn для req на server
