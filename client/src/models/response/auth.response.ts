import { IUser } from "../IUser";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  // указ.интерф. как тип
  user: IUser;
}
