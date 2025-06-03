import { RoleLevels } from './role.interface';

export interface DecodedToken {
  id?: number; // мжт.отсутств.до валидации
  roles?: RoleLevels[]; // мжт.отсутств.до валидации
}

export interface CustomDecodedTokenRequest extends Request {
  auth?: DecodedToken;
}
