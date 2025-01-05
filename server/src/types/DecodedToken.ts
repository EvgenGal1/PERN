export interface DecodedToken {
  id?: string;
  role?: string;
}

export interface CustomRequest extends Request {
  auth?: DecodedToken;
}
