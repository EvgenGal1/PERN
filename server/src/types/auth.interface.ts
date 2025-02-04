import { UserProfile } from './user.interface';
import { RoleLevels } from './role.interface';

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
  roles: RoleLevels[];
  basket: number;
}

export interface AuthCombinedType extends Tokens {
  basketId: number;
  user: UserProfile;
  isActivated: boolean;
  roles: RoleLevels[];
}
