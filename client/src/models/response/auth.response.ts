import { IUser } from "../IUser";
import { ITokens } from "../ITokens";

export interface AuthResponse {
  tokens: ITokens;
  // accessToken: string;
  // refreshToken: string;
  // указ.интерф. как тип
  user: IUser;
}
