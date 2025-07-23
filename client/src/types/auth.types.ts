// типы Регистрации/Авторизации/Токенов

import { ApiResponse } from "./api.types";
import { User, UserProfile, RoleLevel } from "./user.types";

export type AuthResponse = Token & {
  user: UserProfile;
  basket: number;
  roles: RoleLevel[];
  isActivated: boolean;
};

export type AuthRes = ApiResponse<AuthResponse>;
export type CheckRes = ApiResponse<{ user: User }>;
export type RefreshRes = ApiResponse<Token>;

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = LoginCredentials & {
  username?: string;
};

export type Token = {
  tokenAccess: string;
};

export type TokenPayload = {
  id: number;
  email: string;
  username: string;
  roles: RoleLevel[];
  basket: number;
  isActivated: boolean;
  exp?: number;
};
