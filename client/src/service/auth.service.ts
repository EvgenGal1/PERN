import api from "../http";
// axios всегда возвращ.объ. Данн.хран.в date. Для указ.типа данн.
import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/auth.response";

export default class AuthService {
  // стат.fn для request на server
  static async registration(
    username: string,
    email: string,
    password: string
  ): // асинхр.fn всегда возвращ.`Обещание`<для указ.тип данн.отв.<дженр указ.возвр.тип/данн.>>
  Promise<AxiosResponse<AuthResponse>> {
    // экземпляр axios запр.post<дженр тип.данн.>(адрес,тело)
    return api.post<AuthResponse>("/auth/registration", {
      email,
      username,
      password,
    });
    // .then((response) => {response.data.user. с дженр есть(id,email,username,isActivated)}) ;
  }

  static async login(
    username: string,
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return api.post<AuthResponse>("/auth/login", {
      email,
      username,
      password,
    });
  }

  static async logout(): Promise<void> {
    return api.post("/auth/logout");
  }
}
