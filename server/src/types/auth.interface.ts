import { UserProfile } from './user.interface';

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

export interface AuthCombinedType extends Tokens {
  basketId: number;
  user: UserProfile;
}
