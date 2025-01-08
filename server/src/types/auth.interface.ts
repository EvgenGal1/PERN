import { BasketResponse } from './basket.interface';

export interface JwtToken {
  accessToken: string;
  refreshToken: string;
}

export interface Tokens {
  tokens: JwtToken;
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

// Тип для isActivated
export interface Activation {
  activated: boolean;
}

// объедин.три типа
export type AuthCombinedType =
  // Pick<BasketResponse, 'id'> // только 'id'
  // Omit<BasketResponse, 'products'> // кроме 'products'
  Tokens & {
    // нов.св-во basketId с тип.как BasketResponse.id
    basketId: BasketResponse['id'];
  } & Partial<Activation>; // необязат.
