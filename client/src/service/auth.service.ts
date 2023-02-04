import $api from "../http";
import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/auth.response";

export default class AuthService {
  static async registration(
    email: string,
    username: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>("/registration", {
      email,
      username,
      password,
    });
    // .then((res) => res.data.user.isActivated);
  }

  static async login(
    email: string,
    username: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    console.log("username a.S : " + username);
    return $api.post<AuthResponse>("/login", { email, username, password });
  }

  static async logout(): Promise<void> {
    return $api.post("/logout");
  }
}
// стат.fn для req на server
