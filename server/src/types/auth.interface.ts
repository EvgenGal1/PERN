import { BasketResponse } from './basket.interface';

export interface JwtToken {
  accessToken: string;
  refreshToken: string;
}

export interface Tokens {
  tokens: JwtToken;
}

export interface TokenDto {
  id: number;
  email: string;
  username: string;
  roles: string[];
  levels: number[];
  basket: number;
}

export interface JwtPayload {
  sub: string;
  username: string;
  roles: string[];
}

export interface Payload {
  userId: string;
  username: string;
  roles: string[];
}

export interface User {
  id: number;
  email: string;
  username: string;
  isActivated: boolean;
}

export interface Role {
  role: string;
  level: number;
}

export interface UserRoles {
  id: number;
  email: string;
  username: string;
  isActivated: boolean;
  roles?: string[];
  levels?: number[];
}

// объедин.три типа
export type AuthCombined =
  // Pick<BasketResponse, 'id'> // только 'id'
  // Omit<BasketResponse, 'products'> // кроме 'products'
  Tokens & {
    // нов.св-во basketId с тип.как BasketResponse.id
    basketId: BasketResponse['id'];
  } & Partial<User>; // необязат.

export interface AuthCombinedType extends Tokens {
  basketId: number;
  user: UserRoles;
}
