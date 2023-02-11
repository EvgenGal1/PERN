import api from "../http";
import { AxiosResponse } from "axios";
import { IUser } from "../models/IUser";

export default class UserService {
  // ожидаем список польз.в массиве
  static fetchUser(): Promise<AxiosResponse<IUser[]>> {
    return api.get<IUser[]>("user/userPERN");
  }
}
