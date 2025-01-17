import 'express';
import { AuthPayload } from './AuthPayload';
import { TokenDto } from './auth.interface';

declare module 'express' {
  export interface Request {
    auth?: AuthPayload; // строго типизировано
    // user: TokenDto;
  }
}
