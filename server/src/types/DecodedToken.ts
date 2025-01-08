export interface DecodedToken {
  id?: number; // мжт.отсутств.до валидации
  role?: string; // мжт.отсутств.до валидации
}

export interface CustomDecodedTokenRequest extends Request {
  auth?: DecodedToken;
}
