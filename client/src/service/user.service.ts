import api from "../http/UTV/index_UTV-jwt";
import { AxiosResponse } from "axios";
import { IUser } from "../models/IUser";

export default class UserService {
  // ожидаем список польз.в массиве
  static fetchUser(): Promise<AxiosResponse<IUser[]>> {
    return api.get<IUser[]>("user/userPERN");
  }
}
