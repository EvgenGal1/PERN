import 'express';
import { AuthPayload } from './AuthPayload';
import { GenerTokenDto } from './auth.interface';

declare module 'express' {
  export interface Request {
    auth?: AuthPayload; // строго типизировано
    // user: GenerTokenDto;
  }
}
